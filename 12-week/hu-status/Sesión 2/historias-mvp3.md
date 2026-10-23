# Historias de despliegue para MVP 3

Los identificadores **DEP-01 a DEP-07 son referencias locales de planificación**, no HU oficiales
creadas en el tablero. El líder debe enlazarlas con las HU de infraestructura reales antes de llevarlas
a repositorios de producto. Estados: propuesta, validación parcial local o pendiente; no se confunde
la entrega académica terminada con una funcionalidad de producción terminada.

## DEP-01 — Publicar un candidato inmutable

Como responsable de despliegue, quiero que CI publique una imagen comprobada para promover el mismo artefacto.

- Dado un candidato revisado con pruebas correctas, cuando CI lo construye, entonces publica una imagen
  y un manifiesto con commit de origen, digest del registro, componente y evidencia de pruebas.
- Dado ese manifiesto, cuando se promueve a QA/main, entonces el despliegue utiliza exactamente ese digest
  y no ejecuta una nueva compilación. La prueba compara los digests observados en los tres ambientes.
- Dadas pruebas fallidas o credenciales ausentes, cuando corre CI, entonces no publica un candidato aprobado.

Estado: **pendiente**. Dueño propuesto: infraestructura, asignación por Jhon. Dependencias: permisos de CI/registro.

## DEP-02 — Recrear ambientes mediante IaC

Como equipo, quiero reproducir desarrollo, QA y producción con archivos declarativos para evitar configuración manual.

- Dados los mismos artefactos y la configuración de cada ambiente, cuando se aplica IaC, entonces los
  servicios pasan sus comprobaciones y los IDs/digests coinciden entre ambientes.
- Dados dos ambientes, cuando se levantan, entonces sus nombres, redes y puertos no colisionan.
- Dado un host de prueba sin contenedores del ensayo, cuando se recrea con esos archivos, entonces vuelve
  a responder la página y el gateway sin ajustes manuales. El registro documenta los prerrequisitos de imágenes.

Estado: **validación parcial local**, evidencia `promocion-imagenes.json`, `compose-*.yml` y `ensayo.log`.
Falta el host remoto, el aprovisionamiento y el sistema completo. Dueño propuesto: infraestructura. Depende de DEP-01 en producción.

## DEP-03 — Configurar sin reconstruir la SPA

Como operador, quiero seleccionar configuración pública y secretos por ambiente sin cambiar el artefacto.

- Dada la misma imagen del front en dos ambientes, cuando arranca, entonces las solicitudes reales del navegador
  van al gateway del ambiente correcto sin recompilar. La prueba verifica tráfico de red, no solo una variable Docker.
- Dado un secreto de servidor, cuando se examinan Git, los recursos de la SPA y su configuración pública,
  entonces el secreto no aparece.
- Dado un archivo de configuración obligatorio ausente o inválido, cuando se despliega, entonces la validación aborta.

Estado: **pendiente en producto**. El endpoint del proxy del ensayo solo prueba metadatos por ambiente.
Dueño propuesto: dueño del front; asignación por Jhon. Depende de DEP-02.

## DEP-04 — Conmutar blue-green con controles

Como operador, quiero enviar tráfico a la versión nueva solo después de comprobarla para reducir interrupciones.

- Dada green saludable y las pruebas de humo correctas, cuando se conmuta, entonces NGINX valida y recarga
  configuración y se observa la versión nueva en solicitudes posteriores.
- Dada green detenida o no saludable, cuando se intenta conmutar, entonces se rechaza y blue sigue atendiendo.
- Dada carga continua, cuando se despliega y revierte, entonces no hay solicitudes HTTP fallidas en el ensayo
  y hay respuestas observadas de ambas versiones. Se archivan conteos y log sin afirmar disponibilidad universal.

Estado: **validación parcial local del front**. Evidencia: `trafico.log`, `resultado.json`, `ensayo.log`.
Faltan pruebas de assets, portales y negocio integrado. Dueño propuesto: front e infraestructura. Depende de DEP-02/03.

## DEP-05 — Recuperar en menos de cinco minutos

Como persona de guardia, quiero revertir a la versión anterior con un procedimiento probado para recuperar el servicio.

- Dada una regresión tras conmutar, cuando se sigue el runbook, entonces se observa blue y pasan cinco
  comprobaciones consecutivas de front/gateway antes de 300 segundos desde que empieza la reversión.
- Dada la versión anterior no saludable, cuando se intenta volver, entonces el script rechaza la operación
  y el operador escala; no registra una recuperación falsa.
- Dada una ejecución, cuando termina, entonces conserva duración, fecha, tráfico y versión recuperada.

Estado: **validación parcial local**: se ensaya recuperación de green a blue; el rechazo se prueba con green
detenida usando el mismo control. Recuperación funcional completa y ante blue no saludable pendientes.
Dueño propuesto: infraestructura con líder. Depende de DEP-04 y DEP-06 si hay datos.

## DEP-06 — Migrar conservando compatibilidad y datos

Como dueño de datos, quiero desplegar cambios compatibles y respaldados para conservar la opción de recuperación.

- Dada una migración, cuando se prepara QA/main, entonces existe respaldo con restauración ensayada en aislamiento.
- Dadas versión anterior y nueva de la API, cuando se aplica la fase expand, entonces ambas pasan contratos
  contra el esquema expandido. La fase contract se programa tras retirar consumidores antiguos.
- Dado cada dominio, cuando migra, entonces usa su `-db`, su tabla de control y su esquema en la instancia
  compartida del motor; no se elimina ningún volumen de QA/main.

Estado: **pendiente**, no hay bases en este ensayo. Dueños: cada -db y cada infra de motor. Depende de su esquema y backup.

## DEP-07 — Autorizar y auditar promociones

Como líder, quiero puertas de calidad y una bitácora de release para saber qué se ejecuta y quién lo aprobó.

- Dado un candidato sin evidencia QA o sin aprobación requerida para main, cuando se intenta promover,
  entonces la promoción se bloquea.
- Dada una promoción de código, cuando se revisa su PR, entonces proviene de una hija del destino y los
  commits re-aplicados incluyen `cherry picked from commit ...` con SHA existente en origen.
- Dado un release, cuando se cierra, entonces quedan artefactos, configuración, migraciones, aprobaciones,
  pruebas funcionales y resultado del despliegue/reversión enlazados. No se anotan tokens ni secretos.

Estado: **pendiente en producto**. Dueños: Jhon y responsables de repositorios; aprobación docente según norma.
Depende de DEP-01 a DEP-06 para una release completa.

## Orden y cierre de MVP 3

DEP-01 y DEP-02 habilitan artefactos/ambientes; DEP-03 y DEP-06 preparan configuración/datos; después
DEP-04 y DEP-05 verifican despliegue/recuperación; DEP-07 controla las promociones durante todo el trabajo.
El MVP 3 de despliegue se cierra cuando los criterios pasan en el alcance integrado acordado y el tablero
contiene evidencia real. El laboratorio de esta carpeta es evidencia parcial para esa implementación.
