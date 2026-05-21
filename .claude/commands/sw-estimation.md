---
name: sw-estimation
description: |
  Estimate effort, cost, and timeline for any project - software development or digital marketing. Uses three-point estimation (Best/Likely/Worst), PERT formula, risk buffers, and confidence scoring. Produces a ranged estimate with high/low bounds.
  Trigger when: quoting a project, planning a sprint, checking if a deadline is feasible, producing a proposal estimate, breaking down project scope, or any time someone asks to estimate time, cost, or effort.
compatibility: Any project unless command-specific prerequisites say otherwise
---

Command  : /sw-estimation
Version  : 2.1
Updated  : 2026-05-21
Author   : KapilDev

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

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |
| 1.3     | 2026-05-21 | KapilDev      | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.1     | 2026-05-18 | SmartWorkz | Added validation checklist, stakeholder summary, and proposal/planning handoff guidance |
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a confidence-rated estimate with best/likely/worst ranges and a risk buffer that protects the team and the client.

## Prerequisites

- Scope description or deliverables list (from SRS, proposal brief, or campaign plan)
- Team roles and day rates (if cost estimate required)
- Target deadline (if timeline validation required)
- If this estimate will be used in client pricing, run `/sw-proposal` after this command and use the buffered total as the pricing baseline

---

## STEP 1 - Scope Decomposition

Break the project into work items (minimum 5; no single item > 3 days):

| # | Work Item | Description | Role |
|---|-----------|-------------|------|
| 1 |           |             |      |
| 2 |           |             |      |

---

## STEP 2 - Three-Point Estimate

| # | Work Item | Best (h) | Likely (h) | Worst (h) | PERT (h) |
|---|-----------|----------|------------|-----------|----------|
| 1 |           |          |            |           |          |
| **TOTAL** |   |          |            |           |          |

PERT formula: `(Best + 4 x Likely + Worst) / 6`

---

## STEP 3 - Risk Buffer

| Risk Factor                   | Applies? | Buffer |
|-------------------------------|----------|--------|
| New client / unknown codebase | Y/N      | +15%   |
| New technology                | Y/N      | +20%   |
| External dependencies (APIs)  | Y/N      | +10%   |
| Tight deadline (< 4 weeks)    | Y/N      | +10%   |
| Unclear requirements          | Y/N      | +25%   |
| Team at > 80% capacity        | Y/N      | +15%   |

Total buffer: ___%
Buffered estimate: PERT total x (1 + buffer / 100)

---

## STEP 4 - Role Breakdown and Cost

| Role            | Hours | Day Rate (GBP/USD/EUR) | Cost (GBP/USD/EUR) |
|-----------------|-------|------------------------|--------------------|
| Project Manager |       |                        |                    |
| Developer       |       |                        |                    |
| Designer        |       |                        |                    |
| Copywriter      |       |                        |                    |
| QA              |       |                        |                    |
| **TOTAL**       |       |                        |                    |

---

## STEP 5 - Timeline Projection

```text
Available capacity : [people] x [days/week] x [weeks] = [total hours]
Hours needed       : [from Step 4]
Implied duration   : hours needed / weekly capacity (in weeks)
Target deadline    : [from brief]
Gap (days)         : deadline - implied end date
```

Gap < 0 -> flag timeline risk. Recommend scope reduction or additional resource.

---

## STEP 6 - Confidence Score

| Factor                       | Score 1-5 |
|------------------------------|-----------|
| Requirements clarity         |           |
| Team familiarity with scope  |           |
| Past similar project data    |           |
| Stakeholder alignment        |           |
| **Average**                  |           |

- 4-5: High confidence - commit to likely estimate
- 3-4: Medium confidence - commit to likely + 15%
- 1-3: Low confidence - commit to worst case or run a paid discovery phase

---

## STEP 7 - Estimate Validation Checklist

Before finalising the estimate, confirm:

- [ ] No scope item is missing from the work breakdown
- [ ] No single work item is too large to estimate confidently
- [ ] Buffer assumptions are explained, not guessed
- [ ] Role hours add up to the total hours used in pricing and timeline
- [ ] Deadline risk is clearly flagged if the target date is not achievable
- [ ] Confidence level matches the evidence available

If any item above is unresolved, state the uncertainty explicitly in the final estimate.

---

## OUTPUT

`docs/ESTIMATION.md` - scope breakdown, buffered total, role breakdown, timeline projection, confidence score.

Include a one-paragraph stakeholder summary with:
- recommended estimate to present externally
- confidence level
- biggest cost/timeline risk

Next:
- `/sw-proposal` for client-facing pricing or SOW packaging
- `/swp-plan` if the estimate is being converted into internal delivery planning
## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.
## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).
- **v1.3** (2026-05-21): Added phase/stage done-summary contract for concise boundary summaries and final run summary
- **v1.2** (2026-05-20): Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards

