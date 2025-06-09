export interface DeviceWithResults {
  id: string
  name: string
  type: string
  os: string
  browser: string
  location: string
  isActive: boolean
  lastSeen: Date
  createdAt: Date
  updatedAt: Date
  results: Result[]
}

export interface Result {
  id: string
  deviceId: string
  timestamp: Date
  download: number
  upload: number
  ping: number
  jitter: number
  packetLoss: number
  qualityScore: number
}

export const getDevicesWithResults = async (): Promise<DeviceWithResults[]> => {
  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockDevices: DeviceWithResults[] = [
      {
        id: "device_1",
        name: "MacBook Pro M4 Max",
        type: "laptop",
        os: "macOS",
        browser: "Chrome",
        location: "办公室",
        isActive: true,
        lastSeen: new Date(),
        createdAt: new Date(Date.now() - 7 * 86400000),
        updatedAt: new Date(),
        results: [
          {
            id: "result_1",
            deviceId: "device_1",
            timestamp: new Date(),
            download: 150.5,
            upload: 45.2,
            ping: 12,
            jitter: 1.5,
            packetLoss: 0,
            qualityScore: 95,
          },
        ],
      },
      {
        id: "device_2",
        name: "iMac M4",
        type: "desktop",
        os: "macOS",
        browser: "Safari",
        location: "工作室",
        isActive: true,
        lastSeen: new Date(),
        createdAt: new Date(Date.now() - 14 * 86400000),
        updatedAt: new Date(),
        results: [
          {
            id: "result_2",
            deviceId: "device_2",
            timestamp: new Date(),
            download: 98.2,
            upload: 38.7,
            ping: 15,
            jitter: 2.1,
            packetLoss: 0.1,
            qualityScore: 88,
          },
        ],
      },
    ]

    return mockDevices
  } catch (error) {
    console.error("获取设备数据失败:", error)
    return []
  }
}

export interface Insight {
  type: "info" | "warning" | "error"
  title: string
  description: string
  priority: "high" | "medium" | "low"
}

export const generateDeviceComparisonInsights = (devices: DeviceWithResults[]): Insight[] => {
  const insights: Insight[] = []

  if (devices.length < 2) {
    insights.push({
      type: "warning",
      title: "设备数量不足",
      description: "需要至少2台设备才能进行有效对比分析",
      priority: "medium",
    })
    return insights
  }

  // 分析下载速度差异
  const downloadSpeeds = devices.map((d) => d.results[0]?.download || 0)
  const maxDownload = Math.max(...downloadSpeeds)
  const minDownload = Math.min(...downloadSpeeds)
  const downloadDiff = ((maxDownload - minDownload) / minDownload) * 100

  if (downloadDiff > 50) {
    insights.push({
      type: "warning",
      title: "下载速度差异较大",
      description: `设备间下载速度差异达到 ${downloadDiff.toFixed(1)}%，建议检查网络配置`,
      priority: "high",
    })
  }

  // 分析延迟差异
  const pings = devices.map((d) => d.results[0]?.ping || 0)
  const maxPing = Math.max(...pings)
  const minPing = Math.min(...pings)

  if (maxPing - minPing > 20) {
    insights.push({
      type: "info",
      title: "延迟差异明显",
      description: `设备间延迟差异为 ${(maxPing - minPing).toFixed(1)}ms，可能影响实时应用体验`,
      priority: "medium",
    })
  }

  return insights
}

export const calculateDevicePerformanceMetrics = (device: DeviceWithResults) => {
  if (!device.results || device.results.length === 0) {
    return {
      avgDownload: 0,
      avgUpload: 0,
      avgPing: 0,
      avgJitter: 0,
      avgPacketLoss: 0,
      avgQualityScore: 0,
    }
  }

  const results = device.results
  const count = results.length

  return {
    avgDownload: results.reduce((sum, r) => sum + r.download, 0) / count,
    avgUpload: results.reduce((sum, r) => sum + r.upload, 0) / count,
    avgPing: results.reduce((sum, r) => sum + r.ping, 0) / count,
    avgJitter: results.reduce((sum, r) => sum + r.jitter, 0) / count,
    avgPacketLoss: results.reduce((sum, r) => sum + r.packetLoss, 0) / count,
    avgQualityScore: results.reduce((sum, r) => sum + r.qualityScore, 0) / count,
  }
}

export const getDevices = async (): Promise<DeviceWithResults[]> => {
  return getDevicesWithResults()
}

export const addDevice = async (
  device: Omit<DeviceWithResults, "id" | "createdAt" | "updatedAt" | "results">,
): Promise<DeviceWithResults> => {
  const newDevice: DeviceWithResults = {
    ...device,
    id: `device_${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    results: [],
  }

  // 在实际应用中，这应该调用API保存设备
  console.log("添加新设备:", newDevice)

  return newDevice
}
