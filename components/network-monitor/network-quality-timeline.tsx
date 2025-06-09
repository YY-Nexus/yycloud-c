"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { ArrowUpRight, ArrowDownRight, WifiOff, CheckCircle2 } from "lucide-react"
import type { NetworkMonitorData } from "@/types/network-monitor"
import { detectQualityEvents } from "@/lib/network-monitor"

interface NetworkQualityTimelineProps {
  data: NetworkMonitorData
}

export function NetworkQualityTimeline({ data }: NetworkQualityTimelineProps) {
  // 检测网络质量事件
  const events = detectQualityEvents(data.dataPoints)

  // 获取事件图标
  const getEventIcon = (type: string, severity: string) => {
    switch (type) {
      case "improvement":
        return <ArrowUpRight className="h-5 w-5 text-green-500" />
      case "degradation":
        return <ArrowDownRight className="h-5 w-5 text-yellow-500" />
      case "outage":
        return <WifiOff className="h-5 w-5 text-red-500" />
      case "recovery":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return <ArrowUpRight className="h-5 w-5 text-blue-500" />
    }
  }

  // 获取事件严重性样式
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>网络质量事件时间线</CardTitle>
        <CardDescription>记录网络质量变化的重要事件</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="relative space-y-4 before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-border">
            {events.map((event, index) => (
              <div key={index} className="flex gap-3">
                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background ring-1 ring-border">
                  {getEventIcon(event.type, event.severity)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{event.description}</h4>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${getSeverityStyle(event.severity)}`}>
                      {event.severity === "high" ? "严重" : event.severity === "medium" ? "中等" : "轻微"}
                    </div>
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {format(event.timestamp, "yyyy年MM月dd日 HH:mm", { locale: zhCN })}
                  </time>
                  <div className="mt-1 text-xs">
                    {event.metrics.download && (
                      <span className="mr-3">下载: {event.metrics.download.toFixed(2)} Mbps</span>
                    )}
                    {event.metrics.upload && <span className="mr-3">上传: {event.metrics.upload.toFixed(2)} Mbps</span>}
                    {event.metrics.ping && <span className="mr-3">延迟: {event.metrics.ping.toFixed(0)} ms</span>}
                    {event.metrics.packetLoss && <span>丢包率: {event.metrics.packetLoss.toFixed(2)}%</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-10 w-10 mb-2 opacity-20" />
            <p>在当前时间范围内未检测到明显的网络质量变化事件</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
