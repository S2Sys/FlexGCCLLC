---
name: swd-start
description: Start development on a story or epic. Creates git branch from develop, validates ADO story status, writes session state, loads SRS/CONTEXT/DECISIONS/ENTITIES, and outputs a stack-aware SCAN RESULT. Trigger when: starting a story, beginning a dev session, switching to a new feature branch, or running /swd-start.
compatibility: Any stack  reads STACK CONFIRMED from docs/SRS.md
Command  : /swd-start
Version  : 2.2
Updated  : 2026-05-21
| Version | Date       | Author  | Changes                                                                                          |
|---------|------------|---------|--------------------------------------------------------------------------------------------------|
| 2.1     | 2026-05-21 | KapilDev   | Added Skill Maturity 2.0 Contract for repo-wide command readiness consistency |
| 2.0     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.9     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.8     | 2026-05-18 | KapilDev  | Standardize dev-loop handoff snapshot: outputs, blockers, loop step, next command |
| 1.7     | 2026-05-15 | Zenthil | Add assigned_by, assigned_at, lead_approval to session.state schema; preserve lead assignment from /swl-start |
| 1.6     | 2026-05-14 | Zenthil | Minor fixes: session.state schema comments, PENDING DECISIONS rows 1-2 updated, v1.3 changelog corrected |
| 1.5     | 2026-05-14 | Zenthil | Fix execution order: STEP 0 moved before Step C; imperative layer-guide load; Backend Other option; header Framework field; Vuex path fix |
| 1.4     | 2026-05-14 | Zenthil | Conditional SCAN RESULT per feature_type/framework; backend sub-framework menu; session.state fields; frontmatter name/description |
| 1.3     | 2026-05-14 | Zenthil | Per-framework layer guidance  added backend/frontend/mobile SCAN RESULT; detailed guides now in .claude/refs/swd-layer-guide.md |
| 1.2     | 2026-05-13 | Zenthil | Step C: work_done=$false + manual_testing_done=$true on init  fixes gate deadlock on first /swd-next call |
| 1.1     | 2026-05-13 | Zenthil | Added Go/No-Go context readiness gate; PENDING DECISIONS matrix; BREAKDOWN.md In Progress update (Step D) |
| 1.0     | 2026-05-13 | Zenthil | Created from /swd-start  added git branch creation from develop; accepts story ID or epic ID; ends at SCAN RESULT (build loop moved to /swd-next) |

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

Start development on a story or epic: $ARGUMENTS

## QUICK START

```
/swd-start EXAM-42         validate story  create branch  load context  SCAN RESULT
/swd-start EPIC-7          pick story from list  then same flow above
/swd-start                 asks for story or epic ID first
```

**Prerequisites**: `docs/BREAKDOWN.md` must exist (run `/swp-plan` first). ADO access optional (falls back to BREAKDOWN.md).

## HANDOFF SNAPSHOT

**Produces / updates**
- feature branch from `develop`
- `.claude/session.state` with story, branch, feature type, and framework
- `docs/BREAKDOWN.md` story status -> `In Progress`
- stack-aware `SCAN RESULT` and remaining subtask list for the active story

**Blocks progress when**
- another unfinished story is active in `.claude/session.state`
- the requested story or epic cannot be validated
- `docs/SRS.md` is missing stack details or `docs/BREAKDOWN.md` is missing the story

**Current step in canonical delivery loop**
- Step 2 of 6 -> developer session setup and context load
- Canonical loop: `/swl-start -> /swd-start -> /swd-next -> /swd-manual-testing -> /swd-review -> /swd-submit`

**Next command**
- `/swd-next [layer]`

---

Format: /swd-start [story-id OR epic-id]
Examples:
  /swd-start EXAM-42         start story EXAM-42  creates branch + loads context
  /swd-start EPIC-7          list stories under epic, pick one, create branch
  /swd-start                 ask for story or epic ID

---

## GATE 3  Story switch guard

Read `.claude/session.state`:

  IF session.state.story_id is set
     AND session.state.story_id  requested story ID
     AND session.state.wrap_done  true:

  HARD STOP  output this and do not proceed:

    STORY SWITCH BLOCKED
    
    Current story : [session.state.story_id]  still in progress.
    Requested     : [requested story ID]

    Run /swd-submit to commit the current subtask and save the
    checkpoint before switching to a different story.
    

  Do not read context, do not scan, do not proceed. STOP.

  IF story matches current session.state.story_id: skip Gate 3, go to Gate 2.
  IF session.state is empty or story_id is absent: skip Gate 3, go to Gate 2.

---

## GATE 2  Epic or story detection

### If $ARGUMENTS looks like an Epic ID (prefix "EPIC-" or type = Epic in ADO):

  Call: `ado_get_item(id = [epic ID])`

  IF epic found:
    List all child stories from docs/BREAKDOWN.md under this epic.
    Output:
      EPIC: [Epic ID]  [Epic Title]
      Stories under this epic:
      
       Story ID  Title                                     Status         
      
       [ID]      [title]                                   [To Do / Done] 
      
    Ask: "Which story do you want to start Enter story ID."
    Wait for story ID, then proceed to Story validation below.

  IF epic not found in ADO: HARD STOP: "Epic [ID] not found. Verify the ID."

---

### Story validation (for story ID  whether given directly or chosen from epic):

  Call: `ado_get_item(story_id = [story ID])`

  Response state = "To Do"         proceed
  Response state = "Done"          HARD STOP: "Story [ID] is already Done in ADO. Pick a To Do story."
  Response state = "In Progress"   WARN: "Story [ID] is already In Progress. Is this your story (y/n)"
                                     Wait for confirmation. 'n'  stop. 'y'  proceed.
  Story not found                  HARD STOP: "Story ID [ID] not found in ADO. Verify the ID."
  MCP unreachable                  FALLBACK: check docs/BREAKDOWN.md for story ID with status  "Done"
                                     Found  WARNING: "ADO unreachable  validated against BREAKDOWN.md only."
                                             Write mcp_fallback: true to session.state. Proceed.
                                     Not found  HARD STOP: "Story not in BREAKDOWN.md. Run /swp-plan first."

  Check docs/BREAKDOWN.md (always  even if ADO responded):
    Story ID must exist with status  "Done"
    If missing: HARD STOP: "Story not in BREAKDOWN.md. Run /swp-plan first."

---

## GATE 2 success  create branch + write session state

After Gate 2 passes, run these steps in order:

### Step A  Derive branch name

  Branch slug: story title  lowercase, spaces  hyphens, strip special chars, max 6 words
  Branch name: feature/[story-id]-[slug]
  Examples:
    EXAM-42 "Create User Registration"  feature/EXAM-42-create-user-registration
    EXAM-15 "Dashboard Charts"          feature/EXAM-15-dashboard-charts

### Step B  Create branch from develop

  Run via Bash tool:
  ```powershell
  git checkout develop
  git pull origin develop
  git checkout -b feature/[STORY_ID]-[slug]
  ```

  If branch already exists:
    Output: "Branch feature/[STORY_ID]-[slug] already exists  checking it out."
    Run: `git checkout feature/[STORY_ID]-[slug]`

  Output the branch name to the developer:
    BRANCH CREATED: feature/[STORY_ID]-[slug]

  Then continue to STEP 0.

---

## STEP 0  Feature type and framework selection

Before loading context, determine if this story involves backend, frontend, or mobile development.

Output this menu and wait for selection:

  What type of feature are you building

  1. Backend       Database, services, APIs
  2. Frontend      Web UI components and services
  3. Mobile        Mobile app development

  Type the number or name.

If Backend (1) is selected, output:

  Which backend framework

  1. Node.js    TypeScript/JavaScript, Express/Fastify/NestJS
  2. Python     FastAPI/Flask/Django
  3. Go         Gin/Echo/stdlib
  4. Java       Spring Boot
  5. .NET       ASP.NET Core
  6. Other      specify framework name; layer guidance will be generic

  Type the number or name.

If Frontend (2) is selected, output:

  Which frontend framework

  1. React         React components, hooks, context/Redux state
  2. Vue           Vue components, composables, Pinia/Vuex state
  3. Angular       Angular components, services, NgRx state
  4. Other         specify framework name; layer guidance will be generic

  Type the number or name.

If Mobile (3) is selected, output:

  Which mobile framework

  1. Flutter       Flutter widgets, BLoC, provider services
  2. Other         specify framework name; layer guidance will be generic

  Type the number or name.

Write `feature_type` and `framework` into session.state in the Step C block that follows. Use the exact values selected: feature_type = "Backend" | "Frontend" | "Mobile"; framework = the chosen sub-framework name (e.g., "React", ".NET") or "null" if none applies. Then continue to Step C.

---

### Step C  Write session state

  Run via Bash tool:
  ```powershell
  $ts = Get-Date -Format 'yyyy-MM-ddTHH:mm:ss'
  $prev = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
  $s = [PSCustomObject]@{
    story_id            = "[STORY_ID]"
    story_title         = "[STORY_TITLE]"
    assigned_by         = if ($prev.assigned_by) { $prev.assigned_by } else { $null }
    assigned_at         = if ($prev.assigned_at) { $prev.assigned_at } else { $null }
    lead_approval       = $null
    branch              = "feature/[STORY_ID]-[slug]"
    feature_type        = "[Backend/Frontend/Mobile]"        # set from STEP 0
    framework           = "[chosen framework name or null]"  # set from STEP 0 sub-menu
    subtask_current     = $null
    work_done           = $false
    wrap_done           = $false
    tests_passed        = $false
    # workaround: set true on init to prevent /swd-next gate deadlock on first call (no tests run yet)
    manual_testing_done = $true
    last_updated        = $ts
  }
  $s | ConvertTo-Json -Depth 5 | Set-Content '.claude/session.state'
  ```

  Replace [STORY_ID], [STORY_TITLE], and [slug] with actual values.

### Step D  Mark story In Progress in BREAKDOWN.md

Update docs/BREAKDOWN.md  change the story row Status from "To Do" or "In ADO"  "In Progress".

  git add docs/BREAKDOWN.md
  git commit -m "chore([STORY_ID]): mark story In Progress  branch feature/[STORY_ID]-[slug]"

Then continue to STEP 1.

---

## STEP 1  Load session context

Read these files in order before doing anything else:

1. CONTEXT.md  load last checkpoint (pick up where the last session left off)
   Stale check: if CONTEXT.md exists and its `last_updated` timestamp is older than 7 days,
   output: "  CONTEXT.md checkpoint is [N] days old  review carefully before continuing.
   Codebase may have changed. Confirm with developer before treating checkpoint as current."
   If CONTEXT.md is missing: note "Fresh start  no prior checkpoint for this story."
2. docs/SRS.md  locate STACK CONFIRMED block, extract every technology value
3. DECISIONS.md  load all decisions already made (never re-debate a listed decision)
4. ENTITIES.md  load all registered tables (never create a table already listed)

STACK CONFIRMED validation:
- If STACK CONFIRMED block is missing: output STACK GAP FOUND and stop
- If any stack category is undefined: list each gap and wait for tech lead to answer
- Read docs/BREAKDOWN.md  if Status is not "In ADO", "In Progress", or "Done":
    Output "DEVELOPMENT BLOCKED  run /swp-plan first" and stop

Scan the codebase for anything related to this story.

