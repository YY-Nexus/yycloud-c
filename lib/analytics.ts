/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 分析工具集成库
 *
 * 支持：
 * - Google Analytics 4
 * - 自定义事件跟踪
 * - 用户行为分析
 * - 性能指标跟踪
 * - 隐私合规管理
 *
 * @module YYC/lib
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

import { recordMetric } from "./performance-monitor"

// 分析工具类型
export type AnalyticsProvider = "google-analytics" | "mixpanel" | "amplitude" | "custom"

// 事件类别
export type EventCategory =
  | "page_view" // 页面浏览
  | "user_engagement" // 用户参与
  | "conversion" // 转化
  | "performance" // 性能
  | "error" // 错误
  | "feature_usage" // 功能使用
  | "network_test" // 网络测试
  | "device" // 设备相关
  | "security" // 安全相关
  | "workflow" // 工作流相关
  | "learning" // 学习相关
  | "asset" // 资产相关
  | "custom" // 自定义

// 事件参数
export interface EventParams {
  [key: string]: string | number | boolean | null | undefined
}

// 用户属性
export interface UserProperties {
  [key: string]: string | number | boolean | null | undefined
}

// 隐私设置
export interface PrivacySettings {
  analyticsEnabled: boolean
  performanceTracking: boolean
  advertisingTracking: boolean
  userProfilingEnabled: boolean
}

// 默认隐私设置
const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  analyticsEnabled: false, // 默认不启用分析
  performanceTracking: false, // 默认不跟踪性能
  advertisingTracking: false, // 默认不跟踪广告
  userProfilingEnabled: false, // 默认不启用用户画像
}

/**
 * 分析工具管理类
 */
class Analytics {
  // 只保留非敏感的环境变量
  private GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""
  private AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || ""
  private initialized = false
  private providers: AnalyticsProvider[] = []
  private privacySettings: PrivacySettings
  private userId: string | null = null
  private userProperties: UserProperties = {}
  private sessionId: string
  private pageLoadTimestamp: number
  private lastEventTimestamp: number
  private consentGiven = false

  constructor() {
    this.privacySettings = this.loadPrivacySettings()
    this.sessionId = this.generateSessionId()
    this.pageLoadTimestamp = Date.now()
    this.lastEventTimestamp = this.pageLoadTimestamp
  }

  /**
   * 初始化分析工具
   */
  init(providers: AnalyticsProvider[] = ["google-analytics"]) {
    if (this.initialized) return

    if (typeof window === "undefined") return

    this.providers = providers

    // 检查用户是否已同意
    this.consentGiven = localStorage.getItem("analytics-consent") === "true"

    if (this.consentGiven) {
      this.initProviders()
    }

    this.initialized = true

    // 记录页面加载
    this.trackPageView()

    // 设置离开页面事件
    window.addEventListener("beforeunload", () => {
      this.trackEvent("user_engagement", "session_end", {
        session_duration: Date.now() - this.pageLoadTimestamp,
      })
    })

    // 记录性能指标
    if (this.privacySettings.performanceTracking) {
      this.trackPerformance()
    }
  }

  /**
   * 初始化各提供商
   */
  private initProviders() {
    if (this.providers.includes("google-analytics") && this.GA_MEASUREMENT_ID) {
      this.initGoogleAnalytics()
    }

    // 移除 Mixpanel 初始化以避免敏感 token 暴露
    // if (this.providers.includes("mixpanel")) {
    //   this.initMixpanel()
    // }

    if (this.providers.includes("amplitude") && this.AMPLITUDE_API_KEY) {
      this.initAmplitude()
    }
  }

