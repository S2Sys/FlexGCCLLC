---
name: ci-cd-helper
description: |
  Generate CI/CD pipeline configuration files for a project. Supports GitHub Actions, Azure Pipelines, and GitLab CI. Reads SRS.md deployment settings to generate pipelines at basic, standard, or advanced levels.
  Trigger when: setting up CI/CD pipelines, generating pipeline YAML files, configuring automated build/test/deploy workflows, or running /ci-cd-helper.
compatibility: GitHub Actions, Azure Pipelines, GitLab CI
---


Command  : /ci-cd-helper
Version  : 2.1
Updated  : 2026-05-21
Author   : KapilDev

> **Prerequisites:** `docs/SRS.md` must exist with a `DEPLOYMENT` section and a `STACK CONFIRMED` block.
> If SRS.md is missing  STOP: run `/swp-srs` first to create it.

# CI/CD Pipeline Generation Helper

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

## Template Substitution Variables

When generating CI/CD pipeline files, the following variables are substituted:

| Variable | Source | Example |
|----------|--------|---------|
| `{{PLATFORM}}` | SRS DEPLOYMENT  ci-cd-platform | github-actions, azure-pipelines, gitlab-ci |
| `{{STACK}}` | SRS STACK CONFIRMED  Backend | node, python, go, java, dotnet, flutter |
| `{{LEVEL}}` | SRS DEPLOYMENT  pipeline-level | basic, standard, advanced |
| `{{APP_NAME}}` | SRS  Project Name | MyApp, ProjectName |
| `{{DEPLOY_ENV}}` | SRS environment strategy | develop, staging, production |

## Template Location Reference

Templates are organized by platform:

```
templates/ci-cd/
 github-actions/      GitHub Actions YAML files (.github/workflows/)
 azure-pipelines/     Azure Pipelines YAML files (root: azure-pipelines.yml)
 gitlab-ci/           GitLab CI YAML files (.gitlab-ci.yml)
```

## Build Command Reference

Stack-specific build/test/deploy commands used in templates:

### Node.js
- Install: `npm install`
- Test: `npm test`
- Build: `npm run build`
- Deploy: `npm start` or custom deployment script

### Python
- Install: `pip install -r requirements.txt`
- Test: `pytest`
- Build: `python setup.py build`
- Deploy: `python -m pip install -e .`

### Go
- Get deps: `go get -v -t -d ./...`
- Test: `go test -v ./...`
- Build: `go build -o [app-name]`
- Deploy: Binary execution or Docker deployment

### Java (Maven)
- Build: `mvn clean install`
- Test: `mvn test`
- Package: `mvn package`
- Deploy: Docker/Container registry or app server

### .NET
- Restore: `dotnet restore`
- Build: `dotnet build`
- Test: `dotnet test`
- Publish: `dotnet publish -c Release`

### Flutter
- Get deps: `flutter pub get`
- Test: `flutter test`
- Build APK: `flutter build apk`
- Build iOS: `flutter build ios`

## Pipeline Levels Explained

### Basic Level
- Single build job
- Test execution
- Single deployment stage
- **Use for:** Simple projects, MVPs

### Standard Level
- Linting / formatting checks
- Unit tests
- Integration tests (if applicable)
- Three deployment stages (develop  staging  production)
- **Use for:** Production applications

### Advanced Level
- All Standard level tasks PLUS
- Security scanning (OWASP, gosec, bandit)
- Code coverage reporting (Codecov)
- Performance testing / benchmarking
- Notifications (Slack, email)
- Rollback procedures
- **Use for:** Enterprise, compliance-critical, mission-critical applications

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.
## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).
| Version | Date       | Author   | Notes |
|---|---|---|---|
| 2.0 | 2026-05-21 | KapilDev | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |


