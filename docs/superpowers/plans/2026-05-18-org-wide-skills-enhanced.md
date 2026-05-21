# Org-Wide Skills Expansion — Enhanced Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to complete all tasks in this plan. Track progress with checkbox items (`- [ ]`).

**Goal:** Create 21 new `sw_`-prefixed skill files covering digital marketing (`swmk-*`) and org-wide cross-functional (`sw-*`) domains for an IT company combining software development and digital marketing services.

**Architecture:** Each deliverable is one `.md` file in `.claude/commands/`. All files follow the ToolKit skill format: YAML frontmatter → version header → changelog table → structured body with STEP sections. No code, no tests — verification is a format check against the template.

**Tech Stack:** Markdown · YAML frontmatter · SmartWorkz ToolKit skill conventions · Git

---

## How to Run This Plan

This plan is meant to be executed task-by-task while creating new skill files under `.claude/commands/`.

### Recommended order

1. Finish all **Phase 1 — Must Have** tasks first.
2. Move to **Phase 2 — Should Have** only after Phase 1 files are created, verified, and committed.
3. Finish **Phase 3 — Nice to Have** last.

---

### Manual execution workflow

For each task in this file:

1. Open the task section.
2. Create the target file shown in the task.
3. Paste or write the content exactly as specified.
4. Verify the file against the **Skill Format Template** in this plan.
5. Mark the task checkbox complete only after verification.
6. Run the commit command shown in the task.

---

### Command-line pattern

Use this pattern for every skill:

```powershell
# Review the created file
Get-Content .claude\commands\<skill-id>.md

# Stage it
git add .claude\commands\<skill-id>.md

# Commit it
git commit -m "feat(<skill-id>): add <skill name> skill v1.0"
```

Example:

```powershell
Get-Content .claude\commands\swmk-srs.md
git add .claude\commands\swmk-srs.md
git commit -m "feat(swmk-srs): add Marketing Requirements Specification skill v1.0"
```

---

### Running it with Claude or Codex

Use one task at a time. Good prompts are:

```text
Implement Task 1 from docs/superpowers/plans/2026-05-18-org-wide-skills-enhanced.md
```

```text
Create .claude/commands/swmk-seo.md exactly as specified in Task 2 of docs/superpowers/plans/2026-05-18-org-wide-skills-enhanced.md
```

```text
Continue with the next unchecked task in docs/superpowers/plans/2026-05-18-org-wide-skills-enhanced.md
```

Best practice:
- run one task at a time
- verify the file before committing
- commit before moving to the next task

---

### Progress tracking

Track completion in:

- the checkbox under each task
- the **Master Checklist** at the top
- the phase completion checklists at the bottom

Recommended rule:
- mark a task complete only when the file exists, passes the format check, and has been committed

---

### Quick start

If you want the shortest start path:

1. Implement `Task 1: swmk-srs`
2. Verify `.claude/commands/swmk-srs.md`
3. Commit it
4. Continue to `Task 2: swmk-seo`

This keeps the rollout aligned with the intended Phase 1 -> Phase 2 -> Phase 3 sequence.

---

## Master Checklist

### Phase 1 — Must Have
- [ ] Task 1: `swmk-srs` — Marketing Requirements Specification
- [ ] Task 2: `swmk-seo` — SEO Audit & Optimization
- [ ] Task 3: `swmk-campaign` — Campaign Planning
- [ ] Task 4: `swmk-analytics` — Analytics Setup (GA4/GTM)
- [ ] Task 5: `sw-proposal` — Client Proposal / SOW
- [ ] Task 6: `sw-estimation` — Project Estimation

### Phase 2 — Should Have
- [ ] Task 7: `swmk-content` — Content Strategy
- [ ] Task 8: `swmk-email` — Email Campaign
- [ ] Task 9: `swmk-social` — Social Media Planning
- [ ] Task 10: `swmk-ads` — Paid Advertising
- [ ] Task 11: `swmk-cro` — Conversion Rate Optimization
- [ ] Task 12: `sw-onboarding` — Client Onboarding
- [ ] Task 13: `sw-retro` — Sprint Retrospective
- [ ] Task 14: `swp-api` — API Design & Documentation
- [ ] Task 15: `swc-monitor` — Monitoring & Alerting Setup

### Phase 3 — Nice to Have
- [ ] Task 16: `swmk-brand` — Brand Guidelines
- [ ] Task 17: `swmk-pr` — PR & Media Relations
- [ ] Task 18: `swmk-crm` — CRM Setup
- [ ] Task 19: `swp-mobile` — Mobile App Planning
- [ ] Task 20: `sw-meeting` — Meeting Facilitation
- [ ] Task 21: `swmk-report` — Marketing Reporting

---

## Skill Format Template (apply to every task)

```
---
name: <skill-id>
description: |
  <What it does + explicit trigger phrases>
---

Version  : 1.0
Updated  : YYYY-MM-DD
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | YYYY-MM-DD | SmartWorkz | Initial release |

---

## Purpose
## Prerequisites
## STEP 1 — ...
...
## OUTPUT
```

**Verify before commit:**
- YAML frontmatter has `name` and `description`
- Version header and changelog table present
- All step headers are H2 (`##`)
- No TBDs, TODOs, or placeholder text

---

## Phase 1 — Must Have

---

### Task 1: `swmk-srs`

**File:** `.claude/commands/swmk-srs.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swmk-srs
description: |
  Review and finalize a Marketing Requirements Specification (MRS) for any digital marketing project — campaigns, website builds, SEO programmes, social media strategies, or brand launches. Validates audience definition, channel fit, KPI completeness, budget feasibility, and deliverable scope. Issues a scored Go/No-Go decision. All downstream marketing work is BLOCKED until approved.
  Trigger when: starting a new marketing project, reviewing a campaign brief, validating a client proposal, preparing a marketing SOW, or any time someone asks to review or approve marketing requirements.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a scored, signed-off Marketing Requirements Specification (MRS) that aligns all stakeholders on objectives, audience, channels, KPIs, budget, and deliverables before any creative or technical work begins.

## Prerequisites

- Client brief or project idea (even rough notes)
- Approximate budget range
- Target audience hypothesis

---

## STEP 1 — Project Overview

Collect or infer:

| Field              | Required | Value |
|--------------------|----------|-------|
| Client / Brand     | Yes      |       |
| Project type       | Yes      | campaign / SEO / social / website / brand |
| Business objective | Yes      | e.g. "increase leads by 30% in Q3" |
| Duration           | Yes      |       |
| Budget range       | Yes      |       |
| Primary contact    | Yes      |       |

Flag any empty required field as a blocker.

---

## STEP 2 — Target Audience

Define at least one primary persona:

```
Persona Name    :
Age Range       :
Role / Industry :
Pain Points     : (3 bullet points)
Goals           : (3 bullet points)
Channels Used   :
Decision Trigger:
```

Score: 1 point per filled field. **Minimum 5/7 to proceed.**

---

## STEP 3 — Channel Strategy

| Channel | Rationale | Content Type | Frequency | Owner |
|---------|-----------|--------------|-----------|-------|
|         |           |              |           |       |

Flag channels with no rationale. Flag if no owned (non-paid) channel exists.

---

## STEP 4 — KPI & Measurement Plan

| Objective | KPI | Baseline | Target | Measurement Tool |
|-----------|-----|----------|--------|-----------------|
|           |     |          |        |                 |

Score: 1 point per KPI with all four fields complete. **Minimum 3 to proceed.**

---

## STEP 5 — Budget & Timeline

```
Total Budget     : £/$/€
  Creative       :    %
  Paid Media     :    %
  Tools / Tech   :    %
  Contingency    :    % (min 10%)

Timeline
  Kick-off          :
  Creative sign-off :
  Launch            :
  Review cycle      : monthly / quarterly
```

Flag: contingency < 10% · fewer than 2 review checkpoints.

---

## STEP 6 — Deliverables

| # | Deliverable | Format | Owner | Due Date |
|---|-------------|--------|-------|----------|
| 1 |             |        |       |          |
| 2 |             |        |       |          |
| 3 |             |        |       |          |

Minimum 3 deliverables, each with owner and due date.

---

## STEP 7 — Risks & Constraints

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
|      | H/M/L      | H/M/L  |            |

Minimum 3 risks.

---

## STEP 8 — Go / No-Go Scoring

| Dimension          | Score /10 | Notes |
|--------------------|-----------|-------|
| Audience Clarity   |           |       |
| Channel Fit        |           |       |
| KPI Completeness   |           |       |
| Budget Feasibility |           |       |
| Deliverable Scope  |           |       |
| Risk Coverage      |           |       |
| **TOTAL**          | **/60**   |       |

- 50–60 → **GO** — proceed to `/swmk-campaign` or `/swmk-seo`
- 40–49 → **CONDITIONAL** — list blockers, re-review
- < 40  → **NO-GO** — major rework required

---

## OUTPUT

`docs/MARKETING-SRS.md` — all step outputs + Go/No-Go verdict.
Downstream blocked until GO: `/swmk-campaign` · `/swmk-seo` · `/swmk-content` · `/swmk-analytics`
```

- [ ] **Step 2: Verify format** — frontmatter · version header · changelog · H2 steps · no TBDs

- [ ] **Step 3: Commit**
```
git add .claude/commands/swmk-srs.md
git commit -m "feat(swmk-srs): add Marketing Requirements Specification skill v1.0"
```

---

### Task 2: `swmk-seo`

**File:** `.claude/commands/swmk-seo.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swmk-seo
description: |
  Run a structured SEO audit for a website — covers technical SEO, Core Web Vitals, keyword gap analysis, on-page factors, and backlink health. Produces a prioritised SEO-AUDIT.md with Quick Win / Medium-Term / Long-Term action plan.
  Trigger when: onboarding a new client website, running a quarterly SEO review, investigating organic traffic drops, preparing an SEO proposal, or any time someone asks for an SEO audit or SEO recommendations.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a prioritised SEO audit identifying technical blockers, keyword opportunities, and on-page weaknesses — with a clear action plan ordered by effort vs. impact.

## Prerequisites

- Website URL
- Google Search Console access (or exported data)
- Keyword research tool data (Semrush / Ahrefs / Ubersuggest)

---

## STEP 1 — Site Health Summary

| Metric                      | Value | Status |
|-----------------------------|-------|--------|
| Total indexed pages         |       |        |
| Pages with 4xx errors       |       |        |
| Redirect chains (3+ hops)   |       |        |
| Duplicate title tags        |       |        |
| Missing meta descriptions   |       |        |
| Pages blocked by robots.txt |       |        |
| Sitemap submitted to GSC    |       | Y/N    |

Flag any metric affecting > 5% of pages as a blocker.

---

## STEP 2 — Core Web Vitals

For the top 5 landing pages (by traffic):

| Page URL | LCP (s) | INP (ms) | CLS  | Pass/Fail |
|----------|---------|----------|------|-----------|
|          |         |          |      |           |

Thresholds: LCP < 2.5s · INP < 200ms · CLS < 0.1
Source: Google PageSpeed Insights or Search Console CWV report.

---

## STEP 3 — Keyword Gap Analysis

Top 10 target keywords from brief or MARKETING-SRS.md:

| Keyword | Monthly Vol. | Current Rank | Gap | Priority |
|---------|-------------|--------------|-----|----------|
|         |             |              | Not ranking / P2–3 / P1 not top 3 | H/M/L |

Flag: volume > 500/mo AND gap = Not Ranking → Quick Win candidate.

---

## STEP 4 — On-Page Audit

Sample top 10 pages by traffic:

| Page | Title Tag | H1 | Meta Desc | Keyword in URL | Content > 300w |
|------|-----------|-----|-----------|----------------|----------------|
|      | ✓/✗       | ✓/✗ | ✓/✗      | ✓/✗            | ✓/✗            |

Flag pages failing 3 or more checks.

---

## STEP 5 — Backlink Profile

| Metric                    | Value |
|---------------------------|-------|
| Total referring domains   |       |
| Domains with DR > 40      |       |
| Toxic / spammy links (%)  |       |
| Lost links (last 30 days) |       |

Flag: toxic link % > 5%.

---

## STEP 6 — Prioritised Action Plan

**Quick Wins (0–4 weeks)**
- [ ] [Action] — [rationale] — [owner]

**Medium-Term (1–3 months)**
- [ ] [Action] — [rationale] — [owner]

**Long-Term (3–6 months)**
- [ ] [Action] — [rationale] — [owner]

---

## OUTPUT

`docs/SEO-AUDIT.md` — all step outputs + prioritised action plan.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swmk-seo.md
git commit -m "feat(swmk-seo): add SEO Audit & Optimization skill v1.0"
```

