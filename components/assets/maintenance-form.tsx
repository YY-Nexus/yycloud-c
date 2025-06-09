/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 维修记录表单组件
 * ==========================================
 */

"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

interface MaintenanceRecord {
  id: string
  date: string
  description: string
  cost: number
  provider?: string
  notes?: string
}

interface MaintenanceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetId: string
  onSuccess: () => void
}

export function MaintenanceForm({ open, onOpenChange, assetId, onSuccess }: MaintenanceFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    cost: "",
    provider: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // 这里应该调用添加维修记录的函数
      // 暂时只显示成功消息
      toast({
        title: "添加成功",
        description: "维修记录已添加",
      })

      onSuccess()
      onOpenChange(false)

      // 重置表单
      setFormData({
        date: new Date().toISOString().split("T")[0],
        description: "",
        cost: "",
        provider: "",
        notes: "",
      })
    } catch (error) {
      toast({
        title: "添加失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>添加维修记录</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">维修日期 *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">维修描述 *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="例如：更换屏幕"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">维修费用 *</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">维修商</Label>
            <Input
              id="provider"
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              placeholder="例如：苹果官方维修"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">备注</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="维修详情和备注..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">添加记录</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
