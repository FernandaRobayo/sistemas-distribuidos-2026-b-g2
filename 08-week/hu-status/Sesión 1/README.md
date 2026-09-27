# Semana 8 · Sesión 1 — Gestión del sprint y evidencias

## 1. Alcance y lectura del registro

La actividad requiere ejecutar un sprint con backlog priorizado, historias comprobables, límite WIP, PR por cambio, sincronización diaria y control del rendimiento. Este documento organiza fuentes comprobadas y prepara el registro de ejecución; no declara cumplida la actividad ni cerrados los hallazgos de la auditoría.

Se distinguen tres categorías:

- **Evidencia comprobada:** información respaldada por una fuente identificable. La existencia de un archivo no demuestra aceptación de una historia.
- **Antecedentes:** evidencia de otras semanas o cambios cuya pertenencia al sprint actual no está acreditada.
- **Pendientes del equipo:** acuerdos, datos y resultados que requieren confirmación o ejecución real.

Los campos sin datos no representan cero ni un estado Todo/Doing/Done. Las tablas vacías son estructuras de registro, no actividades realizadas.

## 2. Evidencia comprobada de semana 8

| Elemento | Fuente | Alcance de la evidencia |
|---|---|---|
| Documento funcional v1.9 | [PDR de semana 8](../PDR_Multi_tour_v1.9.md); [commit 66de5a3](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/66de5a3) | Existe el artefacto documental. Las secciones 1 y 24 mantienen su cierre definitivo sujeto a auditoría. No acredita HU, prioridad, aceptación ni pertenencia al sprint. |

El PDR v1.9 es la referencia funcional principal disponible. Su sección 24 prevalece para interpretar su estado documental, sin deducir cierre a partir del título de un commit. La identidad y el equipo del reporte individual provienen del [reporte de semana 7](../../../07-week/hu-status/README.md); no constituyen asignaciones de historias actuales.

En la revisión de la carpeta `08-week/hu-status/` y sus subcarpetas solo se encontró `PDR_Multi_tour_v1.9.md`, versión interna 1.9, fecha documental 2026-09-23. La prioridad de fuentes para esta entrega es: PDR vigente de semana 8 → decisiones arquitectónicas vigentes → dominio/requisitos vigentes → documentación de semana 8 → antecedentes históricos. La fecha del PDR no fija las fechas del sprint.

## 3. Sprint actual y backlog seleccionado

| Dato | Valor |
|---|---|
| Objetivo comprometido por el equipo | PENDIENTE DE CONFIRMACIÓN |
| Período del sprint: inicio y fin | PENDIENTE DE CONFIRMACIÓN |
| Historias realmente comprometidas | PENDIENTE DE CONFIRMACIÓN |
| Orden de prioridad y criterio de selección | PENDIENTE DE CONFIRMACIÓN |
| Responsables y dependencias del trabajo seleccionado | PENDIENTE DE CONFIRMACIÓN |
| Estados actuales y evidencia de aceptación | PENDIENTE DE CONFIRMACIÓN |

### Backlog del sprint

| Historia | Descripción | Prioridad | Responsable | Estado | Dependencias | Evidencia |
|---|---|---|---|---|---|---|

**PENDIENTE DE CONFIRMACIÓN:** no se han incorporado filas porque las fuentes revisadas no acreditan el compromiso de historias concretas para este sprint. El equipo debe identificar su selección y fuente antes de completar prioridad, responsable y estado. No se trasladan automáticamente HU anteriores ni todo el backlog del MVP 2.

### Colisión de identificadores

| Identificador y fuente | Significado documentado | Tratamiento |
|---|---|---|
| HU-05 del [backlog inicial MVP 1](../../../01-week/hu-status/Sesión%202/BACKLOG-MVP1.md) | Crear una reserva como cliente final. | Conservar el ID acompañado por la fuente. |
| HU-05 del [reporte de semana 7](../../../07-week/hu-status/README.md) | Frontend UI/UX; último estado allí registrado: doing; rama feat/hu-05-frontend-uiux. | Antecedente. Estado actual, criterios y compromiso en semana 8: PENDIENTE DE CONFIRMACIÓN. |

No se fusionan ambas historias ni se crean identificadores sustitutos. La correspondencia que adopte el equipo queda **PENDIENTE DE CONFIRMACIÓN**.

## 4. Historias comprobables y Definition of Done

