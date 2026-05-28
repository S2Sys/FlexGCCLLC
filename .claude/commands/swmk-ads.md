---
name: swmk-ads
description: |
  Plan and structure paid advertising campaigns - Google Ads (Search, Display, Shopping) and Meta Ads (Facebook/Instagram). Covers campaign architecture, audience targeting, keyword strategy, ad copy, bid strategy, budget allocation, and weekly optimisation checklist. Produces ADS-PLAN.md.
  Trigger when: setting up Google Ads, creating a Meta campaign, planning paid media spend, auditing a paid account, or any time someone asks to plan, build, or optimise paid advertising campaigns.
compatibility: Any project unless command-specific prerequisites say otherwise
---

Command  : /swmk-ads

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
| 1.1     | 2026-05-18 | SmartWorkz | Normalized STEP headers, fixed currency labels, and added analytics plus creative spec guidance |
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a structured paid advertising plan that a media buyer can implement directly in Google Ads and Meta Ads Manager.

## Prerequisites

- Campaign goal and budget confirmed (from CAMPAIGN-PLAN.md)
- Landing page URL(s) confirmed
- Target audience defined
- Conversion tracking configured  run `/swmk-analytics` first if not already done

---

## STEP 1  Platform Selection

| Platform | Recommended For | Monthly Budget Min | Decision |
|---|---|---|---|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |

| Google Search | High-intent demand capture | /$/500+ | In/Out |
| Google Display | Retargeting, awareness | /$/200+ | In/Out |
| Google Shopping | E-commerce product ads | /$/300+ | In/Out |
| Meta (FB/IG) | Awareness, interest targeting | /$/300+ | In/Out |
| LinkedIn | B2B lead generation | /$/1,000+ | In/Out |

---

## STEP 2  Campaign Structure (Google Ads)

```
Account
\-- Campaign: [Goal - e.g. "Lead Gen - UK"]
    |-- Ad Group 1: [Theme - e.g. "SEO Services"]
    |   |-- Keywords (10-20 per group)
    |   \-- Ads (min 3 responsive search ads per group)
    \-- Ad Group 2: [Theme - e.g. "PPC Management"]
        |-- Keywords
        \-- Ads
```
One campaign per goal. One ad group per keyword theme. Budget set at campaign level.

---

## STEP 3  Keyword Strategy (Google Search)

| Keyword | Match Type | Monthly Vol. | CPC Est. | Intent | Ad Group |
|---------|------------|--------------|----------|--------|----------|
|         | Exact / Phrase / Broad Mod | | | Commercial/Info | |

Negative keywords list (add before launch):
- [Irrelevant terms - e.g. "free", "DIY", competitor brand names if not targeting]

---

## STEP 4  Audience Targeting (Meta)

**Custom Audiences:**
- Website visitors (last 30 days) - Retargeting
- Email list upload - Lookalike source
- Video viewers (25%+) - Warm audience

**Lookalike Audiences:**
- 1% lookalike of email list
- 1% lookalike of website purchasers/leads

**Interest Targeting (cold):**
| Interest | Audience Size Est. | Funnel Stage |
|---|---|---|
| | | Top / Mid / Bottom |

---

## STEP 5  Ad Copy Framework

Responsive Search Ad structure (Google):

```
Headlines (write 10, Google rotates best 3):
1. [Primary keyword - 30 chars max]
2. [Unique value proposition]
3. [Call to action]
4. [Social proof - e.g. "500+ clients"]
5. [Offer / urgency]
...

Descriptions (write 4, Google rotates best 2):
1. [Expand on benefit + CTA - 90 chars max]
2. [Address objection + reassurance]
3. [Feature + benefit]
4. [Urgency / offer]
```
Meta Ad copy structure:
```
Hook (first line - stops scroll): [Question or bold statement]
Body (2-3 sentences): [Problem -> Solution -> Proof]
CTA: [Single clear action]
```
Creative size specs:

| Placement | Recommended Size | Ratio | Notes |
|---|---|---|---|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |

| Meta feed image | 1080 x 1080 px | 1:1 | Safe default for Facebook and Instagram feeds |
| Meta story/reel | 1080 x 1920 px | 9:16 | Keep key text inside safe zones top/bottom |
| Google responsive display landscape | 1200 x 628 px | 1.91:1 | Main landscape asset |
| Google responsive display square | 1200 x 1200 px | 1:1 | Main square asset |
| LinkedIn single image | 1200 x 1200 px | 1:1 | Use short copy and strong contrast |

---

## STEP 6  Bid Strategy Guide

| Goal | Recommended Strategy | When to Switch |
|------|----------------------|----------------|
| Maximise clicks (new account) | Manual CPC | After 30+ conversions/month -> tCPA |
| Lead generation | Target CPA (tCPA) | Requires 30 conversions in 30 days to activate |
| E-commerce | Target ROAS (tROAS) | Requires consistent purchase data |
| Brand awareness | Target Impression Share | CPM-based, not for conversions |

---

## STEP 7  Budget Allocation

| Platform / Campaign | Daily Budget | Monthly Total | % of Total Budget |
|---------------------|--------------|---------------|-------------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |

|                     |              |               |                   |
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |

| Contingency (10%)   |              |               | 10%               |
| **TOTAL**           |              |               | 100%              |

---

## STEP 8  Weekly Optimisation Checklist

Every Monday:
- [ ] Check CTR by ad group (flag < 2% on Search)
- [ ] Check Quality Score (flag keywords < 6/10)
- [ ] Pause keywords with > [X] / $[X] / [X] spend and 0 conversions
- [ ] Add new negative keywords from Search Term report
- [ ] Check frequency on Meta (flag > 3.0 - creative fatigue)
- [ ] Review CPL vs target - adjust bids or budgets
- [ ] Check landing page conversion rate (flag < 2%)

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

`docs/ADS-PLAN.md` - platform selection, campaign structure, keyword list, audiences, ad copy, bid strategy, budget split, weekly checklist.
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

