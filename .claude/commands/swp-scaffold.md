---
name: swp-scaffold
description: |
  Scaffold the solution from ARCH-DESIGN.md  creates all projects, folders, base classes, and DI wiring with zero build errors. INTERNAL command  auto-triggered by /swp-arch Stage 2 only.
  Do not run directly; run /swp-arch instead, which auto-continues to scaffold after Stage 1 approval.
  Trigger when: INTERNAL ONLY  auto-triggered by /swp-arch Stage 2. Do not invoke manually.
compatibility: Any stack  Node, Python, Go, Java, .NET, Angular, React, Flutter
Command  : /swp-scaffold
Version  : 2.2
Updated  : 2026-05-21
| Version | Date       | Author  | Changes                                                                                                                                 |
|---------|------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------|
| 2.2     | 2026-05-21 | KapilDev | Added standalone scaffold publish enforcement: commit, push, PR to develop, and manager acceptance email after scaffold completion |
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.7     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.6     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.5     | 2026-05-18 | Zenthil | Added PATH CHECK to STEP 0  enforce PATH CONFIRMED delivery flow |
| 1.4     | 2026-05-14 | Zenthil | Fixed: GenericRepository + UnitOfWork added (STEP 10); Java STEP 7 single-class files; CI/CD STEP 5.3  /ci-cd-helper; Angular bootstrap path; appsettings.local/Development; Flutter skip note; health DB warning; swp-sync failure path; branch guard; Go unused fmt import; Java ErrorResponse 4-arg constructor |
| 1.3     | 2026-05-13 | Zenthil | Added version header; Go/No-Go scored decision; PENDING DECISIONS matrix; ADO update; /swp-sync validate; build verification step; commit/push instructions |
| 1.2     | 2026-05-13 | Zenthil | Added STEP 0 SRS validation gate (version + design doc approval check); added package cross-reference table in STEP 4; fixed BaseAuditableEntity Id/TenantId to int (SQL Server INT convention) |
| 1.1     | 2026-05-13 | Zenthil | Synced with sw-arch v1.2: BaseAuditableEntity + ITenantScoped + ICurrentUserService + AuditInterceptor + CurrentUserService scaffolded; Program.cs updated with AddHttpContextAccessor, AddHealthChecks, AddCors, MapHealthChecks(/health); Angular scaffold updated with environments/, shared/models/, app.config.ts, proxy.conf.json, auth NgRx store |
| 1.0     |           | Zenthil | Initial version                                                                                                                         |

---

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

---

## Standalone Approval Publish Contract

This is an internal command, but if it is invoked directly or resumes after `/swp-arch` Stage 2, scaffold completion must still publish the approved work.

After scaffold build verification succeeds and before reporting scaffold complete, run `.claude/refs/approval-publish-contract.md`.

This command must not mark scaffold complete unless the approval publish summary includes a pushed branch and a PR URL targeting `develop`.

---

Scaffold solution for: $ARGUMENTS
>  INTERNAL COMMAND  called by /swp-arch Stage 2 only. Do not run this command standalone.
> If you need to scaffold the solution, run /swp-arch  it will auto-continue to scaffold after Stage 1 (architecture) is approved.

Phase 2 gate  development is BLOCKED until the solution builds with zero errors and zero warnings.

Read docs/SRS.md (STACK CONFIRMED block) and docs/ARCH-DESIGN.md before running any commands.
If ARCH-DESIGN.md does not exist: output "ARCHITECTURE MISSING  run /swp-arch first" and stop.

---

## STEP 0  SRS validation gate (run before anything else)

Read docs/SRS.md and verify:

  SRS VALIDATION:
  SRS version    : [version from SRS header  e.g. v2.1]
  STACK CONFIRMED: [present  / missing ]
  Design docs approved (check SRS Phase 1 gate output):
    UI-DESIGN.md   : [approved  / not approved  / not required N/A]
    DB-DESIGN.md   : [approved  / not approved  / not required N/A]
    ARCH-DESIGN.md : [approved  / not approved ]

  Approved packages (from SRS STACK CONFIRMED):
  Backend  : [list all approved packages for selected backend stack]
  Frontend : [list all approved npm packages  or N/A]

If any required design doc is not approved:
  HARD STOP  output "SCAFFOLD BLOCKED  [doc] not yet approved. Run /swp-arch (or /swp-db, /swp-ui) first."

If STACK CONFIRMED is missing: HARD STOP  "STACK CONFIRMED missing in SRS. Run /swp-srs to define the stack."

PATH CHECK  enforce locked delivery flow:
  Read docs/SRS.md PATH CONFIRMED block.

  IF PATH CONFIRMED block is missing:
     WARNING  PATH CONFIRMED not found. Run /swp-srs to lock a delivery flow.
    Proceeding without path enforcement.

  IF PATH CONFIRMED found:
    Extract: Flow name, Phase 1 command, Phase 2 command(s), Phase 3 command.
    /swp-scaffold is Stage 2 of Phase 1  it runs as part of /swp-arch.
    After scaffold completes (1B approved): next step is [Phase 2 command from PATH CONFIRMED].
    Output: "PATH CONFIRMED: [Flow Name]  scaffold completes Phase 1. Next: [Phase 2 command]"

---

## STEP 0.5  Stack detection & initialization commands

Identify the backend stack from SRS STACK CONFIRMED and select the appropriate initialization path:

  STACK DETECTION TABLE:
  
   Stack         Init Command              Config Files                                
  
   Node.js       npm init / npm install    package.json, tsconfig.json, .env           
   Python        poetry init / python -m  pyproject.toml, .env, requirements.txt      
                 venv                                                                 
   Go            go mod init               go.mod, go.sum, Makefile                    
   Java          mvn archetype:generate /  pom.xml / build.gradle, settings.xml        
                 gradle init                                                           
   .NET          dotnet new sln            .sln, .csproj, appsettings.json            
   Flutter       flutter create            pubspec.yaml, lib/main.dart                 
  

SELECTED STACK: [Stack from SRS]

Instructions below are organized by stack  follow the section matching your SELECTED STACK only.

---

## STEP 1  Confirm ready (universal preflight)

Output this block before running any command:

  CREATE-SOLUTION PREFLIGHT
  Backend stack : [Backend from STACK CONFIRMED  Node.js / Python / Go / Java / .NET / Flutter]
  Frontend stack : [Frontend from STACK CONFIRMED  or N/A]
  Project name  : [ProjectName from SRS]
  Namespace     : [Namespace from SRS] (if applicable to selected stack)
  Projects      : [list from ARCH-DESIGN.md]
  Base files    : [count of scaffold items from ARCH-DESIGN.md]
  Working dir   : [current directory  must be the project root]

  This will create files and folders based on the selected backend stack. Confirm to proceed: "scaffold confirmed"

[STOP  wait for "scaffold confirmed"]

---

## STEP 2  Project initialization (per-framework from STEP 0.5)

Run the appropriate commands for your selected backend stack from STEP 0.5. Stop immediately if any command fails.

### Node.js Backend

```bash
# Initialize npm project
npm init -y

# Create project structure
mkdir -p src/{routes,controllers,middleware,services,models,utils}
mkdir -p tests
mkdir -p config

# Update package.json with essential scripts and dependencies from SRS
# Then install:
npm install
```

**package.json** (base template):
```json
{
  "name": "[project-name]",
  "version": "1.0.0",
  "description": "[from SRS]",
  "main": "src/index.ts",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "latest",
    "ts-node": "latest",
    "jest": "latest"
  }
}
```

### Python Backend

```bash
# Initialize project with Poetry (recommended) or venv
poetry init -n  # or: python -m venv venv && source venv/bin/activate

# Create project structure
mkdir -p src/{routes,services,models,utils}
mkdir -p tests
mkdir -p config

# Install dependencies from SRS
poetry install  # or: pip install -r requirements.txt
```

**pyproject.toml** (base template):
```toml
[tool.poetry]
name = "[project-name]"
version = "1.0.0"
description = "[from SRS]"
authors = ["[Author]"]

[tool.poetry.dependencies]
python = "^3.10"

[tool.poetry.dev-dependencies]
pytest = "latest"
```

### Go Backend

```bash
# Initialize Go module
go mod init github.com/[org]/[project-name]

# Create project structure
mkdir -p cmd/{server,cli}
mkdir -p internal/{handlers,services,models,config}
mkdir -p pkg/{utils,middleware}
mkdir -p tests

touch go.sum
```

