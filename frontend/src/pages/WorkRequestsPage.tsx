import { useCallback, useEffect, useState } from 'react'
import { AdminShell } from '../components/admin/AdminShell'
import { CreateWorkRequestForm } from '../components/work-requests/CreateWorkRequestForm'
import { WorkRequestFilters } from '../components/work-requests/WorkRequestFilters'
import { WorkRequestList } from '../components/work-requests/WorkRequestList'
import {
  addWorkRequestNote,
  createWorkRequest,
  listWorkRequests,
  updateWorkRequestStatus,
} from '../lib/api/workRequestsApi'
import type {
  CreateWorkRequestInput,
  WorkRequest,
  WorkRequestStatus,
} from '../types/workRequest'

export function WorkRequestsPage() {
  const [requests, setRequests] = useState<WorkRequest[]>([])
  const [status, setStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      setRequests(await listWorkRequests(status, search))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load requests.')
    } finally {
      setIsLoading(false)
    }
  }, [search, status])

  useEffect(() => {
    // Keep the request list synced with the current server-side filters.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  async function handleCreate(input: CreateWorkRequestInput) {
    setError(null)
    try {
      await createWorkRequest(input)
      await load()
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Unable to create request.')
    }
  }

  async function handleStatusChange(id: number, nextStatus: WorkRequestStatus) {
    setError(null)
    try {
      await updateWorkRequestStatus(id, nextStatus)
      await load()
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'Unable to update status.')
    }
  }

  async function handleAddNote(id: number, noteText: string) {
    setError(null)
    try {
      await addWorkRequestNote(id, noteText)
      await load()
    } catch (noteError) {
      setError(noteError instanceof Error ? noteError.message : 'Unable to add note.')
    }
  }

  return (
    <AdminShell visibleCount={requests.length}>
      <section className="page-header">
        <div>
          <p className="eyebrow">Code assessment module</p>
          <h1>Work Request Tracker</h1>
        </div>
        <div className="summary" aria-label="Visible request count">
          <strong>{requests.length}</strong>
          <span>visible requests</span>
        </div>
      </section>

      <section className="toolbar">
        <WorkRequestFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />
      </section>

      {error && <div className="error">{error}</div>}

      <section className="content-grid">
        <CreateWorkRequestForm onCreate={handleCreate} />
        <div className="list-panel">
          {isLoading ? (
            <p className="loading">Loading work requests...</p>
          ) : (
            <WorkRequestList
              requests={requests}
              onAddNote={handleAddNote}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </section>
    </AdminShell>
  )
}
