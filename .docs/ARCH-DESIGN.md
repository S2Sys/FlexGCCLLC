# Architecture Design - Work Request Tracker Assessment

SRS Version : SRS-v0.1
Designed    : 2026-05-21
Approved   : 2026-05-21
Author     : Senthilvel T
Source     : .docs/SRS.md
Scope      : Job code assessment / two-hour assignment

## Decision

Signal : GO
Score  : 88/100

This architecture is intentionally small. It is designed for a two-hour candidate assessment, not a production platform. The solution should demonstrate practical backend/frontend judgment, clean structure, validation, SQL fundamentals, and clear trade-offs.

## Stack

| Area | Decision |
|---|---|
| Backend | ASP.NET Core Web API on .NET 8 |
| Frontend | React 18+ / TypeScript / Vite |
| Database | SQL schema required; implementation may use in-memory list, SQLite, or SQL Server |
| Data access | Dapper with Microsoft.Data.SqlClient |
| Auth | Out of scope |
| Tests | Manual smoke test minimum; optional unit tests |
| Deployment | Out of scope |

## Solution Layout

```text
backend/
  FlexGCCLLC.WorkRequestTracker.Api/
    Controllers/
      WorkRequestsController.cs
    Features/
      WorkRequests/
        Dtos/
          WorkRequestDto.cs
          CreateWorkRequestRequest.cs
          UpdateWorkRequestStatusRequest.cs
          AddWorkRequestNoteRequest.cs
          ApiErrorResponse.cs
        Models/
          WorkRequest.cs
          WorkRequestNote.cs
          WorkRequestPriority.cs
          WorkRequestStatus.cs
        Validation/
          WorkRequestValidator.cs
        IWorkRequestRepository.cs
        InMemoryWorkRequestRepository.cs
        WorkRequestService.cs
    Extensions/
      ServiceCollectionExtensions.cs
    Program.cs

frontend/
  src/
    pages/
      WorkRequestsPage.tsx
    main.tsx
    App.tsx
  components/
    work-requests/
      WorkRequestList.tsx
      WorkRequestFilters.tsx
      CreateWorkRequestForm.tsx
      StatusUpdateButton.tsx
  lib/
    api/
      workRequestsApi.ts
  types/
    workRequest.ts
```

## Backend Architecture

Use a simple feature-first structure. The API controller should stay thin and delegate filtering, creation, status update, note creation, and validation orchestration to the Work Request feature service.

Layer direction:

```text
Controller -> WorkRequestService -> IWorkRequestRepository -> InMemory or DB-backed repository
```

Rules:

- No circular dependencies.
- API may depend on feature services and DTOs.
- Persistence implementation must not depend on controller classes.
- Use enums for `Priority` and `Status`.
- Use DTOs for create, status update, note creation, and response payloads.
- Return consistent API errors in `{ code, message, details }` shape.

## API Endpoints

| Method | Path | Responsibility |
|---|---|---|
| GET | `/api/work-requests?status=&search=&page=&pageSize=` | List, filter, search, and page work requests. |
| GET | `/api/work-requests/{id}` | Return one work request or not found. |
| POST | `/api/work-requests` | Validate and create a work request. |
| PATCH | `/api/work-requests/{id}/status` | Validate and update status. |
| POST | `/api/work-requests/{id}/notes` | Add a note to an existing work request. |

## Error Handling

Use these error codes:

| Code | When |
|---|---|
| `ValidationError` | Missing required fields or invalid body. |
| `InvalidStatus` | Status is not New, InProgress, Blocked, or Completed. |
| `InvalidPriority` | Priority is not Low, Medium, or High. |
| `NotFound` | Work request ID does not exist. |
| `ServerError` | Unexpected server exception. |

Do not expose stack traces in responses.

## Frontend Architecture

Use one focused React page: `WorkRequestsPage`.

The page owns the assessment flow:

- Load work requests from the backend.
- Keep `status`, `search`, `page`, and `pageSize` in component state or URL query params.
- Show loading and error states.
- Render list rows with a status update action.
- Render a simple create form or modal.
- Refresh the list after create, status update, or note add.

No global state library or Next.js-specific routing is required for this assessment.

## SQL Design

The assignment response should include a schema similar to:

```sql
CREATE TABLE WorkRequests (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    ClientName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Priority NVARCHAR(20) NOT NULL,
    Status NVARCHAR(20) NOT NULL,
    DueDate DATETIME2 NOT NULL,
    CreatedDate DATETIME2 NOT NULL,
    UpdatedDate DATETIME2 NOT NULL
);

CREATE TABLE WorkRequestNotes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    WorkRequestId INT NOT NULL,
    NoteText NVARCHAR(MAX) NOT NULL,
    CreatedDate DATETIME2 NOT NULL,
    CONSTRAINT FK_WorkRequestNotes_WorkRequests
      FOREIGN KEY (WorkRequestId) REFERENCES WorkRequests(Id)
);

CREATE INDEX IX_WorkRequests_Status_DueDate
ON WorkRequests (Status, DueDate);

CREATE INDEX IX_WorkRequests_ClientName_Title
ON WorkRequests (ClientName, Title);
```

Index rationale:

- `IX_WorkRequests_Status_DueDate` supports status filtering and due-date ordering.
- `IX_WorkRequests_ClientName_Title` supports common client/title search paths for assessment-scale data.

## Dependency Injection

Register only the small set needed:

```text
IWorkRequestRepository -> InMemoryWorkRequestRepository
WorkRequestService
```

Use a scoped Dapper repository for SQL Server persistence.

## Security Boundary

For this assessment:

- Authentication and authorization are out of scope.
- Do not include secrets or confidential data.
- Do not log personal or proprietary information.
- Avoid raw SQL string concatenation if a DB implementation is submitted.

Production improvements may mention auth, role checks, rate limiting, structured logging, CI/CD, and full integration tests, but they should not be built unless time remains.

## Verification Plan

Manual smoke checks:

1. List work requests loads successfully.
2. Status filter changes the returned list.
3. Search by title or client name works.
4. Create rejects missing title, client name, priority, status, or due date.
5. Invalid priority/status returns a clear error.
6. Status update changes the row and updated date.
7. Add note associates the note with the correct work request.
8. Frontend shows loading and error states.

## Out of Scope

Authentication, authorization, deployment, notifications, background jobs, advanced UI styling, multi-tenant behavior, and production monitoring are out of scope for the two-hour assessment.

## Architecture Approval

Approval phrase accepted : architecture approved
Approved by              : Senthilvel T
