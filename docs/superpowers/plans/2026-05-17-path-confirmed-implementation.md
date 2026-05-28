# PATH CONFIRMED Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a PATH SELECTION step to `/swp-srs` that auto-detects eligible delivery flows from STACK CONFIRMED, requires explicit user confirmation, and locks the chosen flow into a `PATH CONFIRMED` block in `docs/SRS.md`. All six downstream Phase 1–3 commands enforce the locked path via a PATH CHECK pre-flight block.

**Architecture:** `docs/SRS.md` is the single source of truth — `PATH CONFIRMED` block written alongside `STACK CONFIRMED`. Every downstream command reads it in STEP 0. PATH CHECK outputs ✅ / ❌ / ⚠️ (missing) and offers an override escape hatch. No new files, no new commands.

**Tech Stack:** Markdown skill files (`.md`) in `.claude/commands/` — no code. All changes are text insertions and edits to existing skill files.

**Spec:** `docs/superpowers/specs/2026-05-17-path-confirmation-design.md`

---

### Task 1: Three quick-fix corrections

Three wrong-guidance issues found during workflow audit — fix before adding PATH CHECK so downstream references are already correct.

**Files:**
- Modify: `.claude/commands/swp-design.md` — version header mismatch (1.0 vs changelog 1.2)
- Modify: `.claude/commands/swd-next.md` — STEP 8 says `→ /swd-submit` (skips mandatory /swd-review)
- Modify: `.claude/commands/swp-arch.md` — skill chain says `→ /swp-ui + /swp-db` (hardcoded, ignores /swp-design path)

- [ ] **Step 1: Fix swp-design.md version header**

  Current line 15: `Version  : 1.0`
  The internal changelog (lines 20–22) correctly shows the last entry as v1.2 dated 2026-05-16.

  In `.claude/commands/swp-design.md`, change:
  ```
  Version  : 1.0
  ```
  to:
  ```
  Version  : 1.2
  ```

- [ ] **Step 2: Fix swd-next.md STEP 8 story-completion text**

  Current line 776 (inside the `If YES — all subtasks ✅` block):
  ```
      Then run: /swd-submit — it auto-reviews, commits, and checkpoints.
  ```

  `/swd-submit` requires `lead_approval = "approved"` in session.state, which is only set by `/swd-review`. Skipping `/swd-review` causes GATE L to block `/swd-submit`. The text is misleading. Change it to:
  ```
      Then run: /swd-review — it validates ACs and sets lead approval.
      After /swd-review passes: run /swd-submit to commit and checkpoint.
  ```

  The second-to-last block at line 782–783 (story still has subtasks remaining) has the same issue. Current:
  ```
      Submit manual testing proof first: /swd-manual-testing
      Then run: /swd-submit to commit this subtask.
  ```
  Change to:
  ```
      Submit manual testing proof first: /swd-manual-testing
      Then run: /swd-review to validate ACs, then /swd-submit to commit this subtask.
  ```

- [ ] **Step 3: Fix swp-arch.md skill chain line**

  Current line 41:
  ```
  **Compatible skill chain:**
    /swp-srs → /swp-arch (Stage 1: design → Stage 2: scaffold) → /swp-ui + /swp-db → /swp-plan → /swd-start
  ```

  Change to:
  ```
  **Compatible skill chain:**
    /swp-srs → /swp-arch (Stage 1: design → Stage 2: scaffold) → /swp-design (or /swp-ui + /swp-db per PATH CONFIRMED) → /swp-plan → /swd-start
  ```

- [ ] **Step 4: Commit**

  ```
  git add .claude/commands/swp-design.md .claude/commands/swd-next.md .claude/commands/swp-arch.md
  git commit -m "fix(toolkit): correct version header, swd-next STEP 8 guidance, swp-arch skill chain"
  ```

---

### Task 2: Add PATH CHECK to swp-arch.md

PATH CHECK goes at the TOP of STEP 0 — before the stack detection table and prerequisite check.

**Files:**
- Modify: `.claude/commands/swp-arch.md` — insert PATH CHECK block, bump version to 3.3

**PATH CHECK block to insert** (place immediately after the `## STEP 0 — Stack detection & prerequisite validation` heading, before `### Stack type detection`):

```markdown
### PATH CHECK — enforce locked delivery flow

Read docs/SRS.md PATH CONFIRMED block.

IF PATH CONFIRMED block is missing:
  ⚠️ WARNING — PATH CONFIRMED not found. Run /swp-srs to lock a delivery flow.
  Proceeding without path enforcement.

IF PATH CONFIRMED found:
  Extract: Flow name, Phase 1 command, Phase 2 command(s), Phase 3 command.
  Read BREAKDOWN.md to determine which phase is next (first phase not yet marked [x]).
  Check if this command (/swp-arch) matches the correct next phase command.

  IF match:
    ✅ Correct next step for [Flow Name].
    After this command completes: [next command in PATH CONFIRMED sequence]

  IF no match:
    ❌ PATH MISMATCH — [Flow Name] expects [correct command] next, not /swp-arch.
    Your locked sequence: [Phase 1 command] → [Phase 2 command] → [Phase 3 command] → dev
    Run [correct command] first, then return here.
    To override: type "override path — I know what I'm doing"

```

