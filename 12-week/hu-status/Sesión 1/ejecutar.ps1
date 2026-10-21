# Semana 12 · Sesión 1 — despliegue blue-green local del front y gateway reales de Multi Tour,
# con health checks, cero tiempo de inactividad y reversión.
# Uso:  powershell -ExecutionPolicy Bypass -File .\ejecutar.ps1
$ErrorActionPreference = 'Continue'
Set-Location $PSScriptRoot
$ev = Join-Path $PSScriptRoot 'Evidencias'
$log = Join-Path $ev 'despliegue.log'
function Log($m) { $l = "$(Get-Date -Format 'HH:mm:ss') $m"; Write-Host $l; Add-Content $log $l -Encoding utf8 }
function Health($svc) { (docker inspect --format '{{.State.Health.Status}}' "mt-release-lab-$svc-1") }
function WaitHealthy($svc) {
  for ($i=0; $i -lt 30; $i++) { if ((Health $svc) -eq 'healthy') { return $true }; Start-Sleep 1 }
  return $false
}
function Switch-To($color, $version) {
  if (-not (WaitHealthy $color)) { Log "ABORTADO: $color no está healthy, no se cambia el tráfico"; return $false }
  Set-Content 'proxy/active/upstream.conf' "server ${color}:8080;" -Encoding ascii
  Set-Content 'proxy/active/release.conf' "add_header X-Release $version always;" -Encoding ascii
  docker exec mt-release-lab-proxy-1 nginx -s reload 2>&1 | Out-Null   # recarga graceful, sin cortar conexiones
  Log "Tráfico -> $color ($version)"; return $true
}
New-Item -ItemType Directory -Force $ev | Out-Null
Remove-Item $log -ErrorAction SilentlyContinue
Set-Content 'proxy/active/upstream.conf' 'server blue:8080;' -Encoding ascii
Set-Content 'proxy/active/release.conf' 'add_header X-Release v1.0.0 always;' -Encoding ascii

Log '1) Etiquetar los artefactos ya construidos por el producto (sin recompilar)'
docker tag multi-tour-front:entrega-demo multitour/front:v1.0.0
docker tag mt-live-front:latest          multitour/front:v2.0.0
docker tag mt-live-api-gateway:latest    multitour/api-gateway:v2.0.0
docker image ls --format '{{.Repository}}:{{.Tag}} {{.ID}}' 'multitour/*' | ForEach-Object { Log "imagen $_" }

Log '2) Levantar blue (front v1, en vivo), green (front v2, lista) y gateway detrás del balanceador'
docker compose up -d --wait 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Log 'ERROR: compose up falló'; exit 1 }
Log "health blue=$(Health blue) green=$(Health green) gateway=$(Health gateway)"
Log ("gateway vía balanceador: " + (curl.exe -s http://localhost:8090/gateway/health).Trim())
Log ("front inicial atendido por: " + ((curl.exe -sI http://localhost:8090/) | Select-String -Pattern 'X-Release' | ForEach-Object { $_.Line.Trim() }))

Log '3) Generador de carga continuo durante todo el cambio'
docker rm -f mt-load 2>&1 | Out-Null
docker run -d --name mt-load --network mt-release-lab_default -v "$PSScriptRoot/carga.sh:/carga.sh:ro" alpine:latest sh /carga.sh | Out-Null
Start-Sleep 3

Log '4) Cambio blue -> green (deploy de front v2.0.0 sin tiempo de inactividad)'
[void](Switch-To 'green' 'v2.0.0'); Start-Sleep 3

Log '5) Reversión instantánea green -> blue (front v1.0.0 sigue arriba)'
[void](Switch-To 'blue' 'v1.0.0'); Start-Sleep 3

Log '6) Prueba negativa: green se cae; el script NO debe cambiar el tráfico a un destino no sano'
docker stop mt-release-lab-green-1 | Out-Null
Start-Sleep 1
$ok = Switch-To 'green' 'v2.0.0'
Log "cambio a green permitido? $ok (esperado: False)"
docker start mt-release-lab-green-1 | Out-Null

Log '7) Detener la carga y calcular resultados'
Start-Sleep 2
docker logs mt-load 2>&1 | Set-Content (Join-Path $ev 'trafico.log') -Encoding utf8
docker rm -f mt-load | Out-Null
$lines = Get-Content (Join-Path $ev 'trafico.log')
$front = $lines | Where-Object { $_ -match ' front ' }
$gw    = $lines | Where-Object { $_ -match ' gateway ' }
$res = "front: peticiones=$($front.Count) v1.0.0=$(($front | Where-Object { $_ -match 'v1.0.0' }).Count) v2.0.0=$(($front | Where-Object { $_ -match 'v2.0.0' }).Count) fallidas=$(($front | Where-Object { $_ -match 'FAIL' }).Count)`r`ngateway: peticiones=$($gw.Count) fallidas=$(($gw | Where-Object { $_ -match 'FAIL' }).Count)"
Log "RESULTADO:`r`n$res"
Set-Content (Join-Path $ev 'resultado.txt') $res -Encoding utf8
docker compose ps --format 'table {{.Name}}\t{{.Image}}\t{{.Status}}' | Set-Content (Join-Path $ev 'compose-ps.txt') -Encoding utf8
Log 'Listo. Para limpiar: docker compose down'
