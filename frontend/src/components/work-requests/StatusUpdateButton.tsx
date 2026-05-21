import type { WorkRequestStatus } from '../../types/workRequest'

interface StatusUpdateButtonProps {
  currentStatus: WorkRequestStatus
  onChange: (status: WorkRequestStatus) => Promise<void>
}

const statuses: WorkRequestStatus[] = ['New', 'InProgress', 'Blocked', 'Completed']

export function StatusUpdateButton({ currentStatus, onChange }: StatusUpdateButtonProps) {
  return (
    <select
      aria-label="Update status"
      className="status-select"
      value={currentStatus}
      onChange={(event) => onChange(event.target.value as WorkRequestStatus)}
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )
}
