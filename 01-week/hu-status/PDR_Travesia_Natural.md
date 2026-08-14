# PDR - Travesia Natural

## 1. Identificacion del documento

- Producto: Travesia Natural
- Tipo de documento: Product Definition Requirements (PDR)
- Fecha: 2026-08-09
- Version: 1.0

## 2. Autores

- MARIA FERNANDA ROBAYO LAGUNA
- JHON SEBASTIAN MOLINA FIERRO

## 3. Proposito del documento

Este documento define, con enfoque de ingenieria de software, las necesidades del producto Travesia Natural y el alcance funcional que debe cubrir la solucion. Su objetivo es servir como base para analisis, UX/UI, arquitectura, desarrollo, pruebas, validacion y planificacion, sin adelantar decisiones tecnicas que todavia no han sido definidas.

## 4. Contexto y antecedentes

Travesia Natural es una operacion de turismo de naturaleza y aventura. Actualmente, parte importante de su gestion se apoya en diferentes archivos de Excel utilizados para registrar y controlar informacion relacionada con las reservas, los pagos operacionales, los gastos operacionales y la consolidacion contable interna.

Las fuentes historicas revisadas muestran que el problema principal no es la falta de registro, sino la dispersion de la informacion y la dificultad para diferenciar:

- lo proyectado al vender una reserva
- lo realmente prestado durante la ejecucion
- los costos operacionales internos
- los gastos generales y el flujo de caja

## 5. Planteamiento del problema

La operacion actual dificulta conocer con claridad:

- cuanto se vendio en cada reserva
- que servicios realmente se prestaron
- cuales fueron los costos reales de operacion
- cual fue el impacto de esa operacion en la caja del negocio

Esto afecta la trazabilidad operativa, la visibilidad de rentabilidad por reserva y el control administrativo de la operacion.

## 6. Justificacion

El proyecto se justifica por la necesidad de centralizar informacion que hoy se consulta y consolida manualmente desde diferentes archivos de Excel. Una solucion integrada permitiria apoyar de mejor manera el registro de reservas, el seguimiento de los servicios efectivamente prestados, el control de costos operacionales y la consolidacion de caja.

## 7. Objetivo general

Construir un sistema interno que permita centralizar la gestion de reservas, la ejecucion real de servicios, el control de costos operacionales y la consolidacion de caja de Travesia Natural.

## 8. Objetivos especificos

- Centralizar la informacion de clientes, atractivos, alimentacion, hospedaje, transporte y otros datos operativos necesarios.
- Registrar reservas como proyeccion comercial de los servicios solicitados.
- Diferenciar lo reservado de lo realmente prestado.
- Registrar costos operacionales asociados a la ejecucion.
- Consolidar ingresos, pagos y gastos para control interno de caja.

## 9. Stakeholders y actores identificados

### Stakeholders identificados

- Travesia Natural como cliente y propietario de la necesidad del negocio.
- Equipo academico del proyecto como parte interesada en las restricciones obligatorias del proyecto.

### Actores operativos identificados en las fuentes del proyecto

- Usuario interno encargado del registro de reservas y del seguimiento operativo.
- Usuario interno encargado del control de costos operacionales.
- Usuario interno encargado del control administrativo y de caja.

Estas denominaciones describen funciones observadas en la documentacion revisada. No existe evidencia suficiente para afirmar en esta etapa que correspondan a nombres formales de roles autenticados ya confirmados por el cliente.

### Roles del sistema confirmados

- No existe evidencia suficiente para confirmar nombres formales de roles del sistema en esta etapa.

### Roles no confirmados formalmente

- Usuario encargado del registro de reservas y seguimiento operativo: PENDIENTE DE CONFIRMACION DEL CLIENTE
- Usuario encargado del control de costos operacionales: PENDIENTE DE CONFIRMACION DEL CLIENTE
- Usuario encargado del control administrativo y de caja: PENDIENTE DE CONFIRMACION DEL CLIENTE
- Administrador: PENDIENTE DE CONFIRMACION DEL CLIENTE
- Gerente: PENDIENTE DE CONFIRMACION DEL CLIENTE
- Contador: PENDIENTE DE CONFIRMACION DEL CLIENTE
- Analista: PENDIENTE DE CONFIRMACION DEL CLIENTE

## 10. Necesidades del cliente

Con base en las fuentes funcionales del proyecto, el cliente necesita:

- centralizar informacion actualmente dispersa
- registrar reservas con informacion de clientes y servicios
- diferenciar entre lo reservado y lo realmente prestado
- registrar costos operacionales internos
- consolidar flujo de caja interno
- consultar informacion operativa y resultados del negocio
- disponer de reportes y dashboard para seguimiento diario y administrativo

## 11. Alcance

### Dentro del alcance

