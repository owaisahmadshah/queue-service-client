import { createBrowserRouter, Navigate } from "react-router-dom"
import { ProtectedRoute, GuestRoute } from "./RouteGuards"
import { AuthLayout } from "@/pages/auth/AuthLayout"
import { SignInPage } from "@/pages/auth/SignInPage"
import { SignUpPage } from "@/pages/auth/SignUpPage"
import { VerifyOtpPage } from "@/pages/auth/VerifyOtpPage"
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage"
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "sign-in", element: <SignInPage /> },
          { path: "sign-up", element: <SignUpPage /> },
          { path: "verify-otp", element: <VerifyOtpPage /> },
          { path: "forgot-password", element: <ForgotPasswordPage /> },
          { path: "reset-password", element: <ResetPasswordPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "dashboard",
        element: (
          <div className="p-8 font-mono">
            <h1 className="text-xl font-bold">
              Dashboard Placeholder (Chunk 3)
            </h1>
          </div>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
])
