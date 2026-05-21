# Spec: SRS Delivery Path Selection & Lock
**Date:** 2026-05-17  
**Status:** Awaiting review  
**Scope:** `/swp-srs` + all Phase 1–3 downstream commands

---

## 1. Problem

After `/swp-srs` is approved, developers face ambiguity about which command to run next. Three commands currently give conflicting "next step" guidance:

| Command | Says next is... |
|---|---|
| `swp-arch.md` (skill chain) | `/swp-ui + /swp-db` |
| `swp-scaffold.md` (STEP 14 output) | `/swp-ui` |
| `swp-design.md` (skill chain) | `/swp-design` |

There is also no enforcement of *methodology* choice — a team that should use Frontend First can accidentally start with Architecture First and only discover the mismatch mid-project.

---

## 2. Solution

Add a **PATH SELECTION step** at the end of `/swp-srs` (after SRS is approved and `STACK CONFIRMED` is finalised). The step:

1. **Auto-detects eligible flows** from `STACK CONFIRMED` (backend type, frontend framework, database engine, mobile flag)
2. **Shows only applicable paths** with a plain-English description of why each is powerful
3. **Requires explicit user confirmation** before locking
4. **Writes a `PATH CONFIRMED` block** to `docs/SRS.md` alongside `STACK CONFIRMED`
5. **All downstream commands read `PATH CONFIRMED`** and enforce it — wrong-order commands are blocked

No new files. No new commands. Every command already reads `docs/SRS.md`.

---

## 3. PATH CONFIRMED Block Format

Written to `docs/SRS.md` immediately after `STACK CONFIRMED`:

```
PATH CONFIRMED:
  Flow     : [Flow name — e.g. "Architecture First — Full Stack"]
  Phase 1  : /swp-arch
  Phase 2  : /swp-design                    ← or /swp-ui + /swp-db, or /swp-db only, etc.
  Phase 3  : /swp-plan
  Phase 4  : /swd-start → /swd-next → /swd-review → /swd-submit
  Locked   : [YYYY-MM-DD]
  Locked by: /swp-srs v[N]
```

The `Phase 2` line is the key variable — it changes per flow. Phase 1, 3, and 4 are fixed for all flows that have a backend.

---

## 4. Path Catalogue (all 15 flows)

Auto-filtered by STACK CONFIRMED — only eligible flows are shown to the developer.

### Stack Type 1 — Full Stack (Backend + Frontend + DB)
*Shown when: Backend ✅ + Frontend ✅ + Database ✅*

| ID | Flow Name | Phase 2 Command(s) | Why It's Powerful |
|---|---|---|---|
| 1A | Architecture First — Full Stack ⭐ | `/swp-design` | Foundation-first. Architecture locks layers and contracts before a single screen is drawn. UI and DB reviewed in one gate — no field/column mismatch. Best for enterprise, multi-tenant, regulated products. |
| 1B | Architecture First — Separate Design | `/swp-ui` → `/swp-db` | Same foundation, but UI and DB have separate approval gates. Useful when product team owns UI and DBA owns DB schema independently. |
| 1C | Frontend First | `/swp-ui` → `/swp-db` → `/swp-arch` | Screens reveal missing requirements before any code exists. Wireframes surface edge cases, role permissions, and data needs early. Architecture wraps around validated UX. Best for B2C, startups, user-research-heavy teams. |
| 1D | DB First | `/swp-db` → `/swp-arch` → `/swp-ui` | Schema outlasts every other decision. Entity model and SP contracts locked first; architecture and UI reflect data reality. Best for ERP, reporting, analytics. |
| 1E | Design System First | `/swp-design` → *(then arch)* | UI and DB co-designed before architecture. Every screen field maps to a column before a single service is planned. Best for CRUD-heavy enterprise dashboards. |

> Note: For flows 1C and 1D, Phase 1 (`/swp-arch`) runs **after** Phase 2 design. PATH CONFIRMED reflects this reordering.

---

### Stack Type 2 — Backend + DB Only (API, no frontend)
*Shown when: Backend ✅ + Database ✅ + Frontend: None*

| ID | Flow Name | Phase 2 Command(s) | Why It's Powerful |
|---|---|---|---|
| 2A | Arch First — API ⭐ | `/swp-db` | API contract is the product. Architecture locks layer structure, schema and SP contracts follow. Zero UI overhead. Best for headless APIs, integration platforms, microservices. |
| 2B | DB First — API | `/swp-db` → `/swp-arch` | Data contract is primary. Schema and indexes locked before architecture. API layer built to serve what the schema defines. Best for data platforms, event stores, reporting APIs. |

---

### Stack Type 3 — Frontend Only (SPA / BaaS / existing API)
*Shown when: Frontend ✅ + Backend: None or External*

| ID | Flow Name | Phase 2 Command(s) | Why It's Powerful |
|---|---|---|---|
| 3A | UI First — Frontend Only ⭐ | `/swp-ui` | No architecture needed. Jump straight to screen design, approve all screens, then break into stories. Fastest path for a frontend against an existing or external API. |

