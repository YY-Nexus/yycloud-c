"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { FileText, Download, Save } from "lucide-react"
import type { DeviceWithResults } from "@/types/device"
import type { ComparisonReport, ExportOptions } from "@/types/report"
import { generateComparisonReport, saveReport, exportReport, getDefaultReportTemplates } from "@/lib/report-generator"

interface ReportGeneratorProps {
  devices: DeviceWithResults[]
  selectedDeviceIds: string[]
  primaryMetric: "download" | "upload" | "ping" | "jitter" | "packetLoss" | "qualityScore"
}

export function ReportGenerator({ devices, selectedDeviceIds, primaryMetric }: ReportGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("standard")
  const [includeInsights, setIncludeInsights] = useState(true)
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeRawData, setIncludeRawData] = useState(true)
  const [generatedReport, setGeneratedReport] = useState<ComparisonReport | null>(null)
  const [activeTab, setActiveTab] = useState("generate")

  const templates = getDefaultReportTemplates()
  const selectedDevices = devices.filter((device) => selectedDeviceIds.includes(device.id))

  // 生成报告
  const handleGenerateReport = async () => {
    if (!reportName.trim()) {
      toast({
        title: "请输入报告名称",
        description: "报告名称不能为空",
        variant: "destructive",
      })
      return
    }

    if (selectedDevices.length === 0) {
      toast({
        title: "请选择设备",
        description: "至少需要选择一个设备来生成报告",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const config = {
        selectedDeviceIds,
        primaryMetric,
        timeRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30天前
          end: new Date(),
        },
        includeInsights,
        includeCharts,
        includeRawData,
      }

      const report = await generateComparisonReport(selectedDevices, config, reportName, reportDescription)
      setGeneratedReport(report)
      setActiveTab("preview")

      toast({
        title: "报告生成成功",
        description: `已成功生成报告"${reportName}"`,
      })
    } catch (error) {
      console.error("生成报告失败:", error)
      toast({
        title: "生成报告失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // 保存报告
  const handleSaveReport = async () => {
    if (!generatedReport) return

    try {
      const success = await saveReport(generatedReport)
      if (success) {
        toast({
          title: "报告保存成功",
          description: "报告已保存到本地，您可以在报告管理页面查看",
        })
        setIsOpen(false)
        resetForm()
      } else {
        throw new Error("保存失败")
      }
    } catch (error) {
      console.error("保存报告失败:", error)
      toast({
        title: "保存报告失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    }
  }

  // 导出报告
  const handleExportReport = async (format: "pdf" | "excel" | "json" | "csv") => {
    if (!generatedReport) return

    setIsExporting(true)

    try {
      const exportOptions: ExportOptions = {
        format,
        includeCharts,
        includeRawData,
        includeInsights,
        customName: reportName,
      }

      const result = await exportReport(generatedReport, exportOptions)

      // 创建下载链接
      let blob: Blob
      let filename: string

      if (typeof result === "string") {
        blob = new Blob([result], { type: "text/plain;charset=utf-8" })
        filename = `${reportName}.${format}`
      } else {
        blob = result
        filename = `${reportName}.${format}`
      }

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
        description: `报告已导出为 ${format.toUpperCase()} 格式`,
      })
    } catch (error) {
      console.error("导出报告失败:", error)
      toast({
        title: "导出失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // 重置表单
  const resetForm = () => {
    setReportName("")
    setReportDescription("")
    setSelectedTemplate("standard")
    setIncludeInsights(true)
    setIncludeCharts(true)
    setIncludeRawData(true)
    setGeneratedReport(null)
    setActiveTab("generate")
  }

  // 应用模板设置
  const applyTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setIncludeInsights(template.defaultConfig.includeInsights ?? true)
      setIncludeCharts(template.defaultConfig.includeCharts ?? true)
      setIncludeRawData(template.defaultConfig.includeRawData ?? true)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          生成报告
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>设备对比分析报告</DialogTitle>
          <DialogDescription>生成、预览和导出设备网络性能对比分析报告</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">生成报告</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedReport}>
              预览报告
            </TabsTrigger>
            <TabsTrigger value="export" disabled={!generatedReport}>
              导出报告
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reportName">报告名称 *</Label>
                  <Input
                    id="reportName"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="输入报告名称"
                  />
                </div>

                <div>
                  <Label htmlFor="reportDescription">报告描述</Label>
                  <Textarea
                    id="reportDescription"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="输入报告描述（可选）"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="template">报告模板</Label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={(value) => {
                      setSelectedTemplate(value)
                      applyTemplate(value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择报告模板" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    {templates.find((t) => t.id === selectedTemplate)?.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>包含内容</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeInsights"
                        checked={includeInsights}
                        onCheckedChange={(checked) => setIncludeInsights(checked as boolean)}
                      />
                      <Label htmlFor="includeInsights">分析洞察</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeCharts"
                        checked={includeCharts}
                        onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                      />
                      <Label htmlFor="includeCharts">图表可视化</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeRawData"
                        checked={includeRawData}
                        onCheckedChange={(checked) => setIncludeRawData(checked as boolean)}
                      />
                      <Label htmlFor="includeRawData">原始数据</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>选中的设备</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDevices.map((device) => (
                      <Badge key={device.id} variant="secondary">
                        {device.name}
                      </Badge>
                    ))}
                  </div>
                  {selectedDevices.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-1">请先在对比页面选择设备</p>
                  )}
                </div>

                <div>
                  <Label>主要对比指标</Label>
                  <Badge variant="outline" className="mt-2">
                    {primaryMetric === "download"
                      ? "下载速度"
                      : primaryMetric === "upload"
                        ? "上传速度"
                        : primaryMetric === "ping"
                          ? "网络延迟"
                          : primaryMetric === "jitter"
                            ? "网络抖动"
                            : primaryMetric === "packetLoss"
                              ? "丢包率"
                              : "质量评分"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleGenerateReport} disabled={isGenerating} className="gap-2">
                <FileText className="h-4 w-4" />
                {isGenerating ? "生成中..." : "生成报告"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {generatedReport && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{generatedReport.name}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleSaveReport} className="gap-2">
                        <Save className="h-4 w-4" />
                        保存报告
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    生成时间: {generatedReport.createdAt.toLocaleString("zh-CN")}
                    {generatedReport.description && (
                      <>
                        <br />
                        {generatedReport.description}
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 汇总信息 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">汇总信息</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{generatedReport.summary.totalDevices}</div>
                        <div className="text-sm text-muted-foreground">设备总数</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{generatedReport.summary.totalTests}</div>
                        <div className="text-sm text-muted-foreground">测试总数</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-emerald-600">
                          {generatedReport.summary.bestPerformingDevice.deviceName}
                        </div>
                        <div className="text-sm text-muted-foreground">最佳设备</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">
                          {generatedReport.summary.worstPerformingDevice.deviceName}
                        </div>
                        <div className="text-sm text-muted-foreground">最差设备</div>
                      </div>
                    </div>
                  </div>

                  {/* 平均性能 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">平均性能</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">下载速度</div>
                        <div className="text-xl font-bold">
                          {generatedReport.summary.averagePerformance.download.toFixed(2)} Mbps
                        </div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">上传速度</div>
                        <div className="text-xl font-bold">
                          {generatedReport.summary.averagePerformance.upload.toFixed(2)} Mbps
                        </div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">网络延迟</div>
                        <div className="text-xl font-bold">
                          {generatedReport.summary.averagePerformance.ping.toFixed(0)} ms
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 分析洞察 */}
                  {includeInsights && generatedReport.insights.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">分析洞察</h3>
                      <div className="space-y-2">
                        {generatedReport.insights.slice(0, 5).map((insight, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border-l-4 ${
                              insight.type === "error"
                                ? "bg-red-50 border-red-500"
                                : insight.type === "warning"
                                  ? "bg-yellow-50 border-yellow-500"
                                  : insight.type === "success"
                                    ? "bg-green-50 border-green-500"
                                    : "bg-blue-50 border-blue-500"
                            }`}
                          >
                            <div className="font-medium">{insight.title}</div>
                            <div className="text-sm text-muted-foreground mt-1">{insight.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">导出格式</CardTitle>
                  <CardDescription>选择合适的格式导出报告</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => handleExportReport("pdf")}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4" />
                    导出为 PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => handleExportReport("excel")}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4" />
                    导出为 Excel
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => handleExportReport("csv")}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4" />
                    导出为 CSV
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => handleExportReport("json")}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4" />
                    导出为 JSON
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">导出选项</CardTitle>
                  <CardDescription>自定义导出内容</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="exportCharts"
                      checked={includeCharts}
                      onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                    />
                    <Label htmlFor="exportCharts">包含图表</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="exportRawData"
                      checked={includeRawData}
                      onCheckedChange={(checked) => setIncludeRawData(checked as boolean)}
                    />
                    <Label htmlFor="exportRawData">包含原始数据</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="exportInsights"
                      checked={includeInsights}
                      onCheckedChange={(checked) => setIncludeInsights(checked as boolean)}
                    />
                    <Label htmlFor="exportInsights">包含分析洞察</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {isExporting && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">正在导出报告，请稍候...</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
