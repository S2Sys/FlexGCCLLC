---
name: swp-audit
description: >
  Run full project-wide code quality, security, and architecture audit.
  Use when: pre-release deep dive, post-refactor verification, security review,
  architecture assessment, compliance scan, quality gate check, or OWASP check.
compatibility: Any stack  multi-stack security and code quality audit
Command  : /swp-audit
Version  : 2.1
Updated  : 2026-05-21
| Version | Date       | Author  | Changes                                                                                         |
|---------|------------|---------|-------------------------------------------------------------------------------------------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |

| 1.2     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.1     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.0     | 2026-05-14 | Zenthil | Created as project-wide code quality + security audit (consolidated from /swd-review + /swm-review)|

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

---

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

Final output must include a `RUN SUMMARY` with the same fields. If a phase/stage is skipped, say `Skipped` with reason and impact. If partially failed, show recovery status and do not mark it done.
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

## Skill Optimization Contract

Before final output, run this optimization pass:

1. Re-check the command description and confirm the output satisfies every promised capability.
2. Confirm required inputs and mark missing or weak evidence as `DATA GAP`; do not invent data, approvals, metrics, IDs, costs, dates, or verification results.
3. Convert findings into action-ready items with owner, priority, expected impact, effort, confidence, verification method, and next command or stakeholder.
4. Include a quality scorecard in the final artifact or final response:

| Area | Status | Evidence | Required Follow-up |
|---|---|---|---|
\|\ Input\ completeness\ \|\ PASS\ /\ CONDITIONAL\ /\ BLOCKED\ \|\ \[sources]\ \|\ \[action]\ \|
| Evidence quality | PASS / CONDITIONAL / BLOCKED | [proof] | [action] |
| Output actionability | PASS / CONDITIONAL / BLOCKED | [owners/priorities] | [action] |
| Handoff clarity | PASS / CONDITIONAL / BLOCKED | [next command/owner] | [action] |
| Verification | PASS / CONDITIONAL / BLOCKED | [checks] | [action] |
| Documentation sync | PASS / CONDITIONAL / BLOCKED / N/A | [docs reviewed] | [action] |

If any area is `BLOCKED`, stop and report blockers instead of marking the workflow complete.

---

Run full project-wide code quality and security audit.
Covers code quality, security (OWASP A01/A02/A03/A05/A06/A07/A09), architecture vulnerabilities, multi-tenancy, soft-delete patterns,
CLAUDE.md compliance, and SRS NFR enforcement.

> **Note:** This review runs automatically inside `/swd-submit` before every commit.
> Run `/swp-audit` directly for standalone audits (e.g., pre-release deep dive, security review, architecture assessment, or post-refactor verification).

Read CLAUDE.md, docs/SRS.md (STACK CONFIRMED), and CONTEXT.md before scanning.

IF docs/SRS.md does not exist:
  HARD STOP: "docs/SRS.md not found  cannot confirm stack. Run /swp-srs first."

If $ARGUMENTS provided, scope the audit to those files. Otherwise scan all files in the project.

---

## STEP 1  Identify scope

Determine audit target:

  AUDIT SCOPE:
  Target    : [Project-wide / Story / Feature / Architecture layer  from $ARGUMENTS]
  Files     : [list every production file to audit  exclude tests, docs, build artifacts]
  Stack     : [from STACK CONFIRMED in docs/SRS.md]
  Baseline  : [CLAUDE.md + docs/SRS.md]

---

## STEP 2  CLAUDE.md compliance

> **Stack note:** Before scanning, confirm the project's stack from `STACK CONFIRMED` in `docs/SRS.md`. Items marked *(stack-specific)* below apply only if the relevant technology is in use  skip silently for non-applicable stacks.

Check every file against the rules in CLAUDE.md. For each violation found, output:

  VIOLATION [HIGH/MEDIUM/LOW]: [rule from CLAUDE.md]
  File  : [path]
  Line  : [line number]
  Found : [what is there]
  Fix   : [what it should be]

Sample checklist (adapt to your stack):

   No raw SQL strings in production code  use parameterized queries / SPs only *(stack-specific: SQL)*
   No hardcoded secrets, API keys, passwords, or tokens
   All DTOs used at API boundary  entity models never exposed directly
   Logging configured  ILogger<T> injected, not Console.WriteLine *(stack-specific: .NET)*
   No magic numbers  use named constants or config
   No commented-out code
   No TODO comments  raised as ADO tasks instead
   Consistent naming across all layers (controllers, services, repositories)
   DI container properly configured  no tight coupling *(stack-specific: .NET)*
   Proper async/await usage  no sync-over-async antipatterns *(stack-specific: .NET/JS)*
   Error handling centralized  GlobalExceptionMiddleware or equivalent
   Schema-qualified names in SQL (e.g., [dbo].[TableName]) *(stack-specific: SQL Server)*

