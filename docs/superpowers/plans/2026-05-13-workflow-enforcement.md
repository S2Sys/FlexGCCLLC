# Workflow Enforcement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add hard-block gates A, C, D, E plus ADO validation, story-switch guard, team handoff output, and new /sw-sync cross-doc validation command across 14 files.

**Architecture:** A single `.claude/session.state` JSON file acts as the ground-truth gate tracker. Claude Code hooks (SessionStart, PreToolUse, Stop) read/write this file to enforce prerequisites. A git pre-commit hook in `.git/hooks/pre-commit` provides terminal-level bypass protection via a one-time commit token. New `/sw-sync` slash command validates cross-doc consistency. All changes are additive — existing approved flows are preserved.

**Tech Stack:** PowerShell 5.1, Claude Code `settings.json` hook schema (hooks[] wrapper required), bash/git hooks, Markdown slash commands, JSON state file.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `.claude/session.state` | Create | Gate tracker — written by commands, read by hooks |
| `.claude/settings.json` | Modify | Add SessionStart, PreToolUse (×2), replace Stop hook |
| `.claude/hooks/pre-commit.ps1` | Create | Git-level commit token check (terminal bypass) |
| `.claude/commands/sw-work.md` | Modify | Add Gates 2+3 preamble before STEP 1 |
| `.claude/commands/sw-done.md` | Modify | Add Gate C, commit_token writes, team handoff (STEP 2.5) |
| `.claude/commands/sw-wrap.md` | Modify | Write wrap_done: true before checkpoint commit |
| `setup.ps1` | Modify | Add Install-PreCommitHook + gitignore entry |
| `.claude/commands/sw-sync.md` | Create | New command — validate + cascade modes |
| `.claude/commands/sw-ui.md` | Modify | Auto /sw-sync validate after "UI approved" |
| `.claude/commands/sw-db.md` | Modify | Auto /sw-sync validate after "DB approved" |
| `.claude/commands/sw-arch.md` | Modify | Auto /sw-sync validate after "arch approved" |
| `.claude/commands/sw-plan.md` | Modify | /sw-sync validate gate before Level 5 ADO creation |
| `.claude/toolkit/HOW-TO-USE.md` | Modify | Add enforcement gates table to phase flow |
| `.claude/toolkit/CLAUDE.md` | Modify | Update §26 hooks + slash command table |

---

## Task 1: Create `.claude/session.state` + add SessionStart hook

**Files:**
- Create: `.claude/session.state`
- Modify: `.claude/settings.json`

- [ ] **Step 1: Create the initial session state file**

  ```powershell
  Set-Content 's:\Project101\ToolKit\ToolKit\.claude\session.state' '{}'
  ```

  Expected: file exists, contains `{}`

- [ ] **Step 2: Add SessionStart hook to settings.json**

  In `.claude/settings.json`, add a `"SessionStart"` key inside `"hooks"`:

  ```json
  "SessionStart": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "Set-Content '.claude/session.state' '{}' -ErrorAction SilentlyContinue"
        }
      ]
    }
  ],
  ```

  Insert this BEFORE the existing `"PostToolUse"` key so hooks reads:
  `SessionStart → PostToolUse → Stop`

- [ ] **Step 3: Verify settings.json is valid JSON**

  ```powershell
  Get-Content 's:\Project101\ToolKit\ToolKit\.claude\settings.json' -Raw | ConvertFrom-Json | Out-Null; Write-Host "JSON valid"
  ```

  Expected: `JSON valid` (no errors)

- [ ] **Step 4: Commit**

  ```powershell
  Set-Location 's:\Project101\ToolKit\ToolKit'
  git add .claude/session.state .claude/settings.json
  git commit -m "feat(enforcement): add session.state file + SessionStart reset hook"
  ```

---

## Task 2: Add Gate A + Gate D PreToolUse hooks; replace Stop Gate E

**Files:**
- Modify: `.claude/settings.json`

These three hook changes enforce the three Claude-session gates:
- Gate A: blocks Write/Edit of code files when no active story
- Gate D: blocks Bash(git commit) when no commit_token in state
- Gate E: replaces the echo-only Stop hook with a hard block when story has no /sw-wrap

- [ ] **Step 1: Add PreToolUse section to settings.json**

  Inside `"hooks"`, add `"PreToolUse"` AFTER `"SessionStart"` and BEFORE `"PostToolUse"`:

  ```json
  "PreToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "command",
          "command": "$d = [Console]::In.ReadToEnd() | ConvertFrom-Json -ErrorAction SilentlyContinue; $fp = $d.tool_input.file_path; if ($fp -match '\\.(cs|ts|sql|py|go)$') { $s = try { Get-Content '.claude/session.state' -Raw -ErrorAction SilentlyContinue | ConvertFrom-Json } catch { $null }; if (-not $s -or -not $s.work_done) { Write-Output '{\"continue\":false,\"stopReason\":\"BLOCKED: Run /sw-work [Story ID] before writing code. No active story in session.\"}'; exit 1 } }"
        }
      ]
    },
    {
      "matcher": "Bash",
      "hooks": [
        {
          "type": "command",
          "command": "$d = [Console]::In.ReadToEnd() | ConvertFrom-Json -ErrorAction SilentlyContinue; $cmd = $d.tool_input.command; if ($cmd -match '^git commit') { $s = try { Get-Content '.claude/session.state' -Raw -ErrorAction SilentlyContinue | ConvertFrom-Json } catch { $null }; if (-not $s -or -not $s.commit_token) { Write-Output '{\"continue\":false,\"stopReason\":\"BLOCKED: Use /sw-done to commit — runs /sw-check, updates ADO, README, and CHANGELOG.\"}'; exit 1 } }"
        }
      ]
    }
  ],
  ```

- [ ] **Step 2: Replace Stop hook command with Gate E enforcement**

  Current Stop hook command is:
  ```
  "echo \"[SmartWorkz Toolkit] Session ending. ENFORCE §6: Run /session-end to write CONTEXT.md checkpoint before closing this session.\""
  ```

  Replace the entire Stop section with:

  ```json
  "Stop": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "$s = try { Get-Content '.claude/session.state' -Raw -ErrorAction SilentlyContinue | ConvertFrom-Json } catch { $null }; if ($s -and $s.story_id -and -not $s.wrap_done) { Write-Output ('{\"continue\":false,\"stopReason\":\"BLOCKED: Run /sw-wrap before ending session. Story ' + $s.story_id + ' has no checkpoint.\"}'); exit 1 }"
        }
      ]
    }
  ]
  ```

- [ ] **Step 3: Verify the complete settings.json is valid JSON**

  ```powershell
  Get-Content 's:\Project101\ToolKit\ToolKit\.claude\settings.json' -Raw | ConvertFrom-Json | Out-Null; Write-Host "JSON valid"
  ```

  Expected: `JSON valid`

- [ ] **Step 4: Spot-check hook structure — confirm all 4 events have hooks[] wrapper**

  ```powershell
  $j = Get-Content 's:\Project101\ToolKit\ToolKit\.claude\settings.json' -Raw | ConvertFrom-Json
  $j.hooks.PSObject.Properties.Name
  ```

  Expected output contains: `SessionStart`, `PreToolUse`, `PostToolUse`, `Stop`

- [ ] **Step 5: Commit**

  ```powershell
  Set-Location 's:\Project101\ToolKit\ToolKit'
  git add .claude/settings.json
  git commit -m "feat(enforcement): add Gate A PreToolUse + Gate D Bash hook + Gate E Stop hard block"
  ```

---

## Task 3: Create `.claude/hooks/pre-commit.ps1`

**Files:**
- Create: `.claude/hooks/pre-commit.ps1`

This script is installed as `.git/hooks/pre-commit` by setup.ps1 (Task 6). It provides terminal-level enforcement — blocking `git commit` from the terminal or IDE when no commit_token is present. The token is written by /sw-done just before each git commit call and consumed here on use (one-time).

- [ ] **Step 1: Create `.claude/hooks/` directory if needed**

  ```powershell
  New-Item -ItemType Directory -Path 's:\Project101\ToolKit\ToolKit\.claude\hooks' -Force | Out-Null
  Write-Host "hooks dir ready"
  ```

- [ ] **Step 2: Write pre-commit.ps1**

  Create `s:\Project101\ToolKit\ToolKit\.claude\hooks\pre-commit.ps1` with this exact content:

  ```powershell
  #!/usr/bin/env pwsh
  # SmartWorkz Toolkit — git pre-commit hook
  # Blocks raw terminal commits that bypass /sw-done.
  # /sw-done writes commit_token to session.state before each git commit call.
  # This hook reads the token, allows the commit if present, and clears it.

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
      Write-Host "  ║  Use /sw-done in Claude Code.                             ║" -ForegroundColor Yellow
      Write-Host "  ║  It runs /sw-check, updates ADO, README, and CHANGELOG.   ║" -ForegroundColor Yellow
      Write-Host "  ╚══════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
      Write-Host ""
      exit 1
  }

  # Consume token — one-time use per commit
  $state.commit_token = $null
  $state | ConvertTo-Json -Depth 10 | Set-Content $statePath
  exit 0
  ```

- [ ] **Step 3: Verify the file was written**

  ```powershell
  Test-Path 's:\Project101\ToolKit\ToolKit\.claude\hooks\pre-commit.ps1'
  ```

  Expected: `True`

- [ ] **Step 4: Commit**

  ```powershell
  Set-Location 's:\Project101\ToolKit\ToolKit'
  git add .claude/hooks/pre-commit.ps1
  git commit -m "feat(enforcement): add git pre-commit hook for terminal commit bypass protection"
  ```

---

## Task 4: Update `sw-work.md` — add Gates 2+3 preamble

**Files:**
- Modify: `.claude/commands/sw-work.md`

Insert a `## GATE PREAMBLE` section between the examples header block (lines 1–8) and the existing `## STEP 1` (line 11). This preamble runs on every /sw-work invocation before any context is loaded.

- [ ] **Step 1: Read sw-work.md to confirm the target insertion point**

  Read `.claude/commands/sw-work.md` lines 1–15. Confirm line 11 starts with `## STEP 1 — Load session context`.

- [ ] **Step 2: Insert the Gate Preamble block**

  In `.claude/commands/sw-work.md`, replace this exact text:

  ```
  ---

  ## STEP 1 — Load session context
  ```

  With this block (the `---` separator before GATE PREAMBLE is the existing one):

  ```markdown
  ---

  ## GATE PREAMBLE — Run before STEP 1 (no exceptions)

  ### Gate 3 — Story switch guard

  Read `.claude/session.state`:

    IF session.state.story_id is set
       AND session.state.story_id ≠ requested story ID
       AND session.state.wrap_done ≠ true:

    HARD STOP — output this and do not proceed:

      STORY SWITCH BLOCKED
      ────────────────────────────────────────────────────────────
      Current story : [session.state.story_id] — still in progress.
      Requested     : [requested story ID]

      Run /sw-wrap to write the CONTEXT.md checkpoint for the current
      story before switching. Session state has no checkpoint yet.
      ────────────────────────────────────────────────────────────

    Do not read context, do not scan, do not proceed. STOP.

    IF story matches current session.state.story_id: skip Gate 3, go to Gate 2.
    IF session.state is empty or story_id is absent: skip Gate 3, go to Gate 2.

  ---

  ### Gate 2 — ADO story state validation

  Call: `ado_get_item(story_id = [requested story ID])`

    Response state = "To Do"        → proceed
    Response state = "Done"         → HARD STOP: "Story [ID] is already Done in ADO. Pick a To Do story."
    Response state = "In Progress"  → WARN: "Story [ID] is already In Progress. Is this your story? (y/n)"
                                       Wait for confirmation. 'n' → stop. 'y' → proceed.
    Story not found                 → HARD STOP: "Story ID [ID] not found in ADO. Verify the ID."
    MCP unreachable                 → FALLBACK: check docs/BREAKDOWN.md for story ID with status ≠ "Done"
                                       Found → WARNING: "ADO unreachable — validated against BREAKDOWN.md only."
                                               Write mcp_fallback: true to session.state. Proceed.
                                       Not found → HARD STOP: "Story not in BREAKDOWN.md. Run /sw-plan first."

  Check docs/BREAKDOWN.md (always — even if ADO responded):
    Story ID must exist with status ≠ "Done"
    If missing: HARD STOP: "Story not in BREAKDOWN.md. Run /sw-plan first."

  ---

  ### Gate 2 success — write session state

  After Gate 2 passes, run this via Bash tool:

  ```powershell
  $ts = Get-Date -Format 'yyyy-MM-ddTHH:mm:ss'
  $s = [PSCustomObject]@{ story_id = "[STORY_ID]"; story_title = "[STORY_TITLE]"; work_done = $true; wrap_done = $false; last_updated = $ts }
  $s | ConvertTo-Json -Depth 5 | Set-Content '.claude/session.state'
  ```

  Replace [STORY_ID] and [STORY_TITLE] with actual values from ADO or BREAKDOWN.md.

  Then continue to STEP 1.

  ---

  ## STEP 1 — Load session context
  ```

- [ ] **Step 3: Update the version header in sw-work.md**

  At the top of sw-work.md (it has no version header yet), add one after line 8:

  Actually, check if sw-work.md has a `Command  :` frontmatter header like sw-plan.md does. If not, skip this step.

  Read the first 10 lines of sw-work.md — if no frontmatter, skip.

- [ ] **Step 4: Verify the insertion**

  Read `.claude/commands/sw-work.md` lines 1–50. Confirm:
  - `## GATE PREAMBLE` appears before `## STEP 1`
  - Gate 3 story switch check is present
  - Gate 2 ADO validation is present
  - session.state write PowerShell block is present

- [ ] **Step 5: Commit**

  ```powershell
  Set-Location 's:\Project101\ToolKit\ToolKit'
  git add .claude/commands/sw-work.md
  git commit -m "feat(sw-work): add Gate 2 ADO validation + Gate 3 story switch guard"
  ```

---

## Task 5: Update `sw-done.md` — Gate C + commit_token + team handoff

**Files:**
- Modify: `.claude/commands/sw-done.md`

Three insertions:
1. Gate C block at the very top (before STEP 0)
2. Commit token write before each `git commit` call in TYPE: subtask
3. New STEP 2.5 — team handoff output — inserted between STEP 2 and STEP 3

- [ ] **Step 1: Insert Gate C at top of sw-done.md (before STEP 0)**

  In `.claude/commands/sw-done.md`, find the text:
  ```
  Commit the completed work, update README + CHANGELOG + docs/BREAKDOWN.md, and mark ADO item Done.
  ```

  Replace it with:

  ```markdown
  Commit the completed work, update README + CHANGELOG + docs/BREAKDOWN.md, and mark ADO item Done.

  ---

  ## GATE C — Tests confirmation (runs before STEP 0)

  Read `.claude/session.state`:

    IF session.state.tests_passed ≠ true:

      HARD STOP — output this and do not proceed:

      COMMIT BLOCKED — Tests not confirmed
      ─────────────────────────────────────────────────────────────
      No test confirmation found in session state.

      1. Run your test suite:
           dotnet test                (for .NET projects)
           ng test --watch=false      (for Angular)
           pytest                     (for Python)
      2. Once all tests are green — say: "tests passed"

      /sw-done will resume from here once "tests passed" is received.
      ─────────────────────────────────────────────────────────────

    IF "tests passed" is received as a response:
      Run via Bash tool:
        $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
        $s | Add-Member -NotePropertyName 'tests_passed' -NotePropertyValue $true -Force
        $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
      Then proceed to STEP 0.

    IF session.state.tests_passed = true: proceed to STEP 0 immediately (already confirmed this session).

  ---
  ```

- [ ] **Step 2: Add commit_token writes in TYPE: subtask**

  In sw-done.md, inside `### TYPE: subtask`, find the first git commit instruction:
  ```
  2. Commit code:
       git commit -m "feat([TaskID]): ...
  ```

  Add this block BEFORE step 1 (`Stage code files:`):

  ```markdown
  0. Write commit token to session.state (required before every git commit):
       Run via Bash tool (PowerShell):
         $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
         $ts = Get-Date -Format 'yyyyMMddHHmmss'
         $s | Add-Member -NotePropertyName 'commit_token' -NotePropertyValue "sw-done-$ts" -Force
         $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
       Repeat this PowerShell block before EACH git commit call below (steps 2, 3, 4, 6).

  ```

  Then after step 6 (`git commit -m "chore([TaskID]): mark subtask complete..."`), add:

  ```markdown
  7. Clear tests_passed and check_done from session.state (next subtask starts clean):
       Run via Bash tool:
         $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
         $s | Add-Member -NotePropertyName 'tests_passed' -NotePropertyValue $false -Force
         $s | Add-Member -NotePropertyName 'check_done' -NotePropertyValue $false -Force
         $s | Add-Member -NotePropertyName 'commit_token' -NotePropertyValue $null -Force
         $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'

  ```

