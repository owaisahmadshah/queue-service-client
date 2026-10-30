export const QUERY_KEYS = {
  USER: ["user"],
  API_KEYS: ["api-keys"],
  NOTIFICATION_JOBS: ["notification-jobs"],
  JOB_STATS: ["job-stats"],
  JOB_DETAILS: (id: string) => ["notification-jobs", id],
  JOB_DELIVERY_LOGS: (jobId: string) => ["delivery-logs", "job", jobId],
  DELIVERY_LOG_DETAILS: (id: string) => ["delivery-logs", id],
  DEAD_LETTER_LOGS: ["dead-letter-logs"],
  DEAD_LETTER_LOG_DETAILS: (id: string) => ["dead-letter-logs", id],
} as const

export const POLLING_INTERVALS = {
  STATS: 5000, // 5 seconds live refresh for dashboard stats
  ACTIVE_JOBS: 3000, // 3 seconds refresh when processing jobs exist
} as const

export const DEFAULT_PAGINATION_LIMIT = 20
