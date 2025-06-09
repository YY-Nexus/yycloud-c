"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Smartphone, Monitor, MessageSquare } from "lucide-react"
import { getPerformanceReport, getFeedbackStats } from "@/lib/performance-monitor"

export default function PerformancePage() {
  const [performanceReport, setPerformanceReport] = useState<any>(null)
  const [feedbackStats, setFeedbackStats] = useState<any>(null)

  useEffect(() => {
    setPerformanceReport(getPerformanceReport())
    setFeedbackStats(getFeedbackStats())
  }, [])

  if (!performanceReport || !feedbackStats) {
    return <div>加载中...</div>
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "优秀"
    if (score >= 70) return "良好"
    if (score >= 50) return "一般"
    return "需要改进"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">性能监控</h1>
        <p className="text-muted-foreground">应用性能和用户反馈分析</p>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">性能指标</TabsTrigger>
          <TabsTrigger value="feedback">用户反馈</TabsTrigger>
          <TabsTrigger value="devices">设备分析</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          {/* 性能评分 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                整体性能评分
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">
                  <span className={getScoreColor(performanceReport.performanceScore)}>
                    {performanceReport.performanceScore}
                  </span>
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <div>
                  <Badge className={getScoreColor(performanceReport.performanceScore)}>
                    {getScoreLabel(performanceReport.performanceScore)}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">
                    基于 {performanceReport.totalMeasurements} 次测量
                  </div>
                </div>
              </div>
              <Progress value={performanceReport.performanceScore} className="mt-4" />
            </CardContent>
          </Card>

          {/* 关键指标 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(performanceReport.metrics).map(([key, value]: [string, any]) => (
              <Card key={key}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{key}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {typeof value === "number" ? `${value.toFixed(2)}ms` : value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          {/* 反馈概览 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  总反馈数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feedbackStats.totalFeedback}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">平均评分</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feedbackStats.averageRating.toFixed(1)}/5</div>
              </CardContent>
            </Card>

            {Object.entries(feedbackStats.typeBreakdown).map(([type, count]: [string, any]) => (
              <Card key={type}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 最近反馈 */}
          <Card>
            <CardHeader>
              <CardTitle>最近反馈</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackStats.recentComments.map((feedback: any) => (
                  <div key={feedback.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge>{feedback.type}</Badge>
                      <span className="text-sm text-muted-foreground">评分: {feedback.rating}/5</span>
                    </div>
                    <p className="text-sm">{feedback.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          {/* 设备分布 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  移动设备
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{performanceReport.deviceBreakdown.mobile}</div>
                <Progress
                  value={(performanceReport.deviceBreakdown.mobile / performanceReport.totalMeasurements) * 100}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  桌面设备
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{performanceReport.deviceBreakdown.desktop}</div>
                <Progress
                  value={(performanceReport.deviceBreakdown.desktop / performanceReport.totalMeasurements) * 100}
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
