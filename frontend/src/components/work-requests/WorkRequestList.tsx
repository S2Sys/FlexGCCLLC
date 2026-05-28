import { useState, type FormEvent } from 'react'
import type { WorkRequest, WorkRequestStatus } from '../../types/workRequest'
import { StatusUpdateButton } from './StatusUpdateButton'

interface WorkRequestListProps {
  requests: WorkRequest[]
  onStatusChange: (id: number, status: WorkRequestStatus) => Promise<void>
  onAddNote: (id: number, noteText: string) => Promise<void>
  onEdit: (request: WorkRequest) => void
}

export function WorkRequestList({ requests, onStatusChange, onAddNote, onEdit }: WorkRequestListProps) {
  if (requests.length === 0) {
    return <p className="empty">No work requests match the current filters.</p>
  }

  const statusOrder: WorkRequestStatus[] = ['Blocked', 'InProgress', 'New', 'Completed']
  const grouped = statusOrder
    .map((status) => ({
      status,
      items: requests.filter((request) => request.status === status),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="request-list">
      {grouped.map((group) => (
        <section key={group.status} className={`status-group status-${group.status.toLowerCase()}`}>
          <header className="status-group-header">
            <strong>{group.status}</strong>
            <span>{group.items.length}</span>
          </header>
          <div className="status-group-list">
            {group.items.map((request) => (
              <WorkRequestRow
                key={request.id}
                request={request}
                onAddNote={onAddNote}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

interface WorkRequestRowProps {
  request: WorkRequest
  onStatusChange: (id: number, status: WorkRequestStatus) => Promise<void>
  onAddNote: (id: number, noteText: string) => Promise<void>
  onEdit: (request: WorkRequest) => void
}

function WorkRequestRow({ request, onStatusChange, onAddNote, onEdit }: WorkRequestRowProps) {
  const [note, setNote] = useState('')

  async function submitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onAddNote(request.id, note)
    setNote('')
  }

  return (
    <article className="request-row">
      <header>
        <div>
          <h2>{request.title}</h2>
          <p>{request.clientName}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className={`priority priority-${request.priority.toLowerCase()}`}>{request.priority}</span>
          <button
            type="button"
            className="btn-secondary"
            style={{ minHeight: 30, padding: '0 10px', fontSize: 12 }}
            onClick={() => onEdit(request)}
          >
            Edit
          </button>
        </div>
      </header>

      <p className="description">{request.description}</p>

      <div className="row-meta">
        <span>Due {new Date(request.dueDate).toLocaleDateString()}</span>
        <StatusUpdateButton
          currentStatus={request.status}
          onChange={(status) => onStatusChange(request.id, status)}
        />
      </div>

      <form className="note-form" onSubmit={submitNote}>
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Add a note"
        />
        <button type="submit">Add note</button>
      </form>

      {request.notes.length > 0 && (
        <ul className="notes">
          {request.notes.map((item) => (
            <li key={item.id}>{item.noteText}</li>
          ))}
        </ul>
      )}
    </article>
  )
}
