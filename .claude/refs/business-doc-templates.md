# Business Documentation Templates

Use this reference from `/sw-docs` when generating HR, admin, operations, policy, form, checklist, handbook, or tracker artifacts.

## Output Paths

Default generated files:

- Markdown or Word-ready documents: `docs/business/[type]-[topic]-[YYYY-MM-DD].md`
- Excel-ready tracker specs: `docs/business/[type]-[topic]-[YYYY-MM-DD].md`
- CSV templates when requested: `docs/business/[topic]-template-[YYYY-MM-DD].csv`
- Session handoff when committed: `docs/sessions/pr-sw-docs-[topic]-[YYYY-MM-DD].md`

Use lowercase kebab-case for filenames. Do not overwrite an existing business document unless the user explicitly says `overwrite approved`.

## Universal Document Structure

For policy, SOP, handbook, guideline, form, checklist, or letter outputs:

```markdown
# [Document Title]

Document owner: [HR / Admin / Operations / Manager / DATA GAP]
Audience: [employees / managers / admin / client / DATA GAP]
Effective date: [date or DATA GAP]
Review cycle: [quarterly / half-yearly / annual / DATA GAP]
Approval required from: [role / DATA GAP]

## Purpose

## Scope

## Definitions

## Policy / Procedure

## Roles and Responsibilities

## Exceptions

## Records and Evidence

## Review and Approval

## Change History

| Version | Date | Owner | Change |
|---|---|---|---|
| 0.1 | [YYYY-MM-DD] | [owner] | Draft created |
```

If legal, payroll, compliance, or statutory rules are involved, mark jurisdiction-specific points as `DATA GAP` and recommend HR/legal review.

## Policy Types

### Leave Policy

Include:

- leave categories
- eligibility
- accrual or entitlement
- request and approval workflow
- notice period
- documentation proof
- carry-forward or encashment rules
- leave during probation
- unpaid leave handling
- abuse or exception handling

Required data gaps:

- country/state jurisdiction
- annual leave entitlement
- sick leave entitlement
- holiday calendar owner
- manager approval chain
- payroll impact rules

### Attendance Policy

Include:

- working hours
- grace period
- late mark rules
- remote work or work-from-home attendance
- shift handling
- overtime handling
- missed punch correction
- attendance regularization workflow
- monthly closure and payroll handoff

### Asset Policy

Include:

- asset categories
- assignment rules
- handover checklist
- acceptable use
- damage/loss reporting
- return process
- exit clearance
- audit frequency

### Employee Handbook

Include:

- company overview
- employment basics
- working hours and attendance
- leave
- conduct
- data security
- reimbursement basics
- performance review
- grievance path
- exit process

## SOP Structure

```markdown
# SOP: [Process Name]

Owner:
Trigger:
Inputs:
Outputs:
Systems used:
SLA:

## Steps

| Step | Actor | Action | Evidence / Output | SLA |
|---:|---|---|---|---|

## Exception Handling

## Escalation

## Controls

## Revision History
```

## Tracker Columns

### Employee Master Tracker

Columns:

- Employee ID
- Full Name
- Work Email
- Department
- Designation
- Manager
- Employment Type
- Date of Joining
- Work Location
- Status
- Emergency Contact
- Documents Received
- Notes

Suggested validations:

- Status: Active, Probation, Notice, Exited
- Employment Type: Full-time, Part-time, Contract, Intern
- Documents Received: Yes, No, Partial

### Attendance Tracker

Columns:

- Date
- Employee ID
- Employee Name
- Department
- Shift
- Check In
- Check Out
- Total Hours
- Attendance Status
- Late Minutes
- Regularization Required
- Manager Approval
- Notes

Suggested formulas:

- Total Hours: `=IF(AND([@[Check In]]<>"",[@[Check Out]]<>""),[@[Check Out]]-[@[Check In]],"")`
- Late Minutes: compare Check In against shift start time.
- Monthly Present Days: `=COUNTIF([Attendance Status],"Present")`

Validations:

- Attendance Status: Present, Absent, Half Day, Leave, Holiday, Week Off
- Regularization Required: Yes, No
- Manager Approval: Pending, Approved, Rejected, Not Required

### Leave Tracker

Columns:

- Request ID
- Employee ID
- Employee Name
- Leave Type
- Start Date
- End Date
- Days
- Reason
- Backup Owner
- Status
- Approved By
- Approval Date
- Payroll Impact
- Notes

Suggested formula:

- Days: `=IF(AND([@[Start Date]]<>"",[@[End Date]]<>""),[@[End Date]]-[@[Start Date]]+1,"")`

Validations:

- Status: Draft, Submitted, Approved, Rejected, Cancelled
- Payroll Impact: Paid, Unpaid, DATA GAP

### Asset Tracker

Columns:

- Asset ID
- Asset Type
- Make / Model
- Serial Number
- Purchase Date
- Warranty End Date
- Assigned To
- Employee ID
- Assignment Date
- Condition
- Location
- Status
- Return Date
- Last Audit Date
- Notes

Validations:

- Asset Type: Laptop, Desktop, Monitor, Mobile, Access Card, Software License, Other
- Condition: New, Good, Needs Repair, Damaged, Retired
- Status: In Stock, Assigned, Under Repair, Lost, Retired

### Training Tracker

Columns:

- Training ID
- Topic
- Employee ID
- Employee Name
- Department
- Assigned Date
- Due Date
- Completion Date
- Score
- Status
- Certificate Link
- Notes

Validations:

- Status: Not Started, In Progress, Completed, Overdue, Waived

## Excel-Ready Output Requirements

When the user asks for Excel:

1. Produce a sheet plan with sheet names, columns, types, validations, formulas, and sample rows.
2. If a `.xlsx` file is requested and spreadsheet tooling is available, create it.
3. If only markdown is appropriate, generate an Excel-ready spec and optional CSV template content.
4. Mark unknown company-specific rules as `DATA GAP`.

## Review Routing

Recommend review owner by document class:

- HR policy, handbook, employee tracker: HR Manager
- Attendance, leave, payroll-impact tracker: HR Manager + Payroll
- Asset tracker, laptop handover SOP: Admin / IT Manager
- Security or device-use policy: IT Manager + Security owner
- Legal or statutory language: HR Manager + Legal