- [ ] **Step 3: Insert STEP 2.5 — Team Handoff — between STEP 2 and STEP 3**

  In sw-done.md, find:
  ```
  ## STEP 3 — Confirm
  ```

  Insert this full block immediately BEFORE it:

  ```markdown
  ## STEP 2.5 — Team Handoff (subtask and story types only — skip for phase/epic/release/hotfix)

  Generate three simultaneous outputs after all commits in STEP 2 are complete.

  ### Output 1 — Terminal handoff banner

  Output this block to the terminal:

    ╔══════════════════════════════════════════════════════════════════╗
    ║  COMPLETED — [subtask / story]                                    ║
    ║  Story : [ID] — [Title]                                           ║
    ║  Task  : [layer] — [FileName]                                     ║
    ╠══════════════════════════════════════════════════════════════════╣
    ║  WHAT WAS DONE                                                    ║
    ║  • [file path] — [one sentence: what it does]                     ║
    ║  • [file path] — [one sentence: what it does]                     ║
    ╠══════════════════════════════════════════════════════════════════╣
    ║  WHAT NEEDS TESTING & CONFIRMATION                                ║
    ║  □ AC[N]: [AC text from SRS]                                      ║
    ║         Test: [exact test steps — what to do, what to expect]    ║
    ║  □ Run : [test command — e.g. dotnet test --filter "ClassName"]   ║
    ║  □ QA  : [what QA must verify — endpoint URL or UI action]        ║
    ╠══════════════════════════════════════════════════════════════════╣
    ║  BRANCH : [branch name]                                           ║
    ║  COMMIT : [commit message from step above]                        ║
    ╚══════════════════════════════════════════════════════════════════╝

  ### Output 2 — ADO comment

  Add an ADO comment via MCP (use the task or story ID depending on subtask/story type):

    ado_update_item(
      id      = [ADO Task ID or Story ID],
      comment = "COMPLETED: [layer]\nFiles: [list]\nTests: [N] passing\nAC[N] ✅ | AC[N+1] ✅\nQA TO TEST: [what to verify]\nCommit: [message] | Branch: [branch]"
    )

  ### Output 3 — Handoff file (committed to git)

  For subtask type — write to `docs/sessions/handoff-[STORY-ID]-[YYYY-MM-DD]-[subtask-slug].md`:

    # Handoff — [Story ID] | [YYYY-MM-DD] | [Subtask Slug]
    **Story:** [ID] — [Title]
    **Layer:** [layer name]
    **Branch:** [branch]

    ## What was done
    - `[file path]` — [what it does]

    ## What needs testing
    - [ ] AC[N]: [AC text] — Test: [exact test steps]
    - [ ] Run: `[test command]`
    - [ ] QA confirms: [endpoint or UI action]

    ## Commit
    `[commit message]`

  For story type — write to `docs/sessions/handoff-[STORY-ID]-[YYYY-MM-DD]-STORY-COMPLETE.md`:
  Include all subtask handoffs rolled up, full AC coverage table, PR link, QA checklist.

  After writing the file, write commit token and commit:
    (Write commit token via PowerShell — same pattern as step 0 above)
    git add docs/sessions/handoff-*.md
    git commit -m "docs([StoryID]): team handoff — [subtask-slug or STORY-COMPLETE]"

  ---
  ```

- [ ] **Step 4: Verify sw-done.md structure**

  Read `.claude/commands/sw-done.md` and confirm the order is:
  1. Title line
  2. GATE C block
  3. STEP 0 — Auto-detect type + inline review
  4. STEP 1 — Gather context
  5. STEP 2 — Dispatch by type
  6. STEP 2.5 — Team Handoff
  7. STEP 3 — Confirm
  8. STEP 4 — HOW TO TEST

- [ ] **Step 5: Commit**

  ```powershell
  Set-Location 's:\Project101\ToolKit\ToolKit'
  git add .claude/commands/sw-done.md
  git commit -m "feat(sw-done): add Gate C tests check + commit_token writes + team handoff STEP 2.5"
  ```

---

## Task 6: Update `sw-wrap.md` — write `wrap_done: true` to session state

**Files:**
- Modify: `.claude/commands/sw-wrap.md`

Insert a session.state write between STEP 3 (SESSION SUMMARY) and STEP 4 (Commit checkpoint), so wrap_done is written before the CONTEXT.md commit. This is what releases the Gate E block on session end.

- [ ] **Step 1: Read sw-wrap.md to confirm STEP 4 target**

  Read `.claude/commands/sw-wrap.md` lines 95–106. Confirm STEP 4 starts with:
  ```
  STEP 4 — Commit the checkpoint:

    git add CONTEXT.md
    git commit -m "chore([story-id]): context checkpoint — turn [N]"
  ```

- [ ] **Step 2: Insert wrap_done write before STEP 4**

  In `.claude/commands/sw-wrap.md`, replace:
  ```
  STEP 4 — Commit the checkpoint:

    git add CONTEXT.md
    git commit -m "chore([story-id]): context checkpoint — turn [N]"
  ```

  With:

  ```markdown
  STEP 3.5 — Write wrap_done to session state (before committing):

    Run via Bash tool:
      $s = try { Get-Content '.claude/session.state' -Raw -ErrorAction SilentlyContinue | ConvertFrom-Json } catch { [PSCustomObject]@{} }
      $s | Add-Member -NotePropertyName 'wrap_done' -NotePropertyValue $true -Force
      $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'

    This releases the Gate E session-end block. CONTEXT.md must be written before this step runs.

  ---

  STEP 4 — Commit the checkpoint:

    git add CONTEXT.md
    git commit -m "chore([story-id]): context checkpoint — turn [N]"
  ```

- [ ] **Step 3: Verify**

  Read `.claude/commands/sw-wrap.md`. Confirm STEP 3.5 appears between STEP 3 and STEP 4, and the session.state write PowerShell block is present.

- [ ] **Step 4: Commit**

  ```powershell
  Set-Location 's:\Project101\ToolKit\ToolKit'
  git add .claude/commands/sw-wrap.md
  git commit -m "feat(sw-wrap): write wrap_done to session.state before checkpoint commit"
  ```

---

## Task 7: Update `setup.ps1` — install pre-commit hook + gitignore entry

**Files:**
- Modify: `setup.ps1`

Add an `Install-PreCommitHook` function and call it from the `new` and `join` modes. Also ensure `.claude/session.state` is added to `.gitignore`.

- [ ] **Step 1: Read setup.ps1 function block area to find insertion point**

  Read `setup.ps1` lines 1–50 to see where helper functions like `Check-Prerequisites` are defined. Confirm the function block area.

