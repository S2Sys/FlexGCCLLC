---
name: swd-manual-testing
description: |
  Submit proof of manual testing for the current subtask. Records test case results and evidence, marks manual_testing_done = true, and unlocks /swd-submit. All test cases are mandatory.
  Trigger when: a development layer is built, /swd-next has output manual testing instructions, or the developer has completed testing and needs to submit proof.
compatibility: Any stack  reads STACK CONFIRMED from docs/SRS.md
Command  : /swd-manual-testing
Version  : 2.1
Updated  : 2026-05-21
| Version | Date       | Author  | Changes                                                                 |
|---------|------------|---------|-------------------------------------------------------------------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.3     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.2     | 2026-05-18 | KapilDev  | Standardize delivery-loop handoff snapshot: outputs, blockers, loop step, next command |
| 1.1     | 2026-05-13 | Zenthil | Added Go/No-Go manual testing acceptance gate; PENDING DECISIONS matrix for TC failures |
| 1.0     | 2026-05-13 | Zenthil | STEP 3: danger banner + all TCs mandatory; STEP 4: missing TC blocked with danger banner; failed TC triggers fix  re-test  resubmit loop (does not hard stop) |
| 0.1     | 2026-05-13 | Zenthil | Created  developer submits proof of manual testing; saves to docs/sessions/; unlocks /swd-submit |

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

Submit proof of manual testing for the current subtask.

Run this AFTER completing the manual testing instructions from /swd-next STEP 7.
/swd-submit is blocked until this command records proof and sets manual_testing_done = true.

## HANDOFF SNAPSHOT

**Produces / updates**
- `docs/sessions/manual-testing-[STORY-ID]-[YYYY-MM-DD]-[layer-slug].md`
- `.claude/session.state` with `manual_testing_done = true` and the proof file path
- git commit for the manual testing proof artifact

**Blocks progress when**
- required proof is missing for any TC
- any TC is marked FAIL and still needs a fix-and-retest loop
- the current story or subtask context cannot be reconstructed from session files

**Current step in canonical delivery loop**
- Step 4 of 6 -> repeated manual proof gate after each `/swd-next` layer
- Canonical loop: `/swl-start -> /swd-start -> /repeat(/swd-next -> /swd-manual-testing) -> /swd-review -> /swd-submit`

**Next command**
- if subtasks remain: `/swd-next [layer]`
- if all subtasks are done: `/swd-review`

---

## STEP 1  Check if already done

Read `.claude/session.state`:

  IF session.state.manual_testing_done = true:
    Output:
      Manual testing already confirmed for this subtask.
      /swd-submit is already unlocked  run it to commit.
    STOP  do not proceed further.

---

## STEP 2  Load subtask context

Read CONTEXT.md to identify:
  - Story ID and title
  - Current subtask name and layer (SP / Repository / Service / Endpoint / Component / Frontend Svc)
  - ADO Task ID
  - ACs in scope for this subtask

Output:
  
  MANUAL TESTING PROOF SUBMISSION
  Story   : [ID]  [Title]
  Subtask : [name]  [layer]
  ADO Task: [ID]
  ACs     : [list]
  

---

## STEP 3  Re-display test cases (from /swd-next STEP 7)

Reconstruct and re-output the TC list for this layer so the developer has it in front of them.
Derive from the layer type and ACs  same content as /swd-next STEP 7 generated.

Output first:

  
     MANUAL TESTING  ALL TCs ARE MANDATORY                      
  
    Every TC must be tested. Skipping any TC is NOT allowed.       
    Proof missing for any TC = this gate stays BLOCKED.            
    /swd-next and /swd-submit remain BLOCKED until ALL pass.   
  

Then the TC list:

  WHAT YOU NEED TO HAVE TESTED:
  [ ] TC1  [description and expected result]
  [ ] TC2  [description and expected result]
  [ ] TC3  Unauthorized  401
  [ ] TC4  Tenant isolation  403/404
  [additional TCs for this layer]

Then output:

  
  ALL TCs above are required  do not skip any.
  Accepted proof formats:
     Paste the response body / test output directly in the chat
     Paste the path to a screenshot: "Screenshot: docs/screenshots/[filename].png"
     Type a description: "TC3: Got 401, confirmed no auth header"

  Provide proof for EVERY TC, then say: "proof submitted"
  

Wait for developer to paste proof and say "proof submitted".

---

## STEP 4  Record proof (after "proof submitted" received)

### Step A  Save proof file

