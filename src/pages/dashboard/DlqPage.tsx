import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { dlqService } from "@/services/dlq.service"
import { QUERY_KEYS, DEFAULT_PAGINATION_LIMIT } from "@/config/constants"
import { PageHeader } from "@/components/shared/PageHeader"
import { formatTimeAgo } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AlertOctagon,
  RefreshCw,
  RotateCcw,
  Trash2,
  ChevronRight,
  Eye,
} from "lucide-react"
import type { DeadLetterLog, DlqCursor } from "@/types/dlq.types"
import { DlqInspectorDrawer } from "@/components/modals/DlqInspectorDrawer"

export function DlqPage() {
  const queryClient = useQueryClient()
  const [cursor, setCursor] = useState<DlqCursor | null>(null)
  const [cursorHistory, setCursorHistory] = useState<Array<DlqCursor | null>>(
    []
  )
  const [selectedLog, setSelectedLog] = useState<DeadLetterLog | null>(null)

  // Fetch Dead Letter Queue Logs
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [...QUERY_KEYS.DEAD_LETTER_LOGS, cursor],
    queryFn: () =>
      dlqService.getLogs({
        limit: DEFAULT_PAGINATION_LIMIT,
        cursor,
      }),
  })

  // Replay Job Mutation
  const replayMutation = useMutation({
    mutationFn: dlqService.replayLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEAD_LETTER_LOGS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION_JOBS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOB_STATS })
    },
  })

  // Delete DLQ Log Mutation
  const deleteMutation = useMutation({
    mutationFn: dlqService.deleteLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEAD_LETTER_LOGS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOB_STATS })
    },
  })

  const handleNextPage = () => {
    if (data?.next_cursor) {
      setCursorHistory((prev) => [...prev, cursor])
      setCursor(data.next_cursor)
    }
  }

  const handlePrevPage = () => {
    if (cursorHistory.length > 0) {
      const prevCursor = cursorHistory[cursorHistory.length - 1]
      setCursorHistory((prev) => prev.slice(0, -1))
      setCursor(prevCursor)
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <PageHeader
        title="Dead Letter Queue (DLQ)"
        description="Inspect permanently failed notification jobs, debug failure root causes, and execute manual replayed jobs"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertOctagon className="h-4 w-4 text-rose-500" />
          <span>
            Permanently failed jobs requiring manual intervention (
            {data?.data.length || 0} items)
          </span>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex cursor-pointer items-center gap-2 rounded border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/30 text-[10px] text-muted-foreground uppercase">
              <tr>
                <th className="p-3">DLQ Record ID</th>
                <th className="p-3">Original Job ID</th>
                <th className="p-3">Channel</th>
                <th className="p-3">Failure Reason</th>
                <th className="p-3">Died</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Loading dead letter queue...
                  </td>
                </tr>
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-emerald-400">
                    Dead Letter Queue is empty! All notification jobs operating
                    cleanly.
                  </td>
                </tr>
              ) : (
                data?.data.map((log) => (
                  <tr
                    key={log.id}
                    className="transition-colors hover:bg-muted/10"
                  >
                    <td className="p-3 font-semibold text-rose-400">
                      {log.id.slice(0, 8)}...
                    </td>
                    <td className="p-3 text-primary">
                      {log.original_job_id.slice(0, 8)}...
                    </td>
                    <td className="p-3 uppercase">{log.channel}</td>
                    <td className="max-w-xs truncate p-3 text-muted-foreground">
                      {log.failure_reason || "Execution retries exhausted"}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {formatTimeAgo(log.died_at)}
                    </td>
                    <td className="space-x-3 p-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex cursor-pointer items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => replayMutation.mutate(log.id)}
                        disabled={replayMutation.isPending}
                        className="inline-flex cursor-pointer items-center gap-1 text-xs text-emerald-400 hover:underline disabled:opacity-50"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Replay</span>
                      </button>

                      <button
                        onClick={() => deleteMutation.mutate(log.id)}
                        disabled={deleteMutation.isPending}
                        className="inline-flex cursor-pointer items-center gap-1 text-xs text-rose-400 hover:underline disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Purge</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/20 p-3 text-xs">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={cursorHistory.length === 0}
            className="h-8 cursor-pointer text-xs"
          >
            Previous
          </Button>

          <span className="text-[11px] text-muted-foreground">
            Cursor Page {cursorHistory.length + 1}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!data?.has_more}
            className="h-8 cursor-pointer text-xs"
          >
            Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <DlqInspectorDrawer
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
        onReplay={async (id) => {
          await replayMutation.mutateAsync(id)
        }}
        onDelete={async (id) => {
          await deleteMutation.mutateAsync(id)
        }}
        isReplaying={replayMutation.isPending}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  )
}
