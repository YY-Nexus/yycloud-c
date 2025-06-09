import { subHours, subDays, isAfter, isBefore } from "date-fns"
import { zhCN } from "date-fns/locale"
import type {
  NetworkMonitorData,
  NetworkMonitorPeriod,
  NetworkMonitorDataPoint,
  NetworkInsight,
  NetworkQualityEvent,
  NetworkDevice,
  NetworkConnection,
  NetworkTopology,
  NetworkTrafficDataPoint,
  NetworkTrafficData,
  DiagnosticTestResult,
  DiagnosticTestType,
  NetworkSecurityEvent,
  NetworkConfigBackup,
  NetworkReport,
  NetworkReportType,
} from "@/types/network-monitor"
import { getTestHistory } from "@/lib/speed-test"

// 计算网络质量评分
export function calculateQualityScore(dataPoint: Partial<NetworkMonitorDataPoint>): number {
  let score = 0

  // 下载速度评分 (最高40分)
  if (dataPoint.download !== undefined) {
    if (dataPoint.download >= 100) score += 40
    else if (dataPoint.download >= 50) score += 35
    else if (dataPoint.download >= 25) score += 30
    else if (dataPoint.download >= 10) score += 25
    else if (dataPoint.download >= 5) score += 20
    else score += 10
  }

  // 上传速度评分 (最高20分)
  if (dataPoint.upload !== undefined) {
    if (dataPoint.upload >= 50) score += 20
    else if (dataPoint.upload >= 20) score += 18
    else if (dataPoint.upload >= 10) score += 15
    else if (dataPoint.upload >= 5) score += 12
    else score += 8
  }

  // 延迟评分 (最高20分)
  if (dataPoint.ping !== undefined) {
    if (dataPoint.ping <= 10) score += 20
    else if (dataPoint.ping <= 20) score += 18
    else if (dataPoint.ping <= 50) score += 15
    else if (dataPoint.ping <= 100) score += 10
    else score += 5
  }

  // 抖动评分 (最高10分)
  if (dataPoint.jitter !== undefined) {
    if (dataPoint.jitter <= 5) score += 10
    else if (dataPoint.jitter <= 10) score += 8
    else if (dataPoint.jitter <= 20) score += 6
    else if (dataPoint.jitter <= 50) score += 4
    else score += 2
  }

  // 丢包率评分 (最高10分)
  if (dataPoint.packetLoss !== undefined) {
    if (dataPoint.packetLoss === 0) score += 10
    else if (dataPoint.packetLoss <= 1) score += 8
    else if (dataPoint.packetLoss <= 2) score += 6
    else if (dataPoint.packetLoss <= 5) score += 4
    else score += 0
  }

  return score
}

// 计算稳定性百分比
function calculateStability(values: number[]): number {
  if (values.length <= 1) return 100

  const avg = values.reduce((sum, val) => sum + val, 0) / values.length
  const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length
  const stdDev = Math.sqrt(variance)

  // 变异系数 (CV) = 标准差 / 平均值
  const cv = stdDev / avg

  // 将CV转换为稳定性百分比 (CV越小，稳定性越高)
  // 使用一个合理的映射函数，CV=0时稳定性为100%，CV越大稳定性越低
  const stability = Math.max(0, Math.min(100, 100 * Math.exp(-2 * cv)))

  return Math.round(stability)
}

// 生成网络洞察
function generateInsights(data: NetworkMonitorDataPoint[], stats: any): NetworkInsight[] {
  const insights: NetworkInsight[] = []

  // 如果没有足够的数据点，返回基本信息
  if (data.length < 2) {
    insights.push({
      type: "info",
      title: "数据收集中",
      description: "需要更多的测速数据来生成有意义的分析。建议定期进行网络测速。",
    })
    return insights
  }

  // 下载速度洞察
  if (stats.downloadStability < 50) {
    insights.push({
      type: "warning",
      title: "下载速度不稳定",
      description: `您的下载速度波动较大，稳定性仅为${stats.downloadStability}%。这可能导致视频流媒体和大文件下载体验不佳。`,
    })
  } else if (stats.avgDownload < 5) {
    insights.push({
      type: "warning",
      title: "下载速度较低",
      description: `平均下载速度为${stats.avgDownload.toFixed(2)}Mbps，低于流畅观看高清视频的推荐速度(5Mbps)。`,
    })
  } else if (stats.avgDownload > 50) {
    insights.push({
      type: "success",
      title: "下载速度优秀",
      description: `平均下载速度为${stats.avgDownload.toFixed(2)}Mbps，足以支持4K视频流和大文件快速下载。`,
    })
  }

  // 延迟洞察
  if (stats.pingStability < 60) {
    insights.push({
      type: "warning",
      title: "网络延迟不稳定",
      description: `您的网络延迟波动较大，稳定性为${stats.pingStability}%。这可能导致在线游戏和视频会议体验不佳。`,
    })
  } else if (stats.avgPing > 100) {
    insights.push({
      type: "warning",
      title: "网络延迟较高",
      description: `平均延迟为${stats.avgPing.toFixed(0)}ms，可能影响实时应用如在线游戏和视频会议的体验。`,
    })
  } else if (stats.avgPing < 20) {
    insights.push({
      type: "success",
      title: "网络延迟极佳",
      description: `平均延迟仅为${stats.avgPing.toFixed(0)}ms，非常适合在线游戏和实时应用。`,
    })
  }

  // 丢包率洞察
  if (stats.avgPacketLoss > 2) {
    insights.push({
      type: "error",
      title: "丢包率异常",
      description: `平均丢包率为${stats.avgPacketLoss.toFixed(2)}%，高于正常水平。这可能导致网络连接不稳定和数据传输错误。`,
    })
  } else if (stats.avgPacketLoss < 0.1) {
    insights.push({
      type: "success",
      title: "网络连接稳定",
      description: "丢包率极低，网络连接非常稳定。",
    })
  }

  // 整体质量洞察
  if (stats.avgQualityScore > 85) {
    insights.push({
      type: "success",
      title: "网络质量优秀",
      description: `综合评分为${stats.avgQualityScore.toFixed(0)}分，您的网络性能优秀，适合各种在线活动。`,
    })
  } else if (stats.avgQualityScore < 50) {
    insights.push({
      type: "error",
      title: "网络质量较差",
      description: `综合评分仅为${stats.avgQualityScore.toFixed(0)}分，建议联系您的网络服务提供商或检查网络设置。`,
    })
  }

  // 趋势分析
  if (data.length >= 5) {
    const recentData = data.slice(-5)
    const olderData = data.slice(-10, -5)

    if (recentData.length > 0 && olderData.length > 0) {
      const recentAvgDownload = recentData.reduce((sum, dp) => sum + dp.download, 0) / recentData.length
      const olderAvgDownload = olderData.reduce((sum, dp) => sum + dp.download, 0) / olderData.length

      const downloadChange = ((recentAvgDownload - olderAvgDownload) / olderAvgDownload) * 100

      if (downloadChange > 20) {
        insights.push({
          type: "success",
          title: "网络速度提升",
          description: `最近的测速结果显示，您的下载速度比之前提高了约${Math.abs(downloadChange).toFixed(0)}%。`,
        })
      } else if (downloadChange < -20) {
        insights.push({
          type: "warning",
          title: "网络速度下降",
          description: `最近的测速结果显示，您的下载速度比之前下降了约${Math.abs(downloadChange).toFixed(0)}%。`,
        })
      }
    }
  }

  return insights
}

// 检测网络质量事件
export function detectQualityEvents(data: NetworkMonitorDataPoint[]): NetworkQualityEvent[] {
  if (data.length < 3) return []

  const events: NetworkQualityEvent[] = []
  const threshold = {
    download: 0.3, // 30%的变化
    upload: 0.3,
    ping: 0.5, // 50%的变化
    packetLoss: 1, // 1%的绝对变化
  }

  for (let i = 2; i < data.length; i++) {
    const current = data[i]
    const prev1 = data[i - 1]
    const prev2 = data[i - 2]

    // 检测下载速度变化
    if (
      current.download < prev1.download * (1 - threshold.download) &&
      prev1.download < prev2.download * (1 - threshold.download)
    ) {
      // 连续两次显著下降
      events.push({
        timestamp: current.timestamp,
        type: "degradation",
        description: `下载速度持续下降至${current.download.toFixed(2)}Mbps`,
        severity: current.download < 5 ? "high" : "medium",
        metrics: { download: current.download },
      })
    } else if (
      current.download > prev1.download * (1 + threshold.download) &&
      prev1.download > prev2.download * (1 + threshold.download)
    ) {
      // 连续两次显著提升
      events.push({
        timestamp: current.timestamp,
        type: "improvement",
        description: `下载速度持续提升至${current.download.toFixed(2)}Mbps`,
        severity: "low",
        metrics: { download: current.download },
      })
    }

    // 检测延迟变化
    if (current.ping > prev1.ping * (1 + threshold.ping) && prev1.ping > prev2.ping * (1 + threshold.ping)) {
      // 连续两次延迟显著增加
      events.push({
        timestamp: current.timestamp,
        type: "degradation",
        description: `网络延迟持续增加至${current.ping.toFixed(0)}ms`,
        severity: current.ping > 100 ? "high" : "medium",
        metrics: { ping: current.ping },
      })
    }

    // 检测丢包率变化
    if (current.packetLoss > threshold.packetLoss && prev1.packetLoss <= threshold.packetLoss) {
      // 丢包率从正常变为异常
      events.push({
        timestamp: current.timestamp,
        type: "degradation",
        description: `丢包率增加至${current.packetLoss.toFixed(2)}%`,
        severity: current.packetLoss > 5 ? "high" : "medium",
        metrics: { packetLoss: current.packetLoss },
      })
    } else if (current.packetLoss <= threshold.packetLoss && prev1.packetLoss > threshold.packetLoss) {
      // 丢包率从异常恢复正常
      events.push({
        timestamp: current.timestamp,
        type: "recovery",
        description: `丢包率恢复正常，当前为${current.packetLoss.toFixed(2)}%`,
        severity: "low",
        metrics: { packetLoss: current.packetLoss },
      })
    }

    // 检测网络中断
    if (current.download < 0.5 && current.upload < 0.5 && current.packetLoss > 10) {
      events.push({
        timestamp: current.timestamp,
        type: "outage",
        description: "检测到可能的网络中断",
        severity: "high",
        metrics: {
          download: current.download,
          upload: current.upload,
          packetLoss: current.packetLoss,
        },
      })
    }
  }

  // 按时间排序
  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

// 获取指定时间段内的测速数据
export async function getNetworkMonitorData(
  period: NetworkMonitorPeriod = "7d",
  customRange?: { from: Date; to: Date },
): Promise<NetworkMonitorData> {
  // 从本地存储获取测速历史
  const testHistory = getTestHistory()

  // 确定时间范围
  const now = new Date()
  let fromDate: Date

  if (period === "custom" && customRange) {
    fromDate = customRange.from
  } else {
    switch (period) {
      case "24h":
        fromDate = subHours(now, 24)
        break
      case "7d":
        fromDate = subDays(now, 7)
        break
      case "30d":
        fromDate = subDays(now, 30)
        break
      case "90d":
        fromDate = subDays(now, 90)
        break
      default:
        fromDate = subDays(now, 7)
    }
  }

  const toDate = period === "custom" && customRange ? customRange.to : now

  // 过滤指定时间范围内的数据
  const filteredData = testHistory.filter((test) => {
    const testDate = new Date(test.timestamp)
    return isAfter(testDate, fromDate) && isBefore(testDate, toDate)
  })

  // 转换为监控数据点
  const dataPoints: NetworkMonitorDataPoint[] = filteredData.map((test) => ({
    timestamp: new Date(test.timestamp),
    download: test.download,
    upload: test.upload,
    ping: test.ping,
    jitter: test.jitter,
    packetLoss: test.packetLoss,
    qualityScore: calculateQualityScore(test),
  }))

  // 按时间排序
  dataPoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

  // 计算统计数据
  const downloadValues = dataPoints.map((dp) => dp.download)
  const uploadValues = dataPoints.map((dp) => dp.upload)
  const pingValues = dataPoints.map((dp) => dp.ping)
  const jitterValues = dataPoints.map((dp) => dp.jitter)
  const packetLossValues = dataPoints.map((dp) => dp.packetLoss)
  const qualityScoreValues = dataPoints.map((dp) => dp.qualityScore)

  const stats = {
    avgDownload: downloadValues.length ? downloadValues.reduce((sum, val) => sum + val, 0) / downloadValues.length : 0,
    avgUpload: uploadValues.length ? uploadValues.reduce((sum, val) => sum + val, 0) / uploadValues.length : 0,
    avgPing: pingValues.length ? pingValues.reduce((sum, val) => sum + val, 0) / pingValues.length : 0,
    avgJitter: jitterValues.length ? jitterValues.reduce((sum, val) => sum + val, 0) / jitterValues.length : 0,
    avgPacketLoss: packetLossValues.length
      ? packetLossValues.reduce((sum, val) => sum + val, 0) / packetLossValues.length
      : 0,
    avgQualityScore: qualityScoreValues.length
      ? qualityScoreValues.reduce((sum, val) => sum + val, 0) / qualityScoreValues.length
      : 0,
    maxDownload: downloadValues.length ? Math.max(...downloadValues) : 0,
    minDownload: downloadValues.length ? Math.min(...downloadValues) : 0,
    maxUpload: uploadValues.length ? Math.max(...uploadValues) : 0,
    minUpload: uploadValues.length ? Math.min(...uploadValues) : 0,
    maxPing: pingValues.length ? Math.max(...pingValues) : 0,
    minPing: pingValues.length ? Math.min(...pingValues) : 0,
    downloadStability: calculateStability(downloadValues),
    uploadStability: calculateStability(uploadValues),
    pingStability: calculateStability(pingValues),
    testCount: dataPoints.length,
    timeRange: {
      from: fromDate,
      to: toDate,
    },
  }

  // 生成洞察
  const insights = generateInsights(dataPoints, stats)

  // 返回监控数据
  return {
    dataPoints,
    stats,
    insights,
    period,
    customRange: period === "custom" ? customRange : undefined,
  }
}

// 导出监控数据
export async function exportMonitorData(data: NetworkMonitorData, format: "csv" | "json"): Promise<void> {
  try {
    let content: string
    let filename: string
    let type: string

    const dateStr = format(new Date(), "yyyyMMdd", { locale: zhCN })

    if (format === "csv") {
      // 创建CSV内容
      const headers = [
        "日期",
        "时间",
        "下载速度(Mbps)",
        "上传速度(Mbps)",
        "延迟(ms)",
        "抖动(ms)",
        "丢包率(%)",
        "质量评分",
      ]

      const rows = data.dataPoints.map((point) => {
        const date = new Date(point.timestamp)
        return [
          date.toLocaleDateString("zh-CN"),
          date.toLocaleTimeString("zh-CN"),
          point.download.toFixed(2),
          point.upload.toFixed(2),
          point.ping.toFixed(0),
          point.jitter.toFixed(0),
          point.packetLoss.toFixed(2),
          point.qualityScore.toFixed(0),
        ]
      })

      content = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
      filename = `网络监控数据_${dateStr}.csv`
      type = "text/csv"
    } else {
      // 创建JSON内容
      content = JSON.stringify(data, null, 2)
      filename = `网络监控数据_${dateStr}.json`
      type = "application/json"
    }

    // 创建下载链接
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    // 清理
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("导出监控数据失败:", error)
    throw error
  }
}

// 设置自动测速任务
export function scheduleSpeedTest(interval: number, callback: () => void): () => void {
  const timerId = setInterval(callback, interval)

  // 返回清除定时器的函数
  return () => clearInterval(timerId)
}

// 模拟网络设备发现
export function discoverNetworkDevices(): Promise<NetworkDevice[]> {
  return new Promise((resolve) => {
    // 模拟网络设备发现延迟
    setTimeout(() => {
      const devices: NetworkDevice[] = [
        {
          id: "router-main",
          name: "主路由器",
          ipAddress: "192.168.1.1",
          macAddress: "AA:BB:CC:DD:EE:FF",
          type: "router",
          manufacturer: "华为",
          model: "AX3 Pro",
          location: "客厅",
          isOnline: true,
          lastSeen: new Date(),
          bandwidth: 1000,
          connectionType: "wired",
        },
        {
          id: "ap-bedroom",
          name: "卧室AP",
          ipAddress: "192.168.1.2",
          macAddress: "AA:BB:CC:DD:EE:01",
          type: "accessPoint",
          manufacturer: "TP-Link",
          model: "AX1800",
          location: "主卧",
          isOnline: true,
          lastSeen: new Date(),
          signalStrength: -45,
          bandwidth: 1000,
          connectionType: "wired",
        },
        {
          id: "pc-work",
          name: "工作电脑",
          ipAddress: "192.168.1.100",
          macAddress: "AA:BB:CC:DD:EE:02",
          type: "computer",
          manufacturer: "联想",
          model: "ThinkPad X1",
          location: "书房",
          isOnline: true,
          lastSeen: new Date(),
          signalStrength: -55,
          bandwidth: 1000,
          connectionType: "wireless_5GHz",
        },
        {
          id: "phone-xiaomi",
          name: "小米手机",
          ipAddress: "192.168.1.101",
          macAddress: "AA:BB:CC:DD:EE:03",
          type: "mobile",
          manufacturer: "小米",
          model: "13 Pro",
          isOnline: true,
          lastSeen: new Date(),
          signalStrength: -60,
          connectionType: "wireless_5GHz",
        },
        {
          id: "tablet-ipad",
          name: "iPad Pro",
          ipAddress: "192.168.1.102",
          macAddress: "AA:BB:CC:DD:EE:04",
          type: "mobile",
          manufacturer: "Apple",
          model: "iPad Pro 12.9",
          location: "客厅",
          isOnline: true,
          lastSeen: new Date(),
          signalStrength: -50,
          connectionType: "wireless_5GHz",
        },
        {
          id: "tv-smart",
          name: "智能电视",
          ipAddress: "192.168.1.103",
          macAddress: "AA:BB:CC:DD:EE:05",
          type: "iot",
          manufacturer: "小米",
          model: "电视4A",
          location: "客厅",
          isOnline: true,
          lastSeen: new Date(),
          signalStrength: -65,
          connectionType: "wireless_2.4GHz",
        },
        {
          id: "printer-hp",
          name: "HP打印机",
          ipAddress: "192.168.1.104",
          macAddress: "AA:BB:CC:DD:EE:06",
          type: "iot",
          manufacturer: "HP",
          model: "LaserJet Pro",
          location: "书房",
          isOnline: false,
          lastSeen: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
          connectionType: "wireless_2.4GHz",
        },
      ]

      resolve(devices)
    }, 1500)
  })
}

// 生成网络拓扑图
export function generateNetworkTopology(devices: NetworkDevice[]): NetworkTopology {
  const connections: NetworkConnection[] = []

  // 找到路由器
  const router = devices.find((d) => d.type === "router")

  if (router) {
    // 所有在线设备都连接到路由器
    devices.forEach((device) => {
      if (device.id !== router.id && device.isOnline) {
        // 如果是AP，使用有线连接
        if (device.type === "accessPoint") {
          connections.push({
            source: router.id,
            target: device.id,
            type: "wired",
            strength: 100,
            bandwidth: device.bandwidth,
          })
        } else if (device.connectionType === "wired") {
          // 有线设备直接连接到路由器
          connections.push({
            source: router.id,
            target: device.id,
            type: "wired",
            strength: 100,
            bandwidth: device.bandwidth,
          })
        }
      }
    })

    // 找到所有AP
    const accessPoints = devices.filter((d) => d.type === "accessPoint" && d.isOnline)

    // 无线设备连接到最近的AP或路由器
    devices.forEach((device) => {
      if (
        device.isOnline &&
        device.type !== "router" &&
        device.type !== "accessPoint" &&
        device.connectionType &&
        device.connectionType.startsWith("wireless")
      ) {
        // 找到信号最强的AP或使用路由器
        let bestConnection = {
          source: router.id,
          strength: device.signalStrength || -80,
        }

        accessPoints.forEach((ap) => {
          // 模拟基于位置的信号强度计算
          let signalStrength = device.signalStrength || -70
          if (ap.location && device.location && ap.location === device.location) {
            signalStrength += 20 // 同一房间信号更强
          }

          if (signalStrength > bestConnection.strength) {
            bestConnection = {
              source: ap.id,
              strength: signalStrength,
            }
          }
        })

        connections.push({
          source: bestConnection.source,
          target: device.id,
          type: "wireless",
          strength: Math.max(0, Math.min(100, ((bestConnection.strength + 100) / 40) * 100)), // 转换dBm到百分比
          bandwidth: device.bandwidth,
        })
      }
    })
  }

  return {
    devices,
    connections,
    lastUpdated: new Date(),
  }
}

// 模拟网络流量数据
export function generateNetworkTrafficData(period: NetworkMonitorPeriod): NetworkTrafficData {
  const now = new Date()
  let fromDate: Date
  const dataPoints: NetworkTrafficDataPoint[] = []

  // 确定时间范围
  switch (period) {
    case "24h":
      fromDate = subHours(now, 24)
      // 每小时一个数据点
      for (let i = 0; i <= 24; i++) {
        const timestamp = subHours(now, 24 - i)
        // 模拟流量数据，工作时间流量更高
        const hour = timestamp.getHours()
        const isWorkHour = hour >= 9 && hour <= 18
        const dayFactor = timestamp.getDay() === 0 || timestamp.getDay() === 6 ? 0.7 : 1 // 周末流量略低

        const baseFactor = isWorkHour ? 1 : 0.4
        const randomFactor = 0.5 + Math.random()

        const inbound = Math.round(50 * 1024 * 1024 * baseFactor * randomFactor * dayFactor) // 基础50MB
        const outbound = Math.round(20 * 1024 * 1024 * baseFactor * randomFactor * dayFactor) // 基础20MB

        dataPoints.push({
          timestamp,
          inbound,
          outbound,
        })
      }
      break
    case "7d":
      fromDate = subDays(now, 7)
      // 每6小时一个数据点
      for (let i = 0; i <= 28; i++) {
        const timestamp = subHours(now, 168 - i * 6)
        // 模拟流量数据
        const hour = timestamp.getHours()
        const isWorkHour = hour >= 9 && hour <= 18
        const dayFactor = timestamp.getDay() === 0 || timestamp.getDay() === 6 ? 0.7 : 1

        const baseFactor = isWorkHour ? 1 : 0.4
        const randomFactor = 0.5 + Math.random()

        const inbound = Math.round(300 * 1024 * 1024 * baseFactor * randomFactor * dayFactor)
        const outbound = Math.round(120 * 1024 * 1024 * baseFactor * randomFactor * dayFactor)

        dataPoints.push({
          timestamp,
          inbound,
          outbound,
        })
      }
      break
    case "30d":
      fromDate = subDays(now, 30)
      // 每天一个数据点
      for (let i = 0; i <= 30; i++) {
        const timestamp = subDays(now, 30 - i)
        // 模拟流量数据
        const dayFactor = timestamp.getDay() === 0 || timestamp.getDay() === 6 ? 0.7 : 1

        const randomFactor = 0.7 + Math.random() * 0.6

        const inbound = Math.round(1.5 * 1024 * 1024 * 1024 * randomFactor * dayFactor) // 基础1.5GB
        const outbound = Math.round(0.6 * 1024 * 1024 * 1024 * randomFactor * dayFactor) // 基础600MB

        dataPoints.push({
          timestamp,
          inbound,
          outbound,
        })
      }
      break
    case "90d":
      fromDate = subDays(now, 90)
      // 每3天一个数据点
      for (let i = 0; i <= 30; i++) {
        const timestamp = subDays(now, 90 - i * 3)
        // 模拟流量数据
        const randomFactor = 0.7 + Math.random() * 0.6

        const inbound = Math.round(4.5 * 1024 * 1024 * 1024 * randomFactor) // 基础4.5GB
        const outbound = Math.round(1.8 * 1024 * 1024 * 1024 * randomFactor) // 基础1.8GB

        dataPoints.push({
          timestamp,
          inbound,
          outbound,
        })
      }
      break
    default:
      fromDate = subDays(now, 7)
      // 默认使用7天数据
      for (let i = 0; i <= 7; i++) {
        const timestamp = subDays(now, 7 - i)
        const randomFactor = 0.7 + Math.random() * 0.6

        const inbound = Math.round(1 * 1024 * 1024 * 1024 * randomFactor)
        const outbound = Math.round(0.4 * 1024 * 1024 * 1024 * randomFactor)

        dataPoints.push({
          timestamp,
          inbound,
          outbound,
        })
      }
  }

  // 计算总流量和平均流量
  const totalInbound = dataPoints.reduce((sum, dp) => sum + dp.inbound, 0)
  const totalOutbound = dataPoints.reduce((sum, dp) => sum + dp.outbound, 0)
  const avgInbound = totalInbound / dataPoints.length
  const avgOutbound = totalOutbound / dataPoints.length
  const peakInbound = Math.max(...dataPoints.map((dp) => dp.inbound))
  const peakOutbound = Math.max(...dataPoints.map((dp) => dp.outbound))

  return {
    dataPoints,
    period,
    totalInbound,
    totalOutbound,
    peakInbound,
    peakOutbound,
    avgInbound,
    avgOutbound,
  }
}

// 执行网络诊断测试
export async function runDiagnosticTest(type: DiagnosticTestType, target: string): Promise<DiagnosticTestResult> {
  const testId = `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  const startTime = new Date()

  // 创建初始测试结果
  const initialResult: DiagnosticTestResult = {
    id: testId,
    type,
    target,
    status: "running",
    startTime,
    success: false,
    data: null,
  }

  try {
    let testData: any = null
    let success = false

    // 根据测试类型执行不同的测试
    switch (type) {
      case "ping":
        // 模拟ping测试
        await new Promise((resolve) => setTimeout(resolve, 1500))
        const pingCount = 4
        const pingResults = []
        let packetLoss = 0

        for (let i = 0; i < pingCount; i++) {
          // 模拟一些丢包
          if (Math.random() > 0.9) {
            pingResults.push(null) // 丢包
            packetLoss++
          } else {
            // 模拟ping时间，30-100ms之间
            const pingTime = Math.round(30 + Math.random() * 70)
            pingResults.push(pingTime)
          }
          // 每次ping之间有延迟
          await new Promise((resolve) => setTimeout(resolve, 300))
        }

        const successfulPings = pingResults.filter((p) => p !== null) as number[]
        const avgPing = successfulPings.length
          ? successfulPings.reduce((sum, p) => sum + p, 0) / successfulPings.length
          : 0

        testData = {
          pingResults,
          avgPing,
          minPing: successfulPings.length ? Math.min(...successfulPings) : 0,
          maxPing: successfulPings.length ? Math.max(...successfulPings) : 0,
          packetLoss: (packetLoss / pingCount) * 100,
          sent: pingCount,
          received: pingCount - packetLoss,
        }
        success = packetLoss < pingCount // 只要有一个成功就算成功
        break

      case "traceroute":
        // 模拟traceroute测试
        await new Promise((resolve) => setTimeout(resolve, 3000))
        const hopCount = 5 + Math.floor(Math.random() * 5) // 5-9跳
        const hops = []

        for (let i = 1; i <= hopCount; i++) {
          const hopIp = `192.168.${i}.1`
          const hopName = i === 1 ? "本地路由器" : i === hopCount ? target : `hop-${i}.example.com`
          const hopTime = i === hopCount ? 30 + Math.random() * 70 : 5 + i * 5 + Math.random() * 20

          hops.push({
            hop: i,
            ip: hopIp,
            name: hopName,
            time: Math.round(hopTime),
          })
        }

        testData = {
          hops,
          totalHops: hopCount,
          reachedDestination: true,
        }
        success = true
        break

      case "dns":
        // 模拟DNS解析测试
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const dnsServers = ["114.114.114.114", "8.8.8.8", "223.5.5.5"]
        const dnsResults = []

        for (const server of dnsServers) {
          const resolveTime = 20 + Math.random() * 100
          dnsResults.push({
            server,
            resolvedIp: "93.184.216.34", // example.com的IP
            time: Math.round(resolveTime),
            success: Math.random() > 0.1, // 90%成功率
          })
          await new Promise((resolve) => setTimeout(resolve, 300))
        }

        testData = {
          domain: target,
          dnsResults,
          successRate: dnsResults.filter((r) => r.success).length / dnsResults.length,
        }
        success = dnsResults.some((r) => r.success)
        break

      case "portScan":
        // 模拟端口扫描
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const commonPorts = [21, 22, 80, 443, 3389, 8080]
        const portResults = []

        for (const port of commonPorts) {
          const isOpen = Math.random() > 0.7 // 30%概率端口开放
          portResults.push({
            port,
            status: isOpen ? "open" : "closed",
            service: isOpen
              ? port === 21
                ? "FTP"
                : port === 22
                  ? "SSH"
                  : port === 80
                    ? "HTTP"
                    : port === 443
                      ? "HTTPS"
                      : port === 3389
                        ? "RDP"
                        : "Unknown"
              : null,
          })
          await new Promise((resolve) => setTimeout(resolve, 200))
        }

        testData = {
          host: target,
          scannedPorts: commonPorts,
          openPorts: portResults.filter((p) => p.status === "open").map((p) => p.port),
          portResults,
        }
        success = true // 端口扫描总是成功的，即使所有端口都关闭
        break

      case "bandwidthTest":
        // 模拟带宽测试
        await new Promise((resolve) => setTimeout(resolve, 5000))
        const download = 50 + Math.random() * 100 // 50-150Mbps
        const upload = 10 + Math.random() * 40 // 10-50Mbps
        const latency = 20 + Math.random() * 80 // 20-100ms

        testData = {
          download,
          upload,
          latency,
          jitter: Math.random() * 10,
          server: {
            name: "测速服务器",
            location: "上海",
            distance: "10km",
          },
        }
        success = true
        break

      case "packetLoss":
        // 模拟丢包测试
        await new Promise((resolve) => setTimeout(resolve, 4000))
        const packetsSent = 100
        const packetsLost = Math.floor(Math.random() * 10) // 0-9丢包
        const packetLossRate = (packetsLost / packetsSent) * 100

        testData = {
          packetsSent,
          packetsReceived: packetsSent - packetsLost,
          packetsLost,
          packetLossRate,
          intervals: [
            { interval: "0-10s", loss: Math.random() * 5 },
            { interval: "10-20s", loss: Math.random() * 5 },
            { interval: "20-30s", loss: Math.random() * 5 },
          ],
        }
        success = packetLossRate < 5 // 丢包率小于5%算成功
        break
    }

    // 完成测试
    const endTime = new Date()
    const duration = endTime.getTime() - startTime.getTime()

    return {
      ...initialResult,
      status: "completed",
      endTime,
      duration,
      success,
      data: testData,
    }
  } catch (error) {
    // 测试失败
    const endTime = new Date()
    const duration = endTime.getTime() - startTime.getTime()

    return {
      ...initialResult,
      status: "failed",
      endTime,
      duration,
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    }
  }
}

// 模拟网络安全事件
export function generateSecurityEvents(count = 10): NetworkSecurityEvent[] {
  const events: NetworkSecurityEvent[] = []
  const now = new Date()

  const eventTypes: NetworkSecurityEvent["type"][] = [
    "intrusion",
    "malware",
    "phishing",
    "vulnerabilityScan",
    "unauthorized",
    "other",
  ]

  const descriptions = {
    intrusion: ["检测到可疑SSH登录尝试", "检测到暴力破解攻击", "检测到可疑端口扫描", "检测到异常管理界面访问"],
    malware: ["检测到可疑DNS请求", "检测到恶意软件通信", "检测到可疑文件下载", "检测到勒索软件特征"],
    phishing: ["检测到钓鱼网站访问", "检测到可疑邮件链接点击", "检测到虚假登录页面", "检测到身份信息提交"],
    vulnerabilityScan: ["检测到系统漏洞扫描", "检测到弱密码使用", "检测到过时固件版本", "检测到开放的危险端口"],
    unauthorized: ["检测到未授权设备连接", "检测到未知MAC地址", "检测到异常时间的网络活动", "检测到异常流量模式"],
    other: ["检测到异常带宽使用", "检测到异常地理位置访问", "检测到不常见协议使用", "检测到可疑加密流量"],
  }

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30) // 0-29天前
    const hoursAgo = Math.floor(Math.random() * 24) // 0-23小时前
    const timestamp = subDays(subHours(now, hoursAgo), daysAgo)

    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const severity: NetworkSecurityEvent["severity"] =
      Math.random() < 0.1 ? "critical" : Math.random() < 0.3 ? "high" : Math.random() < 0.7 ? "medium" : "low"

    const typeDescriptions = descriptions[type] || descriptions.other
    const description = typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)]

    // 80%的事件已解决
    const resolved = Math.random() < 0.8
    let resolvedAt: Date | undefined = undefined
    if (resolved) {
      // 解决时间在事件发生后的1小时到2天之间
      const resolveHours = 1 + Math.floor(Math.random() * 47)
      resolvedAt = new Date(timestamp.getTime() + resolveHours * 60 * 60 * 1000)
    }

    events.push({
      id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp,
      type,
      severity,
      source: Math.random() < 0.7 ? `192.168.1.${Math.floor(Math.random() * 254) + 1}` : undefined,
      target: Math.random() < 0.7 ? `192.168.1.${Math.floor(Math.random() * 254) + 1}` : undefined,
      description,
      resolved,
      resolvedAt,
      actions: resolved ? ["已阻止", "已记录", "已通知管理员"] : ["正在监控", "已记录", "已提高警报级别"],
    })
  }

  // 按时间排序，最新的在前
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// 模拟网络配置备份
export function generateConfigBackups(count = 5): NetworkConfigBackup[] {
  const backups: NetworkConfigBackup[] = []
  const now = new Date()

  const devices = [
    { id: "router-main", name: "主路由器", type: "router" as const },
    { id: "switch-office", name: "办公室交换机", type: "switch" as const },
    { id: "firewall-main", name: "主防火墙", type: "firewall" as const },
  ]

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 60) // 0-59天前
    const timestamp = subDays(now, daysAgo)

    const device = devices[Math.floor(Math.random() * devices.length)]
    const size = 10 * 1024 + Math.floor(Math.random() * 90 * 1024) // 10KB-100KB

    backups.push({
      id: `backup-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      deviceId: device.id,
      deviceName: device.name,
      timestamp,
      configType: device.type,
      description: `${device.name}的自动备份配置`,
      size,
      content: `# ${device.name}配置备份\n# 创建时间: ${timestamp.toLocaleString("zh-CN")}\n\n# 这里是配置内容\n...`,
    })
  }

  // 按时间排序，最新的在前
  return backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// 生成网络报告
