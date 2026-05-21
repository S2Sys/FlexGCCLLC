---
name: swd-unit-test
description: |
  Write unit tests for a class, method, or layer using the project's test framework from SRS.md. Covers all SRS Acceptance Criteria with AC-referenced test branches.
  Normally run inside /swd-next automatically. Use directly to backfill missing tests, test a method in isolation, or write tests for a hotfix outside a normal dev session.
  Trigger when: backfilling missing tests, testing a method in isolation, writing tests for a hotfix, or running /swd-unit-test.
compatibility: Any stack  reads test framework from docs/SRS.md
Command  : /swd-unit-test
Version  : 2.1
Updated  : 2026-05-21
| Version | Date       | Author  | Changes                                                                                                                                                              |
|---------|------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.6     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.5     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.4     | 2026-05-13 | Zenthil | Added Go/No-Go test coverage acceptance gate; PENDING DECISIONS matrix for AC coverage gaps and mock violations                                                     |
| 1.3     | 2026-05-13 | Zenthil | Renamed from /swd-unit-test  /swd-unit-test to distinguish automated unit tests from manual testing (now in /swp-audit STEP 6)                                        |
| 1.2     | 2026-05-13 | Zenthil | STEP 1: added SRS AC extraction + AC coverage check; STEP 2: branch list must include at least one branch per SRS AC; test naming must include AC reference (AC1_, AC2_); added SRS AC coverage table in STEP 4 |
| 1.1     | 2026-05-13 | Zenthil | Added version header; ICurrentUserService mock in Service template; BaseAuditableEntity test cases (soft-delete, tenant isolation, audit fields); SignalR service test template |
| 1.0     |           | Zenthil | Initial version                                                                                                                                                      |

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

Write unit tests for: $ARGUMENTS

> **Note:** Unit tests are now written automatically inside /swd-next (STEP 6) after every
> production file. Run /swd-unit-test directly only when you need to add tests outside the normal
> build session  e.g. backfilling missing tests, testing a method in isolation, or writing
> tests for a hotfix without opening a full /swd-start session.
>
> For manual/exploratory testing guidance, see /swp-audit STEP 6  Manual Testing Checklist.

Read docs/SRS.md in full before writing a single line:
  - STACK CONFIRMED (Tests field)  determines test framework, location, naming
  - All ACs for the current story  these drive the mandatory test branches

Read CONTEXT.md to identify the story, layer, and method(s) under test.

---

## STEP 0.5  Test framework detection

Before writing tests, identify your tech stack and the corresponding test framework, assertion library, and mocking strategy.

**FRAMEWORK DETECTION TABLE**

| Backend | Test Framework | Primary Language | Assertion Library | Mock Library | Example Test Name |
|---------|---|---|---|---|---|
| **Node.js** | Jest | JavaScript/TypeScript | expect() | jest.mock() / jest.spyOn() | test('should create user with valid input', () => {}) |
| **Python** | pytest | Python | assert / pytest assertions | pytest-mock, unittest.mock | def test_create_user_with_valid_input() |
| **Go** | testing + testify | Go | testify/assert, testify/require | github.com/golang/mock | func TestCreateUserWithValidInput(t *testing.T) |
| **Java** | JUnit5 | Java | AssertJ, Hamcrest | Mockito | void createUserWithValidInput() @Test |
| **.NET** | xUnit | C# | FluentAssertions, Assert | Moq | public async Task CreateUserWithValidInput() |
| **Flutter** | flutter_test | Dart | expect() | mockito, mocktail | testWidgets('should create user with valid input', ...) |
| **React** | Jest + @testing-library | JavaScript/TypeScript | expect() | jest.mock(), jest.spyOn() | test('should display user when loaded', () => {}) |

**Selection rule:** Match the backend stack from SRS.md (Tests field) to determine your framework. If multiple frameworks apply (e.g., both Node.js and React), write tests for each layer separately.

---

