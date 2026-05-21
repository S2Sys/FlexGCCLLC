---
name: swm-bug
description: |
  Fix a build error, test failure, runtime exception, logic bug, or security vulnerability. Classifies the issue first, applies the matching fix strategy, and enforces a discard rule after 3 failed attempts.
  Trigger when: a bug or error is encountered, tests are failing, a build error needs fixing, a runtime exception is thrown, a security vulnerability needs patching, or running /swm-bug.
compatibility: Any stack - reads STACK CONFIRMED from docs/SRS.md
Command  : /swm-bug
Version  : 2.1
Updated  : 2026-05-21
| Version | Date       | Author  | Changes |
|---------|------------|---------|---------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.6        | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.5     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.4     | 2026-05-18 | KapilDev   | Clarified outputs, blockers, dashboard follow-up, local-vs-planning reintegration rules, and next-step routing |
| 1.3     | 2026-05-13 | Zenthil | Added Go/No-Go fix acceptance gate; PENDING DECISIONS matrix; post-fix /swd-submit routing instruction |
| 1.2     | 2026-05-13 | Zenthil | LOGIC bugs: added SRS pseudo code lookup to verify correct expected behavior before fixing; SECURITY bugs: added SRS compliance framework cross-check; added AC validation step after fix |
| 1.1     | 2026-05-13 | Zenthil | Added version header; STEP 0 classification; prerequisite reads; session.state attempt counter; DISCARD rule safety |
| 1.0     | -          | Zenthil | Initial version |

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

Fix the error or bug: $ARGUMENTS

---

**Related commands:**
- `/swd-next` - resume the active delivery loop after a local fix
- `/swd-submit` - stage and commit an accepted local fix inside the normal delivery workflow
- `/swm-debt` - escalate recurring or structural bug patterns into tracked debt
- `/swp-plan` - convert approved recurring bug themes into planned backlog work

**What this command produces:**
- bug classification and root-cause summary
- exact fix scope and changed file/line list
- AC validation result and Go/No-Go fix acceptance
- one explicit route decision: stay local, escalate to debt, or escalate to planning
- dashboard note for `.codex/WORKFLOW_PROGRESS.md` if the bug reveals a workflow-level gap

**Blockers that stop this command:**
- `docs/SRS.md` missing or unreadable for LOGIC or SECURITY fixes
- current story or subtask missing from `CONTEXT.md`
- `fix_attempts >= 3` in `.claude/session.state`
- the proposed fix breaks any acceptance criterion for the active story

**Maintenance reintegration rule:**
- Keep the result local when the fix is isolated to the active story or subtask and does not create new backlog work.
- Route to `/swm-debt` when the same class of bug is recurring, cross-cutting, or clearly structural.
- Route to `/swp-plan` only after the debt or recurring bug pattern has been accepted as planned work.

---

## STEP 0 - Prerequisite reads and classification

Read before doing anything else:
1. `CONTEXT.md` - current story, subtask, and recent decisions
2. `docs/SRS.md` - identify stack, ACs, and expected behavior

Check `.claude/session.state` for `fix_attempts` on this subtask:
- If `fix_attempts >= 3`, go directly to the DISCARD RULE and do not attempt another fix.

Classify the issue from `$ARGUMENTS`:

```text
ERROR CLASSIFICATION
Type    : BUILD | TEST | RUNTIME | LOGIC | SECURITY
Layer   : SP | Repository | Service | Endpoint | Component | Frontend Service
Story   : [from CONTEXT.md]
Subtask : [from CONTEXT.md]
Attempt : [N of 3 from session.state.fix_attempts, default 1]
```

Classification rules:
- `BUILD` - compiler error, missing reference, package restore issue
- `TEST` - assertion failure, fixture failure, test-only exception
- `RUNTIME` - exception during execution, 500, null dereference
- `LOGIC` - wrong result, wrong branch, AC not met
- `SECURITY` - OWASP, auth, tenancy, secret handling, or compliance issue