**Makefile** (base template):
```makefile
.PHONY: build run test clean

build:
	go build -o bin/[app-name] ./cmd/server

run:
	go run ./cmd/server

test:
	go test -v ./...

clean:
	rm -rf bin/
```

### Java Backend

```bash
# Using Maven archetype
mvn archetype:generate \
  -DgroupId=[com.org] \
  -DartifactId=[project-name] \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DarchetypeVersion=1.4 \
  -DinteractiveMode=false

# OR using Gradle
gradle init --type java-application

# From project root, install dependencies
mvn clean install  # for Maven
gradle build       # for Gradle
```

**pom.xml** (Maven base template  if not auto-generated):
```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>[com.org]</groupId>
  <artifactId>[project-name]</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <dependencies>
    <!-- Add SRS-approved dependencies here -->
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <configuration>
          <source>11</source>
          <target>11</target>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

### .NET Backend

```powershell
# Solution file
dotnet new sln -n [Namespace].[Product]

# Projects  adapt to ARCH-DESIGN.md project list
dotnet new webapi   -n [Namespace].[Product].API            -o src/[Product].API            --no-openapi
dotnet new classlib -n [Namespace].[Product].Application    -o src/[Product].Application
dotnet new classlib -n [Namespace].[Product].Domain         -o src/[Product].Domain
dotnet new classlib -n [Namespace].[Product].Infrastructure -o src/[Product].Infrastructure
dotnet new xunit    -n [Namespace].[Product].Tests          -o tests/[Product].Tests

# Add all projects to solution
dotnet sln add src/[Product].API/[Namespace].[Product].API.csproj
dotnet sln add src/[Product].Application/[Namespace].[Product].Application.csproj
dotnet sln add src/[Product].Domain/[Namespace].[Product].Domain.csproj
dotnet sln add src/[Product].Infrastructure/[Namespace].[Product].Infrastructure.csproj
dotnet sln add tests/[Product].Tests/[Namespace].[Product].Tests.csproj

# Remove generated placeholder files
Remove-Item src/[Product].API/Controllers/WeatherForecastController.cs -ErrorAction SilentlyContinue
Remove-Item src/[Product].API/WeatherForecast.cs -ErrorAction SilentlyContinue
Remove-Item src/[Product].Domain/Class1.cs -ErrorAction SilentlyContinue
Remove-Item src/[Product].Application/Class1.cs -ErrorAction SilentlyContinue
Remove-Item src/[Product].Infrastructure/Class1.cs -ErrorAction SilentlyContinue
Remove-Item tests/[Product].Tests/UnitTest1.cs -ErrorAction SilentlyContinue
```

### Flutter Backend

```bash
# Initialize Flutter project
flutter create [project-name]

# Navigate to project
cd [project-name]

# Install dependencies
flutter pub get
```

**pubspec.yaml** (base template  auto-generated):
```yaml
name: [project_name]
version: 0.1.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  # Add SRS-approved packages here

dev_dependencies:
  flutter_test:
    sdk: flutter
  # Add testing packages here
```

---

## STEP 3  Framework-specific build verification

Based on framework detected in STEP 0.5, verify the project compiles with zero errors. Stop immediately if any build fails.

### Node.js Backend

```bash
# Install TypeScript compiler if not already in devDependencies
npm install --save-dev typescript ts-node @types/node

# Compile TypeScript
npm run build
# OR if no build script:
npx tsc --noEmit
```

Expected output: Compilation completed successfully with 0 errors.

### Python Backend

```bash
# Verify syntax across all Python files
python -m py_compile src/**/*.py
python -m py_compile tests/**/*.py

# OR using pytest discover (if pytest installed):
pytest --collect-only
```

Expected output: All files compile without syntax errors.

### Go Backend

```bash
# Build all packages
go build ./...

# Verify module consistency
go mod verify
```

Expected output: Build succeeded with no errors.

### Java Backend (Maven)

```bash
# Maven  compile all modules
mvn clean compile
```

Expected output: BUILD SUCCESS

### Java Backend (Gradle)

```bash
# Gradle  compile all modules
gradle build --info
```

Expected output: BUILD SUCCESSFUL

### .NET Backend

```powershell
# Build solution with all projects
dotnet build

