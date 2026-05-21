# Enterprise Skills Plan — SmartWorkz++ ToolKit

**Date:** 2026-05-19  
**Author:** Zenthil  
**Scope:** Professional services / consulting enterprise — all three domains: delivery governance, people ops, finance & commercial  
**Source:** Repo-wide `_skill2.0` audit (56 files) + enterprise gap analysis

---

## Part 1 — Repo-Wide Health Audit

### Executive Summary

The ToolKit is **mature and well-structured** across core (`sw-`), developer (`swd-`), and cloud (`swc-`) families. The main issues are:

1. **Foundation gaps** — version headers, changelogs, and artifact blocks inconsistent across pre-May-18 commands
2. **Gate chains not enforced** — cloud prerequisites and marketing dependencies are implicit, not hard-stopped
3. **Handoff snapshots** not backfilled to older commands
4. **7 missing skills** in core workflow areas (see Part 3)

**Estimated effort to reach APPROVED across all 56 files:** 5–7 working days

---

### Repeated Must Have Issues (all families)

| Pattern | Affected Files | Standard Fix |
|---------|----------------|--------------|
| Missing or inconsistent version header format | 30+ files | Standardize: `Command : /name`, `Version  : X.Y`, `Updated  : YYYY-MM-DD`, plus changelog table |
| No explicit OUTPUT / artifact block | 15+ files | Add: `Produces: [file path]`, `Blocks when: [condition]`, `Next: /command` |
| Broken or missing handoff chain | swp-*, swmk-*, swl-* | Every command ends with "Next steps: [list of possible next commands]" |
| Missing HANDOFF SNAPSHOT section | Pre-2026-05-18 commands | Add consistent snapshot block (pattern: swd-next / swd-review) |
| Weak prerequisite clarity | sw-sync-readme, toolkit-sync, swp-ui, swc-cost | Add explicit `## Prerequisites` section: files required, MCP tools needed, assumed state |

### Repeated Should Have Issues

| Pattern | Affected Files | Standard Fix |
|---------|----------------|--------------|
| No trigger phrases in description | toolkit-sync, sw-sync-*, older sw-* | Add `Trigger when: [realistic user phrasing]` to all frontmatter descriptions |
| No Go/No-Go acceptance gate | Older v1.0–1.1 commands | Add scoring gate (100 pts, 5 dimensions, 🟢/🟡/🔴 signal) |
| No "When NOT to use" guidance | All families | Add anti-patterns section after "When to use" |
| Analytics prerequisite missing | swmk-ads, swmk-cro, swmk-campaign | Add hard prerequisite: analytics baseline (GA4, conversion tracking) must exist |

### Per-Family Health Summary

| Family | Files | Health | Top Fix |
|--------|-------|--------|---------|
| `sw-` Core Business | 10 | Strong | Standardize version headers; add explicit OUTPUT blocks |
| `swc-` Cloud | 5 | Strong | Enforce prerequisite chain: arch → cost → infra → deploy |
| `swd-` Developer | 8 | Very Strong | Consolidate testing gate logic across swd-next/manual-testing/review |
| `swl-` Lead | 1 | Weak — 1 file only | Add swl-review, swl-escalate (blocking gaps) |
| `swm-` Management | 3 | Good | Add swm-priority for backlog re-prioritization |
| `swmk-` Marketing | 13 | Moderate | Enforce analytics prerequisite; add swmk-audit |
| `swp-` Product | 16 | Needs full audit | Separate audit session needed — 16 files, largest family |

---

### Toolkit Health Rollout Order

| # | Action | Effort | Priority |
|---|--------|--------|----------|
| 1 | Standardize version headers + changelogs across all 56 files | 0.5 day | Must Have |
| 2 | Add HANDOFF SNAPSHOT to pre-May-18 commands | 1 day | Must Have |
| 3 | Add explicit OUTPUT blocks to 15+ files | 0.5 day | Must Have |
| 4 | Enforce cloud gate chain (hard STOP if upstream doc missing) | 0.5 day | Must Have |
| 5 | Consolidate swd-* testing gate logic | 0.5 day | Should Have |
| 6 | Create swl-review + swl-escalate | 1 day | Should Have |
| 7 | Create swc-migrate | 0.5 day | Should Have |
| 8 | Fix marketing analytics prerequisite + create swmk-audit | 1 day | Should Have |
| 9 | Full swp-* family audit (16 files) | 1 day | Should Have |
| 10 | Add QUICK START, "When NOT to use", complexity badges | 1 day | Nice to Have |

