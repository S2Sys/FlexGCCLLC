# Work Request Tracker Assessment Plan

Generated   : 2026-05-21
Author      : Senthilvel T
Command     : /swp-plan
Source      : .docs/SRS.md, .docs/ARCH-DESIGN.md, .docs/UI-DESIGN.md, .docs/DB-DESIGN.md
Scope       : Job code assessment / direct delivery plan

## Planning Decision

Signal: GO

This project uses the assessment delivery path. Azure DevOps item creation is intentionally skipped because the work is direct-checkin assessment scope, not a managed production backlog.

## Level 1 - Epic List

### Epic 1: Work Request Tracker

Description: Deliver a small internal tracker for creating, viewing, filtering, updating, and annotating work requests.

DB Schema: `dbo`

SRS Coverage:
- Functional Requirements 1-6
- API Requirements
- Data Fields
- Acceptance Criteria 1-8

Priority: High

Stories estimated: 5

## Level 2 - Story List

| Story ID | Title | Priority | Complexity | Depends On | Status |
|---|---|---|---|---|---|
| 1.1 | As a user, I want to view and search work requests, so that I can find the right request quickly. | Must Have | S | none | Implemented |
| 1.2 | As a user, I want to create a work request, so that new client work can be tracked. | Must Have | M | 1.1 | Implemented |
| 1.3 | As a user, I want to update request status, so that request progress is visible. | Must Have | S | 1.1 | Implemented |
| 1.4 | As a user, I want to add notes to a request, so that follow-up context is preserved. | Must Have | S | 1.1 | Implemented |
| 1.5 | As a reviewer, I want database scripts and documentation, so that I can inspect or manually run the schema. | Must Have | S | none | Implemented |

### Story 1.1 Acceptance Criteria

- AC1: Work request list displays existing requests.
- AC2: Status filter narrows visible results.
- AC3: Search filters by title or client name.
- AC4: Loading and empty states are visible when applicable.

### Story 1.2 Acceptance Criteria

- AC1: Create form captures title, client name, description, priority, status, and due date.
- AC2: Required fields block incomplete submission.
- AC3: Created requests appear in the visible list.
- AC4: Invalid priority/status is rejected by backend validation.

### Story 1.3 Acceptance Criteria

- AC1: Each request row exposes a status selector.
- AC2: Status update persists to the local data source/API repository.
- AC3: Updated date changes after status update.

### Story 1.4 Acceptance Criteria

- AC1: Each request row exposes a note input.
- AC2: Empty note text is rejected.
- AC3: Saved notes display under the related request.

### Story 1.5 Acceptance Criteria

- AC1: SQL Server create script exists under `Database/Scripts`.
- AC2: Demo seed script exists under `Database/Scripts`.
- AC3: Drop script exists for manual rollback.
- AC4: Object-level table and index scripts exist under `Database/Objects`.

## Level 3 - Task List

| Task ID | Story | Layer | Files / Areas | Status |
|---|---|---|---|---|
| 1.1.A | 1.1 | Backend API | `WorkRequestsController`, service list method | Implemented |
| 1.1.B | 1.1 | Frontend | `WorkRequestsPage`, `WorkRequestFilters`, `WorkRequestList` | Implemented |
| 1.1.C | 1.1 | Tests | `WorkRequestServiceTests` | Implemented |
| 1.2.A | 1.2 | Backend validation | DTOs, `WorkRequestValidator`, service create method | Implemented |
| 1.2.B | 1.2 | Frontend form | `CreateWorkRequestForm` | Implemented |
| 1.3.A | 1.3 | Backend status update | status DTO, enum validation, service update method | Implemented |
| 1.3.B | 1.3 | Frontend status action | `StatusUpdateButton`, row refresh | Implemented |
| 1.4.A | 1.4 | Backend notes | note DTO, repository/service note method | Implemented |
| 1.4.B | 1.4 | Frontend notes | row note form and notes display | Implemented |
| 1.4.C | 1.4 | Notes verification | backend tests, Postman assertions, README smoke checklist | Implemented |
| 1.5.A | 1.5 | Database scripts | `Database/Scripts/*.sql`, `Database/Objects/**/*.sql` | Implemented |
| 1.5.B | 1.5 | Documentation | `README.md` database and run instructions | Implemented |

## Level 4 - Subtask / File Map

| Subtask ID | File | Purpose | Status |
|---|---|---|---|
| 1.1.A.1 | `backend/FlexGCCLLC.WorkRequestTracker.Api/Controllers/WorkRequestsController.cs` | API endpoints for list/detail/create/status/note. | Implemented |
| 1.1.A.2 | `backend/FlexGCCLLC.WorkRequestTracker.Api/Features/WorkRequests/WorkRequestService.cs` | Business orchestration and validation results. | Implemented |
| 1.1.A.3 | `backend/FlexGCCLLC.WorkRequestTracker.Api/Features/WorkRequests/InMemoryWorkRequestRepository.cs` | Assessment data persistence. | Implemented |
| 1.2.B.1 | `frontend/src/pages/WorkRequestsPage.tsx` | Page state, loading, errors, mutations. | Implemented |
| 1.2.B.2 | `frontend/src/components/admin/AdminShell.tsx` | Approved admin panel shell. | Implemented |
| 1.2.B.3 | `frontend/src/components/work-requests/CreateWorkRequestForm.tsx` | Create workflow. | Implemented |
| 1.3.B.1 | `frontend/src/components/work-requests/StatusUpdateButton.tsx` | Status change control. | Implemented |
| 1.4.B.1 | `frontend/src/components/work-requests/WorkRequestList.tsx` | Request cards and notes. | Implemented |
| 1.4.C.1 | `backend/FlexGCCLLC.WorkRequestTracker.Tests/WorkRequestServiceTests.cs` | Notes behavior tests. | Implemented |
| 1.4.C.2 | `postman/WorkRequestTracker.postman_collection.json` | Notes API smoke requests and assertions. | Implemented |
| 1.4.C.3 | `README.md` | Story 1.4 notes smoke test instructions. | Implemented |
| 1.5.A.1 | `Database/Scripts/001_CreateWorkRequestTracker.sql` | Manual create script. | Implemented |
| 1.5.A.2 | `Database/Scripts/002_SeedDemoData.sql` | Manual demo seed script. | Implemented |
| 1.5.A.3 | `Database/Scripts/999_DropWorkRequestTracker.sql` | Manual rollback/drop script. | Implemented |
| 1.5.B.1 | `README.md` | Assessment run, verify, SQL script guidance. | Implemented |

## Verification Plan

Run from repository root:

```powershell
dotnet build backend/FlexGCCLLC.WorkRequestTracker.slnx
dotnet test backend/FlexGCCLLC.WorkRequestTracker.slnx
```

Run from `frontend/`:

```powershell
npm run lint
npm run build
```

Manual UI smoke:

```powershell
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

Open `http://127.0.0.1:5173` and verify:
- list loads
- status filter works
- search works
- create request works
- status update works
- add note works
- admin shell is visible

Manual DB smoke:
- Run `Database/Scripts/001_CreateWorkRequestTracker.sql`
- Run `Database/Scripts/002_SeedDemoData.sql`
- Verify both tables contain expected data
- Run `Database/Scripts/999_DropWorkRequestTracker.sql` only when cleanup is needed

## Go / No-Go

| Area | Status | Evidence |
|---|---|---|
| SRS coverage | GO | Stories cover AC 1-8. |
| Backend | GO | API/service/Dapper repository/tests implemented. |
| Frontend | GO | React admin panel implemented and pushed. |
| Database | GO | Manual scripts committed under `Database/`. |
| Documentation | GO | Root `README.md` kept as only committed root markdown. |
| Assessment scope | GO | Auth/cloud/ADO/tenant features intentionally omitted. |

## Phase 3 Result

Phase 3 plan is complete for assessment scope.

Next delivery command, if additional coding is requested:

```text
/swd-start [Story ID]
```

For this assessment, all listed Must Have stories are already implemented and pushed.