  /**
   * 初始化 Google Analytics
   */
  private initGoogleAnalytics() {
    if (!this.GA_MEASUREMENT_ID) return

    // 添加GA4脚本
    const script = document.createElement("script")
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`
    document.head.appendChild(script)

    // 初始化gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments)
    }
    gtag("js", new Date())

    // 配置GA4
    gtag("config", this.GA_MEASUREMENT_ID, {
      send_page_view: false, // 手动发送页面浏览
      anonymize_ip: true, // IP匿名化
      cookie_flags: "SameSite=None;Secure", // Cookie设置
    })

    // 设置用户属性
    if (this.userId && this.privacySettings.userProfilingEnabled) {
      gtag("set", "user_properties", {
        user_id: this.userId,
        ...this.userProperties,
      })
    }

    // 保存gtag引用
    window.gtag = gtag
  }

  /**
   * 初始化Amplitude
   */
  private initAmplitude() {
    if (!this.AMPLITUDE_API_KEY) return // 添加Amplitude脚本
    ;((e, t) => {
      var n = e.amplitude || { _q: [], _iq: {} }
      var r = t.createElement("script")
      r.type = "text/javascript"
      r.integrity = "sha384-tzcaaCH5+KXD4sGaDozev6oElQhsVfbJvdi3//c2YvbY02LrNlbpGdt3Wq4rWonS"
      r.crossOrigin = "anonymous"
      r.async = true
      r.src = "https://cdn.amplitude.com/libs/amplitude-8.5.0-min.gz.js"
      r.onload = () => {
        if (!e.amplitude.runQueuedFunctions) {
          console.log("[Amplitude] Error: could not load SDK")
        }
      }
      var i = t.getElementsByTagName("script")[0]
      i.parentNode.insertBefore(r, i)
      function s(e, t) {
        e.prototype[t] = function () {
          this._q.push([t].concat(Array.prototype.slice.call(arguments, 0)))
          return this
        }
      }
      var o = function () {
        this._q = []
        return this
      }
      var a = ["add", "append", "clearAll", "prepend", "set", "setOnce", "unset", "preInsert", "postInsert", "remove"]
      for (var c = 0; c < a.length; c++) {
        s(o, a[c])
      }
      n.Identify = o
      var u = function () {
        this._q = []
        return this
      }
      var l = ["setProductId", "setQuantity", "setPrice", "setRevenueType", "setEventProperties"]
      for (var p = 0; p < l.length; p++) {
        s(u, l[p])
      }
      n.Revenue = u
      var d = [
        "init",
        "logEvent",
        "logRevenue",
        "setUserId",
        "setUserProperties",
        "setOptOut",
        "setVersionName",
        "setDomain",
        "setDeviceId",
        "enableTracking",
        "setGlobalUserProperties",
        "identify",
        "clearUserProperties",
        "setGroup",
        "logRevenueV2",
        "regenerateDeviceId",
        "groupIdentify",
        "onInit",
        "logEventWithTimestamp",
        "logEventWithGroups",
        "setSessionId",
        "resetSessionId",
      ]
      function v(e) {
        function t(t) {
          e[t] = () => {
            e._q.push([t].concat(Array.prototype.slice.call(arguments, 0)))
          }
        }
        for (var n = 0; n < d.length; n++) {
          t(d[n])
        }
      }
      v(n)
      n.getInstance = (e) => {
        e = (!e || e.length === 0 ? "$default_instance" : e).toLowerCase()
        if (!Object.prototype.hasOwnProperty.call(n._iq, e)) {
          n._iq[e] = { _q: [] }
          v(n._iq[e])
        }
        return n._iq[e]
      }
      e.amplitude = n
    })(window, document)

    // 初始化Amplitude
    window.amplitude.getInstance().init(this.AMPLITUDE_API_KEY, null, {
      includeUtm: true,
      includeReferrer: true,
      trackingOptions: {
        ipAddress: this.privacySettings.userProfilingEnabled,
        city: this.privacySettings.userProfilingEnabled,
        country: this.privacySettings.userProfilingEnabled,
      },
    })

    // 设置用户ID
    if (this.userId && this.privacySettings.userProfilingEnabled) {
      window.amplitude.getInstance().setUserId(this.userId)
      window.amplitude.getInstance().setUserProperties(this.userProperties)
    }
  }

  /**
   * 跟踪页面浏览
   */
  trackPageView(pagePath?: string, pageTitle?: string) {
    if (!this.canTrack("page_view")) return

    const path = pagePath || (typeof window !== "undefined" ? window.location.pathname : "")
    const title = pageTitle || (typeof document !== "undefined" ? document.title : "")

    this.trackEvent("page_view", "view", {
      page_path: path,
      page_title: title,
      page_location: typeof window !== "undefined" ? window.location.href : "",
      session_id: this.sessionId,
    })

    // 记录到性能监控
    recordMetric("page-view", 1)
  }

  /**
   * 跟踪事件
   */
  trackEvent(category: EventCategory, action: string, params: EventParams = {}) {
    if (!this.canTrack(category)) return

    const now = Date.now()
    const timeSinceLastEvent = now - this.lastEventTimestamp
    this.lastEventTimestamp = now

    // 添加通用参数
    const eventParams = {
      ...params,
      event_category: category,
      event_action: action,
      session_id: this.sessionId,
      timestamp: now,
      time_since_last_event: timeSinceLastEvent,
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
    }

    // 发送到各提供商
    this.sendToProviders(category, action, eventParams)

    // 记录到控制台（开发模式）
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Analytics] ${category}:${action}`, eventParams)
    }
  }

  /**
   * 发送到各提供商
   */
  private sendToProviders(category: EventCategory, action: string, params: EventParams) {
    // Google Analytics
    if (this.providers.includes("google-analytics") && window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        ...params,
      })
    }

    // 移除 Mixpanel 调用以避免敏感 token 暴露
    // if (this.providers.includes("mixpanel") && window.mixpanel) {
    //   window.mixpanel.track(`${category}:${action}`, params)
    // }

    // Amplitude
    if (this.providers.includes("amplitude") && window.amplitude) {
      window.amplitude.getInstance().logEvent(`${category}:${action}`, params)
    }
  }

  /**
   * 设置用户ID
   */
  setUserId(userId: string | null) {
    this.userId = userId

    if (!this.privacySettings.userProfilingEnabled) return

    // 更新各提供商
    if (window.gtag) {
      window.gtag("set", { user_id: userId })
    }

    // 移除 Mixpanel 调用
    // if (window.mixpanel && userId) {
    //   window.mixpanel.identify(userId)
    // }

    if (window.amplitude && userId) {
      window.amplitude.getInstance().setUserId(userId)
    }
  }

  /**
   * 设置用户属性
   */
  setUserProperties(properties: UserProperties) {
    this.userProperties = { ...this.userProperties, ...properties }

    if (!this.privacySettings.userProfilingEnabled) return

    // 更新各提供商
    if (window.gtag) {
      window.gtag("set", "user_properties", properties)
    }

    // 移除 Mixpanel 调用
    // if (window.mixpanel) {
    //   window.mixpanel.people.set(properties)
    // }

    if (window.amplitude) {
      window.amplitude.getInstance().setUserProperties(properties)
    }
  }

  /**
   * 跟踪性能指标
   */
  private trackPerformance() {
    if (typeof window === "undefined") return

    // 监听性能指标
    if ("PerformanceObserver" in window) {
      // 监听LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        const lcp = lastEntry.startTime

        this.trackEvent("performance", "lcp", { value: lcp })
        recordMetric("lcp", lcp)
      })

      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })

      // 监听FID (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry) => {
          const fid = entry.processingStart - entry.startTime

          this.trackEvent("performance", "fid", { value: fid })
          recordMetric("fid", fid)
        })
      })

      fidObserver.observe({ type: "first-input", buffered: true })

      // 监听CLS (Cumulative Layout Shift)
      let clsValue = 0
      const clsEntries = []

      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()

        entries.forEach((entry) => {
          // 只有不涉及用户输入的布局偏移才计入CLS
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            clsEntries.push(entry)
          }
        })
      })

      clsObserver.observe({ type: "layout-shift", buffered: true })

      // 页面隐藏时报告CLS
      if (typeof document !== "undefined") {
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") {
            this.trackEvent("performance", "cls", { value: clsValue })
            recordMetric("cls", clsValue)
          }
        })
      }
    }

    // 监听页面加载性能
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = window.performance.timing
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
        const dnsTime = perfData.domainLookupEnd - perfData.domainLookupStart
        const tcpTime = perfData.connectEnd - perfData.connectStart
        const ttfb = perfData.responseStart - perfData.requestStart
        const domLoadTime = perfData.domComplete - perfData.domLoading

        this.trackEvent("performance", "page_load", {
          page_load_time: pageLoadTime,
          dns_time: dnsTime,
          tcp_time: tcpTime,
          ttfb: ttfb,
          dom_load_time: domLoadTime,
        })

        recordMetric("page-load-time", pageLoadTime)
        recordMetric("dns-time", dnsTime)
        recordMetric("tcp-time", tcpTime)
        recordMetric("ttfb", ttfb)
        recordMetric("dom-load-time", domLoadTime)
      }, 0)
    })
  }

  /**
   * 检查是否可以跟踪特定类别
   */
  private canTrack(category: EventCategory): boolean {
    if (!this.initialized || !this.consentGiven) return false

    // 检查隐私设置
    switch (category) {
      case "performance":
        return this.privacySettings.performanceTracking
      case "conversion":
      case "user_engagement":
        return this.privacySettings.userProfilingEnabled
      default:
        return this.privacySettings.analyticsEnabled
    }
  }

  /**
   * 加载隐私设置
   */
  private loadPrivacySettings(): PrivacySettings {
    if (typeof window === "undefined") return DEFAULT_PRIVACY_SETTINGS

    try {
      const savedSettings = localStorage.getItem("privacy-settings")
      return savedSettings ? JSON.parse(savedSettings) : DEFAULT_PRIVACY_SETTINGS
    } catch (error) {
      console.error("Failed to load privacy settings:", error)
      return DEFAULT_PRIVACY_SETTINGS
    }
  }

  /**
   * 保存隐私设置
   */
  savePrivacySettings(settings: Partial<PrivacySettings>) {
    this.privacySettings = { ...this.privacySettings, ...settings }

    if (typeof window === "undefined") return

    try {
      localStorage.setItem("privacy-settings", JSON.stringify(this.privacySettings))

      // 如果启用了分析但尚未初始化，则初始化
      if (this.privacySettings.analyticsEnabled && !this.initialized) {
        this.init()
      }
    } catch (error) {
      console.error("Failed to save privacy settings:", error)
    }
  }

  /**
   * 设置用户同意
   */
  setConsent(consent: boolean) {
    this.consentGiven = consent

    if (typeof window === "undefined") return

    try {
      localStorage.setItem("analytics-consent", consent ? "true" : "false")

      if (consent && !this.initialized) {
        this.init()
      }
    } catch (error) {
      console.error("Failed to save consent:", error)
    }
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  /**
   * 获取当前隐私设置
   */
  getPrivacySettings(): PrivacySettings {
    return { ...this.privacySettings }
  }

  /**
   * 检查是否已同意
   */
  hasConsent(): boolean {
    return this.consentGiven
  }

  /**
   * 跟踪转化目标
   * @param goalId 目标ID
   * @param value 转化价值
   * @param params 附加参数
   */
  trackConversionGoal(goalId: string, value?: number, params: EventParams = {}) {
    if (!this.canTrack("conversion")) return

    const eventParams = {
      ...params,
      goal_id: goalId,
      value: value,
      currency: "CNY",
      timestamp: Date.now(),
      session_id: this.sessionId,
    }

    // 发送到各提供商
    if (window.gtag && this.GA_MEASUREMENT_ID) {
      window.gtag("event", "conversion", {
        send_to: `${this.GA_MEASUREMENT_ID}/${goalId}`,
        value: value,
        currency: "CNY",
        ...params,
      })
    }

    // 移除 Mixpanel 调用
    // if (window.mixpanel) {
    //   window.mixpanel.track("conversion", eventParams)
    // }

    if (window.amplitude) {
      window.amplitude.getInstance().logEvent("conversion", eventParams)
    }

    // 记录到控制台（开发模式）
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Analytics] Conversion Goal: ${goalId}`, eventParams)
    }
  }

  /**
   * 跟踪漏斗步骤
   * @param funnelName 漏斗名称
   * @param stepName 步骤名称
   * @param stepNumber 步骤序号
   * @param params 附加参数
   */
  trackFunnelStep(funnelName: string, stepName: string, stepNumber: number, params: EventParams = {}) {
    if (!this.canTrack("conversion")) return

    const eventParams = {
      ...params,
      funnel_name: funnelName,
      step_name: stepName,
      step_number: stepNumber,
      timestamp: Date.now(),
      session_id: this.sessionId,
    }

    // 发送到各提供商
    this.sendToProviders("conversion", `funnel_step_${funnelName}`, eventParams)

    // 记录到控制台（开发模式）
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Analytics] Funnel Step: ${funnelName} - ${stepName}`, eventParams)
    }
  }
}

