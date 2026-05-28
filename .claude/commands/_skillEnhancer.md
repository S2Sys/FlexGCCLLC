---
name: _skillEnhancer
description: Analyze existing skills or command files against their own descriptions and actual implementation. Read each target file, extract the stated purpose from frontmatter and body, then report current capabilities, gaps, missing features, helper-document readiness, new capability opportunities, and prioritized recommendations grouped as Must Have / Should Have / Nice to Have. Use for single-skill review, multi-file audits, or repo-wide command enhancement across .claude/commands/*.md.
compatibility: Requires SKILL.md or markdown-based command files with YAML frontmatter
---


Command  : /_skillEnhancer
Version  : 2.1
Updated  : 2026-05-21
Author   : KapilDev

# Skill Analysis and Enhancement Framework

Use this command to review existing skills or command prompts and turn vague quality feedback into a structured enhancement report.

The file's own description is the contract.

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

## Prerequisites

- Target file path, command folder, or pasted inline content
- Access to the full target file body, not only frontmatter
- For repo-wide mode, access to `.claude/commands/*.md`
- For applied fixes, permission to edit the target command file and update its version/changelog

For every target file, this command must answer:

1. What does the description say the skill should do?
2. What does the body actually enable today?
3. What are the current capabilities?
4. What are the gaps between description and implementation?
5. What features are missing, weak, or inconsistent?
6. Does the skill provide a comment-triggered helper document with use cases?
7. Which new skill capabilities should be added, if any?
8. Does the skill align with Claude skill-creator discipline?
9. What should be fixed first as Must Have, Should Have, and Nice to Have?

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
## _skillEnhancer Helper

### Purpose
Review existing skills or command files against their own descriptions, then identify capabilities, gaps, helper readiness, new capability opportunities, and prioritized fixes.

### Use Cases
- Review one command for missing workflow steps.
- Compare two sibling commands for inconsistent outputs.
- Audit all `.claude/commands/*.md` files for repeated gaps.
- Check whether a skill has a help/use-case helper path.
- Identify whether a requested feature belongs inside a skill, a sibling command, or a new command.
- Produce a Must Have / Should Have / Nice to Have fix list before editing.

### Required Inputs
- One markdown file, multiple markdown files, a command folder, or pasted command content.

### Outputs
- Description promise summary.
- Current capabilities and current gaps.
- Helper document readiness.
- New capability opportunities.
- Prioritized recommendations.
- Readiness verdict: APPROVED, CONDITIONAL, or NEEDS WORK.

### Next Steps
- Apply approved fixes.
- Bump version and changelog.
- Run verification checks.
- Commit with a clear message.
```

If `$ARGUMENTS` is empty and no inline content is provided, output:

```text
USAGE: Provide one or more skill files to analyze.

- Single file:
  /_skillEnhancer .claude/commands/swp-arch.md

- Multiple files:
  /_skillEnhancer .claude/commands/swp-arch.md .claude/commands/swp-ui.md

- Whole command library:
  /_skillEnhancer .claude/commands/

- Inline content:
  /_skillEnhancer
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

---

## When to Use This Skill

Use this skill when:

- reviewing an existing skill or command for quality and completeness
- identifying drift between a file's description and its actual workflow
- auditing current capabilities and missing features
- checking whether a skill can show a concise helper document with use cases when the user asks for help
- comparing a skill against Claude skill-creator rules before enhancement
- finding trigger gaps, output gaps, or prerequisite gaps
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
- Must Have / Should Have / Nice to Have recommendations

### Mode 2 - Multi-File Comparison

Review several explicit files together.

Required output:

- per-file analysis
- repeated issues across the set
- family consistency problems
- standardized fix suggestions

### Mode 3 - Repo-Wide Enhancement

Review the entire `.claude/commands/` library.

Required output:

- command inventory
- per-file description-driven analysis
- repeated repo-wide gaps
- command-family consistency issues
- grouped Must Have / Should Have / Nice to Have fixes
- rollout order for standardized changes

In repo-wide mode, prefer identifying **patterns** over dumping isolated trivia.

---

## Analysis Framework

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
3. Read the body and map what is actually implemented.
4. If the target is a Claude skill or reusable command, check Claude Skill Creator Alignment.

You must produce these three sections for every file:

- **Current Capabilities**
- **Current Gaps**
- **Feature Opportunities**

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
- versioning discipline

Use this matrix:

```markdown
| Capability | Present | Quality | Evidence | Notes |
|---|---|---|---|---|
| Trigger coverage | Yes | Strong | Description lines X-Y | Includes realistic user phrasing |
| Output artifact naming | Partial | Medium | OUTPUT section | File name present, but handoff missing |
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
| Skill Creator Gap | skill violates Claude skill-writing discipline | description explains workflow instead of trigger conditions |
| Consistency Gap | drifts from sibling commands | different step style, naming, or version format |

Use this matrix:

```markdown
| Gap | Type | Severity | Evidence | Impact |
|---|---|---|---|---|
| Missing downstream handoff | Handoff Gap | High | OUTPUT section | Worker may stop too early |
```

### 4. Feature Opportunities

Recommend improvements grouped as:

- **Must Have**
  - blocking issue
  - description-breaking issue
  - dangerous ambiguity
  - missing prerequisite or missing critical output
  - stale naming that breaks workflow
  - missing helper path for broad or high-risk commands
  - missing verification plan for an applied enhancement
  - missing Claude skill-creator alignment for reusable skills

- **Should Have**
  - strong improvement to usability, discoverability, or consistency
  - missing triggers
  - missing handoff guidance
  - missing compliance or governance note

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
```

Severity guide:

| Severity | Meaning | Typical priority |
|---|---|---|
| Critical | Can cause wrong workflow, unsafe output, or broken handoff | Must Have |
| High | Blocks reliable use or violates the description promise | Must Have |
| Medium | Reduces usability, consistency, or discoverability | Should Have |
| Low | Polish or optional clarity improvement | Nice to Have |
| Info | Observation only | No fix required |

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

### 6. New Skill Capability Enhancement

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
| Version trail | Inspect version history/changelog | New top-row entry exists |
```

### 7. Comment-Triggered Helper Document

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

### 8. Compliance and Convention Check

Check for:

- valid YAML frontmatter
- strong description with trigger language
- Claude skill type classification when applicable
- trigger-focused description without workflow-summary shortcut risk
- TDD-style validation or pressure-test plan for skill changes
- anti-rationalization coverage for discipline-enforcing skills
- token-efficiency and split-vs-extend decision for broad skills
- dedicated `Prerequisites` section for commands with required inputs
- version header present and current
- changelog present and updated
- consistent `STEP` headings
- clear `Prerequisites`
- clear `OUTPUT`
- comment-triggered helper document with use cases
- realistic user-facing language
- no stale command names
- consistent family conventions across sibling commands

### 9. Repo-Wide Standardization Check

In multi-file or repo-wide mode, find repeated issues such as:

- inconsistent `STEP` separators
- stale workflow names
- weak or undertriggered descriptions
- missing downstream handoffs
- missing comment-triggered helper documents with use cases
- missing prerequisites in sibling commands
- missing Claude skill-creator alignment checks
- inconsistent output naming
- missing version bumps after enhancement
- missing capability-boundary decisions for new feature recommendations
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
8. Identify new capability opportunities and their boundaries
9. Produce Must Have / Should Have / Nice to Have recommendations
10. State readiness: `APPROVED`, `CONDITIONAL`, or `NEEDS WORK`

### Multiple Files

1. Repeat single-file review for each file
2. Identify repeated issues
3. Highlight consistency drift
4. Produce grouped fix recommendations

### Repo-Wide

1. Inventory all `.claude/commands/*.md`
2. Read each description
3. Review each file against its own description
4. Build a repeated-issues matrix
5. Group standardized fixes
6. Group helper-document rollout recommendations
7. Group Claude skill-creator alignment recommendations
8. Group cross-cutting new capability opportunities
9. Produce rollout order

---

## Output Format

### Executive Summary

```text
[Target] reviewed against its own description and current implementation.
Current capabilities: [brief summary].
Main gaps: [top 1-3].
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

### Verification Plan
| Check | Command / Review | Expected Result |
|---|---|---|
| [check] | [command or manual review] | [expected result] |

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

### Repeated Should Have Issues
| Pattern | Files | Standard Fix |
|---|---|---|
| Weak trigger language | swmk-*, sw-* | Expand descriptions with realistic user phrasing |
| Missing helper document | swp-*, swd-*, swm-* | Add comment-triggered helper section with use cases |
| Missing Claude alignment | reusable skills | Add skill type, trigger-only description, pressure tests, and split-vs-extend decision |

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

If a fix is applied after a `_skillEnhancer` review, require:

1. version bump
2. updated date
3. top-row changelog entry
4. clear commit message

Example:

```text
Version  : 2.1
Updated  : 2026-05-21
Previous version: 2.0
Change summary  : Added analytics prerequisite and normalized STEP headers
```

Changelog row:

```markdown
| 1.1 | 2026-05-18 | SmartWorkz | Added analytics prerequisite and normalized STEP headers |
```

If a command only has a version-history list, add a top-row entry there. If it has a changelog table, update the table. If it has neither, add `## Version History`.

Commit:

```text
git add .claude/commands/[skill-name].md
git commit -m "fix([skill-name]): [summary]"
```

---

## Readiness Rules

- **APPROVED**
  - description is meaningfully fulfilled
  - no critical workflow gaps
  - no major naming or trigger drift

- **CONDITIONAL**
  - usable, but has fixable high-value issues
  - needs a small set of Must Have or Should Have improvements

- **NEEDS WORK**
  - description overclaims
  - workflow is incomplete
  - outputs or prerequisites are too weak to rely on

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
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).
- **v2.0** (2026-05-21): Promoted legacy analyzer metadata to Skill Maturity 2.0 baseline for compatibility
- **v1.7** (2026-05-21): Added phase/stage done-summary contract for concise boundary summaries and final run summary
- **v1.6** (2026-05-19): Added Claude skill-creator alignment review, including skill type, trigger-focused descriptions, search quality, TDD-style validation, pressure scenarios, anti-rationalization coverage, token efficiency, and split-vs-extend checks
- **v1.5** (2026-05-19): Added `_skillEnhancer`'s own helper response, prerequisites, severity guide, applied-fix verification plan, and clearer version/changelog handling
- **v1.4** (2026-05-19): Added comment-triggered helper-document review rules for all skills, including help/use-case triggers, required helper sections, readiness output, and repo-wide rollout guidance
- **v1.3** (2026-05-19): Added new capability enhancement rules, including trigger phrases, capability boundaries, workflow/output impact, pressure-scenario verification, and overstuffing guards
- **v1.2** (2026-05-18): Added explicit single-file, multi-file, and repo-wide enhancement modes; made all reviews description-driven; added required current capabilities/gaps/feature-opportunity outputs; added repo-wide standardization reporting
- **v1.1** (2026-05-18): Added version/changelog protocol after applied fixes
- **v1.0** (2026-05-14): Initial skill audit and gap assessment framework

