# Reglas de versionado y compatibilidad

## REST

El campo `info.version` de `contracts/openapi.yaml` usa SemVer. `MAJOR` cambia cuando un consumidor existente debe modificar su solicitud o interpretación: eliminar o renombrar una ruta/campo, cambiar tipos, hacer obligatorio un campo antes opcional, endurecer validaciones o cambiar el significado del importe o del período. `MINOR` añade rutas, respuestas o campos opcionales sin romper consumidores existentes. `PATCH` corrige texto, ejemplos o restricciones que ya describían el comportamiento observado, sin cambiar el contrato efectivo.

En respuestas, los clientes deben ignorar propiedades desconocidas. Los proveedores conservan nombres, tipos, unidades, semántica de errores y campos requeridos durante la misma versión mayor. Para una ruptura, se publica una ruta `/v2` paralela y se migra cada consumidor antes de retirar `/v1`; el número de versión del documento por sí solo no ofrece convivencia en ejecución. El `tenantId` de la ruta se contrasta con la identidad autorizada del token; un recurso de otro tenant responde 404. Las consultas de agregado usan el mes calendario `YYYY-MM` en `America/Bogota`, COP y centavos; no mezclan montos de distintas monedas.

Los endpoints REST de esta sesión son diseño, así que `1.0.0` versiona el contrato propuesto, no un servicio ya desplegado. Antes de declararlos implementados se necesita una prueba proveedor contra el backend Java real, además del contrato de consumidor actual.

## Eventos

El nombre de archivo `.v1.schema.json` identifica la versión mayor del payload; las revisiones menores y de parche se anotan en Git y en la descripción del PR. En v1 se mantienen los siete campos obligatorios y su significado. Se pueden añadir propiedades **opcionales** porque el consumidor ignora las desconocidas. No se pueden eliminar campos, cambiar `type`, moneda, unidad, tipo numérico, identidad o significado de `movementId`. Eso requiere esquema v2, cola o ruta de entrega versionada, consumidor v2 desplegado primero y convivencia durante la migración. Un productor v1 no empezará a publicar v2 bajo el mismo contrato sin actualizar consumidores y pruebas.

`PagoConfirmado` se emite solo por dinero confirmado. Un soporte pendiente o rechazado no lo emite. Cada abono confirmado tiene un `movementId` persistente distinto; los reintentos conservan `eventId` y contenido. `DevolucionEjecutada` exige desembolso ejecutado; registrar saldo a favor no basta. La clave `(tenantId, movementId)` evita duplicar efectos aun si aparece otro `eventId`. Reutilizar cualquiera de estas identidades con otro contenido es un conflicto que va a revisión, no una actualización silenciosa. El publicador Java futuro debe persistir esos identificadores junto con la operación y usar outbox.

## Control de cambios

En un PR que modifica contratos se actualizan esquema/OpenAPI, ejemplos, esta política si cambia la regla, historias afectadas y prueba de consumidor. La CI debe pasar. Un cambio de ruptura requiere plan de migración, período de convivencia y verificación de ambos consumidores antes de retirar la versión anterior. La revisión compara solicitudes y respuestas reales del proveedor con OpenAPI; el contrato propuesto no se da por implementado solo por aprobar la prueba de eventos.
