import { useQuery } from "@tanstack/react-query"
import { deliveryLogService } from "@/services/delivery-log.service"
import { QUERY_KEYS } from "@/config/constants"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { CodeBlock } from "@/components/shared/CodeBlock"
import { formatDate, formatTimeAgo } from "@/lib/utils"
import { X, Clock, AlertCircle, History } from "lucide-react"
import type { NotificationJob } from "@/types/job.types"

interface JobDetailsDrawerProps {
  job: NotificationJob | null
  onClose: () => void
}

export function JobDetailsDrawer({ job, onClose }: JobDetailsDrawerProps) {
  const { data: logsData, isLoading: isLoadingLogs } = useQuery({
    queryKey: QUERY_KEYS.JOB_DELIVERY_LOGS(job?.id || ""),
    queryFn: () => deliveryLogService.getLogsByJobId(job!.id),
    enabled: !!job?.id,
  })

  if (!job) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 font-mono backdrop-blur-xs">
      <div className="flex h-full w-full max-w-xl flex-col space-y-6 overflow-y-auto border-l border-border bg-card p-6 text-card-foreground shadow-2xl">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">JOB DETAILS</span>
              <StatusBadge status={job.status} />
            </div>
            <p className="text-xs text-muted-foreground">{job.id}</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded border border-border bg-muted/20 p-4 text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">
              Channel
            </span>
            <div className="font-semibold uppercase">{job.channel}</div>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">
              Priority
            </span>
            <div className="font-semibold">{job.priority}</div>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">
              Attempts
            </span>
            <div className="font-semibold">
              {job.attempts} / {job.max_attempts}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">
              Created At
            </span>
            <div className="font-semibold">{formatDate(job.created_at)}</div>
          </div>
          <div className="col-span-2">
            <span className="text-[10px] text-muted-foreground uppercase">
              Idempotency Key
            </span>
            <div className="font-semibold text-primary">
              {job.idempotency_key}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold tracking-wide uppercase">Payload</h3>
          <CodeBlock code={job.payload} title="Original Dispatch Payload" />
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
            <History className="h-4 w-4 text-primary" />
            <span>Delivery Attempt Logs ({logsData?.data.length || 0})</span>
          </div>

          {isLoadingLogs ? (
            <div className="text-xs text-muted-foreground">Loading logs...</div>
          ) : logsData?.data.length === 0 ? (
            <div className="rounded border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              No delivery attempts recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {logsData?.data.map((log) => (
                <div
                  key={log.id}
                  className="space-y-2 rounded border border-border bg-muted/10 p-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">Attempt #{log.attempt}</span>
                      <StatusBadge status={log.status} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTimeAgo(log.attempted_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {log.duration_ms} ms
                    </span>
                    <span>{formatDate(log.attempted_at)}</span>
                  </div>

                  {log.error && (
                    <div className="flex items-start gap-1.5 rounded border border-destructive/30 bg-destructive/10 p-2 text-[11px] text-destructive">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span className="font-mono">{log.error}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
