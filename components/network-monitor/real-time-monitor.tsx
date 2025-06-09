"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Play, Pause, RefreshCw, Wifi, WifiOff, Activity, Download, Clock } from "lucide-react"

interface RealTimeMonitorProps {
  autoStart?: boolean
}

export function RealTimeMonitor({ autoStart = false }: RealTimeMonitorProps) {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(autoStart)
  const [activeTab, setActiveTab] = useState<"overview" | "bandwidth" | "latency">("overview")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [monitorData, setMonitorData] = useState({
    download: 0,
    upload: 0,
    latency: 0,
    jitter: 0,
    packetLoss: 0,
    connectionStatus: "offline" as "online" | "offline" | "unstable",
    bandwidth: {
      current: 0,
      max: 100,
      utilization: 0,
    },
    devices: {
      total: 0,
      online: 0,
    },
  })
  const [dataPoints, setDataPoints] = useState<
    Array<{ time: Date; download: number; upload: number; latency: number }>
  >([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 开始监控
  const startMonitoring = () => {
    setIsMonitoring(true)
    updateMonitorData()
  }

  // 停止监控
  const stopMonitoring = () => {
    setIsMonitoring(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  // 更新监控数据
  const updateMonitorData = () => {
    // 模拟获取实时数据
    const now = new Date()
    const newData = {
      download: 10 + Math.random() * 90, // 10-100 Mbps
      upload: 5 + Math.random() * 45, // 5-50 Mbps
      latency: 10 + Math.random() * 90, // 10-100 ms
      jitter: Math.random() * 10, // 0-10 ms
      packetLoss: Math.random() * 2, // 0-2%
      connectionStatus: Math.random() > 0.05 ? "online" : Math.random() > 0.5 ? "unstable" : "offline",
      bandwidth: {
        current: 10 + Math.random() * 90, // 10-100 Mbps
        max: 100,
        utilization: Math.random() * 100, // 0-100%
      },
      devices: {
        total: 8,
        online: 5 + Math.floor(Math.random() * 3), // 5-7
      },
    } as const

    setMonitorData(newData)
    setLastUpdated(now)

    // 添加新的数据点
    setDataPoints((prev) => {
      const newPoints = [
        ...prev,
        { time: now, download: newData.download, upload: newData.upload, latency: newData.latency },
      ]
      // 保留最近30个数据点
      return newPoints.slice(-30)
    })

    // 如果仍在监控，设置下一次更新
    if (isMonitoring) {
      timerRef.current = setTimeout(updateMonitorData, 2000)
    }
  }

  // 绘制实时图表
  useEffect(() => {
    if (!canvasRef.current || dataPoints.length < 2) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布尺寸
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // 清除画布
    ctx.clearRect(0, 0, rect.width, rect.height)

    // 绘制背景网格
    ctx.strokeStyle = "#f1f5f9"
    ctx.lineWidth = 1
    const gridSize = rect.height / 4
    for (let i = 1; i < 4; i++) {
      const y = i * gridSize
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(rect.width, y)
      ctx.stroke()
    }

    // 确定数据范围
    let maxValue = 0
    if (activeTab === "overview" || activeTab === "bandwidth") {
      maxValue = Math.max(
        ...dataPoints.map((dp) => Math.max(dp.download, dp.upload)),
        100, // 最小最大值为100Mbps
      )
    } else if (activeTab === "latency") {
      maxValue = Math.max(
        ...dataPoints.map((dp) => dp.latency),
        100, // 最小最大值为100ms
      )
    }

    // 绘制数据线
    const drawLine = (
      data: number[],
      color: string,
      fillColor: string,
      label: string,
      yScale: (val: number) => number,
    ) => {
      if (data.length < 2) return

      // 绘制填充区域
      ctx.beginPath()
      ctx.moveTo(0, rect.height)
      data.forEach((value, index) => {
        const x = (index / (data.length - 1)) * rect.width
        const y = yScale(value)
        ctx.lineTo(x, y)
      })
      ctx.lineTo(rect.width, rect.height)
      ctx.closePath()
      ctx.fillStyle = fillColor
      ctx.fill()

      // 绘制线条
      ctx.beginPath()
      data.forEach((value, index) => {
        const x = (index / (data.length - 1)) * rect.width
        const y = yScale(value)
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()

      // 绘制最新值标签
      if (data.length > 0) {
        const lastValue = data[data.length - 1]
        const x = rect.width - 5
        const y = yScale(lastValue) - 15
        ctx.fillStyle = color
        ctx.font = "12px sans-serif"
        ctx.textAlign = "right"
        ctx.fillText(`${label}: ${lastValue.toFixed(1)}`, x, y)
      }
    }

    // Y轴缩放函数
    const yScale = (value: number) => rect.height - (value / maxValue) * rect.height

    if (activeTab === "overview" || activeTab === "bandwidth") {
      // 绘制下载速度线
      drawLine(
        dataPoints.map((dp) => dp.download),
        "#0ea5e9",
        "rgba(14, 165, 233, 0.2)",
        "下载",
        yScale,
      )

      // 绘制上传速度线
      drawLine(
        dataPoints.map((dp) => dp.upload),
        "#10b981",
        "rgba(16, 185, 129, 0.2)",
        "上传",
        yScale,
      )
    } else if (activeTab === "latency") {
      // 绘制延迟线
      drawLine(
        dataPoints.map((dp) => dp.latency),
        "#f59e0b",
        "rgba(245, 158, 11, 0.2)",
        "延迟",
        yScale,
      )
    }

    // 绘制Y轴标签
    ctx.fillStyle = "#64748b"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(`${maxValue}`, 5, 15)
    ctx.fillText("0", 5, rect.height - 5)

    // 绘制X轴时间标签
    if (dataPoints.length > 0) {
      const firstTime = dataPoints[0].time
      const lastTime = dataPoints[dataPoints.length - 1].time
      ctx.fillText(format(firstTime, "HH:mm:ss", { locale: zhCN }), 5, rect.height - 15)
      ctx.textAlign = "right"
      ctx.fillText(format(lastTime, "HH:mm:ss", { locale: zhCN }), rect.width - 5, rect.height - 15)
    }
  }, [dataPoints, activeTab])

  // 组件挂载时自动开始监控
  useEffect(() => {
    if (autoStart) {
      startMonitoring()
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [autoStart])

  // 获取连接状态标签和颜色
  const getConnectionStatusBadge = () => {
    switch (monitorData.connectionStatus) {
      case "online":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">在线</Badge>
      case "offline":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">离线</Badge>
      case "unstable":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">不稳定</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>实时网络监控</CardTitle>
          <CardDescription>监控网络连接的实时状态</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isMonitoring ? "outline" : "default"}
            size="sm"
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
          >
            {isMonitoring ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                暂停
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                开始监控
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={updateMonitorData} disabled={isMonitoring}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {monitorData.connectionStatus === "online" ? (
                      <Wifi className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <WifiOff className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <div className="text-sm font-medium">连接状态</div>
                  </div>
                  {getConnectionStatusBadge()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-blue-500 mr-2" />
                    <div className="text-sm font-medium">带宽利用率</div>
                  </div>
                  <div className="text-sm font-medium">{monitorData.bandwidth.utilization.toFixed(1)}%</div>
                </div>
                <Progress value={monitorData.bandwidth.utilization} className="h-1 mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Download className="h-5 w-5 text-purple-500 mr-2" />
                    <div className="text-sm font-medium">下载/上传</div>
                  </div>
                  <div className="text-sm font-medium">
                    {monitorData.download.toFixed(1)}/{monitorData.upload.toFixed(1)} Mbps
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-orange-500 mr-2" />
                    <div className="text-sm font-medium">延迟/丢包</div>
                  </div>
                  <div className="text-sm font-medium">
                    {monitorData.latency.toFixed(0)}ms/{monitorData.packetLoss.toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList>
                  <TabsTrigger value="overview">概览</TabsTrigger>
                  <TabsTrigger value="bandwidth">带宽</TabsTrigger>
                  <TabsTrigger value="latency">延迟</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="text-xs text-muted-foreground">
                最后更新: {format(lastUpdated, "HH:mm:ss", { locale: zhCN })}
              </div>
            </div>

            <div className="border rounded-md p-4">
              {dataPoints.length > 0 ? (
                <div className="h-[200px] w-full">
                  <canvas ref={canvasRef} className="w-full h-full" />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px]">
                  <p className="text-muted-foreground">
                    {isMonitoring ? "正在收集数据..." : "点击 “开始监控” 按钮开始收集数据"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div>
              设备: {monitorData.devices.online}/{monitorData.devices.total} 在线
            </div>
            <div>抖动: {monitorData.jitter.toFixed(1)}ms</div>
            <div className="text-muted-foreground">{isMonitoring ? "自动更新中..." : "监控已暂停"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