Historias seleccionadas para verificar: **PENDIENTE DE CONFIRMACIÓN**. No se redactan historias ni reglas funcionales nuevas para llenar esta sección.

| Historia y fuente | Rol | Acción | Beneficio | AC y referencia PDR | Prueba o resultado observable | DoD aplicable | Evidencia de aceptación |
|---|---|---|---|---|---|---|---|

Al registrar una historia confirmada, enlazar sus criterios existentes, identificar el resultado que permite comprobarlos y conservar la evidencia de su aceptación. Cualquier ambigüedad sin fuente que la resuelva se registra como **PENDIENTE DE CONFIRMACIÓN**. El estado Done requiere criterios satisfechos y la DoD aplicable cumplida, no solo un commit o contrato publicado.

**Definition of Done del sprint: PENDIENTE DE CONFIRMACIÓN.** La [DoD de semana 4](../../../04-week/hu-status/Sesión%202/definition-of-done.md) es un antecedente del MVP 1 que referencia PDR v1.7; no se presenta como acuerdo vigente del sprint. Sus controles de pruebas, revisión, trazabilidad y aceptación sirven como insumo para que el equipo confirme la versión aplicable.

### Correcciones funcionales aplicables en semana 8

La siguiente tabla establece la lectura corregida para preparar historias conforme al [PDR v1.9](../PDR_Multi_tour_v1.9.md). Sus reglas sustituyen la interpretación incompatible de antecedentes en esta entrega; no reescriben los archivos históricos, no modifican contratos ni acreditan implementación. Solo se incorporarán a los AC de una historia comprometida cuando se confirme su alcance. Los casos indicados son verificaciones por realizar, no pruebas ejecutadas.

