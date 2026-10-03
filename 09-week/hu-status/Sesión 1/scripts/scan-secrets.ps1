param(
    [switch]$Staged
)

$ErrorActionPreference = 'Stop'
$patterns = @(
    '(?i)(password|secret|token|api[_-]?key)\s*[:=]\s*(?:"[^"\r\n]{8,}"|''[^''\r\n]{8,}'')',
    '(?im)^(?:[A-Z][A-Z0-9_]*(?:PASSWORD|SECRET|TOKEN|API[_-]?KEY))\s*=\s*(?!\$\{|<|\?|\s*$)[^\s]{8,}$',
    '-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----',
    '(?i)gh[pousr]_[A-Za-z0-9_]{20,}'
)

if ($Staged) {
    $content = git diff --cached --binary -- . ':(exclude)*.env.example' ':(exclude)*scan-secrets.ps1'
} else {
    $content = Get-ChildItem -Recurse -File | Where-Object {
        $_.FullName -notmatch '\\(\.git|node_modules|target|dist)\\' -and
        $_.Name -notmatch '^\.env\.example$'
    } | Get-Content -Raw
}

# Existing unit-test fixtures are deliberately non-secret values. They remain
# scanned; this only prevents known fixtures from being reported as credentials.
foreach ($fixture in @('Password1!', 'Multitour#2026', 'jwt-token', 'jwt-token-abc', 'signup-password', 'signup-confirm')) {
    $content = $content -replace [regex]::Escape($fixture), 'x'
}

$matches = foreach ($pattern in $patterns) {
    [regex]::Matches(($content -join "`n"), $pattern)
}

if ($matches.Count -gt 0) {
    Write-Error 'Secret scan failed: possible credential detected.'
    exit 1
}

Write-Output 'Secret scan passed.'