---

### Task 3: `swmk-campaign`

**File:** `.claude/commands/swmk-campaign.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swmk-campaign
description: |
  Plan a digital marketing campaign end-to-end — brief, objectives, audience, channel mix, creative requirements, budget allocation, and timeline. Produces CAMPAIGN-PLAN.md. Requires approved MARKETING-SRS.md.
  Trigger when: starting a new campaign, planning a product launch, planning a seasonal promotion, writing a campaign brief, or any time someone asks to plan or brief a marketing campaign.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a complete campaign plan that a creative team, media buyer, and account manager can all work from independently.

## Prerequisites

- `docs/MARKETING-SRS.md` with Go/No-Go = GO
- Campaign name and concept
- Budget confirmed

---

## STEP 1 — Campaign Brief

```
Campaign Name   :
Type            : awareness / lead-gen / retention / launch / seasonal
Business Goal   : e.g. "generate 200 qualified leads in 6 weeks"
Campaign Period : [start] → [end]
Total Budget    : £/$/€
Primary CTA     : e.g. "Book a demo"
```

---

## STEP 2 — Audience Segments

| Segment | Demographics | Psychographics | Platform | Message Angle |
|---------|-------------|----------------|----------|---------------|
|         |             |                |          |               |

Minimum 1 segment. Maximum 3 per campaign (more causes creative fragmentation).

---

## STEP 3 — Channel Mix & Budget Split

| Channel | Funnel Role | Budget (£/%) | Format | Primary Metric |
|---------|-------------|--------------|--------|---------------|
|         | Acquisition / Nurture / Conversion | | | |

Contingency minimum 10%. All percentages must total 100%.

---

## STEP 4 — Creative Requirements

| Asset | Format / Size | Copy Brief | Owner | Due Date |
|-------|---------------|------------|-------|----------|
|       |               |            |       |          |

---

## STEP 5 — Timeline

| Milestone             | Date | Owner |
|-----------------------|------|-------|
| Brief signed off      |      |       |
| Creative assets ready |      |       |
| Landing page live     |      |       |
| Campaign goes live    |      |       |
| Mid-campaign review   |      |       |
| Campaign ends         |      |       |
| Results report due    |      |       |

---

## STEP 6 — KPIs & Success Criteria

| Metric | Baseline | Target | Measurement Tool |
|--------|----------|--------|-----------------|
| Impressions       | | | Platform dashboard |
| Clicks / CTR      | | | Platform dashboard |
| Leads / CVR       | | | GA4 + CRM          |
| Cost per Lead     | | | Platform dashboard |
| Revenue attributed| | | CRM                |

---

## OUTPUT

`docs/CAMPAIGN-PLAN.md` — all step outputs.
Notify: creative lead, media buyer, account manager.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swmk-campaign.md
git commit -m "feat(swmk-campaign): add Campaign Planning skill v1.0"
```

---

### Task 4: `swmk-analytics`

**File:** `.claude/commands/swmk-analytics.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swmk-analytics
description: |
  Set up web analytics for a client project — GA4 property configuration, GTM container setup, conversion event tracking, and a reporting dashboard template. Produces ANALYTICS-SETUP.md with a QA verification checklist.
  Trigger when: onboarding a new website, launching a campaign, setting up tracking for a client, configuring GA4, setting up GTM, adding conversion tracking, or any time someone asks to set up analytics or tracking.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Ensure every client project has correctly configured analytics from day one — GA4 property, GTM container, key conversion events, and a reporting baseline.

## Prerequisites

- Google account with Analytics Admin access
- Website URL and CMS/stack confirmed
- Conversion actions defined (from MARKETING-SRS.md or CAMPAIGN-PLAN.md)

---

## STEP 1 — GA4 Property Setup

```
Property Name    : [Client Name — Website]
Measurement ID   : G-XXXXXXXXXX
Data Retention   : 14 months (change from 2-month default)
Cross-domain     : Yes / No — list domains if Yes
Internal IP filter: Yes — add office + agency IPs
Enhanced Measurement: On (scroll, outbound clicks, site search, video)
```

Checklist:
- [ ] Data stream active and receiving hits (verify in Realtime report)
- [ ] Enhanced measurement enabled
- [ ] Internal traffic filter created
- [ ] Data retention set to 14 months

---

## STEP 2 — GTM Container Setup

```
Container Name : [Client Name — Web]
Container ID   : GTM-XXXXXXX
GA4 Tag        : GA4 Configuration tag → Measurement ID from Step 1
Trigger        : All Pages
```

Checklist:
- [ ] GA4 Configuration tag firing on All Pages
- [ ] Preview mode tested — GA4 tag confirmed firing
- [ ] Container published (not just saved)
- [ ] GTM snippet present in both `<head>` and `<body>`

---

## STEP 3 — Conversion Event Tracking

For each conversion from the brief:

| Conversion      | GTM Trigger Type     | GA4 Event Name  | Parameters               |
|-----------------|----------------------|-----------------|--------------------------|
| Form submission | Form Submission      | `generate_lead` | `form_id`, `page_url`    |
| CTA button click| Click — All Elements | `cta_click`     | `button_text`, `page`    |
| File download   | Click — Just Links   | `file_download` | `file_name`              |
| Video play (75%)| YouTube Video        | `video_progress`| `video_title`            |
| Purchase        | Custom Event         | `purchase`      | `value`, `currency`      |

Per event:
- [ ] GTM trigger created and tested in Preview mode
- [ ] GA4 event visible in Realtime → Events
- [ ] Event marked as conversion in GA4 Admin → Conversions

---

## STEP 4 — Reporting Dashboard

Standard reports to create in GA4 Explorations or Looker Studio:

| Report              | Metrics                                | Dimension         |
|---------------------|----------------------------------------|-------------------|
| Traffic Overview    | Sessions, Users, Bounce Rate           | Channel / Source  |
| Conversion Funnel   | Events → Conversions → CVR             | Page / Device     |
| Campaign Performance| Sessions, Conversions, Revenue         | Campaign / Medium |
| Top Content         | Views, Avg Engagement Time, Scroll %   | Page Path         |
| Audience            | New vs Returning, Demographics         | Country / Device  |

---

## STEP 5 — QA Verification

- [ ] Submit test form → appears in GA4 Realtime as `generate_lead`
- [ ] Click main CTA → appears as `cta_click`
- [ ] GA4 DebugView → no unexpected events
- [ ] GTM Preview → no tags firing on 404 pages
- [ ] Data visible in GA4 Reports within 24 hours

---

## OUTPUT

`docs/ANALYTICS-SETUP.md` — GA4 Measurement ID, GTM ID, event inventory, QA results.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swmk-analytics.md
git commit -m "feat(swmk-analytics): add Analytics Setup skill v1.0"
```

---

### Task 5: `sw-proposal`

**File:** `.claude/commands/sw-proposal.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: sw-proposal
description: |
  Generate a professional client proposal or Statement of Work (SOW) — covers executive summary, problem statement, proposed solution, deliverables, timeline, pricing, team, and standard terms. Works for software development and digital marketing projects.
  Trigger when: writing a proposal, creating a SOW, responding to an RFP, quoting a client, preparing pre-sales documents, writing a project agreement, or any time someone asks to write a proposal or statement of work.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a persuasive, clearly scoped proposal that sets expectations, wins the work, and protects both parties.

## Prerequisites

- Client name, contact, and brief
- Approximate budget range
- Preferred timeline

---

## STEP 1 — Inputs

```
Client Name        :
Contact Name       :
Project Name       :
Project Type       : software / marketing / combined
Budget Range       : £/$/€
Desired Start Date :
Desired End Date   :
Key Decision Maker :
Proposal Deadline  :
```

---

## STEP 2 — Executive Summary

Three sentences:
1. Restate the client's problem or goal in their own language.
2. State the proposed solution at the highest level.
3. State the primary outcome or benefit.

Example:
> "[Client] wants to increase qualified inbound leads by 40% over the next quarter. We will deliver a targeted SEO and paid search programme supported by a redesigned landing page. This will position [Client] to capture demand from [audience] at lower cost-per-lead than current outbound spend."

---

## STEP 3 — Problem Statement (150–250 words)

- **Current state** — what is happening now
- **Pain points** — why it matters
- **Cost of inaction** — what happens if nothing changes

Use the client's own language where possible.

---

## STEP 4 — Proposed Solution

- What will be built or delivered, and why
- Key decisions made and rationale
- What is explicitly **OUT OF SCOPE** (critical — list at least 3 exclusions)

---

## STEP 5 — Deliverables & Milestones

| # | Deliverable | Description | Acceptance Criterion | Due Date |
|---|-------------|-------------|---------------------|----------|
| 1 |             |             | Client signs off on X |         |
| 2 |             |             | X is live and verified |        |

---

## STEP 6 — Pricing

**Fixed Price:**

| Phase     | Description | Fee  |
|-----------|-------------|------|
| Discovery |             | £    |
| Build     |             | £    |
| Launch    |             | £    |
| **Total** |             | **£**|

Payment terms: 50% upfront, 50% on final delivery. Net 14 days. Late payment: 2% per month.

**OR Retainer:**

| Month | Scope | Monthly Fee |
|-------|-------|-------------|
| 1–3   |       | £           |

---

## STEP 7 — Team

| Name / Role | Responsibility | Availability |
|-------------|----------------|--------------|
|             |                | x days/week  |

---

## STEP 8 — Timeline

| Week / Phase | Activities | Milestone |
|--------------|------------|-----------|
| Week 1       |            |           |
| Week 2       |            |           |

---

## STEP 9 — Standard Terms

Include these clauses verbatim (customise values in brackets):

- **IP:** All work product transfers to client upon receipt of full payment.
- **Revisions:** [X] rounds of revisions included. Additional revisions billed at £[Y]/hour.
- **Change requests:** Any scope change requires written approval and may affect timeline and cost.
- **Confidentiality:** Both parties keep project details confidential for [2] years.
- **Termination:** Either party may terminate with [14] days written notice. Work completed to date is invoiced.

---

## OUTPUT

`docs/PROPOSAL-[ClientName]-[YYYY-MM-DD].md` — ready for PDF export or direct sharing.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/sw-proposal.md
git commit -m "feat(sw-proposal): add Client Proposal / SOW skill v1.0"
```