- [ ] **Step 2: Add Install-PreCommitHook function to setup.ps1**

  Find the last function definition before the `param(` or `switch ($Mode)` block (approximately line 200–230 based on the file structure). After the last `}` of the last function and before the switch block, insert:

  ```powershell
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
  ```

- [ ] **Step 3: Add function calls to "new" mode**

  Find the `"new"` case in the switch block. After `New-ProjectStructure -dest $ProjectPath` and before `Set-Location $ProjectPath`, add:

  ```powershell
          Install-PreCommitHook  -dest $ProjectPath
          Add-SessionStateGitignore -dest $ProjectPath
  ```

- [ ] **Step 4: Add function calls to "join" mode**

  Find the `"join"` case in the switch block. After `Test-LocalBuild -dest $ProjectPath` and before `Show-NextSteps -mode "join"`, add:

  ```powershell
          Install-PreCommitHook  -dest $ProjectPath
          Add-SessionStateGitignore -dest $ProjectPath
  ```

- [ ] **Step 5: Verify setup.ps1 parses without errors**

  ```powershell
  $null = [System.Management.Automation.Language.Parser]::ParseFile(
      's:\Project101\ToolKit\ToolKit\setup.ps1', [ref]$null, [ref]$errors
  )
  if ($errors.Count -gt 0) { $errors | ForEach-Object { Write-Host $_.Message } } else { Write-Host "ParseOK" }
  ```

  Expected: `ParseOK`

