export type DeviceStatus = "活跃" | "不活跃" | "离线" | "维护中"
export type DeviceGroup = "办公室" | "家庭" | "服务器" | "移动设备" | "其他"
export type DeviceCategory = "计算机" | "网络" | "移动设备" | "外设" | "服务器" | "其他"
export type ChangeType = "创建" | "更新" | "删除" | "状态变更" | "位置变更" | "标签变更"

export interface DeviceTag {
  id: string
  name: string
  color: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface DeviceHistoryEntry {
  id: string
  deviceId: number
  changeType: ChangeType
  field?: string
  oldValue?: string
  newValue?: string
  description: string
  userId?: string
  userName?: string
  timestamp: Date
}

export interface Device {
  id: number
  name: string
  status: DeviceStatus
  ipAddress?: string
  macAddress?: string
  group?: DeviceGroup
  category?: DeviceCategory
  location?: string
  lastSeen?: Date
  description?: string
  manufacturer?: string
  model?: string
  serialNumber?: string
  purchaseDate?: Date
  warrantyEnd?: Date
  tags?: DeviceTag[]
  createdAt?: Date
  updatedAt?: Date
}

export interface DeviceSearchParams {
  query?: string
  status?: DeviceStatus
  group?: DeviceGroup
  category?: DeviceCategory
  tags?: string[]
}

export interface DeviceCopyOptions {
  copyName?: boolean
  copyNetworkInfo?: boolean
  copyPurchaseInfo?: boolean
  copyTags?: boolean
  copyDescription?: boolean
}
