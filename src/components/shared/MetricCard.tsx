import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  trend?: string
  trendType?: "positive" | "negative" | "neutral"
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendType = "neutral",
}: MetricCardProps) {
  return (
    <div className="flex flex-col justify-between space-y-3 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          {title}
        </span>
        <div className="rounded-md bg-muted/50 p-2 text-muted-foreground">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {(subtitle || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={cn(
                  "font-semibold",
                  trendType === "positive" && "text-emerald-400",
                  trendType === "negative" && "text-rose-400",
                  trendType === "neutral" && "text-muted-foreground"
                )}
              >
                {trend}
              </span>
            )}
            {subtitle && (
              <span className="text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
