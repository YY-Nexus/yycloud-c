"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  Trophy,
  Medal,
  Star,
  Clock,
  BookOpen,
  Target,
  TrendingUp,
  Flame,
  Calendar,
  Users,
  Zap,
} from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: "learning" | "time" | "streak" | "social" | "milestone"
  type: "bronze" | "silver" | "gold" | "platinum"
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedAt?: Date
  rarity: "common" | "rare" | "epic" | "legendary"
  points: number
}

interface LearningStats {
  totalStudyTime: number // 分钟
  completedResources: number
  currentStreak: number
  longestStreak: number
  totalSessions: number
  averageSessionTime: number
  totalPoints: number
  level: number
}

export function LearningAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // 模拟成就数据
  useEffect(() => {
    const mockAchievements: Achievement[] = [
      {
        id: "1",
        title: "学习新手",
        description: "完成第一个学习会话",
        icon: "BookOpen",
        category: "learning",
        type: "bronze",
        progress: 1,
        maxProgress: 1,
        unlocked: true,
        unlockedAt: new Date("2024-01-15"),
        rarity: "common",
        points: 10,
      },
      {
        id: "2",
        title: "时间管理者",
        description: "累计学习时间达到10小时",
        icon: "Clock",
        category: "time",
        type: "silver",
        progress: 8,
        maxProgress: 10,
        unlocked: false,
        rarity: "common",
        points: 25,
      },
      {
        id: "3",
        title: "连续学习者",
        description: "连续学习7天",
        icon: "Flame",
        category: "streak",
        type: "gold",
        progress: 5,
        maxProgress: 7,
        unlocked: false,
        rarity: "rare",
        points: 50,
      },
      {
        id: "4",
        title: "知识收集者",
        description: "完成10个学习资源",
        icon: "Trophy",
        category: "learning",
        type: "gold",
        progress: 3,
        maxProgress: 10,
        unlocked: false,
        rarity: "rare",
        points: 75,
      },
      {
        id: "5",
        title: "学习大师",
        description: "累计学习时间达到100小时",
        icon: "Award",
        category: "time",
        type: "platinum",
        progress: 25,
        maxProgress: 100,
        unlocked: false,
        rarity: "epic",
        points: 200,
      },
      {
        id: "6",
        title: "目标达成者",
        description: "完成5个学习目标",
        icon: "Target",
        category: "milestone",
        type: "silver",
        progress: 2,
        maxProgress: 5,
        unlocked: false,
        rarity: "common",
        points: 40,
      },
      {
        id: "7",
        title: "学习传奇",
        description: "连续学习30天",
        icon: "Star",
        category: "streak",
        type: "platinum",
        progress: 5,
        maxProgress: 30,
        unlocked: false,
        rarity: "legendary",
        points: 500,
      },
    ]

    const mockStats: LearningStats = {
      totalStudyTime: 480, // 8小时
      completedResources: 3,
      currentStreak: 5,
      longestStreak: 12,
      totalSessions: 24,
      averageSessionTime: 45,
      totalPoints: 185,
      level: 3,
    }

    setAchievements(mockAchievements)
    setStats(mockStats)
  }, [])

  const getIconComponent = (iconName: string) => {
    const icons = {
      Award,
      Trophy,
      Medal,
      Star,
      Clock,
      BookOpen,
      Target,
      TrendingUp,
      Flame,
      Calendar,
      Users,
      Zap,
    }
    return icons[iconName as keyof typeof icons] || Award
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bronze":
        return "from-amber-600 to-amber-800"
      case "silver":
        return "from-gray-400 to-gray-600"
      case "gold":
        return "from-yellow-400 to-yellow-600"
      case "platinum":
        return "from-purple-400 to-purple-600"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-600"
      case "rare":
        return "text-blue-600"
      case "epic":
        return "text-purple-600"
      case "legendary":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "普通"
      case "rare":
        return "稀有"
      case "epic":
        return "史诗"
      case "legendary":
        return "传奇"
      default:
        return "普通"
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case "learning":
        return "学习"
      case "time":
        return "时间"
      case "streak":
        return "连续"
      case "social":
        return "社交"
      case "milestone":
        return "里程碑"
      default:
        return "其他"
    }
  }

  const filteredAchievements = achievements.filter((achievement) => {
    if (selectedCategory === "all") return true
    if (selectedCategory === "unlocked") return achievement.unlocked
    if (selectedCategory === "locked") return !achievement.unlocked
    return achievement.category === selectedCategory
  })

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          学习成就
        </h2>
        <p className="text-muted-foreground">记录您的学习里程碑和成就</p>
      </div>

      {/* 统计概览 */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.level}</div>
              <div className="text-sm text-muted-foreground">当前等级</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">总积分</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{unlockedAchievements.length}</div>
              <div className="text-sm text-muted-foreground">已解锁成就</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">连续学习天数</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 成就分类 */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="unlocked">已解锁</TabsTrigger>
          <TabsTrigger value="locked">未解锁</TabsTrigger>
          <TabsTrigger value="learning">学习</TabsTrigger>
          <TabsTrigger value="time">时间</TabsTrigger>
          <TabsTrigger value="streak">连续</TabsTrigger>
          <TabsTrigger value="milestone">里程碑</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements.map((achievement) => {
              const Icon = getIconComponent(achievement.icon)
              const progressPercentage = (achievement.progress / achievement.maxProgress) * 100

              return (
                <Card
                  key={achievement.id}
                  className={`relative overflow-hidden ${
                    achievement.unlocked ? "border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20" : ""
                  }`}
                >
                  {achievement.unlocked && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-white">已解锁</Badge>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-full bg-gradient-to-br ${getTypeColor(achievement.type)} ${
                          achievement.unlocked ? "" : "grayscale opacity-50"
                        }`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                            {getRarityText(achievement.rarity)}
                          </Badge>
                          <Badge variant="outline">{getCategoryText(achievement.category)}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="mb-4">{achievement.description}</CardDescription>

                    <div className="space-y-3">
                      {/* 进度条 */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>进度</span>
                          <span>
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      {/* 积分和解锁时间 */}
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{achievement.points} 积分</span>
                        </div>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <span className="text-muted-foreground">
                            {format(achievement.unlockedAt, "MM月dd日", { locale: zhCN })}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">暂无成就</h3>
          <p className="text-muted-foreground">继续学习来解锁更多成就吧！</p>
        </div>
      )}

      {/* 最近解锁的成就 */}
      {unlockedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5" />
              最近解锁
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unlockedAchievements
                .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
                .slice(0, 3)
                .map((achievement) => {
                  const Icon = getIconComponent(achievement.icon)
                  return (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`p-2 rounded-full bg-gradient-to-br ${getTypeColor(achievement.type)}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-sm text-muted-foreground">{achievement.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">+{achievement.points} 积分</div>
                        {achievement.unlockedAt && (
                          <div className="text-xs text-muted-foreground">
                            {format(achievement.unlockedAt, "MM月dd日", { locale: zhCN })}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
