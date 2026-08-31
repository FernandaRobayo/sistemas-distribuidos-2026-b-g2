# Sprint MVP 1 - Tablero de tareas

## Objetivo del sprint

Lanzar un MVP 1 funcional del canal digital de Multi tour que permita operar el flujo minimo de cliente final dentro de un tenant: determinar tenant activo, consultar oferta, registrarse o autenticarse, crear una reserva y registrar un pago o abono con consulta posterior del estado de la reserva.

## Historias del sprint y nivel de compromiso

| ID | Historia de usuario | Prioridad | Compromiso sprint | Estado sugerido |
| --- | --- | --- | --- | --- |
| HU-MVP1-001 | Como cliente final quiero consultar la oferta disponible del tenant para decidir si reservo. | Must | Obligatorio | Todo |
| HU-MVP1-002 | Como cliente final quiero registrarme dentro de un tenant para gestionar mi reserva. | Must | Obligatorio | Todo |
| HU-MVP1-003 | Como cliente final quiero iniciar sesion dentro del tenant correcto para ver y gestionar solo mis reservas. | Must | Obligatorio | Todo |
| HU-MVP1-004 | Como cliente final quiero crear una reserva con mis datos y acompanantes para dejar registrada mi solicitud. | Must | Obligatorio | Todo |
| HU-MVP1-005 | Como cliente final quiero consultar el estado de mi reserva para saber si sigue pendiente, confirmada o cancelada. | Must | Obligatorio | Todo |
| HU-MVP1-006 | Como cliente final quiero registrar un pago o abono para avanzar mi reserva. | Must | Obligatorio | Todo |
| HU-MVP1-007 | Como plataforma quiero impedir mezcla de datos entre tenants en autenticacion y reservas. | Must | Obligatorio | Todo |
| HU-MVP1-008 | Como colaborador/administrador quiero contar con contrato OpenAPI y validaciones base para integrar el MVP 1. | Must | Obligatorio | Todo |
| HU-MVP1-009 | Como equipo quiero documentar Definition of Done y criterios de lanzamiento para reducir retrabajo. | Must | Obligatorio | Todo |
| HU-MVP1-010 | Como cliente final quiero recuperar mi contrasena dentro del tenant activo. | Should | Negociable | Todo |
| HU-MVP1-011 | Como cliente final quiero ver descuentos vigentes aplicados en la oferta y en la reserva. | Should | Negociable | Todo |
| HU-MVP1-012 | Como equipo quiero exponer healthcheck y consulta de tenant para soporte operativo. | Must | Obligatorio | Todo |

El compromiso principal del sprint MVP 1 son todas las historias `Must`. Las historias `Should` pueden implementarse en el mismo sprint si no ponen en riesgo el flujo principal ni la fecha de demo.

## Historias pequenas con criterios de aceptacion comprobables

### HU-MVP1-001 - Consultar oferta disponible

- AC1: dado un `X-Tenant-Id` valido, cuando consulto `GET /catalog/services`, entonces recibo una lista de servicios del tenant indicado.
- AC2: cada item de oferta devuelve al menos `id`, `type`, `name`, `basePrice`, `availabilityPolicy` y `availableForSale`.
- AC3: si un servicio tiene descuentos vigentes visibles en Fase 1, entonces la respuesta los incluye en `activeDiscounts`.
- AC4: la consulta no devuelve informacion de otro tenant.

### HU-MVP1-002 - Registro de cliente final

- AC1: dado un tenant activo, cuando envio `POST /auth/register` con nombre, apellido, correo y contrasena validos, entonces el sistema crea la cuenta en ese tenant.
- AC2: si el correo ya existe en ese mismo tenant, entonces el sistema responde conflicto `409`.
- AC3: si el mismo correo existe en otro tenant distinto, entonces no bloquea el registro por si solo.

### HU-MVP1-003 - Inicio de sesion por tenant

- AC1: dado un tenant previamente determinado, cuando envio `POST /auth/login` con credenciales correctas, entonces recibo token de acceso.
- AC2: si el correo o la contrasena no pertenecen al tenant indicado, entonces la respuesta es `401`.
- AC3: una sesion iniciada no debe dar acceso a reservas de otro tenant.

### HU-MVP1-004 - Crear reserva

- AC1: dado un cliente autenticado, cuando envio `POST /reservations` con servicio, fecha, titular, acompanantes y modalidad de pago, entonces se crea una reserva.
- AC2: la respuesta incluye `reservationStatus`, `paymentStatus`, `projectedValue`, `finalValue` y `pendingBalance`.
- AC3: si el recurso no tiene capacidad disponible, entonces la respuesta es `409`.
- AC4: no se permite duplicidad de documento dentro de la misma reserva para acompanantes.

### HU-MVP1-005 - Consultar estado de reserva

- AC1: dado un cliente autenticado, cuando consulto `GET /reservations/{reservationId}`, entonces veo el detalle de mi reserva dentro del tenant activo.
- AC2: la respuesta muestra estado general y estado de pago de forma diferenciada.
- AC3: si intento consultar una reserva de otro tenant o ajena al usuario autenticado, entonces la API no la expone.

### HU-MVP1-006 - Registrar pago o abono

- AC1: dado una reserva en estado que admite pago, cuando envio `POST /reservations/{reservationId}/payments` con monto y modalidad, entonces el pago o abono queda registrado.
- AC2: si la modalidad es `transferencia` y se adjunta soporte, entonces el estado de pago puede quedar `En validacion`.
- AC3: si el monto no completa la condicion de confirmacion, entonces el estado de pago queda `Parcial`.
- AC4: si la reserva ya no admite pagos por estado, entonces la respuesta es `409`.

