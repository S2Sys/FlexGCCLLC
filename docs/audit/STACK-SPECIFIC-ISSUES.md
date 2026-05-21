# Stack-Specific Command Audit

**Date:** 2026-05-14  
**Scope:** All 17 commands in `.claude/commands/`  
**Issue:** Commands are heavily .NET + Angular biased, limiting applicability to other stacks (Node.js, Python, Go, Java, Flutter, React, Vue)

---

## Critical Issues (Refactor Required)

### 1. `/swp-scaffold.md` â€” **CRITICAL** ðŸ”´

**Current bias:** .NET-only (Visual Studio solution, .csproj, NuGet)

**Affected stacks:** Node.js, Python, Go, Java, Rust

**Issues:**
- Step 1: Hardcoded project creation for .NET (e.g., `dotnet new sln`)
- Step 2: Only NuGet package references
- Step 4: Solution file (.sln) structure assumptions
- Missing: npm init, pip/poetry setup, go mod init, maven/gradle scaffolding

**Impact:** Cannot scaffold non-.NET projects

**Refactor approach:**
- STEP 0.5: Detect backend stack from STACK CONFIRMED
- Per-stack commands: `dotnet new` vs `npm init` vs `python -m venv` vs `go mod init`
- Universal root config files (tsconfig.json, pyproject.toml, go.mod, pom.xml)

---

### 2. `/swp-ui.md` â€” **CRITICAL** ðŸ”´

**Current bias:** Angular-only (@Input/@Output, RxJS, NgRx)

**Affected stacks:** Flutter, React, Vue, Svelte, SwiftUI

**Issues:**
- STEP 3: @Input/@Output contracts (Angular-only)
- STEP 5: RxJS operator table (Angular-only)
- STEP 6: mentions NgRx state management
- Missing: React hooks, Vue composition API, Flutter widget patterns, SwiftUI state binding

**Impact:** Cannot design UIs for React, Vue, Flutter, mobile apps

**Refactor approach:**
- STEP 0.5: Detect frontend framework from STACK CONFIRMED
- Create framework-specific component contract tables
- Separate state management guidance per framework (React Context vs NgRx vs Provider vs Redux)

---

### 3. `/swd-iq.md` â€” **HIGH** ðŸŸ 

**Current bias:** Generic but lacks domain-specific guidance

**Affected stacks:** Flutter, mobile development

**Issues:**
- No framework-specific architecture decisions listed (Flutter architecture, SwiftUI patterns)
- Focuses on backend/system design only
- Interview questions assume traditional layered architecture
- Missing: Mobile architecture (MVC, MVP, MVVM), state management (Provider, Riverpod, BLoC), testing pyramid

**Impact:** Cannot prepare candidates on Flutter/mobile architecture decisions

**Refactor approach:**
- Add framework-specific architecture decision types per STEP 0.5
- Include mobile patterns (MVC, MVP, MVVM, CLEAN, BLoC)
- Separate backend ADRs from frontend/mobile ADRs

---

## High-Priority Issues (Stack Flexibility Needed)

### 4. `/swd-unit-test.md` â€” **HIGH** ðŸŸ 

**Current bias:** Mentions only xUnit framework rules

**Issues:**
- Test framework determined by STACK CONFIRMED (good)
- BUT: Examples only show C# code
- Missing: Jest patterns, pytest patterns, Go testing patterns, Kotlin/Java test patterns, Dart/Flutter test patterns

**Impact:** Developers from non-.NET backgrounds get minimal guidance

**Refactor approach:**
- STEP 2: Add per-framework branch list templates (Jest vs xUnit vs pytest)
- STEP 3: Show test file location conventions per framework
- STEP 4: Provide AC coverage table with framework-specific test naming

---

### 5. `/swd-start.md` â€” **HIGH** ðŸŸ 

**Current bias:** Assumes layered backend architecture

**Issues:**
- Layer selection (Repository, Service, Endpoint) is .NET-centric
- No guidance for: React component development, Flutter widget development, serverless functions
- Missing: Frontend feature development paths, mobile app entry points

**Impact:** Frontend/mobile developers don't know how to structure subtasks

