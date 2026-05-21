---
name: swc-infra
description: |
  Generate Infrastructure as Code (IaC) templates from the approved cloud architecture. Supports Terraform (Azure/AWS/GCP) and Bicep (Azure). Produces ready-to-apply templates in the infra/ folder.
  Prerequisite: docs/CLOUD-ARCH.md must exist and be approved.
  Trigger when: provisioning cloud infrastructure, generating Terraform or Bicep templates, setting up IaC, or running /swc-infra.
compatibility: Azure (Bicep/Terraform), AWS (Terraform), GCP (Terraform)
---

Command  : /swc-infra
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
| 1.4        | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.3     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.2     | 2026-05-16 | Zenthil | Fix: correct az bicep lint cmd, replace deprecated tfsec with trivy, add azurerm auth, fix PSRule invocation |
| 1.1     | 2026-05-16 | Zenthil | Fix: narrow to Terraform/Bicep only; add state backend, validation, outputs, security scan, rollback |
| 1.0     | 2026-05-16 | Zenthil | Initial  Terraform/Bicep; modular structure; per-environment tfvars |

---

Generate IaC templates for: $ARGUMENTS

**Prerequisite reads before using this command:**
- [CLOUD-ARCH.md](../../docs/CLOUD-ARCH.md)  Approved cloud architecture (REQUIRED)
- [SRS.md](../../docs/SRS.md)  Stack and environment configuration

If `docs/SRS.md` does not exist  continue using CLOUD-ARCH.md service map and environment strategy as the sole configuration source.

If `docs/CLOUD-ARCH.md` does not exist  STOP: run `/swc-arch` first.

**Related commands:**
- `/swc-arch`  Design cloud architecture (prerequisite)
- `/swc-deploy`  Generate deployment pipelines that use this infrastructure
- `/swc-cost`  Estimate costs for the resources defined here

**What this command produces:**
```
infra/
 main.[tf|bicep]           root module / template
 variables.[tf|bicep]      input variable declarations
 outputs.[tf|bicep]        output values (connection strings, resource IDs)
 backend.tf                remote state configuration (Terraform only)
 versions.tf               required_providers + terraform block (Terraform only)
 modules/ OR resources/    per-service modules
    networking/
    compute/
    database/
    storage/
    monitoring/
 environments/
    dev.[tfvars|bicepparam]
    staging.[tfvars|bicepparam]
    prod.[tfvars|bicepparam]
 README.md                 apply instructions + variable reference
```

---

## STEP 0  Tool selection

Detect or ask which IaC tool to use:

```
IaC TOOL SELECTION

Recommended for [provider]:
  Azure   Bicep (native, simpler syntax) or Terraform (multi-cloud, wider ecosystem)
  AWS     Terraform
  GCP     Terraform

Current project: [detect from CLOUD-ARCH.md provider]
Recommendation : [tool]

Confirm tool or specify: Terraform / Bicep
```

Wait for confirmation before generating.

---

## STEP 1  Project structure

Create the `infra/` folder structure based on the service map in CLOUD-ARCH.md.

For **Terraform**:
```
infra/
 main.tf           provider block + module calls
 variables.tf      variable declarations
 outputs.tf        output values
 versions.tf       required_providers + terraform block
 backend.tf        remote state backend
 modules/
    networking/   VNet/VPC, subnets, NSG, private DNS
    compute/      App Service / ECS / Cloud Run + autoscale
    database/     SQL / RDS / Cloud SQL + backup policy
    storage/      Blob / S3 / GCS + lifecycle rules
    monitoring/   App Insights / CloudWatch / Cloud Ops + alerts
 environments/
     dev.tfvars
     staging.tfvars
     prod.tfvars
```

For **Bicep** (Azure):
```
infra/
 main.bicep
 main.bicepparam
 modules/
    network.bicep
    compute.bicep
    database.bicep
    storage.bicep
    monitoring.bicep
 environments/
     dev.bicepparam
     staging.bicepparam
     prod.bicepparam
```

---

## STEP 1B  Remote state backend (Terraform only)

Generate `backend.tf` with remote state configuration. **Never use local state for shared environments.**

**Azure (Terraform + Azure Storage):**
```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-tfstate"
    storage_account_name = "sttfstate[project][env]"
    container_name       = "tfstate"
    key                  = "[project]/[env].tfstate"
    use_azuread_auth     = true  # uses az login / Managed Identity  no access key needed
  }
}
```
Bootstrap: `az storage account create --name sttfstate[project] --resource-group rg-tfstate --sku Standard_LRS --allow-blob-public-access false`

