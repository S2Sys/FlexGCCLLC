---
name: swmk-social
description: |
  Plan a social media strategy - platform selection rationale, content matrix, 30-day posting schedule, hashtag strategy, community engagement rules, and monthly performance scorecard. Produces SOCIAL-PLAN.md.
  Trigger when: starting a social media programme, planning monthly social content, building a posting schedule, auditing social presence, or any time someone asks for a social media strategy or social content plan.
compatibility: Any project unless command-specific prerequisites say otherwise
---

Command  : /swmk-social

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
| 1.1     | 2026-05-18 | SmartWorkz | Normalized STEP headers and added social listening step |
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a 30-day social media plan that a social media manager can execute without additional direction.

## Prerequisites

- Brand/product overview and tone of voice (from CONTENT-STRATEGY.md if available)
- Target audience personas
- Active social platform accounts confirmed

---

## STEP 1  Platform Selection

For each candidate platform, score 1-5:

| Platform   | Audience Match | Content Fit | Team Capacity | Score | Decision |
|------------|----------------|-------------|---------------|-------|----------|
| LinkedIn   |                |             |               | /15   | In/Out   |
| Instagram  |                |             |               | /15   | In/Out   |
| X (Twitter)|                |             |               | /15   | In/Out   |
| TikTok     |                |             |               | /15   | In/Out   |
| Facebook   |                |             |               | /15   | In/Out   |

Focus on platforms scoring > 10/15. Maximum 3 active platforms for a single operator.

---

## STEP 2  Content Matrix

For each chosen platform, define content types and mix:

| Platform | Content Type      | Format       | % of Posts | Purpose    |
|----------|-------------------|--------------|------------|------------|
| LinkedIn | Thought leadership| Text + image | 40%        | Authority  |
| LinkedIn | Case study        | Carousel     | 30%        | Trust      |
| LinkedIn | Behind-the-scenes | Short video  | 20%        | Culture    |
| LinkedIn | Promotional       | Single image | 10%        | Conversion |

Total must = 100% per platform.

---

## STEP 3  30-Day Posting Schedule

| Day | Platform | Content Type | Topic / Hook | Format | Owner |
|-----|----------|--------------|--------------|--------|-------|
| Mon |          |              |              |        |       |
| Wed |          |              |              |        |       |
| Fri |          |              |              |        |       |

Posting frequency by platform:
- LinkedIn: 3-5x/week - Instagram: 4-7x/week - X: 1-3x/day - TikTok: 1x/day

Best posting times (schedule within these windows):
- LinkedIn: Tue-Thu 8-10am or 12-1pm
- Instagram: Tue/Wed 11am or 2-3pm
- TikTok: 7-9pm local audience time

---

## STEP 4  Hashtag Strategy

Three tiers per platform:

| Tier | Type    | Volume       | Count to Use | Example    |
|------|---------|--------------|--------------|------------|
| 1    | Branded | Any          | 1-2          | #BrandName |
| 2    | Niche   | < 100k posts | 3-5          | #DigitalMarketing |
| 3    | Broad   | > 500k posts | 1-2          | #Marketing |

Instagram: use 5-10 hashtags max (algorithm penalises 30+ hashtag stuffing).
LinkedIn: 3-5 hashtags only.

---

## STEP 5  Community Engagement Rules

| Scenario          | Response Time  | Tone                    | Owner           |
|------------------|----------------|-------------------------|-----------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |

| Positive comment | Within 4 hours | Warm, personal          | Social manager  |
| Question / enquiry | Within 2 hours | Helpful, direct       | Social manager  |
| Complaint        | Within 1 hour  | Empathetic, move to DM  | Account manager |
| Negative review  | Within 1 hour  | Acknowledge, offer resolution | Senior manager |
| Spam / trolling  | Ignore or hide | -                       | Social manager  |

---

## STEP 6  Social Listening and Brand Monitoring

Track brand mentions and audience signals every week:

| Monitor Area | What to Check | Tool Options | Escalation Trigger |
|--------------|---------------|--------------|--------------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |

| Brand mentions | Tagged and untagged mentions across active platforms | Native platform search, Brand24, Mention, Sprout Social | Negative sentiment spike or unanswered complaint |
| Competitors | Campaign launches, engagement spikes, message changes | Native feeds, Semrush Social, Sprout Social | Competitor campaign materially outperforming baseline |
| Keywords | Industry topics, pain points, trend terms | X search, Reddit, LinkedIn search, Google Alerts | New recurring theme worth content response |
| Influencers / advocates | Supportive creators, partners, customer champions | Creator lists, saved searches | High-fit advocate open to collaboration |

Log notable findings weekly and feed them into the next 30-day schedule, FAQs, and community response playbooks.

---

## STEP 7  Monthly Performance Scorecard

Review at end of each month:

| Metric              | Platform | Baseline | Target | Actual | Status |
|---------------------|----------|----------|--------|--------|--------|
| Follower growth (%) |          |          | +5%    |        | Green/Amber/Red |
| Avg engagement rate |          |          | > 2%   |        |        |
| Reach per post      |          |          |        |        |        |
| Link clicks         |          |          |        |        |        |
| Leads / enquiries   |          |          |        |        |        |

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

`docs/SOCIAL-PLAN.md` - platform decisions, content matrix, 30-day schedule, hashtags, engagement rules, scorecard.
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