**Refactor approach:**
- STEP 0.5: Detect whether starting backend or frontend feature
- Add layer options per framework:
  - Backend: Repository / Service / API Endpoint (generic) / Stored Procedure
  - Frontend: Component / Service / Store / Utility
  - Mobile: Widget / Service / Repository / Test
  - Serverless: Function Handler / Layer / Integration

---

### 6. `/swp-arch.md` â€” **MEDIUM** ðŸŸ¡

**Status:** Already refactored in latest commit (v3.0) âœ…

**Refactored aspects:**
- Stack detection table added
- STEP 0.5 routing per backend type
- STEP 1 multi-stack project structure examples
- Remaining work: STEPS 2-9 need framework-specific DI, middleware, pipeline patterns

---

## Medium-Priority Issues (Needs Adaptation)

### 7. `/swp-db.md`

**Bias:** SQL/relational-centric (SQL Server, PostgreSQL only)

**Missing:** MongoDB, Firebase, DynamoDB, Firestore patterns

**Quick fix:** Add STEP 0.5 database type detection (SQL vs NoSQL vs document vs serverless)

---

### 8. `/swd-done.md`

**Bias:** .NET commit conventions (feat/fix prefixes), assumes .csproj builds

**Quick fix:** Make commit message generation framework-agnostic; detect build command from STACK CONFIRMED

---

### 9. `/swp-audit.md`

**Bias:** .NET code review checklist (OWASP + entity framework + C# idioms)

**Quick fix:** Add framework-specific code review dimensions table

---

## Summary Table

| Command | Critical | Bias | Affected Stacks | Refactor Status |
|---------|----------|------|-----------------|-----------------|
| /swp-scaffold | ðŸ”´ YES | .NET only | Node/Python/Go/Java/Rust | âŒ PENDING |
| /swp-ui | ðŸ”´ YES | Angular only | React/Vue/Flutter/SwiftUI | âŒ PENDING |
| /swd-iq | ðŸŸ  HIGH | Backend-only | Flutter/mobile | âŒ PENDING |
| /swd-unit-test | ðŸŸ  HIGH | Example-only | All (needs examples) | âš ï¸ PARTIAL |
| /swd-start | ðŸŸ  HIGH | Backend layers | Frontend/mobile | âŒ PENDING |
| /swp-arch | ðŸŸ¡ MEDIUM | .NET-specific | (done partially) | âœ… IN PROGRESS |
| /swp-db | ðŸŸ¡ MEDIUM | SQL-only | NoSQL/serverless | âš ï¸ QUICK FIX |
| /swd-done | ðŸŸ¡ MEDIUM | .NET commits | All | âš ï¸ QUICK FIX |
| /swp-audit | ðŸŸ¡ MEDIUM | .NET idioms | All | âš ï¸ QUICK FIX |

---

## Refactoring Priority Queue

**Phase 1 (CRITICAL â€” blocks usage for non-.NET projects):**
1. `/swp-scaffold.md` â€” multi-stack project scaffolding
2. `/swp-ui.md` â€” multi-framework UI design

**Phase 2 (HIGH â€” limits feature development):**
3. `/swd-iq.md` â€” add mobile/Flutter patterns
4. `/swd-start.md` â€” add frontend/mobile layer options
5. `/swd-unit-test.md` â€” add framework-specific examples

**Phase 3 (MEDIUM â€” quick wins):**
6. `/swp-db.md` â€” add NoSQL support
7. `/swd-done.md` â€” framework-agnostic commits
8. `/swp-audit.md` â€” framework-specific checklist

---

## Key Refactoring Pattern

All refactors should follow the pattern introduced in `/swp-arch` v3.0:

```
STEP 0 â€” Generic prerequisites
STEP 0.5 â€” Stack detection table + routing
STEP 1+ â€” Per-stack implementation
```

This pattern allows:
- âœ… Single command file per phase (not duplicated per stack)
- âœ… Runtime detection based on STACK CONFIRMED
- âœ… Progressive examples per framework
- âœ… Clear escape routes for unsupported stacks

---

## Recommendation

**Immediately refactor:** `/swp-scaffold` and `/swp-ui` (blocking issues)

**Refactor in next session:** `/swd-start`, `/swd-unit-test`, `/swd-iq`

**Document existing limitation:** Until refactored, prefix commands with framework warning:
```
âš ï¸ Note: This command currently provides detailed guidance for [framework].
   For other stacks, adapt the principles to your specific framework.
```

