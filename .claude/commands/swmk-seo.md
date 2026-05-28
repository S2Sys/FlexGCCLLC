---
name: swmk-seo
description: |
  Use when onboarding a new client website, running a quarterly SEO review, investigating organic traffic drops, preparing an SEO proposal, reviewing technical/content SEO quality, checking AI search visibility, comparing SERP competitors, finding content decay/cannibalization, or any time someone asks for an SEO audit, AI SEO, GEO/LLMO/AEO, keyword recommendations, Core Web Vitals review, backlink review, or organic growth action plan.
compatibility: Any project unless command-specific prerequisites say otherwise
---

Command  : /swmk-seo

Skill type: WORKFLOW COMMAND

## Standard command safeguards

### Helper intercept
If `$ARGUMENTS` is exactly one of these helper requests, print the helper document below and STOP before the normal workflow starts:

- `help`
- `?`
- `usage`
- `use cases`
- `examples`
- `show helper`
- `what can this skill do`
- comment-style requests such as `# help`, `// help`, or `<!-- help -->`

Helper output:

```markdown
## swmk-seo Helper

### Purpose
Run a structured SEO audit for a website and produce a prioritized action plan for technical SEO, Core Web Vitals, keyword gaps, on-page quality, internal links, schema, backlink health, SERP competitor gaps, content decay/cannibalization, and AI search visibility.

### Use Cases
- Audit a new client website before proposal or onboarding.
- Investigate an organic traffic or ranking drop.
- Run a quarterly SEO health review.
- Compare the site against competitor keywords and content gaps.
- Review SERP features, competitor page formats, topical authority gaps, and content decay.
- Create a Quick Win / Medium-Term / Long-Term SEO roadmap.
- Validate Core Web Vitals and technical blockers before a content campaign.
- Review whether pages are likely to be cited, summarized, or surfaced in AI search experiences such as AI Overviews, AI Mode, Copilot Search, Perplexity-style answer engines, or other answer/chat search interfaces.
- Improve answerability, entity clarity, citation readiness, and source transparency without inventing fake AI-ranking factors.
- Prepare SEO tasks for `/swmk-content`, `/swmk-analytics`, or `/swmk-report`.

### Required Inputs
- Website URL.
- Google Search Console access or export.
- GA4 traffic/export if available.
- Keyword research data from Semrush, Ahrefs, Ubersuggest, GSC, or equivalent.
- Crawl export from Screaming Frog, Sitebulb, Ahrefs, Semrush, or equivalent if available.
- PageSpeed Insights, Lighthouse, or Search Console Core Web Vitals source.
- Backlink export if backlink health is in scope.
- Sitemap and robots.txt URLs.
- Competitor list and target geography if known.
- Brand/entity facts, expert bios, citations, first-party data, customer proof, product/service definitions, and content ownership notes for AI search visibility checks.

### Outputs
- `docs/[GGG].[NNN].seo-audit-[YYYY-MM-DD].md`
- SEO issue tables, competitor/SERP gap map, content refresh plan, prioritized action plan, KPI forecast, verification checklist, marketing handoff snapshot, and run summary.

### Next Steps
- Use `/swmk-content` for content briefs and refresh plans.
- Use `/swmk-analytics` for tracking and dashboard setup.
- Use `/swmk-report` for stakeholder reporting.
- Use `/swmk-campaign` if SEO work is part of a wider campaign.

### Safety Notes
- Mark assumptions clearly when analytics, GSC, crawl, or backlink data is missing.
- Do not invent traffic, rankings, backlink metrics, or Core Web Vitals values.
- Treat privacy, consent, claims, accessibility, and brand consistency as explicit checks.
- Do not claim there is a special guaranteed AI Overview, AI Mode, Copilot, ChatGPT, Perplexity, or LLM ranking formula. Treat AI SEO as helpful, crawlable, trustworthy, clearly structured, source-backed content plus measurement.
```

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

Final output must include a `RUN SUMMARY` with the same fields. If a phase/stage is skipped, say `Skipped` with reason and impact. If partially failed, show recovery status and do not mark it done.

