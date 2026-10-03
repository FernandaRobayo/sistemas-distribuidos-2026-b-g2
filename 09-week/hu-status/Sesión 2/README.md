# Semana 9 · Sesión 2 — Planificación: configuración segura y entrega progresiva

## 1. Objetivo y alcance

Este documento define el plan de secretos, la política de feature flags, la entrega
progresiva y el rollback para MVP 2. Es una planificación: no acredita despliegues,
rotaciones ni pruebas runtime que no hayan sido ejecutadas.

Estados usados:

- **CONFIRMADO:** respaldado por el código o la documentación existente.
- **PLANIFICADO:** actividad futura con criterio verificable.
- **PENDIENTE DE DEFINIR:** requiere una decisión explícita del equipo.

## 2. Fuentes y trazabilidad

- [Configuración segura de Semana 9 · Sesión 1](../Sesión%201/README.md)
- [Variables de ejemplo de Semana 9 · Sesión 1](../Sesión%201/.env.example)
- [Matriz DEV, QA y PROD de MVP 2](../../../06-week/hu-status/Sesión%202/matriz-configuracion.md)
- [Promoción entre ramas y entornos](../../../06-week/hu-status/Sesión%202/ramas-entornos.md)
- [Backlog de orquestación de MVP 2](../../../06-week/hu-status/Sesión%202/historias-orquestacion.md)
- [PDR Multi tour v1.9](../../../08-week/hu-status/PDR_Multi_tour_v1.9.md)

### Evolución entre fuentes

- Semana 6 registra `APP_DEMO_SEED_ENABLED` como pendiente. Semana 9 · Sesión 1 es
  evidencia posterior y confirma su implementación con valor por defecto `false`.
- La matriz de Semana 6 identifica `POSTGRES_PASSWORD` y `APP_JWT_SECRET`. Semana 9
  añade `APP_PLATFORM_ADMIN_PASSWORD`, necesaria únicamente cuando el seeder de
  demostración está habilitado.
- Estas diferencias representan evolución del proyecto y no una modificación de los
  documentos históricos.

## 3. Plan de secretos

### 3.1 Inventario

| Secreto | Consumidor | Propietario | Almacenamiento | Inyección | Acceso mínimo | Rotación |
| --- | --- | --- | --- | --- | --- | --- |
| `POSTGRES_PASSWORD` | PostgreSQL y backend mediante `SPRING_DATASOURCE_PASSWORD` | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** rol Backend + infraestructura | DEV: archivo local ignorado y restringido. **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** AWS Secrets Manager para QA/PROD, coherente con AWS como plataforma prevista en el PDR | Variable de entorno al iniciar Compose; nunca `ARG`, `COPY` ni imagen | PostgreSQL, backend y ejecutor autorizado del entorno | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** cada 90 días y ante exposición confirmada o sospechada, baja o cambio de acceso privilegiado, o compromiso del entorno. Debe cambiarse coordinadamente en PostgreSQL y backend |
| `APP_JWT_SECRET` | Backend, firma y validación de JWT | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** rol Backend + infraestructura | DEV: archivo local ignorado y restringido. **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** AWS Secrets Manager para QA/PROD | Variable de entorno `APP_JWT_SECRET`; Spring la exige al iniciar | Backend y ejecutor autorizado del entorno | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** cada 90 días y ante exposición confirmada o sospechada, baja o cambio de acceso privilegiado, o compromiso del entorno. Se programa porque invalida los tokens anteriores |
| `APP_PLATFORM_ADMIN_PASSWORD` | Seeder administrativo cuando `APP_DEMO_SEED_ENABLED=true` | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** rol Backend + infraestructura | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** archivo local ignorado en DEV y AWS Secrets Manager en el entorno controlado donde se habilite el seeder | Variable de entorno; vacía cuando el seeder está deshabilitado y obligatoria cuando está habilitado | Seeder/backend y ejecutor autorizado del entorno; nunca se publica en Git ni en evidencias | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** rotación inmediata después del alta o primer acceso, cada 90 días mientras siga vigente y ante exposición o cambio de acceso privilegiado |

