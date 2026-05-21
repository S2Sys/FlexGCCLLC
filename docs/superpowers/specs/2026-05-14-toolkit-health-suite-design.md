---
title: SmartWorkz++ Toolkit Health & Creation Suite
date: 2026-05-14
author: Zenthil
status: approved
---

# SmartWorkz++ Toolkit Health & Creation Suite

## Executive Summary

Extend the SmartWorkz++ toolkit with four new unified commands (`/swpp-audit`, `/swpp-create`, `/swpp-fix`, `/swpp-health`) to manage, audit, and create skills, MCPs (Model Context Protocol servers), and hooks across the entire ecosystem. These commands work alongside the existing `/swpp-refine` (for commands) to provide comprehensive toolkit governance.

**Goals:**
- Single source of truth for toolkit health
- Direct gap-to-creation workflow (audit → create → fix → verify)
- Unified command syntax across all tool types
- Reproducible, committable health snapshots

---

## Architecture

### Command Structure

Five commands managing three tool types (skills, MCPs, hooks):

```
/swpp-refine [command-name]         — Audit & refine COMMANDS (existing)
/swpp-audit [type] [name]           — Audit SKILLS, MCPs, or HOOKS (new)
/swpp-create [type] [name]          — Create new SKILLS, MCPs, or HOOKS (new)
/swpp-fix [type] [name]             — Guided repair of SKILLS, MCPs, or HOOKS (new)
/swpp-health                        — Generate unified health report for entire toolkit (new)
```

### Tool Types

1. **SKILLS** — `.md` files in `.claude/commands/` OR superpowers skills
   - Custom toolkit skills (swp-arch, swd-start, etc.)
   - Superpowers skills (brainstorming, writing-plans, test-driven-development, etc.)
   - External skills via plugins

2. **MCPs** — Model Context Protocol servers in `.claude/mcp-servers/`
   - Each MCP has: `ado/`, `gmail/`, `google-drive/`, etc.
   - Structure: README, package.json, implementation

3. **HOOKS** — CLI hooks defined in `.claude/settings.json`
   - PreToolUse, PostToolUse, SessionStart, etc.
   - Each hook has: trigger condition + command to execute

---

## Command Details

### 1. `/swpp-audit [skill|mcp|hook] [name]`

**Purpose:** Audit any skill, MCP, or hook for structure, documentation, consistency, and gaps.

**Usage:**
```
/swpp-audit skill refactoring        — Audit a single skill
/swpp-audit skill                    — Audit ALL skills
/swpp-audit mcp ado                  — Audit the ADO MCP
/swpp-audit mcp                      — Audit ALL MCPs
/swpp-audit hook auto-format         — Audit a specific hook
/swpp-audit hook                     — Audit ALL hooks
```

**Flow (5 STEPs with STOP gates):**

**STEP 0 — Scope detection**
- If `[name]` provided: read single tool, proceed to STEP 1
- If `[name]` blank: glob all tools of that type, show health dashboard (like STEP 1A in /swpp-refine), ask which to audit

**STEP 1 — Audit checks**

Validate three dimensions:

| Dimension | For Skills | For MCPs | For Hooks |
|-----------|-----------|---------|----------|
| **Structure** | Version header, changelog, purpose, STOP gates | Version header, README, package.json, exports | Trigger type, condition syntax, target command |
| **Documentation** | Purpose statement, prerequisites, use cases | Clear purpose, API docs, version management | Description, what it does, when it fires |
| **Consistency** | Links to commands/docs, cross-references correct | Linked from commands/skills, integration tested | Referenced in CONTEXT.md, no conflicts |

**STEP 1.2 — Coverage depth**
- Thorough / Adequate / Shallow per section
- Identify strengths and gaps

**STEP 1.3 — Cross-tool consistency**
- Is this skill/MCP/hook referenced elsewhere?
- Are links correct and up-to-date?
- Does it conflict with other tools?
- Is it used? (or orphaned?)

**STEP 2 — Gap summary**
- List all issues: missing docs, broken links, version gaps, orphaned status
- Priority: 🔴 CRITICAL | 🟡 IMPORTANT | 🟢 MINOR
- Effort: SMALL | MEDIUM | LARGE

**STEP 3 — Recommendations**
- Specific fix for each gap
- Priority order

**STEP 4 — Coverage score**
- Rate on 5 dimensions (20 pts each = 100 total):
  - Structure + metadata
  - Documentation completeness
  - Cross-tool integration
  - Consistency with toolkit standards
  - Orphan/reference status

**STEP 5 — Output**
- Audit report (.md)
- Coverage score
- If gaps found: "Run `/swpp-fix [type] [name]` to repair"
- If newly created: link to `/swpp-create` in recommendations

