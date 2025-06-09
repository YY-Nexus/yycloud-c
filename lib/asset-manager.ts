/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产管理服务 (重新设计)
 * ==========================================
 */

import type { Asset, AssetSummary, AssetImage } from "@/types/asset"

const STORAGE_KEY = "yanyu:assets"

// 获取所有资产
export function getAssets(): Asset[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// 保存资产
function saveAssets(assets: Asset[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets))
  } catch (error) {
    console.error("保存资产失败:", error)
  }
}

// 添加资产
export function addAsset(assetData: Omit<Asset, "id" | "createdAt" | "updatedAt">): Asset {
  const assets = getAssets()
  const now = new Date().toISOString()

  const newAsset: Asset = {
    ...assetData,
    id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now,
    updatedAt: now,
  }

  assets.push(newAsset)
  saveAssets(assets)

  return newAsset
}

// 更新资产
export function updateAsset(id: string, updates: Partial<Asset>): Asset | null {
  const assets = getAssets()
  const index = assets.findIndex((asset) => asset.id === id)

  if (index === -1) return null

  const updatedAsset = {
    ...assets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  assets[index] = updatedAsset
  saveAssets(assets)

  return updatedAsset
}

// 删除资产
export function deleteAsset(id: string): boolean {
  const assets = getAssets()
  const filteredAssets = assets.filter((asset) => asset.id !== id)

  if (filteredAssets.length === assets.length) return false

  saveAssets(filteredAssets)
  return true
}

// 获取资产统计
export function getAssetSummary(): AssetSummary {
  const assets = getAssets()

  const summary: AssetSummary = {
    totalAssets: assets.length,
    totalValue: assets.reduce((sum, asset) => sum + asset.purchasePrice, 0),
    activeAssets: assets.filter((asset) => asset.status === "active").length,
    maintenanceAssets: assets.filter((asset) => asset.status === "maintenance").length,
    categoryBreakdown: {
      computer: 0,
      mobile: 0,
      network: 0,
      other: 0,
    },
  }

  assets.forEach((asset) => {
    summary.categoryBreakdown[asset.category]++
  })

  return summary
}

// 搜索资产
export function searchAssets(query: string): Asset[] {
  if (!query.trim()) return getAssets()

  const assets = getAssets()
  const searchTerm = query.toLowerCase()

  return assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm) ||
      asset.brand.toLowerCase().includes(searchTerm) ||
      asset.model.toLowerCase().includes(searchTerm) ||
      asset.location.toLowerCase().includes(searchTerm),
  )
}

// 计算折旧价值
export function YYCalculateDepreciatedValue(asset: Asset): number {
  const purchaseDate = new Date(asset.purchaseDate)
  const currentDate = new Date()
  const yearsUsed = (currentDate.getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)

  // 简单的直线折旧，假设5年折旧完毕
  const depreciationRate = Math.min(yearsUsed / 5, 1)
  return Math.max(asset.purchasePrice * (1 - depreciationRate), asset.purchasePrice * 0.1)
}

// 获取保修状态
export function YYGetWarrantyStatus(asset: Asset): "active" | "expiring" | "expired" {
  if (!asset.warrantyExpiry) return "expired"

  const warrantyDate = new Date(asset.warrantyExpiry)
  const currentDate = new Date()
  const daysUntilExpiry = Math.ceil((warrantyDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry > 30) return "active"
  if (daysUntilExpiry > 0) return "expiring"
  return "expired"
}

// 在文件末尾添加照片管理功能

// 添加资产照片
export function addAssetImage(assetId: string, imageData: Omit<AssetImage, "id" | "uploadDate">): AssetImage | null {
  const assets = getAssets()
  const assetIndex = assets.findIndex((asset) => asset.id === assetId)

  if (assetIndex === -1) return null

  const newImage: AssetImage = {
    ...imageData,
    id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    uploadDate: new Date().toISOString(),
  }

  if (!assets[assetIndex].images) {
    assets[assetIndex].images = []
  }

  // 如果是第一张图片，设为主图
  if (assets[assetIndex].images!.length === 0) {
    newImage.isPrimary = true
    assets[assetIndex].imageUrl = newImage.url
  }

  assets[assetIndex].images!.push(newImage)
  assets[assetIndex].updatedAt = new Date().toISOString()

  saveAssets(assets)
  return newImage
}

// 删除资产照片
export function removeAssetImage(assetId: string, imageId: string): boolean {
  const assets = getAssets()
  const assetIndex = assets.findIndex((asset) => asset.id === assetId)

  if (assetIndex === -1 || !assets[assetIndex].images) return false

  const imageIndex = assets[assetIndex].images!.findIndex((img) => img.id === imageId)
  if (imageIndex === -1) return false

  const removedImage = assets[assetIndex].images![imageIndex]
  assets[assetIndex].images!.splice(imageIndex, 1)

  // 如果删除的是主图，重新设置主图
  if (removedImage.isPrimary && assets[assetIndex].images!.length > 0) {
    assets[assetIndex].images![0].isPrimary = true
    assets[assetIndex].imageUrl = assets[assetIndex].images![0].url
  } else if (assets[assetIndex].images!.length === 0) {
    assets[assetIndex].imageUrl = undefined
  }

  assets[assetIndex].updatedAt = new Date().toISOString()
  saveAssets(assets)
  return true
}

// 设置主图
export function setPrimaryImage(assetId: string, imageId: string): boolean {
  const assets = getAssets()
  const assetIndex = assets.findIndex((asset) => asset.id === assetId)

  if (assetIndex === -1 || !assets[assetIndex].images) return false

  // 清除所有主图标记
  assets[assetIndex].images!.forEach((img) => (img.isPrimary = false))

  // 设置新主图
  const imageIndex = assets[assetIndex].images!.findIndex((img) => img.id === imageId)
  if (imageIndex === -1) return false

  assets[assetIndex].images![imageIndex].isPrimary = true
  assets[assetIndex].imageUrl = assets[assetIndex].images![imageIndex].url
  assets[assetIndex].updatedAt = new Date().toISOString()

  saveAssets(assets)
  return true
}
