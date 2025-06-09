import type { DeviceWithResults } from "@/types/device"

export interface ComparisonReport {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  devices: DeviceWithResults[]
  analysisConfig: {
    selectedDeviceIds: string[]
    primaryMetric: "download" | "upload" | "ping" | "jitter" | "packetLoss" | "qualityScore"
    timeRange: {
      start: Date
      end: Date
    }
    includeInsights: boolean
    includeCharts: boolean
    includeRawData: boolean
  }
  summary: {
    totalDevices: number
    totalTests: number
    bestPerformingDevice: {
      deviceId: string
      deviceName: string
      metric: string
      value: number
    }
    worstPerformingDevice: {
      deviceId: string
      deviceName: string
      metric: string
      value: number
    }
    averagePerformance: {
      download: number
      upload: number
      ping: number
      jitter: number
      packetLoss: number
      qualityScore: number
    }
  }
  insights: Array<{
    type: "info" | "warning" | "success" | "error"
    title: string
    description: string
    deviceId?: string
    metric?: string
    priority: "low" | "medium" | "high"
  }>
  charts: {
    comparisonChart: string // Base64 encoded chart image
    trendChart: string
    radarChart: string
  }
  exportFormats: ("pdf" | "excel" | "json" | "csv")[]
}

export interface ReportTemplate {
  id: string
  name: string
  description: string
  sections: ReportSection[]
  defaultConfig: Partial<ComparisonReport["analysisConfig"]>
}

export interface ReportSection {
  id: string
  name: string
  type: "summary" | "chart" | "table" | "insights" | "recommendations"
  enabled: boolean
  order: number
  config?: Record<string, any>
}

export interface ExportOptions {
  format: "pdf" | "excel" | "json" | "csv"
  includeCharts: boolean
  includeRawData: boolean
  includeInsights: boolean
  template?: string
  customName?: string
}
