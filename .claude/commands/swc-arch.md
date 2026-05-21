---
name: swc-arch
description: |
  Design cloud solution architecture for a product  provider selection, services, networking, security, HA/DR, and SLA mapping. Produces CLOUD-ARCH.md. Cloud infrastructure provisioning (/swc-infra) and cost estimation (/swc-cost) are BLOCKED until this is approved.
  Prerequisite: docs/SRS.md must exist with a STACK CONFIRMED block and NFR section.
  Trigger when: designing cloud infrastructure, selecting cloud provider, planning HA/DR, defining SLAs, updating cloud architecture, migrating to cloud, lift and shift planning, re-designing existing cloud setup, or running /swc-arch.
compatibility: Azure, AWS, GCP
---

Command  : /swc-arch
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
| 1.6        | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.5     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.4     | 2026-05-16 | Zenthil | Add migration scenario block in STEP 1 (pattern selection, phasing, cutover); add Open Decisions guidance in STEP 7 |
| 1.3     | 2026-05-16 | Zenthil | Add multi-cloud conditional block in STEP 1  deployment pattern, traffic routing, data sync strategy |
| 1.2     | 2026-05-16 | Zenthil | Add compliance framework detection (STEP 0) and controls table (STEP 4) for SOC2/HIPAA/PCI-DSS/GDPR |
| 1.1     | 2026-05-16 | Zenthil | Add update/delta mode detection (STEP 0.5); expand trigger phrases for migration + update scenarios |
| 1.0     | 2026-05-16 | Zenthil | Initial  provider selection, service mapping, networking, security, HA/DR, CLOUD-ARCH.md output |

## Contents
STEP 0    Read prerequisites
STEP 0.5  Update mode detection
STEP 1    Cloud provider selection
           Multi-cloud guidance (conditional)
           Migration guidance (conditional)
STEP 2    Service mapping
           Container platform (AKS/ECS/GKE, conditional)
STEP 3    Network architecture
STEP 4    Security design
STEP 5    High availability & disaster recovery
STEP 6    Environment strategy
STEP 7    Write CLOUD-ARCH.md
STEP 8    Approval gate

---

Design cloud architecture for: $ARGUMENTS

**Prerequisite reads before using this command:**
- [SRS.md](../../docs/SRS.md)  Stack, NFRs (SLA, RTO, RPO, scaling requirements)
- [ARCH-DESIGN.md](../../docs/ARCH-DESIGN.md)  Solution layers (if it exists)

If no $ARGUMENTS, design full cloud architecture based on SRS.md NFR and STACK CONFIRMED sections.

**Related commands:**
- `/swc-infra`  Generate IaC templates after this is approved
- `/swc-cost`  Estimate costs after this is approved
- `/swc-deploy`  Generate cloud deployment pipelines

**What this command produces:**
- `docs/CLOUD-ARCH.md`  approved cloud architecture (provider, services, networking, security, HA/DR)

---

## STEP 0  Read prerequisites

Read `docs/SRS.md` and extract:
1. **STACK CONFIRMED** block  backend, frontend, database, auth
2. **NFRs**  SLA uptime %, RTO, RPO, expected load (users/RPS), data residency
3. **Environments**  dev, staging, production

If `docs/ARCH-DESIGN.md` exists, read the solution layers and project structure.

4. **Compliance requirements**  scan NFR section for any of these keywords:
   - `SOC2` or `SOC 2`  flag: SOC2 controls required
   - `HIPAA`  flag: PHI data handling rules required
   - `PCI` or `PCI-DSS`  flag: cardholder data isolation required
   - `GDPR`  flag: data residency + right-to-erasure required

   Record detected flags as `COMPLIANCE_FLAGS`  used in STEP 4.

If any prerequisite is missing  STOP and tell the user which file is needed.

---

## STEP 0.5  Update mode detection

Check if `docs/CLOUD-ARCH.md` already exists.

**If it does NOT exist**  continue to STEP 1 (full design mode).

**If it DOES exist**  enter UPDATE MODE:

1. Read the existing `docs/CLOUD-ARCH.md` in full. If CLOUD-ARCH.md exists but is missing required sections (no Service Map, no Network Design, etc.), treat as full design mode and warn the user.
2. Compare the SRS content loaded in STEP 0 with what was recorded in CLOUD-ARCH.md.
3. Identify **only** what has changed since the last run:
   - New services added to the stack
   - NFR targets changed (SLA, RTO, RPO)
   - New environments added
   - Compliance requirements added or removed
   - Network topology or subnet design changed
   - Security controls, HA/DR regions, or backup policy changed

