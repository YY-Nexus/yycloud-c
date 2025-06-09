"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { type DeviceWithResults, generateDeviceComparisonInsights } from "@/lib/device-manager"
import { InfoIcon, AlertTriangle, CheckCircle, XCircle, Smartphone, Laptop, Tv, Server, Wifi } from "lucide-react"

interface DeviceNetworkInsightsProps {
  devices: DeviceWithResults[]
}

export function DeviceNetworkInsights({ devices }: DeviceNetworkInsightsProps) {
  // 生成设备比较洞察
  const insights = generateDeviceComparisonInsights(devices)

  // 获取设备图标
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "smartphone":
        return <Smartphone className="h-4 w-4" />
      case "laptop":
        return <Laptop className="h-4 w-4" />
      case "tv":
        return <Tv className="h-4 w-4" />
      case "server":
        return <Server className="h-4 w-4" />
      default:
        return <Wifi className="h-4 w-4" />
    }
  }

  // 获取洞察图标
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "info":
        return <InfoIcon className="h-5 w-5" />
      case "warning":
        return <AlertTriangle className="h-5 w-5" />
      case "success":
        return <CheckCircle className="h-5 w-5" />
      case "error":
        return <XCircle className="h-5 w-5" />
      default:
        return <InfoIcon className="h-5 w-5" />
    }
  }

  // 获取洞察颜色
  const getInsightColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-200"
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200"
      case "success":
        return "bg-green-50 text-green-800 border-green-200"
      case "error":
        return "bg-red-50 text-red-800 border-red-200"
      default:
        return "bg-gray-50 text-gray-800 border-gray-200"
    }
  }

  // 获取洞察图标颜色
  const getInsightIconColor = (type: string) => {
    switch (type) {
      case "info":
        return "text-blue-500"
      case "warning":
        return "text-yellow-500"
      case "success":
        return "text-green-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  // 获取设备名称
  const getDeviceName = (deviceId?: string) => {
    if (!deviceId) return null
    const device = devices.find((d) => d.id === deviceId)
    if (!device) return null

    return (
      <div className="flex items-center gap-1 font-medium">
        {getDeviceIcon(device.type)}
        <span>{device.name}</span>
      </div>
    )
  }

  // 获取优化建议
  const getOptimizationSuggestions = () => {
    const suggestions = []

    // 检查是否有Wi-Fi设备性能较差
    const wifiDevices = devices.filter((d) => d.connectionType === "wifi")
    const ethernetDevices = devices.filter((d) => d.connectionType === "ethernet")

    if (wifiDevices.length > 0 && ethernetDevices.length > 0) {
      const avgWifiDownload =
        wifiDevices.reduce((sum, d) => {
          const avg = d.results.reduce((s, r) => s + r.download, 0) / d.results.length
          return sum + avg
        }, 0) / wifiDevices.length

      const avgEthernetDownload =
        ethernetDevices.reduce((sum, d) => {
          const avg = d.results.reduce((s, r) => s + r.download, 0) / d.results.length
          return sum + avg
        }, 0) / ethernetDevices.length

      if (avgEthernetDownload > avgWifiDownload * 1.5) {
        suggestions.push({
          title: "考虑为重要设备使用有线连接",
          description: "有线连接通常提供更稳定、更快的网络性能，特别是对于需要高带宽的设备。",
        })
      }
    }

    // 检查是否有设备的丢包率异常高
    const highPacketLossDevices = devices.filter((d) => {
      const avgPacketLoss = d.results.reduce((sum, r) => sum + r.packetLoss, 0) / d.results.length
      return avgPacketLoss > 2
    })

    if (highPacketLossDevices.length > 0) {
      suggestions.push({
        title: "检查网络连接质量",
        description: "高丢包率可能表明网络连接质量问题。检查网络电缆、Wi-Fi信号强度或路由器位置。",
      })
    }

    // 检查是否有设备的延迟异常高
    const highPingDevices = devices.filter((d) => {
      const avgPing = d.results.reduce((sum, r) => sum + r.ping, 0) / d.results.length
      return avgPing > 100
    })

    if (highPingDevices.length > 0) {
      suggestions.push({
        title: "优化网络延迟",
        description:
          "高延迟会影响实时应用如视频会议和在线游戏。尝试减少网络拥塞，关闭不必要的下载，或考虑升级网络服务。",
      })
    }

    // 检查是否有设备的网络稳定性较差
    const unstableDevices = devices.filter((d) => {
      const downloadValues = d.results.map((r) => r.download)
      const avg = downloadValues.reduce((sum, val) => sum + val, 0) / downloadValues.length
      const variance = downloadValues.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / downloadValues.length
      const stdDev = Math.sqrt(variance)
      const cv = stdDev / avg
      return cv > 0.3 // 变异系数大于0.3表示不稳定
    })

    if (unstableDevices.length > 0) {
      suggestions.push({
        title: "提高网络稳定性",
        description: "网络性能波动较大可能是由于干扰或信号强度问题。尝试更换Wi-Fi频道，减少干扰源，或使用网络扩展器。",
      })
    }

    // 如果没有特定建议，添加一般性建议
    if (suggestions.length === 0) {
      suggestions.push({
        title: "定期进行网络测速",
        description: "定期测试不同设备的网络性能，可以帮助您及时发现并解决潜在问题。",
      })
    }

    return suggestions
  }

  const optimizationSuggestions = getOptimizationSuggestions()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>设备网络性能洞察</CardTitle>
          <CardDescription>基于多设备测速结果的分析和洞察</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <Alert key={index} className={getInsightColor(insight.type)}>
                <div className={`mr-2 ${getInsightIconColor(insight.type)}`}>{getInsightIcon(insight.type)}</div>
                <AlertTitle className="font-medium">{insight.title}</AlertTitle>
                <AlertDescription className="mt-1">
                  {insight.description}
                  {insight.deviceId && (
                    <div className="mt-1">
                      <span className="font-medium">设备: </span>
                      {getDeviceName(insight.deviceId)}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>网络优化建议</CardTitle>
          <CardDescription>基于设备对比分析的网络优化建议</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizationSuggestions.map((suggestion, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="text-base font-medium mb-1">{suggestion.title}</h3>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
