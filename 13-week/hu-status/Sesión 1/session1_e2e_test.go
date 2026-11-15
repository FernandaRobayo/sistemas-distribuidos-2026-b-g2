package main

import (
	"bytes"
	"crypto/rand"
	"crypto/rsa"
	"crypto/tls"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"io"
	"log/slog"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/code-corhuila/multi-tour-security/internal/adapter/postgres/pgtest"
	"github.com/golang-jwt/jwt/v5"
)

// This file is overlaid only in a disposable export of the real security service.
func TestSession1LiveSecurity(t *testing.T) {
	root := os.Getenv("SESSION1_DIR")
	if root == "" {
		t.Fatal("SESSION1_DIR is required: run verify.mjs")
	}
	keyPath := filepath.Join(root, "keys", "private.pem")
	key, err := readPrivateKey(os.ReadFile, keyPath)
	if err != nil {
		t.Fatal(err)
	}
	s := newStack(t) // real PostgreSQL DDL, tenant copies and real bcrypt adapter
	s.private, s.public = key, &key.PublicKey
	var lock sync.RWMutex
	var handler http.Handler
	rebuild := func() {
		next, err := buildHandler(s.pool, config{privateKey: key, publicKey: &key.PublicKey}, slog.New(slog.NewTextHandler(io.Discard, nil)))
		if err != nil {
			t.Fatal(err)
		}
		lock.Lock()
		handler = next
		lock.Unlock()
	}
	rebuild()
	s.account(t, tenantA, "admin@example.com", pgtest.Options{}, "TENANT_ADMINISTRATOR")
	s.account(t, tenantA, "collaborator@example.com", pgtest.Options{}, "OPERATIONAL_COLLABORATOR")
	s.account(t, tenantB, "other@example.com", pgtest.Options{}, "TENANT_ADMINISTRATOR")
	listener, err := net.Listen("tcp", "0.0.0.0:0")
	if err != nil {
		t.Fatal(err)
	}
	server := httptest.NewUnstartedServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		lock.RLock()
		h := handler
		lock.RUnlock()
		h.ServeHTTP(w, r)
	}))
	server.Listener = listener
	server.Start()
	t.Cleanup(server.Close)
	write := func(name, value string) {
		if err := os.WriteFile(filepath.Join(root, name), []byte(value), 0600); err != nil {
			t.Fatal(err)
		}
	}
	wait := func(name string) string {
		until := time.Now().Add(5 * time.Minute)
		for time.Now().Before(until) {
			if raw, e := os.ReadFile(filepath.Join(root, name)); e == nil {
				return strings.TrimSpace(string(raw))
			}
			time.Sleep(250 * time.Millisecond)
		}
		t.Fatalf("coordinator timed out waiting for %s", name)
		return ""
	}
	write("security-ready", strings.Split(listener.Addr().String(), ":")[len(strings.Split(listener.Addr().String(), ":"))-1])
	gateway := wait("gateway-ready")
	roots := x509.NewCertPool()
	cert, err := os.ReadFile(filepath.Join(root, "keys", "tls.crt"))
	if err != nil || !roots.AppendCertsFromPEM(cert) {
		t.Fatal("test CA unavailable")
	}
	client := &http.Client{Timeout: 15 * time.Second, Transport: &http.Transport{TLSClientConfig: &tls.Config{RootCAs: roots, MinVersion: tls.VersionTLS12}}}
	t.Cleanup(client.CloseIdleConnections)
	// Wait for NGINX's listener, without accepting an untrusted certificate.
	for i := 0; i < 60; i++ {
		r, e := client.Get(gateway + "/health")
		if e == nil {
			r.Body.Close()
			break
		}
		if i == 59 {
			t.Fatal("TLS gateway did not start")
		}
		time.Sleep(500 * time.Millisecond)
	}
	type response struct {
		status int
		body   []byte
		header http.Header
	}
	request := func(method, url, token, body string) response {
		req, e := http.NewRequest(method, url, strings.NewReader(body))
		if e != nil {
			t.Fatal(e)
		}
		req.Header.Set("X-Correlation-Id", "session1-live")
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Idempotency-Key", "session1-"+time.Now().Format("150405.000000000"))
		if token != "" {
			req.Header.Set("Authorization", "Bearer "+token)
		}
		r, e := client.Do(req)
		if e != nil {
			t.Fatal("HTTP request failed (credentials withheld)")
		}
		defer r.Body.Close()
		raw, e := io.ReadAll(io.LimitReader(r.Body, 1<<20))
		if e != nil {
			t.Fatal(e)
		}
		return response{r.StatusCode, raw, r.Header}
	}
	check := func(name string, want int, method, url, token, body string) response {
		var got response
		t.Run(name, func(t *testing.T) {
			got = request(method, url, token, body)
			if got.status != want {
				t.Errorf("want HTTP %d, got %d; response withheld", want, got.status)
			}
		})
		return got
	}
	login := func(name, email string) string {
		r := check(name, 200, "POST", gateway+tenantURL, "", `{"email":"`+email+`","password":"`+password+`"}`)
		var a answer
		if json.Unmarshal(r.body, &a) != nil || a.AccessToken == "" {
			t.Fatal("login did not issue a token")
		}
		return a.AccessToken
	}
	const route = "/api/v1/commercial-reservation/catalog/services"
	const catalogBody = `{"serviceType":"TOUR","commercialName":"Session 1 tour","baseRateCents":35000000,"baseOperationalCostCents":21000000,"configuredCapacity":18,"transportRequired":true,"highRisk":false}`
	check("edge_rejects_missing_credential", 401, "GET", gateway+route, "", "")
	check("edge_login_rejects_wrong_password", 401, "POST", gateway+tenantURL, "", `{"email":"admin@example.com","password":"wrong"}`)
	admin := login("edge_login_issues_real_signed_admin_token", "admin@example.com")
	collaborator := login("edge_login_issues_collaborator_token", "collaborator@example.com")
	item := check("real_go_login_token_creates_item_in_java_service", 201, "POST", gateway+route, admin, catalogBody)
	var dto map[string]any
	if json.Unmarshal(item.body, &dto) != nil || dto["serviceId"] == nil {
		t.Fatal("catalog did not return an identifier")
	}
	itemID := dto["serviceId"].(string)
	check("valid_collaborator_cannot_create", 403, "POST", gateway+route, collaborator, catalogBody)
	check("valid_admin_cannot_submit_malformed_json", 400, "POST", gateway+route, admin, "{")
	check("valid_admin_cannot_submit_unknown_field", 400, "POST", gateway+route, admin, strings.TrimSuffix(catalogBody, "}")+`,"tenantId":"forged"}`)
	check("direct_service_rejects_missing_credential", 401, "GET", "http://127.0.0.1:"+wait("java-ready")+route, "", "")
	sign := func(k *rsa.PrivateKey, alg string, exp int64) string {
		claims := jwt.MapClaims{"sub": "00000000-0000-0000-0000-000000000456", "tenantId": tenantA, "roles": []string{"TENANT_ADMINISTRATOR"}, "exp": exp}
		var method jwt.SigningMethod = jwt.SigningMethodRS256
		if alg == "HS256" {
			method = jwt.SigningMethodHS256
		}
		var signing any = k
		if alg == "HS256" {
			signing = []byte("not-a-real-key")
		}
		raw, e := jwt.NewWithClaims(method, claims).SignedString(signing)
		if e != nil {
			t.Fatal(e)
		}
		return raw
	}
	check("service_rejects_expired_signed_token", 401, "GET", gateway+route, sign(key, "RS256", time.Now().Add(-time.Minute).Unix()), "")
	check("service_rejects_hs256_algorithm", 401, "GET", gateway+route, sign(key, "HS256", time.Now().Add(time.Minute).Unix()), "")
	otherKey, e := rsa.GenerateKey(rand.Reader, 2048)
	if e != nil {
		t.Fatal(e)
	}
	check("service_rejects_another_signing_key", 401, "GET", gateway+route, sign(otherKey, "RS256", time.Now().Add(time.Minute).Unix()), "")
	other := check("other_tenant_login", 200, "POST", gateway+otherURL, "", `{"email":"other@example.com","password":"`+password+`"}`)
	var otherAnswer answer
	if json.Unmarshal(other.body, &otherAnswer) != nil {
		t.Fatal("other tenant login failed")
	}
	foreign := check("another_tenants_item_is_hidden", 404, "GET", gateway+route+"/"+itemID, otherAnswer.AccessToken, "")
	missing := check("missing_item_has_same_response", 404, "GET", gateway+route+"/00000000-0000-0000-0000-000000000001", otherAnswer.AccessToken, "")
	t.Run("tenant_isolation_does_not_disclose_item", func(t *testing.T) {
		if !bytes.Equal(foreign.body, missing.body) {
			t.Error("foreign and missing item responses differ")
		}
	})
	issue := func() string {
		var out bytes.Buffer
		e := execute(ctx, []string{"issue-service-token", "worker-event-relay", "15m"}, func(k string) string {
			if k == "JWT_PRIVATE_KEY_FILE" {
				return keyPath
			}
			return ""
		}, strings.NewReader(""), &out, os.ReadFile, time.Now)
		if e != nil {
			t.Fatal(e)
		}
		return strings.TrimSpace(out.String())
	}
	serviceToken := issue()
	internal := server.URL + "/api/v1/security/internal/outbox?status=PENDING&limit=10"
	check("real_service_credential_calls_real_internal_api", 200, "GET", internal, serviceToken, "")
	check("person_cannot_call_internal_api", 403, "GET", internal, admin, "")
	check("missing_service_credential_is_rejected", 401, "GET", internal, "", "")
	check("internal_api_is_hidden_at_edge", 404, "GET", gateway+"/api/v1/security/internal/outbox", serviceToken, "")
	t.Run("tls_certificate_hostname_and_hsts_are_verified", func(t *testing.T) {
		if item.header.Get("Strict-Transport-Security") == "" {
			t.Error("HSTS missing")
		}
		if item.header.Get("X-Correlation-Id") != "session1-live" {
			t.Error("correlation lost")
		}
	})
	t.Run("plaintext_password_is_not_stored", func(t *testing.T) {
		var hash string
		e := s.pool.QueryRow(ctx, "SELECT password_hash FROM security.identity WHERE email_normalized='admin@example.com'").Scan(&hash)
		if e != nil || hash == password || !strings.HasPrefix(hash, "$2a$12$") {
			t.Error("bcrypt hash storage was not proved")
		}
	})
	// Rotate the signer and the consumer public key, then obtain fresh credentials.
	key, e = rsa.GenerateKey(rand.Reader, 2048)
	if e != nil {
		t.Fatal(e)
	}
	raw, e := x509.MarshalPKCS8PrivateKey(key)
	if e != nil {
		t.Fatal(e)
	}
	if e = os.WriteFile(keyPath, pem.EncodeToMemory(&pem.Block{Type: "PRIVATE KEY", Bytes: raw}), 0600); e != nil {
		t.Fatal(e)
	}
	public, e := x509.MarshalPKIXPublicKey(&key.PublicKey)
	if e != nil {
		t.Fatal(e)
	}
	if e = os.WriteFile(filepath.Join(root, "keys", "public.pem"), pem.EncodeToMemory(&pem.Block{Type: "PUBLIC KEY", Bytes: public}), 0600); e != nil {
		t.Fatal(e)
	}
	rebuild()
	write("rotate-ready", "ready")
	wait("rotation-ready")
	client.CloseIdleConnections()
	time.Sleep(time.Second)
	check("old_user_token_is_rejected_after_key_rotation", 401, "GET", gateway+route, admin, "")
	fresh := login("new_login_uses_rotated_signing_key", "admin@example.com")
	check("rotated_token_is_accepted_by_restarted_java_service", 201, "POST", gateway+route, fresh, catalogBody)
	check("old_service_token_is_rejected_after_rotation", 401, "GET", internal, serviceToken, "")
	check("reissued_service_token_is_accepted", 200, "GET", internal, issue(), "")
}
