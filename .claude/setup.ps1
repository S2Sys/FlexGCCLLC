# setup.ps1 — SmartWorkz Developer Machine Setup
# Run this ONCE on a new machine or when joining a new project
# Usage:
#   New project  : .\setup.ps1 -Mode new    -Project sw-examprep -OrgUrl https://dev.azure.com/smartworkz
#   Join project : .\setup.ps1 -Mode join   -Project sw-examprep -OrgUrl https://dev.azure.com/smartworkz
#   Update toolkit: .\setup.ps1 -Mode update -Project sw-examprep

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("new","join","update","check")]
    [string]$Mode,

    [string]$Project  = "",
    [string]$OrgUrl   = "https://dev.azure.com/smartworkz",
    [string]$DevRoot  = "C:\SmartWorkz",
    [string]$AdoPat   = $env:ADO_PAT
)

$ErrorActionPreference = "Stop"
$ToolkitRepo  = "sw-toolkit"
$ToolkitPath  = Join-Path $DevRoot $ToolkitRepo
$ProjectPath  = Join-Path $DevRoot $Project

function Ok   { param($m) Write-Host "  ✓ $m" -ForegroundColor Green }
function Info { param($m) Write-Host "  → $m" -ForegroundColor Cyan }
function Warn { param($m) Write-Host "  ⚠ $m" -ForegroundColor Yellow }
function Err  { param($m) Write-Host "  ✕ $m" -ForegroundColor Red; exit 1 }
function Head { param($m) Write-Host "`n  $m" -ForegroundColor White }

# ── PREREQUISITE CHECK ────────────────────────────────────────────────────────
function Check-Prerequisites {
    Head "Checking prerequisites..."

    $checks = @(
        @{ cmd = "claude --version";   label = "Claude Code CLI";    install = "npm install -g @anthropic-ai/claude-code" },
        @{ cmd = "dotnet --version";   label = ".NET SDK";           install = "https://dotnet.microsoft.com/download" },
        @{ cmd = "node --version";     label = "Node.js 20+";        install = "https://nodejs.org" },
        @{ cmd = "ng version";         label = "Angular CLI";        install = "npm install -g @angular/cli" },
        @{ cmd = "git --version";      label = "Git";                install = "https://git-scm.com" },
        @{ cmd = "pwsh --version";     label = "PowerShell 7+";      install = "https://github.com/PowerShell/PowerShell/releases" },
        @{ cmd = "node --version";     label = "Node.js 18+ (MCP)";  install = "https://nodejs.org — required for ADO MCP server" }
    )

    $allOk = $true
    foreach ($c in $checks) {
        try {
            $out = Invoke-Expression $c.cmd 2>&1 | Select-Object -First 1
            Ok "$($c.label): $out"
        } catch {
            Warn "$($c.label): NOT FOUND — install from: $($c.install)"
            $allOk = $false
        }
    }

    # Check ADO local config file (per-project — git-ignored)
    $adoLocalConfig = Join-Path $PSScriptRoot ".claude\mcp-servers\ado\ado.local.json"
    if (Test-Path $adoLocalConfig) {
        $cfg = Get-Content $adoLocalConfig -Raw | ConvertFrom-Json
        if ($cfg.ADO_PAT -and $cfg.ADO_ORG_URL -and $cfg.ADO_PROJECT) {
            Ok "ADO local config: present (org: $($cfg.ADO_ORG_URL), project: $($cfg.ADO_PROJECT))"
        } else {
            Warn "ADO local config found but incomplete — edit .claude\mcp-servers\ado\ado.local.json and fill in ADO_PAT, ADO_ORG_URL, ADO_PROJECT"
            $allOk = $false
        }
    } else {
        Warn "ADO local config missing. Run:"
        Warn "  Copy-Item .claude\mcp-servers\ado\ado.local.json.example .claude\mcp-servers\ado\ado.local.json"
        Warn "  Then edit it with your PAT, org URL, and project name."
        $allOk = $false
    }

    # Check ADO MCP server dependencies
    $mcpPath = Join-Path $PSScriptRoot ".claude\mcp-servers\ado\node_modules"
    if (Test-Path $mcpPath) {
        Ok "ADO MCP server: npm dependencies installed"
    } else {
        Warn "ADO MCP server: run 'Push-Location .claude\mcp-servers\ado; npm install; Pop-Location' to enable direct ADO integration"
    }

    if (-not $allOk) {
        Err "Fix missing prerequisites above, then re-run setup.ps1"
    }
    Ok "All prerequisites satisfied"
}

