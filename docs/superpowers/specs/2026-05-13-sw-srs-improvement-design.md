# Design Spec — Improved `/sw-srs` Command

| Field       | Value                                      |
|-------------|--------------------------------------------|
| Date        | 2026-05-13                                 |
| Author      | Zenthil (SmartWorkz)                       |
| Status      | Approved by user — ready for implementation|
| Target file | `.claude/commands/sw-srs.md`               |

---

## Problem Statement

The existing `/sw-srs` command has four concrete gaps that reduce its reliability as a Phase 0 gate:

1. **NFR/Compliance coverage is thin** — only 7 categories checked; no GDPR, HIPAA, SOC2, PCI-DSS, CCPA, ISO 27001, FERPA, PIPEDA. Frameworks are silently skipped rather than explicitly marked N/A.
2. **No competitor feature comparison** — Step 6 produces vague prose about "systems of this type" with no real competitor data and no feature matrix.
3. **Missing feature gaps have no severity signal** — gaps are listed in prose order with no scoring; tech lead cannot tell which gaps are blockers vs. nice-to-haves.
4. **Roadmap durations are fabricated** — Step 8 outputs `[estimated]` placeholders with no calculation logic, making phase duration estimates meaningless.
5. **No Go/No-Go decision** — the command produces findings but never synthesises them into a clear proceed/block signal.

---

## Decisions Made

| Area                     | Decision                                                                              |
|--------------------------|---------------------------------------------------------------------------------------|
| Competitor discovery     | Auto-discover via **web search** based on product domain inferred from SRS            |
| NFR compliance check     | **Check ALL frameworks**; every one gets `APPLIES / DEFERRED / N/A` — nothing skipped |
| Roadmap duration         | **Story-complexity formula**: S=1d, M=3d, L=5d × 1.3 buffer, calculated from story list |
| Gap severity             | **Score 1–10**; score 8+ = CRITICAL BLOCKER flagged before prioritization             |
| Go/No-Go decision        | **Scored synthesis** (5 dimensions × 20pts = 100); 🟢 80+, 🟡 50–79, 🔴 <50          |

---

## Approach

**Approach 2: Full renumber + clean 12-step flow.**

The existing steps 6–8 are fundamentally broken (vague prompts, no calculation logic). Patching them in-place produces the same ambiguity. A clean renumber with explicit output formats makes Claude behave consistently every time. Every step gets an explicit output block — Claude cannot improvise the format.

---

## New Step Map

```
STEP 1   Stack Completeness Check              (existing — unchanged)
STEP 2   Feature Completeness Check            (existing — unchanged)
STEP 3   Pseudo-code Requirement Check         (existing — unchanged)
STEP 4   NFR + Full Compliance Framework Check (EXPANDED — all 8 NFRs + 8 compliance frameworks)
STEP 5   Competitor Discovery & Feature Matrix (NEW — web search, feature matrix, gap severity)
STEP 6   Gap Analysis with Severity Scoring    (REWRITTEN — 1-10 score, blocker flag)
STEP 7   Feature Prioritization                (existing — unchanged)
STEP 8   Phase Development Roadmap             (REWRITTEN — formula-based duration)
STEP 9   Go/No-Go Decision                     (NEW — scored synthesis, 🟢🟡🔴 signal)
STEP 10  SRS Review Report                     (existing Step 5 — moved here, combined summary)
STEP 11  Phase 0 Gate                          (existing Step 9 — renumbered)
STEP 12  After "SRS approved"                  (existing Step 10 — renumbered, unchanged)
```

---

## Step-by-Step Design

### STEP 4 — NFR + Full Compliance Framework Check

**Trigger:** Read the SRS and check every category below. Infer compliance applicability from user roles, data types, geography, payment flows, and industry.

**Output format:**

```
NFR CHECKS
─────────────────────────────────────────────────────────────────────
Performance targets    ✅/❌/DEFERRED  [response time, concurrent users]
Security model         ✅/❌/DEFERRED  [auth, roles, data sensitivity]
Multi-tenancy scope    ✅/❌/DEFERRED  [which tables are tenant-scoped]
Soft delete            ✅/❌/DEFERRED  [which entities]
Pagination             ✅/❌/DEFERRED  [which list endpoints]
Audit logging          ✅/❌/DEFERRED  [what events, retention period]
SEO                    ✅/❌/N/A       [if public-facing: SSR, sitemap, meta tags, CWV]
WCAG Accessibility     ✅/❌/N/A       [AA or AAA, which user flows]

COMPLIANCE FRAMEWORKS
─────────────────────────────────────────────────────────────────────
GDPR     APPLIES/DEFERRED/N/A  [EU users? Personal data stored/processed?]
HIPAA    APPLIES/DEFERRED/N/A  [Health records or PHI handled?]
SOC 2    APPLIES/DEFERRED/N/A  [SaaS with enterprise/B2B customers?]
PCI-DSS  APPLIES/DEFERRED/N/A  [Card payments processed or stored?]
CCPA     APPLIES/DEFERRED/N/A  [California users? Personal data sold?]
ISO 27001 APPLIES/DEFERRED/N/A [Formal ISMS required by customers?]
FERPA    APPLIES/DEFERRED/N/A  [Student education records?]
PIPEDA   APPLIES/DEFERRED/N/A  [Canadian users? Personal data collected?]
```