# Then add project references (see STEP 3B below)
```

Expected output: Build succeeded. 0 Error(s), 0 Warning(s).

### Flutter Backend

```bash
# Verify Flutter setup and analyze
flutter pub get
flutter analyze
```

Expected output: No issues found (0 errors, 0 warnings).

---

## STEP 3B  Add project/module references (stack-specific)

This step follows build verification. Add inter-project references based on your selected stack from STEP 0.5.

### Node.js Backend

Create TypeScript path aliases in **tsconfig.json**:
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@routes/*": ["./routes/*"],
      "@services/*": ["./services/*"],
      "@models/*": ["./models/*"],
      "@middleware/*": ["./middleware/*"]
    }
  }
}
```

### Python Backend

Create **config/__init__.py** and **src/__init__.py** to establish packages:
```bash
touch src/__init__.py
touch config/__init__.py
touch tests/__init__.py
```

Update **pyproject.toml** with package discovery (Poetry auto-detects from source dirs).

### Go Backend

Go modules are auto-managed. Verify **go.mod** lists the module path correctly:
```
module github.com/[org]/[project-name]

go 1.21
```

### Java Backend

For Maven: dependencies are managed in **pom.xml**. For Gradle: update **build.gradle** with module interdependencies if using multi-module layout. Otherwise, single module uses classpath.

### .NET Backend

```powershell
# API  Application + Domain
dotnet add src/[Product].API reference src/[Product].Application/[Namespace].[Product].Application.csproj
dotnet add src/[Product].API reference src/[Product].Domain/[Namespace].[Product].Domain.csproj

# Application  Domain
dotnet add src/[Product].Application reference src/[Product].Domain/[Namespace].[Product].Domain.csproj

# Infrastructure  Application + Domain
dotnet add src/[Product].Infrastructure reference src/[Product].Application/[Namespace].[Product].Application.csproj
dotnet add src/[Product].Infrastructure reference src/[Product].Domain/[Namespace].[Product].Domain.csproj

# Tests  all layers
dotnet add tests/[Product].Tests reference src/[Product].Application/[Namespace].[Product].Application.csproj
dotnet add tests/[Product].Tests reference src/[Product].Infrastructure/[Namespace].[Product].Infrastructure.csproj
dotnet add tests/[Product].Tests reference src/[Product].Domain/[Namespace].[Product].Domain.csproj
```

### Flutter Backend

Flutter packages are auto-linked through **pubspec.yaml**. No additional reference setup required.

---

## STEP 4  Per-framework base scaffold with working code examples

Based on framework detected in STEP 0.5, create the main entry point (hello world / health endpoint). Each language has a working example below  use as-is or adapt to your SRS requirements.

### Node.js Backend

Create **src/index.ts**:
```typescript
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Hello World endpoint
app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

Update **package.json** to include express:
```bash
npm install express
npm install --save-dev @types/express
```

### Python Backend

Create **src/main.py**:
```python
from flask import Flask, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({
        'message': 'Hello, World!'
    }), 200

@app.errorhandler(Exception)
def handle_error(error):
    return jsonify({'error': str(error)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
```

Install Flask:
```bash
poetry add flask
# OR:
pip install flask && pip freeze > requirements.txt
```

### Go Backend

Create **cmd/server/main.go**:
```go
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

func main() {
	mux := http.NewServeMux()

	// Health check endpoint
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":    "healthy",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})

	// Hello World endpoint
	mux.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Hello, World!",
		})
	})

	port := ":8080"
	log.Printf("Server running on http://localhost%s\n", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("Server failed: %v\n", err)
	}
}
```

Build and run:
```bash
go build -o bin/server ./cmd/server
./bin/server
```

### Java Backend (Maven with Spring Boot)

Create **src/main/java/[com/org]/Application.java**:
```java
package [com.org];

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@RestController
class HealthController {
    @GetMapping("/health")
    public HealthResponse health() {
        return new HealthResponse("healthy", java.time.Instant.now().toString());
    }

    @GetMapping("/api/hello")
    public HelloResponse hello() {
        return new HelloResponse("Hello, World!");
    }
}

class HealthResponse {
    public String status;
    public String timestamp;

