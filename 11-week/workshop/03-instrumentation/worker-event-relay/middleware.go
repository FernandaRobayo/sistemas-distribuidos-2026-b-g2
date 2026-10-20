package relay

import (
	"context"
	"net/http"
	"time"
)

type ctxKey struct{}

// FromContext returns the trace context stored by the middleware.
func FromContext(ctx context.Context) TraceContext {
	tc, _ := ctx.Value(ctxKey{}).(TraceContext)
	return tc
}

type statusWriter struct {
	http.ResponseWriter
	status int
}

func (w *statusWriter) WriteHeader(code int) {
	w.status = code
	w.ResponseWriter.WriteHeader(code)
}

// TraceMiddleware reads traceparent or creates a new trace, returns the context
// in the response and writes one structured line per request.
func (l Logger) TraceMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		tc := NewTraceContext()
		if incoming, ok := ParseTraceparent(r.Header.Get("traceparent")); ok {
			tc = incoming.Child()
		}
		correlationID := r.Header.Get("X-Correlation-Id")
		if correlationID == "" {
			correlationID = tc.TraceID
		}
		w.Header().Set("traceparent", tc.Traceparent())
		sw := &statusWriter{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(sw, r.WithContext(context.WithValue(r.Context(), ctxKey{}, tc)))
		l.Log("INFO", "request.completed", r.Method+" "+r.URL.Path, tc, correlationID,
			time.Since(start).Milliseconds(), Fields{"http_status": sw.status})
	})
}
