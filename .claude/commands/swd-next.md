---
name: swd-next
description: |
  Build the next implementation layer for the current active story  writes production code and unit tests for one layer (endpoint, service, repository, stored procedure, or component), then outputs manual testing instructions.
  Enforces a testing gate: blocks if the previous layer's manual testing proof has not been submitted.
  Trigger when: implementing a layer, continuing development on the current story, building the next step, or running /swd-next.
compatibility: Any stack  reads STACK CONFIRMED from docs/SRS.md
Command  : /swd-next
Version  : 2.1
Updated  : 2026-05-21
| Version | Date       | Author  | Changes                                                                                          |
|---------|------------|---------|--------------------------------------------------------------------------------------------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.5     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.4     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.3     | 2026-05-18 | KapilDev  | Standardize delivery-loop handoff snapshot: outputs, blockers, loop step, next command |
| 1.2     | 2026-05-13 | Zenthil | Added Go/No-Go build readiness gate after STEP 5 self-review; PENDING DECISIONS matrix for build errors and AC gaps |
| 1.1     | 2026-05-13 | Zenthil | STEP 1: hard gate blocks next layer if manual_testing_done  true; STEP 7: danger banners on all 6 layers; STEP 7.5: resets manual_testing_done = false after instructions output |
| 1.0     | 2026-05-13 | Zenthil | Created from /swd-start STEP 27  builds one layer, writes unit tests, then outputs detailed layer-specific manual testing instructions with exact scripts and proof slots |

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

Build the next layer for the current story: $ARGUMENTS

Format: /swd-next [layer]
Examples:
  /swd-next endpoint      build the endpoint layer
  /swd-next sp            build the stored procedure
  /swd-next               ask which layer to build next

Requires: /swd-start must have been run first (session.state.story_id must be set).

## HANDOFF SNAPSHOT

**Produces / updates**
- one implementation layer of production code for the active story
- unit tests for that layer
- manual testing instructions for the exact layer just built
- `.claude/session.state` gate reset: `work_done = true`, `manual_testing_done = false`

**Blocks progress when**
- no active story exists in `.claude/session.state`
- the previous layer is finished but manual testing proof is still missing
- AC mapping, build confirmation, or self-review gates fail

**Current step in canonical delivery loop**
- Step 3 of 6 -> repeated implementation pass for each remaining layer
- Canonical loop: `/swl-start -> /swd-start -> /repeat(/swd-next -> /swd-manual-testing) -> /swd-review -> /swd-submit`

**Next command**
- `/swd-manual-testing`

---

## STEP 1  Load current context

Read `.claude/session.state`:

  IF story_id is not set:
    HARD STOP: "Run /swd-start first  no active story in session."

  IF work_done = true AND manual_testing_done  true:

  
     NEXT LAYER BLOCKED  MANUAL TESTING NOT SUBMITTED           
  
    You completed the previous layer but proof has not been        
    submitted. No new layer can start until testing is done.       
                                                                    
    Run: /swd-manual-testing                                     
  

  HARD STOP  do not select a layer, do not write any code.

Read in order:
1. CONTEXT.md  current story, completed subtasks, files already created
2. docs/SRS.md  STACK CONFIRMED (test framework, server port, DB name, schema names)
  IF docs/SRS.md not found:
    HARD STOP: "docs/SRS.md not found  cannot confirm stack. Run /swd-start to initialize."
3. docs/BREAKDOWN.md  next uncompleted subtask and its ADO task ID

Output:
  Story   : [story_id]  [story_title]
  Branch  : [branch from session.state]
  Next    : [next  subtask name]  ADO Task [ID]

---

## STEP 2  Select layer

If layer is not clear from $ARGUMENTS, output this menu and wait:

  Which layer are you building

  1. Repository    data access (interface + implementation)
  2. Service       business logic (interface + implementation)
  3. Endpoint      API controller + request/response DTOs + validator
  4. SP            SQL stored procedure + migration file
  5. Component     frontend UI component
  6. Frontend Svc  frontend HTTP data service

  Type the number or name.

---

