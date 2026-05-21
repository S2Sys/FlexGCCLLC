---
name: swp-plan
description: |
  Run the SRS Breakdown Protocol - produce root-only grouped dated docs/GGG.NNN.breakdown-YYYY-MM-DD.md and create all epics, stories, tasks, and acceptance criteria in Azure DevOps (ADO). Blocked until all design phases (Section 1A + 1B + 2A + 2B) are complete. Supports ADO UPDATE MODE for mid-project SRS changes.
  Trigger when: all design phases are approved, creating ADO work items, generating the development plan, or running /swp-plan.
compatibility: Any stack - produces root-only grouped breakdown docs and Azure DevOps work items
---

Command  : /swp-plan
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

## Standalone Approval Publish Contract

When this command is run outside `/swp-orchestrate`, every Level approval gate must still publish the approved planning state.

Run `.claude/refs/approval-publish-contract.md` after each exact approval phrase:

- `epics approved`
- `stories approved`
- `tasks approved`
- `subtasks approved`
- `breakdown approved` or final Level 5 ADO/BREAKDOWN completion

For intermediate approvals before `docs/BREAKDOWN.md` is final, write or update `docs/sessions/pr-phase-3-breakdown-[YYYY-MM-DD].md` with the approved level summary, then use it as the PR handoff file.

This standalone command must not mark Phase 3 complete or development-ready unless the final approval publish summary includes a pushed branch and a PR URL targeting `develop`.

---

## Generated Docs Filename Sequence Contract

All generated planning sub-doc markdown artifacts must use a grouped dot-sequence filename with an ISO date suffix and must live directly under the repository root `docs/` folder only.

- Filename format: `docs/[GGG].[NNN].[name]-[YYYY-MM-DD].md`
- `GGG` is the three-digit document group number for the current project/product flow, for example `001`.
- `NNN` is the three-digit sequence number inside that group, for example `001`, `002`, `003`.
- `name` is the lowercase kebab-case document name, for example `srs`, `arch-design`, `ui-design`, `db-design`, `entities`, or `breakdown`.
- `YYYY-MM-DD` is the artifact creation date or approved regeneration date, using the local workflow date.
- Examples: `docs/001.001.srs-2026-05-20.md`, `docs/001.002.entities-2026-05-20.md`, `docs/001.003.breakdown-2026-05-20.md`, `docs/001.004.arch-design-2026-05-20.md`.
- Root-only rule: do not create generated planning sub-docs under nested folders such as `docs/srs/`, `docs/design/`, `docs/plan/`, `docs/archive/`, or `docs/superpowers/`.

Before creating or updating generated planning docs:

1. Scan root `docs/` only for existing grouped dated docs matching `^[0-9]{3}\.[0-9]{3}\.[a-z0-9-]+-[0-9]{4}-[0-9]{2}-[0-9]{2}\.md$`.
2. Select the active `GGG` group from the existing SRS/BREAKDOWN group when present; otherwise create the next available group, starting at `001`.
3. For a new artifact in the active group, use the next available `NNN` in that group. If SRS exists as `docs/001.001.srs-2026-05-20.md`, the next generated doc in that flow is `docs/001.002.[name]-[YYYY-MM-DD].md`, then `docs/001.003.[name]-[YYYY-MM-DD].md`.
4. Preserve existing `GGG.NNN.name-date` filenames on updates. Never renumber, reuse, or change an existing `GGG.NNN` slot/date unless the user explicitly says `renumber docs approved` or `redate docs approved`.
5. If a legacy unnumbered doc exists, such as `docs/SRS.md`, `docs/UI-DESIGN.md`, `docs/DB-DESIGN.md`, `docs/ENTITIES.md`, or `docs/BREAKDOWN.md`, read it as an input alias but write any newly generated artifact using the grouped dated filename format.
6. If generated planning markdown docs are found outside root `docs/`, report them and stop before creating more docs unless the user explicitly approves migration.
7. Add a completion validation block whenever docs are written:

```text
GENERATED DOC GROUP SEQUENCE VALIDATION:
  Docs root              : docs/
  Active group           : [GGG]
  Artifact date          : [YYYY-MM-DD]
  Root grouped docs seen : [N]
  New docs created       : [docs/GGG.NNN.name-YYYY-MM-DD.md, ...]
  Existing docs updated  : [docs/GGG.NNN.name-YYYY-MM-DD.md, ...]
  Nested docs detected   : none / [list]
  Duplicate group.seq    : none / [list]
  Date mismatches        : none / [list]
  Gaps found             : none / [list]
  Verdict                : PASS / FAIL
```
| Version | Date       | Author  | Changes |
|---------|------------|---------|---------|
| 2.2     | 2026-05-21 | KapilDev | Added standalone Level approval publish enforcement: commit, push, PR to develop, and manager acceptance email after each breakdown approval |
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.15    | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.14    | 2026-05-20 | KapilDev | Added ISO date suffix to grouped generated markdown artifact names: `docs/[GGG].[NNN].[name]-[YYYY-MM-DD].md` |
| 1.13    | 2026-05-20 | KapilDev | Changed generated markdown artifact naming to root-only grouped `docs/[GGG].[NNN].[name].md` sequence format |
| 1.12    | 2026-05-20 | KapilDev | Added generated-doc filename sequence enforcement for grouped sequence BREAKDOWN artifacts |
| 1.11     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.10    | 2026-05-18 | Zenthil | Added Workflow Contract near the top: artifacts, status surface, prerequisites, and next-step guidance aligned to the planning family |
| 1.8     | 2026-05-17 | Zenthil | Pre-flight #3: PATH CONFIRMED-aware phase gate - reads locked flow, validates only applicable phases, uses correct command names in error messages |
| 1.7     | 2026-05-15 | Zenthil | Pre-flight check 3: BREAKDOWN guard - blocks until all design phases Section 1A + 1B + 2A + 2B are [x] |
| 1.6     | 2026-05-14 | Zenthil | 8 audit gaps resolved: dead mini-breakdown ref removed; BREAKDOWN.md schema added; L4.5 Skill invocation fixed; push branch fixed (HEAD); pre-flight checks; DELETED ADO state in Step B+C; partial failure recovery (ado_create_epic included); ADO process template note |
| 1.5     | 2026-05-13 | Zenthil | ADO UPDATE MODE - detects existing BREAKDOWN.md, checks item state via ado_get_item, routes OPEN->update, CLOSED->follow-up+comment, NEW->create; MCP server v1.4.0 adds title/description/AC fields to ado_update_item |
| 1.4     | 2026-05-13 | Zenthil | Level 2: Added SRS Section field to every story format so dev always knows which SRS section drives each story |
| 1.3     | 2026-05-13 | Zenthil | Level 2: Added Priority (Must Have/Should Have/Won't Have) on every story; Sprint Capacity Estimate table with fit assessment; circular dependency validation |
| 1.2     | 2026-05-13 | Zenthil | Added Level 4.5 /swp-sync validate gate before ADO creation |
| 1.1     | 2026-05-13 | Zenthil | Added Go/No-Go scored decision (5x20 pts) + PENDING DECISIONS matrix between Level 4 and Level 5 |
| 1.0     | -          | Zenthil | Initial 5-level breakdown version |

---

Run the SRS Breakdown Protocol (CLAUDE.md Section 27).
Scope: $ARGUMENTS (leave blank for full project breakdown - scoped per-Epic or per-Story not supported in this version)

## Workflow Contract

- **Primary output artifacts:** root-only grouped `docs/[GGG].[NNN].breakdown-[YYYY-MM-DD].md` with the approved Level 1-5 breakdown and ADO IDs, plus ADO Epics, Stories, and Tasks created or updated from that breakdown
- **Progress status surface:** `docs/BREAKDOWN.md` is the primary status surface; row Status values (`Subtask-Approved`, `In ADO`, `Follow-up`, `Done`) are the shared progress view
- **Blocked by:** approved upstream planning phases from the locked flow, valid `docs/SRS.md`, and ADO availability for Level 5 item creation
- **Next command / alternate path:** after a successful fresh run, start delivery with `/swd-start [Story ID]`; if `docs/BREAKDOWN.md` already shows `In ADO`, this command takes the ADO UPDATE MODE path instead of the fresh Level 1-5 path

Development is BLOCKED until this breakdown is complete and approved at all 5 levels.
Do not write any implementation code during this command.

---

BEFORE STARTING  pre-flight checks, then read files:

PRE-FLIGHT:
1. Verify docs/SRS.md exists  if missing: STOP immediately  "docs/SRS.md not found. Cannot begin breakdown."
2. Check ADO MCP availability  if unavailable: note it and continue through Levels 14 normally; when Level 4.5 is reached, output "ADO MCP unavailable  stopping here. Re-run /swp-plan when MCP is restored to create ADO items in Level 5." and STOP at that point.
3. Check docs/BREAKDOWN.md  verify all required phases are signed off before creating dev stories:
     If docs/BREAKDOWN.md does not exist:
       BLOCKED  run /swp-srs first to generate the phase skeleton.
     If docs/BREAKDOWN.md exists:
       Read docs/SRS.md PATH CONFIRMED block to determine which phases apply to this flow.
       IF PATH CONFIRMED is missing:
          WARNING  PATH CONFIRMED not found. Checking all phases as fallback.
         Phase 1A [x]  if [ ] pending: BLOCKED  run /swp-arch first
         Phase 1B [x]  if [ ] pending: BLOCKED  run /swp-arch (Stage 2) first
         Phase 2A [x]  if [ ] pending: BLOCKED  run /swp-ui first
         Phase 2B [x]  if [ ] pending: BLOCKED  run /swp-db first
       IF PATH CONFIRMED found:
         Extract Phase 1 and Phase 2 commands from PATH CONFIRMED.
         For each phase row in BREAKDOWN.md (in order  skip Phase 0 and Phase 3):
           If the row is still [ ] pending:
             BLOCKED  [Phase label] not complete.
             Run [the command shown in that phase row's (command: ...) annotation] first.
             Your locked flow: [Flow Name]  [Phase 1 cmd]  [Phase 2 cmd(s)]  /swp-plan
         If all non-Phase-3 rows are [x]: output "All required phases approved for [Flow Name]  proceeding to breakdown." and continue.

4. PATH CHECK  read docs/SRS.md PATH CONFIRMED block:
     IF PATH CONFIRMED block is missing:
        WARNING  PATH CONFIRMED not found. Run /swp-srs to lock a delivery flow.
       Proceeding without path enforcement.
     IF PATH CONFIRMED found:
       Extract: Flow name, Phase 1, Phase 2, Phase 3 commands.
       Verify all PATH CONFIRMED Phase 2 commands are now [x] in BREAKDOWN.md before proceeding.
       Output: "PATH CONFIRMED: [Flow Name]  /swp-plan is Phase 3 (correct next step )"
       After this command: /swd-start  development phase begins.

READ (after pre-flight passes):
1. docs/SRS.md  full document, especially STACK CONFIRMED block and all feature sections
2. ENTITIES.md  registered tables (do not create entities already listed)
3. docs/BREAKDOWN.md  load current status and all approved phase items (required  confirmed in pre-flight check 3)

---

## ADO UPDATE MODE  runs instead of LEVEL 15 when breakdown already exists

Check docs/BREAKDOWN.md for any row with Status = "In ADO":

  Status "In ADO" found  ADO UPDATE MODE (skip LEVEL 15, jump to ADO UPDATE MODE below)
  No "In ADO" status    FRESH RUN (continue with LEVEL 1 as normal)

---

---

## LEVEL 1  Extract Epics from SRS

Group all product features from the SRS into Epics.
Rules for Epic grouping:
- One Epic = one bounded context / one DB schema domain
- An Epic delivers a complete user-facing capability group
- Target: 2-8 Epics per product (more = scope creep, fewer = too coarse)

Output exactly this format:

  BREAKDOWN  LEVEL 1: EPIC LIST
  SRS Version: [SRS-vX.X]
  Date: [today]

  EPIC 1: [Name]
    Description: [one sentence  what user capability this delivers]
    DB Schema  : [schema name this Epic owns]
    SRS Sections: [list SRS section numbers that define this Epic's features]
    Stories (est): [N]
    Priority   : High / Medium / Low

  EPIC 2: [Name]
    ...

  TOTAL: [N] Epics

  
  LEVEL 1 GATE  Tech lead review required.
  Say "epics approved" to generate Stories.
  Say "revise epics: [feedback]" to adjust.
  

[STOP  wait for "epics approved" before continuing]

---

## LEVEL 2  Generate Stories per Epic

After "epics approved":

Run the Standalone Approval Publish Contract with a `docs/sessions/pr-phase-3-breakdown-[YYYY-MM-DD].md` handoff summarizing approved Epics.

For each Epic, generate User Stories. Rules:
- One Story = one deployable, testable unit of work
- Max complexity: 3-5 days of development
- Each Story MUST have 2-5 ACs. Each AC is testable, specific, measurable.
- Story title format: "As a [user], I want [action], so that [benefit]"

Output exactly this format:

  BREAKDOWN  LEVEL 2: STORY LIST

  EPIC 1: [Epic Name]
  
  Story 1.1: [Title]
  User story : As a [user], I want [action], so that [benefit]
  SRS Section: N.N  [SRS section title covering this story]
  Priority   : Must Have | Should Have | Won't Have (v1.0)
  AC1: [testable criterion  specific, no ambiguity]
  AC2: [testable criterion]
  AC3: [testable criterion]
  Complexity : S ( day) / M (1-2 days) / L (3-5 days)
  Depends on : [Story IDs this story requires first, or "none"]

  Story 1.2: [Title]
  ...

  EPIC 2: [Epic Name]
  
  ...

  TOTAL STORIES: [N]
  Must Have: [N] | Should Have: [N] | Won't Have (v1.0): [N]

  SPRINT CAPACITY ESTIMATE (Sprint 1 = Must Have stories only):
  
   Story ID  Title                                   Complexity      Est Days 
  
   1.1       [title]                                 S/M/L           0.5/2/4  
   ...       ...                                     ...             ...      
  
  Sprint 1 total estimate : [N] days
  Standard sprint capacity: 10 days (2 devs  5 days)
  Fit assessment          : [FITS / OVER CAPACITY by [N] days  defer [list] to Sprint 2]

  DEPENDENCY CHAIN VALIDATION:
  Check for circular dependencies. If any story A depends on B and B depends on A:
    CIRCULAR DEPENDENCY: Story [A]  Story [B]  resolve before approving stories.

  
  LEVEL 2 GATE  Tech lead review required.
  Say "stories approved" to generate Tasks.
  Say "revise story [N.N]: [feedback]" to adjust a specific story.
  

[STOP  wait for "stories approved" before continuing]

---

## LEVEL 3  Generate Tasks per Story

After "stories approved":

Run the Standalone Approval Publish Contract with a `docs/sessions/pr-phase-3-breakdown-[YYYY-MM-DD].md` handoff summarizing approved Stories.

For each Story, generate Tasks  one per technical layer.
Read SRS STACK CONFIRMED to determine which layers apply. Omit layers not in the stack.

Standard layers (adapt to stack):
  Task A: DB/Storage  schema, tables, stored procedures, migrations
  Task B: Data access  repository interface + implementation
  Task C: Business logic  service interface + implementation
  Task D: API  controller, request/response DTOs, validators
  Task E: Frontend  component, frontend service, state management
  Task F: Unit tests  for Tasks B, C, D

Output exactly this format:

  BREAKDOWN  LEVEL 3: TASK LIST

  Story 1.1: [Story Title]
  
  Task 1.1.A: DB/Storage layer
    Covers ACs: [AC1, AC2]
    Est: 2h
  Task 1.1.B: Data access layer (Repository)
    Covers ACs: [AC1]
    Est: 2h
  Task 1.1.C: Business logic layer (Service)
    Covers ACs: [AC1, AC2, AC3]
    Est: 3h
  Task 1.1.D: API layer (Controller + DTOs)
    Covers ACs: [AC2, AC3]
    Est: 2h
  Task 1.1.E: Frontend layer
    Covers ACs: [AC3]
    Est: 3h
  Task 1.1.F: Unit tests
    Covers ACs: [all  verification]
    Est: 2h

  Story 1.2: ...

  TOTAL TASKS: [N]

  
  LEVEL 3 GATE  Tech lead review required.
  Say "tasks approved" to generate Subtasks.
  Say "revise task [N.N.X]: [feedback]" to adjust.
  

[STOP  wait for "tasks approved" before continuing]

---

## LEVEL 4  Generate Subtasks per Task

After "tasks approved":

Run the Standalone Approval Publish Contract with a `docs/sessions/pr-phase-3-breakdown-[YYYY-MM-DD].md` handoff summarizing approved Tasks.

For each Task, generate Subtasks  one per file Claude will write in one session turn.
Rules:
- One subtask = one file = one Claude session turn
- Subtask name = what the file IS, not what it does
- Order matters  list in implementation sequence (dependencies first)

Output exactly this format:

  BREAKDOWN  LEVEL 4: SUBTASK LIST

  Task 1.1.A: DB/Storage layer
  
  Subtask 1.1.A.1: Create [schema].[TableName] table migration
  Subtask 1.1.A.2: Create [schema].usp[Entity]Insert SP file
  Subtask 1.1.A.3: Create [schema].usp[Entity]GetById SP file
  Subtask 1.1.A.4: Create [schema].usp[Entity]GetPaged SP file
  Subtask 1.1.A.5: Create [schema].usp[Entity]Update SP file
  Subtask 1.1.A.6: Create [schema].usp[Entity]Delete SP file
  Subtask 1.1.A.7: EF Core migration to deploy all SPs above

  Task 1.1.B: Data access layer
  
  Subtask 1.1.B.1: Create I[Entity]Repository interface
  Subtask 1.1.B.2: Create [Entity]Repository implementation
  Subtask 1.1.B.3: Register repository in DI (Program.cs update)

  Task 1.1.C: Business logic layer
  
  Subtask 1.1.C.1: Create I[Feature]Service interface
  Subtask 1.1.C.2: Create [Feature]Service implementation
  Subtask 1.1.C.3: Register service in DI (Program.cs update)

  Task 1.1.D: API layer
  
  Subtask 1.1.D.1: Create [Feature]RequestDto + validator
  Subtask 1.1.D.2: Create [Feature]ResponseDto
  Subtask 1.1.D.3: Create [Feature]Controller

  Task 1.1.E: Frontend layer
  
  Subtask 1.1.E.1: Create [Feature]Service (Angular/React/Vue service)
  Subtask 1.1.E.2: Create [Feature]Component (UI component)

  Task 1.1.F: Unit tests
  
  Subtask 1.1.F.1: [Entity]RepositoryTests
  Subtask 1.1.F.2: [Feature]ServiceTests
  Subtask 1.1.F.3: [Feature]ControllerTests

  ...

  TOTAL SUBTASKS: [N] (this is the total number of Claude session turns required)

  
  LEVEL 4 GATE  Tech lead review required.
  Say "subtasks approved" to generate docs/BREAKDOWN.md and ADO output.
  

[STOP  wait for "subtasks approved" before continuing]

---

## LEVEL 4 COMPLETE  Go/No-Go decision before ADO creation

After "subtasks approved", run the Standalone Approval Publish Contract with a `docs/sessions/pr-phase-3-breakdown-[YYYY-MM-DD].md` handoff summarizing approved Subtasks, then output this decision block before creating any ADO items.

  BREAKDOWN REVIEW REPORT
  SRS Version  : [SRS-vX.X]
  Reviewed     : [today]

  EPICS        : [N]
  STORIES      : [N]  [N] Must Have | [N] Good to Have | [N] Nice to Have
  TASKS        : [N]  [N] layers across all stories
  SUBTASKS     : [N]  estimated Claude session turns

  STORY GAPS (missing user story format, ACs, complexity, or dependencies):
    [None]  / [list: Story ID + what is missing]

  COMPLEXITY GAPS (stories with no S/M/L assigned):
    [None]  / [list: Story ID]

  DEPENDENCY GAPS (stories with unclear or missing dependencies):
    [None]  / [list: Story ID]

  
  GO / NO-GO DECISION
  

  Scoring dimensions (20 pts each, 100 pts total):

  All Epics well-defined (bounded context, schema, SRS sections) [XX / 20]
  All Stories complete (user story format + 2-5 ACs + complexity) [XX / 20]
  All Tasks cover all required layers per story                    [XX / 20]
  All Subtasks granular (1 file = 1 subtask)                      [XX / 20]
  All dependencies mapped (no circular / missing chains)           [XX / 20]
  
  TOTAL                                                           [XX / 100]

   GO          80100   Breakdown is ready. Creating ADO items now.
   CONDITIONAL  5079   Resolve items below before ADO creation.
   NO-GO        < 50    Breakdown requires rework. Do not create ADO items.

  SIGNAL:  GO /  CONDITIONAL /  NO-GO

  Blockers preventing full GO (if any):
  1. [item  which level detected it  what is needed to resolve]
  2. [item]

  PENDING DECISIONS  Tech lead must resolve before ADO items are created
  
   #   Item                      Score  Decision Needed                Reply with                               
  
   1   [story missing ACs]       X    [provide 2-5 ACs]              "resolve Story [N.N]: [ACs]"             
   2   [missing complexity]      X    [S / M / L]                   "resolve Story [N.N] complexity: [S/M/L]"
   3   [unclear dependency]      X    [depends on which story]      "resolve Story [N.N] depends: [Story ID]"
   4   [epic boundary Q]         X    [which epic does this belong to]  "revise epics: [feedback]"           
  

  [N] decisions pending. ADO creation is blocked until all  items are resolved.
   items may be deferred  tech lead must confirm each explicitly.

  If  GO or all  items resolved: proceed to LEVEL 4.5 below.

---

## LEVEL 4.5  /swp-sync validate gate (mandatory before ADO creation)

Before creating any ADO items, run /swp-sync validate to confirm all design docs are consistent.

Use the Skill tool to invoke swp-sync: Skill("swp-sync", "validate").
Wait for SYNC VALIDATION REPORT output.

If RESULT:  BLOCKED:
  Output:
    LEVEL 5 BLOCKED  Cross-doc conflicts found.
    Resolve all /swp-sync conflicts listed above, then run /swp-plan again.
    ADO items will not be created until /swp-sync is CONSISTENT.
  STOP  do not proceed to LEVEL 5.

If RESULT:  CONSISTENT:
  Output: "SYNC GATE PASSED  proceeding to LEVEL 5 ADO creation."
  Continue to LEVEL 5.

Note: If any design doc (UI-DESIGN.md, DB-DESIGN.md, ARCH-DESIGN.md) is missing,
/swp-sync will skip that pair and note it. Missing docs are not blockers at this stage
unless they are required by the SRS.

---

## BREAKDOWN.md SCHEMA

Use this exact column structure when writing docs/BREAKDOWN.md in Level 5 Step B and when parsing it in ADO UPDATE MODE:

| Column      | Description                                              |
|-------------|----------------------------------------------------------|
| Level       | Epic / Story / Task / Subtask                            |
| ID          | Breakdown ID (e.g., 1, 1.1, 1.1.A, 1.1.A.1)            |
| ADO ID      | ADO work item ID returned from creation (blank until L5) |
| Title       | Full title as written in the breakdown                   |
| Priority    | Must Have / Should Have / Won't Have (v1.0)              |
| Complexity  | S / M / L (stories only)                                |
| Est Days    | Estimated days (stories: 0.5/2/4; tasks: hours/8)       |
| Status      | Subtask-Approved  In ADO  Follow-up  Done            |
| Sprint      | Sprint number assigned (fill at sprint planning time)    |

Status enum values:
- `Subtask-Approved`  breakdown complete, not yet in ADO
- `In ADO`  ADO item created; ID filled
- `Follow-up`  closed item had SRS change; follow-up created
- `Done`  ADO item closed/completed

---

## LEVEL 5  Create ADO items directly and write docs/BREAKDOWN.md

After "subtasks approved":

STEP 5A  Create all ADO items in one bulk call (no script running required):

Assemble the full breakdown into a single ado_bulk_create call. The server handles
all sequential creation internally and returns the complete ID tree.

Note on ADO process templates: Work item types ("Epic", "Story", "Task") match the Agile process template. For Scrum templates, "Story" maps to "Product Backlog Item". Confirm the project's ADO process template before running this step  wrong types will cause creation errors.

Call: ado_bulk_create(
  epics=[
    {
      title: "EPIC-1: [Epic Name]",
      description: "[one-sentence description]",
      stories: [
        {
          title: "Story 1.1: [Story Title]",
          description: "As a [user], I want [action], so that [benefit]",
          acceptance_criteria: "AC1: [text]\nAC2: [text]\nAC3: [text]",
          tasks: [
            { title: "Task 1.1.A: DB/Storage layer",   description: "Subtasks:\n- [list]", estimated_hours: 2 },
            { title: "Task 1.1.B: Data access layer",  description: "Subtasks:\n- [list]", estimated_hours: 2 },
            { title: "Task 1.1.C: Business logic",     description: "Subtasks:\n- [list]", estimated_hours: 3 },
            { title: "Task 1.1.D: API layer",          description: "Subtasks:\n- [list]", estimated_hours: 2 },
            { title: "Task 1.1.E: Frontend layer",     description: "Subtasks:\n- [list]", estimated_hours: 3 },
            { title: "Task 1.1.F: Unit tests",         description: "Subtasks:\n- [list]", estimated_hours: 2 }
          ]
        },
        ... (all stories for this Epic)
      ]
    },
    ... (all Epics)
  ]
)

The call returns:
  {
    totalCreated: { epics: N, stories: N, tasks: N },
    epics: [
      { id: 1042, title: "...", stories: [
        { id: 1043, title: "...", tasks: [
          { id: 1044, title: "..." },
          ...
        ]}
      ]}
    ]
  }

Use the returned IDs in Step 5B  no manual ID tracking needed.

Note on partial failure: If ado_bulk_create returns an error mid-creation, check the response for which IDs were successfully returned. Write those IDs to BREAKDOWN.md immediately (Step 5B) for the items that were created. Then use ado_create_epic / ado_create_story / ado_create_task individually to re-create any missing items (Epics first, then Stories, then Tasks), and add their IDs before committing.

STEP 5B  Write the grouped sequence BREAKDOWN doc with all ADO IDs filled in:

Write to the existing grouped BREAKDOWN doc if one exists, otherwise create the next group-sequence file: `docs/[GGG].[NNN].breakdown-[YYYY-MM-DD].md`.

The BREAKDOWN document must contain:
  - All Epics, Stories, Tasks, and Subtasks from the approved breakdown
  - Every ADO ID column filled with the real IDs from Step 5A
  - Status changed from "Subtask-Approved" to "In ADO"
  - Phase Gate table: all 5 rows showing approved status and today's date

STEP 5C  Commit the BREAKDOWN doc:

  git add docs/*.*.breakdown-*.md docs/BREAKDOWN.md
  git commit -m "chore: SRS breakdown complete  [N] Epics, [N] Stories, [N] Tasks in ADO"

STEP 5D  Update README.md and CHANGELOG.md  separate docs commit:

  README.md  patch Project Status section:
    Phase badge   "Phase 3  ADO Board Ready"
    Last updated  [today]
  README.md  patch Features section:
    List all Must Have features with status "Planned" and their Epic/Story IDs

  CHANGELOG.md  add under [Unreleased]  ### Added:
    - Phase 3: ADO board ready  [N] Epics, [N] Stories, [N] Tasks created. Development unlocked.

  git add README.md CHANGELOG.md
  git commit -m "docs(phase-3): update README and CHANGELOG  ADO board ready"
  git push origin HEAD
  Create or update the PR to `develop` using `.claude/refs/approval-publish-contract.md` before reporting Level 5 complete.

  
  LEVEL 5 COMPLETE
  All ADO items created. docs/BREAKDOWN.md committed with Status: In ADO.
  README and CHANGELOG updated. Development is now unblocked  run /swd-start for your first story.
  

---

## ADO UPDATE MODE

Triggered when docs/BREAKDOWN.md already has Status: "In ADO".
Run after `/swp-sync [feature]` to propagate SRS delta changes into existing ADO items.
This mode does NOT re-run the 5-level breakdown  it applies only the delta.

### STEP A  Read current state

1. Read docs/BREAKDOWN.md  extract every ADO ID (Epic IDs, Story IDs, Task IDs)
2. Read the /swp-sync delta output from this session (NEW / MODIFIED / REMOVED items).
   If no /swp-sync output is available in this session, run `/swp-sync [feature]` first.

### STEP B  Classify each changed item against ADO

For every item in the /swp-sync MODIFIED or REMOVED lists that has an ADO ID in BREAKDOWN.md:

  Call ado_get_item(id) to get the current ADO state.

  OPEN     state is "To Do" or "In Progress"  eligible for update
  CLOSED   state is "Done"                    cannot modify  create follow-up
  DELETED  ado_get_item returns 404 or error   item no longer exists in ADO  treat as NEW, re-create under same Epic parent
  NEW      no ADO ID in BREAKDOWN.md          must create

Output:

  ADO DELTA PLAN  [feature name]
  
  OPEN  will UPDATE:
    Story #[ID] "[title]"  change: [AC updated / description changed]
    Task  #[ID] "[title]"  change: [subtask list updated]

  CLOSED  will create FOLLOW-UP (cannot reopen):
    Story #[ID] "[title]"  SRS change: [what changed]
       New follow-up story: "[original title]  Follow-up: [change summary]"
       Comment on closed item referencing follow-up

  DELETED  will RE-CREATE (item gone from ADO):
    Story #[ID] "[title]"  was deleted  re-create under Epic #[parent Epic ID]

  NEW  will CREATE:
    Story [N.N] "[title]"  parent Epic #[ID]
    Task  [N.N.X] "[title]"  parent Story #[ID]
  

[STOP  wait for "ADO delta approved" before making any ADO calls]

### STEP C  Execute ADO calls

For each OPEN item:

  MODIFIED story 
    ado_update_item(
      id:                  [story ADO ID],
      description:         [updated user story text],
      acceptance_criteria: [full updated AC list],
      comment:             "SRS updated  [what changed]  SRS-v[X.X]  [today date]"
    )

  MODIFIED task 
    ado_update_item(
      id:          [task ADO ID],
      description: [updated subtask list],
      comment:     "Task updated  [what changed]  [today date]"
    )

For each CLOSED item:

  1. Create follow-up story:
     ado_create_story(
       title:               "[original title]  Follow-up: [change summary]",
       description:         "As a [user], I want [updated action], so that [benefit]",
       acceptance_criteria: [new or changed ACs only],
       epic_id:             [same Epic ID as closed story]
     )

  2. Comment on closed item:
     ado_update_item(
       id:      [closed story ADO ID],
       comment: "SRS updated after this story was closed. Follow-up created: #[new story ID]. Change: [what changed]. SRS-v[X.X]"
     )

For each DELETED item:

  Treat as NEW  re-create under the same Epic parent using its ID from BREAKDOWN.md.
  Follow the same creation rules as "For each NEW item" below.

For each NEW item:

  Epic  (if new Epic)   ado_create_epic(title, description)
  Story (if new Story)  ado_create_story(title, description, acceptance_criteria, epic_id)
  Task  (if new Task)   ado_create_task(title, description, story_id, estimated_hours)

### STEP D  Update BREAKDOWN.md

Patch docs/BREAKDOWN.md:
  - For OPEN items updated: add note in row "[UPDATED  date  what changed]"
  - For CLOSED follow-ups: add new row with follow-up ADO ID and status "Follow-up"
  - For NEW items: add new rows with their ADO IDs and status "In ADO"
  - Do NOT remove any existing rows

### STEP E  Commit and push

  Write commit token:
    $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
    $ts = Get-Date -Format 'yyyyMMddHHmmss'
    $s | Add-Member -NotePropertyName 'commit_token' -NotePropertyValue "sw-done-$ts" -Force
    $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'

  git add docs/BREAKDOWN.md
  git commit -m "chore: ADO update  [N] items updated, [N] follow-ups created  SRS-v[X.X]"
  git push origin HEAD
  Create or update the PR to `develop` using `.claude/refs/approval-publish-contract.md` before reporting update mode complete.

  
  ADO UPDATE COMPLETE
  OPEN items patched. CLOSED items have follow-up stories. NEW items created.
  BREAKDOWN.md updated. Run /swd-start [Story ID] to start development on new/updated stories.
  

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.2** (2026-05-21): Added standalone Level approval publish enforcement: commit, push, PR to develop, and manager acceptance email after each breakdown approval.
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


