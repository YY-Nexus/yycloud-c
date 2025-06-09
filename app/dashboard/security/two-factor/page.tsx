/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 双因素认证页面
 * ==========================================
 */

import { TwoFactorAuth } from "@/components/security/two-factor-auth"

export default function TwoFactorPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">双因素认证</h1>
        <p className="text-muted-foreground">为您的账户添加额外的安全保护层，防止未授权访问</p>
      </div>

      <TwoFactorAuth />
    </div>
  )
}
