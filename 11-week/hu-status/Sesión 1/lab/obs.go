// Package main is a self-contained lab for week 11 / session 1: three small HTTP
// services (gateway, reservations, security) instrumented with the three pillars:
// structured logs with a propagated trace_id, RED metrics and distributed spans.
// It uses only the standard library so it runs offline and does not touch product repos.
package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"regexp"
	"sort"
	"strings"
	"sync"
	"time"
)

const correlationHeader = "X-Correlation-Id" // same contract as the product (constitution)

var (
	safeID      = regexp.MustCompile(`^[A-Za-z0-9._-]{1,128}$`)
	traceparent = regexp.MustCompile(`^00-([0-9a-f]{32})-([0-9a-f]{16})-0[01]$`)
	hex32       = regexp.MustCompile(`^[0-9a-f]{32}$`)
	hex16       = regexp.MustCompile(`^[0-9a-f]{16}$`)
)

func randHex(n int) string {
	b := make([]byte, n)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

type ctxKey struct{}

type spanCtx struct{ traceID, spanID string }

func from(ctx context.Context) spanCtx { v, _ := ctx.Value(ctxKey{}).(spanCtx); return v }

// ---------- Pillar 1: structured logs ----------

type logHandler struct{ slog.Handler }

// Handle adds trace_id and span_id to every line logged with a context that carries them.
func (h logHandler) Handle(ctx context.Context, r slog.Record) error {
	if sc := from(ctx); sc.traceID != "" {
		r.AddAttrs(slog.String("trace_id", sc.traceID), slog.String("span_id", sc.spanID))
	}
	return h.Handler.Handle(ctx, r)
}
func (h logHandler) WithAttrs(a []slog.Attr) slog.Handler { return logHandler{h.Handler.WithAttrs(a)} }
func (h logHandler) WithGroup(n string) slog.Handler      { return logHandler{h.Handler.WithGroup(n)} }

func newLogger(w io.Writer, service string) *slog.Logger {
	base := slog.NewJSONHandler(w, &slog.HandlerOptions{ReplaceAttr: func(_ []string, a slog.Attr) slog.Attr {
		switch a.Key {
		case slog.TimeKey:
			a.Key = "timestamp"
		case slog.MessageKey:
			a.Key = "message"
		}
		return a
	}})
	return slog.New(logHandler{base}).With("service", service)
}

// ---------- Pillar 2: RED metrics ----------

var buckets = []float64{0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5}

type histo struct {
	counts []uint64
	sum    float64
	n      uint64
}

type Metrics struct {
	mu       sync.Mutex
	service  string
	requests map[string]uint64 // method|route|status
	duration map[string]*histo // method|route
}

func newMetrics(service string) *Metrics {
	return &Metrics{service: service, requests: map[string]uint64{}, duration: map[string]*histo{}}
}

func (m *Metrics) observe(method, route string, status int, d time.Duration) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.requests[fmt.Sprintf("%s|%s|%d", method, route, status)]++
	k := method + "|" + route
	h := m.duration[k]
	if h == nil {
		h = &histo{counts: make([]uint64, len(buckets))}
		m.duration[k] = h
	}
	s := d.Seconds()
	for i, b := range buckets {
		if s <= b {
			h.counts[i]++
		}
	}
	h.sum += s
	h.n++
}

