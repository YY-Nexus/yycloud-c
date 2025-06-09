"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Server,
  Laptop,
  HardDrive,
  Database,
  Cloud,
  Code,
  ChevronRight,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
  Settings,
  Save,
  X,
  Cpu,
  MemoryStickIcon as Memory,
  HardDriveIcon,
  Activity,
  Clock,
  Shield,
  LogOut,
  Key,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/hooks/use-mobile"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import AdminLoginDialog from "./admin-login-dialog"
import ChangePasswordDialog from "./change-password-dialog"
import { isAdminAuthenticated, refreshAdminSession, getSessionRemainingTime, adminLogout } from "@/lib/admin-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ServerInfoCategory = "overview" | "devices" | "storage" | "nas" | "ssd" | "workflow" | "cloud" | "monitor"

interface CategoryInfo {
  icon: React.ReactNode
  title: string
  color: string
  description: string
  badge?: {
    text: string
    variant: "default" | "secondary" | "destructive" | "outline"
  }
}

// 模拟服务器性能数据
const generatePerformanceData = () => {
  const now = new Date()
  const data = []

  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000)
    data.push({
      time: `${time.getHours().toString().padStart(2, "0")}:00`,
      cpu: Math.floor(Math.random() * 30) + 10,
      memory: Math.floor(Math.random() * 40) + 30,
      disk: Math.floor(Math.random() * 20) + 5,
      network: Math.floor(Math.random() * 50) + 10,
    })
  }

  return data
}

