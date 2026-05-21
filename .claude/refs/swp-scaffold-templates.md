---
name: swp-scaffold-templates
description: Per-framework scaffold file templates for STEP 7-12 of /swp-scaffold — base layer, config, services, repositories, infrastructure, API entry points, and frontend workspace.
type: reference
---

# SmartWorkz Scaffold Templates

> Referenced by `/swp-scaffold` STEP 7–12. These are the concrete per-framework file templates to generate during scaffolding.

## STEP 7 — Scaffold base layer files (stack-specific — from STEP 0.5)

**Flutter:** Skip STEP 7–11. Flutter has no server-side persistence layer — proceed directly to STEP 12.

Based on framework detected in STEP 0.5, create base files referenced by all layers. The exact file locations and structure depend on the backend stack selected.

### Node.js Backend

Create these files in `src/models/` and `src/utils/`:

**src/models/error.ts**
```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string) {
    super(message, 'BUSINESS_RULE_VIOLATION', 422);
  }
}
```

**src/utils/error-codes.ts**
```typescript
export const ErrorCodes = {
  NOT_FOUND: 'NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  BUSINESS_RULE: 'BUSINESS_RULE_VIOLATION',
  INTERNAL_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;
```

**src/models/responses.ts**
```typescript
export interface ErrorResponse {
  code: string;
  message: string;
  correlationId: string;
  validationErrors?: Record<string, string[]>;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
}
```

### Python Backend

Create these files in `src/models/` and `src/utils/`:

**src/models/errors.py**
```python
class AppError(Exception):
    def __init__(self, message: str, code: str, status_code: int = 500):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(self.message)

class ValidationError(AppError):
    def __init__(self, message: str, errors: dict = None):
        self.errors = errors or {}
        super().__init__(message, 'VALIDATION_ERROR', 400)

class NotFoundError(AppError):
    def __init__(self, message: str):
        super().__init__(message, 'NOT_FOUND', 404)

class UnauthorizedError(AppError):
    def __init__(self, message: str):
        super().__init__(message, 'UNAUTHORIZED', 401)

class BusinessRuleError(AppError):
    def __init__(self, message: str):
        super().__init__(message, 'BUSINESS_RULE_VIOLATION', 422)
```

**src/utils/error_codes.py**
```python
class ErrorCodes:
    NOT_FOUND = 'NOT_FOUND'
    INVALID_INPUT = 'INVALID_INPUT'
    UNAUTHORIZED = 'UNAUTHORIZED'
    BUSINESS_RULE = 'BUSINESS_RULE_VIOLATION'
    INTERNAL_ERROR = 'INTERNAL_SERVER_ERROR'
```

**src/models/responses.py**
```python
from typing import Generic, TypeVar, Optional, Dict, List
from dataclasses import dataclass

T = TypeVar('T')

@dataclass
class ErrorResponse:
    code: str
    message: str
    correlationId: str
    validationErrors: Optional[Dict[str, List[str]]] = None

@dataclass
class PagedResult(Generic[T]):
    items: List[T]
    totalCount: int
    pageNumber: int
    pageSize: int

    @property
    def totalPages(self) -> int:
        return (self.totalCount + self.pageSize - 1) // self.pageSize

    @property
    def hasNextPage(self) -> bool:
        return self.pageNumber < self.totalPages
```

### Go Backend

Create these files in `internal/models/` and `pkg/utils/`:

**internal/models/errors.go**
```go
package models

type AppError struct {
	Message    string `json:"message"`
	Code       string `json:"code"`
	StatusCode int    `json:"statusCode"`
}

func (e *AppError) Error() string {
	return e.Message
}

func NewAppError(message, code string, statusCode int) *AppError {
	return &AppError{Message: message, Code: code, StatusCode: statusCode}
}

func NewValidationError(message string) *AppError {
	return NewAppError(message, "VALIDATION_ERROR", 400)
}

func NewNotFoundError(message string) *AppError {
	return NewAppError(message, "NOT_FOUND", 404)
}

func NewUnauthorizedError(message string) *AppError {
	return NewAppError(message, "UNAUTHORIZED", 401)
}

func NewBusinessRuleError(message string) *AppError {
	return NewAppError(message, "BUSINESS_RULE_VIOLATION", 422)
}
```

**pkg/utils/error_codes.go**
```go
package utils

const (
	NotFound        = "NOT_FOUND"
	InvalidInput    = "INVALID_INPUT"
	Unauthorized    = "UNAUTHORIZED"
	BusinessRule    = "BUSINESS_RULE_VIOLATION"
	InternalError   = "INTERNAL_SERVER_ERROR"
)
```

**internal/models/responses.go**
```go
package models

type ErrorResponse struct {
	Code              string              `json:"code"`
	Message           string              `json:"message"`
	CorrelationId     string              `json:"correlationId"`
	ValidationErrors  map[string][]string `json:"validationErrors,omitempty"`
}

type PagedResult struct {
	Items      interface{} `json:"items"`
	TotalCount int         `json:"totalCount"`
	PageNumber int         `json:"pageNumber"`
	PageSize   int         `json:"pageSize"`
	TotalPages int         `json:"totalPages"`
	HasNextPage bool       `json:"hasNextPage"`
}
```

### Java Backend

Create these files in `src/main/java/[com/org]/models/` and `src/main/java/[com/org]/utils/`:

**models/AppError.java**
```java
public abstract class AppError extends RuntimeException {
    private final String code;
    private final int statusCode;

    public AppError(String message, String code, int statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }

    public String getCode() { return code; }
    public int getStatusCode() { return statusCode; }
}
```

**models/ValidationError.java**
```java
import java.util.Map;

public class ValidationError extends AppError {
    private final Map<String, String[]> errors;

    public ValidationError(String message, Map<String, String[]> errors) {
        super(message, "VALIDATION_ERROR", 400);
        this.errors = errors;
    }

    public Map<String, String[]> getErrors() { return errors; }
}
```

**models/NotFoundException.java**
```java
public class NotFoundException extends AppError {
    public NotFoundException(String message) {
        super(message, "NOT_FOUND", 404);
    }
}
```

**models/UnauthorizedException.java**
```java
public class UnauthorizedException extends AppError {
    public UnauthorizedException(String message) {
        super(message, "UNAUTHORIZED", 401);
    }
}
```

**models/BusinessRuleException.java**
```java
public class BusinessRuleException extends AppError {
    public BusinessRuleException(String message) {
        super(message, "BUSINESS_RULE_VIOLATION", 422);
    }
}
```

**utils/ErrorCodes.java**
```java
public final class ErrorCodes {
    private ErrorCodes() {}
    
    public static final String NOT_FOUND = "NOT_FOUND";
    public static final String INVALID_INPUT = "INVALID_INPUT";
    public static final String VALIDATION_ERROR = "VALIDATION_ERROR";
    public static final String UNAUTHORIZED = "UNAUTHORIZED";
    public static final String BUSINESS_RULE = "BUSINESS_RULE_VIOLATION";
    public static final String INTERNAL_ERROR = "INTERNAL_SERVER_ERROR";
}
```

**models/ErrorResponse.java**
```java
import java.util.Map;

public class ErrorResponse {
    private String code;
    private String message;
    private String correlationId;
    private Map<String, String[]> validationErrors;

    public ErrorResponse(String code, String message, String correlationId) {
        this.code = code;
        this.message = message;
        this.correlationId = correlationId;
    }

    public ErrorResponse(String code, String message, String correlationId, Map<String, String[]> validationErrors) {
        this(code, message, correlationId);
        this.validationErrors = validationErrors;
    }

    // Getters and setters...
}
```

**models/PagedResult.java**
```java
import java.util.List;

public class PagedResult<T> {
    private List<T> items;
    private int totalCount;
    private int pageNumber;
    private int pageSize;

    public int getTotalPages() {
        return (int) Math.ceil((double) totalCount / pageSize);
    }

    public boolean hasNextPage() {
        return pageNumber < getTotalPages();
    }

    // Getters and setters...
}
```

### .NET Backend

Create these files in `src/[Product].Domain/`. Do not omit any — they are referenced by all other layers.

**Exceptions/SmartWorkzException.cs**
```csharp
namespace [Namespace].[Product].Domain.Exceptions;

public abstract class SmartWorkzException : Exception
{
    protected SmartWorkzException(string message) : base(message) { }
}
```

**Exceptions/ValidationException.cs**
```csharp
namespace [Namespace].[Product].Domain.Exceptions;

public sealed class ValidationException : SmartWorkzException
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationException(IDictionary<string, string[]> errors)
        : base("One or more validation errors occurred.")
    {
        Errors = errors;
    }
}
```

**Exceptions/NotFoundException.cs**
```csharp
namespace [Namespace].[Product].Domain.Exceptions;

public sealed class NotFoundException : SmartWorkzException
{
    public NotFoundException(string message) : base(message) { }
}
```

**Exceptions/BusinessRuleException.cs**
```csharp
namespace [Namespace].[Product].Domain.Exceptions;

public sealed class BusinessRuleException : SmartWorkzException
{
    public BusinessRuleException(string message) : base(message) { }
}
```

**Exceptions/UnauthorisedException.cs**
```csharp
namespace [Namespace].[Product].Domain.Exceptions;

public sealed class UnauthorisedException : SmartWorkzException
{
    public UnauthorisedException(string message) : base(message) { }
}
```

**Common/ErrorCodes.cs**
```csharp
namespace [Namespace].[Product].Domain.Common;

public static class ErrorCodes
{
    public const string NotFound       = "NOT_FOUND";
    public const string InvalidInput   = "INVALID_INPUT";
    public const string Unauthorised   = "UNAUTHORISED";
    public const string BusinessRule   = "BUSINESS_RULE_VIOLATION";
    public const string InternalError  = "INTERNAL_SERVER_ERROR";
    // Add feature-specific codes here as stories are built
}
```

**Common/ErrorResponse.cs**
```csharp
namespace [Namespace].[Product].Domain.Common;

public sealed record ErrorResponse
{
    public string Code          { get; init; } = string.Empty;
    public string Message       { get; init; } = string.Empty;
    public string CorrelationId { get; init; } = string.Empty;
    public IDictionary<string, string[]>? ValidationErrors { get; init; }
}
```

**Common/PagedResult.cs**
```csharp
namespace [Namespace].[Product].Domain.Common;

public sealed record PagedResult<T>
{
    public IReadOnlyList<T> Items      { get; init; } = [];
    public int TotalCount              { get; init; }
    public int PageNumber              { get; init; }
    public int PageSize                { get; init; }
    public int TotalPages              => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage            => PageNumber < TotalPages;
}
```

---

## STEP 8 — Scaffold additional base files (per-framework — from STEP 0.5)

### Node.js Backend

**src/models/entities.ts**
```typescript
export interface BaseAuditableEntity {
  id: number;
  tenantId: number;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface ITenantScoped {
  tenantId: number;
}
```

**src/middleware/correlation-id.ts**
```typescript
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
  res.setHeader('X-Correlation-Id', correlationId);
  (req as any).correlationId = correlationId;
  next();
}
```

**src/middleware/error-handler.ts**
```typescript
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../models/error';
import { ErrorCodes } from '../utils/error-codes';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const correlationId = (req as any).correlationId || 'unknown';
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      correlationId,
      validationErrors: (err as any).errors
    });
  }

  res.status(500).json({
    code: ErrorCodes.INTERNAL_ERROR,
    message: 'An unexpected error occurred.',
    correlationId
  });
}
```

