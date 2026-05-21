---
name: swp-sync
description: |
  Validate cross-document consistency across all design docs (MODE 1), or cascade SRS changes downstream to UI-DESIGN, DB-DESIGN, ARCH-DESIGN, and ENTITIES (MODE 2). Runs automatically after every approval gate.
  Trigger when: validating doc consistency after a phase sign-off, propagating a new SRS feature mid-project, checking for design doc conflicts, or running /swp-sync [feature].
compatibility: Any stack  validates and cascades SRS changes to design docs
Command  : /swp-sync
Version  : 2.1
Updated  : 2026-05-21
| Version | Date       | Author  | Changes                                                                                      |
|---------|------------|---------|----------------------------------------------------------------------------------------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.7     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.6     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.5     | 2026-05-14 | Claude  | R1: CONTEXT.md+BREAKDOWN.md in MODE 1 read list; R2: STEP 4.5 DECISIONS.md cascade; R3: approval phrase cheat-sheet; R4: MODE 2 pre-read list; R5: rollback rule; R6: Check #6 example; R7: Check #10 tech alternatives; R8: STEP cross-refs |
| 1.4     | 2026-05-13 | Zenthil | Added commit/push after each cascade step (STEP 2/3/4/5); STOP gate after STEP 1 delta; scored Go/No-Go + PENDING DECISIONS matrix in MODE 1; ADO update note for new stories; migration note for MODIFIED entities; /swp-plan trigger in STEP 5 |
| 1.3     | 2026-05-13 | Zenthil | Cascade mode rewrite  STEP 1 classifies NEW/MODIFIED/REMOVED; STEPs 24 patch existing sections for MODIFIED, flag for tech lead on REMOVED, append for NEW; replaces append-only behaviour |
| 1.2     | 2026-05-13 | Zenthil | Added check #10 SRS NFRs  ARCH-DESIGN.md (caching, rate limiting, message broker, notifications in architecture); pair count updated to 10 |
| 1.1     | 2026-05-13 | Zenthil | Added check #8 SRSARCH-DESIGN.md (features vs services); check #9 CONTEXT.mdBREAKDOWN.md (active story validation); pair count updated to 9 |
| 1.0     | 2026-05-13 | Zenthil | Initial version  validate + cascade modes                                                   |

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

---

Validate cross-doc consistency OR cascade SRS changes to all design docs.

Usage:
  /swp-sync             validate mode (check all 10 cross-doc pairs)
  /swp-sync [feature]   cascade mode (propagate new feature from SRS to UI/DB/Arch)

---

## MODE 1  Validate (runs automatically after every approval gate)

Reads all four approved design docs and checks consistency across 10 pairs.
BLOCK development if any conflict is found  resolve conflicts before proceeding.

Read these files before running any checks:
  1. docs/SRS.md
  2. docs/UI-DESIGN.md   (if it exists)
  3. docs/DB-DESIGN.md   (if it exists)
  4. docs/ARCH-DESIGN.md (if it exists)
  5. ENTITIES.md
  6. docs/DECISIONS.md   (if it exists)
  7. CONTEXT.md          (if it exists)
  8. BREAKDOWN.md        (if it exists)

### CHECKS

| # | Pair                          | What is checked                                                                         |
|---|-------------------------------|-----------------------------------------------------------------------------------------|
| 1 | SRS  UI-DESIGN.md            | Every SRS acceptance criterion has at least one screen in UI-DESIGN.md that covers it  |
| 2 | SRS  DB-DESIGN.md            | Every entity named in SRS exists as a table in DB-DESIGN.md with a corresponding SP    |
| 3 | UI-DESIGN.md  DB-DESIGN.md   | Every data field shown in UI has a matching DB column; every screen data source has a SP |
| 4 | UI-DESIGN.md  ARCH-DESIGN.md | Every screen maps to a defined module or component boundary in ARCH-DESIGN.md           |
| 5 | DB-DESIGN.md  ARCH-DESIGN.md | Every service in ARCH-DESIGN.md has a repository interface and SP plan in DB-DESIGN.md  |
| 6 | DECISIONS.md  All docs       | No active design decision in any doc contradicts a locked DECISIONS.md entry. Example contradiction: DECISIONS.md locks "SQL Server only  no NoSQL" but DB-DESIGN.md introduces a Redis cache table. |
| 7 | ENTITIES.md  DB-DESIGN.md    | Every table in ENTITIES.md exists in DB-DESIGN.md and vice versa (no orphans)           |
| 8 | SRS  ARCH-DESIGN.md          | Every feature Epic in SRS has a corresponding service/module in ARCH-DESIGN.md projects |
| 9 | CONTEXT.md  BREAKDOWN.md     | Story ID in CONTEXT.md exists in BREAKDOWN.md with status  "Done"; subtask matches     |
| 10| SRS NFRs  ARCH-DESIGN.md     | Every NFR in SRS Step 4 that is marked  APPLIES has a corresponding architectural decision: caching strategy (e.g. Redis, in-memory), rate limiting middleware, message broker (e.g. Azure Service Bus, RabbitMQ), real-time notifications (e.g. SignalR, WebSockets), compliance measures (GDPR/HIPAA/PCI-DSS). Missing NFR coverage in ARCH-DESIGN.md = CONFLICT |

