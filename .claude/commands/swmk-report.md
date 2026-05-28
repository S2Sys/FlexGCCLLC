---
name: swmk-report
description: |
  Produce a monthly or quarterly marketing performance report - executive summary with RAG status, channel-by-channel performance breakdown, top campaigns, budget vs actual, key insights, and next period priorities. Produces MARKETING-REPORT-[YYYY-MM].md.
  Trigger when: producing a monthly marketing report, preparing a quarterly review, reporting on campaign performance, presenting results to a client or leadership team, or any time someone asks to write a marketing report.
compatibility: Any project unless command-specific prerequisites say otherwise
---

Command  : /swmk-report

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

Any phase/stage/mode/gate/multi-step workflow must output short summaries showing what was done.

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

Final output must include a RUN SUMMARY with the same fields. If a phase/stage is skipped, say Skipped with reason and impact. If partially failed, show recovery status and do not mark it done.

---

Version  : 2.1
Updated  : 2026-05-21
Author   : KapilDev

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.3     | 2026-05-21 | KapilDev | Added shared marketing optimization contract for baseline/target evidence, UTM tracking, compliance, experiment loop, and handoff snapshot |
| 1.1     | 2026-05-18 | SmartWorkz | Normalized STEP headers, fixed currency labels, added YoY and attribution notes |
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a clear, honest performance report that tells stakeholders what happened, why, and what is changing as a result.

## Prerequisites

- Analytics access (GA4, platform dashboards, CRM)
- Previous period baselines (from last report or ANALYTICS-SETUP.md)
- Budget actuals from finance / account manager

---

## STEP 1  Executive Summary

Three top-line KPIs with RAG status:

| KPI | Target | Actual | vs Target | Status |
|-----|--------|--------|-----------|--------|
| [e.g. Leads generated] | | | +/- % | Green On track / Yellow At risk / Red Off track |
| [e.g. Website sessions] | | | | |
| [e.g. Revenue attributed] | | | | |

One-paragraph narrative (3 sentences max):
1. Overall performance headline
2. Most significant positive result
3. Most significant problem and what is being done about it

---

## STEP 2  Channel Performance

