# HR and Admin Workflow Reference

Use this reference from `/sw-hr` and `/sw-admin`. Use `/sw-docs` for document, form, checklist, handbook, and tracker generation.

## Shared Rules

- Mark missing company-specific, statutory, payroll, legal, or compliance rules as `DATA GAP`.
- Recommend review owners instead of pretending a workflow is legally final.
- Do not write repo files until the exact approval phrase documented by the command is received.
- When repo files are written, publish through `.claude/refs/approval-publish-contract.md`.

## HR Workflow Modes

### Employee Onboarding

Inputs:

- employee name or placeholder
- department
- role/designation
- joining date
- manager
- work location
- employment type
- required documents
- systems/access needed

Outputs:

- onboarding checklist
- first-day agenda
- document collection checklist
- access request list
- probation checkpoint plan
- optional `/sw-docs checklist employee onboarding`

### Employee Exit

Inputs:

- employee name or placeholder
- last working day
- manager
- department
- asset owner
- knowledge transfer owner
- pending dues status

Outputs:

- exit checklist
- access revocation list
- asset return checklist
- knowledge transfer plan
- clearance owner matrix
- optional `/sw-docs checklist employee exit`

### Leave Request Workflow

Inputs:

- leave type
- dates
- reporting manager
- backup owner
- payroll impact rules

Outputs:

- approval routing
- leave balance/data gap note
- handover checklist
- tracker update instructions
- optional `/sw-docs tracker leave tracker excel`

### Attendance Regularization

Inputs:

- employee
- date
- missing punch or variance
- reason
- manager approver
- payroll cutoff date

Outputs:

- regularization decision path
- evidence required
- approval owner
- tracker update instructions
- optional `/sw-docs tracker attendance tracker excel`

### Performance / Probation Checkpoint

Inputs:

- employee
- role
- manager
- review period
- goals or KRAs
- concerns or achievements

Outputs:

- review agenda
- scorecard outline
- decision options
- follow-up actions
- optional `/sw-docs form probation review`

## Admin Workflow Modes

### Asset Assignment

Inputs:

- asset type
- asset ID or serial number
- assigned employee
- assignment date
- condition
- approver

Outputs:

- assignment checklist
- handover acknowledgement
- tracker update row
- return condition expectation
- optional `/sw-docs tracker asset tracker excel`

### Asset Return

Inputs:

- employee
- asset ID
- return date
- current condition
- damage/loss notes
- admin owner

Outputs:

- return checklist
- inspection record
- damage/loss escalation
- tracker update row
- optional `/sw-docs form asset return`

### Access Provisioning

Inputs:

- person
- role
- systems
- access level
- approver
- expiry or review date

Outputs:

- access request list
- approval routing
- evidence log
- review date
- offboarding revocation note

### Vendor Coordination

Inputs:

- vendor
- service/item
- owner
- contract/SOW status
- expected delivery
- payment or invoice owner

Outputs:

- vendor task tracker
- communication draft handoff to `/sw-communication`
- escalation path
- evidence required

### Office Inventory Audit

Inputs:

- location
- asset categories
- audit owner
- audit date
- variance rules

Outputs:

- audit checklist
- variance register
- action owner matrix
- tracker update instructions

## Output Summary Format

```text
WORKFLOW OUTPUT SUMMARY
Workflow type      : [HR / Admin]
Mode               : [mode]
People / assets    : [scope]
Files created      : [list or none]
Data gaps          : [list or none]
Review owner       : [role]
Next               : [approval / /sw-docs / /sw-communication / no action]
```