| Historia o tema | Diferencia del antecedente | Regla confirmada y fuente PDR | Resultado observable que debe cubrir el alcance afectado |
|---|---|---|---|
| HU-02 inicial / HU-MVP1-002: registro | Los campos históricos no cubren toda la activación. | §9, §12.1.1 y CA-024: nombre, apellido, correo, teléfono, contraseña y confirmación; verificar correo antes de activar; vincular identidades sin duplicar histórico según las reglas de coincidencias verificadas/no verificadas. | Rechazar datos obligatorios ausentes o contraseñas distintas; cuenta no activada sin verificar correo; vinculación conserva reservas e histórico. |
| HU-03 inicial / HU-MVP1-003: acceso | Credenciales correctas no bastan para todos los estados de cuenta/tenant. | §9: acceso dentro del tenant determinado; cuenta de cliente activada; revocar accesos normales al inactivar tenant. El Administrador del tenant conserva únicamente el acceso restringido allí descrito. | No mezclar tenants ni permitir operación normal durante inactivación; comprobar separadamente las operaciones restringidas autorizadas. |
| HU-04 inicial / HU-MVP1-001: oferta | Una lista genérica de servicios puede confundirse con oferta reservable. | RF-013 y CA-013: tours disponibles; hoteles y restaurantes asociados son informativos y de contacto en Fase 1. | Consultar oferta del tenant y distinguir tour reservable de establecimiento informativo. |
| HU-05 inicial / HU-MVP1-004: reserva y cupo | El AC inicial atribuye el último cupo a solicitudes de creación. | RN-RES-007/010, CA-003/006: una reserva corresponde a una salida; verificar capacidad efectiva antes de crear sin apartar cupo. Apartar con el primer comprobante, efectivo recibido o primera aplicación de saldo a favor conforme a la regla; la reprogramación tiene su excepción documentada. | Salida llena impide crear; crear no aparta; dos intentos concurrentes de apartar el último cupo no producen sobreventa. Aplicar saldo y apartar es consistente, sin consumir saldo si no hay capacidad. |
| HU-06 inicial / HU-MVP1-005/006: consulta y pago | Se mezclan estado de pago y comprobante; se usa “puede quedar”. | RN-RES-004/006A y §16: estado de reserva separado del comprobante (En validación, Aprobado, Rechazado) y situación financiera (Sin pago, Parcial, Abono recibido, Saldo pendiente, Pago completo). Tipo: total/abono; medio: transferencia/efectivo. | Comprobante presentado inicia En validación y no confirma por sí solo; validar el umbral aplicable confirma únicamente una reserva elegible conforme a su estado, plazos y reglas vigentes; aprobar un comprobante después de una cancelación no reactiva la reserva (CA-032); rechazar uno no borra otros pagos validados. Efectivo prometido no es recibido ni confirma. |
| HU-MVP1-010: recuperación | Aceptar la solicitud no demuestra recuperación completa. | §9 y §12.1.1: código por correo, máximo 30 minutos, un solo uso, invalidación por uso/expiración/reemplazo, coincidencia de nueva contraseña y confirmación; restablecimiento correcto invalida sesiones anteriores. | Código usado, vencido o reemplazado no permite restablecer; restablecer la contraseña invalida las sesiones anteriores, pero no activa una cuenta ni elimina restricciones del usuario o del tenant; el acceso posterior sigue sujeto a las condiciones de activación y autorización de §9. |
| HU-MVP1-011: descuentos | “Oferta y/o reserva” y cálculo sin contexto fijado resultan insuficientes. | RN-RES-003 y CA-005A/B/C: mostrar descuentos aplicables; fijar tarifas y reglas generales del contexto comercial; pagos posteriores no consultan de nuevo el catálogo. Descuento adicional requiere autorización del Administrador del tenant. | Promoción creada después no se incorpora automáticamente; vencimiento posterior no elimina la fijada; modificación usa contexto original y reglas del PDR para componentes agregados. |
| INT-001/002: validación para reservar/operar | Oferta activa/precio y un status genérico no acreditan todas las condiciones. | RN-RES-007, RN-EJE-001 y CA-023/030: capacidad por salida y transporte aplicable; inicio real solo con reservas elegibles Confirmadas y Pago completo; actor autorizado y restricciones de horario/regularización. | Verificar las precondiciones de cada comando; no aceptar un status aislado como prueba completa de elegibilidad. El lugar de obtención de datos queda pendiente de diseño. |
| INT-003: agregados | El contrato histórico fija America/Bogota. | §9, CA-027 y RN-CAJ-001: calendario del tenant, preservando zona/instante históricos; cambios prospectivos. Cada movimiento mensual se cuenta una vez. | Límites de período respetan la zona aplicable; devoluciones no se descuentan dos veces ni costos operacionales se confunden con pagos o gastos. America/Bogota corresponde a Travesía Natural, no a todos los tenants por defecto. |
| INT-004/005: eventos y caja | “Saldo a favor” puede significar generación, uso o devolución; la bandeja no sustituye caja. | RN-RES-009 y RN-CAJ-001: registrar saldo a favor no es desembolsar una devolución; devolución efectivamente ejecutada requiere movimiento identificable de caja. | Distinguir registro, aplicación y devolución de saldo; demostrar el movimiento de caja por el componente responsable sin duplicarlo al conciliar. La bandeja auxiliar puede permanecer sin escritura operativa. |
| ORQ-002/004: aprovisionamiento | Un alta sintética no implica aceptación de todas las reglas. | §9, RF-016 y CA-017: alta por Administrador de plataforma con datos de tenant y primer Administrador; credencial temporal y activación conforme al PDR. | El smoke test usa identidad autorizada y datos obligatorios; alta incompleta o no autorizada no se considera caso exitoso del producto. |
| ORQ-005: recuperación | Restaurar una vez no acredita la política completa. | §17: respaldo diario, retención mínima de 30 días, RPO objetivo máximo 24 horas y RTO objetivo máximo 8 horas. | Evidenciar programación/retención y ensayo con pérdida y tiempo medidos según esos objetivos, cuando este alcance se implemente. No confundirlo con el rollback de 240 segundos de ORQ-006. |
| HU-05 UI/UX: roles y cambios de reserva | El título genérico no identifica permisos ni todos los flujos incluidos. | §9, §12.1.1, RN-EJE-002 y CA-030: perfiles y permisos específicos; cliente responde a propuestas, sin autogestión libre de cancelar o reagendar. RNF §17: accesibilidad WCAG 2.1 AA, usabilidad y compatibilidad declaradas. | Una pantalla no concede autorización; verificar acciones permitidas/prohibidas de las pantallas realmente incluidas y los RNF aplicables. AC propios y pantallas seleccionadas: PENDIENTE DE CONFIRMACIÓN. |

Los códigos HTTP, rutas, DTO y mecanismos de concurrencia no se deducen del PDR cuando este solo fija el resultado funcional: se conservan como decisiones de contrato/arquitectura sujetas a validación. El conflicto histórico de prioridad entre MoSCoW y HU-MVP1-004 no modifica la regla funcional de cupo; la prioridad operativa actual sigue **PENDIENTE DE CONFIRMACIÓN**.

