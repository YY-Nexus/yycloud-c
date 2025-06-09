/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 用户反馈收集组件
 *
 * @module YYC/components
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, MessageSquare, ThumbsUp, ThumbsDown, Star, X } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import { useToast } from "@/hooks/use-toast"

export type FeedbackType = "general" | "feature" | "bug" | "suggestion"

export interface FeedbackData {
  type: FeedbackType
  rating?: number
  title: string
  description: string
  email?: string
  metadata?: Record<string, any>
}

interface UserFeedbackProps {
  feature?: string
  placement?: "dialog" | "inline" | "floating"
  metadata?: Record<string, any>
  onSubmit?: (data: FeedbackData) => void
  className?: string
}

export function UserFeedback({ feature, placement = "dialog", metadata = {}, onSubmit, className }: UserFeedbackProps) {
  const [open, setOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("general")
  const [rating, setRating] = useState<number | undefined>(undefined)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!title || !description) {
      toast({
        title: "请完成必填字段",
        description: "标题和描述是必填项",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const feedbackData: FeedbackData = {
      type: feedbackType,
      rating,
      title,
      description,
      email: email || undefined,
      metadata: {
        ...metadata,
        feature,
        url: typeof window !== "undefined" ? window.location.href : "",
        timestamp: new Date().toISOString(),
      },
    }

    try {
      // 记录反馈事件
      trackEvent("user_engagement", "feedback_submitted", {
        feedback_type: feedbackType,
        rating,
        feature,
      })

      // 调用自定义提交处理程序
      if (onSubmit) {
        await onSubmit(feedbackData)
      } else {
        // 默认处理 - 可以替换为实际的API调用
        console.log("Feedback submitted:", feedbackData)
        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // 显示感谢信息
      setShowThankYou(true)

      // 重置表单
      setTimeout(() => {
        setFeedbackType("general")
        setRating(undefined)
        setTitle("")
        setDescription("")
        setEmail("")
        setShowThankYou(false)
        setOpen(false)
      }, 3000)
    } catch (error) {
      console.error("Failed to submit feedback:", error)
      toast({
        title: "提交失败",
        description: "无法提交您的反馈，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderFeedbackForm = () => (
    <div className="space-y-4">
      {showThankYou ? (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
            <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium">感谢您的反馈！</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            您的意见对我们非常重要，我们将认真考虑您的建议。
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label>反馈类型</Label>
            <RadioGroup
              value={feedbackType}
              onValueChange={(value) => setFeedbackType(value as FeedbackType)}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general">一般反馈</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feature" id="feature" />
                <Label htmlFor="feature">功能请求</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bug" id="bug" />
                <Label htmlFor="bug">问题报告</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion">改进建议</Label>
              </div>
            </RadioGroup>
          </div>

          {(feedbackType === "general" || feedbackType === "feature") && (
            <div className="space-y-2">
              <Label>评分</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`rounded-md p-1 ${
                      rating && star <= rating ? "text-yellow-500" : "text-gray-300 hover:text-yellow-500"
                    }`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">标题 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="简短描述您的反馈"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">详细描述 *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请提供更多详细信息..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">电子邮箱（可选）</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="您的电子邮箱，以便我们回复"
            />
            <p className="text-xs text-muted-foreground">如果您希望我们就此反馈与您联系，请提供您的电子邮箱</p>
          </div>
        </>
      )}
    </div>
  )

  if (placement === "inline") {
    return (
      <div className={`border rounded-lg p-4 ${className}`}>
        <h3 className="text-lg font-medium mb-4">我们期待您的反馈</h3>
        {renderFeedbackForm()}
        {!showThankYou && (
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "提交中..." : "提交反馈"}
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (placement === "floating") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={`fixed bottom-4 right-4 rounded-full shadow-lg ${className}`}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" side="top" align="end">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">快速反馈</h3>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {renderFeedbackForm()}
          {!showThankYou && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting} size="sm">
                {isSubmitting ? "提交中..." : "提交"}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <MessageSquare className="mr-2 h-4 w-4" />
          提供反馈
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>提供反馈</DialogTitle>
          <DialogDescription>
            {feature ? `请告诉我们您对"${feature}"功能的看法` : "您的反馈对我们非常重要，帮助我们不断改进产品"}
          </DialogDescription>
        </DialogHeader>
        {renderFeedbackForm()}
        {!showThankYou && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "提交中..." : "提交反馈"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function QuickFeedback({ feature, onSubmit, className }: Omit<UserFeedbackProps, "placement">) {
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!feedback) return

    setIsSubmitting(true)

    const feedbackData: FeedbackData = {
      type: "general",
      rating: feedback === "positive" ? 5 : 1,
      title: feedback === "positive" ? "正面反馈" : "负面反馈",
      description: comment || (feedback === "positive" ? "用户喜欢此功能" : "用户不喜欢此功能"),
      metadata: {
        feature,
        url: typeof window !== "undefined" ? window.location.href : "",
        timestamp: new Date().toISOString(),
        quickFeedback: true,
      },
    }

    try {
      // 记录反馈事件
      trackEvent("user_engagement", "quick_feedback", {
        feedback_type: feedback,
        feature,
        has_comment: !!comment,
      })

      // 调用自定义提交处理程序
      if (onSubmit) {
        await onSubmit(feedbackData)
      } else {
        // 默认处理 - 可以替换为实际的API调用
        console.log("Quick feedback submitted:", feedbackData)
        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // 显示感谢信息
      setShowThankYou(true)

      // 重置表单
      setTimeout(() => {
        setFeedback(null)
        setComment("")
        setShowDetail(false)
        setShowThankYou(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to submit feedback:", error)
      toast({
        title: "提交失败",
        description: "无法提交您的反馈，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showThankYou) {
    return (
      <div className={`flex items-center justify-center p-2 rounded-lg border ${className}`}>
        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">感谢您的反馈！</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-2 rounded-lg border ${className}`}>
      {!feedback ? (
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-center text-muted-foreground">此功能对您有帮助吗？</p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => {
                setFeedback("positive")
                setShowDetail(true)
              }}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>有帮助</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => {
                setFeedback("negative")
                setShowDetail(true)
              }}
            >
              <ThumbsDown className="h-4 w-4" />
              <span>没帮助</span>
            </Button>
          </div>
        </div>
      ) : showDetail ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {feedback === "positive" ? "很高兴您喜欢！请告诉我们更多：" : "请告诉我们如何改进："}
          </p>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={feedback === "positive" ? "您喜欢什么..." : "我们如何改进..."}
            rows={2}
            className="resize-none"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleSubmit()
                setShowDetail(false)
              }}
            >
              跳过
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "提交中..." : "提交"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            {feedback === "positive" ? (
              <ThumbsUp className="h-4 w-4 text-green-500" />
            ) : (
              <ThumbsDown className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">
              {feedback === "positive" ? "感谢您的正面反馈！" : "感谢您的反馈，我们会努力改进！"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
