---
name: _skill2.0
description: Analyze and enhance Claude command files, Claude skills, and ChatGPT/Codex skills against their own descriptions, implementation bodies, helper readiness, creator-discipline rules, bundled resources, validation evidence, cross-platform compatibility, documentation sync, and new skill capability opportunities. Use for single-skill review, capability creation planning, multi-file audits, repo-wide command enhancement, documentation consistency checks, or migration planning between Claude and Codex skill formats.
compatibility: Requires SKILL.md or markdown-based command files with YAML frontmatter; supports Claude command files and Codex skill folders
---



Command  : /_skill2.0
Version  : 2.11
Updated  : 2026-05-21
Author   : KapilDev

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

Final output must include a `RUN SUMMARY` with the same fields. If a phase/stage is skipped, say `Skipped` with reason and impact. If partially failed, show recovery status and do not mark it done.

---
# Skill Analysis and Enhancement Framework 2.0

Use this command to review existing skills or command prompts, identify missing skill capabilities, and turn vague quality feedback into a structured enhancement report. Version 2.10 includes the full legacy skill-enhancer v1.6 behavior plus ChatGPT/Codex skill-creator alignment checks, explicit capability-creation planning, workflow-command hardening checks, documentation-sync enforcement, toolkit-version synchronization, mandatory SmartWorkz++ toolkit version bumps for every commit or branch push, and phase/stage done-summary enforcement for multi-step skills.

The file's own description is the contract.

## Prerequisites

- Target file path, command folder, or pasted inline content
- Access to the full target file body, not only frontmatter
- For repo-wide mode, access to `.claude/commands/*.md`
- For Codex skill mode, access to the skill folder containing `SKILL.md`
- For documentation-sync mode, access to docs that mention the command, especially `README.md`
- For applied fixes, permission to edit the target command file, update its version/changelog, and update the toolkit/global version surfaces before every commit or branch push

For every target file, this command must answer:

1. What does the description say the skill should do?
2. What does the body actually enable today?
3. What are the current capabilities?
4. What are the gaps between description and implementation?
5. What features are missing, weak, or inconsistent?
6. Does the skill provide a comment-triggered helper document with use cases?
7. Which new skill capabilities should be added, if any?
8. Does the skill align with Claude skill-creator discipline?
9. Does the skill align with ChatGPT/Codex skill-creator discipline?
10. Do command changes require documentation updates in files such as `README.md`?
11. If the skill has phases, stages, steps, gates, or modes, does each phase/stage show what was done with a short summary?
12. What should be fixed first as Must Have, Should Have, and Nice to Have?

---

## STEP 0 - Input Check and Mode Selection

If `$ARGUMENTS` is a helper request, output the helper document and stop.

Helper requests include:

- `help`
- `?`
- `usage`
- `use cases`
- `examples`
- `show helper`
- `what can this skill do`
- comment-style requests such as `# help`, `// help`, or `<!-- help -->`

Helper output:

```markdown
## _skill2.0 Helper

### Purpose
Review Claude command files, Claude skills, and ChatGPT/Codex skill folders against their own descriptions, implementation bodies, helper readiness, creator-discipline rules, bundled resources, validation evidence, cross-platform compatibility, documentation sync, and missing capability opportunities.

Use it to decide what a skill can do today, what it cannot do yet, which docs must be updated when behavior changes, and which new skill capabilities should be created, extended, split into a sibling command, or moved into a Codex skill folder.

### Use Cases
- Review one command for missing workflow steps.
- Compare two sibling commands for inconsistent outputs.
- Audit all `.claude/commands/*.md` files for repeated gaps.
- Run a whole command-library review with `/_skill2.0 .claude/commands/`.
- Check whether a skill has a help/use-case helper path.
- Identify whether a requested feature belongs inside a skill, a sibling command, or a new command.
- Create a clear capability plan for adding new skill behavior, including triggers, boundaries, outputs, handoffs, and verification.
- Check whether command behavior changes require updates to docs such as `README.md`.
- Turn vague requests like "make this skill better" into concrete Must Have / Should Have / Nice to Have capability work.
- Check a Codex skill folder for `SKILL.md`, `agents/openai.yaml`, `scripts/`, `references/`, and `assets/` quality.
- Validate progressive disclosure and bundled-resource design.
- Plan migration from Claude command files to Codex-compatible skills.
- Produce a Must Have / Should Have / Nice to Have fix list before editing.

### Required Inputs
- One markdown file, multiple markdown files, a command folder, pasted command content, or a Codex skill folder.

### Outputs
- Description promise summary.
- Current capabilities and current gaps.
- Helper document readiness.
- Claude skill creator alignment.
- Codex skill creator alignment.
- Documentation sync impact.
- New capability opportunities.
- New capability creation plan with trigger phrases, boundary decision, workflow/output changes, handoff impact, and pressure-test scenario.
- Workflow-command hardening gaps such as helper intercepts, gate-bypass pressure cases, stack/platform coverage gaps, phase/stage done summaries, partial-failure recovery, token bloat, and numbering drift.
- Prioritized recommendations.
- Readiness verdict: APPROVED, CONDITIONAL, or NEEDS WORK.

### Next Steps
- Apply approved fixes.
- Bump version and changelog.
- Update README/docs that mention changed command names, modes, examples, outputs, or handoffs.
- Run verification checks.
- Commit with a clear message.

### Usage Examples
Single file review:

    /_skill2.0 .claude/commands/swp-arch.md

Capability enhancement review:

    /_skill2.0 .claude/commands/swp-ui.md
    Need helper mode, Figma import support, and prototype validation capability.

Multiple files:

    /_skill2.0 .claude/commands/swp-arch.md .claude/commands/swp-ui.md

Whole command library:

    /_skill2.0 .claude/commands/

Codex skill folder:

    /_skill2.0 ~/.codex/skills/example-skill/

Inline content:

    /_skill2.0
    [paste command or skill content]
```

If `$ARGUMENTS` is empty and no inline content is provided, output:

```text
USAGE: Provide one or more skill files to analyze.

- Single file:
  /_skill2.0 .claude/commands/swp-arch.md

- Multiple files:
  /_skill2.0 .claude/commands/swp-arch.md .claude/commands/swp-ui.md

- Whole command library:
  /_skill2.0 .claude/commands/

- Codex skill folder:
  /_skill2.0 ~/.codex/skills/example-skill/

- Inline content:
  /_skill2.0
  [paste command or skill content]
```

Do not proceed until content is available.

Select mode from the target:

- **Single Skill Review Mode**
  - one `.md` file
- **Multi-File Comparison Mode**
  - multiple explicit `.md` files
- **Repo-Wide Enhancement Mode**
  - `.claude/commands/` or equivalent command folder
- **Codex Skill Folder Review Mode**
  - a folder containing `SKILL.md`
- **Migration Mode**
  - a Claude command file that should be assessed for conversion into a Codex-compatible skill folder
- **Documentation Sync Mode**
  - any command or skill behavior change that may require docs such as `README.md` to be updated

---

## When to Use This Skill

Use this skill when:

- reviewing an existing skill or command for quality and completeness
- identifying drift between a file's description and its actual workflow
- auditing current capabilities and missing features
- creating a concrete plan for new skill capabilities from vague enhancement requests
- checking whether a skill can show a concise helper document with use cases when the user asks for help
- hardening broad workflow commands with approval gates, multi-stack support, scaffold/build phases, or post-approval automation
- comparing a skill against Claude skill-creator rules before enhancement
- comparing a skill against ChatGPT/Codex skill-creator rules before enhancement
- validating Codex skill folder structure, bundled resources, metadata, and validation readiness
- planning Claude-to-Codex skill migration or compatibility hardening
- finding trigger gaps, output gaps, or prerequisite gaps
- checking whether docs such as `README.md` still match command names, usage examples, modes, outputs, and handoffs
- validating readiness before integrating a skill into active workflow
- comparing multiple command files for consistency
- analyzing the whole `.claude/commands/` library and recommending standardized fixes

Do not use this skill for freeform brainstorming or net-new skill creation from scratch. Use it when there is already a file or prompt to review.

---

## Core Review Rule

Always read the target file's frontmatter description first.

That description defines the expected behavior. The review must compare:

- **Description promise**
- **Actual workflow body**
- **Current capabilities**
- **Current gaps**
- **Feature opportunities**
- **Documentation sync impact**

Never stop at formatting issues alone. A file can be perfectly formatted and still be weak if the description promises more than the body delivers.

---

## Review Modes

### Mode 1 - Single Skill Review

Review one file deeply.

Required output:

- description summary
- current capabilities
- current gaps
- weak or missing features
- compliance issues
- documentation sync impact
- Must Have / Should Have / Nice to Have recommendations

### Mode 2 - Multi-File Comparison

Review several explicit files together.

Required output:

- per-file analysis
- repeated issues across the set
- family consistency problems
- standardized fix suggestions
- documentation drift across command references

### Mode 3 - Repo-Wide Enhancement

Review the entire `.claude/commands/` library.

Required output:

- command inventory
- per-file description-driven analysis
- repeated repo-wide gaps
- command-family consistency issues
- grouped Must Have / Should Have / Nice to Have fixes
- docs that must be updated for command changes, including `README.md` when present
- rollout order for standardized changes

In repo-wide mode, prefer identifying **patterns** over dumping isolated trivia.

### Mode 4 - Codex Skill Folder Review

Review one Codex skill folder.

Required output:

- `SKILL.md` structure and frontmatter status
- `agents/openai.yaml` freshness if present
- `scripts/`, `references/`, and `assets/` resource-fit review
- progressive-disclosure assessment
- validation and forward-testing evidence
- documentation sync impact
- readiness verdict using Codex readiness caps

### Mode 5 - Migration Review

Review whether a Claude command file should become a Codex skill.

Required output:

- recommended target shape: `SKILL.md` only, or `SKILL.md` plus `scripts/`, `references/`, or `assets/`
- folder/name recommendation using Codex naming rules
- material to keep inline vs move to references
- helper, validation, and forward-testing plan
- docs to update after migration, including old command names and usage examples
- migration risks and rollout order

### Mode 6 - Documentation Sync Review

Review docs that mention the command or skill after any behavior change.

Required output:

- docs inventory, including `README.md` when present
- command names, examples, modes, outputs, and handoffs mentioned in docs
- stale references, old command names, or missing examples
- required docs updates before the change can be marked complete

---

## Analysis Framework

Apply only relevant checks. Do not mark Codex-only fields as failures for a Claude command unless the requested outcome is Codex compatibility or migration. Do not mark Claude-only discipline checks as failures for a narrow Codex reference skill unless the behavior is reusable, procedural, or enforcement-heavy.

### 1. Description-Driven Capability Assessment

For each file:

1. Read frontmatter:
   - `name`
   - `description`
   - `compatibility` if present
2. Extract stated promises:
   - what it does
   - when it should trigger
   - expected output artifacts
   - expected workflow or handoff
   - expected documentation updates after changes
3. Read the body and map what is actually implemented.
4. If the target is a Claude skill or reusable command, check Claude Skill Creator Alignment.
5. If the target is a Codex skill folder or intended for Codex, check Codex Skill Creator Alignment.
6. If behavior, naming, usage, outputs, modes, or handoffs changed, check Documentation Sync.

You must produce these sections for every file:

- **Current Capabilities**
- **Current Gaps**
- **Feature Opportunities**
- **Documentation Sync Impact**
- **Toolkit Version Sync Impact**

### 2. Current Capabilities

Document what the skill or command currently does well.

Look for:

- core workflow coverage
- supported user intents
- trigger phrasing quality
- prerequisite clarity
- concrete output artifacts
- examples and templates
- downstream handoffs
- edge-case handling
- documentation sync behavior
- versioning discipline

Use this matrix:

```markdown
| Capability | Present | Quality | Evidence | Notes |
|---|---|---|---|---|
| Trigger coverage | Yes | Strong | Description lines X-Y | Includes realistic user phrasing |
| Output artifact naming | Partial | Medium | OUTPUT section | File name present, but handoff missing |
| Documentation sync | Partial | Medium | Version protocol | Requires README update, but lacks stale-reference scan |
```

### 3. Current Gaps

Document where the description promise is not fully satisfied.

Gap categories:

| Gap Type | Meaning | Example |
|---|---|---|
| Description Gap | body does not fulfill the frontmatter description | claims audit + optimization, but only audits |
| Trigger Gap | description is too weak or narrow | misses words like estimate, quote, forecast |
| Workflow Gap | steps are incomplete or unclear | no verification or approval path |
| Prerequisite Gap | required inputs are missing | needs analytics baseline but does not say so |
| Output Gap | outputs are vague or not reusable | says "produce report" but no file/artifact format |
| Handoff Gap | missing downstream command link | campaign skill ends without report follow-up |
| Example Gap | concept is taught without an example | no concrete template or filled sample |
| Helper Doc Gap | no comment-triggered usage helper | user says "help" but skill starts the workflow instead of showing use cases |
| Documentation Sync Gap | command changes are not reflected in docs | README still documents `/_skillEnhancer` after rename to `/_skill2.0` |
| Phase/Stage Summary Gap | phased or staged workflow lacks short done summaries at boundaries | Phase 2 finishes without saying what changed, what was verified, and what is next |
| Skill Creator Gap | skill violates Claude skill-writing discipline | description explains workflow instead of trigger conditions |
| Codex Skill Gap | skill violates Codex skill-creator guidance | missing `SKILL.md`, stale `agents/openai.yaml`, or unnecessary README |
| Consistency Gap | drifts from sibling commands | different step style, naming, or version format |
| Token Efficiency Gap | main file is too large or repeats stack-specific templates inline | broad command carries 1,000+ lines of framework-specific examples |
| Platform Coverage Gap | compatibility promises more stacks/platforms than the body covers | Flutter listed, but security checks only cover web/backend |
| Gate Hardening Gap | approval gates lack bypass-pressure handling | user says "approved" before required decisions are resolved |
| Recovery Gap | partial failures are not handled | scaffold writes files then build fails, but command still marks work complete |
| Numbering Drift Gap | step numbers or subitems are inconsistent | 6.5/8.5 items mixed into numbered workflow |

Use this matrix:

```markdown
| Gap | Type | Severity | Evidence | Impact |
|---|---|---|---|---|
| Missing downstream handoff | Handoff Gap | High | OUTPUT section | Worker may stop too early |
| README not updated | Documentation Sync Gap | High | README usage block | Users invoke stale command name |
```

### 4. Feature Opportunities

Recommend improvements grouped as:

- **Must Have**
  - blocking issue
  - description-breaking issue
  - dangerous ambiguity
  - missing prerequisite or missing critical output
  - stale naming that breaks workflow
  - stale README/docs after command name, mode, output, or usage changes
  - missing helper path for broad or high-risk commands
  - missing verification plan for an applied enhancement
  - missing Claude skill-creator alignment for reusable skills
  - missing Codex skill folder anatomy for Codex skills
  - missing validation plan for Codex skills

- **Should Have**
  - strong improvement to usability, discoverability, or consistency
  - missing triggers
  - missing handoff guidance
  - missing compliance or governance note
  - missing progressive-disclosure or bundled-resource review
  - stale or missing `agents/openai.yaml`
  - docs mention the command but omit the whole-library usage example

- **Nice to Have**
  - polish
  - extra example
  - additional benchmark
  - optional edge-case handling

Use this matrix:

```markdown
| Recommendation | Priority | Why | Effort | Affected Files |
|---|---|---|---|---|
| Add analytics prerequisite | Must Have | Description implies measurement-dependent work | 15 min | swmk-ads, swmk-cro |
| Update README usage examples | Must Have | Command rename or mode change makes docs stale | 10 min | README.md |
```

Severity guide:

| Severity | Meaning | Typical priority |
|---|---|---|
| Critical | Can cause wrong workflow, unsafe output, or broken handoff | Must Have |
| High | Blocks reliable use or violates the description promise | Must Have |
| Medium | Reduces usability, consistency, or discoverability | Should Have |
| Low | Polish or optional clarity improvement | Nice to Have |
| Info | Observation only | No fix required |

### 4.1 Workflow Command Hardening

For broad workflow commands, especially commands that have multiple stages, approval gates, stack/platform claims, scaffold/build automation, or post-approval commits/pushes, run this extra hardening review.

Check these areas:

| Area | Required check | Gap example | Default priority |
|---|---|---|---|
| Helper intercept | `help`, `?`, `usage`, `use cases`, and comment-style helper requests stop before normal workflow starts | `/command help` still runs PATH CHECK or starts the workflow | Must Have for broad/high-risk commands |
| Skill type label | Body classifies the file as `WORKFLOW COMMAND`, `TECHNIQUE`, `PATTERN`, or `REFERENCE` | No type, unclear review criteria | Should Have |
| Stack/platform coverage | Every stack/platform promised in `description` or `compatibility` has matching guidance or an explicit adaptation rule | Command says "any stack" but deep steps only cover .NET | Should Have, Must Have if output would be wrong |
| Gate bypass pressure | Approval gates define what to do when the user tries to skip unresolved blockers or uses ambiguous approval language | User says "approved verbally" and command proceeds | Must Have for gated workflows |
| Anti-rationalization guards | Gates include red flags and explicit counters to common shortcuts | "Phase approved" accepted without required keyword or score | Must Have for discipline-heavy commands |
| Docs sync enforcement | Behavior, command name, modes, examples, outputs, or handoffs are reflected in README/docs before completion | Command updated but README still shows old usage | Must Have after command changes |
| TDD-style validation plan | Command changes include helper, normal-run, update-run, gate-bypass, docs-sync, and version-trail checks where relevant | Version bumped with no scenario checks | Should Have |
| Phase/stage done summaries | Each phase, stage, gate, mode, and final run has a short summary of completed work, artifacts, verification, blockers, and next step | Long workflow jumps between phases without a concise done summary | Should Have, Must Have for gated/commit/push/scaffold workflows |
| Partial-failure recovery | Scaffold/build/deploy steps define what to do after partial success or failed verification | Build fails after files are created and command still marks checklist done | Should Have |
| Token bloat and resource split | Main file keeps orchestration inline and moves stack-specific deep examples/templates to references | Huge folder trees, DI code, UI code, or policy tables inline | Should Have, Must Have if maintainability is poor |
| Numbering and section consistency | Step numbers are stable, sequential, and consistent with sibling commands | `6.5` and `8.5` appear in a formal workflow | Nice to Have |
| Version/changelog trace | Any applied framework fix bumps version and adds a top version-history entry | Behavior changes with no version trail | Must Have after edits |

Workflow-command hardening output:

```markdown
### Workflow Command Hardening
| Check | Status | Evidence | Required Fix | Priority |
|---|---|---|---|---|
| Helper intercept | PASS / FAIL / PARTIAL | [line/section] | [fix] | Must/Should/Nice |
| Gate bypass pressure | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Stack/platform coverage | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Documentation sync | PASS / FAIL / PARTIAL / N/A | [line/section/doc path] | [fix] | Must/Should/Nice |
| Phase/stage done summaries | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Partial-failure recovery | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Token bloat/resource split | PASS / FAIL / PARTIAL | [line/section] | [fix] | Must/Should/Nice |
| Numbering consistency | PASS / FAIL / PARTIAL | [line/section] | [fix] | Must/Should/Nice |
```

Use this section to convert one-off findings into reusable capability recommendations. For example, `partial scaffold recovery` should become a named capability with trigger phrases, output changes, and a verification scenario.

### 4.2 Phase/Stage Done Summary Enforcement

For any command or skill with phases, stages, numbered steps, gates, checkpoints, modes, loops, or multi-pass workflows, require a short done-summary at every meaningful boundary.

Required behavior:

| Boundary | Required Summary | Format |
|---|---|---|
| Phase complete | What was completed, artifacts changed, decisions made, blockers found/resolved, next phase | `PHASE [N] DONE SUMMARY` |
| Stage complete | What was completed, verification performed, files/docs affected, next stage/gate | `STAGE [N] DONE SUMMARY` |
| Gate reached | Gate result, required approval phrase, unresolved blockers, next allowed action | `GATE SUMMARY` |
| Mode complete | Mode selected, scope included/excluded, output artifact, next command | `MODE SUMMARY` |
| Final output | Cross-phase rollup with files changed, decisions, verification, blockers, and next owner/command | `RUN SUMMARY` |

Recommended short-summary template:

```text
[PHASE/STAGE/MODE] DONE SUMMARY
Completed          : [1-3 bullets or one short sentence]
Artifacts changed  : [files/docs/items]
Decisions made     : [approved/rejected/deferred]
Verification       : [checks run or N/A]
Blockers           : none / [list]
Next               : [next phase, stage, gate, command, or owner]
```

Rules:

- Keep each summary short: 3-7 lines unless the phase produced multiple artifacts.
- Do not replace the detailed output artifact; the summary is a navigation and handoff aid.
- If a phase/stage is skipped, show `Skipped` with reason and impact.
- If a phase/stage partially fails, show partial-failure recovery status and do not mark it done.
- Broad workflow commands missing these summaries are `Should Have`; commands with approval gates, commits, pushes, generated docs, ADO, deploy, or scaffold automation are `Must Have`.

Add this check to reports:

```markdown
### Phase/Stage Done Summary Readiness
| Area | Status | Evidence | Required Fix | Priority |
|---|---|---|---|---|
| Phase summaries | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Stage summaries | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Gate summaries | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Final run summary | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
```
### 5. Claude Skill Creator Alignment

When reviewing Claude skills or reusable command files, compare the file against Claude skill-creator discipline. The goal is to catch skills that look useful but will not be discovered, followed, tested, or maintained reliably.

Check these areas:

| Area | Required check | Gap example |
|---|---|---|
| Skill type | Classify as `TECHNIQUE`, `PATTERN`, `REFERENCE`, or `WORKFLOW COMMAND` | No type, unclear review criteria |
| Trigger-focused description | Description says when to use; it does not summarize the workflow | Description lists every step and encourages shortcut use |
| Search/discovery quality | Description and body include realistic symptoms, task phrases, tools, file types, and synonyms | Missing words users actually say |
| TDD-style validation | Enhancement has baseline failure, improvement, and retest evidence or a clear pressure-test plan | Skill changed without proof it fixes agent behavior |
| Pressure scenarios | Discipline-heavy skills include stress cases and expected compliance | No test for time pressure, ambiguity, or shortcut temptation |
| Anti-rationalization coverage | Skills that enforce behavior include red flags and explicit counters to likely excuses | "Use TDD" stated once with no loophole closure |
| Token efficiency | Body is concise; heavy examples, references, or reusable tools are split out | Large repeated examples bloat the main file |
| Split-vs-extend decision | New behavior belongs in this skill instead of a new sibling skill/command | One skill grows into unrelated workflows |
| Reusable resource fit | Scripts, references, or templates are recommended when repeated deterministic work is expected | Rewrites the same long helper every use |
| No narrative one-offs | Guidance is reusable, not a story about one past session | "In the last project we..." without general rule |

Claude alignment output:

```markdown
### Claude Skill Creator Alignment
| Check | Status | Evidence | Required Fix |
|---|---|---|---|
| Skill type classified | PASS / FAIL / PARTIAL | [line/section] | [fix] |
| Trigger-focused description | PASS / FAIL / PARTIAL | [line/section] | [fix] |
| TDD-style validation | PASS / FAIL / PARTIAL | [line/section] | [fix] |
| Token efficiency | PASS / FAIL / PARTIAL | [line/section] | [fix] |
| Split-vs-extend decision | PASS / FAIL / PARTIAL | [line/section] | [fix] |
```

If Claude alignment fails on trigger-focused description, verification, or split-vs-extend for a reusable skill, mark readiness no higher than `CONDITIONAL`.

If a discipline-enforcing skill lacks pressure scenarios or anti-rationalization coverage, mark the issue as `Must Have`.

For broad workflow commands with approval gates, missing pressure scenarios or anti-rationalization guards are also `Must Have`, even if the command is not a pure discipline-enforcing skill.

When token efficiency fails because the command body is very large, identify specific extractable sections instead of only saying "too long." Recommend one-level reference files such as `references/[command]-dotnet.md`, `references/[command]-angular.md`, `references/[command]-mobile.md`, or equivalent stack/domain-specific files.

### 6. ChatGPT/Codex Skill Creator Alignment

When reviewing a ChatGPT/Codex skill or a command intended to become a Codex skill, validate the skill as a folder-based capability with metadata, progressive disclosure, bundled resources, and executable validation.

Check these areas:

| Area | Required check | Gap example |
|---|---|---|
| Skill folder anatomy | Folder contains required `SKILL.md`; optional `agents/`, `scripts/`, `references/`, `assets/` are purposeful | Loose markdown file pretending to be a Codex skill |
| Frontmatter | `SKILL.md` has `name` and `description`; extra fields are justified by platform rules | Unsupported fields or missing required fields |
| Naming | Skill folder and `name` use lowercase letters, digits, and hyphens; under 64 characters | `My Skill!` or `skill_with_underscores` |
| Description | Description clearly covers what the skill does and when Codex should use it | Vague description that will not trigger |
| `agents/openai.yaml` | UI metadata exists when needed and matches `SKILL.md`; stale metadata is flagged | Short description promises old behavior |
| Progressive disclosure | `SKILL.md` stays lean; heavy details move to one-level `references/` files | 1,000-line SKILL.md with all variants inline |
| Scripts | Repeatable deterministic logic is placed in `scripts/` and representative scripts are tested | Same long code rewritten in instructions |
| References | Detailed docs, schemas, policies, and API specs live in `references/` and are referenced conditionally | Large reference content duplicated in SKILL.md |
| Assets | Templates, images, fonts, boilerplate, or sample files live in `assets/` only when used in outputs | Asset folder exists but nothing uses it |
| Extra files | Avoid unrelated `README.md`, `INSTALLATION_GUIDE.md`, `QUICK_REFERENCE.md`, `CHANGELOG.md` inside skill folders | Skill folder contains docs that confuse discovery |
| Validation | Run or recommend `scripts/quick_validate.py <skill-folder>` where the validator is available | Skill changed without validation evidence |
| Forward testing | Complex skills use fresh agents/subagents with raw artifacts and no leaked expected answer | Test prompt gives away the intended fix |
| Placeholder cleanup | Generated TODOs, examples, and placeholder resources are removed or completed | Template placeholders remain in shipped skill |

Codex alignment output:

```markdown
### ChatGPT/Codex Skill Creator Alignment
| Check | Status | Evidence | Required Fix |
|---|---|---|---|
| Required SKILL.md | PASS / FAIL / PARTIAL | [path/line] | [fix] |
| Name and folder rules | PASS / FAIL / PARTIAL | [path/line] | [fix] |
| Frontmatter fields | PASS / FAIL / PARTIAL | [path/line] | [fix] |
| agents/openai.yaml freshness | PASS / FAIL / PARTIAL / N/A | [path/line] | [fix] |
| Progressive disclosure | PASS / FAIL / PARTIAL | [path/line] | [fix] |
| Resource fit | PASS / FAIL / PARTIAL | [path/line] | [fix] |
| Extra file hygiene | PASS / FAIL / PARTIAL | [path/line] | [fix] |
| Validation command | PASS / FAIL / PARTIAL / N/A | [command/evidence] | [fix] |
| Forward testing | PASS / FAIL / PARTIAL / N/A | [evidence] | [fix] |
```

If a Codex skill lacks `SKILL.md`, valid `name`/`description`, or usable folder naming, mark readiness `NEEDS WORK`.

If a Codex skill is structurally valid but lacks progressive disclosure, resource-fit review, metadata freshness, or validation evidence, mark readiness no higher than `CONDITIONAL`.

### 6.1 Migration Shape Recommendation

When the target is a Claude command being considered for Codex, recommend one of these shapes:

| Shape | Use when |
|---|---|
| `SKILL.md only` | The workflow is concise and mostly procedural |
| `SKILL.md + references/` | The command has long examples, policy text, schemas, or variant-specific details |
| `SKILL.md + scripts/` | The command requires repeatable deterministic generation, validation, parsing, or transformation |
| `SKILL.md + assets/` | The command needs reusable templates, media, boilerplate, or output resources |
| `Do not migrate` | The command is repo-local, obsolete, or better kept as a Claude command |

Migration output:

```markdown
### Migration Recommendation
| Decision | Target Shape | Rationale | Risks | Next Step |
|---|---|---|---|---|
| MIGRATE / KEEP / SPLIT | [shape] | [why] | [risk] | [action] |
```

### 6.2 Documentation Sync

When a command or skill is changed, renamed, migrated, or given new modes, enforce a docs sync before marking the work complete.

Check these docs when present:

- `README.md`
- `.claude/commands/README.md`
- `docs/**/*.md`
- command index files
- skill registry files
- migration notes or usage guides

Inspect docs for:

- old command names such as `/_skillEnhancer` when `/_skill2.0` is now canonical
- missing or stale examples such as `/_skill2.0 .claude/commands/`
- outdated mode lists
- outdated output sections
- outdated readiness labels or scorecards
- stale migration guidance
- stale handoffs or next steps

Documentation sync output:

```markdown
### Documentation Sync
| Document | Status | Evidence | Required Update | Priority |
|---|---|---|---|---|
| README.md | PASS / FAIL / PARTIAL / N/A | [section/line] | [fix] | Must/Should/Nice |

### Toolkit Version Sync
| Surface | Status | Evidence | Required Update | Priority |
|---|---|---|---|---|
| README badge/status | PASS / FAIL / PARTIAL / N/A | [version/date] | [fix] | Must/Should/Nice |
| README command version table | PASS / FAIL / PARTIAL / N/A | [command row] | [fix] | Must/Should/Nice |
| CHANGELOG.md toolkit entry | PASS / FAIL / PARTIAL / N/A | [version section] | [fix] | Must/Should/Nice |
```

If command behavior, usage, or naming changes and a relevant `README.md` exists but is not updated, mark readiness no higher than `CONDITIONAL`.

If docs still point users to a stale command name or broken invocation, mark it Must Have.

### Toolkit Version Sync

Before any commit or branch push, `_skill2.0` must enforce that the SmartWorkz++ toolkit/global version increases. This applies even when no command version changed. If a command, skill command, or command-family file version also changes, both the command version and toolkit version must move before the work is complete.

Required checks:

| Surface | Required update | Evidence |
|---|---|---|
| `README.md` project badge/status | Update the SmartWorkz++ toolkit version badge and last-updated date for every commit or branch push | `SmartWorkz++-vX.Y.Z` and `Last updated: YYYY-MM-DD` |
| `README.md` command version table | Update every changed command row to its new version and current summary | `/command` row shows new version |
| `CHANGELOG.md` | Add or update an entry for the new toolkit version that summarizes the committed/pushed changes | `## [X.Y.Z] - YYYY-MM-DD` or current Unreleased section |
| Target command file | Bump command version, updated date, and top changelog/version-history row | command header + version history |

