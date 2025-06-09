"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  Plus,
  Settings,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  BarChart3,
  Calendar,
} from "lucide-react"
import { workflowEngine } from "@/lib/workflow-engine"
import type { Workflow, WorkflowExecution } from "@/types/workflow"

export function WorkflowDashboard() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
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
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总工作流</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkflows || 0}</div>
            <p className="text-xs text-muted-foreground">{stats.activeWorkflows || 0} 个已启用</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总执行次数</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExecutions || 0}</div>
            <p className="text-xs text-muted-foreground">成功率 {(stats.successRate || 0).toFixed(1)}%</p>
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
      </div>

      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">工作流</TabsTrigger>
          <TabsTrigger value="executions">执行记录</TabsTrigger>
          <TabsTrigger value="templates">模板库</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">我的工作流</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              创建工作流
            </Button>
          </div>

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
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {workflows.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">还没有工作流</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    创建您的第一个自动化工作流，让重复性任务自动完成
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    创建工作流
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="executions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">执行记录</h3>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>最近执行</CardTitle>
              <CardDescription>工作流执行历史记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {executions.slice(0, 10).map((execution) => {
                  const workflow = workflows.find((w) => w.id === execution.workflowId)
                  return (
                    <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={getStatusColor(execution.status)}>{getStatusIcon(execution.status)}</div>
                        <div>
                          <p className="font-medium">{workflow?.name || "未知工作流"}</p>
                          <p className="text-sm text-muted-foreground">
                            {execution.triggeredBy} • {new Date(execution.startTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            execution.status === "completed"
                              ? "default"
                              : execution.status === "failed"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {execution.status === "completed"
                            ? "成功"
                            : execution.status === "failed"
                              ? "失败"
                              : execution.status === "running"
                                ? "运行中"
                                : "未知"}
                        </Badge>
                        {execution.duration && (
                          <p className="text-sm text-muted-foreground mt-1">{execution.duration}ms</p>
                        )}
                      </div>
                    </div>
                  )
                })}

                {executions.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">暂无执行记录</h3>
                    <p className="text-muted-foreground">工作流执行后，记录将显示在这里</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">工作流模板</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">模板库即将上线</h3>
                <p className="text-muted-foreground text-center">我们正在准备丰富的工作流模板，敬请期待</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
