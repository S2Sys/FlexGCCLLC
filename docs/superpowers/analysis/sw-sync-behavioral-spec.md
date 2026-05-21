# /sw-sync BEHAVIORAL SPECIFICATION PROPOSAL

Based on analysis of SRS.md (v3.0, FR8.15), sw-sync.md (v1.4), and project memory files.

---

## QUESTION 1: INPUTS TO /sw-sync

### Current SRS Definition
- FR8.15 only says "Cascade SRS changes to all design docs"
- sw-sync.md shows two usage patterns:
  1. `/sw-sync` (no args) → validate mode
  2. `/sw-sync [feature]` (with feature name) → cascade mode

### PROPOSAL

**Mode 1 (Validate):**
- INPUT: No arguments required
- AUTO-DETECTION: Reads `docs/SRS.md` + checks for CONTEXT.md to detect active story (optional)
- BEHAVIOR: Runs 10 cross-doc consistency checks
- NO SRS VERSION CHECK needed — this is a validation-only mode that doesn't mutate docs

**Mode 2 (Cascade):**
- INPUT: `/sw-sync [feature-name]` where [feature-name] is:
  - A story/epic name from the SRS (e.g., "User Authentication", "Dashboard Widget")
  - OR an entity name (e.g., "User", "Transaction")
  - NOT an SRS tag or version — the feature name serves as the search anchor
- AUTO-DETECTION: 
  - Reads `docs/SRS.md` (current HEAD, not a tagged version)
  - Uses git history OR manual inspection to identify what changed for [feature-name]
  - Compares STEP 1 delta against previous version (via git diff, SRS revision history table, or user confirmation)
- SRS VERSION HANDLING:
  - If this is the FIRST cascade after an SRS change, `/sw-sync` reads the current SRS
  - Does NOT check SRS version tags — that's enforced by P19 (/sw-dev-start gate), not /sw-sync
  - REASONING: Cascade is a design-doc synchronization tool, not a version control tool. Version mismatch is caught when a dev tries to START work, not when updating design docs.

### REASONING
- FR11.4 says "every SRS change requires a new git tag before development continues" — but this is a developer hygiene rule (tracked in CONTEXT.md), not an input to /sw-sync
- P19 enforces version mismatch at /sw-dev-start gate time
- /sw-sync should be VERSION-AGNOSTIC — its job is to keep design docs consistent, not police version tags

---

## QUESTION 2: DOCUMENTS /sw-sync CASCADES TO

### Current SRS Evidence
From Phase 0 definition (§6, line 630):
- Phase 0 design docs are: `/sw-srs` → `/sw-ui` → `/sw-db` → `/sw-arch` (all 4 approved)
- These produce: UI-DESIGN.md, DB-DESIGN.md, ARCH-DESIGN.md outputs

### Supporting Documents (read but not modified by /sw-sync)
- BREAKDOWN.md — SRS → Epic → Story → Task mapping (read during validation to check Story ID↔CONTEXT.md)
- DECISIONS.md — Locked design decisions (read to check no contradictions)
- ENTITIES.md — Shared DB registry (both read AND written by cascade mode)
- CONTEXT.md — Per-story checkpoint (read only, not modified)

### PROPOSAL

**Mode 1 (Validate) — reads (does NOT modify):**
1. docs/SRS.md
2. docs/UI-DESIGN.md (if exists)
3. docs/DB-DESIGN.md (if exists)
4. docs/ARCH-DESIGN.md (if exists)
5. ENTITIES.md
6. docs/DECISIONS.md (if exists)
7. docs/BREAKDOWN.md (for story validation checks)
8. CONTEXT.md (optional — only if active story exists)