// 创建全局实例
export const analytics = new Analytics()

// 便捷函数
export const trackPageView = (pagePath?: string, pageTitle?: string) => {
  analytics.trackPageView(pagePath, pageTitle)
}

export const trackEvent = (category: EventCategory, action: string, params: EventParams = {}) => {
  analytics.trackEvent(category, action, params)
}

export const setUserId = (userId: string | null) => {
  analytics.setUserId(userId)
}

export const setUserProperties = (properties: UserProperties) => {
  analytics.setUserProperties(properties)
}

export const savePrivacySettings = (settings: Partial<PrivacySettings>) => {
  analytics.savePrivacySettings(settings)
}

export const setConsent = (consent: boolean) => {
  analytics.setConsent(consent)
}

export const getPrivacySettings = (): PrivacySettings => {
  return analytics.getPrivacySettings()
}

export const hasConsent = (): boolean => {
  return analytics.hasConsent()
}

// 便捷函数
export const trackConversionGoal = (goalId: string, value?: number, params: EventParams = {}) => {
  analytics.trackConversionGoal(goalId, value, params)
}

export const trackFunnelStep = (funnelName: string, stepName: string, stepNumber: number, params: EventParams = {}) => {
  analytics.trackFunnelStep(funnelName, stepName, stepNumber, params)
}

