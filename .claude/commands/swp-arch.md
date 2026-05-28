---
name: swp-arch
description: |
  Design solution architecture (Phase 1)  Stage 1 produces root-only grouped architecture/entity docs, Stage 2 auto-continues to scaffold the solution with zero build errors. Phase 2 (UI/DB design) is BLOCKED until both stages are approved.
  Prerequisite: docs/SRS.md must exist with a STACK CONFIRMED block.
  Trigger when: SRS is approved, starting Phase 1, designing solution architecture, scaffolding the project, setting up the project structure, initializing the codebase, creating the solution, or running /swp-arch.
compatibility: Any stack  Node, Python, Go, Java, .NET, Angular, React, Flutter
Command  : /swp-arch
Version  : 3.14
Updated  : 2026-05-21
## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
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
| 3.14    | 2026-05-21 | KapilDev | Added standalone approval publish enforcement: commit, push, PR to develop, and manager acceptance email after architecture and scaffold approvals |
| 3.13    | 2026-05-21 | KapilDev | Added Toolkit Version Sync section and normalized version-history heading |
| 3.12     | 2026-05-21 | KapilDev   | Added Skill Maturity 2.0 Contract for repo-wide command readiness consistency |
| 3.11    | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 3.10    | 2026-05-20 | KapilDev | Added ISO date suffix to grouped generated markdown artifact names: `docs/[GGG].[NNN].[name]-[YYYY-MM-DD].md` |
| 3.9     | 2026-05-20 | KapilDev | Changed generated markdown artifact naming to root-only grouped `docs/[GGG].[NNN].[name].md` sequence format |
| 3.8     | 2026-05-20 | KapilDev | Added generated-doc filename sequence enforcement for legacy numbered slug-format artifacts |
| 3.7     | 2026-05-20 | KapilDev | Clarified the Phase 1 UI/UX boundary and explicit escalation to Phase 2 UI commands |
| 3.6     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 3.5     | 2026-05-20 | Zenthil | Added workflow-command type, helper intercept, approval-gate bypass hardening, Stage 2 partial-failure recovery, and applied-fix verification guidance |
| 3.4     | 2026-05-18 | Zenthil | 9 gaps closed: /swp-db prereq ordering, UPDATE MODE Phase 2 guard, non-.NET stack notes, React STEP 6 path, dynamic CONTEXT.md text, path-aware Stage 2 handoff, git push HEAD, trigger language, multi-stack mapping table |
| 3.3     | 2026-05-17 | Zenthil | Added PATH CHECK to STEP 0  enforce PATH CONFIRMED delivery flow |
| 3.2     | 2026-05-15 | Zenthil | Phase 1 gate; remove UI/DB prereqs; two-stage command (Stage 1: design  Stage 2: scaffold auto-continues); BREAKDOWN 1A+1B marks |
| 3.1     | 2026-05-14 | Zenthil | 5 gaps closed: add **Prerequisite reads** section header + cross-links to /swp-db, /swp-scaffold, /swd-start; add STACK CONFIRMED example block in STEP 0; expand STEP 6 Angular with state patterns, guards/interceptors, feature module structure; add CONTEXT.md update instruction in STEP 9. |
| 3.0     | 2026-05-14 | Zenthil | Stack-agnostic refactor  detect backend type (Node.js/Python/Go/.NET/Java) + apply stack-specific architecture. Generic principles (layering, DI, pipeline, testing) + stack-specific implementations (project structure, config files, package managers). |
| 2.2     | 2026-05-13 | Zenthil | Added /swp-sync validate trigger after arch approval gate |
| 2.1     | 2026-05-13 | Zenthil | STEP 0: UPDATE MODE DETECTION  delta analysis (add/update sections, patch writes); STEP 9: DOWNSTREAM IMPACT  BREAKDOWN.md task gaps, scaffold file gaps, /swp-sync shortcuts |
| 2.0     | 2026-05-13 | Zenthil | .NET-specific: ENTITIES.md + .NET version + DB engine checks; solution structure + project templates; DI registration patterns |

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

When this command is run outside `/swp-orchestrate`, both Phase 1 approval gates must still publish the approved work.

After the exact phrase `architecture approved` is accepted, run `.claude/refs/approval-publish-contract.md` before auto-continuing to Stage 2.

After the exact phrase `scaffold approved` is accepted, run `.claude/refs/approval-publish-contract.md` before marking Phase 1 complete or advancing to Phase 2.

This standalone command must not mark Phase 1A or Phase 1B complete unless the approval publish summary includes a pushed branch and a PR URL targeting `develop`.

---

Design solution architecture for: $ARGUMENTS
Phase 1 gate  UI/DB design is BLOCKED until architecture and scaffold are approved.

Skill type: WORKFLOW COMMAND

## Helper intercept

If `$ARGUMENTS` is exactly one of these helper requests, print the helper document below and STOP before STEP 0:

- `help`
- `?`
- `usage`
- `use cases`
- `examples`
- `show helper`
- `what can this skill do`
- comment-style requests such as `# help`, `// help`, or `<!-- help -->`

### /swp-arch Helper

Purpose:
  Design Phase 1 solution architecture from an approved SRS, then auto-continue into scaffold only after architecture is explicitly approved.

When to use:
  - SRS is approved and Phase 1 architecture should start
  - The project structure or solution layout needs to be designed
  - The codebase needs initial scaffolding from an approved architecture
  - PATH CONFIRMED says `/swp-arch` is the next command
  - Architecture needs an update after stack or feature changes

Required inputs:
  - `docs/SRS.md` exists
  - `docs/SRS.md` contains `STACK CONFIRMED`
  - `docs/BREAKDOWN.md` exists with Phase 0 complete
  - `docs/ENTITIES.md` exists when the selected database requires entity modeling

Outputs:
  - `docs/[GGG].[NNN].arch-design-[YYYY-MM-DD].md`
  - `docs/[GGG].[NNN].entities-[YYYY-MM-DD].md` layer mappings
  - stack-specific root config files
  - BREAKDOWN.md Phase 1A and Phase 1B updates after approval
  - Stage 2 scaffold output with zero build errors and zero warnings

Safety notes:
  - Do not run UI or DB design before Phase 1 architecture and scaffold are approved.
  - Do not treat vague replies such as "looks good", "approved enough", or "continue" as approval.
  - Do not mark Stage 2 complete unless build verification reports zero errors and zero warnings.

Next steps:
  - After Phase 1 completes, read PATH CONFIRMED and run the listed Phase 2 command(s).

**Prerequisite reads before using this command:**
- [SRS.md](../../docs/SRS.md)  Product stack and feature scope (STACK CONFIRMED block)
- [ENTITIES.md](../../docs/ENTITIES.md)  Entity definitions pre-seeded from SRS (if it exists)

**Note:** UI-DESIGN.md and DB-DESIGN.md are NOT prerequisites for this command.
Architecture is designed first. UI and DB design use ARCH-DESIGN.md as their prerequisite.

**UI/UX enforcement boundary:**
`/swp-arch` enforces frontend architecture only: project structure, routing boundaries, state strategy, guards/interceptors, auth token handling, and frontend security checklist.

