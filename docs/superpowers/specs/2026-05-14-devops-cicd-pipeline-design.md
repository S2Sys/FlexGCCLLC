# DevOps CI/CD Pipeline Integration into `/sw-scaffold` Command

**Date:** 2026-05-14  
**Status:** Design Specification  
**Scope:** Add STEP 5 to `/sw-scaffold` command for automated CI/CD pipeline generation

---

## Overview

Extend the existing `/sw-scaffold` command to automatically generate CI/CD pipeline configuration files as STEP 5 (after solution scaffolding). The new step will detect platform, pipeline level, and tech stack from SRS and ARCH-DESIGN, then generate stack-aware pipeline configurations for GitHub Actions, Azure Pipelines, or GitLab CI.

---

## Objectives

1. **Automate CI/CD Setup** — Eliminate manual pipeline configuration by generating platform-specific pipeline files during scaffolding
2. **Stack Awareness** — Generate stack-specific build/test/deploy commands (Node.js, Python, Go, Java, .NET, Flutter)
3. **Flexibility** — Support three pipeline levels (Basic, Standard, Advanced) with appropriate complexity per level
4. **Multi-Platform Support** — Support GitHub Actions, Azure Pipelines, GitLab CI with user selection
5. **Consistency** — Ensure generated pipelines follow SmartWorkz conventions and match deployment requirements

---

## Requirements

### Functional Requirements

1. **SRS Validation (Pre-Step)**
   - Read DEPLOYMENT section from SRS for: CI/CD platform, deployment environments, pipeline level
   - If incomplete, prompt user to confirm choices

2. **Platform Detection & Confirmation**
   - Detect platform from SRS DEPLOYMENT block
   - Allow user to override if needed
   - Supported platforms: GitHub Actions, Azure Pipelines, GitLab CI

3. **Pipeline Level Selection**
   - **Basic:** Build → Test → Deploy (single environment)
   - **Standard:** Build → Lint → Unit Tests → Integration Tests → Deploy (Develop/Staging/Production)
   - **Advanced:** + Security Scans, Code Coverage, Performance Testing, Notifications, Rollback

4. **Stack-Specific Configuration**
   - Generate stack-specific build/test/deploy steps:
     - **Node.js:** `npm install` → `npm test` → `npm build` → `npm start` (or equivalent)
     - **Python:** `pip install` → `pytest` → `python setup.py build`
     - **Go:** `go get` → `go test` → `go build`
     - **Java:** `mvn clean install` → `mvn test` → `mvn package` (Maven) OR `gradle build` (Gradle)
     - **.NET:** `dotnet build` → `dotnet test` → `dotnet publish`
     - **Flutter:** `flutter pub get` → `flutter test` → `flutter build` (apk/ipa)

5. **File Generation**
   - Create platform-specific pipeline files in correct locations:
     - **GitHub Actions:** `.github/workflows/ci-cd.yml`
     - **Azure Pipelines:** `azure-pipelines.yml`
     - **GitLab CI:** `.gitlab-ci.yml`

6. **Validation & Summary**
   - Verify generated files are syntactically valid (YAML/JSON validation)
   - Output configuration summary table before commit

---

## Architecture & Data Flow

### Dependencies

- **Input from SRS:** `DEPLOYMENT` section (now required in STEP 1 of `/sw-srs`) containing:
  - `ci-cd-platform` (GitHub Actions / Azure Pipelines / GitLab CI) — **updated in swp-srs.md**
  - `pipeline-level` (Basic / Standard / Advanced) — **added to swp-srs.md operational stack**
  - `deployment-environments` (develop, staging, production) — **from SRS environment strategy**
  
- **Input from ARCH-DESIGN.md:** Backend stack type (detected in STEP 0.5)

- **Input from SRS STACK CONFIRMED:** Backend framework/language

### Process Flow

```
STEP 5: CI/CD Pipeline Setup
├─ STEP 5.0: Validate deployment config from SRS
│  ├─ Read DEPLOYMENT section
│  ├─ Check platform is defined
│  ├─ Check pipeline level is defined
│  └─ Check deployment environments are defined
├─ STEP 5.1: Platform Detection & Confirmation
│  ├─ Display detected platform from SRS
│  ├─ Allow user override
│  └─ Confirm final platform choice
├─ STEP 5.2: Select/Confirm Pipeline Level
│  ├─ Display detected level from SRS
│  ├─ Present level descriptions
│  └─ Confirm or override level
├─ STEP 5.3: Generate Stack-Specific Configuration
│  ├─ Identify backend stack from STEP 0.5 detection
│  ├─ Generate platform-specific template with stack commands
│  └─ Write to correct file location
├─ STEP 5.4: Validation & Summary
│  ├─ Validate YAML/JSON syntax
│  ├─ Output configuration summary table
│  ├─ List generated files
│  └─ Confirm before proceeding to build verification
└─ [Proceed to existing build verification step]
```

---

## Configuration Tables

### Platform × Stack Matrix

| Backend Stack | GitHub Actions | Azure Pipelines | GitLab CI | Status |
|---------------|----------------|-----------------|-----------|--------|
| Node.js       | ✅             | ✅              | ✅        | Full   |
| Python        | ✅             | ✅              | ✅        | Full   |
| Go            | ✅             | ✅              | ✅        | Full   |
| Java (Maven)  | ✅             | ✅              | ✅        | Full   |
| Java (Gradle) | ✅             | ✅              | ✅        | Full   |
| .NET          | ✅             | ✅              | ✅        | Full   |
| Flutter       | ✅             | ✅              | ✅        | Full   |

### Pipeline Level × Stages