// 获取性能报告
export const getPerformanceReport = () => {
  if (typeof window === "undefined") {
    return {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
    }
  }

  try {
    const savedReport = localStorage.getItem("performance-report")
    if (savedReport) {
      return JSON.parse(savedReport)
    }
  } catch (error) {
    console.error("Failed to load performance report:", error)
  }

  // 返回默认值
  return {
    pageLoadTime: 1240,
    firstContentfulPaint: 820,
    largestContentfulPaint: 1450,
    cumulativeLayoutShift: 0.08,
  }
}

// 获取反馈统计
export const getFeedbackStats = () => {
  if (typeof window === "undefined") {
    return {
      totalFeedback: 0,
      averageRating: 0,
      positiveCount: 0,
      negativeCount: 0,
    }
  }

  try {
    const savedStats = localStorage.getItem("feedback-stats")
    if (savedStats) {
      return JSON.parse(savedStats)
    }
  } catch (error) {
    console.error("Failed to load feedback stats:", error)
  }

  // 返回默认值
  return {
    totalFeedback: 156,
    averageRating: 4.2,
    positiveCount: 132,
    negativeCount: 24,
  }
}

// 保存性能报告
export const savePerformanceReport = (report: any) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("performance-report", JSON.stringify(report))
  } catch (error) {
    console.error("Failed to save performance report:", error)
  }
}

// 保存反馈统计
export const saveFeedbackStats = (stats: any) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("feedback-stats", JSON.stringify(stats))
  } catch (error) {
    console.error("Failed to save feedback stats:", error)
  }
}

// 类型定义
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
    mixpanel: any
    amplitude: any
  }
}
