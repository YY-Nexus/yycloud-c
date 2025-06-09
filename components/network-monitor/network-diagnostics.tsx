"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { DiagnosticTestResult, DiagnosticTestType } from "@/types/network-monitor"
import { runDiagnosticTest } from "@/lib/network-monitor"

export function NetworkDiagnostics() {
  const [activeTab, setActiveTab] = useState<DiagnosticTestType>("ping")
  const [target, setTarget] = useState<string>("example.com")
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [testResult, setTestResult] = useState<DiagnosticTestResult | null>(null)

  // 运行诊断测试
  const runTest = async () => {
    if (!target.trim() || isRunning) return

    setIsRunning(true)
    setTestResult(null)

    try {
      const result = await runDiagnosticTest(activeTab, target)
      setTestResult(result)
    } catch (error) {
      console.error("运行诊断测试失败:", error)
    } finally {
      setIsRunning(false)
    }
  }

  // 渲染Ping测试结果
  const renderPingResult = () => {
    if (!testResult || testResult.type !== "ping") return null

    const { data } = testResult
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium mb-1">平均延迟</div>
              <div className="text-2xl font-bold">{data.avgPing.toFixed(1)} ms</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium mb-1">丢包率</div>
              <div className="text-2xl font-bold">{data.packetLoss.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">详细结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>发送的数据包:</span>
                <span>{data.sent}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>接收的数据包:</span>
                <span>{data.received}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>丢失的数据包:</span>
                <span>{data.sent - data.received}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>最小延迟:</span>
                <span>{data.minPing.toFixed(1)} ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>最大延迟:</span>
                <span>{data.maxPing.toFixed(1)} ms</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ping结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.pingResults.map((result, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-6 text-center">{index + 1}.</div>
                  {result === null ? (
                    <Badge variant="outline" className="bg-red-50 text-red-600">
                      请求超时
                    </Badge>
                  ) : (
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-600">
                        {result} ms
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 渲染Traceroute测试结果
  const renderTracerouteResult = () => {
    if (!testResult || testResult.type !== "traceroute") return null

    const { data } = testResult
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">路由跟踪结果</CardTitle>
            <CardDescription>从您的设备到目标的网络路径</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.hops.map((hop) => (
                <div key={hop.hop} className="flex items-center">
                  <div className="w-8 text-center font-medium">{hop.hop}</div>
                  <div className="flex-1 ml-2">
                    <div className="font-medium">{hop.name}</div>
                    <div className="text-sm text-muted-foreground">{hop.ip}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-blue-50 text-blue-600">
                      {hop.time} ms
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">总跳数</div>
                <div className="text-2xl font-bold">{data.totalHops}</div>
              </div>
              <div>
                {data.reachedDestination ? (
                  <Badge className="bg-green-50 text-green-600">已到达目标</Badge>
                ) : (
                  <Badge className="bg-yellow-50 text-yellow-600">未到达目标</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 渲染DNS测试结果
  const renderDnsResult = () => {
    if (!testResult || testResult.type !== "dns") return null

    const { data } = testResult
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">DNS解析结果</CardTitle>
            <CardDescription>域名: {data.domain}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.dnsResults.map((result, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">DNS服务器: {result.server}</div>
                    {result.success ? (
                      <Badge className="bg-green-50 text-green-600">成功</Badge>
                    ) : (
                      <Badge className="bg-red-50 text-red-600">失败</Badge>
                    )}
                  </div>
                  {result.success && (
                    <>
                      <div className="text-sm mb-1">
                        解析IP: <span className="font-mono">{result.resolvedIp}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">解析时间: {result.time} ms</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">成功率</div>
                <div className="text-2xl font-bold">{(data.successRate * 100).toFixed(0)}%</div>
              </div>
              <div>
                {data.successRate > 0.5 ? (
                  <Badge className="bg-green-50 text-green-600">DNS正常</Badge>
                ) : (
                  <Badge className="bg-red-50 text-red-600">DNS异常</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 渲染端口扫描结果
  const renderPortScanResult = () => {
    if (!testResult || testResult.type !== "portScan") return null

    const { data } = testResult
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">端口扫描结果</CardTitle>
            <CardDescription>主机: {data.host}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.portResults.map((result) => (
                <div key={result.port} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <span className="font-mono font-medium">{result.port}</span>
                    {result.service && <span className="ml-2 text-sm text-muted-foreground">({result.service})</span>}
                  </div>
                  {result.status === "open" ? (
                    <Badge className="bg-green-50 text-green-600">开放</Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      关闭
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">开放端口数</div>
                <div className="text-2xl font-bold">{data.openPorts.length}</div>
              </div>
              <div className="text-sm text-muted-foreground">扫描了 {data.scannedPorts.length} 个常用端口</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 渲染带宽测试结果
  const renderBandwidthTestResult = () => {
    if (!testResult || testResult.type !== "bandwidthTest") return null

    const { data } = testResult
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium mb-1">下载速度</div>
              <div className="text-2xl font-bold">{data.download.toFixed(2)} Mbps</div>
              <Progress value={(data.download / 200) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium mb-1">上传速度</div>
              <div className="text-2xl font-bold">{data.upload.toFixed(2)} Mbps</div>
              <Progress value={(data.upload / 100) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">详细结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>延迟:</span>
                <span>{data.latency.toFixed(1)} ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>抖动:</span>
                <span>{data.jitter.toFixed(1)} ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>测速服务器:</span>
                <span>{data.server.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>服务器位置:</span>
                <span>{data.server.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>距离:</span>
                <span>{data.server.distance}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 渲染丢包测试结果
  const renderPacketLossResult = () => {
    if (!testResult || testResult.type !== "packetLoss") return null

    const { data } = testResult
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">丢包率</div>
                <div className="text-2xl font-bold">{data.packetLossRate.toFixed(2)}%</div>
              </div>
              <div>
                {data.packetLossRate < 1 ? (
                  <Badge className="bg-green-50 text-green-600">极佳</Badge>
                ) : data.packetLossRate < 3 ? (
                  <Badge className="bg-blue-50 text-blue-600">良好</Badge>
                ) : data.packetLossRate < 5 ? (
                  <Badge className="bg-yellow-50 text-yellow-600">一般</Badge>
                ) : (
                  <Badge className="bg-red-50 text-red-600">较差</Badge>
                )}
              </div>
            </div>
            <Progress
              value={100 - data.packetLossRate}
              className="h-2 mt-2"
              indicatorClassName={
                data.packetLossRate < 1
                  ? "bg-green-500"
                  : data.packetLossRate < 3
                    ? "bg-blue-500"
                    : data.packetLossRate < 5
                      ? "bg-yellow-500"
                      : "bg-red-500"
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">详细结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>发送的数据包:</span>
                <span>{data.packetsSent}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>接收的数据包:</span>
                <span>{data.packetsReceived}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>丢失的数据包:</span>
                <span>{data.packetsLost}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">时间间隔丢包分析</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.intervals.map((interval, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm">{interval.interval}</div>
                  <div className="flex items-center">
                    <Progress value={100 - interval.loss} className="w-24 h-2 mr-2" />
                    <span className="text-sm">{interval.loss.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 根据测试类型渲染结果
  const renderTestResult = () => {
    if (!testResult) return null

    switch (testResult.type) {
      case "ping":
        return renderPingResult()
      case "traceroute":
        return renderTracerouteResult()
      case "dns":
        return renderDnsResult()
      case "portScan":
        return renderPortScanResult()
      case "bandwidthTest":
        // 完成renderBandwidthTestResult函数
        return renderBandwidthTestResult()
      case "packetLoss":
        return renderPacketLossResult()
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>网络诊断工具</CardTitle>
          <CardDescription>选择诊断类型并输入目标地址来检测网络连接问题</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 测试类型选择 */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={activeTab === "ping" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveTab("ping")}
              >
                Ping测试
              </Badge>
              <Badge
                variant={activeTab === "traceroute" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveTab("traceroute")}
              >
                路由跟踪
              </Badge>
              <Badge
                variant={activeTab === "dns" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveTab("dns")}
              >
                DNS解析
              </Badge>
              <Badge
                variant={activeTab === "portScan" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveTab("portScan")}
              >
                端口扫描
              </Badge>
              <Badge
                variant={activeTab === "bandwidthTest" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveTab("bandwidthTest")}
              >
                带宽测试
              </Badge>
              <Badge
                variant={activeTab === "packetLoss" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveTab("packetLoss")}
              >
                丢包测试
              </Badge>
            </div>

            {/* 目标输入 */}
            <div className="flex gap-2">
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="输入目标地址 (域名或IP)"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                onClick={runTest}
                disabled={isRunning || !target.trim()}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                {isRunning ? "测试中..." : "开始测试"}
              </button>
            </div>

            {/* 测试说明 */}
            <div className="text-sm text-muted-foreground">
              {activeTab === "ping" && "Ping测试用于测量网络延迟和丢包率，适合检测基本连接问题。"}
              {activeTab === "traceroute" && "路由跟踪显示数据包从您的设备到目标服务器经过的所有路由器。"}
              {activeTab === "dns" && "DNS解析测试检查域名是否能正确解析为IP地址，帮助诊断DNS相关问题。"}
              {activeTab === "portScan" && "端口扫描检测目标主机上哪些常用端口是开放的，适合检查服务可用性。"}
              {activeTab === "bandwidthTest" && "带宽测试测量您的网络连接速度，包括上传和下载速率。"}
              {activeTab === "packetLoss" && "丢包测试检测网络中数据包丢失的情况，高丢包率会导致网络体验变差。"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 测试结果 */}
      {isRunning ? (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-center">
              正在执行
              {activeTab === "ping"
                ? "Ping测试"
                : activeTab === "traceroute"
                  ? "路由跟踪"
                  : activeTab === "dns"
                    ? "DNS解析"
                    : activeTab === "portScan"
                      ? "端口扫描"
                      : activeTab === "bandwidthTest"
                        ? "带宽测试"
                        : "丢包测试"}
              ...
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">请稍候，这可能需要几秒钟时间</p>
          </CardContent>
        </Card>
      ) : (
        renderTestResult()
      )}
    </div>
  )
}