- [ ] **Step 6: Add .claude/session.state to .gitignore in the toolkit repo itself**

  ```powershell
  $gi = Get-Content 's:\Project101\ToolKit\ToolKit\.gitignore' -Raw -ErrorAction SilentlyContinue
  if ($gi -notmatch 'session\.state') {
      Add-Content 's:\Project101\ToolKit\ToolKit\.gitignore' "`n# SmartWorkz Toolkit — session gate tracker`n.claude/session.state"
      Write-Host "Added to .gitignore"
  } else { Write-Host "Already present" }
  ```

- [ ] **Step 7: Commit**

  ```powershell
  Set-Location 's:\Project101\ToolKit\ToolKit'
  git add setup.ps1 .gitignore
  git commit -m "feat(setup): install pre-commit hook + gitignore session.state in new/join modes"
  ```

---

## Task 8: Create `sw-sync.md` — new /sw-sync command

**Files:**
- Create: `.claude/commands/sw-sync.md`

This is a new slash command with two modes:
- **Validate** (auto-runs after every approval gate, mandatory before dev) — checks 7 cross-doc consistency pairs
- **Cascade** (`/sw-sync [feature]`) — propagates SRS changes to UI/DB/Arch design docs

- [ ] **Step 1: Write `.claude/commands/sw-sync.md`**

  Create the file with this exact content:

  ```markdown
  ---
  Command  : /sw-sync
  Version  : 1.0
  Updated  : 2026-05-13

  | Version | Date       | Author  | Changes                                                     |
  |---------|------------|---------|-------------------------------------------------------------|
  | 1.0     | 2026-05-13 | Zenthil | Initial version — validate + cascade modes                  |

  ---

  Validate cross-doc consistency OR cascade SRS changes to all design docs.

  Usage:
    /sw-sync            → validate mode (check all 7 cross-doc pairs)
    /sw-sync [feature]  → cascade mode (propagate new feature from SRS to UI/DB/Arch)

  ---

  ## MODE 1 — Validate (runs automatically after every approval gate)

  Reads all four approved design docs and checks consistency across 7 pairs.
  BLOCK development if any conflict is found — resolve conflicts before proceeding.

  Read these files before running any checks:
    1. docs/SRS.md
    2. docs/UI-DESIGN.md  (if it exists)
    3. docs/DB-DESIGN.md  (if it exists)
    4. docs/ARCH-DESIGN.md (if it exists)
    5. ENTITIES.md
    6. docs/DECISIONS.md   (if it exists)

  ### CHECKS

  | # | Pair                          | What is checked                                                                         |
  |---|-------------------------------|-----------------------------------------------------------------------------------------|
  | 1 | SRS ↔ UI-DESIGN.md            | Every SRS acceptance criterion has at least one screen in UI-DESIGN.md that covers it  |
  | 2 | SRS ↔ DB-DESIGN.md            | Every entity named in SRS exists as a table in DB-DESIGN.md with a corresponding SP    |
  | 3 | UI-DESIGN.md ↔ DB-DESIGN.md   | Every data field shown in UI has a matching DB column; every screen data source has a SP |
  | 4 | UI-DESIGN.md ↔ ARCH-DESIGN.md | Every screen maps to a defined module or component boundary in ARCH-DESIGN.md           |
  | 5 | DB-DESIGN.md ↔ ARCH-DESIGN.md | Every service in ARCH-DESIGN.md has a repository interface and SP plan in DB-DESIGN.md  |
  | 6 | DECISIONS.md ↔ All docs       | No active design decision in any doc contradicts a locked DECISIONS.md entry            |
  | 7 | ENTITIES.md ↔ DB-DESIGN.md    | Every table in ENTITIES.md exists in DB-DESIGN.md and vice versa (no orphans)           |

  Only check pairs where both documents exist. If a doc is missing, skip that pair and note it.

  ### OUTPUT FORMAT

  Output exactly this format:

    SYNC VALIDATION REPORT
    ======================
    Triggered by: [approval type — e.g. "UI approved" / "auto at Level 5 gate" / "manual"]
    Date: [today]

    ✅ SRS ↔ UI-DESIGN.md           — consistent
    ✅ SRS ↔ DB-DESIGN.md           — consistent
    ❌ UI-DESIGN.md ↔ DB-DESIGN.md:
       CONFLICT: [screen name] requires [data requirement].
       Not found in DB-DESIGN.md.
       FIX: Add [Schema].usp[Entity][Action] to DB-DESIGN.md
            OR revise [screen name] to use existing data source [SP name].
    ✅ UI-DESIGN.md ↔ ARCH-DESIGN.md — consistent
    ✅ DB-DESIGN.md ↔ ARCH-DESIGN.md — consistent
    ✅ DECISIONS.md ↔ All            — no contradictions
    ✅ ENTITIES.md ↔ DB-DESIGN.md    — consistent

    [SKIPPED: ARCH-DESIGN.md ↔ DB-DESIGN.md — ARCH-DESIGN.md not yet written]

    ─────────────────────────────────────────────────────────────
    RESULT: ✅ CONSISTENT — [N] pairs checked, 0 conflicts
    OR
    RESULT: ❌ BLOCKED — [N] conflicts found. Resolve all conflicts then run /sw-sync again.
    ─────────────────────────────────────────────────────────────

  If BLOCKED: do not allow development to proceed. List each conflict with a FIX instruction.
  If CONSISTENT: output result and allow the calling gate to continue.

  ---

  ## MODE 2 — Cascade (use when a new feature is added to the SRS)

  Trigger: `/sw-sync [feature name]`

  This mode propagates a new SRS feature into all design documents through a staged
  review-and-approve flow. Each stage writes ONLY appends — never overwrites existing content.

  Read docs/SRS.md first and identify the section for [feature name].

  ### STEP 1 — SRS delta

  Identify what is new for this feature:
    - New entities / DB tables
    - New screens / UI components
    - New acceptance criteria
    - New NFRs

  Output:
    SRS DELTA — [feature name]
    New entities  : [list]
    New screens   : [list]
    New ACs       : [list]
    New NFRs      : [list]

  ---

  ### STEP 2 — UI impact

  For each new screen and each AC requiring a UI change:
    - Describe the new/modified screen
    - Describe new components needed
    - Describe routing changes

  Output UI delta proposal. Wait for "UI delta approved" before writing to docs/UI-DESIGN.md.

  On approval: APPEND (never overwrite) the UI delta to docs/UI-DESIGN.md under
    ## [Feature Name] — added by /sw-sync [date]

  ---

  ### STEP 3 — DB impact

  For each new entity and each UI field with no current DB column:
    - Propose new tables, columns, SPs following DB-DESIGN.md conventions
    - Follow DB naming conventions from /sw-db command

  Output DB delta proposal. Wait for "DB delta approved" before writing.

  On approval: APPEND to docs/DB-DESIGN.md and ENTITIES.md under appropriate schema sections.

  ---

  ### STEP 4 — Arch impact

  For each new service, repository, or controller implied by the new entities/screens:
    - Propose new services, DI registrations, folder additions
    - Check for new middleware or pipeline changes

  Output Arch delta proposal. Wait for "arch delta approved" before writing.

  On approval: APPEND to docs/ARCH-DESIGN.md.

  ---

  ### STEP 5 — Auto validate

  After all approved appends are written:
    Run MODE 1 — Validate automatically.
    If CONSISTENT: output "CASCADE COMPLETE — all docs synced for [feature]."
    If BLOCKED: output conflicts and require resolution before /sw-plan [feature].

  ---

  RULE: All cascade writes are appends only — never delete or overwrite existing approved content.
  ```

- [ ] **Step 2: Verify the file was created**

  ```powershell
  Test-Path 's:\Project101\ToolKit\ToolKit\.claude\commands\sw-sync.md'
  ```

  Expected: `True`

- [ ] **Step 3: Commit**

  ```powershell
  Set-Location 's:\Project101\ToolKit\ToolKit'
  git add .claude/commands/sw-sync.md
  git commit -m "feat(sw-sync): add new /sw-sync command — validate + cascade modes"
  ```

---

## Task 9: Update sw-ui.md, sw-db.md, sw-arch.md — add auto /sw-sync validate

**Files:**
- Modify: `.claude/commands/sw-ui.md`
- Modify: `.claude/commands/sw-db.md`
- Modify: `.claude/commands/sw-arch.md`

After each "approved" gate in these three commands, add a mandatory /sw-sync validate step. Development cannot proceed until /sw-sync CONSISTENT is returned.

### sw-ui.md

- [ ] **Step 1: Read sw-ui.md to find the "UI approved" post-action block**

  Grep sw-ui.md for `"UI approved"` or `After.*approved`. Find the STEP that writes docs/UI-DESIGN.md.

- [ ] **Step 2: Insert /sw-sync validate trigger in sw-ui.md**

  Find the STEP in sw-ui.md where docs/UI-DESIGN.md is written (after "UI approved"). After the git commit instruction for docs/UI-DESIGN.md, add:

  ```markdown
  5. Run /sw-sync validate automatically:
     Call /sw-sync (MODE 1 — Validate).
     Wait for SYNC VALIDATION REPORT output.
     If RESULT: ❌ BLOCKED → resolve all conflicts before proceeding. Re-run /sw-sync.
     If RESULT: ✅ CONSISTENT → output "PHASE 1 UI COMPLETE — /sw-sync validated."

  ```

  Also update the version header:
  - Change `Version  : 1.2` to `Version  : 1.3`
  - Add a new row to the changelog table:
    `| 1.3 | 2026-05-13 | Zenthil | Added auto /sw-sync validate after "UI approved" |`

### sw-db.md

- [ ] **Step 3: Read sw-db.md to find STEP 8 — After "DB approved"**

  Confirm STEP 8 ends with the `PHASE 1 DB COMPLETE` output block.

- [ ] **Step 4: Insert /sw-sync validate trigger in sw-db.md**

  In sw-db.md STEP 8, after step 4 (`git push origin develop`) and before the `PHASE 1 DB COMPLETE` output block, add:

  ```markdown
  5. Run /sw-sync validate automatically:
     Call /sw-sync (MODE 1 — Validate).
     Wait for SYNC VALIDATION REPORT output.
     If RESULT: ❌ BLOCKED → resolve all conflicts before proceeding. Re-run /sw-sync.
     If RESULT: ✅ CONSISTENT → proceed to PHASE 1 DB COMPLETE output below.

  ```

  Update version header: `Version  : 1.1` → `Version  : 1.2`
  Add changelog row: `| 1.2 | 2026-05-13 | Zenthil | Added auto /sw-sync validate after "DB approved" |`

### sw-arch.md

- [ ] **Step 5: Read sw-arch.md to find STEP 9 — After "architecture approved"**

  Confirm STEP 9 ends with the `PHASE 2 ARCHITECTURE COMPLETE` output block.

- [ ] **Step 6: Insert /sw-sync validate trigger in sw-arch.md**

  In sw-arch.md STEP 9, after step 4 (`git push origin develop`) and before the `PHASE 2 ARCHITECTURE COMPLETE` output block, add:

  ```markdown
  5. Run /sw-sync validate automatically:
     Call /sw-sync (MODE 1 — Validate).
     Wait for SYNC VALIDATION REPORT output.
     If RESULT: ❌ BLOCKED → resolve all conflicts before proceeding. Re-run /sw-sync.
     If RESULT: ✅ CONSISTENT → proceed to PHASE 2 ARCHITECTURE COMPLETE output below.

  ```

  Update version header: `Version  : 1.1` → `Version  : 1.2`
  Add changelog row: `| 1.2 | 2026-05-13 | Zenthil | Added auto /sw-sync validate after "architecture approved" |`

- [ ] **Step 7: Commit all three**

  ```powershell
  Set-Location 's:\Project101\ToolKit\ToolKit'
  git add .claude/commands/sw-ui.md .claude/commands/sw-db.md .claude/commands/sw-arch.md
  git commit -m "feat(commands): add auto /sw-sync validate after UI/DB/arch approved gates"
  ```

---

## Task 10: Update `sw-plan.md` — /sw-sync validate gate before Level 5

**Files:**
- Modify: `.claude/commands/sw-plan.md`

The design spec requires: /sw-sync validate MUST PASS before Level 5 ADO creation is unlocked.

- [ ] **Step 1: Read sw-plan.md to find the Level 4 → Level 5 transition**

  Read `.claude/commands/sw-plan.md` lines 225–295. Confirm the `## LEVEL 4 COMPLETE — Go/No-Go decision` block ends with:
  ```
  If 🟢 GO or all 🔴 items resolved: proceed automatically to LEVEL 5.
  ```

