---
name: swd-unit-test-templates
description: Framework-specific unit test templates for /swd-unit-test — Jest (JS/TS), Moq (.NET), pytest (Python), Go testing, Dart/Flutter, React Testing Library patterns.
type: reference
---

# Unit Test Templates by Framework

> Referenced by `/swd-unit-test` STEP 3. Use these templates as the basis for each test file.

### Framework-specific test templates

**JAVASCRIPT/TYPESCRIPT (Jest for Node.js and React)**

Fixture/setup patterns:
```typescript
// Module-level mocks (hoisted before test)
jest.mock('../userRepository');

describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create fresh instances
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      findByEmail: jest.fn(),
    } as any;
    service = new UserService(mockRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
```

Common async patterns:
```typescript
// Mock async return value
mockRepository.findById.mockResolvedValue({ id: 1, name: 'John' });

// Mock async error
mockRepository.findById.mockRejectedValue(new Error('DB error'));

// Verify call arguments
expect(mockRepository.findById).toHaveBeenCalledWith(1);
expect(mockRepository.save).not.toHaveBeenCalled();

// Assert async throws
await expect(service.getUser(1)).rejects.toThrow('User not found');
```

---

**PYTHON (pytest)**

Fixture/setup patterns:
```python
import pytest
from unittest.mock import Mock, AsyncMock, patch

class TestUserService:
    @pytest.fixture
    def mock_repository(self):
        """Create mock repository for injection."""
        return Mock(spec=['find_by_id', 'save', 'find_by_email'])

    @pytest.fixture
    def mock_logger(self):
        """Create mock logger."""
        return Mock(spec=['info', 'error', 'debug'])

    @pytest.fixture
    def service(self, mock_repository, mock_logger):
        """Create service with all mocked dependencies."""
        from user_service import UserService
        return UserService(
            repository=mock_repository,
            logger=mock_logger
        )

    @pytest.fixture(autouse=True)
    def cleanup(self):
        """Cleanup after each test."""
        yield
        # Cleanup code here if needed
```

Common async patterns:
```python
# Mock async return
mock_repo.find_by_id = AsyncMock(return_value={'id': 1, 'name': 'John'})

# Mock async error
mock_repo.find_by_id = AsyncMock(side_effect=Exception('DB error'))

# Verify call arguments
mock_repo.find_by_id.assert_called_once_with(1)
mock_repo.save.assert_not_called()

# Assert exception with pytest
with pytest.raises(UserNotFoundException) as exc_info:
    service.get_user(1)
assert 'User not found' in str(exc_info.value)

# Mark async tests
@pytest.mark.asyncio
async def test_async_operation(self, service):
    result = await service.get_user_async(1)
    assert result is not None
```

---

**GO (testing + testify/assert)**

Fixture/setup patterns:
```go
package services

import (
	"testing"
	"github.com/stretchr/testify/assert"
	"github.com/golang/mock/gomock"
	"yourmodule/mocks"
)

func TestCreateUser(t *testing.T) {
	// Setup mock controller (shared across subtests)
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	tests := []struct {
		name    string
		setup   func(*mocks.MockUserRepository)
		want    *User
		wantErr bool
	}{
		// Test cases here
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := mocks.NewMockUserRepository(ctrl)
			tt.setup(mockRepo)
			service := NewUserService(mockRepo)

			// Test execution
		})
	}
}
```

Common async patterns:
```go
// Mock call expectations with gomock
mockRepo.EXPECT().
	FindByID(gomock.Any(), 1).
	Return(&User{ID: 1, Name: "John"}, nil).
	Times(1)

// gomock matchers
gomock.Any()                              // Match any argument
gomock.Eq(value)                          // Match exact value
gomock.InOrder(call1, call2)              // Verify call order

// Assertions with testify
assert.Equal(t, expected, actual, "message")
assert.NoError(t, err)
assert.Error(t, err)
assert.Nil(t, result)
assert.NotNil(t, result)
```

---

**JAVA (JUnit5 + AssertJ + Mockito)**

