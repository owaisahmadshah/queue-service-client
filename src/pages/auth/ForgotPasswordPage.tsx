import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await authService.forgotPassword({ email })
      navigate("/reset-password", { state: { email } })
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message || "Failed to process request"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your account email to receive a password reset OTP
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
            placeholder="developer@company.com"
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
            "Send Reset Code"
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
