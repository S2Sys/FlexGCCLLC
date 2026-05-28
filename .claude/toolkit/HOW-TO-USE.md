# HOW TO USE — SmartWorkz Claude Code Toolkit
# Version 3.0 | Developer guide + scenario reference + intern onboarding — merged
# Read this first. Every developer. Every project.

---

## Who reads what — start here

| You are | Go to |
|---------|-------|
| **Intern (Day 1)** | Read §0 Intern Quick Start first, then return here |
| **New developer joining an existing project** | §0 permissions → Step 4 (Joining) → Step 5 (Daily workflow) |
| **Tech Lead starting a new project** | Step 1 prerequisites → Step 2 → Step 2.5 phase flow |
| **Adding toolkit to an existing project** | Step 2A |
| **Post-release hotfix** | Step 7A |
| **Post-release enhancement or non-critical fix** | Step 7B |
| **Post-release brand-new feature** | Step 7C |
| **Already set up, just want the daily loop** | Jump to Step 5 |

---

## § 0 — Intern Quick Start

Read this section first. Complete it before writing a single line of code.

### Reading order (Day 1 — in this exact order)

| # | File | Time | Why |
|---|------|------|-----|
| 1 | This guide (§0 only today) | 10 min | Your boundaries and the loop |
| 2 | CLAUDE.md §1–§9, §26, §27 | 30 min | The law — every word. §26 = slash commands. §27 = breakdown gate. |
| 3 | DECISIONS.md | 10 min | Decisions already made — do not re-debate |
| 4 | ENTITIES.md | 10 min | Tables that exist — check before building anything new |
| 5 | ROADMAP.md | 5 min | What we are building and when |
| 6 | This guide Step 5 (daily workflow) | 5 min | The exact loop you follow every day |

Do not skip any. Do not start coding before finishing the list.

---

### Your permissions — Week 1 and 2

#### You CAN do alone
- Pull latest from develop and create a feature branch
- Run `dotnet build` and `dotnet test`
- Open a Claude Code session and run `/swd-start` (after lead has run `/swl-start`)
- Review Claude's SCAN RESULT and show it to tech lead
- Write code after tech lead approves the SCAN RESULT
- Run `/swd-manual-testing` and paste TC proof after each subtask
- Run `/swd-review` once all subtasks are done
- Run `/swd-submit subtask` only after `/swd-review` is APPROVED
- Write test case descriptions in plain English for Claude to implement

#### You MUST ask tech lead first (or wait for lead action)
- `/swl-start` — only the tech lead runs this to assign a story
- Pushing any branch to remote
- Raising a PR
- Creating a new DB table (check ENTITIES.md, get approval on schema and name first)
- Adding a NuGet or npm package not on the approved list
- Changing CLAUDE.md, ENTITIES.md, DECISIONS.md, or PROMPTS.md
- Marking an ADO task Done in the board manually
- Continuing after 3 build errors (DISCARD is triggered — stop and tell tech lead)
- Running `/swd-submit` without `/swd-review` APPROVED — it will HARD STOP

---

### DB and SP naming — know these cold

```
Tables:   [Schema].[TableName]          Auth.Users, Exam.Questions
SPs:      [Schema].usp[Entity][Action]  Auth.uspUserGetById, Exam.uspQuestionInsert

CORRECT:  Auth.uspUserGetById           Exam.uspQuestionInsert
WRONG:    spGetUser  dbo.uspUserInsert  auth.uspUserInsert

All DB writes go through SPs — no EF inserts or raw SQL in C#.
Every query: .Where(x => x.TenantId == currentTenantId) AND .Where(x => !x.IsDeleted)
```

---

### The dev loop (reference card)

```
[LEAD — runs once per story]
0a. Tech lead: /swl-start [Story ID]
    → Validates ACs written + subtasks defined in BREAKDOWN.md
    → HARD STOP if missing — lead writes ACs/subtasks first
    → On success: story assigned, session.state written

[DEV — daily loop]
1.  Pick ADO task → move to In Progress
2.  New session → /swd-start       (picks up lead-assigned story, creates branch)
3.  Approve SCAN RESULT (tech lead confirms before any code is written)
4.  /swd-next [layer] → Claude writes ONE production file → stops
5.  Self-review built into /swd-next — Claude outputs it automatically
6.  dotnet build → fail: /swm-bug [paste error] → 3 fails: DISCARD (tell tech lead)
7.  /swd-next continues → BRANCH LIST output → you pick cases in plain English
8.  Claude writes unit tests → stops
9.  dotnet test → all green
10. /swd-manual-testing → paste TC proof for each test case → saves to docs/sessions/
11. Repeat steps 4–10 for each subtask/layer

[REVIEW GATE — after all subtasks complete]
12. /swd-review → AI maps every AC to unit test + manual proof
    → REJECTED: fix remediation checklist, re-run /swd-review
    → APPROVED: lead_approval set → /swd-submit unlocked

13. /swd-submit → GATE L (lead approval) + GATE C (tests) + GATE M (manual proof)
              → auto-runs security + N+1 + compliance + tenancy + AC traceability
              → BLOCKED: fix issues, re-run  |  APPROVED: commits + ADO Done
              → auto-detects subtask vs story from BREAKDOWN.md
14. End of day → /swd-submit → CONTEXT.md checkpoint, session summary
```

---

### Red flags — stop and tell tech lead immediately

| What you see | What to do |
|-------------|-----------|
| Claude says "I'm not sure" or "you could also…" | Stop. Ask tech lead for clarification. |
| Claude is about to install a new package | Stop. Ask if it's on the approved list. |
| Claude is about to write a file outside your subtask | Stop. Scope creep. Ask tech lead. |
| 3 build errors in a row | DISCARD TRIGGERED. Tell tech lead before anything. |
| Table name not in ENTITIES.md | Stop. Check with tech lead before creating. |
| Code touches TenantId in an unusual way | Stop. Multi-tenancy bug risk. Ask tech lead. |
| You don't understand Claude's output | Ask Claude to explain in plain English. Then ask tech lead if still unclear. |

---

### Key commands quick reference

| Command | Who | When |
|---------|-----|------|
| `/swl-start [StoryID]` | **Lead** | Before developer starts — assigns story, validates ACs |
| `/swd-start` | Dev | First thing every dev session |
| `dotnet build && dotnet test` | Dev | After every file Claude writes |
| `/swm-bug [paste error]` | Dev | When build or tests fail |
| `/swd-manual-testing` | Dev | After each subtask — paste TC proof |
| `/swd-review` | Dev | After ALL subtasks done — AI AC coverage gate |
| `/swd-submit` | Dev | After /swd-review APPROVED — auto-reviews then commits |
| `git push origin feature/[name]` | Dev | Only when tech lead says "push it" |

---

### First day checklist

- [ ] All files in the reading list read in order
- [ ] `dotnet build` passes on your clean clone
- [ ] `dotnet test` all green
- [ ] ADO board found and first task identified
- [ ] `/swd-start` tested with tech lead present
- [ ] SCAN RESULT reviewed together with tech lead
- [ ] First subtask written, built, tested, and committed

---

## Step 1 — Prerequisites (one-time per machine)

Install these before doing anything else. Run each verify line — if it errors, install that tool first.

```powershell
# ── Node.js 20 LTS (required for MCP server AND Claude Code CLI) ──────────────
node --version      # must print v20.x.x or higher
#   Not found → run this (Windows 11 built-in package manager):
#     winget install OpenJS.NodeJS.LTS
#   Then CLOSE and REOPEN PowerShell — Node adds to PATH only for new sessions.
#   No winget? Download the .msi installer from https://nodejs.org (LTS)

# ── npm (comes with Node.js) ──────────────────────────────────────────────────
npm --version       # must print 10.x.x or higher
#   Not found after installing Node.js → close and reopen PowerShell first

# ── Claude Code CLI ───────────────────────────────────────────────────────────
npm install -g @anthropic-ai/claude-code
claude --version    # should print a version number

# ── .NET SDK ──────────────────────────────────────────────────────────────────
dotnet --version    # must be 8.x.x or higher
#   Not found → https://dotnet.microsoft.com/download

# ── Angular CLI (only if project uses Angular frontend) ───────────────────────
npm install -g @angular/cli
ng version          # must be 17.x.x or higher

# ── Git ───────────────────────────────────────────────────────────────────────
git --version
#   Not found → https://git-scm.com

# ── PowerShell 7+ ─────────────────────────────────────────────────────────────
pwsh --version      # must be 7.x.x
#   Not found → https://github.com/PowerShell/PowerShell/releases
```

> **If `npm` or `node` says "not recognized" after installing Node.js:** close PowerShell completely and open a new window. Node.js adds itself to PATH only for new sessions.

---

## Step 2 — Starting a NEW project (Tech Lead only)

Do this ONCE when a new SmartWorkz product is created.

```powershell
# 1. Create the repo in Azure DevOps / GitHub
#    Repo name: sw-[product-name] e.g. sw-examprep, sw-anysport, sw-oneblog

# 2. Clone it locally
git clone https://[your-ado-org]/[project]/_git/sw-[product]
cd sw-[product]

# 3. Copy toolkit files into the project root
$tk = "..\ToolKit"   # path to your ToolKit clone

Copy-Item "$tk\.claude\toolkit\*"     .                       -Force            # protocol files → project root
Move-Item ".\BREAKDOWN.md"            ".\docs\BREAKDOWN.md"     -Force            # BREAKDOWN lives in docs/
Copy-Item "$tk\.claude\commands"      ".\.claude\commands"      -Recurse -Force   # slash commands
Copy-Item "$tk\.claude\settings.json" ".\.claude\settings.json" -Force            # permissions + hooks
Copy-Item "$tk\.claude\mcp-servers"   ".\.claude\mcp-servers"   -Recurse -Force   # ADO MCP server

# 4. Create required folders and start with SRS template
New-Item -ItemType Directory -Path docs, docs\adr, docs\sessions -Force | Out-Null
Copy-Item "$tk\.claude\templates\SRS-template.md" docs\SRS.md

# 5. Install MCP server dependencies (one-time)
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Warning "Node.js not found. Install from https://nodejs.org (LTS) then restart PowerShell."
} else {
    Push-Location .claude\mcp-servers\ado
    npm install
    Pop-Location
}

# 6. Fill in docs\SRS.md from your product requirements
notepad docs\SRS.md

# 7. Initial commit
git add .
git commit -m "chore: initialise project with SmartWorkz Claude Code Toolkit v2.1"
git push

# 8. Create develop branch
git checkout -b develop
git push -u origin develop

# Done. Repo is ready for Phase 0. Run /swp-srs to start.
```

**What was set up:**

| Written | Purpose |
|---------|---------|
| `.claude/toolkit/*` → project root | CLAUDE.md, PROMPTS.md, CONTEXT.md, DECISIONS.md, ENTITIES.md, HOW-TO-USE.md, ROADMAP.md |
| `docs/BREAKDOWN.md` | Breakdown gate artifact |
| `.claude/commands/` | 15 slash commands |
| `.claude/settings.json` | Permissions, MCP server, hooks |
| `.claude/mcp-servers/ado/` | ADO MCP server |
| `docs/SRS.md` | Blank SRS template |

---

### Step 2 alternative — Manual copy (no PowerShell required)

If you prefer File Explorer over a script:

**1. Copy the `.claude` folder**
In File Explorer, copy the entire `.claude` folder from the ToolKit repo root into the root of your new project repo.

```
ToolKit/
└── .claude/          ← copy this entire folder
    ├── commands/
    ├── mcp-servers/
    ├── settings.json
    ├── templates/
    └── toolkit/
```

**2. Copy protocol files to project root**
Inside `.claude/toolkit/`, copy these files directly to the project root (one level up from `.claude`):

```
CLAUDE.md  ENTITIES.md  DECISIONS.md  CONTEXT.md
ROADMAP.md  BREAKDOWN.md  PROMPTS.md  HOW-TO-USE.md
```

**3. Move BREAKDOWN.md into docs/**
```powershell
New-Item -ItemType Directory -Path docs, docs\adr, docs\sessions -Force | Out-Null
Move-Item ".\BREAKDOWN.md" ".\docs\BREAKDOWN.md" -Force
```

**4. Add the SRS template**
Copy `.claude\templates\SRS-template.md` → `docs\SRS.md`

**5. Install MCP server dependencies**
```powershell
# Run once — requires Node.js 20+ (winget install OpenJS.NodeJS.LTS)
Push-Location ".claude\mcp-servers\ado"
npm install
Pop-Location
```

**6. Set up ADO config (git-ignored — never commit this)**
```powershell
Copy-Item ".claude\mcp-servers\ado\ado.local.json.example" ".claude\mcp-servers\ado\ado.local.json"
notepad ".claude\mcp-servers\ado\ado.local.json"
# Fill in: ADO_PAT, ADO_ORG_URL, ADO_PROJECT
```

**7. Initial commit**
```powershell
git add .
git commit -m "chore: initialise project with SmartWorkz Claude Code Toolkit v2.1"
git push
git checkout -b develop
git push -u origin develop
```

> **Note:** The `.claude\toolkit\` files stay in `.claude\toolkit\` — they are the ToolKit source. The copies at the project root (CLAUDE.md, ENTITIES.md etc.) are the live project files that Claude reads and writes during development. Keep them separate.

---

## Step 2A — Adding toolkit to an EXISTING project (Tech Lead only)

Use when a project is already in development. Does NOT touch your existing code.

```powershell
# 1. Clone the ToolKit repo alongside your project (if not already done)
cd C:\SmartWorkz\
git clone https://[your-ado-org]/SmartWorkz/_git/ToolKit

# 2. Go to your existing project root
cd C:\SmartWorkz\sw-[your-product]

# 3. Make sure you're on develop and up to date
git checkout develop
git pull

# 4. Copy toolkit files in
$tk = "..\ToolKit"

Copy-Item "$tk\.claude\toolkit\*"     .                       -Force
Move-Item ".\BREAKDOWN.md"            ".\docs\BREAKDOWN.md"     -Force
Copy-Item "$tk\.claude\commands"      ".\.claude\commands"      -Recurse -Force
Copy-Item "$tk\.claude\settings.json" ".\.claude\settings.json" -Force
Copy-Item "$tk\.claude\mcp-servers"   ".\.claude\mcp-servers"   -Recurse -Force

# 5. Create docs folder if it doesn't exist
New-Item -ItemType Directory -Path docs, docs\adr, docs\sessions -Force | Out-Null

# 6. Install MCP server dependencies
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Warning "Node.js not found. Install from https://nodejs.org (LTS) then restart PowerShell."
} else {
    Push-Location .claude\mcp-servers\ado
    npm install
    Pop-Location
}
```

### Fill in protocol files with real project content

These need real content before any slash command will work:

**`docs/SRS.md`** — Write or paste existing requirements. STACK CONFIRMED block is mandatory:
```
STACK CONFIRMED
Backend     : .NET 8 C# / ASP.NET Core Web API
Frontend    : Angular 17 (standalone components)
Database    : SQL Server 2022
ORM         : EF Core 8 (reads) + Stored Procedures (writes)
Auth        : JWT Bearer tokens
Logging     : Serilog → CloudWatch
Tests       : xUnit + Moq (.NET) | Jest + Jasmine (Angular)
Cloud       : AWS (EC2 + RDS + S3)
Namespace   : SmartWorkz.[ProductName]
```

**`DECISIONS.md`** — List every significant architectural decision already made. Claude will not re-debate these.

**`ENTITIES.md`** — List every DB table that already exists. Claude checks this before creating any new table.

**`docs/BREAKDOWN.md`** — Set status based on where your project currently is:
- If ADO stories already exist: status `In ADO` and list them
- If not yet broken down: run `/swp-plan` after committing the SRS

```powershell
# 7. Set up ADO local config (git-ignored — never committed)
Copy-Item .claude\mcp-servers\ado\ado.local.json.example .claude\mcp-servers\ado\ado.local.json
notepad .claude\mcp-servers\ado\ado.local.json
# Fill in: ADO_PAT, ADO_ORG_URL, ADO_PROJECT

# 8. Commit the toolkit addition
git add .
git commit -m "chore: add SmartWorkz Claude Code Toolkit v2.1 to existing project"
git push origin HEAD
# Create/update Azure DevOps PR to develop before sharing the toolkit baseline

# 9. Tag the SRS
git tag SRS-v1.0
git push --tags
```

Share with the team — every developer now runs Step 2.6 (ADO MCP setup) on their machine.

**Deciding which phases to run:**

| Question | YES → Action | NO → Action |
|----------|-------------|-------------|
| Has SRS been reviewed? | Run `/swp-srs` for gap analysis | Run `/swp-srs` anyway |
| Is UI already designed? | Create `docs/UI-DESIGN.md` manually, skip `/swp-ui` | Run `/swp-ui` |
| Are DB schemas designed? | Create `docs/DB-DESIGN.md` manually + ENTITIES.md, skip `/swp-db` | Run `/swp-db` |
| Is solution already scaffolded? | Skip `/swp-arch` and `/swp-scaffold` | Run both |
| Are ADO stories already created? | Set `docs/BREAKDOWN.md` Status = "In ADO", list IDs, skip `/swp-plan` | Run `/swp-plan` |

---

## Step 2.5 — Pre-development phase flow (Tech Lead only)

This runs AFTER the repo is set up and BEFORE any developer writes code.
Each gate blocks the next — no skipping.

**Phase sequence:**

| Phase | Command | Gate | Output |
|-------|---------|------|--------|
| 0 | `/swp-validate` → `/swp-srs` | "SRS approved" | git tag SRS-vX.X + BREAKDOWN.md skeleton (all phases) |
| 1 | `/swp-arch` Stage 1 | "architecture approved" | docs/ARCH-DESIGN.md committed — BREAKDOWN §1A [x] |
| 1 | `/swp-arch` Stage 2 *(auto-continues)* | "scaffold approved" | solution scaffold committed — BREAKDOWN §1B [x] |
| 2 | `/swp-ui` *(parallel with /swp-db)* | "UI approved" | docs/UI-DESIGN.md committed — BREAKDOWN §2A [x] |
| 2 | `/swp-db` *(parallel with /swp-ui)* | "DB approved" | docs/DB-DESIGN.md + ENTITIES.md committed — BREAKDOWN §2B [x] |
| 3 | `/swp-plan` | "In ADO" | BREAKDOWN.md §3 committed → DEVELOPMENT UNLOCKED |

**Key rules:**
- Phase 1 (`/swp-arch`) must complete before Phase 2 can begin — arch sets the constraints UI and DB design within
- Phase 2 (`/swp-ui` and `/swp-db`) are independent — run in parallel or either order
- Phase 3 (`/swp-plan`) is blocked until all of §1A, §1B, §2A, §2B are `[x]` in BREAKDOWN.md
- `/swp-scaffold` is internal — it runs as Stage 2 of `/swp-arch`, not standalone

For full command details, see the **Slash command quick-reference** section below.

**Mid-project SRS changes:**

When SRS changes after Phase 0, run `/swp-sync [feature]` to classify changes (NEW/MODIFIED/REMOVED) and flag stale docs. Then follow the downstream impact flags to run design commands in update mode (patches only, no overwrites).

---

### Phase 0 — SRS Review

```
COMMAND : /swp-srs
READS   : docs/SRS.md
WRITES  : (output only until "SRS approved")
GATE    : "SRS approved"
```

Claude produces a 4-part output:
- **Part 1** — SRS gap report: STACK CONFIRMED completeness, story format + ACs, pseudo code needs, NFRs (performance, security, multi-tenancy, soft delete, pagination, audit, SEO if public-facing)
- **Part 2** — Feature gap analysis: missing features common to this type of system
- **Part 3** — Feature prioritization: MUST HAVE / GOOD TO HAVE / NICE TO HAVE
- **Part 4** — Phase development roadmap with estimated durations

Respond:
```
"resolve [item]: [answer]"              ← fix a gap
"add to SRS: [feature] — [priority]"   ← add a gap feature
"move [feature] to phase [N]"          ← adjust roadmap
"SRS approved"                         ← when all gaps resolved
```

After "SRS approved":
```
WRITES  : docs/SRS.md       → appends approved gap features as stories with ACs
COMMITS : git add docs/SRS.md
          git commit -m "docs(srs): SRS review complete — [N] gaps resolved, [N] features added"
          git tag SRS-v1.0; git push --tags

          git add README.md CHANGELOG.md
          git commit -m "docs(phase-0): update README and CHANGELOG — SRS review complete"
          git push origin HEAD
          create/update Azure DevOps PR to develop, save docs/sessions/pr-phase-0-srs-[YYYY-MM-DD].md,
          and send the manager acceptance email from .claude/refs/approval-publish-contract.md
```

---

### Phase 2 — UI/UX Design

> **Prerequisite:** Phase 1 (`/swp-arch`) must be complete — `docs/ARCH-DESIGN.md` must exist and §1A must be `[x]` in BREAKDOWN.md.
> Runs in parallel with `/swp-db` — both are independent once arch is done.

```
COMMAND : /swp-ui
READS   : docs/SRS.md + docs/ARCH-DESIGN.md (required)
WRITES  : docs/UI-PROTOTYPE.md after "screens confirmed" (HTML prototypes with mock data)
          docs/UI-DESIGN.md + BREAKDOWN §2A after "UI approved"
GATE 1  : "screens confirmed"    → triggers HTML prototype generation (STEP 1.5)
GATE 2  : "prototypes reviewed"  → triggers text wireframes (STEP 2 onward)
GATE 3  : "UI approved"          → writes docs/UI-DESIGN.md, marks BREAKDOWN §2A [x]
```

Claude produces in sequence:
1. Screen inventory (gate: "screens confirmed")
2. Self-contained HTML prototype per screen with realistic mock data saved to `docs/UI-PROTOTYPE.md` (gate: "prototypes reviewed")
3. ASCII wireframe, component hierarchy, full routing map with guards, state management plan (NgRx / Service+BehaviorSubject / Direct)

Respond: `"revise [screen name]: [feedback]"` or `"UI approved"`

After "UI approved":
```
WRITES  : docs/UI-DESIGN.md  → screen inventory, wireframes, component list, routes
          docs/BREAKDOWN.md  → §2A marked [x]
COMMITS : git add docs/UI-DESIGN.md docs/BREAKDOWN.md
          git commit -m "docs(phase-2): UI design approved — [N] screens, [N] components"

          git add README.md CHANGELOG.md
          git commit -m "docs(phase-2): update README and CHANGELOG — UI design approved"
          git push origin HEAD
          create/update Azure DevOps PR to develop, save docs/sessions/pr-phase-2-ui-[YYYY-MM-DD].md,
          and send the manager acceptance email from .claude/refs/approval-publish-contract.md
```

---

### Phase 2 — DB Architecture

> **Prerequisite:** Phase 1 (`/swp-arch`) must be complete — `docs/ARCH-DESIGN.md` and `docs/ENTITIES.md` must exist and §1A must be `[x]` in BREAKDOWN.md.
> Runs in parallel with `/swp-ui` — both are independent once arch is done.

```
COMMAND : /swp-db
READS   : docs/SRS.md + docs/ARCH-DESIGN.md (required) + docs/ENTITIES.md (required)
WRITES  : (output only until "DB approved")
GATE    : "DB approved"
```

Claude produces: schema assignment (Core / Auth / [Feature] — no dbo), full table definitions with columns/types/indexes/constraints, relationship map, SP plan ([Schema].usp[Entity][Action] for every operation), migration order, ENTITIES.md rows ready to paste.

Respond: `"revise [table name]: [feedback]"` or `"DB approved"`

After "DB approved":
```
WRITES  : docs/DB-DESIGN.md  → schemas, full table definitions, SP list, migration plan
          ENTITIES.md          → new rows for every table
          docs/BREAKDOWN.md  → §2B marked [x]
COMMITS : git add docs/DB-DESIGN.md ENTITIES.md docs/BREAKDOWN.md
          git commit -m "docs(phase-2): DB architecture approved — [N] tables, [N] SPs"

          git add README.md CHANGELOG.md
          git commit -m "docs(phase-2): update README and CHANGELOG — DB architecture approved"
          git push origin HEAD
          create/update Azure DevOps PR to develop, save docs/sessions/pr-phase-2-db-[YYYY-MM-DD].md,
          and send the manager acceptance email from .claude/refs/approval-publish-contract.md
```

#### How DB schemas are deployed

The toolkit uses **EF Core migrations** to deploy every DB object in the correct order. No SQL scripts are ever run manually.

**Deployment sequence — one migration per concern:**

```
Migration 1: InitialSchema
  → CREATE SCHEMA [Core]
  → CREATE SCHEMA [Auth]
  → CREATE TABLE Core.Tenants (...)
  → CREATE TABLE Auth.Users (...)
  → CREATE TABLE Auth.Roles (...)
  → CREATE TABLE Auth.UserRoles (...)

Migration 2: [FeatureName]Schema
  → CREATE SCHEMA [Feature]            ← e.g. CREATE SCHEMA [Exam]
  → CREATE TABLE Exam.Questions (...)
  → CREATE TABLE Exam.Exams (...)

Migration 3: [FeatureName]StoredProcedures
  → CREATE OR ALTER PROCEDURE Exam.uspQuestionInsert ...
  → CREATE OR ALTER PROCEDURE Exam.uspQuestionGetById ...
  → (one MigrationBuilder.Sql() call per SP)

Migration 4: [FeatureName]SeedData     ← only if needed
  → INSERT default roles, lookup values, seed tenants
```

**How schemas are created in C#:**
```csharp
// Inside Up() of InitialSchema migration
migrationBuilder.Sql("CREATE SCHEMA [Core]");
migrationBuilder.Sql("CREATE SCHEMA [Auth]");

migrationBuilder.CreateTable(
    name: "Users",
    schema: "Auth",           // ← always schema-qualified
    columns: table => new { ... });
```

**How SPs are deployed in C#:**
```csharp
// Inside Up() of ExamStoredProcedures migration
migrationBuilder.Sql(@"
    CREATE OR ALTER PROCEDURE [Exam].[uspQuestionInsert]
        @TenantId  INT,
        @ExamId    INT,
        @Text      NVARCHAR(2000)
    AS
    BEGIN
        SET NOCOUNT ON;
        INSERT INTO Exam.Questions (TenantId, ExamId, Text, CreatedAt, IsDeleted)
        VALUES (@TenantId, @ExamId, @Text, GETUTCDATE(), 0);
        SELECT SCOPE_IDENTITY() AS NewId;
    END");
```

**How to run migrations:**
```powershell
# Apply all pending migrations to local dev DB
dotnet ef database update --project [Product].Infrastructure --startup-project [Product].API

# Preview what SQL will run (safe — does not execute)
dotnet ef migrations script --project [Product].Infrastructure --startup-project [Product].API
```

**Permissions — one grant per schema, not per table:**
```sql
-- Run once after schema is created (add to seed migration)
GRANT EXECUTE ON SCHEMA::[Exam] TO [AppUser];
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::[Exam] TO [AppUser];
```

**Rules Claude enforces:**
- Never `DROP` and `CREATE` a SP — always `CREATE OR ALTER` (safe for production)
- Never run migration SQL manually — always through `dotnet ef database update`
- `Down()` method on SP migrations: `DROP PROCEDURE IF EXISTS` (so rollback works)
- Each feature's tables and SPs go in a separate migration from Core/Auth

---

### Phase 1 — Architecture + Scaffold (two-stage, one command)

> **Prerequisite:** Phase 0 (`/swp-srs`) must be complete — `docs/SRS.md` approved and BREAKDOWN.md skeleton created.
> This is the only phase that must complete before UI and DB design can begin.

```
COMMAND : /swp-arch
READS   : docs/SRS.md + docs/ENTITIES.md (if exists)
NOTE    : UI-DESIGN.md and DB-DESIGN.md are NOT required — arch comes first
GATE 1  : "architecture approved"  (Stage 1 — design)
GATE 2  : "scaffold approved"      (Stage 2 — build)
```

**Stage 1 — Architecture design:**
Claude produces: solution structure (every .NET project), dependency graph, folder structure per project, base class and interface inventory (exceptions, ErrorCodes, IRepository, IUnitOfWork), middleware pipeline order, Angular workspace structure (if frontend in SRS), DI registration plan.

Respond: `"revise [section]: [feedback]"` or `"architecture approved"`

After "architecture approved": Claude auto-continues to Stage 2.
```
WRITES  : docs/ARCH-DESIGN.md  → solution structure, DI plan, folder layout, base class list
          docs/BREAKDOWN.md    → §1A marked [x]
COMMITS : git add docs/ARCH-DESIGN.md docs/BREAKDOWN.md
          git commit -m "docs(phase-1): architecture approved — [N] projects, base classes defined"
          → then auto-continues to Stage 2
```

**Stage 2 — Scaffold:**
Claude runs the full scaffold: `dotnet new sln` + projects, `dotnet sln add`, `dotnet add reference`, `dotnet add package` (SRS approved list only), then creates all base files (Domain exceptions, ErrorCodes, ErrorResponse, PagedResult, IRepository, IUnitOfWork, AppDbContext, GlobalExceptionMiddleware, CorrelationIdMiddleware, Program.cs), scaffolds Angular workspace if in SRS, then runs `dotnet build`.

If build fails: `/swm-bug [paste error]` — fix only, no scope expansion.

Respond: `"scaffold approved"` once build is green.

> **Do not run `/swp-scaffold` standalone** — it is called internally by `/swp-arch` Stage 2.

```
COMMITS : git add --all -- ':!README.md' ':!CHANGELOG.md'
          git commit -m "chore(phase-1): scaffold solution — [N] projects, base classes, clean build"
          → BREAKDOWN.md §1B marked [x]
          git add README.md CHANGELOG.md docs/BREAKDOWN.md
          git commit -m "docs(phase-1): update README and CHANGELOG — solution scaffold complete"
          git push origin HEAD
          create/update Azure DevOps PR to develop, save docs/sessions/pr-phase-1-scaffold-[YYYY-MM-DD].md,
          and send the manager acceptance email from .claude/refs/approval-publish-contract.md
```

After scaffold approved: `/swp-ui` and `/swp-db` are now unblocked and can run in parallel.

---

### Phase 3 — SRS Breakdown → ADO

```
COMMAND : /swp-plan
READS   : docs/SRS.md, docs/BREAKDOWN.md (Status: Draft)
WRITES  : Level 5: docs/BREAKDOWN.md → full hierarchy with ADO IDs
GATE    : docs/BREAKDOWN.md Status = "In ADO" and committed → development unlocked
```

5-level approval flow:
- **Level 1:** Epic list → `"epics approved"`
- **Level 2:** Stories + ACs → `"stories approved"`
- **Level 3:** Tasks per layer → `"tasks approved"`
- **Level 4:** Subtasks → `"subtasks approved"`
- **Level 5:** Claude writes `docs/BREAKDOWN.md` + calls `ado_bulk_create` → all Epics/Stories/Tasks created in ADO in one call → ADO IDs written back to `docs/BREAKDOWN.md` → Status = "In ADO"

```
COMMITS : git add docs/BREAKDOWN.md
          git commit -m "chore: SRS breakdown complete — [N] Epics, [N] Stories in ADO"

          git add README.md CHANGELOG.md
          git commit -m "docs(phase-3): update README and CHANGELOG — ADO board setup complete"
          git push origin HEAD
          create/update Azure DevOps PR to develop, save docs/sessions/pr-phase-3-breakdown-[YYYY-MM-DD].md,
          and send the manager acceptance email from .claude/refs/approval-publish-contract.md
```

Once `docs/BREAKDOWN.md` Status = "In ADO" and committed: developers can pick stories from the ADO board.

---

## Step 2.6 — ADO MCP Server setup (every developer, one-time)

```powershell
# 0. Verify Node.js is installed
node --version   # must print v20.x.x or higher
#   Not found → install from https://nodejs.org (LTS) then RESTART PowerShell

# 1. Install MCP server dependencies (one-time per clone)
Push-Location .claude\mcp-servers\ado
npm install
Pop-Location

# 2. Create per-project local config (git-ignored — never committed)
Copy-Item .claude\mcp-servers\ado\ado.local.json.example .claude\mcp-servers\ado\ado.local.json
```

Edit `.claude\mcp-servers\ado\ado.local.json`:
```json
{
  "ADO_PAT":     "your-personal-access-token",
  "ADO_ORG_URL": "https://dev.azure.com/your-org",
  "ADO_PROJECT": "YourProjectName"
}
```

**ADO PAT scopes required:** Work Items → Read & Write

The MCP server starts automatically when you open Claude Code (registered in `.claude/settings.json`).
Available tools: `ado_bulk_create`, `ado_create_epic`, `ado_create_story`, `ado_create_task`, `ado_update_item` (state + title + description + acceptance_criteria + comment), `ado_get_item`, `ado_query_items`.

**Why a local file instead of env vars?** Each project clone has its own `ado.local.json`. If you work on ExamPrep and AnySport on the same machine, each points to the correct ADO project — no env var conflicts, no terminal restarts when switching projects.

---

## Step 3 — Getting and updating the toolkit

```powershell
# Clone the toolkit alongside your project repos
cd C:\SmartWorkz\
git clone https://[your-ado-org]/SmartWorkz/_git/ToolKit

# Expected folder structure:
# C:\SmartWorkz\
#   ToolKit\       ← the toolkit
#   sw-examprep\   ← project repo
#   sw-anysport\   ← project repo
```

**Updating the toolkit** — when the tech lead updates toolkit files:

```powershell
cd C:\SmartWorkz\ToolKit
git pull

cd C:\SmartWorkz\sw-examprep
Copy-Item "..\ToolKit\.claude\toolkit\*"     .                         -Force
Move-Item ".\BREAKDOWN.md"                   ".\docs\BREAKDOWN.md"     -Force
Copy-Item "..\ToolKit\.claude\commands"      ".\.claude\commands"      -Recurse -Force
Copy-Item "..\ToolKit\.claude\settings.json" ".\.claude\settings.json" -Force
Copy-Item "..\ToolKit\.claude\mcp-servers"   ".\.claude\mcp-servers"   -Recurse -Force

# Commit the update (in Claude Code):
/swd-submit subtask
# Message: "chore: update toolkit to ToolKit latest"
```

---

## Step 4 — Joining an existing project (new developer)

```powershell
# 1. Clone the project repo
git clone https://[your-ado-org]/[project]/_git/sw-[product]
cd sw-[product]

# 2. Checkout develop branch
git checkout develop
git pull

# 3. Read these files IN THIS ORDER before writing any code:
#    a. HOW-TO-USE.md      ← you are here
#    b. CLAUDE.md          ← the law. All 27 sections.
#    c. DECISIONS.md       ← decisions already made. Do not re-debate.
#    d. ENTITIES.md        ← DB tables that exist. Never recreate.
#    e. docs/BREAKDOWN.md  ← current sprint stories and ADO task IDs
#    f. README.md          ← current project state and setup steps

# 4. Set up local environment
cp appsettings.example.json appsettings.local.json
# Fill in your local DB connection string and JWT secret
# appsettings.local.json is in .gitignore — never commit it

# 5. Run the build
dotnet build
dotnet test
cd frontend && npm install && ng build

# 6. Verify /health endpoint
dotnet run --project src/[Product].API
# Open: https://localhost:5001/health — should return: {"status":"Healthy"}

# 7. Set up ADO MCP (Step 2.6 above)

# 8. You are ready to pick a task from the ADO board
```

---

## Step 5 — Daily development workflow

Every working day, follow this exact sequence.

### Enforcement gates — hard blocks you cannot bypass

| Gate | Fires when | Blocks | How to clear |
|------|-----------|--------|--------------|
| A | Writing .cs/.ts/.sql/.py/.go file | Code write without active story | Run `/swd-start [Story ID]` first |
| C | Every `/swd-submit` call | Committing without test confirmation | Run tests → say "tests passed" |
| D | Any `git commit` from Claude | Committing without going through `/swd-submit` | Run `/swd-submit` — never `git commit` directly |
| D (terminal) | Any `git commit` from terminal/IDE | Bypassing workflow from outside Claude | Run `/swd-submit` in Claude Code session |
| E | Claude session end | Ending session without `/swd-submit` | Run `/swd-submit` to write CONTEXT.md |
| 2 | Every `/swd-start` call | Starting work on invalid/Done ADO story | Use a To Do story ID from ADO |
| 3 | Every `/swd-start` call | Switching stories without checkpoint | Run `/swd-submit` on current story first |

### Morning start

```powershell
# 1. Pull latest from develop
git checkout develop
git pull

# 2. Pick your task from ADO board
#    Go to: dev.azure.com → [Project] → Boards
#    Pick a "To Do" task assigned to you → move to "In Progress"

# 3. Create your feature branch
git checkout -b feature/[ADO-TASK-ID]-[short-name]
# Example: git checkout -b feature/EXAM-42-question-import

# 4. Open Claude Code
claude code

# 5. Start your session
/swd-start [ADO Story ID] — [Story Title] — SRS-vX.X — subtask: [Subtask Name]
```

What `/swd-start` reads and checks:
```
READS   : CONTEXT.md (prior session state), CLAUDE.md, docs/SRS.md (STACK CONFIRMED),
          docs/BREAKDOWN.md (Status check — blocks if not "In ADO" or later),
          DECISIONS.md, ENTITIES.md, existing codebase
OUTPUT  : SCAN RESULT — files to reuse, files to create, files NOT to touch
GATE    : Claude waits for tech lead to approve SCAN RESULT before writing any code
```

---

### Subtask loop

```
For each subtask:

1. Build the layer
   /swd-start [feature name]
   Claude asks which layer: 1=Repository  2=Service  3=Endpoint  4=SP  5=Component  6=Frontend Svc
   Claude writes ONE file → stops → outputs "Run: dotnet build"

   What /swd-start writes per layer:
     Repository  : src/[Product].Infrastructure/Repositories/[Entity]Repository.cs
     Service     : src/[Product].Application/Services/[Entity]Service.cs
     Endpoint    : src/[Product].API/Controllers/[Entity]Controller.cs
                   src/[Product].Application/DTOs/[Entity]Dto.cs + Validator
     SP          : Database/StoredProcedures/[Schema]/usp[Entity][Action].sql
     Component   : src/app/[feature]/[feature].component.ts + .html + .scss
     Frontend Svc: src/app/[feature]/[feature].service.ts

2. Run the build
   dotnet build
   ✅ Passes → continue
   ❌ Fails  → /swm-bug [paste the full error]
              → 3 failures in a row → DISCARD triggered automatically

3. Write tests
   /swd-unit-test [ClassName.MethodName]
   Claude outputs BRANCH LIST first → you select which branches to cover
   You describe test cases in plain English → Claude writes xUnit + Moq code

4. Run tests
   dotnet test
   ✅ All green → continue
   ❌ Any fail  → /swm-bug [paste the error]

5. Review before commit
   /swp-audit
   ↳ CLAUDE.md compliance, OWASP security, tenant/soft-delete filters, AC traceability
   ✅ No HIGH issues → proceed
   ❌ HIGH issues    → fix each one, re-run dotnet build, then /swp-audit again

6. Commit (one command — does everything)
   /swd-submit subtask
   ↳ stages files, code commit, README patch, CHANGELOG entry,
     marks ADO task Done via MCP ado_update_item, ticks docs/BREAKDOWN.md ✅

   4 commits created:
     1. feat([TaskID]): [what was built] — AC1, AC2
     2. docs([TaskID]): update README — [what changed]
     3. docs([TaskID]): update CHANGELOG — [task title]
     4. chore([TaskID]): mark subtask complete in docs/BREAKDOWN.md

7. End of session
   /swd-submit
   ↳ OWASP security check, AC traceability, CONTEXT.md checkpoint, session summary
```

---

### PR Creation — automatic inside `/swd-submit`

**When:** After `/swd-submit subtask` commits are made and the feature branch is pushed to remote.

`/swd-submit` now generates `docs/sessions/pr-[STORY-ID]-[YYYY-MM-DD].md`, creates or updates an Azure DevOps draft PR to `develop` when Azure DevOps CLI is available, links the ADO story, and prints a manager PR acceptance email.

If the Azure DevOps CLI is unavailable, `/swd-submit` must stop with `PR CREATION BLOCKED`, print the ready-to-paste PR title/body, and wait for the developer to create the PR in the Azure DevOps UI and provide the PR URL.

**Generated PR settings**
   - **Source branch**: feature/[ADO-TASK-ID]-[short-name]
   - **Target branch**: develop
   - **Reviewers**: Assign tech lead + 1-2 peers
   - **Work items**: Link the ADO Story
   - **Auto-complete**: OFF — never merge automatically

**Generated title**
```text
feat([story-id]): [short feature description]
```

**Generated manager email**
```text
To      : [manager email or DATA GAP]
Subject : PR acceptance request - [StoryID] [Story title]

Hi [Manager Name],

The implementation for [StoryID] - [Story title] is ready for review.

PR      : [PR URL]
Target  : develop
Branch  : [source branch]
ADO     : [ADO Story URL or ID]
Summary : [one-sentence business outcome]
Testing : [test command/result] and manual proof captured in [handoff file]

Please review the PR and approve/accept it in Azure DevOps if it meets the story acceptance criteria.

Thanks,
KapilDev
```

**After approval — merge the PR**
   ```powershell
   # Option A: Merge via Azure DevOps UI
   # Click the green "Complete" button in the PR view
   # Select: "Delete feature branch after merge" ✅
   
   # Option B: Merge via command line
   git checkout develop
   git pull
   git merge feature/[name]
   git push
   ```

---

### End of story (after PR merged to develop)

```powershell
# 1. Run /swd-submit — Claude writes PR description, security check, AC traceability
# 2. Push your branch
git push origin feature/EXAM-42-question-import

# 3. Raise PR in Azure DevOps
#    From: feature/EXAM-42-question-import  →  To: develop
#    Paste Claude's PR description

# 4. Get PR reviewed and merged

# 5. After merge — update docs + mark Story Done:
/swd-submit story
# ↳ updates README features table, CHANGELOG,
#   marks all task rows ✅ and story row → Done in docs/BREAKDOWN.md,
#   marks ADO Story Done via MCP

# 6. Reset CONTEXT.md for next story
Clear-Content CONTEXT.md
git add CONTEXT.md
git commit -m "chore: reset CONTEXT.md — Story EXAM-42 complete"
git push
```

---

### Files written per subtask — summary

| File | Created | Modified | Committed by |
|------|---------|----------|--------------|
| `src/[Layer]/[Entity][Type].cs` | ✅ | — | /swd-submit subtask (commit 1) |
| `tests/[Layer]/[Class]Tests.cs` | ✅ | — | /swd-submit subtask (commit 1) |
| `README.md` | — | ✅ | /swd-submit subtask (commit 2) |
| `CHANGELOG.md` | — | ✅ | /swd-submit subtask (commit 3) |
| `CONTEXT.md` | — | ✅ | /swd-submit subtask (commit 4) |
| `docs/BREAKDOWN.md` | — | ✅ tick | /swd-submit subtask (commit 4) |

---

## Step 6 — Phase completion workflow

```
In Claude Code:
/swd-submit phase [N]
Claude asks: phase number + description of what was delivered

What /swd-submit phase does:
✅ Updates README.md — marks current phase Done, next phase In Progress
✅ Updates CHANGELOG.md — adds phase entry under [Unreleased]
✅ Commits README + CHANGELOG as a separate docs commit
```

---

## Step 7 — Release workflow

```powershell
# 1. Merge develop → release branch
git checkout -b release/v1.0.0
git merge develop

# 2. Run full test suite
dotnet test
ng test --watch=false

# 3. Create the release commit (in Claude Code):
/swd-submit release [vX.Y.Z]
# ↳ promotes CHANGELOG [Unreleased] → [vX.Y.Z], updates version badges, creates git tag
# Note: Claude creates the tag — tech lead pushes it manually to trigger the deploy pipeline

# 4. Merge release → main (triggers CI deploy pipeline)
git checkout main
git merge release/v1.0.0
git push

# 5. Merge release → develop (keep develop in sync)
git checkout develop
git merge release/v1.0.0
git push
```

---

## Step 7A — Post-release: Hotfix (production-critical bug)

**Definition:** Data loss, security vulnerability, complete feature failure, broken checkout, auth bypass.
**NOT hotfix-worthy:** Wrong label, minor UI misalignment, slow query — use Step 7B instead.

```
┌──────────────────────────────────────────────────────────────────────┐
│  main (production)                                                    │
│    └─ hotfix/[ID]-[name]  ──fix──► merge → main  ──tag──► deploy     │
│                                     └──────────► merge → develop      │
└──────────────────────────────────────────────────────────────────────┘
```

```powershell
# 1. Branch from main — NOT develop
git checkout main
git pull
git checkout -b hotfix/[ADO-ID]-[short-name]
# Example: hotfix/EXAM-99-fix-score-calculation

# 2. Start session
/swd-start [ADO Story ID] — [Bug Title] — SRS-vX.X — subtask: [fix description]
# Claude reads CONTEXT.md, CLAUDE.md, docs/SRS.md (tagged version),
# docs/BREAKDOWN.md, DECISIONS.md, ENTITIES.md
# Claude confirms files to touch and waits for approval

# 3. Build the fix (one subtask, one layer)
# RULE: fix only the failing behaviour — no refactor, no cleanup in the same commit
/swd-start [bug area]
dotnet build
dotnet test
/swm-bug [error]   # if needed

# 4. Review
/swp-audit
# ❌ Any HIGH issue → fix before continuing

# 5. Commit
/swd-submit subtask
# → code: fix([ADO-ID]): [what was fixed] — AC1
# → BREAKDOWN: chore([ADO-ID]): mark hotfix subtask complete in docs/BREAKDOWN.md
# → ADO: ado_update_item → Done

# 6. End session
/swd-submit

# 7. Merge to main, then raise/update PR back to develop
git checkout main
git merge --no-ff hotfix/[ADO-ID]-[name]
git push origin main

git checkout hotfix/[ADO-ID]-[name]
git push origin HEAD
# Create/update Azure DevOps PR from hotfix/[ADO-ID]-[name] to develop

# 8. Update docs + close ADO
/swd-submit hotfix
# ↳ adds Fixed entry to CHANGELOG [Unreleased], marks ADO task Done via MCP
```

**Everything touched in a hotfix:**

| File | Action |
|------|--------|
| `hotfix/[ID]-[name]` branch | Created |
| `src/[Layer]/[FixedFile].cs` | Modified (bug fixed) |
| `tests/[Layer]/[FixedClass]Tests.cs` | Created or modified |
| `CONTEXT.md` | Updated checkpoint |
| `docs/BREAKDOWN.md` | ✅ subtask tick |
| `CHANGELOG.md` | Fixed entry added |

**NOT touched in a hotfix:** README.md, ENTITIES.md, DECISIONS.md, docs/SRS.md, design docs.

---

## Step 7B — Post-release: Enhancement or non-critical fix

**When:** Non-urgent bug, new fields, changed logic, UI improvement — not urgent enough for a hotfix.

| Situation | Branch | /swd-submit type |
|-----------|--------|---------------|
| Critical defect (data loss, security, broken core) | `hotfix/` from `main` | `hotfix` |
| Non-critical bug in production | `feature/` from `develop` | `story` |
| Enhancing an existing feature | `feature/` from `develop` | `story` |

**Assess scope first:**

| Question | YES → do this | NO → skip |
|----------|--------------|-----------|
| Does change modify existing behaviour? | Update docs/SRS.md, new version tag, then run `/swp-sync [feature]` | — |
| Does change touch DB, UI, or arch? | Follow `/swp-sync` DOWNSTREAM IMPACT flags to patch each doc | — |
| > 1 story, > 2 days, > 1 layer? | Run `/swp-plan [feature]` — ADO UPDATE MODE patches open ADO items automatically | Add subtasks directly to docs/BREAKDOWN.md |

```powershell
# 1. Branch from develop
git checkout develop
git pull
git checkout -b feature/[ADO-ID]-[short-name]

# 2. Update SRS if behaviour is changing
git add docs/SRS.md
git commit -m "docs(srs): update SRS — [what changed]"
git tag SRS-v1.X && git push --tags

# 3. Cascade the SRS change to all downstream docs
/swp-sync [feature name]
# → classifies NEW / MODIFIED / REMOVED across entities, screens, ACs
# → DOWNSTREAM IMPACT block shows exactly which docs are stale
# → follow the flags: /swp-ui [feature], /swp-db [feature], /swp-arch [feature]

# 4. Sync ADO items — auto-detects update mode from BREAKDOWN.md
/swp-plan [feature name]
# → OPEN stories: ado_update_item patches description + ACs in place
# → CLOSED stories: ado_create_story (follow-up) + comment on closed item
# → NEW stories: ado_create_story + ado_create_task as normal

# 5. Normal daily loop
/swd-start → /swd-start → dotnet build && dotnet test → /swp-audit → /swd-submit subtask → /swd-submit

# 6. Raise PR → develop

# 7. After merge:
/swd-submit story
# ↳ updates README, CHANGELOG, docs/BREAKDOWN.md story row → Done, marks ADO Story Done
```

**Everything touched in an enhancement:**

| File | Action | When |
|------|--------|------|
| `docs/SRS.md` | Updated (revised story or new AC) | If behaviour changes |
| `docs/DB-DESIGN.md` | Updated (append only) | If DB changes |
| `ENTITIES.md` | Updated (new rows) | If DB changes |
| `docs/BREAKDOWN.md` | New stories + ✅ ticks | Mini-breakdown + daily loop |
| `src/[Layer]/[File].cs` | Modified | Daily loop |
| `tests/[Layer]/[ClassTests].cs` | Modified | Daily loop |
| `CONTEXT.md` | Updated each session | Daily loop |
| `README.md` | Features table updated | /swd-submit story |
| `CHANGELOG.md` | Added/Changed entry | /swd-submit story |

---

## Step 7C — Post-release: New feature

**When:** Adding a completely new capability — new screens, new DB tables, new logic, new Epic in the SRS.

```
Mini Phase 0 (/swp-srs) → Phase 1 (/swp-arch) → Phase 2 (/swp-ui + /swp-db) → Mini Phase 3 (/swp-plan)
→ Phase 4+ daily loop → /swd-submit epic → /swd-submit release
```

```powershell
# ── Phase 0 ──────────────────────────────────────────────────────────────────
# 1. Append new Epic section to docs/SRS.md (never rewrite the whole file)
notepad docs\SRS.md

# 2. Review the new section
/swp-srs [feature name]
# "SRS approved" → Claude commits docs/SRS.md, git tag SRS-v1.X

# ── Phase 1 (if feature needs new arch patterns) ─────────────────────────────
# 3. Architecture additions (skip if new feature fits existing patterns)
/swp-arch [feature name]
# Needed only for: new micro-service, new background job, new external integration
# "architecture approved" → Stage 2 scaffold auto-continues

# ── Phase 2 ──────────────────────────────────────────────────────────────────
# 4. Design new screens (if feature has UI)
/swp-ui [feature name]
# "UI approved" → Claude appends to docs/UI-DESIGN.md (never overwrites existing screens)

# 5. Design new DB objects
/swp-db [feature name]
# "DB approved" → Claude appends to docs/DB-DESIGN.md, appends rows to ENTITIES.md
# RULE: never modify existing tables — all changes additive

# ── Phase 3 ──────────────────────────────────────────────────────────────────
# 7. Mini-breakdown (creates new ADO items for the new Epic)
/swp-plan [feature name]
# Level 1→4 approvals → Level 5: ado_bulk_create → docs/BREAKDOWN.md → Status: In ADO
# Note: if BREAKDOWN.md already has "In ADO" items from a previous Epic,
# /swp-plan auto-detects ADO UPDATE MODE and only creates NEW items — it does not duplicate existing ones
git add docs/BREAKDOWN.md
git commit -m "chore([feature]): mini-breakdown complete — [N] Stories in ADO"
git push origin HEAD
# Create/update Azure DevOps PR to develop and send the manager acceptance email

# ── Phase 4+ ─────────────────────────────────────────────────────────────────
# 8. Normal daily loop
/swd-start → /swd-start → dotnet build && dotnet test → /swp-audit → /swd-submit subtask → /swd-submit

# 9. After all stories merged
/swd-submit epic
# ↳ updates CHANGELOG, marks epic row → Done in docs/BREAKDOWN.md, marks ADO Epic Done

# 10. Release
/swd-submit release [vX.Y.0]   # MINOR version bump for new feature
```

**What changes vs. a first-time project:**

| Step | First-time project | Adding feature to released product |
|------|-------------------|------------------------------------|
| SRS | Write from scratch | Append new Epic section only |
| DB | Full schema design | Additive only — new tables/SPs only |
| Scaffold | Full solution | Add to existing projects — no new sln |
| Breakdown | Full project | Mini-breakdown for new Epic only |
| ENTITIES.md | Start fresh | Append — never edit existing rows |
| Migrations | Create all | Additive only — never modify past migrations |
| Version bump | v0.1.0 → v1.0.0 | MINOR: v1.0.0 → v1.1.0 |

> **DB safety rule:** Never modify an existing column, rename a table, or change a stored procedure signature in a way that breaks the running app. All DB changes must be additive.

**Everything touched for a new feature:**

| File | Action |
|------|--------|
| `docs/SRS.md` | Append new Epic section |
| `docs/UI-DESIGN.md` | Append new screens |
| `docs/DB-DESIGN.md` | Append new schema section |
| `ENTITIES.md` | Append new table rows |
| `docs/ARCH-DESIGN.md` | Append if new patterns needed (optional) |
| `docs/BREAKDOWN.md` | Append new Epic/Stories/Tasks + daily ✅ ticks |
| `src/[new feature files]` | Created |
| `tests/[new feature tests]` | Created |
| `CONTEXT.md` | Updated each session |
| `README.md` | Features updated, version bumped |
| `CHANGELOG.md` | Epic closed entry + release entry |

---

## Step 8 — Updating DECISIONS.md (Tech Lead only)

```powershell
# 1. Claude outputs SESSION END SUMMARY with decisions listed
# 2. Open DECISIONS.md
notepad DECISIONS.md

# 3. Add new row: | N | Date | Context | Decision | Why | Alternatives Rejected |

# 4. Commit:
git add DECISIONS.md
git commit -m "docs(decisions): [decision summary]"
git push origin HEAD
# Create/update Azure DevOps PR to develop
```

---

## Step 9 — Updating ENTITIES.md (every developer)

```powershell
# Claude automatically outputs the ENTITIES.md row to add after any new table
# 1. Open ENTITIES.md
# 2. Add the new table row (append — never edit existing rows)
# 3. Commit as part of the story commit (not separately)
```

---

## File reference — what each file does

| File | Read by | Written by | When |
|------|---------|-----------|------|
| `CLAUDE.md` | Every Claude session start | Tech lead via PR | Architecture changes |
| `PROMPTS.md` | Fallback only — prefer slash commands | Tech lead via PR | Workflow improvements |
| `CONTEXT.md` | Every new session (if story in progress) | Claude every 10 turns + /swd-submit | During development |
| `DECISIONS.md` | Every session start | Tech lead after session | After key decisions |
| `ENTITIES.md` | Every session start + before any new table | Claude (/swp-db) + developer | Phase 2 DB design + new tables |
| `ROADMAP.md` | Sprint planning, new developer join | Tech lead | Sprint planning + story merges |
| `README.md` | New developers, stakeholders | /swd-submit (via Claude diff) | Phase/story/release |
| `CHANGELOG.md` | Stakeholders, QA, ops | /swd-submit (via Claude diff) | Phase/story/release |
| `docs/SRS.md` | Every session (tagged version) | You + Claude (/swp-srs) | SRS changes → new tag |
| `docs/BREAKDOWN.md` | Every session start | Claude (/swp-plan, /swd-submit) | Phase 3 + per subtask/story/epic |
| `docs/UI-DESIGN.md` | Before building any frontend component | Claude (/swp-ui) | Phase 2 UI approval |
| `docs/DB-DESIGN.md` | Before building any SP or migration | Claude (/swp-db) | Phase 2 DB approval |
| `docs/ARCH-DESIGN.md` | Before building any layer | Claude (/swp-arch) | Phase 1 arch approval |
| `session-start-prompt.md` | Copy-paste into Claude Code | — | Every session start |
| `commit.ps1` | Fallback only — primary is /swd-submit | — | When Claude Code unavailable |
| `ado-update.ps1` | Fallback only — primary is MCP server | — | When MCP server not configured |

---

## Slash command quick-reference

Use slash commands in Claude Code. Never copy-paste from PROMPTS.md directly.

All commands are stored in `.claude/commands/` and are scanned automatically by Claude Code on startup.

| Phase | Situation | Command | File | What it gates |
|-------|-----------|---------|------|---------------|
| 0 | Validate startup idea before writing SRS | `/swp-validate` | swp-validate.md | GO/NO-GO/CONDITIONAL + optional SRS auto-generation |
| 0 | SRS completeness — stack, stories, ACs, NFRs, gap analysis, prioritization, roadmap | `/swp-srs` | swp-srs.md | Blocks until "SRS approved" → commit + push + PR to `develop` + manager email + git tag SRS-vX.X + BREAKDOWN skeleton |
| 0–3 | Run full planning pipeline with review checkpoints per phase | `/swp-orchestrate` | swp-orchestrate.md | Orchestrates all phases 0→3 with CP1/CP2/CP3 gates per phase; after each exact approval it commits, pushes, raises/updates PR to `develop`, and prints manager acceptance email |
| 0–3 | Show current phase status from BREAKDOWN.md | `/swp-status` | swp-status.md | Dashboard: phase completion state, what's blocked, what's next |
| 1 | Solution architecture (Stage 1) + scaffold (Stage 2, auto-continues) | `/swp-arch` | swp-arch.md | Stage 1 and Stage 2 approvals each require commit + push + PR to `develop` + manager email |
| 1 | *(internal)* Scaffold solution — called by /swp-arch Stage 2 only | `/swp-scaffold` | swp-scaffold.md | Do not run standalone — use /swp-arch |
| 2 | UI/UX + DB design (two sections, one sign-off) | `/swp-design` | swp-design.md | Blocks until "design approved" → commit + push + PR to `develop` + manager email + BREAKDOWN §2A+§2B [x] |
| 2 | UI/UX design only (standalone) | `/swp-ui` | swp-ui.md | Blocks until "UI approved" → commit + push + PR to `develop` + manager email + BREAKDOWN §2A [x] |
| 2 | DB architecture only (standalone) | `/swp-db` | swp-db.md | Blocks until "DB approved" → commit + push + PR to `develop` + manager email + BREAKDOWN §2B [x] |
| 3 | SRS → Epic → Story → Task breakdown. Mid-flow: ADO UPDATE MODE patches open items, creates follow-ups for closed | `/swp-plan` | swp-plan.md | Every Level approval publishes commit + PR; development remains blocked until final ADO handoff PR to `develop` exists. |
| 4+ | Starting any development session | `/swd-start` | swd-start.md | Session sequence + docs/BREAKDOWN.md status check |
| 4+ | Writing unit tests (standalone backfill only) | `/swd-unit-test [ClassName.Method]` | swd-unit-test.md | Branch list + no invented cases — normally runs inside /swd-start |
| 4+ | Build or test error | `/swm-bug [paste error]` | swm-bug.md | Fix-only + discard after 3 failures |
| All | Project-wide code quality + security audit (standalone or auto) | `/swp-audit` | swp-audit.md | OWASP + architecture + CLAUDE.md rules + tenant/soft-delete + AC traceability — auto-runs inside /swd-submit |
| 4+ | Committing work — reviews run automatically | `/swd-submit` | swd-submit.md | Auto-detects subtask/story + inline review + commit + README/CHANGELOG + ADO Done + push + PR to `develop` + manager acceptance email + CONTEXT.md checkpoint |
| Any | HR operations: onboarding, exit, leave, attendance, probation, review handoffs | `/sw-hr [mode] [details]` | sw-hr.md | Routes HR workflow actions; uses `/sw-docs` for forms/checklists/trackers and publishes saved files by PR |
| Any | Admin operations: assets, access, vendors, inventory, handovers | `/sw-admin [mode] [details]` | sw-admin.md | Routes admin workflow actions; uses `/sw-docs` for handover forms/SOPs/trackers and publishes saved files by PR |
| Any | Business docs, HR/admin policies, SOPs, forms, and Excel-ready trackers | `/sw-docs [type] [topic]` | sw-docs.md | Drafts policy/SOP/tracker/form/handbook outputs; file writes wait for `docs approved`, then publish via PR to `develop` |

### How to invoke slash commands

**Option A — type / to browse:**
Type `/` → dropdown appears → click or keep typing to filter

**Option B — type directly:**
```
/swd-start EXAM-42 — Question Import — SRS-v1.0 — subtask: Repository
/swd-start question import
/swm-bug paste the full error here
/swd-unit-test QuestionRepository.GetByIdAsync
/swd-submit subtask
/swd-submit
```

### Troubleshooting slash commands

| Symptom | Fix |
|---------|-----|
| `/` dropdown is empty | Check `.claude/commands/` folder exists in `.claude/` directory |
| Specific command missing | Run `git pull` — you may be behind on the toolkit update |
| Commands folder missing entirely | Re-run: `Copy-Item "..\ToolKit\.claude\commands" ".\.claude\commands" -Recurse -Force` |
| Claude Code not recognising `/` | Restart Claude Code — it scans on startup |

---

## Which /swd-submit type for each situation?

| Situation | Command | What it writes |
|-----------|---------|----------------|
| One file built and tested | `/swd-submit subtask` | Code commit + README patch + CHANGELOG entry + BREAKDOWN ✅ |
| Story PR merged to develop | `/swd-submit story` | README features → Done + CHANGELOG + BREAKDOWN story row → Done |
| Phase milestone reached | `/swd-submit phase [N]` | README phase table + CHANGELOG phase entry |
| All stories in an Epic merged | `/swd-submit epic` | CHANGELOG Epic closed + BREAKDOWN epic row → Done |
| Promoting Unreleased to a version | `/swd-submit release [vX.Y.Z]` | README version badge + CHANGELOG promoted + git tag |
| Production bug fixed and merged | `/swd-submit hotfix` | CHANGELOG Fixed entry |

---

## Version bump rules

| Event | SemVer | Example |
|-------|--------|---------|
| Phase 2 scaffold first builds | v0.1.0 | First runnable skeleton |
| First production deploy | v1.0.0 | Phase 6 complete |
| New Epic shipped | v1.X.0 | MINOR bump |
| Story or hotfix shipped | v1.X.Y | PATCH bump |
| Breaking DB or API change | vX.0.0 | MAJOR bump |

---

## Common mistakes — do not do these

| Mistake | Correct behaviour |
|---------|-----------------|
| Start Claude session without reading CONTEXT.md | Always read CONTEXT.md first if story is in progress |
| Ask Claude to build 2 subtasks at once | One subtask = one prompt. Always. |
| Skip the build after Claude writes code | Run `dotnet build` after every file Claude writes |
| Let Claude invent unit test cases | You write cases in plain English. Claude writes code. |
| Commit without review | Use the appropriate `/swd-submit` command — see Slash command quick-reference |
| Create a DB table without checking ENTITIES.md | Always check ENTITIES.md first |
| Write a convention into chat instead of CLAUDE.md | All conventions go in CLAUDE.md via PR |
| Copy-paste from PROMPTS.md directly | Use slash commands — see "How to invoke slash commands" section above |
| Bundle README/CHANGELOG into a feature commit | Use `/swd-submit` — it creates separate docs commits automatically |
| Push real secrets to git | Only placeholders in config files. Always. |
| Continue after 3 build errors | DISCARD TRIGGERED — restart with narrower scope |
| Modify an existing DB column post-release | All DB changes must be additive |
| Start coding a new story without breakdown | See "Slash command quick-reference" for `/swp-plan` — run it first |

---

## Getting help

- **Confused about a Claude output?** Ask Claude to explain in plain English before using it
- **Convention unclear?** Read CLAUDE.md. If not there, ask tech lead. Do not guess.
- **Something wrong with CLAUDE.md?** Raise it with tech lead. Do not edit directly.
- **ENTITIES.md conflict?** Talk to the other developer. Resolve before pushing.
- **ADO board question?** Tech lead owns the board. Do not reassign tasks without asking.
- **Slash command missing?** See troubleshooting table in the slash commands section above.

---

*SmartWorkz Claude Code Toolkit v3.0 — merged developer guide*
*Maintained in .claude/toolkit/HOW-TO-USE.md | Tech lead: [name] | Last updated: 2026-05-12*
