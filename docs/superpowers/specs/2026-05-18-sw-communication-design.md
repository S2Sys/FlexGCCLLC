# `/sw-communication` Skill — Design Spec

**Date:** 2026-05-18
**Author:** Senthilvel Thangavelu
**Status:** Approved
**Command:** `/sw-communication`
**File:** `.claude/commands/sw-communication.md`
**Version:** 1.0

---

## Purpose

A general-purpose professional communications skill. Covers every type of business message a developer, team lead, or project manager might need — from dev team emails to HR letters, client invoices, marketing copy, MOM documents, and social media posts. Works on-demand, any context.

---

## Modes

| Mode keyword | Aliases | What it produces |
|---|---|---|
| `email` | mail, send, draft | Any email — dev, client, cross-functional |
| `marketing` | promo, newsletter, campaign | Email marketing body, promotional copy |
| `sms` | text, message, whatsapp | Short-form message / SMS template |
| `invoice` | bill, payment, receipt | Invoice email / invoice content to client |
| `meeting` | invite, calendar, request | Formal meeting request + agenda |
| `mom` | minutes, notes, meeting-notes | Structured Minutes of Meeting |
| `hr` | offer, relieving, onboarding, policy | HR letters and announcements |
| `contract` | nda, agreement, sow, vendor | Contract / NDA / SOW summary comms |
| `social` | linkedin, announcement, post | LinkedIn / professional social post |
| `template` | save, reuse | Save any output as a reusable named template |

---

## Auto-Detection

When invoked without an explicit mode (`/sw-communication <free text>`), the skill:
1. Scans `$ARGUMENTS` for mode keywords (see aliases column above)
2. Matches the closest mode
3. If ambiguous or no match: presents a short mode menu for the user to select

---

## Mode Details

### Email
- Prompts: email type (invite / follow-up / status / escalation / approval / general), recipients (name + role + team), key points, tone (formal / semi-formal / casual), urgency (standard / urgent / FYI)
- Output: Subject line + formatted email body
- Cross-functional note: suggests appropriate CC/BCC based on email type

### Marketing
- Prompts: product/service name, target audience, key benefit, CTA (call to action), tone (engaging / professional / playful)
- Output: Email marketing body with subject line, preview text, body copy, and CTA section

### SMS
- Prompts: message purpose, recipient type (customer / team / public), character limit (160 / 320 / unlimited)
- Output: SMS template with optional URL/link placeholder

### Invoice
- Prompts: client name, services rendered, amounts, payment terms, due date, company details
- Output: Formatted invoice email + invoice content block ready to paste into billing tool
- After completion: offers to draft a follow-up payment reminder email

### Meeting (Formal Request)
- Prompts: meeting purpose, proposed date/time/platform, attendees, agenda items
- Output: Formal meeting request email + agenda block
- After completion: offers to switch to MOM mode after the meeting

### MOM (Minutes of Meeting)
Structured document with the following sections:

| Section | Content |
|---|---|
| Header | Meeting title, date, time, platform / location |
| Attendees | Name + role + team for each participant |
| Agenda | Items discussed in order |
| Discussion | Key points per agenda item |
| Decisions | Formal decisions reached |
| Risks & Issues | Blockers, risks, and open issues raised |
| Action Items | Table: Item \| Owner \| Due Date \| Priority (🔴/🟡/🟢) |
| Next Steps | Follow-up meeting date + any pending confirmations |

After MOM is captured:
- Offers to switch to Tasks mode to extract and group action items by owner
- Offers to draft a follow-up MOM email to attendees

### HR
- Prompts: letter type (offer / relieving / onboarding / policy / general), employee name, role, date, key terms
- Output: Formal HR letter body (professional tone, company-neutral template)
- Types covered: offer letter, relieving / experience letter, onboarding welcome, policy announcement, performance communication

### Contract / Agreement
- Prompts: document type (NDA / service agreement / SOW / vendor / MOU), parties involved, scope summary, key terms
- Output: Cover email for the document + plain-language summary of key terms
- Note: generates communication copy, not the legal document itself

### Social
- Prompts: platform (LinkedIn / general), post type (announcement / job post / project update / thought leadership), key message, tone (professional / conversational)
- Output: Formatted post text with optional hashtag suggestions

### Template (Save & Reuse)
- After any output, user can say "save as template [name]"
- Skill stores the template name and structure in `.claude/communication-templates.md`
- On future invocations: `/sw-communication template [name]` loads and pre-fills the saved template

---

## Mode Chaining

```
/sw-communication mom
  → MOM captured
  → "Extract action items?" → tasks grouping by owner
      → "Draft assignment email?" → email mode (task assignment to team)

/sw-communication invoice
  → Invoice content generated
  → "Draft follow-up reminder?" → email mode (payment follow-up)

/sw-communication meeting
  → Meeting request generated
  → "After the meeting, run /sw-communication mom to capture minutes"
```

---

## Task Output (from MOM)

When action items are extracted from a MOM, output:

**Full table:**
| # | Action Item | Owner | Team | Due Date | Priority | Status |
|---|---|---|---|---|---|---|
| 1 | ... | ... | ... | ... | 🔴 High | Open |

**Per-owner grouped list:**
```
[Owner Name] — [Team]
  • [Action Item 1] — Due: [date] — 🔴 High
  • [Action Item 2] — Due: [date] — 🟡 Medium
```

---

## Tone Guidance

| Tone | When to use |
|---|---|
| Formal | Client emails, HR letters, contracts, legal comms, senior leadership |
| Semi-formal | Cross-functional team emails, PO updates, sprint comms |
| Casual | Internal dev team, Slack/chat-style, quick updates |

Skill defaults to **semi-formal** unless specified.

---

## File Placement

- Skill: `.claude/commands/sw-communication.md`
- Saved templates: `.claude/communication-templates.md` (created on first template save)
- MOM docs: `docs/meetings/YYYY-MM-DD-<meeting-name>.md` (optional, if user requests file save)

---

## Out of Scope

- Does NOT generate actual legal documents (only cover emails and plain-language summaries)
- Does NOT send emails or post to social media (only drafts)
- Does NOT integrate with email clients or ADO automatically (output is copy-paste ready)

---

## Success Criteria

1. User can invoke `/sw-communication` with any communication need and get a draft within one interaction
2. MOM → task extraction → assignment email flows without leaving the skill
3. All outputs are cross-functional friendly — no jargon, clear ownership, appropriate tone
4. Templates save and reload correctly
