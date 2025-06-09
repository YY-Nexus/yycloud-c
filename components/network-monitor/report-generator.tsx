"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { CalendarIcon, FileText, Download, Loader2 } from "lucide-react"
import type { NetworkMonitorPeriod, NetworkReportType, NetworkReport } from "@/types/network-monitor"
import { generateNetworkReport } from "@/lib/network-monitor"

export function ReportGenerator() {
  const [reportType, setReportType] = useState<NetworkReportType>("performance")
  const [period, setPeriod] = useState<NetworkMonitorPeriod>("7d")
  const [customDateFrom, setCustomDateFrom] = useState<Date>()
  const [customDateTo, setCustomDateTo] = useState<Date>(new Date())
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generatedReport, setGeneratedReport] = useState<NetworkReport | null>(null)

  // 生成报告
  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      let customRange = undefined
      if (period === "custom" && customDateFrom && customDateTo) {
        customRange = {
          from: customDateFrom,
          to: customDateTo,
        }
      }

      const title = getReportTitle()
      const report = await generateNetworkReport(title, reportType, period, customRange)
      setGeneratedReport(report)
    } catch (error) {
      console.error("生成报告失败:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // 获取报告标题
  const getReportTitle = (): string => {
    const reportTypeText =
      reportType === "performance"
        ? "网络性能"
        : reportType === "security"
          ? "网络安全"
          : reportType === "devices"
            ? "网络设备"
            : reportType === "traffic"
              ? "网络流量"
              : "自定义网络"

    const periodText =
      period === "24h"
        ? "24小时"
        : period === "7d"
          ? "7天"
          : period === "30d"
            ? "30天"
            : period === "90d"
              ? "90天"
              : "自定义时间"

    return `${reportTypeText}报告 - ${periodText}`
  }

  // 获取报告类型标签
  const getReportTypeLabel = (type: NetworkReportType): string => {
    switch (type) {
      case "performance":
        return "网络性能报告"
      case "security":
        return "网络安全报告"
      case "devices":
        return "网络设备报告"
      case "traffic":
        return "网络流量报告"
      case "custom":
        return "自定义报告"
    }
  }

  // 获取报告类型描述
  const getReportTypeDescription = (type: NetworkReportType): string => {
    switch (type) {
      case "performance":
        return "包含网络速度、延迟和稳定性的详细分析"
      case "security":
        return "分析网络安全事件和潜在威胁"
      case "devices":
        return "提供网络设备清单和连接状态"
      case "traffic":
        return "分析网络流量使用情况和趋势"
      case "custom":
        return "综合多种数据的自定义报告"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>网络报告生成器</CardTitle>
        <CardDescription>生成详细的网络分析报告</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">报告类型</label>
                <Select value={reportType} onValueChange={(value) => setReportType(value as NetworkReportType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择报告类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">网络性能报告</SelectItem>
                    <SelectItem value="security">网络安全报告</SelectItem>
                    <SelectItem value="devices">网络设备报告</SelectItem>
                    <SelectItem value="traffic">网络流量报告</SelectItem>
                    <SelectItem value="custom">自定义报告</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">{getReportTypeDescription(reportType)}</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">时间范围</label>
                <Select value={period} onValueChange={(value) => setPeriod(value as NetworkMonitorPeriod)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择时间范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">最近24小时</SelectItem>
                    <SelectItem value="7d">最近7天</SelectItem>
                    <SelectItem value="30d">最近30天</SelectItem>
                    <SelectItem value="90d">最近90天</SelectItem>
                    <SelectItem value="custom">自定义范围</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {period === "custom" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium block">自定义日期范围</label>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customDateFrom ? (
                            format(customDateFrom, "yyyy年MM月dd日", { locale: zhCN })
                          ) : (
                            <span>开始日期</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={customDateFrom}
                          onSelect={setCustomDateFrom}
                          initialFocus
                          locale={zhCN}
                        />
                      </PopoverContent>
                    </Popover>
                    <span>至</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customDateTo ? (
                            format(customDateTo, "yyyy年MM月dd日", { locale: zhCN })
                          ) : (
                            <span>结束日期</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={customDateTo}
                          onSelect={setCustomDateTo}
                          initialFocus
                          locale={zhCN}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}

              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating || (period === "custom" && (!customDateFrom || !customDateTo))}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    生成报告
                  </>
                )}
              </Button>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">报告预览</h3>
              {generatedReport ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">{generatedReport.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      生成时间: {format(generatedReport.createdAt, "yyyy-MM-dd HH:mm", { locale: zhCN })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">报告内容:</p>
                    <ul className="text-sm space-y-1">
                      {generatedReport.sections.map((section) => (
                        <li key={section.id}>• {section.title}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <Badge variant="outline">{generatedReport.status === "completed" ? "已完成" : "生成中..."}</Badge>
                    <Button variant="outline" size="sm" disabled={generatedReport.status !== "completed"}>
                      <Download className="h-4 w-4 mr-2" />
                      下载报告
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">选择报告类型和时间范围，然后点击"生成报告"</p>
                </div>
              )}
            </div>
          </div>

          {generatedReport && generatedReport.status === "completed" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">最近生成的报告</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{generatedReport.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(generatedReport.createdAt, "yyyy-MM-dd HH:mm", { locale: zhCN })}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      下载
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
