# CLAUDE.md — SmartWorkz Complete Development Protocol
# Version: 2.1 | SRS-driven stack, ErrorResponse DTO, pagination, Angular standalone
# Owner: Tech Lead only — changes via PR, never direct commit

---

## 1. IDENTITY & ROLE

You are a senior developer at SmartWorkz Technologies.
Your active tech stack is defined entirely by the STACK CONFIRMED block in docs/SRS.md.
Never apply any technology, framework, pattern, or library not declared in that block.
You follow this protocol exactly. No deviation. No improvisation.
When in doubt — stop and ask. Never assume.

---

## 2. STACK (always read from SRS — never hardcode here)

Stack is the single source of truth from docs/SRS.md.

### How Claude reads the stack at session start

1. Read `docs/SRS.md` and locate the block labelled **STACK CONFIRMED**.
2. Extract every technology listed there — treat those values as the authoritative stack.
3. For each category below that is NOT defined in the SRS: STOP. List the missing item
   as a question and wait for tech lead to answer before writing any code.
4. Never invent or assume a technology choice not stated in the SRS.

### Stack categories Claude must confirm from SRS

  Backend       : [read from SRS]
  Frontend      : [read from SRS]
  Database      : [read from SRS]
  ORM           : [read from SRS]
  Cloud         : [read from SRS]
  Auth          : [read from SRS]
  Logging       : [read from SRS]
  Tests         : [read from SRS]
  Namespace     : [read from SRS]
  DB Schema     : Core | Auth | [Feature]   (no dbo — PascalCase schema = bounded context)
  SP Prefix     : usp
  Branch        : feature/[ADO-task-id]-[short-name]
  SRS Ver       : [read git tag from SRS header — e.g. SRS-v1.0]
  Approved NuGet: [read from SRS — Claude must never add a package not listed here]
  Approved npm  : [read from SRS — Claude must never add a package not listed here]

### Stack question protocol

If SRS does not define a required category, output:

  STACK GAP FOUND:
  Category : [e.g. Caching layer]
  SRS says : [nothing / ambiguous]
  Question : [specific question — e.g. "Should we use Redis or in-memory cache?"]
  Blocked  : Claude will not proceed until this is answered and SRS is updated.

After tech lead answers: update the SRS under the STACK CONFIRMED block, commit with
tag SRS-vX.X, then resume.

### Approved package rule

Claude must NEVER add a NuGet or npm package not listed in the SRS Approved list.
If a task requires a new package: output a STACK GAP FOUND block, stop, and wait.

---

## 3. SRS VERSION CONTROL

- SRS lives in git at ./docs/SRS.md
- Every SRS change = a new version tag: SRS-v1.0, SRS-v1.1 etc.
- Every ADO task references the SRS version it was built from
- ALWAYS read the tagged SRS version — never HEAD if task was created from older version
- If SRS has changed since the task was created: STOP. Flag to tech lead before proceeding
- If SRS changes after docs/BREAKDOWN.md is "In ADO": assess impact. Stories that reference the changed
  section may need a mini-breakdown (§27). Tech lead decides scope before work continues.

---

## 4. PSEUDO CODE PROTOCOL

When SRS contains a block labelled "PSEUDO CODE — [MethodName]([params]):":

STEP 1 — Read the full pseudo code block before writing anything
STEP 2 — List every ambiguity, missing definition, or unclear condition as questions
STEP 3 — Wait for answers. Never assume.
STEP 4 — After approval: translate line-by-line. No interpretation. No optimisation.
STEP 5 — Add ONLY: null guards, ArgumentNullException, domain exceptions, ILogger calls
STEP 6 — Do NOT add: caching, retries, extra validation, performance tricks not in pseudo code
STEP 7 — After writing code: output plain-English explanation (see §5)
STEP 8 — After plain-English approved: list all branches (see §10)

KEYWORD MAPPING:
  IF / ELSE IF / ELSE / END IF  →  if / else if / else
  FOR / END FOR                 →  foreach
  WHILE / END WHILE             →  while
  RETURN                        →  return
  THROW ERROR "[msg]"           →  throw new [DomainException]("[msg]")
  CALL [Service].[Method]       →  injected dependency, constructor-injected

VARIABLE NAMING:
  pseudo code names    →  PascalCase C# properties
  pseudo constants     →  private const in the class

COMPLEXITY RULE — pseudo code is REQUIRED when method has:
  - More than 2 IF conditions, OR
  - Calls more than 2 external services, OR
  - Involves financial / scoring / ranking calculation, OR
  - Has loops with conditional logic inside

Simple CRUD (Get / GetAll / Create / Update / Delete) = no pseudo code needed

---

## 5. PLAIN-ENGLISH TRANSLATION CHECK

After every pseudo code translation, before build:

Output this block:
  TRANSLATION CHECK:
  Method: [MethodName]
  What it does: [2-3 sentence plain English]
  Inputs: [list]
  Outputs: [list]
  Branches: [list each decision point in plain English]
  Edge cases handled: [list]

Wait for human to say "translation approved" before proceeding to build.

---

## 6. CONTEXT RESET PROTOCOL (CONTEXT.md)

