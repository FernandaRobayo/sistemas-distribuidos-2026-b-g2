// Command relay runs the instrumented relay of the workshop: one delivery to a stand-in
// of identity-audit, then /health and /metrics behind the trace middleware.
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"time"

	relay "worker-event-relay"
)

func main() {
	once := len(os.Args) > 1 && os.Args[1] == "-once"
	logger := relay.Logger{Service: "worker-event-relay", Version: "0.1.0", Environment: "qa", Out: os.Stdout}
	metrics := relay.NewMetrics()

	// Stand-in of identity-audit: its receiving route is not defined in 07-api yet.
	audit := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusAccepted)
	}))
	defer audit.Close()

	r := relay.Relay{Log: logger, Metrics: metrics, Client: &http.Client{Timeout: 3 * time.Second}, AuditURL: audit.URL}
	event := relay.Event{EventID: "9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11", TenantID: "0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30",
		EventType: "CatalogServiceInactivated", CorrelationID: "4bf92f3577b34da6a3ce929d0e0e4736"}
	if err := r.DeliverToAudit(context.Background(), event); err != nil {
		log.Fatal(err)
	}

	if once {
		rec := httptest.NewRecorder()
		metrics.Handler().ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/metrics", nil))
		fmt.Print(rec.Body.String())
		return
	}
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) { _, _ = w.Write([]byte("ok")) })
	mux.Handle("/metrics", metrics.Handler())
	start := relay.NewTraceContext()
	logger.Log("INFO", "server.started", "listening on :8087", start, start.TraceID, 0, nil)
	log.Fatal(http.ListenAndServe(":8087", logger.TraceMiddleware(mux)))
}
