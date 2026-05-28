import { useCallback, useEffect, useState } from 'react'
import { AdminShell } from '../components/admin/AdminShell'
import { WorkRequestFormModal } from '../components/work-requests/WorkRequestFormModal'
import { WorkRequestFilters } from '../components/work-requests/WorkRequestFilters'
import { WorkRequestList } from '../components/work-requests/WorkRequestList'
import {
  addWorkRequestNote,
  createWorkRequest,
  listWorkRequests,
  updateWorkRequest,
  updateWorkRequestStatus,
} from '../lib/api/workRequestsApi'
import type {
  CreateWorkRequestInput,
  UpdateWorkRequestInput,
  WorkRequest,
  WorkRequestStatus,
} from '../types/workRequest'

export function WorkRequestsPage() {
  const [requests, setRequests] = useState<WorkRequest[]>([])
  const [status, setStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<WorkRequest | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      setRequests(await listWorkRequests(status, search))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load requests.')
    } finally {
      setIsLoading(false)
    }
  }, [search, status])

  useEffect(() => { void load() }, [load])

  function openCreateModal() {
    setEditTarget(null)
    setIsModalOpen(true)
  }

  function openEditModal(request: WorkRequest) {
    setEditTarget(request)
    setIsModalOpen(true)
  }

  function closeModal() { setIsModalOpen(false) }

  async function handleCreate(input: CreateWorkRequestInput) {
    setError(null)
    try { await createWorkRequest(input); await load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to create request.') }
  }

  async function handleUpdate(id: number, input: UpdateWorkRequestInput) {
    setError(null)
    try { await updateWorkRequest(id, input); await load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to update request.') }
  }

  async function handleStatusChange(id: number, nextStatus: WorkRequestStatus) {
    setError(null)
    try { await updateWorkRequestStatus(id, nextStatus); await load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to update status.') }
  }

  async function handleAddNote(id: number, noteText: string) {
    setError(null)
    try { await addWorkRequestNote(id, noteText); await load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to add note.') }
  }

  return (
    <AdminShell visibleCount={requests.length}>
      <section className="page-header">
        <div>
          <p className="eyebrow">Code assessment module</p>
          <h1>Work Request Tracker</h1>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="summary" aria-label="Visible request count">
            <strong>{requests.length}</strong>
            <span>visible requests</span>
          </div>
          <button type="button" onClick={openCreateModal}>+ New Request</button>
        </div>
      </section>

      <section className="toolbar">
        <WorkRequestFilters search={search} status={status} onSearchChange={setSearch} onStatusChange={setStatus} />
      </section>

      {error && <div className="error">{error}</div>}

      <section className="content-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="list-panel">
          {isLoading ? (
            <p className="loading">Loading work requests...</p>
          ) : (
            <WorkRequestList
              requests={requests}
              onAddNote={handleAddNote}
              onStatusChange={handleStatusChange}
              onEdit={openEditModal}
            />
          )}
        </div>
      </section>

      <WorkRequestFormModal
        isOpen={isModalOpen}
        editTarget={editTarget}
        onClose={closeModal}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </AdminShell>
  )
}
