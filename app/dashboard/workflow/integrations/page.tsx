"use client"

import { IntegrationManager } from "@/components/workflow/integration-manager"

export default function WorkflowIntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">工作流集成</h1>
        <p className="text-muted-foreground">管理第三方服务集成，扩展工作流功能</p>
      </div>

      <IntegrationManager />
    </div>
  )
}
