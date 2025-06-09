/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产报表页面
 * ==========================================
 */

"use client"

import { AssetReports } from "@/components/assets/asset-reports"

export default function YYAssetReportsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">资产报表</h1>
        <p className="text-muted-foreground">查看您的设备资产统计和分析报表</p>
      </div>

      <AssetReports />
    </div>
  )
}