---

### Task 6: `sw-estimation`

**File:** `.claude/commands/sw-estimation.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: sw-estimation
description: |
  Estimate effort, cost, and timeline for any project — software development or digital marketing. Uses three-point estimation (Best/Likely/Worst), PERT formula, risk buffers, and confidence scoring. Produces a ranged estimate with high/low bounds.
  Trigger when: quoting a project, planning a sprint, checking if a deadline is feasible, producing a proposal estimate, breaking down project scope, or any time someone asks to estimate time, cost, or effort.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a confidence-rated estimate with best/likely/worst ranges and a risk buffer that protects the team and the client.

## Prerequisites

- Scope description or deliverables list (from SRS, proposal brief, or campaign plan)
- Team roles and day rates (if cost estimate required)
- Target deadline (if timeline validation required)

---

## STEP 1 — Scope Decomposition

Break the project into work items (minimum 5; no single item > 3 days):

| # | Work Item | Description | Role |
|---|-----------|-------------|------|
| 1 |           |             |      |
| 2 |           |             |      |

---

## STEP 2 — Three-Point Estimate

| # | Work Item | Best (h) | Likely (h) | Worst (h) | PERT (h) |
|---|-----------|----------|------------|-----------|----------|
| 1 |           |          |            |           |          |
| **TOTAL** |   |          |            |           |          |

PERT formula: `(Best + 4 × Likely + Worst) ÷ 6`

---

## STEP 3 — Risk Buffer

| Risk Factor                   | Applies? | Buffer |
|-------------------------------|----------|--------|
| New client / unknown codebase | Y/N      | +15%   |
| New technology                | Y/N      | +20%   |
| External dependencies (APIs)  | Y/N      | +10%   |
| Tight deadline (< 4 weeks)    | Y/N      | +10%   |
| Unclear requirements          | Y/N      | +25%   |
| Team at > 80% capacity        | Y/N      | +15%   |

Total buffer: ___%
Buffered estimate: PERT total × (1 + buffer ÷ 100)

---

## STEP 4 — Role Breakdown & Cost

| Role            | Hours | Day Rate (£) | Cost (£) |
|-----------------|-------|--------------|----------|
| Project Manager |       |              |          |
| Developer       |       |              |          |
| Designer        |       |              |          |
| Copywriter      |       |              |          |
| QA              |       |              |          |
| **TOTAL**       |       |              |          |

---

## STEP 5 — Timeline Projection

```
Available capacity : [people] × [days/week] × [weeks] = [total hours]
Hours needed       : [from Step 4]
Implied duration   : hours needed ÷ weekly capacity (in weeks)
Target deadline    : [from brief]
Gap (days)         : deadline − implied end date
```

Gap < 0 → flag timeline risk. Recommend scope reduction or additional resource.

---

## STEP 6 — Confidence Score

| Factor                       | Score 1–5 |
|------------------------------|-----------|
| Requirements clarity         |           |
| Team familiarity with scope  |           |
| Past similar project data    |           |
| Stakeholder alignment        |           |
| **Average**                  |           |

- 4–5: High confidence — commit to likely estimate
- 3–4: Medium confidence — commit to likely + 15%
- 1–3: Low confidence — commit to worst case or run a paid discovery phase

---

## OUTPUT

`docs/ESTIMATION.md` — scope breakdown, buffered total, role breakdown, timeline projection, confidence score.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/sw-estimation.md
git commit -m "feat(sw-estimation): add Project Estimation skill v1.0"
```

---

## Phase 2 — Should Have

---

### Task 7: `swmk-content`

**File:** `.claude/commands/swmk-content.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swmk-content
description: |
  Build a content strategy — content audit of existing assets, pillar/cluster topic map, tone-of-voice guide, 90-day editorial calendar, and a reusable content brief template. Produces CONTENT-STRATEGY.md.
  Trigger when: starting a content marketing programme, planning a blog strategy, building a content calendar, auditing existing content, defining brand voice, or any time someone asks for a content strategy or content plan.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a complete content strategy that a writer, SEO specialist, and social media manager can execute without additional briefing.

## Prerequisites

- Brand/product overview
- Target audience personas (from MARKETING-SRS.md if available)
- Access to existing website content (for audit)

---

## STEP 1 — Content Audit

Inventory existing content (sample up to 20 pieces):

| URL / Title | Type | Topic | Traffic/mo | Shares | Action |
|-------------|------|-------|------------|--------|--------|
|             | blog/video/guide/landing | | | | Keep / Update / Consolidate / Delete |

Flag: content > 18 months old with < 100 monthly visits → candidate for update or deletion.

---

## STEP 2 — Pillar & Cluster Topic Map

Define 3–5 content pillars (broad topics central to the brand):

```
Pillar 1: [Topic]
  Cluster topics (5–8):
  - [subtopic]
  - [subtopic]
  Target keyword for pillar page: [keyword]

Pillar 2: [Topic]
  ...
```

Each pillar maps to one long-form pillar page + 5–8 cluster blog posts linking back to it.

---

## STEP 3 — Tone of Voice

Three adjectives that define the brand voice (e.g. Authoritative, Approachable, Direct):

| Adjective | What it means in practice | DO | DON'T |
|-----------|---------------------------|----|-------|
|           |                           |    |       |

Reading age target: [e.g. Grade 8 / Flesch-Kincaid 60–70]
Avoid: [list of banned words or phrases]

---

## STEP 4 — 90-Day Editorial Calendar

Week-by-week plan:

| Week | Date | Content Title | Type | Pillar | Channel | Owner | Status |
|------|------|---------------|------|--------|---------|-------|--------|
| 1    |      |               | Blog |        | Website + LinkedIn | | Draft |

One pillar page per month. Two cluster posts per week. One email newsletter per fortnight.

---

## STEP 5 — Content Brief Template

Reusable brief for every piece:

```
Title (working)    :
Target keyword     :
Search intent      : informational / commercial / navigational
Pillar             :
Word count target  : (blog: 1200–2000 / guide: 2500–4000)
Target audience    :
Key message (1 sentence):
Outline            :
  H2: [section]
  H2: [section]
CTA                :
Internal links     : (min 2)
External links     : (min 1 — authoritative source)
Owner              :
Due date           :
```

---

## STEP 6 — Distribution Plan

For each content type, define where it goes after publication:

| Content Type | Primary Channel | Repurpose As     | Promote Via          |
|--------------|-----------------|------------------|----------------------|
| Blog post    | Website         | LinkedIn article | Email newsletter, social |
| Guide / PDF  | Website (gated) | Blog summary     | LinkedIn, Google Ads |
| Video        | YouTube         | Shorts clip      | Social, email        |

---

## OUTPUT

`docs/CONTENT-STRATEGY.md` — audit, pillar map, tone guide, 90-day calendar, brief template, distribution plan.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swmk-content.md
git commit -m "feat(swmk-content): add Content Strategy skill v1.0"
```

---

### Task 8: `swmk-email`

**File:** `.claude/commands/swmk-email.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swmk-email
description: |
  Plan and write a digital marketing email campaign — sequence structure, subject line A/B variants, email body templates, send schedule, and deliverability checklist. Produces EMAIL-CAMPAIGN.md.
  Trigger when: planning an email campaign, writing a nurture sequence, setting up a welcome series, running a promotional email, or any time someone asks to plan or write marketing emails.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a complete email campaign plan — from sequence design through to deliverability checks — that a copywriter and email platform operator can execute independently.

## Prerequisites

- Audience segment defined (from MARKETING-SRS.md or CAMPAIGN-PLAN.md)
- Email platform confirmed (Mailchimp / HubSpot / Klaviyo / ActiveCampaign)
- Campaign goal confirmed (lead nurture / promotion / onboarding / re-engagement)

---

## STEP 1 — Campaign Overview

```
Campaign Name    :
Goal             : nurture / promote / onboard / re-engage
Audience Segment :
Platform         :
Sequence Length  : [e.g. 3 emails over 10 days]
Sending From     : [Name] <email@domain.com>
```

---

## STEP 2 — Sequence Structure

| Email # | Send Day | Purpose       | Subject Line (A) | Subject Line (B) | Primary CTA |
|---------|----------|---------------|-----------------|-----------------|-------------|
| 1       | Day 0    | Welcome/Hook  |                 |                 |             |
| 2       | Day 3    | Value/Educate |                 |                 |             |
| 3       | Day 7    | Convert       |                 |                 |             |

Subject line rules: 40–50 characters · no all-caps · test emoji vs no-emoji.

---

## STEP 3 — Email Body Template

Apply this structure to each email:

```
PREHEADER (90 chars): [supports subject line, adds intrigue]

HEADER: [Logo + brand colour bar]

HEADLINE (H1): [Single benefit statement — 8 words max]

BODY (2–3 short paragraphs):
  Para 1: Hook / problem statement (2–3 sentences)
  Para 2: Solution / value (2–3 sentences)
  Para 3: Social proof or urgency (1–2 sentences)

CTA BUTTON: [Action verb + benefit — "Get Your Free Audit"]

SECONDARY CONTENT (optional): [Supporting links or resources]

FOOTER: [Unsubscribe link · Company address · Privacy policy]
```

---

## STEP 4 — Send Schedule & Frequency Rules

| Day | Email # | Send Time (local) | Segment |
|-----|---------|-------------------|---------|
|     |         | Tue–Thu 10am or 2pm preferred | |

Rules:
- Maximum 2 emails/week per contact
- Suppress contacts who opened Email 2 from re-receiving it
- Suppress purchasers / converted leads from remaining sequence

---

## STEP 5 — Deliverability Checklist

- [ ] SPF record published for sending domain
- [ ] DKIM enabled on sending platform
- [ ] DMARC policy set (minimum `p=none` with monitoring)
- [ ] Sending domain warmed (if < 30 days old — ramp to full volume over 2 weeks)
- [ ] List hygiene: remove hard bounces, unsubscribes, and 12-month non-openers
- [ ] Plain-text version present for every email
- [ ] Unsubscribe link in every email (legal requirement)
- [ ] Spam score checked (SpamAssassin score < 3.0)

---

## STEP 6 — Success Benchmarks

| Metric           | Industry Avg | Campaign Target | Actioned if Below Target |
|------------------|-------------|-----------------|--------------------------|
| Open rate        | 20–25%      |                 | Test new subject lines   |
| Click-through rate| 2–3%       |                 | Improve CTA and body copy|
| Unsubscribe rate | < 0.5%      |                 | Review frequency/relevance|
| Conversion rate  | 1–3%        |                 | Review landing page      |

---

## OUTPUT

`docs/EMAIL-CAMPAIGN.md` — sequence plan, email templates, send schedule, deliverability checklist, benchmarks.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swmk-email.md
git commit -m "feat(swmk-email): add Email Campaign skill v1.0"
```

---

### Task 9: `swmk-social`

