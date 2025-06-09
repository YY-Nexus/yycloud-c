/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产管理仪表板组件
 * ==========================================
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, PieChart, Calendar, AlertTriangle, Package, TrendingUp, Clock, QrCode, Bell } from "lucide-react"
import Link from "next/link"
import type { Asset, AssetSummary } from "@/types/asset"
import { YYGetAssets, YYGetAssetSummary, YYGetWarrantyStatus } from "@/lib/asset-manager"

export function AssetDashboard() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [summary, setSummary] = useState<AssetSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [recentlyAdded, setRecentlyAdded] = useState<Asset[]>([])
  const [expiringWarranty, setExpiringWarranty] = useState<Asset[]>([])

  // 加载资产数据
  useEffect(() => {
    const loadAssets = async () => {
      setIsLoading(true)
      try {
        const [allAssets, assetSummary] = await Promise.all([YYGetAssets(), YYGetAssetSummary()])
        setAssets(allAssets)
        setSummary(assetSummary)

        // 获取最近添加的资产
        const sorted = [...allAssets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setRecentlyAdded(sorted.slice(0, 5))

        // 获取即将过期的保修
        const expiring = allAssets
          .filter((asset) => YYGetWarrantyStatus(asset) === "expiring")
          .sort((a, b) => new Date(a.warrantyExpiry as Date).getTime() - new Date(b.warrantyExpiry as Date).getTime())
        setExpiringWarranty(expiring.slice(0, 5))
      } catch (error) {
        console.error("加载资产数据失败:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAssets()
  }, [])

  // 获取分类名称
  const getCategoryName = (category: string) => {
    const names = {
      computer: "电脑设备",
      mobile: "移动设备",
      "smart-home": "智能家居",
      "audio-video": "影音设备",
      network: "网络设备",
      gaming: "游戏设备",
      other: "其他设备",
    }
    return names[category as keyof typeof names] || category
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>资产管理仪表板</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">正在加载资产数据...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总设备数</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalAssets || 0}</div>
            <p className="text-xs text-muted-foreground">正常使用 {summary?.activeAssets || 0} 台</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总价值</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{(summary?.totalValue || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">设备资产估值</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">保修提醒</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.warrantyExpiringSoon || 0}</div>
            <p className="text-xs text-muted-foreground">30天内即将过保</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">维修中</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.maintenanceAssets || 0}</div>
            <p className="text-xs text-muted-foreground">正在维修的设备</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>最近添加的设备</CardTitle>
            <CardDescription>最近添加到资产库的设备</CardDescription>
          </CardHeader>
          <CardContent>
            {recentlyAdded.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无资产数据</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentlyAdded.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {asset.brand} {asset.model}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{getCategoryName(asset.category)}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(asset.createdAt.toString())}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/assets">查看所有设备</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>即将过期的保修</CardTitle>
            <CardDescription>30天内保修即将到期的设备</CardDescription>
          </CardHeader>
          <CardContent>
            {expiringWarranty.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无即将过期的保修</p>
              </div>
            ) : (
              <div className="space-y-4">
                {expiringWarranty.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {asset.brand} {asset.model}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">即将过期</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(asset.warrantyExpiry?.toString() || "")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/assets/reminders">查看所有提醒</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">资产报表</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-center space-y-2">
              <PieChart className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm">查看资产分布和价值统计</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/assets/reports">查看报表</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">资产提醒</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-center space-y-2">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm">管理保修和维护提醒</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/assets/reminders">设置提醒</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">资产二维码</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-center space-y-2">
              <QrCode className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm">生成设备标签和二维码</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/assets/qr-codes">生成二维码</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
