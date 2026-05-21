---
name: sw-hr
description: |
  Run HR operations workflows for employee onboarding, exit, leave requests, attendance regularization, probation checkpoints, performance review preparation, employee document collection, and HR action routing. Uses /sw-docs for policies, forms, checklists, handbooks, and trackers.
  Trigger when: onboarding an employee, offboarding an employee, preparing an exit checklist, handling leave approval, attendance regularization, probation review, employee document collection, HR workflow routing, or running /sw-hr.
compatibility: Any project - no SRS dependency
Command  : /sw-hr
Version  : 1.0
Updated  : 2026-05-21
Author   : KapilDev
| Version | Date       | Author   | Changes |
|---------|------------|----------|---------|
| 1.0     | 2026-05-21 | KapilDev | Initial HR workflow command for onboarding, exit, leave, attendance, probation, and HR handoffs |

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

### Approval gate hardening

If this command has or reaches an approval/sign-off gate:

- Accept only the exact approval phrase documented by that gate.
- Reject vague approval language such as "looks good", "LGTM", "approved enough", "continue", "ship it", "go ahead", or "approved verbally".
- If blockers, failed checks, unresolved decisions, or missing required inputs remain, repeat the blocker list and stay at the gate.

### Reference discipline

Use `.claude/refs/hr-admin-workflows.md` for HR workflow details. Use `/sw-docs` for generated HR policies, letters, forms, checklists, handbooks, and trackers.

### Partial-failure recovery

If this command writes files, updates docs, changes external systems, commits, pushes, or syncs state, stop on partial failure and do not mark the workflow complete until recovery succeeds.

---

Run HR workflow: $ARGUMENTS

---

## STEP 0 - Detect Mode

Read `.claude/refs/hr-admin-workflows.md` before producing the workflow output.

Detect mode from `$ARGUMENTS`:

| Mode | Keywords |
|---|---|
| `onboarding` | onboarding, joining, new employee, first day, document collection |
| `exit` | exit, offboarding, last working day, clearance, relieving |
| `leave` | leave request, leave approval, leave balance, planned leave |
| `attendance` | attendance, regularization, missed punch, late mark, absence |
| `probation` | probation, confirmation, performance checkpoint |
| `review` | performance review, KRA, appraisal preparation |

If mode is unclear, ask the user for one mode and STOP.

## STEP 1 - Gather Missing Inputs

Ask only for missing details needed to route the workflow:

- employee or placeholder
- department and role
- manager or approver
- important dates
- affected systems, documents, or assets
- review owner

Mark missing payroll, legal, statutory, policy, or approval rules as `DATA GAP`.

## STEP 2 - Produce HR Workflow Plan

Output:

- workflow summary
- required actions
- owner matrix
- evidence or documents needed
- data gaps
- recommended `/sw-docs` artifact commands
- recommended `/sw-communication` emails, if any

## STEP 3 - Optional File Write

If the user asks to save the workflow, show this file plan and wait for exact approval phrase `hr workflow approved`:

```text
HR WORKFLOW FILE PLAN
Mode               : [mode]
Target path        : docs/business/hr-[mode]-[YYYY-MM-DD].md
Approval phrase    : hr workflow approved
Publish required   : yes, if file is written
```

After exact approval, write the file and publish through `.claude/refs/approval-publish-contract.md`.

## STEP 4 - Final Output

End with the `WORKFLOW OUTPUT SUMMARY` format from `.claude/refs/hr-admin-workflows.md`.
