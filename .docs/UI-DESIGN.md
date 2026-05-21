# UI/UX Design - Work Request Tracker Assessment

Generated : 2026-05-21
Author    : Senthilvel T
Command   : /swp-design UI_ONLY
Source    : .docs/SRS.md, .docs/ARCH-DESIGN.md
Scope     : Assessment UI/UX only

## Mode

Mode              : UI_ONLY
Frontend stack    : React 18+ / TypeScript / Vite
App surface       : Small internal work tracker screen
Design reference  : .claude/templates/mock-design/admin
Animation         : None beyond native focus/hover states
Charts            : None
Table/grid        : Responsive card/list layout
Approval phrase   : ui section reviewed

## Admin Template Baseline

Use this template path as the UI baseline:

```text
.claude/templates/mock-design/admin
```

Template areas reviewed:

| Template File | Use For This Assessment |
|---|---|
| `src/shell.jsx` | Admin shell pattern: sidebar/topbar/content frame, responsive mobile overlay, top search, profile/notification actions. |
| `src/components.jsx` | Shared admin primitives: breadcrumb, dropdown menu, side panel. |
| `src/forms.jsx` | Field validation, labeled form field, required indicators, inline errors. |
| `src/screens/dashboard.jsx` | Dense internal dashboard composition, KPI/card rhythm, section header actions. |

Carry / adapt / discard:

| Template Pattern | Decision | Reason |
|---|---|---|
| Sidebar + topbar shell | Adapt | Good for internal modules, but current assessment only needs one Work Request screen. |
| Search command/topbar | Adapt | Use as future global search pattern; current page-level search is enough. |
| FormField validation style | Carry | Matches required create form and validation messaging. |
| SidePanel | Adapt | Good future create/edit pattern; current inline form is simpler for two-hour scope. |
| KPI/charts | Discard | Assignment does not request dashboards or analytics. |
| User/billing/team screens | Discard | Outside assessment scope. |

## Screen Inventory

| Screen | Route/View | Purpose | SRS Coverage |
|---|---|---|---|
| Work Requests | `WorkRequestsPage` | List, filter, search, create, update status, add note | AC 1-8 |

## User Flow

1. User opens the Work Request Tracker page.
2. Page loads work requests and shows a visible count.
3. User filters by status or searches by title/client name.
4. User creates a new work request from the form.
5. User updates status from a row-level status selector.
6. User adds a note from the row-level note form.
7. Page refreshes the visible list after each mutation.
8. Validation or operation failures show an inline error banner.

## Desktop Wireframe

```text
------------------------------------------------------------
Code assessment module                [ visible requests ]
Work Request Tracker                  [ count summary    ]
------------------------------------------------------------
[ Status select ] [ Search by title/client                  ]
------------------------------------------------------------
| Create request form      | Work request list              |
| - Title                  | +----------------------------+ |
| - Client                 | | Title          [Priority]   | |
| - Priority / Status      | | Client                     | |
| - Due date               | | Description                | |
| - Description            | | Due date  [Status select]  | |
| [Create request]         | | [Note input] [Add note]    | |
|                          | +----------------------------+ |
------------------------------------------------------------
```

## Mobile Wireframe

```text
--------------------------------
Code assessment module
Work Request Tracker
[ count summary ]
--------------------------------
[ Status select ]
[ Search input  ]
--------------------------------
Create request form
[ Title       ]
[ Client      ]
[ Priority    ]
[ Status      ]
[ Due date    ]
[ Description ]
[ Create      ]
--------------------------------
Request card
Title [Priority]
Client
Description
Due date
[ Status select ]
[ Note input ]
[ Add note ]
--------------------------------
```

## Components

| Component | Responsibility |
|---|---|
| `WorkRequestsPage` | Owns local state, loading, error, refresh, and orchestration. |
| `WorkRequestFilters` | Status filter and search input. |
| `CreateWorkRequestForm` | Required fields and create action. |
| `WorkRequestList` | Empty state and request rows. |
| `StatusUpdateButton` | Row-level status update selector. |

