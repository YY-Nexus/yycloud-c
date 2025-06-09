import type { SpeedTestResult } from "@/types/speed-test"

export type DeviceType = "smartphone" | "laptop" | "desktop" | "tablet" | "tv" | "router" | "server" | "other"

export interface Device {
  id: string
  name: string
  type: DeviceType
  location?: string
  connectionType?: "wifi" | "ethernet" | "cellular" | "other"
  macAddress?: string
  ipAddress?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface DeviceWithResults extends Device {
  results: SpeedTestResult[]
}

export interface DevicePerformanceMetrics {
  avgDownload: number
  avgUpload: number
  avgPing: number
  avgJitter: number
  avgPacketLoss: number
  avgQualityScore: number
  maxDownload: number
  minDownload: number
  maxUpload: number
  minUpload: number
  maxPing: number
  minPing: number
  downloadStability: number
  uploadStability: number
  pingStability: number
  testCount: number
}

export interface DeviceComparisonInsight {
  type: "info" | "warning" | "success" | "error"
  title: string
  description: string
  deviceId?: string
  metric?: string
  difference?: number
}
