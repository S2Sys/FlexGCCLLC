---
name: toolkit-sync
description: Use when skills feel outdated, a teammate reports a missing command, or you want to pull the latest skill files from a different ADO project into this repo. Uses the smartworkz-ado MCP server to read files remotely  no git required.
---


Command  : /toolkit-sync
Version  : 2.1
Updated  : 2026-05-21
Author   : KapilDev

# Toolkit Sync  Pull Skills from Source ADO Project

Reads skill files from a configured ADO Git repository (different project) via MCP and copies them into `.claude/commands/` so they are immediately available.

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

**Source project is configured in** `.claude/mcp-servers/ado/ado.local.json`:
```json
{
  "SKILLS_SOURCE_PROJECT": "DevObs",
  "SKILLS_SOURCE_REPO":    "DevObs"
}
```

---

## STEP 1  List Available Skills from Source

Call the MCP tool:
```
ado_list_repo_files(path: "/.claude/commands")
```

This returns all `.md` files in the source project's `.claude/commands/` folder.
Show the user the list of files found before proceeding.

---

## STEP 2  Confirm Scope

Ask the user:
- **Sync all** files (default)
- Or **specific files only** (user names them)

If the user specifies a subset, only fetch those files.

---

## STEP 3  Fetch Each File

For each file to sync, call:
```
ado_get_repo_file(path: "/.claude/commands/<filename>.md")
```

Fetch files one at a time. Do not batch  ADO rate limits apply.

---

## STEP 4  Write to Local Commands Folder

Write each file's `content` to `s:\Project101\ToolKit\ToolKit\.claude\commands\<filename>.md`.

- **Existing file**  overwrite (skill is being updated)
- **New file**  create (new skill arriving from source)
- **Deleted from source**  do NOT delete locally unless user explicitly asks

Track a list of: Added / Updated / Skipped (identical content).

---

## STEP 5  Report

Output a sync summary:

```
TOOLKIT SYNC COMPLETE (via ADO MCP)
Source  : DevObs / DevObs / .claude/commands/

Added   : new-skill.md
Updated : swd-start.md, swp-arch.md
Skipped : swp-srs.md  (no change)

Reload  : Open /hooks or restart session to activate new skills.
```

---

## STEP 6  Reload Prompt

Skills are loaded at session start. After writing new files:

- **Quickest**: open `/hooks` (forces config reload without restart)
- **Full reload**: close and reopen Claude Code session
- **Verify**: run `/skills` to confirm new commands appear

---

## Config Reference

| ado.local.json field   | Purpose                              |
|------------------------|--------------------------------------|
| `SKILLS_SOURCE_PROJECT`| ADO project to pull skills from      |
| `SKILLS_SOURCE_REPO`   | Git repository name in that project  |
| `ADO_PAT`              | PAT must have **Code (Read)** scope on source repo |

---

## Error Handling

| Error | Fix |
|-------|-----|
| `project and repo are required` | Add `SKILLS_SOURCE_PROJECT` + `SKILLS_SOURCE_REPO` to `ado.local.json` |
| `ADO 401` | PAT expired or lacks **Code (Read)** on source project |
| `ADO 404` on list | Path wrong  check source repo has `.claude/commands/` |
| `ADO 404` on file | File deleted from source since the list was fetched  skip it |

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.
## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).
| Version | Date       | Author   | Notes |
|---|---|---|---|
| 2.0 | 2026-05-21 | KapilDev | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |


