export interface User {
  id: string
  email: string
  created_at?: string
}

export interface SignUpRequest {
  email: string
  password: string
}

export type SignInRequest = SignUpRequest

export interface VerifyOtpRequest {
  email: string
  input_otp: string
}

export interface ResendOtpRequest {
  email: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  input_otp: string
  new_password: string
}

export interface UpdatePasswordRequest {
  old_password: string
  new_password: string
}
