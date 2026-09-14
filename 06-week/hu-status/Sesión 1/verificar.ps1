param([string]$BaseUrl = 'http://localhost:8086')
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

function Compose {
    & docker compose @args | Out-Host
    if ($LASTEXITCODE -ne 0) { throw "Falló docker compose $args" }
}

Start-Transcript -Path 'Evidencias/02-verificacion.txt' -Force
try {
    Get-Date -Format o
    Compose up -d --wait --wait-timeout 240
    Compose ps
    $page = Invoke-WebRequest "$BaseUrl/" -UseBasicParsing
    if ($page.StatusCode -ne 200 -or $page.Content -notmatch '<app-root') {
        throw 'El frontend no entrega la aplicación Angular.'
    }
    Write-Output 'PASS: frontend Angular HTTP 200'
    $health = Invoke-RestMethod "$BaseUrl/health"
    if ($health.status -ne 'UP' -or $health.database -ne 'UP') { throw 'Salud incorrecta' }
    $health | ConvertTo-Json
    $tenantId = 'week06-' + [guid]::NewGuid().ToString('N').Substring(0,12)
    $body = @{
        tenantId = $tenantId
        commercialName = 'Demo persistencia Semana 06'
        actorId = 'sesion-1'
        administrator = @{
            name = 'Administrador Demo'
            email = "$tenantId@example.test"
            password = 'DemoLocal#2026'
            passwordConfirmation = 'DemoLocal#2026'
        }
    } | ConvertTo-Json -Depth 4
    $created = Invoke-WebRequest "$BaseUrl/api/tenants" -Method Post -ContentType 'application/json' -Body $body -UseBasicParsing
    if ($created.StatusCode -ne 201) { throw 'No se creó el tenant' }
    Write-Output "PASS: POST /api/tenants -> 201; tenant=$tenantId"
    $before = Invoke-RestMethod "$BaseUrl/api/tenants/$tenantId"
    $before | ConvertTo-Json -Depth 5

    # Solo recrea este proyecto de Compose. Conserva el volumen nombrado.
    Compose down
    Compose up -d --wait --wait-timeout 240
    $after = Invoke-RestMethod "$BaseUrl/api/tenants/$tenantId"
    if (($before | ConvertTo-Json -Compress) -ne ($after | ConvertTo-Json -Compress)) {
        throw 'El tenant no sobrevivió a la recreación'
    }
    Write-Output 'PASS: persistencia tras down + up'

    # Verifica que /health detecta pérdida real de la base de datos.
    try {
        Compose stop postgres
        $status = & curl.exe -s -o NUL -w '%{http_code}' "$BaseUrl/health"
        if ($LASTEXITCODE -ne 0 -or $status -ne '503') { throw "Se esperaba 503 sin BD, recibido $status" }
        Write-Output 'PASS: /health devuelve 503 con PostgreSQL detenido'
    } finally {
        Compose up -d --wait --wait-timeout 240
    }
    $health = Invoke-RestMethod "$BaseUrl/health"
    if ($health.status -ne 'UP') { throw 'El backend no se recuperó' }
    Write-Output 'PASS: recuperación tras restaurar PostgreSQL'
    Compose ps
    docker network inspect multitour-week06_multitour --format '{{range .Containers}}{{.Name}} {{.IPv4Address}}{{println}}{{end}}' | Out-Host
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo inspeccionar la red' }
    docker volume inspect multitour-week06_postgres-data --format '{{.Name}} {{.Driver}}' | Out-Host
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo inspeccionar el volumen' }
} finally {
    Stop-Transcript
}
