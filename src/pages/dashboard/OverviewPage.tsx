import { useQuery } from "@tanstack/react-query"
import { jobService } from "@/services/job.service"
import { QUERY_KEYS, POLLING_INTERVALS } from "@/config/constants"
import { PageHeader } from "@/components/shared/PageHeader"
import { MetricCard } from "@/components/shared/MetricCard"
import {
  CheckCircle2,
  XCircle,
  Activity,
  AlertTriangle,
  RefreshCw,
  Layers,
  Zap,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { useAuth } from "@/contexts/AuthContext"

export function OverviewPage() {
  const { isAuthenticated } = useAuth()

  const {
    data: stats,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.JOB_STATS,
    queryFn: jobService.getStats,
    refetchInterval: POLLING_INTERVALS.STATS,
    enabled: isAuthenticated,
  })

  const backlogData = [
    { name: "Pending", count: stats?.backlog.pending ?? 0, color: "#f59e0b" },
    {
      name: "Processing",
      count: stats?.backlog.processing ?? 0,
      color: "#3b82f6",
    },
    {
      name: "Dead Letter",
      count: stats?.backlog.dead_letter_queues ?? 0,
      color: "#f43f5e",
    },
  ]

  const liveQueueData = [
    {
      name: "Email Waiting",
      count: stats?.live_queue_stats.email_queue.waiting ?? 0,
      color: "#f59e0b",
    },
    {
      name: "Email Active",
      count: stats?.live_queue_stats.email_queue.active ?? 0,
      color: "#3b82f6",
    },
    {
      name: "Email Delayed",
      count: stats?.live_queue_stats.email_queue.delayed ?? 0,
      color: "#a855f7",
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="System Overview"
        description="Real-time performance metrics, live worker queue stats, and execution status"
      >
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex cursor-pointer items-center gap-2 rounded border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          {isFetching ? "Syncing..." : "Refresh Stats"}
        </button>
      </PageHeader>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Processed Jobs"
          value={
            isLoading ? "..." : (stats?.summary.total_proccessed_jobs ?? 0)
          }
          subtitle="Total executions recorded"
          icon={<Layers className="h-4 w-4" />}
        />
        <MetricCard
          title="Success Rate"
          value={isLoading ? "..." : `${stats?.summary.success_rate ?? 0}%`}
          subtitle={`${stats?.summary.total_success ?? 0} successful jobs`}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />}
          trendType={
            (stats?.summary.success_rate ?? 0) >= 95
              ? "positive"
              : (stats?.summary.success_rate ?? 0) >= 80
                ? "neutral"
                : "negative"
          }
        />
        <MetricCard
          title="Total Failures"
          value={isLoading ? "..." : (stats?.summary.total_failed ?? 0)}
          subtitle="Failed execution attempts"
          icon={<XCircle className="h-4 w-4 text-rose-400" />}
        />
        <MetricCard
          title="Dead Letter Queue"
          value={isLoading ? "..." : (stats?.backlog.dead_letter_queues ?? 0)}
          subtitle="Jobs awaiting replay or purge"
          icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart 1: Active Backlog Breakdown */}
        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase">
                Active Backlog State
              </h2>
              <p className="text-xs text-muted-foreground">
                Current jobs in Redis memory queues
              </p>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={backlogData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#27272a",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {backlogData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Live Worker Queue Breakdown */}
        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase">
                BullMQ Live Queues
              </h2>
              <p className="text-xs text-muted-foreground">
                Email worker queue live state distribution
              </p>
            </div>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={liveQueueData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#27272a",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {liveQueueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Channel Breakdown Panel */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-sm font-bold tracking-wide uppercase">
          Channel Breakdown (Email)
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1 rounded border border-border bg-muted/20 p-4">
            <span className="text-xs text-muted-foreground uppercase">
              Email Successes
            </span>
            <div className="text-xl font-bold text-emerald-400">
              {stats?.channel_break_down.email.success ?? 0}
            </div>
          </div>
          <div className="space-y-1 rounded border border-border bg-muted/20 p-4">
            <span className="text-xs text-muted-foreground uppercase">
              Email Failures
            </span>
            <div className="text-xl font-bold text-rose-400">
              {stats?.channel_break_down.email.failed ?? 0}
            </div>
          </div>
          <div className="space-y-1 rounded border border-border bg-muted/20 p-4">
            <span className="text-xs text-muted-foreground uppercase">
              Success Rate
            </span>
            <div className="text-xl font-bold">
              {stats?.channel_break_down.email.success_rate_percent ?? 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
