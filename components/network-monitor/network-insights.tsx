"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react"
import type { NetworkMonitorData, NetworkInsight } from "@/types/network-monitor"

interface NetworkInsightsProps {
  data: NetworkMonitorData
}

export function NetworkInsights({ data }: NetworkInsightsProps) {
  const { insights } = data

  // 获取图标
  const getInsightIcon = (type: NetworkInsight["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>网络洞察</CardTitle>
        <CardDescription>基于测试数据的网络性能分析和建议</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div key={index} className="flex gap-3 pb-3 border-b last:border-0">
                <div className="shrink-0 mt-0.5">{getInsightIcon(insight.type)}</div>
                <div>
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Info className="h-10 w-10 mb-2 opacity-20" />
              <p>暂无网络洞察数据</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
