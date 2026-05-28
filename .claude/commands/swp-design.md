---
name: swp-design
description: |
  Run Phase 2 design in a single canonical command - covers UI/UX design, deep UI enforcement, and database architecture with one approval gate.
  Default Phase 2 route - use this command for combined UI+DB, UI-only, DB-only, admin portals, public sites, mobile portals, reference-based redesigns, and fresh greenfield designs.
  Use when Phase 1 (architecture + scaffold) is complete and you want one command to replace the old split /swp-ui + /swp-db workflow.
  Standalone command - does NOT invoke /swp-ui or /swp-db internally. All design work is done within this command.
  Phase 2 combined gate - dev stories are BLOCKED until both Section 2A and Section 2B are approved.
  Outputs: root-only grouped dated docs such as docs/GGG.NNN.ui-design-YYYY-MM-DD.md, docs/GGG.NNN.db-design-YYYY-MM-DD.md, docs/GGG.NNN.entities-YYYY-MM-DD.md, and docs/GGG.NNN.breakdown-YYYY-MM-DD.md. BREAKDOWN Section 2A and Section 2B both marked [x] on sign-off.
  Prerequisite: /swp-arch (Stage 1 + Stage 2) must be complete - docs/ARCH-DESIGN.md and Section 1A + Section 1B [x] required.
  Trigger when: architecture is approved, designing UI/UX and database together, designing only UI, designing only DB, choosing a design reference, selecting admin/public/mobile portal UX, selecting chart libraries, or completing Phase 2.
compatibility: Any frontend framework, admin portals, public sites, mobile portals, SQL Server, PostgreSQL
---

Command  : /swp-design
Version  : 2.2
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

## Standalone Approval Publish Contract

When this command is run outside `/swp-orchestrate`, the Phase 2 approval gate must still publish the approved work.

After the exact phrase `design approved` is accepted, run `.claude/refs/approval-publish-contract.md` before marking Phase 2 complete or advancing to `/swp-plan`.

This standalone command must not mark Phase 2 complete unless the approval publish summary includes a pushed branch and a PR URL targeting `develop`.

---

## Generated Docs Filename Sequence Contract

All generated planning sub-doc markdown artifacts must use a grouped dot-sequence filename with an ISO date suffix and must live directly under the repository root `docs/` folder only.

- Filename format: `docs/[GGG].[NNN].[name]-[YYYY-MM-DD].md`
- `GGG` is the three-digit document group number for the current project/product flow, for example `001`.
- `NNN` is the three-digit sequence number inside that group, for example `001`, `002`, `003`.
- `name` is the lowercase kebab-case document name, for example `srs`, `arch-design`, `ui-design`, `db-design`, `entities`, or `breakdown`.
- `YYYY-MM-DD` is the artifact creation date or approved regeneration date, using the local workflow date.
- Examples: `docs/001.001.srs-2026-05-20.md`, `docs/001.002.entities-2026-05-20.md`, `docs/001.003.breakdown-2026-05-20.md`, `docs/001.004.arch-design-2026-05-20.md`.
- Root-only rule: do not create generated planning sub-docs under nested folders such as `docs/srs/`, `docs/design/`, `docs/plan/`, `docs/archive/`, or `docs/superpowers/`.

Before creating or updating generated planning docs:

1. Scan root `docs/` only for existing grouped dated docs matching `^[0-9]{3}\.[0-9]{3}\.[a-z0-9-]+-[0-9]{4}-[0-9]{2}-[0-9]{2}\.md$`.
2. Select the active `GGG` group from the existing SRS/BREAKDOWN group when present; otherwise create the next available group, starting at `001`.
3. For a new artifact in the active group, use the next available `NNN` in that group. If SRS exists as `docs/001.001.srs-2026-05-20.md`, the next generated doc in that flow is `docs/001.002.[name]-[YYYY-MM-DD].md`, then `docs/001.003.[name]-[YYYY-MM-DD].md`.
4. Preserve existing `GGG.NNN.name-date` filenames on updates. Never renumber, reuse, or change an existing `GGG.NNN` slot/date unless the user explicitly says `renumber docs approved` or `redate docs approved`.
5. If a legacy unnumbered doc exists, such as `docs/SRS.md`, `docs/UI-DESIGN.md`, `docs/DB-DESIGN.md`, `docs/ENTITIES.md`, or `docs/BREAKDOWN.md`, read it as an input alias but write any newly generated artifact using the grouped dated filename format.
6. If generated planning markdown docs are found outside root `docs/`, report them and stop before creating more docs unless the user explicitly approves migration.
7. Add a completion validation block whenever docs are written:

```text
GENERATED DOC GROUP SEQUENCE VALIDATION:
  Docs root              : docs/
  Active group           : [GGG]
  Artifact date          : [YYYY-MM-DD]
  Root grouped docs seen : [N]
  New docs created       : [docs/GGG.NNN.name-YYYY-MM-DD.md, ...]
  Existing docs updated  : [docs/GGG.NNN.name-YYYY-MM-DD.md, ...]
  Nested docs detected   : none / [list]
  Duplicate group.seq    : none / [list]
  Date mismatches        : none / [list]
  Gaps found             : none / [list]
  Verdict                : PASS / FAIL
```
| Version | Date       | Author  | Changes |
|---------|------------|---------|---------|
| 2.2     | 2026-05-21 | KapilDev | Added standalone approval publish enforcement: commit, push, PR to develop, and manager acceptance email after design approval |
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.12    | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.11    | 2026-05-20 | KapilDev | Added ISO date suffix to grouped generated markdown artifact names: `docs/[GGG].[NNN].[name]-[YYYY-MM-DD].md` |
| 1.10    | 2026-05-20 | KapilDev | Changed generated markdown artifact naming to root-only grouped `docs/[GGG].[NNN].[name].md` sequence format |
| 1.9     | 2026-05-20 | KapilDev | Added full UI reference asset extraction, required asset manifest, source classification, blocker detection, and asset confirmation gate inside /swp-design |
| 1.8     | 2026-05-20 | KapilDev | Added generated-doc filename sequence enforcement for numbered UI, DB, ENTITIES, and BREAKDOWN artifacts |
| 1.7     | 2026-05-20 | KapilDev | Merged split UI/DB behavior into canonical multi-use-case /swp-design, added design-reference intake, app-surface selection, default UI rules, AOS guidance, chart library recommendations, and internal deep UI/DB modes |
| 1.6     | 2026-05-20 | KapilDev | Added tiered UI/UX enforcement, deep-enforcement escalation triggers, and stricter combined-session Section A gates |
| 1.5     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.4     | 2026-05-18 | Zenthil | Added Workflow Contract near the top; clarified /swp-design as the default Phase 2 route with /swp-ui + /swp-db as the explicit alternate |
| 1.3     | 2026-05-17 | Zenthil | Added PATH CHECK to STEP 0 - enforce PATH CONFIRMED delivery flow |
| 1.2     | 2026-05-16 | Zenthil | STEP A.1.5 - Template Baseline Selection: GREENFIELD mode uses admin/public mock-design templates; domain KPI card mapping from SRS entities replaces generic placeholder cards |
| 1.1     | 2026-05-16 | Zenthil | STEP A.2 - full UI/UX mock format: multi-breakpoint wireframes, states, dark mode, design tokens, per-screen review checklist |
| 1.0     | 2026-05-15 | Zenthil | Initial version - merged Phase 2 command (UI/UX + DB in one gate) |

