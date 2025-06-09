/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 实时数据流管理器
 *
 * @module YYC/lib
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

import type {
  RealTimeStream,
  StreamConfig,
  DataPoint,
  AlertRule,
  AlertEvent,
  StreamMetrics,
  RealTimeDashboard,
  StreamEvent,
} from "@/types/real-time-stream"

// 存储键
const STORAGE_KEYS = {
  streams: "real-time-streams",
  configs: "stream-configs",
  alerts: "stream-alerts",
  events: "stream-events",
  dashboards: "stream-dashboards",
  metrics: "stream-metrics",
}

// 全局流管理器实例
class RealTimeStreamManager {
  private streams: Map<string, RealTimeStream> = new Map()
  private alertRules: Map<string, AlertRule> = new Map()
  private activeAlerts: Map<string, AlertEvent> = new Map()
  private dashboards: Map<string, RealTimeDashboard> = new Map()
  private eventListeners: Map<string, Set<Function>> = new Map()
  private metricsInterval?: NodeJS.Timeout
  private reconnectTimeouts: Map<string, NodeJS.Timeout> = new Map()

  constructor() {
    this.loadFromStorage()
    this.startMetricsCollection()
  }

  /**
   * 创建数据流
   */
  async createStream(config: StreamConfig): Promise<RealTimeStream> {
    const stream: RealTimeStream = {
      id: config.id,
      config,
      status: "disconnected",
      buffer: [],
      statistics: {
        totalPoints: 0,
        pointsPerSecond: 0,
        averageLatency: 0,
        errorRate: 0,
        uptime: 0,
        bytesReceived: 0,
        lastUpdate: new Date(),
      },
      errorCount: 0,
      reconnectCount: 0,
      startTime: new Date(),
      lastActiveTime: new Date(),
    }

    this.streams.set(config.id, stream)
    this.saveToStorage()

    if (config.isActive) {
      await this.connectStream(config.id)
    }

    this.emitEvent("stream_created", { streamId: config.id })
    return stream
  }

  /**
   * 连接数据流
   */
  async connectStream(streamId: string): Promise<void> {
    const stream = this.streams.get(streamId)
    if (!stream) {
      throw new Error(`数据流 ${streamId} 不存在`)
    }

    if (stream.status === "connected") {
      return
    }

    try {
      stream.status = "reconnecting"
      this.emitEvent("stream_connecting", { streamId })

      const { source } = stream.config
      let connection: WebSocket | EventSource

      switch (source.type) {
        case "websocket":
          connection = await this.createWebSocketConnection(stream)
          break
        case "sse":
          connection = await this.createSSEConnection(stream)
          break
        case "polling":
          await this.startPolling(stream)
          return
        default:
          throw new Error(`不支持的连接类型: ${source.type}`)
      }

      stream.connection = connection
      stream.status = "connected"
      stream.lastActiveTime = new Date()
      stream.reconnectCount++

      this.emitEvent("stream_connected", { streamId })
      this.logStreamEvent(streamId, "connected", "数据流连接成功")
    } catch (error) {
      stream.status = "error"
      stream.errorCount++
      this.emitEvent("stream_error", { streamId, error })
      this.logStreamEvent(streamId, "error", `连接失败: ${error}`, "error")

      // 自动重连
      this.scheduleReconnect(streamId)
    }
  }

  /**
   * 创建WebSocket连接
   */
  private async createWebSocketConnection(stream: RealTimeStream): Promise<WebSocket> {
    const { source } = stream.config
    const ws = new WebSocket(source.url)

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        ws.close()
        reject(new Error("WebSocket连接超时"))
      }, 10000)

      ws.onopen = () => {
        clearTimeout(timeout)
        resolve(ws)
      }

      ws.onmessage = (event) => {
        this.handleDataReceived(stream.id, event.data)
      }

      ws.onclose = () => {
        this.handleConnectionClosed(stream.id)
      }

      ws.onerror = (error) => {
        clearTimeout(timeout)
        reject(error)
      }
    })
  }

  /**
   * 创建SSE连接
   */
  private async createSSEConnection(stream: RealTimeStream): Promise<EventSource> {
    const { source } = stream.config
    const eventSource = new EventSource(source.url)

    eventSource.onmessage = (event) => {
      this.handleDataReceived(stream.id, event.data)
    }

    eventSource.onerror = () => {
      this.handleConnectionClosed(stream.id)
    }

    return eventSource
  }

  /**
   * 开始轮询
   */
  private async startPolling(stream: RealTimeStream): Promise<void> {
    const { source, processing } = stream.config
    const interval = processing.flushInterval || 5000

    const poll = async () => {
      try {
        const response = await fetch(source.url, {
          headers: source.headers,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.text()
        this.handleDataReceived(stream.id, data)
      } catch (error) {
        stream.errorCount++
        this.logStreamEvent(stream.id, "error", `轮询失败: ${error}`, "error")
      }
    }

    // 立即执行一次
    await poll()

    // 设置定时轮询
    const pollInterval = setInterval(poll, interval)

    // 存储interval ID以便后续清理
    ;(stream as any).pollInterval = pollInterval
    stream.status = "connected"
  }

  /**
   * 处理接收到的数据
   */
  private handleDataReceived(streamId: string, rawData: string): void {
    const stream = this.streams.get(streamId)
    if (!stream) return

    try {
      // 解析数据
      let data: any
      try {
        data = JSON.parse(rawData)
      } catch {
        data = rawData
      }

      // 创建数据点
      const dataPoint: DataPoint = {
        id: `${streamId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        value: data,
        source: streamId,
        metadata: {
          receivedAt: new Date().toISOString(),
          size: rawData.length,
        },
      }

      // 应用过滤器
      if (!this.applyFilters(dataPoint, stream.config.filters || [])) {
        return
      }

      // 应用转换
      const transformedPoint = this.applyTransformations(dataPoint, stream.config.transformations || [])

      // 添加到缓冲区
      stream.buffer.push(transformedPoint)
      stream.lastDataPoint = transformedPoint
      stream.lastActiveTime = new Date()

      // 更新统计信息
      this.updateStreamStatistics(stream, rawData.length)

      // 检查告警规则
      this.checkAlertRules(streamId, transformedPoint)

      // 管理缓冲区大小
      if (stream.buffer.length > stream.config.processing.bufferSize) {
        stream.buffer = stream.buffer.slice(-stream.config.processing.bufferSize)
      }

      // 触发数据事件
      this.emitEvent("data_received", { streamId, dataPoint: transformedPoint })
    } catch (error) {
      stream.errorCount++
      this.logStreamEvent(streamId, "error", `数据处理失败: ${error}`, "error")
    }
  }

  /**
   * 应用过滤器
   */
  private applyFilters(dataPoint: DataPoint, filters: any[]): boolean {
    for (const filter of filters) {
      const value = this.getFieldValue(dataPoint, filter.field)

      switch (filter.operator) {
        case "eq":
          if (value !== filter.value) return false
          break
        case "ne":
          if (value === filter.value) return false
          break
        case "gt":
          if (Number(value) <= Number(filter.value)) return false
          break
        case "gte":
          if (Number(value) < Number(filter.value)) return false
          break
        case "lt":
          if (Number(value) >= Number(filter.value)) return false
          break
        case "lte":
          if (Number(value) > Number(filter.value)) return false
          break
        case "contains":
          if (!String(value).includes(String(filter.value))) return false
          break
        case "regex":
          if (!new RegExp(filter.value).test(String(value))) return false
          break
      }
    }
    return true
  }

  /**
   * 应用转换
   */
  private applyTransformations(dataPoint: DataPoint, transformations: any[]): DataPoint {
    let result = { ...dataPoint }

    for (const transformation of transformations) {
      switch (transformation.type) {
        case "map":
          result = this.applyMapTransformation(result, transformation.config)
          break
        case "filter":
          if (!this.applyFilterTransformation(result, transformation.config)) {
            return result // 如果被过滤掉，返回原始数据点
          }
          break
        // 可以添加更多转换类型
      }
    }

    return result
  }

  /**
   * 应用映射转换
   */
  private applyMapTransformation(dataPoint: DataPoint, config: any): DataPoint {
    const result = { ...dataPoint }

    if (config.mapping) {
      for (const [sourceField, targetField] of Object.entries(config.mapping)) {
        const value = this.getFieldValue(dataPoint, sourceField)
        this.setFieldValue(result, targetField as string, value)
      }
    }

    return result
  }

  /**
   * 应用过滤转换
   */
  private applyFilterTransformation(dataPoint: DataPoint, config: any): boolean {
    return this.applyFilters(dataPoint, config.filters || [])
  }

  /**
   * 获取字段值
   */
  private getFieldValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj)
  }

  /**
   * 设置字段值
   */
  private setFieldValue(obj: any, path: string, value: any): void {
    const keys = path.split(".")
    const lastKey = keys.pop()!
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {}
      return current[key]
    }, obj)
    target[lastKey] = value
  }

  /**
   * 更新流统计信息
   */
  private updateStreamStatistics(stream: RealTimeStream, dataSize: number): void {
    const now = new Date()
    const stats = stream.statistics

    stats.totalPoints++
    stats.bytesReceived += dataSize
    stats.lastUpdate = now

    // 计算每秒点数（基于最近1分钟）
    const recentPoints = stream.buffer.filter((point) => now.getTime() - point.timestamp.getTime() < 60000)
    stats.pointsPerSecond = recentPoints.length / 60

    // 计算平均延迟（模拟）
    stats.averageLatency = Math.random() * 100 + 50

    // 计算错误率
    const totalOperations = stats.totalPoints + stream.errorCount
    stats.errorRate = totalOperations > 0 ? (stream.errorCount / totalOperations) * 100 : 0

    // 计算正常运行时间
    const totalTime = now.getTime() - stream.startTime.getTime()
    const errorTime = stream.errorCount * 1000 // 假设每个错误导致1秒停机
    stats.uptime = totalTime > 0 ? Math.max(0, (totalTime - errorTime) / totalTime) * 100 : 0
  }

  /**
   * 检查告警规则
   */
  private checkAlertRules(streamId: string, dataPoint: DataPoint): void {
    for (const rule of this.alertRules.values()) {
      if (rule.streamId !== streamId || !rule.isActive) continue

      const value = this.getFieldValue(dataPoint, rule.condition.field)
      let triggered = false

      switch (rule.condition.operator) {
        case "gt":
          triggered = Number(value) > Number(rule.condition.value)
          break
        case "gte":
          triggered = Number(value) >= Number(rule.condition.value)
          break
        case "lt":
          triggered = Number(value) < Number(rule.condition.value)
          break
        case "lte":
          triggered = Number(value) <= Number(rule.condition.value)
          break
        case "eq":
          triggered = value === rule.condition.value
          break
        case "ne":
          triggered = value !== rule.condition.value
          break
      }

      if (triggered) {
        this.triggerAlert(rule, dataPoint)
      }
    }
  }

  /**
   * 触发告警
   */
  private triggerAlert(rule: AlertRule, dataPoint: DataPoint): void {
    const alertEvent: AlertEvent = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ruleId: rule.id,
      streamId: rule.streamId,
      severity: rule.severity,
      message: `告警规则 "${rule.name}" 被触发`,
      dataPoint,
      triggeredAt: new Date(),
      status: "active",
    }

    this.activeAlerts.set(alertEvent.id, alertEvent)
    rule.lastTriggered = new Date()
    rule.triggerCount++

    // 执行告警动作
    for (const action of rule.actions) {
      this.executeAlertAction(action, alertEvent)
    }

    this.emitEvent("alert_triggered", { alertEvent, rule })
    this.logStreamEvent(rule.streamId, "threshold_exceeded", alertEvent.message, "warning")
  }

  /**
   * 执行告警动作
   */
  private executeAlertAction(action: any, alertEvent: AlertEvent): void {
    switch (action.type) {
      case "notification":
        // 发送浏览器通知
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`YYC³ 告警`, {
            body: alertEvent.message,
            icon: "/favicon.ico",
          })
        }
        break
      case "log":
        console.warn(`[告警] ${alertEvent.message}`, alertEvent)
        break
      case "webhook":
        // 发送webhook（在实际应用中实现）
        fetch(action.config.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(alertEvent),
        }).catch(console.error)
        break
    }
  }

  /**
   * 处理连接关闭
   */
  private handleConnectionClosed(streamId: string): void {
    const stream = this.streams.get(streamId)
    if (!stream) return

    stream.status = "disconnected"
    this.emitEvent("stream_disconnected", { streamId })
    this.logStreamEvent(streamId, "disconnected", "数据流连接断开")

    // 自动重连
    if (stream.config.isActive) {
      this.scheduleReconnect(streamId)
    }
  }

  /**
   * 安排重连
   */
  private scheduleReconnect(streamId: string): void {
    const stream = this.streams.get(streamId)
    if (!stream) return

    // 清除现有的重连定时器
    const existingTimeout = this.reconnectTimeouts.get(streamId)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // 指数退避重连
    const delay = Math.min(1000 * Math.pow(2, stream.reconnectCount), 30000)

    const timeout = setTimeout(() => {
      this.connectStream(streamId).catch(console.error)
    }, delay)

    this.reconnectTimeouts.set(streamId, timeout)
  }

  /**
   * 断开数据流
   */
  async disconnectStream(streamId: string): Promise<void> {
    const stream = this.streams.get(streamId)
    if (!stream) return

    // 清除重连定时器
    const timeout = this.reconnectTimeouts.get(streamId)
    if (timeout) {
      clearTimeout(timeout)
      this.reconnectTimeouts.delete(streamId)
    }

    // 关闭连接
    if (stream.connection) {
      if (stream.connection instanceof WebSocket) {
        stream.connection.close()
      } else if (stream.connection instanceof EventSource) {
        stream.connection.close()
      }
    }

    // 清除轮询
    if ((stream as any).pollInterval) {
      clearInterval((stream as any).pollInterval)
    }

    stream.status = "disconnected"
    stream.connection = undefined

    this.emitEvent("stream_disconnected", { streamId })
    this.logStreamEvent(streamId, "disconnected", "数据流手动断开")
  }

  /**
   * 删除数据流
   */
  async deleteStream(streamId: string): Promise<void> {
    await this.disconnectStream(streamId)
    this.streams.delete(streamId)
    this.saveToStorage()
    this.emitEvent("stream_deleted", { streamId })
  }

  /**
   * 获取数据流
   */
  getStream(streamId: string): RealTimeStream | undefined {
    return this.streams.get(streamId)
  }

  /**
   * 获取所有数据流
   */
  getAllStreams(): RealTimeStream[] {
    return Array.from(this.streams.values())
  }

  /**
   * 获取流数据
   */
  getStreamData(streamId: string, limit?: number): DataPoint[] {
    const stream = this.streams.get(streamId)
    if (!stream) return []

    const data = stream.buffer
    return limit ? data.slice(-limit) : data
  }

  /**
   * 添加告警规则
   */
  addAlertRule(rule: AlertRule): void {
    this.alertRules.set(rule.id, rule)
    this.saveToStorage()
  }

  /**
   * 获取告警规则
   */
  getAlertRules(streamId?: string): AlertRule[] {
    const rules = Array.from(this.alertRules.values())
    return streamId ? rules.filter((rule) => rule.streamId === streamId) : rules
  }

  /**
   * 获取活跃告警
   */
  getActiveAlerts(streamId?: string): AlertEvent[] {
    const alerts = Array.from(this.activeAlerts.values())
    return streamId ? alerts.filter((alert) => alert.streamId === streamId) : alerts
  }

  /**
   * 确认告警
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.activeAlerts.get(alertId)
    if (alert) {
      alert.status = "acknowledged"
      alert.acknowledgedAt = new Date()
      this.emitEvent("alert_acknowledged", { alertId })
    }
  }

  /**
   * 解决告警
   */
  resolveAlert(alertId: string): void {
    const alert = this.activeAlerts.get(alertId)
    if (alert) {
      alert.status = "resolved"
      alert.resolvedAt = new Date()
      this.emitEvent("alert_resolved", { alertId })
    }
  }

  /**
   * 记录流事件
   */
  private logStreamEvent(
    streamId: string,
    type: StreamEvent["type"],
    message: string,
    severity: StreamEvent["severity"] = "info",
  ): void {
    const event: StreamEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      streamId,
      type,
      message,
      timestamp: new Date(),
      severity,
    }

    // 存储事件（在实际应用中可能需要持久化）
    this.emitEvent("stream_event", { event })
  }

  /**
   * 开始指标收集
   */
  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      for (const stream of this.streams.values()) {
        const metrics: StreamMetrics = {
          streamId: stream.id,
          timestamp: new Date(),
          throughput: stream.statistics.pointsPerSecond,
          latency: stream.statistics.averageLatency,
          errorRate: stream.statistics.errorRate,
          memoryUsage: stream.buffer.length * 1000, // 估算
          cpuUsage: Math.random() * 10, // 模拟
          connectionStatus: stream.status,
        }

        this.emitEvent("metrics_collected", { metrics })
      }
    }, 5000) // 每5秒收集一次指标
  }

  /**
   * 事件发射器
   */
  private emitEvent(eventType: string, data: any): void {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(data)
        } catch (error) {
          console.error(`事件监听器错误 (${eventType}):`, error)
        }
      })
    }
  }

  /**
   * 添加事件监听器
   */
  addEventListener(eventType: string, listener: Function): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set())
    }
    this.eventListeners.get(eventType)!.add(listener)
  }

  /**
   * 移除事件监听器
   */
  removeEventListener(eventType: string, listener: Function): void {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      listeners.delete(listener)
    }
  }

  /**
   * 从存储加载数据
   */
  private loadFromStorage(): void {
    if (typeof window === "undefined") return

    try {
      // 加载流配置
      const configsData = localStorage.getItem(STORAGE_KEYS.configs)
      if (configsData) {
        const configs: StreamConfig[] = JSON.parse(configsData)
        configs.forEach((config) => {
          const stream: RealTimeStream = {
            id: config.id,
            config,
            status: "disconnected",
            buffer: [],
            statistics: {
              totalPoints: 0,
              pointsPerSecond: 0,
              averageLatency: 0,
              errorRate: 0,
              uptime: 0,
              bytesReceived: 0,
              lastUpdate: new Date(),
            },
            errorCount: 0,
            reconnectCount: 0,
            startTime: new Date(),
            lastActiveTime: new Date(),
          }
          this.streams.set(config.id, stream)
        })
      }

      // 加载告警规则
      const alertsData = localStorage.getItem(STORAGE_KEYS.alerts)
      if (alertsData) {
        const alerts: AlertRule[] = JSON.parse(alertsData)
        alerts.forEach((alert) => {
          this.alertRules.set(alert.id, alert)
        })
      }
    } catch (error) {
      console.error("从存储加载数据失败:", error)
    }
  }

  /**
   * 保存到存储
   */
  private saveToStorage(): void {
    if (typeof window === "undefined") return

    try {
      // 保存流配置
      const configs = Array.from(this.streams.values()).map((stream) => stream.config)
      localStorage.setItem(STORAGE_KEYS.configs, JSON.stringify(configs))

      // 保存告警规则
      const alerts = Array.from(this.alertRules.values())
      localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(alerts))
    } catch (error) {
      console.error("保存数据到存储失败:", error)
    }
  }

  /**
   * 清理资源
   */
  destroy(): void {
    // 断开所有连接
    for (const streamId of this.streams.keys()) {
      this.disconnectStream(streamId)
    }

    // 清理定时器
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval)
    }

    for (const timeout of this.reconnectTimeouts.values()) {
      clearTimeout(timeout)
    }

    // 清理事件监听器
    this.eventListeners.clear()
  }
}

// 创建全局实例
export const streamManager = new RealTimeStreamManager()

// 导出便捷函数
export const createStream = (config: StreamConfig) => streamManager.createStream(config)
export const connectStream = (streamId: string) => streamManager.connectStream(streamId)
export const disconnectStream = (streamId: string) => streamManager.disconnectStream(streamId)
export const getStream = (streamId: string) => streamManager.getStream(streamId)
export const getAllStreams = () => streamManager.getAllStreams()
export const getStreamData = (streamId: string, limit?: number) => streamManager.getStreamData(streamId, limit)
export const addAlertRule = (rule: AlertRule) => streamManager.addAlertRule(rule)
export const getAlertRules = (streamId?: string) => streamManager.getAlertRules(streamId)
export const getActiveAlerts = (streamId?: string) => streamManager.getActiveAlerts(streamId)
export const addEventListener = (eventType: string, listener: Function) =>
  streamManager.addEventListener(eventType, listener)
export const removeEventListener = (eventType: string, listener: Function) =>
  streamManager.removeEventListener(eventType, listener)

// 在页面卸载时清理资源
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    streamManager.destroy()
  })
}