- [ ] **Step 2: Insert /sw-sync validate gate between Level 4 COMPLETE and Level 5**

  In sw-plan.md, find:
  ```
    If 🟢 GO or all 🔴 items resolved: proceed automatically to LEVEL 5.

  ---

  ## LEVEL 5 — Create ADO items directly and write docs/BREAKDOWN.md
  ```

  Replace with:

  ```markdown
    If 🟢 GO or all 🔴 items resolved: proceed to LEVEL 4.5 below.

  ---

  ## LEVEL 4.5 — /sw-sync validate gate (mandatory before ADO creation)

  Before creating any ADO items, run /sw-sync validate to confirm all design docs are consistent.

  Call /sw-sync (MODE 1 — Validate).
  Wait for SYNC VALIDATION REPORT output.

  If RESULT: ❌ BLOCKED:
    Output:
      LEVEL 5 BLOCKED — Cross-doc conflicts found.
      Resolve all /sw-sync conflicts listed above, then run /sw-plan again.
      ADO items will not be created until /sw-sync is CONSISTENT.
    STOP — do not proceed to LEVEL 5.

  If RESULT: ✅ CONSISTENT:
    Output: "SYNC GATE PASSED — proceeding to LEVEL 5 ADO creation."
    Continue to LEVEL 5.

  Note: If any design doc (UI-DESIGN.md, DB-DESIGN.md, ARCH-DESIGN.md) is missing,
  /sw-sync will skip that pair and note it. Missing docs are not blockers at this stage
  unless they are required by the SRS.

  ---

  ## LEVEL 5 — Create ADO items directly and write docs/BREAKDOWN.md
  ```

- [ ] **Step 3: Update version header in sw-plan.md**

  Change `Version  : 1.1` → `Version  : 1.2`
  Add changelog row: `| 1.2 | 2026-05-13 | Zenthil | Added Level 4.5 /sw-sync validate gate before ADO creation |`

- [ ] **Step 4: Verify**

  Read sw-plan.md and confirm `## LEVEL 4.5` appears between `## LEVEL 4 COMPLETE` and `## LEVEL 5`.

- [ ] **Step 5: Commit**

  ```powershell
  Set-Location 's:\Project101\ToolKit\ToolKit'
  git add .claude/commands/sw-plan.md
  git commit -m "feat(sw-plan): add Level 4.5 /sw-sync validate gate before ADO creation"
  ```

---

## Task 11: Update `HOW-TO-USE.md` + `CLAUDE.md §26`

**Files:**
- Modify: `.claude/toolkit/HOW-TO-USE.md`
- Modify: `.claude/toolkit/CLAUDE.md`

Update documentation to reflect the new enforcement architecture.

### HOW-TO-USE.md

- [ ] **Step 1: Find Step 2.5 phase flow section in HOW-TO-USE.md**

  Grep HOW-TO-USE.md for `Step 2.5` or `Pre-development phase flow`. Read that section (around line 396).

- [ ] **Step 2: Add /sw-sync to the Phase Flow table in HOW-TO-USE.md**

  In the phase flow section (Step 2.5 or wherever the phase table lives), find the phase flow table/list.
  Add /sw-sync to the flow after each approval gate. The updated flow should read:

  ```
  Phase 0 (/sw-srs)    → "SRS approved"         → git tag SRS-vX.X
  Phase 1 (/sw-ui)     → "UI approved"           → /sw-sync validate ✅
  Phase 1 (/sw-db)     → "DB approved"           → /sw-sync validate ✅
  Phase 2 (/sw-arch)   → "arch approved"         → /sw-sync validate ✅
  Phase 3 (/sw-plan)   → /sw-sync validate ✅    → DEVELOPMENT UNLOCKED

  Adding a new feature:
    SRS updated → /sw-sync [feature] → cascade deltas → /sw-plan [feature]
  ```

