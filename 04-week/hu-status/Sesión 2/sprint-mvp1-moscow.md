# Sprint MVP 1 - Priorizacion MoSCoW

## Supuesto de planificacion

El MVP 1 se lanzara la semana siguiente, por lo que el sprint debe comprometer solo el flujo minimo que permita una demostracion funcional y usable del canal digital en un tenant.

## Must Have

- Determinacion obligatoria de `tenant` activo por encabezado o contexto de acceso.
- `GET /health` para soporte operativo.
- `GET /tenants/{tenantId}` para validacion de tenant activo.
- Registro de cliente final por tenant.
- Login de cliente final por tenant.
- Consulta de oferta disponible por tenant.
- Creacion de reserva con titular, acompanantes y modalidad de pago.
- Consulta de estado de reserva propia.
- Registro de pago o abono de reserva.
- Aislamiento estricto de datos entre tenants.
- Contrato `openapi.yaml` versionado.
- Definicion de Hecho escrita y aceptada por el equipo.

## Should Have

- Recuperacion de contrasena por tenant.
- Visualizacion de descuentos vigentes en oferta y respuesta de reserva.
- Manejo base de soporte de transferencia con estado `En validacion`.
- Validaciones de cupo con respuesta de conflicto `409`.
- Auditoria minima de autenticacion y operaciones sensibles.

## Could Have

- Filtros por fecha y categoria en catalogo.
- Mensajes funcionales mas detallados para errores comunes.
- Evidencias de prueba manual en Postman o capturas del sprint.
- Datos mock o seed para demo del tenant principal.

## Won't Have en MVP 1

- Modificar reserva desde autogestion.
- Cancelar reserva desde autogestion.
- Reagendar reserva desde autogestion.
- Devoluciones monetarias operativas completas.
- Dashboard administrativo mensual.
- Caja diaria completa con cierres.
- Roles opcionales por tenant con interfaz propia.
- Pasarela de pagos, tarjeta, banco o integraciones externas.
- Facturacion electronica.
- White-label avanzado por tenant.

## Compromiso priorizado del sprint

El compromiso obligatorio del sprint MVP 1 se limita a los elementos `Must Have`.

Los elementos `Should Have` pueden modelarse desde ahora en el contrato o en el backlog refinado, pero no bloquean el inicio ni la aceptacion del MVP 1 si el flujo principal ya cumple su objetivo.

Si la capacidad del sprint se reduce, primero se preservan determinacion de tenant, healthcheck, consulta de tenant, autenticacion por tenant, consulta de oferta, creacion de reserva, consulta de reserva y registro de pago o abono.