---

Design Phase 2 (UI/UX + Database) for: $ARGUMENTS
Phase 2 combined gate - /swp-plan is BLOCKED until both Section 2A and Section 2B are approved.

## Workflow Contract

- **Primary output artifacts:** root-only grouped files `docs/[GGG].[NNN].ui-design-[YYYY-MM-DD].md`, `docs/[GGG].[NNN].db-design-[YYYY-MM-DD].md`, `docs/[GGG].[NNN].entities-[YYYY-MM-DD].md`, and `docs/[GGG].[NNN].breakdown-[YYYY-MM-DD].md` with both Phase 2 rows marked `[x]`
- **Progress status surface:** `docs/BREAKDOWN.md` is the primary status surface; this command updates Section 2A, Section 2B, and Phase 3 readiness there
- **Blocked by:** completed Phase 1 (`docs/ARCH-DESIGN.md`, `docs/ENTITIES.md`, and BREAKDOWN Section 1A + Section 1B signed off), plus any PATH CONFIRMED mismatch unless explicitly overridden
- **Next command / compatibility path:** default next step is `/swp-plan`; `/swp-design` is the canonical Phase 2 route and absorbs the previous `/swp-ui + /swp-db` split behavior. Existing `/swp-ui` and `/swp-db` files should be treated as compatibility wrappers or legacy references.

**Note:** This command is standalone - it does not call /swp-ui or /swp-db internally.
All UI/UX and DB design work is done within this single command in one session.

**Compatible skill chain:**
  /swp-srs -> /swp-arch (Stage 1 + Stage 2) -> /swp-design -> /swp-plan -> /swd-start

**Supported use cases inside this command:**
- `FULL_PHASE2`: UI/UX + DB design in one approval gate.
- `UI_ONLY`: Section A only; update `docs/UI-DESIGN.md` and BREAKDOWN Section 2A only.
- `DB_ONLY`: Section B only; update `docs/DB-DESIGN.md`, `docs/ENTITIES.md`, and BREAKDOWN Section 2B only.
- `REFERENCE_UI`: UI design from image, Figma, code, or URL reference.
- `GREENFIELD_UI`: no reference; choose admin, public, mobile portal, or mixed baseline.
- `MOBILE_PORTAL`: mobile-first UI/UX with touch, bottom navigation, gestures, offline/error states, and responsive web/PWA rules.
- `UPDATE_MODE`: patch existing UI/DB design docs against changed SRS or ARCH-DESIGN.

**Legacy split route:**
  If a locked PATH CONFIRMED block still lists `/swp-ui + /swp-db`, run `/swp-design` in `UI_ONLY`, `DB_ONLY`, or `FULL_PHASE2` mode and update the docs/path after approval.

---

## Mode Selection

Select the run mode before Section A or B starts:

| User intent / signal | Mode | Sections to run | Approval phrase |
|---|---|---|---|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| "phase 2", "design all", no narrow argument | FULL_PHASE2 | A then B | `design approved` |
| "ui only", "screen design", "ux", "mobile portal", "admin portal", "public site" | UI_ONLY | A only | `ui section reviewed` then post-approval UI-only actions |
| "db only", "schema", "tables", "stored procedures", "migration" | DB_ONLY | B only | `db section reviewed` then post-approval DB-only actions |
| image/Figma/code/reference mentioned | REFERENCE_UI | A, plus reference extraction | `ui section reviewed` or `design approved` |
| existing UI-DESIGN.md or DB-DESIGN.md found | UPDATE_MODE | only changed sections | matching mode approval |

If the requested mode conflicts with PATH CONFIRMED, output the mismatch and explain how to run `/swp-design` in the correct mode.

---

## UI/UX Enforcement Tier

`/swp-design` is the canonical combined Phase 2 path. It now owns the core and deep UI/UX checks that were previously split across `/swp-design` and `/swp-ui`.

Enforce in this command:
- every SRS acceptance criterion mapped to a screen or view
- desktop, tablet where useful, and mobile wireframes for every screen
- role visibility rules and loading, empty, error, success, and validation states
- dark mode token pairs for every screen
- WCAG AA declarations, 44px touch targets, keyboard navigation, ARIA, and focus rules
- routing, component hierarchy, and state management
- SmartWorkz `sw-` BEM classes, 200ms animation, reduced-motion handling, and approved fonts
- modern, sleek, dense-but-readable layouts with clear hierarchy, restrained effects, and polished empty/loading/error states
- responsive behavior for desktop, tablet, mobile, and mobile-portal surfaces
- chart, table, KPI, search, filter, pagination, and export decisions for data-heavy screens
- HTML prototype/mock-data proof when requested or when screen complexity is high
- WCAG contrast pair scan when custom colors, imported references, or non-standard tokens are used
- IMAGE, FIGMA, CODE, or URL reference extraction with SRS cross-check
- mobile gestures, interactive states table, UX anti-pattern scan, animation compliance scan, permission matrix, SRS NFR table, RTL/i18n review, design token export, and Storybook list when applicable

Do not route deep UI work to `/swp-ui`; run it inside Section A and record which deep checks were executed.

---

## STEP 0  Pre-flight checks
### PATH CHECK  enforce locked delivery flow

Read docs/SRS.md PATH CONFIRMED block.

IF PATH CONFIRMED block is missing:
   WARNING  PATH CONFIRMED not found. Run /swp-srs to lock a delivery flow.
  Proceeding without path enforcement.

IF PATH CONFIRMED found:
  Extract: Flow name, Phase 1 command, Phase 2 command(s), Phase 3 command.
  Read BREAKDOWN.md to determine which phase is next (first phase not yet marked [x]).
  Check if this command (/swp-design) matches the correct next phase command.

  IF match:
     Correct next step for [Flow Name].
    After this command completes: [next command in PATH CONFIRMED sequence]

  IF no match:
     PATH MISMATCH  [Flow Name] expects [correct command] next, not /swp-design.
    Your locked sequence: [Phase 1 command]  [Phase 2 command]  [Phase 3 command]  dev
    Run [correct command] first, then return here.
    To override: type "override path  I know what I'm doing"