**File:** `.claude/commands/swmk-social.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swmk-social
description: |
  Plan a social media strategy — platform selection rationale, content matrix, 30-day posting schedule, hashtag strategy, community engagement rules, and monthly performance scorecard. Produces SOCIAL-PLAN.md.
  Trigger when: starting a social media programme, planning monthly social content, building a posting schedule, auditing social presence, or any time someone asks for a social media strategy or social content plan.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a 30-day social media plan that a social media manager can execute without additional direction.

## Prerequisites

- Brand/product overview and tone of voice (from CONTENT-STRATEGY.md if available)
- Target audience personas
- Active social platform accounts confirmed

---

## STEP 1 — Platform Selection

For each candidate platform, score 1–5:

| Platform  | Audience Match | Content Fit | Team Capacity | Score | Decision |
|-----------|---------------|-------------|---------------|-------|----------|
| LinkedIn  |               |             |               | /15   | In/Out   |
| Instagram |               |             |               | /15   | In/Out   |
| X (Twitter)|              |             |               | /15   | In/Out   |
| TikTok    |               |             |               | /15   | In/Out   |
| Facebook  |               |             |               | /15   | In/Out   |

Focus on platforms scoring > 10/15. Maximum 3 active platforms for a single operator.

---

## STEP 2 — Content Matrix

For each chosen platform, define content types and mix:

| Platform | Content Type | Format | % of Posts | Purpose |
|----------|-------------|--------|------------|---------|
| LinkedIn | Thought leadership | Text + image | 40% | Authority |
| LinkedIn | Case study | Carousel | 30% | Trust |
| LinkedIn | Behind-the-scenes | Short video | 20% | Culture |
| LinkedIn | Promotional | Single image | 10% | Conversion |

Total must = 100% per platform.

---

## STEP 3 — 30-Day Posting Schedule

| Day | Platform | Content Type | Topic / Hook | Format | Owner |
|-----|----------|-------------|--------------|--------|-------|
| Mon |          |             |              |        |       |
| Wed |          |             |              |        |       |
| Fri |          |             |              |        |       |

Posting frequency by platform:
- LinkedIn: 3–5×/week · Instagram: 4–7×/week · X: 1–3×/day · TikTok: 1×/day

Best posting times (schedule within these windows):
- LinkedIn: Tue–Thu 8–10am or 12–1pm
- Instagram: Tue/Wed 11am or 2–3pm
- TikTok: 7–9pm local audience time

---

## STEP 4 — Hashtag Strategy

Three tiers per platform:

| Tier | Type | Volume | Count to Use | Example |
|------|------|--------|--------------|---------|
| 1 | Branded | Any | 1–2 | #BrandName |
| 2 | Niche | < 100k posts | 3–5 | #DigitalMarketing |
| 3 | Broad | > 500k posts | 1–2 | #Marketing |

Instagram: use 5–10 hashtags max (algorithm penalises 30+ hashtag stuffing).
LinkedIn: 3–5 hashtags only.

---

## STEP 5 — Community Engagement Rules

| Scenario | Response Time | Tone | Owner |
|----------|--------------|------|-------|
| Positive comment | Within 4 hours | Warm, personal | Social manager |
| Question / enquiry | Within 2 hours | Helpful, direct | Social manager |
| Complaint | Within 1 hour | Empathetic, move to DM | Account manager |
| Negative review | Within 1 hour | Acknowledge, offer resolution | Senior manager |
| Spam / trolling | Ignore or hide | — | Social manager |

---

## STEP 6 — Monthly Performance Scorecard

Review at end of each month:

| Metric | Platform | Baseline | Target | Actual | Status |
|--------|----------|----------|--------|--------|--------|
| Follower growth (%) | | | +5% | | 🟢/🟡/🔴 |
| Avg engagement rate | | | > 2% | | |
| Reach per post | | | | | |
| Link clicks | | | | | |
| Leads / enquiries | | | | | |

---

## OUTPUT

`docs/SOCIAL-PLAN.md` — platform decisions, content matrix, 30-day schedule, hashtags, engagement rules, scorecard.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swmk-social.md
git commit -m "feat(swmk-social): add Social Media Planning skill v1.0"
```

---

### Task 10: `swmk-ads`

**File:** `.claude/commands/swmk-ads.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swmk-ads
description: |
  Plan and structure paid advertising campaigns — Google Ads (Search, Display, Shopping) and Meta Ads (Facebook/Instagram). Covers campaign architecture, audience targeting, keyword strategy, ad copy, bid strategy, budget allocation, and weekly optimisation checklist. Produces ADS-PLAN.md.
  Trigger when: setting up Google Ads, creating a Meta campaign, planning paid media spend, auditing a paid account, or any time someone asks to plan, build, or optimise paid advertising campaigns.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a structured paid advertising plan that a media buyer can implement directly in Google Ads and Meta Ads Manager.

## Prerequisites

- Campaign goal and budget confirmed (from CAMPAIGN-PLAN.md)
- Landing page URL(s) confirmed
- Target audience defined

---

## STEP 1 — Platform Selection

| Platform | Recommended For | Monthly Budget Min | Decision |
|---|---|---|---|
| Google Search | High-intent demand capture | £500+ | In/Out |
| Google Display | Retargeting, awareness | £200+ | In/Out |
| Google Shopping | E-commerce product ads | £300+ | In/Out |
| Meta (FB/IG) | Awareness, interest targeting | £300+ | In/Out |
| LinkedIn | B2B lead generation | £1,000+ | In/Out |

---

## STEP 2 — Campaign Structure (Google Ads)

```
Account
└── Campaign: [Goal — e.g. "Lead Gen — UK"]
    ├── Ad Group 1: [Theme — e.g. "SEO Services"]
    │   ├── Keywords (10–20 per group)
    │   └── Ads (min 3 responsive search ads per group)
    └── Ad Group 2: [Theme — e.g. "PPC Management"]
        ├── Keywords
        └── Ads
```

One campaign per goal. One ad group per keyword theme. Budget set at campaign level.

---

## STEP 3 — Keyword Strategy (Google Search)

| Keyword | Match Type | Monthly Vol. | CPC Est. | Intent | Ad Group |
|---------|-----------|-------------|---------|--------|----------|
|         | Exact / Phrase / Broad Mod | | | Commercial/Info | |

Negative keywords list (add before launch):
- [Irrelevant terms — e.g. "free", "DIY", competitor brand names if not targeting]

---

## STEP 4 — Audience Targeting (Meta)

**Custom Audiences:**
- Website visitors (last 30 days) — Retargeting
- Email list upload — Lookalike source
- Video viewers (25%+) — Warm audience

**Lookalike Audiences:**
- 1% lookalike of email list
- 1% lookalike of website purchasers/leads

**Interest Targeting (cold):**
| Interest | Audience Size Est. | Funnel Stage |
|---|---|---|
| | | Top / Mid / Bottom |

---

## STEP 5 — Ad Copy Framework

Responsive Search Ad structure (Google):

```
Headlines (write 10, Google rotates best 3):
1. [Primary keyword — 30 chars max]
2. [Unique value proposition]
3. [Call to action]
4. [Social proof — e.g. "500+ clients"]
5. [Offer / urgency]
...

Descriptions (write 4, Google rotates best 2):
1. [Expand on benefit + CTA — 90 chars max]
2. [Address objection + reassurance]
3. [Feature + benefit]
4. [Urgency / offer]
```

Meta Ad copy structure:
```
Hook (first line — stops scroll): [Question or bold statement]
Body (2–3 sentences): [Problem → Solution → Proof]
CTA: [Single clear action]
```

---

## STEP 6 — Bid Strategy Guide

| Goal | Recommended Strategy | When to Switch |
|------|---------------------|----------------|
| Maximise clicks (new account) | Manual CPC | After 30+ conversions/month → tCPA |
| Lead generation | Target CPA (tCPA) | Requires 30 conversions in 30 days to activate |
| E-commerce | Target ROAS (tROAS) | Requires consistent purchase data |
| Brand awareness | Target Impression Share | CPM-based, not for conversions |

---

## STEP 7 — Budget Allocation

| Platform / Campaign | Daily Budget | Monthly Total | % of Total Budget |
|---------------------|-------------|---------------|-------------------|
|                     |             |               |                   |
| Contingency (10%)   |             |               | 10%               |
| **TOTAL**           |             |               | 100%              |

---

## STEP 8 — Weekly Optimisation Checklist

Every Monday:
- [ ] Check CTR by ad group (flag < 2% on Search)
- [ ] Check Quality Score (flag keywords < 6/10)
- [ ] Pause keywords with > £[X] spend and 0 conversions
- [ ] Add new negative keywords from Search Term report
- [ ] Check frequency on Meta (flag > 3.0 — creative fatigue)
- [ ] Review CPL vs target — adjust bids or budgets
- [ ] Check landing page conversion rate (flag < 2%)

---

## OUTPUT

`docs/ADS-PLAN.md` — platform selection, campaign structure, keyword list, audiences, ad copy, bid strategy, budget split, weekly checklist.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swmk-ads.md
git commit -m "feat(swmk-ads): add Paid Advertising skill v1.0"
```

---

### Task 11: `swmk-cro`

**File:** `.claude/commands/swmk-cro.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swmk-cro
description: |
  Run a conversion rate optimisation audit — funnel drop-off analysis, landing page heuristic audit, A/B test hypothesis generation, and ICE-scored prioritisation matrix. Produces CRO-AUDIT.md.
  Trigger when: a landing page is underperforming, conversion rate has dropped, preparing an A/B test, auditing a checkout or sign-up flow, or any time someone asks to improve conversions or run a CRO audit.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Identify the highest-leverage conversion blockers on a page or funnel, generate testable hypotheses, and prioritise them for A/B testing using the ICE framework.

## Prerequisites

- GA4 or analytics access with funnel data
- Page URLs to audit
- Current conversion rate baseline

---

## STEP 1 — Funnel Drop-Off Analysis

Map the conversion funnel step by step:

| Step # | Page / Action | Sessions | Drop-off % | Flag |
|--------|--------------|----------|------------|------|
| 1 | Landing page arrival | | — | |
| 2 | Scroll to CTA | | | Flag if > 50% |
| 3 | CTA click | | | Flag if > 40% |
| 4 | Form start | | | Flag if > 30% |
| 5 | Form complete | | | Flag if > 20% |
| 6 | Thank you / Confirmation | | — | |

The step with the highest drop-off is the primary optimisation target.

---

## STEP 2 — Landing Page Heuristic Audit

Score each element 1–5 (1 = major problem, 5 = excellent):

| Element | Score | Observation |
|---------|-------|-------------|
| Headline clarity (does it state the value in < 8 words?) | /5 | |
| Above-fold CTA (visible without scrolling?) | /5 | |
| CTA copy (action verb + benefit vs. "Submit"?) | /5 | |
| Social proof (testimonials, logos, numbers?) | /5 | |
| Trust signals (security badges, guarantees?) | /5 | |
| Form length (fewer fields = higher CVR) | /5 | |
| Page load speed (< 3s on mobile?) | /5 | |
| Mobile layout (thumb-friendly CTA, readable text?) | /5 | |
| Distractions (navigation, pop-ups, competing CTAs?) | /5 | |
| Message match (does page match the ad/email that sent traffic?) | /5 | |
| **Total** | /50 | |

Score < 35: major CRO opportunity. Score > 45: optimise for marginal gains only.

---

## STEP 3 — Hypothesis Generation

For each low-scoring element, write a hypothesis:

Template: *"If we [change X], then [metric Y] will [increase/decrease] by [Z%], because [reason based on evidence]."*

| # | Element | Hypothesis | Evidence |
|---|---------|-----------|---------|
| 1 | | If we change the CTA from "Submit" to "Get My Free Audit", form completions will increase by 15%, because specific CTAs outperform generic ones in 7/10 A/B tests. | Heuristic audit + industry benchmarks |

---

## STEP 4 — A/B Test Design

For the top hypothesis:

```
Test Name        :
Control (A)      : [current version description]
Variant (B)      : [proposed change]
Primary Metric   : [e.g. form completion rate]
Secondary Metric : [e.g. time on page]
Min Sample Size  : [use: n = 16 × σ² ÷ δ² — or target 1,000 sessions per variant]
Min Duration     : 2 weeks (never end early — wait for business cycle to complete)
Significance     : 95% confidence required before declaring a winner
Tool             : Google Optimize / VWO / Optimizely / Unbounce
```

---

## STEP 5 — ICE Prioritisation

Score all hypotheses:

| # | Hypothesis | Impact (1–10) | Confidence (1–10) | Ease (1–10) | ICE Score | Priority |
|---|-----------|---------------|-------------------|-------------|-----------|----------|
| 1 | | | | | | |

ICE Score = (Impact + Confidence + Ease) ÷ 3
Sort by ICE Score descending. Run highest-scoring test first.

---

## OUTPUT

`docs/CRO-AUDIT.md` — funnel analysis, page audit, hypothesis list, A/B test design, ICE prioritisation.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swmk-cro.md
git commit -m "feat(swmk-cro): add CRO Audit skill v1.0"
```

---

### Task 12: `sw-onboarding`

**File:** `.claude/commands/sw-onboarding.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: sw-onboarding
description: |
  Run the client onboarding workflow — pre-kickoff admin checklist, kickoff meeting agenda, access provisioning list, communication cadence setup, and 90-day milestone plan. Works for software development and digital marketing clients.
  Trigger when: a new client has signed, kicking off a new project, onboarding a client, preparing for a project kickoff, or any time someone asks to onboard a client or set up a new project with a client.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Ensure every new client engagement starts with clear expectations, the right access, and a defined communication structure — from contract signing to the first 90 days.

## Prerequisites

- Signed contract / SOW
- First invoice raised
- Project type confirmed (software / marketing / combined)

---

## STEP 1 — Pre-Kickoff Admin

Complete before the kickoff call:

- [ ] Contract signed and filed
- [ ] Deposit invoice raised and sent
- [ ] Project folder created (shared drive / SharePoint)
- [ ] Project created in Azure DevOps / Jira / project management tool
- [ ] Client added to communication channel (Teams / Slack)
- [ ] NDA signed (if required)
- [ ] Brand assets / credentials request sent to client

---

## STEP 2 — Kickoff Agenda

**30-minute kickoff (small projects):**
1. Introductions (5 min)
2. Goals and success criteria review (10 min)
3. Timeline and milestones walkthrough (10 min)
4. Communication cadence agreement (5 min)

**60-minute kickoff (larger projects):**
1. Introductions + team overview (10 min)
2. Project goals and success metrics (15 min)
3. Scope and deliverables walkthrough (15 min)
4. Timeline, milestones, dependencies (10 min)
5. Communication cadence + escalation path (5 min)
6. Open questions (5 min)

Send agenda 24 hours in advance. Send summary within 24 hours after.

---

## STEP 3 — Access Provisioning

Collect from client / grant to team:

| Tool / System | Access Type | Given To | Status |
|---------------|-------------|----------|--------|
| Google Analytics (GA4) | Editor | Account Manager | ☐ |
| Google Search Console | Full | SEO Lead | ☐ |
| Google Tag Manager | Publish | Dev / Analyst | ☐ |
| Website CMS | Admin | Dev Lead | ☐ |
| Social accounts | Manager | Social Lead | ☐ |
| Ads accounts (Google/Meta) | Admin | Media Buyer | ☐ |
| CRM | Admin | Account Manager | ☐ |
| Brand asset library | View/Download | Creative Lead | ☐ |
| Git / source code repo | Developer | Dev Team | ☐ |

Flag any access not received within 5 business days of kickoff.

---

## STEP 4 — Communication Cadence

| Meeting | Frequency | Duration | Attendees | Format |
|---------|-----------|----------|-----------|--------|
| Weekly status update | Weekly | 30 min | PM + Client lead | Video call |
| Monthly review | Monthly | 60 min | Full team + Client stakeholders | Video call |
| Quarterly business review | Quarterly | 90 min | Senior team + Client exec | In person (preferred) |
| Ad-hoc query response | As needed | — | PM | Email / Teams within 4 hours |
| Emergency escalation | As needed | — | Senior PM + Client | Phone within 1 hour |

---

## STEP 5 — First 90 Days Milestones

| Milestone | Target Date | Owner | Status |
|-----------|-------------|-------|--------|
| Day 1: All access granted | | PM | ☐ |
| Day 1: Project set up in management tool | | PM | ☐ |
| Week 1: Discovery / audit complete | | Lead | ☐ |
| Week 2: Strategy / architecture approved | | Lead | ☐ |
| Month 1: First deliverable live | | Team | ☐ |
| Month 2: First performance review | | PM | ☐ |
| Month 3: Quarterly business review | | PM + Client | ☐ |

---

## STEP 6 — Client Health Scorecard

Review monthly:

| Dimension | Score 1–5 | Notes |
|-----------|-----------|-------|
| Communication responsiveness | | |
| Feedback turnaround speed | | |
| Scope adherence | | |
| Payment timeliness | | |
| Overall satisfaction (NPS proxy) | | |
| **Average** | | |

Score < 3 on any dimension → raise with account manager. Average < 3 → escalate to director.

---

## OUTPUT

`docs/ONBOARDING-[ClientName].md` — all checklists, kickoff notes, access log, cadence, 90-day plan.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/sw-onboarding.md
git commit -m "feat(sw-onboarding): add Client Onboarding skill v1.0"
```

---

### Task 13: `sw-retro`

**File:** `.claude/commands/sw-retro.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: sw-retro
description: |
  Facilitate a sprint retrospective — structured format (Start/Stop/Continue), dot voting, action item capture, team health check, and retrospective effectiveness scoring. Works for development and marketing teams.
  Trigger when: end of sprint, end of a project phase, running a team retrospective, improving team process, or any time someone asks to run a retro or retrospective.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Run a structured, time-boxed retrospective that produces 3 or fewer concrete actions — each with an owner and due date.

## Prerequisites

- Sprint / phase has ended
- Facilitator identified (ideally not the team lead)
- Collaboration tool ready (Miro / FigJam / whiteboard / sticky notes)

---

## STEP 1 — Pre-Retro Setup (5 min before)

- [ ] Timebox: 60 minutes total
- [ ] Invite: full delivery team (no external stakeholders)
- [ ] Prepare board with 3 columns: **Start · Stop · Continue**
- [ ] Check last retro's action items — did they get done?

---

## STEP 2 — Warm-Up (5 min)

One-word check-in. Go around the room (or Miro board):

> "Describe this sprint in one word."

Purpose: gets everyone talking, surfaces mood without opening debate.

---

## STEP 3 — Retrospective (25 min)

Silent writing phase (10 min): each person writes sticky notes for each column.

- **Start:** Things we should begin doing that we're not doing now
- **Stop:** Things we're doing that aren't working or are wasting time
- **Continue:** Things working well that we should keep doing

Read-out phase (15 min): each person reads their stickies aloud. Facilitator groups similar items.

---

## STEP 4 — Voting (5 min)

Each team member gets 3 votes (dot stickers or emoji reactions).
Vote for the items you feel are most important to act on.
Top 3 voted items become action candidates.

---

## STEP 5 — Action Items (15 min)

For each of the top 3 voted items, define an action:

| # | Theme | Action | Owner | Due Date |
|---|-------|--------|-------|----------|
| 1 | | | | By next sprint end |
| 2 | | | | |
| 3 | | | | |

Rules:
- Maximum 3 actions per retro (more = none get done)
- Every action must have exactly one owner
- Every action must be completable within the next sprint

---

## STEP 6 — Team Health Check (5 min)

Rate 1–5 (anonymous — use anonymous poll or folded paper):

| Dimension | Score |
|-----------|-------|
| Delivery (did we ship what we planned?) | /5 |
| Quality (are we proud of the work?) | /5 |
| Fun (are we enjoying the work?) | /5 |
| Learning (are we growing?) | /5 |
| Mission (do we understand why we're doing this?) | /5 |
| Speed (can we move faster?) | /5 |
| **Average** | /5 |

Score < 3 on any dimension → discuss briefly, add action if needed.

---

## STEP 7 — Retrospective Effectiveness (2 min)

Before closing, check:

| Check | Result |
|-------|--------|
| Did last retro's 3 actions all get done? | Y / N / Partial |
| Did this retro produce ≤ 3 actions with owners? | Y / N |
| Did everyone speak at least once? | Y / N |

If last retro's actions weren't completed → discuss why before adding new ones.

---

## OUTPUT

`docs/RETRO-[SprintName]-[YYYY-MM-DD].md` — warm-up notes, Start/Stop/Continue board, action items, health scores, effectiveness check.
Send to team within 1 hour of closing.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/sw-retro.md
git commit -m "feat(sw-retro): add Sprint Retrospective skill v1.0"
```

---

### Task 14: `swp-api`

**File:** `.claude/commands/swp-api.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swp-api
description: |
  Design and document a REST API — endpoint naming conventions, HTTP method usage, request/response structure, error response format, authentication pattern, OpenAPI 3.0 spec template, and Swagger UI setup. Produces API-DESIGN.md and openapi.yaml.
  Trigger when: designing a new API, documenting existing endpoints, setting up Swagger, writing an API spec, reviewing API design, or any time someone asks to design or document an API.
compatibility: Any backend stack — framework-agnostic conventions
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a consistently designed, fully documented API that frontend developers and external consumers can use without asking questions.

## Prerequisites

- Domain entities defined (from ENTITIES.md or DB-DESIGN.md if available)
- Authentication method decided
- Stack confirmed (ASP.NET Core / Node / Django / etc.)

---

## STEP 1 — Naming Conventions

Apply these rules to all endpoints:

| Rule | Correct | Wrong |
|------|---------|-------|
| Plural nouns for collections | `/api/v1/users` | `/api/v1/user` |
| Kebab-case for multi-word | `/api/v1/order-items` | `/api/v1/orderItems` |
| Versioned prefix | `/api/v1/` | `/api/` |
| No verbs in paths | `/api/v1/users/{id}` | `/api/v1/getUser` |
| Nested for ownership | `/api/v1/users/{id}/orders` | `/api/v1/orders?userId=` |

---

## STEP 2 — HTTP Method Semantics

| Method | Use For | Success Code | Body |
|--------|---------|-------------|------|
| GET | Read resource(s) | 200 | Response only |
| POST | Create new resource | 201 | Request + Response |
| PUT | Replace full resource | 200 | Request + Response |
| PATCH | Partial update | 200 | Request + Response |
| DELETE | Remove resource | 204 | None |

---

## STEP 3 — Request / Response Structure

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

**Filtering:** Use query params — `/api/v1/users?status=active&role=admin`
**Sorting:** `/api/v1/users?sortBy=createdAt&sortOrder=desc`

---

## STEP 4 — Error Response Format (RFC 7807)

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
| 400 | Bad request — malformed JSON or missing required fields |
| 401 | Not authenticated |
| 403 | Authenticated but not authorised |
| 404 | Resource not found |
| 409 | Conflict — duplicate or state mismatch |
| 422 | Validation failed |
| 500 | Unexpected server error (never expose stack trace) |

---

## STEP 5 — Authentication

| Pattern | When to Use |
|---------|-------------|
| Bearer JWT in `Authorization` header | Default for SPA / mobile clients |
| API Key in `X-Api-Key` header | Machine-to-machine / third-party integrations |
| OAuth 2.0 (Auth Code flow) | When acting on behalf of a user via external app |

Token expiry: access token 15 min · refresh token 7 days.

---

## STEP 6 — OpenAPI 3.0 Spec Template

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

## STEP 7 — Breaking vs Non-Breaking Changes

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

`docs/API-DESIGN.md` — conventions, error format, auth pattern, breaking change policy.
`docs/openapi.yaml` — OpenAPI 3.0 spec ready for Swagger UI.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swp-api.md
git commit -m "feat(swp-api): add API Design & Documentation skill v1.0"
```

