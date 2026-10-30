import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/shared/AppSidebar"
import { Navbar } from "@/components/shared/Navbar"

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background font-mono text-foreground">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex-1 space-y-8 overflow-y-auto p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
