$ErrorActionPreference = 'Stop'
$repo = git rev-parse --show-toplevel
git -C $repo config core.hooksPath '09-week/hu-status/Sesión 1/.githooks'
Write-Output 'Git hooks installed: core.hooksPath -> 09-week/hu-status/Sesión 1/.githooks'
