---
name: swc-monitor
description: |
  Set up application monitoring and alerting - observability stack selection, Four Golden Signals dashboards, alert threshold templates, runbook generation, on-call matrix, and SLA/SLO/SLI definitions. Produces MONITORING-PLAN.md and alert config scaffolding.
  Trigger when: deploying a new application, setting up monitoring, configuring alerts, writing runbooks, defining SLAs, or any time someone asks to set up observability, monitoring, or alerting.
compatibility: Application Insights / Prometheus+Grafana / Datadog
---

Command  : /swc-monitor

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
| 1.2        | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.0     | 2026-05-18 | SmartWorkz | Initial release |

---

## Purpose

Ensure every production application has observable health, actionable alerts, and documented runbooks before go-live.

## Prerequisites

- Cloud platform confirmed (Azure / AWS / GCP)
- Application stack confirmed
- SLA targets from SRS.md NFR section

---

## STEP 1 - Observability Stack Selection

| Scenario | Recommended Stack |
|----------|-------------------|
| Azure-hosted (.NET / Node) | Application Insights + Azure Monitor |
| Multi-cloud or self-hosted | Prometheus + Grafana + Alertmanager |
| Commercial SaaS preference | Datadog |
| Serverless (Lambda / Functions) | Cloud-native (CloudWatch / Azure Monitor) |

---

## STEP 2 - The Four Golden Signals

Instrument and dashboard these four signals for every service:

| Signal | What to Measure | Alert Threshold |
|--------|-----------------|-----------------|
| **Latency** | P95 response time (ms) | > 1000ms for 5 min |
| **Traffic** | Requests per second | < 10% of baseline for 10 min (traffic drop = upstream issue) |
| **Errors** | HTTP 5xx rate (%) | > 1% for 5 min |
| **Saturation** | CPU % + Memory % | > 85% for 10 min |

---

## STEP 3 - Alert Threshold Templates

Application Insights / Azure Monitor alert rules:

```json
[
  {
    "name": "High Error Rate",
    "signal": "requests/failedRequests",
    "operator": "GreaterThan",
    "threshold": 1,
    "unit": "Percent",
    "aggregation": "Average",
    "windowSize": "PT5M",
    "severity": 1,
    "action": "PagerDuty / email on-call"
  },
  {
    "name": "High P95 Latency",
    "signal": "requests/duration",
    "operator": "GreaterThan",
    "threshold": 1000,
    "unit": "Milliseconds",
    "aggregation": "Percentile95",
    "windowSize": "PT5M",
    "severity": 2,
    "action": "Email dev lead"
  },
  {
    "name": "High CPU",
    "signal": "performanceCounters/processCpuPercentage",
    "operator": "GreaterThan",
    "threshold": 85,
    "unit": "Percent",
    "aggregation": "Average",
    "windowSize": "PT10M",
    "severity": 2,
    "action": "Email dev lead"
  }
]
```

---

## STEP 4 - Dashboard Layout

Standard dashboard sections:

| Panel | Metrics | Visualisation |
|-------|---------|---------------|
| Service Health | Error rate, Availability % | Stat + colour threshold |
| Request Volume | RPS over time | Time series |
| Latency | P50 / P95 / P99 | Time series |
| Error Breakdown | 5xx by endpoint | Bar chart |
| Resource Usage | CPU %, Memory %, Disk | Gauge |
| Dependency Health | DB response time, external API errors | Time series |

---

## STEP 5 - Runbook Template

Create one runbook per alert:

```markdown
## Runbook: [Alert Name]

**Alert:** [Name as configured in monitoring tool]
**Severity:** P1 / P2 / P3
**SLA impact:** Yes / No

### Symptoms
- [What the alert fires on]
- [What users may experience]

### Diagnosis Steps
1. Open [Dashboard URL]
2. Check [specific panel] - look for [pattern]
3. Check [log query / trace] - command: `[exact query]`
4. If [condition], proceed to Fix A. If [other condition], Fix B.

### Fix A: [Most common cause]
1. [Step 1]
2. [Step 2]
Expected outcome: [metric returns to normal within X minutes]

### Fix B: [Less common cause]
1. [Step 1]
Expected outcome: [...]

### Escalation
If not resolved in 30 minutes -> escalate to [Name / role] via [channel].

### Post-Incident
- [ ] Write incident report (5 Whys)
- [ ] Create ticket for root cause fix
- [ ] Update this runbook if steps were wrong
```

---

## STEP 6 - On-Call Matrix

| Time | Primary | Secondary | Escalation |
|------|---------|-----------|------------|
| Mon-Fri 9am-6pm | [Name] | [Name] | Engineering Lead |
| Mon-Fri 6pm-9am | [Name] | [Name] | Engineering Lead |
| Weekends | [Name] | [Name] | CTO |

Response time SLA: P1 = 15 min - P2 = 1 hour - P3 = next business day.

---

## STEP 7 - SLA / SLO / SLI Definitions

```
SLA (Service Level Agreement - contractual):
  Availability : 99.9% uptime per calendar month (= max 43.8 min downtime)
  Response time: P95 < 1000ms

SLO (Service Level Objective - internal target, stricter than SLA):
  Availability : 99.95% (= max 21.9 min downtime)
  Error rate   : < 0.5%
  P95 latency  : < 800ms

SLI (Service Level Indicator - what we measure):
  Availability : (successful requests / total requests) x 100
  Error rate   : (5xx responses / total responses) x 100
  Latency      : P95 of request duration from Application Insights
```

Error budget = 100% - SLO = 0.05% downtime/month = 21.9 minutes.

---

## OUTPUT

`docs/MONITORING-PLAN.md` - stack selection, golden signals, alert thresholds, dashboard spec, runbook template, on-call matrix, SLA/SLO/SLI.
`docs/alerts-config.json` - alert rule definitions ready for import.
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

