"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 仪表盘面包屑导航组件
 *
 * @module YYC/dashboard
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

// 路径映射表，将技术路径转换为友好的中文名称
const pathMap: Record<string, string> = {
  dashboard: "控制台",
  "network-test": "网速测试",
  "network-monitor": "网络监控",
  "device-comparison": "设备对比",
  "device-management": "设备管理",
  reports: "报告管理",
  settings: "系统设置",
}

export function DashboardBreadcrumb() {
  const pathname = usePathname()

  // 如果不在仪表盘路径下，不显示面包屑
  if (!pathname.startsWith("/dashboard")) {
    return null
  }

  // 分割路径并移除空字符串
  const pathSegments = pathname.split("/").filter(Boolean)

  // 构建面包屑项
  const breadcrumbs = pathSegments.map((segment, index) => {
    // 构建当前层级的完整路径
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`

    // 获取显示名称，如果在映射表中没有找到，则使用路径名
    const displayName = pathMap[segment] || segment

    // 是否为最后一项（当前页面）
    const isLast = index === pathSegments.length - 1

    return {
      path,
      displayName,
      isLast,
    }
  })

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Link href="/" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
        <span className="sr-only">首页</span>
      </Link>
      <ChevronRight className="h-4 w-4" />

      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center">
          {breadcrumb.isLast ? (
            <span className="font-medium text-foreground">{breadcrumb.displayName}</span>
          ) : (
            <>
              <Link href={breadcrumb.path} className="hover:text-foreground transition-colors">
                {breadcrumb.displayName}
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
            </>
          )}
        </div>
      ))}
    </nav>
  )
}
