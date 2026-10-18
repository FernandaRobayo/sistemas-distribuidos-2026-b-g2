package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"
)

// Lab stubs: no real domain data, only enough behaviour to produce a multi-hop request.

func securityHandler(s *Service) {
	s.Mux.HandleFunc("GET /auth/validate", func(w http.ResponseWriter, r *http.Request) {
		if d, _ := strconv.Atoi(r.URL.Query().Get("delay_ms")); d > 0 { // simulated slow dependency
			time.Sleep(time.Duration(d) * time.Millisecond)
		}
		if r.URL.Query().Get("fail") == "1" {
			s.Log.ErrorContext(r.Context(), "token validation failed", "reason", "simulated")
			writeJSON(w, 503, map[string]string{"error": "SECURITY_UNAVAILABLE", "traceId": from(r.Context()).traceID})
			return
		}
		s.Log.InfoContext(r.Context(), "token validated")
		writeJSON(w, 200, map[string]string{"valid": "true"})
	})
}

func reservationsHandler(s *Service, securityURL string) {
	s.Mux.HandleFunc("GET /reservations/{id}", func(w http.ResponseWriter, r *http.Request) {
		resp, err := s.Call(r.Context(), "security", securityURL+"/auth/validate?"+r.URL.RawQuery)
		if err != nil || resp.StatusCode != 200 {
			s.Log.ErrorContext(r.Context(), "security dependency failed", "reservation_id", r.PathValue("id"))
			writeJSON(w, 502, map[string]string{"error": "DEPENDENCY_FAILED", "traceId": from(r.Context()).traceID})
			return
		}
		_, _ = io.Copy(io.Discard, resp.Body)
		resp.Body.Close()
		s.Log.InfoContext(r.Context(), "reservation read", "reservation_id", r.PathValue("id"))
		writeJSON(w, 200, map[string]string{"id": r.PathValue("id"), "status": "STUB"})
	})
}

func gatewayHandler(s *Service, reservationsURL string) {
	s.Mux.HandleFunc("GET /api/reservations/{id}", func(w http.ResponseWriter, r *http.Request) {
		resp, err := s.Call(r.Context(), "reservations", reservationsURL+"/reservations/"+r.PathValue("id")+"?"+r.URL.RawQuery)
		if err != nil {
			writeJSON(w, 502, map[string]string{"error": "UPSTREAM", "traceId": from(r.Context()).traceID})
			return
		}
		defer resp.Body.Close()
		w.WriteHeader(resp.StatusCode)
		_, _ = io.Copy(w, resp.Body)
	})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

// Stack holds the three services; Start serves them on loopback ports.
type Stack struct {
	Gateway, Reservations, Security *Service
	GatewayURL                      string
	Spans                           *SpanStore
	close                           []func()
}

func Start(logs io.Writer) (*Stack, error) {
	spans := &SpanStore{}
	st := &Stack{Spans: spans}
	st.Security = NewService("security", logs, spans)
	st.Reservations = NewService("reservations", logs, spans)
	st.Gateway = NewService("gateway", logs, spans)
	serve := func(s *Service) (string, error) {
		srv := &http.Server{Handler: s.Handler()}
		ln, err := listen()
		if err != nil {
			return "", err
		}
		go srv.Serve(ln)
		st.close = append(st.close, func() { srv.Close() })
		return "http://" + ln.Addr().String(), nil
	}
	securityHandler(st.Security)
	secURL, err := serve(st.Security)
	if err != nil {
		return nil, err
	}
	reservationsHandler(st.Reservations, secURL)
	resURL, err := serve(st.Reservations)
	if err != nil {
		return nil, err
	}
	gatewayHandler(st.Gateway, resURL)
	st.GatewayURL, err = serve(st.Gateway)
	return st, err
}

func (s *Stack) Stop() {
	for _, c := range s.close {
		c()
	}
}

func main() {
	st, err := Start(os.Stdout)
	if err != nil {
		panic(err)
	}
	defer st.Stop()
	fmt.Fprintln(os.Stderr, "gateway:", st.GatewayURL)
	select {} // keep serving; try: curl -H "X-Correlation-Id: demo-1" <gateway>/api/reservations/R-1
}
