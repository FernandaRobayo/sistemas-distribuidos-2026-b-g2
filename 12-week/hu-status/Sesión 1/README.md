# Semana 12 · Sesión 1 — Implementación en la nube: modelos, estrategias y cero tiempo de inactividad

Actividad ("Esta semana"): desplegar el sistema en un entorno de nube (o un host similar a producción) usando la
**imagen etiquetada**, con una estrategia de **cero tiempo de inactividad** (rolling o blue-green) y **health checks**.
El plan formal de despliegue y reversión para el MVP 3 pertenece a la sesión 2 y no se define aquí.

**Alcance honesto.**
- Se despliegan **imágenes reales del producto Multi Tour**: el *front* (SPA Angular) en dos versiones y el *API Gateway*.
  No se modificó ningún repositorio del producto.
- El entorno es un **host local tipo producción** (Docker Compose), **no una nube pública**. La mecánica
  (artefacto inmutable, blue-green, health checks, reversión) es la misma que en una nube.
- Las etiquetas `v1.0.0` / `v2.0.0` se asignan con `docker tag` sobre imágenes **ya construidas** por el producto
  (no hay un registro ni un pipeline de release real todavía); ver tabla de la sección 2.
- Solo el front se despliega en blue-green. El gateway corre como instancia única: sin sus servicios de dominio detrás
  solo se puede verificar su `/health`. Los portales de dominio no se incluyeron.

## 1. Modelo de despliegue elegido

Contenedores sobre un host que los ejecuta (punto medio del espectro IaaS → contenedores → PaaS → serverless):
nosotros publicamos las imágenes y Docker las ejecuta; el balanceador y la estrategia de cambio los controlamos nosotros.

## 2. Compilar una vez, desplegar el artefacto

`ejecutar.ps1` **no recompila nada**: re-etiqueta imágenes ya construidas y ejecuta exactamente esas.

| Etiqueta de despliegue | Imagen original (construida por el producto) | ID de imagen |
|---|---|---|
| `multitour/front:v1.0.0` (blue) | `multi-tour-front:entrega-demo` (2026-10-14) | `1d672406c865` |
| `multitour/front:v2.0.0` (green) | `mt-live-front:latest` (2026-10-21) | `20e1d28b7bfb` |
| `multitour/api-gateway:v2.0.0` | `mt-live-api-gateway:latest` | `22895b384e8f` |

Un `docker tag` no cambia el ID: el artefacto que corre es el mismo que se construyó. La configuración por entorno
entra por variables de entorno (`APP_ENV`, ver [docker-compose.yml](docker-compose.yml)).

## 3. Estrategia: blue-green con balanceador

```
cliente -> proxy (NGINX :8090) -> /          -> blue  (front v1.0.0, en vivo)
                                              -> green (front v2.0.0, lista y healthy)
                               -> /gateway/ -> API Gateway (instancia única)
```

1. `blue` (v1) atiende el tráfico; `green` (v2) arranca en paralelo y **no recibe tráfico** hasta estar `healthy`.
2. El script comprueba el health check de `green` y solo entonces reescribe [proxy/active/upstream.conf](proxy/active/upstream.conf)
   y ejecuta `nginx -s reload` (recarga *graceful*: no corta conexiones en curso). El balanceador marca cada respuesta
   con `X-Release` para saber qué versión atendió.
3. Si algo falla, se vuelve a `blue` con el mismo mecanismo. `blue` nunca se apagó, así que la reversión es inmediata.

## 4. Health checks

| Servicio | Comprobación | Nota |
|---|---|---|
| Gateway | `GET /health` → `{"status":"ok"}` | endpoint real del gateway |
| Front (blue/green) | `GET /` responde 200 | el front no tiene endpoint `/health` propio (la SPA devuelve su `index.html` en cualquier ruta), por eso se comprueba que la página cargue |

- Se definen en `healthcheck` (Compose); el balanceador solo arranca cuando blue, green y gateway están `healthy`.
- El script **se niega a cambiar el tráfico** a un destino que no esté `healthy` (prueba negativa, abajo).

## 5. Resultados de la ejecución real

Se ejecutó `ejecutar.ps1` con un generador de carga ([carga.sh](carga.sh), una petición al front cada ~50 ms y una al gateway
cada 10) corriendo durante todo el proceso. Bitácora: [despliegue.log](Evidencias/despliegue.log).

| Paso | Resultado |
|---|---|
| Etiquetado de las 3 imágenes reales | OK, IDs coinciden con las originales |
| Blue, green y gateway `healthy` antes del cambio | OK |
| Cambio blue → green (front v2.0.0) bajo carga | OK, recarga graceful |
| Reversión green → blue (front v1.0.0) bajo carga | OK, inmediata |
| Prueba negativa: green detenido | El script **abortó** el cambio; el tráfico siguió en v1.0.0 |
| **Front: peticiones / fallidas** | **850 / 0** (791 atendidas por v1.0.0, 59 por v2.0.0) |
| **Gateway: peticiones / fallidas** | **85 / 0** |

Evidencias: [trafico.log](Evidencias/trafico.log) (una línea por petición con la versión que respondió),
[resultado.txt](Evidencias/resultado.txt), [compose-ps.txt](Evidencias/compose-ps.txt).

**Límites de la medición.** Una sola ejecución, en una máquina local, con tráfico sintético que carga la página inicial
del front (no flujos de negocio). Demuestra que en este escenario no se perdió ninguna petición durante el cambio y la
reversión; no prueba que el sistema completo esté listo para producción.

## 6. Errores comunes que esto evita

| Error | Cómo se evita aquí |
|---|---|
| Reconstruir otro artefacto para producción | Se re-etiqueta la imagen existente; el ID no cambia |
| Parar lo viejo y arrancar lo nuevo | La versión nueva arranca al lado; el cambio es una recarga |
| Despliegue manual por SSH + `git pull` | Un script repetible y versionado |
| Sin reversión | `blue` sigue vivo; volver es otro cambio de upstream |

## 7. Escalar horizontalmente y esperar fallos (solo conceptual en esta entrega)

No se implementó escalado ni autoscaling. Con esta base, escalar sería añadir más réplicas del front (sin estado) al
`upstream` del balanceador; el estado seguiría en bases de datos/cachés. Cualquier instancia puede fallar: el health
check la saca de rotación y el orquestador la reemplaza.

## 8. Cómo reproducir

Requiere que existan localmente las tres imágenes de origen de la sección 2.

```powershell
powershell -ExecutionPolicy Bypass -File .\ejecutar.ps1
docker compose down    # limpiar
```

Requiere Docker con Compose y `curl.exe` (incluido en Windows 10/11). Puerto usado: `8090`.