Before producing any output, verify all prerequisites:

  PRE-FLIGHT:
  docs/SRS.md found                  :  /  STOP  run /swp-srs first
  STACK CONFIRMED block found        :  /  STOP  run /swp-srs (missing stack)
  docs/ARCH-DESIGN.md found          :  /  STOP  run /swp-arch first (Phase 1 incomplete)
  docs/ENTITIES.md found             :  /  STOP  run /swp-arch first (entities not seeded)
  BREAKDOWN.md 1A [x] confirmed     :  /  STOP  architecture not signed off, run /swp-arch
  BREAKDOWN.md 1B [x] confirmed     :  /  STOP  scaffold not signed off, run /swp-arch Stage 2
  UI-DESIGN.md already exists        : YES (incremental update  read existing screens) / NO (fresh design)
  DB-DESIGN.md already exists        : YES (incremental update  read existing schema) / NO (fresh design)

  FROM STACK CONFIRMED:
  Frontend Framework   : [extracted]
  UI Component Library : [extracted]
  App Surface          : [admin portal / public site / mobile portal / mixed]
  Design Reference     : [image / Figma / code / URL / none]
  Animation Library    : [AOS allowed yes/no; framework-native alternative]
  Chart Library        : [selected / pending]
  Database Engine      : [extracted]
  ORM                  : [extracted]

If any  STOP is hit, halt immediately. Do not proceed past Step 0.

---

## SECTION A  UI/UX Design

### STEP A.0 - Design reference and app surface intake

Before producing UI output, identify or ask for the design baseline. If the user did not provide enough information, stop and ask only these missing items:

```
UI/UX DESIGN INTAKE:
  App surface          : admin portal / public site / mobile portal / mixed
  Design reference     : image / Figma / code / URL / none
  Reference path/URL    : [provided / missing]
  Visual direction     : modern, sleek, responsive, accessible, production-ready
  Animation preference : AOS / framework-native / none / decide from stack
  Chart need           : none / simple charts / dashboards / analytics-heavy / real-time
  Device priority      : desktop-first / mobile-first / equal
```

Rules:
- If app surface is missing, ask whether this is an admin portal, public site, mobile portal, or mixed application.
- If design reference is missing, ask whether to use a provided reference or proceed greenfield with SmartWorkz defaults.
- If the user supplies image, Figma, code, or URL reference, extract layout, navigation, color intent, component patterns, assets, and mismatches against SRS.
- If no reference is supplied, choose the baseline by app surface: admin template for authenticated operations, public template for marketing/public flows, mobile-portal baseline for field/user self-service flows.
- Do not approve Section A until the intake is recorded in the UI design output.

### STEP A.0.5 - Default UI/UX rules and library recommendations

Apply these default UI/UX rules unless SRS or brand guidelines override them:

| Area | Default rule |
|---|---|
| Visual style | Modern, sleek, calm, professional, high contrast, no clutter |
| Layout | Responsive from 360px mobile to 1440px desktop; include tablet behavior for complex pages |
| Spacing | Use tokenized 4/8/16/24/32px rhythm; no ad hoc pixel soup |
| Navigation | Admin: sidebar + command/search where useful; public: top nav + strong CTA; mobile portal: bottom nav or task-first tabs |
| Components | Data tables, forms, cards, filters, drawers, dialogs, toasts, skeletons, empty states, and error states must be specified |
| Animation | 200ms ease-out for microinteractions; use AOS only for public/marketing scroll reveals, not admin CRUD workflows |
| Accessibility | WCAG AA, keyboard nav, visible focus, ARIA labels, reduced motion, 44px touch targets |
| Responsiveness | Define desktop, tablet when needed, mobile layout, overflow, sticky actions, and touch behavior |
| Content | No lorem ipsum in prototypes; use realistic domain data from SRS |

Recommended libraries by need:

| Need | Recommended default | Use when | Avoid when |
|---|---|---|---|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| Scroll animation | AOS | Public landing pages, marketing sections, reveal-on-scroll content | Admin dashboards, forms, dense tools, mobile performance-sensitive screens |
| React charts | Recharts | Standard React dashboards and KPI charts | Very large datasets or advanced interactions |
| Framework-neutral charts | Apache ECharts | Analytics-heavy dashboards, drilldowns, mixed chart types, large data | Tiny simple charts where Chart.js is enough |
| Simple charts | Chart.js | Basic bar/line/pie charts with minimal setup | Complex dashboards, enterprise interactions |
| Admin dashboard charts | ApexCharts | SaaS/admin dashboards with polished defaults | Highly custom visual analytics |
| Custom visualization | D3 | Bespoke visualizations and unusual interactions | Normal CRUD dashboards |
| Tables/data grids | AG Grid / TanStack Table | Admin portals with sorting, filters, pagination, export | Simple static lists |

Record final selections:

```
UI LIBRARY DECISIONS:
  App surface       : [admin/public/mobile/mixed]
  Design reference  : [source or greenfield]
  Animation choice  : [AOS / framework-native / none] - reason: [why]
  Chart choice      : [library] - reason: [data complexity + framework]
  Table/grid choice : [library] - reason: [data volume + actions]
```

### STEP A.1  Screen inventory from SRS

Read docs/SRS.md and extract every user-facing screen or view implied by the features:

```
SCREEN INVENTORY:
  Screen 1: [Name]  [PAGE / MODAL / WIZARD / WIDGET]
    SRS source: N.N [feature name]
    Role access: [All / Admin / Tenant-user / Anonymous]
    Route: /[path]

  Screen 2: [Name]  [PAGE / MODAL / WIZARD]
    SRS source: N.N [feature name]
    Role access: [All / Admin / etc.]
    Route: /[path]

  ...

Total screens: N
```

### STEP A.1.5 - Template Baseline Selection

Before producing wireframes, use STEP A.0 intake to check whether a design reference was provided in $ARGUMENTS or attached context (image path, Figma URL/export, code path, existing app URL, or written brand notes):

```
Design reference provided : YES (IMAGE / FIGMA / CODE / URL / NOTES - use reference as baseline)
                          : NO  -> GREENFIELD - use app-surface baseline (this step)
```

**If a design reference was provided:** decide whether this command can safely use it as a basic baseline only.

- Basic baseline allowed here: high-level layout family, navigation pattern, and domain content replacement.
- Deep extraction required: colors, typography, spacing, component inventory, assets, SRS cross-check, or reuse/discard decisions from IMAGE, FIGMA, CODE, URL, or NOTES.

If deep extraction is required, run it inside this command and output:

```
REFERENCE EXTRACTION:
  Source type       : IMAGE / FIGMA / CODE / URL / NOTES
  Layout patterns   : [navigation, grids, cards, forms, modals]
  Visual tokens     : [colors, typography, spacing mapped to sw-tokens]
  Components reused : [list]
  Assets noticed    : [initial list; full manifest required in STEP A.1.6]
  SRS mismatches    : [none / list]
  Carry forward     : [approved patterns]
  Discard           : [patterns that conflict with SRS, WCAG, tokens, or app surface]
```

If only a basic baseline is needed, proceed to STEP A.2 and record: `Reference extraction level: basic baseline only`.

**If GREENFIELD (no reference):** Templates are available in `.claude/templates/mock-design/`. Select based on STEP A.0 app surface and screen Role Access from STEP A.1:

| Template | Path | Use for |
|----------|------|---------|
| **admin** | `.claude/templates/mock-design/admin/` | Authenticated dashboards, management, CRUD, analytics, billing, settings |
| **public** | `.claude/templates/mock-design/public/` | Landing page, blog, about, contact, marketing, public product pages |
| **mobile portal** | derive from mobile-first SmartWorkz baseline | Field users, self-service, PWA, task-first workflows, bottom navigation, touch/gesture-heavy screens |

Output:
```
TEMPLATE BASELINE:
  Authenticated screens ([list]) : admin - .claude/templates/mock-design/admin/
  Public screens ([list])        : public - .claude/templates/mock-design/public/
  Mobile portal screens ([list]) : mobile-first baseline
  No template match              : [screen] - generate from scratch
```
### STEP A.1.6 - Required asset inventory

Run this in all UI modes: REFERENCE_UI, GREENFIELD_UI, MOBILE_PORTAL, UI_ONLY, and FULL_PHASE2.

Read the SRS, STEP A.0 intake, STEP A.1 screen inventory, and any provided mock/image/Figma/code/URL reference. Produce a complete asset manifest before wireframes. Do not rely only on visible assets in the mock; infer assets required by screens, states, dark mode, responsive behavior, and empty/error/onboarding flows.

For every asset, classify source:

| Source | Meaning |
|---|---|
| Provide | Client/design team must supply it before build |
| Extract | Can be extracted from supplied mock, screenshot, Figma, code, or URL reference |
| Generate | Can be generated from app screenshots, UI mockups, or code during build |
| SVG | Can be created as inline/vector asset using SmartWorkz tokens |
| Derive | Can be computed from another asset, such as favicon from logo |
| Not required | Explicitly not needed for this app surface |

Required manifest format:

```
REQUIRED ASSET MANIFEST:

BRAND:
  Asset                         Screen/Use        Size/Format       Source      Blocker
  App logo - light              nav/login         SVG/PNG           Provide     YES/NO
  App logo - dark               dark mode nav     SVG/PNG           Provide     YES/NO
  Favicon                       browser           32x32 ICO/SVG     Derive      NO

IMAGES:
  Asset                         Screen/Use        Size/Format       Source      Blocker
  Hero/background image         public home       1920x1080         Provide/Extract/Generate  YES/NO
  Product/app screenshot        landing/dashboard 1200x800          Generate/Extract           YES/NO
  Team/avatar images            profile/team      200x200           Provide                  YES/NO

ICONS:
  Asset                         Screen/Use        Style             Source      Blocker
  Navigation icons              admin/mobile nav  outline/filled    SVG/library NO
  Empty-state icons             list empty states token SVG         SVG         NO

ILLUSTRATIONS AND STATES:
  Asset                         Screen/Use        Size/Format       Source      Blocker
  Empty list illustration        list screens      240x180          SVG/Generate NO
  404/error illustration         error routes      320x240          SVG/Generate NO
  Success/onboarding graphic     welcome/success   400x300          SVG/Generate NO

CHART/DATA VISUAL ASSETS:
  Asset                         Screen/Use        Library/Format    Source      Blocker
  Chart color palette            dashboard         tokens           SVG/library NO
  KPI trend indicators           dashboard/cards   icons/SVG        SVG/library NO

REFERENCE CARRYOVER:
  Asset or pattern               Carry / Adapt / Discard            Reason
  [name]                         [decision]                         [SRS/WCAG/token/app-surface reason]
```

Then output:

```
ASSET SUMMARY:
  Total assets required        : [N]
  Extractable from reference   : [N] - [list]
  Must be provided by team     : [N] - [list]
  Can be generated / SVG       : [N] - [list]
  Not required                 : [N] - [list]
  Critical-path blockers       : [none / list Provide assets needed before build]
```

If any critical-path `Provide` asset is missing, mark Section A as CONDITIONAL and list it in pending decisions. Do not hide asset gaps behind generic wording like "assets TBD".

If a mock/reference is provided, the UI design must explicitly say which assets were extracted, adapted, discarded, or still missing.
**Domain KPI card mapping (admin template  dashboard screens):**

The admin template uses generic KPI cards (`Monthly Revenue`, `Active Users`, `New Signups`, `Churn Rate`). Replace with domain-specific metrics from SRS primary entities:

| Domain | KPI 1 | KPI 2 | KPI 3 | KPI 4 |
|--------|-------|-------|-------|-------|
| Healthcare | Appointments Today | Active Patients | Pending Prescriptions | Missed Rate |
| Logistics | Shipments Today | Pending Deliveries | Active Drivers | On-time Rate |
| E-commerce | Orders Today | Revenue Today | Active Products | Cart Abandonment |
| HR / workforce | Active Employees | Open Positions | Timesheets Due | Turnover Rate |
| Field service | Work Orders Today | Dispatched Technicians | Pending Inspections | SLA Compliance |

Output before wireframes:
```
DOMAIN KPI MAPPING (from SRS):
  KPI 1 : [SRS entity]  "[count/metric label]"
  KPI 2 : [SRS entity]  "[status metric]"
  KPI 3 : [SRS entity]  "[rate/percentage]"
  KPI 4 : [SRS entity]  "[trend metric]"
```

**Public template content mapping:**
- Section titles  SRS product name and feature names
- Service cards  top 3 features from the SRS feature list
- CTA text  SRS primary user action (register / book / request demo / get started)

---

### STEP A.2  UI/UX Mockup (text-based, per screen)

For each screen output the full mock using the template below.
Design tokens: `sw-` BEM prefix for all class names. Full token tables  see `.claude/refs/swp-ui-reference.md` **Section K**.
Framework binding patterns (React/Vue/Angular/Flutter/SwiftUI/Svelte)  **Section A** in the same file.

