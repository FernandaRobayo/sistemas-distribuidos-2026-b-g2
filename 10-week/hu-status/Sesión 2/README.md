# Semana 10 · Sesión 2 — Entrega documental del candidato MVP 2

Evidencias técnicas: 2026-10-11. Cierre documental: 2026-10-12, America/Bogota.
**Resultado: documentación preparada para revisión; MVP 2 no liberado.**
Alcance autorizado actual: únicamente este repositorio académico. [Paquete de entrega](ENTREGA.md).
El alcance comprobado es onboarding: identidad, seguridad, workflow y relay.
No se acredita funcionamiento de todos los dominios de MultiTour.

## Evidencia ejecutada

Correcciones anteriores a la restricción de alcance: [manifiesto histórico](Evidencias/correcciones.json).
En ramas `fix/`, la Saga deja el resultado incierto FAILED sin compensación indebida;
el arranque excluye otro proceso normal mediante advisory lock, y el relay registra fallos sin publicar eventos sin receptor.
Pasaron las suites modificadas y go vet. Los parches aún no están publicados ni integrados en develop;
los SHA y la matriz siguientes describen el candidato remoto anterior a esas correcciones.
Esas evidencias se conservan como antecedentes; esta revisión no aplica los parches ni accede a otros repositorios.

Se consultaron los remotos de los cuatro componentes y se ejecutaron pruebas
en copias aisladas, con PostgreSQL desechable y sin alterar DEV, QA o PROD.
El workflow avanzó desde `d6dd8e5` de sesión 1 hasta `0ce7fa0`:
ahora tiene composition root, configuración, Dockerfile y servicio Compose.
La observación histórica de `main.go` vacío ya no describe este candidato.
En el candidato archivado siguen pendientes la recuperación segura y la integración real.

| Componente | SHA validado | Evidencia |
| --- | --- | --- |
| workflow-onboard-tenant | `0ce7fa05019e4b77b8eb565152cd0d922ff2cea6` | [Suite Go](Evidencias/multi-tour-workflow-onboard-tenant.jsonl) |
| worker-event-relay | `3588fda04f0b0af3c761fbe6bffe827fc6fd8886` | [Suite Go](Evidencias/multi-tour-worker-event-relay.jsonl) |
| security | `aafda9c9bba60b3a486d0e502cb522c5d91e73c4` | [Suite Go](Evidencias/multi-tour-security.jsonl) |
| identity-audit-api | `008c3a96856a78932a36a8e6d23565b63de64038` | Inspección remota; no nueva suite Java acreditada aquí |

[Resumen de suites](Evidencias/resultados.json), [estado remoto](Evidencias/remotos.json)
y [prueba de fallo](Evidencias/fallo-compensacion.jsonl).
Las suites Go aprobaron 473 resultados, equivalentes a 467 casos hoja,
sin fallos ni omisiones. Los cuatro escenarios de demostración son un
subconjunto de esas pruebas; no se suman otra vez al total.
La imagen se construyó y [la prueba de arranque](Evidencias/arranque.json)
comprobó usuario 10001, PostgreSQL real, salud 200 y POST sin JWT rechazado con 401.
Estos resultados pertenecen a ejecuciones anteriores; no se levantaron servicios en el cierre documental.
Los resultados cuentan pruebas padre y subpruebas por separado; el resumen
también identifica casos hoja, fallos y omisiones. No son pruebas de una Saga
desplegada contra identidad/MongoDB y seguridad/PostgreSQL simultáneamente.
La consulta histórica filtrada por rama develop devolvió una colección vacía;
no se afirma CI verde ni aprobación docente.

Validar archivos locales: `& '.\10-week\hu-status\Sesión 2\verificar.ps1'`.
El verificador comprueba JSONL, contadores, hashes de los parches, escenarios archivados,
metadatos de arranque, enlaces internos y sintaxis. Solo escribe [su resultado](Evidencias/auditoria-local.json) aquí.
`demostrar.ps1` y `probar-arranque.ps1` son accesos compatibles a esa verificación local.
Requiere PowerShell; no clona repositorios, ejecuta suites del producto ni utiliza Docker o red.

