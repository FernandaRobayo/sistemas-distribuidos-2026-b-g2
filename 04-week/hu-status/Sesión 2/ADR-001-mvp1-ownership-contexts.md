# ADR-001 - Ownership de endpoints del MVP 1 por bounded context

- Estado: Aceptado para la preparacion del Sprint MVP 1
- Fecha: 2026-08-31

## Contexto

El Sprint MVP 1 define contrato API, historias y tareas para iniciar construccion del flujo minimo del canal digital de Multi tour. El Context Map del proyecto ya separa `Tenant Management`, `Identidad y acceso`, `Clientes`, `Catalogo operativo`, `Reservas`, `Descuentos y reglas comerciales` y `Caja y consolidacion`, pero esta sesion necesitaba dejar explicito que endpoint pertenece a que responsabilidad para evitar cruces de ownership.

## Decision

Se adopta el siguiente ownership minimo para los endpoints definidos en `openapi.yaml`:

| Endpoint | Bounded Context owner | Justificacion |
| --- | --- | --- |
| `GET /health` | Tenant Management | Expone salud operativa basica del servicio publicado en esta sesion. |
| `GET /tenants/{tenantId}` | Tenant Management | El estado y existencia del tenant pertenecen a `Tenant Management`. |
| `POST /auth/register` | Identidad y acceso | La cuenta autenticable y sus credenciales pertenecen a `Identidad y acceso`. |
| `POST /auth/login` | Identidad y acceso | La autenticacion y emision de sesion o token pertenecen a `Identidad y acceso`. |
| `POST /auth/password-recovery` | Identidad y acceso | La recuperacion de acceso no cambia el ownership comercial del cliente. |
| `GET /catalog/services` | Catalogo operativo | La oferta base, tarifas y disponibilidad consultable pertenecen a `Catalogo operativo`. |
| `POST /reservations` | Reservas | La reserva, su estado funcional, el valor proyectado y el valor final pertenecen a `Reservas`. |
| `GET /reservations/{reservationId}` | Reservas | La consulta de la reserva propia pertenece a `Reservas`. |
| `POST /reservations/{reservationId}/payments` | Reservas | En MVP 1 este endpoint registra el estado economico funcional de la reserva. Los movimientos monetarios efectivos podran publicarse despues hacia `Caja y consolidacion` sin transferir ownership de la reserva. |

## Consecuencias

- Se evita asignar a `Tenant Management` responsabilidades de autenticacion o reserva.
- Se evita mover a `Caja y consolidacion` el ownership del estado de pago funcional de la reserva.
- Se mantiene coherencia con el Context Map: `Reservas` consume informacion de `Identidad y acceso`, `Catalogo operativo` y `Descuentos y reglas comerciales` sin apropiarse de sus datos maestros.
- Este ADR no define despliegue fisico ni cantidad final de microservicios; solo fija ownership funcional minimo para el MVP 1.
