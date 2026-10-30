import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, AlertCircle } from "lucide-react"

export function SignUpPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await authService.signUp({ email, password })
      navigate("/verify-otp", { state: { email } })
    } catch (err: unknown) {
      setError(
        (err as unknown as { message?: string }).message ||
          "Failed to create account"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
        <p className="text-sm text-muted-foreground">
          Register to generate API keys and manage background jobs
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
            Email
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
            Password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className="h-10 w-full rounded border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          className="h-10 w-full cursor-pointer gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Continue <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        Already registered?{" "}
        <Link
          to="/sign-in"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
