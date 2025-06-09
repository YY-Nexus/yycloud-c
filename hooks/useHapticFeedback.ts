type FeedbackType = "selection" | "notification" | "error" | "success" | "warning"

export function useHapticFeedback() {
  const triggerHaptic = (type: FeedbackType) => {
    // 检查设备是否支持振动
    if (!navigator.vibrate) return

    switch (type) {
      case "selection":
        navigator.vibrate(10) // 短振动
        break
      case "notification":
        navigator.vibrate([15, 10, 15]) // 双振动
        break
      case "error":
        navigator.vibrate([50, 30, 50, 30, 50]) // 长振动序列
        break
      case "success":
        navigator.vibrate([10, 20, 40]) // 递增振动
        break
      case "warning":
        navigator.vibrate([30, 20, 30]) // 中等振动
        break
      default:
        navigator.vibrate(15) // 默认振动
    }
  }

  return { triggerHaptic }
}
