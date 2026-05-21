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
  FlexGCCLLC.WorkRequestTracker.Api/
  FlexGCCLLC.WorkRequestTracker.Tests/
  FlexGCCLLC.WorkRequestTracker.slnx

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
GET    /api/work-requests?status=&search=&page=&pageSize=
GET    /api/work-requests/{id}
POST   /api/work-requests
PATCH  /api/work-requests/{id}/status
POST   /api/work-requests/{id}/notes
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
sqlcmd -S "(localdb)\MSSQLLocalDB" -d FlexGCCLLC_WorkRequestTracker -i Database/Scripts/002_SeedDemoData.sql
```

The default connection string is in `backend/FlexGCCLLC.WorkRequestTracker.Api/appsettings.json` under `ConnectionStrings:WorkRequestTracker`.

```powershell
dotnet run --project backend/FlexGCCLLC.WorkRequestTracker.Api
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
dotnet build backend/FlexGCCLLC.WorkRequestTracker.slnx
dotnet test backend/FlexGCCLLC.WorkRequestTracker.slnx
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
Database/Scripts/999_DropWorkRequestTracker.sql
```

Object-level table and index definitions are under `Database/Objects/`.

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