Fixture/setup patterns:
```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("UserService Tests")
class UserServiceTests {
    private UserService sut;  // System Under Test
    private UserRepository mockRepository;
    private ICurrentUserService mockAuthService;

    @BeforeEach
    void setUp() {
        mockRepository = mock(UserRepository.class);
        mockAuthService = mock(ICurrentUserService.class);
        sut = new UserService(mockRepository, mockAuthService);
    }

    @AfterEach
    void tearDown() {
        reset(mockRepository, mockAuthService);
    }
}
```

Common async patterns:
```java
// Mock return values
when(mockRepository.findByIdAsync(1))
    .thenReturn(CompletableFuture.completedFuture(user));

// Mock exceptions
when(mockRepository.findByIdAsync(1))
    .thenReturn(CompletableFuture.failedFuture(new UserNotFoundException()));

// Verify invocations
verify(mockRepository).findById(1);
verify(mockRepository, times(2)).save(any(User.class));
verify(mockRepository, never()).delete(any());

// AssertJ fluent assertions
assertThat(result)
    .isNotNull()
    .isInstanceOf(User.class)
    .hasFieldOrPropertyWithValue("id", 1L)
    .extracting(User::getEmail)
    .isEqualTo("test@example.com");

// Assert async exceptions
assertThatThrownBy(() -> sut.getUser(1))
    .isInstanceOf(UserNotFoundException.class)
    .hasMessage("User not found");
```

---

**C# / .NET (xUnit + FluentAssertions + Moq)**

Fixture/setup patterns:
```csharp
using Xunit;
using FluentAssertions;
using Moq;
using System.Threading.Tasks;

public class UserServiceTests
{
    private UserService _sut;  // System Under Test
    private Mock<IUserRepository> _mockRepository;
    private Mock<ICurrentUserService> _mockAuthService;

    public UserServiceTests()
    {
        // Constructor-based fixture setup
        _mockRepository = new Mock<IUserRepository>();
        _mockAuthService = new Mock<ICurrentUserService>();
        _sut = new UserService(_mockRepository.Object, _mockAuthService.Object);
    }

    private void ResetMocks()
    {
        _mockRepository.Reset();
        _mockAuthService.Reset();
    }
}
```

Common async patterns:
```csharp
// Mock async methods
_mockRepository
    .Setup(r => r.FindByIdAsync(1, It.IsAny<Guid>()))
    .ReturnsAsync(new User { Id = 1, Name = "John" });

// Mock async exceptions
_mockRepository
    .Setup(r => r.FindByIdAsync(1, It.IsAny<Guid>()))
    .ThrowsAsync(new UserNotFoundException());

// Verify invocations
_mockRepository.Verify(r => r.FindById(1), Times.Once);
_mockRepository.Verify(r => r.Save(It.IsAny<User>()), Times.Never);

// FluentAssertions
result.Should().NotBeNull();
result.Id.Should().Be(1);
result.Email.Should().Be("test@example.com");

// Async exception testing
await FluentActions
    .Invoking(() => _sut.GetUserAsync(1))
    .Should()
    .ThrowAsync<UserNotFoundException>()
    .WithMessage("User not found");
```

---

**FLUTTER (flutter_test + mockito)**

Fixture/setup patterns:
```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockUserRepository extends Mock implements UserRepository {}
class MockLogger extends Mock implements Logger {}

void main() {
  group('UserService', () {
    late MockUserRepository mockRepository;
    late MockLogger mockLogger;
    late UserService service;

    setUp(() {
      mockRepository = MockUserRepository();
      mockLogger = MockLogger();
      service = UserService(
        repository: mockRepository,
        logger: mockLogger,
      );
    });

    tearDown(() {
      reset(mockRepository);
      reset(mockLogger);
    });
  });
}
```

Common async patterns:
```dart
// Mock async return with thenAnswer
when(mockRepository.findById(1))
    .thenAnswer((_) async => User(id: 1, name: 'John'));

// Mock async error
when(mockRepository.findById(1))
    .thenAnswer((_) async => throw UserNotFoundException());

// Verify calls
verify(mockRepository.findById(1)).called(1);
verifyNever(mockRepository.save(any));
verifyInOrder([
    mockRepository.findById(1),
    mockRepository.save(any),
]);

// Expect async throws
expect(
    () => service.getUser(1),
    throwsA(isA<UserNotFoundException>()),
);

// Widget test with tester
testWidgets('should display user after load', (WidgetTester tester) async {
    await tester.pumpWidget(MyApp(repository: mockRepository));
    await tester.pumpAndSettle();
    expect(find.text('John'), findsOneWidget);
});
```

