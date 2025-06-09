import { BarChart3, Brain, Home, Settings, User } from "lucide-react"

import type { MainNavItem, SidebarNavItem } from "@/types"

interface DashboardConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "文档",
      href: "/docs",
    },
    {
      title: "支持",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "首页",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "个人资料",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: "分析中心",
      icon: BarChart3,
      href: "/dashboard/analytics",
      items: [
        {
          title: "概览",
          href: "/dashboard/analytics",
        },
        {
          title: "AI洞察",
          href: "/dashboard/analytics/ai-insights",
          icon: Brain,
        },
        {
          title: "数据探索器",
          href: "/dashboard/analytics/data-explorer",
        },
        {
          title: "仪表盘构建器",
          href: "/dashboard/analytics/dashboard-builder",
        },
        {
          title: "分析报告",
          href: "/dashboard/analytics/reports",
        },
      ],
    },
    {
      title: "设置",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ],
}