| Level     | Stages                                                 | Use Case |
|-----------|--------------------------------------------------------|----------|
| Basic     | Build → Test → Deploy (1 env)                        | Simple projects, MVP |
| Standard  | Build → Lint → Unit Tests → Integration → Deploy to Develop/Staging/Production | Production apps |
| Advanced  | + Security Scans + Coverage + Performance + Notifications + Rollback (all envs) | Enterprise, compliance |

---

## Generated File Examples

### Node.js + GitHub Actions (Basic Level)

```yaml
# .github/workflows/ci-cd.yml
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
      - name: Deploy
        run: npm start
        env:
          NODE_ENV: production
```

### .NET + Azure Pipelines (Standard Level)

```yaml
# azure-pipelines.yml
trigger:
  - main
  - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  buildConfiguration: 'Release'

stages:
  - stage: Build
    jobs:
      - job: BuildJob
        steps:
          - task: DotNetCoreCLI@2
            inputs:
              command: 'build'
              arguments: '--configuration $(buildConfiguration)'
          - task: DotNetCoreCLI@2
            inputs:
              command: 'test'
              arguments: '--configuration $(buildConfiguration)'
          - task: DotNetCoreCLI@2
            inputs:
              command: 'publish'
              arguments: '-c $(buildConfiguration) -o $(Build.ArtifactStagingDirectory)'
  - stage: Deploy_Develop
    dependsOn: Build
    jobs:
      - deployment: DeployDevelop
        environment: 'develop'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureAppServiceDeploy@0
                  inputs:
                    azureSubscription: '$(azureSubscription)'
                    appName: '$(appNameDevelop)'
  - stage: Deploy_Staging
    dependsOn: Deploy_Develop
    jobs:
      - deployment: DeployStaging
        environment: 'staging'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureAppServiceDeploy@0
                  inputs:
                    azureSubscription: '$(azureSubscription)'
                    appName: '$(appNameStaging)'
  - stage: Deploy_Production
    dependsOn: Deploy_Staging
    jobs:
      - deployment: DeployProduction
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureAppServiceDeploy@0
                  inputs:
                    azureSubscription: '$(azureSubscription)'
                    appName: '$(appNameProduction)'
```

---

## Integration Points

### Before STEP 5
- STEP 0: SRS validation (must have DEPLOYMENT section)
- STEP 0.5: Stack detection (backend stack must be identified)
- STEPS 1-4: Solution scaffolding (all source files created)

### After STEP 5
- Existing build verification step (run build command to verify zero errors)
- Commit/push instructions (include newly generated pipeline files)

### Dependency on SRS Structure
- SRS must contain `DEPLOYMENT` block with:
  - `platform: [github-actions|azure-pipelines|gitlab-ci]`
  - `level: [basic|standard|advanced]`
  - `environments: [list of deployment targets]`

---

## Error Handling & Validation

### Pre-Generation Validation
- ❌ STOP if STACK CONFIRMED is missing from SRS
- ❌ STOP if DEPLOYMENT section is missing from SRS
- ⚠️ WARN if platform is not one of supported platforms; ask user to choose

### Post-Generation Validation
- Validate YAML syntax (for GitHub Actions, GitLab CI)
- Validate JSON/YAML syntax (for Azure Pipelines)
- Check file permissions (pipeline files should be readable/writable)
- Display validation results before proceeding

### User Confirmation Gate
- Prompt: "CI/CD pipeline configuration ready. Review the table above. Proceed with build verification? (yes/no)"
- If no: allow user to review generated files before proceeding

---

## Success Criteria

✅ SRS includes DEPLOYMENT block with platform, level, environments  
✅ Generated pipeline files are syntactically valid (no YAML/JSON errors)  
✅ Stack-specific build/test/deploy commands match detected stack  
✅ Files created in correct locations (`.github/`, root, `.gitlab/`)  
✅ Pipeline level complexity matches user selection (Basic/Standard/Advanced)  
✅ Command builds with zero errors and zero warnings after generation  
✅ Generated files are committed to version control  

---

## Testing Strategy

### Unit-Level Testing
- Test each stack × platform × level combination
- Verify YAML/JSON syntax for each generated file
- Validate template substitution (stack commands, environment variables)

### Integration Testing
- Test full STEP 5 flow (SRS read → platform confirm → generation → validation)
- Test with real SRS files from existing projects
- Verify generated pipelines can be committed and pushed

### Edge Cases
- SRS DEPLOYMENT section missing (fallback to user prompt)
- Unsupported stack + platform combination (graceful error message)
- User overrides platform choice (ensure override takes effect)
- Malformed deployment configuration in SRS (validation error)

---

## Scope Boundaries

### IN SCOPE
- Generate pipeline configuration files from templates
- Support 3 platforms × 7 stacks × 3 levels = 63 template combinations
- SRS-driven configuration (read from DEPLOYMENT block)
- Stack-aware command generation
- Validation and summary output

### OUT OF SCOPE
- Running the pipeline (users run locally or via platform)
- Creating/configuring cloud resources (App Service, Container Registry, etc.)
- Configuring secrets/credentials (user responsibility)
- Pipeline monitoring/debugging UI
- Rollback automation (Advanced level includes capability, not full implementation)

---

## Implementation Notes

- Create template directory: `templates/ci-cd/` with organized structure:
  - `templates/ci-cd/github-actions/` (3 templates per stack)
  - `templates/ci-cd/azure-pipelines/` (3 templates per stack)
  - `templates/ci-cd/gitlab-ci/` (3 templates per stack)

- Use placeholder syntax for stack-specific substitution:
  - `{{BACKEND_STACK}}` → detected stack name
  - `{{APP_NAME}}` → project name from SRS
  - `{{DEPLOYMENT_ENVS}}` → comma-separated environments

- Maintain consistency with existing `/sw-scaffold` step structure and naming conventions

---

## Open Questions / Decisions

None at this time. Specification is complete and ready for implementation planning.