---

## Part 2 — Missing Skills Found in Audit (7 Net New)

These skills are missing from the current toolkit but are referenced or implied by existing commands:

| Proposed Command | Family | Rationale | Priority |
|------------------|--------|-----------|----------|
| `/swc-migrate` | Cloud | swc-arch has a migration branch but no dedicated command — missing: 6Rs framework, phasing, cutover checklist, rollback plan | HIGH |
| `/swl-review` | Lead | AC approval gate from tech lead POV — missing: AC coverage check, lead sign-off, blocker routing | HIGH |
| `/swl-escalate` | Lead | Escalation protocol for blocked stories — missing: severity classification, stakeholder notification, unblock actions | MEDIUM |
| `/swmk-audit` | Marketing | Pre-launch quality gate — missing: brand fit, compliance, analytics readiness, legal review routing | MEDIUM |
| `/swmk-competitor` | Marketing | Competitive intelligence — missing: research methodology, feature gap analysis, positioning | LOW |
| `/swm-priority` | Management | Backlog re-prioritization — missing: debt + blocker + capacity scoring matrix, velocity forecast | MEDIUM |
| `/swp-risk` | Product | Architecture risk assessment — missing: risk taxonomy, likelihood/impact matrix, mitigation strategies | MEDIUM |

---

## Part 3 — Enterprise Skills Gap Analysis (Professional Services)

Target: **Professional services / consulting enterprise** — all three domains equally: delivery governance, people ops, finance & commercial.

Design principle: **Hybrid integration** — skills work standalone but read upstream docs if they exist (same pattern as the `swp-` chain). A SOW created by `/sw-sow` can be read by `/sw-billing`; `/sw-billing` can feed `/sw-pnl`. If upstream docs are absent, skills run standalone.

---

### Domain A — Client Delivery Governance (6 new skills)

These skills manage the full engagement lifecycle from contract through closure.

| Command | Description | Trigger when | Integrates with |
|---------|-------------|--------------|-----------------|
| `/sw-sow` | **Statement of Work generator** — scope, deliverables, milestones, exclusions, assumptions, payment schedule, change request process. Produces `docs/delivery/SOW-[client]-[project].md`. | Starting a new client engagement, writing a fixed-price or T&M contract, responding to an RFP | `/sw-proposal` (reads approved proposal), `/sw-billing` (reads milestones) |
| `/sw-change-request` | **Change request management** — log scope changes, assess impact (effort, cost, timeline), get tech lead + client approval, update SOW. Produces CR register in `docs/delivery/CHANGE-REQUESTS.md`. | Client requests out-of-scope work, scope creep detected, requirements change mid-sprint | `/sw-sow` (patches it), `/sw-estimation` (re-estimates) |
| `/sw-milestone` | **Milestone tracker** — define delivery milestones, track completion status, generate milestone sign-off emails, produce client-facing progress report. Produces `docs/delivery/MILESTONES.md`. | At project kickoff, before each sprint, preparing for client sign-off, creating a delivery dashboard | `/sw-sow` (reads milestones), `/sw-billing` (triggers invoice per milestone) |
| `/sw-risk` | **Engagement risk register** — log delivery risks (technical, resource, scope, commercial), rate likelihood × impact, assign mitigation owners, escalate to steering committee. Produces `docs/delivery/RISK-REGISTER.md`. | At project start, when blockers emerge, before major releases, at checkpoint reviews | `/sw-milestone` (risk flags on milestones), `/sw-escalate` (high severity risks) |
| `/sw-escalate` | **Escalation workflow** — classify escalation type (technical / commercial / relationship), draft escalation memo, route to correct stakeholder, track resolution. Produces `docs/delivery/ESCALATIONS.md` log. | When blockers aren't resolving in 48h, client relationship at risk, SLA breach imminent, budget overrun detected | `/sw-risk` (high-impact risks), `/sw-communication` (drafts escalation email) |
| `/sw-closure` | **Project closure workflow** — produce final delivery sign-off, lessons learned, knowledge transfer checklist, client satisfaction survey template, final invoice trigger. Produces `docs/delivery/CLOSURE-REPORT.md`. | Project go-live complete, final milestone signed off, client handover ready | `/sw-billing` (final invoice), `/sw-milestone` (verifies all milestones complete), `/sw-retro` (lessons learned) |

---

### Domain B — Talent & People Ops (7 new skills)

These skills manage the full talent lifecycle from hiring through performance.