// Expose renders the Prometheus text format (GET /metrics).
func (m *Metrics) Expose() string {
	m.mu.Lock()
	defer m.mu.Unlock()
	var sb strings.Builder
	sb.WriteString("# HELP http_requests_total Total HTTP requests\n# TYPE http_requests_total counter\n")
	keys := make([]string, 0, len(m.requests))
	for k := range m.requests {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	for _, k := range keys {
		p := strings.Split(k, "|")
		fmt.Fprintf(&sb, "http_requests_total{service=%q,method=%q,route=%q,status=%q} %d\n", m.service, p[0], p[1], p[2], m.requests[k])
	}
	sb.WriteString("# HELP http_request_duration_seconds HTTP request duration\n# TYPE http_request_duration_seconds histogram\n")
	dk := make([]string, 0, len(m.duration))
	for k := range m.duration {
		dk = append(dk, k)
	}
	sort.Strings(dk)
	for _, k := range dk {
		p, h := strings.Split(k, "|"), m.duration[k]
		for i, b := range buckets {
			fmt.Fprintf(&sb, "http_request_duration_seconds_bucket{service=%q,method=%q,route=%q,le=\"%g\"} %d\n", m.service, p[0], p[1], b, h.counts[i])
		}
		fmt.Fprintf(&sb, "http_request_duration_seconds_bucket{service=%q,method=%q,route=%q,le=\"+Inf\"} %d\n", m.service, p[0], p[1], h.n)
		fmt.Fprintf(&sb, "http_request_duration_seconds_sum{service=%q,method=%q,route=%q} %g\n", m.service, p[0], p[1], h.sum)
		fmt.Fprintf(&sb, "http_request_duration_seconds_count{service=%q,method=%q,route=%q} %d\n", m.service, p[0], p[1], h.n)
	}
	return sb.String()
}

// ---------- Pillar 3: distributed spans ----------

type Span struct {
	TraceID    string  `json:"trace_id"`
	SpanID     string  `json:"span_id"`
	ParentID   string  `json:"parent_span_id,omitempty"`
	Service    string  `json:"service"`
	Name       string  `json:"name"`
	Kind       string  `json:"kind"`
	StartedAt  string  `json:"started_at"`
	DurationMs float64 `json:"duration_ms"`
	Status     int     `json:"status,omitempty"`
}

type SpanStore struct {
	mu    sync.Mutex
	spans []Span
}

func (s *SpanStore) add(sp Span) { s.mu.Lock(); s.spans = append(s.spans, sp); s.mu.Unlock() }
func (s *SpanStore) ByTrace(id string) []Span {
	s.mu.Lock()
	defer s.mu.Unlock()
	var out []Span
	for _, sp := range s.spans {
		if sp.TraceID == id {
			out = append(out, sp)
		}
	}
	return out
}
func (s *SpanStore) JSONL() string {
	s.mu.Lock()
	defer s.mu.Unlock()
	var sb strings.Builder
	for _, sp := range s.spans {
		b, _ := json.Marshal(sp)
		sb.Write(b)
		sb.WriteByte('\n')
	}
	return sb.String()
}

// ---------- Service wiring ----------

type Service struct {
	Name    string
	Log     *slog.Logger
	Metrics *Metrics
	Spans   *SpanStore
	Mux     *http.ServeMux
	Client  *http.Client
}

func NewService(name string, logs io.Writer, spans *SpanStore) *Service {
	return &Service{Name: name, Log: newLogger(logs, name), Metrics: newMetrics(name), Spans: spans,
		Mux: http.NewServeMux(), Client: &http.Client{Timeout: 3 * time.Second}}
}

type statusWriter struct {
	http.ResponseWriter
	status int
}

func (w *statusWriter) WriteHeader(c int) { w.status = c; w.ResponseWriter.WriteHeader(c) }

// Handler wraps the mux: it extracts or creates the trace, logs, measures and records the server span.
func (s *Service) Handler() http.Handler {
	s.Mux.HandleFunc("GET /metrics", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "text/plain; version=0.0.4")
		_, _ = io.WriteString(w, s.Metrics.Expose())
	})
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		traceID, parent := "", ""
		if m := traceparent.FindStringSubmatch(r.Header.Get("traceparent")); m != nil {
			traceID, parent = m[1], m[2]
		} else if id := r.Header.Get(correlationHeader); safeID.MatchString(id) {
			traceID = id
			if p := r.Header.Get("X-Parent-Span-Id"); hex16.MatchString(p) { // correlation ids that are not W3C-shaped
				parent = p
			}
		} else {
			traceID = randHex(16)
		}
		sc := spanCtx{traceID: traceID, spanID: randHex(8)}
		ctx := context.WithValue(r.Context(), ctxKey{}, sc)
		w.Header().Set(correlationHeader, traceID)
		sw := &statusWriter{ResponseWriter: w, status: 200}
		s.Log.InfoContext(ctx, "request received", "method", r.Method, "path", r.URL.Path)
		r = r.WithContext(ctx)
		s.Mux.ServeHTTP(sw, r) // the mux records the matched pattern on this same request
		route := r.Pattern
		if route == "" {
			route = "unmatched"
		}
		if i := strings.IndexByte(route, ' '); i >= 0 {
			route = route[i+1:]
		}
		d := time.Since(start)
		if route != "/metrics" {
			s.Metrics.observe(r.Method, route, sw.status, d)
			s.Spans.add(Span{TraceID: traceID, SpanID: sc.spanID, ParentID: parent, Service: s.Name, Name: r.Method + " " + route,
				Kind: "server", StartedAt: start.UTC().Format(time.RFC3339Nano), DurationMs: ms(d), Status: sw.status})
		}
		lvl := slog.LevelInfo
		if sw.status >= 500 {
			lvl = slog.LevelError
		}
		s.Log.Log(ctx, lvl, "request completed", "method", r.Method, "route", route, "status", sw.status, "duration_ms", ms(d))
	})
}

func ms(d time.Duration) float64 { return float64(d.Microseconds()) / 1000 }

// Call is the outbound hop: it opens a client span and propagates traceparent + X-Correlation-Id.
func (s *Service) Call(ctx context.Context, target, url string) (*http.Response, error) {
	sc := from(ctx)
	child := randHex(8)
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	req.Header.Set(correlationHeader, sc.traceID)
	req.Header.Set("X-Parent-Span-Id", child)
	if hex32.MatchString(sc.traceID) {
		req.Header.Set("traceparent", fmt.Sprintf("00-%s-%s-01", sc.traceID, child))
	}
	start := time.Now()
	resp, err := s.Client.Do(req)
	status := 0
	if resp != nil {
		status = resp.StatusCode
	}
	s.Spans.add(Span{TraceID: sc.traceID, SpanID: child, ParentID: sc.spanID, Service: s.Name, Name: "call " + target,
		Kind: "client", StartedAt: start.UTC().Format(time.RFC3339Nano), DurationMs: ms(time.Since(start)), Status: status})
	return resp, err
}
