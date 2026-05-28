---
name: swc-deploy
description: |
  Generate cloud deployment pipeline configurations that deploy application code to cloud targets. Produces pipeline YAML files for the configured CI/CD platform that deploy to App Service, AKS, ECS, Lambda, GKE, Cloud Run, or Static Web Apps.
  Prerequisite: docs/CLOUD-ARCH.md must exist. Works with existing ci-cd-helper pipelines or standalone.
  Trigger when: deploying to cloud, generating cloud deployment pipelines, configuring blue/green or canary deployments, setting up container deployments, or running /swc-deploy.
compatibility: Azure App Service, AKS, AWS ECS, Lambda, GKE, Cloud Run  GitHub Actions, Azure Pipelines, GitLab CI
---

Command  : /swc-deploy
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
| 1.0     | 2026-05-16 | Zenthil | Initial  multi-target cloud deploy; blue/green; container registry; slot/canary support |

---

Generate cloud deployment pipelines for: $ARGUMENTS

**Prerequisite reads before using this command:**
- [CLOUD-ARCH.md](../../docs/CLOUD-ARCH.md)  Cloud targets, deployment strategy, environments (REQUIRED)
- [SRS.md](../../docs/SRS.md)  Stack, CI/CD platform preference, deployment environments

If `docs/CLOUD-ARCH.md` does not exist  STOP: run `/swc-arch` first.

**Related commands:**
- `/swc-arch`  Design cloud architecture (prerequisite)
- `/swc-infra`  Provision infrastructure that these pipelines deploy to
- `/ci-cd-helper`  Base CI/CD pipeline generation (build + test stages)

**What this command produces:**

| Target | Files generated |
|--------|----------------|
| Azure App Service | `.github/workflows/deploy-[env].yml` or `azure-pipelines.yml` deploy stage |
| AKS / GKE / ECS | Kubernetes manifests in `k8s/` + deploy pipeline stage |
| AWS Lambda | SAM/Serverless Framework config + deploy pipeline |
| Static Web Apps | SWA deploy pipeline + `staticwebapp.config.json` |

---

## STEP 0  Read prerequisites

Read `docs/CLOUD-ARCH.md` and extract:
1. **Provider**  Azure / AWS / GCP
2. **Compute target**  App Service / AKS / ECS / Lambda / GKE / Cloud Run / Static Web Apps
3. **Deployment strategy**  slot swap / blue-green / rolling / canary
4. **Environments**  dev, staging, prod (with approval gates if any)

Read `docs/SRS.md`:
1. **CI/CD platform**  from DEPLOYMENT section
2. **Container registry**  if using containers

If `docs/SRS.md` does not exist  use CLOUD-ARCH.md deployment strategy and compute target sections as the sole configuration source.

---

## STEP 1  Deployment strategy selection

Present recommended strategy based on compute target:

```
DEPLOYMENT STRATEGY

Compute target  : [e.g. Azure App Service]
Recommended     : Slot swap (staging slot  production)
  Why           : Zero-downtime, instant rollback, no extra compute cost

Alternative     : Blue/Green (separate apps)
  When          : Need full isolation, traffic splitting, canary %

SLA requirement : [from CLOUD-ARCH.md]
Zero-downtime  : Yes (slot swap / blue-green)
Rollback time   : < 1 minute (slot swap re-swap)

```

For **containers (AKS/ECS/GKE)**:
- Rolling update (default  zero-downtime, configurable max unavailable)
- Blue/Green namespace (full isolation, manual traffic switch)
- Canary (weight-based traffic split  Argo Rollouts / Flagger)

Confirm strategy before generating.

---

## STEP 2  Container registry setup (if applicable)

If the compute target uses containers, generate registry configuration:

```yaml
# Azure Container Registry / ECR / Artifact Registry
# Included in pipeline for login + push + pull
```

Registry resources to reference:
- ACR: `az acr login --name [registry]`
- ECR: `aws ecr get-login-password | docker login ...`
- GCR/AR: `gcloud auth configure-docker [region]-docker.pkg.dev`

Include in pipeline:
1. Build Docker image with semantic version tag
2. Push to registry
3. Reference image in deployment step

---

## STEP 3  Generate deployment pipeline stages

Build on the CI/CD pipeline (from `/ci-cd-helper` or fresh) by adding deployment stages.

### Azure App Service  slot swap strategy

