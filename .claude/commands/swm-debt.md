---
name: swm-debt
description: |
  Identify, score, and prioritize technical debt across the codebase. Scans for code smells, architecture violations, dependency risk, test coverage gaps, documentation rot, and configuration or security hygiene issues. Produces a debt register plus a routing decision for what stays local and what must feed back into planning.
  Trigger when: planning a refactor sprint, auditing codebase health, preparing for a major release, reviewing dependency age, investigating recurring maintenance issues, or running /swm-debt.
compatibility: Any stack - reads STACK CONFIRMED from docs/SRS.md
Command  : /swm-debt
Version  : 2.1
Updated  : 2026-05-21
| Version | Date       | Author  | Changes |
|---------|------------|---------|---------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |
| 1.3        | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.2     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.1     | 2026-05-18 | KapilDev   | Clarified outputs, blockers, dashboard integration, local-vs-planning reintegration rules, and next-step routing |
| 1.0     | 2026-05-16 | Zenthil | Initial version - 6-category scan, effort x impact matrix, ADO story generation, TECH-DEBT.md |

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

Audit technical debt for: $ARGUMENTS

If no `$ARGUMENTS`, scan the entire codebase.

**Prerequisite reads before using this command:**
- `docs/SRS.md` - stack, NFRs, architectural constraints
- `docs/ARCH-DESIGN.md` - intended architecture
- `docs/ENTITIES.md` - DB entity registry

**Related commands:**
- `/swp-audit` - security and compliance audit
- `/swm-bug` - fix a specific live issue
- `/swm-refine` - improve command or workflow quality
- `/swp-plan` - convert accepted debt into planned work

**What this command produces:**
- `docs/TECH-DEBT.md` - scored debt register with effort x impact matrix and action plan
- a codebase health summary
- ready-to-paste ADO story suggestions for accepted debt
- one explicit routing decision per debt item: local cleanup, sprint backlog, or planning backlog
- update instruction for `.codex/WORKFLOW_PROGRESS.md` when the scan changes workflow priorities

**Blockers that stop this command:**
- `docs/SRS.md` missing
- `docs/ARCH-DESIGN.md` missing when architecture debt is in scope
- `docs/ENTITIES.md` missing when database or schema debt is in scope
- scope unclear enough that the scan cannot distinguish local cleanup from structural debt

**Maintenance reintegration rule:**
- Keep debt local only when the item is trivial, isolated, and can be corrected inside already-approved story scope.
- Feed debt back into planning when it spans multiple stories, layers, or owners, or when it changes the next sprint backlog.
- Route command-family or workflow debt to `/swm-refine` instead of mixing it into product backlog work.

---

## STEP 0 - Scope detection

Read `docs/SRS.md` to identify the stack and the architectural constraints in scope.

If `$ARGUMENTS` names a specific area, scan only that area and record the scope at the top of the report.

If the request is broad but the repo contains an active recurring maintenance theme, state that theme explicitly before scanning.

---

## STEP 1 - Scan across 6 debt categories

For each category, list every item found with a short description and location.

### Category 1 - Code Quality

Look for:
- long methods or functions
- high complexity
- magic numbers or hardcoded strings
- copy-paste duplication
- dead code
- oversized files or god classes
- inconsistent naming

### Category 2 - Architecture Violations

Compare actual structure against `docs/ARCH-DESIGN.md`:
- broken layer boundaries
- circular dependencies
- missing abstractions
- hardcoded infrastructure concerns in business logic
- SOLID violations that create real maintenance drag

### Category 3 - Dependency Risk

Scan package manifests for:
- stale packages
- known-risk packages that need audit confirmation
- major-version lag
- duplicate libraries for the same job
- misclassified dependencies
- missing lock files

### Category 4 - Test Coverage Gaps

Look for:
- production files with no matching test coverage
- only happy-path tests
- brittle hardcoded fixtures
- missing integration coverage on critical paths
- missing performance coverage where the SRS sets an SLA
- flaky tests if history is available

