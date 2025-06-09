/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 设备管理页面 (检查修复版)
 * ==========================================
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Smartphone,
  Laptop,
  Monitor,
  Wifi,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Power,
  Settings,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

interface Device {
  id: string
  name: string
  type: "smartphone" | "laptop" | "desktop" | "router" | "other"
  status: "online" | "offline" | "maintenance"
  ipAddress: string
  macAddress: string
  lastSeen: string
  location: string
  description?: string
}

export default function DeviceManagementPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // 模拟设备数据
  useEffect(() => {
    const mockDevices: Device[] = [
      {
        id: "1",
        name: "iPhone 15 Pro",
        type: "smartphone",
        status: "online",
        ipAddress: "192.168.1.100",
        macAddress: "AA:BB:CC:DD:EE:FF",
        lastSeen: new Date().toISOString(),
        location: "客厅",
        description: "主要手机设备",
      },
      {
        id: "2",
        name: "MacBook Pro",
        type: "laptop",
        status: "online",
        ipAddress: "192.168.1.101",
        macAddress: "11:22:33:44:55:66",
        lastSeen: new Date().toISOString(),
        location: "书房",
        description: "工作笔记本",
      },
      {
        id: "3",
        name: "台式机",
        type: "desktop",
        status: "offline",
        ipAddress: "192.168.1.102",
        macAddress: "77:88:99:AA:BB:CC",
        lastSeen: new Date(Date.now() - 3600000).toISOString(),
        location: "书房",
        description: "游戏和开发用机",
      },
      {
        id: "4",
        name: "路由器",
        type: "router",
        status: "online",
        ipAddress: "192.168.1.1",
        macAddress: "DD:EE:FF:00:11:22",
        lastSeen: new Date().toISOString(),
        location: "客厅",
        description: "主路由器",
      },
    ]

    setDevices(mockDevices)
    setFilteredDevices(mockDevices)
  }, [])

  // 应用筛选
  useEffect(() => {
    let filtered = devices

    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(
        (device) =>
          device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.ipAddress.includes(searchTerm) ||
          device.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // 状态筛选
    if (statusFilter !== "all") {
      filtered = filtered.filter((device) => device.status === statusFilter)
    }

    // 类型筛选
    if (typeFilter !== "all") {
      filtered = filtered.filter((device) => device.type === typeFilter)
    }

    setFilteredDevices(filtered)
  }, [devices, searchTerm, statusFilter, typeFilter])

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "smartphone":
        return Smartphone
      case "laptop":
        return Laptop
      case "desktop":
        return Monitor
      case "router":
        return Wifi
      default:
        return Settings
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800"
      case "offline":
        return "bg-gray-100 text-gray-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusName = (status: string) => {
    switch (status) {
      case "online":
        return "在线"
      case "offline":
        return "离线"
      case "maintenance":
        return "维护中"
      default:
        return status
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "smartphone":
        return "智能手机"
      case "laptop":
        return "笔记本电脑"
      case "desktop":
        return "台式电脑"
      case "router":
        return "路由器"
      default:
        return "其他设备"
    }
  }

  const handleDeviceAction = (deviceId: string, action: string) => {
    const device = devices.find((d) => d.id === deviceId)
    if (!device) return

    switch (action) {
      case "edit":
        toast({
          title: "编辑设备",
          description: `正在编辑设备: ${device.name}`,
        })
        break
      case "delete":
        if (confirm(`确定要删除设备 "${device.name}" 吗？`)) {
          setDevices(devices.filter((d) => d.id !== deviceId))
          toast({
            title: "设备已删除",
            description: `设备 "${device.name}" 已从列表中移除`,
          })
        }
        break
      case "restart":
        toast({
          title: "重启设备",
          description: `正在重启设备: ${device.name}`,
        })
        break
      default:
        break
    }
  }

  const deviceStats = {
    total: devices.length,
    online: devices.filter((d) => d.status === "online").length,
    offline: devices.filter((d) => d.status === "offline").length,
    maintenance: devices.filter((d) => d.status === "maintenance").length,
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">设备管理</h1>
          <p className="text-muted-foreground">管理和监控您的网络设备</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          添加设备
        </Button>
      </div>

      {/* 设备统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总设备数</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceStats.total}</div>
            <p className="text-xs text-muted-foreground">已注册设备</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在线设备</CardTitle>
            <Power className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deviceStats.online}</div>
            <p className="text-xs text-muted-foreground">正常运行</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">离线设备</CardTitle>
            <Power className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{deviceStats.offline}</div>
            <p className="text-xs text-muted-foreground">未连接</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">维护中</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{deviceStats.maintenance}</div>
            <p className="text-xs text-muted-foreground">需要关注</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">设备列表</TabsTrigger>
          <TabsTrigger value="network">网络拓扑</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* 搜索和筛选 */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索设备名称、IP地址或位置..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="online">在线</SelectItem>
                <SelectItem value="offline">离线</SelectItem>
                <SelectItem value="maintenance">维护中</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有类型</SelectItem>
                <SelectItem value="smartphone">智能手机</SelectItem>
                <SelectItem value="laptop">笔记本电脑</SelectItem>
                <SelectItem value="desktop">台式电脑</SelectItem>
                <SelectItem value="router">路由器</SelectItem>
                <SelectItem value="other">其他设备</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 设备列表 */}
          <div className="grid gap-4">
            {filteredDevices.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">没有找到设备</h3>
                  <p className="text-muted-foreground">尝试调整搜索条件或筛选器</p>
                </CardContent>
              </Card>
            ) : (
              filteredDevices.map((device) => {
                const DeviceIcon = getDeviceIcon(device.type)
                return (
                  <Card key={device.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-muted rounded-lg">
                            <DeviceIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{device.name}</h3>
                            <p className="text-sm text-muted-foreground">{getTypeName(device.type)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(device.status)}>{getStatusName(device.status)}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDeviceAction(device.id, "edit")}>
                                <Edit className="mr-2 h-4 w-4" />
                                编辑
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeviceAction(device.id, "restart")}>
                                <Power className="mr-2 h-4 w-4" />
                                重启
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeviceAction(device.id, "delete")}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">IP 地址</p>
                          <p className="font-mono">{device.ipAddress}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">MAC 地址</p>
                          <p className="font-mono">{device.macAddress}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">位置</p>
                          <p>{device.location}</p>
                        </div>
                      </div>
                      {device.description && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">{device.description}</p>
                        </div>
                      )}
                      <div className="mt-2 text-xs text-muted-foreground">
                        最后在线: {new Date(device.lastSeen).toLocaleString("zh-CN")}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>网络拓扑图</CardTitle>
              <CardDescription>显示设备之间的网络连接关系</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Wifi className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">网络拓扑图</h3>
                <p className="text-muted-foreground">此功能正在开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
