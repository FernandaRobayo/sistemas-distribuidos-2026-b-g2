$ErrorActionPreference = 'Stop'
$evidence = Join-Path $PSScriptRoot 'Evidencias'
$auditPath = Join-Path $evidence 'auditoria-local.json'
$repo = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$report = [ordered]@{
    dateUtc = [datetime]::UtcNow.ToString('o')
    dateBogota = [TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([datetime]::UtcNow, 'SA Pacific Standard Time').ToString('yyyy-MM-dd')
    scope = 'offline validation of archived evidence inside this repository only'
    productReleaseReady = $false
    checks = @()
}
function ReadJson([string]$name) {
    return [IO.File]::ReadAllText((Join-Path $evidence $name)) | ConvertFrom-Json
}
function CheckSuite($suite) {
    $passed = @()
    foreach ($line in [IO.File]::ReadAllLines((Join-Path $evidence $suite.evidence))) {
        $event = $line | ConvertFrom-Json
        if ($event.Action -eq 'fail' -or ($event.Action -eq 'skip' -and $event.Test)) { throw "Failed or omitted archived test: $($suite.evidence)" }
        if ($event.Action -eq 'pass' -and $event.Test) { $passed += $event }
    }
    $names = [Collections.Generic.HashSet[string]]::new()
    $parents = [Collections.Generic.HashSet[string]]::new()
    foreach ($event in $passed) {
        if (!$names.Add($event.Package + '|' + $event.Test)) { throw 'Duplicate test result' }
        $name = $event.Test
        while ($name.Contains('/')) {
            $name = $name.Substring(0, $name.LastIndexOf('/'))
            [void]$parents.Add($event.Package + '|' + $name)
        }
    }
    $leaf = 0
    foreach ($name in $names) { if (!$parents.Contains($name)) { $leaf++ } }
    if ($suite.exitCode -ne 0 -or $suite.failed -ne 0 -or $suite.skipped -ne 0 -or $passed.Count -ne $suite.passedRecords -or $leaf -ne $suite.passedLeafCases) { throw "Summary differs from archived log: $($suite.evidence)" }
    return [ordered]@{ file=$suite.evidence; passedRecords=$passed.Count; passedLeafCases=$leaf; status='PASS' }
}
$original = ReadJson 'resultados.json'
$fixes = ReadJson 'correcciones.json'
foreach ($suite in (@($original.results) + @($fixes.components))) {
    $report.checks += CheckSuite $suite
}
foreach ($component in $fixes.components) {
    if ((Get-FileHash -LiteralPath (Join-Path $evidence $component.patch) -Algorithm SHA256).Hash -ne $component.patchSha256) { throw "Archived patch hash mismatch: $($component.patch)" }
}
$expected = @('TestA_happy_path_runs_three_steps_and_completes','TestA_step_two_failure_compensates_step_one','TestA_failed_compensation_ends_failed','TestC_repeated_start_returns_same_saga_and_runs_nothing')
$demo = [Collections.Generic.HashSet[string]]::new()
foreach ($line in [IO.File]::ReadAllLines((Join-Path $evidence 'fallo-compensacion.jsonl'))) {
    $event = $line | ConvertFrom-Json
    if ($event.Action -eq 'fail' -or ($event.Action -eq 'skip' -and $event.Test)) { throw 'Invalid archived demonstration' }
    if ($event.Action -eq 'pass' -and $event.Test) { [void]$demo.Add($event.Test) }
}
if ($demo.Count -ne 4) { throw 'Expected four archived component scenarios' }
foreach ($name in $expected) { if (!$demo.Contains($name)) { throw "Missing archived scenario: $name" } }
$startup = ReadJson 'arranque.json'
if (($startup.health | ConvertFrom-Json).status -ne 'ok' -or $startup.protectedRoute -ne 401 -or $startup.user -ne '10001' -or $startup.hostPorts -ne 'none') { throw 'Invalid archived startup metadata' }
[void](ReadJson 'remotos.json') # Historical snapshot only; no network request.
$docs = @(Get-ChildItem -LiteralPath $PSScriptRoot -Filter '*.md')
$docs += Get-Item -LiteralPath (Join-Path $repo '10-week/hu-status/README.md')
foreach ($file in $docs) {
    foreach ($match in [regex]::Matches([IO.File]::ReadAllText($file.FullName), '\]\(([^)]+)\)')) {
        $target = [uri]::UnescapeDataString(($match.Groups[1].Value -split '#')[0])
        if (!$target -or $target -match '^https?://') { continue }
        $path = [IO.Path]::GetFullPath((Join-Path $file.DirectoryName $target))
        if (!$path.StartsWith($repo + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase) -or (![IO.File]::Exists($path) -and $path -ne $auditPath)) { throw "Broken or external local link: $target" }
    }
}
foreach ($file in Get-ChildItem -LiteralPath $PSScriptRoot -Filter '*.ps1') {
    $tokens=$null; $errors=$null
    [System.Management.Automation.Language.Parser]::ParseFile($file.FullName,[ref]$tokens,[ref]$errors) | Out-Null
    if ($errors.Count) { throw "Invalid script syntax: $($file.Name)" }
}
$report.checks += [ordered]@{ archivedScenarios=4; archivedStartupMetadata='PASS'; patchHashes='PASS'; localLinks='PASS'; scriptSyntax='PASS' }
$report.documentationReady = $true
$report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $auditPath -Encoding UTF8
Write-Output 'PASS: archived logs, counters, patch hashes, scenarios, metadata, links and scripts'
Write-Output 'Documentation validated locally; MVP 2 release and real end-to-end demonstration remain pending'
