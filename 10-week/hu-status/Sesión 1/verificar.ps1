param(
    [string]$CloneRoot = "$env:LOCALAPPDATA\Temp\multitour-week10-validation"
)
$ErrorActionPreference = 'Stop'
$evidence = Join-Path $PSScriptRoot 'Evidencias'
New-Item -ItemType Directory -Path $evidence -Force | Out-Null
$snapshots = [ordered]@{
    'multi-tour-workflow-onboard-tenant' = 'd6dd8e523dc84d284d19fc1cfbb8e2132facbbf8'
    'multi-tour-worker-event-relay' = '3588fda04f0b0af3c761fbe6bffe827fc6fd8886'
    'multi-tour-security' = 'aafda9c9bba60b3a486d0e502cb522c5d91e73c4'
}
# Uses isolated read-only source copies; never switches or edits the owner's checkout.
foreach ($repo in $snapshots.Keys) {
    $path = Join-Path $CloneRoot $repo
    if (!(Test-Path -LiteralPath $path)) {
        New-Item -ItemType Directory -Path $CloneRoot -Force | Out-Null
        git clone --branch develop --single-branch "https://github.com/code-corhuila/$repo.git" $path
        if ($LASTEXITCODE -ne 0) { throw "Clone failed: $repo" }
        git -C $path switch --detach $snapshots[$repo]
        if ($LASTEXITCODE -ne 0) { throw "Snapshot unavailable: $repo" }
    }
    $head = (git -C $path rev-parse HEAD).Trim()
    if ($head -ne $snapshots[$repo]) { throw "Snapshot differs: $repo; expected $($snapshots[$repo])" }
    if (git -C $path status --porcelain --untracked-files=no) { throw "Modified source: $repo" }
}
$container = 'week10-validation-' + [guid]::NewGuid().ToString('N').Substring(0, 12)
$previousPassword = $env:POSTGRES_PASSWORD
$previousDatabase = $env:TEST_DATABASE_URL
$password = [guid]::NewGuid().ToString('N')
$env:POSTGRES_PASSWORD = $password
$summary = @()
function Clean([string]$value) {
    return $value.Replace($password, '[REDACTED]')
}
try {
    # Disposable instance, no persistent volume and no port exposed beyond localhost.
    docker run --detach --rm --name $container --mount type=tmpfs,destination=/var/lib/postgresql -p '127.0.0.1::5432' -e POSTGRES_PASSWORD postgres:18.6-alpine | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Disposable PostgreSQL could not start' }
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        docker exec $container pg_isready -h 127.0.0.1 -U postgres *> $null
        if ($LASTEXITCODE -eq 0) { $ready = $true; break }
        Start-Sleep -Seconds 1
    }
    if (!$ready) { throw 'PostgreSQL readiness timeout' }
    $port = ((docker port $container 5432/tcp).Trim() -split ':')[-1]
    $env:TEST_DATABASE_URL = "postgres://postgres:${password}@127.0.0.1:$port/postgres?sslmode=disable"
    foreach ($repo in $snapshots.Keys) {
        Push-Location (Join-Path $CloneRoot $repo)
        try {
            $log = Join-Path $evidence "$repo.jsonl"
            # JSON exposes individual skipped tests; package-level 'ok' is insufficient.
            go test -json -count=1 ./... 2>&1 | ForEach-Object { Clean ([string]$_) } | Set-Content -Encoding UTF8 -LiteralPath $log
            $exitCode = $LASTEXITCODE
            $events = @(Get-Content -LiteralPath $log | ForEach-Object {
                try { $_ | ConvertFrom-Json } catch { }
            })
            $passedEvents = @($events | Where-Object { $_.Test -and $_.Action -eq 'pass' })
            $passed = $passedEvents.Count
            $parents = @($passedEvents | Where-Object {
                $parent = $_
                @($passedEvents | Where-Object {
                    $_.Package -eq $parent.Package -and $_.Test.StartsWith($parent.Test + '/')
                }).Count -gt 0
            })
            $leafCases = $passed - $parents.Count
            $failed = @($events | Where-Object { $_.Test -and $_.Action -eq 'fail' }).Count
            $skipped = @($events | Where-Object { $_.Test -and $_.Action -eq 'skip' }).Count
            $packageFailures = @($events | Where-Object { !$_.Test -and $_.Action -eq 'fail' }).Count
            if ($passed -eq 0 -or $packageFailures -gt 0) { $exitCode = 1 }
            $summary += [pscustomobject]@{
                repository = $repo; sha = $snapshots[$repo]; command = 'go test -json -count=1 ./...'
                exitCode = $exitCode; passedRecords = $passed; passedLeafCases = $leafCases
                failed = $failed; skipped = $skipped; packageFailures = $packageFailures
                database = $(if ($repo -eq 'multi-tour-worker-event-relay') { 'none; HTTP doubles' } else { 'disposable PostgreSQL 18.6' })
                evidence = "$repo.jsonl"
            }
            Write-Output "$repo exit=$exitCode passedRecords=$passed leafCases=$leafCases fail=$failed skip=$skipped"
        } finally { Pop-Location }
    }
    [pscustomobject]@{
        dateBogota = [TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([datetime]::UtcNow, 'SA Pacific Standard Time').ToString('yyyy-MM-ddTHH:mm:sszzz')
        scope = 'component suites; no end-to-end saga deployment; existing DDL only in disposable test databases'
        results = $summary
    } | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $evidence 'resultados.json')
    if (@($summary | Where-Object { $_.exitCode -ne 0 -or $_.failed -gt 0 -or $_.skipped -gt 0 }).Count) {
        throw 'A component suite failed or omitted tests; inspect the sanitized evidence'
    }
} finally {
    docker rm --force $container *> $null
    $env:POSTGRES_PASSWORD = $previousPassword
    $env:TEST_DATABASE_URL = $previousDatabase
}
