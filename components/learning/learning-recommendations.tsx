"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Lightbulb,
  TrendingUp,
  Users,
  Star,
  Clock,
  BookOpen,
  Target,
  Zap,
  Heart,
  ExternalLink,
  Plus,
} from "lucide-react"
import type { LearningCategory } from "@/types/learning"

interface Recommendation {
  id: string
  type: "resource" | "goal" | "habit" | "skill"
  title: string
  description: string
  reason: string
  category: LearningCategory
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number // 分钟
  popularity: number // 1-5
  rating: number // 1-5
  tags: string[]
  url?: string
  thumbnail?: string
}

export function LearningRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [selectedType, setSelectedType] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  // 模拟推荐数据
  useEffect(() => {
    const mockRecommendations: Recommendation[] = [
      {
        id: "1",
        type: "resource",
        title: "React 18 新特性详解",
        description: "深入了解React 18的并发特性、Suspense改进和新的Hooks",
        reason: "基于您对React的学习兴趣推荐",
        category: "技术",
        difficulty: "intermediate",
        estimatedTime: 120,
        popularity: 5,
        rating: 4.8,
        tags: ["React", "前端", "JavaScript"],
        url: "https://example.com/react18",
      },
      {
        id: "2",
        type: "goal",
        title: "完成一个全栈项目",
        description: "使用React + Node.js构建一个完整的Web应用",
        reason: "根据您的学习进度，建议进行实践项目",
        category: "技术",
        difficulty: "advanced",
        estimatedTime: 2400, // 40小时
        popularity: 4,
        rating: 4.9,
        tags: ["项目", "全栈", "实践"],
      },
      {
        id: "3",
        type: "habit",
        title: "每日代码练习",
        description: "每天花30分钟练习算法和数据结构",
        reason: "培养编程思维，提升解决问题的能力",
        category: "技术",
        difficulty: "beginner",
        estimatedTime: 30,
        popularity: 5,
        rating: 4.7,
        tags: ["算法", "练习", "习惯"],
      },
      {
        id: "4",
        type: "skill",
        title: "TypeScript 高级类型",
        description: "掌握TypeScript的高级类型系统和泛型编程",
        reason: "补充您的TypeScript知识体系",
        category: "技术",
        difficulty: "advanced",
        estimatedTime: 180,
        popularity: 4,
        rating: 4.6,
        tags: ["TypeScript", "类型系统", "高级"],
      },
      {
        id: "5",
        type: "resource",
        title: "设计模式在前端中的应用",
        description: "学习常用设计模式在JavaScript和React中的实际应用",
        reason: "提升代码架构和设计能力",
        category: "技术",
        difficulty: "intermediate",
        estimatedTime: 240,
        popularity: 4,
        rating: 4.5,
        tags: ["设计模式", "架构", "最佳实践"],
      },
      {
        id: "6",
        type: "resource",
        title: "英语技术写作",
        description: "提升技术文档和博客的英语写作能力",
        reason: "基于您的职业发展需求推荐",
        category: "语言",
        difficulty: "intermediate",
        estimatedTime: 90,
        popularity: 3,
        rating: 4.3,
        tags: ["英语", "写作", "技术文档"],
      },
    ]

    setTimeout(() => {
      setRecommendations(mockRecommendations)
      setLoading(false)
    }, 1000)
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "resource":
        return BookOpen
      case "goal":
        return Target
      case "habit":
        return Zap
      case "skill":
        return Star
      default:
        return Lightbulb
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "resource":
        return "学习资源"
      case "goal":
        return "学习目标"
      case "habit":
        return "学习习惯"
      case "skill":
        return "技能提升"
      default:
        return "推荐"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-red-500"
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
      default:
        return "未知"
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}分钟`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
  }

  const filteredRecommendations = recommendations.filter((rec) => {
    if (selectedType === "all") return true
    return rec.type === selectedType
  })

  const handleAddToLearning = (recommendation: Recommendation) => {
    // 添加到学习计划
    console.log("添加到学习计划:", recommendation)
  }

  const handleMarkInterested = (recommendation: Recommendation) => {
    // 标记感兴趣
    console.log("标记感兴趣:", recommendation)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">智能推荐</h2>
          <p className="text-muted-foreground">基于您的学习数据生成个性化推荐</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="h-6 w-6" />
          智能推荐
        </h2>
        <p className="text-muted-foreground">基于您的学习数据生成个性化推荐</p>
      </div>

      {/* 推荐类型筛选 */}
      <Tabs value={selectedType} onValueChange={setSelectedType}>
        <TabsList>
          <TabsTrigger value="all">全部推荐</TabsTrigger>
          <TabsTrigger value="resource">学习资源</TabsTrigger>
          <TabsTrigger value="goal">学习目标</TabsTrigger>
          <TabsTrigger value="habit">学习习惯</TabsTrigger>
          <TabsTrigger value="skill">技能提升</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecommendations.map((recommendation) => {
              const TypeIcon = getTypeIcon(recommendation.type)
              return (
                <Card key={recommendation.id} className="h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <Badge variant="outline">{getTypeText(recommendation.type)}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{recommendation.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{recommendation.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{recommendation.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                      {/* 推荐理由 */}
                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <Lightbulb className="inline h-3 w-3 mr-1" />
                          {recommendation.reason}
                        </p>
                      </div>

                      {/* 标签和属性 */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          <Badge className={`${getDifficultyColor(recommendation.difficulty)} text-white text-xs`}>
                            {getDifficultyText(recommendation.difficulty)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {recommendation.category}
                          </Badge>
                          {recommendation.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(recommendation.estimatedTime)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>热度 {recommendation.popularity}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1" onClick={() => handleAddToLearning(recommendation)}>
                        <Plus className="mr-1 h-3 w-3" />
                        添加
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleMarkInterested(recommendation)}>
                        <Heart className="h-3 w-3" />
                      </Button>
                      {recommendation.url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={recommendation.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">暂无推荐</h3>
          <p className="text-muted-foreground">继续学习来获得更多个性化推荐！</p>
        </div>
      )}

      {/* 推荐算法说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            推荐算法说明
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">推荐依据</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 您的学习历史和偏好</li>
                <li>• 当前学习进度和目标</li>
                <li>• 相似用户的学习路径</li>
                <li>• 热门和高评分内容</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">个性化因素</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 学习时间和频率</li>
                <li>• 难度偏好和能力水平</li>
                <li>• 兴趣领域和职业方向</li>
                <li>• 学习效果和反馈</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
