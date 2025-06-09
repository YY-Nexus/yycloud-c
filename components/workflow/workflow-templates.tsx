"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Download, Clock, User, Calendar, Zap, Globe, FileText, Settings } from "lucide-react"
import { getWorkflowTemplates } from "@/lib/workflow-templates"
import { workflowEngine } from "@/lib/workflow-engine"
import type { WorkflowTemplate } from "@/types/workflow"

export function WorkflowTemplates() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(getWorkflowTemplates())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")

  const categories = [
    { value: "all", label: "全部分类" },
    { value: "系统维护", label: "系统维护" },
    { value: "监控", label: "监控" },
    { value: "文件管理", label: "文件管理" },
    { value: "生产力", label: "生产力" },
    { value: "通知", label: "通知" },
    { value: "数据处理", label: "数据处理" },
  ]

  const difficulties = [
    { value: "all", label: "全部难度" },
    { value: "beginner", label: "初级" },
    { value: "intermediate", label: "中级" },
    { value: "advanced", label: "高级" },
  ]

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || template.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const handleUseTemplate = (template: WorkflowTemplate) => {
    try {
      const workflow = workflowEngine.createWorkflow({
        name: `${template.name} - 副本`,
        description: template.description,
        category: template.category,
        tags: template.tags,
        triggers: template.triggers.map((trigger) => ({
          ...trigger,
          id: Math.random().toString(36).substr(2, 9),
          lastTriggered: undefined,
          nextTrigger: undefined,
        })),
        actions: template.actions.map((action) => ({
          ...action,
          id: Math.random().toString(36).substr(2, 9),
        })),
        variables: template.variables.map((variable) => ({
          ...variable,
          id: Math.random().toString(36).substr(2, 9),
        })),
        enabled: false,
        templateId: template.id,
      })

      // 更新模板使用次数
      template.usageCount++

      console.log("工作流创建成功:", workflow)
    } catch (error) {
      console.error("创建工作流失败:", error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "系统维护":
        return <Settings className="h-4 w-4" />
      case "监控":
        return <Globe className="h-4 w-4" />
      case "文件管理":
        return <FileText className="h-4 w-4" />
      case "生产力":
        return <Zap className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-2xl font-bold">工作流模板库</h2>
          <p className="text-muted-foreground">从预制模板快速创建工作流，提高效率</p>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索模板..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="选择难度" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 模板网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{template.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {getCategoryIcon(template.category)}
                      <span className="text-sm text-muted-foreground">{template.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{template.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="line-clamp-3">{template.description}</CardDescription>

              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{template.estimatedTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>{template.usageCount}</span>
                  </div>
                </div>
                <Badge className={getDifficultyColor(template.difficulty)}>
                  {getDifficultyLabel(template.difficulty)}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{template.author}</span>
                </div>
                <span>{new Date(template.createdAt).toLocaleDateString()}</span>
              </div>

              <Button className="w-full" onClick={() => handleUseTemplate(template)}>
                <Download className="h-4 w-4 mr-2" />
                使用模板
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">未找到匹配的模板</h3>
            <p className="text-muted-foreground text-center">尝试调整搜索条件或筛选器来找到您需要的模板</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