## STEP 3  Pre-checks (all layers)

Before writing any code:
- Confirm entity/feature is in ENTITIES.md (never build without registration)
- If building an entity class: confirm it inherits `BaseAuditableEntity`  never define Id, TenantId, or audit columns directly
- If building a service: confirm `ICurrentUserService` is in the constructor  never pass tenantId as a parameter
- Search codebase for existing implementation  never duplicate
- Confirm ADO task ID for this work (from docs/BREAKDOWN.md)
- Map ACs: read docs/SRS.md and list every AC for this story that this subtask must satisfy
  AC MAP: AC[N]  [text]  [method name to implement / update]
  Any AC with no method mapped = STOP  raise as an ADO sub-task gap before writing code.

Output:
  LAYER    : [selected layer]
  Feature  : [feature / entity name]
  ADO Task : [task ID]
  SRS Story: [story ID]  SRS section: [N.N]
  ACs in scope: [list every AC this subtask covers]
  Reusing  : [list existing files / methods to reuse]
  Creating : [list new files]
  NOT touching: [list in-scope but excluded files]
  Multi-entity: IF this layer touches more than one entity, list each separately in Creating/Reusing above and run one self-review pass per entity class in STEP 5.

Wait for approval before writing code.

---

## STEP 4  Build rules per layer

### LAYER 1  Repository

Files (adapt extension/path to SRS stack):
  Interfaces/I[Entity]Repository.[ext]
  [Entity]Repository.[ext]

Standard methods (adapt to SRS ORM/data access pattern):
  GetByIdAsync(id, tenantId)
  GetAllAsync(tenantId)
  InsertAsync(dto)           calls [Schema].usp[Entity]Insert (SP stack)
  UpdateAsync(dto)           calls [Schema].usp[Entity]Update
  DeleteAsync(id, tenantId)  soft delete only (IsDeleted = 1)

ENFORCE (no exceptions):
  - Every query: .Where(x => x.TenantId == tenantId) or @TenantId parameter in SP
  - Every query: .Where(x => !x.IsDeleted) or WHERE IsDeleted = 0
  - No raw SQL strings  ORM LINQ or SP calls only
  - Async/await on every method

---

### LAYER 2  Service

Files:
  Interfaces/I[Feature]Service.[ext]
  Services/[Feature]Service.[ext]

Constructor inject: I[Entity]Repository, IUnitOfWork, ICurrentUserService, ILogger (from SRS logging stack)

  ICurrentUserService is MANDATORY in every service that reads or writes tenant-scoped data.
  Use _currentUser.TenantId in every query  never accept tenantId as a method parameter.
  Use _currentUser.UserId for audit trail fields (handled by AuditInterceptor).

If SRS has pseudo code for this method:
  - Follow CLAUDE.md 4  line by line, no improvisation
  - Output TRANSLATION CHECK before writing a single line of code using this template:

  TRANSLATION CHECK  [ClassName.MethodName]
  
   Pseudo-code line              .NET / [stack] implementation         Notes / deviation               
  
   [pseudo-code line 1]         [method call / LINQ / await ...]      [any deviation from pseudo-code]
   [pseudo-code line 2]         [...]                                 [none if direct translation]    
  

  Wait for "translation approved" before proceeding.

If SRS has NO pseudo code for this method:
  - Implement the standard CRUD pattern using Layer 1 conventions (repository calls, UoW commit, logging, error codes).
  - Proceed directly to the self-review in STEP 5.

ENFORCE (no exceptions):
  - ILogger: Info on entry + exit, Error on every caught exception
  - All error strings from ErrorCodes constants  never hardcoded
  - Throw domain exceptions (ValidationException / NotFoundException / BusinessRuleException)
  - UoW commit only in service layer  never inside a repository

---

### LAYER 3  Endpoint

Files:
  Controllers/[Feature]Controller.[ext]
  DTOs/[Feature]RequestDto.[ext]
  DTOs/[Feature]ResponseDto.[ext]
  Validators/[Feature]RequestDtoValidator.[ext]

