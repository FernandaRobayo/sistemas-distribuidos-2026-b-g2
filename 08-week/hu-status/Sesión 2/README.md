# Semana 8 · Sesión 2 — Planificación final del MVP 2

**Producto:** Multitour. **Tenant de validación:** Travesía Natural.

Entregable de planificación con alcance MUST/SHOULD/POSTERIOR definido y **consenso final de estimación aceptado por Maria Fernanda Robayo y Jhon Sebastian Molina**, según confirmación expresa del usuario en esta conversación. MUST: **49 SP**; SHOULD: **8 SP**; total: **57 SP**. La disponibilidad normal de ambos integrantes respalda una previsión cualitativa; el compromiso funcional no equivale a capacidad numérica confirmada para un sprint. La dinámica real de Planning Poker queda registrada en §7 con los resultados proporcionados por el equipo. No acredita implementación ni aceptación de historias.

## 1. Fuentes de verdad y evidencia comprobada

| Fuente | Uso y límite |
|---|---|
| [PDR v1.9](../PDR_Multi_tour_v1.9.md) | Reglas funcionales superiores: RF-009, RN-OPE-001, RN-ATR-001, §9/17 y CA-027. Su cierre documental continúa condicionado por §24. |
| [Sesión 1](../Sesión%201/README.md) | Registro de ejecución, antecedentes y correcciones frente al PDR; no prueba aceptación del sprint. |
| [ADR-004](../../../../multi-tour-docs/multi-tour-docs/05-architecture/decisions/records/ADR-004-backend-microservices-macrodomain-split.md) y [arquitectura vigente](../../../../multi-tour-docs/multi-tour-docs/05-architecture/overview.md) | Cuatro servicios objetivo, extracción gradual y Operaciones y Costos primero. |
| [ADR-003](../../../../multi-tour-docs/multi-tour-docs/05-architecture/decisions/records/ADR-003-tenant-isolation-strategy.md) | Aislamiento por tenant dentro de cada servicio. No autoriza compartir tablas entre servicios. |
| [Historias ORQ](../../../06-week/hu-status/Sesión%202/historias-orquestacion.md) y [historias INT](../../../07-week/hu-status/Sesión%202/historias-integracion-mvp2.md) | IDs, AC y dependencias originales; las adaptaciones del incremento se delimitan aquí sin editar las fuentes. |
| [Contrato de Operaciones y Costos](../../../../multi-tour-docs/multi-tour-docs/07-api/contracts/openapi/operations-costs-service.yaml) | Documenta módulo extraído, PostgreSQL propio y ReservationClient mediante lectura estática histórica. Declara capa web ausente y brechas de seguridad; no prueba servicio desplegado. |
| [Contrato Comercial y Reservas](../../../../multi-tour-docs/multi-tour-docs/07-api/contracts/openapi/commercial-reservations-service.yaml) | Consulta existente y ReservationResponse parcial; estados y seguridad requieren revisión frente al PDR. |
| [Modelos: ownership y persistencia](../../../../multi-tour-docs/multi-tour-docs/06-data/models.md) y [guía API](../../../../multi-tour-docs/multi-tour-docs/07-api/guidelines.md) | PostgreSQL documentado para ejecución/costos; normas y propuestas de interfaz se distinguen de implementación. |
| [Contratos académicos de semana 7](../../../07-week/hu-status/Sesión%202/README.md) y [matriz de comunicación](../../../07-week/hu-status/Sesión%201/README.md) | C21 integration-status es propuesta; laboratorio de eventos y contratos no son evidencia del sprint actual. |
| [Backlog B1](../../../01-week/hu-status/Sesión%202/BACKLOG-MVP1.md) y [tablero B4](../../../04-week/hu-status/Sesión%202/sprint-mvp1-board.md) | Referencias funcionales históricas del mapa, sin inferir aceptación actual. |

Prevalencia: PDR → ADR-004 → arquitectura compatible → ORQ/INT → contratos y evidencia histórica. Los enlaces al repositorio documental hermano requieren conservar la estructura local; no son archivos incluidos en este repositorio académico.

| Estado | Decisión / evidencia |
|---|---|
| CONFIRMADO | Servicios objetivo: platform-service; commercial-reservations-service; operations-costs-service; cash-reports-service. Un bounded context no equivale a un servicio. |
| CONFIRMADO | Operaciones y Costos se extrae primero. Plataforma, Comercial/Reservas y Caja/Reportes permanecen en el monolito durante este incremento. |
| CONFIRMADO | Persistencia independiente PostgreSQL de Operaciones y Costos documentada por arquitectura/modelos y contrato. No se afirma despliegue probado. |
| CONFIRMADO | C19/C20/C27 son internas al Comercial objetivo; C21 cruza la frontera Operaciones → Reservas al separar procesos. |
| DEFINIDO PARA EL MVP 2 | Primer recorrido: registrar y consultar un costo operacional asociado a una ejecución ya iniciada, con consulta remota real a Reservas y conservación tras recreación. |
| PENDIENTE DE DECISIÓN | Mecanismo concreto de identidad entre procesos, evidencia técnica de ejecución iniciada y política de consistencia/fallo del comando; incertidumbres incluidas en la estimación consensuada; resolver antes de implementar el contrato y aceptar la integración. |

