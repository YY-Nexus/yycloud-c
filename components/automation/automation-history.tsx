"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, CalendarIcon, Download, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

interface HistoryRecord {
  id: string
  workflowName: string
  status: "success" | "failed" | "cancelled"
  startTime: string
  endTime: string
  duration: number
  triggeredBy: string
  errorMessage?: string
  outputSize?: number
}

export function AutomationHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [selectedDate, setSelectedDate] = useState<Date>()

  const historyRecords: HistoryRecord[] = [
    {
      id: "1",
      workflowName: "网络监控自动化",
      status: "success",
      startTime: "2024-01-20 14:30:00",
      endTime: "2024-01-20 14:30:45",
      duration: 45,
      triggeredBy: "定时触发",
      outputSize: 2048,
    },
    {
      id: "2",
      workflowName: "数据备份流程",
      status: "failed",
      startTime: "2024-01-20 14:25:00",
      endTime: "2024-01-20 14:25:30",
      duration: 30,
      triggeredBy: "定时触发",
      errorMessage: "磁盘空间不足",
    },
    {
      id: "3",
      workflowName: "设备健康检查",
      status: "success",
      startTime: "2024-01-20 12:00:00",
      endTime: "2024-01-20 12:01:15",
      duration: 75,
      triggeredBy: "手动触发",
      outputSize: 1024,
    },
    {
      id: "4",
      workflowName: "安全扫描自动化",
      status: "cancelled",
      startTime: "2024-01-20 11:30:00",
      endTime: "2024-01-20 11:30:10",
      duration: 10,
      triggeredBy: "手动触发",
      errorMessage: "用户取消执行",
    },
    {
      id: "5",
      workflowName: "网络监控自动化",
      status: "success",
      startTime: "2024-01-20 13:30:00",
      endTime: "2024-01-20 13:30:42",
      duration: 42,
      triggeredBy: "定时触发",
      outputSize: 1856,
    },
  ]

  const filteredRecords = historyRecords.filter((record) => {
    const matchesSearch = record.workflowName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "成功"
      case "failed":
        return "失败"
      case "cancelled":
        return "已取消"
      default:
        return "未知"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "cancelled":
        return <Clock className="h-4 w-4 text-gray-600" />
      default:
        return <RefreshCw className="h-4 w-4 text-gray-600" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const stats = {
    total: historyRecords.length,
    success: historyRecords.filter((r) => r.status === "success").length,
    failed: historyRecords.filter((r) => r.status === "failed").length,
    cancelled: historyRecords.filter((r) => r.status === "cancelled").length,
  }

  return (
    <div className="space-y-6">
      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总执行次数</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">成功执行</p>
                <p className="text-2xl font-bold text-green-600">{stats.success}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">执行失败</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">成功率</p>
                <p className="text-2xl font-bold text-blue-600">{((stats.success / stats.total) * 100).toFixed(1)}%</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选和搜索 */}
      <Card>
        <CardHeader>
          <CardTitle>执行历史</CardTitle>
          <CardDescription>查看和分析工作流的执行历史记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索工作流..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="success">成功</SelectItem>
                <SelectItem value="failed">失败</SelectItem>
                <SelectItem value="cancelled">已取消</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: zhCN }) : "选择日期"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>

          {/* 历史记录表格 */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>工作流名称</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>开始时间</TableHead>
                  <TableHead>执行时长</TableHead>
                  <TableHead>触发方式</TableHead>
                  <TableHead>输出大小</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.workflowName}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(record.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(record.status)}
                          {getStatusText(record.status)}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>{record.startTime}</TableCell>
                    <TableCell>{record.duration}秒</TableCell>
                    <TableCell>{record.triggeredBy}</TableCell>
                    <TableCell>{record.outputSize ? formatFileSize(record.outputSize) : "-"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">没有找到匹配的执行记录</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
