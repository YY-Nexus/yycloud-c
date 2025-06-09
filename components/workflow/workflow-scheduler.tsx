"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Plus, Edit, Trash2, Play, Pause, RefreshCw } from "lucide-react"

interface ScheduledTask {
  id: string
  workflowId: string
  workflowName: string
  name: string
  description: string
  schedule: {
    type: "interval" | "cron" | "daily" | "weekly" | "monthly"
    value: string
    timezone: string
  }
  enabled: boolean
  lastRun?: Date
  nextRun?: Date
  runCount: number
  successCount: number
  failureCount: number
  createdAt: Date
}

export function WorkflowScheduler() {
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([
    {
      id: "task1",
      workflowId: "workflow1",
      workflowName: "每日备份提醒",
      name: "每日备份任务",
      description: "每天上午9点提醒进行数据备份",
      schedule: {
        type: "daily",
        value: "09:00",
        timezone: "Asia/Shanghai",
      },
      enabled: true,
      lastRun: new Date(Date.now() - 86400000),
      nextRun: new Date(Date.now() + 3600000),
      runCount: 30,
      successCount: 28,
      failureCount: 2,
      createdAt: new Date(Date.now() - 30 * 86400000),
    },
    {
      id: "task2",
      workflowId: "workflow2",
      workflowName: "网站监控",
      name: "网站健康检查",
      description: "每5分钟检查网站状态",
      schedule: {
        type: "interval",
        value: "300",
        timezone: "Asia/Shanghai",
      },
      enabled: true,
      lastRun: new Date(Date.now() - 300000),
      nextRun: new Date(Date.now() + 300000),
      runCount: 2880,
      successCount: 2875,
      failureCount: 5,
      createdAt: new Date(Date.now() - 10 * 86400000),
    },
  ])

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<ScheduledTask | null>(null)
  const [newTask, setNewTask] = useState({
    workflowId: "",
    name: "",
    description: "",
    scheduleType: "daily" as const,
    scheduleValue: "",
    timezone: "Asia/Shanghai",
    enabled: true,
  })

  const handleCreateTask = () => {
    const task: ScheduledTask = {
      id: `task_${Date.now()}`,
      workflowId: newTask.workflowId,
      workflowName: "选定的工作流", // 实际应用中应该从工作流列表获取
      name: newTask.name,
      description: newTask.description,
      schedule: {
        type: newTask.scheduleType,
        value: newTask.scheduleValue,
        timezone: newTask.timezone,
      },
      enabled: newTask.enabled,
      runCount: 0,
      successCount: 0,
      failureCount: 0,
      createdAt: new Date(),
    }

    setScheduledTasks([...scheduledTasks, task])
    setShowCreateDialog(false)
    setNewTask({
      workflowId: "",
      name: "",
      description: "",
      scheduleType: "daily",
      scheduleValue: "",
      timezone: "Asia/Shanghai",
      enabled: true,
    })
  }

  const handleToggleTask = (taskId: string) => {
    setScheduledTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, enabled: !task.enabled } : task)))
  }

  const handleDeleteTask = (taskId: string) => {
    setScheduledTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const getScheduleDescription = (schedule: ScheduledTask["schedule"]) => {
    switch (schedule.type) {
      case "interval":
        const seconds = Number.parseInt(schedule.value)
        if (seconds < 60) return `每${seconds}秒`
        if (seconds < 3600) return `每${Math.floor(seconds / 60)}分钟`
        return `每${Math.floor(seconds / 3600)}小时`
      case "daily":
        return `每天 ${schedule.value}`
      case "weekly":
        return `每周 ${schedule.value}`
      case "monthly":
        return `每月 ${schedule.value}`
      case "cron":
        return `Cron: ${schedule.value}`
      default:
        return "未知"
    }
  }

  const getSuccessRate = (task: ScheduledTask) => {
    if (task.runCount === 0) return 0
    return ((task.successCount / task.runCount) * 100).toFixed(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">工作流调度器</h2>
          <p className="text-muted-foreground">管理定时执行的工作流任务</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                创建定时任务
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>创建定时任务</DialogTitle>
                <DialogDescription>为工作流创建定时执行任务</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="workflow" className="text-right">
                    工作流
                  </Label>
                  <Select
                    value={newTask.workflowId}
                    onValueChange={(value) => setNewTask({ ...newTask, workflowId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择工作流" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workflow1">每日备份提醒</SelectItem>
                      <SelectItem value="workflow2">网站监控</SelectItem>
                      <SelectItem value="workflow3">文件整理器</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-name" className="text-right">
                    任务名称
                  </Label>
                  <Input
                    id="task-name"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    className="col-span-3"
                    placeholder="输入任务名称"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-description" className="text-right">
                    任务描述
                  </Label>
                  <Input
                    id="task-description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="col-span-3"
                    placeholder="输入任务描述"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="schedule-type" className="text-right">
                    调度类型
                  </Label>
                  <Select
                    value={newTask.scheduleType}
                    onValueChange={(value) => setNewTask({ ...newTask, scheduleType: value as any })}
                  >
                    <SelectTrigger className="col-span-3">
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

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="schedule-value" className="text-right">
                    调度值
                  </Label>
                  <Input
                    id="schedule-value"
                    value={newTask.scheduleValue}
                    onChange={(e) => setNewTask({ ...newTask, scheduleValue: e.target.value })}
                    className="col-span-3"
                    placeholder={
                      newTask.scheduleType === "interval"
                        ? "间隔秒数，如：300"
                        : newTask.scheduleType === "cron"
                          ? "Cron表达式，如：0 9 * * *"
                          : "时间，如：09:00"
                    }
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="timezone" className="text-right">
                    时区
                  </Label>
                  <Select
                    value={newTask.timezone}
                    onValueChange={(value) => setNewTask({ ...newTask, timezone: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Shanghai">Asia/Shanghai</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="enabled" className="text-right">
                    启用任务
                  </Label>
                  <div className="col-span-3">
                    <Switch
                      id="enabled"
                      checked={newTask.enabled}
                      onCheckedChange={(checked) => setNewTask({ ...newTask, enabled: checked })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateTask} disabled={!newTask.workflowId || !newTask.name}>
                  创建任务
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">活跃任务</TabsTrigger>
          <TabsTrigger value="all">所有任务</TabsTrigger>
          <TabsTrigger value="history">执行历史</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledTasks
              .filter((task) => task.enabled)
              .map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{task.name}</CardTitle>
                      <Badge variant="default">活跃</Badge>
                    </div>
                    <CardDescription>{task.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">工作流</span>
                        <span>{task.workflowName}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">调度</span>
                        <span>{getScheduleDescription(task.schedule)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">下次执行</span>
                        <span>{task.nextRun ? task.nextRun.toLocaleString() : "未知"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">成功率</span>
                        <span>{getSuccessRate(task)}%</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        立即执行
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleToggleTask(task.id)}>
                        <Pause className="h-4 w-4 mr-1" />
                        暂停
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>所有定时任务</CardTitle>
              <CardDescription>管理所有的定时任务</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任务名称</TableHead>
                    <TableHead>工作流</TableHead>
                    <TableHead>调度</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>执行次数</TableHead>
                    <TableHead>成功率</TableHead>
                    <TableHead>下次执行</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>{task.workflowName}</TableCell>
                      <TableCell>{getScheduleDescription(task.schedule)}</TableCell>
                      <TableCell>
                        <Badge variant={task.enabled ? "default" : "secondary"}>{task.enabled ? "启用" : "禁用"}</Badge>
                      </TableCell>
                      <TableCell>{task.runCount}</TableCell>
                      <TableCell>{getSuccessRate(task)}%</TableCell>
                      <TableCell>{task.nextRun ? task.nextRun.toLocaleString() : "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleToggleTask(task.id)}>
                            {task.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteTask(task.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>执行历史</CardTitle>
              <CardDescription>定时任务的执行历史记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">执行历史</h3>
                <p className="text-muted-foreground">定时任务的详细执行历史将显示在这里</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
