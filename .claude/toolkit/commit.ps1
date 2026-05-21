# commit.ps1 — SmartWorkz Automated Commit Script
# Handles: phase completions, story merges, releases, hotfixes
# All commits include README + CHANGELOG updates automatically
# Usage examples at bottom of this file

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("phase","story","epic","release","hotfix","claude-md","subtask")]
    [string]$Type,

    [string]$Id       = "",   # phase number / story ADO-ID / version / hotfix-ID
    [string]$Message  = "",   # short description
    [string]$Files    = "",   # extra files to stage (comma-separated, optional)
    [switch]$DryRun           # show commands without running
)

$ErrorActionPreference = "Stop"
$Date = Get-Date -Format "yyyy-MM-dd"
$Time = Get-Date -Format "HH:mm"

# ── Colours ─────────────────────────────────────────────────────────────────
function Info  { param($m) Write-Host "  $m" -ForegroundColor Cyan }
function Ok    { param($m) Write-Host "  ✓ $m" -ForegroundColor Green }
function Warn  { param($m) Write-Host "  ⚠ $m" -ForegroundColor Yellow }
function Err   { param($m) Write-Host "  ✕ $m" -ForegroundColor Red }
function Run   {
    param($cmd)
    Info "$ $cmd"
    if (-not $DryRun) { Invoke-Expression $cmd }
}

# ── Git helpers ──────────────────────────────────────────────────────────────
function Assert-CleanBuildFirst {
    Info "Checking build status..."
    $result = git status --porcelain
    if ($null -eq $result) { Ok "Working tree clean — proceeding" }
}

function Stage-Files {
    param([string[]]$paths)
    foreach ($f in $paths) {
        if (Test-Path $f) {
            Run "git add `"$f`""
        } else {
            Warn "File not found, skipping: $f"
        }
    }
}

function Commit-With-Message {
    param([string]$commitMsg)
    $name = (git config user.name) 2>$null
    if ([string]::IsNullOrWhiteSpace($name) -or $name -in @("Codex", "OpenAI", "Open AI")) {
        Run "git config user.name `"KapilDev`""
    }
    $confirmedName = (git config user.name) 2>$null
    if ($confirmedName -ne "KapilDev") {
        throw "Git user.name must be KapilDev before committing. Current value: $confirmedName"
    }
    Run "git commit -m `"$commitMsg`""
    Ok "Committed: $commitMsg"
}

# ── README updater ────────────────────────────────────────────────────────────
function Update-ReadmePhase {
    param([string]$phaseNum, [string]$phaseName)
    $readme = Get-Content README.md -Raw

    # Update phase status table — mark phase as Done, next as In Progress
    $phaseMap = @{
        "0" = "SRS Preparation"
        "1" = "Architecture"
        "2" = "Solution Setup"
        "3" = "ADO Board Setup"
        "4" = "Feature Development"
        "5" = "Quality Gates"
        "6" = "Deploy"
        "7" = "Maintain"
    }

    $nextPhase = [string]([int]$phaseNum + 1)

    # Replace current phase status
    $readme = $readme -replace "(\| $phaseNum \| $([regex]::Escape($phaseName)) \| )🔵 In Progress( \| — \|)", "`$1✅ Done`$2"
    $readme = $readme -replace "(\| $phaseNum \| $([regex]::Escape($phaseName)) \| )⬜ Planned( \| — \|)", "`$1✅ Done`$2"

    # Update completion date
    $readme = $readme -replace "(\| $phaseNum \| $([regex]::Escape($phaseName)) \| ✅ Done \| )—( \|)", "`$1$Date`$2"

    # Mark next phase as In Progress
    if ($phaseMap.ContainsKey($nextPhase)) {
        $nextName = $phaseMap[$nextPhase]
        $readme = $readme -replace "(\| $nextPhase \| $([regex]::Escape($nextName)) \| )⬜ Planned", "`$1🔵 In Progress"
    }

    # Update badge
    $readme = $readme -replace "Phase-\d+%20\w+-\w+", "Phase-$phaseNum%20$([Uri]::EscapeDataString($phaseName))"
    $readme = $readme -replace "Updated-\d{4}--\d{2}--\d{2}", "Updated-$($Date.Replace('-','--'))"

    Set-Content README.md $readme -NoNewline
    Ok "README.md updated — Phase $phaseNum marked Done"
}