---

## STEP 3  Architecture vulnerability check

Assess structural integrity:

  ARCHITECTURE CHECK:
   Layering: Clear separation of Presentation / API / Service / Data layers (no cross-layer skipping)
   Dependencies: Unidirectional (controllers  services  repositories, never reverse)
   Coupling: No circular dependencies detected
   Patterns: Factory, Repository, DI applied consistently
   Scalability: Stateless services, no instance variables carrying request context
   Testability: Can unit test each layer independently (good mock seams)
   Configuration: Environment-specific settings externalized (appsettings, env vars, vault)
   Caching: Proper cache invalidation strategy (no stale cached data)
   Database: Indexes on foreign keys, partitioning for large tables (if SRS specifies)

Output per vulnerability:
  ARCHITECTURE ISSUE [HIGH/MEDIUM]: [description]
  Impact : [what fails / performance loss / maintainability risk]
  Fix   : [specific refactoring needed]

---

## STEP 4  Multi-tenancy and soft-delete audit

Check every query:

  MULTI-TENANCY CHECK:
  For each method that queries a tenant-scoped table:
     TenantId filter enforced (EF: .Where(x => x.TenantId == currentTenant))
     No cross-tenant data exposure in responses
  Missing = HIGH violation

  SOFT-DELETE CHECK:
  For each read query:
     IsDeleted filter applied (.Where(x => !x.IsDeleted))
     No deleted records appear in results
  Missing = MEDIUM violation

Output per method:
  [MethodName]: TenantId  | IsDeleted 
  [MethodName]: TenantId  | IsDeleted  MISSING  add .Where(x => !x.IsDeleted)

---

## STEP 5  Security review (OWASP A01/A02/A03/A05/A07/A09)

> **Scope note:** This audit covers A01, A02, A03, A05, A06, A07, and A09. Categories A04 (Insecure Design), A08 (Software/Data Integrity), and A10 (SSRF) are out of scope for this command.

  A01  Broken Access Control
   Every endpoint has [Authorize] or explicit [AllowAnonymous]
   Role checks match SRS requirements
   TenantId enforced on every query (no cross-tenant access)
   No IDOR  entity lookups include TenantId + role check

  A02  Cryptographic Failures
   No real secrets in config files
   No hardcoded credentials in code
   Passwords: hashed (bcrypt/scrypt), never stored plaintext
   JWT: ValidateIssuerSigningKey=true, ClockSkew=TimeSpan.Zero
   TLS enforced (app.UseHttpsRedirection())

  A03  Injection
   Zero raw SQL strings  parameterized only
   Stored procedures use typed @Parameters (no string concatenation)
   No dynamic SQL or command injection risks
   Input validation on all user-supplied data

  A05  Security Misconfiguration
   app.UseHttpsRedirection() present
   Swagger disabled in Production
   Error responses never leak stack traces or internal details
   CORS policies don't use AllowAnyOrigin without restriction
   Security headers set (X-Content-Type-Options, X-Frame-Options, CSP)

  A06  Vulnerable and Outdated Components
   Run `dotnet list package --vulnerable --include-transitive`  zero HIGH/CRITICAL CVEs
   Run `npm audit --audit-level=high` (if frontend present)  zero HIGH/CRITICAL issues
   All NuGet/npm packages on actively maintained versions (no end-of-life)
   No pinned package versions with known CVEs (check NVD / GitHub Advisories)

  A07  Authentication Failures
   JWT middleware registered before UseAuthorization
   Token expiry enforced (no indefinite sessions)
   Refresh token rotation implemented (if applicable)
   Password reset / forgot password flow secure (token expiry, email verification)

  A09  Logging Failures
   Exception details logged with CorrelationId
   Log levels correct: Error for 5xx, Warning for 4xx, Info for success
   No sensitive data in logs (passwords, OTPs, card numbers, PII, raw JWTs)
   TenantId and UserId added to log context
   Logs not exposed in error responses to clients

For each OWASP item: output PASS or:
  OWASP [code] VIOLATION [HIGH]: [what is wrong]
  File  : [path:line]
  Fix   : [specific change needed]

  **Scope Exclusions  not covered by this audit:**
   OWASP A04 (Insecure Design)  threat modeling and security requirements review
   OWASP A08 (Software/Data Integrity)  CI/CD pipeline security, deserialization validation
   OWASP A10 (SSRF)  server-side request forgery in outbound HTTP calls
   Infrastructure/IaC security  container configs, cloud IAM, network policies
   Git history secret scanning  use `git log -p | grep -iE "password|secret|token"` or trufflehog separately

