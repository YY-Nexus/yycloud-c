import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import ServerInfoHub from "@/components/cloud-server/server-info-hub"

export default function ServerInfoPage() {
  return (
    <div className="relative">
      <DashboardNav />
      <ServerInfoHub />
    </div>
  )
}
