/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 部署指导引擎页面
 * ==========================================
 */

import { DeploymentDashboard } from "@/components/deployment/deployment-dashboard"
import { DeploymentWizard } from "@/components/deployment/deployment-wizard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DeploymentPage() {
  return (
    <div className="container mx-auto p-6">
      <DeploymentDashboard />

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>快速部署向导</CardTitle>
            <CardDescription>通过向导快速创建和部署新项目</CardDescription>
          </CardHeader>
          <CardContent>
            <DeploymentWizard />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
