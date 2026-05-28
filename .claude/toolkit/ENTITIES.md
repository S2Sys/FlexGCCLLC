# ENTITIES.md — Shared Entity Registry
# Every DB table lives here. Check before creating any new table.
# Rule: if it exists here — REUSE. Never recreate.
# Updated by Claude when a new table is created. Reviewed by tech lead in PR.
# Schema rule: NO dbo tables. Every table belongs to a schema = bounded context.

---

## Schema Design

| Schema | Purpose | Who owns it |
|--------|---------|------------|
| `Core` | Shared infrastructure — Tenants, AuditLogs, Config | Platform / Tech Lead |
| `Auth` | Identity and access — Users, Roles, tokens | Auth feature |
| `[Feature]` | Domain tables per Epic — e.g. `Exam`, `Sport`, `Blog` | Feature owner |

Schema names are **PascalCase** in SQL Server, EF Core config strings, and SP names.
**Adding a new schema:** Requires tech lead approval. Add a row to the table above before creating any table in that schema.

---

## How to use

Before writing any CREATE TABLE or EF entity:
1. Search this file for the table name
2. If found → use the existing entity class — never create a new one
3. If not found → get tech lead approval → add the row here → then write CREATE TABLE
4. Update "Used By" column when a new feature accesses an existing table
5. EF Core: configure schema in OnModelCreating — never rely on dbo default

---

## Entity Registry

| Schema | Table | Entity Class | Owner | Used By | EF Configured | SP Exists | Notes |
|--------|-------|-------------|-------|---------|---------------|-----------|-------|
| Core | Tenants | Tenant | Core | All features | Yes — `Core` schema | Core.uspTenantGetById | Multi-tenant root |
| Core | AuditLogs | AuditLog | Core | All write operations | Yes — `Core` schema | Core.uspAuditLogInsert | Never update/delete |
| Auth | Users | User | Auth | Auth, features, Admin | Yes — `Auth` schema | Auth.uspUserInsert, Auth.uspUserUpsert | Soft delete via IsDeleted |
| Auth | Roles | Role | Auth | Auth | Yes — `Auth` schema | — | Seeded at startup |
| Auth | UserRoles | UserRole | Auth | Auth | Yes — `Auth` schema | — | Junction table |

---

## Shared Columns (every table in every schema must have all of these)

| Column | Type | Notes |
|--------|------|-------|
| Id | int IDENTITY(1,1) PK | Or Guid if distributed system |
| TenantId | int FK → core.Tenants | Multi-tenancy — every query MUST filter on this |
| CreatedAt | datetime2 NOT NULL DEFAULT GETUTCDATE() | UTC always — never local time |
| CreatedBy | int FK → auth.Users | |
| UpdatedAt | datetime2 NULL | NULL until first update |
| UpdatedBy | int FK → auth.Users NULL | |
| IsDeleted | bit NOT NULL DEFAULT 0 | Soft delete — never hard delete |
| DeletedAt | datetime2 NULL | |
| DeletedBy | int FK → auth.Users NULL | |

---

## EF Core Schema Configuration (required in every DbContext)

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // core schema
    modelBuilder.Entity<Tenant>().ToTable("Tenants", "Core");
    modelBuilder.Entity<AuditLog>().ToTable("AuditLogs", "Core");

    // Auth schema
    modelBuilder.Entity<User>().ToTable("Users", "Auth");
    modelBuilder.Entity<Role>().ToTable("Roles", "Auth");
    modelBuilder.Entity<UserRole>().ToTable("UserRoles", "Auth");

    // [Feature] schema — add per project
    // modelBuilder.Entity<Question>().ToTable("Questions", "Exam");
}
```

**Never** rely on default dbo schema. Always specify `.ToTable("TableName", "schema")`.

---

## SP Naming by Schema

All SPs follow `[schema].usp[Entity][Action]` — entity-first, action-last.

| Schema | Example SPs |
|--------|------------|
| Core | Core.uspTenantGetById, Core.uspAuditLogInsert |
| Auth | Auth.uspUserGetById, Auth.uspUserInsert, Auth.uspUserUpsert |
| Exam | Exam.uspQuestionInsert, Exam.uspQuestionGetPagedByExam |

SP files live in: `./Database/StoredProcedures/[Schema]/usp[Entity][Action].sql`

---

## Adding a new table

When Claude creates a new table, follow this sequence BEFORE writing CREATE TABLE:

1. Confirm schema with tech lead (which bounded context does this table belong to?)
2. Add a row to Entity Registry above
3. Add EF Core `.ToTable()` configuration to DbContext
4. Write `CREATE OR ALTER PROCEDURE [schema].[usp[Entity][Action]]` in correct subfolder
5. Write CREATE TABLE with ALL shared columns + feature-specific columns

Row format:
| [schema] | [TableName] | [EntityClass] | [OwnerFeature] | [OwnerFeature] | No | — | [Notes] |
