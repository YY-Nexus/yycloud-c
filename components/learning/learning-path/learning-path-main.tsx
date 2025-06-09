"use client"

import { useState } from "react"
import { PathList } from "./path-list"
import { PathOverview } from "./path-overview"
import { PathCreator } from "./path-creator"
import { YYEnrollPath, YYStartStep } from "@/lib/learning-path-manager"
import type { LearningPath } from "@/types/learning-path"

type ViewMode = "list" | "overview" | "creator"

export function LearningPathMain() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [editingPath, setEditingPath] = useState<LearningPath | null>(null)

  const handleSelectPath = (path: LearningPath) => {
    setSelectedPath(path)
    setViewMode("overview")
  }

  const handleCreatePath = () => {
    setEditingPath(null)
    setViewMode("creator")
  }

  const handleEditPath = (path: LearningPath) => {
    setEditingPath(path)
    setViewMode("creator")
  }

  const handleSavePath = (path: LearningPath) => {
    setViewMode("list")
    setEditingPath(null)
  }

  const handleCancelCreator = () => {
    setViewMode("list")
    setEditingPath(null)
  }

  const handleEnrollPath = async () => {
    if (!selectedPath) return

    const success = await YYEnrollPath(selectedPath.id)
    if (success) {
      // 重新加载路径数据
      window.location.reload()
    }
  }

  const handleContinuePath = () => {
    if (!selectedPath?.currentStepId) return

    // 跳转到当前步骤
    handleStartStep(selectedPath.currentStepId)
  }

  const handleStartStep = async (stepId: string) => {
    if (!selectedPath) return

    const success = await YYStartStep(selectedPath.id, stepId)
    if (success) {
      // 这里可以跳转到具体的学习页面
      console.log("开始学习步骤:", stepId)
    }
  }

  const handleBackToList = () => {
    setViewMode("list")
    setSelectedPath(null)
  }

  return (
    <div className="container mx-auto p-4">
      {viewMode === "list" && <PathList onSelectPath={handleSelectPath} onCreatePath={handleCreatePath} />}

      {viewMode === "overview" && selectedPath && (
        <div className="space-y-4">
          <button
            onClick={handleBackToList}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            ← 返回路径列表
          </button>
          <PathOverview
            path={selectedPath}
            onEnroll={handleEnrollPath}
            onContinue={handleContinuePath}
            onStartStep={handleStartStep}
          />
        </div>
      )}

      {viewMode === "creator" && (
        <div className="space-y-4">
          <button
            onClick={handleCancelCreator}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            ← 返回路径列表
          </button>
          <PathCreator onSave={handleSavePath} onCancel={handleCancelCreator} editingPath={editingPath} />
        </div>
      )}
    </div>
  )
}
