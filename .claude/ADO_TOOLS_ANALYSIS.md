# SmartWorkz ADO MCP Server - 11 Tools Analysis

**Server**: `.claude/mcp-servers/ado/server.js`
**Version**: 1.6.0
**Review basis**: current repo state after Phase 0 blocker implementation

## Executive Summary

- **Current tools implemented**: 11
- **Core ADO work item tools**: 9
- **Phase gate tools**: `ado_get_phase_status`, `ado_block_phase`
- **Cross-repo helper tools**: `ado_list_repo_files`, `ado_get_repo_file`
- **Security hardening now present**:
  - WIQL input sanitization for query filters
  - `ADO_ORG_URL` allowlist validation at startup
  - GitHub Actions audit workflow for the MCP package

## Current Tool Matrix

| Tool | Purpose | Status |
|------|---------|--------|
| `ado_get_phase_status` | Read phase-block state from a work item | Implemented |
| `ado_block_phase` | Record or resolve a phase block on a work item | Implemented |
| `ado_create_epic` | Create Epic work item | Implemented |
| `ado_create_story` | Create User Story under Epic | Implemented |
| `ado_create_task` | Create Task under Story | Implemented |
| `ado_update_item` | Patch fields or add history comment | Implemented |
| `ado_get_item` | Read work item details | Implemented |
| `ado_query_items` | Query by type, state, and title substring | Implemented |
| `ado_bulk_create` | Create Epic -> Story -> Task tree | Implemented |
| `ado_list_repo_files` | List files from another ADO repo | Implemented |
| `ado_get_repo_file` | Read file content from another ADO repo | Implemented |

## What Changed

### Phase gate tools

- `ado_get_phase_status(work_item_id)` now inspects the work item state plus history updates.
- `ado_block_phase(work_item_id, phase, reason, resolve_command, status)` now writes block or resolution comments and updates the item state.

### Security hardening

- `ado_query_items` now routes dynamic WIQL input through `escapeWiqlLiteral(...)`.
- `ADO_ORG_URL` must now match:
  - `https://dev.azure.com/[org-name]`
  - `https://[org-name].visualstudio.com`
- Repo CI now includes `.github/workflows/ado-mcp-security.yml` for:
  - `node --check server.js`
  - `npm audit --audit-level=high`

## Remaining Follow-up

These are not code gaps in `server.js`, but still worth closing:

| Area | Follow-up |
|------|-----------|
| Runtime verification | Exercise the new phase tools against a live ADO project |
| Fallback behavior | Decide whether `ado_block_phase` also needs explicit `ado-update.log` fallback behavior outside MCP |
| Documentation | Keep README and SRS-adjacent docs aligned with the new tool surface |
| Reproducibility | Add `package-lock.json` when Node install is run in a writable environment |

## Notes

- The server now exceeds the original "9 tools" expectation because repo-sync helper tools are also present.
- If strict FR16 wording must remain at exactly 9 tools, the docs should clarify the distinction between:
  - 9 core ADO work item tools
  - 2 additional repo helper tools