Every 10 turns, write a checkpoint to CONTEXT.md using EXACTLY this format:

  CONTEXT CHECKPOINT
  Story     : [ADO Story ID] — [Story Title]
  SRS Ver   : [SRS-vX.X]
  Updated   : [YYYY-MM-DD HH:MM]
  Turn      : [N]

  ### Subtask in progress
  [Current subtask name and ADO task ID]

  ### Files created this story
  - [path/to/file.cs] — [what it does]

  ### Files modified this story
  - [path/to/file.cs] — [what changed]

  ### Key decisions made (max 5)
  1. [Decision] — [brief reason]

  ### Patterns used
  - [e.g. Repository pattern via IRepository]

  ### AC coverage so far
  - AC1: [covered / in progress / not started]

  ### Next subtask
  [Name of next subtask]

  ### Open questions / blockers
  - [Any unresolved questions]

New session ALWAYS reads CONTEXT.md before CLAUDE.md.
CONTEXT.md is per-story — committed to git — reset when story is marked Done in ADO.

---

## 7. SESSION START SEQUENCE

Every new Claude Code session:

1. Read CONTEXT.md (if exists for this story)
2. Read CLAUDE.md (this file)
3. Read docs/SRS.md — locate STACK CONFIRMED block and extract the full tech stack.
   If any stack category is missing or ambiguous: output STACK GAP FOUND (see §2) and stop.
3.5. Read docs/BREAKDOWN.md — check the Status field.
   If Status is not "In ADO", "In Progress", or "Done":
     Output "DEVELOPMENT BLOCKED — SRS breakdown not complete. Run /swp-plan first."
     Stop. Do not proceed to step 4.
   Exception: if the session purpose IS the breakdown itself (/swp-plan running), continue.
4. Read DECISIONS.md
5. Read ENTITIES.md
6. Scan existing codebase for files related to this task (see §8)
7. Confirm: "Ready. Working on [task]. Stack confirmed from SRS-vX.X. docs/BREAKDOWN.md: [Status]. Files I will touch: [list]. Files I will NOT touch: [list]."
8. Wait for approval before writing any code

---

## 8. CODEBASE SCAN — BEFORE EVERY TASK

First action for every task:
  "Scanning codebase for existing implementations related to [task name]..."

Search for:
  - Similar method names already implemented
  - Existing base classes that should be inherited
  - Existing services that should be called, not duplicated
  - Existing DTOs that should be reused
  - Relevant entries in ENTITIES.md

Output:
  SCAN RESULT:
  Reusing: [list of existing files/methods to reuse]
  Creating: [list of new files]
  NOT touching: [list of in-scope but excluded files]

Never duplicate existing logic. Always extend/reuse first.

---

## 9. EXECUTION RULES (STRICT)

1. ONE subtask at a time — never combine two subtasks into one response
2. After each file written: STOP. Output "Run: [build command]"
3. Wait for build confirmation before writing tests
4. Wait for test confirmation before commit output
5. Never modify files outside current subtask scope
6. If build fails: fix ONLY the failing error. List exact lines changed.
7. If 3+ build errors after a fix attempt: DISCARD all changes for this subtask.
   Output: "DISCARD — starting subtask fresh with narrower scope"
   Use git stash drop, not git stash apply
8. Never push to main or develop directly — feature branches only
9. Session length limit — context drift prevention (SRS §1.3 defines drift starts at turn 15):
   Turn 15 : output "TURN 15 CHECKPOINT — complete this subtask then run /swd-submit and start a new Claude Code session."
   Turn 20 : STOP all implementation immediately. Write CONTEXT.md via /swd-submit. Output "TURN 20 HARD STOP — context limit. Start a new session now and paste CONTEXT.md as first message."

---

## 10. UNIT TEST PROTOCOL

Framework: xUnit + Moq (.NET) | Jest + jasmine (Angular)
NO integration tests. NO WebApplicationFactory. NO test DB.
NO docker-compose for tests. NO real HTTP calls. NO file system.

After every implementation and before writing tests:

  BRANCH LIST:
  From pseudo code / business logic, every branch to test:
  1. [condition] → [expected result]
  2. [condition] → [expected result]
  ...

Human selects which branches to cover.
Human writes test case requirements in plain English.
Claude writes xUnit + Moq code from those requirements. Never invents cases.

Every test:
  - Arrange: mock ALL dependencies with Moq / TestBed
  - Act: call the single method under test
  - Assert: verify output OR verify exception thrown

Test method naming:
  [MethodName]_[Condition]_[ExpectedResult]
  e.g. CalculateScore_AllCorrectAnswers_ReturnsFullMarksGradeA

Test file location:
  .NET  : Tests/[Layer]/[ClassName]Tests.cs
  Angular: src/app/[feature]/[component].spec.ts

---

## 11. AC TRACEABILITY CHECK

After every task implementation, before git commit:

  AC TRACEABILITY:
  AC1: [text] → covered by [MethodName] → tested by [TestMethodName]
  AC2: [text] → covered by [MethodName] → tested by [TestMethodName]
  AC3: [text] → NOT covered → needs subtask: [description]

No commit until every AC is either covered or a new subtask is created for it.

---

## 12. SECRETS & ENVIRONMENT CONFIG

NEVER write real values in any config file.
Always use placeholder: "YOUR_VALUE_HERE" or reference env var.

  appsettings.json:
    "ConnectionStrings": { "Default": "YOUR_CONNECTION_STRING" }
    "Jwt": { "Secret": "YOUR_JWT_SECRET" }

Real values come from:
  Local dev    : appsettings.local.json (in .gitignore)
  Staging/Prod : AWS Secrets Manager / Azure Key Vault

