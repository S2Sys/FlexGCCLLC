---
name: swd-iq
description: |
  Extract technical interview questions from SmartWorkz architecture decisions. Transforms design rationale from docs/*design.md files into interview questions, model answers, and evaluation rubrics.
  Trigger when: preparing for a technical interview, reviewing architecture decisions for learning, extracting interview prep material from design docs, or running /swd-iq.
compatibility: Any stack  extracts interview questions from design docs
Command  : /swd-iq
Version  : 2.1
Updated  : 2026-05-21
| Version | Date       | Author  | Changes |
|---------|------------|---------|---------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |
| 1.2     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.1     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.0     | 2026-05-14 | Zenthil | Initial version  extract interview questions from architecture decisions |

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

## STEP 0  Prerequisite check

Read `docs/` directory. Check that at least one design document exists (ARCH-DESIGN.md, UI-DESIGN.md, DB-DESIGN.md, or GAME-ARCH.md).

IF no design docs found:
  HARD STOP:
  
  NO DESIGN DOCS FOUND
  This command extracts questions from architecture decisions.
  Run /swp-arch, /swp-ui, and /swp-db first to produce design docs.
  

---

Decode and extract interview questions from SmartWorkz++ architecture decisions. Transforms design rationale into interview questions, answers, and evaluation rubrics.

Use this command to:
- Extract interview questions from docs/*design.md
- Understand architecture decision rationale
- Prepare for technical interviews
- Evaluate candidate knowledge of system design

---

## Architecture Decision Types by Tech Stack

Interview question generation adapts to your architecture decisions across all tech stacks.

### Backend/API Decisions (All Stacks)
Common to backend, frontend, and mobile:
- Service architecture: monolith, N-layer, microservices, serverless
- API design: REST, GraphQL, gRPC
- Database patterns: relational, NoSQL, polyglot persistence
- Caching strategies: in-memory, distributed, HTTP caching
- Authentication: JWT, OAuth, session-based, API keys
- Data consistency: ACID, eventual consistency, CQRS

### Web Frontend Decisions
For React, Vue, Angular projects:
- State management: Redux, Vuex, NgRx, Context API, Zustand
- Component architecture: monolithic, atomic, feature-based
- Routing: client-side, SSR, code splitting
- Performance: lazy loading, bundle optimization, virtual scrolling
- Testing: unit testing, component testing, E2E testing

### Mobile Decisions
For Flutter, native iOS/Android:

**Architecture Patterns:**
- MVC: Model-View-Controller (simple, UI-focused)
- MVP: Model-View-Presenter (separation of concerns)
- MVVM: Model-View-ViewModel (data binding focus)
- Clean Architecture: entities, use cases, interface adapters
- BLoC: Business Logic Component (event-driven state management)

**State Management:**
- Provider: lightweight DI + change notification
- Riverpod: type-safe, scope-driven state management (recommended modern approach)
- Cubit/BLoC: event-driven, testable business logic
- GetX: all-in-one reactive framework
- setState: Flutter default (stateful widgets)

**Navigation:**
- Navigator 1.0: imperative stack-based navigation
- Navigator 2.0: declarative, deep-linking aware
- GoRouter: modern routing with nested navigation and deep-linking support

**Data Persistence:**
- Hive: lightweight, NoSQL key-value store (fast, no setup)
- Sqflite: relational database for SQLite
- Realm: modern object database (cross-platform)
- SharedPreferences: simple key-value for settings

**Testing Pyramid:**
- Unit tests: business logic, state management, utilities
- Widget tests: individual widgets, interactions
- Integration tests: full app flows, end-to-end scenarios

---

## STEP 1  Load and extract architecture decisions from design files

### Finding Design Files in Your Project

1. Search for all design documentation files in your project:
   ```powershell
   Get-ChildItem -Path docs -Filter "*design.md" -ErrorAction SilentlyContinue
   ```
   Or in bash:
   ```bash
   find docs -name "*design.md" 2>/dev/null || echo "No design files found"
   ```

   Look for: `docs/ARCH-DESIGN.md`, `docs/DB-DESIGN.md`, `docs/UI-DESIGN.md`, or any `docs/*design.md` pattern

2. If design files don't exist yet:
   - Use `/swp-arch`, `/swp-db`, `/swp-ui` commands to create them first
   - Then return here to extract interview questions from those designs

### Extracting Decisions from Design Files

3. Read each design file completely and parse all ADR (Architecture Decision Records) sections
   - Look for decision blocks marked with:
     * `## Decision: [Title]` or `### [Decision Title]`
     * Problem statement (usually: "Why this decision", "Problem:", "Context:")
     * Solution section (usually: "Solution:", "Choice:", "Approach:")
     * Consequences/trade-offs section (usually: "Trade-offs:", "Consequences:", "Impact:")
     * Rationale section (usually: "Rationale:", "Why:", "Justification:")

4. For each decision found, extract and store:
   - **Decision title** (e.g., "N-Layer Architecture", "BLoC State Management", "PostgreSQL Database")
   - **Problem statement** (Why was this needed What problem does it solve)
   - **Solution chosen** (What specific approach/tool/pattern was selected)
   - **Consequences/trade-offs** (What are the impacts What did we give up)
   - **Rationale** (Why is this the best choice for our context)
   - **Framework/stack** (Is this a backend, frontend, mobile, or database decision)

### Example: Extracting a Decision from ARCH-DESIGN.md

If your `docs/ARCH-DESIGN.md` contains:

```markdown
## Decision: Multi-Layer Backend Architecture

**Problem:**
  We needed a scalable backend structure that separates concerns and allows
  independent testing of business logic without touching the database.

**Solution:**
  Adopt N-Layer Architecture: API Controllers  Services  Repositories  Database

**Trade-offs:**
   Clear separation of concerns (easy to test)
   Dependency injection ready
   Scales well for team growth
   More files and folders per feature
   Potential over-engineering for simple CRUD

**Rationale:**
  N-Layer provides structure as the team grows. Each layer has a single responsibility:
  - Controllers: HTTP contracts and routing
  - Services: Business logic and validation
  - Repositories: Data access patterns
  This makes unit testing straightforward and keeps the team aligned.
```

**Then extract:**
```
Decision:     "Multi-Layer Backend Architecture"
Framework:    "backend"
Problem:      "Scalable backend structure with separated concerns"
Solution:     "N-Layer Architecture: Controllers  Services  Repositories"
Trade-offs:   "Clear concerns vs more files; testability vs slight over-engineering"
Rationale:    "Structure for team growth; single responsibility per layer"
```

5. Store all extracted decisions in your working memory with their metadata

---

## STEP 2  Generate interview questions from extracted decisions

For EACH decision extracted in STEP 1, generate 2-3 interview questions based on actual rationale:

**Question generation process:**

```
From decision: "[Decision Title]"
Problem: "[Extracted problem statement]"
Solution: "[Extracted solution chosen]"
Trade-offs: "[Extracted consequences/trade-offs]"
Framework: "[backend / frontend / mobile / database]"
```

**Generate questions dynamically:**

- **Q1 (Conceptual  Why this decision)**:
  "Why did we choose [solution] over alternatives for [problem]"

  Expected answer should mention: [key trade-off points from decision document]
  Use case: Assess understanding of decision rationale

  Example from extracted decision:
  "Why did we choose BLoC for state management"
  Expected: Mentions business logic separation, testability, scalability for multi-screen apps

- **Q2 (Technical  What are the implications)**:
  "What are the pros and cons of our [solution] approach"

  Expected answer should cover: [consequences and impacts from decision document]
  Use case: Assess deep understanding of trade-offs

  Example from extracted decision:
  "What are the trade-offs of using PostgreSQL"
  Expected: ACID guarantees, relational model, scaling complexity, vs NoSQL alternatives

- **Q3 (Deep dive  Explain to new developer)**:
  "How would you explain [decision] to a new developer joining the team"

  Expected answer should address: [rationale + practical impact + when to apply pattern]
  Use case: Assess ability to transfer knowledge

  Example from extracted decision:
  "Explain our N-Layer architecture to someone new"
  Expected: Clear layering strategy, dependency direction, communication between layers

---

### For Mobile Decisions (Flutter):

**Q1 (Pattern Understanding)**: "Explain [pattern]  when would you use it"
  Expected answer: Business logic separation, testability, reusability, state encapsulation

  Example: "Explain BLoC pattern  when would you use it"
  Strong answer would mention:
  - Separates business logic from UI layer
  - Events as input, States as output
  - Testable without context/BuildContext
  - Scales well for multi-screen apps with shared state
  - Works across all platforms (Flutter, Web, Desktop)

**Q2 (Trade-off Analysis)**: "What are pros/cons of [pattern] vs [alternative]"
  Expected answer: Boilerplate vs simplicity, scalability vs overhead, learning curve, when to use each

  Example: "Compare BLoC vs Provider for state management"
  Strong answer would cover:
  - BLoC: more boilerplate, steeper learning curve, but more scalable for complex apps
  - Provider: simpler syntax, faster to learn, lighter boilerplate, better for small-medium apps
  - Trade-offs: BLoC forces good architecture discipline; Provider is pragmatic for rapid development
  - Decision criteria: team size, app complexity, maintenance timeline

**Q3 (Code Example)**: "Write a simple [pattern] implementation"
  Expected answer: Actual Dart/Flutter code showing the pattern in action

  Example: "Implement a simple BLoC for a counter app"
  Strong answer includes:
  ```dart
  // Events
  abstract class CounterEvent {}
  class IncrementEvent extends CounterEvent {}
  class DecrementEvent extends CounterEvent {}

  // States
  abstract class CounterState {}
  class CounterInitial extends CounterState {}
  class CounterUpdated extends CounterState {
    final int count;
    CounterUpdated(this.count);
  }

  // BLoC
  class CounterBloc extends Bloc<CounterEvent, CounterState> {
    int _count = 0;

    CounterBloc() : super(CounterInitial()) {
      on<IncrementEvent>((event, emit) {
        _count++;
        emit(CounterUpdated(_count));
      });
      on<DecrementEvent>((event, emit) {
        _count--;
        emit(CounterUpdated(_count));
      });
    }
  }

  // Usage in Widget
  context.read<CounterBloc>().add(IncrementEvent());
  ```

---

### State Management Patterns (Flutter):

**Provider Pattern Example:**
  Q1: "Why would you use Provider over BLoC"
  Expected answer: Simpler for small apps, less boilerplate, DI container, computed dependencies

  ```dart
  // Simple Provider
  final countProvider = StateNotifier<int>((ref) => 0);

  // Usage
  Consumer(builder: (context, ref, child) {
    int count = ref.watch(countProvider);
    return Text('Count: $count');
  });
  ```

**Riverpod vs Provider:**
  Q2: "What advantages does Riverpod have over Provider"
  Expected answer: Type-safe, scope-driven, no context needed, better testability, Flutter Hooks integration

  ```dart
  // Riverpod equivalent
  final countProvider = StateNotifierProvider<CounterNotifier, int>((ref) {
    return CounterNotifier();
  });

  class CounterNotifier extends StateNotifier<int> {
    CounterNotifier() : super(0);

    void increment() => state++;
    void decrement() => state--;
  }

  // Usage - no context needed
  final count = ref.watch(countProvider);
  ref.read(countProvider.notifier).increment();
  ```

---

## STEP 3  Create evaluation rubric for each question

For each generated question, output rubric:

```
Question: [Q text]
Rubric points (1 point each):
  - [ ] Mentions [key point 1]
  - [ ] Mentions [key point 2]
  - [ ] Mentions [key point 3]
  - [ ] Provides specific example or trade-off
  - [ ] Demonstrates understanding of consequences

Score interpretation:
  - 4-5 points: Strong understanding 
  - 2-3 points: Basic understanding, some gaps
  - 0-1 points: Needs study
```

---

### For Flutter/Mobile Questions:

**Rubric for Architecture Patterns (BLoC, MVVM, Clean Architecture):**

```
Question: "Explain [pattern]  when would you use it"
Rubric points (1 point each):
  - [ ] Mentions pattern's core benefit (e.g., BLoC = business logic separation)
  - [ ] Explains testability advantage (no context/BuildContext required)
  - [ ] Identifies appropriate use cases (single screen vs multi-screen)
  - [ ] References state management mechanism (events in, states out)
  - [ ] Provides or mentions actual Dart code structure

Score interpretation:
  - 5 points: Strong architectural understanding, can apply pattern 
  - 3-4 points: Good understanding, knows when to use it
  - 2 points: Basic understanding, uncertain about trade-offs
  - 0-1 points: Needs deeper study
```

**Rubric for State Management Comparison (BLoC vs Provider, Provider vs Riverpod):**

```
Question: "Compare [pattern1] vs [pattern2]  pros and cons"
Rubric points (1 point each):
  - [ ] Identifies boilerplate differences (BLoC verbose, Provider lightweight)
  - [ ] Explains scalability considerations (BLoC for complex, Provider for simple)
  - [ ] Mentions learning curve or team adoption (Provider faster onboarding)
  - [ ] Discusses dependency injection approach (Provider = DI container, Riverpod = ref)
  - [ ] Provides concrete decision criteria or project context

Score interpretation:
  - 5 points: Can architect decision based on project needs 
  - 3-4 points: Understands trade-offs, can articulate choice
  - 2 points: Knows differences, but shallow on why
  - 0-1 points: Confuses the patterns
```

**Rubric for Code Examples (BLoC implementation, Provider usage, state mutation):**

```
Question: "Write code for [pattern]" or "How would you implement [feature]"
Rubric points (1 point each):
  - [ ] Code compiles/is syntactically correct Dart
  - [ ] Pattern structure is correct (Events, States, BLoC for BLoC pattern)
  - [ ] Event emission and state handling shown (context.read or ref.watch)
  - [ ] Widget consumption layer is present (Consumer, BlocBuilder, etc.)
  - [ ] Code demonstrates understanding of immutability and state flow

Score interpretation:
  - 5 points: Production-ready code, can be used immediately 
  - 3-4 points: Code works, minor issues (naming, structure)
  - 2 points: Code structure is there, but logic or syntax errors
  - 0-1 points: Incomplete or fundamentally incorrect
```

**Rubric for Testing Pyramid (Unit, Widget, Integration):**

```
Question: "How would you test [feature]" or "What tests cover [pattern]"
Rubric points (1 point each):
  - [ ] Mentions unit test for business logic (BLoC events/states)
  - [ ] Includes widget/component test for UI interaction
  - [ ] References integration test for full feature flow
  - [ ] Explains what each level catches (unit = logic, widget = UI, integration = user flow)
  - [ ] Mentions mocking/dependency injection for testability

Score interpretation:
  - 5 points: Understands full testing strategy 
  - 3-4 points: Knows 2-3 test levels, understands purpose
  - 2 points: Mentions tests but unclear on what each covers
  - 0-1 points: No testing strategy or confused levels
```

---

## STEP 4  Present decoded architecture questions from actual design files

After extracting all decisions from docs/*design.md, present them in interview format:

```
DECODED ARCHITECTURE QUESTIONS
Source: docs/*design.md (extracted [N] decisions)
Framework: [backend / frontend / mobile / database / mixed]


DECISION 1: [Exact title from design.md]


Problem:    [Exact problem statement from design.md]
Solution:   [Exact solution from design.md]
Trade-offs: [Exact consequences from design.md]
Framework:  [backend/frontend/mobile/database]


Q1 [Conceptual]: "Why did we choose [solution] for [problem]"

Expected answer should cover:
   [Key trade-off point 1 from design.md]
   [Key trade-off point 2 from design.md]
   [Context-specific reasoning from design.md]

Strong answer keywords:
  - [keyword 1 from problem statement]
  - [keyword 2 from solution section]
  - [keyword 3 from rationale]


Q2 [Technical]: "What are the pros and cons of [solution]"

Expected answer should cover:
   [Consequence 1 from trade-offs section]
   [Consequence 2 from trade-offs section]
   Alternatives not chosen and why

Strong answer keywords:
  - [positive impact from decision]
  - [limitation or trade-off]
  - [when to apply this pattern]


Q3 [Deep Dive]: "How would you explain [decision] to a new team member"

Expected answer should address:
   [Practical impact on development]
   [How it affects code organization]
   [When to apply this pattern]

Strong answer keywords:
  - [architectural benefit]
  - [team impact]
  - [code examples or patterns]


DECISION 2: [Next decision from design.md]

[Repeat format above for all extracted decisions]
```

**Output for each design file found:**
- ARCH-DESIGN.md  [N] architecture decisions
- DB-DESIGN.md  [N] database/schema decisions
- UI-DESIGN.md  [N] frontend/mobile UI decisions

---

## STEP 5  Interactive question mode

Ask user:
  "Which decision would you like to study
   1. [Decision 1 title]
   2. [Decision 2 title]
   3. [Decision 3 title]
   4. All decisions (comprehensive prep)
   5. Random question drill (10 questions)
   6. Flutter/Mobile patterns drill (BLoC, Provider, Riverpod)
   7. Testing pyramid drill (unit, widget, integration)"

Based on selection:

**If specific decision:** Present all 3 questions for that decision
**If all decisions:** Present all questions with progress tracking
**If random drill:** Generate 10 random questions from all decisions, score responses
**If Flutter patterns:** Deep dive on state management with code examples
**If testing pyramid:** Focus on testing strategy and when to use each level

For each question:
  1. Ask the question
  2. Wait for user's answer
  3. Compare to rubric points
  4. Provide score: X/5
  5. Highlight missing points: "You mentioned [X], but also consider [Y]"
  6. Show strong answer keywords they might use next time

---

### Example Flutter Interview Drill

**FLUTTER PATTERNS DRILL - Session 1**

**Q1: BLoC Pattern Understanding**
```
Question: "Explain the BLoC (Business Logic Component) pattern  when would you use it"

Expected framework:
- Core benefit: Separates business logic from UI
- Implementation: Events in, States out
- Testability: No BuildContext required
- Use case: Multi-screen apps with shared state
- Scalability: Grows well with app complexity

STRONG ANSWER EXAMPLE:
"BLoC is an architecture pattern that separates business logic from the UI layer.
It works by taking Events as input (user actions, data changes) and emitting States
as output (success, loading, error). This makes it highly testable because you don't
need a BuildContext. I'd use BLoC for larger apps with multiple screens sharing
state, where maintainability is critical. For simpler single-screen features, I
might use Provider for faster development. The pattern scales really well  you
can reason about state transitions independently from UI."

YOUR ANSWER SCORE: [User provides answer, rubric evaluates]
Missing points to consider: [if applicable]
```

**Q2: BLoC vs Provider Trade-offs**
```
Question: "What are the pros and cons of BLoC compared to Provider"

STRONG ANSWER EXAMPLE:
"BLoC pros:
  - Enforces strict architecture and testability
  - Clear state flow (events  bloc  states)
  - Scales for complex, multi-screen apps
  - Great for team projects with architecture guidelines

BLoC cons:
  - More boilerplate (event classes, state classes, bloc methods)
  - Steeper learning curve for junior developers
  - Overkill for simple features

Provider pros:
  - Lightweight, less boilerplate
  - Fast to implement simple state logic
  - Doubles as DI container
  - Easier onboarding for beginners

Provider cons:
  - Can become unmaintainable in large apps without discipline
  - Less clear separation of concerns
  - Easier to couple logic to widgets

DECISION CRITERIA:
- Use BLoC: Team size > 5, app complexity high, long-term maintenance
- Use Provider: Solo dev, simple feature, rapid prototyping
- Hybrid: Provider for UI state, BLoC for business domain logic"

YOUR ANSWER SCORE: [User provides answer]
```

**Q3: BLoC Code Implementation**
```
Question: "Write a BLoC for a login feature that takes username/password and validates."

STRONG ANSWER EXAMPLE (Dart/Flutter):
"""
// Events
abstract class LoginEvent {}
class LoginButtonPressed extends LoginEvent {
  final String username;
  final String password;
  LoginButtonPressed({required this.username, required this.password});
}
class LogoutButtonPressed extends LoginEvent {}

// States
abstract class LoginState {}
class LoginInitial extends LoginState {}
class LoginLoading extends LoginState {}
class LoginSuccess extends LoginState {
  final String token;
  LoginSuccess(this.token);
}
class LoginFailure extends LoginState {
  final String error;
  LoginFailure(this.error);
}

// BLoC
class LoginBloc extends Bloc<LoginEvent, LoginState> {
  final AuthRepository authRepository;

  LoginBloc({required this.authRepository}) : super(LoginInitial()) {
    on<LoginButtonPressed>(_onLoginButtonPressed);
    on<LogoutButtonPressed>(_onLogoutButtonPressed);
  }

  Future<void> _onLoginButtonPressed(
    LoginButtonPressed event,
    Emitter<LoginState> emit,
  ) async {
    emit(LoginLoading());
    try {
      // Validate input
      if (event.username.isEmpty || event.password.isEmpty) {
        emit(LoginFailure('Username and password cannot be empty'));
        return;
      }

      // Call repository to authenticate
      final token = await authRepository.login(
        username: event.username,
        password: event.password,
      );

      emit(LoginSuccess(token));
    } catch (e) {
      emit(LoginFailure(e.toString()));
    }
  }

  Future<void> _onLogoutButtonPressed(
    LogoutButtonPressed event,
    Emitter<LoginState> emit,
  ) async {
    await authRepository.logout();
    emit(LoginInitial());
  }
}

// Usage in Widget
class LoginPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LoginBloc, LoginState>(
      builder: (context, state) {
        if (state is LoginLoading) {
          return CircularProgressIndicator();
        } else if (state is LoginSuccess) {
          return Text('Login successful! Token: ${state.token}');
        } else if (state is LoginFailure) {
          return Text('Error: ${state.error}');
        }
        return LoginForm();
      },
    );
  }
}
"""

YOUR ANSWER SCORE: [User provides code, rubric evaluates]
Key points checked:
  - Event/State/BLoC class structure
  - Event handling logic (_onLoginButtonPressed)
  - State emission (emit()) calls
  - BlocBuilder usage in widget
  - Error handling
```

**Q4: Riverpod State Management**
```
Question: "Why would you choose Riverpod over Provider for state management"

STRONG ANSWER EXAMPLE:
"Riverpod improves on Provider by:
  - Type safety: providers are type-checked at compile time
  - Scope-driven architecture: clear ownership of state
  - No BuildContext needed: works outside widgets
  - Better testability: override providers in tests
  - Composability: combine providers like functions
  - Flutter Hooks: integrates with hooks for reactive updates

Code example - Riverpod vs Provider:
Provider (old way):
  final countProvider = StateProvider<int>((ref) => 0);
  ref.read(countProvider.notifier).state++;

Riverpod (modern way):
  final countProvider = StateNotifierProvider<CounterNotifier, int>((ref) {
    return CounterNotifier();
  });
  ref.read(countProvider.notifier).increment();

For complex apps with many interconnected states, Riverpod's
scope and invalidation system prevents state leaks and makes
refactoring much safer."

YOUR ANSWER SCORE: [User provides answer]
```

**Q5: Testing Strategy for BLoC**
```
Question: "How would you test a BLoC for the login feature"

STRONG ANSWER EXAMPLE:
"Testing pyramid approach:

UNIT TESTS (Business logic):
  - Test BLoC event handling
  - Mock AuthRepository
  - Verify state emissions

  void main() {
    group('LoginBloc', () {
      late MockAuthRepository mockAuthRepository;
      late LoginBloc loginBloc;

      setUp(() {
        mockAuthRepository = MockAuthRepository();
        loginBloc = LoginBloc(authRepository: mockAuthRepository);
      });

      test('emits [LoginLoading, LoginSuccess] when login succeeds', () async {
        when(mockAuthRepository.login(...)).thenAnswer((_) async => 'token123');

        expect(
          loginBloc.stream,
          emitsInOrder([
            LoginLoading(),
            LoginSuccess('token123'),
          ]),
        );

        loginBloc.add(LoginButtonPressed(username: 'user', password: 'pass'));
      });

      test('emits [LoginLoading, LoginFailure] when login fails', () async {
        when(mockAuthRepository.login(...)).thenThrow(Exception('Invalid'));

        expect(
          loginBloc.stream,
          emitsInOrder([
            LoginLoading(),
            LoginFailure('Exception: Invalid'),
          ]),
        );

        loginBloc.add(LoginButtonPressed(username: 'user', password: 'pass'));
      });
    });
  }

WIDGET TESTS (UI Integration):
  - Test BlocBuilder displays correct widgets for states
  - Verify user interactions trigger events

  testWidgets('shows loading indicator during login', (tester) async {
    final mockBloc = MockLoginBloc();
    when(mockBloc.stream).thenAnswer((_) => Stream.value(LoginLoading()));

    await tester.pumpWidget(
      BlocProvider<LoginBloc>.value(value: mockBloc, child: LoginPage()),
    );

    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });

INTEGRATION TESTS (Full flow):
  - Test real BLoC + real Repository together
  - Verify end-to-end authentication flow
  - Test persistence and side effects

pyramid breakdown:
  - 70% Unit tests (BLoC logic)
  - 20% Widget tests (UI rendering)
  - 10% Integration tests (full flows)"

YOUR ANSWER SCORE: [User provides answer]
```

---

## STEP 6  Summary and recommendations

After all questions answered:

Output:
  "Interview Prep Results
   
   Questions answered: N
   Average score: X/5

   Strengths: [Which decisions you understand well]

   Study gaps: [Which decisions need more work]

   Recommended reading:
   - Re-read docs/*design.md sections on: [decision names]
   - Focus on: [specific rationale you missed]

   Next steps:
   - [ ] Run /swd-iq again for random drill (different questions)
   - [ ] Discuss architecture decisions with tech lead
   - [ ] Review relevant code implementing these decisions
   - [ ] Practice explaining each decision in 30 seconds"

---

## STEP 7  Checkpoint

Before closing:
  1. Ask: "Which decision was most interesting"
  2. Ask: "Any decisions you'd like to understand deeper"
  3. Offer to: explain a decision, show code examples, or do another drill

---

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


