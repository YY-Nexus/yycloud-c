"use client"

import { useCallback } from "react"
import { recordMetric } from "@/lib/performance-monitor"

export function usePerformanceMonitor(componentName: string) {
  const start = useCallback(() => {
    const startTime = performance.now()
    return startTime
  }, [])

  const end = useCallback(
    (startTime?: number) => {
      const endTime = performance.now()
      const duration = startTime ? endTime - startTime : 0
      recordMetric(`${componentName}-render`, duration)
      return duration
    },
    [componentName],
  )

  return { start, end }
}