La afirmación de MongoDB en D-C6 del contrato operativo no coincide con la asignación PostgreSQL de arquitectura/modelos consultados. Se conserva PostgreSQL para este incremento; no se inventa una decisión de uso de MongoDB. Java/Go, PostgreSQL/MongoDB y cuatro Micro Frontends siguen siendo requisitos globales del PDR §18: este corte no acredita toda la Fase 1.

## 2. Corte mínimo, D-01 y objetivo

**D-01: base de transición definida para este alcance por la instrucción de cierre; especificación técnica todavía condicionada.**

**Actor autorizado → Operaciones y Costos extraído → consulta Reservas en monolito → validación → escritura en PostgreSQL propio → consulta del costo → recreación del contenedor conservando volumen → nueva consulta.**

Se usa como base transitoria **ReservationClient.getById(tenantId, reservationId)**, documentado en D-C5 del contrato operativo. Reutiliza cliente y consulta existentes; no obliga a crear primero el integration-status académico. Es una elección de base para planificación, no una afirmación de suficiencia ni de implementación terminada. C21 conserva su significado de frontera aunque cambie la ruta propuesta de la historia histórica.

La respuesta parcial de Reservas identifica reserva/tenant y expone estados; **ni reservationStatus ni paymentStatus aislados demuestran todas las precondiciones**. El contrato actual tampoco demuestra por sí solo ejecución iniciada. Antes de implementar hay que trazar ese hecho a la ejecución propia y su relación con la reserva/salida, comprobar identidad y semántica, y acordar los ajustes mínimos del contrato existente. C21 integration-status solo contiene reservationId/status: tampoco resuelve automáticamente esa insuficiencia. Si la consulta reutilizada no puede proporcionar lo necesario, se detiene la aceptación del corte y se revisa el contrato; no se declara la alternativa académica suficiente sin evidencia.

Se limita RF-009 a un **costo operacional interno, distinto del valor comercial y sin desembolso de caja en este escenario**. Registrar un gasto o pago real que mueva dinero exigiría la coordinación de caja de RN-OPE-001/RN-CAJ-001 y queda fuera de este recorrido. No se suprime ese requisito del producto.

| Elemento | Definición del incremento y aceptación por demostrar |
|---|---|
| Precondición funcional | Ejecución ya iniciada, reserva y salida relacionadas, tenant válido y actor Administrador del tenant / Colaborador operativo autorizado (RF-009). Fixture controlado y trazable; no basta cambiar un status ni inventar un inicio real. |
| Datos previos | Tenant, identidad, reserva, salida, parametrización aplicable y ejecución iniciada se preparan conforme al PDR. La reserva/pago y el inicio completo no se desarrollan de nuevo en este corte; su disponibilidad debe verificarse. Preparar fixtures no acredita esas funcionalidades del producto. |
| Consulta remota | getById sobre Reservas en monolito. Sin acceso directo a sus tablas desde Operaciones. |
| Persistencia | Costo en PostgreSQL de Operaciones, ligado al tenant y ejecución/reserva conforme al modelo; lectura posterior por su API, mismo registro tras recreación sin eliminar volumen. |
| Entrada/salida existente | RegisterOperationCostRequest y OperationCostResponse del contrato operativo son referencias existentes; faltan ajustes de seguridad y suficiencia funcional. No se crean DTO ni rutas en esta planificación. |
| Autorización y auditoría | Verificación en servidor de identidad, tenant y permiso; actorId enviado en el cuerpo no prueba identidad. Conservar trazabilidad según PDR §17 y límites de CA-030. Resolver su mecanismo sin extraer Plataforma ni añadir broker por inferencia. |
| Rechazos | Reserva ajena/inexistente, actor no autorizado o ejecución no demostrada: sin escritura del costo y sin exposición de datos ajenos. |
| Fallo de dependencia | Propuesta: no confirmar ni persistir un costo si no pudo validarse la precondición remota. Timeout, respuesta, reintentos y ventana de consistencia deben acordarse en contrato; no se inventa un código HTTP existente. |
| Tiempo y recuperación | CA-027: zona e instante del tenant y conservación histórica. No imponer America/Bogota a todos. Aplicar seguridad/retención del PDR; no declarar operación empresarial por una demo. |

**OBJETIVO DEL SPRINT DEFINIDO PARA LA PLANIFICACIÓN DEL MVP 2**

La instrucción actual autoriza definir el alcance y su objetivo; no fija fechas de inicio/fin del sprint ni demuestra capacidad numérica. La fecha de planificación y disponibilidad cualitativa se registran en §7/8.

> Demostrar que un actor autorizado registra y consulta un costo operacional de una ejecución previamente iniciada en Operaciones y Costos extraído, validando su reserva por HTTP contra el monolito, conservando el mismo registro en PostgreSQL propio tras recrear el contenedor y rechazando solicitudes ajenas, no autorizadas o no validables sin escribir el costo.

Es verificable con un recorrido positivo, lectura tras recreación y casos negativos trazables. La prueba integral utiliza proveedor real; los mocks preparan el desarrollo y no sustituyen esa aceptación. No se promete idempotencia de reintentos sin diseñarla ni se confunde una escritura por comando con garantía distribuida.

## 3. Story Map y Release Line del MVP 2

Recorrido completo: **Preparación → Acceso → Reserva → Pago → Ejecución → Control**. El orden funcional no cambia el orden físico de migración.

| Actividad completa | Historias relacionadas / fuente | Prioridad del corte | Dentro de la Release Line del MVP 2 | Opcional / posterior |
|---|---|---|---|---|
| Preparación | HU-01 B1; ORQ-001/002/003 | MUST — MVP 2 | Entorno aislado, secretos, identidad/datos válidos y salud del corte. | ORQ-005 recuperación ampliada: SHOULD; promoción ORQ-006: POSTERIOR. |
| Acceso | HU-02/03 B1; HU-MVP1-010 B4; controles de ORQ-002 e INT-002 | MUST como prerrequisito de seguridad | Actor autorizado para el comando; comprobar acceso, sin rehacer registro/recuperación. | Desarrollo completo de esos recorridos: POSTERIOR en este incremento. |
| Reserva | HU-05 B1 / HU-MVP1-004 B4; INT-001/002 | MUST para consulta de INT-002 | Reserva existente del tenant consultada remotamente. | INT-001 completo y alta/cupo: POSTERIOR; fixture y validaciones necesarias son obligatorios. |
| Pago | HU-06/07 B1; HU-MVP1-005/006 B4; INT-004 | Prerrequisito del inicio previo | Datos previos coherentes con PDR, sin simular aceptación de historias de pago. | Nuevos flujos de pago/outbox: POSTERIOR. |
| Ejecución | INT-002 refinada; RF-009/RN-OPE-001 | MUST — MVP 2 | Registrar/consultar costo sin desembolso sobre ejecución iniciada; persistencia propia. | Inicio/fin completo de salida y gastos de caja: POSTERIOR. |
| Control | ORQ-004/005; INT-006 delimitada; INT-003/005 | MUST para verificar este corte | Prueba de integración, aislamiento, fallos y conservación del costo. | Respaldo/restauración ampliada: SHOULD; consolidación/mensajería: POSTERIOR. |

**Release Line del MVP 2:** preparación y acceso autorizados → reserva/ejecución previas verificables → consulta remota de Reservas → registro y lectura de costo en Operaciones → conservación y negativos comprobados. Todo ese recorrido debe funcionar junto; no se entrega solo una lista de contenedores. Esta Release Line delimita el compromiso funcional; su programación temporal no se deduce de la disponibilidad normal registrada en §8.

No se seleccionan automáticamente las HU históricas del mapa ni se cuentan sus equivalencias dos veces. HU-05 B1 no es HU-05 UI/UX del reporte de semana 7. Los caminos alternativos de cancelación, reprogramación, descuentos y recuperación permanecen en el producto; no se eliminan del PDR por quedar fuera del incremento.

## 4. Historias candidatas y alcance de las partes

Esta es la **clasificación definitiva del corte MVP 2**, definida bajo la autorización actual; no altera prioridades históricas ni acredita ejecución. Los SP tienen consenso expreso de ambos integrantes. No se inventan IDs oficiales. Una parte delimitada no equivale a completar la historia padre.