### HU-MVP1-007 - Aislamiento por tenant

- AC1: toda operacion autenticada exige `X-Tenant-Id`.
- AC2: ninguna consulta o escritura permite mezclar reservas, usuarios o pagos entre tenants.
- AC3: los errores de acceso cruzado no deben exponer datos de otros tenants.

### HU-MVP1-008 - Contrato OpenAPI base

- AC1: existe un archivo `openapi.yaml` versionado en la carpeta de la sesion.
- AC2: el contrato cubre como minimo `health`, `consulta de tenant`, `auth`, `catalog`, `reservations` y `payments`.
- AC3: cada endpoint comprometido incluye request, response y codigos de error basicos.

### HU-MVP1-009 - Definition of Done

- AC1: existe una Definicion de Hecho escrita y visible para el sprint.
- AC2: la DoD incluye pruebas, revision, seguridad basica, documentacion y despliegue.
- AC3: ningun item se declara terminado si incumple la DoD.

### HU-MVP1-010 - Recuperacion de contrasena

- AC1: dado un tenant activo, cuando envio `POST /auth/password-recovery` con correo valido del tenant, entonces la solicitud queda aceptada.
- AC2: la operacion no debe afectar cuentas del mismo correo en otros tenants.

### HU-MVP1-011 - Descuentos visibles

- AC1: si existe descuento vigente para un servicio, entonces aparece en la oferta y/o respuesta de reserva.
- AC2: el valor final de la reserva refleja los descuentos aplicados.

### HU-MVP1-012 - Healthcheck y tenant lookup

- AC1: `GET /health` responde `200`.
- AC2: `GET /tenants/{tenantId}` responde informacion del tenant o `404`.

## Tareas tecnicas preparadas

| ID | Tarea | Relacion HU | AC cubiertos | Evidencia esperada |
| --- | --- | --- | --- | --- |
| TASK-MVP1-001 | Implementar resolucion y propagacion obligatoria de `X-Tenant-Id` en endpoints tenant-scoped | HU-MVP1-001, HU-MVP1-002, HU-MVP1-003, HU-MVP1-004, HU-MVP1-005, HU-MVP1-006, HU-MVP1-007 | HU-001/AC4, HU-007/AC1-AC3 | Prueba automatizada o curl que demuestre rechazo sin tenant y aislamiento entre tenants |
| TASK-MVP1-002 | Exponer `GET /health` y `GET /tenants/{tenantId}` con respuestas `200` y `404` | HU-MVP1-012 | HU-012/AC1-AC2 | Curl o prueba HTTP con respuesta exitosa y caso no encontrado |
| TASK-MVP1-003 | Implementar `POST /auth/register` con alta por tenant y conflicto `409` por correo repetido en el mismo tenant | HU-MVP1-002 | HU-002/AC1-AC3 | Prueba de registro exitoso y conflicto por duplicado intra-tenant |
| TASK-MVP1-004 | Implementar `POST /auth/login` con token y rechazo por credenciales invalidas en el tenant indicado | HU-MVP1-003 | HU-003/AC1-AC3 | Prueba de login exitoso y `401` por tenant o credenciales incorrectas |
| TASK-MVP1-005 | Implementar `POST /auth/password-recovery` sin mezclar cuentas del mismo correo entre tenants | HU-MVP1-010 | HU-010/AC1-AC2 | Evidencia de solicitud aceptada y aislamiento por tenant |
| TASK-MVP1-006 | Exponer `GET /catalog/services` con datos minimos de oferta visibles para el tenant activo | HU-MVP1-001 | HU-001/AC1-AC4 | Respuesta HTTP con lista de servicios y campos minimos |
| TASK-MVP1-007 | Incluir descuentos vigentes visibles en oferta y persistir descuentos aplicados en la respuesta de reserva cuando aplique | HU-MVP1-011 | HU-011/AC1-AC2 | Caso de prueba o respuesta ejemplo con descuentos visibles y valor final ajustado |
| TASK-MVP1-008 | Implementar `POST /reservations` con titular, acompanantes, modalidad de pago y validaciones base del contrato | HU-MVP1-004 | HU-004/AC1-AC4 | Prueba de creacion, `409` por cupo y `400` por documentos duplicados |
| TASK-MVP1-009 | Implementar `GET /reservations/{reservationId}` mostrando solo reservas visibles para el usuario autenticado dentro del tenant | HU-MVP1-005, HU-MVP1-007 | HU-005/AC1-AC3, HU-007/AC2-AC3 | Prueba de consulta propia y no exposicion de reserva ajena |
| TASK-MVP1-010 | Implementar `POST /reservations/{reservationId}/payments` con estados `En validacion`, `Parcial` y `Pagado` segun el caso | HU-MVP1-006 | HU-006/AC1-AC4 | Pruebas de pago completo, abono parcial, transferencia y rechazo por estado no pagable |
| TASK-MVP1-011 | Versionar y validar `openapi.yaml` contra las historias comprometidas | HU-MVP1-008 | HU-008/AC1-AC3 | Contrato versionado y validado por el equipo |
| TASK-MVP1-012 | Publicar y aplicar la Definition of Done del sprint en el cierre de historias | HU-MVP1-009 | HU-009/AC1-AC3 | Documento visible y checklist aplicado al menos a una historia |
