# DECISIONS.md — SmartWorkz Institutional Memory
# Every architectural or significant technical decision goes here.
# Updated by tech lead after every session summary.
# Read by Claude at the start of every session.

---

## Format

| # | Date | Context | Decision | Why | Alternatives Rejected |
|---|------|---------|----------|-----|----------------------|
| 1 | | | | | |

---

## Decisions Log

| # | Date | Context | Decision | Why | Alternatives Rejected |
|---|------|---------|----------|-----|----------------------|
| 1 | [Date] | ORM choice | EF Core for reads, SPs for writes | EF handles complex queries cleanly; SPs give control on writes and are auditable | Dapper only (too verbose), EF only (risky for write control) |
| 2 | [Date] | Auth strategy | JWT Bearer, 60-min expiry, refresh token in HttpOnly cookie | Stateless, scales horizontally on AWS | Session auth (state issue on EC2), OAuth only (overkill for internal) |
| 3 | [Date] | Multi-tenancy | TenantId column on every table, resolved from JWT claim | Simpler than schema-per-tenant, avoids cross-DB joins | Schema per tenant (migration complexity), separate DB per tenant (cost) |
| 4 | [Date] | Angular state | NgRx for auth/global, BehaviorSubject for feature-local | Right tool per scope — NgRx overhead not justified for simple lists | NgRx everywhere (over-engineered), plain HTTP in components (untestable) |
| 5 | [Date] | Test strategy | Unit tests only, Moq for all deps, no integration tests | Fast CI, no infra dependency, QA covers integration on staging | Integration tests (slow, fragile), E2E Cypress (too early stage) |
| 6 | 2026-05-11 | DB table organisation | Schema-based grouping: Core / Auth / [Feature] — PascalCase, no dbo | Schema = bounded context; PascalCase matches C# conventions; grants permissions at schema level; architecture visible in DB | dbo for all tables (no grouping, hard to permission), schema-per-tenant (rejected in D3) |
| 7 | 2026-05-11 | SP naming convention | [Schema].usp[Entity][Action] — PascalCase schema, entity-first, action-last, no underscores | Entity-first sorts all operations for one table together in SSMS; flat PascalCase consistent with constraint and index naming (PKUsers, FKUsersTenants); usp prefix distinguishes user SPs from system SPs | spActionEntity verb-first (scatters entity operations across name list), underscore-separated (usp_Entity_Action) rejected 2026-05-12 — flat namespace adopted throughout |
| 8 | 2026-05-11 | Raw SQL policy | Zero raw SQL strings in C# code — SP or EF LINQ only | Prevents SQL injection vectors, ensures all queries are versioned in SP files or EF migrations, auditable | Raw SQL in repositories (injection risk, not auditable), Dapper with inline SQL (readable but not versioned) |

---

## Template for new entries

| [N] | [YYYY-MM-DD] | [What problem or question prompted this] | [What was decided] | [Core reason] | [What else was considered and why rejected] |