| Historia | Clasificación final | Alcance y justificación | Límite de aceptación |
|---|---|---|---|
| ORQ-001 | MUST — MVP 2 | Entornos aislados que alojen monolito, Operaciones y sus almacenamientos separados; conservar AC1–4 de aislamiento/coexistencia adaptando inventario. ADR-004. | Los tres servicios del Compose histórico no describen la topología nueva; inventario/puertos y comandos se concretan en implementación. |
| ORQ-002 — configuración/secretos | MUST — MVP 2 | AC1–3 adaptados a los componentes del corte; seguridad PDR §17. | Secretos externos, obligatorios, separados y sin exposición. |
| ORQ-002 — aprovisionamiento/datos | MUST — MVP 2 | AC4 con §9/RF-016: actor autorizado, sin cuentas públicas de demo y fixtures trazables. | No se infiere disponibilidad de datos válidos ni se debilita activación. |
| ORQ-003 | MUST — MVP 2 | Salud, fallo y recuperación de BD/proveedor; conserva intención de AC1–4. | Diferenciar proceso, disponibilidad y negocio; no afirmar que /health y Actuator sean equivalentes. |
| ORQ-004 — recorrido operativo | MUST — MVP 2 | Adaptación delimitada para probar el recorrido API del §2 en el entorno. La extracción web y el cliente de prueba tienen esfuerzo explícito. | No acredita el padre completo: portal, alta de tenant y smoke original quedan posteriores salvo evidencia disponible. No se inventa pantalla de costos. |
| ORQ-005 — conservación | MUST — MVP 2 | AC1: mismo costo tras recreación con volumen conservado; demuestra persistencia. | No completa respaldo/restauración AC2–4 del padre. |
| ORQ-005 — respaldo/restauración | SHOULD — si existe capacidad | AC2–4: ensayo aislado, migraciones, privacidad y política PDR §17. | Obligatorio antes de operación/publicación que lo requiera; diferir ensayo ampliado no exime controles de datos ni autoriza producción. |
| ORQ-006 | POSTERIOR | Promoción completa DEV→QA→PROD no es necesaria para demostrar el corte integrado en entorno académico controlado. | No hay publicación empresarial autorizada; mantiene AC y dependencias originales. |
| INT-001 | POSTERIOR | Su flujo completo de alta/tenant/oferta no es la funcionalidad entregada; C19 es interna por ADR-004. | El prerrequisito de tenant/reserva válidos pasa a verificarse en fixture y proveedor; no se da por cumplida la historia. |
| INT-002 | MUST — MVP 2 | RF-009: consultar Reservas y registrar costo. Reutilizar getById como base C21; ajustar AC1 de ruta y AC3 a precondiciones del costo. | Adaptación pendiente de aprobación técnica; no basta estado permitido. Se excluye inicio completo de salida. |
| INT-003 | POSTERIOR | Agregados Caja/Reservas/Costos amplían el alcance. | C22/C23 requieren resolver semántica y CA-027 antes de implementación. |
| INT-004 | POSTERIOR | Outbox y coordinación económica no se necesitan para costo sin desembolso. | Reservas conserva estado económico; Caja sus movimientos. |
| INT-005 | POSTERIOR | Conciliación auxiliar depende del productor y no demuestra el corte elegido. | Laboratorio histórico no acredita integración actual ni sustituye caja. |
| INT-006 — contratos del corte | MUST — MVP 2 | Parte de compatibilidad proveedor/consumidor, negativos, aislamiento y ruptura para las interfaces del §5. | No completa las cinco rutas/eventos ni la promoción del padre; su resto es POSTERIOR. |

**Unidades de planificación:** ocho MUST y una SHOULD, contando las partes una sola vez; no son nueve historias oficiales nuevas ni nueve historias aceptadas. Los padres ORQ-002/005 no se estiman adicionalmente. Las adaptaciones de ORQ-004 e INT-006 tampoco se presentan como aceptación de sus AC originales completos.

Trabajo incluido, no gratuito: completar capa web del servicio extraído, verificar migraciones y ownership, adaptar consulta/contratos, identidad y auditoría, datos de ejecución, acceso de prueba, fallos y compatibilidad. INT-002 concentra la adaptación funcional; ORQ-001/002/003 el despliegue; ORQ-004 el recorrido; INT-006 sus pruebas de contrato. No contabilizar dos veces tareas compartidas entre estas unidades.

## 5. Dependencias, contrato primero y simulaciones

| Origen | Destino | Tipo | Contrato | Estado | Simulación | Orden |
|---|---|---|---|---|---|---|
| Cliente de prueba autorizado | Operaciones y Costos | REMOTA | Contrato operativo existente; formas de costo y namespace objetivo D-C1 | REQUIERE AJUSTE | Casos válidos, identidad inválida, tenant ajeno; planificados | 1 contrato; 2 stub; 3 capa web; 4 integración; 5 prueba |
| Operaciones y Costos | Reservas en monolito | REMOTA / TRANSITORIA (C21) | getById; contrato Comercial/Reservas + D-C5 operativo | REQUIERE AJUSTE | Reserva válida/ajena/inexistente, datos incompletos, timeout; planificados | 1 contrato; 2 stub; 3 proveedor/cliente; 4 llamada real; 5 compatibilidad |
| Comando de costo | Ejecución propia y persistencia del servicio | INTERNA; adaptador a BD propia | Modelo y migraciones documentados; precondición RF-009 | NO REQUIERE CONTRATO REMOTO entre dominios | Fixture trazable, ejecución ausente; luego PostgreSQL real | Antes de escritura y de prueba de conservación |
| Reservas | Catálogo/descuentos en monolito/Comercial | INTERNA (C19/C20/C27) | Interfaces internas existentes por verificar cuando apliquen | NO REQUIERE CONTRATO REMOTO | Fixture de datos válidos; no nuevo microservicio | Preparación de prerrequisitos |
| Operaciones y Costos | Autoridad de identidad/auditoría aún en monolito, si se requiere llamada | TRANSITORIA / REMOTA, condicionada al mecanismo | Interfaz concreta no cerrada por ADR-004 | CONTRATO PENDIENTE | Rechazo de identidad/permiso/tenant y fallo; planificado tras elección | Resolver antes de aprobar interfaces; incertidumbre incluida en los 13 SP consensuados de INT-002 |

La llamada a identidad no se impone como dependencia adicional: ADR-004 contempla validar JWT independientemente o consultar el monolito durante la transición. Debe elegirse y especificarse un mecanismo compatible, sin inventar endpoint ni asumir un contexto de seguridad compartido entre procesos. Auditoría sigue siendo obligatoria; su cumplimiento debe concretarse sin imponer transporte nuevo.

**Estados de contrato:** UTILIZABLE significa reutilizable para su alcance comprobado; REQUIERE AJUSTE indica contrato existente insuficiente/desalineado; CONTRATO PENDIENTE indica interfaz no acordada; NO REQUIERE CONTRATO REMOTO corresponde a interacción interna. Ninguna frontera remota del corte se certifica hoy como lista para producción. Los JSON Schema de eventos son UTILIZABLES para el laboratorio histórico, que queda posterior.

Para **cada frontera remota seleccionada** se aplicará:

1. **Contrato:** validar precondiciones y fuentes de cada dato, identidad/tenant, respuestas, errores, consistencia y versión. Reutilizar DTO/rutas documentados; cambios concretos se harán durante implementación, no en este entregable.
2. **Mock/Stub:** derivar ejemplos del contrato acordado y automatizar los casos de la tabla. Hoy están planificados, no implementados.
3. **Implementación:** proveedor transitorio y consumidor conforme al contrato; completar capa web independiente, seguridad y persistencia. No confundir el esqueleto documentado con servicio terminado.
4. **Integración:** sustituir stub por Reservas real en otro proceso y PostgreSQL propio; sin tablas compartidas ni importaciones de dominio entre servicios.
5. **Prueba:** positivo, ajeno/inexistente, permiso, ejecución ausente, indisponibilidad, compatibilidad y lectura tras recreación. Guardar candidato, entorno, resultados sanitizados y vínculos a PR/aceptación cuando existan.

**Brechas documentadas que entran en el esfuerzo:** capa web ausente (G-06), identidad/tenant (G-01), acoplamientos que afecten al corte (G-05) y configuración de puerto (G-09: objetivo 8084, código histórico 8082). La respuesta parcial de Reservas y estados heredados no son garantía de cumplimiento del PDR. No se añade listado pending-execution al recorrido mínimo.

**Contratos posteriores:** C22/C23 fijan America/Bogota universalmente y REQUIEREN AJUSTE frente a CA-027: zona del tenant, instantes históricos, cambios prospectivos y prohibición de activar cambio con caja Abierta/Pendiente de cierre. Travesía Natural puede usar America/Bogota; no todos los tenants. C25/C26 y outbox requieren coordinación del hecho económico, no solo schemas válidos. OpenAPI y JSON Schema permanecen intactos.

## 6. Secuencia final de implementación propuesta

1. Resolver los detalles técnicos acotados de D-01 y aprobar adaptaciones/AC; contratos antes que código.
2. Preparar ORQ-001 y ambas partes de ORQ-002: componentes, secretos, identidad y fixture de ejecución válida. Contratos y mocks pueden prepararse en paralelo.
3. ORQ-003: salud y recuperación, con semántica diferenciada para proveedor remoto y BD.
4. INT-002: completar extracción del comando de costo y consulta, persistencia y validación C21; desarrollar con mocks y luego integrar Reservas real.
5. ORQ-004 delimitada e INT-006 delimitada: recorrido por API, compatibilidad, seguridad, fallos y controles funcionales.
6. ORQ-005 conservación: verificar mismo registro tras recreación. Si cabe, ejecutar también respaldo/restauración SHOULD.
7. Revisar AC/DoD y registrar evidencia/aceptación; promover a otro destino solo con el alcance de ORQ-006 y controles correspondientes.

La dependencia histórica INT-001 → INT-002 se satisface para este **corte adaptado** mediante datos y validaciones verificables del proveedor, no declarando INT-001 terminada. INT-006 original depende de INT-001–005 y ORQ-006: aquí solo se planifica la parte de interfaces del corte, cuyo resto sigue pendiente. ORQ-004 original y la configuración de tres contenedores de ORQ-001 se conservan como antecedentes, no como topología de extracción.

## 7. Planning Poker y consenso final de estimación

**Fecha de la sesión de planificación:** sábado 26 de septiembre de 2026 (2026-09-26), proporcionada por el equipo mediante el usuario. Esta fecha no establece el inicio ni el fin del sprint.

**Fuente del registro:** resultados de la sesión real de Planning Poker proporcionados por el equipo mediante el usuario en el adjunto «CIERRE DEFINITIVO — SEMANA 8 · SESIÓN 2». Participaron Maria Fernanda Robayo y Jhon Sebastian Molina; se transcriben únicamente los votos, rondas y discusiones reportados. El consenso previo se conserva.

**Maria Fernanda Robayo:** Aprobado, según confirmación del usuario.

**Jhon Sebastian Molina:** Aprobado, según confirmación del usuario.

**Consenso final:** Aprobado.

Escala utilizada: **1, 2, 3, 5, 8, 13**. Sesión realizada el **sábado 26 de septiembre de 2026**. Los resultados reportados acreditan la dinámica de estimación: primera ronda para nueve unidades y segunda ronda para las cuatro con diferencias. «—» indica que no se reportó segunda ronda para ese ítem.

| Ítem | María Ronda 1 | Jhon Ronda 1 | ¿Requirió discusión? | María Ronda 2 | Jhon Ronda 2 | Consenso final |
|---|---:|---:|---|---:|---:|---:|
| ORQ-001 | 5 | 5 | No | — | — | 5 |
| ORQ-002: configuración/secretos | 3 | 3 | No | — | — | 3 |
| ORQ-002: aprovisionamiento/datos | 8 | 5 | Sí | 8 | 8 | 8 |
| ORQ-003 | 5 | 5 | No | — | — | 5 |
| ORQ-004: recorrido operativo | 5 | 8 | Sí | 5 | 5 | 5 |
| ORQ-005: conservación | 2 | 2 | No | — | — | 2 |
| INT-002: costo e integración C21 | 13 | 8 | Sí | 13 | 13 | 13 |
| INT-006: contratos del corte | 8 | 8 | No | — | — | 8 |
| ORQ-005: respaldo/restauración | 8 | 5 | Sí | 8 | 8 | 8 |

Discusiones reportadas:

- **ORQ-002 aprovisionamiento/datos:** la diferencia estuvo asociada a la incertidumbre de preparación de identidad autorizada y datos coherentes de tenant, reserva y ejecución iniciada. Consenso: **8 SP**.
- **ORQ-004 recorrido operativo:** se discutió la complejidad del recorrido end-to-end, integración real y casos negativos. Consenso: **5 SP**.
- **INT-002 costo e integración C21:** se consideró la incertidumbre asociada con integración C21, identidad, precondiciones, persistencia y manejo de fallos. Consenso: **13 SP**.
- **ORQ-005 respaldo/restauración:** se discutió el trabajo adicional de recuperación, comprobación de datos, migraciones y privacidad. Consenso: **8 SP**.

Estimaciones por prioridad, sin sumar nuevamente las historias padre:

| Unidad | Prioridad | Consenso SP | Justificación técnica |
|---|---|---|---|
| ORQ-001 | MUST | 5 | Adaptar topología, coexistencia y aislamiento de entornos/almacenamiento. |
| ORQ-002: configuración/secretos | MUST | 3 | Configuración obligatoria, separación de credenciales y ausencia de filtraciones. |
| ORQ-002: aprovisionamiento/datos | MUST | 8 | Identidad autorizada y fixture coherente de tenant, reserva y ejecución iniciada. |
| ORQ-003 | MUST | 5 | Salud, fallo y recuperación de BD/proveedor sin confundir proceso con negocio. |
| ORQ-004: recorrido operativo | MUST | 5 | Prueba end-to-end por API y rechazos con proveedor real. |
| ORQ-005: conservación | MUST | 2 | Consultar el mismo costo tras recreación conservando volumen. |
| INT-002: costo e integración C21 | MUST | 13 | Capa web, consulta, precondiciones, identidad, persistencia y fallos; mayor incertidumbre. |
| INT-006: contratos del corte | MUST | 8 | Compatibilidad de proveedor/consumidor, aislamiento, negativos y ruptura. |
| ORQ-005: respaldo/restauración | SHOULD | 8 | Restauración aislada, datos/migraciones, recuperación y privacidad. |

**Total MUST: 49 SP. Total SHOULD: 8 SP. Total general: 57 SP.**