## Lista de entrega y DoD

| Requisito de la actividad | Estado | Evidencia o condición de cierre |
| --- | --- | --- |
| Promoción aprobada a main | NO CUMPLE en evidencia | La consulta del 11 de octubre no acredita promoción del candidato; norm 10 y 11 |
| Tag anotado v2.0.0 | NO CUMPLE en evidencia | Ausente en el snapshot de los cuatro componentes; norm 11.5 |
| Criterios de aceptación y DoD | PARCIAL | Componentes comprobados; integración y recuperación pendientes |
| Pruebas automatizadas | PARCIAL | Suites Go ejecutadas; falta validación completa Java/MongoDB y contratos integrados |
| Sistema integrado | NO VERIFICABLE | No hay ejecución de punta a punta con todos los participantes reales |
| Fallo y compensación | PARCIAL | Caso de uso probado con participantes simulados; Anexo E exige además E2E |
| Outbox e idempotencia | PARCIAL | Tenant no duplica efectos; ledger por eventId y receptores de revocación pendientes |
| CHANGELOG y ADR | PARCIAL | [Notas de candidato](CHANGELOG.md); ADR del producto no modificado |
| Retrospectiva | PARCIAL | Análisis técnico registrado abajo; falta conversación y acuerdo del equipo |
| Evidencia individual completa | PARCIAL | Aporte de Fernanda registrado; evidencias de los demás por confirmar |
| Pendientes para Corte 3 | CUMPLE en documentación | Backlog propuesto abajo; hu-status mantiene la semana histórica |

**CONFLICTO CON NORMA:** exigir instancia propia por servicio contradice Anexo J.3.
Se verifica una instancia por motor, propiedad por dominio y permisos aislados.
**CUMPLE** la verificación documental local. **PARCIAL** la evidencia académica: publicación pendiente (norm 1.4).
**NO CUMPLE** el cierre de la release (norm 11) ni la demostración integrada (Anexo E).

## Guion de demostración integrada pendiente

Este guion está preparado para el responsable del producto; está fuera del alcance autorizado actual.
Los pasos siguientes no se presentan como ejecutados.
Usar exclusivamente QA o un ambiente desechable, con datos sintéticos.

1. Congelar SHA de infra, gateway, identidad, seguridad, workflow y relay;
   registrar versiones, migraciones, permisos y comandos de despliegue.
2. Levantar PostgreSQL y MongoDB según Anexo J, aplicar migraciones existentes
   y usar usuarios de dominio. Emitir credenciales de servicio sin versionarlas.
3. Por el gateway, enviar `POST /api/v1/sagas/onboard-tenant` con JWT,
   `Idempotency-Key` y `X-Correlation-Id`; comprobar 201 y Saga COMPLETED.
4. Consultar la misma Saga; comprobar tenant, administrador, evento Outbox
   y proyección en seguridad. Guardar respuestas y consultas saneadas.
5. Repetir la misma petición y clave: 200, misma Saga y sin efectos adicionales.
6. Para otra petición, inyectar un rechazo definitivo controlado de creación
   de administrador: comprobar Saga COMPENSATED, failedStep y tenant FAILED.
7. Simular caída o timeout del participante en un escenario separado: el resultado
   incierto debe quedar FAILED para revisión; no asumir que permite compensar.
8. Reiniciar relay tras una entrega sin confirmación; comprobar reentrega y
   ausencia de efectos duplicados. Adjuntar correlación y estado final.

La prueba automatizada disponible comprueba éxito, rechazo del paso 2,
compensación fallida y repetición de clave con dobles de participantes.
No equivale a detener un contenedor de negocio real.

## Preparación de promoción y versión

