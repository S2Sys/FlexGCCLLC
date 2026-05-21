import type {
  CreateWorkRequestInput,
  WorkRequest,
  WorkRequestNote,
  WorkRequestStatus,
} from '../../types/workRequest'

interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

interface ApiErrorResponse {
  code?: string
  message?: string
  details?: string[]
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7080').replace(
  /\/$/,
  '',
)

export async function listWorkRequests(status: string, search: string) {
  const query = new URLSearchParams({
    page: '1',
    pageSize: '20',
  })

  if (status !== 'All') {
    query.set('status', status)
  }

  const normalizedSearch = search.trim()
  if (normalizedSearch.length > 0) {
    query.set('search', normalizedSearch)
  }

  const result = await request<PagedResult<WorkRequest>>(`/api/work-requests?${query}`)
  return result.items
}

export function createWorkRequest(input: CreateWorkRequestInput) {
  return request<WorkRequest>('/api/work-requests', {
    method: 'POST',
    body: JSON.stringify({
      ...input,
      dueDate: new Date(input.dueDate).toISOString(),
    }),
  })
}

export function updateWorkRequestStatus(id: number, status: WorkRequestStatus) {
  return request<WorkRequest>(`/api/work-requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function addWorkRequestNote(id: number, noteText: string) {
  return request<WorkRequestNote>(`/api/work-requests/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify({ noteText: noteText.trim() }),
  })
}

async function request<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  return (await response.json()) as T
}

async function readErrorMessage(response: Response) {
  try {
    const error = (await response.json()) as ApiErrorResponse
    const details = error.details?.filter(Boolean).join(' ')
    return details || error.message || `Request failed with ${response.status}.`
  } catch {
    return `Request failed with ${response.status}.`
  }
}
