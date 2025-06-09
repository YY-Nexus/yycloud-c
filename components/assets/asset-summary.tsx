/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产统计摘要组件
 * ==========================================
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, CheckCircle, Wrench } from "lucide-react"
import type { AssetSummary } from "@/types/asset"

interface AssetSummaryProps {
  summary: AssetSummary
}

export function AssetSummary({ summary }: AssetSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 总资产数 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总资产数</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalAssets}</div>
          <p className="text-xs text-muted-foreground">已注册设备</p>
        </CardContent>
      </Card>

      {/* 总价值 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总价值</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">¥{summary.totalValue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">购买价格总和</p>
        </CardContent>
      </Card>

      {/* 正常使用 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">正常使用</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{summary.activeAssets}</div>
          <p className="text-xs text-muted-foreground">运行正常</p>
        </CardContent>
      </Card>

      {/* 维修中 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">维修中</CardTitle>
          <Wrench className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{summary.maintenanceAssets}</div>
          <p className="text-xs text-muted-foreground">需要关注</p>
        </CardContent>
      </Card>
    </div>
  )
}
