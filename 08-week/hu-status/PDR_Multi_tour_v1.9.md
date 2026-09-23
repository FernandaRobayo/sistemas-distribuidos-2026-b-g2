# PDR - Multitour

## 1. Identificación del documento

- Producto: Multitour, plataforma multitenencia para operadores turísticos de naturaleza y aventura, con Travesía Natural como tenant principal de validación y demostración
- Tipo de documento: Product Definition Requirements (PDR)
- Fecha: 2026-09-23
- Versión: 1.9
- Estado documental: actualización de línea base funcional; incorpora el cierre de los pendientes GAP-01 a GAP-11 (sección 24.2) y las decisiones del equipo (sección 24.3); el cierre definitivo queda sujeto a la auditoría final (sección 24)
- Regla de identidad del producto: Multitour es el producto; Travesía Natural es el tenant principal de validación y demostración, y no equivale al producto completo

## 2. Autores

- MARIA FERNANDA ROBAYO LAGUNA
- JHON SEBASTIAN MOLINA FIERRO

## 3. Propósito del documento

Este documento define, desde un enfoque de ingeniería de software, las necesidades de **Multitour**, una plataforma multitenencia para operadores turísticos de naturaleza y aventura. Dentro de esa plataforma, **Travesía Natural** se utiliza como tenant principal de validación funcional y demostración, sin equivaler al producto completo. Su finalidad es servir de base para análisis, UX/UI, arquitectura, desarrollo, pruebas, validación y planificación, sin anticipar decisiones técnicas que todavía no han sido definidas.

Este PDR debe tratarse como línea base funcional final de Fase 1 para la entrega académica y como referencia base para alinear la documentación del proyecto en su repositorio autoritativo, sin que dicha alineación se considere realizada por el solo hecho de existir este documento.

## 3.1 Control de cambios

Las entradas se conservan como historial. Cuando una entrada posterior ajusta o reemplaza una regla, prevalece la entrada más reciente y el contenido vigente del documento; las entradas afectadas indican entre corchetes la decisión que las ajustó.

- Versión 1.9 - 2026-09-21: se cierran once pendientes funcionales de Fase 1 (GAP-01 a GAP-11) que no quedaron especificados en versiones anteriores:
  - (1) GAP-01 - Colaborador operativo: el registro requiere nombre completo, correo electrónico como usuario de acceso, contraseña inicial definida por el Administrador y su confirmación; la contraseña debe tener mínimo 8 caracteres con al menos una mayúscula, una minúscula, un número y un carácter especial; correo duplicado en el mismo tenant bloquea el registro; el Administrador puede inactivar la pertenencia con trazabilidad obligatoria; la recuperación de contraseña es autoservicio independiente. [Ajustada por A4, A5, D2, E9 y E20.]
  - (2) GAP-02 - Pagos por transferencia: el cliente debe subir una imagen de comprobante de pago al registrar una transferencia; la imagen es evidencia de envío y no constituye ingreso de caja hasta ser validada. [Ajustada por M6.]
  - (3) GAP-03 - Confirmación de reserva: la reserva permanece en estado Pendiente de pago mientras se registran abonos parciales; avanza a Confirmada únicamente cuando se cumple la condición de pago completa configurada para ese tenant y servicio; los abonos parciales quedan registrados y visibles pero no activan la confirmación. [Ajustada por C5, E3 y E18.]
  - (4) GAP-06 - Inactivación de tenant: al inactivar un tenant, todas las sesiones activas de Administradores y Colaboradores de ese tenant se cierran inmediatamente y de forma automática; no se permiten nuevas operaciones hasta que el tenant sea reactivado explícitamente. [Ajustada por A6, E6 y E26.]
  - (5) GAP-07 - Cambio de fecha de reserva: un cambio exclusivo de fecha modifica la misma reserva sin crear una nueva, sujeto a las políticas de cambio configuradas para cada tour; si las políticas no lo permiten, la modificación queda bloqueada. [Ajustada por C2, E7 y E25.]
  - (6) GAP-11 - Reporte mensual de caja: el total mensual se calcula sumando todos los movimientos individuales del mes (ingresos menos pagos operacionales menos gastos operacionales menos devoluciones ejecutadas); los cierres diarios no se re-suman; cada movimiento se cuenta una sola vez. [Ajustada por E13.]
  - (7) GAP-04 - Hoteles y restaurantes como convenios: en Fase 1, el único servicio con reserva y gestión de cupos en la plataforma es el tour. Hoteles y restaurantes son establecimientos asociados por convenio; la plataforma muestra sus datos de contacto para que el cliente coordine directamente, pero no genera reserva de habitación ni de mesa y no gestiona inventario de hospedaje ni de alimentación. [Ajustada por C1 y E12.]
  - (8) GAP-05 - Vencimiento de reserva con pago pendiente: el tratamiento del abono parcial al cancelar por vencimiento es una política parametrizable por tenant; el Administrador de cada tenant decide si aplica devolución, saldo a favor u otra condición comercial. Cuando un soporte de transferencia está en validación y el plazo configurado vence, el sistema no cancela automáticamente la reserva; queda en espera de la decisión explícita del Administrador del tenant. [Ajustada por C3, D1, E5, E14 y E16.]
  - (9) GAP-08 - Retención de datos sensibles: el periodo de retención de un año inicia desde la fecha de creación de la reserva. Al cumplirse el año, los datos sensibles elegibles se eliminan automáticamente. El acceso al archivo restringido está permitido al Administrador de plataforma y al Administrador del tenant propietario de la reserva. [Ajustada por C4 y E8.]
  - (10) GAP-09 - Carga normal y navegadores de Fase 1: la carga operativa normal de referencia para Fase 1 es 4 colaboradores internos más 30 clientes simultáneos por tenant. Los navegadores validados son Chrome y Safari en sus dos últimas versiones estables al momento de la validación. Los criterios mínimos verificables ya definidos en la sección 17 de este PDR constituyen la línea base de aceptación de RNF; la verificación se realiza mediante pruebas funcionales del equipo contra esos criterios. [Ajustada por M5 y E19.]
  - (11) GAP-10 - Ciclo de vida de colaboradores y establecimientos asociados: el Administrador del tenant puede crear, inactivar y reactivar colaboradores; la reactivación es permitida y debe quedar con trazabilidad. El Administrador del tenant puede inactivar y reactivar establecimientos asociados; la reactivación restaura la visibilidad promocional. La gestión de establecimientos asociados (crear, inactivar, reactivar) está restringida al Administrador del tenant; el Colaborador operativo no tiene acceso a estas operaciones. [Ajustada por E9.]
- Decisión del equipo C1 en la versión 1.9 - 2026-09-23: se aplica GAP-04 a todo el documento. Hoteles y restaurantes quedan exclusivamente como establecimientos asociados de carácter informativo y de contacto, sin reserva, cupos, tarifas ni inventario en la plataforma; se retiran RN-HOS-001 y RN-HOS-003 y se redefine RN-ALI-001 para la comida incluida en el paquete del tour; RF-006, CA-006 y TRA-005 pasan a validar el cupo del tour; RF-013, CA-013 y TRA-012 pasan a consultar tours y establecimientos asociados; se ajustan alcance, procesos, políticas de cupo y supuestos. El transporte se mantiene como parte de la reserva, prestado directamente por el operador del tenant como parte del tour, y, cuando es obligatorio o está incluido, su capacidad restringe el cupo disponible de la salida. [Ajustada por E12 (capacidad de la salida).]
- Decisiones del equipo C2, C3, C4, C5, A4, A5, A6, M1, M5 y M6 en la versión 1.9 - 2026-09-23: se resuelven las inconsistencias detectadas en la revisión del PDR. C2: un cambio exclusivo de fecha se registra sobre la misma reserva. C3: una reserva con comprobante presentado dentro del plazo no se cancela automáticamente, conserva su cupo y su revisión tiene un máximo operativo de 24 horas con escalamiento; sin comprobante dentro del plazo la reserva se cancela y libera cupo. C4: los datos sensibles se conservan hasta un año desde la finalización del servicio o el cierre definitivo y luego se eliminan de forma definitiva; el Administrador de plataforma no tiene acceso ordinario a ellos. C5: el pago total confirma al validarse el 100 % y el abono al validarse el abono mínimo; el estado de pago Pagado se reemplaza por Abono recibido y Pago completo. A4: política centralizada de contraseñas para todos los usuarios, credencial inicial temporal del Colaborador y recuperación para todos con auditoría en cuentas privilegiadas. A5: correo de colaborador único por tenant sin importar su estado. A6: la inactivación de un tenant revoca todas sus sesiones y suspende sus reservas Pendientes de pago. M1: la caja consolida todos los medios de pago y concilia el efectivo aparte. M5: el rendimiento se valida con pruebas de carga. M6: el comprobante se acepta en PDF, JPG, JPEG o PNG de hasta 5 MB. Estas decisiones sustituyen lo indicado sobre esos temas en las entradas GAP-02, GAP-03, GAP-05, GAP-06, GAP-08 y GAP-09 del 2026-09-21; el detalle queda en la sección 24.3. [Ajustada por E1 a E26 (en particular, los estados de pago por E3, la revisión de comprobantes por E14 y la caja por E13).]
- Decisiones del equipo D1 a D9 en la versión 1.9 - 2026-09-23: se cierran los pendientes restantes de la revisión. D1: el abono de una reserva cancelada por vencimiento solo puede devolverse o registrarse como saldo a favor. D2: la contraseña inicial del primer Administrador del tenant es temporal. D3: la recuperación de cuentas administrativas usa código o enlace temporal de un solo uso con auditoría, invalidación de sesiones y notificación; la autenticación multifactor queda para después de Fase 1. D4: el tenant define el plazo para completar el saldo y el saldo debe estar pagado antes de iniciar la ejecución. D5: el cupo se aparta al presentar el comprobante, previa validación de disponibilidad. D6: un comprobante sin decisión por más de 24 horas se marca como revisión vencida con alerta prioritaria al Administrador del tenant. D7: el nombre oficial del producto es Multitour y el documento se redacta con tildes y eñe. D8: se conserva En validación como nombre oficial del estado. D9: la promesa de pago en efectivo no confirma una reserva y el pago completo en sitio queda fuera de Fase 1. El detalle queda en la sección 24.3. [Ajustada por E2 (cupo), E14 (revisión de comprobantes) y E16 (tratamiento de valores abonados).]
- Decisiones del equipo E1 a E26 y correcciones editoriales en la versión 1.9 - 2026-09-23: se resuelven las inconsistencias de la auditoría final del PDR. Se definen la cancelación por saldo vencido (E1); el apartamiento de cupo con el primer pago, que reemplaza las políticas de cupo configurables (E2); la separación entre estado del comprobante y situación financiera de la reserva (E3); la distinción entre tipo y medio de pago (E4); la cancelación sin reactivación manual por rechazo después del vencimiento (E5); el tratamiento de reservas confirmadas con tenant inactivo (E6); la exención de la reprogramación por emergencia (E7); el alcance de los datos sensibles, consentimientos y respaldos (E8); la gestión de usuarios internos por los Administradores del tenant (E9); las notificaciones al cliente por correo (E10); el registro del inicio y fin de las salidas (E11); la definición de salida y su capacidad (E12); la caja por medio de pago y el efectivo esperado (E13); la revisión de comprobantes por usuarios con permiso (E14); el plazo de pago y su única ampliación (E15); el tratamiento de valores abonados (E16); el saldo a favor (E17); la base del abono mínimo (E18); el escenario de la prueba de carga (E19); los tiempos de recuperación y credenciales temporales (E20); el acceso excepcional del Administrador de plataforma (E21); el acceso a datos sensibles (E22); los indicadores del dashboard (E23); la vinculación de identidad del cliente (E24); el cambio de fecha con pagos (E25) y los accesos con tenant inactivo (E26). Se agregan RN-SAL-001, RF-019, CA-022, CA-023, TRA-021 y TRA-022. Correcciones editoriales: se normaliza "Administrador" como "Administrador del tenant", "soporte" como "comprobante" en el contexto de pagos y "saldo a favor pendiente" como "saldo a favor"; se precisa que "gasto" y "gasto operacional" son el mismo concepto y que costo operacional, pago operacional y gasto operacional son conceptos distintos; se corrigen tildes pendientes y se actualiza la fecha del documento. El detalle queda en la sección 24.3. [Ajustada por G1 a G18.]
- Decisiones del equipo L1 a L10 y correcciones editoriales en la versión 1.9 - 2026-09-23: plazo de 24 horas corridas para proponer una reprogramación, con cancelación y devolución del 100 % si no se propone (L1); congelamiento de los plazos económicos durante la respuesta a la reprogramación (L2); plazo máximo de 5 días hábiles para ejecutar devoluciones y su efecto en la retención de datos (L3); alertas y regularización de salidas sin registros, sin cierre automático (L4); cierre o interrupción de salidas en curso con el tenant inactivo (L5); diferencia generada después del plazo del saldo (L6); tratamiento del excedente por modificación (L7); cancelación solicitada por el cliente, con el nuevo RF-021 (L8); verificación obligatoria del correo del cliente y búsqueda del cliente existente (L9); creación automática de la caja del día para transferencias (L10). Correcciones editoriales: la sección 24 vuelve a "en proceso"; la sección 16 explicita que la salida interrumpida pasa a Finalizada; se marcan las filas reemplazadas de la tabla 24.3; se precisa la asignación de cupos al agregar viajeros; se define el tratamiento de fallas de correo a usuarios internos; se aclara CA-026; y se distingue el saldo pendiente como monto. Se agregan RF-021, CA-031 y TRA-024.
- Cierre documental de la versión 1.9 - 2026-09-23: la auditoría final de consistencia y trazabilidad no identifica brechas funcionales abiertas; la sección 24 pasa a declaración de cierre y la versión 1.9 se declara línea base funcional final de Fase 1. [Reemplazada: una auditoría posterior identificó las brechas P1 a P10, resueltas por las decisiones L1 a L10; el cierre queda sujeto a una nueva auditoría final.]
- Decisiones del equipo K1 a K4 en la versión 1.9 - 2026-09-23: la salida interrumpida termina en Finalizada con la interrupción registrada (K1); la cancelación de una salida programada la realiza el Administrador del tenant (K2); al proponer una reprogramación se apartan los cupos de los viajeros en la salida propuesta hasta la aceptación, el rechazo, el vencimiento del plazo o la hora programada de la nueva salida, y la propuesta solo se envía si hay capacidad (K3); un Administrador del tenant puede asignarse a sí mismo el permiso Consultar datos sensibles, con auditoría de la asignación y de cada consulta (K4).
- Decisiones del equipo J3, J4 y J5 en la versión 1.9 - 2026-09-23: una salida sin registro de inicio real o de finalización al alcanzar su hora de finalización estimada genera una alerta a los Administradores del tenant activos y no se cierra automáticamente (J3); el acceso de emergencia del Administrador de plataforma envía un correo al iniciar y otro al finalizar (J4); el Administrador del tenant tiene por perfil los permisos Validar comprobantes, Gestionar caja y Gestionar ejecución de salidas, mientras que Consultar datos sensibles requiere asignación explícita (J5). Se agrega CA-030.
- Decisiones del equipo I1 e I2 en la versión 1.9 - 2026-09-23: si la hora programada de una salida se alcanza con el tenant inactivo, la salida se cancela automáticamente por una causa no atribuible al cliente, sin cancelaciones por incumplimiento de pago, y sus reservas pueden reprogramarse (I1); el cliente tiene hasta 72 horas corridas para responder a una propuesta de reprogramación y, si no responde, la reserva se cancela con devolución del 100 % (I2). Se agregan CA-028 (emergencia personal del cliente) y CA-029 (estados de la salida).
- Decisiones del equipo H1 a H17 y correcciones editoriales en la versión 1.9 - 2026-09-23: la hora programada de inicio de la salida es el límite absoluto de los plazos económicos y a esa hora se bloquean pagos y se cancelan las reservas no elegibles (H1); una salida interrumpida permite reprogramar con regreso excepcional de En ejecución a Confirmada o cancelar con devolución del 100 % (H2); la salida tiene estados propios (H3); las 24 horas del tratamiento cuentan desde que el dinero queda reconocido (H4) y la devolución predeterminada se notifica a todos los Administradores del tenant activos (H5); se agrega el correo por cancelación o reprogramación de salida (H6); la emergencia personal del cliente es una novedad de ejecución (H7); la protección de capacidad cubre tour y transporte (H8); el Administrador del tenant también registra inicio y fin de salida (H9); el cambio de fecha traslada el cupo (H10); el sobrepago genera saldo a favor (H11); se agrega la situación financiera Saldo pendiente para pago total (H12); el estado de bloqueantes se registra solo en la sección 24 (H13); la disponibilidad tiene fórmula mensual explícita (H14); se confirma CA-026 (H15); y se define el correo del acceso de emergencia, con lo que queda cerrada la decisión 17 (H17). Se unifica la expresión "causa no atribuible al cliente" para cancelaciones e interrupciones de salidas. [Ajustada por I1 e I2.]
- Decisiones del equipo G1 a G18 y correcciones editoriales en la versión 1.9 - 2026-09-23: ningún plazo de pago supera el inicio de la salida y al iniciarla se cancelan las reservas no habilitadas (G1); cada reserva corresponde a una única salida, con la nueva regla RN-RES-010 (G2); las salidas tienen hora de finalización estimada y las programa el Administrador del tenant, con el nuevo RF-020 (G3); con el tenant inactivo se suspenden todos los plazos operativos y el Administrador del tenant puede registrar devoluciones (G4); se reemplaza "usuario autorizado" por actores concretos y se definen cuatro permisos especiales (G5); vale el monto verificado del comprobante y el excedente es saldo a favor (G6); la devolución del 100 % es el tratamiento predeterminado a las 24 horas (G7); el pago total admite varios pagos y las diferencias se pagan antes de la salida (G8); no se crean reservas para salidas llenas (G9); el primer pago con saldo a favor aparta cupo en una única operación (G10); se precisa el cierre definitivo (G11); la cancelación atribuible al tenant da derecho a reprogramación o devolución del 100 % (G12); una caja por día con reapertura y transferencias posteriores al cierre (G13); zona horaria oficial por tenant (G14); proceso de activación (G15); RNF verificables (G16); Cancelada es un estado terminal (G18). Se agregan RN-RES-010, RF-020, CA-024 a CA-027 y TRA-023. Correcciones editoriales: RF-006 pasa a "Validar cupo disponible de la salida", se actualiza el estado documental y la sección 24 deja de declarar el cierre hasta la auditoría final. [Ajustada por H1 a H17.]
- Alineación editorial de la versión 1.9 - 2026-09-23: se corrige el conteo de pendientes cerrados en este control de cambios; se actualizan a la versión 1.9 las referencias de las secciones 17 y 24.1; se reubican las observaciones GAP-08 y GAP-09 al final de la lista de RNF y se precisa la compatibilidad con los navegadores definidos en GAP-09; se renombran RF-008 y TRA-007 para reflejar que restringen ajustes en ejecución; se corrige la excepción de RF-001; se unifica el término gastos operacionales en GAP-11; se sincroniza RN-RES-006B con las transiciones a Saldo a favor pendiente de la sección 16; se incorporan a la sección 15 las parametrizaciones ya definidas en el documento; se trasladan a RF, CA y trazabilidad las reglas ya confirmadas de gestión de tenants, colaboradores, establecimientos asociados y comprobante de transferencia; y se agrega el registro de pendientes cerrados en la sección 24.2. Esta alineación no modifica reglas de negocio. [La referencia a "Saldo a favor pendiente" fue reemplazada por E3 y E17.]
- Alineación documental de la versión 1.8: se incorpora en la sección 11.1 el agrupamiento estipulado de cuatro macrodominios y once contextos de negocio, conforme a la tabla confirmada por el equipo y a ADR-004. Se conserva el nombre de producto Multitour. Esta incorporación no modifica los RF/RN/CA ni acredita implementación o despliegue de servicios.
- Versión 1.8 - 2026-09-18: se formalizan los campos obligatorios del registro de Cliente final y el flujo funcional mínimo de recuperación de contraseña. El registro requiere nombre, apellido, correo electrónico, número de teléfono, contraseña y confirmación de contraseña, exigiendo que contraseña y su confirmación coincidan antes de crear la cuenta. La recuperación requiere correo electrónico, código de recuperación, nueva contraseña y confirmación de nueva contraseña, exigiendo que ambos valores de contraseña coincidan antes de completar el cambio. Ambos flujos preservan el aislamiento por tenant ya definido: el correo electrónico puede repetirse en distintos tenants sin mezclar cuentas, reservas ni credenciales entre ellos, y la recuperación solo afecta la pertenencia o credencial del tenant previamente determinado. Los aspectos técnicos del código de recuperación (generación, longitud, formato, vigencia, cantidad de intentos, canal de envío y almacenamiento) quedan sujetos a definición posterior de arquitectura, seguridad y contratos.
- Versión 1.7.1 - 2026-09-03: se precisa la gestión de colaboradores operativos por el Administrador de cada tenant, incluyendo creación de identidad de acceso, asociación obligatoria al tenant activo, asignación del perfil base y restricción explícita de administración avanzada de roles y permisos personalizados en Fase 1.
- Versión 1.7 - 2026-08-29: cierre editorial y de consistencia para entrega final del PDR, incluyendo alineación de la versión visible del documento con su historial, ajuste de la redacción de la línea base no funcional vigente, aclaración de la relación entre perfiles base obligatorios y roles opcionales por tenant, y reformulación de la regla de reagendamiento con nueva reserva vinculada para evitar interpretarla como una transición de estado.
- Versión 1.6 - 2026-08-29: ajuste de consistencia funcional del PDR para cierre de ambigüedades previas a arquitectura, incluyendo definición observable de identidad del cliente entre tenants, cierre explícito del alcance de autogestión del cliente final en Fase 1, precisión de la regla funcional de concurrencia para cupos limitados, corrección de la semántica de reagendamiento para evitar tratarla como estado de reserva, incorporación explícita de observabilidad, compatibilidad y concurrencia dentro de la línea base no funcional, y aclaración formal de que las restricciones académicas y de despliegue deben justificarse en arquitectura o ADR sin modificar el alcance funcional confirmado.
- Versión 1.5 - 2026-08-29: consolidación final del PDR para Fase 1, ajuste de consistencia documental entre roles opcionales por tenant y sus permisos base, actualización de la línea base no funcional vigente a esta versión, cierre de pendientes funcionales de Fase 1 y conversión de notas abiertas en definiciones cerradas del documento.
- Versión 1.4 - 2026-08-29: incorporación de personalización visual básica por tenant dentro de los límites del sistema de diseño de la plataforma, aclaración explícita de las modalidades de pago soportadas en Fase 1, ajuste de identificación del producto como Multitour dentro de un enfoque multitenencia, definición de roles opcionales por tenant con permisos base para Gerente, Contador y Analista, cierre del contenido obligatorio del dashboard diario y del reporte administrativo mensual, definición explícita de políticas de cupo por tipo de servicio en Fase 1 y cierre de la regla de retención y auditoría funcional mínima. Se confirma que Multitour soporta transferencia, efectivo y abono como modalidades habilitables por tenant o servicio, y que tarjeta débito o crédito mediante pasarela queda como evolución futura fuera del alcance actual.
- Versión 1.3 - 2026-08-29: actualización del canal de atención y autogestión del cliente final, sustituyendo el enfoque exclusivo de aplicación móvil por un canal digital adaptable para web y móvil. Se ajustan objetivo específico, actores, alcance, procesos, requerimientos funcionales, criterios de aceptación y trazabilidad para reflejar comportamiento responsive y disponibilidad del mismo flujo comercial en navegador web y dispositivo móvil.
- Versión 1.2 - 2026-08-23: actualización del enfoque del producto hacia multitenencia, manteniendo a Travesía Natural como tenant principal de validación y demostración. Se incorporan criterios de aislamiento por tenant en alcance, seguridad, trazabilidad, datos, procesos, pagos, cupos, caja, reportes y riesgos. Sobre esta misma versión se consolidan también reglas explícitas para reintentos de pago, saldo a favor, reagendamiento, catálogo de parametrizaciones permitidas en Fase 1, alineación del proceso de caja con devoluciones y cierre de la línea base no funcional de Fase 1.
- Versión 1.1 - 2026-08-19: refinamiento funcional y no funcional del PDR, incluyendo mayor precisión en permisos base, descuentos, pagos pendientes, estados de reserva, criterios de aceptación, RNF base de Fase 1 y delimitación de alcance.

## 4. Contexto y antecedentes

Travesía Natural es una operación de turismo de naturaleza y aventura que sirve como caso base de validación funcional para este proyecto y como tenant principal de referencia dentro de la plataforma. Actualmente, parte importante de su gestión se apoya en diferentes archivos de Excel utilizados para registrar y controlar información relacionada con las reservas, los pagos operacionales, los gastos operacionales y la consolidación contable interna.

Las fuentes históricas revisadas muestran que el problema principal no radica en la ausencia de registro, sino en la dispersión de la información y en la dificultad para diferenciar:

- Lo proyectado al vender una reserva.
- Lo realmente prestado durante la ejecución.
- Los costos operacionales internos.
- Los gastos generales y el flujo de caja.

A partir de la decisión de producto tomada por el equipo el 2026-08-23, la solución deja de entenderse como un sistema exclusivo para una sola empresa y pasa a definirse como una **plataforma multitenencia**. En este nuevo enfoque, cada empresa operadora funciona como un **tenant** aislado dentro de la misma solución, con sus propios usuarios, clientes, reservas, catálogos, costos, caja y reportes. Travesía Natural se mantiene como el tenant principal de demostración y referencia funcional, pero no representa por sí solo el alcance total del producto.

## 5. Planteamiento del problema

La operación actual dificulta conocer con claridad:

- Cuánto se vendió en cada reserva.
- Qué servicios realmente se prestaron.
- Cuáles fueron los costos reales de operación.
- Cuál fue el impacto de esa operación en la caja del negocio.

Esta situación afecta la trazabilidad operativa, la visibilidad de la rentabilidad por reserva y el control administrativo de la operación.

## 6. Justificación

El proyecto se justifica por la necesidad de centralizar información que actualmente se consulta y consolida de forma manual a partir de diferentes archivos de Excel. Una solución integrada permitiría fortalecer el registro de reservas, el seguimiento de los servicios efectivamente prestados, el control de costos operacionales y la consolidación de caja.

Adicionalmente, el enfoque multitenencia permite que la solución no quede limitada a una única operación turística. La plataforma podrá ser utilizada por varias empresas del mismo sector, preservando el aislamiento de información, configuraciones y operación, mientras Travesía Natural se conserva como tenant principal para validar el alcance funcional y demostrar el comportamiento del sistema como uno de los tenants de la plataforma.

## 7. Objetivo general

Construir una plataforma multitenencia para operadores turísticos de naturaleza y aventura que permita centralizar la gestión de reservas, la ejecución real de servicios, el control de costos operacionales y la consolidación de caja, incluyendo canales internos y atención directa al cliente final, usando a Travesía Natural como tenant principal de validación y demostración dentro del conjunto de tenants soportados por la plataforma.

## 8. Objetivos específicos

- Centralizar la información de clientes, atractivos, transporte, establecimientos asociados y otros datos operativos necesarios.
- Registrar reservas como proyección comercial de los servicios solicitados.
- Permitir que el cliente final consulte la oferta disponible, cree su cuenta, inicie sesión, recupere su contraseña y gestione su reserva y servicios habilitados en Fase 1 desde un canal digital adaptable para web y móvil.
- Diferenciar lo reservado de lo realmente prestado.
- Registrar costos operacionales asociados a la ejecución.
- Consolidar ingresos, pagos y gastos para control interno de caja.
- Garantizar aislamiento funcional y de datos entre tenants, permitiendo que cada empresa opere con sus propios usuarios, configuraciones y registros sin mezclar información con otros tenants.

## 9. Stakeholders y actores identificados

### Stakeholders identificados

- Travesía Natural como tenant principal de validación funcional y referencia de demostración dentro de la plataforma multitenencia.
- Operadores turísticos futuros o potenciales con necesidades equivalentes, como beneficiarios del enfoque multitenencia de la plataforma.
- Equipo académico del proyecto como parte interesada en las restricciones obligatorias del proyecto.

### Actores operativos identificados en las fuentes del proyecto

- Administrador de plataforma.
- Administrador del tenant.
- Colaborador operativo.
- Cliente final usuario de canal digital adaptable para web y móvil para consulta y autogestión de reservas.

Estas denominaciones ya se encuentran alineadas con los roles formales confirmados para esta versión del documento.

Observación de multitenencia:
Los roles descritos en esta sección se entienden dentro del contexto de un tenant específico. Un Cliente final, un Administrador del tenant o un Colaborador operativo solo pueden operar sobre la información del tenant al que pertenecen o del que son responsables.

### Roles del sistema confirmados

- Administrador de plataforma: usuario interno responsable del alta, activación, inactivación, reactivación y trazabilidad administrativa de tenants. No participa en la operación comercial diaria de un tenant salvo en acciones excepcionales de soporte auditado.
- Cliente final: usuario que consulta tours, descuentos e información de establecimientos asociados, y gestiona su propia reserva desde un canal digital adaptable para web y móvil habilitado para clientes.
- Administrador del tenant: usuario con control general del sistema, incluyendo reservas, descuentos, caja y demás configuraciones habilitadas por el negocio.
- Colaborador operativo: usuario con múltiples funciones operativas, incluyendo reservas, seguimiento diario, caja y registro de gastos operacionales, sin permisos para configurar o autorizar descuentos.

Regla de cierre de roles:
Los roles anteriores constituyen los perfiles base obligatorios confirmados para Fase 1. Los roles opcionales por tenant definidos más adelante no reemplazan estos perfiles base y solo aplican cuando el tenant decide habilitarlos dentro de su propia operación.

### Permisos base de Fase 1

- Administrador de plataforma: puede crear tenants, activar o inactivar tenants, reactivar tenants, registrar el primer Administrador de cada tenant, consultar auditoría transversal de plataforma y ejecutar soporte administrativo excepcional con trazabilidad obligatoria. No puede registrar reservas, pagos, gastos ni movimientos de caja de un tenant salvo dentro de un acceso excepcional autorizado conforme a esta sección. No tiene acceso ordinario a los datos operativos ni a los datos sensibles de los tenants (decisiones del equipo C4 y E21 — 2026-09-23).
- Cliente final: puede crear su cuenta, autenticarse, recuperar su contraseña, consultar la oferta disponible, crear su propia reserva, consultar el estado de sus reservas y avanzar al flujo de pago según los tipos y medios de pago habilitados.
- Administrador del tenant: puede gestionar reservas, usuarios internos de su propio tenant, parámetros de descuentos, base diaria de caja, configuraciones operativas habilitadas, consultas administrativas y operaciones sensibles que requieran autorización.
- Colaborador operativo: puede registrar reservas, consultar reservas del día y próximas, registrar seguimiento de reservas pendientes de pago, registrar el inicio y la finalización de las salidas y la ejecución, registrar gastos operacionales reales y operar caja dentro de los límites definidos por el negocio.
- Restricción base: solo el Administrador del tenant puede autorizar descuentos adicionales y autorizar devoluciones monetarias.
- Restricción base: la validación o el rechazo de comprobantes de transferencia puede realizarlos cualquier usuario activo del tenant que disponga del permiso Validar comprobantes. El Administrador del tenant dispone de este permiso y puede asignarlo a Colaboradores operativos; los roles Gerente, Contador y Analista no pueden recibirlo. Toda validación o rechazo queda registrado. Los tenants que habiliten la transferencia como medio de pago deben mantener al menos un usuario activo con este permiso (decisión del equipo E14 — 2026-09-23).
- Restricción base: el acceso a información médica, tipo de sangre, restricciones físicas, contactos de emergencia, consentimientos y documentos sensibles asociados a actividades de riesgo requiere el permiso Consultar datos sensibles, que solo puede asignarse a usuarios del tenant cuya función operativa lo justifique (Administrador del tenant o Colaborador operativo, cuando la actividad del día o la gestión previa de la reserva lo requieran). El permiso general para consultar clientes no otorga este acceso: los roles Gerente, Contador y Analista no pueden consultar estos datos. Toda consulta sobre información sensible debe quedar auditada (decisión del equipo E22 — 2026-09-23).
- Restricción base: el Colaborador operativo no puede configurar descuentos, autorizar descuentos adicionales ni modificar la base parametrizada de caja.
- Restricción base: el Cliente final no puede consultar ni modificar reservas de otros clientes ni ejecutar operaciones administrativas de caja, descuentos o configuración.
- Restricción base de multitenencia: ningún usuario puede consultar, crear, modificar, ejecutar ni consolidar información perteneciente a un tenant distinto del suyo.

### Acceso excepcional del Administrador de plataforma

- El Administrador de plataforma no tiene acceso ordinario a los datos operativos de los tenants ni a sus datos sensibles.
- Cuando sea necesario acceder excepcionalmente para soporte, diagnóstico o resolución de una incidencia, un Administrador del tenant debe aprobar el acceso. La autorización tiene una vigencia máxima de 24 horas, está limitada al tenant y al alcance necesario para resolver el caso y expira automáticamente.
- La inactivación del tenant no elimina el requisito de autorización. Mientras exista un Administrador del tenant con acceso restringido disponible, este debe aprobar el acceso.
- Únicamente cuando no sea posible obtener dicha autorización y exista una incidencia crítica puede utilizarse un mecanismo excepcional de acceso de emergencia, con justificación obligatoria, mínimo privilegio, duración máxima de 24 horas y auditoría completa. Multitour debe enviar un correo electrónico a todos los Administradores del tenant activos al iniciarse el acceso y otro al finalizar. Los correos deben indicar como mínimo el tenant afectado, el Administrador de plataforma que realizó el acceso, el motivo o justificación, la fecha y hora de inicio y el alcance del acceso; el correo de finalización debe indicar además la fecha y hora de finalización. Ninguno debe incluir información médica ni datos sensibles consultados (J4). Si el correo falla, el acceso no se invalida, pero el fallo de notificación debe quedar registrado (decisión del equipo H17 — 2026-09-23).
- Todo acceso excepcional queda registrado en auditoría (decisión del equipo E21 — 2026-09-23).

### Gestión de usuarios internos del tenant

- Al crear un tenant, el Administrador de plataforma registra su primer Administrador del tenant. Posteriormente, los Administradores del tenant gestionan los usuarios internos de su organización, exclusivamente dentro de su propio tenant: Administradores del tenant adicionales, Gerentes, Contadores, Analistas y Colaboradores operativos (decisión del equipo E9 — 2026-09-23).
- Al registrar un usuario interno, el sistema debe crear su identidad de acceso, asociarla al tenant activo y asignarle el perfil correspondiente.
- Cada usuario interno solo puede acceder a las funciones autorizadas para su perfil y a los permisos específicos que le hayan sido asignados, y nunca a información de otros tenants.
- Un tenant puede disponer de múltiples Administradores del tenant activos. El sistema no debe permitir inactivar ni retirar privilegios al último Administrador del tenant activo si la operación deja al tenant sin ninguna cuenta administrativa disponible.
- Esta gestión no habilita administración avanzada de roles ni permisos personalizados, que permanecen fuera del alcance de Fase 1. Los únicos permisos especiales asignables en Fase 1 son cuatro: Validar comprobantes, Consultar datos sensibles, Gestionar caja y Gestionar ejecución de salidas. El permiso Gestionar ejecución de salidas habilita a un Colaborador operativo para registrar el inicio y la finalización de una salida (decisión del equipo G5 — 2026-09-23). El Administrador del tenant tiene por su perfil los permisos Validar comprobantes, Gestionar caja y Gestionar ejecución de salidas. El permiso Consultar datos sensibles no se otorga por perfil: debe asignarse de forma explícita a cada usuario que lo requiera, incluidos los Administradores del tenant; un Administrador del tenant puede asignárselo a sí mismo. Los permisos especiales los asignan los Administradores del tenant, y tanto la asignación del permiso Consultar datos sensibles como cada consulta de datos sensibles quedan auditadas (H9, J5, K4).

#### Campos obligatorios para el registro de un usuario interno

El registro de un usuario interno requiere los siguientes datos. La contraseña inicial y su confirmación deben coincidir. El correo electrónico actúa como usuario de acceso dentro del tenant.

| Campo | Obligatorio |
| --- | --- |
| Nombre completo | Sí |
| Correo electrónico (usuario de acceso) | Sí |
| Contraseña inicial | Sí |
| Confirmar contraseña | Sí |

#### Reglas comunes de identidad y acceso de los usuarios internos

Todos los usuarios creados administrativamente, incluido el primer Administrador del tenant, están sujetos a las mismas reglas (decisiones del equipo A4, A5, D2, E9 y E20 — 2026-09-23):

- Correo único dentro del tenant, independientemente de si el usuario está activo o inactivo. Si el correo ya existe, el sistema debe bloquear el registro e informarlo. Cuando el correo pertenezca a un usuario inactivo, el sistema debe indicar que el registro existente puede ser reactivado, sin crear un segundo registro.
- La contraseña inicial es una credencial temporal: debe cumplir la política centralizada de contraseñas y tiene una vigencia máxima de 72 horas. El proceso de activación consiste en el primer uso de una credencial temporal válida, en el que el usuario debe establecer su propia contraseña antes de obtener acceso normal al sistema. Si la credencial vence antes del primer acceso, la cuenta permanece registrada pero no permite autenticación con esa credencial. Un administrador con autoridad sobre la cuenta puede emitir una nueva credencial temporal, que invalida cualquier credencial temporal anterior e inicia un nuevo periodo de 72 horas: para el primer Administrador del tenant la emite un Administrador de plataforma; para los demás usuarios internos, un Administrador del tenant. La emisión conserva trazabilidad del responsable, la fecha y la hora (decisión del equipo G15 — 2026-09-23).
- Recuperación de acceso conforme a la política centralizada de contraseñas y recuperación de acceso.
- La inactivación no elimina el histórico y debe quedar registrada con trazabilidad del responsable, fecha, hora y motivo. Un usuario inactivo no puede autenticarse ni ejecutar operaciones dentro del tenant.
- La reactivación restaura el acceso del registro existente y debe quedar registrada con trazabilidad del responsable, fecha, hora y motivo (GAP-10).
- La inactivación individual de un usuario se conserva aunque el tenant sea inactivado y posteriormente reactivado.

### Política centralizada de contraseñas y recuperación de acceso

Aplica a todos los usuarios autenticados: Cliente final, Colaborador operativo, roles opcionales por tenant, Administrador del tenant y Administrador de plataforma (decisiones del equipo A4, D3 y E20 — 2026-09-23).

- Toda contraseña debe cumplir las siguientes condiciones, aplicadas de forma uniforme a todos los usuarios:
  - Mínimo 8 caracteres.
  - Al menos una letra mayúscula.
  - Al menos una letra minúscula.
  - Al menos un número.
  - Al menos un carácter especial.
- No se permiten contraseñas comunes ni contraseñas conocidas como comprometidas.
- Todos los usuarios disponen de un mecanismo de recuperación de acceso que permite establecer una nueva contraseña. El proceso nunca permite recuperar ni visualizar la contraseña anterior. Cuando el usuario pertenece a un tenant, la recuperación solo afecta las credenciales del tenant previamente determinado y no expone información de otros tenants.
- Los códigos y enlaces de recuperación se envían al correo electrónico registrado, tienen una vigencia máxima de 30 minutos, son de un solo uso y quedan invalidados después de utilizarse, al expirar o al ser reemplazados por una nueva solicitud. Al completarse correctamente un restablecimiento, el sistema invalida las sesiones activas anteriores de la cuenta.
- Para las cuentas administrativas (Administrador del tenant y Administrador de plataforma), todo restablecimiento, exitoso o fallido, se registra en auditoría y se notifica al usuario por correo electrónico. La autenticación multifactor para cuentas administrativas se contempla como mejora posterior a Fase 1.
- Las credenciales temporales asignadas durante la creación administrativa de un usuario, incluida la del primer Administrador del tenant asignada por el Administrador de plataforma, siguen las reglas comunes de identidad y acceso de los usuarios internos.

### Regla operativa mínima de tenant para Fase 1

- El alta de un tenant en Fase 1 se realiza por proceso administrativo interno de la plataforma y no mediante autoservicio público.
- En Fase 1, dicho aprovisionamiento inicial se entiende como un proceso administrativo manual de plataforma, ejecutado fuera de las funciones operativas del tenant y antes de que exista el primer Administrador de ese tenant.
- Cada tenant debe crearse con los siguientes datos obligatorios para su operador y primer Administrador del tenant. La contraseña inicial y su confirmación deben coincidir.

| Campo | Obligatorio |
| --- | --- |
| Nombre comercial | Sí |
| Identificador único | Sí |
| Estado inicial | Sí |
| Zona horaria | Sí |
| Nombre del primer Administrador del tenant | Sí |
| Correo electrónico | Sí |
| Contraseña inicial | Sí |
| Confirmar contraseña | Sí |
- Cada tenant podrá configurar opcionalmente una identidad visual básica, incluyendo nombre comercial visible, logotipo, color principal, color secundario e imágenes comerciales, siempre dentro de los parámetros permitidos por el sistema de diseño de la plataforma.
- Cuando un tenant no tenga configuración visual particular, debe utilizarse la identidad visual predeterminada de la plataforma.
- La personalización visual básica no puede alterar layout, componentes, navegación, tipografía base, colores semánticos ni reglas de accesibilidad definidas por la plataforma.
- Los estados operativos mínimos del tenant en Fase 1 son: Activo e Inactivo.
- Cada tenant tiene configurada una zona horaria oficial, definida al crear el tenant y modificable por el Administrador del tenant con efecto prospectivo, sin reinterpretar operaciones históricas. Todas las fechas y horas de la operación del negocio (salidas, cajas, validaciones, vencimientos, reportes e históricos) se interpretan en esa zona horaria y no en la del servidor, el navegador o el dispositivo del usuario. Los plazos expresados en horas corridas representan duraciones reales desde el evento que los inicia; los conceptos basados en día calendario, como la caja diaria y la fecha de los reportes, usan el calendario local del tenant. Para Travesía Natural, la zona horaria es America/Bogota (decisión del equipo G14 — 2026-09-23).
- Al crear un tenant debe asignarse al menos un primer usuario con rol Administrador del tenant, usando el nombre, correo y credenciales iniciales definidos durante el alta. Esa contraseña inicial es temporal conforme a las reglas comunes de identidad y acceso de los usuarios internos. Posteriormente, los Administradores del tenant gestionan los demás usuarios internos (E9).
- Un tenant inactivo no permite nuevas reservas, pagos, ventas ni demás operaciones comerciales, pero debe conservar trazabilidad e información histórica.
- El tenant activo de una operación debe quedar determinado antes de ejecutar autenticación, consulta o registro sensible, por ejemplo por selección explícita del tenant, canal dedicado, enlace del tenant o configuración operativa del acceso habilitado.
- Solo el Administrador de plataforma puede crear, activar, inactivar o reactivar tenants.
- La inactivación de un tenant requiere motivo registrado y no debe eliminar información histórica ni auditoría asociada.
- Al inactivar un tenant, deben revocarse de forma inmediata los accesos y contextos de autorización correspondientes a la operación normal de dicho tenant para Clientes finales, Colaboradores operativos, Gerentes, Contadores, Analistas y Administradores del tenant. Los usuarios cuya identidad se relacione con otros tenants conservan el acceso a los tenants en los que mantengan autorización vigente (GAP-06; decisiones del equipo A6 y E26 — 2026-09-23).
- Durante la inactivación, el Administrador del tenant conserva únicamente un acceso restringido destinado a gestionar las obligaciones pendientes derivadas de la inactivación: reservas afectadas, reprogramaciones, devoluciones y autorizaciones excepcionales de soporte. Con ese acceso puede registrar exclusivamente el cierre o la interrupción de las salidas que ya estaban En ejecución al momento de la inactivación, sin iniciar nuevas salidas, reservas ni ventas (L5), y registrar las devoluciones y los movimientos financieros estrictamente necesarios derivados de dichas obligaciones, y estas acciones quedan auditadas. Este acceso no habilita la operación comercial normal del tenant (E6, E26, G4).
- Durante la inactivación de un tenant se suspenden todos los plazos operativos cuya ejecución depende de acciones del cliente o de usuarios del tenant: plazo de pago inicial, ampliaciones vigentes, plazo del saldo o de una diferencia pendiente, revisión de comprobantes, decisión sobre el tratamiento de valores abonados y plazo de respuesta a una propuesta de reprogramación cuando el cliente no disponga de un mecanismo habilitado para registrar su decisión (I2). Las cancelaciones automáticas de reservas asociadas a estos vencimientos también quedan suspendidas y no se reciben pagos. Al reactivarse el tenant, cada plazo continúa con el tiempo restante que tenía al momento de la inactivación. La suspensión no aplica a los temporizadores de seguridad, como credenciales temporales, recuperación de contraseña o accesos excepcionales (A6, G4).
- Cuando la inactivación afecte reservas confirmadas o con pagos recibidos, el Administrador del tenant es responsable de contactar a los clientes afectados para gestionar la continuidad de la obligación adquirida. El cliente puede aceptar la reprogramación del servicio o solicitar la devolución correspondiente (E6).
- Si la fecha y hora programadas de una salida se alcanzan mientras el tenant está inactivo, Multitour cancela automáticamente la salida por una causa no atribuible al cliente y sus reservas se gestionan conforme a RN-EJE-002. La reactivación del tenant no reactiva una salida cuya hora programada ya haya transcurrido (I1).
- El Administrador de plataforma no es bloqueado por la inactivación de un tenant, porque su ámbito corresponde a Multitour. La inactivación no le otorga acceso automático a los datos internos del tenant, que siguen sujetos a la regla de acceso excepcional (E26).
- La reactivación de un tenant debe dejar trazabilidad del responsable, fecha, hora y motivo. Los usuarios inactivados individualmente permanecen inactivos después de la reactivación del tenant.
- Ninguna operación de soporte sobre un tenant inactivo puede reactivar implícitamente su operación; la reactivación debe ser una acción explícita.

### Regla base de identidad del cliente entre tenants

- En Fase 1, una misma persona puede relacionarse con más de un tenant.
- Esa relación debe tratarse como pertenencias separadas por tenant, aunque reutilice el mismo correo electrónico.
- El historial, las reservas, los permisos y la información operativa del cliente deben permanecer aislados por tenant.
- Antes de autenticar o recuperar acceso, el canal debe dejar determinado el tenant sobre el cual operará el cliente final, ya sea por enlace dedicado, selección explícita del tenant o configuración operativa equivalente.
- Si el mismo correo electrónico existe en más de un tenant, el sistema no debe mezclar historiales ni reservas y debe autenticar o recuperar acceso únicamente dentro del tenant previamente determinado.
- La recuperación de contraseña del cliente final debe ejecutarse sobre el tenant previamente determinado y solo debe afectar las credenciales o pertenencia utilizadas en ese tenant.
- A partir de esta versión, la recuperación de contraseña del Cliente final debe realizarse mediante un flujo que utiliza correo electrónico y código de recuperación asociados al tenant previamente determinado; el correo electrónico es obligatorio como parte de la identidad de acceso del Cliente final dentro de ese tenant.
- La forma técnica de resolver si la autenticación usa cuenta global con pertenencias por tenant o cuentas separadas por tenant queda sujeta a arquitectura, siempre que preserve el comportamiento funcional anterior, el aislamiento por tenant y la no exposición de información de otros tenants.
- Toda cuenta de Cliente final debe verificar su correo electrónico antes de quedar activada; la verificación es parte obligatoria de la activación de cualquier cuenta de cliente (L9).
- Cuando un Colaborador operativo o el Administrador del tenant registren manualmente un cliente, Multitour debe comprobar primero si en el mismo tenant ya existe una cuenta o un registro de cliente con el mismo correo normalizado y verificado; si existe, debe vincularse con esa identidad en lugar de crear un cliente duplicado (L9).
- Cuando un cliente registrado previamente por un usuario del tenant cree después una cuenta con el mismo correo electrónico, Multitour vincula la cuenta con el cliente existente al verificarse el correo. En todos los casos, la vinculación conserva las reservas, pagos, saldos e histórico previamente asociados y no genera un segundo registro de cliente (E24, L9).
- Una misma identidad puede desempeñar más de un rol dentro de un tenant, incluidos Cliente final y Colaborador operativo. La coexistencia de roles no mezcla permisos: las acciones disponibles dependen del rol y del contexto desde el cual opere el usuario (E24).

### Roles opcionales por tenant

- Gerente: rol opcional por tenant. Cada tenant puede decidir si lo utiliza dentro de su operación y, si lo requiere, debe poder contar con su propio usuario y credenciales dentro del tenant correspondiente. Cuando un tenant lo habilite en Fase 1, su alcance base será de consulta, supervisión y seguimiento del negocio dentro de ese tenant.
- Contador: rol opcional por tenant. Cada tenant puede decidir si lo utiliza dentro de su operación y, si lo requiere, debe poder contar con su propio usuario y credenciales dentro del tenant correspondiente. Cuando un tenant lo habilite en Fase 1, su alcance base será de consulta, control y seguimiento económico del negocio dentro de ese tenant.
- Analista: rol opcional por tenant. Cada tenant puede decidir si lo utiliza dentro de su operación y, si lo requiere, debe poder contar con su propio usuario y credenciales dentro del tenant correspondiente. Cuando un tenant lo habilite en Fase 1, su alcance base será de consulta, análisis y seguimiento de la información del negocio dentro de ese tenant.
- La decisión de si un tenant usa o no estos roles opcionales, y el propósito con el que los utiliza dentro de su operación, depende de cada tenant. Este PDR no los define como perfiles base obligatorios para todos los tenants, pero sí establece permisos base funcionales cuando un tenant decide habilitarlos en Fase 1.
- Regla de implementación para Fase 1: los permisos base aquí definidos para Gerente, Contador y Analista solo deben implementarse o habilitarse en aquellos tenants que realmente requieran dichos roles. Si un tenant no los necesita, su ausencia no se considera incumplimiento funcional de Fase 1.
- Los roles Gerente, Contador y Analista no tienen acceso a información médica, tipo de sangre, restricciones físicas ni contactos de emergencia de los clientes, aunque puedan consultar clientes (E22).

#### Permisos base del rol Gerente cuando el tenant lo habilite

- Consultar reservas, estados y próximas ejecuciones.
- Consultar dashboard diario y reporte administrativo mensual.
- Consultar ingresos, gastos, pagos operacionales, devoluciones y consolidado de caja.
- Consultar descuentos aplicados y su trazabilidad.
- Consultar métricas operativas y comerciales del tenant.
- Consultar auditoría de eventos relevantes del tenant, únicamente cuando el Administrador del tenant haya habilitado ese acceso conforme a la necesidad operativa y con trazabilidad de dicha autorización.
- Consultar clientes, servicios, transporte, establecimientos asociados y catálogos operativos.
- Exportar o visualizar reportes de seguimiento del negocio.
- Restricción base: el rol Gerente no registra reservas, pagos, gastos ni movimientos de caja, no configura descuentos, no valida comprobantes de transferencia, no autoriza devoluciones y no administra tenants.

#### Permisos base del rol Contador cuando el tenant lo habilite

- Consultar ingresos, gastos, pagos operacionales, devoluciones y consolidado de caja.
- Consultar dashboard o reportes económicos del tenant.
- Consultar movimientos de caja y cierres históricos.
- Consultar reservas con impacto económico.
- Consultar pagos, abonos, saldo pendiente y devoluciones asociadas a reservas.
- Consultar costos operacionales registrados.
- Consultar descuentos aplicados que afecten el valor final.
- Exportar o visualizar reportes financieros y administrativos.
- Consultar auditoría de eventos económicos relevantes del tenant, únicamente cuando el Administrador del tenant haya habilitado ese acceso conforme a la necesidad operativa y con trazabilidad de dicha autorización.
- Restricción base: el rol Contador no registra reservas, pagos, gastos ni movimientos de caja, no valida comprobantes de transferencia, no configura descuentos, no autoriza devoluciones y no administra tenants.

#### Permisos base del rol Analista cuando el tenant lo habilite

- Consultar reservas, estados y próximas ejecuciones.
- Consultar dashboard diario y reportes del tenant.
- Consultar métricas operativas y comerciales del tenant.
- Consultar clientes, servicios, transporte, establecimientos asociados y catálogos operativos.
- Consultar costos operacionales registrados.
- Consultar pagos, abonos, saldo pendiente y devoluciones asociadas a reservas.
- Consultar descuentos aplicados y su trazabilidad.
- Consultar auditoría de eventos relevantes del tenant, únicamente cuando el Administrador del tenant haya habilitado ese acceso conforme a la necesidad operativa y con trazabilidad de dicha autorización.
- Exportar o visualizar reportes e indicadores del negocio.
- Consultar históricos o tendencias disponibles del tenant.
- Restricción base: el rol Analista no registra reservas, pagos, gastos ni movimientos de caja, no valida comprobantes de transferencia, no configura descuentos, no autoriza devoluciones y no administra tenants.

## 10. Necesidades del cliente

Con base en las fuentes funcionales del proyecto, el cliente necesita:

- Centralizar información actualmente dispersa.
- Registrar reservas con información de clientes y servicios.
- Permitir que el cliente final consulte tours y su disponibilidad, junto con la información y los datos de contacto de hoteles y restaurantes asociados, desde un canal digital adaptable para web y móvil.
- Permitir que el cliente final cree su cuenta, inicie sesión, recupere su contraseña y genere su propia reserva desde donde se encuentre.
- Diferenciar entre lo reservado y lo realmente prestado.
- Registrar costos operacionales internos.
- Consolidar el flujo de caja interno.
- Reflejar descuentos vigentes sobre tours u otros servicios al momento de reservar.
- Aplicar automáticamente descuentos confirmados al momento de cobrar o pagar, incluyendo descuentos comerciales y descuentos adicionales autorizados por fidelización u otro motivo justificado.
- Gestionar estados de pago, tiempos límite de respuesta del cliente y cancelación automática de reservas no pagadas.
- Consultar información operativa y resultados del negocio.
- Disponer de reportes y dashboard para seguimiento diario y administrativo.
- Asegurar que cada empresa usuaria de la plataforma vea y gestione únicamente su propia información, sin mezcla de datos ni configuraciones con otros tenants.

## 11. Alcance

### Dentro del alcance

- Soporte multitenencia con aislamiento lógico por tenant para usuarios, clientes, reservas, catálogos operativos, descuentos, costos, caja y reportes.
- Personalización visual básica por tenant, limitada a nombre comercial, logotipo, color principal, color secundario e imágenes comerciales dentro de los parámetros permitidos por el sistema de diseño de la plataforma.
- Gestión de clientes para reservas.
- Gestión de información base de atractivos y transporte necesaria para reservas y control operacional, e información promocional y de contacto de hoteles y restaurantes asociados.
- Gestión de información obligatoria y documental requerida para clientes y acompañantes según el tipo de actividad.
- Canal digital adaptable para web y móvil orientado a consulta de tours, información de establecimientos asociados y autogestión de reservas del cliente final.
- Registro de reservas como proyección comercial.
- Visualización de descuentos vigentes sobre tours u otros servicios en los canales de reserva habilitados para el cliente final.
- Aplicación automática de descuentos vigentes y descuentos adicionales autorizados al momento de cobrar o pagar.
- Flujo de pago con tipo de pago total o abono y medio de pago transferencia o efectivo, habilitables por tenant o servicio, con plazos de pago y seguimiento operativo sobre reservas pendientes de pago y saldos pendientes.
- Hoteles y restaurantes como establecimientos asociados de carácter informativo y de contacto, sin reserva, cupos ni inventario dentro de la plataforma (GAP-04).
- Transporte prestado directamente por el operador del tenant como parte del tour.
- Programación de salidas de tours con su capacidad y los vehículos asignados (RN-SAL-001).
- Notificaciones transaccionales por correo electrónico al cliente final y correos de recuperación de contraseña (RF-019).
- Control de ejecución de servicios prestados y no prestados.
- Registro de costos operacionales.
- Gestión operativa diaria de caja con consolidación mensual.
- Consultas operativas, reporte de reservas, dashboard diario y reporte administrativo de caja mensual.
- Seguridad básica de acceso para usuarios internos y restricción de operaciones sensibles.

### Fuera del alcance

- Administración avanzada de roles, módulos y permisos detallados más allá de los perfiles base confirmados para Fase 1.
- Integraciones con pasarelas de pago, bancos o sistemas contables externos no descritos expresamente en este PDR.
- Pago con tarjeta débito o crédito mediante pasarela o integración bancaria automatizada.
- Implementación de facturación electrónica o integración tributaria externa.
- Reserva de habitaciones de hotel o de mesas de restaurante, y gestión de tarifas, cupos o inventario de hospedaje y alimentación (GAP-04).
- Estrategias avanzadas de personalización visual por tenant, como white-label completo, dominios independientes por cliente o motores de tematización avanzados, más allá de la identidad visual básica permitida para Fase 1.

### Pendiente de confirmación

- Reglas comerciales particulares que futuros tenants adicionales puedan requerir por fuera de la base funcional definida para Fase 1.
- Integraciones externas con pasarelas, bancos o sistemas contables que excedan el registro manual y la validación operativa definida para Fase 1.

### Línea base adoptada para Fase 1

- Para efectos de arquitectura detallada y construcción del backlog, este PDR adopta como línea base vigente de Fase 1 los criterios no funcionales definidos en la sección 17.
- Cualquier ajuste posterior a esa línea base debe tratarse como cambio controlado del PDR y no como regla implícita abierta a interpretación.

## 11.1 Macrodominios y contextos de negocio

El alcance funcional de Multitour se organiza en los siguientes cuatro macrodominios. Cada contexto pertenece a un solo macrodominio; se conservan sus responsabilidades y las reglas funcionales definidas en este PDR.

| N.º | Macrodominio | Contextos de negocio que pertenecen a cada uno | Total |
| --- | --- | --- | --- |
| 1 | Plataforma, acceso y trazabilidad | 1. Gestión de tenants<br>2. Identidad y acceso<br>3. Auditoría y trazabilidad | 3 |
| 2 | Gestión comercial y reservas | 4. Clientes<br>5. Catálogo operativo<br>6. Descuentos y reglas comerciales<br>7. Reservas | 4 |
| 3 | Operación y costos | 8. Ejecución operativa<br>9. Costos operacionales | 2 |
| 4 | Caja y reportes administrativos | 10. Caja y consolidación<br>11. Reportes y dashboard | 2 |
| | **4 macrodominios** | **Abarcan los 11 contextos, sin duplicaciones.** | **11** |

Este agrupamiento corresponde al registrado en `02-domain/domain-map.md` y en `05-architecture/decisions/records/ADR-004-backend-microservices-macrodomain-split.md` del repositorio documental del proyecto. Los nombres en inglés de esos documentos representan los mismos contextos, no contextos adicionales.

La tabla expresa organización funcional, no evidencia de que los cuatro servicios estén implementados o desplegados. La topología, la migración gradual y la asignación de tecnologías y bases de datos se documentan en arquitectura y ADR, respetando las restricciones de las secciones 18 y 19. Los cuatro macrodominios backend no sustituyen ni determinan por sí mismos los cuatro Micro Frontends exigidos en la sección 18.

## 12. Procesos de negocio

Observación transversal de multitenencia:
Todos los procesos de negocio descritos a continuación deben ejecutarse dentro del contexto de un tenant identificado. Ningún proceso puede mezclar datos, configuraciones, usuarios, reservas, movimientos de caja o reportes entre tenants distintos.