---

### 2. `/swpp-create [skill|mcp|hook] [name]`

**Purpose:** Create a new skill, MCP, or hook from scratch with guided checklist.

**Usage:**
```
/swpp-create skill refactoring
/swpp-create mcp github
/swpp-create hook auto-lint-on-save
```

**Flow (5 STEPs):**

**STEP 0 — Validation**
- Check name validity (kebab-case)
- Check for conflicts (does it already exist?)
- Check prerequisites (e.g., is the parent directory set up?)

**STEP 1 — Requirements gathering**
- Purpose: What does this tool do?
- Prerequisites: What must exist before using it?
- Integrations: Does it depend on commands/MCPs/hooks?
- Success criteria: How do you know it works?

**STEP 2 — Show checklist**
```
Checklist for a good [SKILL|MCP|HOOK]:
□ Clear, one-line purpose
□ Prerequisites documented (SRS, CONTEXT.md, etc.)
□ Version header with format [X.Y.Z]
□ Changelog table with first entry
□ All steps documented with STOP gates
□ Links to related tools (commands, MCPs, hooks)
□ Example usage
□ Testing guidance
□ Git commit strategy documented
```

**STEP 3 — Scaffold generation**
- Invoke `writing-skills` (or equivalent) to generate initial `.md` or `.json`
- Generate with proper headers, template structure, examples

**STEP 4 — Initialize**
- Create file in correct location
- Add to appropriate registry (CONTEXT.md, settings.json)
- Create commit message template

**STEP 5 — Finalize**
- Output: new file path + checklist for next steps
- Next: "Run `/swpp-audit [type] [name]` to verify"
- Or: "Run `/swpp-fix [type] [name]` to enhance"

---

### 3. `/swpp-fix [skill|mcp|hook] [name]`

**Purpose:** Guided repair of broken or outdated tools (same flow as `/swpp-refine`, but for any tool type).

**Usage:**
```
/swpp-fix skill refactoring
/swpp-fix mcp ado
/swpp-fix hook auto-format
```

**Flow (same as `/swpp-refine` STEP 1-5):**

**STEP 0 — Validation**
- Tool exists?
- Is it broken or outdated?

**STEP 1 — Read & audit**
- Re-read the current file (mandatory)
- Run same audit as `/swpp-audit`

**STEP 2 — Gap summary**
- Show all issues with priority & effort

**STEP 3 — Recommendations**
- Specific fixes

**STEP 4 — Approval gate**
- PENDING DECISIONS matrix
- User chooses: "implement all" / "implement critical" / "fix [N]" / "skip [N]" / "defer [N]"

**STEP 5 — Apply fixes**
- Edit the tool file
- Increment version (patch: x.x.N+1 for small fixes, minor: x.N+1.0 for new sections)
- Update changelog with date, author, summary
- Commit with git message including version change
- Update CONTEXT.md 'last refined' field

---

### 4. `/swpp-health`

**Purpose:** Generate unified toolkit health snapshot covering all six health metrics.

**Usage:**
```
/swpp-health                         — Generate full report for skills, MCPs, hooks, commands
```

**No arguments.** Runs in sequence:

1. **Collect audit data**
   - Glob `.claude/commands/*.md` → run `/swpp-audit skill` on each
   - Glob `.claude/mcp-servers/*/` → run `/swpp-audit mcp` on each
   - Parse `.claude/settings.json` → run `/swpp-audit hook` on each

2. **Synthesize results**

3. **Generate markdown report:** `toolkit-health-YYYY-MM-DD.md`

**Report Sections:**

```
# Toolkit Health Report — 2026-05-14

## Executive Summary
- Overall toolkit health: 73/100 🟡
- Last updated: 2026-05-14
- Next action: Fix 3 critical gaps (listed below)

## 1. Commands Health
- Count: 22 commands
- Score: 82/100 🟢
- Metric: All have version headers, changelogs, STOP gates
- Status: ✅ Strong

## 2. MCPs Health  
- Count: 3 MCPs
- Score: 65/100 🟡
- Metric: ADO documented, Gmail missing docs, GitHub not referenced
- Status: ⚠️ Needs work — update documentation

## 3. Skills Health
- Count: 25 skills (15 custom + 10 superpowers)
- Score: 58/100 🟡
- Metric: Refactoring skill missing, brainstorming orphaned (no commands use it), TDD referenced 8x
- Status: ⚠️ Needs work — create missing skills, link orphaned ones

## 4. Hooks Health
- Count: 8 hooks
- Score: 70/100 🟡
- Metric: 2 hooks unused, 1 has syntax error
- Status: ⚠️ Needs work — remove unused hooks, fix syntax

## 5. Cross-Tool Consistency
- Commands link MCPs: 15/22 ✅
- Commands link skills: 20/22 ✅
- Skills are documented: 23/25 ✅
- No broken references: ✅
- Score: 92/100 🟢
- Status: ✅ Strong

## 6. Gap Coverage
| Gap | Type | Priority | Effort | Action |
|-----|------|----------|--------|--------|
| No refactoring skill | Skill | 🔴 CRITICAL | MEDIUM | Run `/swpp-create skill refactoring` |
| Gmail MCP missing docs | MCP | 🟡 IMPORTANT | SMALL | Run `/swpp-fix mcp gmail` |
| 2 unused hooks | Hook | 🟢 MINOR | SMALL | Review & delete via settings.json |

## Summary
- ✅ 6 metrics measured
- 🔴 1 critical gap (missing skill)
- 🟡 2 important gaps (MCP docs, unused hooks)
- 🟢 Strong overall structure

## Next Steps
1. Run `/swpp-create skill refactoring` to add missing skill
2. Run `/swpp-fix mcp gmail` to add documentation
3. Rerun `/swpp-health` to verify improvements
```

**Output:**
- Save as `toolkit-health-YYYY-MM-DD.md` in `docs/reports/`
- Git add + commit with message: "docs(health): toolkit snapshot 2026-05-14"
- Display path: "Report saved to `docs/reports/toolkit-health-2026-05-14.md`"

---

## Integration Points

### Audit → Create Workflow
When `/swpp-audit` finds a gap, output includes:
```
Gap: Refactoring skill missing
Create: Run '/swpp-create skill refactoring' to build it
```

### Create → Fix Workflow
After `/swpp-create [type] [name]`, user can:
```
Scaffold created at [path]
Next: Run '/swpp-fix [type] [name]' to enhance it
```

### Fix → Health Verification
After `/swpp-fix`, rerun `/swpp-health` to verify improvement:
```
Gap fixed: Refactoring skill now exists
New coverage score: 75/100 (was 73/100)
```

### All Commands → CONTEXT.md
Each command updates `.claude/toolkit/CONTEXT.md`:
```yaml
Last refinement: /swpp-audit skill swd-start, 2026-05-14, score improved from 85→88
Last creation: /swpp-create skill refactoring, 2026-05-14
Last health check: 2026-05-14, 73/100 overall, 3 gaps identified
```

---

## File Structure

```
.claude/
├── commands/
│   ├── swp-refine.md              (existing)
│   ├── swpp-audit.md              (new)
│   ├── swpp-create.md             (new)
│   ├── swpp-fix.md                (new)
│   └── swpp-health.md             (new)
├── mcp-servers/
│   ├── ado/
│   ├── gmail/
│   └── github/
├── toolkit/
│   ├── CONTEXT.md                 (updated with last audit/create/fix/health)
│   ├── BREAKDOWN.md
│   ├── DECISIONS.md
│   └── reports/
│       ├── toolkit-health-2026-05-14.md  (new, generated by /swpp-health)
│       └── [more snapshots]
└── settings.json                  (parsed for hooks)
```

---

## Success Criteria

- ✅ `/swpp-audit [type] [name]` audits any skill, MCP, or hook with 5-step structured process
- ✅ `/swpp-create [type] [name]` scaffolds new tools with checklists
- ✅ `/swpp-fix [type] [name]` repairs tools with user guidance
- ✅ `/swpp-health` generates unified health snapshot (`.md` report) with all 6 metrics
- ✅ Audit output suggests creating missing tools
- ✅ Create output suggests fixing newly created tools
- ✅ Fix output updates versions, changelogs, CONTEXT.md
- ✅ All commands commit to git with proper messages
- ✅ Health reports are committable, reviewable artifacts

---

## Dependencies

- **Existing:** `/swpp-refine` command structure & flow
- **Skills used:** `writing-skills` (for scaffolding), `superpowers:writing-plans` (for sequencing)
- **Toolkit docs:** SRS.md, CONTEXT.md, BREAKDOWN.md, DECISIONS.md
- **Git:** For committing snapshots

---

## Scope Notes

- **Not included:** Auto-repair (only guided repair via `/swpp-fix`)
- **Not included:** Automatic skill/MCP creation (only scaffolding + checklist)
- **Not included:** Cross-repo toolkit audits (single repo only)
- **Future:** Dashboard UI, historical trend tracking, bulk operations

---

## Questions for Tech Lead

None — design is complete and ready for implementation.
