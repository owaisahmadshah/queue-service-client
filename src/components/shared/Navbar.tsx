import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { LogOut, User as UserIcon } from "lucide-react"

export function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6 font-mono">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-block h-2 w-2 rounded-full bg-primary" />
        <span>Environment: DEVELOPMENT</span>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 rounded border border-border bg-muted/20 px-2.5 py-1 text-xs">
            <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{user.email}</span>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut()}
          className="h-8 cursor-pointer gap-2 text-xs hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </Button>
      </div>
    </header>
  )
}
