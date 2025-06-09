/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 分析报告生成器
 *
 * 支持：
 * - 自定义报告生成
 * - 数据导出
 * - 报告模板
 *
 * @module YYC/lib
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

// 报告类型
export type ReportType =
  | "usage" // 使用情况报告
  | "performance" // 性能报告
  | "conversion" // 转化报告
  | "user" // 用户报告
  | "feature" // 功能使用报告
  | "custom" // 自定义报告

// 报告时间范围
export type ReportTimeRange = "24h" | "7d" | "30d" | "90d" | "custom"

// 报告格式
export type ReportFormat = "json" | "csv" | "pdf" | "excel"

// 报告配置
export interface ReportConfig {
  type: ReportType
  title: string
  description?: string
  timeRange: ReportTimeRange
  customDateRange?: {
    startDate: Date
    endDate: Date
  }
  metrics: string[]
  dimensions?: string[]
  filters?: Record<string, any>
  segments?: string[]
  format: ReportFormat
  scheduled?: boolean
  scheduledConfig?: {
    frequency: "daily" | "weekly" | "monthly"
    recipients: string[]
    dayOfWeek?: number // 0-6, 0 is Sunday
    dayOfMonth?: number // 1-31
  }
}

// 报告数据
export interface ReportData {
  id: string
  config: ReportConfig
  generatedAt: Date
  data: any
  url?: string
}

// 报告模板
export interface ReportTemplate {
  id: string
  name: string
  description: string
  config: Omit<ReportConfig, "title">
  createdAt: Date
  updatedAt: Date
}

/**
 * 分析报告生成器类
 */
class ReportGenerator {
  private templates: Map<string, ReportTemplate> = new Map()
  private reports: Map<string, ReportData> = new Map()

  constructor() {
    this.loadTemplates()
    this.loadReports()
  }

