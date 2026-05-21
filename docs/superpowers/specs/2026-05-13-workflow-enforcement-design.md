# Workflow Enforcement & Cross-Doc Sync — Design Spec
**Date:** 2026-05-13
**Author:** Senthilvel Thangavelu
**Status:** Approved — ready for implementation

---

## Problem Statement

Multiple developers are skipping critical workflow steps in the SmartWorkz Claude Code Toolkit daily loop:

| Gate | Step being skipped |
|------|--------------------|
| A | Starting sessions without `/sw-work` — coding begins with no story context |
| C | Committing without running tests — broken code gets committed |
| D | Using raw `git commit` in terminal — bypasses `/sw-check`, ADO update, README/CHANGELOG |
| E | Closing sessions without `/sw-wrap` — no CONTEXT.md checkpoint written |

Additionally:
- Any story ID is accepted by `/sw-work` without validating it exists in ADO or is in the correct state
- Switching stories mid-session has no guard — CONTEXT.md checkpoints are lost
- Design docs (UI-DESIGN.md, DB-DESIGN.md, ARCH-DESIGN.md) drift out of sync when decisions change
- No structured team handoff when a task or story completes

---

## Goals

1. Hard-block all 6 gates — no bypass inside Claude sessions or from the terminal
2. Validate ADO story state before any work begins
3. Force `/sw-wrap` when switching stories
4. Auto-validate cross-doc consistency after every approval
5. Cascade SRS changes through all design docs via `/sw-sync`
6. Generate a structured team handoff on every task/story completion

---

## Approach: Session State File + ADO Live Validation

All enforcement pivots on a single JSON file: `.claude/session.state` (gitignored).
Slash commands write gates as they complete. Hooks read the file and block if prerequisites are missing.

---

## Section 1 — Session State File

**Location:** `.claude/session.state` (gitignored — added by `setup.ps1`)

**Structure:**
```json
{
  "story_id": "EXAM-42",
  "story_title": "Question Import",
  "work_done": true,
  "tests_passed": false,
  "check_done": false,
  "wrap_done": false,
  "commit_token": null,
  "mcp_fallback": false,
  "last_updated": "2026-05-13T10:30:00"
}
```

**Lifecycle:**

| Event | State change |
|-------|-------------|
| `SessionStart` hook fires | Resets entire file to `{}` |
| `/sw-work` completes ADO check | Writes `story_id`, `story_title`, `work_done: true` |
| Developer confirms "tests passed" in `/sw-done` | Writes `tests_passed: true` |
| `/sw-check` completes | Writes `check_done: true` |
| `/sw-done` generates commit token | Writes `commit_token: "sw-done-[timestamp]"` |
| `git commit` consumes token | Clears `commit_token`, clears `tests_passed` + `check_done` |
| `/sw-wrap` completes | Writes `wrap_done: true` |
| Next `SessionStart` | Full reset to `{}` |

**MCP fallback rule:** If MCP is unreachable when `/sw-work` validates a story, fall back to BREAKDOWN.md check, write `mcp_fallback: true`, and show a visible warning — not a blocker.

---

## Section 2 — Gate 2 + Gate 3: `/sw-work` Changes

`/sw-work` runs a mandatory preamble before any scan or code planning.

### Gate 3 — Story switch check
```
READ .claude/session.state
IF story_id exists AND story_id ≠ requested ID AND wrap_done ≠ true:
  HARD BLOCK:
  "STORY SWITCH BLOCKED — Story [current] still in progress.
   Run /sw-wrap to checkpoint before switching to [new story]."
  STOP.
```

### Gate 2 — ADO validation
```
CALL ado_get_item(story_id)
  state = "To Do"      → proceed
  state = "Done"       → BLOCK: "Story already Done in ADO. Pick a To Do story."
  state = "In Progress"→ WARN: "Story already In Progress — confirm this is your story (y/n)"
  not found            → BLOCK: "Story ID not found in ADO. Verify the ID."
  MCP unreachable      → FALLBACK: check BREAKDOWN.md, warn, continue with mcp_fallback: true

ALSO check docs/BREAKDOWN.md:
  Story ID must exist with status ≠ "Done"
  IF missing → BLOCK: "Story not in BREAKDOWN.md. Run /sw-plan first."
```

### On success — write state and continue
```
WRITE .claude/session.state:
  { "story_id": "[ID]", "story_title": "[title]", "work_done": true, "wrap_done": false }

CONTINUE with: CONTEXT.md read → CLAUDE.md read → SCAN RESULT → wait for approval
```

---

## Section 3 — Gates A, D, E: Hook Changes (`settings.json`)

### Gate A — Block code writes before `/sw-work` (`PreToolUse`)
```json
{
  "matcher": "Write|Edit",
  "hooks": [{
    "type": "command",
    "shell": "powershell",
    "command": "$f = $input | ConvertFrom-Json | Select-Object -ExpandProperty tool_input | Select-Object -ExpandProperty file_path; if ($f -match '\\.(cs|ts|sql|py|go)$') { $s = Get-Content '.claude/session.state' -ErrorAction SilentlyContinue | ConvertFrom-Json; if (-not $s.work_done) { Write-Output '{\"continue\": false, \"stopReason\": \"BLOCKED: Run /sw-work [Story ID] before writing code. No active story in session.\"}'; exit 1 } }"
  }]
}
```

### Gate D — Block raw git commits from Claude (`PreToolUse`)
```json
{
  "matcher": "Bash",
  "hooks": [{
    "type": "command",
    "shell": "powershell",
    "if": "Bash(git commit*)",
    "command": "$s = Get-Content '.claude/session.state' -ErrorAction SilentlyContinue | ConvertFrom-Json; if (-not $s.commit_token) { Write-Output '{\"continue\": false, \"stopReason\": \"BLOCKED: Use /sw-done to commit — runs /sw-check, updates ADO, README, and CHANGELOG.\"}'; exit 1 }"
  }]
}
```

Note: commit_token must be written to session.state by `/sw-done` BEFORE it calls `git commit`. The hook allows the commit if a token is present (originated from `/sw-done`), blocks if not (raw commit attempt).

### Gate E — Block session end without `/sw-wrap` (`Stop` hook)
```json
{
  "hooks": [{
    "type": "command",
    "shell": "powershell",
    "command": "$s = Get-Content '.claude/session.state' -ErrorAction SilentlyContinue | ConvertFrom-Json; if ($s.story_id -and -not $s.wrap_done) { Write-Output ('{\"continue\": false, \"stopReason\": \"BLOCKED: Run /sw-wrap before ending session. Story ' + $s.story_id + ' has no checkpoint.\"}'); exit 1 }"
  }]
}
```

### SessionStart hook — reset state
```json
{
  "hooks": [{
    "type": "command",
    "shell": "powershell",
    "command": "Set-Content '.claude/session.state' '{}' -ErrorAction SilentlyContinue"
  }]
}
```

---

## Section 4 — Gate C: `/sw-done` Tests Enforcement

`/sw-done` reads `session.state` and blocks before committing if `tests_passed` is not set.

**Flow:**
```
Step 1 — Read session.state
  IF tests_passed ≠ true:
    HARD BLOCK:
    "COMMIT BLOCKED — Tests not confirmed.
     Run: dotnet test
     Then say: 'tests passed'
     /sw-done will resume from this point."
    STOP.

Step 2 — On "tests passed" confirmation:
  WRITE session.state → tests_passed: true
  CONTINUE → /sw-check → team handoff → generate commit_token → git commit
```

After each subtask commit: clear `tests_passed` and `check_done` so next subtask starts clean.

---

## Section 5 — Gate D: Git Pre-commit Hook (Terminal Bypass Block)

Installed at `.git/hooks/pre-commit` by `setup.ps1`. Blocks any `git commit` from the terminal that did not originate from `/sw-done`.

**Mechanism — one-time token:**
- `/sw-done` writes `commit_token: "sw-done-[timestamp]"` to `session.state` before committing
- Pre-commit hook reads and **consumes** (clears) the token — one use only
- Raw `git commit` finds no token → blocked

