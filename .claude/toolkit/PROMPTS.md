# PROMPTS.md — SmartWorkz Claude Code Prompt Templates
# FALLBACK ONLY — use slash commands in Claude Code as the primary interface.
# These templates are for environments where .claude/commands/ slash commands are unavailable.
# Primary commands: /swd-start /swd-next /swd-unit-test /swm-bug /swd-submit /swp-plan
# Version: 2.1

---

## SESSION START (paste first in every session)

```
Read in this order:
1. CONTEXT.md (if exists for this story)
2. CLAUDE.md
3. DECISIONS.md
4. ENTITIES.md

Story: [ADO Story ID] — [Story Title]
SRS Version: [SRS-vX.X]
Current subtask: [Subtask name]

First: scan the codebase for anything related to this task.
Output your SCAN RESULT before writing any code.
Wait for my approval before proceeding.
```

---

## NEW REPOSITORY

```
Create a new repository class for [EntityName].

Files to create:
- Interfaces/I[EntityName]Repository.cs
- Repositories/[EntityName]Repository.cs

Implement these methods only:
- Task<[EntityName]?> GetByIdAsync(int id, int tenantId)
- Task<List<[EntityName]>> GetAllAsync(int tenantId)
- Task<int> InsertAsync([EntityName]Dto dto) — calls usp[EntityName]Insert
- Task UpdateAsync([EntityName]Dto dto)      — calls usp[EntityName]Update
- Task DeleteAsync(int id, int tenantId)     — soft delete via usp[EntityName]Delete

Follow CLAUDE.md §14 for SP naming.
No other methods. Stop after writing. Wait for build confirmation.
```

---

## NEW SERVICE

```
Create a new service for [FeatureName].

Files to create:
- Interfaces/I[FeatureName]Service.cs
- Services/[FeatureName]Service.cs

Constructor inject: I[EntityName]Repository, IUnitOfWork, ILogger<[FeatureName]Service>

Implement: [method name from SRS/task]
[Paste SRS pseudo code block here if exists]

Follow CLAUDE.md §4 pseudo code protocol.
Output TRANSLATION CHECK before building.
Stop after writing. Wait for build confirmation.
```

---

## NEW API ENDPOINT

```
Create a new API endpoint for [FeatureName].

File: Controllers/[FeatureName]Controller.cs

Endpoint:
  Method  : [GET/POST/PUT/DELETE]
  Route   : api/[resource]/[route]
  Auth    : [Authorize(Roles="...")] or [AllowAnonymous]
  Request : [RequestDtoName]
  Response: [ResponseDtoName] wrapped in ApiResponse<T>

Constructor inject: I[FeatureName]Service, ILogger<[FeatureName]Controller>

Controller only — no business logic. Delegate all logic to service.
Output AC traceability after writing.
Stop after writing. Wait for build confirmation.
```

---

## NEW STORED PROCEDURE

```
Create a stored procedure file.

File: Database/StoredProcedures/[Schema]/usp[Entity][Action].sql

Action: [Insert / Update / Delete / Get / GetAll]
Table : [schema].[TableName]
Params: [list params with SQL types]
Returns: [what it returns — rows / affected count / output param]

Follow CLAUDE.md §14 SP file structure exactly.
Add the migration to deploy it: Database/Migrations/[timestamp]_AddUsp[Entity][Action].cs
Stop after writing. Wait for build confirmation.
```

---

## NEW ANGULAR COMPONENT

```
Create a new Angular component for [FeatureName].

Files:
- src/app/[feature]/components/[name]/[name].component.ts
- src/app/[feature]/components/[name]/[name].component.html
- src/app/[feature]/components/[name]/[name].component.scss

Service to inject: [FeatureName]Service

Inputs: [list @Input() properties]
Outputs: [list @Output() EventEmitters]
State  : [BehaviorSubject / NgRx — per CLAUDE.md §17]

Use standalone component (no NgModule).
No inline styles — use .scss file only.
All strings in component must use i18n keys if multi-language.
Stop after writing. Wait for build confirmation.
```

---

## NEW ANGULAR SERVICE

```
Create a new Angular service for [FeatureName].

File: src/app/[feature]/services/[name].service.ts

HTTP calls:
- [method]: [HTTP verb] [endpoint] → returns [type]

Inject: HttpClient
State : [BehaviorSubject<[type]> for [what]] or [none]

All methods return Observable<T>.
No .subscribe() inside the service — let components subscribe.
Stop after writing. Wait for build confirmation.
```

---

## WRITE UNIT TESTS

```
Write xUnit unit tests for [ClassName].[MethodName].

These are the test cases (plain English from spec):
1. [Case 1]
2. [Case 2]
3. [Case 3]

File: Tests/[Layer]/[ClassName]Tests.cs

Rules:
- Mock all dependencies with Moq
- No real DB, HTTP, or file system calls
- Arrange / Act / Assert pattern
- Naming: [Method]_[Condition]_[Expected]

Do not invent additional test cases. Cover only the cases listed above.
Stop after writing. Wait for test run confirmation.
```

---

## FIX BUILD ERROR

```
Build error after your last output:

ERROR:
[paste exact error text]

FILE:
[paste the file that errored]

Fix ONLY this specific error.
Do not refactor. Do not change any other logic.
Explain the root cause in one sentence before fixing.
List the exact lines changed.
```

---

## DISCARD AND RESTART SUBTASK

```
3 fix attempts failed. DISCARD TRIGGERED.

Describe in one sentence what went wrong.
Recommend a narrower approach for this subtask.
Wait for my approval of the new approach before writing any code.
```

---

## SELF REVIEW

```
Before I run the build:
Review the code you just wrote against CLAUDE.md conventions.

Check:
1. Naming follows §18 (PascalCase, SP prefix, namespace)
2. No hardcoded strings — all in ErrorCodes.cs or constants
3. async/await used everywhere
4. Error handling present (try/catch or domain exceptions)
5. No secrets or connection strings
6. ILogger calls present at entry and error points
7. No duplicate of existing methods (per SCAN RESULT)
8. No files touched outside this subtask scope

List any violations. Fix them. Then say "Self review complete."
```

---

## SECURITY REVIEW

```
Security review of the code you just wrote:

Check:
1. SQL injection risk? (parameterised queries used?)
2. Unvalidated input reaching DB or file system?
3. Sensitive data (password, OTP, PAN) being logged?
4. Hardcoded credentials anywhere?
5. Endpoint missing [Authorize] when it should require auth?
6. CORS policy respected?
7. JWT claims validated before use?

List any risks found. Fix them before I run the build.
If no risks: output "Security review — no issues found."
```

---

## AC TRACEABILITY CHECK

```
Output AC traceability table for this task:

Format:
  AC1: [AC text] → [MethodName] → [TestMethodName]
  AC2: [AC text] → [MethodName] → [TestMethodName]
  AC3: [AC text] → NOT covered → needs subtask: [description]

No commit until every AC has a method AND a test mapped.
```

---

## SESSION END SUMMARY

```
Session is ending. Output the session summary:

  SESSION SUMMARY — [Date]
  Story    : [ADO story ID and title]
  Tasks done this session: [list with ADO IDs]
  Files created: [list with paths]
  Files modified: [list with paths]
  Decisions made:
    1. [decision] — [reason]
    2. [decision] — [reason]
  New entities added to ENTITIES.md: [list or none]
  Next session starts at: [subtask name]
  Open questions: [list or none]

I will paste the decisions into DECISIONS.md.
```

---

## SPRINT RELEASE NOTES

```
Generate release notes for Sprint [N].

From these ADO task titles and commit messages:
[paste task titles / commit list]

Format:
  ## Sprint [N] Release Notes — [Date]
  
  ### New Features
  - [feature]: [what it does, user-facing]
  
  ### Improvements
  - [improvement]
  
  ### Bug Fixes
  - [fix]
  
  ### Breaking Changes
  - [change + migration steps if any]
  
  ### Deployment Steps
  1. [step]
  2. Run DB migrations: dotnet ef database update
  3. [step]
```

---

## PHASE COMPLETION — README + CHANGELOG UPDATE

```
Phase [N] is now complete.

Update README.md and CHANGELOG.md.

README — update these sections only (do not rewrite other sections):
  1. Project Status table: mark Phase [N] as ✅ Done with today's date
  2. Project Status table: mark Phase [N+1] as 🔵 In Progress
  3. [Any section specific to this phase — e.g. Tech Stack at Phase 1, Architecture at Phase 2]
  4. Update the last-updated badge date

CHANGELOG — add under [Unreleased] → Added:
  "Phase [N] ([Phase Name]) complete — [what is now true about the project]"
  Also update the Phase Log table.

Output the exact markdown diff for each file.
I will paste it in and run:
  commit.ps1 -Type phase -Id [N] -Message "[summary]"
```

---

## STORY MERGE — README + CHANGELOG UPDATE

```
Story [ADO-ID] '[Story Title]' has been merged to develop.

Update README.md and CHANGELOG.md.

README — update these sections only:
  1. Features table: change "[Feature Name]" status from 🔵 In Progress → ✅ Done
  2. API Reference: add any new endpoints this story introduced (if none, skip)
  3. Database → Migration History: add any new migration (if none, skip)
  4. Update the last-updated badge date

CHANGELOG — add under [Unreleased] → Added:
  "[User-facing description of what this story delivers — no technical jargon]"

Output the exact markdown diff for each file.
I will paste it in and run:
  commit.ps1 -Type story -Id [ADO-ID] -Message "[Story Title]"
```

---

## EPIC CLOSED — README + CHANGELOG UPDATE

```
Epic [EPIC-ID] '[Epic Name]' is now fully complete.

Update README.md and CHANGELOG.md.

README — update:
  1. Features table: all stories under this Epic → ✅ Done
  2. Update the version badge if this Epic completes a MINOR version

CHANGELOG — add under [Unreleased] → Added:
  "Epic complete: [Epic Name] — [summary of what the full feature group delivers]"

Output the exact markdown diff.
I will run:
  commit.ps1 -Type epic -Id [EPIC-ID] -Message "[Epic Name]"
```

---

## RELEASE — PROMOTE CHANGELOG + VERSION BADGES

```
We are releasing version [X.Y.Z].

Update README.md and CHANGELOG.md for the release.

README — update:
  1. Version badge: Version-[X.Y.Z]-blue
  2. Build badge: Build-passing-brightgreen
  3. Project Status: Phase 6 Deploy → ✅ Done with today's date
  4. Update the last-updated badge date

CHANGELOG — promote:
  1. Rename [Unreleased] → [vX.Y.Z] — [today's date]
  2. Add a fresh empty [Unreleased] section above it with empty Added/Changed/Fixed/Removed
  3. Update Phase Log: Phase 6 date column

Output the exact markdown diff.
I will run:
  commit.ps1 -Type release -Id [X.Y.Z] -Message "[release description]"
```

---

## HOTFIX — CHANGELOG UPDATE

```
Hotfix [ADO-ID] '[description]' has been merged.

Update CHANGELOG.md only (README does not change for hotfixes).

CHANGELOG — add under [Unreleased] → Fixed:
  "[What was broken and what the fix does — user-facing language]"

Output the exact markdown line to add.
I will run:
  commit.ps1 -Type hotfix -Id [ADO-ID] -Message "[description]"
```
