# Org-Wide Skills Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 21 new `sw_`-prefixed skill files covering the digital marketing (`swmk-*`) and cross-functional org-wide (`sw-*`) domains missing from the SmartWorkz ToolKit.

**Architecture:** Each skill is a standalone `.md` file in `.claude/commands/` following the ToolKit skill format â€” YAML frontmatter with `name` + `description`, then a structured body with workflow steps, gates, and output artifacts. Digital marketing skills mirror the structure of existing planning skills (`swp-srs`, `swp-plan`) adapted for marketing use cases. Org-wide skills follow the lighter `sw-communication` pattern.

**Tech Stack:** Markdown skill files Â· SmartWorkz ToolKit conventions Â· `sw-` BEM naming Â· YAML frontmatter Â· Git

---

## Skill Format Reference

Every skill file in this plan must follow this template:

```markdown
---
name: <skill-id>
description: |
  <What it does and when to trigger â€” be explicit about trigger phrases>
compatibility: <optional â€” stack or context requirements>
---

Version  : 1.0
Updated  : YYYY-MM-DD
Author   : <name>

| Version | Date       | Author  | Notes               |
|---------|------------|---------|---------------------|
| 1.0     | YYYY-MM-DD | <name>  | Initial release     |

---

## Purpose

<1-2 sentence summary>

## Prerequisites

- <what must exist before running this skill>

## STEP 1 â€” <Step Name>

<Instructions>

## OUTPUT

<What files/artifacts are produced>
```

**Naming rules:**
- `swmk-*` = Digital Marketing namespace
- `sw-*` = Org-wide cross-functional
- `swp-*` = Planning extensions
- `swc-*` = Cloud extensions
- File name = `<skill-id>.md`, saved to `.claude/commands/`

---

## Phase 1 â€” MUST HAVE (6 skills)

These 6 skills are blocking â€” the org cannot run marketing projects without them.

---

### Task 1: `swmk-srs` â€” Marketing Project SRS

**Files:**
- Create: `.claude/commands/swmk-srs.md`

**Purpose:** Structured requirements doc for marketing projects (campaign builds, website redesigns, social strategies). Mirrors `swp-srs` for the marketing side. Produces `docs/MARKETING-SRS.md`.

- [ ] **Step 1: Draft the skill structure**

The skill must cover these sections in order:
1. Project overview (client, brand, objectives)
2. Target audience definition (personas, demographics, pain points)
3. Channel strategy (which platforms/channels and why)
4. Success metrics (KPIs, measurement plan)
5. Budget and timeline
6. Deliverables list
7. Risks and constraints
8. Go/No-Go gate

- [ ] **Step 2: Write the skill file**

Create `.claude/commands/swmk-srs.md` with this exact content:

```markdown
---
name: swmk-srs
description: |
  Review and finalize a Marketing Requirements Specification (MRS) for any digital marketing project â€” campaigns, website builds, SEO programmes, social media strategies, or brand launches. Validates audience definition, channel fit, KPI completeness, budget feasibility, and deliverable scope. Issues a scored Go/No-Go decision. Phase 0 gate: all downstream marketing work is BLOCKED until approved.
  Trigger when: starting a new marketing project, reviewing a campaign brief, validating a client proposal, or any time someone asks to review or approve marketing requirements.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author      | Notes           |
|---------|------------|-------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz  | Initial release |

---

## Purpose

Produce a scored, signed-off Marketing Requirements Specification (MRS) that aligns all stakeholders on objectives, audience, channels, KPIs, budget, and deliverables before any creative or technical work begins.

## Prerequisites

- Client brief or project idea (even rough notes)
- Approximate budget range
- Target audience hypothesis

---

## STEP 1 â€” Gather Project Overview

Ask or infer from the brief:

| Field              | Required |
|--------------------|----------|
| Client / Brand     | Yes      |
| Project type       | Yes (campaign / SEO / social / website / brand) |
| Business objective | Yes (e.g. "increase leads by 30% in Q3") |
| Duration           | Yes      |
| Budget range       | Yes      |
| Primary contact    | Yes      |

Output a filled overview table. Flag any missing required fields as blockers.

---

## STEP 2 â€” Target Audience

Define at least one primary persona:

```
Persona Name    : [e.g. "Growth-Stage CMO"]
Age Range       : [e.g. 35â€“50]
Role / Industry : [e.g. B2B SaaS, 50â€“200 employees]
Pain Points     : [list 3]
Goals           : [list 3]
Channels Used   : [e.g. LinkedIn, Google Search, email newsletters]
Decision Trigger: [what makes them buy / engage]
```

Score persona completeness: 1 point per filled field. Minimum score 5/7 to proceed.

---

## STEP 3 â€” Channel Strategy

For each proposed channel, complete:

| Channel       | Rationale          | Content Type      | Frequency  | Owner      |
|---------------|--------------------|-------------------|------------|------------|
| [e.g. SEO]    | [why this channel] | [blog / landing]  | [weekly]   | [team/role]|

Flag channels with no stated rationale. Flag if no owned channel is identified.

---

## STEP 4 â€” KPI & Measurement Plan

Every project objective must map to at least one measurable KPI:

| Objective           | KPI                  | Baseline  | Target    | Measurement Tool      |
|---------------------|----------------------|-----------|-----------|-----------------------|
| [e.g. increase leads]| [e.g. form submissions] | [current] | [goal] | [e.g. GA4 + CRM] |

Score: 1 point per KPI with baseline + target + tool. Minimum 3 complete KPIs to proceed.

---

## STEP 5 â€” Budget & Timeline

```
Total Budget     : Â£/$/â‚¬ [amount]
  Creative       : [%]
  Paid Media     : [%]
  Tools / Tech   : [%]
  Contingency    : [min 10%]

Timeline
  Kick-off       : [date]
  Creative sign-off: [date]
  Launch         : [date]
  Review cycle   : [monthly / quarterly]