## STEP 1  Identify target + SRS AC extraction

Output:

  TEST TARGET:
  Class    : [ClassName]
  Method   : [MethodName]
  Layer    : [Repository / Service / Endpoint / Component / Frontend Service]
  Story    : [ADO Story ID from CONTEXT.md]
  SRS Sect : [N.N  section in SRS.md that defines this story]
  Test file: [path from SRS stack  see STEP 2 for location rules]

  SRS AC COVERAGE REQUIREMENT:
  Every AC in the story must have at least one test branch in STEP 2.
  
   AC #  AC text (from SRS.md)                              Mandatory test branch needed          
  
   AC1   [full AC text]                                     [describe the happy-path test needed] 
   AC2   [full AC text]                                     [describe the error-path test needed] 
   AC3   [full AC text]                                     [describe the boundary test needed]   
  

  AC coverage rule: tech lead may add extra branches but CANNOT remove mandatory AC branches.
  If an AC cannot be tested at this layer, note it: "AC[N]  tested at [other layer]."

---

## STEP 2  Output BRANCH LIST

From the method's business logic, SRS pseudo code, and STEP 1 AC table, list every testable branch.

  BRANCH LIST  [ClassName.MethodName]
  [AC1  mandatory] 1. [happy path condition covering AC1]  [expected result]
  [AC2  mandatory] 2. [error path condition covering AC2]  [expected result]
  [AC3  mandatory] 3. [boundary/state condition covering AC3]  [expected result]
  [extra]           4. [additional branch from business logic]  [expected result]
  ...

### Per-framework test code examples

**Node.js/Jest example**  AC1 and AC2 branches with mocking
```typescript
describe('UserService.getUser', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
    } as any;
    service = new UserService(mockRepository);
  });

  it('AC1_should_return_user_when_exists', async () => {
    // Arrange
    const expectedUser = { id: 1, name: 'John' };
    mockRepository.findById.mockResolvedValue(expectedUser);

    // Act
    const result = await service.getUser(1);

    // Assert
    expect(result).toEqual(expectedUser);
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
  });

  it('AC2_should_throw_when_user_not_found', async () => {
    // Arrange
    mockRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(service.getUser(1)).rejects.toThrow('User not found');
  });
});
```

**Python/pytest example**  AC1 and AC2 branches with fixtures
```python
import pytest
from unittest.mock import Mock

class TestUserService:
  @pytest.fixture
  def mock_repository(self):
    return Mock()

  @pytest.fixture
  def service(self, mock_repository):
    from user_service import UserService
    return UserService(mock_repository)

  def test_ac1_should_return_user_when_exists(self, service, mock_repository):
    # Arrange
    expected_user = {'id': 1, 'name': 'John'}
    mock_repository.find_by_id.return_value = expected_user

    # Act
    result = service.get_user(1)

    # Assert
    assert result == expected_user
    mock_repository.find_by_id.assert_called_once_with(1)

  def test_ac2_should_raise_when_user_not_found(self, service, mock_repository):
    # Arrange
    mock_repository.find_by_id.return_value = None

    # Act & Assert
    with pytest.raises(Exception) as exc_info:
      service.get_user(1)
    assert 'User not found' in str(exc_info.value)
```

**Go example**  AC1 and AC2 branches with table-driven tests
```go
func TestGetUser(t *testing.T) {
  tests := []struct {
    name    string
    userId  int
    setup   func(*MockRepository)
    want    *User
    wantErr bool
  }{
    {
      name:   "AC1_returns_user_when_exists",
      userId: 1,
      setup: func(m *MockRepository) {
        m.On("FindByID", 1).Return(&User{ID: 1, Name: "John"}, nil)
      },
      want:    &User{ID: 1, Name: "John"},
      wantErr: false,
    },
    {
      name:   "AC2_throws_error_when_user_not_found",
      userId: 1,
      setup: func(m *MockRepository) {
        m.On("FindByID", 1).Return(nil, errors.New("user not found"))
      },
      want:    nil,
      wantErr: true,
    },
  }

  for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
      mockRepo := new(MockRepository)
      tt.setup(mockRepo)
      service := NewUserService(mockRepo)

      got, err := service.GetUser(context.Background(), tt.userId)

      if (err != nil) != tt.wantErr {
        t.Fatalf("wantErr %v, got %v", tt.wantErr, err)
      }
      if !tt.wantErr && !reflect.DeepEqual(got, tt.want) {
        t.Fatalf("want %v, got %v", tt.want, got)
      }
    })
  }
}
```

