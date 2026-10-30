export interface ApiResponse<T = unknown> {
  statusCode: number
  data: T
  message: string
}

export interface ApiErrorResponse {
  statusCode: number
  message: string
  success: boolean
  errors?: Array<{ path: string; message: string }>
  stack?: string
}

export interface CursorPaginatedResponse<T, U = string> {
  data: T[]
  next_cursor: U | null
  has_more: boolean
}
