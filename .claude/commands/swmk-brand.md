---
name: swmk-brand
description: |
  Define or document brand guidelines - brand personality, tone of voice, colour palette, typography system, logo usage rules, imagery style, and asset library conventions. Produces BRAND-GUIDELINES.md.
  Trigger when: creating a new brand, onboarding a new client, auditing brand consistency, briefing a designer, documenting brand standards, or any time someone asks to write or review brand guidelines.
compatibility: Any project unless command-specific prerequisites say otherwise
---

Command  : /swmk-brand

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
| 1.1     | 2026-05-18 | SmartWorkz | Normalized STEP headers, added social profile specs and motion guidelines |
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a brand guidelines document that any designer, copywriter, or developer can use to create on-brand work without consulting the original brand team.

## Prerequisites

- Brand name and product/service overview
- Existing logo files (if brand already exists)
- Any existing colour or font choices

---

## STEP 1  Brand Personality

Define 3-5 adjectives that describe the brand:

| Adjective | In Practice | NOT This |
|-----------|-------------|----------|
| e.g. Authoritative | Data-backed claims, precise language | Vague generalisations |
| e.g. Approachable | Conversational tone, plain English | Jargon, formal distance |
| e.g. Innovative | Forward-looking language, new solutions | Referencing the past |

---

## STEP 2  Tone of Voice

| Element | Guideline |
|---------|-----------|
| Reading age target | Grade 8 (Flesch-Kincaid 60-70) |
| Sentence length | Average < 20 words |
| Person | Second person ("you") for client comms; first person plural ("we") for brand voice |
| Active vs passive | Active voice always |
| Banned words | [List - e.g. "leverage", "synergy", "seamless"] |
| Punctuation style | Oxford comma - yes / no |

DO examples (3 short sentences showing the brand voice):
DON'T examples (3 showing what to avoid):

---

## STEP 3  Colour Palette

| Colour Role | Name | Hex | RGB | Use |
|-------------|------|-----|-----|-----|
| Primary | | #XXXXXX | rgb() | Main brand - CTAs, headings |
| Secondary | | #XXXXXX | | Supporting - backgrounds, accents |
| Accent | | #XXXXXX | | Highlights, icons |
| Neutral Dark | | #XXXXXX | | Body text |
| Neutral Light | | #XXXXXX | | Backgrounds |
| Error | | #D32F2F | | Errors, alerts |
| Success | | #388E3C | | Confirmations |

Accessibility check: primary on white background must pass WCAG AA contrast (4.5:1 for text).

---

## STEP 4  Typography

| Role | Font Family | Weight | Size | Line Height |
|------|-------------|--------|------|-------------|
| Display / Hero | | Bold | 48-64px | 1.1 |
| H1 | | Bold | 36-48px | 1.2 |
| H2 | | SemiBold | 28-36px | 1.3 |
| H3 | | SemiBold | 20-24px | 1.4 |
| Body | | Regular | 16px | 1.6 |
| Small / Caption | | Regular | 12-14px | 1.5 |

Font loading: use `font-display: swap`. Specify fallback stack.
Approved fonts only - do not substitute without brand approval.

---

## STEP 5  Logo Usage Rules

| Rule | Detail |
|------|--------|
| Minimum size | 80px wide (digital) / 25mm wide (print) |
| Clear space | Minimum clear space = height of the logo's wordmark letter |
| Approved backgrounds | White, brand primary, brand secondary |
| Prohibited | Stretching, rotating, recolouring, adding drop shadow, placing on busy images |
| File formats | SVG (digital, preferred) - PNG transparent (digital fallback) - EPS (print) |

---

## STEP 6  Imagery Style

| Element | Guideline |
|---------|-----------|
| Photography style | [e.g. natural light, candid, diverse people] |
| Illustration style | [e.g. flat vector, no gradients] |
| Colour treatment | [e.g. slight brand colour overlay, no heavy filters] |
| Avoid | [e.g. stock photo cliches - handshakes, generic office shots] |
| Approved sources | [e.g. Unsplash, proprietary shoot, commissioned illustrator] |

---

## STEP 7  Asset Library

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

## STEP 8  Social Profile Size Specs

Prepare profile and cover assets for the main social channels before launch:

| Platform | Profile Image | Cover / Banner | Notes |
|----------|---------------|----------------|-------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |

| LinkedIn Company Page | 400 x 400 px | 1128 x 191 px | Keep logo centered; avoid text at extreme edges |
| Facebook Page | 320 x 320 px | 851 x 315 px | Check mobile crop before approval |
| Instagram | 320 x 320 px | N/A | Use simplified mark for circular crop |
| X (Twitter) | 400 x 400 px | 1500 x 500 px | Keep key text in the central safe area |
| YouTube | 800 x 800 px | 2560 x 1440 px | Keep critical elements inside the TV/mobile safe area |

Always export a master source file plus web-optimised PNG/JPG variants for each platform.

---

## STEP 9  Animation and Motion Guidelines

Define how the brand should move in digital products and campaigns:

| Element | Guideline |
|---------|-----------|
| Motion style | Subtle, purposeful, and supportive of hierarchy |
| Duration | UI transitions 150-300ms; larger brand reveals 400-700ms |
| Easing | Prefer ease-out for entrances and ease-in-out for state changes |
| Use cases | Hover states, carousel transitions, logo reveal, testimonial quotes |
| Avoid | Auto-playing motion with sound, excessive parallax, flashing effects, distracting loops |
| Accessibility | Respect `prefers-reduced-motion`; provide static fallback for essential content |

Motion should reinforce clarity, not become the main event. Use the same timing and easing tokens across web, video, and social templates where possible.

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

`docs/BRAND-GUIDELINES.md` - all sections above as a complete brand reference.
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