**Java/JUnit example**  AC1 and AC2 branches with Mockito
```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTests {
  private UserService service;
  private UserRepository mockRepository;

  @BeforeEach
  void setUp() {
    mockRepository = mock(UserRepository.class);
    service = new UserService(mockRepository);
  }

  @Test
  @DisplayName("AC1: should return user when exists")
  void testAC1ReturnsUserWhenExists() {
    // Arrange
    User expectedUser = new User(1, "John");
    when(mockRepository.findById(1)).thenReturn(Optional.of(expectedUser));

    // Act
    User result = service.getUser(1);

    // Assert
    assertThat(result).isNotNull().extracting(User::getId, User::getName)
      .containsExactly(1, "John");
    verify(mockRepository).findById(1);
  }

  @Test
  @DisplayName("AC2: should throw when user not found")
  void testAC2ThrowsWhenUserNotFound() {
    // Arrange
    when(mockRepository.findById(1)).thenReturn(Optional.empty());

    // Act & Assert
    assertThatThrownBy(() -> service.getUser(1))
      .isInstanceOf(UserNotFoundException.class)
      .hasMessage("User not found");
  }
}
```

**.NET/xUnit example**  AC1 and AC2 branches with Moq
```csharp
using Xunit;
using FluentAssertions;
using Moq;

public class UserServiceTests
{
  [Fact]
  public async Task AC1_GetUser_WithValidId_ReturnsUser()
  {
    // Arrange
    var mockRepo = new Mock<IUserRepository>();
    var expectedUser = new User { Id = 1, Name = "John" };
    mockRepo
      .Setup(r => r.FindByIdAsync(1))
      .ReturnsAsync(expectedUser);

    var service = new UserService(mockRepo.Object);

    // Act
    var result = await service.GetUserAsync(1);

    // Assert
    result.Should().NotBeNull();
    result.Id.Should().Be(1);
    result.Name.Should().Be("John");
    mockRepo.Verify(r => r.FindByIdAsync(1), Times.Once);
  }

  [Fact]
  public async Task AC2_GetUser_WithNonExistentId_ThrowsException()
  {
    // Arrange
    var mockRepo = new Mock<IUserRepository>();
    mockRepo
      .Setup(r => r.FindByIdAsync(1))
      .ReturnsAsync((User)null);

    var service = new UserService(mockRepo.Object);

    // Act & Assert
    await FluentActions.Invoking(() => service.GetUserAsync(1))
      .Should()
      .ThrowAsync<UserNotFoundException>()
      .WithMessage("User not found");
  }
}
```

**Flutter/flutter_test example**  AC1 and AC2 branches with mockito
```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:your_app/services/user_service.dart';
import 'package:your_app/models/user.dart';

class MockUserRepository extends Mock implements UserRepository {}

void main() {
  group('UserService.getUser', () {
    late MockUserRepository mockRepository;
    late UserService service;

    setUp(() {
      mockRepository = MockUserRepository();
      service = UserService(mockRepository);
    });

    test('AC1_should_return_user_when_exists', () async {
      // Arrange
      final expectedUser = User(id: 1, name: 'John');
      when(mockRepository.findById(1))
        .thenAnswer((_) async => expectedUser);

      // Act
      final result = await service.getUser(1);

      // Assert
      expect(result, equals(expectedUser));
      expect(result.id, equals(1));
      verify(mockRepository.findById(1)).called(1);
    });

    test('AC2_should_throw_when_user_not_found', () async {
      // Arrange
      when(mockRepository.findById(1))
        .thenAnswer((_) async => null);

      // Act & Assert
      expect(
        () => service.getUser(1),
        throwsA(isA<UserNotFoundException>()),
      );
    });
  });
}
```

