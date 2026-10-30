import { apiClient } from "@/lib/api-client"
import { serializeCursor } from "@/lib/utils"
import type {
  DeliveryLog,
  PaginatedDeliveryLogs,
} from "@/types/delivery-log.types"

export const deliveryLogService = {
  getLogsByJobId: async (
    jobId: string,
    params?: {
      limit?: number
      cursor?: { attempt: number; id: string } | null
    }
  ): Promise<PaginatedDeliveryLogs> => {
    const serializedCursor = serializeCursor(params?.cursor || null)
    return apiClient.get(`/delivery-logs/job/${jobId}/logs`, {
      params: {
        limit: params?.limit ?? 10,
        ...(serializedCursor ? { cursor: serializedCursor } : {}),
      },
    })
  },

  getLogById: async (id: string): Promise<DeliveryLog> => {
    return apiClient.get(`/delivery-logs/${id}`)
  },
}