export default function ServerInfoHub() {
  const [activeCategory, setActiveCategory] = useState<ServerInfoCategory | null>(null)
  const [animationComplete, setAnimationComplete] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState(new Date())
  const [performanceData, setPerformanceData] = useState(generatePerformanceData())
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportFormat, setExportFormat] = useState("pdf")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)

  const contentRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 滚动到内容顶部
  useEffect(() => {
    if (activeCategory && contentRef.current) {
      if (isMobile) {
        window.scrollTo({
          top: contentRef.current.offsetTop - 20,
          behavior: "smooth",
        })
      }
    }
  }, [activeCategory, isMobile])

  // 自动刷新功能
  useEffect(() => {
    if (autoRefresh) {
      refreshTimerRef.current = setInterval(() => {
        refreshData()
      }, 30000) // 每30秒刷新一次
    } else if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current)
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }
    }
  }, [autoRefresh])

  // 检查Admin权限
  useEffect(() => {
    setIsAdmin(isAdminAuthenticated())
    setSessionTime(getSessionRemainingTime())

    // 每分钟检查一次会话状态
    const sessionTimer = setInterval(() => {
      const authenticated = isAdminAuthenticated()
      setIsAdmin(authenticated)
      setSessionTime(getSessionRemainingTime())

      if (!authenticated && isEditing) {
        setIsEditing(false)
      }
    }, 60000)

    return () => clearInterval(sessionTimer)
  }, [isEditing])

  const refreshData = () => {
    setIsRefreshing(true)

    // 模拟数据刷新
    setTimeout(() => {
      setPerformanceData(generatePerformanceData())
      setLastRefreshed(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  const handleExport = () => {
    // 模拟导出过程
    setTimeout(() => {
      setShowExportDialog(false)
      // 在实际应用中，这里会触发文件下载
      alert(`报告已导出为${exportFormat.toUpperCase()}格式`)
    }, 1500)
  }

  const handleLogout = () => {
    adminLogout()
    setIsAdmin(false)
    setIsEditing(false)
  }

  const categories: Record<ServerInfoCategory, CategoryInfo> = {
    overview: {
      icon: <Server className="h-6 w-6" />,
      title: "服务器概览",
      color: "from-blue-500 to-blue-700",
      description: "YanYu Cloud³本地服务器基本信息和配置概览",
      badge: {
        text: "核心",
        variant: "default",
      },
    },
    devices: {
      icon: <Laptop className="h-6 w-6" />,
      title: "设备明细",
      color: "from-purple-500 to-purple-700",
      description: "当前可用的计算设备详细信息",
    },
    storage: {
      icon: <HardDrive className="h-6 w-6" />,
      title: "移动存储",
      color: "from-green-500 to-green-700",
      description: "移动存储设备配置和使用情况",
    },
    nas: {
      icon: <Database className="h-6 w-6" />,
      title: "NAS服务器",
      color: "from-amber-500 to-amber-700",
      description: "网络附加存储服务器配置和状态",
      badge: {
        text: "重要",
        variant: "secondary",
      },
    },
    ssd: {
      icon: <HardDriveIcon className="h-6 w-6" />,
      title: "SSD配置",
      color: "from-red-500 to-red-700",
      description: "固态硬盘配置和性能数据",
    },
    workflow: {
      icon: <Code className="h-6 w-6" />,
      title: "构建流程",
      color: "from-cyan-500 to-cyan-700",
      description: "服务器构建流程和软件配置指南",
      badge: {
        text: "指南",
        variant: "outline",
      },
    },
    cloud: {
      icon: <Cloud className="h-6 w-6" />,
      title: "云服务",
      color: "from-indigo-500 to-indigo-700",
      description: "云服务提供商和集成信息",
    },
    monitor: {
      icon: <Activity className="h-6 w-6" />,
      title: "性能监控",
      color: "from-emerald-500 to-emerald-700",
      description: "服务器实时性能监控和历史数据",
      badge: {
        text: "实时",
        variant: "destructive",
      },
    },
  }

  const handleCategoryClick = (category: ServerInfoCategory) => {
    if (!animationComplete) return

    setAnimationComplete(false)
    setIsEditing(false) // 切换类别时退出编辑模式

    if (activeCategory === category) {
      setActiveCategory(null)
    } else {
      setActiveCategory(category)
    }

    setTimeout(() => {
      setAnimationComplete(true)
    }, 300)
  }

  const renderDeviceStatus = (status: boolean) => {
    return status ? (
      <span className="flex items-center text-green-600">
        <CheckCircle2 className="h-4 w-4 mr-1" />
        <span>已配置</span>
      </span>
    ) : (
      <span className="flex items-center text-amber-600">
        <AlertCircle className="h-4 w-4 mr-1" />
        <span>待配置</span>
      </span>
    )
  }

  const handleEditClick = () => {
    if (!isAdmin) {
      setShowAdminLogin(true)
      return
    }

    refreshAdminSession()
    setIsEditing(!isEditing)
  }

  const renderContent = () => {
    switch (activeCategory) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">YanYu Cloud³本地服务器</h3>
              <Badge variant="outline" className="bg-blue-50">
                核心基础设施
              </Badge>
            </div>

            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">概述</TabsTrigger>
                <TabsTrigger value="specs">规格</TabsTrigger>
                <TabsTrigger value="status">状态</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="server-name">服务器名称</Label>
                        <Input id="server-name" defaultValue="YanYu Cloud³本地服务器" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="server-location">位置</Label>
                        <Input id="server-location" defaultValue="主机房" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="server-purpose">主要用途</Label>
                        <Input id="server-purpose" defaultValue="代码存储、应用部署和数据备份" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="server-users">使用人数</Label>
                        <Select defaultValue="1-3">
                          <SelectTrigger id="server-users">
                            <SelectValue placeholder="选择使用人数" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1人</SelectItem>
                            <SelectItem value="1-3">1-3人</SelectItem>
                            <SelectItem value="4-10">4-10人</SelectItem>
                            <SelectItem value="10+">10人以上</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600">
                      YanYu Cloud³本地服务器是一个为小型团队设计的高性能本地开发和部署环境，
                      专注于代码存储、应用部署和数据备份。
                    </p>

                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>主用于代码存储、应用部署和数据备份</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>围绕：易操作、易维护、便捷性、稳定性为核心</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>使用人数：1-3人</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>总存储容量：32TB（NAS）+ 4TB（SSD）</span>
                      </li>
                    </ul>
                  </>
                )}
              </TabsContent>

              <TabsContent value="specs" className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700">NAS服务器</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nas-model">型号</Label>
                        <Input id="nas-model" defaultValue="铁威马F4-423" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nas-cpu">处理器</Label>
                        <Input id="nas-cpu" defaultValue="Intel四核处理器" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nas-memory">内存</Label>
                        <Input id="nas-memory" defaultValue="8GB" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nas-disks">硬盘数量</Label>
                        <Select defaultValue="4">
                          <SelectTrigger id="nas-disks">
                            <SelectValue placeholder="选择硬盘数量" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1块</SelectItem>
                            <SelectItem value="2">2块</SelectItem>
                            <SelectItem value="3">3块</SelectItem>
                            <SelectItem value="4">4块</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <h4 className="font-medium text-gray-700 mt-4">SSD存储</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ssd-model">型号</Label>
                        <Input id="ssd-model" defaultValue="WD SN850X" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ssd-capacity">容量</Label>
                        <Input id="ssd-capacity" defaultValue="2TB" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ssd-interface">接口</Label>
                        <Input id="ssd-interface" defaultValue="PCIe 4.0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ssd-count">数量</Label>
                        <Select defaultValue="2">
                          <SelectTrigger id="ssd-count">
                            <SelectValue placeholder="选择SSD数量" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1块</SelectItem>
                            <SelectItem value="2">2块</SelectItem>
                            <SelectItem value="3">3块</SelectItem>
                            <SelectItem value="4">4块</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">NAS服务器</h4>
                      <p className="text-sm text-gray-600">铁威马F4-423</p>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>4盘位NAS</li>
                        <li>Intel四核处理器</li>
                        <li>8GB内存</li>
                        <li>4×8TB企业级硬盘</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">SSD存储</h4>
                      <p className="text-sm text-gray-600">高速固态存储</p>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>2×2TB NVMe M.2 SSD</li>
                        <li>PCIe 4.0接口</li>
                        <li>读取速度：7000MB/s</li>
                        <li>写入速度：5300MB/s</li>
                      </ul>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="status" className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700">状态设置</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nas-status">NAS状态</Label>
                        <Select defaultValue="online">
                          <SelectTrigger id="nas-status">
                            <SelectValue placeholder="选择NAS状态" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online">在线</SelectItem>
                            <SelectItem value="offline">离线</SelectItem>
                            <SelectItem value="maintenance">维护中</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="storage-usage">存储使用率</Label>
                        <Input id="storage-usage" defaultValue="32" type="number" min="0" max="100" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backup-status">最近备份</Label>
                        <Input id="backup-status" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="network-speed">网络连接</Label>
                        <Select defaultValue="1Gbps">
                          <SelectTrigger id="network-speed">
                            <SelectValue placeholder="选择网络速度" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="100Mbps">100Mbps</SelectItem>
                            <SelectItem value="1Gbps">1Gbps</SelectItem>
                            <SelectItem value="2.5Gbps">2.5Gbps</SelectItem>
                            <SelectItem value="10Gbps">10Gbps</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                      <Switch id="auto-backup" />
                      <Label htmlFor="auto-backup">启用自动备份</Label>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "NAS状态", value: "在线", color: "text-green-600" },
                        { label: "存储使用率", value: "32%", color: "text-blue-600" },
                        { label: "备份状态", value: "最近：昨天", color: "text-green-600" },
                        { label: "网络连接", value: "1Gbps", color: "text-blue-600" },
                      ].map((item, i) => (
                        <div key={i} className="bg-gray-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                          <p className={`font-medium ${item.color}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        系统运行正常，所有服务可用
                      </p>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className={isEditing ? "text-red-600 border-red-200" : "text-blue-600 border-blue-200"}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    取消编辑
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-1" />
                    编辑配置
                  </>
                )}
              </Button>

              {isEditing && (
                <Button size="sm" className="bg-blue-600">
                  <Save className="h-4 w-4 mr-1" />
                  保存更改
                </Button>
              )}
            </div>
          </div>
        )
      case "devices":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">现有设备明细</h3>
              <Badge variant="outline" className="bg-purple-50">
                4台设备
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  name: "Mac M4 Pro Max",
                  type: "笔记本",
                  specs: "128GB内存 + 2TB存储",
                  status: true,
                  details: "主力开发机，用于代码编写和测试",
                },
                {
                  name: "iMac M4",
                  type: "一体机",
                  specs: "32GB内存 + 2TB存储",
                  status: true,
                  details: "用于设计和多任务处理",
                },
                {
                  name: "iMac M1",
                  type: "一体机",
                  specs: "8GB内存 + 512GB存储",
                  status: true,
                  details: "用于日常办公和轻量级任务",
                },
                {
                  name: "Mac M1 Pro",
                  type: "笔记本",
                  specs: "8GB内存 + 512GB存储",
                  status: true,
                  details: "移动办公和演示",
                },
              ].map((device, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-purple-700">{device.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {device.type} · {device.specs}
                      </p>
                    </div>
                    <div>{renderDeviceStatus(device.status)}</div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{device.details}</p>

                  {isEditing && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="text-purple-600 border-purple-200">
                        编辑
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                        删除
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className={isEditing ? "text-red-600 border-red-200" : "text-purple-600 border-purple-200"}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    取消编辑
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-1" />
                    管理设备
                  </>
                )}
              </Button>

              {isEditing && (
                <Button size="sm" className="bg-purple-600">
                  <Laptop className="h-4 w-4 mr-1" />
                  添加设备
                </Button>
              )}
            </div>
          </div>
        )
      case "storage":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">移动存储设备</h3>
              <Badge variant="outline" className="bg-green-50">
                高速传输
              </Badge>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium text-green-700">ThinkPlus联想2TB移动固态硬盘</h4>
                  <p className="text-sm text-gray-600 mt-1">USB3.2高速接口 · 读取速度2000MB/S</p>
                  <div className="mt-3">{renderDeviceStatus(true)}</div>
                </div>

                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-green-100 rounded-lg flex items-center justify-center">
                    <HardDrive className="h-12 w-12 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-700 mb-2">技术规格</h5>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 p-3 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="storage-capacity">容量</Label>
                      <Input id="storage-capacity" defaultValue="2TB" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storage-interface">接口</Label>
                      <Input id="storage-interface" defaultValue="USB 3.2" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storage-read">读取速度</Label>
                      <Input id="storage-read" defaultValue="2000MB/s" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storage-write">写入速度</Label>
                      <Input id="storage-write" defaultValue="1800MB/s" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "容量", value: "2TB" },
                      { label: "接口", value: "USB 3.2" },
                      { label: "读取速度", value: "2000MB/s" },
                      { label: "写入速度", value: "1800MB/s" },
                    ].map((spec, i) => (
                      <div key={i} className="bg-white p-2 rounded border border-gray-100">
                        <p className="text-xs text-gray-500">{spec.label}</p>
                        <p className="font-medium text-green-700">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-700 mb-2">使用场景</h5>
                {isEditing ? (
                  <div className="space-y-2 bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Input defaultValue="项目文件快速传输" />
                      <Button variant="ghost" size="icon" className="text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input defaultValue="大型媒体文件存储" />
                      <Button variant="ghost" size="icon" className="text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input defaultValue="跨设备数据同步" />
                      <Button variant="ghost" size="icon" className="text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      添加场景
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>项目文件快速传输</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>大型媒体文件存储</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>跨设备数据同步</span>
                    </li>
                  </ul>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                  className={isEditing ? "text-red-600 border-red-200" : "text-green-600 border-green-200"}
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      取消编辑
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-1" />
                      编辑配置
                    </>
                  )}
                </Button>

                {isEditing && (
                  <Button size="sm" className="bg-green-600">
                    <Save className="h-4 w-4 mr-1" />
                    保存更改
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      case "nas":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">NAS服务器配置</h3>
              <Badge variant="outline" className="bg-amber-50">
                核心存储
              </Badge>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-2 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 font-medium">铁威马F4-423（4盘位NAS、intel四核、8G内存）</p>
                  <a
                    href="https://www.terra-master.com/cn/compatibility/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-600 flex items-center mt-1 hover:underline"
                  >
                    查看兼容性 <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            <Tabs defaultValue="disks">
              <TabsList className="mb-4">
                <TabsTrigger value="disks">硬盘配置</TabsTrigger>
                <TabsTrigger value="network">网络设置</TabsTrigger>
                <TabsTrigger value="services">服务配置</TabsTrigger>
              </TabsList>

              <TabsContent value="disks" className="space-y-4">
                <h4 className="font-semibold text-amber-700">硬盘配置 ✖️4：</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-amber-200">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium text-amber-700">硬盘槽位 #{i}</h5>
                        {renderDeviceStatus(true)}
                      </div>

                      {isEditing ? (
                        <div className="mt-3 space-y-3 bg-amber-50 p-3 rounded-lg">
                          <div className="space-y-2">
                            <Label htmlFor={`disk-model-${i}`}>型号</Label>
                            <Input id={`disk-model-${i}`} defaultValue="西部数据（WD）8TB 企业级 DC HA340" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label htmlFor={`disk-rpm-${i}`} className="text-xs">
                                转速
                              </Label>
                              <Input id={`disk-rpm-${i}`} defaultValue="7200" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`disk-cache-${i}`} className="text-xs">
                                缓存
                              </Label>
                              <Input id={`disk-cache-${i}`} defaultValue="256MB" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`disk-interface-${i}`} className="text-xs">
                                接口
                              </Label>
                              <Input id={`disk-interface-${i}`} defaultValue="SATA" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`disk-tech-${i}`} className="text-xs">
                                技术
                              </Label>
                              <Input id={`disk-tech-${i}`} defaultValue="CMR垂直" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600 mt-2">西部数据（WD）8TB 企业级 DC HA340</p>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-amber-50 p-2 rounded">
                              <span className="text-gray-500">转速</span>
                              <p className="font-medium text-amber-700">7200转</p>
                            </div>
                            <div className="bg-amber-50 p-2 rounded">
                              <span className="text-gray-500">缓存</span>
                              <p className="font-medium text-amber-700">256MB</p>
                            </div>
                            <div className="bg-amber-50 p-2 rounded">
                              <span className="text-gray-500">接口</span>
                              <p className="font-medium text-amber-700">SATA</p>
                            </div>
                            <div className="bg-amber-50 p-2 rounded">
                              <span className="text-gray-500">技术</span>
                              <p className="font-medium text-amber-700">CMR垂直</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="network" className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-700 mb-3">网络配置</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">基本设置</h5>
                      {isEditing ? (
                        <div className="space-y-3 bg-amber-50 p-3 rounded-lg">
                          <div className="space-y-1">
                            <Label htmlFor="net-ip" className="text-xs">
                              IP地址
                            </Label>
                            <Input id="net-ip" defaultValue="192.168.1.100" />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="net-mask" className="text-xs">
                              子网掩码
                            </Label>
                            <Input id="net-mask" defaultValue="255.255.255.0" />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="net-gateway" className="text-xs">
                              网关
                            </Label>
                            <Input id="net-gateway" defaultValue="192.168.1.1" />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="net-dns" className="text-xs">
                              DNS
                            </Label>
                            <Input id="net-dns" defaultValue="8.8.8.8, 114.114.114.114" />
                          </div>
                        </div>
                      ) : (
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span className="text-gray-600">IP地址</span>
                            <span className="font-medium">192.168.1.100</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">子网掩码</span>
                            <span className="font-medium">255.255.255.0</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">网关</span>
                            <span className="font-medium">192.168.1.1</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">DNS</span>
                            <span className="font-medium">8.8.8.8, 114.114.114.114</span>
                          </li>
                        </ul>
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">高级设置</h5>
                      {isEditing ? (
                        <div className="space-y-3 bg-amber-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="net-link" className="text-xs">
                              链路聚合
                            </Label>
                            <Switch id="net-link" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="net-port" className="text-xs">
                              端口转发
                            </Label>
                            <Switch id="net-port" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="net-ddns" className="text-xs">
                              DDNS
                            </Label>
                            <Switch id="net-ddns" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="net-vpn" className="text-xs">
                              VPN
                            </Label>
                            <Switch id="net-vpn" />
                          </div>
                        </div>
                      ) : (
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span className="text-gray-600">链路聚合</span>
                            <span className="font-medium">已启用</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">端口转发</span>
                            <span className="font-medium">已配置</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">DDNS</span>
                            <span className="font-medium">已配置</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">VPN</span>
                            <span className="font-medium">未配置</span>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-700 mb-3">已配置服务</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { name: "文件共享", status: true, protocol: "SMB, NFS, AFP" },
                      { name: "媒体服务器", status: true, protocol: "DLNA, Plex" },
                      { name: "备份服务", status: true, protocol: "Rsync, Time Machine" },
                      { name: "下载中心", status: true, protocol: "HTTP, BT, FTP" },
                      { name: "Docker容器", status: true, protocol: "Docker" },
                      { name: "虚拟机", status: false, protocol: "KVM" },
                    ].map((service, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium text-gray-700">{service.name}</h5>
                          {isEditing ? <Switch checked={service.status} /> : renderDeviceStatus(service.status)}
                        </div>
                        {isEditing ? (
                          <Input className="mt-2 text-xs" defaultValue={service.protocol} />
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">{service.protocol}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className={isEditing ? "text-red-600 border-red-200" : "text-amber-600 border-amber-200"}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    取消编辑
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-1" />
                    编辑配置
                  </>
                )}
              </Button>

              {isEditing && (
                <Button size="sm" className="bg-amber-600">
                  <Save className="h-4 w-4 mr-1" />
                  保存更改
                </Button>
              )}
            </div>
          </div>
        )
      case "ssd":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">NVMe M.2 SSD配置</h3>
              <Badge variant="outline" className="bg-red-50">
                高性能
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-5 rounded-lg border border-red-200">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-red-700">SSD #{i}</h4>
                    {renderDeviceStatus(true)}
                  </div>

                  {isEditing ? (
                    <div className="mt-3 space-y-3 bg-red-50 p-3 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor={`ssd-model-${i}`}>型号</Label>
                        <Input id={`ssd-model-${i}`} defaultValue="西部数据（WD）SSD固态硬盘 M.2接口 SN850X PCIe4.0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`ssd-capacity-${i}`}>容量</Label>
                        <Input id={`ssd-capacity-${i}`} defaultValue="2TB" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mt-2 mb-4">
                      西部数据（WD）SSD固态硬盘 M.2接口 SN850X PCIe4.0 | 2TB
                    </p>
                  )}

                  {isEditing ? (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`ssd-read-${i}`} className="text-xs">
                          读取速度
                        </Label>
                        <Input id={`ssd-read-${i}`} defaultValue="7,300" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`ssd-write-${i}`} className="text-xs">
                          写入速度
                        </Label>
                        <Input id={`ssd-write-${i}`} defaultValue="6,600" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`ssd-interface-${i}`} className="text-xs">
                          接口
                        </Label>
                        <Input id={`ssd-interface-${i}`} defaultValue="PCIe Gen4 x4" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`ssd-nand-${i}`} className="text-xs">
                          NAND类型
                        </Label>
                        <Input id={`ssd-nand-${i}`} defaultValue="3D TLC" />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-red-50 p-3 rounded">
                        <p className="text-xs text-gray-500 mb-1">读取速度</p>
                        <p className="font-medium text-red-700">7,300 MB/s</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <p className="text-xs text-gray-500 mb-1">写入速度</p>
                        <p className="font-medium text-red-700">6,600 MB/s</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <p className="text-xs text-gray-500 mb-1">接口</p>
                        <p className="font-medium text-red-700">PCIe Gen4 x4</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <p className="text-xs text-gray-500 mb-1">NAND类型</p>
                        <p className="font-medium text-red-700">3D TLC</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">性能特点</h5>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Input defaultValue="游戏模式2.0，降低延迟" className="text-sm" />
                          <Button variant="ghost" size="icon" className="text-red-500">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input defaultValue="内置散热片，有效控温" className="text-sm" />
                          <Button variant="ghost" size="icon" className="text-red-500">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input defaultValue="预测性缓存，提升随机性能" className="text-sm" />
                          <Button variant="ghost" size="icon" className="text-red-500">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button variant="outline" size="sm" className="mt-1 text-xs">
                          添加特点
                        </Button>
                      </div>
                    ) : (
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 mr-1 text-red-500 flex-shrink-0 mt-0.5" />
                          <span>游戏模式2.0，降低延迟</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 mr-1 text-red-500 flex-shrink-0 mt-0.5" />
                          <span>内置散热片，有效控温</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 mr-1 text-red-500 flex-shrink-0 mt-0.5" />
                          <span>预测性缓存，提升随机性能</span>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-700 mb-2">使用场景</h4>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { title: "系统启动盘", desc: "快速启动操作系统和应用程序" },
                    { title: "项目文件存储", desc: "高速读写大型项目文件" },
                    { title: "虚拟机运行", desc: "为虚拟机提供高性能存储" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-3 rounded border border-red-100">
                      <Input defaultValue={item.title} className="mb-2 font-medium text-red-700" />
                      <Input defaultValue={item.desc} className="text-xs text-gray-600" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { title: "系统启动盘", desc: "快速启动操作系统和应用程序" },
                    { title: "项目文件存储", desc: "高速读写大型项目文件" },
                    { title: "虚拟机运行", desc: "为虚拟机提供高性能存储" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-3 rounded border border-red-100">
                      <h5 className="font-medium text-red-700">{item.title}</h5>
                      <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className={isEditing ? "text-red-600 border-red-200" : "text-red-600 border-red-200"}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    取消编辑
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-1" />
                    编辑配置
                  </>
                )}
              </Button>

              {isEditing && (
                <Button size="sm" className="bg-red-600">
                  <Save className="h-4 w-4 mr-1" />
                  保存更改
                </Button>
              )}
            </div>
          </div>
        )
      case "workflow":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">构建流程及软件指导</h3>
              <Badge variant="outline" className="bg-cyan-50">
                指南
              </Badge>
            </div>

            <p className="text-gray-700">
              YanYu Cloud³本地服务器递进式教科书级构建流程及搭配软件指导，围绕Vercel开发为核心，并行Git版本控制。
            </p>

            <div className="bg-white p-5 rounded-lg border border-cyan-200">
              <h4 className="font-medium text-cyan-700 mb-4">构建流程</h4>

              <div className="relative">
                {[
                  {
                    step: 1,
                    title: "硬件准备",
                    desc: "准备NAS服务器、硬盘和SSD等硬件设备",
                  },
                  {
                    step: 2,
                    title: "基础系统安装",
                    desc: "安装TOS操作系统，配置网络和存储",
                  },
                  {
                    step: 3,
                    title: "服务配置",
                    desc: "配置文件共享、备份和Docker等服务",
                  },
                  {
                    step: 4,
                    title: "开发环境搭建",
                    desc: "配置Git、Node.js和数据库等开发环境",
                  },
                  {
                    step: 5,
                    title: "集成Vercel",
                    desc: "配置Vercel CLI和自动部署流程",
                  },
                ].map((step, i, arr) => (
                  <div key={i} className="mb-8 relative">
                    <div className="flex">
                      <div className="flex-shrink-0 relative">
                        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold z-10 relative">
                          {step.step}
                        </div>
                        {i < arr.length - 1 && (
                          <div className="absolute top-10 bottom-0 left-1/2 w-0.5 bg-cyan-200 -translate-x-1/2 h-full"></div>
                        )}
                      </div>
                      <div className="ml-4">
                        {isEditing ? (
                          <div className="space-y-2">
                            <Input defaultValue={step.title} className="font-medium text-cyan-700" />
                            <Input defaultValue={step.desc} className="text-sm text-gray-600" />
                          </div>
                        ) : (
                          <>
                            <h5 className="font-medium text-cyan-700">{step.title}</h5>
                            <p className="text-sm text-gray-600 mt-1">{step.desc}</p>

                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                              {i === 0 &&
                                [
                                  { label: "NAS服务器", value: "铁威马F4-423" },
                                  { label: "硬盘", value: "WD 8TB 企业级硬盘 ×4" },
                                ].map((item, j) => (
                                  <div key={j} className="bg-cyan-50 p-2 rounded text-sm">
                                    <span className="text-gray-500">{item.label}:</span>
                                    <span className="ml-1 font-medium">{item.value}</span>
                                  </div>
                                ))}

                              {i === 1 &&
                                [
                                  { label: "操作系统", value: "TOS 5.0+" },
                                  { label: "RAID配置", value: "RAID 5" },
                                ].map((item, j) => (
                                  <div key={j} className="bg-cyan-50 p-2 rounded text-sm">
                                    <span className="text-gray-500">{item.label}:</span>
                                    <span className="ml-1 font-medium">{item.value}</span>
                                  </div>
                                ))}

                              {i === 2 &&
                                [
                                  { label: "文件共享", value: "SMB, NFS" },
                                  { label: "备份服务", value: "Rsync, Time Machine" },
                                ].map((item, j) => (
                                  <div key={j} className="bg-cyan-50 p-2 rounded text-sm">
                                    <span className="text-gray-500">{item.label}:</span>
                                    <span className="ml-1 font-medium">{item.value}</span>
                                  </div>
                                ))}

                              {i === 3 &&
                                [
                                  { label: "版本控制", value: "Git" },
                                  { label: "运行环境", value: "Node.js, Docker" },
                                ].map((item, j) => (
                                  <div key={j} className="bg-cyan-50 p-2 rounded text-sm">
                                    <span className="text-gray-500">{item.label}:</span>
                                    <span className="ml-1 font-medium">{item.value}</span>
                                  </div>
                                ))}

                              {i === 4 &&
                                [
                                  { label: "部署工具", value: "Vercel CLI" },
                                  { label: "CI/CD", value: "GitHub Actions" },
                                ].map((item, j) => (
                                  <div key={j} className="bg-cyan-50 p-2 rounded text-sm">
                                    <span className="text-gray-500">{item.label}:</span>
                                    <span className="ml-1 font-medium">{item.value}</span>
                                  </div>
                                ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-cyan-200">
              <h4 className="font-medium text-cyan-700 mb-4">推荐软件</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    category: "开发工具",
                    tools: ["Visual Studio Code", "Git", "Docker Desktop", "Vercel CLI"],
                  },
                  {
                    category: "数据库",
                    tools: ["MongoDB", "PostgreSQL", "Redis", "MySQL"],
                  },
                  {
                    category: "监控工具",
                    tools: ["Grafana", "Prometheus", "Netdata", "Uptime Kuma"],
                  },
                ].map((category, i) => (
                  <div key={i} className="bg-cyan-50 p-4 rounded-lg">
                    {isEditing ? (
                      <>
                        <Input defaultValue={category.category} className="mb-2 font-medium text-cyan-700" />
                        <div className="space-y-2">
                          {category.tools.map((tool, j) => (
                            <div key={j} className="flex items-center space-x-2">
                              <Input defaultValue={tool} className="text-sm" />
                              <Button variant="ghost" size="icon" className="text-red-500">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" className="mt-1 text-xs">
                            添加工具
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h5 className="font-medium text-cyan-700 mb-2">{category.category}</h5>
                        <ul className="space-y-1">
                          {category.tools.map((tool, j) => (
                            <li key={j} className="text-sm flex items-center">
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-cyan-600" />
                              {tool}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className={isEditing ? "text-red-600 border-red-200" : "text-cyan-600 border-cyan-200"}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    取消编辑
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-1" />
                    编辑指南
                  </>
                )}
              </Button>

              {isEditing && (
                <Button size="sm" className="bg-cyan-600">
                  <Save className="h-4 w-4 mr-1" />
                  保存更改
                </Button>
              )}
            </div>
          </div>
        )
      case "cloud":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">云服务提供商</h3>
              <Badge variant="outline" className="bg-indigo-50">
                集成
              </Badge>
            </div>

            <p className="text-gray-700 mb-4">
              YanYu Cloud³本地服务器可以与多种云服务提供商集成，实现混合云架构，提供更灵活的部署和存储选项。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "阿里云",
                  services: ["对象存储", "弹性计算", "数据库", "CDN"],
                  color: "border-orange-200 bg-orange-50",
                  textColor: "text-orange-700",
                  status: true,
                },
                {
                  name: "腾讯云",
                  services: ["云服务器", "对象存储", "云数据库", "CDN"],
                  color: "border-blue-200 bg-blue-50",
                  textColor: "text-blue-700",
                  status: true,
                },
                {
                  name: "百度云",
                  services: ["云存储", "云计算", "大数据", "人工智能"],
                  color: "border-indigo-200 bg-indigo-50",
                  textColor: "text-indigo-700",
                  status: false,
                },
              ].map((provider, i) => (
                <div key={i} className={`p-5 rounded-lg border ${provider.color}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Cloud className={`h-6 w-6 mr-2 ${provider.textColor}`} />
                      {isEditing ? (
                        <Input defaultValue={provider.name} className={`font-medium ${provider.textColor}`} />
                      ) : (
                        <h4 className={`font-medium ${provider.textColor}`}>{provider.name}</h4>
                      )}
                    </div>
                    {isEditing ? <Switch checked={provider.status} /> : renderDeviceStatus(provider.status)}
                  </div>

                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">集成服务</h5>
                    {isEditing ? (
                      <div className="space-y-2">
                        {provider.services.map((service, j) => (
                          <div key={j} className="flex items-center space-x-2">
                            <Input defaultValue={service} className="text-xs" />
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="mt-1 text-xs">
                          添加服务
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {provider.services.map((service, j) => (
                          <span key={j} className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                            {service}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button variant="ghost" size="sm" className={`mt-4 ${provider.textColor}`}>
                    查看详情
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-lg border border-indigo-200 mt-6">
              <h4 className="font-medium text-indigo-700 mb-4">混合云架构</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">本地服务器</h5>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                      代码存储和版本控制
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                      应用部署和测试环境
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                      数据备份和灾难恢复
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">云服务</h5>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                      弹性计算资源
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                      大规模数据存储
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                      全球CDN加速
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className={isEditing ? "text-red-600 border-red-200" : "text-indigo-600 border-indigo-200"}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    取消编辑
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-1" />
                    编辑配置
                  </>
                )}
              </Button>

              {isEditing && (
                <Button size="sm" className="bg-indigo-600">
                  <Save className="h-4 w-4 mr-1" />
                  保存更改
                </Button>
              )}
            </div>
          </div>
        )
      case "monitor":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">服务器性能监控</h3>
              <Badge variant="outline" className="bg-emerald-50">
                实时
              </Badge>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h4 className="text-lg font-medium">实时性能</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-500 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>显示服务器CPU、内存、磁盘和网络的使用情况</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      刷新中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      刷新数据
                    </>
                  )}
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center space-x-1 cursor-pointer">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{autoRefresh ? "自动刷新" : "手动刷新"}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>启用后，数据将每30秒自动刷新</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cpu className="h-4 w-4 mr-2" />
                    CPU 使用率
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip />
                        <Line type="monotone" dataKey="cpu" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  上次刷新：{lastRefreshed.toLocaleTimeString()}
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Memory className="h-4 w-4 mr-2" />
                    内存 使用率
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip />
                        <Line type="monotone" dataKey="memory" stroke="#82ca9d" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  上次刷新：{lastRefreshed.toLocaleTimeString()}
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HardDrive className="h-4 w-4 mr-2" />
                    磁盘 I/O
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip />
                        <Line type="monotone" dataKey="disk" stroke="#ffc658" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  上次刷新：{lastRefreshed.toLocaleTimeString()}
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    网络 吞吐量
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip />
                        <Line type="monotone" dataKey="network" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  上次刷新：{lastRefreshed.toLocaleTimeString()}
                </CardFooter>
              </Card>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className={isEditing ? "text-red-600 border-red-200" : "text-emerald-600 border-emerald-200"}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    取消编辑
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-1" />
                    编辑监控
                  </>
                )}
              </Button>

              {isEditing && (
                <Button size="sm" className="bg-emerald-600">
                  <Save className="h-4 w-4 mr-1" />
                  保存更改
                </Button>
              )}
            </div>
          </div>
        )
      default:
        return (
          <Alert>
            <AlertTitle>提示</AlertTitle>
            <AlertDescription>请选择服务器信息类别</AlertDescription>
          </Alert>
        )
    }
  }

  return (
    <div className="container relative py-10">
      {/* 移除任何导航按钮 */}

      {/* 其他内容保持不变 */}
      <AdminLoginDialog
        open={showAdminLogin}
        onOpenChange={setShowAdminLogin}
        onSuccess={() => setIsAdmin(isAdminAuthenticated())}
      />

      <ChangePasswordDialog open={showChangePassword} onOpenChange={setShowChangePassword} />

      {/* 导出对话框 */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>导出服务器报告</DialogTitle>
            <DialogDescription>选择导出格式，生成服务器性能报告。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="exportFormat">导出格式</Label>
              <Select id="exportFormat" value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择格式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleExport}>
              导出
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 顶部操作栏 */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight">YanYu Cloud³本地服务器</h1>
          <Badge variant="secondary">内部版本</Badge>
        </div>

        <div className="flex items-center space-x-4">
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  管理员
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>管理员操作</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowChangePassword(true)}>
                  <Key className="h-4 w-4 mr-2" />
                  修改密码
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
                  <Download className="h-4 w-4 mr-2" />
                  导出报告
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>导出服务器性能报告</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* 类别选择区域 */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(categories).map(([category, info]) => (
          <motion.div
            layout
            key={category}
            className={cn(
              "relative rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform duration-300 hover:scale-105",
              activeCategory === category ? "scale-105 !important" : "scale-100",
            )}
            style={{
              background: `linear-gradient(to right, ${info.color})`,
            }}
            onClick={() => handleCategoryClick(category as ServerInfoCategory)}
          >
            <div className="p-4 text-white relative z-10">
              <div className="flex items-center mb-2">
                {info.icon}
                <h3 className="ml-2 font-semibold">{info.title}</h3>
                {info.badge && (
                  <Badge variant={info.badge.variant} className="ml-2">
                    {info.badge.text}
                  </Badge>
                )}
              </div>
              <p className="text-sm opacity-80">{info.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 内容显示区域 */}
      <motion.div layout ref={contentRef} className="relative rounded-lg overflow-hidden shadow-md bg-white p-6">
        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: isMobile ? 0 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isMobile ? 0 : 50 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 管理员状态栏 */}
      {isAdmin && (
        <div className="fixed bottom-4 right-4 bg-white shadow-md rounded-lg p-2 flex items-center space-x-2 text-sm border border-gray-200">
          <Shield className="h-4 w-4 text-green-600" />
          <span>管理员已登录</span>
          <Badge variant="outline" className="ml-2">
            {sessionTime > 0 ? `${sessionTime}分钟` : "即将过期"}
          </Badge>
          <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => setShowChangePassword(true)}>
            <Key className="h-3 w-3 mr-1" />
            修改密码
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-red-600" onClick={handleLogout}>
            <LogOut className="h-3 w-3 mr-1" />
            登出
          </Button>
        </div>
      )}
    </div>
  )
}
