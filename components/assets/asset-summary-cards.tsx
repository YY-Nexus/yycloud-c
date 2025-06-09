/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产统计卡片组件
 * ==========================================
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Laptop,
  Smartphone,
  Home,
  Headphones,
  Wifi,
  Gamepad2,
} from "lucide-react"
import type { AssetSummary } from "@/types/asset"

interface AssetSummaryCardsProps {
  summary: AssetSummary
}

export function AssetSummaryCards({ summary }: AssetSummaryCardsProps) {
  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "computer":
        return <Laptop className="h-4 w-4" />
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      case "smart-home":
        return <Home className="h-4 w-4" />
      case "audio-video":
        return <Headphones className="h-4 w-4" />
      case "network":
        return <Wifi className="h-4 w-4" />
      case "gaming":
        return <Gamepad2 className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  // 获取分类名称
  const getCategoryName = (category: string) => {
    const names = {
      computer: "电脑",
      mobile: "移动",
      "smart-home": "智能家居",
      "audio-video": "影音",
      network: "网络",
      gaming: "游戏",
      other: "其他",
    }
    return names[category as keyof typeof names] || category
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 总设备数 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总设备数</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalAssets}</div>
          <p className="text-xs text-muted-foreground">正常使用 {summary.activeAssets} 台</p>
        </CardContent>
      </Card>

      {/* 总价值 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总价值</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">¥{summary.totalValue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">设备资产估值</p>
        </CardContent>
      </Card>

      {/* 设备状态 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">设备状态</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>正常使用</span>
              <Badge variant="default" className="text-xs">
                {summary.activeAssets}
              </Badge>
            </div>
            {summary.maintenanceAssets > 0 && (
              <div className="flex justify-between text-sm">
                <span>维修中</span>
                <Badge variant="destructive" className="text-xs">
                  {summary.maintenanceAssets}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 保修提醒 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">保修提醒</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.warrantyExpiringSoon}</div>
          <p className="text-xs text-muted-foreground">30天内即将过保</p>
        </CardContent>
      </Card>

      {/* 分类统计 */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">设备分类统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(summary.categoryBreakdown).map(
              ([category, count]) =>
                count > 0 && (
                  <div key={category} className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <div>
                      <p className="text-sm font-medium">{getCategoryName(category)}</p>
                      <p className="text-xs text-muted-foreground">{count} 台</p>
                    </div>
                  </div>
                ),
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
