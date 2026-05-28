---
name: swd-submit
description: |
  Commit completed story work: runs the lead approval gate and test confirmation gate, commits code, updates BREAKDOWN.md and ADO, writes the CONTEXT.md checkpoint, and outputs the session summary.
  Trigger when: all layers are built, manual testing is done, /swd-review is approved, and the story is ready to commit and close.
compatibility: Any stack  reads STACK CONFIRMED from docs/SRS.md
Command  : /swd-submit
Version  : 2.4
Updated  : 2026-05-21
| Version | Date       | Author  | Changes                                                                                        |
|---------|------------|---------|------------------------------------------------------------------------------------------------|
| 2.4     | 2026-05-21 | KapilDev | Added Azure DevOps PR create/update enforcement after feature-branch push plus manager acceptance email output |
| 2.2     | 2026-05-21 | KapilDev   | Added Skill Maturity 2.0 Contract for repo-wide command readiness consistency |
| 2.1     | 2026-05-21 | KapilDev | Enforced KapilDev git author attribution before every commit |
| 2.0     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.9     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.8     | 2026-05-18 | KapilDev  | Standardize final handoff snapshot: outputs, blockers, loop step, next command |
| 1.7     | 2026-05-15 | Zenthil | GATE L: add try/catch PS block; story-end clear: reset lead workflow fields |
| 1.6     | 2026-05-15 | Zenthil | Added GATE L  lead approval check; blocks /swd-submit until /swd-review approved |
| 1.5     | 2026-05-13 | Zenthil | Renamed from /swd-done  /swd-submit; GATE M updated to reference /swd-next and /swd-manual-testing |
| 1.4     | 2026-05-13 | Zenthil | Absorbed /swd-submit  STEP 5 CONTEXT.md checkpoint, STEP 6 SESSION SUMMARY, STEP 7 push now run inside /swd-submit; added GATE M manual testing sign-off; /swd-submit deprecated |
| 1.3     | 2026-05-13 | Zenthil | Added docs/SRS.md read + SRS version check to inline review; AC coverage now references SRS AC IDs by section number |
| 1.2     | 2026-05-13 | Zenthil | Add commit_token write before every git commit in all non-subtask types; session.state cleanup after TYPE:story |
| 1.1     | 2026-05-13 | Zenthil | Added version header; git push after subtask commits (step 6); check_done set to true in state |
| 1.0     |           | Zenthil | Initial version                                                                                |

---

Skill type: WORKFLOW COMMAND

## Standard command safeguards

### Helper intercept
If `$ARGUMENTS` is exactly one of these helper requests, print a concise helper document and STOP before the normal workflow starts:

- `help`
- `?`
- `usage`
- `use cases`
- `examples`
- `show helper`
- `what can this skill do`
- comment-style requests such as `# help`, `// help`, or `<!-- help -->`

Helper output must include: purpose, when to use, required inputs, common use cases, outputs, next steps, and safety notes.

### Output contract
Every normal run must end with a clear output or handoff section that lists files created or changed, decisions made, blockers remaining, verification performed, and the next recommended command or owner.

## Skill Maturity 2.0 Contract

This command is considered 2.0-ready only when every normal run satisfies these checks:

1. Description contract: output covers every capability promised in the frontmatter description.
2. Helper readiness: help, usage, examples, and comment-style help requests stop the normal workflow and show use cases.
3. Evidence discipline: missing inputs, metrics, approvals, IDs, costs, dates, or verification results are marked as `DATA GAP` instead of invented.
4. Actionability: recommendations include owner, priority, expected impact, effort, confidence, verification method, and next command or stakeholder.
5. Handoff clarity: final output names artifacts changed, decisions made, blockers, verification, and next owner/command.
6. Phase/stage summaries: every phase, stage, mode, gate, or major step ends with a DONE SUMMARY and the final response includes RUN SUMMARY.
7. Documentation sync: behavior, command names, generated outputs, examples, and handoffs stay aligned with README, CHANGELOG, and toolkit changelog docs.
8. Version discipline: command version, updated date, author row, README row, CHANGELOG, and toolkit version are updated together.

If any check fails, mark the run `CONDITIONAL` or `BLOCKED` and list the required fix before completion.

## Phase/Stage Done Summary Contract

At the end of every phase, stage, mode, approval gate, or major workflow step, output a short summary:

```text
[PHASE/STAGE/MODE/GATE] DONE SUMMARY
Completed          : [1-3 short bullets or one sentence]
Artifacts changed  : [files/docs/items]
Decisions made     : [approved/rejected/deferred]
Verification       : [checks run or N/A]
Blockers           : none / [list]
Next               : [next phase, stage, gate, command, or owner]
```

Final output must include a RUN SUMMARY with the same fields. If a phase/stage is skipped, say Skipped with reason and impact. If partially failed, show recovery status and do not mark it done.

### Documentation sync
When this command changes behavior, command names, modes, examples, outputs, generated files, or handoffs, check and update relevant docs before marking work complete:

- `README.md`
- `.claude/commands/README.md` if present
- `docs/**/*.md` files that mention this command or its outputs
- command index, registry, migration, or usage-guide files

If docs still show stale command names, old examples, outdated outputs, or broken handoffs, mark the change incomplete.

### Approval gate hardening
If this command has or reaches an approval/sign-off gate:

- Accept only the exact approval phrase documented by that gate.
- Reject vague approval language such as "looks good", "LGTM", "approved enough", "continue", "ship it", "go ahead", or "approved verbally".
- If blockers, failed checks, unresolved decisions, or missing required inputs remain, repeat the blocker list and stay at the gate.
- If the user asks to skip the gate, require an explicit risk decision for each unresolved blocker before continuing.

### Token and reference discipline
Keep this command focused on orchestration. Move long stack-specific examples, generated templates, policy tables, or reusable reference material into `.claude/refs/` and link to those files from the command body.

### Partial-failure recovery
If this command writes files, updates docs, changes external systems, scaffolds code, runs builds/tests, commits, pushes, deploys, or syncs state, and any step partially fails:

1. Stop before marking the workflow complete.
2. Report what changed, what failed, and which verification command or external action failed.
3. Preserve user-authored unrelated changes.
4. Fix or roll forward only the command-owned changes needed to recover.
5. Re-run the failed verification or sync step.
6. Do not update final status, handoff, README/docs, ADO, or changelog until recovery succeeds.

---

Commit the completed work, update README + CHANGELOG + docs/BREAKDOWN.md, mark ADO item Done,
push the feature branch, create or update the Azure DevOps PR to `develop`, write the CONTEXT.md
checkpoint, generate the manager PR acceptance email, and output the session summary  all in one command.

---

## HANDOFF SNAPSHOT

**Produces / updates**
- git commits for code, docs, breakdown updates, handoff files, and `CONTEXT.md`
- `README.md`, `CHANGELOG.md`, `docs/BREAKDOWN.md`, `CONTEXT.md`, and `docs/sessions/handoff-*`
- `docs/sessions/pr-[STORY-ID]-[YYYY-MM-DD].md` with generated PR title/body and manager acceptance email
- ADO task/story completion updates
- Azure DevOps PR to `develop` for the current feature branch
- `.claude/session.state` wrap-up fields, including `wrap_done = true`

**Blocks progress when**
- `/swd-review` has not set `lead_approval = "approved"`
- tests are not confirmed green
- manual testing proof is missing
- story-end gate or pre-commit review finds a blocker
- feature branch cannot be pushed
- PR create/update to `develop` cannot be completed or manually confirmed

**Current step in canonical delivery loop**
- Step 6 of 6 -> final commit, checkpoint, and closeout
- Canonical loop: `/swl-start -> /swd-start -> /repeat(/swd-next -> /swd-manual-testing) -> /swd-review -> /swd-submit`

**Next command**
- delivery loop complete for this story
- next story starts with `/swl-start [story-id]`, then `/swd-start`

---
## GATE L  Lead approval check (runs before everything else)

Read `.claude/session.state`:

  Run via Bash tool:
    $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
    $approval = $s.lead_approval

  IF $approval  "approved":

    HARD STOP  output this and do not proceed:

    COMMIT BLOCKED  Lead Review Required
    
    /swd-review must be run and approved before committing.

    All Acceptance Criteria must be covered by unit tests and
    manual testing proof before this story can be closed.

    1. Run /swd-review
       AI will check every AC against unit + manual test evidence.
    2. Fix any gaps listed in the remediation checklist.
    3. Re-run /swd-review until APPROVED.

    /swd-submit will proceed automatically once lead_approval = "approved".
    

  IF $approval = "approved": proceed to GATE C immediately.

---

## GATE C  Tests confirmation (runs before everything else)

Read `.claude/session.state`:

  IF session.state.tests_passed  true:

    HARD STOP  output this and do not proceed:

    COMMIT BLOCKED  Tests not confirmed
    
    No test confirmation found in session state.

    1. Run your test suite:
         dotnet test                (for .NET projects)
         ng test --watch=false      (for Angular)
         pytest                     (for Python)
    2. Once all tests are green  say: "tests passed"

    /swd-submit will resume from here once "tests passed" is received.
    

  IF "tests passed" received as a response:
    Run via Bash tool:
      $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
      $s | Add-Member -NotePropertyName 'tests_passed' -NotePropertyValue $true -Force
      $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
    Then proceed to GATE M.

  IF session.state.tests_passed = true: proceed to GATE M immediately.

---

## GATE M  Manual testing sign-off (runs after GATE C)

Read `.claude/session.state`:

  IF session.state.manual_testing_done  true:

    HARD STOP  output this and do not proceed:

    COMMIT BLOCKED  Manual testing not confirmed
    
    Manual testing proof has not been submitted for this subtask.

    Steps:
    1. Run /swd-next  STEP 7 provides exact manual testing instructions
       for your layer (EXEC scripts, Swagger steps, browser steps).
    2. Complete every test case listed in STEP 7.
    3. Run /swd-manual-testing  paste your proof for each TC.
       This command records the proof and unlocks /swd-submit.

    /swd-submit will resume automatically once /swd-manual-testing
    sets manual_testing_done = true in session state.
    

  IF session.state.manual_testing_done = true: proceed to STEP 0 immediately.

---

Type: $ARGUMENTS (subtask / story / phase / epic / release / hotfix)
If type is not provided  auto-detect from BREAKDOWN.md (see STEP 0).

---

## STEP 0  Auto-detect type + story-end gate + inline review

Skip type auto-detection for: phase / epic / release / hotfix (those must be in $ARGUMENTS).

### Auto-detect type (if $ARGUMENTS is empty or "subtask")

Read docs/BREAKDOWN.md and CONTEXT.md:
- Identify the current story
- If ALL subtask rows for this story are   type = **story**
- If any subtask row is still   type = **subtask**

Output: `TYPE DETECTED: [subtask / story]`

---

### Story-end gate (runs when type = story)

Scan CONTEXT.md and BREAKDOWN.md for the current story:

  STORY-END GATE
  Story   : [Story ID  title]
  Subtasks: [check BREAKDOWN.md  N/N ]
  Review  : [/swp-audit run and approved  / ]
  ACs     : [every AC in SRS story has a test method N/N ]
  Build   : [dotnet build / ng build  0 errors  / ]
  HOW TO TEST: [STEP 4 output was generated for final subtask  / ]
  PR      : [PR raised to develop  / ]

If any item is :
  Output "STORY-END GATE BLOCKED  [item]: [what is missing]" and stop.
  Fix the gap first, then re-run /swd-submit.

If all  or type = subtask  continue to inline review.

---

### Inline review  runs automatically before every commit

Read docs/SRS.md before scanning any file:
  - Note SRS version (e.g. v2.1) and confirm it matches SRS Ver in CONTEXT.md
  - Extract every AC for the current story from its SRS section (N.N)
  - If SRS version in CONTEXT.md differs from docs/SRS.md header: output
      SRS VERSION MISMATCH  CONTEXT.md records [X], docs/SRS.md is [Y]. Update CONTEXT.md before committing.

Read every file created or modified this session (list from CONTEXT.md).
Scan for blockers. If any CRITICAL or HIGH found  output BLOCKED and stop.

**Security (OWASP)**
- A01: Every tenant-scoped query has TenantId filter; every endpoint has [Authorize] or [AllowAnonymous]
- A02: No hardcoded secrets, passwords, API keys, or JWT literals in any file
- A03: No raw SQL strings in .cs files; no string interpolation building SQL; SP params are typed
- A05: No stack traces in API responses; ErrorResponse uses ErrorCodes constants
- A07: JWT middleware registered before UseAuthorization
- A09: No passwords, OTPs, or raw tokens in any ILogger call

**N+1 queries**
- foreach / for loop containing await _repo.* or await _context.*
- .Select(x => repo.GetByIdAsync(x.Id).Result)  sync-over-async N+1
- Missing .Include() where navigation property accessed in a loop

**Performance**
- List methods with no PageNumber/PageSize that return unbounded rows
- EF read queries missing .AsNoTracking() on read-only paths
- .Result / .Wait() / .GetAwaiter().GetResult() on any Task

**CLAUDE.md compliance**
- No raw SQL in .cs; no DbContext in controllers or services
- All error strings from ErrorCodes constants  no hardcoded strings
- async/await on every method  no sync DB or HTTP calls
- No commented-out code, no TODO comments (raise ADO task instead)
- SP naming: [Schema].usp[Entity][Action]; all SP files use CREATE OR ALTER

**Multi-tenancy + soft-delete**
- Every query on a tenant-scoped table: .Where(x => x.TenantId == tenantId) or @TenantId param in SP
- Every read query: .Where(x => !x.IsDeleted) or WHERE IsDeleted = 0 in SP

**AC traceability (from SRS N.N  loaded above)**
- Every AC in the SRS story (SRS [section]) has a corresponding method + test method name
- Test method names must include AC prefix: AC1_[Method]_[Condition]_[Result]
- Any AC with no covering method = HIGH blocker  list by SRS AC ID

**Code quality**
- Linting: If package.json or .eslintrc exists  ESLint must report 0 errors; warnings allowed but listed
- Formatting: If .prettierrc / .editorconfig exists  Prettier diff must be clean (run `npx prettier --check .` or `dotnet format --verify-no-changes`)
- Test coverage: If coverage report exists in CI output or lcov.info  must be  80% line coverage; flag if below
- Dead code: No exported functions/classes with zero references introduced this session
- Type safety (.ts / .cs): No `any` in TypeScript; no `dynamic` in C# unless justified

Output:

  PRE-COMMIT REVIEW
  
  Security   :  clean  /   CRITICAL: [N]  HIGH: [N]
  N+1        :  clean  /   HIGH: [N]
  Performance:  clean  /   HIGH: [N]
  Compliance :  clean  /   HIGH: [N]
  Tenancy    :  clean  /   HIGH: [N]
  Code Quality:  clean  /   HIGH: [N]  (lint/format/coverage/type-safety)
  ACs        : [N]/[N] covered (SRS [section]: AC1  AC2  ...)
  
  VERDICT: APPROVED  proceeding to commit
  OR
  VERDICT: BLOCKED  fix before committing:
    1. [CRITICAL/HIGH] [file:line]  [what + fix]
    2. ...

If BLOCKED: stop here. Fix each item, re-run /swd-submit.
If APPROVED: proceed to STEP 1.

---

## STEP 1  Gather context

Read CONTEXT.md + current session state:
- Story ID and title
- ADO Task ID for this work
- Files created and modified this session
- ACs covered so far
- Commit type (from $ARGUMENTS or auto-detected)

If CONTEXT.md is missing or empty, ask for: Story ID, Task ID, files changed, what was built.

---

## STEP 2  Dispatch by type

---

### TYPE: subtask
Use after every file that builds and tests green.

0. Write commit token to session.state (required before every git commit in this command):
     Run via Bash tool (PowerShell):
       $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
       $ts = Get-Date -Format 'yyyyMMddHHmmss'
       $s | Add-Member -NotePropertyName 'commit_token' -NotePropertyValue "sw-done-$ts" -Force
       $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
     Repeat this PowerShell block before EACH git commit call below (steps 2, 3, 4, 6).

0.1. Enforce commit author name before EACH git commit:
     git config user.name
     If the value is empty, `Codex`, `OpenAI`, or `Open AI`, run:
       git config user.name "KapilDev"
     Then confirm:
       git config user.name
     The confirmed value must be `KapilDev` before any commit proceeds.

1. Stage code files:
     git add [every file created or modified this session]

2. Commit code:
     git commit -m "feat([TaskID]): [what was built  one sentence]  [ACs covered e.g. AC1, AC2]"

3. Update README.md  patch only the relevant section(s). Do NOT rewrite the whole file.
   - If subtask adds or changes an API endpoint  update README  API Reference section
   - If subtask completes a user-visible feature  update README  Features table (status: In Progress  Done)
   - Always  update README  Project Status "last updated" date to today
   Commit separately:
     git add README.md
     git commit -m "docs([TaskID]): update README  [what changed in README]"

4. Update CHANGELOG  add one line under [Unreleased]  Added / Changed / Fixed:
     - [user-facing description of what was built]
   Commit separately:
     git add CHANGELOG.md
     git commit -m "docs([TaskID]): update CHANGELOG  [task title]"

5. Mark ADO task Done via MCP tool:
     ado_update_item(
       id      = [ADO Task ID from docs/BREAKDOWN.md],
       state   = "Done",
       comment = "[what was implemented] | Tests: [N] passing | ACs: [covered list] | Commit: [short hash]"
     )

6. Update docs/BREAKDOWN.md  change  to  for this subtask row.
   Commit:
     git add docs/BREAKDOWN.md
     git commit -m "chore([TaskID]): mark subtask complete in docs/BREAKDOWN.md"

7. Push all subtask commits so team can see the work:
     git push origin [current branch]

8. Create or update the Azure DevOps PR to `develop` using STEP 2.4 below.
   This step is mandatory after a successful push. If the PR cannot be created automatically,
   output the ready-to-paste PR title/body and manager acceptance email, then stop with
   `PR CREATION BLOCKED` until the developer provides the PR URL created in Azure DevOps.

9. Clear tests_passed, manual_testing_done, and commit_token from session.state (next subtask starts clean):
     Run via Bash tool:
       $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
       $s | Add-Member -NotePropertyName 'tests_passed'        -NotePropertyValue $false -Force
       $s | Add-Member -NotePropertyName 'manual_testing_done' -NotePropertyValue $false -Force
       $s | Add-Member -NotePropertyName 'check_done'          -NotePropertyValue $false -Force
       $s | Add-Member -NotePropertyName 'commit_token'        -NotePropertyValue $null  -Force
       $s | Add-Member -NotePropertyName 'fix_attempts'        -NotePropertyValue 0      -Force
       $s | Add-Member -NotePropertyName 'work_done'           -NotePropertyValue $false -Force
       $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'

---

## STEP 2.4  Azure DevOps PR create/update and manager acceptance email

Run this step after every successful feature-branch push for `subtask` and before a `story` can be closed.

### Inputs

Derive these from CONTEXT.md, docs/BREAKDOWN.md, git, and `.claude/session.state`:

- Source branch: current branch from `git branch --show-current`
- Target branch: `develop`
- Story ID and title
- ADO Story URL if available
- ADO Task ID if type is `subtask`
- Files changed and ACs covered
- Test commands and results
- Manager email from `.claude/session.state.manager_email`, `.claude/session.state.assigned_by`, or user input

If manager email is not known, set it to `DATA GAP: manager email not provided`.

### PR title

Use this format:

```text
feat([StoryID]): [short feature or subtask description]
```

For docs-only or planning branches, use `docs([StoryID or phase-N]): [short description]`.

### PR description

