# Semana 1 · Sesión 1

Evidencia académica correspondiente a la actividad: *"Forma tu equipo, elige el problema real que resolverá tu sistema distribuido y comienza a crear la lista de tareas pendientes. Para cada operación principal, anota la consistencia y la semántica de entrega requeridas."*

Fuente funcional utilizada: **PDR Multi tour v1.7.1 — 2026-09-03** (`04-week/hu-status/PDR_Multi_tour_v1.7.md`). Toda regla citada en este documento proviene de esa fuente; donde el PDR no define algo de forma explícita, se indica textualmente `NO DEFINIDO EXPLÍCITAMENTE EN EL PDR` en lugar de asumirlo.

## Equipo

| Integrante | Rol académico / responsabilidad inicial |
| --- | --- |
| Maria Fernanda Robayo Laguna | Autora del PDR Multi tour v1.7.1 (Sección 2, "Autores"); responsable de esta entrega individual semanal (`TEAM: ErrorCapa8`). |
| Jhon Sebastian Molina Fierro | Coautor del PDR Multi tour v1.7.1 (Sección 2, "Autores"); responsable del repositorio de documentación técnica del proyecto (`Travesia-Natural-docs`). |

El PDR identifica a ambos integrantes únicamente como autores del documento, sin diferenciar roles internos de equipo (por ejemplo Product Owner o Scrum Master). Esa diferenciación es `NO DEFINIDO EXPLÍCITAMENTE EN EL PDR`, por lo que no se inventa aquí un cargo que no esté respaldado por la documentación del repositorio.

## Problema real que resolverá Multi Tour

**Problema.** La operación de un negocio turístico de naturaleza y aventura —tomando a Travesía Natural como caso base de validación— se gestiona hoy mediante archivos de Excel independientes para reservas, pagos operacionales, gastos operacionales y consolidación contable. Esta dispersión impide diferenciar con claridad cuatro cosas que hoy se mezclan: lo que se proyectó vender en una reserva, lo que realmente se prestó durante la ejecución del servicio, los costos operacionales asociados a esa ejecución y el impacto real de todo lo anterior sobre la caja del negocio.

**Por qué es relevante.** Sin un registro centralizado y trazable, la operación pierde visibilidad sobre su rentabilidad real por reserva, sobre el control diario de caja y sobre la posibilidad de auditar decisiones económicas sensibles (aplicación de descuentos, autorización de devoluciones, cambios de estado de pago). Esto no es un problema exclusivo de una empresa: el PDR reconoce explícitamente que "la solución deja de entenderse como un sistema exclusivo para una sola empresa" y se define como una plataforma multitenencia.

**Quiénes se ven afectados.** El Administrador de cada tenant (control financiero y de la operación), el Colaborador operativo (gestión diaria de reservas, caja y ejecución), el Cliente final (necesita consultar oferta, reservar y hacer seguimiento de su pago desde un canal digital) y, de forma transversal, otros operadores turísticos con necesidades equivalentes a las de Travesía Natural que podrían utilizar la misma plataforma como tenants independientes.

**Qué pretende resolver Multi Tour.** Multi Tour es la plataforma; Travesía Natural es únicamente su tenant principal de validación y demostración, no el producto completo. Multi Tour busca centralizar reservas, catálogo operativo, pagos, descuentos, ejecución real, costos operacionales y caja para múltiples operadores turísticos, garantizando que cada tenant opere sobre su propia información sin mezclarla con la de otro tenant.

## Lista inicial de tareas pendientes

Esta lista representa el punto de partida del proyecto en la Semana 1, con base en las capacidades principales identificadas en el PDR. No corresponde al backlog completo de semanas posteriores.

| ID | Tarea inicial | Actor / módulo | Prioridad inicial | Observación |
| --- | --- | --- | --- | --- |
| T-01 | Definir el contexto multitenant como marco base del diseño | Transversal / plataforma | Alta | Toda otra tarea depende de este marco; el PDR condiciona la autenticación, las reservas, el catálogo y la caja al aislamiento por tenant. |
| T-02 | Identificar y confirmar actores/roles base | Administrador de plataforma, Administrador, Colaborador operativo, Cliente final | Alta | Determina los permisos base antes de diseñar cualquier flujo (Sección 9 del PDR). |
| T-03 | Administración de tenants (alta, activación, inactivación, reactivación) | Administrador de plataforma | Alta | Sin un tenant creado no existe operación posible; es la puerta de entrada a la plataforma. |
| T-04 | Autenticación de usuarios dentro de un tenant determinado | Todos los actores | Alta | Precondición de seguridad para cualquier operación sensible (RN de identidad del cliente entre tenants). |
| T-05 | Registro de cliente titular y acompañantes | Colaborador operativo / Administrador / Cliente final | Alta | Precondición obligatoria de RF-001/RF-002 antes de crear cualquier reserva. |
| T-06 | Gestión del catálogo operativo (tours, hospedaje, alimentación, transporte) | Administrador | Alta | Sin catálogo no existe oferta disponible para reservar (RF-004). |
| T-07 | Establecimientos asociados (hoteles y restaurantes en convenio) | Administrador | Media | Es promoción comercial complementaria; no bloquea el flujo principal de reserva (RN-ASO-001). |
| T-08 | Creación, modificación y cancelación de reservas | Colaborador operativo / Administrador / Cliente final | Alta | Es el núcleo comercial del sistema (RF-003, RF-003A, RF-014). |
| T-09 | Registro y validación de pagos, abonos y soportes de transferencia | Cliente final / Colaborador operativo / Administrador | Alta | Impacto financiero directo sobre el estado de la reserva (RF-015A). |
| T-10 | Autorización y ejecución de devoluciones monetarias | Administrador / Colaborador operativo | Alta | Alto riesgo financiero si no queda correctamente controlado (RF-015B). |
| T-11 | Parametrización y aplicación de descuentos | Administrador | Media | Depende de que ya exista catálogo y reserva; afecta el valor final pero no bloquea la creación inicial de la reserva. |
| T-12 | Registro de ejecución real de servicios | Colaborador operativo / Administrador | Media | Ocurre después de confirmada la reserva; es la base para diferenciar lo proyectado de lo prestado (RF-007). |
| T-13 | Registro de costos operacionales | Administrador / Colaborador operativo | Media | Depende de que exista ejecución registrada (RF-009). |
| T-14 | Gestión de caja diaria (apertura, movimientos, cierre) | Colaborador operativo / Administrador | Alta | Control financiero diario explícitamente exigido por el PDR (RN-CAJ-001). |
| T-15 | Auditoría de eventos relevantes | Administrador de plataforma / Administrador (según habilitación) | Media | Es transversal y de trazabilidad; no bloquea el flujo comercial principal. |
| T-16 | Reportes y dashboard operativo/administrativo | Administrador, Gerente, Contador, Analista (según habilitación) | Baja | Es una capacidad derivada de lectura; solo tiene valor una vez los demás módulos ya generan información real. |

## Operaciones principales: consistencia y semántica de entrega

Para cada operación se evaluó: si el usuario necesita ver el resultado confirmado de inmediato, si puede existir una ventana temporal donde otros componentes aún no vean el cambio, y si la operación involucra dinero, capacidad limitada (cupos) o seguridad/aislamiento multitenant.

Se usan únicamente dos categorías de consistencia (**Fuerte** y **Eventual**) y las semánticas de entrega **at-least-once**, **at-most-once** y **efectivamente-once** (resultado de combinar at-least-once en el transporte con una operación idempotente). No se afirma "exactly-once" de forma ingenua: en un sistema distribuido, ese resultado solo se logra combinando reintentos con idempotencia, nunca como una garantía de transporte por sí sola.

