/**
 * 移动端交互优化工具函数
 */

// 检测是否为移动设备
export const isMobileDevice = () => {
  if (typeof window === "undefined") return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 检测是否支持触摸
export const isTouchDevice = () => {
  if (typeof window === "undefined") return false
  return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

// 防抖函数，防止快速重复点击
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流函数，限制函数执行频率
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 触觉反馈
export const hapticFeedback = (type: "light" | "medium" | "heavy" = "light") => {
  if (typeof window === "undefined") return

  // 检查是否支持触觉反馈
  if ("vibrate" in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
    }
    navigator.vibrate(patterns[type])
  }
}

// 获取安全区域内边距
export const getSafeAreaInsets = () => {
  if (typeof window === "undefined") return { top: 0, bottom: 0, left: 0, right: 0 }

  const style = getComputedStyle(document.documentElement)
  return {
    top: Number.parseInt(style.getPropertyValue("--safe-area-inset-top") || "0"),
    bottom: Number.parseInt(style.getPropertyValue("--safe-area-inset-bottom") || "0"),
    left: Number.parseInt(style.getPropertyValue("--safe-area-inset-left") || "0"),
    right: Number.parseInt(style.getPropertyValue("--safe-area-inset-right") || "0"),
  }
}

// 记录性能指标
export const recordMetric = (name: string, value: number, unit?: string) => {
  if (typeof window === "undefined") return

  // 使用 Performance API 记录自定义指标
  if ("performance" in window && "mark" in window.performance) {
    try {
      window.performance.mark(`${name}:${value}${unit ? `:${unit}` : ""}`)
    } catch (error) {
      console.warn("Failed to record metric:", error)
    }
  }

  // 也可以发送到分析服务
  console.log(`Metric recorded: ${name} = ${value}${unit ? ` ${unit}` : ""}`)
}
