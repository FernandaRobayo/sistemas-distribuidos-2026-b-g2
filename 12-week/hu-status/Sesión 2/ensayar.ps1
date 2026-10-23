param([ValidateSet('All','Cleanup')][string]$Action = 'All')
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$ev = Join-Path $PSScriptRoot 'Evidencias'
New-Item -ItemType Directory -Force $ev | Out-Null
$log = Join-Path $ev 'ensayo.log'
$script:envName = 'dev'
function DC {
    param([string[]]$Arguments)
    $ErrorActionPreference = 'Continue' # Docker emits normal progress on stderr in Windows PowerShell.
    $output = & docker compose --env-file "env/$script:envName.env.example" @Arguments 2>&1
    if ($LASTEXITCODE -ne 0) { throw "docker compose $Arguments failed: $output" }
    return $output
}
function Note($message) {
    $line = "$(Get-Date -Format o) $message"
    Write-Host $line
    Add-Content $log $line -Encoding UTF8
}
function Fetch($path = '/') {
    $response = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$script:port$path" -TimeoutSec 5
    if ($response.StatusCode -ne 200) { throw "HTTP $($response.StatusCode) on $path" }
    return $response
}
function AssertRelease($version) {
    $response = Fetch
    if ($response.Headers['X-Release'] -ne $version) { throw "Expected release $version" }
}
function Healthy($service) {
    $id = DC -Arguments @('ps','-a','-q',$service)
    $state = & docker inspect --format '{{.State.Running}} {{.State.Health.Status}}' $id
    if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect service' }
    return ($state -eq 'true healthy')
}
function StartLab {
    # Copia determinista de configuración antes de iniciar NGINX. Evita bind mounts
    # incompatibles con algunas rutas Windows de Docker Desktop; no modifica imágenes.
    DC -Arguments @('create') | Out-Null
    DC -Arguments @('cp','proxy/nginx.conf','proxy:/etc/nginx/nginx.conf') | Out-Null
    DC -Arguments @('cp',"runtime/$script:envName",'proxy:/etc/nginx/active') | Out-Null
    DC -Arguments @('up','-d','--wait','--wait-timeout','90') | Out-Null
}
function SwitchRelease($color, $version) {
    if (-not (Healthy $color)) { Note "REJECTED $color is not running and healthy"; return $false }
    $dir = "runtime/$script:envName"
    $previousUpstream = Get-Content "$dir/upstream.conf" -Raw
    $previousRelease = Get-Content "$dir/release.conf" -Raw
    try {
        Set-Content "$dir/upstream.conf" "server ${color}:8080;" -Encoding ascii
        Set-Content "$dir/release.conf" "add_header X-Release $version always;" -Encoding ascii
        DC -Arguments @('cp',"$dir/upstream.conf",'proxy:/etc/nginx/active/upstream.conf') | Out-Null
        DC -Arguments @('cp',"$dir/release.conf",'proxy:/etc/nginx/active/release.conf') | Out-Null
        DC -Arguments @('exec','-T','proxy','nginx','-t') | Out-Null
        DC -Arguments @('exec','-T','proxy','nginx','-s','reload') | Out-Null
        $verified = $false
        for ($attempt = 0; $attempt -lt 50; $attempt++) {
            try { AssertRelease $version; $verified = $true; break } catch { Start-Sleep -Milliseconds 100 }
        }
        if (-not $verified) { throw 'Release not observed after reload' }
        Note "VERIFIED $color $version"
        return $true
    } catch {
        Set-Content "$dir/upstream.conf" $previousUpstream -Encoding ascii
        Set-Content "$dir/release.conf" $previousRelease -Encoding ascii
        DC -Arguments @('cp',"$dir/upstream.conf",'proxy:/etc/nginx/active/upstream.conf') | Out-Null
        DC -Arguments @('cp',"$dir/release.conf",'proxy:/etc/nginx/active/release.conf') | Out-Null
        DC -Arguments @('exec','-T','proxy','nginx','-t') | Out-Null
        DC -Arguments @('exec','-T','proxy','nginx','-s','reload') | Out-Null
        throw
    }
}
if ($Action -eq 'Cleanup') {
    foreach ($name in @('dev','qa','main')) {
        $script:envName = $name
        DC -Arguments @('down','--remove-orphans') | Out-Null
    }
    exit 0
}
$runId = [guid]::NewGuid().ToString()
# Invalidar el éxito anterior antes de cualquier operación que pueda fallar.
foreach ($file in @('resultado.json','promocion-imagenes.json','trafico.log','compose-ps.txt',
    'compose-dev.yml','compose-qa.yml','compose-main.yml')) {
    $previousEvidence = Join-Path $ev $file
    if (Test-Path -LiteralPath $previousEvidence) { Remove-Item -LiteralPath $previousEvidence }
}
Set-Content $log '' -Encoding UTF8
function SaveState($status, $detail) {
    [ordered]@{run_id=$runId;status=$status;date=(Get-Date -Format o);detail=$detail} |
        ConvertTo-Json | Set-Content (Join-Path $ev 'estado.json') -Encoding UTF8
}
SaveState 'running' 'Rehearsal started; no successful result is available yet.'
$loadName = 'mt-s12s2-load'
$manifest = @()
$rollbackSeconds = $null
$rehearsalResult = $null
$runFailed = $false
try {
    foreach ($name in @('dev','qa','main')) {
        $script:envName = $name
        $settings = @{}
        Get-Content "env/$name.env.example" | ForEach-Object {
            if ($_ -match '^([^#=]+)=(.*)$') { $settings[$matches[1]] = $matches[2] }
        }
        $script:port = $settings.HTTP_PORT
        $dir = "runtime/$name"
        New-Item -ItemType Directory -Force $dir | Out-Null
        Set-Content "$dir/upstream.conf" 'server blue:8080;' -Encoding ascii
        Set-Content "$dir/release.conf" 'add_header X-Release v1.0.0 always;' -Encoding ascii
        @{environment=$name; apiBase='/gateway/api/v1'; scope='local-lab-metadata'} |
            ConvertTo-Json | Set-Content "$dir/config.json" -Encoding ascii
        DC -Arguments @('config','--quiet') | Out-Null
        DC -Arguments @('config') | Set-Content "$ev/compose-$name.yml" -Encoding UTF8
        Note "START $name port=$script:port"
        StartLab
        AssertRelease 'v1.0.0'
        $config = (Fetch '/deployment-config.json').Content | ConvertFrom-Json
        if ($config.environment -ne $name) { throw 'Environment configuration mismatch' }
        if (((Fetch '/gateway/health').Content | ConvertFrom-Json).status -ne 'ok') { throw 'Gateway unhealthy' }
        foreach ($service in @('blue','green','gateway','proxy')) {
            $id = DC -Arguments @('ps','-q',$service)
            $image = & docker inspect --format '{{.Image}}' $id
            if ($LASTEXITCODE -ne 0) { throw 'Image inspection failed' }
            $key = @{blue='BLUE_IMAGE';green='GREEN_IMAGE';gateway='GATEWAY_IMAGE';proxy='PROXY_IMAGE'}[$service]
            if ($image -ne $settings[$key]) { throw "Wrong image for $service" }
            $manifest += [pscustomobject]@{environment=$name;service=$service;image_id=$image}
        }
        if ($name -eq 'main') {
            $output = & docker create --name $loadName --network mt-s12s2-main_default $settings.PROXY_IMAGE sh /carga.sh 2>&1
            if ($LASTEXITCODE -ne 0) { throw "Load generator failed: $output" }
            & docker cp ./carga.sh "${loadName}:/carga.sh"
            if ($LASTEXITCODE -ne 0) { throw 'Cannot copy load generator' }
            & docker start $loadName | Out-Null
            if ($LASTEXITCODE -ne 0) { throw 'Cannot start load generator' }
            Start-Sleep -Seconds 2
        }
        if (-not (SwitchRelease 'green' 'v2.0.0')) { throw 'Promotion rejected' }
        if ($name -eq 'main') {
            Start-Sleep -Seconds 2
            $timer = [Diagnostics.Stopwatch]::StartNew()
            if (-not (SwitchRelease 'blue' 'v1.0.0')) { throw 'Rollback rejected' }
            # Verify front and gateway repeatedly before stopping the recovery timer.
            for ($i=0; $i -lt 5; $i++) {
                AssertRelease 'v1.0.0'
                Fetch '/gateway/health' | Out-Null
                Start-Sleep -Milliseconds 100
            }
            $timer.Stop()
            $rollbackSeconds = [math]::Round($timer.Elapsed.TotalSeconds,3)
            if ($rollbackSeconds -ge 300) { throw 'Rollback exceeded 5 minutes' }
            Note "ROLLBACK_CONFIRMED seconds=$rollbackSeconds target_less_than=300"
            DC -Arguments @('stop','green') | Out-Null
            if (SwitchRelease 'green' 'v2.0.0') { throw 'Unhealthy destination was accepted' }
            AssertRelease 'v1.0.0'
            Note 'NEGATIVE_TEST passed; unhealthy green rejected; blue remains active'
            Start-Sleep -Seconds 2
            & docker logs $loadName 2>&1 | Set-Content "$ev/trafico.log" -Encoding UTF8
            if ($LASTEXITCODE -ne 0) { throw 'Cannot collect load logs' }
            & docker rm -f $loadName | Out-Null
            if ($LASTEXITCODE -ne 0) { throw 'Cannot stop load generator' }
            $lines = Get-Content "$ev/trafico.log"
            $front = @($lines | Where-Object { $_ -match '^front ' })
            $gateway = @($lines | Where-Object { $_ -match '^gateway ' })
            $failed = @($lines | Where-Object { $_ -match 'FAIL' }).Count
            $greenCount = @($front | Where-Object { $_ -eq 'front v2.0.0' }).Count
            $blueCount = @($front | Where-Object { $_ -eq 'front v1.0.0' }).Count
            if ($failed -gt 0 -or $greenCount -eq 0 -or $blueCount -eq 0 -or $gateway.Count -eq 0) { throw 'Traffic acceptance failed' }
            DC -Arguments @('down') | Out-Null
            Note 'RECREATE main from the same IaC and image IDs'
            StartLab
            AssertRelease 'v1.0.0'
            Fetch '/gateway/health' | Out-Null
            Note 'RECREATE verified; front and gateway HTTP 200'
            $rehearsalResult = [ordered]@{run_id=$runId;status='passed';date=(Get-Date -Format o);scope='local front blue-green and gateway health';
                rollback_seconds=$rollbackSeconds;rollback_target_seconds=300;
                front_requests=$front.Count;blue_requests=$blueCount;green_requests=$greenCount;
                gateway_requests=$gateway.Count;failed_requests=$failed;
                unhealthy_target_rejected=$true;main_recreated=$true}
            DC -Arguments @('ps') | Set-Content "$ev/compose-ps.txt" -Encoding UTF8
        }
        $manifest | ConvertTo-Json | Set-Content "$ev/promocion-imagenes.json" -Encoding UTF8
        Note "PASS $name"
        DC -Arguments @('down') | Out-Null
    }
} catch {
    $runFailed = $true
    SaveState 'failed' $_.Exception.Message
    Note "FAILED $($_.Exception.Message)"
    throw
} finally {
    # Solo recursos del ensayo. No se eliminan volúmenes ni recursos del producto.
    $ErrorActionPreference = 'Continue'
    $cleanupErrors = @()
    $loadId = & docker ps -a -q --filter "name=^${loadName}$" 2>&1
    if ($LASTEXITCODE -ne 0) { $cleanupErrors += 'Cannot inspect load generator during cleanup' }
    elseif ($loadId) {
        & docker rm -f $loadName 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { $cleanupErrors += 'Cannot remove load generator' }
    }
    foreach ($name in @('dev','qa','main')) {
        $script:envName = $name
        try { DC -Arguments @('down','--remove-orphans') | Out-Null }
        catch { $cleanupErrors += $_.Exception.Message }
    }
    if ($cleanupErrors.Count -gt 0) {
        $detail = $cleanupErrors -join '; '
        SaveState 'failed' "Cleanup failed: $detail"
        if (-not $runFailed) { throw "Cleanup failed: $detail" }
    }
}
# Solo publicar éxito cuando todas las verificaciones y la limpieza terminaron.
$ErrorActionPreference = 'Stop'
$rehearsalResult | ConvertTo-Json | Set-Content "$ev/resultado.json" -Encoding UTF8
SaveState 'passed' 'All acceptance checks and cleanup completed.'
Note 'PASS all acceptance checks; isolated lab containers removed'