---

### Stack Type 4 — Mobile + Backend
*Shown when: Mobile ✅ + Backend ✅ + Database ✅*

| ID | Flow Name | Phase 2 Command(s) | Why It's Powerful |
|---|---|---|---|
| 4A | Arch First — Mobile ⭐ | `/swp-design` | Backend architecture locked first, mobile UI designed against a known API contract. Prevents building UI against assumptions the backend never agreed to. Best when backend complexity is high. |
| 4B | Mobile First | `/swp-ui` → `/swp-db` → `/swp-arch` | Mobile UX constraints — small screen, touch targets, offline states — designed first. Architecture shaped to serve those constraints. Best for consumer mobile apps. |

---

### Stack Type 5 — Mobile Only (BaaS)
*Shown when: Mobile ✅ + Backend: None or BaaS*

| ID | Flow Name | Phase 2 Command(s) | Why It's Powerful |
|---|---|---|---|
| 5A | Mobile UI First — BaaS ⭐ | `/swp-ui` | No custom architecture or DB. Design every screen first, then break into stories. Fastest path for mobile-only products using Firebase, Supabase, or Appwrite. |

---

### Stack Type 6 — Serverless / FaaS
*Shown when: Backend: Serverless (Lambda / Azure Functions / Cloud Functions)*

| ID | Flow Name | Phase 2 Command(s) | Why It's Powerful |
|---|---|---|---|
| 6A | Arch First — Serverless ⭐ | `/swp-db` | Function boundaries, triggers, and state stores defined before schema. No traditional controller layer. Best for event-sourced systems, webhook processors, async pipelines. |
| 6B | Serverless + Frontend | `/swp-design` | Serverless backend + web frontend. Architecture defines function-to-route mapping, then combined UI + DB design follows. Best for JAMstack, edge-rendered, static-site + API products. |

---

### Stack Type 7 — Microservices (multiple backends)
*Shown when: STACK CONFIRMED declares multiple backend services*

| ID | Flow Name | Phase 2 Command(s) | Why It's Powerful |
|---|---|---|---|
| 7A | Arch First — Multi-service ⭐ | `/swp-db` per service | API gateway and service boundaries defined at architecture phase. Each service runs its own DB design pass. Plan creates Epic-per-service ADO structure. Best for DDD where bounded context isolation is mandatory. |
| 7B | Contract First — Multi-service | `/swp-db` → `/swp-arch` | Inter-service contracts and event schemas agreed first. Architecture enforces those contracts. Prevents the most expensive microservice mistake: contract incompatibility discovered after deployment. |

---

## 5. PATH SELECTION Step (added to `/swp-srs`)

This step runs **after SRS approval** and **after `STACK CONFIRMED` is finalised**. It is the final step before `/swp-srs` closes.

### Detection logic

```
Read STACK CONFIRMED:
  has_backend  = Backend ≠ None AND Backend ≠ External
  has_frontend = Frontend ≠ None
  has_db       = Database ≠ None AND Database ≠ N/A
  has_mobile   = Mobile ≠ None
  is_serverless= Backend contains "Lambda" OR "Azure Functions" OR "Cloud Functions"
  is_microsvcs = multiple backend services declared

Eligible stack type(s):
  Full Stack        : has_backend AND has_frontend AND has_db AND NOT has_mobile
  API Only          : has_backend AND has_db AND NOT has_frontend AND NOT has_mobile
  Frontend Only     : has_frontend AND NOT has_backend
  Mobile + Backend  : has_mobile AND has_backend AND has_db
  Mobile Only       : has_mobile AND NOT has_backend
  Serverless        : is_serverless
  Microservices     : is_microsvcs   ← detected when Backend field contains "+" or "," (e.g. ".NET + Node.js gateway")
```

### Output format (shown to developer)

```
══════════════════════════════════════════════════════════════════
PATH SELECTION — Choose your delivery flow
══════════════════════════════════════════════════════════════════
Auto-detected from STACK CONFIRMED:
  Backend  : [value]
  Frontend : [value]
  Database : [value]
  Mobile   : [value]

Eligible flows for your stack ([Stack Type]):
──────────────────────────────────────────────────────────────────

  [N] [FLOW NAME]  [⭐ Recommended]
      Command sequence: [Phase 1] → [Phase 2] → [Phase 3] → dev

      Why this is powerful:
      [2–3 sentence description from catalogue above]

  [N+1] [FLOW NAME]
      Command sequence: [Phase 1] → [Phase 2] → [Phase 3] → dev

      Why this is powerful:
      [2–3 sentence description]

  ... (all eligible flows for this stack type)

──────────────────────────────────────────────────────────────────
Type a number to select your flow.
Type "explain [N]" for more detail on any flow.
The ⭐ flow is recommended for your stack — but you choose.
══════════════════════════════════════════════════════════════════
```

### After selection — confirmation gate

