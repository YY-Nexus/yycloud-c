/**
 * ==========================================
 * 资产管理主页
 * ==========================================
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  QrCode,
  BarChart3,
  Settings,
  Monitor,
  Smartphone,
  Laptop,
  Server,
} from "lucide-react"

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const assetStats = [
    {
      title: "总资产数量",
      value: "156",
      description: "所有类型资产",
      icon: Package,
      color: "text-blue-500",
    },
    {
      title: "硬件设备",
      value: "89",
      description: "物理设备",
      icon: Monitor,
      color: "text-green-500",
    },
    {
      title: "软件许可",
      value: "45",
      description: "软件授权",
      icon: Settings,
      color: "text-purple-500",
    },
    {
      title: "待维护",
      value: "12",
      description: "需要关注",
      icon: Bell,
      color: "text-orange-500",
    },
  ]

  const recentAssets = [
    {
      id: "1",
      name: "MacBook Pro 16",
      type: "硬件",
      category: "笔记本电脑",
      status: "正常",
      location: "办公室A",
      lastUpdate: "2024-01-15",
      icon: Laptop,
    },
    {
      id: "2",
      name: "iPhone 15 Pro",
      type: "硬件",
      category: "移动设备",
      status: "正常",
      location: "个人",
      lastUpdate: "2024-01-14",
      icon: Smartphone,
    },
    {
      id: "3",
      name: "Adobe Creative Suite",
      type: "软件",
      category: "设计软件",
      status: "已激活",
      location: "云端",
      lastUpdate: "2024-01-13",
      icon: Settings,
    },
    {
      id: "4",
      name: "Dell PowerEdge R740",
      type: "硬件",
      category: "服务器",
      status: "运行中",
      location: "数据中心",
      lastUpdate: "2024-01-12",
      icon: Server,
    },
  ]

  const quickActions = [
    {
      title: "添加新资产",
      description: "录入新的设备或软件资产",
      icon: Plus,
      href: "/dashboard/assets/new",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "资产报告",
      description: "生成详细的资产分析报告",
      icon: BarChart3,
      href: "/dashboard/assets/reports",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "导入导出",
      description: "批量导入或导出资产数据",
      icon: Upload,
      href: "/dashboard/assets/import-export",
      color: "from-purple-500 to-violet-500",
    },
    {
      title: "提醒设置",
      description: "设置维护和更新提醒",
      icon: Bell,
      href: "/dashboard/assets/reminders",
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "二维码管理",
      description: "生成和管理资产二维码",
      icon: QrCode,
      href: "/dashboard/assets/qr-codes",
      color: "from-red-500 to-pink-500",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "正常":
      case "已激活":
      case "运行中":
        return "bg-green-100 text-green-800"
      case "待维护":
        return "bg-orange-100 text-orange-800"
      case "故障":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">资产管理</h1>
          <p className="text-gray-600 mt-2">管理您的设备、软件和数字资产</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            筛选
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Link href="/dashboard/assets/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              添加资产
            </Button>
          </Link>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {assetStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 快速操作 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader className="text-center">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-sm">{action.title}</CardTitle>
                    <CardDescription className="text-xs">{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="搜索资产..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* 资产列表 */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">全部资产</TabsTrigger>
          <TabsTrigger value="hardware">硬件设备</TabsTrigger>
          <TabsTrigger value="software">软件许可</TabsTrigger>
          <TabsTrigger value="network">网络资源</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {recentAssets
              .filter((asset) => asset.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((asset) => {
                const Icon = asset.icon
                return (
                  <Card key={asset.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Icon className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{asset.name}</h3>
                            <p className="text-sm text-gray-600">
                              {asset.category} • {asset.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
                          <Badge variant="outline">{asset.type}</Badge>
                          <div className="text-sm text-gray-500">{asset.lastUpdate}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>

        <TabsContent value="hardware">
          <div className="text-center py-8">
            <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">硬件设备</h3>
            <p className="text-gray-600">显示所有硬件设备资产</p>
          </div>
        </TabsContent>

        <TabsContent value="software">
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">软件许可</h3>
            <p className="text-gray-600">显示所有软件许可资产</p>
          </div>
        </TabsContent>

        <TabsContent value="network">
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">网络资源</h3>
            <p className="text-gray-600">显示所有网络资源资产</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