# ── TOOLKIT SETUP ─────────────────────────────────────────────────────────────
function Get-Toolkit {
    Head "Setting up sw-toolkit..."

    if (-not (Test-Path $DevRoot)) {
        New-Item -ItemType Directory -Path $DevRoot | Out-Null
        Ok "Created: $DevRoot"
    }

    if (Test-Path $ToolkitPath) {
        Info "Toolkit exists — pulling latest"
        Set-Location $ToolkitPath
        git pull
        Ok "Toolkit updated"
    } else {
        Info "Cloning toolkit repo..."
        Set-Location $DevRoot
        git clone "$OrgUrl/_git/$ToolkitRepo"
        Ok "Toolkit cloned to: $ToolkitPath"
    }
}

# ── COPY TOOLKIT FILES TO PROJECT ─────────────────────────────────────────────
function Copy-ToolkitToProject {
    param([string]$dest)

    Head "Copying toolkit files to project..."

    # Copy all protocol files from .claude\toolkit\ to project root
    $kitSrc = Join-Path $ToolkitPath ".claude\toolkit"
    if (Test-Path $kitSrc) {
        Copy-Item "$kitSrc\*" $dest -Force
        Ok "Copied: .claude\toolkit\* → project root (CLAUDE.md, PROMPTS.md, commit.ps1, etc.)"
        # BREAKDOWN.md lives in docs/ not root — move it
        $breakdownRoot = Join-Path $dest "BREAKDOWN.md"
        $breakdownDocs = Join-Path $dest "docs\BREAKDOWN.md"
        if (Test-Path $breakdownRoot) {
            Move-Item $breakdownRoot $breakdownDocs -Force
            Ok "Moved: BREAKDOWN.md → docs\BREAKDOWN.md"
        }
    } else {
        Err ".claude\toolkit subfolder not found at: $kitSrc"
    }

    # Copy .claude (commands + settings) and mcp-servers (ADO MCP)
    foreach ($folder in @(".claude", "mcp-servers")) {
        $src = Join-Path $ToolkitPath $folder
        if (Test-Path $src) {
            Copy-Item $src (Join-Path $dest $folder) -Recurse -Force
            Ok "Copied: $folder\"
        } else {
            Warn "Not found in toolkit: $folder"
        }
    }
}

# ── CREATE PROJECT STRUCTURE ──────────────────────────────────────────────────
function New-ProjectStructure {
    param([string]$dest)

    Head "Creating project folder structure..."

    $folders = @(
        "docs", "docs\adr", "docs\sessions",
        "src", "tests", "frontend", "Database",
        "Database\StoredProcedures", "Database\Migrations",
        ".github", ".github\workflows"
    )

    foreach ($f in $folders) {
        $path = Join-Path $dest $f
        if (-not (Test-Path $path)) {
            New-Item -ItemType Directory -Path $path | Out-Null
            Ok "Created: $f\"
        } else {
            Info "Exists: $f\"
        }
    }

    # Create placeholder SRS
    $srsPath = Join-Path $dest "docs\SRS.md"
    if (-not (Test-Path $srsPath)) {
        Set-Content $srsPath "# Software Requirements Specification`n`n> Replace this file with your actual SRS.`n"
        Ok "Created: docs/SRS.md (placeholder)"
    }

    # Create appsettings.example.json
    $exampleConfig = Join-Path $dest "appsettings.example.json"
    if (-not (Test-Path $exampleConfig)) {
        $config = @"
{
  "ConnectionStrings": {
    "Default": "YOUR_CONNECTION_STRING"
  },
  "Jwt": {
    "Secret": "YOUR_JWT_SECRET_MIN_32_CHARS",
    "ExpiryMinutes": 60,
    "Issuer": "SmartWorkz.[Product]"
  },
  "Aws": {
    "Region": "ap-south-1",
    "S3Bucket": "YOUR_BUCKET_NAME"
  },
  "Serilog": {
    "MinimumLevel": "Information"
  }
}
"@
        Set-Content $exampleConfig $config
        Ok "Created: appsettings.example.json"
    }
}

# ── VERIFY LOCAL BUILD ────────────────────────────────────────────────────────
function Test-LocalBuild {
    param([string]$dest)

    Head "Checking build..."

    $slnFiles = Get-ChildItem -Path $dest -Filter "*.sln" -Recurse | Select-Object -First 1
    if ($slnFiles) {
        Info "Found solution: $($slnFiles.Name)"
        Set-Location $slnFiles.DirectoryName
        $result = dotnet build 2>&1
        if ($LASTEXITCODE -eq 0) {
            Ok "dotnet build: PASSED"
        } else {
            Warn "dotnet build: FAILED — fix errors before starting development"
        }
    } else {
        Warn "No .sln file found — skeleton not yet created (normal for Phase 0-1)"
    }

    $ngJson = Join-Path $dest "frontend\angular.json"
    if (Test-Path $ngJson) {
        Set-Location (Join-Path $dest "frontend")
        npm install --silent
        $ngResult = ng build 2>&1
        if ($LASTEXITCODE -eq 0) { Ok "ng build: PASSED" }
        else { Warn "ng build: FAILED — fix errors before starting development" }
    } else {
        Warn "No Angular workspace found — normal for Phase 0-1"
    }
}

# ── PRINT NEXT STEPS ──────────────────────────────────────────────────────────
function Show-NextSteps {
    param([string]$mode)

    Write-Host ""
    Write-Host "  ─────────────────────────────────────────────" -ForegroundColor Gray
    Write-Host "  NEXT STEPS" -ForegroundColor White
    Write-Host "  ─────────────────────────────────────────────" -ForegroundColor Gray

    switch ($mode) {
        "new" {
            Write-Host "  1. Edit CLAUDE.md §2 — fill in your tech stack from SRS"
            Write-Host "  2. Edit README.md — fill product name and description"
            Write-Host "  3. Add your SRS to docs\SRS.md"
            Write-Host "  4. Commit the toolkit files:"
            Write-Host '     git add . && git commit -m "chore: initialise with SmartWorkz Claude Code Toolkit v2.1"'
            Write-Host "  5. Tag the SRS:"
            Write-Host "     git tag SRS-v1.0 && git push --tags"
            Write-Host "  6. Create develop branch:"
            Write-Host "     git checkout -b develop && git push -u origin develop"
            Write-Host "  7. Start Phase 0 — open Claude Code and paste session-start-prompt.md"
        }
        "join" {
            Write-Host "  1. Read HOW-TO-USE.md fully"
            Write-Host "  2. Read CLAUDE.md fully (all 27 sections)"
            Write-Host "  3. Read DECISIONS.md — understand decisions already made"
            Write-Host "  4. Read ENTITIES.md — know which tables exist"
            Write-Host "  5. Copy appsettings.example.json → appsettings.local.json"
            Write-Host "  6. Fill in your local DB connection string"
            Write-Host "  7. Run: dotnet build && dotnet test"
            Write-Host "  8. Pick your first task from the ADO board"
        }
        "update" {
            Write-Host "  1. Review what changed in the updated files"
            Write-Host "  2. Commit the updates:"
            Write-Host '     In Claude Code: /commit (type: claude-md, message: "Updated from ToolKit latest")'
            Write-Host "  3. Push to develop"
        }
    }
    Write-Host "  ─────────────────────────────────────────────" -ForegroundColor Gray
    Write-Host ""
}

