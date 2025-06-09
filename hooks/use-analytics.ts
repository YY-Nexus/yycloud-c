"use client"

/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 分析工具Hook
 *
 * 提供便捷的事件跟踪功能
 *
 * @module YYC/hooks
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

import { useCallback } from "react"
import { trackEvent, type EventCategory, type EventParams } from "@/lib/analytics"

export function useAnalytics() {
  // 跟踪事件
  const track = useCallback((category: EventCategory, action: string, params?: EventParams) => {
    trackEvent(category, action, params)
  }, [])

  // 跟踪页面事件
  const trackPageEvent = useCallback((action: string, params?: EventParams) => {
    trackEvent("page_view", action, params)
  }, [])

  // 跟踪用户参与事件
  const trackEngagement = useCallback((action: string, params?: EventParams) => {
    trackEvent("user_engagement", action, params)
  }, [])

  // 跟踪功能使用事件
  const trackFeatureUsage = useCallback((action: string, params?: EventParams) => {
    trackEvent("feature_usage", action, params)
  }, [])

  // 跟踪转化事件
  const trackConversion = useCallback((action: string, params?: EventParams) => {
    trackEvent("conversion", action, params)
  }, [])

  // 跟踪错误事件
  const trackError = useCallback((action: string, params?: EventParams) => {
    trackEvent("error", action, params)
  }, [])

  // 跟踪网络测试事件
  const trackNetworkTest = useCallback((action: string, params?: EventParams) => {
    trackEvent("network_test", action, params)
  }, [])

  return {
    track,
    trackPageEvent,
    trackEngagement,
    trackFeatureUsage,
    trackConversion,
    trackError,
    trackNetworkTest,
  }
}
