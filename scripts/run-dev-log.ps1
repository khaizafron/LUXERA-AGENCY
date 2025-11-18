# Run Next dev server and stream output to `dev.log` in repo root.
# Usage: Open PowerShell in repo root and run:
#   .\scripts\run-dev-log.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = Resolve-Path (Join-Path $scriptDir '..')
Set-Location $repoRoot
Write-Host "Running from repo root: $(Get-Location)"

$envFile = Join-Path $repoRoot '.env.local'
if (Test-Path $envFile) {
  Write-Host ".env.local found (first lines):"
  Get-Content $envFile -TotalCount 10 | ForEach-Object { Write-Host "  $_" }
} else {
  Write-Host ".env.local not found. Create one from .env.local.example at the repo root and add secrets." -ForegroundColor Yellow
}

Write-Host "Starting dev server; output will be saved to dev.log and printed to console..."
# Capture both stdout and stderr and write to dev.log while streaming
npm run dev *>&1 | Tee-Object -FilePath (Join-Path $repoRoot 'dev.log')
