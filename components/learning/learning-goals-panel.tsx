"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Target, Plus, CalendarIcon, CheckCircle, Edit, Trash2, Flag } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { YYGetLearningGoals, YYAddLearningGoal } from "@/lib/learning-manager"
import type { LearningGoal, LearningCategory } from "@/types/learning"

export function LearningGoalsPanel() {
  const [goals, setGoals] = useState<LearningGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "技术" as LearningCategory,
    targetDate: new Date(),
    progress: 0,
  })

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const goalsData = await YYGetLearningGoals()
        setGoals(goalsData)
      } catch (error) {
        console.error("加载学习目标失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadGoals()
  }, [])

  const handleAddGoal = async () => {
    try {
      const goalData = {
        ...newGoal,
        isCompleted: false,
        resources: [],
        milestones: [],
      }

      const addedGoal = await YYAddLearningGoal(goalData)
      setGoals([...goals, addedGoal])
      setShowAddDialog(false)
      setNewGoal({
        title: "",
        description: "",
        category: "技术",
        targetDate: new Date(),
        progress: 0,
      })
    } catch (error) {
      console.error("添加学习目标失败:", error)
    }
  }

  const getStatusColor = (goal: LearningGoal) => {
    if (goal.isCompleted) return "bg-green-500"
    if (new Date() > goal.targetDate) return "bg-red-500"
    if (goal.progress > 50) return "bg-blue-500"
    return "bg-gray-500"
  }

  const getStatusText = (goal: LearningGoal) => {
    if (goal.isCompleted) return "已完成"
    if (new Date() > goal.targetDate) return "已逾期"
    if (goal.progress > 50) return "进行中"
    return "未开始"
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">学习目标</h2>
          <p className="text-muted-foreground">设定和跟踪您的学习目标</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加目标
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>添加学习目标</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">目标标题</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="输入目标标题"
                />
              </div>
              <div>
                <Label htmlFor="description">目标描述</Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="描述您的学习目标"
                />
              </div>
              <div>
                <Label htmlFor="category">分类</Label>
                <Select
                  value={newGoal.category}
                  onValueChange={(value) => setNewGoal({ ...newGoal, category: value as LearningCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="技术">技术</SelectItem>
                    <SelectItem value="语言">语言</SelectItem>
                    <SelectItem value="职业发展">职业发展</SelectItem>
                    <SelectItem value="兴趣爱好">兴趣爱好</SelectItem>
                    <SelectItem value="健康生活">健康生活</SelectItem>
                    <SelectItem value="创意设计">创意设计</SelectItem>
                    <SelectItem value="商业管理">商业管理</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>目标日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newGoal.targetDate, "yyyy年MM月dd日", { locale: zhCN })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newGoal.targetDate}
                      onSelect={(date) => date && setNewGoal({ ...newGoal, targetDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  取消
                </Button>
                <Button onClick={handleAddGoal} disabled={!newGoal.title}>
                  添加目标
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {goal.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{goal.description}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className={`${getStatusColor(goal)} text-white`}>{getStatusText(goal)}</Badge>
                <Badge variant="outline">{goal.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>进度</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>目标日期: {format(goal.targetDate, "yyyy年MM月dd日", { locale: zhCN })}</span>
                </div>

                {goal.milestones.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">里程碑</p>
                    <div className="space-y-1">
                      {goal.milestones.slice(0, 3).map((milestone) => (
                        <div key={milestone.id} className="flex items-center gap-2 text-sm">
                          <CheckCircle
                            className={`h-3 w-3 ${milestone.isCompleted ? "text-green-500" : "text-gray-400"}`}
                          />
                          <span className={milestone.isCompleted ? "line-through text-muted-foreground" : ""}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <Flag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">暂无学习目标</h3>
          <p className="text-muted-foreground">设定您的第一个学习目标，开始成长之旅！</p>
          <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            添加目标
          </Button>
        </div>
      )}
    </div>
  )
}
