import { apiClient } from "@/lib/api-client"
import { serializeCursor } from "@/lib/utils"
import type {
  CreateNotificationJobRequest,
  NotificationJob,
  PaginatedNotificationJobs,
  Stats,
} from "@/types/job.types"

export const jobService = {
  getStats: async (): Promise<Stats> => {
    return apiClient.get("/notification-jobs/stats")
  },

  getJobs: async (params?: {
    limit?: number
    cursor?: { created_at: string | null; id: string } | null
  }): Promise<PaginatedNotificationJobs> => {
    const serializedCursor = serializeCursor(params?.cursor || null)
    return apiClient.get("/notification-jobs", {
      params: {
        limit: params?.limit ?? 20,
        ...(serializedCursor ? { cursor: serializedCursor } : {}),
      },
    })
  },

  getJobById: async (id: string): Promise<NotificationJob> => {
    return apiClient.get(`/notification-jobs/${id}`)
  },

  dispatchJob: async (
    data: CreateNotificationJobRequest,
    apiKey: string
  ): Promise<NotificationJob> => {
    return apiClient.post("/notification-jobs/notify", data, {
      headers: {
        "x-api-key": apiKey,
      },
    })
  },

  deleteJob: async (id: string): Promise<void> => {
    return apiClient.delete(`/notification-jobs/${id}`)
  },
}
