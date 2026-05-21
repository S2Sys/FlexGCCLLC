---
name: swp-srs
description: >-
  Review and finalize a Software Requirements Specification (SRS). Use before any
  development begins  validates stack completeness, story quality, NFR/compliance,
  competitor landscape, feature gaps, roadmap, and issues a scored Go/No-Go decision.
  Phase 0 gate: development is BLOCKED until approved. Trigger when: starting a new
  project, preparing for Phase 0, reviewing SRS before dev begins, running product
  requirements validation, or any time someone asks to review or approve requirements.
compatibility: Any stack  validates SRS and emits STACK CONFIRMED block
metadata:
  type: command
  version: 5.10
  updated: 2026-05-21
---

Command  : /swp-srs
Version  : 5.10
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

When this command is run outside `/swp-orchestrate`, the approval gate must still publish the approved work.

After the exact phrase `SRS approved` is accepted, run `.claude/refs/approval-publish-contract.md` before advancing to `/swp-arch`.

This standalone command must not mark Phase 0 complete unless the approval publish summary includes a pushed branch and a PR URL targeting `develop`.

---

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
| Version | Date       | Author  | Changes                                                                                         |
|---------|------------|---------|-------------------------------------------------------------------------------------------------|
| 5.10    | 2026-05-21 | KapilDev | Added standalone approval publish enforcement: commit, push, PR to develop, and manager acceptance email after SRS approval |
| 5.9     | 2026-05-21 | KapilDev | Added Toolkit Version Sync section and normalized version-history heading |
| 5.8     | 2026-05-21 | KapilDev   | Added Skill Maturity 2.0 Contract for repo-wide command readiness consistency |
| 5.7     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 5.6     | 2026-05-20 | KapilDev | Added ISO date suffix to grouped generated markdown artifact names: `docs/[GGG].[NNN].[name]-[YYYY-MM-DD].md` |
| 5.5     | 2026-05-20 | KapilDev | Changed generated markdown artifact naming to root-only grouped `docs/[GGG].[NNN].[name].md` sequence format |
| 5.4     | 2026-05-20 | KapilDev | Added generated-doc filename sequence enforcement for legacy numbered slug-format artifacts |
| 5.3     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 5.2     | 2026-05-15 | Zenthil | STEP 1 +Coding Standards stack (naming, error hierarchy, async, constants, logging) +Architecture Standards (pattern, layer rules, DI lifetime, module boundaries) +Testing Standards (pyramid, coverage targets, naming, DoR, test data); STEP 2 +3 per-story checks (error handling, layer assignment, test scenarios); STEP 4 +Coding Standards (8 rows) +Architecture Standards (10 rows: SOLID SRP/OCP/DIP, DI lifetime, module boundaries, circular deps, infra abstractions, shared kernel) +Testing Standards (11 rows: pyramid, unit/integration/E2E coverage, AAA, test naming, isolation, test data, DoR, mutation, perf test); STEP 9.5 +5 checklist items; STEP 10 +3 gap rows (CODING STD, ARCH, TESTING) |
| 5.1     | 2026-05-15 | Zenthil | STEP 1 +API design stack (response envelope, error shape, date format, null handling, filtering); STEP 2 +3 backend story checks (HTTP verb, status codes, DTO shape); STEP 4 +API Design Standards (15 rows: RESTful naming, verb discipline, response envelope, error format, status codes, pagination, filtering, date format, null handling, idempotency, rate-limit headers, webhook design, auth token transport, CORS, changelog policy); STEP 9.5 +3 checklist items; STEP 10 +API DESIGN GAPS row |
| 5.0     | 2026-05-15 | Zenthil | STEP 1 +UI/Design stack gate (design tokens, BEM, AOS, responsive, component library); STEP 2 +3 frontend story checks (responsive, AOS/animation, SmartWorkz tokens); STEP 4 +SmartWorkz UI Standards (13 rows: tokens, BEM, AOS, dark mode, touch targets, reduced-motion, typography, z-index, skeleton loaders, error states, RTL) + Design Principles (8 rows: hierarchy, whitespace, modern, smooth, consistent, feedback, progressive, micro-interactions) + Security Design Principles (10 rows: least privilege, defense in depth, zero trust, secure by default, data minimization, fail secure, input validation, output encoding, secrets hygiene, audit trail); STEP 9.5 +4 checklist items; STEP 10 +3 new gap rows (UI standards, design principles, security principles) |
| 4.4     | 2026-05-15 | Zenthil | BREAKDOWN.md full skeleton at SRS sign-off  all 5 phase checkpoints (03); Next prompt updated to /swp-arch |
| 4.3     | 2026-05-13 | Zenthil | Added /swp-sync validate trigger after SRS approval gate |
| 4.2     | 2026-05-13 | Zenthil | Step 10 +PRODUCT BACKLOG table (all stories + gaps ordered by priorityphasevalue, NEW-[N] IDs for gaps, totals block); Step 9.5 +backlog checklist items; Step 11 +backlog priority/phase adjustment commands; Step 12 +docs/BACKLOG.md creation and commit |
| 4.1     | 2026-05-13 | Zenthil | STEP 12 step 9: replace generic /swp-sync prompt with targeted DOWNSTREAM IMPACT analysis (new entities, modified ACs, per-doc stale sections, /swp-ui /swp-db /swp-arch shortcuts) |
| 4.0     | 2026-05-13 | Zenthil | Step 1 +DoD check, team capacity, container strategy, API versioning consistency; Step 2 +RBAC per-story, idempotency, undo/rollback; Step 3 +retry/backoff, webhook, permission chains, report aggregation; Step 4 +Scalability, API docs (Swagger), OWASP Top 10 explicit checklist, DR plan separate from backup; Step 5 +AlternativeTo/ProductHunt search, moat analysis; Step 6 +security gaps (brute force, CSRF, token rotation), data import/migration, analytics/telemetry; Step 7 +Business value column, cross-tier dependency check, MVP kill criteria; Step 8 +DevOps/CI setup time, external dependency buffer, risk register, milestones, rollback plan; Step 9 upgraded to 8-dimension 100pt scoring GO85; Step 10 +OWASP/security/integration/analytics gap rows; Step 11 +split epic command; Step 12 +ENTITIES.md seeding, BREAKDOWN.md, /swp-sync, ADO |
| 3.2     | 2026-05-13 | Zenthil | Add STEP 9.5  self-review + fix loop: 9-step checklist, auto-fix vs PENDING classification, re-score per iteration, repeat until score  90 or 3 iterations |
| 3.1     | 2026-05-13 | Zenthil | P3 gaps: Step 4 +ADA (US accessibility law) + PDPA (Thailand/Singapore) compliance + fixed ADA heuristic; Step 5 +G2/Capterra review search; Step 8 +parallel workstream guidance + holiday/leave buffer; settings.json +shell:powershell on all hooks |
| 3.0     | 2026-05-13 | Zenthil | Major refinement: Step 1 +9 operational stack categories + SRS structure gate; Step 2 +4 AC quality checks; Step 3 +state machine + concurrency triggers; Step 4 +9 NFR dimensions + LGPD + COPPA compliance; Step 5 +Competitive Context table; Step 6 +Effort column + ROI Quick Wins; Step 7 +Effort column; Step 8 +risk buffer 1.5 + dependency ordering; Step 9 L10n wired into scoring; Step 10 +Assumptions Log; Step 11 +re-run step + accept all minor + correct assumption; Step 12 +COMPETITOR-ANALYSIS.md + CONTEXT.md + /swp-ui prompt |
| 2.1     | 2026-05-13 | Zenthil | Step 4: added Localization & Globalization (L10n/G11n) checks  10 dimensions, detection heuristics, Step 10 L10N/G11N GAPS row |
| 2.0     | 2026-05-13 | Zenthil | Full 12-step restructure: Go/No-Go scored decision, STAR matrix gap analysis, 8 compliance frameworks, competitor auto-discovery via web search, formula-based roadmap, PENDING DECISIONS matrix |
| 1.0     |           | Zenthil | Initial 10-step version                                                                         |

---

Review and finalize the SRS for: $ARGUMENTS
Phase 0 gate  development is BLOCKED until this review is complete and approved.

Read docs/SRS.md in full before outputting anything.
If docs/SRS.md does not exist:
  Output the following and stop:

  SRS NOT FOUND  docs/SRS.md does not exist.

  To proceed, choose one of:
    1. Type "create SRS template"  Claude will generate a structured blank docs/SRS.md with all required sections
    2. Type "scaffold SRS: [project name]"  Claude will ask 5 questions and generate a pre-filled SRS
    3. Paste your requirements as plain text  Claude will structure them into docs/SRS.md format

  Then re-run /swp-srs once the file exists.

---

## STEP 1  Stack completeness check

Before reading any feature content: verify that the SRS has a revision history table,
a glossary/definitions section, and an assumptions section. If any are absent:
  SRS STRUCTURE GAP: [missing section]  add before re-running /swp-srs.

Also check for:
  DoD (Definition of Done) section  criteria that must be met for a story to be "Done"
    If absent: SRS STRUCTURE GAP: Definition of Done  add a DoD section listing quality gates
    (e.g. unit tests pass, PR reviewed, acceptance criteria verified, deployed to staging)
  Team capacity  how many developers, their availability (FTE or part-time)
    If absent: ASSUMPTION logged in Step 10: "Solo developer, full time"
  Container strategy  Docker / Docker Compose / Kubernetes / none
    If absent: STACK GAP: Container strategy  specify Docker usage, compose setup, or "none"

