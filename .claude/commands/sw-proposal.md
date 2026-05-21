---
name: sw-proposal
description: |
  Generate a professional client proposal or Statement of Work (SOW) - covers executive summary, problem statement, proposed solution, deliverables, timeline, pricing, team, and standard terms. Works for software development and digital marketing projects.
  Trigger when: writing a proposal, creating a SOW, responding to an RFP, quoting a client, preparing pre-sales documents, writing a project agreement, or any time someone asks to write a proposal or statement of work.
compatibility: Any project unless command-specific prerequisites say otherwise
---

Command  : /sw-proposal
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
| 1.1     | 2026-05-18 | SmartWorkz | Added estimation dependency, pricing decision guidance, and proposal review checklist |
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a persuasive, clearly scoped proposal that sets expectations, wins the work, and protects both parties.

## Prerequisites

- Client name, contact, and brief
- Approximate budget range
- Preferred timeline
- Use `/sw-estimation` first if pricing, effort, or delivery confidence has not been worked out yet

---

## STEP 1 - Inputs

```text
Client Name        :
Contact Name       :
Project Name       :
Project Type       : software / marketing / combined
Budget Range       : GBP/USD/EUR
Desired Start Date :
Desired End Date   :
Key Decision Maker :
Proposal Deadline  :
```

---

## STEP 2 - Executive Summary

Three sentences:
1. Restate the client's problem or goal in their own language.
2. State the proposed solution at the highest level.
3. State the primary outcome or benefit.

Example:
> "[Client] wants to increase qualified inbound leads by 40% over the next quarter. We will deliver a targeted SEO and paid search programme supported by a redesigned landing page. This will position [Client] to capture demand from [audience] at lower cost-per-lead than current outbound spend."

---

## STEP 3 - Problem Statement (150-250 words)

- **Current state** - what is happening now
- **Pain points** - why it matters
- **Cost of inaction** - what happens if nothing changes

Use the client's own language where possible.

---

## STEP 4 - Proposed Solution

- What will be built or delivered, and why
- Key decisions made and rationale
- What is explicitly **OUT OF SCOPE** (critical - list at least 3 exclusions)

---

## STEP 5 - Deliverables and Milestones

| # | Deliverable | Description | Acceptance Criterion | Due Date |
|---|-------------|-------------|---------------------|----------|
| 1 |             |             | Client signs off on X |         |
| 2 |             |             | X is live and verified |        |

---

## STEP 6 - Pricing

**Fixed Price:**

| Phase     | Description | Fee  |
|-----------|-------------|------|
| Discovery |             | GBP/USD/EUR |
| Build     |             | GBP/USD/EUR |
| Launch    |             | GBP/USD/EUR |
| **Total** |             | **GBP/USD/EUR** |

Payment terms: 50% upfront, 50% on final delivery. Net 14 days. Late payment: 2% per month.

**OR Retainer:**

| Month | Scope | Monthly Fee |
|-------|-------|-------------|
| 1-3   |       | GBP/USD/EUR |

Pricing model selection guidance:
- Use **Fixed Price** when scope is clear, dependencies are known, and change is expected to be low
- Use **Retainer** when scope is ongoing, channel mix changes often, or the client needs flexible monthly support
- Use **Paid Discovery first** when requirements are still unclear or the estimate confidence is low

---

## STEP 7 - Team

| Name / Role | Responsibility | Availability |
|-------------|----------------|--------------|
|             |                | x days/week  |

---

## STEP 8 - Timeline

| Week / Phase | Activities | Milestone |
|--------------|------------|-----------|
| Week 1       |            |           |
| Week 2       |            |           |

---

## STEP 9 - Standard Terms

Include these clauses verbatim (customise values in brackets):

- **IP:** All work product transfers to client upon receipt of full payment.
- **Revisions:** [X] rounds of revisions included. Additional revisions billed at GBP/USD/EUR [Y]/hour.
- **Change requests:** Any scope change requires written approval and may affect timeline and cost.
- **Confidentiality:** Both parties keep project details confidential for [2] years.
- **Termination:** Either party may terminate with [14] days written notice. Work completed to date is invoiced.

---

## STEP 10 - Proposal Review Checklist

Before sending the proposal, confirm:

- [ ] Pricing aligns with the latest `/sw-estimation` output
- [ ] Scope exclusions are explicit
- [ ] Acceptance criteria are measurable
- [ ] Timeline is realistic for the proposed team size
- [ ] Commercial terms match the intended deal model
- [ ] The main CTA is clear (approve / review / schedule call)

---

## OUTPUT

`docs/PROPOSAL-[ClientName]-[YYYY-MM-DD].md` - ready for PDF export or direct sharing.

If the client approves:
- use `/sw-onboarding` to start delivery setup

If pricing or scope is challenged:
- return to `/sw-estimation` and revise assumptions before resending
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