Route conventions:
  - Route template: /api/[plural-resource] (list/create) or /api/[plural-resource]/{id} (by-id)
  - HTTP verbs: GET=read, POST=create, PUT=full-update, PATCH=partial-update, DELETE=remove
  - Versioning: use /api/v1/[plural-resource] if SRS specifies API versioning
  - Resource name: kebab-case plural noun derived from entity name (e.g., work-orders, asset-types)

ENFORCE (no exceptions):
  - Zero business logic in controller  all logic in service layer
  - Validate request DTO at API boundary using SRS validation framework
  - Return ErrorResponse DTO shape on any exception (CLAUDE.md 16)
  - Auth decorator on every protected endpoint
  - If list endpoint: use PagedResult<T> with PageNumber/PageSize (CLAUDE.md 18)

---

### LAYER 4  Stored Procedure

Applies when: SRS STACK CONFIRMED includes SQL Server, PostgreSQL, or MySQL.

Files:
  Database/StoredProcedures/[Schema]/[Schema].usp[Entity][Action].sql
  Database/Migrations/[timestamp]_Add[Schema]usp[Entity][Action].[ext]

ENFORCE 14 (no exceptions):
  - Naming: [Schema].usp[Entity][Action]  entity-first, action-last, PascalCase schema
  - Always CREATE OR ALTER PROCEDURE  never DROP and CREATE
  - Always @TenantId INT parameter
  - Every read SP: WHERE IsDeleted = 0 AND TenantId = @TenantId
  - Paged SPs: @PageNumber INT, @PageSize INT + COUNT(*) OVER() AS TotalCount
  - File header: SP / Desc / Auth / Date block per CLAUDE.md 14

---

### LAYER 5  Component

Files (adapt to SRS frontend framework):
  Angular : src/app/[feature]/[name]/[name].component.ts + .html + .scss
  React   : src/components/[feature]/[Name].tsx + .module.css
  Vue     : src/components/[feature]/[Name].vue

Angular ENFORCE 17 (no exceptions):
  - @Component({ standalone: true, imports: [...] })  NgModule PROHIBITED
  - loadComponent() for lazy routes  never loadChildren() with a module

React ENFORCE (no exceptions):
  - Functional components only  no class components
  - useState/useEffect/custom hooks  never direct API calls outside a hook or service
  - TypeScript: all props typed via interface  no implicit `any`

Vue ENFORCE (no exceptions):
  - Use Composition API (`<script setup>`) per SRS unless Options API specified
  - No direct fetch/axios in template  call through a composable or service
  - TypeScript: defineProps<T>()  no untyped prop definitions

State rules (never mix patterns in same feature):
  Shared/cross-feature state  NgRx / Redux / Pinia (from SRS)
  Feature-local state         Service + BehaviorSubject / useState / ref
  One-time data               direct HTTP call in component

---

### LAYER 6  Frontend Service

File: src/app/[feature]/services/[name].service.[ext]

ENFORCE:
  - All methods return Observable<T> (Angular) or Promise<T> (React/Vue)
  - Never subscribe inside a service  components subscribe
  - No hardcoded URLs  read from environment config
  - BehaviorSubject exposed as Observable<T> if this service owns shared state

---

## STEP 5  Self-review + build confirmation

Stop after ONE file. Run the self-review:

  SELF REVIEW:
  1.  Naming  SRS namespace, layer, casing conventions followed
  2.  No hardcoded strings  all in constants / ErrorCodes
  3.  Async/await on every method
  4.  Error handling  exceptions thrown, not swallowed
  5.  No secrets in any file
  6.  Logging  entry/exit/error present
  7.  No duplicate of anything in SCAN RESULT
  8.  No files touched outside this task scope
   Backend layers only (Repository / Service / Endpoint / SP) 
  9.  Tenancy filter on EVERY query (uses _currentUser.TenantId or @TenantId param)
  10. Soft-delete filter on EVERY read query (IsDeleted = 0 / !x.IsDeleted)
  11. ICurrentUserService injected in Service (never tenantId as method parameter)
  12. Entity inherits BaseAuditableEntity (no Id/TenantId/audit columns defined directly)
  13. No raw SQL strings (ORM LINQ or SP calls only)
  14. DTOs validated at API boundary only (never inside service or repository)
   Frontend layers only (Component / Frontend Service) 
  9f. No direct HTTP calls inside a component (all HTTP through a service/composable)
  10f. Observable<T> / Promise<T> returned  not subscribed inside the service
  11f. No hardcoded API URLs (reading from environment config)
  12f. Loading / error / empty states handled in component template
  13f. N/A (backend concern  skip)
  14f. N/A (backend concern  skip)
  15. Every AC in STEP 3 AC MAP covered [mark each COVERED / NOT COVERED]

  Fix any violation before outputting the build command.

Output: "Run: [build command from SRS stack]  confirm pass before I continue."
Wait for build confirmation, then output the Go/No-Go section below.

## Go/No-Go  Build Readiness

Rate each dimension (20 pts each, 100 pts total).
Apply layer-appropriate self-review items (items 914 for backend; 9f12f for frontend).

  All applicable self-review items passed (no violations found)    [XX / 20]
  Build / compile passes (0 errors, 0 warnings)                    [XX / 20]
  All ACs in scope mapped to a method (AC MAP complete)            [XX / 20]
  No duplicate of anything in SCAN RESULT                         [XX / 20]
  No files touched outside this task scope                        [XX / 20]
  
  TOTAL                                                            [XX / 100]

   GO      80100   Build confirmed. Proceed to STEP 6 (unit tests).
   PARTIAL 6079    Fix self-review violations, then re-run build.
   NO-GO   < 60     Run /swm-bug to fix build errors before continuing.

  SIGNAL:  GO /  PARTIAL /  NO-GO

  PENDING DECISIONS  resolve before proceeding to unit tests
  
   #   Issue                                                 Priority  Reply with                           
  
   1   Build error  [file:line error message]                      "run /swm-bug: [error]"               
   2   AC[N] not mapped to any method                               "AC[N] covered by: [MethodName]"     
   3   Self-review violation  [item N description]                 "fix [item N]: [approach]"           
  

  [STOP  resolve all  items and confirm  GO before starting unit tests in STEP 6]

---

## STEP 5.5  Checkpoint CONTEXT.md

After confirmed  GO, append to CONTEXT.md:

  ### In-Progress  [ADO Task ID]: [Subtask Name]
  Layer  : [selected layer]
  Files  : [list every file created or modified]
  Status : in-progress  unit tests pending

---

## STEP 6  Unit tests (after build confirmed green)

### Phase A  Branch list

Derive every testable branch from the method(s) just written. Include mandatory AC branches.

  BRANCH LIST  [ClassName.MethodName]
  [AC1  mandatory] 1. [happy path covering AC1]  [expected result]
  [AC2  mandatory] 2. [error path covering AC2]  [expected result]
  [extra]           3. [additional branch]  [expected result]
  ...

[STOP  wait for tech lead to select branches.
NEVER invent test cases. Only implement what the tech lead specifies.]

---

### Phase B  Write tests (after tech lead confirms branches)

Naming bridge  map Phase A branches to test method names:
  [AC1  mandatory]  test name prefix: AC1_
  [AC2  mandatory]  test name prefix: AC2_
  [extra]            no AC prefix required; use descriptive name only
  Full pattern: AC[N]_[ClassName]_[Method]_[Condition]_[ExpectedResult]

ENFORCE 10 rules (no exceptions):
  - Mock ALL external dependencies  DB, HTTP, file system, time
  - No real DB calls, no real HTTP, no docker-compose, no file system
  - Arrange / Act / Assert  one assertion per test method
  - Naming: AC[N]_[Method]_[Condition]_[ExpectedResult]

Test file location (adapt to SRS stack):
  .NET    : Tests/[Layer]/[ClassName]Tests.cs
  Angular : src/app/[feature]/[name].spec.ts
  Python  : tests/[layer]/test_[name].py
  Go      : [package]/[name]_test.go

Layer templates: Repository  mock IDbConnection/DbContext; Service  mock IRepo + IUoW + ICurrentUserService + ILogger;
Endpoint  mock IService via controller unit test; Component  mock service with spy; Frontend Svc  HttpClientTestingModule.

Stop after writing the test file.
Output: "Run: [test command]  confirm all green."
Wait for test confirmation before STEP 7.

After test confirmation, update CONTEXT.md  change the in-progress entry from STEP 5.5 to complete:

  ### Completed  [ADO Task ID]: [Subtask Name]
  Layer  : [selected layer]
  Files  : [list every file created or modified]
  Tests  : [N] passing  [test file path]
  Status : complete  awaiting manual testing

---

## STEP 7  Manual Testing Instructions

After tests confirmed green, generate the full manual testing instructions for this subtask.
Base every step on the actual layer, files created, ACs, and SRS stack confirmed in STEP 1.

Output the appropriate block for the layer built:

---

### IF LAYER = SP (Stored Procedure)

  
  MANUAL TESTING  Stored Procedure: [Schema].[usp[Entity][Action]]
  Story: [ID]  [Title] | ADO Task: [ID] | ACs: [list]
  

  TOOL: SSMS or Azure Data Studio
  DB  : [database name  from appsettings.Development.json ConnectionStrings]
  

  MIGRATION CHECK (do this first):
  Run in SSMS:
  ```sql
    SELECT ROUTINE_NAME FROM INFORMATION_SCHEMA.ROUTINES
    WHERE ROUTINE_SCHEMA = '[Schema]' AND ROUTINE_NAME = 'usp[Entity][Action]'
  ```
  Expected: 1 row  if 0 rows, run: dotnet ef database update
  [ ] Migration applied  SP exists in DB

  
  TC1  Happy path (AC[N]: [AC text]):
  ```sql
    EXEC [Schema].[usp[Entity][Action]]
        @TenantId = [test tenant ID from seed data / CONTEXT.md],
        @[Param1]  = [test value],
        @[Param2]  = [test value]
  ```
  Expected: [N rows returned / "1 row(s) affected" / @OutputParam = value]
  Proof: Paste SSMS result grid or Messages tab output here 
  
  TC2  Tenant isolation (wrong tenant must return 0 rows):
  ```sql
    EXEC [Schema].[usp[Entity][Action]]
        @TenantId = 99999,
        @[Param1]  = [same test value]
  ```
  Expected: 0 rows / "0 row(s) affected"  NEVER another tenant's data
  Proof: Paste SSMS result showing 0 rows here 
  
  TC3  Soft-delete filter (deleted records excluded):
  ```sql
    -- Step 1: mark a row deleted
    UPDATE [Schema].[TableName] SET IsDeleted=1, DeletedAt=GETUTCDATE()
    WHERE Id=[test row ID] AND TenantId=[test tenant ID]
    -- Step 2: re-run TC1
    EXEC [Schema].[usp[Entity][Action]] @TenantId=[test tenant ID], @[Param1]=[test value]
  ```
  Expected: Deleted row does NOT appear in results
  Proof: Paste result showing row excluded here 
  
  TC4  NULL / boundary parameter handling:
  ```sql
    EXEC [Schema].[usp[Entity][Action]]
        @TenantId = NULL,
        @[Param1]  = [test value]
  ```
  Expected: Error or 0 rows  NULL TenantId must NEVER return another tenant's data
  Proof: Paste SSMS Messages or result showing error / 0 rows here 
  

  
  
     MANUAL TESTING REQUIRED  ALL TCs ARE MANDATORY             
  
    Every TC above MUST be tested. No TC may be skipped.           
    /swd-next (next layer) is BLOCKED until proof is submitted. 
    /swd-submit is BLOCKED until proof is submitted.              
                                                                    
    Run: /swd-manual-testing  paste proof for every TC         
  
  

---

