---
name: sw-sync-readme
description: Analyze README.md against the current .claude/commands inventory and sync missing, renamed, or stale command references so the README reflects the live toolkit.
compatibility: Any project unless command-specific prerequisites say otherwise
---

Command  : /sw-sync-readme
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

# Sync README with Current Commands

Use this command whenever new skills are added, command names change, command counts drift, or the README command reference no longer matches the actual `.claude/commands/` folder.

---

## Goal

Review `README.md` against the live command inventory in `.claude/commands/` and identify:

- commands present in the repo but missing from README
- commands documented in README but no longer present
- stale command counts
- renamed commands still referenced under old names
- command family summaries that no longer match reality

Then update `README.md` so it reflects the current command set.

---

## STEP 1 - Read Current Sources

Read:

- `README.md`
- all `.md` files in `.claude/commands/`

At minimum, build an inventory of:

- filename
- command name from frontmatter
- command family (`swp-*`, `swd-*`, `swm-*`, `swc-*`, `swmk-*`, `sw-*`, others)
- short purpose from frontmatter description

---

## STEP 2 - Compare README vs Live Inventory

Check `README.md` for:

- total command count claims
- repository structure counts
- command reference tables
- features table references
- version history table coverage
- old command names still shown as active

Create a comparison list:

- `Missing in README`
- `Present but stale`
- `Renamed / deprecated references`
- `Count mismatches`

---

## STEP 3 - Update README

Update only the README sections needed to reflect the live command inventory.

Typical fixes:

- adjust command totals
- add missing commands to the correct family section
- remove or reword stale command references
- correct workflow examples that use outdated command names
- refresh feature summaries that mention command coverage

Keep the existing README structure unless a small reorganization is necessary for clarity.

---

## STEP 4 - Sanity Check

Before finishing, confirm:

- every active command intended for README coverage is represented appropriately
- command totals match the actual `.claude/commands/` folder scope used by README
- deprecated or historical commands are not listed as active unless clearly labeled
- command names in examples and workflow sections match the real files

If README intentionally excludes internal or niche commands, keep the exclusion consistent and note it in the report.

---

## STEP 5 - Report

Return a short report with:

- commands added to README
- stale references removed or corrected
- count changes made
- any intentional exclusions left in place

Example:

```text
sw-sync-readme complete

Updated  : 2026-05-21
- command reference tables
- features table

Added:
- /swmk-srs
- /swmk-seo

Corrected:
- /swd-done -> /swd-submit
- 26 commands -> 54 commands

Notes:
- internal-only commands were not added to the top-level quick reference
```
## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.
## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).
- **v1.2** (2026-05-21): Added phase/stage done-summary contract for concise boundary summaries and final run summary
- **v1.1** (2026-05-20): Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards

