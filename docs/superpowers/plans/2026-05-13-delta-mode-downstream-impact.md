# Delta Mode + Downstream Impact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add delta-aware update mode (detects fresh vs update run, designs changed sections only) and a DOWNSTREAM IMPACT block (shows exactly what downstream docs are stale after approval) to all four design commands.

**Architecture:** Each command gets two additions: (1) UPDATE MODE DETECTION in STEP 0 — reads the existing output doc, diffs against upstream inputs, restricts scope to changed items only; (2) DOWNSTREAM IMPACT block near the end — after approval, enumerates which downstream docs are stale and what specifically changed. sw-srs gets DOWNSTREAM IMPACT only (no output doc to delta against). All patches are additive — never overwrite existing content.

**Tech Stack:** Markdown command files only. No code. Version bumps on all 4 files.

---

## Files to modify

| File | Sections touched | Version |
|------|-----------------|---------|
| `.claude/commands/sw-srs.md` | STEP 12 step 9 — replace generic /sw-sync prompt | 4.0 → 4.1 |
| `.claude/commands/sw-ui.md` | STEP 0 end — append UPDATE MODE DETECTION; STEP 7 — append section 7.9 | 1.3 → 1.4 |
| `.claude/commands/sw-db.md` | STEP 0 end — append UPDATE MODE DETECTION; STEP 9 — insert before output | 2.1 → 2.2 |
| `.claude/commands/sw-arch.md` | STEP 0 end — append UPDATE MODE DETECTION; STEP 9 — insert before output | 2.0 → 2.1 |

---

## Task 1: sw-srs.md — DOWNSTREAM IMPACT in STEP 12

**Files:**
- Modify: `.claude/commands/sw-srs.md`

The current step 9 of STEP 12 says "Call /sw-sync to synchronise all phase docs" with a generic prompt. Replace it with a targeted DOWNSTREAM IMPACT analysis that tells the tech lead exactly which docs are stale and why.

- [ ] **Step 1: Open the file and find STEP 12 step 9**

The exact text to replace is:
```
9. Call /sw-sync to synchronise all phase docs:
   Output the prompt: "Run /sw-sync now to update all phase documentation."
```

- [ ] **Step 2: Replace step 9 with the DOWNSTREAM IMPACT block**

Replace the text above with:
```
9. Downstream impact analysis:

   Compare current SRS version against the previous version. Use the SRS revision history
   table and git diff (if available) to identify what changed. If this is the first version,
   all entities and stories are "new" — output accordingly.

   Output:

     DOWNSTREAM IMPACT — SRS-v[X.X]
     ─────────────────────────────────────────────────────────────
     New entities identified          : [list entity names, or "none"]
     Modified / removed entities      : [list, or "none"]
     New stories added                : [list Story IDs, or "none"]
     Modified ACs on existing stories : [Story ID — what changed, or "none"]
     New screens implied              : [list from new frontend story ACs, or "none"]
     Removed features                 : [list, or "none"]

     Impact on docs/UI-DESIGN.md:
       ✅ No changes needed
       OR
       ⚠️  [N] screens affected — run: /sw-ui [feature] to update delta only
         • [Screen name] — triggered by: [which story/AC changed]
         • [Screen name] — triggered by: [which story/AC changed]

     Impact on docs/DB-DESIGN.md:
       ✅ No changes needed
       OR
       ⚠️  [N] tables/SPs affected — run: /sw-db [feature] to update delta only
         • [Table or SP name] — triggered by: [which entity/AC changed]

     Impact on docs/ARCH-DESIGN.md:
       ✅ No changes needed
       OR
       ⚠️  [N] sections affected — run: /sw-arch [feature] to update delta only
         • [Section name] — triggered by: [what changed]

     Shortcuts:
       Validate all cross-doc consistency  : /sw-sync validate
       Cascade one feature end-to-end      : /sw-sync [feature name]
     ─────────────────────────────────────────────────────────────
```

- [ ] **Step 3: Bump version header from 4.0 to 4.1 and add changelog row**

Change `Version  : 4.0` to `Version  : 4.1` and add at top of changelog table:
```
| 4.1     | 2026-05-13 | Zenthil | STEP 12 step 9: replace generic /sw-sync prompt with targeted DOWNSTREAM IMPACT analysis (new entities, modified ACs, per-doc stale sections, /sw-ui /sw-db /sw-arch shortcuts) |
```

- [ ] **Step 4: Write commit token and commit**

```powershell
$ts = Get-Date -Format 'yyyyMMddHHmmss'
@{ commit_token = "sw-done-$ts" } | ConvertTo-Json | Set-Content '.claude/session.state' -Encoding utf8
```
```bash
git add .claude/commands/sw-srs.md
git commit -m "feat(sw-srs): v4.1 — replace /sw-sync prompt with targeted DOWNSTREAM IMPACT analysis"
```

---

## Task 2: sw-ui.md — UPDATE MODE DETECTION + DOWNSTREAM IMPACT

**Files:**
- Modify: `.claude/commands/sw-ui.md`

Two insertions: (1) UPDATE MODE DETECTION appended to the end of STEP 0; (2) new section 7.9 DOWNSTREAM IMPACT appended after 7.8.

- [ ] **Step 1: Add UPDATE MODE DETECTION to STEP 0**

Find the exact end of STEP 0:
```
If any ❌ STOP condition is hit, halt immediately and output the stop message. Do not proceed past Step 0.
```

Insert immediately after that line:

```

---

### UPDATE MODE DETECTION

Runs only if no STOP condition was hit above.

Check whether `docs/UI-DESIGN.md` already exists:

  docs/UI-DESIGN.md exists : YES → UPDATE RUN | NO → FRESH RUN

**IF FRESH RUN:** skip this section entirely. Proceed to STEP 1 with all SRS stories in scope.

**IF UPDATE RUN:**

Read `docs/UI-DESIGN.md`. Note: every screen that already exists and its last-updated marker
(look for `[UPDATED — Sprint N]` or `[NEW — Sprint N]` annotations, or the document date).

Compare against current `docs/SRS.md`:

  Delta check — for each story in SRS:
    - Find which screen(s) in UI-DESIGN.md cover this story
    - If NO screen covers it → story is NEW, screen must be designed this run
    - If a screen covers it but the story's ACs changed since the screen was designed → screen is STALE, must be updated
    - If the story's ACs match the screen design → screen is UNCHANGED, skip it

  Stale check — for each screen in UI-DESIGN.md:
    - If the story it covers no longer exists in SRS → screen is REMOVED, flag for tech lead

Output:

  UPDATE RUN DETECTED — docs/UI-DESIGN.md found
  ─────────────────────────────────────────────────────────────
  Screens preserved (unchanged)    : [N] — [list names]
  Screens to ADD this run          : [N] — [list: story IDs driving each new screen]
  Screens to UPDATE this run       : [N] — [list: screen name + what AC/field changed]
  Screens to REMOVE (story gone)   : [N] — [list: screen name + confirm with tech lead]
  ─────────────────────────────────────────────────────────────

Scope for Steps 1–6: design only the ADD + UPDATE screens. Skip preserved screens.

In STEP 7.1 (write docs/UI-DESIGN.md):
  - PATCH the existing file — do NOT regenerate it from scratch
  - Mark updated sections: `[UPDATED — Sprint N — YYYY-MM-DD]`
  - Mark new sections: `[NEW — Sprint N — YYYY-MM-DD]`
  - Mark removed screens: `[REMOVED — YYYY-MM-DD — reason]` (do not delete — keep for audit trail)
  - Preserve all other sections exactly as they are
```

- [ ] **Step 2: Add section 7.9 DOWNSTREAM IMPACT after section 7.8**

Find the exact end of section 7.8:
```
### 7.8 — Output completion summary

  PHASE 1 UI COMPLETE
  Screens      : [N] — [N] PAGE, [N] MODAL, [N] WIZARD, [N] WIDGET
  Components   : [N] — [N] shared, [N] feature-local, [N] pipes/directives
  Routes       : [N] — [N] Auth-guarded, [N] role-guarded, [N] public, [N] lazy-loaded
  State        : NgRx: [N] | Signals: [N] | Service+BS: [N] | Direct: [N]
  Permissions  : [N] roles × [N] screens mapped
  Next         : Run /sw-db to design the database schema
```

Append after the last line of 7.8:

```

### 7.9 — Downstream impact analysis

Analyse what the approved UI design implies for downstream docs. Run this after 7.8 output.

  DOWNSTREAM IMPACT — UI-DESIGN.md
  ─────────────────────────────────────────────────────────────
  Impact on docs/DB-DESIGN.md:
    API contract gaps (UI assumes endpoints not yet in DB-DESIGN.md or SRS):
      ✅ None
      OR
      ⚠️  [N] gaps — run: /sw-db [feature] to cover these
        • [endpoint or data field] — assumed by: [screen name]

    New data fields shown in UI with no corresponding DB column defined:
      ✅ None
      OR
      ⚠️  [list: field name — screen — which table likely owns it]

  Impact on docs/ARCH-DESIGN.md:
    New feature modules implied by new screens (not in ARCH-DESIGN.md):
      ✅ None
      OR
      ⚠️  [N] modules — run: /sw-arch [feature] to add architecture sections
        • [module name] — implied by: [screen name]

    Component boundaries changed from previous design:
      ✅ None
      OR
      ⚠️  [list: what changed and which arch section it affects]

  Shortcuts:
    Validate consistency now  : /sw-sync validate
    Cascade feature changes   : /sw-sync [feature name]
  ─────────────────────────────────────────────────────────────
```

- [ ] **Step 3: Bump version header from 1.3 to 1.4 and add changelog row**

Change `Version  : 1.3` to `Version  : 1.4` and add at top of changelog table:
```
| 1.4     | 2026-05-13 | Zenthil | STEP 0: UPDATE MODE DETECTION — delta analysis (add/update/remove screens, patch vs regenerate); STEP 7.9: DOWNSTREAM IMPACT — DB contract gaps, arch module gaps, /sw-sync shortcuts |
```

- [ ] **Step 4: Write commit token and commit**

```powershell
$ts = Get-Date -Format 'yyyyMMddHHmmss'
@{ commit_token = "sw-done-$ts" } | ConvertTo-Json | Set-Content '.claude/session.state' -Encoding utf8
```
```bash
git add .claude/commands/sw-ui.md
git commit -m "feat(sw-ui): v1.4 — UPDATE MODE DETECTION + DOWNSTREAM IMPACT (delta mode, patch writes)"
```

---

## Task 3: sw-db.md — UPDATE MODE DETECTION + DOWNSTREAM IMPACT

**Files:**
- Modify: `.claude/commands/sw-db.md`

Two insertions: (1) UPDATE MODE DETECTION after the STEP 0 pre-flight checklist; (2) DOWNSTREAM IMPACT inserted in STEP 9 before the final output block.

- [ ] **Step 1: Add UPDATE MODE DETECTION to STEP 0**

Find the exact end of the STEP 0 pre-flight block:
```
  If any item is unchecked: output BLOCKER and stop until resolved.
```

Insert immediately after that line:

```

---

### UPDATE MODE DETECTION

Runs only if no BLOCKER was hit above.

Check whether `docs/DB-DESIGN.md` already exists:

  docs/DB-DESIGN.md exists : YES → UPDATE RUN | NO → FRESH RUN

**IF FRESH RUN:** skip this section. Proceed to STEP 1 with all SRS entities in scope.

**IF UPDATE RUN:**

Read `docs/DB-DESIGN.md` and `ENTITIES.md`. Note: every table that already exists, its columns,
and its SP list.

Compare against current `docs/SRS.md` and `docs/UI-DESIGN.md` (if present):

  Delta check — for each entity in SRS:
    - If table NOT in DB-DESIGN.md → entity is NEW, design this run
    - If table IS in DB-DESIGN.md but entity ACs changed, or UI-DESIGN.md shows new data fields
      for this entity → table is STALE, update columns/SPs this run
    - If table matches current SRS + UI → UNCHANGED, skip

  Stale check — for each table in DB-DESIGN.md:
    - If the entity no longer exists in SRS → flag as STALE for tech lead review
      (do NOT auto-remove — may still be referenced by foreign keys)

Output:

  UPDATE RUN DETECTED — docs/DB-DESIGN.md found
  ─────────────────────────────────────────────────────────────
  Tables preserved (unchanged)    : [N] — [list names]
  Tables to ADD this run          : [N] — [list entity names]
  Tables to UPDATE this run       : [N] — [list: table name + what changed (column/SP)]
  Tables flagged stale            : [N] — [list: table + reason — confirm with tech lead before removing]
  ─────────────────────────────────────────────────────────────

Scope for Steps 1–6: design only ADD + UPDATE tables. Skip preserved tables.

In STEP 9 (write docs/DB-DESIGN.md):
  - PATCH the existing file — append new table sections, update changed sections in-place
  - Never delete existing table definitions without explicit tech lead confirmation
  - Mark new sections: `[NEW — YYYY-MM-DD]`
  - Mark updated sections: `[UPDATED — YYYY-MM-DD — what changed]`
```

- [ ] **Step 2: Add DOWNSTREAM IMPACT to STEP 9**

Find the exact start of the STEP 9 output block. The text to find in sw-db.md is:
```
9. Output:
     PHASE 1 DB COMPLETE
```

Insert immediately before `9. Output:`:

```
8.5. Downstream impact analysis:

   Analyse what the approved DB design implies for docs/ARCH-DESIGN.md.

     DOWNSTREAM IMPACT — DB-DESIGN.md
     ─────────────────────────────────────────────────────────────
     Impact on docs/ARCH-DESIGN.md:
       New tables added (no corresponding repository in ARCH-DESIGN.md):
         ✅ None
         OR
         ⚠️  [N] tables need repository entries — run: /sw-arch [feature] to add
           • [Table name] → needs: I[Entity]Repository interface + [Entity]Repository implementation
           • [Table name] → needs: I[Entity]Repository interface + [Entity]Repository implementation

       New SPs added (not yet referenced in any service in ARCH-DESIGN.md):
         ✅ None
         OR
         ⚠️  [N] SPs need DI/service wiring — run: /sw-arch [feature] to add
           • [Schema].usp[Entity][Action] → needs: ExecuteSpAsync call in [Entity]Repository

       Schema changes that affect EF DbContext configuration:
         ✅ None
         OR
         ⚠️  [list: table + what changed + which IEntityTypeConfiguration<T> file needs updating]

     Shortcuts:
       Validate consistency now  : /sw-sync validate
       Cascade feature changes   : /sw-sync [feature name]
     ─────────────────────────────────────────────────────────────

```

- [ ] **Step 3: Bump version header from 2.1 to 2.2 and add changelog row**

Change `Version  : 2.1` to `Version  : 2.2` and add at top of changelog table:
```
| 2.2     | 2026-05-13 | Zenthil | STEP 0: UPDATE MODE DETECTION — delta analysis (add/update/stale tables, patch writes); STEP 9: DOWNSTREAM IMPACT — repository gaps, SP wiring, DbContext config changes, /sw-sync shortcuts |
```

- [ ] **Step 4: Write commit token and commit**

```powershell
$ts = Get-Date -Format 'yyyyMMddHHmmss'
@{ commit_token = "sw-done-$ts" } | ConvertTo-Json | Set-Content '.claude/session.state' -Encoding utf8
```
```bash
git add .claude/commands/sw-db.md
git commit -m "feat(sw-db): v2.2 — UPDATE MODE DETECTION + DOWNSTREAM IMPACT (delta mode, patch writes)"
```

---

## Task 4: sw-arch.md — UPDATE MODE DETECTION + DOWNSTREAM IMPACT

**Files:**
- Modify: `.claude/commands/sw-arch.md`

Two insertions: (1) UPDATE MODE DETECTION after the STEP 0 prerequisite block; (2) DOWNSTREAM IMPACT inserted in STEP 9 before the final output.

- [ ] **Step 1: Add UPDATE MODE DETECTION to STEP 0**

Find the exact end of STEP 0:
```
  [STOP if any 🔴 — otherwise continue to Step 1]
```

Insert immediately after that line:

```

---

### UPDATE MODE DETECTION

Runs only if no 🔴 prerequisite failed above.

Check whether `docs/ARCH-DESIGN.md` already exists:

  docs/ARCH-DESIGN.md exists : YES → UPDATE RUN | NO → FRESH RUN

**IF FRESH RUN:** skip this section. Proceed to STEP 1 with full solution design in scope.

**IF UPDATE RUN:**

Read `docs/ARCH-DESIGN.md`. Note: every section already defined (project list, folder structure,
DI registrations, middleware pipeline, etc.).

Compare against current `docs/DB-DESIGN.md` and `docs/UI-DESIGN.md`:

  Delta check:
    - New tables in DB-DESIGN.md with no matching repository in ARCH-DESIGN.md → ADD repository section
    - New feature in UI-DESIGN.md with no matching Angular module/feature folder → ADD frontend section
    - New SPs in DB-DESIGN.md not referenced in any service class → ADD service method note
    - New packages in SRS STACK CONFIRMED not yet in the NuGet/npm lists → ADD to Step 2 package tables
    - Unchanged layers (project list, base classes, middleware order, DI skeleton) → SKIP

Output:

  UPDATE RUN DETECTED — docs/ARCH-DESIGN.md found
  ─────────────────────────────────────────────────────────────
  Sections preserved (unchanged)   : [list section names]
  Sections to ADD this run         : [list: what is new and why]
  Sections to UPDATE this run      : [list: section name + what changed]
  ─────────────────────────────────────────────────────────────

Scope for Steps 1–8: only ADD + UPDATE sections. Skip preserved sections.

In STEP 9 (write docs/ARCH-DESIGN.md):
  - PATCH the existing file — append new sections, update changed sections in-place
  - Never remove existing sections without explicit tech lead confirmation
  - Mark new sections: `[NEW — YYYY-MM-DD]`
  - Mark updated sections: `[UPDATED — YYYY-MM-DD — what changed]`
```

- [ ] **Step 2: Add DOWNSTREAM IMPACT to STEP 9**

Find the exact start of the STEP 9 output block. The text to find in sw-arch.md STEP 9 is:
```
9. Output:
     PHASE 2 ARCHITECTURE COMPLETE
```

Insert immediately before `9. Output:`:

```
8.5. Downstream impact analysis:

   Analyse what the approved architecture implies for docs/BREAKDOWN.md and /sw-plan.

     DOWNSTREAM IMPACT — ARCH-DESIGN.md
     ─────────────────────────────────────────────────────────────
     Impact on docs/BREAKDOWN.md:
       New projects added to solution (not yet in BREAKDOWN.md task list):
         ✅ None
         OR
         ⚠️  [N] projects need task rows — run: /sw-plan [feature] to add breakdown tasks
           • [Project name] — new tasks needed: [list layer tasks]

       New base classes/interfaces added (not yet broken down into subtasks):
         ✅ None
         OR
         ⚠️  [list: class name + which story/task should own it]

       New repositories / services added (need subtask rows):
         ✅ None
         OR
         ⚠️  [list: class name + which Task N.N.B / N.N.C it belongs to]

     Impact on /sw-scaffold:
       New config files or solution root files added (global.json, .editorconfig, etc.):
         ✅ None / ⚠️  [list: file + purpose — scaffold must create these]

     Shortcuts:
       Validate consistency now  : /sw-sync validate
       Cascade feature changes   : /sw-sync [feature name]
     ─────────────────────────────────────────────────────────────

```

- [ ] **Step 3: Bump version header from 2.0 to 2.1 and add changelog row**

Change `Version  : 2.0` to `Version  : 2.1` and add at top of changelog table:
```
| 2.1     | 2026-05-13 | Zenthil | STEP 0: UPDATE MODE DETECTION — delta analysis (add/update sections, patch writes); STEP 9: DOWNSTREAM IMPACT — BREAKDOWN.md task gaps, scaffold file gaps, /sw-sync shortcuts |
```

- [ ] **Step 4: Write commit token and commit**

```powershell
$ts = Get-Date -Format 'yyyyMMddHHmmss'
@{ commit_token = "sw-done-$ts" } | ConvertTo-Json | Set-Content '.claude/session.state' -Encoding utf8
```
```bash
git add .claude/commands/sw-arch.md
git commit -m "feat(sw-arch): v2.1 — UPDATE MODE DETECTION + DOWNSTREAM IMPACT (delta mode, patch writes)"
```

---

## Self-review

**Spec coverage:**
- ✅ Option B (delta mode): UPDATE MODE DETECTION in STEP 0 of sw-ui, sw-db, sw-arch — detects fresh vs update, restricts scope to changed items, patches vs regenerates
- ✅ Option A (DOWNSTREAM IMPACT): Added to all 4 commands after approval — specific stale doc list with exact items and /sw-sync shortcuts
- ✅ All 4 files covered
- ✅ Patch-not-overwrite rule stated in all update mode sections
- ✅ Version bumps on all 4 files

**Placeholder scan:** No TBD, no "implement later", no vague instructions — all content is the exact markdown to insert.

**Type consistency:** All sections use the same terminology: "ADD / UPDATE / preserved / stale", same DOWNSTREAM IMPACT table format, same shortcut block across all 4 files.
