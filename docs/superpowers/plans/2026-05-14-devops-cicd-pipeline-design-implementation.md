# DevOps CI/CD Pipeline Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `/sw-scaffold` command to automatically generate platform-aware CI/CD pipeline configuration files based on SRS deployment requirements.

**Architecture:** Add STEP 5 (after solution scaffolding) that reads platform, level, and environments from SRS DEPLOYMENT block, then generates stack-specific pipeline templates for GitHub Actions, Azure Pipelines, or GitLab CI. Templates use placeholder substitution for stack commands and environment configuration.

**Tech Stack:** Markdown command structure, YAML templates (GitHub Actions / Azure Pipelines), GitLab CI YAML

---

## File Structure

```
.claude/commands/swp-scaffold.md          (MODIFY — add STEP 5)
templates/ci-cd/
├── github-actions/
│   ├── node-basic.yml
│   ├── node-standard.yml
│   ├── node-advanced.yml
│   ├── python-basic.yml
│   ├── ... (21 templates total: 7 stacks × 3 levels)
├── azure-pipelines/
│   ├── node-basic.yml
│   ├── node-standard.yml
│   ├── ... (21 templates total)
└── gitlab-ci/
    ├── node-basic.yml
    ├── node-standard.yml
    ├── ... (21 templates total)
```

---

## Task 1: Create Template Directory Structure

**Files:**
- Create: `templates/ci-cd/` directory structure

- [ ] **Step 1: Create GitHub Actions template directory**

```bash
mkdir -p templates/ci-cd/github-actions
```

- [ ] **Step 2: Create Azure Pipelines template directory**

```bash
mkdir -p templates/ci-cd/azure-pipelines
```

- [ ] **Step 3: Create GitLab CI template directory**

```bash
mkdir -p templates/ci-cd/gitlab-ci
```

- [ ] **Step 4: Verify directory structure**

```bash
find templates/ci-cd -type d
```

Expected output:
```
templates/ci-cd
templates/ci-cd/github-actions
templates/ci-cd/azure-pipelines
templates/ci-cd/gitlab-ci
```

- [ ] **Step 5: Commit**

```bash
git add templates/ci-cd/
git commit -m "feat: create ci-cd template directory structure"
```

---

## Task 2: Create GitHub Actions Templates — Node.js

**Files:**
- Create: `templates/ci-cd/github-actions/node-basic.yml`
- Create: `templates/ci-cd/github-actions/node-standard.yml`
- Create: `templates/ci-cd/github-actions/node-advanced.yml`

- [ ] **Step 1: Create Node.js Basic level template**

```bash
cat > templates/ci-cd/github-actions/node-basic.yml << 'EOF'
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy to {{DEPLOY_ENV}}
        run: npm start
        env:
          NODE_ENV: {{DEPLOY_ENV}}
          APP_NAME: {{APP_NAME}}
EOF
```

- [ ] **Step 2: Create Node.js Standard level template**

```bash
cat > templates/ci-cd/github-actions/node-standard.yml << 'EOF'
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Lint code
        run: npm run lint
      - name: Run unit tests
        run: npm test
      - name: Run integration tests
        run: npm run test:integration
      - name: Build
        run: npm run build

  deploy-develop:
    needs: lint-and-test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: develop
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Develop
        run: echo "Deploying to develop environment"
        env:
          DEPLOYMENT_ENV: develop
          APP_NAME: {{APP_NAME}}

  deploy-staging:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Staging
        run: echo "Deploying to staging environment"
        env:
          DEPLOYMENT_ENV: staging
          APP_NAME: {{APP_NAME}}

  deploy-production:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Production
        run: echo "Deploying to production environment"
        env:
          DEPLOYMENT_ENV: production
          APP_NAME: {{APP_NAME}}
EOF
```

- [ ] **Step 3: Create Node.js Advanced level template**