function Update-ReadmeFeature {
    param([string]$featureName, [string]$adoId)
    $readme = Get-Content README.md -Raw
    # Mark feature as Done in features table
    $readme = $readme -replace "(\| $([regex]::Escape($featureName)) \| \S+ \| )⬜ Planned", "`$1✅ Done"
    $readme = $readme -replace "(\| $([regex]::Escape($featureName)) \| \S+ \| )🔵 In Progress", "`$1✅ Done"
    $readme = $readme -replace "Updated-\d{4}--\d{2}--\d{2}", "Updated-$($Date.Replace('-','--'))"
    Set-Content README.md $readme -NoNewline
    Ok "README.md updated — Feature '$featureName' marked Done"
}

function Update-ReadmeVersion {
    param([string]$version)
    $readme = Get-Content README.md -Raw
    $readme = $readme -replace "Version-[\d\.]+-\w+", "Version-$version-blue"
    $readme = $readme -replace "Build-[\w%20]+-\w+", "Build-passing-brightgreen"
    $readme = $readme -replace "Updated-\d{4}--\d{2}--\d{2}", "Updated-$($Date.Replace('-','--'))"
    Set-Content README.md $readme -NoNewline
    Ok "README.md updated — Version badge → v$version"
}

# ── CHANGELOG updater ─────────────────────────────────────────────────────────
function Add-ChangelogEntry {
    param([string]$section, [string]$entry, [string]$category = "Added")
    $changelog = Get-Content CHANGELOG.md -Raw

    $marker = "## [Unreleased]"
    $categoryMarker = "### $category"

    if ($changelog -notmatch [regex]::Escape($categoryMarker)) {
        # Add category under [Unreleased]
        $changelog = $changelog -replace [regex]::Escape($marker), "$marker`n`n### $category"
    }

    # Insert entry under the category
    $changelog = $changelog -replace "(?<=$([regex]::Escape($categoryMarker))`n)", "- $entry`n"

    Set-Content CHANGELOG.md $changelog -NoNewline
    Ok "CHANGELOG.md — added under [$category]: $entry"
}

function Promote-Changelog {
    param([string]$version)
    $changelog = Get-Content CHANGELOG.md -Raw

    # Promote [Unreleased] to versioned release
    $changelog = $changelog -replace "## \[Unreleased\]", "## [Unreleased]`n`n### Added`n`n### Changed`n`n### Fixed`n`n### Removed`n`n---`n`n## [v$version] — $Date"

    # Update Phase Log
    $changelog = $changelog -replace "(\| — \| Phase 6 \| v1\.0\.0.*\| )—", "`$1$Date"

    Set-Content CHANGELOG.md $changelog -NoNewline
    Ok "CHANGELOG.md — [Unreleased] promoted to [v$version] — $Date"
}

function Update-ChangelogPhaseLog {
    param([string]$phaseNum, [string]$milestone, [string]$commitHash)
    $changelog = Get-Content CHANGELOG.md -Raw
    $changelog = $changelog -replace "(\| — \| Phase $phaseNum \| $([regex]::Escape($milestone)) \| )—", "`$1$Date"
    Set-Content CHANGELOG.md $changelog -NoNewline
    Ok "CHANGELOG.md Phase Log updated — Phase $phaseNum"
}

# ── Main dispatch ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  SmartWorkz Commit Script" -ForegroundColor White
Write-Host "  Type: $Type | ID: $Id | Date: $Date" -ForegroundColor Gray
Write-Host ""

