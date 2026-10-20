# Runbook — `multi-tour-security`: inicio de sesión devuelve 5xx

> Para quien esté de guardia a las 3 a. m. Sigue la estructura de la plantilla `09-microservices/_template/service/runbook.md`.
> **Estado:** diseño de la Sesión 2. Los comandos salen de `deploy/compose.yml` y del README de `multi-tour-security`
> (2026-10-18); **no se ejecutaron** contra un entorno desplegado. Todo lo marcado *(por confirmar)* no existe aún.

**Servicio:** `security` (Go) · **Puerto interno:** 8086 (`expose`, no se publica; se llega por el gateway) ·
**Versión del documento:** 1.0 · **Última actualización:** 2026-10-18

## 1. Datos rápidos

| Campo | Valor |
|---|---|
| Alerta que lo activa | `SloAvailabilityBurnRate` con `service="security"` (ver [README](README.md) sección 3) |
| Síntoma | personas no pueden iniciar sesión o renovar; respuestas 5xx del servicio |
| Severidad | P1; **P0** si `/health` no responde |
| Responsable | María Fernanda Robayo *(propuesto, por confirmar)* |
| Canal | `#incidents` *(por confirmar; no hay canal real configurado)* |
| Dashboard | *(por confirmar; no existe)* |
| Objetivos de recuperación | RTO ≤ 8 h, RPO ≤ 24 h (PDR v1.9, sección 17) |

## 2. Confirmar el síntoma (2 min)

Los comandos se ejecutan desde la composición raíz de `multi-tour-infra-postgres`, donde se incluye `deploy/compose.yml`.

```bash
docker compose ps security postgres
```

```bash
docker compose logs --since 15m security | grep -E '"level":"(ERROR|WARN)"'
```

Salud del proceso (el healthcheck del contenedor llama a esto, no necesita token):

```bash
docker compose exec security wget -q -O - http://127.0.0.1:8086/health
```

Respuesta esperada: `{"status":"ok"}`. **Aviso:** `/health` solo prueba que el proceso vive, **no** comprueba la base de datos.
Un `ok` con 5xx apunta a la base de datos o a las llaves, no al proceso.

Cuando el servicio exponga `/metrics` (historias OBS-01 y OBS-02; hoy no existe en el producto): `docker compose exec security wget -q -O - http://127.0.0.1:8086/metrics | grep 'status="5'`.

## 3. Seguir una petición fallida

Cada respuesta de error trae `traceId` y cabecera `X-Correlation-Id`. Con ese valor:

```bash
docker compose logs security | grep "<traceId>"
```

La línea con `level":"ERROR"` y ese `traceId` da la razón (la razón nunca va al cliente).

## 4. Árbol de decisión

| Lo que ves | Causa probable | Ir a |
|---|---|---|
| `security` reiniciándose o `unhealthy` | arranque rechazado: llave ausente o débil, `DATABASE_URL` sin contraseña, `HTTP_PORT` inválido | 5.1 |
| `postgres` no está `healthy` | base de datos caída | 5.2 |
| `security` sano, 5xx con errores de conexión o de esquema | credenciales de `security_app` o migración sin aplicar | 5.3 |
| Los 5xx empezaron justo tras un despliegue | versión nueva defectuosa | 5.4 |

## 5. Mitigaciones

### 5.1 El servicio no arranca

El binario se niega a arrancar con llave faltante o débil (RSA < 2048), URL de base sin contraseña o puerto malo.

```bash
docker compose logs --tail 50 security
```

Revisa que `${JWT_KEYS_DIR}` contenga `private.pem` y `public.pem` legibles y que `env/<entorno>.env` tenga
`SECURITY_APP_PASSWORD` y `PG_DATABASE`. Corrige y reinicia:

```bash
docker compose up -d security
```

### 5.2 PostgreSQL caído

```bash
docker compose ps postgres
```

```bash
docker compose logs --tail 50 postgres
```

Si no está sano: `docker compose up -d postgres` y espera a `healthy`. Si hay corrupción o pérdida de datos, **escala**
(sección 7) y sigue el procedimiento de restauración *(por confirmar: `backup-and-recovery.md` aún no existe en la docs)*.

### 5.3 Credenciales o esquema

La migración no cambia nada si se repite, así que es segura de volver a ejecutar:

```bash
docker compose --env-file env/dev.env run --rm security-db-migrate
```

Comprueba que el usuario `security_app` exista (lo crea `postgres/init/01-instance.sh` de la infraestructura; si la
instancia ya existía, ese script se repite a mano).

### 5.4 Regresión tras un despliegue

Vuelve a la imagen anterior (etiqueta `multi-tour-security:<versión anterior>`) y reinicia:

```bash
docker compose up -d security
```

Solo si la versión anterior pasó antes por `qa`. Registra la versión revertida.

## 6. Verificar la recuperación

- [ ] `docker compose ps` muestra `security` en `healthy`.
- [ ] Un inicio de sesión de prueba responde 200 (usa una cuenta de pruebas del entorno; nunca una real).
- [ ] La tasa de 5xx cae por debajo del 30 % y la alerta se resuelve; si hay métricas, `status="5xx"` deja de crecer.
- [ ] Se registró la duración de la indisponibilidad para descontarla del presupuesto de SLO-1 (36 h/30 días).

## 7. Escalar y comunicar

| Cuándo | A quién | Mensaje (plantilla de `13-operations/runbook`) |
|---|---|---|
| Sin mejora a los 15 min o se sospecha pérdida de datos | el otro integrante del equipo y, si es P0, el docente | `[P1 START] security devuelve 5xx desde HH:MM. Investigando.` |
| Cada 15 min mientras dure | `#incidents` | `[P1 UPDATE] Causa probable: ... Acción: ... ETA: ...` |
| Resuelto | `#incidents` | `[P1 RESOLVED] Duración: X min. Causa raíz: ... Post-mortem: fecha` |

## 8. Después del incidente

- [ ] Servicio estable con las métricas dentro del SLO.
- [ ] Presupuesto de error actualizado (README sección 2).
- [ ] Incidente anotado en `13-operations/incident-management.md`.
- [ ] Mejora creada en `15-project-control/technical-backlog.md` (por ejemplo: `/health` debería comprobar la base de datos).
- [ ] Post-mortem si fue P0 o P1.