- [ ] **Step 1: Read swp-arch.md lines 50–55 to confirm insertion point**

  The heading `## STEP 0 — Stack detection & prerequisite validation` is around line 50.
  The subheading `### Stack type detection (read from STACK CONFIRMED)` follows on line 53.
  PATH CHECK block inserts between these two (after the H2, before the H3).

- [ ] **Step 2: Insert PATH CHECK block into swp-arch.md**

  Insert the PATH CHECK markdown block shown above between line ~52 (the `---` after the preamble) and `### Stack type detection`.

- [ ] **Step 3: Bump version header and add changelog entry**

  In swp-arch.md, change:
  ```
  Version  : 3.2
  Updated  : 2026-05-14
  ```
  to:
  ```
  Version  : 3.3
  Updated  : 2026-05-17
  ```

  Add a new row at the TOP of the changelog table:
  ```
  | 3.3     | 2026-05-17 | Zenthil | Added PATH CHECK to STEP 0 — enforce PATH CONFIRMED delivery flow |
  ```

- [ ] **Step 4: Commit**

  ```
  git add .claude/commands/swp-arch.md
  git commit -m "feat(swp-arch): add PATH CHECK to STEP 0 — enforce PATH CONFIRMED flow"
  ```

---

### Task 3: Add PATH CHECK to swp-design.md

PATH CHECK goes at the TOP of `## STEP 0 — Pre-flight checks`, before the existing PRE-FLIGHT table.

**Files:**
- Modify: `.claude/commands/swp-design.md` — insert PATH CHECK block, bump version to 1.3

**PATH CHECK block to insert** (place immediately after `## STEP 0 — Pre-flight checks` heading, before the PRE-FLIGHT table):

```markdown
### PATH CHECK — enforce locked delivery flow

Read docs/SRS.md PATH CONFIRMED block.

IF PATH CONFIRMED block is missing:
  ⚠️ WARNING — PATH CONFIRMED not found. Run /swp-srs to lock a delivery flow.
  Proceeding without path enforcement.

IF PATH CONFIRMED found:
  Extract: Flow name, Phase 1 command, Phase 2 command(s), Phase 3 command.
  Read BREAKDOWN.md to determine which phase is next (first phase not yet marked [x]).
  Check if this command (/swp-design) matches the correct next phase command.

  IF match:
    ✅ Correct next step for [Flow Name].
    After this command completes: [next command in PATH CONFIRMED sequence]

  IF no match:
    ❌ PATH MISMATCH — [Flow Name] expects [correct command] next, not /swp-design.
    Your locked sequence: [Phase 1 command] → [Phase 2 command] → [Phase 3 command] → dev
    Run [correct command] first, then return here.
    To override: type "override path — I know what I'm doing"

```

- [ ] **Step 1: Read swp-design.md lines 37–50 to confirm insertion point**

  The heading `## STEP 0 — Pre-flight checks` is at line 37.
  The PRE-FLIGHT table starts at line 42 with `  PRE-FLIGHT:`.
  Insert PATH CHECK block between line 38 (blank after heading) and line 40 (`Before producing any output...`).

- [ ] **Step 2: Insert PATH CHECK block into swp-design.md**

- [ ] **Step 3: Bump version header and add changelog entry**

  Change:
  ```
  Version  : 1.2
  Updated  : 2026-05-15
  ```
  to:
  ```
  Version  : 1.3
  Updated  : 2026-05-17
  ```

  Add changelog row:
  ```
  | 1.3     | 2026-05-17 | Zenthil | Added PATH CHECK to STEP 0 — enforce PATH CONFIRMED delivery flow |
  ```

- [ ] **Step 4: Commit**

  ```
  git add .claude/commands/swp-design.md
  git commit -m "feat(swp-design): add PATH CHECK to STEP 0 — enforce PATH CONFIRMED flow"
  ```

---

### Task 4: Add PATH CHECK to swp-ui.md

PATH CHECK goes at the TOP of `## STEP 0 — Pre-flight checks`, before the existing PRE-FLIGHT table.

**Files:**
- Modify: `.claude/commands/swp-ui.md` — insert PATH CHECK block, bump version to 2.4

**PATH CHECK block to insert** (place immediately after `## STEP 0 — Pre-flight checks` heading):

```markdown
### PATH CHECK — enforce locked delivery flow

Read docs/SRS.md PATH CONFIRMED block.

IF PATH CONFIRMED block is missing:
  ⚠️ WARNING — PATH CONFIRMED not found. Run /swp-srs to lock a delivery flow.
  Proceeding without path enforcement.

IF PATH CONFIRMED found:
  Extract: Flow name, Phase 1 command, Phase 2 command(s), Phase 3 command.
  Read BREAKDOWN.md to determine which phase is next (first phase not yet marked [x]).
  Check if this command (/swp-ui) matches the correct next phase command.

  IF match:
    ✅ Correct next step for [Flow Name].
    After this command completes: [next command in PATH CONFIRMED sequence]

  IF no match:
    ❌ PATH MISMATCH — [Flow Name] expects [correct command] next, not /swp-ui.
    Your locked sequence: [Phase 1 command] → [Phase 2 command] → [Phase 3 command] → dev
    Run [correct command] first, then return here.
    To override: type "override path — I know what I'm doing"

```

- [ ] **Step 1: Read swp-ui.md lines 43–52 to confirm insertion point**

  `## STEP 0 — Pre-flight checks` is around line 43.
  The PRE-FLIGHT block starts ~line 47 with `  PRE-FLIGHT:`.
  Insert PATH CHECK between the heading and `Before producing any output, verify:`.

- [ ] **Step 2: Insert PATH CHECK block into swp-ui.md**

- [ ] **Step 3: Bump version header and add changelog entry**

  Change:
  ```
  Version  : 2.3
  Updated  : 2026-05-16
  ```
  to:
  ```
  Version  : 2.4
  Updated  : 2026-05-17
  ```

  Add changelog row:
  ```
  | 2.4     | 2026-05-17 | Zenthil | Added PATH CHECK to STEP 0 — enforce PATH CONFIRMED delivery flow |
  ```

- [ ] **Step 4: Commit**

  ```
  git add .claude/commands/swp-ui.md
  git commit -m "feat(swp-ui): add PATH CHECK to STEP 0 — enforce PATH CONFIRMED flow"
  ```

---

### Task 5: Add PATH CHECK to swp-db.md

PATH CHECK goes immediately before the `## DB OBJECT NAMING CONVENTIONS` section — after the preamble / skill chain line, as a new pre-flight block.

**Files:**
- Modify: `.claude/commands/swp-db.md` — insert PATH CHECK block, bump version to 2.6

The current swp-db.md has no explicit STEP 0 heading. Insert a `## STEP 0 — PATH CHECK` section between the `---` separator (line ~41) and `## DB OBJECT NAMING CONVENTIONS`.

**Section to insert:**

```markdown
## STEP 0 — PATH CHECK — enforce locked delivery flow

Read docs/SRS.md PATH CONFIRMED block.

IF PATH CONFIRMED block is missing:
  ⚠️ WARNING — PATH CONFIRMED not found. Run /swp-srs to lock a delivery flow.
  Proceeding without path enforcement.

IF PATH CONFIRMED found:
  Extract: Flow name, Phase 1 command, Phase 2 command(s), Phase 3 command.
  Read BREAKDOWN.md to determine which phase is next (first phase not yet marked [x]).
  Check if this command (/swp-db) matches the correct next phase command.

  IF match:
    ✅ Correct next step for [Flow Name].
    After this command completes: [next command in PATH CONFIRMED sequence]

  IF no match:
    ❌ PATH MISMATCH — [Flow Name] expects [correct command] next, not /swp-db.
    Your locked sequence: [Phase 1 command] → [Phase 2 command] → [Phase 3 command] → dev
    Run [correct command] first, then return here.
    To override: type "override path — I know what I'm doing"

---

```

- [ ] **Step 1: Read swp-db.md lines 38–50 to confirm insertion point**

  The `---` separator after the skill chain line is around line 41.
  `## DB OBJECT NAMING CONVENTIONS` follows.
  Insert the STEP 0 section between these.

- [ ] **Step 2: Insert STEP 0 PATH CHECK section into swp-db.md**

- [ ] **Step 3: Bump version header and add changelog entry**

  Change:
  ```
  Version  : 2.5
  Updated  : 2026-05-13
  ```
  to:
  ```
  Version  : 2.6
  Updated  : 2026-05-17
  ```

  Add changelog row:
  ```
  | 2.6     | 2026-05-17 | Zenthil | Added STEP 0 PATH CHECK — enforce PATH CONFIRMED delivery flow |
  ```

- [ ] **Step 4: Commit**

  ```
  git add .claude/commands/swp-db.md
  git commit -m "feat(swp-db): add STEP 0 PATH CHECK — enforce PATH CONFIRMED flow"
  ```

---

### Task 6: Add PATH CHECK to swp-plan.md (pre-flight check #4)

swp-plan.md has 3 numbered pre-flight checks. PATH CHECK becomes check #4, inserted between check #3 and the `READ` section.

**Files:**
- Modify: `.claude/commands/swp-plan.md` — insert pre-flight #4, bump version to 1.8

**Pre-flight check #4 block to insert** (after the `If all four phases are [x]: output...` line, before `READ (after pre-flight passes):`):

```markdown
4. PATH CHECK — read docs/SRS.md PATH CONFIRMED block:
     IF PATH CONFIRMED block is missing:
       ⚠️ WARNING — PATH CONFIRMED not found. Run /swp-srs to lock a delivery flow.
       Proceeding without path enforcement.
     IF PATH CONFIRMED found:
       Extract: Flow name, Phase 1, Phase 2, Phase 3 commands.
       Verify all PATH CONFIRMED Phase 2 commands are now [x] in BREAKDOWN.md before proceeding.
       Output: "PATH CONFIRMED: [Flow Name] — /swp-plan is Phase 3 (correct next step ✅)"
       After this command: /swd-start → development phase begins.

```

- [ ] **Step 1: Read swp-plan.md lines 43–52 to confirm insertion point**

  Line 45: `     If all four phases are [x]: output "All design phases approved — proceeding to breakdown." and continue.`
  Line 47: `READ (after pre-flight passes):`
  Insert check #4 between these two lines (after line 45, before line 47).

- [ ] **Step 2: Insert pre-flight check #4 into swp-plan.md**

- [ ] **Step 3: Bump version header and add changelog entry**

  Read the current version header (around lines 9–11) to find the current version (1.7).

  Change:
  ```
  Version  : 1.7
  Updated  : 2026-05-15
  ```
  to:
  ```
  Version  : 1.8
  Updated  : 2026-05-17
  ```

  Add changelog row:
  ```
  | 1.8     | 2026-05-17 | Zenthil | Added pre-flight check #4: PATH CHECK — enforce PATH CONFIRMED delivery flow |
  ```

- [ ] **Step 4: Commit**

  ```
  git add .claude/commands/swp-plan.md
  git commit -m "feat(swp-plan): add PATH CHECK as pre-flight #4 — enforce PATH CONFIRMED flow"
  ```

---

### Task 7: Update swp-scaffold.md (PATH CHECK + STEP 14 fixes)

Two changes: (a) add PATH CHECK at end of STEP 0, (b) replace all hardcoded `/swp-ui` references in STEP 14 with PATH CONFIRMED-aware text.

**Files:**
- Modify: `.claude/commands/swp-scaffold.md` — PATH CHECK + STEP 14 fixes, bump version to 1.5

#### Part A — PATH CHECK in STEP 0

Add at the END of STEP 0 (after the "STACK CONFIRMED missing" hard-stop line, before the `---` separator at line 54):

```markdown

PATH CHECK — enforce locked delivery flow:
  Read docs/SRS.md PATH CONFIRMED block.

  IF PATH CONFIRMED block is missing:
    ⚠️ WARNING — PATH CONFIRMED not found. Run /swp-srs to lock a delivery flow.
    Proceeding without path enforcement.

  IF PATH CONFIRMED found:
    Extract: Flow name, Phase 1 command, Phase 2 command(s), Phase 3 command.
    /swp-scaffold is Stage 2 of Phase 1 — it runs as part of /swp-arch.
    After scaffold completes (§1B approved): next step is [Phase 2 command from PATH CONFIRMED].
    Output: "PATH CONFIRMED: [Flow Name] — scaffold completes Phase 1. Next: [Phase 2 command]"

```

#### Part B — Fix STEP 14 hardcoded /swp-ui references

Current text (around lines 1081–1098 and line 1158) hardcodes `/swp-ui` as the next step after scaffold. Replace each occurrence with PATH CONFIRMED-aware text:

**Change 1** (line ~1081, Go signal line):
```
  🟢 GO        90–100  — Scaffold complete. Proceed to /swp-ui.
```
→
```
  🟢 GO        90–100  — Scaffold complete. Proceed to [Phase 2 command from PATH CONFIRMED].
```

**Change 2** (line ~1089, PENDING DECISIONS header):
```
  PENDING DECISIONS — resolve before proceeding to /swp-ui
```
→
```
  PENDING DECISIONS — resolve before proceeding to Phase 2 ([Phase 2 command from PATH CONFIRMED])
```

**Change 3** (line ~1097, stop instruction):
```
  [STOP — wait for tech lead to confirm all 🔴 items resolved before /swp-ui]
```
→
```
  [STOP — wait for tech lead to confirm all 🔴 items resolved before Phase 2]
```

**Change 4** (line ~1158, Next instruction in scaffold summary output):
```
  Next        : Run /swp-plan to create Epic→Story→Task hierarchy in ADO
```
→
```
  Next        : Run [Phase 2 command from PATH CONFIRMED] — [Phase 2 command for this flow]
                (Read PATH CONFIRMED block from docs/SRS.md to confirm which command)
```

- [ ] **Step 1: Read swp-scaffold.md lines 50–55 to confirm Part A insertion point**

- [ ] **Step 2: Insert PATH CHECK block at end of STEP 0 in swp-scaffold.md (Part A)**

- [ ] **Step 3: Read swp-scaffold.md lines 1078–1100 to confirm Part B change locations**

- [ ] **Step 4: Apply Part B — four text replacements in STEP 14**

  Use exact string replacement for each of the 4 changes listed above.

- [ ] **Step 5: Read swp-scaffold.md line ~1155–1162 to confirm scaffold summary output**

- [ ] **Step 6: Apply Change 4 — fix scaffold summary Next line**

- [ ] **Step 7: Bump version header and add changelog entry**

  Change:
  ```
  Version  : 1.4
  Updated  : 2026-05-14
  ```
  to:
  ```
  Version  : 1.5
  Updated  : 2026-05-17
  ```

  Add changelog row:
  ```
  | 1.5     | 2026-05-17 | Zenthil | Added PATH CHECK to STEP 0; replaced hardcoded /swp-ui in STEP 14 with PATH CONFIRMED-aware guidance |
  ```

- [ ] **Step 8: Commit**

  ```
  git add .claude/commands/swp-scaffold.md
  git commit -m "feat(swp-scaffold): add PATH CHECK + fix STEP 14 to use PATH CONFIRMED next step"
  ```

---

### Task 8: Add PATH SELECTION step to swp-srs.md

This is the primary feature: a new STEP 13 appended to `/swp-srs` that runs after "SRS approved" (after STEP 12 completes). The file currently ends at line 1292.

**Files:**
- Modify: `.claude/commands/swp-srs.md` — append STEP 13, bump version to 5.3

**STEP 13 block to append** (verbatim, at end of file after line 1292):

```markdown

---

## STEP 13 — PATH SELECTION — Lock delivery flow

Runs automatically after STEP 12 ("SRS approved") is complete and STACK CONFIRMED is finalised.

### Detection — read STACK CONFIRMED

Read the STACK CONFIRMED block from docs/SRS.md. Extract:

```
has_backend  = Backend ≠ None AND Backend ≠ External AND Backend does not contain "BaaS" (Firebase/Supabase/Appwrite)
has_frontend = Frontend ≠ None
has_db       = Database ≠ None AND Database ≠ N/A
has_mobile   = Mobile ≠ None AND Mobile ≠ N/A
is_serverless= Backend contains "Lambda" OR "Azure Functions" OR "Cloud Functions"
is_microsvcs = Backend field contains "+" OR "," (e.g. ".NET + Node.js gateway")
```

Eligible stack type:
```
Full Stack        : has_backend AND has_frontend AND has_db AND NOT has_mobile AND NOT is_serverless AND NOT is_microsvcs
API Only          : has_backend AND has_db AND NOT has_frontend AND NOT has_mobile AND NOT is_serverless AND NOT is_microsvcs
Frontend Only     : has_frontend AND NOT has_backend
Mobile + Backend  : has_mobile AND has_backend AND has_db
Mobile Only BaaS  : has_mobile AND NOT has_backend (or Backend = BaaS)
Serverless        : is_serverless (evaluated before Full Stack / API Only)
Microservices     : is_microsvcs (evaluated before Full Stack / API Only)
```

Check if PATH CONFIRMED block already exists in docs/SRS.md:
  IF found: output
    "Path already locked as [Flow Name] — keep it (press Enter) or type a number to change."
  IF not found: proceed to show full menu below.

### Show PATH SELECTION menu (filtered by detected stack type)

Show ONLY the flows for the detected stack type. Do not show flows from other stack types.

```
══════════════════════════════════════════════════════════════════
PATH SELECTION — Choose your delivery flow
══════════════════════════════════════════════════════════════════
Auto-detected from STACK CONFIRMED:
  Backend  : [value from STACK CONFIRMED]
  Frontend : [value from STACK CONFIRMED]
  Database : [value from STACK CONFIRMED]
  Mobile   : [value from STACK CONFIRMED — or N/A]

Eligible flows for your stack ([Stack Type label]):
──────────────────────────────────────────────────────────────────
[Show rows from the catalogue below that match the detected stack type]
──────────────────────────────────────────────────────────────────
Type a number to select your flow.
Type "explain [N]" for more detail on any flow.
The ⭐ flow is recommended for your stack — but you choose.
══════════════════════════════════════════════════════════════════
```

#### Flow catalogue — output only the rows matching detected stack type

**Stack Type 1 — Full Stack (Backend + Frontend + DB)**
*Shown when: has_backend AND has_frontend AND has_db AND NOT has_mobile*

```
  1  Architecture First — Full Stack ⭐
     Command sequence: /swp-arch → /swp-design → /swp-plan → dev
     Why this is powerful:
     Foundation-first. Architecture locks layers and contracts before a single screen is drawn.
     UI and DB reviewed in one gate — no field/column mismatch.
     Best for enterprise, multi-tenant, regulated products.

  2  Architecture First — Separate Design
     Command sequence: /swp-arch → /swp-ui → /swp-db → /swp-plan → dev
     Why this is powerful:
     Same foundation, but UI and DB have separate approval gates.
     Useful when the product team owns UI and the DBA owns DB schema independently.

  3  Frontend First
     Command sequence: /swp-ui → /swp-db → /swp-arch → /swp-plan → dev
     Why this is powerful:
     Screens reveal missing requirements before any code exists. Wireframes surface edge cases,
     role permissions, and data needs early. Architecture wraps around validated UX.
     Best for B2C, startups, user-research-heavy teams.

  4  DB First
     Command sequence: /swp-db → /swp-arch → /swp-ui → /swp-plan → dev
     Why this is powerful:
     Schema outlasts every other decision. Entity model and SP contracts locked first;
     architecture and UI reflect data reality.
     Best for ERP, reporting, analytics.

  5  Design System First
     Command sequence: /swp-design → /swp-arch → /swp-plan → dev
     Why this is powerful:
     UI and DB co-designed before architecture. Every screen field maps to a column before
     a single service is planned. Best for CRUD-heavy enterprise dashboards.
```

**Stack Type 2 — Backend + DB Only (no frontend)**
*Shown when: has_backend AND has_db AND NOT has_frontend AND NOT has_mobile*

```
  1  Arch First — API ⭐
     Command sequence: /swp-arch → /swp-db → /swp-plan → dev
     Why this is powerful:
     API contract is the product. Architecture locks layer structure, schema and SP contracts follow.
     Zero UI overhead. Best for headless APIs, integration platforms, microservices.

  2  DB First — API
     Command sequence: /swp-db → /swp-arch → /swp-plan → dev
     Why this is powerful:
     Data contract is primary. Schema and indexes locked before architecture.
     API layer built to serve what the schema defines.
     Best for data platforms, event stores, reporting APIs.
```

**Stack Type 3 — Frontend Only (SPA / BaaS / existing API)**
*Shown when: has_frontend AND NOT has_backend*

```
  1  UI First — Frontend Only ⭐
     Command sequence: /swp-ui → /swp-plan → dev
     Why this is powerful:
     No architecture needed. Jump straight to screen design, approve all screens, then break into
     stories. Fastest path for a frontend against an existing or external API.
```

**Stack Type 4 — Mobile + Backend**
*Shown when: has_mobile AND has_backend AND has_db*

```
  1  Arch First — Mobile ⭐
     Command sequence: /swp-arch → /swp-design → /swp-plan → dev
     Why this is powerful:
     Backend architecture locked first, mobile UI designed against a known API contract.
     Prevents building UI against assumptions the backend never agreed to.
     Best when backend complexity is high.

  2  Mobile First
     Command sequence: /swp-ui → /swp-db → /swp-arch → /swp-plan → dev
     Why this is powerful:
     Mobile UX constraints — small screen, touch targets, offline states — designed first.
     Architecture shaped to serve those constraints.
     Best for consumer mobile apps.
```

**Stack Type 5 — Mobile Only (BaaS)**
*Shown when: has_mobile AND NOT has_backend (or Backend = BaaS/Firebase/Supabase/Appwrite)*

```
  1  Mobile UI First — BaaS ⭐
     Command sequence: /swp-ui → /swp-plan → dev
     Why this is powerful:
     No custom architecture or DB. Design every screen first, then break into stories.
     Fastest path for mobile-only products using Firebase, Supabase, or Appwrite.
```

**Stack Type 6 — Serverless / FaaS**
*Shown when: Backend contains "Lambda" OR "Azure Functions" OR "Cloud Functions"*

```
  1  Arch First — Serverless ⭐
     Command sequence: /swp-arch → /swp-db → /swp-plan → dev
     Why this is powerful:
     Function boundaries, triggers, and state stores defined before schema.
     No traditional controller layer. Best for event-sourced systems, webhook processors, async pipelines.

  2  Serverless + Frontend
     Command sequence: /swp-arch → /swp-design → /swp-plan → dev
     Why this is powerful:
     Serverless backend + web frontend. Architecture defines function-to-route mapping,
     then combined UI + DB design follows. Best for JAMstack, edge-rendered, static-site + API products.
```

**Stack Type 7 — Microservices (multiple backends)**
*Shown when: Backend field contains "+" or "," (e.g. ".NET + Node.js gateway")*

```
  1  Arch First — Multi-service ⭐
     Command sequence: /swp-arch → /swp-db (per service) → /swp-plan → dev
     Why this is powerful:
     API gateway and service boundaries defined at architecture phase.
     Each service runs its own DB design pass. Plan creates Epic-per-service ADO structure.
     Best for DDD where bounded context isolation is mandatory.

  2  Contract First — Multi-service
     Command sequence: /swp-db → /swp-arch → /swp-plan → dev
     Why this is powerful:
     Inter-service contracts and event schemas agreed first. Architecture enforces those contracts.
     Prevents the most expensive microservice mistake: contract incompatibility discovered after deployment.
```

### Handle "explain [N]" command

IF developer types "explain [N]":
  Expand the Why section for that flow to 4–6 sentences covering:
  - What the flow prevents
  - Who benefits most
  - What the typical project looks like
  - Any tradeoffs vs. the ⭐ recommended flow
  Then re-show the full menu and wait for a number selection.

### After developer selects a number — show confirmation gate

```
PATH SELECTED: [N] — [Flow Name]
Command sequence:
  Phase 1 : [command — or "N/A" for Frontend Only / Mobile Only / Design System First]
  Phase 2 : [command(s)]
  Phase 3 : /swp-plan
  Phase 4 : /swd-start → /swd-next → /swd-review → /swd-submit

This will be locked into docs/SRS.md as PATH CONFIRMED.
Changing it later requires re-running /swp-srs.

Type "path confirmed" to lock this in, or a different number to change.
```

### After "path confirmed" — write PATH CONFIRMED block to SRS.md

Append immediately after the STACK CONFIRMED block in docs/SRS.md:

```
PATH CONFIRMED:
  Flow     : [Flow name — e.g. "Architecture First — Full Stack"]
  Phase 1  : [command — or "N/A" if flow starts with Phase 2]
  Phase 2  : [command(s) — comma-separated if multiple sequential commands]
  Phase 3  : /swp-plan
  Phase 4  : /swd-start → /swd-next → /swd-review → /swd-submit
  Locked   : [YYYY-MM-DD using today's date]
  Locked by: /swp-srs v5.3
```

Then commit:
```
git add docs/SRS.md
git commit -m "docs(phase-0): PATH CONFIRMED — [Flow Name] locked"
```

Then output:
```
PATH CONFIRMED locked: [Flow Name]
Sequence: [Phase 1] → [Phase 2] → /swp-plan → dev
Run [Phase 1 command] next to begin Phase 1.
```

Update the PHASE 0 COMPLETE output (STEP 12, item 10) by appending:
```
  Path         : [Flow Name] — PATH CONFIRMED locked
  Phase 1 next : [Phase 1 command]
```

```

- [ ] **Step 1: Read the last 10 lines of swp-srs.md to confirm the append location**

  Expected: file ends at the STEP 12 prompting block (around line 1292). Confirm there is nothing after.

- [ ] **Step 2: Append STEP 13 block to swp-srs.md**

  Append the full STEP 13 block shown above to the END of the file.

- [ ] **Step 3: Bump version header and add changelog entry**

  In swp-srs.md, find and change:
  ```
  version: 5.2
  ```
  to:
  ```
  version: 5.3
  ```

  Add changelog row at the top of the version table:
  ```
  | 5.3     | 2026-05-17 | Zenthil | STEP 13: PATH SELECTION — auto-detect eligible flows, menu, confirmation, PATH CONFIRMED block written to SRS.md, 15 flows across 7 stack types |
  ```

- [ ] **Step 4: After writing PATH CONFIRMED — append flow phases to BREAKDOWN.md**

  Based on the locked flow, append the correct phase rows to `docs/BREAKDOWN.md` immediately
  after the Phase 0 row. Also update the `Flow:` header line. Use this lookup:

  **Flow 1A — Architecture First Full Stack:**
  ```
  ## Phase 1A — Architecture Design   [ ] pending  (command: /swp-arch)
  ## Phase 1B — Scaffold              [ ] pending  (command: /swp-arch Stage 2)
  ## Phase 2  — UI/UX + DB Design     [ ] pending  (command: /swp-design)
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 1A + 1B + 2 complete)
  ```
  **Flow 1B — Architecture First Separate Design:**
  ```
  ## Phase 1A — Architecture Design   [ ] pending  (command: /swp-arch)
  ## Phase 1B — Scaffold              [ ] pending  (command: /swp-arch Stage 2)
  ## Phase 2A — UI/UX Design          [ ] pending  (command: /swp-ui)
  ## Phase 2B — DB Design             [ ] pending  (command: /swp-db)
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 1A + 1B + 2A + 2B complete)
  ```
  **Flow 1C — Frontend First:**
  ```
  ## Phase 2A — UI/UX Design          [ ] pending  (command: /swp-ui)     ← step 1
  ## Phase 2B — DB Design             [ ] pending  (command: /swp-db)     ← step 2
  ## Phase 1A — Architecture Design   [ ] pending  (command: /swp-arch)   ← step 3
  ## Phase 1B — Scaffold              [ ] pending  (command: /swp-arch Stage 2) ← step 4
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 2A + 2B + 1A + 1B complete)
  ```
  **Flow 1D — DB First:**
  ```
  ## Phase 2B — DB Design             [ ] pending  (command: /swp-db)     ← step 1
  ## Phase 1A — Architecture Design   [ ] pending  (command: /swp-arch)   ← step 2
  ## Phase 1B — Scaffold              [ ] pending  (command: /swp-arch Stage 2) ← step 3
  ## Phase 2A — UI/UX Design          [ ] pending  (command: /swp-ui)     ← step 4
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 2B + 1A + 1B + 2A complete)
  ```
  **Flow 1E — Design System First:**
  ```
  ## Phase 2  — UI/UX + DB Design     [ ] pending  (command: /swp-design) ← step 1
  ## Phase 1A — Architecture Design   [ ] pending  (command: /swp-arch)   ← step 2
  ## Phase 1B — Scaffold              [ ] pending  (command: /swp-arch Stage 2) ← step 3
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 2 + 1A + 1B complete)
  ```
  **Flow 2A — Arch First API:**
  ```
  ## Phase 1A — Architecture Design   [ ] pending  (command: /swp-arch)
  ## Phase 1B — Scaffold              [ ] pending  (command: /swp-arch Stage 2)
  ## Phase 2B — DB Design             [ ] pending  (command: /swp-db)
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 1A + 1B + 2B complete)
  ```
  **Flow 2B — DB First API:**
  ```
  ## Phase 2B — DB Design             [ ] pending  (command: /swp-db)     ← step 1
  ## Phase 1A — Architecture Design   [ ] pending  (command: /swp-arch)   ← step 2
  ## Phase 1B — Scaffold              [ ] pending  (command: /swp-arch Stage 2) ← step 3
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 2B + 1A + 1B complete)
  ```
  **Flow 3A — UI First Frontend Only:**
  ```
  ## Phase 2A — UI/UX Design          [ ] pending  (command: /swp-ui)
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 2A complete)
  ```
  **Flow 4A — Arch First Mobile:**
  ```
  ## Phase 1A — Architecture Design   [ ] pending  (command: /swp-arch)
  ## Phase 1B — Scaffold              [ ] pending  (command: /swp-arch Stage 2)
  ## Phase 2  — UI/UX + DB Design     [ ] pending  (command: /swp-design)
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 1A + 1B + 2 complete)
  ```
  **Flow 4B — Mobile First:**
  ```
  ## Phase 2A — UI/UX Design          [ ] pending  (command: /swp-ui)     ← step 1
  ## Phase 2B — DB Design             [ ] pending  (command: /swp-db)     ← step 2
  ## Phase 1A — Architecture Design   [ ] pending  (command: /swp-arch)   ← step 3
  ## Phase 1B — Scaffold              [ ] pending  (command: /swp-arch Stage 2) ← step 4
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 2A + 2B + 1A + 1B complete)
  ```
  **Flow 5A — Mobile UI First BaaS:**
  ```
  ## Phase 2A — UI/UX Design          [ ] pending  (command: /swp-ui)
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 2A complete)
  ```
  **Flow 6A — Arch First Serverless:**
  ```
  ## Phase 1A — Architecture Design   [ ] pending  (command: /swp-arch)
  ## Phase 1B — Scaffold              [ ] pending  (command: /swp-arch Stage 2)
  ## Phase 2B — DB/Event Schema       [ ] pending  (command: /swp-db)
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 1A + 1B + 2B complete)
  ```
  **Flow 6B — Serverless + Frontend:**
  ```
  ## Phase 1A — Architecture Design   [ ] pending  (command: /swp-arch)
  ## Phase 1B — Scaffold              [ ] pending  (command: /swp-arch Stage 2)
  ## Phase 2  — UI/UX + DB Design     [ ] pending  (command: /swp-design)
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 1A + 1B + 2 complete)
  ```
  **Flow 7A — Arch First Multi-service:**
  ```
  ## Phase 1A — Architecture Design   [ ] pending  (command: /swp-arch)
  ## Phase 1B — Scaffold              [ ] pending  (command: /swp-arch Stage 2)
  ## Phase 2B — DB Design (per svc)   [ ] pending  (command: /swp-db per service)
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 1A + 1B + 2B complete)
  ```
  **Flow 7B — Contract First Multi-service:**
  ```
  ## Phase 2B — DB/Contract Design    [ ] pending  (command: /swp-db)     ← step 1
  ## Phase 1A — Architecture Design   [ ] pending  (command: /swp-arch)   ← step 2
  ## Phase 1B — Scaffold              [ ] pending  (command: /swp-arch Stage 2) ← step 3
  ## Phase 3  — Dev Stories           [ ] BLOCKED  (requires 2B + 1A + 1B complete)
  ```

  Also update the BREAKDOWN.md `Flow:` header line:
  ```
  Flow        : [PATH CONFIRMED not yet set — written by STEP 13]
  ```
  →
  ```
  Flow        : [Flow Name from PATH CONFIRMED]
  ```

- [ ] **Step 5: Commit SRS.md + BREAKDOWN.md together**

  ```
  git add docs/SRS.md docs/BREAKDOWN.md
  git commit -m "docs(phase-0): PATH CONFIRMED — [Flow Name] locked + BREAKDOWN phases generated"
  ```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Plan task | Status |
|---|---|---|
| PATH SELECTION step at end of /swp-srs | Task 8 | ✅ |
| Auto-detect from STACK CONFIRMED | Task 8 — Detection block | ✅ |
| Show only eligible flows | Task 8 — flow catalogue with show-when conditions | ✅ |
| Why it's powerful descriptions | Task 8 — all 15 flows with descriptions | ✅ |
| Explicit confirmation before locking | Task 8 — confirmation gate "path confirmed" | ✅ |
| Write PATH CONFIRMED block to SRS.md | Task 8 — write + commit step | ✅ |
| PATH CHECK in /swp-arch | Task 2 | ✅ |
| PATH CHECK in /swp-design | Task 3 | ✅ |
| PATH CHECK in /swp-ui | Task 4 | ✅ |
| PATH CHECK in /swp-db | Task 5 | ✅ |
| PATH CHECK in /swp-plan | Task 6 | ✅ |
| PATH CHECK in /swp-scaffold | Task 7 | ✅ |
| Update /swp-scaffold STEP 14 to use PATH CONFIRMED next step | Task 7 — Part B | ✅ |
| Override escape hatch | Task 8 — PATH CHECK blocks include override text | ✅ |
| Re-run protection (PATH CONFIRMED already exists) | Task 8 — detection block checks for existing lock | ✅ |
| "explain [N]" handler | Task 8 — explain handler section | ✅ |
| Fix swp-design version header | Task 1 | ✅ |
| Fix swd-next STEP 8 misleading text | Task 1 | ✅ |
| Fix swp-arch skill chain | Task 1 | ✅ |
| Downstream enforcement for legacy SRS (no PATH CONFIRMED) | Tasks 2–7 PATH CHECK: WARNING output, no hard block | ✅ |

**Placeholder scan:** No TBD, TODO, or "implement later" found. Every PATH CHECK block contains the exact text to insert. All 15 flows include command sequences and descriptions. ✅

**Type consistency:** PATH CONFIRMED block format is defined once in Task 8 and referenced consistently in all PATH CHECK tasks. The term "PATH CONFIRMED" is used identically across all tasks. ✅
