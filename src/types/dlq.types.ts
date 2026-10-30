import type {
  NotificationJobChannel,
  EmailJobPayload,
  WebhookJobPayload,
} from "./job.types"

export interface DeadLetterLog {
  id: string
  original_job_id: string
  channel: NotificationJobChannel
  payload: WebhookJobPayload | EmailJobPayload
  failure_reason: string
  final_error: string
  died_at: string
}

export interface DlqCursor {
  died_at: string
  id: string
}

export interface PaginatedDeadLetterLogs {
  data: DeadLetterLog[]
  has_more: boolean
  next_cursor: DlqCursor | null
}