`POSTGRES_DB`, `POSTGRES_USER`, `API_UPSTREAM`, puertos y feature flags son
configuración, no secretos. Tampoco se registrarán como secretos los identificadores
lógicos `dev/...`, `qa/...` y `prod/...` de la matriz de Semana 6.

### 3.2 Reglas de custodia e inyección

1. Solo se versionan plantillas sin valores reales. `.env.dev`, `.env.qa`,
   `.env.prod`, respaldos y volcados permanecen fuera de Git.
2. DEV puede usar un archivo local ignorado y limitado al usuario desarrollador.
3. QA y PROD reciben secretos desde el almacén protegido del ejecutor.
   **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** usar AWS Secrets Manager y limitar
   lectura al ejecutor del entorno y a la identidad del servicio consumidor; limitar
   creación, actualización y rotación al rol Backend + infraestructura.
4. Cada entorno usa valores diferentes; no se copian secretos entre DEV, QA y PROD.
5. Los comandos de evidencia deben evitar imprimir configuración efectiva o secretos.
6. El scanner pre-commit de Sesión 1 se conserva como control preventivo.
7. El principio de mínimo privilegio limita lectura y modificación al consumidor y al
   ejecutor autorizado del entorno correspondiente.

### 3.3 Procedimiento de rotación

| Paso | Acción | Evidencia esperada |
| --- | --- | --- |
| 1 | Registrar motivo, secreto, entorno, responsable y ventana según la cadencia y los disparadores propuestos en el inventario | Solicitud aprobada sin incluir el valor |
| 2 | Generar un valor distinto por entorno fuera del repositorio | Identificador o versión del secreto, nunca su contenido |
| 3 | Actualizar el almacén protegido y el consumidor coordinadamente | Resultado de inyección sanitizado |
| 4 | Reiniciar o volver a desplegar únicamente los consumidores necesarios | Servicios saludables y versión de configuración registrada |
| 5 | Validar acceso autorizado, `/health` y smoke tests aplicables | PASS/FAIL, entorno, fecha y SHA/digest |
| 6 | Revocar el valor anterior y registrar el cierre | Confirmación sin revelar credenciales |

Para `POSTGRES_PASSWORD` se coordina el cambio en PostgreSQL y backend. Para
`APP_JWT_SECRET` se comunica que los tokens anteriores dejan de ser válidos.
**PROPUESTA PARA APROBACIÓN DEL EQUIPO:** después del seeding, el rol Backend +
infraestructura entrega la credencial por el canal protegido del ejecutor, exige su
cambio en el primer acceso y revoca el valor temporal después de validar el acceso.

## 4. Política de feature flags

### 4.1 Flag candidata

| Campo | Definición |
| --- | --- |
| Nombre | `APP_FEATURE_HEALTH_DIAGNOSTICS` |
| Funcionalidad | `GET /health/diagnostics` |
| Tipo | Booleano por despliegue/entorno |
| Propietario | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** rol Backend + infraestructura; Integración + calidad aprueba su promoción y retiro |
| Default | `false` |
| OFF | El endpoint responde HTTP 404 |
| ON | El endpoint responde HTTP 200 con `status=UP` y `diagnostics=ENABLED` |
| Datos expuestos | Estado técnico estático; no incluye secretos, rutas ni credenciales |
| Fecha de retiro | No se fija una fecha calendario. **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** retirar al completar la condición siguiente |
| Condición de retiro | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** 100 % de PROD estable durante 7 días continuos, sin rollback, exposición de información ni regresión atribuible al diagnóstico; retiro aprobado por Integración + calidad y ejecutado por Backend + infraestructura |

### 4.2 Reglas de gobierno

1. Toda flag inicia deshabilitada y se configura mediante entorno, sin recompilar.
2. **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** usar
   `APP_FEATURE_<CAPACIDAD_EN_UPPER_SNAKE_CASE>`, con nombre afirmativo, default
   `false` y una sola capacidad delimitada; evitar nombres de entorno, persona o fecha.
3. Cada flag debe registrar funcionalidad, propietario, default, entornos habilitados,
   criterio de activación, rollback y condición de eliminación.
4. Una flag no puede desactivar contratos o flujos existentes del PDR. En particular,
   esta flag no interviene en reservas, autenticación, roles, base de datos ni seeders.
5. Cambiar una variable requiere reiniciar o volver a desplegar el backend; no existe
   evidencia de un servicio de flags dinámico.
6. Cuando la flag deje de ser necesaria se eliminan, en un mismo cambio trazable, la
   variable de las plantillas y del Compose, la propiedad Spring, la rama condicional
   y la documentación. Antes de hacerlo se valida el comportamiento definitivo.

## 5. Plan de canary y rollback

### 5.1 Limitación conocida

La implementación actual es una variable booleana por despliegue. No permite asignar
porcentaje de tráfico ni usuarios específicos. La progresión confirmada es por entornos:
DEV → QA → PROD. **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** en PROD ejecutar dos grupos
del mismo digest del backend, uno con la flag `false` y otro con `true`, y usar el Nginx
ya previsto como punto de entrada para repartir tráfico por peso. El alcance inicial es
10 % del tráfico de PROD hacia el grupo con la flag activa; no se segmentan personas ni
tenants y no se ejecuta el canary hasta aprobar esta ampliación de la configuración.

### 5.2 Etapas de ampliación

| Etapa | Alcance | Flag | Validación para continuar | Resultado ante fallo |
| --- | --- | --- | --- | --- |
| 0. Línea base | DEV, QA y PROD según el despliegue vigente | `false` | `/health` saludable; `/health/diagnostics` devuelve 404 | Corregir configuración antes de habilitar |
| 1. DEV | Entorno DEV | `true` | Diagnóstico 200, `/health` sin regresión, scanner y smoke tests PASS | Volver a `false` y reiniciar/republicar backend |
| 2. QA | Entorno QA con el mismo candidato identificado por SHA/digest | `true` | Mismos resultados de DEV; controles integrados y evidencia sanitizada PASS | Volver a `false`; si el problema no pertenece a la flag, regresar al digest anterior |
| 3. Canary PROD | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** 10 % del tráfico durante 30 minutos mediante Nginx ponderado | `true` en el grupo canary | Todos los umbrales de 5.3 se cumplen y Integración + calidad aprueba continuar | Desactivar la flag y dirigir 100 % al grupo estable; si persiste la regresión, restaurar el digest anterior |
| 4. Ampliación PROD | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** 25 % por 30 minutos, 50 % por 60 minutos y 100 % durante 7 días | `true` en el alcance de cada etapa | Todos los umbrales se cumplen durante la etapa y existe aprobación go/no-go | Ejecutar rollback y detener la ampliación |
| 5. Retiro | Después de cumplir la condición de eliminación | Sin flag | Comportamiento definitivo validado | Revertir el cambio de retiro si todavía es compatible y necesario |

### 5.3 Métricas y señales

| Señal | Umbral o condición respaldada |
| --- | --- |
| Salud de aplicación | `/health` devuelve 200, `status=UP` y `database=UP` |
| Comportamiento OFF | `/health/diagnostics` devuelve 404 |
| Comportamiento ON | `/health/diagnostics` devuelve 200 con la respuesta documentada |
| Disponibilidad mensual | Igual o superior a 95 %, según el PDR |
| Rendimiento de operaciones representativas | Percentil 95 igual o inferior a 3 segundos, según el PDR; no se presenta como prueba específica del diagnóstico |
| Errores y trazabilidad | Registros permiten identificar tenant, actor, acción y momento cuando aplique, según el PDR |
| Disponibilidad durante cada etapa | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** 100 % de las comprobaciones de `/health` responden 200 |
| Errores HTTP 5xx durante cada etapa | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** continuar con una tasa menor o igual a 1 %; detener si supera 1 % |
| Smoke tests de flujos existentes | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** 100 % PASS; cualquier regresión detiene la etapa |
| Seguridad | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** cero exposición de secretos o información sensible; cualquier exposición ejecuta rollback |
| Duración de observación por etapa | **PROPUESTA PARA APROBACIÓN DEL EQUIPO:** 30 minutos al 10 %, 30 minutos al 25 %, 60 minutos al 50 % y 7 días al 100 % |

Se continúa únicamente si todas las validaciones aplicables están en PASS y se cumplen
los umbrales de la tabla. Se detiene ante un healthcheck fallido, más de 1 % de errores
5xx, p95 superior a 3 segundos, un smoke test fallido, una respuesta distinta de la
esperada o cualquier exposición de información. **PROPUESTA PARA APROBACIÓN DEL EQUIPO:**
Integración + calidad es la autoridad go/no-go y consulta a Backend + infraestructura,
que ejecuta el cambio de pesos y configuración.

### 5.4 Rollback

**PROPUESTA PARA APROBACIÓN DEL EQUIPO:** Integración + calidad ordena el rollback y
Backend + infraestructura lo ejecuta y registra.

1. Detener la ampliación y registrar entorno, candidato y evidencia del fallo.
2. Cambiar `APP_FEATURE_HEALTH_DIAGNOSTICS=false` en la configuración protegida.
3. Reiniciar o volver a desplegar el backend para aplicar la variable.
4. Confirmar `/health` en 200 y `/health/diagnostics` en 404.
5. Ejecutar los smoke tests de los flujos existentes aplicables.
6. Si la desactivación no resuelve el incidente, desplegar el digest anterior conservado
   y aceptado en QA. El objetivo existente para volver saludable es 240 segundos cuando
   las imágenes están disponibles y las migraciones son compatibles.
7. Si hay una migración incompatible, aplicar el plan de recuperación de datos de
   `HU-MVP2-ORQ-005`; revertir una imagen no revierte una migración automáticamente.
8. Documentar resultado y decisión antes de reintentar el lanzamiento.

Este endpoint no modifica datos; por ello el rollback de la flag no requiere restaurar
la base. Los objetivos generales del PDR para recuperación son RPO máximo de 24 horas y
RTO máximo de 8 horas cuando sí exista recuperación de información.

## 6. Historias de endurecimiento

### HU-MVP2-SEC-001 — Configuración fail-fast

**Como** responsable del despliegue, **quiero** rechazar configuración incompleta o
insegura al inicio **para** evitar servicios aparentemente disponibles con valores inválidos.

Criterios de aceptación:

- AC1: sin `POSTGRES_PASSWORD` o `APP_JWT_SECRET`, `docker compose config --quiet`
  termina con código distinto de cero e identifica la variable sin mostrar su valor.
- AC2: con las variables obligatorias válidas, el mismo comando termina con código cero.
- AC3: un JWT vacío, de plantilla o menor a 32 caracteres impide iniciar el backend.
- AC4: `APP_PLATFORM_ADMIN_PASSWORD` solo es obligatoria cuando
  `APP_DEMO_SEED_ENABLED=true`.

### HU-MVP2-SEC-002 — Gestión segura de secretos

**Como** responsable del despliegue, **quiero** custodiar e inyectar secretos por entorno
**para** evitar credenciales en Git, imágenes y evidencias.

Criterios de aceptación:

- AC1: las plantillas contienen todas las claves necesarias y ningún valor secreto real.
- AC2: `git check-ignore` confirma que los archivos efectivos de entorno están ignorados.
- AC3: el scanner pre-commit termina en cero con contenido limpio y bloquea un secreto
  artificial con código distinto de cero, sin registrar su valor en la evidencia final.
- AC4: DEV, QA y PROD usan valores distintos; la comprobación registra solo PASS/FAIL.
- AC5: el equipo aprueba o ajusta los propietarios, la frecuencia de 90 días y los
  disparadores de rotación propuestos antes de ejecutar el plan.

### HU-MVP2-SEC-003 — Feature flag de diagnóstico

**Como** operador, **quiero** habilitar el diagnóstico de salud mediante configuración
**para** separar el despliegue del momento de liberación.

Criterios de aceptación:

- AC1: sin definir la variable, `GET /health/diagnostics` devuelve 404.
- AC2: con `APP_FEATURE_HEALTH_DIAGNOSTICS=false`, devuelve 404; con `true`, devuelve
  200 y únicamente `status=UP`, `diagnostics=ENABLED`.
- AC3: cambiar la flag no modifica `GET /health`, reservas, autenticación, roles,
  persistencia ni seeders.
- AC4: el equipo aprueba o ajusta propietario, condición de retiro y convención general
  antes de promover la flag a PROD.

### HU-MVP2-SEC-004 — Entrega progresiva

**Como** equipo, **quiero** promover el mismo candidato de DEV a QA y PROD
**para** ampliar el alcance solo después de validar la etapa anterior.

Criterios de aceptación:

- AC1: la evidencia identifica entorno, fecha, SHA y digest sin secretos.
- AC2: DEV y QA validan OFF/ON, `/health` y smoke tests antes de solicitar PROD.
- AC3: PROD utiliza los mismos digests aprobados en QA, cambiando solo su configuración.
- AC4: el equipo aprueba o ajusta el enrutamiento Nginx, las etapas 10 % → 25 % → 50 %
  → 100 %, sus duraciones, umbrales y autoridad go/no-go antes del canary.
- AC5: un fallo impide promover o ampliar la entrega.

### HU-MVP2-SEC-005 — Rollback verificable

**Como** operador, **quiero** desactivar la funcionalidad y recuperar el candidato
anterior **para** restaurar el servicio ante una regresión.

Criterios de aceptación:

- AC1: el ensayo en QA cambia la flag a `false`, reinicia/republica el backend y confirma
  `/health/diagnostics` en 404 con `/health` en 200.
- AC2: si desactivar la flag no resuelve el fallo, se despliega el digest anterior y
  queda saludable dentro del objetivo existente de 240 segundos.
- AC3: el registro conserva candidato, causa, tiempos y resultados, sin secretos.
- AC4: para migraciones incompatibles se usa el procedimiento de recuperación de
  `HU-MVP2-ORQ-005`; no se afirma que revertir una imagen revierta la base de datos.

## 7. Evidencia requerida para cierre

Cada historia solo pasa a Done con evidencia fechada que identifique entorno,
SHA/digest, comandos o solicitudes ejecutadas, códigos de salida y PASS/FAIL. Una
planificación o revisión estática no reemplaza pruebas runtime.

## 8. Pendientes de decisión del equipo

### Decisiones confirmadas por las fuentes

- Secretos separados por entorno, fuera de Git e inyectados al iniciar.
- Flujo DEV → QA → PROD con el mismo SHA/digest promovido desde QA.
- `APP_FEATURE_HEALTH_DIAGNOSTICS=false` por defecto y comportamiento HTTP OFF/ON.
- Rollback principal mediante flag `false`, seguido de reinicio o redespliegue; digest
  anterior como mecanismo adicional.
- Disponibilidad mensual mínima de 95 %, p95 máximo de 3 segundos para las operaciones
  representativas, RPO de 24 horas y RTO de 8 horas definidos por el PDR.

### Propuestas que requieren aprobación del equipo

- Roles Backend + infraestructura e Integración + calidad como propietarios y autoridades.
- AWS Secrets Manager como almacén de QA/PROD y la política de acceso propuesta.
- Rotación cada 90 días y los disparadores extraordinarios documentados.
- Cambio en primer acceso y revocación de la credencial temporal del administrador.
- Convención `APP_FEATURE_<CAPACIDAD_EN_UPPER_SNAKE_CASE>`.
- Retiro de la flag después de 7 días estables al 100 % de PROD.
- Dos grupos del mismo digest y Nginx ponderado para 10 % → 25 % → 50 % → 100 %.
- Duraciones, tasa máxima de 1 % de errores 5xx, smoke tests en 100 % PASS y cero
  exposiciones de información.
- Integración + calidad como autoridad go/no-go y de rollback; Backend + infraestructura
  como ejecutor.

Estas propuestas completan un plan ejecutable, pero no autorizan el canary en PROD
hasta que el equipo las apruebe o registre sus ajustes.