4. Present a delta summary:

```
UPDATE MODE  Changes detected since last CLOUD-ARCH.md

Changed : [e.g. SLA target 99.5%  99.9%]
Added   : [e.g. new Redis cache service]
Removed : [e.g. CDN removed from scope]
Unchanged : [list sections that are unchanged]

Proceed with delta update Or full redesign (delta / full)  Any other response: ask for clarification before proceeding.
```

5. If **delta**  only rewrite the affected sections of CLOUD-ARCH.md, preserving all other sections and decisions intact.
6. If **full**  continue from STEP 1 as normal.

**Important:** Never silently overwrite existing architectural decisions. If the user has not confirmed a full redesign, always default to delta mode.

---

## STEP 1  Cloud provider selection

Present a structured recommendation:

```
CLOUD PROVIDER ANALYSIS

Recommended : [Azure / AWS / GCP / Multi-cloud]
Reason      : [12 sentences  stack fit, team familiarity, compliance, cost]

Alternative : [second provider]
Trade-off   : [what you lose vs what you gain]

Multi-cloud considered [Yes/No  reason]
```

Base the recommendation on:
- Stack fit (Azure for .NET/Teams, AWS for broadest ecosystem, GCP for ML/data)
- NFR data residency requirements
- Existing org agreements or toolchain (ADO  Azure natural fit)

Show options and ask: **"Confirm provider or choose alternative"**

---

**Multi-cloud design guidance (only when multi-cloud is confirmed)**

> **Gate: skip unless user confirmed "multi-cloud". Load `.claude/refs/swc-arch-multicloud.md` for the full multi-cloud design guidance (deployment pattern, traffic routing, data sync strategy).**

---

**Migration scenario guidance (only when migration is detected)**

> **Gate: only apply if $ARGUMENTS or SRS contains "migrate", "migration", "lift and shift", or "on-premises". Load `.claude/refs/swc-arch-migration.md` for migration pattern selection, phasing table, and cutover strategy.**

---

## STEP 2  Service mapping

Map every SRS component to a cloud service. Use the reference table for the confirmed provider, then justify each choice against the NFRs.

**Azure  service reference**
```
SERVICE MAP  Azure

Component          Service                         Tier / SKU

API / Backend      App Service                     P1v3 / P2v3
Frontend           Static Web Apps                 Free / Standard
Database           Azure SQL / Cosmos DB           GP_Gen5_2 / Serverless
Cache              Azure Cache for Redis           C1 / C2
Queue / Bus        Service Bus                     Standard / Premium
Auth               Azure AD B2C / Entra ID         -
Storage            Blob Storage                    LRS / ZRS / GRS
CDN                Azure Front Door / Azure CDN    Standard / Premium
Monitoring         Application Insights + Monitor  Standard
Secrets            Key Vault                       Standard / Premium

```

**AWS  service reference**
```
SERVICE MAP  AWS

Component          Service                         Tier / SKU

API / Backend      ECS Fargate / Elastic Beanstalk t3.medium / t3.large
Frontend           S3 + CloudFront                 Standard
Database           RDS (PostgreSQL / MySQL)         db.t3.medium / db.r6g.large
Cache              ElastiCache (Redis)              cache.t3.micro / cache.r6g.large
Queue / Bus        SQS + SNS                       Standard / FIFO
Auth               Cognito                         -
Storage            S3                              Standard / Standard-IA
CDN                CloudFront                      Standard
Monitoring         CloudWatch + X-Ray              Standard
Secrets            Secrets Manager                 Standard

```

**GCP  service reference**
```
SERVICE MAP  GCP

Component          Service                         Tier / SKU

API / Backend      Cloud Run / App Engine          Managed / F2
Frontend           Firebase Hosting / Cloud Storage Free / Standard
Database           Cloud SQL / Firestore           db-n1-standard-2 / Serverless
Cache              Memorystore (Redis)              Basic / Standard
Queue / Bus        Pub/Sub                         Standard (flat pricing  no tier choice)
Auth               Firebase Auth / Identity Platform -
Storage            Cloud Storage (GCS)             Standard / Nearline
CDN                Cloud CDN + Cloud Armor         Standard
Monitoring         Cloud Monitoring + Cloud Trace  Standard
Secrets            Secret Manager                  Standard

```

