# Semana 07 · Sesión 2: contratos e integración MVP 2

Esta entrega formaliza un subconjunto de las fronteras elegidas en la [matriz de comunicación de Sesión 1](../Sesión%201/README.md). REST y eventos son los mecanismos elegidos; no se crea un `.proto` porque no hay una interacción gRPC aprobada.

## Entregables y alcance

| Entregable | Estado |
| --- | --- |
| [OpenAPI 1.0.0](contracts/openapi.yaml) | **Propuesta** para C16, C19, C21, C22 y C23. Las rutas y DTO internos aún deben implementarse en el backend Java. No sustituye las rutas actuales documentadas en [trazabilidad](../Sesión%201/trazabilidad-repos-originales.md) ni presenta el [OpenAPI académico de semana 04](../../../04-week/hu-status/Sesión%202/openapi.yaml) como API desplegada. |
| [PagoConfirmado v1](contracts/events/pago-confirmado.v1.schema.json) y [DevolucionEjecutada v1](contracts/events/devolucion-ejecutada.v1.schema.json) | Esquemas de los mensajes JSON del laboratorio RabbitMQ. El [ejemplo de pago](../Sesión%201/evento-pago.json) es el archivo que publica la demo; el [de devolución](contracts/events/devolucion-ejecutada.example.json) corresponde al segundo tipo probado. |
| [Versionado y compatibilidad](versionado-compatibilidad.md) | Reglas de evolución y revisión de cambios. |
| [Contrato impulsado por Caja](test/consumer-contract.test.mjs) | Prueba automática que captura los bytes enviados por la misma función usada por el publicador RabbitMQ y los entrega al consumidor; configurada en [CI](../../../.github/workflows/week07-contracts.yml). |
| [Historias de integración MVP 2](historias-integracion-mvp2.md) | Backlog separado de las seis historias de orquestación de semana 06. |

La cola de laboratorio sigue siendo `caja.movimientos`, durable, con DLQ `caja.movimientos.dlq`, mensajes persistentes y ACK después del commit. La identidad de negocio es `(tenantId, movementId)`; `eventId` identifica la entrega lógica. `amountMinor` expresa centavos de COP y debe caber en un entero seguro de JavaScript. Los esquemas v1 reflejan exactamente los siete campos obligatorios que usa el consumidor actual. No exigen campos nuevos que el publicador existente no produzca.

El productor Java todavía no emite eventos. El ejemplo de pago lo publica el script sintético de Sesión 1. La prueba configurada para CI verifica el archivo real de ese productor de laboratorio y el comportamiento de Caja; **no** acredita una integración de microservicios en producción ni compatibilidad de los endpoints REST con un proveedor ejecutándose. Esas verificaciones forman parte de las historias MVP 2.

## Límite del OpenAPI de esta entrega

La [preparación de Sesión 1](../Sesión%201/README.md) enumeró C01–C24 y C27 como posibles fronteras REST. Aquí se publica el contrato de **cinco consultas internas priorizadas para el camino Reservas → Operaciones → Caja de MVP 2**: C16 valida tenant, C19 consulta oferta, C21 consulta estado de reserva, y C22–C23 entregan agregados a Caja. Son las cinco rutas de `contracts/openapi.yaml`; su implementación y prueba con proveedor real están en [INT-001 a INT-003 e INT-006](historias-integracion-mvp2.md).

| Filas de la matriz de Sesión 1 | Alcance en esta entrega | Motivo |
| --- | --- | --- |
| C01–C15 | Fuera de este OpenAPI interno | Son llamadas Portal → monolito ya existentes, inventariadas en [trazabilidad](../Sesión%201/trazabilidad-repos-originales.md). El [OpenAPI de semana 04](../../../04-week/hu-status/Sesión%202/openapi.yaml) es académico y no se presenta como contrato verificado del backend actual. |
| C16, C19, C21, C22, C23 | Incluidas | Consultas internas necesarias para las historias de integración priorizadas; todas siguen propuestas. |
| C17, C18, C20, C24, C27 | Fuera de este OpenAPI interno | La matriz las identifica como propuestas, pero sus rutas, autorización o comandos todavía no están acordados como interfaz estable. Se contratarán cuando se definan esas fronteras; no se atribuyen a las cinco rutas publicadas. |
| C25–C26 | Contratadas como eventos JSON v1 | Son los dos mensajes de la cola RabbitMQ del laboratorio. |

Esta delimitación reduce el alcance frente a la preparación amplia de Sesión 1; no declara contratadas las demás interacciones REST.

## Ejecutar la prueba

Desde esta carpeta, con Node 24.11 o posterior:

```powershell
npm ci --prefix '../Sesión 1'
npm ci
npm run test:contract
```

La prueba no requiere Docker ni credenciales. Intercepta `sendToQueue` en memoria, usa `publishFile` (la función invocada por el script del productor), valida el payload serializado contra el esquema y lo consume con Caja. **CI configurada:** el workflow ejecutará los mismos comandos en PR o push que afecten contrato, consumidor, archivos y código del productor o workflow; también admite ejecución manual. Fallará si el productor emite un payload incompatible, si Caja no puede consumirlo o si se pierde la deduplicación. **CI remota verificada:** pendiente hasta publicar la rama y revisar el resultado de GitHub Actions. La prueba RabbitMQ de Sesión 1 cubre transporte y reentrega por separado.
