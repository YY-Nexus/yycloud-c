"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { FileText, Eye, Download, Trash2, Search, Calendar, Filter, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ComparisonReport } from "@/types/report"
import { getSavedReports, deleteReport, exportReport } from "@/lib/report-generator"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

export default function ReportsPage() {
  const [reports, setReports] = useState<ComparisonReport[]>([])
  const [filteredReports, setFilteredReports] = useState<ComparisonReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReport, setSelectedReport] = useState<ComparisonReport | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [reportToDelete, setReportToDelete] = useState<ComparisonReport | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  // 加载报告列表
  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const savedReports = await getSavedReports()
        setReports(savedReports)
        setFilteredReports(savedReports)
      } catch (error) {
        console.error("加载报告失败:", error)
        setError("加载报告失败，请稍后重试")
        toast({
          title: "加载报告失败",
          description: "请稍后重试",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadReports()
  }, [])

  // 搜索过滤
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredReports(reports)
    } else {
      const filtered = reports.filter(
        (report) =>
          report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.devices.some((device) => device.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredReports(filtered)
    }
  }, [searchQuery, reports])

  // 查看报告
  const handleViewReport = (report: ComparisonReport) => {
    setSelectedReport(report)
    setIsViewDialogOpen(true)
  }

  // 删除报告
  const handleDeleteReport = async (report: ComparisonReport) => {
    setReportToDelete(report)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteReport = async () => {
    if (!reportToDelete) return

    try {
      const success = await deleteReport(reportToDelete.id)
      if (success) {
        setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id))
        toast({
          title: "删除成功",
          description: `报告"${reportToDelete.name}"已删除`,
        })
      } else {
        throw new Error("删除失败")
      }
    } catch (error) {
      console.error("删除报告失败:", error)
      toast({
        title: "删除失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setReportToDelete(null)
    }
  }

  // 导出报告
  const handleExportReport = async (report: ComparisonReport, format: "pdf" | "excel" | "json" | "csv") => {
    setIsExporting(true)

    try {
      const result = await exportReport(report, {
        format,
        includeCharts: true,
        includeRawData: true,
        includeInsights: true,
        customName: report.name,
      })

      // 创建下载链接
      let blob: Blob
      let filename: string

      if (typeof result === "string") {
        blob = new Blob([result], { type: "text/plain;charset=utf-8" })
        filename = `${report.name}.${format}`
      } else {
        blob = result
        filename = `${report.name}.${format}`
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

  // 获取报告状态标签
  const getReportStatusBadge = (report: ComparisonReport) => {
    const daysSinceCreated = Math.floor((Date.now() - report.createdAt.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceCreated === 0) {
      return <Badge variant="default">今天</Badge>
    } else if (daysSinceCreated <= 7) {
      return <Badge variant="secondary">本周</Badge>
    } else if (daysSinceCreated <= 30) {
      return <Badge variant="outline">本月</Badge>
    } else {
      return <Badge variant="outline">较早</Badge>
    }
  }

  // 在加载状态检查之前添加错误状态检查
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">报告管理</h1>
          <p className="text-muted-foreground">查看、管理和导出已保存的设备对比分析报告</p>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <div className="text-red-500 mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">加载失败</h3>
              <p className="text-muted-foreground text-center mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>重新加载</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">报告管理</h1>
        <p className="text-muted-foreground">查看、管理和导出已保存的设备对比分析报告</p>
      </div>

      {/* 搜索和过滤 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索报告名称、描述或设备..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          筛选
        </Button>
      </div>

      {/* 报告列表 */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">正在加载报告...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">暂无报告</h3>
              <p className="text-muted-foreground text-center">
                {searchQuery ? "没有找到匹配的报告" : "您还没有保存任何报告，请先在设备对比页面生成报告"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{report.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">{report.description || "无描述"}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewReport(report)}>
                        <Eye className="mr-2 h-4 w-4" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportReport(report, "pdf")} disabled={isExporting}>
                        <Download className="mr-2 h-4 w-4" />
                        导出 PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportReport(report, "excel")} disabled={isExporting}>
                        <Download className="mr-2 h-4 w-4" />
                        导出 Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteReport(report)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        删除报告
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">创建时间</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {format(report.createdAt, "yyyy年MM月dd日", { locale: zhCN })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">设备数量</span>
                    <Badge variant="outline">{report.summary.totalDevices} 个设备</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">测试总数</span>
                    <span>{report.summary.totalTests} 次</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">状态</span>
                    {getReportStatusBadge(report)}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewReport(report)} className="flex-1">
                      <Eye className="mr-2 h-3 w-3" />
                      查看
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportReport(report, "pdf")}
                      disabled={isExporting}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 查看报告对话框 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedReport?.name}</DialogTitle>
            <DialogDescription>
              创建时间: {selectedReport?.createdAt.toLocaleString("zh-CN")}
              {selectedReport?.description && (
                <>
                  <br />
                  {selectedReport.description}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* 汇总信息 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">汇总信息</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedReport.summary.totalDevices}</div>
                    <div className="text-sm text-muted-foreground">设备总数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedReport.summary.totalTests}</div>
                    <div className="text-sm text-muted-foreground">测试总数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-600">
                      {selectedReport.summary.bestPerformingDevice.deviceName}
                    </div>
                    <div className="text-sm text-muted-foreground">最佳设备</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      {selectedReport.summary.worstPerformingDevice.deviceName}
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
                      {selectedReport.summary.averagePerformance.download.toFixed(2)} Mbps
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">上传速度</div>
                    <div className="text-xl font-bold">
                      {selectedReport.summary.averagePerformance.upload.toFixed(2)} Mbps
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">网络延迟</div>
                    <div className="text-xl font-bold">
                      {selectedReport.summary.averagePerformance.ping.toFixed(0)} ms
                    </div>
                  </div>
                </div>
              </div>

              {/* 设备列表 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">包含设备</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedReport.devices.map((device) => (
                    <Badge key={device.id} variant="secondary" className="justify-center">
                      {device.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 分析洞察 */}
              {selectedReport.insights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">分析洞察</h3>
                  <div className="space-y-2">
                    {selectedReport.insights.slice(0, 5).map((insight, index) => (
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

              {/* 导出选项 */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleExportReport(selectedReport, "pdf")}
                  disabled={isExporting}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  导出 PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportReport(selectedReport, "excel")}
                  disabled={isExporting}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  导出 Excel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportReport(selectedReport, "csv")}
                  disabled={isExporting}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  导出 CSV
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除报告</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除报告"{reportToDelete?.name}"吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteReport} className="bg-destructive text-destructive-foreground">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