| Command | Description | Trigger when | Integrates with |
|---------|-------------|--------------|-----------------|
| `/sw-hiring` | **Hiring workflow** — generate job descriptions (role, seniority, skills matrix), interview scorecard templates, hiring committee briefing, offer letter trigger. Produces `docs/people/JD-[role]-[date].md`. | Opening a new role, backfilling a position, building a team for a new project | `/sw-communication` (offer email), `/sw-onboarding` (once candidate accepts) |
| `/sw-interview` | **Interview kit generator** — structured interview questions by competency (technical, behavioural, cultural fit), scoring rubric, panel calibration guide, decision matrix. Produces `docs/people/INTERVIEW-KIT-[role].md`. | Preparing for a candidate interview, standardizing hiring process across roles | `/sw-hiring` (reads JD for role context) |
| `/sw-performance` | **Performance review workflow** — 360° review templates, goal-setting (OKR/SMART), rating calibration guide, improvement plan (PIP) templates, promotion recommendation. Produces `docs/people/PERF-REVIEW-[name]-[cycle].md`. | Annual/semi-annual review cycles, mid-year check-ins, promotion decisions, PIP triggers | `/sw-communication` (drafts review communication) |
| `/sw-leave` | **Leave management** — leave request workflow, team coverage planning, absence reporting, policy application (sick / annual / parental / compensatory). Produces leave register entries. | Employee submits leave request, manager reviews coverage, monthly leave reporting | `/sw-communication` (leave approval/rejection emails) |
| `/sw-capacity` | **Team capacity planner** — map team members to active engagements, calculate utilisation rate, identify over/under-utilised resources, forecast capacity for upcoming projects. Produces `docs/people/CAPACITY-[month].md`. | Before accepting new projects, at sprint planning, monthly resource review | `/sw-milestone` (reads active delivery milestones), `/sw-billing` (reads billable hours) |
| `/sw-training` | **Learning & development planner** — skills gap analysis per role, training plan generation, certification tracking, budget allocation. Produces `docs/people/TRAINING-PLAN-[name]-[year].md`. | Annual L&D planning, post-project skills gap identified, new technology adoption | `/sw-performance` (reads skill gaps from review) |
| `/sw-offboarding` | **Employee offboarding workflow** — access revocation checklist, knowledge transfer plan, final settlement letter, client handover steps, exit interview template. Produces `docs/people/OFFBOARDING-[name]-[date].md`. | Employee resignation or termination, end of contract, role elimination | `/sw-communication` (relieving letter), `/sw-capacity` (capacity adjustment) |

---

### Domain C — Finance & Commercial (6 new skills)

These skills manage the full revenue cycle from timesheet to P&L.

| Command | Description | Trigger when | Integrates with |
|---------|-------------|--------------|-----------------|
| `/sw-timesheet` | **Timesheet → billing bridge** — capture billable hours per resource per project, apply rate cards, flag unbillable time, produce weekly/monthly timesheet summary. Produces `docs/finance/TIMESHEET-[project]-[month].md`. | Weekly or monthly timesheet close, preparing for invoicing, reviewing utilisation | `/sw-billing` (feeds billable hours), `/sw-capacity` (updates utilisation) |
| `/sw-billing` | **Invoice generation pipeline** — read SOW milestones or timesheets, generate invoice line items, apply tax rules, produce invoice PDF template, draft invoice email, log payment status. Produces `docs/finance/INV-[client]-[number].md`. | Milestone achieved, monthly T&M billing run, retainer renewal | `/sw-sow` or `/sw-timesheet` (source data), `/sw-communication` (invoice email), `/sw-pnl` (updates revenue line) |
| `/sw-pnl` | **Project P&L tracker** — track revenue (invoiced + projected), costs (resources + tools + subcontractors), gross margin, burn rate vs budget. Produces `docs/finance/PNL-[project].md`. | Monthly P&L review, at project closure, before bidding on similar projects | `/sw-billing` (revenue), `/sw-timesheet` (cost), `/sw-milestone` (projected milestones) |
| `/sw-ratecard` | **Rate card management** — define and maintain day rates / hourly rates by role, seniority, and client tier. Apply rate escalation rules. Produces `docs/finance/RATE-CARD-[version].md`. | Setting up a new engagement, annual rate review, responding to RFP pricing | `/sw-estimation` (uses rates for estimates), `/sw-billing` (applies rates to timesheets) |
| `/sw-budget` | **Project budget planning** — define project budget envelope, break down by phase and resource type, track actuals vs budget, flag variance at 80% threshold. Produces `docs/finance/BUDGET-[project].md`. | At project kickoff, proposal stage, quarterly budget review | `/sw-estimation` (baseline estimate), `/sw-pnl` (actuals tracking), `/sw-sow` (reads scope) |
| `/sw-vendor` | **Vendor & subcontractor management** — evaluate vendors (scorecard), generate purchase orders, track deliverables, manage payment terms, rate vendor performance. Produces `docs/finance/VENDOR-[name].md`. | Onboarding a new subcontractor, renewing vendor contracts, managing third-party deliveries | `/sw-billing` (pass-through costs to client), `/sw-pnl` (subcontractor cost line) |

