"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Route,
  Clock,
  Star,
  BookOpen,
  Target,
  Play,
  CheckCircle,
  Lock,
  Award,
  Share,
  Heart,
  MessageSquare,
  TrendingUp,
} from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import type { LearningPath, LearningPathStep } from "@/types/learning-path"

interface PathOverviewProps {
  path: LearningPath
  onEnroll: () => void
  onContinue: () => void
  onStartStep: (stepId: string) => void
}

export function PathOverview({ path, onEnroll, onContinue, onStartStep }: PathOverviewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-red-500"
      case "expert":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "初级"
      case "intermediate":
        return "中级"
      case "advanced":
        return "高级"
      case "expert":
        return "专家"
      default:
        return "未知"
    }
  }

  const getStepStatusIcon = (step: LearningPathStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <Play className="h-4 w-4 text-blue-500" />
      case "available":
        return <BookOpen className="h-4 w-4 text-gray-500" />
      case "locked":
        return <Lock className="h-4 w-4 text-gray-400" />
      default:
        return <BookOpen className="h-4 w-4 text-gray-500" />
    }
  }

  const getStepStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "已完成"
      case "in_progress":
        return "进行中"
      case "available":
        return "可学习"
      case "locked":
        return "未解锁"
      default:
        return "未知"
    }
  }

  const completedSteps = path.steps.filter((s) => s.status === "completed").length
  const totalSteps = path.steps.length

  return (
    <div className="space-y-6">
      {/* 路径头部信息 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Route className="h-6 w-6" />
                <Badge className={`${getDifficultyColor(path.difficulty)} text-white`}>
                  {getDifficultyText(path.difficulty)}
                </Badge>
                <Badge variant="outline">{path.category}</Badge>
                {path.isFeatured && (
                  <Badge variant="outline" className="text-yellow-600">
                    <Star className="mr-1 h-3 w-3" />
                    精选
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl mb-2">{path.title}</CardTitle>
              <CardDescription className="text-base">{path.description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 作者信息 */}
          <div className="flex items-center gap-3 pt-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={path.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{path.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{path.author.name}</p>
              <p className="text-sm text-muted-foreground">
                创建于 {format(path.createdAt, "yyyy年MM月dd日", { locale: zhCN })}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* 统计信息 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{path.estimatedHours}</div>
              <div className="text-sm text-muted-foreground">预计小时</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalSteps}</div>
              <div className="text-sm text-muted-foreground">学习步骤</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{path.stats.enrolledCount}</div>
              <div className="text-sm text-muted-foreground">学习人数</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-600">{path.stats.rating}</span>
              </div>
              <div className="text-sm text-muted-foreground">{path.stats.reviewCount} 评价</div>
            </div>
          </div>

          {/* 进度信息（已注册用户） */}
          {path.isEnrolled && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">学习进度</span>
                <span className="text-sm text-muted-foreground">
                  {completedSteps}/{totalSteps} 步骤完成
                </span>
              </div>
              <Progress value={path.overallProgress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{path.overallProgress}% 完成</span>
                <span>已学习 {Math.floor(path.timeSpent / 60)} 小时</span>
              </div>
            </div>
          )}

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {path.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            {path.isEnrolled ? (
              <Button onClick={onContinue} className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                继续学习
              </Button>
            ) : (
              <Button onClick={onEnroll} className="flex-1">
                <BookOpen className="mr-2 h-4 w-4" />
                开始学习
              </Button>
            )}
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              讨论
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 详细信息标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">课程大纲</TabsTrigger>
          <TabsTrigger value="skills">技能收获</TabsTrigger>
          <TabsTrigger value="reviews">学员评价</TabsTrigger>
          <TabsTrigger value="stats">学习统计</TabsTrigger>
        </TabsList>

        {/* 课程大纲 */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>学习路径大纲</CardTitle>
              <CardDescription>按顺序完成以下步骤来掌握相关技能</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {path.steps
                  .sort((a, b) => a.order - b.order)
                  .map((step, index) => (
                    <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{step.order}</span>
                        </div>
                        {getStepStatusIcon(step)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{step.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {step.type === "course"
                              ? "课程"
                              : step.type === "project"
                                ? "项目"
                                : step.type === "quiz"
                                  ? "测验"
                                  : "其他"}
                          </Badge>
                          <Badge className={`${getDifficultyColor(step.difficulty)} text-white text-xs`}>
                            {getDifficultyText(step.difficulty)}
                          </Badge>
                          {step.isOptional && (
                            <Badge variant="outline" className="text-xs">
                              可选
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {step.estimatedHours}小时
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {step.skills.length}个技能点
                          </span>
                          {step.prerequisites.length > 0 && <span>前置要求: {step.prerequisites.length}个</span>}
                        </div>
                        {step.status === "in_progress" && (
                          <div className="mt-2">
                            <Progress value={step.progress} className="h-1" />
                            <span className="text-xs text-muted-foreground">{step.progress}% 完成</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getStepStatusText(step.status)}
                        </Badge>
                        {step.status === "available" && (
                          <Button size="sm" onClick={() => onStartStep(step.id)}>
                            开始
                          </Button>
                        )}
                        {step.status === "in_progress" && (
                          <Button size="sm" variant="outline" onClick={() => onStartStep(step.id)}>
                            继续
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 技能收获 */}
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>技能收获</CardTitle>
              <CardDescription>完成此学习路径后您将掌握的技能</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {path.steps.map((step) => (
                  <div key={step.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <h4 className="font-medium">{step.title}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {step.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 学员评价 */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>学员评价</CardTitle>
              <CardDescription>来自真实学员的反馈和评价</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">暂无评价</h3>
                <p className="text-muted-foreground">成为第一个评价此学习路径的人！</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 学习统计 */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>学习统计</CardTitle>
              <CardDescription>此学习路径的详细统计信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <h4 className="font-medium">学习数据</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>注册学员</span>
                      <span>{path.stats.enrolledCount}人</span>
                    </div>
                    <div className="flex justify-between">
                      <span>完成学员</span>
                      <span>{path.stats.completedCount}人</span>
                    </div>
                    <div className="flex justify-between">
                      <span>完成率</span>
                      <span>
                        {path.stats.enrolledCount > 0
                          ? Math.round((path.stats.completedCount / path.stats.enrolledCount) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <h4 className="font-medium">评价统计</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>平均评分</span>
                      <span>{path.stats.rating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>评价数量</span>
                      <span>{path.stats.reviewCount}条</span>
                    </div>
                    <div className="flex justify-between">
                      <span>推荐度</span>
                      <span>95%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