### IF LAYER = Repository

  
  MANUAL TESTING  Repository: [ClassName]
  Story: [ID]  [Title] | ADO Task: [ID] | ACs: [list]
  

  This layer is covered by automated unit tests  no manual UI or DB steps needed.

  Run tests now:
    dotnet test --filter "[ClassName]Tests" --verbosity normal

  Expected output (look for this line):
    Passed! - Failed: 0, Passed: [N], Skipped: 0, Total: [N]

  All [N] test methods must be green :
  [List each test method name from the branch list]
  - AC1_[Method]_[Condition]_[Result]
  - AC2_[Method]_[Condition]_[Result]
  - [Method]_WrongTenant_ReturnsNull
  - [Method]_SoftDeleted_Excluded

  Proof: Paste the full dotnet test output (including the Passed!/Failed: line) here 

  
  
     MANUAL TESTING REQUIRED  ALL TCs ARE MANDATORY             
  
    Every TC above MUST be tested. No TC may be skipped.           
    /swd-next (next layer) is BLOCKED until proof is submitted. 
    /swd-submit is BLOCKED until proof is submitted.              
                                                                    
    Run: /swd-manual-testing  paste proof for every TC         
  
  

---

### IF LAYER = Service

  
  MANUAL TESTING  Service: [ClassName]
  Story: [ID]  [Title] | ADO Task: [ID] | ACs: [list]
  

  This layer is covered by automated unit tests  no manual UI steps needed.

  Run tests now:
    dotnet test --filter "[ClassName]Tests" --verbosity normal

  Expected output:
    Passed! - Failed: 0, Passed: [N], Skipped: 0, Total: [N]

  All [N] test methods must be green :
  [List each test method from branch list]
  - AC1_[Method]_ValidInput_Returns[Result]
  - AC2_[Method]_RepoReturnsNull_ThrowsNotFoundException
  - [Method]_InvalidInput_ThrowsValidationException
  - [Method]_Write_CommitsUoWOnce
  - [Method]_Entry_LogsInfo

  Proof: Paste the full dotnet test output here 

  
  
     MANUAL TESTING REQUIRED  ALL TCs ARE MANDATORY             
  
    Every TC above MUST be tested. No TC may be skipped.           
    /swd-next (next layer) is BLOCKED until proof is submitted. 
    /swd-submit is BLOCKED until proof is submitted.              
                                                                    
    Run: /swd-manual-testing  paste proof for every TC         
  
  

---

### IF LAYER = Endpoint

  
  MANUAL TESTING  Endpoint: [METHOD] /api/[route]
  Story: [ID]  [Title] | ADO Task: [ID] | ACs: [list]
  

  TOOL: Swagger UI  https://localhost:[port from appsettings]/swagger
        OR Postman / VS Code REST Client

  PREREQUISITES:
  [ ] Run API:        dotnet run --project src/[Project]/[Project].csproj
  [ ] Swagger loaded: https://localhost:[port]/swagger  (confirm 200 in browser)
  [ ] DB migration:   dotnet ef database update  (only if this subtask adds a migration)
  [ ] Test data:      [describe any seed records needed  e.g. "at least 1 active [Entity] for tenant"]

  
  STEP A  Get auth token (required for all TCs below):
    In Swagger  POST /api/auth/login
    Request body:
      { "email": "[test user email  see README or seed script]", "password": "[seed password]" }
    Copy the "token" field from the 200 response.
    Click "Authorize" button  paste: Bearer [your token]
  
  TC1  Happy path (AC[N]: [AC text]):
    [METHOD] /api/[route]
    [If POST/PUT  request body:]
      {
        [paste minimal valid JSON derived from [Feature]RequestDto fields]
      }
    Expected: HTTP [200 / 201 / 204]
    Response should contain: [key fields  Id, Status, Name, etc. derived from ResponseDto]
    Proof: Paste the full Swagger response (status line + body) here 
  
  TC2  Validation error (AC[N] boundary / missing required field):
    Same as TC1 but: remove [required field] from body OR set [field] = [invalid value]
    Expected: HTTP 400
    Response: { "errors": { "[fieldName]": ["[validation message from validator]"] } }
    Proof: Paste the 400 response here 
  
  TC3  Unauthorized (no auth header):
    Click "Authorize"  Logout (clear token)
    Repeat TC1 request
    Expected: HTTP 401 Unauthorized
    Proof: Paste the 401 response here 
  
  TC4  Tenant isolation (wrong tenant must see nothing):
    Log in as a user from a DIFFERENT tenant (use a second test account)
    Attempt [GET/PUT/DELETE] on a resource owned by the first tenant
    Expected: HTTP 404 Not Found  (data from other tenant must NOT be visible)
    Proof: Paste the 404 response here 
  
  [IF GET endpoint  include TC5:]
  TC5  Soft-delete filter:
    In SSMS/DbTool: UPDATE [Schema].[TableName] SET IsDeleted=1 WHERE Id=[testId]
    Call GET /api/[route]/[testId]  OR  GET /api/[route] list
    Expected: 404 Not Found (by-id)  OR  deleted record absent from list
    Proof: Paste response showing record is absent here 
  

  
  
     MANUAL TESTING REQUIRED  ALL TCs ARE MANDATORY             
  
    Every TC above MUST be tested. No TC may be skipped.           
    /swd-next (next layer) is BLOCKED until proof is submitted. 
    /swd-submit is BLOCKED until proof is submitted.              
                                                                    
    Run: /swd-manual-testing  paste proof for every TC         
  
  

