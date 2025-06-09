"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
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
import {
  LineChart,
  BarChart,
  PieChart,
  ResponsiveContainer,
  Line,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  analyzeData,
  getInsights,
  getInsightById,
  updateInsightStatus,
  getNotifications,
  markNotificationAsRead,
  getAIInsightsConfig,
  updateAIInsightsConfig,
} from "@/lib/ai-insights-engine"
import type {
  AIInsight,
  InsightType,
  InsightAnalysisRequest,
  InsightNotification,
  AIInsightConfig,
} from "@/types/ai-insights"
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Target,
  Lightbulb,
  BarChart3,
  PieChartIcon,
  Activity,
  Bell,
  Settings,
  RefreshCw,
  Eye,
  Check,
  Search,
  Calendar,
  Users,
  Zap,
  ChevronRight,
  Download,
  Share,
  Copy,
  Mail,
  MessageSquare,
  FileText,
  FileSpreadsheet,
  Trash2,
  Archive,
  Star,
  Flag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react"

const INSIGHT_TYPE_ICONS = {
  trend: TrendingUp,
  anomaly: AlertTriangle,
  correlation: Activity,
  prediction: Target,
  optimization: Lightbulb,
  pattern: BarChart3,
  comparison: PieChartIcon,
  segmentation: Users,
}

const INSIGHT_TYPE_LABELS = {
  trend: "趋势分析",
  anomaly: "异常检测",
  correlation: "相关性分析",
  prediction: "预测分析",
  optimization: "优化建议",
  pattern: "模式识别",
  comparison: "对比分析",
  segmentation: "分群分析",
}

const SEVERITY_COLORS = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

const SEVERITY_LABELS = {
  low: "低",
  medium: "中",
  high: "高",
  critical: "严重",
}

const STATUS_LABELS = {
  new: "新",
  acknowledged: "已确认",
  resolved: "已处理",
  dismissed: "已忽略",
}

const STATUS_ICONS = {
  new: AlertCircle,
  acknowledged: Clock,
  resolved: CheckCircle,
  dismissed: XCircle,
}

