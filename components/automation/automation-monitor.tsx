"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Activity, AlertTriangle, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react"

interface ExecutionLog {
  id: string
  workflowName: string
  status: "success" | "failed" | "running" | "pending"
  startTime: string
  endTime?: string
  duration?: number
  message: string
}

interface PerformanceData {
  time: string
  successRate: number
  avgDuration: number
  totalExecutions: number
}

export function AutomationMonitor() {
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 模拟加载监控数据
    const loadMonitorData = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模拟执行日志
      const mockLogs: ExecutionLog[] = [
        {
          id: "1",
          workflowName: "网络监控自动化",
          status: "success",
          startTime: "2024-01-20 14:30:00",
          endTime: "2024-01-20 14:30:45",
          duration: 45,
          message: "执行成功，生成网络状态报告",
        },
        {
          id: "2",
          workflowName: "设备健康检查",
          status: "running",
          startTime: "2024-01-20 14:35:00",
          message: "正在检查设备状态...",
        },
        {
          id: "3",
          workflowName: "数据备份流程",
          status: "failed",
          startTime: "2024-01-20 14:25:00",
          endTime: "2024-01-20 14:25:30",
          duration: 30,
          message: "备份失败：磁盘空间不足",
        },
        {
          id: "4",
          workflowName: "网络监控自动化",
          status: "success",
          startTime: "2024-01-20 13:30:00",
          endTime: "2024-01-20 13:30:42",
          duration: 42,
          message: "执行成功，生成网络状态报告",
        },
        {
          id: "5",
          workflowName: "设备健康检查",
          status: "success",
          startTime: "2024-01-20 12:00:00",
          endTime: "2024-01-20 12:01:15",
          duration: 75,
          message: "所有设备状态正常",
        },
      ]

      // 模拟性能数据
      const mockPerformanceData: PerformanceData[] = [
        { time: "12:00", successRate: 95, avgDuration: 45, totalExecutions: 8 },
        { time: "13:00", successRate: 98, avgDuration: 42, totalExecutions: 12 },
        { time: "14:00", successRate: 85, avgDuration: 38, totalExecutions: 15 },
        { time: "15:00", successRate: 92, avgDuration: 50, totalExecutions: 10 },
        { time: "16:00", successRate: 100, avgDuration: 35, totalExecutions: 6 },
      ]

      setExecutionLogs(mockLogs)
      setPerformanceData(mockPerformanceData)
      setIsLoading(false)
    }

    loadMonitorData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500"
      case "failed":
        return "bg-red-500"
      case "running":
        return "bg-blue-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "成功"
      case "failed":
        return "失败"
      case "running":
        return "运行中"
      case "pending":
        return "等待中"
      default:
        return "未知"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      case "running":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const stats = {
    total: executionLogs.length,
    success: executionLogs.filter((log) => log.status === "success").length,
    failed: executionLogs.filter((log) => log.status === "failed").length,
    running: executionLogs.filter((log) => log.status === "running").length,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载监控数据...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 实时统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总执行次数</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">成功执行</p>
                <p className="text-2xl font-bold text-green-600">{stats.success}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">执行失败</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">正在运行</p>
                <p className="text-2xl font-bold text-blue-600">{stats.running}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 监控面板 */}
      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">执行日志</TabsTrigger>
          <TabsTrigger value="performance">性能监控</TabsTrigger>
          <TabsTrigger value="alerts">告警信息</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>执行日志</CardTitle>
                  <CardDescription>查看工作流的执行历史和状态</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {executionLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(log.status)}`} />
                        <div>
                          <h3 className="font-medium">{log.workflowName}</h3>
                          <p className="text-sm text-muted-foreground">{log.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getStatusIcon(log.status)}
                          {getStatusText(log.status)}
                        </Badge>
                        {log.duration && <span className="text-sm text-muted-foreground">{log.duration}秒</span>}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>开始时间: {log.startTime}</span>
                        {log.endTime && <span>结束时间: {log.endTime}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>成功率趋势</CardTitle>
                <CardDescription>工作流执行成功率变化</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    successRate: {
                      label: "成功率",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="successRate" stroke="var(--color-successRate)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>平均执行时间</CardTitle>
                <CardDescription>工作流平均执行时间变化</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    avgDuration: {
                      label: "平均时间",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="avgDuration" fill="var(--color-avgDuration)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>告警信息</CardTitle>
              <CardDescription>系统告警和异常通知</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <h3 className="font-medium text-red-800">数据备份流程失败</h3>
                      <p className="text-sm text-red-600">磁盘空间不足，无法完成备份操作</p>
                      <p className="text-xs text-red-500 mt-1">2024-01-20 14:25:30</p>
                    </div>
                  </div>
                </div>

                <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <div>
                      <h3 className="font-medium text-yellow-800">设备健康检查超时</h3>
                      <p className="text-sm text-yellow-600">检查时间超过预期，可能存在网络延迟</p>
                      <p className="text-xs text-yellow-500 mt-1">2024-01-20 13:45:00</p>
                    </div>
                  </div>
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>没有更多告警信息</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