- Gestion de clientes para reservas.
- Gestion de informacion base de atractivos, alimentacion, hospedaje y transporte necesaria para reservas y control operacional.
- Gestion de informacion obligatoria y documental requerida para clientes y acompanantes segun el tipo de actividad.
- Registro de reservas como proyeccion comercial.
- Hospedaje como parte del alcance funcional documentado en el proyecto.
- Control de ejecucion de servicios prestados y no prestados.
- Registro de costos operacionales.
- Gestion operativa diaria de caja con consolidacion mensual.
- Consultas operativas, reporte de reservas, dashboard diario y reporte administrativo de caja mensual.
- Seguridad basica de acceso para usuarios internos y restriccion de operaciones sensibles.

### Fuera del alcance

- Administracion avanzada de roles, modulos y permisos detallados.

### Pendiente de confirmacion

- Reglas finales de algunos ajustes en ejecucion.

## 12. Procesos de negocio

### 12.1 Gestion de reservas

Proceso orientado a registrar la proyeccion comercial de una reserva, incluyendo cliente titular, acompanantes, servicios solicitados, valor proyectado y valor final.

- Objetivo: dejar registrada la intencion comercial inicial del cliente.
- Inicio: cuando se requiere crear una nueva reserva.
- Actor principal: Usuario interno encargado del registro de reservas y seguimiento operativo.
- Informacion involucrada: cliente titular, acompanantes, atractivos, alimentacion, hospedaje, transporte, descuentos, documentos obligatorios y valores resultantes.
- Comportamiento esperado: registrar la informacion minima obligatoria, calcular personas y valores, validar capacidad de hospedaje y persistir la reserva.
- Reglas asociadas: RN-CLI-001, RN-CLI-002, RN-RES-001, RN-RES-002, RN-RES-003, RN-RES-004, RN-RES-005, RN-HOS-003.
- Resultado esperado: reserva creada como base de seguimiento operativo.
- Casos alternativos relevantes: documentos duplicados, capacidad insuficiente en hospedaje, descuentos invalidos, falta de informacion obligatoria para actividades de riesgo.

Estado: CONFIRMADO

### 12.2 Ejecucion de servicios

Proceso orientado a registrar que servicios de la reserva realmente se prestaron y cuales no, dejando visible la diferencia frente a la proyeccion inicial.

- Objetivo: controlar la operacion real y diferenciarla de la reserva original.
- Inicio: cuando la actividad esta proxima a iniciar y el guia realiza el control operativo previo a la salida.
- Actor principal: Usuario interno encargado del registro de reservas y seguimiento operativo.
- Informacion involucrada: reserva existente, servicios reservados, servicios prestados, servicios no prestados, causales, ajustes, pagos registrados y control operativo previo a la salida.
- Comportamiento esperado: registrar servicios prestados y no prestados, permitir ajustes cuando corresponda, mantener visible la diferencia frente a la proyeccion inicial y reflejar la tolerancia operativa aplicable antes de la salida.
- Reglas asociadas: RN-EJE-001, RN-EJE-002, RN-EJE-003, RN-EJE-004, RN-EJE-005.
- Resultado esperado: trazabilidad clara entre lo reservado y lo efectivamente ejecutado.
- Casos alternativos relevantes: llegada tardia de una persona, no presentacion sin aviso oportuno, servicios no prestados sin causal, ajustes posteriores a la reserva.

Estado: CONFIRMADO

### 12.3 Control de costos operacionales

Proceso orientado a registrar y controlar costos internos asociados a la prestacion de servicios.

- Objetivo: conocer el costo real de operar los servicios prestados.
- Inicio: cuando existen servicios efectivamente prestados que requieren control de costo.
- Actor principal: Usuario interno encargado del control de costos operacionales.
- Informacion involucrada: atractivos prestados, cantidades reales, costos operacionales catalogados y costos asociados a la ejecucion.
- Comportamiento esperado: registrar o calcular costos operacionales diferenciados del valor comercial.
- Reglas asociadas: RN-ATR-001, RN-OPE-001.
- Resultado esperado: base confiable para analisis operativo, rentabilidad y caja.
- Casos alternativos relevantes: parametrizacion incompleta de costos o necesidad de validacion adicional sobre algunos costos.

Estado: CONFIRMADO

### 12.4 Consolidacion de caja

Proceso orientado a gestionar la caja diaria, sus cierres y reaperturas, y consolidar la informacion economica del mes para control interno del negocio.

