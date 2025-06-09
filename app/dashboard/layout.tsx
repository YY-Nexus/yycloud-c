import type React from "react"
import { CloudLogo } from "@/components/ui/cloud-logo"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        {/* 在侧边栏顶部添加 */}
        <div className="flex items-center justify-center py-6 border-b">
          <CloudLogo
            size="lg"
            withText={true}
            href="/dashboard"
            className="hover:scale-105 transition-transform duration-200"
          />
        </div>
        {/* Sidebar Content */}
        <div className="p-4">
          {/* Add your sidebar navigation items here */}
          <p>Sidebar Content</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  )
}