Commit and changelog attribution:

- Use `KapilDev` as the author/actor name for command version-history rows, changelog author columns, and commit attribution evidence.
- Do not write `Codex`, `OpenAI`, or `Open AI` as the author of completed toolkit changes.
- Before any `git commit`, verify `git config user.name`; if it is missing or set to `Codex`, `OpenAI`, or `Open AI`, set it locally to `KapilDev`.
- If a completed change leaves Codex/OpenAI-style authorship in command history, changelog, README, or commit evidence, mark Documentation Sync as `FAIL` and fix before completion.

Default SemVer decision for every commit/push toolkit version bump:

- `PATCH`: default for a single commit, small command fix, wording correction, narrow validation hardening, or docs-only sync.
- `MINOR`: branch push containing multiple command updates, new command capability, new mode, new generated artifact convention, or repo-wide command-framework behavior.
- `MAJOR`: commit/push with breaking command invocation, generated artifact layout that requires migration, removed workflow, or incompatible approval/ADO/doc contract.

If a commit or branch push is requested and the toolkit version surfaces did not increase, mark Documentation Sync as `FAIL`, add a Must Have fix, and cap readiness at `CONDITIONAL`. If README points to a stale toolkit version or command version after a behavior change, cap readiness at `CONDITIONAL`; if the stale version causes users to invoke an obsolete command path, cap readiness at `NEEDS WORK`.

