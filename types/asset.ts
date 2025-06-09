/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产管理类型定义 (重新设计)
 * ==========================================
 */

export type AssetCategory = "computer" | "mobile" | "network" | "other"

export type AssetStatus = "active" | "maintenance" | "retired"

// 维修记录接口
export interface MaintenanceRecord {
  id: string
  date: string
  description: string
  cost: number
  provider?: string
  notes?: string
}

// 文档接口
export interface AssetDocument {
  id: string
  name: string
  type: "receipt" | "manual" | "warranty" | "other"
  uploadDate: string
  url?: string
}

export interface Asset {
  id: string
  name: string
  category: AssetCategory
  brand: string
  model: string
  purchaseDate: string
  purchasePrice: number
  status: AssetStatus
  location: string
  description?: string
  // 新增照片相关字段
  imageUrl?: string
  images?: AssetImage[]
  // 其他可选字段
  serialNumber?: string
  warrantyExpiry?: string
  currentValue?: number
  condition?: "excellent" | "good" | "fair" | "poor"
  maintenanceRecords?: MaintenanceRecord[]
  documents?: AssetDocument[]
  createdAt: string
  updatedAt: string
}

// 新增资产图片接口
export interface AssetImage {
  id: string
  url: string
  filename: string
  size: number
  uploadDate: string
  description?: string
  isPrimary: boolean
}

export interface AssetSummary {
  totalAssets: number
  totalValue: number
  activeAssets: number
  maintenanceAssets: number
  categoryBreakdown: Record<AssetCategory, number>
}
