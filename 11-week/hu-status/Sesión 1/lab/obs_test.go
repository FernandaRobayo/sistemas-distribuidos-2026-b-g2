package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
)

type safeBuf struct {
	mu sync.Mutex
	b  bytes.Buffer
}

func (s *safeBuf) Write(p []byte) (int, error) { s.mu.Lock(); defer s.mu.Unlock(); return s.b.Write(p) }
func (s *safeBuf) String() string              { s.mu.Lock(); defer s.mu.Unlock(); return s.b.String() }

func get(t *testing.T, url string, hdr map[string]string) (*http.Response, string) {
	t.Helper()
	req, _ := http.NewRequest("GET", url, nil)
	for k, v := range hdr {
		req.Header.Set(k, v)
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	b, _ := io.ReadAll(resp.Body)
	resp.Body.Close()
	return resp, string(b)
}

func logsOf(buf *safeBuf, trace string) (n int, services map[string]bool) {
	services = map[string]bool{}
	for _, l := range strings.Split(buf.String(), "\n") {
		var m map[string]any
		if json.Unmarshal([]byte(l), &m) != nil {
			continue
		}
		if m["trace_id"] == trace {
			n++
			services[m["service"].(string)] = true
		}
	}
	return
}

func checkTree(t *testing.T, sp []Span, want int) {
	t.Helper()
	if len(sp) != want {
		t.Fatalf("expected %d spans, got %d", want, len(sp))
	}
	byID := map[string]Span{}
	roots := 0
	for _, s := range sp {
		byID[s.SpanID] = s
	}
	for _, s := range sp {
		if s.ParentID == "" {
			roots++
		} else if _, ok := byID[s.ParentID]; !ok {
			t.Fatalf("span %s has unknown parent %s", s.Name, s.ParentID)
		}
	}
	if roots != 1 {
		t.Fatalf("expected a single root, got %d", roots)
	}
}

func TestTraceIdPropagatesAcrossThreeServices(t *testing.T) {
	buf := &safeBuf{}
	st, err := Start(buf)
	if err != nil {
		t.Fatal(err)
	}
	defer st.Stop()
	resp, _ := get(t, st.GatewayURL+"/api/reservations/R-1", map[string]string{"X-Correlation-Id": "demo-trace-1"})
	if resp.StatusCode != 200 || resp.Header.Get("X-Correlation-Id") != "demo-trace-1" {
		t.Fatalf("status %d, header %q", resp.StatusCode, resp.Header.Get("X-Correlation-Id"))
	}
	n, svcs := logsOf(buf, "demo-trace-1")
	if len(svcs) != 3 || n < 6 {
		t.Fatalf("logs with trace_id: %d lines in %v", n, svcs)
	}
	checkTree(t, st.Spans.ByTrace("demo-trace-1"), 5) // 3 server + 2 client, also without W3C-shaped ids
}

func TestSpansFormOneTreeWithW3CTraceparent(t *testing.T) {
	st, _ := Start(&safeBuf{})
	defer st.Stop()
	id := strings.Repeat("ab", 16)
	get(t, st.GatewayURL+"/api/reservations/R-2", map[string]string{"X-Correlation-Id": id})
	checkTree(t, st.Spans.ByTrace(id), 5)
}

func TestGeneratesTraceIdWhenMissingAndReturnsIt(t *testing.T) {
	st, _ := Start(&safeBuf{})
	defer st.Stop()
	resp, _ := get(t, st.GatewayURL+"/api/reservations/R-3", nil)
	if id := resp.Header.Get("X-Correlation-Id"); len(id) != 32 {
		t.Fatalf("generated id %q", id)
	}
}

func TestMetricsRateErrorsLatency(t *testing.T) {
	st, _ := Start(&safeBuf{})
	defer st.Stop()
	get(t, st.GatewayURL+"/api/reservations/R-4", nil)
	get(t, st.GatewayURL+"/api/reservations/R-5?fail=1", nil)
	_, m := get(t, st.GatewayURL+"/metrics", nil)
	for _, want := range []string{
		`http_requests_total{service="gateway",method="GET",route="/api/reservations/{id}",status="200"} 1`,
		`http_requests_total{service="gateway",method="GET",route="/api/reservations/{id}",status="502"} 1`,
		`http_request_duration_seconds_count{service="gateway",method="GET",route="/api/reservations/{id}"} 2`,
		`le="+Inf"`,
	} {
		if !strings.Contains(m, want) {
			t.Fatalf("metrics missing %q in:\n%s", want, m)
		}
	}
}

func TestTraceShowsTheSlowHop(t *testing.T) {
	st, _ := Start(&safeBuf{})
	defer st.Stop()
	id := "slow-case-1"
	get(t, st.GatewayURL+"/api/reservations/R-6?delay_ms=150", map[string]string{"X-Correlation-Id": id})
	var slow Span
	for _, s := range st.Spans.ByTrace(id) {
		if s.Kind == "server" && s.Service == "security" {
			slow = s
		}
	}
	if slow.DurationMs < 150 {
		t.Fatalf("security span %.1fms", slow.DurationMs)
	}
}

// TestWriteEvidence regenerates ../Evidencias when LAB_EVIDENCE=1 (used by ejecutar.ps1).
func TestWriteEvidence(t *testing.T) {
	if os.Getenv("LAB_EVIDENCE") != "1" {
		t.Skip("set LAB_EVIDENCE=1")
	}
	dir := filepath.Join("..", "Evidencias")
	_ = os.MkdirAll(dir, 0o755)
	logs, _ := os.Create(filepath.Join(dir, "logs.jsonl"))
	defer logs.Close()
	st, _ := Start(logs)
	defer st.Stop()
	get(t, st.GatewayURL+"/api/reservations/R-100", map[string]string{"X-Correlation-Id": "trace-ok-0001"})
	get(t, st.GatewayURL+"/api/reservations/R-101?delay_ms=180", map[string]string{"X-Correlation-Id": "trace-lento-0002"})
	get(t, st.GatewayURL+"/api/reservations/R-102?fail=1", map[string]string{"X-Correlation-Id": "trace-error-0003"})
	_ = os.WriteFile(filepath.Join(dir, "spans.jsonl"), []byte(st.Spans.JSONL()), 0o644)
	for _, s := range []*Service{st.Gateway, st.Reservations, st.Security} {
		_ = os.WriteFile(filepath.Join(dir, "metrics-"+s.Name+".txt"), []byte(s.Metrics.Expose()), 0o644)
	}
}
