"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  Brain,
  Database,
  PieChart,
  LineChart,
  Eye,
  RefreshCw,
  Zap,
  AlertTriangle,
  Target,
  Lightbulb,
} from "lucide-react"
import { getPrivacySettings, hasConsent } from "@/lib/analytics"

export default function AnalyticsPage() {
  const [privacySettings, setPrivacySettings] = useState(null)
  const [consent, setConsent] = useState(false)

  useEffect(() => {
    // 客户端加载隐私设置
    const settings = getPrivacySettings()
    const userConsent = hasConsent()
    setPrivacySettings(settings)
    setConsent(userConsent)
  }, [])

  // 如果隐私设置未加载，显示加载状态
  if (privacySettings === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">分析仪表盘</h1>
        <p className="text-muted-foreground">查看应用使用情况和性能指标</p>
      </div>

      {/* AI洞察快速入口 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/analytics/ai-insights">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI驱动洞察</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">种分析类型</p>
              <div className="flex items-center pt-1">
                <Badge variant="secondary" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  智能分析
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/analytics/data-explorer">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">数据探索器</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">数据源</p>
              <div className="flex items-center pt-1">
                <Badge variant="outline" className="text-xs">
                  实时数据
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/analytics/dashboard-builder">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">仪表盘构建器</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">自定义仪表盘</p>
              <div className="flex items-center pt-1">
                <Badge variant="outline" className="text-xs">
                  可视化
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/analytics/reports">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">分析报告</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">生成的报告</p>
              <div className="flex items-center pt-1">
                <Badge variant="outline" className="text-xs">
                  自动生成
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="ai-insights">AI洞察</TabsTrigger>
          <TabsTrigger value="performance">性能</TabsTrigger>
          <TabsTrigger value="usage">使用情况</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总用户数</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">+12.5% 较上月</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+8.2% 较上周</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">页面浏览量</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,231</div>
                <p className="text-xs text-muted-foreground">+15.3% 较昨天</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">转化率</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">+0.5% 较上月</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>用户增长趋势</CardTitle>
                <CardDescription>过去30天的用户增长情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <LineChart className="h-8 w-8 mr-2" />
                  用户增长图表
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>功能使用分布</CardTitle>
                <CardDescription>各功能模块的使用情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">网络测试</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20" />
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">设备管理</span>
                    <div className="flex items-center gap-2">
                      <Progress value={72} className="w-20" />
                      <span className="text-sm text-muted-foreground">72%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">安全中心</span>
                    <div className="flex items-center gap-2">
                      <Progress value={58} className="w-20" />
                      <span className="text-sm text-muted-foreground">58%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">开发工具</span>
                    <div className="flex items-center gap-2">
                      <Progress value={43} className="w-20" />
                      <span className="text-sm text-muted-foreground">43%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">趋势分析</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">发现的趋势</p>
                <div className="flex items-center pt-1">
                  <Badge variant="secondary" className="text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    3个需要关注
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">异常检测</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">检测到异常</p>
                <div className="flex items-center pt-1">
                  <Badge variant="destructive" className="text-xs">
                    2个严重
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">优化建议</CardTitle>
                <Lightbulb className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">优化建议</p>
                <div className="flex items-center pt-1">
                  <Badge variant="secondary" className="text-xs">
                    <Target className="h-3 w-3 mr-1" />
                    高影响
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AI洞察中心</CardTitle>
                  <CardDescription>智能分析数据，发现隐藏的模式和趋势</CardDescription>
                </div>
                <Link href="/dashboard/analytics/ai-insights">
                  <Button>
                    <Brain className="h-4 w-4 mr-2" />
                    查看详情
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="font-medium">网络性能持续改善</h4>
                      <p className="text-sm text-muted-foreground">下载速度在过去7天内提升了15%</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">高置信度</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <h4 className="font-medium">检测到延迟异常</h4>
                      <p className="text-sm text-muted-foreground">某些时段的ping值异常偏高</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">需要关注</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">优化建议：调整测试频率</h4>
                      <p className="text-sm text-muted-foreground">建议在高峰时段增加测试频率</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">建议实施</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">页面加载时间</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2s</div>
                <p className="text-xs text-muted-foreground">-0.3s 较上周</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">错误率</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.1%</div>
                <p className="text-xs text-muted-foreground">-0.05% 较上月</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API响应时间</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245ms</div>
                <p className="text-xs text-muted-foreground">-15ms 较昨天</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">可用性</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground">+0.1% 较上月</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>功能使用统计</CardTitle>
                <CardDescription>各功能模块的详细使用情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">网络测试</span>
                      <span className="text-sm text-muted-foreground">1,234 次</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">设备管理</span>
                      <span className="text-sm text-muted-foreground">892 次</span>
                    </div>
                    <Progress value={72} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">安全扫描</span>
                      <span className="text-sm text-muted-foreground">567 次</span>
                    </div>
                    <Progress value={58} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">开发工具</span>
                      <span className="text-sm text-muted-foreground">423 次</span>
                    </div>
                    <Progress value={43} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>用户行为分析</CardTitle>
                <CardDescription>用户在平台上的行为模式</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">平均会话时长</span>
                    <span className="text-sm font-medium">12分钟</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">页面跳出率</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">重复访问率</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">功能完成率</span>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 隐私设置提示 - 只在分析功能被禁用时显示 */}
      {(!consent || !privacySettings.analyticsEnabled) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">分析功能已禁用</CardTitle>
            <CardDescription className="text-yellow-700">
              您当前已禁用分析功能，要查看详细的使用数据，请在隐私设置中启用分析。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/privacy">
              <Button variant="outline" className="border-yellow-300 text-yellow-800 hover:bg-yellow-100">
                前往隐私设置
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