**Rules:**
- `APPLIES` = framework is relevant AND SRS addresses it → ✅
- `APPLIES` without SRS coverage → ❌ → becomes an NFR gap
- `DEFERRED` = relevant but tech lead has explicitly deferred it
- `N/A` = not applicable to this product domain (explain in one line why)

**Detection heuristics:**
- Mentions "EU", "Europe", "GDPR" or stores personal data of unknown geography → GDPR APPLIES
- Mentions health, medical, patient, clinic, hospital, PHI → HIPAA APPLIES
- B2B SaaS with enterprise customers → SOC 2 APPLIES
- Mentions payments, billing, card, checkout, Stripe, Razorpay → PCI-DSS APPLIES
- Mentions California, US consumer app, data monetisation → CCPA APPLIES
- Mentions ISO certification, enterprise security contracts → ISO 27001 APPLIES
- Mentions students, grades, school, university, LMS → FERPA APPLIES
- Mentions Canada, Canadian users → PIPEDA APPLIES

---

### STEP 5 — Competitor Discovery & Feature Matrix

**Input:** Product domain inferred from SRS title, purpose, and user roles.

**Process:**
1. Web search: `"top [domain] software competitors 2025"` and `"[domain] alternatives"`
2. Select top 3–5 real named competitors (not generic categories)
3. Extract their key features from search results
4. Build feature matrix: YOUR SRS vs. each competitor
5. Score each gap using severity formula (see Step 6)

**If web search fails or returns no useful results:** Output `COMPETITOR SEARCH: No results — please provide competitor names` and prompt the user: "I could not find competitors for this domain automatically. Please list 2–5 competitor products and I will build the feature matrix." Do not hallucinate competitor names.

**Output format:**

```
COMPETITOR DISCOVERY
Detected domain : [e.g. "Online exam platform for students"]
Search queries  : "[query 1]", "[query 2]"
Competitors found: Competitor A, Competitor B, Competitor C, Competitor D

COMPETITOR FEATURE MATRIX
┌──────────────────────────┬──────────┬────────────┬────────────┬────────────┬──────────────┐
│ Feature                  │ YOUR SRS │ Comp A     │ Comp B     │ Comp C     │ Gap Severity │
├──────────────────────────┼──────────┼────────────┼────────────┼────────────┼──────────────┤
│ [feature]                │ ✅       │ ✅         │ ✅         │ ✅         │ —            │
│ [feature]                │ ❌       │ ✅         │ ✅         │ ✅         │ 9/10 BLOCKER │
│ [feature]                │ ❌       │ ✅         │ ❌         │ ✅         │ 6/10         │
│ [feature]                │ ✅       │ ❌         │ ❌         │ ❌         │ — (advantage)│
└──────────────────────────┴──────────┴────────────┴────────────┴────────────┴──────────────┘

COMPETITIVE POSITION SUMMARY
Advantages (you have, competitors don't): [N features]
Feature parity (all have):               [N features]
Critical gaps — score 8+ (all/most have, you don't): [N features — BLOCKERS]
Minor gaps — score < 8:                  [N features]
```

---

### STEP 6 — Gap Analysis with Severity Scoring

**Severity formula:** `score = (user_impact × 0.4) + (frequency × 0.3) + (competitive_risk × 0.3)`
All sub-scores on 1–10 scale. Final score rounded to 1 decimal.

**Output format — STAR matrix table:**

```
GAP ANALYSIS MATRIX
┌──────────────────────┬───────┬──────────────────────────────┬──────────────────────────────┬──────────────────────────────┬─────────────────────────────┐
│ Feature Gap          │ Score │ Situation                    │ Task                         │ Action                       │ Result                      │
├──────────────────────┼───────┼──────────────────────────────┼──────────────────────────────┼──────────────────────────────┼─────────────────────────────┤
│ [Gap name]           │ 9 🔴  │ [what is missing/broken now] │ [what tech lead must decide] │ [specific fix — story/AC]    │ [outcome if addressed]      │
│ [Gap name]           │ 6 🟡  │ [what is missing/broken now] │ [what tech lead must decide] │ [specific fix — story/AC]    │ [outcome if addressed]      │
│ [Gap name]           │ 3 🟢  │ [what is missing/broken now] │ [what tech lead must decide] │ [specific fix — story/AC]    │ [outcome if addressed]      │
└──────────────────────┴───────┴──────────────────────────────┴──────────────────────────────┴──────────────────────────────┴─────────────────────────────┘

Legend: 🔴 8–10 Critical Blocker  🟡 5–7 Significant  🟢 1–4 Minor
```