---

### IF LAYER = Component

  
  MANUAL TESTING  Component: [ComponentName]
  Story: [ID]  [Title] | ADO Task: [ID] | ACs: [list]
  

  TOOL: Browser (Chrome recommended  DevTools needed for TC4/TC5)

  PREREQUISITES:
  [ ] API running:      dotnet run  (backend  terminal 1)
  [ ] Frontend running: ng serve    (terminal 2)
  [ ] App URL:          https://localhost:[angularPort]/[route from UI-DESIGN.md]
  [ ] Log in as:        [role from SRS ACs]  email: [seed email] / password: [seed password]
  [ ] Test data:        [describe records needed  e.g. "at least 3 [Entity] rows for test tenant"]

  
  TC1  Data loads correctly (AC[N]: [AC text]):
    1. Navigate to https://localhost:[angularPort]/[route]
    2. Wait for loading to complete (spinner disappears)
    Expected: [list/table/form] displays with correct data  no error messages
    Proof: Browser screenshot of loaded state  capture the [list/table/chart] 
  
  TC2  Empty state (no data exists):
    1. Use a fresh test tenant with 0 [Entity] records
       OR temporarily delete all records: DELETE FROM [Schema].[TableName] WHERE TenantId=[emptyTenantId]
    2. Log in as the empty tenant and navigate to [route]
    Expected: "[Empty state message from component]" visible  NOT a blank screen, NOT an error
    Proof: Browser screenshot showing empty state message 
  
  TC3  Error state (API unavailable):
    1. Stop the API (Ctrl+C the dotnet run process)
    2. Navigate to (or hard-refresh) https://localhost:[angularPort]/[route]
    Expected: Error message / "Something went wrong" visible  NOT a blank white screen
    Proof: Browser screenshot showing error state 
    (Restart the API after this test: dotnet run)
  
  TC4  Loading state:
    1. Open Chrome DevTools (F12)  Network tab  Throttling dropdown  "Slow 3G"
    2. Hard-refresh the page (Ctrl+Shift+R)
    Expected: Spinner or skeleton loader visible while data is loading
    Proof: Browser screenshot showing loading indicator 
    (Restore to "No throttling" after this test)
  
  [IF component has user actions  include TC5:]
  TC5  User action (AC[N]: [AC text]):
    1. [Exact steps: click "[button label]" / fill "[field label]" with "[value]" / submit form]
    2. Open DevTools  Network tab  confirm [METHOD] /api/[route] was called with status [200/201]
    Expected: [describe outcome  record created in list, navigation, success toast shown]
    Proof: Browser screenshot OR Network tab capture showing the API call 
  

  
  
     MANUAL TESTING REQUIRED  ALL TCs ARE MANDATORY             
  
    Every TC above MUST be tested. No TC may be skipped.           
    /swd-next (next layer) is BLOCKED until proof is submitted. 
    /swd-submit is BLOCKED until proof is submitted.              
                                                                    
    Run: /swd-manual-testing  paste proof for every TC         
  
  

---

### IF LAYER = Frontend Service

  
  MANUAL TESTING  Frontend Service: [ServiceName]
  Story: [ID]  [Title] | ADO Task: [ID] | ACs: [list]
  

  This layer is covered by automated unit tests.

  Run tests now:
    ng test --include=src/app/[feature]/[name].service.spec.ts --watch=false

  Expected output:
    SUMMARY: [N] tests completed, 0 failed

  All [N] test methods must pass :
  [List each test method from the branch list]
  - [Method]_CorrectHttpMethod_Url
  - [Method]_RequestBodyMatchesDto
  - [Method]_ReturnsResponseDto_OnSuccess
  - [Method]_PropagatesError_On4xx

  Proof 1: Paste the ng test summary output here 

  INTEGRATION VERIFICATION (if component also built this session):
    Start frontend: ng serve
    Navigate to: https://localhost:[angularPort]/[route]
    Expected: Component loads and service data appears (confirms service wires up correctly)
  Proof 2: Browser screenshot of component loaded with data from this service 

  
  
     MANUAL TESTING REQUIRED  ALL TCs ARE MANDATORY             
  
    Every TC above MUST be tested. No TC may be skipped.           
    /swd-next (next layer) is BLOCKED until proof is submitted. 
    /swd-submit is BLOCKED until proof is submitted.              
                                                                    
    Run: /swd-manual-testing  paste proof for every TC         
  
  

---

## STEP 7.5  Reset manual testing gate

After outputting the manual testing instructions above, run via Bash tool:

  $statePath = '.claude/session.state'
  if (-not (Test-Path $statePath)) {
    $s = [PSCustomObject]@{}
  } else {
    $raw = Get-Content $statePath -Raw -ErrorAction SilentlyContinue
    $s = if ($raw) { try { $raw | ConvertFrom-Json } catch { [PSCustomObject]@{} } } else { [PSCustomObject]@{} }
  }
  $s | Add-Member -NotePropertyName 'work_done'           -NotePropertyValue $true  -Force
  $s | Add-Member -NotePropertyName 'manual_testing_done' -NotePropertyValue $false -Force
  $s | ConvertTo-Json -Depth 10 | Set-Content $statePath -Encoding utf8
  if (-not $) { Write-Warning "GATE RESET FAILED  manually set manual_testing_done: false in .claude/session.state" }

This resets the gate so STEP 1 will block the next /swd-next call until
/swd-manual-testing sets manual_testing_done = true.

---

## STEP 7.6  Layer abandonment (if needed)

If issues are found that cannot be fixed without restarting the layer:

  Type: abandon layer

  On receiving "abandon layer":
  1. List all files created this session for this layer.
  2. Confirm: "Delete these files and reset the gate (yes/no)"
  3. On yes: delete the listed files, then run:
       $statePath = '.claude/session.state'
       $s = Get-Content $statePath -Raw | ConvertFrom-Json
       $s | Add-Member -NotePropertyName 'work_done' -NotePropertyValue $false -Force
       $s | ConvertTo-Json -Depth 10 | Set-Content $statePath -Encoding utf8
  4. Output: "Layer abandoned. Run /swd-next [layer] to restart."

---

## STEP 8  Story completion check

Check docs/BREAKDOWN.md for this story. Are ALL subtask rows now 

If YES  all subtasks complete:
  Output:
    STORY-END GATE CHECK
    All subtasks   this story may be complete.
    Submit manual testing proof: /swd-manual-testing
    Then run: /swd-review  it validates ACs and sets lead approval.
    After /swd-review passes: run /swd-submit to commit and checkpoint.
  Wait  do not run /swd-submit automatically.

If NO  subtasks remain:
  Output:
    Tests green. Next subtask: [name from BREAKDOWN.md].
    Submit manual testing proof first: /swd-manual-testing
    Then run: /swd-review to validate ACs, then /swd-submit to commit this subtask.

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


