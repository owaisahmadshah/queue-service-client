import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { jobService } from "@/services/job.service"
import { QUERY_KEYS, DEFAULT_PAGINATION_LIMIT } from "@/config/constants"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { DispatchJobModal } from "@/components/modals/DispatchJobModal"
import { JobDetailsDrawer } from "@/components/modals/JobDetailsDrawer"
import { formatTimeAgo } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Send, RefreshCw, Eye, ChevronRight, Inbox } from "lucide-react"
import type { NotificationJob, JobCursor } from "@/types/job.types"

export function JobsPage() {
  const [cursor, setCursor] = useState<JobCursor | null>(null)
  const [cursorHistory, setCursorHistory] = useState<Array<JobCursor | null>>(
    []
  )
  const [selectedJob, setSelectedJob] = useState<NotificationJob | null>(null)
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false)

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [...QUERY_KEYS.NOTIFICATION_JOBS, cursor],
    queryFn: () =>
      jobService.getJobs({
        limit: DEFAULT_PAGINATION_LIMIT,
        cursor,
      }),
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
        title="Jobs Queue Workspace"
        description="Monitor, inspect, and dispatch notification background jobs"
      >
        <Button
          onClick={() => setIsDispatchModalOpen(true)}
          className="h-8 cursor-pointer gap-2 text-xs"
        >
          <Send className="h-3.5 w-3.5" />
          Dispatch Job
        </Button>
      </PageHeader>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Inbox className="h-4 w-4" />
          <span>Listing background jobs ({data?.data.length || 0} loaded)</span>
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

      {/* Jobs Data Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/30 text-[10px] text-muted-foreground uppercase">
              <tr>
                <th className="p-3">Job ID</th>
                <th className="p-3">Channel</th>
                <th className="p-3">Status</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Attempts</th>
                <th className="p-3">Created</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Loading jobs queue...
                  </td>
                </tr>
              ) : data?.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No notification jobs found. Dispatch one above to start!
                  </td>
                </tr>
              ) : (
                data?.data.map((job) => (
                  <tr
                    key={job.id}
                    className="transition-colors hover:bg-muted/10"
                  >
                    <td className="p-3 font-semibold text-primary">
                      {job.id.slice(0, 8)}...
                    </td>
                    <td className="p-3 uppercase">{job.channel}</td>
                    <td className="p-3">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="p-3">{job.priority}</td>
                    <td className="p-3">
                      {job.attempts} / {job.max_attempts}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {formatTimeAgo(job.created_at)}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="inline-flex cursor-pointer items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cursor Pagination Bar */}
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

      {/* Modals & Drawers */}
      <DispatchJobModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <JobDetailsDrawer
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  )
}
