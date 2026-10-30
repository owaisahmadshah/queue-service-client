export interface ApiKey {
  id: string
  user_id: string
  name?: string
  key?: string // Present on initial creation return
  created_at: string
  revoked_at: string | null
}

export interface CreateApiKeyRequest {
  name?: string
}

export interface RevokeApiKeyRequest {
  key_id: string
}
