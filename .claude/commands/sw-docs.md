---
name: sw-docs
description: |
  Create business documentation and operational templates for HR, admin, employee management, policies, SOPs, forms, checklists, handbooks, and trackers. Supports Markdown/Word-ready documents and Excel-ready tracker specifications for leave, attendance, assets, employee master data, training, onboarding, exit, and similar business operations.
  Trigger when: creating a leave policy, attendance policy, employee handbook, employee management tracker, asset tracker, attendance tracker, HR guideline, admin SOP, checklist, form, letter template, Excel tracker, CSV tracker, or running /sw-docs.
compatibility: Any project - no SRS dependency
Command  : /sw-docs
Version  : 1.0
Updated  : 2026-05-21
Author   : KapilDev
| Version | Date       | Author   | Changes |
|---------|------------|----------|---------|
| 1.0     | 2026-05-21 | KapilDev | Initial business documentation command for policies, SOPs, forms, handbooks, and Excel-ready trackers |

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

Keep this command focused on orchestration. Detailed business document structures, tracker columns, formulas, and review routing live in `.claude/refs/business-doc-templates.md`.

### Partial-failure recovery

If this command writes files, updates docs, changes external systems, scaffolds code, runs builds/tests, commits, pushes, deploys, or syncs state, and any step partially fails:

1. Stop before marking the workflow complete.
2. Report what changed, what failed, and which verification command or external action failed.
3. Preserve user-authored unrelated changes.
4. Fix or roll forward only the command-owned changes needed to recover.
5. Re-run the failed verification or sync step.
6. Do not update final status, handoff, README/docs, ADO, or changelog until recovery succeeds.

---

Create business documentation: $ARGUMENTS

---

## STEP 0 - Detect Mode

Read `.claude/refs/business-doc-templates.md` before generating the final artifact.

Detect the requested mode from `$ARGUMENTS`:

| Mode | Keywords |
|---|---|
| `policy` | policy, leave policy, attendance policy, device policy, HR policy, guideline |
| `sop` | sop, process, procedure, workflow, handover process |
| `tracker` | tracker, register, excel, xlsx, csv, sheet, employee tracker, asset tracker, attendance tracker |
| `form` | form, template form, request form, handover form, acknowledgement |
| `checklist` | checklist, onboarding checklist, exit checklist, audit checklist |
| `handbook` | handbook, employee handbook, HR handbook, admin handbook |
| `letter` | letter, offer, relieving, warning, confirmation, experience letter |

If no mode is clear, ask the user to choose one mode and STOP:

```text
Which document type do you need?
1. Policy
2. SOP / process
3. Excel-ready tracker
4. Form
5. Checklist
6. Handbook
7. Letter template
```

## STEP 1 - Gather Minimum Inputs

Ask only for missing inputs required to avoid fabricating company-specific rules.

Required for all modes:

- organization or team name
- document owner
- audience
- output format: Markdown, Word-ready Markdown, Excel-ready spec, CSV, or `.xlsx` if tooling is available
- review owner: HR, Admin, Manager, Payroll, IT, Legal, or `DATA GAP`

Additional inputs by mode:

- Policy: jurisdiction, effective date, entitlement/rule values, approval chain, exception owner
- SOP: trigger, actors, systems used, SLA, evidence/output
- Tracker: sheet names, columns to add/remove, validation lists, formulas, sample data preference
- Form/checklist: submitter, approver, required evidence, completion criteria
- Handbook: sections to include, employment types, review owner
- Letter: recipient type, purpose, tone, placeholders, approval owner

Mark unknown legal, payroll, statutory, or compliance rules as `DATA GAP`; do not invent them.

## STEP 2 - Draft Artifact

Generate the artifact using `.claude/refs/business-doc-templates.md`.

Rules:

- Keep the document practical and company-usable.
- Use clear section names and tables where they improve scanning.
- For trackers, include sheet plan, columns, data types, validations, formulas, and 3-5 sample rows unless the user asks for blank only.
- For policy documents, include review and approval routing.
- For HR/legal/payroll-sensitive content, include a review note instead of pretending the draft is legal advice.

## STEP 3 - Output File Plan

Before writing files, show:

```text
DOCUMENT FILE PLAN
Document type      : [policy / sop / tracker / form / checklist / handbook / letter]
Topic              : [topic]
Output format      : [Markdown / Word-ready / Excel-ready / CSV / XLSX]
Target path        : docs/business/[filename]
Review owner       : [role or DATA GAP]
Approval phrase    : docs approved
```

Wait for the exact phrase `docs approved` before writing files unless the user explicitly asked for draft output only.

## STEP 4 - Write Files

After exact approval:

1. Create `docs/business/` if missing.
2. Write the approved artifact to `docs/business/[type]-[topic]-[YYYY-MM-DD].md`.
3. If CSV was requested, also create `docs/business/[topic]-template-[YYYY-MM-DD].csv`.
4. If `.xlsx` was requested and spreadsheet tooling is available, create the workbook. If unavailable, output an Excel-ready spec and mark `.xlsx` generation as `DATA GAP`.
5. Do not overwrite existing files unless the user says `overwrite approved`.

## STEP 5 - Publish When Repo Files Change

If this command writes files inside the repository, publish the change using `.claude/refs/approval-publish-contract.md`:

- commit the generated `docs/business/*` files and any required docs updates
- push the current branch with `git push origin HEAD`
- create or update the Azure DevOps PR to `develop`
- save `docs/sessions/pr-sw-docs-[topic]-[YYYY-MM-DD].md`
- print the manager acceptance email

If the user only asked for text output in chat and no files are written, do not commit or create a PR.

## STEP 6 - Final Output

End with:

```text
DOCUMENT OUTPUT SUMMARY
Document type      : [type]
Topic              : [topic]
Audience           : [audience]
Output format      : [format]
Files created      : [list or none]
Data gaps          : [list or none]
Review needed from : [roles]
Verification       : [checks run]
Next               : [review / approve / publish / no action]
```
