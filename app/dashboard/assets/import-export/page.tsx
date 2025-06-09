/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产导入导出页面
 * ==========================================
 */

"use client"

import { AssetImportExport } from "@/components/assets/asset-import-export"

export default function YYAssetImportExportPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">资产导入导出</h1>
        <p className="text-muted-foreground">导入或导出您的设备资产数据</p>
      </div>

      <AssetImportExport />
    </div>
  )
}