```
PATH SELECTED: [N] — [Flow Name]
Command sequence:
  Phase 1 : [command]
  Phase 2 : [command(s)]
  Phase 3 : /swp-plan
  Phase 4 : /swd-start → /swd-next → /swd-review → /swd-submit

This will be locked into docs/SRS.md as PATH CONFIRMED.
Changing it later requires re-running /swp-srs.

Type "path confirmed" to lock this in, or a different number to change.
```

### After "path confirmed" — write to SRS.md

Append to `docs/SRS.md` immediately after the `STACK CONFIRMED` block:

```
PATH CONFIRMED:
  Flow     : [Flow name]
  Phase 1  : [command — or "N/A" if flow starts with Phase 2]
  Phase 2  : [command(s)]
  Phase 3  : /swp-plan
  Phase 4  : /swd-start → /swd-next → /swd-review → /swd-submit
  Locked   : [YYYY-MM-DD]
  Locked by: /swp-srs v[N]
```

Commit:
```
git add docs/SRS.md
git commit -m "docs(phase-0): PATH CONFIRMED — [Flow Name] locked"
```

---

## 6. Downstream Enforcement

Every Phase 1–3 command adds a **PATH CHECK** at its STEP 0 / pre-flight.

### PATH CHECK pattern (all downstream commands)

```
PATH CHECK:
  Read docs/SRS.md PATH CONFIRMED block.

  IF PATH CONFIRMED block is missing:
    WARNING — PATH CONFIRMED not found. Run /swp-srs to lock a delivery flow.
    Proceeding without path enforcement.

  IF this command IS the correct next step for the locked flow:
    ✅ Correct next step for [Flow Name].
    After this: [next command in the PATH CONFIRMED sequence]

  IF this command IS NOT the correct next step:
    ❌ PATH MISMATCH — [Flow Name] expects [correct command] next, not this command.
    Your locked sequence: [Phase 1] → [Phase 2] → [Phase 3]
    Run [correct command] first, then return here.
    To override: type "override path — I know what I'm doing"
```

### Override escape hatch

If a developer types `"override path — I know what I'm doing"`, the PATH CHECK clears and the command proceeds normally. This is logged with a warning but never hard-blocks — the lock is a guide, not a prison.

---

## 7. Commands Modified

| Command | Change |
|---|---|
| `swp-srs.md` | Add PATH SELECTION step after approval — detection logic + menu + confirmation + write PATH CONFIRMED |
| `swp-arch.md` | Add PATH CHECK to STEP 0. Update skill chain line to show flow-aware next step |
| `swp-design.md` | Add PATH CHECK to STEP 0 |
| `swp-ui.md` | Add PATH CHECK to STEP 0 |
| `swp-db.md` | Add PATH CHECK to STEP 0 |
| `swp-plan.md` | Add PATH CHECK to pre-flight check #4 |
| `swp-scaffold.md` | Update STEP 14 output to show PATH CONFIRMED next step instead of hardcoded `/swp-ui` |

---

## 8. Edge Cases

| Scenario | Behaviour |
|---|---|
| PATH CONFIRMED missing (legacy SRS) | Warning shown, command proceeds without enforcement. No hard block on existing projects. |
| Developer runs wrong-order command | PATH MISMATCH error shown with correct next step. Override available. |
| Stack changes after path is locked | Re-run `/swp-srs` — PATH CONFIRMED is re-written. Downstream commands immediately enforce new path. |
| PATH CONFIRMED already exists when `/swp-srs` re-runs | PATH SELECTION step detects existing lock and outputs: "Path already locked as [Flow Name] — keep it (press Enter) or type a number to change." Requires explicit re-confirmation before overwriting. |
| Frontend First / DB First flow (Phase 1 runs after Phase 2) | PATH CONFIRMED `Phase 1` field shows the reordered command. PATH CHECK in `/swp-arch` correctly validates it is the Phase 3 step for those flows. |
| Microservices — multiple DB design passes | PATH CONFIRMED `Phase 2` line shows `/swp-db (per service)`. Each `/swp-db` call is valid. |

---

## 9. Out of Scope

- Changing the internal logic of any Phase 2 command (only pre-flight PATH CHECK is added)
- New commands or new files outside `docs/SRS.md`
- PATH CONFIRMED affecting the development phase (`/swd-*` commands) — those are story-level, not path-level
- Automated path detection without human confirmation — confirmation is always required

---

## 10. Success Criteria

- `docs/SRS.md` contains a `PATH CONFIRMED` block after every new SRS approval
- Running `/swp-arch` immediately after SRS shows "✅ Correct next step" for Arch First flows
- Running `/swp-ui` immediately after SRS for an Arch First project shows "❌ PATH MISMATCH" with the correct command
- Running `/swp-ui` immediately after SRS for a Frontend First project shows "✅ Correct next step"
- Override escape hatch works on all commands — no hard-blocking
- Legacy SRS files (no PATH CONFIRMED block) produce a warning, not a hard stop
