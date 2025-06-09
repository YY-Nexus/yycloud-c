/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * A/B测试框架
 *
 * 支持：
 * - 实验分组
 * - 变体测试
 * - 结果跟踪
 * - 与分析系统集成
 *
 * @module YYC/lib
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

import { trackEvent, type EventParams } from "./analytics"

// 实验类型
export type ExperimentType = "feature" | "ui" | "content" | "flow" | "pricing"

// 实验变体
export interface Variant {
  id: string
  name: string
  weight?: number // 权重，用于不均匀分配
}

// 实验配置
export interface Experiment {
  id: string
  name: string
  type: ExperimentType
  variants: Variant[]
  isActive: boolean
  startDate?: Date
  endDate?: Date
  targetAudience?: {
    userType?: string[]
    deviceType?: string[]
    location?: string[]
    customSegment?: string[]
  }
}

// 实验结果
export interface ExperimentResult {
  experimentId: string
  variantId: string
  userId?: string
  sessionId: string
  timestamp: number
  metrics: {
    [key: string]: number
  }
}

/**
 * A/B测试管理类
 */
class ABTesting {
  private experiments: Map<string, Experiment> = new Map()
  private userAssignments: Map<string, Map<string, string>> = new Map() // userId -> {experimentId -> variantId}
  private sessionAssignments: Map<string, Map<string, string>> = new Map() // sessionId -> {experimentId -> variantId}
  private results: ExperimentResult[] = []
  private sessionId: string
  private userId: string | null = null

  constructor() {
    this.sessionId = this.generateSessionId()
    this.loadAssignments()
  }

  /**
   * 初始化A/B测试框架
   */
  init(userId?: string) {
    if (userId) {
      this.userId = userId
    }

    // 从本地存储加载实验分配
    this.loadAssignments()

    // 记录初始化事件
    trackEvent("feature_usage", "ab_testing_init", {
      user_id: this.userId,
      session_id: this.sessionId,
    })
  }

  /**
   * 注册实验
   */
  registerExperiment(experiment: Experiment) {
    this.experiments.set(experiment.id, experiment)

    // 记录实验注册
    trackEvent("feature_usage", "experiment_registered", {
      experiment_id: experiment.id,
      experiment_name: experiment.name,
      experiment_type: experiment.type,
      variant_count: experiment.variants.length,
    })

    return experiment
  }

  /**
   * 获取用户的实验变体
   */
  getVariant(experimentId: string): string | null {
    const experiment = this.experiments.get(experimentId)
    if (!experiment || !experiment.isActive) return null

    // 检查用户是否已分配变体
    if (this.userId) {
      const userAssignments = this.userAssignments.get(this.userId)
      if (userAssignments && userAssignments.has(experimentId)) {
        return userAssignments.get(experimentId) || null
      }
    }

    // 检查会话是否已分配变体
    const sessionAssignments = this.sessionAssignments.get(this.sessionId)
    if (sessionAssignments && sessionAssignments.has(experimentId)) {
      return sessionAssignments.get(experimentId) || null
    }

    // 分配新变体
    const variant = this.assignVariant(experiment)
    this.saveAssignment(experimentId, variant.id)

    // 记录变体分配
    trackEvent("feature_usage", "variant_assigned", {
      experiment_id: experimentId,
      experiment_name: experiment.name,
      variant_id: variant.id,
      variant_name: variant.name,
      user_id: this.userId,
      session_id: this.sessionId,
    })

    return variant.id
  }

  /**
   * 跟踪实验转化
   */
  trackConversion(experimentId: string, metricName: string, value = 1, params: EventParams = {}) {
    const experiment = this.experiments.get(experimentId)
    if (!experiment) return

    const variantId = this.getVariant(experimentId)
    if (!variantId) return

    // 记录结果
    const result: ExperimentResult = {
      experimentId,
      variantId,
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      metrics: {
        [metricName]: value,
      },
    }

    this.results.push(result)

    // 发送到分析系统
    trackEvent("conversion", "experiment_conversion", {
      experiment_id: experimentId,
      experiment_name: experiment.name,
      variant_id: variantId,
      metric_name: metricName,
      metric_value: value,
      ...params,
    })
  }

  /**
   * 分配实验变体
   */
  private assignVariant(experiment: Experiment): Variant {
    const { variants } = experiment

    // 如果只有一个变体，直接返回
    if (variants.length === 1) return variants[0]

    // 根据权重分配变体
    if (variants.some((v) => v.weight !== undefined)) {
      // 计算总权重
      const totalWeight = variants.reduce((sum, variant) => sum + (variant.weight || 1), 0)

      // 生成随机数
      const random = Math.random() * totalWeight

      // 根据权重选择变体
      let cumulativeWeight = 0
      for (const variant of variants) {
        cumulativeWeight += variant.weight || 1
        if (random < cumulativeWeight) {
          return variant
        }
      }
    }

    // 均匀分配
    const randomIndex = Math.floor(Math.random() * variants.length)
    return variants[randomIndex]
  }

  /**
   * 保存分配结果
   */
  private saveAssignment(experimentId: string, variantId: string) {
    // 保存到用户分配
    if (this.userId) {
      if (!this.userAssignments.has(this.userId)) {
        this.userAssignments.set(this.userId, new Map())
      }
      this.userAssignments.get(this.userId)!.set(experimentId, variantId)
    }

    // 保存到会话分配
    if (!this.sessionAssignments.has(this.sessionId)) {
      this.sessionAssignments.set(this.sessionId, new Map())
    }
    this.sessionAssignments.get(this.sessionId)!.set(experimentId, variantId)

    // 保存到本地存储
    this.saveAssignmentsToStorage()
  }

  /**
   * 从本地存储加载分配
   */
  private loadAssignments() {
    if (typeof window === "undefined") return

    try {
      // 加载用户分配
      const userAssignmentsStr = localStorage.getItem("ab-user-assignments")
      if (userAssignmentsStr) {
        const userAssignmentsObj = JSON.parse(userAssignmentsStr)
        Object.entries(userAssignmentsObj).forEach(([userId, assignments]) => {
          const assignmentMap = new Map(Object.entries(assignments as Record<string, string>))
          this.userAssignments.set(userId, assignmentMap)
        })
      }

      // 加载会话分配
      const sessionAssignmentsStr = localStorage.getItem("ab-session-assignments")
      if (sessionAssignmentsStr) {
        const sessionAssignmentsObj = JSON.parse(sessionAssignmentsStr)
        Object.entries(sessionAssignmentsObj).forEach(([sessionId, assignments]) => {
          const assignmentMap = new Map(Object.entries(assignments as Record<string, string>))
          this.sessionAssignments.set(sessionId, assignmentMap)
        })
      }
    } catch (error) {
      console.error("Failed to load A/B test assignments:", error)
    }
  }

  /**
   * 保存分配到本地存储
   */
  private saveAssignmentsToStorage() {
    if (typeof window === "undefined") return

    try {
      // 保存用户分配
      const userAssignmentsObj: Record<string, Record<string, string>> = {}
      this.userAssignments.forEach((assignments, userId) => {
        userAssignmentsObj[userId] = Object.fromEntries(assignments)
      })
      localStorage.setItem("ab-user-assignments", JSON.stringify(userAssignmentsObj))

      // 保存会话分配
      const sessionAssignmentsObj: Record<string, Record<string, string>> = {}
      this.sessionAssignments.forEach((assignments, sessionId) => {
        sessionAssignmentsObj[sessionId] = Object.fromEntries(assignments)
      })
      localStorage.setItem("ab-session-assignments", JSON.stringify(sessionAssignmentsObj))
    } catch (error) {
      console.error("Failed to save A/B test assignments:", error)
    }
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  /**
   * 设置用户ID
   */
  setUserId(userId: string | null) {
    this.userId = userId
  }

  /**
   * 获取所有实验
   */
  getExperiments(): Experiment[] {
    return Array.from(this.experiments.values())
  }

  /**
   * 获取实验结果
   */
  getResults(experimentId?: string): ExperimentResult[] {
    if (experimentId) {
      return this.results.filter((result) => result.experimentId === experimentId)
    }
    return this.results
  }
}

// 创建全局实例
export const abTesting = new ABTesting()

// 便捷函数
export const registerExperiment = (experiment: Experiment) => {
  return abTesting.registerExperiment(experiment)
}

export const getVariant = (experimentId: string) => {
  return abTesting.getVariant(experimentId)
}

export const trackConversion = (experimentId: string, metricName: string, value = 1, params: EventParams = {}) => {
  abTesting.trackConversion(experimentId, metricName, value, params)
}

export const setABTestingUserId = (userId: string | null) => {
  abTesting.setUserId(userId)
}

export const getExperiments = () => {
  return abTesting.getExperiments()
}

export const getExperimentResults = (experimentId?: string) => {
  return abTesting.getResults(experimentId)
}