```yaml
# deploy-to-staging-slot:
- name: Deploy to staging slot
  run: |
    az webapp deployment source config-zip \
      --resource-group ${{ vars.RESOURCE_GROUP }} \
      --name ${{ vars.APP_NAME }} \
      --slot staging \
      --src ./publish.zip

# smoke-test:
- name: Smoke test staging slot
  run: |
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://${{ vars.APP_NAME }}-staging.azurewebsites.net/health)
    if [ "$STATUS" != "200" ]; then echo "Smoke test FAILED: $STATUS"; exit 1; fi

# swap-slots:
- name: Swap staging  production
  run: |
    az webapp deployment slot swap \
      --resource-group ${{ vars.RESOURCE_GROUP }} \
      --name ${{ vars.APP_NAME }} \
      --slot staging \
      --target-slot production
```

### AKS / Kubernetes  rolling update strategy

Generate `k8s/` folder:
```
k8s/
 namespace.yaml
 deployment.yaml      image, replicas, resource limits, probes
 service.yaml         ClusterIP / LoadBalancer
 ingress.yaml         host rules, TLS secret
 hpa.yaml             HorizontalPodAutoscaler
 configmap.yaml       non-secret config
```

`k8s/deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: [APP_NAME]
  namespace: [NAMESPACE]
spec:
  replicas: 2
  selector:
    matchLabels:
      app: [APP_NAME]
  template:
    metadata:
      labels:
        app: [APP_NAME]
    spec:
      containers:
      - name: [APP_NAME]
        image: [ACR_NAME].azurecr.io/[IMAGE_NAME]:[TAG]
        ports:
        - containerPort: 80
        resources:
          requests: { cpu: "100m", memory: "128Mi" }
          limits:   { cpu: "500m", memory: "512Mi" }
        readinessProbe:
          httpGet: { path: /health, port: 80 }
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet: { path: /health, port: 80 }
          initialDelaySeconds: 30
          periodSeconds: 10
```

`k8s/service.yaml`:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: [APP_NAME]
  namespace: [NAMESPACE]
spec:
  selector:
    app: [APP_NAME]
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
```

Deployment pipeline stage:
```yaml
- name: Deploy to AKS
  run: |
    az aks get-credentials --resource-group $RG --name $CLUSTER
    kubectl set image deployment/$APP_NAME \
      $APP_NAME=$ACR_NAME.azurecr.io/$IMAGE_NAME:${{ github.sha }} \
      -n $NAMESPACE
    kubectl rollout status deployment/$APP_NAME -n $NAMESPACE --timeout=5m
```

### AWS Lambda  SAM deploy

```yaml
- name: Deploy Lambda
  run: |
    sam build
    sam deploy \
      --stack-name ${{ vars.STACK_NAME }}-${{ vars.ENV }} \
      --s3-bucket ${{ vars.DEPLOY_BUCKET }} \
      --parameter-overrides Environment=${{ vars.ENV }} \
      --no-confirm-changeset \
      --no-fail-on-empty-changeset
```

### Static Web Apps (Azure)

```yaml
- name: Deploy Static Web App
  uses: Azure/static-web-apps-deploy@v1
  with:
    azure_static_web_apps_api_token: ${{ secrets.SWA_TOKEN }}
    action: upload
    app_location: /
    output_location: dist
```

### AWS ECS  rolling update strategy

Deployment pipeline stage (GitHub Actions):
```yaml
- name: Deploy to ECS
  run: |
    aws ecs update-service \
      --cluster ${{ vars.ECS_CLUSTER }} \
      --service ${{ vars.ECS_SERVICE }} \
      --force-new-deployment
    aws ecs wait services-stable \
      --cluster ${{ vars.ECS_CLUSTER }} \
      --services ${{ vars.ECS_SERVICE }}
```

### GCP Cloud Run  deploy

```yaml
- name: Deploy to Cloud Run
  run: |
    gcloud run deploy ${{ vars.SERVICE_NAME }} \
      --image ${{ vars.AR_REGION }}-docker.pkg.dev/${{ vars.GCP_PROJECT }}/${{ vars.SERVICE_NAME }}:${{ github.sha }} \
      --region ${{ vars.AR_REGION }} \
      --platform managed \
      --quiet
```

### GitLab CI  deploy stage

```yaml
deploy-staging:
  stage: deploy
  script:
    - az webapp deployment source config-zip
        --resource-group $RESOURCE_GROUP --name $APP_NAME
        --slot staging --src publish.zip
  environment:
    name: staging
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy-prod:
  stage: deploy
  script:
    - az webapp deployment slot swap
        --resource-group $RESOURCE_GROUP --name $APP_NAME
        --slot staging --target-slot production
  environment:
    name: production
  when: manual
  needs: [deploy-staging]