**STAR column definitions:**
- **Situation** — what is currently missing or broken in the SRS (current state)
- **Task** — what the tech lead needs to decide or define (decision required)
- **Action** — specific recommended fix (story to add, AC to write, framework to address)
- **Result** — outcome if addressed / risk if ignored

**Critical blockers list** (shown at top of Step 10 report):
- Any gap scoring 8.0+ is extracted and listed as a blocker
- A `CONDITIONAL` or `NO-GO` signal in Step 9 requires at least one blocker to be resolved

**Integration gaps** (same table, Category column = "Integration"):
- Check for external system connections implied by the product but absent from SRS
- Examples: email provider, SMS, payment gateway, SSO, analytics, push notifications

---

### STEP 8 — Phase Development Roadmap (Formula-Based)

**Complexity weights:** S = 1 day, M = 3 days, L = 5 days
**Buffer multiplier:** × 1.3 (review, testing, rework overhead)
**Working days per week:** 5
**Developer assumption:** 1 developer (solo). If team size is known, divide result by number of developers.

**Duration calculation block (required — output this for every phase):**

```
PHASE [N] DURATION CALCULATION
Stories in this phase:
  [Story ID] [Title] — [S/M/L] — [X]d
  [Story ID] [Title] — [S/M/L] — [X]d
  ...
  Raw total  : [X]d
  × 1.3 buffer: [Y]d
  ÷ 5 days/week: [Z] weeks

Phase [N] estimated duration: [Z]–[Z+1] weeks
```

**Phase table (after calculations):**

```
PHASE DEVELOPMENT ROADMAP
═══════════════════════════════════════════════════════════════════

Phase 0 — SRS & Design (Current)
  Goal     : Approved SRS + UI design + DB design + architecture
  Gate     : /sw-srs approved, /sw-ui approved, /sw-db approved, /sw-arch approved
  Duration : [from calculation block above]

Phase 1 — Solution Scaffold
  Goal     : Clean build, base classes, middleware, empty project structure
  Gate     : /sw-scaffold green build committed
  Duration : [standard — 1–2 days, no stories to calculate]

Phase 2 — ADO Board Setup
  Goal     : All Epics, Stories, Tasks created in Azure DevOps
  Gate     : /sw-plan complete, docs/BREAKDOWN.md "In ADO"
  Duration : [standard — 1 day]

Phase 3 — MVP (Must Have features)
  [duration calculation block]
  Gate     : All Must Have ACs passing, /sw-check clean on every story

Phase 4 — Post-MVP (Good to Have features)
  [duration calculation block]

Phase 5 — Quality Gates
  Checklist:
    [ ] Load test: [N] concurrent users at [X] RPS — target < [Y]ms p95
    [ ] Security: OWASP Top 10 pen test
    [ ] DB query profiling on largest tables
    [ ] Accessibility: WCAG 2.1 AA (if public-facing)
    [ ] Compliance audit: [list APPLIES frameworks]
  Duration : 1–2 weeks (standard)

Phase 6 — Production Deploy
  Gate     : All Phase 5 checks pass, tech lead sign-off, rollback plan documented
  Duration : 1–3 days (standard)

Phase 7+ — Nice to Have / Future Roadmap
  [list deferred features with reason]

ESTIMATED TOTAL: [sum of all phase durations] weeks
═══════════════════════════════════════════════════════════════════
```

---

### STEP 9 — Go/No-Go Decision

**Scoring dimensions (20 pts each, 100 pts total):**

| Dimension                          | 20 pts (full)              | 10 pts (partial)                      | 0 pts                          |
|------------------------------------|----------------------------|---------------------------------------|--------------------------------|
| Stack complete                     | Zero gaps                  | Minor gaps only (no blockers)         | Any critical stack gap         |
| All stories well-formed            | All stories pass Step 2    | < 20% of stories have gaps            | ≥ 20% stories incomplete       |
| NFR / Compliance APPLIES addressed | All APPLIES items covered  | 1–2 APPLIES items without SRS coverage| 3+ APPLIES items unaddressed   |
| No critical feature gaps (8+)      | Zero 8+ gaps               | Exactly 1 gap scoring 8+              | 2 or more gaps scoring 8+      |
| Roadmap is feasible                | Duration realistic         | Duration high but explained           | Calculation missing or absurd  |

**Output format:**

