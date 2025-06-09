/**
 * ==========================================
 * 学习成长中心主页
 * ==========================================
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { BookOpen, Plus, Target, Calendar, TrendingUp, Award, Clock, PlayCircle, FileText, Brain } from "lucide-react"

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const learningStats = [
    {
      title: "学习时长",
      value: "128h",
      description: "本月累计",
      icon: Clock,
      color: "text-blue-500",
    },
    {
      title: "完成课程",
      value: "24",
      description: "已完成",
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      title: "学习目标",
      value: "8/10",
      description: "进行中",
      icon: Target,
      color: "text-purple-500",
    },
    {
      title: "获得成就",
      value: "15",
      description: "徽章获得",
      icon: Award,
      color: "text-orange-500",
    },
  ]

  const currentCourses = [
    {
      id: "1",
      title: "React 高级开发",
      description: "深入学习 React 高级特性和最佳实践",
      progress: 75,
      totalLessons: 20,
      completedLessons: 15,
      category: "前端开发",
      difficulty: "高级",
      estimatedTime: "2小时",
      instructor: "张老师",
    },
    {
      id: "2",
      title: "TypeScript 完全指南",
      description: "从基础到高级的 TypeScript 完整教程",
      progress: 45,
      totalLessons: 16,
      completedLessons: 7,
      category: "编程语言",
      difficulty: "中级",
      estimatedTime: "1.5小时",
      instructor: "李老师",
    },
    {
      id: "3",
      title: "云原生架构设计",
      description: "学习现代云原生应用架构设计原则",
      progress: 30,
      totalLessons: 12,
      completedLessons: 4,
      category: "架构设计",
      difficulty: "高级",
      estimatedTime: "3小时",
      instructor: "王老师",
    },
  ]

  const learningGoals = [
    {
      id: "1",
      title: "掌握 React 18 新特性",
      description: "学习并实践 React 18 的并发特性",
      progress: 80,
      deadline: "2024-02-15",
      priority: "高",
    },
    {
      id: "2",
      title: "完成云架构认证",
      description: "获得 AWS 解决方案架构师认证",
      progress: 60,
      deadline: "2024-03-01",
      priority: "中",
    },
    {
      id: "3",
      title: "学习 AI/ML 基础",
      description: "掌握机器学习基础概念和实践",
      progress: 25,
      deadline: "2024-04-01",
      priority: "低",
    },
  ]

  const quickActions = [
    {
      title: "学习路径",
      description: "查看和管理学习路径",
      icon: Target,
      href: "/dashboard/learning/path",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "学习笔记",
      description: "记录和整理学习笔记",
      icon: FileText,
      href: "/dashboard/learning/notes",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "成就系统",
      description: "查看学习成就和徽章",
      icon: Award,
      href: "/dashboard/learning/achievements",
      color: "from-purple-500 to-violet-500",
    },
    {
      title: "学习报告",
      description: "生成学习进度报告",
      icon: TrendingUp,
      href: "/dashboard/learning/reports",
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "推荐系统",
      description: "获取个性化学习推荐",
      icon: Brain,
      href: "/dashboard/learning/recommendations",
      color: "from-red-500 to-pink-500",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "初级":
        return "bg-green-100 text-green-800"
      case "中级":
        return "bg-yellow-100 text-yellow-800"
      case "高级":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "高":
        return "bg-red-100 text-red-800"
      case "中":
        return "bg-yellow-100 text-yellow-800"
      case "低":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">学习成长中心</h1>
          <p className="text-gray-600 mt-2">规划您的学习路径，追踪学习进度</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            学习日历
          </Button>
          <Link href="/dashboard/learning/path">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              新建学习路径
            </Button>
          </Link>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {learningStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 快速操作 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader className="text-center">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-sm">{action.title}</CardTitle>
                    <CardDescription className="text-xs">{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 主要内容区域 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">学习概览</TabsTrigger>
          <TabsTrigger value="courses">当前课程</TabsTrigger>
          <TabsTrigger value="goals">学习目标</TabsTrigger>
          <TabsTrigger value="achievements">成就徽章</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 学习进度 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  本周学习进度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>学习时长目标</span>
                      <span>12/15 小时</span>
                    </div>
                    <Progress value={80} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>课程完成度</span>
                      <span>3/5 门课程</span>
                    </div>
                    <Progress value={60} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 学习日历 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  本周学习安排
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm">React 高级开发</span>
                    <span className="text-xs text-gray-500">今天 14:00</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm">TypeScript 指南</span>
                    <span className="text-xs text-gray-500">明天 10:00</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                    <span className="text-sm">云架构设计</span>
                    <span className="text-xs text-gray-500">周五 16:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-6">
            {currentCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                      <p className="text-gray-600 mb-3">{course.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>讲师: {course.instructor}</span>
                        <span>预计: {course.estimatedTime}</span>
                        <Badge className={getDifficultyColor(course.difficulty)}>{course.difficulty}</Badge>
                        <Badge variant="outline">{course.category}</Badge>
                      </div>
                    </div>
                    <Button size="sm">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      继续学习
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        进度: {course.completedLessons}/{course.totalLessons} 课时
                      </span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4">
            {learningGoals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{goal.title}</h3>
                      <p className="text-gray-600 mb-3">{goal.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>截止: {goal.deadline}</span>
                        <Badge className={getPriorityColor(goal.priority)}>优先级: {goal.priority}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>完成进度</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">学习成就</h3>
            <p className="text-gray-600 mb-4">您已获得 15 个学习徽章</p>
            <Link href="/dashboard/learning/achievements">
              <Button>查看所有成就</Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