It must NOT approve visual UI/UX. Do not use this command to approve wireframes, HTML prototypes, contrast scans, gesture specs, permission matrices, Storybook stories, or design-token exports.

Any visual, interaction, accessibility, responsive, or design-system question is a Phase 2 concern:
- Use `/swp-design` for the combined UI/UX + DB sign-off path.
- Use `/swp-ui` when deep UI enforcement is required.

If no $ARGUMENTS provided, design the full solution architecture based on all approved design docs.

**Related commands:**
- `/swp-db [feature]`  Design database schema (Phase 2, runs after architecture is approved)
- `/swp-scaffold`  Scaffold solution structure after architecture approval
- `/swd-start`  Start development once scaffolding is complete

**Compatible skill chain:**
  /swp-srs  /swp-arch (Stage 1: design  Stage 2: scaffold)  /swp-design (or /swp-ui + /swp-db per PATH CONFIRMED)  /swp-plan  /swd-start

**What this command produces:**
  docs/[GGG].[NNN].arch-design-[YYYY-MM-DD].md  approved architecture (layers, project structure, pipeline, DI plan)
  Root config files  language/framework specific (package.json, pyproject.toml, go.mod, .csproj, pom.xml, etc.)
  docs/[GGG].[NNN].entities-[YYYY-MM-DD].md update  layer mapping column added per entity

---

## STEP 0  Stack detection & prerequisite validation

### PATH CHECK  enforce locked delivery flow

Read docs/SRS.md PATH CONFIRMED block.

IF PATH CONFIRMED block is missing:
   WARNING  PATH CONFIRMED not found. Run /swp-srs to lock a delivery flow.
  Proceeding without path enforcement.

IF PATH CONFIRMED found:
  Extract: Flow name, Phase 1 command, Phase 2 command(s), Phase 3 command.
  Read BREAKDOWN.md to determine which phase is next (first phase not yet marked [x]).
  Check if this command (/swp-arch) matches the correct next phase command.

  IF match:
     Correct next step for [Flow Name].
    After this command completes: [next command in PATH CONFIRMED sequence]

  IF no match:
     PATH MISMATCH  [Flow Name] expects [correct command] next, not /swp-arch.
    Your locked sequence: [Phase 1 command]  [Phase 2 command]  [Phase 3 command]  dev
    Run [correct command] first, then return here.
    To override: type "override path  I know what I'm doing"

### Stack type detection (read from STACK CONFIRMED)

  DETECTED STACK:
  
   Backend                   Execute as                  
  
   Node.js (Express/Nest)    /swp-arch for Node.js stack 
   Python (Django/FastAPI)   /swp-arch for Python stack  
   Go (Gin/Echo)             /swp-arch for Go stack      
   Java (Spring Boot)        /swp-arch for Java stack    
   .NET (ASP.NET Core)       /swp-arch for .NET stack    
   Multiple backends / SPA   Design each backend arch independently, then combine frontend arch |
   Serverless (Lambda/CF)    /swp-arch adapts to serverless patterns |
   Mobile-only (no backend)  /swp-arch skips backend; frontend arch only |
  

### Prerequisite check

Check all of the following. Block on any  failure.

**Example: STACK CONFIRMED block from docs/SRS.md**
```
STACK CONFIRMED:
  Product    : [ProjectName]
  Backend    : .NET (ASP.NET Core 8.0)
  Frontend   : Angular 17 (standalone components)
  Database   : SQL Server 2022 or PostgreSQL 15
  Mapping    : Mapster (or AutoMapper / Manual)
  State      : NgRx (or Signals-only / Mixed)
  Testing    : Testcontainers + xUnit
  Logging    : Serilog  [sink from stack]
```

  PREREQUISITE CHECK:
  
   Item                                                                      Status 
  
   docs/SRS.md exists and contains a STACK CONFIRMED block                  /  
   STACK CONFIRMED names: Product, Backend, Frontend (if applicable)        /  
   STACK CONFIRMED declares backend framework + version (e.g. Node 20)      /  
   STACK CONFIRMED declares database engine + type (if applicable)          /  
   ENTITIES.md exists (if relational DB  skip if NoSQL/document DB)        /  
   docs/BREAKDOWN.md exists and Phase 0 (SRS) is marked [x]                 /  
  

  If any  item fails:
    PREREQUISITE BLOCKED: [item] is missing.
    Fix: [exact action  e.g. "Add backend framework to STACK CONFIRMED", "Run /swp-db"]
    /swp-arch cannot proceed until all prerequisites are met.

  [STOP if any   otherwise continue to Step 0.5]

---

## STEP 0.5  Stack-specific architecture path selection

Based on detected backend stack, follow the appropriate substeps:

  **Node.js (Express / Nest.js / Fastify)**
     STEPS 17: Use Node.js architecture (src/, package.json, npm packages, etc.)
     Optional database: PostgreSQL / MongoDB / Firebase  see /swp-db guidance
     Frontend: see Step 6 below (any framework)

  **Python (Django / FastAPI / Flask)**
     STEPS 17: Use Python architecture (src/, pyproject.toml, poetry/pip, etc.)
     Optional database: PostgreSQL / SQLite  migrations via Alembic
     Frontend: see Step 6 below

  **Go (Gin / Echo / Chi)**
     STEPS 17: Use Go architecture (cmd/, internal/, go.mod, etc.)
     Concurrent patterns: goroutines, channels, context.Context throughout
     Optional database: PostgreSQL / MySQL  migrations via golang-migrate
     Frontend: see Step 6 below

  **Java (Spring Boot)**
     STEPS 17: Use Java architecture (src/main/java, pom.xml / build.gradle, Spring conventions)
     Database: PostgreSQL / MySQL  migrations via Liquibase / Flyway
     Frontend: see Step 6 below

  **.NET (ASP.NET Core)**
     STEPS 17: Use .NET architecture (src/, global.json, .csproj, NuGet, EF Core)
     Database: SQL Server / PostgreSQL  migrations via EF Core
     Frontend: see Step 6 below

  **Multiple backends (API gateway pattern)**
     Design each backend independently first (follow path above for each)
     STEP 6: Design API gateway / routing layer
     Then STEP 7: Design frontend consumption

  **Serverless / FaaS (AWS Lambda, Google Cloud Functions, Azure Functions)**
     Design function-oriented architecture (event handlers, no shared state)
     External services for data: DynamoDB, Firestore, Cosmos DB
     STEP 5: Adapt middleware pipeline to stateless FaaS model
     Frontend: see Step 6 below

  **Mobile-first (no backend, or BaaS only)**
     Skip STEPS 15 (backend architecture)
     STEP 6 only: Mobile app architecture (Flutter, React Native, SwiftUI)
     BaaS integration: Firebase, Supabase, etc. treated as external service

---

### UPDATE MODE DETECTION

Runs only if no  prerequisite failed above.

Check whether `docs/ARCH-DESIGN.md` already exists:

  docs/[GGG].[NNN].arch-design-[YYYY-MM-DD].md exists : YES  UPDATE RUN | NO  FRESH RUN

**IF FRESH RUN:** skip this section. Proceed to STEP 1 with full solution design in scope.

**IF UPDATE RUN:**

Read `docs/ARCH-DESIGN.md`. Note: every section already defined (project list, folder structure,
DI registrations, middleware pipeline, etc.).

  IF docs/DB-DESIGN.md exists AND docs/UI-DESIGN.md exists:
    Compare against current `docs/DB-DESIGN.md` and `docs/UI-DESIGN.md`:

    Delta check:
      - New tables in DB-DESIGN.md with no matching repository in ARCH-DESIGN.md  ADD repository section
      - New feature in UI-DESIGN.md with no matching frontend feature folder  ADD frontend section
      - New SPs in DB-DESIGN.md not referenced in any service class  ADD service method note
      - New packages in SRS STACK CONFIRMED not yet in the NuGet/npm lists  ADD to Step 2 package tables
      - Unchanged layers (project list, base classes, middleware order, DI skeleton)  SKIP

  IF docs/DB-DESIGN.md does NOT exist OR docs/UI-DESIGN.md does NOT exist:
      Phase 2 docs not yet present  skipping DB/UI delta checks.
    Only check: New packages in SRS STACK CONFIRMED not yet in ARCH-DESIGN.md  ADD to Step 2 package tables.

Output:

  UPDATE RUN DETECTED  docs/ARCH-DESIGN.md found
  
  Sections preserved (unchanged)   : [list section names]
  Sections to ADD this run         : [list: what is new and why]
  Sections to UPDATE this run      : [list: section name + what changed]
  

Scope for Steps 18: only ADD + UPDATE sections. Skip preserved sections.

In STEP 9 (write docs/ARCH-DESIGN.md):
  - PATCH the existing file  append new sections, update changed sections in-place
  - Never remove existing sections without explicit tech lead confirmation
  - Mark new sections: `[NEW  YYYY-MM-DD]`
  - Mark updated sections: `[UPDATED  YYYY-MM-DD  what changed]`

---

## STEP 1  Project structure

Define all projects/modules in the solution. Use the Product name from STACK CONFIRMED.
Structure depends on backend stack  follow the path from STEP 0.5 above.

### Example structures per stack

**Node.js (Express/Nest.js):**
  src/
   controllers/        Route handlers
   services/          Business logic
   models/            Data models / schemas
   middleware/        Auth, logging, error handling
   config/            Config per environment
   utils/             Helpers
   index.js / main.ts

  test/
   unit/             Unit tests
   integration/      Integration tests
   fixtures/

  package.json (npm / yarn / pnpm)
  tsconfig.json (if TypeScript)

**Python (FastAPI/Django):**
  src/
   api/             Route handlers / endpoints
   services/        Business logic
   models/          SQLAlchemy / Django models
   schemas/         Pydantic / serializer schemas
   middleware/      Auth, logging, error handling
   config.py        Config per environment
   main.py / manage.py

  tests/
   unit/
   integration/

  pyproject.toml / requirements.txt
  .env.example

**Go (Gin/Echo):**
  cmd/
   api/
      main.go

  internal/
   handlers/        HTTP handlers
   services/        Business logic
   models/          Data models
   repository/      Data access
   middleware/
   config/
   utils/

  tests/
   unit/
   integration/

  go.mod / go.sum

**Java (Spring Boot):**
  src/main/java/[company]/[product]/
   controller/      REST controllers
   service/         Business logic
   model/           JPA entities
   dto/             DTOs
   repository/      JPA repositories
   config/          Spring configuration
   Application.java

  src/test/java/...

  pom.xml / build.gradle
  application.yml

**.NET (ASP.NET Core):**
  src/[Product].API/
   Controllers/
   DTOs/
   Validators/
   Middleware/
   Extensions/

  src/[Product].Application/
   Services/
   Interfaces/

  src/[Product].Domain/
   Entities/
   Exceptions/

  src/[Product].Infrastructure/
   Repositories/
   Data/

  tests/

  [Product].sln
  global.json
  .csproj files

Output the project structure. Wait for tech lead to say "structure confirmed" before proceeding to Step 2.