| Channel | Sessions/Reach | Leads/Conversions | Cost | CPL / CPA | vs Last Period | vs Same Period Last Year |
|---------|---------------|-------------------|------|-----------|----------------|--------------------------|
| Organic Search (SEO) | | | 0 / $0 / 0 | - | | |
| Paid Search (Google) | | | /$/ | /$/ | | |
| Paid Social (Meta) | | | /$/ | /$/ | | |
| Email | | | /$/ | /$/ | | |
| Social (organic) | | | 0 / $0 / 0 | - | | |
| Direct / Referral | | | 0 / $0 / 0 | - | | |
| **TOTAL** | | | **/$/** | **/$/** | | |

---

## STEP 3  Top Performing Campaigns

List top 3 campaigns by conversion volume:

| Campaign | Channel | Spend | Leads | CPL | Revenue | ROAS |
|----------|---------|-------|-------|-----|---------|------|
| 1 | | /$/ | | /$/ | /$/ | x |
| 2 | | /$/ | | /$/ | /$/ | x |
| 3 | | /$/ | | /$/ | /$/ | x |

ROAS = Revenue / Spend. Target: ROAS > 3x for most paid campaigns.
Attribution model note: state whether revenue/leads use first-click, last-click, linear, position-based, or data-driven attribution before comparing campaign performance.

---

## STEP 4  Budget vs Actual

| Category | Budget | Actual | Variance (/$/) | Variance (%) |
|----------|--------|--------|----------------|--------------|
| Paid Media | /$/ | /$/ | | |
| Creative | /$/ | /$/ | | |
| Tools / Software | /$/ | /$/ | | |
| Events | /$/ | /$/ | | |
| **Total** | **/$/** | **/$/** | | |

Overspend > 10%: flag with explanation. Underspend > 20%: flag - potential missed opportunity.

---

## STEP 5  Key Insights

**What worked this period (top 3):**
1. [Specific tactic or campaign] - [result]
2.
3.

**What didn't work (top 3):**
1. [Specific tactic] - [result and hypothesis for why]
2.
3.

**Anomalies or surprises:**
- [Anything unexpected - positive or negative]

---

## STEP 6  Next Period Priorities

| Priority | Action | Owner | Target Impact | Budget Required |
|----------|--------|-------|---------------|-----------------|
| 1 (highest) | | | | /$/ |
| 2 | | | | /$/ |
| 3 | | | | /$/ |

No more than 3 priorities. Each must directly address a finding from Step 5.

---

## STEP 7  Appendix

Include raw data tables for:
- Full channel breakdown by week
- All active campaigns with daily/weekly metrics
- Keyword rankings (if SEO programme active)
- Email sequence metrics (open rate, CTR, unsubscribe by email)
- Social follower growth and engagement by platform

---

## Marketing Optimization Contract

Before writing the final output artifact, complete this optimization pass and include it in the generated document.

### Baseline and Target Evidence

| Area | Required Evidence | If Missing |
|---|---|---|
| Business objective | Revenue, pipeline, retention, awareness, or efficiency goal | Mark assumption and request owner confirmation |
| Audience segment | Persona, lifecycle stage, pain point, and offer fit | Add `AUDIENCE GAP` blocker |
| Baseline metric | Current traffic, conversion, spend, engagement, ranking, or CRM baseline | Use `baseline unknown` and define first measurement task |
| Target metric | Numeric target and target date | Add provisional target with confidence level |
| Attribution source | GA4, CRM, ad platform, email platform, rank tracker, or manual source | Define tracking setup before launch |

### Tracking, Naming, and UTM Rules

Every campaign, asset, link, email, ad group, CRM workflow, report, or content plan must define:

- Owner and approval contact.
- Source system of record.
- Naming convention using `[client]-[initiative]-[channel]-[date/version]`.
- UTM plan for external links: `utm_source`, `utm_medium`, `utm_campaign`, and optional `utm_content` / `utm_term`.
- Conversion event or success action.
- QA owner and launch/review date.

### Compliance and Brand Safety

Check and document whether the work touches:

| Risk Area | Required Check |
|---|---|
| Consent and privacy | GDPR/CCPA/CAN-SPAM/PECR opt-in, unsubscribe, cookie, and data-retention rules where relevant |
| Platform policy | Ad, email, social, review-site, marketplace, and PR platform rules |
| Claims and proof | Avoid unsupported superlatives, fake scarcity, unverifiable guarantees, or misleading performance claims |
| Accessibility | Plain-language copy, readable contrast in creative guidance, alt text where assets are requested |
| Brand consistency | Voice, visual tokens, logo rules, and approved terminology |

### Experiment and Optimization Loop

Add an optimization loop with:

1. Hypothesis: `If we [change], then [metric] will improve because [reason]`.
2. Test type: A/B, holdout, cohort comparison, creative rotation, SEO/content refresh, or manual before/after review.
3. Minimum readout window and sample-size caveat.
4. Stop/scale rule.
5. Next review date and owner.

### Final Handoff Snapshot

End every normal output with:

```text
MARKETING HANDOFF SNAPSHOT
Artifact             : [file]
Primary owner        : [name/role]
Approval needed from : [name/role]
Launch/review date   : [date]
Baseline             : [metric/source]
Target               : [metric/date]
Tracking             : [events, UTMs, dashboard]
Compliance status    : PASS / CONDITIONAL / BLOCKED
Optimization loop    : [hypothesis + readout date]
Next command         : [/swmk-report, /swmk-analytics, /swmk-campaign, or none]
```
---

## OUTPUT

`docs/MARKETING-REPORT-[YYYY-MM].md` - complete report ready for client or leadership presentation.
Send within 5 business days of the period end.
## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.
## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).
- **v1.3** (2026-05-21): Added shared marketing optimization contract covering baseline/target evidence, UTM tracking, compliance and brand-safety checks, experiment loop, and final handoff snapshot
- **v1.2** (2026-05-20): Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards

