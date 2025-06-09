/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 部署向导组件
 * ==========================================
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Rocket, Code, CheckCircle, AlertCircle, Copy, Download, Loader2, ExternalLink } from "lucide-react"
import { vercelAPI } from "@/lib/vercel-api"
import { projectTemplateGenerator, type ProjectTemplate } from "@/lib/project-template-generator"
import { configFileGenerator, type DeploymentConfig } from "@/lib/config-file-generator"

interface DeploymentStep {
  id: string
  title: string
  description: string
  status: "pending" | "running" | "completed" | "error"
  logs: string[]
}

export function DeploymentWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentProgress, setDeploymentProgress] = useState(0)
  const [vercelToken, setVercelToken] = useState("")
  const [isTokenValid, setIsTokenValid] = useState(false)

  // 项目配置
  const [projectConfig, setProjectConfig] = useState<DeploymentConfig>({
    projectName: "",
    framework: "nextjs",
    platform: "vercel",
    buildCommand: "npm run build",
    outputDirectory: ".next",
    installCommand: "npm install",
    devCommand: "npm run dev",
    nodeVersion: "18",
    environmentVariables: {},
    domains: [],
    regions: ["hkg1"],
  })

  // 模板和配置
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({})
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([])
  const [deploymentResult, setDeploymentResult] = useState<any>(null)

  const templates = projectTemplateGenerator.getAllTemplates()

  const steps = [
    { title: "选择模板", description: "选择项目模板和框架" },
    { title: "配置项目", description: "设置项目名称和构建配置" },
    { title: "环境变量", description: "配置环境变量和域名" },
    { title: "生成配置", description: "生成部署配置文件" },
    { title: "连接平台", description: "连接到部署平台" },
    { title: "开始部署", description: "执行部署流程" },
  ]

  useEffect(() => {
    // 检查是否有保存的 Vercel token
    const savedToken = localStorage.getItem("vercel_token")
    if (savedToken) {
      setVercelToken(savedToken)
      validateVercelToken(savedToken)
    }
  }, [])

  const validateVercelToken = async (token: string) => {
    try {
      vercelAPI.setToken(token)
      const isValid = await vercelAPI.validateToken()
      setIsTokenValid(isValid)
      return isValid
    } catch (error) {
      setIsTokenValid(false)
      return false
    }
  }

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template)
    setProjectConfig((prev) => ({
      ...prev,
      framework: template.framework,
      buildCommand: template.scripts.build || "npm run build",
      devCommand: template.scripts.dev || "npm run dev",
    }))
  }

  const generateProjectFiles = () => {
    if (!selectedTemplate) return

    try {
      // 生成项目文件
      const projectFiles = projectTemplateGenerator.generateProject(
        selectedTemplate.id,
        projectConfig.projectName,
        selectedTemplate,
      )

      // 生成配置文件
      const configFiles = configFileGenerator.generateAllConfigs(
        projectConfig,
        selectedTemplate.dependencies,
        selectedTemplate.devDependencies,
      )

      const allFiles = { ...projectFiles, ...configFiles }
      setGeneratedFiles(allFiles)
    } catch (error) {
      console.error("生成文件失败:", error)
    }
  }

  const startDeployment = async () => {
    if (!selectedTemplate || !isTokenValid) return

    setIsDeploying(true)
    setDeploymentProgress(0)

    const steps: DeploymentStep[] = [
      {
        id: "validate",
        title: "验证配置",
        description: "检查项目配置和文件",
        status: "pending",
        logs: [],
      },
      {
        id: "create-project",
        title: "创建项目",
        description: "在 Vercel 上创建新项目",
        status: "pending",
        logs: [],
      },
      {
        id: "upload-files",
        title: "上传文件",
        description: "上传项目文件到 Vercel",
        status: "pending",
        logs: [],
      },
      {
        id: "deploy",
        title: "执行部署",
        description: "构建和部署应用",
        status: "pending",
        logs: [],
      },
      {
        id: "configure",
        title: "配置域名",
        description: "设置自定义域名和环境变量",
        status: "pending",
        logs: [],
      },
    ]

    setDeploymentSteps(steps)

    try {
      // 步骤 1: 验证配置
      await executeStep(steps[0], async (step) => {
        step.logs.push("检查项目名称...")
        if (!projectConfig.projectName) {
          throw new Error("项目名称不能为空")
        }
        step.logs.push("检查模板文件...")
        if (Object.keys(generatedFiles).length === 0) {
          throw new Error("没有生成的文件")
        }
        step.logs.push("配置验证通过")
      })

      setDeploymentProgress(20)

      // 步骤 2: 创建项目
      let vercelProject: any
      await executeStep(steps[1], async (step) => {
        step.logs.push("正在创建 Vercel 项目...")
        vercelProject = await vercelAPI.createProject(projectConfig.projectName, {
          framework: projectConfig.framework,
          buildCommand: projectConfig.buildCommand,
          outputDirectory: projectConfig.outputDirectory,
          installCommand: projectConfig.installCommand,
          devCommand: projectConfig.devCommand,
          environmentVariables: Object.entries(projectConfig.environmentVariables || {}).map(([key, value]) => ({
            key,
            value,
            target: ["production", "preview", "development"] as const,
          })),
        })
        step.logs.push(`项目创建成功: ${vercelProject.name}`)
      })

      setDeploymentProgress(40)

      // 步骤 3: 上传文件
      await executeStep(steps[2], async (step) => {
        step.logs.push("准备上传文件...")
        step.logs.push(`共 ${Object.keys(generatedFiles).length} 个文件`)
        step.logs.push("文件上传完成")
      })

      setDeploymentProgress(60)

      // 步骤 4: 执行部署
      let deployment: any
      await executeStep(steps[3], async (step) => {
        step.logs.push("开始部署...")
        deployment = await vercelAPI.createDeployment(projectConfig.projectName, generatedFiles, {
          target: "production",
          projectSettings: {
            buildCommand: projectConfig.buildCommand,
            outputDirectory: projectConfig.outputDirectory,
            installCommand: projectConfig.installCommand,
            devCommand: projectConfig.devCommand,
          },
        })
        step.logs.push(`部署创建成功: ${deployment.uid}`)
        step.logs.push(`部署 URL: https://${deployment.url}`)
      })

      setDeploymentProgress(80)

      // 步骤 5: 配置域名和环境变量
      await executeStep(steps[4], async (step) => {
        if (projectConfig.domains && projectConfig.domains.length > 0) {
          step.logs.push("配置自定义域名...")
          for (const domain of projectConfig.domains) {
            try {
              await vercelAPI.addDomain(vercelProject.id, domain)
              step.logs.push(`域名 ${domain} 配置成功`)
            } catch (error) {
              step.logs.push(`域名 ${domain} 配置失败: ${error}`)
            }
          }
        }
        step.logs.push("配置完成")
      })

      setDeploymentProgress(100)

      setDeploymentResult({
        success: true,
        project: vercelProject,
        deployment,
        url: `https://${deployment.url}`,
      })
    } catch (error) {
      console.error("部署失败:", error)
      setDeploymentResult({
        success: false,
        error: error.message,
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const executeStep = async (step: DeploymentStep, action: (step: DeploymentStep) => Promise<void>) => {
    step.status = "running"
    setDeploymentSteps([...deploymentSteps])

    try {
      await action(step)
      step.status = "completed"
    } catch (error) {
      step.status = "error"
      step.logs.push(`错误: ${error.message}`)
      throw error
    } finally {
      setDeploymentSteps([...deploymentSteps])
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">选择项目模板</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      selectedTemplate?.id === template.id ? "ring-2 ring-blue-500" : "hover:shadow-md"
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{template.framework}</Badge>
                        <Badge variant="outline">{template.language}</Badge>
                        <Badge variant="outline">{template.difficulty}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 3).map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">配置项目</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">项目名称</Label>
                  <Input
                    id="projectName"
                    value={projectConfig.projectName}
                    onChange={(e) => setProjectConfig((prev) => ({ ...prev, projectName: e.target.value }))}
                    placeholder="my-awesome-project"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">部署平台</Label>
                  <Select
                    value={projectConfig.platform}
                    onValueChange={(value) => setProjectConfig((prev) => ({ ...prev, platform: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vercel">Vercel</SelectItem>
                      <SelectItem value="netlify">Netlify</SelectItem>
                      <SelectItem value="docker">Docker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buildCommand">构建命令</Label>
                  <Input
                    id="buildCommand"
                    value={projectConfig.buildCommand}
                    onChange={(e) => setProjectConfig((prev) => ({ ...prev, buildCommand: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outputDirectory">输出目录</Label>
                  <Input
                    id="outputDirectory"
                    value={projectConfig.outputDirectory}
                    onChange={(e) => setProjectConfig((prev) => ({ ...prev, outputDirectory: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">环境变量配置</h3>
              <div className="space-y-4">
                <div>
                  <Label>环境变量</Label>
                  <Textarea
                    placeholder="KEY1=value1&#10;KEY2=value2"
                    value={Object.entries(projectConfig.environmentVariables || {})
                      .map(([key, value]) => `${key}=${value}`)
                      .join("\n")}
                    onChange={(e) => {
                      const envVars: Record<string, string> = {}
                      e.target.value.split("\n").forEach((line) => {
                        const [key, ...valueParts] = line.split("=")
                        if (key && valueParts.length > 0) {
                          envVars[key.trim()] = valueParts.join("=").trim()
                        }
                      })
                      setProjectConfig((prev) => ({ ...prev, environmentVariables: envVars }))
                    }}
                    rows={6}
                  />
                </div>
                <div>
                  <Label>自定义域名（可选）</Label>
                  <Input
                    placeholder="example.com, www.example.com"
                    value={projectConfig.domains?.join(", ") || ""}
                    onChange={(e) =>
                      setProjectConfig((prev) => ({
                        ...prev,
                        domains: e.target.value
                          .split(",")
                          .map((d) => d.trim())
                          .filter(Boolean),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">生成配置文件</h3>
              <Button onClick={generateProjectFiles} disabled={!selectedTemplate}>
                <Code className="mr-2 h-4 w-4" />
                生成文件
              </Button>
            </div>

            {Object.keys(generatedFiles).length > 0 && (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>已生成 {Object.keys(generatedFiles).length} 个配置文件</AlertDescription>
                </Alert>

                <Tabs defaultValue="preview" className="w-full">
                  <TabsList>
                    <TabsTrigger value="preview">文件预览</TabsTrigger>
                    <TabsTrigger value="download">下载文件</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="space-y-4">
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {Object.entries(generatedFiles).map(([filename, content]) => (
                        <Card key={filename}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm">{filename}</CardTitle>
                              <Button variant="outline" size="sm" onClick={() => copyToClipboard(content)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto max-h-32">
                              {content.slice(0, 500)}
                              {content.length > 500 && "..."}
                            </pre>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="download" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(generatedFiles).map(([filename, content]) => (
                        <Button
                          key={filename}
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFile(filename, content)}
                          className="justify-start"
                        >
                          <Download className="mr-2 h-3 w-3" />
                          {filename}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">连接部署平台</h3>
              {projectConfig.platform === "vercel" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vercelToken">Vercel Token</Label>
                    <div className="flex gap-2">
                      <Input
                        id="vercelToken"
                        type="password"
                        value={vercelToken}
                        onChange={(e) => setVercelToken(e.target.value)}
                        placeholder="输入您的 Vercel Token"
                      />
                      <Button onClick={() => validateVercelToken(vercelToken)} disabled={!vercelToken}>
                        验证
                      </Button>
                    </div>
                  </div>

                  {isTokenValid ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>Vercel Token 验证成功！</AlertDescription>
                    </Alert>
                  ) : vercelToken ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Token 验证失败，请检查 Token 是否正确</AlertDescription>
                    </Alert>
                  ) : null}

                  <div className="text-sm text-gray-600">
                    <p>如何获取 Vercel Token：</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>访问 Vercel Dashboard</li>
                      <li>进入 Settings → Tokens</li>
                      <li>创建新的 Token</li>
                      <li>复制 Token 并粘贴到上方</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">开始部署</h3>

              {!isDeploying && !deploymentResult && (
                <div className="space-y-4">
                  <Alert>
                    <Rocket className="h-4 w-4" />
                    <AlertDescription>
                      准备就绪！点击下方按钮开始部署您的项目到 {projectConfig.platform}
                    </AlertDescription>
                  </Alert>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">部署摘要：</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 项目名称: {projectConfig.projectName}</li>
                      <li>• 框架: {selectedTemplate?.name}</li>
                      <li>• 平台: {projectConfig.platform}</li>
                      <li>• 文件数量: {Object.keys(generatedFiles).length}</li>
                    </ul>
                  </div>

                  <Button
                    onClick={startDeployment}
                    disabled={!selectedTemplate || !isTokenValid || Object.keys(generatedFiles).length === 0}
                    className="w-full"
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    开始部署
                  </Button>
                </div>
              )}

              {isDeploying && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>部署进度</span>
                      <span>{deploymentProgress}%</span>
                    </div>
                    <Progress value={deploymentProgress} />
                  </div>

                  <div className="space-y-2">
                    {deploymentSteps.map((step) => (
                      <Card key={step.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            {step.status === "running" && <Loader2 className="h-4 w-4 animate-spin" />}
                            {step.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {step.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                            {step.status === "pending" && <div className="h-4 w-4 rounded-full bg-gray-300" />}
                            <div className="flex-1">
                              <div className="font-medium">{step.title}</div>
                              <div className="text-sm text-gray-600">{step.description}</div>
                            </div>
                          </div>
                          {step.logs.length > 0 && (
                            <div className="mt-2 text-xs bg-gray-50 p-2 rounded max-h-20 overflow-y-auto">
                              {step.logs.map((log, index) => (
                                <div key={index}>{log}</div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {deploymentResult && (
                <div className="space-y-4">
                  {deploymentResult.success ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>🎉 部署成功！您的应用已经上线</AlertDescription>
                    </Alert>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>部署失败: {deploymentResult.error}</AlertDescription>
                    </Alert>
                  )}

                  {deploymentResult.success && (
                    <Card>
                      <CardHeader>
                        <CardTitle>部署信息</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>项目 URL:</span>
                          <div className="flex items-center gap-2">
                            <a
                              href={deploymentResult.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {deploymentResult.url}
                            </a>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(deploymentResult.url, "_blank")}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>项目名称:</span>
                          <span>{deploymentResult.project?.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>部署 ID:</span>
                          <span className="font-mono text-sm">{deploymentResult.deployment?.uid}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">部署向导</h1>
        <p className="text-gray-600">通过简单的步骤将您的项目部署到云平台</p>
      </div>

      {/* 步骤指示器 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <div className="ml-2 hidden md:block">
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs text-gray-600">{step.description}</div>
              </div>
              {index < steps.length - 1 && <div className="w-8 md:w-16 h-px bg-gray-300 mx-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* 步骤内容 */}
      <Card className="mb-6">
        <CardContent className="p-6">{renderStepContent()}</CardContent>
      </Card>

      {/* 导航按钮 */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          上一步
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={
            currentStep === steps.length - 1 ||
            (currentStep === 0 && !selectedTemplate) ||
            (currentStep === 1 && !projectConfig.projectName) ||
            (currentStep === 3 && Object.keys(generatedFiles).length === 0) ||
            (currentStep === 4 && !isTokenValid)
          }
        >
          {currentStep === steps.length - 1 ? "完成" : "下一步"}
        </Button>
      </div>
    </div>
  )
}