---

## STEP 6  AC traceability (if story-scoped)

If auditing a specific story, verify ACs from docs/SRS.md and CONTEXT.md:

  AC TRACEABILITY:
  AC1: [text]  [implemented in MethodName / file]  [test coverage]  COVERED / MISSING
  AC2: [text]  [implemented in MethodName / file]  [test coverage]  COVERED / MISSING

  Any AC with no implementation = HIGH violation
  Any AC with no test = MEDIUM violation

---

## STEP 7  SRS NFR enforcement

Read docs/SRS.md for declared NFRs. Only check those marked  APPLIES.

  SRS NFR ENFORCEMENT:
  
   NFR                 Check                                         Status   
  
   Performance target  [SRS-defined target e.g. <200ms p95] present  //N/A
   Pagination          List endpoints use PagedResult<T> + params    //N/A
   Rate limiting       [EnableRateLimiting] on high-frequency calls  //N/A
   Audit logging       All data changes logged with timestamp/user   //N/A
   Soft delete         All reads: IsDeleted filter applied           //N/A
   Tenant scope        All queries include TenantId from context     //N/A
   Error codes         All errors use centralized ErrorCodes         //N/A
   GDPR compliance     No PII logged; erasure implemented            //N/A
   HIPAA compliance    PHI encrypted; access audited                 //N/A
   PCI-DSS compliance  Card data not stored; masked in logs          //N/A
  

  N/A = NFR not applicable to this audit scope.
  Any  = HIGH violation

---

## STEP 8  Audit report

  
  PROJECT AUDIT REPORT  /swp-audit
  Scope   : [Project-wide / Story / Feature]
  Files   : [N] reviewed
  Date    : [today]
  

   HIGH (must fix) 
  [List each HIGH violation with file:line and fix instruction]
  [None] 

   MEDIUM (should fix) 
  [List each MEDIUM violation with file:line and fix instruction]
  [None] 

   LOW (optional improvement) 
  [List each LOW issue]
  [None] 

   OWASP SUMMARY 
  A01 Broken Access Control        : PASS / [N] violations
  A02 Cryptographic Failures       : PASS / [N] violations
  A03 Injection                    : PASS / [N] violations
  A04 Insecure Design              : N/A  out of scope
  A05 Security Misconfiguration    : PASS / [N] violations
  A06 Vulnerable and Outdated Components: PASS / [N] violations
  A07 Authentication Failures      : PASS / [N] violations
  A08 Software/Data Integrity      : N/A  out of scope
  A09 Logging Failures             : PASS / [N] violations
  A10 SSRF                         : N/A  out of scope

   Architecture 
  [List any structural issues found or "All clear "]

   NFR Compliance 
  [List any unmet NFRs or "All applicable NFRs met "]

   GO / NO-GO DECISION 

  Scoring (20 pts each):
  Zero HIGH violations (CLAUDE.md + architecture + security) [XX / 20]
  Zero HIGH OWASP violations                                 [XX / 20]
  All applicable ACs covered (if story-scoped)               [XX / 20]
  SRS NFRs enforced                                          [XX / 20]
  Zero MEDIUM violations (or all deferred to ADO)            [XX / 20]
  
  TOTAL                                                      [XX / 100]

   GO          80100   Audit passed. Ready for production / next phase.
   CONDITIONAL  5079   Resolve or defer items, then re-audit.
   NO-GO        < 50    Must fix blockers before release.

  SIGNAL:  GO /  CONDITIONAL /  NO-GO

  PENDING DECISIONS  Tech lead must resolve before proceeding
  
   #   Violation / Gap           Severity  Resolution Needed  Reply with              
  
   1   [violation  file:line]   HIGH    [fix approach]    "fix [N]" / "fix all"   
   2   [architecture issue]      HIGH    [refactor plan]   "refactor: [plan]"      
   3   [noncompliance]           MED     [defer or fix]    "defer" / "fix [item]"  
  

  [N] decisions pending. Proceed only after  items resolved.

  

---

## STEP 9  After audit

If HIGH issues exist:
  Fix each one using the exact line and fix instruction above.
  Re-run `/swp-audit` to confirm all HIGH issues resolved.

If only MEDIUM or LOW:
  Optionally fix now, or raise an ADO task for each deferred item.
  Proceed based on context.

If all clear:
   GO: Code is audit-ready.
  Proceed to next phase or production deployment.

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


