package relay

import (
	"context"
	"errors"
	"fmt"
	"net"
	"net/http"
	"strings"
	"time"
)

// Event is the part of an outbox_event row that the relay needs to deliver it.
type Event struct {
	EventID       string
	TenantID      string
	EventType     string
	CorrelationID string // holds the trace_id saved by the API (CP1 proposal)
}

// Relay delivers outbox events to identity-audit, keeping the trace of the original request.
type Relay struct {
	Log      Logger
	Metrics  *Metrics
	Client   *http.Client
	AuditURL string
}

// DeliverToAudit restores the trace from correlationId and sends traceparent downstream.
// The receiving route of identity-audit is not defined in 07-api yet: /internal/events is assumed.
func (r Relay) DeliverToAudit(ctx context.Context, e Event) error {
	tc, ok := FromCorrelationID(e.CorrelationID)
	if !ok {
		tc = NewTraceContext()
		r.Log.Log("WARN", "trace.restore.failed", "correlationId is not a trace_id, new trace started", tc, e.CorrelationID, 0, nil)
	}
	body := fmt.Sprintf(`{"eventId":%q,"eventType":%q,"tenantId":%q}`, e.EventID, e.EventType, e.TenantID)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, r.AuditURL+"/internal/events", strings.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("traceparent", tc.Child().Traceparent())
	req.Header.Set("X-Correlation-Id", e.CorrelationID)
	req.Header.Set("Idempotency-Key", e.EventID)

	start := time.Now()
	resp, err := r.Client.Do(req)
	elapsed := time.Since(start)
	fields := Fields{"tenant_id": e.TenantID, "outbox_event_id": e.EventID, "event_type": e.EventType, "target_service": "identity-audit"}
	outcome, level, event := "success", "INFO", "event.delivered"
	var netErr net.Error
	switch {
	case errors.As(err, &netErr) && netErr.Timeout():
		outcome, level, event = "timeout", "ERROR", "event.delivery.timeout"
	case err != nil:
		outcome, level, event = "error", "ERROR", "event.delivery.failed"
	case resp.StatusCode >= 400:
		outcome, level, event = "rejected", "WARN", "event.delivery.rejected"
		fields["http_status"] = resp.StatusCode
	}
	if resp != nil {
		resp.Body.Close()
	}
	r.Metrics.Observe("identity-audit", outcome, elapsed.Seconds())
	r.Log.Log(level, event, "delivery to identity-audit: "+outcome, tc, e.CorrelationID, elapsed.Milliseconds(), fields)
	return err
}