### Python Backend

**src/models/entities.py**
```python
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class BaseAuditableEntity:
    id: int
    tenantId: int
    createdAt: datetime
    createdBy: str
    updatedAt: Optional[datetime] = None
    updatedBy: Optional[str] = None
    isDeleted: bool = False
    deletedAt: Optional[datetime] = None
    deletedBy: Optional[str] = None

class ITenantScoped:
    """Marker interface for tenant-scoped entities"""
    pass
```

**src/middleware/correlation_id.py**
```python
import uuid
from functools import wraps

def correlation_id_middleware(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from flask import request, g
        g.correlation_id = request.headers.get('X-Correlation-Id', str(uuid.uuid4()))
        return f(*args, **kwargs)
    return decorated_function
```

**src/middleware/error_handler.py**
```python
from flask import jsonify, request, g
from src.models.errors import AppError
from src.utils.error_codes import ErrorCodes

def handle_app_error(error):
    correlation_id = getattr(g, 'correlation_id', 'unknown')
    response = {
        'code': error.code,
        'message': error.message,
        'correlationId': correlation_id
    }
    if hasattr(error, 'errors'):
        response['validationErrors'] = error.errors
    return jsonify(response), error.status_code

def handle_generic_error(error):
    correlation_id = getattr(g, 'correlation_id', 'unknown')
    return jsonify({
        'code': ErrorCodes.INTERNAL_ERROR,
        'message': 'An unexpected error occurred.',
        'correlationId': correlation_id
    }), 500
```

### Go Backend

**internal/models/entities.go**
```go
package models

import "time"

type BaseAuditableEntity struct {
	Id        int        `json:"id"`
	TenantId  int        `json:"tenantId"`
	CreatedAt time.Time  `json:"createdAt"`
	CreatedBy string     `json:"createdBy"`
	UpdatedAt *time.Time `json:"updatedAt"`
	UpdatedBy *string    `json:"updatedBy"`
	IsDeleted bool       `json:"isDeleted"`
	DeletedAt *time.Time `json:"deletedAt"`
	DeletedBy *string    `json:"deletedBy"`
}

type ITenantScoped interface {
	GetTenantId() int
}
```

**pkg/middleware/correlation_id.go**
```go
package middleware

import (
	"github.com/google/uuid"
	"net/http"
)

func CorrelationIdMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.Header.Get("X-Correlation-Id")
		if id == "" {
			id = uuid.New().String()
		}
		w.Header().Set("X-Correlation-Id", id)
		next.ServeHTTP(w, r)
	})
}
```

**pkg/middleware/error_handler.go**
```go
package middleware

import (
	"encoding/json"
	"net/http"
	"[module]/internal/models"
	"[module]/pkg/utils"
)

func ErrorHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{
					"code":    utils.InternalError,
					"message": "An unexpected error occurred.",
				})
			}
		}()
		next.ServeHTTP(w, r)
	})
}
```

### Java Backend

**src/main/java/[com/org]/models/BaseAuditableEntity.java**
```java
import javax.persistence.*;
import java.time.LocalDateTime;

@MappedSuperclass
public abstract class BaseAuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer tenantId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String createdBy;

    private LocalDateTime updatedAt;
    private String updatedBy;
    private Boolean isDeleted = false;
    private LocalDateTime deletedAt;
    private String deletedBy;

    // Getters and setters...
}
```

**src/main/java/[com/org]/models/ITenantScoped.java**
```java
public interface ITenantScoped {
    Integer getTenantId();
}
```

**src/main/java/[com/org]/filters/CorrelationIdFilter.java**
```java
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

public class CorrelationIdFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String correlationId = httpRequest.getHeader("X-Correlation-Id");
        if (correlationId == null || correlationId.isEmpty()) {
            correlationId = UUID.randomUUID().toString();
        }

        httpResponse.setHeader("X-Correlation-Id", correlationId);
        chain.doFilter(request, response);
    }
}
```

**src/main/java/[com/org]/exceptions/GlobalExceptionHandler.java**
```java
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AppError.class)
    public ResponseEntity<ErrorResponse> handleAppError(AppError ex, WebRequest request) {
        return new ResponseEntity<>(
            new ErrorResponse(ex.getCode(), ex.getMessage(), "unknown", null),
            HttpStatus.valueOf(ex.getStatusCode())
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, WebRequest request) {
        return new ResponseEntity<>(
            new ErrorResponse("INTERNAL_ERROR", "An unexpected error occurred.", "unknown", null),
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
```

### .NET Backend

**Entities/BaseAuditableEntity.cs**
```csharp
namespace [Namespace].[Product].Domain.Entities;

public abstract class BaseAuditableEntity
{
    public int    Id          { get; set; }
    public int    TenantId    { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedBy   { get; set; } = string.Empty;
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy  { get; set; }
    public bool   IsDeleted   { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy  { get; set; }
}
```

**Interfaces/ITenantScoped.cs**
```csharp
namespace [Namespace].[Product].Domain.Interfaces;

/// <summary>Marker interface — entities implementing this require a TenantId filter on every query.</summary>
public interface ITenantScoped { }
```

---

## STEP 9 — Scaffold service and repository base files (per-framework — from STEP 0.5)

Based on framework detected in STEP 0.5, create base service/repository interfaces and implementations.

### .NET Backend

**Interfaces/IRepository.cs**
```csharp
using [Namespace].[Product].Domain.Common;

namespace [Namespace].[Product].Application.Interfaces;

public interface IRepository<TEntity, TId> where TEntity : class
{
    Task<TEntity?> GetByIdAsync(TId id, int tenantId, CancellationToken ct = default);
    Task<PagedResult<TEntity>> GetPagedAsync(int pageNumber, int pageSize, int tenantId, CancellationToken ct = default);
    Task ExecuteSpAsync(string spName, IEnumerable<object> parameters, CancellationToken ct = default);
}
```

**Interfaces/IUnitOfWork.cs**
```csharp
namespace [Namespace].[Product].Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    Task<int> CommitAsync(CancellationToken ct = default);
    Task BeginTransactionAsync(CancellationToken ct = default);
    Task RollbackAsync(CancellationToken ct = default);
}
```

**Interfaces/ICurrentUserService.cs**
```csharp
namespace [Namespace].[Product].Application.Interfaces;

public interface ICurrentUserService
{
    int    TenantId        { get; }
    string UserId          { get; }
    bool   IsAuthenticated { get; }
}
```

For Node.js, Python, Go, and Java backends: Create equivalent service/repository base classes in your language convention. See STEP 0.5 for stack-specific examples or adapt the .NET interfaces above to your selected language's idioms.

---

## STEP 10 — Scaffold infrastructure/persistence base files (per-framework — from STEP 0.5)

Based on framework detected in STEP 0.5, create database context, ORM configuration, or connection pooling.

### .NET Backend

**Data/AppDbContext.cs**
```csharp
using Microsoft.EntityFrameworkCore;

namespace [Namespace].[Product].Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
```

**Data/AuditInterceptor.cs**
```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using [Namespace].[Product].Application.Interfaces;
using [Namespace].[Product].Domain.Entities;

namespace [Namespace].[Product].Infrastructure.Data;

public sealed class AuditInterceptor : SaveChangesInterceptor
{
    private readonly ICurrentUserService _currentUser;

    public AuditInterceptor(ICurrentUserService currentUser) => _currentUser = currentUser;

    public override InterceptionResult<int> SavingChanges(DbContextEventData data, InterceptionResult<int> result)
    {
        SetAuditFields(data.Context);
        return base.SavingChanges(data, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData data, InterceptionResult<int> result, CancellationToken ct = default)
    {
        SetAuditFields(data.Context);
        return base.SavingChangesAsync(data, result, ct);
    }

    private void SetAuditFields(DbContext? context)
    {
        if (context is null) return;
        var now = DateTime.UtcNow;
        foreach (var entry in context.ChangeTracker.Entries<BaseAuditableEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.CreatedBy = _currentUser.UserId;
                entry.Entity.TenantId = _currentUser.TenantId;
            }
            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
                entry.Entity.UpdatedBy = _currentUser.UserId;
            }
            if (entry.State == EntityState.Deleted)
            {
                entry.State             = EntityState.Modified;
                entry.Entity.IsDeleted  = true;
                entry.Entity.DeletedAt  = now;
                entry.Entity.DeletedBy  = _currentUser.UserId;
            }
        }
    }
}
```

**Services/CurrentUserService.cs**
```csharp
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using [Namespace].[Product].Application.Interfaces;

namespace [Namespace].[Product].Infrastructure.Services;

public sealed class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _http;

    public CurrentUserService(IHttpContextAccessor http) => _http = http;

    public int    TenantId        => int.TryParse(_http.HttpContext?.User.FindFirstValue("tenant_id"), out var t) ? t : 0;
    public string UserId          => _http.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
    public bool   IsAuthenticated => _http.HttpContext?.User.Identity?.IsAuthenticated ?? false;
}
```

**Repositories/GenericRepository.cs**
```csharp
using Microsoft.EntityFrameworkCore;
using [Namespace].[Product].Application.Interfaces;
using [Namespace].[Product].Domain.Common;
using [Namespace].[Product].Domain.Entities;
using [Namespace].[Product].Infrastructure.Data;

namespace [Namespace].[Product].Infrastructure.Repositories;

public class GenericRepository<TEntity, TId> : IRepository<TEntity, TId>
    where TEntity : BaseAuditableEntity
{
    protected readonly AppDbContext _db;

    public GenericRepository(AppDbContext db) => _db = db;

    public async Task<TEntity?> GetByIdAsync(TId id, int tenantId, CancellationToken ct = default)
        => await _db.Set<TEntity>()
                    .FirstOrDefaultAsync(e => e.Id.Equals(id) && e.TenantId == tenantId && !e.IsDeleted, ct);

    public async Task<PagedResult<TEntity>> GetPagedAsync(int pageNumber, int pageSize, int tenantId, CancellationToken ct = default)
    {
        var query = _db.Set<TEntity>().Where(e => e.TenantId == tenantId && !e.IsDeleted);
        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(e => e.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
        return new PagedResult<TEntity> { Items = items, TotalCount = total, PageNumber = pageNumber, PageSize = pageSize };
    }

    public async Task ExecuteSpAsync(string spName, IEnumerable<object> parameters, CancellationToken ct = default)
    {
        // spName must be a hard-coded stored procedure name — never build it from user input (SQL injection risk).
        await _db.Database.ExecuteSqlRawAsync(spName, parameters, ct);
    }
}
```

**Data/UnitOfWork.cs**
```csharp
using Microsoft.EntityFrameworkCore.Storage;
using [Namespace].[Product].Application.Interfaces;

namespace [Namespace].[Product].Infrastructure.Data;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _db;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(AppDbContext db) => _db = db;

    public async Task<int> CommitAsync(CancellationToken ct = default)
    {
        var result = await _db.SaveChangesAsync(ct);
        if (_transaction is not null) await _transaction.CommitAsync(ct);
        return result;
    }

    public async Task BeginTransactionAsync(CancellationToken ct = default)
        => _transaction = await _db.Database.BeginTransactionAsync(ct);

    public async Task RollbackAsync(CancellationToken ct = default)
    {
        if (_transaction is not null) await _transaction.RollbackAsync(ct);
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _db.Dispose();
    }
}
```

