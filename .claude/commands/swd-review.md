---
name: swd-review
description: AI-powered AC coverage review gate. Developer runs after all subtasks are built and manual testing is done. AI reads evidence files, maps each AC to unit + manual test proof, and outputs APPROVED or REJECTED with a remediation checklist. Trigger when: all subtasks are complete, all manual testing proof is submitted, and the developer is ready to hand work back to the lead.
compatibility: Any stack  reads STACK CONFIRMED from docs/SRS.md
Command  : /swd-review
Version  : 2.1
Updated  : 2026-05-21
| Version | Date       | Author     | Changes                                                                                    |
|---------|------------|------------|--------------------------------------------------------------------------------------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |
| 1.3     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.2     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.1     | 2026-05-18 | KapilDev     | Standardize review handoff snapshot: outputs, blockers, loop step, next command |
| 1.0     | 2026-05-15 | Senthilvel | Initial release  AI AC coverage review gate; APPROVED/REJECTED verdict with remediation checklist |

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

## Skill Optimization Contract

Before final output, run this optimization pass:

1. Re-check the command description and confirm the output satisfies every promised capability.
2. Confirm required inputs and mark missing or weak evidence as `DATA GAP`; do not invent data, approvals, metrics, IDs, costs, dates, or verification results.
3. Convert findings into action-ready items with owner, priority, expected impact, effort, confidence, verification method, and next command or stakeholder.
4. Include a quality scorecard in the final artifact or final response:

| Area | Status | Evidence | Required Follow-up |
|---|---|---|---|
\|\ Input\ completeness\ \|\ PASS\ /\ CONDITIONAL\ /\ BLOCKED\ \|\ \[sources]\ \|\ \[action]\ \|
| Evidence quality | PASS / CONDITIONAL / BLOCKED | [proof] | [action] |
| Output actionability | PASS / CONDITIONAL / BLOCKED | [owners/priorities] | [action] |
| Handoff clarity | PASS / CONDITIONAL / BLOCKED | [next command/owner] | [action] |
| Verification | PASS / CONDITIONAL / BLOCKED | [checks] | [action] |
| Documentation sync | PASS / CONDITIONAL / BLOCKED / N/A | [docs reviewed] | [action] |

If any area is `BLOCKED`, stop and report blockers instead of marking the workflow complete.

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

---

AI coverage review gate: verify every Acceptance Criterion is backed by unit test proof AND manual testing proof before the lead accepts the story.

Run this AFTER all subtasks are built and `/swd-manual-testing` has been submitted for every layer.
`/swd-submit` remains blocked until this command writes `lead_approval = "approved"` to session.state.

## HANDOFF SNAPSHOT

**Produces / updates**
- AC coverage verdict for the active story: `approved` or `rejected`
- `.claude/session.state.lead_approval`
- remediation checklist in `.claude/session.state.lead_approval_checklist` when coverage is incomplete

**Blocks progress when**
- no active story exists
- acceptance criteria cannot be loaded from ADO or `docs/SRS.md`
- manual proof files, unit-test mapping, or subtask completion are incomplete

**Current step in canonical delivery loop**
- Step 5 of 6 -> AI coverage gate before final submit
- Canonical loop: `/swl-start -> /swd-start -> /repeat(/swd-next -> /swd-manual-testing) -> /swd-review -> /swd-submit`

**Next command**
- if approved: `/swd-submit`
- if rejected: fix the checklist items with `/swd-next`, `/swd-unit-test`, or `/swd-manual-testing`, then re-run `/swd-review`

---

## STEP 1  Pre-flight check

Read `.claude/session.state`:

  IF story_id is not set:
    HARD STOP  output:
      REVIEW BLOCKED  No Active Story
      
      session.state has no story_id.
      Run /swl-start [story-id] then /swd-start before reviewing.
      

  Proceed to STEP 2 regardless of any prior lead_approval value  each run is a full re-review.

---

## STEP 2  Load context

### 2A  Story and ACs

Call `ado_get_item(id = [session.state.story_id])`:
  - Read the story Title, State, and AcceptanceCriteria field.
  - Extract all ACs as a numbered list: AC-1, AC-2,  AC-N.