**AWS (Terraform + S3 + DynamoDB lock):**
```hcl
terraform {
  backend "s3" {
    bucket         = "[project]-tfstate-[account-id]"
    key            = "[env]/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "[project]-tfstate-lock"
  }
}
```

**GCP (Terraform + GCS):**
```hcl
terraform {
  backend "gcs" {
    bucket = "[project]-tfstate"
    prefix = "terraform/[env]"
  }
}
```

**First-time backend init:** `terraform init -reconfigure` after writing `backend.tf`.

---

## STEP 2  Networking module

Generate VNet/VPC, subnets, security groups, and private endpoints from CLOUD-ARCH.md network design.

**Must include:**
- VNet/VPC with CIDR from architecture
- Public / private / data subnets
- NSG / Security Group rules (deny-all default, 443 inbound only on public)
- NAT Gateway for private subnet egress
- Private endpoints for all PaaS services (prod only  controlled by environment variable)
- DNS zones for private endpoints

**Terraform example pattern:**
```hcl
module "networking" {
  source              = "./modules/networking"
  resource_group_name = var.resource_group_name
  location            = var.location
  vnet_address_space  = var.vnet_address_space
  enable_private_endpoints = var.environment == "prod"
}
```

---

## STEP 3  Compute module

Generate compute resources from the service map:

| Stack | Resource | Key settings |
|-------|----------|-------------|
| .NET / Node / Python API | App Service Plan + App Service | OS, SKU, always-on, HTTPS-only |
| Containers | AKS / ECS / GKE | node pool, autoscaler min/max |
| Serverless | Azure Functions / Lambda / Cloud Functions | runtime, memory, timeout |
| Static frontend | Static Web Apps / S3+CloudFront | SPA routing, custom domain |

**Always include:**
- Managed Identity / IAM role (no hardcoded credentials)
- HTTPS-only enforcement
- Autoscale rules (prod: CPU >70%  scale out)
- Health check path from SRS

---

## STEP 4  Database module

Generate database resources with:
- SKU mapped from environment (dev=Basic, prod=GeneralPurpose/Premium)
- Backup retention (dev=7d, staging=14d, prod=35d)
- Geo-redundant backup (prod only)
- Firewall: deny public access in prod  allow only private endpoint
- Admin password stored in Key Vault (output the Key Vault secret reference, not the value)
- SSL enforcement enabled

---

## STEP 5  Storage & secrets modules

**Storage:**
- Blob containers / S3 buckets / GCS buckets from CLOUD-ARCH.md
- Lifecycle rules (move to cool/IA after 30d, archive after 90d, delete after 365d)
- Versioning enabled
- Public access: blocked in prod

**Secrets / Key Vault:**
- Key Vault / Secrets Manager resource
- Access policies for Managed Identity
- Output Key Vault URI for use by compute module

---

## STEP 6  Monitoring module

Generate monitoring resources:
- Application Insights / CloudWatch / Cloud Ops workspace
- Log Analytics workspace (if applicable)
- Alert rules for: CPU >80%, memory >85%, error rate >1%, response time p95 >2s
- Dashboard (if supported natively)
- Diagnostic settings on all resources  Log Analytics

---

## STEP 6B  Security scan

After generating templates, run a static security scan before first apply:

**Terraform:**
```bash
# Trivy  successor to tfsec (recommended)
trivy config .

# checkov  broader ruleset
checkov -d . --framework terraform
```

**Bicep:**
```powershell
# PSRule for Azure (Azure Well-Architected rules)  use Assert-PSRule for readable output
Assert-PSRule -InputPath . -Module PSRule.Rules.Azure -Format File
```

Fix any HIGH or CRITICAL findings before proceeding to STEP 9.

---

## STEP 7  Environment variable files

Write per-environment variable files with correct SKUs and flags:

```hcl
# prod.tfvars
environment              = "prod"
app_service_sku          = "P1v3"
database_sku             = "GP_Gen5_2"
enable_private_endpoints = true
enable_geo_redundancy    = true
backup_retention_days    = 35
autoscale_enabled        = true
```

```hcl
# dev.tfvars
environment              = "dev"
app_service_sku          = "F1"
database_sku             = "B_Gen5_1"
enable_private_endpoints = false
enable_geo_redundancy    = false
backup_retention_days    = 7
autoscale_enabled        = false
```

