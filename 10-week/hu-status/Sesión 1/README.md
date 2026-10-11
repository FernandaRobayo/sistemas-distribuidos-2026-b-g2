# Semana 10 · Sesión 1 — Persistencia distribuida

Fecha de la revisión: 2026-10-11, America/Bogota. **Veredicto: NO LISTA PARA ENTREGA.**

Las ejecuciones registran **479 resultados aprobados**, contando pruebas padre y
subpruebas; equivalen a **473 casos hoja**, sin fallos ni pruebas omitidas.
No se ejecutó una Saga desplegada entre servicios reales. Hay requisitos obligatorios
pendientes; los resultados de componentes no equivalen a una entrega completa de MVP 2.

## 1. Objetivo y restricciones

MultiTour es una plataforma multitenant de servicios turísticos. El alcance revisado
es el alta del tenant y su primer administrador, distribuida entre identidad y seguridad.
Se busca demostrar propiedad de datos, Saga con compensación, Outbox transaccional y consumidores
idempotentes. Esta sesión prepara MVP 2 de Sesión 2; no publica una release.

**CONFLICTO CON NORMA:** el prompt pide una base por servicio; Anexo J.3.1 exige una base
por motor y J.3.2 propiedad del esquema por dominio. ADR-005 E7 sigue esta corrección.
Se conserva la arquitectura vigente y se evalúa aislamiento lógico y permisos. Si se
exigen bases físicas separadas, se necesita resolver esta contradicción con el docente.

Se inspeccionaron las migraciones; no se creó ni modificó ninguna. El prompt, actividad 7,
exige autorización explícita antes de incorporar una tabla o cambiar el esquema.
Las pruebas aplicaron DDL existente únicamente en bases desechables de validación.

## 2. Diagnóstico inicial y fuentes

El repositorio académico estaba limpio en `main`, SHA `83025aec10c134752cd21fd78cc64529ec6288b5`,
igual al `main` remoto consultado. Se creó `docs/10-week-persistence-session-1`.
No existía la carpeta de Sesión 1. El README semanal se completó conservando su plantilla,
con la historia en curso y enlaces locales; la publicación sigue pendiente.

Los checkouts locales de identidad, operaciones, caja y el workflow antiguo contenían
plantillas. Las ramas remotas `develop` tienen avances posteriores en identidad,
seguridad, relay y el workflow de onboarding. No se sustituyeron los checkouts locales
ni sus cambios ajenos. Se clonaron copias de validación bajo `$env:LOCALAPPDATA/Temp`.

Fuentes documentales consultadas, en `multi-tour-docs/multi-tour-docs/`:

- `05-architecture/decisions/records/ADR-004-backend-microservices-macrodomain-split.md`:
  D3 (alcance del corte), D4 (Outbox), D5 (seguridad), D10 (límites).
- `05-architecture/decisions/records/ADR-005-database-engines-and-saga-state.md`:
  E1 (motores), E3 (reportes), E4 (estado de Saga), E7 (aislamiento).
- `06-data/models.md` y `06-data/modeling-conventions.md`, Technical records per domain.
- `07-api/specs/transversal/multi-tour-worker-event-relay/service/spec.md`:
  HU-WRK-007, AC-01.1 a AC-01.4. Su firma del Project Lead no acredita aprobación docente.
- Backlog académico `06-week/hu-status/Sesión 2/historias-orquestacion.md`:
  planificación de despliegue; no reemplaza el backlog funcional.

Las revisiones del ADR se distinguen por su revisión registrada: su estado general
Accepted no demuestra aprobación docente de cada cambio posterior. El inventario
remoto y sus SHA están en [repositorios.json](Evidencias/repositorios.json).

## 3. Servicios y datos

| Servicio | Motor y unidad propietaria según ADR-005 | Estado observado |
| --- | --- | --- |
| identity-audit | MongoDB, base `identity_audit`, usuario de dominio | Código remoto de tenant y Outbox; no validado contra MongoDB en esta sesión |
| security | PostgreSQL, esquema `security`, `security_app` | API, Outbox y copia local `tenant_copy`; suite con PostgreSQL real ejecutada |
| commercial-reservation | PostgreSQL, `commercial_reservation`, `commercial_reservation_app` | Catálogo y Outbox JDBC; publicación interna pendiente en el código inspeccionado |
| operations-cost | PostgreSQL, `operations_cost`, `operations_cost_app` | `develop` remoto contiene solo plantilla; no hay aplicación verificable |
| cash-reporting | PostgreSQL, `cash_reporting`, `cash_reporting_app` | `develop` remoto contiene solo plantilla; no hay aplicación verificable |
| workflow-onboard-tenant | PostgreSQL, `workflow_onboard_tenant`, `workflow_onboard_tenant_app` | Orquestador, adaptadores y DDL existentes; `cmd/workflow/main.go` vacío |
| worker-event-relay | Sin base | Accede a Outbox mediante API; no escribe tablas de otro dominio |