```

Flag if contingency < 10%. Flag if timeline has fewer than 2 review checkpoints.

---

## STEP 6 â€” Deliverables

List every output the project must produce:

| Deliverable          | Format       | Owner   | Due Date |
|----------------------|--------------|---------|----------|
| [e.g. SEO audit]     | [PDF report] | [name]  | [date]   |

Minimum 3 deliverables. Each must have an owner and due date.

---

## STEP 7 â€” Risks & Constraints

Identify at least 3 risks:

| Risk                     | Likelihood | Impact | Mitigation                  |
|--------------------------|------------|--------|-----------------------------|
| [e.g. budget cut]        | Medium     | High   | [e.g. phase deliverables]   |

---

## STEP 8 â€” Go / No-Go Scoring

Score the MRS across 6 dimensions (0â€“10 each):

| Dimension              | Score | Notes |
|------------------------|-------|-------|
| Audience Clarity       | /10   |       |
| Channel Fit            | /10   |       |
| KPI Completeness       | /10   |       |
| Budget Feasibility     | /10   |       |
| Deliverable Scope      | /10   |       |
| Risk Coverage          | /10   |       |
| **TOTAL**              | /60   |       |

- **50â€“60**: GO â€” proceed to `/swmk-campaign` or `/swmk-seo`
- **40â€“49**: CONDITIONAL â€” list blockers, re-review after fixes
- **< 40**: NO-GO â€” major rework required

---

## OUTPUT

Produce `docs/MARKETING-SRS.md` containing all step outputs plus the Go/No-Go verdict.
```

- [ ] **Step 3: Verify skill format**

Check against the format reference at the top of this plan:
- YAML frontmatter present with `name` and `description`
- Version header present
- Changelog table present
- All STEP headers are H2
- No TODOs or TBDs remaining

- [ ] **Step 4: Commit**

```
git add .claude/commands/swmk-srs.md
git commit -m "feat(swmk-srs): add Marketing Requirements Specification skill v1.0"
```

---

### Task 2: `swmk-seo` â€” SEO Audit & Optimization

**Files:**
- Create: `.claude/commands/swmk-seo.md`

**Purpose:** Keyword research, on-page audit, technical SEO checklist, and prioritized recommendations report. Produces `docs/SEO-AUDIT.md`.

- [ ] **Step 1: Draft the skill structure**

Sections:
1. Site crawl summary (URL count, indexability, redirects)
2. Technical SEO checklist (Core Web Vitals, sitemap, robots.txt, schema)
3. Keyword gap analysis (target vs. ranking keywords)
4. On-page audit (title tags, meta descriptions, H1s, content quality)
5. Backlink profile summary
6. Prioritized action plan (Quick Wins / Medium-Term / Long-Term)

- [ ] **Step 2: Write the skill file**

Create `.claude/commands/swmk-seo.md`:

```markdown
---
name: swmk-seo
description: |
  Run a structured SEO audit for a website â€” covers technical SEO, keyword gap analysis, on-page factors, and backlink health. Produces a prioritised SEO-AUDIT.md with Quick Win / Medium-Term / Long-Term action plan.
  Trigger when: onboarding a new client website, running a quarterly SEO review, investigating organic traffic drops, preparing an SEO proposal, or any time someone asks for an SEO audit or SEO recommendations.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author      | Notes           |
|---------|------------|-------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz  | Initial release |

---

## Purpose

Produce a prioritised SEO audit that identifies technical blockers, keyword opportunities, and on-page weaknesses â€” with a clear action plan ordered by effort vs. impact.

## Prerequisites

- Website URL
- Access to Google Search Console (or exported data)
- Access to keyword research tool data (Semrush / Ahrefs / free alternatives)
- MARKETING-SRS.md (optional â€” for business context)

---

## STEP 1 â€” Site Health Summary

Ask the user to provide or collect:

| Metric                     | Value | Status |
|----------------------------|-------|--------|
| Total indexed pages        |       | ðŸŸ¢/ðŸŸ¡/ðŸ”´ |
| Pages with 4xx errors      |       |        |
| Redirect chains (3+hops)   |       |        |
| Duplicate title tags       |       |        |
| Missing meta descriptions  |       |        |
| Pages blocked by robots    |       |        |
| Sitemap present & submitted|       |        |

Flag any metric with > 5% page share as a blocker.

---

## STEP 2 â€” Core Web Vitals

For the top 5 landing pages, record:

| Page URL  | LCP (s) | FID / INP (ms) | CLS  | Pass/Fail |
|-----------|---------|----------------|------|-----------|
|           |         |                |      |           |

Thresholds: LCP < 2.5s Â· INP < 200ms Â· CLS < 0.1
Source: Google PageSpeed Insights or Search Console Core Web Vitals report.

---

## STEP 3 â€” Keyword Gap Analysis

List top 10 target keywords from the brief / SRS:

| Keyword          | Monthly Volume | Current Rank | Gap  | Priority |
|------------------|----------------|--------------|------|----------|
|                  |                |              |      | H/M/L    |

Gap = "Not ranking" / "Page 2â€“3" / "Page 1 not top 3"
Flag keywords with volume > 500/mo and gap = Not Ranking as Quick Wins.

---

## STEP 4 â€” On-Page Audit

Sample top 10 pages (by traffic or importance):

| Page        | Title Tag OK | H1 Present | Meta Desc | Keyword in URL | Content > 300w |
|-------------|--------------|------------|-----------|----------------|----------------|
|             | âœ“/âœ—          | âœ“/âœ—        | âœ“/âœ—       | âœ“/âœ—            | âœ“/âœ—            |

Flag any page failing 3+ checks.

---

## STEP 5 â€” Backlink Profile

| Metric                    | Value |
|---------------------------|-------|
| Total referring domains   |       |
| Domains with DR > 40      |       |
| Toxic / spammy links (%)  |       |
| Lost links (last 30 days) |       |

Flag if toxic link percentage > 5%.

---

## STEP 6 â€” Prioritised Action Plan

Generate three-tier action plan:

**Quick Wins (0â€“4 weeks, high impact, low effort)**
- [ ] [Action 1] â€” [rationale] â€” [owner]
- [ ] [Action 2]

**Medium-Term (1â€“3 months)**
- [ ] [Action 1]

**Long-Term (3â€“6 months)**
- [ ] [Action 1]

---

## OUTPUT

Produce `docs/SEO-AUDIT.md` containing all step outputs and the prioritised action plan.
```

- [ ] **Step 3: Verify skill format** (same checklist as Task 1)

- [ ] **Step 4: Commit**

```
git add .claude/commands/swmk-seo.md
git commit -m "feat(swmk-seo): add SEO Audit & Optimization skill v1.0"
```

---

### Task 3: `swmk-campaign` â€” Campaign Planning

**Files:**
- Create: `.claude/commands/swmk-campaign.md`

**Purpose:** Campaign brief â†’ goals â†’ channels â†’ creative plan â†’ budget split â†’ timeline â†’ KPIs. Produces `docs/CAMPAIGN-PLAN.md`.

- [ ] **Step 1: Write the skill file**

Create `.claude/commands/swmk-campaign.md`:

```markdown
---
name: swmk-campaign
description: |
  Plan a digital marketing campaign end-to-end â€” brief, objectives, audience, channel mix, creative requirements, budget allocation, and timeline. Produces CAMPAIGN-PLAN.md. Blocked until MARKETING-SRS.md is approved.
  Trigger when: starting a new campaign, planning a product launch, planning a seasonal promotion, or any time someone asks to plan or brief a marketing campaign.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author      | Notes           |
|---------|------------|-------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz  | Initial release |

---

## Purpose

Produce a complete campaign plan that a creative team, media buyer, and account manager can all work from independently.

## Prerequisites

- `docs/MARKETING-SRS.md` approved (Go/No-Go = GO)
- Campaign name and rough idea
- Budget confirmed

---

## STEP 1 â€” Campaign Brief

```
Campaign Name   :
Type            : (awareness / lead-gen / retention / launch / seasonal)
Business Goal   : (e.g. "generate 200 qualified leads in 6 weeks")
Campaign Period : [start date] â†’ [end date]
Total Budget    : Â£/$/â‚¬
Primary CTA     : (e.g. "Book a demo", "Download guide", "Shop now")
```

---

## STEP 2 â€” Audience Targeting

For each segment being targeted:

| Segment Name | Demographics | Psychographics | Platform | Message Angle |
|---|---|---|---|---|
| | | | | |

Minimum 1 segment. Maximum 3 for a single campaign (more = creative fragmentation risk).

---

## STEP 3 â€” Channel Mix & Budget Split

| Channel          | Role in Funnel  | Budget (Â£/%) | Format           | Metric       |
|------------------|-----------------|--------------|------------------|--------------|
| [e.g. Google Ads]| Acquisition     | Â£500 / 40%   | Search text ads  | Clicks / CPL |
| [e.g. LinkedIn]  | Nurture         | Â£300 / 25%   | Sponsored posts  | Engagement   |
| [e.g. Email]     | Conversion      | Â£100 / 8%    | 3-email sequence | Open/CTR     |
| [e.g. Landing pg]| Conversion      | Â£150 / 12%   | Custom LP        | CVR          |
| Contingency      | â€”               | Â£200 / 15%   | â€”                | â€”            |

Total must equal 100%.

---

## STEP 4 â€” Creative Requirements

For each channel, list assets needed:

| Asset               | Format / Size   | Copy Brief (1 sentence)  | Owner  | Due Date |
|---------------------|-----------------|--------------------------|--------|----------|
| Hero banner         | 1200Ã—628px      | Lead with pain point     |        |          |
| Email header        | 600Ã—200px       | Brand + campaign hook    |        |          |
| LinkedIn post image | 1200Ã—627px      | Social proof angle       |        |          |

---

## STEP 5 â€” Timeline

| Milestone              | Date   | Owner    |
|------------------------|--------|----------|
| Brief signed off       |        |          |
| Creative assets ready  |        |          |
| Landing page live      |        |          |
| Campaign goes live     |        |          |
| Mid-campaign review    |        |          |
| Campaign ends          |        |          |
| Results report due     |        |          |

---

## STEP 6 â€” KPIs & Success Criteria

| Metric             | Baseline | Target   | Measurement Tool  |
|--------------------|----------|----------|-------------------|
| Impressions        |          |          | Platform dashboard|
| Clicks / CTR       |          |          | Platform dashboard|
| Leads / CVR        |          |          | GA4 + CRM         |
| Cost per Lead      |          |          | Platform dashboard|
| Revenue attributed |          |          | CRM               |

---

## OUTPUT

Produce `docs/CAMPAIGN-PLAN.md` containing all step outputs.
Notify: Creative lead, media buyer, account manager.
```

- [ ] **Step 2: Verify skill format**

- [ ] **Step 3: Commit**

```
git add .claude/commands/swmk-campaign.md
git commit -m "feat(swmk-campaign): add Campaign Planning skill v1.0"
```

---

### Task 4: `swmk-analytics` â€” Analytics Setup

**Files:**
- Create: `.claude/commands/swmk-analytics.md`

**Purpose:** GA4 property setup checklist, GTM container config, conversion event tracking, and reporting dashboard template. Produces `docs/ANALYTICS-SETUP.md`.

- [ ] **Step 1: Write the skill file**

Create `.claude/commands/swmk-analytics.md`:

```markdown
---
name: swmk-analytics
description: |
  Set up web analytics for a client project â€” GA4 property configuration, GTM container setup, conversion event tracking, and a reporting dashboard template. Produces ANALYTICS-SETUP.md with a verification checklist.
  Trigger when: onboarding a new website, launching a campaign, setting up tracking for a client, configuring GA4, setting up GTM, or any time someone asks to set up analytics or tracking.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author      | Notes           |
|---------|------------|-------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz  | Initial release |

---

## Purpose

Ensure every client project has correctly configured analytics from day one â€” GA4 property, GTM container, key conversion events, and a reporting baseline.

## Prerequisites

- Google account with Analytics Admin access
- Website URL and CMS/tech stack confirmed
- Conversion actions defined (from MARKETING-SRS.md or CAMPAIGN-PLAN.md)

---

## STEP 1 â€” GA4 Property Setup Checklist

```
Property Name       : [Client Name â€” Website]
Measurement ID      : G-XXXXXXXXXX
Data Retention      : 14 months (change from default 2 months)
Cross-domain        : [Yes / No â€” list domains if Yes]
Internal IP filter  : [Yes â€” add office + agency IPs]
Enhanced Measurement: [On â€” scroll, outbound clicks, site search, video]
```

Verify in GA4 Admin â†’ Data Streams â†’ Configure:
- [ ] Data stream active and receiving data (check Realtime report)
- [ ] Enhanced measurement enabled
- [ ] Internal traffic filter created
- [ ] Data retention set to 14 months

---

## STEP 2 â€” GTM Container Setup

```
Container Name      : [Client Name â€” Web]
Container ID        : GTM-XXXXXXX
GA4 Tag             : GA4 Configuration tag â†’ Measurement ID
Trigger             : All Pages
```

GTM Workspace checklist:
- [ ] GA4 Configuration tag firing on All Pages
- [ ] Preview mode tested â€” GA4 tag firing
- [ ] Container published (not just saved)
- [ ] GTM snippet in <head> AND <body> of site

---

## STEP 3 â€” Conversion Event Tracking

For each conversion action from the brief, create a GTM trigger + GA4 event:

| Conversion         | Trigger Type          | Event Name (GA4)     | Parameters        |
|--------------------|-----------------------|----------------------|-------------------|
| Form submission    | Form Submission       | `generate_lead`      | form_id, page_url |
| Button click       | Click â€” All Elements  | `cta_click`          | button_text, page |
| File download      | Click â€” Just Links    | `file_download`      | file_name         |
| Video play (75%)   | YouTube Video         | `video_progress`     | video_title       |
| Purchase           | Custom Event          | `purchase`           | value, currency   |

For each event:
- [ ] GTM trigger created and tested in Preview mode
- [ ] GA4 event visible in Realtime â†’ Events
- [ ] Event marked as conversion in GA4 Admin â†’ Conversions

---

## STEP 4 â€” Reporting Dashboard

Create a GA4 Exploration or Looker Studio template with these standard reports:

| Report             | Metrics                              | Dimension       |
|--------------------|--------------------------------------|-----------------|
| Traffic Overview   | Sessions, Users, Bounce Rate         | Channel / Source|
| Conversion Funnel  | Events â†’ Conversions â†’ CVR           | Page / Device   |
| Campaign Performance| Sessions, Conversions, Revenue      | Campaign / Medium|
| Top Content        | Views, Avg Engagement Time, Scroll % | Page Path       |
| Audience           | New vs Returning, Demographics       | Country / Device|

---

## STEP 5 â€” QA Verification

Run final QA before handoff:

- [ ] Send a test form â€” appears in GA4 Realtime as `generate_lead`
- [ ] Click main CTA â€” appears as `cta_click`
- [ ] Check GA4 DebugView â€” no unexpected events firing
- [ ] Check GTM Preview â€” no tags firing on 404 pages
- [ ] Confirm data visible in GA4 Reports within 24 hours

---

## OUTPUT

Produce `docs/ANALYTICS-SETUP.md` with all configuration details, Measurement ID, GTM ID, event list, and QA results.
```

- [ ] **Step 2: Verify skill format**

- [ ] **Step 3: Commit**

```
git add .claude/commands/swmk-analytics.md
git commit -m "feat(swmk-analytics): add Analytics Setup skill v1.0"
```

---

### Task 5: `sw-proposal` â€” Client Proposal / SOW

**Files:**
- Create: `.claude/commands/sw-proposal.md`

**Purpose:** Generate a scoped, professional client proposal with deliverables, timeline, pricing blocks, and terms. Usable for both software dev and marketing projects. Produces `docs/PROPOSAL-[client]-[date].md`.

- [ ] **Step 1: Write the skill file**

Create `.claude/commands/sw-proposal.md`:

