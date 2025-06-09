"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, TagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { getAllTags, createTag, updateTag, deleteTag } from "@/lib/tag-management-service"
import type { DeviceTag } from "@/types/device-management"

const predefinedColors = [
  "#ef4444", // red
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // gray
  "#059669", // green
  "#dc2626", // red-600
  "#7c3aed", // violet-600
]

interface TagFormData {
  name: string
  color: string
  description: string
}

export function TagManager() {
  const { toast } = useToast()
  const [tags, setTags] = useState<DeviceTag[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTag, setEditingTag] = useState<DeviceTag | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<TagFormData>({
    name: "",
    color: predefinedColors[0],
    description: "",
  })

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const tagsData = await getAllTags()
      setTags(tagsData)
    } catch (error) {
      toast({
        title: "错误",
        description: "获取标签失败",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "错误",
        description: "请输入标签名称",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingTag) {
        // 更新标签
        await updateTag(editingTag.id, formData)
        toast({
          title: "成功",
          description: "标签已更新",
        })
      } else {
        // 创建新标签
        await createTag(formData)
        toast({
          title: "成功",
          description: "标签已创建",
        })
      }

      await fetchTags()
      handleCloseDialog()
    } catch (error) {
      toast({
        title: "错误",
        description: editingTag ? "更新标签失败" : "创建标签失败",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (tag: DeviceTag) => {
    setEditingTag(tag)
    setFormData({
      name: tag.name,
      color: tag.color,
      description: tag.description || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (tag: DeviceTag) => {
    try {
      await deleteTag(tag.id)
      toast({
        title: "成功",
        description: "标签已删除",
      })
      await fetchTags()
    } catch (error) {
      toast({
        title: "错误",
        description: "删除标签失败",
        variant: "destructive",
      })
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTag(null)
    setFormData({
      name: "",
      color: predefinedColors[0],
      description: "",
    })
  }

  if (loading) {
    return <div className="text-center py-8">正在加载标签...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">标签管理</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加标签
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTag ? "编辑标签" : "添加新标签"}</DialogTitle>
              <DialogDescription>{editingTag ? "修改标签信息" : "创建一个新的设备标签"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tag-name">标签名称</Label>
                <Input
                  id="tag-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="输入标签名称"
                />
              </div>
              <div className="space-y-2">
                <Label>标签颜色</Label>
                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? "border-gray-900" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag-description">描述 (可选)</Label>
                <Textarea
                  id="tag-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="输入标签描述"
                />
              </div>
              <div className="space-y-2">
                <Label>预览</Label>
                <Badge style={{ backgroundColor: formData.color, color: "white" }}>
                  <TagIcon className="mr-1 h-3 w-3" />
                  {formData.name || "标签名称"}
                </Badge>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                取消
              </Button>
              <Button onClick={handleSubmit}>{editingTag ? "保存更改" : "创建标签"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <div key={tag.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Badge style={{ backgroundColor: tag.color, color: "white" }}>
                <TagIcon className="mr-1 h-3 w-3" />
                {tag.name}
              </Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(tag)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除</AlertDialogTitle>
                      <AlertDialogDescription>
                        您确定要删除标签 "{tag.name}" 吗？此操作无法撤销。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(tag)}>删除</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            {tag.description && <p className="text-sm text-muted-foreground">{tag.description}</p>}
            <div className="text-xs text-muted-foreground">
              创建于: {new Date(tag.createdAt).toLocaleDateString("zh-CN")}
            </div>
          </div>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">暂无标签，点击上方按钮创建第一个标签</div>
      )}
    </div>
  )
}
