package relay

import (
	"fmt"
	"net/http"
	"sort"
	"strings"
	"sync"
)

// Buckets in seconds. 3 s is the delivery timeout, so the histogram shows how many deliveries reach it.
var Buckets = []float64{0.1, 0.5, 1, 3, 5}

type histogram struct {
	counts []int
	sum    float64
	total  int
}

// Metrics keeps the counter of deliveries by outcome and the latency histogram.
type Metrics struct {
	mu       sync.Mutex
	outcomes map[string]int
	hist     map[string]*histogram
}

func NewMetrics() *Metrics {
	return &Metrics{outcomes: map[string]int{}, hist: map[string]*histogram{}}
}

// Observe records one delivery to target_service with its outcome and duration.
func (m *Metrics) Observe(target, outcome string, seconds float64) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.outcomes[target+"|"+outcome]++
	h := m.hist[target]
	if h == nil {
		h = &histogram{counts: make([]int, len(Buckets))}
		m.hist[target] = h
	}
	for i, b := range Buckets {
		if seconds <= b {
			h.counts[i]++
		}
	}
	h.sum += seconds
	h.total++
}

// Handler writes the Prometheus text format for /metrics.
func (m *Metrics) Handler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		m.mu.Lock()
		defer m.mu.Unlock()
		var sb strings.Builder
		sb.WriteString("# TYPE relay_deliveries_total counter\n")
		keys := make([]string, 0, len(m.outcomes))
		for k := range m.outcomes {
			keys = append(keys, k)
		}
		sort.Strings(keys)
		for _, k := range keys {
			p := strings.SplitN(k, "|", 2)
			fmt.Fprintf(&sb, "relay_deliveries_total{target_service=%q,outcome=%q} %d\n", p[0], p[1], m.outcomes[k])
		}
		sb.WriteString("# TYPE relay_delivery_duration_seconds histogram\n")
		for target, h := range m.hist {
			for i, b := range Buckets {
				fmt.Fprintf(&sb, "relay_delivery_duration_seconds_bucket{target_service=%q,le=\"%g\"} %d\n", target, b, h.counts[i])
			}
			fmt.Fprintf(&sb, "relay_delivery_duration_seconds_bucket{target_service=%q,le=\"+Inf\"} %d\n", target, h.total)
			fmt.Fprintf(&sb, "relay_delivery_duration_seconds_sum{target_service=%q} %g\n", target, h.sum)
			fmt.Fprintf(&sb, "relay_delivery_duration_seconds_count{target_service=%q} %d\n", target, h.total)
		}
		w.Header().Set("Content-Type", "text/plain; version=0.0.4")
		_, _ = w.Write([]byte(sb.String()))
	})
}
