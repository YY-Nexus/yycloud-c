/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 分析提供者组件
 *
 * 用于初始化分析工具并提供上下文
 *
 * @module YYC/components
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

"use client"

import type React from "react"

import { useEffect } from "react"
import { analytics, trackPageView } from "@/lib/analytics"
import { usePathname, useSearchParams } from "next/navigation"

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 初始化分析工具
  useEffect(() => {
    analytics.init(["google-analytics"])
  }, [])

  // 跟踪页面浏览
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname)
    }
  }, [pathname, searchParams])

  return <>{children}</>
}