---

## STEP 8  Write infra/README.md

Include:

1. **Prerequisites**  CLI tools required with minimum versions:
   - Terraform  1.5 / Azure CLI  2.50 / AWS CLI  2.x / gcloud  450
2. **First-time setup**  provider auth commands:
   - Azure: `az login && az account set --subscription <id>`
   - AWS: `aws configure` or `aws sso login`
   - GCP: `gcloud auth application-default login`
3. **Remote state bootstrap**  commands to create the storage backend (see STEP 1B)
4. **Validate before apply:**
   ```bash
   # Terraform
   terraform init && terraform validate
   terraform plan -var-file=environments/dev.tfvars

   # Bicep
   az bicep lint --file main.bicep
   ```
5. **Apply instructions** per environment:
   ```bash
   terraform apply -var-file=environments/dev.tfvars
   ```
6. **Variable reference**  all variables with descriptions and defaults
7. **Output reference**  all outputs with descriptions (see outputs.tf examples below)
8. **Rollback / destroy:**
   ```bash
   # Terraform  destroy all resources in an environment
   terraform destroy -var-file=environments/dev.tfvars

   # Bicep  delete deployment stack
   az stack group delete --name [stack-name] --resource-group [rg] --action-on-unmanage deleteAll

   # Always take a database backup before destroying prod
   ```

**outputs.tf examples** (generate outputs that match these patterns):
```hcl
output "app_url" {
  description = "Public URL of the application"
  value       = "https://${azurerm_linux_web_app.main.default_hostname}"
}

output "database_connection_string" {
  description = "Database connection string (app retrieves password separately from Key Vault)"
  value       = "Server=${azurerm_mssql_server.main.fully_qualified_domain_name};Database=${azurerm_mssql_database.main.name}"
  sensitive   = true
}

output "key_vault_uri" {
  description = "Key Vault URI for application secrets"
  value       = azurerm_key_vault.main.vault_uri
}

output "storage_account_name" {
  description = "Storage account name for blob containers"
  value       = azurerm_storage_account.main.name
}
```

**AWS outputs.tf examples**

```hcl
output "app_url" {
  description = "Public URL of the application"
  value       = "https://${aws_lb.main.dns_name}"
}

output "database_endpoint" {
  description = "RDS endpoint (app retrieves password from Secrets Manager)"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "secrets_manager_arn" {
  description = "Secrets Manager ARN for application secrets"
  value       = aws_secretsmanager_secret.main.arn
}

output "s3_bucket_name" {
  description = "S3 bucket name for file storage"
  value       = aws_s3_bucket.main.bucket
}
```

**GCP outputs.tf examples**

```hcl
output "app_url" {
  description = "Public URL of the Cloud Run service"
  value       = google_cloud_run_service.main.status[0].url
}

output "database_connection_name" {
  description = "Cloud SQL connection name (app retrieves password from Secret Manager)"
  value       = google_sql_database_instance.main.connection_name
  sensitive   = true
}

output "secret_manager_name" {
  description = "Secret Manager secret name for application secrets"
  value       = google_secret_manager_secret.main.name
}

output "storage_bucket_name" {
  description = "GCS bucket name for file storage"
  value       = google_storage_bucket.main.name
}
```

---

## STEP 9  Approval gate

```
IaC TEMPLATES READY

Tool        : [Terraform / Bicep]
Modules     : networking, compute, database, storage, monitoring
Environments: dev, staging, prod
Files       : infra/ (N files)

Review checklist:
  [ ] No secrets or passwords hardcoded
  [ ] Private endpoints enabled for prod
  [ ] Autoscale configured for prod
  [ ] Backup retention set per environment
  [ ] Managed Identity used (no service principal keys)
  [ ] Remote state backend configured (backend.tf)
  [ ] Security scan passed (trivy / checkov / PSRule)

Validate:
  terraform init && terraform validate
  terraform plan -var-file=environments/dev.tfvars
  (or: az bicep lint --file main.bicep)

Next: /swc-deploy to wire pipelines to this infra

Updates: BREAKDOWN.md Infra marked [x] on sign-off.

Type "infra approved" to mark complete, or give feedback.
```

If `docs/BREAKDOWN.md` exists and has an infrastructure section  mark it `[x]` after typing "infra approved".

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


