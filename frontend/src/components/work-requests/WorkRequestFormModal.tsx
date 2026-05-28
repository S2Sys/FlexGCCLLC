import { useEffect, useState, type FormEvent } from 'react'
import type {
  CreateWorkRequestInput,
  UpdateWorkRequestInput,
  WorkRequest,
  WorkRequestPriority,
  WorkRequestStatus,
} from '../../types/workRequest'
import { Modal } from '../common/Modal'

const priorities: WorkRequestPriority[] = ['Low', 'Medium', 'High']
const statuses: WorkRequestStatus[] = ['New', 'InProgress', 'Blocked', 'Completed']

interface WorkRequestFormModalProps {
  isOpen: boolean
  editTarget: WorkRequest | null
  onClose: () => void
  onCreate: (input: CreateWorkRequestInput) => Promise<void>
  onUpdate: (id: number, input: UpdateWorkRequestInput) => Promise<void>
}

const emptyForm: CreateWorkRequestInput = {
  title: '',
  clientName: '',
  description: '',
  priority: 'Medium',
  status: 'New',
  dueDate: '',
}

export function WorkRequestFormModal({
  isOpen,
  editTarget,
  onClose,
  onCreate,
  onUpdate,
}: WorkRequestFormModalProps) {
  const isEdit = editTarget !== null
  const [form, setForm] = useState<CreateWorkRequestInput>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (editTarget) {
      setForm({
        title: editTarget.title,
        clientName: editTarget.clientName,
        description: editTarget.description,
        priority: editTarget.priority,
        status: editTarget.status,
        dueDate: editTarget.dueDate.split('T')[0],
      })
    } else {
      setForm(emptyForm)
    }
  }, [editTarget, isOpen])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    try {
      if (isEdit && editTarget) {
        await onUpdate(editTarget.id, {
          title: form.title,
          clientName: form.clientName,
          description: form.description,
          priority: form.priority,
          dueDate: form.dueDate,
        })
      } else {
        await onCreate(form)
      }
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} title={isEdit ? 'Edit Work Request' : 'New Work Request'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Title <span className="required-mark">*</span>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </label>
          <label>
            Client <span className="required-mark">*</span>
            <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} required />
          </label>
          <label>
            Priority
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as WorkRequestPriority })}>
              {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          {!isEdit && (
            <label>
              Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as WorkRequestStatus })}>
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          )}
          <label>
            Due date <span className="required-mark">*</span>
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          </label>
        </div>
        <label style={{ marginTop: 12, display: 'grid', gap: 6 }}>
          Description <span className="required-mark">*</span>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} />
        </label>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : isEdit ? 'Save changes' : 'Create request'}</button>
        </div>
      </form>
    </Modal>
  )
}