```bash
cat > templates/ci-cd/github-actions/node-advanced.yml << 'EOF'
name: CI/CD Pipeline — Advanced

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-test-security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Lint code
        run: npm run lint
      - name: Run unit tests
        run: npm test -- --coverage
      - name: Run integration tests
        run: npm run test:integration
      - name: Security scan (npm audit)
        run: npm audit --audit-level=moderate
      - name: Build
        run: npm run build
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  performance-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run performance tests
        run: npm run test:performance
      - name: Archive performance results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: ./performance-report.json

  deploy-develop:
    needs: [lint-test-security, performance-test]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: develop
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Develop
        run: echo "Deploying to develop"
      - name: Send Slack Notification
        run: echo "Deployment to develop complete"

  deploy-staging:
    needs: [lint-test-security, performance-test]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Staging
        run: echo "Deploying to staging"
      - name: Health Check
        run: echo "Checking staging health"
      - name: Send Slack Notification
        run: echo "Deployment to staging complete"

  deploy-production:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      - name: Create Git tag
        run: git tag -a "release-$(date +%Y%m%d-%H%M%S)" -m "Production release"
      - name: Deploy to Production
        run: echo "Deploying to production"
      - name: Health Check
        run: echo "Checking production health"
      - name: Send Slack Notification
        run: echo "Deployment to production complete — {{APP_NAME}}"
EOF
```

- [ ] **Step 4: Verify files created**

```bash
ls -la templates/ci-cd/github-actions/ | grep node
```

Expected: 3 files (node-basic.yml, node-standard.yml, node-advanced.yml)

- [ ] **Step 5: Commit**

```bash
git add templates/ci-cd/github-actions/node-*.yml
git commit -m "feat: add github actions templates for node.js (basic, standard, advanced)"
```

---

## Task 3: Create GitHub Actions Templates — Python, Go, Java, .NET, Flutter

**Files:**
- Create: `templates/ci-cd/github-actions/{python,go,java,dotnet,flutter}-{basic,standard,advanced}.yml` (15 files)

Template content for all stacks — same structure as Node.js with stack-specific build commands.

- [ ] **Step 1: Create all Python, Go, Java, .NET, Flutter templates (basic, standard, advanced levels)**

For each stack, create 3 files with appropriate build/test commands:
- Python: `pip install`, `pytest`, `python setup.py build`
- Go: `go get`, `go test -v ./...`, `go build`
- Java: `mvn clean install`, `mvn test`, `mvn package`
- .NET: `dotnet restore`, `dotnet test`, `dotnet publish`
- Flutter: `flutter pub get`, `flutter test`, `flutter build apk`

Each template follows the same pattern as Node.js templates (basic → standard → advanced complexity).

- [ ] **Step 2: Verify all 21 GitHub Actions templates created**

```bash
ls templates/ci-cd/github-actions/ | wc -l
```

Expected: 21 files

- [ ] **Step 3: Commit**

```bash
git add templates/ci-cd/github-actions/
git commit -m "feat: add github actions ci-cd templates for all stacks (basic, standard, advanced)"
```

---

## Task 4: Create Azure Pipelines Templates (All Stacks × 3 Levels)

**Files:**
- Create: `templates/ci-cd/azure-pipelines/{node,python,go,java,dotnet,flutter}-{basic,standard,advanced}.yml` (21 files)

- [ ] **Step 1: Create all Azure Pipelines templates**

For each stack (Python, Go, Java, .NET, Flutter) at each level (basic, standard, advanced), create Azure Pipelines YAML with:
- Pool configuration
- Stage-based structure (Build, Deploy_Develop, Deploy_Staging, Deploy_Production)
- Stack-specific build/test commands
- Environment gates

- [ ] **Step 2: Verify all 21 Azure Pipelines templates created**

```bash
ls templates/ci-cd/azure-pipelines/ | wc -l
```

Expected: 21 files

- [ ] **Step 3: Commit**