## States

| State | UI Behavior |
|---|---|
| Loading | Shows `Loading work requests...` in the list panel. |
| Empty | Shows `No work requests match the current filters.` |
| Error | Shows red inline error banner above the content grid. |
| Saving | Create button changes to `Creating...` and disables. |
| Success | List reloads after create, status update, or note add. |
| Validation | Native required-field validation plus error text from data adapter. |

## Accessibility

- Form controls use visible labels.
- Buttons and selects use native keyboard behavior.
- Status update select has an `aria-label`.
- Touch targets are at least 40px in the current implementation; recommended production target is 44px.
- Error banner uses visible text and high-contrast red styling.
- No color-only dependency for priority: each badge also includes text.

## Responsive Rules

- Desktop uses a two-column grid: create form left, list panel right.
- At `max-width: 820px`, the page collapses to one column.
- Row metadata and note entry stack vertically on mobile.
- Inputs and selects expand to full width on mobile.

## Visual Direction

The UI follows the admin template direction but stays assessment-focused:

- Light neutral page background.
- White bordered panels.
- Blue primary action.
- Red error banner.
- Priority badges use distinct semantic colors.
- No decorative hero, charts, or marketing sections.
- Admin/internal layout density instead of public-site/landing-page composition.

## Token Snapshot

| Token | Current Value / Rule |
|---|---|
| Page background | `#f5f7fa` |
| Surface | `#ffffff` |
| Primary | `#2563eb` |
| Text heading | `#0f172a` |
| Text body | `#1f2933` |
| Muted text | `#64748b` |
| Border | `#dbe3ef`, `#e2e8f0` |
| Error background | `#fef2f2` |
| Error text | `#991b1b` |
| Radius | `6px` controls, `8px` panels/cards |

## SRS Acceptance Criteria Mapping

| AC | UI Coverage |
|---|---|
| User can see a paginated/list view of work requests. | `WorkRequestList`, visible count summary. |
| User can filter by status. | `WorkRequestFilters` status select. |
| User can search by title or client name. | `WorkRequestFilters` search input. |
| User cannot create without required fields. | `CreateWorkRequestForm` required fields. |
| User receives clear validation errors. | Error banner and native validation. |
| User can update status. | `StatusUpdateButton`. |
| User can add a note. | Row-level note form. |
| User sees loading and error states. | Loading text and error banner. |

## UI/UX Go/No-Go

| Dimension | Score | Evidence |
|---|---:|---|
| Screen coverage | 20/20 | Single assessment screen covers all ACs. |
| Navigation | 18/20 | Single-page flow has no dead ends; no route complexity needed. |
| Accessibility | 17/20 | Native controls and labels present; 44px target is recommended improvement. |
| Dark mode | 10/15 | Not implemented; acceptable for assessment, listed as future improvement. |
| State management | 15/15 | Local React state is sufficient for one screen. |
| Permission matrix | 10/10 | Auth/roles are out of scope. |

Total   : 90/100
Verdict : GO for assessment UI/UX

## Known UI Improvements

- Wrap the current page in the admin template shell if the assessment is expanded beyond one screen.
- Use the template `FormField` pattern for richer inline validation.
- Move create/edit into the template side panel if reviewer expects a dashboard-style modal workflow.
- Add dark mode if production polish is required.
- Raise all touch targets from 40px to 44px.
- Replace mock frontend data adapter with real HTTP API calls.
- Add inline field-level API validation messages.
- Add pagination controls if dataset grows beyond assessment size.

## Gate

SECTION A (UI/UX) COMPLETE

UI/UX Go/No-Go          : GO
Deep UI checks executed : responsive review, state coverage, accessibility review

Approval accepted locally for assessment scope:

```text
ui section reviewed
```