Generate this body and save it to `docs/sessions/pr-[STORY-ID]-[YYYY-MM-DD].md`:

```markdown
## Summary
[1-2 sentences: what was built and why]

## Changes
- [file path]: [specific change]
- [file path]: [specific change]
- Database: [schema/SP names if applicable, or N/A]

## Acceptance Criteria Covered
- AC[N]: [criteria text] - covered by [test/manual proof]

## Testing
- [x] Build/test command: `[exact command]`
- [x] Passing result: [N passing / 0 failed]
- [x] Manual proof: [handoff file or summary]

## Related
- ADO Story: [link or DATA GAP]
- ADO Task: [id or N/A]
- SRS: [version and section]

## Checklist
- [x] Code follows project conventions
- [x] AC traceability covered
- [x] Multi-tenancy and soft-delete checked where applicable
- [x] No secrets in changed files
- [x] README updated by /swd-submit
- [x] CHANGELOG updated by /swd-submit
```

### Automatic PR create/update

Prefer Azure DevOps CLI when available:

```powershell
$branch = git branch --show-current
$existing = az repos pr list --source-branch $branch --target-branch develop --status active --query "[0].pullRequestId" -o tsv 2>$null
if ($existing) {
  az repos pr update --id $existing --title "[generated title]" --description (Get-Content "docs/sessions/pr-[STORY-ID]-[YYYY-MM-DD].md" -Raw)
  $prUrl = az repos pr show --id $existing --query "url" -o tsv
} else {
  az repos pr create --source-branch $branch --target-branch develop --title "[generated title]" --description (Get-Content "docs/sessions/pr-[STORY-ID]-[YYYY-MM-DD].md" -Raw) --work-items [StoryID] --draft true
  $prUrl = az repos pr list --source-branch $branch --target-branch develop --status active --query "[0].url" -o tsv
}
```

If Azure DevOps CLI is unavailable, use the generated PR title/body in Azure DevOps UI and require the PR URL before continuing.
Do not mark story work complete without a PR URL.

After the PR exists:

1. Save `pr_url` to `.claude/session.state`.
2. Add an ADO comment to the Task or Story:
   `PR READY: [pr_url] | Target: develop | Manager acceptance email generated in docs/sessions/pr-[STORY-ID]-[YYYY-MM-DD].md`.
3. Commit the PR handoff file:
   - write commit token
   - `git add docs/sessions/pr-[STORY-ID]-[YYYY-MM-DD].md`
   - `git commit -m "docs([StoryID]): add PR handoff and manager acceptance email"`
   - `git push origin [current branch]`

### Manager PR acceptance email

Append this email block to the same PR handoff file and print it in the final output:

```text
To      : [manager email or DATA GAP]
Subject : PR acceptance request - [StoryID] [Story title]

Hi [Manager Name],

The implementation for [StoryID] - [Story title] is ready for review.

PR      : [PR URL]
Target  : develop
Branch  : [source branch]
ADO     : [ADO Story URL or ID]
Summary : [one-sentence business outcome]
Testing : [test command/result] and manual proof captured in [handoff file]

Please review the PR and approve/accept it in Azure DevOps if it meets the story acceptance criteria.

Thanks,
KapilDev
```

If the email recipient is unknown, leave `To` as `DATA GAP` and list the manager email as a blocker in the final handoff.

---

### TYPE: story
Use after a story PR is merged to develop.

**STORY-END GATE  verified in STEP 0. All items must be  before any commit or ADO update.**

1. Update README.md  Features table: change story's feature status to Done.
   Update README.md  last updated date in Project Status badge.

