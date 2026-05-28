import type {
  CreateWorkRequestInput,
  UpdateWorkRequestInput,
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

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiErrorResponse
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7080').replace(/\/$/, '')

export async function listWorkRequests(status: string, search: string) {
  const query = new URLSearchParams({ page: '1', pageSize: '20' })
  if (status !== 'All') query.set('status', status)
  const normalizedSearch = search.trim()
  if (normalizedSearch.length > 0) query.set('search', normalizedSearch)
  const result = await request<PagedResult<WorkRequest>>(`/api/v1/work-requests?${query}`)
  return result.items
}

export function createWorkRequest(input: CreateWorkRequestInput) {
  return request<WorkRequest>('/api/v1/work-requests', {
    method: 'POST',
    body: JSON.stringify({ ...input, dueDate: new Date(input.dueDate).toISOString() }),
  })
}

export function updateWorkRequest(id: number, input: UpdateWorkRequestInput) {
  return request<WorkRequest>(`/api/v1/work-requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...input, dueDate: new Date(input.dueDate).toISOString() }),
  })
}

export function updateWorkRequestStatus(id: number, status: WorkRequestStatus) {
  return request<WorkRequest>(`/api/v1/work-requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function addWorkRequestNote(id: number, noteText: string) {
  return request<WorkRequestNote>(`/api/v1/work-requests/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify({ noteText: noteText.trim() }),
  })
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })

  const envelope = (await response.json()) as ApiResponse<T>

  if (!response.ok || !envelope.success) {
    const err = envelope.error
    const details = err?.details?.filter(Boolean).join(' ')
    throw new Error(details || err?.message || `Request failed with ${response.status}.`)
  }

  return envelope.data as T
}
