# Assignment Response - Work Request Tracker

## A. Submission Link / File Notes

Repository link: https://github.com/S2Sys/FlexGCCLLC

Backend folder/path: `backend/FlexGCCLLC.WorkRequestTracker.Api`

Frontend folder/path: `frontend`

How to run or review:

1. Backend:

   ```powershell
   dotnet run --project backend/FlexGCCLLC.WorkRequestTracker.Api
   ```

2. Frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

3. Verification:

   ```powershell
   dotnet build backend/FlexGCCLLC.WorkRequestTracker.slnx
   dotnet test backend/FlexGCCLLC.WorkRequestTracker.slnx
   cd frontend
   npm run build
   ```

## B. Implementation Summary

I completed a draft Work Request Tracker module with an ASP.NET Core Web API backend and a React + TypeScript + Vite frontend. The backend exposes endpoints for listing, filtering, searching, creating, status updates, notes, and health checks. The frontend provides a simple tracker screen with status filtering, search, create form, status update action, add-note action, loading state, and error state.

The backend uses in-memory persistence to keep the assessment easy to run and review. A SQL schema is included below to show the intended relational model and indexing approach.

## C. Backend Code / Structure Notes

Important backend paths:

```text
backend/FlexGCCLLC.WorkRequestTracker.Api/
  Controllers/WorkRequestsController.cs
  Features/WorkRequests/
    Dtos/
    Models/
    Validation/
    IWorkRequestRepository.cs
    InMemoryWorkRequestRepository.cs
    WorkRequestService.cs
  Program.cs
```

Implemented API endpoints:

```text
GET    /api/work-requests?status=&search=&page=&pageSize=
GET    /api/work-requests/{id}
POST   /api/work-requests
PATCH  /api/work-requests/{id}/status
POST   /api/work-requests/{id}/notes
GET    /health
```

The controller is intentionally thin. Business validation and mapping are handled in `WorkRequestService`, while persistence is hidden behind `IWorkRequestRepository`.

## D. Backend Validation and Error Handling

The backend validates required fields for create requests:

- Title
- Client name
- Description
- Priority
- Status
- Due date

It also handles:

- Invalid status
- Invalid priority
- Missing work request ID
- Empty note text

Error responses use a consistent shape:

```json
{
  "code": "ValidationError",
  "message": "Work request is invalid.",
  "details": ["Title is required."]
}
```

Main error codes:

```text
ValidationError
InvalidStatus
InvalidPriority
NotFound
ServerError
```

## E. SQL Schema and Indexes

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

Index explanation:

`IX_WorkRequests_Status_DueDate` helps the list endpoint filter by status and return due-date-oriented work. `IX_WorkRequests_ClientName_Title` supports common review/search scenarios where users look up work by client name or title.

## F. Frontend Code / Structure Notes

Important frontend paths:

```text
frontend/src/
  App.tsx
  pages/WorkRequestsPage.tsx
  components/work-requests/
    CreateWorkRequestForm.tsx
    StatusUpdateButton.tsx
    WorkRequestFilters.tsx
    WorkRequestList.tsx
  lib/api/workRequestsApi.ts
  types/workRequest.ts
```

The frontend includes:

- Work request list
- Status filter
- Search input
- Create request form
- Status update action
- Add note action
- Loading and error states

For quick review, the React app uses mock/in-memory data in `workRequestsApi.ts`. This keeps the UI easy to run even if the backend is not started.

## G. Architecture Note

The solution is intentionally small and assessment-focused. On the backend, I used a feature-first structure under `Features/WorkRequests` so the module remains easy to review without spreading one small feature across many projects. The controller handles HTTP concerns and delegates the core behavior to `WorkRequestService`. The service validates create/status/note operations, maps entities to DTOs, and returns a consistent result object. Persistence is represented by `IWorkRequestRepository`, with an in-memory implementation for the assessment.

The frontend uses React with TypeScript and Vite. I kept state local to `WorkRequestsPage` because the module has a single screen and does not need global state management. Components are split by responsibility: filters, create form, list, and status update control. The frontend includes loading and error states and uses mock data so reviewers can run it quickly.

The main trade-off is that this is not production-ready persistence. I chose in-memory storage to fit the assignment time limit while still showing the API shape, validation, error handling, DTOs, and SQL design. In production, I would add EF Core or Dapper persistence, database migrations, authentication/authorization, structured logging, request correlation, stronger status transition rules, integration tests, and API-to-frontend wiring through environment-based configuration.

For a demo, I would first show the frontend list, filtering, search, create form, status update, and note entry. Then I would show the backend endpoints and service tests. Remaining risks are mainly around production persistence, auth, and frontend/API integration.

## H. Acceptance Criteria

1. User can see a list of work requests.
2. User can filter work requests by status.
3. User can search work requests by title or client name.
4. User cannot create a request without required fields.
5. User receives a clear error for validation failures.
6. User can update the status of a work request.
7. User can add a note to an existing work request.
8. User sees loading and error states in the frontend.

## I. Known Issues / Not Done

- Authentication and authorization are not implemented.
- Backend persistence is in-memory.
- Frontend uses mock/in-memory data for quick standalone review.
- Status transition rules are not enforced beyond enum validation.
- Styling is intentionally minimal.
- API/frontend integration can be completed by replacing the mock frontend API adapter with HTTP calls.

## J. AI Assistance Disclosure

Did you use AI assistance? Yes.

Tool used: OpenAI Codex / ChatGPT.

What AI helped with:

- Structuring the assessment implementation
- Creating backend service/repository/controller structure
- Creating React component structure
- Drafting validation and error handling approach
- Drafting README and assignment response text
- Running and summarizing verification commands

What I personally reviewed, changed, or verified:

- Project scope and stack choices
- Backend endpoints and validation behavior
- SQL schema and index rationale
- Frontend structure and user flows
- Known limitations and trade-offs
- Local verification with build and test commands

## K. Final Submission Checklist

- [ ] I attached or linked my updated CV.
- [ ] I completed the questionnaire.
- [x] I included the backend portion of the assignment.
- [x] I included the frontend portion of the assignment.
- [x] I included SQL schema and indexes.
- [x] I included an architecture note.
- [x] I included acceptance criteria and known issues.
- [x] I disclosed AI assistance.
- [x] I did not include confidential or proprietary code/data.