Regla operativa transversal:
Para Fase 1, todo comando o consulta autenticada debe poder resolverse contra un tenant activo previamente determinado. Ninguna autenticación exitosa debe habilitar acceso simultáneo a información de múltiples tenants dentro de una misma sesión operativa sin cambio explícito de contexto.

### 12.1 Gestión de reservas

Proceso orientado a registrar la proyección comercial de una reserva, incluyendo cliente titular, acompañantes, servicios solicitados, valor proyectado y valor final.

- Objetivo: dejar registrada la intención comercial inicial del cliente.
- Inicio: cuando se requiere crear una nueva reserva.
- Actor principal: Colaborador operativo / Administrador del tenant.
- Información involucrada: cliente titular, acompañantes, atractivos, transporte incluido en el tour, descuentos, documentos obligatorios y valores resultantes.
- Comportamiento esperado: registrar la información mínima obligatoria, asociar la reserva a una única salida (RN-RES-010), calcular personas y valores, verificar que la salida tenga capacidad efectiva disponible y persistir la reserva; si la salida está llena, la reserva no se crea y se informa al cliente. Esta verificación no aparta cupo: el cupo se aparta con el primer pago conforme a RN-RES-007.
- Reglas asociadas: RN-CLI-001, RN-CLI-002, RN-RES-001, RN-RES-002, RN-RES-003, RN-RES-004, RN-RES-005, RN-RES-007.
- Resultado esperado: reserva creada como base de seguimiento operativo.
- Casos alternativos relevantes: documentos duplicados, cupo insuficiente en el tour, descuentos inválidos, falta de información obligatoria para actividades de riesgo.

Estado: CONFIRMADO

### 12.1.1 Autogestión de reservas desde canal digital adaptable para web y móvil

Proceso orientado a permitir que el cliente final consulte la oferta disponible, gestione su acceso y genere su reserva desde un canal digital adaptable para web y móvil, sin depender exclusivamente del registro interno.

- Objetivo: facilitar la autogestión comercial por parte del cliente final desde cualquier ubicación.
- Inicio: cuando el cliente final ingresa al canal digital habilitado para consultar o reservar servicios desde web o móvil.
- Actor principal: Cliente final usuario de canal digital adaptable para web y móvil.
- Información involucrada: tours, transporte incluido en el tour, información y contacto de hoteles y restaurantes asociados, descuentos vigentes, datos del cliente, acompañantes, condiciones parametrizadas y valores calculados.
- Comportamiento esperado: permitir crear cuenta, iniciar sesión, recuperar contraseña, consultar la oferta disponible, visualizar descuentos vigentes, seleccionar servicios, registrar datos requeridos, gestionar el pago según los tipos y medios de pago habilitados y generar la reserva con valores actualizados.
- Alcance funcional cerrado de autogestión en Fase 1: crear cuenta, iniciar sesión, recuperar contraseña, consultar oferta, crear reserva, consultar estado de la reserva, continuar el proceso de pago según los tipos y medios de pago habilitados y consultar o descargar los comprobantes asociados a su propia reserva dentro del tenant activo.
- Restricción explícita de Fase 1: modificar, cancelar o reagendar reservas desde autogestión del cliente final queda fuera del alcance actual, salvo actualización formal posterior de este PDR.
- Campos obligatorios de autogestión de identidad en Fase 1: crear cuenta exige nombre, apellido, correo electrónico, número de teléfono, contraseña y confirmar contraseña, siendo obligatorio que contraseña y confirmar contraseña coincidan antes de completar el registro; recuperar contraseña exige correo electrónico, código de recuperación, nueva contraseña y confirmar nueva contraseña, siendo obligatorio que nueva contraseña y confirmar nueva contraseña coincidan antes de completar la recuperación. Confirmar contraseña y confirmar nueva contraseña son campos de validación del flujo correspondiente y no necesariamente datos persistidos de forma independiente. Toda cuenta de Cliente final debe verificar su correo electrónico antes de quedar activada (L9).
- El código de recuperación se envía al correo electrónico registrado, tiene una vigencia máxima de 30 minutos y es de un solo uso conforme a la política centralizada de contraseñas de la sección 9; su generación, longitud, formato, cantidad de intentos y persistencia quedan sujetos a arquitectura, seguridad y contratos.
- Reglas asociadas: RN-CLI-001, RN-CLI-002, RN-RES-001, RN-RES-002, RN-RES-003, RN-RES-004, RN-RES-007.
- Resultado esperado: reserva creada desde canal digital del cliente final con trazabilidad equivalente a la gestión interna.
- Casos alternativos relevantes: descuento vigente aplicado a un tour, descuento adicional autorizado al momento de pago, cupo insuficiente en el tour, datos incompletos del cliente o acompañantes.

Estado: CONFIRMADO

Observación funcional base de Fase 1:
Para efectos de disponibilidad comercial en canales de consulta y reserva, un tour o servicio se considera disponible cuando se encuentra habilitado para venta por el negocio, dentro de su vigencia de oferta y sin restricciones operativas que lo excluyan de manera expresa para la fecha consultada.

Observación adicional de cupos y concurrencia:
Como base funcional de Fase 1, el cupo se controla por salida (RN-SAL-001) y se aparta con el primer pago conforme a RN-RES-007; la capacidad efectiva de la salida considera el transporte obligatorio o incluido (RN-TRA-001), y hoteles y restaurantes asociados no manejan cupo en la plataforma (GAP-04). Cuando exista el último cupo disponible, lo obtiene la reserva cuyo apartamiento quede registrado primero; para efectos funcionales, esto significa que el sistema ya persistió el apartamiento del cupo al aceptar el primer comprobante o registrar el primer pago en efectivo. Toda solicitud posterior que llegue cuando ese cupo ya fue apartado debe recibir respuesta de cupo no disponible. La resolución técnica de simultaneidad, bloqueo o serialización queda sujeta a arquitectura, siempre que preserve este resultado funcional sin sobreventa dentro del mismo tenant.

### 12.2 Ejecución de servicios

Proceso orientado a registrar qué servicios de la reserva realmente se prestaron y cuáles no, dejando visible la diferencia frente a la proyección inicial.

- Objetivo: controlar la operación real y diferenciarla de la reserva original.
- Inicio: cuando la actividad está próxima a iniciar y el guía realiza el control operativo previo a la salida.
- Observación del actor guía: para Fase 1, el guía se entiende como actor operativo externo al sistema o fuente operativa de información previa a la salida, salvo que arquitectura o UX definan posteriormente una interfaz propia para ese rol.
- Actor principal: Colaborador operativo / Administrador del tenant.
- Información involucrada: reserva existente, servicios reservados, servicios prestados, servicios no prestados, causales de cancelación o no prestación, pagos registrados y control operativo previo a la salida.
- Comportamiento esperado: el Administrador del tenant o un Colaborador operativo con el permiso Gestionar ejecución de salidas registran en Multitour el inicio real y la finalización de cada salida (RN-EJE-001); se registran los servicios prestados y no prestados, se mantiene visible la diferencia frente a la proyección inicial y se refleja la tolerancia operativa aplicable antes de la salida. Una vez registrado el inicio de la salida no se permiten ajustes ordinarios en ejecución.
- Reglas asociadas: RN-EJE-001, RN-EJE-002, RN-EJE-003, RN-EJE-004, RN-EJE-005.
- Resultado esperado: trazabilidad clara entre lo reservado y lo efectivamente ejecutado.
- Casos alternativos relevantes: llegada tardía de una persona, no presentación sin aviso oportuno, servicios no prestados sin causal, cancelación extraordinaria del tour por emergencia con reagendamiento o devolución.

Estado: CONFIRMADO

### 12.3 Control de costos operacionales

Proceso orientado a registrar y controlar costos internos asociados a la prestación de servicios.

- Objetivo: conocer el costo real de operar los servicios prestados.
- Inicio: cuando existen servicios efectivamente prestados que requieren control de costo.
- Actor principal: Administrador del tenant / Colaborador operativo.
- Información involucrada: atractivos prestados, cantidades reales, costos operacionales catalogados y costos asociados a la ejecución.
- Comportamiento esperado: registrar o calcular costos operacionales diferenciados del valor comercial.
- Reglas asociadas: RN-ATR-001, RN-OPE-001.
- Resultado esperado: base confiable para análisis operativo, rentabilidad y caja.
- Casos alternativos relevantes: parametrización incompleta de costos o necesidad de validación adicional sobre algunos costos.

Estado: CONFIRMADO

### 12.4 Consolidación de caja

Proceso orientado a gestionar la caja diaria, sus aperturas y cierres, y consolidar la información económica del mes para control interno del negocio.

- Objetivo: dar visibilidad al estado diario de caja y a su consolidación administrativa mensual.
- Inicio: cuando inicia una jornada operativa o cuando existen movimientos económicos registrados para el periodo correspondiente.
- Actor principal: Colaborador operativo / Administrador del tenant.
- Información involucrada: base diaria parametrizable por día, ingresos, pagos operacionales, gastos, devoluciones, cierres e histórico de movimientos.
- Comportamiento esperado: abrir la jornada con una base parametrizable según el día, registrar movimientos del día, permitir cierre cuando corresponda, conservar histórico y consolidar la información mensual bajo la lógica funcional definida. Para Fase 1, la base representa exclusivamente el efectivo físico disponible al inicio del día y no debe sumarse repetidamente como ingreso nuevo en la consolidación mensual. La caja consolida los movimientos de la jornada independientemente del medio de pago y discrimina entradas y salidas por medio de pago; el efectivo se concilia de forma independiente y las transferencias se registran y concilian por separado. La apertura, el cierre y la reapertura los realizan el Administrador del tenant o un Colaborador operativo con el permiso Gestionar caja (decisiones del equipo M1, E13 y G13 — 2026-09-23).
- Reglas asociadas: RN-CAJ-001.
- Resultado esperado: estado de caja visible para seguimiento administrativo.
- Casos alternativos relevantes: ajuste de parámetros de base por parte del Administrador del tenant y consolidación mensual a partir de información diaria.

Estado: CONFIRMADO

## 13. Requerimientos funcionales

### RF-001 - Registrar cliente titular

- Descripción: El sistema debe permitir registrar un cliente titular con la información requerida para asociarlo a una reserva.
- Actor: Colaborador operativo / Administrador del tenant
- Precondiciones: Ninguna
- Comportamiento esperado: Debe capturar los datos obligatorios definidos para el cliente titular y validar la información adicional exigida cuando la actividad sea de riesgo. Si el cliente titular no tiene cuenta y luego crea una con el mismo correo electrónico, se vincula conforme a la regla base de identidad del cliente entre tenants (E24).
- Resultado esperado: Cliente titular disponible para uso en una reserva.
- Reglas relacionadas: RN-CLI-001
- Excepciones conocidas: Ninguna conocida. La parametrización de descuentos no afecta la obligatoriedad documental del cliente titular.
- Estado: CONFIRMADO

### RF-002 - Registrar acompañantes

- Descripción: El sistema debe permitir asociar cero o varios acompañantes a una reserva.
- Actor: Colaborador operativo / Administrador del tenant
- Precondiciones: Reserva creada o proceso de reserva en curso.
- Comportamiento esperado: Cada acompañante debe registrarse con datos individualizados y con la información obligatoria que corresponda según el tipo de actividad. Como mínimo, en Fase 1 debe registrarse nombre completo, documento de identidad, fecha de nacimiento o edad y un dato básico de contacto o referencia cuando el negocio lo requiera. Si la actividad es de riesgo, también aplican los requisitos adicionales definidos para ese tipo de actividad.
- Resultado esperado: Reserva con cantidad de personas calculable.
- Reglas relacionadas: RN-CLI-002, RN-RES-005
- Excepciones conocidas: Ninguna conocida.
- Estado: CONFIRMADO

### RF-003 - Crear reserva como proyección comercial

- Descripción: El sistema debe permitir registrar una reserva que represente lo que el cliente desea adquirir.
- Actor: Colaborador operativo / Administrador del tenant
- Precondiciones: Datos base disponibles
- Comportamiento esperado: Debe asociar la reserva a una única salida (RN-RES-010), verificar que la salida tenga capacidad efectiva disponible (RN-RES-007) e incluir los servicios seleccionados, condiciones parametrizadas de modificación o cancelación y valores calculados desde datos parametrizados.
- Resultado esperado: Reserva registrada como base de seguimiento.
- Reglas relacionadas: RN-RES-001, RN-RES-002, RN-RES-003, RN-RES-004, RN-RES-007, RN-RES-010
- Excepciones conocidas: Las restricciones de modificación o cancelación dependen de los términos y condiciones parametrizados para la actividad o servicio correspondiente.
- Estado: CONFIRMADO

### RF-003A - Modificar reserva antes de la ejecución

- Descripción: El sistema debe permitir modificar una reserva antes de que entre en ejecución, siempre que las condiciones parametrizadas del servicio o actividad lo permitan.
- Actor: Colaborador operativo / Administrador del tenant
- Precondiciones: Reserva existente, aún no iniciada y dentro de las condiciones permitidas de modificación.
- Comportamiento esperado: Debe permitir cambiar servicios, cantidades, acompañantes, transporte u otros elementos autorizados por el negocio. Toda modificación debe recalcular valores, revalidar capacidad, reevaluar descuentos vigentes según la política comercial aplicable y determinar si existe saldo adicional por cobrar, saldo a favor o devolución. Los pagos ya registrados no se pierden y deben seguir formando parte del saldo resultante. Si el recálculo produce una devolución potencial, el sistema debe distinguir entre el cálculo del saldo a devolver y la autorización o ejecución efectiva de la devolución monetaria. Si una modificación válida incrementa el valor de una reserva confirmada, esta conserva su estado y se recalcula el saldo pendiente; si lo reduce y genera excedente sobre los pagos validados, el excedente se trata conforme a RN-RES-004 (E18, L7). Si la modificación agrega viajeros a una reserva que ya tiene cupo apartado o asignado, el sistema debe validar la disponibilidad y asignar en ese momento los cupos adicionales; si no hay capacidad suficiente, la modificación no se realiza. Un cambio de fecha se rige por RN-EJE-006 (E25).
- Resultado esperado: Reserva actualizada con trazabilidad clara del cambio y del nuevo estado económico resultante.
- Reglas relacionadas: RN-RES-004, RN-RES-006, RN-TRA-002
- Excepciones conocidas: Si la reserva ya se encuentra en ejecución, solo aplican cancelaciones extraordinarias por emergencia según las reglas del negocio.
- Estado: CONFIRMADO

### RF-004 - Gestionar información base operativa para reservas

- Descripción: El sistema debe permitir disponer de información base de atractivos y transporte necesaria para registrar reservas y soportar el control operacional.
- Actor: Administrador del tenant / Colaborador operativo
- Precondiciones: Ninguna
- Comportamiento esperado: Debe permitir como mínimo consultar, registrar y actualizar la información parametrizada necesaria para usar esos servicios dentro de la reserva y del control operativo. En Fase 1, el Administrador del tenant puede crear, actualizar, inactivar y reactivar los elementos del catálogo operativo. La inactivación impide que el elemento sea ofrecido en nuevas reservas sin eliminar su información ni trazabilidad histórica. Un elemento inactivo puede ser reactivado posteriormente por el Administrador del tenant cuando vuelva a estar disponible para venta. El Administrador del tenant puede gestionar catálogos, tarifas base, costos base y parámetros de capacidad; el Colaborador operativo puede consultar catálogos y, cuando el negocio lo habilite, registrar o actualizar información descriptiva operativa que no altere descuentos, tarifas base, costos base ni parámetros estructurales de caja.
- Resultado esperado: Base operativa centralizada y utilizable por los procesos del negocio.
- Reglas relacionadas: RN-ATR-001, RN-ALI-001, RN-TRA-001, RN-TRA-002
- Excepciones conocidas: La eliminación física de información base no queda definida en este PDR y no debe asumirse como parte obligatoria de Fase 1.
- Estado: CONFIRMADO

### RF-005 - Calcular valor proyectado y valor final

- Descripción: El sistema debe calcular el valor proyectado de la reserva y permitir persistir el valor final cuando existan descuentos aplicables.
- Actor: Colaborador operativo / Administrador del tenant
- Precondiciones: Servicios seleccionados
- Comportamiento esperado: El cálculo debe salir de información parametrizada, descuentos configurados por el Administrador del tenant y reglas de transporte por persona según el tour correspondiente. Cuando existan descuentos de diferente tipo, el sistema debe dejar visible si cada descuento se calcula sobre el valor original o sobre el subtotal resultante del descuento anterior, de acuerdo con la parametrización vigente.
- Resultado esperado: Valores visibles y persistidos para seguimiento.
- Reglas relacionadas: RN-RES-001, RN-RES-002, RN-RES-003, RN-TRA-002
- Excepciones conocidas: La forma exacta de combinar múltiples descuentos depende de la parametrización definida por el Administrador del tenant.
- Estado: CONFIRMADO

### RF-005A - Visualizar descuentos vigentes en la reserva

- Descripción: El sistema debe permitir que el cliente final visualice descuentos vigentes aplicables a tours u otros servicios al momento de consultar y crear una reserva desde el canal digital adaptable para web y móvil.
- Actor: Cliente final usuario de canal digital adaptable para web y móvil
- Precondiciones: Servicios disponibles y descuentos parametrizados
- Comportamiento esperado: Debe reflejar en la cotización y en el valor proyectado cualquier descuento vigente aplicable al servicio consultado.
- Resultado esperado: Cliente informado del valor actualizado antes de confirmar la reserva.
- Reglas relacionadas: RN-RES-002, RN-RES-003
- Excepciones conocidas: La aplicación de descuentos simultáneos depende de la parametrización vigente definida por el Administrador del tenant.
- Estado: CONFIRMADO

### RF-005B - Aplicar descuentos automáticos al cobro o pago

- Descripción: El sistema debe aplicar automáticamente los descuentos que correspondan al momento de cobrar o pagar una reserva.
- Actor: Cliente final usuario de canal digital adaptable para web y móvil / Colaborador operativo / Administrador del tenant
- Precondiciones: Reserva existente y descuentos parametrizados o autorizados
- Comportamiento esperado: Debe aplicar primero los descuentos vigentes del servicio según la configuración activa para la fecha, y cuando corresponda permitir registrar y reflejar un descuento adicional autorizado por fidelización o por otro motivo definido por el negocio. El sistema debe dejar visible qué descuentos fueron aplicados, en qué orden y sobre qué valor se calcularon.
- Resultado esperado: Valor final de cobro calculado de forma consistente y trazable.
- Reglas relacionadas: RN-RES-002, RN-RES-003
- Excepciones conocidas: El orden de aplicación, la acumulación, los topes y los motivos habilitados deben obedecer a la parametrización configurada por el Administrador del tenant.
- Estado: CONFIRMADO

### RF-006 - Validar cupo disponible de la salida

- Descripción: El sistema debe validar el cupo disponible de la salida del tour frente a la cantidad de personas de la reserva, considerando la capacidad efectiva del transporte cuando este sea obligatorio o esté incluido en el tour.
- Actor: Colaborador operativo / Administrador del tenant / Cliente final usuario de canal digital adaptable para web y móvil
- Precondiciones: Salida seleccionada
- Comportamiento esperado: Debe verificar la capacidad efectiva de la salida antes de crear la reserva y no debe permitir crearla, ni apartar o asignar cupo, cuando esa capacidad sea insuficiente, conforme a RN-RES-007 y RN-SAL-001.
- Resultado esperado: Prevención de una reserva inconsistente o de sobreventa.
- Reglas relacionadas: RN-RES-007, RN-SAL-001, RN-TRA-001
- Excepciones conocidas: Ninguna conocida
- Estado: CONFIRMADO

Observación (versión 1.9, decisión del equipo C1 - 2026-09-23):
Hasta la versión 1.8 este requisito validaba la capacidad de hospedaje. Conforme a GAP-04, hoteles y restaurantes son establecimientos asociados de carácter informativo y la plataforma no gestiona su capacidad, por lo que el requisito se reorienta al cupo del tour.

### RF-007 - Registrar ejecución real de servicios

- Descripción: El sistema debe permitir registrar qué servicios realmente se prestaron y cuáles no.
- Actor: Colaborador operativo / Administrador del tenant
- Precondiciones: Reserva existente, control operativo de salida realizado por el guía y tour listo para salir hacia su destino
- Comportamiento esperado: Debe permitir seguimiento de prestados, no prestados, sus causales y la aplicación de la tolerancia operativa previa a la salida. La ejecución inicia cuando el Administrador del tenant o un Colaborador operativo con el permiso Gestionar ejecución de salidas registran el inicio real de la salida y finaliza cuando registran su finalización (RN-EJE-001).
- Resultado esperado: Diferenciación clara entre proyección y ejecución real.
- Reglas relacionadas: RN-EJE-001, RN-EJE-003, RN-EJE-005
- Excepciones conocidas: Si una persona no se presenta y no hubo aviso oportuno, puede aplicarse la tolerancia operativa definida antes de marcar la no participación.
- Estado: CONFIRMADO

### RF-008 - Restringir ajustes en ejecución

- Descripción: El sistema no debe permitir ajustes ordinarios posteriores a la reserva una vez el servicio se encuentre en ejecución.
- Actor: Colaborador operativo / Administrador del tenant
- Precondiciones: Reserva en estado En ejecución
- Comportamiento esperado: Debe bloquear cambios ordinarios sobre tour, transporte y cantidad de personas una vez el tour haya salido hacia su destino. Solo debe permitirse registrar una cancelación extraordinaria por emergencia con su respectiva justificación y la decisión posterior de reagendamiento o devolución.
- Resultado esperado: Integridad operativa y trazabilidad de eventos excepcionales ocurridos durante la ejecución.
- Reglas relacionadas: RN-EJE-002, RN-EJE-004
- Excepciones conocidas: Solo aplican cancelaciones extraordinarias por emergencia debidamente justificadas.
- Estado: CONFIRMADO

### RF-009 - Registrar costos operacionales

- Descripción: El sistema debe permitir registrar o calcular costos operacionales internos asociados a la ejecución.
- Actor: Administrador del tenant / Colaborador operativo
- Precondiciones: Ejecución iniciada
- Comportamiento esperado: Debe diferenciar costo operacional de valor comercial y permitir registrar gastos operacionales reales cuando el Administrador del tenant o el Colaborador operativo efectúen pagos asociados a la operación.
- Resultado esperado: Base para análisis operativo y caja.
- Reglas relacionadas: RN-ATR-001, RN-OPE-001
- Excepciones conocidas: Ninguna conocida.
- Estado: CONFIRMADO

### RF-010 - Consolidar flujo de caja interno

- Descripción: El sistema debe gestionar la caja diaria, incluyendo base, ingresos, pagos, gastos, cierre e histórico, y consolidar esa información para control mensual.
- Actor: Colaborador operativo / Administrador del tenant
- Precondiciones: Movimientos registrados
- Comportamiento esperado: Debe gestionar una única caja por día calendario del tenant y reflejar la lógica BASE + INGRESOS - PAGOS - GASTOS - DEVOLUCIONES = TOTAL para cada jornada, con consolidación mensual. En el cierre debe discriminar entradas y salidas por medio de pago y calcular el efectivo esperado como la base inicial más las entradas en efectivo menos las salidas en efectivo; las transferencias se registran y concilian por separado, se reconocen económicamente en la fecha y hora en que son validadas y no incrementan el efectivo físico esperado. Una transferencia validada después del cierre en el mismo día calendario se registra como movimiento no efectivo posterior al cierre, sin reabrir la caja; si se valida otro día, pertenece a la caja de ese día. La caja puede reabrirse con motivo obligatorio y trazabilidad (E13, G13).
- Resultado esperado: Visibilidad del estado de caja.
- Reglas relacionadas: RN-CAJ-001
- Excepciones conocidas: La base diaria debe ser parametrizable por el Administrador del tenant según el día de operación.
- Estado: CONFIRMADO

### RF-011 - Consultar reservas y ejecución

- Descripción: El sistema debe permitir consultar la información necesaria para seguimiento de reservas, acompañantes, servicios reservados, servicios prestados, servicios no prestados, causales registradas y métricas operativas del día.
- Actor: Administrador del tenant / Colaborador operativo
- Precondiciones: Información registrada
- Comportamiento esperado: Debe facilitar el seguimiento de la diferencia entre lo reservado y lo ejecutado e incluir como mínimo el reporte de reservas, reservas pendientes de pago, próximas reservas, cancelaciones, acompañantes registrados, servicios reservados, servicios prestados, servicios no prestados y sus causales. Para Fase 1, el dashboard diario queda definido de forma cerrada con las siguientes métricas obligatorias: reservas creadas del día, reservas pendientes de pago, reservas confirmadas con saldo, reservas confirmadas, reservas canceladas y salidas próximas a ejecutar. El indicador Pendientes de pago incluye únicamente reservas que aún no han cumplido la condición económica de confirmación; el indicador Confirmadas con saldo incluye reservas confirmadas con situación financiera Abono recibido o Saldo pendiente (E23, H12).
- Resultado esperado: Soporte al control operativo y al seguimiento de novedades.
- Reglas relacionadas: RN-EJE-005, RN-CAJ-001
- Excepciones conocidas: Ninguna conocida para los campos de reporte ya confirmados.
- Estado: CONFIRMADO

### RF-012 - Consultar costos operacionales y caja

- Descripción: El sistema debe permitir consultar la información registrada de costos operacionales, ingresos, pagos, gastos y consolidación mensual de caja para control interno.
- Actor: Administrador del tenant / Colaborador operativo
- Precondiciones: Información registrada
- Comportamiento esperado: Debe facilitar la consulta de la información económica y operativa consolidada necesaria para control interno, incluyendo como mínimo ventas por día, caja, gastos, devoluciones, cancelaciones con su causal y consolidación mensual bajo la lógica funcional definida. Para Fase 1, ventas por día debe entenderse como reservas cuyo valor comercial quedó confirmado en esa fecha; ingresos del periodo como dinero efectivamente recibido en caja o validado como ingreso del periodo; devoluciones del periodo como devoluciones cuya salida efectiva de dinero quedó registrada en ese periodo; cancelaciones del periodo como reservas cuya cancelación quedó registrada en ese periodo; y costos del periodo como costos operacionales registrados para servicios efectivamente ejecutados en ese periodo. Para Fase 1, el reporte administrativo mensual queda definido de forma cerrada con los siguientes campos obligatorios: periodo reportado, ingresos del periodo, pagos operacionales del periodo, gastos del periodo, devoluciones efectivamente realizadas en el periodo, total consolidado de caja del periodo, cancelaciones registradas en el periodo y costos operacionales registrados en el periodo.
- Resultado esperado: Soporte al seguimiento administrativo de costos y caja.
- Reglas relacionadas: RN-OPE-001, RN-CAJ-001
- Excepciones conocidas: Ninguna conocida para los campos administrativos ya confirmados.
- Estado: CONFIRMADO

### RF-013 - Consultar tours y establecimientos asociados desde canal digital adaptable para web y móvil

- Descripción: El sistema debe permitir que el cliente final consulte desde el canal digital adaptable para web y móvil la oferta de tours disponibles para reserva y la información de hoteles y restaurantes asociados.
- Actor: Cliente final usuario de canal digital adaptable para web y móvil
- Precondiciones: Información base disponible
- Comportamiento esperado: Debe mostrar información útil para la toma de decisión comercial, incluyendo tours disponibles con su transporte, información y datos de contacto de hoteles y restaurantes asociados para que el cliente coordine directamente con ellos, descuentos vigentes cuando existan y la demás información comercial que el Administrador del tenant haya parametrizado para visibilidad del cliente final.
- Resultado esperado: Cliente con información suficiente para iniciar una reserva desde cualquier ubicación y dispositivo compatible.
- Reglas relacionadas: RN-ATR-001, RN-ASO-001, RN-RES-002
- Excepciones conocidas: El nivel exacto de detalle visible para el cliente final podrá ajustarse durante diseño UX/UI sin alterar el alcance funcional.
- Estado: CONFIRMADO

### RF-014 - Crear reserva desde canal digital adaptable para web y móvil

- Descripción: El sistema debe permitir que el cliente final cree una reserva directamente desde el canal digital adaptable para web y móvil.
- Actor: Cliente final usuario de canal digital adaptable para web y móvil
- Precondiciones: Oferta disponible y datos requeridos diligenciados
- Comportamiento esperado: Debe permitir seleccionar la salida y los servicios incluidos, verificar que la salida tenga capacidad efectiva disponible (RN-RES-007), registrar datos del cliente y acompañantes, validar información obligatoria, elegir el tipo de pago y el medio de pago disponibles y persistir la reserva con sus valores correspondientes. La consulta de oferta puede realizarse sin autenticación previa, pero la confirmación y la gestión posterior de la reserva deben requerir que el cliente final se autentique o complete su registro dentro de un tenant previamente determinado. En Fase 1, gestionar su reserva incluye únicamente crear cuenta, iniciar sesión, recuperar contraseña, entrar a su panel principal, consultar tours y la información de hoteles y restaurantes asociados, revisar la información de la reserva, consultar su estado, continuar el proceso de pago según los tipos y medios de pago habilitados y descargar o consultar los comprobantes registrados sobre ella. Las capacidades de modificar, cancelar o reagendar desde autogestión quedan fuera de Fase 1 salvo aprobación documental posterior del negocio.
- Resultado esperado: Reserva creada desde el canal digital del cliente final como parte del flujo comercial del negocio.
- Reglas relacionadas: RN-CLI-001, RN-CLI-002, RN-RES-001, RN-RES-003, RN-RES-004, RN-RES-005, RN-RES-007
- Excepciones conocidas: El cliente final debe crear su cuenta con nombre, apellido, correo electrónico, número de teléfono, contraseña y confirmación de contraseña, coincidiendo contraseña y su confirmación antes de crear la cuenta, y debe autenticarse con correo y contraseña para confirmar o gestionar su reserva. El cliente final debe poder recuperar su contraseña cuando la pierda mediante un flujo que exige correo electrónico, código de recuperación, nueva contraseña y confirmación de nueva contraseña, coincidiendo ambos valores de contraseña antes de completar el cambio, sin perjuicio de los datos adicionales requeridos por cada tour.
- Estado: CONFIRMADO

