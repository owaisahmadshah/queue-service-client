import { cn } from "@/lib/utils"
import type { NotificationJobStatus } from "@/types/job.types"

const statusStyles: Record<NotificationJobStatus, string> = {
  pending: "border-amber-500/40 bg-amber-500/10 text-amber-500",
  processing: "border-blue-500/40 bg-blue-500/10 text-blue-400 animate-pulse",
  completed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  failed: "border-orange-500/40 bg-orange-500/10 text-orange-400",
  dead: "border-rose-500/40 bg-rose-500/10 text-rose-400",
}

export function StatusBadge({ status }: { status: NotificationJobStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase transition-colors",
        statusStyles[status] || "border-border bg-muted text-muted-foreground"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "completed" && "bg-emerald-400",
          status === "processing" && "bg-blue-400",
          status === "pending" && "bg-amber-400",
          status === "failed" && "bg-orange-400",
          status === "dead" && "bg-rose-400"
        )}
      />
      {status}
    </span>
  )
}
