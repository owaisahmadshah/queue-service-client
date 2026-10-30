import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Inbox,
  AlertTriangle,
  KeyRound,
  Settings,
  Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Jobs Queue", href: "/dashboard/jobs", icon: Inbox },
  { name: "Dead Letter Queue", href: "/dashboard/dlq", icon: AlertTriangle },
  { name: "API Keys", href: "/dashboard/api-keys", icon: KeyRound },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function AppSidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-border bg-muted/10 font-mono">
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded bg-primary p-2 text-primary-foreground">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-wider">QUEUE ENGINE</div>
            <div className="text-[10px] text-muted-foreground">
              v1.0.0 • Redis/PostgreSQL
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/dashboard"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "border-l-2 border-primary bg-primary/10 font-bold text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-border p-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span>Worker Clusters Active</span>
        </div>
      </div>
    </aside>
  )
}