# ── INSTALL PRE-COMMIT HOOK ───────────────────────────────────────────────────
function Install-PreCommitHook {
    param([string]$dest)
    $hookSrc  = Join-Path $dest ".claude\hooks\pre-commit.ps1"
    $hookDest = Join-Path $dest ".git\hooks\pre-commit"
    $hooksDir = Join-Path $dest ".git\hooks"

    if (-not (Test-Path $hooksDir)) {
        Info "No .git/hooks directory found — skipping pre-commit hook install"
        return
    }

    if (-not (Test-Path $hookSrc)) {
        Info "pre-commit.ps1 not found in .claude/hooks — skipping"
        return
    }

    Copy-Item $hookSrc $hookDest -Force
    Info "Installed pre-commit hook: .git/hooks/pre-commit"
}

# ── ADD SESSION.STATE TO .GITIGNORE ──────────────────────────────────────────
function Add-SessionStateGitignore {
    param([string]$dest)
    $gitignorePath = Join-Path $dest ".gitignore"
    if (Test-Path $gitignorePath) {
        $content = Get-Content $gitignorePath -Raw -ErrorAction SilentlyContinue
        if ($content -notmatch "session\.state") {
            Add-Content $gitignorePath "`n# SmartWorkz Toolkit — session gate tracker (never commit)`n.claude/session.state"
            Info "Added .claude/session.state to .gitignore"
        } else {
            Info ".claude/session.state already in .gitignore — skipping"
        }
    } else {
        Set-Content $gitignorePath "# SmartWorkz Toolkit — session gate tracker (never commit)`n.claude/session.state"
        Info "Created .gitignore with .claude/session.state entry"
    }
}

# ── MAIN ──────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  SmartWorkz Developer Setup" -ForegroundColor White
Write-Host "  Mode: $Mode | Project: $Project" -ForegroundColor Gray
Write-Host ""

switch ($Mode) {

    "check" {
        Check-Prerequisites
    }

    "new" {
        if (-not $Project) { Err "Specify project name: -Project sw-[product]" }
        Check-Prerequisites
        Get-Toolkit

        if (-not (Test-Path $ProjectPath)) {
            Err "Project repo not found at $ProjectPath. Clone it first."
        }

        Copy-ToolkitToProject -dest $ProjectPath
        New-ProjectStructure  -dest $ProjectPath
        Install-PreCommitHook  -dest $ProjectPath
        Add-SessionStateGitignore -dest $ProjectPath

        Set-Location $ProjectPath
        Show-NextSteps -mode "new"
    }

    "join" {
        if (-not $Project) { Err "Specify project name: -Project sw-[product]" }
        Check-Prerequisites
        Get-Toolkit

        if (-not (Test-Path $ProjectPath)) {
            Info "Cloning project repo..."
            Set-Location $DevRoot
            git clone "$OrgUrl/_git/$Project"
        } else {
            Info "Project exists — pulling latest"
            Set-Location $ProjectPath
            git checkout develop
            git pull
        }

        Test-LocalBuild -dest $ProjectPath
        Install-PreCommitHook  -dest $ProjectPath
        Add-SessionStateGitignore -dest $ProjectPath
        Show-NextSteps -mode "join"
    }

    "update" {
        if (-not $Project) { Err "Specify project name: -Project sw-[product]" }
        Get-Toolkit

        if (-not (Test-Path $ProjectPath)) {
            Err "Project not found at $ProjectPath"
        }

        Copy-ToolkitToProject -dest $ProjectPath
        Set-Location $ProjectPath
        Show-NextSteps -mode "update"
    }
}