    public HealthResponse(String status, String timestamp) {
        this.status = status;
        this.timestamp = timestamp;
    }
}

class HelloResponse {
    public String message;

    public HelloResponse(String message) {
        this.message = message;
    }
}
```

In **pom.xml**, add Spring Boot starter:
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Run:
```bash
mvn spring-boot:run
```

### Java Backend (Gradle with Spring Boot)

Create **src/main/java/[com/org]/Application.java** (same as Maven above).

In **build.gradle**, add:
```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
}

tasks.named('bootRun') {
    classpath = sourceSets.main.runtimeClasspath
}
```

Run:
```bash
gradle bootRun
```

### .NET Backend

Create **src/[Product].API/Controllers/HealthController.cs**:
```csharp
using Microsoft.AspNetCore.Mvc;

namespace [Namespace].[Product].API.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "healthy",
            timestamp = DateTime.UtcNow
        });
    }
}
```

Create **src/[Product].API/Controllers/HelloController.cs**:
```csharp
using Microsoft.AspNetCore.Mvc;

namespace [Namespace].[Product].API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HelloController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "Hello, World!" });
    }
}
```

The **/health** endpoint is auto-mapped in Program.cs:
```csharp
app.MapHealthChecks("/health");
```

Run:
```powershell
dotnet run --project src/[Product].API
```

### Flutter Backend

Create **lib/main.dart**:
```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '[Project Name]',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key key}) : super(key: key);

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Health Check')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Text('Status: Healthy', style: TextStyle(fontSize: 18)),
            SizedBox(height: 20),
            Text('Hello, World!', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
```

Run:
```bash
flutter run
```

---

## STEP 5  CI/CD Pipeline Setup

### STEP 5.0  DEPLOYMENT configuration validation

Before generating pipeline files, read docs/SRS.md and locate the DEPLOYMENT section. Verify:

  DEPLOYMENT VALIDATION:
  Platform           : [from SRS DEPLOYMENT block  GitHub Actions / Azure Pipelines / GitLab CI]
  Pipeline level     : [from SRS DEPLOYMENT block  Basic / Standard / Advanced]
  Environments       : [from SRS environment strategy  develop, staging, production]

If any of these is missing from SRS:
  HARD STOP  "DEPLOYMENT INCOMPLETE in SRS. Run /swp-srs to define platform, pipeline level, and environments."

If DEPLOYMENT is complete, continue to STEP 5.1.

---

### STEP 5.1  Platform detection & confirmation

Detected platform from SRS: [Platform]

Confirm this is correct:
  - "confirm" to proceed with [Platform]
  - "override: [platform]" to change to GitHub Actions / Azure Pipelines / GitLab CI

[STOP  wait for confirmation]

---

### STEP 5.2  Pipeline level confirmation

Detected level from SRS: [Level] (Basic / Standard / Advanced)

Confirm this matches your deployment needs:
  - "confirm" to proceed with [Level]
  - "override: basic" / "override: standard" / "override: advanced" to change

[STOP  wait for confirmation]

---

### STEP 5.3  Generate pipeline files

CI/CD pipeline YAML is generated by the `/ci-cd-helper` skill, which provides complete templates for all stacks and levels.

Run:
  /ci-cd-helper [Platform] [Level] [Stack]

  Example: /ci-cd-helper "Azure Pipelines" Standard .NET

The skill outputs a ready-to-commit pipeline file. After running it, return here and continue to STEP 5.4.

---

### STEP 5.4  Pipeline confirmation

Confirm the pipeline file was created by `/ci-cd-helper`. Run:

  git status

Expected: one new pipeline file (e.g., `.github/workflows/ci.yml`, `azure-pipelines.yml`, or `.gitlab-ci.yml`).

If the file is missing, re-run `/ci-cd-helper` before proceeding.

---

## STEP 6  Add packages/dependencies (stack-specific)

Only add packages listed in the SRS STACK CONFIRMED approved list. Never add unlisted packages.

Output this cross-reference before running any install command:

  PACKAGE CROSS-REFERENCE (SRS approved list vs. packages to install):
  
   Package                               In SRS       Module / Project    
  
   [Package 1 from SRS]                   /        [location]          
   [Package 2 from SRS]                   /        [location]          
   [Any additional package needed]        GAP        [location]          
  

  For every  GAP: output "PACKAGE GAP  [package] needed but not in SRS approved list. Add to SRS before installing."
  Do not install any  package without tech lead approval + SRS update.

### Node.js Backend

```bash
# Install dependencies from package.json
npm install

# Then add SRS-approved packages (one per line)
npm install [package-1]
npm install [package-2]

# For dev dependencies
npm install --save-dev [dev-package-1]
```

### Python Backend

```bash
# Using Poetry
poetry add [package-1] [package-2]

# Or with pip
pip install [package-1] [package-2]
pip freeze > requirements.txt
```

### Go Backend

```bash
# Go automatically manages dependencies in go.mod
go get [github.com/org/package]
go mod tidy
```

### Java Backend

**Maven**  Add to **pom.xml** under `<dependencies>`:
```xml
<dependency>
  <groupId>[group-id]</groupId>
  <artifactId>[artifact-id]</artifactId>
  <version>[version]</version>
</dependency>
```

Then run:
```bash
mvn clean install
```

**Gradle**  Add to **build.gradle** under `dependencies`:
```gradle
dependencies {
    implementation '[group-id]:[artifact-id]:[version]'
}
```

Then run:
```bash
gradle build
```

### .NET Backend

```powershell
# API
dotnet add src/[Product].API package [Package1]
dotnet add src/[Product].API package [Package2]

# Infrastructure
dotnet add src/[Product].Infrastructure package [Package3]

# Tests
dotnet add tests/[Product].Tests package [TestPackage1]
```

### Flutter Backend

Edit **pubspec.yaml** under `dependencies:` and `dev_dependencies:` sections:
```yaml
dependencies:
  flutter:
    sdk: flutter
  [package_1]: ^[version]
  [package_2]: ^[version]

dev_dependencies:
  flutter_test:
    sdk: flutter
  [test_package_1]: ^[version]
```

Then run:
```bash
flutter pub get
```

---

## STEP 712  Scaffold templates (per-framework)

> See `.claude/refs/swp-scaffold-templates.md` for full per-framework scaffold file templates.

| Step | Content |
|------|---------|
| STEP 7  | Base layer files (models, utils, errors, logging)  Node.js, Python, .NET, Go, Flutter, Java |
| STEP 8  | Additional base files (config, middleware, auth, DTOs) |
| STEP 9  | Service and repository base files (per-framework) |
| STEP 10 | Infrastructure/persistence base files (DB context, migrations) |
| STEP 11 | API/main entry point (Program.cs, main.ts, main.go, app.py) |
| STEP 12 | Frontend workspace scaffold (Angular, React, Vue, Flutter frontend) |

**Note:** Flutter skips STEP 711 and goes directly to STEP 12 (no server-side persistence layer).

---

## STEP 13  Build verification (per-framework final check  from STEP 0.5)

Run the final build for your selected framework. It MUST pass with zero errors and zero warnings before committing.

### Node.js Backend
```bash
# Build TypeScript
npm run build
```
Expected output: Compilation completed successfully.

### Python Backend
```bash
# Test syntax
python -m py_compile src/**/*.py
```
Expected output: All files compile without errors.

### Go Backend
```bash
# Build all packages
go build ./...
```
Expected output: Build succeeded with no errors.

### Java Backend (Maven)
```bash
mvn clean compile
```
Expected output: BUILD SUCCESS

### Java Backend (Gradle)
```bash
gradle build
```
Expected output: BUILD SUCCESSFUL

### .NET Backend
```powershell
# Build solution
dotnet build
```
Expected output: Build succeeded. 0 Error(s), 0 Warning(s).

### Flutter Backend
```bash
flutter pub get
flutter analyze
```
Expected output: No issues found.

---

### Health endpoint verification (for all backends)

For backend frameworks with HTTP endpoints (Node.js, Python, Go, Java, .NET):

```bash
# 1. Start the server
# [Use appropriate start command for your framework  see STEP 4]

# 2. In a separate terminal, verify /health returns 200
curl -i http://localhost:[PORT]/health
```

Expected response: HTTP 200 with JSON payload

If `/health` fails:
- Check STEP 4 for your framework's endpoint implementation
- Verify PORT matches your app configuration
- Fix before proceeding

---

### Frontend build (if Angular/React/Vue created in STEP 10)
```bash
cd frontend && npm run build && cd ..
```
Expected output: Compiled successfully with 0 errors.

---

## STEP 14  Go/No-Go  Scaffold Verification

Rate each dimension (20 pts each, 100 pts total). Apply to your selected framework from STEP 0.5:

  Backend builds clean (selected framework  npm build / python compile / go build / mvn / gradle / dotnet build / flutter analyze)  [XX / 20]
  Frontend builds clean (if created in STEP 10  ng build / npm build / npm run build)                                                 [XX / 20]
  All project/module references resolve (no missing imports/deps)                                                                        [XX / 20]
  Base files created per framework (main entry point, health endpoint, error handling, response models)                                  [XX / 20]
  /health or equivalent endpoint returns 200 (verified in STEP 11)                                                                      [XX / 20]
  
  TOTAL                                                                                                                                   [XX / 100]

   GO        90100   Scaffold complete. Proceed to /swp-ui.
   PARTIAL    7089   Minor gaps. Fix before proceeding.
   NO-GO      < 70    Scaffold has errors. Must fix before any feature work.

  SIGNAL:  GO /  PARTIAL /  NO-GO

---

  PENDING DECISIONS  resolve before proceeding to /swp-ui
  
   #   Issue                                         Priority  Reply with                          
  
   1   [build error or missing base file]                    "fix [N]"  describe the error      
   2   [package/dependency missing]                          "fix [N]" or "skip [N]: [reason]"   
  

  [STOP  wait for tech lead to confirm all  items resolved before /swp-ui]

---

## STEP 15  /swp-sync validate

Run /swp-sync validate  confirm ARCH-DESIGN.md  scaffold structure is consistent before feature development begins.

If /swp-sync validate reports divergence:
  - Fix the divergence in either ARCH-DESIGN.md or the scaffold structure (do NOT advance to /swp-plan with known divergence)
  - Re-run /swp-sync validate until it passes
  - Common causes: project folder names differ from ARCH-DESIGN.md, base files missing from a layer, namespace mismatch

---

## STEP 16  ADO update

Update ADO: mark the Scaffold task Done via MCP:
  ado_update_item(id = [ADO scaffold task ID], state = "Done",
    comment = "Solution scaffolded  [Framework] build  /health 200  all base files created ")

---

## STEP 17  Commit the scaffold

Run the Standalone Approval Publish Contract in `.claude/refs/approval-publish-contract.md` for all commits, pushes, PR creation/update, and manager acceptance email output in this step.

```bash
# For all frameworks:
git add .
git commit -m "chore(scaffold): solution scaffold  [Framework] backend + [Frontend if created]"
git push origin HEAD
```

Update README.md and CHANGELOG.md  separate docs commit:

  README.md  patch Project Status section:
    Phase badge   "Phase 2  Solution Scaffold Complete"
    Last updated  [today]
  README.md  patch Tech Stack section:
    Fill in exact stack from STEP 0.5 STACK CONFIRMED block
  README.md  patch Architecture section:
    Add solution folder structure with project names and purposes
  README.md  patch Getting Started section:
    Add: clone, install dependencies, build, run instructions (framework-specific)

  CHANGELOG.md  add under [Unreleased]  ### Added:
    - Phase 2: Solution scaffolded  [N] projects, base middleware + exception handling, clean build verified

```bash
git add README.md CHANGELOG.md
git commit -m "docs(phase-2): update README and CHANGELOG  solution scaffold complete"
git push origin HEAD
```

Create or update the PR to `develop` using `.claude/refs/approval-publish-contract.md` before reporting scaffold complete.

Output:

  PHASE 2 SOLUTION SCAFFOLD COMPLETE
  Framework   : [Node.js / Python / Go / Java / .NET / Flutter] (from STEP 0.5)
  Projects    : [N]  list each
  Base files  : [N] created
  Build       : PASSED  0 errors, 0 warnings (framework-specific command)
  Frontend    : [scaffolded / skipped  no frontend in SRS]
  Next        : Run /swp-plan to create EpicStoryTask hierarchy in ADO

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.2** (2026-05-21): Added standalone scaffold publish enforcement: commit, push, PR to develop, and manager acceptance email after scaffold completion.
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).