### Test naming conventions by framework

Follow these naming patterns to match framework idioms:

**JavaScript/TypeScript (Jest, React)**  camelCase with describe/it syntax
```javascript
describe('CreateUser', () => {
  it('AC1_should create user with valid input', () => { ... });
  it('AC2_should throw when email is duplicate', () => { ... });
});
```

**Python (pytest)**  snake_case with function names
```python
def test_ac1_create_user_with_valid_input():
  ...
def test_ac2_create_user_throws_on_duplicate_email():
  ...
```

**Go (testing)**  PascalCase with t.Run subtests
```go
func TestCreateUser(t *testing.T) {
  t.Run("AC1_ValidInput_ReturnsCreatedUser", func(t *testing.T) { ... })
  t.Run("AC2_DuplicateEmail_ThrowsError", func(t *testing.T) { ... })
}
```

**Java (JUnit5)**  camelCase with @DisplayName for AC reference
```java
@Test
@DisplayName("AC1: should create user with valid input")
void createUserWithValidInput() { ... }

@Test
@DisplayName("AC2: should throw when email is duplicate")
void createUserThrowsOnDuplicateEmail() { ... }
```

**.NET (xUnit)**  PascalCase (Fact/Theory methods)
```csharp
[Fact]
public async Task AC1_CreateUserWithValidInput_ReturnsCreatedUser() { ... }

[Fact]
public async Task AC2_CreateUserWithDuplicateEmail_ThrowsBusinessRuleException() { ... }
```

**Flutter (flutter_test)**  descriptive string with group/test
```dart
group('CreateUser', () {
  test('AC1: should create user with valid input', () async { ... });
  test('AC2: should throw when email is duplicate', () async { ... });
});
```

[STOP  wait for tech lead to select branches and describe test cases in plain English.
Tech lead MUST keep all mandatory AC branches. Only implementation details may be adjusted.
NEVER invent test cases. Only implement what the tech lead specifies.]

---

## STEP 3  Write tests

ENFORCE 10 rules (no exceptions):
  - Mock ALL external dependencies  DB, HTTP, file system, time
  - No real DB calls, no real HTTP, no docker-compose, no file system
  - Arrange / Act / Assert  one assertion per test method
  - Naming: [Method]_[Condition]_[ExpectedResult]

Test file location (adapt to SRS stack):
  .NET    : Tests/[Layer]/[ClassName]Tests.cs
  Node.js : src/__tests__/[name].test.js or src/[name].test.ts
  Python  : tests/[layer]/test_[name].py
  Go      : [package]/[name]_test.go
  Java    : src/test/java/[package]/[ClassName]Tests.java
  Flutter : test/[layer]/[name]_test.dart
  React   : src/[component].test.tsx or src/__tests__/[component].test.tsx

### Framework-specific test templates

> See `.claude/refs/swd-unit-test-templates.md`  Jest (JS/TS), Moq (.NET/xUnit), pytest (Python), Go testing, Dart/Flutter, and React Testing Library patterns with full mock/arrange/act/assert examples.

---

Stop after writing the test file.
Output: "Run: [test command from SRS stack]  confirm all green."
Wait for test confirmation before STEP 4.

---

## STEP 4  After tests confirmed green

## Go/No-Go  Test Coverage Acceptance

