# Toolkit Health & Creation Suite — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement four new toolkit management commands (`/swpp-audit`, `/swpp-create`, `/swpp-fix`, `/swpp-health`) to audit and create skills, MCPs, and hooks across the SmartWorkz++ ecosystem.

**Architecture:** Each command follows the established 5-STEP pattern from `/swpp-refine` (audit → recommend → score → approve → execute). The meta-command `/swpp-health` synthesizes results into a unified health report. Commands are independent but cross-linked.

**Tech Stack:** Markdown for command definitions, Glob/Grep for filesystem scans, Git for committing snapshots.

---

## Task 1: Create `/swpp-audit` Command

**Files:**
- Create: `.claude/commands/swpp-audit.md`

- [ ] **Step 1: Create the swpp-audit.md file with header, purpose, and all 5 STEPs**

Create `.claude/commands/swpp-audit.md` with full content including:
- Header with version 1.0, updated 2026-05-14
- Changelog table
- Purpose statement referencing SRS, CONTEXT, design spec
- STEP 0: Scope detection for [skill|mcp|hook] and optional [name]
- STEP 1A: Health dashboard for multi-tool mode
- STEP 1: Audit checks with structure checklists for each tool type
- STEP 1.2: Coverage depth rating
- STEP 1.3: Cross-tool consistency checks
- STEP 2: Gap summary with priority and effort
- STEP 3: Recommendations with priority order
- STEP 4: Coverage score on 5 dimensions (20 pts each)
- STEP 5: Output summary and next steps

All STEPs must have STOP gates between them.

- [ ] **Step 2: Verify structure and commit**

Verify:
- All 5 STEPs present with clear flow ✅
- STOP gates between steps ✅
- Syntax matches /swpp-refine pattern ✅
- Tool types (skill, mcp, hook) covered with type-specific checklists ✅

Commit:
```bash
git add .claude/commands/swpp-audit.md
git commit -m "feat(commands): add /swpp-audit command for skills, MCPs, hooks v1.0

Unified audit command for all toolkit tool types with 5-step structured process.
Covers structure, documentation, consistency, and cross-tool integration checks.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Create `/swpp-create` Command

**Files:**
- Create: `.claude/commands/swpp-create.md`

- [ ] **Step 1: Create the swpp-create.md file with full 5-STEP structure**

Create `.claude/commands/swpp-create.md` with full content including:
- Header with version 1.0, updated 2026-05-14
- Changelog table
- Purpose statement with prerequisite reads
- STEP 0: Validation for [skill|mcp|hook] [name] syntax
- STEP 1: Requirements gathering (Q1-Q4 about purpose, prerequisites, integrations, success criteria)
- STEP 2: Show checklist (different checklist for SKILL, MCP, HOOK)
- STEP 3: Scaffold generation (invoke writing-skills, show file path)
- STEP 4: Initialize (add to CONTEXT.md, generate commit template)
- STEP 5: Finalize (output summary, next steps)

All 5 STEPs with STOP gates.

- [ ] **Step 2: Verify and commit**

Verify:
- All 5 STEPs present ✅
- Checklists specific to each tool type (SKILL, MCP, HOOK) ✅
- Validation step at top ✅
- Next-step guidance clear ✅

Commit:
```bash
git add .claude/commands/swpp-create.md
git commit -m "feat(commands): add /swpp-create command for skills, MCPs, hooks v1.0

Unified creation command with guided requirements gathering, checklists, and scaffolding.
Creates tools with proper version headers, documentation, and integration links.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Create `/swpp-fix` Command

**Files:**
- Create: `.claude/commands/swpp-fix.md`

- [ ] **Step 1: Create the swpp-fix.md file (reuse /swpp-refine STEP pattern)**

Create `.claude/commands/swpp-fix.md` with full content including:
- Header with version 1.0, updated 2026-05-14
- Changelog table
- Purpose statement (similar to /swpp-refine but for any tool type)
- STEP 0: Validation for [skill|mcp|hook] [name]
- STEP 1: Audit (read & assess using same audit as /swpp-audit)
- STEP 2: Gap summary (show gaps with priority/effort)
- STEP 3: Approval gate with PENDING DECISIONS matrix
- STEP 4: Apply fixes (edit tool, increment version, update changelog, commit)
- STEP 5: Output summary (version before/after, gaps fixed/deferred/accepted)

All 5 STEPs with STOP gates between them.

- [ ] **Step 2: Verify and commit**

Verify:
- Matches /swpp-refine pattern ✅
- STOP gates clear ✅
- PENDING DECISIONS matrix included ✅
- Commit instructions include version bumping ✅
- CONTEXT.md update documented ✅

Commit:
```bash
git add .claude/commands/swpp-fix.md
git commit -m "feat(commands): add /swpp-fix command for skills, MCPs, hooks v1.0

Guided repair command following /swpp-refine pattern.
Audits tool, shows gaps, waits for approval, applies fixes with version bumping.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Update `/swpp-refine` with Cross-Links

**Files:**
- Modify: `.claude/commands/swpp-refine.md`

- [ ] **Step 1: Read current swpp-refine.md to see state**

Read the file and locate the "## Purpose" section.

- [ ] **Step 2: Add related commands section**

After the prerequisite reads in the Purpose section, add:

```markdown
**Related commands:**
- `/swpp-audit [skill|mcp|hook]` — Audit any skill, MCP, or hook
- `/swpp-create [skill|mcp|hook]` — Create new skills, MCPs, or hooks
- `/swpp-fix [skill|mcp|hook]` — Guided repair of skills, MCPs, or hooks
- `/swpp-health` — Generate unified toolkit health report

