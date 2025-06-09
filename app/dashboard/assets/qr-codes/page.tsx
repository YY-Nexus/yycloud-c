/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产二维码页面
 * ==========================================
 */

"use client"

import { AssetQRGenerator } from "@/components/assets/asset-qr-generator"

export default function YYAssetQRCodesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">资产二维码</h1>
        <p className="text-muted-foreground">为您的设备生成可打印的二维码标签</p>
      </div>

      <AssetQRGenerator />
    </div>
  )
}