Justify each choice against the NFRs.

---

If the SRS specifies a containerised or microservices deployment target (AKS, ECS, GKE), or if the compute service confirmed in the table above is a managed Kubernetes service, apply the supplementary container design below. Otherwise skip to STEP 3.

**If compute target is AKS / ECS / GKE (container/microservices deployment):**

Provide a supplementary container platform design covering the following:

**Cluster sizing  node pool SKU recommendations per environment**

| Setting         | dev              | staging          | production          |
|-----------------|------------------|------------------|---------------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| Node count      | 1                | 2                | 3+ (autoscale)      |
| Node SKU (Azure)| Standard_D2s_v3  | Standard_D4s_v3  | Standard_D8s_v3     |
| Node type (AWS) | t3.medium        | t3.large         | m5.xlarge           |
| Node type (GCP) | e2-standard-2    | e2-standard-4    | n2-standard-8       |

**Node pool types  system vs user pool separation**

Always separate system pools (OS/CNI components) from user pools (application workloads). This prevents application resource pressure from impacting cluster control-plane health. In AKS use `mode: System` / `mode: User`; in ECS use dedicated capacity providers; in GKE use `node-pool` labels and taints.

**Ingress controller**

| Provider | Recommended ingress       | WAF integration                        |
|----------|---------------------------|----------------------------------------|
| Azure    | NGINX Ingress Controller  | Pair with Application Gateway + WAF policy |
| AWS      | AWS Load Balancer Controller| Enable WAF v2 rule groups on the ALB   |
| GCP      | GKE Gateway (Gateway API) | Attach Cloud Armor security policy     |

WAF must be in **prevention mode** in production (see STEP 6 environment table).

**Service mesh  optional**

Deploy Istio or Linkerd when any of the following applies:
- SLA target  99.9% (mTLS between services reduces blast radius)
- More than 5 microservices with inter-service HTTP traffic
- Fine-grained traffic management (canary, weighted routing) is required

Flag in CLOUD-ARCH.md: `Service mesh: [None / Istio / Linkerd]  reason`.

**Image registry**

| Provider | Registry service              | Guidance |
|----------|-------------------------------|----------|
| Azure    | Azure Container Registry (ACR)| Use workload identity (federated credential on a managed identity)  never store registry credentials in Kubernetes secrets. |
| AWS      | Amazon ECR                    | Attach `AmazonEC2ContainerRegistryReadOnly` IAM role to the node group or pod service account via IRSA  no long-lived credentials. |
| GCP      | Artifact Registry             | Bind a Workload Identity-linked service account to `roles/artifactregistry.reader`  no key files in cluster. |

Enable image vulnerability scanning in the registry (Defender for Containers / ECR Enhanced Scanning / Artifact Analysis) and block deployment of critical CVEs via admission controller.

---

## STEP 3  Network architecture

Design the network topology:

```
NETWORK DESIGN

VNet/VPC : [CIDR range, e.g. 10.0.0.0/16]

Subnets:
  public  : [CIDR]  load balancers, API gateway, CDN origins
  private : [CIDR]  app services, compute, containers
  data    : [CIDR]  databases, cache, storage endpoints

Ingress  : [Load Balancer / API Gateway / App Gateway + WAF]
Egress   : [NAT Gateway / NAT instance  for private subnet outbound]
DNS      : [Azure DNS / Route 53 / Cloud DNS]
TLS      : [Managed cert via App Service / ACM / GCM]
```

Flag if any service requires a private endpoint (PaaS services should use private endpoints in prod).

---

## STEP 4  Security design

Cover each security layer:

| Layer | Control | Implementation |
|-------|---------|----------------|
| Identity | RBAC | Managed Identities / IAM Roles  no long-lived keys |
| Network | Firewall / NSG | Inbound: 443 only. Deny all else by default |
| WAF | OWASP ruleset | Azure App Gateway WAF / AWS WAF / Cloud Armor |
| Secrets | Vault | Key Vault / Secrets Manager  never in config files |
| Encryption at rest | Platform-managed | AES-256 default; CMK for PCI/HIPAA |
| Encryption in transit | TLS 1.2+ | Enforce HTTPS; disable TLS 1.0/1.1 |
| Audit | Activity log | 90-day retention min; export to SIEM for compliance |
| Container security | Image scanning | Defender for Containers / ECR scanning / Artifact Registry |