Write to `docs/sessions/manual-testing-[STORY-ID]-[YYYY-MM-DD]-[layer-slug].md`:

  # Manual Testing Proof
  Story   : [ID]  [Title]
  Subtask : [subtask name]  [layer]
  ADO Task: [ID]
  Dev     : [ask developer for initials if not provided]
  Date    : [today date]
  Branch  : [branch from session.state]

  ## ACs Covered
  [list ACs this subtask covers]

  ## Test Cases

  ### TC1  [description]
  Status: PASS
  Proof:
  [developer's pasted proof]

  ### TC2  [description]
  Status: PASS
  Proof:
  [developer's pasted proof]

  ### TC3  Unauthorized
  Status: PASS
  Proof:
  [developer's pasted proof]

  ### TC4  Tenant Isolation
  Status: PASS
  Proof:
  [developer's pasted proof]

  [additional TCs as submitted]

  ## Sign-Off
  All test cases passed. Manual testing complete.
  Developer: [initials]    Date: [today]

If any TC proof is MISSING (developer did not provide proof for that TC):

  
     PROOF MISSING FOR TC[N]  BLOCKED                           
  
    Every TC must have proof. You cannot skip a test case.         
    Run TC[N] now and paste the result here before continuing.     
  

  Do NOT set manual_testing_done = true.
  Wait for the missing proof  do not proceed until it is received.

If developer says "TC[N] failed":

  Mark TC[N] as FAIL in the proof file. Then output:

  
     TC[N] FAILED  FIX REQUIRED BEFORE NEXT LAYER              
  
    This issue MUST be fixed. You cannot move to the next layer    
    with a failing TC.                                             
                                                                    
    Steps:                                                          
    1. Run /swm-bug [exact error] to fix the failing issue          
    2. Re-run TC[N] after the fix is applied                       
    3. Paste the new passing result here                           
    4. Once TC[N] shows PASS  say "proof submitted" to continue   
  

  Do NOT set manual_testing_done = true.
  Do NOT hard stop  remain active so developer can paste the fix result.
  Wait for developer to: fix  re-run TC[N]  paste passing proof  "proof submitted".

### Step B  Update session.state

  Run via Bash tool:
    $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
    $s | Add-Member -NotePropertyName 'manual_testing_done' -NotePropertyValue $true -Force
    $proofFile = "docs/sessions/manual-testing-[STORY-ID]-[YYYY-MM-DD]-[layer-slug].md"
    $s | Add-Member -NotePropertyName 'manual_testing_proof' -NotePropertyValue $proofFile -Force
    $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'

### Step C  Commit the proof file

  Run via Bash tool:
    git add docs/sessions/manual-testing-[STORY-ID]-[YYYY-MM-DD]-[layer-slug].md
    git commit -m "test([TaskID]): manual testing proof  [subtask-slug]"

---

## Go/No-Go  Manual Testing Acceptance

Rate each dimension (20 pts each, 100 pts total):

  All TCs attempted (no skipped test cases)                        [XX / 20]
  No TC marked FAIL (every TC has proof submitted)                 [XX / 20]
  Tenant isolation TC passed (wrong-tenant  0 rows / 404)        [XX / 20]
  Proof file written to docs/sessions/                             [XX / 20]
  session.state.manual_testing_done = true confirmed              [XX / 20]
  
  TOTAL                                                            [XX / 100]

   PASS    100   All TCs proven. /swd-submit is unlocked.
   PARTIAL 8099   Minor gaps. Resolve before running /swd-submit.
   FAIL    < 80    TC failure(s) found. Run /swm-bug before /swd-submit.

  SIGNAL:  PASS /  PARTIAL /  FAIL

  PENDING DECISIONS  resolve before /swd-submit
  
   #   Issue                                                 Priority  Reply with                           
  
   1   TC[N] FAIL  [error description]                             "run /swm-bug: [TC description]"      
   2   Tenant isolation TC not run                                  "TC[N] result: [outcome]"            
   3   Proof file missing from docs/sessions/                       "proof: [filename]"                  
  

  [STOP  resolve all  items. /swd-submit is BLOCKED until  PASS.]

---

## STEP 5  Confirm unlock

Output:

  
  MANUAL TESTING CONFIRMED 
  Story   : [ID]  [Title]
  Subtask : [name]  [layer]
  Proof   : docs/sessions/manual-testing-[STORY-ID]-[YYYY-MM-DD]-[layer-slug].md
  

  /swd-submit is now unlocked.
  Run: /swd-submit   to commit the code, update CHANGELOG/README, mark ADO done,
                       write the CONTEXT.md checkpoint, and output the SESSION SUMMARY.
  

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