.gitignore MUST include before first commit:
  appsettings.local.json
  appsettings.*.local.json
  .env.local
  *.user

---

## 13. BRANCH STRATEGY

  main       → production only. No direct commits. PR + approval required.
  develop    → integration branch. All feature PRs merge here.
  feature/*  → one branch per ADO story. Format: feature/[task-id]-[name]
  hotfix/*   → production bug fixes only. Merge to main AND develop.
  release/*  → sprint release candidates. Merge to main when approved.

Branch naming: feature/EXAM-42-question-import

Commit type vocabulary — use the correct prefix every time:

  | Prefix          | When to use                                          |
  |-----------------|------------------------------------------------------|
  | feat(ID):       | New feature or capability                            |
  | fix(ID):        | Bug fix                                              |
  | chore(ID):      | Build config, tooling, dependency update             |
  | refactor(ID):   | Code change with no behaviour change                 |
  | test(ID):       | Test-only changes                                    |
  | docs(trigger):  | README, CHANGELOG, DECISIONS.md, ENTITIES.md updates |
  | hotfix(ID):     | Production bug fix (merges to main AND develop)      |

  Commit message format: [type]([scope]): [description] — AC[n]
  Example: feat(EXAM-42): add question import service — AC1

---

## 14. STORED PROCEDURE WORKFLOW
### Applies when: SRS STACK CONFIRMED specifies SQL Server, PostgreSQL, MySQL, or Oracle with stored procedure support. If SRS stack uses a different data access pattern, adapt the principles (versioned DB scripts, no inline SQL, tenant/soft-delete filters) to that pattern.

### Schema design — bounded contexts

Every project uses schema-based table grouping. No project tables live in dbo.

  | Schema    | Owns                                              | Notes                        |
  |-----------|---------------------------------------------------|------------------------------|
  | Core      | Tenants, AuditLogs, Config                        | Shared infra — never feature |
  | Auth      | Users, Roles, UserRoles, RefreshTokens            | Identity — separate from biz |
  | [Feature] | Feature-specific tables (Exam, Sport, Blog, etc.) | One schema per domain/Epic   |

  EF Core model configuration (required for every entity):
    modelBuilder.Entity<User>().ToTable("Users", "Auth");
    modelBuilder.Entity<Tenant>().ToTable("Tenants", "Core");
    modelBuilder.Entity<Question>().ToTable("Questions", "Exam");

  GRANT EXECUTE ON SCHEMA::[Feature] TO [AppUser]  ← one permission per schema

### SP naming — [Schema].usp[Entity][Action]

  Format   : [Schema].usp[Entity][Action]   (PascalCase schema, entity-first, action-last)
  Location : ./Database/StoredProcedures/[Schema]/usp[Entity][Action].sql

  CORRECT:
    Auth.uspUserGetById          Auth.uspUserInsert
    Auth.uspUserUpsert           Core.uspAuditLogInsert
    Exam.uspQuestionInsert       Exam.uspExamGetPagedByTenant

  WRONG — never use verb-first, dbo prefix, or lowercase schema:
    spGetUser         spInsertUser         dbo.uspUserInsert    auth.uspUserInsert

  Why entity-first matters: in SSMS Object Explorer all User SPs sort together
  under Auth.uspUser* — interns and reviewers see all operations for an entity
  in one place. Verb-first (spGetUser) scatters operations across the list.

Deploy    : via EF Core migration as raw SQL (MigrationBuilder.Sql)
           Alternative (no EF): numbered scripts in ./Database/Migrations/ run by DbUp
Testing   : IRepository mocked in unit tests — SP never called in tests
Always use CREATE OR ALTER PROCEDURE — never DROP and CREATE

Every SP file structure:
  -- =============================================
  -- SP   : [Schema].usp[Entity][Action]
  -- Desc : [what it does]
  -- Auth : Claude Code | [task-id]
  -- Date : [date]
  -- =============================================
  CREATE OR ALTER PROCEDURE [Schema].[usp[Entity][Action]]
      @TenantId  INT,
      @Param1    [type],
      ...
  AS
  BEGIN
      SET NOCOUNT ON;
      -- implementation
  END

### Read strategy — when to use each approach

  EF Core LINQ  : single-entity lookup, simple filtered list, navigation includes
  SP (read)     : multi-join reports, dashboard queries, pagination with total count,
                  any projection that maps to a non-entity DTO
  Raw SQL string: NEVER — zero raw SQL strings in any C# file — SP or EF only

### Upsert rule

  Use [Schema].usp[Entity]Upsert (SQL MERGE) when:
    - The same code path may create OR update depending on row existence
    - Sync / import scenarios where caller does not know if the row exists
  Keep separate Insert / Update when:
    - Audit requires distinguishing create from edit
    - Different validation or business rules apply to create vs update
  Repository interface: Task<int> UpsertAsync([Entity]UpsertDto dto)
  NEVER write both Insert AND Update for a scenario that is inherently an upsert

---

## 15. TRANSACTION / UNIT OF WORK RULE

Any operation writing to MORE THAN ONE table MUST be wrapped in a transaction.

### Pattern A — EF Core writes (simple CRUD via EF entity tracking)
  → IUnitOfWork wraps DbContext
  → Never call SaveChanges inside a loop
  → Never call SaveChanges in a repository — only in service layer via UoW.CommitAsync()

### Pattern B — Stored Procedure writes (default for complex logic)
  → IUnitOfWork wraps IDbConnection + IDbTransaction
  → Repositories accept the transaction as a parameter
  → Service layer: begin → call repos → commit (or rollback on exception)
  → Never commit the transaction inside a repository method

### Which to use
  Single-table simple create/read/update/delete with no business logic → Pattern A
  Multi-table write, complex business logic, SP-driven writes → Pattern B
  NEVER mix both patterns in the same service method

---

## 16. ERROR HANDLING

All error messages → reference ErrorCodes.cs constants. Never hardcode strings.

  public static class ErrorCodes
  {
      public const string UserNotFound     = "USER_NOT_FOUND";
      public const string InvalidInput     = "INVALID_INPUT";
      public const string ExamNotActive    = "EXAM_NOT_ACTIVE";
  }

Exception hierarchy:
  BaseException (base)
    → ValidationException
    → NotFoundException
    → BusinessRuleException
    → UnauthorisedException

### Standard ErrorResponse DTO

All exceptions caught by GlobalExceptionMiddleware return this exact shape. Never invent
a different error response structure.

  public sealed record ErrorResponse
  {
      public string  Code             { get; init; }  // ErrorCodes.cs constant
      public string  Message          { get; init; }  // human-readable, no stack trace
      public string  CorrelationId    { get; init; }  // from X-Correlation-Id header
      public IDictionary<string, string[]>? ValidationErrors { get; init; }
          // populated only for ValidationException — field name → error messages
  }

### HTTP status mapping (GlobalExceptionMiddleware)

  ValidationException     → 400 Bad Request         + ValidationErrors populated
  NotFoundException       → 404 Not Found
  BusinessRuleException   → 422 Unprocessable Entity
  UnauthorisedException   → 401 Unauthorized
  Any other exception     → 500 Internal Server Error

### Error logging rule (mandatory)

Before returning any error response, GlobalExceptionMiddleware MUST log:

  Log level : Error for 5xx | Warning for 4xx
  Fields    : CorrelationId, TenantId, UserId, exception type, ErrorCodes constant,
              full exception object (message + stack trace)
  Rule      : NEVER log passwords, OTPs, payment card numbers, or raw JWT tokens
  Rule      : The Message field in ErrorResponse must NEVER contain an internal stack trace

---

## 17. FRONTEND ARCHITECTURE
### Applies when: SRS STACK CONFIRMED specifies a frontend framework. Rules below cover Angular (standalone), React (functional), and Vue (Composition API). The state management and HTTP service principles apply to all frontends regardless of framework.

### Component model — standalone only

All Angular components are standalone. NgModule is PROHIBITED.

  @Component({ standalone: true, imports: [...], ... })
  export class MyComponent { }

Never generate an NgModule. Never add a component to a module declarations array.
Lazy-loaded feature routes use loadComponent() not loadChildren() with a module.

### State management

  Complex shared state (auth, user profile, notifications) → NgRx
  Feature-local state (form state, list filters)           → Service + BehaviorSubject
  Simple one-time data (dropdowns, config)                 → Direct HTTP call in component

Never mix state patterns within the same feature module.

### HTTP services

  All methods return Observable<T> — never subscribe inside a service.
  Use HttpClient — never fetch() or XMLHttpRequest directly.

---

## 18. CODING CONVENTIONS

- async/await everywhere — zero synchronous DB or HTTP calls
- Repository pattern — no EF DbContext in controllers or services
- DTOs for all API boundaries — never expose EF entity models
- Stored procedures for ALL DB writes — no EF inserts, no raw SQL strings anywhere
- No raw SQL strings in any C# file — reads use EF LINQ or SP, writes use SP always
- Schema-qualified table and SP names everywhere — never reference dbo or unqualified names
- ILogger<T> injected — structured log at Info entry/exit, Error on exception
- No magic numbers — use named constants or config
- No commented-out code — delete it
- No Console.WriteLine or console.log in committed code
- No TODO comments — raise an ADO task instead

### Multi-tenancy filter rule
  EVERY query against a tenant-scoped table MUST include:
    .Where(x => x.TenantId == _currentTenant.TenantId)   ← EF Core
    or @TenantId parameter in every SP                    ← Stored Procedures
  Missing this filter is a security defect — it exposes cross-tenant data.
  Claude must add the filter automatically. Never assume a caller has pre-filtered.

### Soft delete filter rule
  EVERY query MUST exclude soft-deleted rows:
    .Where(x => !x.IsDeleted)                             ← EF Core
    or WHERE IsDeleted = 0 in every SP read               ← Stored Procedures
  Hard deletes are PROHIBITED — use IsDeleted = 1 via usp[Entity]Delete only.

### Structured log fields (required on every log entry via Serilog enrichment)
  TenantId      : resolved from JWT claim — add to LogContext at request start
  UserId        : resolved from JWT claim — null for anonymous requests
  CorrelationId : from X-Correlation-Id request header — generate GUID if absent
  Feature       : automatic from ILogger<T> (class name)

  Log levels:
    Information : method entry (inputs summarised) + exit (result summarised)
    Warning     : business rule rejection, validation failure, expected not-found
    Error       : all caught exceptions — log full exception object + inputs


### Pagination contract (every paged endpoint — no variations permitted)

  Request parameters:
    PageNumber : int — 1-based. Default: 1. Minimum: 1.
    PageSize   : int — Default: 20. Maximum: 100. Reject > 100 with ValidationException.

  Response wrapper — use this DTO for every paged result, no alternatives:
    public sealed record PagedResult<T>
    {
        public IReadOnlyList<T> Items       { get; init; }
        public int              TotalCount  { get; init; }
        public int              PageNumber  { get; init; }
        public int              PageSize    { get; init; }
        public int              TotalPages  => (int)Math.Ceiling((double)TotalCount / PageSize);
        public bool             HasNextPage => PageNumber < TotalPages;
    }

  SP convention for all paged queries:
    Parameters : @PageNumber INT, @PageSize INT, @TenantId INT
    Returns    : result set + COUNT(*) OVER() AS TotalCount on every row
### DTO validation rule
  Validate ALL DTOs at the API boundary using FluentValidation (project default).
  Never use DataAnnotations on DTOs — they cannot express cross-field rules.
  Validator class lives alongside the DTO: [DtoName]Validator.cs
  Register validators via AddValidatorsFromAssembly in Program.cs.
  Never write manual if/throw validation blocks where a validator already exists.

---

## 19. WHAT CLAUDE MUST NEVER DO

- Write more than one subtask at a time
- Skip the build or test confirmation step
- Invent unit test cases not specified by human
- Refactor code while fixing a bug
- Push directly to develop or main
- Add libraries/packages not in approved stack
- Write real secrets or connection strings in any file
- Duplicate a method or class that already exists
- Mark a task done if any AC is untraced
- Continue after 3+ build errors without discarding

---

## 20. DISCARD RULE

If build errors after fix attempt >= 3:
  1. Output "DISCARD TRIGGERED — 3 fix attempts failed"
  2. List root cause in one sentence
  3. git stash drop (discard all changes)
  4. Re-approach with narrower scope prompt
  5. Ask human to clarify scope before attempting again

---

## 21. PR DESCRIPTION TEMPLATE

Claude writes PR description at end of every story:

  ## What
  [1-2 sentences: what feature was built]

  ## Why
  ADO Story: [link]
  SRS Section: [section name + version]

  ## Changes
  - [file]: [what changed]
  - [file]: [what changed]

  ## AC Coverage
  - AC1: [covered / not covered]
  - AC2: [covered / not covered]

  ## How to test locally
  1. [step]
  2. [step]

  ## DB Migrations
  [Yes — run: dotnet ef database update] OR [No migrations]

  ## Checklist
  - [ ] Build passes
  - [ ] All unit tests pass
  - [ ] AC traceability complete
  - [ ] No secrets committed
  - [ ] DECISIONS.md updated if new decisions made
  - [ ] ENTITIES.md updated if new tables added
  - [ ] CONTEXT.md cleared and committed (story complete — final PR only)

---

## 22. ADO UPDATE BLOCK

After every task where tests pass, update ADO using the MCP tool (preferred) or the output block (fallback).

### Primary — ADO MCP tool (when MCP server is running)

Call:
  ado_update_item(
    id      = [Task ADO ID from docs/BREAKDOWN.md],
    state   = "Done",
    comment = "[what was built] | Tests: [N] passing | ACs: [covered list] | SRS: [version] | Commit: [hash]"
  )

Claude calls this directly — no developer action needed.
Then update the subtask row in docs/BREAKDOWN.md: change ⬜ to ✅ for the completed subtask.

### Fallback — ADO UPDATE block (when MCP server is not configured)

Output this block for tech lead to process via ado-update.ps1:

  ADO UPDATE:
  Work Item : [Task ID from docs/BREAKDOWN.md]
  Status    : Done
  Comment   : "[what was implemented, test count, AC refs covered]"
  Commit    : [commit message]
  SRS Ver   : [SRS version this was built from]

---

## 23. SESSION END SUMMARY

At end of every session, output:

  SESSION SUMMARY — [Date]
  Story    : [ADO story ID]
  Tasks done: [list]
  Files created: [list]
  Files modified: [list]
  Decisions made: [max 5 bullets]
  → Paste decisions into DECISIONS.md
  → git add DECISIONS.md && git commit -m "docs(decisions): [one-line summary]"
  Next session starts at: [subtask name]
  Open questions: [any blockers]

---

## 24. README & CHANGELOG UPDATE PROTOCOL

Every phase completion AND every story merge triggers a README + CHANGELOG update.
This is NOT optional. It is part of the definition of done for every phase and every story.

### WHEN to update

| Trigger                          | README update | CHANGELOG update | Commit type              |
|----------------------------------|---------------|------------------|--------------------------|
| Phase 0 complete (SRS finalised) | Yes           | Yes              | docs(phase-0): ...       |
| Phase 1 complete (Architecture)  | Yes           | Yes              | docs(phase-1): ...       |
| Phase 2 complete (Solution setup)| Yes           | Yes              | docs(phase-2): ...       |
| Phase 3 complete (ADO board)     | Yes           | Yes              | docs(phase-3): ...       |
| Every story merged to develop    | Yes           | Yes              | docs([story-id]): ...    |
| Every Epic closed                | Yes           | Yes              | docs(epic-[id]): ...     |
| Phase 6 deploy (each release)    | Yes           | Yes              | docs(release-vX.Y.Z): ...|
| Hotfix merged                    | No            | Yes              | docs(hotfix-[id]): ...   |
| CLAUDE.md updated                | No            | Yes              | docs(claude-md): ...     |

### README SECTIONS (always kept current)

README.md structure — Claude updates ONLY the relevant section, never rewrites the whole file:

  # [Product Name]
  > [one-line product description from SRS]

  ## Project Status
  [Phase badge + last updated date]

  ## Tech Stack
  [Exact stack from CLAUDE.md §2]

  ## Architecture
  [Folder structure — updated at Phase 2]

  ## Getting Started
  [Prerequisites, local setup steps — updated at Phase 2]

  ## Environment Setup
  [Env vars list — updated when new vars added]

  ## Features
  [Feature list with status: Planned / In Progress / Done — updated per Epic]

  ## API Reference
  [Key endpoints — updated per story that adds/changes endpoints]

  ## Database
  [Migration instructions — updated when new migrations added]

  ## Branch Strategy
  [GitFlow diagram — set at Phase 1, rarely changes]

  ## Contributing
  [How to use CLAUDE.md, PROMPTS.md, branch naming — set at Phase 2]

  ## Changelog
  [Link to CHANGELOG.md]

### CHANGELOG FORMAT (Keep-a-Changelog standard)

CHANGELOG.md structure:

  # Changelog
  All notable changes to this project will be documented here.
  Format: [Keep a Changelog](https://keepachangelog.com)

  ## [Unreleased]
  ### Added
  - [feature or capability added]
  ### Changed
  - [change to existing feature]
  ### Fixed
  - [bug fix]
  ### Removed
  - [removed feature]

  ## [v1.0.0] — YYYY-MM-DD
  ### Added
  - ...

### WHAT Claude writes per trigger

PHASE COMPLETION — Claude outputs:

  README UPDATE — Phase [N] complete:
  Section to update: [section name]
  New content:
  [exact markdown to replace/append in that section]

  CHANGELOG UPDATE — Phase [N] complete:
  Section: [Unreleased] → Added / Changed
  Entry: "[phase description — what is now true about the project]"

STORY MERGE — Claude outputs:

  README UPDATE — Story [ADO-ID] merged:
  Sections to update: Features (status change), API Reference (if endpoints added)
  Changes:
  - Features: "[Feature name]" status → Done
  - API Reference: [new endpoint if any]

  CHANGELOG UPDATE — Story [ADO-ID]:
  Section: [Unreleased] → Added / Changed / Fixed
  Entry: "[user-facing description of what was built]"

RELEASE / DEPLOY — Claude outputs:

  README UPDATE — Release v[X.Y.Z]:
  Section: Project Status
  New badge: ![Version](v[X.Y.Z]) | Released [date]

  CHANGELOG UPDATE — Release v[X.Y.Z]:
  Promote [Unreleased] → [v[X.Y.Z]] — [date]
  Reset [Unreleased] to empty

### GIT COMMIT for docs updates

Always committed separately from code changes:

  git add README.md CHANGELOG.md
  git commit -m "docs([trigger]): update README and CHANGELOG — Phase [N] / Story [ID] / Release [vX.Y.Z]"

Never bundle README/CHANGELOG changes into a feature commit.
Never rewrite README from scratch — patch only the relevant section.
CHANGELOG entries are always user-facing language — not technical jargon.

### VERSION NUMBERING (SemVer)

  MAJOR (X.0.0) — Breaking change: DB schema change affecting existing data,
                   API contract change, auth model change
  MINOR (0.X.0) — New Epic complete (new feature group delivered)
  PATCH (0.0.X) — Story complete (single feature or fix within an Epic)

  Phase 2 scaffold = v0.1.0 (first runnable skeleton)
  Phase 6 first deploy = v1.0.0 (first production release)
  Each subsequent Epic = v1.X.0
  Each hotfix = v1.X.Y

---

## 25. DEFINITION OF DONE

A subtask is Done when ALL of the following are true:

  Subtask DoD:
  - [ ] dotnet build passes with zero errors and zero warnings
  - [ ] dotnet test passes — all cases in the branch list green
  - [ ] AC traceability table output — every AC either covered or new subtask raised
  - [ ] Multi-tenancy filter present on every query touching tenant-scoped tables
  - [ ] Soft-delete filter present on every read query
  - [ ] No real secrets in any config file
  - [ ] No TODO comments — ADO task raised for anything deferred
  - [ ] /swd-submit subtask run — code committed with ADO task ID
  - [ ] ADO task marked Done automatically via /swd-submit (MCP ado_update_item call)
  - [ ] ENTITIES.md updated if a new table was created

A story is Done when ALL subtasks are Done AND:
  - [ ] All subtask DoD items satisfied
  - [ ] PR description written using §21 template
  - [ ] PR raised to develop and approved
  - [ ] /swd-submit story run — auto-updates README + CHANGELOG (separate docs commit)
  - [ ] DECISIONS.md updated with session decisions and committed
  - [ ] CONTEXT.md cleared and committed
  - [ ] ADO story status set to Done with PR link

---

## 26. ENFORCEMENT MECHANISMS

These mechanisms enforce CLAUDE.md rules at the tool level — they are not suggestions.

### .claude/settings.json — permission enforcement

File: \`.claude/settings.json\` (committed to repo, applies to all developers).

ALLOW list: pre-approved commands that Claude can run without prompting.
  dotnet* | ng* | npm* | git status/diff/log/add/commit | git push origin feature/* | pwsh ./commit.ps1 | pwsh ./ado-update.ps1

DENY list: commands Claude is PROHIBITED from running regardless of instruction.
  git push origin main/*   — enforces §13 branch strategy
  git push origin develop/* — enforces §13 branch strategy
  git push --force         — prevents destructive history rewrite
  git reset --hard         — prevents work loss
  git clean -f             — prevents unrecoverable deletion

If a task requires a denied command: Claude must STOP and tell tech lead.
Tech lead runs the command manually — Claude never bypasses the deny list.

### .claude/commands/ — slash command enforcement

Every prompt template from PROMPTS.md exists as a slash command in \`.claude/commands/\`.
Developers MUST use slash commands — never copy-paste from PROMPTS.md directly.
Slash commands embed the enforcement rules from CLAUDE.md inside the prompt.

| Slash command       | Phase | Enforces                                                                    |
|---------------------|-------|-----------------------------------------------------------------------------|
| /swp-validate       | 0     | Market size (TAM/SAM/SOM), problem-solution fit, MVP feasibility, founder fit, competitive analysis — GO/NO-GO/CONDITIONAL verdict + optional SRS generation |
| /swp-srs            | 0     | Stack completeness + story format + NFRs + feature gap analysis + Must/Good/Nice prioritization + phase roadmap — blocks until "SRS approved" |
| /swp-ui             | 1     | Screen inventory, wireframes, component hierarchy, routing, state plan — blocks until "UI approved" |
| /swp-db             | 1     | Schema assignment, table definitions, SP plan, migrations, ENTITIES.md rows — blocks until "DB approved" |
| /swp-arch           | 2     | Solution structure, project dependencies, base class inventory, middleware pipeline, DI plan — blocks until "architecture approved" |
| /swp-scaffold       | 2     | dotnet new sln/projects, project references, NuGet packages, base files scaffold, dotnet build must pass — blocks until build green |
| /swp-plan           | 3     | §27 SRS → Epic → Story → Task → ADO — phase gate                           |
| /swd-start          | 4+    | §7 session start + §8 scan + all layer rules + STEP 6: §10 branch list → tech lead picks cases → writes tests + STEP 7: story-end gate check |
| /swd-unit-test      | 4+    | Standalone only — backfill missing tests or hotfix tests outside normal session; §10 branch list + no invented cases |
| /swm-bug            | 4+    | §9 fix-only, no refactor + §20 discard after 3 failures + story-end gate check if last subtask |
| /swp-audit          | All   | Project-wide code quality + security (OWASP) + architecture audit — CLAUDE.md rules + multi-tenancy + soft-delete + AC traceability — auto-runs inside /swd-submit; use directly for pre-release or deep security reviews |
| /swd-submit           | 4+    | Auto-detects subtask/story type + inline review (security+N+1+perf+compliance+tenancy+ACs) + §13 commit format + §24 README/CHANGELOG + §22 ADO Done |
| /swp-sync           | 1–3   | Validate cross-doc consistency (SRS↔UI↔DB↔Arch) or cascade SRS changes to all design docs |

### Hooks — automated enforcement

| Hook event | Gate | Fires when | Blocks |
|------------|------|-----------|--------|
| SessionStart | — | New Claude session opens | Resets \`.claude/session.state\` to \`{}\` |
| PreToolUse(Write\|Edit) | A | Writing .cs/.ts/.sql/.py/.go file | Blocked if no active story (\`work_done\` not set) |
| PreToolUse(Bash) | D | Bash tool runs \`git commit\` | Blocked if no \`commit_token\` in session.state |
| PostToolUse(Write) | — | After every file write | Outputs: "ENFORCE §9: Run build now" |
| Stop | E | Claude session ends | Blocked if story active and \`wrap_done\` not set |
| .git/hooks/pre-commit | D (terminal) | Any \`git commit\` from terminal/IDE | Blocked if no \`commit_token\` — installed by \`setup.ps1\` |

Hooks provide hard blocks, not suggestions. They cannot be disabled per-session.
To modify hooks: tech lead edits \`.claude/settings.json\` via PR — never direct commit.

### session.state — gate tracker

File: \`.claude/session.state\` (gitignored — reset each SessionStart)

| Field | Set by | Purpose |
|-------|--------|---------|
| \`story_id\` | /swd-start | Active story ID — triggers Gate E check |
| \`work_done\` | /swd-start | Releases Gate A (code writes allowed) |
| \`tests_passed\` | /swd-submit | Releases Gate C (commit allowed) |
| \`commit_token\` | /swd-submit | One-time token for Gate D (consumed per commit) |
| \`wrap_done\` | /swd-submit | Releases Gate E (session end allowed) |
| \`mcp_fallback\` | /swd-start | Set when ADO unreachable — uses BREAKDOWN.md fallback |

### ADO MCP server — direct Azure DevOps integration

Registered in \`.claude/settings.json\` under \`mcpServers.smartworkz-ado\`.
Server: \`.claude/mcp-servers/ado/server.js\` — started automatically by Claude Code.
Reads config from: \`.claude/mcp-servers/ado/ado.local.json\` (per-project, git-ignored). Falls back to env vars \`ADO_PAT\`, \`ADO_ORG_URL\`, \`ADO_PROJECT\` for backward compatibility.

Tools Claude calls directly (no developer action required):

| Tool | When used |
|------|-----------|
| \`ado_create_epic\` | /swp-plan Level 5 — create each approved Epic |
| \`ado_create_story\` | /swp-plan Level 5 — create each approved Story |
| \`ado_create_task\` | /swp-plan Level 5 — create each approved Task |
| \`ado_update_item\` | After each subtask implementation — mark task Done |
| \`ado_get_item\` | Verify item exists before updating |
| \`ado_query_items\` | List open stories at session start |

Setup: \`Push-Location .claude/mcp-servers/ado; npm install; Pop-Location\` (one-time per machine).

### Rule hierarchy

1. .claude/settings.json deny list — hard block (tool level, cannot be overridden by prompt)
2. CLAUDE.md rules — Claude must follow these exactly
3. Slash command prompts — embed §-references so Claude applies rules automatically
4. Hooks — real-time reminders inside the session

Any conflict between these layers: deny list wins. Tech lead resolves conflicts via PR.

---

## 27. SRS BREAKDOWN PROTOCOL

Development is BLOCKED until the SRS → Epic → Story → Task → Subtask breakdown is complete,
tech-lead-approved, committed to docs/BREAKDOWN.md, and all items created in Azure DevOps.

This protocol runs ONCE per project, at the end of Phase 0, before Phase 1 begins.
It also runs when a new major Epic is added to an existing project.

### Why this gate exists

Skipping breakdown leads to: orphaned tasks, unmapped ACs, scope creep mid-sprint,
and Claude building features that were never formally approved.
The breakdown is the contract between the SRS and the codebase.

### The 5-level hierarchy

  Level 1 — Epic      : One bounded context / feature domain. Maps to one DB schema.
  Level 2 — Story     : One user-facing deliverable within an Epic. Max 3-5 days work.
                        Must have 2-5 acceptance criteria (ACs). Each AC is testable.
  Level 3 — Task      : One technical layer within a Story. One Task per layer.
  Level 4 — Subtask   : One file Claude writes in one session turn. Max 1 subtask per turn.
  Level 5 — ADO items : Created in Azure DevOps from the approved breakdown via ado-update.ps1.

### Standard task layers (adapt to SRS STACK CONFIRMED — omit layers not in stack)

  Task A — DB/Storage layer        : schemas, tables, stored procedures, migrations
  Task B — Data access layer       : repository interface + implementation
  Task C — Business logic layer    : service interface + implementation
  Task D — API layer               : controller, DTOs, FluentValidation validators
  Task E — Frontend layer          : component, frontend service, state
  Task F — Unit tests              : xUnit/Jest tests for Tasks B, C, and D
  Task G — Integration (Phase 5+) : added only when Phase 5 Quality Gates begin

  Stack-specific omissions (examples):
    API-only (no frontend in SRS) → omit Task E
    No SP-based DB in SRS         → omit SP subtasks from Task A
    Python/FastAPI stack           → Task D uses Pydantic models, not FluentValidation

### Approval gates — Claude STOPS at each level

  LEVEL 1 GATE: Claude outputs Epic list → tech lead says "epics approved" → Level 2 begins
  LEVEL 2 GATE: Claude outputs Story+AC list → tech lead says "stories approved" → Level 3 begins
  LEVEL 3 GATE: Claude outputs Task list per Story → tech lead says "tasks approved" → Level 4 begins
  LEVEL 4 GATE: Claude outputs Subtask list per Task → tech lead says "subtasks approved" → Level 5 begins
  LEVEL 5 GATE: Claude writes docs/BREAKDOWN.md + outputs Bootstrap-FeatureFromSrs PowerShell calls
                Tech lead runs ado-update.ps1 → ADO items created → IDs written back to docs/BREAKDOWN.md
                docs/BREAKDOWN.md committed with status "In ADO" → development may now begin

### docs/BREAKDOWN.md — the gate artifact

File: docs/BREAKDOWN.md — lives in the docs/ folder. Committed to git. Never deleted mid-project.
Status field controls whether development is permitted:

  Draft           : breakdown not yet approved
  Epic-Approved   : Level 1 gate passed
  Story-Approved  : Level 2 gate passed
  Task-Approved   : Level 3 gate passed
  Subtask-Approved: Level 4 gate passed
  In ADO          : Level 5 complete — ADO items exist — DEVELOPMENT MAY BEGIN
  In Progress     : active development sprint
  Done            : Epic complete, all stories merged

Claude MUST read docs/BREAKDOWN.md at session start (§7 step 3.5).
If docs/BREAKDOWN.md status is not "In ADO" or later: output "DEVELOPMENT BLOCKED — breakdown not complete" and stop.
Exception: the breakdown flow itself (/swp-plan command) may run before "In ADO" status.

### Rules during breakdown (before "In ADO")

- Claude MUST NOT write any implementation code (no .cs, .ts, .py, .go, .sql files)
- Claude MAY write docs/BREAKDOWN.md, ENTITIES.md rows, and schema design notes
- Claude MAY ask clarifying questions about the SRS
- Claude MUST NOT proceed to the next level without explicit approval keyword

### Rules after breakdown ("In ADO" or later)

- Every implementation subtask MUST reference an ADO Task ID from docs/BREAKDOWN.md
- No subtask may be started that does not appear in docs/BREAKDOWN.md
- Scope additions require a new breakdown cycle for the new story/epic (mini-breakdown)
- docs/BREAKDOWN.md is updated after each story completes: status changes to Done for that story

### Mini-breakdown for mid-project scope additions

When a new story is added to an existing Epic mid-project:
  1. Add the story to docs/BREAKDOWN.md (Status: Draft)
  2. Run /swp-plan for that story only (not full project)
  3. Gate: tech lead approves Story + Tasks + Subtasks
  4. Create ADO items via ado-update.ps1
  5. Status → In ADO → development may begin for that story

Never start coding a new story without completing the mini-breakdown first.