---

Version  : 2.1
Updated  : 2026-05-21
Author   : KapilDev

| Version | Date       | Author     | Notes |
|---------|------------|------------|-------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.6     | 2026-05-21 | KapilDev   | Added SERP competitor analysis, topical authority gap mapping, content decay/cannibalization review, KPI forecast, and stronger final verification |
| 1.5     | 2026-05-21 | KapilDev   | Added AI SEO/GEO/AEO visibility audit covering answerability, entity clarity, source transparency, AI crawler/index controls, AI referrals, and source-citation readiness |
| 1.4     | 2026-05-21 | KapilDev   | Fixed helper output, grouped dated output naming, prerequisites, verification, scoring, and version-history consistency |
| 1.3     | 2026-05-21 | KapilDev   | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.2     | 2026-05-21 | KapilDev   | Added shared marketing optimization contract for baseline/target evidence, UTM tracking, compliance, experiment loop, and handoff snapshot |
| 1.1     | 2026-05-20 | KapilDev   | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.0     | 2026-05-18 | SmartWorkz | Initial release with technical SEO, Core Web Vitals, keyword, on-page, backlink, schema, and internal-linking checks |

---

## Purpose

Produce a prioritized SEO audit identifying technical blockers, keyword opportunities, Core Web Vitals gaps, backlink risks, SERP competitor gaps, content decay/cannibalization risks, AI search visibility gaps, and on-page weaknesses, with a clear action plan ordered by impact, effort, confidence, KPI impact, owner, and target timing.

## Prerequisites

Required:

- Website URL.
- Target geography and language.
- Business objective for organic search.
- Google Search Console access or exported data.
- Keyword research data from Semrush, Ahrefs, Ubersuggest, GSC, or equivalent.

Strongly recommended:

- GA4 traffic and conversion export.
- Crawl export from Screaming Frog, Sitebulb, Ahrefs, Semrush, or equivalent.
- PageSpeed Insights, Lighthouse, or Search Console Core Web Vitals data.
- Backlink export and lost-link report.
- Sitemap URL and robots.txt URL.
- CMS access or read-only page template notes.
- Top competitors and priority products/services.
- Search intent map or target query clusters if available.
- Historic landing-page traffic, ranking, impression, click, and conversion trends.
- Current content inventory with publish/update dates if available.
- Brand, compliance, and claim-proof rules.
- Entity facts, expert credentials, citations, customer proof, original data, and content ownership notes.
- AI search/referral evidence from GA4, server logs, Bing Webmaster Tools, rank tracker features, or manual SERP/answer-engine checks if available.

If a required or recommended source is missing, do not invent values. Mark it as `DATA GAP`, explain the audit limitation, and add a first measurement task.

---

## STEP 1 - Site Health Summary

| Metric | Value | Status | Source |
|---|---:|---|---|
| Total indexed pages | | | GSC |
| Crawled pages | | | Crawl export |
| Pages with 4xx errors | | | Crawl/GSC |
| Redirect chains (3+ hops) | | | Crawl |
| Duplicate title tags | | | Crawl |
| Missing meta descriptions | | | Crawl |
| Pages blocked by robots.txt | | | robots.txt/GSC |
| Sitemap submitted to GSC | | Y/N | GSC |
| Structured data coverage | | Valid / Warnings / Missing | Rich Results / GSC |
| Pages with schema errors | | | Rich Results / GSC |

Flag any metric affecting more than 5% of relevant pages as a blocker.

STEP 1 DONE SUMMARY
Completed          : Site health and crawl blockers reviewed.
Artifacts changed  : SEO audit site health table.
Decisions made     : Blockers marked if threshold exceeded.
Verification       : Source noted per metric or `DATA GAP`.
Blockers           : none / [list]
Next               : STEP 2 - Core Web Vitals

---

## STEP 2 - Core Web Vitals

For the top 5 landing pages by traffic, include:

| Page URL | Device | LCP (s) | INP (ms) | CLS | Pass/Fail | Source |
|---|---|---:|---:|---:|---|---|
| | Mobile/Desktop | | | | | |