---

### Task 15: `swc-monitor`

**File:** `.claude/commands/swc-monitor.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swc-monitor
description: |
  Set up application monitoring and alerting — observability stack selection, Four Golden Signals dashboards, alert threshold templates, runbook generation, on-call matrix, and SLA/SLO/SLI definitions. Produces MONITORING-PLAN.md and alert config scaffolding.
  Trigger when: deploying a new application, setting up monitoring, configuring alerts, writing runbooks, defining SLAs, or any time someone asks to set up observability, monitoring, or alerting.
compatibility: Application Insights / Prometheus+Grafana / Datadog
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Ensure every production application has observable health, actionable alerts, and documented runbooks before go-live.

## Prerequisites

- Cloud platform confirmed (Azure / AWS / GCP)
- Application stack confirmed
- SLA targets from SRS.md NFR section

---

## STEP 1 — Observability Stack Selection

| Scenario | Recommended Stack |
|----------|------------------|
| Azure-hosted (.NET / Node) | Application Insights + Azure Monitor |
| Multi-cloud or self-hosted | Prometheus + Grafana + Alertmanager |
| Commercial SaaS preference | Datadog |
| Serverless (Lambda / Functions) | Cloud-native (CloudWatch / Azure Monitor) |

---

## STEP 2 — The Four Golden Signals

Instrument and dashboard these four signals for every service:

| Signal | What to Measure | Alert Threshold |
|--------|----------------|-----------------|
| **Latency** | P95 response time (ms) | > 1000ms for 5 min |
| **Traffic** | Requests per second | < 10% of baseline for 10 min (traffic drop = upstream issue) |
| **Errors** | HTTP 5xx rate (%) | > 1% for 5 min |
| **Saturation** | CPU % + Memory % | > 85% for 10 min |

---

## STEP 3 — Alert Threshold Templates

Application Insights / Azure Monitor alert rules:

```json
[
  {
    "name": "High Error Rate",
    "signal": "requests/failedRequests",
    "operator": "GreaterThan",
    "threshold": 1,
    "unit": "Percent",
    "aggregation": "Average",
    "windowSize": "PT5M",
    "severity": 1,
    "action": "PagerDuty / email on-call"
  },
  {
    "name": "High P95 Latency",
    "signal": "requests/duration",
    "operator": "GreaterThan",
    "threshold": 1000,
    "unit": "Milliseconds",
    "aggregation": "Percentile95",
    "windowSize": "PT5M",
    "severity": 2,
    "action": "Email dev lead"
  },
  {
    "name": "High CPU",
    "signal": "performanceCounters/processCpuPercentage",
    "operator": "GreaterThan",
    "threshold": 85,
    "unit": "Percent",
    "aggregation": "Average",
    "windowSize": "PT10M",
    "severity": 2,
    "action": "Email dev lead"
  }
]
```

---

## STEP 4 — Dashboard Layout

Standard dashboard sections:

| Panel | Metrics | Visualisation |
|-------|---------|---------------|
| Service Health | Error rate, Availability % | Stat + colour threshold |
| Request Volume | RPS over time | Time series |
| Latency | P50 / P95 / P99 | Time series |
| Error Breakdown | 5xx by endpoint | Bar chart |
| Resource Usage | CPU %, Memory %, Disk | Gauge |
| Dependency Health | DB response time, external API errors | Time series |

---

## STEP 5 — Runbook Template

Create one runbook per alert:

```markdown
## Runbook: [Alert Name]

**Alert:** [Name as configured in monitoring tool]
**Severity:** P1 / P2 / P3
**SLA impact:** Yes / No

### Symptoms
- [What the alert fires on]
- [What users may experience]

### Diagnosis Steps
1. Open [Dashboard URL]
2. Check [specific panel] — look for [pattern]
3. Check [log query / trace] — command: `[exact query]`
4. If [condition], proceed to Fix A. If [other condition], Fix B.

### Fix A: [Most common cause]
1. [Step 1]
2. [Step 2]
Expected outcome: [metric returns to normal within X minutes]

### Fix B: [Less common cause]
1. [Step 1]
Expected outcome: [...]

### Escalation
If not resolved in 30 minutes → escalate to [Name / role] via [channel].

### Post-Incident
- [ ] Write incident report (5 Whys)
- [ ] Create ticket for root cause fix
- [ ] Update this runbook if steps were wrong
```

---

## STEP 6 — On-Call Matrix

| Time | Primary | Secondary | Escalation |
|------|---------|-----------|------------|
| Mon–Fri 9am–6pm | [Name] | [Name] | Engineering Lead |
| Mon–Fri 6pm–9am | [Name] | [Name] | Engineering Lead |
| Weekends | [Name] | [Name] | CTO |

Response time SLA: P1 = 15 min · P2 = 1 hour · P3 = next business day.

---

## STEP 7 — SLA / SLO / SLI Definitions

```
SLA (Service Level Agreement — contractual):
  Availability : 99.9% uptime per calendar month (= max 43.8 min downtime)
  Response time: P95 < 1000ms

SLO (Service Level Objective — internal target, stricter than SLA):
  Availability : 99.95% (= max 21.9 min downtime)
  Error rate   : < 0.5%
  P95 latency  : < 800ms

SLI (Service Level Indicator — what we measure):
  Availability : (successful requests ÷ total requests) × 100
  Error rate   : (5xx responses ÷ total responses) × 100
  Latency      : P95 of request duration from Application Insights
```

Error budget = 100% - SLO = 0.05% downtime/month = 21.9 minutes.

---

## OUTPUT

`docs/MONITORING-PLAN.md` — stack selection, golden signals, alert thresholds, dashboard spec, runbook template, on-call matrix, SLA/SLO/SLI.
`docs/alerts-config.json` — alert rule definitions ready for import.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swc-monitor.md
git commit -m "feat(swc-monitor): add Monitoring & Alerting Setup skill v1.0"
```

---

## Phase 3 — Nice to Have

---

### Task 16: `swmk-brand`

**File:** `.claude/commands/swmk-brand.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swmk-brand
description: |
  Define or document brand guidelines — brand personality, tone of voice, colour palette, typography system, logo usage rules, imagery style, and asset library conventions. Produces BRAND-GUIDELINES.md.
  Trigger when: creating a new brand, onboarding a new client, auditing brand consistency, briefing a designer, documenting brand standards, or any time someone asks to write or review brand guidelines.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a brand guidelines document that any designer, copywriter, or developer can use to create on-brand work without consulting the original brand team.

## Prerequisites

- Brand name and product/service overview
- Existing logo files (if brand already exists)
- Any existing colour or font choices

---

## STEP 1 — Brand Personality

Define 3–5 adjectives that describe the brand:

| Adjective | In Practice | NOT This |
|-----------|-------------|----------|
| e.g. Authoritative | Data-backed claims, precise language | Vague generalisations |
| e.g. Approachable | Conversational tone, plain English | Jargon, formal distance |
| e.g. Innovative | Forward-looking language, new solutions | Referencing the past |

---

## STEP 2 — Tone of Voice

| Element | Guideline |
|---------|-----------|
| Reading age target | Grade 8 (Flesch-Kincaid 60–70) |
| Sentence length | Average < 20 words |
| Person | Second person ("you") for client comms; first person plural ("we") for brand voice |
| Active vs passive | Active voice always |
| Banned words | [List — e.g. "leverage", "synergy", "seamless"] |
| Punctuation style | Oxford comma — yes / no |

DO examples (3 short sentences showing the brand voice):
DON'T examples (3 showing what to avoid):

---

## STEP 3 — Colour Palette

| Colour Role | Name | Hex | RGB | Use |
|-------------|------|-----|-----|-----|
| Primary | | #XXXXXX | rgb() | Main brand — CTAs, headings |
| Secondary | | #XXXXXX | | Supporting — backgrounds, accents |
| Accent | | #XXXXXX | | Highlights, icons |
| Neutral Dark | | #XXXXXX | | Body text |
| Neutral Light | | #XXXXXX | | Backgrounds |
| Error | | #D32F2F | | Errors, alerts |
| Success | | #388E3C | | Confirmations |

Accessibility check: primary on white background must pass WCAG AA contrast (4.5:1 for text).

---

## STEP 4 — Typography

| Role | Font Family | Weight | Size | Line Height |
|------|-------------|--------|------|-------------|
| Display / Hero | | Bold | 48–64px | 1.1 |
| H1 | | Bold | 36–48px | 1.2 |
| H2 | | SemiBold | 28–36px | 1.3 |
| H3 | | SemiBold | 20–24px | 1.4 |
| Body | | Regular | 16px | 1.6 |
| Small / Caption | | Regular | 12–14px | 1.5 |

Font loading: use `font-display: swap`. Specify fallback stack.
Approved fonts only — do not substitute without brand approval.

---

## STEP 5 — Logo Usage Rules

| Rule | Detail |
|------|--------|
| Minimum size | 80px wide (digital) / 25mm wide (print) |
| Clear space | Minimum clear space = height of the logo's wordmark letter |
| Approved backgrounds | White, brand primary, brand secondary |
| Prohibited | Stretching, rotating, recolouring, adding drop shadow, placing on busy images |
| File formats | SVG (digital, preferred) · PNG transparent (digital fallback) · EPS (print) |

---

## STEP 6 — Imagery Style

| Element | Guideline |
|---------|-----------|
| Photography style | [e.g. natural light, candid, diverse people] |
| Illustration style | [e.g. flat vector, no gradients] |
| Colour treatment | [e.g. slight brand colour overlay, no heavy filters] |
| Avoid | [e.g. stock photo clichés — handshakes, generic office shots] |
| Approved sources | [e.g. Unsplash, proprietary shoot, commissioned illustrator] |

---

## STEP 7 — Asset Library

```
Folder structure:
brand-assets/
  logos/
    primary/       SVG + PNG (colour, white, black)
    secondary/     SVG + PNG variants
  colours/         Swatch files (.ase for Adobe, .clr for Sketch)
  fonts/           Licensed font files
  icons/           SVG icon set
  photography/     Approved photos by category
  templates/       PowerPoint, email header, social post templates
```

Naming convention: `[brand]-[asset-type]-[variant]-[size].[ext]`
Example: `acme-logo-primary-white-300px.png`

---

## OUTPUT

`docs/BRAND-GUIDELINES.md` — all sections above as a complete brand reference.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swmk-brand.md
git commit -m "feat(swmk-brand): add Brand Guidelines skill v1.0"
```

---

### Task 17: `swmk-pr`

