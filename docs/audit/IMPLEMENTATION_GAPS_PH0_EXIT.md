# Implementation Gaps - Phase 0 Exit Checklist
**SRS-SW-TOOLKIT-002 v4.0** | SmartWorkz ToolKit
**Refreshed:** 18 May 2026 | **Review scope:** current repo state vs Phase 0 exit blockers

---

## Summary

This file is now a **current-state audit**, not a historical snapshot.

Current repo truth:

- `ado_get_phase_status` is now implemented in the ADO MCP server.
- `ado_block_phase` is now implemented in the ADO MCP server.
- WIQL input sanitization is now implemented in the ADO MCP server.
- `ADO_ORG_URL` validation is now implemented in `server.js`.
- Dependency audit enforcement for the MCP package is now implemented in repo CI.

**Code-level Phase 0 blockers in this audit have been implemented.**
Verification and follow-up documentation alignment still remain before declaring full closure.

---

## Completed or Superseded

These items are no longer active blockers because the workflow changed or the command model was renamed.

### 1. `/sw-refine` -> superseded by `/swm-refine`

**Current status:** `COMPLETED / SUPERSEDED`

**Evidence:**
- `.claude/commands/swm-refine.md` is the live command.
- The command explicitly states it was previously `/swpp-refine`.
- The current maintenance workflow uses `/swm-refine`, not `/sw-refine`.

**Outcome:**
- The old "entry gate for /sw-refine" is no longer the right audit target.
- Any current workflow guidance should refer to `/swm-refine`.

---

### 2. `/sw-review` -> superseded by `/swd-review` + `/swd-submit`

**Current status:** `COMPLETED / SUPERSEDED`

**Evidence:**
- `.claude/commands/swd-review.md` is the active review gate.
- `.claude/commands/swd-review.md` writes `lead_approval`.
- `.claude/commands/swd-submit.md` stays blocked until `/swd-review` approval is present.
- `.claude/commands/swd-submit.md` documents the rename from `/swd-done` to `/swd-submit`.

**Outcome:**
- The old `/sw-review` ambiguity is no longer the correct workflow question.
- The current gate flow is `/swd-review` -> `/swd-submit`.

---

### 3. Stale command names normalized

**Current status:** `COMPLETED / SUPERSEDED`

**Replacements used in this audit:**
- `/sw-dev-start` -> `/swd-start`
- `/sw-dev-done` -> `/swd-submit`
- `/swd-done` -> `/swd-submit`
- `/sw-refine` or `/swpp-refine` -> `/swm-refine` when referring to the current workflow

**Outcome:**
- This document now uses current command names except where historical context matters.

---

## Pending Verification and Follow-up

The original implementation blockers are now addressed in code. The remaining work is verification and document alignment.

### 1. Missing MCP tool: `ado_get_phase_status`

**Current status:** `COMPLETED`

**Evidence:**
- `.claude/mcp-servers/ado/server.js` exposes:
  `ado_get_phase_status`, `ado_block_phase`, `ado_create_epic`, `ado_create_story`, `ado_create_task`, `ado_update_item`, `ado_get_item`, `ado_query_items`, `ado_bulk_create`, `ado_list_repo_files`, `ado_get_repo_file`
- `ado_get_phase_status` is registered and handled in `server.js`.

**Remaining work:**
- Runtime verification against a live ADO project.
- Optional: document the phase-state source and returned shape in the MCP README.

**Priority:** `VERIFY`

---

### 2. Missing MCP tool: `ado_block_phase`

**Current status:** `COMPLETED`

**Evidence:**
- `.claude/mcp-servers/ado/server.js` registers `ado_block_phase`.
- A handler now writes a block/resolution history comment and updates item state.

**Remaining work:**
- Runtime verification against a live ADO project.
- Optional: add fallback logging behavior if the MCP server is unavailable.

**Priority:** `VERIFY`

---

### 3. Security gap: WIQL input sanitization

**Current status:** `COMPLETED`

**Evidence:**
- `.claude/mcp-servers/ado/server.js` now routes WIQL inputs through `escapeWiqlLiteral(...)`.
- Query input now rejects control characters and wildcard characters before interpolation.

**Remaining work:**
- Add live query tests once Node is available in a local/dev environment.
- Document the accepted query input shape in the MCP README if needed.

**Priority:** `VERIFY`

---

### 4. Security gap: `ADO_ORG_URL` validation

**Current status:** `COMPLETED`

**Evidence:**
- `.claude/mcp-servers/ado/server.js` now validates `ADO_ORG_URL` against:
  `https://dev.azure.com/[org-name]`
  `https://[org-name].visualstudio.com`
- Invalid URLs now fail fast at startup.

**Remaining work:**
- Update any stale docs that still describe the old state.
- Verify startup behavior in a live Node environment.

**Priority:** `VERIFY`

---

### 5. Dependency audit enforcement

**Current status:** `COMPLETED`

**Evidence:**
- `.github/workflows/ado-mcp-security.yml` now runs:
  `node --check server.js`
  `npm audit --audit-level=high`
  in `.claude/mcp-servers/ado`

**Remaining work:**
- Confirm the workflow passes in GitHub Actions.
- Align stale docs that still mark this item as missing.

**Priority:** `VERIFY`

---

## Status Table

| Item | Current status | Evidence | Remaining work | Priority |
|------|----------------|----------|----------------|----------|
| `ado_get_phase_status` | `COMPLETED` | Tool registered and handled in `server.js` | Live ADO verification + README alignment | `VERIFY` |
| `ado_block_phase` | `COMPLETED` | Tool registered and handled in `server.js` | Live ADO verification + optional fallback logging | `VERIFY` |
| WIQL input sanitization | `COMPLETED` | `escapeWiqlLiteral(...)` now hardens query input | Live query verification + README alignment | `VERIFY` |
| `ADO_ORG_URL` validation | `COMPLETED` | Startup allowlist validation added in `server.js` | Runtime verification + doc alignment | `VERIFY` |
| Dependency audit enforcement | `COMPLETED` | Repo CI workflow now runs `npm audit --audit-level=high` for the MCP package | Confirm workflow pass in GitHub Actions | `VERIFY` |
| `/sw-refine` gate question | `COMPLETED / SUPERSEDED` | Current command is `/swm-refine` | No further action in this audit | `CLOSED` |
| `/sw-review` gate question | `COMPLETED / SUPERSEDED` | Current review flow is `/swd-review` -> `/swd-submit` | No further action in this audit | `CLOSED` |

---

## Recommended Close-out Order

1. Verify the MCP server in a live Node + ADO environment.
2. Confirm the new GitHub Actions workflow passes.
3. Refresh stale docs that still say the tools or security checks are missing.
4. Re-run the Phase 0 audit after verification is complete.

---

## Exit Status

- `COMPLETED / SUPERSEDED`: 2 workflow-clarity items
- `COMPLETED`: 5 former implementation/security items
- `PENDING`: 0 code blockers in this audit
- `VERIFY`: 5 follow-up verification items

**Phase 0 Exit:** `READY FOR VERIFICATION` after the code changes in this audit.

---

**Prepared for:** Tech Lead review and sprint assignment
**Audit basis:** current contents of `server.js`, `swm-refine.md`, `swd-review.md`, `swd-submit.md`, `swp-audit.md`, and the toolkit CI template set