IF MCP unreachable / ado_get_item fails:
  FALLBACK  Read `docs/SRS.md`:
    Search for the section containing [story_id] or the story title.
    Extract all bullet/numbered ACs listed under that story.
  IF SRS.md also has no ACs for this story:
    HARD STOP  output:
      REVIEW BLOCKED  No Acceptance Criteria Found
      
      Could not load ACs from ADO or docs/SRS.md for [story_id].
      Write ACs in ADO or SRS.md, then re-run /swd-review.
      

### 2B  Manual testing proof files

Scan `docs/sessions/` for all files matching:
  `manual-testing-[STORY-ID]-*.md`   (case-insensitive match on story_id)

For each proof file found:
  - Record filename and the list of ACs covered (from the "## ACs Covered" section).
  - Record each TC status (PASS / FAIL) and whether proof text is present.

IF no proof files found for this story:
  Record: manual_proof_count = 0

### 2C  Unit test evidence

Read `CONTEXT.md`:
  - Extract the completed subtask list.
  - For each completed subtask, note any unit test files mentioned
    (e.g. "Tests: [file path]" or "Unit tests: [file path]").

Scan the project for test files related to this story:
  - Look in standard test directories (Tests/, test/, *.Tests/, spec/)
  - Match files whose names or content reference [story_id] or the story's feature noun.
  - For each test file found, scan test method names for AC references:
       Test name contains "AC" or "AC-[N]"  explicit AC mapping
       Test name contains keywords from the AC description  implicit mapping

### 2D  Subtask completion check

Read `docs/BREAKDOWN.md`:
  Locate all subtasks listed under [story_id].
  For each subtask record: name, status (To Do / In Progress / Done / ).
  Count: subtasks_total, subtasks_done (status = Done or ).

---

## STEP 3  Review header

Output:

  
  AC COVERAGE REVIEW
  Story   : [story_id]  [story_title]
  ACs     : [N] found
  Subtasks: [subtasks_done]/[subtasks_total] complete
  Proof files: [count] manual testing file(s) in docs/sessions/
  

  Reviewing coverage now

---

## STEP 4  Per-AC coverage check

For EACH AC in the list (AC-1 through AC-N), perform all three checks:

### Check A  Unit test coverage
  Does a unit test exist whose name or tested behaviour maps to this AC
     PASS: test method name contains AC ID (e.g. "AC1", "AC-1") OR
             test method name contains a key noun/verb from the AC description
     FAIL: no test file or test method can be mapped to this AC

### Check B  Manual proof file exists
  Does any proof file in docs/sessions/ list this AC under "## ACs Covered"
     PASS: AC is explicitly listed in at least one proof file
     FAIL: AC is not listed in any proof file

### Check C  Proof completeness
  For each proof file that covers this AC:
    Does it contain at least one TC with Status: PASS and non-empty Proof section
     PASS: at least one PASS TC with proof text is present
     FAIL: all TCs are missing, Status: FAIL, or Proof section is empty

Record the result for each AC:

  AC-[N]  [AC description]
    Unit test   :  [test name] /  No mapping found
    Manual proof:  [filename] /  Not in any proof file
    Proof complete:  TC[N] PASS with evidence /  [reason]
    VERDICT:  COVERED /  NOT COVERED

An AC is COVERED only if ALL THREE checks are .

---

## STEP 5  Score and verdict

Calculate:
  covered = count of ACs where all three checks 
  total   = total number of ACs
  score   = covered / total * 100
  all_subtasks_done = (subtasks_done = subtasks_total AND subtasks_total > 0)

Determine verdict:

  IF score = 100 AND all_subtasks_done = true:
    verdict = "approved"

  ELSE:
    verdict = "rejected"

---

## STEP 6  Write session.state

### IF APPROVED

Run via Bash tool (single contiguous block):

```powershell
$s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
$s | Add-Member -NotePropertyName 'lead_approval'           -NotePropertyValue "approved" -Force
$s | Add-Member -NotePropertyName 'lead_review_at'          -NotePropertyValue (Get-Date -Format 'o') -Force
$s | Add-Member -NotePropertyName 'lead_approval_checklist' -NotePropertyValue $null -Force
$s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
```