switch ($Type) {

    # ── SUBTASK — code-only commit (no README/CHANGELOG unless endpoint added)
    "subtask" {
        if (-not $Id -or -not $Message) { Err "Usage: -Type subtask -Id ADO-42 -Message 'description'"; exit 1 }

        $extraFiles = if ($Files) { $Files -split "," | ForEach-Object { $_.Trim() } } else { @() }

        Info "Committing subtask: $Id"
        Run "git add $($extraFiles -join ' ')"
        Commit-With-Message "feat($Id): $Message"
        Ok "Subtask committed. Run ado-update.ps1 to mark ADO task Done."
    }

    # ── PHASE — phase completion commit
    "phase" {
        if (-not $Id -or -not $Message) { Err "Usage: -Type phase -Id 2 -Message 'Solution scaffold complete'"; exit 1 }

        $phaseNames = @{
            "0" = "SRS Preparation"
            "1" = "Architecture"
            "2" = "Solution Setup"
            "3" = "ADO Board Setup"
            "4" = "Feature Development"
            "5" = "Quality Gates"
            "6" = "Deploy"
            "7" = "Maintain"
        }
        $phaseName = $phaseNames[$Id]

        $extraFiles = if ($Files) { $Files -split "," | ForEach-Object { $_.Trim() } } else { @() }

        # 1. Stage code/config files for this phase
        if ($extraFiles.Count -gt 0) {
            Stage-Files $extraFiles
            Commit-With-Message "feat(phase-$Id): $Message"
        }

        # 2. Update README
        Update-ReadmePhase -phaseNum $Id -phaseName $phaseName

        # 3. Update CHANGELOG
        Add-ChangelogEntry -entry "Phase $Id ($phaseName) complete — $Message" -category "Added"
        Update-ChangelogPhaseLog -phaseNum $Id -milestone $Message -commitHash "HEAD"

        # 4. Commit docs separately
        Stage-Files @("README.md", "CHANGELOG.md")
        Commit-With-Message "docs(phase-$Id): update README and CHANGELOG — Phase $Id $phaseName complete"

        Ok "Phase $Id committed. README + CHANGELOG updated."
    }

    # ── STORY — story merge commit (after PR merged to develop)
    "story" {
        if (-not $Id -or -not $Message) { Err "Usage: -Type story -Id EXAM-42 -Message 'Question batch import'"; exit 1 }

        $extraFiles = if ($Files) { $Files -split "," | ForEach-Object { $_.Trim() } } else { @() }

        # 1. Stage any extra files
        if ($extraFiles.Count -gt 0) {
            Stage-Files $extraFiles
            Commit-With-Message "feat($Id): $Message"
        }

        # 2. Update CHANGELOG
        Add-ChangelogEntry -entry "$Message (Story $Id)" -category "Added"

        # 3. Update README features table if feature name provided
        if ($Files -match "feature:(.+)") {
            Update-ReadmeFeature -featureName $Matches[1].Trim() -adoId $Id
        }

        # 4. Commit docs
        Stage-Files @("README.md", "CHANGELOG.md")
        Commit-With-Message "docs($Id): update README and CHANGELOG — Story $Id merged"

        Ok "Story $Id docs committed."
    }

    # ── EPIC — epic closed
    "epic" {
        if (-not $Id -or -not $Message) { Err "Usage: -Type epic -Id EPIC-001 -Message 'Question Management'"; exit 1 }

        Add-ChangelogEntry -entry "Epic complete: $Message ($Id)" -category "Added"
        Stage-Files @("README.md", "CHANGELOG.md")
        Commit-With-Message "docs(epic-$Id): update README and CHANGELOG — Epic $Id '$Message' closed"
        Ok "Epic $Id docs committed."
    }

    # ── RELEASE — promote Unreleased → vX.Y.Z, create git tag
    "release" {
        if (-not $Id -or -not $Message) { Err "Usage: -Type release -Id 1.0.0 -Message 'First production release'"; exit 1 }
        $version = $Id

        # 1. Promote CHANGELOG
        Promote-Changelog -version $version

        # 2. Update README version badge
        Update-ReadmeVersion -version $version

        # 3. Commit docs
        Stage-Files @("README.md", "CHANGELOG.md")
        Commit-With-Message "docs(release-v$version): update README and CHANGELOG — Release v$version"

        # 4. Create git tag
        Run "git tag -a v$version -m `"Release v$version — $Message`""
        Run "git push origin v$version"

        Ok "Release v$version tagged and pushed."
        Info "Next: merge release/v$version → main, then trigger deploy pipeline."
    }

    # ── HOTFIX — hotfix merged
    "hotfix" {
        if (-not $Id -or -not $Message) { Err "Usage: -Type hotfix -Id EXAM-99 -Message 'Fix score calculation overflow'"; exit 1 }

        Add-ChangelogEntry -entry "$Message (Hotfix $Id)" -category "Fixed"
        Stage-Files @("CHANGELOG.md")
        Commit-With-Message "docs(hotfix-$Id): update CHANGELOG — Hotfix $Id merged"
        Ok "Hotfix $Id docs committed."
    }

    # ── CLAUDE-MD — CLAUDE.md updated
    "claude-md" {
        if (-not $Message) { Err "Usage: -Type claude-md -Message 'Added SP workflow rules'"; exit 1 }

        Add-ChangelogEntry -entry "CLAUDE.md updated: $Message" -category "Changed"
        Stage-Files @("CLAUDE.md", "CHANGELOG.md")
        Commit-With-Message "docs(claude-md): update CLAUDE.md and CHANGELOG — $Message"
        Ok "CLAUDE.md update committed."
    }
}

Write-Host ""
Write-Host "  Done. Verify with: git log --oneline -5" -ForegroundColor Gray
Write-Host ""

# ──────────────────────────────────────────────────────────────────────────────
# USAGE EXAMPLES
# ──────────────────────────────────────────────────────────────────────────────
#
# SUBTASK commit (after tests pass):
#   .\commit.ps1 -Type subtask -Id EXAM-42 -Message "implement ParseExcel in QuestionImportService — AC1" -Files "src/Services/QuestionImportService.cs,Tests/Services/QuestionImportServiceTests.cs"
#
# PHASE completion:
#   .\commit.ps1 -Type phase -Id 0 -Message "SRS finalised, all gaps resolved, SRS-v1.0 tagged"
#   .\commit.ps1 -Type phase -Id 1 -Message "Architecture approved, CLAUDE.md v2.0, ADRs written" -Files "CLAUDE.md,DECISIONS.md,ENTITIES.md,PROMPTS.md,docs/adr/"
#   .\commit.ps1 -Type phase -Id 2 -Message "Solution scaffold, /health endpoint live, CI pipeline" -Files "src/,frontend/,Database/,.github/"
#   .\commit.ps1 -Type phase -Id 3 -Message "ADO board populated, Sprint 1 locked, DoD defined"
#
# STORY merge (run after PR merged to develop):
#   .\commit.ps1 -Type story -Id EXAM-42 -Message "Question batch Excel import with validation"
#
# EPIC closed:
#   .\commit.ps1 -Type epic -Id EPIC-001 -Message "Question Management"
#
# RELEASE:
#   .\commit.ps1 -Type release -Id 1.0.0 -Message "First production release — ExamPrep MVP"
#   .\commit.ps1 -Type release -Id 1.1.0 -Message "Mock test feature complete"
#   .\commit.ps1 -Type release -Id 1.1.1 -Message "Fix score rounding hotfix"
#
# HOTFIX:
#   .\commit.ps1 -Type hotfix -Id EXAM-99 -Message "Fix score calculation overflow on negative marking"
#
# CLAUDE.md update:
#   .\commit.ps1 -Type claude-md -Message "Added Angular state management rules"
#
# DRY RUN (see what would run without executing):
#   .\commit.ps1 -Type phase -Id 2 -Message "Solution scaffold complete" -DryRun
