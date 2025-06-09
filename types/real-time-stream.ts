/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 实时数据流处理类型定义
 *
 * @module YYC/types
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

// 数据流类型
export type StreamType =
  | "network_metrics" // 网络指标
  | "system_performance" // 系统性能
  | "user_activity" // 用户活动
  | "device_status" // 设备状态
  | "security_events" // 安全事件
  | "application_logs" // 应用日志
  | "custom" // 自定义

// 数据点状态
export type DataPointStatus = "normal" | "warning" | "error" | "critical"

// 流处理状态
export type StreamStatus = "connected" | "disconnected" | "reconnecting" | "error" | "paused"

// 聚合类型
export type AggregationType = "sum" | "avg" | "min" | "max" | "count" | "last" | "first"

// 时间窗口类型
export type TimeWindowType = "tumbling" | "sliding" | "session"

// 数据点接口
export interface DataPoint {
  id: string
  timestamp: Date
  value: number | string | boolean | object
  metadata?: Record<string, any>
  status?: DataPointStatus
  source?: string
  tags?: string[]
}

// 数据流配置
export interface StreamConfig {
  id: string
  name: string
  description: string
  type: StreamType
  source: {
    type: "websocket" | "sse" | "polling" | "kafka" | "mqtt"
    url: string
    headers?: Record<string, string>
    authentication?: {
      type: "bearer" | "basic" | "api_key"
      credentials: Record<string, string>
    }
    options?: Record<string, any>
  }
  processing: {
    bufferSize: number
    batchSize: number
    flushInterval: number // ms
    retryAttempts: number
    retryDelay: number // ms
  }
  schema?: {
    fields: Array<{
      name: string
      type: "number" | "string" | "boolean" | "object"
      required: boolean
      validation?: string // regex or function
    }>
  }
  filters?: Array<{
    field: string
    operator: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "contains" | "regex"
    value: any
  }>
  transformations?: Array<{
    type: "map" | "filter" | "aggregate" | "join"
    config: Record<string, any>
  }>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// 实时数据流
export interface RealTimeStream {
  id: string
  config: StreamConfig
  status: StreamStatus
  connection?: WebSocket | EventSource
  buffer: DataPoint[]
  statistics: StreamStatistics
  lastDataPoint?: DataPoint
  errorCount: number
  reconnectCount: number
  startTime: Date
  lastActiveTime: Date
}

// 流统计信息
export interface StreamStatistics {
  totalPoints: number
  pointsPerSecond: number
  averageLatency: number
  errorRate: number
  uptime: number // percentage
  bytesReceived: number
  lastUpdate: Date
}

// 时间窗口配置
export interface TimeWindow {
  type: TimeWindowType
  size: number // ms for tumbling/sliding, timeout for session
  slide?: number // ms for sliding window
  sessionTimeout?: number // ms for session window
}

// 聚合规则
export interface AggregationRule {
  id: string
  name: string
  field: string
  aggregationType: AggregationType
  timeWindow: TimeWindow
  groupBy?: string[]
  filters?: Array<{
    field: string
    operator: string
    value: any
  }>
  outputField: string
}

// 告警规则
export interface AlertRule {
  id: string
  name: string
  description: string
  streamId: string
  condition: {
    field: string
    operator: "gt" | "gte" | "lt" | "lte" | "eq" | "ne"
    value: number | string
    timeWindow?: TimeWindow
  }
  severity: "low" | "medium" | "high" | "critical"
  actions: Array<{
    type: "email" | "webhook" | "notification" | "log"
    config: Record<string, any>
  }>
  isActive: boolean
  lastTriggered?: Date
  triggerCount: number
}

// 告警事件
export interface AlertEvent {
  id: string
  ruleId: string
  streamId: string
  severity: "low" | "medium" | "high" | "critical"
  message: string
  dataPoint: DataPoint
  triggeredAt: Date
  acknowledgedAt?: Date
  resolvedAt?: Date
  status: "active" | "acknowledged" | "resolved"
}

// 数据流监控指标
export interface StreamMetrics {
  streamId: string
  timestamp: Date
  throughput: number // points per second
  latency: number // ms
  errorRate: number // percentage
  memoryUsage: number // bytes
  cpuUsage: number // percentage
  connectionStatus: StreamStatus
}

// 流处理器配置
export interface StreamProcessor {
  id: string
  name: string
  type: "filter" | "transform" | "aggregate" | "join" | "window"
  config: Record<string, any>
  inputStreams: string[]
  outputStream: string
  isActive: boolean
}

// 数据导出配置
export interface ExportConfig {
  id: string
  name: string
  streamId: string
  format: "json" | "csv" | "parquet" | "avro"
  destination: {
    type: "file" | "s3" | "database" | "api"
    config: Record<string, any>
  }
  schedule?: {
    type: "interval" | "cron"
    value: string
  }
  filters?: Array<{
    field: string
    operator: string
    value: any
  }>
  isActive: boolean
}

// 流可视化配置
export interface StreamVisualization {
  id: string
  name: string
  streamId: string
  type: "line_chart" | "bar_chart" | "gauge" | "table" | "heatmap" | "scatter"
  config: {
    xAxis?: string
    yAxis?: string
    groupBy?: string
    aggregation?: AggregationType
    timeWindow?: TimeWindow
    refreshInterval: number // ms
    maxDataPoints: number
    colors?: string[]
    thresholds?: Array<{
      value: number
      color: string
      label: string
    }>
  }
  layout: {
    x: number
    y: number
    width: number
    height: number
  }
}

// 实时仪表盘
export interface RealTimeDashboard {
  id: string
  name: string
  description: string
  visualizations: StreamVisualization[]
  layout: {
    columns: number
    rows: number
    gap: number
  }
  refreshInterval: number // ms
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

// 流处理任务
export interface StreamProcessingJob {
  id: string
  name: string
  description: string
  inputStreams: string[]
  processors: StreamProcessor[]
  outputStreams: string[]
  status: "running" | "stopped" | "error" | "paused"
  startTime?: Date
  endTime?: Date
  processedCount: number
  errorCount: number
  lastError?: string
}

// 数据质量指标
export interface DataQualityMetrics {
  streamId: string
  timestamp: Date
  completeness: number // 0-1
  accuracy: number // 0-1
  consistency: number // 0-1
  timeliness: number // 0-1
  validity: number // 0-1
  duplicateRate: number // percentage
  nullRate: number // percentage
}

// 流连接配置
export interface StreamConnection {
  id: string
  name: string
  type: "websocket" | "sse" | "kafka" | "mqtt" | "tcp" | "udp"
  config: Record<string, any>
  status: StreamStatus
  lastConnected?: Date
  connectionCount: number
  errorCount: number
}

// 实时查询
export interface RealTimeQuery {
  id: string
  name: string
  streamId: string
  query: string // SQL-like query
  parameters?: Record<string, any>
  resultLimit: number
  timeWindow?: TimeWindow
  isActive: boolean
  lastExecuted?: Date
  resultCount: number
}

// 流事件
export interface StreamEvent {
  id: string
  streamId: string
  type: "connected" | "disconnected" | "error" | "data_received" | "threshold_exceeded"
  message: string
  data?: any
  timestamp: Date
  severity: "info" | "warning" | "error" | "critical"
}

// 性能基准
export interface PerformanceBenchmark {
  streamId: string
  timestamp: Date
  throughputTarget: number
  latencyTarget: number
  actualThroughput: number
  actualLatency: number
  performanceScore: number // 0-100
  recommendations: string[]
}