---

  SOLUTION: [Namespace].[Product].sln

  **Core projects:**
  | Project                                     | Type         | Purpose                                                            |
  |---------------------------------------------|--------------|--------------------------------------------------------------------|
  | [Namespace].[Product].API                   | Web API      | Controllers, DTOs, validators, middleware, Swagger, Program.cs     |
  | [Namespace].[Product].Application           | Class lib    | Service interfaces + implementations, business logic, mapping      |
  | [Namespace].[Product].Domain                | Class lib    | Entities, exceptions, ErrorCodes, Result<T>, value objects         |
  | [Namespace].[Product].Infrastructure        | Class lib    | Repositories, EF DbContext, SP execution, external service clients |
  | [Namespace].[Product].Tests.Unit            | xUnit        | Unit tests  mocked dependencies, no DB/network                   |
  | [Namespace].[Product].Tests.Integration     | xUnit        | Integration tests  real DB (Testcontainers), HTTP client          |

  **Optional projects (include only if SRS specifies):**
  | Project                                     | Type         | When to include                                                    |
  |---------------------------------------------|--------------|--------------------------------------------------------------------|
  | [Namespace].[Product].Tests.Architecture    | xUnit + ArchUnitNET | Enforce layer dependency rules  no upward refs, no circular |
  | [Namespace].[Product].Jobs                  | Worker Service | Background jobs isolated from API (complex scheduling)           |

  **When to omit Application layer:**
  - Omit only if ALL: <5 tables, no business logic beyond CRUD, no service orchestration, no external service calls.
  - If in doubt, include it  adding a layer later is harder than removing one.

  **Solution root files (create alongside .sln):**
  | File                   | Purpose                                                              |
  |------------------------|----------------------------------------------------------------------|
  | `global.json`          | Pin .NET SDK version  prevents version drift across machines        |
  | `.editorconfig`        | Code style: indent_size, newline, naming conventions (C# + TS)       |
  | `.gitignore`           | Exclude bin/, obj/, .vs/, *.user, appsettings.*.json secrets         |
  | `Directory.Build.props`| Shared MSBuild properties: TFM, Nullable enable, ImplicitUsings      |

Output the project list. Wait for tech lead to say "projects confirmed" before proceeding to Step 2.

---

## STEP 2  Dependency graph

> **Stack note:** STEPS 27 show .NET/Angular patterns in full detail. For Node.js, Python, Go, or Java stacks, adapt package names, DI patterns, and folder structures to the detected stack  the principles (layer direction, interface contracts, DI extension methods) apply universally.

Lower layers MUST NOT reference higher layers. Flag any violation as a BLOCKER.

  DEPENDENCY GRAPH:
  API                 Application, Domain
  Application         Domain
  Infrastructure      Application, Domain
  Tests.Unit          Application, Infrastructure, Domain
  Tests.Integration   API, Infrastructure, Domain
  Tests.Architecture  API, Application, Infrastructure, Domain (if included)

  **NuGet packages per project** (SRS approved list only  never add unlisted packages):

  | Project             | Required NuGet packages                                                                                     |
  |---------------------|-------------------------------------------------------------------------------------------------------------|
  | API                 | `Microsoft.AspNetCore.Authentication.JwtBearer`, `Serilog.AspNetCore`,                                     |
  |                     | `FluentValidation.AspNetCore` (v11+), `Swashbuckle.AspNetCore`                                             |
  | Application         | **Mapping strategy  choose ONE** (see decision below):                                                     |
  |                     |  AutoMapper: `AutoMapper`, `AutoMapper.Extensions.Microsoft.DependencyInjection`                          |
  |                     |  Mapster: `Mapster`, `Mapster.DependencyInjection`                                                        |
  |                     |  Manual: no package  extension methods on entity classes                                                  |
  | Infrastructure      | [EF Core package from DB engine detection], `Microsoft.EntityFrameworkCore.Tools`,                          |
  |                     | `AspNetCore.HealthChecks.EntityFrameworkCore`, `Dapper` (if SP raw mapping required)                       |
  | Tests.Unit          | `xunit`, `Moq`, `Microsoft.NET.Test.Sdk`, `xunit.runner.visualstudio`,                                     |
  |                     | `FluentAssertions`, `Bogus` (fake data), `AutoFixture`                                                      |
  | Tests.Integration   | `Microsoft.AspNetCore.Mvc.Testing`, `Respawn` (DB reset between tests),                                    |
  |                     | `Testcontainers.MsSql` OR `Testcontainers.PostgreSql`                                                       |
  | Tests.Architecture  | `ArchUnitNET.xUnit` (if architecture tests project included)                                                |

  **Mapping strategy decision  record in STACK CONFIRMED:**
  | Choice | When to choose |
  |--------|----------------|
  | AutoMapper | Large project, many entities, convention-based mapping preferred |
  | Mapster | Greenfield, performance-sensitive, code-gen preferred |
  | Manual | <5 entities, simple CRUD, no complex projections |

  Output: `MAPPING STRATEGY: [AutoMapper / Mapster / Manual]`

  **Mapping strategy for other stacks:**
  | Stack   | Equivalent choices |
  |---------|--------------------|
  | Node.js | class-transformer + class-validator / manual spread / automapper-ts |
  | Python  | Marshmallow / Pydantic model_validate / manual dict mapping |
  | Go      | Manual struct assignment / mapstructure |
  | Java    | ModelMapper / MapStruct / manual conversion |

  **Optional NuGet packages (include only if SRS feature requires):**
  | Package | When to include |
  |---------|----------------|
  | `MediatR` | CQRS  commands/queries split from service layer |
  | `Microsoft.Extensions.Http.Resilience` | External HTTP calls needing retry/circuit breaker (Polly v8 built-in) |
  | `Microsoft.Extensions.Caching.StackExchangeRedis` | Distributed cache required |
  | `OpenTelemetry` + OTLP exporter | Observability/tracing required |
  | `Microsoft.AspNetCore.SignalR` | Real-time features required |

  **npm packages (Angular  skip if no frontend):**
  | Scope    | Required packages                                                                |
  |----------|---------------------------------------------------------------------------------|
  | Core     | `@angular/core`, `@angular/router`, `@angular/forms`, `@angular/common/http`    |
  | State    | `@ngrx/store`, `@ngrx/effects`, `@ngrx/entity`, `@ngrx/store-devtools` (if NgRx chosen) |
  | UI       | [package from SRS UI library  e.g. `@angular/material`]                       |
  | Build    | `typescript`, `@angular-devkit/build-angular`                                   |
  | Testing  | `jest` + `jest-preset-angular` (preferred) OR `karma` + `jasmine`  choose ONE  |
  | Lint     | `@angular-eslint/eslint-plugin`, `prettier`                                     |

  Flag any unlisted package:
  `PACKAGE GAP: [package] needed by [layer]  not in SRS approved list.`
  Resolution: "resolve package-gap: add [package] to SRS STACK CONFIRMED"

---

## STEP 3  Folder structure

  [Namespace].[Product].API/
   Controllers/               one controller per Epic/feature
   DTOs/
      Requests/              incoming request DTOs
      Responses/             outgoing response DTOs
   Validators/                FluentValidation AbstractValidator<TRequest>  one per request DTO
   Middleware/
      GlobalExceptionMiddleware.cs
      CorrelationIdMiddleware.cs
   Filters/                   IActionFilter  request logging, validation short-circuit
   Extensions/                DI extension methods only  no inline registrations in Program.cs
      InfrastructureExtensions.cs
      ApplicationExtensions.cs
      ApiExtensions.cs
   Constants/                 route strings, claim type names, policy names, header names
   BackgroundServices/        IHostedService (omit if no background jobs in SRS)
   appsettings.json           placeholder values only  NEVER real credentials
   appsettings.Development.json
   Program.cs                 calls extension methods only; minimal inline code

  [Namespace].[Product].Application/
   Interfaces/
      IRepository.cs             generic repository contract
      IUnitOfWork.cs
      ICurrentUserService.cs     TenantId, UserId, IsAuthenticated
      IJwtService.cs             GenerateToken, ValidateToken
      IEmailService.cs           SendAsync (omit if no email in SRS)
      ICacheService.cs           GetAsync, SetAsync (omit if no caching in SRS)
      Services/                  one interface file per feature service
   Services/                      one implementation per feature
   Mappings/                      AutoMapper Profile OR Mapster TypeAdapterConfig (one per entity group)
   Filters/                       IPaginatedFilter base + feature-specific filter records

  [Namespace].[Product].Domain/
   Entities/
      BaseAuditableEntity.cs     abstract base  all entities inherit this
   Exceptions/
      [Product]Exception.cs      base domain exception
      ValidationException.cs
      NotFoundException.cs
      BusinessRuleException.cs
      UnauthorisedException.cs
   Common/
      ErrorCodes.cs
      ErrorResponse.cs           sealed record  standard API error shape
      PagedResult.cs             generic paged response wrapper
      Result.cs                  Result<T>  Success/Failure without throwing
   Interfaces/
      ITenantScoped.cs
   Settings/
      AppSettings.cs             strongly-typed config record bound via IOptions<T>
   Enums/

  [Namespace].[Product].Infrastructure/
   Data/
      AppDbContext.cs
      AuditInterceptor.cs
      Configurations/            IEntityTypeConfiguration<T> per entity
   Migrations/
   Repositories/
   StoredProcedures/
      [Schema]/                  .sql SP stubs from /swp-db Step 9
   Services/
      CurrentUserService.cs
      JwtService.cs              omit if JWT not generated in app layer
      [External]Service.cs       named HttpClient wrappers for external APIs
   UnitOfWork.cs

  [Namespace].[Product].Tests.Unit/
   Application/
   Domain/                        entity + value object tests (no mocks)
   Infrastructure/
   appsettings.Testing.json

  [Namespace].[Product].Tests.Integration/
   Api/                           WebApplicationFactory HTTP tests
   Infrastructure/                real DB tests (Testcontainers)
   Helpers/
       TestWebApplicationFactory.cs
       DatabaseSeeder.cs

  Frontend workspace (skip if no frontend):
  frontend/
   src/
      app/
         core/
            guards/            AuthGuard, RoleGuard, PermissionGuard
            interceptors/      AuthInterceptor, ErrorInterceptor
            services/          AuthService, CurrentUserService
         shared/
            components/        layout/nav/spinner
            models/            TypeScript interfaces mirroring C# response DTOs
            pipes/             shared Angular pipes
            directives/        shared Angular directives
         store/                 NgRx (if chosen)
            index.ts           combined AppState interface
            app.effects.ts     router + global effects
            auth/              actions, reducer, effects, selectors
         [feature]/             one folder per Epic
            components/
            services/
            store/             NgRx feature slice (if feature uses NgRx)
         app.routes.ts
      environments/
         environment.ts
         environment.prod.ts
      app.config.ts
   tsconfig.json                  base TypeScript config; strict: true; path aliases (@app, @core, @shared, @env)
   tsconfig.app.json              extends tsconfig.json
   tsconfig.spec.json             extends tsconfig.json; includes test setup
   .eslintrc.json
   .prettierrc
   jest.config.js                 if Jest chosen; else karma.conf.js
   proxy.conf.json

---

## STEP 4  Base class and interface inventory

  SCAFFOLD LIST:

  **Domain layer:**
  - `BaseAuditableEntity` (abstract)
      `Id (int)`, `TenantId (int)`, `IsDeleted (bool, default false)`,
      `CreatedAt (DateTime UTC)`, `CreatedBy (int)`,
      `UpdatedAt (DateTime UTC)`, `UpdatedBy (int)`,
      `DeletedAt (DateTime UTC)`, `DeletedBy (int)`
      All entities inherit this  no exceptions.

  - `ITenantScoped` (marker interface)  tags entities for TenantId WHERE filter
  - `Result<T>` (sealed record)
      `IsSuccess (bool)`, `Value (T)`, `Error (string)`, `ErrorCode (string)`
      Static factories: `Result<T>.Success(value)`, `Result<T>.Failure(error, code)`
      Use as service method return type for expected business failures (validation, not found, conflict).
      Reserve exceptions for unexpected/infrastructure failures only.

  - `[Product]Exception` (base)  all custom exceptions inherit this
  - `ValidationException : [Product]Exception`
  - `NotFoundException : [Product]Exception`
  - `BusinessRuleException : [Product]Exception`
  - `UnauthorisedException : [Product]Exception`
  - `ErrorCodes` (static class)  one `public const string` per error code
  - `ErrorResponse` (sealed record)  `Code`, `Message`, `CorrelationId`, `ValidationErrors[]`
  - `PagedResult<T>` (sealed record)  `Items`, `TotalCount`, `PageNumber`, `PageSize`,
      `TotalPages (computed)`, `HasNextPage (computed)`
  - `AppSettings` (record)  `JwtSettings`, `ConnectionStrings`, `AllowedOrigins`, `RateLimitSettings`
      Bound in DI: `services.Configure<AppSettings>(config.GetSection("AppSettings"))`
      Injected as: `IOptions<AppSettings>`  NEVER inject `IConfiguration` directly into services.

  **Application layer:**
  - `IRepository<T, TId>`  `GetByIdAsync`, `GetPagedAsync`, `ExecuteSpAsync`, `AddAsync`, `UpdateAsync`, `DeleteAsync`
  - `IUnitOfWork`  `CommitAsync`, `RollbackAsync`, `BeginTransactionAsync`
  - `ICurrentUserService`  `TenantId (int)`, `UserId (int)`, `IsAuthenticated (bool)`
  - `IJwtService`  `GenerateToken(ClaimsIdentity)`, `ValidateToken(string)`
  - `IPaginatedFilter` (abstract record)  `PageNumber (int, default 1)`, `PageSize (int, default 20)`, `SearchTerm (string)`
      All feature filter DTOs inherit this.
  - Mapping profile/config  one `AutoMapper Profile` OR `Mapster TypeAdapterConfig` per entity group

  **Infrastructure layer:**
  - `AppDbContext : DbContext`  DbSets, OnModelCreating, AuditInterceptor wired
  - `AuditInterceptor : SaveChangesInterceptor`  auto-populates audit columns before every save
  - `GenericRepository<T, TId> : IRepository`  applies TenantId filter for ITenantScoped entities automatically
  - `CurrentUserService : ICurrentUserService`  reads claims from IHttpContextAccessor
  - `UnitOfWork : IUnitOfWork`

  **API layer:**
  - `GlobalExceptionMiddleware`
      `Result<T>.IsFailure`  map ErrorCode to HTTP status (404/409/422)
      Unhandled exception  500 with CorrelationId in response
  - `CorrelationIdMiddleware`  reads/generates `X-Correlation-Id`; adds to response headers

---

## STEP 5  Middleware pipeline order

  MIDDLEWARE PIPELINE (Program.cs  exact order):
  1.  `app.UseHttpsRedirection()`
  2.  `app.UseResponseCompression()`                   before any response-producing middleware
  3.  `app.UseCors("[PolicyName]")`                    before auth; omit if no frontend
  4.  `app.UseRateLimiter()`                           ASP.NET Core 7+ built-in; omit if not configured
  5.  `app.UseMiddleware<CorrelationIdMiddleware>()`    sets CorrelationId for all downstream logging
  6.  `app.UseMiddleware<GlobalExceptionMiddleware>()`  catches all unhandled exceptions
  7.  `app.UseSerilogRequestLogging()`
  8.  `app.UseAuthentication()`
  9.  `app.UseAuthorization()`
  10. `if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }`  dev only
  11. `app.MapControllers()`
  12. `app.MapHealthChecks("/health")`                 MANDATORY  Phase 2 exit criteria: GET /health = 200

  Notes:
  - Minimal API: add `app.UseRouting()` before step 5.
  - SignalR: add `app.MapHub<[Hub]>("/hub/[name]")` after MapControllers.
  - Skip UseCors if no frontend. Skip UseAuthentication/Authorization if SRS specifies no auth.
  - `MapHealthChecks` is always present  /health is the Phase 2 exit gate.

  **DI prerequisites for this pipeline** (all must be registered in Step 7):
  `AddResponseCompression()`, `AddCors(...)`, `AddRateLimiter(...)`,
  `AddHealthChecks().AddDbContextCheck<AppDbContext>()`, `AddSwaggerGen(...)` (dev only)

---

## STEP 6  Frontend workspace (skip if no frontend)

  **Angular state strategy decision  flag BEFORE scaffolding:**

  | Scenario | Recommendation |
  |----------|----------------|
  | <4 features, simple data flow, Angular 17+ | Signals + service-based state (no NgRx) |
  | 4+ features, complex cross-feature state, real-time | NgRx (store, effects, entity) |
  | Mixed | Signals for simple features, NgRx for complex  document the split |

  Output: `STATE STRATEGY: [Signals-only / NgRx / Mixed  describe split]`

> **React / Vue / other SPA:** Adapt as follows  guards  PrivateRoute / navigation guards; interceptors  axios instance with request/response handlers; NgRx  Zustand / Redux Toolkit / Pinia; angular.json  vite.config.ts or webpack.config.js. Apply the same feature-folder structure and lazy-loading principle.

  **Config files to scaffold:**
  | File                          | Content                                                                   |
  |-------------------------------|---------------------------------------------------------------------------|
  | `proxy.conf.json`             | `{ "/api": { "target": "https://localhost:[port]", "secure": false } }`   |
  | `environments/environment.ts` | `export const environment = { production: false, apiUrl: '/api' };`       |
  | `environments/environment.prod.ts` | `export const environment = { production: true, apiUrl: '' };`       |
  | `app.config.ts`               | `provideRouter`, `provideHttpClient`, `provideStore`, `provideEffects` (if NgRx) |
  | `tsconfig.json`               | `strict: true`; path aliases: `@app/*`, `@core/*`, `@shared/*`, `@env/*` |
  | `tsconfig.app.json`           | `extends: ./tsconfig.json`; includes `src/main.ts`                       |
  | `tsconfig.spec.json`          | `extends: ./tsconfig.json`; includes test setup file                     |
  | `.eslintrc.json`              | `@angular-eslint` rules + prettier integration                            |
  | `.prettierrc`                 | `singleQuote: true`, `printWidth: 100`, `trailingComma: 'all'`            |

  **shared/models/ rule:** one TypeScript interface per C# Response DTO.
  Named identically: `UserResponse` in C#  `UserResponse` in TypeScript.
  Imported via path alias: `import { UserResponse } from '@shared/models'`.

### STEP 6.1  State management patterns

**Signals-only state (simple projects):**
  ```typescript
  // shared/services/app-state.service.ts
  @Injectable({ providedIn: 'root' })
  export class AppStateService {
    private currentUser = signal<User | null>(null);
    private isLoading = signal(false);

    currentUser$ = this.currentUser.asReadonly();
    isLoading$ = this.isLoading.asReadonly();

    setCurrentUser(user: User) {
      this.currentUser.set(user);
    }
  }
  ```

**NgRx state (complex projects):**
  ```
  store/
   index.ts                     combined AppState interface
   app.effects.ts               router + global effects
   auth/
      auth.actions.ts
      auth.reducer.ts
      auth.effects.ts
      auth.selectors.ts
   [feature]/                   one per Epic
      [feature].actions.ts
      [feature].reducer.ts
      [feature].effects.ts
      [feature].selectors.ts
  ```

### STEP 6.2  Guards and interceptors

**AuthGuard (route protection):**
  ```typescript
  // core/guards/auth.guard.ts
  @Injectable({ providedIn: 'root' })
  export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
      return this.authService.isAuthenticated()
         true
        : this.router.navigate(['/login']);
    }
  }
  ```

**ErrorInterceptor (response handling):**
  ```typescript
  // core/interceptors/error.interceptor.ts
  @Injectable()
  export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          return throwError(() => new Error(error.message));
        })
      );
    }
  }
  ```

### STEP 6.3  Feature module folder structure

  **Each feature folder (lazy-loaded):**
  ```
  [feature]/
   [feature].routes.ts          lazy-loaded route config
   components/
      [feature]-list.component.ts
      [feature]-detail.component.ts
      [feature]-form.component.ts
   services/
      [feature].service.ts     HTTP calls to API
   models/
      [feature].model.ts       TypeScript interfaces
   store/                       if using NgRx
       [feature].actions.ts
       [feature].reducer.ts
       [feature].effects.ts
       [feature].selectors.ts

  Route guard on feature route: `canActivate: [AuthGuard]`
  Lazy load in app.routes.ts: `loadChildren: () => import('[feature]').then(m => m.routes)`
  ```

---

## STEP 7  DI registration plan

**Rule:** Program.cs calls only extension methods. No inline service registrations.

  PROGRAM.CS PATTERN:
  ```csharp
  builder.Services
      .AddInfrastructure(builder.Configuration)
      .AddApplication(builder.Configuration)
      .AddApiServices(builder.Configuration, builder.Environment);
  ```

  **`AddInfrastructure(IConfiguration config)`**  API/Extensions/InfrastructureExtensions.cs:
  ```
  services.AddHttpContextAccessor()
  services.AddDbContext<AppDbContext>(opt =>
      opt.Use[SqlServer|Npgsql](config.GetConnectionString("Default"))
         .AddInterceptors(new AuditInterceptor()))
  services.AddScoped(typeof(IRepository<,>), typeof(GenericRepository<,>))
  services.AddScoped<IUnitOfWork, UnitOfWork>()
  services.AddScoped<ICurrentUserService, CurrentUserService>()
  services.AddScoped<IJwtService, JwtService>()
  services.AddHealthChecks().AddDbContextCheck<AppDbContext>()
  services.Configure<AppSettings>(config.GetSection("AppSettings"))
  // Named HttpClient per external service:
  services.AddHttpClient<I[External]Service, [External]Service>(client =>
      client.BaseAddress = new Uri(config["AppSettings:[External]BaseUrl"]!))
      .AddStandardResilienceHandler()    // Polly v8 retry/circuit breaker
  ```

  **`AddApplication(IConfiguration config)`**  API/Extensions/ApplicationExtensions.cs:
  ```
  services.AddAutoMapper(typeof(AssemblyMarker))  // if AutoMapper
  // OR: services.AddMapster()                      // if Mapster
  services.AddScoped<I[Feature]Service, [Feature]Service>()  // one per Epic
  ```

  **`AddApiServices(IConfiguration config, IWebHostEnvironment env)`**  API/Extensions/ApiExtensions.cs:
  ```
  services.AddControllers()
  services.AddFluentValidationAutoValidation()
  services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly())
  services.AddResponseCompression(opt => opt.EnableForHttps = true)
  services.AddRateLimiter(opt =>
      opt.AddFixedWindowLimiter("fixed", o => { o.PermitLimit = 100; o.Window = TimeSpan.FromMinutes(1); }))
  services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
      .AddJwtBearer(opt => { /* bind from IOptions<AppSettings>.JwtSettings */ })
  services.AddAuthorization()
  services.AddCors(opt => opt.AddPolicy("[PolicyName]", policy =>
      policy.WithOrigins(config["AppSettings:AllowedOrigins"]!.Split(','))
            .AllowAnyMethod().AllowAnyHeader()))
  if (env.IsDevelopment())
      services.AddSwaggerGen(...)
  ```

  **Serilog:**
  ```
  Log.Logger = new LoggerConfiguration()
      .Enrich.FromLogContext()
      .Enrich.WithProperty("Application", "[Product]")
      .WriteTo.[Sink from SRS stack]
      .CreateLogger()
  ```

---

## STEP 7.5  Security validation checklist

### Backend security (all stacks)
- [ ] Authentication: JWT middleware registered and configured
- [ ] Authorisation: [Authorize] applied to all endpoints
- [ ] Tenant isolation: All tenant-scoped queries include TenantId filter
- [ ] SQL injection: No raw SQL; all queries via ORM or typed SP parameters
- [ ] Secrets: No hardcoded API keys/passwords/JWT secrets; use env vars
- [ ] Error responses: Stack traces not exposed; ErrorResponse DTO uses error codes
- [ ] Rate limiting: Rate limiter middleware present and correctly ordered
- [ ] CORS: Policy explicitly configured; no wildcard origins in production

### Frontend security (Angular/React/Vue only)
- [ ] XSS: No innerHTML with unsanitised input
- [ ] CSRF: Token injected in HTTP interceptor
- [ ] CSP headers: Content-Security-Policy header configured
- [ ] Auth token storage: JWT in memory or httpOnly cookie  NOT localStorage
- [ ] Sensitive data: PII/PHI not logged to browser console

Any  = add to the architecture report gap list before Go/No-Go.

---

## STEP 8  Architecture output + Go/No-Go decision

  ARCHITECTURE DESIGN REPORT
  SRS File      : docs/SRS.md
  UI Design     : docs/UI-DESIGN.md (or N/A)
  DB Design     : docs/DB-DESIGN.md (or N/A)
  Designed      : [today]
  Stack         : [Backend + Frontend + .NET version from STACK CONFIRMED]

  PROJECTS      : [N]  list each
  LAYERS        : Domain  Application  Infrastructure  API  Tests.Unit  Tests.Integration
  SCAFFOLD      : [N] base classes/interfaces
  MIDDLEWARE    : [N] in pipeline
  DI ITEMS      : [N] across [N] extension methods
  PACKAGES      : [N] NuGet, [N] npm  all from SRS approved list
  STATE STRATEGY: [Signals-only / NgRx / Mixed]
  MAPPING       : [AutoMapper / Mapster / Manual]
  RESULT<T>     : [Adopted / Exception-only]

  PACKAGE GAPS (not in SRS approved list):
    [None]  / [list each  PENDING DECISION required]

  
  GO / NO-GO DECISION
  

  Pre-score checklist (auto-fail any unchecked item):
  [ ] No circular project references
  [ ] No upward layer references (Infrastructure does not reference API)
  [ ] All packages from SRS approved list (or gaps flagged)
  [ ] Swagger gated to Development environment only
  [ ] AppSettings bound via IOptions<T>  no raw IConfiguration in services
  [ ] DI organized into extension methods (no inline registrations in Program.cs)
  [ ] /health endpoint mapped + AddDbContextCheck registered
  [ ] Mapping strategy recorded in STACK CONFIRMED

  Scoring dimensions (100 pts total):

  Prerequisites met  STACK CONFIRMED complete, all design docs present and approved   [XX / 15]
  Projects + dependency graph  no circular refs, correct layer direction, root files  [XX / 15]
  Folder structure  all projects incl. Validators/, Extensions/, Constants/, tsconfig [XX / 15]
  Base class inventory  BaseAuditableEntity, Result<T>, IPaginatedFilter, IOptions<T> [XX / 15]
  Middleware pipeline  correct order, rate limiter, dev-only Swagger, /health         [XX / 15]
  DI registration  extension method pattern, IOptions, all services, named HttpClient [XX / 15]
  Security + testability  JWT config, CORS policy, IntegrationTests project present   [XX / 10]
  
  TOTAL                                                                                [XX / 100]

   GO          85100   Architecture ready. Proceed to /swp-scaffold.
   CONDITIONAL  6084   Resolve items below before proceeding.
   NO-GO        < 60    Architecture requires rework. Do not scaffold.

  SIGNAL:  GO /  CONDITIONAL /  NO-GO

  If  GO:
  Run /swp-sync validate  confirm ARCH-DESIGN.md  SRS, UI-DESIGN.md, DB-DESIGN.md are consistent.
  If /swp-sync reports conflicts: resolve them before proceeding to /swp-ui.

  Blockers preventing full GO (if any):
  1. [item  step detected  resolution needed]

  PENDING DECISIONS  Tech lead must resolve before "architecture approved"
  
   #   Item                                  Score  Decision Needed                        Reply with                                   
  
   1   [circular ref / package gap]          X    [resolution]                           "resolve [item]: [answer]"                   
   2   [mapping strategy not chosen]         X    AutoMapper / Mapster / Manual          "resolve mapping: [choice]"                  
   3   [Angular state strategy]              X    Signals / NgRx / Mixed                "resolve state: [choice]"                    
   4   [project structure Q]                 X    [decision needed]                      "revise [section]: [feedback]"               
   5   [deferrable item]                     X    [defer or accept risk]                 "defer [item] to phase [N]"                  
  

  [N] decisions pending. Architecture cannot be approved until all  items are resolved.

  OPEN QUESTIONS FOR TECH LEAD:
  1. [Mapping strategy  if not in STACK CONFIRMED]
  2. [Angular state strategy  signals vs NgRx]
  3. [Any unlisted package needed]
  4. [Integration test strategy  Testcontainers vs LocalDB]
  5. [Result<T> adoption  yes or exception-only]

  
  PHASE 1 ARCHITECTURE GATE
  To resolve a gap     : "resolve [item]: [answer]"
  To revise a section  : "revise [section]: [feedback]"
  To defer an item     : "defer [item] to phase [N]"
  To accept risk       : "accept risk: [item]"
  To approve           : "architecture approved"

  Approval hardening:
  - Accept only the exact phrase "architecture approved" after all red blockers are resolved.
  - Reject ambiguous approval language: "looks good", "LGTM", "approved enough", "continue", "ship it", "go ahead", or "approved verbally".
  - If red blockers or pending package/stack decisions remain, respond with the unresolved blocker list and stay at this gate.
  - If the user asks to skip this gate, require an explicit risk decision for each blocker before continuing.
  - If approval conflicts with PATH CONFIRMED or BREAKDOWN.md phase state, stop and print the mismatch before writing files.

  Claude will not scaffold any code until "architecture approved".
  

[STOP  wait for "architecture approved"]

---

## STEP 9  After "architecture approved"

1. Write the approved design to the existing grouped architecture doc if one exists, otherwise create the next group-sequence file: `docs/[GGG].[NNN].arch-design-[YYYY-MM-DD].md`:
   - Solution structure + TFM + all projects
   - Dependency graph (circular-ref-free confirmation)
   - Folder structure per project
   - Base class + interface inventory
   - Middleware pipeline order
   - Frontend workspace + state strategy decision (if applicable)
   - DI extension method plan
   - Mapping strategy + Result<T> decisions
   - Cross-references:  docs/DB-DESIGN.md |  docs/UI-DESIGN.md |  docs/SRS.md

2. Create solution root files:
   - `global.json`  pin .NET SDK to version from STACK CONFIRMED
   - `.editorconfig`  standard C# + TypeScript style rules
   - `Directory.Build.props`  shared TFM, Nullable enable, ImplicitUsings

3. Update ENTITIES.md  add layer mapping column to each table row:
   - Entity class        `[Namespace].[Product].Domain/Entities/[EntityName].cs`
   - EF configuration   `Infrastructure/Data/Configurations/[EntityName]Configuration.cs`
   - Repository         `Infrastructure/Repositories/[EntityName]Repository.cs`

4. Commit architecture docs and root files using the Standalone Approval Publish Contract:
     git add docs/*.*.arch-design-*.md docs/ARCH-DESIGN.md global.json .editorconfig Directory.Build.props docs/*.*.entities-*.md ENTITIES.md
     git commit -m "docs(phase-1): solution architecture approved  [N] projects, [N] base classes"
     git push origin HEAD

5. Update docs/BREAKDOWN.md  mark 1A Architecture as complete:
   Find: `## Phase 1A  Architecture Design   [ ] pending`
   Replace with:
   `## Phase 1A  Architecture Design   [x] [today's date]`
   `  - Layered architecture: [list layers from approved design]`
   `  - DI container: [from STACK CONFIRMED]`
   `  - Key patterns: [BaseAuditableEntity / ITenantScoped / etc.]`

     git add docs/BREAKDOWN.md
     git commit -m "docs(phase-1): BREAKDOWN.md  1A architecture approved"
     git push origin HEAD
     Create or update the PR to `develop` using `.claude/refs/approval-publish-contract.md`.

   Then auto-continue to Stage 2 (do not wait for user input):
   Output: "Stage 1 approved  auto-continuing to Stage 2: Scaffold"

6. Update README.md and CHANGELOG.md:

   README.md:
     Phase badge  "Phase 1  Architecture Approved"
     Architecture section: project list + one-line purpose, state strategy, mapping strategy

   CHANGELOG.md under [Unreleased]  ### Added:
     - Phase 1: Solution architecture approved  [N] projects, [N] base classes
     - Result<T>: [adopted / not adopted]; Mapping: [choice]; State: [choice]

     git add README.md CHANGELOG.md
     git commit -m "docs(phase-1): update README and CHANGELOG  architecture approved"
     git push origin HEAD
     Ensure the same PR to `develop` is updated with these docs changes and the manager acceptance email.

6.5. Update CONTEXT.md 'Last refinement' field:
   ```
   Last refinement: /swp-arch v[previous version]v[new version], [today's date], [brief summary of changes made in this run]
   ```

7. Run /swp-sync validate automatically:
   Call /swp-sync (MODE 1  Validate).
   Wait for SYNC VALIDATION REPORT.
   If RESULT:  BLOCKED  resolve all conflicts; re-run /swp-sync.
   If RESULT:  CONSISTENT  proceed.

8. Update ADO work item:
     State   : Done
     Comment : "Phase 1A Architecture approved. ARCH-DESIGN.md committed. Auto-continuing to Stage 2: Scaffold."

8.5. Downstream impact analysis:

   Analyse what the approved architecture implies for docs/BREAKDOWN.md and /swp-plan.

     DOWNSTREAM IMPACT  ARCH-DESIGN.md
     
     Impact on docs/BREAKDOWN.md:
       New projects added to solution (not yet in BREAKDOWN.md task list):
          None
         OR
           [N] projects need task rows  run: /swp-plan [feature] to add breakdown tasks
            [Project name]  new tasks needed: [list layer tasks]

       New base classes/interfaces added (not yet broken down into subtasks):
          None
         OR
           [list: class name + which story/task should own it]

       New repositories / services added (need subtask rows):
          None
         OR
           [list: class name + which Task N.N.B / N.N.C it belongs to]

     Impact on /swp-scaffold:
       New config files or solution root files added (global.json, .editorconfig, etc.):
          None /   [list: file + purpose  scaffold must create these]

     Shortcuts:
       Validate consistency now  : /swp-sync validate
       Cascade feature changes   : /swp-sync [feature name]
     

9. Output:
     STAGE 1 ARCHITECTURE APPROVED
     Projects         : [N] ([N] test projects incl. IntegrationTests)
     Base classes     : [N] scaffolded
     Mapping strategy : [choice]
     State strategy   : [choice]
     Result<T>        : [adopted / not adopted]
     Root files       : global.json, .editorconfig, Directory.Build.props created
     Next             : Auto-continuing to Stage 2  Scaffold

---

## STAGE 2  Scaffold

Runs automatically after Stage 1 is approved. Do NOT wait for user input to begin.

Output: " Stage 2: Scaffold  running /swp-scaffold steps against approved ARCH-DESIGN.md"

Execute all steps from /swp-scaffold (.claude/commands/swp-scaffold.md):
- Read docs/ARCH-DESIGN.md (just approved in Stage 1)
- Run STEP 0 through STEP 11 of swp-scaffold
- Build verification: zero errors, zero warnings required

### Stage 2 partial-failure recovery

If scaffold writes files but build verification fails:

1. Stop before the Stage 2 approval gate.
2. Print a recovery report:
   - files created or modified
   - exact build command run
   - error and warning counts
   - first failing project/module/package
   - likely owner step from /swp-scaffold
3. Fix scaffold-generated defects in place without reverting user-authored unrelated changes.
4. Re-run the stack-appropriate build/test command until zero errors and zero warnings are confirmed.
5. Do not update BREAKDOWN.md, README.md, CHANGELOG.md, ADO, or Phase 1 completion status until recovery succeeds.

If recovery requires a new package, framework version change, project split, or architecture decision not present in `docs/ARCH-DESIGN.md`, return to the Architecture Gate and require a resolved decision before continuing.

### Stage 2 approval gate

  
  STAGE 2 GATE  Scaffold
  Build output : [zero errors / zero warnings  confirmed]
  Projects     : [N] created and building
  Base files   : [N] scaffolded

  To approve scaffold : "scaffold approved"

  Approval hardening:
  - Accept only the exact phrase "scaffold approved" after zero errors and zero warnings are confirmed.
  - Reject ambiguous approval language: "looks good", "continue", "approved enough", "works on my machine", or "skip build".
  - If verification is missing, stale, or failed, print the missing command/result and stay at this gate.
  - If generated files exist after a failed scaffold, run the partial-failure recovery section before asking for approval again.

  Claude will not mark Phase 1 complete until "scaffold approved".
  

[STOP  wait for "scaffold approved"]

### After "scaffold approved"

1. Update docs/BREAKDOWN.md  mark 1B Scaffold as complete:
   Find: `## Phase 1B  Scaffold              [ ] pending`
   Replace with:
   `## Phase 1B  Scaffold              [x] [today's date]`
   `  - Build: 0 errors, 0 warnings`
   `  - Projects: [N] created`

     git add docs/BREAKDOWN.md
     git commit -m "docs(phase-1): BREAKDOWN.md  1B scaffold approved"
     git push origin HEAD
     Create or update the PR to `develop` using `.claude/refs/approval-publish-contract.md`.

2. Update ADO work item:
     State   : Done
     Comment : "Phase 1B Scaffold approved. Zero build errors. Phase 2 commands are now unblocked (see PATH CONFIRMED in SRS.md)."

3. Output:
     PHASE 1 COMPLETE  Architecture + Scaffold
     1A Architecture : [x] approved
     1B Scaffold     : [x] approved
     Next             : [Read PATH CONFIRMED from docs/SRS.md  print the Phase 2 command(s) from the locked flow. If /swp-design: run /swp-design. If /swp-ui + /swp-db separately: run them in parallel. If no PATH CONFIRMED: default to /swp-ui and /swp-db in parallel.]

---

## Applied enhancement verification checklist

Use this checklist after editing this command:

| Check | Review | Expected result |
|---|---|---|
| Helper trigger | Run `/swp-arch help` mentally or in command harness | Helper prints and STEP 0 does not start |
| Normal trigger | Run `/swp-arch` with approved SRS context | STEP 0 prerequisite and PATH checks run |
| Architecture gate bypass | User says "looks good" with blockers unresolved | Command rejects approval and repeats blockers |
| Scaffold gate bypass | User says "skip build" or "continue" | Command rejects approval until zero errors/warnings are verified |
| Partial scaffold failure | Build fails after files are generated | Recovery report prints and Phase 1 is not marked complete |
| Version trail | Inspect header and changelog | Version, Updated date, and top changelog row match latest edit |

