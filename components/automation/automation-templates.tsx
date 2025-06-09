"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Download, Star, Clock, Zap, Shield, Database } from "lucide-react"

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: string
  rating: number
  downloads: number
  tags: string[]
  icon: React.ReactNode
}

export function AutomationTemplates() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const templates: WorkflowTemplate[] = [
    {
      id: "1",
      name: "网络监控自动化",
      description: "自动监控网络状态，检测异常并发送告警通知",
      category: "monitoring",
      difficulty: "intermediate",
      estimatedTime: "15分钟",
      rating: 4.8,
      downloads: 1250,
      tags: ["网络", "监控", "告警"],
      icon: <Zap className="h-6 w-6" />,
    },
    {
      id: "2",
      name: "数据备份流程",
      description: "定期备份重要数据到云存储，确保数据安全",
      category: "backup",
      difficulty: "beginner",
      estimatedTime: "10分钟",
      rating: 4.9,
      downloads: 2100,
      tags: ["备份", "数据", "安全"],
      icon: <Database className="h-6 w-6" />,
    },
    {
      id: "3",
      name: "安全扫描自动化",
      description: "定期执行安全扫描，检测系统漏洞和威胁",
      category: "security",
      difficulty: "advanced",
      estimatedTime: "30分钟",
      rating: 4.7,
      downloads: 890,
      tags: ["安全", "扫描", "漏洞"],
      icon: <Shield className="h-6 w-6" />,
    },
    {
      id: "4",
      name: "设备健康检查",
      description: "监控设备状态，自动检测硬件问题",
      category: "monitoring",
      difficulty: "intermediate",
      estimatedTime: "20分钟",
      rating: 4.6,
      downloads: 1560,
      tags: ["设备", "健康", "监控"],
      icon: <Zap className="h-6 w-6" />,
    },
    {
      id: "5",
      name: "日志清理自动化",
      description: "自动清理过期日志文件，释放存储空间",
      category: "maintenance",
      difficulty: "beginner",
      estimatedTime: "5分钟",
      rating: 4.5,
      downloads: 3200,
      tags: ["日志", "清理", "维护"],
      icon: <Database className="h-6 w-6" />,
    },
    {
      id: "6",
      name: "性能报告生成",
      description: "定期生成系统性能报告并发送给管理员",
      category: "reporting",
      difficulty: "intermediate",
      estimatedTime: "25分钟",
      rating: 4.4,
      downloads: 780,
      tags: ["报告", "性能", "分析"],
      icon: <Clock className="h-6 w-6" />,
    },
  ]

  const categories = [
    { id: "all", name: "全部", count: templates.length },
    { id: "monitoring", name: "监控", count: templates.filter((t) => t.category === "monitoring").length },
    { id: "backup", name: "备份", count: templates.filter((t) => t.category === "backup").length },
    { id: "security", name: "安全", count: templates.filter((t) => t.category === "security").length },
    { id: "maintenance", name: "维护", count: templates.filter((t) => t.category === "maintenance").length },
    { id: "reporting", name: "报告", count: templates.filter((t) => t.category === "reporting").length },
  ]

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

  const getDifficultyText = (difficulty: string) => {
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

  return (
    <div className="space-y-6">
      {/* 搜索和筛选 */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索模板..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* 模板网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">{template.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {getDifficultyText(template.difficulty)}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {template.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{template.description}</CardDescription>

              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {template.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {template.downloads.toLocaleString()}
                  </span>
                </div>
                <Button size="sm">使用模板</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">未找到匹配的模板</h3>
          <p className="text-muted-foreground">尝试调整搜索关键词或选择不同的分类</p>
        </div>
      )}
    </div>
  )
}
