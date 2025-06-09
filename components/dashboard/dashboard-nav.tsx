"use client"

import { ArrowLeft, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DashboardNavProps {
  className?: string
}

export function DashboardNav({ className }: DashboardNavProps) {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    try {
      router.push("/")
    } catch (error) {
      // 如果路由跳转失败，使用原生方法
      window.location.href = "/"
    }
  }

  return (
    <div className={cn("absolute top-4 left-4 z-50", className)}>
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoBack}
          title="返回上一页"
          aria-label="返回上一页"
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoHome}
          title="返回主页"
          aria-label="返回主页"
          className="hover:bg-muted"
        >
          <Home className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
