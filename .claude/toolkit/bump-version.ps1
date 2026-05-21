# bump-version.ps1 — Auto-bumps SmartWorkz++ minor version after every git push
# Called by PostToolUse Bash hook in .claude/settings.json
# Reads badge from README.md, increments minor (v1.X.0), commits + pushes.

param()
$ErrorActionPreference = 'SilentlyContinue'

$readme = Get-Content 'README.md' -Raw
if (-not $readme) { exit 0 }

if ($readme -notmatch 'SmartWorkz\+\+-v(\d+)\.(\d+)\.(\d+)-purple') { exit 0 }

$major    = [int]$Matches[1]
$minor    = [int]$Matches[2]
$newMinor = $minor + 1
$newVer   = "v$major.$newMinor.0"
$date     = Get-Date -Format 'yyyy-MM-dd'

$readme = $readme `
    -replace 'SmartWorkz\+\+-v\d+\.\d+\.\d+-purple', "SmartWorkz++-$newVer-purple" `
    -replace 'Last updated: \d{4}-\d{2}-\d{2}',       "Last updated: $date"

$readme | Set-Content 'README.md' -NoNewline

git add README.md 2>&1 | Out-Null
git commit -m "chore(version): bump SmartWorkz++ to $newVer" 2>&1 | Out-Null
git push 2>&1 | Out-Null

Write-Output "{`"systemMessage`":`"[ToolKit] SmartWorkz++ bumped to $newVer`"}"
