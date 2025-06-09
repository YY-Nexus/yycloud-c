/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 学习伙伴组件
 * ==========================================
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Users, MessageCircle, Target, Calendar, Star } from "lucide-react"
import { YYGetStudyBuddies, YYGetLeaderboard } from "@/lib/social-learning-manager"
import type { StudyBuddy, LeaderboardEntry } from "@/types/social-learning"

export function StudyBuddies() {
  const [buddies, setBuddies] = useState<StudyBuddy[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [buddiesData, leaderboardData] = await Promise.all([YYGetStudyBuddies(), YYGetLeaderboard()])
        setBuddies(buddiesData)
        setLeaderboard(leaderboardData)
      } catch (error) {
        console.error("加载学习伙伴数据失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // 获取匹配度颜色
  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-gray-600"
  }

  // 获取排名颜色
  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-600"
    if (rank === 2) return "text-gray-500"
    if (rank === 3) return "text-orange-600"
    return "text-gray-600"
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          学习伙伴
        </h2>
        <p className="text-muted-foreground">找到志同道合的学习伙伴，互相监督，共同进步</p>
      </div>

      <Tabs defaultValue="buddies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="buddies">我的伙伴</TabsTrigger>
          <TabsTrigger value="leaderboard">排行榜</TabsTrigger>
          <TabsTrigger value="discover">发现伙伴</TabsTrigger>
        </TabsList>

        {/* 我的学习伙伴 */}
        <TabsContent value="buddies" className="space-y-4">
          {buddies.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {buddies.map((buddy) => (
                <Card key={buddy.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{buddy.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{buddy.username}</CardTitle>
                          <CardDescription>
                            匹配度:{" "}
                            <span className={`font-medium ${getMatchColor(buddy.matchScore)}`}>
                              {buddy.matchScore}%
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={buddy.status === "accepted" ? "default" : "secondary"}
                        className={buddy.status === "accepted" ? "bg-green-100 text-green-800" : ""}
                      >
                        {buddy.status === "accepted" ? "已连接" : "待确认"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">共同兴趣</h4>
                        <div className="flex flex-wrap gap-1">
                          {buddy.commonInterests.slice(0, 3).map((interest) => (
                            <Badge key={interest} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">学习目标</h4>
                        <div className="space-y-1">
                          {buddy.studyGoals.slice(0, 2).map((goal, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Target className="h-3 w-3" />
                              <span className="line-clamp-1">{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          聊天
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Calendar className="mr-2 h-4 w-4" />
                          约学习
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">暂无学习伙伴</h3>
              <p className="text-muted-foreground">去发现页面寻找志同道合的学习伙伴吧！</p>
            </div>
          )}
        </TabsContent>

        {/* 学习排行榜 */}
        <TabsContent value="leaderboard" className="space-y-4">
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <Card key={entry.userId} className={index < 3 ? "border-2 border-primary/20" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <span className={`font-bold ${getRankColor(entry.rank)}`}>#{entry.rank}</span>
                      </div>
                      <Avatar>
                        <AvatarFallback>{entry.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{entry.username}</span>
                          {entry.rank <= 3 && <Star className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>连续 {entry.streak} 天</span>
                          <span>{entry.completedResources} 个资源</span>
                          <span>帮助 {entry.helpedOthers} 人</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{entry.score}</div>
                      <div className="text-sm text-muted-foreground">积分</div>
                    </div>
                  </div>
                  {entry.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {entry.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 发现学习伙伴 */}
        <TabsContent value="discover" className="space-y-4">
          <div className="text-center py-12">
            <UserPlus className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">智能匹配功能开发中</h3>
            <p className="text-muted-foreground">我们正在开发基于学习兴趣和目标的智能伙伴匹配系统</p>
            <Button className="mt-4" disabled>
              <UserPlus className="mr-2 h-4 w-4" />
              开始匹配
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
