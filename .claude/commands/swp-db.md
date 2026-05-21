---
name: swp-db
description: |
  Legacy compatibility wrapper for DB-only Phase 2B design. Prefer /swp-design in DB_ONLY or FULL_PHASE2 mode for all new work.
  Use only when an older PATH CONFIRMED flow explicitly calls /swp-db and cannot yet be updated.
  For new work, /swp-design owns SQL database architecture, schemas, tables, relationships, stored procedure/function plan, migration strategy, security review, and approval gating.
  Outputs: docs/DB-DESIGN.md, updated ENTITIES.md, SP/function stub files, migration plan, and BREAKDOWN/SRS updates after approval.
  Prerequisite: Run /swp-design unless split compatibility is required by an older locked flow.
compatibility: SQL Server, PostgreSQL
---

Command  : /swp-db
Version  : 2.13
Updated  : 2026-05-21

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

Final output must include a `RUN SUMMARY` with the same fields. If a phase/stage is skipped, say `Skipped` with reason and impact. If partially failed, show recovery status and do not mark it done.

---

## Standalone Approval Publish Contract

When this command is run outside `/swp-orchestrate`, the Phase 2B approval gate must still publish the approved work.

After the exact phrase `DB approved` is accepted, run `.claude/refs/approval-publish-contract.md` before marking Phase 2B complete or advancing to `/swp-plan`.

This standalone command must not mark Phase 2B complete unless the approval publish summary includes a pushed branch and a PR URL targeting `develop`.

---

| Version | Date       | Author  | Changes                                                                                                                                                                                             |
|---------|------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 2.13    | 2026-05-21 | KapilDev | Added standalone approval publish enforcement: commit, push, PR to develop, and manager acceptance email after DB approval |
| 2.11     | 2026-05-21 | KapilDev   | Added Skill Maturity 2.0 Contract for repo-wide command readiness consistency |

| 2.10     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 2.9     | 2026-05-20 | KapilDev | Marked /swp-db as a legacy compatibility wrapper and routed new DB-only work to /swp-design modes |
| 2.8     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 2.7     | 2026-05-18 | KapilDev  | Expanded description to match actual scope; added merged Phase 2 path note, deliverables summary, and PostgreSQL parity guidance for migrations, indexing, and security |
| 2.6     | 2026-05-18 | Zenthil | Added STEP 0 PATH CHECK  enforce PATH CONFIRMED delivery flow |
| 2.5     | 2026-05-15 | Zenthil | Phase 2 gate; ARCH-DESIGN.md + 1A prereq check; ENTITIES.md prereq; BREAKDOWN 2B mark on sign-off; 2A cross-check unlocks Phase 3 |
| 2.4     | 2026-05-13 | Zenthil | Added /swp-sync validate trigger after DB approval gate |
| 2.3     | 2026-05-13 | Zenthil | STEP 4: SRS pseudo code capture for complex SPs  check SRS N.N for existing pseudo code; record in DB-DESIGN.md; flag missing pseudo code for /swp-srs |
| 2.2     | 2026-05-13 | Zenthil | STEP 0: UPDATE MODE DETECTION  delta analysis (add/update/stale tables, patch writes); STEP 9: DOWNSTREAM IMPACT  repository gaps, SP wiring, DbContext config changes, /swp-sync shortcuts |
| 2.1     | 2026-05-13 | Zenthil | Added auto /swp-sync validate after "DB approved"                                                                                                                                                    |
| 2.0     | 2026-05-13 | Zenthil | Added: Column Naming Standards, Data Type Guidelines, Step 0 Pre-flight, cross-schema FK policy, PII classification, Temporal Table option, Lookup Table pattern, Mermaid ER diagram, Cascade Decision Framework, self-referential pattern, SP body template, Bulk SP via TVP, Dynamic Search SP, rollback/idempotency, Security & Compliance review step (Step 6), enriched ENTITIES.md, 7-dimension Go/No-Go scoring (100 pts), SP stub generation in post-approval |
| 1.1     | 2026-05-13 | Zenthil | Added Go/No-Go scored decision (520 pts) + schema conflict detection + PENDING DECISIONS matrix; extended gate vocabulary                                                                          |
| 1.0     |           | Zenthil | Initial version                                                                                                                                                                                     |

---

Design database architecture for: $ARGUMENTS
Phase 2 gate  development is BLOCKED until this review is complete and approved.

Read docs/SRS.md, the STACK CONFIRMED block, and docs/UI-DESIGN.md (if it exists) before outputting anything.
If no $ARGUMENTS provided, design the full database for ALL features in the SRS.

**Prerequisites  must exist before running this command:**
- `docs/SRS.md` with STACK CONFIRMED block (ORM + database engine identified)
- Epics and entities listed in the SRS (schemas are derived from these)

**Compatible skill chain:**
  /swp-srs  /swp-arch (Stage 1+2)  /swp-design OR /swp-ui + /swp-db  /swp-plan  /swd-start

**Approval deliverables summary:**
- `docs/DB-DESIGN.md`  approved schemas, tables, constraints, relationships, PII/security notes, and migration order
- `docs/ENTITIES.md`  enriched table registry rows
- `Database/StoredProcedures/[Schema]/` or PostgreSQL function stub files  one file per planned DB entry point
- `docs/BREAKDOWN.md`  Phase 2B status update after approval
- `docs/SRS.md`  patched database summary after approval

---

## DB OBJECT NAMING CONVENTIONS

Apply these rules to every database object in this project.

### Object-type prefixes

| Object type           | Prefix | Format                              | Example                            |
|-----------------------|--------|-------------------------------------|------------------------------------|
| 2.11     | 2026-05-21 | KapilDev   | Added Skill Maturity 2.0 Contract for repo-wide command readiness consistency |

| 2.10     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| Table                 | (none) | [Schema].[PascalCase]               | Auth.Users, Exam.Questions         |
| View                  | vw     | [Schema].vw[Entity][Qualifier]      | Auth.vwActiveUsers                 |
| Stored Procedure      | usp    | [Schema].usp[Entity][Action]        | Auth.uspUserGetById                |
| Scalar Function       | fn     | [Schema].fn[Name]                   | Core.fnCurrentTenantId             |
| Table-Valued Function | tvf    | [Schema].tvf[Entity][Qualifier]     | Exam.tvfQuestionGetByExam          |
| Trigger               | tr     | [Schema].tr[Table][Event]           | Auth.trUserAuditInsert             |
| Primary Key           | PK     | PK[TableName]                       | PKUsers                            |
| Foreign Key           | FK     | FK[Table][RefTable][Column]         | FKUsersTenantsTenantId             |
| Unique Constraint     | UQ     | UQ[Table][Column(s)]                | UQUsersEmailTenantId               |
| Check Constraint      | CK     | CK[Table][Rule]                     | CKUsersEmail                       |
| Default Constraint    | DF     | DF[Table][Column]                   | DFUsersIsDeleted                   |
| Non-clustered Index   | IX     | IX[Table][Column(s)]                | IXUsersTenantId                    |
| Clustered Index       | CIX    | CIX[Table][Column(s)]               | CIXQuestionsExamId                 |
| Sequence              | sq     | [Schema].sq[Name]                   | Core.sqTenantId                    |
| User-Defined Type     | udt    | [Schema].udt[Name]                  | Core.udtTenantId                   |
| Table Type (TVP)      | utt    | [Schema].utt[Name]                  | Core.uttIdList                     |

