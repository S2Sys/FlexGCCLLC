---
name: swp-ui
description: |
  Legacy compatibility wrapper for UI-only Phase 2A design. Prefer /swp-design in UI_ONLY, REFERENCE_UI, GREENFIELD_UI, or MOBILE_PORTAL mode for all new work.
  Design UI/UX for a feature only when an older PATH CONFIRMED flow explicitly calls /swp-ui.
  Prerequisite: docs/SRS.md + docs/ARCH-DESIGN.md must exist (1A in BREAKDOWN.md must be [x]).
  Trigger when: an older flow calls /swp-ui, but route users to /swp-design unless split compatibility is required.
compatibility: React, Angular, Vue, Svelte, Flutter, SwiftUI  any frontend framework
Command  : /swp-ui
Version  : 2.11
Updated  : 2026-05-21
| Version | Date       | Author  | Changes                                                                                         |
|---------|------------|---------|-------------------------------------------------------------------------------------------------|
| 2.11    | 2026-05-21 | KapilDev | Added standalone approval publish enforcement: commit, push, PR to develop, and manager acceptance email after UI approval |
| 2.9     | 2026-05-21 | KapilDev   | Added Skill Maturity 2.0 Contract for repo-wide command readiness consistency |

| 2.8     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 2.7     | 2026-05-20 | KapilDev | Marked /swp-ui as a legacy compatibility wrapper and routed new UI-only work to /swp-design modes |
| 2.6     | 2026-05-20 | KapilDev | Added deep UI/UX enforcement entry contract and mandatory escalation criteria from /swp-design |
| 2.5     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 2.4     | 2026-05-18 | Zenthil | Added PATH CHECK to STEP 0  enforce PATH CONFIRMED delivery flow |
| 2.3     | 2026-05-16 | Zenthil | STEP 1.0G  Template Baseline Selection: GREENFIELD mode now uses admin/public mock-design templates; domain KPI card mapping from SRS entities replaces generic placeholder cards |
| 2.2     | 2026-05-16 | Zenthil | STEP 1.5.1 contrast scan; Blazor/Razor Pages framework (STEP 0.5 + STEP 2); STEP 2.6 UX writing guide; STEP 2.7 Mermaid flow; STEP 3.2 onboarding/empty state; STEP 3.3 push notification flow; STEP 3.4 AI/ML patterns; STEP 3.5 map/geolocation; STEP 7.10 token export; STEP 7.11 Storybook skeletons |
| 2.1     | 2026-05-15 | Zenthil | Stage 1 STEP 1.0E  Required Asset Inventory: banner images, team/people photos, product images, logo, icons, illustrations/empty states; source classification (Provide/Extract/SVG/Generate); blocker detection for critical-path screens |
| 2.0     | 2026-05-15 | Zenthil | Stage 1  Reference Input & Asset Extraction: IMAGE/FIGMA/CODE modes with SRS cross-check and sw-token mapping; GREENFIELD skips Stage 1 entirely |
| 1.9     | 2026-05-15 | Zenthil | Phase 2 gate; ARCH-DESIGN.md + 1A prereq check; BREAKDOWN 2A mark on sign-off; 2B cross-check unlocks Phase 3 |
| 1.8     | 2026-05-14 | Claude  | Skill audit fixes: typography scale (Major Third 1.25) with font constraints (Satoshi/Clash/JetBrains), CSS naming convention (sw- BEM prefix), component testing strategy (Jest/Vitest/Jasmine/flutter_test/XCTest/Svelte) |
| 1.7     | 2026-05-14 | Zenthil | 4 design system gaps closed: design tokens guidance in STEP 2, dark mode design pattern (REQUIRED), API error handling UI patterns, animation timing specification (200ms ease-out rule) |
| 1.6     | 2026-05-13 | Zenthil | Added conditional field pattern (STEP 2); RxJS operator selection table (STEP 5); worked example screen (STEP 2); @Input/@Output contracts table (STEP 3) |
| 1.5     | 2026-05-13 | Zenthil | Step 6 Go/No-Go: added SRS NFR verification block (WCAG from SRS, pagination requirements, compliance frameworks); dimension 6 expanded to cover SRS NFRs |
| 1.4     | 2026-05-13 | Zenthil | STEP 0: UPDATE MODE DETECTION  delta analysis (add/update/remove screens, patch vs regenerate); STEP 7.9: DOWNSTREAM IMPACT  DB contract gaps, arch module gaps, /swp-sync shortcuts |
| 1.3     | 2026-05-13 | Zenthil | Added auto /swp-sync validate after "UI approved"                                                |
| 1.2     | 2026-05-13 | Zenthil | Added STEP 0 pre-flight checks, screen type classification (PAGE/MODAL/WIZARD/WIDGET), mobile wireframes, breadcrumbs, role-based UI rules, accessibility section, notifications/toasts, pagination details |
| 1.1     | 2026-05-13 | Zenthil | Added Go/No-Go scored decision (520 pts) + missing screen/flow detection + PENDING DECISIONS matrix |
| 1.0     |           | Zenthil | Initial version                                                                                 |

---

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

---

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

Final output must include a `RUN SUMMARY` with the same fields. If a phase/stage is skipped, say `Skipped` with reason and impact. If partially failed, show recovery status and do not mark it done.

---

## Standalone Approval Publish Contract

When this command is run outside `/swp-orchestrate`, the Phase 2A approval gate must still publish the approved work.

After the exact phrase `UI approved` is accepted, run `.claude/refs/approval-publish-contract.md` before marking Phase 2A complete or advancing to `/swp-db` or `/swp-plan`.

This standalone command must not mark Phase 2A complete unless the approval publish summary includes a pushed branch and a PR URL targeting `develop`.

---

Design UI/UX for: $ARGUMENTS
Phase 2 gate  DB design and development are BLOCKED until this review is complete and approved.

Read the following before outputting anything:
  1. docs/SRS.md
  2. CLAUDE.md 14, 16, 18
  3. CONTEXT.md  extract: current Phase, Sprint, Story IDs in scope
  4. The STACK CONFIRMED block  extract: Frontend framework + version, UI component library, CSS framework, default state approach

If no $ARGUMENTS provided, design UI/UX for ALL in-scope features for the current phase in CONTEXT.md.

---

## Deep UI/UX Enforcement Contract

`/swp-ui` is mandatory when `/swp-design` identifies any deep-enforcement trigger:
- HTML prototypes or mock-data proof
- WCAG contrast pair scan
- IMAGE, FIGMA, or CODE reference extraction and SRS cross-check
- tablet 768px wireframes
- mobile gestures
- interactive states table
- 32-item self-review and scoring
- UX anti-pattern and animation compliance scans
- permission matrix
- SRS NFR verification
- RTL or i18n verification
- design token export
- Storybook skeletons

If invoked after `/swp-design` escalation, read the Section A output and fill only missing deep-enforcement artifacts unless the tech lead asks for full regeneration.

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
  Check if this command (/swp-ui) matches the correct next phase command.

  IF match:
     Correct next step for [Flow Name].
    After this command completes: [next command in PATH CONFIRMED sequence]

  IF no match:
     PATH MISMATCH  [Flow Name] expects [correct command] next, not /swp-ui.
    Your locked sequence: [Phase 1 command]  [Phase 2 command]  [Phase 3 command]  dev
    Run [correct command] first, then return here.
    To override: type "override path  I know what I'm doing"

Before producing any output, verify:

  PRE-FLIGHT:
  SRS found                         :  /  STOP  run /swp-srs first
  STACK CONFIRMED found             :  /  STOP  run /swp-arch first
  ARCH-DESIGN.md found              :  /  STOP  run /swp-arch first (Phase 1 must be complete)
  BREAKDOWN.md 1A [x] confirmed    :  /  STOP  architecture not approved, run /swp-arch
  CONTEXT.md found                  :  /  STOP  run /swp-plan first
  UI-DESIGN.md exists               : YES (incremental update  read existing screens) / NO (fresh design)

  FROM STACK CONFIRMED  Generic UI checks (framework-agnostic):
  Frontend Framework   : [extracted from STACK CONFIRMED  identifies target framework + version]
  UI Component Library : [e.g. PrimeNG / Material UI / Bootstrap Vue / Flutter Material / SwiftUI components]
  CSS/Styling Framework: [e.g. Tailwind CSS / Bootstrap / UNO / None for framework-native]
  State Management     : [extracted from STACK CONFIRMED  guides STEP 5 selection]
  Layout approach      : [mobile-first / desktop-first  applies to all frameworks]
  Component structure  : [extracted from STACK CONFIRMED  affects STEP 3 hierarchy]

  FROM CONTEXT.md:
  Current phase    : [Phase N]
  Sprint           : [Sprint N]
  Stories in scope : [US-001, US-002, ...]

  If UI-DESIGN.md exists  screens already designed : [list]
  New screens to design this run                    : [list]
  Escalated from /swp-design                        : YES / NO - if YES, read prior Section A and list missing deep-enforcement artifacts

If any  STOP condition is hit, halt immediately and output the stop message. Do not proceed past Step 0.

---

## STEP 0.5  Framework detection and patterns

Based on the extracted Framework from STACK CONFIRMED, use the table below to select framework-specific patterns for STEPS 18.

### Framework comparison table

| Framework    | Component Model      | State Management     | Binding Pattern              | File Structure               | Key Tools                |
|--------------|----------------------|----------------------|------------------------------|------------------------------|------------------------|
| **React**    | Functional Components with Hooks | Context API / Redux / Zustand / Jotai | Props down, callbacks up (lifting state) | `/pages/`, `/components/`, `/hooks/`, `/context/` | React Router, SWR/TanStack Query |
| **Vue 3**    | Composition API (preferred) or Options API | Pinia / Vuex / ref()/reactive() | v-model binding, defineProps/defineEmits | `/pages/`, `/components/`, `/composables/` | Vue Router, Pinia |
| **Angular**  | Standalone components or NgModule | Signals / NgRx / Service+BehaviorSubject | Property binding [@Input] / Event binding [@Output] | `/features/*/pages/`, `/features/*/components/`, `/services/` | Angular Router, RxJS, NgRx |
| **Flutter**  | Stateless/Stateful Widgets | Provider / BLoC / GetX / Riverpod | Constructor parameters + callbacks | `/screens/`, `/widgets/`, `/models/` | Navigation 2.0, Provider/BLoC pattern |
| **SwiftUI**  | Views + Property Wrappers | @State / @ObservedObject / @EnvironmentObject | @State + @Binding, ObservableObject | `/Views/`, `/Models/`, `/ViewModels/` | NavigationStack, Combine |
| **Svelte**   | Single-file Components (.svelte) | Stores (svelte/store) / Context API | Reactive assignments, two-way binding (bind:) | `/routes/`, `/components/`, `/stores/` | SvelteKit, Svelte Transition |
| **Blazor**   | Components (.razor)  Server-side or WASM | Cascading Parameters / Fluxor / Service injection | @bind two-way binding, EventCallback, [Parameter] | `/Pages/`, `/Components/`, `/Services/` | .NET DI, Fluxor, MudBlazor / Radzen |
| **Razor Pages** | Page + PageModel (.cshtml + .cs) | ViewData / TempData / Session / Service injection | Tag Helpers, Model binding, Partial Views | `/Pages/`, `/Shared/`, `/ViewModels/` | ASP.NET Core, Bootstrap / Tailwind |

### Using this table in STEPS 18

1. **STEP 1 (Screen Inventory):** Component placement follows framework column (e.g. React uses `/pages/` + `/components/`, Angular uses `/features/*/pages/` + `/features/*/components/`)

2. **STEP 2 (Wireframes):** Conditional field binding shown with framework syntax (e.g. React: conditional render with `{condition && <Component />}`, Vue: `v-show/v-if`, Angular: `[hidden]` or `*ngIf`, etc.)

3. **STEP 3 (Component Contracts):** Frameworks differ in input/output patterns:
   - React: Props interfaces + callback functions passed as props
   - Vue 3: `defineProps<T>()` + `defineEmits<T>()`
   - Angular: `@Input() / @Output()` decorators or `input<T>() / output<T>()` signals
   - Flutter: Widget constructor parameters + callback functions
   - SwiftUI: Property wrappers (@State, @Binding, @ObservedObject)
   - Svelte: Exported variables + event dispatchers
   - Blazor: `[Parameter]` attribute + `EventCallback<T>` delegates
   - Razor Pages: `[BindProperty]` on PageModel + Tag Helper attributes

4. **STEPS 48:** Reference this table when declaring routing, state, and permission rules  framework-neutral concepts, but implementations differ.

---

### UPDATE MODE DETECTION

Runs only if no STOP condition was hit above.

Check whether `docs/UI-DESIGN.md` already exists:

  docs/UI-DESIGN.md exists : YES  UPDATE RUN | NO  FRESH RUN

**IF FRESH RUN:** skip this section entirely. Proceed to STEP 1 with all SRS stories in scope.

**IF UPDATE RUN:**

Read `docs/UI-DESIGN.md`. Note: every screen that already exists and its last-updated marker
(look for `[UPDATED  Sprint N]` or `[NEW  Sprint N]` annotations, or the document date).

Compare against current `docs/SRS.md`:

  Delta check  for each story in SRS:
    - Find which screen(s) in UI-DESIGN.md cover this story
    - If NO screen covers it  story is NEW, screen must be designed this run
    - If a screen covers it but the story's ACs changed since the screen was designed  screen is STALE, must be updated
    - If the story's ACs match the screen design  screen is UNCHANGED, skip it

  Stale check  for each screen in UI-DESIGN.md:
    - If the story it covers no longer exists in SRS  screen is REMOVED, flag for tech lead

Output:

  UPDATE RUN DETECTED  docs/UI-DESIGN.md found
  
  Screens preserved (unchanged)    : [N]  [list names]
  Screens to ADD this run          : [N]  [list: story IDs driving each new screen]
  Screens to UPDATE this run       : [N]  [list: screen name + what AC/field changed]
  Screens to REMOVE (story gone)   : [N]  [list: screen name + confirm with tech lead]
  

Scope for Steps 16: design only the ADD + UPDATE screens. Skip preserved screens.

In STEP 7.1 (write docs/UI-DESIGN.md):
  - PATCH the existing file  do NOT regenerate it from scratch
  - Mark updated sections: `[UPDATED  Sprint N  YYYY-MM-DD]`
  - Mark new sections: `[NEW  Sprint N  YYYY-MM-DD]`
  - Mark removed screens: `[REMOVED  YYYY-MM-DD  reason]` (do not delete  keep for audit trail)
  - Preserve all other sections exactly as they are

---

##  STAGE 1  Reference Input & Asset Extraction 

### STEP 1.0A  Reference input detection

Before beginning screen design, check whether the user has provided any reference material as $ARGUMENTS or attached context:

```
REFERENCE INPUT MODE (auto-detect):
  Image / screenshot provided  : YES  IMAGE MODE
  Figma export (JSON / URL)    : YES  FIGMA MODE
  Existing code path provided  : YES  CODE MODE
  No reference input           :  GREENFIELD MODE
```

**If GREENFIELD MODE:** No external design reference detected. Run STEP 1.0G  Template Baseline Selection  then proceed to STEP 1 (Screen Inventory).

**If IMAGE, FIGMA, or CODE MODE:** Continue to STEP 1.0B / 1.0D below.

---

### STEP 1.0G  Template Baseline Selection (GREENFIELD only)

Two templates are available in `.claude/templates/mock-design/`. Use one as the visual baseline instead of generating wireframes from scratch.

| Template | Path | Use for |
|----------|------|---------|
| **admin** | `.claude/templates/mock-design/admin/` | Authenticated screens  dashboard, management, CRUD, analytics, settings, billing, users |
| **public** | `.claude/templates/mock-design/public/` | Unauthenticated screens  landing page, blog, about, contact, marketing |

**Selection rule** (derived from STEP 1 Screen Inventory Role column):
- Role  `Anonymous` / `Public`  **admin template**
- Role = `Anonymous` / `Public`  **public template**
- Mixed project  assign per screen (both templates may apply)

Output before STEP 1:
```
TEMPLATE BASELINE:
  Authenticated screens : admin template  .claude/templates/mock-design/admin/
  Public screens        : public template  .claude/templates/mock-design/public/
  No template match     : [screen]  generate from scratch
```

**Domain KPI card mapping (admin template  dashboard screens):**

The admin template's dashboard uses generic SaaS KPI cards (`Monthly Revenue`, `Active Users`, `New Signups`, `Churn Rate`). Replace these with domain-specific metrics derived from the SRS primary entities.

Read `docs/SRS.md`  identify the 35 most important countable or measurable entities in the domain:

| Domain | KPI 1 | KPI 2 | KPI 3 | KPI 4 |
|--------|-------|-------|-------|-------|
| Healthcare | Appointments Today | Active Patients | Pending Prescriptions | Missed Rate |
| Logistics | Shipments Today | Pending Deliveries | Active Drivers | On-time Rate |
| E-commerce | Orders Today | Revenue Today | Active Products | Cart Abandonment |
| HR / workforce | Active Employees | Open Positions | Timesheets Due | Turnover Rate |
| Field service | Work Orders Today | Dispatched Technicians | Pending Inspections | SLA Compliance |

Output the domain mapping before STEP 2 wireframes:
```
DOMAIN KPI MAPPING (from SRS):
  KPI 1 : [SRS entity]  "[count/metric label]"
  KPI 2 : [SRS entity]  "[status metric]"
  KPI 3 : [SRS entity]  "[rate/percentage]"
  KPI 4 : [SRS entity]  "[trend metric]"
```

These domain labels replace template placeholders in all dashboard/overview wireframes.

**Public template content mapping:**

The public template uses generic labels (`Service 1`, `Post 1`, `About us` copy). Replace with domain-specific labels:
- Section titles  SRS product name and feature names
- Service cards  top 3 features from SRS feature list
- Blog labels  documentation or news relevant to the product domain
- CTA text  SRS primary user action (register / book / request demo / get started)

---

### STEP 1.0B  Visual asset extraction (IMAGE MODE / FIGMA MODE)

Read and analyse the provided image(s) or Figma export. Extract the following:

```
COLOR PALETTE:
  Primary      : [hex]  from primary buttons / CTAs / headings
  Surface      : [hex]  from card / page background
  Text-main    : [hex]  from body text
  Text-muted   : [hex]  from secondary labels / captions
  Border       : [hex]  from input borders / dividers
  Success      : [hex]  from success states / badges
  Error        : [hex]  from error / validation indicators
  Background   : [hex]  from page background (if different from Surface)

SPACING SYSTEM (infer from visual rhythm):
  xs : [Npx]  icon padding / tight gaps
  sm : [Npx]  field gaps / compact list spacing
  md : [Npx]  card padding / section inner spacing
  lg : [Npx]  section gaps / page gutters

TYPOGRAPHY:
  Font family detected : [name or "unknown  mapping to Satoshi"]
  Scale steps          : [detected sizes  mapped to Major Third 1.25]
  H1 / H2 / H3        : [Npx each]
  Body / Body-sm       : [Npx each]

COMPONENTS DETECTED:
  - [Component name]  [purpose]  seen on: [screen list]
  e.g.:
  - NavBar         top navigation with logo + links  all screens
  - DataTable      sortable columns + pagination footer  List screens
  - StatusBadge    pill with colour-by-status  List + Detail screens
  - FormPanel      two-column inputs with inline validation  Edit screens
  - ConfirmModal   centred overlay with cancel/confirm  Delete flows

LAYOUT PATTERNS:
  Grid type     : [N-column / fluid / fixed-width sidebar + content]
  Nav type      : [Top nav / Side nav / Bottom tab bar]
  Card style    : [Elevated shadow / Bordered / Flat]
  Form layout   : [Single-column / Two-column / Inline label]
  Breakpoints   : [mobile cutoff / tablet cutoff  if detectable]
```

Map extracted values to SmartWorkz design tokens:

```
TOKEN MAPPING:
  --sw-color-primary         : [extracted hex]
  --sw-color-surface         : [extracted hex]
  --sw-color-text-primary    : [extracted hex]
  --sw-color-text-secondary  : [extracted hex]
  --sw-color-border          : [extracted hex]
  --sw-color-success         : [extracted hex]
  --sw-color-error           : [extracted hex]
  --sw-spacing-xs            : [Npx]
  --sw-spacing-sm            : [Npx]
  --sw-spacing-md            : [Npx]
  --sw-spacing-lg            : [Npx]

TOKEN CONFLICTS (flag any value that violates SmartWorkz standards):
  - [token]: extracted [value]  conflicts with [standard]  action: [override / flag]
```

---

### STEP 1.0C  SRS cross-check vs. reference screens

Compare screens and components extracted in STEP 1.0B or 1.0D against `docs/SRS.md`:

```
SRS CROSS-CHECK:
AC Ref    | AC Description              | In Reference | Status | Action
----------|-----------------------------|--------------|--------|--------------------------------
[US-X.X]  | [acceptance criterion text] | YES / NO     | /// | [reuse / extend / design / discard]

Status key:
   COVERED    reference satisfies this AC  carry pattern forward to STEP 1
   PARTIAL    reference partially covers it  extend in STEP 1
   MISSING    AC not in reference  design from scratch in STEP 1
   CONFLICTS  reference contradicts SRS AC  discard, do not carry over
```

```
ASSETS TO CARRY OVER:
  Component / Pattern  | Decision               | Notes
  ---------------------|------------------------|----------------------------------
  [ComponentName]      | Reuse / Adapt / Restyle | [e.g. restyle to sw-tokens]
  [LayoutPattern]      | Reuse / Adapt / Drop    | [e.g. spacing too tight for WCAG]

ASSETS TO DISCARD:
  [Element]  reason: [e.g. Inter font / hardcoded hex / fails WCAG / contradicts SRS AC]
```

---

### STEP 1.0D  Code reverse-engineering (CODE MODE)

Read the provided code path(s). For each file or component found:

```
CODE SCAN RESULTS:

1. SCREENS DETECTED:
   Route      | Component / File   | Type
   -----------|--------------------|------------------
   /[path]    | [ComponentName]    | PAGE / MODAL / WIDGET

2. COMPONENT INVENTORY:
   Name            | Props / Inputs      | Purpose
   ----------------|---------------------|-----------------------------
   [ComponentName] | [prop1, prop2]      | [e.g. Reusable data table]

3. TOKEN EXTRACTION (hardcoded values found):
   Hardcoded value | Suggested sw-token          | Action
   ----------------|-----------------------------|-------------
   #4F46E5         | --sw-color-primary          | Map
   16px padding    | --sw-spacing-md             | Map
   Inter font      | Satoshi (SmartWorkz standard)| Replace

4. STATE PATTERNS DETECTED:
   [useState / NgRx / Pinia / BehaviorSubject / etc.]  used across [N] components

5. API CONTRACTS FOUND:
   Method / Endpoint    | Used in component  | In ARCH-DESIGN.md
   ---------------------|--------------------|-------------------
   GET /api/[resource]  | [ComponentName]    |  /  flag missing
```

After STEP 1.0D, feed results into STEP 1.0C (SRS cross-check).

---

### STEP 1.0E  Required asset inventory

Runs in ALL modes (GREENFIELD included). Read the SRS, the reference input (if any), and every screen identified so far. Produce a complete list of every image, illustration, icon set, and media file the app will need.

For each asset, classify it and note its source:

```
REQUIRED ASSET MANIFEST:


 BANNERS & HERO IMAGES                                                           

 Asset                                 Screen    Dimensions   Source         

 [e.g. Home hero banner]               /home     1440480px   Provide / Extract |
 [e.g. Feature section banner]         /about    1280400px   Provide / Extract |
 [e.g. Auth page background]           /login    19201080px  Provide / Extract |



 TEAM / PEOPLE IMAGES                                                            

 Asset                                 Screen    Dimensions   Source         

 [e.g. Team member avatar  N needed]  /team     200200px    Provide        
 [e.g. Author profile photo]           /blog     8080px      Provide        
 [e.g. Testimonial headshot  N]       /home     6060px      Provide        



 PRODUCT / FEATURE IMAGES                                                        

 Asset                                 Screen    Dimensions   Source         

 [e.g. Product thumbnail  N needed]   /catalog  400300px    Provide        
 [e.g. Feature illustration]           /features 600400px    Provide / SVG  
 [e.g. App screenshot / mockup]        /home     800500px    Generate       



 LOGO & BRAND                                                                    

 Asset                                 Used in   Format       Source         

 [e.g. App logo  light variant]       NavBar    SVG / PNG    Provide        
 [e.g. App logo  dark variant]        NavBar    SVG / PNG    Provide        
 [e.g. Favicon]                        <head>    3232 ICO    Derive from logo



 ICONS                                                                           

 Icon library                          [e.g. Heroicons / Lucide / FontAwesome]  
 Custom icons needed                   [list any icons not in the library]      
 Format                                SVG inline / Icon component / sprite     



 ILLUSTRATIONS & EMPTY STATES                                                    

 Asset                                 Screen    Dimensions   Source         

 [e.g. Empty list illustration]        /[list]   240180px    SVG / Provide  
 [e.g. 404 error illustration]         /404      320240px    SVG / Provide  
 [e.g. Success / onboarding graphic]   /welcome  400300px    SVG / Provide  


SOURCE KEY:
  Provide     must be supplied by the client / design team before build
  Extract     can be taken from the reference input provided in Stage 1
  SVG         can be created as inline SVG using sw-token colours
  Generate    can be generated from app screenshots / code during build
  Derive      computed from another asset (e.g. favicon from logo)
```

After listing, output a summary:

```
ASSET SUMMARY:
  Total assets required : [N]
  Can extract from reference : [N]  [list]
  Must be provided by team   : [N]  [list]
  Can be generated / SVG     : [N]  [list]
  Blockers (needed before build starts) : [list any PROVIDE assets on critical path screens]
```

---

##  STAGE 1 GATE 

After STEP 1.0B/C/D/E are complete, stop and output:

```
STAGE 1  REFERENCE ASSET EXTRACTION COMPLETE

Mode                 : [IMAGE / FIGMA / CODE / GREENFIELD]
Colours extracted    : [N]  [N] mapped to sw-tokens, [N] flagged
Spacing extracted    : [N] steps  mapped to xs/sm/md/lg
Components found     : [N]  [list names]
SRS ACs covered      : [N]   [N]  partial  [N]  missing  [N]  conflict

Assets to carry over : [N] components / patterns  will inform STEP 1 screen inventory
Assets to discard    : [N] (see conflict list above)

Required media assets: [N] total  [N] extractable, [N] must be provided, [N] SVG/generate
  Blockers            : [list any must-provide assets on critical-path screens, or "None"]

To proceed to Stage 2 (Screen Inventory), type:
  "assets confirmed"             accept extracted assets and continue
  "assets changes: [note]"       revise extraction before continuing
```

Wait for "assets confirmed" before proceeding to STEP 1.

---

## STEP 1  Screen inventory

For every Epic and Story **in scope for the current phase**, identify all required screens.

If docs/ARCH-DESIGN.md exists (/swp-arch was already run)  cross-reference before listing screens:
  - Confirm each screen maps to a defined module or service boundary in the architecture
  - Flag any screen that assumes an API endpoint or backend service not yet defined in /swp-arch
  - Note any architectural constraint that affects screen design (e.g. offline-first, SSR, micro-frontend boundary)

Classify each screen by type:
  - [PAGE]    full-page routed component
  - [MODAL]   dialog/overlay opened from a parent page  not independently routed
  - [WIZARD]  multi-step stepper spanning sub-steps within one route
  - [WIDGET]  dashboard panel or embedded sub-view  not independently routed
  - [CARD-GRID]  responsive grid of cards  not independently routed  embedded within a PAGE
  - [CARD-BOARD] Kanban-style draggable columns of cards  not independently routed  embedded within a PAGE

### Per-framework component placement

**Framework from STEP 0 (confirmed earlier):** [Framework name  e.g. React, Vue 3, Angular, Flutter, SwiftUI, Svelte]

Use the file paths and naming conventions from STEP 0.5 Framework table below:

> See `.claude/refs/swp-ui-reference.md` **Section G**  per-framework file placement (React v17+, Vue 3, Angular v17+, Flutter, SwiftUI, Svelte/SvelteKit).

  SCREEN INVENTORY:
  Epic: [Epic name]
    Story [ID]: [Story title]
      Screens needed:
        - [Screen name] [PAGE/MODAL/WIZARD/WIDGET]  [purpose]  Role: [who sees this]
        - [Screen name] [PAGE/MODAL/WIZARD/WIDGET]  [purpose]  Role: [who sees this]

  SHARED SCREENS (reused across multiple Epics):
    - [Screen name]  used by Stories: [IDs]

  EXCLUDED (deferred Epics/Stories  not in current phase):
    - [Epic/Story name]  deferred to Phase [N]  reason: [as stated in SRS]

After outputting the full inventory, stop and wait for tech lead to say "screens confirmed" before proceeding to Step 1.5.
If no response is received within the session: do not self-approve. Re-output the inventory summary at the start of the next session and wait again before designing any wireframes.

---

## STEP 1.5  HTML Prototype with Mock Data

After "screens confirmed" is received, generate a **self-contained HTML prototype** for every confirmed screen before producing text wireframes.

### Rules

- One single `docs/UI-PROTOTYPE.md` file containing all screens as embedded `<details>` sections  tech lead can open any screen in a browser by copy-pasting the HTML block.
- Each screen is a **complete, standalone HTML page** (no external dependencies  embed Tailwind via CDN or use inline CSS with SmartWorkz design tokens).
- Populate every field, table, chart, and list with **realistic mock data** (not "Lorem ipsum"  use domain-appropriate names, dates, amounts, statuses matching the SRS domain).
- Use SmartWorkz design tokens for colours, spacing, typography:
  - Colors: `--sw-color-primary`, `--sw-color-surface`, `--sw-color-text-*`
  - Spacing: `--sw-spacing-xs` (4px), `--sw-spacing-sm` (8px), `--sw-spacing-md` (16px), `--sw-spacing-lg` (24px)
  - CSS class prefix: `sw-` BEM (`sw-button--primary`, `sw-card__header`)
- Include dark mode toggle button on every screen using `class="dark"` on `<html>`.
- Every interactive element (buttons, forms, modals) must have a visible hover/active state  use inline `onmouseover` or a `<style>` block, no external JS files.
- Forms must show a success toast on submit (no real HTTP call  `setTimeout` mock response is fine).
- Tables and lists must show pagination controls (static  no JS logic required, just render them).
- Mobile-first: use a single-column layout at <768px and side-by-side at 768px using CSS Grid or Flexbox.
- WCAG AA: minimum 4.5:1 text contrast, 44px touch targets on all buttons and inputs.

### Output format per screen

````markdown
## Screen: [Screen Name] ([PAGE/MODAL/WIZARD/WIDGET])  Route: /[path]

Mock data used:
- [Field]: [example value]
- [Field]: [example value]

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[Screen Name]  SmartWorkz Prototype</title>
  <style>
    /* SmartWorkz design tokens */
    :root {
      --sw-color-primary: #4F46E5;
      --sw-color-surface: #FFFFFF;
      --sw-color-text-primary: #111827;
      --sw-color-text-secondary: #6B7280;
      --sw-color-border: #E5E7EB;
      --sw-color-success: #10B981;
      --sw-color-error: #EF4444;
      --sw-spacing-xs: 4px;
      --sw-spacing-sm: 8px;
      --sw-spacing-md: 16px;
      --sw-spacing-lg: 24px;
    }
    /* Card component tokens */
    :root {
      --sw-card-radius: 8px;
      --sw-card-padding: var(--sw-spacing-md);
      --sw-card-shadow-raised: 0 2px 8px rgba(0,0,0,0.12);
      --sw-card-shadow-hover: 0 8px 24px rgba(0,0,0,0.18);
    }
    /* Card base styles */
    .sw-card {
      background: var(--sw-color-surface);
      border-radius: var(--sw-card-radius);
      box-shadow: var(--sw-card-shadow-raised);
      padding: var(--sw-card-padding);
      position: relative;
      transition: box-shadow 200ms ease-out, transform 200ms ease-out;
      cursor: pointer;
      overflow: hidden;
    }
    .sw-card:hover {
      box-shadow: var(--sw-card-shadow-hover);
      transform: translateY(-2px);
    }
    .sw-card:focus { outline: none; }
    .sw-card:focus-visible {
      outline: 2px solid var(--sw-color-focus-ring);
      outline-offset: 2px;
    }
    .sw-card:active { transform: scale(0.97); opacity: 0.9; transition: 100ms ease-out; }
    .sw-card__overlay {
      position: absolute; inset: 0;
      background: rgba(255,255,255,0.85);
      opacity: 0;
      transition: opacity 200ms ease-out;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      border-radius: inherit;
    }
    .sw-card:hover .sw-card__overlay { opacity: 1; }
    .sw-card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--sw-spacing-lg);
    }
    @media (prefers-reduced-motion: reduce) {
      .sw-card, .sw-card__overlay { transition: none !important; }
      .sw-card:hover { transform: none; }
      .sw-card:active { transform: none; opacity: 1; }
    }
    .dark {
      --sw-color-surface: #1F2937;
      --sw-color-text-primary: #F9FAFB;
      --sw-color-text-secondary: #9CA3AF;
      --sw-color-border: #374151;
    }
    /* screen-specific styles */
  </style>
</head>
<body style="background: var(--sw-color-surface); color: var(--sw-color-text-primary); font-family: 'Satoshi', sans-serif; margin: 0; padding: var(--sw-spacing-lg);">
  <!-- prototype HTML here -->
</body>
</html>
```
````

### Card prototype template (CARD-GRID screens)

Use this HTML snippet as the base for any CARD-GRID screen prototype. Copy into the `<body>` section and adjust to match the SRS domain.

```html
<!-- CARD-GRID prototype: copy into <body> -->
<div style="padding: var(--sw-spacing-lg);">
  <h1 style="font-size: var(--sw-typography-h4); margin-bottom: var(--sw-spacing-lg);">
    [Feature Name]  Card Grid
  </h1>

  <div class="sw-card-grid">
    <!-- Card 1: default state -->
    <div class="sw-card" tabindex="0" role="article" aria-label="[Item Name]">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:var(--sw-spacing-sm);">
        <span style="font-size:var(--sw-typography-body-sm); background:var(--sw-color-success); color:#fff; padding:2px 8px; border-radius:12px;">Active</span>
        <button style="background:none; border:none; cursor:pointer; color:var(--sw-color-text-secondary); font-size:18px;" aria-label="More options"></button>
      </div>
      <h3 style="font-size:var(--sw-typography-h5); margin:0 0 var(--sw-spacing-xs);">[Item Title]</h3>
      <p style="font-size:var(--sw-typography-body-sm); color:var(--sw-color-text-secondary); margin:0 0 var(--sw-spacing-md);">[Supporting detail text  12 lines of metadata]</p>
      <div style="display:flex; gap:var(--sw-spacing-sm);">
        <button style="flex:1; padding:var(--sw-spacing-sm); border:1px solid var(--sw-color-border); background:none; border-radius:4px; cursor:pointer; min-height:44px;">Secondary</button>
        <button style="flex:1; padding:var(--sw-spacing-sm); border:none; background:var(--sw-color-interactive-primary); color:#fff; border-radius:4px; cursor:pointer; min-height:44px;">Primary</button>
      </div>
      <!-- Hover overlay: quick actions -->
      <div class="sw-card__overlay">
        <button style="padding:var(--sw-spacing-sm) var(--sw-spacing-md); background:var(--sw-color-interactive-primary); color:#fff; border:none; border-radius:4px; cursor:pointer; min-height:44px;"> Edit</button>
        <button style="padding:var(--sw-spacing-sm) var(--sw-spacing-md); background:var(--sw-color-error); color:#fff; border:none; border-radius:4px; cursor:pointer; min-height:44px;"> Delete</button>
      </div>
    </div>

    <!-- Card 2: loading skeleton state -->
    <div class="sw-card" aria-busy="true" aria-label="Loading">
      <div style="height:16px; background:var(--sw-color-border); border-radius:4px; margin-bottom:var(--sw-spacing-sm); animation:shimmer 1.5s ease-in-out infinite; opacity:0.6;"></div>
      <div style="height:20px; background:var(--sw-color-border); border-radius:4px; margin-bottom:var(--sw-spacing-xs); width:70%; animation:shimmer 1.5s ease-in-out infinite; opacity:0.6;"></div>
      <div style="height:14px; background:var(--sw-color-border); border-radius:4px; margin-bottom:var(--sw-spacing-md); animation:shimmer 1.5s ease-in-out infinite; opacity:0.6;"></div>
      <div style="height:36px; background:var(--sw-color-border); border-radius:4px; animation:shimmer 1.5s ease-in-out infinite; opacity:0.6;"></div>
    </div>

    <!-- Card 3N: repeat Card 1 pattern with different mock data -->
  </div>
</div>
<style>
  @keyframes shimmer { 0%,100%{opacity:0.6} 50%{opacity:1} }
</style>
```

**Dark mode card variant:** The `.sw-card__overlay` background must use `rgba(26,26,26,0.85)` in dark mode. Add `html.dark .sw-card__overlay { background: rgba(26,26,26,0.85); }` to the screen's `<style>` block.

### Mock data guidelines by screen type

| Screen type | Mock data to include |
|-------------|---------------------|
| LIST / TABLE | 58 rows of realistic records; show status badges, dates, names from the SRS domain |
| FORM / WIZARD | Pre-filled values in 30% of fields; show one validation error state and one success state |
| DASHBOARD | 34 KPI cards with numeric values; one chart (use ASCII bar or SVG inline) |
| DETAIL / VIEW | Full record expanded; related child records listed below |
| MODAL | Triggered from a visible "Open" button on the page; dismiss on overlay click |
| CARD-GRID | 69 cards with image/icon, title, status badge, metadata, and 2 action buttons; first card shows hover overlay revealed; one card shows loading-skeleton state |
| CARD-BOARD | 3 columns (e.g. Todo / In Progress / Done) with 34 cards per column; drag handle visible on each card; one card mid-drag (elevated shadow state) |

### Gate

### STEP 1.5.1  Colour contrast compliance scan

After generating all prototypes, scan each screen's colour pairings against WCAG 2.1 AA:

**Contrast pairs to check per screen:**

| Pair | Foreground token | Background token | Required ratio | Check |
|------|-----------------|-----------------|----------------|-------|
| Body text on surface | `--sw-color-text-primary` (#111827) | `--sw-color-surface` (#FFFFFF) | 4.5:1 |  16.1:1 |
| Secondary text on surface | `--sw-color-text-secondary` (#6B7280) | `--sw-color-surface` (#FFFFFF) | 4.5:1 |  5.9:1 |
| Primary button label | #FFFFFF | `--sw-color-interactive-primary` (#4F46E5) | 4.5:1 |  5.1:1 |
| Error text on surface | `--sw-color-error` (#EF4444) | `--sw-color-surface` (#FFFFFF) | 4.5:1 |  3.9:1  use darker shade #DC2626 |
| Body text on overlay | `--sw-color-text-primary` (#111827) | `--sw-color-surface-overlay` (#F3F4F6) | 4.5:1 |  14.9:1 |

**Dark mode contrast pairs:**

| Pair | Foreground token | Background token | Required ratio | Check |
|------|-----------------|-----------------|----------------|-------|
| Body text on dark surface | `--sw-color-text-primary` (#F9FAFB) | `--sw-color-surface` (#111827) | 4.5:1 |  16.1:1 |
| Secondary text on dark surface | `--sw-color-text-secondary` (#9CA3AF) | `--sw-color-surface` (#111827) | 4.5:1 |  7.3:1 |
| Primary button label dark | #FFFFFF | `--sw-color-interactive-primary` (#6366F1) | 4.5:1 |  4.7:1 |

**Per-screen scan output:**

```
CONTRAST SCAN  [Screen Name]:
   Custom colors used [YES  list hex pairs / NO  using sw-tokens only]
   All sw-token pairs: [pass  all above 4.5:1 / FAIL  list failing pairs]
   Dark mode pairs: [pass / FAIL  list failing pairs]
   Interactive elements (links, buttons): [pass  all  3:1 for UI components / FAIL]
   Focus ring visible: [pass  3px solid var(--sw-color-focus-ring) / FAIL]

  Contrast issues found: [N]  [list: element + foreground hex + background hex + actual ratio + fix]
```

If any screen uses only SmartWorkz design tokens without custom hex overrides  mark "sw-tokens only  pass" and skip individual pair analysis for that screen.

Flag any screen that introduces custom hex colors outside the token system  these require manual ratio verification.

After all screen prototypes are output, stop and display:

```
STEP 1.5 COMPLETE  HTML Prototypes

Screens prototyped : [N]
File              : docs/UI-PROTOTYPE.md

Copy any HTML block into a browser to preview the screen.