```markdown
---
name: sw-proposal
description: |
  Generate a professional client proposal or Statement of Work (SOW) â€” covers executive summary, problem statement, proposed solution, deliverables, timeline, pricing, team, and terms. Works for software development and digital marketing projects.
  Trigger when: writing a proposal, creating a SOW, responding to an RFP, quoting a client, preparing pre-sales documents, or any time someone asks to write a proposal or statement of work.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author      | Notes           |
|---------|------------|-------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz  | Initial release |

---

## Purpose

Produce a persuasive, clearly scoped proposal that sets expectations, wins the work, and protects both sides.

## Prerequisites

- Client name, contact, and brief
- Approximate budget range (even if not confirmed)
- Preferred timeline

---

## STEP 1 â€” Inputs

```
Client Name         :
Contact Name        :
Project Name        :
Project Type        : (software / marketing / combined)
Budget Range        : Â£/$/â‚¬
Desired Start Date  :
Desired End Date    :
Key Decision Maker  :
Proposal Deadline   :
```

---

## STEP 2 â€” Executive Summary

Write 3 sentences:
1. Restate the client's problem or goal in their language
2. State the proposed solution at the highest level
3. State the primary outcome/benefit

Example:
> "[Client] wants to increase qualified inbound leads by 40% over the next quarter. We will deliver a targeted SEO and paid search programme supported by a redesigned landing page. This will position [Client] to capture demand from [audience] at lower cost-per-lead than current outbound spend."

---

## STEP 3 â€” Problem Statement

Expand on the client's situation:
- Current state (what is happening now)
- Pain points (why it matters)
- Cost of inaction (what happens if nothing changes)

Keep to 150â€“250 words. Use the client's own language where possible.

---

## STEP 4 â€” Proposed Solution

Describe the approach:
- What will be built/delivered and why
- Key decisions made and rationale
- What is explicitly OUT OF SCOPE (critical for SOW)

---

## STEP 5 â€” Deliverables & Milestones

| # | Deliverable               | Description                     | Due Date  |
|---|---------------------------|---------------------------------|-----------|
| 1 |                           |                                 |           |
| 2 |                           |                                 |           |

Each deliverable must have a clear acceptance criterion: "Client signs off on X" or "X is live and verified."

---

## STEP 6 â€” Pricing

Choose format based on project type:

**Fixed Price:**
| Phase         | Description          | Fee      |
|---------------|----------------------|----------|
| Discovery     |                      | Â£        |
| Build         |                      | Â£        |
| Launch        |                      | Â£        |
| **Total**     |                      | **Â£**    |

**Retainer:**
| Month | Scope                | Monthly Fee |
|-------|----------------------|-------------|
| 1â€“3   | [scope]              | Â£           |

Include: payment terms (e.g. 50% upfront, 50% on delivery), late payment clause.

---

## STEP 7 â€” Team

| Name / Role      | Responsibility                | Availability |
|------------------|-------------------------------|--------------|
|                  |                               | x days/week  |

---

## STEP 8 â€” Timeline

Visual week-by-week or phase breakdown. Use a simple table:

| Week / Phase  | Activities                    | Milestone       |
|---------------|-------------------------------|-----------------|
| Week 1        |                               |                 |
| Week 2        |                               |                 |

---

## STEP 9 â€” Terms (Standard Clauses)

Include these standard clauses (customise if needed):
- Intellectual property: all work product owned by client upon full payment
- Revisions: X rounds of revisions included; additional at Â£Y/hour
- Change requests: any scope change requires written approval and may affect timeline/cost
- Confidentiality: both parties agree to keep project details confidential
- Termination: either party may terminate with 14 days written notice

---

## OUTPUT

Produce `docs/PROPOSAL-[ClientName]-[YYYY-MM-DD].md` ready for PDF export or direct sharing.
```

- [ ] **Step 2: Verify skill format**

- [ ] **Step 3: Commit**

```
git add .claude/commands/sw-proposal.md
git commit -m "feat(sw-proposal): add Client Proposal / SOW skill v1.0"
```

---

### Task 6: `sw-estimation` â€” Project Estimation

**Files:**
- Create: `.claude/commands/sw-estimation.md`

**Purpose:** Story-point to hour conversion, effort breakdown by role, risk buffer calculation, and resource allocation. Usable for both dev and marketing projects. Produces `docs/ESTIMATION.md`.

- [ ] **Step 1: Write the skill file**

Create `.claude/commands/sw-estimation.md`:

```markdown
---
name: sw-estimation
description: |
  Estimate effort, cost, and timeline for any project type â€” software development or digital marketing. Breaks down work by role, applies risk buffers, and produces a confidence-scored estimate with high/low range. Produces ESTIMATION.md.
  Trigger when: quoting a project, planning a sprint, checking if a deadline is feasible, producing a proposal estimate, breaking down a project scope, or any time someone asks to estimate time, cost, or effort.
---

Version  : 1.0
Updated  : 2026-05-18
Author   : SmartWorkz

| Version | Date       | Author      | Notes           |
|---------|------------|-------------|-----------------|
| 1.0     | 2026-05-18 | SmartWorkz  | Initial release |

---

## Purpose

Produce a confidence-rated estimate with best / likely / worst case ranges and a clear risk buffer that protects the team and the client.

## Prerequisites

- Scope description or deliverables list (from SRS, proposal brief, or campaign plan)
- Team roles and day rates (if cost estimate required)
- Deadline or target date (if timeline validation required)

---

## STEP 1 â€” Scope Decomposition

Break the project into work items. Use the deliverables from PROPOSAL or SRS if available:

| # | Work Item              | Description                     | Role         |
|---|------------------------|---------------------------------|--------------|
| 1 |                        |                                 |              |
| 2 |                        |                                 |              |

Minimum 5 work items. If fewer exist, decompose further â€” no single item should exceed 3 days of effort.

---

## STEP 2 â€” Three-Point Estimate

For each work item, estimate Best / Likely / Worst case in hours:

| # | Work Item         | Best (h) | Likely (h) | Worst (h) | PERT (h) |
|---|-------------------|----------|------------|-----------|----------|
| 1 |                   |          |            |           |          |
| 2 |                   |          |            |           |          |
| **TOTAL**         |          |            |           |          |

PERT formula: `(Best + 4Ã—Likely + Worst) / 6`

---

## STEP 3 â€” Risk Buffer

Apply standard buffers to the PERT total:

| Risk Factor                    | Applies? | Add    |
|--------------------------------|----------|--------|
| New client / unknown codebase  | Y/N      | +15%   |
| New technology / first time    | Y/N      | +20%   |
| External dependencies (APIs)   | Y/N      | +10%   |
| Tight deadline (< 4 weeks)     | Y/N      | +10%   |
| Unclear requirements           | Y/N      | +25%   |
| Team at > 80% capacity         | Y/N      | +15%   |

Total buffer %: ___
Buffered estimate: PERT total Ã— (1 + buffer%)

---

## STEP 4 â€” Role Breakdown

Split buffered hours by role:

| Role              | Hours  | Day Rate (Â£) | Cost (Â£) |
|-------------------|--------|--------------|----------|
| Project Manager   |        |              |          |
| Developer / Tech  |        |              |          |
| Designer          |        |              |          |
| Copywriter        |        |              |          |
| QA / Testing      |        |              |          |
| **TOTAL**         |        |              |          |

---

## STEP 5 â€” Timeline Projection

```
Available capacity  : [X people Ã— Y days/week Ã— Z weeks]
Total hours needed  : [from Step 4]
Implied duration    : [Total hours Ã· weekly capacity]
Target deadline     : [from brief]
Gap (days)          : [deadline - implied end date]
```

If Gap < 0: flag timeline risk, suggest scope reduction or resource addition.

---

## STEP 6 â€” Confidence Score

Rate overall estimate confidence:

| Factor                          | Score (1â€“5) |
|---------------------------------|-------------|
| Requirements clarity            |             |
| Team familiarity with scope     |             |
| Past similar project data       |             |
| Stakeholder alignment           |             |
| **Average**                     |             |

- 4â€“5: High confidence â€” use likely estimate as commitment
- 3â€“4: Medium confidence â€” use likely + 15% buffer as commitment
- 1â€“3: Low confidence â€” use worst case or do a discovery phase first

---

## OUTPUT

Produce `docs/ESTIMATION.md` with all tables, the buffered total, role breakdown, timeline projection, and confidence score.
```

