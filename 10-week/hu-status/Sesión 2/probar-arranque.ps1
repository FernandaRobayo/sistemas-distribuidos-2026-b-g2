$ErrorActionPreference = 'Stop'
# Validates archived startup metadata only; does not execute Docker.
& (Join-Path $PSScriptRoot 'verificar.ps1')