```
  
  SCREEN: [Screen Name]
  Type  : [PAGE / MODAL / WIZARD / WIDGET]
  Route : /[path]   (MODAL: "opened from [parent route]")
  Role  : [Admin / User / Public / All authenticated]
  

   Desktop Layout (ASCII) 
  
   [Header / Nav bar]                                           
   [Breadcrumb: Home > Feature > Screen]                        
  
   [Left sidebar if any]    [Main content  form / table / card]
                            [Action buttons]                   
  

   Mobile Layout (375px) 
  
   [Hamburger / Top Nav]  
  
   [Stacked content]      
   [Full-width controls]  
   [Sticky CTA bar]       
  
  Mobile behavior: [sidebar collapses to drawer / bottom sheet / full-screen modal]

   Fields / Controls 
    - [Field name]  : [text / select / date / toggle / file / textarea]
                      [required / optional]  [validation rule]
                      tokens: --sw-color-input-background, --sw-spacing-md, --sw-color-focus-ring
    - [Field name]  : [select]  source: [API endpoint or enum name]
    ...

  Form validation pattern: [inline-as-you-type / on-blur / on-submit-only]

   Conditional fields 
    [Trigger field] value = [X]  show/hide [Target field]
    Per-framework code  see swp-ui-reference.md Section H

   Actions 
    - [Button]   [what happens]
                  Success : [route / state change]  animation: 200ms ease-out
                  Error   : [inline error / toast / modal]
    - [Destructive action]  confirmation: "Are you sure This cannot be undone."

   Role-based UI rules 
    - [Field / Button] : visible to [Admin]  hidden from [User]
    - [Section]        : visible only when [condition]

   States 
    Loading  : [skeleton on which area / spinner over which section]
    Empty    : [illustration + message + CTA  e.g. "No items yet. + Add First"]
    Error    :
      400/422 Validation  inline field errors + form banner
      401     Session     redirect /login + toast "Session expired"
      403     Forbidden   redirect /403
      5xx     Server      toast + Retry button
      Timeout             inline spinner  "Request timed out. [Retry]"
    Success  : "[Action] completed successfully."  auto-dismiss 3s

   Dark Mode 
    Same layout. Token pairs:
      Background : --sw-color-surface         --sw-color-surface-dark
      Text       : --sw-color-text-primary    --sw-color-text-primary-dark
      Inputs     : --sw-color-input-background  --sw-color-input-background-dark
      Borders    : --sw-color-border-primary  --sw-color-border-primary-dark
    Full dark token map  swp-ui-reference.md Section K

   Accessibility 
    ARIA roles     : [role="main" / "dialog" / "alert" / aria-label]
    Keyboard nav   : [Tab order / Esc closes modal / Enter submits]
    Focus trap     : MODAL only  aria-modal="true", Tab cycles within
    Touch targets  : 4444px minimum on all interactive elements
    Contrast       : 4.5:1 text / 3:1 UI (WCAG 2.1 AA)

   Notifications / Toasts 
    Success : "[Specific message]"   auto-dismiss 3s
    Error   : "[Specific message]"   manual dismiss + Retry button

   Per-screen review (fix before next screen) 
     Desktop + mobile wireframes present
     All fields listed with type + validation
     All actions have success + error paths
     Destructive actions have confirmation text
     Loading / empty / error / success states declared
     Dark mode token pairs declared
     Role-based visibility rules declared
     ARIA roles + keyboard nav + touch targets declared
```

### STEP A.3  Component hierarchy

For each screen, define the component tree:

```
[ScreenPage]
   [LayoutComponent]
        [HeaderComponent]
        [FeatureListComponent]
            [FeatureItemComponent]
        [FooterComponent]
```

### STEP A.4  Routing plan

```
ROUTING PLAN:
Route                : Component                : Guard              : Layout
/                    : HomePageComponent         :                   : MainLayout
/[feature]           : [Feature]ListComponent    : AuthGuard          : MainLayout
/[feature]/:id       : [Feature]DetailComponent  : AuthGuard          : MainLayout
/[feature]/new       : [Feature]FormComponent    : AdminGuard         : MainLayout
/admin               : AdminDashboardComponent   : AdminGuard         : AdminLayout
```

### STEP A.5  State management plan

For each screen, declare the state management approach (based on STACK CONFIRMED):

```
STATE PLAN:
Screen              : State approach               : Reason
[Feature] list      : [NgRx store / Pinia / Redux] : Shared across routes
[Feature] form      : [Component-local state]      : One screen only
[Dashboard]         : [Service + BehaviorSubject]   : Single consumer
```


### STEP A.5.5 u{2014} Permission Matrix

For each role defined in the SRS, declare which screens and actions are permitted. Run this step whenever role-based access or auth is mentioned in the SRS.

| Screen | Admin | Manager | User | Guest/Public |
|--------|-------|---------|------|--------------|
| [Screen 1] | View / Create / Edit / Delete | View / Create / Edit | View | u{2014} |
| [Screen 2] | View / Create / Edit / Delete | View | u{2014} | u{2014} |
| [Screen 3] | View / Create | View | u{2014} | u{2014} |

Permission gaps (screens with no explicit role assignment) u{2192} flag to SRS author before proceeding.

Per-framework enforcement:
- **React**: `useRole()` hook + conditional rendering (`{hasRole('Admin') && <Button />}`)
- **Angular**: `*ngIf="authService.hasRole('Admin')"` structural directive + route guards
- **Vue 3**: `v-if="userStore.hasRole('Admin')"` directive + navigation guards
- **Flutter**: `if (user.hasRole('Admin'))` widget conditional + named route guards
- **SwiftUI**: `if appState.userRole == .admin` conditional view modifier
- **Svelte**: `{#if $user.roles.includes('Admin')}` block + page guard load function

> See `.claude/refs/swp-ui-reference.md` **Section F** for full per-framework permission enforcement code examples.

PERMISSION RESULT:
  Roles defined    : [list]
  Screens covered  : [N of M]
  Gaps identified  : [list or NONE]
  Auth strategy    : [JWT / session / OAuth / API key]
### STEP A.6  Design system tokens

All UI must use SmartWorkz design tokens. Mandatory rules (apply inline in every wireframe):

```
  Class naming  : sw- BEM prefix  .sw-button--primary, .sw-card__header
  Animation     : 200ms ease-out on transform/opacity only  never layout properties
  AOS           : public/marketing scroll reveals only; avoid in admin CRUD and mobile performance-sensitive workflows
  Charts        : choose and record Recharts / ECharts / Chart.js / ApexCharts / D3 based on STEP A.0.5
  Dark mode     : every screen must have both light and dark token variants
  WCAG          : AA  4.5:1 text contrast, 3:1 UI, 44px touch targets
  Reduced motion: @media (prefers-reduced-motion: reduce) guard on all animations
  Fonts         : Satoshi / Clash Display / JetBrains Mono only  no Inter / Roboto
```

Full token lookup tables (color, spacing, z-index, typography, card, dark mode pairs):
> See `.claude/refs/swp-ui-reference.md` **Section K**

Per-framework animation examples (aj) + reduced-motion patterns:
> See `.claude/refs/swp-ui-reference.md` **Section I**

### STEP A.7  UI/UX Go/No-Go (100 pts)

Before scoring, run the core auto-fail checklist. Any `NO` blocks Section A until fixed or escalated:

| Core gate | Required result |
|-----------|-----------------|
| Every SRS AC maps to at least one screen/view | YES |
| Every screen has desktop and mobile wireframes | YES |
| Every screen declares fields, actions, role visibility, and states | YES |
| Every screen declares dark mode token pairs | YES |
| Accessibility declares WCAG AA, keyboard nav, focus rules, ARIA, and 44px touch targets | YES |
| Routing, component hierarchy, and state management are complete | YES |
| SmartWorkz `sw-` BEM, 200ms animation, reduced motion, and approved fonts are used | YES |
| App surface, design reference, animation choice, chart choice, and table/grid choice are recorded | YES |
| Required asset manifest and asset summary are complete | YES |
| Mock/reference assets are marked Carry / Adapt / Discard / Missing | YES / N/A |
| Deep UI checks required If YES, executed inside this command | YES / N/A |
| Permission matrix covers all SRS roles and screens | YES / N/A |

Score each dimension. Block if total < 80.

| Dimension | Points | Pass threshold |
|-----------|--------|----------------|
| 1. Screen coverage  every SRS AC has a screen | 20 | All ACs mapped |
| 2. Navigation  no dead ends, all routes defined | 20 | Full route tree |
| 3. Accessibility  WCAG AA confirmed, 44px targets | 20 | No failures |
| 4. Dark mode u{2014} semantic tokens for all components | 15 | All components |
| 5. State management u{2014} no unmapped shared state | 15 | All state declared |
| 6. Permission matrix u{2014} all SRS roles mapped to screens | 10 | All roles mapped / N/A if no auth |

```
UI/UX GO/NO-GO:
  1. Screen coverage    : [X]/20
  2. Navigation         : [X]/20
  3. Accessibility      : [X]/20
  4. Dark mode          : [X]/20
  5. State management   : [X]/15
  6. Permission matrix   : [X]/10
  Deep UI checks run    : [none / prototype / contrast / reference / permission / NFR / RTL / tokens / Storybook]
  
  Total                 : [X]/100
  Verdict               : GO 80 | NO-GO <80 | CONDITIONAL (list conditions)
```

---

##  SECTION A GATE 

After outputting the full UI/UX design above, STOP and output:

```
SECTION A (UI/UX) COMPLETE

UI/UX Go/No-Go             : [GO / NO-GO / CONDITIONAL]
Deep UI checks executed    : [none / list]

Review the UI design above. To continue to Section B (DB Design), type:
  "ui section reviewed"  continue to database design
  "ui changes: [your note]"  revise UI design before continuing
```

If any required deep UI check is not complete, do not accept `ui section reviewed`. Complete it inside this command first.

Wait for the keyword before proceeding to Section B.

---

## SECTION B  Database Design

### STEP B.0 - DB capability merge contract

Section B owns the database workflow that used to live in `/swp-db`. Do not route DB-only or deep DB design to `/swp-db`; run it here in DB_ONLY or FULL_PHASE2 mode.

Before STEP B.1, confirm:
- database engine and ORM from STACK CONFIRMED
- fresh vs update mode for `docs/DB-DESIGN.md`
- all SRS entities and UI screens that require data
- multi-tenancy, soft-delete, audit, PII, retention, compliance, and reporting needs
- API/data gaps found in Section A

Minimum DB output:
- schema assignment with no `dbo`
- table definitions with column types, constraints, audit columns, tenant rules, and indexes
- relationships, cascade decisions, and Mermaid ER diagram
- stored procedure/query plan, including search, paging, bulk, and complex business logic notes
- migration/rollback plan for SQL Server or PostgreSQL
- ENTITIES.md rows
- security/compliance review and Go/No-Go score

### STEP B.0.5 u{2014} UPDATE_MODE detection

Before running Section B, check if docs/DB-DESIGN.md already exists for this project.

If it exists, run a delta check and declare the mode:

| Category | Count |
|----------|-------|
| Entities to ADD (new tables) | [N] |
| Entities to UPDATE (columns/indexes/SPs changed) | [N] |
| Entities to REMOVE (tables being dropped) | [N] |

- **FRESH mode**: No existing DB-DESIGN.md  produce full design
- **UPDATE_MODE**: Existing DB-DESIGN.md found  produce delta only; show only changed tables, migration deltas, and SP changes

Stale check: if DB-DESIGN.md exists but SRS entities have diverged (new entities in SRS not in DB-DESIGN), flag the delta entities and switch to UPDATE_MODE automatically.
### STEP B.1  DB object naming conventions

Apply these rules to every database object.

| Object type      | Format                            | Example                    |
|------------------|-----------------------------------|----------------------------|
| Table            | [Schema].[PascalCase]             | Auth.Users, Exam.Questions |
| Stored Procedure | [Schema].usp[Entity][Action]      | Auth.uspUserGetById        |
| View             | [Schema].vw[Entity][Qualifier]    | Auth.vwActiveUsers         |
| Primary Key      | PK[TableName]                     | PKUsers                    |
| Foreign Key      | FK[Table][RefTable][Column]       | FKUsersTenantsTenantId     |
| Index            | IX[Table][Column(s)]              | IXUsersTenantId            |

Rules: Never use `dbo`. Every SP uses `usp` prefix. Constraint names always explicit.
**Column naming standards:**

| Pattern | Rule | Example |
|---------|------|---------|
| Primary key | Always Id (INT IDENTITY or UNIQUEIDENTIFIER) | Id INT IDENTITY(1,1) |
| Foreign key | [ReferencedEntity]Id | TenantId, UserId, CategoryId |
| Boolean | Is[State] or Has[State] | IsDeleted, IsActive, HasAttachment |
| Timestamp | [Action]At (DATETIME2, UTC) | CreatedAt, UpdatedAt, DeletedAt |
| Actor | [Action]By (INT FK Auth.Users.Id) | CreatedBy, UpdatedBy, ApprovedBy |
| Enum/status | [Entity]Status or [Entity]Type (INT or NVARCHAR) | OrderStatus, DocumentType |
| JSON blob | [Entity]Json (NVARCHAR(MAX)) | MetadataJson, ConfigJson |
| Encrypted | [Field]Encrypted (VARBINARY) | SsnEncrypted, CardNumberEncrypted |

**Data type guidelines:**

