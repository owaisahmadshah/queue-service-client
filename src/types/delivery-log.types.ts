import type { NotificationJobStatus } from "./job.types"

export interface DeliveryLog {
  id: string
  job_id: string
  attempt: number
  status: NotificationJobStatus
  error?: string
  duration_ms: number
  attempted_at: string
}

export interface DeliveryLogCursor {
  attempt: number
  id: string
}

export interface PaginatedDeliveryLogs {
  data: DeliveryLog[]
  next_cursor: DeliveryLog | null
  has_more: boolean
}
