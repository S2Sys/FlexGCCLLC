import type { WorkRequestStatus } from '../../types/workRequest'

const statuses: Array<WorkRequestStatus | 'All'> = [
  'All',
  'New',
  'InProgress',
  'Blocked',
  'Completed',
]

interface WorkRequestFiltersProps {
  status: string
  search: string
  onStatusChange: (status: string) => void
  onSearchChange: (search: string) => void
}

export function WorkRequestFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: WorkRequestFiltersProps) {
  return (
    <div className="filters" aria-label="Work request filters">
      <label>
        Status
        <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label>
        Search
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Title or client"
          type="search"
        />
      </label>
    </div>
  )
}
