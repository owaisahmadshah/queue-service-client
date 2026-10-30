import { useState } from "react"
import { CodeBlock } from "@/components/shared/CodeBlock"
import { formatDate, formatTimeAgo } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  X,
  RotateCcw,
  Trash2,
  AlertOctagon,
  Terminal,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import type { DeadLetterLog } from "@/types/dlq.types"

interface DlqInspectorDrawerProps {
  log: DeadLetterLog | null
  onClose: () => void
  onReplay: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isReplaying: boolean
  isDeleting: boolean
}

export function DlqInspectorDrawer({
  log,
  onClose,
  onReplay,
  onDelete,
  isReplaying,
  isDeleting,
}: DlqInspectorDrawerProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  if (!log) return null

  const handleReplayAction = async () => {
    setErrorMsg(null)
    setSuccessMsg(null)
    try {
      await onReplay(log.id)
      setSuccessMsg("Job replayed successfully! Returned to active queue.")
      setTimeout(() => {
        onClose()
      }, 1200)
    } catch (err: unknown) {
      setErrorMsg(
        (err as { message?: string })?.message ||
          "Failed to replay dead letter job"
      )
    }
  }

  const handleDeleteAction = async () => {
    setErrorMsg(null)
    setSuccessMsg(null)
    try {
      await onDelete(log.id)
      setSuccessMsg("DLQ record purged.")
      setTimeout(() => {
        onClose()
      }, 800)
    } catch (err: unknown) {
      setErrorMsg(
        (err as { message?: string })?.message ||
          "Failed to purge dead letter log"
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 font-mono backdrop-blur-xs">
      <div className="flex h-full w-full max-w-xl flex-col space-y-6 overflow-y-auto border-l border-border bg-card p-6 text-card-foreground shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-rose-500" />
              <span className="text-sm font-bold">DEAD LETTER INSPECTOR</span>
            </div>
            <p className="text-xs text-muted-foreground">{log.id}</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded border border-emerald-500/50 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 rounded border border-border bg-muted/20 p-4 text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">
              Original Job ID
            </span>
            <div className="font-semibold text-primary">
              {log.original_job_id}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">
              Channel
            </span>
            <div className="font-semibold uppercase">{log.channel}</div>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">
              Died At
            </span>
            <div className="font-semibold">{formatDate(log.died_at)}</div>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">
              Relative Time
            </span>
            <div className="font-semibold text-rose-400">
              {formatTimeAgo(log.died_at)}
            </div>
          </div>
        </div>

        {/* Failure Reason Banner */}
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-wide text-rose-400 uppercase">
            Failure Reason
          </label>
          <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 font-mono text-xs font-medium text-rose-300">
            {log.failure_reason ||
              "Retries exhausted without successful execution"}
          </div>
        </div>

        {/* Stack Trace / Final Error */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
            <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Final Execution Stack Trace / Error</span>
          </div>
          <CodeBlock
            code={log.final_error || "No stack trace provided"}
            title="Error Output"
          />
        </div>

        {/* Original Job Payload */}
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-wide uppercase">
            Original Job Payload
          </label>
          <CodeBlock code={log.payload} title="Payload Dumps" />
        </div>

        {/* Footer Quick Actions */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <Button
            variant="outline"
            onClick={handleDeleteAction}
            disabled={isDeleting || isReplaying}
            className="h-9 cursor-pointer gap-2 border-rose-500/40 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Purge DLQ Entry
          </Button>

          <Button
            onClick={handleReplayAction}
            disabled={isReplaying || isDeleting}
            className="h-9 cursor-pointer gap-2 bg-emerald-600 text-xs text-white hover:bg-emerald-500"
          >
            {isReplaying ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}
            Replay Job Now
          </Button>
        </div>
      </div>
    </div>
  )
}