---

## Part 4 — Enterprise Skill Architecture Summary

### Total New Skills Proposed

| Domain | Skills | Count |
|--------|--------|-------|
| Toolkit health (found in audit) | swc-migrate, swl-review, swl-escalate, swmk-audit, swmk-competitor, swm-priority, swp-risk | 7 |
| Client delivery governance | sw-sow, sw-change-request, sw-milestone, sw-risk, sw-escalate, sw-closure | 6 |
| Talent & people ops | sw-hiring, sw-interview, sw-performance, sw-leave, sw-capacity, sw-training, sw-offboarding | 7 |
| Finance & commercial | sw-timesheet, sw-billing, sw-pnl, sw-ratecard, sw-budget, sw-vendor | 6 |
| **Total** | | **26 new skills** |

---

### Skill Chain Map (Professional Services)

```
CLIENT ENGAGEMENT LIFECYCLE
───────────────────────────
/sw-proposal → /sw-sow → /sw-milestone → /sw-change-request → /sw-closure
                    ↓                           ↓
              /sw-risk ← ← ← ← ← ← ← /sw-escalate
                    
REVENUE CYCLE
─────────────
/sw-ratecard → /sw-estimation → /sw-budget
/sw-timesheet → /sw-billing → /sw-pnl
/sw-vendor → /sw-pnl

TALENT LIFECYCLE
────────────────
/sw-hiring → /sw-interview → [hire] → /sw-onboarding
/sw-performance → /sw-training
/sw-capacity ← /sw-milestone (project demand)
/sw-offboarding

EXISTING TOOLKIT (feeds into above)
─────────────────────────────────────
/sw-communication ← used by all domains for email/letters
/sw-estimation ← feeds /sw-budget and /sw-sow
/sw-proposal ← feeds /sw-sow
/sw-meeting ← delivery governance meetings
/sw-retro ← feeds /sw-closure (lessons learned)
```

---

### Implementation Priority

| Phase | Skills | When |
|-------|--------|------|
| **Phase 1 — Delivery governance core** | /sw-sow, /sw-milestone, /sw-billing, /sw-pnl | Build first — closes the revenue loop |
| **Phase 2 — Risk & change** | /sw-change-request, /sw-risk, /sw-escalate | Add once delivery cycle is running |
| **Phase 3 — Finance depth** | /sw-timesheet, /sw-ratecard, /sw-budget, /sw-vendor | Layer in when billing is proven |
| **Phase 4 — People ops core** | /sw-hiring, /sw-performance, /sw-capacity | Parallel to Phase 2–3 |
| **Phase 5 — People ops depth** | /sw-interview, /sw-leave, /sw-training, /sw-offboarding | Final layer |
| **Phase 6 — Closure & toolkit gaps** | /sw-closure, /swl-review, /swl-escalate, /swc-migrate | Completes the loops |

---

### Naming Conventions for New Enterprise Skills

All new enterprise skills follow the existing `sw-` prefix (non-technical, business-facing):

- `sw-[noun]` — delivery and business workflows (sw-sow, sw-billing, sw-risk)
- `swl-[verb]` — lead/manager workflows (swl-review, swl-escalate)
- `swc-[noun]` — cloud infrastructure (swc-migrate)
- `swmk-[noun]` — marketing (swmk-audit, swmk-competitor)
- `swm-[noun]` — management/maintenance (swm-priority)

All new skills must on creation include:
- YAML frontmatter with `name`, `description` (with Trigger when), `compatibility`
- `Version  : 1.0`, `Updated  : [date]`, `Author   : [name]`
- Changelog table
- `## Prerequisites` block
- `## STEP 0` through `## STEP N` workflow
- `## OUTPUT` block with produced artifact paths
- `## HANDOFF SNAPSHOT` section
- Downstream `Next:` routing line

---

*Generated by `_skill2.0` Repo-Wide Mode + Enterprise Gap Analysis*  
*Branch: feature/toolkit-health-suite*