To continue to text wireframes (STEP 2), type:
  "prototypes reviewed"  proceed to STEP 2
  "prototype changes: [screen name]  [what to fix]"  revise before continuing
```

Wait for "prototypes reviewed" before proceeding to STEP 2.

---

## STEP 2  Per-screen wireframe (text-based)

**Based on framework from STEP 0.5:** [Framework selected  React / Vue 3 / Angular / Flutter / SwiftUI / Svelte]

For each confirmed screen, output a complete structured wireframe using the template below.

### STEP 2  Per-framework state binding reference

> See `.claude/refs/swp-ui-reference.md` **Section A**  React, Vue 3, Angular, Flutter, SwiftUI, Svelte, Blazor, Razor Pages binding patterns.


  
  SCREEN: [Screen Name]
  Type  : [PAGE / MODAL / WIZARD / WIDGET]
  Route : /[path]  (MODAL: "opened from [parent route]"  no own route)
  Role  : [Admin / User / Public / All authenticated]
  Parent: [parent route or "root"]
  

   Desktop Layout (ASCII wireframe) 
  
   [Header / Nav bar]                              
   [Breadcrumb: Home > Feature > Screen]           
  
   [Left sidebar if any]    [Main content area]   
                            [Form / Table / Card] 
                            [Action buttons]      
  

   Tablet Layout (768px breakpoint) 
  
   [Top Nav / Condensed Header]          
  
   [Sidebar collapsed OR narrow sidebar] 
   [Main content  2-col grid or single] 
   [Action buttons  inline or stacked]  
  
  Tablet behavior: [sidebar visible but collapsed / 2-col becomes 1-col / modal stays centered]
  Note: Required for all PAGE and WIZARD screens. MODAL/WIDGET may reuse desktop layout at 768px.

   Mobile Layout (375px breakpoint) 
  
   [Hamburger / Top Nav] 
  
   [Stacked content]     
   [Full-width controls] 
   [Sticky CTA bar]      
  
  Mobile behavior: [sidebar collapses to drawer / bottom sheet / full-screen modal / tabs]

   Mobile Gestures (Flutter / SwiftUI / mobile web screens only) 
  Declare any gesture interactions required for this screen. Skip for desktop-only screens.

    Swipe actions     : [swipe-left on list row  delete / archive / none]
                        Flutter: Dismissible widget with confirmDismiss callback
                        SwiftUI: .swipeActions(edge: .trailing) modifier
                        React/Vue/Angular (touch): Use touch event handlers or Hammer.js

    Pull-to-refresh   : [YES / NO]  refreshes [which data]  shown on [list/feed screens]
                        Flutter: RefreshIndicator widget wrapping the scrollable
                        SwiftUI: .refreshable modifier on List/ScrollView
                        Web: IntersectionObserver at top of list + loading spinner

    Long press        : [YES / NO]  opens [context menu / multi-select mode / preview]
                        Flutter: GestureDetector(onLongPress: )
                        SwiftUI: .contextMenu modifier

    Pinch-to-zoom     : [YES / NO]  applies to [image viewer / map / chart only]
                        Only use for media-heavy screens. Never on forms or lists.

    Bottom sheet      : [YES / NO]  triggered by [which action]  height: [half / full / drag-handle]
                        Flutter: showModalBottomSheet / DraggableScrollableSheet
                        SwiftUI: .sheet / .presentationDetents([.medium, .large])

   Breadcrumb 
  [Home] > [Feature] > [Current Screen]

   Fields / Controls 

#### Design tokens in wireframes

All interactive controls and form fields MUST reference SmartWorkz design tokens instead of hardcoded values. This ensures consistency with the design system and makes future theme updates seamless.

**CSS naming convention (MANDATORY):**
All component class names MUST use the `sw-` prefix with BEM (Block Element Modifier) syntax. This ensures integration with the SmartWorkz design system.
- Block: `.sw-button` (standalone component)
- Element: `.sw-button__icon` (child of block)
- Modifier: `.sw-button--primary` (variant of block)
- Combined: `.sw-button--primary__icon` (variant + element)

Example: `.sw-input-field`, `.sw-input-field--error`, `.sw-input-field__label`, `.sw-input-field__helper-text`

> See `.claude/refs/swp-ui-reference.md` **Section K**  design tokens: color (--sw-color-*), spacing (--sw-spacing-*), z-index (--sw-z-*), typography (--sw-typography-*), card tokens (--sw-card-*) with dark mode pairs.

**Example field specification with tokens:**
```
- Name field    : text input
               required  text search
               tokens: --sw-color-input-background (background), --sw-color-border-primary (border), --sw-spacing-md (padding), --sw-typography-body-md (text), --sw-color-interactive-primary (focus border), --sw-color-focus-ring (focus shadow)
