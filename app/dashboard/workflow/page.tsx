"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { WorkflowDashboard } from "@/components/workflow/workflow-dashboard"
import { WorkflowEditor } from "@/components/workflow/workflow-editor"
import { WorkflowTemplates } from "@/components/workflow/workflow-templates"

export default function WorkflowPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | undefined>()

  const handleCreateWorkflow = () => {
    setEditingWorkflowId(undefined)
    setActiveTab("editor")
  }

  const handleEditWorkflow = (workflowId: string) => {
    setEditingWorkflowId(workflowId)
    setActiveTab("editor")
  }

  const handleSaveWorkflow = () => {
    setActiveTab("dashboard")
    setEditingWorkflowId(undefined)
  }

  const handleCancelEdit = () => {
    setActiveTab("dashboard")
    setEditingWorkflowId(undefined)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">自动化工作流</h1>
          <p className="text-muted-foreground">创建和管理自动化工作流程，提高工作效率</p>
        </div>
        {activeTab !== "editor" && (
          <Button onClick={handleCreateWorkflow}>
            <Plus className="h-4 w-4 mr-2" />
            创建工作流
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">工作流管理</TabsTrigger>
          <TabsTrigger value="templates">模板库</TabsTrigger>
          <TabsTrigger value="editor" disabled={activeTab !== "editor"}>
            编辑器
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <WorkflowDashboard />
        </TabsContent>

        <TabsContent value="templates">
          <WorkflowTemplates />
        </TabsContent>

        <TabsContent value="editor">
          <WorkflowEditor workflowId={editingWorkflowId} onSave={handleSaveWorkflow} onCancel={handleCancelEdit} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
