---
name: sw-retro
description: |
  Facilitate a sprint retrospective - structured format (Start/Stop/Continue), dot voting, action item capture, team health check, and retrospective effectiveness scoring. Works for development and marketing teams.
  Trigger when: end of sprint, end of a project phase, running a team retrospective, improving team process, or any time someone asks to run a retro or retrospective.
compatibility: Any project unless command-specific prerequisites say otherwise
---

Command  : /sw-retro
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
| 1.1     | 2026-05-18 | SmartWorkz | Added action rollover rule, escalation guidance, and meeting/communication handoff |
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Run a structured, time-boxed retrospective that produces 3 or fewer concrete actions - each with an owner and due date.

## Prerequisites

- Sprint / phase has ended
- Facilitator identified (ideally not the team lead)
- Collaboration tool ready (Miro / FigJam / whiteboard / sticky notes)

---

## STEP 1 - Pre-Retro Setup (5 min before)

- [ ] Timebox: 60 minutes total
- [ ] Invite: full delivery team (no external stakeholders)
- [ ] Prepare board with 3 columns: **Start - Stop - Continue**
- [ ] Check last retro's action items - did they get done?

---

## STEP 2 - Warm-Up (5 min)

One-word check-in. Go around the room (or Miro board):

> "Describe this sprint in one word."

Purpose: gets everyone talking, surfaces mood without opening debate.

---

## STEP 3 - Retrospective (25 min)

Silent writing phase (10 min): each person writes sticky notes for each column.

- **Start:** Things we should begin doing that we are not doing now
- **Stop:** Things we are doing that are not working or are wasting time
- **Continue:** Things working well that we should keep doing

Read-out phase (15 min): each person reads their stickies aloud. Facilitator groups similar items.

---

## STEP 4 - Voting (5 min)

Each team member gets 3 votes (dot stickers or emoji reactions).
Vote for the items you feel are most important to act on.
Top 3 voted items become action candidates.

---

## STEP 5 - Action Items (15 min)

For each of the top 3 voted items, define an action:

| # | Theme | Action | Owner | Due Date |
|---|-------|--------|-------|----------|
| 1 | | | | By next sprint end |
| 2 | | | | |
| 3 | | | | |

Rules:
- Maximum 3 actions per retro (more = none get done)
- Every action must have exactly one owner
- Every action must be completable within the next sprint

---

## STEP 6 - Team Health Check (5 min)

Rate 1-5 (anonymous - use anonymous poll or folded paper):

| Dimension | Score |
|-----------|-------|
| Delivery (did we ship what we planned?) | /5 |
| Quality (are we proud of the work?) | /5 |
| Fun (are we enjoying the work?) | /5 |
| Learning (are we growing?) | /5 |
| Mission (do we understand why we are doing this?) | /5 |
| Speed (can we move faster?) | /5 |
| **Average** | /5 |

Score < 3 on any dimension -> discuss briefly, add action if needed.

---

## STEP 7 - Retrospective Effectiveness (2 min)

Before closing, check:

| Check | Result |
|-------|--------|
| Did last retro's 3 actions all get done? | Y / N / Partial |
| Did this retro produce <= 3 actions with owners? | Y / N |
| Did everyone speak at least once? | Y / N |

If last retro's actions were not completed -> discuss why before adding new ones.
If the same action category rolls over twice in a row -> escalate it to team lead or delivery manager as a systemic issue, not an individual reminder.

---

## OUTPUT

`docs/RETRO-[SprintName]-[YYYY-MM-DD].md` - warm-up notes, Start/Stop/Continue board, action items, health scores, effectiveness check.
Send to team within 1 hour of closing.
Use `/sw-meeting` if the retro needs a follow-up working session, and `/sw-communication` if you need to circulate the summary or action-owner reminders.
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

