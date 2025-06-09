"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Play, Pause, Settings, BarChart3, Zap } from "lucide-react"
import { AutomationWorkflowBuilder } from "@/components/automation/workflow-builder"
import { AutomationScheduler } from "@/components/automation/automation-scheduler"
import { AutomationMonitor } from "@/components/automation/automation-monitor"
import { AutomationTemplates } from "@/components/automation/automation-templates"
import { AutomationHistory } from "@/components/automation/automation-history"
import { AutomationSettings } from "@/components/automation/automation-settings"

interface AutomationWorkflow {
  id: string
  name: string
  description: string
  status: "active" | "paused" | "stopped"
  lastRun: string
  nextRun: string
  successRate: number
  triggers: number
  actions: number
}

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 模拟加载工作流数据
    const loadWorkflows = async () => {
      setIsLoading(true)
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockWorkflows: AutomationWorkflow[] = [
        {
          id: "1",
          name: "网络监控自动化",
          description: "每小时自动检测网络状态并生成报告",
          status: "active",
          lastRun: "2024-01-20 14:30:00",
          nextRun: "2024-01-20 15:30:00",
          successRate: 98.5,
          triggers: 3,
          actions: 5,
        },
        {
          id: "2",
          name: "设备健康检查",
          description: "定期检查设备状态并发送警报",
          status: "active",
          lastRun: "2024-01-20 14:00:00",
          nextRun: "2024-01-20 16:00:00",
          successRate: 95.2,
          triggers: 2,
          actions: 4,
        },
        {
          id: "3",
          name: "数据备份流程",
          description: "每日自动备份重要数据",
          status: "paused",
          lastRun: "2024-01-19 23:00:00",
          nextRun: "暂停中",
          successRate: 100,
          triggers: 1,
          actions: 3,
        },
      ]

      setWorkflows(mockWorkflows)
      setIsLoading(false)
    }

    loadWorkflows()
  }, [])

  const handleWorkflowToggle = (workflowId: string) => {
    setWorkflows((prev) =>
      prev.map((workflow) =>
        workflow.id === workflowId
          ? {
              ...workflow,
              status: workflow.status === "active" ? "paused" : "active",
            }
          : workflow,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "stopped":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "运行中"
      case "paused":
        return "已暂停"
      case "stopped":
        return "已停止"
      default:
        return "未知"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载自动化工作流...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">自动化工作流</h1>
          <p className="text-muted-foreground mt-2">创建和管理自动化任务，提升工作效率</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          创建工作流
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总工作流</p>
                <p className="text-2xl font-bold">{workflows.length}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">运行中</p>
                <p className="text-2xl font-bold text-green-600">
                  {workflows.filter((w) => w.status === "active").length}
                </p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">已暂停</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {workflows.filter((w) => w.status === "paused").length}
                </p>
              </div>
              <Pause className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">平均成功率</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(workflows.reduce((acc, w) => acc + w.successRate, 0) / workflows.length).toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">工作流列表</TabsTrigger>
          <TabsTrigger value="builder">工作流构建器</TabsTrigger>
          <TabsTrigger value="scheduler">调度器</TabsTrigger>
          <TabsTrigger value="monitor">监控</TabsTrigger>
          <TabsTrigger value="templates">模板</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(workflow.status)}`} />
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <CardDescription>{workflow.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getStatusText(workflow.status)}</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleWorkflowToggle(workflow.id)}>
                        {workflow.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">上次运行</p>
                      <p className="font-medium">{workflow.lastRun}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">下次运行</p>
                      <p className="font-medium">{workflow.nextRun}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">成功率</p>
                      <p className="font-medium text-green-600">{workflow.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">触发器</p>
                      <p className="font-medium">{workflow.triggers} 个</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">操作</p>
                      <p className="font-medium">{workflow.actions} 个</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder">
          <AutomationWorkflowBuilder />
        </TabsContent>

        <TabsContent value="scheduler">
          <AutomationScheduler />
        </TabsContent>

        <TabsContent value="monitor">
          <AutomationMonitor />
        </TabsContent>

        <TabsContent value="templates">
          <AutomationTemplates />
        </TabsContent>

        <TabsContent value="history">
          <AutomationHistory />
        </TabsContent>

        <TabsContent value="settings">
          <AutomationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