Plan informativo fuera del alcance actual. Por cada repositorio de código, seleccionar commits post-merge de develop
vinculados a HU aprobadas. Crear `qa/<descripcion>` desde QA actualizada,
reaplicar con `git cherry-pick -x <sha-develop>` y abrir PR a QA (norm 10.3).
Tras validar QA, crear `release/2.0.0` desde main y reaplicar los SHA de QA
con `-x`; verificar que cada origen existe y pertenece a QA.

El PR de release incluirá HU/id/título, rastro por HU, alcance, despliegue
(migraciones y variables) y reversión (norm 11.3). Conservar el trailer al
fusionar; un squash que lo pierda rompe la trazabilidad.
Solo tras pruebas y aprobación docente del PR a main (norm 9.5):
`git tag -a v2.0.0 <sha-aprobado-en-main> -m 'Release v2.0.0: MVP 2'`,
seguido de la publicación de la etiqueta. Son instrucciones pendientes,
no comandos ejecutados ni una release ya creada.
Los repositorios de documentación usan `docs/` + PR a main (norm 6.1).
No se publica una etiqueta sobre este informe para simular una versión del producto.

## Retrospectiva técnica preliminar

| Observación | Acción propuesta | Cierre verificable |
| --- | --- | --- |
| Las suites y los SHA permiten reproducir resultados | Conservar logs y contar casos hoja | Resumen sin fallos ni omisiones |
| El candidato remoto cambió durante la revisión | Separar evidencia histórica del SHA actual | Manifiesto del candidato explícito |
| Aprobar componentes no prueba integración | Ejecutar el guion con participantes reales | Correlación, respuestas y datos finales |
| Un evento sin receptor puede marcarse publicado | Completar rutas antes de aceptar entrega | Confirmación de todos los receptores |
| Recuperación puede compensar tras crear cuenta | Resolver resultados inciertos y concurrencia | Prueba de caída entre efecto y persistencia |

Este análisis fue preparado por Fernanda con asistencia de herramientas;
no constituye una reunión celebrada ni un acuerdo de Jhon o del docente.

## Pendientes propuestos para Corte 3

| Pendiente | Responsabilidad por confirmar | Prioridad y aceptación |
| --- | --- | --- |
| Recuperación segura de onboarding | Jhon, alcance de identidad/workflow | Bloqueo de MVP 2: sin cuenta huérfana ni compensación indebida |
| Consumidores de eventos de revocación y bloqueo | Responsable de cada API + relay | Bloqueo de MVP 2: entregar o conservar pendiente, nunca descartar |
| Deduplicación por eventId | Responsable de seguridad; autorizar migración | Bloqueo de MVP 2: efecto y registro atómicos y concurrentes |
| Outbox MongoDB y aislamiento global | Responsables de datos e identidad | Bloqueo de MVP 2: atomicidad y denegación de escritura cruzada |
| Integración, fallo real y promoción | Equipo + revisión docente | Bloqueo de MVP 2: evidencia E2E, PR aprobados y tag |
| Evidencias individuales y retrospectiva conjunta | Cada integrante | Adjuntar enlaces propios y acuerdos con responsables |

No se difieren requisitos obligatorios para declarar MVP 2 terminado.
El backlog identifica continuidad y bloqueos; no modifica el tablero de GitHub.
La semana 10 permanece histórica. Los pendientes para Corte 3 quedan propuestos en este informe;
no se modifica el hu-status de semana 11 ni se declara trabajo futuro ejecutado.

## Participación individual

Fernanda: revisión del candidato, consulta de ramas y etiquetas, correcciones locales, ejecución
de suites, prueba controlada con dobles y preparación de este informe,
notas de candidato, retrospectiva técnica y backlog.
Jhon: evidencia individual pendiente de enlace; no se atribuye aquí su trabajo.
El cierre actual consiste en ordenar y verificar estos archivos; no repite pruebas ni modifica código externo.
La sesión 1 se publicó en [e1ce637](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/e1ce637).
La publicación y PR de sesión 2 permanecen pendientes.
