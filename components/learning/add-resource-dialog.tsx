"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { YYAddLearningResource } from "@/lib/learning-manager"
import type { LearningResourceType, LearningCategory, LearningPriority } from "@/types/learning"

interface AddResourceDialogProps {
  onClose: () => void
}

export function AddResourceDialog({ onClose }: AddResourceDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "course" as LearningResourceType,
    category: "技术" as LearningCategory,
    priority: "中" as LearningPriority,
    totalDuration: 60,
    url: "",
    author: "",
    publisher: "",
    dueDate: undefined as Date | undefined,
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await YYAddLearningResource({
        ...formData,
        status: "not_started",
        progress: 0,
        completedDuration: 0,
        startDate: undefined,
        completedDate: undefined,
      })
      onClose()
    } catch (error) {
      console.error("添加学习资源失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本信息 */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">资源标题 *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="输入学习资源标题"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">资源描述</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="描述这个学习资源的内容和目标"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">资源类型</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as LearningResourceType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="course">课程</SelectItem>
                <SelectItem value="book">书籍</SelectItem>
                <SelectItem value="video">视频</SelectItem>
                <SelectItem value="article">文章</SelectItem>
                <SelectItem value="podcast">播客</SelectItem>
                <SelectItem value="workshop">工作坊</SelectItem>
                <SelectItem value="tutorial">教程</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">分类</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as LearningCategory })}
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priority">优先级</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value as LearningPriority })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="高">高优先级</SelectItem>
                <SelectItem value="中">中优先级</SelectItem>
                <SelectItem value="低">低优先级</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration">预计时长（分钟）</Label>
            <Input
              id="duration"
              type="number"
              value={formData.totalDuration}
              onChange={(e) => setFormData({ ...formData, totalDuration: Number.parseInt(e.target.value) || 0 })}
              placeholder="60"
              min="1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* 详细信息 */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="url">资源链接</Label>
          <Input
            id="url"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="author">作者</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="作者姓名"
            />
          </div>

          <div>
            <Label htmlFor="publisher">出版商/平台</Label>
            <Input
              id="publisher"
              value={formData.publisher}
              onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              placeholder="出版商或平台名称"
            />
          </div>
        </div>

        <div>
          <Label>截止日期（可选）</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dueDate ? format(formData.dueDate, "yyyy年MM月dd日", { locale: zhCN }) : "选择截止日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dueDate}
                onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="tags">标签</Label>
          <div className="flex gap-2 mb-2">
            <Input
              id="tags"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="添加标签"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} variant="outline">
              添加
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* 操作按钮 */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          取消
        </Button>
        <Button type="submit" disabled={loading || !formData.title}>
          {loading ? "添加中..." : "添加资源"}
        </Button>
      </div>
    </form>
  )
}