| Operación principal | Actor | Consistencia requerida | Semántica de entrega | Justificación |
| --- | --- | --- | --- | --- |
| Crear tenant y asignar su primer Administrador | Administrador de plataforma | Fuerte | At-least-once + idempotente por identificador único de tenant → efectivamente-once | El alta es atómica: un tenant sin Administrador, o un identificador de tenant duplicado, rompería el aislamiento multitenant que sustenta toda la plataforma. |
| Autenticar usuario dentro de un tenant determinado | Todos los actores | Fuerte | At-least-once + efecto idempotente por intento de sesión | El PDR exige que el tenant quede determinado *antes* de autenticar; un resultado tardío o ambiguo abriría una ventana de acceso indebido entre tenants (seguridad). |
| Registrar cliente titular y acompañantes | Colaborador operativo / Administrador / Cliente final | Fuerte | At-least-once + validación de no duplicidad de documento dentro de la misma reserva (RN-RES-005) | Es precondición obligatoria para crear una reserva; un reintento que duplique acompañantes alteraría el conteo de personas usado para capacidad y valor proyectado. |
| Crear/actualizar/inactivar/reactivar catálogo operativo | Administrador | Fuerte | At-least-once + idempotente (inactivar dos veces el mismo ítem no debe producir un estado distinto al de una sola inactivación) | Un catálogo inconsistente permitiría reservar un servicio ya inactivo o con tarifa desactualizada, afectando directamente el valor comercial calculado. |
| Crear reserva (proyección comercial) | Colaborador operativo / Administrador / Cliente final | Fuerte | At-least-once + idempotente por identificador de intento de reserva → efectivamente-once | Es la operación de mayor criticidad: involucra cupos limitados ("sin generar sobreventa", RNF de concurrencia) y dinero; un reintento sin idempotencia podría duplicar la reserva y sobrevender un recurso controlado. |
| Modificar reserva antes de ejecución | Colaborador operativo / Administrador | Fuerte | At-least-once + idempotente sobre el mismo identificador de reserva | Recalcula valores, descuentos, transporte y disponibilidad (RF-003A); un reintento no idempotente aplicaría el recálculo dos veces, alterando el saldo pendiente o a favor. |
| Cancelar reserva (automática por vencimiento o extraordinaria) | Sistema (automática) / Colaborador operativo / Administrador | Fuerte | At-least-once + idempotente (cancelar una reserva ya cancelada no debe liberar cupo dos veces) | Libera cupo previamente apartado (RN-RES-007); una cancelación duplicada generaría inconsistencias de disponibilidad para otros clientes del mismo tenant. |
| Registrar pago o abono de reserva | Cliente final / Colaborador operativo / Administrador | Fuerte | At-least-once + idempotente por identificador de intento de pago → efectivamente-once | Caso clásico de dinero: si la petición se reintenta por timeout, el sistema no debe registrar el mismo abono dos veces; afecta el estado de pago (RN-RES-006A) y, en cascada, la caja. |
| Validar o rechazar soporte de transferencia | Colaborador operativo (si el tenant lo habilita) / Administrador | Fuerte | At-least-once + idempotente sobre el mismo soporte | Dispara una transición de estado de pago (RN-RES-006B); una doble validación acumularía valor pagado que el cliente nunca transfirió. |
| Autorizar y ejecutar devolución monetaria | Administrador (autoriza) / Administrador o Colaborador operativo (ejecuta, solo con autorización previa) | Fuerte | At-least-once + idempotente, con separación explícita entre autorización y ejecución (RN-RES-008) | Es la operación de mayor riesgo financiero: ejecutar dos veces la misma devolución generaría una salida de dinero real sin respaldo en la reserva. |
| Registrar ejecución real del servicio | Colaborador operativo / Administrador | Fuerte | At-least-once + idempotente por reserva/servicio | Es la base para diferenciar lo proyectado de lo efectivamente prestado (objetivo central del PDR); un registro duplicado alteraría el conteo de personas atendidas y los costos derivados. |
| Registrar costo operacional | Administrador / Colaborador operativo | Fuerte | At-least-once + idempotente | Todo costo con salida de dinero se refleja en la fórmula BASE + INGRESOS − PAGOS − GASTOS − DEVOLUCIONES = TOTAL (RN-CAJ-001); un reintento duplicado desbalancearía la caja del día. |
| Abrir caja diaria | Colaborador operativo / Administrador | Fuerte | At-least-once + idempotente (una sola caja abierta por jornada y tenant) | La base diaria es el punto de partida de todos los cálculos de caja del día; abrirla dos veces por error rompería la fórmula de cierre. |
| Registrar movimiento de caja (ingreso, pago operacional, gasto) | Colaborador operativo / Administrador | Fuerte | At-least-once + idempotente por identificador de movimiento | Cada movimiento afecta directamente el total operativo diario; duplicarlo altera el balance real de dinero disponible. |
| Cerrar caja diaria | Colaborador operativo / Administrador (correcciones posteriores solo por Administrador) | Fuerte | At-least-once + idempotente (un cierre ya ejecutado no se repite; solo admite corrección excepcional trazable) | El cierre fija un total consolidado irreversible; reintentarlo sin control alteraría un histórico que el PDR exige conservar intacto salvo corrección excepcional documentada. |
| Consultar auditoría de eventos | Administrador de plataforma (transversal) / Administrador del tenant (según habilitación) | Eventual | At-least-once (relectura sin efecto colateral) | Es una operación de solo lectura sobre eventos ya ocurridos; una pequeña ventana de retraso entre el evento auditado y su disponibilidad de consulta no compromete dinero, cupos ni seguridad. |
| Consultar reportes y dashboard operativo/administrativo | Administrador, Gerente, Contador, Analista (según habilitación) | Eventual | At-least-once (relectura sin efecto colateral) | El propio PDR define estas vistas como derivadas de transacciones ya resueltas (por ejemplo, la consolidación mensual "se construye a partir de los movimientos diarios y sus cierres"); pueden actualizarse después de la transacción principal sin afectar su corrección funcional. |

**Total de operaciones analizadas:** 17 · **Consistencia fuerte:** 15 · **Consistencia eventual:** 2.

## Justificación de decisiones para el MVP 1

**Operaciones críticas (consistencia fuerte, prioridad de diseño del MVP 1).** Todas las operaciones que involucran dinero (pagos, devoluciones, costos, caja), cupos limitados (crear/modificar/cancelar reserva) o seguridad y aislamiento (crear tenant, autenticar) deben resolverse con consistencia fuerte y semántica efectivamente-once desde el primer corte del MVP 1. El PDR es explícito en que la resolución técnica de la concurrencia por el último cupo disponible "queda sujeta a arquitectura, siempre que preserve este resultado funcional sin sobreventa dentro del mismo tenant" (Sección 14, observación de concurrencia); esto significa que el mecanismo exacto (bloqueo pesimista, transacción serializable, control optimista con reintento) es una decisión de arquitectura pendiente, pero el resultado funcional —ninguna sobreventa, ningún pago duplicado, ninguna devolución ejecutada dos veces— no es negociable desde la Semana 1.

**Operaciones que pueden tolerar consistencia eventual.** La consulta de auditoría y los reportes/dashboard no bloquean ninguna decisión comercial en el momento en que ocurren: son vistas de lectura sobre hechos que ya fueron resueltos con consistencia fuerte en su operación de origen. El MVP 1 puede permitirse que estas vistas se actualicen con una ventana de latencia razonable (por ejemplo, mediante una proyección de lectura separada) sin comprometer la corrección funcional del negocio, liberando así esfuerzo de ingeniería para concentrarlo en las operaciones críticas.

**Alcance técnico no definido en el PDR.** El PDR no especifica mecanismos técnicos concretos de idempotencia (por ejemplo, claves de idempotencia por solicitud, deduplicación a nivel de base de datos o control transaccional específico): `NO DEFINIDO EXPLÍCITAMENTE EN EL PDR`. Estos mecanismos se infieren aquí como necesarios para cumplir los resultados funcionales que el PDR sí exige de forma explícita (no sobreventa, no doble pago, no doble devolución), y su implementación exacta queda como decisión pendiente para el diseño de arquitectura del MVP 1.

## Aislamiento multitenant y tenantId

Toda operación relacionada con clientes, reservas, catálogo, caja, costos, colaboradores y reportes debe conservar el aislamiento por tenant exigido por el PDR: "el historial, las reservas, los permisos y la información operativa del cliente deben permanecer aislados por tenant" y "el tenant activo de una operación debe quedar determinado antes de ejecutar autenticación, consulta o registro sensible".

Una inconsistencia en el `tenantId` sería crítica porque Multi Tour no es un sistema de un solo negocio: es una plataforma que aloja simultáneamente a varios operadores turísticos independientes (potencialmente competidores entre sí) bajo la misma infraestructura. Si una operación resolviera o propagara un `tenantId` incorrecto, el resultado no sería un simple error visual, sino una fuga de información comercial y financiera entre negocios distintos —reservas, caja o clientes de un tenant visibles o modificables desde otro—, lo que rompería la premisa central del PDR de que "cada empresa operadora funciona como un tenant aislado dentro de la misma solución". Por esta razón, toda operación de la tabla anterior que tenga consistencia fuerte debe entenderse además como fuerte *dentro del alcance de su propio tenant*: nunca se sacrifica el aislamiento para lograr disponibilidad o rendimiento.

## Conclusiones

El análisis muestra que Multi Tour es, funcionalmente, un sistema dominado por operaciones que requieren consistencia fuerte: la mayoría de sus procesos de negocio comprometen dinero real (pagos, devoluciones, caja) o recursos limitados (cupos de reserva), y ambos escenarios exigen que el resultado sea confiable, no duplicado y visible de inmediato para el actor que lo ejecuta. Solo las operaciones de consulta agregada —auditoría y reportes— pueden tolerar una ventana de actualización posterior sin comprometer la corrección funcional del negocio. Esta distinción, más que una decisión de infraestructura, es una decisión de negocio ya reflejada en el propio PDR (por ejemplo, en la regla de concurrencia por el último cupo disponible y en la separación explícita entre autorización y ejecución de una devolución), y debe usarse como guía inicial para justificar, en el diseño del MVP 1, dónde invertir el esfuerzo de control transaccional y dónde es razonable optar por un modelo de lectura eventual.
