package relay

import (
	"bytes"
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

const traceID = "4bf92f3577b34da6a3ce929d0e0e4736"

func TestDeliveryHTTPResponses(t *testing.T) {
	for _, status := range []int{http.StatusOK, http.StatusCreated, http.StatusAccepted, http.StatusUnprocessableEntity, http.StatusServiceUnavailable} {
		t.Run(http.StatusText(status), func(t *testing.T) {
			audit := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
				w.WriteHeader(status)
			}))
			defer audit.Close()
			var logs bytes.Buffer
			r := Relay{Log: Logger{"worker-event-relay", "0.1.0", "qa", &logs}, Metrics: NewMetrics(),
				Client: audit.Client(), AuditURL: audit.URL}
			err := r.DeliverToAudit(context.Background(), Event{EventID: "event-1", TenantID: "tenant-1", CorrelationID: traceID})
			accepted := status == http.StatusOK || status == http.StatusCreated
			if (err == nil) != accepted {
				t.Fatalf("HTTP %d: error = %v, accepted = %v", status, err, accepted)
			}
			outcome, event := "rejected", "event.delivery.rejected"
			if accepted {
				outcome, event = "success", "event.delivered"
			}
			if !strings.Contains(logs.String(), `"event":"`+event+`"`) {
				t.Fatalf("wrong delivery log: %s", logs.String())
			}
			metrics := httptest.NewRecorder()
			r.Metrics.Handler().ServeHTTP(metrics, httptest.NewRequest("GET", "/metrics", nil))
			if !strings.Contains(metrics.Body.String(), `relay_deliveries_total{target_service="identity-audit",outcome="`+outcome+`"} 1`) {
				t.Fatalf("wrong outcome metric: %s", metrics.Body.String())
			}
		})
	}
}

func TestTraceIdReceivedEqualsTraceIdSentDownstream(t *testing.T) {
	var got http.Header
	var gotPath string
	audit := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		got = r.Header.Clone()
		gotPath = r.URL.Path
		w.WriteHeader(http.StatusCreated)
	}))
	defer audit.Close()
	var logs bytes.Buffer
	r := Relay{Log: Logger{"worker-event-relay", "0.1.0", "qa", &logs}, Metrics: NewMetrics(),
		Client: &http.Client{Timeout: 5 * time.Second}, AuditURL: audit.URL}

	e := Event{EventID: "9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11", TenantID: "0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30",
		EventType: "CatalogServiceInactivated", CorrelationID: traceID}
	if err := r.DeliverToAudit(context.Background(), e); err != nil {
		t.Fatal(err)
	}
	sent, ok := ParseTraceparent(got.Get("traceparent"))
	if !ok || sent.TraceID != traceID {
		t.Fatalf("trace_id sent downstream = %q, want %q", sent.TraceID, traceID)
	}
	wantPath := "/api/v1/identity-audit/internal/tenants/" + e.TenantID + "/events"
	if gotPath != wantPath {
		t.Fatalf("path = %q, want %q", gotPath, wantPath)
	}
	if got.Get("Idempotency-Key") != e.EventID {
		t.Fatalf("Idempotency-Key = %q", got.Get("Idempotency-Key"))
	}
	if !strings.Contains(logs.String(), `"trace_id":"`+traceID+`"`) {
		t.Fatalf("log line does not carry the trace_id: %s", logs.String())
	}
	m := httptest.NewRecorder()
	r.Metrics.Handler().ServeHTTP(m, httptest.NewRequest("GET", "/metrics", nil))
	if !strings.Contains(m.Body.String(), `relay_deliveries_total{target_service="identity-audit",outcome="success"} 1`) {
		t.Fatalf("metric missing:\n%s", m.Body.String())
	}
}