Los SP se conservan exactamente como fueron aceptados. No se estiman otra vez los padres ni se asignan puntos al trabajo posterior. Si se divide o modifica posteriormente una unidad, no se prorratean sus SP arbitrariamente: requiere nueva estimación del equipo. Los riesgos de D-01 permanecen explícitos pese al consenso numérico.

## 8. Capacidad y compromiso funcional definitivo del MVP 2

**VELOCIDAD HISTÓRICA NO DISPONIBLE**. No equivale a cero. Integrantes confirmados: **Maria Fernanda Robayo y Jhon Sebastian Molina**. Disponibilidad reportada por el equipo para la planificación del 2026-09-26: **normal para ambos integrantes**, exclusivamente cualitativa. No se proporcionaron horas ni fechas de inicio/fin del sprint; no se deducen ausencias u otras obligaciones.

Se mantienen las ocho unidades MUST, **49 SP**, como alcance necesario del recorrido documentado. No existe evidencia para afirmar que 49 SP caben —o que son excesivos— para este equipo en un sprint. La decisión conservadora consiste en excluir el SHOULD del compromiso obligatorio, no incorporar Caja/reportes/mensajería/promoción y mantener un único recorrido de costo sobre ejecución previa.

No se reduce artificialmente el total quitando seguridad, datos válidos, persistencia o pruebas. ORQ-001/002/003 sostienen el entorno y sus precondiciones; INT-002 entrega la funcionalidad; ORQ-004 e INT-006 demuestran integración/contratos; ORQ-005 conservación demuestra durabilidad. Quitar una unidad completa dejaría sin cobertura una parte del alcance definido. Un corte técnico menor dentro de esas unidades exigiría delimitar y reestimar sus partes; no se trasladan los puntos aceptados a un alcance distinto.

La previsión inicial es cualitativa: INT-002 concentra riesgo de identidad, precondiciones y contrato; aprovisionamiento e integración dependen de resolverlo. Las pruebas se preparan desde el contrato, y la integración real precede a la aceptación. La disponibilidad normal de ambos integrantes es el insumo cualitativo de esta previsión conservadora: sostener el único recorrido MUST y mantener SHOULD opcional. No permite prometer una cantidad de SP por sprint ni una fecha de entrega. Si la capacidad resulta insuficiente, se debe negociar el período o refinar un recorrido menor conservando los controles y reestimando sus unidades.

| Dato | Registro |
|---|---|
| Integrantes | Maria Fernanda Robayo; Jhon Sebastian Molina |
| Fecha de planificación | Sábado 26 de septiembre de 2026 (2026-09-26), según información del equipo. |
| Disponibilidad de Maria Fernanda Robayo | Normal; información cualitativa proporcionada por el equipo. |
| Disponibilidad de Jhon Sebastian Molina | Normal; información cualitativa proporcionada por el equipo. |
| Horas y período de ejecución del sprint | No proporcionados; la fecha de planificación no los sustituye. |
| Estimación consensuada | MUST 49 SP; SHOULD 8 SP; total 57 SP. |
| Velocidad histórica | VELOCIDAD HISTÓRICA NO DISPONIBLE |
| Previsión inicial | Un recorrido end-to-end, SHOULD excluido del compromiso obligatorio; riesgos/dependencias descritos, viabilidad temporal sin confirmar. |
| Límite de la previsión | Disponibilidad normal registrada, sin capacidad numérica demostrada; 49 SP son alcance estimado, no velocidad ni capacidad. |

Este primer compromiso estimado servirá como línea base para obtener velocidad observada después de ejecutar el sprint, contando únicamente historias aceptadas. Los 49 SP MUST no son una velocidad medida ni una promesa de capacidad.

Velocidad futura = suma de SP de historias aceptadas que cumplen AC/DoD en el sprint. Throughput cuenta historias aceptadas, no puntos. No asignar puntos retrospectivos, convertir horas en SP ni calcular Lead/Cycle Time sin datos.

### MUST — compromiso funcional del MVP 2: 49 SP

ORQ-001 (5), ORQ-002 configuración/secretos (3), ORQ-002 aprovisionamiento/datos (8), ORQ-003 (5), ORQ-004 recorrido operativo (5), ORQ-005 conservación (2), INT-002 (13), INT-006 contratos del corte (8).

Arquitectura: **Operaciones y Costos → Reservas en monolito → PostgreSQL propio**, entendida como consulta remota a Reservas y escritura por Operaciones en su propia BD, nunca escritura a través del monolito. Resultado obligatorio: **comunicación integrada + persistencia**, con controles de §2. Ninguna historia queda aceptada por este registro.

### SHOULD — opcional: 8 SP

ORQ-005 respaldo/restauración. Solo entra con capacidad adicional confirmada; no se convierte automáticamente en MUST. No publicar ni operar datos reales sin los controles exigibles: PDR §17 exige respaldo diario, retención mínima de 30 días, RPO objetivo máximo 24 h y RTO objetivo máximo 8 h; datos eliminados no se conservan en copias más de 30 días y al restaurar se reaplica retención. El SHOULD es el ensayo ampliado del incremento académico, no permiso para incumplir esa política.

### POSTERIOR — sin SP acordados

ORQ-006, INT-001 completo, INT-003/004/005, resto de INT-006 y ORQ-004 originales; nuevos flujos de pago, inicio/fin completo y funciones de Caja. Permanecen en backlog con sus reglas/dependencias. **Sin SP acordados no significa 0 SP.**

## 9. Matriz final de cumplimiento documental

CUMPLE evalúa el requisito indicado; no certifica implementación. La fecha, participantes, disponibilidad normal, votos, discusiones y consenso están registrados a partir de información real proporcionada por el equipo. La capacidad es cualitativa; no se afirma una velocidad ni capacidad numérica.

| Requisito Sesión 2 | Estado | Evidencia |
|---|---|---|
| Story Map | CUMPLE | §3: recorrido completo, fuentes y corte funcional. |
| Prioridad | CUMPLE | §4: clasificación definitiva MUST/SHOULD/POSTERIOR. |
| Release Line | CUMPLE | §3: recorrido integrado mínimo. |
| Historias MVP 2 | CUMPLE | §4: partes delimitadas y exclusiones. |
| Dependencias ADR-004 | CUMPLE | §5: internas, remotas y transitorias. |
| Contract-first | CUMPLE | §5: contrato → stub → implementación → integración → prueba. |
| Simulaciones/mocks planificados | CUMPLE | §5: casos por frontera; implementación futura. |
| Secuencia | CUMPLE | §6: orden físico, integración y pruebas. |
| Objetivo del sprint | CUMPLE | §2: único resultado verificable definido para la planificación. |
| Velocidad histórica explícita | CUMPLE | §8: VELOCIDAD HISTÓRICA NO DISPONIBLE. |
| Fecha de planificación | CUMPLE | §7: sábado 26 de septiembre de 2026, reportado por el equipo. |
| Disponibilidad/capacidad cualitativa | CUMPLE | §8: ambos integrantes con disponibilidad normal; previsión conservadora sin horas ni conversión a SP. |
| Consenso de estimación / Story Points | CUMPLE | §7: ambos integrantes aceptan 49 MUST + 8 SHOULD = 57 SP. |
| Ejecución de Planning Poker registrada | CUMPLE | §7: nueve ítems, votos de ambos integrantes, cuatro discusiones y sus segundas rondas; resultados proporcionados por el equipo. |
| Alcance y compromiso funcional MVP 2 | CUMPLE | §8: MUST/SHOULD/POSTERIOR definitivos; no equivalen a promesa temporal. |
| Consistencia de los tres README | CUMPLE | Consenso y alcance sincronizados; ejecución de Sesión 1 separada de planificación. |

**Estado de Semana 8 · Sesión 2: LISTA PARA ENTREGA.** La planificación incluye mapa y recorrido, prioridades, Release Line, objetivo, alcance, estimación mediante Planning Poker, dependencias, contrato primero, simulaciones y secuencia. La previsión conservadora usa disponibilidad normal cualitativa y mantiene SHOULD opcional. Este cierre no declara implementado el MVP 2 ni completada la ejecución de Sesión 1.

Trazabilidad futura: actividad → historia/parte y AC/PDR → contrato/versionado → estimación/acuerdo → PR/candidato → pruebas → aceptación → métricas de Sesión 1. Los antecedentes no acreditan ejecución actual.

## DECISIONES QUE TODAVÍA DEBE TOMAR EL EQUIPO

| ID | Estado | Pendiente concreto |
|---|---|---|
| D-01 | Base arquitectónica definida; detalle técnico pendiente | Identidad, fuente verificable de ejecución iniciada, suficiencia/ajustes de getById, consistencia y fallo. Incertidumbre reconocida en INT-002; resolver antes de implementar las interfaces. |
| D-02 | Partes delimitadas y estimadas | Confirmar DoD aplicable antes de aceptación; no cerrar historias padre con partes incompletas. |
| D-05 | Alcance/objetivo/Release Line definidos; disponibilidad cualitativa registrada | Ambos integrantes reportan disponibilidad normal en la planificación del 2026-09-26. El calendario de ejecución no fue proporcionado; no deducir capacidad numérica de 49 SP ni de la fecha de planificación. |
| D-06 | CERRADA — Planning Poker ejecutado y consenso registrado | §7 contiene los resultados proporcionados por el equipo; sin pendientes de estimación para estas nueve unidades. |

D-03 (coordinación económica/mensajería) y D-04 (destino de promoción) siguen POSTERIORES; no bloquean este corte académico sin Caja ni publicación productiva.