- Objetivo: dar visibilidad al estado diario de caja y a su consolidacion administrativa mensual.
- Inicio: cuando inicia una jornada operativa o cuando existen movimientos economicos registrados para el periodo correspondiente.
- Actor principal: Usuario interno encargado del control administrativo y de caja.
- Informacion involucrada: base diaria, ingresos, pagos operacionales, gastos, cierres, reaperturas e historico de movimientos.
- Comportamiento esperado: abrir la jornada con una base parametrizable, registrar movimientos del dia, permitir cierre y reapertura cuando corresponda, conservar historico y consolidar la informacion mensual bajo la logica funcional definida.
- Reglas asociadas: RN-CAJ-001.
- Resultado esperado: estado de caja visible para seguimiento administrativo.
- Casos alternativos relevantes: reapertura de un dia cerrado, ajuste de parametros de base y consolidacion mensual a partir de informacion diaria.

Estado: CONFIRMADO

## 13. Requerimientos funcionales

### RF-001 - Registrar cliente titular

- Descripcion: El sistema debe permitir registrar un cliente titular con la informacion requerida para asociarlo a una reserva.
- Actor: Usuario interno encargado del registro de reservas y seguimiento operativo
- Precondiciones: Ninguna
- Comportamiento esperado: Debe capturar los datos obligatorios definidos para el cliente titular y validar la informacion adicional exigida cuando la actividad sea de riesgo.
- Resultado esperado: Cliente titular disponible para uso en una reserva.
- Reglas relacionadas: RN-CLI-001
- Excepciones conocidas: La regla final de descuentos sigue pendiente de confirmacion del cliente y no afecta la obligatoriedad documental.
- Estado: CONFIRMADO

### RF-002 - Registrar acompanantes

- Descripcion: El sistema debe permitir asociar cero o varios acompanantes a una reserva.
- Actor: Usuario interno encargado del registro de reservas y seguimiento operativo
- Precondiciones: Reserva creada o proceso de reserva en curso.
- Comportamiento esperado: Cada acompanante debe registrarse con datos individualizados y con la informacion obligatoria que corresponda segun el tipo de actividad.
- Resultado esperado: Reserva con cantidad de personas calculable.
- Reglas relacionadas: RN-CLI-002, RN-RES-005
- Excepciones conocidas: Alcance exacto de todos los ajustes posteriores en ejecucion PENDIENTE DE CONFIRMACION DEL CLIENTE.
- Estado: CONFIRMADO

### RF-003 - Crear reserva como proyeccion comercial

- Descripcion: El sistema debe permitir registrar una reserva que represente lo que el cliente desea adquirir.
- Actor: Usuario interno encargado del registro de reservas y seguimiento operativo
- Precondiciones: Datos base disponibles
- Comportamiento esperado: Debe incluir servicios seleccionados, condiciones parametrizadas de modificacion o cancelacion y valores calculados desde datos parametrizados.
- Resultado esperado: Reserva registrada como base de seguimiento.
- Reglas relacionadas: RN-RES-001, RN-RES-002, RN-RES-003, RN-RES-004
- Excepciones conocidas: Las restricciones de modificacion o cancelacion dependen de los terminos y condiciones parametrizados para la actividad o servicio correspondiente.
- Estado: CONFIRMADO

### RF-004 - Gestionar informacion base operativa para reservas

- Descripcion: El sistema debe permitir disponer de informacion base de atractivos, alimentacion, hospedaje y transporte necesaria para registrar reservas y soportar el control operacional.
- Actor: Usuario interno
- Precondiciones: Ninguna
- Comportamiento esperado: Debe permitir consultar o registrar la informacion parametrizada necesaria para usar esos servicios dentro de la reserva y del control operativo.
- Resultado esperado: Base operativa centralizada y utilizable por los procesos del negocio.
- Reglas relacionadas: RN-ATR-001, RN-ALI-001, RN-HOS-001, RN-HOS-003, RN-TRA-001, RN-TRA-002
- Excepciones conocidas: El detalle exacto de todas las operaciones permitidas sobre esta informacion base puede variar segun definicion funcional final.
- Estado: CONFIRMADO

### RF-005 - Calcular valor proyectado y valor final

- Descripcion: El sistema debe calcular el valor proyectado de la reserva y permitir persistir el valor final cuando existan descuentos aplicables.
- Actor: Usuario interno encargado del registro de reservas y seguimiento operativo
- Precondiciones: Servicios seleccionados
- Comportamiento esperado: El calculo debe salir de informacion parametrizada, descuentos aplicables cuando hayan sido confirmados y reglas de transporte por persona segun el tour correspondiente.
- Resultado esperado: Valores visibles y persistidos para seguimiento.
- Reglas relacionadas: RN-RES-001, RN-RES-002, RN-RES-003, RN-TRA-002
- Excepciones conocidas: Regla final sobre descuentos multiples PENDIENTE DE CONFIRMACION DEL CLIENTE.
- Estado: CONFIRMADO

### RF-006 - Validar capacidad de hospedaje

- Descripcion: El sistema debe validar la capacidad del hospedaje frente a la cantidad de personas.
- Actor: Usuario interno encargado del registro de reservas y seguimiento operativo
- Precondiciones: Hospedaje seleccionado
- Comportamiento esperado: Debe advertir si la capacidad es insuficiente.
- Resultado esperado: Prevencion de una reserva inconsistente.
- Reglas relacionadas: RN-HOS-003
- Excepciones conocidas: Ninguna conocida
- Estado: CONFIRMADO

### RF-007 - Registrar ejecucion real de servicios

- Descripcion: El sistema debe permitir registrar que servicios realmente se prestaron y cuales no.
- Actor: Usuario interno encargado del registro de reservas y seguimiento operativo
- Precondiciones: Reserva existente y actividad proxima a iniciar con control operativo de salida realizado por el guia
- Comportamiento esperado: Debe permitir seguimiento de prestados, no prestados, sus causales y la aplicacion de la tolerancia operativa previa a la salida.
- Resultado esperado: Diferenciacion clara entre proyeccion y ejecucion real.
- Reglas relacionadas: RN-EJE-001, RN-EJE-003, RN-EJE-005
- Excepciones conocidas: Si una persona no se presenta y no hubo aviso oportuno, puede aplicarse la tolerancia operativa definida antes de marcar la no participacion.
- Estado: CONFIRMADO

### RF-008 - Permitir ajustes en ejecucion

- Descripcion: El sistema debe permitir ajustes posteriores a la reserva dentro del proceso operativo segun el tipo de cambio autorizado.
- Actor: Usuario interno encargado del registro de reservas y seguimiento operativo
- Precondiciones: Ejecucion habilitada segun la regla funcional aplicable
- Comportamiento esperado: Debe permitir agregar, quitar o ajustar servicios bajo condiciones parametrizadas, incluyendo cambios de tour, plato de comida, hospedaje y otros ajustes aprobados por el negocio.
- Resultado esperado: Registro real de lo efectivamente operado.
- Reglas relacionadas: RN-EJE-002, RN-EJE-004
- Excepciones conocidas: Pueden existir ajustes adicionales no confirmados todavia por el cliente.
- Estado: CONFIRMADO

### RF-009 - Registrar costos operacionales

- Descripcion: El sistema debe permitir registrar o calcular costos operacionales internos asociados a la ejecucion.
- Actor: Usuario interno encargado del control de costos operacionales
- Precondiciones: Ejecucion iniciada
- Comportamiento esperado: Debe diferenciar costo operacional de valor comercial.
- Resultado esperado: Base para analisis operativo y caja.
- Reglas relacionadas: RN-ATR-001, RN-OPE-001
- Excepciones conocidas: Nivel exacto de parametrizacion de algunos costos PENDIENTE DE CONFIRMACION DEL CLIENTE.
- Estado: CONFIRMADO

### RF-010 - Consolidar flujo de caja interno

- Descripcion: El sistema debe gestionar la caja diaria, incluyendo base, ingresos, pagos, gastos, cierre, reapertura e historico, y consolidar esa informacion para control mensual.
- Actor: Usuario interno encargado del control administrativo y de caja
- Precondiciones: Movimientos registrados
- Comportamiento esperado: Debe reflejar la logica BASE + INGRESOS - PAGOS - GASTOS = TOTAL para cada jornada y permitir consolidacion mensual.
- Resultado esperado: Visibilidad del estado de caja.
- Reglas relacionadas: RN-CAJ-001
- Excepciones conocidas: El valor inicial de la base diaria permanece pendiente de confirmacion del cliente.
- Estado: CONFIRMADO

### RF-011 - Consultar reservas y ejecucion

- Descripcion: El sistema debe permitir consultar la informacion necesaria para seguimiento de reservas, acompanantes, servicios reservados, servicios prestados, servicios no prestados, causales registradas y metricas operativas del dia.
- Actor: Usuario interno
- Precondiciones: Informacion registrada
- Comportamiento esperado: Debe facilitar el seguimiento de la diferencia entre lo reservado y lo ejecutado e incluir el reporte de reservas y el dashboard diario confirmado por el cliente.
- Resultado esperado: Soporte al control operativo y al seguimiento de novedades.
- Reglas relacionadas: RN-EJE-005, RN-CAJ-001
- Excepciones conocidas: Ninguna conocida para los campos de reporte ya confirmados.
- Estado: CONFIRMADO

### RF-012 - Consultar costos operacionales y caja

- Descripcion: El sistema debe permitir consultar la informacion registrada de costos operacionales, ingresos, pagos, gastos y consolidacion mensual de caja para control interno.
- Actor: Usuario interno
- Precondiciones: Informacion registrada
- Comportamiento esperado: Debe facilitar la consulta de la informacion economica y operativa consolidada necesaria para control interno, incluyendo el reporte administrativo de caja mensual confirmado por el cliente.
- Resultado esperado: Soporte al seguimiento administrativo de costos y caja.
- Reglas relacionadas: RN-OPE-001, RN-CAJ-001
- Excepciones conocidas: Ninguna conocida para los campos administrativos ya confirmados.
- Estado: CONFIRMADO

## 14. Reglas de negocio

### RN-CLI-001

- Regla: Antes de crear una reserva deben completarse los campos obligatorios del cliente titular: documento de identidad, datos de contacto, aceptacion de terminos y condiciones, comprobante de pago, fecha de nacimiento o edad y los demas datos exigidos por la actividad correspondiente. Si aplica condicion especial, tambien deben completarse autorizacion para menores, informacion medica basica o de emergencia, seguro o asistencia y los requisitos adicionales definidos para actividades de riesgo.
- Estado: CONFIRMADO

### RN-CLI-002

- Regla: Los acompanantes deben registrarse con datos minimos obligatorios.
- Estado: CONFIRMADO

### RN-CLI-003

- Regla: Para actividades de riesgo son obligatorios, ademas de la informacion general, el consentimiento informado o exoneracion de responsabilidad, el tipo de sangre, el contacto de emergencia y el registro de restricciones fisicas o movilidad reducida.
- Estado: CONFIRMADO

### RN-RES-001

- Regla: El valor proyectado se calcula a partir de los servicios seleccionados y la cantidad total de personas.
- Estado: CONFIRMADO

### RN-RES-002

- Regla: La reserva puede incluir descuentos cuando aplique, pero la regla exacta de descuentos permanece pendiente de confirmacion del cliente.
- Estado: CONFIRMADO

### RN-RES-003

- Regla: Deben persistirse valor proyectado y valor final.
- Estado: CONFIRMADO

### RN-RES-004

- Regla: La posibilidad de modificar o cancelar una reserva depende de los terminos y condiciones configurados para la actividad o servicio correspondiente. No existe una unica regla temporal general para todas las actividades. Los tiempos limite dependen del tour y del tipo de cambio solicitado, y deben ser parametrizables.
- Estado: CONFIRMADO

Observacion:
Existen ejemplos confirmados de configuracion, como cambio de tour hasta 6 horas antes, cambio de plato antes de servir coordinado con el guia y cambio de hospedaje hasta 2 dias antes. Estos ejemplos no constituyen una regla universal para todas las actividades y deben mantenerse como parametros configurables.

### RN-RES-005

- Regla: Si hay acompanantes, cada uno debe registrarse con datos minimos obligatorios y sin duplicidad de documento dentro de la misma reserva.
- Estado: CONFIRMADO

### RN-ALI-001

- Regla: La alimentacion se maneja mediante opciones asociadas a restaurante y plato del dia.
- Estado: CONFIRMADO

### RN-HOS-001

- Regla: El hospedaje debe disponer al menos de informacion de precio y capacidad para soportar su uso en reserva.
- Estado: CONFIRMADO

### RN-HOS-003

- Regla: La capacidad del hospedaje debe ser suficiente para la cantidad de personas de la reserva.
- Estado: CONFIRMADO

### RN-TRA-001

- Regla: El transporte forma parte de la reserva y se maneja por trayectos.
- Estado: CONFIRMADO

### RN-TRA-002

- Regla: El transporte debe manejar una tarifa parametrizada por persona. La tarifa puede variar dependiendo del servicio o actividad asociada, cada tour puede tener un precio fijo propio y si la reserva se modifica debe recalcularse el valor de transporte que corresponda a la nueva configuracion.
- Estado: CONFIRMADO

### RN-EJE-001

- Regla: La ejecucion se activa cuando la actividad esta proxima a iniciar y el guia realiza el control operativo previo a la salida. Si una persona no se presenta y no hubo aviso oportuno al guia, este puede conceder hasta 10 minutos adicionales antes de iniciar. Si transcurren esos 10 minutos sin presentacion ni aviso oportuno, el servicio correspondiente se mantiene como cobrado aunque la persona no participe en la actividad.
- Estado: CONFIRMADO

### RN-EJE-002

- Regla: En ejecucion se permiten ajustes posteriores a la reserva inicial.
- Estado: CONFIRMADO

### RN-EJE-003

- Regla: Solo debe considerarse como base real lo efectivamente prestado.
- Estado: CONFIRMADO

### RN-EJE-004

- Regla: Si durante la ejecucion cambia la cantidad de acompanantes, deben recalcularse los valores reales de los servicios que dependan de la cantidad de personas.
- Estado: CONFIRMADO

### RN-EJE-005