For Node.js, Python, Go, and Java backends: Create equivalent data context and audit/CurrentUserService implementations. Patterns should follow language conventions — see STEP 5B for middleware patterns or adapt the .NET example above.

---

## STEP 11 — Scaffold API/main entry point (per-framework — from STEP 0.5)

Based on framework detected in STEP 0.5, create main application entry point with middleware and request pipeline.

### .NET Backend

**Middleware/CorrelationIdMiddleware.cs**
```csharp
namespace [Namespace].[Product].API.Middleware;

public class CorrelationIdMiddleware
{
    private readonly RequestDelegate _next;
    private const string Header = "X-Correlation-Id";

    public CorrelationIdMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext ctx)
    {
        if (!ctx.Request.Headers.TryGetValue(Header, out var id))
            id = Guid.NewGuid().ToString();

        ctx.Response.Headers[Header] = id;
        using (Serilog.Context.LogContext.PushProperty("CorrelationId", id.ToString()))
            await _next(ctx);
    }
}
```

**Middleware/GlobalExceptionMiddleware.cs**
```csharp
using System.Net;
using System.Text.Json;
using [Namespace].[Product].Domain.Common;
using [Namespace].[Product].Domain.Exceptions;

namespace [Namespace].[Product].API.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next   = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext ctx)
    {
        try
        {
            await _next(ctx);
        }
        catch (Exception ex)
        {
            await HandleAsync(ctx, ex);
        }
    }

    private async Task HandleAsync(HttpContext ctx, Exception ex)
    {
        var correlationId = ctx.Response.Headers["X-Correlation-Id"].ToString();

        var (status, code, message, validationErrors) = ex switch
        {
            Domain.Exceptions.ValidationException ve  => (HttpStatusCode.BadRequest,              ErrorCodes.InvalidInput,  ex.Message, ve.Errors),
            NotFoundException                          => (HttpStatusCode.NotFound,                ErrorCodes.NotFound,      ex.Message, (IDictionary<string, string[]>?)null),
            BusinessRuleException                      => (HttpStatusCode.UnprocessableEntity,     ErrorCodes.BusinessRule,  ex.Message, null),
            UnauthorisedException                      => (HttpStatusCode.Unauthorized,            ErrorCodes.Unauthorised,  ex.Message, null),
            _                                          => (HttpStatusCode.InternalServerError,     ErrorCodes.InternalError, "An unexpected error occurred.", null)
        };

        if (status == HttpStatusCode.InternalServerError)
            _logger.LogError(ex, "Unhandled exception. CorrelationId: {CorrelationId}", correlationId);
        else
            _logger.LogWarning(ex, "Handled exception {Code}. CorrelationId: {CorrelationId}", code, correlationId);

        var response = new ErrorResponse
        {
            Code             = code,
            Message          = message,
            CorrelationId    = correlationId,
            ValidationErrors = validationErrors
        };

        ctx.Response.ContentType = "application/json";
        ctx.Response.StatusCode  = (int)status;
        await ctx.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
```

**Program.cs**
```csharp
using [Namespace].[Product].API.Middleware;
using [Namespace].[Product].Application.Interfaces;
using [Namespace].[Product].Infrastructure.Data;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "[Product]")
    .WriteTo.Console()
    .CreateLogger();
builder.Host.UseSerilog();

// Core — prerequisite for ICurrentUserService
builder.Services.AddHttpContextAccessor();

// Database + Audit interceptor
builder.Services.AddScoped<AuditInterceptor>();
builder.Services.AddDbContext<AppDbContext>((sp, opts) =>
    opts.UseSqlServer(builder.Configuration.GetConnectionString("Default"))
        .AddInterceptors(sp.GetRequiredService<AuditInterceptor>()));

// Infrastructure
builder.Services.AddScoped(typeof(IRepository<,>), typeof(GenericRepository<,>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

// Health checks — required for Phase 2 exit gate (/health must return 200)
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>();
// Note: health will return Unhealthy until Default connection string is set in appsettings.local.json — expected during Phase 2 setup.

// CORS — required for frontend (omit if no frontend in SRS)
builder.Services.AddCors(opt => opt.AddPolicy("AllowFrontend", policy =>
    policy.WithOrigins(builder.Configuration["AllowedOrigins"] ?? "http://localhost:4200")
          .AllowAnyMethod()
          .AllowAnyHeader()));

// FluentValidation
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

// Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts =>
    {
        opts.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)),
            ValidateIssuer   = true,
            ValidIssuer      = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = false,
            ClockSkew        = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// TODO: register Application feature services here as stories are built
// builder.Services.AddScoped<I[Feature]Service, [Feature]Service>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");                        // before auth — omit if no frontend
app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseSerilogRequestLogging();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.MapHealthChecks("/health");                      // Phase 2 exit gate: GET /health → 200
app.Run();
```

