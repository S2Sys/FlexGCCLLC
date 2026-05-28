---
name: swp-validate
description: |
  Validate startup ideas and auto-generate Software Requirements Specifications (SRS) using a structured framework: market size (TAM/SAM/SOM), problem-solution fit, MVP feasibility, founder fit, and competitive advantage. Returns GO/NO-GO/CONDITIONAL with visual scorecard, detailed analysis, and actionable next steps. Pivot suggestions for NO-GO ideas.

  TRIGGER THIS SKILL when:
  - Validating a business idea before building (pitch validation)
  - Need GO/NO-GO decision with detailed scoring
  - Generating SRS from a validated idea
  - Identifying what's blocking viability and how to pivot
  - Presenting validation findings to investors/co-founders/team
  - Input: prose idea, partial SRS, or mixed format
compatibility: Any  business idea validation, stack-agnostic
---

Command  : /swp-validate
Version  : 2.1
Updated  : 2026-05-21

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

## Phase/Stage Done Summary Contract

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

## Skill Optimization Contract

Before final output, run this optimization pass:

1. Re-check the command description and confirm the output satisfies every promised capability.
2. Confirm required inputs and mark missing or weak evidence as `DATA GAP`; do not invent data, approvals, metrics, IDs, costs, dates, or verification results.
3. Convert findings into action-ready items with owner, priority, expected impact, effort, confidence, verification method, and next command or stakeholder.
4. Include a quality scorecard in the final artifact or final response:

| Area | Status | Evidence | Required Follow-up |
|---|---|---|---|
\|\ Input\ completeness\ \|\ PASS\ /\ CONDITIONAL\ /\ BLOCKED\ \|\ \[sources]\ \|\ \[action]\ \|
| Evidence quality | PASS / CONDITIONAL / BLOCKED | [proof] | [action] |
| Output actionability | PASS / CONDITIONAL / BLOCKED | [owners/priorities] | [action] |
| Handoff clarity | PASS / CONDITIONAL / BLOCKED | [next command/owner] | [action] |
| Verification | PASS / CONDITIONAL / BLOCKED | [checks] | [action] |
| Documentation sync | PASS / CONDITIONAL / BLOCKED / N/A | [docs reviewed] | [action] |

If any area is `BLOCKED`, stop and report blockers instead of marking the workflow complete.

---

| Version | Date       | Author  | Changes |
|---------|------------|---------|---------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |
| 1.2     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |

---

# SmartWorkz SRS Validator

> **Usage:** Provide your idea as $ARGUMENTS or paste it after the command.
> If no input is provided  STOP and output: "Please provide a business idea to validate. Example: `/swp-validate` followed by your idea description."

A structured validation framework for startup ideas with auto-generated Software Requirements Specifications.

## How It Works

### 1. Input Formats Supported
- **Prose description**: "I want to build a platform for..."
- **Structured SRS**: Paste existing Software Requirements Specification
- **Hybrid**: Mix of description + partial specs
- **Claude Code input**: Accepts SRS docs or idea notes as uploaded/pasted content

### 2. Validation Framework

The skill evaluates ideas across **5 core dimensions**:

#### A. Market Size & Opportunity (TAM/SAM/SOM)
- **TAM** (Total Addressable Market): Global market size for the problem
- **SAM** (Serviceable Addressable Market): Realistic addressable market for your startup
- **SOM** (Serviceable Obtainable Market): Year 1-3 realistic target
- Scoring: Market size alone isn't enough; sustainability & growth trajectory matter

#### B. Problem-Solution Fit
- Is the problem real and painful enough that people will pay
- Does the proposed solution directly address the core problem
- Are there existing alternatives that satisfy the same need
- Assessment: Gap between current solutions and proposed solution

#### C. MVP Feasibility
- Can an MVP be built in 3-6 months with current resources
- Technical complexity vs. team capability match
- Regulatory/compliance barriers
- Budget & timeline realism

#### D. Founder Fit & Execution Capability
- Does the founder(s) have relevant domain expertise
- Have they shipped products before
- Is there a co-founder with complementary skills
- Market access: Do they have relationships in the target market

#### E. Competitive Advantage & Competitor Analysis
- What's defensible about this idea
- Network effects, brand, tech moat, or distribution advantage
- How long until competitors catch up
- Can you sustain a 3-5 year lead

#### F. Competitor Checks (MUST HAVE / GOOD TO HAVE)

**MUST HAVE** (Non-negotiable; deal-breaker if missing):
- [ ] Identified at least 3-5 direct competitors or alternatives
- [ ] Clear differentiation from the best existing solution
- [ ] Sustainable advantage that lasts 12+ months
- [ ] Founder understands competitor pricing & positioning
- [ ] Market space not dominated by well-funded giants (or you have a wedge)

**GOOD TO HAVE** (Strengthens position but not fatal if weak):
- [ ] Proprietary data, tech, or network effects
- [ ] First-mover advantage or timing window
- [ ] Unique distribution channel or partnership
- [ ] Brand recognition or community loyalty
- [ ] Cost advantage (lower CAC, better unit economics)
- [ ] Regulatory moat or compliance complexity barrier

---

## Output Formats

### Option 1: Quick Validation (1-2 pages)
```
DECISION: GO / NO-GO / CONDITIONAL

Scorecard (Visual):
 Market Opportunity:  7/10
 Problem-Solution Fit:  5/10
 MVP Feasibility:  8/10
 Founder Fit:  7/10
 Competitive Advantage:  2/10

Top 3 Reasons (GO/CONDITIONAL):
1. [Strongest reason for validation]
2. [Second strongest]
3. [Third strongest]

Top 3 Blockers (NO-GO/CONDITIONAL):
1. [Biggest risk or gap]
2. [Second biggest]
3. [Third biggest]

COMPETITOR ANALYSIS:
Direct Competitors:
- Competitor A: [Strength] vs [Your differentiation]
- Competitor B: [Strength] vs [Your differentiation]
- Competitor C: [Strength] vs [Your differentiation]

Must-Have Checks:
 [Status] Identified 3+ competitors
 [Status] Clear differentiation vs best solution
  [Status] 12+ month sustainable advantage

Good-to-Have Checks:
 [Status] Proprietary data/tech
  [Status] First-mover advantage
```

### Option 2: Full Validation Report (3-5 pages)
All of above + detailed analysis per dimension, evidence-based scoring, risk assessment, and pivot suggestions.

### Option 3: Customizable Depth
User specifies: "Give me a quick 1-page GO/NO-GO" or "Full 5-page report with SRS."

---

## Competitor Analysis Checklist

Use this checklist to systematically assess your competitive position:

### Direct Competitors (Name each one)
```
Competitor Name: ___________
Market Share: _____ %  |  Pricing: $_____ /month
Strengths:
-
-
Weaknesses (vs. your plan):
-
-
Your differentiation:
-
```

### MUST HAVE Validation
Score each 0-10. **All must be 6+** to pass:

| Check | Score | Notes |
|-------|-------|-------|
| Identified 3-5 direct competitors | _/10 | List them in table above |
| Clear differentiation from #1 competitor | _/10 | What makes you different |
| Sustainable advantage (12+ months) | _/10 | How long can you hold the lead |
| Founder knows competitor pricing | _/10 | Can you compete on price/value |
| Market not locked by giants | _/10 | Uber/Amazon not dominating this |
| **MUST HAVE SCORE** | **__/50** | **Need 30+** to proceed |

### GOOD TO HAVE Advantages
Check all that apply (0-5 should still pass, 5+ is strong):