### Roles y permisos para interpretar las historias

| Nombre encontrado | Lectura conforme al PDR §9 | Tratamiento documental |
|---|---|---|
| Cliente final | Perfil de autogestión dentro del tenant y sus propias reservas. | Coincide; aplicar límites de autogestión. |
| Administrador de plataforma | Gestión de tenants y soporte excepcional auditado, sin acceso ordinario al negocio del tenant. | No confundir con Administrador del tenant. |
| Administrador del tenant | Administración de su tenant y autorizaciones de negocio. | Usar el nombre completo en el registro actual. |
| Colaborador / colaborador operativo | Colaborador operativo, sujeto a permisos y restricciones. | No inferir autorización de descuentos ni permisos especiales por el título. |
| Administrador u operador sin precisión | Puede designar un perfil, la empresa turística o una función técnica. | PENDIENTE DE DEFINICIÓN según la acción y fuente; no renombrar automáticamente antecedentes. |
| Reservas, Operaciones, Caja | Contextos/componentes en INT. | Actores técnicos; no perfiles humanos. |
| Equipo, desarrollador, responsable de despliegue | Funciones del equipo en historias técnicas. | No equivalen a usuarios ni asignaciones personales del producto. |

Los permisos especiales son Validar comprobantes, Gestionar caja, Gestionar ejecución de salidas y Consultar datos sensibles. El Administrador del tenant dispone por perfil de los tres primeros; el acceso sensible requiere asignación explícita y auditoría incluso para él (CA-030). Gerente, Contador y Analista son opcionales por tenant, con los límites de §9; no sustituyen los perfiles base.

### DoD: controles reutilizables y adopción pendiente

Son reutilizables los controles históricos de compilación, pruebas vinculadas a AC, separación de responsabilidades, contratos actualizados, seguridad, trazabilidad y aceptación. Para aplicarlos al sprint debe confirmarse una DoD que referencie PDR v1.9 y el alcance seleccionado, identifique candidato/entorno, registre PR y revisión/validación, e incluya los RNF pertinentes a la historia. Un commit aislado o checklist no acredita por sí solo el requisito de PR por cambio.

Esta adaptación documental no adopta una DoD en nombre del equipo. La versión histórica conserva su referencia a v1.7/MVP 1; la adopción del acuerdo actual permanece **PENDIENTE DE CONFIRMACIÓN**.

## 5. Acuerdo WIP

```yaml
Límite WIP: PENDIENTE DE CONFIRMACIÓN POR EL EQUIPO
Estados incluidos: PENDIENTE DE CONFIRMACIÓN
Tratamiento de bloqueados: PENDIENTE DE CONFIRMACIÓN
```

Fuente y vigencia del acuerdo: **PENDIENTE DE CONFIRMACIÓN**. Evidencia de aplicación: **SIN EVIDENCIA REGISTRADA**. No se atribuye un límite a períodos anteriores.

## 6. Sincronización diaria

Registros disponibles del sprint: **SIN EVIDENCIA REGISTRADA**. Registrar únicamente sincronizaciones reales; si existen en otro canal, incorporar una referencia verificable en la celda correspondiente, sin reconstruir reuniones ficticias.

| Fecha | Terminado | En curso | Bloqueos | Siguiente acción |
|---|---|---|---|---|

## 7. PR y trazabilidad del sprint actual

Evidencia atribuible a historias o cambios confirmados del sprint: **SIN EVIDENCIA REGISTRADA**.

| Historia/Cambio | Rama | PR | Destino | Validación | Estado |
|---|---|---|---|---|---|

Para completar una fila debe existir una relación verificable entre la historia o cambio y el PR. Registrar revisión y resultado de validación con su enlace y candidato/SHA cuando esté disponible. Un enlace a una rama, una ejecución por push o un merge no demuestran por sí solos revisión ni aceptación de la historia.

El [README del curso](../../../README.md) y la [guía de ramas por entorno](../../../06-week/hu-status/Sesión%202/ramas-entornos.md) documentan rama de historia y PR al destino correspondiente. La reconciliación de esta regla con el flujo y las excepciones documentados en el backend queda **PENDIENTE DE CONFIRMACIÓN**. Esta actividad no modifica ramas, protecciones ni configuración de CI.

## 8. Rendimiento del sprint

Unidad principal: **Historia aceptada que cumple sus criterios de aceptación y Definition of Done**.

**Throughput = número de historias aceptadas dentro del período del sprint.**