**Compliance controls (only if COMPLIANCE_FLAGS detected in STEP 0):**

| Framework | Required controls |
|-----------|------------------|
| SOC2 | Audit log retention  1 year; access reviews every 90 days; encryption at rest + in transit; incident response plan |
| HIPAA | PHI stored only in encrypted, access-logged storage; Business Associate Agreement with cloud provider; no PHI in logs or URLs |
| PCI-DSS | Cardholder data in isolated subnet; no storage of CVV/full PAN; quarterly vulnerability scans; WAF in prevention mode |
| GDPR | Data residency within EU (or user-confirmed region); right-to-erasure implemented at DB layer; DPA with cloud provider; data retention policy |

If any flag is set, add a `## Compliance Controls` section to `docs/CLOUD-ARCH.md` listing the applicable rows above.

---

## STEP 5  High availability & disaster recovery

```
HA / DR DESIGN

SLA target    : [from NFR, e.g. 99.9% = 8.7 hrs downtime/yr]
RTO target    : [e.g. 15 min  time to restore service]
RPO target    : [e.g. 1 hr  max data loss window]

Deployment   : [Single-region / Multi-region active-passive / active-active]
Regions      : [Primary: e.g. East US 2 | DR: West US 2]

Availability zones : [Yes/No  zone-redundant for all stateful services]

Database HA  : [Geo-replication / Multi-AZ / Cloud SQL HA]
Backup       : [Daily snapshots, 30-day retention, geo-replicated]
Failover     : [Automatic / Manual  Traffic Manager / Route 53 / Cloud DNS failover]

Recovery runbook : [Link to ops docs or note: to be created in STEP 6]

```

---

## STEP 6  Environment strategy

Define per-environment configuration:

| Setting | dev | staging | production |
|---------|-----|---------|------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| SKU / Size | Free/Basic | Standard (prod-like) | Premium / HA |
| Replicas | 1 | 12 | 2+ (autoscale) |
| Autoscale | Off | Off | On (CPU >70%) |
| Backup | Off | Weekly | Daily + geo |
| WAF | Off | Detection mode | Prevention mode |
| Private endpoints | Off | Optional | Required |
| Monitoring | Basic | Full | Full + alerts |

---

## STEP 7  Write CLOUD-ARCH.md

Write `docs/CLOUD-ARCH.md` with this structure:

```markdown
# Cloud Architecture  [Project Name]
Version  : 2.1 | Provider: [provider] | Updated: [date]

## Provider & Rationale
## Service Map
## Network Design
## Security Design
## HA / DR Design
## Environment Strategy
## Cost Estimate (placeholder  run /swc-cost)
## Open Decisions
```

**Guidance for the `## Open Decisions` section:**

An open decision is any architectural choice that could not be resolved from the SRS alone and requires a stakeholder answer before implementation can proceed.

As you write each section of CLOUD-ARCH.md, collect any choices that remain unresolved (no definitive answer available from SRS or $ARGUMENTS) and record them here. Do not defer this  populate the table as you encounter each unresolved item during STEPs 16.

Capture each unresolved choice as a row in the table below. If all decisions were resolved during this run, write "None  all architectural choices resolved" under the heading.

```markdown
## Open Decisions

| # | Decision | Options | Blocker | Owner |
|---|----------|---------|---------|-------|
| 1 | [e.g. Redis tier] | C1 vs C2 Standard | Load test needed | Dev Lead |
```

> **Note: Unresolved open decisions block `/swc-infra`  resolve all rows before generating IaC.**

---

## STEP 8  Approval gate

Present summary:

```
CLOUD-ARCH.md READY FOR REVIEW

Provider    : [provider]
Services    : [N services mapped]
HA strategy : [single-region / multi-region]
SLA         : [target %]
Next        : /swc-infra to generate IaC  |  /swc-cost for cost estimate

Type "cloud arch approved" to proceed, or give feedback.
```

Do NOT run `/swc-infra` or `/swc-cost` until the user types **"cloud arch approved"**.

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


