export type WorkRequestPriority = 'Low' | 'Medium' | 'High'

export type WorkRequestStatus = 'New' | 'InProgress' | 'Blocked' | 'Completed'

export interface WorkRequestNote {
  id: number
  workRequestId: number
  noteText: string
  createdDate: string
}

export interface WorkRequest {
  id: number
  title: string
  clientName: string
  description: string
  priority: WorkRequestPriority
  status: WorkRequestStatus
  dueDate: string
  createdDate: string
  updatedDate: string
  notes: WorkRequestNote[]
}

export interface CreateWorkRequestInput {
  title: string
  clientName: string
  description: string
  priority: WorkRequestPriority
  status: WorkRequestStatus
  dueDate: string
}
