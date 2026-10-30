import { apiClient } from "@/lib/api-client"
import type {
  User,
  SignUpRequest,
  SignInRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
} from "@/types/auth.types"

export const authService = {
  signUp: async (data: SignUpRequest): Promise<{ user: User }> => {
    return apiClient.post("/user/sign-up", data)
  },

  signIn: async (data: SignInRequest): Promise<User> => {
    return apiClient.post("/user/sign-in", data)
  },

  getCurrentUser: async (): Promise<User> => {
    return apiClient.get("/user")
  },

  signOut: async (): Promise<void> => {
    return apiClient.delete("/user/sign-out")
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<void> => {
    return apiClient.post("/user/verify-otp", data)
  },

  resendOtp: async (data: ResendOtpRequest): Promise<void> => {
    return apiClient.post("/user/resend-verification-otp", data)
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    return apiClient.post("/user/forgot-password", data)
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    return apiClient.post("/user/reset-password", data)
  },

  updatePassword: async (data: UpdatePasswordRequest): Promise<void> => {
    return apiClient.patch("/user/update-password", data)
  },

  deleteAccount: async (): Promise<void> => {
    return apiClient.delete("/user")
  },
}