Only check pairs where both documents exist. If a doc is missing, skip that pair and note it.

### OUTPUT FORMAT

Output exactly this format:

  SYNC VALIDATION REPORT
  ======================
  Triggered by: [approval type  e.g. "UI approved" / "auto at Level 5 gate" / "manual"]
  Date: [today]

   SRS  UI-DESIGN.md            consistent
   SRS  DB-DESIGN.md            consistent
   UI-DESIGN.md  DB-DESIGN.md:
     CONFLICT: [screen name] requires [data requirement].
     Not found in DB-DESIGN.md.
     FIX: Add [Schema].usp[Entity][Action] to DB-DESIGN.md
          OR revise [screen name] to use existing data source [SP name].
   UI-DESIGN.md  ARCH-DESIGN.md  consistent
   DB-DESIGN.md  ARCH-DESIGN.md  consistent
   DECISIONS.md  All             no contradictions
   ENTITIES.md  DB-DESIGN.md     consistent
   SRS  ARCH-DESIGN.md           consistent
   CONTEXT.md  BREAKDOWN.md      consistent
   SRS NFRs  ARCH-DESIGN.md      consistent

  [SKIPPED: ARCH-DESIGN.md  DB-DESIGN.md  ARCH-DESIGN.md not yet written]

  
  Conflicts found  : [N] of [N] pairs checked
  Score            : [((N-conflicts)  10)] / 100
   CONSISTENT  90   proceed
   MINOR CONFLICTS 6089   resolve  conflicts, defer  items
   BLOCKED < 60   must resolve all conflicts before development continues
  

  RESULT:  CONSISTENT /  MINOR CONFLICTS /  BLOCKED

If BLOCKED or MINOR CONFLICTS  output this PENDING DECISIONS matrix for every conflict found:

  PENDING DECISIONS  conflicts to resolve
  
   #   Conflict (pair / description)                 Priority  Reply with                               
  
   1   [pair N]  [what is inconsistent]                     "fix [N]: [approach]" or "update [doc]"  
   2   [pair N]  [what is inconsistent]                     "defer [N]" or "accept [N]: [reason]"    
  

  Development is BLOCKED until all  conflicts are resolved.
   conflicts may proceed with tech lead acceptance.

If CONSISTENT: output result and allow the calling gate to continue.

---

## MODE 2  Cascade (use when SRS changes  new feature, modified AC, renamed entity, or removed screen)

Trigger: `/swp-sync [feature name]`

This mode propagates any SRS change into all design documents through a staged
review-and-approve flow. Each stage classifies changes as NEW / MODIFIED / REMOVED
and applies the correct write strategy for each.

Approval sequence (use these exact phrases):
  After STEP 1    reply "cascade approved"
  After STEP 2    reply "UI delta approved"
  After STEP 3    reply "DB delta approved"
  After STEP 4    reply "arch delta approved"
  After STEP 4.5  reply "decisions approved"
  STEP 5 runs automatically after "decisions approved"  no reply required.

Read these files before beginning STEP 1:
  1. docs/SRS.md         (required  cascade cannot proceed without it)
  2. docs/UI-DESIGN.md   (if it exists)
  3. docs/DB-DESIGN.md   (if it exists)
  4. docs/ARCH-DESIGN.md (if it exists)
  5. ENTITIES.md         (if it exists)
  6. docs/DECISIONS.md   (if it exists)
  7. CONTEXT.md          (if it exists)
  8. BREAKDOWN.md        (if it exists)