| Use case | SQL Server type | Avoid | Reason |
|----------|----------------|-------|--------|
| Short text (<256 chars) | NVARCHAR(n) | VARCHAR | Unicode support required |
| Long text / rich text | NVARCHAR(MAX) | TEXT | TEXT is deprecated |
| Boolean flags | BIT NOT NULL DEFAULT 0 | INT | Explicit semantics |
| Dates | DATETIME2 | DATETIME | Higher precision, no Y2K edge |
| Money / decimals | DECIMAL(18,4) | FLOAT | No rounding errors |
| GUIDs | UNIQUEIDENTIFIER | CHAR(36) | Native support, indexable |
| JSON data | NVARCHAR(MAX) + ISJSON() constraint | XML | JSON is standard API format |
| Enum values | INT with lookup table | NVARCHAR enum column | Enforced referential integrity |
| File content | Reference path in DB, blob in storage | VARBINARY(MAX) in DB | DB size and performance |
| IP addresses | VARCHAR(45) | INT | Supports IPv6 |
| Soft-delete marker | BIT NOT NULL DEFAULT 0 | nullable BIT | Always explicit |
| Audit timestamps | DATETIME2 NOT NULL DEFAULT GETUTCDATE() | DATETIME | UTC required |
| Row version | ROWVERSION | manual timestamp | Concurrency control |
| Tenant isolation | INT NOT NULL FK to Core.Tenants | nullable FK | Never nullable |
| Large files | External blob storage reference path | IMAGE | IMAGE is deprecated |

### STEP B.1.5 u{2014} PostgreSQL variant

If STACK CONFIRMED includes PostgreSQL, apply these rules instead of (or in addition to) SQL Server rules:

**Type mapping:**
| SQL Server | PostgreSQL | Notes |
|-----------|-----------|-------|
| INT IDENTITY(1,1) | SERIAL or BIGSERIAL | Or GENERATED ALWAYS AS IDENTITY |
| UNIQUEIDENTIFIER | UUID + gen_random_uuid() default | pgcrypto extension |
| NVARCHAR(n) | VARCHAR(n) | PostgreSQL is Unicode-native |
| NVARCHAR(MAX) | TEXT | TEXT is valid and recommended in PG |
| BIT | BOOLEAN | |
| DATETIME2 | TIMESTAMPTZ | Always store in UTC |
| DECIMAL(18,4) | NUMERIC(18,4) | |
| ROWVERSION | xmin system column | Or use updated_at trigger |

**Naming:** Use snake_case for all PostgreSQL objects (user_id, created_at, usp_user_get_by_id → n_user_get_by_id).

**Migration:** Npgsql EF Core provider — add UseNpgsql() in DbContext. Migration commands remain identical.

**Indexing:** Use CREATE INDEX CONCURRENTLY in production to avoid table locks.

**Security:** Use pg_crypto for encryption. Row-level security via CREATE POLICY.


### STEP B.2  Entity  Schema mapping

For each entity in docs/ENTITIES.md and SRS, assign to a bounded-context schema:

```
SCHEMA ASSIGNMENT:
  Core    Tenants, AuditLogs, Config
  Auth    Users, Roles, UserRoles, RefreshTokens
  [Feature Schema]  [Entity1], [Entity2], [Entity3]
```

### STEP B.3  Table definitions

For each entity, output the full column list:

```
TABLE: [Schema].[TableName]
  Column           Type              Constraints
  
  Id               INT IDENTITY(1,1) PK, NOT NULL
  TenantId         INT               FK  Core.Tenants.Id, NOT NULL
  [Column]         [Type]            [Constraints]
  ...
  IsDeleted        BIT               DEFAULT 0, NOT NULL
  CreatedAt        DATETIME2         DEFAULT GETUTCDATE(), NOT NULL
  CreatedBy        INT               FK  Auth.Users.Id, NOT NULL
  UpdatedAt        DATETIME2         NULL
  UpdatedBy        INT               NULL

  Indexes:
    IX[TableName]TenantId ON (TenantId) WHERE IsDeleted = 0
    [additional indexes for common queries]

  Row count estimate: [small <1k / medium 1k100k / large >100k]
```

### STEP B.4  Stored procedure plan

For each table, list the required SPs:

```
SP PLAN for [Schema].[TableName]:
  [Schema].usp[Entity]GetById           SELECT by Id (with TenantId filter + IsDeleted = 0)
  [Schema].usp[Entity]GetPagedByTenant  SELECT paged (PageNumber, PageSize, TenantId)
  [Schema].usp[Entity]Insert            INSERT single row
  [Schema].usp[Entity]Update            UPDATE by Id + TenantId
  [Schema].usp[Entity]Delete            soft delete (IsDeleted = 1)
  [additional SPs for complex queries from UI screens]
```

For any SP involving complex business logic (> 2 IF conditions, 2+ service calls, financial calculations):
```
PSEUDO CODE REQUIRED for [Schema].usp[Entity][Action]:
  SRS N.N defines: [yes  read it | no  flag missing pseudo code to /swp-srs]
```

### STEP B.5  Migration plan

```
MIGRATION PLAN:
  Migration 1: CreateSchema_[Feature]
     CREATE SCHEMA [Feature]
  Migration 2: Create_[Feature]_[Entity]
     CREATE TABLE [Schema].[TableName] (...)
  Migration 3: Create_SP_[Schema]_usp[Entity]GetById
     MigrationBuilder.Sql(CREATE OR ALTER PROCEDURE ...)
  ...

  EF Core migration command: dotnet ef migrations add [MigrationName]
  Deploy command:             dotnet ef database update
  Rollback:                   dotnet ef migrations remove (dev) | restore from backup (prod)
```

### STEP B.6  DB Design Go/No-Go (100 pts)

| Dimension | Points | Pass threshold |
|-----------|--------|----------------|
| 1. Schema coverage  all SRS entities have a table | 20 | No orphan entities |
| 2. SP completeness  every table has CRUD SPs | 20 | All CRUD covered |
| 3. Multi-tenancy  every table has TenantId | 20 | No exceptions |
| 4. Soft delete  every table has IsDeleted | 20 | No exceptions |
| 5. Migration plan  all tables in EF migrations | 20 | No missing migrations |

```
DB GO/NO-GO:
  1. Schema coverage    : [X]/20
  2. SP completeness    : [X]/20
  3. Multi-tenancy      : [X]/20
  4. Soft delete        : [X]/20
  5. Migration plan     : [X]/20
  
  Total                 : [X]/100
  Verdict               : GO 80 | NO-GO <80 | CONDITIONAL (list conditions)
```

---

##  FINAL GATE  "design approved" 

After both Section A and Section B are complete, output:

```
PHASE 2 DESIGN REVIEW COMPLETE

UI/UX  Go/No-Go : [GO / NO-GO / CONDITIONAL]
DB     Go/No-Go : [GO / NO-GO / CONDITIONAL]

Both sections complete. Review docs/UI-DESIGN.md and docs/DB-DESIGN.md.

To approve Phase 2 and unlock /swp-plan, type: "design approved"
To request changes, specify: "ui changes: [note]" or "db changes: [note]"
```

Wait for "design approved" before proceeding.

---

