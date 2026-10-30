import { createBrowserRouter, Navigate } from "react-router-dom"
import { ProtectedRoute, GuestRoute } from "./RouteGuards"
import { AuthLayout } from "@/pages/auth/AuthLayout"
import { SignInPage } from "@/pages/auth/SignInPage"
import { SignUpPage } from "@/pages/auth/SignUpPage"
import { VerifyOtpPage } from "@/pages/auth/VerifyOtpPage"
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage"
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage"

import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { OverviewPage } from "@/pages/dashboard/OverviewPage"
import { JobsPage } from "@/pages/dashboard/JobsPage"
import { DlqPage } from "@/pages/dashboard/DlqPage"
import { ApiKeysPage } from "@/pages/dashboard/ApiKeysPage"
import { SettingsPage } from "@/pages/dashboard/SettingsPage"

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
        element: <DashboardLayout />,
        children: [
          { index: true, element: <OverviewPage /> },
          { path: "jobs", element: <JobsPage /> },
          { path: "dlq", element: <DlqPage /> },
          { path: "api-keys", element: <ApiKeysPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
])
