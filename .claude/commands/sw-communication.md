---
name: sw-communication
description: |
  General-purpose professional communications skill covering all business message types.
  Use when drafting any email (dev, client, HR, marketing, escalation), creating MOM/minutes,
  assigning meeting action items, generating invoice emails, writing HR letters (offer/relieving),
  drafting contracts/NDA cover comms, writing SMS templates, or composing social/LinkedIn posts.
  Auto-detects mode from context. MOM mode chains into task extraction and follow-up email.
compatibility: Any project  no SRS dependency
---

Command  : /sw-communication
Version  : 2.1
Updated  : 2026-05-21
Author   : KapilDev

| Version | Date       | Author  | Changes                                                                 |
|---------|------------|---------|-------------------------------------------------------------------------|
| 2.0     | 2026-05-21 | KapilDev   | Promoted command to Skill Maturity 2.0 with description-contract, helper, evidence, actionability, handoff, phase-summary, docs-sync, and version-discipline checks |
| 1.4     | 2026-05-21 | KapilDev | Added phase/stage done-summary contract for concise boundary summaries and final run summary |
| 1.3     | 2026-05-20 | KapilDev | Added standard helper intercept, output contract, docs-sync enforcement, approval-gate hardening, reference discipline, and partial-failure recovery safeguards |
| 1.2     | 2026-05-18 | Zenthil | Add Assignment Email + Payment Reminder sub-modes; Reply/Forward sub-modes; tighten Template Load spec; add reply/forward/meeting reminder keywords; expand Social to X (Twitter) |
| 1.1     | 2026-05-18 | Zenthil | Expanded tone table: 8 tones with writing style guidance + auto-infer rules |
| 1.0     | 2026-05-18 | Zenthil | Initial version                                                         |

Skill type: WORKFLOW COMMAND

## Standard command safeguards

### Helper intercept
If `$ARGUMENTS` is exactly one of these helper requests, print a concise helper document and STOP before the normal workflow starts:

- `help`
- `?`
- `usage`
- `use cases`
- `examples`
- `show helper`
- `what can this skill do`
- comment-style requests such as `# help`, `// help`, or `<!-- help -->`

Helper output must include: purpose, when to use, required inputs, common use cases, outputs, next steps, and safety notes.

### Output contract
Every normal run must end with a clear output or handoff section that lists files created or changed, decisions made, blockers remaining, verification performed, and the next recommended command or owner.

## Skill Maturity 2.0 Contract

This command is considered 2.0-ready only when every normal run satisfies these checks:

1. Description contract: output covers every capability promised in the frontmatter description.
2. Helper readiness: help, usage, examples, and comment-style help requests stop the normal workflow and show use cases.
3. Evidence discipline: missing inputs, metrics, approvals, IDs, costs, dates, or verification results are marked as `DATA GAP` instead of invented.
4. Actionability: recommendations include owner, priority, expected impact, effort, confidence, verification method, and next command or stakeholder.
5. Handoff clarity: final output names artifacts changed, decisions made, blockers, verification, and next owner/command.
6. Phase/stage summaries: every phase, stage, mode, gate, or major step ends with a DONE SUMMARY and the final response includes RUN SUMMARY.
7. Documentation sync: behavior, command names, generated outputs, examples, and handoffs stay aligned with README, CHANGELOG, and toolkit changelog docs.
8. Version discipline: command version, updated date, author row, README row, CHANGELOG, and toolkit version are updated together.

If any check fails, mark the run `CONDITIONAL` or `BLOCKED` and list the required fix before completion.

## Phase/Stage Done Summary Contract

At the end of every phase, stage, mode, approval gate, or major workflow step, output a short summary:

```text
[PHASE/STAGE/MODE/GATE] DONE SUMMARY
Completed          : [1-3 short bullets or one sentence]
Artifacts changed  : [files/docs/items]
Decisions made     : [approved/rejected/deferred]
Verification       : [checks run or N/A]
Blockers           : none / [list]
Next               : [next phase, stage, gate, command, or owner]
```

Final output must include a RUN SUMMARY with the same fields. If a phase/stage is skipped, say Skipped with reason and impact. If partially failed, show recovery status and do not mark it done.