### RF-015 - Gestionar reservas pendientes de pago y saldos pendientes

- Descripción: El sistema debe permitir gestionar el seguimiento, la confirmación y la cancelación automática de reservas pendientes de pago y de reservas confirmadas con saldo pendiente.
- Actor: Colaborador operativo / Administrador del tenant
- Precondiciones: Reserva en estado Pendiente de pago, o Confirmada con saldo pendiente.
- Comportamiento esperado: Debe registrar el tipo de pago (total o abono) y el medio de pago esperado; controlar el plazo inicial de pago desde la fecha y hora de creación de la reserva; permitir que el Colaborador operativo o el Administrador del tenant concedan antes del vencimiento una única ampliación de duración configurable, registrada con su duración, fecha, hora y responsable; registrar el contacto del colaborador con el cliente; y cancelar automáticamente la reserva al vencer el plazo total de pago conforme a RN-RES-006, sin que ningún plazo supere la hora programada de inicio de la salida (G1, H1). Debe permitir manejar pagos parciales, mantener el saldo pendiente y controlar el plazo del saldo o de la diferencia pendiente de las reservas confirmadas conforme a RN-RES-004.
- Resultado esperado: Trazabilidad clara de reservas pendientes y de saldos pendientes, y liberación oportuna del cupo de reservas que incumplen el pago.
- Reglas relacionadas: RN-RES-004, RN-RES-006, RN-RES-006C, RN-RES-007
- Excepciones conocidas: Una respuesta del cliente sin pago no suspende ni cumple el plazo (E15).
- Estado: CONFIRMADO

### RF-015A - Registrar y validar pagos de reserva

- Descripción: El sistema debe permitir registrar pagos, comprobantes de transferencia, validaciones, rechazos, devoluciones y aplicaciones de saldo a favor asociados a una reserva.
- Actor: Cliente final usuario de canal digital adaptable para web y móvil / Colaborador operativo / Administrador del tenant
- Precondiciones: Reserva existente con tipo y medio de pago habilitados.
- Comportamiento esperado: Debe registrar cada pago con su medio, valor y estado de validación, y mantener la situación financiera de la reserva calculada a partir de los valores validados (RN-RES-006A). En transferencia, cada comprobante tiene su propio estado (En validación, Aprobado o Rechazado); en efectivo, el pago se registra al recibir el dinero. El rechazo de un comprobante no elimina ni modifica otros pagos validados. Ambos tipos de pago admiten uno o varios pagos (G8), y el saldo a favor puede aplicarse como pago validado (RN-RES-009). Al aprobar un comprobante se reconoce el monto verificado por el validador y cualquier excedente sobre el valor pendiente se registra como saldo a favor (RN-RES-006A). Desde la hora programada de inicio de la salida no se admiten pagos ni comprobantes asociados a ella (RN-EJE-001). El primer pago de una reserva sin cupo se sujeta a la validación de disponibilidad de RN-RES-007. Si existe devolución, debe quedar valor, motivo y relación con la reserva y con el movimiento correspondiente de caja cuando implique salida efectiva de dinero.
- Alcance por actor en Fase 1:
  - Cliente final: puede registrar su pago por transferencia adjuntando el comprobante, según el tipo y medio de pago habilitados.
  - Colaborador operativo: puede consultar pagos, registrar la recepción de dinero en efectivo, cargar comprobantes en nombre del cliente con trazabilidad del usuario que realiza la carga, y validar o rechazar comprobantes cuando disponga del permiso Validar comprobantes (G5).
  - Administrador del tenant: puede consultar, registrar la recepción de dinero en efectivo, cargar comprobantes en nombre del cliente con trazabilidad, validar o rechazar pagos y comprobantes, decidir el tratamiento de valores abonados y autorizar o registrar devoluciones monetarias según las reglas de este PDR (G5).
- Resultado esperado: Situación financiera de la reserva visible, trazable y consistente con pagos, comprobantes y devoluciones registrados.
- Reglas relacionadas: RN-RES-004, RN-RES-006, RN-RES-006A, RN-RES-006C, RN-RES-007, RN-RES-009, RN-CAJ-001
- Excepciones conocidas: La integración automática con pasarelas de pago o bancos permanece fuera del alcance de Fase 1.
- Estado: CONFIRMADO

Observación (GAP-02; ajustado por decisión del equipo M6 — 2026-09-23):
Para pagos por transferencia, el cliente final debe adjuntar el comprobante de pago en formato PDF, JPG, JPEG o PNG, con un tamaño máximo de 5 MB por archivo. El sistema debe validar el tipo y el tamaño del archivo antes de almacenarlo y mostrar un mensaje claro cuando el archivo no cumpla estas condiciones. El comprobante es la evidencia aceptada; no constituye ingreso de caja hasta que un usuario con el permiso Validar comprobantes lo valide.

### RF-015B - Gestionar devoluciones y saldo a favor

- Descripción: El sistema debe permitir calcular, autorizar, registrar y ejecutar devoluciones monetarias derivadas de cancelaciones, modificaciones o solicitudes de devolución de saldo a favor, y registrar saldos a favor.
- Actor: Administrador del tenant / Colaborador operativo
- Precondiciones: Reserva existente o saldo a favor disponible, con causal registrada.
- Comportamiento esperado: Debe distinguir entre valor potencial a devolver, valores en tratamiento pendiente, saldo a favor, devolución autorizada y devolución ejecutada. La autorización de devolución solo puede realizarla el Administrador del tenant. El Colaborador operativo solo puede registrar la ejecución material de la salida de dinero cuando exista autorización previa y trazable. Toda devolución debe registrar causal, responsable, monto, fecha, método de salida, relación con la reserva y relación con el movimiento de caja correspondiente, y no se considera completada hasta que el movimiento haya sido efectivamente procesado. Cuando una reserva se cancele por incumplimiento del pago con valores validados, se aplica el tratamiento pendiente de RN-RES-006C (E16, G7). Cuando la cancelación se deba a una causa no atribuible al cliente, la devolución es del 100 % de los valores pagados y validados (RN-EJE-002, G12). El saldo a favor se gestiona conforme a RN-RES-009 (E17).
- Resultado esperado: Devoluciones y saldos a favor trazables y consistentes con la situación financiera de la reserva y con la caja.
- Reglas relacionadas: RN-RES-004, RN-RES-006C, RN-RES-008, RN-RES-009, RN-CAJ-001
- Excepciones conocidas: Si no existe salida efectiva de dinero, el resultado debe quedar registrado como saldo a favor y no como devolución ejecutada.
- Estado: CONFIRMADO

### RF-015C - Reagendar reserva o servicio afectado

- Descripción: El sistema debe permitir registrar el reagendamiento derivado de una cancelación extraordinaria, de una reprogramación por emergencia o de una modificación autorizada que no finaliza en devolución monetaria inmediata.
- Actor: Administrador del tenant / Colaborador operativo
- Precondiciones: Reserva existente, causal registrada y decisión explícita de reagendamiento conforme a las reglas del negocio.
- Comportamiento esperado: El reagendamiento debe conservar la relación con la reserva original, registrar la fecha u opción acordada, recalcular disponibilidad, valores y saldo resultante cuando corresponda, y dejar trazabilidad de quién aprobó la novedad. Un cambio exclusivo de fecha se resuelve siempre sobre la misma reserva conforme a RN-EJE-006: no puede realizarse mientras exista un comprobante En validación, requiere disponibilidad en la nueva salida y traslada el cupo en una única operación (E25). Un cambio de servicio principal o de condición comercial que requiera control independiente genera una nueva reserva vinculada, con trazabilidad bidireccional, estado económico claro y sin duplicar ingresos ni cupos. Las restricciones temporales de la política de cambios aplican solo a solicitudes del cliente; la reprogramación por emergencia, contingencia externa o imposibilidad operativa no está sujeta a ellas y requiere la aceptación del cliente cuando implique una nueva fecha de ejecución (C2, E7). En una reprogramación por cancelación o interrupción de la salida, el cliente dispone de hasta 72 horas corridas desde la notificación de la propuesta para responder, conforme a RN-EJE-002 (I2).
- Resultado esperado: Reserva o servicio reagendado con trazabilidad completa respecto al evento original.
- Reglas relacionadas: RN-EJE-002, RN-EJE-006, RN-RES-004, RN-RES-007, RN-RES-008
- Excepciones conocidas: Si no existe disponibilidad en la nueva salida, el cambio no se realiza y la reserva conserva su fecha y cupo actuales. Si la reprogramación se debe a una causa no atribuible al cliente y el cliente no la acepta, la reserva se cancela y se devuelve el 100 % de los valores pagados y validados (G12).
- Estado: CONFIRMADO

### RF-016 - Gestionar tenants de la plataforma

- Descripción: El sistema debe permitir al Administrador de plataforma crear, activar, inactivar y reactivar tenants, y registrar el primer Administrador de cada tenant.
- Actor: Administrador de plataforma
- Precondiciones: Ninguna para el alta. Tenant existente para los cambios de estado.
- Comportamiento esperado: El alta debe exigir nombre comercial, identificador único, estado inicial, zona horaria oficial, nombre del primer Administrador del tenant, correo electrónico, contraseña inicial y confirmación de contraseña, que deben coincidir; esa contraseña inicial es una credencial temporal conforme a la sección 9. La inactivación debe registrar motivo, conservar información histórica y auditoría, impedir nuevas reservas, pagos, ventas y demás operaciones comerciales, revocar de inmediato los accesos de operación normal de todos los usuarios del tenant, conservar para el Administrador del tenant solo un acceso restringido para gestionar obligaciones pendientes y registrar las devoluciones y movimientos financieros necesarios con auditoría, y suspender todos los plazos operativos del tenant y sus cancelaciones automáticas, sin suspender los temporizadores de seguridad. Las reservas confirmadas o con pagos recibidos afectadas se gestionan conforme a la sección 9 (E6). La inactivación no bloquea al Administrador de plataforma ni le otorga acceso a los datos del tenant. Al reactivarse, cada plazo continúa con el tiempo restante que tenía y los usuarios inactivados individualmente siguen inactivos. La reactivación debe ser una acción explícita que registre responsable, fecha, hora y motivo (G4, G14).
- Resultado esperado: Tenant disponible para operar, o suspendido, con trazabilidad completa de su ciclo de vida.
- Reglas relacionadas: Regla operativa mínima de tenant para Fase 1 (sección 9), estados y transiciones de Tenant (sección 16).
- Excepciones conocidas: Ninguna operación de soporte sobre un tenant inactivo puede reactivar implícitamente su operación.
- Estado: CONFIRMADO

### RF-017 - Gestionar usuarios internos del tenant

- Descripción: El sistema debe permitir a los Administradores del tenant registrar, inactivar y reactivar usuarios internos de su propio tenant: Administradores del tenant adicionales, Gerentes, Contadores, Analistas y Colaboradores operativos.
- Actor: Administrador del tenant
- Precondiciones: Tenant activo.
- Comportamiento esperado: El registro debe exigir nombre completo, correo electrónico como usuario de acceso, contraseña inicial y confirmación de contraseña, que deben coincidir y cumplir la política centralizada de contraseñas; la contraseña inicial es temporal, vence a las 72 horas y debe reemplazarse en el primer acceso. El sistema debe bloquear el registro cuando el correo ya exista dentro del mismo tenant, activo o inactivo, e indicar la reactivación cuando el usuario existente esté inactivo; además debe crear la identidad de acceso asociada al tenant activo y asignar el perfil correspondiente. La inactivación y la reactivación deben registrar responsable, fecha, hora y motivo; un usuario inactivo no puede autenticarse ni ejecutar operaciones. El sistema no debe permitir inactivar ni retirar privilegios al último Administrador del tenant activo. Todo usuario interno puede recuperar su contraseña conforme a la política centralizada.
- Resultado esperado: Usuarios internos del tenant gestionados con trazabilidad y sin acceso a otros tenants.
- Reglas relacionadas: Gestión de usuarios internos del tenant y política centralizada de contraseñas (sección 9).
- Excepciones conocidas: La administración avanzada de roles y permisos personalizados permanece fuera del alcance de Fase 1.
- Estado: CONFIRMADO

### RF-018 - Gestionar establecimientos asociados

- Descripción: El sistema debe permitir al Administrador del tenant registrar, publicar, inactivar y reactivar hoteles y restaurantes asociados a su operación con fines de promoción comercial.
- Actor: Administrador del tenant
- Precondiciones: Tenant activo.
- Comportamiento esperado: Cada establecimiento asociado debe registrar información comercial básica e imagen visible para los clientes del tenant, y solo debe ser visible dentro del tenant que mantiene la asociación. La inactivación deja de mostrar el establecimiento para nuevas consultas conservando su información e histórico; la reactivación restaura su visibilidad promocional. Ambas acciones deben quedar con trazabilidad. El Colaborador operativo no tiene acceso a estas operaciones.
- Resultado esperado: Establecimientos asociados visibles para el cliente final del tenant con trazabilidad de su ciclo de vida.
- Reglas relacionadas: RN-ASO-001
- Excepciones conocidas: La asociación no implica registrar habitaciones, platos, menús, cupos, tarifas de reserva ni disponibilidad operativa del establecimiento.
- Estado: CONFIRMADO

### RF-019 - Notificar al cliente final

- Descripción: El sistema debe mantener informado al cliente final sobre el estado de sus reservas, pagos y comprobantes.
- Actor: Sistema / Cliente final usuario de canal digital adaptable para web y móvil
- Precondiciones: Cliente final con correo electrónico registrado en el tenant.
- Comportamiento esperado: El panel del cliente final es la fuente principal de información y debe mostrar el estado actualizado de sus reservas, pagos y comprobantes. En Fase 1, Multitour envía además notificaciones transaccionales por correo electrónico cuando ocurre un evento relevante que afecta la reserva o requiere conocimiento o acción del cliente. Como mínimo se notifica: aprobación o rechazo de comprobantes, confirmación de reserva, cancelación por incumplimiento de pago, devolución procesada, registro de saldo a favor y cancelación o reprogramación de su salida por una causa no atribuible al cliente, incluida la propuesta de reprogramación que requiere su aceptación (H6). El correo electrónico también se utiliza para la recuperación de contraseña (decisión del equipo E10 — 2026-09-23).
- Resultado esperado: Cliente final informado de los eventos que afectan su reserva.
- Reglas relacionadas: RN-RES-004, RN-RES-006C, RN-RES-009
- Excepciones conocidas: La entrega de un correo, al cliente o a usuarios internos, no condiciona ni modifica el estado registrado en el sistema; los fallos de envío quedan registrados (C-05).
- Estado: CONFIRMADO

### RF-020 - Programar salidas y asignar vehículos

- Descripción: El sistema debe permitir al Administrador del tenant programar las salidas de cada tour y asignarles los vehículos requeridos.
- Actor: Administrador del tenant
- Precondiciones: Tenant activo y tour registrado en el catálogo operativo.
- Comportamiento esperado: Toda salida debe definir fecha, hora de inicio y hora de finalización estimada. Cuando el transporte sea obligatorio, la capacidad efectiva de la salida corresponde al menor valor entre la capacidad del tour y la capacidad total de los vehículos asignados. Un mismo vehículo puede asignarse a diferentes salidas siempre que sus intervalos programados no se superpongan. Al modificar la capacidad del tour o la asignación de transporte, el sistema debe impedir que la nueva capacidad efectiva sea inferior a los cupos ya apartados o asignados. La hora de finalización estimada es independiente de la hora real de finalización registrada durante la ejecución. El Administrador del tenant puede cancelar una salida Programada; sus reservas se gestionan conforme a RN-EJE-002 (decisiones del equipo G3, H3 y H8 — 2026-09-23).
- Resultado esperado: Salidas programadas con capacidad efectiva consistente y sin conflictos de asignación de vehículos.
- Reglas relacionadas: RN-SAL-001, RN-TRA-001, RN-RES-007
- Excepciones conocidas: Ninguna conocida.
- Estado: CONFIRMADO

### RF-021 - Cancelar reserva a solicitud del cliente

- Descripción: El sistema debe permitir registrar la cancelación de una reserva solicitada por el cliente.
- Actor: Colaborador operativo / Administrador del tenant
- Precondiciones: Reserva en estado Pendiente de pago o Confirmada.
- Comportamiento esperado: La cancelación la registran un Colaborador operativo o el Administrador del tenant, con la causal y la trazabilidad correspondientes. La reserva pasa a Cancelada, que es terminal y no puede reactivarse, y su cupo se libera. Si existen valores pagados y validados que correspondan al cliente según la condición comercial de cancelación del servicio (RN-RES-008), el Administrador del tenant dispone de 24 horas corridas para decidir entre la devolución del 100 % de esos valores o su registro del 100 % como saldo a favor dentro del tenant; si no registra una decisión dentro del plazo, Multitour determina automáticamente la devolución del 100 %, que queda pendiente de ejecución (decisión del equipo L8 — 2026-09-23).
- Resultado esperado: Reserva cancelada con tratamiento económico trazable.
- Reglas relacionadas: RN-RES-004, RN-RES-008, RN-RES-009
- Excepciones conocidas: El cliente final no puede cancelar desde la autogestión en Fase 1.
- Estado: CONFIRMADO

## 14. Reglas de negocio

### RN-CLI-001

- Regla: Antes de crear una reserva deben completarse los campos obligatorios del cliente titular: documento de identidad, datos de contacto, aceptación de términos y condiciones, fecha de nacimiento o edad y los demás datos exigidos por la actividad correspondiente. Si aplica condición especial, también deben completarse autorización para menores, información médica básica o de emergencia, seguro o asistencia y los requisitos adicionales definidos para actividades de riesgo. El comprobante de pago no es requisito para crear la reserva; se presenta en el flujo de pago conforme a RN-RES-006C y RN-RES-007.
- Estado: CONFIRMADO

### RN-CLI-002

- Regla: Los acompañantes deben registrarse con datos mínimos obligatorios. Como mínimo, en Fase 1 cada acompañante debe registrar nombre completo, documento de identidad, fecha de nacimiento o edad y la información adicional que corresponda según el tipo de actividad. Si la actividad es de riesgo, los requisitos adicionales de salud, emergencia o consentimiento aplican tanto al titular como a los acompañantes que participen en dicha actividad, según corresponda por edad o condición especial.
- Estado: CONFIRMADO

### RN-CLI-003

- Regla: Para actividades de riesgo son obligatorios, además de la información general, el consentimiento informado o exoneración de responsabilidad, el tipo de sangre, el contacto de emergencia y el registro de restricciones físicas o movilidad reducida.
- Estado: CONFIRMADO

### RN-RES-001

- Regla: El valor proyectado se calcula a partir de los servicios seleccionados y la cantidad total de personas.
- Estado: CONFIRMADO

### RN-RES-002

- Regla: La reserva puede incluir descuentos cuando aplique, tanto por promociones vigentes sobre tours u otros servicios como por descuentos adicionales autorizados al momento de cobro o pago, por ejemplo por fidelización u otro motivo definido por el negocio. Los descuentos deben ser parametrizables y administrables por el rol Administrador del tenant, quien define su configuración, vigencia, aplicación, prioridad, acumulación, topes y condiciones de uso según la necesidad del negocio. Como regla base de Fase 1, primero se evalúa la existencia de descuentos vigentes del servicio; si existe más de uno aplicable, el sistema debe resolverlos por prioridad configurada. El descuento adicional autorizado solo puede aplicarse después del descuento vigente, debe registrar motivo y responsable de autorización y debe quedar trazabilidad del valor final calculado. Cuando la configuración combine descuentos porcentuales y de valor fijo, el sistema debe respetar la base de cálculo parametrizada para cada descuento, dejando visible si se aplica sobre el valor original o sobre el subtotal posterior al descuento anterior.
- Estado: CONFIRMADO

### RN-RES-003

- Regla: Deben persistirse valor proyectado y valor final.
- Estado: CONFIRMADO

### RN-RES-004

- Regla: La posibilidad de modificar o cancelar una reserva depende de los términos y condiciones configurados para la actividad o servicio correspondiente. No existe una única regla temporal general para todas las actividades. Los tiempos límite dependen del tour y del tipo de cambio solicitado, y deben ser parametrizables. Cuando una reserva se modifica antes de ejecución, deben recalcularse valores, descuentos, transporte y disponibilidad con base en la política comercial vigente definida por el negocio. Como regla base de Fase 1, la modificación debe conservar trazabilidad del valor original, del valor recalculado y del saldo resultante por cobrar, compensar o devolver.
- Estado: CONFIRMADO

Observación:
Existen ejemplos confirmados de configuración, como cambio de tour hasta 6 horas antes. Estos ejemplos no constituyen una regla universal para todas las actividades y deben mantenerse como parámetros configurables.

Observación adicional (versión 1.9, decisión del equipo C1 - 2026-09-23):
Las condiciones de reserva, cambio o cancelación de hoteles y restaurantes asociados se acuerdan directamente entre el cliente y el establecimiento y no se gestionan en la plataforma (GAP-04).

Observación funcional base de Fase 1 — condiciones económicas de la reserva (decisiones del equipo C5, D4, D9, E1, E4 y E18 — 2026-09-23):
- Multitour distingue entre tipo de pago y medio de pago. El tipo de pago determina la condición económica de la reserva y puede ser pago total o abono. El medio de pago determina cómo se recibe el dinero y puede ser transferencia o efectivo. Los plazos para cumplir las obligaciones económicas se asocian al tipo de pago; el medio de pago determina el mecanismo de registro y validación del pago.
- Pago total: puede completarse mediante uno o varios pagos; la reserva pasa a Confirmada cuando la suma de los valores validados alcanza el 100 % del valor exigible de la reserva dentro del plazo aplicable (G8).
- Abono: la reserva pasa a Confirmada cuando se valida como mínimo el abono mínimo parametrizado para la actividad o servicio, calculado sobre el valor final de la reserva después de aplicar los descuentos. El saldo restante queda pendiente de pago y se refleja en la situación financiera de la reserva, separada de su estado.
- Un comprobante presentado y aún no validado no confirma la reserva; solo un pago validado cuenta para la condición de confirmación.
- Una vez Confirmada, la reserva no necesita volver a confirmarse cuando el cliente completa el saldo; únicamente cambia su situación financiera.
- Cuando una reserva se confirme mediante abono y exista saldo pendiente, el tenant debe establecer un plazo máximo para completarlo, definido en días u horas anteriores a la hora programada de inicio de la salida e incluyendo como opción el mismo día antes de esa hora. El saldo debe estar completamente pagado y validado antes de la hora programada de inicio, que ningún plazo del saldo puede superar (G1, H1).
- Si al vencer el plazo del saldo este no ha sido completado ni existe un comprobante presentado oportunamente en estado En validación, la reserva se cancela automáticamente y el cupo se libera. Si el comprobante fue presentado dentro del plazo, la reserva permanece vigente mientras se valida; si luego es rechazado y el plazo ya venció, la reserva se cancela. Los valores previamente abonados se tratan conforme al tratamiento pendiente de RN-RES-006C (E1).
- Si una modificación válida incrementa el valor de una reserva ya confirmada, la reserva conserva su estado Confirmada, se recalcula el saldo pendiente con base en el nuevo valor final y se genera una diferencia pendiente por pagar. En abono, el cliente debe completarla dentro del plazo del saldo o, si ese plazo ya venció cuando se genera la diferencia, antes de la hora programada de inicio de la salida, sin que la diferencia se considere vencida de inmediato (L6); en pago total, la diferencia debe quedar completamente pagada antes de la hora programada de inicio de la salida. El incremento no exige volver a cumplir el porcentaje mínimo de abono como condición para conservar la confirmación. Si una modificación reduce el valor y genera un excedente sobre los pagos validados, el Administrador del tenant tiene 24 horas corridas para decidir entre la devolución del 100 % del excedente o su registro del 100 % como saldo a favor dentro del tenant; si no decide, Multitour determina automáticamente la devolución del 100 %, que queda pendiente de ejecución (E18, G8, L7).
- Una promesa o compromiso de pagar en efectivo posteriormente no constituye un pago validado y no confirma una reserva. El efectivo es un medio de pago válido cuando el dinero ha sido efectivamente recibido y registrado por un Colaborador operativo o un Administrador del tenant. La modalidad de pago completo en el sitio no forma parte de Fase 1; si se requiere posteriormente, debe definirse como una política comercial independiente con sus propias reglas de confirmación y manejo de cupo (D9).

Ejemplo (GAP-03; decisiones del equipo C5 y E3 — 2026-09-23):
Tour de $300.000 con abono mínimo de $100.000. Al validarse $100.000 la reserva queda Confirmada, su situación financiera queda en Abono recibido y el saldo pendiente es $200.000. Al validarse el saldo dentro de su plazo, la reserva sigue Confirmada y su situación financiera pasa a Pago completo con saldo pendiente $0.

Observación de tipos y medios de pago de Fase 1:
Cada tenant puede habilitar uno o ambos tipos de pago (pago total y abono) y uno o ambos medios de pago (transferencia y efectivo) según su configuración vigente y, cuando aplique, según el servicio ofrecido. La asistencia comercial puede utilizarse como canal de apoyo para continuar el proceso de reserva y pago, pero no constituye por sí misma un medio de pago. Los medios con tarjeta débito o crédito mediante pasarela quedan fuera del alcance actual y se consideran una evolución futura.

Observación financiera base:
Como regla mínima de Fase 1, toda cancelación o modificación que produzca devolución debe determinar si la devolución es total, parcial o inexistente según la condición comercial parametrizada para el servicio afectado. El valor definido debe quedar trazable y asociado a la reserva. Cuando la cancelación se deba a una causa no atribuible al cliente, aplica RN-EJE-002: devolución del 100 % o reprogramación, sin penalidades, retenciones ni devoluciones parciales (G12).

### RN-RES-005

- Regla: Si hay acompañantes, cada uno debe registrarse con datos mínimos obligatorios y sin duplicidad de documento dentro de la misma reserva.
- Estado: CONFIRMADO

### RN-RES-006

- Regla: Toda reserva que aún no haya cumplido la condición económica de confirmación queda en estado Pendiente de pago, independientemente del canal en que haya sido creada. El plazo inicial de pago comienza a contar desde la fecha y hora de creación de la reserva y tiene una duración configurable por el tenant según el tipo de pago. Antes de su vencimiento, el Colaborador operativo o el Administrador del tenant pueden conceder una única ampliación de duración configurable, que debe quedar registrada con su duración, fecha, hora y responsable. El plazo total de pago corresponde al plazo inicial más la ampliación efectivamente concedida. Ningún plazo de pago inicial, ampliación o pago de saldo puede extenderse más allá de la hora programada de inicio de la salida, que es su límite absoluto: el vencimiento efectivo es el menor valor entre el plazo configurado y esa hora programada. Un retraso en el inicio real de la salida no extiende los plazos económicos (G1, H1). Los plazos económicos se congelan mientras la reserva tenga la marca Pendiente de respuesta de reprogramación (RN-EJE-002, L2). Durante el plazo, el Colaborador operativo puede contactar al cliente para dar seguimiento; una respuesta del cliente sin pago no suspende ni cumple el plazo. Para efectos del vencimiento se considera el pago efectivamente recibido o, en transferencia, la presentación oportuna de un comprobante que permanezca En validación. Si vence el plazo total sin pago validado que cumpla la condición de confirmación y sin comprobante En validación, la reserva se cancela automáticamente y se libera el cupo que tuviera apartado (decisiones del equipo C3, E15, G1 y G5 — 2026-09-23).
- Estado: CONFIRMADO

Observación:
La reserva en estado Pendiente de pago no exige comprobante de pago previo para existir y no garantiza cupo hasta su primer pago (RN-RES-007).

Observación de concurrencia y vencimiento:
Cuando dos intentos compitan por el último cupo de una misma salida, prevalece el primero cuyo apartamiento quede registrado conforme a RN-RES-007. Si el cliente registra un pago o presenta un comprobante exactamente al vencimiento del plazo, prevalece la evidencia registrada por el sistema dentro del plazo; si se registra después del vencimiento, prevalece la cancelación automática, sin excepción manual (E5).

### RN-RES-006A

- Regla: En Fase 1, el estado de validación de los comprobantes y la situación financiera de la reserva son conceptos independientes entre sí y respecto del estado general de la reserva (decisión del equipo E3 — 2026-09-23).
  - Estado del comprobante: cada comprobante de transferencia tiene su propio estado de validación: En validación, Aprobado o Rechazado. En validación es el estado inicial al presentarse el comprobante. Revisión vencida es una marca, no un estado: se aplica al comprobante que permanece En validación más de 24 horas corridas (RN-RES-006C).
  - Situación financiera de la reserva: se determina a partir de los valores efectivamente validados e identifica si no existe pago (Sin pago); existe un pago parcial que no cumple la condición de confirmación (Parcial); la reserva de tipo abono está Confirmada con saldo pendiente (monto) mayor que cero (Abono recibido); la reserva de tipo pago total está Confirmada con una diferencia pendiente generada por una modificación posterior a su confirmación (Saldo pendiente, que la interfaz puede mostrar como "Confirmada con saldo pendiente"); o se ha completado el pago total con saldo pendiente (monto) igual a cero (Pago completo) (E3, H12).
  - La situación financiera muestra además el saldo pendiente (monto), los valores devueltos, el saldo a favor generado y los valores en tratamiento pendiente, que se registran como movimientos trazables y no como estados adicionales.
  - El rechazo de un comprobante no elimina ni modifica otros pagos previamente validados.
  - Al aprobar un comprobante, el usuario con el permiso Validar comprobantes determina el monto efectivamente acreditado según la evidencia disponible. El monto reconocido es el valor verificado y no necesariamente el declarado por el cliente; una diferencia entre ambos no obliga por sí sola al rechazo cuando el monto real puede verificarse de manera confiable. Si el monto validado supera el valor pendiente de la reserva, solo se aplica el valor necesario para completar su obligación económica y el excedente se registra como saldo a favor del cliente dentro del mismo tenant, sin aplicarse automáticamente a otras reservas (decisión del equipo G6 — 2026-09-23).
  - Todo cambio de estado de un comprobante y todo pago validado deben dejar trazabilidad de actor, fecha, hora, motivo cuando aplique y relación con la reserva.