This command focuses on **command skills** specifically. Use `/swpp-audit skill [name]` to audit a command skill, or `/swpp-health` to see overall health.
```

- [ ] **Step 3: Add reference in STEP 3 recommendations**

In STEP 3 (Recommendations section), add this note at the end:

```markdown
  Suggested next actions:
  - If creating a new command: Run '/swpp-create skill [name]' first
  - If auditing a command: Run '/swpp-audit skill [command-name]' for more details
  - For toolkit-wide health check: Run '/swpp-health' to see overall status
```

- [ ] **Step 4: Commit**

```bash
git add .claude/commands/swpp-refine.md
git commit -m "docs(commands): link /swpp-refine to audit/create/fix/health commands

Add cross-references to companion commands for unified toolkit management.
Clarify that /swpp-refine is for commands, /swpp-audit is for any tool type."
```

---

## Task 6: Update CONTEXT.md with Tracking Fields

**Files:**
- Modify: `.claude/toolkit/CONTEXT.md`

- [ ] **Step 1: Read CONTEXT.md to understand current structure**

Read the file and locate where to add new tracking section.

- [ ] **Step 2: Add Toolkit Management section**

Add new section with these subsections:

```markdown
## Toolkit Management

### Command Audits & Refinements
- Latest `/swpp-refine`: [command], version [old]→[new], [date]
- Latest `/swpp-audit`: [type] [name], [date], score [XX/100]

### Tool Creation
- Latest `/swpp-create`: [type] [name], [date]

### Tool Repairs
- Latest `/swpp-fix`: [type] [name], [date], version [old]→[new]

### Overall Toolkit Health
- Last `/swpp-health` run: [date]
- Overall score: [XX/100]
- Critical gaps: [N] — [list brief]
- Next action: [recommendation]

### Active Hooks
- [hook name]: [trigger] → [target] ✅/❌
- [hook name]: [trigger] → [target] ✅/❌
```

- [ ] **Step 3: Commit**

```bash
git add .claude/toolkit/CONTEXT.md
git commit -m "docs(toolkit): add health tracking fields to CONTEXT.md

Track latest audits, creations, repairs, and overall health metrics.
Update after each /swpp-audit, /swpp-create, /swpp-fix, /swpp-health run."
```

---

## Task 4: Create `/swpp-health` Command (after BATCH 1)

**Files:**
- Create: `.claude/commands/swpp-health.md`
- Create: `docs/reports/` directory

- [ ] **Step 1: Create reports directory**

```bash
mkdir -p .claude/toolkit/reports
```

Verify:
```bash
ls -la docs/reports/
```

- [ ] **Step 2: Create swpp-health.md with full 5-STEP structure**

Create `.claude/commands/swpp-health.md` with full content including:
- Header with version 1.0, updated 2026-05-14
- Changelog table
- Purpose statement with prerequisite reads
- STEP 0: Initialization (no arguments)
- STEP 1: Collect audit data (commands, skills, MCPs, hooks)
- STEP 2: Synthesize results (aggregate scores)
- STEP 3: Generate markdown report with all 6 metrics:
  - Commands health (XX/100)
  - MCPs health (XX/100)
  - Skills health (XX/100)
  - Hooks health (XX/100)
  - Cross-tool consistency (XX/100)
  - Gap coverage (list gaps by priority)
- STEP 4: Output summary
- STEP 5: Finalize (commit report to git)

Report template includes:
- Executive summary with trend
- Per-metric tables with status
- Gap ranking table
- Recommended action order
- Commit instruction with git message

- [ ] **Step 3: Verify and commit**

Verify:
- All 6 metrics in report template ✅
- STEP 3 shows complete markdown report example ✅
- Gap ranking 🔴→🟡→🟢 clear ✅
- Action items specific and linked to commands ✅
- Markdown format committable ✅

Commit:
```bash
git add .claude/commands/swpp-health.md
git commit -m "feat(commands): add /swpp-health command — unified toolkit health snapshot v1.0

Meta-command that runs audits on all commands, MCPs, skills, hooks.
Generates unified .md report with 6 health metrics and action items.
Reports saved to docs/reports/ with timestamps.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task Execution Order

**BATCH 1 (parallel):**
- Task 1: /swpp-audit
- Task 2: /swpp-create
- Task 3: /swpp-fix

**BATCH 2 (after BATCH 1, parallel):**
- Task 5: Update /swpp-refine
- Task 6: Update CONTEXT.md

**BATCH 3 (after BATCH 1, sequential):**
- Task 4: /swpp-health (depends on understanding 1-3)

---

## Definition of Done

- ✅ All 6 commands created/updated
- ✅ All files committed to git
- ✅ All commands follow 5-STEP pattern with STOP gates
- ✅ Cross-links between commands added
- ✅ CONTEXT.md updated with tracking fields
- ✅ docs/reports/ directory created
- ✅ Plan executed via subagent-driven-development with two-stage reviews
