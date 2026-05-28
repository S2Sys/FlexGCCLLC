# Design Spec: `swl-*` / `swd-*` Lead-Gated Development Workflow

**Date**: 2026-05-15  
**Author**: Zenthil  
**Status**: Approved — ready for implementation

---

## Problem

The current `swd-*` workflow has no lead approval gate. Developers can close stories (`/swd-done`) without any review of AC coverage or manual test evidence quality. There is no formal assignment step — developers self-select stories. The result: stories close with untested ACs and no lead visibility.

---

## Solution

Introduce a two-family command structure with a single AI-powered gate:

| Family | Owner | Commands |
|---|---|---|
| `swl-*` | Tech Lead | `/swl-start` |
| `swd-*` | Developer | `/swd-start`, `/swd-next`, `/swd-manual-testing`, `/swd-review`, `/swd-done` |

One new lead command (`/swl-start`), one new developer command (`/swd-review`), one gate added to `/swd-done`.

---

## Full Workflow

```
LEAD:  /swl-start [story-id]
         → validates story readiness
         → checks ACs written
         → writes assignment to session.state

DEV:   /swd-start
         → picks up assigned story
         → creates branch, loads context

DEV:   /swd-next [layer]          (repeat per subtask)
DEV:   /swd-manual-testing        (repeat per subtask)

DEV:   /swd-review
         → AI checks every AC vs unit test + manual proof
         → APPROVED: unlocks /swd-done
         → REJECTED: outputs remediation checklist, re-runnable

DEV:   /swd-done
         → gates on lead_approval = "approved"
         → commits, updates ADO, writes CONTEXT.md checkpoint
```

---

## Command Specifications

### `/swl-start [story-id]` — New command

**Purpose**: Lead assigns a story to the developer queue with readiness validation.

**Validation steps (in order):**
1. `ado_get_item(story_id)` → story must exist + status ≠ Done
2. `docs/BREAKDOWN.md` → story must be present with ≥ 1 subtask defined
3. AC check → story must have ≥ 1 Acceptance Criterion in ADO or SRS  
   HARD STOP if missing: `"Story [ID] has no ACs — write them before assigning"`
4. Assignment check → `session.state.story_id` must be absent or `wrap_done = true`  
   HARD STOP if active story exists: `"Story [ID] already in progress — run /swd-done first"`

**On success — writes to session.state:**
```json
{
  "story_id"      : "[STORY_ID]",
  "story_title"   : "[STORY_TITLE]",
  "assigned_by"   : "Lead",
  "assigned_at"   : "[ISO timestamp]",
  "lead_approval" : null,
  "status"        : "assigned",
  "work_done"     : false,
  "wrap_done"     : false,
  "tests_passed"  : false,
  "manual_testing_done": false
}
```

**Output:**
```
✅ STORY ASSIGNED
────────────────────────────────────────────────────────
Story   : [ID] — [Title]
ACs     : [N] found ✅
Subtasks: [N] defined ✅
────────────────────────────────────────────────────────
Developer: run /swd-start to begin.
```

**ADO update**: Set story status → "In Progress" via `ado_update_item`.

---

### `/swd-review` — New command

**Purpose**: AI reviews AC coverage vs submitted test evidence. Single gate before `/swd-done`.

**Inputs read:**
- `session.state` — story_id, all subtask flags
- `docs/sessions/` — all manual testing proof files for this story
- ADO story ACs (via `ado_get_item`) or SRS AC section
- Unit test results recorded during `/swd-next`

**Review logic — per AC:**
```
For each Acceptance Criterion:
  ✅ Unit test exists that maps to this AC (test name references AC ID or description)?
  ✅ Manual test proof file exists in docs/sessions/ for this AC?
  ✅ Proof file contains result (pass/fail) + evidence (screenshot/log/output)?
```

**Scoring:**
```
AC coverage score = ACs fully covered / Total ACs
All subtasks done = all BREAKDOWN.md subtasks status = Done
```

**On APPROVED** (all ACs covered, all subtasks done):
```
✅ LEAD REVIEW — APPROVED
────────────────────────────────────────────────────────
Story  : [ID] — [Title]
ACs    : [N]/[N] covered ✅
Tests  : unit ✅  manual ✅
────────────────────────────────────────────────────────
/swd-done is now unlocked. Run it to commit.
```
Writes `lead_approval: "approved"` to session.state.

**On REJECTED** (any AC gap or missing subtask):
```
❌ LEAD REVIEW — REJECTED
────────────────────────────────────────────────────────
Story  : [ID] — [N] ACs not fully covered

REMEDIATION CHECKLIST:
⬜ [AC description]
     → [specific reason: no unit test / no manual proof / proof incomplete]
     → Action: [exact step to fix]
...

Fix all items above, then run /swd-review — AI will re-review automatically.
────────────────────────────────────────────────────────
```
Writes `lead_approval: "rejected"` + remediation checklist to session.state.

**Re-run behaviour**: Developer fixes issues and re-runs `/swd-review`. Full re-review fires each time. No limit on re-runs.

---

### `/swd-done` — Updated (add one gate)

Add at the very top of existing GATE C block:

```
GATE L — Lead approval check (runs first)

IF session.state.lead_approval ≠ "approved":
  HARD STOP:
  COMMIT BLOCKED — Lead Review Required
  ─────────────────────────────────────────────────────
  Run /swd-review first. All ACs must be covered before
  this story can be committed and closed.
  ─────────────────────────────────────────────────────
```

All existing gates (GATE C — tests_passed, manual_testing_done) remain unchanged and run after GATE L passes.

---

### `session.state` — Updated Schema

Add these fields to the existing schema in `swd-start.md` Step C:

```powershell
assigned_by     = "[Lead name or null]"   # set by /swl-start
assigned_at     = $null                   # ISO timestamp, set by /swl-start
lead_approval   = $null                   # null | "approved" | "rejected"
```

---

## File Plan

| Action | File | Notes |
|---|---|---|
| CREATE | `.claude/commands/swl-start.md` | New lead command |
| CREATE | `.claude/commands/swd-review.md` | New AI review command |
| MODIFY | `.claude/commands/swd-done.md` | Add GATE L at top |
| MODIFY | `.claude/commands/swd-start.md` | Add 3 new session.state fields |

---

## Acceptance Criteria

- [ ] `/swl-start` blocks on missing ACs with clear error
- [ ] `/swl-start` blocks if a story is already active
- [ ] `/swl-start` writes all required session.state fields
- [ ] `/swd-review` reads all manual proof files from docs/sessions/
- [ ] `/swd-review` maps each AC to unit + manual test evidence
- [ ] `/swd-review` outputs APPROVED with all fields green
- [ ] `/swd-review` outputs REJECTED with per-AC remediation checklist
- [ ] `/swd-review` re-runs cleanly after developer fixes
- [ ] `/swd-done` HARD STOPs when lead_approval ≠ "approved"
- [ ] `/swd-done` proceeds normally when lead_approval = "approved"
- [ ] `swd-start.md` session.state schema includes `assigned_by`, `assigned_at`, `lead_approval`