- [ ] **Step 2: Verify skill format**

- [ ] **Step 3: Commit**

```
git add .claude/commands/sw-estimation.md
git commit -m "feat(sw-estimation): add Project Estimation skill v1.0"
```

---

## Phase 2 â€” SHOULD HAVE (9 skills)

These skills extend coverage significantly. Build after Phase 1 is complete.

---

### Task 7: `swmk-content` â€” Content Strategy

**Files:**
- Create: `.claude/commands/swmk-content.md`

**Purpose:** Content pillar/cluster model, 90-day editorial calendar, tone-of-voice guide, content brief template. Produces `docs/CONTENT-STRATEGY.md`.

- [ ] **Step 1: Design key sections**

  1. Content audit (existing assets inventory)
  2. Pillar + cluster topic map (3â€“5 pillars, 5â€“10 clusters each)
  3. Tone-of-voice guide (3 adjectives, do/don't examples)
  4. 90-day editorial calendar (week-by-week, by channel)
  5. Content brief template (reusable)
  6. Distribution plan (where each piece is published and promoted)

- [ ] **Step 2: Write skill file** following the format reference

- [ ] **Step 3: Verify skill format**

- [ ] **Step 4: Commit**

```
git add .claude/commands/swmk-content.md
git commit -m "feat(swmk-content): add Content Strategy skill v1.0"
```

---

### Task 8: `swmk-email` â€” Email Campaign

**Files:**
- Create: `.claude/commands/swmk-email.md`

**Purpose:** Email campaign structure, 3-email sequence template, subject line A/B variants, send schedule, and deliverability checklist. Produces `docs/EMAIL-CAMPAIGN.md`.

- [ ] **Step 1: Design key sections**

  1. Campaign goal and audience segment
  2. Email sequence structure (Welcome / Nurture / CTA)
  3. Subject line variants (A/B pairs per email)
  4. Email body template (header, body, CTA, footer)
  5. Send schedule and frequency rules
  6. Deliverability checklist (SPF/DKIM/DMARC, list hygiene, unsubscribe)
  7. Success metrics (open rate, CTR, unsubscribe rate benchmarks)

- [ ] **Step 2: Write skill file** following the format reference

- [ ] **Step 3: Verify skill format**

- [ ] **Step 4: Commit**

```
git add .claude/commands/swmk-email.md
git commit -m "feat(swmk-email): add Email Campaign skill v1.0"
```

---

### Task 9: `swmk-social` â€” Social Media Planning

**Files:**
- Create: `.claude/commands/swmk-social.md`

**Purpose:** Platform-specific content matrix, 30-day posting schedule, hashtag strategy, engagement playbook. Produces `docs/SOCIAL-PLAN.md`.

- [ ] **Step 1: Design key sections**

  1. Platform selection rationale (LinkedIn / Instagram / X / TikTok / Facebook)
  2. Content matrix (content types Ã— platforms, with optimal formats)
  3. 30-day posting schedule (day/time/format/topic per platform)
  4. Hashtag strategy (branded + niche + broad tiers)
  5. Community engagement rules (response time, tone, escalation)
  6. Monthly performance scorecard (reach, engagement rate, follower growth)

- [ ] **Step 2: Write skill file** following the format reference

- [ ] **Step 3: Verify skill format**

- [ ] **Step 4: Commit**

```
git add .claude/commands/swmk-social.md
git commit -m "feat(swmk-social): add Social Media Planning skill v1.0"
```

---

### Task 10: `swmk-ads` â€” Paid Advertising

**Files:**
- Create: `.claude/commands/swmk-ads.md`

**Purpose:** Google Ads + Meta Ads campaign structure, audience targeting strategy, bid strategy selection, budget allocation, and weekly optimisation checklist. Produces `docs/ADS-PLAN.md`.

- [ ] **Step 1: Design key sections**

  1. Platform selection (Google Search / Display / Shopping / Meta / LinkedIn)
  2. Campaign structure (campaigns â†’ ad groups â†’ ads hierarchy)
  3. Audience targeting (demographics, interests, custom audiences, lookalikes)
  4. Keyword strategy (for Google â€” match types, negative keywords)
  5. Ad copy framework (headline variants, descriptions, CTAs)
  6. Bid strategy selection guide (manual CPC vs tCPA vs tROAS)
  7. Budget allocation by funnel stage
  8. Weekly optimisation checklist (CTR, Quality Score, frequency caps)

- [ ] **Step 2: Write skill file** following the format reference

- [ ] **Step 3: Verify skill format**

- [ ] **Step 4: Commit**

```
git add .claude/commands/swmk-ads.md
git commit -m "feat(swmk-ads): add Paid Advertising skill v1.0"
```

---

### Task 11: `swmk-cro` â€” Conversion Rate Optimization

**Files:**
- Create: `.claude/commands/swmk-cro.md`

**Purpose:** Landing page audit, hypothesis generation, A/B test design, funnel drop-off analysis. Produces `docs/CRO-AUDIT.md`.

- [ ] **Step 1: Design key sections**

  1. Funnel analysis (where are users dropping off?)
  2. Landing page audit (above-fold, headline, CTA, form, trust signals, social proof)
  3. Heuristic UX audit checklist (clarity, relevance, friction, distraction)
  4. Hypothesis template (If we change X, we expect Y, because Z)
  5. A/B test design (control vs variant, sample size calculator, significance threshold)
  6. Prioritisation matrix (ICE score â€” Impact / Confidence / Ease)

- [ ] **Step 2: Write skill file** following the format reference

- [ ] **Step 3: Verify skill format**

- [ ] **Step 4: Commit**

```
git add .claude/commands/swmk-cro.md
git commit -m "feat(swmk-cro): add CRO Audit skill v1.0"
```

---

### Task 12: `sw-onboarding` â€” Client Onboarding

**Files:**
- Create: `.claude/commands/sw-onboarding.md`

**Purpose:** Kickoff checklist, access provisioning list, communication cadence template, first-90-days milestone plan. Works for dev and marketing clients. Produces `docs/ONBOARDING-[client].md`.

- [ ] **Step 1: Design key sections**

  1. Pre-kickoff checklist (contract signed, invoice raised, accounts created)
  2. Kickoff agenda template (30/60/90 min options)
  3. Access provisioning list (tools to share: GA4, GTM, repo, ADO, Slack)
  4. Communication cadence (weekly standup, monthly review, escalation path)
  5. First 90 days milestone plan (Day 1 / Week 1 / Month 1 / Month 3)
  6. Client health scorecard (satisfaction, responsiveness, scope adherence)

- [ ] **Step 2: Write skill file** following the format reference

- [ ] **Step 3: Verify skill format**

- [ ] **Step 4: Commit**

```
git add .claude/commands/sw-onboarding.md
git commit -m "feat(sw-onboarding): add Client Onboarding skill v1.0"
```

---

### Task 13: `sw-retro` â€” Sprint Retrospective

**Files:**
- Create: `.claude/commands/sw-retro.md`

**Purpose:** Facilitator guide, structured retro format (What went well / Delta / Actions), action item tracking, team health scoring. Org-wide â€” usable by dev and marketing teams. Produces `docs/RETRO-[sprint]-[date].md`.

- [ ] **Step 1: Design key sections**

  1. Pre-retro setup (timebox: 60 min, invite list, Miro/FigJam board template)
  2. Warm-up activity (1-word check-in or ESVP)
  3. Retrospective format (Start/Stop/Continue or 4Ls or Mad/Sad/Glad â€” pick one)
  4. Voting and prioritisation (dot voting on top 3 themes)
  5. Action items (owner + due date, max 3 actions per retro)
  6. Team health check (6 dimensions: delivery, quality, fun, learning, mission, speed)
  7. Retro effectiveness score (did last retro's actions get done?)

- [ ] **Step 2: Write skill file** following the format reference

- [ ] **Step 3: Verify skill format**

- [ ] **Step 4: Commit**

```
git add .claude/commands/sw-retro.md
git commit -m "feat(sw-retro): add Sprint Retrospective skill v1.0"
```

---

### Task 14: `swp-api` â€” API Design & Documentation

**Files:**
- Create: `.claude/commands/swp-api.md`

**Purpose:** REST API design guide â€” endpoint naming, versioning strategy, OpenAPI spec generation, Swagger setup, error response standards. Produces `docs/API-DESIGN.md` and `docs/openapi.yaml`.

- [ ] **Step 1: Design key sections**

  1. Resource naming conventions (plural nouns, kebab-case, versioned `/api/v1/`)
  2. HTTP method usage (GET/POST/PUT/PATCH/DELETE semantics)
  3. Request/response structure standards (envelope, pagination, filtering)
  4. Error response format (RFC 7807 Problem Details)
  5. Authentication pattern (Bearer token / API key / OAuth2)
  6. OpenAPI 3.0 spec template (paths, components, schemas)
  7. Swagger UI setup guide
  8. Breaking vs non-breaking change classification

- [ ] **Step 2: Write skill file** following the format reference

- [ ] **Step 3: Verify skill format**

- [ ] **Step 4: Commit**

```
git add .claude/commands/swp-api.md
git commit -m "feat(swp-api): add API Design & Documentation skill v1.0"
```

---

### Task 15: `swc-monitor` â€” Monitoring & Alerting Setup

**Files:**
- Create: `.claude/commands/swc-monitor.md`

**Purpose:** Application Insights / Prometheus / Datadog observability setup, alert threshold templates, runbook generation. Produces `docs/MONITORING-PLAN.md` and alert config files.

- [ ] **Step 1: Design key sections**

  1. Observability stack selection (Application Insights / Prometheus+Grafana / Datadog)
  2. The Four Golden Signals (latency, traffic, errors, saturation)
  3. Alert threshold templates (P95 response time, error rate, CPU/memory)
  4. Dashboard layout standard (service overview, SLA tracking, dependency health)
  5. Runbook template (alert name, severity, symptoms, diagnosis steps, remediation)
  6. On-call escalation matrix
  7. SLA / SLO / SLI definitions

- [ ] **Step 2: Write skill file** following the format reference

- [ ] **Step 3: Verify skill format**

- [ ] **Step 4: Commit**

```
git add .claude/commands/swc-monitor.md
git commit -m "feat(swc-monitor): add Monitoring & Alerting Setup skill v1.0"
```

---

## Phase 3 â€” NICE TO HAVE (6 skills)

These add specialist coverage and polish. Build after Phase 2 is complete.

---

### Task 16: `swmk-brand` â€” Brand Guidelines

**Skill purpose:** Brand voice, color system, typography, logo usage rules, asset library management checklist. Produces `docs/BRAND-GUIDELINES.md`.

**Key sections:** Brand personality (3â€“5 adjectives) Â· Tone-of-voice do/don't table Â· Primary/secondary/accent color palette with hex values Â· Typography hierarchy (display, body, caption) Â· Logo clear-space and misuse rules Â· Imagery style (photography vs illustration, colour treatment) Â· Asset library location and naming convention

- [ ] **Write skill file** following the format reference
- [ ] **Verify format**
- [ ] **Commit:** `feat(swmk-brand): add Brand Guidelines skill v1.0`

---

### Task 17: `swmk-pr` â€” PR & Media Relations

**Skill purpose:** Press release template, media list management, publication approval workflow. Produces `docs/PR-PLAN.md` and `docs/PRESS-RELEASE-[date].md`.

**Key sections:** Newsworthiness checklist Â· Press release structure (headline, dateline, lede, body, boilerplate, contact) Â· Media list format (outlet, journalist, beat, email, tier) Â· Pitch email template Â· Publication timeline Â· Response tracking

- [ ] **Write skill file** following the format reference
- [ ] **Verify format**
- [ ] **Commit:** `feat(swmk-pr): add PR & Media skill v1.0`

---

### Task 18: `swmk-crm` â€” CRM Setup

**Skill purpose:** Lead scoring model, pipeline stage definition, automation rule templates for HubSpot / Salesforce / Zoho. Produces `docs/CRM-SETUP.md`.

**Key sections:** Platform selection guide Â· Pipeline stages (Prospect â†’ MQL â†’ SQL â†’ Proposal â†’ Won/Lost) Â· Lead scoring criteria (demographic + behavioural) Â· Automation sequences (lead nurture, follow-up, re-engagement) Â· Deal property standards Â· Reporting dashboards (pipeline velocity, conversion rates)

- [ ] **Write skill file** following the format reference
- [ ] **Verify format**
- [ ] **Commit:** `feat(swmk-crm): add CRM Setup skill v1.0`

---

### Task 19: `swp-mobile` â€” Mobile App Planning

**Skill purpose:** iOS/Android architecture decisions, app store submission checklist, push notification strategy, deep-link plan. Produces `docs/MOBILE-ARCH.md`.

**Key sections:** Native vs cross-platform decision matrix (React Native / Flutter / Native) Â· App architecture pattern (MVVM, Clean Architecture) Â· Platform-specific considerations (iOS HIG vs Material Design) Â· App Store / Play Store submission checklist Â· Push notification strategy (opt-in, segmentation, frequency) Â· Deep-link and universal link setup Â· Offline-first data strategy

- [ ] **Write skill file** following the format reference
- [ ] **Verify format**
- [ ] **Commit:** `feat(swp-mobile): add Mobile App Planning skill v1.0`

---

### Task 20: `sw-meeting` â€” Meeting Facilitation

**Skill purpose:** Agenda templates (standup / weekly / monthly / workshop), decision log format, action item tracking. Org-wide. Produces `docs/MEETING-[type]-[date].md`.

**Key sections:** Meeting type selector (standup / check-in / retrospective / workshop / all-hands) Â· Agenda template per type Â· Decision log format (decision, rationale, owner, date) Â· Action item format (what, who, by when) Â· Pre-meeting checklist Â· Post-meeting summary format (send within 24h)

- [ ] **Write skill file** following the format reference
- [ ] **Verify format**
- [ ] **Commit:** `feat(sw-meeting): add Meeting Facilitation skill v1.0`

---

### Task 21: `swmk-report` â€” Marketing Reporting

**Skill purpose:** Monthly/quarterly marketing performance report template with KPI scoring, channel breakdown, and executive summary. Produces `docs/MARKETING-REPORT-[YYYY-MM].md`.

**Key sections:** Executive summary (3 KPIs, green/amber/red status) Â· Channel performance table Â· Top performing content/campaigns Â· Budget vs actual spend Â· Key insights (what worked, what didn't) Â· Next month priorities Â· Appendix (raw data tables)

- [ ] **Write skill file** following the format reference
- [ ] **Verify format**
- [ ] **Commit:** `feat(swmk-report): add Marketing Reporting skill v1.0`

---

## Completion Checklist

### Phase 1 â€” MUST HAVE
- [ ] Task 1: `swmk-srs` created and committed
- [ ] Task 2: `swmk-seo` created and committed
- [ ] Task 3: `swmk-campaign` created and committed
- [ ] Task 4: `swmk-analytics` created and committed
- [ ] Task 5: `sw-proposal` created and committed
- [ ] Task 6: `sw-estimation` created and committed

### Phase 2 â€” SHOULD HAVE
- [ ] Task 7: `swmk-content` created and committed
- [ ] Task 8: `swmk-email` created and committed
- [ ] Task 9: `swmk-social` created and committed
- [ ] Task 10: `swmk-ads` created and committed
- [ ] Task 11: `swmk-cro` created and committed
- [ ] Task 12: `sw-onboarding` created and committed
- [ ] Task 13: `sw-retro` created and committed
- [ ] Task 14: `swp-api` created and committed
- [ ] Task 15: `swc-monitor` created and committed

### Phase 3 â€” NICE TO HAVE
- [ ] Task 16: `swmk-brand` created and committed
- [ ] Task 17: `swmk-pr` created and committed
- [ ] Task 18: `swmk-crm` created and committed
- [ ] Task 19: `swp-mobile` created and committed
- [ ] Task 20: `sw-meeting` created and committed
- [ ] Task 21: `swmk-report` created and committed

---

## Version Tracking Protocol

After completing each task, the skill file must contain:
- `Version : 1.0`
- `Updated : YYYY-MM-DD`
- Changelog table with initial row

No version bumping needed until the skill is revised post-initial creation.
