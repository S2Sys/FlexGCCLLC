# SmartWorkz ADO MCP Server v1.6.0

Provides Azure DevOps work item tools to Claude Code. The server handles:

- Epic, Story, and Task creation
- Work item reads, updates, and queries
- Phase-gate block status tracking
- Cross-repo file discovery for toolkit sync scenarios

## Setup

```powershell
Push-Location .claude\mcp-servers\ado
npm install
Pop-Location

[System.Environment]::SetEnvironmentVariable("ADO_PAT", "YOUR_PAT_TOKEN", "User")
[System.Environment]::SetEnvironmentVariable("ADO_ORG_URL", "https://dev.azure.com/YOUR_ORG", "User")
[System.Environment]::SetEnvironmentVariable("ADO_PROJECT", "YOUR_ADO_PROJECT_NAME", "User")
```

Restart your terminal after setting environment variables.

## Capability Matrix

| Tool | Input | Output | Primary use |
|------|-------|--------|-------------|
| `ado_get_phase_status` | `work_item_id` | `{ work_item_id, phase, status, blockedSince, blockedReason, resolveCommand, state }` | Check whether work is blocked at a phase gate |
| `ado_block_phase` | `work_item_id, phase, reason, resolve_command, status` | `{ work_item_id, phase, status, timestamp, reason, state }` | Record or resolve a blocked phase state |
| `ado_create_epic` | `title, description` | `{ id, title, url }` | Create Epic |
| `ado_create_story` | `epic_id, title, description, acceptance_criteria` | `{ id, title, url }` | Create Story under Epic |
| `ado_create_task` | `story_id, title, description, estimated_hours` | `{ id, title, url }` | Create Task under Story |
| `ado_update_item` | `id, state, title, description, acceptance_criteria, comment` | `{ id, state }` | Mark work done or patch item content |
| `ado_get_item` | `id` | `{ id, type, title, state, parent, url }` | Load current work item state |
| `ado_query_items` | `work_item_type, state, title_contains` | `[{ id, title, state }]` | Query by type, state, or title |
| `ado_bulk_create` | `epics[]` nested tree | tree with all created IDs | Create full Epic -> Story -> Task hierarchy |
| `ado_list_repo_files` | `path, project?, repo?` | `[{ path }]` | Discover files in another ADO repo |
| `ado_get_repo_file` | `path, project?, repo?` | `{ path, content }` | Read a file from another ADO repo |

## Common Flows

### Planning

- `/swp-plan` uses `ado_create_*` and `ado_bulk_create`
- `/swp-sync` and `/swp-plan` update mode use `ado_get_item` and `ado_update_item`

### Development

- `/swd-start` loads context with `ado_get_item`
- gated commands can use `ado_get_phase_status`
- `/swd-submit` marks items complete with `ado_update_item`
- gate failures can record blocked status with `ado_block_phase`

### Repo sync

- `toolkit-sync` can use `ado_list_repo_files` and `ado_get_repo_file`

## Security Rules

1. Store `ADO_PAT`, `ADO_ORG_URL`, and `ADO_PROJECT` in user environment variables or the local untracked config file.
2. `ADO_ORG_URL` must match one of:
   - `https://dev.azure.com/[org-name]`
   - `https://[org-name].visualstudio.com`
3. Query filters are sanitized before being interpolated into WIQL.
4. Repo CI runs:
   - `node --check server.js`
   - `npm audit --audit-level=high`

## Failure Notes

- If the server does not start, run `npm install` in `.claude\mcp-servers\ado`.
- If a work item update fails, check the ADO item state and retry with a valid transition.
- If a phase block call fails, verify the work item ID, current permissions, and ADO connectivity.

## Current Follow-up

- Verify the new phase-gate tools against a live ADO project
- Confirm the GitHub Actions audit workflow passes
- Add `package-lock.json` after the first successful local install if reproducible installs are required
