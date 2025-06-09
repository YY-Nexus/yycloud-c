"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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
import { LineChart, AreaChart, ResponsiveContainer, Line, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  getAllStreams,
  getStreamData,
  createStream,
  connectStream,
  disconnectStream,
  getActiveAlerts,
  addEventListener,
  removeEventListener,
} from "@/lib/real-time-stream-manager"
import type { RealTimeStream, StreamConfig, DataPoint, AlertEvent, StreamType } from "@/types/real-time-stream"
import {
  Activity,
  Play,
  Pause,
  Square,
  Plus,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Zap,
  LineChartIcon,
  Monitor,
  Users,
  Shield,
  FileText,
  MoreHorizontal,
  Trash2,
  Copy,
  Download,
  Eye,
  EyeOff,
  Bell,
  Search,
  Calendar,
  Cpu,
  Network,
} from "lucide-react"

const STREAM_TYPE_ICONS = {
  network_metrics: Network,
  system_performance: Cpu,
  user_activity: Users,
  device_status: Monitor,
  security_events: Shield,
  application_logs: FileText,
  custom: Database,
}

const STREAM_TYPE_LABELS = {
  network_metrics: "网络指标",
  system_performance: "系统性能",
  user_activity: "用户活动",
  device_status: "设备状态",
  security_events: "安全事件",
  application_logs: "应用日志",
  custom: "自定义",
}

const STATUS_COLORS = {
  connected: "bg-green-100 text-green-800",
  disconnected: "bg-gray-100 text-gray-800",
  reconnecting: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  paused: "bg-blue-100 text-blue-800",
}

const STATUS_LABELS = {
  connected: "已连接",
  disconnected: "已断开",
  reconnecting: "重连中",
  error: "错误",
  paused: "已暂停",
}

const STATUS_ICONS = {
  connected: CheckCircle,
  disconnected: XCircle,
  reconnecting: Clock,
  error: AlertTriangle,
  paused: Pause,
}

export function StreamDashboard() {
  const [streams, setStreams] = useState<RealTimeStream[]>([])
  const [selectedStream, setSelectedStream] = useState<RealTimeStream | null>(null)
  const [alerts, setAlerts] = useState<AlertEvent[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [showAlertsDialog, setShowAlertsDialog] = useState(false)
  const [streamData, setStreamData] = useState<Record<string, DataPoint[]>>({})
  const [refreshInterval, setRefreshInterval] = useState(5000)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    search: "",
  })

  // 新建流表单状态
  const [newStreamConfig, setNewStreamConfig] = useState<Partial<StreamConfig>>({
    name: "",
    description: "",
    type: "network_metrics",
    source: {
      type: "websocket",
      url: "",
      headers: {},
    },
    processing: {
      bufferSize: 1000,
      batchSize: 100,
      flushInterval: 5000,
      retryAttempts: 3,
      retryDelay: 1000,
    },
    isActive: true,
  })

  // 加载数据
  const loadData = useCallback(() => {
    try {
      const allStreams = getAllStreams()
      setStreams(allStreams)

      const allAlerts = getActiveAlerts()
      setAlerts(allAlerts)

      // 加载每个流的数据
      const data: Record<string, DataPoint[]> = {}
      allStreams.forEach((stream) => {
        data[stream.id] = getStreamData(stream.id, 100) // 最近100个数据点
      })
      setStreamData(data)
    } catch (error) {
      console.error("加载数据失败:", error)
      toast({
        title: "加载失败",
        description: "无法加载实时数据流信息",
        variant: "destructive",
      })
    }
  }, [])

  // 设置事件监听器
  useEffect(() => {
    const handleStreamEvent = () => {
      loadData()
    }

    const handleDataReceived = (data: any) => {
      setStreamData((prev) => ({
        ...prev,
        [data.streamId]: getStreamData(data.streamId, 100),
      }))
    }

    addEventListener("stream_created", handleStreamEvent)
    addEventListener("stream_connected", handleStreamEvent)
    addEventListener("stream_disconnected", handleStreamEvent)
    addEventListener("stream_deleted", handleStreamEvent)
    addEventListener("data_received", handleDataReceived)
    addEventListener("alert_triggered", handleStreamEvent)

    return () => {
      removeEventListener("stream_created", handleStreamEvent)
      removeEventListener("stream_connected", handleStreamEvent)
      removeEventListener("stream_disconnected", handleStreamEvent)
      removeEventListener("stream_deleted", handleStreamEvent)
      removeEventListener("data_received", handleDataReceived)
      removeEventListener("alert_triggered", handleStreamEvent)
    }
  }, [loadData])

  // 初始加载和自动刷新
  useEffect(() => {
    loadData()

    if (autoRefresh) {
      const interval = setInterval(loadData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [loadData, autoRefresh, refreshInterval])

  // 创建新流
  const handleCreateStream = async () => {
    try {
      if (!newStreamConfig.name || !newStreamConfig.source?.url) {
        toast({
          title: "创建失败",
          description: "请填写必要的配置信息",
          variant: "destructive",
        })
        return
      }

      const config: StreamConfig = {
        id: `stream-${Date.now()}`,
        name: newStreamConfig.name!,
        description: newStreamConfig.description || "",
        type: newStreamConfig.type as StreamType,
        source: newStreamConfig.source!,
        processing: newStreamConfig.processing!,
        isActive: newStreamConfig.isActive!,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await createStream(config)
      setShowCreateDialog(false)
      setNewStreamConfig({
        name: "",
        description: "",
        type: "network_metrics",
        source: {
          type: "websocket",
          url: "",
          headers: {},
        },
        processing: {
          bufferSize: 1000,
          batchSize: 100,
          flushInterval: 5000,
          retryAttempts: 3,
          retryDelay: 1000,
        },
        isActive: true,
      })

      toast({
        title: "创建成功",
        description: `数据流 "${config.name}" 已创建`,
      })
    } catch (error) {
      console.error("创建流失败:", error)
      toast({
        title: "创建失败",
        description: "无法创建数据流，请检查配置",
        variant: "destructive",
      })
    }
  }

  // 连接/断开流
  const handleToggleStream = async (streamId: string, connect: boolean) => {
    try {
      if (connect) {
        await connectStream(streamId)
        toast({
          title: "连接成功",
          description: "数据流已开始连接",
        })
      } else {
        await disconnectStream(streamId)
        toast({
          title: "断开成功",
          description: "数据流已断开连接",
        })
      }
    } catch (error) {
      console.error("操作失败:", error)
      toast({
        title: "操作失败",
        description: connect ? "无法连接数据流" : "无法断开数据流",
        variant: "destructive",
      })
    }
  }

  // 过滤流
  const filteredStreams = streams.filter((stream) => {
    if (filters.status !== "all" && stream.status !== filters.status) return false
    if (filters.type !== "all" && stream.config.type !== filters.type) return false
    if (filters.search && !stream.config.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  // 渲染流卡片
  const renderStreamCard = (stream: RealTimeStream) => {
    const Icon = STREAM_TYPE_ICONS[stream.config.type]
    const StatusIcon = STATUS_ICONS[stream.status]
    const data = streamData[stream.id] || []
    const isConnected = stream.status === "connected"

    return (
      <Card
        key={stream.id}
        className={`cursor-pointer transition-all hover:shadow-md ${
          selectedStream?.id === stream.id ? "ring-2 ring-primary" : ""
        }`}
        onClick={() => setSelectedStream(stream)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">{stream.config.name}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={STATUS_COLORS[stream.status]}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {STATUS_LABELS[stream.status]}
              </Badge>
              {isConnected && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600">实时</span>
                </div>
              )}
            </div>
          </div>
          <CardDescription className="text-sm">{stream.config.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* 统计信息 */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">数据点</Label>
                <div className="font-medium">{stream.statistics.totalPoints.toLocaleString()}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">速率</Label>
                <div className="font-medium">{stream.statistics.pointsPerSecond.toFixed(1)}/秒</div>
              </div>
              <div>
                <Label className="text-muted-foreground">延迟</Label>
                <div className="font-medium">{stream.statistics.averageLatency.toFixed(0)}ms</div>
              </div>
              <div>
                <Label className="text-muted-foreground">正常运行时间</Label>
                <div className="font-medium">{stream.statistics.uptime.toFixed(1)}%</div>
              </div>
            </div>

            {/* 迷你图表 */}
            {data.length > 0 && (
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.slice(-20).map((point, index) => ({
                      index,
                      value: typeof point.value === "number" ? point.value : 0,
                    }))}
                  >
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={isConnected ? "destructive" : "default"}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleStream(stream.id, !isConnected)
                  }}
                >
                  {isConnected ? (
                    <>
                      <Square className="h-3 w-3 mr-1" />
                      断开
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      连接
                    </>
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {stream.lastActiveTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 渲染流详情
  const renderStreamDetail = (stream: RealTimeStream) => {
    const Icon = STREAM_TYPE_ICONS[stream.config.type]
    const data = streamData[stream.id] || []
    const chartData = data.slice(-50).map((point, index) => ({
      time: point.timestamp.toLocaleTimeString(),
      value: typeof point.value === "number" ? point.value : 0,
      timestamp: point.timestamp,
    }))

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">{stream.config.name}</h2>
              <p className="text-muted-foreground">{STREAM_TYPE_LABELS[stream.config.type]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={STATUS_COLORS[stream.status]}>{STATUS_LABELS[stream.status]}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>操作</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowConfigDialog(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  配置
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  复制配置
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  导出数据
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="h-4 w-4" />
                数据点总数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stream.statistics.totalPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                缓冲区: {stream.buffer.length}/{stream.config.processing.bufferSize}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4" />
                实时速率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stream.statistics.pointsPerSecond.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">点/秒</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                平均延迟
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stream.statistics.averageLatency.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">毫秒</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4" />
                正常运行时间
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stream.statistics.uptime.toFixed(1)}%</div>
              <Progress value={stream.statistics.uptime} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* 图表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5" />
              实时数据图表
            </CardTitle>
            <CardDescription>显示最近50个数据点的趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{
                  value: { label: "数值", color: "hsl(var(--chart-1))" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-value)"
                      fill="var(--color-value)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* 最新数据 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              最新数据点
            </CardTitle>
            <CardDescription>实时数据流中的最新数据</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {data
                  .slice(-10)
                  .reverse()
                  .map((point) => (
                    <div key={point.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {typeof point.value === "object" ? JSON.stringify(point.value) : String(point.value)}
                        </div>
                        <div className="text-xs text-muted-foreground">{point.timestamp.toLocaleString()}</div>
                      </div>
                      {point.tags && point.tags.length > 0 && (
                        <div className="flex gap-1">
                          {point.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                {data.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="h-8 w-8 mx-auto mb-2" />
                    <p>暂无数据</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 渲染创建流对话框
  const renderCreateDialog = () => (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>创建新的数据流</DialogTitle>
          <DialogDescription>配置实时数据流的连接和处理参数</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="font-medium">基本信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>流名称 *</Label>
                <Input
                  value={newStreamConfig.name || ""}
                  onChange={(e) => setNewStreamConfig({ ...newStreamConfig, name: e.target.value })}
                  placeholder="输入流名称"
                />
              </div>
              <div className="space-y-2">
                <Label>流类型</Label>
                <Select
                  value={newStreamConfig.type}
                  onValueChange={(value) => setNewStreamConfig({ ...newStreamConfig, type: value as StreamType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STREAM_TYPE_LABELS).map(([type, label]) => (
                      <SelectItem key={type} value={type}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>描述</Label>
              <Textarea
                value={newStreamConfig.description || ""}
                onChange={(e) => setNewStreamConfig({ ...newStreamConfig, description: e.target.value })}
                placeholder="输入流描述"
                rows={2}
              />
            </div>
          </div>

          <Separator />

          {/* 数据源配置 */}
          <div className="space-y-4">
            <h3 className="font-medium">数据源配置</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>连接类型</Label>
                <Select
                  value={newStreamConfig.source?.type}
                  onValueChange={(value) =>
                    setNewStreamConfig({
                      ...newStreamConfig,
                      source: { ...newStreamConfig.source!, type: value as any },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="websocket">WebSocket</SelectItem>
                    <SelectItem value="sse">Server-Sent Events</SelectItem>
                    <SelectItem value="polling">HTTP 轮询</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>连接URL *</Label>
                <Input
                  value={newStreamConfig.source?.url || ""}
                  onChange={(e) =>
                    setNewStreamConfig({
                      ...newStreamConfig,
                      source: { ...newStreamConfig.source!, url: e.target.value },
                    })
                  }
                  placeholder="ws://localhost:8080/stream"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 处理配置 */}
          <div className="space-y-4">
            <h3 className="font-medium">处理配置</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>缓冲区大小</Label>
                <Input
                  type="number"
                  value={newStreamConfig.processing?.bufferSize || 1000}
                  onChange={(e) =>
                    setNewStreamConfig({
                      ...newStreamConfig,
                      processing: {
                        ...newStreamConfig.processing!,
                        bufferSize: Number.parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>批处理大小</Label>
                <Input
                  type="number"
                  value={newStreamConfig.processing?.batchSize || 100}
                  onChange={(e) =>
                    setNewStreamConfig({
                      ...newStreamConfig,
                      processing: {
                        ...newStreamConfig.processing!,
                        batchSize: Number.parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>刷新间隔 (ms)</Label>
                <Input
                  type="number"
                  value={newStreamConfig.processing?.flushInterval || 5000}
                  onChange={(e) =>
                    setNewStreamConfig({
                      ...newStreamConfig,
                      processing: {
                        ...newStreamConfig.processing!,
                        flushInterval: Number.parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>重试次数</Label>
                <Input
                  type="number"
                  value={newStreamConfig.processing?.retryAttempts || 3}
                  onChange={(e) =>
                    setNewStreamConfig({
                      ...newStreamConfig,
                      processing: {
                        ...newStreamConfig.processing!,
                        retryAttempts: Number.parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={newStreamConfig.isActive}
                onCheckedChange={(checked) => setNewStreamConfig({ ...newStreamConfig, isActive: checked })}
              />
              <Label>创建后立即激活</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
            取消
          </Button>
          <Button onClick={handleCreateStream}>创建数据流</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            实时数据流处理
          </h2>
          <p className="text-muted-foreground">管理和监控实时数据流，实现高效的数据处理和分析</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAlertsDialog(true)} className="relative">
            <Bell className="h-4 w-4 mr-2" />
            告警
            {alerts.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {alerts.length}
              </Badge>
            )}
          </Button>
          <Button variant="outline" onClick={() => setAutoRefresh(!autoRefresh)}>
            {autoRefresh ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {autoRefresh ? "停止自动刷新" : "开启自动刷新"}
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            创建数据流
          </Button>
        </div>
      </div>

      {/* 告警对话框 */}
      <Dialog open={showAlertsDialog} onOpenChange={setShowAlertsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>活跃告警</DialogTitle>
            <DialogDescription>查看当前活跃的数据流告警</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2" />
                  <p>暂无活跃告警</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <Card key={alert.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{alert.message}</h4>
                            <Badge
                              className={
                                alert.severity === "critical"
                                  ? "bg-red-100 text-red-800"
                                  : alert.severity === "high"
                                    ? "bg-orange-100 text-orange-800"
                                    : alert.severity === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-blue-100 text-blue-800"
                              }
                            >
                              {alert.severity === "critical"
                                ? "严重"
                                : alert.severity === "high"
                                  ? "高"
                                  : alert.severity === "medium"
                                    ? "中"
                                    : "低"}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            流ID: {alert.streamId} • {alert.triggeredAt.toLocaleString()}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          确认
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* 创建流对话框 */}
      {renderCreateDialog()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 流列表 */}
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
                    placeholder="搜索数据流..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>状态</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="所有状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="connected">已连接</SelectItem>
                    <SelectItem value="disconnected">已断开</SelectItem>
                    <SelectItem value="reconnecting">重连中</SelectItem>
                    <SelectItem value="error">错误</SelectItem>
                    <SelectItem value="paused">已暂停</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>类型</Label>
                <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="所有类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有类型</SelectItem>
                    {Object.entries(STREAM_TYPE_LABELS).map(([type, label]) => (
                      <SelectItem key={type} value={type}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>自动刷新间隔</Label>
                <Select
                  value={refreshInterval.toString()}
                  onValueChange={(value) => setRefreshInterval(Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">1秒</SelectItem>
                    <SelectItem value="5000">5秒</SelectItem>
                    <SelectItem value="10000">10秒</SelectItem>
                    <SelectItem value="30000">30秒</SelectItem>
                    <SelectItem value="60000">1分钟</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">数据流列表</h3>
              <Badge variant="outline">{filteredStreams.length} 个流</Badge>
            </div>

            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {filteredStreams.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-8 w-8 mx-auto mb-2" />
                    <p>暂无数据流</p>
                    <p className="text-sm">点击"创建数据流"开始</p>
                  </div>
                ) : (
                  filteredStreams.map(renderStreamCard)
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* 流详情 */}
        <div className="lg:col-span-2">
          {selectedStream ? (
            renderStreamDetail(selectedStream)
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Monitor className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">选择数据流查看详情</h3>
                <p className="text-muted-foreground">从左侧列表中选择一个数据流来查看实时数据和统计信息</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