- [ ] Proprietary data source (e.g., existing customer base, unique dataset)
- [ ] Proprietary tech/algorithm (hard to copy)
- [ ] Network effects (product stronger with more users)
- [ ] First-mover advantage + defensible position
- [ ] Unique distribution channel (e.g., you have access to target market)
- [ ] Brand recognition or community loyalty
- [ ] Superior unit economics (lower CAC, higher LTV)
- [ ] Regulatory moat or compliance complexity
- [ ] Switching costs (hard for users to leave once using you)
- [ ] Strategic partnerships or integrations

---

### GO Criteria (Score 70+/100)
- Market opportunity is clear and sizeable
- Problem-solution fit is strong or validated
- MVP is feasible with team resources
- Founder has relevant experience or learning velocity
- At least one defensible advantage exists

**Action**: Auto-generate full SRS (Software Requirements Specification) covering:
- Product vision & scope
- User personas & use cases
- MVP feature set (Phase 1)
- Technical architecture (high-level)
- Go-to-market strategy
- Success metrics & KPIs

### CONDITIONAL Criteria (Score 50-69/100)
- Idea has merit but needs validation or refinement before building
- Example: Strong market but unproven problem OR Strong fit but weak market
- Action: Suggest validation experiments or pivot direction before committing
- Optional: Generate preliminary SRS pending validation

### NO-GO Criteria (Score <50/100)
- Multiple fundamental gaps (market + fit + execution)
- Idea might not reach viable scale
- Pivot or major rethink required
- Action: Suggest 2-3 pivot directions to improve viability

---

## Pivot Suggestions (NO-GO Only)

If the idea scores NO-GO, suggest **2-3 alternative directions** that:
- Preserve the founder's expertise or passion
- Target a nearby but larger/more tractable market
- Fix the weakest dimension (e.g., if TAM is too small, pivot to adjacent TAM)
- Show a clearer path to MVP or founder advantage

Example:
```
PIVOT 1: Narrow to B2B SaaS (vs B2C marketplace)
 Market: Smaller TAM but 10x higher LTV
 Fit: Founder already has enterprise relationships
 Feasibility: Easier to get initial customers for feedback

PIVOT 2: Geographic focus (vs global launch)
 Become #1 in Salem/TN first, then expand
 Reduces competition, improves founder fit
 Clearer go-to-market path
```

---

## Customization Options

User can specify depth at any point:

```
validate(idea, depth="quick")       // 1-page GO/NO-GO
validate(idea, depth="full")        // 3-5 page report
validate(idea, depth="with-srs")    // Full report + SRS generation
validate(idea, depth="no-srs")      // Full report, skip SRS
```

---

## Step-by-Step Usage

1. **Paste or describe** the business idea (prose, SRS, or mixed)
2. **Specify depth** (optional; defaults to "quick")
3. **Claude validates** across all 5 dimensions
4. **Output**: Decision + scorecard + detailed analysis
5. **If GO**: Auto-generate SRS for implementation
6. **If NO-GO**: Receive pivot suggestions
7. **If CONDITIONAL**: Get validation roadmap before committing

---

## Tips for Best Results

- **Be specific**: "A platform for X" is good; add target user, revenue model, competitive landscape
- **Founder context**: The skill evaluates you tooinclude your background, expertise, network
- **Market data**: Mention any TAM estimates, customer conversations, or existing validation
- **Timeline**: Are you planning to build in 6 weeks or 6 months Feasibility depends on it
- **Resources**: Budget, team size, and technical constraints shape the recommendation
- **Competitor research**: Know your top 3-5 competitors cold. Pricing, features, positioning, GTM
- **Differentiation clarity**: Don't say "better UX"say HOW (e.g., "30s setup vs 10 min for Competitor A")

---

## What This Skill Does NOT Do

- Make the final decision (that's on you)
- Guarantee success if you buildonly validates viability
- Replace customer discoveryuse this to confirm your thinking, not replace real validation
- Handle highly regulated industries in depth (e.g., healthcare, finance, pharma) without specialist input
## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.
## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).
- **v1.1** (2026-05-20): Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards


