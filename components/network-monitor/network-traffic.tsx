"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, Upload, HardDrive } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import type { NetworkTrafficData, NetworkMonitorPeriod } from "@/types/network-monitor"
import { generateNetworkTrafficData } from "@/lib/network-monitor"

interface NetworkTrafficProps {
  initialData?: NetworkTrafficData
}

export function NetworkTraffic({ initialData }: NetworkTrafficProps) {
  const [period, setPeriod] = useState<NetworkMonitorPeriod>("24h")
  const [trafficData, setTrafficData] = useState<NetworkTrafficData | null>(initialData || null)
  const [loading, setLoading] = useState<boolean>(!initialData)
  const [view, setView] = useState<"chart" | "table">("chart")
  const [chartType, setChartType] = useState<"line" | "bar">("line")

  // 加载流量数据
  const loadTrafficData = async () => {
    setLoading(true)
    try {
      const data = generateNetworkTrafficData(period)
      setTrafficData(data)
    } catch (error) {
      console.error("加载流量数据失败:", error)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载和周期变化时重新加载数据
  useEffect(() => {
    if (!initialData) {
      loadTrafficData()
    }
  }, [initialData, period])

  // 格式化字节数为可读格式
  const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  // 渲染流量图表
  const renderTrafficChart = () => {
    if (!trafficData) return null

    const { dataPoints } = trafficData
    const maxValue = Math.max(...dataPoints.map((dp) => Math.max(dp.inbound, dp.outbound)))
    const chartHeight = 300
    const chartWidth = "100%"

    return (
      <div className="w-full overflow-x-auto">
        <div style={{ height: `${chartHeight}px`, width: chartWidth, position: "relative" }}>
          {/* Y轴标签 */}
          <div
            className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground"
            style={{ paddingTop: "10px", paddingBottom: "20px" }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i}>{formatBytes((maxValue / 4) * (4 - i))}</div>
            ))}
          </div>

          {/* 图表区域 */}
          <div className="ml-12 h-full relative">
            {/* 水平网格线 */}
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="absolute w-full border-t border-gray-100 dark:border-gray-800"
                style={{ top: `${(i * chartHeight) / 4}px` }}
              />
            ))}

            {/* 数据点 */}
            <div className="absolute inset-0 flex items-end">
              {chartType === "line" ? (
                <svg
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${dataPoints.length} ${chartHeight}`}
                  preserveAspectRatio="none"
                >
                  {/* 入站流量区域 */}
                  <path
                    d={`M0,${chartHeight} ${dataPoints
                      .map(
                        (dp, i) =>
                          `L${(i / (dataPoints.length - 1)) * 100}%,${
                            chartHeight - (dp.inbound / maxValue) * chartHeight
                          }`,
                      )
                      .join(" ")} L100%,${chartHeight} Z`}
                    fill="rgba(14, 165, 233, 0.2)"
                    stroke="none"
                  />
                  <path
                    d={`M0,${chartHeight} ${dataPoints
                      .map(
                        (dp, i) =>
                          `L${(i / (dataPoints.length - 1)) * 100}%,${
                            chartHeight - (dp.inbound / maxValue) * chartHeight
                          }`,
                      )
                      .join(" ")}`}
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="2"
                  />

                  {/* 出站流量区域 */}
                  <path
                    d={`M0,${chartHeight} ${dataPoints
                      .map(
                        (dp, i) =>
                          `L${(i / (dataPoints.length - 1)) * 100}%,${
                            chartHeight - (dp.outbound / maxValue) * chartHeight
                          }`,
                      )
                      .join(" ")} L100%,${chartHeight} Z`}
                    fill="rgba(16, 185, 129, 0.2)"
                    stroke="none"
                  />
                  <path
                    d={`M0,${chartHeight} ${dataPoints
                      .map(
                        (dp, i) =>
                          `L${(i / (dataPoints.length - 1)) * 100}%,${
                            chartHeight - (dp.outbound / maxValue) * chartHeight
                          }`,
                      )
                      .join(" ")}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <div className="flex items-end w-full h-full">
                  {dataPoints.map((dp, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div
                        className="w-4 bg-[#0ea5e9] rounded-t"
                        style={{ height: `${(dp.inbound / maxValue) * 100}%` }}
                      />
                      <div
                        className="w-4 bg-[#10b981] rounded-t mt-1"
                        style={{ height: `${(dp.outbound / maxValue) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* X轴标签 */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
              {dataPoints
                .filter((_, i) => i % Math.ceil(dataPoints.length / 6) === 0)
                .map((dp, i) => (
                  <div key={i} className="text-center">
                    {period === "24h"
                      ? format(dp.timestamp, "HH:mm", { locale: zhCN })
                      : period === "7d"
                        ? format(dp.timestamp, "MM/dd", { locale: zhCN })
                        : format(dp.timestamp, "MM/dd", { locale: zhCN })}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 图例 */}
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#0ea5e9] rounded-full mr-2" />
            <span className="text-sm">入站流量</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#10b981] rounded-full mr-2" />
            <span className="text-sm">出站流量</span>
          </div>
        </div>
      </div>
    )
  }

  // 渲染流量表格
  const renderTrafficTable = () => {
    if (!trafficData) return null

    const { dataPoints } = trafficData

    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left font-medium">时间</th>
              <th className="px-4 py-2 text-right font-medium">入站流量</th>
              <th className="px-4 py-2 text-right font-medium">出站流量</th>
              <th className="px-4 py-2 text-right font-medium">总流量</th>
            </tr>
          </thead>
          <tbody>
            {dataPoints.map((dp, i) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-2 text-left">
                  {period === "24h"
                    ? format(dp.timestamp, "HH:mm", { locale: zhCN })
                    : format(dp.timestamp, "yyyy-MM-dd HH:mm", { locale: zhCN })}
                </td>
                <td className="px-4 py-2 text-right">{formatBytes(dp.inbound)}</td>
                <td className="px-4 py-2 text-right">{formatBytes(dp.outbound)}</td>
                <td className="px-4 py-2 text-right">{formatBytes(dp.inbound + dp.outbound)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>网络流量</CardTitle>
          <CardDescription>监控网络流量使用情况</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={(value) => setPeriod(value as NetworkMonitorPeriod)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">最近24小时</SelectItem>
              <SelectItem value="7d">最近7天</SelectItem>
              <SelectItem value="30d">最近30天</SelectItem>
              <SelectItem value="90d">最近90天</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={loadTrafficData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            刷新
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {trafficData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Download className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium">入站流量</div>
                        <div className="text-2xl font-bold">{formatBytes(trafficData.totalInbound)}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      峰值: {formatBytes(trafficData.peakInbound)}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Upload className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium">出站流量</div>
                        <div className="text-2xl font-bold">{formatBytes(trafficData.totalOutbound)}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      峰值: {formatBytes(trafficData.peakOutbound)}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HardDrive className="h-5 w-5 text-purple-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium">总流量</div>
                        <div className="text-2xl font-bold">
                          {formatBytes(trafficData.totalInbound + trafficData.totalOutbound)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      平均: {formatBytes((trafficData.avgInbound + trafficData.avgOutbound) / 2)}/点
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <Tabs value={view} onValueChange={(v) => setView(v as "chart" | "table")}>
                  <TabsList>
                    <TabsTrigger value="chart">图表</TabsTrigger>
                    <TabsTrigger value="table">表格</TabsTrigger>
                  </TabsList>
                </Tabs>

                {view === "chart" && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={chartType === "line" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("line")}
                    >
                      折线图
                    </Button>
                    <Button
                      variant={chartType === "bar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("bar")}
                    >
                      柱状图
                    </Button>
                  </div>
                )}
              </div>

              <div className="border rounded-md p-4">
                {view === "chart" ? renderTrafficChart() : renderTrafficTable()}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">
              {loading ? "正在加载流量数据..." : "暂无流量数据，请点击"刷新"按钮"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
  \
}
