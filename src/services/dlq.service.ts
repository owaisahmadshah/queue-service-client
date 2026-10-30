import { apiClient } from "@/lib/api-client"
import { serializeCursor } from "@/lib/utils"
import type {
  DeadLetterLog,
  PaginatedDeadLetterLogs,
  DlqCursor,
} from "@/types/dlq.types"

export const dlqService = {
  getLogs: async (params?: {
    limit?: number
    cursor?: DlqCursor | null
  }): Promise<PaginatedDeadLetterLogs> => {
    const serializedCursor = serializeCursor(
      (params?.cursor as unknown as Record<string, unknown>) || null
    )
    return apiClient.get("/dead-letter-logs", {
      params: {
        limit: params?.limit ?? 20,
        ...(serializedCursor ? { cursor: serializedCursor } : {}),
      },
    })
  },

  getLogById: async (id: string): Promise<DeadLetterLog> => {
    return apiClient.get(`/dead-letter-logs/${id}`)
  },

  replayLog: async (id: string): Promise<void> => {
    return apiClient.post(`/dead-letter-logs/${id}/replay`)
  },

  deleteLog: async (id: string): Promise<void> => {
    return apiClient.delete(`/dead-letter-logs/${id}`)
  },
}
