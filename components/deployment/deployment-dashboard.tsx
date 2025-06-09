"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Rocket,
  Server,
  Cloud,
  Container,
  GitBranch,
  Settings,
  Monitor,
  FileText,
  Plus,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"

interface DeploymentProject {
  id: string
  name: string
  platform: string
  status: "running" | "completed" | "failed" | "pending"
  progress: number
  lastDeploy: string
  url?: string
}

interface DeploymentTemplate {
  id: string
  name: string
  description: string
  platform: string
  icon: React.ReactNode
  difficulty: "beginner" | "intermediate" | "advanced"
}

export function DeploymentDashboard() {
  const [activeTab, setActiveTab] = useState("projects")
  const [projects] = useState<DeploymentProject[]>([
    {
      id: "1",
      name: "YanYu Cloud³ 主站",
      platform: "Vercel",
      status: "completed",
      progress: 100,
      lastDeploy: "2024-01-15 14:30",
      url: "https://yanyu-cloud.vercel.app",
    },
    {
      id: "2",
      name: "API 服务",
      platform: "Docker",
      status: "running",
      progress: 75,
      lastDeploy: "2024-01-15 15:45",
    },
    {
      id: "3",
      name: "移动端应用",
      platform: "Netlify",
      status: "failed",
      progress: 45,
      lastDeploy: "2024-01-15 16:20",
    },
  ])

  const [templates] = useState<DeploymentTemplate[]>([
    {
      id: "1",
      name: "Next.js 应用",
      description: "现代化的 React 全栈框架，支持 SSR 和 SSG",
      platform: "Vercel",
      icon: <Rocket className="w-6 h-6" />,
      difficulty: "beginner",
    },
    {
      id: "2",
      name: "Vue.js 应用",
      description: "渐进式 JavaScript 框架，易于上手",
      platform: "Netlify",
      icon: <Server className="w-6 h-6" />,
      difficulty: "beginner",
    },
    {
      id: "3",
      name: "Docker 容器",
      description: "容器化部署，支持任何技术栈",
      platform: "Docker",
      icon: <Container className="w-6 h-6" />,
      difficulty: "intermediate",
    },
    {
      id: "4",
      name: "Kubernetes 集群",
      description: "企业级容器编排和管理",
      platform: "Kubernetes",
      icon: <Cloud className="w-6 h-6" />,
      difficulty: "advanced",
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "running":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">部署指导引擎</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">智能化部署管理，让应用上线变得简单高效</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新建部署项目
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">总项目数</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{projects.length}</p>
              </div>
              <Rocket className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">运行中</p>
                <p className="text-2xl font-bold text-blue-600">
                  {projects.filter((p) => p.status === "running").length}
                </p>
              </div>
              <Play className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">已完成</p>
                <p className="text-2xl font-bold text-green-600">
                  {projects.filter((p) => p.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">失败项目</p>
                <p className="text-2xl font-bold text-red-600">
                  {projects.filter((p) => p.status === "failed").length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            我的项目
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            部署模板
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            部署指南
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            配置管理
          </TabsTrigger>
        </TabsList>

        {/* 项目管理 */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{project.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {project.platform} • 最后部署: {project.lastDeploy}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusIcon(project.status)}
                        <span className="ml-1 capitalize">{project.status}</span>
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Pause className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">部署进度</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {project.url && (
                    <div className="mt-4 pt-4 border-t">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm font-medium"
                      >
                        🔗 {project.url}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 部署模板 */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        {template.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="text-sm">{template.platform}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(template.difficulty)}>{template.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{template.description}</p>
                  <Button className="w-full">使用此模板</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 部署指南 */}
        <TabsContent value="guides" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>部署指南中心</CardTitle>
                <CardDescription>学习各种平台的部署最佳实践和常见问题解决方案</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 justify-start">
                    <div className="text-left">
                      <div className="font-medium">Vercel 部署指南</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Next.js 应用的最佳部署平台</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 justify-start">
                    <div className="text-left">
                      <div className="font-medium">Docker 容器化</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">应用容器化部署完整指南</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 justify-start">
                    <div className="text-left">
                      <div className="font-medium">CI/CD 流水线</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">自动化部署流程配置</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 justify-start">
                    <div className="text-left">
                      <div className="font-medium">性能优化</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">部署后的性能监控和优化</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 配置管理 */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>环境配置</CardTitle>
              <CardDescription>管理部署环境变量和配置文件</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 justify-start">
                    <div className="text-left">
                      <div className="font-medium">环境变量管理</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">配置和管理应用环境变量</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 justify-start">
                    <div className="text-left">
                      <div className="font-medium">域名配置</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">自定义域名和SSL证书</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 justify-start">
                    <div className="text-left">
                      <div className="font-medium">监控告警</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">设置部署状态监控和告警</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 justify-start">
                    <div className="text-left">
                      <div className="font-medium">备份恢复</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">配置自动备份和恢复策略</div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