### 7. New Skill Capability Enhancement

When a target skill or command is missing behavior that would make it more useful, do not only say "add feature." Define the new capability clearly enough that another agent can implement and verify it.

Use this capability-addition check:

| Check | Required answer |
|---|---|
| Capability name | What is the new behavior called? |
| Trigger phrases | Which user words, task types, or repo signals should activate it? |
| Capability boundary | Does this belong in this skill, a sibling skill, or a new command? |
| Workflow impact | Which steps, prerequisites, gates, or outputs change? |
| Handoff impact | Which downstream command, doc, ADO item, or report should receive the result? |
| Verification scenario | How can an agent prove the enhanced skill works under pressure? |
| Version impact | What version bump and changelog row are required? |

Capability recommendations must include:

- a short capability statement written as user-visible behavior
- at least 3 realistic activation phrases or task examples
- a boundary decision: `IN-SKILL`, `SIBLING COMMAND`, or `NEW COMMAND`
- concrete output changes, not vague "improve report" language
- one pressure scenario that would fail without the new guidance

Do not overstuff skills. Mark a recommendation as `NEW COMMAND` when the proposed behavior has a different audience, different inputs, different outputs, or a different lifecycle than the current skill.

Capability opportunity matrix:

```markdown
| Capability | Boundary | Trigger Examples | Workflow / Output Change | Verification Scenario | Priority |
|---|---|---|---|---|---|
| Add estimate confidence scoring | IN-SKILL | quote, estimate, timeline risk | Add confidence section to OUTPUT | User asks for fixed-price quote with vague scope | Should Have |
```

Applied capability fixes must include a verification plan:

```markdown
### Verification Plan
| Check | Command / Review | Expected Result |
|---|---|---|
| Helper trigger | Run skill with `help` | Helper document appears and workflow does not start |
| Output format | Review generated report | Required sections are present |
| Documentation sync | Review `README.md` and docs | Changed command names, modes, examples, outputs, and handoffs are current |
| Version trail | Inspect version history/changelog | New top-row entry exists |
```

### 8. Comment-Triggered Helper Document

Every skill or command should support a helper-document path that appears only when the user asks for help or use cases. Normal task execution must not be interrupted by the helper.

Treat these as helper triggers:

- `help`
- `?`
- `usage`
- `use cases`
- `examples`
- `what can this skill do`
- `show helper`
- a comment-style request such as `# help`, `// help`, or `<!-- help -->`

The helper document should include:

| Section | Required content |
|---|---|
| Purpose | One or two lines explaining the skill's job |
| When to use | Common user intents and trigger phrases |
| Inputs needed | Files, IDs, docs, branches, credentials, or context the user must provide |
| Use cases | At least 5 realistic examples |
| Outputs | Files, reports, PRs, ADO items, or messages the skill produces |
| Next steps | Follow-up commands or handoff path |
| Safety notes | Blocking rules, approval needs, or common mistakes |

Recommended helper output:

```markdown
## [Skill Name] Helper

### Purpose
[short purpose]

### Use Cases
- [example 1]
- [example 2]
- [example 3]
- [example 4]
- [example 5]

### Required Inputs
- [input]

### Outputs
- [output]

### Next Steps
- [handoff]
```

When reviewing skills, mark missing or weak helper behavior as:

- **Must Have** if the skill is broad, high-risk, or often misused
- **Should Have** if the skill has multiple modes or non-obvious prerequisites
- **Nice to Have** if the skill is narrow and already self-explanatory

In repo-wide mode, recommend this helper-document pattern as a standardized fix for all active command files.

### 9. Compliance and Convention Check

Check for:

- valid YAML frontmatter
- strong description with trigger language
- Claude skill type classification when applicable
- trigger-focused description without workflow-summary shortcut risk
- TDD-style validation or pressure-test plan for skill changes
- anti-rationalization coverage for discipline-enforcing skills
- token-efficiency and split-vs-extend decision for broad skills
- Codex folder anatomy when the target is a Codex skill
- Codex naming, frontmatter, progressive disclosure, and bundled-resource rules
- Codex validation or forward-testing evidence when available
- dedicated `Prerequisites` section for commands with required inputs
- version header present and current
- changelog present and updated
- consistent `STEP` headings
- clear `Prerequisites`
- clear `OUTPUT`
- comment-triggered helper document with use cases
- documentation sync rule after command behavior changes
- workflow-command hardening for broad staged commands
- phase/stage done-summary blocks for phased, staged, gated, or mode-based commands
- stack/platform coverage matches description and compatibility claims
- approval gates include bypass-pressure handling and anti-rationalization red flags
- partial-failure recovery for scaffold, build, deploy, push, or sync steps
- stable numbering and section naming
- realistic user-facing language
- no stale command names
- consistent family conventions across sibling commands

### 10. Repo-Wide Standardization Check

In multi-file or repo-wide mode, find repeated issues such as:

- inconsistent `STEP` separators
- stale workflow names
- weak or undertriggered descriptions
- missing downstream handoffs
- missing comment-triggered helper documents with use cases
- missing prerequisites in sibling commands
- missing Claude skill-creator alignment checks
- missing ChatGPT/Codex skill-creator alignment checks
- missing progressive-disclosure and resource-fit checks
- inconsistent output naming
- missing version bumps after enhancement
- docs that still mention old command names or usage examples
- missing capability-boundary decisions for new feature recommendations
- missing workflow-command hardening checks for broad staged commands
- missing stack/platform coverage checks for commands that claim multi-stack or mobile support
- missing partial-failure recovery for scaffold, build, deploy, push, or sync automation
- numbering drift in formal step sequences
- repeated terminology drift across a command family

When a pattern appears in 2 or more files, recommend a **standardized fix group** rather than isolated edits.

---

## Required Process

### Single File

1. Read description
2. Summarize promised behavior
3. Audit current capabilities
4. Identify gaps
5. Identify weak or missing features
6. Check helper-document behavior and use-case coverage
7. Check Claude skill-creator alignment when applicable
8. Check ChatGPT/Codex skill-creator alignment when applicable
9. Check documentation sync impact when behavior, usage, outputs, modes, names, or handoffs changed
10. Identify new capability opportunities and their boundaries
11. Produce Must Have / Should Have / Nice to Have recommendations
12. State readiness: `APPROVED`, `CONDITIONAL`, or `NEEDS WORK`

### Multiple Files

1. Repeat single-file review for each file
2. Identify repeated issues
3. Highlight consistency drift
4. Produce grouped fix recommendations
5. Identify stale documentation references across the file set

### Repo-Wide

1. Inventory all `.claude/commands/*.md`
2. Read each description
3. Review each file against its own description
4. Build a repeated-issues matrix
5. Group standardized fixes
6. Group helper-document rollout recommendations
7. Group Claude skill-creator alignment recommendations
8. Group ChatGPT/Codex skill-creator alignment recommendations
9. Group documentation sync recommendations, including `README.md` usage updates
10. Group cross-cutting new capability opportunities
11. Produce rollout order

### Codex Skill Folder

1. Confirm folder contains `SKILL.md`
2. Check name, folder, and frontmatter rules
3. Review `agents/openai.yaml` freshness if present
4. Review progressive disclosure and bundled resources
5. Check extra-file hygiene and placeholders
6. Check validation and forward-testing evidence
7. Check docs that mention the skill or command invocation
8. Produce readiness using Codex caps

### Migration

1. Read the Claude command description and body
2. Identify user triggers and reusable workflow units
3. Decide target shape: keep, migrate, or split
4. Map content to `SKILL.md`, `references/`, `scripts/`, and `assets/`
5. Define validation and forward-testing plan
6. Define documentation updates for old and new command paths
7. Produce migration risks and rollout order

---

## Output Format

### Executive Summary

```text
[Target] reviewed against its own description and current implementation.
Current capabilities: [brief summary].
Main gaps: [top 1-3].
Documentation sync: [current / stale / not applicable].
Priority: [Must Have / Should Have / Nice to Have summary].
Readiness: [APPROVED / CONDITIONAL / NEEDS WORK].
```

### Per-File Report

```markdown
## File
.claude/commands/example.md

### Description Promise
- [short paraphrase of what the description says]

### Current Capabilities
- [capability 1]
- [capability 2]
- [capability 3]

### Current Gaps
- [gap 1]
- [gap 2]

### Helper Document Readiness
| Helper Area | Present | Evidence | Fix Needed |
|---|---|---|---|
| Comment-triggered helper | Yes/No/Partial | [line/section] | [fix] |
| Use cases | Yes/No/Partial | [line/section] | [fix] |

### Documentation Sync
| Document | Status | Evidence | Required Update | Priority |
|---|---|---|---|---|
| README.md | PASS / FAIL / PARTIAL / N/A | [section/line] | [fix] | Must/Should/Nice |

### Toolkit Version Sync
| Surface | Status | Evidence | Required Update | Priority |
|---|---|---|---|---|
| README badge/status | PASS / FAIL / PARTIAL / N/A | [version/date] | [fix] | Must/Should/Nice |
| README command version table | PASS / FAIL / PARTIAL / N/A | [command row] | [fix] | Must/Should/Nice |
| CHANGELOG.md toolkit entry | PASS / FAIL / PARTIAL / N/A | [version section] | [fix] | Must/Should/Nice |

### Phase/Stage Done Summary Readiness
| Area | Status | Evidence | Required Fix | Priority |
|---|---|---|---|---|
| Phase summaries | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Stage summaries | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Gate summaries | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Final run summary | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |

### Claude Skill Creator Alignment
| Check | Status | Evidence | Required Fix |
|---|---|---|---|
| Skill type classified | PASS / FAIL / PARTIAL | [line/section] | [fix] |
| Trigger-focused description | PASS / FAIL / PARTIAL | [line/section] | [fix] |
| Search/discovery quality | PASS / FAIL / PARTIAL | [line/section] | [fix] |
| TDD-style validation | PASS / FAIL / PARTIAL | [line/section] | [fix] |
| Pressure scenarios | PASS / FAIL / PARTIAL | [line/section] | [fix] |
| Anti-rationalization coverage | PASS / FAIL / PARTIAL | [line/section] | [fix] |
| Token efficiency | PASS / FAIL / PARTIAL | [line/section] | [fix] |
| Split-vs-extend decision | PASS / FAIL / PARTIAL | [line/section] | [fix] |

### ChatGPT/Codex Skill Creator Alignment
| Check | Status | Evidence | Required Fix |
|---|---|---|---|
| Required SKILL.md | PASS / FAIL / PARTIAL / N/A | [path/line] | [fix] |
| Name and folder rules | PASS / FAIL / PARTIAL / N/A | [path/line] | [fix] |
| Frontmatter fields | PASS / FAIL / PARTIAL / N/A | [path/line] | [fix] |
| agents/openai.yaml freshness | PASS / FAIL / PARTIAL / N/A | [path/line] | [fix] |
| Progressive disclosure | PASS / FAIL / PARTIAL / N/A | [path/line] | [fix] |
| Resource fit | PASS / FAIL / PARTIAL / N/A | [path/line] | [fix] |
| Extra file hygiene | PASS / FAIL / PARTIAL / N/A | [path/line] | [fix] |
| Validation command | PASS / FAIL / PARTIAL / N/A | [command/evidence] | [fix] |
| Forward testing | PASS / FAIL / PARTIAL / N/A | [evidence] | [fix] |

### Feature Opportunities
#### Must Have
- [item]

#### Should Have
- [item]

#### Nice to Have
- [item]

### New Capability Opportunities
| Capability | Boundary | Trigger Examples | Workflow / Output Change | Verification Scenario | Priority |
|---|---|---|---|---|---|
| [capability] | IN-SKILL / SIBLING COMMAND / NEW COMMAND | [phrases] | [change] | [scenario] | Must/Should/Nice |

### Workflow Command Hardening
| Check | Status | Evidence | Required Fix | Priority |
|---|---|---|---|---|
| Helper intercept | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Gate bypass pressure | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Stack/platform coverage | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Documentation sync | PASS / FAIL / PARTIAL / N/A | [line/section/doc path] | [fix] | Must/Should/Nice |
| Phase/stage done summaries | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Partial-failure recovery | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Token bloat/resource split | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |
| Numbering consistency | PASS / FAIL / PARTIAL / N/A | [line/section] | [fix] | Must/Should/Nice |

### Verification Plan
| Check | Command / Review | Expected Result |
|---|---|---|
| [check] | [command or manual review] | [expected result] |

### Scorecard
| Area | Score | Notes |
|---|---:|---|
| Description Contract | 0-5 | [notes] |
| Workflow Body | 0-5 | [notes] |
| Helper Readiness | 0-5 | [notes] |
| Claude Alignment | 0-5 / N/A | [notes] |
| Codex Alignment | 0-5 / N/A | [notes] |
| Documentation Sync | 0-5 / N/A | [notes] |
| Phase/Stage Summaries | 0-5 / N/A | [notes] |
| Toolkit Version Sync | 0-5 / N/A | [notes] |
| Verification | 0-5 | [notes] |
| Maintainability | 0-5 | [notes] |

### Readiness
- APPROVED / CONDITIONAL / NEEDS WORK
```

### Repo-Wide Summary

```markdown
## Repo-Wide Summary

Files Reviewed: X
Families Covered: swp, swd, swm, swmk, swc, sw

### Repeated Must Have Issues
| Pattern | Files | Standard Fix |
|---|---|---|
| Missing downstream handoff | swmk-campaign, ... | Add explicit next-command line in OUTPUT |
| Stale README command examples | README.md, command index | Update old names and add `/_skill2.0 .claude/commands/` |

### Repeated Should Have Issues
| Pattern | Files | Standard Fix |
|---|---|---|
| Weak trigger language | swmk-*, sw-* | Expand descriptions with realistic user phrasing |
| Missing helper document | swp-*, swd-*, swm-* | Add comment-triggered helper section with use cases |
| Missing Claude alignment | reusable skills | Add skill type, trigger-only description, pressure tests, and split-vs-extend decision |
| Missing Codex alignment | Codex skill folders | Add SKILL.md, naming, metadata, progressive-disclosure, resource-fit, validation, and forward-test checks |
| Missing workflow hardening | broad staged commands | Add helper intercept, gate-bypass pressure handling, partial-failure recovery, stack coverage audit, and token split recommendations |

### Repeated Nice to Have Issues
| Pattern | Files | Standard Fix |
|---|---|---|
| Missing worked example | ... | Add one filled example for the main workflow |

### Cross-Cutting Capability Opportunities
| Capability Pattern | Files | Boundary Decision | Standard Enhancement |
|---|---|---|---|
| Missing handoff snapshots | swd-*, swm-* | IN-SKILL | Add consistent output/handoff block |
```

---

## Version and Changelog Protocol After Fixes

If a fix is applied after a `_skill2.0` review, require:

1. command version bump
2. updated date
3. top-row command changelog/version-history entry
4. SmartWorkz++ toolkit/global version bump before every commit or branch push
5. `README.md` badge/status, command version table, and docs sync updates
6. `CHANGELOG.md` toolkit entry or Unreleased entry
7. clear commit message

Example:

```text
Command  : 2.6 -> 2.7
Toolkit  : 1.3.0 -> 1.3.1
Updated  : 2026-05-21
Docs     : README.md badge/status, command version table, and CHANGELOG.md updated
```

Changelog row:

```markdown
| 2.7 | 2026-05-21 | SmartWorkz | Added phase/stage done-summary enforcement for multi-step skills |
```

If a command only has a version-history list, add a top-row entry there. If it has a changelog table, update the table. If it has neither, add `## Version History`. Then update the toolkit-level version trail in `README.md` and `CHANGELOG.md` before marking the applied fix complete.

Commit:

```text
git add .claude/commands/_skill2.0.md README.md CHANGELOG.md
git commit -m "fix(_skill2.0): require toolkit version bump before commit or push"
```

---

## Readiness Rules

- **APPROVED**
  - description is meaningfully fulfilled
  - no critical workflow gaps
  - no major naming or trigger drift
  - relevant docs are current when behavior changed

- **CONDITIONAL**
  - usable, but has fixable high-value issues
  - needs a small set of Must Have or Should Have improvements

- **NEEDS WORK**
  - description overclaims
  - workflow is incomplete
  - outputs or prerequisites are too weak to rely on
  - docs direct users to broken or obsolete invocations

### Readiness Caps

Apply these caps after the normal readiness decision, especially in combined Claude + Codex reviews:

| Condition | Maximum readiness | Reason |
|---|---|---|
| Claude alignment is missing for a reusable Claude skill or command | `CONDITIONAL` | The file may work locally, but discovery, validation, or maintainability is not proven |
| Codex skill folder is missing required `SKILL.md` | `NEEDS WORK` | Codex cannot treat the folder as a valid skill without the required entrypoint |
| Broad gated workflow lacks helper intercept or gate-bypass hardening | `CONDITIONAL` | Users and agents can start the wrong path or skip required approvals |
| Broad phased/gated workflow lacks phase or stage done summaries | `CONDITIONAL` | Users can lose track of what completed, what changed, what was verified, and what happens next |
| Claimed stack/platform support is materially unsupported by the body | `CONDITIONAL` | The command can produce incomplete or wrong guidance for promised targets |
| Changed command behavior is not reflected in relevant docs | `CONDITIONAL` | Users may follow stale examples, old names, or incomplete output expectations |
| Commit or branch push without toolkit version increase | `CONDITIONAL` | README badge/status or CHANGELOG can misrepresent the shipped toolkit package version |
| Docs point to a broken or obsolete command invocation | `NEEDS WORK` | The published usage path fails or routes users to the wrong command |

Do not let a generally strong report override these caps. If multiple caps apply, use the strictest readiness.

---

## Quick Review Checklist

```text
File: ___________________

Description promise: ___________________

Current capabilities:
- ___________________
- ___________________

Current gaps:
- ___________________
- ___________________

Helper document readiness:
- ___________________

Claude skill creator alignment:
- ___________________

ChatGPT/Codex skill creator alignment:
- ___________________

Documentation sync:
- ___________________

Verification plan:
- ___________________

Must Have:
- ___________________

Should Have:
- ___________________

Nice to Have:
- ___________________

New capability opportunities:
- ___________________

Readiness:
APPROVED / CONDITIONAL / NEEDS WORK
```

---

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.
## Version History
- **v2.11** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).
- **v2.10** (2026-05-21): Added Skill Maturity 2.0 Contract for repo-wide command readiness consistency
- **v2.9** (2026-05-21): Added KapilDev attribution enforcement for command changelog authors and pre-commit git user.name checks, blocking Codex/OpenAI-style authorship on completed toolkit changes
- **v2.8** (2026-05-21): Added the phase/stage done-summary contract to `_skill2.0` itself so future skill reviews and the analyzer command follow the same boundary-summary rule
- **v2.7** (2026-05-21): Added phase/stage done-summary enforcement for phased, staged, gated, mode-based, and multi-step skills, including report tables, readiness caps, and short handoff summary templates
- **v2.6** (2026-05-20): Required SmartWorkz++ toolkit/global version increase before every commit or branch push, with README badge/status and CHANGELOG sync as a completion gate
- **v2.5** (2026-05-20): Added toolkit/global version synchronization enforcement for command version changes, including README badge/status, command version table, CHANGELOG entry, SemVer decision guidance, and readiness caps for stale toolkit versions
- **v2.4** (2026-05-20): Added documentation sync enforcement for command changes, README usage alignment, docs-sync readiness caps, and explicit `/_skill2.0 .claude/commands/` repo-wide usage coverage
- **v2.3** (2026-05-20): Added workflow-command hardening checks for helper intercepts, skill type labels, stack/platform coverage, approval-gate pressure handling, anti-rationalization guards, TDD-style validation plans, partial-failure recovery, token bloat/resource splits, numbering drift, and readiness caps
- **v2.2** (2026-05-20): Expanded helper and description to advertise new skill capability creation planning, including trigger phrases, boundary decisions, output changes, handoffs, verification scenarios, and usage examples
- **v2.1** (2026-05-19): Added Codex Skill Folder Review Mode, Migration Mode, applicability rules, migration shape recommendations, scorecard output, and updated legacy `_skillEnhancer` wording
- **v2.0** (2026-05-19): Forked from `_skillEnhancer` v1.6 into `_skill2.0`; added ChatGPT/Codex skill-creator alignment covering skill folder anatomy, `agents/openai.yaml`, progressive disclosure, scripts/references/assets, extra-file hygiene, validation, forward testing, and placeholder cleanup
- **v1.6** (2026-05-19): Added Claude skill-creator alignment review, including skill type, trigger-focused descriptions, search quality, TDD-style validation, pressure scenarios, anti-rationalization coverage, token efficiency, and split-vs-extend checks
- **v1.5** (2026-05-19): Added `_skillEnhancer`'s own helper response, prerequisites, severity guide, applied-fix verification plan, and clearer version/changelog handling
- **v1.4** (2026-05-19): Added comment-triggered helper-document review rules for all skills, including help/use-case triggers, required helper sections, readiness output, and repo-wide rollout guidance
- **v1.3** (2026-05-19): Added new capability enhancement rules, including trigger phrases, capability boundaries, workflow/output impact, pressure-scenario verification, and overstuffing guards
- **v1.2** (2026-05-18): Added explicit single-file, multi-file, and repo-wide enhancement modes; made all reviews description-driven; added required current capabilities/gaps/feature-opportunity outputs; added repo-wide standardization reporting
- **v1.1** (2026-05-18): Added version/changelog protocol after applied fixes
- **v1.0** (2026-05-14): Initial skill audit and gap assessment framework

