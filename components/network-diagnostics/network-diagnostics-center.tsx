"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Globe,
  Clock,
  Settings,
  Play,
  Pause,
  BarChart3,
  MapPin,
  Zap,
  Shield,
  AlertTriangle,
} from "lucide-react"
import { SpeedTestRunner } from "./speed-test-runner"
import { NetworkMonitor } from "./network-monitor"
import { ScheduledTestManager } from "./scheduled-test-manager"
import { NetworkQualityDashboard } from "./network-quality-dashboard"
import { GeoLocationViewer } from "./geo-location-viewer"
import { scheduledTestManager } from "@/lib/scheduled-test-manager"
import type { NetworkTestResult, ScheduledTest } from "@/types/network-diagnostics"

export function NetworkDiagnosticsCenter() {
  const [activeTab, setActiveTab] = useState("speed-test")
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [scheduledTests, setScheduledTests] = useState<ScheduledTest[]>([])
  const [recentResults, setRecentResults] = useState<NetworkTestResult[]>([])
  const [systemStatus, setSystemStatus] = useState({
    testsRunning: 0,
    lastUpdate: new Date(),
    overallHealth: "good" as "good" | "warning" | "error",
  })

  useEffect(() => {
    // 加载定时测试
    setScheduledTests(scheduledTestManager.getAllScheduledTests())

    // 启动监控
    if (isMonitoring) {
      scheduledTestManager.start()
    } else {
      scheduledTestManager.stop()
    }

    return () => {
      scheduledTestManager.stop()
    }
  }, [isMonitoring])

  const handleToggleMonitoring = () => {
    setIsMonitoring(!isMonitoring)
  }

  const handleTestComplete = (result: NetworkTestResult) => {
    setRecentResults((prev) => [result, ...prev.slice(0, 9)]) // 保留最近10个结果
    setSystemStatus((prev) => ({
      ...prev,
      lastUpdate: new Date(),
      overallHealth:
        result.qualityMetrics.overall >= 80 ? "good" : result.qualityMetrics.overall >= 60 ? "warning" : "error",
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <Shield className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 系统状态概览 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">系统状态</p>
                <div className={`flex items-center gap-2 ${getStatusColor(systemStatus.overallHealth)}`}>
                  {getStatusIcon(systemStatus.overallHealth)}
                  <span className="text-2xl font-bold">
                    {systemStatus.overallHealth === "good"
                      ? "正常"
                      : systemStatus.overallHealth === "warning"
                        ? "警告"
                        : "异常"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">运行中测试</p>
                <p className="text-2xl font-bold">{systemStatus.testsRunning}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">定时测试</p>
                <p className="text-2xl font-bold">{scheduledTests.filter((t) => t.status === "active").length}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">最后更新</p>
                <p className="text-sm font-medium">{systemStatus.lastUpdate.toLocaleTimeString("zh-CN")}</p>
              </div>
              <Globe className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 监控控制 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>网络诊断中心</CardTitle>
              <CardDescription>统一的网络测试、监控和分析平台</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isMonitoring ? "default" : "secondary"}>{isMonitoring ? "监控中" : "已停止"}</Badge>
              <Button onClick={handleToggleMonitoring} variant={isMonitoring ? "destructive" : "default"} size="sm">
                {isMonitoring ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    停止监控
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    开始监控
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 主要功能标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="speed-test" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            速度测试
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            实时监控
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            定时测试
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            质量分析
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            地理位置
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="speed-test" className="space-y-4">
          <SpeedTestRunner onTestComplete={handleTestComplete} />
        </TabsContent>

        <TabsContent value="monitor" className="space-y-4">
          <NetworkMonitor
            isActive={isMonitoring}
            onStatusChange={(status) => setSystemStatus((prev) => ({ ...prev, ...status }))}
          />
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <ScheduledTestManager tests={scheduledTests} onTestsChange={setScheduledTests} />
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <NetworkQualityDashboard results={recentResults} />
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <GeoLocationViewer />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>诊断设置</CardTitle>
              <CardDescription>配置网络诊断参数和偏好设置</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>设置功能开发中...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