| Indicador | Valor actual | Datos necesarios |
|---|---|---|
| WIP real observado | PENDIENTE DE CONFIRMACIÓN | Fecha de observación, historias activas y estados incluidos en el acuerdo. |
| Historias aceptadas | PENDIENTE DE CONFIRMACIÓN | ID y fuente, fecha de aceptación, AC/DoD comprobados y evidencia. |
| Throughput del sprint | PENDIENTE DE CONFIRMACIÓN | Período confirmado y conjunto de historias aceptadas dentro de él. |

### Registro de WIP observado

| Fecha de observación | Historias y estados incluidos | WIP observado | Límite acordado y fuente | Cumplimiento o bloqueo |
|---|---|---|---|---|

### Registro de aceptación

| Historia y fuente | Fecha de aceptación | Evidencia de AC y DoD | PR y validación relacionados |
|---|---|---|---|

Evidencia para ambos registros: **SIN EVIDENCIA REGISTRADA**. Solo cuando existan los datos confirmados se contará cada historia aceptada una vez dentro del período. Los PR de promoción, commits y tareas parciales no suman historias adicionales. Una tabla vacía no equivale a throughput cero. Lead Time y Cycle Time no se calculan por falta de datos suficientes.

## 9. Antecedentes: no acreditan ejecución del sprint actual