---

### Layer implementation templates (cross-framework)

**LAYER: Repository (test database access)**

  Core principle: Mock database or use in-memory database. Never connect to real database.

  Always test:
    - Happy path — valid id + correct tenantId → returns entity
    - Wrong tenant — valid id + different tenantId → returns null (tenant isolation)
    - Soft-deleted row — IsDeleted/deleted_at = true → excluded from result
    - Not found — id does not exist → returns null
    - Audit fields — returned entity has TenantId, CreatedAt, CreatedBy populated (not defaults)

  **Example (.NET / xUnit):**
    var mockContext = new Mock<IDbContext>();
    mockContext.Setup(c => c.Users.FindAsync(validId)).ReturnsAsync(entity);
    var sut = new UserRepository(mockContext.Object);
    var result = await sut.GetByIdAsync(validId, tenantId);
    Assert.NotNull(result);
    Assert.Equal(validId, result.Id);

  **Example (Node.js / Jest):**
    const mockDb = { query: jest.fn() };
    mockDb.query.mockResolvedValue({ rows: [{ id: 1, email: 'test@example.com' }] });
    const repo = new UserRepository(mockDb);
    const result = await repo.getById(1, tenantId);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);

  **Example (Python / pytest):**
    mock_db = Mock()
    mock_db.query.return_value = [{'id': 1, 'email': 'test@example.com'}]
    repo = UserRepository(mock_db)
    result = repo.get_by_id(1, tenant_id)
    assert result is not None
    assert result['id'] == 1

---

**LAYER: Service (business logic)**

  Core principle: Mock all dependencies (repository, database, external API, logging, auth).

  Always test:
    - Happy path — method returns expected result
    - Not found — repo returns null → service throws NotFoundException
    - Validation error — invalid input → thrown before repo is called
    - Write confirmation — write operations verify repo.save/create/update called exactly once
    - Logging — verify logger called (if logging is part of contract)
    - Tenant isolation — service uses auth context tenant, not hardcoded value
    - Cross-tenant access — different tenant → returns null → NotFoundException

  **Example (.NET / xUnit):**
    var mockRepo    = new Mock<IUserRepository>();
    var mockUser    = new Mock<ICurrentUserService>();
    mockUser.Setup(u => u.TenantId).Returns(tenantId);
    mockRepo.Setup(r => r.GetByIdAsync(id, tenantId)).ReturnsAsync(entity);
    var sut = new UserService(mockRepo.Object, mockUser.Object);
    var result = await sut.GetByIdAsync(id);
    Assert.Equal(entity.Id, result.Id);
    mockRepo.Verify(r => r.GetByIdAsync(id, tenantId), Times.Once);

  **Example (Node.js / Jest):**
    const mockRepo = { getById: jest.fn(), save: jest.fn() };
    const mockAuth = { getTenantId: jest.fn().mockReturnValue(tenantId) };
    mockRepo.getById.mockResolvedValue(entity);
    const service = new UserService(mockRepo, mockAuth);
    const result = await service.getById(id);
    expect(result.id).toBe(entity.id);
    expect(mockRepo.getById).toHaveBeenCalledWith(id, tenantId);

  **Example (Python / pytest):**
    mock_repo = Mock()
    mock_auth = Mock()
    mock_auth.get_tenant_id.return_value = tenant_id
    mock_repo.get_by_id.return_value = entity
    service = UserService(mock_repo, mock_auth)
    result = service.get_by_id(id)
    assert result['id'] == entity['id']
    mock_repo.get_by_id.assert_called_once_with(id, tenant_id)

---