Thresholds:

- LCP less than 2.5s.
- INP less than 200ms.
- CLS less than 0.1.

Use PageSpeed Insights, Lighthouse, CrUX, or Search Console Core Web Vitals. Prefer field data when available.

STEP 2 DONE SUMMARY
Completed          : Core Web Vitals reviewed for priority landing pages.
Artifacts changed  : CWV table and page-level findings.
Decisions made     : Failures tagged by metric and device.
Verification       : PSI/Lighthouse/GSC source captured or `DATA GAP`.
Blockers           : none / [list]
Next               : STEP 3 - Keyword Gap Analysis

---

## STEP 3 - Keyword Gap Analysis

Top 10 target keywords from brief, MARKETING-SRS.md, GSC, or keyword tool:

| Keyword | Intent | Monthly Volume | Current Rank | Competitor Rank | Gap | Priority |
|---|---|---:|---:|---:|---|---|
| | Informational / Commercial / Transactional | | | | Not ranking / Page 2-3 / Page 1 not top 3 | H/M/L |

Flag as Quick Win candidate when volume is greater than 500/month and gap is `Not ranking`, `Page 2-3`, or `Page 1 not top 3`.

STEP 3 DONE SUMMARY
Completed          : Keyword gaps and intent mapped.
Artifacts changed  : Keyword opportunity table.
Decisions made     : Quick Win candidates tagged.
Verification       : Keyword source captured or `DATA GAP`.
Blockers           : none / [list]
Next               : STEP 4 - On-Page Audit

---

## STEP 4 - On-Page Audit

Sample top 10 pages by traffic or strategic value:

| Page | Title Tag | H1 | Meta Description | Keyword in URL | Content > 300w | Search Intent Match | Action |
|---|---|---|---|---|---|---|---|
| | Pass/Fail | Pass/Fail | Pass/Fail | Pass/Fail | Pass/Fail | Good/Mixed/Poor | |

Flag pages failing 3 or more checks.

STEP 4 DONE SUMMARY
Completed          : On-page SEO checks completed for priority pages.
Artifacts changed  : On-page audit table.
Decisions made     : Pages failing 3+ checks flagged.
Verification       : Page sample source noted.
Blockers           : none / [list]
Next               : STEP 5 - Internal Linking Audit

---

## STEP 5 - Internal Linking Audit

Review the top 20 priority pages for linking depth and contextual support:

| Page | Internal Links In | Internal Links Out | Click Depth | Orphan Risk | Anchor Text Quality | Action |
|---|---:|---:|---:|---|---|---|
| | | | | Low/Med/High | Good/Mixed/Poor | |

Flag pages with fewer than 3 relevant internal links in, pages more than 3 clicks from the homepage, or repeated generic anchors such as "click here".

STEP 5 DONE SUMMARY
Completed          : Internal link depth and anchor quality reviewed.
Artifacts changed  : Internal linking audit table.
Decisions made     : Orphan/depth risks tagged.
Verification       : Crawl or manual source noted.
Blockers           : none / [list]
Next               : STEP 6 - Backlink Profile

---

## STEP 6 - Backlink Profile

| Metric | Value | Source |
|---|---:|---|
| Total referring domains | | |
| Domains with DR/DA > 40 | | |
| Toxic or spammy links (%) | | |
| Lost links in last 30 days | | |
| New links in last 30 days | | |
| Top linked pages | | |

Flag toxic or spammy link percentage greater than 5%. Do not recommend disavow unless there is clear evidence of manipulative links or manual-action risk.

STEP 6 DONE SUMMARY
Completed          : Backlink health and lost-link risks reviewed.
Artifacts changed  : Backlink profile table.
Decisions made     : Toxic-link risk tagged.
Verification       : Backlink source captured or `DATA GAP`.
Blockers           : none / [list]
Next               : STEP 7 - Site-Type Variant Checks

---

## STEP 7 - Site-Type Variant Checks

Apply only the relevant variant:

| Variant | Extra Checks |
|---|---|
| Local SEO | Google Business Profile, NAP consistency, location pages, review profile, local schema |
| Ecommerce | Product schema, category pagination/facets, indexation rules, canonical tags, product availability, merchant feed consistency |
| SaaS/B2B | Solution pages, comparison pages, demo conversion path, case-study internal links, pricing/indexation decisions |
| Blog/Publisher | Article schema, author pages, topical clusters, freshness, crawl depth, Discover/news eligibility if relevant |
| Multilingual | hreflang, translated metadata, regional keyword intent, canonical handling |

STEP 7 DONE SUMMARY
Completed          : Relevant site-type SEO variant checks applied.
Artifacts changed  : Variant findings section.
Decisions made     : Non-applicable variants skipped with reason.
Verification       : Variant selection tied to site/business type.
Blockers           : none / [list]
Next               : STEP 8 - AI Search Visibility Audit

---

## STEP 8 - AI Search Visibility Audit

Review AI-search readiness for Google AI features, Bing/Copilot-style AI search, and answer-engine visibility. Use current search-engine guidance as the baseline: normal SEO fundamentals still matter, and the audit must not imply guaranteed inclusion in AI answers.

### 8.1 Answerability and Retrieval Readiness

| Page / Topic | Primary Question Answered | Direct Answer Present | Evidence / Citation | Entity Clear | Source Freshness | Action |
|---|---|---|---|---|---|---|
| | | Yes/No | Internal / External / First-party data | Yes/No | Current / Stale / Unknown | |

Check whether priority pages:

- answer the query directly near the top without hiding the useful answer behind fluff;
- include clear definitions, comparisons, steps, pros/cons, pricing/availability facts, or decision criteria where relevant;
- cite trustworthy sources or first-party data for claims;
- identify the author, organization, product, service, and target audience clearly;
- separate facts, opinions, assumptions, and promotional claims;
- provide dates or freshness cues where the topic changes over time.

### 8.2 Entity, E-E-A-T, and Source Transparency

| Entity / Author / Brand Signal | Present | Evidence | Gap | Action |
|---|---|---|---|---|
| Organization/about page | Yes/No | | | |
| Author or reviewer credentials | Yes/No | | | |
| Product/service definitions | Yes/No | | | |
| First-party proof or original data | Yes/No | | | |
| External citations/references | Yes/No | | | |
| Structured data alignment | Yes/No | | | |

Flag vague brand/entity signals, unsupported claims, anonymous expert content, missing proof, stale references, or schema that does not match visible content.

### 8.3 AI Indexing, Snippet, and Crawler Controls

| Control | Status | Risk | Action |
|---|---|---|---|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| Indexable canonical URL | Pass/Fail/Data Gap | | |
| robots.txt allows important pages | Pass/Fail/Data Gap | | |
| `nosnippet`, `max-snippet`, or `data-nosnippet` used intentionally | Pass/Fail/Data Gap | | |
| Paywalled/sensitive content protected intentionally | Pass/Fail/Data Gap | | |
| Duplicate/near-duplicate content consolidated | Pass/Fail/Data Gap | | |
| XML sitemap includes AI-priority pages | Pass/Fail/Data Gap | | |

Do not recommend blocking snippets or crawlers by default. Use snippet controls only when the business intentionally wants to restrict sensitive, paywalled, or non-essential text from previews or AI-generated summaries.

### 8.4 AI Visibility Measurement

| Signal | Source | Current Evidence | Gap | First Measurement Task |
|---|---|---|---|---|
| AI search referral traffic | GA4 / server logs | | | |
| Bing/Copilot AI performance | Bing Webmaster Tools if available | | | |
| AI Overview / AI Mode manual checks | Manual sample | | | |
| Answer-engine citation checks | Manual sample / rank tool | | | |
| Branded entity answer quality | Manual sample | | | |

If measurement tools are unavailable, create a baseline sample of priority queries, capture current AI answer/source visibility manually, and schedule the first readout.