Identify the section for [feature name] in docs/SRS.md and the SRS revision history table.

---

### STEP 1  SRS delta classification

Compare current `docs/SRS.md` against the previous version. Use the SRS revision history
table and git diff (if available). If this is the first version, all items are NEW.

Classify every change:
  NEW       item did not exist in the previous SRS version
  MODIFIED  item existed but AC text, entity fields, or screen requirements changed
  REMOVED   item existed before and is no longer in SRS

Output:

  SRS DELTA  [feature name]
  
  Entities
    NEW      : [list or "none"]
    MODIFIED : [entity name  what changed (field added/removed/renamed)]
    REMOVED  : [entity name  flag for tech lead, may have FK dependencies]

  Screens
    NEW      : [list or "none"]
    MODIFIED : [screen name  which AC/field changed]
    REMOVED  : [screen name  flag for tech lead]

  Acceptance Criteria
    NEW      : [Story ID  AC text]
    MODIFIED : [Story ID  old AC  new AC]
    REMOVED  : [Story ID  AC text removed]

  NFRs
    NEW      : [list or "none"]
    MODIFIED : [NFR  what changed]
    REMOVED  : [NFR  flag for tech lead]
  

If delta is empty (nothing changed for this feature): output "No SRS changes detected for [feature]. Run /swp-sync validate to check consistency." and stop.

[STOP  confirm delta classification before cascade begins.
Reply "cascade approved" to proceed to STEP 2, or redirect to adjust any misclassification.
Do not write to any doc until "cascade approved" is received.]

---

### STEP 2  UI impact   feeds checks #1, #3, #4

For each change classified in STEP 1 that affects screens or ACs with UI implications:

  NEW screen:
    - Design the new screen (components, routing, state, permissions)
    - On approval: APPEND new section to docs/UI-DESIGN.md marked `[NEW  YYYY-MM-DD]`
    - If this new screen implies a new user story: note it for ADO  "New story needed: [screen name]"

  MODIFIED screen:
    - Describe exactly what changes on the existing screen (field added, label changed, new action)
    - On approval: PATCH the existing screen section in docs/UI-DESIGN.md
      Mark the changed lines/subsection: `[UPDATED  YYYY-MM-DD  reason]`
      Do NOT duplicate the screen section  edit in place

  REMOVED screen:
    - Do NOT delete the screen section
    - On approval: prepend `[REMOVED  YYYY-MM-DD  reason]` to the screen section header
      Flag: "Tech lead must confirm no active routes or components reference this screen"

Output UI delta proposal with all three categories clearly separated.
Wait for "UI delta approved" before writing to docs/UI-DESIGN.md.

After writing to docs/UI-DESIGN.md:

  git add docs/UI-DESIGN.md
  git commit -m "docs(swp-sync): UI-DESIGN.md cascade  [feature] [NEW/MODIFIED/REMOVED screens]"

If new stories were noted: output "ADO ACTION NEEDED  add story: [screen name] to BREAKDOWN.md."

---

### STEP 3  DB impact   feeds checks #2, #3, #5, #7

For each entity change classified in STEP 1 and each new UI field with no current DB column:

  NEW entity:
    - Design table, columns, SPs following DB-DESIGN.md conventions
    - On approval: APPEND new table section to docs/DB-DESIGN.md and ENTITIES.md
      Mark: `[NEW  YYYY-MM-DD]`

  MODIFIED entity:
    - Describe exactly what changes (column added/renamed, SP updated, FK added)
    - If a column is added or removed: a migration file is required  note in DB-DESIGN.md:
      "Migration needed: [timestamp]_[Schema][Entity][Change].[ext]"
    - On approval: PATCH the existing table section in docs/DB-DESIGN.md in place
      Mark changed rows/subsections: `[UPDATED  YYYY-MM-DD  what changed]`
      Do NOT duplicate the table section

  REMOVED entity:
    - Do NOT remove the table definition
    - On approval: prepend `[STALE  YYYY-MM-DD  entity removed from SRS]` to the table section
      Flag: "Tech lead must confirm no FK constraints or code references remain before dropping"

