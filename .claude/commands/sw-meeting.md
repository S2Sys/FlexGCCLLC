---
name: sw-meeting
description: |
  Facilitate any business meeting - agenda templates for standup, check-in, workshop, and all-hands formats; decision log structure; action item tracking; pre-meeting checklist; and post-meeting summary format. Works for development and marketing teams.
  Trigger when: preparing for a meeting, writing a meeting agenda, running a standup, facilitating a workshop, capturing meeting notes, or any time someone asks to plan, facilitate, or document a meeting.
compatibility: Any project unless command-specific prerequisites say otherwise
---

Command  : /sw-meeting
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
| 1.1     | 2026-05-18 | SmartWorkz | Added difficult-meeting guidance, completion criteria, and communication handoff |
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Run meetings that end with clear decisions and owned actions - not just a feeling that things were discussed.

## Prerequisites

- Meeting type selected
- Attendees confirmed
- Meeting invite sent 24 hours in advance (with agenda attached)

---

## STEP 1 - Meeting Type Selector

| Meeting Type | Duration | Frequency | Purpose |
|---|---|---|---|
| Daily standup | 15 min | Daily | Sync blockers and progress |
| Weekly check-in | 30 min | Weekly | Status, decisions, priorities |
| Monthly review | 60 min | Monthly | KPIs, retrospective, planning |
| Project kickoff | 60-90 min | Once | Align on goals and approach |
| Workshop | 90-120 min | As needed | Solve a specific problem |
| All-hands | 30-60 min | Monthly/quarterly | Company update, culture |

---

## STEP 2 - Agenda Templates

**Daily Standup (15 min - no chairs, async-first option):**
1. What did I complete since last standup? (30s per person)
2. What will I complete before next standup? (30s per person)
3. Any blockers? (raise, do not solve here - park for after)

**Weekly Check-in (30 min):**
1. Review last week's actions - done or not? (5 min)
2. Key updates / news (5 min)
3. Decisions needed this week (10 min)
4. Blockers and risks (5 min)
5. New actions + owners (5 min)

**Monthly Review (60 min):**
1. KPI scorecard review (15 min)
2. What went well / what did not (10 min)
3. Key decisions for the month ahead (20 min)
4. Actions and owners (10 min)
5. AOB (5 min)

**Workshop (90-120 min):**
1. Problem statement alignment (10 min)
2. Individual idea generation - silent (15 min)
3. Share and discuss (20 min)
4. Dot vote on best ideas (10 min)
5. Solution design for top idea (30 min)
6. Action plan (15 min)

---

## STEP 3 - Decision Log

Record every decision made in a meeting:

| # | Decision | Rationale | Owner | Date | Revisit Date |
|---|----------|-----------|-------|------|--------------|
| 1 | | Why this decision | | | If applicable |

A decision must be: specific, actionable, and owned by exactly one person.
Decisions without owners are intentions, not decisions.

---

## STEP 4 - Action Item Format

| # | Action | Owner | Due Date | Status |
|---|--------|-------|----------|--------|
| 1 | | | | Open / Done |

Rules:
- One owner per action (never "the team")
- Due date within the next meeting cycle (standup = tomorrow / weekly = by next week)
- Maximum 5 actions per meeting
- Review previous actions before adding new ones

---

## STEP 5 - Pre-Meeting Checklist

Send 24 hours before:
- [ ] Agenda sent to all attendees
- [ ] Relevant pre-reads attached or linked
- [ ] Meeting room / video link confirmed
- [ ] Previous meeting's action items reviewed - check which are done
- [ ] Decision-maker confirmed attending (if a decision is needed, do not hold meeting without them)
- [ ] If this is a difficult meeting (conflict, escalation, sensitive feedback), define what decision or outcome must be reached before the call starts

---

## STEP 6 - Post-Meeting Summary

Send within 24 hours of the meeting closing:

```text
Meeting: [Name]
Date: [YYYY-MM-DD]
Attendees: [Names]

## Decisions Made
1. [Decision] - Owner: [Name]

## Actions
| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | | | |

## Notes
[Any context not captured above]

Next meeting: [Date] | [Link]
```

Keep summaries under one page. If longer, something went wrong in the meeting.

Meeting completion criteria:
- every decision has one owner
- every action has one owner and due date
- unresolved issues are explicitly listed instead of implied

---

## OUTPUT

`docs/MEETING-[type]-[YYYY-MM-DD].md` - agenda, decisions, actions, summary.
Use `/sw-communication` if you need to turn the output into a follow-up email, formal MOM circulation, or reminder message.
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

