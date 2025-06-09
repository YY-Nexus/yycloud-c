import { Loader2 } from "lucide-react"

/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 加载状态组件
 *
 * @module YYC/ui
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

interface LoadingProps {
  text?: string
  size?: "sm" | "md" | "lg"
  fullScreen?: boolean
}

export function Loading({ text = "加载中...", size = "md", fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const textClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  const content = (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && <p className={`mt-2 ${textClasses[size]} text-muted-foreground`}>{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {content}
      </div>
    )
  }

  return content
}
