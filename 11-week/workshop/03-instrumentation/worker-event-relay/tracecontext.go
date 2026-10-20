package relay

import (
	"crypto/rand"
	"encoding/hex"
	"strings"
)

// TraceContext is the W3C trace context that travels in the traceparent header.
type TraceContext struct {
	TraceID string // 32 hex characters
	SpanID  string // 16 hex characters
}

func randomHex(bytes int) string {
	b := make([]byte, bytes)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

func validHex(s string, length int) bool {
	if len(s) != length || strings.Trim(s, "0") == "" {
		return false
	}
	_, err := hex.DecodeString(s)
	return err == nil && s == strings.ToLower(s)
}

// NewTraceContext starts a new trace: used when no context arrives.
func NewTraceContext() TraceContext {
	return TraceContext{TraceID: randomHex(16), SpanID: randomHex(8)}
}

// Child keeps the trace_id and starts a new span.
func (c TraceContext) Child() TraceContext {
	return TraceContext{TraceID: c.TraceID, SpanID: randomHex(8)}
}

// Traceparent formats the header value: 00-<trace_id>-<span_id>-01.
func (c TraceContext) Traceparent() string {
	return "00-" + c.TraceID + "-" + c.SpanID + "-01"
}

// ParseTraceparent reads the header value; ok is false when it is missing or malformed.
func ParseTraceparent(header string) (TraceContext, bool) {
	p := strings.Split(strings.TrimSpace(header), "-")
	if len(p) != 4 || p[0] != "00" || !validHex(p[1], 32) || !validHex(p[2], 16) {
		return TraceContext{}, false
	}
	return TraceContext{TraceID: p[1], SpanID: p[2]}, true
}

// FromCorrelationID restores the trace of an outbox event. In my CP1 proposal the
// API saves the trace_id in the correlationId of the outbox_event row.
func FromCorrelationID(correlationID string) (TraceContext, bool) {
	if !validHex(correlationID, 32) {
		return TraceContext{}, false
	}
	return TraceContext{TraceID: correlationID, SpanID: randomHex(8)}, true
}