```bash
git add templates/ci-cd/azure-pipelines/
git commit -m "feat: add azure pipelines ci-cd templates for all stacks (basic, standard, advanced)"
```

---

## Task 5: Create GitLab CI Templates (All Stacks × 3 Levels)

**Files:**
- Create: `templates/ci-cd/gitlab-ci/{node,python,go,java,dotnet,flutter}-{basic,standard,advanced}.yml` (21 files)

- [ ] **Step 1: Create all GitLab CI templates**

For each stack (Python, Go, Java, .NET, Flutter) at each level (basic, standard, advanced), create GitLab CI YAML with:
- Stages (build, deploy)
- Stack-specific build/test commands
- Deployment jobs (deploy_develop, deploy_staging, deploy_production)
- Only/when conditions for branch filtering

- [ ] **Step 2: Verify all 21 GitLab CI templates created**

```bash
ls templates/ci-cd/gitlab-ci/ | wc -l
```

Expected: 21 files

- [ ] **Step 3: Commit**

```bash
git add templates/ci-cd/gitlab-ci/
git commit -m "feat: add gitlab ci ci-cd templates for all stacks (basic, standard, advanced)"
```

---

## Task 6: Add STEP 5 to swp-scaffold.md

**Files:**
- Modify: `.claude/commands/swp-scaffold.md` — Add STEP 5 after existing steps

- [ ] **Step 1: Add STEP 5 — CI/CD Pipeline Setup section**

After the final STEP 4 in swp-scaffold.md, add:

```markdown
---

## STEP 5 — CI/CD Pipeline Setup

### STEP 5.0 — DEPLOYMENT configuration validation

Before generating pipeline files, read docs/SRS.md and locate the DEPLOYMENT section. Verify:

  DEPLOYMENT VALIDATION:
  Platform           : [from SRS DEPLOYMENT block — GitHub Actions / Azure Pipelines / GitLab CI]
  Pipeline level     : [from SRS DEPLOYMENT block — Basic / Standard / Advanced]
  Environments       : [from SRS environment strategy — develop, staging, production]
  
If any of these is missing from SRS:
  HARD STOP — "DEPLOYMENT INCOMPLETE in SRS. Run /sw-srs to define platform, pipeline level, and environments."

If DEPLOYMENT is complete, continue to STEP 5.1.

---

### STEP 5.1 — Platform detection & confirmation

Detected platform from SRS: [Platform]

Confirm this is correct:
  - "confirm" to proceed with [Platform]
  - "override: [platform]" to change to GitHub Actions / Azure Pipelines / GitLab CI

[STOP — wait for confirmation]

---

### STEP 5.2 — Pipeline level confirmation

Detected level from SRS: [Level] (Basic / Standard / Advanced)

Confirm this matches your deployment needs:
  - "confirm" to proceed with [Level]
  - "override: basic" / "override: standard" / "override: advanced" to change

[STOP — wait for confirmation]

---

### STEP 5.3 — Generate stack-specific pipeline files

Detected backend stack from STEP 0.5: [Stack]

Generating {{STACK}}-{{LEVEL}} pipeline configuration for {{PLATFORM}}:

```
[PLATFORM]-[STACK]-[LEVEL] pipeline generated:
- File: [output location]
- Build command: [stack-specific build]
- Test command: [stack-specific test]
- Deploy environments: develop → staging → production
- Validation: YAML syntax ✅
```

---

### STEP 5.4 — Generated pipeline summary

CI/CD PIPELINE CONFIGURATION
┌─────────────────────┬────────────────┐
│ Configuration       │ Value          │
├─────────────────────┼────────────────┤
│ Platform            │ [PLATFORM]     │
│ Pipeline Level      │ [LEVEL]        │
│ Backend Stack       │ [STACK]        │
│ Deployment Envs     │ develop → staging → production
│ Output File         │ [path/.yml]    │
│ Validation Status   │ ✅ Valid       │
└─────────────────────┴────────────────┘

Pipeline file created and ready to commit. Proceeding to build verification.
```

