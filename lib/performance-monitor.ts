/**
 * 性能监控和用户反馈系统
 */

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  deviceInfo: {
    isMobile: boolean
    userAgent: string
    screenSize: string
    connectionType: string
  }
}

interface UserFeedback {
  id: string
  type: "interaction" | "performance" | "accessibility" | "general"
  rating: number // 1-5
  comment?: string
  component?: string
  timestamp: number
  deviceInfo: any
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private feedback: UserFeedback[] = []
  private observer?: PerformanceObserver

  constructor() {
    this.initPerformanceObserver()
    this.initDeviceInfo()
  }

  // 初始化性能观察器
  private initPerformanceObserver() {
    if (typeof window === "undefined") return

    try {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry.name, entry.duration)
        }
      })

      this.observer.observe({ entryTypes: ["measure", "navigation"] })
    } catch (error) {
      console.warn("Performance observer not supported:", error)
    }
  }

  // 获取设备信息
  private getDeviceInfo() {
    if (typeof window === "undefined") return {}

    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      connectionType: connection?.effectiveType || "unknown",
      memory: (navigator as any).deviceMemory || "unknown",
      cores: navigator.hardwareConcurrency || "unknown",
    }
  }

  // 初始化设备信息收集
  private initDeviceInfo() {
    if (typeof window === "undefined") return

    // 监控页面加载性能
    window.addEventListener("load", () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType("navigation")[0] as any
        if (navigation) {
          this.recordMetric("page-load", navigation.loadEventEnd - navigation.fetchStart)
          this.recordMetric("dom-content-loaded", navigation.domContentLoadedEventEnd - navigation.fetchStart)
          this.recordMetric("first-paint", navigation.responseEnd - navigation.fetchStart)
        }
      }, 0)
    })

    // 监控内存使用
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        this.recordMetric("memory-used", memory.usedJSHeapSize)
        this.recordMetric("memory-total", memory.totalJSHeapSize)
      }, 30000) // 每30秒记录一次
    }
  }

  // 记录性能指标
  recordMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      deviceInfo: this.getDeviceInfo(),
    }

    this.metrics.push(metric)

    // 保持最近1000条记录
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    // 检查性能阈值
    this.checkPerformanceThresholds(metric)
  }

  // 检查性能阈值
  private checkPerformanceThresholds(metric: PerformanceMetric) {
    const thresholds: Record<string, number> = {
      "page-load": 3000, // 3秒
      "component-render": 100, // 100ms
      "interaction-delay": 50, // 50ms
      "animation-frame": 16.67, // 60fps
    }

    const threshold = thresholds[metric.name]
    if (threshold && metric.value > threshold) {
      console.warn(`Performance threshold exceeded for ${metric.name}: ${metric.value}ms > ${threshold}ms`)

      // 触发性能警告
      this.triggerPerformanceWarning(metric)
    }
  }

  // 触发性能警告
  private triggerPerformanceWarning(metric: PerformanceMetric) {
    // 可以发送到分析服务
    if (typeof window !== "undefined" && "gtag" in window) {
      ;(window as any).gtag("event", "performance_warning", {
        metric_name: metric.name,
        metric_value: metric.value,
        device_type: metric.deviceInfo.isMobile ? "mobile" : "desktop",
      })
    }
  }

  // 记录用户反馈
  recordFeedback(feedback: Omit<UserFeedback, "id" | "timestamp" | "deviceInfo">) {
    const fullFeedback: UserFeedback = {
      ...feedback,
      id: Date.now().toString(),
      timestamp: Date.now(),
      deviceInfo: this.getDeviceInfo(),
    }

    this.feedback.push(fullFeedback)

    // 保存到本地存储
    if (typeof window !== "undefined") {
      try {
        const existingFeedback = JSON.parse(localStorage.getItem("user-feedback") || "[]")
        existingFeedback.push(fullFeedback)
        localStorage.setItem("user-feedback", JSON.stringify(existingFeedback.slice(-100))) // 保持最近100条
      } catch (error) {
        console.warn("Failed to save feedback to localStorage:", error)
      }
    }
  }

  // 获取性能报告
  getPerformanceReport() {
    const now = Date.now()
    const last24h = this.metrics.filter((m) => now - m.timestamp < 24 * 60 * 60 * 1000)

    const averages: Record<string, number> = {}
    const counts: Record<string, number> = {}

    last24h.forEach((metric) => {
      if (!averages[metric.name]) {
        averages[metric.name] = 0
        counts[metric.name] = 0
      }
      averages[metric.name] += metric.value
      counts[metric.name]++
    })

    Object.keys(averages).forEach((key) => {
      averages[key] = averages[key] / counts[key]
    })

    return {
      period: "24h",
      metrics: averages,
      totalMeasurements: last24h.length,
      deviceBreakdown: this.getDeviceBreakdown(last24h),
      performanceScore: this.calculatePerformanceScore(averages),
    }
  }

  // 获取设备分布
  private getDeviceBreakdown(metrics: PerformanceMetric[]) {
    const breakdown = { mobile: 0, desktop: 0 }
    metrics.forEach((metric) => {
      if (metric.deviceInfo.isMobile) {
        breakdown.mobile++
      } else {
        breakdown.desktop++
      }
    })
    return breakdown
  }

  // 计算性能评分
  private calculatePerformanceScore(averages: Record<string, number>) {
    let score = 100

    // 页面加载时间影响
    if (averages["page-load"]) {
      if (averages["page-load"] > 3000) score -= 20
      else if (averages["page-load"] > 2000) score -= 10
      else if (averages["page-load"] > 1000) score -= 5
    }

    // 交互延迟影响
    if (averages["interaction-delay"]) {
      if (averages["interaction-delay"] > 100) score -= 15
      else if (averages["interaction-delay"] > 50) score -= 8
    }

    // 组件渲染时间影响
    if (averages["component-render"]) {
      if (averages["component-render"] > 200) score -= 15
      else if (averages["component-render"] > 100) score -= 8
    }

    return Math.max(0, Math.min(100, score))
  }

  // 获取用户反馈统计
  getFeedbackStats() {
    const now = Date.now()
    const last30d = this.feedback.filter((f) => now - f.timestamp < 30 * 24 * 60 * 60 * 1000)

    const ratingSum = last30d.reduce((sum, f) => sum + f.rating, 0)
    const avgRating = last30d.length > 0 ? ratingSum / last30d.length : 0

    const typeBreakdown: Record<string, number> = {}
    last30d.forEach((f) => {
      typeBreakdown[f.type] = (typeBreakdown[f.type] || 0) + 1
    })

    return {
      totalFeedback: last30d.length,
      averageRating: avgRating,
      typeBreakdown,
      recentComments: last30d.filter((f) => f.comment).slice(-10),
    }
  }

  // 清理数据
  cleanup() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}

// 全局性能监控实例
export const performanceMonitor = new PerformanceMonitor()

// 便捷函数
export const recordMetric = (name: string, value: number) => {
  performanceMonitor.recordMetric(name, value)
}

export const recordFeedback = (feedback: Omit<UserFeedback, "id" | "timestamp" | "deviceInfo">) => {
  performanceMonitor.recordFeedback(feedback)
}

export const getPerformanceReport = () => {
  return performanceMonitor.getPerformanceReport()
}

export const getFeedbackStats = () => {
  return performanceMonitor.getFeedbackStats()
}
