"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Play, Pause, Settings } from "lucide-react"

interface ScheduledTask {
  id: string
  name: string
  schedule: string
  nextRun: string
  status: "active" | "paused"
  lastRun?: string
  runCount: number
}

export function AutomationScheduler() {
  const [tasks, setTasks] = useState<ScheduledTask[]>([
    {
      id: "1",
      name: "网络监控报告",
      schedule: "每小时",
      nextRun: "2024-01-20 15:00:00",
      status: "active",
      lastRun: "2024-01-20 14:00:00",
      runCount: 24,
    },
    {
      id: "2",
      name: "设备状态检查",
      schedule: "每6小时",
      nextRun: "2024-01-20 18:00:00",
      status: "active",
      lastRun: "2024-01-20 12:00:00",
      runCount: 8,
    },
    {
      id: "3",
      name: "数据备份",
      schedule: "每日 23:00",
      nextRun: "2024-01-20 23:00:00",
      status: "paused",
      lastRun: "2024-01-19 23:00:00",
      runCount: 30,
    },
  ])

  const [newTaskName, setNewTaskName] = useState("")
  const [scheduleType, setScheduleType] = useState("")
  const [scheduleValue, setScheduleValue] = useState("")

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "active" ? "paused" : "active" } : task,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-yellow-500"
  }

  const getStatusText = (status: string) => {
    return status === "active" ? "运行中" : "已暂停"
  }

  return (
    <div className="space-y-6">
      {/* 创建新任务 */}
      <Card>
        <CardHeader>
          <CardTitle>创建定时任务</CardTitle>
          <CardDescription>设置自动化任务的执行计划</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-name">任务名称</Label>
              <Input
                id="task-name"
                placeholder="输入任务名称"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-type">调度类型</Label>
              <Select value={scheduleType} onValueChange={setScheduleType}>
                <SelectTrigger>
                  <SelectValue placeholder="选择调度类型" />
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
              <Label htmlFor="schedule-value">调度值</Label>
              <Input
                id="schedule-value"
                placeholder="如：30分钟、14:30、0 0 * * *"
                value={scheduleValue}
                onChange={(e) => setScheduleValue(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>创建任务</Button>
          </div>
        </CardContent>
      </Card>

      {/* 任务列表 */}
      <Card>
        <CardHeader>
          <CardTitle>定时任务列表</CardTitle>
          <CardDescription>管理所有的定时任务</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                    <div>
                      <h3 className="font-medium">{task.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.schedule}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          下次: {task.nextRun}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getStatusText(task.status)}</Badge>
                    <span className="text-sm text-muted-foreground">已运行 {task.runCount} 次</span>
                    <Button variant="outline" size="sm" onClick={() => toggleTaskStatus(task.id)}>
                      {task.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {task.lastRun && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-muted-foreground">上次运行: {task.lastRun}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 调度统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总任务数</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">运行中任务</p>
                <p className="text-2xl font-bold text-green-600">{tasks.filter((t) => t.status === "active").length}</p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总执行次数</p>
                <p className="text-2xl font-bold text-blue-600">
                  {tasks.reduce((acc, task) => acc + task.runCount, 0)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