## STEP 7  Post-approval actions

After "design approved" is received:

**7.1  Write design documents**

Write the UI design to the existing grouped UI design doc if one exists, otherwise create the next group-sequence file: `docs/[GGG].[NNN].ui-design-[YYYY-MM-DD].md`.

The UI design document must contain:
- Run mode and use case: FULL_PHASE2 / UI_ONLY / REFERENCE_UI / GREENFIELD_UI / MOBILE_PORTAL / UPDATE_MODE
- Design reference and app surface intake
- UI library decisions: animation, chart, table/grid, UI component library
- Required asset manifest, asset summary, carry/adapt/discard decisions, and critical-path blockers
- Screen inventory table
- UI/UX enforcement tier summary
- Deep UI checks executed inside `/swp-design`
- All wireframes (Section A.2)
- Component hierarchy (Section A.3)
- Routing plan (Section A.4)
- State management plan (Section A.5)
- Design tokens in use

Write the DB design to the existing grouped DB design doc if one exists, otherwise create the next group-sequence file: `docs/[GGG].[NNN].db-design-[YYYY-MM-DD].md`.

The DB design document must contain:
- Run mode and use case: FULL_PHASE2 / DB_ONLY / UPDATE_MODE
- Schema assignment (Section B.2)
- All table definitions (Section B.3)
- SP plan per table (Section B.4)
- ER diagram (Mermaid format)
- Migration plan (Section B.5)

Update the existing grouped ENTITIES doc if one exists, otherwise create the next group-sequence file: `docs/[GGG].[NNN].entities-[YYYY-MM-DD].md`; add any new entities defined during DB design.

Update the existing grouped BREAKDOWN doc if one exists, otherwise create the next group-sequence file: `docs/[GGG].[NNN].breakdown-[YYYY-MM-DD].md`.

**7.2  Mark 2A and 2B in BREAKDOWN.md**

Find:
```
## Phase 2A  UI/UX Design          [ ] pending
```
Replace with:
```
## Phase 2A  UI/UX Design          [x] YYYY-MM-DD
  - Screens: [N] defined
  - Framework: [detected framework]
  - Dark mode: confirmed
  - WCAG: AA compliant
```

Find:
```
## Phase 2B  DB Design             [ ] pending
```
Replace with:
```
## Phase 2B  DB Design             [x] YYYY-MM-DD
  - Tables: [N], SPs: [N]
  - Schemas: [list]
  - Migration plan: included
```

**7.3  Unlock Phase 3**

Since both 2A and 2B are now [x], also find:
```
## Phase 3   Dev Stories           [ ] BLOCKED (requires 1A+1B+2A+2B complete)
```
Replace with:
```
## Phase 3   Dev Stories           [ ] READY  run /swp-plan to create dev stories
```

**7.4  Commit and publish all design documents**

Use the Standalone Approval Publish Contract in `.claude/refs/approval-publish-contract.md`.

```
git add docs/*.*.ui-design-*.md docs/*.*.db-design-*.md docs/*.*.entities-*.md docs/*.*.breakdown-*.md docs/UI-DESIGN.md docs/DB-DESIGN.md docs/ENTITIES.md docs/BREAKDOWN.md
git commit -m "docs(phase-2): UI/UX + DB design approved  2A and 2B signed off"
git push origin HEAD
```

Create or update the PR to `develop` and generate the manager acceptance email before continuing.

**7.5  Run /swp-sync to validate cross-doc consistency**

Run /swp-sync to verify SRS  UI-DESIGN  DB-DESIGN  ARCH-DESIGN consistency.
Block on any conflict found by /swp-sync before outputting the completion message.

**7.7 u{2014} Downstream impact analysis**

Identify and document any gaps introduced by the UI/UX and DB design decisions:

| Impact area | Change | Required action |
|-------------|--------|-----------------|
| DB contract | New table / column / SP name change | Update ARCH-DESIGN.md API contracts if affected |
| ARCH module | New UI feature needing a new bounded context or module | Flag to /swp-arch for Phase 1 update |
| Entities | New entity introduced in DB not yet in ENTITIES.md | STEP 7.1 update required |
| API surface | New screen requires a new API endpoint | Flag to dev story backlog |
| Auth scope | New permission matrix role needs new auth claim | Flag to /swp-arch security layer |

Write any flagged impacts to the BREAKDOWN doc under a ## Downstream Flags section.

**7.8 u{2014} Design token export**

Export all tokens used in this design to docs/design-tokens.json:

```json
{
  "version": "1.0",
  "generated": "YYYY-MM-DD",
  "project": "[project name]",
  "tokens": {
    "colors": {
      "--sw-color-primary": "#value",
      "--sw-color-surface": "#value"
    },
    "spacing": {
      "--sw-space-1": "4px",
      "--sw-space-2": "8px"
    },
    "typography": {
      "--sw-font-body": "Satoshi, sans-serif",
      "--sw-font-display": "Clash Display, sans-serif",
      "--sw-font-mono": "JetBrains Mono, monospace"
    },
    "animation": {
      "--sw-duration-default": "200ms",
      "--sw-easing-default": "ease-out"
    }
  }
}
```

Add docs/design-tokens.json to the git commit in STEP 7.4.

**7.9 u{2014} Storybook story skeletons**

For each shared component identified in Section A.3 (component hierarchy), generate a Storybook story skeleton:

```typescript
// stories/[ComponentName].stories.ts
import type { Meta, StoryObj } from '@storybook/[framework]';
import { [ComponentName] } from '../src/components/[ComponentName]';

const meta: Meta<typeof [ComponentName]> = {
  title: 'SmartWorkz/[ComponentName]',
  component: [ComponentName],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof [ComponentName]>;

export const Default: Story = { args: {} };
export const DarkMode: Story = { args: {}, parameters: { backgrounds: { default: 'dark' } } };
```

Write skeleton files to stories/[ComponentName].stories.ts for each shared component. Add to git commit in STEP 7.4.
**7.6  Output completion message**

```
PHASE 2 COMPLETE  UI/UX + DB Design

2A UI/UX Design : [x] approved
2B DB Design    : [x] approved
Phase 3          : READY  run /swp-plan to create dev stories

Docs written:
  docs/[GGG].[NNN].ui-design-[YYYY-MM-DD].md   - [N] screens defined
  docs/[GGG].[NNN].db-design-[YYYY-MM-DD].md   - [N] tables, [N] SPs
  docs/[GGG].[NNN].entities-[YYYY-MM-DD].md    - updated
  docs/[GGG].[NNN].breakdown-[YYYY-MM-DD].md   - updated

Next: Run /swp-plan to break down stories into ADO tasks.
```

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.2** (2026-05-21): Added standalone approval publish enforcement: commit, push, PR to develop, and manager acceptance email after design approval.
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