  /**
   * 加载报告模板
   */
  private loadTemplates() {
    // 在实际应用中，这些应该从API或本地存储加载
    const defaultTemplates: ReportTemplate[] = [
      {
        id: "template_usage_overview",
        name: "使用情况概览",
        description: "应用使用情况的综合概览报告",
        config: {
          type: "usage",
          timeRange: "30d",
          metrics: ["page_views", "unique_users", "session_duration", "bounce_rate"],
          dimensions: ["date", "device_type", "browser"],
          format: "pdf",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "template_performance",
        name: "性能监控报告",
        description: "应用性能指标的详细报告",
        config: {
          type: "performance",
          timeRange: "7d",
          metrics: ["page_load_time", "lcp", "fid", "cls", "ttfb"],
          dimensions: ["date", "page", "device_type"],
          format: "pdf",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "template_feature_usage",
        name: "功能使用报告",
        description: "各功能模块的使用情况报告",
        config: {
          type: "feature",
          timeRange: "30d",
          metrics: ["usage_count", "unique_users", "avg_time_spent"],
          dimensions: ["feature", "date", "user_type"],
          format: "excel",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    defaultTemplates.forEach((template) => {
      this.templates.set(template.id, template)
    })
  }

  /**
   * 加载已生成的报告
   */
  private loadReports() {
    // 在实际应用中，这些应该从API或本地存储加载
    // 这里只是示例数据
  }

  /**
   * 获取所有报告模板
   */
  getTemplates(): ReportTemplate[] {
    return Array.from(this.templates.values())
  }

  /**
   * 获取报告模板
   */
  getTemplate(id: string): ReportTemplate | undefined {
    return this.templates.get(id)
  }

  /**
   * 创建报告模板
   */
  createTemplate(template: Omit<ReportTemplate, "id" | "createdAt" | "updatedAt">): ReportTemplate {
    const id = `template_${Date.now()}`
    const newTemplate: ReportTemplate = {
      ...template,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.templates.set(id, newTemplate)
    return newTemplate
  }

  /**
   * 更新报告模板
   */
  updateTemplate(
    id: string,
    template: Partial<Omit<ReportTemplate, "id" | "createdAt" | "updatedAt">>,
  ): ReportTemplate | undefined {
    const existingTemplate = this.templates.get(id)
    if (!existingTemplate) return undefined

    const updatedTemplate: ReportTemplate = {
      ...existingTemplate,
      ...template,
      updatedAt: new Date(),
    }

    this.templates.set(id, updatedTemplate)
    return updatedTemplate
  }

  /**
   * 删除报告模板
   */
  deleteTemplate(id: string): boolean {
    return this.templates.delete(id)
  }

  /**
   * 生成报告
   */
  async generateReport(config: ReportConfig): Promise<ReportData> {
    // 在实际应用中，这应该调用API来生成报告
    // 这里只是模拟生成过程

    // 生成报告ID
    const id = `report_${Date.now()}`

    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 创建报告数据
    const reportData: ReportData = {
      id,
      config,
      generatedAt: new Date(),
      data: this.generateMockData(config),
      url: `https://example.com/reports/${id}.${config.format}`,
    }

    // 保存报告
    this.reports.set(id, reportData)

    return reportData
  }

  /**
   * 从模板生成报告
   */
  async generateReportFromTemplate(
    templateId: string,
    title: string,
    overrides?: Partial<ReportConfig>,
  ): Promise<ReportData | undefined> {
    const template = this.templates.get(templateId)
    if (!template) return undefined

    const config: ReportConfig = {
      ...template.config,
      ...overrides,
      title,
    }

    return this.generateReport(config)
  }

  /**
   * 获取所有报告
   */
  getReports(): ReportData[] {
    return Array.from(this.reports.values())
  }

  /**
   * 获取报告
   */
  getReport(id: string): ReportData | undefined {
    return this.reports.get(id)
  }

  /**
   * 删除报告
   */
  deleteReport(id: string): boolean {
    return this.reports.delete(id)
  }

  /**
   * 导出报告
   */
  async exportReport(id: string, format: ReportFormat): Promise<string> {
    const report = this.reports.get(id)
    if (!report) throw new Error(`Report with ID ${id} not found`)

    // 在实际应用中，这应该调用API来导出报告
    // 这里只是模拟导出过程
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 返回下载URL
    return `https://example.com/reports/${id}.${format}`
  }

  /**
   * 生成模拟数据
   */
  private generateMockData(config: ReportConfig): any {
    // 根据报告类型生成不同的模拟数据
    switch (config.type) {
      case "usage":
        return this.generateUsageReportData(config)
      case "performance":
        return this.generatePerformanceReportData(config)
      case "conversion":
        return this.generateConversionReportData(config)
      case "feature":
        return this.generateFeatureReportData(config)
      default:
        return {}
    }
  }

  /**
   * 生成使用情况报告数据
   */
  private generateUsageReportData(config: ReportConfig): any {
    // 生成日期范围
    const dates = this.generateDateRange(config.timeRange, config.customDateRange)

    // 生成页面浏览数据
    const pageViewsData = dates.map((date) => ({
      date: date.toISOString().split("T")[0],
      page_views: Math.floor(Math.random() * 1000) + 500,
      unique_users: Math.floor(Math.random() * 500) + 200,
      session_duration: Math.floor(Math.random() * 300) + 60,
      bounce_rate: (Math.random() * 30 + 20).toFixed(2),
    }))

    // 生成设备类型数据
    const deviceData = [
      { device_type: "桌面", users: Math.floor(Math.random() * 5000) + 2000 },
      { device_type: "移动", users: Math.floor(Math.random() * 4000) + 3000 },
      { device_type: "平板", users: Math.floor(Math.random() * 1000) + 500 },
    ]

    // 生成浏览器数据
    const browserData = [
      { browser: "Chrome", users: Math.floor(Math.random() * 5000) + 3000 },
      { browser: "Safari", users: Math.floor(Math.random() * 3000) + 2000 },
      { browser: "Firefox", users: Math.floor(Math.random() * 1500) + 1000 },
      { browser: "Edge", users: Math.floor(Math.random() * 1200) + 800 },
      { browser: "其他", users: Math.floor(Math.random() * 800) + 400 },
    ]

    return {
      summary: {
        total_page_views: pageViewsData.reduce((sum, item) => sum + item.page_views, 0),
        total_unique_users: Math.floor(pageViewsData.reduce((sum, item) => sum + item.unique_users, 0) * 0.4),
        avg_session_duration: (
          pageViewsData.reduce((sum, item) => sum + item.session_duration, 0) / pageViewsData.length
        ).toFixed(2),
        avg_bounce_rate: (
          pageViewsData.reduce((sum, item) => sum + Number.parseFloat(item.bounce_rate), 0) / pageViewsData.length
        ).toFixed(2),
      },
      page_views_trend: pageViewsData,
      device_distribution: deviceData,
      browser_distribution: browserData,
    }
  }

  /**
   * 生成性能报告数据
   */
  private generatePerformanceReportData(config: ReportConfig): any {
    // 生成日期范围
    const dates = this.generateDateRange(config.timeRange, config.customDateRange)

    // 生成性能数据
    const performanceData = dates.map((date) => ({
      date: date.toISOString().split("T")[0],
      page_load_time: (Math.random() * 2 + 0.8).toFixed(2),
      lcp: (Math.random() * 1.5 + 1.2).toFixed(2),
      fid: (Math.random() * 0.1 + 0.05).toFixed(3),
      cls: (Math.random() * 0.1).toFixed(3),
      ttfb: (Math.random() * 0.3 + 0.1).toFixed(2),
    }))

    // 生成页面性能数据
    const pagePerformanceData = [
      {
        page: "首页",
        page_load_time: (Math.random() * 1.5 + 0.7).toFixed(2),
        lcp: (Math.random() * 1.2 + 1).toFixed(2),
      },
      {
        page: "仪表盘",
        page_load_time: (Math.random() * 2 + 1).toFixed(2),
        lcp: (Math.random() * 1.5 + 1.2).toFixed(2),
      },
      {
        page: "网络测试",
        page_load_time: (Math.random() * 2.5 + 1.2).toFixed(2),
        lcp: (Math.random() * 1.8 + 1.5).toFixed(2),
      },
      {
        page: "设备管理",
        page_load_time: (Math.random() * 2.2 + 1.1).toFixed(2),
        lcp: (Math.random() * 1.6 + 1.3).toFixed(2),
      },
      {
        page: "安全中心",
        page_load_time: (Math.random() * 1.8 + 0.9).toFixed(2),
        lcp: (Math.random() * 1.4 + 1.1).toFixed(2),
      },
    ]

    return {
      summary: {
        avg_page_load_time: (
          performanceData.reduce((sum, item) => sum + Number.parseFloat(item.page_load_time), 0) /
          performanceData.length
        ).toFixed(2),
        avg_lcp: (
          performanceData.reduce((sum, item) => sum + Number.parseFloat(item.lcp), 0) / performanceData.length
        ).toFixed(2),
        avg_fid: (
          performanceData.reduce((sum, item) => sum + Number.parseFloat(item.fid), 0) / performanceData.length
        ).toFixed(3),
        avg_cls: (
          performanceData.reduce((sum, item) => sum + Number.parseFloat(item.cls), 0) / performanceData.length
        ).toFixed(3),
        avg_ttfb: (
          performanceData.reduce((sum, item) => sum + Number.parseFloat(item.ttfb), 0) / performanceData.length
        ).toFixed(2),
      },
      performance_trend: performanceData,
      page_performance: pagePerformanceData,
    }
  }

  /**
   * 生成转化报告数据
   */
  private generateConversionReportData(config: ReportConfig): any {
    // 生成日期范围
    const dates = this.generateDateRange(config.timeRange, config.customDateRange)

    // 生成转化数据
    const conversionData = dates.map((date) => ({
      date: date.toISOString().split("T")[0],
      visitors: Math.floor(Math.random() * 500) + 200,
      conversions: Math.floor(Math.random() * 50) + 20,
      conversion_rate: (Math.random() * 10 + 5).toFixed(2),
      avg_value: (Math.random() * 50 + 20).toFixed(2),
    }))

    // 生成漏斗数据
    const funnelData = [
      { stage: "访问", count: 1000, rate: "100%" },
      { stage: "浏览功能", count: 750, rate: "75%" },
      { stage: "开始测试", count: 500, rate: "50%" },
      { stage: "完成测试", count: 350, rate: "35%" },
      { stage: "查看结果", count: 300, rate: "30%" },
      { stage: "分享结果", count: 100, rate: "10%" },
    ]

    return {
      summary: {
        total_visitors: conversionData.reduce((sum, item) => sum + item.visitors, 0),
        total_conversions: conversionData.reduce((sum, item) => sum + item.conversions, 0),
        avg_conversion_rate: (
          conversionData.reduce((sum, item) => sum + Number.parseFloat(item.conversion_rate), 0) / conversionData.length
        ).toFixed(2),
        avg_value: (
          conversionData.reduce((sum, item) => sum + Number.parseFloat(item.avg_value), 0) / conversionData.length
        ).toFixed(2),
      },
      conversion_trend: conversionData,
      funnel: funnelData,
    }
  }

  /**
   * 生成功能使用报告数据
   */
  private generateFeatureReportData(config: ReportConfig): any {
    // 生成功能使用数据
    const featureData = [
      {
        feature: "网络测试",
        usage_count: Math.floor(Math.random() * 1000) + 500,
        unique_users: Math.floor(Math.random() * 500) + 200,
        avg_time_spent: Math.floor(Math.random() * 300) + 60,
      },
      {
        feature: "设备管理",
        usage_count: Math.floor(Math.random() * 800) + 400,
        unique_users: Math.floor(Math.random() * 400) + 150,
        avg_time_spent: Math.floor(Math.random() * 250) + 50,
      },
      {
        feature: "安全中心",
        usage_count: Math.floor(Math.random() * 600) + 300,
        unique_users: Math.floor(Math.random() * 300) + 100,
        avg_time_spent: Math.floor(Math.random() * 200) + 40,
      },
      {
        feature: "学习中心",
        usage_count: Math.floor(Math.random() * 500) + 200,
        unique_users: Math.floor(Math.random() * 250) + 80,
        avg_time_spent: Math.floor(Math.random() * 180) + 30,
      },
      {
        feature: "工作流",
        usage_count: Math.floor(Math.random() * 400) + 100,
        unique_users: Math.floor(Math.random() * 200) + 50,
        avg_time_spent: Math.floor(Math.random() * 150) + 20,
      },
    ]

    // 生成日期范围
    const dates = this.generateDateRange(config.timeRange, config.customDateRange)

    // 生成趋势数据
    const trendData = {}
    featureData.forEach((feature) => {
      trendData[feature.feature] = dates.map((date) => ({
        date: date.toISOString().split("T")[0],
        usage_count: Math.floor(Math.random() * (feature.usage_count * 0.2)) + feature.usage_count * 0.8,
      }))
    })

    return {
      summary: {
        total_usage: featureData.reduce((sum, item) => sum + item.usage_count, 0),
        total_unique_users: Math.floor(featureData.reduce((sum, item) => sum + item.unique_users, 0) * 0.6),
        most_used_feature: featureData.sort((a, b) => b.usage_count - a.usage_count)[0].feature,
      },
      feature_usage: featureData,
      usage_trends: trendData,
    }
  }

  /**
   * 生成日期范围
   */
  private generateDateRange(timeRange: ReportTimeRange, customDateRange?: { startDate: Date; endDate: Date }): Date[] {
    const endDate = new Date()
    let startDate: Date

    if (timeRange === "custom" && customDateRange) {
      startDate = new Date(customDateRange.startDate)
      endDate.setTime(new Date(customDateRange.endDate).getTime())
    } else {
      switch (timeRange) {
        case "24h":
          startDate = new Date(endDate)
          startDate.setDate(endDate.getDate() - 1)
          break
        case "7d":
          startDate = new Date(endDate)
          startDate.setDate(endDate.getDate() - 7)
          break
        case "30d":
          startDate = new Date(endDate)
          startDate.setDate(endDate.getDate() - 30)
          break
        case "90d":
          startDate = new Date(endDate)
          startDate.setDate(endDate.getDate() - 90)
          break
        default:
          startDate = new Date(endDate)
          startDate.setDate(endDate.getDate() - 7)
      }
    }

    const dates: Date[] = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
  }
}

// 创建全局实例
export const reportGenerator = new ReportGenerator()

// 便捷函数
export const getReportTemplates = () => {
  return reportGenerator.getTemplates()
}

export const getReportTemplate = (id: string) => {
  return reportGenerator.getTemplate(id)
}

export const createReportTemplate = (template: Omit<ReportTemplate, "id" | "createdAt" | "updatedAt">) => {
  return reportGenerator.createTemplate(template)
}

export const updateReportTemplate = (
  id: string,
  template: Partial<Omit<ReportTemplate, "id" | "createdAt" | "updatedAt">>,
) => {
  return reportGenerator.updateTemplate(id, template)
}

export const deleteReportTemplate = (id: string) => {
  return reportGenerator.deleteTemplate(id)
}

export const generateReport = (config: ReportConfig) => {
  return reportGenerator.generateReport(config)
}

export const generateReportFromTemplate = (templateId: string, title: string, overrides?: Partial<ReportConfig>) => {
  return reportGenerator.generateReportFromTemplate(templateId, title, overrides)
}

export const getReports = () => {
  return reportGenerator.getReports()
}

export const getReport = (id: string) => {
  return reportGenerator.getReport(id)
}

export const deleteReportOld = (id: string) => {
  return reportGenerator.deleteReport(id)
}

export const exportReportOld = (id: string, format: ReportFormat) => {
  return reportGenerator.exportReport(id, format)
}

// New Code
export interface ComparisonReport {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  devices: any[]
  analysisConfig: AnalysisConfig
  summary: ReportSummary
  insights: Insight[]
  charts: Charts
  exportFormats: string[]
}

export interface AnalysisConfig {
  selectedDeviceIds: string[]
  primaryMetric: string
  timeRange: TimeRange
  includeInsights: boolean
  includeCharts: boolean
  includeRawData: boolean
}

export interface TimeRange {
  start: Date
  end: Date
}

export interface ReportSummary {
  totalDevices: number
  totalTests: number
  bestPerformingDevice: DevicePerformance
  worstPerformingDevice: DevicePerformance
  averagePerformance: AveragePerformance
}

export interface DevicePerformance {
  deviceId: string
  deviceName: string
  metric: string
  value: number
}

export interface AveragePerformance {
  download: number
  upload: number
  ping: number
  jitter: number
  packetLoss: number
  qualityScore: number
}

export interface Insight {
  type: string
  title: string
  description: string
  priority: string
}

export interface Charts {
  comparisonChart: string
  trendChart: string
  radarChart: string
}

export interface ExportOptions {
  format: string
}

export interface DeviceWithResults {
  id: string
  name: string
  results: Result[]
}

export interface Result {
  download: number
  upload: number
  ping: number
  jitter: number
  packetLoss: number
  qualityScore: number
}

export const getSavedReports = async (): Promise<ComparisonReport[]> => {
  try {
    // 在实际应用中，这应该从API或本地存储加载
    // 这里返回示例数据
    const mockReports: ComparisonReport[] = [
      {
        id: "report_1",
        name: "网络性能对比报告",
        description: "对比不同设备的网络性能表现",
        createdAt: new Date(Date.now() - 86400000), // 1天前
        updatedAt: new Date(Date.now() - 86400000),
        devices: [],
        analysisConfig: {
          selectedDeviceIds: ["device1", "device2"],
          primaryMetric: "download",
          timeRange: {
            start: new Date(Date.now() - 7 * 86400000),
            end: new Date(),
          },
          includeInsights: true,
          includeCharts: true,
          includeRawData: false,
        },
        summary: {
          totalDevices: 2,
          totalTests: 50,
          bestPerformingDevice: {
            deviceId: "device1",
            deviceName: "MacBook Pro M4",
            metric: "download",
            value: 150.5,
          },
          worstPerformingDevice: {
            deviceId: "device2",
            deviceName: "iMac M1",
            metric: "download",
            value: 98.2,
          },
          averagePerformance: {
            download: 124.35,
            upload: 45.67,
            ping: 12,
            jitter: 2.1,
            packetLoss: 0.1,
            qualityScore: 85.5,
          },
        },
        insights: [
          {
            type: "info",
            title: "性能表现良好",
            description: "所有设备的网络性能都在正常范围内",
            priority: "low",
          },
        ],
        charts: {
          comparisonChart: "",
          trendChart: "",
          radarChart: "",
        },
        exportFormats: ["pdf", "excel", "csv"],
      },
    ]

    return mockReports
  } catch (error) {
    console.error("获取报告失败:", error)
    return []
  }
}

export const deleteReport = async (id: string): Promise<boolean> => {
  try {
    // 在实际应用中，这应该调用API删除报告
    console.log(`删除报告: ${id}`)
    return true
  } catch (error) {
    console.error("删除报告失败:", error)
    return false
  }
}

export const exportReport = async (report: ComparisonReport, options: ExportOptions): Promise<Blob | string> => {
  try {
    // 模拟导出过程
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (options.format === "json") {
      return JSON.stringify(report, null, 2)
    } else if (options.format === "csv") {
      // 简单的CSV格式
      const csvContent = `报告名称,创建时间,设备数量,测试总数\n${report.name},${report.createdAt.toISOString()},${report.summary.totalDevices},${report.summary.totalTests}`
      return csvContent
    } else {
      // 对于PDF和Excel，返回一个模拟的Blob
      const content = `报告: ${report.name}\n创建时间: ${report.createdAt.toLocaleString()}\n设备数量: ${report.summary.totalDevices}`
      return new Blob([content], { type: "text/plain" })
    }
  } catch (error) {
    console.error("导出报告失败:", error)
    throw error
  }
}

export const generateComparisonReport = async (
  devices: DeviceWithResults[],
  config: AnalysisConfig,
): Promise<ComparisonReport> => {
  const reportId = `comparison_${Date.now()}`

  // 计算摘要数据
  const summary: ReportSummary = {
    totalDevices: devices.length,
    totalTests: devices.reduce((sum, device) => sum + device.results.length, 0),
    bestPerformingDevice: {
      deviceId: devices[0]?.id || "",
      deviceName: devices[0]?.name || "",
      metric: config.primaryMetric,
      value: (devices[0]?.results[0]?.[config.primaryMetric as keyof Result] as number) || 0,
    },
    worstPerformingDevice: {
      deviceId: devices[0]?.id || "",
      deviceName: devices[0]?.name || "",
      metric: config.primaryMetric,
      value: (devices[0]?.results[0]?.[config.primaryMetric as keyof Result] as number) || 0,
    },
    averagePerformance: {
      download: 0,
      upload: 0,
      ping: 0,
      jitter: 0,
      packetLoss: 0,
      qualityScore: 0,
    },
  }

  // 生成洞察
  const insights: Insight[] = [
    {
      type: "info",
      title: "对比分析完成",
      description: `已分析 ${devices.length} 台设备的性能数据`,
      priority: "low",
    },
  ]

  const report: ComparisonReport = {
    id: reportId,
    name: `设备对比报告 - ${new Date().toLocaleDateString()}`,
    description: "设备网络性能对比分析报告",
    createdAt: new Date(),
    updatedAt: new Date(),
    devices,
    analysisConfig: config,
    summary,
    insights,
    charts: {
      comparisonChart: "",
      trendChart: "",
      radarChart: "",
    },
    exportFormats: ["pdf", "excel", "csv"],
  }

  return report
}

export const saveReport = async (report: ComparisonReport): Promise<boolean> => {
  try {
    // 在实际应用中，这应该调用API保存报告
    console.log("保存报告:", report.id)
    return true
  } catch (error) {
    console.error("保存报告失败:", error)
    return false
  }
}

export const getDefaultReportTemplates = (): ReportTemplate[] => {
  return reportGenerator.getTemplates()
}