If `Type = LOGIC`:
- read the exact SRS AC or pseudo code that defines expected behavior
- output:

```text
SRS EXPECTED BEHAVIOR: [section and exact expected behavior summary]
ACTUAL BEHAVIOR      : [one sentence]
DEVIATION            : [where code diverges]
```

If `Type = SECURITY`:
- read the SRS compliance section
- identify which frameworks apply
- mark any compliance breach as `CRITICAL`
- flag the tech lead before fixing if a compliance breach is confirmed

Increment `fix_attempts` in `.claude/session.state` before starting the fix.

---

## STEP 1 - Fix scope rules

Enforce these rules during the fix:
- fix only the specific issue in scope
- do not refactor surrounding code unless it is required for the fix itself
- do not change unrelated business logic
- explain root cause in one sentence before showing the fix
- list exact files and line numbers changed

---

## STEP 2 - Validate against active story ACs

After applying the fix:
1. Read every AC for the active story from `docs/SRS.md`.
2. For each AC, record:

```text
AC VALIDATION
[AC text] -> [OK / BROKEN]
```

3. If any AC is `BROKEN`, stop and re-diagnose. The fix is not accepted.

Then score the fix:

```text
GO/NO-GO - FIX ACCEPTANCE
Root cause identified and fixed                         [XX / 20]
All active-story ACs still satisfied                    [XX / 20]
Build passes after fix                                  [XX / 20]
Tests pass after fix                                    [XX / 20]
Fix attempt count below discard threshold               [XX / 20]
TOTAL                                                   [XX / 100]
```

Signal:
- `GO` = 80-100
- `PARTIAL` = 60-79
- `NO-GO` = below 60

Stop on `NO-GO`.

---

## STEP 3 - Story completion check

Check `docs/BREAKDOWN.md`.

If this fix completes the last open subtask for the story:
- output a `STORY-END GATE CHECK`
- require:
  - `/swp-audit` approved
  - all ACs covered
  - build passing
  - final manual testing guide prepared
  - ready for PR
- do not run `/swd-submit` automatically; wait for confirmation

If more work remains:
- output the remaining open subtasks from `docs/BREAKDOWN.md`

---

## STEP 3.5 - Route the maintenance result

After the fix is accepted, choose exactly one route and state it explicitly.

### Route A - Local fix

Use this when the issue is isolated to the active story or subtask.

Output:

```text
ROUTE: LOCAL FIX
Planning follow-up required: NO
Next: run /swd-next to continue delivery
```

If the current subtask or story is otherwise complete, replace the next step with:

```text
Next: run /swd-submit
```

### Route B - Debt escalation

Use this when the bug is recurring, appears in multiple layers, or signals structural cleanup.

Output:

```text
ROUTE: DEBT ESCALATION
Planning follow-up required: YES
Next: run /swm-debt [area or bug pattern]
```

### Route C - Planning escalation

Use this only when the bug reveals approved backlog, architecture, or workflow work beyond the current story.

Output:

```text
ROUTE: PLANNING ESCALATION
Planning follow-up required: YES
Next: run /swp-plan [approved work item or theme]
```

If the bug exposes a command-family or workflow problem, add a short note to `.codex/WORKFLOW_PROGRESS.md`.

---

## After Fix Confirmed GO

Stage the fix for `/swd-submit`.

Do not commit directly here. `/swd-submit` runs the full delivery close-out:
- inline review
- docs and changelog updates
- `docs/BREAKDOWN.md` update
- ADO update
- context checkpoint

---

## DISCARD RULE

If this is attempt 3 or more on the same subtask:

1. Output: `DISCARD TRIGGERED - 3 fix attempts failed`
2. State the root cause in one sentence.
3. Stash uncommitted changes, then clear the stash.
4. Reset `fix_attempts` to `0` in `.claude/session.state`.
5. Recommend a narrower approach with smaller scope or different sequencing.
6. Wait for tech lead approval before writing more code.
7. Do not retry the same approach.

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).