export async function generateNetworkReport(
  title: string,
  type: NetworkReportType,
  period: NetworkMonitorPeriod,
  customRange?: { from: Date; to: Date },
): Promise<NetworkReport> {
  const reportId = `report-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  const now = new Date()

  // 创建初始报告
  const report: NetworkReport = {
    id: reportId,
    title,
    type,
    createdAt: now,
    period,
    customRange,
    sections: [],
    format: "html",
    status: "generating",
  }

  try {
    // 模拟报告生成延迟
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 获取监控数据
    const monitorData = await getNetworkMonitorData(period, customRange)

    // 根据报告类型添加不同的部分
    switch (type) {
      case "performance":
        report.sections = [
          {
            id: `section-${reportId}-1`,
            title: "网络性能概览",
            type: "text",
            content: `
# 网络性能报告
生成时间: ${now.toLocaleString("zh-CN")}
报告周期: ${
              period === "24h"
                ? "最近24小时"
                : period === "7d"
                  ? "最近7天"
                  : period === "30d"
                    ? "最近30天"
                    : period === "90d"
                      ? "最近90天"
                      : "自定义时间范围"
            }

## 性能摘要
- 平均下载速度: ${monitorData.stats.avgDownload.toFixed(2)} Mbps
- 平均上传速度: ${monitorData.stats.avgUpload.toFixed(2)} Mbps
- 平均延迟: ${monitorData.stats.avgPing.toFixed(0)} ms
- 平均抖动: ${monitorData.stats.avgJitter.toFixed(0)} ms
- 平均丢包率: ${monitorData.stats.avgPacketLoss.toFixed(2)}%
- 网络质量评分: ${monitorData.stats.avgQualityScore.toFixed(0)}/100

## 稳定性分析
- 下载速度稳定性: ${monitorData.stats.downloadStability}%
- 上传速度稳定性: ${monitorData.stats.uploadStability}%
- 延迟稳定性: ${monitorData.stats.pingStability}%
            `,
          },
          {
            id: `section-${reportId}-2`,
            title: "性能图表",
            type: "chart",
            content: {
              chartType: "performance",
              data: monitorData,
            },
          },
          {
            id: `section-${reportId}-3`,
            title: "网络洞察",
            type: "insights",
            content: monitorData.insights,
          },
          {
            id: `section-${reportId}-4`,
            title: "质量事件",
            type: "events",
            content: detectQualityEvents(monitorData.dataPoints),
          },
        ]
        break

      case "security":
        const securityEvents = generateSecurityEvents(15)
        report.sections = [
          {
            id: `section-${reportId}-1`,
            title: "网络安全概览",
            type: "text",
            content: `
# 网络安全报告
生成时间: ${now.toLocaleString("zh-CN")}
报告周期: ${
              period === "24h"
                ? "最近24小时"
                : period === "7d"
                  ? "最近7天"
                  : period === "30d"
                    ? "最近30天"
                    : period === "90d"
                      ? "最近90天"
                      : "自定义时间范围"
            }

## 安全事件摘要
- 总事件数: ${securityEvents.length}
- 严重事件: ${securityEvents.filter((e) => e.severity === "critical").length}
- 高风险事件: ${securityEvents.filter((e) => e.severity === "high").length}
- 中风险事件: ${securityEvents.filter((e) => e.severity === "medium").length}
- 低风险事件: ${securityEvents.filter((e) => e.severity === "low").length}
- 已解决事件: ${securityEvents.filter((e) => e.resolved).length}
- 未解决事件: ${securityEvents.filter((e) => !e.resolved).length}

## 安全建议
1. 定期更新路由器和网络设备固件
2. 使用强密码并定期更换
3. 启用网络设备的防火墙功能
4. 分离访客网络和主网络
5. 定期检查连接设备列表，移除未知设备
            `,
          },
          {
            id: `section-${reportId}-2`,
            title: "安全事件列表",
            type: "table",
            content: {
              headers: ["时间", "类型", "严重程度", "描述", "状态"],
              rows: securityEvents.map((event) => [
                event.timestamp.toLocaleString("zh-CN"),
                event.type === "intrusion"
                  ? "入侵尝试"
                  : event.type === "malware"
                    ? "恶意软件"
                    : event.type === "phishing"
                      ? "钓鱼攻击"
                      : event.type === "vulnerabilityScan"
                        ? "漏洞扫描"
                        : event.type === "unauthorized"
                          ? "未授权访问"
                          : "其他",
                event.severity === "critical"
                  ? "严重"
                  : event.severity === "high"
                    ? "高"
                    : event.severity === "medium"
                      ? "中"
                      : "低",
                event.description,
                event.resolved ? "已解决" : "未解决",
              ]),
            },
          },
          {
            id: `section-${reportId}-3`,
            title: "安全事件趋势",
            type: "chart",
            content: {
              chartType: "securityEvents",
              data: securityEvents,
            },
          },
        ]
        break

      case "devices":
        const devices = await discoverNetworkDevices()
        const topology = generateNetworkTopology(devices)
        report.sections = [
          {
            id: `section-${reportId}-1`,
            title: "网络设备概览",
            type: "text",
            content: `
# 网络设备报告
生成时间: ${now.toLocaleString("zh-CN")}

## 设备摘要
- 总设备数: ${devices.length}
- 在线设备: ${devices.filter((d) => d.isOnline).length}
- 离线设备: ${devices.filter((d) => !d.isOnline).length}
- 路由器: ${devices.filter((d) => d.type === "router").length}
- 接入点: ${devices.filter((d) => d.type === "accessPoint").length}
- 计算机: ${devices.filter((d) => d.type === "computer").length}
- 移动设备: ${devices.filter((d) => d.type === "mobile").length}
- 物联网设备: ${devices.filter((d) => d.type === "iot").length}

## 连接状态
- 有线连接: ${devices.filter((d) => d.connectionType === "wired").length}
- 2.4GHz无线: ${devices.filter((d) => d.connectionType === "wireless_2.4GHz").length}
- 5GHz无线: ${devices.filter((d) => d.connectionType === "wireless_5GHz").length}
            `,
          },
          {
            id: `section-${reportId}-2`,
            title: "设备列表",
            type: "table",
            content: {
              headers: ["名称", "IP地址", "MAC地址", "类型", "状态", "连接方式", "最后在线时间"],
              rows: devices.map((device) => [
                device.name,
                device.ipAddress,
                device.macAddress,
                device.type === "router"
                  ? "路由器"
                  : device.type === "switch"
                    ? "交换机"
                    : device.type === "accessPoint"
                      ? "接入点"
                      : device.type === "computer"
                        ? "计算机"
                        : device.type === "mobile"
                          ? "移动设备"
                          : device.type === "iot"
                            ? "物联网设备"
                            : "其他",
                device.isOnline ? "在线" : "离线",
                device.connectionType === "wired"
                  ? "有线"
                  : device.connectionType === "wireless_2.4GHz"
                    ? "2.4GHz无线"
                    : device.connectionType === "wireless_5GHz"
                      ? "5GHz无线"
                      : device.connectionType === "wireless_6GHz"
                        ? "6GHz无线"
                        : "未知",
                device.lastSeen.toLocaleString("zh-CN"),
              ]),
            },
          },
          {
            id: `section-${reportId}-3`,
            title: "网络拓扑",
            type: "chart",
            content: {
              chartType: "topology",
              data: topology,
            },
          },
        ]
        break

      case "traffic":
        const trafficData = generateNetworkTrafficData(period)
        report.sections = [
          {
            id: `section-${reportId}-1`,
            title: "网络流量概览",
            type: "text",
            content: `
# 网络流量报告
生成时间: ${now.toLocaleString("zh-CN")}
报告周期: ${
              period === "24h"
                ? "最近24小时"
                : period === "7d"
                  ? "最近7天"
                  : period === "30d"
                    ? "最近30天"
                    : period === "90d"
                      ? "最近90天"
                      : "自定义时间范围"
            }

## 流量摘要
- 总入站流量: ${formatBytes(trafficData.totalInbound)}
- 总出站流量: ${formatBytes(trafficData.totalOutbound)}
- 平均入站流量: ${formatBytes(trafficData.avgInbound)}/数据点
- 平均出站流量: ${formatBytes(trafficData.avgOutbound)}/数据点
- 峰值入站流量: ${formatBytes(trafficData.peakInbound)}
- 峰值出站流量: ${formatBytes(trafficData.peakOutbound)}
            `,
          },
          {
            id: `section-${reportId}-2`,
            title: "流量趋势",
            type: "chart",
            content: {
              chartType: "traffic",
              data: trafficData,
            },
          },
          {
            id: `section-${reportId}-3`,
            title: "流量分析",
            type: "text",
            content: `
## 流量分析

### 使用模式
分析显示您的网络流量主要集中在工作时间(9:00-18:00)，这是正常的使用模式。周末流量相对工作日有所减少。

### 带宽利用率
根据您的网络连接速度，当前的带宽利用率处于合理范围内。在峰值时段，建议避免进行大文件下载或视频会议等高带宽活动，以确保网络流畅。

### 流量优化建议
1. 考虑设置QoS(服务质量)规则，优先处理重要应用的流量
2. 对大型文件传输进行调度，避开网络高峰期
3. 使用缓存服务器减少重复内容的下载
4. 监控异常流量模式，及时发现潜在问题
            `,
          },
        ]
        break

      case "custom":
        // 自定义报告包含多种内容
        const customDevices = await discoverNetworkDevices()
        const customTrafficData = generateNetworkTrafficData(period)
        report.sections = [
          {
            id: `section-${reportId}-1`,
            title: "网络状况综合报告",
            type: "text",
            content: `
# 网络状况综合报告
生成时间: ${now.toLocaleString("zh-CN")}
报告周期: ${
              period === "24h"
                ? "最近24小时"
                : period === "7d"
                  ? "最近7天"
                  : period === "30d"
                    ? "最近30天"
                    : period === "90d"
                      ? "最近90天"
                      : "自定义时间范围"
            }

## 综合评分: ${monitorData.stats.avgQualityScore.toFixed(0)}/100

## 性能摘要
- 平均下载速度: ${monitorData.stats.avgDownload.toFixed(2)} Mbps
- 平均上传速度: ${monitorData.stats.avgUpload.toFixed(2)} Mbps
- 平均延迟: ${monitorData.stats.avgPing.toFixed(0)} ms

## 设备摘要
- 总设备数: ${customDevices.length}
- 在线设备: ${customDevices.filter((d) => d.isOnline).length}
- 离线设备: ${customDevices.filter((d) => !d.isOnline).length}

## 流量摘要
- 总入站流量: ${formatBytes(customTrafficData.totalInbound)}
- 总出站流量: ${formatBytes(customTrafficData.totalOutbound)}
            `,
          },
          {
            id: `section-${reportId}-2`,
            title: "网络性能图表",
            type: "chart",
            content: {
              chartType: "performance",
              data: monitorData,
            },
          },
          {
            id: `section-${reportId}-3`,
            title: "网络洞察",
            type: "insights",
            content: monitorData.insights,
          },
          {
            id: `section-${reportId}-4`,
            title: "设备列表",
            type: "table",
            content: {
              headers: ["名称", "IP地址", "类型", "状态", "连接方式"],
              rows: customDevices.map((device) => [
                device.name,
                device.ipAddress,
                device.type === "router"
                  ? "路由器"
                  : device.type === "switch"
                    ? "交换机"
                    : device.type === "accessPoint"
                      ? "接入点"
                      : device.type === "computer"
                        ? "计算机"
                        : device.type === "mobile"
                          ? "移动设备"
                          : device.type === "iot"
                            ? "物联网设备"
                            : "其他",
                device.isOnline ? "在线" : "离线",
                device.connectionType === "wired"
                  ? "有线"
                  : device.connectionType === "wireless_2.4GHz"
                    ? "2.4GHz无线"
                    : device.connectionType === "wireless_5GHz"
                      ? "5GHz无线"
                      : device.connectionType === "wireless_6GHz"
                        ? "6GHz无线"
                        : "未知",
              ]),
            },
          },
          {
            id: `section-${reportId}-5`,
            title: "流量趋势",
            type: "chart",
            content: {
              chartType: "traffic",
              data: customTrafficData,
            },
          },
        ]
        break
    }

    // 更新报告状态
    report.status = "completed"
    report.url = `/reports/${reportId}.html`

    return report
  } catch (error) {
    // 报告生成失败
    report.status = "failed"
    return report
  }
}

// 格式化字节数为可读格式
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}
