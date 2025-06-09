"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import {
  Plus,
  X,
  GripVertical,
  BookOpen,
  Target,
  Video,
  FileText,
  Award,
  Clock,
  Save,
  Eye,
  Trash2,
  Copy,
} from "lucide-react"
import { YYCreateLearningPath, YYGetPathTemplates } from "@/lib/learning-path-manager"
import type { LearningPath, LearningPathStep, PathTemplate, PathDifficulty, StepType } from "@/types/learning-path"

interface PathCreatorProps {
  onSave: (path: LearningPath) => void
  onCancel: () => void
  editingPath?: LearningPath
}

export function PathCreator({ onSave, onCancel, editingPath }: PathCreatorProps) {
  const [pathData, setPathData] = useState({
    title: editingPath?.title || "",
    description: editingPath?.description || "",
    category: editingPath?.category || "",
    difficulty: (editingPath?.difficulty || "beginner") as PathDifficulty,
    tags: editingPath?.tags || [],
    isPublic: editingPath?.isPublic ?? true,
    isFeatured: editingPath?.isFeatured ?? false,
  })

  const [steps, setSteps] = useState<Omit<LearningPathStep, "status" | "completedAt" | "startedAt">[]>(
    editingPath?.steps.map((step) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      type: step.type,
      order: step.order,
      estimatedHours: step.estimatedHours,
      difficulty: step.difficulty,
      prerequisites: step.prerequisites,
      resources: step.resources,
      progress: 0,
      isOptional: step.isOptional,
      skills: step.skills,
    })) || [],
  )

  const [newTag, setNewTag] = useState("")
  const [showStepDialog, setShowStepDialog] = useState(false)
  const [editingStep, setEditingStep] = useState<number | null>(null)
  const [newStep, setNewStep] = useState({
    title: "",
    description: "",
    type: "course" as StepType,
    estimatedHours: 1,
    difficulty: "beginner" as PathDifficulty,
    isOptional: false,
    skills: [] as string[],
  })
  const [newSkill, setNewSkill] = useState("")
  const [templates, setTemplates] = useState<PathTemplate[]>([])
  const [showTemplates, setShowTemplates] = useState(false)

  // 加载模板
  useState(() => {
    YYGetPathTemplates().then(setTemplates)
  })

  const addTag = () => {
    if (newTag.trim() && !pathData.tags.includes(newTag.trim())) {
      setPathData({
        ...pathData,
        tags: [...pathData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setPathData({
      ...pathData,
      tags: pathData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const addSkill = () => {
    if (newSkill.trim() && !newStep.skills.includes(newSkill.trim())) {
      setNewStep({
        ...newStep,
        skills: [...newStep.skills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setNewStep({
      ...newStep,
      skills: newStep.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  const handleAddStep = () => {
    const step: Omit<LearningPathStep, "status" | "completedAt" | "startedAt"> = {
      id: `step-${Date.now()}`,
      ...newStep,
      order: steps.length + 1,
      prerequisites: [],
      resources: [],
      progress: 0,
    }

    if (editingStep !== null) {
      const updatedSteps = [...steps]
      updatedSteps[editingStep] = { ...step, order: steps[editingStep].order }
      setSteps(updatedSteps)
      setEditingStep(null)
    } else {
      setSteps([...steps, step])
    }

    setNewStep({
      title: "",
      description: "",
      type: "course",
      estimatedHours: 1,
      difficulty: "beginner",
      isOptional: false,
      skills: [],
    })
    setShowStepDialog(false)
  }

  const handleEditStep = (index: number) => {
    const step = steps[index]
    setNewStep({
      title: step.title,
      description: step.description,
      type: step.type,
      estimatedHours: step.estimatedHours,
      difficulty: step.difficulty,
      isOptional: step.isOptional,
      skills: [...step.skills],
    })
    setEditingStep(index)
    setShowStepDialog(true)
  }

  const handleDeleteStep = (index: number) => {
    const updatedSteps = steps.filter((_, i) => i !== index)
    // 重新排序
    const reorderedSteps = updatedSteps.map((step, i) => ({
      ...step,
      order: i + 1,
    }))
    setSteps(reorderedSteps)
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(steps)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // 重新排序
    const reorderedSteps = items.map((step, index) => ({
      ...step,
      order: index + 1,
    }))

    setSteps(reorderedSteps)
  }

  const handleSave = async () => {
    try {
      const totalHours = steps.reduce((sum, step) => sum + step.estimatedHours, 0)

      const pathToSave: Omit<
        LearningPath,
        "id" | "createdAt" | "updatedAt" | "stats" | "overallProgress" | "timeSpent"
      > = {
        ...pathData,
        status: "draft",
        estimatedHours: totalHours,
        steps: steps.map((step) => ({
          ...step,
          status: step.order === 1 ? "available" : "locked",
          completedAt: undefined,
          startedAt: undefined,
        })) as LearningPathStep[],
        author: {
          id: "user-1",
          name: "当前用户",
        },
        thumbnail: undefined,
        publishedAt: undefined,
        isEnrolled: false,
        enrolledAt: undefined,
        completedAt: undefined,
        currentStepId: undefined,
        lastAccessedAt: undefined,
      }

      const savedPath = await YYCreateLearningPath(pathToSave)
      onSave(savedPath)
    } catch (error) {
      console.error("保存学习路径失败:", error)
    }
  }

  const applyTemplate = (template: PathTemplate) => {
    setPathData({
      ...pathData,
      title: template.name,
      description: template.description,
      category: template.category,
      difficulty: template.difficulty,
      tags: [...template.tags],
    })

    setSteps(
      template.steps.map((step, index) => ({
        ...step,
        id: `step-${Date.now()}-${index}`,
        order: index + 1,
        prerequisites: [],
        resources: [],
        progress: 0,
      })),
    )

    setShowTemplates(false)
  }

  const getStepIcon = (type: StepType) => {
    switch (type) {
      case "course":
        return BookOpen
      case "project":
        return Target
      case "video":
        return Video
      case "article":
        return FileText
      case "quiz":
        return Award
      default:
        return BookOpen
    }
  }

  const getStepTypeText = (type: StepType) => {
    switch (type) {
      case "course":
        return "课程"
      case "project":
        return "项目"
      case "video":
        return "视频"
      case "article":
        return "文章"
      case "quiz":
        return "测验"
      case "practice":
        return "练习"
      case "milestone":
        return "里程碑"
      default:
        return "其他"
    }
  }

  const getDifficultyColor = (difficulty: PathDifficulty) => {
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

  const getDifficultyText = (difficulty: PathDifficulty) => {
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

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{editingPath ? "编辑学习路径" : "创建学习路径"}</h2>
          <p className="text-muted-foreground">设计系统化的学习计划</p>
        </div>
        <div className="flex gap-2">
          {templates.length > 0 && (
            <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Copy className="mr-2 h-4 w-4" />
                  使用模板
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>选择路径模板</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-md"
                      onClick={() => applyTemplate(template)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getDifficultyColor(template.difficulty)} text-white text-xs`}>
                            {getDifficultyText(template.difficulty)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{template.steps.length} 个步骤</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={!pathData.title || steps.length === 0}>
            <Save className="mr-2 h-4 w-4" />
            保存路径
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 基本信息 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>设置学习路径的基本信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">路径标题 *</Label>
                <Input
                  id="title"
                  value={pathData.title}
                  onChange={(e) => setPathData({ ...pathData, title: e.target.value })}
                  placeholder="输入学习路径标题"
                />
              </div>

              <div>
                <Label htmlFor="description">路径描述 *</Label>
                <Textarea
                  id="description"
                  value={pathData.description}
                  onChange={(e) => setPathData({ ...pathData, description: e.target.value })}
                  placeholder="描述学习路径的内容和目标"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">分类</Label>
                  <Select
                    value={pathData.category}
                    onValueChange={(value) => setPathData({ ...pathData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="前端开发">前端开发</SelectItem>
                      <SelectItem value="后端开发">后端开发</SelectItem>
                      <SelectItem value="移动开发">移动开发</SelectItem>
                      <SelectItem value="数据科学">数据科学</SelectItem>
                      <SelectItem value="设计">设计</SelectItem>
                      <SelectItem value="产品管理">产品管理</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">难度等级</Label>
                  <Select
                    value={pathData.difficulty}
                    onValueChange={(value) => setPathData({ ...pathData, difficulty: value as PathDifficulty })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">初级</SelectItem>
                      <SelectItem value="intermediate">中级</SelectItem>
                      <SelectItem value="advanced">高级</SelectItem>
                      <SelectItem value="expert">专家</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  {pathData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isPublic">公开路径</Label>
                    <p className="text-sm text-muted-foreground">允许其他用户查看和学习此路径</p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={pathData.isPublic}
                    onCheckedChange={(checked) => setPathData({ ...pathData, isPublic: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isFeatured">精选推荐</Label>
                    <p className="text-sm text-muted-foreground">在精选区域展示此路径</p>
                  </div>
                  <Switch
                    id="isFeatured"
                    checked={pathData.isFeatured}
                    onCheckedChange={(checked) => setPathData({ ...pathData, isFeatured: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 学习步骤 */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>学习步骤</CardTitle>
                  <CardDescription>设计学习路径的具体步骤</CardDescription>
                </div>
                <Dialog open={showStepDialog} onOpenChange={setShowStepDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      添加步骤
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingStep !== null ? "编辑步骤" : "添加步骤"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="stepTitle">步骤标题 *</Label>
                        <Input
                          id="stepTitle"
                          value={newStep.title}
                          onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                          placeholder="输入步骤标题"
                        />
                      </div>

                      <div>
                        <Label htmlFor="stepDescription">步骤描述</Label>
                        <Textarea
                          id="stepDescription"
                          value={newStep.description}
                          onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                          placeholder="描述此步骤的学习内容"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="stepType">步骤类型</Label>
                          <Select
                            value={newStep.type}
                            onValueChange={(value) => setNewStep({ ...newStep, type: value as StepType })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="course">课程</SelectItem>
                              <SelectItem value="book">书籍</SelectItem>
                              <SelectItem value="video">视频</SelectItem>
                              <SelectItem value="article">文章</SelectItem>
                              <SelectItem value="project">项目</SelectItem>
                              <SelectItem value="quiz">测验</SelectItem>
                              <SelectItem value="practice">练习</SelectItem>
                              <SelectItem value="milestone">里程碑</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="stepDifficulty">难度等级</Label>
                          <Select
                            value={newStep.difficulty}
                            onValueChange={(value) => setNewStep({ ...newStep, difficulty: value as PathDifficulty })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">初级</SelectItem>
                              <SelectItem value="intermediate">中级</SelectItem>
                              <SelectItem value="advanced">高级</SelectItem>
                              <SelectItem value="expert">专家</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="estimatedHours">预计时长（小时）</Label>
                          <Input
                            id="estimatedHours"
                            type="number"
                            value={newStep.estimatedHours}
                            onChange={(e) =>
                              setNewStep({ ...newStep, estimatedHours: Number.parseInt(e.target.value) || 1 })
                            }
                            min="1"
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-6">
                          <Switch
                            id="isOptional"
                            checked={newStep.isOptional}
                            onCheckedChange={(checked) => setNewStep({ ...newStep, isOptional: checked })}
                          />
                          <Label htmlFor="isOptional">可选步骤</Label>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="skills">技能点</Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            id="skills"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="添加技能点"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                          />
                          <Button type="button" onClick={addSkill} variant="outline">
                            添加
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newStep.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                              {skill}
                              <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowStepDialog(false)}>
                          取消
                        </Button>
                        <Button onClick={handleAddStep} disabled={!newStep.title}>
                          {editingStep !== null ? "更新步骤" : "添加步骤"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {steps.length > 0 ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="steps">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {steps.map((step, index) => {
                          const StepIcon = getStepIcon(step.type)
                          return (
                            <Draggable key={step.id} draggableId={step.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="flex items-center gap-3 p-4 border rounded-lg bg-background"
                                >
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-medium">{step.order}</span>
                                  </div>
                                  <StepIcon className="h-4 w-4" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium">{step.title}</h4>
                                      <Badge variant="outline" className="text-xs">
                                        {getStepTypeText(step.type)}
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
                                    <p className="text-sm text-muted-foreground line-clamp-2">{step.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {step.estimatedHours}小时
                                      </span>
                                      <span>{step.skills.length}个技能点</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button size="sm" variant="outline" onClick={() => handleEditStep(index)}>
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleDeleteStep(index)}>
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <div className="text-center py-12">
                  <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">暂无学习步骤</h3>
                  <p className="text-muted-foreground">添加第一个学习步骤来开始构建路径</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 预览和统计 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>路径预览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{pathData.title || "未命名路径"}</h3>
                  <p className="text-sm text-muted-foreground">{pathData.description || "暂无描述"}</p>
                </div>

                <div className="flex items-center gap-2">
                  {pathData.difficulty && (
                    <Badge className={`${getDifficultyColor(pathData.difficulty)} text-white text-xs`}>
                      {getDifficultyText(pathData.difficulty)}
                    </Badge>
                  )}
                  {pathData.category && (
                    <Badge variant="outline" className="text-xs">
                      {pathData.category}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>总步骤数</span>
                    <span>{steps.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>预计时长</span>
                    <span>{steps.reduce((sum, step) => sum + step.estimatedHours, 0)}小时</span>
                  </div>
                  <div className="flex justify-between">
                    <span>必修步骤</span>
                    <span>{steps.filter((step) => !step.isOptional).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>可选步骤</span>
                    <span>{steps.filter((step) => step.isOptional).length}</span>
                  </div>
                </div>

                {pathData.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">标签</p>
                    <div className="flex flex-wrap gap-1">
                      {pathData.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>技能统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from(new Set(steps.flatMap((step) => step.skills))).map((skill) => (
                  <div key={skill} className="flex justify-between text-sm">
                    <span>{skill}</span>
                    <span>{steps.filter((step) => step.skills.includes(skill)).length}次</span>
                  </div>
                ))}
                {steps.length === 0 && <p className="text-sm text-muted-foreground text-center">暂无技能统计</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