Rate each dimension (20 pts each, 100 pts total):

  All selected branches implemented and passing                     [XX / 20]
  Every mandatory AC branch present (no AC left uncovered)         [XX / 20]
  Test naming format followed (AC[N]_[Method]_[Condition]_Result)  [XX / 20]
  All external dependencies mocked (no real DB/HTTP/filesystem)    [XX / 20]
  Build passes after test file added (0 errors)                    [XX / 20]
  
  TOTAL                                                             [XX / 100]

   GO      80100   Tests accepted. Run /swd-submit to commit this subtask.
   PARTIAL 6079    Fix gaps below, re-run tests, then /swd-submit.
   NO-GO   < 60     Missing AC coverage or test failures. Fix before committing.

  SIGNAL:  GO /  PARTIAL /  NO-GO

  PENDING DECISIONS  resolve before /swd-submit
  
   #   Issue                                                 Priority  Reply with                           
  
   1   AC[N] has no covering test branch                            "add branch: AC[N] [description]"    
   2   Test uses real DB/HTTP (no mock)                              "fix [test name]: mock [dependency]" 
   3   Naming format not followed  [test name]                     "rename: [new name]"                 
  

  [STOP  resolve all  items. /swd-submit is blocked until  GO.]

### Per-framework test naming conventions

**Consistent test naming across frameworks:**

| Framework | Test Method Format | Fixture/Setup | Mock Syntax | Assertion Syntax | Example |
|---|---|---|---|---|---|
| **Jest (Node.js)** | `it('AC{N}_{description}', ...)` or `test('AC{N}...')` | `beforeEach()` + `jest.clearAllMocks()` | `jest.fn().mockResolvedValue()` | `expect().toBe()` | `it('AC1_returns_user_when_exists', ...)` |
| **pytest (Python)** | `test_ac{n}_{description}()` | `@pytest.fixture` | `Mock().return_value` or `AsyncMock()` | `assert` statement | `def test_ac1_returns_user_when_exists():` |
| **Go (testing)** | `TestAC{N}{Description}()` with `t.Run()` | `ctrl := gomock.NewController(t)` | `mockRepo.EXPECT().Method(...).Return(...)` | `assert.Equal()` | `t.Run("AC1_ReturnsUserWhenExists", ...)` |
| **JUnit5 (Java)** | `testAC{N}{Description}()` + `@DisplayName("AC{N}:")` | `@BeforeEach` | `when(...).thenReturn()` or `Mockito.mock()` | `assertThat().isEqualTo()` | `void testAC1ReturnsUserWhenExists()` |
| **xUnit (.NET)** | `AC{N}_{Description}_{Result}()` + `[Fact]` | Constructor or property injection | `new Mock<IService>().Setup(...)` | `.Should().Be()` | `public async Task AC1_ReturnsUserWhenExists()` |
| **flutter_test (Dart)** | `test('AC{N}: {description}', ...)` or `group()` | `setUp()` + `tearDown()` | `MockClass extends Mock implements Real` | `expect().equals()` | `test('AC1: returns user when exists', ...)` |

**Naming conventions in detail:**

**Jest/Node.js:**
```typescript
describe('CreateUser', () => {
  //  Correct: AC reference in test name
  it('AC1_should_create_user_with_valid_input', () => { });
  it('AC2_should_throw_when_email_duplicate', () => { });
  it('AC3_should_assign_correct_tenant', () => { });
});
```

**pytest/Python:**
```python
class TestCreateUser:
    #  Correct: test_ac{N}_ prefix, snake_case
    def test_ac1_should_create_user_with_valid_input(self):
        pass
    def test_ac2_should_throw_when_email_duplicate(self):
        pass
    def test_ac3_should_assign_correct_tenant(self):
        pass
```

**Go/testing:**
```go
func TestCreateUser(t *testing.T) {
    //  Correct: AC{N}_ in t.Run subtest name
    t.Run("AC1_ValidInput_ReturnsCreatedUser", func(t *testing.T) { })
    t.Run("AC2_DuplicateEmail_ThrowsError", func(t *testing.T) { })
    t.Run("AC3_CorrectTenant_AssignedOnCreate", func(t *testing.T) { })
}
```

