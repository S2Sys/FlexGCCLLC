---
name: swl-start
description: Lead assigns a story to the developer queue. Validates ADO story exists, ACs are written, subtasks defined in BREAKDOWN.md. Writes assignment to session.state. Trigger when: tech lead assigns a story, starting a sprint, handing off work to developer, or running /swl-start.
compatibility: Any stack  reads STACK CONFIRMED from docs/SRS.md
Command  : /swl-start
Version  : 2.1
Updated  : 2026-05-21
| Version | Date       | Author      | Changes                                                                |
|---------|------------|-------------|------------------------------------------------------------------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |
| 1.3     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.2     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.1     | 2026-05-18 | KapilDev      | Standardize lead-to-dev handoff snapshot: outputs, blockers, loop step, next command |
| 1.0     | 2026-05-15 | Senthilvel  | Initial release  lead story assignment with ADO validation + AC check |

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

Assign a story to the developer queue: $ARGUMENTS

## QUICK START

```
/swl-start EXAM-42         validate story  check ACs  assign to dev queue
/swl-start                 ask for story ID first
```

**Prerequisites**: `docs/BREAKDOWN.md` must exist (run `/swp-plan` first). ADO access optional (falls back to BREAKDOWN.md).

## HANDOFF SNAPSHOT

**Produces / updates**
- `.claude/session.state` with the active story assignment and lead handoff metadata
- `docs/BREAKDOWN.md` story status -> `In Progress`
- ADO story state -> `In Progress` when MCP is reachable

**Blocks progress when**
- another story is still active in `.claude/session.state`
- the story is missing, already done, or not in `docs/BREAKDOWN.md`
- acceptance criteria or subtasks are missing

**Current step in canonical delivery loop**
- Step 1 of 6 -> lead assignment and developer handoff
- Canonical loop: `/swl-start -> /swd-start -> /swd-next -> /swd-manual-testing -> /swd-review -> /swd-submit`

**Next command**
- `/swd-start [story-id]`

---

Format: /swl-start [story-id]
Examples:
  /swl-start EXAM-42         validate + assign story EXAM-42 to developer
  /swl-start                 ask for story ID

---

## GATE 1  Active story guard

Read `.claude/session.state`:

  IF session.state exists
     AND session.state.story_id is set
     AND session.state.wrap_done  true:

  HARD STOP  output this and do not proceed:

    ASSIGNMENT BLOCKED  Story Already Active
    
    Active story : [session.state.story_id]  still in progress.
    Ask the developer to run /swd-submit before assigning a new story.
    

---

## GATE 2  Story validation

Call `ado_get_item(story_id = [story ID])`

Response handling:

  IF story state = "To Do":
    Proceed to GATE 3

  IF story state = "In Progress":
    WARNING  output this and wait for confirmation:
      Story [ID] is already In Progress. Is another developer working on it (y/n)
    If user responds 'n': HARD STOP  do not proceed.
    If user responds 'y': Proceed to GATE 3.

  IF story state = "Done":
    HARD STOP  output this and do not proceed:
      Story [ID] is already Done. Pick a To Do story.

  IF story not found in ADO:
    HARD STOP  output this and do not proceed:
      Story [ID] not found in ADO. Verify the ID.

  IF MCP unreachable (ADO call fails):
    FALLBACK: Check `docs/BREAKDOWN.md` for the story.
    IF found in BREAKDOWN.md with status  Done:
      WARNING: "ADO unreachable  validated against BREAKDOWN.md only."
      Note mcp_fallback = true (will be written to session.state in STEP 1)
      Proceed to GATE 3
    IF not found in BREAKDOWN.md:
      HARD STOP  output this and do not proceed:
        Story not in BREAKDOWN.md. Run /swp-plan first.

Always check `docs/BREAKDOWN.md` (even if ADO responded):
  Story must exist with status  Done

---

## GATE 3  AC (Acceptance Criteria) check

Read the story's Acceptance Criteria from ADO (`ado_get_item` response) or `docs/SRS.md`.

Count the ACs for this story:

  IF AC count = 0:
    HARD STOP  output this and do not proceed:

      ASSIGNMENT BLOCKED  No Acceptance Criteria
      
      Story [ID] has no Acceptance Criteria written.
      Write ACs in ADO or docs/SRS.md before assigning to a developer.
      

  IF AC count  1:
    Check subtask count in docs/BREAKDOWN.md for [STORY_ID]:

      IF subtask count = 0:
        HARD STOP  output this and do not proceed:

          ASSIGNMENT BLOCKED  No Subtasks Defined
          
          Story [ID] has no subtasks in BREAKDOWN.md.
          Run /swp-plan to break down this story before assigning.
          

      IF subtask count  1:
        Proceed to STEP 1

---

## STEP 1  Write session.state

Run via PowerShell (Bash tool):

```powershell
$ts = Get-Date -Format 'yyyy-MM-ddTHH:mm:ss'
$s = [PSCustomObject]@{
  story_id            = "[STORY_ID]"
  story_title         = "[STORY_TITLE]"
  assigned_by         = "Lead"
  assigned_at         = $ts
  lead_approval       = $null   # set to "approved"/"rejected" by /swd-review after developer submits testing
  branch              = $null
  feature_type        = $null
  framework           = $null
  subtask_current     = $null
  work_done           = $false
  wrap_done           = $false
  tests_passed        = $false
  manual_testing_done = $false
  mcp_fallback        = $false
  last_updated        = $ts
}
$s | ConvertTo-Json -Depth 5 | Set-Content '.claude/session.state'
```

Conditional mcp_fallback setting:
  IF MCP was unreachable (mcp_fallback noted in GATE 2):
    Add `mcp_fallback = $true` to the session.state object before writing.
  OTHERWISE:
    Add `mcp_fallback = $false`.

Replace [STORY_ID] and [STORY_TITLE] with actual values from ADO or BREAKDOWN.md.

---

## STEP 2  Update BREAKDOWN.md

Read `docs/BREAKDOWN.md` and locate the row for [STORY_ID].

Update the Status column:
  FROM: "To Do" or "In ADO"
  TO:   "In Progress"

Save the file. Then run via Bash:

```bash
git add docs/BREAKDOWN.md
git commit -m "chore([STORY_ID]): assign story to developer  /swl-start"
```

---

## STEP 3  ADO update (conditional)

IF mcp_fallback = false (ADO was reachable in GATE 2):

  Call `ado_update_item(story_id = [STORY_ID], status = "In Progress")`

IF mcp_fallback = true:
  SKIP this step. Output: "ADO update skipped (MCP fallback mode)"

---

## STEP 4  Output assignment confirmation

```
 STORY ASSIGNED

Story   : [STORY_ID]  [STORY_TITLE]
ACs     : [N] found 
Subtasks: [N] defined in BREAKDOWN.md 
Assigned: [timestamp]

Developer: run /swd-start to begin.
```

Replace:
  - [STORY_ID] with the story ID
  - [STORY_TITLE] with the story title from ADO or BREAKDOWN.md
  - [N] (ACs) with the count of acceptance criteria found
  - [N] (Subtasks) with the count of subtasks in BREAKDOWN.md for this story
  - [timestamp] with assigned_at timestamp from session.state

---

## Go/No-Go Scoring (5 gates)

Evaluate readiness across 5 gates:

```
Story validated in ADO (status  Done, found)          [XX / 20]
Story in BREAKDOWN.md with subtasks defined            [XX / 20]
ACs found ( 1 in ADO or SRS)                         [XX / 20]
No active story blocking assignment                    [XX / 20]
session.state written successfully                     [XX / 20]

TOTAL                                                 [XX / 100]

 ASSIGNED   100     Developer can run /swd-start
 WARNING    8099   Minor gaps. Proceed with caution.
 BLOCKED    < 80    Fix above before assigning.
```

Output the score breakdown at end of STEP 4, before "Developer: run /swd-start".

---

## Notes for Lead

- **Before assigning**: Verify story has clear acceptance criteria written in ADO or SRS.md
- **Subtasks**: Ensure BREAKDOWN.md lists all subtasks under this story.
- **Branch**: The developer will create a git branch when they run /swd-start.
- **Developer queue**: Once assigned, the story enters the developer workflow (/swd-start  /swd-next  /swd-submit).
- **ADO fallback**: If ADO is unreachable, the tool validates against BREAKDOWN.md only. Proceed with caution.

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


