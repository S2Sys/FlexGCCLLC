---
name: swc-cost
description: |
  Estimate monthly cloud costs from the approved architecture, flag over-provisioning, and produce a CLOUD-COST.md report with per-environment breakdowns and optimisation recommendations.
  Prerequisite: docs/CLOUD-ARCH.md must exist and be approved.
  Trigger when: estimating cloud costs, reviewing infrastructure spend, flagging over-provisioning, planning budget, or running /swc-cost.
compatibility: Azure, AWS, GCP
---

Command  : /swc-cost
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

| Version | Date       | Author  | Changes |
|---------|------------|---------|---------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev   | Added skill optimization contract for evidence quality, output scoring, docs sync, handoff readiness, and verification discipline |
| 1.2        | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.1     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.0     | 2026-05-16 | Zenthil | Initial  per-resource cost tables, environment breakdown, optimisation flags, CLOUD-COST.md |

---

Estimate cloud costs for: $ARGUMENTS

**Prerequisite reads before using this command:**
- [CLOUD-ARCH.md](../../docs/CLOUD-ARCH.md)  Approved cloud architecture with service map and SKUs (REQUIRED)
- [SRS.md](../../docs/SRS.md)  NFRs, expected load, data volume

If `docs/CLOUD-ARCH.md` does not exist  STOP: run `/swc-arch` first.

**Related commands:**
- `/swc-arch`  Design cloud architecture (prerequisite)
- `/swc-infra`  Generate IaC after cost is reviewed and approved

**What this command produces:**
- `docs/CLOUD-COST.md`  monthly cost estimate per environment + optimisation recommendations

---

## STEP 0  Read prerequisites

Read `docs/CLOUD-ARCH.md` and extract:
1. Cloud provider
2. Service map (every service with its SKU/tier)
3. Environment strategy (dev, staging, prod)

Read `docs/SRS.md` and extract:
1. Expected peak users / RPS
2. Data volume estimates (storage GB, DB size)
3. SLA requirements (affects redundancy cost)

If `docs/SRS.md` does not exist  continue with defaults: 100 concurrent users, 50 GB storage, 99.9% SLA. Note the assumption at the top of CLOUD-COST.md.

---

## STEP 1  Per-resource cost table

For each service in the CLOUD-ARCH.md service map, produce a cost table.

Use current public list prices for the identified provider.
Clearly note: *"Prices are estimates based on public list rates as of [date] and may vary. Use the provider's official pricing calculator for binding quotes."*

**Format per environment:**

```
COST ESTIMATE  Production  (monthly, USD)

Resource             SKU / Config           Units  Unit Cost  Monthly

App Service          P1v3                   1      $XX.XX     $XXX.XX
App Service (slot)   P1v3 (staging slot)    1      $0         $0.00
Azure SQL            GP_Gen5_2 + 32 GB      1                $XXX.XX
Redis Cache          C1 Standard            1      $XX.XX     $XXX.XX
Blob Storage         LRS, 100 GB            100    $0.018/GB  $1.80
Service Bus          Standard               1M ops $0.10/M    $0.10
App Insights         Pay-per-use, 5 GB/mo   5 GB   $2.30/GB   $11.50
Key Vault            Standard               10K    $0.03/10K  $0.03
CDN                  Standard, 100 GB/mo    100    $0.087/GB  $8.70
NAT Gateway          Standard               1      $32.85     $32.85

TOTAL (Production)                                           $XXX.XX

```

Repeat for staging and dev environments. Dev/staging totals are typically 3050% of prod.

### AWS example

```
COST ESTIMATE  Production  (monthly, USD)

Resource             SKU / Config                    Units  Unit Cost   Monthly

EC2 (App)            t3.medium, us-east-1 on-demand  1      $30.37      $30.37
RDS (PostgreSQL)     db.t3.medium Single-AZ + 100 GB 1                $61.00
ElastiCache          cache.t3.micro (Redis)          1      $13.36      $13.36
S3 Storage           Standard, 100 GB               100    $0.023/GB   $2.30
CloudFront           Standard, 100 GB/mo            100    $0.085/GB   $8.50
SQS                  Standard, 1M requests          1M     $0.40/M     $0.40
CloudWatch           Custom metrics, 10 GB logs     10 GB  $0.50/GB    $5.00
Secrets Manager      5 secrets                      5      $0.40/mo    $2.00

TOTAL (Production)                                               $122.93

```

Repeat for staging and dev environments. Dev/staging totals are typically 3050% of prod.

### GCP example

```
COST ESTIMATE  Production  (monthly, USD)

Resource             SKU / Config                   Units  Unit Cost   Monthly

Cloud Run            1 vCPU, 512 MB, us-central1    1      ~$35.00     $35.00
Cloud SQL            db-n1-standard-1, 100 GB SSD   1                 $62.00
Memorystore          Redis, 1 GB Basic              1      $0.049/hr   $35.28
Cloud Storage        Standard, 100 GB               100    $0.020/GB   $2.00
Cloud CDN            Cache egress, 100 GB/mo        100    $0.080/GB   $8.00
Pub/Sub              Standard, 1M messages          1M     $0.40/M     $0.40
Cloud Logging        10 GB/mo logs                  10 GB  $0.50/GB    $5.00
Secret Manager       5 secrets, 10K access/mo       5      $0.06/mo    $0.30

TOTAL (Production)                                               $147.98

```

Repeat for staging and dev environments. Dev/staging totals are typically 3050% of prod.

---

## STEP 2  Environment summary

```
MONTHLY COST SUMMARY

Environment   Est. Monthly  Notes

Production    $XXX.XX       HA, Private endpoints, autoscale
Staging       $XXX.XX       Standard SKUs, no geo-redundancy
Dev           $XXX.XX       Free/Basic SKUs, no backups

TOTAL/month   $XXX.XX
TOTAL/year    $X,XXX.XX

```

> All estimates in USD. For local currency, multiply by your exchange rate at the time of planning.

---

## STEP 3  Over-provisioning analysis

Review each service against the SRS load requirements and flag over-provisioning:

```
OVER-PROVISIONING FLAGS

Service       Current SKU   Load from SRS     Assessment   Saving

App Service   P2v3 (2 vCPU) < 100 concurrent  OVER-SPEC    ~$60/mo
                            users             P1v3 OK     
Azure SQL     GP_Gen5_4     < 50 write TPS    OVER-SPEC    ~$120/mo
                                              GP_Gen5_2   
Redis Cache   C2 Standard   < 500 MB data     OK           

Total potential saving: ~$180/mo ($2,160/yr)

```

---

## STEP 4  Cost optimisation recommendations

Present ranked recommendations:

**HIGH IMPACT**
1. **Right-size SKUs**  [specific resources with specific SKU changes and $ saving]
2. **Reserved Instances / Savings Plans**  1-year commitment saves 3040% on compute for prod (apply when project is stable)
3. **Dev environment schedule**  auto-shutdown dev resources outside business hours  ~60% saving on dev compute

**MEDIUM IMPACT**
4. **Blob lifecycle policy**  move logs/backups to Cool/Archive tier after 30/90 days  ~$X/mo saving
5. **CDN for static assets**  offload static file traffic from App Service  reduces bandwidth cost

**LOW IMPACT**
6. **Log Analytics sampling**  reduce sampling rate for verbose telemetry in non-prod
7. **Unused resource cleanup**  flag any resources in CLOUD-ARCH.md not referenced by the application
8. **Free tier / startup credits**  Azure Free Tier, AWS Free Tier, and GCP $300 trial credit may cover dev environment costs entirely. Check eligibility before budgeting dev.

---

## STEP 5  Budget alert recommendations

Suggest Azure Cost Management / AWS Budgets / GCP Budget alerts:

```
RECOMMENDED BUDGET ALERTS

Alert                 Threshold           Action

Monthly spend > 80%   $[0.8  budget]     Notify FinOps + Tech Lead
Monthly spend > 100%  $[budget]           Notify CTO + block non-critical
Daily spike > 2      $[2  daily avg]    Investigate anomaly

```

---

## STEP 6  Write CLOUD-COST.md

Write `docs/CLOUD-COST.md` with this structure:

```markdown
# Cloud Cost Estimate  [Project Name]
Version  : 2.1 | Provider: [provider] | Estimated: [date]

> Prices based on public list rates. Use provider pricing calculator for binding quotes.

## Summary
## Production Cost Breakdown
## Staging Cost Breakdown
## Dev Cost Breakdown
## Over-Provisioning Analysis
## Optimisation Recommendations
## Budget Alert Setup
```

---

## STEP 7  Sign-off

```
CLOUD-COST.md READY

Total/month  : $[prod + staging + dev]
Prod only    : $[prod total]
Top saving   : [#1 optimisation and $ amount]

Next steps:
  [ ] Review over-provisioning flags and adjust CLOUD-ARCH.md if needed
  [ ] Run /swc-infra to generate IaC with correct SKUs
  [ ] Set up budget alerts in the cloud portal

Type "cost approved" to mark complete, or give feedback.
```

**Pricing calculators** (for binding quotes):
- Azure: https://azure.microsoft.com/en-us/pricing/calculator/
- AWS: https://calculator.aws/pricing/2/homescreen
- GCP: https://cloud.google.com/products/calculator

If `docs/BREAKDOWN.md` exists and has a cost section  mark it `[x]` to unblock `/swc-infra`.

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


