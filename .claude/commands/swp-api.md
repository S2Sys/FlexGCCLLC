---
name: swp-api
description: |
  Design and document a REST API - endpoint naming conventions, HTTP method usage, request/response structure, error response format, authentication pattern, OpenAPI 3.0 spec template, and Swagger UI setup. Produces API-DESIGN.md and openapi.yaml.
  Trigger when: designing a new API, documenting existing endpoints, setting up Swagger, writing an API spec, reviewing API design, or any time someone asks to design or document an API.
compatibility: Any backend stack - framework-agnostic conventions
---

Command  : /swp-api

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

---

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

Final output must include a `RUN SUMMARY` with the same fields. If a phase/stage is skipped, say `Skipped` with reason and impact. If partially failed, show recovery status and do not mark it done.
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

---

Version  : 2.1
Updated  : 2026-05-21
Author   : KapilDev

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |

| 1.2     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a consistently designed, fully documented API that frontend developers and external consumers can use without asking questions.

## Prerequisites

- Domain entities defined (from ENTITIES.md or DB-DESIGN.md if available)
- Authentication method decided
- Stack confirmed (ASP.NET Core / Node / Django / etc.)

---

## STEP 1 - Naming Conventions

Apply these rules to all endpoints:

| Rule | Correct | Wrong |
|------|---------|-------|
| Plural nouns for collections | `/api/v1/users` | `/api/v1/user` |
| Kebab-case for multi-word | `/api/v1/order-items` | `/api/v1/orderItems` |
| Versioned prefix | `/api/v1/` | `/api/` |
| No verbs in paths | `/api/v1/users/{id}` | `/api/v1/getUser` |
| Nested for ownership | `/api/v1/users/{id}/orders` | `/api/v1/orders?userId=` |

---

## STEP 2 - HTTP Method Semantics

| Method | Use For | Success Code | Body |
|--------|---------|--------------|------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |

| 1.2     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| GET | Read resource(s) | 200 | Response only |
| POST | Create new resource | 201 | Request + Response |
| PUT | Replace full resource | 200 | Request + Response |
| PATCH | Partial update | 200 | Request + Response |
| DELETE | Remove resource | 204 | None |

---

## STEP 3 - Request / Response Structure

**Paginated list response:**
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}
```

**Single resource response:**
```json
{
  "data": { }
}
```

**Filtering:** Use query params - `/api/v1/users?status=active&role=admin`
**Sorting:** `/api/v1/users?sortBy=createdAt&sortOrder=desc`

---

## STEP 4 - Error Response Format (RFC 7807)

All errors return this structure:
```json
{
  "type": "https://tools.ietf.org/html/rfc7807",
  "title": "Validation Failed",
  "status": 422,
  "detail": "One or more fields failed validation.",
  "instance": "/api/v1/users",
  "errors": {
    "email": ["Email is required.", "Email must be a valid address."]
  }
}
```

| HTTP Status | When to Use |
|-------------|-------------|
| 400 | Bad request - malformed JSON or missing required fields |
| 401 | Not authenticated |
| 403 | Authenticated but not authorised |
| 404 | Resource not found |
| 409 | Conflict - duplicate or state mismatch |
| 422 | Validation failed |
| 500 | Unexpected server error (never expose stack trace) |

---

## STEP 5 - Authentication

| Pattern | When to Use |
|---------|-------------|
| Bearer JWT in `Authorization` header | Default for SPA / mobile clients |
| API Key in `X-Api-Key` header | Machine-to-machine / third-party integrations |
| OAuth 2.0 (Auth Code flow) | When acting on behalf of a user via external app |

Token expiry: access token 15 min - refresh token 7 days.

---

## STEP 6 - OpenAPI 3.0 Spec Template

`docs/openapi.yaml`:
```yaml
openapi: "3.0.3"
info:
  title: "[Project Name] API"
  version: "1.0.0"
  description: "API for [project purpose]"
servers:
  - url: https://api.example.com/api/v1
    description: Production
  - url: https://staging-api.example.com/api/v1
    description: Staging

security:
  - bearerAuth: []

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

paths:
  /users:
    get:
      summary: List users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: pageSize
          in: query
          schema:
            type: integer
            default: 20
      responses:
        "200":
          description: Paginated user list
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/UserListResponse"
        "401":
          description: Unauthorised

components:
  schemas:
    UserListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/User"
        pagination:
          $ref: "#/components/schemas/Pagination"
```

---

## STEP 7 - Breaking vs Non-Breaking Changes

| Change | Breaking? | Action |
|--------|-----------|--------|
| Add optional request field | No | Ship without version bump |
| Add response field | No | Ship without version bump |
| Remove request field | Yes | New API version (`/v2/`) |
| Remove response field | Yes | New API version |
| Change field type | Yes | New API version |
| Rename endpoint | Yes | New API version + 301 redirect from old |

---

## OUTPUT

`docs/API-DESIGN.md` - conventions, error format, auth pattern, breaking change policy.
`docs/openapi.yaml` - OpenAPI 3.0 spec ready for Swagger UI.
## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.
## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).
- **v1.2** (2026-05-21): Added phase/stage done-summary contract for concise boundary summaries and final run summary
- **v1.1** (2026-05-20): Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards

