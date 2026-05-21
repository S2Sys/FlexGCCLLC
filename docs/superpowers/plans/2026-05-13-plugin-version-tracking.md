# Plugin Version Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/sw-versions` command that reports installed Claude Code plugin versions vs marketplace, plus a silent `SessionStart` hook that notifies when issues are detected.

**Architecture:** A PowerShell script does the filesystem comparison; a Claude command file instructs Claude to run its own scan via Glob+Read tools for the detailed report; a `SessionStart` hook calls the PS script silently at every session start and surfaces a one-liner if action is needed.

**Tech Stack:** PowerShell 7+ (`pwsh`), Claude Code command markdown, JSON (`settings.json` hook config)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `.claude/toolkit/check-plugin-versions.ps1` | Silent comparison — outputs one-line warning or nothing |
| Create | `.claude/commands/sw-versions.md` | On-demand detailed report via Claude Glob+Read |
| Modify | `.claude/settings.json` | Add `SessionStart` hook entry |

---

## Task 1: Create `check-plugin-versions.ps1`

**Files:**
- Create: `.claude/toolkit/check-plugin-versions.ps1`

- [ ] **Step 1: Write the script**

Create `.claude/toolkit/check-plugin-versions.ps1` with this exact content:

```powershell
$cachePath     = Join-Path $env:USERPROFILE ".claude\plugins\cache\claude-plugins-official"
$marketplaces  = @(
    Join-Path $env:USERPROFILE ".claude\plugins\marketplaces\claude-code-plugins\plugins",
    Join-Path $env:USERPROFILE ".claude\plugins\marketplaces\claude-code-workflows\plugins"
)

if (-not (Test-Path $cachePath)) { exit 0 }

$issues = 0

foreach ($pluginDir in Get-ChildItem -Path $cachePath -Directory) {
    $versionDirs = Get-ChildItem -Path $pluginDir.FullName -Directory
    if ($versionDirs.Count -eq 0) { continue }

    $installedVersion = $versionDirs[0].Name

    if ($installedVersion -eq "unknown") {
        $issues++
        continue
    }

    $foundInMarketplace = $false
    foreach ($mPath in $marketplaces) {
        $pluginJson = Join-Path $mPath "$($pluginDir.Name)\.claude-plugin\plugin.json"
        if (Test-Path $pluginJson) {
            $foundInMarketplace = $true
            $data          = Get-Content $pluginJson -Raw | ConvertFrom-Json
            $latestVersion = $data.version
            if ($installedVersion -ne $latestVersion) { $issues++ }
            break
        }
    }
    # Plugins not found in any local marketplace clone are ℹ️ — not counted as issues
}

if ($issues -gt 0) {
    Write-Output "[SmartWorkz Toolkit] Plugin check: $issues issue(s) detected — run /sw-versions to review"
}
```

- [ ] **Step 2: Run it manually to verify it works**

```powershell
pwsh -NoProfile -File .\.claude\toolkit\check-plugin-versions.ps1
```

Expected output (based on current installed plugins with `unknown` versions):
```
[SmartWorkz Toolkit] Plugin check: 5 issue(s) detected — run /sw-versions to review
```
If output is blank, re-check the `$cachePath` value by running:
```powershell
Get-ChildItem "$env:USERPROFILE\.claude\plugins\cache\claude-plugins-official" -Directory | Select Name
```

- [ ] **Step 3: Commit**

```powershell
git add .claude/toolkit/check-plugin-versions.ps1
git commit -m "feat(toolkit): add check-plugin-versions.ps1 for silent session-start scan"
```

---

## Task 2: Create `sw-versions.md`

**Files:**
- Create: `.claude/commands/sw-versions.md`

- [ ] **Step 1: Write the command file**

Create `.claude/commands/sw-versions.md` with this exact content:

```markdown
Check installed Claude Code plugin versions and compare against the local marketplace cache.

## Instructions

Work through all steps in order. Do not skip steps.

---

### Step 1 — Discover installed plugins

Use the Glob tool with pattern `*` and path:
`C:\Users\<resolve $env:USERPROFILE>\.claude\plugins\cache\claude-plugins-official`

If unsure of the home path, run: `pwsh -NoProfile -Command "Write-Output $env:USERPROFILE"` first.

For each directory returned (each is a plugin name), use Glob again with pattern `*` inside that
plugin's directory to find its version subdirectory name (e.g., `5.1.0`, `unknown`).

Build a working list:
| Plugin name | Installed version |
|-------------|-------------------|
| (from scan) | (subdir name)     |

---

### Step 2 — Look up latest versions from local marketplace

For each plugin in your list, attempt to Read:
1. `<USERPROFILE>\.claude\plugins\marketplaces\claude-code-plugins\plugins\<name>\.claude-plugin\plugin.json`
2. `<USERPROFILE>\.claude\plugins\marketplaces\claude-code-workflows\plugins\<name>\.claude-plugin\plugin.json`

Use the first path that succeeds. If both fail, mark Latest as `—`.

Extract the `version` field from the JSON.

---

### Step 3 — Classify each plugin

Apply this logic to each row:

| Status | Rule |
|--------|------|
| ✅ Up to date | installed == latest |
| ⚠️ Update available | latest is known AND installed != latest AND installed != "unknown" |
| ❓ Unknown installed version | installed == "unknown" |
| ℹ️ Not in local cache | latest == "—" |

---

### Step 4 — Output the report

Print this exact table format:

```
PLUGIN VERSION REPORT — <today's date>
═══════════════════════════════════════════════════════════
Plugin               Installed    Latest    Status
───────────────────────────────────────────────────────────
<name>               <version>    <latest>  <icon> <label>
...
═══════════════════════════════════════════════════════════
Summary: X ✅  Y ⚠️  Z ❓  W ℹ️
```

Then print remediation guidance for any non-✅ rows:

```
REMEDIATION
───────────────────────────────────────────────────────────
ℹ️  Not in local cache — plugin exists but is not in either local marketplace
   clone. It may still be current. No action required.

❓  Unknown installed version — reinstall via the Claude Code plugin manager
   to resolve the version tracking gap.

⚠️  Update available — reinstall the plugin via the Claude Code plugin manager
   to get the latest version.
```

Only print the remediation blocks that apply to your results (omit sections with zero matches).
```

- [ ] **Step 2: Test the command**

In a Claude Code session, run:
```
/sw-versions
```

Verify:
- A table appears listing all plugins under `~/.claude/plugins/cache/claude-plugins-official/`
- `superpowers`, `figma`, `claude-md-management`, `code-simplifier` show as `ℹ️ Not in local cache`
- `feature-dev`, `security-guidance`, `frontend-design`, `playground`, `playwright` show as `❓ Unknown installed version`
- No Python errors or "file not found" messages appear

- [ ] **Step 3: Commit**

```powershell
git add .claude/commands/sw-versions.md
git commit -m "feat(commands): add /sw-versions command — installed plugin version report"
```

---

## Task 3: Add `SessionStart` hook to `settings.json`

**Files:**
- Modify: `.claude/settings.json`

- [ ] **Step 1: Add the SessionStart hook**

Open `.claude/settings.json`. The current `hooks` object is:

```json
"hooks": {
  "PostToolUse": [ ... ],
  "Stop": [ ... ]
}
```

Add a `SessionStart` entry so it becomes:

```json
"hooks": {
  "SessionStart": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "pwsh -NoProfile -NonInteractive -File .claude\\toolkit\\check-plugin-versions.ps1"
        }
      ]
    }
  ],
  "PostToolUse": [ ... ],
  "Stop": [ ... ]
}
```

(Preserve all existing `PostToolUse` and `Stop` content exactly.)

- [ ] **Step 2: Verify the JSON is valid**

```powershell
Get-Content .\.claude\settings.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

Expected: JSON prints back cleanly with no parse errors.

- [ ] **Step 3: Test the hook fires**

Close and reopen this Claude Code session (or open a new session in this project directory).

Expected: At session start, if the 5 `unknown`-version plugins are still present, you see:
```
[SmartWorkz Toolkit] Plugin check: 5 issue(s) detected — run /sw-versions to review
```

Expected when all plugins are up to date: nothing (silent session start).

- [ ] **Step 4: Add PS script permission to settings.json**

In the `permissions.allow` array, add:

```json
"Bash(pwsh .claude\\toolkit\\check-plugin-versions.ps1*)"
```

- [ ] **Step 5: Commit**

```powershell
git add .claude/settings.json
git commit -m "feat(hooks): add SessionStart hook — silent plugin version check on session open"
```

---

## Self-Review Against Spec

| Spec requirement | Covered by |
|------------------|------------|
| Glob-scan installed from `cache/claude-plugins-official/*/` | Task 2 Step 1, Task 1 loop |
| Check both marketplace dirs | Task 1 `$marketplaces` array, Task 2 Step 2 |
| ✅ ⚠️ ❓ ℹ️ status classification | Task 2 Step 3 logic table |
| Formatted table output | Task 2 Step 4 |
| Remediation guidance for non-clean statuses | Task 2 Step 4 (remediation section) |
| Silent PS script — outputs nothing when clean | Task 1 (only writes if `$issues > 0`) |
| One-line banner format `[SmartWorkz Toolkit] Plugin check: N issue(s)...` | Task 1 `Write-Output` line |
| `SessionStart` hook wired to PS script | Task 3 Step 1 |
| No network calls | Confirmed — reads local filesystem only |
| Installed-only scope (no "discover new" plugins) | Confirmed — only iterates `$cachePath` dirs |
