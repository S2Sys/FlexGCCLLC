import type {
  CreateWorkRequestInput,
  WorkRequest,
  WorkRequestStatus,
} from '../../types/workRequest'

const initialRequests: WorkRequest[] = [
  {
    id: 1,
    title: 'Prepare client onboarding checklist',
    clientName: 'Northwind Advisory',
    description: 'Create a short checklist for the new operations handoff.',
    priority: 'High',
    status: 'New',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    notes: [],
  },
  {
    id: 2,
    title: 'Fix monthly report export',
    clientName: 'BluePeak Finance',
    description: 'Investigate missing totals in the CSV export.',
    priority: 'Medium',
    status: 'InProgress',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    notes: [
      {
        id: 1,
        workRequestId: 2,
        noteText: 'Issue reproduced with March sample data.',
        createdDate: new Date().toISOString(),
      },
    ],
  },
]

let requests = [...initialRequests]
let nextId = 3
let nextNoteId = 2

export async function listWorkRequests(status: string, search: string) {
  await delay()

  const normalizedSearch = search.trim().toLowerCase()
  return requests.filter((request) => {
    const matchesStatus = status === 'All' || request.status === status
    const matchesSearch =
      normalizedSearch.length === 0 ||
      request.title.toLowerCase().includes(normalizedSearch) ||
      request.clientName.toLowerCase().includes(normalizedSearch)

    return matchesStatus && matchesSearch
  })
}

export async function createWorkRequest(input: CreateWorkRequestInput) {
  await delay()

  const missing = [
    ['Title', input.title],
    ['Client name', input.clientName],
    ['Description', input.description],
    ['Due date', input.dueDate],
  ].filter(([, value]) => !String(value).trim())

  if (missing.length > 0) {
    throw new Error(`${missing[0][0]} is required.`)
  }

  const now = new Date().toISOString()
  const request: WorkRequest = {
    id: nextId++,
    ...input,
    dueDate: new Date(input.dueDate).toISOString(),
    createdDate: now,
    updatedDate: now,
    notes: [],
  }

  requests = [request, ...requests]
  return request
}

export async function updateWorkRequestStatus(id: number, status: WorkRequestStatus) {
  await delay()

  requests = requests.map((request) =>
    request.id === id
      ? { ...request, status, updatedDate: new Date().toISOString() }
      : request,
  )
}

export async function addWorkRequestNote(id: number, noteText: string) {
  await delay()

  if (!noteText.trim()) {
    throw new Error('Note text is required.')
  }

  requests = requests.map((request) =>
    request.id === id
      ? {
          ...request,
          updatedDate: new Date().toISOString(),
          notes: [
            ...request.notes,
            {
              id: nextNoteId++,
              workRequestId: id,
              noteText: noteText.trim(),
              createdDate: new Date().toISOString(),
            },
          ],
        }
      : request,
  )
}

function delay() {
  return new Promise((resolve) => window.setTimeout(resolve, 180))
}
