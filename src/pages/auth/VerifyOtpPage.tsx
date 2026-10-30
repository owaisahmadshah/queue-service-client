import { useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"

export function VerifyOtpPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialEmail = location.state?.email || ""

  const [email, setEmail] = useState(initialEmail)
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setIsSubmitting(true)

    try {
      await authService.verifyOtp({ email, input_otp: otp })
      setMessage("Account verified! Redirecting to sign in...")
      setTimeout(() => navigate("/sign-in"), 1500)
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || "Verification failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (!email) return
    setError(null)
    setMessage(null)
    setIsResending(true)

    try {
      await authService.resendOtp({ email })
      setMessage("Verification code resent to your email.")
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message || "Failed to resend code"
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Verify Email</h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6-character OTP sent to your email address
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="flex items-center gap-2 rounded border border-emerald-500/50 bg-emerald-500/10 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="developer@company.com"
            className="h-10 w-full rounded border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase">
            Verification Code (OTP)
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

        <Button
          type="submit"
          className="h-10 w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Verify Account"
          )}
        </Button>
      </form>

      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || !email}
          className="cursor-pointer text-primary hover:underline disabled:opacity-50"
        >
          {isResending ? "Resending..." : "Resend OTP"}
        </button>

        <Link to="/sign-in" className="text-muted-foreground hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
