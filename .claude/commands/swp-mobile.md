---
name: swp-mobile
description: |
  Plan a mobile application - native vs cross-platform decision, architecture pattern, platform-specific UX considerations, App Store / Play Store submission checklist, push notification strategy, deep-link setup, and offline-first data approach. Produces MOBILE-ARCH.md.
  Trigger when: starting a mobile app project, choosing between native and cross-platform, planning iOS or Android development, or any time someone asks to plan or design a mobile application.
compatibility: React Native / Flutter / Swift / Kotlin
---

Command  : /swp-mobile

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

Version  : 2.1
Updated  : 2026-05-21
Author   : KapilDev

| Version | Date       | Author     | Notes           |
|---------|------------|------------|-----------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |

| 1.2     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Produce a mobile architecture decision record and launch checklist that a mobile development team can implement without additional research.

## Prerequisites

- Product brief / SRS (from `swp-srs`)
- Target platforms confirmed (iOS only / Android only / both)
- Team mobile experience level confirmed

---

## STEP 1 - Native vs Cross-Platform Decision

Score each option 1-5 for your context:

| Criterion | React Native | Flutter | Native (Swift/Kotlin) |
|-----------|-------------|---------|----------------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |

| 1.2     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| Team existing skill | | | |
| Time to market | | | |
| Performance requirements | | | |
| Platform-specific features needed | | | |
| Long-term maintenance | | | |
| **Total** | /25 | /25 | /25 |

- React Native: Best for JS teams, fast iteration, good ecosystem
- Flutter: Best for pixel-perfect UI across platforms, growing ecosystem
- Native: Best for maximum performance, complex device integrations, large teams

---

## STEP 2 - Architecture Pattern

Recommended: **MVVM with Clean Architecture layers**

```
Presentation Layer  -> Screens / Views / ViewModels
Domain Layer        -> Use Cases / Business Logic (no framework dependencies)
Data Layer          -> Repositories -> Remote (API) + Local (SQLite/Realm)
```

State management (choose one):
- React Native: Redux Toolkit or Zustand
- Flutter: Riverpod or Bloc
- Native iOS: Combine + @StateObject
- Native Android: ViewModel + StateFlow

---

## STEP 3 - Platform UX Guidelines

| Element | iOS (Apple HIG) | Android (Material 3) |
|---------|----------------|---------------------|
| Navigation | Tab bar (bottom) + navigation stack | Bottom navigation + back stack |
| Touch target | 44x44pt minimum | 48x48dp minimum |
| Typography | SF Pro (system font) | Roboto / Google Sans |
| Safe area | Respect notch + Dynamic Island | Respect status bar + gesture nav |
| Back gesture | Swipe right (Edge swipe) | Android back button + gesture |
| Alerts | UIAlertController style | Material Dialog style |

---

## STEP 4 - App Store Submission Checklist

**Apple App Store:**
- [ ] Apple Developer account active (GBP99/year)
- [ ] App ID created in Developer Portal
- [ ] Certificates and provisioning profiles generated
- [ ] Screenshots: 6.7" iPhone + 12.9" iPad (if universal)
- [ ] App preview video (optional but improves conversion)
- [ ] Privacy policy URL provided
- [ ] Age rating questionnaire completed
- [ ] TestFlight beta tested with 5+ external testers

**Google Play Store:**
- [ ] Google Play Developer account active ($25 one-time)
- [ ] Keystore file generated and backed up securely
- [ ] Screenshots: phone + 7" tablet + 10" tablet
- [ ] Feature graphic (1024x500px)
- [ ] Content rating questionnaire completed
- [ ] Data safety form completed
- [ ] Internal testing track tested before production release

---

## STEP 5 - Push Notification Strategy

| Notification Type | Trigger | Opt-in Required? | Frequency Cap |
|-------------------|---------|-----------------|---------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |

| 1.2     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| Transactional (order update, message received) | System event | No (iOS) / No | No cap |
| Promotional (sale, new feature) | Marketing trigger | Yes | Max 2/week |
| Re-engagement | User inactive 7+ days | Yes | Max 1/week |

Implementation:
- iOS: APNs via Firebase Cloud Messaging (FCM) or direct APNs
- Android: FCM
- Always request permission at a contextual moment (not on first launch)
- Provide in-app notification preference centre

---

## STEP 6 - Deep Links & Universal Links

| Link Type | Platform | Use For |
|-----------|----------|---------|
| Universal Links | iOS | Open app from web URL - fallback to App Store |
| App Links | Android | Open app from web URL - fallback to Play Store |
| Custom Scheme | Both | Internal navigation only (not for marketing links) |

Setup:
- iOS: Add `apple-app-site-association` file to `/.well-known/` on web domain
- Android: Add `assetlinks.json` file to `/.well-known/` on web domain
- Test with branch.io or Firebase Dynamic Links for cross-platform deep linking

---

## STEP 7 - Offline-First Data Strategy

| Scenario | Approach |
|----------|----------|
| Read-heavy (news, catalogue) | Cache API responses locally (SQLite / Realm / Hive) with TTL |
| Write-heavy (forms, orders) | Queue writes locally, sync when connection restored |
| Real-time (chat, live data) | WebSocket with local buffer; reconnect with exponential backoff |
| Conflict resolution | Last-write-wins for simple data; version vectors for collaborative data |

Show a clear offline indicator in the UI. Never fail silently.

---

## OUTPUT

`docs/MOBILE-ARCH.md` - platform decision, architecture pattern, UX guidelines, store checklists, push strategy, deep links, offline approach.
## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.
## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).
- **v1.2** (2026-05-21): Added phase/stage done-summary contract for concise boundary summaries and final run summary
- **v1.1** (2026-05-20): Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards

