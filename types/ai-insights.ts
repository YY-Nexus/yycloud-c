/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * AI洞察系统类型定义
 *
 * @module YYC/types
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

// 洞察类型
export type InsightType =
  | "trend" // 趋势分析
  | "anomaly" // 异常检测
  | "correlation" // 相关性分析
  | "prediction" // 预测分析
  | "optimization" // 优化建议
  | "pattern" // 模式识别
  | "comparison" // 对比分析
  | "segmentation" // 分群分析

// 严重程度
export type InsightSeverity = "low" | "medium" | "high" | "critical"

// 洞察状态
export type InsightStatus = "new" | "acknowledged" | "resolved" | "dismissed"

// 数据点
export interface DataPoint {
  timestamp: Date
  value: number
  metadata?: Record<string, any>
}

// 时间范围
export interface TimeRange {
  start: Date
  end: Date
}

// 统计证据
export interface StatisticalEvidence {
  type: "correlation" | "regression" | "significance_test" | "distribution"
  description: string
  value: number
  pValue?: number
  confidenceInterval?: [number, number]
  metadata?: Record<string, any>
}

// 洞察发现
export interface InsightFinding {
  id: string
  description: string
  metric: string
  value: number
  previousValue?: number
  changePercent?: number
  significance: number // 0-1
  evidence: StatisticalEvidence[]
  timeRange: TimeRange
}

// 行动项
export interface ActionItem {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "completed"
  assignee?: string
  dueDate?: Date
  estimatedEffort?: string
}

// 洞察推荐
export interface InsightRecommendation {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high"
  expectedImpact: string
  effort: "low" | "medium" | "high"
  timeline: string
  actions: ActionItem[]
  relatedFindings: string[] // Finding IDs
}

// 可视化数据
export interface VisualizationData {
  id: string
  title: string
  description: string
  type: "line_chart" | "bar_chart" | "pie_chart" | "scatter_plot" | "heatmap"
  data: any[]
  config?: Record<string, any>
  insights: string[] // 从可视化中得出的洞察
}

// AI洞察
export interface AIInsight {
  id: string
  title: string
  description: string
  type: InsightType
  severity: InsightSeverity
  status: InsightStatus
  confidence: number // 0-100
  dataSource: string
  timeRange: TimeRange
  findings: InsightFinding[]
  recommendations: InsightRecommendation[]
  visualizations: VisualizationData[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  metadata?: Record<string, any>
}

// 洞察分析请求
export interface InsightAnalysisRequest {
  dataSource: string
  metrics: string[]
  timeRange: TimeRange
  analysisTypes: InsightType[]
  options?: {
    includeVisualization?: boolean
    includeRecommendations?: boolean
    minConfidence?: number
    maxResults?: number
    customFilters?: Record<string, any>
  }
}

// 洞察分析结果
export interface InsightAnalysisResult {
  requestId: string
  insights: AIInsight[]
  summary: {
    totalInsights: number
    highSeverityCount: number
    newTrendsCount: number
    anomaliesCount: number
    recommendationsCount: number
  }
  processingTime: number
  dataQuality: {
    completeness: number // 0-1
    accuracy: number // 0-1
    timeliness: number // 0-1
  }
}

// 洞察通知
export interface InsightNotification {
  id: string
  insightId: string
  title: string
  message: string
  severity: InsightSeverity
  type: "new_insight" | "status_change" | "recommendation_update" | "anomaly_alert"
  isRead: boolean
  createdAt: Date
  actionUrl?: string
}

// AI洞察配置
export interface AIInsightConfig {
  autoGenerate: boolean
  analysisFrequency: "real_time" | "hourly" | "daily" | "weekly"
  minConfidence: number
  enabledTypes: InsightType[]
  notificationSettings: {
    push: boolean
    email: boolean
    severityThreshold: InsightSeverity
  }
  dataRetention: {
    insights: number // days
    notifications: number // days
  }
}

// 洞察模板
export interface InsightTemplate {
  id: string
  name: string
  description: string
  type: InsightType
  query: string
  parameters: Record<string, any>
  schedule?: string // cron expression
  isActive: boolean
}

// 洞察仪表盘
export interface InsightDashboard {
  id: string
  name: string
  description: string
  widgets: InsightWidget[]
  layout: DashboardLayout
  filters: DashboardFilter[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

// 洞察小部件
export interface InsightWidget {
  id: string
  type: "insight_list" | "metric_card" | "trend_chart" | "anomaly_detector"
  title: string
  config: Record<string, any>
  position: {
    x: number
    y: number
    width: number
    height: number
  }
}

// 仪表盘布局
export interface DashboardLayout {
  columns: number
  rows: number
  gap: number
}

// 仪表盘筛选器
export interface DashboardFilter {
  id: string
  name: string
  type: "date_range" | "metric" | "severity" | "status"
  options: any[]
  defaultValue?: any
}

// 洞察导出格式
export type ExportFormat = "json" | "csv" | "pdf" | "excel"

// 洞察导出选项
export interface ExportOptions {
  format: ExportFormat
  includeVisualizations: boolean
  includeRecommendations: boolean
  dateRange?: TimeRange
  filters?: Record<string, any>
}

// 洞察搜索查询
export interface InsightSearchQuery {
  text?: string
  types?: InsightType[]
  severities?: InsightSeverity[]
  statuses?: InsightStatus[]
  dateRange?: TimeRange
  tags?: string[]
  sortBy?: "relevance" | "date" | "severity" | "confidence"
  sortOrder?: "asc" | "desc"
  limit?: number
  offset?: number
}

// 洞察搜索结果
export interface InsightSearchResult {
  insights: AIInsight[]
  total: number
  facets: {
    types: Record<InsightType, number>
    severities: Record<InsightSeverity, number>
    statuses: Record<InsightStatus, number>
    tags: Record<string, number>
  }
}

// 洞察性能指标
export interface InsightMetrics {
  totalInsights: number
  insightsByType: Record<InsightType, number>
  insightsBySeverity: Record<InsightSeverity, number>
  averageConfidence: number
  resolutionTime: number // average time to resolve insights
  actionableInsights: number
  implementedRecommendations: number
}

// 洞察趋势
export interface InsightTrend {
  period: "hour" | "day" | "week" | "month"
  data: Array<{
    timestamp: Date
    count: number
    severity: Record<InsightSeverity, number>
  }>
}
