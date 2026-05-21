---
name: swm-refine
description: |
  Analyze and improve a ToolKit command file. Audits for coverage gaps, compliance violations, weak trigger phrasing, unclear outputs, missing blockers, and broken workflow routing. Uses the _skill2.0 framework, then routes the result either back to the local command owner or into broader workflow planning.
  Trigger when: reviewing or improving a command file, auditing ToolKit workflow quality, tightening a command family contract, identifying command gaps, or running /swm-refine.
compatibility: SmartWorkz ToolKit command files (.md)
Command  : /swm-refine
Version  : 2.5
Updated  : 2026-05-21
| Version | Date       | Author  | Changes |
|---------|------------|---------|---------|
| 2.4     | 2026-05-21 | KapilDev   | Added Skill Maturity 2.0 Contract for repo-wide command readiness consistency |
| 2.3        | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 2.2     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 2.1     | 2026-05-18 | KapilDev   | Clarified outputs, blockers, local-vs-planning reintegration rules, dashboard routing, and next-step guidance |
| 2.0     | 2026-05-16 | Zenthil | Redirected from deprecated /swpp-refine to /_skill2.0 |
| 1.0     | -          | Zenthil | Original command (now consolidated) |

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

Refine a ToolKit command skill file: $ARGUMENTS

---

**Related commands:**
- `/_skill2.0` - full audit and gap analysis engine used by this command
- `/swm-debt` - use when the issue is repo-wide technical debt rather than command debt
- `/swp-plan` - use only when accepted command or workflow changes become tracked backlog work

**What this command produces:**
- a command-quality audit for the target file
- recommended edits for triggers, outputs, blockers, gating, and routing
- one explicit route decision: local command patch or workflow-level follow-up
- dashboard update instruction for `.codex/WORKFLOW_PROGRESS.md` when the issue affects command-family workflow

**Blockers that stop this command:**
- target command file path missing or ambiguous
- target file is outside the ToolKit command surfaces this command is meant to refine
- `_skill2.0` cannot evaluate the target because the command contract is too incomplete to audit

**Maintenance reintegration rule:**
- Keep the result local when the gap is contained to one command file and does not change family-level workflow.
- Feed the result back into planning only when the refinement creates cross-family workflow work, repo-wide standards work, or a new backlog theme.
- Use `.codex/WORKFLOW_PROGRESS.md` as the durable place to note workflow-level refinement follow-up.

---

## STEP 0 - Resolve the target

The target must be a ToolKit command file path such as:

- `.claude/commands/swp-arch.md`
- `.claude/commands/swd-next.md`
- `.claude/commands/swm-bug.md`

If `$ARGUMENTS` is missing:
- stop and ask for the exact command file or command family surface to refine

If the target is ambiguous:
- stop and ask for the exact file

---

## STEP 1 - Run the command audit

Delegate to `/_skill2.0` using the target file path.

Audit for:
- missing trigger phrases
- weak or inaccurate description coverage
- missing output contract
- missing blockers or prerequisite gates
- unclear next-step routing
- drift against adjacent command-family behavior
- missing local-vs-planning reintegration guidance

---

## STEP 2 - Produce the refinement summary

Summarize the findings in this structure:

```text
COMMAND REFINEMENT REVIEW
Target        : [file]
Family        : [swp / swl / swd / swm / other]
Primary gaps  : [list]
Severity      : [LOW / MEDIUM / HIGH]
Recommended fix scope: [local command patch / family follow-up / planning follow-up]
```

For every recommended fix, state:
- what is wrong
- why it matters
- what the corrected contract should say

---

## STEP 3 - Route the result

Choose exactly one route.

### Route A - Local command patch

Use when the issue is contained to one command file or one closely related command pair.

Output:

```text
ROUTE: LOCAL COMMAND PATCH
Planning follow-up required: NO
Next: patch the target command file and return to normal command-family usage
```

### Route B - Family workflow follow-up

Use when the issue affects multiple commands in the same family or exposes a missing dashboard, handoff, or shared output contract.

Output:

```text
ROUTE: FAMILY WORKFLOW FOLLOW-UP
Planning follow-up required: MAYBE
Next: update the affected command family and note the follow-up in .codex/WORKFLOW_PROGRESS.md
```

### Route C - Planning follow-up

Use only when the refinement becomes accepted backlog work across teams or repo-wide workflow governance.

Output:

```text
ROUTE: PLANNING FOLLOW-UP
Planning follow-up required: YES
Next: run /swp-plan [approved workflow improvement theme]
```

---

## STEP 4 - Completion note

After the refinement is accepted:
- keep one-command fixes local to the owning file
- note family-level workflow follow-up in `.codex/WORKFLOW_PROGRESS.md`
- avoid sending command-quality cleanup into product backlog unless the team explicitly accepts it as planned work

> Note: this command replaced the old `/swpp-refine` path. Use `/_skill2.0` directly when you need the raw audit engine without the routing wrapper.

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.5** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).

