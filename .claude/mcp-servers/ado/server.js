#!/usr/bin/env node
/**
 * SmartWorkz ADO MCP Server v1.6.0
 *
 * Exposes Azure DevOps work item operations as MCP tools for Claude Code.
 * Replaces the manual ado-update.ps1 script — Claude creates ADO items
 * directly in-session and receives real ADO IDs back immediately.
 *
 * Config (per-project local file — preferred for multi-project machines):
 *   mcp-servers/ado/ado.local.json   ← git-ignored, one per project clone
 *   {
 *     "ADO_PAT":     "your-pat-token",
 *     "ADO_ORG_URL": "https://dev.azure.com/smartworkz",
 *     "ADO_PROJECT": "ExamPrep"
 *   }
 *
 * Fallback (machine-wide env vars — single project machines):
 *   ADO_PAT, ADO_ORG_URL, ADO_PROJECT
 *
 * Registration in .claude/settings.json:
 *   "mcpServers": {
 *     "smartworkz-ado": {
 *       "command": "node",
 *       "args": ["./mcp-servers/ado/server.js"]
 *     }
 *   }
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ─── Config — local file takes priority over env vars ─────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));

let localConfig = {};
try {
  localConfig = JSON.parse(readFileSync(join(__dirname, 'ado.local.json'), 'utf8'));
} catch {
  // no local config file — falling back to env vars
}

const ADO_PAT     = localConfig.ADO_PAT     || process.env.ADO_PAT;
const ADO_ORG_URL = (localConfig.ADO_ORG_URL || process.env.ADO_ORG_URL || '').replace(/\/$/, '');
const ADO_PROJECT = localConfig.ADO_PROJECT  || process.env.ADO_PROJECT;
const API_VER     = '7.1';
const VALID_ORG_PATTERNS = [
  /^https:\/\/dev\.azure\.com\/[^/\s]+$/i,
  /^https:\/\/[a-z0-9-]+\.visualstudio\.com$/i,
];

// Optional — source project/repo for ado_list_repo_files / ado_get_repo_file
const SKILLS_SOURCE_PROJECT = localConfig.SKILLS_SOURCE_PROJECT || process.env.SKILLS_SOURCE_PROJECT || '';
const SKILLS_SOURCE_REPO    = localConfig.SKILLS_SOURCE_REPO    || process.env.SKILLS_SOURCE_REPO    || '';

if (!ADO_PAT || !ADO_ORG_URL || !ADO_PROJECT) {
  process.stderr.write(
    '[SmartWorkz ADO MCP] FATAL: ADO credentials not found.\n\n' +
    'Create mcp-servers/ado/ado.local.json in this project (git-ignored):\n' +
    '  {\n' +
    '    "ADO_PAT":     "your-pat-token",\n' +
    '    "ADO_ORG_URL": "https://dev.azure.com/your-org",\n' +
    '    "ADO_PROJECT": "YourProject"\n' +
    '  }\n\n' +
    'Copy mcp-servers/ado/ado.local.json.example as a starting point.\n'
  );
  process.exit(1);
}

if (!VALID_ORG_PATTERNS.some((pattern) => pattern.test(ADO_ORG_URL))) {
  process.stderr.write(
    `[SmartWorkz ADO MCP] FATAL: INVALID ADO_ORG_URL "${ADO_ORG_URL}".\n` +
    'Allowed formats:\n' +
    '  https://dev.azure.com/[org-name]\n' +
    '  https://[org-name].visualstudio.com\n'
  );
  process.exit(1);
}

const AUTH = `Basic ${Buffer.from(`:${ADO_PAT}`).toString('base64')}`;

// ─── ADO REST helper ──────────────────────────────────────────────────────────

async function ado(method, url, body, ct = 'application/json-patch+json') {
  const opts = {
    method,
    headers: { Authorization: AUTH, 'Content-Type': ct },
  };
  if (body !== undefined && body !== null) opts.body = JSON.stringify(body);

  const res  = await fetch(url, opts);
  const text = await res.text();

  let json;
  try { json = JSON.parse(text); } catch { json = { message: text }; }

  if (!res.ok) {
    const msg = json?.message || json?.value?.Message || text.slice(0, 300);
    throw new Error(`ADO ${res.status} ${res.statusText}: ${msg}`);
  }
  return json;
}

const wiUrl  = (type) =>
  `${ADO_ORG_URL}/${ADO_PROJECT}/_apis/wit/workitems/$${encodeURIComponent(type)}?api-version=${API_VER}`;
const itemUrl = (id) =>
  `${ADO_ORG_URL}/${ADO_PROJECT}/_apis/wit/workitems/${id}?api-version=${API_VER}`;
const wiqlUrl = () =>
  `${ADO_ORG_URL}/${ADO_PROJECT}/_apis/wit/wiql?api-version=${API_VER}`;
const batchUrl = () =>
  `${ADO_ORG_URL}/${ADO_PROJECT}/_apis/wit/workitemsbatch?api-version=${API_VER}`;
const updatesUrl = (id) =>
  `${ADO_ORG_URL}/${ADO_PROJECT}/_apis/wit/workitems/${id}/updates?api-version=${API_VER}`;

// Use the actual URL returned by ADO (strip any ?api-version=... suffix).
// ADO's own URL is the authoritative reference — avoids workItems/workitems
// case divergence and any project-path differences in the relation URL.
function parentPatchByUrl(rawUrl) {
  return {
    op: 'add',
    path: '/relations/-',
    value: {
      rel: 'System.LinkTypes.Hierarchy-Reverse',
      url: rawUrl.split('?')[0],
      attributes: { comment: 'Parent link' },
    },
  };
}

// Fallback for single-create tools where only the parent ID is known.
function parentPatch(parentId) {
  return parentPatchByUrl(
    `${ADO_ORG_URL}/${ADO_PROJECT}/_apis/wit/workitems/${parentId}`
  );
}

function ok(data) {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

function assertPositiveInteger(name, value) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`INVALID_${name.toUpperCase()}: must be a positive integer`);
  }
}

function assertNonEmptyString(name, value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`INVALID_${name.toUpperCase()}: must be a non-empty string`);
  }
}

function escapeWiqlLiteral(value) {
  if (typeof value !== 'string') return '';
  if (/[\r\n\t]/.test(value)) {
    throw new Error('INVALID_QUERY_INPUT: control characters are not allowed');
  }
  if (value.includes('*')) {
    throw new Error('INVALID_QUERY_INPUT: wildcard characters are not allowed');
  }
  return value.replace(/'/g, "''").trim();
}

function stripHtml(value) {
  return String(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePhaseEvent(historyText) {
  const text = stripHtml(historyText);
  if (!text) return null;

  const blockedMatch = text.match(
    /DEVELOPMENT BLOCKED\s*-\s*([0-9T:.\-Z]+)\s*-\s*Phase\s+(.+?)\s*-\s*(.+?)\s*-\s*Resolve:\s*(.+)$/i
  );
  if (blockedMatch) {
    return {
      kind: 'blocked',
      timestamp: blockedMatch[1],
      phase: blockedMatch[2].trim(),
      reason: blockedMatch[3].trim(),
      resolveCommand: blockedMatch[4].trim(),
    };
  }

  const resolvedMatch = text.match(
    /BLOCK RESOLVED\s*-\s*([0-9T:.\-Z]+)\s*-\s*Phase\s+(.+?)\s*-\s*(.+?)$/i
  );
  if (resolvedMatch) {
    return {
      kind: 'resolved',
      timestamp: resolvedMatch[1],
      phase: resolvedMatch[2].trim(),
      reason: resolvedMatch[3].trim(),
      resolveCommand: null,
    };
  }

  return null;
}

async function adoText(url) {
  const res = await fetch(url, { headers: { Authorization: AUTH, Accept: 'text/plain' } });
  const text = await res.text();
  if (!res.ok) throw new Error(`ADO ${res.status} ${res.statusText}: ${text.slice(0, 300)}`);
  return text;
}

// ─── Server ───────────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'smartworkz-ado', version: '1.6.0' },
  { capabilities: { tools: {} } }
);

// ─── Tool list ────────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'ado_get_phase_status',
      description:
        'Get phase-block status for a work item. ' +
        'Returns { work_item_id, phase, status, blockedSince, blockedReason, resolveCommand, state }. ' +
        'Use before phase-gated commands to detect whether development is blocked.',
      inputSchema: {
        type: 'object',
        properties: {
          work_item_id: { type: 'number', description: 'ADO work item ID to inspect' },
        },
        required: ['work_item_id'],
      },
    },
    {
      name: 'ado_block_phase',
      description:
        'Record or resolve a phase gate block on a work item. ' +
        'Writes a history comment and updates the item state. ' +
        'Use status="blocked" to block, or status="resolved" to clear the block.',
      inputSchema: {
        type: 'object',
        properties: {
          work_item_id:   { type: 'number', description: 'ADO work item ID to update' },
          phase:          { type: 'string', description: 'Phase label, e.g. "2" or "3"' },
          reason:         { type: 'string', description: 'Specific reason for the block or resolution' },
          resolve_command:{ type: 'string', description: 'Exact command or action to resolve the block. Required when status is "blocked".' },
          status:         { type: 'string', enum: ['blocked', 'resolved'], description: 'Block or resolve the phase. Default: blocked.' },
          resolved_state: { type: 'string', enum: ['To Do', 'In Progress', 'Done'], description: 'State to apply when resolving. Default: In Progress.' },
        },
        required: ['work_item_id', 'phase', 'reason'],
      },
    },
    {
      name: 'ado_create_epic',
      description:
        'Create an Epic work item in Azure DevOps. ' +
        'Returns { id, title, url }. Save the id — pass it to ado_create_story as epic_id.',
      inputSchema: {
        type: 'object',
        properties: {
          title:       { type: 'string', description: 'Epic title, e.g. "EPIC-1: Question Management"' },
          description: { type: 'string', description: 'Epic description (plain text or HTML). Optional.' },
        },
        required: ['title'],
      },
    },
    {
      name: 'ado_create_story',
      description:
        'Create a User Story as a child of an Epic. ' +
        'Returns { id, title, url }. Save the id — pass it to ado_create_task as story_id.',
      inputSchema: {
        type: 'object',
        properties: {
          title:               { type: 'string', description: 'Story title' },
          description:         { type: 'string', description: 'User story text: "As a [user], I want [action], so that [benefit]"' },
          acceptance_criteria: { type: 'string', description: 'Acceptance criteria text. Separate ACs with newlines.' },
          epic_id:             { type: 'number', description: 'Parent Epic ADO ID (from ado_create_epic)' },
        },
        required: ['title', 'epic_id'],
      },
    },
    {
      name: 'ado_create_task',
      description:
        'Create a Task as a child of a User Story. ' +
        'Returns { id, title, url }. One task per technical layer (DB, Repository, Service, API, Frontend, Tests).',
      inputSchema: {
        type: 'object',
        properties: {
          title:           { type: 'string', description: 'Task title, e.g. "Task 1.1.B: Repository layer"' },
          description:     { type: 'string', description: 'What this task builds. List subtasks here.' },
          story_id:        { type: 'number', description: 'Parent Story ADO ID (from ado_create_story)' },
          estimated_hours: { type: 'number', description: 'Estimated hours. Default: 2.' },
        },
        required: ['title', 'story_id'],
      },
    },
    {
      name: 'ado_update_item',
      description:
        'Update a work item — change state, title, description, acceptance criteria, and/or add a history comment. ' +
        'Use after each subtask implementation to mark tasks Done, or after SRS changes to patch open stories/tasks. ' +
        'Returns { id, state }.',
      inputSchema: {
        type: 'object',
        properties: {
          id:                  { type: 'number', description: 'ADO work item ID' },
          state:               { type: 'string', enum: ['To Do', 'In Progress', 'Done'], description: 'New state. Optional.' },
          title:               { type: 'string', description: 'Updated title. Optional.' },
          description:         { type: 'string', description: 'Updated description / user story text. Optional.' },
          acceptance_criteria: { type: 'string', description: 'Updated acceptance criteria text. Replaces existing ACs. Optional.' },
          comment:             { type: 'string', description: 'History comment — include what changed, SRS version, reason.' },
        },
        required: ['id'],
      },
    },
    {
      name: 'ado_get_item',
      description:
        'Get details of a work item by ID. ' +
        'Returns { id, type, title, state, parent, url }. ' +
        'Use to verify an item exists or check its current state before updating.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'ADO work item ID' },
        },
        required: ['id'],
      },
    },
    {
      name: 'ado_query_items',
      description:
        'Query work items by type and optional state in the current project. ' +
        'Returns up to 50 matching items as [{ id, title, state }]. ' +
        'Use to list open stories, find a task by name, or check sprint board state.',
      inputSchema: {
        type: 'object',
        properties: {
          work_item_type: {
            type: 'string',
            enum: ['Epic', 'User Story', 'Task'],
            description: 'Work item type to query',
          },
          state: {
            type: 'string',
            description: 'Filter by state. Optional. E.g. "To Do", "In Progress", "Done".',
          },
          title_contains: {
            type: 'string',
            description: 'Filter by title substring. Optional.',
          },
        },
        required: ['work_item_type'],
      },
    },
    {
      name: 'ado_bulk_create',
      description:
        'Create a full Epic → Story → Task hierarchy from a single nested breakdown structure. ' +
        'Handles all sequential API calls internally — parent IDs are resolved automatically. ' +
        'Use at /srs-breakdown Level 5 after "subtasks approved". ' +
        'Returns the complete tree with every ADO ID filled in, ready to write to BREAKDOWN.md.',
      inputSchema: {
        type: 'object',
        properties: {
          epics: {
            type: 'array',
            description: 'Array of Epics to create, each containing its Stories and Tasks.',
            items: {
              type: 'object',
              properties: {
                title:       { type: 'string', description: 'Epic title, e.g. "EPIC-1: Question Management"' },
                description: { type: 'string', description: 'One-sentence Epic description. Optional.' },
                stories: {
                  type: 'array',
                  description: 'Stories that belong to this Epic.',
                  items: {
                    type: 'object',
                    properties: {
                      title:               { type: 'string', description: 'Story title' },
                      description:         { type: 'string', description: '"As a [user], I want [action], so that [benefit]"' },
                      acceptance_criteria: { type: 'string', description: 'AC1: ...\nAC2: ...\nAC3: ...' },
                      tasks: {
                        type: 'array',
                        description: 'Tasks that belong to this Story (one per technical layer).',
                        items: {
                          type: 'object',
                          properties: {
                            title:           { type: 'string', description: 'Task title, e.g. "Task 1.1.A: DB/Storage layer"' },
                            description:     { type: 'string', description: 'Subtask list for this Task.' },
                            estimated_hours: { type: 'number', description: 'Estimated hours. Default: 2.' },
                          },
                          required: ['title'],
                        },
                      },
                    },
                    required: ['title'],
                  },
                },
              },
              required: ['title'],
            },
          },
        },
        required: ['epics'],
      },
    },
    {
      name: 'ado_list_repo_files',
      description:
        'List files in a folder of any ADO Git repository — including a different project. ' +
        'Returns [{ path }] for every file under the given folder path. ' +
        'project and repo default to SKILLS_SOURCE_PROJECT / SKILLS_SOURCE_REPO in ado.local.json. ' +
        'Use before ado_get_repo_file to discover which skill files are available.',
      inputSchema: {
        type: 'object',
        properties: {
          path:    { type: 'string', description: 'Folder path to list, e.g. "/.claude/commands"' },
          project: { type: 'string', description: 'ADO project name. Omit to use SKILLS_SOURCE_PROJECT from config.' },
          repo:    { type: 'string', description: 'Repository name. Omit to use SKILLS_SOURCE_REPO from config.' },
        },
        required: ['path'],
      },
    },
    {
      name: 'ado_get_repo_file',
      description:
        'Get the raw text content of a file from any ADO Git repository — including a different project. ' +
        'Returns { path, content } where content is the full file text. ' +
        'project and repo default to SKILLS_SOURCE_PROJECT / SKILLS_SOURCE_REPO in ado.local.json. ' +
        'Use after ado_list_repo_files to read each skill file before writing it locally.',
      inputSchema: {
        type: 'object',
        properties: {
          path:    { type: 'string', description: 'File path, e.g. "/.claude/commands/swp-arch.md"' },
          project: { type: 'string', description: 'ADO project name. Omit to use SKILLS_SOURCE_PROJECT from config.' },
          repo:    { type: 'string', description: 'Repository name. Omit to use SKILLS_SOURCE_REPO from config.' },
        },
        required: ['path'],
      },
    },
  ],
}));

// ─── Tool handlers ────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: a } = request.params;

  try {
    switch (name) {

      // ── ado_create_epic ────────────────────────────────────────────────────
      case 'ado_get_phase_status': {
        assertPositiveInteger('work_item_id', a.work_item_id);

        const item = await ado('GET', itemUrl(a.work_item_id), null);
        const updates = await ado('GET', updatesUrl(a.work_item_id), null, 'application/json');
        const latestEvent = (updates.value ?? [])
          .slice()
          .reverse()
          .map((update) => parsePhaseEvent(update?.fields?.['System.History']?.newValue))
          .find(Boolean);

        const isBlocked = item.fields['System.State'] === 'Blocked' || latestEvent?.kind === 'blocked';
        return ok({
          work_item_id: a.work_item_id,
          phase: latestEvent?.phase ?? null,
          status: isBlocked ? 'BLOCKED' : 'OPEN',
          blockedSince: isBlocked ? latestEvent?.timestamp ?? null : null,
          blockedReason: isBlocked ? latestEvent?.reason ?? null : null,
          resolveCommand: isBlocked ? latestEvent?.resolveCommand ?? null : null,
          state: item.fields['System.State'],
        });
      }

      // ── ado_block_phase ────────────────────────────────────────────────────
      case 'ado_block_phase': {
        assertPositiveInteger('work_item_id', a.work_item_id);
        assertNonEmptyString('phase', a.phase);
        assertNonEmptyString('reason', a.reason);

        const status = a.status ?? 'blocked';
        if (status !== 'blocked' && status !== 'resolved') {
          throw new Error('INVALID_STATUS: must be "blocked" or "resolved"');
        }
        const timestamp = new Date().toISOString();
        const body = [];
        const phase = a.phase.trim();
        const reason = a.reason.trim();

        if (status === 'blocked') {
          assertNonEmptyString('resolve_command', a.resolve_command);
          body.push(
            { op: 'add', path: '/fields/System.State', value: 'Blocked' },
            {
              op: 'add',
              path: '/fields/System.History',
              value: `DEVELOPMENT BLOCKED - ${timestamp} - Phase ${phase} - ${reason} - Resolve: ${a.resolve_command.trim()}`,
            }
          );
        } else {
          body.push(
            { op: 'add', path: '/fields/System.State', value: a.resolved_state ?? 'In Progress' },
            {
              op: 'add',
              path: '/fields/System.History',
              value: `BLOCK RESOLVED - ${timestamp} - Phase ${phase} - ${reason}`,
            }
          );
        }

        const r = await ado('PATCH', itemUrl(a.work_item_id), body);
        return ok({
          work_item_id: r.id,
          phase,
          status: status === 'blocked' ? 'BLOCKED' : 'RESOLVED',
          timestamp,
          reason,
          state: r.fields['System.State'],
        });
      }

      // ── ado_create_epic ────────────────────────────────────────────────────
      case 'ado_create_epic': {
        const body = [
          { op: 'add', path: '/fields/System.Title',       value: a.title },
          { op: 'add', path: '/fields/System.Description', value: a.description ?? '' },
        ];
        const r = await ado('POST', wiUrl('Epic'), body);
        return ok({ id: r.id, title: r.fields['System.Title'], url: r._links?.html?.href ?? '' });
      }

      // ── ado_create_story ───────────────────────────────────────────────────
      case 'ado_create_story': {
        // GET the epic first so we use ADO's authoritative URL in the relation.
        const epicR = await ado('GET', itemUrl(a.epic_id), null);
        const body = [
          { op: 'add', path: '/fields/System.Title',       value: a.title },
          { op: 'add', path: '/fields/System.Description', value: a.description ?? '' },
          {
            op: 'add',
            path: '/fields/Microsoft.VSTS.Common.AcceptanceCriteria',
            value: a.acceptance_criteria ?? '',
          },
          parentPatchByUrl(epicR.url),
        ];
        const r = await ado('POST', wiUrl('User Story'), body);
        return ok({ id: r.id, title: r.fields['System.Title'], url: r._links?.html?.href ?? '' });
      }

      // ── ado_create_task ────────────────────────────────────────────────────
      case 'ado_create_task': {
        // GET the story first so we use ADO's authoritative URL in the relation.
        const storyR = await ado('GET', itemUrl(a.story_id), null);
        const body = [
          { op: 'add', path: '/fields/System.Title',       value: a.title },
          { op: 'add', path: '/fields/System.Description', value: a.description ?? '' },
          {
            op: 'add',
            path: '/fields/Microsoft.VSTS.Scheduling.OriginalEstimate',
            value: a.estimated_hours ?? 2,
          },
          parentPatchByUrl(storyR.url),
        ];
        const r = await ado('POST', wiUrl('Task'), body);
        return ok({ id: r.id, title: r.fields['System.Title'], url: r._links?.html?.href ?? '' });
      }

      // ── ado_update_item ────────────────────────────────────────────────────
      case 'ado_update_item': {
        const body = [];
        if (a.state)               body.push({ op: 'add', path: '/fields/System.State',                                    value: a.state });
        if (a.title)               body.push({ op: 'add', path: '/fields/System.Title',                                    value: a.title });
        if (a.description)         body.push({ op: 'add', path: '/fields/System.Description',                              value: a.description });
        if (a.acceptance_criteria) body.push({ op: 'add', path: '/fields/Microsoft.VSTS.Common.AcceptanceCriteria',        value: a.acceptance_criteria });
        if (a.comment)             body.push({ op: 'add', path: '/fields/System.History',                                  value: a.comment });
        if (!body.length) throw new Error('Provide at least one of: state, title, description, acceptance_criteria, comment');
        const r = await ado('PATCH', itemUrl(a.id), body);
        return ok({ id: r.id, state: r.fields['System.State'] });
      }

      // ── ado_get_item ───────────────────────────────────────────────────────
      case 'ado_get_item': {
        const r = await ado('GET', itemUrl(a.id), null);
        return ok({
          id:     r.id,
          type:   r.fields['System.WorkItemType'],
          title:  r.fields['System.Title'],
          state:  r.fields['System.State'],
          parent: r.fields['System.Parent'] ?? null,
          url:    r._links?.html?.href ?? '',
        });
      }

      // ── ado_query_items ────────────────────────────────────────────────────
      case 'ado_query_items': {
        const safeProject = escapeWiqlLiteral(ADO_PROJECT);
        const safeType = escapeWiqlLiteral(a.work_item_type);
        let wiql =
          `SELECT [System.Id],[System.Title],[System.State] FROM WorkItems ` +
          `WHERE [System.TeamProject] = '${safeProject}' ` +
          `AND [System.WorkItemType] = '${safeType}'`;
        if (a.state) {
          wiql += ` AND [System.State] = '${escapeWiqlLiteral(a.state)}'`;
        }
        if (a.title_contains) {
          wiql += ` AND [System.Title] CONTAINS '${escapeWiqlLiteral(a.title_contains)}'`;
        }
        wiql += ` ORDER BY [System.ChangedDate] DESC`;

        const qr  = await ado('POST', wiqlUrl(), { query: wiql }, 'application/json');
        const ids = (qr.workItems ?? []).slice(0, 50).map((w) => w.id);
        if (!ids.length) return ok([]);

        const br = await ado('POST', batchUrl(), {
          ids,
          fields: ['System.Id', 'System.Title', 'System.State'],
        }, 'application/json');

        const items = (br.value ?? []).map((w) => ({
          id:    w.id,
          title: w.fields['System.Title'],
          state: w.fields['System.State'],
        }));
        return ok(items);
      }

      // ── ado_bulk_create ────────────────────────────────────────────────────
      case 'ado_bulk_create': {
        const summary = { epics: [], totalCreated: { epics: 0, stories: 0, tasks: 0 } };

        for (const epicDef of a.epics) {
          const epicR = await ado('POST', wiUrl('Epic'), [
            { op: 'add', path: '/fields/System.Title',       value: epicDef.title },
            { op: 'add', path: '/fields/System.Description', value: epicDef.description ?? '' },
          ]);
          summary.totalCreated.epics++;

          const epicOut = {
            id:      epicR.id,
            title:   epicR.fields['System.Title'],
            url:     epicR._links?.html?.href ?? '',
            stories: [],
          };

          for (const storyDef of (epicDef.stories ?? [])) {
            // Use epicR.url (ADO's own URL) so the relation URL exactly matches
            // the format ADO expects — avoids case/path construction mismatches.
            const storyR = await ado('POST', wiUrl('User Story'), [
              { op: 'add', path: '/fields/System.Title',       value: storyDef.title },
              { op: 'add', path: '/fields/System.Description', value: storyDef.description ?? '' },
              {
                op: 'add',
                path: '/fields/Microsoft.VSTS.Common.AcceptanceCriteria',
                value: storyDef.acceptance_criteria ?? '',
              },
              parentPatchByUrl(epicR.url),
            ]);
            summary.totalCreated.stories++;

            const storyOut = {
              id:    storyR.id,
              title: storyR.fields['System.Title'],
              url:   storyR._links?.html?.href ?? '',
              tasks: [],
            };

            for (const taskDef of (storyDef.tasks ?? [])) {
              // Same: use storyR.url directly from ADO's response.
              const taskR = await ado('POST', wiUrl('Task'), [
                { op: 'add', path: '/fields/System.Title',       value: taskDef.title },
                { op: 'add', path: '/fields/System.Description', value: taskDef.description ?? '' },
                {
                  op: 'add',
                  path: '/fields/Microsoft.VSTS.Scheduling.OriginalEstimate',
                  value: taskDef.estimated_hours ?? 2,
                },
                parentPatchByUrl(storyR.url),
              ]);
              summary.totalCreated.tasks++;
              storyOut.tasks.push({
                id:    taskR.id,
                title: taskR.fields['System.Title'],
                url:   taskR._links?.html?.href ?? '',
              });
            }

            epicOut.stories.push(storyOut);
          }

          summary.epics.push(epicOut);
        }

        return ok(summary);
      }

      // ── ado_list_repo_files ────────────────────────────────────────────────
      case 'ado_list_repo_files': {
        const project = a.project || SKILLS_SOURCE_PROJECT;
        const repo    = a.repo    || SKILLS_SOURCE_REPO;
        if (!project || !repo) throw new Error(
          'project and repo are required. Set SKILLS_SOURCE_PROJECT / SKILLS_SOURCE_REPO in ado.local.json.'
        );
        const url =
          `${ADO_ORG_URL}/${encodeURIComponent(project)}/_apis/git/repositories/` +
          `${encodeURIComponent(repo)}/items` +
          `?scopePath=${encodeURIComponent(a.path)}&recursionLevel=OneLevel&includeContentMetadata=true&api-version=${API_VER}`;
        const r = await ado('GET', url, null, 'application/json');
        const files = (r.value ?? [])
          .filter(item => !item.isFolder)
          .map(item => ({ path: item.path }));
        return ok(files);
      }

      // ── ado_get_repo_file ──────────────────────────────────────────────────
      case 'ado_get_repo_file': {
        const project = a.project || SKILLS_SOURCE_PROJECT;
        const repo    = a.repo    || SKILLS_SOURCE_REPO;
        if (!project || !repo) throw new Error(
          'project and repo are required. Set SKILLS_SOURCE_PROJECT / SKILLS_SOURCE_REPO in ado.local.json.'
        );
        const url =
          `${ADO_ORG_URL}/${encodeURIComponent(project)}/_apis/git/repositories/` +
          `${encodeURIComponent(repo)}/items` +
          `?path=${encodeURIComponent(a.path)}&api-version=${API_VER}`;
        const content = await adoText(url);
        return ok({ path: a.path, content });
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (err) {
    return {
      content: [{ type: 'text', text: `ERROR: ${err.message}` }],
      isError: true,
    };
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write(`[SmartWorkz ADO MCP] Running — org: ${ADO_ORG_URL} project: ${ADO_PROJECT}\n`);