| Fuente | Hecho documentado o verificado | Límite de uso |
|---|---|---|
| [Tablero MVP 1](../../../04-week/hu-status/Sesión%202/sprint-mvp1-board.md) y [MoSCoW](../../../04-week/hu-status/Sesión%202/sprint-mvp1-moscow.md) | Historias, prioridades y AC históricos. | El tablero indica estados sugeridos; no es el compromiso de semana 8. |
| [HU-03 frontend](https://github.com/Molina211/Multitour-Monolito-Portal/issues/1) y [HU-04 backend](https://github.com/Molina211/Multitour-Monolito-Api/issues/5) | Responsables históricos: FernandaRobayo y Molina211, respectivamente. | No trasladar asignaciones ni cierres al sprint actual. La issue backend contiene casillas marcadas con texto pendiente; requiere reconciliación con evidencia. |
| [DoD histórica](../../../04-week/hu-status/Sesión%202/definition-of-done.md) | Reglas de aceptación del MVP 1. | DoD vigente del sprint: PENDIENTE DE CONFIRMACIÓN. |
| [Docker, semana 6](../../../06-week/hu-status/Sesión%201/README.md) y [registro de verificación](../../../06-week/hu-status/Sesión%201/Evidencias/02-verificacion.txt) | Evidencia guardada de conectividad, persistencia y recuperación. | No se volvió a ejecutar en esta tarea; no certifica el candidato actual. |
| [Registro RabbitMQ](../../../07-week/hu-status/Sesión%201/Evidencias/02-rabbitmq.txt) | Evidencia de reentrega y deduplicación del laboratorio. | No demuestra integración del productor Java ni aceptación de una historia actual. |
| [CI 35476553493](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/actions/runs/35476553493) y [CI 35564527138](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/actions/runs/35564527138) | Ejecuciones verificadas de contratos con resultado success y evento push. | No acreditan revisión de PR ni validación del sprint actual. |

### PR históricos comprobados del backend

| Historia/Cambio | Rama | PR | Destino | Validación | Estado |
|---|---|---|---|---|---|
| Pruebas de arquitectura ArchUnit; vinculación a HU actual: PENDIENTE DE CONFIRMACIÓN | chore/archunit-architecture-tests | [#33](https://github.com/Molina211/Multitour-Monolito-Api/pull/33) | develop | SIN EVIDENCIA REGISTRADA de aprobación formal o CI en las consultas de la auditoría para este PR. | Integrado, antecedente. |
| Promoción del cambio de arquitectura y README | develop | [#34](https://github.com/Molina211/Multitour-Monolito-Api/pull/34) | qa | Resultado de validación asociado: PENDIENTE DE CONFIRMACIÓN. | Integrado, antecedente. |
| Promoción del cambio de arquitectura | qa | [#35](https://github.com/Molina211/Multitour-Monolito-Api/pull/35) | main | Resultado de validación asociado: PENDIENTE DE CONFIRMACIÓN. | Integrado, antecedente. |

La relación de estos antecedentes con historias del sprint actual queda **PENDIENTE DE CONFIRMACIÓN**. No se contabilizan en sus métricas.

## 10. Insumos para sesión 2: MVP 2

| Insumo existente | Qué aporta | Trabajo de refinamiento pendiente |
|---|---|---|
| [HU-MVP2-ORQ-001 a 006](../../../06-week/hu-status/Sesión%202/historias-orquestacion.md) | Prioridad Must, orden documentado, dependencias, AC y estados iniciales Todo. | Confirmar vigencia y alcance; evaluar división de ORQ-002, ORQ-005 y ORQ-006 según capacidad. Roles sugeridos no equivalen a responsables acordados. |
| [HU-MVP2-INT-001 a 006](../../../07-week/hu-status/Sesión%202/historias-integracion-mvp2.md) | Historias, AC, dependencias y estado inicial todo; distingue laboratorio de implementación futura. | Precisar estados permitidos en INT-002; resultados y zona horaria en INT-003; evaluar tamaño de INT-004 e INT-006 y distinguir evidencia existente en INT-005 de aceptación completa. |

Secuencia de trabajo para la sesión 2: **refinamiento → división de historias grandes → aclaración de AC → análisis de dependencias → estimación**.

Selección, prioridad conjunta, alcance funcional complementario, responsables, técnica de estimación y estimaciones: **PENDIENTE DE CONFIRMACIÓN**. ORQ e INT no sustituyen todo el backlog funcional ni se incorporan automáticamente al sprint. No se asignan Story Points ni se alteran prioridades o reglas funcionales mediante este registro.

### Matriz de candidatas y dependencias comprobadas

Esta matriz es un inventario de fuentes para refinamiento, no el backlog comprometido de la sección 3. “ALINEADA CON AJUSTES” significa que la intención es compatible pero los AC/contratos históricos necesitan la lectura corregida de la sección 4. “CONTRADICE EL PDR” califica el antecedente señalado, no la implementación actual. Las dependencias funcionales indican reglas necesarias, no una secuencia de desarrollo acordada.

Fuentes: [B1: backlog inicial](../../../01-week/hu-status/Sesión%202/BACKLOG-MVP1.md), [B4: tablero MVP 1](../../../04-week/hu-status/Sesión%202/sprint-mvp1-board.md), [ORQ](../../../06-week/hu-status/Sesión%202/historias-orquestacion.md), [INT](../../../07-week/hu-status/Sesión%202/historias-integracion-mvp2.md) y [W7: reporte semanal](../../../07-week/hu-status/README.md). El [ADR de ownership MVP 1](../../../04-week/hu-status/Sesión%202/ADR-001-mvp1-ownership-contexts.md) distribuye responsabilidades históricas, pero no acredita separación física vigente de servicios.

| Historia / fuente | Relación con PDR | Evaluación del antecedente | Dependencia respaldada y tipo |
|---|---|---|---|
| HU-01 B1 | §9, tenant determinado y acceso restringido durante inactivación. | ALINEADA CON AJUSTES | Funcional: contexto y estado de tenant. |
| HU-02 B1 / HU-MVP1-002 B4 | §12.1.1, CA-024, registro y activación. | ALINEADA CON AJUSTES | Funcional: tenant e identidad; contrato: registro. |
| HU-03 B1 / HU-MVP1-003 B4 | §9, cuenta activada y acceso por tenant. | ALINEADA CON AJUSTES | Funcional: identidad/tenant; contrato: autenticación. |
| HU-04 B1 / HU-MVP1-001 B4 | RF-013, oferta y establecimientos informativos. | ALINEADA CON AJUSTES | Funcional: catálogo/tenant; contrato: consulta. |
| HU-05 B1 | RN-RES-007: crear no aparta cupo. | CONTRADICE EL PDR | Funcional: salida/capacidad/primer pago; arquitectura: concurrencia. |
| HU-MVP1-004 B4 | CA-003/006 y RN-RES-010: reserva por salida. | ALINEADA CON AJUSTES | Funcional: identidad, catálogo, salida y capacidad. |
| HU-06 B1 / HU-MVP1-005 B4 | §16: reserva, comprobante y situación financiera. | ALINEADA CON AJUSTES | Funcional: reserva propia/tenant; contrato: consulta. |
| HU-07 B1 | RN-RES-004/006A/007: pagos y confirmación. | ALINEADA CON AJUSTES | Funcional: reserva, tipo/medio de pago y cupo. |
| HU-MVP1-006 B4 | RN-RES-006A: En validación pertenece al comprobante. | CONTRADICE EL PDR | Funcional: reglas de pago; contrato: registro/consulta. |
| HU-09 B1 / HU-MVP1-007 B4 | §9 y §17: aislamiento y soporte excepcional autorizado. | ALINEADA CON AJUSTES | Funcional: autorización; arquitectura/contrato: identidad y tenant. |
| HU-08 B1 / HU-MVP1-008 B4 | Contrato de los flujos funcionales; rutas no prescritas por el PDR. | TÉCNICA — NO DERIVA DIRECTAMENTE DEL PDR | Contrato: alcance de endpoints; arquitectura: ownership. |
| HU-MVP1-009 B4 | Acuerdo de calidad y aceptación del equipo. | TÉCNICA — NO DERIVA DIRECTAMENTE DEL PDR | Otra: alcance y adopción de DoD. |
| HU-MVP1-010 B4 | §9 y §12.1.1: recuperación completa. | ALINEADA CON AJUSTES | Funcional: identidad/tenant; arquitectura/contrato: código de recuperación. |
| HU-MVP1-011 B4 | RN-RES-003, CA-005A/B/C: contexto comercial fijado. | ALINEADA CON AJUSTES | Funcional: catálogo, reserva y autorización de descuentos. |
| HU-MVP1-012 B4 | Soporte técnico de salud y tenant lookup. | TÉCNICA — NO DERIVA DIRECTAMENTE DEL PDR | Infraestructura/contrato: endpoints y dependencias observadas. |
| HU-05 UI/UX W7 | §9, §12.1.1 y RNF §17. | ALINEADA CON AJUSTES | Funcional: pantallas/permisos; alcance y contratos concretos: PENDIENTE DE CONFIRMACIÓN. |
| ORQ-001 | Aislamiento de entornos compatible; configuración no prescrita por PDR. | TÉCNICA — NO DERIVA DIRECTAMENTE DEL PDR | Infraestructura: Compose y matriz de configuración. |
| ORQ-002 | Seguridad y activación administrativa, §9/17. | ALINEADA CON AJUSTES | Otra historia: ORQ-001. |
| ORQ-003 | Healthchecks y arranque técnico. | TÉCNICA — NO DERIVA DIRECTAMENTE DEL PDR | Otras historias: ORQ-001 y ORQ-002. |
| ORQ-004 | RF-016/CA-017 para el alta usada por el smoke test. | ALINEADA CON AJUSTES | Otra historia: ORQ-003; funcional: alta autorizada. |
| ORQ-005 | §17: respaldo, retención y recuperación. | ALINEADA CON AJUSTES | Otras historias: ORQ-002 y ORQ-004. |
| ORQ-006 | §19: límite entre entrega y operación empresarial. | ALINEADA CON AJUSTES | Otras historias: ORQ-001 a 005; infraestructura: destino de publicación. |
| INT-001 | Capacidad por salida además de tenant/oferta activa. | ALINEADA CON AJUSTES | Otra historia: ORQ-004; contrato: C16/C19. |
| INT-002 | RN-EJE-001, CA-023/030: condiciones por operación. | ALINEADA CON AJUSTES | Otra historia: INT-001; contrato: C21. |
| INT-003 | CA-027: contrato fija zona horaria universal incorrectamente. | CONTRADICE EL PDR | Otra historia: INT-002; contratos: C22/C23. |
| INT-004 | Hechos económicos confirmados; distinguir usos de saldo a favor. | ALINEADA CON AJUSTES | Otras historias: INT-001 y ORQ-004; arquitectura/contrato: outbox y esquemas. |
| INT-005 | Conciliación auxiliar compatible, sin sustituir movimientos de caja. | ALINEADA CON AJUSTES | Otra historia: INT-004; infraestructura/contrato: RabbitMQ y consumidor. |
| INT-006 | Verificación técnica de compatibilidad; no valida contratos desalineados como producto conforme. | TÉCNICA — NO DERIVA DIRECTAMENTE DEL PDR | Otras historias: INT-001 a 005 y ORQ-006; contratos corregidos. |

Las HU-03 frontend y HU-04 backend de GitHub son contenedores del MVP histórico: no se equiparan a los mismos números de B1, no se incorporan como historias nuevas y no son unidades homogéneas de throughput. Las referencias completas evitan esa ambigüedad sin renombrar las fuentes.

### BLOQUEO / DEPENDENCIA: decisiones técnicas abiertas

| Elemento | Regla funcional ya confirmada | Decisión pendiente y efecto |
|---|---|---|
| Recuperación | Código por correo, vigencia máxima y uso único, §9/12.1.1. | Generación, longitud, formato, intentos y persistencia: PENDIENTE DE DEFINICIÓN. Bloquea cerrar el contrato técnico, no documentar la regla funcional. |
| INT-001/002 | Capacidad y elegibilidad de ejecución, RN-RES-007/RN-EJE-001. | Dónde validar y cómo obtener datos de salida, transporte, pagos y autorización: PENDIENTE DE DEFINICIÓN. Los DTO actuales no bastan por sí solos. |
| INT-003 | Calendario por tenant y no duplicar movimientos, CA-027/RN-CAJ-001. | Contrato corregido y atribución de agregados: PENDIENTE DE DEFINICIÓN. No reabrir la zona horaria como decisión funcional. |
| INT-004/005 | Devolución efectiva produce movimiento de caja, RN-CAJ-001. | Responsable del efecto operativo y relación con eventos/bandeja: PENDIENTE DE DEFINICIÓN. No atribuir integración Java a la demo. |
| ORQ-006 | PDR §19 diferencia entrega de software y puesta en operación empresarial. | Alcance de PROD académico o empresarial y responsabilidades: PENDIENTE DE CONFIRMACIÓN. |
| HU-05 UI/UX | Perfiles, permisos y RNF de interfaz. | Pantallas y AC incluidos: PENDIENTE DE CONFIRMACIÓN. |
| Distribución futura | Restricciones académicas PDR §18. | Materialización de cuatro microfrontends y reparto Angular/React, Java/Go, PostgreSQL/MongoDB: PENDIENTE DE DEFINICIÓN en arquitectura; afecta solo compromisos que dependan de esa evolución. |

No se resolvieron estas decisiones mediante cambios de contrato, código o arquitectura. Tampoco se asignan responsables técnicos por inferencia.

## 11. Pendientes del equipo y estado de preparación

1. Confirmar objetivo, período e historias comprometidas, con fuente de la decisión.
2. Registrar orden, responsables, dependencias y estados actuales; resolver la identificación de HU-05.
3. Incorporar a las historias seleccionadas la lectura funcional corregida de la sección 4, confirmar la DoD aplicable y resolver las decisiones técnicas que las bloqueen.
4. Completar el acuerdo WIP y registrar su aplicación real.
5. Registrar sincronizaciones reales y enlazar las evidencias externas existentes, si las hay.
6. Vincular cambios actuales con PR, revisión y validaciones verificables.
7. Registrar aceptación de historias y calcular throughput solo cuando se confirme el período y sus resultados.
8. Llevar los insumos ORQ/INT a sesión 2 para refinamiento y posterior estimación.

Estado: **estructura preparada; compromiso del sprint PENDIENTE DE CONFIRMACIÓN y ejecución SIN EVIDENCIA REGISTRADA en este registro**. Los hallazgos de auditoría permanecen abiertos cuando dependen de acuerdos o evidencia real. Completar documentación no equivale a cumplir retrospectivamente la actividad.

### Qué se ha corregido y qué falta para cerrar

| Categoría | Estado verificable |
|---|---|
| Lectura de antecedentes frente a PDR v1.9 | DOCUMENTADO CON EVIDENCIA: reglas corregidas, roles, fuentes y dependencias en este documento. No significa que los contratos o el producto hayan cambiado. |
| Identificación de candidatas | DOCUMENTADO CON EVIDENCIA: matriz de fuentes; no selección automática ni prioridades nuevas. |
| Objetivo, período, compromiso, responsables, prioridad y WIP | PENDIENTE DE CONFIRMACIÓN por el equipo. |
| Daily, PR/revisión, validación y aceptación | PREPARADO — PENDIENTE DE EJECUCIÓN/EVIDENCIA. |
| Throughput | PREPARADO — PENDIENTE DE EJECUCIÓN/EVIDENCIA: se calculará a partir de aceptaciones verificadas en un período confirmado. No es un valor que se elija por acuerdo. |
| Decisiones técnicas | BLOQUEO / DEPENDENCIA según el registro anterior, únicamente para las historias afectadas. |

El cierre exige completar los acuerdos y adjuntar evidencia real del sprint; los antecedentes no sustituyen esos registros. No se declara 100 % cumplido mientras existan estos pendientes.