### Documentation sync
When this command changes behavior, command names, modes, examples, outputs, generated files, or handoffs, check and update relevant docs before marking work complete:

- `README.md`
- `.claude/commands/README.md` if present
- `docs/**/*.md` files that mention this command or its outputs
- command index, registry, migration, or usage-guide files

If docs still show stale command names, old examples, outdated outputs, or broken handoffs, mark the change incomplete.

### Approval gate hardening
If this command has or reaches an approval/sign-off gate:

- Accept only the exact approval phrase documented by that gate.
- Reject vague approval language such as "looks good", "LGTM", "approved enough", "continue", "ship it", "go ahead", or "approved verbally".
- If blockers, failed checks, unresolved decisions, or missing required inputs remain, repeat the blocker list and stay at the gate.
- If the user asks to skip the gate, require an explicit risk decision for each unresolved blocker before continuing.

### Token and reference discipline
Keep this command focused on orchestration. Move long stack-specific examples, generated templates, policy tables, or reusable reference material into `.claude/refs/` and link to those files from the command body.

### Partial-failure recovery
If this command writes files, updates docs, changes external systems, scaffolds code, runs builds/tests, commits, pushes, deploys, or syncs state, and any step partially fails:

1. Stop before marking the workflow complete.
2. Report what changed, what failed, and which verification command or external action failed.
3. Preserve user-authored unrelated changes.
4. Fix or roll forward only the command-owned changes needed to recover.
5. Re-run the failed verification or sync step.
6. Do not update final status, handoff, README/docs, ADO, or changelog until recovery succeeds.

---

Draft communication: $ARGUMENTS

---

## STEP 0  Detect Mode

Scan `$ARGUMENTS` for a mode keyword:

| Mode | Keywords |
|------|---------|
| `email` | email, mail, send, draft, follow-up, invite, escalation, approval, status update, reply, respond, forward, meeting reminder, assignment email |
| `marketing` | marketing, promo, newsletter, campaign, promotional |
| `sms` | sms, text, message, whatsapp, short message |
| `invoice` | invoice, bill, billing, payment, receipt, client charge |
| `meeting` | meeting request, calendar invite, formal invite, schedule meeting |
| `mom` | mom, minutes, meeting notes, minutes of meeting |
| `hr` | offer letter, relieving, onboarding, policy, hr, employee |
| `contract` | nda, contract, agreement, sow, vendor, mou |
| `social` | linkedin, social, post, announcement, job post |
| `template` | template, save template, load template, reuse |

If no keyword match  present this menu and wait for selection:

```
Which type of communication do you need
  1. Email (dev / client / cross-functional)
  2. Marketing (email marketing body / newsletter)
  3. SMS / Short message template
  4. Invoice email / content
  5. Formal meeting request
  6. MOM  Minutes of Meeting
  7. HR letter (offer / relieving / onboarding / policy)
  8. Contract / NDA / SOW cover comms
  9. Social / LinkedIn post
  10. Load or save a template
```

---

## MODE: Email

Gather these details (ask if not in $ARGUMENTS):
- Email type: Invite / Follow-up / Status update / Escalation / Approval request / General
- Recipients: [Name  Role  Team]
- Key points to include: [bullet list from user]
- Tone: Formal / Semi-formal / Casual (default: semi-formal)
- Urgency: Standard / Urgent / FYI

Output format:
```
SUBJECT: [subject line]

[Email body  paragraphs, no filler phrases]

Regards,
[Name placeholder]
```

CC/BCC suggestion based on type:
- Escalation  suggest manager + tech lead CC
- Approval  suggest decision-maker as primary, team as CC
- Status update  suggest stakeholders as CC

### Reply / Forward sub-modes

When `$ARGUMENTS` contains `reply`, `respond`, or `forward`, gather these extra fields before drafting:

**Reply / Respond:**
- Original subject line (or paste the email being replied to)
- Key point(s) to address in the reply
- Any new info or attachments to mention
- Tone (default: match original email's tone)

Output:
```
SUBJECT: Re: [original subject]

[Reply body  addresses key points, no re-quoting the full original unless necessary]

Regards,
[Name placeholder]
```

**Forward:**
- Original subject line
- Who you are forwarding to: [Name  Role]
- Context note to add above the forwarded content
- Any changes to recipients (new CC/BCC)

Output:
```
SUBJECT: Fwd: [original subject]

[Context note  13 sentences explaining why you are forwarding and what action (if any) is needed]

--- Forwarded message ---
[Original message placeholder]

Regards,
[Name placeholder]
```

---

## MODE: Marketing

Gather:
- Product / service name
- Target audience (who is this for)
- Key benefit (one sentence  what problem does it solve)
- Call to action (what should the reader do)
- Tone: Engaging / Professional / Playful

Output format:
```
SUBJECT: [subject line  curiosity or benefit-driven]
PREVIEW TEXT: [4090 chars  teaser shown in inbox]

[Opening hook  12 sentences]

[Body  benefit-focused, 34 short paragraphs]

[CTA block]
   [Button label]  [URL placeholder]

[Sign-off / unsubscribe line placeholder]
```

---

## MODE: SMS

Gather:
- Purpose (what action or message)
- Recipient type: Customer / Team / Public
- Character limit: 160 / 320 / Unlimited

Output format:
```
SMS TEMPLATE:
[Message text  concise, no jargon]
[URL placeholder if needed: {link}]
Character count: XX / [limit]
```

---

## MODE: Invoice

Gather:
- Client name + company
- Services rendered (list each item + amount)
- Payment terms (net 30 / on receipt / etc.)
- Due date
- Invoice number (or auto-suggest format: INV-YYYYMMDD-001)
- Your company name (or leave as placeholder)

Output:
1. Invoice email:
```
SUBJECT: Invoice [INV-XXXX]  [Service Name]  Due [Date]

[Body: polite, professional, states amount + due date + payment method]
```

2. Invoice content block:
```
INVOICE
Invoice #: INV-XXXX
Date: [date]
Due Date: [date]

Bill To: [Client Name / Company]

| # | Description | Qty | Rate | Amount |
|---|---|---|---|---|
| 1 | [Service] | [X] | [/$/ XXX] | [/$/ XXX] |
...
SUBTOTAL: [amount]
TAX (XX%): [amount]
TOTAL DUE: [amount]

Payment Method: [bank transfer / UPI / card  placeholder]
```

After output: "Want me to draft a follow-up payment reminder email for this invoice"

### Payment Reminder Email

When user confirms reminder email:

Gather:
- Current date vs. due date  select variant below.

**Variant A  Polite (before or on due date):**
```
SUBJECT: Friendly Reminder  Invoice [INV-XXXX] Due [Date]

Hi [Client Name],

This is a gentle reminder that Invoice [INV-XXXX] for [Service Name], amounting to [Total Due], is due on [Due Date].

If payment has already been processed, please disregard this message. Otherwise, kindly arrange payment via [Payment Method placeholder].

Thank you for your prompt attention.

Regards,
[Your Name / Company]
```

**Variant B  Firm (overdue):**
```
SUBJECT: Overdue Notice  Invoice [INV-XXXX]  Immediate Action Required

Hi [Client Name],

Invoice [INV-XXXX] for [Service Name], totalling [Total Due], was due on [Due Date] and remains outstanding as of today.

Please arrange payment immediately via [Payment Method placeholder] or contact us to discuss resolution.

Regards,
[Your Name / Company]
```

---

## MODE: Meeting (Formal Request)

Gather:
- Meeting purpose (one sentence)
- Proposed date + time + timezone
- Platform / location (Teams / Zoom / in-person / etc.)
- Attendees: [Name  Role  Team]
- Agenda items (numbered list)
- Duration estimate

Output:
```
SUBJECT: Meeting Request  [Purpose]  [Date]

[Formal body: purpose, proposed slot, platform, agenda preview, RSVP ask]

AGENDA:
1. [Item]
2. [Item]
...

Duration: [XX mins]
Platform: [link placeholder]
```

After output: "After the meeting, run /sw-communication mom to capture minutes."

---

## MODE: MOM (Minutes of Meeting)

Gather meeting details interactively or from pasted notes:

```
MINUTES OF MEETING

Meeting Title  : [title]
Date           : [YYYY-MM-DD]
Time           : [HH:MM  HH:MM timezone]
Platform/Venue : [Teams / Zoom / room name]
Recorded by    : [name]


ATTENDEES
| Name | Role | Team |
|------|------|------|
| ...  | ...  | ...  |

AGENDA
1. [Agenda item]
2. [Agenda item]
...

DISCUSSION
[Agenda Item 1]
  - [Key point]
  - [Key point]

[Agenda Item 2]
  - [Key point]
...

DECISIONS
   [Decision 1]
   [Decision 2]

RISKS & ISSUES
| # | Risk / Issue | Raised By | Severity | Status |
|---|---|---|---|---|
| 1 | [description] | [name] |  High /  Medium /  Low | Open |

ACTION ITEMS
| # | Action | Owner | Team | Due Date | Priority | Status |
|---|--------|-------|------|----------|----------|--------|
| 1 | [action] | [name] | [team] | [date] |  /  /  | Open |

NEXT STEPS
   Next meeting: [date or TBC]
   Pending confirmations: [list]

```

**After MOM is captured, output two offers:**

```
MOM complete.

1. Extract & group action items by owner (reply "tasks")
2. Draft MOM follow-up email to attendees (reply "email")
```

### Action Item Extraction (from MOM)

When user replies "tasks":

Full table (copy from MOM Action Items section above).

Per-owner grouped list:
```
[Owner Name]  [Team]
   [Action Item]  Due: [date]   High
   [Action Item]  Due: [date]   Medium
```

After grouping: "Want me to draft an assignment email to all owners"

### Assignment Email (from MOM)

When user replies "yes" or confirms assignment email:

For **each owner**, generate a separate email:

```
SUBJECT: Action Items from [Meeting Title]  [Owner Name]

Hi [Owner Name],

Following the [Meeting Title] on [Date], here are the action items assigned to you:

   [Action Item 1]  Due: [date]   High
   [Action Item 2]  Due: [date]   Medium

Please confirm receipt and flag any blockers at your earliest convenience.

Regards,
[Sender Name]
```

If there are 3+ owners, ask: "Draft all [N] emails or a single group email listing all owners"
- **Group email:** use this structure:

```
SUBJECT: Action Items from [Meeting Title]  All Owners

Hi Team,

Following the [Meeting Title] on [Date], here are the action items by owner:

**[Owner 1 Name]  [Team]**
   [Action Item]  Due: [date]   High

**[Owner 2 Name]  [Team]**
   [Action Item]  Due: [date]   Medium

Please confirm receipt and flag any blockers.

Regards,
[Sender Name]
```

---

## MODE: HR

Gather:
- Letter type: Offer / Relieving / Experience / Onboarding / Policy announcement / General
- Employee name + designation
- Joining / last working date (as applicable)
- Company name (or placeholder)
- Key terms to include

**Offer Letter:**
```
SUBJECT: Offer of Employment  [Role]  [Company]

[Formal body: position, start date, CTC/salary band placeholder, reporting line placeholder,
acceptance deadline, warm closing]
```

**Relieving / Experience Letter:**
```
SUBJECT: Relieving Letter  [Employee Name]

[Formal body: confirms last working date, service period, designation, well-wishes]
```

**Onboarding Welcome:**
```
SUBJECT: Welcome to [Company]  [Employee Name]!

[Warm but professional body: start date, first-day logistics placeholder, team intro,
point of contact]
```

**Policy Announcement:**
```
SUBJECT: [Policy Name]  Effective [Date]

[Body: states the policy, effective date, rationale, action required by employees,
contact for questions]
```

---

## MODE: Contract / Agreement

Gather:
- Document type: NDA / Service Agreement / SOW / Vendor Agreement / MOU
- Parties: Party A (your org) + Party B (other party)
- Scope summary (23 sentences)
- Key terms to highlight (duration, payment, deliverables, confidentiality)

Output:
1. Cover email:
```
SUBJECT: [Document Type]  [Party A] & [Party B]  For Review / Signature

[Professional body: context, attached document reference, key terms summary,
next step ask (review / sign / counter-sign), deadline if any]
```

2. Plain-language key terms summary:
```
KEY TERMS SUMMARY
Document: [type]
Parties: [A] and [B]
Scope: [summary]
Duration: [term]
Payment: [terms]
Key obligations: [list]
Governing law: [placeholder]
```

Note: This is communication copy only  not a legally binding document.

---

## MODE: Social

Gather:
- Platform: LinkedIn / X (Twitter) / General professional
- Post type: Announcement / Job post / Project update / Thought leadership / Hiring
- Key message (12 sentences from user)
- Tone: Professional / Conversational

Output:
```
[Opening hook  attention-grabbing first line]

[Body  35 short paragraphs or bullet points]

[CTA or closing  what should readers do or take away]

Hashtags: #[suggestion1] #[suggestion2] #[suggestion3]
```

LinkedIn note: Keep to 12001500 chars for optimal reach. Flag if generated post exceeds.
X (Twitter) note: Hard limit 280 chars per tweet. If content exceeds, offer a thread (numbered tweets).

---

## MODE: Template

**Save a template:**
After any output, user can say: `save as template [name]`

Append to `.claude/communication-templates.md`:
```markdown
## [name]
Mode: [mode]
Date saved: [YYYY-MM-DD]

[full output saved here]
```

**Load a template:**
`/sw-communication template [name]`  reads `.claude/communication-templates.md`, finds the `## [name]` section, pre-fills the output structure, and prompts for each `{variable_name}` placeholder in order.

- Placeholder convention: use `{variable_name}` (curly braces, snake_case) in saved templates.
- File not found: "No communication-templates.md found. Save a template first with: save as template [name]"
- Template name not found: "Template '[name]' not found. Available templates: [list all ## headings in file]"

---

## Tone Quick Reference

| Tone | Use for | Writing style |
|------|---------|---------------|
| **Formal / Professional** | Legal docs, C-suite, official letters, external contracts | No contractions, full sentences, third-person where appropriate |
| **Semi-formal** | Cross-functional, PO updates, sprint comms, meeting requests | Polite, direct, first-person, no slang |
| **Friendly Professional** | Onboarding, welcome emails, warm client comms | Warm opener, conversational but business-appropriate |
| **Casual** | Internal dev team, quick updates, Slack-style | Contractions OK, short sentences, informal sign-off |
| **Persuasive** | Marketing, sales pitch, proposals, renewal emails | Benefit-led, CTA-focused, social proof hooks |
| **Empathetic** | HR difficult comms, apologies, change management | Acknowledge impact first, avoid defensive language |
| **Assertive** | Escalations, overdue follow-ups, urgent deadlines | Direct ask in first line, clear consequences, no apology padding |
| **Inspirational** | Leadership announcements, team milestones, launch comms | Vision-forward, "we" language, energizing close |

Default: **semi-formal** unless specified or inferred from recipient type.

**Auto-infer tone from context:**
- Recipient is CEO / legal / external client  Formal / Professional
- Email type is escalation / overdue  Assertive
- Email type is marketing / proposal  Persuasive
- HR sensitive (PIP / redundancy / apology)  Empathetic
- Company announcement / launch  Inspirational
- Internal team  Casual

---

## Output Rules

- No filler phrases: "I hope this email finds you well", "Please feel free to", "As per our discussion"
- Placeholders in [brackets] for fields that need real data
- Always state the ask clearly  what should the recipient do
- Keep subject lines under 60 characters when possible
- Professional sign-off placeholder: `Regards, / Best regards, / Sincerely,`

## Toolkit Version Sync

Before closing this command after a behavior update, version update, commit, or branch push:

- Increase the SmartWorkz++ toolkit version (`README.md` badge/version line and `CHANGELOG.md` release section).
- Ensure this command version, toolkit version, and docs references move together in the same change set.
- Update docs references that mention this command or its generated artifacts.
- Use `KapilDev` as author/actor attribution in version trails and commit identity checks.
- If toolkit/docs version sync is missing, mark status as incomplete.

## Version History
- **v2.1** (2026-05-21): Added Toolkit Version Sync enforcement via _skill2.0 review (command/toolkit/docs version coupling).


