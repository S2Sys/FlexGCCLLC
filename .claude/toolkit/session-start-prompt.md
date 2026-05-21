# Claude Code — Session Start Prompt
# Version: 2.1
# Usage: Type /swd-start [Story ID — Story Title] in Claude Code (primary)
# Option B below is FALLBACK ONLY — use only when slash commands are unavailable.

---

## Option A — Slash command (recommended)

In Claude Code, type:
  /swd-start [ADO Story ID] — [Story Title] — SRS-vX.X — subtask: [Subtask Name]

---

## Option B — Manual paste (if slash commands not available)

Paste this block as the FIRST message in every Claude Code session.
Fill in the bracketed values before sending.

---

Story      : [ADO Story ID] — [Story Title]
SRS Version: [SRS-vX.X]
Subtask    : [Current subtask name]

Read these files now in this exact order:
1. CONTEXT.md — load the last checkpoint for this story (if it exists and has content)
2. docs/SRS.md — locate the STACK CONFIRMED block and extract every technology value
3. docs/BREAKDOWN.md — check Status field. If not "In ADO", "In Progress", or "Done": output DEVELOPMENT BLOCKED and stop
4. DECISIONS.md — load all decisions (do not re-debate any listed decision)
5. ENTITIES.md — load all registered tables (do not create any table already listed)

STACK CONFIRMED validation:
- Block missing from SRS → output STACK GAP FOUND (see CLAUDE.md §2) and stop
- Any category undefined → list each gap and wait for answers before proceeding

After reading all files:
- Scan codebase for anything related to this story and subtask
- Output STACK CONFIRMED (extracted values) + SCAN RESULT
- Wait for my approval before writing any code

---

## What Claude does NOT need to be told (automatic)

Claude Code auto-loads CLAUDE.md — do not ask Claude to read it.
The /swd-start command already embeds the file-read sequence.
Do not paste CLAUDE.md contents into the chat — it wastes context tokens.

---

## Session hygiene rules

- One ADO story per Claude Code session (recommended)
- Start a new session after turn 15 to prevent context drift
- Always end with /swd-submit before closing Claude Code
- Never continue a session after turn 20 — CONTEXT.md + new session mandatory