"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Server,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Zap,
  Shield,
  GitBranch,
  Rocket,
  Settings,
  BookOpen,
  Terminal,
  Code,
  Globe,
  Smartphone,
} from "lucide-react"
import {
  getServerStatus,
  getDeploymentGuideSteps,
  getDeploymentPipelines,
  formatStorageSize,
  calculateStorageUsage,
  getServerHealth,
  generateDeploymentReport,
} from "@/lib/yanyu-cloud-manager"
import type { YanYuCloudServer, DeploymentGuideStep, DeploymentPipeline } from "@/types/yanyu-cloud-deployment"

export default function YanYuCloudDeploymentPage() {
  const [servers, setServers] = useState<YanYuCloudServer[]>([])
  const [guideSteps, setGuideSteps] = useState<DeploymentGuideStep[]>([])
  const [pipelines, setPipelines] = useState<DeploymentPipeline[]>([])
  const [selectedStep, setSelectedStep] = useState<string>("")
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const serverData = getServerStatus()
        const stepsData = getDeploymentGuideSteps()
        const pipelinesData = getDeploymentPipelines()

        setServers(serverData)
        setGuideSteps(stepsData)
        setPipelines(pipelinesData)
        setSelectedStep(stepsData[0]?.id || "")
      } catch (error) {
        console.error("加载数据失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // 定时更新服务器状态
    const interval = setInterval(() => {
      setServers(getServerStatus())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "maintenance":
        return <Settings className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
    }
  }

  const getHealthBadge = (server: YanYuCloudServer) => {
    const health = getServerHealth(server)
    switch (health) {
      case "healthy":
        return <Badge className="bg-green-100 text-green-800">健康</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">警告</Badge>
      case "critical":
        return <Badge className="bg-red-100 text-red-800">严重</Badge>
    }
  }

  const getServerIcon = (type: string) => {
    switch (type) {
      case "nas":
        return <Server className="h-6 w-6" />
      case "mac":
        return <Smartphone className="h-6 w-6" />
      case "imac":
        return <Monitor className="h-6 w-6" />
      case "storage":
        return <HardDrive className="h-6 w-6" />
      default:
        return <Server className="h-6 w-6" />
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return <Badge className="bg-green-100 text-green-800">初级</Badge>
      case "intermediate":
        return <Badge className="bg-yellow-100 text-yellow-800">中级</Badge>
      case "advanced":
        return <Badge className="bg-red-100 text-red-800">高级</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "setup":
        return <Settings className="h-4 w-4" />
      case "configuration":
        return <Code className="h-4 w-4" />
      case "deployment":
        return <Rocket className="h-4 w-4" />
      case "monitoring":
        return <Activity className="h-4 w-4" />
      case "maintenance":
        return <Shield className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const deploymentReport = generateDeploymentReport()

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">加载 YanYu Cloud³ 部署引擎...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Server className="mr-3 h-8 w-8 text-blue-600" />
            YanYu Cloud³ 部署指导引擎
          </h1>
          <p className="text-muted-foreground mt-2">
            教科书级本地服务器构建流程 • 易操作 • 易维护 • 便捷性 • 稳定性 • 智能化
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            1-3 人团队
          </Badge>
          <Badge className="bg-green-100 text-green-800">生产就绪</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">系统概览</TabsTrigger>
          <TabsTrigger value="servers">设备管理</TabsTrigger>
          <TabsTrigger value="guide">部署指南</TabsTrigger>
          <TabsTrigger value="pipelines">自动化流程</TabsTrigger>
          <TabsTrigger value="monitoring">监控中心</TabsTrigger>
        </TabsList>

        {/* 系统概览 */}
        <TabsContent value="overview" className="space-y-6">
          {/* 系统状态卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">在线设备</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {deploymentReport.summary.onlineServers}/{deploymentReport.summary.totalServers}
                </div>
                <p className="text-xs text-muted-foreground">设备运行正常</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">存储使用</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deploymentReport.summary.usedStorage}</div>
                <p className="text-xs text-muted-foreground">总容量 {deploymentReport.summary.totalStorage}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均稳定性</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{deploymentReport.summary.averageUptime}%</div>
                <p className="text-xs text-muted-foreground">系统运行时间</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">部署状态</CardTitle>
                <Rocket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">就绪</div>
                <p className="text-xs text-muted-foreground">可以开始部署</p>
              </CardContent>
            </Card>
          </div>

          {/* 系统架构图 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="mr-2 h-5 w-5" />
                YanYu Cloud³ 系统架构
              </CardTitle>
              <CardDescription>本地服务器集群拓扑和服务分布</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 核心服务器 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-center">核心服务器</h3>
                  <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="text-center">
                      <Server className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="font-medium">铁威马 F4-423 NAS</div>
                      <div className="text-sm text-muted-foreground">主服务器</div>
                      <div className="mt-2 space-y-1 text-xs">
                        <div>• Git 仓库服务</div>
                        <div>• Docker 容器引擎</div>
                        <div>• 数据备份中心</div>
                        <div>• 监控和日志</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 开发设备 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-center">开发设备</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 mr-2 text-gray-600" />
                        <div>
                          <div className="font-medium text-sm">MacBook Pro M4 Max</div>
                          <div className="text-xs text-muted-foreground">主开发机</div>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center">
                        <Monitor className="h-5 w-5 mr-2 text-gray-600" />
                        <div>
                          <div className="font-medium text-sm">iMac M4</div>
                          <div className="text-xs text-muted-foreground">协作开发</div>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center">
                        <Monitor className="h-5 w-5 mr-2 text-gray-600" />
                        <div>
                          <div className="font-medium text-sm">iMac M1</div>
                          <div className="text-xs text-muted-foreground">测试环境</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 云服务集成 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-center">云服务集成</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3 bg-green-50">
                      <div className="flex items-center">
                        <Rocket className="h-5 w-5 mr-2 text-green-600" />
                        <div>
                          <div className="font-medium text-sm">Vercel</div>
                          <div className="text-xs text-muted-foreground">应用部署</div>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3 bg-purple-50">
                      <div className="flex items-center">
                        <GitBranch className="h-5 w-5 mr-2 text-purple-600" />
                        <div>
                          <div className="font-medium text-sm">GitHub</div>
                          <div className="text-xs text-muted-foreground">代码托管</div>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3 bg-blue-50">
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 mr-2 text-blue-600" />
                        <div>
                          <div className="font-medium text-sm">阿里云/腾讯云</div>
                          <div className="text-xs text-muted-foreground">CDN 加速</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 建议和问题 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 优化建议 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  优化建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deploymentReport.recommendations.length > 0 ? (
                    deploymentReport.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{recommendation}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">系统运行良好，暂无优化建议</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 问题警告 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  问题警告
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deploymentReport.issues.length > 0 ? (
                    deploymentReport.issues.map((issue, index) => (
                      <Alert key={index} className="border-red-200">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{issue}</AlertDescription>
                      </Alert>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">系统运行正常，无严重问题</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 设备管理 */}
        <TabsContent value="servers" className="space-y-6">
          <div className="grid gap-6">
            {servers.map((server) => (
              <Card key={server.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getServerIcon(server.type)}
                      <div>
                        <CardTitle className="text-lg">{server.name}</CardTitle>
                        <CardDescription>{server.model}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(server.status)}
                      {getHealthBadge(server)}
                      <Badge variant="outline">{server.role}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 基本信息 */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">基本信息</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">位置:</span>
                          <span>{server.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IP:</span>
                          <span className="font-mono">{server.ipAddress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">稳定性:</span>
                          <span className="font-semibold">{server.uptime.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* 硬件规格 */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">硬件规格</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <Cpu className="h-3 w-3 mr-1" />
                          <span className="text-muted-foreground">CPU:</span>
                        </div>
                        <p className="text-xs ml-4">{server.specs.cpu}</p>
                        <div className="flex items-center">
                          <MemoryStick className="h-3 w-3 mr-1" />
                          <span className="text-muted-foreground">内存:</span>
                        </div>
                        <p className="text-xs ml-4">{server.specs.memory}</p>
                      </div>
                    </div>

                    {/* 存储状态 */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">存储状态</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">已用:</span>
                          <span>{formatStorageSize(server.diskUsage.used)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">总计:</span>
                          <span>{formatStorageSize(server.diskUsage.total)}</span>
                        </div>
                        <Progress value={calculateStorageUsage(server.diskUsage)} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          使用率: {calculateStorageUsage(server.diskUsage)}%
                        </p>
                      </div>
                    </div>

                    {/* 服务状态 */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">运行服务</h4>
                      <div className="space-y-1">
                        {server.services.length > 0 ? (
                          server.services.map((service) => (
                            <div key={service.id} className="flex items-center justify-between text-sm">
                              <span>{service.name}</span>
                              <Badge
                                variant="outline"
                                className={
                                  service.status === "running"
                                    ? "bg-green-50 text-green-700"
                                    : service.status === "stopped"
                                      ? "bg-red-50 text-red-700"
                                      : "bg-yellow-50 text-yellow-700"
                                }
                              >
                                {service.status === "running"
                                  ? "运行中"
                                  : service.status === "stopped"
                                    ? "已停止"
                                    : service.status === "error"
                                      ? "错误"
                                      : "启动中"}
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">无运行服务</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 温度和网络统计 */}
                  {(server.temperature || server.networkStats.bytesIn > 0) && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {server.temperature && (
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-orange-500" />
                            <span className="text-sm">温度: {server.temperature}°C</span>
                            {server.temperature > 60 && <Badge className="bg-red-100 text-red-800">过热</Badge>}
                          </div>
                        )}
                        {server.networkStats.bytesIn > 0 && (
                          <div className="flex items-center space-x-2">
                            <Network className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">
                              网络: ↓{formatStorageSize(server.networkStats.bytesIn)} ↑
                              {formatStorageSize(server.networkStats.bytesOut)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 部署指南 */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 步骤列表 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  部署步骤
                </CardTitle>
                <CardDescription>教科书级构建流程</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {guideSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedStep === step.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedStep(step.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(step.category)}
                          <span className="font-medium text-sm">{step.title}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">步骤 {index + 1}</div>
                      </div>
                      <div className="mt-1 flex items-center space-x-2">
                        {getDifficultyBadge(step.difficulty)}
                        <span className="text-xs text-muted-foreground">{step.estimatedTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 详细指导 */}
            <div className="lg:col-span-2">
              {selectedStep && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          {getCategoryIcon(guideSteps.find((s) => s.id === selectedStep)?.category || "setup")}
                          <span className="ml-2">{guideSteps.find((s) => s.id === selectedStep)?.title}</span>
                        </CardTitle>
                        <CardDescription>{guideSteps.find((s) => s.id === selectedStep)?.description}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getDifficultyBadge(guideSteps.find((s) => s.id === selectedStep)?.difficulty || "beginner")}
                        <Badge variant="outline">{guideSteps.find((s) => s.id === selectedStep)?.estimatedTime}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const step = guideSteps.find((s) => s.id === selectedStep)
                      if (!step) return null

                      return (
                        <div className="space-y-6">
                          {/* 前置条件 */}
                          {step.prerequisites.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2 flex items-center">
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                前置条件
                              </h4>
                              <ul className="space-y-1">
                                {step.prerequisites.map((prereq, index) => (
                                  <li key={index} className="text-sm flex items-center">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                                    {prereq}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* 操作指导 */}
                          <div>
                            <h4 className="font-medium mb-3 flex items-center">
                              <Terminal className="mr-2 h-4 w-4 text-blue-500" />
                              操作指导
                            </h4>
                            <div className="space-y-4">
                              {step.instructions.map((instruction, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium">{instruction.title}</h5>
                                    {instruction.platform && (
                                      <Badge variant="outline" className="text-xs">
                                        {instruction.platform === "mac"
                                          ? "macOS"
                                          : instruction.platform === "nas"
                                            ? "NAS"
                                            : "通用"}
                                      </Badge>
                                    )}
                                  </div>

                                  {instruction.type === "command" && (
                                    <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                                      <pre>{instruction.content}</pre>
                                    </div>
                                  )}

                                  {instruction.type === "config" && (
                                    <div className="bg-blue-50 p-3 rounded-md">
                                      <pre className="text-sm whitespace-pre-wrap">{instruction.content}</pre>
                                    </div>
                                  )}

                                  {instruction.type === "ui" && (
                                    <div className="bg-green-50 p-3 rounded-md">
                                      <p className="text-sm">{instruction.content}</p>
                                    </div>
                                  )}

                                  {instruction.notes && instruction.notes.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs font-medium text-blue-600 mb-1">💡 提示:</p>
                                      <ul className="space-y-1">
                                        {instruction.notes.map((note, noteIndex) => (
                                          <li key={noteIndex} className="text-xs text-blue-600">
                                            • {note}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {instruction.warnings && instruction.warnings.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs font-medium text-red-600 mb-1">⚠️ 警告:</p>
                                      <ul className="space-y-1">
                                        {instruction.warnings.map((warning, warningIndex) => (
                                          <li key={warningIndex} className="text-xs text-red-600">
                                            • {warning}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 验证步骤 */}
                          {step.verification.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2 flex items-center">
                                <Shield className="mr-2 h-4 w-4 text-green-500" />
                                验证步骤
                              </h4>
                              <div className="space-y-2">
                                {step.verification.map((verify, index) => (
                                  <div key={index} className="flex items-start space-x-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p>{verify.description}</p>
                                      {verify.command && (
                                        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                          {verify.command}
                                        </code>
                                      )}
                                      {verify.expectedOutput && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          预期输出: {verify.expectedOutput}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 故障排除 */}
                          {step.troubleshooting.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2 flex items-center">
                                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                                故障排除
                              </h4>
                              <div className="space-y-3">
                                {step.troubleshooting.map((trouble, index) => (
                                  <div key={index} className="border border-yellow-200 rounded-lg p-3 bg-yellow-50">
                                    <h5 className="font-medium text-yellow-800 mb-2">{trouble.problem}</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <p className="font-medium text-yellow-700 mb-1">症状:</p>
                                        <ul className="space-y-1">
                                          {trouble.symptoms.map((symptom, sIndex) => (
                                            <li key={sIndex} className="text-yellow-600">
                                              • {symptom}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <p className="font-medium text-yellow-700 mb-1">解决方案:</p>
                                        <ul className="space-y-1">
                                          {trouble.solutions.map((solution, sIndex) => (
                                            <li key={sIndex} className="text-yellow-600">
                                              • {solution}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* 自动化流程 */}
        <TabsContent value="pipelines" className="space-y-6">
          <div className="grid gap-6">
            {pipelines.map((pipeline) => (
              <Card key={pipeline.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Rocket className="mr-2 h-5 w-5" />
                        {pipeline.name}
                      </CardTitle>
                      <CardDescription>{pipeline.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={
                          pipeline.status === "idle"
                            ? "bg-gray-100 text-gray-800"
                            : pipeline.status === "running"
                              ? "bg-blue-100 text-blue-800"
                              : pipeline.status === "success"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }
                      >
                        {pipeline.status === "idle"
                          ? "空闲"
                          : pipeline.status === "running"
                            ? "运行中"
                            : pipeline.status === "success"
                              ? "成功"
                              : "失败"}
                      </Badge>
                      <Badge variant="outline">{pipeline.type === "hybrid" ? "混合部署" : "本地部署"}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 流程步骤 */}
                    <div>
                      <h4 className="font-medium mb-3">部署流程</h4>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                        {pipeline.stages.map((stage, index) => (
                          <div key={stage.id} className="relative">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                              </div>
                              {index < pipeline.stages.length - 1 && (
                                <div className="hidden md:block flex-1 h-0.5 bg-gray-200 ml-2"></div>
                              )}
                            </div>
                            <div className="mt-2">
                              <p className="text-sm font-medium">{stage.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {stage.type === "build"
                                  ? "构建"
                                  : stage.type === "test"
                                    ? "测试"
                                    : stage.type === "deploy"
                                      ? "部署"
                                      : stage.type === "verify"
                                        ? "验证"
                                        : "回滚"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 触发器配置 */}
                    <div>
                      <h4 className="font-medium mb-2">触发器</h4>
                      <div className="flex flex-wrap gap-2">
                        {pipeline.triggers.map((trigger, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className={trigger.enabled ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}
                          >
                            {trigger.type === "git_push"
                              ? "Git 推送"
                              : trigger.type === "schedule"
                                ? "定时执行"
                                : trigger.type === "manual"
                                  ? "手动触发"
                                  : "Webhook"}
                            {trigger.enabled ? " ✓" : " ✗"}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center space-x-2 pt-2 border-t">
                      <Button size="sm" disabled={pipeline.status === "running"}>
                        <Rocket className="mr-2 h-4 w-4" />
                        {pipeline.status === "running" ? "运行中..." : "立即执行"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        配置
                      </Button>
                      <Button variant="outline" size="sm">
                        <Activity className="mr-2 h-4 w-4" />
                        查看日志
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 监控中心 */}
        <TabsContent value="monitoring" className="space-y-6">
          {/* 实时监控指标 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU 使用率</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23%</div>
                <Progress value={23} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">平均负载: 0.8</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">内存使用</CardTitle>
                <MemoryStick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45%</div>
                <Progress value={45} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">6.2GB / 13.8GB</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">网络流量</CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">125MB/s</div>
                <p className="text-xs text-muted-foreground">↓ 89MB/s ↑ 36MB/s</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活跃连接</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">WebSocket: 23</p>
              </CardContent>
            </Card>
          </div>

          {/* 服务状态监控 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                服务状态监控
              </CardTitle>
              <CardDescription>实时监控各项服务的运行状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Git 服务器", status: "running", uptime: "99.9%", response: "12ms" },
                  { name: "Docker 引擎", status: "running", uptime: "99.8%", response: "8ms" },
                  { name: "Vercel 部署", status: "running", uptime: "99.9%", response: "245ms" },
                  { name: "GitHub 同步", status: "running", uptime: "99.7%", response: "156ms" },
                  { name: "监控系统", status: "running", uptime: "100%", response: "5ms" },
                  { name: "备份服务", status: "running", uptime: "99.5%", response: "23ms" },
                ].map((service, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{service.name}</span>
                      <Badge className="bg-green-100 text-green-800">正常</Badge>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">稳定性:</span>
                        <span>{service.uptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">响应时间:</span>
                        <span>{service.response}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 部署历史 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GitBranch className="mr-2 h-5 w-5" />
                最近部署记录
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    id: 1,
                    commit: "feat: 完善部署指导引擎功能",
                    time: "2小时前",
                    status: "success",
                    duration: "3m 45s",
                    author: "开发者",
                  },
                  {
                    id: 2,
                    commit: "fix: 修复服务器监控显示问题",
                    time: "6小时前",
                    status: "success",
                    duration: "2m 12s",
                    author: "开发者",
                  },
                  {
                    id: 3,
                    commit: "update: 更新依赖包和安全补丁",
                    time: "1天前",
                    status: "success",
                    duration: "4m 33s",
                    author: "系统",
                  },
                ].map((deploy) => (
                  <div key={deploy.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-medium text-sm">{deploy.commit}</p>
                        <p className="text-xs text-muted-foreground">
                          {deploy.author} • {deploy.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">成功</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{deploy.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
