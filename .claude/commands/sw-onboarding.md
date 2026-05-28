---
name: sw-onboarding
description: |
  Run the client onboarding workflow - pre-kickoff admin checklist, kickoff meeting agenda, access provisioning list, communication cadence setup, and 90-day milestone plan. Works for software development and digital marketing clients.
  Trigger when: a new client has signed, kicking off a new project, onboarding a client, preparing for a project kickoff, or any time someone asks to onboard a client or set up a new project with a client.
compatibility: Any project unless command-specific prerequisites say otherwise
---

Command  : /sw-onboarding
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
| 1.1     | 2026-05-18 | SmartWorkz | Added engagement-type branching, completion gate, and meeting/communication handoffs |
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Ensure every new client engagement starts with clear expectations, the right access, and a defined communication structure - from contract signing to the first 90 days.

## Prerequisites

- Signed contract / SOW
- First invoice raised
- Project type confirmed (software / marketing / combined)

Branch the workflow by engagement type:
- **software** -> prioritise repo, environment, architecture, and delivery tooling access
- **marketing** -> prioritise analytics, ad account, CRM, and asset access
- **combined** -> run both tracks and confirm one shared communication cadence

---

## STEP 1 - Pre-Kickoff Admin

Complete before the kickoff call:

- [ ] Contract signed and filed
- [ ] Deposit invoice raised and sent
- [ ] Project folder created (shared drive / SharePoint)
- [ ] Project created in Azure DevOps / Jira / project management tool
- [ ] Client added to communication channel (Teams / Slack)
- [ ] NDA signed (if required)
- [ ] Brand assets / credentials request sent to client

---

## STEP 2 - Kickoff Agenda

**30-minute kickoff (small projects):**
1. Introductions (5 min)
2. Goals and success criteria review (10 min)
3. Timeline and milestones walkthrough (10 min)
4. Communication cadence agreement (5 min)

**60-minute kickoff (larger projects):**
1. Introductions + team overview (10 min)
2. Project goals and success metrics (15 min)
3. Scope and deliverables walkthrough (15 min)
4. Timeline, milestones, dependencies (10 min)
5. Communication cadence + escalation path (5 min)
6. Open questions (5 min)

Send agenda 24 hours in advance. Send summary within 24 hours after.

---

## STEP 3 - Access Provisioning

Collect from client / grant to team:

| Tool / System | Access Type | Given To | Status |
|---------------|-------------|----------|--------|
| Google Analytics (GA4) | Editor | Account Manager | [ ] |
| Google Search Console | Full | SEO Lead | [ ] |
| Google Tag Manager | Publish | Dev / Analyst | [ ] |
| Website CMS | Admin | Dev Lead | [ ] |
| Social accounts | Manager | Social Lead | [ ] |
| Ads accounts (Google/Meta) | Admin | Media Buyer | [ ] |
| CRM | Admin | Account Manager | [ ] |
| Brand asset library | View/Download | Creative Lead | [ ] |
| Git / source code repo | Developer | Dev Team | [ ] |

Flag any access not received within 5 business days of kickoff.

---

## STEP 4 - Communication Cadence

| Meeting | Frequency | Duration | Attendees | Format |
|---------|-----------|----------|-----------|--------|
| Weekly status update | Weekly | 30 min | PM + Client lead | Video call |
| Monthly review | Monthly | 60 min | Full team + Client stakeholders | Video call |
| Quarterly business review | Quarterly | 90 min | Senior team + Client exec | In person (preferred) |
| Ad-hoc query response | As needed | - | PM | Email / Teams within 4 hours |
| Emergency escalation | As needed | - | Senior PM + Client | Phone within 1 hour |

---

## STEP 5 - First 90 Days Milestones

| Milestone | Target Date | Owner | Status |
|-----------|-------------|-------|--------|
| Day 1: All access granted | | PM | [ ] |
| Day 1: Project set up in management tool | | PM | [ ] |
| Week 1: Discovery / audit complete | | Lead | [ ] |
| Week 2: Strategy / architecture approved | | Lead | [ ] |
| Month 1: First deliverable live | | Team | [ ] |
| Month 2: First performance review | | PM | [ ] |
| Month 3: Quarterly business review | | PM + Client | [ ] |

---

## STEP 6 - Client Health Scorecard

Review monthly:

| Dimension | Score 1-5 | Notes |
|-----------|-----------|-------|
| Communication responsiveness | | |
| Feedback turnaround speed | | |
| Scope adherence | | |
| Payment timeliness | | |
| Overall satisfaction (NPS proxy) | | |
| **Average** | | |

Score < 3 on any dimension -> raise with account manager. Average < 3 -> escalate to director.

---

## STEP 7 - Onboarding Completion Gate

Do not mark onboarding complete until all are true:

- [ ] Kickoff completed and summary shared
- [ ] Required access is granted or formally escalated
- [ ] First 90-day milestones are assigned
- [ ] Communication cadence is agreed
- [ ] Internal owner is named for next-step delivery

If any item is incomplete after kickoff week, raise it as an onboarding risk with owner and due date.

---

## OUTPUT

`docs/ONBOARDING-[ClientName].md` - all checklists, kickoff notes, access log, cadence, 90-day plan.
Use `/sw-meeting` to run the kickoff itself and `/sw-communication` to send the kickoff summary or follow-up requests.
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