```
═══════════════════════════════════════════════════════════════════
GO / NO-GO DECISION
═══════════════════════════════════════════════════════════════════

  Stack complete              [XX / 20]
  Stories well-formed         [XX / 20]
  NFR / Compliance addressed  [XX / 20]
  No critical feature gaps    [XX / 20]
  Roadmap feasible            [XX / 20]
  ─────────────────────────────────────
  TOTAL                       [XX / 100]

  🟢 GO          80–100  — SRS is ready. Proceed to /sw-ui and /sw-db.
  🟡 CONDITIONAL  50–79  — Resolve blockers listed below before proceeding.
  🔴 NO-GO        < 50   — SRS requires major rework. Do not proceed.

  SIGNAL: 🟢 GO / 🟡 CONDITIONAL / 🔴 NO-GO

  Blockers preventing full GO (if any):
  1. [item — which step detected it — what is needed to resolve]
  2. [item]
  ...

  To resolve: fix each blocker, reply "resolve [item]: [answer]", then re-run /sw-srs
═══════════════════════════════════════════════════════════════════
```

---

### STEP 10 — SRS Review Report (Combined Summary)

Replaces old Step 5. Shown after Steps 1–9 complete.

```
SRS REVIEW REPORT
SRS File    : docs/SRS.md
Version     : [from SRS header]
Reviewed    : [today]

STACK GAPS      : [N] — [list]
STORY GAPS      : [N] — [list: story ID + what is missing]
PSEUDO CODE     : [N] methods need pseudo code — [list]
NFR GAPS        : [N] — [list APPLIES items without SRS coverage]
COMPLIANCE GAPS : [N] — [list frameworks that APPLY but are unaddressed]
FEATURE GAPS    : [N total] — [N] critical (8+) | [N] minor
COMPETITOR GAPS : [N] — [list features all/most competitors have that you lack]

⚠️ CRITICAL BLOCKERS (score 8+):
  1. [gap name — X/10]
  2. [gap name — X/10]

PENDING DECISIONS — Tech lead must resolve before "SRS approved"
┌────┬──────────────────────┬───────┬──────────────────────────────┬──────────────────────────────────────────┐
│ #  │ Gap                  │ Score │ Decision Needed               │ Reply with                               │
├────┼──────────────────────┼───────┼──────────────────────────────┼──────────────────────────────────────────┤
│ 1  │ [gap name]           │ X 🔴  │ [what must be decided]        │ "add to SRS: [name] — [priority]"        │
│ 2  │ [gap name]           │ X 🔴  │ [what must be decided]        │ "resolve [item]: [answer]"               │
│ 3  │ [framework name]     │ N/A   │ APPLIES — not addressed       │ "resolve [framework]: [approach]"        │
│ 4  │ [gap name]           │ X 🟡  │ [what must be decided]        │ "move [feature] to phase [N]"            │
└────┴──────────────────────┴───────┴──────────────────────────────┴──────────────────────────────────────────┘

[N] decisions pending. SRS cannot be approved until all 🔴 items are resolved.
🟡 and 🟢 items may be deferred — tech lead must explicitly confirm each.

OPEN QUESTIONS FOR TECH LEAD:
  1. [question]
  2. [question]
```

---

### STEP 11 — Phase 0 Gate (unchanged)

```
—————————————————————————————————————————————————
PHASE 0 GATE
To resolve SRS gaps : "resolve [item]: [answer]"
To add a gap feature: "add to SRS: [feature name] — [priority]"
To adjust roadmap   : "move [feature] to phase [N]"
To approve          : "SRS approved"

Claude will not proceed to /sw-ui or /sw-db until "SRS approved".
—————————————————————————————————————————————————
[STOP — wait for "SRS approved"]
```

---

### STEP 12 — After "SRS approved" (unchanged from current Step 10)

Same as existing: append approved gap features to SRS, update revision history, commit with tag `SRS-vX.X`, update README.md and CHANGELOG.md, push.

---

## What Is NOT Changing

- Steps 1, 2, 3 (Stack, Feature, Pseudo-code checks) — output format identical to current command
- Step 7 (Feature Prioritization table) — format identical to current command
- Step 12 (post-approval actions) — identical to current Step 10
- The Phase 0 gate command vocabulary (`resolve`, `add to SRS`, `SRS approved`)

---

## Implementation Notes

- The web search in Step 5 must be real search calls, not hallucinated competitor data. If search fails or returns no useful results, Claude must say so explicitly and ask the user to provide competitor names before continuing.
- The Go/No-Go score can go below 0 if multiple 8+ blockers exist (each is −10 from the gaps dimension). Cap display at 0 but note "score would be negative — multiple critical blockers".
- Steps 1–9 must ALL complete before Step 10 report is shown. No partial runs.
- The command must stop after Step 11 and wait for user input. It must not auto-proceed.
