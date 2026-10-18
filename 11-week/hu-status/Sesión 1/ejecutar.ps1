# Runs the observability lab tests and regenerates ./Evidencias (logs, spans, metrics, test results).
# Requires Go >= 1.23. Offline: standard library only. Writes only inside this folder.
$ErrorActionPreference = 'Stop'
$lab = Join-Path $PSScriptRoot 'lab'
Push-Location $lab
try {
    $env:LAB_EVIDENCE = '1'
    go vet ./...
    if ($LASTEXITCODE -ne 0) { throw 'go vet failed' }
    go test -count=1 -json ./... | Out-File -Encoding utf8 (Join-Path $PSScriptRoot 'Evidencias\pruebas.jsonl')
    if ($LASTEXITCODE -ne 0) { throw 'go test failed' }
    Write-Host 'OK: pruebas aprobadas y evidencias regeneradas en Evidencias/'
} finally { Pop-Location }
