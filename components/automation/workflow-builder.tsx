"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Settings, Play, Save } from "lucide-react"

interface WorkflowStep {
  id: string
  type: "trigger" | "action" | "condition"
  name: string
  config: Record<string, any>
}

export function AutomationWorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState("")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [selectedStepType, setSelectedStepType] = useState<string>("")

  const stepTypes = {
    trigger: [
      { id: "schedule", name: "定时触发", description: "按照设定的时间间隔触发" },
      { id: "webhook", name: "Webhook触发", description: "通过HTTP请求触发" },
      { id: "file_change", name: "文件变化", description: "监控文件或目录变化" },
      { id: "network_event", name: "网络事件", description: "网络状态变化时触发" },
    ],
    action: [
      { id: "send_email", name: "发送邮件", description: "发送通知邮件" },
      { id: "run_script", name: "执行脚本", description: "运行自定义脚本" },
      { id: "api_call", name: "API调用", description: "调用外部API接口" },
      { id: "backup_data", name: "数据备份", description: "备份指定数据" },
      { id: "generate_report", name: "生成报告", description: "创建分析报告" },
    ],
    condition: [
      { id: "if_then", name: "条件判断", description: "根据条件执行不同操作" },
      { id: "loop", name: "循环执行", description: "重复执行指定次数" },
      { id: "wait", name: "等待延迟", description: "等待指定时间后继续" },
    ],
  }

  const addStep = (type: string, stepId: string) => {
    const stepType = stepTypes[type as keyof typeof stepTypes]?.find((s) => s.id === stepId)
    if (stepType) {
      const newStep: WorkflowStep = {
        id: `${type}_${Date.now()}`,
        type: type as "trigger" | "action" | "condition",
        name: stepType.name,
        config: {},
      }
      setSteps([...steps, newStep])
    }
  }

  const removeStep = (stepId: string) => {
    setSteps(steps.filter((step) => step.id !== stepId))
  }

  const getStepColor = (type: string) => {
    switch (type) {
      case "trigger":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "action":
        return "bg-green-100 text-green-800 border-green-200"
      case "condition":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case "trigger":
        return "⚡"
      case "action":
        return "🔧"
      case "condition":
        return "🔀"
      default:
        return "❓"
    }
  }

  return (
    <div className="space-y-6">
      {/* 工作流基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>工作流基本信息</CardTitle>
          <CardDescription>设置工作流的名称和描述</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">工作流名称</Label>
              <Input
                id="workflow-name"
                placeholder="输入工作流名称"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-description">描述</Label>
              <Textarea
                id="workflow-description"
                placeholder="描述工作流的用途"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 步骤构建器 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 步骤类型选择 */}
        <Card>
          <CardHeader>
            <CardTitle>添加步骤</CardTitle>
            <CardDescription>选择要添加的步骤类型</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stepTypes).map(([type, typeSteps]) => (
              <div key={type} className="space-y-2">
                <h4 className="font-medium capitalize flex items-center gap-2">
                  {getStepIcon(type)} {type === "trigger" ? "触发器" : type === "action" ? "操作" : "条件"}
                </h4>
                <div className="space-y-1">
                  {typeSteps.map((step) => (
                    <Button
                      key={step.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => addStep(type, step.id)}
                    >
                      <div>
                        <div className="font-medium">{step.name}</div>
                        <div className="text-xs text-muted-foreground">{step.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 工作流预览 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>工作流预览</CardTitle>
                <CardDescription>当前工作流的步骤序列</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </Button>
                <Button size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  测试运行
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {steps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-4xl mb-2">🔧</div>
                <p>还没有添加任何步骤</p>
                <p className="text-sm">从左侧选择步骤类型开始构建工作流</p>
              </div>
            ) : (
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    <div className={`border rounded-lg p-4 ${getStepColor(step.type)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-lg">{getStepIcon(step.type)}</div>
                          <div>
                            <div className="font-medium">{step.name}</div>
                            <Badge variant="outline" className="text-xs">
                              {step.type === "trigger" ? "触发器" : step.type === "action" ? "操作" : "条件"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => removeStep(step.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* 连接线 */}
                    {index < steps.length - 1 && (
                      <div className="flex justify-center py-2">
                        <div className="w-px h-4 bg-border"></div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-2 h-2 bg-border rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 工作流统计 */}
      {steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>工作流统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {steps.filter((s) => s.type === "trigger").length}
                </div>
                <div className="text-sm text-muted-foreground">触发器</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {steps.filter((s) => s.type === "action").length}
                </div>
                <div className="text-sm text-muted-foreground">操作</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {steps.filter((s) => s.type === "condition").length}
                </div>
                <div className="text-sm text-muted-foreground">条件</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
