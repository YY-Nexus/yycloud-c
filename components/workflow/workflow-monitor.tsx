"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Play,
  Pause,
  Square,
  RefreshCw,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Filter,
} from "lucide-react"
import { workflowEngine } from "@/lib/workflow-engine"
import type { Workflow, WorkflowExecution } from "@/types/workflow"

export function WorkflowMonitor() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)

  useEffect(() => {
    loadData()

    // 设置定时刷新
    const interval = setInterval(loadData, 30000) // 每30秒刷新一次
    return () => clearInterval(interval)
  }, [])

  const loadData = () => {
    setLoading(true)
    try {
      const loadedWorkflows = workflowEngine.loadWorkflows()
      const loadedExecutions = workflowEngine.loadExecutions()
      const workflowStats = workflowEngine.getStats()

      setWorkflows(loadedWorkflows)
      setExecutions(loadedExecutions)
      setStats(workflowStats)
    } catch (error) {
      console.error("加载数据失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleWorkflow = async (workflowId: string) => {
    const workflow = workflows.find((w) => w.id === workflowId)
    if (!workflow) return

    const updatedWorkflow = workflowEngine.updateWorkflow(workflowId, {
      enabled: !workflow.enabled,
    })

    if (updatedWorkflow) {
      setWorkflows((prev) => prev.map((w) => (w.id === workflowId ? updatedWorkflow : w)))
    }
  }

  const handleExecuteWorkflow = async (workflowId: string) => {
    try {
      const execution = await workflowEngine.executeWorkflow(workflowId, "手动执行")
      setExecutions((prev) => [execution, ...prev])

      // 更新统计信息
      const newStats = workflowEngine.getStats()
      setStats(newStats)
    } catch (error) {
      console.error("执行工作流失败:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "failed":
        return "text-red-600"
      case "running":
        return "text-blue-600"
      case "cancelled":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      case "running":
        return <Activity className="h-4 w-4 animate-spin" />
      case "cancelled":
        return <Square className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "已完成"
      case "failed":
        return "失败"
      case "running":
        return "运行中"
      case "cancelled":
        return "已取消"
      default:
        return "未知"
    }
  }

  // 生成执行趋势数据
  const generateTrendData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toLocaleDateString()
    })

    return last7Days.map((date) => {
      const dayExecutions = executions.filter((e) => new Date(e.startTime).toLocaleDateString() === date)

      return {
        date,
        total: dayExecutions.length,
        success: dayExecutions.filter((e) => e.status === "completed").length,
        failed: dayExecutions.filter((e) => e.status === "failed").length,
      }
    })
  }

  const filteredExecutions = selectedWorkflow ? executions.filter((e) => e.workflowId === selectedWorkflow) : executions

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">工作流监控</h2>
          <p className="text-muted-foreground">监控工作流执行状态和性能</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            筛选
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃工作流</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeWorkflows || 0}</div>
            <p className="text-xs text-muted-foreground">总共 {stats.totalWorkflows || 0} 个工作流</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日执行</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {executions.filter((e) => new Date(e.startTime).toDateString() === new Date().toDateString()).length}
            </div>
            <p className="text-xs text-muted-foreground">总共 {stats.totalExecutions || 0} 次执行</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成功率</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.successRate || 0).toFixed(1)}%</div>
            <Progress value={stats.successRate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均执行时间</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.averageExecutionTime || 0).toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">平均响应时间</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="executions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="executions">执行记录</TabsTrigger>
          <TabsTrigger value="workflows">工作流状态</TabsTrigger>
          <TabsTrigger value="trends">执行趋势</TabsTrigger>
          <TabsTrigger value="alerts">告警</TabsTrigger>
        </TabsList>

        <TabsContent value="executions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>执行记录</CardTitle>
                  <CardDescription>最近的工作流执行记录</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedWorkflow ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedWorkflow(null)}
                  >
                    全部
                  </Button>
                  {workflows.slice(0, 3).map((workflow) => (
                    <Button
                      key={workflow.id}
                      variant={selectedWorkflow === workflow.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedWorkflow(workflow.id)}
                    >
                      {workflow.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>工作流</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>触发方式</TableHead>
                      <TableHead>开始时间</TableHead>
                      <TableHead>执行时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExecutions.slice(0, 20).map((execution) => {
                      const workflow = workflows.find((w) => w.id === execution.workflowId)
                      return (
                        <TableRow key={execution.id}>
                          <TableCell className="font-medium">{workflow?.name || "未知工作流"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={getStatusColor(execution.status)}>{getStatusIcon(execution.status)}</div>
                              <Badge
                                variant={
                                  execution.status === "completed"
                                    ? "default"
                                    : execution.status === "failed"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {getStatusLabel(execution.status)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{execution.triggeredBy}</TableCell>
                          <TableCell>{new Date(execution.startTime).toLocaleString()}</TableCell>
                          <TableCell>{execution.duration ? `${execution.duration}ms` : "-"}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              查看详情
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{workflow.name}</CardTitle>
                    <Badge variant={workflow.enabled ? "default" : "secondary"}>
                      {workflow.enabled ? "已启用" : "已禁用"}
                    </Badge>
                  </div>
                  <CardDescription>{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">执行次数</span>
                      <span>{workflow.executionCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">成功率</span>
                      <span>
                        {workflow.executionCount > 0
                          ? ((workflow.successCount / workflow.executionCount) * 100).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">最后执行</span>
                      <span>
                        {workflow.lastExecuted ? new Date(workflow.lastExecuted).toLocaleDateString() : "从未执行"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => handleExecuteWorkflow(workflow.id)}>
                      <Play className="h-4 w-4 mr-1" />
                      执行
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleToggleWorkflow(workflow.id)}>
                      {workflow.enabled ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                      {workflow.enabled ? "禁用" : "启用"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>执行趋势</CardTitle>
              <CardDescription>过去7天的工作流执行趋势</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={{
                  total: {
                    label: "总执行次数",
                    color: "hsl(var(--chart-1))",
                  },
                  success: {
                    label: "成功次数",
                    color: "hsl(var(--chart-2))",
                  },
                  failed: {
                    label: "失败次数",
                    color: "hsl(var(--chart-3))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateTrendData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="var(--color-total)" />
                    <Line type="monotone" dataKey="success" stroke="var(--color-success)" />
                    <Line type="monotone" dataKey="failed" stroke="var(--color-failed)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>告警信息</CardTitle>
              <CardDescription>工作流执行异常和告警</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {executions
                  .filter((e) => e.status === "failed")
                  .slice(0, 10)
                  .map((execution) => {
                    const workflow = workflows.find((w) => w.id === execution.workflowId)
                    return (
                      <div key={execution.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{workflow?.name || "未知工作流"}</h4>
                            <Badge variant="destructive">失败</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {execution.error || "执行失败，请检查工作流配置"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(execution.startTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}

                {executions.filter((e) => e.status === "failed").length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">暂无告警</h3>
                    <p className="text-muted-foreground">所有工作流运行正常</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
