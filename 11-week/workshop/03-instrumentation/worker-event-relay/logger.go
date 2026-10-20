package relay

import (
	"encoding/json"
	"io"
	"time"
)

// Logger writes one JSON line per event, following 02-log-contract.md.
type Logger struct {
	Service     string
	Version     string
	Environment string
	Out         io.Writer
}

// Fields are the domain fields of the contract (tenant_id, outbox_event_id, ...).
type Fields map[string]any

// Log writes a line with the mandatory fields; trace_id and span_id come from ctx.
func (l Logger) Log(level, event, message string, ctx TraceContext, correlationID string, durationMS int64, extra Fields) {
	line := Fields{
		"timestamp":      time.Now().UTC().Format("2006-01-02T15:04:05.000Z"),
		"level":          level,
		"service":        l.Service,
		"version":        l.Version,
		"environment":    l.Environment,
		"trace_id":       ctx.TraceID,
		"span_id":        ctx.SpanID,
		"correlation_id": correlationID,
		"event":          event,
		"message":        message,
		"duration_ms":    durationMS,
	}
	for k, v := range extra {
		line[k] = v
	}
	b, _ := json.Marshal(line)
	_, _ = l.Out.Write(append(b, '\n'))
}
