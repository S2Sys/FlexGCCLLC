# Work Request Tracker Assessment SRS

Version     : SRS-v0.1
Approved    : 2026-05-21
Author      : Senthilvel T
Source      : docs/srs/SRS.md
Scope       : Job code assessment / two-hour assignment

## Revision History

| Version | Date | Author | Summary |
|---|---|---|---|
| SRS-v0.1 | 2026-05-21 | Senthilvel T | Root SRS wrapper created for SmartWorkz++ command prerequisites. |

## PATH CONFIRMED

Flow name       : Assessment Minimal Delivery
Phase 0 command : /swp-srs
Phase 1 command : /swp-arch
Phase 2 command : /swp-design
Phase 3 command : /swp-plan

## STACK CONFIRMED

Product                 : Work Request Tracker Assessment
Backend                 : ASP.NET Core Web API
Backend version         : .NET 8
Frontend                : React
Frontend version        : React 18+ with TypeScript
Database                : SQL schema required; implementation may use in-memory list, SQLite, or SQL Server
ORM                     : Dapper selected for SQL Server persistence; Entity Framework Core not used
Auth                    : Out of scope for assessment
Logging                 : Basic structured API error response; production logging out of scope
Tests                   : Manual verification required; unit/integration tests optional if time permits
Cloud                   : Out of scope
Namespace               : FlexGCCLLC.WorkRequestTracker
DB Schema pattern       : dbo schema with WorkRequests and WorkRequestNotes
SP prefix               : Not applicable
Approved NuGet packages : ASP.NET Core, Dapper, Microsoft.Data.SqlClient, FluentValidation optional
Approved npm packages   : React, TypeScript, Vite

API versioning strategy       : None for assessment; production improvement would use /api/v1
Caching strategy              : None
Secret management             : None; no secrets required
Observability stack           : None for assessment
Message broker                : None
File / blob storage           : None
Email / notification provider : None
CI/CD pipeline                : None for assessment
Pipeline level                : None
Environment strategy          : Local development only

Response envelope        : Basic JSON response; errors use consistent error object
Error response format    : { code, message, details }
Date/time format         : ISO 8601 UTC strings
Null handling strategy   : Optional fields may be null
Filtering/sorting params : status, search, page, pageSize query parameters

Naming conventions       : C# PascalCase for public members; camelCase for JSON/TypeScript
Error hierarchy          : Validation, NotFound, InvalidStatus, InvalidPriority, ServerError
Async pattern            : Async API methods preferred when persistence supports it
Constants                : Enums for Priority and Status
Structured logging       : Out of scope; do not log confidential data

Architecture pattern     : Simple vertical feature module with clear API, DTO, validation, persistence boundaries
Layer rules              : API depends on feature services/repository; persistence does not depend on API
DI lifetime              : Scoped repository/service for database-backed implementation; singleton acceptable only for in-memory mock list
Module boundaries        : WorkRequest feature only
Circular dependencies    : Not allowed
Testing pyramid          : Manual smoke test minimum; optional unit tests for validation/status update
Coverage target          : Not required for assessment
Test naming              : Should describe behavior when tests are added
Test data strategy       : Mock/sample work requests only

## Glossary

| Term | Definition |
|---|---|
| Work Request | A tracked request with title, client, description, priority, status, dates, and notes. |
| Priority | One of Low, Medium, or High. |
| Status | One of New, InProgress, Blocked, or Completed. |
| Note | Optional text added to a work request after creation. |

## Assumptions

| # | Assumption | Source |
|---|---|---|
| 1 | This is a job code assessment, not a production product build. | docs/srs/SRS.md |
| 2 | Authentication, deployment, notifications, and advanced styling are out of scope. | Assignment time limit and instructions |
| 3 | Mock data is acceptable. | Candidate instructions |
| 4 | The reviewer values clean structure and practical trade-offs over feature volume. | Candidate instructions |

## Functional Requirements

1. User can view a paginated list of work requests.
2. User can filter work requests by status.
3. User can search work requests by title or client name.
4. User can create a new work request.
5. User can update the status of a work request.
6. User can add a note to a work request.

## Data Fields

| Field | Required | Notes |
|---|---|---|
| Id | Yes | Unique identifier. |
| Title | Yes | Required text. |
| ClientName | Yes | Required text. |
| Description | Yes | Required text. |
| Priority | Yes | Low, Medium, High. |
| Status | Yes | New, InProgress, Blocked, Completed. |
| DueDate | Yes | ISO 8601 date/time. |
| CreatedDate | Yes | Set on creation. |
| UpdatedDate | Yes | Updated when status or notes change. |
| Notes | No | Stored as related note rows or optional list. |

## API Requirements

| Method | Path | Purpose |
|---|---|---|
| GET | /api/work-requests?status=&search=&page=&pageSize= | List, filter, search, and page work requests. |
| GET | /api/work-requests/{id} | Get one work request. |
| POST | /api/work-requests | Create a work request. |
| PATCH | /api/work-requests/{id}/status | Update status. |
| POST | /api/work-requests/{id}/notes | Add note. |

## Definition of Done

1. Backend endpoints compile and handle required success/error cases.
2. Missing required fields, invalid status, invalid priority, and not-found cases return a consistent error response.
3. SQL schema includes primary keys, note relationship, and at least two useful indexes.
4. Frontend includes list, status filter, search input, create flow, status update action, loading state, and error state.
5. Architecture note explains structure, trade-offs, production improvements, demo focus, and known risks.
6. Known Issues / Not Done and AI Assistance Disclosure sections are completed.

## Out of Scope

Authentication, authorization, production deployment, background jobs, notifications, advanced styling, multi-tenant security, full CI/CD, cloud infrastructure, and enterprise reporting are out of scope for the two-hour assessment unless mentioned as future improvements.

## Acceptance Criteria

1. User can see a paginated list of work requests.
2. User can filter work requests by status.
3. User can search work requests by title or client name.
4. User cannot create a request without title, client name, priority, status, and due date.
5. User receives a clear error for invalid priority or invalid status.
6. User can update a work request status.
7. User can add a note to an existing work request.
8. User sees loading and error states in the frontend.

## Approval

Phase 0 approval phrase accepted: SRS approved
Approved by                  : Senthilvel T
