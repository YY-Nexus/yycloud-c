"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Plus,
  Trash2,
  Save,
  Play,
  Settings,
  Clock,
  Zap,
  Mail,
  Globe,
  Code,
  Timer,
  GitBranch,
  ArrowDown,
} from "lucide-react"
import { workflowEngine } from "@/lib/workflow-engine"
import type { Workflow, WorkflowTrigger, WorkflowAction, WorkflowVariable } from "@/types/workflow"
import { IntegrationManager } from "./integration-manager"
import { AIWorkflowAssistant } from "./ai-workflow-assistant"

interface WorkflowEditorProps {
  workflowId?: string
  onSave?: (workflow: Workflow) => void
  onCancel?: () => void
}

export function WorkflowEditor({ workflowId, onSave, onCancel }: WorkflowEditorProps) {
  const [workflow, setWorkflow] = useState<Partial<Workflow>>({
    name: "",
    description: "",
    category: "",
    tags: [],
    triggers: [],
    actions: [],
    variables: [],
    enabled: false,
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  useEffect(() => {
    if (workflowId) {
      const existingWorkflow = workflowEngine.getWorkflow(workflowId)
      if (existingWorkflow) {
        setWorkflow(existingWorkflow)
      }
    }
  }, [workflowId])

  const handleSave = async () => {
    setLoading(true)
    try {
      let savedWorkflow: Workflow

      if (workflowId) {
        savedWorkflow = workflowEngine.updateWorkflow(workflowId, workflow) as Workflow
      } else {
        savedWorkflow = workflowEngine.createWorkflow(
          workflow as Omit<
            Workflow,
            "id" | "createdAt" | "updatedAt" | "executionCount" | "successCount" | "failureCount" | "version"
          >,
        )
      }

      onSave?.(savedWorkflow)
    } catch (error) {
      console.error("保存工作流失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async () => {
    if (!workflowId) {
      // 先保存再测试
      await handleSave()
      return
    }

    try {
      await workflowEngine.executeWorkflow(workflowId, "测试执行")
    } catch (error) {
      console.error("测试执行失败:", error)
    }
  }

  const addTrigger = () => {
    const newTrigger: WorkflowTrigger = {
      id: Math.random().toString(36).substr(2, 9),
      type: "manual",
      name: "新触发器",
      config: {},
      enabled: true,
    }

    setWorkflow((prev) => ({
      ...prev,
      triggers: [...(prev.triggers || []), newTrigger],
    }))
  }

  const updateTrigger = (triggerId: string, updates: Partial<WorkflowTrigger>) => {
    setWorkflow((prev) => ({
      ...prev,
      triggers: prev.triggers?.map((trigger) => (trigger.id === triggerId ? { ...trigger, ...updates } : trigger)),
    }))
  }

  const removeTrigger = (triggerId: string) => {
    setWorkflow((prev) => ({
      ...prev,
      triggers: prev.triggers?.filter((trigger) => trigger.id !== triggerId),
    }))
  }

  const addAction = () => {
    const newAction: WorkflowAction = {
      id: Math.random().toString(36).substr(2, 9),
      type: "notification",
      name: "新动作",
      config: {},
      enabled: true,
      order: (workflow.actions?.length || 0) + 1,
    }

    setWorkflow((prev) => ({
      ...prev,
      actions: [...(prev.actions || []), newAction],
    }))
  }

  const updateAction = (actionId: string, updates: Partial<WorkflowAction>) => {
    setWorkflow((prev) => ({
      ...prev,
      actions: prev.actions?.map((action) => (action.id === actionId ? { ...action, ...updates } : action)),
    }))
  }

  const removeAction = (actionId: string) => {
    setWorkflow((prev) => ({
      ...prev,
      actions: prev.actions?.filter((action) => action.id !== actionId),
    }))
  }

  const addVariable = () => {
    const newVariable: WorkflowVariable = {
      id: Math.random().toString(36).substr(2, 9),
      name: "new_variable",
      type: "string",
      value: "",
      description: "",
    }

    setWorkflow((prev) => ({
      ...prev,
      variables: [...(prev.variables || []), newVariable],
    }))
  }

  const updateVariable = (variableId: string, updates: Partial<WorkflowVariable>) => {
    setWorkflow((prev) => ({
      ...prev,
      variables: prev.variables?.map((variable) =>
        variable.id === variableId ? { ...variable, ...updates } : variable,
      ),
    }))
  }

  const removeVariable = (variableId: string) => {
    setWorkflow((prev) => ({
      ...prev,
      variables: prev.variables?.filter((variable) => variable.id !== variableId),
    }))
  }

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case "schedule":
        return <Clock className="h-4 w-4" />
      case "event":
        return <Zap className="h-4 w-4" />
      case "webhook":
        return <Globe className="h-4 w-4" />
      default:
        return <Play className="h-4 w-4" />
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case "notification":
        return <Zap className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "webhook":
        return <Globe className="h-4 w-4" />
      case "script":
        return <Code className="h-4 w-4" />
      case "delay":
        return <Timer className="h-4 w-4" />
      case "condition":
        return <GitBranch className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{workflowId ? "编辑工作流" : "创建工作流"}</h2>
          <p className="text-muted-foreground">设计自动化工作流程，提高工作效率</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button variant="outline" onClick={handleTest}>
            <Play className="h-4 w-4 mr-2" />
            测试
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "保存中..." : "保存"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">基本信息</TabsTrigger>
          <TabsTrigger value="triggers">触发器</TabsTrigger>
          <TabsTrigger value="actions">动作</TabsTrigger>
          <TabsTrigger value="variables">变量</TabsTrigger>
          <TabsTrigger value="integrations">集成</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI助手</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>设置工作流的基本信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">工作流名称</Label>
                  <Input
                    id="name"
                    value={workflow.name}
                    onChange={(e) => setWorkflow((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="输入工作流名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">分类</Label>
                  <Select
                    value={workflow.category}
                    onValueChange={(value) => setWorkflow((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automation">自动化</SelectItem>
                      <SelectItem value="monitoring">监控</SelectItem>
                      <SelectItem value="notification">通知</SelectItem>
                      <SelectItem value="data">数据处理</SelectItem>
                      <SelectItem value="productivity">生产力</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  value={workflow.description}
                  onChange={(e) => setWorkflow((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="描述工作流的功能和用途"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={workflow.enabled}
                  onCheckedChange={(checked) => setWorkflow((prev) => ({ ...prev, enabled: checked }))}
                />
                <Label htmlFor="enabled">启用工作流</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>触发器</CardTitle>
                  <CardDescription>设置工作流的触发条件</CardDescription>
                </div>
                <Button onClick={addTrigger}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加触发器
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {workflow.triggers && workflow.triggers.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-2">
                  {workflow.triggers.map((trigger, index) => (
                    <AccordionItem key={trigger.id} value={trigger.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center space-x-2">
                          {getTriggerIcon(trigger.type)}
                          <span>{trigger.name}</span>
                          <Badge variant="outline">{trigger.type}</Badge>
                          {!trigger.enabled && <Badge variant="secondary">已禁用</Badge>}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>触发器名称</Label>
                            <Input
                              value={trigger.name}
                              onChange={(e) => updateTrigger(trigger.id, { name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>触发器类型</Label>
                            <Select
                              value={trigger.type}
                              onValueChange={(value) => updateTrigger(trigger.id, { type: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="manual">手动触发</SelectItem>
                                <SelectItem value="schedule">定时触发</SelectItem>
                                <SelectItem value="event">事件触发</SelectItem>
                                <SelectItem value="webhook">Webhook触发</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {trigger.type === "schedule" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>调度类型</Label>
                                <Select
                                  value={trigger.config.schedule?.type || "interval"}
                                  onValueChange={(value) =>
                                    updateTrigger(trigger.id, {
                                      config: {
                                        ...trigger.config,
                                        schedule: { ...trigger.config.schedule, type: value as any },
                                      },
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="interval">间隔执行</SelectItem>
                                    <SelectItem value="daily">每日执行</SelectItem>
                                    <SelectItem value="weekly">每周执行</SelectItem>
                                    <SelectItem value="monthly">每月执行</SelectItem>
                                    <SelectItem value="cron">Cron表达式</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>
                                  {trigger.config.schedule?.type === "interval"
                                    ? "间隔时间(秒)"
                                    : trigger.config.schedule?.type === "cron"
                                      ? "Cron表达式"
                                      : "时间"}
                                </Label>
                                <Input
                                  value={trigger.config.schedule?.value || ""}
                                  onChange={(e) =>
                                    updateTrigger(trigger.id, {
                                      config: {
                                        ...trigger.config,
                                        schedule: { ...trigger.config.schedule, value: e.target.value },
                                      },
                                    })
                                  }
                                  placeholder={
                                    trigger.config.schedule?.type === "interval"
                                      ? "300"
                                      : trigger.config.schedule?.type === "cron"
                                        ? "0 9 * * *"
                                        : "09:00"
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {trigger.type === "webhook" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Webhook URL</Label>
                                <Input
                                  value={trigger.config.webhook?.url || ""}
                                  onChange={(e) =>
                                    updateTrigger(trigger.id, {
                                      config: {
                                        ...trigger.config,
                                        webhook: { ...trigger.config.webhook, url: e.target.value },
                                      },
                                    })
                                  }
                                  placeholder="https://example.com/webhook"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>HTTP方法</Label>
                                <Select
                                  value={trigger.config.webhook?.method || "POST"}
                                  onValueChange={(value) =>
                                    updateTrigger(trigger.id, {
                                      config: {
                                        ...trigger.config,
                                        webhook: { ...trigger.config.webhook, method: value as any },
                                      },
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="GET">GET</SelectItem>
                                    <SelectItem value="POST">POST</SelectItem>
                                    <SelectItem value="PUT">PUT</SelectItem>
                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={trigger.enabled}
                              onCheckedChange={(checked) => updateTrigger(trigger.id, { enabled: checked })}
                            />
                            <Label>启用触发器</Label>
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => removeTrigger(trigger.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">暂无触发器</h3>
                  <p className="text-muted-foreground mb-4">添加触发器来定义工作流的执行条件</p>
                  <Button onClick={addTrigger}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加第一个触发器
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>动作</CardTitle>
                  <CardDescription>设置工作流要执行的动作</CardDescription>
                </div>
                <Button onClick={addAction}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加动作
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {workflow.actions && workflow.actions.length > 0 ? (
                <div className="space-y-4">
                  {workflow.actions
                    .sort((a, b) => a.order - b.order)
                    .map((action, index) => (
                      <Card key={action.id} className="relative">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                {index + 1}
                              </div>
                              {getActionIcon(action.type)}
                              <span className="font-medium">{action.name}</span>
                              <Badge variant="outline">{action.type}</Badge>
                              {!action.enabled && <Badge variant="secondary">已禁用</Badge>}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeAction(action.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>动作名称</Label>
                              <Input
                                value={action.name}
                                onChange={(e) => updateAction(action.id, { name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>动作类型</Label>
                              <Select
                                value={action.type}
                                onValueChange={(value) => updateAction(action.id, { type: value as any })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="notification">发送通知</SelectItem>
                                  <SelectItem value="email">发送邮件</SelectItem>
                                  <SelectItem value="webhook">调用Webhook</SelectItem>
                                  <SelectItem value="script">执行脚本</SelectItem>
                                  <SelectItem value="delay">延迟等待</SelectItem>
                                  <SelectItem value="condition">条件判断</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {action.type === "notification" && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>通知标题</Label>
                                  <Input
                                    value={action.config.notification?.title || ""}
                                    onChange={(e) =>
                                      updateAction(action.id, {
                                        config: {
                                          ...action.config,
                                          notification: { ...action.config.notification, title: e.target.value },
                                        },
                                      })
                                    }
                                    placeholder="通知标题"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>通知类型</Label>
                                  <Select
                                    value={action.config.notification?.type || "info"}
                                    onValueChange={(value) =>
                                      updateAction(action.id, {
                                        config: {
                                          ...action.config,
                                          notification: { ...action.config.notification, type: value as any },
                                        },
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="info">信息</SelectItem>
                                      <SelectItem value="success">成功</SelectItem>
                                      <SelectItem value="warning">警告</SelectItem>
                                      <SelectItem value="error">错误</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>通知内容</Label>
                                <Textarea
                                  value={action.config.notification?.message || ""}
                                  onChange={(e) =>
                                    updateAction(action.id, {
                                      config: {
                                        ...action.config,
                                        notification: { ...action.config.notification, message: e.target.value },
                                      },
                                    })
                                  }
                                  placeholder="通知内容"
                                  rows={3}
                                />
                              </div>
                            </div>
                          )}

                          {action.type === "webhook" && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Webhook URL</Label>
                                  <Input
                                    value={action.config.webhook?.url || ""}
                                    onChange={(e) =>
                                      updateAction(action.id, {
                                        config: {
                                          ...action.config,
                                          webhook: { ...action.config.webhook, url: e.target.value },
                                        },
                                      })
                                    }
                                    placeholder="https://example.com/api/webhook"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>HTTP方法</Label>
                                  <Select
                                    value={action.config.webhook?.method || "POST"}
                                    onValueChange={(value) =>
                                      updateAction(action.id, {
                                        config: {
                                          ...action.config,
                                          webhook: { ...action.config.webhook, method: value as any },
                                        },
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="GET">GET</SelectItem>
                                      <SelectItem value="POST">POST</SelectItem>
                                      <SelectItem value="PUT">PUT</SelectItem>
                                      <SelectItem value="DELETE">DELETE</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>请求体 (JSON)</Label>
                                <Textarea
                                  value={action.config.webhook?.body || ""}
                                  onChange={(e) =>
                                    updateAction(action.id, {
                                      config: {
                                        ...action.config,
                                        webhook: { ...action.config.webhook, body: e.target.value },
                                      },
                                    })
                                  }
                                  placeholder='{"key": "value"}'
                                  rows={4}
                                />
                              </div>
                            </div>
                          )}

                          {action.type === "script" && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>脚本语言</Label>
                                <Select
                                  value={action.config.script?.language || "javascript"}
                                  onValueChange={(value) =>
                                    updateAction(action.id, {
                                      config: {
                                        ...action.config,
                                        script: { ...action.config.script, language: value as any },
                                      },
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="javascript">JavaScript</SelectItem>
                                    <SelectItem value="python">Python</SelectItem>
                                    <SelectItem value="bash">Bash</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>脚本代码</Label>
                                <Textarea
                                  value={action.config.script?.code || ""}
                                  onChange={(e) =>
                                    updateAction(action.id, {
                                      config: {
                                        ...action.config,
                                        script: { ...action.config.script, code: e.target.value },
                                      },
                                    })
                                  }
                                  placeholder="// 在这里编写脚本代码"
                                  rows={8}
                                  className="font-mono"
                                />
                              </div>
                            </div>
                          )}

                          {action.type === "delay" && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>延迟时间</Label>
                                <Input
                                  type="number"
                                  value={action.config.delay?.duration || ""}
                                  onChange={(e) =>
                                    updateAction(action.id, {
                                      config: {
                                        ...action.config,
                                        delay: { ...action.config.delay, duration: Number.parseInt(e.target.value) },
                                      },
                                    })
                                  }
                                  placeholder="5"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>时间单位</Label>
                                <Select
                                  value={action.config.delay?.unit || "seconds"}
                                  onValueChange={(value) =>
                                    updateAction(action.id, {
                                      config: {
                                        ...action.config,
                                        delay: { ...action.config.delay, unit: value as any },
                                      },
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="seconds">秒</SelectItem>
                                    <SelectItem value="minutes">分钟</SelectItem>
                                    <SelectItem value="hours">小时</SelectItem>
                                    <SelectItem value="days">天</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={action.enabled}
                              onCheckedChange={(checked) => updateAction(action.id, { enabled: checked })}
                            />
                            <Label>启用动作</Label>
                          </div>
                        </CardContent>

                        {index < workflow.actions!.length - 1 && (
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-muted">
                              <ArrowDown className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">暂无动作</h3>
                  <p className="text-muted-foreground mb-4">添加动作来定义工作流要执行的操作</p>
                  <Button onClick={addAction}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加第一个动作
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variables" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>变量</CardTitle>
                  <CardDescription>定义工作流中使用的变量</CardDescription>
                </div>
                <Button onClick={addVariable}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加变量
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {workflow.variables && workflow.variables.length > 0 ? (
                <div className="space-y-4">
                  {workflow.variables.map((variable) => (
                    <Card key={variable.id}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>变量名</Label>
                            <Input
                              value={variable.name}
                              onChange={(e) => updateVariable(variable.id, { name: e.target.value })}
                              placeholder="variable_name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>类型</Label>
                            <Select
                              value={variable.type}
                              onValueChange={(value) => updateVariable(variable.id, { type: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="string">字符串</SelectItem>
                                <SelectItem value="number">数字</SelectItem>
                                <SelectItem value="boolean">布尔值</SelectItem>
                                <SelectItem value="object">对象</SelectItem>
                                <SelectItem value="array">数组</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>默认值</Label>
                            <Input
                              value={variable.value}
                              onChange={(e) => updateVariable(variable.id, { value: e.target.value })}
                              placeholder="默认值"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>操作</Label>
                            <Button variant="destructive" size="sm" onClick={() => removeVariable(variable.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <Label>描述</Label>
                          <Input
                            value={variable.description || ""}
                            onChange={(e) => updateVariable(variable.id, { description: e.target.value })}
                            placeholder="变量描述"
                          />
                        </div>
                        <div className="mt-4 flex items-center space-x-2">
                          <Switch
                            checked={variable.isSecret}
                            onCheckedChange={(checked) => updateVariable(variable.id, { isSecret: checked })}
                          />
                          <Label>敏感信息（加密存储）</Label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">暂无变量</h3>
                  <p className="text-muted-foreground mb-4">添加变量来存储工作流中需要使用的数据</p>
                  <Button onClick={addVariable}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加第一个变量
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations" className="space-y-4">
          <IntegrationManager />
        </TabsContent>

        <TabsContent value="ai-assistant" className="space-y-4">
          <AIWorkflowAssistant />
        </TabsContent>
      </Tabs>
    </div>
  )
}
