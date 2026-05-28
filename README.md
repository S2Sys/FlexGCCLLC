# Work Request Tracker Assessment

Draft assessment project for a simple Work Request Tracker module.

## Scope

This repository contains a practical two-hour style assessment implementation:

- ASP.NET Core Web API backend
- React + TypeScript + Vite frontend
- Dapper + SQL Server persistence
- SQL schema included below for database fundamentals
- Validation and consistent API error responses
- Minimal tests for core backend behavior

Authentication, deployment, notifications, background jobs, and production infrastructure are intentionally out of scope.

## Project Structure

```text
backend/
  FlexGCC.WRT.Domain/
  FlexGCC.WRT.Application/
  FlexGCC.WRT.Infrastructure/
  FlexGCC.WRT.Api/
  FlexGCC.WRT.Tests/
  FlexGCC.WRT.slnx

Database/
  Objects/
  Scripts/

frontend/
  src/
    components/work-requests/
    lib/api/
    pages/
    types/
```

## Backend

The API exposes:

```text
GET    /api/v1/work-requests?status=&search=&page=&pageSize=
GET    /api/v1/work-requests/{id}
POST   /api/v1/work-requests
PATCH  /api/v1/work-requests/{id}/status
POST   /api/v1/work-requests/{id}/notes
GET    /health
```

Error responses use:

```json
{
  "code": "ValidationError",
  "message": "Work request is invalid.",
  "details": ["Title is required."]
}
```

## Architecture And Design Patterns

### Overall Architecture

This project follows a layered architecture with clear dependency direction:

- `FlexGCC.WRT.Api` -> HTTP transport, endpoint wiring, middleware, DI
- `FlexGCC.WRT.Application` -> use-case orchestration, DTO contracts, validation, result envelope
- `FlexGCC.WRT.Domain` -> core entities, enums, domain events, aggregate root behavior
- `FlexGCC.WRT.Infrastructure` -> persistence, stored procedure execution, outbox persistence, resilience plumbing
- `FlexGCC.WRT.Tests` -> unit and architecture-level tests

Dependency rule:

- `Api` depends on `Application` + `Infrastructure`
- `Infrastructure` depends on `Application` + `Domain`
- `Application` depends on `Domain`
- `Domain` depends on no higher layer

### Backend Patterns Implemented

- `Result Pattern`: operations return success/failure with structured error metadata (`Result<T>`, `ApiResponse<T>`, `ApiErrorResponse`)
- `Repository Pattern`: `IWorkRequestRepository` abstracts read/write operations from application logic
- `Unit of Work Pattern`: `IUnitOfWork`/`UnitOfWork` manages transaction boundary behavior
- `Outbox Pattern`: domain events are persisted into `OutboxMessages` through `IOutboxRepository`/`OutboxRepository`
- `Decorator Pattern`: `LoggingWorkRequestRepository` wraps repository calls for observability
- `Domain Events`: `WorkRequestCreatedEvent`, `WorkRequestStatusChangedEvent` raised from domain entity and forwarded to outbox
- `Resilience Wrapper`: SQL connection-open operation is executed via `SqlResiliencePipeline`
- `Minimal API Pattern`: endpoint grouping under `/api/v1/work-requests` with explicit request/response contracts

### Request Processing Flow

For a typical request (example: list work requests):

1. Endpoint receives query params (`status`, `search`, `page`, `pageSize`)
2. API maps to `WorkRequestService.List(...)`
3. Application validates status/paging boundaries and delegates to repository
4. Repository executes stored procedure via Dapper
5. Stored procedure performs filtering, follow-up-first ordering, paging, and note selection
6. Application maps domain models to DTOs and wraps in `PagedResult<T>`
7. API returns standardized envelope to frontend

### Data Access Design

- Dapper is used as a lightweight data mapper over SQL Server
- All primary operations are routed via stored procedures (no inline SQL in app layer)
- `usp_WorkRequests_GetAll` supports:
  - optional status filter
  - optional title/client search
  - server-side paging
  - follow-up required first ordering (`Blocked`/`InProgress`)
  - latest updated ordering within each priority band
- Notes are returned as a separate result set and hydrated in repository (`HydrateNotes`)

### Frontend Design Patterns

- `Container/Page + Presentational Components`:
  - `WorkRequestsPage` handles state, API calls, and action orchestration
  - components (`WorkRequestList`, `WorkRequestFilters`, `WorkRequestFormModal`) handle focused UI concerns
- `Single API Gateway Module`: `frontend/src/lib/api/workRequestsApi.ts`
- `Controlled Form Pattern`: add/update form modal uses controlled state and required-field validation
- `Status Grouping UI Pattern`: work requests are grouped by status with visual highlight bands

### Cross-Cutting Concerns

- `GlobalExceptionMiddleware`: centralized exception-to-response mapping
- `RequestTracingMiddleware`: per-request tracing boundary
- `CORS`: localhost dev origins configured for Vite ports (`5173`, `5174`)
- `Swagger/OpenAPI`: enabled for endpoint discovery and manual testing
- `Health Checks`: `/health` endpoint for runtime sanity verification

### Why This Design

- Keeps domain/business logic testable and independent of HTTP/DB concerns
- Supports iterative enhancement from assessment scope to production hardening
- Enables clear ownership boundaries between API contracts, business orchestration, and persistence
- Provides practical reliability hooks (outbox, resilience, middleware, structured errors) without overengineering

## Frontend

The React app includes:

- Work request list
- Status filter
- Search by title or client name
- Create request form
- Status update action
- Add note action
- Loading and error states

The frontend calls the ASP.NET Core API through `frontend/src/lib/api/workRequestsApi.ts`. Set `VITE_API_BASE_URL` if your backend runs on a different URL.

## Run Backend

Create the SQL Server schema first if the database does not exist:

```powershell
sqlcmd -S "(localdb)\MSSQLLocalDB" -d master -Q "IF DB_ID(N'FlexGCCLLC_WorkRequestTracker') IS NULL CREATE DATABASE FlexGCCLLC_WorkRequestTracker"
sqlcmd -S "(localdb)\MSSQLLocalDB" -d FlexGCCLLC_WorkRequestTracker -i Database/Scripts/001_CreateWorkRequestTracker.sql
sqlcmd -S "(localdb)\MSSQLLocalDB" -d FlexGCCLLC_WorkRequestTracker -i Database/Scripts/003_CreateStoredProcedures.sql
sqlcmd -S "(localdb)\MSSQLLocalDB" -d FlexGCCLLC_WorkRequestTracker -i Database/Scripts/002_SeedDemoData.sql
```

The default connection string is in `backend/FlexGCC.WRT.Api/appsettings.json` under `ConnectionStrings:WorkRequestTracker`.

```powershell
dotnet run --project backend/FlexGCC.WRT.Api
```

Then check:

```text
https://localhost:7080/health
https://localhost:7080/swagger
```

The exact port may differ; use the port printed by `dotnet run`.

## Run Frontend

```powershell
cd frontend
npm install
$env:VITE_API_BASE_URL="https://localhost:7080"
npm run dev
```

Open the local Vite URL printed by the command, usually:

```text
http://localhost:5173
```

## Verify

From the repository root:

```powershell
dotnet build backend/FlexGCC.WRT.slnx
dotnet test backend/FlexGCC.WRT.slnx
```

From `frontend/`:

```powershell
npm run build
```

## API Testing

Swagger UI is enabled at:

```text
https://localhost:7080/swagger
```

Import this Postman collection to test the API:

```text
postman/WorkRequestTracker.postman_collection.json
```

Set the collection `baseUrl` variable to the HTTPS or HTTP URL printed by `dotnet run`.

### Story 1.4 Notes Smoke Test

Use these checks for the notes workflow:

1. Run the SQL create and seed scripts, then start the backend.
2. Start the frontend with `VITE_API_BASE_URL` set to the backend URL.
3. In Postman, run `Create Work Request` and confirm `workRequestId` is captured.
4. Run `Add Work Request Note` and expect `200 OK` with `workRequestId`, `noteText`, and `createdDate`.
5. Run `Get Work Request By Id` and confirm the new note appears in `notes`.
6. Run `Add Work Request Note - Validation Error` and expect `400 ValidationError`.
7. Run `Add Work Request Note - Not Found` and expect `404 NotFound`.
8. In the React admin panel, add a note from a request row, refresh the browser, and confirm the note still displays from the SQL-backed API.

## SQL Schema

Manual SQL Server scripts are available under:

```text
Database/Scripts/001_CreateWorkRequestTracker.sql
Database/Scripts/002_SeedDemoData.sql
Database/Scripts/003_CreateStoredProcedures.sql
Database/Scripts/999_DropWorkRequestTracker.sql
```

Object-level table and index definitions are under `Database/Objects/`.

The API runtime uses Dapper through stored procedures only. Inline SQL is kept in database scripts, not in application code.

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

`IX_WorkRequests_Status_DueDate` helps status filtering and due-date ordering. `IX_WorkRequests_ClientName_Title` supports common client/title search paths for assessment-scale data.

## Known Issues / Not Done

- Authentication and authorization are not implemented.
- SQL Server must be created manually with the scripts under `Database/Scripts`.
- Status transition rules are not enforced beyond enum validation.
- Styling is intentionally minimal and assessment-focused.
- Paging on Work Request Tracke List.
