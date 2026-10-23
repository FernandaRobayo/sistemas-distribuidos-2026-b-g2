$ErrorActionPreference = 'Stop'
$lab = Split-Path $PSScriptRoot -Parent
$fixture = Join-Path $lab 'runtime/failure-check'
New-Item -ItemType Directory -Force "$fixture/env","$fixture/Evidencias","$fixture/proxy" | Out-Null
Copy-Item -LiteralPath "$lab/ensayar.ps1","$lab/docker-compose.yml","$lab/carga.sh" -Destination $fixture
Copy-Item -LiteralPath "$lab/proxy/nginx.conf" -Destination "$fixture/proxy"
foreach ($name in @('dev','qa','main')) {
    $content = Get-Content -Raw -LiteralPath "$lab/env/$name.env.example"
    $content = $content.Replace("mt-s12s2-$name", "mt-s12s2-failure-$name")
    if ($name -eq 'dev') {
        $content = $content -replace 'GREEN_IMAGE=sha256:[a-f0-9]+', ('GREEN_IMAGE=sha256:' + ('0' * 64))
    }
    Set-Content -LiteralPath "$fixture/env/$name.env.example" -Value $content -Encoding ascii
}
Set-Content -LiteralPath "$fixture/Evidencias/resultado.json" -Value '{"status":"passed","old":true}'
$ErrorActionPreference = 'Continue'
$output = & powershell -NoProfile -ExecutionPolicy Bypass -File "$fixture/ensayar.ps1" 2>&1
$code = $LASTEXITCODE
$ErrorActionPreference = 'Stop'
$state = Get-Content -Raw -LiteralPath "$fixture/Evidencias/estado.json" | ConvertFrom-Json
if ($code -eq 0 -or $state.status -ne 'failed') { throw 'Injected failure was not reported' }
if (Test-Path -LiteralPath "$fixture/Evidencias/resultado.json") { throw 'Previous success survived failed execution' }
[ordered]@{test='Unavailable image after a seeded previous successful result';
    exit_code=$code;status=$state.status;previous_success_removed=$true;
    failed_run_id=$state.run_id;date=(Get-Date -Format o)} |
    ConvertTo-Json | Set-Content -LiteralPath "$lab/Evidencias/prueba-fallo.json" -Encoding UTF8
Write-Output 'PASS: injected failure returns nonzero, records failed state and removes previous success.'