2. Update CHANGELOG.md  [Unreleased]  Added:
     - [one user-facing sentence describing the story's delivered capability]

3. Write commit token, then commit docs:
     $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
     $ts = Get-Date -Format 'yyyyMMddHHmmss'
     $s | Add-Member -NotePropertyName 'commit_token' -NotePropertyValue "sw-done-$ts" -Force
     $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
     git add README.md CHANGELOG.md
     git commit -m "docs([StoryID]): update README and CHANGELOG  Story [ID] merged"

4. Mark ADO Story Done via MCP:
     ado_update_item(
       id      = [ADO Story ID],
       state   = "Done",
       comment = "Story complete  PR merged to develop | All ACs covered"
     )

5. Update docs/BREAKDOWN.md  mark all task rows for this story , change story row Status to Done.
   Write commit token, then commit:
     $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
     $ts = Get-Date -Format 'yyyyMMddHHmmss'
     $s | Add-Member -NotePropertyName 'commit_token' -NotePropertyValue "sw-done-$ts" -Force
     $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
     git add docs/BREAKDOWN.md
     git commit -m "chore([StoryID]): mark story complete in docs/BREAKDOWN.md"

6. Clear session state after story completion (allows starting a new story this session):
     Run via Bash tool:
       $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
       $s | Add-Member -NotePropertyName 'tests_passed'        -NotePropertyValue $false -Force
       $s | Add-Member -NotePropertyName 'manual_testing_done' -NotePropertyValue $false -Force
       $s | Add-Member -NotePropertyName 'check_done'          -NotePropertyValue $false -Force
       $s | Add-Member -NotePropertyName 'commit_token'        -NotePropertyValue $null  -Force
       $s | Add-Member -NotePropertyName 'work_done'           -NotePropertyValue $false -Force
       $s | Add-Member -NotePropertyName 'story_id'            -NotePropertyValue $null  -Force
       $s | Add-Member -NotePropertyName 'assigned_by'              -NotePropertyValue $null  -Force
       $s | Add-Member -NotePropertyName 'assigned_at'              -NotePropertyValue $null  -Force
       $s | Add-Member -NotePropertyName 'lead_approval'            -NotePropertyValue $null  -Force
       $s | Add-Member -NotePropertyName 'lead_review_at'           -NotePropertyValue $null  -Force
       $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'

---

### TYPE: phase
Use when a project phase milestone is reached.

Phase names: 0=SRS Preparation, 1=Architecture, 2=Solution Setup,
             3=ADO Board Setup, 4=Feature Development, 5=Quality Gates,
             6=Deploy, 7=Maintain

Phase number from $ARGUMENTS (e.g. "/swd-submit phase 2").

1. Update README.md:
   - Project Status badge: update phase name and last updated date
   - Phase table: mark this phase as Done, next phase as In Progress

2. Update CHANGELOG.md:
   - [Unreleased]  Added: "Phase [N] ([name]) complete  [one-sentence milestone description]"
   - Phase Log table: fill in today's date for this phase row

3. Write commit token, then commit:
     $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
     $ts = Get-Date -Format 'yyyyMMddHHmmss'
     $s | Add-Member -NotePropertyName 'commit_token' -NotePropertyValue "sw-done-$ts" -Force
     $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
     git add README.md CHANGELOG.md
     git commit -m "docs(phase-[N]): update README and CHANGELOG  Phase [N] [name] complete"

---

### TYPE: epic
Use when all stories in an Epic are merged.

1. Update CHANGELOG.md  [Unreleased]  Added:
     - Epic complete: [Epic name]  [one-sentence summary of what shipped]

2. Write commit token, then commit:
     $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
     $ts = Get-Date -Format 'yyyyMMddHHmmss'
     $s | Add-Member -NotePropertyName 'commit_token' -NotePropertyValue "sw-done-$ts" -Force
     $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
     git add CHANGELOG.md
     git commit -m "docs(epic-[ID]): update CHANGELOG  Epic [name] closed"

3. Mark ADO Epic Done via MCP:
     ado_update_item(
       id      = [ADO Epic ID],
       state   = "Done",
       comment = "Epic complete  all stories merged to develop"
     )

4. Update docs/BREAKDOWN.md  change epic row Status to Done.
   Write commit token, then commit:
     $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
     $ts = Get-Date -Format 'yyyyMMddHHmmss'
     $s | Add-Member -NotePropertyName 'commit_token' -NotePropertyValue "sw-done-$ts" -Force
     $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
     git add docs/BREAKDOWN.md
     git commit -m "chore(epic-[ID]): mark epic complete in docs/BREAKDOWN.md"

---

### TYPE: release
Use when promoting Unreleased to a version. Version from $ARGUMENTS (e.g. "/swd-submit release 1.0.0").

1. Update CHANGELOG.md:
   - Rename ## [Unreleased]  ## [vX.Y.Z]  [today's date]
   - Add fresh empty ## [Unreleased] with blank Added / Changed / Fixed / Removed sections above it

2. Update README.md:
   - Version badge: update to vX.Y.Z
   - Project Status: update last updated date

3. Write commit token, then commit docs:
     $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
     $ts = Get-Date -Format 'yyyyMMddHHmmss'
     $s | Add-Member -NotePropertyName 'commit_token' -NotePropertyValue "sw-done-$ts" -Force
     $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
     git add README.md CHANGELOG.md
     git commit -m "docs(release-vX.Y.Z): update README and CHANGELOG  Release vX.Y.Z"

4. Create annotated git tag:
     git tag -a vX.Y.Z -m "Release vX.Y.Z  [one-sentence release description]"

   Note: do NOT push the tag  tech lead pushes manually to trigger the deploy pipeline.

---

### TYPE: hotfix
Use after a hotfix is merged to both main and develop.

1. Update CHANGELOG.md  [Unreleased]  Fixed:
     - [what was fixed and user impact  one sentence] (Hotfix [ID])

2. Write commit token, then commit:
     $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
     $ts = Get-Date -Format 'yyyyMMddHHmmss'
     $s | Add-Member -NotePropertyName 'commit_token' -NotePropertyValue "sw-done-$ts" -Force
     $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
     git add CHANGELOG.md
     git commit -m "docs(hotfix-[ID]): update CHANGELOG  Hotfix [ID] merged"

3. Mark ADO task Done via MCP:
     ado_update_item(
       id      = [ADO Task ID],
       state   = "Done",
       comment = "Hotfix applied and merged | Commit: [short hash]"
     )

---

## STEP 2.5  Team Handoff (subtask and story types only  skip for phase/epic/release/hotfix)

Generate three outputs after all commits in STEP 2 are complete.

### Output 1  Terminal handoff banner

Output this block to the terminal (use actual values from session context):

  
    COMPLETED  [subtask / story]                                    
    Story : [ID]  [Title]                                           
    Task  : [layer]  [FileName]                                     
  
    WHAT WAS DONE                                                    
     [file path]  [one sentence: what it does]                     
  
    WHAT NEEDS TESTING & CONFIRMATION                                
     AC[N]: [AC text from SRS]                                      
           Test: [exact test steps  what to do, what to expect]     
     Run : [test command  e.g. dotnet test --filter "ClassName"]   
     QA  : [what QA must verify  endpoint URL or UI action]        
  
    BRANCH : [branch name]                                           
    COMMIT : [commit message from step above]                        
  

### Output 2  ADO comment

  ado_update_item(
    id      = [ADO Task ID or Story ID],
    comment = "COMPLETED: [layer]\nFiles: [list]\nTests: [N] passing\nAC[N]  | AC[N+1] \nQA TO TEST: [what to verify]\nCommit: [message] | Branch: [branch]"
  )

### Output 3  Handoff file

For subtask type  write to `docs/sessions/handoff-[STORY-ID]-[YYYY-MM-DD]-[subtask-slug].md`:

  # Handoff  [Story ID] | [YYYY-MM-DD] | [Subtask Slug]
  **Story:** [ID]  [Title]
  **Layer:** [layer name]
  **Branch:** [branch]

  ## What was done
  - `[file path]`  [what it does]

  ## What needs testing
  - [ ] AC[N]: [AC text]  Test: [exact test steps]
  - [ ] Run: `[test command]`
  - [ ] QA confirms: [endpoint or UI action]

  ## Commit
  `[commit message]`

For story type  write to `docs/sessions/handoff-[STORY-ID]-[YYYY-MM-DD]-STORY-COMPLETE.md`:
Include all subtask handoffs rolled up, full AC coverage table, PR link, QA checklist.
Include the latest manager PR acceptance email from `docs/sessions/pr-[STORY-ID]-[YYYY-MM-DD].md`.

After writing the file, write commit token and commit:
  (Run the commit token PowerShell block from step 0 above)
  git add docs/sessions/
  git commit -m "docs([StoryID]): team handoff  [subtask-slug or STORY-COMPLETE]"

---

## STEP 3  Confirm

Output:
  COMMIT COMPLETE
  Type     : [type]
  Commits  : [list every commit message made, in order]
  README   : [what section(s) were updated, or "no changes needed"]
  CHANGELOG: [what entry was added under [Unreleased]]
  ADO      : [item ID]  Done  (or "N/A" if no ADO update for this type)
  PR       : [PR URL to develop or BLOCKED with reason]
  Email    : [manager acceptance email generated / DATA GAP: manager email]
  Next     : [next subtask from CONTEXT.md, or "Story complete  PR ready for review" if last subtask]

---

## STEP 4  HOW TO TEST (output after every subtask and story completion)

Generate a test guide based on what was just built. Derive content from CONTEXT.md and session state.
Skip this step for phase / epic / release / hotfix types.

Output this block immediately after COMMIT COMPLETE:

  
  HOW TO TEST  [what was built  one line title]
  Built    : [subtask name / story title]
  Layer    : [SP / Repository / Service / Endpoint / Component / Frontend Service]
  ACs      : [AC numbers covered]
  

  PREREQUISITES
  
  [List only what is non-obvious  omit if nothing special is needed]
  - Migration needed  : [Yes  run: dotnet ef database update] OR [No]
  - Seed data needed  : [Yes  describe] OR [No]
  - Config needed     : [any env var or appsettings value to set] OR [None]
  - Feature branch    : git checkout [branch-name]

  AUTOMATED TESTS (run these first)
  
  [Exact command(s) to run  adapt to SRS test framework]
  dotnet test --filter "[TestClassName]"       .NET
  ng test --include=[spec file path]           Angular
  Expected: [N] tests pass, 0 failures

  [List the test method names that cover this subtask  from CONTEXT.md branch list]
  - [MethodName_Condition_ExpectedResult]
  - [MethodName_Condition_ExpectedResult]

  MANUAL VERIFICATION
  
  [Tailor this section to the layer  use the matching sub-template below]

  --- IF LAYER = SP ---
  Open SSMS or Azure Data Studio and run:
    EXEC [Schema].[usp[Entity][Action]]
        @TenantId = [test tenant id],
        @[Param]  = [test value]
  Expected result : [rows returned / affected count / output param value]
  Error case      : EXEC ... @TenantId = 9999  Expected: 0 rows (wrong tenant)
  Soft-delete check: Update IsDeleted = 1 for a row, re-run  Expected: row excluded

  --- IF LAYER = Repository ---
  Unit tests cover this layer  no manual DB steps needed.
  Verify integration via the Service layer test or Endpoint test below.

  --- IF LAYER = Service ---
  Unit tests cover this layer  no manual steps needed.
  Confirm the following branches are exercised by the test suite:
  [List each branch from the AC traceability table]

  --- IF LAYER = Endpoint ---
  Open Swagger UI: https://localhost:[port]/swagger
  OR use the curl / HTTP file below:

    [METHOD] https://localhost:[port]/api/[route]
    Headers:
      Authorization: Bearer [paste JWT from /auth/login]
      Content-Type: application/json
    Body:
    {
      [paste minimal valid request body  derive from RequestDto]
    }

  Expected response:
    Status  : [200 / 201 / 204]
    Body    : [describe key fields to verify  e.g. "Id returned, Status = Active"]

  Error cases:
    Missing required field   400 + ValidationErrors populated
    Wrong tenant JWT         401 or 404 (no cross-tenant data)
    Non-existent resource    404 + Code = "[ErrorCode constant]"

  --- IF LAYER = Component ---
  Start the frontend: ng serve
  Navigate to: [route from UI-DESIGN.md]
  Steps:
    1. [User action]  Expected: [visual result]
    2. [User action]  Expected: [visual result]
  Empty state : [remove all data rows  what should display]
  Error state : [disconnect API / return 500  what should display]
  Loading state: [throttle network  spinner or skeleton visible]

  --- IF LAYER = Frontend Service ---
  Unit tests cover this layer  no manual steps needed.
  Verify via Component layer test above.

  AC SIGN-OFF CHECKLIST
  
  [One checkbox per AC covered by this subtask/story]
  [ ] AC[N]: [AC text]  verified by [test method name OR manual step number]
  [ ] AC[N]: [AC text]  verified by [test method name OR manual step number]

  

---

## STEP 5  CONTEXT.md checkpoint (subtask and story types only)

Skip for phase / epic / release / hotfix  no CONTEXT.md update needed for those types.

Write the full checkpoint to CONTEXT.md (overwrite existing):

  CONTEXT CHECKPOINT
  Story     : [ADO Story ID  Story Title]
  SRS Ver   : [from STACK CONFIRMED  e.g. v2.1]
  SRS Sect  : [N.N  SRS section covering this story]
  Updated   : [today date and time]
  Turn      : [approximate turn count this session]

  ### Subtask in progress
  [Next subtask name and ADO task ID  or "Story complete" if all subtasks ]

  ### Files created this story
  - [path/to/file]  [what it does]

  ### Files modified this story
  - [path/to/file]  [what changed]

  ### Key decisions made (max 5)
  1. [Decision]  [brief reason]

  ### Patterns used
  - [pattern name  where applied]

  ### AC coverage so far
  - AC1: [covered / in progress / not started]

  ### Next subtask
[Name of next subtask from BREAKDOWN.md  or "Story complete  PR ready for review"]

  ### Open questions / blockers
  - [Any unresolved question or blocker  or "None"]

---

## STEP 6  SESSION SUMMARY

Output this block to the terminal:

  SESSION SUMMARY  [Date]
  Story          : [ADO story ID and title]
  SRS Ver        : [version from STACK CONFIRMED  e.g. v2.1]
  SRS Sect       : [N.N  section covering this story]
  Tasks done     : [list ADO task IDs completed this session]
  Files created  : [list with paths]
  Files modified : [list with paths]
  Decisions made :
    1. [decision]  [reason]
  New entities in ENTITIES.md: [list or none]
  Next session starts at: [subtask name from BREAKDOWN.md]
  Open questions: [list or none]

  SRS AC COVERAGE (this session):
  
   AC #  AC text (from SRS N.N)                           Test method(s) covering it             Status   
  
   AC1   [full AC text]                                    AC1_[Method]_[Condition]_[Result]       /   
   AC2   [full AC text]                                    AC2_[Method]_[Condition]_[Result]       /   
  
  Any  = open subtask must be raised before next session.

---

## STEP 6.5  Write wrap_done to session state

  Run via Bash tool:
    $s = try { Get-Content '.claude/session.state' -Raw -ErrorAction SilentlyContinue | ConvertFrom-Json } catch { [PSCustomObject]@{} }
    $s | Add-Member -NotePropertyName 'wrap_done' -NotePropertyValue $true -Force
    $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'

  This marks the session checkpoint complete and releases any story-switch gates.
  CONTEXT.md must be written (STEP 5) before this step runs.

---

## STEP 7  Commit and push the CONTEXT.md checkpoint (subtask and story types only)

Skip for phase / epic / release / hotfix.

  Write commit token first:
    $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
    $ts = Get-Date -Format 'yyyyMMddHHmmss'
    $s | Add-Member -NotePropertyName 'commit_token' -NotePropertyValue "sw-done-$ts" -Force
    $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'

  git add CONTEXT.md
  git commit -m "chore([story-id]): context checkpoint  [subtask-slug]"
  git push origin [current branch]

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.4** (2026-05-21): Added Azure DevOps PR create/update enforcement after feature-branch push plus manager PR acceptance email output.
- **v2.3** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


