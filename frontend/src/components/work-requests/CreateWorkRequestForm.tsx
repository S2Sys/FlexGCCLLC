import { useState, type FormEvent } from 'react'
import type {
  CreateWorkRequestInput,
  WorkRequestPriority,
  WorkRequestStatus,
} from '../../types/workRequest'

interface CreateWorkRequestFormProps {
  onCreate: (request: CreateWorkRequestInput) => Promise<void>
}

const priorities: WorkRequestPriority[] = ['Low', 'Medium', 'High']
const statuses: WorkRequestStatus[] = ['New', 'InProgress', 'Blocked', 'Completed']

export function CreateWorkRequestForm({ onCreate }: CreateWorkRequestFormProps) {
  const [form, setForm] = useState<CreateWorkRequestInput>({
    title: '',
    clientName: '',
    description: '',
    priority: 'Medium',
    status: 'New',
    dueDate: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    try {
      await onCreate(form)
      setForm({
        title: '',
        clientName: '',
        description: '',
        priority: 'Medium',
        status: 'New',
        dueDate: '',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Title
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
          />
        </label>
        <label>
          Client
          <input
            value={form.clientName}
            onChange={(event) => setForm({ ...form, clientName: event.target.value })}
            required
          />
        </label>
        <label>
          Priority
          <select
            value={form.priority}
            onChange={(event) =>
              setForm({ ...form, priority: event.target.value as WorkRequestPriority })
            }
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select
            value={form.status}
            onChange={(event) =>
              setForm({ ...form, status: event.target.value as WorkRequestStatus })
            }
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label>
          Due date
          <input
            value={form.dueDate}
            onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
            required
            type="date"
          />
        </label>
      </div>
      <label>
        Description
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          required
          rows={3}
        />
      </label>
      <button disabled={isSaving} type="submit">
        {isSaving ? 'Creating...' : 'Create request'}
      </button>
    </form>
  )
}
