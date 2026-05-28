---
name: swmk-email
description: |
  Plan and write a digital marketing email campaign - sequence structure, subject line A/B variants, email body templates, send schedule, and deliverability checklist. Produces EMAIL-CAMPAIGN.md.
  Trigger when: planning an email campaign, writing a nurture sequence, setting up a welcome series, running a promotional email, or any time someone asks to plan or write marketing emails.
compatibility: Any project unless command-specific prerequisites say otherwise
---

Command  : /swmk-email

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
| 1.1     | 2026-05-18 | SmartWorkz | Normalized STEP headers and added GDPR/consent checks |
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a complete email campaign plan - from sequence design through to deliverability checks - that a copywriter and email platform operator can execute independently.

## Prerequisites

- Audience segment defined (from MARKETING-SRS.md or CAMPAIGN-PLAN.md)
- Email platform confirmed (Mailchimp / HubSpot / Klaviyo / ActiveCampaign)
- Campaign goal confirmed (lead nurture / promotion / onboarding / re-engagement)

---

## STEP 1  Campaign Overview

```
Campaign Name    :
Goal             : nurture / promote / onboard / re-engage
Audience Segment :
Platform         :
Sequence Length  : [e.g. 3 emails over 10 days]
Sending From     : [Name] <email@domain.com>
```
---

## STEP 2  Sequence Structure

| Email # | Send Day | Purpose       | Subject Line (A) | Subject Line (B) | Primary CTA |
|---------|----------|---------------|------------------|------------------|-------------|
| 1       | Day 0    | Welcome/Hook  |                  |                  |             |
| 2       | Day 3    | Value/Educate |                  |                  |             |
| 3       | Day 7    | Convert       |                  |                  |             |

Subject line rules: 40-50 characters - no all-caps - test emoji vs no-emoji.

---

## STEP 3  Email Body Template

Apply this structure to each email:

```
PREHEADER (90 chars): [supports subject line, adds intrigue]

HEADER: [Logo + brand colour bar]

HEADLINE (H1): [Single benefit statement - 8 words max]

BODY (2-3 short paragraphs):
  Para 1: Hook / problem statement (2-3 sentences)
  Para 2: Solution / value (2-3 sentences)
  Para 3: Social proof or urgency (1-2 sentences)

CTA BUTTON: [Action verb + benefit - "Get Your Free Audit"]

SECONDARY CONTENT (optional): [Supporting links or resources]

FOOTER: [Unsubscribe link - Company address - Privacy policy]
```
---

## STEP 4  Send Schedule & Frequency Rules

| Day | Email # | Send Time (local) | Segment |
|-----|---------|-------------------|---------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |

|     |         | Tue-Thu 10am or 2pm preferred | |

Rules:
- Maximum 2 emails/week per contact
- Suppress contacts who opened Email 2 from re-receiving it
- Suppress purchasers / converted leads from remaining sequence

---

## STEP 5  Deliverability Checklist

- [ ] SPF record published for sending domain
- [ ] DKIM enabled on sending platform
- [ ] DMARC policy set (minimum `p=none` with monitoring)
- [ ] Sending domain warmed (if < 30 days old - ramp to full volume over 2 weeks)
- [ ] List hygiene: remove hard bounces, unsubscribes, and 12-month non-openers
- [ ] Plain-text version present for every email
- [ ] Unsubscribe link in every email (legal requirement)
- [ ] Consent confirmed: only email contacts who opted in (GDPR Art.6 / PECR / CAN-SPAM)
- [ ] Double opt-in enabled for new subscribers (recommended for EU/UK lists)
- [ ] Spam score checked (SpamAssassin score < 3.0)

---

## STEP 6  Success Benchmarks

| Metric            | Industry Avg | Campaign Target | Actioned if Below Target |
|-------------------|--------------|-----------------|--------------------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |

| Open rate         | 20-25%       |                 | Test new subject lines   |
| Click-through rate| 2-3%         |                 | Improve CTA and body copy|
| Unsubscribe rate  | < 0.5%       |                 | Review frequency/relevance|
| Conversion rate   | 1-3%         |                 | Review landing page      |

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

`docs/EMAIL-CAMPAIGN.md` - sequence plan, email templates, send schedule, deliverability checklist, benchmarks.
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