- Estado: CONFIRMADO

### RN-RES-006B

- Regla: Las transiciones mínimas del estado del comprobante y la determinación de la situación financiera de la reserva son las definidas en la sección 16.
- Estado: CONFIRMADO

### RN-RES-006C

- Regla: Cuando el cliente presenta un comprobante de pago dentro del plazo establecido, el comprobante queda En validación y la reserva no puede ser cancelada automáticamente por vencimiento mientras el comprobante permanezca en ese estado, salvo al alcanzarse la hora programada de inicio de la salida conforme a RN-EJE-001 (C3, G1, H1). Los comprobantes deben revisarse dentro de un plazo máximo de 24 horas corridas contado desde su presentación; la validación puede realizarla cualquier usuario activo del tenant que disponga del permiso Validar comprobantes. Si un comprobante supera las 24 horas sin decisión, continúa En validación, se marca como revisión vencida y el sistema muestra una alerta a todos los usuarios activos autorizados para validar comprobantes. El vencimiento de ese plazo no cancela la reserva, no rechaza automáticamente el comprobante ni libera el cupo asociado (D6, E14). Si el comprobante es rechazado, el sistema verifica nuevamente el plazo de pago original: si continúa vigente, el cliente puede presentar un nuevo comprobante dentro del tiempo restante; si ya venció, la reserva se cancela automáticamente y se libera el cupo. El rechazo no genera un plazo adicional de subsanación y ningún usuario puede reactivar manualmente una reserva cancelada por esta causa (E5). Esta regla aplica tanto al plazo de pago de la confirmación como al plazo del saldo (E1).
- Estado: CONFIRMADO

Tratamiento pendiente de valores abonados (GAP-05; decisiones del equipo D1 y E16 — 2026-09-23):
Cuando una reserva sea cancelada por incumplimiento del pago —por vencimiento del plazo de confirmación, del plazo del saldo o de una diferencia pendiente, o al alcanzarse la hora programada de inicio de la salida con pagos pendientes— y existan valores previamente abonados y validados, estos quedan en condición de tratamiento pendiente. Lo mismo aplica al valor de un comprobante aprobado después de la cancelación. El Administrador del tenant dispone de 24 horas corridas, contadas desde que el dinero queda efectivamente reconocido —al cancelarse la reserva si ya existían valores validados, o al aprobarse un comprobante después de la cancelación—, para decidir entre devolver al cliente el 100 % del valor abonado y validado o registrarlo en su totalidad como saldo a favor dentro del tenant, y la decisión debe quedar registrada. Si transcurre ese plazo sin decisión, Multitour determina automáticamente la devolución del 100 % como tratamiento predeterminado; esta determinación no implica que el dinero haya sido devuelto: la devolución queda pendiente de ejecución y todos los Administradores del tenant activos son notificados mediante alerta en su panel y correo electrónico para completarla y registrar el movimiento correspondiente. Una devolución no se considera completada hasta que el movimiento haya sido efectivamente procesado. El plazo se suspende mientras el tenant esté inactivo y continúa con el tiempo restante después de su reactivación. No existen retenciones, penalidades ni otras condiciones comerciales no definidas (decisiones del equipo D1, E16, G5, G7, H4 y H5 — 2026-09-23).

### RN-RES-006D

- Regla: Si un comprobante es Rechazado, el cliente puede presentar un nuevo comprobante, o un Colaborador operativo o un Administrador del tenant puede cargarlo en su nombre, mientras la reserva siga Pendiente de pago, o Confirmada con saldo o diferencia pendiente, y no haya vencido el plazo correspondiente. Cuando un usuario interno carga un comprobante en nombre del cliente, debe conservarse la trazabilidad del usuario que realizó la carga (G5). El rechazo previo debe conservarse en el histórico y no puede sobrescribirse.
- Estado: CONFIRMADO

### RN-RES-007

- Regla: Toda salida con cupo limitado debe validar disponibilidad antes de apartar cupo para una reserva, y el cupo solo puede quedar asociado a una reserva del mismo tenant. La creación de una reserva no garantiza disponibilidad de cupo. La validación y el apartamiento de cupo se realizan únicamente cuando una reserva que aún no tiene cupo asociado realiza su primer pago: en transferencia, el sistema verifica la disponibilidad y aparta el cupo al recibir el primer comprobante, antes de aceptarlo; en efectivo, la disponibilidad se verifica al registrar la recepción del dinero. Si no existe disponibilidad, el sistema debe impedir la operación e informar al cliente. Mientras el primer comprobante permanezca En validación, el cupo continúa apartado; si es aprobado, el cupo permanece asociado a la reserva y queda asignado definitivamente cuando la reserva se confirma. Una vez asignado el cupo y confirmada la reserva, los pagos posteriores del saldo no vuelven a validar, asignar ni liberar cupo. Como única excepción al apartamiento con el primer pago, al proponer una reprogramación se apartan cupos en la salida propuesta conforme a RN-EJE-002 (K3). El cupo solo se libera por rechazo del primer pago antes de la confirmación o por cancelación posterior de la reserva, y se traslada a la nueva salida, liberando el de la anterior, en un cambio de fecha conforme a RN-EJE-006 (H10) (decisiones del equipo D5 y E2 — 2026-09-23). Antes de crear una reserva, el sistema debe verificar que la salida disponga de capacidad efectiva, considerando los cupos ya apartados o asignados y, cuando el transporte sea obligatorio, la capacidad de los vehículos asignados; si la salida está llena, la reserva no se crea y se informa al cliente. Esta verificación no aparta ni asigna cupo (G9). Cuando el saldo a favor constituya la primera aplicación económica sobre una reserva sin cupo, el sistema debe verificar la disponibilidad antes de consumirlo: si existe capacidad, la aplicación del saldo y el apartamiento del cupo se realizan como una única operación consistente; si no existe, el saldo no se consume (decisión del equipo G10 — 2026-09-23).
- Estado: CONFIRMADO

Observación funcional cerrada para Fase 1:
Esta regla reemplaza las políticas de cupo configurables de versiones anteriores (sin apartamiento previo, apartamiento temporal durante Pendiente de pago y confirmación directa solo con pago válido): en Fase 1 el cupo se aparta con el primer pago, salvo el apartado temporal en la salida propuesta durante una reprogramación (RN-EJE-002, K3).

### RN-RES-008

- Regla: Toda devolución derivada de una cancelación, modificación o novedad extraordinaria debe seguir tres decisiones funcionales separadas: determinación del valor potencial a devolver, autorización de la devolución y ejecución efectiva de la salida de dinero. La determinación del valor potencial se calcula según la condición comercial parametrizada del servicio y puede dar como resultado devolución total, parcial o inexistente, salvo en cancelaciones por causas no atribuibles al cliente, en las que la devolución es del 100 % de los valores pagados y validados (G12). Toda devolución determinada debe ejecutarse y registrarse dentro de un plazo máximo de 5 días hábiles. Si no se completa en ese plazo, queda marcada como vencida y se genera una alerta para los Administradores del tenant activos; la devolución sigue siendo una obligación pendiente hasta su ejecución (L3). La autorización solo puede realizarla el Administrador del tenant. La ejecución efectiva de la salida de dinero debe quedar asociada a un movimiento identificable de caja y puede ser registrada por el Administrador del tenant o por el Colaborador operativo únicamente cuando exista autorización previa trazable. Si solo existe compensación futura o saldo a favor sin salida efectiva de dinero, el caso no debe marcarse como devolución ejecutada.
- Estado: CONFIRMADO

### RN-RES-009

- Regla: El saldo a favor corresponde a valores previamente pagados y validados que permanecen disponibles para el cliente dentro del tenant que los originó. Se genera cuando una modificación, cancelación o novedad extraordinaria produce un valor a compensar sin salida efectiva inmediata de dinero, por el tratamiento pendiente de RN-RES-006C, o por el excedente de un pago validado sobre el valor pendiente de la reserva conforme a RN-RES-006A (H11). En Fase 1 no tiene fecha de vencimiento y permanece disponible hasta ser utilizado o devuelto. El cliente puede aplicarlo total o parcialmente a una nueva reserva del mismo tenant; el valor aplicado se considera pago validado y cuenta para cumplir el abono mínimo o el pago total. El cliente puede solicitar posteriormente la devolución del saldo disponible; esta requiere autorización conforme a RN-RES-008 y no se considera completada hasta que el movimiento haya sido efectivamente procesado. El saldo a favor no puede transferirse ni utilizarse entre tenants diferentes, no se registra como movimiento de caja mientras no exista devolución ejecutada y debe registrar valor, origen, fecha, actor responsable, tenant, reserva de origen y consumos realizados (decisión del equipo E17 — 2026-09-23).
- Estado: CONFIRMADO

### RN-RES-010

- Regla: Cada reserva está asociada a una única salida. Cuando un cliente contrate más de una salida, incluso del mismo tour o dentro de una misma intención de compra, se genera una reserva independiente para cada salida. Los estados, cupos, pagos, comprobantes, saldos, cambios de fecha, ejecución y cancelación se gestionan de forma independiente por reserva. Los servicios o componentes incluidos dentro de un tour no se consideran salidas independientes (decisión del equipo G2 — 2026-09-23).
- Estado: CONFIRMADO

### RN-SAL-001

- Regla: Una salida corresponde a la ejecución programada de un tour y debe definir fecha, hora de inicio y hora de finalización estimada. El Administrador del tenant programa las salidas y asigna los vehículos requeridos (RF-020). Cada salida administra de manera independiente su disponibilidad, reservas, recursos asignados y ejecución. Cuando el transporte sea obligatorio, la capacidad efectiva de la salida corresponde al menor valor entre la capacidad definida para el tour y la capacidad total de los vehículos asignados a la salida; pueden asignarse múltiples vehículos y sus capacidades se acumulan. Un mismo vehículo puede asignarse a diferentes salidas siempre que sus intervalos programados de ejecución no se superpongan. Si una modificación de la capacidad del tour o de la asignación de transporte reduce la capacidad efectiva por debajo de los cupos ya apartados o asignados, debe impedirse (H8). Los estados de la salida se definen en la sección 16 (H3). La hora de finalización estimada corresponde a la programación y es independiente de la hora real de finalización registrada durante la ejecución (decisiones del equipo E12 y G3 — 2026-09-23).
- Estado: CONFIRMADO

### RN-ALI-001

- Regla: Cuando una comida esté incluida en el paquete del tour, forma parte del tour y de su ejecución. El restaurante que la suministra puede ser un establecimiento asociado o un proveedor del operador, pero el cliente no contrata esa comida como una reserva de restaurante independiente. La plataforma no gestiona reservas de mesa ni inventario de alimentación; los restaurantes asociados se publican con carácter informativo y de contacto conforme a RN-ASO-001 (decisión del equipo C1 — 2026-09-23).
- Estado: CONFIRMADO

### RN-ASO-001

- Regla: Un tenant puede registrar y publicar establecimientos asociados a su operación, específicamente hoteles y restaurantes, con fines de promoción comercial dentro de su experiencia digital. La asociación corresponde al establecimiento como entidad comercial y no implica registrar habitaciones, platos, menús, cupos, tarifas de reserva ni disponibilidad operativa del establecimiento. Cada establecimiento asociado puede contener información comercial básica e imagen visible para los clientes del tenant. Los establecimientos asociados son visibles únicamente dentro del tenant que mantiene la asociación. Al inactivar la asociación, el hotel o restaurante deja de mostrarse como establecimiento asociado para nuevas consultas, conservando su información e histórico.
- Estado: CONFIRMADO

Observación (GAP-04 resuelto — 2026-09-21):
En Fase 1, el único servicio con reserva y gestión de cupos en la plataforma es el tour. Hoteles y restaurantes son establecimientos asociados por convenio; la plataforma muestra sus datos de contacto para que el cliente coordine directamente con ellos. La plataforma no genera reserva de habitación ni de mesa y no gestiona inventario de hospedaje ni de alimentación. El transporte no es un servicio independiente: lo presta directamente el operador como parte del tour y, cuando es obligatorio o está incluido, su capacidad restringe el cupo disponible de la salida (RN-TRA-001). La comida incluida en un paquete forma parte del tour (RN-ALI-001). Por lo tanto, el escenario de conflicto de cupos entre servicios múltiples dentro de una reserva no se presenta en Fase 1.

Observación (GAP-10 resuelto — 2026-09-21):
La gestión de establecimientos asociados (crear, inactivar, reactivar) está restringida al Administrador del tenant; el Colaborador operativo no tiene acceso a estas operaciones. El Administrador del tenant puede reactivar un establecimiento previamente inactivado; la reactivación restaura su visibilidad promocional y debe quedar registrada con trazabilidad.

### RN-HOS-001

- Regla: Retirada en la versión 1.9. El hospedaje no se gestiona como servicio reservable en la plataforma; los hoteles se publican como establecimientos asociados de carácter informativo y de contacto conforme a RN-ASO-001 (GAP-04).
- Estado: FUERA DE ALCANCE EN FASE 1

### RN-HOS-003

- Regla: Retirada en la versión 1.9. La plataforma no valida capacidad de hospedaje; la validación de cupo aplica al tour conforme a RN-RES-007 y RF-006 (GAP-04).
- Estado: FUERA DE ALCANCE EN FASE 1

### RN-TRA-001

- Regla: El transporte forma parte de la reserva y se maneja por trayectos. El transporte es prestado directamente por el operador del tenant como parte del tour. Cuando el transporte sea obligatorio o esté incluido en el tour, su capacidad restringe el cupo disponible de la salida: el sistema debe utilizar la capacidad efectiva disponible, determinada conforme a RN-SAL-001, y no permitir sobreventa por falta de transporte (decisiones del equipo C1 y E12 — 2026-09-23).
- Estado: CONFIRMADO

### RN-TRA-002

- Regla: El transporte debe manejar una tarifa parametrizada por persona. La tarifa puede variar dependiendo del servicio o actividad asociada, y cada tour puede tener una tarifa fija propia por persona para el trayecto correspondiente. Si la reserva se modifica debe recalcularse el valor de transporte que corresponda a la nueva configuración.
- Estado: CONFIRMADO

### RN-EJE-001

- Regla: Al alcanzarse la hora programada de inicio de una salida, Multitour bloquea nuevos pagos, abonos y comprobantes asociados a ella y cancela automáticamente las reservas que no cumplan las condiciones económicas necesarias para participar —pagos, saldos o diferencias pendientes, o un comprobante necesario para completar el pago todavía En validación—, liberando sus cupos. Estas acciones no dependen del registro manual del inicio real. Si la hora programada de inicio se alcanza mientras el tenant está inactivo, no se aplica lo anterior: Multitour cancela automáticamente la salida por una causa no atribuible al cliente, sin aplicar cancelaciones por incumplimiento de pago ni vencimientos asociados a la salida original, y sus reservas se gestionan conforme a RN-EJE-002 (I1). Si un comprobante de una reserva cancelada por esta causa se aprueba después, los valores reconocidos se tratan conforme al tratamiento pendiente de RN-RES-006C y no reactivan la reserva. Un retraso en el inicio real de la salida no extiende los plazos económicos (G1, H1). El inicio real y la finalización de la salida los registran en Multitour el Administrador del tenant o un Colaborador operativo con el permiso Gestionar ejecución de salidas, después del control operativo previo realizado por el guía (E11, G5, H9). Al registrarse el inicio real, pasan a En ejecución únicamente las reservas que continúan elegibles: Confirmadas con situación financiera Pago completo. Al registrarse la finalización, las reservas En ejecución pasan automáticamente a Finalizada. Si se alcanza la hora programada de inicio y la salida sigue Programada, Multitour genera una alerta a los Administradores del tenant activos y a los usuarios con el permiso Gestionar ejecución de salidas. Si se alcanza la hora de finalización estimada sin cierre operativo, la salida queda identificada como pendiente de regularización. El Administrador del tenant o un usuario con el permiso Gestionar ejecución de salidas debe registrar posteriormente lo ocurrido con la información real disponible: salida ejecutada y finalizada, cancelada o interrumpida. El sistema no marca una salida como Finalizada solo por el paso del tiempo. Toda regularización conserva la hora real reportada, el responsable, la fecha del registro y su trazabilidad (J3, L4). Si una persona no se presenta y no hubo aviso oportuno al guía, este puede conceder hasta 10 minutos adicionales antes de iniciar. Si transcurren esos 10 minutos sin presentación ni aviso oportuno, el servicio correspondiente se mantiene como cobrado aunque la persona no participe en la actividad.
- Estado: CONFIRMADO

### RN-EJE-002

- Regla: En ejecución no se permiten ajustes ordinarios posteriores a la reserva inicial. Solo puede registrarse una cancelación extraordinaria del tour por emergencia, la cual debe quedar justificada por el colaborador o responsable operativo y debe conducir a una decisión de reagendamiento o devolución.
- Estado: CONFIRMADO

Observación funcional base de Fase 1:
Cuando una salida se cancele antes de su inicio, o una salida ya iniciada no pueda completarse, por decisión, contingencia, emergencia o imposibilidad operativa no atribuible al cliente, el tenant debe registrar la causal y, si la salida ya había iniciado, la interrupción. El Administrador del tenant tiene un plazo máximo de 24 horas corridas desde la cancelación o interrupción para proponer al cliente una nueva salida con disponibilidad. Si dentro de ese plazo no se propone una nueva salida, o no existe ninguna salida disponible, la reserva se cancela y se devuelve el 100 % de los valores efectivamente pagados y validados; la reserva no puede permanecer indefinidamente asociada a una salida cancelada o interrumpida (L1). Si el cliente acepta y existe disponibilidad en la nueva salida, se conserva la misma reserva, sus pagos y su historial; si la salida ya había iniciado, se registra la ejecución interrumpida y la reserva regresa excepcionalmente de En ejecución a Confirmada con la nueva salida asignada. La reprogramación no está sujeta a las restricciones temporales de la política de cambios (E7). Si el cliente no acepta la reprogramación, la reserva pasa a Cancelada y se devuelve el 100 % de los valores pagados y validados, sin penalidades, retenciones ni devoluciones parciales. Una reserva cancelada no puede reactivarse (decisiones del equipo G12, G18 y H2 — 2026-09-23).

Plazo de respuesta a la reprogramación (decisión del equipo I2 — 2026-09-23):
La propuesta de una nueva salida solo puede enviarse si esa salida tiene capacidad suficiente para los viajeros de la reserva. Al enviarla, Multitour aparta en la salida propuesta los cupos correspondientes durante el plazo de respuesta. El apartado termina con el primero de estos eventos: si el cliente acepta, los cupos apartados quedan asociados a la reserva reprogramada; si el cliente rechaza, si vence el plazo de respuesta o si llega la hora programada de la nueva salida sin aceptación, los cupos se liberan (K3). El cliente dispone de hasta 72 horas corridas desde la notificación de la propuesta para aceptarla o rechazarla, sin que el vencimiento supere la hora programada de inicio de la nueva salida propuesta. Mientras espera la respuesta, la reserva se identifica con la marca Pendiente de respuesta de reprogramación y deja de estar asociada operativamente a la salida cancelada o interrumpida. Si el cliente acepta y existe disponibilidad, se conserva la misma reserva, sus pagos y su historial y se asigna la nueva salida. Si rechaza la propuesta o no responde dentro del plazo, la reserva se cancela y se devuelve el 100 % de los valores efectivamente pagados y validados. El plazo se suspende cuando el tenant está inactivo y el cliente no dispone de un mecanismo habilitado para registrar su decisión. Mientras dura el plazo de respuesta, los plazos económicos de la reserva permanecen congelados; si el cliente acepta la nueva salida, continúan con el tiempo que les quedaba antes de la suspensión, sin superar en ningún caso la hora programada de inicio de la nueva salida (L2).

Salida alcanzada durante la inactivación del tenant (decisión del equipo I1 — 2026-09-23):
Si la fecha y hora programadas de una salida se alcanzan mientras el tenant está inactivo, Multitour cancela automáticamente la salida por una causa no atribuible al cliente, sin aplicar cancelaciones por incumplimiento de pago ni vencimientos asociados a la salida original. Sus reservas pueden reprogramarse conforme a esta regla. Cuando se reprograma una reserva pendiente de pago, sus plazos operativos congelados continúan con el tiempo restante, sujetos al límite absoluto de la hora programada de inicio de la nueva salida. La reactivación del tenant no reactiva una salida cuya hora programada ya haya transcurrido.

Emergencia personal del cliente durante la ejecución (decisión del equipo H7 — 2026-09-23):
Cuando, durante una salida iniciada, el cliente o una persona de su reserva no pueda continuar por una emergencia personal, el caso se registra como novedad de ejecución. No genera devolución automática; cualquier devolución se rige por la política de cancelación aplicable al servicio.

### RN-EJE-006

- Regla: El reagendamiento derivado de una emergencia o de una novedad operativa permitida debe preservar la trazabilidad entre el evento original y la solución acordada. Un cambio exclusivo de fecha se resuelve siempre sobre la misma reserva, registrando el cambio en su historial. Si el reagendamiento implica nuevo servicio principal o nueva condición comercial independiente, debe generarse una nueva reserva vinculada a la original, dejando explícitamente una relación origen-destino y el tratamiento económico aplicado entre ambas.
- Estado: CONFIRMADO

Observación (GAP-07; decisiones del equipo C2, E7 y E25 — 2026-09-23):
- Un cambio que afecte únicamente la fecha del servicio, manteniendo el mismo titular, el mismo servicio principal y la misma condición comercial base, se resuelve sobre la misma reserva con trazabilidad del cambio. Cambiar solo la fecha no crea una nueva identidad de reserva.
- Las restricciones temporales de la política de cambios configurada para cada tour aplican únicamente a solicitudes realizadas por el cliente; si la política vigente no lo permite, la solicitud se bloquea. No aplican cuando la reprogramación es necesaria por emergencia, contingencia externa o imposibilidad operativa que impida ejecutar el servicio en la fecha prevista; en ese caso la reprogramación conserva la misma reserva, queda registrada en el historial y requiere la aceptación del cliente cuando implique una nueva fecha de ejecución.
- No se permite modificar la fecha de una reserva mientras exista un comprobante asociado En validación; una vez resuelto el comprobante, el cambio puede realizarse de acuerdo con las políticas aplicables.
- Antes de modificar la fecha, el sistema verifica la disponibilidad de la nueva salida. Si existe capacidad suficiente, la reserva conserva su identidad y sus pagos, su cupo se traslada a la nueva salida y se libera el de la salida anterior como una única operación consistente. Si no existe disponibilidad en la nueva salida, el cambio no se realiza y la reserva conserva su fecha y cupo actuales.
- Todo cambio de fecha se conserva en el historial de la reserva.

### RN-EJE-003

- Regla: Solo debe considerarse como base real lo efectivamente prestado.
- Estado: CONFIRMADO

### RN-EJE-004

- Regla: Una vez la reserva entra en ejecución no deben modificarse cantidad de acompañantes ni servicios asociados como parte del flujo ordinario.
- Estado: CONFIRMADO

### RN-EJE-005

- Regla: Los servicios no prestados deben quedar visibles para seguimiento con su causal.
- Estado: CONFIRMADO

### RN-ATR-001

- Regla: Cada atractivo debe tener definidos valor comercial y costos operacionales para soportar su uso en reserva y control operacional.
- Estado: CONFIRMADO

### RN-OPE-001

- Regla: Para servicios prestados que dependan de costos catalogados, el sistema debe permitir calcular o registrar costos operacionales con base en la parametrización disponible y la cantidad real de personas atendidas. El Administrador del tenant y el Colaborador operativo pueden registrar gastos operacionales reales cuando estos impliquen salida de dinero de caja durante la operación. Para Fase 1, se entiende por gasto operacional una salida de dinero originada por consumo interno, compra menor o desembolso operativo no asociado a una obligación formal previamente causada como pago operacional.
- Estado: CONFIRMADO

### RN-CAJ-001

- Regla: La caja se gestiona operativamente por día. Cada jornada inicia con una base de caja parametrizable por el Administrador del tenant según la necesidad de cada día de operación, por ejemplo entre días ordinarios y fines de semana. La caja permite registrar ingresos, pagos, gastos y devoluciones, debe soportar cierre formal diario, conservar histórico de movimientos y cierres, y permitir obtener el total operativo diario bajo la lógica BASE + INGRESOS - PAGOS - GASTOS - DEVOLUCIONES = TOTAL. La modificación de parámetros de base queda restringida al Administrador del tenant. Para Fase 1, se entiende por ingreso el dinero efectivamente recibido; por pago operacional la salida de dinero destinada a cubrir obligaciones operativas asociadas a servicios, proveedores o compromisos del negocio; por gasto la salida de dinero menor o administrativa no clasificada como pago operacional; y por devolución la salida de dinero efectivamente realizada para reintegrar total o parcialmente valores de una reserva. La consolidación mensual debe construirse a partir de los movimientos diarios y sus cierres, sin sumar repetidamente cada base diaria como si fuera ingreso nuevo del periodo.
- Toda devolución que implique salida efectiva de dinero debe generar un movimiento identificable en caja, asociado a la reserva correspondiente y sin clasificarse automáticamente como gasto operacional.
- Como regla base de Fase 1, la base de cada jornada es independiente del total de cierre de la jornada anterior, salvo que el Administrador del tenant registre expresamente un nuevo valor de base para el día.
- La caja diaria consolida los movimientos económicos de la jornada y debe discriminar entradas y salidas por medio de pago. La base de apertura representa exclusivamente efectivo físico. El efectivo esperado al cierre se calcula como la base inicial más las entradas en efectivo menos las salidas en efectivo. Las transferencias se registran y concilian separadamente y no incrementan el efectivo físico esperado. Una transferencia se reconoce económicamente en la fecha y hora en que es validada: si se valida después del cierre físico de caja pero dentro del mismo día calendario, se registra como movimiento no efectivo posterior al cierre, no modifica el efectivo esperado y no requiere reabrir la caja; si se valida en un día calendario posterior, pertenece a la caja de ese día (decisiones del equipo M1, E13 y G13 — 2026-09-23).
- En Fase 1, cada tenant tiene una única caja por día calendario, según su zona horaria. La caja puede ser abierta, cerrada y reabierta por el Administrador del tenant o por un Colaborador operativo con el permiso Gestionar caja. La reapertura requiere motivo obligatorio y trazabilidad completa y no genera una segunda caja para la misma fecha. Todas estas operaciones conservan trazabilidad del usuario, la fecha, la hora y, cuando corresponda, el motivo de reapertura. No es obligatorio que el mismo usuario realice la apertura y el cierre (E13, G13).
- Si se valida una transferencia en un día en que todavía no existe caja, Multitour crea automáticamente la caja de ese día para registrar el movimiento electrónico. Esta creación no representa una apertura física de efectivo, no requiere base inicial y no modifica el efectivo esperado. Si ese mismo día se requieren movimientos en efectivo, debe abrirse y utilizarse esa misma caja; no puede generarse una segunda caja para el mismo tenant y fecha (L10).
- Durante la inactivación del tenant, el Administrador del tenant puede registrar las devoluciones y los movimientos financieros estrictamente necesarios para resolver obligaciones existentes, con auditoría (G4).
- Estado: CONFIRMADO

Observación:
Toda corrección operativa posterior al cierre requiere reabrir la caja conforme a esta regla, con justificación obligatoria y trazabilidad de la acción realizada (G13).

Observación adicional:
Toda corrección operativa excepcional posterior al cierre debe conservar el histórico original del cierre realizado y reflejarse en la consolidación correspondiente mediante trazabilidad de la novedad aplicada.

Observación (GAP-11 resuelto — 2026-09-21):
El total mensual de caja se obtiene sumando todos los movimientos individuales del mes: ingresos efectivamente recibidos, menos pagos operacionales, menos gastos operacionales, menos devoluciones ejecutadas. Los cierres diarios no se re-suman entre sí; cada movimiento se contabiliza una sola vez en el periodo mensual.

## 15. Responsabilidades operativas respaldadas por las fuentes

### Parametrizaciones funcionales permitidas en Fase 1

- Tipos de pago habilitados por tenant o servicio: pago total y abono.
- Medios de pago habilitados por tenant o servicio: transferencia y efectivo.
- Identidad visual básica por tenant: nombre comercial visible, logotipo, color principal, color secundario e imágenes comerciales.
- Duración del plazo inicial de pago por tipo de pago.
- Duración máxima de la única ampliación del plazo de pago, que pueden conceder el Colaborador operativo o el Administrador del tenant (G5).
- Abono mínimo requerido para confirmar una reserva, calculado sobre el valor final.
- Plazo máximo para completar el saldo de una reserva confirmada con abono, en días u horas antes de la hora programada de inicio de la salida, incluyendo el mismo día antes de esa hora, sin superarla (D4, G1, H1).
- Parámetros de descuentos: vigencia, prioridad, acumulación, topes, base de cálculo y motivos autorizables.
- Parámetros de modificación o cancelación por servicio o actividad, que aplican a las solicitudes del cliente (E7).
- Capacidad de cada tour, programación de salidas con fecha, hora de inicio y hora de finalización estimada, y vehículos asignados, definidos por el Administrador del tenant (RN-SAL-001, RF-020).
- Base diaria de caja por día operativo.
- Asignación del permiso Validar comprobantes a Colaboradores operativos; los tenants que habiliten transferencia deben mantener al menos un usuario activo con este permiso (E14).
- Asignación del permiso Consultar datos sensibles a usuarios cuya función operativa lo justifique (E22).
- Asignación del permiso Gestionar caja a Colaboradores operativos (G13).
- Asignación del permiso Gestionar ejecución de salidas a Colaboradores operativos (G5).
- Zona horaria oficial del tenant, modificable con efecto prospectivo (G14).
- Habilitación del Colaborador operativo para registrar o actualizar información descriptiva operativa del catálogo (RF-004).
- Habilitación de los roles opcionales Gerente, Contador y Analista, y habilitación de su acceso a la auditoría del tenant (sección 9, roles opcionales).

Ninguna otra parametrización funcional debe asumirse como obligatoria de Fase 1 si no queda incorporada mediante una nueva versión de este PDR. No son parametrizables: el plazo de revisión de comprobantes (24 horas corridas), la vigencia de los códigos y enlaces de recuperación (30 minutos), la vigencia de las credenciales temporales (72 horas), la vigencia de la autorización de acceso excepcional (24 horas), el plazo para decidir el tratamiento pendiente de valores abonados (24 horas corridas), el plazo de respuesta del cliente a una propuesta de reprogramación (72 horas corridas), el plazo del Administrador del tenant para proponer una reprogramación (24 horas corridas), el plazo para decidir el tratamiento de un excedente por modificación o de una cancelación solicitada por el cliente (24 horas corridas) y el plazo máximo de ejecución de una devolución (5 días hábiles). El tratamiento de valores abonados de una reserva cancelada por incumplimiento se decide caso por caso conforme a RN-RES-006C y no es una parametrización.

Observación de parametrización visual:
La identidad visual básica de cada tenant debe operar sobre el mismo layout, la misma navegación, los mismos componentes base, la misma tipografía estructural, los mismos colores semánticos y las mismas reglas de accesibilidad definidas por la plataforma. Cuando el tenant no configure identidad visual propia, se utilizará la identidad predeterminada de la plataforma.

### Regla de cupo de Fase 1

- El cupo se controla por salida conforme a RN-SAL-001 y se aparta y asigna conforme a RN-RES-007. Las políticas de cupo configurables de versiones anteriores quedan reemplazadas por esa regla (E2).
- Hoteles y restaurantes asociados: no manejan cupo en la plataforma; son informativos y de contacto (GAP-04).

Las siguientes responsabilidades aparecen respaldadas por las fuentes revisadas y quedan consistentes con los roles formales confirmados en esta versión final del documento para Fase 1.

### Función operativa de registro de reservas y seguimiento

- Tipo: Función operativa identificada
- Responsabilidades respaldadas por las fuentes:
  - registrar clientes y reservas
  - consultar reservas del día, próximas reservas y seguimiento operativo
  - calcular valores proyectados de la reserva
  - registrar la diferencia entre lo reservado y lo ejecutado
  - verificar documentos obligatorios y requisitos de la actividad
- Estado: FUNCIÓN RESPALDADA / ALINEADA PRINCIPALMENTE CON EL ROL COLABORADOR OPERATIVO

### Función operativa de control de costos operacionales

- Tipo: Función operativa identificada
- Responsabilidades respaldadas por las fuentes:
  - controlar costos operacionales
- Estado: FUNCIÓN RESPALDADA / ALINEADA CON LOS ROLES ADMINISTRADOR Y COLABORADOR OPERATIVO

### Función operativa de control administrativo y de caja

- Tipo: Función operativa identificada
- Responsabilidades respaldadas por las fuentes:
  - revisar consolidación de caja
  - ejecutar cierres de caja
  - registrar gastos y movimientos de caja cuando tenga autorización
- Estado: FUNCIÓN RESPALDADA / ALINEADA PRINCIPALMENTE CON EL ROL COLABORADOR OPERATIVO

### Cliente final usuario de canal digital adaptable para web y móvil

- Tipo: Rol del sistema confirmado
- Responsabilidades confirmadas:
  - consultar tours disponibles e información de establecimientos asociados
  - visualizar descuentos vigentes aplicables a la reserva
  - crear reservas desde el canal digital adaptable para web y móvil
  - autenticarse con sus credenciales para gestionar su reserva
  - avanzar al proceso de cobro o pago con aplicación automática de descuentos parametrizados o autorizados
- Estado: FUNCIÓN RESPALDADA / ROL FORMAL CONFIRMADO

### Gerente

- Tipo: Función opcional por tenant
- Responsabilidades confirmadas cuando el tenant lo habilite:
  - consultar reservas, estados y próximas ejecuciones
  - consultar dashboard diario y reporte administrativo mensual
  - consultar ingresos, gastos, pagos operacionales, devoluciones y consolidado de caja
  - consultar descuentos aplicados y su trazabilidad
  - consultar métricas operativas y comerciales del tenant
  - consultar auditoría de eventos relevantes del tenant, únicamente cuando el Administrador del tenant haya habilitado ese acceso conforme a la necesidad operativa y con trazabilidad de dicha autorización
  - consultar clientes, servicios, transporte, establecimientos asociados y catálogos operativos
  - exportar o visualizar reportes de seguimiento del negocio
- Restricción base:
  - no registra reservas, pagos, gastos ni movimientos de caja
  - no configura descuentos
  - no valida comprobantes de transferencia
  - no autoriza devoluciones
  - no administra tenants
- Estado: FUNCIÓN OPCIONAL POR TENANT / PERMISOS BASE DEFINIDOS

### Contador

- Tipo: Función opcional por tenant
- Responsabilidades confirmadas cuando el tenant lo habilite:
  - consultar ingresos, gastos, pagos operacionales, devoluciones y consolidado de caja
  - consultar dashboard o reportes económicos del tenant
  - consultar movimientos de caja y cierres históricos
  - consultar reservas con impacto económico
  - consultar pagos, abonos, saldo pendiente y devoluciones asociadas a reservas
  - consultar costos operacionales registrados
  - consultar descuentos aplicados que afecten el valor final
  - exportar o visualizar reportes financieros y administrativos
  - consultar auditoría de eventos económicos relevantes del tenant, únicamente cuando el Administrador del tenant haya habilitado ese acceso conforme a la necesidad operativa y con trazabilidad de dicha autorización
- Restricción base:
  - no registra reservas, pagos, gastos ni movimientos de caja
  - no valida comprobantes de transferencia
  - no configura descuentos
  - no autoriza devoluciones
  - no administra tenants
- Estado: FUNCIÓN OPCIONAL POR TENANT / PERMISOS BASE DEFINIDOS

### Analista

- Tipo: Función opcional por tenant
- Responsabilidades confirmadas cuando el tenant lo habilite:
  - consultar reservas, estados y próximas ejecuciones
  - consultar dashboard diario y reportes del tenant
  - consultar métricas operativas y comerciales del tenant
  - consultar clientes, servicios, transporte, establecimientos asociados y catálogos operativos
  - consultar costos operacionales registrados
  - consultar pagos, abonos, saldo pendiente y devoluciones asociadas a reservas
  - consultar descuentos aplicados y su trazabilidad
  - consultar auditoría de eventos relevantes del tenant, únicamente cuando el Administrador del tenant haya habilitado ese acceso conforme a la necesidad operativa y con trazabilidad de dicha autorización
  - exportar o visualizar reportes e indicadores del negocio
  - consultar históricos o tendencias disponibles del tenant
- Restricción base:
  - no registra reservas, pagos, gastos ni movimientos de caja
  - no valida comprobantes de transferencia
  - no configura descuentos
  - no autoriza devoluciones
  - no administra tenants
- Estado: FUNCIÓN OPCIONAL POR TENANT / PERMISOS BASE DEFINIDOS

### Administrador del tenant

- Tipo: Rol del sistema confirmado
- Responsabilidades confirmadas:
  - administrar reservas, descuentos, caja y configuraciones habilitadas del sistema
  - validar o rechazar comprobantes de transferencia
  - autorizar devoluciones monetarias y registrar su trazabilidad
  - parametrizar descuentos según las necesidades del negocio
  - mantener control general sobre la operación del sistema
  - gestionar los usuarios internos del tenant (E9)
  - programar salidas, asignar vehículos y cancelar salidas programadas (G3, H3)
  - registrar el inicio real y la finalización de las salidas y regularizar salidas sin registro (H9, L4)
  - proponer reprogramaciones dentro de las 24 horas corridas siguientes a la cancelación o interrupción de una salida (L1)
  - registrar la cancelación de una reserva solicitada por el cliente y decidir su tratamiento económico (L8)
  - abrir, cerrar y reabrir caja (G13)
  - decidir el tratamiento de valores abonados de reservas canceladas (G5, G7)
- Estado: ROL CONFIRMADO

### Administrador de plataforma

- Tipo: Rol del sistema confirmado
- Responsabilidades confirmadas:
  - crear, activar, inactivar y reactivar tenants
  - asignar el primer Administrador de cada tenant
  - consultar la auditoría transversal de plataforma
  - ejecutar soporte administrativo excepcional sobre tenants con trazabilidad obligatoria
  - acceder a datos de un tenant solo conforme a la regla de acceso excepcional de la sección 9 (E21)
- Estado: ROL CONFIRMADO

### Colaborador operativo

- Tipo: Rol del sistema confirmado
- Responsabilidades confirmadas:
  - registrar reservas y consultar reservas del día o próximas
  - gestionar operaciones de caja de acuerdo con su responsabilidad operativa
  - consultar y registrar información de caja cuando corresponda
  - registrar gastos operacionales reales cuando deban pagarse desde caja
  - contactar clientes con reservas pendientes de pago y registrar seguimiento
  - modificar reservas cuando el negocio lo permita antes de la ejecución
  - registrar el inicio y la finalización de las salidas, con el permiso Gestionar ejecución de salidas (E11, G5)
  - abrir, cerrar y reabrir caja, con el permiso Gestionar caja (E13, G13)
  - registrar pagos en efectivo, ampliar el plazo de pago y cargar comprobantes en nombre del cliente (G5)
  - registrar la cancelación de una reserva solicitada por el cliente (L8)
  - operar sin permisos para configurar, autorizar o aplicar descuentos discrecionales fuera de la parametrización vigente
- Estado: ROL CONFIRMADO

## 16. Estados y ciclos de vida

### Reserva

- Estados confirmados: Pendiente de pago, Confirmada, En ejecución, Finalizada y Cancelada.
- Una reserva queda en estado Pendiente de pago al crearse y mientras los pagos validados no cumplan la condición de confirmación de su tipo de pago.
- Una reserva pasa a Confirmada cuando los pagos validados cumplen la condición de confirmación: el 100 % del valor final en pago total, o como mínimo el abono mínimo en abono (RN-RES-004). Completar después el saldo no cambia el estado de la reserva, solo su situación financiera.
- Una reserva pasa a En ejecución cuando el Administrador del tenant o un Colaborador operativo con el permiso Gestionar ejecución de salidas registran el inicio real de su salida y la reserva sigue elegible: Confirmada con situación financiera Pago completo (RN-EJE-001).
- Una reserva pasa a Finalizada cuando se registra la finalización de su salida.
- Una reserva pasa a Cancelada cuando la reserva completa deja de continuar por vencimiento del plazo de pago o del plazo del saldo, por no cumplir las condiciones económicas al alcanzarse la hora programada de inicio de la salida, por decisión del cliente registrada conforme a RF-021 o por cancelación o interrupción de la salida no atribuible al cliente cuando el cliente no acepta la reprogramación.
- La no asistencia de una persona o de parte del grupo no implica automáticamente cancelación total de la reserva, sino que debe registrarse como novedad operativa según corresponda.

### Reglas mínimas de transición para Reserva

- Pendiente de pago a Confirmada: cuando los pagos validados cumplen la condición de confirmación de su tipo de pago.
- Pendiente de pago a Cancelada: automáticamente, cuando vence el plazo total de pago —cuyo vencimiento efectivo es el menor valor entre el plazo configurado y la hora programada de inicio de la salida— sin pago validado que cumpla la condición de confirmación y sin comprobante En validación; cuando un comprobante es rechazado después de ese vencimiento; o al alcanzarse la hora programada de inicio de la salida. También cuando el cliente solicita la cancelación y la registran un Colaborador operativo o el Administrador del tenant (RN-RES-006, RN-RES-006C, RN-EJE-001, RF-021).
- Confirmada a Cancelada: automáticamente, cuando vence el plazo del saldo o de una diferencia pendiente sin que se haya completado y sin comprobante En validación; cuando un comprobante de ese pago es rechazado después del vencimiento; o al alcanzarse la hora programada de inicio de la salida con pagos, saldos o diferencias pendientes o con un comprobante todavía En validación (RN-RES-004, RN-EJE-001). También cuando el cliente solicita la cancelación y la registran un Colaborador operativo o el Administrador del tenant (RF-021), o por cancelación de la salida por una causa no atribuible al cliente cuando este no acepta la reprogramación (RN-EJE-002).
- Confirmada a En ejecución: al registrarse el inicio real de la salida, siempre que la reserva siga elegible con situación financiera Pago completo.
- En ejecución a Finalizada: al registrarse la finalización de la salida.
- En ejecución a Confirmada: excepcionalmente, cuando la salida se interrumpe por una causa no atribuible al cliente y el cliente acepta la reprogramación con disponibilidad en la nueva salida; se registra la ejecución interrumpida y se asigna la nueva salida (H2).
- En ejecución a Cancelada: cuando la salida se interrumpe por una causa no atribuible al cliente y el cliente no acepta la reprogramación, con devolución del 100 % de los valores pagados y validados (H2).
- Marca Pendiente de respuesta de reprogramación: se aplica a la reserva afectada por la cancelación o interrupción de su salida mientras el cliente decide sobre la nueva salida propuesta; no es un estado. Durante ese plazo, los cupos de los viajeros de la reserva quedan apartados en la salida propuesta (K3). Si el cliente acepta, la reserva se asocia a la nueva salida y, si estaba En ejecución, vuelve a Confirmada (H2, I2).
- Pendiente de pago, Confirmada o En ejecución a Cancelada: cuando la reserva tiene la marca Pendiente de respuesta de reprogramación y el cliente rechaza la propuesta o no responde dentro de las 72 horas corridas, con devolución del 100 % de los valores pagados y validados (I2).
- Cancelada es un estado terminal: una reserva cancelada no puede reactivarse ni regresar a ningún otro estado. Si el cliente desea contratar nuevamente, se crea una nueva reserva conforme a las condiciones vigentes en ese momento (decisión del equipo G18 — 2026-09-23).
- Mientras el tenant esté inactivo, los plazos operativos de las reservas quedan suspendidos y no se ejecutan cancelaciones automáticas de reservas; si se alcanza la hora programada de una salida, la salida se cancela y se aplica RN-EJE-002 (sección 9, I1).

Observación de reagendamiento con nueva reserva:
Un cambio exclusivo de fecha no genera una nueva reserva (RN-EJE-006). Cuando el caso requiera reagendamiento con una nueva reserva relacionada por cambio de servicio principal o de condición comercial conforme a RN-EJE-006, dicha nueva reserva vinculada no se entiende como un estado adicional del ciclo de vida, sino como una relación funcional trazable entre la reserva original y la nueva reserva generada.

### Estado del comprobante

- Estados confirmados: En validación, Aprobado y Rechazado (decisión del equipo E3 — 2026-09-23). Revisión vencida es una marca del comprobante En validación, no un estado.
- En validación: estado inicial al presentarse un comprobante de transferencia dentro del plazo. No se considera pago validado.
- Aprobado: un usuario con el permiso Validar comprobantes validó el comprobante; su valor se suma a los pagos validados.
- Rechazado: el comprobante no fue aceptado; se conserva en el histórico y no modifica otros pagos validados.

### Reglas mínimas de transición para Estado del comprobante

- Presentación a En validación: cuando el cliente, o un usuario interno en su nombre, presenta un comprobante dentro del plazo vigente y antes de la hora programada de inicio de la salida y, si se trata del primer pago de una reserva sin cupo, existe disponibilidad en la salida (RN-RES-007).
- En validación a Aprobado: cuando un usuario con el permiso Validar comprobantes lo aprueba.
- En validación a Rechazado: cuando un usuario con el permiso Validar comprobantes lo rechaza.
- En validación durante más de 24 horas corridas sin decisión: se marca como revisión vencida y se genera la alerta de RN-RES-006C, sin cambiar de estado.
- En validación al alcanzarse la hora programada de inicio de la salida: la reserva se cancela conforme a RN-EJE-001; si el comprobante se aprueba después, su valor pasa a tratamiento pendiente (RN-RES-006C).

### Situación financiera de la reserva

- Valores confirmados: Sin pago, Parcial, Abono recibido, Saldo pendiente y Pago completo, determinados a partir de los valores efectivamente validados (decisiones del equipo E3 y H12 — 2026-09-23).
- Sin pago: no existe ningún pago validado.
- Parcial: existen pagos validados que no cumplen la condición de confirmación del tipo de pago.
- Abono recibido: reserva de tipo abono Confirmada con saldo pendiente (monto) mayor que cero.
- Saldo pendiente: reserva de tipo pago total Confirmada con una diferencia pendiente generada por una modificación posterior a su confirmación; la interfaz puede mostrarla como "Confirmada con saldo pendiente" (H12).
- Pago completo: se ha validado el 100 % del valor final y el saldo pendiente (monto) es cero.
- La situación financiera muestra siempre el saldo pendiente (monto), los valores devueltos, el saldo a favor generado y, cuando aplique, los valores en tratamiento pendiente, y se mantiene separada del estado de la reserva.
- Un pago validado, una devolución ejecutada, una aplicación de saldo a favor o una modificación del valor final recalculan la situación financiera.

### Regla base de disponibilidad comercial

- Para Fase 1, un tour o servicio se considera disponible para consulta y reserva cuando se encuentra habilitado por el negocio para venta, dentro de su vigencia comercial y sin restricción operativa registrada que lo excluya expresamente para la fecha consultada.
- Si el servicio maneja cupo limitado, la disponibilidad también depende de que exista cupo libre o cupo apartable según la parametrización vigente.

### Salida

- Estados confirmados: Programada, En ejecución, Finalizada y Cancelada (decisión del equipo H3 — 2026-09-23).
- Programada: estado inicial de una salida programada conforme a RF-020.
- Programada a En ejecución: al registrarse el inicio real de la salida.
- En ejecución a Finalizada: al registrarse la finalización de la salida. Si la salida se interrumpe por una causa no atribuible al cliente, se registra la interrupción y la salida pasa a Finalizada con la interrupción registrada; sus reservas se gestionan conforme a RN-EJE-002. El registro lo realizan el Administrador del tenant o un usuario con el permiso Gestionar ejecución de salidas (K1).
- Programada a Cancelada: cuando el Administrador del tenant cancela la salida antes de su inicio real, incluida la regularización de una salida que no se realizó, o automáticamente cuando su hora programada de inicio se alcanza mientras el tenant está inactivo (I1, L4); sus reservas se gestionan conforme a RN-EJE-002. Una salida Cancelada no se reactiva.
- Inicio no registrado: al alcanzarse la hora programada de inicio con la salida en Programada, se genera una alerta a los Administradores del tenant activos y a los usuarios con el permiso Gestionar ejecución de salidas (L4).
- Pendiente de regularización: marca de la salida que supera su hora de finalización estimada sin cierre operativo; no es un estado ni cierra la salida (L4).
- Regularización: el Administrador del tenant o un usuario con el permiso Gestionar ejecución de salidas registra lo ocurrido con la hora real: si la salida se ejecutó, se registran su inicio y su finalización reales (Programada o En ejecución a Finalizada) y sus reservas elegibles pasan a En ejecución y luego a Finalizada; si no se realizó, pasa a Cancelada; si se interrumpió, se registra la interrupción. El sistema no marca una salida como Finalizada solo por el paso del tiempo (L4).

### Ejecución

- La ejecución de una reserva comienza cuando el Administrador del tenant o un Colaborador operativo con el permiso Gestionar ejecución de salidas registran el inicio real de su salida y termina cuando registran su finalización (RN-EJE-001).
- Durante la ejecución se debe registrar lo efectivamente prestado y lo no prestado con su causal correspondiente.
- Durante la ejecución no se permiten ajustes ordinarios sobre la reserva.
- Si ocurre una emergencia, puede registrarse una cancelación extraordinaria con su justificación y con la posterior definición de reagendamiento o devolución.

### Caja

- Estados confirmados: Abierta y Cerrada. En Fase 1, cada tenant tiene una única caja por día calendario, según su zona horaria.
- Caja creada automáticamente: cuando se valida una transferencia en un día sin caja, la caja de ese día se crea automáticamente solo para movimientos electrónicos, sin apertura física ni base; para movimientos en efectivo se abre esa misma caja (L10).
- El Administrador del tenant o un Colaborador operativo con el permiso Gestionar caja abre la caja sobre una base de efectivo físico, realiza el cierre formal diario y, cuando sea necesario, la reabre; no es obligatorio que el mismo usuario realice la apertura y el cierre.
- Abierta a Cerrada: por el cierre formal diario. Cerrada a Abierta: por reapertura con motivo obligatorio y trazabilidad completa, sin generar una segunda caja para la misma fecha.
- En el cierre, las entradas y salidas se discriminan por medio de pago, el efectivo esperado se concilia con el efectivo físico y las transferencias se concilian por separado (RN-CAJ-001).
- La información diaria alimenta una consolidación administrativa mensual.
- La base diaria es parametrizable por el Administrador del tenant según el día de operación.

### Tenant

- Estados confirmados: Activo e Inactivo.
- Un tenant se crea por proceso administrativo interno de plataforma.
- Un tenant Activo puede autenticar usuarios y operar reservas.
- Un tenant Inactivo conserva trazabilidad e histórico, pero no permite nuevas reservas, pagos, ventas ni demás operaciones comerciales. Al inactivarse se revocan los accesos de operación normal de todos sus usuarios; el Administrador del tenant conserva un acceso restringido para gestionar obligaciones pendientes y registrar las devoluciones y movimientos financieros necesarios, y todos los plazos operativos del tenant quedan suspendidos hasta la reactivación (sección 9).

### Reglas mínimas de transición para Tenant

- Creación administrativa a Activo o Inactivo: según decisión del Administrador de plataforma al momento del alta.
- Activo a Inactivo: por decisión administrativa con motivo registrado.
- Inactivo a Activo: por reactivación explícita del Administrador de plataforma con trazabilidad obligatoria.

## 17. Requerimientos no funcionales

Las dimensiones no funcionales revisadas contra las fuentes disponibles del proyecto quedaron consolidadas en esta versión 1.9 como línea base vigente para Fase 1. Los criterios aquí definidos deben tratarse como referencia verificable del PDR mientras no exista una actualización formal posterior del documento.

- Seguridad: CONFIRMADO PARA FASE 1. En Fase 1 el sistema debe contemplar autenticación de usuarios, control básico de acceso por perfil operativo, restricción de operaciones sensibles y aislamiento estricto por tenant. Los perfiles base obligatorios confirmados son Administrador de plataforma, Cliente final, Administrador del tenant y Colaborador operativo. Adicionalmente, los roles opcionales por tenant Gerente, Contador y Analista pueden existir cuando el tenant los habilite conforme a la sección 9 y a sus permisos base definidos en este PDR. El Cliente final debe crear su cuenta con nombre, apellido, correo electrónico, número de teléfono, contraseña y confirmación de contraseña, exigiendo que contraseña y su confirmación coincidan antes de crear la cuenta, y debe autenticarse con correo y contraseña para gestionar sus reservas. La recuperación de contraseña del Cliente final exige correo electrónico, código de recuperación, nueva contraseña y confirmación de nueva contraseña, exigiendo que ambos valores de contraseña coincidan antes de completar el cambio; confirmar contraseña y confirmar nueva contraseña son campos de validación del proceso correspondiente y no necesariamente credenciales persistidas de forma independiente. El Administrador del tenant tendrá control general del sistema y parametrización de descuentos; el Colaborador operativo tendrá acceso a caja, reservas, seguimiento y registro operativo sin permisos de descuento; el Administrador de plataforma tendrá gestión administrativa de tenants y soporte transversal auditado sin operar comercialmente la información de un tenant como flujo ordinario. Todo acceso debe resolverse dentro del tenant correspondiente cuando aplique y debe impedir la consulta o modificación de información de otros tenants. Todos los usuarios autenticados se rigen por la política centralizada de contraseñas y recuperación de acceso de la sección 9, que prohíbe contraseñas comunes o comprometidas, exige reemplazar en el primer acceso la credencial inicial temporal de todo usuario creado administrativamente y exige auditar todo restablecimiento de una cuenta privilegiada (decisión del equipo A4 — 2026-09-23). La administración avanzada de roles, módulos y permisos detallados más allá de estos perfiles base y roles opcionales definidos queda fuera del alcance actual.
- Escalabilidad: CONFIRMADO PARA FASE 1. La solución debe soportar como escenario inicial al menos 10 tenants activos, con hasta 20 usuarios internos por tenant, hasta 5.000 clientes registrados por tenant y, como concurrencia de referencia, 34 usuarios concurrentes dentro de un mismo tenant conforme al RNF de Rendimiento (G16). La arquitectura debe prever crecimiento de tenants y datos sin romper el aislamiento lógico por tenant.
- Privacidad y protección de información: CONFIRMADO PARA FASE 1. El sistema debe preservar la integridad de la información gestionada y respetar las políticas y normativa aplicable en Colombia para el tratamiento de la información, incluyendo datos personales, médicos o de emergencia asociados a actividades de riesgo. Se consideran datos sujetos a eliminación la información médica, el tipo de sangre, las restricciones físicas y los datos de contacto de emergencia utilizados durante la prestación del servicio. Estos datos se eliminan de los sistemas activos un año después de la finalización del servicio; para reservas canceladas, el periodo se cuenta desde su cierre definitivo, es decir, desde que se resuelven las obligaciones económicas derivadas de la reserva: cuando el tratamiento es saldo a favor, desde que ese saldo queda formalmente registrado a nombre del cliente, independientemente de cuándo se utilice; cuando es devolución, desde lo que ocurra primero entre la ejecución completada de la devolución y el vencimiento de su plazo máximo de 5 días hábiles; la devolución sigue siendo una obligación pendiente aunque el periodo de retención ya haya comenzado (L3). El uso posterior de un saldo a favor tiene un ciclo financiero independiente y no extiende el periodo de conservación (G11). La eliminación queda trazada y no implica eliminar el histórico comercial de la reserva. Los consentimientos se conservan como evidencia y no están sujetos a esta eliminación automática, sin perjuicio de la política documental que les corresponda. Las copias de seguridad pueden conservar temporalmente información eliminada hasta completar su ciclo de retención de máximo 30 días; si un respaldo es restaurado, deben reaplicarse las reglas de retención vigentes. El acceso a datos sensibles requiere el permiso Consultar datos sensibles definido en la sección 9 y queda auditado. El Administrador de plataforma no tiene acceso ordinario a estos datos; cualquier acceso excepcional requiere autorización del Administrador del tenant propietario de la información, tiene alcance limitado y temporal y queda registrado en auditoría (decisiones del equipo C4, E8, E21 y E22 — 2026-09-23). En enfoque multitenencia, estas políticas deben aplicarse sin exponer información sensible entre tenants.
- Trazabilidad y auditoría: CONFIRMADO PARA FASE 1. El sistema debe mantener auditoría sobre autenticaciones, cambios de descuentos, movimientos de caja, cancelaciones, modificaciones relevantes de reserva, cambios de estado de comprobantes y de situación financiera, cambios de tenant, accesos a información sensible y autorizaciones o ejecuciones de devolución. Cada evento auditado debe registrar como mínimo usuario, tenant cuando aplique, fecha y hora, tipo de acción, identificador del registro afectado y motivo cuando aplique. Para eventos económicos, cambios de estado, cambios de parámetros sensibles, accesos a información sensible y acciones excepcionales, la auditoría debe registrar además el valor anterior y el nuevo valor cuando corresponda, el canal o módulo desde el que se ejecutó la acción y la referencia funcional del proceso afectado.
- Disponibilidad: CONFIRMADO PARA FASE 1. La disponibilidad mensual debe ser igual o superior al 95 %, calculada por mes calendario como: disponibilidad (%) = (minutos del mes − minutos de mantenimiento programado previamente informado − minutos de indisponibilidad no programada) / (minutos del mes − minutos de mantenimiento programado previamente informado) × 100. Se considera indisponibilidad el tiempo durante el cual los flujos principales de consulta, autenticación, creación de reserva, carga de comprobantes y caja no pueden completarse (H14).
- Rendimiento: CONFIRMADO PARA FASE 1. Las operaciones evaluadas no deben superar 3 segundos en el percentil 95 de tiempo de respuesta. La validación se realiza mediante una prueba de carga automatizada y reproducible con 34 usuarios concurrentes pertenecientes a un mismo tenant, distribuidos en 30 clientes finales y 4 colaboradores operativos. El escenario incluye como operaciones representativas la consulta de tours, la creación de reservas, la carga de comprobantes, la validación de pagos y la consulta de caja, respetando los permisos de cada tipo de usuario. El criterio de aceptación es un percentil 95 de tiempo de respuesta igual o inferior a 3 segundos para las operaciones evaluadas. Los resultados deben registrar tiempos de respuesta, concurrencia y errores, y conservarse como evidencia de validación (PASS/FAIL). La prueba no implica 34 usuarios por cada tenant ni 340 usuarios concurrentes para diez tenants. Las pruebas funcionales no se utilizan como evidencia de rendimiento ni de concurrencia (decisiones del equipo M5 y E19 — 2026-09-23).
- Usabilidad: CONFIRMADO PARA FASE 1. La solución debe mantener una navegación comprensible y consistente para usuarios internos y cliente final, y en el canal digital del cliente final la experiencia debe adaptarse de manera coherente a navegador web y dispositivo móvil. Como criterio verificable, un usuario que no haya utilizado previamente Multitour debe poder completar el flujo principal de creación de una reserva sin asistencia externa, utilizando únicamente la información y ayudas disponibles en la propia interfaz (G16).
- Accesibilidad: CONFIRMADO PARA FASE 1. Las interfaces incluidas en Fase 1 deben cumplir WCAG 2.1 nivel AA. Su verificación combina una herramienta automática de accesibilidad y revisión manual de los criterios aplicables que no puedan evaluarse automáticamente (G16).
- Observabilidad: CONFIRMADO PARA FASE 1. La solución debe generar como mínimo registros trazables de errores funcionales, autenticaciones, cambios de estado, operaciones económicas y eventos de integridad operativa relevantes para soporte. Como criterio mínimo verificable, debe ser posible identificar desde registros del sistema el tenant, el actor, la acción y el momento en que ocurrió un fallo o una operación sensible incluida en la auditoría funcional.
- Compatibilidad: CONFIRMADO PARA FASE 1. El canal digital adaptable para web y móvil debe operar de forma utilizable, sin requerir una aplicación nativa independiente, como mínimo en las dos últimas versiones estables disponibles de los navegadores de escritorio y navegadores móviles definidos por el equipo para validación de Fase 1, que conforme a GAP-09 corresponden a Chrome y Safari. Como criterio mínimo verificable, los flujos principales de consulta, autenticación, creación de reserva y continuidad de pago deben poder completarse en ambos contextos de uso.
- Concurrencia: CONFIRMADO PARA FASE 1. Cuando dos o más usuarios intenten apartar o confirmar simultáneamente el mismo último cupo disponible de un recurso controlado dentro del mismo tenant, el sistema debe garantizar que solo una reserva conserve el cupo conforme a RN-RES-007 y que las demás reciban respuesta consistente de no disponibilidad o capacidad insuficiente, sin generar sobreventa.
- Mantenibilidad: CONFIRMADO PARA FASE 1. El sistema debe contar con versionamiento de código, separación clara de responsabilidades entre componentes definidos en arquitectura y documentación actualizada de cada componente que incluya como mínimo instrucciones de instalación y ejecución, arquitectura relevante, contratos, modelo y convenciones de datos, configuración requerida, pruebas y procedimiento de despliegue u operación aplicable (G16).
- Respaldo y recuperación: CONFIRMADO PARA FASE 1. Debe existir al menos un respaldo diario de la información operativa, retención mínima de 30 días, un procedimiento documentado de restauración, un RPO objetivo máximo de 24 horas y un RTO objetivo máximo de 8 horas.

Observación (GAP-08; decisiones del equipo C4 y E8 — 2026-09-23): El periodo de retención de un año se cuenta desde la finalización del servicio o, en reservas canceladas, desde su cierre definitivo. Al cumplirse, los datos sujetos a eliminación se eliminan de los sistemas activos sin intervención manual; no existe archivo restringido. Los consentimientos y el histórico comercial se conservan. Esta decisión reemplaza lo definido inicialmente en GAP-08.

Observación (GAP-09 resuelto — 2026-09-21): La carga operativa normal de referencia para Fase 1 es 4 colaboradores internos más 30 clientes simultáneos por tenant. Los navegadores validados son Chrome y Safari en sus dos últimas versiones estables al momento de la validación de Fase 1. Los criterios mínimos verificables definidos en esta sección 17 constituyen la línea base de aceptación de RNF. Los criterios funcionales se verifican mediante pruebas funcionales del equipo; el rendimiento y la concurrencia se verifican mediante pruebas de carga conforme al RNF de Rendimiento (ajustado por decisión del equipo M5 — 2026-09-23).

Estado de bloqueantes:
El estado de cierre del PDR y de sus brechas se registra únicamente en la sección 24. Las decisiones técnicas, de distribución de responsabilidades y de materialización de restricciones académicas que pasan a arquitectura o ADR no deben interpretarse como pendientes funcionales del PDR (H13).

## 18. Restricciones académicas obligatorias

Las siguientes condiciones corresponden a restricciones académicas del proyecto y no a solicitudes directas confirmadas por el cliente:

Estas restricciones no modifican por sí mismas el alcance funcional confirmado del producto. Deben tratarse como condicionantes externas del proyecto, y su justificación técnica, distribución de responsabilidades y materialización concreta deben resolverse en arquitectura o mediante ADR.

- Bases de datos obligatorias: PostgreSQL y MongoDB.
- Arquitectura frontend obligatoria: exactamente 4 Micro Frontends.
- Frameworks frontend obligatorios: Angular y React.
- Tecnologías backend obligatorias: Java y Go.

La asignación específica de responsabilidades entre Java y Go, Angular y React, PostgreSQL y MongoDB REQUIERE DEFINICIÓN DURANTE LA ETAPA DE ARQUITECTURA.

La delimitación funcional de los cuatro Micro Frontends y su distribución entre Angular y React REQUIERE DEFINICIÓN DURANTE LA ETAPA DE ARQUITECTURA.

La distribución de datos y responsabilidades entre PostgreSQL y MongoDB REQUIERE DEFINICIÓN DURANTE LA ETAPA DE ARQUITECTURA.

## 19. Restricciones de despliegue y responsabilidad de entrega

- Nota de separación producto vs arquitectura: AWS y Docker se registran aquí como restricciones previstas del proyecto y no como comportamiento funcional del producto. Su justificación y aplicación concreta deberán definirse durante arquitectura y despliegue.
- Restricción de despliegue prevista: AWS como plataforma prevista para despliegue.
- Restricción de desarrollo prevista: Docker para la etapa de desarrollo.
- Responsabilidad de entrega: El alcance del equipo del proyecto comprende la entrega del desarrollo del software.
- Responsabilidad de implementación: La implementación o puesta en operación posterior queda bajo responsabilidad de la empresa.

## 20. Supuestos y dependencias

- La documentación funcional del proyecto se considera válida siempre que no contradiga una necesidad del cliente o una regla de negocio mejor sustentada.
- Hoteles y restaurantes se mantienen dentro del documento únicamente como establecimientos asociados de carácter informativo y de contacto; el hospedaje y la alimentación no se reservan en la plataforma en Fase 1 (GAP-04).
- Travesía Natural se mantiene como tenant principal de validación funcional y demostración mientras la plataforma evoluciona para soportar múltiples operadores turísticos, sin dejar de ser uno de los tenants de la solución y no el producto completo.
- La multitenencia se asume inicialmente con aislamiento lógico por tenant, sin que este PDR cierre todavía la decisión técnica definitiva de implementación.
- Las restricciones académicas obligatorias condicionan la definición arquitectónica futura del proyecto.
- La definición definitiva de arquitectura, UX, modelo de datos, base de datos y seguridad debe respetar la línea base confirmada de RNF de la sección 17 y cualquier cambio posterior requerirá actualización formal del PDR.

## 21. Riesgos

- Riesgo de inconsistencias comerciales si la parametrización de descuentos no se gobierna adecuadamente desde el rol Administrador del tenant.
- Riesgo de incumplir restricciones académicas si no se documentan desde esta etapa.
- Riesgo de manejar información sensible de salud y emergencia sin implementar de forma consistente los criterios ya definidos de privacidad, respaldo y auditoría.
- Riesgo de dimensionar incorrectamente infraestructura, operación o seguridad si la arquitectura ignora o interpreta de forma incompleta la línea base no funcional confirmada para Fase 1.
- Riesgo de desalineación entre arquitectura y producto si el equipo modifica umbrales de seguridad, accesibilidad, disponibilidad o respaldo sin actualizar primero este PDR.
- Riesgo de fuga o cruce indebido de información entre tenants si el aislamiento de datos, consultas, reportes y permisos no se implementa de forma consistente.
- Riesgo de ambigüedad documental si parte del proyecto se sigue describiendo como una solución particular del tenant Travesía Natural y otra parte como comportamiento base de la plataforma multitenencia.
- Riesgo de sobreventa o asignación incorrecta de cupos si las reglas de apartamiento de cupo y concurrencia no se respetan de forma consistente.
- Riesgo de inconsistencias económicas si pagos, abonos, devoluciones, gastos y pagos operacionales no mantienen una semántica funcional unificada.

## 22. Criterios de aceptación

- CA-001: Debe ser posible registrar un cliente titular y asociarlo a una reserva con la información obligatoria general y, cuando aplique, con los requisitos adicionales de actividades de riesgo.
- CA-002: Debe ser posible registrar cero o varios acompañantes con datos individualizados y sin duplicidad de documento dentro de la misma reserva.
- CA-003: Debe ser posible crear una reserva como proyección comercial con servicios seleccionados, condiciones parametrizadas aplicables y valores calculados. La reserva debe quedar asociada a una única salida y no debe poder crearse si la salida no tiene capacidad efectiva disponible; esa verificación no aparta cupo.
- CA-004: Debe existir información base utilizable de atractivos y transporte para soportar el registro de reservas y el control operacional, permitiendo como mínimo registrar, consultar, actualizar e inactivar registros.
- CA-005: Deben quedar visibles y persistidos el valor proyectado y el valor final de la reserva, incluyendo el cálculo del transporte por persona según el tour correspondiente.
- CA-005A: Desde el canal digital adaptable para web y móvil el cliente final debe poder visualizar descuentos vigentes aplicables a tours u otros servicios antes de confirmar la reserva.
- CA-005B: Al momento de cobrar o pagar deben aplicarse automáticamente los descuentos vigentes y, cuando corresponda, los descuentos adicionales autorizados, dejando visible el valor final de cobro, el orden de aplicación y el motivo del descuento adicional cuando exista.
- CA-005C: Debe ser posible modificar una reserva antes de la ejecución cuando la regla parametrizada lo permita, recalculando valores, descuentos, disponibilidad y saldo resultante con trazabilidad del cambio. Si la modificación agrega viajeros a una reserva con cupo, los cupos adicionales deben asignarse en ese momento o la modificación no debe realizarse si no hay capacidad.
- CA-006: Si la salida no tiene capacidad efectiva suficiente para la cantidad total de personas, el sistema no debe permitir crear la reserva ni apartar o asignar cupo, e informar la falta de disponibilidad. Cuando el transporte sea obligatorio o esté incluido, la capacidad efectiva debe considerar la capacidad de los vehículos asignados, sin permitir sobreventa por falta de transporte. Un primer pago mediante saldo a favor debe verificar disponibilidad y apartar el cupo en una única operación, o no consumir el saldo si no hay capacidad.
- CA-007: Debe quedar diferenciada la reserva original de la ejecución real de servicios prestados y no prestados.
- CA-008: Cuando existan servicios no prestados, estos deben quedar visibles con su causal de seguimiento.
- CA-008A: Una vez la reserva se encuentre en estado En ejecución, el sistema no debe permitir ajustes ordinarios sobre tour, transporte ni cantidad de personas. Solo debe permitir registrar cancelación extraordinaria por emergencia con justificación y decisión posterior de reagendamiento o devolución.
- CA-009: Debe ser posible registrar o calcular costos operacionales sin confundirlos con el valor comercial vendido.
- CA-010: Debe ser posible gestionar una única caja por día calendario del tenant con base de efectivo físico parametrizable por el Administrador del tenant, ingresos, pagos, gastos, devoluciones, cierre, reapertura con motivo e histórico, y obtener la consolidación mensual. La apertura, el cierre y la reapertura solo deben poder realizarlos el Administrador del tenant o un Colaborador operativo con el permiso Gestionar caja, con registro de usuario, fecha, hora y motivo de reapertura. En el cierre, las entradas y salidas deben mostrarse por medio de pago, el efectivo esperado debe calcularse como la base más las entradas en efectivo menos las salidas en efectivo, y las transferencias deben conciliarse por separado. Una transferencia validada después del cierre en el mismo día debe registrarse como movimiento no efectivo posterior al cierre sin reabrir la caja; si se valida otro día, debe pertenecer a la caja de ese día, que se crea automáticamente si no existe, sin base y sin modificar el efectivo esperado; nunca debe existir más de una caja por tenant y fecha.
- CA-011: Debe ser posible consultar la información de reservas y ejecución de forma que se distingan acompañantes, servicios reservados, servicios prestados, servicios no prestados y sus causales registradas. Para Fase 1, el dashboard diario debe mostrar de forma obligatoria reservas creadas del día, reservas pendientes de pago, reservas confirmadas con saldo, reservas confirmadas, reservas canceladas y salidas próximas a ejecutar; el indicador de pendientes de pago no debe incluir reservas ya confirmadas con saldo.
- CA-012: Debe ser posible consultar la información consolidada de costos operacionales y caja para control interno del negocio, incluyendo ventas por día, caja, gastos, devoluciones y cancelaciones con su causal. Para Fase 1, el reporte administrativo mensual debe mostrar de forma obligatoria periodo reportado, ingresos del periodo, pagos operacionales del periodo, gastos del periodo, devoluciones efectivamente realizadas en el periodo, total consolidado de caja del periodo, cancelaciones registradas en el periodo y costos operacionales registrados en el periodo.
- CA-013: El cliente final debe poder consultar desde un canal digital adaptable para web y móvil los tours disponibles y la información y datos de contacto de hoteles y restaurantes asociados, para iniciar una reserva de tour desde cualquier ubicación.
- CA-014: El cliente final debe poder crear cuenta, iniciar sesión, recuperar contraseña y crear una reserva desde un canal digital adaptable para web y móvil con datos obligatorios, valores calculados y descuentos visibles cuando apliquen. La consulta de oferta no requiere autenticación previa, pero la confirmación y la gestión posterior de la reserva deben requerir autenticación del cliente final. Para verificar la creación de cuenta, deben quedar registrados como obligatorios nombre, apellido, correo electrónico, número de teléfono, contraseña y confirmación de contraseña, coincidiendo contraseña y su confirmación antes de crear la cuenta. Para verificar la recuperación de contraseña, el flujo debe exigir correo electrónico, código de recuperación, nueva contraseña y confirmación de nueva contraseña, coincidiendo ambos valores de contraseña antes de completar el cambio, dentro del tenant previamente determinado.
- CA-015: Debe ser posible gestionar reservas pendientes de pago con plazo inicial contado desde la creación de la reserva, una única ampliación concedida por un Colaborador operativo o un Administrador del tenant, y cancelación automática con liberación de cupo al vencer el plazo total sin pago validado ni comprobante En validación; ningún plazo debe superar la hora programada de inicio de la salida y una respuesta del cliente sin pago no debe suspender el plazo. Al registrarse el primer pago de una reserva sin cupo, el sistema debe validar la disponibilidad, apartar el cupo si existe e impedir la operación si no existe; los pagos del saldo no deben validar, asignar ni liberar cupo. Un comprobante En validación debe impedir la cancelación automática por vencimiento y, si permanece más de 24 horas sin decisión, debe marcarse como revisión vencida y generar una alerta a todos los usuarios con el permiso Validar comprobantes. Un comprobante rechazado después del vencimiento debe cancelar la reserva. Desde la hora programada de inicio de la salida no debe aceptarse ningún pago ni comprobante asociado a ella.
- CA-015A: Debe ser posible registrar pagos por transferencia o en efectivo, comprobantes, validaciones, rechazos, devoluciones y aplicaciones de saldo a favor asociados a una reserva, manteniendo visible el saldo pendiente. Cada comprobante debe tener su propio estado (En validación, Aprobado o Rechazado); el rechazo de uno no debe modificar otros pagos validados, y un comprobante cargado por un usuario interno en nombre del cliente debe registrar quién lo cargó. Al aprobar un comprobante debe registrarse el monto verificado, que es el que se reconoce; si supera el valor pendiente, solo debe aplicarse lo necesario y el excedente debe registrarse como saldo a favor. La reserva debe pasar a Confirmada cuando la suma de valores validados alcance el 100 % del valor exigible en pago total o, en abono, como mínimo el abono mínimo calculado sobre el valor final. Una reserva confirmada con saldo o diferencia pendiente debe cancelarse automáticamente si vence su plazo sin pago completo ni comprobante En validación, o al alcanzarse la hora programada de inicio de la salida con pagos pendientes. Para transferencias, el comprobante debe aceptarse en PDF, JPG, JPEG o PNG de hasta 5 MB, rechazando con mensaje claro los archivos que no cumplan, y no debe registrarse como ingreso de caja hasta su validación.
- CA-015B: Debe ser posible calcular, autorizar, registrar y ejecutar devoluciones monetarias con causal, responsable, monto, relación con la reserva y relación con el movimiento de caja correspondiente. Cuando una reserva se cancele por incumplimiento del pago con valores validados, el Administrador del tenant debe poder registrar dentro de 24 horas corridas la decisión entre devolución del 100 % o saldo a favor por el total; el plazo debe contarse desde que el dinero queda reconocido; si no decide, el sistema debe registrar la devolución del 100 % como pendiente de ejecución y notificar a todos los Administradores del tenant activos por alerta en el panel y correo electrónico. Cuando la cancelación se deba a una causa no atribuible al cliente, la devolución debe ser del 100 % de los valores pagados y validados. Toda devolución determinada debe ejecutarse en un máximo de 5 días hábiles; si no, debe marcarse como vencida y alertar a los Administradores del tenant activos. Un excedente por modificación que reduce el valor debe tratarse con la misma decisión de 24 horas y devolución por defecto. El saldo a favor debe poder aplicarse a una nueva reserva del mismo tenant como pago validado y devolverse a solicitud del cliente con autorización del Administrador del tenant.
- CA-015C: Debe ser posible reagendar una reserva o servicio afectado, conservando trazabilidad con la reserva original, disponibilidad recalculada y saldo resultante. Un cambio exclusivo de fecha debe registrarse sobre la misma reserva con su historial, solo si hay disponibilidad en la nueva salida y no existe un comprobante En validación, trasladando el cupo en una única operación; solo un cambio de servicio principal o de condición comercial debe generar una nueva reserva vinculada. La reprogramación por emergencia no debe quedar bloqueada por la política de cambios del cliente y debe registrar la aceptación del cliente cuando implique una nueva fecha. Si la reprogramación se debe a una causa no atribuible al cliente y el cliente no la acepta, la reserva debe cancelarse con devolución del 100 %. Si el Administrador del tenant no propone una nueva salida dentro de las 24 horas corridas siguientes a la cancelación o interrupción, o no existe salida disponible, la reserva debe cancelarse con devolución del 100 %. Durante el plazo de respuesta del cliente, los plazos económicos deben permanecer congelados. La propuesta solo debe poder enviarse si la nueva salida tiene capacidad suficiente, y los cupos de los viajeros deben quedar apartados en ella hasta que el cliente acepte (se asocian a la reserva), rechace, venza el plazo o llegue la hora programada de la nueva salida (se liberan). El cliente debe disponer de hasta 72 horas corridas desde la notificación para responder, sin superar la hora programada de la nueva salida; si no responde, la reserva debe cancelarse con devolución del 100 %.
- CA-016: Toda operación funcional del sistema debe ejecutarse dentro de un tenant identificado y no debe permitir que usuarios, reservas, clientes, catálogos, costos, caja o reportes de un tenant se mezclen con los de otro.
- CA-017: Debe ser posible que el Administrador de plataforma cree un tenant con sus datos obligatorios, su zona horaria oficial y su primer Administrador, y que lo inactive o reactive con motivo registrado. Al inactivarlo, deben revocarse de inmediato los accesos de operación normal de todos los usuarios del tenant, sin bloquear al Administrador de plataforma ni otorgarle acceso a los datos del tenant; el Administrador del tenant debe conservar solo un acceso restringido para gestionar obligaciones pendientes y registrar las devoluciones y movimientos financieros necesarios, con auditoría; no deben aceptarse nuevas reservas, pagos ni ventas, y deben suspenderse todos los plazos operativos y sus cancelaciones automáticas, pero no los temporizadores de seguridad. Al reactivarlo, cada plazo debe continuar con el tiempo restante y los usuarios inactivados individualmente deben seguir inactivos. Con el acceso restringido, el Administrador del tenant solo debe poder registrar el cierre o la interrupción de salidas que ya estaban En ejecución. Si la hora programada de una salida se alcanza con el tenant inactivo, la salida debe cancelarse automáticamente sin cancelar reservas por incumplimiento de pago, y no debe reactivarse al reactivar el tenant.
- CA-018: Debe ser posible que un Administrador del tenant registre usuarios internos (Administradores del tenant adicionales, Gerentes, Contadores, Analistas y Colaboradores operativos) con nombre completo, correo electrónico, contraseña inicial y confirmación coincidentes que cumplan la política centralizada de contraseñas. La credencial temporal debe vencer a las 72 horas y, al usarla por primera vez, el usuario debe establecer su propia contraseña antes de acceder normalmente. Si vence, la cuenta debe seguir registrada y el administrador correspondiente debe poder emitir una nueva credencial que invalide la anterior, con trazabilidad. El registro debe bloquearse si el correo ya existe en el mismo tenant, activo o inactivo, indicando la reactivación cuando el usuario existente esté inactivo. Debe ser posible inactivar y reactivar usuarios con trazabilidad, un usuario inactivo no debe poder autenticarse y el sistema no debe permitir inactivar al último Administrador del tenant activo.
- CA-019: Debe ser posible que el Administrador del tenant registre, inactive y reactive establecimientos asociados visibles solo dentro de su tenant, sin que el Colaborador operativo tenga acceso a estas operaciones.
- CA-020: Toda contraseña de cualquier usuario autenticado debe cumplir la política centralizada, rechazando contraseñas comunes o comprometidas. Todo usuario debe poder recuperar su acceso mediante un código o enlace enviado a su correo, de un solo uso y con vigencia máxima de 30 minutos, estableciendo una nueva contraseña sin que el sistema muestre la anterior; al completarse, deben invalidarse las sesiones anteriores. Todo restablecimiento de una cuenta administrativa debe quedar auditado y notificarse al usuario.
- CA-021: La información médica, el tipo de sangre, las restricciones físicas y los contactos de emergencia de una reserva deben eliminarse de los sistemas activos al cumplirse un año desde la finalización del servicio o desde el cierre definitivo de una reserva cancelada, conservando los consentimientos y el histórico comercial. Solo los usuarios con el permiso Consultar datos sensibles deben poder consultarlos, con auditoría; Gerente, Contador y Analista no deben poder hacerlo. El Administrador de plataforma no debe poder consultar datos de un tenant sin una autorización del Administrador del tenant de máximo 24 horas o un acceso de emergencia justificado y auditado. Al usarse un acceso de emergencia, todos los Administradores del tenant activos deben recibir un correo al iniciarse el acceso y otro al finalizar, con el tenant, el Administrador de plataforma, el motivo, la fecha y hora de inicio, el alcance y, en el de finalización, la fecha y hora de finalización, sin datos sensibles; un fallo del correo debe quedar registrado sin invalidar el acceso.
- CA-022: El cliente final debe ver en su panel el estado actualizado de sus reservas, pagos y comprobantes, y recibir por correo electrónico notificaciones de aprobación o rechazo de comprobantes, confirmación de reserva, cancelación por incumplimiento de pago, devolución procesada, registro de saldo a favor y cancelación o reprogramación de su salida por una causa no atribuible al cliente. Una falla en la entrega del correo no debe modificar el estado registrado.
- CA-023: Debe ser posible que el Administrador del tenant programe salidas con fecha, hora de inicio y hora de finalización estimada, les asigne vehículos y cancele salidas Programadas. La capacidad efectiva de una salida con transporte obligatorio debe ser el menor valor entre la capacidad del tour y la suma de las capacidades de los vehículos asignados; el sistema no debe permitir asignar un mismo vehículo a salidas con intervalos programados superpuestos ni reducir la capacidad del tour o del transporte por debajo de los cupos ya apartados o asignados. Al alcanzarse la hora programada de inicio, el sistema debe bloquear pagos y comprobantes de la salida y cancelar las reservas con pagos pendientes o comprobantes En validación, sin depender del registro del inicio real. El Administrador del tenant o un Colaborador operativo con el permiso Gestionar ejecución de salidas deben poder registrar el inicio real y la finalización: al registrar el inicio, solo las reservas Confirmadas con Pago completo deben pasar a En ejecución; al registrar la finalización, las reservas En ejecución deben pasar a Finalizada. Ante una interrupción no atribuible al cliente, una reserva En ejecución debe poder volver a Confirmada con una nueva salida si el cliente acepta, o cancelarse con devolución del 100 % si no acepta.
- CA-024: Toda cuenta de Cliente final debe quedar activada solo después de verificar su correo electrónico. Al registrar manualmente un cliente, el sistema debe buscar primero en el mismo tenant una cuenta o registro con el mismo correo normalizado y verificado y vincularse a él en lugar de crear un duplicado. Cuando un cliente registrado manualmente cree una cuenta con el mismo correo, el sistema debe vincularla al verificarse el correo, conservando reservas, pagos, saldos e histórico, sin crear un segundo registro de cliente.
- CA-025: El abono mínimo debe calcularse sobre el valor final de la reserva después de descuentos. Si una modificación incrementa el valor de una reserva confirmada, esta debe conservar su estado y generar una diferencia pendiente; si lo reduce por debajo de lo validado, el excedente debe resolverse mediante devolución o saldo a favor.
- CA-026: El sistema no debe permitir que un tenant con la transferencia habilitada como medio de pago quede sin al menos un usuario activo con el permiso Validar comprobantes. Este criterio se cumple por diseño mientras exista al menos un Administrador del tenant activo, que tiene ese permiso por su perfil y no puede quedar inactivo como último administrador (E9, J5).
- CA-027: Toda fecha y hora de la operación de un tenant (salidas, cajas, validaciones, vencimientos, reportes e históricos) debe registrarse e interpretarse en la zona horaria oficial del tenant, y un cambio de zona horaria debe aplicarse solo a operaciones futuras.
- CA-028: Cuando durante una salida iniciada un cliente o una persona de su reserva no pueda continuar por una emergencia personal, debe poder registrarse como novedad de ejecución sin generar una devolución automática.
- CA-029: Una salida debe iniciar en estado Programada y solo debe poder pasar a En ejecución al registrarse su inicio real, a Finalizada al registrarse su finalización y a Cancelada antes de su inicio, por decisión del Administrador del tenant o automáticamente cuando su hora programada se alcanza con el tenant inactivo; una salida Cancelada no debe reactivarse. Al alcanzarse la hora programada de inicio sin registro, debe generarse una alerta a los Administradores del tenant activos y a los usuarios con el permiso Gestionar ejecución de salidas; al superarse la hora de finalización estimada sin cierre, la salida debe quedar marcada como pendiente de regularización sin cerrarse automáticamente, y debe poder regularizarse como ejecutada y finalizada, cancelada o interrumpida con la hora real, el responsable y la fecha del registro.
- CA-030: El Administrador del tenant debe disponer por su perfil de los permisos Validar comprobantes, Gestionar caja y Gestionar ejecución de salidas, y solo debe poder consultar datos sensibles si tiene asignado explícitamente el permiso Consultar datos sensibles, aunque se lo haya asignado a sí mismo; la asignación y cada consulta deben quedar auditadas.
- CA-031: Debe ser posible que un Colaborador operativo o el Administrador del tenant registren la cancelación de una reserva solicitada por el cliente; la reserva debe pasar a Cancelada sin posibilidad de reactivación, liberar su cupo y, si existen valores que correspondan al cliente, el Administrador del tenant debe poder decidir en 24 horas corridas entre devolución del 100 % o saldo a favor del 100 %, con devolución del 100 % por defecto si no decide.

## 23. Trazabilidad

| ID | Objetivo / Proceso | RF / RN relacionado | Criterio de aceptación | Estado |
| --- | --- | --- | --- | --- |
| TRA-001 | Centralizar información base para reservas | RF-001, RN-CLI-001 | CA-001 | CONFIRMADO |
| TRA-002 | Gestionar acompañantes dentro de la reserva | RF-002, RN-CLI-002, RN-RES-005 | CA-002 | CONFIRMADO |
| TRA-003 | Disponer de información base operativa para reservas | RF-004, RN-ATR-001, RN-ALI-001, RN-TRA-001, RN-TRA-002 | CA-004 | CONFIRMADO |
| TRA-004 | Crear reserva como proyección comercial | RF-003, RN-RES-001, RN-RES-003, RN-RES-004, RN-RES-007, RN-RES-010 | CA-003, CA-005 | CONFIRMADO |
| TRA-004D | Modificar reserva antes de ejecución | RF-003A, RN-RES-004, RN-RES-006, RN-TRA-002 | CA-005C | CONFIRMADO |
| TRA-004C | Calcular valor proyectado y valor final | RF-005, RN-RES-001, RN-RES-002, RN-RES-003, RN-TRA-002 | CA-005 | CONFIRMADO |
| TRA-004A | Visualizar descuentos vigentes en la reserva | RF-005A, RN-RES-002, RN-RES-003 | CA-005A | CONFIRMADO |
| TRA-004B | Aplicar descuentos automáticos al cobro o pago | RF-005B, RN-RES-002, RN-RES-003 | CA-005B | CONFIRMADO |
| TRA-005 | Validar cupo disponible de la salida | RF-006, RN-RES-007, RN-SAL-001 | CA-006 | CONFIRMADO |
| TRA-006 | Diferenciar reserva y ejecución real | RF-007, RN-EJE-001, RN-EJE-002, RN-EJE-003, RN-EJE-005 | CA-007, CA-008, CA-028 | CONFIRMADO |
| TRA-007 | Restringir ajustes durante la ejecución | RF-008, RN-EJE-002, RN-EJE-004 | CA-008A | CONFIRMADO |
| TRA-008 | Controlar costos operacionales | RF-009, RN-ATR-001, RN-OPE-001 | CA-009 | CONFIRMADO |
| TRA-009 | Consolidar caja interna | RF-010, RN-CAJ-001 | CA-010 | CONFIRMADO |
| TRA-010 | Consultar reservas y ejecución | RF-011, RN-EJE-005, RN-CAJ-001 | CA-011 | CONFIRMADO |
| TRA-011 | Consultar costos operacionales y caja | RF-012, RN-OPE-001, RN-CAJ-001 | CA-012 | CONFIRMADO |
| TRA-012 | Consultar tours y establecimientos asociados desde canal digital adaptable para web y móvil | RF-013, RN-ATR-001, RN-ASO-001, RN-RES-002 | CA-013 | CONFIRMADO |
| TRA-013 | Crear reserva desde canal digital adaptable para web y móvil | RF-014, RN-CLI-001, RN-CLI-002, RN-RES-001, RN-RES-003, RN-RES-004, RN-RES-005, RN-RES-007 | CA-014 | CONFIRMADO |
| TRA-014 | Gestionar reservas pendientes de pago | RF-015, RN-RES-004, RN-RES-006 | CA-015 | CONFIRMADO |
| TRA-014A | Registrar y validar pagos de reserva | RF-015A, RN-RES-004, RN-RES-006, RN-RES-006A, RN-RES-006C, RN-CAJ-001 | CA-015A, CA-025, CA-026 | CONFIRMADO |
| TRA-014B | Gestionar devoluciones de reserva | RF-015B, RN-RES-008, RN-CAJ-001 | CA-015B | CONFIRMADO |
| TRA-014C | Reagendar reserva o servicio afectado | RF-015C, RN-EJE-006, RN-RES-008 | CA-015C | CONFIRMADO |
| TRA-015 | Aislar la información y operación por tenant | RF-016, RF-017, RNF de seguridad, privacidad y auditoría | CA-016 | CONFIRMADO |
| TRA-016 | Gestionar tenants de la plataforma | RF-016, Regla operativa mínima de tenant (sección 9) | CA-017, CA-027 | CONFIRMADO |
| TRA-017 | Gestionar usuarios internos del tenant | RF-017, Gestión de usuarios internos del tenant (sección 9) | CA-018, CA-030 | CONFIRMADO |
| TRA-018 | Gestionar establecimientos asociados | RF-018, RN-ASO-001 | CA-019 | CONFIRMADO |
| TRA-019 | Gestionar credenciales y recuperación de acceso | Política centralizada de contraseñas (sección 9), RNF de seguridad | CA-020 | CONFIRMADO |
| TRA-020 | Retener y eliminar datos sensibles | RNF de privacidad y protección de información | CA-021 | CONFIRMADO |
| TRA-021 | Notificar al cliente final | RF-019 | CA-022 | CONFIRMADO |
| TRA-022 | Programar y ejecutar salidas | RN-SAL-001, RN-EJE-001, RF-006, RF-007, RF-020 | CA-023, CA-029 | CONFIRMADO |
| TRA-023 | Vincular la identidad del cliente | RF-001, Regla base de identidad del cliente entre tenants (sección 9) | CA-024 | CONFIRMADO |
| TRA-024 | Cancelar reserva a solicitud del cliente | RF-021, RN-RES-008 | CA-031 | CONFIRMADO |

## 24. Estado de cierre documental

Las brechas identificadas durante la revisión se encuentran en proceso de incorporación y validación. Las decisiones adoptadas están registradas en las secciones 24.2 y 24.3. El cierre definitivo queda sujeto a una auditoría final de consistencia y trazabilidad sin decisiones pendientes.

## 24.1 Definiciones de cierre para Fase 1

- Una vez superada la auditoría final de consistencia y trazabilidad sin decisiones pendientes, esta versión 1.9 del 2026-09-23 se declarará como línea base funcional final de Fase 1 para la entrega académica.
- Este documento queda listo para ser usado como referencia de alineación del repositorio documental del proyecto, sin implicar por sí mismo que dicha alineación ya fue ejecutada.
- La alineación posterior del repositorio documental deberá respetar esta identidad de producto: Multitour como producto y Travesía Natural como tenant principal de validación y demostración.
- Los roles opcionales por tenant como Gerente, Contador y Analista pueden habilitarse según la necesidad de cada tenant. Sus permisos base quedan definidos en este PDR, pero su uso efectivo depende de la decisión de cada tenant dentro de su propia operación.
- En Fase 1, la implementación de roles opcionales por tenant se considera requerida únicamente para los tenants que decidan utilizarlos.
- Las decisiones técnicas que el documento deriva a arquitectura, despliegue o ADR no reabren el alcance funcional de este PDR; solo materializan esta línea base en una solución implementable.

## 24.2 Registro de pendientes cerrados en la versión 1.9

| GAP | Tema | Ubicación en este PDR |
| --- | --- | --- |
| GAP-01 | Registro, reglas de contraseña, duplicado y recuperación de usuarios internos | Sección 9 (Gestión de usuarios internos del tenant), RF-017, CA-018 |
| GAP-02 | Comprobante de pago por transferencia (formato actualizado por M6: PDF, JPG, JPEG o PNG de hasta 5 MB) | RF-015A, CA-015A |
| GAP-03 | Confirmación de reserva con abonos parciales | RN-RES-004 |
| GAP-04 | Hoteles y restaurantes como establecimientos asociados informativos; transporte incluido en el tour | Sección 11, RN-ASO-001, RN-TRA-001, RF-006, RF-013, RF-018, políticas de cupo (sección 15) |
| GAP-05 | Vencimiento con comprobante En validación y tratamiento de valores abonados | RN-RES-006C, sección 15 |
| GAP-06 | Revocación de accesos al inactivar un tenant | Sección 9 (Regla operativa mínima de tenant), RF-016, CA-017 |
| GAP-07 | Cambio exclusivo de fecha de la reserva | RN-EJE-006 |
| GAP-08 | Periodo de retención y eliminación de datos sensibles | Sección 17 (Privacidad), CA-021 |
| GAP-09 | Carga normal de referencia y navegadores validados | Sección 17 (Rendimiento y Compatibilidad) |
| GAP-10 | Reactivación de colaboradores y ciclo de vida de establecimientos asociados | Sección 9, RN-ASO-001, RF-017, RF-018 |
| GAP-11 | Cálculo del total mensual de caja | RN-CAJ-001 |

## 24.3 Decisiones del equipo aplicadas en la versión 1.9 (2026-09-23)

| ID | Tema | Decisión | Ubicación en este PDR |
| --- | --- | --- | --- |
| C1 (ajustada por E12) | Hospedaje, alimentación y transporte | Hoteles y restaurantes son solo informativos y de contacto; la comida incluida forma parte del tour; el transporte lo presta el operador y su capacidad restringe el cupo de la salida | Sección 11, RF-006, RF-013, RN-ALI-001, RN-TRA-001, RN-ASO-001, sección 15 |
| C2 (ajustada por E7 y E25) | Cambio de fecha | Un cambio exclusivo de fecha se registra siempre sobre la misma reserva | RF-015C, RN-EJE-006, sección 16, CA-015C, glosario |
| C3 (ajustada por E5 y E14) | Comprobante En validación al vencer el plazo | No se cancela y conserva cupo; revisión máxima de 24 horas con alerta prioritaria al Administrador del tenant; sin comprobante dentro del plazo se cancela y libera cupo | RN-RES-006, RN-RES-006C, sección 15, sección 16, CA-015 |
| C4 (ajustada por E8, G11 y L3) | Datos sensibles | Máximo un año desde la finalización del servicio o el cierre definitivo; eliminación definitiva conservando el histórico comercial; sin acceso ordinario del Administrador de plataforma | Sección 9, sección 17, CA-021 |
| C5 (ajustada por E3 y H12) | Confirmación con abonos | Pago total confirma al 100 %; abono confirma con el abono mínimo; estados de pago Abono recibido y Pago completo | RN-RES-004, RN-RES-006A, RN-RES-006B, RN-RES-006D, sección 16, CA-015A, glosario |
| A4 (ajustada por D3 y E20) | Contraseñas | Política centralizada para todos los usuarios; credencial inicial temporal; recuperación para todos, con auditoría y notificación en cuentas administrativas (ver D3 y E20) | Sección 9, RF-017, sección 17, CA-018, CA-020 |
| A5 | Correo duplicado | Correo único por tenant sin importar el estado; se ofrece reactivar al colaborador inactivo | Sección 9, RF-017, CA-018 |
| A6 (ajustada por E6, E26, G4 e I1) | Tenant inactivo | Se revocan todas las sesiones del tenant; las reservas Pendientes de pago se suspenden y conservan su tiempo restante | Sección 9, RF-016, sección 16, CA-017 |
| M1 (ajustada por E13, G13 y L10) | Alcance de la caja | La caja consolida todos los medios de pago; la base es efectivo físico; el cierre discrimina por medio y concilia el efectivo aparte | Proceso 12.4, RF-010, RN-CAJ-001, sección 16, CA-010 |
| M5 (ajustada por E19) | Verificación de rendimiento | Pruebas de carga con 34 usuarios concurrentes y percentil 95 igual o inferior a 3 segundos | Sección 17 |
| M6 | Formato del comprobante | PDF, JPG, JPEG o PNG de hasta 5 MB, con validación y mensaje claro | RF-015A, CA-015A |
| D1 (ajustada por E16) | Abono de reserva cancelada por vencimiento | Solo devolución o saldo a favor; se elimina otra condición comercial | RN-RES-006C, sección 15 |
| D2 | Contraseña del primer Administrador del tenant | Temporal, con cambio obligatorio en el primer inicio de sesión | Sección 9, RF-016 |
| D3 | Recuperación de cuentas administrativas | Código o enlace temporal de un solo uso, con expiración, auditoría, invalidación de sesiones y notificación; multifactor posterior a Fase 1 | Sección 9 |
| D4 (ajustada por G1 y H1) | Plazo del saldo pendiente | Definido por el tenant antes del inicio del servicio; el saldo debe estar pagado antes de la ejecución | RN-RES-004, sección 15, sección 16 |
| D5 (ajustada por E2 y K3) | Cupo al presentar el comprobante | Se valida disponibilidad y se aparta el cupo; sin disponibilidad se impide la operación | RN-RES-007, RN-RES-006C, sección 15 |
| D6 (ajustada por E14) | Comprobante sin decisión por más de 24 horas | Revisión vencida con alerta prioritaria en el panel del Administrador del tenant | RN-RES-006C, CA-015 |
| D7 | Nombre del producto y ortografía | Multitour como nombre oficial; texto con tildes y eñe sin modificar identificadores técnicos | Todo el documento |
| D8 | Nombre del estado del comprobante | Se conserva En validación; no se usa En revisión como estado | RN-RES-006A, sección 16 |
| D9 | Pago en efectivo | La promesa de pago no confirma; el pago completo en sitio queda fuera de Fase 1 | RN-RES-004 |
| E1 | Saldo vencido | Cancelación automática y liberación de cupo; comprobante En validación la mantiene vigente; valores abonados en tratamiento pendiente | RN-RES-004, RN-RES-006C, sección 16, CA-015A |
| E2 (ajustada por K3) | Apartamiento de cupo | Solo con el primer pago de una reserva sin cupo; los pagos del saldo no tocan el cupo; reemplaza las políticas de cupo configurables | RN-RES-007, sección 15, CA-015 |
| E3 | Estados de pago | Estado por comprobante (En validación, Aprobado, Rechazado) separado de la situación financiera de la reserva | RN-RES-006A, sección 16, glosario |
| E4 | Tipo y medio de pago | Tipo: pago total o abono; medio: transferencia o efectivo; plazos asociados al tipo | RN-RES-004, sección 11, sección 15 |
| E5 (ajustada por G18) | Rechazo después del vencimiento | Cancelación automática sin plazo adicional ni reactivación manual | RN-RES-006, RN-RES-006C, sección 16 |
| E6 (ajustada por L5) | Reservas confirmadas con tenant inactivo | El Administrador del tenant contacta a los clientes; reprogramación o devolución; acceso restringido | Sección 9, RF-016 |
| E7 | Reprogramación por emergencia | Exenta de las restricciones de la política de cambios; requiere aceptación del cliente | RN-EJE-002, RN-EJE-006, RF-015C, CA-015C |
| E8 | Datos sensibles | Lista de datos eliminables, cierre definitivo, consentimientos conservados, respaldos de 30 días | Sección 17, CA-021 |
| E9 | Usuarios internos | Los Administradores del tenant gestionan todos los usuarios internos con reglas comunes; múltiples Administradores del tenant; no se puede dejar al tenant sin Administrador del tenant | Sección 9, RF-017, CA-018 |
| E10 | Notificaciones al cliente | Panel como fuente principal y correos transaccionales mínimos en Fase 1 | RF-019, CA-022, sección 11 |
| E11 (ajustada por H9 y L4) | Inicio y fin de salida | Registrados por un Colaborador operativo con el permiso Gestionar ejecución de salidas; cambian de estado las reservas de la salida | RN-EJE-001, sección 16, CA-023 |
| E12 | Salida | Tour en fecha y hora; capacidad efectiva con vehículos acumulables y sin superposición | RN-SAL-001, RN-TRA-001, CA-023 |
| E13 (ajustada por G13 y L10) | Caja | Entradas y salidas por medio de pago; efectivo esperado; transferencias por fecha de validación; apertura y cierre por Colaboradores autorizados | RN-CAJ-001, RF-010, sección 16, CA-010 |
| E14 | Revisión de comprobantes | 24 horas corridas; cualquier usuario con permiso; alerta a todos los autorizados; al menos un validador si hay transferencias | Sección 9, RN-RES-006C, CA-015 |
| E15 (ajustada por G5) | Plazo de pago | Desde la creación; una única ampliación registrada; la respuesta sin pago no suspende el plazo | RN-RES-006, RF-015, CA-015 |
| E16 (ajustada por G7, H4 y L7) | Tratamiento de valores abonados | Decisión en 24 horas corridas entre devolución del 100 % o saldo a favor total | RN-RES-006C, RF-015B, CA-015B |
| E17 | Saldo a favor | Sin vencimiento; aplicable como pago validado; devolvible con autorización; no transferible entre tenants | RN-RES-009, CA-015B |
| E18 (ajustada por L6 y L7) | Abono mínimo | Sobre el valor final; el incremento posterior no quita la confirmación | RN-RES-004, RF-003A |
| E19 | Prueba de carga | 34 usuarios de un mismo tenant; cinco operaciones representativas; p95 igual o inferior a 3 segundos | Sección 17 |
| E20 | Tiempos de recuperación | Códigos y enlaces de 30 minutos y un solo uso; credenciales temporales de 72 horas | Sección 9, CA-018, CA-020 |
| E21 | Acceso del Administrador de plataforma | Autorización del Administrador del tenant por máximo 24 horas; acceso de emergencia excepcional auditado | Sección 9, sección 17 |
| E22 | Acceso a datos sensibles | Permiso específico; Gerente, Contador y Analista sin acceso | Sección 9, sección 17, CA-021 |
| E23 | Dashboard | Indicadores separados de pendientes de pago y confirmadas con saldo | RF-011, CA-011 |
| E24 (ajustada por L9) | Identidad del cliente | Vinculación por correo verificado; coexistencia de roles sin mezclar permisos | Sección 9, RF-001 |
| E25 | Cambio de fecha con pagos | Bloqueado con comprobante En validación; traslado de cupo en una única operación | RN-EJE-006, RF-015C, CA-015C |
| E26 (ajustada por I1 y L5) | Accesos con tenant inactivo | Revocación para todos los usuarios del tenant; acceso restringido del Administrador del tenant; el Administrador de plataforma no se bloquea | Sección 9, RF-016, sección 16, CA-017 |
| G1 (ajustada por H1) | Plazos frente al inicio de la salida | Ningún plazo supera el inicio de la salida; al iniciarla se cancelan las reservas con pagos pendientes o comprobantes En validación; no hay pagos después del inicio | RN-RES-006, RN-RES-004, RN-EJE-001, sección 16, CA-015, CA-023 |
| G2 | Reserva y salida | Cada reserva corresponde a una única salida | RN-RES-010, RF-003, RF-014, glosario |
| G3 | Programación de salidas | Fecha, hora de inicio y hora de finalización estimada; las programa el Administrador del tenant; no se reduce la capacidad por debajo de lo apartado | RN-SAL-001, RF-020, CA-023 |
| G4 | Plazos y caja con tenant inactivo | Se suspenden todos los plazos operativos, no los de seguridad; el Administrador del tenant registra devoluciones y movimientos necesarios | Sección 9, RF-016, RN-CAJ-001, CA-017 |
| G5 | Actores de acciones autorizadas | Colaborador o Administrador del tenant amplían plazo, registran efectivo y cargan comprobantes; solo el Administrador del tenant decide el tratamiento; cuatro permisos especiales | Sección 9, RN-RES-006, RN-RES-006C, RN-RES-006D, RF-015A, sección 15 |
| G6 | Monto del comprobante | Vale el monto verificado; el excedente es saldo a favor | RN-RES-006A, RF-015A, CA-015A |
| G7 | Tratamiento sin decisión | A las 24 horas corridas, devolución del 100 % por defecto, pendiente de ejecución | RN-RES-006C, CA-015B |
| G8 | Pago total y diferencias | Pago total admite varios pagos; la diferencia de una reserva confirmada se paga antes del inicio de la salida | RN-RES-004, RF-015A, CA-015A |
| G9 | Creación con salida llena | No se crea la reserva; la verificación no aparta cupo | RN-RES-007, RF-003, RF-006, RF-014, CA-003, CA-006 |
| G10 | Primer pago con saldo a favor | Verificación de disponibilidad y apartamiento en una única operación | RN-RES-007, CA-006 |
| G11 (ajustada por L3) | Cierre definitivo | Registro del saldo a favor o devolución completada | Sección 17, glosario |
| G12 (ajustada por H2 y L1) | Cancelación atribuible al tenant | Reprogramación o devolución del 100 %, sin retenciones | RN-EJE-002, RN-RES-004, RN-RES-008, RF-015B, RF-015C |
| G13 | Caja | Una caja por día; reapertura con motivo; transferencias posteriores al cierre; permiso Gestionar caja | RN-CAJ-001, RF-010, sección 16, CA-010 |
| G14 | Zona horaria | Zona horaria oficial por tenant; horas corridas; cambio prospectivo; Travesía Natural en America/Bogota | Sección 9, RF-016, CA-027, glosario |
| G15 | Proceso de activación | Nueva credencial temporal emitida por el administrador con autoridad; invalida la anterior | Sección 9, CA-018 |
| G16 | RNF verificables | Accesibilidad, usabilidad, mantenibilidad y escalabilidad con criterio verificable | Sección 17 |
| G18 | Reserva cancelada | Cancelada es terminal; la reprogramación se resuelve antes de cancelar | Sección 16, RN-EJE-002 |
| H1 | Hora programada de inicio | Límite absoluto de los plazos económicos; a esa hora se bloquean pagos y se cancelan reservas no elegibles, sin depender del registro manual | RN-RES-006, RN-RES-006C, RN-EJE-001, sección 16, CA-015, CA-023 |
| H2 | Salida interrumpida | Reprogramación con regreso excepcional de En ejecución a Confirmada, o cancelación con devolución del 100 % | RN-EJE-002, sección 16, CA-023 |
| H3 | Estados de la salida | Programada, En ejecución, Finalizada y Cancelada | Sección 16, RF-020 |
| H4 | Tratamiento de comprobante tardío | Las 24 horas cuentan desde que el dinero queda reconocido | RN-RES-006C, CA-015B |
| H5 | Notificación del tratamiento predeterminado | A todos los Administradores del tenant activos, por panel y correo | RN-RES-006C, CA-015B |
| H6 | Correo por cancelación o reprogramación de salida | Se agrega a los correos transaccionales al cliente | RF-019, CA-022 |
| H7 | Emergencia personal del cliente | Novedad de ejecución sin devolución automática | RN-EJE-002, glosario |
| H8 | Protección de capacidad | Aplica a la capacidad del tour y a la del transporte | RN-SAL-001, RF-020, CA-023 |
| H9 | Registro de inicio y fin de salida | También lo puede hacer el Administrador del tenant | Sección 9, RN-EJE-001, sección 16 |
| H10 | Traslado de cupo | El cambio de fecha traslada el cupo y libera el anterior | RN-RES-007 |
| H11 | Sobrepago | El excedente genera saldo a favor | RN-RES-009 |
| H12 | Saldo pendiente en pago total | Nueva situación financiera Saldo pendiente; Abono recibido solo para tipo abono | RN-RES-006A, sección 16, RF-011, glosario |
| H13 | Estado de bloqueantes | Se registra solo en la sección 24 | Sección 17 |
| H14 | Disponibilidad | Mensual igual o superior al 95 % con fórmula explícita | Sección 17 |
| H15 | Validador de comprobantes | Confirmada la interpretación de CA-026 cuando la transferencia está habilitada | CA-026 |
| H17 | Aviso del acceso de emergencia | Correo a todos los Administradores del tenant activos, con contenido mínimo y sin datos sensibles | Sección 9, CA-021 |
| I1 | Salida alcanzada con tenant inactivo | La salida se cancela automáticamente por causa no atribuible al cliente, sin cancelaciones por incumplimiento de pago; no se reactiva al reactivar el tenant | Sección 9, RN-EJE-001, RN-EJE-002, sección 16, CA-017, CA-029 |
| I2 | Respuesta a la reprogramación | 72 horas corridas desde la notificación, sin superar la nueva salida; sin respuesta, cancelación con devolución del 100 % | RN-EJE-002, RF-015C, sección 15, sección 16, CA-015C, glosario |
| J3 (ajustada por L4) | Salida sin cierre operativo | Alerta a los Administradores del tenant activos al alcanzar la hora de finalización estimada sin registros; sin cierre automático | RN-EJE-001, sección 16, CA-029 |
| J4 | Correos del acceso de emergencia | Un correo al iniciar el acceso y otro al finalizar | Sección 9, CA-021 |
| J5 | Permisos del Administrador del tenant | Tiene por perfil Validar comprobantes, Gestionar caja y Gestionar ejecución de salidas; Consultar datos sensibles requiere asignación explícita | Sección 9, glosario, CA-030 |
| K1 | Estado final de una salida interrumpida | La salida interrumpida termina en Finalizada, con la interrupción registrada | Sección 16 |
| K2 | Cancelación de una salida programada | La realiza el Administrador del tenant | Sección 16, RF-020 |
| K3 | Cupo durante la propuesta de reprogramación | La propuesta solo se envía con capacidad suficiente; los cupos quedan apartados hasta la aceptación, el rechazo, el vencimiento o la hora programada de la nueva salida | RN-EJE-002, RN-RES-007, sección 16, CA-015C, glosario |
| K4 | Autoasignación de Consultar datos sensibles | Permitida para el Administrador del tenant, con asignación explícita y auditoría de la asignación y de cada consulta | Sección 9, CA-030 |
| L1 | Reprogramación no propuesta | El Administrador del tenant tiene 24 horas corridas para proponer una salida con disponibilidad; si no, cancelación con devolución del 100 % | RN-EJE-002, sección 16, CA-015C |
| L2 | Plazos durante la respuesta a la reprogramación | Se congelan durante las 72 horas y continúan con el tiempo restante si el cliente acepta | RN-EJE-002, RN-RES-006, CA-015C |
| L3 | Ejecución de devoluciones | Máximo 5 días hábiles; si no, marca de vencida y alerta; la retención empieza con lo que ocurra primero | RN-RES-008, sección 17, glosario, CA-015B |
| L4 | Salida sin registros | Alerta al alcanzar la hora de inicio; marca de pendiente de regularización al superar el fin estimado; regularización con hora real; sin cierre automático | RN-EJE-001, sección 16, CA-029 |
| L5 | Salida en ejecución con tenant inactivo | El acceso restringido del Administrador del tenant permite cerrar o interrumpir salidas en curso | Sección 9, CA-017 |
| L6 | Diferencia generada tras vencer el plazo del saldo | Se paga antes de la hora programada de inicio | RN-RES-004 |
| L7 | Excedente por modificación | Decisión del Administrador del tenant en 24 horas; devolución del 100 % por defecto | RN-RES-004, RF-003A, CA-015B |
| L8 | Cancelación solicitada por el cliente | La registran el Colaborador o el Administrador del tenant; tratamiento en 24 horas con devolución por defecto | RF-021, sección 16, CA-031 |
| L9 | Verificación de correo del cliente | Obligatoria para activar la cuenta; el registro manual busca y vincula el cliente existente | Sección 9, proceso 12.1.1, CA-024 |
| L10 | Caja en un día sin apertura | Creación automática para movimientos electrónicos, sin base; una sola caja por tenant y fecha | RN-CAJ-001, sección 16, CA-010 |

## 25. Glosario

- Reserva: registro de la proyección comercial de los servicios solicitados, asociado a una única salida (RN-RES-010).
- Valor proyectado: valor calculado a partir de lo reservado.
- Valor final: valor proyectado ajustado por descuentos.
- Pendiente de pago: estado de una reserva que aún no cumple la condición económica de confirmación de su tipo de pago. No garantiza cupo; el cupo se aparta con el primer pago conforme a RN-RES-007.
- Cancelación total de la reserva: estado en el que la reserva completa deja de continuar por falta de pago, decisión del cliente o cancelación extraordinaria del tour.
- Novedad de no asistencia: registro de una persona o parte del grupo que no participa en el servicio sin que ello implique necesariamente cancelar toda la reserva.
- Novedad de ejecución: registro de un hecho ocurrido durante una salida iniciada, como la emergencia personal de un cliente, que no genera devolución automática.
- Pendiente de respuesta de reprogramación: marca de una reserva afectada por la cancelación o interrupción de su salida mientras el cliente decide sobre la nueva salida propuesta, con un plazo máximo de 72 horas corridas y con los cupos de sus viajeros apartados en la salida propuesta; no es un estado de la reserva.
- Descuento vigente: descuento promocional aplicable a un tour o servicio en un periodo determinado.
- Descuento adicional: descuento extraordinario autorizado al momento de cobro o pago, por fidelización u otro motivo definido por el negocio.
- Ejecución: seguimiento de lo realmente prestado.
- Costo operacional: costo interno asociado a la prestación del servicio. Se calcula o registra para análisis operativo y de rentabilidad y no constituye por sí mismo un movimiento de caja; cuando implica una salida de dinero, esta se registra como pago operacional o gasto operacional.
- Devolución: salida efectiva de dinero registrada para reintegrar total o parcialmente valores asociados a una reserva.
- Flujo de caja: gestión diaria de base, ingresos, pagos, gastos y devoluciones, con consolidación administrativa mensual.
- Pago operacional: salida de dinero asociada a obligaciones operativas del negocio, como servicios, proveedores o compromisos formales de operación.
- Gasto operacional: salida de dinero menor o administrativa de operación que no se clasifica como pago operacional. En este PDR, "gasto" y "gasto operacional" designan el mismo concepto.
- Estado del comprobante: estado de validación de cada comprobante de transferencia: En validación, Aprobado o Rechazado.
- Revisión vencida: marca de un comprobante que permanece En validación más de 24 horas corridas; no es un estado.
- Situación financiera de la reserva: resultado económico calculado a partir de los valores validados (Sin pago, Parcial, Abono recibido, Saldo pendiente o Pago completo), junto con el saldo pendiente como monto, los valores devueltos, el saldo a favor y los valores en tratamiento pendiente.
- Tipo de pago: condición económica elegida para la reserva: pago total o abono.
- Medio de pago: forma en que se recibe el dinero: transferencia o efectivo.
- Abono recibido: situación financiera de una reserva de tipo abono Confirmada con saldo pendiente mayor que cero.
- Saldo pendiente (situación financiera): reserva de tipo pago total Confirmada con una diferencia pendiente generada por una modificación posterior a su confirmación. No debe confundirse con el saldo pendiente como monto, que es el valor que falta por pagar en cualquier reserva.
- Pago completo: situación financiera en la que se ha validado el 100 % del valor final de la reserva y el saldo pendiente es cero.
- Saldo a favor: valor previamente pagado y validado que permanece disponible para el cliente dentro del tenant que lo originó, sin vencimiento en Fase 1, aplicable a una nueva reserva como pago validado o devolvible a solicitud del cliente con autorización.
- Tratamiento pendiente: condición de los valores validados de una reserva cancelada por incumplimiento del pago mientras se decide su devolución o su registro como saldo a favor.
- Reserva reagendada vinculada: nueva reserva relacionada con una reserva original cuando el cambio exige control independiente de servicio principal o de condición comercial. Un cambio exclusivo de fecha no genera reserva vinculada.
- Establecimiento asociado: hotel o restaurante con convenio comercial con el tenant, publicado en la plataforma solo con información promocional y datos de contacto, sin reserva, cupos ni inventario gestionados por la plataforma.
- Salida: ejecución programada de un tour para una fecha, hora de inicio y hora de finalización estimada, con su propia disponibilidad, reservas, vehículos asignados y ejecución.
- Cierre definitivo: momento en que se resuelven las obligaciones económicas de una reserva cancelada, a efectos de la retención de datos sensibles: el registro formal del saldo a favor o, en una devolución, lo que ocurra primero entre su ejecución completada y el vencimiento de su plazo máximo de 5 días hábiles.
- Efectivo esperado: base inicial de caja más las entradas en efectivo menos las salidas en efectivo de la jornada.
- Horas corridas: duración real contada desde el evento que inicia el plazo, sin excluir noches, fines de semana ni festivos.
- Hora programada de inicio: hora de inicio definida al programar la salida; es el límite absoluto de los plazos económicos de sus reservas y no se modifica por un retraso en el inicio real.
- Zona horaria del tenant: zona horaria oficial en la que se interpretan todas las fechas y horas de la operación del tenant.
- Permisos especiales: Validar comprobantes, Consultar datos sensibles, Gestionar caja y Gestionar ejecución de salidas; son los únicos asignables en Fase 1 además de los perfiles base. El Administrador del tenant tiene por su perfil Validar comprobantes, Gestionar caja y Gestionar ejecución de salidas; Consultar datos sensibles siempre requiere asignación explícita.
- Tenant: empresa operadora que utiliza la plataforma con aislamiento de usuarios, datos, configuraciones y operación respecto de otros tenants.
- Código de recuperación: código de un solo uso enviado al correo electrónico registrado para recuperar la contraseña, con vigencia máxima de 30 minutos; su generación, longitud, formato, cantidad de intentos y persistencia quedan sujetos a arquitectura y seguridad.
- Confirmar contraseña / Confirmar nueva contraseña: campo de validación del registro o de la recuperación de contraseña, utilizado para comprobar que la contraseña o nueva contraseña fue ingresada correctamente antes de completar la operación; no implica necesariamente un dato persistido de forma independiente.
- Restricción académica: condición tecnológica obligatoria del proyecto, definida por el profesor.
