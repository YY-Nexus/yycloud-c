"use client"

import { AIWorkflowAssistant } from "@/components/workflow/ai-workflow-assistant"

export default function WorkflowAIAssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI工作流助手</h1>
        <p className="text-muted-foreground">使用AI技术优化和设计您的工作流</p>
      </div>

      <AIWorkflowAssistant />
    </div>
  )
}
