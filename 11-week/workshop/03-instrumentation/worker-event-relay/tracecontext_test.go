package relay

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestTraceparentValidationAndSampling(t *testing.T) {
	prefix := "00-" + traceID + "-00f067aa0ba902b7-"
	for _, flags := range []string{"00", "01", "ff"} {
		tc, ok := ParseTraceparent(prefix + flags)
		if !ok || tc.Child().Flags != flags {
			t.Fatalf("valid flags %q were not preserved", flags)
		}
	}
	for _, header := range []string{"", prefix, prefix + "zz", prefix + "1", prefix + "000", prefix + "FF",
		"00-00000000000000000000000000000000-00f067aa0ba902b7-01",
		"00-" + traceID + "-0000000000000000-01"} {
		if _, ok := ParseTraceparent(header); ok {
			t.Errorf("accepted invalid traceparent %q", header)
		}
	}
}

func TestMiddlewarePreservesCorrelationAndActualStatus(t *testing.T) {
	var logs bytes.Buffer
	logger := Logger{"worker-event-relay", "0.1.0", "qa", &logs}
	handler := logger.TraceMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if FromContext(r.Context()).TraceID != traceID {
			t.Error("request lost trace context")
		}
		_, _ = w.Write([]byte("ok"))                 // implicitly commits 200
		w.WriteHeader(http.StatusServiceUnavailable) // must not change the logged status
	}))
	req := httptest.NewRequest("GET", "/health", nil)
	req.Header.Set("traceparent", "00-"+traceID+"-00f067aa0ba902b7-00")
	req.Header.Set("X-Correlation-Id", "request-123")
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	tc, ok := ParseTraceparent(rec.Header().Get("traceparent"))
	if !ok || tc.TraceID != traceID || tc.Flags != "00" || tc.SpanID == "00f067aa0ba902b7" {
		t.Fatalf("invalid response context: %+v", tc)
	}
	var line map[string]any
	if err := json.Unmarshal(logs.Bytes(), &line); err != nil {
		t.Fatal(err)
	}
	if rec.Header().Get("X-Correlation-Id") != "request-123" || line["correlation_id"] != "request-123" || line["http_status"] != float64(rec.Code) {
		t.Fatalf("response and log disagree: %s", logs.String())
	}
}
