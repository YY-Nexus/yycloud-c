/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 学习资源卡片组件
 * ==========================================
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Book,
  Video,
  FileText,
  Podcast,
  Clock,
  Calendar,
  MoreVertical,
  Play,
  Pause,
  CheckCircle,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import type { LearningResource } from "@/types/learning"

interface LearningResourceCardProps {
  resource: LearningResource
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  onStartSession: () => void
  onPauseSession: () => void
}

// 资源类型图标映射
const resourceTypeIcons = {
  course: Book,
  book: Book,
  video: Video,
  article: FileText,
  podcast: Podcast,
  workshop: Book,
  tutorial: Video,
}

// 状态颜色映射
const statusColors = {
  not_started: "bg-gray-500",
  in_progress: "bg-blue-500",
  completed: "bg-green-500",
  paused: "bg-yellow-500",
  archived: "bg-gray-400",
}

// 优先级颜色映射
const priorityColors = {
  高: "bg-red-500",
  中: "bg-yellow-500",
  低: "bg-green-500",
}

export function LearningResourceCard({
  resource,
  onView,
  onEdit,
  onDelete,
  onStartSession,
  onPauseSession,
}: LearningResourceCardProps) {
  const [isSessionActive, setIsSessionActive] = useState(false)

  const Icon = resourceTypeIcons[resource.type] || FileText

  // 获取状态显示文本
  const getStatusText = (status: string) => {
    const statusMap = {
      not_started: "未开始",
      in_progress: "进行中",
      completed: "已完成",
      paused: "已暂停",
      archived: "已归档",
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  // 格式化时间
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}小时${mins}分钟`
    }
    return `${mins}分钟`
  }

  // 处理开始/暂停学习会话
  const handleSessionToggle = () => {
    if (isSessionActive) {
      onPauseSession()
      setIsSessionActive(false)
    } else {
      onStartSession()
      setIsSessionActive(true)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-slate-100 rounded-md dark:bg-slate-800">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
              <CardDescription className="line-clamp-1">
                {resource.author && `${resource.author} · `}
                {resource.category}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <ExternalLink className="mr-2 h-4 w-4" />
                查看详情
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <Badge className={`${statusColors[resource.status]} text-white`}>{getStatusText(resource.status)}</Badge>
          <Badge className={`${priorityColors[resource.priority]} text-white`}>{resource.priority}优先级</Badge>
          {resource.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        {resource.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{resource.description}</p>
        )}

        {/* 进度条 */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>学习进度</span>
            <span>{resource.progress}%</span>
          </div>
          <Progress value={resource.progress} className="h-2" />
        </div>

        {/* 时间信息 */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>
              {formatDuration(resource.completedDuration)} / {formatDuration(resource.totalDuration)}
            </span>
          </div>
          {resource.dueDate && (
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>截止: {format(new Date(resource.dueDate), "MM月dd日", { locale: zhCN })}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex w-full gap-2">
          {resource.status === "completed" ? (
            <Button variant="outline" className="flex-1" disabled>
              <CheckCircle className="mr-2 h-4 w-4" />
              已完成
            </Button>
          ) : (
            <Button onClick={handleSessionToggle} className="flex-1">
              {isSessionActive ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  暂停学习
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  开始学习
                </>
              )}
            </Button>
          )}
          <Button variant="outline" onClick={onView}>
            详情
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
