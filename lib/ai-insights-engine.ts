/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * AI洞察分析引擎
 *
 * @module YYC/lib
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

import type {
  AIInsight,
  InsightType,
  InsightSeverity,
  InsightStatus,
  InsightAnalysisRequest,
  InsightAnalysisResult,
  InsightNotification,
  AIInsightConfig,
  InsightFinding,
  InsightRecommendation,
  VisualizationData,
  DataPoint,
} from "@/types/ai-insights"

// 默认配置
const DEFAULT_CONFIG: AIInsightConfig = {
  autoGenerate: true,
  analysisFrequency: "hourly",
  minConfidence: 70,
  enabledTypes: ["trend", "anomaly", "correlation", "prediction", "optimization"],
  notificationSettings: {
    push: true,
    email: false,
    severityThreshold: "medium",
  },
  dataRetention: {
    insights: 90,
    notifications: 30,
  },
}

// 存储键
const STORAGE_KEYS = {
  insights: "ai-insights",
  notifications: "ai-notifications",
  config: "ai-insights-config",
}

/**
 * 生成模拟数据点
 */
function generateMockDataPoints(count: number, baseValue: number, variance: number): DataPoint[] {
  const points: DataPoint[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i) * 60 * 60 * 1000) // 每小时一个点
    const noise = (Math.random() - 0.5) * variance
    const trend = i * 0.1 // 轻微上升趋势
    const value = baseValue + trend + noise

    points.push({
      timestamp,
      value,
      metadata: {
        source: "network_test",
        quality: Math.random() > 0.1 ? "good" : "poor",
      },
    })
  }

  return points
}

/**
 * 趋势分析
 */
function analyzeTrend(data: DataPoint[]): InsightFinding[] {
  if (data.length < 3) return []

  const findings: InsightFinding[] = []

  // 计算线性回归
  const n = data.length
  const sumX = data.reduce((sum, _, i) => sum + i, 0)
  const sumY = data.reduce((sum, point) => sum + point.value, 0)
  const sumXY = data.reduce((sum, point, i) => sum + i * point.value, 0)
  const sumXX = data.reduce((sum, _, i) => sum + i * i, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // 计算R²
  const meanY = sumY / n
  const ssTotal = data.reduce((sum, point) => sum + Math.pow(point.value - meanY, 2), 0)
  const ssResidual = data.reduce((sum, point, i) => {
    const predicted = slope * i + intercept
    return sum + Math.pow(point.value - predicted, 2)
  }, 0)
  const rSquared = 1 - ssResidual / ssTotal

  // 判断趋势显著性
  if (Math.abs(slope) > 0.1 && rSquared > 0.5) {
    const direction = slope > 0 ? "上升" : "下降"
    const changePercent = ((slope * (n - 1)) / data[0].value) * 100

    findings.push({
      id: `trend-${Date.now()}`,
      description: `检测到${direction}趋势，变化率为${changePercent.toFixed(1)}%`,
      metric: "trend_slope",
      value: slope,
      changePercent,
      significance: rSquared,
      evidence: [
        {
          type: "regression",
          description: "线性回归分析",
          value: slope,
          metadata: { rSquared, intercept },
        },
      ],
      timeRange: {
        start: data[0].timestamp,
        end: data[data.length - 1].timestamp,
      },
    })
  }

  return findings
}

/**
 * 异常检测
 */
function detectAnomalies(data: DataPoint[]): InsightFinding[] {
  if (data.length < 5) return []

  const findings: InsightFinding[] = []
  const values = data.map((p) => p.value)
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length
  const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length)

  // 使用3-sigma规则检测异常
  const threshold = 2.5 * stdDev

  data.forEach((point, index) => {
    const deviation = Math.abs(point.value - mean)
    if (deviation > threshold) {
      const zScore = deviation / stdDev

      findings.push({
        id: `anomaly-${Date.now()}-${index}`,
        description: `检测到异常值，偏离均值${deviation.toFixed(2)}`,
        metric: "anomaly_score",
        value: point.value,
        previousValue: mean,
        changePercent: ((point.value - mean) / mean) * 100,
        significance: Math.min(zScore / 3, 1),
        evidence: [
          {
            type: "significance_test",
            description: "Z-score异常检测",
            value: zScore,
            metadata: { mean, stdDev, threshold },
          },
        ],
        timeRange: {
          start: point.timestamp,
          end: point.timestamp,
        },
      })
    }
  })

  return findings
}

/**
 * 相关性分析
 */
function analyzeCorrelation(data1: DataPoint[], data2: DataPoint[]): InsightFinding[] {
  if (data1.length !== data2.length || data1.length < 3) return []

  const findings: InsightFinding[] = []
  const n = data1.length

  // 计算皮尔逊相关系数
  const mean1 = data1.reduce((sum, p) => sum + p.value, 0) / n
  const mean2 = data2.reduce((sum, p) => sum + p.value, 0) / n

  const numerator = data1.reduce((sum, p1, i) => {
    const p2 = data2[i]
    return sum + (p1.value - mean1) * (p2.value - mean2)
  }, 0)

  const denominator = Math.sqrt(
    data1.reduce((sum, p) => sum + Math.pow(p.value - mean1, 2), 0) *
      data2.reduce((sum, p) => sum + Math.pow(p.value - mean2, 2), 0),
  )

  if (denominator === 0) return findings

  const correlation = numerator / denominator

  // 判断相关性显著性
  if (Math.abs(correlation) > 0.5) {
    const strength = Math.abs(correlation) > 0.8 ? "强" : "中等"
    const direction = correlation > 0 ? "正" : "负"

    findings.push({
      id: `correlation-${Date.now()}`,
      description: `发现${strength}${direction}相关性，相关系数为${correlation.toFixed(3)}`,
      metric: "correlation_coefficient",
      value: correlation,
      significance: Math.abs(correlation),
      evidence: [
        {
          type: "correlation",
          description: "皮尔逊相关分析",
          value: correlation,
          metadata: { mean1, mean2, n },
        },
      ],
      timeRange: {
        start: data1[0].timestamp,
        end: data1[data1.length - 1].timestamp,
      },
    })
  }

  return findings
}

/**
 * 预测分析
 */
function generatePrediction(data: DataPoint[]): InsightFinding[] {
  if (data.length < 5) return []

  const findings: InsightFinding[] = []

  // 简单的移动平均预测
  const windowSize = Math.min(5, Math.floor(data.length / 2))
  const recentData = data.slice(-windowSize)
  const average = recentData.reduce((sum, p) => sum + p.value, 0) / windowSize

  // 计算趋势
  const trendData = data.slice(-Math.min(10, data.length))
  const trendSlope =
    trendData.length > 1 ? (trendData[trendData.length - 1].value - trendData[0].value) / (trendData.length - 1) : 0

  const prediction = average + trendSlope * 3 // 预测3个时间单位后的值
  const confidence = Math.max(0.5, 1 - Math.abs(trendSlope) / average)

  findings.push({
    id: `prediction-${Date.now()}`,
    description: `基于当前趋势，预测下一时段值为${prediction.toFixed(2)}`,
    metric: "predicted_value",
    value: prediction,
    previousValue: data[data.length - 1].value,
    changePercent: ((prediction - data[data.length - 1].value) / data[data.length - 1].value) * 100,
    significance: confidence,
    evidence: [
      {
        type: "regression",
        description: "移动平均趋势预测",
        value: prediction,
        confidenceInterval: [prediction * 0.9, prediction * 1.1],
        metadata: { windowSize, trendSlope, average },
      },
    ],
    timeRange: {
      start: data[data.length - 1].timestamp,
      end: new Date(data[data.length - 1].timestamp.getTime() + 3 * 60 * 60 * 1000),
    },
  })

  return findings
}

/**
 * 生成优化建议
 */
function generateOptimizationRecommendations(findings: InsightFinding[]): InsightRecommendation[] {
  const recommendations: InsightRecommendation[] = []

  findings.forEach((finding) => {
    if (finding.metric === "trend_slope" && finding.value < 0) {
      // 下降趋势的优化建议
      recommendations.push({
        id: `opt-trend-${Date.now()}`,
        title: "改善性能下降趋势",
        description: "检测到性能指标呈下降趋势，建议采取优化措施",
        category: "性能优化",
        priority: "high",
        expectedImpact: "提升15-25%的性能指标",
        effort: "medium",
        timeline: "1-2周",
        actions: [
          {
            id: `action-${Date.now()}-1`,
            title: "分析性能瓶颈",
            description: "深入分析导致性能下降的根本原因",
            priority: "high",
            status: "pending",
          },
          {
            id: `action-${Date.now()}-2`,
            title: "优化系统配置",
            description: "根据分析结果调整系统参数",
            priority: "medium",
            status: "pending",
          },
        ],
        relatedFindings: [finding.id],
      })
    }

    if (finding.metric === "anomaly_score") {
      // 异常的优化建议
      recommendations.push({
        id: `opt-anomaly-${Date.now()}`,
        title: "处理异常数据点",
        description: "发现异常数据点，需要调查原因并采取预防措施",
        category: "异常处理",
        priority: finding.significance > 0.8 ? "critical" : "high",
        expectedImpact: "减少异常发生率50%以上",
        effort: "low",
        timeline: "3-5天",
        actions: [
          {
            id: `action-${Date.now()}-3`,
            title: "调查异常原因",
            description: "分析异常发生的时间和环境因素",
            priority: "high",
            status: "pending",
          },
          {
            id: `action-${Date.now()}-4`,
            title: "设置监控告警",
            description: "建立自动化监控和告警机制",
            priority: "medium",
            status: "pending",
          },
        ],
        relatedFindings: [finding.id],
      })
    }
  })

  return recommendations
}

/**
 * 生成可视化数据
 */
function generateVisualizations(findings: InsightFinding[], data: DataPoint[]): VisualizationData[] {
  const visualizations: VisualizationData[] = []

  // 趋势图
  if (findings.some((f) => f.metric === "trend_slope")) {
    visualizations.push({
      id: `viz-trend-${Date.now()}`,
      title: "趋势分析图",
      description: "显示数据的时间序列趋势",
      type: "line_chart",
      data: data.map((point, index) => ({
        name: point.timestamp.toLocaleTimeString(),
        value: point.value,
        timestamp: point.timestamp,
      })),
      insights: ["数据呈现明显的时间序列模式", "趋势变化具有统计显著性", "建议持续监控趋势变化"],
    })
  }

  // 异常检测图
  if (findings.some((f) => f.metric === "anomaly_score")) {
    const anomalyData = data.map((point, index) => {
      const isAnomaly = findings.some(
        (f) => f.metric === "anomaly_score" && f.timeRange.start.getTime() === point.timestamp.getTime(),
      )
      return {
        name: point.timestamp.toLocaleTimeString(),
        value: point.value,
        isAnomaly,
        timestamp: point.timestamp,
      }
    })

    visualizations.push({
      id: `viz-anomaly-${Date.now()}`,
      title: "异常检测图",
      description: "标识出检测到的异常数据点",
      type: "scatter_plot",
      data: anomalyData,
      insights: [
        `检测到${findings.filter((f) => f.metric === "anomaly_score").length}个异常点`,
        "异常点偏离正常范围较大",
        "建议调查异常发生的原因",
      ],
    })
  }

  // 分布图
  const distributionData = data.reduce(
    (acc, point) => {
      const bucket = Math.floor(point.value / 10) * 10
      const existing = acc.find((item) => item.name === `${bucket}-${bucket + 10}`)
      if (existing) {
        existing.value++
      } else {
        acc.push({
          name: `${bucket}-${bucket + 10}`,
          value: 1,
        })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  visualizations.push({
    id: `viz-distribution-${Date.now()}`,
    title: "数据分布图",
    description: "显示数据值的分布情况",
    type: "bar_chart",
    data: distributionData,
    insights: ["数据分布呈现特定模式", "大部分数据集中在特定范围内", "分布形状有助于理解数据特征"],
  })

  return visualizations
}

/**
 * 执行AI分析
 */
export async function analyzeData(request: InsightAnalysisRequest): Promise<InsightAnalysisResult> {
  const startTime = Date.now()

  try {
    // 生成模拟数据
    const mockData = generateMockDataPoints(24, 100, 20) // 24小时的数据
    const mockData2 = generateMockDataPoints(24, 80, 15) // 第二组数据用于相关性分析

    // 执行各种分析
    const allFindings: InsightFinding[] = []

    if (request.analysisTypes.includes("trend")) {
      allFindings.push(...analyzeTrend(mockData))
    }

    if (request.analysisTypes.includes("anomaly")) {
      allFindings.push(...detectAnomalies(mockData))
    }

    if (request.analysisTypes.includes("correlation")) {
      allFindings.push(...analyzeCorrelation(mockData, mockData2))
    }

    if (request.analysisTypes.includes("prediction")) {
      allFindings.push(...generatePrediction(mockData))
    }

    // 生成推荐
    const recommendations = request.options?.includeRecommendations
      ? generateOptimizationRecommendations(allFindings)
      : []

    // 生成可视化
    const visualizations = request.options?.includeVisualization ? generateVisualizations(allFindings, mockData) : []

    // 创建洞察
    const insights: AIInsight[] = []

    // 按类型分组创建洞察
    const findingsByType = allFindings.reduce(
      (acc, finding) => {
        const type = finding.metric.includes("trend")
          ? "trend"
          : finding.metric.includes("anomaly")
            ? "anomaly"
            : finding.metric.includes("correlation")
              ? "correlation"
              : finding.metric.includes("prediction")
                ? "prediction"
                : "optimization"

        if (!acc[type]) acc[type] = []
        acc[type].push(finding)
        return acc
      },
      {} as Record<string, InsightFinding[]>,
    )

    Object.entries(findingsByType).forEach(([type, findings]) => {
      const severity: InsightSeverity = findings.some((f) => f.significance > 0.8)
        ? "high"
        : findings.some((f) => f.significance > 0.6)
          ? "medium"
          : "low"

      const confidence = Math.round((findings.reduce((sum, f) => sum + f.significance, 0) / findings.length) * 100)

      insights.push({
        id: `insight-${type}-${Date.now()}`,
        title: getInsightTitle(type as InsightType, findings),
        description: getInsightDescription(type as InsightType, findings),
        type: type as InsightType,
        severity,
        status: "new",
        confidence,
        dataSource: request.dataSource,
        timeRange: request.timeRange,
        findings,
        recommendations: recommendations.filter((r) =>
          r.relatedFindings.some((id) => findings.some((f) => f.id === id)),
        ),
        visualizations: visualizations.filter((v) => v.title.toLowerCase().includes(type) || type === "trend"),
        tags: [type, request.dataSource],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

    // 保存洞察
    const existingInsights = getInsights()
    const updatedInsights = [...existingInsights, ...insights]
    saveInsights(updatedInsights)

    // 生成通知
    insights.forEach((insight) => {
      if (insight.severity === "high" || insight.severity === "critical") {
        createNotification({
          insightId: insight.id,
          title: `新的${insight.severity === "critical" ? "严重" : "重要"}洞察`,
          message: insight.title,
          severity: insight.severity,
          type: "new_insight",
        })
      }
    })

    const processingTime = Date.now() - startTime

    return {
      requestId: `req-${Date.now()}`,
      insights,
      summary: {
        totalInsights: insights.length,
        highSeverityCount: insights.filter((i) => i.severity === "high" || i.severity === "critical").length,
        newTrendsCount: insights.filter((i) => i.type === "trend").length,
        anomaliesCount: insights.filter((i) => i.type === "anomaly").length,
        recommendationsCount: recommendations.length,
      },
      processingTime,
      dataQuality: {
        completeness: 0.95,
        accuracy: 0.92,
        timeliness: 0.98,
      },
    }
  } catch (error) {
    console.error("AI分析失败:", error)
    throw new Error("AI分析过程中发生错误")
  }
}

/**
 * 获取洞察标题
 */
function getInsightTitle(type: InsightType, findings: InsightFinding[]): string {
  switch (type) {
    case "trend":
      return findings[0]?.value > 0 ? "检测到上升趋势" : "检测到下降趋势"
    case "anomaly":
      return `发现${findings.length}个异常数据点`
    case "correlation":
      return "发现指标间相关性"
    case "prediction":
      return "生成预测分析"
    default:
      return "AI洞察分析"
  }
}

/**
 * 获取洞察描述
 */
function getInsightDescription(type: InsightType, findings: InsightFinding[]): string {
  switch (type) {
    case "trend":
      const direction = findings[0]?.value > 0 ? "上升" : "下降"
      return `数据呈现${direction}趋势，建议关注变化原因`
    case "anomaly":
      return `在数据中检测到异常值，可能需要进一步调查`
    case "correlation":
      return `发现不同指标之间存在相关性，可用于预测和优化`
    case "prediction":
      return `基于历史数据生成未来趋势预测`
    default:
      return "AI智能分析生成的洞察"
  }
}

/**
 * 获取所有洞察
 */
export function getInsights(): AIInsight[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.insights)
    if (!stored) return []

    const insights = JSON.parse(stored)
    return insights.map((insight: any) => ({
      ...insight,
      createdAt: new Date(insight.createdAt),
      updatedAt: new Date(insight.updatedAt),
      timeRange: {
        start: new Date(insight.timeRange.start),
        end: new Date(insight.timeRange.end),
      },
      findings: insight.findings.map((finding: any) => ({
        ...finding,
        timeRange: {
          start: new Date(finding.timeRange.start),
          end: new Date(finding.timeRange.end),
        },
      })),
    }))
  } catch (error) {
    console.error("加载洞察失败:", error)
    return []
  }
}

/**
 * 保存洞察
 */
export function saveInsights(insights: AIInsight[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.insights, JSON.stringify(insights))
  } catch (error) {
    console.error("保存洞察失败:", error)
  }
}

/**
 * 根据ID获取洞察
 */
export function getInsightById(id: string): AIInsight | null {
  const insights = getInsights()
  return insights.find((insight) => insight.id === id) || null
}

/**
 * 更新洞察状态
 */
export function updateInsightStatus(id: string, status: InsightStatus): void {
  const insights = getInsights()
  const insight = insights.find((i) => i.id === id)

  if (insight) {
    insight.status = status
    insight.updatedAt = new Date()
    saveInsights(insights)

    // 创建状态变更通知
    createNotification({
      insightId: id,
      title: "洞察状态更新",
      message: `洞察"${insight.title}"状态已更新为${status}`,
      severity: "low",
      type: "status_change",
    })
  }
}

/**
 * 获取通知
 */
export function getNotifications(): InsightNotification[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.notifications)
    if (!stored) return []

    const notifications = JSON.parse(stored)
    return notifications.map((notification: any) => ({
      ...notification,
      createdAt: new Date(notification.createdAt),
    }))
  } catch (error) {
    console.error("加载通知失败:", error)
    return []
  }
}

/**
 * 创建通知
 */
export function createNotification(params: {
  insightId: string
  title: string
  message: string
  severity: InsightSeverity
  type: InsightNotification["type"]
}): void {
  if (typeof window === "undefined") return

  const notification: InsightNotification = {
    id: `notification-${Date.now()}`,
    ...params,
    isRead: false,
    createdAt: new Date(),
  }

  const notifications = getNotifications()
  notifications.unshift(notification)

  // 保留最近100条通知
  const trimmedNotifications = notifications.slice(0, 100)

  try {
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(trimmedNotifications))
  } catch (error) {
    console.error("保存通知失败:", error)
  }
}

/**
 * 标记通知为已读
 */
export function markNotificationAsRead(id: string): void {
  const notifications = getNotifications()
  const notification = notifications.find((n) => n.id === id)

  if (notification) {
    notification.isRead = true

    try {
      localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications))
    } catch (error) {
      console.error("保存通知失败:", error)
    }
  }
}

/**
 * 获取AI洞察配置
 */
export function getAIInsightsConfig(): AIInsightConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.config)
    if (!stored) return DEFAULT_CONFIG

    return { ...DEFAULT_CONFIG, ...JSON.parse(stored) }
  } catch (error) {
    console.error("加载配置失败:", error)
    return DEFAULT_CONFIG
  }
}

/**
 * 更新AI洞察配置
 */
export function updateAIInsightsConfig(updates: Partial<AIInsightConfig>): void {
  if (typeof window === "undefined") return

  const currentConfig = getAIInsightsConfig()
  const newConfig = { ...currentConfig, ...updates }

  try {
    localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(newConfig))
  } catch (error) {
    console.error("保存配置失败:", error)
  }
}

/**
 * 清理过期数据
 */
export function cleanupExpiredData(): void {
  const config = getAIInsightsConfig()
  const now = new Date()

  // 清理过期洞察
  const insights = getInsights()
  const validInsights = insights.filter((insight) => {
    const daysSinceCreated = (now.getTime() - insight.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    return daysSinceCreated <= config.dataRetention.insights
  })

  if (validInsights.length !== insights.length) {
    saveInsights(validInsights)
  }

  // 清理过期通知
  const notifications = getNotifications()
  const validNotifications = notifications.filter((notification) => {
    const daysSinceCreated = (now.getTime() - notification.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    return daysSinceCreated <= config.dataRetention.notifications
  })

  if (validNotifications.length !== notifications.length) {
    try {
      localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(validNotifications))
    } catch (error) {
      console.error("清理通知失败:", error)
    }
  }
}

/**
 * 导出洞察数据
 */
export function exportInsights(format: "json" | "csv" = "json"): string {
  const insights = getInsights()

  if (format === "csv") {
    const headers = ["ID", "标题", "类型", "严重程度", "置信度", "状态", "创建时间"]
    const rows = insights.map((insight) => [
      insight.id,
      insight.title,
      insight.type,
      insight.severity,
      insight.confidence,
      insight.status,
      insight.createdAt.toISOString(),
    ])

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }

  return JSON.stringify(insights, null, 2)
}

/**
 * 获取洞察统计
 */
export function getInsightStatistics() {
  const insights = getInsights()

  return {
    total: insights.length,
    byType: insights.reduce(
      (acc, insight) => {
        acc[insight.type] = (acc[insight.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
    bySeverity: insights.reduce(
      (acc, insight) => {
        acc[insight.severity] = (acc[insight.severity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
    byStatus: insights.reduce(
      (acc, insight) => {
        acc[insight.status] = (acc[insight.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
    averageConfidence:
      insights.length > 0 ? insights.reduce((sum, insight) => sum + insight.confidence, 0) / insights.length : 0,
  }
}

// 初始化时清理过期数据
if (typeof window !== "undefined") {
  // 延迟执行清理，避免阻塞页面加载
  setTimeout(cleanupExpiredData, 1000)
}
