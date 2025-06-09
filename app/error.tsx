"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 全局错误处理页面
 *
 * @module YYC/core
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 记录错误到错误报告服务
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">出现错误</h1>
        <p className="mb-6 text-muted-foreground">
          抱歉，系统运行过程中遇到了问题。请尝试重新加载页面或联系系统管理员。
        </p>
        <div className="flex gap-2">
          <Button onClick={() => reset()}>重试</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            返回首页
          </Button>
        </div>
      </div>
    </div>
  )
}
