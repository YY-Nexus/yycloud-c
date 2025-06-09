"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Wand2,
  Brain,
  Target,
} from "lucide-react"
import { aiWorkflowAssistant } from "@/lib/ai-workflow-assistant"
import { workflowEngine } from "@/lib/workflow-engine"
import type { Workflow } from "@/types/workflow"
import type { AIWorkflowSuggestion, AIWorkflowTemplate } from "@/types/workflow-integrations"

export function AIWorkflowAssistant() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [suggestions, setSuggestions] = useState<AIWorkflowSuggestion[]>([])
  const [templates, setTemplates] = useState<AIWorkflowTemplate[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [templateRequest, setTemplateRequest] = useState({
    description: "",
    category: "",
    requirements: [] as string[]
  })

  useEffect(() => {
    loadWorkflows()
    loadTemplates()
  }, [])

  const loadWorkflows = () => {
    const allWorkflows = workflowEngine.getAllWorkflows()
    setWorkflows(allWorkflows)
  }

  const loadTemplates = async () => {
    // 加载预设模板
    const builtInTemplates = [
      {
        id: "monitoring-template",
        name: "系统监控模板",
        description: "监控系统状态并在异常时发送通知",
        category: "监控",
        useCase: "系统运维监控",
        aiGenerated: false,
        confidence: 1.0,
        triggers: [],
        actions: [],
        variables: [],
        integrations: ["slack", "email"],
        estimatedSetupTime: "15分钟",
        benefits: ["实时监控系统状态", "及时发现和处理异常", "减少系统停机时间"],
        requirements: ["系统监控权限", "通知渠道配置"]
      },
      {
        id: "deployment-template",
        name: "自动部署模板",
        description: "代码提交后自动部署到生产环境",
        category: "开发",
        useCase: "CI/CD自动化",
        aiGenerated: false,
        confidence: 1.0,
        triggers: [],
        actions: [],
        variables: [],
        integrations: ["github", "slack"],
        estimatedSetupTime: "30分钟",
        benefits: ["自动化部署流程", "减少人工错误", "提高部署效率"],
        requirements: ["GitHub仓库访问权限", "部署环境配置", "Slack通知配置"]
      }
    ] as AIWorkflowTemplate[]
    
    setTemplates(builtInTemplates)
  }

  const analyzeWorkflow = async (workflow: Workflow) => {
    setSelectedWorkflow(workflow)
    setIsAnalyzing(true)
    setSuggestions([])

    try {
      const workflowSuggestions = await aiWorkflowAssistant.analyzeWorkflow(workflow)
      setSuggestions(workflowSuggestions)
    } catch (error) {
      console.error("分析工作流失败:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateTemplate = async () => {
    if (!templateRequest.description) return

    setIsGenerating(true)

    try {
      const template = await aiWorkflowAssistant.generateWorkflowTemplate(
        templateRequest.description,
        templateRequest.category,
        templateRequest.requirements
      )
      setTemplates(prev => [template, ...prev])
      setTemplateRequest({ description: "", category: "", requirements: [] })
    } catch (error) {
      console.error("生成模板失败:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const applySuggestion = async (suggestion: AIWorkflowSuggestion) => {
    if (!selectedWorkflow) return

    try {
      // 这里应该实际应用建议到工作流
      console.log("应用建议:", suggestion)
      
      // 重新分析工作流
      await analyzeWorkflow(selectedWorkflow)
    } catch (error) {
      console.error("应用建议失败:", error)
    }
  }

  const getSuggestionIcon = (category: string) => {
    switch (category) {
      case "optimization":
        return <TrendingUp className="h-4 w-4" />
      case "automation":
        return <Zap className="h-4 w-4" />
      case "integration":
        return <Sparkles className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "performance":
        return <Target className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getSuggestionColor = (category: string) => {
    switch (category) {
      case "optimization":
        return "bg-blue-100 text-blue-800"
      case "automation":
        return "bg-purple-100 text-purple-800"
      case "integration":
        return "bg-green-100 text-green-800"
      case "security":
        return "bg-red-100 text-red-800"
      case "performance":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600"
    if (confidence >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="h-6 w-6 mr-2" />
            AI工作流助手
          </h2>
          <p className="text-muted-foreground">智能分析和优化您的工作流</p>
        </div>
      </div>

      <Tabs defaultValue="analyze" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analyze">智能分析</TabsTrigger>
          <TabsTrigger value="templates">模板生成</TabsTrigger>
          <TabsTrigger value="suggestions">优化建议</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>工作流分析</CardTitle>
              <CardDescription>选择一个工作流进行AI智能分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflows.map((workflow) => (
                  <Card 
                    key={workflow.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedWorkflow?.id === workflow.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => analyzeWorkflow(workflow)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{workflow.name}</CardTitle>
                        <Badge variant={workflow.enabled ? "default" : "secondary"}>
                          {workflow.enabled ? "已启用" : "已禁用"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">执行次数</span>
                          <span>{workflow.executionCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">成功率</span>
                          <span>
                            {workflow.executionCount > 0
                              ? ((workflow.successCount / workflow.executionCount) * 100).toFixed(1)
                              : 0}%
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-3"
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing && selectedWorkflow?.id === workflow.id ? (
                          <>
                            <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                            分析中...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            AI分析
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {workflows.length === 0 && (
                  <Card className="col-span-full">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">暂无工作流</h3>
                      <p className="text-muted-foreground text-center">
                        创建工作流后即可使用AI分析功能
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI模板生成</CardTitle>
              <CardDescription>描述您的需求，AI将为您生成定制化工作流模板</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">工作流描述</Label>
                  <Textarea
                    id="description"
                    value={templateRequest.description}
                    onChange={(e) => setTemplateRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="描述您想要创建的工作流，例如：当服务器CPU使用率超过80%时发送告警邮件"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">分类</Label>
                  <Input
                    id="category"
                    value={templateRequest.category}
                    onChange={(e) => setTemplateRequest(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="例如：监控、部署、通知"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">特殊要求（可选）</Label>
                <Input
                  id="requirements"
                  placeholder="输入特殊要求，用逗号分隔"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = e.currentTarget.value.trim()
                      if (value) {
                        setTemplateRequest(prev => ({
                          ...prev,
                          requirements: [...prev.requirements, value]
                        }))
                        e.currentTarget.value = ""
                      }
                    }
                  }}
                />
                {templateRequest.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {templateRequest.requirements.map((req, index) => (
                      <Badge key={index} variant="secondary">
                        {req}
                        <button
                          onClick={() => setTemplateRequest(prev => ({
                            ...prev,
                            requirements: prev.requirements.filter((_, i) => i !== index)
                          }))}
                          className="ml-2 text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                onClick={generateTemplate}
                disabled={!templateRequest.description || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                    AI生成中...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    生成模板
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {template.aiGenerated && (
                        <Badge variant="secondary">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI生成
                        </Badge>
                      )}
                      <Badge className={getConfidenceColor(template.confidence)}>
                        {(template.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">用途</span>
                      <span>{template.useCase}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">预计设置时间</span>
                      <span>{template.estimatedSetupTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">所需集成</span>
                      <span>{template.integrations.join(", ")}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">主要优势</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {template.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button size="sm" className="w-full mt-4">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    使用模板
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          {selectedWorkflow ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    {selectedWorkflow.name} - 优化建议
                </CardTitle>
                <CardDescription>
                  基于AI分析的工作流优化建议
                </CardDescription>
              </CardHeader>
              <CardContent>
                {suggestions.length > 0 ? (
                  <div className="space-y-4">
                    {suggestions.map((suggestion) => (
                      <Card key={suggestion.id} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getSuggestionIcon(suggestion.category)}
                              <CardTitle className="text-base">{suggestion.title}</CardTitle>
                              <Badge className={getSuggestionColor(suggestion.category)}>
                                {suggestion.category}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">置信度</span>
                              <Badge className={getConfidenceColor(suggestion.confidence)}>
                                {(suggestion.confidence * 100).toFixed(0)}%
                              </Badge>
                            </div>
                          </div>
                          <CardDescription>{suggestion.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">预期影响</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>效率</span>
                                    <span>{suggestion.estimatedImpact.efficiency}%</span>
                                  </div>
                                  <Progress value={suggestion.estimatedImpact.efficiency} className="h-2" />
                                </div>
                                <div>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>可靠性</span>
                                    <span>{suggestion.estimatedImpact.reliability}%</span>
                                  </div>
                                  <Progress value={suggestion.estimatedImpact.reliability} className="h-2" />
                                </div>
                                <div>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>成本</span>
                                    <span>{suggestion.estimatedImpact.cost > 0 ? '+' : ''}{suggestion.estimatedImpact.cost}%</span>
                                  </div>
                                  <Progress 
                                    value={Math.abs(suggestion.estimatedImpact.cost)} 
                                    className={`h-2 ${suggestion.estimatedImpact.cost < 0 ? 'text-green-600' : 'text-red-600'}`} 
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium mb-2">建议变更</h4>
                              <div className="space-y-2">
                                {suggestion.suggestedChanges.map((change, index) => (
                                  <div key={index} className="p-3 bg-muted rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <Badge variant="outline">{change.type}</Badge>
                                      <Badge variant="secondary">
                                        {suggestion.implementationComplexity}
                                      </Badge>
                                    </div>
                                    <p className="text-sm mb-2">{change.description}</p>
                                    <p className="text-xs text-muted-foreground">{change.reasoning}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Button 
                              onClick={() => applySuggestion(suggestion)}
                              className="w-full"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              应用建议
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">暂无优化建议</h3>
                    <p className="text-muted-foreground">
                      {isAnalyzing ? "AI正在分析工作流..." : "选择一个工作流进行AI分析"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">请先选择工作流</h3>
                <p className="text-muted-foreground text-center">
                  在"智能分析"标签页中选择一个工作流进行分析
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