**JUnit5/Java:**
```java
class CreateUserTests {
    //  Correct: testAC{N} method name + @DisplayName
    @Test
    @DisplayName("AC1: should create user with valid input")
    void testAC1CreatesUserWithValidInput() { }

    @Test
    @DisplayName("AC2: should throw when email duplicate")
    void testAC2ThrowsWhenEmailDuplicate() { }

    @Test
    @DisplayName("AC3: should assign correct tenant")
    void testAC3AssignsCorrectTenant() { }
}
```

**xUnit/.NET:**
```csharp
public class CreateUserTests
{
    //  Correct: AC{N}_ prefix in method name
    [Fact]
    public async Task AC1_CreatesUserWithValidInput() { }

    [Fact]
    public async Task AC2_ThrowsWhenEmailDuplicate() { }

    [Fact]
    public async Task AC3_AssignsCorrectTenant() { }
}
```

**flutter_test/Dart:**
```dart
void main() {
  group('CreateUser', () {
    //  Correct: AC{N}: in test description
    test('AC1: should create user with valid input', () async { });
    test('AC2: should throw when email duplicate', () async { });
    test('AC3: should assign correct tenant', () async { });
  });
}
```

---

### SRS AC coverage verification

Before checking BREAKDOWN.md, verify every SRS AC has at least one passing test. Match test naming to your framework from STEP 0.5:

  SRS AC COVERAGE TABLE (example with framework-specific naming):
  
   AC #  AC text                                            Test method(s) covering it             Status   
  
   AC1   User must provide valid email                    .NET: AC1_CreateUserWithValidInput      PASS   
                                                           JS: it('AC1_should create...')                  
                                                           Python: def test_ac1_create_user...            
                                                           Go: TestCreateUser/AC1_ValidInput              
                                                           Java: testAC1CreatesUserWithInput              
                                                           Flutter: test('AC1: should create...')         
   AC2   Duplicate email raises exception                 .NET: AC2_ThrowsWhenEmailDuplicate     PASS   
                                                           JS: it('AC2_should throw...')                  
                                                           Python: def test_ac2_create_user...            
                                                           Go: TestCreateUser/AC2_DuplicateEmail         
                                                           Java: testAC2ThrowsOnDuplicateEmail            
                                                           Flutter: test('AC2: should throw...')          
   AC3   User created with correct tenant                 .NET: AC3_AssignsCorrectTenant         PASS   
                                                           JS: it('AC3_should assign...')                 
                                                           Python: def test_ac3_assign_tenant...          
                                                           Go: TestCreateUser/AC3_CorrectTenant          
                                                           Java: testAC3AssignsCorrectTenant              
                                                           Flutter: test('AC3: should assign...')         
  

  **Framework-specific naming rules for AC reference:**
    - .NET/xUnit: `AC[N]_` prefix in method name
    - Java/JUnit5: `testAC[N]` method name + `@DisplayName("AC[N]:")` annotation
    - JavaScript/TypeScript: `AC[N]_` or `AC[N]` in `it('...')` description string
    - Python/pytest: `test_ac[n]_` prefix in function name (snake_case)
    - Go: `AC[N]_` in `t.Run()` subtest name (PascalCase)
    - Flutter/Dart: `AC[N]:` in `test()` or `group()` description string

  If any AC is  MISSING: do NOT proceed. Add the missing test branch in your framework's idiom before calling /swd-submit.

Check docs/BREAKDOWN.md for this story. Are ALL subtask rows now 

If YES  all subtasks complete:
  Output:
    STORY-END GATE CHECK
    All subtasks   this story may be complete.
    Run /swd-submit  it will auto-review then commit.
    /swd-submit also auto-detects story type and runs STORY-END GATE.

If NO  subtasks remain:
  Output: "Tests green. Next subtask: [name from BREAKDOWN.md]. Run /swd-submit to commit this subtask."

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