Rules:
- Never use the `dbo` schema  all objects belong to a named bounded-context schema.
- Every SP must use the `usp` prefix  no bare procedure names.
- Every view must use the `vw` prefix  distinguishes views from tables in queries and SSMS.
- Constraint names are always explicit  never rely on SQL Server auto-generated names.

---

### Column Naming Standards

| Pattern                        | Rule                                              | Example                        |
|--------------------------------|---------------------------------------------------|--------------------------------|
| Foreign key columns            | `[ReferencedEntity]Id`                            | `TenantId`, `CreatedBy`        |
| Boolean columns                | `Is[State]` / `Has[Thing]` / `Can[Action]`        | `IsDeleted`, `HasAttachment`   |
| Date/time columns              | `[Event]At` (UTC always)                          | `CreatedAt`, `ExpiresAt`       |
| Actor columns                  | `[Event]By`  INT FK to Auth.Users                | `CreatedBy`, `ApprovedBy`      |
| Status/type FK columns         | `[Entity]StatusId`, `[Entity]TypeId`              | `OrderStatusId`                |
| Amount/money columns           | `[Thing]Amount`  type `DECIMAL(18,4)`            | `InvoiceAmount`                |
| Count columns                  | `[Thing]Count`  type `INT`                       |`RetryCount`                    |
| Code/short-key columns         | `[Thing]Code`  NVARCHAR(50) + UQ constraint      | `ProductCode`                  |
| Display name columns           | `[Thing]Name`  NVARCHAR(200)                     | `TenantName`                   |

Column order within every table (enforce this order):
  1. `Id`                    PK
  2. `TenantId`              FK (tenant-scoped tables only)
  3. Business / domain columns (required first, nullable last)
  4. `IsDeleted`             soft delete flag
  5. `CreatedAt`, `CreatedBy`
  6. `UpdatedAt`, `UpdatedBy`

---

### Data Type Guidelines

| Use case                       | Recommended type          | Avoid                   | Reason                                     |
|--------------------------------|---------------------------|-------------------------|--------------------------------------------|
| 2.11     | 2026-05-21 | KapilDev   | Added Skill Maturity 2.0 Contract for repo-wide command readiness consistency |

| 2.10     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| Primary / surrogate key        | `INT IDENTITY(1,1)`       | GUID as PK              | Clustered index fragmentation with GUID    |
| Distributed / cross-system key | `UNIQUEIDENTIFIER` NEWSEQUENTIALID() | NEWID()    | NEWID() causes fragmentation               |
| Short text (codes, tags)       | `NVARCHAR(50)`            | `VARCHAR`               | Unicode safety for SaaS                    |
| Names, labels                  | `NVARCHAR(200)`           | `NVARCHAR(MAX)`         | Max is unindexable                         |
| Long text / HTML / JSON        | `NVARCHAR(MAX)`           | `TEXT` / `NTEXT`        | TEXT/NTEXT deprecated                      |
| Money / financial              | `DECIMAL(18,4)`           | `FLOAT`, `MONEY`        | Float has rounding errors; MONEY has fx issues |
| Flags / booleans               | `BIT NOT NULL DEFAULT 0`  | `CHAR(1)`, `TINYINT`    | BIT is semantically clear                  |
| Timestamps (always UTC)        | `DATETIME2(7)`            | `DATETIME`, `SMALLDATETIME` | DATETIME2 has sub-millisecond precision |
| Date only (no time)            | `DATE`                    | `DATETIME2`             | Avoid false time component                 |
| Enumerations / status codes    | `INT` FK  lookup table   | Magic ints inline       | Lookup table is queryable and self-documenting |
| Large binary / files           | Store path in DB; file in blob storage | `VARBINARY(MAX)` in rows | Row size / backup bloat |
| Row version / optimistic lock  | `ROWVERSION`              | manual timestamp        | SQL Server manages automatically           |

---

### PostgreSQL Variant

PostgreSQL uses different naming conventions and data types. Use this mapping when designing for PostgreSQL instead of SQL Server.

#### Type Equivalents

| Use Case | SQL Server | PostgreSQL | Notes |
|----------|------------|------------|-------|
| 2.11     | 2026-05-21 | KapilDev   | Added Skill Maturity 2.0 Contract for repo-wide command readiness consistency |

| 2.10     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| Primary key (auto-increment) | `INT IDENTITY(1,1)` | `SERIAL` or `BIGSERIAL` | SERIAL auto-increments; BIGSERIAL for large sequences |
| UUID (globally unique ID) | `UNIQUEIDENTIFIER NEWSEQUENTIALID()` | `UUID` with `pgcrypto` extension | Enable extension: `CREATE EXTENSION pgcrypto;` |
| Short text (codes, tags) | `NVARCHAR(50)` | `VARCHAR(50)` | No NVARCHAR distinction in PostgreSQL; use TEXT for unlimited |
| Names, labels | `NVARCHAR(200)` | `VARCHAR(200)` | Same; PostgreSQL supports Unicode by default |
| Long text / HTML / JSON | `NVARCHAR(MAX)` | `TEXT` | PostgreSQL TEXT is unindexable like SQL Server |
| Boolean flags | `BIT NOT NULL DEFAULT 0` | `BOOLEAN NOT NULL DEFAULT FALSE` | PostgreSQL uses TRUE/FALSE |
| Timestamps (UTC) | `DATETIME2(7) DEFAULT GETUTCDATE()` | `TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'UTC'` | PostgreSQL TIMESTAMP WITH TIME ZONE is recommended for UTC |
| Decimal / money | `DECIMAL(18,4)` | `NUMERIC(18,4)` | NUMERIC is PostgreSQL equivalent; DECIMAL is alias |
| Enumerations | `INT FK  lookup table` | `INT FK  lookup table` OR `ENUM` type (if immutable) | ENUM is simpler but less flexible than FK lookups |

#### PostgreSQL Naming Conventions

PostgreSQL naming differs from SQL Server. Apply these adjustments:

| Object type | PostgreSQL Pattern | Example | Notes |
|-------------|-------------------|---------|-------|
| 2.11     | 2026-05-21 | KapilDev   | Added Skill Maturity 2.0 Contract for repo-wide command readiness consistency |

| 2.10     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| Table | schema.snake_case | auth.refresh_tokens | PostgreSQL convention is snake_case, not PascalCase |
| Column | snake_case | is_deleted, created_at | Consistent with PostgreSQL style |
| Stored Procedure | schema.function_name() | auth.user_get_by_id(p_tenant_id INT) | PostgreSQL uses functions, not procedures |
| Sequence | schema.sq_name | core.sq_tenant_id | Same as SQL Server |
| Index | idx_[table]_[columns] | idx_users_tenant_id | PostgreSQL convention: idx_ prefix instead of IX |
| Primary Key | pk_[table] | pk_users | Same naming |
| Foreign Key | fk_[table]_[ref_table] | fk_users_tenants | Same naming |

#### PostgreSQL Migration and Deployment Notes

Use these rules when the STACK CONFIRMED block selects PostgreSQL:

- Prefer EF Core migrations or numbered SQL files exactly as with SQL Server  do not rely on manual database patching.
- Use CREATE OR REPLACE FUNCTION for function updates; avoid drop-and-recreate unless signature changes require it.
- Seed reference data with INSERT ... ON CONFLICT DO NOTHING for idempotent reruns.
- For UUID generation, confirm required extensions up front in the migration plan:
  - `CREATE EXTENSION IF NOT EXISTS pgcrypto;`
- If using `SERIAL`/`BIGSERIAL`, record the underlying sequence dependency in the migration notes.

Example seed pattern:

```sql
INSERT INTO core.statuses (id, code, name)
VALUES (1, 'active', 'Active')
ON CONFLICT (id) DO NOTHING;
```

#### PostgreSQL Indexing Notes

When designing for PostgreSQL, adapt indexing decisions as follows:

- Use `btree` for standard filter/sort columns unless a different index type is required.
- For case-insensitive search, prefer functional indexes such as:

```sql
CREATE INDEX idx_users_email_lower ON auth.users (LOWER(email));
```

- For JSON-heavy workloads, consider `GIN` indexes and document the query pattern that justifies them.
- For partial indexes, use PostgreSQL native `WHERE` predicates exactly as part of the index definition.
- If text search is required, note whether the design should use `tsvector` + `GIN` instead of SQL Server full-text search.

#### PostgreSQL Security Notes

When the database engine is PostgreSQL, confirm these additional controls:

- Application role permissions are granted explicitly on schemas, tables, and functions  never assume default `public` access.
- If row-level security is required, record whether PostgreSQL `CREATE POLICY` should be used in addition to application-layer filtering.
- Secret-bearing columns (tokens, reset values, API credentials) must still be stored hashed or encrypted  PostgreSQL is not exempt from the same rule.

#### PostgreSQL Function Example  GetById Pattern

PostgreSQL uses functions instead of procedures. Here's the equivalent of `Auth.uspUserGetById`:

```sql
CREATE OR REPLACE FUNCTION auth.user_get_by_id(
    p_tenant_id INT,
    p_user_id INT
)
RETURNS TABLE (
    id INT,
    tenant_id INT,
    email VARCHAR(200),
    is_deleted BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    created_by INT
)
LANGUAGE SQL
STABLE
AS $$
    SELECT
        u.id,
        u.tenant_id,
        u.email,
        u.is_deleted,
        u.created_at,
        u.created_by
    FROM auth.users u
    WHERE u.tenant_id = p_tenant_id
        AND u.id = p_user_id
        AND u.is_deleted = FALSE;
$$ ;

GRANT EXECUTE ON FUNCTION auth.user_get_by_id(INT, INT) TO app_role;
```

Key differences from T-SQL:
- Function signature with RETURNS TABLE
- Parameter names prefixed with `p_`
- `AS $$ ... $$` syntax (dollar-quoted string, safe for complex SQL)
- `LANGUAGE SQL` and `STABLE` (performance hint)
- GRANT EXECUTE on function

#### PostgreSQL Function Example  Insert with Transaction

PostgreSQL handles transactions similarly but syntax differs:

```sql
CREATE OR REPLACE FUNCTION auth.user_insert(
    p_tenant_id INT,
    p_email VARCHAR(200),
    p_created_by INT
)
RETURNS INT
LANGUAGE PLPGSQL
AS $$
DECLARE
    v_new_id INT;
BEGIN
    INSERT INTO auth.users (tenant_id, email, is_deleted, created_at, created_by)
    VALUES (p_tenant_id, p_email, FALSE, CURRENT_TIMESTAMP AT TIME ZONE 'UTC', p_created_by)
    RETURNING id INTO v_new_id;

    RETURN v_new_id;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to insert user: %', SQLERRM;
END;
$$ ;

GRANT EXECUTE ON FUNCTION auth.user_insert(INT, VARCHAR, INT) TO app_role;
```

Key differences:
- `RETURNS INT` for output
- `LANGUAGE PLPGSQL` for procedural logic (vs. SQL for pure SELECT)
- `DECLARE` section for variables
- `RETURNING ... INTO` instead of `SELECT SCOPE_IDENTITY()`
- `RAISE EXCEPTION` instead of `THROW`
- `CURRENT_TIMESTAMP AT TIME ZONE 'UTC'` for UTC time

---

## STEP 0  Pre-flight checklist

### PATH CHECK  enforce locked delivery flow

Read docs/SRS.md PATH CONFIRMED block.

IF PATH CONFIRMED block is missing:
   WARNING  PATH CONFIRMED not found. Run /swp-srs to lock a delivery flow.
  Proceeding without path enforcement.

IF PATH CONFIRMED found:
  Extract: Flow name, Phase 1 command, Phase 2 command(s), Phase 3 command.
  Read BREAKDOWN.md to determine which phase is next (first phase not yet marked [x]).
  Check if this command (/swp-db) matches the correct next phase command.

  IF match:
     Correct next step for [Flow Name].
    After this command completes: [next command in PATH CONFIRMED sequence]

  IF no match:
     PATH MISMATCH  [Flow Name] expects [correct command] next, not /swp-db.
    Your locked sequence: [Phase 1 command]  [Phase 2 command]  [Phase 3 command]  dev
    Run [correct command] first, then return here.
    To override: type "override path  I know what I'm doing"

---

Before designing anything, verify these conditions. Flag any failure as a BLOCKER.

  PRE-FLIGHT:
  [ ] docs/SRS.md exists and has STACK CONFIRMED block
  [ ] docs/ARCH-DESIGN.md exists  if not: STOP  run /swp-arch first (Phase 1 must be complete)
  [ ] docs/BREAKDOWN.md 1A [x] confirmed  if not: STOP  architecture not approved, run /swp-arch
  [ ] docs/ENTITIES.md exists (pre-seeded by /swp-srs)  if not: STOP  run /swp-srs first
  [ ] Database engine identified (SQL Server / PostgreSQL / etc.)
  [ ] ORM identified (EF Core / Dapper / raw SQL)
  [ ] All Epics and their entities are listed in the SRS
  [ ] Multi-tenancy strategy is confirmed (row-level TenantId / schema-per-tenant / db-per-tenant)

  If multi-tenancy = row-level TenantId:
    All tenant-scoped tables MUST have TenantId column + mandatory IX on TenantId.
    All SPs MUST accept and filter by @TenantId  no exceptions.

  If any item is unchecked: output BLOCKER and stop until resolved.

---

### UPDATE MODE DETECTION

Runs only if no BLOCKER was hit above.

Check whether `docs/DB-DESIGN.md` already exists:

  docs/DB-DESIGN.md exists : YES  UPDATE RUN | NO  FRESH RUN

**IF FRESH RUN:** skip this section. Proceed to STEP 1 with all SRS entities in scope.

**IF UPDATE RUN:**

Read `docs/DB-DESIGN.md` and `ENTITIES.md`. Note: every table that already exists, its columns,
and its SP list.

Compare against current `docs/SRS.md` and `docs/UI-DESIGN.md` (if present):

  Delta check  for each entity in SRS:
    - If table NOT in DB-DESIGN.md  entity is NEW, design this run
    - If table IS in DB-DESIGN.md but entity ACs changed, or UI-DESIGN.md shows new data fields
      for this entity  table is STALE, update columns/SPs this run
    - If table matches current SRS + UI  UNCHANGED, skip

  Stale check  for each table in DB-DESIGN.md:
    - If the entity no longer exists in SRS  flag as STALE for tech lead review
      (do NOT auto-remove  may still be referenced by foreign keys)

Output:

  UPDATE RUN DETECTED  docs/DB-DESIGN.md found
  
  Tables preserved (unchanged)    : [N]  [list names]
  Tables to ADD this run          : [N]  [list entity names]
  Tables to UPDATE this run       : [N]  [list: table name + what changed (column/SP)]
  Tables flagged stale            : [N]  [list: table + reason  confirm with tech lead before removing]
  

Scope for Steps 16: design only ADD + UPDATE tables. Skip preserved tables.

In STEP 9 (write docs/DB-DESIGN.md):
  - PATCH the existing file  append new table sections, update changed sections in-place
  - Never delete existing table definitions without explicit tech lead confirmation
  - Mark new sections: `[NEW  YYYY-MM-DD]`
  - Mark updated sections: `[UPDATED  YYYY-MM-DD  what changed]`

---

## STEP 1  Schema assignment

Map every entity to a bounded-context schema. No tables in dbo.

**Mandatory schemas (always present  do not omit):**
- `Core`  Tenants, AuditLogs, Config, lookup/reference tables
- `Auth`  Users, Roles, UserRoles, RefreshTokens, Permissions

**Cross-schema FK policy:**
- A schema MAY reference `Core.Tenants` and `Auth.Users` (infrastructure FKs).
- Feature schemas MUST NOT have FKs to other feature schemas  decouple via application layer.
- If a cross-feature FK seems necessary, flag it as a SCHEMA CONFLICT.

  SCHEMA ASSIGNMENT:
  Schema : Core
    Tables : Tenants, AuditLogs, Config (standard infra  always in Core)

  Schema : Auth
    Tables : Users, Roles, UserRoles, RefreshTokens (standard auth  always in Auth)

  Schema : [Feature]    one schema per Epic / domain
    Tables : [list every table this Epic owns]
    Why    : [one sentence on why it belongs in this schema]

Flag any entity that could belong to more than one schema:
  SCHEMA CONFLICT: [Entity]  could be [Schema A] or [Schema B]  recommendation: [which and why]

Schema proliferation rule: If you have more than 8 schemas, flag for tech lead review  over-decomposition creates JOIN complexity without bounded-context benefit.

Wait for tech lead to say "schemas confirmed" before proceeding to table design.

---

## STEP 2  Table definitions

For each confirmed table, output the full column specification.

**Table header  output for every table:**

  TABLE: [Schema].[TableName]
  Purpose        : [one sentence]
  Tenant-scoped  : Yes / No
  Soft-delete    : Yes / No
  PII columns    : [list column names that contain personal data, or None]
  Table type     : Standard / Lookup / Temporal / Join
  Est. row volume: Low (<100K) / Medium (100K10M) / High (>10M)

**Standard table column template:**

  | Column       | Type                      | Nullable | Default                              | Constraint name              | Notes                              |
  |--------------|---------------------------|----------|--------------------------------------|------------------------------|------------------------------------|
  | Id           | INT IDENTITY(1,1)         | No       |                                     | PK[TableName]                | Primary key                        |
  | TenantId     | INT                       | No       |                                     | FK[Table]TenantsTenantId     | FK  Core.Tenants.Id               |
  | [ColumnName] | [SQL type  see guidelines]| Yes/No  | [val or ]                           |                             | [purpose / FK target / index note] |
  | IsDeleted    | BIT                       | No       | DF[Table]IsDeleted = 0               |                             | Soft delete  filter all reads     |
  | CreatedAt    | DATETIME2(7)              | No       | DF[Table]CreatedAt = GETUTCDATE()    |                             | UTC always                         |
  | CreatedBy    | INT                       | No       |                                     | FK[Table]UsersCreatedBy      | FK  Auth.Users.Id                 |
  | UpdatedAt    | DATETIME2(7)              | Yes      |                                     |                             | Null until first edit              |
  | UpdatedBy    | INT                       | Yes      |                                     | FK[Table]UsersUpdatedBy      | Null until first edit              |

  Indexes:
    - IX[TableName]TenantId          : TenantId (all tenant-scoped tables, mandatory)
    - IX[TableName][Column]          : [Column]  [why: query pattern / sort / filter]
    - UQ[TableName][Column]          : UNIQUE on [Column] where uniqueness is a business rule
    - CIX[TableName][Column]         : clustered index override (only when PK is not the natural cluster key)
    - Covering index note            : IX[Table][LeadCol] INCLUDE ([col1],[col2])  use when a query hits the same 23 columns repeatedly

#### Indexing Strategy Decision Framework

For every High-volume table (>10M rows), decide on indexing strategy using the framework below. Standard tables (<100K rows) use basic indexes on filter/join columns and skip this section.

**COVERING INDEX**  Include all query columns in index leaf pages

Use when:
- SELECT queries on [Table] hit the same 35 columns repeatedly
- Query pattern example: `SELECT Email, IsDeleted, TenantId FROM Users WHERE CreatedAt > `
- Index definition: `IX[Users][CreatedAt] INCLUDE (Email, IsDeleted, TenantId)`

Benefit:
- Query can be answered from index alone (no table access needed)
- Reduces disk I/O by 3050%
- Faster query execution on High-volume tables

Risk:
- Index bloat if INCLUDE list exceeds 5 columns
- Maintenance overhead (larger index = slower inserts and updates)
- Storage cost increases with column width

**PARTIAL INDEX**  WHERE clause filters majority of rows

Use when:
- WHERE condition filters >90% of rows (archive pattern)
- Example: `Core.AuditLogs`  filter by TenantId + CreatedAt > 1 year ago
- Index definition:
  ```sql
  CREATE NONCLUSTERED INDEX IX[AuditLogs][TenantId_CreatedAt]
  ON Core.AuditLogs(TenantId, CreatedAt)
  WHERE CreatedAt > DATEADD(YEAR, -1, GETUTCDATE());
  ```

Benefit:
- Smaller index (only active data, excludes archive)
- Faster inserts on new rows
- Faster deletes of old rows
- Lower maintenance cost and fragmentation

Risk:
- Queries outside WHERE condition won't use index (acceptable if rare)
- More complex index strategy (requires index hint awareness)

**FULL-TEXT SEARCH**  Text column + dynamic keyword filtering

Use when:
- Users search by keyword in long text (>200 characters) AND performance matters
- Query pattern: `SELECT * FROM Articles WHERE title LIKE '%search%' OR body LIKE '%search%'`
- Rewrite as: `SELECT * FROM Articles WHERE CONTAINS(title, 'search') OR CONTAINS(body, 'search')`
- Requires: `CREATE FULLTEXT INDEX ON Articles(title, body)`

Benefit:
- Handles phrase search, AND/OR/NOT operators natively
- 10100x faster than LIKE for text queries on High-volume tables
- Supports weighted term ranking and proximity

Risk:
- Query syntax changes from LIKE to CONTAINS (code refactor required)
- Index update lag (eventual consistency, not instant)
- FTS index maintenance complexity (rebuild/reorganize needed periodically)
- Requires SQL Server FTS license enablement

**CLUSTERED INDEX OVERRIDE**  Override PK as natural cluster key

Use when:
- Primary key is NOT the natural access pattern
- Example: `Orders(OrderId PK, CustomerId FK)`  most queries filter by CustomerId
  - Natural cluster key: CustomerId (range queries like "get all orders for customer")
  - Current cluster: OrderId (random access by ID only)

Redefine as:
```sql
CREATE CLUSTERED INDEX CIX[Orders][CustomerId] ON Orders(CustomerId, CreatedAt);
CREATE NONCLUSTERED INDEX IX[Orders][OrderId] ON Orders(OrderId);  -- PK as nonclustered
```

Benefit:
- Range queries by CustomerId are 5070% faster (page contiguity)
- Reduces I/O for sequential scans by natural key
- Better cache locality for common queries

Risk:
- Complex implementation; verify with performance testing before deploying
- Different from standard SQL Server PK patterns (future maintainers may misunderstand)
- Foreign key lookups and inserts become more expensive
- Clustered index rebuild is longest operation in maintenance window

---

**DECISION TREE  Apply to every High-volume table (>10M rows):**

**Step 1:** Is the table High-volume (>10M rows)
  - NO  Use standard indexes on filter/join columns, skip remaining steps
  - YES  Continue to Step 2

**Step 2:** Do SELECT queries repeatedly fetch the same 35 columns
  - YES  Implement COVERING INDEX on leading filter column with INCLUDE list
  - NO  Continue to Step 3

**Step 3:** Does the WHERE condition in most queries filter >90% of rows
  - YES  Implement PARTIAL INDEX with WHERE clause
  - NO  Continue to Step 4

**Step 4:** Do users perform dynamic text search on NVARCHAR columns (>200 char)
  - YES  Implement FULL-TEXT SEARCH index + update queries to CONTAINS syntax
  - NO  Continue to Step 5

**Step 5:** Are 90% of queries filtered/joined by a column other than PK
  - YES  Consider CLUSTERED INDEX OVERRIDE; verify with performance testing first
  - NO  Standard index strategy is sufficient

---

**Recording index strategy in table definition:**

For High-volume tables, add an "Index Strategy" note:

```
Index Strategy (High-volume table):
  - Covering index: IX[Users][CreatedAt] INCLUDE (Email, IsDeleted, TenantId)
    Reason: SELECT frequently includes Email + IsDeleted with CreatedAt filter
  - Partial index: Not applicable (no 90%+ filter condition)
  - FTS: Not applicable (no text search on long fields)
  - Clustered override: Not needed (Id is natural access pattern)
```

  Constraints (explicit names  never auto-generated):
    - PK[TableName]                  : PRIMARY KEY on Id
    - FK[Table][RefTable][Column]    : [Column]  [Schema].[RefTable].[RefColumn] ON DELETE [decision  see cascade framework]
    - DF[Table][Column]              : DEFAULT value for [Column]
    - CK[Table][Rule]                : CHECK constraint  [business rule]

**Lookup / reference table pattern (for enums, status codes, types):**

  TABLE: [Schema].[EntityStatuses]    plural noun, no audit cols, no soft delete
  Purpose: Reference data for [Entity] status  immutable after seed

  | Column | Type         | Nullable | Notes                  |
  |--------|--------------|----------|------------------------|
  | Id     | TINYINT      | No       | PK  small set (<255)  |
  | Code   | NVARCHAR(50) | No       | UQ  used in app code  |
  | Name   | NVARCHAR(100)| No       | Display label          |
  | SortOrder | SMALLINT | No       | UI ordering            |

  No TenantId, IsDeleted, CreatedBy, UpdatedBy  lookup tables are global and immutable.
  Seeded in migration  never updated via SP.

**Temporal table option (system-versioned  for heavy audit requirements):**

  Add to table definition when: regulatory audit trail required, financial records, approval histories.
  Output note: TEMPORAL: Yes  add PERIOD FOR SYSTEM_TIME + history table in migration.

  Implementation note: SQL Server generates [TableName]History automatically when SYSTEM_VERSIONING = ON.
  EF Core: use .HasTemporalTable() in OnModelCreating.

#### Temporal Table Decision Framework

Use TEMPORAL (system-versioned) when ALL of these conditions are met:
-  Regulatory requirement for immutable audit trail (HIPAA, SOX, GDPR Article 5.1)
-  Financial records or approval workflows (immutable proof needed)
-  Table volume < 1M rows (history table doubles storage; performance cost)
-  Query access to history infrequent (use separate query view, not main table)

Use SOFT DELETE + AuditLog instead when:
- Business audit trail is "nice to have", not required
- High-volume table (> 10M rows, temporal history = unacceptable storage/performance cost)
- Need custom audit logic (who changed what, why) beyond system-versioning
- EF Core global query filters can enforce IsDeleted = 0 for you

Use APPEND-ONLY (immutable/event-sourced) when:
- Data is naturally immutable (Orders, Transactions, Ledger entries)
- You need event replay or temporal consistency (complex audit)
- Financial compliance requires immutable log (cannot be updated once created)
- Example: Store all Orders in separate ORDERS_ARCHIVE table, never delete/update

**Recommendation matrix:**

| Scenario | Audit Trail Type | Recommendation | Cost | Complexity |
|----------|------------------|---|---|---|
| Healthcare records (HIPAA) | Regulatory  immutable | TEMPORAL | Medium | Medium |
| Financial ledger (SOX) | Regulatory  immutable | APPEND-ONLY | Low | High |
| User profile updates | Operational  audit trail | SOFT DELETE + Log | Low | Low |
| High-volume event stream (10M+ rows) | Operational | APPEND-ONLY | Medium | Medium |
| Orders with approval workflow | Regulatory + operational | TEMPORAL or APPEND-ONLY | Medium | Medium |

---

## Data Archival & Lifecycle Strategy

For High-volume tables (>10M rows), plan data archival to prevent database bloat and backup explosion.

### Archival Decision

Archive when:
- Table is High-volume (>10M rows) with historical data
- Old data (>12 years) is rarely queried but must be retained for compliance
- Database backups are >100GB and growing weekly
- Example tables: AuditLogs, TransactionHistory, PageView events

Don't archive when:
- Data is frequently queried across all time ranges
- Compliance doesn't require retention (can soft-delete)
- Table is <1M rows (not worth the complexity)

### Archival Implementation Pattern

**Step 1: Create Archive Table**

Copy schema of production table to `Archive.[TableName]`:
- Remove audit columns (CreatedAt, CreatedBy, UpdatedAt, UpdatedBy)  archive creation date is sufficient
- Add `ArchivedAt DATETIME2(7)` column to track when data was moved

Example:

```sql
CREATE TABLE Archive.AuditLogs (
    Id INT IDENTITY(1,1),
    TenantId INT,
    EntityType NVARCHAR(100),
    EntityId INT,
    Action NVARCHAR(50),
    [Data] NVARCHAR(MAX),
    CreatedAt DATETIME2(7),  -- from original table
    ArchivedAt DATETIME2(7) DEFAULT GETUTCDATE(),  -- when moved to archive
    -- No CreatedBy, UpdatedAt, UpdatedBy
);

CREATE CLUSTERED INDEX CIX_AuditLogs_TenantId_ArchivedAt
  ON Archive.AuditLogs(TenantId, ArchivedAt);
```

**Step 2: Create Archive Job**

Monthly job to move data older than cutoff date:

```sql
CREATE OR ALTER PROCEDURE Core.uspArchiveOldData
    @TableName NVARCHAR(128),
    @ArchiveTableName NVARCHAR(128),
    @ArchiveBeforeDate DATETIME2,
    @BatchSize INT = 10000
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    DECLARE @RowsArchived INT = 0;

    BEGIN TRY
        WHILE 1=1
        BEGIN
            BEGIN TRANSACTION;

            -- Move batch of rows to archive
            INSERT INTO Archive.[${ARCHIVE_TABLE}] (...)
            SELECT TOP (@BatchSize) ...
            FROM [${TABLE}]
            WHERE CreatedAt < @ArchiveBeforeDate;

            SET @RowsArchived += @@ROWCOUNT;
            IF @@ROWCOUNT = 0 BREAK;

            -- Delete archived rows from production
            DELETE TOP (@BatchSize)
            FROM [${TABLE}]
            WHERE CreatedAt < @ArchiveBeforeDate;

            COMMIT TRANSACTION;
        END
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH

    PRINT 'Archived ' + CAST(@RowsArchived AS NVARCHAR(20)) + ' rows';
END
```

Schedule this job:
- Monthly for fast-growing tables (AuditLogs, events)
- Annually for slower-growing tables (Users, Orders)
- Run during low-traffic window (35 AM)

**Step 3: Update Query Patterns for Partition Awareness**

All queries against the table should include a CreatedAt filter for partition pruning:

 BAD  scans entire table:

```sql
SELECT * FROM Core.AuditLogs WHERE TenantId = @TenantId
```

 GOOD  partition pruning (archive query won't run):

```sql
SELECT * FROM Core.AuditLogs
WHERE TenantId = @TenantId
  AND CreatedAt >= DATEADD(YEAR, -2, GETUTCDATE())  -- only last 2 years in production
```

If users need to query historical data:

```sql
-- Query archive separately
SELECT * FROM Archive.AuditLogs
WHERE TenantId = @TenantId
  AND ArchivedAt BETWEEN @StartDate AND @EndDate
```

**Step 4: Reporting on Archive**

Create view combining production + archive for compliance/audit reports:

```sql
CREATE VIEW Core.vwAuditLogsAll AS
SELECT *, 'Production' AS [Source]
FROM Core.AuditLogs
UNION ALL
SELECT *, 'Archive' AS [Source]
FROM Archive.AuditLogs;
```

### Archival Checklist

- [ ] Archive table schema created (copy + remove audit cols + add ArchivedAt)
- [ ] Clustered index on (TenantId, ArchivedAt) for fast archive queries
- [ ] Archive job procedure created with batch processing (avoid lock explosion)
- [ ] Job scheduled (monthly/annually based on growth rate)
- [ ] Query patterns updated to include CreatedAt filter (partition pruning)
- [ ] Compliance report view created (combines production + archive)
- [ ] Documentation updated: "Data older than 24 months archived to Core.Archive[TableName]"
- [ ] Archive storage location configured (same instance / separate server / cold blob storage)

### Storage & Compliance Impact

| Scenario | Retention | Archive Rule | Savings |
|----------|-----------|--|---|
| 2.11     | 2026-05-21 | KapilDev   | Added Skill Maturity 2.0 Contract for repo-wide command readiness consistency |

| 2.10     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| AuditLogs (50M rows/year) | 7 years | Archive >24 months old | 70% production size reduction |
| TransactionHistory (100M/year) | 10 years | Archive >3 years old | 60% production size reduction |
| PageEvents (500M/year) | 1 year | Archive >30 days old | 90% production size reduction |
| UserActivity | 3 years | Archive >18 months old | 50% reduction |

---

## STEP 3  Relationships

Output an entity relationship summary, then generate a Mermaid ER diagram.

  RELATIONSHIPS:
  [Schema].[Table] 1N [Schema].[OtherTable]   via [FK column]   [description]
  [Schema].[Table] NN [Schema].[OtherTable]   via [JoinTable]   [description]
  [Schema].[Table] 11 [Schema].[OtherTable]   via [FK column]   [description  split table for wide rows]

  Many-to-many join tables (list separately):
  TABLE: [Schema].[JoinTable]
    [TableAId] INT  FK [Schema].[TableA].Id   ON DELETE CASCADE
    [TableBId] INT  FK [Schema].[TableB].Id   ON DELETE NO ACTION
    PK: ([TableAId], [TableBId])
    No audit columns  join tables record membership only.

  Self-referential (hierarchical) tables  output when a table references itself:
  TABLE: [Schema].[Categories]
    ParentId INT NULL  FK [Schema].[Categories].Id ON DELETE NO ACTION
    Note: Nullable ParentId = root node. Never CASCADE on self-referential FKs.

---

### Cascade Decision Framework

Apply this framework to every FK. Record the decision in the constraint definition.

  CASCADE:     Child record has NO independent meaning without parent.
               Example: OrderItems  Orders (item is meaningless without the order)
               Risk: Accidental mass delete  only use when parent is soft-deleted first.

  NO ACTION:   Child record can exist independently or must be reassigned.
               Example: Users  Tenants (don't delete all users when tenant is archived)
               Default choice when in doubt  safest option.

  SET NULL:    FK is nullable; child record survives but loses the reference.
               Example: Tasks.AssignedToId  Users (task persists when user is removed)

  SET DEFAULT: Rarely used  only when a sentinel/default FK value makes business sense.

  Rule: Never CASCADE on self-referential FKs. Always NO ACTION on cross-schema FKs.

---

### Mermaid ER Diagram

Output after the relationship list:

```mermaid
erDiagram
    Core_Tenants {
        int Id PK
        nvarchar TenantName
    }
    Auth_Users {
        int Id PK
        int TenantId FK
        nvarchar Email
    }
    [Schema]_[TableName] {
        int Id PK
        int TenantId FK
        [type] [ColumnName]
    }

    Core_Tenants ||--o{ Auth_Users : "has"
    Core_Tenants ||--o{ [Schema]_[TableName] : "scopes"
    Auth_Users ||--o{ [Schema]_[TableName] : "[relationship]"
```

Note: Use `[Schema]_[Table]` (underscore) in Mermaid  dots break the parser.

---

## STEP 4  Stored procedure plan

For every table, list every SP that will be needed. Follow naming: [Schema].usp[Entity][Action].

  SP PLAN:
  Schema: [Schema]
    [Schema].usp[Entity]GetById           single row by ID + TenantId filter
    [Schema].usp[Entity]GetPagedByTenant  paged list (PageNumber, PageSize, TenantId)
    [Schema].usp[Entity]Search            dynamic filtered search (see search template)
    [Schema].usp[Entity]Insert            create new row, return new ID
    [Schema].usp[Entity]Update            update mutable fields, set UpdatedAt/UpdatedBy
    [Schema].usp[Entity]Delete            soft delete: SET IsDeleted=1, UpdatedAt/UpdatedBy
    [Schema].usp[Entity]Upsert            MERGE (only if story requires upsert pattern)
    [Schema].usp[Entity]BulkInsert        TVP bulk insert (only if story requires batch)
    [Schema].usp[Entity][ReportName]      any report/dashboard query for this entity

  Total SPs: [N]

  For every SP that qualifies as complex (> 2 joins, financial logic, ranking, state machine):
    1. Read docs/SRS.md [N.N]  check if pseudo code is already documented there.
    2. Output:

       SRS PSEUDO CODE CHECK  [Schema].usp[Entity][Action]
       SRS Section : N.N  [section title]
       Reason      : [> 2 joins / financial / ranking / state machine]
       In SRS     :  PRESENT  paste the SRS pseudo code block here
                   :  MISSING  run /swp-srs and add pseudo code before writing this SP

       If  PRESENT: record the pseudo code in DB-DESIGN.md under this SP entry.
       If  MISSING: do NOT proceed with the SP body  flag for /swp-srs first.

    PSEUDO CODE NEEDED (summary):
    
     SP Name                                   Reason        In SRS
    
     [Schema].usp[Entity][Action]              [reason]      /  
    

  Parameter naming convention: @PascalCase (no p prefix). Always include @TenantId first.

---

### SP Body Template

> See `.claude/refs/swp-db-patterns.md`  full SQL Server SP body templates for INSERT, SELECT (by ID + paged), UPDATE, soft-DELETE, and search with filters.

---

## STEP 5  Migration plan

List the EF Core migrations or numbered SQL scripts required.

  MIGRATION PLAN:
  Order | Migration name                    | What it creates / changes
  1     | InitialSchema                     | Core + Auth schemas, Tenants, Users, Roles, UserRoles tables, seed default roles
  2     | [FeatureName]Schema               | [Schema] schema, [TableA], [TableB] tables, indexes, constraints
  3     | [FeatureName]LookupData           | Seed rows for lookup/reference tables
  4     | [FeatureName]StoredProcedures     | All SPs for [Schema] via MigrationBuilder.Sql (CREATE OR ALTER)
  5     | [FeatureName]TVPTypes             | Table Types (utt) required for bulk SPs

**Migration rules:**
- All SPs deployed via EF Core migration as `MigrationBuilder.Sql`  never run manually in prod.
- Alternative (no EF): numbered scripts in `./Database/Migrations/`  run by DbUp in order.
- Use `CREATE OR ALTER PROCEDURE`  idempotent by design.
- Every migration must be runnable on a clean database AND on top of previous migrations.
- Never alter a deployed migration file  add a new migration to fix issues.

**Rollback / Down migration strategy:**
- EF Core: implement `Down()` for every migration that creates tables (DROP TABLE in reverse order).
- SP migrations: Down() = `DROP PROCEDURE IF EXISTS [Schema].usp[Entity][Action]`.
- Lookup seed migrations: Down() = DELETE seed rows by Code (not Id  Id may shift).
- Document rollback order in DB-DESIGN.md under "Rollback Plan".

**Environment split:**
- Seed data migrations: wrap in `IF NOT EXISTS` checks  safe to re-run in dev without duplicates.
- Dev-only seed (test accounts, demo data): separate migration class tagged `[DevOnly]`  excluded from prod DbUp run.

---

## STEP 6  Security & Compliance review

Perform this review before scoring. Flag any item as BLOCKER or WARNING.

  SECURITY REVIEW:

  PII Inventory:
  | Table | PII Columns | Classification | Mitigation |
  |-------|------------|----------------|------------|
  | [Schema].[Table] | [col1], [col2] | Personal / Sensitive / Financial | Encrypted at rest / Masked in logs / Access restricted |

  PII rules:
  - Personal data (name, email, phone, address): flag for encryption-at-rest + access logging.
  - Sensitive data (health, financial, auth tokens): flag for column-level encryption or tokenisation.
  - No PII in log tables, audit tables, or error messages  store by UserId only.
  - GDPR / right-to-erasure: confirm soft-delete pattern is sufficient or flag for hard-delete path.

  Row-Level Security (RLS):
  - Multi-tenant row-level TenantId filtering: confirmed via SP @TenantId parameter [Yes / No]
  - Application-layer enforcement: every query goes through SP or EF global query filter [Yes / No]
  - RLS policy needed at DB layer [Yes / No  only if app-layer cannot be trusted]

  Authentication tokens:
  - RefreshTokens table: tokens stored as hash (SHA-256), not plain text [Yes / No  BLOCKER if No]
  - Token expiry column: ExpiresAt present and indexed [Yes / No]

  Principle of least privilege:
  - App connects with a dedicated low-privilege SQL login (no db_owner) [Confirm in STACK]
  - EXECUTE granted only to named app role on SPs  not to public [Yes / No]

  SECURITY SIGNAL:  CLEAR /  WARNINGS /  BLOCKERS

---

## STEP 7  ENTITIES.md rows

Output the rows to add to ENTITIES.md for each new table:

  ENTITIES.md ADDITIONS:

  ### [Schema] Schema

  | Table | Key Columns | Tenant-Scoped | Soft Delete | PII | Est. Rows | SPs | Indexes | Notes |
  |-------|-------------|---------------|-------------|-----|-----------|-----|---------|-------|
  | [Schema].[TableName] | Id, TenantId, [key cols] | Yes / No | Yes / No | Yes / No | Low/Med/High | GetById, GetPaged, Search, Insert, Update, Delete | [N] | [temporal / lookup / special note] |

---

## STEP 8  DB design output + Go/No-Go decision

  DB DESIGN REPORT
  SRS File    : docs/SRS.md
  Designed    : [today]
  Stack       : [Database + ORM from STACK CONFIRMED]

  SCHEMAS       : [N]  list each
  TABLES        : [N]  [N] tenant-scoped, [N] soft-delete, [N] lookup, [N] temporal
  PII TABLES    : [N]  [list table names]
  RELATIONSHIPS : [N]  [N] 1-to-many, [N] many-to-many, [N] self-referential
  SPs PLANNED   : [N]  [N] need pseudo code
  MIGRATIONS    : [N]  rollback defined: Yes / No

  SCHEMA GAPS (tables with no assigned schema):
    [None]  / [list any  PENDING DECISION required]

  SCHEMA CONFLICTS (entity could belong to more than one schema):
    [None]  / [list any  PENDING DECISION required]

  SECURITY SIGNAL:  CLEAR /  WARNINGS /  BLOCKERS

  
  GO / NO-GO DECISION
  

  Pre-score checklist (auto-fail if any item is unchecked):
  [ ] No tables remain in dbo schema
  [ ] All tenant-scoped tables have TenantId + IX on TenantId
  [ ] All SPs accept and filter by @TenantId
  [ ] All FK cascade decisions recorded (no unresolved cascades)
  [ ] Auth tokens stored as hash, not plain text
  [ ] No PII in audit/log columns

  Scoring dimensions (100 pts total):

  Schema assignment  all entities assigned, no gaps or conflicts     [XX / 15]
  Table definitions  columns, types, constraints, column order       [XX / 15]
  Relationships + FKs  cascade decisions made, ER diagram produced   [XX / 15]
  SP plan  all CRUD + search + bulk SPs listed, templates applied    [XX / 15]
  Migration plan  ordered, idempotent, rollback defined              [XX / 15]
  Security & Compliance  PII inventoried, RLS confirmed, tokens safe [XX / 15]
  Performance & Indexes  covering indexes, High-volume tables flagged [XX / 10]
  
  TOTAL                                                               [XX / 100]

   GO          85100   DB design is ready. Proceed to /swp-arch.
   CONDITIONAL  6084   Resolve items below before proceeding.
   NO-GO        < 60    DB design requires rework. Do not proceed.

  SIGNAL:  GO /  CONDITIONAL /  NO-GO

  If  GO:
  Run /swp-sync validate  confirm DB-DESIGN.md  SRS, UI-DESIGN.md, ARCH-DESIGN.md, and ENTITIES.md are all consistent.
  If /swp-sync reports conflicts: resolve them before proceeding to /swp-plan.

  Blockers preventing full GO (if any):
  1. [item  which step detected it  what is needed to resolve]
  2. [item]

  PENDING DECISIONS  Tech lead must resolve before "DB approved"
  
   #   Item                          Score  Decision Needed                    Reply with                                   
  
   1   [schema conflict / gap]       X    [which schema to assign to]        "resolve [entity]: [schema]"                 
   2   [FK cascade decision]         X    [CASCADE / NO ACTION / SET NULL]   "resolve [FK]: CASCADE / NO ACTION"          
   3   [PII / security blocker]      X    [encryption / masking decision]    "resolve [col]: encrypted / masked"          
   4   [SP needing pseudo code]      X    [confirm pseudo code needed]       "resolve [SP]: pseudo code in SRS"           
   5   [High-volume index strategy]  X    [covering index / FTS decision]    "resolve [table]: [index strategy]"          
   6   [cross-schema FK risk]        X    [confirm decoupling approach]      "resolve [tables]: decouple via [approach]"  
  

  [N] decisions pending. DB cannot be approved until all  items are resolved.

  OPEN QUESTIONS FOR TECH LEAD:
  1. [Any FK cascade decision]
  2. [Any table that could be in two schemas]
  3. [Any SP that needs pseudo code clarification]
  4. [Any High-volume table needing index strategy decision]
  5. [Any PII column needing encryption/masking confirmation]
  6. [Any cross-schema FK that needs decoupling approach]

  
  PHASE 1 DB GATE
  To resolve a gap      : "resolve [item]: [answer]"
  To revise a table     : "revise [table]: [feedback]"
  To defer an item      : "defer [item] to phase [N]"
  To accept risk        : "accept risk: [item]"
  To approve            : "DB approved"

  Claude will not write ENTITIES.md or proceed until "DB approved".
  

[STOP  wait for "DB approved"]

---

## STEP 9  After "DB approved"

Run the Standalone Approval Publish Contract in `.claude/refs/approval-publish-contract.md` for all commits, pushes, PR creation/update, and manager acceptance email output in this step.

1. Write the approved design to `docs/DB-DESIGN.md`:
   - Full schema assignment
   - All table definitions (columns, types, constraints)
   - Mermaid ER diagram (copy from Step 3 output)
   - Cascade decision log (every FK decision recorded)
   - PII inventory table (from Step 6)
   - Complete SP plan
   - Migration order + rollback plan

2. Update ENTITIES.md with all new table rows (append under correct schema heading, use enriched format from Step 7).

2b. Update docs/BREAKDOWN.md  mark 2B DB Design as complete:
   Find: `## Phase 2B  DB Design             [ ] pending`
   Replace with:
   `## Phase 2B  DB Design             [x] [today's date]`
   `  - Tables: [N], SPs: [N]`
   `  - Migration plan: included`
   `  - PII tables: [N] classified`

   Check if 2A (UI Design) is also [x] in BREAKDOWN.md. If both 2A and 2B are [x]:
     Find: `## Phase 3   Dev Stories           [ ] BLOCKED (requires 1A+1B+2A+2B complete)`
     Replace with: `## Phase 3   Dev Stories           [ ] READY  run /swp-plan to create dev stories`

3. Update SRS.md  patch the Database section:
   - Add schema list + table count
   - Note any deferred items by phase

4. Generate SP stub files in `./Database/StoredProcedures/[Schema]/`:
   - One `.sql` file per SP using the SP body template (skeleton only  no business logic yet)
   - File name: `usp[Entity][Action].sql`
   - These are the targets that migration scripts will deploy via `MigrationBuilder.Sql` or DbUp

5. Commit DB design:
     git add docs/DB-DESIGN.md ENTITIES.md docs/SRS.md
     git commit -m "docs(phase-2): DB architecture approved  [N] tables, [N] SPs across [N] schemas"

6. Commit SP stubs:
     git add Database/StoredProcedures/
     git commit -m "feat(phase-2): SP stubs scaffolded  [N] SPs across [N] schemas"

7. Update README.md and CHANGELOG.md  separate docs commit:

   README.md  patch Project Status section:
     Phase badge   "Phase 2  DB Architecture Approved"
     Last updated  [today]
   README.md  patch Database section:
     List schemas and key tables (names only  no column detail)
     Note PII tables and compliance status

   CHANGELOG.md  add under [Unreleased]  ### Added:
     - Phase 2 DB: [N] schemas, [N] tables, [N] stored procedures designed
     - PII inventory: [N] tables classified, security review CLEAR / WARNINGS noted

git add README.md CHANGELOG.md
git commit -m "docs(phase-2): update README and CHANGELOG  DB architecture approved"
git push origin HEAD
Create or update the PR to `develop` using `.claude/refs/approval-publish-contract.md`.

8. Run /swp-sync validate automatically:
   Call /swp-sync (MODE 1  Validate).
   Wait for SYNC VALIDATION REPORT output.
   If RESULT:  BLOCKED  resolve all conflicts before proceeding. Re-run /swp-sync.
   If RESULT:  CONSISTENT  proceed to PHASE 2 DB COMPLETE output below.

8.5. Downstream impact analysis:

   Analyse what the approved DB design implies for docs/ARCH-DESIGN.md.

     DOWNSTREAM IMPACT  DB-DESIGN.md
     
     Impact on docs/ARCH-DESIGN.md:
       New tables added (no corresponding repository in ARCH-DESIGN.md):
          None
         OR
           [N] tables need repository entries  run: /swp-arch [feature] to add
            [Table name]  needs: I[Entity]Repository interface + [Entity]Repository implementation
            [Table name]  needs: I[Entity]Repository interface + [Entity]Repository implementation

       New SPs added (not yet referenced in any service in ARCH-DESIGN.md):
          None
         OR
           [N] SPs need DI/service wiring  run: /swp-arch [feature] to add
            [Schema].usp[Entity][Action]  needs: ExecuteSpAsync call in [Entity]Repository

       Schema changes that affect EF DbContext configuration:
          None
         OR
           [list: table + what changed + which IEntityTypeConfiguration<T> file needs updating]

     Shortcuts:
       Validate consistency now  : /swp-sync validate
       Cascade feature changes   : /swp-sync [feature name]
     

9. Output:
     PHASE 2 DB COMPLETE
     Schemas       : [N]
     Tables        : [N] ([N] tenant-scoped, [N] lookup, [N] temporal)
     SPs planned   : [N] ([N] stubs generated in Database/StoredProcedures/)
     PII tables    : [N]  security review:  CLEAR /  WARNINGS
     Migrations    : [N]  rollback defined: Yes
     Next          : Run /swp-plan (once 2A UI Design is also complete  check BREAKDOWN.md)

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.13** (2026-05-21): Added standalone approval publish enforcement: commit, push, PR to develop, and manager acceptance email after DB approval.
- **v2.12** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


