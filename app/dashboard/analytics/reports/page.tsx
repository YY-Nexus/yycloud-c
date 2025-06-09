/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 分析报告页面
 *
 * @module YYC/app
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  getReportTemplates,
  getReports,
  generateReport,
  generateReportFromTemplate,
  deleteReport,
  exportReport,
  type ReportTemplate,
  type ReportConfig,
  type ReportData,
  type ReportType,
  type ReportTimeRange,
  type ReportFormat,
} from "@/lib/report-generator"
import {
  FileText,
  Download,
  PlusCircle,
  CalendarIcon,
  ChevronDown,
  Trash2,
  RefreshCw,
  FileSpreadsheet,
  FileIcon as FilePdf,
  FileJson,
  FileTextIcon,
  BarChart4,
  PieChart,
  Activity,
  Users,
  Zap,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AnalyticsReportsPage() {
  const [activeTab, setActiveTab] = useState("templates")
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [reports, setReports] = useState<ReportData[]>([])
  const [showNewReportDialog, setShowNewReportDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // 加载模板和报告
    setTemplates(getReportTemplates())
    setReports(getReports())
  }, [])

  const handleGenerateReport = async (config: ReportConfig) => {
    setIsGenerating(true)
    try {
      const report = await generateReport(config)
      setReports([report, ...reports])
      setShowNewReportDialog(false)
      toast({
        title: "报告生成成功",
        description: `报告"${config.title}"已成功生成`,
      })
    } catch (error) {
      console.error("Failed to generate report:", error)
      toast({
        title: "报告生成失败",
        description: "无法生成报告，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateFromTemplate = async (templateId: string, title: string) => {
    setIsGenerating(true)
    try {
      const report = await generateReportFromTemplate(templateId, title)
      if (report) {
        setReports([report, ...reports])
        toast({
          title: "报告生成成功",
          description: `报告"${title}"已成功生成`,
        })
      }
    } catch (error) {
      console.error("Failed to generate report from template:", error)
      toast({
        title: "报告生成失败",
        description: "无法生成报告，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeleteReport = (id: string) => {
    try {
      deleteReport(id)
      setReports(reports.filter((report) => report.id !== id))
      toast({
        title: "报告已删除",
        description: "报告已成功删除",
      })
    } catch (error) {
      console.error("Failed to delete report:", error)
      toast({
        title: "删除失败",
        description: "无法删除报告，请稍后再试",
        variant: "destructive",
      })
    }
  }

  const handleExportReport = async (id: string, format: ReportFormat) => {
    try {
      const url = await exportReport(id, format)
      // 在实际应用中，这应该触发下载
      window.open(url, "_blank")
      toast({
        title: "报告导出成功",
        description: `报告已成功导出为${format.toUpperCase()}格式`,
      })
    } catch (error) {
      console.error("Failed to export report:", error)
      toast({
        title: "导出失败",
        description: "无法导出报告，请稍后再试",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">分析报告</h1>
        <p className="text-muted-foreground">创建和管理自定义分析报告</p>
      </div>

      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="templates">报告模板</TabsTrigger>
            <TabsTrigger value="reports">我的报告</TabsTrigger>
            <TabsTrigger value="scheduled">定时报告</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="templates" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">报告模板</h2>
                <Dialog open={showNewReportDialog} onOpenChange={setShowNewReportDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      创建自定义报告
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <ReportForm
                      onSubmit={handleGenerateReport}
                      onCancel={() => setShowNewReportDialog(false)}
                      isGenerating={isGenerating}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onGenerate={(title) => handleGenerateFromTemplate(template.id, title)}
                    isGenerating={isGenerating}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">我的报告</h2>
                  <Button onClick={() => setReports(getReports())}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    刷新
                  </Button>
                </div>

                {reports.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">暂无报告</h3>
                      <p className="text-sm text-muted-foreground mt-2">使用报告模板或创建自定义报告</p>
                      <Button className="mt-4" onClick={() => setShowNewReportDialog(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        创建报告
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <ReportCard
                        key={report.id}
                        report={report}
                        onDelete={() => handleDeleteReport(report.id)}
                        onExport={(format) => handleExportReport(report.id, format)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="scheduled">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">定时报告</h2>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    创建定时报告
                  </Button>
                </div>

                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">暂无定时报告</h3>
                    <p className="text-sm text-muted-foreground mt-2">设置定时报告以自动生成和发送分析报告</p>
                    <Button className="mt-4">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      创建定时报告
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

interface TemplateCardProps {
  template: ReportTemplate
  onGenerate: (title: string) => void
  isGenerating: boolean
}

function TemplateCard({ template, onGenerate, isGenerating }: TemplateCardProps) {
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [reportTitle, setReportTitle] = useState("")

  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case "usage":
        return <Activity className="h-5 w-5" />
      case "performance":
        return <Zap className="h-5 w-5" />
      case "conversion":
        return <BarChart4 className="h-5 w-5" />
      case "user":
        return <Users className="h-5 w-5" />
      case "feature":
        return <PieChart className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getReportTypeLabel = (type: ReportType) => {
    switch (type) {
      case "usage":
        return "使用情况"
      case "performance":
        return "性能"
      case "conversion":
        return "转化"
      case "user":
        return "用户"
      case "feature":
        return "功能使用"
      case "custom":
        return "自定义"
      default:
        return "未知类型"
    }
  }

  const getTimeRangeLabel = (timeRange: ReportTimeRange) => {
    switch (timeRange) {
      case "24h":
        return "过去24小时"
      case "7d":
        return "过去7天"
      case "30d":
        return "过去30天"
      case "90d":
        return "过去90天"
      case "custom":
        return "自定义时间范围"
      default:
        return "未知时间范围"
    }
  }

  const handleGenerate = () => {
    if (!reportTitle.trim()) return
    onGenerate(reportTitle)
    setShowGenerateDialog(false)
    setReportTitle("")
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {getReportTypeIcon(template.config.type)}
              <div className="ml-2">
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </div>
            </div>
            <Badge variant="outline">{getReportTypeLabel(template.config.type)}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">时间范围:</span>
              <span>{getTimeRangeLabel(template.config.timeRange)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">指标数量:</span>
              <span>{template.config.metrics.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">输出格式:</span>
              <span>{template.config.format.toUpperCase()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setShowGenerateDialog(true)}>
            生成报告
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>生成报告</DialogTitle>
            <DialogDescription>使用"{template.name}"模板生成新报告</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-title" className="text-right">
                报告标题
              </Label>
              <Input
                id="report-title"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="col-span-3"
                placeholder="输入报告标题"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              取消
            </Button>
            <Button onClick={handleGenerate} disabled={!reportTitle.trim() || isGenerating}>
              {isGenerating ? "生成中..." : "生成报告"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface ReportCardProps {
  report: ReportData
  onDelete: () => void
  onExport: (format: ReportFormat) => void
}

function ReportCard({ report, onDelete, onExport }: ReportCardProps) {
  const [showExportMenu, setShowExportMenu] = useState(false)

  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case "usage":
        return <Activity className="h-5 w-5" />
      case "performance":
        return <Zap className="h-5 w-5" />
      case "conversion":
        return <BarChart4 className="h-5 w-5" />
      case "user":
        return <Users className="h-5 w-5" />
      case "feature":
        return <PieChart className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getReportTypeLabel = (type: ReportType) => {
    switch (type) {
      case "usage":
        return "使用情况"
      case "performance":
        return "性能"
      case "conversion":
        return "转化"
      case "user":
        return "用户"
      case "feature":
        return "功能使用"
      case "custom":
        return "自定义"
      default:
        return "未知类型"
    }
  }

  const getFormatIcon = (format: ReportFormat) => {
    switch (format) {
      case "pdf":
        return <FilePdf className="h-4 w-4 mr-2" />
      case "excel":
        return <FileSpreadsheet className="h-4 w-4 mr-2" />
      case "csv":
        return <FileTextIcon className="h-4 w-4 mr-2" />
      case "json":
        return <FileJson className="h-4 w-4 mr-2" />
      default:
        return <FileText className="h-4 w-4 mr-2" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {getReportTypeIcon(report.config.type)}
            <div className="ml-2">
              <CardTitle>{report.config.title}</CardTitle>
              <CardDescription>生成于 {new Date(report.generatedAt).toLocaleString()}</CardDescription>
            </div>
          </div>
          <Badge variant="outline">{getReportTypeLabel(report.config.type)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">报告ID:</span>
            <span>{report.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">格式:</span>
            <span>{report.config.format.toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">指标:</span>
            <span>{report.config.metrics.length}个指标</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          删除
        </Button>
        <div className="flex space-x-2">
          <Popover open={showExportMenu} onOpenChange={setShowExportMenu}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                导出
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <div className="flex flex-col">
                <Button variant="ghost" className="justify-start rounded-none" onClick={() => onExport("pdf")}>
                  {getFormatIcon("pdf")}
                  PDF
                </Button>
                <Button variant="ghost" className="justify-start rounded-none" onClick={() => onExport("excel")}>
                  {getFormatIcon("excel")}
                  Excel
                </Button>
                <Button variant="ghost" className="justify-start rounded-none" onClick={() => onExport("csv")}>
                  {getFormatIcon("csv")}
                  CSV
                </Button>
                <Button variant="ghost" className="justify-start rounded-none" onClick={() => onExport("json")}>
                  {getFormatIcon("json")}
                  JSON
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            查看
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

interface ReportFormProps {
  onSubmit: (config: ReportConfig) => void
  onCancel: () => void
  isGenerating: boolean
}

function ReportForm({ onSubmit, onCancel, isGenerating }: ReportFormProps) {
  const [reportType, setReportType] = useState<ReportType>("usage")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeRange, setTimeRange] = useState<ReportTimeRange>("7d")
  const [format, setFormat] = useState<ReportFormat>("pdf")
  const [metrics, setMetrics] = useState<string[]>([])
  const [dimensions, setDimensions] = useState<string[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())

  // 可用指标和维度
  const availableMetrics: Record<ReportType, string[]> = {
    usage: ["page_views", "unique_users", "session_duration", "bounce_rate", "sessions"],
    performance: ["page_load_time", "lcp", "fid", "cls", "ttfb", "dns_time", "tcp_time"],
    conversion: ["conversions", "conversion_rate", "funnel_completion", "avg_value"],
    user: ["new_users", "returning_users", "active_users", "user_retention", "churn_rate"],
    feature: ["usage_count", "unique_users", "avg_time_spent", "completion_rate"],
    custom: [],
  }

  const availableDimensions: Record<ReportType, string[]> = {
    usage: ["date", "device_type", "browser", "country", "referrer"],
    performance: ["date", "page", "device_type", "browser", "connection_type"],
    conversion: ["date", "source", "medium", "campaign", "landing_page"],
    user: ["date", "user_type", "device_type", "country", "acquisition_source"],
    feature: ["feature", "date", "user_type", "device_type"],
    custom: [],
  }

  // 根据报告类型更新指标和维度
  useEffect(() => {
    setMetrics(availableMetrics[reportType].slice(0, 3))
    setDimensions(availableDimensions[reportType].slice(0, 2))
  }, [reportType])

  const handleSubmit = () => {
    if (!title.trim()) return

    const config: ReportConfig = {
      type: reportType,
      title: title.trim(),
      description: description.trim() || undefined,
      timeRange,
      customDateRange:
        timeRange === "custom"
          ? {
              startDate: date!,
              endDate: endDate!,
            }
          : undefined,
      metrics,
      dimensions,
      format,
    }

    onSubmit(config)
  }

  const getMetricLabel = (metric: string) => {
    const metricLabels: Record<string, string> = {
      page_views: "页面浏览量",
      unique_users: "独立用户数",
      session_duration: "会话时长",
      bounce_rate: "跳出率",
      sessions: "会话数",
      page_load_time: "页面加载时间",
      lcp: "最大内容绘制",
      fid: "首次输入延迟",
      cls: "累积布局偏移",
      ttfb: "首字节时间",
      dns_time: "DNS解析时间",
      tcp_time: "TCP连接时间",
      conversions: "转化次数",
      conversion_rate: "转化率",
      funnel_completion: "漏斗完成率",
      avg_value: "平均价值",
      new_users: "新用户数",
      returning_users: "回访用户数",
      active_users: "活跃用户数",
      user_retention: "用户留存率",
      churn_rate: "流失率",
      usage_count: "使用次数",
      completion_rate: "完成率",
    }
    return metricLabels[metric] || metric
  }

  const getDimensionLabel = (dimension: string) => {
    const dimensionLabels: Record<string, string> = {
      date: "日期",
      device_type: "设备类型",
      browser: "浏览器",
      country: "国家/地区",
      referrer: "来源网站",
      page: "页面",
      connection_type: "连接类型",
      source: "来源",
      medium: "媒介",
      campaign: "活动",
      landing_page: "着陆页",
      user_type: "用户类型",
      acquisition_source: "获取来源",
      feature: "功能",
    }
    return dimensionLabels[dimension] || dimension
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>创建自定义报告</DialogTitle>
        <DialogDescription>配置自定义分析报告参数</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="report-type" className="text-right">
            报告类型
          </Label>
          <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
            <SelectTrigger id="report-type" className="col-span-3">
              <SelectValue placeholder="选择报告类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usage">使用情况报告</SelectItem>
              <SelectItem value="performance">性能报告</SelectItem>
              <SelectItem value="conversion">转化报告</SelectItem>
              <SelectItem value="user">用户报告</SelectItem>
              <SelectItem value="feature">功能使用报告</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            报告标题
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3"
            placeholder="输入报告标题"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            报告描述
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="col-span-3"
            placeholder="输入报告描述（可选）"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="time-range" className="text-right">
            时间范围
          </Label>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as ReportTimeRange)}>
            <SelectTrigger id="time-range" className="col-span-3">
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">过去24小时</SelectItem>
              <SelectItem value="7d">过去7天</SelectItem>
              <SelectItem value="30d">过去30天</SelectItem>
              <SelectItem value="90d">过去90天</SelectItem>
              <SelectItem value="custom">自定义时间范围</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {timeRange === "custom" && (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">开始日期</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("col-span-3 justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>选择日期</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">结束日期</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>选择日期</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="format" className="text-right">
            输出格式
          </Label>
          <Select value={format} onValueChange={(value) => setFormat(value as ReportFormat)}>
            <SelectTrigger id="format" className="col-span-3">
              <SelectValue placeholder="选择输出格式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right pt-2">指标</Label>
          <div className="col-span-3 space-y-2">
            {availableMetrics[reportType].map((metric) => (
              <div key={metric} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`metric-${metric}`}
                  checked={metrics.includes(metric)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setMetrics([...metrics, metric])
                    } else {
                      setMetrics(metrics.filter((m) => m !== metric))
                    }
                  }}
                />
                <Label htmlFor={`metric-${metric}`}>{getMetricLabel(metric)}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right pt-2">维度</Label>
          <div className="col-span-3 space-y-2">
            {availableDimensions[reportType].map((dimension) => (
              <div key={dimension} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`dimension-${dimension}`}
                  checked={dimensions.includes(dimension)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setDimensions([...dimensions, dimension])
                    } else {
                      setDimensions(dimensions.filter((d) => d !== dimension))
                    }
                  }}
                />
                <Label htmlFor={`dimension-${dimension}`}>{getDimensionLabel(dimension)}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSubmit} disabled={!title.trim() || isGenerating}>
          {isGenerating ? "生成中..." : "生成报告"}
        </Button>
      </DialogFooter>
    </>
  )
}
