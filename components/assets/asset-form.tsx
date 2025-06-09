/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产表单组件 (重新设计)
 * ==========================================
 */

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Asset, AssetCategory, AssetStatus } from "@/types/asset"

interface AssetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset?: Asset | null
  onSuccess: (data: any) => void
}

export function AssetForm({ open, onOpenChange, asset, onSuccess }: AssetFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "computer" as AssetCategory,
    brand: "",
    model: "",
    purchaseDate: "",
    purchasePrice: "",
    status: "active" as AssetStatus,
    location: "",
    description: "",
  })

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        category: asset.category,
        brand: asset.brand,
        model: asset.model,
        purchaseDate: asset.purchaseDate,
        purchasePrice: asset.purchasePrice.toString(),
        status: asset.status,
        location: asset.location,
        description: asset.description || "",
      })
    } else {
      setFormData({
        name: "",
        category: "computer",
        brand: "",
        model: "",
        purchaseDate: "",
        purchasePrice: "",
        status: "active",
        location: "",
        description: "",
      })
    }
  }, [asset, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData = {
      ...formData,
      purchasePrice: Number.parseFloat(formData.purchasePrice) || 0,
    }

    onSuccess(submitData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{asset ? "编辑资产" : "添加资产"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">设备名称 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="例如：MacBook Pro 2023"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">分类</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as AssetCategory })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer">电脑设备</SelectItem>
                  <SelectItem value="mobile">移动设备</SelectItem>
                  <SelectItem value="network">网络设备</SelectItem>
                  <SelectItem value="other">其他设备</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as AssetStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">正常使用</SelectItem>
                  <SelectItem value="maintenance">维修中</SelectItem>
                  <SelectItem value="retired">已退役</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">品牌 *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="例如：Apple"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">型号 *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="例如：MacBook Pro 14"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">购买日期 *</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchasePrice">购买价格 *</Label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">存放位置 *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="例如：办公室、家里"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="设备的详细描述..."
              rows={3}
            />
          </div>

          {/* 新增：照片上传提示 */}
          {asset && (
            <div className="space-y-2">
              <Label>设备照片</Label>
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                💡 保存资产信息后，可在详情页面上传设备照片
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">{asset ? "保存更改" : "添加资产"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
