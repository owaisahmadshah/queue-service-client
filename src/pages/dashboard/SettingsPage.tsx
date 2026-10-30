import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { authService } from "@/services/auth.service"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Trash2,
  User,
} from "lucide-react"

export function SettingsPage() {
  const { user, signOut } = useAuth()

  // Password state
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passError, setPassError] = useState<string | null>(null)
  const [passSuccess, setPassSuccess] = useState<string | null>(null)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Account deletion state
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassError(null)
    setPassSuccess(null)
    setIsUpdatingPassword(true)

    try {
      await authService.updatePassword({
        old_password: oldPassword,
        new_password: newPassword,
      })
      setPassSuccess("Password updated successfully!")
      setOldPassword("")
      setNewPassword("")
    } catch (err: unknown) {
      setPassError(
        (err as { message?: string })?.message || "Failed to update password"
      )
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to permanently delete your account and keys?"
      )
    )
      return
    setIsDeletingAccount(true)
    try {
      await authService.deleteAccount()
      await signOut()
    } catch (err: unknown) {
      alert(
        (err as { message?: string })?.message || "Failed to delete account"
      )
      setIsDeletingAccount(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-8 font-mono">
      <PageHeader
        title="Account Settings"
        description="Manage security preferences, update account password, or terminate access"
      />

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-sm font-bold uppercase">
          <User className="h-4 w-4 text-primary" />
          <span>Active Session Metadata</span>
        </div>
        <div className="grid grid-cols-2 gap-4 rounded border border-border bg-muted/20 p-4 text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">
              User ID
            </span>
            <div className="font-semibold text-primary">{user?.id}</div>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">
              Email
            </span>
            <div className="font-semibold">{user?.email}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-sm font-bold uppercase">
          <Lock className="h-4 w-4 text-primary" />
          <span>Update Password</span>
        </div>

        {passError && (
          <div className="flex items-center gap-2 rounded border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{passError}</span>
          </div>
        )}

        {passSuccess && (
          <div className="flex items-center gap-2 rounded border border-emerald-500/50 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{passSuccess}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-muted-foreground uppercase">
              Current Password
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="h-9 w-full rounded border border-input bg-background px-3 focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-muted-foreground uppercase">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="h-9 w-full rounded border border-input bg-background px-3 focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isUpdatingPassword}
            className="h-9 cursor-pointer gap-2 text-xs"
          >
            {isUpdatingPassword ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Save Password"
            )}
          </Button>
        </form>
      </div>

      <div className="space-y-4 rounded-lg border border-rose-500/30 bg-rose-500/5 p-6">
        <div className="flex items-center gap-2 text-sm font-bold text-rose-400 uppercase">
          <Trash2 className="h-4 w-4" />
          <span>Danger Zone</span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Permanently delete your account, revoked/active API keys, and
          notification history. This action is irreversible.
        </p>

        <Button
          variant="outline"
          onClick={handleDeleteAccount}
          disabled={isDeletingAccount}
          className="h-9 cursor-pointer gap-2 border-rose-500/40 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
        >
          {isDeletingAccount ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Terminate Account"
          )}
        </Button>
      </div>
    </div>
  )
}