- [ ] **Step 3: Find the "daily loop" section and add the 6 enforcement gates table**

  Grep HOW-TO-USE.md for `daily loop` or `Step 5`. Find the section (around line 1062).
  Add a new subsection:

  ```markdown
  ### Enforcement gates — hard blocks you cannot bypass

  | Gate | When it fires | What it blocks | How to clear |
  |------|--------------|----------------|--------------|
  | A | Every Write/Edit of .cs/.ts/.sql/.py/.go file | Writing code without an active story | Run `/sw-work [Story ID]` first |
  | C | Every `/sw-done` call | Committing without test confirmation | Run tests → say "tests passed" |
  | D | Every `git commit` from Claude | Committing without going through `/sw-done` | Run `/sw-done` — never `git commit` directly |
  | D (terminal) | Every `git commit` from terminal / IDE | Same — bypassing the workflow entirely | Run `/sw-done` in Claude Code |
  | E | Claude session end | Ending session without `/sw-wrap` | Run `/sw-wrap` to write CONTEXT.md |
  | 2 | Every `/sw-work` call | Starting work on an invalid ADO story | Use a To Do story ID from ADO |
  | 3 | Every `/sw-work` call | Switching stories without checkpointing | Run `/sw-wrap` on current story first |
  ```

### CLAUDE.md §26

- [ ] **Step 4: Read CLAUDE.md §26 hooks subsection**

  Read `CLAUDE.md` from line 895 (`### Hooks — automated enforcement`) to end of §26 (approx 10 lines).

- [ ] **Step 5: Replace the hooks subsection in CLAUDE.md §26**

  Find the `### Hooks — automated enforcement` subsection (line ~895). Replace the content from that line through `Hooks provide immediate feedback inside the session — they cannot be disabled per-session.` with:

  ```markdown
  ### Hooks — automated enforcement

  | Hook event | Gate | Fires when | Blocks |
  |------------|------|-----------|--------|
  | SessionStart | — | New Claude session opens | Resets .claude/session.state to `{}` |
  | PreToolUse(Write\|Edit) | A | Writing .cs/.ts/.sql/.py/.go file | Blocked if no active story (work_done not set) |
  | PreToolUse(Bash) | D | Bash tool runs git commit | Blocked if no commit_token in session.state |
  | PostToolUse(Write) | — | After every file write | Outputs: "ENFORCE §9: Run build now" |
  | Stop | E | Claude session ends | Blocked if story active and wrap_done not set |
  | .git/hooks/pre-commit | D (terminal) | Any git commit from terminal/IDE | Blocked if no commit_token — installed by setup.ps1 |

  Hooks provide immediate hard blocks, not suggestions. They cannot be disabled per-session.
  To modify hooks: tech lead edits `.claude/settings.json` via PR — never direct commit.

  ### session.state — gate tracker

  File: `.claude/session.state` (gitignored — reset each SessionStart)

  | Field | Set by | Purpose |
  |-------|--------|---------|
  | story_id | /sw-work | Active story ID — triggers Gate E check |
  | work_done | /sw-work | Releases Gate A (code writes allowed) |
  | tests_passed | /sw-done | Releases Gate C (commit allowed) |
  | commit_token | /sw-done | One-time token for gate D (consumed per commit) |
  | wrap_done | /sw-wrap | Releases Gate E (session end allowed) |
  | mcp_fallback | /sw-work | Set when ADO unreachable — uses BREAKDOWN.md fallback |
  ```

- [ ] **Step 6: Add /sw-sync to the slash command table in CLAUDE.md §26**

  Find the slash command table in §26 (line ~878). After the `/sw-wrap` row, add:

  ```
  | /sw-sync            | 1–3   | Validate cross-doc consistency (SRS↔UI↔DB↔Arch) or cascade SRS changes to all design docs |
  ```

- [ ] **Step 7: Commit both files**

  ```powershell
  Set-Location 's:\Project101\ToolKit\ToolKit'
  git add .claude/toolkit/HOW-TO-USE.md .claude/toolkit/CLAUDE.md
  git commit -m "docs(toolkit): update HOW-TO-USE phase flow + CLAUDE.md §26 with 6-gate enforcement + /sw-sync"
  ```

---

## Self-Review

**Spec coverage check:**

| Spec section | Task |
|-------------|------|
| §1 Session State File — lifecycle table | Task 1 (SessionStart), Task 4 (sw-work Gate 2 success write), Task 5 (sw-done commit token + clear), Task 6 (sw-wrap wrap_done) |
| §2 Gate 3 — story switch | Task 4 (sw-work GATE PREAMBLE Gate 3) |
| §2 Gate 2 — ADO validation | Task 4 (sw-work GATE PREAMBLE Gate 2) |
| §3 Gate A — PreToolUse Write/Edit | Task 2 |
| §3 Gate D — PreToolUse Bash | Task 2 |
| §3 Gate E — Stop hook | Task 2 |
| §3 SessionStart hook | Task 1 |
| §4 Gate C — tests_passed | Task 5 |
| §5 Git pre-commit hook | Task 3, Task 7 |
| §5 setup.ps1 hook installation | Task 7 |
| §6 /sw-sync Mode 1 — validate | Task 8 |
| §6 /sw-sync Mode 2 — cascade | Task 8 |
| §6 Auto /sw-sync after UI/DB/arch approved | Task 9 |
| §6 /sw-sync gate before Level 5 | Task 10 |
| §7 Team Handoff — terminal output | Task 5 (STEP 2.5 Output 1) |
| §7 Team Handoff — ADO comment | Task 5 (STEP 2.5 Output 2) |
| §7 Team Handoff — handoff file | Task 5 (STEP 2.5 Output 3) |
| docs/sessions/ directory | Already in setup.ps1 New-ProjectStructure |
| HOW-TO-USE.md + CLAUDE.md §26 | Task 11 |

**All 9 implementation order items from spec are covered. 0 gaps found.**
