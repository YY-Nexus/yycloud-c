"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Plus, Clock, Book, Target, CheckCircle, AlertCircle } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { zhCN } from "date-fns/locale"

interface LearningEvent {
  id: string
  title: string
  description?: string
  date: Date
  type: "study" | "goal" | "reminder" | "deadline"
  duration?: number
  completed?: boolean
}

export function LearningCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [events, setEvents] = useState<LearningEvent[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "study" as const,
    duration: 60,
  })

  // 模拟事件数据
  useEffect(() => {
    const mockEvents: LearningEvent[] = [
      {
        id: "1",
        title: "React 高级模式学习",
        date: new Date(),
        type: "study",
        duration: 90,
        completed: true,
      },
      {
        id: "2",
        title: "TypeScript 项目截止",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        type: "deadline",
        completed: false,
      },
      {
        id: "3",
        title: "每周学习目标检查",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        type: "goal",
        completed: false,
      },
    ]
    setEvents(mockEvents)
  }, [])

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date))
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "study":
        return Book
      case "goal":
        return Target
      case "reminder":
        return AlertCircle
      case "deadline":
        return Clock
      default:
        return Book
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "study":
        return "bg-blue-500"
      case "goal":
        return "bg-green-500"
      case "reminder":
        return "bg-yellow-500"
      case "deadline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEventTypeText = (type: string) => {
    switch (type) {
      case "study":
        return "学习"
      case "goal":
        return "目标"
      case "reminder":
        return "提醒"
      case "deadline":
        return "截止"
      default:
        return "其他"
    }
  }

  const handleAddEvent = () => {
    const event: LearningEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate,
      type: newEvent.type,
      duration: newEvent.duration,
      completed: false,
    }

    setEvents([...events, event])
    setShowAddDialog(false)
    setNewEvent({
      title: "",
      description: "",
      type: "study",
      duration: 60,
    })
  }

  const selectedDateEvents = getEventsForDate(selectedDate)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">学习日历</h2>
          <p className="text-muted-foreground">规划和跟踪您的学习计划</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加事件
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>添加学习事件</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">事件标题</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="输入事件标题"
                />
              </div>
              <div>
                <Label htmlFor="description">事件描述</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="描述学习事件"
                />
              </div>
              <div>
                <Label htmlFor="type">事件类型</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent({ ...newEvent, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="study">学习</SelectItem>
                    <SelectItem value="goal">目标</SelectItem>
                    <SelectItem value="reminder">提醒</SelectItem>
                    <SelectItem value="deadline">截止</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newEvent.type === "study" && (
                <div>
                  <Label htmlFor="duration">学习时长（分钟）</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: Number.parseInt(e.target.value) || 60 })}
                    placeholder="60"
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  取消
                </Button>
                <Button onClick={handleAddEvent} disabled={!newEvent.title}>
                  添加事件
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(selectedDate, "yyyy年MM月", { locale: zhCN })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                hasEvents: (date) => getEventsForDate(date).length > 0,
              }}
              modifiersStyles={{
                hasEvents: {
                  backgroundColor: "rgb(59 130 246 / 0.1)",
                  color: "rgb(59 130 246)",
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{format(selectedDate, "MM月dd日", { locale: zhCN })} 的事件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => {
                  const Icon = getEventTypeIcon(event.type)
                  return (
                    <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className={`p-2 rounded-md ${getEventTypeColor(event.type)}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{event.title}</h4>
                          {event.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                        {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getEventTypeText(event.type)}
                          </Badge>
                          {event.duration && (
                            <Badge variant="outline" className="text-xs">
                              {event.duration}分钟
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-6">
                  <CalendarIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">这一天没有安排学习事件</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowAddDialog(true)}>
                    添加事件
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