**Hook script (`.claude/hooks/pre-commit.ps1`):**
```powershell
$state = Get-Content ".claude/session.state" -ErrorAction SilentlyContinue | ConvertFrom-Json
if (-not $state.commit_token) {
    Write-Host ""
    Write-Host "BLOCKED: Direct git commit not allowed." -ForegroundColor Red
    Write-Host "Use /sw-done in Claude Code." -ForegroundColor Yellow
    Write-Host "It runs /sw-check, updates ADO, README, and CHANGELOG automatically." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
# Consume token — one-time use
$state.commit_token = $null
$state | ConvertTo-Json | Set-Content ".claude/session.state"
exit 0
```

**`setup.ps1` additions:**
```powershell
# Install pre-commit hook
Copy-Item ".claude\hooks\pre-commit.ps1" ".git\hooks\pre-commit" -Force

# Add session.state to .gitignore
if (-not (Get-Content .gitignore -ErrorAction SilentlyContinue | Select-String "session.state")) {
    Add-Content .gitignore "`n.claude/session.state"
}
```

---

## Section 6 — `/sw-sync` Command (New)

### Mode 1 — Validate (auto-runs after every approval, mandatory before dev)

**Trigger points:**
```
/sw-ui   → "UI approved"   → auto /sw-sync validate
/sw-db   → "DB approved"   → auto /sw-sync validate
/sw-arch → "arch approved" → auto /sw-sync validate
/sw-plan → Level 5 gate    → /sw-sync validate MUST PASS → development unlocked
```

**Checks performed:**

| Pair | What is checked |
|------|----------------|
| SRS ↔ UI-DESIGN.md | Every SRS AC has a screen that covers it |
| SRS ↔ DB-DESIGN.md | Every entity in SRS has a corresponding table and SP |
| UI ↔ DB | Every data field shown in UI has a DB column; every screen's data source has a SP |
| UI ↔ Arch | Every screen maps to a defined module/component boundary in ARCH-DESIGN.md |
| DB ↔ Arch | Every service in ARCH-DESIGN.md has a corresponding repository and SP plan |
| DECISIONS.md ↔ All | No active design decision contradicts a locked DECISIONS.md entry |
| ENTITIES.md ↔ DB-DESIGN.md | Every table in ENTITIES.md exists in DB-DESIGN.md and vice versa |

**Output:**
```
SYNC VALIDATION REPORT
======================
✅ SRS ↔ UI-DESIGN.md       — consistent
✅ SRS ↔ DB-DESIGN.md       — consistent
❌ UI-DESIGN.md ↔ DB-DESIGN.md:
   CONFLICT: Dashboard screen requires ExamStats aggregate.
   No SP or view found in DB-DESIGN.md.
   FIX: Add Exam.uspExamStatsGetByTenant to DB-DESIGN.md
        OR revise Dashboard screen to use existing data.
❌ ARCH-DESIGN.md ↔ DB-DESIGN.md:
   CONFLICT: Arch specifies CachingService — no cache strategy in DB-DESIGN.md.

BLOCKED: 2 conflicts. Resolve then run /sw-sync again.
```

### Mode 2 — Cascade (new feature added to SRS)

```
/sw-sync [feature name]

Step 1 — SRS diff: identify new entities, screens, ACs, NFRs
Step 2 — UI impact: new screens needed + existing screens affected
         → "UI delta approved?" → appends to docs/UI-DESIGN.md
Step 3 — DB impact: new tables, columns, SPs needed
         → "DB delta approved?" → appends to docs/DB-DESIGN.md + ENTITIES.md
Step 4 — Arch impact: new services, repositories, controllers needed
         → "Arch delta approved?" → appends to docs/ARCH-DESIGN.md