- [ ] **Step 2: Commit STEP 5 addition**

```bash
git add .claude/commands/swp-scaffold.md
git commit -m "feat(swp-scaffold): add STEP 5 ci/cd pipeline setup"
```

---

## Task 7: Create CI/CD Helper Documentation

**Files:**
- Create: `.claude/commands/ci-cd-helper.md`

- [ ] **Step 1: Create helper documentation file**

```bash
cat > .claude/commands/ci-cd-helper.md << 'EOF'
# CI/CD Pipeline Generation Helper

## Template Substitution Variables

When generating CI/CD pipeline files, the following variables are substituted:

| Variable | Source | Example |
|----------|--------|---------|
| `{{PLATFORM}}` | SRS DEPLOYMENT → ci-cd-platform | github-actions, azure-pipelines, gitlab-ci |
| `{{STACK}}` | SRS STACK CONFIRMED → Backend | node, python, go, java, dotnet, flutter |
| `{{LEVEL}}` | SRS DEPLOYMENT → pipeline-level | basic, standard, advanced |
| `{{APP_NAME}}` | SRS → Project Name | MyApp, ProjectName |
| `{{DEPLOY_ENV}}` | SRS environment strategy | develop, staging, production |

## Template Location Reference

Templates are organized by platform:

```
templates/ci-cd/
├── github-actions/     — GitHub Actions YAML files (.github/workflows/)
├── azure-pipelines/    — Azure Pipelines YAML files (root: azure-pipelines.yml)
└── gitlab-ci/          — GitLab CI YAML files (.gitlab-ci.yml)
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
- Three deployment stages (develop → staging → production)
- **Use for:** Production applications

### Advanced Level
- All Standard level tasks PLUS
- Security scanning (OWASP, gosec, bandit)
- Code coverage reporting (Codecov)
- Performance testing / benchmarking
- Notifications (Slack, email)
- Rollback procedures
- **Use for:** Enterprise, compliance-critical, mission-critical applications
EOF
```

- [ ] **Step 2: Verify helper documentation created**

```bash
ls -la .claude/commands/ci-cd-helper.md
```

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/ci-cd-helper.md
git commit -m "docs: add ci-cd pipeline generation helper reference"
```

---

## Task 8: Verify Full Implementation

**Files:**
- Verify: All 63 templates exist (21 GitHub Actions + 21 Azure Pipelines + 21 GitLab CI)
- Verify: STEP 5 added to swp-scaffold.md
- Verify: Helper documentation created

- [ ] **Step 1: Count all templates**

```bash
echo "GitHub Actions templates:" && ls templates/ci-cd/github-actions/ | wc -l
echo "Azure Pipelines templates:" && ls templates/ci-cd/azure-pipelines/ | wc -l
echo "GitLab CI templates:" && ls templates/ci-cd/gitlab-ci/ | wc -l
echo "Total:" && find templates/ci-cd -name "*.yml" | wc -l
```

Expected: 21, 21, 21, 63

- [ ] **Step 2: Verify STEP 5 content in swp-scaffold.md**

```bash
grep -n "## STEP 5" .claude/commands/swp-scaffold.md
```

Expected: Found with line number

- [ ] **Step 3: Verify helper documentation**

```bash
test -f .claude/commands/ci-cd-helper.md && echo "✅ Helper documentation exists"
```

- [ ] **Step 4: Final commit and summary**

```bash
git log --oneline -8
```

Expected: 8 recent commits related to CI/CD pipeline implementation

---

## Summary

✅ **Implementation Complete**

- 63 CI/CD pipeline templates created (7 stacks × 3 levels × 3 platforms)
- GitHub Actions support (21 templates)
- Azure Pipelines support (21 templates)
- GitLab CI support (21 templates)
- STEP 5 added to `/sw-scaffold` command
- Helper documentation created
- All changes committed to git