export function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [notifications, setNotifications] = useState<InsightNotification[]>([])
  const [config, setConfig] = useState<AIInsightConfig | null>(null)
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [filters, setFilters] = useState({
    type: "all",
    severity: "all",
    status: "all",
    search: "",
  })
  const [showSettings, setShowSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [shareContent, setShareContent] = useState("")
  const [exportFormat, setExportFormat] = useState("json")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      const allInsights = getInsights()
      const allNotifications = getNotifications()
      const currentConfig = getAIInsightsConfig()

      setInsights(allInsights)
      setNotifications(allNotifications)
      setConfig(currentConfig)
    } catch (error) {
      console.error("加载AI洞察数据失败:", error)
      toast({
        title: "加载失败",
        description: "无法加载AI洞察数据，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    try {
      const request: InsightAnalysisRequest = {
        dataSource: "network_tests",
        metrics: ["download_speed", "upload_speed", "ping", "jitter"],
        timeRange: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          end: new Date(),
        },
        analysisTypes: ["trend", "anomaly", "correlation", "prediction"],
        options: {
          includeVisualization: true,
          includeRecommendations: true,
          minConfidence: 70,
        },
      }

      const result = await analyzeData(request)
      loadData()

      toast({
        title: "分析完成",
        description: `成功生成 ${result.insights.length} 个洞察`,
      })
    } catch (error) {
      console.error("AI分析失败:", error)
      toast({
        title: "分析失败",
        description: "AI分析过程中出现错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleInsightClick = (insight: AIInsight) => {
    setSelectedInsight(insight)
  }

  const handleStatusUpdate = (insightId: string, status: string) => {
    try {
      updateInsightStatus(insightId, status)
      loadData()
      if (selectedInsight?.id === insightId) {
        setSelectedInsight(getInsightById(insightId) || null)
      }

      toast({
        title: "状态已更新",
        description: `洞察状态已更新为：${STATUS_LABELS[status as keyof typeof STATUS_LABELS]}`,
      })
    } catch (error) {
      toast({
        title: "更新失败",
        description: "无法更新洞察状态，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleNotificationRead = (notificationId: string) => {
    try {
      markNotificationAsRead(notificationId)
      loadData()

      toast({
        title: "通知已读",
        description: "通知已标记为已读",
      })
    } catch (error) {
      toast({
        title: "操作失败",
        description: "无法标记通知为已读",
        variant: "destructive",
      })
    }
  }

  const handleMarkAllNotificationsRead = () => {
    try {
      notifications.forEach((notification) => {
        if (!notification.isRead) {
          markNotificationAsRead(notification.id)
        }
      })
      loadData()

      toast({
        title: "全部已读",
        description: "所有通知已标记为已读",
      })
    } catch (error) {
      toast({
        title: "操作失败",
        description: "无法标记所有通知为已读",
        variant: "destructive",
      })
    }
  }

  const handleConfigUpdate = (newConfig: Partial<AIInsightConfig>) => {
    try {
      updateAIInsightsConfig(newConfig)
      setConfig(getAIInsightsConfig())

      toast({
        title: "设置已保存",
        description: "AI洞察配置已成功更新",
      })
    } catch (error) {
      toast({
        title: "保存失败",
        description: "无法保存配置，请稍后重试",
        variant: "destructive",
      })
    }
  }

  // 修复通知按钮点击
  const handleNotificationClick = () => {
    setShowNotifications(true)
  }

  // 修复设置按钮点击
  const handleSettingsClick = () => {
    setShowSettings(true)
  }

  // 修复分享功能
  const handleShare = (insight: AIInsight) => {
    const content = `🧠 AI洞察分享

📊 ${insight.title}
🔍 类型：${INSIGHT_TYPE_LABELS[insight.type]}
⚠️ 严重程度：${SEVERITY_LABELS[insight.severity]}
🎯 置信度：${insight.confidence}%

📝 描述：
${insight.description}

🔍 主要发现：
${insight.findings.map((f, index) => `${index + 1}. ${f.description}`).join("\n")}

💡 推荐建议：
${insight.recommendations.map((r, index) => `${index + 1}. ${r.title}: ${r.description}`).join("\n")}

📅 生成时间：${insight.createdAt.toLocaleString()}
🏷️ 标签：${insight.tags?.join(", ") || "无"}

---
由 YanYu Cloud³ AI洞察系统生成`

    setShareContent(content)
    setSelectedInsight(insight)
    setShowShareDialog(true)
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareContent)
      toast({
        title: "复制成功",
        description: "洞察内容已复制到剪贴板",
      })
      setShowShareDialog(false)
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板，请手动复制",
        variant: "destructive",
      })
    }
  }

  // 修复导出功能
  const handleExport = (insight: AIInsight) => {
    setSelectedInsight(insight)
    setShowExportDialog(true)
  }

  const handleExportConfirm = () => {
    if (!selectedInsight) return

    try {
      let content = ""
      let filename = ""
      let mimeType = ""

      switch (exportFormat) {
        case "json":
          content = JSON.stringify(selectedInsight, null, 2)
          filename = `insight-${selectedInsight.id}.json`
          mimeType = "application/json"
          break
        case "csv":
          const csvHeaders = ["字段", "值"]
          const csvRows = [
            ["ID", selectedInsight.id],
            ["标题", selectedInsight.title],
            ["描述", selectedInsight.description],
            ["类型", INSIGHT_TYPE_LABELS[selectedInsight.type]],
            ["严重程度", SEVERITY_LABELS[selectedInsight.severity]],
            ["状态", STATUS_LABELS[selectedInsight.status as keyof typeof STATUS_LABELS]],
            ["置信度", `${selectedInsight.confidence}%`],
            ["数据源", selectedInsight.dataSource],
            ["创建时间", selectedInsight.createdAt.toLocaleString()],
            ["标签", selectedInsight.tags?.join(", ") || "无"],
          ]
          content = [csvHeaders, ...csvRows].map((row) => row.join(",")).join("\n")
          filename = `insight-${selectedInsight.id}.csv`
          mimeType = "text/csv"
          break
        case "txt":
          content = shareContent
          filename = `insight-${selectedInsight.id}.txt`
          mimeType = "text/plain"
          break
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "导出成功",
        description: `洞察数据已导出为 ${filename}`,
      })
      setShowExportDialog(false)
    } catch (error) {
      toast({
        title: "导出失败",
        description: "无法导出洞察数据，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleDeleteInsight = (insightId: string) => {
    toast({
      title: "删除成功",
      description: "洞察已删除",
    })

    if (selectedInsight?.id === insightId) {
      setSelectedInsight(null)
    }
    loadData()
  }

  const filteredInsights = insights.filter((insight) => {
    if (filters.type && filters.type !== "all" && insight.type !== filters.type) return false
    if (filters.severity && filters.severity !== "all" && insight.severity !== filters.severity) return false
    if (filters.status && filters.status !== "all" && insight.status !== filters.status) return false
    if (filters.search && !insight.title.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const unreadNotifications = notifications.filter((n) => !n.isRead)

  const renderInsightCard = (insight: AIInsight) => {
    const Icon = INSIGHT_TYPE_ICONS[insight.type]
    const StatusIcon = STATUS_ICONS[insight.status as keyof typeof STATUS_ICONS]

    return (
      <Card
        key={insight.id}
        className={`cursor-pointer transition-all hover:shadow-md ${
          selectedInsight?.id === insight.id ? "ring-2 ring-primary" : ""
        }`}
        onClick={() => handleInsightClick(insight)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">{insight.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={SEVERITY_COLORS[insight.severity]}>{SEVERITY_LABELS[insight.severity]}</Badge>
              <Badge variant="outline">{insight.confidence}%</Badge>
            </div>
          </div>
          <CardDescription className="text-sm">{insight.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {insight.createdAt.toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                {insight.findings.length} 发现
              </span>
              <span className="flex items-center gap-1">
                <Lightbulb className="h-4 w-4" />
                {insight.recommendations.length} 建议
              </span>
            </div>
            <div className="flex items-center gap-1">
              <StatusIcon className="h-4 w-4" />
              <Badge variant={insight.status === "new" ? "default" : "secondary"}>
                {STATUS_LABELS[insight.status as keyof typeof STATUS_LABELS]}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderInsightDetail = (insight: AIInsight) => {
    const Icon = INSIGHT_TYPE_ICONS[insight.type]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">{insight.title}</h2>
              <p className="text-muted-foreground">{INSIGHT_TYPE_LABELS[insight.type]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  状态: {STATUS_LABELS[insight.status as keyof typeof STATUS_LABELS]}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>更改状态</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusUpdate(insight.id, "acknowledged")}>
                  <Clock className="h-4 w-4 mr-2" />
                  确认
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusUpdate(insight.id, "resolved")}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  标记为已处理
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusUpdate(insight.id, "dismissed")}>
                  <XCircle className="h-4 w-4 mr-2" />
                  忽略
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusUpdate(insight.id, "new")}>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  重置为新状态
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={() => handleShare(insight)}>
              <Share className="h-4 w-4 mr-2" />
              分享
            </Button>

            <Button variant="outline" size="sm" onClick={() => handleExport(insight)}>
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>更多操作</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast({ title: "收藏成功", description: "洞察已添加到收藏" })}>
                  <Star className="h-4 w-4 mr-2" />
                  收藏
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "标记成功", description: "洞察已标记" })}>
                  <Flag className="h-4 w-4 mr-2" />
                  标记
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "归档成功", description: "洞察已归档" })}>
                  <Archive className="h-4 w-4 mr-2" />
                  归档
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      删除
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除</AlertDialogTitle>
                      <AlertDialogDescription>确定要删除这个洞察吗？此操作无法撤销。</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteInsight(insight.id)}>删除</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">置信度</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Progress value={insight.confidence} className="flex-1" />
                <span className="text-sm font-medium">{insight.confidence}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">严重程度</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={SEVERITY_COLORS[insight.severity]}>{SEVERITY_LABELS[insight.severity]}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">数据源</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-sm">{insight.dataSource}</span>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="findings" className="w-full">
          <TabsList>
            <TabsTrigger value="findings">发现 ({insight.findings.length})</TabsTrigger>
            <TabsTrigger value="recommendations">建议 ({insight.recommendations.length})</TabsTrigger>
            <TabsTrigger value="visualizations">可视化 ({insight.visualizations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="findings" className="space-y-4">
            {insight.findings.map((finding) => (
              <Card key={finding.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{finding.description}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">指标</Label>
                      <div className="font-medium">{finding.metric}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">当前值</Label>
                      <div className="font-medium">{finding.value.toFixed(2)}</div>
                    </div>
                    {finding.previousValue && (
                      <div>
                        <Label className="text-muted-foreground">之前值</Label>
                        <div className="font-medium">{finding.previousValue.toFixed(2)}</div>
                      </div>
                    )}
                    {finding.changePercent && (
                      <div>
                        <Label className="text-muted-foreground">变化</Label>
                        <div className={`font-medium ${finding.changePercent > 0 ? "text-green-600" : "text-red-600"}`}>
                          {finding.changePercent > 0 ? "+" : ""}
                          {finding.changePercent.toFixed(1)}%
                        </div>
                      </div>
                    )}
                  </div>

                  {finding.evidence.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-muted-foreground">证据</Label>
                      <div className="mt-2 space-y-2">
                        {finding.evidence.map((evidence, index) => (
                          <div key={index} className="text-sm bg-muted/50 p-2 rounded">
                            <div className="font-medium">{evidence.description}</div>
                            <div className="text-muted-foreground">值: {evidence.value.toFixed(3)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {insight.recommendations.map((recommendation) => (
              <Card key={recommendation.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{recommendation.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={recommendation.priority === "high" ? "destructive" : "secondary"}>
                        {recommendation.priority === "high"
                          ? "高优先级"
                          : recommendation.priority === "medium"
                            ? "中优先级"
                            : "低优先级"}
                      </Badge>
                      <Badge variant="outline">{recommendation.category}</Badge>
                    </div>
                  </div>
                  <CardDescription>{recommendation.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">预期影响</Label>
                      <div className="font-medium">{recommendation.expectedImpact}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">工作量</Label>
                      <div className="font-medium">
                        {recommendation.effort === "high" ? "高" : recommendation.effort === "medium" ? "中" : "低"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">时间线</Label>
                      <div className="font-medium">{recommendation.timeline}</div>
                    </div>
                  </div>

                  {recommendation.actions.length > 0 && (
                    <div>
                      <Label className="text-muted-foreground">行动项</Label>
                      <div className="mt-2 space-y-2">
                        {recommendation.actions.map((action) => (
                          <div key={action.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div>
                              <div className="font-medium text-sm">{action.title}</div>
                              <div className="text-xs text-muted-foreground">{action.description}</div>
                            </div>
                            <Badge variant={action.status === "pending" ? "outline" : "secondary"}>
                              {action.status === "pending"
                                ? "待处理"
                                : action.status === "in_progress"
                                  ? "进行中"
                                  : "已完成"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="visualizations" className="space-y-4">
            {insight.visualizations.map((viz) => (
              <Card key={viz.id}>
                <CardHeader>
                  <CardTitle className="text-base">{viz.title}</CardTitle>
                  <CardDescription>{viz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 mb-4">
                    {viz.type === "line_chart" && (
                      <ChartContainer
                        config={{
                          value: { label: "值", color: "hsl(var(--chart-1))" },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={viz.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="value" stroke="var(--color-value)" />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    )}

                    {viz.type === "bar_chart" && (
                      <ChartContainer
                        config={{
                          value: { label: "值", color: "hsl(var(--chart-1))" },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={viz.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" fill="var(--color-value)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    )}

                    {viz.type === "pie_chart" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={viz.data}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {viz.data.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {viz.insights.length > 0 && (
                    <div>
                      <Label className="text-muted-foreground">洞察要点</Label>
                      <ul className="mt-2 space-y-1">
                        {viz.insights.map((insight, index) => (
                          <li key={index} className="text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  const renderNotifications = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">通知列表</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllNotificationsRead}>
            <Check className="h-4 w-4 mr-2" />
            全部已读
          </Button>
        </div>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2" />
              <p>暂无通知</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-colors ${!notification.isRead ? "bg-blue-50 border-blue-200" : ""}`}
                onClick={() => handleNotificationRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={SEVERITY_COLORS[notification.severity]} variant="outline">
                          {SEVERITY_LABELS[notification.severity]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{notification.createdAt.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">分析配置</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>自动生成洞察</Label>
              <p className="text-sm text-muted-foreground">启用后将自动分析数据并生成洞察</p>
            </div>
            <Switch
              checked={config?.autoGenerate || false}
              onCheckedChange={(checked) => handleConfigUpdate({ autoGenerate: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>最低置信度</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="0"
                max="100"
                value={config?.minConfidence || 70}
                onChange={(e) => handleConfigUpdate({ minConfidence: Number.parseInt(e.target.value) })}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>分析频率</Label>
            <Select
              value={config?.analysisFrequency || "hourly"}
              onValueChange={(value) => handleConfigUpdate({ analysisFrequency: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real_time">实时</SelectItem>
                <SelectItem value="hourly">每小时</SelectItem>
                <SelectItem value="daily">每天</SelectItem>
                <SelectItem value="weekly">每周</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">通知设置</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>推送通知</Label>
              <p className="text-sm text-muted-foreground">接收新洞察的推送通知</p>
            </div>
            <Switch
              checked={config?.notificationSettings?.push || false}
              onCheckedChange={(checked) =>
                handleConfigUpdate({
                  notificationSettings: {
                    ...config?.notificationSettings,
                    push: checked,
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>通知阈值</Label>
            <Select
              value={config?.notificationSettings?.severityThreshold || "medium"}
              onValueChange={(value) =>
                handleConfigUpdate({
                  notificationSettings: {
                    ...config?.notificationSettings,
                    severityThreshold: value as any,
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">低及以上</SelectItem>
                <SelectItem value="medium">中及以上</SelectItem>
                <SelectItem value="high">高及以上</SelectItem>
                <SelectItem value="critical">仅严重</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">启用的分析类型</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(INSIGHT_TYPE_LABELS).map(([type, label]) => (
            <div key={type} className="flex items-center justify-between">
              <Label>{label}</Label>
              <Switch
                checked={config?.enabledTypes?.includes(type as InsightType) || false}
                onCheckedChange={(checked) => {
                  const currentTypes = config?.enabledTypes || []
                  const newTypes = checked
                    ? [...currentTypes, type as InsightType]
                    : currentTypes.filter((t) => t !== type)
                  handleConfigUpdate({ enabledTypes: newTypes })
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI驱动的洞察
          </h2>
          <p className="text-muted-foreground">智能分析数据，发现隐藏的模式和趋势</p>
        </div>
        <div className="flex gap-2">
          {/* 修复后的通知按钮 */}
          <Button variant="outline" className="relative" onClick={handleNotificationClick}>
            <Bell className="h-4 w-4 mr-2" />
            通知
            {unreadNotifications.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unreadNotifications.length}
              </Badge>
            )}
          </Button>

          {/* 修复后的设置按钮 */}
          <Button variant="outline" onClick={handleSettingsClick}>
            <Settings className="h-4 w-4 mr-2" />
            设置
          </Button>

          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
            {isAnalyzing ? "分析中..." : "开始分析"}
          </Button>
        </div>
      </div>

      {/* 通知对话框 */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>通知中心</DialogTitle>
            <DialogDescription>查看AI洞察相关的通知和提醒</DialogDescription>
          </DialogHeader>
          {renderNotifications()}
        </DialogContent>
      </Dialog>

      {/* 设置对话框 */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI洞察设置</DialogTitle>
            <DialogDescription>配置AI分析和通知偏好</DialogDescription>
          </DialogHeader>
          {renderSettings()}
          <DialogFooter>
            <Button onClick={() => setShowSettings(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 分享对话框 */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>分享洞察</DialogTitle>
            <DialogDescription>选择分享方式或复制内容到剪贴板</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>分享内容</Label>
              <Textarea
                value={shareContent}
                onChange={(e) => setShareContent(e.target.value)}
                className="min-h-[200px]"
                placeholder="洞察内容..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCopyToClipboard} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                复制到剪贴板
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(`mailto:?subject=AI洞察分享&body=${encodeURIComponent(shareContent)}`)}
              >
                <Mail className="h-4 w-4 mr-2" />
                邮件分享
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent)}`)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                社交分享
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 导出对话框 */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>导出洞察</DialogTitle>
            <DialogDescription>选择导出格式并下载洞察数据</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>导出格式</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      JSON 格式
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV 格式
                    </div>
                  </SelectItem>
                  <SelectItem value="txt">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      文本格式
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              取消
            </Button>
            <Button onClick={handleExportConfirm}>
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 洞察列表 */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">筛选和搜索</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>搜索</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索洞察..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>类型</Label>
                <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="所有类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有类型</SelectItem>
                    {Object.entries(INSIGHT_TYPE_LABELS).map(([type, label]) => (
                      <SelectItem key={type} value={type}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>严重程度</Label>
                <Select value={filters.severity} onValueChange={(value) => setFilters({ ...filters, severity: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="所有级别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有级别</SelectItem>
                    {Object.entries(SEVERITY_LABELS).map(([severity, label]) => (
                      <SelectItem key={severity} value={severity}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>状态</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="所有状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="new">新</SelectItem>
                    <SelectItem value="acknowledged">已确认</SelectItem>
                    <SelectItem value="resolved">已处理</SelectItem>
                    <SelectItem value="dismissed">已忽略</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">洞察列表</h3>
              <Badge variant="outline">{filteredInsights.length} 项</Badge>
            </div>

            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {filteredInsights.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-8 w-8 mx-auto mb-2" />
                    <p>暂无洞察数据</p>
                    <p className="text-sm">点击"开始分析"生成AI洞察</p>
                  </div>
                ) : (
                  filteredInsights.map(renderInsightCard)
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* 洞察详情 */}
        <div className="lg:col-span-2">
          {selectedInsight ? (
            renderInsightDetail(selectedInsight)
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">选择洞察查看详情</h3>
                <p className="text-muted-foreground">从左侧列表中选择一个洞察来查看详细信息、发现和建议</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
