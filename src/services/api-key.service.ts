import { apiClient } from "@/lib/api-client"
import type {
  ApiKey,
  CreateApiKeyRequest,
  RevokeApiKeyRequest,
} from "@/types/api-key.types"

export const apiKeyService = {
  getUserKeys: async (): Promise<ApiKey[]> => {
    return apiClient.get("/api-key/keys")
  },

  createKey: async (data: CreateApiKeyRequest): Promise<ApiKey> => {
    return apiClient.post("/api-key/create", data)
  },

  revokeKey: async (data: RevokeApiKeyRequest): Promise<void> => {
    return apiClient.patch("/api-key/revoke", data)
  },
}
