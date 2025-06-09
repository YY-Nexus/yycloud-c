"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, X } from "lucide-react"
import { recordFeedback } from "@/lib/performance-monitor"
import { cn } from "@/lib/utils"

interface FeedbackWidgetProps {
  component?: string
  className?: string
}

export function FeedbackWidget({ component, className }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [type, setType] = useState<"interaction" | "performance" | "accessibility" | "general">("general")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const feedbackTypes = [
    { key: "interaction" as const, label: "交互体验", color: "bg-blue-100 text-blue-800" },
    { key: "performance" as const, label: "性能表现", color: "bg-green-100 text-green-800" },
    { key: "accessibility" as const, label: "无障碍", color: "bg-purple-100 text-purple-800" },
    { key: "general" as const, label: "综合体验", color: "bg-gray-100 text-gray-800" },
  ]

  const handleSubmit = () => {
    if (rating === 0) return

    recordFeedback({
      type,
      rating,
      comment: comment.trim() || undefined,
      component,
    })

    setIsSubmitted(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsSubmitted(false)
      setRating(0)
      setComment("")
      setType("general")
    }, 2000)
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={cn("fixed bottom-4 right-4 z-50 shadow-lg", className)}
      >
        <MessageSquare className="h-4 w-4 mr-1" />
        反馈
      </Button>
    )
  }

  return (
    <Card className={cn("fixed bottom-4 right-4 z-50 w-80 shadow-xl", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">用户反馈</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isSubmitted ? (
          <div className="text-center py-4">
            <div className="text-green-600 font-medium">感谢您的反馈！</div>
            <div className="text-sm text-muted-foreground mt-1">您的意见对我们很重要</div>
          </div>
        ) : (
          <>
            {/* 反馈类型 */}
            <div>
              <div className="text-sm font-medium mb-2">反馈类型</div>
              <div className="flex flex-wrap gap-2">
                {feedbackTypes.map((feedbackType) => (
                  <Badge
                    key={feedbackType.key}
                    className={cn(
                      "cursor-pointer transition-all",
                      type === feedbackType.key ? feedbackType.color : "bg-gray-50 text-gray-500 hover:bg-gray-100",
                    )}
                    onClick={() => setType(feedbackType.key)}
                  >
                    {feedbackType.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 评分 */}
            <div>
              <div className="text-sm font-medium mb-2">整体评分</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-6 w-6 cursor-pointer transition-colors",
                      star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                    )}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                ))}
              </div>
            </div>

            {/* 评论 */}
            <div>
              <div className="text-sm font-medium mb-2">详细反馈（可选）</div>
              <Textarea
                placeholder="请描述您的体验或建议..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="text-sm"
              />
            </div>

            {/* 提交按钮 */}
            <Button onClick={handleSubmit} disabled={rating === 0} className="w-full">
              提交反馈
            </Button>

            {component && <div className="text-xs text-muted-foreground text-center">当前组件: {component}</div>}
          </>
        )}
      </CardContent>
    </Card>
  )
}
