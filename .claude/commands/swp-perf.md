---
name: swp-perf
description: |
  Generate performance testing plan and scaffolding for a SmartWorkz project  load test templates (k6/Artillery), SLA validation rules, response-time budgets, and monitoring scaffold (Application Insights / Prometheus). Reads docs/SRS.md NFR section for SLA targets.
  Trigger when: setting up performance tests, load testing, stress testing, defining SLA targets, validating response times, generating k6/Artillery scripts, or running /swp-perf.
compatibility: Any stack  reads NFR targets from docs/SRS.md
---

Command  : /swp-perf
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

| Version | Date       | Author  | Changes         |
|---------|------------|---------|-----------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |

| 1.2     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.1     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.0     | 2026-05-16 | Zenthil | Initial version |

---

> **Prerequisites:** `docs/SRS.md` must exist with an `NFR` section.
> If SRS.md is missing  STOP: run `/swp-srs` first.

# Performance Testing Helper

## STEP 0  Read SRS NFR targets

Read `docs/SRS.md` and extract:

| Target | SRS Value | Default if absent |
|--------|-----------|-------------------|
| API p95 response time | `[from SRS]` | 500 ms |
| API p99 response time | `[from SRS]` | 1000 ms |
| Page LCP | `[from SRS]` | 2500 ms |
| Concurrent users (steady) | `[from SRS]` | 100 |
| Peak concurrent users | `[from SRS]` | 500 |
| Error rate threshold | `[from SRS]` | < 1% |
| Throughput (RPS) | `[from SRS]` | 50 rps |

Output:

```
PERFORMANCE TARGETS (from SRS NFR)

API p95      : [X]ms    API p99    : [X]ms
Page LCP     : [X]ms    Throughput : [N] rps
Steady users : [N]      Peak users : [N]
Error rate   : < [X]%
Stack        : [from SRS STACK CONFIRMED]
Tool         : [k6 / Artillery  see STEP 1]

```

---

## STEP 1  Select test tool

| Stack | Recommended | Reason |
|-------|-------------|--------|
| Node.js / TypeScript | **k6** | JS-native, CI-friendly |
| Python | **Locust** | Python-native |
| .NET / Java / Go | **k6** | Cross-language, low overhead |
| Flutter / Mobile | **k6** (API layer only) | Backend only |

If `$ARGUMENTS` specifies a tool  use that instead.

---

## STEP 2  Generate test scripts

### k6 load test  `tests/performance/load-test.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const apiDuration = new Trend('api_duration');

export const options = {
  stages: [
    { duration: '30s', target: {{STEADY_USERS}} },
    { duration: '2m',  target: {{STEADY_USERS}} },
    { duration: '30s', target: {{PEAK_USERS}} },
    { duration: '1m',  target: {{PEAK_USERS}} },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<{{P95_MS}}', 'p(99)<{{P99_MS}}'],
    errors: ['rate<{{ERROR_RATE}}'],
    http_req_failed: ['rate<{{ERROR_RATE}}'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

export default function () {
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, { 'health 200': (r) => r.status === 200 });

  // TODO: Add authenticated endpoint calls here
  // const res = http.get(`${BASE_URL}/api/[resource]`, { headers: { Authorization: `Bearer ${token}` } });
  // check(res, { '[resource] 200': (r) => r.status === 200 });
  // apiDuration.add(res.timings.duration);
  // errorRate.add(res.status !== 200);

  sleep(1);
}
```

### k6 stress test  `tests/performance/stress-test.js`

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '1m',  target: {{PEAK_USERS}} },
    { duration: '3m',  target: {{PEAK_USERS}} * 2 },
    { duration: '1m',  target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<{{P95_MS}} * 2'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

export default function () {
  const res = http.get(`${BASE_URL}/health`);
  check(res, { 'alive': (r) => r.status < 500 });
}
```

### Artillery  `tests/performance/artillery.yml`

```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: Warm up
    - duration: 120
      arrivalRate: {{STEADY_RPS}}
      name: Steady state
    - duration: 60
      arrivalRate: {{PEAK_RPS}}
      name: Peak load
  ensure:
    p95: {{P95_MS}}
    p99: {{P99_MS}}
    maxErrorRate: {{ERROR_RATE_PCT}}
scenarios:
  - name: Health check
    flow:
      - get:
          url: /health
          expect:
            - statusCode: 200
```

---

## STEP 3  SLA validation rules

Create `tests/performance/sla-rules.md` with targets from STEP 0:

| Endpoint | Method | p95 | p99 |
|----------|--------|-----|-----|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |

| 1.2     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| /health  | GET    | [p95]ms | [p99]ms |
| /api/*   | GET    | [p95]ms | [p99]ms |
| /api/*   | POST   | [p95]ms | [p99]ms |

Degradation thresholds:
- Warning  : p95 > target  1.5
- Critical : p95 > target  2.0  alert on-call
- Breach   : p95 > target  3.0  rollback required

---

## STEP 4  Monitoring scaffold

### Application Insights (.NET)

```csharp
// Program.cs
builder.Services.AddApplicationInsightsTelemetry(
    builder.Configuration["ApplicationInsights:ConnectionString"]);
```

```json
// appsettings.json  connection string from env, never hardcode
{ "ApplicationInsights": { "ConnectionString": "" } }
```

### Prometheus (Node.js / Go)

```typescript
// src/metrics/prometheus.ts
import { Histogram, register } from 'prom-client';

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_ms',
  help: 'HTTP request duration in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 500, 1000, 2000, 5000],
});

export const metricsEndpoint = async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};
```

---

## STEP 5  CI/CD integration

### GitHub Actions

```yaml
- name: Run performance tests
  run: k6 run --env BASE_URL=${{ env.API_URL }} tests/performance/load-test.js
  env:
    API_URL: ${{ secrets.STAGING_API_URL }}
```

### Azure Pipelines

```yaml
- task: Bash@3
  displayName: Run k6 load tests
  inputs:
    targetType: inline
    script: k6 run --env BASE_URL=$(STAGING_API_URL) tests/performance/load-test.js
```

---

## STEP 6  Output summary

```
PERFORMANCE SCAFFOLD GENERATED

Files:
  tests/performance/load-test.js      k6 load test
  tests/performance/stress-test.js    k6 stress test
  tests/performance/artillery.yml     Artillery alternative
  tests/performance/sla-rules.md      SLA rules

SLA from SRS:  p95=[X]ms  p99=[X]ms  errors<[X]%
Load profile:  steady=[N]  peak=[N] users

Monitoring:  [Application Insights / Prometheus]

Next steps:
  1. Replace TODO placeholders with real endpoint calls
  2. Add auth token helper for protected endpoints
  3. Run: k6 run --env BASE_URL=http://localhost:5000 tests/performance/load-test.js
  4. Wire CI step (STEP 5)

```

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