STEP 8 DONE SUMMARY
Completed          : AI search visibility, answerability, source transparency, index controls, and measurement reviewed.
Artifacts changed  : AI Search Visibility section.
Decisions made     : AI SEO actions tagged without claiming guaranteed AI inclusion.
Verification       : AI visibility evidence captured or marked `DATA GAP`.
Blockers           : none / [list]
Next               : STEP 9 - SERP, Competitor, and Topical Authority Gap

---

## STEP 9 - SERP, Competitor, and Topical Authority Gap

Review what currently wins in the search results for priority query clusters. Do not rely only on keyword volume; compare intent, SERP features, page type, proof, freshness, and content depth.

| Query Cluster | Intent | Current Winner(s) | SERP Features | Winning Page Type | Our Matching Page | Gap | Action |
|---|---|---|---|---|---|---|---|
| | Informational / Commercial / Transactional / Local | | AI Overview / PAA / Local Pack / Video / Product / Featured Snippet / Reviews | Guide / Category / Product / Tool / Comparison / Location / FAQ | | | |

Check:

- whether the ranking page type matches the query intent;
- People Also Ask and related-question coverage;
- featured snippet, local pack, video, image, product, review, and FAQ opportunities;
- competitor content structure, proof, media, tools, data, and freshness;
- whether the site has enough supporting cluster pages and internal links to show topical authority;
- whether missing pages should become content briefs for `/swmk-content`.

STEP 9 DONE SUMMARY
Completed          : SERP competitors, SERP features, intent match, and topical authority gaps reviewed.
Artifacts changed  : SERP and topical authority gap map.
Decisions made     : Content/page-type gaps tagged for create, refresh, merge, or no action.
Verification       : Query cluster and competitor evidence captured or marked `DATA GAP`.
Blockers           : none / [list]
Next               : STEP 10 - Content Decay and Cannibalization Review

---

## STEP 10 - Content Decay and Cannibalization Review

Use GSC, GA4, ranking data, and content inventory to find pages losing visibility, pages competing with each other, and pages that should be refreshed, merged, redirected, or retired.

| Page / Query | Trend | Cannibalization Risk | Freshness Gap | Recommended Treatment | Evidence |
|---|---|---|---|---|---|
| | Improving / Flat / Declining / Unknown | None / Low / Medium / High | Current / Stale / Unknown | Keep / Refresh / Merge / Redirect / Noindex / Retire | |

Rules:

- Mark `Content Decay` when impressions, clicks, rankings, or conversions decline over a meaningful comparison window.
- Mark `Cannibalization Risk` when two or more pages target the same intent and split rankings, links, or conversions.
- Prefer refresh or merge when the URL has backlinks, rankings, or conversion history.
- Prefer redirect only when the destination satisfies the same intent.
- Never recommend deleting indexed content without checking traffic, backlinks, conversions, and replacement coverage.

STEP 10 DONE SUMMARY
Completed          : Content decay, cannibalization, and page treatment decisions reviewed.
Artifacts changed  : Content refresh/merge/redirect table.
Decisions made     : Pages tagged for keep, refresh, merge, redirect, noindex, or retire.
Verification       : GSC/GA4/rank/content inventory source captured or `DATA GAP`.
Blockers           : none / [list]
Next               : STEP 11 - Prioritized Action Plan

---

## STEP 11 - Prioritized Action Plan

Score every recommendation:

| Action | Category | Impact (1-5) | Effort (1-5) | Confidence (1-5) | KPI Impact | Owner | Target Date | Priority Bucket |
|---|---|---:|---:|---:|---|---|---|---|
| | Technical / Content / Authority / Analytics / AI Search / SERP / Refresh | | | | Traffic / Leads / Revenue / Visibility / Risk | | | Quick Win / Medium-Term / Long-Term |

Priority guidance:

- Quick Wins: high impact, low or medium effort, high confidence, 0-4 weeks.
- Medium-Term: high value but needs content, dev, approval, or analytics work, 1-3 months.
- Long-Term: structural, authority, platform, or program-level work, 3-6 months.

Add a KPI forecast for the top recommendations:

| Recommendation | Baseline | Expected Movement | Confidence | Measurement Window | Tracking Source |
|---|---|---|---|---|---|
| | | | Low/Med/High | | |

Use ranges, not false precision. If a forecast cannot be justified, say `forecast not reliable` and explain the missing data.

STEP 11 DONE SUMMARY
Completed          : SEO actions scored and grouped.
Artifacts changed  : Prioritized action plan.
Decisions made     : Quick Win / Medium-Term / Long-Term buckets assigned with KPI impact.
Verification       : Each action has impact, effort, confidence, KPI impact, owner, target date, and measurement source.
Blockers           : none / [list]
Next               : STEP 12 - Verification Checklist

---

## STEP 12 - Verification Checklist

Before final output, verify:

| Check | Expected Result |
|---|---|
| Description promise | Technical SEO, CWV, keyword gap, on-page, internal linking, schema, backlinks, AI search visibility, and action plan are covered |
| Data gaps | Missing GSC/GA4/crawl/backlink/CWV data is marked as `DATA GAP`, not invented |
| AI SEO claims | AI visibility recommendations do not promise guaranteed AI Overview, AI Mode, Copilot, ChatGPT, Perplexity, or LLM inclusion |
| AI visibility | Answerability, entity clarity, source transparency, snippet/crawler controls, and measurement are covered |
| SERP reality | Priority query clusters include competitor winners, SERP features, page type, and intent gap |
| Content lifecycle | Content decay, cannibalization, refresh, merge, redirect, noindex, and retire decisions are evidence-backed |
| Output filename | Uses `docs/[GGG].[NNN].seo-audit-[YYYY-MM-DD].md` |
| Prioritization | Every action has impact, effort, confidence, KPI impact, owner, date, and bucket |
| Forecast | KPI forecast uses ranges or clearly says `forecast not reliable` |
| Marketing optimization | Baseline, target, tracking, compliance, experiment loop, and handoff are included |
| Next command | One of `/swmk-content`, `/swmk-analytics`, `/swmk-report`, `/swmk-campaign`, or `none` is selected |
| Phase summaries | Each step has a DONE SUMMARY and final output has RUN SUMMARY |

STEP 12 DONE SUMMARY
Completed          : Final audit quality checks completed.
Artifacts changed  : Verification checklist section.
Decisions made     : Ready / blocked final status.
Verification       : Checklist marked pass/conditional/blocked.
Blockers           : none / [list]
Next               : Marketing Optimization Contract

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
Artifact             : docs/[GGG].[NNN].seo-audit-[YYYY-MM-DD].md
Primary owner        : [name/role]
Approval needed from : [name/role]
Launch/review date   : [date]
Baseline             : [metric/source]
Target               : [metric/date]
Tracking             : [events, UTMs, dashboard]
Compliance status    : PASS / CONDITIONAL / BLOCKED
Optimization loop    : [hypothesis + readout date]
Next command         : [/swmk-content, /swmk-report, /swmk-analytics, /swmk-campaign, or none]
```

MARKETING OPTIMIZATION DONE SUMMARY
Completed          : Baseline, tracking, compliance, experiment loop, and handoff snapshot completed.
Artifacts changed  : Marketing optimization section in SEO audit.
Decisions made     : Compliance and tracking status assigned.
Verification       : Handoff snapshot complete.
Blockers           : none / [list]
Next               : OUTPUT

---

## OUTPUT

Create or update:

- `docs/[GGG].[NNN].seo-audit-[YYYY-MM-DD].md` - all step outputs, prioritized action plan, verification checklist, marketing handoff snapshot, and final run summary.

Final output must include:

```text
RUN SUMMARY
Completed          : [short summary of SEO audit completed]
Artifacts changed  : docs/[GGG].[NNN].seo-audit-[YYYY-MM-DD].md
Decisions made     : [priority buckets, blockers, skipped checks]
Verification       : [verification checklist result]
Blockers           : none / [list]
Next               : [/swmk-content, /swmk-analytics, /swmk-report, /swmk-campaign, or owner]
```

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).