Output DB delta proposal with all three categories clearly separated.
Wait for "DB delta approved" before writing to docs/DB-DESIGN.md and ENTITIES.md.

After writing to docs/DB-DESIGN.md and ENTITIES.md:

  git add docs/DB-DESIGN.md ENTITIES.md
  git commit -m "docs(swp-sync): DB-DESIGN.md + ENTITIES.md cascade  [feature] [NEW/MODIFIED/REMOVED entities]"

If new stories were noted: output "ADO ACTION NEEDED  add story: [entity/SP work] to BREAKDOWN.md."

---

### STEP 4  Arch impact   feeds checks #4, #5, #8, #10

For each service, repository, or module implied by STEP 2 and STEP 3 changes:

  NEW service/repository/module:
    - Propose new class, DI registration, folder entry
    - On approval: APPEND to docs/ARCH-DESIGN.md marked `[NEW  YYYY-MM-DD]`

  MODIFIED service:
    - Describe what changes (new method, changed dependency, new SP call)
    - On approval: PATCH the existing section in docs/ARCH-DESIGN.md in place
      Mark: `[UPDATED  YYYY-MM-DD  what changed]`

  REMOVED service:
    - Do NOT remove the section
    - On approval: prepend `[STALE  YYYY-MM-DD]` to the section
      Flag: "Tech lead must confirm DI registration and all callers are removed before deleting"

Output Arch delta proposal with all three categories clearly separated.
Wait for "arch delta approved" before writing to docs/ARCH-DESIGN.md.

After writing to docs/ARCH-DESIGN.md:

  git add docs/ARCH-DESIGN.md
  git commit -m "docs(sw-sync): ARCH-DESIGN.md cascade  [feature] [NEW/MODIFIED/REMOVED services]"

---

### STEP 4.5  DECISIONS.md impact   feeds check #6

For each new architectural choice introduced in STEP 2, STEP 3, or STEP 4:

  NEW decision:
    - Draft a DECISIONS.md entry: Context, Decision, Status (Proposed), Consequences
    - On approval: APPEND to docs/DECISIONS.md marked `[NEW  YYYY-MM-DD]`

  MODIFIED decision:
    - Describe what changed and why the prior decision is superseded
    - On approval: update Status to "Superseded", APPEND new entry below the old one
      Mark: `[UPDATED  YYYY-MM-DD  supersedes prior entry]`

  No decisions required:
    - Output "No new architectural decisions introduced by this cascade."
    - Proceed directly to STEP 5.

Output DECISIONS.md delta proposal.
Wait for "decisions approved" before writing to docs/DECISIONS.md.

After writing to docs/DECISIONS.md:

  git add docs/DECISIONS.md
  git commit -m "docs(swp-sync): DECISIONS.md cascade  [feature] [NEW/MODIFIED decisions]"

---

### STEP 5  Auto validate + push

After all approved writes are applied and committed:

1. Run MODE 1  Validate automatically.

2. If CONSISTENT:
   git push origin [current branch]
   Output:
     CASCADE COMPLETE  [feature]
     
     Docs updated   : [list each doc modified]
     Commits        : [list each commit message]
     Pushed         : [branch name]
     Pairs validated: [N]/10  all consistent
     
     NEXT STEPS:
     [If new stories were added]  Run /swp-plan [feature] to add new stories to BREAKDOWN.md
     [If no new stories]          Design docs are in sync. Development may proceed.

3. If BLOCKED: output conflicts and require resolution before /swp-plan [feature].
   Do NOT push until all conflicts are resolved.

---

RULES:
  - NEVER auto-delete any section  always flag REMOVED items for tech lead confirmation
  - PATCH existing sections for MODIFIED items  never create duplicate sections
  - APPEND only for NEW items  under the correct schema/feature heading
  - Mark every change: [NEW  date], [UPDATED  date  reason], [STALE  date  reason]
  - Each step requires explicit approval before writing  never batch-write all steps at once
  - Commit after each approved step  do not batch all commits into STEP 5
  - Push only once in STEP 5 after all steps are approved, committed, and validated
  - If cascade is abandoned mid-flow: run /swp-sync validate to identify inconsistent pairs,
    then resume from the failed STEP  reply "cascade approved" to skip STEP 1 re-classification

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