Output:
  
  SW-DEV-START  Story [ID]: [Title]
  Branch     : feature/[STORY_ID]-[slug]
  Feature    : [Backend / Frontend / Mobile]
  Framework  : [if Backend: Node.js/Python/Go/Java/.NET] [if Frontend: React/Vue/Angular] [if Mobile: Flutter]
  
  STACK CONFIRMED (from SRS):
  Backend  : [value]
  Frontend : [value]
  Database : [value]
  ORM      : [value]
  Auth     : [value]
  Logging  : [value]
  Tests    : [value]
  SRS Ver  : [value]
  BREAKDOWN: [Status]

  SCAN RESULT (Stack-Aware  [feature_type] / [framework]):

  IF feature_type = Backend:
    Reusing  : [existing repository/service/endpoint files matching the [framework] stack]
    Creating : [new repository/service/endpoint files for this subtask]
    NOT touching : Core framework files, config, migrations, vendor code

    Layers to build (see Framework-Specific Layer Guidance below):
    (Resolve [framework] to the chosen stack's exact paths  see Framework-Specific Layer Guidance below)
     Repository Layer  [framework]-specific data access file
     Service Layer     [framework]-specific business logic file
     Endpoint Layer    [framework]-specific controller/route file

  IF feature_type = Frontend AND framework = React:
    Reusing  : [existing components/hooks/context/store files]
    Creating : [new component/hook/store files for this subtask]
    NOT touching : Core React config, vite.config, package.json

    Layers to build (see Framework-Specific Layer Guidance below):
     Component Layer   src/components/[Feature]/[Feature].tsx
     Hook Layer        src/hooks/use[Feature].ts
     State Layer       src/store/[feature]Slice.ts OR src/context/[Feature]Context.tsx

  IF feature_type = Frontend AND framework = Vue:
    Reusing  : [existing SFC components/composables/store files]
    Creating : [new .vue component/composable/store files for this subtask]
    NOT touching : Core Vue config, vite.config, package.json

    Layers to build (see Framework-Specific Layer Guidance below):
     Component Layer   src/components/[Feature].vue
     Composable Layer  src/composables/use[Feature].ts
     Store Layer       src/stores/[feature]Store.ts (or src/store/modules/[feature].ts for Vuex)

  IF feature_type = Frontend AND framework = Angular:
    Reusing  : [existing standalone components/services/store files]
    Creating : [new component + .html + .scss / service / NgRx store files]
    NOT touching : Core Angular config, angular.json, app.config.ts

    Layers to build (see Framework-Specific Layer Guidance below):
     Component Layer   src/app/[feature]/[feature].component.ts + .html + .scss
     Service Layer     src/app/[feature]/services/[feature].service.ts
     NgRx Store Layer  src/app/[feature]/store/ (actions/reducer/effects/selectors)

  IF feature_type = Mobile AND framework = Flutter:
    Reusing  : [existing widgets/blocs/services/models]
    Creating : [new widget/bloc/service/model files for this subtask]
    NOT touching : pubspec.yaml, main.dart, platform-specific folders

    Layers to build (see Framework-Specific Layer Guidance below):
     Widget Layer      lib/widgets/[feature]/[feature]_widget.dart
     Stateful Widget   lib/screens/[feature]/[feature]_screen.dart (if local mutable state/forms needed)
     BLoC Layer        lib/bloc/[feature]/[feature]_bloc.dart + _event.dart + _state.dart
     Repository Layer  lib/repositories/[feature]_repository.dart
     Model Layer       lib/models/[feature]_model.dart

  IF none of the above match:
    [WARN] feature_type/framework combination not recognised  review STEP 0 selection and re-run /swd-start.

  ---

  SUBTASKS remaining for this story (from BREAKDOWN.md):
   [subtask name]  [layer]  ADO Task [ID]
   [subtask name]  [layer]  ADO Task [ID]
  ...

  
  Context loaded. Run: /swd-next [layer] to start building.
  

---

## Framework-Specific Layer Guidance

> Full per-framework layer patterns are in `.claude/refs/swd-layer-guide.md`.
> **After STEP 0 completes, read `.claude/refs/swd-layer-guide.md` and hold the section for the selected framework in context before proceeding to STEP 1.**

### Quick Reference

| Feature Type | Framework | Key Files |
|---|---|---|
| Backend | Node.js | src/repositories/, src/services/, src/routes/ |
| Backend | Python | src/repositories/, src/services/, src/routes/ |
| Backend | Go | internal/repositories/, internal/services/, internal/handlers/ |
| Backend | Java | src/main/java/repositories/, .../services/, .../controllers/ |
| Backend | .NET | src/Data/Repositories/, src/Services/, src/Controllers/ |
| Frontend | React | src/components/[Feature]/, src/hooks/, src/store/ |
| Frontend | Vue | src/components/, src/composables/, src/stores/ |
| Frontend | Angular | src/app/[feature]/, .../services/, .../store/ |
| Mobile | Flutter | lib/widgets/, lib/bloc/, lib/repositories/, lib/models/ |

---

## Go/No-Go  Context Readiness

Rate each dimension (20 pts each, 100 pts total):

  Story validated in ADO (status  Done,  not found)              [XX / 20]
  Branch created from develop successfully                           [XX / 20]
  STACK CONFIRMED block found in docs/SRS.md                        [XX / 20]
  Story exists in BREAKDOWN.md with status  Done                   [XX / 20]
  CONTEXT.md loaded  checkpoint present from last session           [XX / 20]
  
  TOTAL                                                             [XX / 100]

   GO       100   Context fully loaded. Run /swd-next [layer] to start building.
   PARTIAL  8099   Minor gaps below. Resolve before writing any code.
   BLOCKED  < 80    Critical context gap. Fix before starting development.

  SIGNAL:  GO /  PARTIAL /  BLOCKED

  PENDING DECISIONS  resolve before /swd-next
  
   #   Gap                                                   Priority  Reply with                           
  
   1   Feature type not in session.state  re-run STEP 0             "feature type: [Backend/Frontend/Mobile]" 
   2   Framework not in session.state  re-run STEP 0               "framework = [React/Vue/Angular/.NET/]"  
   3   STACK GAP FOUND  [category] not confirmed in SRS            "stack: [category] = [value]"        
   4   BREAKDOWN.md missing story  run /swp-plan first              "run /swp-plan [story-id]"            
   5   CONTEXT.md missing  first session for this story            "fresh start  no prior checkpoint"  
  

  [STOP  resolve all  items before running /swd-next]

If  GO: run /swd-next [layer] to begin. If  PARTIAL or  BLOCKED: resolve PENDING DECISIONS first.

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.2** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


