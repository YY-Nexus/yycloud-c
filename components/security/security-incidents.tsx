"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Clock,
  Search,
  Plus,
  Shield,
  User,
  Calendar,
  ChevronRight,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

interface Incident {
  id: string
  title: string
  description: string
  status: "open" | "investigating" | "resolved" | "closed"
  severity: "critical" | "high" | "medium" | "low"
  category: string
  reportedBy: string
  reportedDate: string
  assignedTo?: string
  resolvedDate?: string
  closedDate?: string
  affectedSystems: string[]
  timeline: {
    date: string
    action: string
    user: string
    notes?: string
  }[]
  updates: {
    date: string
    user: string
    content: string
  }[]
}

export default function SecurityIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "INC-2023-001",
      title: "可疑登录尝试",
      description: "检测到多次来自未知IP地址的失败登录尝试",
      status: "resolved",
      severity: "medium",
      category: "未授权访问",
      reportedBy: "系统监控",
      reportedDate: "2023-11-15",
      assignedTo: "张安全",
      resolvedDate: "2023-11-16",
      affectedSystems: ["用户认证系统", "客户门户"],
      timeline: [
        {
          date: "2023-11-15 08:30",
          action: "事件报告",
          user: "系统监控",
          notes: "检测到来自IP 203.0.113.1的多次失败登录尝试",
        },
        {
          date: "2023-11-15 09:15",
          action: "分配事件",
          user: "李管理",
          notes: "分配给张安全调查",
        },
        {
          date: "2023-11-15 11:30",
          action: "开始调查",
          user: "张安全",
          notes: "分析日志并跟踪IP来源",
        },
        {
          date: "2023-11-16 10:45",
          action: "实施缓解措施",
          user: "张安全",
          notes: "阻止可疑IP并启用额外监控",
        },
        {
          date: "2023-11-16 15:20",
          action: "解决事件",
          user: "张安全",
          notes: "确认为自动扫描尝试，已阻止相关IP范围",
        },
      ],
      updates: [
        {
          date: "2023-11-15 11:45",
          user: "张安全",
          content: "初步调查显示这些尝试来自同一个IP范围，可能是自动化扫描",
        },
        {
          date: "2023-11-16 10:50",
          user: "张安全",
          content: "已阻止可疑IP范围，并增加了登录失败阈值监控",
        },
        {
          date: "2023-11-16 15:30",
          user: "张安全",
          content: "事件已解决。建议更新入侵检测规则以更快识别此类扫描",
        },
      ],
    },
    {
      id: "INC-2023-002",
      title: "数据库性能异常",
      description: "主数据库响应时间显著增加，可能表明安全问题",
      status: "investigating",
      severity: "high",
      category: "系统异常",
      reportedBy: "王运维",
      reportedDate: "2023-12-05",
      assignedTo: "刘数据",
      affectedSystems: ["主数据库", "客户管理系统", "报表系统"],
      timeline: [
        {
          date: "2023-12-05 14:20",
          action: "事件报告",
          user: "王运维",
          notes: "监控显示数据库响应时间在过去2小时内增加了300%",
        },
        {
          date: "2023-12-05 14:35",
          action: "分配事件",
          user: "李管理",
          notes: "分配给刘数据调查",
        },
        {
          date: "2023-12-05 15:10",
          action: "开始调查",
          user: "刘数据",
          notes: "检查数据库进程和查询性能",
        },
        {
          date: "2023-12-05 16:45",
          action: "发现异常查询",
          user: "刘数据",
          notes: "发现大量来自未使用应用程序的异常查询",
        },
      ],
      updates: [
        {
          date: "2023-12-05 15:30",
          user: "刘数据",
          content: "初步分析显示CPU使用率异常高，正在检查是否有异常查询或进程",
        },
        {
          date: "2023-12-05 17:00",
          user: "刘数据",
          content: "发现多个未经授权的查询正在执行全表扫描。已隔离相关连接，正在追踪来源",
        },
      ],
    },
    {
      id: "INC-2023-003",
      title: "钓鱼邮件活动",
      description: "多名员工报告收到可疑邮件，声称来自IT部门要求重置密码",
      status: "open",
      severity: "critical",
      category: "社会工程学攻击",
      reportedBy: "赵助理",
      reportedDate: "2023-12-10",
      assignedTo: "张安全",
      affectedSystems: ["邮件系统"],
      timeline: [
        {
          date: "2023-12-10 09:15",
          action: "事件报告",
          user: "赵助理",
          notes: "报告收到可疑邮件，要求点击链接重置密码",
        },
        {
          date: "2023-12-10 09:30",
          action: "分配事件",
          user: "李管理",
          notes: "分配给张安全处理",
        },
        {
          date: "2023-12-10 09:45",
          action: "开始调查",
          user: "张安全",
          notes: "收集邮件样本并分析",
        },
      ],
      updates: [
        {
          date: "2023-12-10 10:30",
          user: "张安全",
          content: "确认为钓鱼邮件活动。邮件伪装成IT部门通知，链接指向虚假登录页面",
        },
        {
          date: "2023-12-10 11:15",
          user: "张安全",
          content: "已阻止钓鱼域名并从所有邮箱中删除相关邮件。正在确认是否有员工点击了链接",
        },
      ],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [showNewIncidentDialog, setShowNewIncidentDialog] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    severity: "medium",
    category: "",
    affectedSystems: "",
  })
  const [newUpdate, setNewUpdate] = useState("")

  // 筛选事件
  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || incident.status === statusFilter
    const matchesSeverity = severityFilter === "all" || incident.severity === severityFilter

    return matchesSearch && matchesStatus && matchesSeverity
  })

  // 创建新事件
  const handleCreateIncident = () => {
    const now = new Date()
    const formattedDate = now.toISOString().split("T")[0]
    const formattedDateTime = `${formattedDate} ${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`

    const newId = `INC-${now.getFullYear()}-${(incidents.length + 1).toString().padStart(3, "0")}`
    const affectedSystemsList = newIncident.affectedSystems
      .split(",")
      .map((system) => system.trim())
      .filter(Boolean)

    const createdIncident: Incident = {
      id: newId,
      title: newIncident.title,
      description: newIncident.description,
      status: "open",
      severity: newIncident.severity as "critical" | "high" | "medium" | "low",
      category: newIncident.category,
      reportedBy: "当前用户", // 实际应用中应使用真实用户
      reportedDate: formattedDate,
      affectedSystems: affectedSystemsList,
      timeline: [
        {
          date: formattedDateTime,
          action: "事件报告",
          user: "当前用户",
          notes: "创建了安全事件",
        },
      ],
      updates: [],
    }

    setIncidents([createdIncident, ...incidents])
    setNewIncident({
      title: "",
      description: "",
      severity: "medium",
      category: "",
      affectedSystems: "",
    })
    setShowNewIncidentDialog(false)
  }

  // 添加更新
  const handleAddUpdate = () => {
    if (!selectedIncident || !newUpdate.trim()) return

    const now = new Date()
    const formattedDateTime = `${now.toISOString().split("T")[0]} ${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    const updatedIncidents = incidents.map((incident) => {
      if (incident.id === selectedIncident.id) {
        const updatedIncident = {
          ...incident,
          updates: [
            ...incident.updates,
            {
              date: formattedDateTime,
              user: "当前用户", // 实际应用中应使用真实用户
              content: newUpdate,
            },
          ],
          timeline: [
            ...incident.timeline,
            {
              date: formattedDateTime,
              action: "添加更新",
              user: "当前用户",
              notes: newUpdate.substring(0, 50) + (newUpdate.length > 50 ? "..." : ""),
            },
          ],
        }
        setSelectedIncident(updatedIncident)
        return updatedIncident
      }
      return incident
    })

    setIncidents(updatedIncidents)
    setNewUpdate("")
    setShowUpdateDialog(false)
  }

  // 更新事件状态
  const updateIncidentStatus = (id: string, newStatus: "open" | "investigating" | "resolved" | "closed") => {
    const now = new Date()
    const formattedDate = now.toISOString().split("T")[0]
    const formattedDateTime = `${formattedDate} ${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`

    const statusActionMap = {
      open: "重新打开事件",
      investigating: "开始调查",
      resolved: "解决事件",
      closed: "关闭事件",
    }

    const updatedIncidents = incidents.map((incident) => {
      if (incident.id === id) {
        const updates = { ...incident }
        updates.status = newStatus

        if (newStatus === "resolved") {
          updates.resolvedDate = formattedDate
        } else if (newStatus === "closed") {
          updates.closedDate = formattedDate
        }

        updates.timeline = [
          ...incident.timeline,
          {
            date: formattedDateTime,
            action: statusActionMap[newStatus],
            user: "当前用户", // 实际应用中应使用真实用户
          },
        ]

        if (selectedIncident && selectedIncident.id === id) {
          setSelectedIncident(updates)
        }

        return updates
      }
      return incident
    })

    setIncidents(updatedIncidents)
  }

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <AlertCircle className="w-3 h-3 mr-1" />
            待处理
          </Badge>
        )
      case "investigating":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            调查中
          </Badge>
        )
      case "resolved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            已解决
          </Badge>
        )
      case "closed":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">
            <XCircle className="w-3 h-3 mr-1" />
            已关闭
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  // 获取严重性徽章
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-500 hover:bg-red-600">紧急</Badge>
      case "high":
        return <Badge className="bg-orange-500 hover:bg-orange-600">高</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">中</Badge>
      case "low":
        return <Badge className="bg-blue-500 hover:bg-blue-600">低</Badge>
      default:
        return <Badge>{severity}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">安全事件管理</h1>

      {!selectedIncident ? (
        <>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="搜索事件..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="open">待处理</SelectItem>
                  <SelectItem value="investigating">调查中</SelectItem>
                  <SelectItem value="resolved">已解决</SelectItem>
                  <SelectItem value="closed">已关闭</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="严重性" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有级别</SelectItem>
                  <SelectItem value="critical">紧急</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowNewIncidentDialog(true)}>
              <Plus className="w-4 h-4 mr-1" />
              报告事件
            </Button>
          </div>

          {filteredIncidents.length === 0 ? (
            <Card className="text-center py-10">
              <CardContent>
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">未找到安全事件</h3>
                <p className="mt-1 text-gray-500">尝试使用不同的搜索词或筛选条件</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredIncidents.map((incident) => (
                <Card key={incident.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <h3 className="text-lg font-semibold">{incident.title}</h3>
                          <div className="text-sm text-gray-500">{incident.id}</div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{incident.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {getStatusBadge(incident.status)}
                          {getSeverityBadge(incident.severity)}
                          <Badge variant="outline">{incident.category}</Badge>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          报告于 {incident.reportedDate}
                        </div>
                        <Button variant="outline" onClick={() => setSelectedIncident(incident)}>
                          查看详情
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setSelectedIncident(null)}>
              <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
              返回列表
            </Button>
            <div className="flex gap-2">
              {selectedIncident.status !== "open" && (
                <Button
                  variant="outline"
                  onClick={() => updateIncidentStatus(selectedIncident.id, "open")}
                  className="text-blue-500"
                >
                  重新打开
                </Button>
              )}
              {selectedIncident.status !== "investigating" && selectedIncident.status !== "resolved" && (
                <Button
                  variant="outline"
                  onClick={() => updateIncidentStatus(selectedIncident.id, "investigating")}
                  className="text-yellow-500"
                >
                  开始调查
                </Button>
              )}
              {selectedIncident.status !== "resolved" && selectedIncident.status !== "closed" && (
                <Button
                  variant="outline"
                  onClick={() => updateIncidentStatus(selectedIncident.id, "resolved")}
                  className="text-green-500"
                >
                  标记为已解决
                </Button>
              )}
              {selectedIncident.status !== "closed" && (
                <Button
                  variant="outline"
                  onClick={() => updateIncidentStatus(selectedIncident.id, "closed")}
                  className="text-gray-500"
                >
                  关闭事件
                </Button>
              )}
              <Button onClick={() => setShowUpdateDialog(true)}>添加更新</Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{selectedIncident.title}</CardTitle>
                  <CardDescription className="mt-1">ID: {selectedIncident.id}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(selectedIncident.status)}
                  {getSeverityBadge(selectedIncident.severity)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">事件描述</h3>
                <p className="text-gray-700">{selectedIncident.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">类别</h4>
                  <div className="mt-1">{selectedIncident.category}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">报告人</h4>
                  <div className="mt-1 flex items-center">
                    <User className="w-4 h-4 mr-1 text-gray-400" />
                    {selectedIncident.reportedBy}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">报告日期</h4>
                  <div className="mt-1">{selectedIncident.reportedDate}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">处理人</h4>
                  <div className="mt-1">{selectedIncident.assignedTo || "未分配"}</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">受影响系统</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIncident.affectedSystems.map((system, index) => (
                    <Badge key={index} variant="outline">
                      {system}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <Tabs defaultValue="updates">
                <TabsList className="mb-4">
                  <TabsTrigger value="updates">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    更新 ({selectedIncident.updates.length})
                  </TabsTrigger>
                  <TabsTrigger value="timeline">
                    <Clock className="w-4 h-4 mr-1" />
                    时间线 ({selectedIncident.timeline.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="updates">
                  <div className="space-y-4">
                    {selectedIncident.updates.length === 0 ? (
                      <Alert>
                        <AlertDescription>尚无更新信息</AlertDescription>
                      </Alert>
                    ) : (
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
                          {[...selectedIncident.updates].reverse().map((update, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="font-medium">{update.user}</div>
                                  <div className="text-sm text-gray-500">{update.date}</div>
                                </div>
                                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{update.content}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="timeline">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="relative pl-6 border-l border-gray-200">
                      {[...selectedIncident.timeline].reverse().map((event, index) => (
                        <div key={index} className="mb-6 relative">
                          <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary" />
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{event.action}</div>
                              <div className="text-sm text-gray-500">由 {event.user} 执行</div>
                              {event.notes && <p className="mt-1 text-gray-700">{event.notes}</p>}
                            </div>
                            <div className="text-sm text-gray-500">{event.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 新建事件对话框 */}
      <Dialog open={showNewIncidentDialog} onOpenChange={setShowNewIncidentDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>报告安全事件</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={newIncident.title}
                onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                placeholder="简要描述事件"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">详细描述</Label>
              <Textarea
                id="description"
                value={newIncident.description}
                onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                placeholder="提供事件的详细信息"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity">严重性</Label>
                <Select
                  value={newIncident.severity}
                  onValueChange={(value) => setNewIncident({ ...newIncident, severity: value })}
                >
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="选择严重性" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">紧急</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">类别</Label>
                <Input
                  id="category"
                  value={newIncident.category}
                  onChange={(e) => setNewIncident({ ...newIncident, category: e.target.value })}
                  placeholder="例如：未授权访问"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="affectedSystems">受影响系统 (用逗号分隔)</Label>
              <Input
                id="affectedSystems"
                value={newIncident.affectedSystems}
                onChange={(e) => setNewIncident({ ...newIncident, affectedSystems: e.target.value })}
                placeholder="例如：用户认证系统, 客户门户"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewIncidentDialog(false)}>
              取消
            </Button>
            <Button onClick={handleCreateIncident} disabled={!newIncident.title || !newIncident.description}>
              提交事件
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 添加更新对话框 */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>添加事件更新</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="update">更新内容</Label>
              <Textarea
                id="update"
                value={newUpdate}
                onChange={(e) => setNewUpdate(e.target.value)}
                placeholder="提供最新的调查结果或采取的措施"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
              取消
            </Button>
            <Button onClick={handleAddUpdate} disabled={!newUpdate.trim()}>
              添加更新
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
