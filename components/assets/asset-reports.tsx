/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产报表组件
 * ==========================================
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download, Calendar } from "lucide-react"
import type { Asset, AssetCategory } from "@/types/asset"
import { YYGetAssets, YYCalculateDepreciatedValue } from "@/lib/asset-manager"
import { toast } from "@/hooks/use-toast"

// 颜色配置
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C"]

export function AssetReports() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reportType, setReportType] = useState<"category" | "status" | "value" | "age">("category")
  const [timeFrame, setTimeFrame] = useState<"all" | "year" | "quarter" | "month">("all")

  // 加载资产数据
  useEffect(() => {
    const loadAssets = async () => {
      setIsLoading(true)
      try {
        const allAssets = await YYGetAssets()
        setAssets(allAssets)
      } catch (error) {
        console.error("加载资产数据失败:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAssets()
  }, [])

  // 根据时间范围过滤资产
  const getFilteredAssets = () => {
    if (timeFrame === "all") return assets

    const now = new Date()
    const startDate = new Date()

    switch (timeFrame) {
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        startDate.setMonth(now.getMonth() - 3)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    return assets.filter((asset) => new Date(asset.purchaseDate) >= startDate)
  }

  // 准备分类数据
  const getCategoryData = () => {
    const filteredAssets = getFilteredAssets()
    const categoryMap: Record<string, number> = {}

    filteredAssets.forEach((asset) => {
      categoryMap[asset.category] = (categoryMap[asset.category] || 0) + 1
    })

    return Object.entries(categoryMap).map(([category, count]) => ({
      name: getCategoryName(category as AssetCategory),
      value: count,
    }))
  }

  // 准备状态数据
  const getStatusData = () => {
    const filteredAssets = getFilteredAssets()
    const statusMap: Record<string, number> = {}

    filteredAssets.forEach((asset) => {
      statusMap[asset.status] = (statusMap[asset.status] || 0) + 1
    })

    return Object.entries(statusMap).map(([status, count]) => ({
      name: getStatusName(status),
      value: count,
    }))
  }

  // 准备价值数据
  const getValueData = () => {
    const filteredAssets = getFilteredAssets()
    const categoryMap: Record<string, number> = {}

    filteredAssets.forEach((asset) => {
      const value = asset.currentValue || YYCalculateDepreciatedValue(asset)
      categoryMap[asset.category] = (categoryMap[asset.category] || 0) + value
    })

    return Object.entries(categoryMap).map(([category, value]) => ({
      name: getCategoryName(category as AssetCategory),
      value: Math.round(value),
    }))
  }

  // 准备年龄数据
  const getAgeData = () => {
    const filteredAssets = getFilteredAssets()
    const ageGroups = {
      "0-6个月": 0,
      "6-12个月": 0,
      "1-2年": 0,
      "2-3年": 0,
      "3-5年": 0,
      "5年以上": 0,
    }

    filteredAssets.forEach((asset) => {
      const purchaseDate = new Date(asset.purchaseDate)
      const now = new Date()
      const ageInMonths = (now.getTime() - purchaseDate.getTime()) / (30 * 24 * 60 * 60 * 1000)

      if (ageInMonths <= 6) {
        ageGroups["0-6个月"]++
      } else if (ageInMonths <= 12) {
        ageGroups["6-12个月"]++
      } else if (ageInMonths <= 24) {
        ageGroups["1-2年"]++
      } else if (ageInMonths <= 36) {
        ageGroups["2-3年"]++
      } else if (ageInMonths <= 60) {
        ageGroups["3-5年"]++
      } else {
        ageGroups["5年以上"]++
      }
    })

    return Object.entries(ageGroups).map(([age, count]) => ({
      name: age,
      value: count,
    }))
  }

  // 获取当前报表数据
  const getCurrentReportData = () => {
    switch (reportType) {
      case "category":
        return getCategoryData()
      case "status":
        return getStatusData()
      case "value":
        return getValueData()
      case "age":
        return getAgeData()
      default:
        return []
    }
  }

  // 获取报表标题
  const getReportTitle = () => {
    const titles = {
      category: "设备分类分布",
      status: "设备状态分布",
      value: "设备价值分布",
      age: "设备年龄分布",
    }
    return titles[reportType]
  }

  // 获取分类名称
  const getCategoryName = (category: AssetCategory) => {
    const names = {
      computer: "电脑设备",
      mobile: "移动设备",
      "smart-home": "智能家居",
      "audio-video": "影音设备",
      network: "网络设备",
      gaming: "游戏设备",
      other: "其他设备",
    }
    return names[category]
  }

  // 获取状态名称
  const getStatusName = (status: string) => {
    const names = {
      active: "正常使用",
      maintenance: "维修中",
      storage: "闲置存放",
      retired: "已退役",
    }
    return names[status as keyof typeof names] || status
  }

  // 导出报表
  const exportReport = () => {
    const data = getCurrentReportData()
    const reportTitle = getReportTitle()
    const timeFrameText = {
      all: "全部时间",
      year: "过去一年",
      quarter: "过去三个月",
      month: "过去一个月",
    }[timeFrame]

    const csvContent = [
      `${reportTitle} (${timeFrameText})`,
      "名称,数值",
      ...data.map((item) => `${item.name},${item.value}`),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${reportTitle}_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "导出成功",
      description: `报表已导出为CSV文件`,
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>资产报表</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">正在加载报表数据...</p>
        </CardContent>
      </Card>
    )
  }

  if (assets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>资产报表</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-64">
          <p className="text-muted-foreground mb-4">暂无资产数据，无法生成报表</p>
          <Button variant="outline" asChild>
            <a href="/dashboard/assets">添加资产</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>资产报表</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as any)}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部时间</SelectItem>
              <SelectItem value="year">过去一年</SelectItem>
              <SelectItem value="quarter">过去三个月</SelectItem>
              <SelectItem value="month">过去一个月</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={exportReport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={reportType} onValueChange={(value) => setReportType(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="category">分类分布</TabsTrigger>
            <TabsTrigger value="status">状态分布</TabsTrigger>
            <TabsTrigger value="value">价值分布</TabsTrigger>
            <TabsTrigger value="age">年龄分布</TabsTrigger>
          </TabsList>

          <TabsContent value="category" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getCategoryData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getCategoryData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} 台设备`, "数量"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCategoryData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} 台设备`, "数量"]} />
                    <Bar dataKey="value" fill="#0088FE" name="数量" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="status" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getStatusData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getStatusData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} 台设备`, "数量"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getStatusData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} 台设备`, "数量"]} />
                    <Bar dataKey="value" fill="#00C49F" name="数量" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="value" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getValueData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getValueData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, "价值"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getValueData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, "价值"]} />
                    <Bar dataKey="value" fill="#FFBB28" name="价值" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="age" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getAgeData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getAgeData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} 台设备`, "数量"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getAgeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} 台设备`, "数量"]} />
                    <Bar dataKey="value" fill="#FF8042" name="数量" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