**Mode 2 (Cascade) — reads from above, writes to:**
1. docs/UI-DESIGN.md (append NEW, patch MODIFIED, flag REMOVED)
2. docs/DB-DESIGN.md (append NEW, patch MODIFIED, flag REMOVED)
3. ENTITIES.md (append NEW rows, update MODIFIED rows, mark REMOVED rows as stale)
4. docs/ARCH-DESIGN.md (append NEW, patch MODIFIED, flag REMOVED)

**NOT written by /sw-sync:**
- docs/SRS.md — read-only (SRS changes are made by /sw-srs, not /sw-sync)
- docs/BREAKDOWN.md — read-only (updated by /sw-plan, which reads /sw-sync output)
- DECISIONS.md — read-only (locked decisions are immutable; new ones are added by /sw-srs in STEP 12)
- CONTEXT.md — read-only (updated by Claude Code at every 10-turn checkpoint)

---

## QUESTION 3: WHAT "CASCADE" MEANS MECHANICALLY

### Current Implementation (sw-sync.md v1.4)

**STEP 1 — SRS Delta Classification:**
- Compares current SRS against previous version (using revision history table or git diff)
- Classifies each change: NEW, MODIFIED, or REMOVED
- Outputs: SRS DELTA matrix with all three categories
- STOP GATE: Requires user confirmation "cascade approved" before proceeding

**STEP 2 — UI Impact (if applicable):**
- For NEW screens: Design new screen, append to UI-DESIGN.md with [NEW — date] marker
- For MODIFIED screens: Edit existing screen section IN-PLACE, mark changes with [UPDATED — date — reason]
- For REMOVED screens: Prepend [REMOVED — date — reason] to existing screen section (do not delete)
- Outputs: UI delta proposal, waits for "UI delta approved", then commits

**STEP 3 — DB Impact (if applicable):**
- For NEW entities: Design table/SPs, append to DB-DESIGN.md and ENTITIES.md with [NEW — date]
- For MODIFIED entities: Edit table section IN-PLACE, mark changes with [UPDATED — date — reason]
  - If column added/removed: Note migration file requirement in DB-DESIGN.md
- For REMOVED entities: Prepend [STALE — date — reason] to table section, flag for tech lead
- Outputs: DB delta proposal, waits for "DB delta approved", then commits

**STEP 4 — Architecture Impact (if applicable):**
- For NEW services/repositories/modules: Design class/DI/folder, append to ARCH-DESIGN.md with [NEW — date]
- For MODIFIED services: Edit service section IN-PLACE, mark with [UPDATED — date — reason]
- For REMOVED services: Prepend [STALE — date] to section, flag for tech lead
- Outputs: Arch delta proposal, waits for "arch delta approved", then commits

**STEP 5 — Auto-validate + Push:**
- Runs Mode 1 Validate automatically on all updated docs
- If CONSISTENT: runs `git push`, outputs CASCADE COMPLETE summary
- If BLOCKED: outputs conflicts, STOPS (does not push)
- If new stories were noted: outputs "Run /sw-plan [feature]" next step

### PROPOSAL — What /sw-sync Does NOT Do

/sw-sync does NOT:
- **Auto-regenerate /sw-ui output** if app type changed → That's handled by /sw-ui UPDATE MODE (v1.5+)
- **Re-run /sw-db** if tables were added/removed → That's handled by /sw-db UPDATE MODE (v2.3+)
- **Auto-validate /sw-arch** for new requirements → /sw-arch UPDATE MODE (v2.1+) handles that
- **Automatically create ADO stories** → /sw-plan (ADO UPDATE MODE) does that after /sw-sync completes
- **Check ENTITIES.md against FR14** → That's checked at /commit time and /sw-dev-start time

### PROPOSAL — How it Interacts with Other Commands

The cascade flow is:
1. **/sw-sync [feature]** → classify delta + cascade to UI/DB/ARCH docs + validate
2. **If delta affects:**
   - UI only → done, design docs in sync
   - DB only → done, design docs in sync
   - Both UI + DB → done, design docs in sync
3. **If NEW stories implied** → /sw-sync outputs "Run /sw-plan [feature]" to create ADO items
4. **If MODIFIED and stories exist in ADO** → /sw-plan ADO UPDATE MODE (auto-detected) patches open stories, creates follow-ups for closed ones

### REASONING FOR THIS DESIGN
- **Separate concerns:** /sw-sync owns design doc consistency, /sw-ui/db/arch own their specific output generation
- **Staged approval:** Each step 1 delta → 2 UI → 3 DB → 4 ARCH requires explicit user "X approved" before writing (prevents blind overwrites)
- **Never auto-delete:** All REMOVED items are flagged, not deleted (preserves audit trail)
- **Patch-in-place for MODIFIED:** Avoids duplication, keeps doc structure stable
- **Commit per step:** Small commits enable easy rollback if one step is wrong
- **v1.4 already implements this** — we just need to document the intended behavior in the SRS

---

## QUESTION 4: OUTPUTS FROM /sw-sync

### Mode 1 (Validate) Output

A SYNC VALIDATION REPORT including:
```
SYNC VALIDATION REPORT
======================
Triggered by: [type — auto/manual/approval gate]
Date: [YYYY-MM-DD]

✅ SRS ↔ UI-DESIGN.md           — consistent
[✅ or ❌ for each of 10 pairs]

Conflicts found  : [N] of [N] pairs checked
Score            : [((N-conflicts) × 10)] / 100
RESULT: ✅ CONSISTENT / 🟡 MINOR CONFLICTS / ❌ BLOCKED

[If conflicts exist, output PENDING DECISIONS matrix with priority + resolution steps]
```

### Mode 2 (Cascade) Output

Three sections:
1. **SRS DELTA** — Classification of NEW/MODIFIED/REMOVED for each category
2. **STAGED DELTAS** — Four proposals (UI, DB, Arch), each awaiting approval
3. **CASCADE COMPLETE** (if all approvals given) — Lists:
   - Docs updated
   - Commit messages
   - Branch pushed
   - Validation score
   - Next steps

### No Separate Output File

sw-sync.md v1.4 does NOT propose creating a separate `docs/SRS-IMPACT-ANALYSIS.md` output file. Instead:
- All impact is captured in the inline STEP proposals
- PENDING DECISIONS matrix is output directly in the chat (structured table)
- Commits serve as the audit trail

---

## QUESTION 5: DOES /sw-sync BLOCK PHASE 1 IF SRS CHANGED?

### Current SRS Evidence
- Phase 0 exit gate (§6, line 630): "All 4 design docs approved"
- Phase 1 entry gate (§6, line 631): "Phase 0 all gates passed"
- P19 (Absolute Prohibition): "NEVER run /sw-dev-start on a story whose SRS version is older than the current SRS tag — flag as SRS VERSION MISMATCH"

### Scenario: SRS changes mid-Phase 1 (after scaffold, during development)

**PROPOSAL: /sw-sync does NOT block Phase 1 directly. Instead:**

1. **If SRS changes during Phase 1 (after /sw-scaffold):**
   - Run `/sw-sync [feature]` to cascade to design docs
   - Run `/sw-sync` (validate mode) to check consistency
   - If CONSISTENT: Phase 1 continues unaffected
   - If BLOCKED: Resolve conflicts before continuing

2. **New stories implied by the change:**
   - Run `/sw-plan [feature]` ADO UPDATE MODE
   - Creates new stories in ADO for the new work
   - Existing Phase 1 stories continue without re-validation

3. **P19 enforcement (version mismatch):**
   - When a dev tries `/sw-dev-start` on a story:
     - If story's SRS version < current SRS tag: BLOCKED with "SRS VERSION MISMATCH"
     - If story's SRS version = current SRS tag: proceed normally
   - This means: SRS tag MUST be created BEFORE /sw-plan runs on the new feature

**REASONING:**
- /sw-sync is not a phase gate — it's a design doc sync tool
- The real block is P19 at /sw-dev-start time (prevents stale stories from being built)
- If SRS changes and tags are updated, new stories referencing the new tag can be created by /sw-plan
- Old stories referencing old tags are protected by P19

### ANSWER TO QUESTION 5
**No**, /sw-sync does not block Phase 1. Instead:
- Phase 0 blocks Phase 1 (all 4 design docs must be approved before /sw-scaffold)
- Once Phase 1 begins, SRS changes are allowed IF:
  - /sw-sync [feature] cascades the changes
  - Validate mode passes (no conflicts)
  - /sw-plan creates new ADO stories for new work
  - New SRS version tag is created BEFORE /sw-dev-start on new stories

---

## QUESTION 6: IS /sw-sync IDEMPOTENT?

### PROPOSAL: Partially idempotent with conditions

**Mode 1 (Validate) is fully idempotent:**
- Running it twice produces identical output
- No side effects (read-only, no writes)
- Safe to run at any time
- Recommended: Run before every phase gate completion

**Mode 2 (Cascade) is NOT idempotent (by design):**
- Running it twice on the same [feature] would duplicate sections
  - First run: appends [NEW — date] sections
  - Second run: appends the same sections again → duplicate content
- MITIGATION: Cascade mode checks in STEP 1 if delta is empty
  - If nothing changed for [feature]: outputs "No SRS changes detected" and stops
  - If changes detected: proceeds (assumes first run)
- RULE: Don't run cascade twice on the same feature without making additional SRS changes

**Cascade is safe to re-run with a different feature:**
- `/sw-sync feature-A` cascades Feature A
- `/sw-sync feature-B` cascades Feature B (independent changes, won't duplicate)

### SRS PROPOSAL TEXT FOR FR8.15

Current: "Cascade SRS changes to all design docs"

Proposed Replacement:
```
| FR8.15 | /sw-sync | Any | Validate cross-doc consistency (10 pairs: SRS↔UI, SRS↔DB, UI↔DB, UI↔Arch, DB↔Arch, DECISIONS, ENTITIES, Features↔Services, CONTEXT↔BREAKDOWN, NFRs↔Architecture) OR cascade SRS changes (NEW/MODIFIED/REMOVED) to UI-DESIGN.md, DB-DESIGN.md, ENTITIES.md, and ARCH-DESIGN.md through staged review-and-approve flow. Outputs PENDING DECISIONS matrix for conflicts. Each cascade step requires explicit approval before writing. Commits applied per-step. Mode 1 (validate) is idempotent; Mode 2 (cascade) is not—do not run twice on same feature without additional SRS changes. |
```

---

## CONTRADICTIONS AND AMBIGUITIES FOUND

### 1. SRS Version Control — Where Is It Checked?
**Contradiction:**
- FR11.4: "every SRS change requires a new git tag before development continues"
- P19: enforces this at /sw-dev-start time
- But: /sw-sync doesn't mention version tags or git tagging

**Resolution:**
- /sw-sync is a DESIGN SYNC tool, not a VERSION CONTROL tool
- Version tagging is a manual step done AFTER /sw-sync completes and BEFORE /sw-plan runs
- New proposal: Add explicit step in cascade mode: "After STEP 5 validate passes, run `git tag SRS-v[N+1]` before /sw-plan"

### 2. "Cascade" Definition Is Asymmetric
**Ambiguity:**
- "Cascade SRS changes to all design docs" — but SRS↔UI is bidirectional in practice
  - SRS defines requirements (top-down)
  - But UI designers sometimes reveal missing SRS details (bottom-up feedback)
- sw-sync.md handles this via /sw-ui UPDATE MODE, not /sw-sync

**Resolution:**
- /sw-sync cascades SRS→UI/DB/Arch (top-down only)
- If UI designers want to PROPOSE changes to SRS, that's a separate flow: /sw-ui proposes → /sw-srs accepts → /sw-sync cascades

### 3. When Does /sw-sync Run Automatically?
**Ambiguity:**
- sw-sync.md v1.4 says "runs automatically after every approval gate"
- But which gate? UI approval? All 4 approved?
- Not clear in the command file

**Resolution for SRS:**
- Mode 1 (Validate) runs automatically after Phase 0 gate (once all 4 design docs approved by /sw-srs, /sw-ui, /sw-db, /sw-arch)
- Mode 2 (Cascade) runs manually by developer when SRS is updated mid-project

### 4. ENTITIES.md — Read or Write?
**Ambiguity:**
- sw-sync.md treats ENTITIES.md as both a reference (Check 7) and a write target
- Clear in cascade mode STEP 3, but not in original FR8.15

**Resolution:**
- ENTITIES.md is written by /sw-sync cascade (new entity rows appended, existing rows updated)
- ENTITIES.md is validated by Mode 1 checks (should mirror DB-DESIGN.md)

### 5. Phase 0 Exit Gate — Is /sw-sync the Gate, or is Validation Separate?
**Ambiguity:**
- Table at line 630 shows Phase 0 gate as "/sw-srs, /sw-ui, /sw-db, /sw-arch"
- Table at line 636 shows Phase 6 gate as "/sw-sync + deploy"
- But Phase 0 says "All 4 design docs approved" — are they approved by the individual commands, or by /sw-sync validation?

**Resolution:**
- Phase 0 APPROVED = all 4 commands produce green output ("UI approved", "DB approved", etc.)
- /sw-sync validation (Mode 1) runs AFTER Phase 0 to confirm consistency
- If /sw-sync validation fails at Phase 0 → go back to individual commands and fix conflicts
- Phase 0 doesn't fully exit until /sw-sync validation PASSES

---

## FINAL SRS ENTRY PROPOSAL

### Current FR8.15 (line 413)
```
| FR8.15 | /sw-sync | Any | Cascade SRS changes to all design docs |
```

### Proposed Replacement (with full behavioral spec)

```
| FR8.15 | /sw-sync | Any | Validate cross-doc consistency across 10 pairs (SRS↔UI, SRS↔DB, SRS↔Arch, UI↔DB, UI↔Arch, DB↔Arch, DECISIONS, ENTITIES, CONTEXT, NFRs) with PENDING DECISIONS matrix for conflicts; OR cascade SRS changes (NEW/MODIFIED/REMOVED classification) to UI-DESIGN.md, DB-DESIGN.md, ENTITIES.md, ARCH-DESIGN.md through staged 4-step review-and-approve flow (STEP 1 delta, STEP 2 UI, STEP 3 DB, STEP 4 Arch, STEP 5 validate+push). Mode 1 (validate) is idempotent and blocks if score <60; Mode 2 (cascade) requires explicit approval after each step before writing; both modes mark all changes with [NEW/UPDATED/STALE — date — reason]. |
```

---

## RECOMMENDATION: NEXT STEPS

1. **Approve this proposal** for the five answers above
2. **Create a new Capability Matrix entry** for /sw-sync in the SRS (extend existing FR8.15 table with detailed capability breakdown)
3. **Add Phase 0 exit gate clarification**: /sw-sync Mode 1 must PASS before Phase 0 can exit
4. **Add version tagging step** to /sw-sync cascade STEP 5: "Run `git tag SRS-v[N+1]` before /sw-plan"
5. **Create US-8.15.1** — Detailed story: "As a Tech Lead, I want /sw-sync Mode 1 to validate all cross-doc pairs and block if conflicts exist, so that design docs stay in sync at every gate"
6. **Create US-8.15.2** — Detailed story: "As a Senior Developer, I want /sw-sync Mode 2 to cascade SRS changes through staged approvals with NEW/MODIFIED/REMOVED classification, so that SRS updates can be safely propagated to design docs mid-project"
