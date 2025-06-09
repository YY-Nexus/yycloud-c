/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 学习动态组件
 * ==========================================
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Share2, BookOpen, Trophy, Users, Target, Send, MoreHorizontal } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { YYGetLearningActivities, YYLikeActivity, YYAddComment } from "@/lib/social-learning-manager"
import type { LearningActivity } from "@/types/social-learning"

export function LearningFeed() {
  const [activities, setActivities] = useState<LearningActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [newComments, setNewComments] = useState<Record<string, string>>({})

  // 加载学习动态
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true)
        const activitiesData = await YYGetLearningActivities(20)
        setActivities(activitiesData)
      } catch (error) {
        console.error("加载学习动态失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [])

  // 点赞
  const handleLike = async (activityId: string) => {
    try {
      await YYLikeActivity(activityId)
      setActivities((prev) =>
        prev.map((activity) => (activity.id === activityId ? { ...activity, likes: activity.likes + 1 } : activity)),
      )
    } catch (error) {
      console.error("点赞失败:", error)
    }
  }

  // 切换评论显示
  const toggleComments = (activityId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(activityId)) {
        newSet.delete(activityId)
      } else {
        newSet.add(activityId)
      }
      return newSet
    })
  }

  // 添加评论
  const handleAddComment = async (activityId: string) => {
    const content = newComments[activityId]?.trim()
    if (!content) return

    try {
      const comment = await YYAddComment(activityId, content)
      if (comment) {
        setActivities((prev) =>
          prev.map((activity) =>
            activity.id === activityId ? { ...activity, comments: [...activity.comments, comment] } : activity,
          ),
        )
        setNewComments((prev) => ({ ...prev, [activityId]: "" }))
      }
    } catch (error) {
      console.error("添加评论失败:", error)
    }
  }

  // 获取活动图标
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "complete_resource":
        return <BookOpen className="h-5 w-5 text-green-500" />
      case "join_group":
        return <Users className="h-5 w-5 text-blue-500" />
      case "share_note":
        return <Share2 className="h-5 w-5 text-purple-500" />
      case "create_goal":
        return <Target className="h-5 w-5 text-orange-500" />
      case "achievement":
        return <Trophy className="h-5 w-5 text-yellow-500" />
      default:
        return <BookOpen className="h-5 w-5 text-gray-500" />
    }
  }

  // 获取活动类型文本
  const getActivityTypeText = (type: string) => {
    switch (type) {
      case "complete_resource":
        return "完成学习"
      case "join_group":
        return "加入小组"
      case "share_note":
        return "分享笔记"
      case "create_goal":
        return "设定目标"
      case "achievement":
        return "获得成就"
      default:
        return "学习活动"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
        <h2 className="text-2xl font-bold mb-2">学习动态</h2>
        <p className="text-muted-foreground">关注学习伙伴的最新动态，互相激励成长</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{activity.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.username}</span>
                      {getActivityIcon(activity.type)}
                      <Badge variant="outline" className="text-xs">
                        {getActivityTypeText(activity.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(activity.createdAt, "MM月dd日 HH:mm", { locale: zhCN })}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">{activity.title}</h4>
                  <p className="text-muted-foreground">{activity.description}</p>
                </div>

                {/* 互动按钮 */}
                <div className="flex items-center gap-4 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(activity.id)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-red-500"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{activity.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleComments(activity.id)}
                    className="flex items-center gap-1 text-muted-foreground"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{activity.comments.length}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
                    <Share2 className="h-4 w-4" />
                    <span>分享</span>
                  </Button>
                </div>

                {/* 评论区域 */}
                {expandedComments.has(activity.id) && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      {/* 现有评论 */}
                      {activity.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">{comment.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-muted rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{comment.username}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(comment.createdAt, "MM月dd日 HH:mm", { locale: zhCN })}
                                </span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">
                                <Heart className="h-3 w-3 mr-1" />
                                {comment.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">
                                回复
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* 添加评论 */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">我</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input
                            placeholder="写下你的评论..."
                            value={newComments[activity.id] || ""}
                            onChange={(e) => setNewComments((prev) => ({ ...prev, [activity.id]: e.target.value }))}
                            onKeyPress={(e) => e.key === "Enter" && handleAddComment(activity.id)}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddComment(activity.id)}
                            disabled={!newComments[activity.id]?.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">暂无学习动态</h3>
          <p className="text-muted-foreground">加入学习小组，关注学习伙伴，开始社交学习！</p>
        </div>
      )}
    </div>
  )
}
