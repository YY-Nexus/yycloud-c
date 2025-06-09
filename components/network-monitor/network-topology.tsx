"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Wifi, Router, Smartphone, Laptop, Tv, Printer, Server, HardDrive, RefreshCw } from "lucide-react"
import type { NetworkTopology, NetworkDevice } from "@/types/network-monitor"
import { discoverNetworkDevices, generateNetworkTopology } from "@/lib/network-monitor"

interface NetworkTopologyProps {
  initialData?: NetworkTopology
}

export function NetworkTopology({ initialData }: NetworkTopologyProps) {
  const [topology, setTopology] = useState<NetworkTopology | null>(initialData || null)
  const [loading, setLoading] = useState<boolean>(!initialData)
  const [view, setView] = useState<"graph" | "list">("graph")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 加载网络拓扑数据
  const loadTopologyData = async () => {
    setLoading(true)
    try {
      const devices = await discoverNetworkDevices()
      const topologyData = generateNetworkTopology(devices)
      setTopology(topologyData)
    } catch (error) {
      console.error("加载网络拓扑数据失败:", error)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    if (!initialData) {
      loadTopologyData()
    }
  }, [initialData])

  // 绘制网络拓扑图
  useEffect(() => {
    if (!canvasRef.current || !topology || view !== "graph") return

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

    // 设置设备位置
    const devicePositions: { [key: string]: { x: number; y: number } } = {}
    const { devices, connections } = topology

    // 找到路由器作为中心
    const router = devices.find((d) => d.type === "router")
    if (router) {
      devicePositions[router.id] = {
        x: rect.width / 2,
        y: rect.height / 2,
      }

      // 找到直接连接到路由器的设备
      const directConnections = connections.filter((c) => c.source === router.id || c.target === router.id)
      const directDevices = directConnections.map((c) => (c.source === router.id ? c.target : c.source))

      // 计算直接连接设备的位置（围绕路由器的圆形布局）
      const radius = Math.min(rect.width, rect.height) * 0.35
      directDevices.forEach((deviceId, index) => {
        const angle = (index * 2 * Math.PI) / directDevices.length
        devicePositions[deviceId] = {
          x: rect.width / 2 + radius * Math.cos(angle),
          y: rect.height / 2 + radius * Math.sin(angle),
        }
      })

      // 计算间接连接设备的位置
      devices.forEach((device) => {
        if (!devicePositions[device.id]) {
          // 找到这个设备连接到的已有位置的设备
          const connectedTo = connections.find(
            (c) =>
              (c.source === device.id && devicePositions[c.target]) ||
              (c.target === device.id && devicePositions[c.source]),
          )

          if (connectedTo) {
            const connectedId = connectedTo.source === device.id ? connectedTo.target : connectedTo.source
            const connectedPos = devicePositions[connectedId]
            const angle = Math.random() * 2 * Math.PI
            const distance = 80 + Math.random() * 40

            devicePositions[device.id] = {
              x: connectedPos.x + distance * Math.cos(angle),
              y: connectedPos.y + distance * Math.sin(angle),
            }
          } else {
            // 孤立设备，放在随机位置
            devicePositions[device.id] = {
              x: 50 + Math.random() * (rect.width - 100),
              y: 50 + Math.random() * (rect.height - 100),
            }
          }
        }
      })

      // 绘制连接线
      ctx.lineWidth = 2
      connections.forEach((connection) => {
        const sourcePos = devicePositions[connection.source]
        const targetPos = devicePositions[connection.target]

        if (sourcePos && targetPos) {
          ctx.beginPath()
          ctx.moveTo(sourcePos.x, sourcePos.y)
          ctx.lineTo(targetPos.x, targetPos.y)

          // 根据连接类型和强度设置线条样式
          if (connection.type === "wired") {
            ctx.strokeStyle = "#10b981" // 有线连接使用绿色
            ctx.setLineDash([])
          } else {
            ctx.strokeStyle = "#0ea5e9" // 无线连接使用蓝色
            const strength = connection.strength || 50
            if (strength > 80) {
              ctx.setLineDash([])
            } else if (strength > 50) {
              ctx.setLineDash([5, 3])
            } else {
              ctx.setLineDash([3, 5])
            }
          }

          ctx.stroke()

          // 绘制连接强度标签
          if (connection.strength) {
            const midX = (sourcePos.x + targetPos.x) / 2
            const midY = (sourcePos.y + targetPos.y) / 2
            ctx.fillStyle = "#64748b"
            ctx.font = "10px sans-serif"
            ctx.textAlign = "center"
            ctx.fillText(`${connection.strength}%`, midX, midY - 5)
          }
        }
      })

      // 绘制设备节点
      devices.forEach((device) => {
        const pos = devicePositions[device.id]
        if (!pos) return

        // 绘制设备图标背景
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI)
        ctx.fillStyle = device.isOnline ? "#f8fafc" : "#e2e8f0"
        ctx.fill()
        ctx.strokeStyle = device.isOnline ? "#0ea5e9" : "#94a3b8"
        ctx.lineWidth = 2
        ctx.stroke()

        // 绘制设备图标
        ctx.fillStyle = device.isOnline ? "#0f172a" : "#64748b"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        // 根据设备类型绘制不同的图标
        const icon = getDeviceIcon(device.type)
        ctx.fillText(icon, pos.x, pos.y)

        // 绘制设备名称
        ctx.fillStyle = "#0f172a"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(device.name, pos.x, pos.y + 35)

        // 绘制连接类型标签（仅对无线设备）
        if (device.connectionType && device.connectionType.startsWith("wireless")) {
          ctx.fillStyle = "#64748b"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(
            device.connectionType === "wireless_2.4GHz"
              ? "2.4G"
              : device.connectionType === "wireless_5GHz"
                ? "5G"
                : "6G",
            pos.x,
            pos.y + 50,
          )
        }
      })
    }
  }, [topology, view])

  // 获取设备图标
  const getDeviceIcon = (type: string): string => {
    switch (type) {
      case "router":
        return "R"
      case "switch":
        return "S"
      case "accessPoint":
        return "AP"
      case "computer":
        return "PC"
      case "mobile":
        return "M"
      case "iot":
        return "IoT"
      default:
        return "?"
    }
  }

  // 获取设备图标组件
  const getDeviceIconComponent = (device: NetworkDevice) => {
    const iconProps = { className: "h-5 w-5", strokeWidth: 1.5 }
    switch (device.type) {
      case "router":
        return <Router {...iconProps} />
      case "switch":
        return <Server {...iconProps} />
      case "accessPoint":
        return <Wifi {...iconProps} />
      case "computer":
        return <Laptop {...iconProps} />
      case "mobile":
        return <Smartphone {...iconProps} />
      case "iot":
        if (device.model?.includes("TV") || device.model?.includes("电视")) {
          return <Tv {...iconProps} />
        } else if (device.model?.includes("打印机") || device.model?.includes("Printer")) {
          return <Printer {...iconProps} />
        } else {
          return <HardDrive {...iconProps} />
        }
      default:
        return <HardDrive {...iconProps} />
    }
  }

  // 获取连接类型标签
  const getConnectionTypeLabel = (type?: string) => {
    if (!type) return "未知"
    switch (type) {
      case "wired":
        return "有线"
      case "wireless_2.4GHz":
        return "2.4GHz无线"
      case "wireless_5GHz":
        return "5GHz无线"
      case "wireless_6GHz":
        return "6GHz无线"
      default:
        return "未知"
    }
  }

  // 获取设备类型标签
  const getDeviceTypeLabel = (type: string) => {
    switch (type) {
      case "router":
        return "路由器"
      case "switch":
        return "交换机"
      case "accessPoint":
        return "接入点"
      case "computer":
        return "计算机"
      case "mobile":
        return "移动设备"
      case "iot":
        return "物联网设备"
      default:
        return "其他"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>网络拓扑</CardTitle>
          <CardDescription>您的网络设备连接情况</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={loadTopologyData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "扫描中..." : "扫描网络"}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={view} onValueChange={(v) => setView(v as "graph" | "list")} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="graph">图形视图</TabsTrigger>
            <TabsTrigger value="list">列表视图</TabsTrigger>
          </TabsList>

          <TabsContent value="graph" className="space-y-4">
            {topology ? (
              <div ref={containerRef} className="relative w-full h-[400px] border rounded-md overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full" />
                <div className="absolute bottom-2 right-2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-md text-xs">
                  <div className="flex items-center mb-1">
                    <div className="w-4 h-0.5 bg-[#10b981] mr-2"></div>
                    <span>有线连接</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-0.5 bg-[#0ea5e9] mr-2 border-dashed border-t border-[#0ea5e9]"></div>
                    <span>无线连接</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] border rounded-md">
                <p className="text-muted-foreground">
                  {loading ? "正在扫描网络设备..." : "暂无网络拓扑数据，请点击"扫描网络"按钮"}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {topology ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">设备列表</h3>
                  <div className="border rounded-md divide-y">
                    {topology.devices.map((device) => (
                      <div key={device.id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={\`flex items-center justify-center w-10 h-10 rounded-full ${
                              device.isOnline ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {getDeviceIconComponent(device)}
                          </div>
                          <div>
                            <div className="font-medium flex items-center">
                              {device.name}
                              {device.isOnline ? (
                                <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 text-xs">
                                  在线
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-500 text-xs">
                                  离线
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {device.ipAddress} • {getDeviceTypeLabel(device.type)}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-right">
                          <div>{getConnectionTypeLabel(device.connectionType)}</div>
                          {device.signalStrength && (
                            <div className="text-muted-foreground">信号: {device.signalStrength} dBm</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">连接列表</h3>
                  <div className="border rounded-md divide-y">
                    {topology.connections.map((connection, index) => {
                      const source = topology.devices.find((d) => d.id === connection.source)
                      const target = topology.devices.find((d) => d.id === connection.target)
                      if (!source || !target) return null

                      return (
                        <div key={index} className="p-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="font-medium">{source.name}</div>
                            <div
                              className={`px-2 py-1 rounded text-xs ${
                                connection.type === "wired"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-blue-50 text-blue-600"
                              }`}
                            >
                              {connection.type === "wired" ? "有线" : "无线"}
                            </div>
                            <div className="font-medium">{target.name}</div>
                          </div>
                          <div className="text-sm">
                            {connection.strength && <div>信号强度: {connection.strength}%</div>}
                            {connection.bandwidth && <div>带宽: {connection.bandwidth} Mbps</div>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] border rounded-md">
                <p className="text-muted-foreground">
                  {loading ? "正在扫描网络设备..." : "暂无网络拓扑数据，请点击"扫描网络"按钮"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
