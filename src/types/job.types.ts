import type { CursorPaginatedResponse } from "./api.types"

export type NotificationJobChannel = "email" | "webhook"

export type NotificationJobStatus =
  "pending" | "processing" | "completed" | "failed" | "dead"

export interface EmailJobPayload {
  to: string | string[]
  from?: string
  subject: string
  html?: string
}

export interface WebhookJobPayload<T = Record<string, unknown>> {
  url: string
  method: "POST" | "PUT" | "PATCH"
  headers?: Record<string, string>
  timeout_ms?: number
  data: {
    event: string
    job_id: string
    timestamp: string
    body: T
  }
}

export interface CreateNotificationJobRequest {
  channel: NotificationJobChannel
  payload: EmailJobPayload | WebhookJobPayload | Record<string, unknown>
  priority?: number
  idempotency_key: string
  scheduled_at?: string | null
  max_attempts?: number
}

export interface NotificationJob {
  id: string
  user_id: string
  channel: NotificationJobChannel
  status: NotificationJobStatus
  priority: number
  attempts: number
  max_attempts: number
  request_hash: string
  idempotency_key: string
  scheduled_at: string | null
  last_attempted_at: string | null
  created_at: string
  updated_at: string
  payload: EmailJobPayload | WebhookJobPayload
}

export interface JobCursor {
  created_at: string | null
  id: string
}

export type PaginatedNotificationJobs = CursorPaginatedResponse<
  NotificationJob,
  JobCursor
>

export interface Stats {
  summary: {
    total_proccessed_jobs: number
    total_success: number
    total_failed: number
    success_rate: number
  }
  backlog: {
    pending: number
    processing: number
    dead_letter_queues: number
  }
  live_queue_stats: {
    email_queue: {
      waiting: number
      active: number
      delayed: number
    }
  }
  channel_break_down: {
    email: {
      success: number
      failed: number
      success_rate_percent: number
    }
  }
}