**LAYER: Endpoint (API controller/handler)**

  Core principle: Mock service layer. Test HTTP contract (status codes, DTO mapping).

  Always test:
    - 200 OK — valid request → service returns data → response DTO correct
    - 400 Bad Request — validation fails → error details returned
    - 404 Not Found — service throws not-found → correct status + error
    - 401/403 Unauthorized/Forbidden — auth checks pass or fail correctly
    - Request body → service called with correct DTO
    - Response → DTO shape matches contract (no missing/extra fields)

  **Example (.NET / xUnit):**
    var mockService = new Mock<IUserService>();
    var controller = new UserController(mockService.Object);
    mockService.Setup(s => s.GetByIdAsync(id)).ReturnsAsync(dto);
    var result = await controller.GetById(id) as OkObjectResult;
    Assert.Equal(200, result.StatusCode);
    Assert.Equal(dto.Id, ((UserDto)result.Value).Id);

  **Example (Node.js / Express + Jest):**
    const mockService = { getById: jest.fn() };
    mockService.getById.mockResolvedValue(dto);
    const response = await request(app).get(`/api/users/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(dto.id);

  **Example (Python / FastAPI + pytest):**
    mock_service = Mock()
    mock_service.get_by_id.return_value = dto
    response = client.get(f'/api/users/{id}')
    assert response.status_code == 200
    assert response.json()['id'] == dto['id']

---

**LAYER: Component/Widget UI (React, Angular, Flutter)**

  Core principle: Mock service dependencies. Test rendering and user interactions.

  Always test:
    - Renders data — service returns items → items appear in DOM/widget
    - Empty state — service returns [] → empty message shown
    - Error state — service throws → error message displayed
    - Loading state — async pending → spinner/skeleton visible
    - User interaction — click/submit → service called with correct args
    - Props/inputs — passed correctly to child components

  **Example (React / Jest + @testing-library):**
    import { render, screen, waitFor } from '@testing-library/react';
    const mockService = { getAll: jest.fn() };
    mockService.getAll.mockResolvedValue([{ id: 1, name: 'Item' }]);
    render(<UserList service={mockService} />);
    await waitFor(() => expect(screen.getByText('Item')).toBeInTheDocument());
    expect(mockService.getAll).toHaveBeenCalled();

  **Example (Angular / Jest):**
    const mockService = { getAll: jest.fn().and.returnValue(of([{ id: 1, name: 'Item' }])) };
    TestBed.configureTestingModule({
      declarations: [UserListComponent],
      providers: [{ provide: UserService, useValue: mockService }]
    });
    const fixture = TestBed.createComponent(UserListComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('tr'))).toBeTruthy();

  **Example (Flutter / flutter_test):**
    testWidgets('should display users', (WidgetTester tester) async {
      final mockService = MockUserService();
      when(mockService.getAll()).thenAnswer((_) async => [User(id: 1, name: 'Test')]);
      await tester.pumpWidget(MaterialApp(home: UserListPage(service: mockService)));
      await tester.pumpAndSettle();
      expect(find.text('Test'), findsOneWidget);
    });

---

**LAYER: Frontend Service (HTTP/API client)**

  Core principle: Mock HTTP client or use MSW (Mock Service Worker). Test API contracts.

  Always test:
    - Correct HTTP method (GET, POST, PUT, DELETE)
    - URL construction — correct path + query params
    - Request headers — auth token, content-type, custom headers
    - Request body — DTO shape correct (POST/PUT)
    - Response mapping — API response → client DTO
    - Error handling — 4xx/5xx → thrown or returned as error

  **Example (Angular / Jest):**
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    httpMock = TestBed.inject(HttpTestingController);
    service.getById(1).subscribe(result => expect(result.id).toBe(1));
    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush({ id: 1, email: 'test@example.com' });

  **Example (Node.js / Jest + axios-mock-adapter):**
    const mock = new MockAdapter(axiosInstance);
    mock.onGet('/api/users/1').reply(200, { id: 1, email: 'test@example.com' });
    const result = await userService.getById(1);
    expect(result.id).toBe(1);

  **Example (React / Jest + MSW):**
    const server = setupServer(
      rest.get('/api/users/1', (req, res, ctx) => 
        res(ctx.json({ id: 1, email: 'test@example.com' }))
      )
    );
    server.listen();
    const result = await userService.getById(1);
    expect(result.id).toBe(1);