```

**Every field specification below MUST include:**
- Which color tokens apply (background, border, text)
- Spacing token for padding/margins
- Typography token for labels and input text
- Focus state using --sw-color-focus-ring

    - [Field name]    : [text / number / select / autocomplete / date / toggle / file / textarea]
                         [required / optional]  [validation rule]
                         tokens: [--sw-color-* | --sw-spacing-* | --sw-typography-*]
    - [Field name]    : [select]  [required]  source: [API endpoint or enum name]
                         tokens: [--sw-color-* | --sw-spacing-* | --sw-typography-*]
    - [Field name]    : [file]    [optional]  accepted: [types], max: [size]
                         tokens: [--sw-color-* | --sw-spacing-* | --sw-typography-*]

  Form validation pattern : [inline-as-you-type / on-blur / on-submit-only]
  Form structure varies by framework (see per-framework binding patterns below).

#### Conditional fields
List every field that shows/hides or enables/disables based on another field's value:

| Trigger field    | Condition          | Target field(s)  | Behavior         |
|------------------|--------------------|------------------|------------------|
| 2.9     | 2026-05-21 | KapilDev   | Added Skill Maturity 2.0 Contract for repo-wide command readiness consistency |

| 2.8     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| [field name]     | value = [X]        | [field name]     | show / hide      |
| [field name]     | value  null       | [field name]     | enable / disable |

**Per-framework conditional field patterns:**
> See `.claude/refs/swp-ui-reference.md` **Section H**  conditional show/hide patterns (React, Vue 3, Angular, Flutter, SwiftUI, Svelte).
   Actions 
    - [Button/Link]            [what happens]
                                Success : [route navigated to or state change]  animation: 200ms ease-out (on transform/opacity only)
                                Error   : [inline error message / toast / error modal]  animation: 200ms ease-out (fade-in)
    - [Destructive action]     confirmation dialog: "Are you sure This cannot be undone."
                                Confirm  [action proceeds]  animation: 200ms ease-out on button + disabled state
                                Cancel   [dialog closes, no change]  animation: 200ms ease-out on modal close

   Role-based UI rules 
    - [Field / Button X] : visible to [Admin]  hidden from [User, Public]
    - [Field / Button Y] : visible but disabled (greyed) for [User]  enabled for [Admin]
    - [Section Z]        : visible only when [condition  e.g. record is in Draft state]

   Animation Specification 
  RULE: 200ms ease-out on transform/opacity only. Never animate layout properties (width, height, margin, padding).
  CSS reduced-motion guard required on all animated components (@media (prefers-reduced-motion: reduce)).
  > See `.claude/refs/swp-ui-reference.md` **Section I**  per-component animation examples (aj) with per-framework code and reduced-motion patterns.

   Interactive States 

  Define the visual treatment for every interactive state. Use this table in wireframes when specifying
  component behaviour beyond the default appearance. All transitions follow the 200ms ease-out rule unless
  noted. Every state MUST also be included in the dark mode variant of the screen.

  | State | Trigger | CSS Properties | Token / Value | Timing |
  |-------|---------|----------------|---------------|--------|
  | `:hover` (card) | Mouse enters `.sw-card` | `box-shadow`, `transform: translateY(-2px)` | `--sw-card-shadow-hover` | 200ms ease-out |
  | `:hover` (card overlay) | Same as above | `opacity: 0  1` on `.sw-card__overlay` | `--sw-color-surface` at 80% opacity backdrop | 200ms ease-out |
  | `:hover` (button) | Mouse enters button | `background-color`, `opacity` | Use `--sw-color-interactive-primary` + 10% darker on hover | 200ms ease-out |
  | `:hover` (list row) | Mouse enters `tr` or list item | `background-color` | `--sw-color-surface` at 4% opacity overlay | 150ms ease-out |
  | `:focus-visible` | Keyboard Tab focus | `outline` ring | `--sw-color-focus-ring`, 2px solid, 2px offset | No transition (instant) |
  | `:active` / press (card) | Mouse down on card | `transform: scale(0.97)`, `opacity: 0.9` |  | 100ms ease-out |
  | `:active` / press (button) | Mouse down on button | `transform: scale(0.96)`, `opacity: 0.85` |  | 100ms ease-out |
  | `[dragging]` (card) | Drag initiated | `box-shadow`, `transform: rotate(2deg) scale(1.02)` | `--sw-card-shadow-hover` | 150ms ease-out |
  | `[expanded]` (accordion card) | Toggle triggered | `opacity: 0  1` on body content |  | 200ms ease-out |
  | `[selected]` (card, list row) | Checkbox or click-select | `border: 2px solid --sw-color-interactive-primary`, `background` at 5% tint | `--sw-color-interactive-primary` | 150ms ease-out |

  **Focus-visible pattern (REQUIRED  keyboard vs. mouse distinction):**

  Apply `:focus-visible` instead of `:focus` so that focus rings appear only for keyboard navigation,
  not for mouse clicks. This prevents the focus ring from flashing on mouse users while keeping it
  visible for keyboard and assistive-technology users.

  ```css
  /* Suppress focus ring for mouse users */
  .sw-card:focus          { outline: none; }
  .sw-button:focus        { outline: none; }

  /* Show focus ring for keyboard / AT users only */
  .sw-card:focus-visible  { outline: 2px solid var(--sw-color-focus-ring); outline-offset: 2px; }
  .sw-button:focus-visible { outline: 2px solid var(--sw-color-focus-ring); outline-offset: 2px; }
  ```

  Per-framework focus-visible patterns:
  - React/Vue 3/Svelte/Angular: CSS :focus-visible selector above (supported in all modern browsers)
  - Flutter: FocusNode + FocusManager  use focusedDecoration only when triggered by keyboard
    (check FocusManager.instance.highlightMode == FocusHighlightMode.traditional)
  - SwiftUI: .focusEffectDisabled() for mouse; .focused binding shows custom overlay for keyboard

  **Click / tap ripple feedback (optional  applies to cards and primary buttons):**

  A subtle press-scale combined with a brief opacity dip provides tactile feedback on click/tap.
  This replaces Material-style ink ripple, which is not part of the SmartWorkz design language.

  ```css
  .sw-card:active  { transform: scale(0.97); opacity: 0.9; transition: 100ms ease-out; }
  .sw-button:active { transform: scale(0.96); opacity: 0.85; transition: 100ms ease-out; }
  ```

  Suppress under prefers-reduced-motion:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .sw-card:active, .sw-button:active { transform: none; opacity: 1; }
  }
  ```

  **Drag state (sortable cards / CARD-BOARD columns):**

  When a card is being dragged, it should visually lift above the grid and rotate slightly to signal
  that it is "held". Apply via JS class toggle on drag start/end:

  ```css
  .sw-card[dragging] {
    box-shadow: var(--sw-card-shadow-hover);
    transform: rotate(2deg) scale(1.02);
    transition: 150ms ease-out;
    z-index: var(--sw-z-raised);    /* lift above sibling cards */
    cursor: grabbing;
  }
  ```

  Per-framework drag-state class toggling:
  - React: @dnd-kit sets dragging class automatically via useDraggable  apply custom className in DragOverlay
  - Vue 3: vue-draggable-plus emits drag:start/drag:end  toggle class in handler
  - Angular: CDK DragDrop  use cdkDrag with cdkDragPlaceholder for source, style in DragPreview
  - Flutter: LongPressDraggable with childWhenDragging (show placeholder) and feedback (show lifted card)
  - SwiftUI: .draggable modifier  use @State isDragging to apply .rotationEffect and .shadow
  - Svelte: svelte-dnd-action  items get `isDndShadowItem` property during drag

  **Wireframe requirement:**
  For every card screen (CARD-GRID, CARD-BOARD), declare in the wireframe:
    - Hover state: [card hover-lift  / none]
    - Focus-visible: [keyboard focus ring   all cards must have this]
    - Press/active: [scale feedback  / none]
    - Drag: [applicable for CARD-BOARD only   / N/A]
    - Selected state: [multi-select cards  / N/A]

   States 
    Loading state    : [skeleton loader on [which fields] / spinner over [which area] / none]
    Empty state      : [illustration + message + CTA  e.g. "No records yet. + Add First Item"]

    Error state (HTTP code  UI pattern mapping):
      400 Bad Request / 422 Unprocessable Entity (validation):
        Pattern: Inline field errors + form banner
        Example: "Name field is required" below field + "Form has 3 errors" banner at top
        UI: Sticky error banner above form, inline error text under invalid fields

      401 Unauthorized (session expired):
        Pattern: Redirect to /login with toast notification
        Toast: "Session expired. Please log in again."
        Behavior: Automatic redirect after 2 seconds or immediate if user clicks redirect button

      403 Forbidden (no permission):
        Pattern: Redirect to /403 with error page
        Note: No retry button (permission cannot be granted by retrying)

      404 Not Found (resource deleted):
        Pattern: Redirect to /404 with error page + suggest alternative action
        Example: "User not found. [Go to User List]" button

      5xx Server Error (internal error):
        Pattern: Toast notification + Retry button + support contact link
        Toast: "Unable to [action]. Please try again."
        Retry button: Re-submits the request
        Support link: "Contact support@example.com" hyperlink

      Network timeout (no response within 5s):
        Pattern: Inline spinner  timeout message with retry
        Message: "Request timed out. [Retry]"
        Auto-retry: Consider automatic retry after 3s with up to 2 retries max

    Success state    : toast  "[Action] completed successfully." auto-dismiss 3s
    No-permission    : [redirect to /403 / hide section entirely / show locked placeholder]

   Notifications / Toasts 
    Success  : "[Specific success message]"     auto-dismiss 3s
    Warning  : "[Specific warning message]"     manual dismiss
    Error    : "[Specific error message]"       manual dismiss + Retry button
    Info     : "[Specific info message]"        auto-dismiss 5s

   Per-Framework Error Handling Implementation 
  > See `.claude/refs/swp-ui-reference.md` **Section J**  per-framework error handling code (React, Vue 3, Angular, Flutter, SwiftUI, Svelte) + HTTP interceptor patterns.
   Pagination / Scroll (list and table screens only) 
    Strategy         : [paginated with page/size controls / infinite scroll / none]
    Default page size: [10 / 20 / 50]
    Page size options: [10, 20, 50, 100]
    Sort columns     : [Column A  asc default] [Column B  desc]
    Filter controls  : [Field name  filter type: text search / dropdown / date range]

   Accessibility 
    ARIA roles       : [role="main" / role="dialog" / role="alert" / aria-label="..."]
    Keyboard nav     : [Tab order defined / Esc closes modal / Enter submits form]
    Focus management : [auto-focus first field on open / return focus to trigger on close]
    Focus trap       : MODAL screens MUST trap focus  Tab/Shift+Tab cycles only within modal; background content unreachable by keyboard while modal is open. Use aria-modal="true" on the dialog container. On close, return focus to the element that triggered the modal.
    Screen reader    : [aria-live="polite" on [region] for dynamic updates / error announcements via aria-describedby]
    Touch targets    : All interactive elements (buttons, links, checkboxes, toggles) MUST have a minimum touch target of 4444px on mobile (WCAG 2.5.5). Use padding to expand small visual elements to meet this requirement without changing their appearance.
    Color contrast   : [meets WCAG 2.1 AA  4.5:1 for normal text / 3:1 for large text]

   Dark Mode Design Pattern (REQUIRED) 
  **MANDATORY for all screens.** Dark mode is not optionalevery UI screen MUST include both light and dark variant wireframes using SmartWorkz semantic color tokens. Reference 'Design tokens in wireframes' (lines 508-531) for the complete semantic token list (--sw-color-*, --sw-spacing-*, --sw-typography-*) to use in dark mode variants.

  Light-first design strategy: Design the light mode variant first with semantic tokens, then create the dark mode variant using the same layout structure with corresponding dark tokens.

  **Semantic Token Mapping (Light  Dark pairs):**

  | Use Case               | Light Token                  | Dark Token Equivalent            | Example Values                  |
  |------------------------|------------------------------|----------------------------------|---------------------------------|
  | Surface / Background   | `--sw-color-surface`         | `--sw-color-surface-dark`        | `#ffffff`  `#1a1a1a`          |
  | Input Background       | `--sw-color-input-background`| `--sw-color-input-background-dark`| `#f5f5f5`  `#2a2a2a`          |
  | Border (primary)       | `--sw-color-border-primary`  | `--sw-color-border-primary-dark` | `#e0e0e0`  `#404040`          |
  | Text (primary)         | `--sw-color-text-primary`    | `--sw-color-text-primary-dark`   | `#000000`  `#ffffff`          |
  | Text (secondary)       | `--sw-color-text-secondary`  | `--sw-color-text-secondary-dark` | `#666666`  `#cccccc`          |
  | Interactive (primary)  | `--sw-color-interactive-primary` | `--sw-color-interactive-primary-dark` | `#0066cc`  `#3399ff` |
  | Focus ring             | `--sw-color-focus-ring`      | `--sw-color-focus-ring-dark`     | `rgba(0,102,204,0.3)`  `rgba(51,153,255,0.3)` |

  **Dark Mode Wireframe Example:**

  Light mode (existing):
  ```
  
   [White bg]  [Dark text]  [Blue button]  
   [Light form]  [Dark borders]            
  
  ```

  Dark mode (new):
  ```
  
   [Dark bg]  [Light text]  [Light blue btn]
   [Dark form]  [Light borders]            
  
  ```

  Note: Same layout structure in both modes. Colors inverted using dark mode tokensno layout changes.

  **Per-Framework Dark Mode Implementation:**

  **React:**
    - Mechanism: Context API (ThemeProvider) or styled-components ThemeProvider
    - Example: `<ThemeProvider theme={isDark  darkTheme : lightTheme}><App /></ThemeProvider>`
    - Wireframe requirement: Document both light and dark token sets in field specs
    - Example field spec: ` colors: --sw-color-surface (light) / --sw-color-surface-dark (dark), --sw-color-text-primary / --sw-color-text-primary-dark`

  **Vue 3:**
    - Mechanism: CSS custom properties via reactive data attribute or provide/inject
    - Example: `<html :data-theme="isDark  'dark' : 'light">`
    - Wireframe requirement: Add dark variant tokens list in field specs
    - Example: ` dark-mode-tokens: --sw-color-surface-dark, --sw-color-text-primary-dark, ...`

  **Angular:**
    - Mechanism: CSS custom properties bound via signal or ngClass with condition
    - Example: `<div [class]="(isDark$ | async)  'dark-theme' : 'light-theme'">`
    - Wireframe requirement: Specify both light and dark tokens for each styled element
    - Example: ` token-pair: --sw-color-surface / --sw-color-surface-dark`

  **Flutter:**
    - Mechanism: ThemeData light vs. dark variant via ThemeData.light() / ThemeData.dark()
    - Example: `brightness == Brightness.dark  ThemeData.dark(useMaterial3: true) : ThemeData.light(useMaterial3: true)`
    - Wireframe requirement: Note color scheme values for both themes
    - Example: ` theme-colors: light={primary: 0xFF0066CC, surface: 0xFFFFFFFF} dark={primary: 0xFF3399FF, surface: 0xFF1a1a1a}`

  **SwiftUI:**
    - Mechanism: @Environment(\.colorScheme) environment variable
    - Example: `@Environment(\.colorScheme) var colorScheme`  use in conditional Color assignments
    - Wireframe requirement: Reference semantic tokens for both schemes
    - Example: ` color: colorScheme == .dark  Color(red: 1, green: 1, blue: 1) : Color(red: 0, green: 0, blue: 0)`

  **Svelte:**
    - Mechanism: Tailwind dark: class or CSS custom properties with reactive store
    - Example: `<html class={isDark  'dark' : ''}><Component /></html>` with Tailwind dark: utilities
    - Wireframe requirement: Add dark variant tokens in field specs
    - Example: ` class: bg-white dark:bg-gray-900 / text-black dark:text-white`

  **Wireframe Requirement for Every Screen:**

  For every screen in STEP 2, you MUST document both light and dark variants. Use this format:

  ```
  Screen: [Screen Name]  [PAGE / MODAL / WIZARD / WIDGET]

  Light mode wireframe:
  [ASCII wireframe with light color labels  backgrounds, text colors, borders]

  Dark mode wireframe:
  [ASCII wireframe with dark color labels  same layout, inverted colors]

  Token mapping:
    - Background: --sw-color-surface (light) / --sw-color-surface-dark (dark)
    - Primary text: --sw-color-text-primary / --sw-color-text-primary-dark
    - Button: --sw-color-interactive-primary / --sw-color-interactive-primary-dark
    - Borders: --sw-color-border-primary / --sw-color-border-primary-dark
  ```

  **Dark Mode Acceptance Criteria (checklist for every screen):**
    - [ ] Light mode wireframe complete with light mode token labels
    - [ ] Dark mode wireframe complete with dark mode token labels
    - [ ] Same layout structure in both light and dark (no layout changes)
    - [ ] Contrast ratio maintained in dark mode (WCAG 2.1 AA  4.5:1 normal text / 3:1 large text)
    - [ ] Framework-specific dark mode implementation documented (mechanism + example code)
    - [ ] All interactive elements (buttons, links, inputs) have color variants defined
    - [ ] prefers-reduced-motion guard applied  all animations suppressed when user has reduced motion enabled

   Wizard steps (WIZARD screens only) 
    Step 1: [Name]  fields: [list]  validation required before Next: [rules]
    Step 2: [Name]  fields: [list]  validation required before Next: [rules]
    Step N: [Review & Confirm]  shows summary  Submit action
    Back navigation  : [allowed on all steps / blocked after step N]
    Progress display : [step numbers (1 of N) / progress bar / breadcrumb-style stepper]
    Draft save       : [auto-save per step / save on Back only / no save until Submit]

   File upload (if applicable) 
    Accepted types   : [.pdf, .xlsx, .jpg  or "any"]
    Max size per file: [X MB]
    Max files        : [N]
    Upload UX        : [drag-drop zone + click to browse / button only]
    Progress         : [progress bar per file / aggregate spinner]
    Error display    : [inline below dropzone  file too large / unsupported type]

   Chart / Data Visualization (if applicable) 
    Chart type       : [bar / line / pie / doughnut / table heatmap]
    Library          : [from STACK CONFIRMED chart library]
    Data source      : [API endpoint  [GET /path]]  refresh: [on load / interval Xs / on demand]
    Empty state      : [message shown when no data points exist]

   Localization / i18n (if applicable) 
    Labels / strings     : [hardcoded English / translation keys via i18n library]
    i18n library         : [from STACK CONFIRMED  e.g. ngx-translate / Angular built-in i18n / none]
    Date / number format : [locale-aware via DatePipe + DecimalPipe / fixed format]
    RTL support          : [YES / NO]  if YES, apply the following:
      - Use logical CSS properties (margin-inline-start, padding-inline-end) instead of margin-left/right
      - Add dir="rtl" to the root element for RTL locales  framework-specific:
          Angular: <html [dir]="currentDir"> bound to i18n locale service
          React: <html dir={isRTL  'rtl' : 'ltr'}>
          Vue 3: <html :dir="isRTL  'rtl' : 'ltr'">
          Flutter: Directionality widget wrapping the app tree
          SwiftUI: .environment(\.layoutDirection, .rightToLeft)
      - Flip icons that convey direction (arrows, chevrons) using CSS transform: scaleX(-1) in RTL
      - Text alignment: use text-align: start (not left) so it respects dir automatically
      - Test wireframes mirrored for RTL locales (Hebrew, Arabic)

   Print / Export (if applicable) 
    Print view       : [YES  print stylesheet defined for this screen / NO]
    Export formats   : [CSV / PDF / Excel / none]
    Export trigger   : [button in toolbar / context menu item]
    Export scope     : [current page only / all matching records / selected rows]

   Per-screen self-review 
  Run immediately after completing this screen. Fix every  inline
  before moving to the next screen. Skip items marked (N/A).

  LAYOUT
     Desktop wireframe present
     Tablet (768px) wireframe present (required for PAGE + WIZARD; optional for MODAL/WIDGET)
     Mobile (375px) wireframe present
     Mobile behavior declared (drawer / sheet / modal / tabs)
     Breadcrumb path defined

  FIELDS & FORMS
     All fields listed  type + required/optional + validation rule
     Form validation pattern declared (inline / on-blur / on-submit)
     FormGroup structure defined
     Conditional / dependent fields declared (show X when Y = Z)
     Cross-field validation declared (end date > start date, etc.)
     Read-only / view mode defined (roles that view but cannot edit)

  ACTIONS
     Every action has success path + error path
     Destructive actions have confirmation dialog text
     Submit button has submitting state (disabled + inline spinner)

  PERMISSIONS
     Role-based UI rules declared per field/button (hidden/disabled/enabled)
     No-permission state declared (/403 redirect / locked placeholder / hidden)

  STATES
     Loading state  skeleton or spinner, which area
     Empty state  message text + CTA button
     Error state  HTTP codes mapped (400inline, 401redirect, 403/403, 5xxtoast), messages written
     Success toast  exact message text written
     Unsaved changes indicator (form screens only)
     Dark mode variant  wireframe shows both light and dark layouts with correct tokens

  NOTIFICATIONS
     All toast texts written (success / warning / error / info)

  ACCESSIBILITY
     ARIA roles declared (role="main" / "dialog" / "alert" / aria-label)
     Keyboard navigation declared (Tab order / Esc / Enter)
     Focus management declared (auto-focus on open / return on close)
     Focus trap declared for MODAL screens (aria-modal="true", Tab cycles within modal only)
     Screen reader live regions declared (aria-live for dynamic content)
     Touch targets  4444px on all interactive elements (mobile screens)

  TYPE-SPECIFIC (count only items applicable to this screen)
     Pagination / sort / filter defined         (list and table screens)
     Wizard steps + back nav + draft save       (WIZARD screens)
     File upload spec                           (if screen has upload)
     Chart / dataviz spec                       (if screen has chart)

  
  Applicable items : [N of 32]
  Checked ()     : [N]
  Screen score     : [N/N] = [XX%]

   COMPLETE     90%  proceed to next screen
   PARTIAL     7089%  fix missing items now, then proceed
   INCOMPLETE  < 70%   stop and complete this screen before continuing
  

---

### STEP 2  Example output (List screen: User Management)

> This example shows what a completed STEP 2 entry looks like. Use it as a reference for format and depth.

**Screen: User List  PAGE**
Route: `/admin/users`

**Desktop wireframe (1440px)**
```

 [ Sidebar]  User Management                  [+ Add User]  

  Search users...          [Role ] [Status ] [Export]   

 Name  Email            Role        Status    Actions    

 ...   ...              ...         ...              

 Showing 120 of 143    [< 1 2 3 ... 8 >]                   

```

**Mobile wireframe (375px)**
```

  User Management  [+] 
  Search...      []  

 Jane Smith             
 jane@example.com       
 Admin   Active   []

 John Doe               
 john@example.com       
 Staff   Inactive []

```

**States:**
- Loading: skeleton rows (3 visible placeholder rows)
- Empty: "No users found. [+ Add User]" centered
- Error: "Unable to load users. [Retry]" with support contact
- No permission: redirect to /403

**Role-based rules:**
- Admin: sees all columns, can edit/delete
- Manager: sees all columns, can edit only
- Staff: redirected to /403 (no access)

**Dark mode variant (REQUIRED):**

Light mode (above) uses light tokens. Dark mode applies:
```

 [Dark bg]  User Management (light text)         [+ Add User]

  Search users...          [Role ] [Status ] [Export]   

 Name  Email            Role        Status    Actions    

 ...   ...              ...         ...              

 Showing 120 of 143    [< 1 2 3 ... 8 >]                   

```

Token mapping:
- Background: `--sw-color-surface` (light: #ffffff) / `--sw-color-surface-dark` (dark: #1a1a1a)
- Text: `--sw-color-text-primary` (light: #000000) / `--sw-color-text-primary-dark` (dark: #ffffff)
- Borders: `--sw-color-border-primary` (light: #e0e0e0) / `--sw-color-border-primary-dark` (dark: #404040)
- Buttons: `--sw-color-interactive-primary` (light: #0066cc) / `--sw-color-interactive-primary-dark` (dark: #3399ff)

Same layout, inverted colors via dark tokens. Contrast maintained (WCAG 2.1 AA).

**Per-screen self-review checklist:  29/29 (100%)**

---

## STEP 2.5  Self-review: full coverage + fix pass

Run after ALL screen wireframes are complete. Do NOT proceed to Step 3
until this step shows  READY.

### 2.5.1  Coverage table

  SCREEN COVERAGE TABLE:
  
   #   Screen                        Type    Story     Score     Status                               
  
   1   [Screen name]                 PAGE    US-001     XX%       Complete                          
   2   [Screen name]                 MODAL   US-002     XX%       Partial  missing: [items]        
   3   [Screen name]                 WIZARD  US-003              Missing  no wireframe designed   
  

  Total screens in Step 1 inventory : [N]
  Wireframes produced               : [N]
  Missing wireframes                : [N]  [list screen names]
  Screens  90% (complete)          : [N]
  Screens 7089% (partial)          : [N]  [list names + what is missing]
  Screens < 70% (incomplete)        : [N]  [list names]
  Average completeness              : [XX%]

### 2.5.2  Fix pass

For every  PARTIAL or  MISSING screen:
  - Output only the missing sections  NOT the full wireframe again
  - Mark each added section: [FIXED  item name]
  - Re-score the screen and update the coverage table row
  - Continue until ALL screens are  80%

### 2.5.3  Assumption log

Every design decision NOT explicitly stated in the SRS must be logged:

  ASSUMPTIONS LOG:
  
   #   Assumption made                                   Screen        Action                       
  
   1   [e.g. Admin can bulk-export  not stated in SRS]  [Screen]      Flag in PENDING DECISIONS    
   2   [e.g. List defaults sort: created date desc]      [Screen]      Accept unless corrected      
  

### 2.5.4  UX anti-pattern check

   Form with > 10 fields and no wizard        flag: split into a WIZARD
   List screen with no search or filter       flag: add minimum text search
   Detail screen with no back navigation      flag: add route back to list
   MODAL with more than 3 action buttons      flag: convert to a full PAGE
   Screen with no empty state defined         flag: every data screen needs one
   Destructive action with no confirm dialog  flag: all deletes need a confirm step
   Table with > 8 columns and no column hide  flag: add column visibility toggle

  Anti-patterns found: [N]  [screen name + pattern + recommendation]

### 2.5.4.1  Animation compliance check

   All interactive animations (button states, transitions, modals) follow 200ms ease-out rule on transform/opacity only
   No layout property animations (width, height, margin, padding, left, top, position)
   Loading animations use appropriate timing (200ms for most UI, 1.5s2s for shimmer only)
   Disabled states have animation on opacity only
   Form field focus states follow SmartWorkz convention (border color + subtle scale)
   prefers-reduced-motion guard present  all animations disabled when OS reduce-motion is enabled
   Card hover-lift uses only box-shadow token swap + transform: translateY (no layout properties animated)
   Card overlay reveal uses only opacity (not display:none/block toggling without a JS class)
   Card expand/collapse uses opacity transition only  NO CSS height or max-height animation
   Stagger animation: delay capped at 8 cards  50ms = 400ms max; beyond 8 cards delay is 0
   Scroll-triggered reveal: .sw-card--hidden entirely skipped when prefers-reduced-motion is set
   Drag-and-drop card: rotation and scale use transform only; no position-offset animation

  Animation compliance issues: [N]  [screen name + issue + required fix]

### 2.5.5  Final readiness gate

  SELF-REVIEW SUMMARY:
  Screens in inventory        : [N]
  Wireframes  90% (complete) : [N]   ([XX%] of total)
  Wireframes 7089% (partial) : [N]   (all fixed  / still open )
  Wireframes < 70% or missing : [N]   (all fixed  / still missing )
  Assumptions logged          : [N]
  Anti-patterns found         : [N]   (resolved  / flagged for tech lead )

   READY for Step 3   all screens  80%, zero wireframes missing
   NOT READY          fix remaining gaps before proceeding to Step 3

---

## STEP 2.6  UX writing guide + STEP 2.7  User flow / journey map

> See `.claude/refs/swp-ui-reference.md` **Sections B + C**  microcopy standards (button labels, error messages, empty states, toasts, confirmation dialogs) and Mermaid user flow diagram template.

---

## STEP 3  Component hierarchy

**Based on framework from STEP 0.5:** [Framework selected  React / Vue 3 / Angular / Flutter / SwiftUI / Svelte]

For each screen, declare the full component tree using the stack's confirmed component model. Include per-framework component communication patterns.

  NAMING CONVENTIONS (apply consistently across all screens):

  **React:** PascalCase files in `/components/` or `/pages/`
    - `UserListPage.tsx` / `UserListPage.jsx`
    - `UserDeleteDialog.tsx`
    - `UserForm.tsx`
    - Hooks: `useUserData.ts`, `useFormState.ts`

  **Vue 3:** PascalCase `.vue` files
    - `UserListPage.vue`
    - `UserDeleteDialog.vue`
    - `UserForm.vue`
    - Composables: `useUserData.ts`, `useFormState.ts`

  **Angular:** PascalCase with descriptive suffix
    - `UserListPage` (standalone component)
    - `UserDeleteDialogComponent`
    - `UserFormComponent`
    - `UserTableComponent`
    - Shared components: `SharedConfirmDialogComponent`
    - Pipes: `StatusLabelPipe`
    - Directives: `HasRoleDirective`

  **Flutter:** PascalCase Widgets
    - `UserListPage` (extends Stateless/StatefulWidget)
    - `UserDeleteDialog`
    - `UserForm`
    - Models: `UserModel`, `UserListState`

  **SwiftUI:** PascalCase Views
    - `UserListView`
    - `UserDeleteDialogView`
    - `UserFormView`
    - ViewModels: `UserListViewModel`

  **Svelte:** lowercase kebab-case filenames
    - `user-list.svelte`
    - `user-delete-dialog.svelte`
    - `user-form.svelte`
    - Stores: `userStore.ts`, `formStore.ts`

  SCREEN: [Screen Name]
  Lazy-loaded : [YES  feature route uses loadComponent / loadChildren] / [NO  eagerly loaded]
  Declaration : [standalone: true] / [declared in [FeatureName]Module]

  Component tree:
    [ScreenNamePage]                               routed, standalone, SMART (fetches data, injects services)
       [SharedPageHeaderComponent]              shared, DUMB (@Input: title, breadcrumbs)
       [FeatureFilterBarComponent]              feature-local, DUMB (@Input: filters, @Output: filterChange)
       [FeatureTableComponent]                 feature-local, DUMB (@Input: rows, @Output: actionEvent)
            [FeatureTableRowComponent]        feature-local, DUMB
       [FeatureFormDialogComponent]            feature-local, SMART (lazy  opened via DialogService)
       [SharedConfirmDialogComponent]          shared, DUMB (triggered on delete)

  Smart (container) components [inject services/store, trigger API calls]:
    - [List component names]

  Dumb (presentational) components [receive @Input / emit @Output only]:
    - [List component names]

  Shared components (reused across 2+ features):
    - [SharedComponentName]   used by: [Feature A, Feature B]

  Shared library boundary:
    App-level shared      /src/app/shared/      components used by 2+ feature modules
    Feature-local         /src/app/features/[feature]/components/  used only within one feature
    Rule: never place feature-specific components in app-level shared  breaks independent lazy loading

  Unit test stubs (spec files to create alongside each component):
    - [ScreenNamePage]               [screen-name.page.spec.ts]
    - [FeatureDialogComponent]       [feature-dialog.component.spec.ts]
    - [SharedComponentName]          [shared-component-name.component.spec.ts]
    - [PipeName]                     [pipe-name.pipe.spec.ts]

  Pipes:
    - [PipeName]   transforms: [what]  scope: [app-wide / feature-local]

  Directives:
    - [DirectiveName]   behavior: [what]  scope: [app-wide / feature-local]

  Third-party UI library components in use (from [UI Library in STACK]):
    - [LibraryComponentName]   used for: [purpose on this screen]

#### Input / Output contracts (framework-specific communication)

For every **dumb/presentational component** in this screen, document the full contract using framework-specific syntax. Component communication patterns vary by framework  choose the pattern that matches your framework (from STEP 0.5):

**React (Props + Callbacks):**
```typescript
interface UserCardProps {
  user: User;                           // required prop
  onDelete: (userId: string) => void;  // optional callback
  onEdit: (user: User) => void;
}

export function UserCard({ user, onDelete, onEdit }: UserCardProps) {
  return (
    <div>
      <p>{user.name}</p>
      <button onClick={() => onEdit.(user)}>Edit</button>
      <button onClick={() => onDelete.(user.id)}>Delete</button>
    </div>
  );
}
```

**Vue 3 (defineProps + defineEmits):**
```vue
<script setup lang="ts">
import type { User } from '@/types';

interface Props {
  user: User;          // required prop
  readonly: boolean;  // optional prop with default
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
});

const emit = defineEmits<{
  delete: [userId: string];
  edit: [user: User];
}>();
</script>
```

**Angular (Signals or Decorators):**
```typescript
// Modern (Angular 17+)  use signals for new components:
export class UserCardComponent {
  user = input.required<User>();
  readonly = input(false);

  delete = output<string>();
  edit = output<User>();
}

// Or legacy @Input/@Output decorators:
export class UserCardComponent {
  @Input() user!: User;
  @Input() readonly = false;

  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<User>();
}
```

**Flutter (Constructor params + Callbacks):**
```dart
class UserCard extends StatelessWidget {
  final User user;                              // required param
  final bool readonly;                          // optional param
  final Function(String) onDelete;             // optional callback
  final Function(User) onEdit;

  const UserCard({
    required this.user,
    this.readonly = false,
    this.onDelete,
    this.onEdit,
  });

  @override
  Widget build(BuildContext context) => /* ... */;
}
```

**SwiftUI (Property Wrappers):**
```swift
@State var user: User
@State var readonly: Bool = false

// Or via @Binding for parent-controlled state:
@Binding var user: User

// Callbacks:
var onDelete: ((String) -> Void)
var onEdit: ((User) -> Void)
```

**Svelte (Exported variables + Event dispatchers):**
```svelte
<script>
  import { createEventDispatcher } from 'svelte';

  export let user;           // required prop
  export let readonly = false; // optional with default

  const dispatch = createEventDispatcher();

  const handleDelete = () => dispatch('delete', user.id);
  const handleEdit = () => dispatch('edit', user);
</script>
```

**Contract table template** (framework-agnostic summary):

| Component          | Input/Prop                     | Type              | Required | Output/Event      | Emits              |
|--------------------|--------------------------------|-------------------|----------|-------------------|--------------------|
| [ComponentName]    | [propName]                     | [TypescriptType]  |  /   | [eventName]       | [EventType]        |
| [ComponentName]    | [propName]                     | [TypescriptType]  |  /   |                  |                   |

Rules (all frameworks):
- All inputs/props must be documented (name, type, required/optional)
- All outputs/events must be documented (name, emitted type)
- Dumb components receive data via props and emit events upward  no service injection
- Avoid passing callbacks through multiple levels (prop drilling); use framework state management for shared data (React Context, Vue provide/inject, Angular services, etc.)
- Type all props/inputs and event payloads

---

## STEP 3.1  Component testing strategy

> See `.claude/refs/swp-ui-reference.md` **Section D**  per-framework testing tools and patterns (React, Vue 3, Angular, Flutter, SwiftUI, Svelte), component test examples, and coverage targets.

---

## STEP 3.23.5  UI pattern library

> See `.claude/refs/swp-ui-reference.md` **Section E**  onboarding/product tour patterns, push notification patterns, AI/ML UI patterns, and maps/geolocation patterns.

### STEP 4  Per-framework form handling and event binding

> See `.claude/refs/swp-ui-reference.md` **Section F**  react-hook-form (React), VeeValidate (Vue 3), reactive forms (Angular), Flutter form widgets, SwiftUI form state, and Svelte form actions.
---

## STEP 5  State management + interceptors

**Based on framework from STEP 0.5:** [Framework selected  React / Vue 3 / Angular / Flutter / SwiftUI / Svelte]

Refer to STEP 0.5 Framework table for the framework's default state management pattern. Declare the state approach for every feature based on that framework and complexity. Provide actual code examples showing initialization, updates, and fetching data.

### State management patterns (framework-specific)

**React:**
- Context API + useReducer (simple, local state)
- Redux / Redux Toolkit (complex, shared state)
- Zustand (lightweight alternative)
- TanStack Query / SWR (server state, caching, synchronization)
Choose based on: single component state (useState)  shared local state (Context)  complex global state (Redux/Zustand)  server/remote data (TanStack Query)

**Vue 3:**
- Pinia stores (recommended, modern; replaces Vuex)
- Composition API reactive()/ref() (local/feature state)
- Provide/inject (shared across tree)
Choose based on: single component (ref)  feature state (Composition API)  app-wide (Pinia)

**Angular:**
- Signals with computed() (Angular 17+, local/feature state, simple)
- NgRx Store + Effects (complex shared state, strict unidirectional data flow)
- Service + BehaviorSubject (shared state, simpler than NgRx)
Choose based on: component-local (Signal)  feature shared (@Injectable)  app-wide complex (NgRx)

**Flutter:**
- Provider (simple, recommended)
- BLoC pattern (complex, testable)
- GetX (all-in-one, less boilerplate)
- Riverpod (advanced, functional approach)
Choose based on: Widget tree state (State)  shared local (Provider)  complex app state (BLoC/Riverpod)

**SwiftUI:**
- @State / @ObservedObject (local/view-level state)
- Combine ObservableObject + @EnvironmentObject (shared state)
- Third-party: Redux.swift, MobX for complex state
Choose based on: single view (@State)  multiple views sharing (@ObservedObject)  app-wide (@EnvironmentObject)

**Svelte:**
- svelte/store (writable, readable, derived stores)
- Context API via getContext/setContext (tree sharing)
Local state: reactive assignments with let/$ reactive declarations

### HTTP request handling

**Framework-agnostic interceptor pattern:**
- AuthInterceptor: inject Authorization header on all requests
- LoadingInterceptor: track in-flight requests, show/hide global loading indicator
- ErrorInterceptor: handle 401 (redirect to /login), 403 (redirect to /403), 5xx (toast)
- LoggingInterceptor: (optional) log method + URL for debugging/audit

Framework implementations:
- React: axios/fetch with custom hooks or middleware (TanStack Query, SWR)
- Vue: axios interceptors or fetch with composables
- Angular: HttpInterceptor (provided in root)
- Flutter: http/dio with interceptors
- SwiftUI: URLSession with custom session config + property wrappers
- Svelte: fetch in +server.ts or hooks with client-side request wrapper

  FEATURE STATE PLAN:
  Feature     : [Feature name]
  State type  : [framework-specific approach  see above]
  Reason      : [why this fits  complexity, sharing need, framework conventions]

  [If Redux/Pinia/NgRx  complex state management:]
    Store/slice  : [feature].store.ts / [feature].ts
    Actions      : Load | LoadSuccess | LoadFailure | Create | CreateSuccess | Update | Delete | DeleteSuccess
    Selectors    : selectAll[Feature] | select[Feature]ById | select[Feature]Loading | select[Feature]Error
    Effects/async: triggered by [Action]  API call  dispatches [SuccessAction] or [FailureAction]
    Cache policy : [re-fetch on every action / cache until invalidated by mutation]

  [If Provider/Signals/Composables  local/feature state:]
    State file   : [feature].state.ts / [feature].ts
    Signals/refs : [featureItems] | [isLoading] | [error]
    Computed     : [filteredItems] | [totalCount]
    API wiring   : onMount/mounted/useEffect hook calls API, updates signals/refs

  [If TanStack Query/SWR  server state:]
    Query key    : [feature-items] | [feature-by-id]
    Stale time   : [how long cache is valid before re-fetch]
    Refetch      : [on focus / on interval / manual / after mutation]

  FORM STATE:
  Feature        : [Feature name]
  Form library   : [React Hook Form / Formik / Vue VeeValidate / Angular Reactive Forms / Flutter Form / SwiftUI @State]
  Validation     : [inline / on-blur / on-submit]
  Dirty tracking : [YES  blocks navigation on unsaved changes / NO]

  CACHE INVALIDATION:
    After Create [Entity] : invalidate query / clear selector / reset store slice
    After Update [Entity] : invalidate [list + detail] queries / refetch
    After Delete [Entity] : invalidate list query / remove from cache

  OPTIMISTIC UPDATES:
    [Feature action]      : [YES  update local state immediately, rollback on failure / NO]

  STATE INITIALIZATION / HYDRATION:
    On app bootstrap      : [load user profile + permissions via APP_INITIALIZER / root layout / _layout.svelte]
    Persist across reload : [localStorage / sessionStorage / none  list which state keys]
    Rehydrate on init     : [YES  restore persisted state before first render / NO]
    Sensitive state       : never persist tokens, passwords, or PII to client storage

#### Async request handling patterns

Choose the correct async pattern based on the use case  using the wrong pattern causes race conditions or duplicate submissions:

| Scenario                                      | Pattern / Operator | Why                                                      |
|-----------------------------------------------|-------------------|----------------------------------------------------------|
| Search / autocomplete (cancel previous)       | Cancel prev request | Cancels in-flight request when new input arrives (RxJS: switchMap, React: AbortController) |
| Form submit / save (ignore while in flight)   | Debounce / Disable | Ignores new clicks until current request completes (RxJS: exhaustMap, React: disable button) |
| Sequential dependent calls (order matters)    | Queue / Chain      | Queues requests, preserves order (RxJS: concatMap, async/await: await in sequence) |
| Independent parallel calls                    | Promise.all        | All must complete, order irrelevant (RxJS: forkJoin, Promise.all, React: Promise.all) |
| One-shot load (route resolve / init)          | Single fetch       | Unsubscribes after first result (RxJS: take(1), async/await: single await) |

**RxJS-specific (Angular, Vue with rxjs, React with rxjs):**
- switchMap: for search/autocomplete, cancels previous in-flight request
- exhaustMap: for form submit, ignores new requests until current completes
- concatMap: for sequential operations, queues requests in order
- forkJoin/zip: for parallel requests, waits for all to complete
- takeUntil: unsubscribe when component destroys or signal fires
- tap: side effects (logging, state updates)
- debounceTime: delay user input before making request

**Non-RxJS patterns (React with fetch, Vue composables, Flutter/SwiftUI):**
- AbortController (fetch API): cancel previous request, similar to switchMap
- Disable button during submit: prevent duplicate submissions, like exhaustMap
- async/await with proper sequencing: wait for each request before next
- Promise.all: parallel requests
- useEffect/mounted cleanup: unsubscribe/cancel on unmount

---

## STEP 5.5  Permission matrix

**Based on framework from STEP 0.5:** [Framework selected  React / Vue 3 / Angular / Flutter / SwiftUI / Svelte]

Output a complete Role  Screen  Action matrix for all screens.
Actions: View | Create | Edit | Delete | Export | [feature-specific actions]

Per-framework permission enforcement patterns:
- **React:** Wrapper components (ProtectedComponent, usePermission hook) or context-based checks
- **Vue 3:** v-if / v-show directives with permission checks, composables for permission logic
- **Angular:** *ngIf / *ngShow structural directives, @if / @show control flow (v17+), hasRoleDirective
- **Flutter:** Conditional widget rendering in build() method based on permission checks
- **SwiftUI:** if / switch statements in @ViewBuilder for conditional rendering
- **Svelte:** {#if} blocks based on permission state variables

  PERMISSION MATRIX:
  
   Screen / Route                Public  AuthUser  Admin  [Role N] 
  
   /login                         View   redirect  redir           
   /dashboard                             View     View           
   /[feature] (list)                      View     View           
   /[feature]/new                                 Edit           
   /[feature]/:id                         View     View           
   /[feature]/:id/edit                            Edit           
   Delete action on /:id                          Del            
   Export action                                  Exp            
  

  **Example: Permission matrix for a User Management feature**
  
   Screen / Route                Public  AuthUser  Admin 
  
   /login                        View    redirect  redir 
   /users (list)                          View    View  
   /users/new                                    Edit  
   Delete button on /users/:id                   Del   
  

  **Framework-specific enforcement  React example with hooks**

  // usePermission hook returns boolean for each action
  function usePermission(action: string, resourceId: string): boolean {
    const { role } = useAuth();
    const permissions = {
      'users:view':   ['AuthUser', 'Admin'],
      'users:create': ['Admin'],
      'users:edit':   ['Admin'],
      'users:delete': ['Admin'],
    };
    return permissions[action].includes(role) x false;
  }

  // Component usage  three-level enforcement:
  // 1. Hidden completely for unauthorized (not in DOM)
  // 2. Disabled + visible for partially authorized (see but can't act)
  // 3. Enabled for fully authorized

  function UsersList() {
    const { role } = useAuth();
    const canView = usePermission('users:view');
    const canCreate = usePermission('users:create');
    const canEdit = (id: string) => role === 'Admin';
    const canDelete = (id: string) => role === 'Admin';

    if (!canView) return <Redirect to="/login" />;

    return (
      <div>
        {/* Create button: hidden for non-Admin */}
        {canCreate && (
          <Button onClick={() => navigate('/users/new')}>
            New User
          </Button>
        )}

        <Table>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {/* Edit link: always rendered, disabled if not Admin */}
                <Link
                  to={`/users/${user.id}/edit`}
                  disabled={!canEdit(user.id)}
                  title={!canEdit(user.id)  'Admin only' : ''}
                >
                  Edit
                </Link>
              </TableCell>
              <TableCell>
                {/* Delete button: hidden for non-Admin, fully enabled for Admin */}
                {canDelete(user.id) && (
                  <Button
                    onClick={() => deleteUser(user.id)}
                    variant="danger"
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>
    );
  }

  UI enforcement rules:
    Hidden entirely   (not rendered in DOM) for : [Role  Screen/Action list]
    Visible + disabled (greyed, non-interactive) for : [Role  Screen/Action list]
    Visible + enabled                            for : [Role  Screen/Action list]

---

## STEP 6  UI design output + Go/No-Go decision

**Framework confirmed:** [Framework name from STEP 0  React / Vue 3 / Angular / Flutter / SwiftUI / Svelte]

All code examples, state management patterns, routing definitions, and permission checks below MUST use the framework-specific syntax from STEP 0.5. Do NOT mix frameworks (e.g., no Angular decorators in React code examples).

  
  UI DESIGN REPORT
  SRS File      : docs/SRS.md
  Designed      : [today  YYYY-MM-DD]
  Framework     : [React / Vue / Angular / Flutter / SwiftUI / Svelte] + [version from STACK CONFIRMED]
  UI Library    : [from STACK CONFIRMED]
  CSS Framework : [from STACK CONFIRMED]
  State approach: [from STEP 0.5 Framework column + STEP 5 declarations]
  Run type      : [Fresh / Incremental  screens updated: N, screens added: N]
  

  SCREENS       : [N] total  [N] PAGE, [N] MODAL, [N] WIZARD, [N] WIDGET
  COMPONENTS    : [N] total  [N] shared, [N] feature-local, [N] pipes/directives
  ROUTES        : [N]  [N] Auth-guarded, [N] role-guarded, [N] public, [N] lazy-loaded
  GUARDS        : Auth  | RedirectIfAuth  | Role  | CanDeactivate  | 404 wildcard 
  RESOLVERS     : [N] route resolvers defined
  STATE         : NgRx: [N] | Signals: [N] | Service+BS: [N] | Direct: [N]
  INTERCEPTORS  : Auth  | Loading  | Error  | Logging [ / ]
  PERMISSIONS   : [N] roles  [N] screens fully mapped

  MISSING SCREENS (SRS stories with no screen assigned):
    [None]  / [list any  PENDING DECISION required]

  MISSING FLOWS (user journeys with no navigation path defined):
    [None]  / [list any  PENDING DECISION required]

  API CONTRACT GAPS (UI assumes endpoints not yet designed in /swp-db or /swp-arch):
    [None]  / [list assumed endpoints  forward to /swp-db]

  SRS ACCEPTANCE CRITERIA COVERAGE:
    [Story ID] AC[N]: covered by [Screen Name]  /  gap  no screen covers this AC

  DESIGN SYSTEM COMPLIANCE:
    UI Library       : [from STACK CONFIRMED]
    Interactive controls use library components  no raw HTML buttons/inputs :  /  [list exceptions]
    Colors use library theme tokens  no hardcoded hex values in components   :  /  [list violations]
    Typography follows library scale  no arbitrary font-size overrides        :  / 
    Spacing uses design token scale (Tailwind / library spacing units)         :  / 

  SRS NFR VERIFICATION (read SRS Step 4 COMPLIANCE FRAMEWORKS before scoring):
  
   NFR (from SRS Step 4)         UI design addresses it                                   Status   
  
   WCAG 2.1 AA accessibility     ARIA labels, keyboard nav, colour contrast documented     //N/A
   Pagination                    List screens show page controls; SRS page size enforced   //N/A
   Responsive layout             Mobile wireframes present for all screens                 //N/A
   GDPR / PII                    PII fields masked in UI; consent UI present if required   //N/A
   HIPAA                         PHI not cached in browser storage; session timeout shown  //N/A
   PCI-DSS                       Card fields never captured in-app (redirect to PSP)       //N/A
   Offline / PWA                 Offline state screen designed if SRS requires PWA         //N/A
  
  Any  = add to PENDING DECISIONS before "UI approved".

  
   FRONTEND SECURITY CHECKLIST                                                                          
  
   Control                   Requirement                                                Status        
  
   XSS prevention            No innerHTML with unsanitised input; use framework escape  //N/A     
   CSRF tokens               Anti-CSRF token injected in HTTP interceptor               //N/A     
   CSP headers               Content-Security-Policy header configured server-side      //N/A     
   Auth token storage        JWT in memory or httpOnly cookie  NOT localStorage        //N/A     
   Sensitive data in UI      PII/PHI not logged to browser console or exposed in DOM   //N/A     
   Open redirect             All redirects validated against allowlist                  //N/A     
  
  Any security  = add to PENDING DECISIONS before "UI approved".

  
  GO / NO-GO DECISION
  

  Scoring dimensions (100 pts total):

  ### Example: Scoring a real UI design
  Sample project scores all 6 dimensions:

   Dimension                                                      Score   Reasoning                                         
  
   1. In-scope SRS screens identified                              14/15   All screens present; one story has 2 screens      
   2. All screens have complete wireframes (desktop+mobile+state)  18/20   Complete; minor pagination state gap               
   3. All routes defined (guards, resolvers, 404, canDeactivate)  15/15   All routes with guards + error handlers          
   4. State management + interceptors fully planned                12/15   NgRx defined; form state approach undefined        
   5. Permission matrix complete (all roles  screens  actions)   13/15   Full matrix mapped; Public role incomplete         
   6. Accessibility + responsive + SRS NFRs + API contracts       18/20   ARIA , mobile , API gaps flagged               
  
   TOTAL                                                            90/100   GO (80100 range)                              
  

  

  1. All in-scope SRS screens identified  no story left without a screen        [XX / 15]
     15 = zero gaps | 10 = 12 minor gaps | 5 = key story missing a screen | 0 = major gaps

  2. All screens have complete wireframes  desktop + mobile + all states         [XX / 20]
     20 = all complete | 15 = 12 missing mobile layouts | 10 = missing states on multiple screens | 0 = wireframes absent

  3. All routes defined  guards, resolvers, 404, redirect, canDeactivate         [XX / 15]
     15 = complete | 10 = 12 missing guards | 5 = multiple gaps | 0 = routing incomplete

  4. State management + interceptors fully planned for every feature              [XX / 15]
     15 = all features declared + all interceptors defined | 10 = 12 features missing | 0 = plan absent

  5. Permission matrix complete  all roles  screens  actions mapped            [XX / 15]
     15 = full matrix | 10 = minor role gaps | 5 = key roles missing | 0 = matrix absent

  6. Accessibility + responsive coverage + SRS NFRs enforced + no API contract gaps [XX / 20]
     20 = ARIA/keyboard , mobile wireframe , all SRS NFRs , no API gaps 
     15 = minor a11y or NFR gaps | 10 = missing mobile or open API gaps | 0 = none addressed

  
  TOTAL                                                         [XX / 100]

   GO          80100   UI design is ready. Proceed to /swp-db.
   CONDITIONAL  5079   Resolve items below before proceeding.
   NO-GO        < 50    UI design requires rework. Do not proceed.

  SIGNAL:  GO /  CONDITIONAL /  NO-GO

  Blockers preventing full GO (if any):
  1. [item  detected in Step N  what is needed to resolve]
  2. [item]

  PENDING DECISIONS  Tech lead must resolve before "UI approved"
  
   #   Item                              Score  Decision Needed                    Reply with                                   
  
   1   [missing screen]                  X    [which story needs a screen]       "resolve [screen]: [design decision]"        
   2   [role/permission gap]             X    [who can access this route]       "resolve [route]: [role]"                    
   3   [mobile layout ambiguity]         X    [which mobile UX pattern to use]   "resolve [screen] mobile: [pattern]"         
   4   [state approach question]         X    [NgRx vs Signals vs Service]       "resolve [feature] state: [approach]"        
   5   [API contract gap]                X    [endpoint assumed but not designed] "defer to /swp-db" or "add to /swp-arch"      
  

  [N] decisions pending. UI cannot be approved until all  items are resolved.
   items may be deferred  tech lead must confirm each with "defer [item] to phase [N]".

  OPEN QUESTIONS FOR TECH LEAD:
  1. [Ambiguous navigation flows  e.g. wizard vs multi-page]
  2. [Role/permission questions  e.g. User can view but can they export]
  3. [Shared component conflicts  e.g. two features need the same filter bar but different behavior]
  4. [Mobile UX pattern  e.g. bottom sheet vs full-screen modal on mobile]
  5. [State management preference  e.g. NgRx vs Signals for this feature]

  
  PHASE 1 UI GATE
  To resolve a gap       : "resolve [item]: [answer]"
  To revise a screen     : "revise [screen]: [feedback]"
  To defer an item       : "defer [item] to phase [N]"
  To approve             : "UI approved"

  Claude will not proceed to /swp-db until "UI approved".
  

[STOP  wait for "UI approved"]

---

## STEP 7  After "UI approved"

Run the Standalone Approval Publish Contract in `.claude/refs/approval-publish-contract.md` for all commits, pushes, PR creation/update, and manager acceptance email output in this step.

**Framework:** [Confirmed from STEP 0.5  React / Vue 3 / Angular / Flutter / SwiftUI / Svelte]

### 7.1  Write docs/UI-DESIGN.md

Write docs/UI-DESIGN.md containing:
  - STACK section (framework version, UI library, CSS, state default, form approach, chart library)
  - Full screen inventory with type, route, role
  - All wireframes  desktop + mobile per screen
  - Component hierarchy per screen (smart/dumb, lazy/eager, third-party components used)
  - Full routing map (tree, guards, resolvers, lazy loading)
  - State management plan per feature (interceptors, form state, cache invalidation)
  - Permission matrix
  - API contract gaps flagged for /swp-db

  If UI-DESIGN.md already existed (incremental run):
    - Preserve all existing sections unchanged
    - Mark updated screens: [UPDATED  Sprint N  YYYY-MM-DD]
    - Mark new screens: [NEW  Sprint N  YYYY-MM-DD]

### 7.2  Update CONTEXT.md

Add or update the UI section in CONTEXT.md:
  - UI design status: Approved
  - Total screens: [N]  [N] PAGE, [N] MODAL, [N] WIZARD, [N] WIDGET
  - State approach per feature: [one-line summary per feature]
  - Key design decisions made: [list decisions resolved from the pending table]
  - API contract gaps forwarded to /swp-db: [list endpoints]

### 7.3  Update docs/BREAKDOWN.md

Mark 2A complete and append design summary:

  Find: `## Phase 2A  UI/UX Design          [ ] pending`
  Replace with:
  `## Phase 2A  UI/UX Design          [x] [today's date]`
  `  - Screens: [N]  [N] PAGE, [N] MODAL, [N] WIZARD, [N] WIDGET`
  `  - Dark mode: confirmed`
  `  - WCAG: AA compliant`

For each screen and service, add a task row in the relevant Epic section:
  | [ScreenName]Page component          | UI  Component   | [Story ID] | Todo |
  | [FeatureName]StateService / Store   | UI  State       | [Story ID] | Todo |
  | [SharedComponentName]               | UI  Shared      | [Story ID] | Todo |

Check if 2B (DB Design) is also [x] in BREAKDOWN.md. If both 2A and 2B are [x]:
  Find: `## Phase 3   Dev Stories           [ ] BLOCKED (requires 1A+1B+2A+2B complete)`
  Replace with: `## Phase 3   Dev Stories           [ ] READY  run /swp-plan to create dev stories`

### 7.4  Commit UI design files

git add docs/UI-DESIGN.md docs/BREAKDOWN.md CONTEXT.md
git commit -m "docs(phase-2): UI/UX design approved  [N] screens, [N] components, [N] routes"

### 7.5  Update README.md and CHANGELOG.md

README.md  patch Project Status section:
  Phase badge   "Phase 2  UI Design Approved"
  Last updated  [YYYY-MM-DD]

CHANGELOG.md  add under [Unreleased]  ### Added:
  - Phase 2 UI: [N] screens across [N] Epics  [N] shared components, [N] feature-local, [N] routes defined

git add README.md CHANGELOG.md
git commit -m "docs(phase-2): update README and CHANGELOG  UI design approved"

### 7.6  Push and update ADO work item

git push origin HEAD
Create or update the PR to `develop` using `.claude/refs/approval-publish-contract.md`.

  Update ADO work items:
    - Current story  State: "Resolved" (per team convention in CLAUDE.md)
    - Add comment: "UI/UX design approved  [N] screens. See docs/UI-DESIGN.md."

### 7.7  Run /swp-sync validate automatically

5. Run /swp-sync validate automatically:
   Call /swp-sync (MODE 1  Validate).
   Wait for SYNC VALIDATION REPORT output.
   If RESULT:  BLOCKED  resolve all conflicts before proceeding. Re-run /swp-sync.
   If RESULT:  CONSISTENT  output "PHASE 2 UI COMPLETE  /swp-sync validated."

### 7.8  Output completion summary

  PHASE 2 UI COMPLETE
  Screens      : [N]  [N] PAGE, [N] MODAL, [N] WIZARD, [N] WIDGET
  Components   : [N]  [N] shared, [N] feature-local, [N] pipes/directives
  Routes       : [N]  [N] Auth-guarded, [N] role-guarded, [N] public, [N] lazy-loaded
  State        : NgRx: [N] | Signals: [N] | Service+BS: [N] | Direct: [N]
  Permissions  : [N] roles  [N] screens mapped
  Next         : Run /swp-db if not yet complete, or run /swp-plan once both 2A and 2B are [x] in BREAKDOWN.md

### 7.9  Downstream impact analysis

Analyse what the approved UI design implies for downstream docs. Run this after 7.8 output.

  DOWNSTREAM IMPACT  UI-DESIGN.md
  
  Impact on docs/DB-DESIGN.md:
    API contract gaps (UI assumes endpoints not yet in DB-DESIGN.md or SRS):
       None
      OR
        [N] gaps  run: /swp-db [feature] to cover these
         [endpoint or data field]  assumed by: [screen name]

    New data fields shown in UI with no corresponding DB column defined:
       None
      OR
        [list: field name  screen  which table likely owns it]

  Impact on docs/ARCH-DESIGN.md:
    New feature modules implied by new screens (not in ARCH-DESIGN.md):
       None
      OR
        [N] modules  run: /swp-arch [feature] to add architecture sections
         [module name]  implied by: [screen name]

    Component boundaries changed from previous design:
       None
      OR
        [list: what changed and which arch section it affects]

  Shortcuts:
    Validate consistency now  : /swp-sync validate
    Cascade feature changes   : /swp-sync [feature name]
  

### 7.10  Design token export

If the SRS or tech lead requests a design token export (for Figma handoff, design system docs, or cross-team usage):

Generate a `docs/design-tokens.json` snapshot of all SmartWorkz tokens in use:

```json
{
  "color": {
    "surface": { "value": "#ffffff", "dark": "#111827", "token": "--sw-color-surface" },
    "surface-raised": { "value": "#f9fafb", "dark": "#1f2937", "token": "--sw-color-surface-raised" },
    "surface-overlay": { "value": "#f3f4f6", "dark": "#374151", "token": "--sw-color-surface-overlay" },
    "text-primary": { "value": "#111827", "dark": "#f9fafb", "token": "--sw-color-text-primary" },
    "text-secondary": { "value": "#6b7280", "dark": "#9ca3af", "token": "--sw-color-text-secondary" },
    "interactive-primary": { "value": "#4f46e5", "dark": "#6366f1", "token": "--sw-color-interactive-primary" },
    "error": { "value": "#ef4444", "token": "--sw-color-error" },
    "success": { "value": "#10b981", "token": "--sw-color-success" },
    "warning": { "value": "#f59e0b", "token": "--sw-color-warning" }
  },
  "spacing": {
    "xs": { "value": "4px", "token": "--sw-spacing-xs" },
    "sm": { "value": "8px", "token": "--sw-spacing-sm" },
    "md": { "value": "16px", "token": "--sw-spacing-md" },
    "lg": { "value": "24px", "token": "--sw-spacing-lg" },
    "xl": { "value": "32px", "token": "--sw-spacing-xl" }
  },
  "borderRadius": {
    "card": { "value": "8px", "token": "--sw-card-radius" }
  },
  "shadow": {
    "card-raised": { "value": "0 2px 8px rgba(0,0,0,0.12)", "token": "--sw-card-shadow-raised" },
    "card-hover": { "value": "0 8px 24px rgba(0,0,0,0.18)", "token": "--sw-card-shadow-hover" }
  }
}
```

Add any project-specific tokens used in this design that extend the base set.

Commit:
```
git add docs/design-tokens.json
git commit -m "docs(design): export SmartWorkz design tokens for [project]"
```

### 7.11  Storybook component list (optional)

If the SRS or STACK CONFIRMED includes Storybook, output a Storybook story skeleton for each shared component identified in STEP 3:

```typescript
// Example: src/stories/[ComponentName].stories.ts
import type { Meta, StoryObj } from '@storybook/[framework]';
import { [ComponentName] } from '../components/[ComponentName]';

const meta: Meta<typeof [ComponentName]> = {
  title: 'SmartWorkz/[Category]/[ComponentName]',
  component: [ComponentName],
  tags: ['autodocs'],
  argTypes: {
    // [list @Input() / props here]
  },
};
export default meta;
type Story = StoryObj<typeof [ComponentName]>;

export const Default: Story = { args: { /* default prop values */ } };
export const DarkMode: Story = { args: { /* same, dark mode tested via decorator */ } };
export const LoadingState: Story = { args: { /* loading: true */ } };
export const ErrorState: Story = { args: { /* error: 'Sample error message' */ } };
```

**Story categories to cover per component:**
- Default (happy path)
- Dark mode variant
- Loading / skeleton state
- Error state
- Empty state (if applicable)
- Mobile viewport (if responsive behaviour differs)

Output the story skeletons in docs/UI-DESIGN.md under a new "## Storybook Stories" appendix section.

Skip this step if Storybook is not in STACK CONFIRMED.

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.11** (2026-05-21): Added standalone approval publish enforcement: commit, push, PR to develop, and manager acceptance email after UI approval.
- **v2.10** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