- Regla: Los servicios no prestados deben quedar visibles para seguimiento con su causal.
- Estado: CONFIRMADO

### RN-ATR-001

- Regla: Cada atractivo debe tener definidos valor comercial y costos operacionales para soportar su uso en reserva y control operacional.
- Estado: CONFIRMADO

### RN-OPE-001

- Regla: Para servicios prestados que dependan de costos catalogados, el sistema debe permitir calcular o registrar costos operacionales con base en la parametrizacion disponible y la cantidad real de personas atendidas.
- Estado: CONFIRMADO

### RN-CAJ-001

- Regla: La caja se gestiona operativamente por dia. Cada jornada inicia con una base de caja parametrizable, permite registrar ingresos, pagos y gastos, debe soportar cierre formal diario y reapertura cuando sea necesaria, conservar historico de movimientos, cierres y reaperturas, y permitir obtener la consolidacion mensual bajo la logica BASE + INGRESOS - PAGOS - GASTOS = TOTAL. Las operaciones de cierre, reapertura y modificacion de parametros de caja quedan restringidas al dueno de la empresa y a la colaboradora encargada de caja.
- Estado: CONFIRMADO

## 15. Responsabilidades operativas respaldadas por las fuentes

Las siguientes responsabilidades si aparecen respaldadas por las fuentes revisadas, pero su asignacion a nombres formales de rol del sistema sigue pendiente de confirmacion del cliente.

### Usuario interno encargado del registro de reservas y seguimiento operativo

- Tipo: Funcion operativa identificada
- Responsabilidades respaldadas por las fuentes:
  - registrar clientes y reservas
  - calcular valores proyectados de la reserva
  - registrar la diferencia entre lo reservado y lo ejecutado
  - verificar documentos obligatorios y requisitos de la actividad
- Estado: FUNCION RESPALDADA / ROL FORMAL PENDIENTE DE CONFIRMACION

### Usuario interno encargado del control de costos operacionales

- Tipo: Funcion operativa identificada
- Responsabilidades respaldadas por las fuentes:
  - controlar costos operacionales
- Estado: FUNCION RESPALDADA / ROL FORMAL PENDIENTE DE CONFIRMACION

### Usuario interno encargado del control administrativo y de caja

- Tipo: Funcion operativa identificada
- Responsabilidades respaldadas por las fuentes:
  - revisar consolidacion de caja
  - ejecutar cierres, reaperturas o ajustes de caja cuando tenga autorizacion
- Estado: FUNCION RESPALDADA / ROL FORMAL PENDIENTE DE CONFIRMACION

## 16. Estados y ciclos de vida

### Reserva

- Existe evidencia de que la reserva tiene un ciclo de vida operativo y de que sus restricciones de modificacion o cancelacion dependen de los terminos y condiciones parametrizados por actividad o servicio.
- No existe una unica regla temporal general de inmutabilidad para todas las reservas.
- Existen ajustes confirmados que dependen del tipo de cambio solicitado, como tour, alimentacion u hospedaje, pero el modelado completo de estados y transiciones sigue siendo posterior.
- Los nombres de estado observados en artefactos historicos del proyecto no se adoptan en este PDR como definicion funcional confirmada.

### Ejecucion

- Existe evidencia de un ciclo de seguimiento de servicios prestados y no prestados.
- La activacion del proceso queda ligada a la proximidad de inicio de la actividad y al control operativo previo realizado por el guia.
- Los estados y transiciones definitivas permanecen pendientes de modelado formal posterior.

### Caja

- La caja opera diariamente con apertura sobre una base, registro de movimientos, cierre formal y posible reapertura.
- La informacion diaria alimenta una consolidacion administrativa mensual.
- El valor inicial de la base diaria permanece PENDIENTE DE CONFIRMACION DEL CLIENTE.

## 17. Requerimientos no funcionales

Las nueve dimensiones no funcionales fueron revisadas contra las fuentes disponibles del proyecto. A la fecha 2026-08-13 algunas dimensiones avanzan a un estado parcialmente definido, pero aun no existe evidencia suficiente para fijar metricas, umbrales, frecuencias, SLA, tiempos o valores verificables donde estos no fueron confirmados.

- Seguridad: PARCIALMENTE DEFINIDO. En Fase 1 el sistema debe contemplar autenticacion de usuarios internos, control basico de acceso por perfil operativo y restriccion de operaciones sensibles. La administracion avanzada de roles, modulos y permisos detallados queda fuera del alcance actual.
- Privacidad y proteccion de informacion: PARCIALMENTE DEFINIDO. El sistema debe preservar la integridad de la informacion gestionada y respetar las politicas y normativa aplicable en Colombia para el tratamiento de la informacion, incluyendo datos personales, medicos o de emergencia asociados a actividades de riesgo. Permanecen pendientes criterios verificables adicionales.
- Trazabilidad y auditoria: PARCIALMENTE DEFINIDO. El sistema debe mantener auditoria sobre los datos gestionados en cada registro y permitir trazabilidad sobre cambios realizados en la informacion. Permanecen pendientes el detalle de campos auditados, retencion y mecanismo tecnico.
- Disponibilidad: PENDIENTE DE DEFINICION. No existen objetivos minimos documentados de continuidad operativa, horario esperado o tolerancia a indisponibilidad.
- Rendimiento: PARCIALMENTE DEFINIDO. El sistema tendra inicialmente un escenario de uso interno y de baja concurrencia. Permanecen pendientes metricas cuantitativas de usuarios concurrentes, volumen y tiempos de respuesta.
- Usabilidad: PARCIALMENTE DEFINIDO. Existe orientacion de alineamiento con estandares web aplicables de W3C, pero no se cuenta aun con criterios verificables suficientes para cerrar completamente esta dimension.
- Accesibilidad: PENDIENTE DE DEFINICION. Se propone aplicar buenas practicas de UI/UX, pero esto no define por si solo criterios concretos de accesibilidad.
- Mantenibilidad: PENDIENTE DE DEFINICION. No existen criterios documentados sobre soporte, evolucion o mantenibilidad del sistema.
- Respaldo y recuperacion: PARCIALMENTE DEFINIDO. El proyecto debe contemplar el diseño de politicas de respaldo y recuperacion con almacenamiento local. Permanecen pendientes frecuencia, retencion, numero de copias, procedimiento de restauracion y demas parametros cuantitativos.

Bloqueante actual:
La ausencia de criterios verificables completos para varias dimensiones no funcionales sigue siendo un bloqueante parcial para definir un baseline suficiente de infraestructura, operacion y seguridad.

## 18. Restricciones academicas obligatorias

Las siguientes condiciones corresponden a restricciones academicas del proyecto y no a solicitudes directas confirmadas del cliente:

- Bases de datos obligatorias: PostgreSQL y MongoDB.
- Arquitectura frontend obligatoria: exactamente 4 Micro Frontends.
- Frameworks frontend obligatorios: Angular y React.
- Tecnologias backend obligatorias: Java y Go.

La asignacion especifica de responsabilidades entre Java y Go, Angular y React, PostgreSQL y MongoDB REQUIERE DEFINICION DURANTE LA ETAPA DE ARQUITECTURA.

La delimitacion funcional de los cuatro Micro Frontends y su distribucion entre Angular y React REQUIERE DEFINICION DURANTE LA ETAPA DE ARQUITECTURA.

La distribucion de datos y responsabilidades entre PostgreSQL y MongoDB REQUIERE DEFINICION DURANTE LA ETAPA DE ARQUITECTURA.

## 19. Restricciones de despliegue y responsabilidad de entrega

- Restriccion de despliegue prevista: AWS como plataforma prevista para despliegue.
- Restriccion de desarrollo prevista: Docker para la etapa de desarrollo.
- Responsabilidad de entrega: El alcance del equipo del proyecto comprende la entrega del desarrollo del software.
- Responsabilidad de implementacion: La implementacion o puesta en operacion posterior queda bajo responsabilidad de la empresa.

## 20. Supuestos y dependencias

- La documentacion funcional del proyecto se considera valida siempre que no contradiga una necesidad del cliente o una regla de negocio mejor sustentada.
- El alcance de hospedaje se mantiene dentro del documento con base en la documentacion funcional disponible revisada en el proyecto.
- Las restricciones academicas obligatorias condicionan la definicion arquitectonica futura del proyecto.
- La definicion definitiva de arquitectura, UX, modelo de datos, base de datos y seguridad depende del estado pendiente o parcialmente definido de los RNF de la seccion 17.

## 21. Riesgos

- Riesgo de asumir reglas no confirmadas sobre descuentos mientras permanezcan en espera de validacion del cliente.
- Riesgo de incumplir restricciones academicas si no se documentan desde esta etapa.
- Riesgo de manejar informacion sensible de salud y emergencia sin criterios no funcionales completos de privacidad, respaldo y auditoria.
- Riesgo de dimensionar incorrectamente infraestructura, operacion o seguridad mientras los RNF permanezcan parcial o insuficientemente definidos.
- Riesgo de trasladar a arquitectura o desarrollo decisiones no confirmadas sobre seguridad, accesibilidad, disponibilidad o respaldo.

## 22. Criterios de aceptacion

- CA-001: Debe ser posible registrar un cliente titular y asociarlo a una reserva con la informacion obligatoria general y, cuando aplique, con los requisitos adicionales de actividades de riesgo.
- CA-002: Debe ser posible registrar cero o varios acompanantes con datos individualizados y sin duplicidad de documento dentro de la misma reserva.
- CA-003: Debe ser posible crear una reserva como proyeccion comercial con servicios seleccionados, condiciones parametrizadas aplicables y valores calculados.
- CA-004: Debe existir informacion base utilizable de atractivos, alimentacion, hospedaje y transporte para soportar el registro de reservas y el control operacional.
- CA-005: Deben quedar visibles y persistidos el valor proyectado y el valor final de la reserva, incluyendo el calculo del transporte por persona segun el tour correspondiente.
- CA-006: Si se selecciona hospedaje, el sistema debe advertir cuando la capacidad no sea suficiente para la cantidad total de personas.
- CA-007: Debe quedar diferenciada la reserva original de la ejecucion real de servicios prestados y no prestados.
- CA-008: Cuando existan servicios no prestados, estos deben quedar visibles con su causal de seguimiento.
- CA-009: Debe ser posible registrar o calcular costos operacionales sin confundirlos con el valor comercial vendido.
- CA-010: Debe ser posible gestionar la caja diaria con base, ingresos, pagos, gastos, cierre y reapertura, y obtener la consolidacion mensual bajo la logica de caja definida para control interno.
- CA-011: Debe ser posible consultar la informacion de reservas y ejecucion de forma que se distingan acompanantes, servicios reservados, servicios prestados, servicios no prestados, sus causales registradas y las metricas del dashboard diario confirmadas por el cliente.
- CA-012: Debe ser posible consultar la informacion consolidada de costos operacionales y caja para control interno del negocio, incluyendo el reporte de reservas y el reporte administrativo de caja mensual con los campos confirmados por el cliente.

## 23. Trazabilidad

| ID | Objetivo / Proceso | RF / RN relacionado | Criterio de aceptacion | Estado |
| --- | --- | --- | --- | --- |
| TRA-001 | Centralizar informacion base para reservas | RF-001, RN-CLI-001 | CA-001 | CONFIRMADO |
| TRA-002 | Gestionar acompanantes dentro de la reserva | RF-002, RN-CLI-002, RN-RES-005 | CA-002 | CONFIRMADO |
| TRA-003 | Disponer de informacion base operativa para reservas | RF-004, RN-ATR-001, RN-ALI-001, RN-HOS-001, RN-HOS-003, RN-TRA-001, RN-TRA-002 | CA-004 | CONFIRMADO |
| TRA-004 | Crear reserva como proyeccion comercial | RF-003, RN-RES-001, RN-RES-003, RN-RES-004 | CA-003, CA-005 | CONFIRMADO |
| TRA-005 | Validar capacidad cuando exista hospedaje | RF-006, RN-HOS-003 | CA-006 | CONFIRMADO |
| TRA-006 | Diferenciar reserva y ejecucion real | RF-007, RN-EJE-001, RN-EJE-003, RN-EJE-005 | CA-007, CA-008 | CONFIRMADO |
| TRA-007 | Permitir ajustes durante la ejecucion | RF-008, RN-EJE-002, RN-EJE-004 | CA-007 | CONFIRMADO |
| TRA-008 | Controlar costos operacionales | RF-009, RN-ATR-001, RN-OPE-001 | CA-009 | CONFIRMADO |
| TRA-009 | Consolidar caja interna | RF-010, RN-CAJ-001 | CA-010 | CONFIRMADO |
| TRA-010 | Consultar reservas y ejecucion | RF-011, RN-EJE-005, RN-CAJ-001 | CA-011 | CONFIRMADO |
| TRA-011 | Consultar costos operacionales y caja | RF-012, RN-OPE-001, RN-CAJ-001 | CA-012 | CONFIRMADO |

## 24. Pendientes de confirmacion

### Critica

- Regla final sobre descuentos multiples o unicos.

### Alta

- Valor inicial de la base diaria de caja.
- Criterios verificables de disponibilidad.
- Metricas cuantitativas de rendimiento.
- Parametros cuantitativos de backup y recuperacion.

### Media

- Definicion formal de todos los perfiles internos del sistema.
- Criterios concretos de accesibilidad.
- Criterios de mantenibilidad.

## 25. Glosario

- Reserva: registro de la proyeccion comercial de los servicios solicitados.
- Valor proyectado: valor calculado a partir de lo reservado.
- Valor final: valor proyectado ajustado por descuentos.
- Ejecucion: seguimiento de lo realmente prestado.
- Costo operacional: costo interno asociado a la prestacion del servicio.
- Flujo de caja: gestion diaria de base, ingresos, pagos y gastos, con consolidacion administrativa mensual.
- Restriccion academica: condicion tecnologica obligatoria del proyecto, definida por el profesor.
