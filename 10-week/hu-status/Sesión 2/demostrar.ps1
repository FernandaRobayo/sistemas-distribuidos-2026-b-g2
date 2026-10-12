$ErrorActionPreference = 'Stop'
# Validates archived scenarios only; does not execute services.
& (Join-Path $PSScriptRoot 'verificar.ps1')
