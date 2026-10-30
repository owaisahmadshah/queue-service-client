import { useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"

export function ResetPasswordPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialEmail = location.state?.email || ""

  const [email, setEmail] = useState(initialEmail)
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await authService.resetPassword({
        email,
        input_otp: otp,
        new_password: newPassword,
      })
      navigate("/sign-in")
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message || "Failed to reset password"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your OTP code and set your new account password
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 w-full rounded border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase">
            Reset OTP
          </label>
          <input
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="h-10 w-full rounded border border-input bg-background px-3 text-center text-sm font-bold tracking-widest focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase">
            New Password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className="h-10 w-full rounded border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          className="h-10 w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Update Password"
          )}
        </Button>
      </form>

      <div className="text-center text-xs">
        <Link to="/sign-in" className="text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
