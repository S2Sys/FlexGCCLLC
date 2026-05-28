# Plugin Version Tracking Design

**Date:** 2026-05-13
**Status:** Approved

## Goal

Give the developer instant visibility into which Claude Code plugins are installed and whether any are outdated — without adding noise to clean sessions.

## Scope

- Installed plugins only (no "discover new plugins" scope)
- Comparison against local marketplace clones only (no network calls)
- Windows paths (`C:\Users\tsent\.claude\...`)

---

## What Gets Built

### 1. `.claude/commands/sw-versions.md` — on-demand report command

Invoked as `/sw-versions`. Instructs Claude to:

1. Glob-scan installed plugins:
   `~/.claude/plugins/cache/claude-plugins-official/*/`
   Each subdirectory is a plugin; its child directory name is the installed version (e.g. `5.1.0`, `unknown`).

2. For each installed plugin, check both local marketplace clones for a matching entry:
   - `~/.claude/plugins/marketplaces/claude-code-plugins/plugins/<name>/.claude-plugin/plugin.json`
   - `~/.claude/plugins/marketplaces/claude-code-workflows/plugins/<name>/.claude-plugin/plugin.json`
   Read the `version` field if the file exists.

3. Classify each plugin:

   | Status | Condition |
   |--------|-----------|
   | ✅ Up to date | Installed version matches marketplace version |
   | ⚠️ Update available | Marketplace version differs from installed |
   | ❓ Unknown | Installed version directory is named `"unknown"` |
   | ℹ️ Not in local cache | Plugin not found in either marketplace directory |

4. Output a formatted table:

   ```
   Plugin               Installed   Latest    Status
   ─────────────────────────────────────────────────
   superpowers          5.1.0       —         ℹ️  Not in local cache
   figma                2.1.30      —         ℹ️  Not in local cache
   claude-md-management 1.0.0       1.0.0     ✅  Up to date
   code-simplifier      1.0.0       1.0.0     ✅  Up to date
   feature-dev          unknown     1.0.0     ❓  Unknown installed version
   security-guidance    unknown     1.0.0     ❓  Unknown installed version
   frontend-design      unknown     —         ❓  Unknown installed version
   playground           unknown     —         ❓  Unknown installed version
   playwright           unknown     —         ❓  Unknown installed version
   ```

5. After the table, show remediation guidance only for non-clean statuses:

   ```
   ℹ️  "Not in local cache" means the plugin exists but isn't in either local
      marketplace clone. It may still be current — no action required.

   ❓  "Unknown installed version" — reinstall via the Claude Code plugin manager
      to resolve the version tracking gap.
   ```

---

### 2. `.claude/toolkit/check-plugin-versions.ps1` — silent comparison script

Runs the same scan as above but outputs only a one-liner if action is warranted. Outputs **nothing** on a clean session (no noise).

**Logic:**

```
scan installed plugins
for each: check marketplace
count unknowns (❓)
count updates available (⚠️)

if unknowns > 0 or updates > 0:
    output: "⚠️ Plugin check: {N} issue(s) detected — run /sw-versions to review"
else:
    output nothing
```

**Paths used:**
- Installed: `$env:USERPROFILE\.claude\plugins\cache\claude-plugins-official\`
- Marketplace 1: `$env:USERPROFILE\.claude\plugins\marketplaces\claude-code-plugins\plugins\`
- Marketplace 2: `$env:USERPROFILE\.claude\plugins\marketplaces\claude-code-workflows\plugins\`

---

### 3. `SessionStart` hook in `.claude/settings.json`

Adds a `SessionStart` hook entry that runs the PS script. Its stdout is injected into Claude's context at the top of every session — same mechanism used by the `superpowers` plugin.

```json
"SessionStart": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "pwsh -NoProfile -NonInteractive -File .claude\\toolkit\\check-plugin-versions.ps1"
      }
    ]
  }
]
```

Output when issues exist (appears as a system-level banner):
```
⚠️ Plugin check: 5 issue(s) detected — run /sw-versions to review
```

Output when clean: nothing.

---

## Data Flow

```
SessionStart
  → hook runs check-plugin-versions.ps1
  → script scans cache + marketplaces
  → if issues: outputs one-line banner → appears in Claude context
  → if clean: silent

/sw-versions
  → Claude runs scan via Glob + Read tools
  → outputs full table with status + remediation guidance
```

---

## Out of Scope

- Auto-installing updates (requires unknown CLI mechanism; deferred)
- Network calls to check for versions beyond local marketplace clones
- Tracking project-local command file versions (separate concern)
- `claude-code-workflows` marketplace plugins (none currently installed from there)
