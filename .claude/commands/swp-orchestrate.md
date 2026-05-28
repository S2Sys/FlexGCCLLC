---
name: swp-orchestrate
description: |
  Run the full SmartWorkz planning pipeline end-to-end with checkpoint-gated progression.
  Manages all phases (Phase 0  Phase 3) in sequence, pausing at 3 checkpoints per phase before advancing:
    CP1  Spec review (auto-runs spec compliance check, you review findings)
    CP2  Quality review (auto-runs quality check, you review findings)
    CP3  Human sign-off keyword (you approve before next phase starts)
  Reads BREAKDOWN.md on start to resume from the last completed phase.
  Trigger when: starting a new project and wanting guided end-to-end planning, or resuming a partially complete pipeline.
  Usage: /swp-orchestrate            start or resume from BREAKDOWN.md state
         /swp-orchestrate resume     explicitly resume (same as above, more explicit)
         /swp-orchestrate [phase]    jump to a specific phase (e.g. /swp-orchestrate phase2)
compatibility: Any stack  orchestrates full swp-* pipeline
---

Command  : /swp-orchestrate
Version  : 2.2
Updated  : 2026-05-21

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

---

| Version | Date       | Author  | Changes                                                          |
|---------|------------|---------|------------------------------------------------------------------|
| 2.2     | 2026-05-21 | KapilDev | Added approval-gate publish enforcement: commit, push, PR to develop, and manager acceptance email after each planning approval |
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.3     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.2     | 2026-05-18 | Zenthil | Added Workflow Contract near the top: artifacts, status surface, prerequisites, and next-step guidance |
| 1.1     | 2026-05-17 | Zenthil | STEP 0 dashboard dynamic from BREAKDOWN.md rows; Phase 0 on-approval reads PATH CONFIRMED for flow-aware next step |
| 1.0     | 2026-05-15 | Zenthil | Initial version  full pipeline orchestrator with CP1/CP2/CP3    |

---

Run the full planning pipeline for: $ARGUMENTS

## Workflow Contract

- **Primary output artifacts:** `docs/BREAKDOWN.md` (phase state + locked flow), plus the phase documents produced by `/swp-srs`, `/swp-arch`, `/swp-design`, and `/swp-plan`
- **Progress status surface:** `docs/BREAKDOWN.md` is the primary human-readable progress dashboard; the Phase 0-3 dashboard shown by this command is read from it
- **Blocked by:** `docs/SRS.md` for a fresh start, and any missing prerequisite phase artifact or unresolved checkpoint sign-off when resuming
- **Next command / alternate path:** default planning route is `/swp-srs -> /swp-arch -> /swp-design -> /swp-plan`; use `/swp-status` for a read-only status check, or follow a PATH CONFIRMED split route only when the flow explicitly requires it

**Prerequisite:** `docs/SRS.md` must exist before Phase 0 can begin.
IF docs/SRS.md not found AND no completed phases in BREAKDOWN.md:
  STOP: "docs/SRS.md not found  run `/swp-srs` first to define the project."

Reads BREAKDOWN.md to detect current state. If no completed phases found, starts from Phase 0.
If phases are already complete, resumes from the first incomplete phase.

**Checkpoint model  3 gates per phase:**
```
[Phase command runs]
     CP1: Auto spec review    Claude checks output vs SRS requirements   you review findings
     CP2: Auto quality review  Claude checks design quality dimensions    you review findings
     CP3: Human sign-off      you type the approval keyword               next phase starts
```

---

## STEP 0  Start-up: read state and show pipeline dashboard

Read in order:
1. `docs/BREAKDOWN.md`  determine which phases are complete
2. `docs/SRS.md`  extract product name and SRS version (if it exists)
3. Check for: `docs/ARCH-DESIGN.md`, `docs/UI-DESIGN.md`, `docs/DB-DESIGN.md`

Then output the pipeline dashboard:

```
IF docs/BREAKDOWN.md exists AND has flow phase rows (written by /swp-srs STEP 13):
  Build rows from BREAKDOWN.md  read every `## Phase` line in order.
  Output:
  
    SmartWorkz Planning Orchestrator  [Product Name or "New Project"] 
    Flow: [Flow Name from PATH CONFIRMED  or "Path not yet locked"]  
  
    [Each ## Phase row from BREAKDOWN.md, in order, with STATUS]      
  
    Resuming from: [first incomplete phase or "Phase 0  starting fresh"] 
  
ELSE (BREAKDOWN.md missing or has no flow rows yet):
  
    SmartWorkz Planning Orchestrator  [Product Name or "New Project"] 
  
    Phase 0   SRS Review            Pending  starting now         
    [Remaining phases shown after /swp-srs PATH SELECTION completes]  
  
    Resuming from: Phase 0  starting fresh                          
  
```

STATUS values:
- ` Complete (YYYY-MM-DD)`  phase is `[x]` in BREAKDOWN.md
- ` Pending  starting now`  this is the current phase about to run
- ` Queued`  will run after current phase completes
- ` BLOCKED`  cannot start until prerequisites are complete

---

## CHECKPOINT DEFINITION

Every phase follows this 3-checkpoint pattern before advancing:

### CP1  Spec Compliance Review (automated)

After a phase command completes its design output, Claude automatically runs a spec review:

```
CP1  SPEC COMPLIANCE REVIEW

Checking: Does this phase output cover all SRS requirements

Reading: docs/SRS.md (features + acceptance criteria)
Checking against: [phase output document]

SPEC REVIEW FINDINGS:
   Covered: [list of SRS requirements that are addressed]
   Missing: [list of SRS requirements NOT addressed in this phase output]
    Partial: [list of requirements partially addressed]

VERDICT: [PASS  all requirements covered | FAIL  [N] gaps found]

```

If FAIL: Claude lists the gaps and asks if you want to:
- Fix the gaps now (re-run the phase section that's incomplete)
- Accept with condition (document the gap as a PENDING DECISION)
- Skip (proceed with known gap  note it in BREAKDOWN.md)

If PASS: output "CP1 PASSED  proceeding to CP2 quality review."

### CP2  Quality Review (automated)

After CP1 passes, Claude runs a quality check:

```
CP2  QUALITY REVIEW

Checking: Does this phase output meet quality standards

QUALITY DIMENSIONS: (phase-specific  see per-phase sections below)

QUALITY REVIEW FINDINGS:
   Passed: [dimension  reason]
   Failed: [dimension  specific issue]
    Warning: [dimension  minor issue]

SCORE: [N]/100
VERDICT: [PASS 80 | CONDITIONAL 6079 (list conditions) | FAIL <60]

```

If FAIL: Claude lists specific issues and asks if you want to fix them.
If CONDITIONAL: lists conditions that must be met. You decide: fix now or accept condition.
If PASS: output "CP2 PASSED  awaiting your sign-off (CP3)."

### CP3  Human Sign-Off

After CP1 and CP2 both pass (or conditions are accepted):

```
CP3  AWAITING YOUR SIGN-OFF

Phase [N] is ready for your approval.

CP1 Spec Review :  PASSED /  CONDITIONAL ([N] conditions noted)
CP2 Quality     :  PASSED /  CONDITIONAL ([N] conditions noted)

Review the output above, then type the approval keyword to advance:

  "[approval keyword]"  approve and continue to next phase
  "[approval keyword] with condition: [note]"  approve with a noted condition
  "revise: [what to change]"  request changes before approving

```

Wait for the approval keyword. Do NOT advance to the next phase until CP3 is received.

---

## APPROVAL PUBLISH STEP  Commit, push, PR, manager email

Run this step immediately after every exact CP3 approval phrase is accepted and before advancing to the next phase.

This step publishes the approved planning artifact to Azure DevOps Git and raises or updates a PR into `develop`.

1. Confirm the current branch is not `main` or `develop`.
   - If the current branch is `main` or `develop`, create or ask for a planning branch such as `feature/phase-[N]-[short-name]` before committing.
   - Direct push to `develop` remains prohibited.

2. Stage only artifacts owned by the approved phase:
   - Phase 0: `docs/SRS.md`, `docs/BREAKDOWN.md`, and SRS/path-selection artifacts
   - Phase 1A: architecture artifacts and `docs/BREAKDOWN.md`
   - Phase 1B: scaffold files, build/config files, and `docs/BREAKDOWN.md`
   - Phase 2: UI/DB design artifacts, `ENTITIES.md`, and `docs/BREAKDOWN.md`
   - Phase 3: `docs/BREAKDOWN.md`, ADO handoff notes, and planning summary artifacts
   Run `git add [approved phase artifacts]` only for those files.

3. Write commit token, then commit with the phase-specific commit message listed in the phase section:
   ```powershell
   $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
   $ts = Get-Date -Format 'yyyyMMddHHmmss'
   $s | Add-Member -NotePropertyName 'commit_token' -NotePropertyValue "swp-approval-$ts" -Force
   $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
   git commit -m "[phase-specific commit message]"
   ```

4. Push the current branch:
   ```powershell
   git push origin [current branch]
   ```

5. Create or update an Azure DevOps PR targeting `develop`.
   Prefer Azure DevOps CLI:
   ```powershell
   $branch = git branch --show-current
   $existing = az repos pr list --source-branch $branch --target-branch develop --status active --query "[0].pullRequestId" -o tsv 2>$null
   if ($existing) {
     az repos pr update --id $existing --title "[generated planning PR title]" --description "[generated planning PR description]"
     $prUrl = az repos pr show --id $existing --query "url" -o tsv
   } else {
     az repos pr create --source-branch $branch --target-branch develop --title "[generated planning PR title]" --description "[generated planning PR description]" --draft true
     $prUrl = az repos pr list --source-branch $branch --target-branch develop --status active --query "[0].url" -o tsv
   }
   ```

6. If Azure DevOps CLI is unavailable, output `PR CREATION BLOCKED`, print the ready-to-paste PR title/body, and wait for the PR URL before advancing.

7. Generate and print a manager acceptance email:
   ```text
   To      : [manager email or DATA GAP]
   Subject : Planning approval PR acceptance request - Phase [N]

   Hi [Manager Name],

   Phase [N] has been approved and published for review.

   PR       : [PR URL]
   Target   : develop
   Branch   : [source branch]
   Artifacts: [approved artifacts]
   Approval : [exact approval phrase]

   Please review and accept the PR in Azure DevOps if the approved phase output is ready to merge.

   Thanks,
   KapilDev
   ```

If manager email is not available from session state or user input, mark it as `DATA GAP` and list it as a handoff blocker without inventing a recipient.

## PHASE 0  SRS Review

**Approval keyword:** `"SRS approved"`

### Phase 0 execution

Run /swp-srs:
- Read docs/SRS.md (or create it if missing)
- Execute the full SRS review protocol (as defined in /swp-srs command)
- Output: stack completeness, story quality, NFR review, Go/No-Go scored decision

### Phase 0  CP1 Spec Compliance

```
CP1 for Phase 0  SRS Completeness Check:
  / STACK CONFIRMED block present with all required categories
  / All Must Have features have at least 2 ACs each
  / NFRs defined (performance, security, availability)
  / All Epics have at least one Story
  / No placeholder or TBD sections in SRS
```

### Phase 0  CP2 Quality Dimensions

```
CP2 for Phase 0  SRS Quality:
  1. Market fit (TAM/SAM/SOM defined)        [20 pts]
  2. Stack completeness (all categories)     [20 pts]
  3. Story quality (Given/When/Then + ACs)   [20 pts]
  4. NFR coverage (perf + security + avail)  [20 pts]
  5. Competitor analysis present             [20 pts]
```

### Phase 0  On CP3 approval

After "SRS approved":
- BREAKDOWN.md is created by /swp-srs STEP 13 (PATH SELECTION)  do not recreate.
  IF BREAKDOWN.md does not exist: output " BREAKDOWN.md missing  /swp-srs STEP 13 (PATH SELECTION) may not have completed. Run /swp-srs to finish PATH SELECTION before continuing." and STOP.
- Read docs/SRS.md PATH CONFIRMED block.
  IF PATH CONFIRMED missing: output " PATH CONFIRMED not locked  run /swp-srs to complete PATH SELECTION." and STOP.
- Run APPROVAL PUBLISH STEP with commit message:
  `docs(phase-0): SRS approved  flow locked`
- Output:

```
PHASE 0 COMPLETE  SRS approved
Flow locked : [Flow Name from PATH CONFIRMED]
Next phase  : Run [Phase 1 command from PATH CONFIRMED  or Phase 2 command if Phase 1 is N/A for this flow]
Sequence    : [Phase 1 cmd]  [Phase 2 cmd(s)]  /swp-plan  dev
```

---

## PHASE 1A  Architecture Design

**Approval keyword:** `"architecture approved"`

### Phase 1A execution

Run /swp-arch Stage 1:
- Read docs/SRS.md and detect stack
- Design solution architecture (layers, project structure, DI, pipeline)
- Output: docs/ARCH-DESIGN.md

### Phase 1A  CP1 Spec Compliance

```
CP1 for Phase 1A  Architecture vs SRS:
  / Every SRS Epic has a corresponding service/module in ARCH-DESIGN.md
  / STACK CONFIRMED backend type matches architecture patterns used
  / Every entity from ENTITIES.md appears in the architecture layer assignments
  / Middleware pipeline defined (auth, logging, error handling)
  / DI registration plan covers all services
```

### Phase 1A  CP2 Quality Dimensions

```
CP2 for Phase 1A  Architecture Quality:
  1. Layer separation (API / Service / Repository / DB)     [20 pts]
  2. DI container properly configured                       [20 pts]
  3. Base class inventory (BaseEntity, BaseController, etc) [20 pts]
  4. Cross-cutting concerns (logging, auth, error handling) [20 pts]
  5. Testing architecture (unit test project structure)     [20 pts]
```

### Phase 1A  On CP3 approval

After "architecture approved":
- Mark 1A [x] in BREAKDOWN.md
- Run APPROVAL PUBLISH STEP with commit message:
  `docs(phase-1): architecture approved  ARCH-DESIGN.md committed`
- Output:

```
PHASE 1A COMPLETE  Architecture approved
Auto-continuing to Phase 1B: Scaffold
```

---

## PHASE 1B  Scaffold

**Approval keyword:** `"scaffold approved"`

### Phase 1B execution

Run /swp-arch Stage 2 (scaffold):
- Read docs/ARCH-DESIGN.md
- Create solution structure, projects, references, config files
- Run: dotnet build / npm install / equivalent  must pass with 0 errors, 0 warnings

### Phase 1B  CP1 Spec Compliance

```
CP1 for Phase 1B  Scaffold vs ARCH-DESIGN.md:
  / All projects/packages listed in ARCH-DESIGN.md exist in solution
  / Project references match the dependency graph in ARCH-DESIGN.md
  / All base classes from ARCH-DESIGN.md are created (empty stubs OK)
  / Middleware pipeline from ARCH-DESIGN.md is wired in Program.cs/main
  / NuGet/npm packages match the ARCH-DESIGN.md approved list
```

### Phase 1B  CP2 Quality Dimensions

```
CP2 for Phase 1B  Build Quality:
  1. Build result: 0 errors                    [40 pts  CRITICAL, auto-FAIL if not met]
  2. Build result: 0 warnings                  [20 pts]
  3. .gitignore covers all sensitive files     [20 pts]
  4. Config files use placeholder values only  [20 pts]
```

Note: If build errors exist, Phase 1B CP2 auto-FAILs regardless of other scores.

### Phase 1B  On CP3 approval

After "scaffold approved":
- Mark 1B [x] in BREAKDOWN.md
- Run APPROVAL PUBLISH STEP with commit message:
  `chore(phase-1): scaffold approved  solution structure committed`
- Output:

```
PHASE 1B COMPLETE  Scaffold approved
PHASE 1 COMPLETE  Architecture + Scaffold done

1A Architecture : [x]
1B Scaffold     : [x]

Proceeding to Phase 2: UI/UX + DB Design (runs as /swp-design)
```

---

## PHASE 2  UI/UX + DB Design

**Approval keyword:** `"design approved"`

Phase 2 runs as a single combined /swp-design command covering both 2A (UI) and 2B (DB).

### Phase 2 execution

Run /swp-design:
- Section A: UI/UX design  internal gate "ui section reviewed"
- Section B: DB design  final gate "design approved"
- Outputs: docs/UI-DESIGN.md, docs/DB-DESIGN.md, updated ENTITIES.md

### Phase 2  CP1 Spec Compliance

```
CP1 for Phase 2  Design vs SRS:
  / Every SRS acceptance criterion has at least one screen in UI-DESIGN.md
  / Every SRS entity has a table in DB-DESIGN.md
  / Every SRS feature has a SP plan in DB-DESIGN.md
  / UI screen data sources map to DB SPs
  / UI-DESIGN.md screen list matches DB-DESIGN.md data model (no orphan screens)
```

### Phase 2  CP2 Quality Dimensions

```
CP2 for Phase 2  Design Quality:
  1. UI: All screens have wireframes + component hierarchy     [15 pts]
  2. UI: Dark mode + WCAG AA confirmed for all components      [15 pts]
  3. UI: State management plan covers all shared state         [10 pts]
  4. DB: All tables have TenantId + IsDeleted                  [20 pts  CRITICAL]
  5. DB: All tables have full CRUD SP plan                     [20 pts]
  6. DB: Migration plan covers all tables                      [20 pts]
```

Note: If any table is missing TenantId or IsDeleted, CP2 auto-FAILs on dimension 4.

### Phase 2  On CP3 approval

After "design approved":
- Mark 2A [x] and 2B [x] in BREAKDOWN.md (if /swp-design did not already)
- Mark Phase 3 READY in BREAKDOWN.md
- Run /swp-sync to validate cross-doc consistency
- Run APPROVAL PUBLISH STEP with commit message:
  `docs(phase-2): UI/UX + DB design approved  2A and 2B signed off`
- Output:

```
PHASE 2 COMPLETE  UI/UX + DB Design approved

2A UI/UX Design : [x]
2B DB Design    : [x]
Phase 3          : READY

Proceeding to Phase 3: Dev Stories
```

---

## PHASE 3  Dev Stories

**Approval keyword:** `"breakdown approved"`

### Phase 3 execution

Run /swp-plan:
- Execute the full SRS Breakdown Protocol (CLAUDE.md 27)
- Levels 14: Epic  Story  Task  Subtask
- Level 5: Create ADO items
- Output: docs/BREAKDOWN.md updated with all stories and tasks

### Phase 3  CP1 Spec Compliance

```
CP1 for Phase 3  Breakdown vs SRS:
  / Every SRS Must Have feature has at least one Epic
  / Every Epic has at least one Story
  / Every Story has 25 ACs (Given/When/Then format)
  / Every Story has tasks for all applicable layers (DB / Repo / Service / API / Frontend)
  / Every AC from SRS is traced to at least one Story AC
```

### Phase 3  CP2 Quality Dimensions

```
CP2 for Phase 3  Breakdown Quality:
  1. Sprint capacity estimate present (story points or day estimates)  [20 pts]
  2. No circular dependencies between stories                         [20 pts]
  3. Subtask granularity  each subtask is 1 Claude session turn      [20 pts]
  4. ADO items created (or ADO MCP unavailable + manual noted)        [20 pts]
  5. BREAKDOWN.md status set to "In ADO" (or "Story-Approved" if ADO unavailable) [20 pts]
```

### Phase 3  On CP3 approval

After "breakdown approved":
- Mark 3 [x] in BREAKDOWN.md
- Run APPROVAL PUBLISH STEP with commit message:
  `docs(phase-3): dev stories approved  breakdown complete, ADO items created`
- Output:

```
PHASE 3 COMPLETE  Dev Stories approved

All planning phases complete:
  0  SRS Review         : [x]
  1A Architecture       : [x]
  1B Scaffold           : [x]
  2A UI/UX Design       : [x]
  2B DB Design          : [x]
  3  Dev Stories        : [x]

PLANNING PIPELINE COMPLETE 

Next: Run /swd-start [Story ID] to begin development.
      Run /swp-status at any time to see progress.
```

---

## RESUME LOGIC

When `/swp-orchestrate` or `/swp-orchestrate resume` is run:

1. Read docs/BREAKDOWN.md
2. Find the first phase that is NOT `[x]`
3. Skip all `[x]` phases silently
4. Show dashboard with current state
5. Begin execution from the first incomplete phase

If docs/BREAKDOWN.md does not exist:
- Output: "No BREAKDOWN.md found  starting from Phase 0."
- Begin Phase 0.

If all phases are `[x]`:
- Output: "All planning phases are complete. Run /swd-start [Story ID] to begin development."
- Stop.

---

## PIPELINE FAILURE HANDLING

### If a CP1 or CP2 check FAILs

Claude will:
1. List specific gaps or issues clearly
2. Ask: "Fix now, or accept with condition, or skip"
3. If "fix now": re-run the relevant section of the phase command, then re-run the checkpoint
4. If "accept with condition": note the condition in BREAKDOWN.md under the phase section, treat as CONDITIONAL PASS
5. If "skip": note as known gap, treat as CONDITIONAL PASS with warning

A CONDITIONAL PASS allows advancement but records the condition. The condition is visible in the Phase 3 breakdown as a note.

### If a phase command cannot run (prereq missing)

Output:
```
ORCHESTRATOR BLOCKED  Phase [N] cannot run
Missing prerequisite: [file or condition]
Action required: [what to do manually before resuming]

Resume with: /swp-orchestrate resume
```

Do not attempt to auto-fix missing prerequisites. Stop and wait for manual resolution.

---

## COMMAND QUICK REFERENCE

| Command | What it does |
|---------|-------------|
| `/swp-orchestrate` | Start or resume the full pipeline from BREAKDOWN.md state |
| `/swp-orchestrate resume` | Explicitly resume (same as above) |
| `/swp-status` | Show phase dashboard without running anything |
| `/swp-srs` | Run Phase 0 standalone |
| `/swp-arch` | Run Phase 1 standalone (Stage 1  Stage 2) |
| `/swp-design` | Run Phase 2 standalone (UI + DB combined) |
| `/swp-ui` | Run Phase 2A standalone |
| `/swp-db` | Run Phase 2B standalone |
| `/swp-plan` | Run Phase 3 standalone |
| `/swp-sync` | Validate cross-doc consistency at any point |

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.2** (2026-05-21): Added approval-gate publish enforcement: commit, push, PR to develop, and manager acceptance email after each planning approval.
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


