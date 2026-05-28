---
name: swp-status
description: |
  Show the current planning phase status dashboard for a SmartWorkz project.
  Use at any time to see which phases are complete, pending, or blocked, and what to run next.
  Reads docs/BREAKDOWN.md and prints a live phase gate summary.
  Trigger when: you want to check where you are in the planning pipeline, before running any /swp-* command, or when resuming a project after a break.
compatibility: Any project  reads BREAKDOWN.md for phase status
---

Command  : /swp-status
Version  : 2.1
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

---

| Version | Date       | Author  | Changes                           |
|---------|------------|---------|-----------------------------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |
| 1.3     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.2     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.1     | 2026-05-17 | Zenthil | STEP 2+3: dynamic dashboard built from BREAKDOWN.md rows + PATH CONFIRMED  no hardcoded phase list |
| 1.0     | 2026-05-15 | Zenthil | Initial version  phase dashboard |

---

Show planning phase status for: $ARGUMENTS

Read docs/BREAKDOWN.md and output a phase dashboard. If no $ARGUMENTS provided, show status for the current project.

---

## STEP 1  Read project state

Read in order:
1. `docs/BREAKDOWN.md`  primary source for phase status
2. `docs/SRS.md`  extract product name and SRS version (header)
3. Check for existence: `docs/ARCH-DESIGN.md`, `docs/UI-DESIGN.md`, `docs/DB-DESIGN.md`

---

## STEP 1.5  Check for BREAKDOWN.md

IF docs/BREAKDOWN.md does not exist:
  Output:
    NO PROJECT STARTED
    
    No BREAKDOWN.md found  no planning phases have been run yet.
    Run /swp-srs to begin a new project.
    
  STOP  do not output a dashboard.

## STEP 2  Build phase dashboard

Read docs/SRS.md PATH CONFIRMED block (if present) to extract Flow name.
Build dashboard rows dynamically from docs/BREAKDOWN.md  read every `## Phase` line in order.

Output this dashboard:

```

  SmartWorkz Planning Status  [Product Name] [SRS-vX.X]        
  Flow: [Flow Name from PATH CONFIRMED  or "Path not locked"]   

  [Each ## Phase row from BREAKDOWN.md, in order:]               
  [Phase label padded to 32 chars]  [STATUS]  [DATE or state]    

   Next action: [command to run  from STEP 3]                  

```

Do NOT hardcode which phase rows appear. Render whatever `## Phase` lines exist in BREAKDOWN.md.

### STATUS values

| BREAKDOWN.md line       | Dashboard STATUS           | Symbol |
|-------------------------|----------------------------|--------|
| `[x] YYYY-MM-DD`        |  Complete (YYYY-MM-DD)    | green  |
| `[ ] pending`           |  Pending                  | yellow |
| `[ ] BLOCKED`           |  BLOCKED                  | red    |
| `[ ] in progress`       |  In Progress              | blue   |
| file missing entirely   |  Not started              | grey   |

---

## STEP 3  Determine next action

Find the first `## Phase` row in BREAKDOWN.md (after Phase 0) that is still `[ ] pending`.

IF PATH CONFIRMED is found in docs/SRS.md:
  Map the pending phase to its command using the `(command: ...)` annotation in that BREAKDOWN.md row.
  Output: "Run [command]  [phase label]"
  Special cases:
    If all non-Phase-3 rows are [x]: "Run /swp-plan to create dev stories and ADO tasks"
    If Phase 3 is `[ ] in progress`: "Run /swd-start [Story ID] to continue development"
    If all rows including Phase 3 are [x]: "All planning phases complete  project in development"

IF PATH CONFIRMED is missing (fallback for legacy projects):
  | Condition                                    | Next action output                                            |
  |----------------------------------------------|---------------------------------------------------------------|
  | docs/BREAKDOWN.md does not exist             | `Run /swp-srs to begin  no BREAKDOWN.md found`               |
  | Phase 0 is `[ ]`                             | `Run /swp-srs to complete SRS review`                         |
  | Phase 1A is `[ ]` and Phase 0 is `[x]`      | `Run /swp-arch  architecture design (Stage 1)`               |
  | Phase 1B is `[ ]` and Phase 1A is `[x]`     | `Run /swp-arch  scaffold (Stage 2 auto-continues from 1A)`   |
  | Phase 2A and 2B both `[ ]` (1A+1B done)     | `Run /swp-ui and /swp-db  these can run in parallel`         |
  | Phase 2A is `[ ]` only (2B done)            | `Run /swp-ui to complete UI/UX design`                        |
  | Phase 2B is `[ ]` only (2A done)            | `Run /swp-db to complete DB design`                           |
  | All of 1A+1B+2A+2B are `[x]`                | `Run /swp-plan to create dev stories and ADO tasks`           |
  | Phase 3 is `[ ] in progress`                | `Run /swd-start [Story ID] to continue development`           |
  | All phases `[x]`                             | `All planning phases complete  project in development`        |

---

## STEP 4  Output design doc inventory

Below the dashboard, list which design docs exist:

```
Design documents:
  docs/SRS.md           : [found / NOT FOUND]
  docs/ARCH-DESIGN.md   : [found / NOT FOUND]
  docs/ENTITIES.md      : [found / NOT FOUND]
  docs/UI-DESIGN.md     : [found / NOT FOUND]
  docs/DB-DESIGN.md     : [found / NOT FOUND]
  docs/BREAKDOWN.md     : [found / NOT FOUND]
```

---

## STEP 5  Output full BREAKDOWN.md snippet (if exists)

If docs/BREAKDOWN.md exists, print its full content below the dashboard so the developer can see exact phase details and any in-progress story rows.

---

**Compatible skill chain:**
  /swp-status  /swp-srs  /swp-arch  /swp-ui + /swp-db  /swp-plan  /swd-start

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