Locate the STACK CONFIRMED block. For every category below, verify it is defined:

  Core tech:
    Backend, Frontend, Database, ORM, Auth, Logging, Tests, Cloud, Namespace,
    DB Schema pattern, SP prefix, Approved NuGet packages, Approved npm packages

  Operational stack (must also be defined):
    API versioning strategy    (e.g. URL path /v1/, header, none)
    Caching strategy           (Redis / in-memory / CDN / none  include TTL policy)
    Secret management          (Azure Key Vault / AWS Secrets / .env  NOT hardcoded)
    Observability stack        (AppInsights / Sentry / DataDog / ELK  logging sink)
    Message broker             (Azure ServiceBus / RabbitMQ / none  if async flows exist)
    File / blob storage        (Azure Blob / S3 / local disk / none)
    Email / notification provider  (SendGrid / SMTP / SES / none)
    CI/CD pipeline             (GitHub Actions / Azure Pipelines / GitLab CI / none)
    Pipeline level             (Basic: buildtestdeploy | Standard: +lintunitintegration tests | Advanced: +securitycoverageperformancenotificationsrollback)
    Environment strategy       (develop / staging / production  what differs per environment)

  UI / Design standards (required for any product with a frontend  omit for pure API products):
    Design token system        (SmartWorkz tokens: --sw-color-*, --sw-spacing-*, --sw-typography-*, --sw-z-* / "TBD in /swp-ui")
    CSS methodology            (BEM with sw- prefix / CSS Modules / utility-first  specify)
    Animation library          (AOS for scroll reveals + CSS 200ms ease-out transitions / none  specify)
    Responsive breakpoints     (mobile-first: 320px / 768px / 1024px / 1536px  or "TBD in /swp-ui")
    Component library          (custom SmartWorkz components / Angular Material / shadcn / PrimeNG / etc.)

  API design standards (required for any product with a backend API  omit for UI-only products):
    Response envelope          (consistent JSON wrapper: { data, error, meta } / raw  specify)
    Error response format      (uniform error shape: { code, message, details }  applies project-wide)
    Date/time format           (ISO 8601 UTC strings / Unix timestamp  specify; stored as UTC)
    Null handling strategy     (omit null fields / include nulls as null  one strategy project-wide)
    Filtering/sorting params   (query param convention: filter[field]=value&sort=field:asc  or "N/A")

  Coding standards (required for all products):
    Naming conventions         (camelCase: JS/TS vars/functions; PascalCase: C# classes/Angular components; snake_case: DB tables/columns; kebab-case: CSS files/routes)
    Error handling hierarchy   (custom exception base class; error code registry e.g. ERR_001; structured propagation  no swallowed exceptions)
    Async/await pattern        (async all the way down; no sync-over-async; CancellationToken on all I/O; no fire-and-forget)
    Constants strategy         (all magic numbers/strings in a dedicated constants file/class/enum  none inline in business logic)
    Structured logging         (JSON structured logs; correlation ID on every request; log levels: Debug/Info/Warn/Error/Fatal; PII fields never logged)

  Architecture standards (required for all products):
    Architecture pattern       (Clean Architecture / N-tier / Hexagonal / Modular Monolith  state pattern and dependency direction)
    Layer boundary rules       (inner layers have no knowledge of outer layers; Domain has no infrastructure deps; Application has no HTTP/DB deps)
    DI lifetime rules          (singleton: stateless infra; scoped: per-request state; transient: lightweight operations  stated per service category)
    Module boundaries          (bounded contexts do not directly access each other's DB tables  cross-context calls via service interface or events only)

  Testing standards (required for all products):
    Test pyramid shape         (unit > integration > E2E ratio stated  e.g. 70% unit / 20% integration / 10% E2E)
    Coverage targets           (minimum coverage % per layer stated  e.g. Domain/Application  80%; Infrastructure  60%)
    Test naming convention     (Given_[state]_When_[action]_Then_[outcome] OR [MethodName]_[Scenario]_[ExpectedResult]  one style project-wide)
    Test data strategy         (fixtures/factories/seeds  no production data in tests; PII masked in test fixtures)
    Definition of Ready (DoR)  (story must have: clear ACs, estimated complexity, test scenarios identified, dependencies resolved  before sprint entry)

  API versioning consistency check  if "API versioning strategy" is defined, scan all
  endpoint definitions in the SRS. Flag any endpoint that does NOT use the declared versioning strategy:
    API VERSIONING INCONSISTENCY: [Endpoint]  uses [actual pattern] but strategy is [declared pattern]

For each category missing or ambiguous:
  STACK GAP: [category]  [what is missing or unclear]

If any STACK GAPs exist: list them all, stop, wait for tech lead to fill them in SRS.

---

## STEP 2  Feature completeness check

For every Epic and Story in the SRS:

  STORY CHECK: [Story ID / title]
   /   Has a clear user story format ("As a [user], I want [action], so that [benefit]")
   /   Has 25 acceptance criteria
   /   Every AC is specific and testable (not vague like "works correctly")
   /   At least one AC covers an error / failure path (invalid input, not found, unauthorized)
   /   Data validation rules stated (required fields, max length, format  e.g. email, phone)
   /   Complexity stated: S / M / L
   /   Dependencies listed (or "none")
   /   Backend stories: endpoint method + route + request/response DTO referenced (or "see /swp-db")
   /   [Backend] HTTP verb is correct for the operation  GET=read, POST=create, PUT=replace, PATCH=partial update, DELETE=remove
   /   [Backend] HTTP status codes stated per response scenario  201 Created, 204 No Content, 400 Bad Request, 401/403 Auth, 404 Not Found, 409 Conflict, 422 Validation, 500 Server
   /   [Backend] Request DTO and response DTO shape defined  field names, types, required vs optional (or "TBD in /swp-db")
   /   [Backend] Error handling stated  failure scenario names the exception type, error code, and user-facing message (or "standard error handler applies")
   /   [All] Layer assignment stated or inferable  which layer owns this story's logic (Domain / Application / Infrastructure / Presentation)
   /   [All] Test scenarios identified  at least one unit/integration test scenario per AC (or "TBD in /swd-unit-test")
   /   Frontend stories: UI screen name or wireframe reference stated (or "TBD in /swp-ui")
   /   [Frontend] Responsive behavior stated  which breakpoints this screen must support (or "TBD in /swp-ui")
   /   [Frontend] Animation / transition behavior stated  AOS scroll entry, hover states, skeleton loaders, or "none" (or "TBD in /swp-ui")
   /   [Frontend] SmartWorkz design tokens and BEM naming referenced (or explicitly "delegated to /swp-ui")
   /   RBAC check: which roles can access this story If story has no role restriction stated and the
            product has multiple roles: flag as "RBAC MISSING  which roles may [action]"
   /   Idempotency: if story involves a financial transaction, payment, booking, or order creation 
            at least one AC must cover idempotent retry behaviour (duplicate prevention)
   /   Undo / rollback: if story involves a destructive or irreversible operation (delete, cancel,
            publish, send)  at least one AC must state whether undo is possible and how
   /   Test traceability: each AC can be mapped to a distinct test scenario  no AC is so vague
            that a tester cannot write a specific test case from it without guessing
   Open questions: [any ambiguity in this story]

---

## STEP 3  Pseudo code requirement check

A method REQUIRES pseudo code in the SRS when it has:
  - More than 2 IF conditions, OR
  - Calls more than 2 external services, OR
  - Involves financial / scoring / ranking / calculation logic, OR
  - Has loops with conditional logic inside, OR
  - Implements a state machine (entity with a lifecycle: Draft  Pending  Active  Closed etc.), OR
  - Has concurrency / race condition risk (parallel writes, queue consumers, optimistic locking), OR
  - Implements retry / backoff logic (calls an external service that may fail transiently), OR
  - Processes a webhook payload (must validate signature + handle out-of-order delivery), OR
  - Has complex permission chains (e.g. user can act IF role = X AND tenant feature = Y AND resource.owner = userId), OR
  - Is a report aggregation query (multi-table join, GROUP BY, window function, date bucketing)

For each feature, flag methods that need pseudo code but don't have it:
  PSEUDO CODE MISSING: [Feature]  [Method or operation]  [reason it qualifies]

---

## STEP 4  NFR + Full Compliance Framework check

Read the SRS and check every category below. Nothing is silently skipped  every item
gets an explicit status. Infer compliance applicability from user roles, data types,
geography, payment flows, and industry described in the SRS.

Output:

  NFR CHECKS
  
  Performance targets    //DEFERRED  [response time target, concurrent users]
  Scalability            //DEFERRED  [horizontal scaling strategy, expected peak load, auto-scale triggers]
  Security model         //DEFERRED  [auth model, roles, data sensitivity]
  API documentation      //DEFERRED  [Swagger/OpenAPI spec, versioned, auto-generated or manual]
  Multi-tenancy scope    //DEFERRED  [which tables are tenant-scoped]
  Soft delete            //DEFERRED  [which entities support soft delete]
  Pagination             //DEFERRED  [which list endpoints are paged]
  Audit logging          //DEFERRED  [what events logged, retention period]
  Error handling         //DEFERRED  [global exception handler, ErrorCode constants, error response shape]
  Rate limiting          //DEFERRED  [per-user / per-tenant / per-IP API throttle limits]
  Data retention         //DEFERRED  [how long records kept, purge schedule, archiving strategy]
  Observability          //DEFERRED  [distributed tracing, alerting thresholds, dashboard defined]
  Notification strategy  //DEFERRED  [which events trigger email/push/SMS, delivery guarantee: at-least-once]
  Session management     //DEFERRED  [timeout, concurrent session limit, remember-me behaviour]
  Backup & recovery      //DEFERRED  [RPO target, RTO target, backup frequency]
  Disaster recovery      //DEFERRED  [DR plan separate from backup  failover region / RTO if primary goes down]
  Search & filter        //N/A       [which entities are searchable, what filter dimensions]
  Reporting / exports    //N/A       [dashboards, CSV/PDF export, scheduled reports]
  SEO                    //N/A       [if public-facing: SSR, sitemap, meta tags, CWV targets]
  WCAG Accessibility     //N/A       [AA or AAA, which user flows]

  AI / ML NFR CHECKS (include only if product uses AI, ML, LLMs, or recommendation engines)
  
  Prompt injection protection  //N/A  [input sanitisation strategy for LLM prompts; deny-listed patterns]
  Model versioning             //N/A  [pinned vs. floating model versions; rollback plan if model changes]
  Inference latency target     //N/A  [p95 response time for AI-generated content; timeout policy]
  AI bias / fairness review    //N/A  [if recommendations/scoring: bias audit plan; protected attributes]
  LLM cost monitoring          //N/A  [token usage alerting; per-user or per-tenant cost limits]
  Training data compliance     //N/A  [data lineage; GDPR right-to-erasure for training data; consent]

  Detection heuristics (AI/ML section applies when SRS mentions):
    "AI", "LLM", "GPT", "Claude", "recommendation", "classification", "prediction",
    "machine learning", "model", "embedding", "vector", "RAG", "fine-tuning", "inference"

  OWASP TOP 10 CHECKLIST
  
  A01 Broken Access Control    //DEFERRED  [authz checks on every endpoint, RBAC model defined]
  A02 Crypto Failures          //DEFERRED  [PII/secrets encrypted at rest and in transit, hashing algorithm stated]
  A03 Injection                //DEFERRED  [parameterised queries / ORM only  no raw string SQL or LDAP]
  A04 Insecure Design          //DEFERRED  [threat modelling done, sensitive flows reviewed]
  A05 Security Misconfiguration //DEFERRED [debug off in prod, CORS locked down, secrets not in source]
  A06 Vulnerable Components    //DEFERRED  [dependency scanning (Dependabot/Snyk) in CI pipeline]
  A07 Auth Failures            //DEFERRED  [brute-force lockout, MFA option, token rotation, secure cookie flags]
  A08 Software & Data Integrity //DEFERRED [signed releases, webhook signature validation, CI/CD integrity]
  A09 Logging & Monitoring     //DEFERRED  [security events logged, SIEM or alert path defined]
  A10 SSRF                     //N/A       [if app fetches user-supplied URLs: allowlist, no internal routing]

  For each  OWASP item: add to PENDING DECISIONS with severity score using Step 6 formula.

  COMPLIANCE FRAMEWORKS
  
  GDPR      APPLIES/DEFERRED/N/A  [EU users or personal data stored/processed]
  HIPAA     APPLIES/DEFERRED/N/A  [Health records or PHI handled]
  SOC 2     APPLIES/DEFERRED/N/A  [SaaS with enterprise/B2B customers]
  PCI-DSS   APPLIES/DEFERRED/N/A  [Card payments processed or stored]
  CCPA      APPLIES/DEFERRED/N/A  [California users or personal data sold]
  ISO 27001 APPLIES/DEFERRED/N/A  [Formal ISMS required by customers]
  FERPA     APPLIES/DEFERRED/N/A  [Student education records]
  PIPEDA    APPLIES/DEFERRED/N/A  [Canadian users or personal data collected]
  LGPD      APPLIES/DEFERRED/N/A  [Brazilian users or personal data of Brazilian residents]
  COPPA     APPLIES/DEFERRED/N/A  [Product targets or may be used by children under 13]
  ADA       APPLIES/DEFERRED/N/A  [Has public-facing UI accessible from the US, or explicitly targets US market]
  PDPA      APPLIES/DEFERRED/N/A  [Product serves Thai or Singaporean users]

Status definitions:
  APPLIES   = framework is relevant AND SRS addresses it  
  APPLIES   = framework is relevant BUT SRS does not address it   (becomes NFR gap)
  DEFERRED  = relevant but tech lead has explicitly deferred  must be noted in SRS
  N/A       = not applicable  state one-line reason

Detection heuristics:
  GDPR      mentions "EU", "Europe", "GDPR", or stores personal data of unknown geography
  HIPAA     mentions health, medical, patient, clinic, hospital, PHI
  SOC 2     B2B SaaS with enterprise customers
  PCI-DSS   mentions payments, billing, card, checkout, Stripe, Razorpay, PayPal
  CCPA      mentions California, US consumer app, data monetisation
  ISO 27001  mentions ISO certification, enterprise security contracts
  FERPA     mentions students, grades, school, university, LMS, education records
  PIPEDA    mentions Canada, Canadian users
  LGPD      mentions Brazil, Brazilian users, or Latin American market
  COPPA     mentions kids, children, under-13, parental consent, school-age users
  ADA       mentions US market, US users, US customers, public-facing web app with no geography restriction, or ADA compliance explicitly
  PDPA      mentions Thailand, Singapore, Thai users, Singaporean users, or personal data of Thai/Singapore residents

  LOCALIZATION & GLOBALIZATION
  
  Target locales           //DEFERRED  [list of target locales, e.g. en-US, fr-FR, ar-SA]
  i18n framework           //DEFERRED  [string externalization strategy  e.g. i18next, .resx, gettext]
  Date / time formatting   //DEFERRED  [locale-aware display, timezone handling  stored as UTC]
  Number / currency format //DEFERRED  [locale-aware separators, currency symbols, exchange rate source]
  RTL language support     //N/A       [right-to-left layout for Arabic, Hebrew, Urdu, etc.]
  Character encoding       //DEFERRED  [UTF-8 enforced throughout  DB collation, API, file storage]
  Translation workflow     //DEFERRED  [how strings are translated  manual, crowdsourced, 3rd-party service]
  Locale detection         //DEFERRED  [browser Accept-Language, user preference, or geo-IP fallback]
  Pluralization rules      //N/A       [language-specific plural forms handled by i18n library]
  Fallback locale          //DEFERRED  [default locale when a translation is missing]

  L10n/G11n status definitions  same as NFR status above (//DEFERRED/N/A).

  L10n/G11n detection heuristics:
    APPLIES  mentions "multi-language", "multilingual", "international", "global", "i18n", "l10n",
              non-English languages, country-specific deployments, multiple currencies,
              or users from more than one country / region

  SMARTWORKZ UI & DESIGN STANDARDS (include for any product with a frontend UI  skip for pure API/backend-only products)
  
  Design tokens           //DEFERRED  [--sw-color-*, --sw-spacing-*, --sw-typography-*, --sw-z-* system defined or deferred to /swp-ui]
  BEM + sw- naming        //DEFERRED  [CSS class naming convention: sw-[block]__[element]--[modifier]  stated or "TBD in /swp-ui"]
  Responsive breakpoints  //DEFERRED  [mobile-first: 320px / 768px / 1024px / 1536px  all UI screens covered]
  Animation strategy      //DEFERRED  [AOS for scroll-triggered reveals + 200ms ease-out CSS transitions for micro-interactions]
  Scroll-reveal (AOS)     //N/A       [Animate On Scroll library for entry animations  data-aos attributes on hero, cards, sections]
  Dark mode               //DEFERRED  [semantic token switching  light/dark variants via --sw-color-* tokens; no hard-coded colours]
  Touch targets           //DEFERRED  [4444px minimum tap targets on all interactive elements  WCAG 2.5.5]
  Reduced-motion guard    //DEFERRED  [@media (prefers-reduced-motion) disables AOS animations + CSS transitions for vestibular users]
  Typography scale        //DEFERRED  [1.25 Major Third scale  approved fonts: Satoshi, Clash Display, JetBrains Mono  no Inter / Roboto]
  Z-index scale           //DEFERRED  [--sw-z-base(0)  raised(10)  dropdown(1000)  sticky(1020)  modal(1050)  toast(1080)]
  Skeleton loaders        //N/A       [skeleton placeholder screens for async data loads  no raw spinners on content areas]
  Error / empty states    //DEFERRED  [empty state, error state, and loading state visually defined for every data-driven screen]
  RTL layout              //N/A       [CSS logical properties + dir attribute for RTL  required if any RTL locale is targeted]

  Detection heuristics (UI standards section applies when SRS mentions):
    Any frontend framework (Angular, React, Vue, Blazor, Flutter, SwiftUI), any screen or UI story,
    "web app", "mobile app", "dashboard", "form", "modal", "table", "navigation", "component"

  DESIGN PRINCIPLES (include for any product with a frontend UI)
  
  Visual hierarchy        //DEFERRED  [primary / secondary / tertiary action distinction stated per screen type  no ambiguous CTAs]
  Whitespace-first        //DEFERRED  [content density strategy defined  generous padding, breathing room around key actions]
  Modern aesthetic        //DEFERRED  [flat design, subtle elevation shadows, rounded corners  no skeuomorphic chrome stated]
  Smooth interactions     //DEFERRED  [AOS scroll reveals on page entry; skeleton loaders before data; no jarring layout shifts]
  Consistent patterns     //DEFERRED  [same component reused across similar contexts  no one-off UI variants per feature]
  Feedback immediacy      //DEFERRED  [every user action has a visual response within 100ms  loading, success, and error states]
  Progressive disclosure  //N/A       [complex flows split into wizard steps  no full-page form dumps; multi-step flows only]
  Micro-interactions      //N/A       [hover, focus, active, pressed states defined for buttons, inputs, cards, and links]

  SECURITY DESIGN PRINCIPLES
  
  Least privilege         //DEFERRED  [users and services get minimum permissions needed  no over-provisioning of roles or scopes]
  Defense in depth        //DEFERRED  [multiple security layers: authentication  authorisation  input validation  rate limiting]
  Zero trust              //DEFERRED  [every request verified regardless of source network or prior session state  no implicit trust]
  Secure by default       //DEFERRED  [most restrictive settings are the default  explicit opt-in to open access, not opt-out]
  Data minimization       //DEFERRED  [collect only data that is needed  no excess PII stored, transmitted, or logged]
  Fail secure             //DEFERRED  [on exception or error: system denies access  NEVER defaults to open/permit on failure]
  Input validation        //DEFERRED  [all user input validated server-side  client-side validation is UX-only, not a security gate]
  Output encoding         //DEFERRED  [all data rendered in UI is HTML-encoded  no raw interpolation of user-supplied content (XSS)]
  Secrets hygiene         //DEFERRED  [no credentials in source code, logs, or error messages  vault or environment variables only]
  Audit trail             //DEFERRED  [all security-sensitive actions logged: actor + timestamp + outcome + IP address]

  API DESIGN STANDARDS (include for any product with a REST or GraphQL API  skip for UI-only or pure event-driven products)
  
  RESTful naming          //DEFERRED  [plural nouns in paths, no verbs in URLs  /users not /getUsers; /orders/{id}/items not /getOrderItems]
  HTTP verb discipline    //DEFERRED  [GET=read (no side effects), POST=create, PUT=replace, PATCH=partial update, DELETE=remove  consistent across all endpoints]
  Response envelope       //DEFERRED  [consistent JSON wrapper across all endpoints  e.g. { data, error, meta }  no ad-hoc shapes per endpoint]
  Error response format   //DEFERRED  [uniform error shape: { code, message, details }  error code constants defined (e.g. ERR_001); no raw exception strings]
  HTTP status codes       //DEFERRED  [correct codes used: 200/201/204 success, 400 bad request, 401 unauth, 403 forbidden, 404 not found, 409 conflict, 422 validation, 500 server  never 200 for errors]
  Pagination contract     //DEFERRED  [list endpoints paginated  response includes total, page, pageSize or nextCursor  cursor-based or offset stated project-wide]
  Filtering + sorting     //N/A       [query param naming convention stated for filterable resources  e.g. filter[status]=active&sort=createdAt:desc]
  Date/time format        //DEFERRED  [ISO 8601 UTC strings for all date/time fields  stored as UTC, displayed locale-aware in UI]
  Null handling           //DEFERRED  [one strategy project-wide: omit null fields OR include as null  never mixed across endpoints]
  Idempotency keys        //N/A       [POST operations that risk duplicate creation accept Idempotency-Key header  required for payment, order, booking, and send flows]
  Rate limit headers      //DEFERRED  [X-RateLimit-Limit + X-RateLimit-Remaining + Retry-After headers returned on throttled responses]
  Webhook design          //N/A       [event naming: object.event (e.g. order.created) + HMAC signature validation + at-least-once delivery + retry/backoff policy  if outbound webhooks exist]
  Auth token transport    //DEFERRED  [Bearer token in Authorization header ONLY  never in URL query params or request body]
  CORS policy             //DEFERRED  [allowed origins explicitly enumerated  no wildcard * in production; preflight (OPTIONS) handled]
  API changelog policy    //DEFERRED  [breaking vs non-breaking change policy stated  deprecation notice period defined before removing endpoints or fields]

  For each  API Design item: flag as API DESIGN GAP and add to PENDING DECISIONS.

  Detection heuristics (API standards section applies when SRS mentions):
    REST, API, endpoint, HTTP, JSON, GraphQL, gRPC, microservice, backend, controller, route,
    "returns a list of", "creates a", "updates a", "deletes a", "webhook", DTO, Swagger, OpenAPI

  CODING STANDARDS
  
  Naming conventions      //DEFERRED  [camelCase: JS/TS vars/functions; PascalCase: C# classes/interfaces/components; snake_case: DB tables/columns/SPs; kebab-case: CSS classes/file names/routes  stated in SRS or CLAUDE.md]
  Error handling hierarchy //DEFERRED [custom exception base class defined; error code registry (ERR_001 format); structured propagation up the call stack  no swallowed exceptions or generic catch-all without re-throw]
  Async/await pattern     //DEFERRED  [async all the way down  no sync-over-async blocking calls; CancellationToken on all I/O operations; no fire-and-forget Task.Run without error handler]
  Constants strategy      //DEFERRED  [no magic numbers or strings inline in business logic  all constants in a dedicated constants file, class, or enum per domain]
  Structured logging      //DEFERRED  [JSON structured logs with correlation ID propagated on every request; log levels defined: Debug/Info/Warn/Error/Fatal; no PII (email, phone, tokens, passwords) ever written to logs]
  PII log exclusion       //DEFERRED  [PII fields explicitly listed and excluded from logging  log scrubbing or field masking strategy stated]
  Code complexity limit   //DEFERRED  [cyclomatic complexity  10 per method; function/method length  50 lines  enforced by linting rules in CI (ESLint/SonarQube/NDepend)]
  Dead code policy        //DEFERRED  [no commented-out code in production branches  removed at PR review stage; feature flags used for in-progress code, not comments]

  For each  Coding Standards item: add to PENDING DECISIONS.

  ARCHITECTURE STANDARDS
  
  Architecture pattern    //DEFERRED  [Clean Architecture / N-tier / Hexagonal / Modular Monolith  stated and justified; dependency direction explicitly defined (inner  outer is forbidden)]
  Layer boundary rules    //DEFERRED  [Domain layer: no infrastructure dependencies; Application layer: no HTTP or DB deps; Infrastructure layer: implements interfaces defined in Application  no layer skip]
  SOLID  SRP             //DEFERRED  [Single Responsibility: each class/service has one reason to change  no God classes, no catch-all *Manager or *Helper services]
  SOLID  OCP             //DEFERRED  [Open/Closed: new behaviour added via extension (strategy pattern, decorator)  stable code is not modified; extension points identified per domain]
  SOLID  DIP             //DEFERRED  [Dependency Inversion: high-level modules depend on abstractions  interfaces injected via DI container; no new ConcreteClass() in application logic]
  DI lifetime rules       //DEFERRED  [DI lifetime strategy stated per service category: Singleton (stateless infrastructure), Scoped (per-request unit of work), Transient (lightweight stateless operations)]
  Module boundaries       //DEFERRED  [bounded contexts do not directly read each other's DB tables  cross-context data access via published service interfaces or domain events only]
  No circular dependencies //DEFERRED [no circular module/package dependencies  enforced via architectural lint tool (NDepend / Deptrac / ts-morph / dependency-cruiser) in CI]
  Infrastructure abstractions //DEFERRED [all external I/O (DB, email, storage, 3rd-party APIs) behind interfaces defined in Application layer  enables test doubles without mocking concrete classes]
  Shared kernel policy    //DEFERRED  [shared domain types (value objects, enums, DTOs, constants) in a dedicated shared/common project  no duplication across bounded contexts]

  For each  Architecture item: add to PENDING DECISIONS with layer impacted.

  TESTING STANDARDS
  
  Test pyramid shape      //DEFERRED  [unit > integration > E2E ratio stated  e.g. 70% unit / 20% integration / 10% E2E; no inverted pyramid (more E2E than unit)]
  Unit test coverage      //DEFERRED  [minimum coverage % per layer stated  e.g. Domain/Application  80%; Infrastructure  60%; UI components  70%]
  Integration test scope  //DEFERRED  [integration tests use real DB and real HTTP  no mocks at the boundary under test; scope defined per module or bounded context]
  E2E test scope          //N/A       [E2E tests cover critical user journeys: happy path + one failure path per Epic  tool stated (Playwright / Cypress / Selenium)]
  AAA pattern             //DEFERRED  [Arrange/Act/Assert structure enforced in all unit tests  no multi-act tests; one logical assertion per test; no test interdependencies]
  Test naming convention  //DEFERRED  [test name format: Given_[state]_When_[action]_Then_[outcome] OR [Method]_[Scenario]_[Expected]  one convention stated project-wide]
  Test isolation          //DEFERRED  [no shared mutable state between tests  each test creates and clears its own data; tests run in any order without side effects]
  Test data strategy      //DEFERRED  [test data via builders/factories/seeds  no production data in any test environment; PII masked or synthetic in all fixtures]
  Definition of Ready (DoR) //DEFERRED [story must satisfy before sprint entry: ACs approved, complexity estimated, test scenarios identified, dependencies unblocked, design referenced]
  Mutation testing        //N/A       [mutation testing on critical domain logic to verify test quality beyond coverage %  tool stated (Stryker.NET / Stryker JS / Pitest)]
  Performance test plan   //DEFERRED  [load test targets stated: concurrent users, RPS, p95 latency ceiling; tool declared (k6 / JMeter / Locust); scheduled before Phase 5 QA gate]

  For each  Testing Standards item: add to PENDING DECISIONS with phase where it must be resolved.

---

## STEP 5  Competitor discovery & feature matrix

Use web search to auto-discover real competitors. Do NOT hallucinate competitor names.

Process:
  1. Infer product domain from SRS title, purpose, and user roles
  2. Web search: "top [domain] software competitors 2025" AND "[domain] alternatives"
  3. Also search: "site:alternativeto.net [product-type]" AND "site:producthunt.com [product-type]"
      AlternativeTo lists user-recommended alternatives; ProductHunt shows recent entrants in the space
  4. Select top 35 real named competitors (not generic categories)
      For each: web search "site:g2.com [competitor name] reviews" OR "site:capterra.com [competitor name] reviews"
       Extract top 23 user-reported complaints. Use as "Known weakness" in Competitive Context table.
       If no results, or review text is paywalled/sparse: use the available snippet summary,
       or note "limited review data" in the weakness column  do not hallucinate complaint text.
  5. Extract their key features from search results
  6. Build feature matrix comparing YOUR SRS vs. each competitor
  7. Score each gap where YOUR SRS is  using the severity formula from Step 6

If web search fails or returns no useful results:
  Output: "COMPETITOR SEARCH: No results  please provide competitor names"
  Prompt: "I could not find competitors for this domain automatically.
           Please list 25 competitor products and I will build the feature matrix."
  Stop Step 5 and wait. Do not proceed until competitor names are provided.

Output:

  COMPETITOR DISCOVERY
  Detected domain  : [e.g. "Online exam platform for students"]
  Search queries   : "[query 1]", "[query 2]", "[AlternativeTo query]", "[ProductHunt query]"
  Competitors found: [Comp A], [Comp B], [Comp C], [Comp D]

  COMPETITOR FEATURE MATRIX
  
   Feature                   YOUR SRS  [Comp A]    [Comp B]    [Comp C]    Gap Severity 
  
   [feature in all]                                                            
   [feature you lack]                                              9/10       
   [your advantage]                                                 (advantage)
  

  COMPETITIVE POSITION SUMMARY
  Advantages (you have, competitors don't): [N features]
  Feature parity (all have):               [N features]
  Critical gaps  score 8+ (you lack, most/all competitors have): [N  BLOCKERS]
  Minor gaps  score < 8:                  [N features]

  COMPETITIVE CONTEXT
  
   Competitor  Pricing model     Market segment    Known weakness (from reviews / search)   
  
   [Comp A]    [freemium/sub/]   [SMB/ENT/Consumer [e.g. "poor mobile UX per G2 reviews"]   
   [Comp B]    [per-seat/usage]  [SMB/ENT/Consumer [e.g. "no API  no integrations"]        
  
  Weaknesses sourced from G2/Capterra/AlternativeTo/ProductHunt (see step 34 above).

  MOAT ANALYSIS
  
   Moat type                     Does YOUR SRS have it        How to build it               
  
   Network effects                /  / N/A                 [recommendation or "N/A"]    
   Data lock-in (switching cost)  /  / N/A                 [recommendation or "N/A"]    
   Integrations ecosystem         /  / N/A                 [recommendation or "N/A"]    
   Brand / community              /  / N/A                 [recommendation or "N/A"]    
   Proprietary algorithm/IP       /  / N/A                 [recommendation or "N/A"]    
  

---

## STEP 6  Gap analysis with severity scoring

Identify ALL missing features  from the competitor matrix (Step 5) AND from
domain knowledge about what systems of this type typically include.

Also explicitly check these gap categories:
  Security gaps:
    - Brute-force lockout (too many failed logins  account lock + alert)
    - CSRF protection (state-changing POST/PUT/DELETE protected)
    - Token rotation (refresh token rotated on each use, short access token TTL)
    - Secure HTTP headers (HSTS, CSP, X-Frame-Options, Referrer-Policy)
  Data import / migration:
    - Bulk import (CSV/Excel/JSON) for any entity that typically arrives in bulk
    - Data migration path from legacy system (if SRS mentions replacing existing system)
  Analytics / telemetry:
    - Product analytics (user event tracking, funnel analysis  e.g. Mixpanel, Amplitude, PostHog)
    - Error telemetry (Sentry, Rollbar, or equivalent  beyond server-side logging)
  API integration:
    - Third-party integrations implied by the domain but not listed in SRS (e.g. calendar sync, CRM, Zapier/Make webhooks)

Severity formula:
  score = (user_impact  0.4) + (frequency  0.3) + (competitive_risk  0.3)
  All sub-scores on 110 scale. Round to 1 decimal place.

  user_impact      = how badly users are hurt without this feature (1=minor inconvenience, 10=cannot use product)
  frequency        = how often this path is hit (1=rarely, 10=every session)
  competitive_risk = how many competitors have this (1=niche, 10=all competitors have it)

Output the full gap analysis as a STAR matrix table:

  GAP ANALYSIS MATRIX
  
   Feature Gap           Score  Effort  Category    Situation                     Task                          Action                        Result                      
  
   [Gap name]            9    S       Security    [what is missing/broken now]  [what tech lead must decide]  [story to add / AC to write]  [outcome if addressed]      
   [Gap name]            6    M       Feature     [what is missing/broken now]  [what tech lead must decide]  [story to add / AC to write]  [outcome if addressed]      
   [Gap name]            3    L       Integration [what is missing/broken now]  [what tech lead must decide]  [story to add / AC to write]  [outcome if addressed]      
  

  Category values: Feature | Security | OWASP | Integration | Analytics | Migration | Compliance

  Sub-scores shown per row: user_impact=[X], frequency=[X], competitive_risk=[X]

  Legend:  810 Critical Blocker   57 Significant   14 Minor
  Effort : S/M/L  see Step 8 complexity weights for day estimates (enables ROI ranking)

  ROI QUICK WINS (score  7 AND effort = S  address these first):
  [list any gap rows meeting both criteria, or "none"]

STAR column definitions:
  Situation  what is currently missing or broken in the SRS (current state)
  Task       what the tech lead needs to decide or define (the open decision)
  Action     specific recommended fix: story to add, AC to write, framework to address
  Result     outcome if addressed / risk if ignored

---

## STEP 7  Feature prioritization

Assign every feature in the SRS AND every gap from Step 6 to one of three tiers.

Priority definitions:
  MUST HAVE     Product cannot function without this. MVP blocker.
                 Users cannot complete their primary task. Legal / security requirement.
  GOOD TO HAVE  Significantly improves the product. Expected by most users of this type.
                 High competitive disadvantage without it. Include in early phases.
  NICE TO HAVE  Adds value but product is usable without it. Defer to later phases.

Output:

  FEATURE PRIORITIZATION
  
   MUST HAVE                                                                                        
  
   Feature                   In SRS          Effort  Business Value  Notes                    
  
   [feature]                  Yes /  Gap   S/M/L   High/Med/Low    [why critical]           
  
   GOOD TO HAVE                                                                                     
  
   [feature]                  Yes /  Gap   S/M/L   High/Med/Low    [why valuable]           
  
   NICE TO HAVE                                                                                     
  
   [feature]                  Yes /  Gap   S/M/L   High/Med/Low    [why deferrable]         
  

  Business Value definitions:
    High  directly drives revenue, retention, or compliance (cannot defer without cost)
    Med   improves UX or efficiency significantly; affects conversion or NPS
    Low   nice for completeness; no direct business impact if absent at launch

  CROSS-TIER DEPENDENCY CHECK:
  For every Must Have feature that depends on a Good To Have or Nice To Have:
    DEPENDENCY WARNING: [Must Have feature] depends on [lower-tier feature]
    Recommendation: [elevate lower-tier feature / redesign Must Have to remove dependency]

  MVP KILL CRITERIA:
  List the conditions under which this MVP would be considered a failure at launch:
    KILL CRITERIA: [measurable threshold  e.g. "< 100 active users in 30 days",
                   "payment error rate > 2%", "< 1 enterprise customer signed"]
  If no kill criteria are defined in SRS: flag as PENDING DECISION.

  SUMMARY
  Must Have   : [N] in SRS   |  [N] gaps 
  Good to Have: [N] in SRS   |  [N] gaps 
  Nice to Have: [N] in SRS   |  [N] gaps 

  QUICK WINS (MUST HAVE or GOOD TO HAVE + Effort = S + Gap):
  [list features that are high priority, low effort, and not yet in SRS  address in next SRS update]

---

## STEP 8  Phase development roadmap

Map all features to development phases based on priority and dependencies.
Calculate all phase durations using the complexity formula  never output [estimated].

Complexity weights : S = 1 day  |  M = 3 days  |  L = 5 days
Buffer multiplier  :  1.3 (review, testing, rework overhead)
Risk buffer        :  1.5 instead of  1.3 for any story using a technology marked as new/unfamiliar
                     in the SRS (infer from stack  flag if tech lead is known to be learning it).
Working days/week  : 5
Holiday / leave    : If the delivery window spans public holidays or planned leave, reduce
                     Working days/week accordingly for that phase.
                     Example: 1 public holiday in a 5-day phase  4 working days that week.
                     If leave dates are unknown, note as ASSUMPTION in Step 10.
Developer baseline : 1 developer (solo). If team size is known, divide by headcount.
External dependency buffer : Add 35 days per external service integration in any phase
                     (third-party API onboarding, credential provisioning, rate-limit testing).
                     Note each buffer in the calculation block: "External: +[N]d for [service]"
Parallel workstream : If team size  2, identify stories with no mutual dependencies
                      and mark them as  (parallel). Parallel stories in the same phase
                      run concurrently  their duration is the LONGEST among them, not the sum.
                      Example (2 devs): Story A=3d + Story B=3d with no dependency between them
                        Serial   : 6d  1.3 = 7.8d
                        Parallel : 3d  1.3 = 3.9d  (both run at once)
                      Only mark as  if: (a) no story depends on the other, AND
                                          (b) they don't share the same domain entities or data objects.

Dependency ordering: Before assigning stories to phases, verify story dependencies from Step 2.
  Flag any story placed in Phase N whose dependency story is in Phase N or later.
  DEPENDENCY VIOLATION: [Story A] depends on [Story B] but both are in Phase [N]  move Story A to Phase [N+1].

For every phase that contains stories, output the duration calculation block:

  PHASE [N] DURATION CALCULATION
  Stories in this phase:
    [Story ID] [Title]  [S/M/L]  [X]d
    [Story ID] [Title]  [S/M/L]  [X]d
    External deps      :           +[X]d  ([service name])
    Raw total   : [X]d
     1.3 buffer: [Y]d  (rounded up to nearest half-day)
     5 days/wk : [Z] weeks
  Phase [N] estimated duration: [Z][Z+1] weeks

  PHASE [N] RISK REGISTER
  
   Risk                  Likelihood    Impact        Mitigation                               
  
   [risk description]    High/Med/Low  High/Med/Low  [specific mitigation action]             
  

Then output the full roadmap:

  SPRINT MAPPING (optional  include when tech lead requests sprint breakdown or team size  2)
  
  Sprint cadence  : 2-week sprints (default)  adjust if team uses different cadence
  Sprint capacity : assume [8-9] story points per developer per sprint (1 SP  1 raw day)

  For each phase that has stories, add a sprint breakdown block:

    SPRINT MAPPING  Phase [N]
    Sprint 1 (Days 110): [Story IDs or titles  sum  sprint capacity]
    Sprint 2 (Days 1120): [Story IDs or titles  sum  sprint capacity]
    ...
    Phase [N] = [N] sprints  [N] calendar weeks

  Rules:
    - Respect story dependencies from Step 2 (dependent story goes in later sprint)
    - Parallel workstream stories () can be in the same sprint for different devs
    - Leave 20% sprint capacity for bug fixes, PR reviews, and unplanned work
    - If a story is L complexity, consider splitting it across 2 sprints

  PHASE DEVELOPMENT ROADMAP
  

  Phase 0  SRS & Design (Current)
    Goal      : Approved SRS + UI design + DB design + architecture
    Gate      : /swp-srs approved, /swp-ui approved, /swp-db approved, /swp-arch approved
    Milestone : DESIGN_COMPLETE  all 4 approval gates passed
    DevOps/CI : Set up CI/CD pipeline, linting, test runner, branch protection rules
                CI setup estimate: 12 days (add to Phase 0 if not already done)
    Duration  : [from calculation or standard 12 weeks if no stories]

  Phase 1  Solution Scaffold
    Goal      : Clean build with base classes, middleware, empty project structure
    Gate      : /swp-scaffold green build committed
    Milestone : SCAFFOLD_DONE
    Duration  : 12 days (standard  no feature stories)

  Phase 2  ADO Board Setup
    Goal      : All Epics, Stories, Tasks created in Azure DevOps
    Gate      : /swp-plan complete, docs/BREAKDOWN.md "In ADO"
    Milestone : ADO_READY
    Duration  : 1 day (standard)

  Phase 3  MVP (Must Have features)
    Goal      : All MUST HAVE features built, tested, deployed to staging
    [duration calculation block]
    [risk register block]
  
   Epic           Stories                     Priority         
  
   [Epic name]    [Story titles  brief]      MUST HAVE        
  
    Gate      : All Must Have ACs passing, /swp-audit clean on every story
    Milestone : MVP_STAGING
    Duration  : [from calculation block]

  Phase 4  Post-MVP (Good to Have features)
    Goal      : Good To Have features  significantly raises product quality
    [duration calculation block]
    [risk register block]
  
   Epic / Feature Status in SRS               Priority         
  
   [feature]       In SRS /  Gap to add   GOOD TO HAVE     
  
    Milestone : POST_MVP_STAGING
    Duration  : [from calculation block]

  Phase 5  Quality Gates
    Goal     : Load testing, security pen test, performance profiling
    Checklist:
      [ ] Load test: [N] concurrent users at [X] RPS  target < [Y]ms p95
      [ ] Security: OWASP Top 10 pen test
      [ ] Performance: DB query profiling on largest tables
      [ ] Accessibility: WCAG 2.1 AA (if public-facing)
      [ ] Compliance audit: [list all APPLIES frameworks from Step 4]
    Milestone : QA_SIGN_OFF
    Duration  : 12 weeks (standard)

  Phase 6  Production Deploy
    Goal      : Staging  Production cutover
    Gate      : All Phase 5 checks pass, tech lead sign-off, rollback plan documented
    Rollback plan:
      - Tag the last known-good deploy in git: `git tag ROLLBACK_[version]`
      - DB rollback: down migration script in `./Database/Migrations/down/`  run before redeploying
      - DNS/load-balancer cutback: [specify steps  blue-green swap / slot swap / manual]
      - Notify team via [channel] if rollback triggered
    Milestone : PRODUCTION_LIVE
    Duration  : 13 days (standard)

  Phase 7+  Future Roadmap (Nice to Have)
    Goal     : Deferred features and enhancements  post-launch backlog
  
   Feature        Reason deferred             Suggested phase  
  
   [feature]      [why not MVP]               Phase 7          
  

  ESTIMATED TOTAL: [sum of all phases] weeks

  
  ROADMAP OPEN QUESTIONS:
  1. [Any feature where priority is unclear]
  2. [Any gap where it is unknown if it should be added to SRS]
  3. [Any phase duration that depends on a team size assumption]

---

## STEP 9  Go / No-Go decision

Synthesise all findings from Steps 18 into a scored decision.

Scoring dimensions (100 pts total):

  Dimension                             | Full pts | Full                          | Partial                                | 0 pts
  
  Stack complete                        |  15 pts  | Zero gaps                     | Minor gaps only (no blockers)          | Any critical stack gap
  All stories well-formed               |  15 pts  | All stories pass Step 2       | < 20% of stories have gaps             |  20% stories incomplete
  NFR / Compliance APPLIES addressed    |  15 pts  | All APPLIES items covered     | 12 APPLIES items without coverage     | 3+ APPLIES items unaddressed
  No critical feature gaps (8+)         |  15 pts  | Zero 8+ gaps                  | Exactly 1 gap scoring 8+               | 2 or more gaps scoring 8+
  OWASP Top 10 addressed                |  15 pts  | Zero  OWASP items           | 12  OWASP items                     | 3+  OWASP items unaddressed
  Roadmap is feasible                   |  10 pts  | Calculation + milestones done | Duration high but explained            | Calculation missing or absurd
  L10n/G11n addressed (if APPLIES)      |  10 pts  | All APPLIES L10n covered      | 12 L10n items without coverage        | 3+ L10n items unaddressed / N/A  auto full pts
  Security gaps addressed               |   5 pts  | Zero security gaps            | 1 security gap (non-critical)          | 2+ security gaps OR any OWASP A07/A01 

Output:

  
  GO / NO-GO DECISION
  

  Stack complete              [XX / 15]
  Stories well-formed         [XX / 15]
  NFR / Compliance addressed  [XX / 15]
  No critical feature gaps    [XX / 15]
  OWASP Top 10 addressed      [XX / 15]
  Roadmap feasible            [XX / 10]
  L10n / G11n addressed       [XX / 10]  (auto 10/10 if L10n is N/A for this product)
  Security gaps addressed     [XX /  5]
  
  TOTAL                       [XX / 100]

   GO          85100   SRS is ready. Proceed to /swp-ui and /swp-db.
   CONDITIONAL  5584   Resolve blockers listed below before proceeding.
   NO-GO        < 55    SRS requires major rework. Do not proceed.

  SIGNAL:  GO /  CONDITIONAL /  NO-GO

  If  GO:
  Run /swp-sync validate  confirm SRS  any existing design docs (UI-DESIGN.md, DB-DESIGN.md, ARCH-DESIGN.md) are consistent before proceeding to /swp-arch.
  If /swp-sync reports conflicts: resolve them before leaving this gate.

  Blockers preventing full GO (if any):
  1. [item  which step detected it  what is needed to resolve]
  2. [item  which step detected it  what is needed to resolve]

  Note: Score is floored at 0. If 3+ critical blockers exist the score is effectively
  negative  displayed as 0 with a note "multiple critical blockers detected".

  

---

## STEP 9.5  Self-review + fix loop (runs before presenting to tech lead)

**Target: score  90/100 before advancing to STEP 10. Cap at 3 iterations.**

### Review checklist  run against your own Steps 19 output

STEP 1  Stack check:
   Every category in both sections (core tech + 9 operational) has an explicit  or STACK GAP verdict  none blank
   Every STACK GAP has a specific description of what is missing (not generic "undefined")
   DoD section presence checked  not just stack items
   API versioning consistency verified against all defined endpoints

STEP 2  Story check:
   Every story evaluated on all 12 criteria (including RBAC, idempotency, undo/rollback)  no story skipped
   Every  is specific: names the exact missing item
   Error path AC checked for every story  not just happy path
   RBAC checked for every story  missing role restriction flagged when multiple roles exist

STEP 3  Pseudo code:
   State machines identified  every entity with a status lifecycle flagged
   Financial / scoring / ranking methods flagged
   Concurrency risk noted  parallel writes, queue consumers, optimistic locking
   Retry/backoff identified  external service calls without retry policy
   Webhook processing identified  inbound webhooks without signature validation

STEP 4  NFR + Compliance:
   All 20 NFR rows have an explicit //DEFERRED status  none blank or skipped
   If product uses AI/ML/LLM: all 6 AI/ML NFR rows assessed  none blank or skipped
   OWASP Top 10 checklist present  all 10 items assessed
   All 12 compliance frameworks assessed  none blank
   Detection heuristics applied  every framework checked against SRS text
   All 10 L10n/G11n dimensions have explicit status
   Every  NFR item has a specific description of what is missing
   SmartWorkz UI Standards: all 13 rows assessed for products with a frontend  none blank (or section marked N/A for pure API products)
   Design Principles: all 8 rows assessed for products with a frontend  none blank
   Security Design Principles: all 10 rows assessed  none blank
   AOS scroll-reveal strategy stated or explicitly marked N/A  not silently skipped
   API Design Standards: all 15 rows assessed for products with a backend API  none blank (or section marked N/A for UI-only products)
   HTTP verb discipline checked per backend story  no GET with side effects, no POST for reads
   Response envelope and error shape consistent  no ad-hoc shapes per story
   Coding Standards: all 8 rows assessed  none blank; PII log exclusion explicitly stated
   Architecture Standards: all 10 rows assessed  none blank; architecture pattern named (not "TBD")
   Testing Standards: all 11 rows assessed  none blank; coverage targets are percentages, not "good coverage"
   Definition of Ready (DoR) gate stated  story criteria for sprint entry defined
   Per-story layer assignment and test scenarios checked  not silently skipped for complex stories

STEP 5  Competitors:
   Web search was attempted  competitor names not hallucinated
   AlternativeTo and ProductHunt searches attempted
   At least 3 real named competitors in feature matrix
   G2/Capterra weakness search ran per competitor (or "limited review data" noted)
   Feature matrix has  5 features compared
   Moat analysis table completed

STEP 6  Gap analysis:
   Every  in competitor matrix has a corresponding GAP row with severity score
   Sub-scores (user_impact, frequency, competitive_risk) shown per row
   Security gaps checked: brute-force, CSRF, token rotation, secure headers
   Integration gaps checked: email, payment, SSO/OAuth, push notifications, analytics
   Analytics/telemetry gap checked (Mixpanel / Sentry / PostHog)
   Data import/migration gap checked
   ROI Quick Wins section present (or explicitly "none")

STEP 7  Prioritization:
   Every SRS feature assigned to a tier  none unclassified
   Business Value column (High/Med/Low) filled for every row
   Every gap with score  7 from Step 6 appears in MUST HAVE or GOOD TO HAVE
   Cross-tier dependency check done
   MVP kill criteria stated or flagged as PENDING
   Quick Wins section present (or explicitly "none")

STEP 8  Roadmap:
   Duration calculation block present for every phase that contains stories
   External dependency buffers added where third-party integrations exist
   Risk register block present for every phase with stories
   Milestone markers present for all phases
   Phase 0 includes CI/CD setup estimate
   Phase 6 rollback plan is concrete (not placeholder)
   Buffer multiplier applied per phase and justified
   Dependency violations checked
   Holiday/leave buffer noted or assumption logged

STEP 9  Scoring:
   Score uses 8-dimension rubric (100pts, GO85)
   Score reflects actual findings  not inflated
   Each dimension score justified by specific evidence
   All blockers listed with the step number that detected them

STEP 10  Product Backlog:
   PRODUCT BACKLOG table present  every SRS story and every approved gap appears as a row (none omitted)
   Every gap row has a NEW-[N] ID assigned (not blank)
   Every row has Tier, Phase, Effort, Business Value, and Status filled  no placeholder cells
   Rows ordered: MUST HAVE  GOOD TO HAVE  NICE TO HAVE, then by phase within each tier
   PENDING items marked  (not  or  prematurely)
   Backlog totals block matches Step 7 counts  reconcile if they differ

---

### Fix pass

For every  unchecked item, classify it then act:

**AUTO-FIX**  can be resolved from SRS content alone without a business decision:
  - Missing error-path AC  draft one from the existing happy-path ACs of that story
  - Missing story complexity  estimate S/M/L from description and AC count
  - Missing "none" / N/A justification for NFR or compliance row  write the one-line reason
  - Missing duration calculation  calculate it using the formula from Step 8
  - Severity sub-scores not shown  recalculate and display them
  - Blank "weaknesses" column for a competitor  note "limited review data"
  - Missing external dependency buffer  add 3d default and note the service
  - Business Value blank  infer High/Med/Low from tier + effort

  Action: output the fix inline with label: `[FIXED  item]` then the corrected content.
  Do NOT re-output the full step  only the corrected excerpt.

**PENDING**  requires a business or tech decision (cannot be auto-fixed):
  - New feature to add to SRS
  - Tech stack ambiguity
  - Compliance framework action (e.g. GDPR data processing approach)
  - Business rule needed to draft an AC
  - MVP kill criteria (must be defined by tech lead)
  - RBAC definition (which roles exist and their permissions)

  Action: queue for PENDING DECISIONS table in STEP 10.

---

### Re-score

After all AUTO-FIX items are applied, recalculate the Go/No-Go score using the 8-dimension rubric.
Apply only AUTO-FIX improvements  PENDING items remain as gaps and reduce the score.

Output:

  SELF-REVIEW  Iteration [N]
  
  Checklist items  : [N] total
  Auto-fixed       : [N]  [brief list: "Step 2 error AC for Story 1.3", "Step 8 Phase 3 calc", ...]
  Added to PENDING : [N]  [brief list]
  Score before     : [XX/100]
  Score after      : [XX/100]
                  : +[XX] pts

---

### Loop decision

  IF score  90 OR iteration count = 3:
    Proceed to STEP 10 with final score.
    If score < 90 after 3 iterations, note at top of STEP 10:
      "Max iterations reached  score [XX/100]. [N] gaps remain in PENDING DECISIONS."

  IF score < 90 AND iteration < 3:
    Run the next iteration. Repeat checklist from the top against your updated output.
    Focus on unchecked items not yet addressed  do not re-check already fixed items.

---

## STEP 10  SRS review report

Output the combined summary of all findings from Steps 19.

  SRS REVIEW REPORT
  
  SRS File    : docs/SRS.md
  Version     : [from SRS header]
  Reviewed    : [today's date]
  Go/No-Go    :  GO /  CONDITIONAL /  NO-GO  ([score]/100)
  Self-review : [N] iterations  [N] auto-fixed, [N] pending

  STACK GAPS      : [N]  [list each]
  STORY GAPS      : [N]  [list: story ID + what is missing]
  PSEUDO CODE     : [N] methods need pseudo code  [list each]
  NFR GAPS        : [N]  [list APPLIES items without SRS coverage]
  COMPLIANCE GAPS : [N]  [list frameworks that APPLY but are unaddressed]
  OWASP GAPS      : [N]  [list each A0X item that is ]
  SECURITY GAPS   : [N]  [brute-force, CSRF, token rotation, secure headers  list each ]
  L10N/G11N GAPS  : [N]  [list localization/globalization items without SRS coverage]
  UI STANDARDS GAPS: [N]  [SmartWorkz design tokens, BEM, AOS, responsive, skeleton loaders  list each ]
  DESIGN PRINCIPLE GAPS: [N]  [visual hierarchy, whitespace, smooth interactions  list each ]
  SEC DESIGN GAPS : [N]  [least privilege, defense in depth, fail secure, output encoding  list each ]
  API DESIGN GAPS : [N]  [RESTful naming, verb discipline, response envelope, error shape, status codes, pagination  list each ]
  CODING STD GAPS : [N]  [naming conventions, error hierarchy, async pattern, constants, structured logging  list each ]
  ARCH GAPS       : [N]  [layer boundaries, SOLID violations, DI lifetime, module boundaries, circular deps  list each ]
  TESTING GAPS    : [N]  [coverage targets, pyramid shape, AAA pattern, test isolation, DoR, test data strategy  list each ]
  FEATURE GAPS    : [N total]  [N] critical  (8+) | [N] significant  | [N] minor 
  COMPETITOR GAPS : [N]  [list features all/most competitors have that you lack]
  INTEGRATION GAPS: [N]  [list third-party integrations implied but absent from SRS]
  ANALYTICS GAPS  : [N]  [product analytics, error telemetry  list each ]

    CRITICAL BLOCKERS (score 8+):
  1. [gap name  X/10  from Step N]
  2. [gap name  X/10  from Step N]

  PENDING DECISIONS  Tech lead must resolve before "SRS approved"
  
   #   Gap / Item            Score  Decision Needed                Reply with                               
  
   1   [gap name]            X    [what must be decided]         "add to SRS: [name]  [priority]"        
   2   [gap name]            X    [what must be decided]         "resolve [item]: [answer]"               
   3   [framework name]      N/A    APPLIES  not addressed        "resolve [framework]: [approach]"        
   4   [gap name]            X    [what must be decided]         "move [feature] to phase [N]"            
  

  [N] decisions pending. SRS cannot be approved until all  items are resolved.
   and  items may be deferred  tech lead must explicitly confirm each.

  OPEN QUESTIONS FOR TECH LEAD:
  1. [question]
  2. [question]

  ASSUMPTIONS MADE DURING THIS REVIEW (verify before approving):
  
   #   Assumption                                                    Source                   
  
   1   [e.g. "Target market is UK  inferred from currency "]       [SRS section / inferred] 
   2   [e.g. "Solo developer  no team size stated in SRS"]          [SRS section / inferred] 
  
  If any assumption is wrong, correct it and reply "re-run step [N]" to refresh that section.

  PRODUCT BACKLOG
  

  Ordered by: Priority tier  Phase  Business Value (High first within tier)

  ID key:
    [Story ID]   story present in SRS (e.g. US-1.1, EP2-S3)
    NEW-[N]      gap-sourced story not yet in SRS; needs adding if approved
    Status:  In SRS   Gap (needs adding to SRS)   PENDING decision

  
   ID         Story / Feature                       Epic              Tier   Phase  Effort  Bus. Value  Status 
  
   [Story ID] [short user story title]              [Epic name]       MUST   Ph 3   M       High             
   NEW-1      [gap feature  add if approved]       [Epic or TBD]     MUST   Ph 3   S       High             
   [Story ID] [short user story title]              [Epic name]       GOOD   Ph 4   L       Med              
   NEW-2      [gap feature  pending decision]      TBD               GOOD   Ph 4   M       Med              
   [Story ID] [short user story title]              [Epic name]       NICE   Ph 7+  S       Low              
  

  BACKLOG TOTALS
  
  MUST HAVE    : [N] stories  [N] in SRS + [N] gaps  raw effort [X]d
  GOOD TO HAVE : [N] stories  [N] in SRS + [N] gaps  raw effort [X]d
  NICE TO HAVE : [N] stories  [N] deferred to Phase 7+
  PENDING      : [N] items awaiting tech lead decision
  
  Total        : [N] backlog items across [N] Epics

  

  EXECUTIVE SUMMARY (1-page snapshot for non-technical stakeholders  optional, generate when requested)
  
  Product       : [product name from SRS]
  Problem solved: [1 sentence  what user pain does this address]
  Target users  : [who uses this e.g. "SMB operations managers, 550 person teams"]
  Go/No-Go      : [ GO /  CONDITIONAL /  NO-GO]  [score]/100
  SRS version   : SRS-v[X.X] | Reviewed: [date]

  Top 5 Must Have features:
    1. [feature  1 line why it matters]
    2. [feature  1 line why it matters]
    3. [feature  1 line why it matters]
    4. [feature  1 line why it matters]
    5. [feature  1 line why it matters]

  Roadmap summary:
    MVP ready    : Phase 3  est. [N] weeks from scaffold
    Full product  : Phase 4  est. [N] additional weeks
    Production    : Phase 6  total est. [N] weeks end-to-end

  Key risks      : [top 2 risks from Step 8 risk registers  1 line each]
  Decision needed: [top 12 PENDING DECISIONS from Step 10  1 line each]
  

---

## STEP 11  Phase 0 gate

  
  PHASE 0 GATE
  To resolve SRS gaps     : "resolve [item]: [answer]"
  To add a gap feature    : "add to SRS: [feature name]  [priority]"
  To adjust roadmap       : "move [feature] to phase [N]"
  To defer a gap          : "defer [item] to phase [N]"
  To accept risk          : "accept risk: [item]"
  To accept all LOW items : "accept all minor items"
  To re-run a step        : "re-run step [N]" (after major SRS changes, refreshes that step only)
                            Re-run behaviour: re-reads the current docs/SRS.md, re-executes only
                            that step's checks against the updated content, then outputs ONLY the
                            delta  verdicts that changed are marked [CHANGED], new findings marked
                            [NEW], resolved findings marked [RESOLVED]. Unchanged verdicts omitted.
                            If no changes are detected: output "Step [N] re-run: no changes detected."
  To correct an assumption: "assumption [N] is wrong: [correct value]" then "re-run step [N]"
  To split a large epic   : "split epic: [epic name]"  Claude will propose sub-epics with story distribution
  To change backlog tier  : "backlog: move [ID] to [MUST/GOOD/NICE]"  updates tier and phase in backlog table
  To change backlog phase : "backlog: move [ID] to phase [N]"  updates phase assignment in backlog table
  To approve              : "SRS approved"

  Claude will not proceed to /swp-ui or /swp-db until "SRS approved".
  

[STOP  wait for "SRS approved"]

---

## STEP 12  After "SRS approved"

1. For each gap feature the tech lead approved adding: append it to the existing grouped SRS doc if one exists, otherwise create/use `docs/[GGG].[NNN].srs-[YYYY-MM-DD].md`, under the
   correct Epic, with user story format + 25 ACs + complexity + priority tier.

2. For each pending decision resolved: update the relevant SRS section to reflect the answer.

3. Update the SRS revision history table with today's date and a summary of changes.

4. Commit the updated SRS using the Standalone Approval Publish Contract:
     git add docs/*.*.srs-*.md docs/SRS.md
     git commit -m "docs(srs): SRS review complete  [N] gaps resolved, [N] features added"
     git tag SRS-v[X.X]
     git push --tags
     git push origin HEAD

5. If docs/COMPETITOR-ANALYSIS.md does not exist: create it and save the full competitor
   discovery output (domain, search queries, feature matrix, position summary) from Step 5.
   If it exists: append the new review date and any new findings.
     git add docs/COMPETITOR-ANALYSIS.md
     (include in the docs commit below)

6. Seed the existing grouped ENTITIES doc if one exists, otherwise create the next group-sequence file `docs/[GGG].[NNN].entities-[YYYY-MM-DD].md`, with every entity class identified in the SRS:
   For each entity mentioned in the SRS (noun that is stored, retrieved, or modified):
      Add a placeholder row to docs/ENTITIES.md under the relevant schema heading.
      Use format: `| [Schema].[EntityName] | Id, [key columns inferred from SRS] | [Yes/No] | [Yes/No] | TBD  /swp-db |`
   If no grouped or legacy ENTITIES doc exists: create `docs/[GGG].[NNN].entities-[YYYY-MM-DD].md` with schema headings from bounded contexts found in SRS.
   Note in the row: "Pre-seeded from SRS  full design in /swp-db"
     git add docs/ENTITIES.md
     (include in the docs commit below)

6b. For each state machine detected in STEP 3 (entity with a status lifecycle):
   Generate a Mermaid state diagram and append it to docs/ENTITIES.md under the entity's section.
   Use this format:

   ```mermaid
   stateDiagram-v2
     [*] --> [FirstState]
     [FirstState] --> [NextState] : [trigger or event]
     [NextState] --> [FinalState] : [trigger or event]
     [FinalState] --> [*]
   ```

   Label: `## State Machine: [EntityName]` above each diagram.
   If STEP 3 found no state machines: skip this step.
   If docs/ENTITIES.md does not yet exist: step 6 above will have created it  append to that file.
     git add docs/ENTITIES.md
     (update already staged above  no additional git add needed)

7. Create the existing grouped BREAKDOWN doc if one exists, otherwise create the next group-sequence file `docs/[GGG].[NNN].breakdown-[YYYY-MM-DD].md`  Phase 0 header (flow phases written in STEP 13):
   If no grouped or legacy BREAKDOWN doc exists: create it fresh using the next group sequence number.
   If it already exists and already has flow phase rows below Phase 0: skip this step entirely.

   Write (or confirm present) the following in docs/BREAKDOWN.md:

   # Project Breakdown
   SRS Version : SRS-v[X.X]
   Generated   : [today's date]
   Generated by: /swp-srs
   Flow        : [PATH CONFIRMED not yet set  written by STEP 13]

   ## Phase 0  SRS Review            [x] [today's date]
     - SRS-v[X.X] approved. [N] Epics, [N] Must Have features.

    Flow-specific phase rows appended by STEP 13 after PATH CONFIRMED is locked

     git add docs/*.*.breakdown-*.md docs/BREAKDOWN.md
     (include in the docs commit below)

7b. Write docs/BACKLOG.md  the approved product backlog:
   Export the final PRODUCT BACKLOG table from Step 10 as a standalone file.
   Include: the full backlog table, BACKLOG TOTALS block, and the SRS version + date header.
   Replace all  PENDING rows with their resolved status ( or ) based on tech lead decisions.
   NEW-[N] rows that were approved  status =  (to be added in step 1 of this workflow).
   NEW-[N] rows that were deferred  update Phase and Tier accordingly.
   Format header:
     # Product Backlog
     SRS Version : SRS-v[X.X]
     Approved    : [today's date]
     Generated by: /swp-srs
   If docs/BACKLOG.md exists: overwrite it  this is always the current approved backlog.
     git add docs/BACKLOG.md
     (include in the docs commit below)

7c. Append to docs/SRS-HISTORY.md (create if not exists):

   Format:
   | SRS-v[X.X] | [today's date] | [score]/100 | [ GO /  CONDITIONAL /  NO-GO] | [N] Epics | [N] Must Have | [N] Good To Have | [N] gaps resolved | [N] gaps pending |

   If docs/SRS-HISTORY.md does not exist: create it with this header first:
   # SRS Review History
   | Version | Date | Score | Signal | Epics | Must Have | Good To Have | Gaps Resolved | Gaps Pending |
   |---|---|---|---|---|---|---|---|---|

   Then append the data row.
     (docs/SRS-HISTORY.md is included in the git add in step 8 below)

8. Update README.md and CHANGELOG.md  separate docs commit:

   README.md  patch Project Status section:
     Phase badge   "Phase 0  SRS Review Complete"
     Last updated  [today]
   README.md  patch Features section:
     Add a row per Must Have feature with status "Planned"

   CHANGELOG.md  add under [Unreleased]  ### Added:
     - Phase 0 complete: SRS-v[X.X] approved  [N] Epics, [N] Must Have / [N] Good To Have / [N] Nice To Have features

   If docs/CONTEXT.md exists: update the Phase field to "Phase 0  SRS Approved" and
   set SRS Version to the new tag.

     git add README.md CHANGELOG.md docs/CONTEXT.md docs/COMPETITOR-ANALYSIS.md docs/*.*.entities-*.md docs/ENTITIES.md docs/*.*.breakdown-*.md docs/BREAKDOWN.md docs/BACKLOG.md docs/SRS-HISTORY.md
     git commit -m "docs(phase-0): update README, CHANGELOG, CONTEXT, ENTITIES, BREAKDOWN, BACKLOG  SRS review complete"
     git push origin HEAD
     Create or update the PR to `develop` using `.claude/refs/approval-publish-contract.md`.
     Do not use GitHub PR commands for Azure DevOps repositories.

9. Downstream impact analysis:

   Compare current SRS version against the previous version. Use the SRS revision history
   table and git diff (if available) to identify what changed. If this is the first version,
   all entities and stories are "new"  output accordingly.

   Output:

     DOWNSTREAM IMPACT  SRS-v[X.X]
     
     New entities identified          : [list entity names, or "none"]
     Modified / removed entities      : [list, or "none"]
     New stories added                : [list Story IDs, or "none"]
     Modified ACs on existing stories : [Story ID  what changed, or "none"]
     New screens implied              : [list from new frontend story ACs, or "none"]
     Removed features                 : [list, or "none"]

     Impact on docs/UI-DESIGN.md:
        No changes needed
       OR
         [N] screens affected  run: /swp-ui [feature] to update delta only
          [Screen name]  triggered by: [which story/AC changed]
          [Screen name]  triggered by: [which story/AC changed]

     Impact on docs/DB-DESIGN.md:
        No changes needed
       OR
         [N] tables/SPs affected  run: /swp-db [feature] to update delta only
          [Table or SP name]  triggered by: [which entity/AC changed]

     Impact on docs/ARCH-DESIGN.md:
        No changes needed
       OR
         [N] sections affected  run: /swp-arch [feature] to update delta only
          [Section name]  triggered by: [what changed]

     Shortcuts:
       Validate all cross-doc consistency  : /swp-sync validate
       Cascade one feature end-to-end      : /swp-sync [feature name]
     

10. Output:
     PHASE 0 COMPLETE
     SRS Version  : [tag]
     Stories      : [N] across [N] Epics
     Must Have    : [N] features  ([N] in SRS, [N] added from gaps)
     Good to Have : [N] features  ([N] in SRS, [N] added from gaps)
     Nice to Have : [N] features  (deferred to Phase 7+)
     Backlog      : [N] items total  docs/BACKLOG.md written
     Roadmap      : [N] phases, estimated [X] weeks
     ENTITIES.md  : [N] entities pre-seeded from SRS
     Next         : Run /swp-arch (Phase 1  architecture must be approved before UI/DB)

  Prompt tech lead:
  "SRS is approved and tagged. BREAKDOWN.md created with all phase checkpoints.
   Run /swp-arch next  architecture must be approved before UI/DB design can begin.
   Run /swp-sync to keep all phase documents current."