### IF REJECTED

Build the remediation checklist array from all NOT COVERED ACs.
Each item contains: ac_id, ac_description, reason (which check failed), action (what to do).

Run via Bash tool (single contiguous block):

```powershell
$s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
$s | Add-Member -NotePropertyName 'lead_approval'  -NotePropertyValue "rejected" -Force
$s | Add-Member -NotePropertyName 'lead_review_at' -NotePropertyValue (Get-Date -Format 'o') -Force
$checklist = @(
  # One entry per uncovered AC  populate from review results:
  [PSCustomObject]@{
    ac_id       = "AC-[N]"
    description = "[AC description]"
    reason      = "[no unit test / no manual proof / proof incomplete]"
    action      = "[exact step: write test for X / run /swd-manual-testing for layer Y / add TC proof]"
  }
  # ... repeat for each uncovered AC
)
$s | Add-Member -NotePropertyName 'lead_approval_checklist' -NotePropertyValue $checklist -Force
$s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
```

---

## STEP 7  Output final result block

### IF APPROVED:

   LEAD REVIEW  APPROVED
  
  Story  : [story_id]  [story_title]
  ACs    : [N]/[N] covered 
  Tests  : unit   manual 
  Subtasks: [subtasks_done]/[subtasks_total] 
  
  /swd-submit is now unlocked. Run it to commit.

### IF REJECTED:

   LEAD REVIEW  REJECTED
  
  Story  : [story_id]  [N] AC(s) not fully covered

  REMEDIATION CHECKLIST:

  For each uncovered AC  output one block:

     [AC-N]  [AC description]
          [specific reason: no unit test / no manual proof / proof incomplete]
          Action: [exact step to fix]

  IF any subtask is not done  append:

     Incomplete subtasks: [list of subtask names with status  Done]
          Action: Run /swd-next for each incomplete subtask, then /swd-manual-testing.

  
  Fix all items above, then run /swd-review  AI will re-review automatically.
  

---

## Go/No-Go  AC Coverage Acceptance

Rate each dimension (20 pts each, 100 pts total):

  All ACs have at least one mapped unit test                        [XX / 20]
  All ACs listed in at least one manual proof file                  [XX / 20]
  All proof files contain PASS TCs with evidence (no bare FAILs)    [XX / 20]
  All BREAKDOWN.md subtasks for this story marked Done or         [XX / 20]
  session.state.lead_approval written successfully                  [XX / 20]
  
  TOTAL                                                             [XX / 100]

   PASS (100)  APPROVED   All ACs fully covered, all subtasks done. /swd-submit is unlocked.
   FAIL (< 100)  REJECTED  Any gap found. Fix checklist items and re-run /swd-review.

  SIGNAL:  APPROVED /  REJECTED

  PENDING DECISIONS  resolve before /swd-submit
  
   #   Issue                                                 Priority  Reply with                           
  
   1   [AC-N]  no unit test found                                  "run /swd-unit-test: [AC description]"|
   2   [AC-N]  not in any manual proof file                        "run /swd-manual-testing for [layer]" 
   3   [AC-N]  proof file has no PASS TC evidence                  "re-run TC[N] and paste result"       
   4   Subtask [name] not marked Done                               "run /swd-next [layer]"              
  

  [STOP  resolve all  items. /swd-submit is BLOCKED until  APPROVED.]

---

## Notes

- **Re-run freely**: /swd-review can be run as many times as needed. Each run is a full re-review.
- **No AC source**: If ADO is unreachable AND SRS.md has no ACs for this story, the review is blocked  write ACs first.
- **Partial proof**: A proof file with only FAIL TCs does not satisfy Check C. Fix the failing TC (via /swm-bug) and re-submit proof.
- **Implicit unit test mapping**: AI will attempt to match test method names to AC descriptions by key nouns (e.g. AC says "user cannot access another tenant's data"  test named `GetById_WrongTenant_Returns404` qualifies). When uncertain, mark as  and request an explicit test.
- **After approval**: Run `/swd-submit` to commit all code, update CHANGELOG/README, mark ADO done, and output the SESSION SUMMARY.

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