**appsettings.json** (placeholders — real values go in appsettings.local.json which is git-ignored):
```json
{
  "ConnectionStrings": {
    "Default": "YOUR_CONNECTION_STRING"
  },
  "Jwt": {
    "Secret": "YOUR_JWT_SECRET_MIN_32_CHARS",
    "Issuer": "[Namespace].[Product]",
    "ExpiryMinutes": 60
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    }
  },
  "AllowedHosts": "*"
}
```

**appsettings.Development.json**
```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Debug"
    }
  }
}
```

**appsettings.local.json** *(git-ignored — create this file manually, never commit it)*
```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=[YourDb];Trusted_Connection=True;"
  },
  "Jwt": {
    "Secret": "replace-with-a-secret-at-least-32-characters-long"
  }
}
```

Ensure `.gitignore` includes these lines (add if missing):
```
appsettings.local.json
appsettings.*.local.json
*.user
.env.local
.env
```

For Node.js, Python, Go, and Java backends: Create equivalent main entry point files. See STEP 5B for middleware patterns or the .NET example above as a reference for logging, CORS, and authentication setup patterns to adapt to your stack.

---

## STEP 12 — Scaffold frontend workspace (per-framework — skip if no frontend in SRS)

Based on frontend stack from STEP 0.5: If no frontend declared in SRS, skip this step.

### Angular / React / Vue.js (npm-based)

```bash
# Angular
ng new frontend --routing=true --style=scss --standalone=true --skip-git=true

# React
npx create-react-app frontend

# Vue 3
npm create vite@latest frontend -- --template vue

# Navigate to frontend and install approved npm packages from SRS list
cd frontend
npm install
npm install [approved-packages-from-SRS]
cd ..
```

Create `frontend/src/app/` folder structure from ARCH-DESIGN.md:
- `core/guards/`, `core/interceptors/`, `core/services/`
- `shared/components/`, `shared/models/`
- `store/auth/` — NgRx auth slice (actions.ts, reducer.ts, effects.ts, selectors.ts)
- One folder per Epic (empty — to be populated per story)

Create `frontend/src/environments/`:

**environments/environment.ts**
```typescript
export const environment = {
  production: false,
  apiUrl: '/api'
};
```

**environments/environment.prod.ts**
```typescript
export const environment = {
  production: true,
  apiUrl: ''   // set by CI variable at build time
};
```

Create `frontend/proxy.conf.json` (dev API proxy to backend):
```json
{
  "/api": {
    "target": "https://localhost:7001",
    "secure": false,
    "changeOrigin": true
  }
}
```

Create `frontend/src/app/app.config.ts` (Angular 17+ standalone bootstrap):
```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter }      from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore }       from '@ngrx/store';
import { provideEffects }     from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes }             from './app.routes';
import { environment }        from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([])),  // add AuthInterceptor, ErrorInterceptor here per story
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production })
  ]
};
```

Update `frontend/src/main.ts` to bootstrap with the standalone config:
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
```

