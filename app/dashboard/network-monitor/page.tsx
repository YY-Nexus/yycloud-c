"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Rocket,
  Globe,
  Settings,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Target,
  Code,
  Shield,
  Monitor,
  ArrowRight,
} from "lucide-react"

// 模拟的部署平台数据
const deploymentPlatforms = [
  {
    id: "vercel",
    name: "Vercel",
    icon: "🚀",
    description: "最适合 Next.js 应用的部署平台",
    score: 95,
    features: ["自动部署", "全球CDN", "无服务器函数", "域名管理"],
    pricing: "免费额度充足",
    difficulty: "简单",
    recommended: true,
  },
  {
    id: "netlify",
    name: "Netlify",
    icon: "🌐",
    description: "静态网站和JAMstack应用的理想选择",
    score: 88,
    features: ["静态托管", "表单处理", "身份验证", "A/B测试"],
    pricing: "免费计划可用",
    difficulty: "简单",
  },
  {
    id: "aws",
    name: "AWS",
    icon: "☁️",
    description: "企业级云服务，功能最全面",
    score: 92,
    features: ["EC2实例", "S3存储", "RDS数据库", "CloudFront"],
    pricing: "按使用付费",
    difficulty: "复杂",
  },
  {
    id: "docker",
    name: "Docker + VPS",
    icon: "🐳",
    description: "容器化部署，灵活可控",
    score: 85,
    features: ["容器化", "可移植性", "版本控制", "资源隔离"],
    pricing: "VPS费用",
    difficulty: "中等",
  },
]

const deploymentSteps = {
  vercel: [
    { step: 1, title: "连接Git仓库", description: "将代码推送到GitHub/GitLab", status: "completed" },
    { step: 2, title: "导入项目", description: "在Vercel中导入Git仓库", status: "completed" },
    { step: 3, title: "配置构建", description: "设置构建命令和环境变量", status: "current" },
    { step: 4, title: "部署应用", description: "自动构建和部署", status: "pending" },
    { step: 5, title: "配置域名", description: "设置自定义域名", status: "pending" },
  ],
}

export default function DeploymentGuidePage() {
  const [selectedPlatform, setSelectedPlatform] = useState("vercel")
  const [projectType, setProjectType] = useState("nextjs")
  const [deploymentStage, setDeploymentStage] = useState("planning")

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "current":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">部署指导引擎</h1>
          <p className="text-muted-foreground mt-2">智能化部署指导系统 - 原网络监控模块重构升级</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          Beta 版本
        </Badge>
      </div>

      <Tabs defaultValue="platforms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platforms">平台推荐</TabsTrigger>
          <TabsTrigger value="guide">部署指南</TabsTrigger>
          <TabsTrigger value="monitoring">部署监控</TabsTrigger>
          <TabsTrigger value="optimization">性能优化</TabsTrigger>
        </TabsList>

        {/* 平台推荐标签页 */}
        <TabsContent value="platforms" className="space-y-6">
          {/* 项目分析 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                项目分析
              </CardTitle>
              <CardDescription>基于您的项目特征推荐最适合的部署平台</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="project-type">项目类型</Label>
                  <Input id="project-type" value="Next.js 应用" readOnly className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="project-size">项目规模</Label>
                  <Input id="project-size" value="中型项目" readOnly className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="traffic">预期流量</Label>
                  <Input id="traffic" value="中等流量" readOnly className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 平台推荐 */}
          <div className="grid gap-4">
            {deploymentPlatforms.map((platform) => (
              <Card
                key={platform.id}
                className={`cursor-pointer transition-all ${
                  selectedPlatform === platform.id ? "ring-2 ring-blue-500" : ""
                } ${platform.recommended ? "border-green-500" : ""}`}
                onClick={() => setSelectedPlatform(platform.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{platform.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold">{platform.name}</h3>
                          {platform.recommended && <Badge className="bg-green-100 text-green-800">推荐</Badge>}
                        </div>
                        <p className="text-muted-foreground mt-1">{platform.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-sm font-medium">匹配度</p>
                            <div className="flex items-center space-x-2">
                              <div className="text-lg font-bold text-green-600">{platform.score}%</div>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">难度</p>
                            <Badge
                              variant="outline"
                              className={
                                platform.difficulty === "简单"
                                  ? "bg-green-50 text-green-700"
                                  : platform.difficulty === "中等"
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "bg-red-50 text-red-700"
                              }
                            >
                              {platform.difficulty}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium">定价</p>
                            <p className="text-sm text-muted-foreground">{platform.pricing}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">特性</p>
                            <p className="text-sm text-muted-foreground">{platform.features.length} 项</p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">主要特性:</p>
                          <div className="flex flex-wrap gap-1">
                            {platform.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant={selectedPlatform === platform.id ? "default" : "outline"} size="sm">
                      {selectedPlatform === platform.id ? "已选择" : "选择"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 部署指南标签页 */}
        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Rocket className="mr-2 h-5 w-5" />
                {deploymentPlatforms.find((p) => p.id === selectedPlatform)?.name} 部署指南
              </CardTitle>
              <CardDescription>详细的分步部署指导，确保顺利完成部署</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deploymentSteps.vercel.map((step, index) => (
                  <div key={step.step} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">{getStepIcon(step.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">
                          步骤 {step.step}: {step.title}
                        </h4>
                        {step.status === "current" && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            进行中
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>

                      {step.status === "current" && (
                        <div className="mt-3 p-4 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-blue-800 mb-2">详细说明:</h5>
                          <div className="space-y-2 text-sm text-blue-700">
                            <p>• 在项目根目录创建 vercel.json 配置文件</p>
                            <p>• 设置环境变量: NEXT_PUBLIC_API_URL</p>
                            <p>• 配置构建命令: npm run build</p>
                            <p>• 设置输出目录: .next</p>
                          </div>
                          <Button size="sm" className="mt-3">
                            <Code className="mr-2 h-4 w-4" />
                            查看配置示例
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 配置检查 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                配置检查
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">package.json 配置</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">环境变量设置</span>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">构建脚本</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">域名配置</span>
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSL证书</span>
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CDN配置</span>
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 部署监控标签页 */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">部署状态</CardTitle>
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg font-semibold">运行中</span>
                </div>
                <p className="text-xs text-muted-foreground">最后部署: 2小时前</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">响应时间</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245ms</div>
                <p className="text-xs text-muted-foreground">全球平均</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">可用性</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <p className="text-xs text-muted-foreground">过去30天</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">流量</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2K</div>
                <p className="text-xs text-muted-foreground">今日访问</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>部署历史</CardTitle>
              <CardDescription>最近的部署记录和状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, commit: "feat: 添加网络诊断功能", time: "2小时前", status: "success", duration: "2m 15s" },
                  { id: 2, commit: "fix: 修复移动端样式问题", time: "1天前", status: "success", duration: "1m 45s" },
                  { id: 3, commit: "update: 更新依赖包", time: "2天前", status: "success", duration: "3m 20s" },
                ].map((deploy) => (
                  <div key={deploy.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-medium">{deploy.commit}</p>
                        <p className="text-sm text-muted-foreground">{deploy.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">成功</Badge>
                      <p className="text-sm text-muted-foreground mt-1">{deploy.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 性能优化标签页 */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                性能优化建议
              </CardTitle>
              <CardDescription>基于部署平台特性的优化建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">图片优化</h4>
                      <p className="text-sm text-green-700 mt-1">使用 Next.js Image 组件，自动优化图片格式和大小</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">CDN配置</h4>
                      <p className="text-sm text-blue-700 mt-1">Vercel 自动提供全球 CDN，静态资源已优化</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">代码分割</h4>
                      <p className="text-sm text-yellow-700 mt-1">建议使用动态导入减少初始包大小</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        查看优化指南 <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>性能指标</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">92</div>
                  <p className="text-sm text-muted-foreground">性能评分</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1.2s</div>
                  <p className="text-sm text-muted-foreground">首次内容绘制</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2.1s</div>
                  <p className="text-sm text-muted-foreground">最大内容绘制</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