### Category 5 - Documentation Rot

Look for:
- missing public API documentation
- README references to deleted files or stale commands
- stale `docs/` artifacts relative to recent feature work
- unresolved design or decision records
- missing work-item traceability where the repo expects it

### Category 6 - Configuration and Security Hygiene

Look for:
- secrets in source or config
- unsafe debug settings
- permissive CORS in production
- unsafe token lifetimes
- missing rate limiting on public endpoints
- hardcoded insecure URLs
- committed env files

---

## STEP 2 - Score each item

Score every debt item on:

- `Effort` from 1 to 5
- `Impact` from 1 to 5
- `Priority score = Impact / Effort`

Sort highest priority first.

---

## STEP 3 - Write the debt register

Write `docs/TECH-DEBT.md` with:

```markdown
# Technical Debt Register - [Project Name]
Version  : 2.1 | Scanned: [date] | Scope: [full or module]

## Summary
[N] items found across 6 categories.
Critical: [N] | High: [N] | Medium: [N] | Low/Cosmetic: [N]
Estimated remediation: [X] days now + [Y] days this sprint

## Debt Register
[table sorted by priority score descending]

## Action Plan
### Fix Now
### Fix This Sprint
### Backlog

## Re-scan Schedule
Re-run /swm-debt after each sprint or after major maintenance pushes.
```

Every row must include:
- category
- item summary
- location
- effort
- impact
- priority score
- route decision

Allowed route decisions:
- `LOCAL CLEANUP`
- `SPRINT BACKLOG`
- `PLANNING BACKLOG`
- `COMMAND REFINEMENT`

---

## STEP 4 - Build the action plan

Group items into:

### Fix Now

Use when:
- impact is critical
- security or data integrity is at risk
- the issue blocks current delivery

Next route:
- `/swm-bug` for a specific immediate fix
- `/swp-plan` if multiple approved backlog items must be created together

### Fix This Sprint

Use when:
- the work is real but not release-blocking
- it should be visible in the next sprint plan

Next route:
- generate ADO story suggestions
- confirm whether to create them now
- route to `/swp-plan` if the debt changes the official backlog

### Backlog

Use when:
- the value is real but not urgent
- tracking matters more than immediate action

Next route:
- keep in `docs/TECH-DEBT.md`
- revisit in the next scan

### Command Refinement

Use when:
- the debt is inside command docs, workflow contracts, or ToolKit process guidance

Next route:
- `/swm-refine [target command or workflow surface]`
- update `.codex/WORKFLOW_PROGRESS.md` if the workflow priority changed

---

## STEP 5 - ADO story suggestions

For every `Fix Now` and `Fix This Sprint` item, output a ready-to-paste ADO story with:
- title
- acceptance criteria
- effort estimate

Ask:

```text
Create these as ADO stories now?
```

If yes, create them through the repo's ADO path.

---

## STEP 6 - Health score

Summarize the codebase health as a category score plus overall score.

Rating bands:
- `HEALTHY`
- `FAIR`
- `NEEDS WORK`
- `CRITICAL`

---

## STEP 7 - Route the maintenance result

After the scan, output one summary block:

```text
DEBT REVIEW COMPLETE
Health score : [XX / 60] - [rating]
Total items  : [N]
Fix Now      : [N]
This Sprint  : [N]
Backlog      : [N]
Command debt : [N]
```

Then state the next route:

- `Next: run /swm-bug [item]` for one immediate fix
- `Next: run /swp-plan [approved debt theme]` for accepted backlog work
- `Next: run /swm-refine [command or workflow file]` for ToolKit process debt
- `Next: debt reviewed` when no immediate follow-up is accepted

If the scan changes command-family priorities or exposes a workflow gap, update `.codex/WORKFLOW_PROGRESS.md`.

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).