La infraestructura de PostgreSQL provisiona usuarios por esquema. Comercial lee sus
tablas con nombres calificados y configura `DB_URL`, `DB_USER`, `DB_PASSWORD` mediante
entorno. Sus FK inspeccionadas apuntan al mismo esquema. Su ejecutor de migraciones
usa tablas de control propias y no define instancia ni volumen.

Estas observaciones estáticas no prueban los GRANT de un entorno desplegado. Falta
ejecutar la consulta J.10 en el conjunto completo y la verificación equivalente de MongoDB.

## 4. Proceso seleccionado y Saga

**CONFIRMADO (ADR-004 D3):** `onboard-tenant` corresponde al corte 2 y cruza identidad y
seguridad. `register-payment` está asignado al corte 3; no se inventó un flujo de pagos
para cubrir la actividad. Se reutilizó el orquestador remoto existente, escrito en Go,
lenguaje previsto para esta pieza; Java/Spring sigue en las APIs de dominio.

| Paso | Transacción local | Fallo y compensación existente |
| --- | --- | --- |
| CREATE_TENANT | Identidad crea el tenant pendiente | Un rechazo definitivo no deja paso previo que compensar |
| CREATE_ACCOUNT | Seguridad crea cuenta y membership | Rechazo definitivo: identidad ejecuta `fail-onboarding`, libera el identificador y la Saga termina COMPENSATED |
| APPLY_STATUS | Identidad registra administrador y estado inicial | Reintentos acotados; al agotarse termina FAILED para intervención, sin eliminar la cuenta |

Se conserva **orquestación**: la coordinación reside en el workflow y cada participante
realiza su propia transacción. Un resultado desconocido por red termina FAILED, evitando
compensar una cuenta que podría haberse creado. Fallo de compensación también termina FAILED.
Los adaptadores envían token de servicio, correlación y clave idempotente derivada del paso.
La credencial temporal del administrador no se persiste en la Saga.

Pruebas existentes comprobaron éxito, rechazo del paso 2, compensación fallida,
repetición del inicio y resultado desconocido. Los participantes de estas pruebas son
dobles HTTP o de puertos, no los dos servicios desplegados.

Brechas: `main()` vacío y Compose solo de migraciones; falta el servicio ejecutable.
`OnboardTenant.closeStale` puede compensar el tenant si la cuenta se creó antes de guardar
el paso 2. Las deudas F2/F3 incluyen datos insuficientes para reanudar paso 3 y ausencia
de claim/lock. No se acredita recuperación segura tras interrupciones o con varias instancias.

## 5. Outbox y publicación

El catálogo existente guarda agregado y eventos en `JdbcCatalogServiceRepository.save`,
dentro de `TransactionTemplate` con propagación REQUIRED. `CatalogPersistenceTest`
incluye atomicidad y rollback; esas pruebas de comercial no se ejecutaron esta sesión.

En seguridad se ejecutaron pruebas PostgreSQL que verifican atomicidad entre bloqueo
de cuenta o revocación y su evento: si se rechaza el evento, no queda el cambio parcial.
También se verificaron publicación, reintentos y carreras entre publicación e intentos.

El relay lee pendientes, entrega con `Idempotency-Key: <eventId>` y pide marcar publicado
solo tras la aceptación de los consumidores configurados. Una entrega fallida registra
el intento en la API propietaria. La política documentada empieza en 5 s, crece hasta
15 min y termina tras 20 intentos. El worker no mantiene una base ni modifica Outbox por SQL.

**Brecha comprobada:** `internal/config/routing.go` configura cero consumidores para
`AccountSessionsRevoked` y `AccountBlocked` y permite marcarlos publicados sin entrega.
Esto impide acreditar AC-01.2 de HU-WRK-007 y la propagación de revocaciones. El evento
`AccountBlocked` aparece como propuesto en ese código; no se declara decisión aprobada.
El test de difusión usa `twoConsumers(t)`, no `DefaultRoutes`: su éxito no valida las
rutas de producción. `CompleteOnboarding` genera `TenantCreated`; `MongoTenantRepository.update`
guarda tenant y evento con `ClientSession.withTransaction`, sin prueba MongoDB ejecutada aquí.

## 6. Idempotencia, CQRS y consistencia eventual

Seguridad aplica `tenant_copy` con un UPSERT que solo actualiza si `occurred_at` es mayor.
La primera entrega devuelve 201; una repetida o antigua devuelve 200 sin nuevo efecto.
La prueba concurrente de 20 eventos verifica que termina en el estado más reciente.
La suite PostgreSQL confirmó este comportamiento y su precisión en microsegundos.

**CUMPLE** el criterio funcional de no repetir efectos de la proyección de tenant.
**NO CUMPLE (ADR-004 D4)** el mecanismo de registro por `eventId` junto al efecto:
la fecha evita repetir actualizaciones, pero no registra la identidad del evento procesado.
`security.idempotency_key` sirve para creación
de cuentas y exige `identity_id`; no se reutiliza para eventos de tenant.

Existe separación de responsabilidades: alta, cambios y revocación son comandos;
consultar Saga, catálogo y tenant son consultas. `tenant_copy` es una proyección local
alimentada por eventos, con consistencia eventual. Durante el retraso conserva su último
estado; no se encontró un indicador público de sincronización pendiente. Se probaron
eventos fuera de orden y colisión temporal de identificador con reintento.
ADR-005 E3 prevé proyecciones de reportes en caja; caja sigue sin implementación remota.
No se creó una base de lectura ni infraestructura CQRS adicional.
La ausencia de CQRS completo no constituye incumplimiento obligatorio del enunciado.

## 7. Validación ejecutada y límites

| Suite | Resultados aprobados | Casos hoja | Fallos / pruebas omitidas | Alcance |
| --- | ---: | ---: | --- | --- |
| workflow-onboard-tenant | 72 | 71 | 0 / 0 | Orquestador, HTTP, participantes simulados y PostgreSQL |
| worker-event-relay | 32 | 31 | 0 / 0 | Relay y clientes contra dobles HTTP; sin base de datos |
| security | 363 | 359 | 0 / 0 | Núcleo, HTTP y adaptadores PostgreSQL reales |
| identity-audit core Outbox | 12 | 12 | 0 / 0 | Repositorio en memoria; no MongoDB |

Los resultados Go incluyen padres y subpruebas. Los casos hoja excluyen padres con
subpruebas registradas. Un `skip` sin nombre de test identifica un paquete sin pruebas.

| ID | Estado real |
| --- | --- |
| T01 | PARCIAL: inspección estática y pruebas del rol del workflow; falta J.10 global y MongoDB |
| T02 | PARCIAL: `TestA_happy_path_runs_three_steps_and_completes` aprobado; Saga desplegada pendiente |
| T03 | PARCIAL: `TestA_step_two_failure_compensates_step_one` aprobado; recuperación insegura |
| T04 | PARCIAL: atomicidad PostgreSQL probada; `TenantCreated` en MongoDB no verificado |
| T05 | CUMPLE en componente: `TestA_event_marked_only_after_all_consumers_accept` aprobado |
| T06 | PARCIAL: reintento y misma clave probados; reinicio del despliegue pendiente |
| T07 | CUMPLE para tenant: primera entrega 201 y repetición 200, sin nuevo efecto |
| T08 | CUMPLE para tenant: repetición y 20 eventos concurrentes sin efectos duplicados |
| T09 | NO VERIFICABLE: sin ejecución entre workflow, identidad, seguridad y relay reales |
| T10 | PARCIAL: reglas de rechazo y compensación probadas; recuperación requiere corrección |

Docker no respondía al inicio; se inició Docker Desktop y luego la validación utilizó
PostgreSQL 18.6 desechable, sin volumen persistente, con puerto solo en localhost.
El contenedor se eliminó al terminar. No se alteraron bases de DEV, QA ni PROD.

Reproducción: Go 1.26, Docker Desktop disponible y clones en los SHA del manifiesto:

```powershell
& '.\10-week\hu-status\Sesión 1\verificar.ps1'
```

En una copia nueva, el script selecciona el SHA registrado; un checkout existente que
difiere del SHA detiene la validación. No cambia el checkout del propietario.
El log JSON incluye resultados individuales y omisiones. Se sanea la contraseña efímera.
Resumen: [resultados.json](Evidencias/resultados.json); detalle: archivos `.jsonl` de cada suite.
La auditoría posterior solo leyó logs y código. El resumen se recalculó desde esos logs,
sin repetir suites ni alterar sus resultados originales.

En la copia aislada de identidad, con Maven 3.9.12 y Java 21:

```powershell
mvn -B -pl core '-Dtest=OutboxUseCasesTest,ListDueEventsTest' test
```

Resultado: BUILD SUCCESS, 12 pruebas. [Log Maven](Evidencias/identity-audit-outbox-maven.txt).

Matriz de cierre de la auditoría: los estados parciales no aprueban la entrega integrada.

| Requisito | Estado | Evidencia y límite |
| --- | --- | --- |
| Propiedad de datos | PARCIAL | Configuración y rol del workflow; falta J.10 global |
| Saga funcional | NO CUMPLE | Orquestador probado; `cmd/workflow/main.go` vacío |
| Compensación | PARCIAL | Rechazo del paso 2 probado; recuperación insegura |
| Outbox transaccional | PARCIAL | PostgreSQL probado; evento de onboarding en MongoDB no verificado |
| Publicación y reintentos | PARCIAL | Relay probado con dobles; rutas reales sin consumidores |
| Consumidores idempotentes | PARCIAL | Tenant sin efectos repetidos; registro por eventId pendiente |
| Integración entre servicios | NO VERIFICABLE | Sin ejecución completa registrada |
| Documentación académica | CUMPLE | Informe, comandos, logs y límites explícitos |
| Alineación con MultiTour | PARCIAL | Desviaciones de recuperación y ADR-004 D4 |
| Preparación para MVP 2 | NO CUMPLE | Requisitos obligatorios sin integración verificada |

## 8. Cambios realizados y pendientes de aprobación

Se añadieron este informe, `verificar.ps1` y evidencias en esta sesión; también se completó
el README semanal. El script distingue resultados, casos hoja y paquetes sin pruebas,
y rechaza salidas sin resultados verificables o pruebas omitidas.
**Archivos de producto modificados: ninguno.** Los avances comprobados eran existentes;
no se atribuyen como nueva implementación. No se modificaron otras semanas ni se hizo
commit, push, PR, promoción o release.

**PROPUESTO (06-data/modeling-conventions.md):** incorporar `security.processed_event`,
ya descrita en el modelo, mediante una migración incremental nueva en `multi-tour-security/db/`.
Estructura mínima documentada: `event_id` UUID único y `processed_at`. El registro y el
UPSERT de `tenant_copy` deberán usar una sola transacción: duplicado no aplica efectos;
si falla el efecto se revierte el registro para permitir reintento. La unicidad debe
resolver concurrencia; se conserva la comprobación de eventos antiguos.
No se escribirá DDL hasta autorizar este cambio, conforme a las actividades 5 y 7 del prompt.

Orden para completar la actividad:

1. Resolver con el docente la contradicción base por servicio frente a Anexo J.
2. Completar arranque, imagen y composición del workflow usando los adaptadores existentes
   y resolver sus deudas de recuperación. Propietario del alcance de identidad: Jhon.
3. Autorizar y revisar la migración `processed_event` antes de implementarla.
4. Completar consumidores de revocación y rutas del relay; nunca acreditar entrega sin receptor.
5. Desplegar identidad/MongoDB, seguridad/PostgreSQL, workflow y relay; verificar J.10.
6. Ejecutar T01–T10 de punta a punta, incluidos caída/reinicio del relay y duplicados concurrentes.
7. Adjuntar evidencia del candidato, promover con `cherry-pick -x` y preparar MVP 2 en Sesión 2.

**CUMPLE** el alcance de documentación autorizado y la validación de componentes.
**NO CUMPLE** la implementación integrada exigida por Anexo E y la deduplicación por
eventId de ADR-004 D4. La idempotencia funcional del consumidor de tenant sí está probada.
**NO LISTA PARA ENTREGA** hasta cerrar los bloqueos y las pruebas esenciales.
