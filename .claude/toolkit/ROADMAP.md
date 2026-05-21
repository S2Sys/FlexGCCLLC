# ROADMAP.md — [Product Name] Development Roadmap
# Updated by tech lead at each sprint planning session.
# Stakeholders: read this to understand what is being built and when.
# Developers: check this before raising new ADO tasks — avoid building unplanned work.
# Interns: read this on Day 1 to understand where the product is heading.

---

## Phase Progress

| Phase | Name | Status | Target |
|-------|------|--------|--------|
| 0 | SRS Preparation | Planned | Sprint [N] |
| 1 | Architecture | Planned | Sprint [N] |
| 2 | Solution Setup | Planned | Sprint [N] |
| 3 | ADO Board Setup | Planned | Sprint [N] |
| 4 | Feature Development | Planned | Sprint [N]–[N+X] |
| 5 | Quality Gates | Planned | Sprint [N+X] |
| 6 | Deploy | Planned | Sprint [N+X] |
| 7 | Maintain | Planned | Ongoing |

---

## Now — Sprint [N] (ends [YYYY-MM-DD])

### Sprint goal
[What this sprint delivers in one sentence — user-facing outcome]

### In progress

| Story | What it builds | Owner | Status |
|-------|---------------|-------|--------|
| [ADO-ID] | [description] | [dev] | In Progress |
| [ADO-ID] | [description] | [dev] | In Progress |

### Completed this sprint

| Story | What shipped | Merged |
|-------|-------------|--------|
| [ADO-ID] | [description] | [date] |

---

## Next — Sprint [N+1] (starts [YYYY-MM-DD])

### Sprint goal
[Planned outcome]

### Planned stories

| Story | Description | Epic | Effort |
|-------|-------------|------|--------|
| [ADO-ID] | [description] | [Epic] | S / M / L |
| [ADO-ID] | [description] | [Epic] | S / M / L |

---

## Later — Sprint [N+2] and beyond

| Sprint | Epic | What ships |
|--------|------|-----------|
| Sprint [N+2] | [Epic ID] | [description] |
| Sprint [N+3] | [Epic ID] | [description] |
| Sprint [N+4] | [Epic ID] | [description] |

---

## Epic Timeline

| Epic | Description | Target Release | Status |
|------|-------------|----------------|--------|
| [EPIC-ID] | [what it covers — user-facing feature group] | v[X.Y.0] | Planned |
| [EPIC-ID] | [what it covers] | v[X.Y.0] | Planned |

---

## Backlog (not yet scheduled)

| Item | Type | Priority | Notes |
|------|------|----------|-------|
| [Feature or Epic] | Feature / Tech debt / Spike | High / Med / Low | [blocker or dependency] |

---

## Released

| Version | Date | What shipped |
|---------|------|-------------|
| v0.1.0 | [YYYY-MM-DD] | Solution scaffold, /health endpoint live |

---

## Constraints and dependencies

| Constraint | Impact | Owner | Due |
|------------|--------|-------|-----|
| [e.g. SRS v1.1 approval needed] | [blocks Sprint N Phase 2] | Tech Lead | [date] |
| [e.g. AWS RDS instance provisioned] | [blocks Phase 6 deploy] | DevOps | [date] |

---

## How to update this file

| Trigger | Who updates | What to update |
|---------|------------|----------------|
| Sprint planning | Tech Lead | Move stories from Later → Next → Now |
| Story merged to develop | Developer via commit.ps1 | Move story from In Progress → Completed |
| Epic closed | Tech Lead | Move Epic from In Progress → Released |
| Phase complete | Tech Lead | Update Phase Progress table |
| Release deployed | Tech Lead | Add row to Released table, promote Changelog |

Commit format: `docs(roadmap): [sprint N planning / story X complete / release vX.Y.Z]`

---

*Updated: [YYYY-MM-DD] | Sprint cadence: [N weeks] | Owner: Tech Lead*
