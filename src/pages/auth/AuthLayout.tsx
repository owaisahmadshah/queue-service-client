import { Outlet } from "react-router-dom"
import { Cpu } from "lucide-react"

export function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-background font-mono text-foreground lg:grid-cols-2">
      <div className="hidden flex-col justify-between border-r border-border bg-muted/20 p-10 lg:flex">
        <div className="flex items-center gap-3">
          <div className="rounded bg-primary p-2 text-primary-foreground">
            <Cpu className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-wider">
            QUEUE SERVICE
          </span>
        </div>
        <div className="max-w-md space-y-4">
          <blockquote className="border-l-2 border-primary pl-4 text-lg leading-relaxed font-medium">
            &ldquo;High-performance, fault-tolerant background job engine
            powered by BullMQ, Redis, and PostgreSQL.&rdquo;
          </blockquote>
          <p className="text-sm text-muted-foreground">
            Real-time queue monitoring, exponential retries, token-bucket rate
            limiting, and DLQ replay controls.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          Queue Service Console &copy; {new Date().getFullYear()}
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
