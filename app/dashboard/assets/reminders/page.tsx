/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产提醒页面
 * ==========================================
 */

"use client"

import { AssetReminders } from "@/components/assets/asset-reminders"

export default function YYAssetRemindersPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">资产提醒</h1>
        <p className="text-muted-foreground">管理设备保修、维护和更新提醒</p>
      </div>

      <AssetReminders />
    </div>
  )
}