**File:** `.claude/commands/swmk-pr.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swmk-pr
description: |
  Plan and execute a PR or media relations campaign — newsworthiness check, press release writing, media list building, pitch email, publication timeline, and response tracking. Produces PR-PLAN.md and a press release draft.
  Trigger when: announcing a product launch, sharing company news, writing a press release, building a media list, pitching journalists, or any time someone asks to write a press release or plan a PR campaign.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a press release and outreach plan that maximises media pickup for a newsworthy announcement.

## Prerequisites

- Story / announcement confirmed and approved by senior leadership
- Key spokesperson confirmed
- Embargo date (if applicable)

---

## STEP 1 — Newsworthiness Check

Score the story 1–5 on each criterion:

| Criterion | Score | Notes |
|-----------|-------|-------|
| Timeliness (is it happening now or soon?) | /5 | |
| Impact (how many people does it affect?) | /5 | |
| Novelty (is it genuinely new or different?) | /5 | |
| Human interest (is there a person / story angle?) | /5 | |
| Relevance (does it matter to our target media's audience?) | /5 | |
| **Total** | /25 | |

Score < 15: reconsider whether this warrants a press release. Consider a blog post instead.
Score ≥ 15: proceed.

---

## STEP 2 — Press Release Structure

```
FOR IMMEDIATE RELEASE [or: EMBARGOED UNTIL: date/time timezone]

HEADLINE: [8–12 words — most important fact first, active verb]
SUB-HEADLINE: [One sentence expanding the headline — optional]

[CITY, Date] — LEDE (first paragraph, 2–3 sentences):
[Who + What + When + Where + Why — the complete story in one paragraph.
A journalist should be able to write the story from this paragraph alone.]

BODY (2–3 paragraphs):
[Para 2: Supporting detail, context, statistics]
[Para 3: Quote from spokesperson — make it interesting, not corporate waffle]
[Para 4: Additional context, background, how to access/use/buy]

BOILERPLATE:
About [Company Name]
[3 sentences: what the company does, who it serves, key facts/figures.]

MEDIA CONTACT:
Name:
Title:
Email:
Phone:
```

---

## STEP 3 — Media List

| Publication | Journalist Name | Beat / Focus | Email | Tier | Relationship |
|-------------|-----------------|--------------|-------|------|--------------|
| | | | | 1=National / 2=Trade / 3=Local | Cold/Warm/Known |

Tier 1: National press and major online publications
Tier 2: Trade / industry publications
Tier 3: Local / regional press, niche blogs

Target: 5–10 Tier 2 contacts for most stories. Tier 1 only if genuinely national news.

---

## STEP 4 — Pitch Email Template

```
Subject: [Story angle in 8 words — not the press release headline]

Hi [First name],

[One sentence: why this story is relevant to their beat and audience.]

[Two sentences: the story in plain language — what happened and why it matters.]

[One sentence: why now / why this is timely.]

I have [spokesperson name and title] available for comment. Happy to provide the full release, images, and data on request.

Best,
[Name]
[Title] | [Company] | [Phone]
```

Keep pitch emails under 150 words. Never attach the full press release to the first email.

---

## STEP 5 — Publication Timeline

| Day | Action | Owner |
|-----|--------|-------|
| D-14 | Draft press release | PR lead |
| D-10 | Internal review + legal sign-off | Stakeholders |
| D-7 | Media list finalised, pitches drafted | PR lead |
| D-3 | Embargo pitches sent to Tier 1 contacts | PR lead |
| D-0 | Press release distributed — wire + direct email | PR lead |
| D+1 | Follow up with non-responding Tier 2 contacts | PR lead |
| D+5 | Coverage round-up report | PR lead |

---

## STEP 6 — Response Tracking

| Journalist | Publication | Pitch Sent | Response | Outcome |
|-----------|-------------|-----------|----------|---------|
| | | Date | Positive/No reply/Declined | Coverage / Interview / Nothing |

---

## OUTPUT

`docs/PR-PLAN.md` — newsworthiness score, media list, timeline.
`docs/PRESS-RELEASE-[YYYY-MM-DD].md` — press release draft ready for approval.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swmk-pr.md
git commit -m "feat(swmk-pr): add PR & Media Relations skill v1.0"
```

---

### Task 18: `swmk-crm`

**File:** `.claude/commands/swmk-crm.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swmk-crm
description: |
  Set up or audit a CRM system — pipeline stage definition, lead scoring model, automation sequence design, deal property standards, and reporting dashboards. Covers HubSpot, Salesforce, and Zoho. Produces CRM-SETUP.md.
  Trigger when: setting up a new CRM, auditing an existing CRM, defining a sales pipeline, building lead scoring, creating automation workflows, or any time someone asks to set up or improve a CRM.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a configured, documented CRM that a sales and marketing team can operate from day one — with clear pipeline stages, lead scoring criteria, and automated nurture sequences.

## Prerequisites

- CRM platform selected and account created (HubSpot / Salesforce / Zoho)
- Sales process documented at high level
- Team roles confirmed (sales, marketing, account management)

---

## STEP 1 — Platform Selection Guide

| Platform | Best For | Typical Cost | Key Strength |
|---|---|---|---|
| HubSpot | SMEs, marketing-led growth | Free → £400/mo | Marketing + CRM in one |
| Salesforce | Enterprise, complex sales | £75+/user/mo | Customisation, ecosystem |
| Zoho CRM | Cost-conscious SMEs | Free → £35/user/mo | Value, built-in suite |

---

## STEP 2 — Pipeline Stages

Define stages to match your sales process:

| Stage | Name | Definition | Exit Criteria |
|-------|------|------------|---------------|
| 1 | Prospect | In ICP, not yet contacted | Email sent / call booked |
| 2 | MQL | Engaged with marketing content | Demo / call requested |
| 3 | SQL | Sales qualified, problem confirmed | Proposal agreed to send |
| 4 | Proposal | Proposal sent | Decision expected date set |
| 5 | Negotiation | In pricing / terms discussion | Contract sent |
| 6 | Won | Contract signed, payment received | — |
| 7 | Lost | Decided not to proceed | Loss reason recorded |

---

## STEP 3 — Lead Scoring

Score leads automatically based on:

**Demographic fit (fit score — maximum 50 points):**
| Attribute | Criteria | Points |
|-----------|----------|--------|
| Company size | 10–200 employees | +20 |
| Industry | [Target industries] | +15 |
| Job title | Decision-maker / influencer | +15 |

**Behavioural engagement (engagement score — maximum 50 points):**
| Action | Points |
|--------|--------|
| Visited pricing page | +15 |
| Downloaded content (guide/whitepaper) | +10 |
| Opened 3+ emails in sequence | +10 |
| Attended webinar | +10 |
| Requested demo | +15 |
| Visited careers page | −10 |

Total score: fit + engagement.
- 80–100: Hot → immediate sales follow-up within 4 hours
- 50–79: Warm → add to nurture sequence
- < 50: Cold → continue marketing only

---

## STEP 4 — Automation Sequences

**Welcome / lead nurture sequence (triggered on new MQL):**

| Day | Action | Content |
|-----|--------|---------|
| 0 | Send email 1 | Welcome + key resource |
| 3 | Send email 2 | Case study / social proof |
| 7 | Send email 3 | Direct CTA: book a call |
| 10 | Internal task: sales follow-up call | Notify sales rep |
| 14 | If no response: send email 4 | "Last chance" re-engagement |
| 21 | If still no response: move to Cold | Remove from active nurture |

**Win / onboarding sequence (triggered on deal Won):**

| Day | Action |
|-----|--------|
| 0 | Send welcome email + intro to account manager |
| 1 | Create onboarding task in project management tool |
| 7 | Send onboarding checklist |

---

## STEP 5 — Deal Property Standards

Mandatory fields on every deal record:

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| Deal name | Text | Yes | [Company] — [Product/Service] |
| Deal value | Currency | Yes | Expected contract value |
| Close date | Date | Yes | Expected decision date |
| Pipeline stage | Dropdown | Yes | From Step 2 |
| Lead source | Dropdown | Yes | Inbound / Outbound / Referral / Event |
| Loss reason | Dropdown | If Lost | Price / Timing / Competitor / No need |
| Next action | Text | Yes | What is the next step |
| Next action date | Date | Yes | When will it happen |

---

## STEP 6 — Reporting Dashboards

Standard CRM reports:

| Report | Metrics | Review Cadence |
|--------|---------|----------------|
| Pipeline by stage | Deal count + value per stage | Weekly |
| Pipeline velocity | Avg days per stage, avg deal size | Monthly |
| Lead conversion rate | MQL → SQL → Won % | Monthly |
| Revenue forecast | Weighted pipeline by close date | Weekly |
| Source performance | Leads + revenue by lead source | Monthly |
| Rep performance | Deals created, closed, avg value per rep | Monthly |

---

## OUTPUT

`docs/CRM-SETUP.md` — platform selection, pipeline stages, lead scoring, automation sequences, property standards, dashboards.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swmk-crm.md
git commit -m "feat(swmk-crm): add CRM Setup skill v1.0"
```

---

### Task 19: `swp-mobile`

**File:** `.claude/commands/swp-mobile.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swp-mobile
description: |
  Plan a mobile application — native vs cross-platform decision, architecture pattern, platform-specific UX considerations, App Store / Play Store submission checklist, push notification strategy, deep-link setup, and offline-first data approach. Produces MOBILE-ARCH.md.
  Trigger when: starting a mobile app project, choosing between native and cross-platform, planning iOS or Android development, or any time someone asks to plan or design a mobile application.
compatibility: React Native / Flutter / Swift / Kotlin
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a mobile architecture decision record and launch checklist that a mobile development team can implement without additional research.

## Prerequisites

- Product brief / SRS (from `swp-srs`)
- Target platforms confirmed (iOS only / Android only / both)
- Team mobile experience level confirmed

---

## STEP 1 — Native vs Cross-Platform Decision

Score each option 1–5 for your context:

| Criterion | React Native | Flutter | Native (Swift/Kotlin) |
|-----------|-------------|---------|----------------------|
| Team existing skill | | | |
| Time to market | | | |
| Performance requirements | | | |
| Platform-specific features needed | | | |
| Long-term maintenance | | | |
| **Total** | /25 | /25 | /25 |

- React Native: Best for JS teams, fast iteration, good ecosystem
- Flutter: Best for pixel-perfect UI across platforms, growing ecosystem
- Native: Best for maximum performance, complex device integrations, large teams

---

## STEP 2 — Architecture Pattern

Recommended: **MVVM with Clean Architecture layers**

```
Presentation Layer  → Screens / Views / ViewModels
Domain Layer        → Use Cases / Business Logic (no framework dependencies)
Data Layer          → Repositories → Remote (API) + Local (SQLite/Realm)
```

State management (choose one):
- React Native: Redux Toolkit or Zustand
- Flutter: Riverpod or Bloc
- Native iOS: Combine + @StateObject
- Native Android: ViewModel + StateFlow

---

## STEP 3 — Platform UX Guidelines

| Element | iOS (Apple HIG) | Android (Material 3) |
|---------|----------------|---------------------|
| Navigation | Tab bar (bottom) + navigation stack | Bottom navigation + back stack |
| Touch target | 44×44pt minimum | 48×48dp minimum |
| Typography | SF Pro (system font) | Roboto / Google Sans |
| Safe area | Respect notch + Dynamic Island | Respect status bar + gesture nav |
| Back gesture | Swipe right (Edge swipe) | Android back button + gesture |
| Alerts | UIAlertController style | Material Dialog style |

---

## STEP 4 — App Store Submission Checklist

**Apple App Store:**
- [ ] Apple Developer account active (£99/year)
- [ ] App ID created in Developer Portal
- [ ] Certificates and provisioning profiles generated
- [ ] Screenshots: 6.7" iPhone + 12.9" iPad (if universal)
- [ ] App preview video (optional but improves conversion)
- [ ] Privacy policy URL provided
- [ ] Age rating questionnaire completed
- [ ] TestFlight beta tested with 5+ external testers

**Google Play Store:**
- [ ] Google Play Developer account active ($25 one-time)
- [ ] Keystore file generated and backed up securely
- [ ] Screenshots: phone + 7" tablet + 10" tablet
- [ ] Feature graphic (1024×500px)
- [ ] Content rating questionnaire completed
- [ ] Data safety form completed
- [ ] Internal testing track tested before production release

---

## STEP 5 — Push Notification Strategy

| Notification Type | Trigger | Opt-in Required? | Frequency Cap |
|-------------------|---------|-----------------|---------------|
| Transactional (order update, message received) | System event | No (iOS) / No | No cap |
| Promotional (sale, new feature) | Marketing trigger | Yes | Max 2/week |
| Re-engagement | User inactive 7+ days | Yes | Max 1/week |

Implementation:
- iOS: APNs via Firebase Cloud Messaging (FCM) or direct APNs
- Android: FCM
- Always request permission at a contextual moment (not on first launch)
- Provide in-app notification preference centre

---

## STEP 6 — Deep Links & Universal Links

| Link Type | Platform | Use For |
|-----------|----------|---------|
| Universal Links | iOS | Open app from web URL — fallback to App Store |
| App Links | Android | Open app from web URL — fallback to Play Store |
| Custom Scheme | Both | Internal navigation only (not for marketing links) |

Setup:
- iOS: Add `apple-app-site-association` file to `/.well-known/` on web domain
- Android: Add `assetlinks.json` file to `/.well-known/` on web domain
- Test with branch.io or Firebase Dynamic Links for cross-platform deep linking

---

## STEP 7 — Offline-First Data Strategy

| Scenario | Approach |
|----------|----------|
| Read-heavy (news, catalogue) | Cache API responses locally (SQLite / Realm / Hive) with TTL |
| Write-heavy (forms, orders) | Queue writes locally, sync when connection restored |
| Real-time (chat, live data) | WebSocket with local buffer; reconnect with exponential backoff |
| Conflict resolution | Last-write-wins for simple data; version vectors for collaborative data |

Show a clear offline indicator in the UI. Never fail silently.

---

## OUTPUT

`docs/MOBILE-ARCH.md` — platform decision, architecture pattern, UX guidelines, store checklists, push strategy, deep links, offline approach.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swp-mobile.md
git commit -m "feat(swp-mobile): add Mobile App Planning skill v1.0"
```

---

### Task 20: `sw-meeting`

**File:** `.claude/commands/sw-meeting.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: sw-meeting
description: |
  Facilitate any business meeting — agenda templates for standup, check-in, workshop, and all-hands formats; decision log structure; action item tracking; pre-meeting checklist; and post-meeting summary format. Works for development and marketing teams.
  Trigger when: preparing for a meeting, writing a meeting agenda, running a standup, facilitating a workshop, capturing meeting notes, or any time someone asks to plan, facilitate, or document a meeting.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Run meetings that end with clear decisions and owned actions — not just a feeling that things were discussed.

## Prerequisites

- Meeting type selected
- Attendees confirmed
- Meeting invite sent 24 hours in advance (with agenda attached)

---

## STEP 1 — Meeting Type Selector

| Meeting Type | Duration | Frequency | Purpose |
|---|---|---|---|
| Daily standup | 15 min | Daily | Sync blockers and progress |
| Weekly check-in | 30 min | Weekly | Status, decisions, priorities |
| Monthly review | 60 min | Monthly | KPIs, retrospective, planning |
| Project kickoff | 60–90 min | Once | Align on goals and approach |
| Workshop | 90–120 min | As needed | Solve a specific problem |
| All-hands | 30–60 min | Monthly/quarterly | Company update, culture |

---

## STEP 2 — Agenda Templates

**Daily Standup (15 min — no chairs, async-first option):**
1. What did I complete since last standup? (30s per person)
2. What will I complete before next standup? (30s per person)
3. Any blockers? (raise, don't solve here — park for after)

**Weekly Check-in (30 min):**
1. Review last week's actions — done or not? (5 min)
2. Key updates / news (5 min)
3. Decisions needed this week (10 min)
4. Blockers and risks (5 min)
5. New actions + owners (5 min)

**Monthly Review (60 min):**
1. KPI scorecard review (15 min)
2. What went well / what didn't (10 min)
3. Key decisions for the month ahead (20 min)
4. Actions and owners (10 min)
5. AOB (5 min)

**Workshop (90–120 min):**
1. Problem statement alignment (10 min)
2. Individual idea generation — silent (15 min)
3. Share and discuss (20 min)
4. Dot vote on best ideas (10 min)
5. Solution design for top idea (30 min)
6. Action plan (15 min)

---

## STEP 3 — Decision Log

Record every decision made in a meeting:

| # | Decision | Rationale | Owner | Date | Revisit Date |
|---|----------|-----------|-------|------|--------------|
| 1 | | Why this decision | | | If applicable |

A decision must be: specific, actionable, and owned by exactly one person.
Decisions without owners are intentions, not decisions.

---

## STEP 4 — Action Item Format

| # | Action | Owner | Due Date | Status |
|---|--------|-------|----------|--------|
| 1 | | | | Open / Done |

Rules:
- One owner per action (never "the team")
- Due date within the next meeting cycle (standup = tomorrow / weekly = by next week)
- Maximum 5 actions per meeting
- Review previous actions before adding new ones

---

## STEP 5 — Pre-Meeting Checklist

Send 24 hours before:
- [ ] Agenda sent to all attendees
- [ ] Relevant pre-reads attached or linked
- [ ] Meeting room / video link confirmed
- [ ] Previous meeting's action items reviewed — check which are done
- [ ] Decision-maker confirmed attending (if a decision is needed, don't hold meeting without them)

---

## STEP 6 — Post-Meeting Summary

Send within 24 hours of the meeting closing:

```
Meeting: [Name]
Date: [YYYY-MM-DD]
Attendees: [Names]

## Decisions Made
1. [Decision] — Owner: [Name]

## Actions
| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | | | |

## Notes
[Any context not captured above]

Next meeting: [Date] | [Link]
```

Keep summaries under one page. If longer, something went wrong in the meeting.

---

## OUTPUT

`docs/MEETING-[type]-[YYYY-MM-DD].md` — agenda, decisions, actions, summary.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/sw-meeting.md
git commit -m "feat(sw-meeting): add Meeting Facilitation skill v1.0"
```

---

### Task 21: `swmk-report`

**File:** `.claude/commands/swmk-report.md`

- [ ] **Step 1: Write the file**

```markdown
---
name: swmk-report
description: |
  Produce a monthly or quarterly marketing performance report — executive summary with RAG status, channel-by-channel performance breakdown, top campaigns, budget vs actual, key insights, and next period priorities. Produces MARKETING-REPORT-[YYYY-MM].md.
  Trigger when: producing a monthly marketing report, preparing a quarterly review, reporting on campaign performance, presenting results to a client or leadership team, or any time someone asks to write a marketing report.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a clear, honest performance report that tells stakeholders what happened, why, and what is changing as a result.

## Prerequisites

- Analytics access (GA4, platform dashboards, CRM)
- Previous period baselines (from last report or ANALYTICS-SETUP.md)
- Budget actuals from finance / account manager

---

## STEP 1 — Executive Summary

Three top-line KPIs with RAG status:

| KPI | Target | Actual | vs Target | Status |
|-----|--------|--------|-----------|--------|
| [e.g. Leads generated] | | | +/-% | 🟢 On track / 🟡 At risk / 🔴 Off track |
| [e.g. Website sessions] | | | | |
| [e.g. Revenue attributed] | | | | |

One-paragraph narrative (3 sentences max):
1. Overall performance headline
2. Most significant positive result
3. Most significant problem and what is being done about it

---

## STEP 2 — Channel Performance

| Channel | Sessions/Reach | Leads/Conversions | Cost | CPL / CPA | vs Last Period |
|---------|---------------|-------------------|------|-----------|----------------|
| Organic Search (SEO) | | | £0 | — | |
| Paid Search (Google) | | | £ | £ | |
| Paid Social (Meta) | | | £ | £ | |
| Email | | | £ | £ | |
| Social (organic) | | | £0 | — | |
| Direct / Referral | | | £0 | — | |
| **TOTAL** | | | **£** | **£** | |

---

## STEP 3 — Top Performing Campaigns

List top 3 campaigns by conversion volume:

| Campaign | Channel | Spend | Leads | CPL | Revenue | ROAS |
|----------|---------|-------|-------|-----|---------|------|
| 1 | | £ | | £ | £ | x |
| 2 | | £ | | £ | £ | x |
| 3 | | £ | | £ | £ | x |

ROAS = Revenue ÷ Spend. Target: ROAS > 3× for most paid campaigns.

---

## STEP 4 — Budget vs Actual

| Category | Budget | Actual | Variance (£) | Variance (%) |
|----------|--------|--------|--------------|--------------|
| Paid Media | £ | £ | | |
| Creative | £ | £ | | |
| Tools / Software | £ | £ | | |
| Events | £ | £ | | |
| **Total** | **£** | **£** | | |

Overspend > 10%: flag with explanation. Underspend > 20%: flag — potential missed opportunity.

---

## STEP 5 — Key Insights

**What worked this period (top 3):**
1. [Specific tactic or campaign] — [result]
2.
3.

**What didn't work (top 3):**
1. [Specific tactic] — [result and hypothesis for why]
2.
3.

**Anomalies or surprises:**
- [Anything unexpected — positive or negative]

---

## STEP 6 — Next Period Priorities

| Priority | Action | Owner | Target Impact | Budget Required |
|----------|--------|-------|---------------|-----------------|
| 1 (highest) | | | | £ |
| 2 | | | | £ |
| 3 | | | | £ |

No more than 3 priorities. Each must directly address a finding from Step 5.

---

## STEP 7 — Appendix

Include raw data tables for:
- Full channel breakdown by week
- All active campaigns with daily/weekly metrics
- Keyword rankings (if SEO programme active)
- Email sequence metrics (open rate, CTR, unsubscribe by email)
- Social follower growth and engagement by platform

---

## OUTPUT

`docs/MARKETING-REPORT-[YYYY-MM].md` — complete report ready for client or leadership presentation.
Send within 5 business days of the period end.
```

- [ ] **Step 2: Verify format**

- [ ] **Step 3: Commit**
```
git add .claude/commands/swmk-report.md
git commit -m "feat(swmk-report): add Marketing Reporting skill v1.0"
```

---

## Self-Review

### Spec Coverage Check

| Requirement | Task |
|-------------|------|
| swmk-* namespace (digital marketing) | Tasks 1–4, 7–11, 16–18, 21 ✅ |
| sw-* org-wide skills | Tasks 5, 6, 12, 13, 20 ✅ |
| swp-* planning extensions | Task 14, 19 ✅ |
| swc-* cloud extensions | Task 15 ✅ |
| All 21 skills with complete content | ✅ |
| Each skill has format checklist step | ✅ |
| Each skill has commit step | ✅ |

### Placeholder Scan

No TBDs, TODOs, or "implement later" patterns present. All tables have concrete column headers and example values. All commit messages use consistent `feat(<skill-id>):` format.

### Consistency Check

All 21 skill files use identical:
- Version header format (`Version : 1.0 / Updated : 2026-05-18 / Author : SmartWorkz`)
- Changelog table format
- H2 STEP headings
- OUTPUT section as final section
