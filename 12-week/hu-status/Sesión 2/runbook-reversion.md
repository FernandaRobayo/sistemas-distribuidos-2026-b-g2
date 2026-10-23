# Runbook — reversión blue-green del front

Responsable del ensayo: Fernanda. Escalamiento propuesto del producto: líder Jhon y dueño de infraestructura.
Aplica al front del laboratorio, con blue anterior y green candidata. El gateway no cambia de versión.
Objetivo: menos de cinco minutos desde iniciar la reversión hasta verificar recuperación; no incluye detección.

## Síntoma y decisión

Después de cambiar a green aparece una regresión de la página, assets o funcionalidad, o fallan las
pruebas de humo. Confirmar versión y error; no reiniciar ni eliminar datos como primera respuesta.
En el laboratorio la cabecera `X-Release` identifica el color configurado; el ID del contenedor
identifica el artefacto real. Una cabecera por sí sola no acredita el contenido de una imagen.

Antes de volver: confirmar que blue sigue ejecutándose y saludable y que no hubo migraciones incompatibles.
Si blue no está saludable, detener la conmutación y escalar al dueño; conservar logs y la versión activa.
En una entrega con datos, consultar el manifiesto de migraciones antes de elegir reversión o corrección hacia adelante.

## Ensayo completo automatizado

Desde la raíz del repositorio, con Docker Desktop activo y los IDs de imagen de `env/` disponibles:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File '.\12-week\hu-status\Sesión 2\ensayar.ps1'
```

Este comando prepara los tres ambientes, promueve, revierte bajo carga, comprueba un destino detenido,
recrea main y limpia solo sus recursos. Invalida las evidencias anteriores al iniciar; consultar
`Evidencias/estado.json` para saber si la ejecución está en curso, falló o terminó correctamente.
`resultado.json` solo existe para una ejecución completada, incluida su limpieza.
No ejecutarlo simultáneamente dos veces: usa nombres de proyecto y puertos fijos.
Los archivos `.example` son suficientes en este laboratorio porque no contienen secretos.

## Operación manual sobre un ensayo main que ya esté levantado

El script completo limpia al terminar. Estos comandos son el procedimiento de contingencia durante
una ejecución o una preparación que haya dejado el proyecto main levantado; no crean el entorno.
Ejecutar desde `12-week/hu-status/Sesión 2/`:

```powershell
$releaseTimer = [Diagnostics.Stopwatch]::StartNew()
$envFile = 'env/main.env.example'
$blueId = docker compose --env-file $envFile ps -a -q blue
if ($LASTEXITCODE -ne 0 -or -not $blueId) { throw 'No existe blue' }
$blueState = docker inspect --format '{{.State.Running}} {{.State.Health.Status}}' $blueId
if ($LASTEXITCODE -ne 0 -or $blueState -ne 'true healthy') { throw 'Blue no está disponible; escalar' }

Set-Content runtime/main/upstream.conf 'server blue:8080;' -Encoding ascii
Set-Content runtime/main/release.conf 'add_header X-Release v1.0.0 always;' -Encoding ascii
docker compose --env-file $envFile cp runtime/main/upstream.conf proxy:/etc/nginx/active/upstream.conf
if ($LASTEXITCODE -ne 0) { throw 'No se pudo copiar upstream' }
docker compose --env-file $envFile cp runtime/main/release.conf proxy:/etc/nginx/active/release.conf
if ($LASTEXITCODE -ne 0) { throw 'No se pudo copiar release' }
docker compose --env-file $envFile exec -T proxy nginx -t
if ($LASTEXITCODE -ne 0) { throw 'Configuración inválida: no recargar; restaurar archivos previos' }
docker compose --env-file $envFile exec -T proxy nginx -s reload
if ($LASTEXITCODE -ne 0) { throw 'Falló la recarga; escalar' }

# Una recarga graceful puede mantener brevemente trabajadores anteriores.
$observedBlue = $false
for ($attempt=0; $attempt -lt 50; $attempt++) {
    $response = Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8094/ -TimeoutSec 5
    if ($response.StatusCode -eq 200 -and $response.Headers['X-Release'] -eq 'v1.0.0') {
        $observedBlue = $true; break
    }
    Start-Sleep -Milliseconds 100
}
if (-not $observedBlue) { throw 'Blue no se observa; escalar' }
for ($i=0; $i -lt 5; $i++) {
    $response = Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8094/ -TimeoutSec 5
    if ($response.StatusCode -ne 200 -or $response.Headers['X-Release'] -ne 'v1.0.0') {
        throw 'Versión anterior no confirmada'
    }
    $health = Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8094/gateway/health -TimeoutSec 5
    if ($health.StatusCode -ne 200) { throw 'Gateway no recuperado' }
    Start-Sleep -Milliseconds 100
}
$releaseTimer.Stop()
$releaseTimer.Elapsed.TotalSeconds
if ($releaseTimer.Elapsed.TotalSeconds -ge 300) { throw 'Objetivo de cinco minutos incumplido' }
```

El script automatizado además restaura la configuración anterior si la conmutación falla. Si el operador
manual recibe un error antes de la recarga, el tráfico conserva la configuración que NGINX ya tenía
cargada; debe restaurar archivos conocidos y validar antes de cualquier recarga posterior.

## Verificar, registrar y escalar

1. Confirmar respuesta HTTP 200 del front y cabecera anterior en cinco comprobaciones consecutivas.
2. Confirmar salud del gateway. En el sistema completo, agregar login, carga de portales y una operación
   real de catálogo, trazabilidad y revisión de errores/latencia antes de declarar recuperación funcional.
3. Guardar tiempo, fecha con zona, versión anterior, imagen real y errores observados.
4. Mantener observación propuesta de 15 minutos en producto; abrir investigación de la regresión.
5. Si no se recupera o falla la infraestructura común, escalar de inmediato a Jhon/infra. Para problemas
   de datos, incluir al dueño del motor y del dominio; nunca borrar volúmenes de QA/main.

## Limpieza del laboratorio

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File '.\ensayar.ps1' -Action Cleanup
```

No usa `down -v`, no afecta proyectos `mt-live` ni los repositorios del producto. La evidencia de duración
del ensayo está en `Evidencias/resultado.json`; las solicitudes continuas están en `Evidencias/trafico.log`.
