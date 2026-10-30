import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { ENV } from "@/config/env.config"
import type { ApiErrorResponse } from "@/types/api.types"

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Optional interceptor for dynamic API keys or custom headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle unified ApiResponse & ApiError structures
apiClient.interceptors.response.use(
  (response) => {
    // Return backend data wrapper if present, else standard response
    return response.data?.data !== undefined
      ? response.data.data
      : response.data
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const errorData = error.response?.data

    const formattedError = {
      statusCode: error.response?.status || 500,
      message:
        errorData?.message || error.message || "An unexpected error occurred",
      errors: errorData?.errors || [],
    }

    return Promise.reject(formattedError)
  }
)
