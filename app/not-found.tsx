import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 404页面未找到
 *
 * @module YYC/core
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
          <FileQuestion className="h-10 w-10" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">页面未找到</h1>
        <p className="mb-6 text-muted-foreground">
          抱歉，您访问的页面不存在或已被移除。请检查URL是否正确，或返回首页。
        </p>
        <Button asChild>
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    </div>
  )
}