Step 5 — Auto /sw-sync validate → must pass before /sw-plan [feature]
```

**Rule:** All cascade writes are **appends only** — never overwrites existing content.

---

## Section 7 — Team Handoff Message

Fires on every `/sw-done subtask` and `/sw-done story`. Three simultaneous outputs:

### Output 1 — Terminal (formatted for team chat)
```
╔══════════════════════════════════════════════════════════════╗
║  COMPLETED — [subtask/story]                                  ║
║  Story : [ID] — [Title]                                       ║
║  Task  : [layer] — [FileName]                                 ║
╠══════════════════════════════════════════════════════════════╣
║  WHAT WAS DONE                                                ║
║  • [file] — [what it does]                                    ║
╠══════════════════════════════════════════════════════════════╣
║  WHAT NEEDS TESTING & CONFIRMATION                            ║
║  □ AC[N]: [AC text]                                           ║
║         Test: [exact test steps]                              ║
║  □ Run: [test command]                                        ║
║  □ QA confirms: [endpoint or UI action]                       ║
╠══════════════════════════════════════════════════════════════╣
║  BRANCH : [branch name]                                       ║
║  COMMIT : [commit message]                                    ║
╚══════════════════════════════════════════════════════════════╝
```

### Output 2 — ADO comment (`ado_update_item`)
```
COMPLETED: [layer]
Files: [list]
Tests: [N] passing
AC[N] ✅ | AC[N] ✅
QA TO TEST: [what to verify]
Commit: [message] | Branch: [branch]
```

### Output 3 — Handoff file (committed to git)
```
docs/sessions/handoff-[STORY-ID]-[YYYY-MM-DD]-[subtask-slug].md  ← per subtask
docs/sessions/handoff-[STORY-ID]-[YYYY-MM-DD]-STORY-COMPLETE.md  ← per story (rollup)
```

Story rollup contains: all subtask handoffs + full AC coverage + PR link + QA checklist.

---

## Updated Phase Flow

```
Phase 0 (/sw-srs)    → "SRS approved"         → git tag SRS-vX.X
Phase 1 (/sw-ui)     → "UI approved"          → /sw-sync validate ✅
Phase 1 (/sw-db)     → "DB approved"          → /sw-sync validate ✅
Phase 2 (/sw-arch)   → "arch approved"        → /sw-sync validate ✅
Phase 3 (/sw-plan)   → /sw-sync validate ✅   → DEVELOPMENT UNLOCKED

New feature:
  SRS updated → /sw-sync [feature] → cascade deltas → /sw-plan [feature]
```

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `.claude/session.state` | Create (gitignored) | Gate tracker |
| `.claude/settings.json` | Modify | Add PreToolUse, SessionStart hooks; update Stop hook |
| `.claude/hooks/pre-commit.ps1` | Create | Git pre-commit token check |
| `.claude/commands/sw-work.md` | Modify | Add Gates 2 + 3 preamble |
| `.claude/commands/sw-done.md` | Modify | Add Gate C + commit token + handoff output |
| `.claude/commands/sw-wrap.md` | Modify | Write `wrap_done: true` to state |
| `.claude/commands/sw-sync.md` | Create | New command — validate + cascade |
| `.claude/commands/sw-ui.md` | Modify | Auto-run /sw-sync validate after "UI approved" |
| `.claude/commands/sw-db.md` | Modify | Auto-run /sw-sync validate after "DB approved" |
| `.claude/commands/sw-arch.md` | Modify | Auto-run /sw-sync validate after "arch approved" |
| `.claude/commands/sw-plan.md` | Modify | Gate on /sw-sync validate before Level 5 |
| `setup.ps1` | Modify | Install pre-commit hook + gitignore session.state |
| `.claude/toolkit/HOW-TO-USE.md` | Modify | Updated phase flow + /sw-sync docs |
| `.claude/toolkit/CLAUDE.md` | Modify | §26 enforcement table updated |
| `docs/sessions/` | Create directory | Handoff file storage |

---

## Implementation Order

1. `session.state` structure + `SessionStart` reset hook
2. `settings.json` — PreToolUse gates A + D + Stop gate E
3. `/sw-work` — gates 2 + 3
4. `/sw-done` — gate C + commit token + handoff outputs
5. `/sw-wrap` — wrap_done write
6. `pre-commit.ps1` + `setup.ps1`
7. `/sw-sync` command (new)
8. `/sw-ui`, `/sw-db`, `/sw-arch`, `/sw-plan` — auto-sync hooks
9. `HOW-TO-USE.md` + `CLAUDE.md §26` updates
