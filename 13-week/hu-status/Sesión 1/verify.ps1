param([string]$ProductRoot, [switch]$Resume)
$ErrorActionPreference = 'Stop'
if ($ProductRoot) { $env:WORKSHOP_PRODUCT_ROOT = (Resolve-Path -LiteralPath $ProductRoot).Path }
$nodeArguments = @((Join-Path $PSScriptRoot 'verify.mjs'))
if ($Resume) { $nodeArguments += '--resume' }
& node @nodeArguments
exit $LASTEXITCODE
