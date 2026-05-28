#!/usr/bin/env pwsh
# SmartWorkz Toolkit — git pre-commit hook
# Blocks raw terminal commits that bypass /swd-submit.
# /swd-submit writes commit_token to session.state before each git commit call.
# This hook reads the token, allows the commit if present, and clears it (one-time use).

$statePath = ".claude/session.state"
$state = $null

if (Test-Path $statePath) {
    try {
        $state = Get-Content $statePath -Raw -ErrorAction SilentlyContinue | ConvertFrom-Json
    } catch {
        $state = $null
    }
}

if (-not $state -or -not $state.commit_token) {
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "  ║  BLOCKED: Direct git commit not allowed.                  ║" -ForegroundColor Red
    Write-Host "  ╠══════════════════════════════════════════════════════════╣" -ForegroundColor Yellow
    Write-Host "  ║  Use /swd-submit in Claude Code.                            ║" -ForegroundColor Yellow
    Write-Host "  ║  It updates ADO, README, and CHANGELOG automatically.     ║" -ForegroundColor Yellow
    Write-Host "  ╚══════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Consume token — one-time use per commit
$state.commit_token = $null
$state | ConvertTo-Json -Depth 10 | Set-Content $statePath
exit 0