```

---

## STEP 4  Environment promotion gates

Add manual approval gates for staging  prod promotion:

**GitHub Actions:**
```yaml
deploy-prod:
  needs: deploy-staging
  environment:
    name: production
    url: https://[app-url]
  # Requires GitHub environment protection rule with required reviewers
```

**Azure Pipelines:**
```yaml
- stage: DeployProd
  dependsOn: DeployStaging
  condition: succeeded()
  jobs:
  - deployment: DeployProduction
    environment: production  # environment with approval check configured
```

---

## STEP 5  Rollback pipeline

Generate a separate rollback workflow/pipeline:

```yaml
# .github/workflows/rollback.yml  triggered manually (workflow_dispatch)
jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      # App Service  re-swap (staging slot holds previous prod)
      - name: Rollback App Service
        run: |
          az webapp deployment slot swap \
            --resource-group ${{ vars.RESOURCE_GROUP }} --name ${{ vars.APP_NAME }} \
            --slot production --target-slot staging

      # AKS  revert to previous ReplicaSet
      - name: Rollback AKS
        run: |
          kubectl rollout undo deployment/${{ vars.APP_NAME }} -n ${{ vars.NAMESPACE }}
          kubectl rollout status deployment/${{ vars.APP_NAME }} -n ${{ vars.NAMESPACE }}

      # Lambda  redeploy previous tag
      - name: Rollback Lambda
        run: |
          sam deploy --stack-name ${{ vars.STACK_NAME }}-${{ inputs.environment }} \
            --s3-bucket ${{ vars.DEPLOY_BUCKET }} \
            --parameter-overrides Version=${{ vars.PREVIOUS_TAG }} \
            --no-confirm-changeset

      # Cloud Run  shift 100% traffic to previous revision
      - name: Rollback Cloud Run
        run: |
          gcloud run services update-traffic ${{ vars.SERVICE_NAME }} \
            --to-revisions=PREVIOUS=100 --region ${{ vars.AR_REGION }}
```

---

## STEP 6  Secrets and environment variables

List all secrets that must be configured in the CI/CD platform:

```
REQUIRED SECRETS (configure in GitHub Secrets / Azure Pipeline Variables / GitLab CI/CD Variables)

Secret name                Value source                 Scope

AZURE_CREDENTIALS          Service Principal JSON        All envs (Azure)
ACR_NAME                   Container registry name       All envs (Azure)
APP_NAME                   App Service / resource name   Per-env  (Azure)
RESOURCE_GROUP             Azure Resource Group name     Per-env  (Azure)
DATABASE_CONNECTION        Key Vault secret ref          Per-env  (Azure)
AWS_ACCESS_KEY_ID          IAM access key               All envs (AWS)
AWS_SECRET_ACCESS_KEY      IAM secret access key        All envs (AWS)
ECR_REGISTRY               ECR registry URI             All envs (AWS)
ECS_CLUSTER                ECS cluster name             Per-env  (AWS)
GCP_SA_KEY                 Service account JSON key     All envs (GCP)
GCP_PROJECT_ID             GCP project ID               All envs (GCP)
AR_REGION                  Artifact Registry region     Per-env  (GCP)

Note: NEVER store actual connection strings  use Key Vault / Secrets Manager / Secret Manager refs.
```

---

## STEP 7  Health check validation

Add post-deployment health verification to every pipeline:

```yaml
- name: Verify deployment health
  run: |
    for i in {1..6}; do
      STATUS=$(curl -s -o /dev/null -w "%{http_code}" $APP_URL/health)
      if [ "$STATUS" == "200" ]; then echo "Health check passed"; exit 0; fi
      echo "Attempt $i: status $STATUS  retrying in 10s..."
      sleep 10
    done
    echo "Health check FAILED after 60s"
    exit 1
```

---

## STEP 8  Output summary

```
CLOUD DEPLOY PIPELINES READY

Target      : [e.g. Azure App Service  slot swap]
Platform    : [GitHub Actions / Azure Pipelines / GitLab CI]
Environments: dev (auto)  staging (auto)  prod (manual gate)
Rollback    : Slot re-swap / kubectl rollout undo (< 1 min)

Files generated:
  [list of files]

Next steps:
  [ ] Configure secrets in [CI platform] (see STEP 6 list)
  [ ] Enable environment protection rules for production gate
  [ ] Run /swc-infra to provision the infrastructure targets

Type "deploy approved" to mark complete, or give feedback.
```

If `docs/BREAKDOWN.md` exists and has a deployment section  mark it `[x]` after typing "deploy approved".

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


