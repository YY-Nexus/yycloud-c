export type NetworkMonitorPeriod = "24h" | "7d" | "30d" | "90d" | "custom"

export interface NetworkMonitorDataPoint {
  timestamp: Date
  download: number
  upload: number
  ping: number
  jitter: number
  packetLoss: number
  qualityScore: number
}

export interface NetworkMonitorStats {
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
  downloadStability: number // 0-100%
  uploadStability: number // 0-100%
  pingStability: number // 0-100%
  testCount: number
  timeRange: {
    from: Date
    to: Date
  }
}

export interface NetworkInsight {
  type: "info" | "warning" | "success" | "error"
  title: string
  description: string
  timestamp?: Date
}

export interface NetworkMonitorData {
  dataPoints: NetworkMonitorDataPoint[]
  stats: NetworkMonitorStats
  insights: NetworkInsight[]
  period: NetworkMonitorPeriod
  customRange?: {
    from: Date
    to: Date
  }
}

export interface NetworkQualityEvent {
  timestamp: Date
  type: "improvement" | "degradation" | "outage" | "recovery"
  description: string
  severity: "low" | "medium" | "high"
  metrics: {
    download?: number
    upload?: number
    ping?: number
    packetLoss?: number
  }
}

// 网络设备类型
export interface NetworkDevice {
  id: string
  name: string
  ipAddress: string
  macAddress: string
  type: "router" | "switch" | "accessPoint" | "computer" | "mobile" | "iot" | "other"
  manufacturer?: string
  model?: string
  location?: string
  isOnline: boolean
  lastSeen: Date
  signalStrength?: number // WiFi信号强度 (dBm)
  bandwidth?: number // 带宽 (Mbps)
  connectionType?: "wired" | "wireless_2.4GHz" | "wireless_5GHz" | "wireless_6GHz"
}

// 网络拓扑连接
export interface NetworkConnection {
  source: string // 设备ID
  target: string // 设备ID
  type: "wired" | "wireless" | "virtual"
  strength?: number // 连接强度 (0-100%)
  bandwidth?: number // 带宽 (Mbps)
}

// 网络拓扑图数据
export interface NetworkTopology {
  devices: NetworkDevice[]
  connections: NetworkConnection[]
  lastUpdated: Date
}

// 网络流量数据点
export interface NetworkTrafficDataPoint {
  timestamp: Date
  inbound: number // 入站流量 (bytes)
  outbound: number // 出站流量 (bytes)
  deviceId?: string // 可选，特定设备的流量
}

// 网络流量数据
export interface NetworkTrafficData {
  dataPoints: NetworkTrafficDataPoint[]
  period: NetworkMonitorPeriod
  totalInbound: number
  totalOutbound: number
  peakInbound: number
  peakOutbound: number
  avgInbound: number
  avgOutbound: number
}

// 网络诊断测试类型
export type DiagnosticTestType = "ping" | "traceroute" | "dns" | "portScan" | "bandwidthTest" | "packetLoss"

// 网络诊断测试状态
export type DiagnosticTestStatus = "pending" | "running" | "completed" | "failed"

// 网络诊断测试结果
export interface DiagnosticTestResult {
  id: string
  type: DiagnosticTestType
  target: string // IP地址或域名
  status: DiagnosticTestStatus
  startTime: Date
  endTime?: Date
  duration?: number // 毫秒
  success: boolean
  data: any // 测试特定的结果数据
  error?: string
}

// 网络安全事件
export interface NetworkSecurityEvent {
  id: string
  timestamp: Date
  type: "intrusion" | "malware" | "phishing" | "vulnerabilityScan" | "unauthorized" | "other"
  severity: "low" | "medium" | "high" | "critical"
  source?: string // 来源IP或设备
  target?: string // 目标IP或设备
  description: string
  resolved: boolean
  resolvedAt?: Date
  actions?: string[]
}

// 网络配置备份
export interface NetworkConfigBackup {
  id: string
  deviceId: string
  deviceName: string
  timestamp: Date
  configType: "router" | "switch" | "firewall" | "other"
  description?: string
  size: number // 字节
  content: string // 配置内容或文件路径
}

// 网络报告类型
export type NetworkReportType = "performance" | "security" | "devices" | "traffic" | "custom"

// 网络报告
export interface NetworkReport {
  id: string
  title: string
  type: NetworkReportType
  createdAt: Date
  period: NetworkMonitorPeriod
  customRange?: {
    from: Date
    to: Date
  }
  sections: NetworkReportSection[]
  format: "pdf" | "html" | "json"
  status: "generating" | "completed" | "failed"
  url?: string // 报告文件URL
}

// 网络报告部分
export interface NetworkReportSection {
  id: string
  title: string
  type: "text" | "chart" | "table" | "insights" | "events"
  content: any
}
