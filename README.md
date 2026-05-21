# Work Request Tracker Assessment

Draft assessment project for a simple Work Request Tracker module.

## Scope

This repository contains a practical two-hour style assessment implementation:

- ASP.NET Core Web API backend
- React + TypeScript + Vite frontend
- In-memory persistence for quick review
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

The frontend uses mock/in-memory data in `frontend/src/lib/api/workRequestsApi.ts` so it can be reviewed quickly without requiring the API to run.

## Run Backend

```powershell
dotnet run --project backend/FlexGCCLLC.WorkRequestTracker.Api
```

Then check:

```text
https://localhost:7000/health
```

The exact port may differ; use the port printed by `dotnet run`.

## Run Frontend

```powershell
cd frontend
npm install
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
- Persistence is in-memory for the backend scaffold.
- Frontend currently uses mock data for quick standalone review.
- Status transition rules are not enforced beyond enum validation.
- Styling is intentionally minimal and assessment-focused.

## AI Assistance Disclosure

AI assistance was used to scaffold and organize the assessment project, including backend structure, React component structure, validation flow, README text, and verification steps. The implementation was reviewed and verified with local build and test commands.
