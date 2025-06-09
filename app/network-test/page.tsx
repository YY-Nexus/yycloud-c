"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Home, Wrench } from "lucide-react"

/**
 * 网络测试模块重定向页面
 *
 * 由于网络测试模块已迁移至部署指导引擎，
 * 此页面提供友好的重定向提示
 */
export default function NetworkTestRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // 3秒后自动重定向到部署指导引擎
    const timer = setTimeout(() => {
      router.push("/dashboard/deployment")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  const handleRedirectToDeployment = () => {
    router.push("/dashboard/deployment")
  }

  const handleRedirectToHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Wrench className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">模块已升级</CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            网络测试工具已升级为更强大的部署指导引擎
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🚀 新功能亮点</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• 智能部署指导和步骤化引导</li>
              <li>• 支持多平台部署（Vercel、Netlify、Docker等）</li>
              <li>• 丰富的部署模板库</li>
              <li>• 实时部署监控和状态跟踪</li>
              <li>• 性能分析和优化建议</li>
            </ul>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              页面将在 <span className="font-semibold text-blue-600">3秒</span> 后自动跳转到部署指导引擎
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRedirectToDeployment} className="flex items-center gap-2" size="lg">
                立即前往部署引擎
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button variant="outline" onClick={handleRedirectToHome} className="flex items-center gap-2" size="lg">
                <Home className="w-4 h-4" />
                返回首页
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4 border-t">
            言语云³ 中央控制平台™ - 持续优化用户体验
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
