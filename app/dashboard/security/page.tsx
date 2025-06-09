/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 安全中心页面 (检查修复版)
 * ==========================================
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Key,
  Scan,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SecurityAlert {
  id: string
  type: "warning" | "error" | "info"
  title: string
  description: string
  timestamp: string
  resolved: boolean
}

interface SecurityScan {
  id: string
  name: string
  status: "passed" | "failed" | "warning"
  description: string
  lastRun: string
}

export default function SecurityPage() {
  const [securityScore, setSecurityScore] = useState(85)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [scans, setScans] = useState<SecurityScan[]>([])
  const [showPasswords, setShowPasswords] = useState(false)

  // 初始化数据
  useEffect(() => {
    const mockAlerts: SecurityAlert[] = [
      {
        id: "1",
        type: "warning",
        title: "弱密码检测",
        description: "发现3个使用弱密码的账户",
        timestamp: new Date().toISOString(),
        resolved: false,
      },
      {
        id: "2",
        type: "info",
        title: "系统更新",
        description: "有可用的安全更新",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        resolved: false,
      },
      {
        id: "3",
        type: "error",
        title: "异常登录",
        description: "检测到来自异常位置的登录尝试",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        resolved: true,
      },
    ]

    const mockScans: SecurityScan[] = [
      {
        id: "1",
        name: "端口扫描",
        status: "passed",
        description: "检查开放端口和服务",
        lastRun: new Date().toISOString(),
      },
      {
        id: "2",
        name: "恶意软件扫描",
        status: "passed",
        description: "扫描恶意软件和病毒",
        lastRun: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "3",
        name: "密码强度检查",
        status: "warning",
        description: "检查密码安全性",
        lastRun: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "4",
        name: "网络安全扫描",
        status: "passed",
        description: "检查网络配置安全性",
        lastRun: new Date(Date.now() - 10800000).toISOString(),
      },
    ]

    setAlerts(mockAlerts)
    setScans(mockScans)
  }, [])

  // 运行安全扫描
  const runSecurityScan = async () => {
    setIsScanning(true)
    setScanProgress(0)

    try {
      // 模拟扫描过程
      for (let i = 0; i <= 100; i += 10) {
        setScanProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      // 更新扫描结果
      const updatedScans = scans.map((scan) => ({
        ...scan,
        lastRun: new Date().toISOString(),
        status: Math.random() > 0.3 ? "passed" : "warning",
      }))
      setScans(updatedScans)

      // 更新安全评分
      const newScore = Math.floor(Math.random() * 20) + 80
      setSecurityScore(newScore)

      toast({
        title: "扫描完成",
        description: "安全扫描已完成，请查看结果",
      })
    } catch (error) {
      toast({
        title: "扫描失败",
        description: "安全扫描过程中出现错误",
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
      setScanProgress(0)
    }
  }

  // 解决安全警报
  const resolveAlert = (alertId: string) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert)))
    toast({
      title: "警报已处理",
      description: "安全警报已标记为已解决",
    })
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <ShieldAlert className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getScanStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <ShieldAlert className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLevel = (score: number) => {
    if (score >= 90) return "优秀"
    if (score >= 70) return "良好"
    if (score >= 50) return "一般"
    return "需要改进"
  }

  const unresolvedAlerts = alerts.filter((alert) => !alert.resolved)
  const passedScans = scans.filter((scan) => scan.status === "passed").length
  const failedScans = scans.filter((scan) => scan.status === "failed").length
  const warningScans = scans.filter((scan) => scan.status === "warning").length

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">安全中心</h1>
          <p className="text-muted-foreground">监控和管理系统安全状态</p>
        </div>
        <Button onClick={runSecurityScan} disabled={isScanning}>
          {isScanning ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              扫描中...
            </>
          ) : (
            <>
              <Scan className="mr-2 h-4 w-4" />
              开始扫描
            </>
          )}
        </Button>
      </div>

      {/* 安全评分 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">安全评分</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(securityScore)}`}>{securityScore}/100</div>
            <p className="text-xs text-muted-foreground">{getScoreLevel(securityScore)}</p>
            <Progress value={securityScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃警报</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unresolvedAlerts.length}</div>
            <p className="text-xs text-muted-foreground">需要处理的警报</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">扫描通过</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{passedScans}</div>
            <p className="text-xs text-muted-foreground">安全检查通过</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">需要关注</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningScans + failedScans}</div>
            <p className="text-xs text-muted-foreground">警告和失败项</p>
          </CardContent>
        </Card>
      </div>

      {/* 扫描进度 */}
      {isScanning && (
        <Card>
          <CardHeader>
            <CardTitle>安全扫描进行中</CardTitle>
            <CardDescription>正在检查系统安全状态...</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={scanProgress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">{scanProgress}% 完成</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="alerts">安全警报</TabsTrigger>
          <TabsTrigger value="scans">安全扫描</TabsTrigger>
          <TabsTrigger value="passwords">密码管理</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 最近警报 */}
            <Card>
              <CardHeader>
                <CardTitle>最近警报</CardTitle>
                <CardDescription>最新的安全警报和通知</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getAlertIcon(alert.type)}
                        <div>
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                        </div>
                      </div>
                      {alert.resolved ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          已解决
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)}>
                          处理
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 扫描状态 */}
            <Card>
              <CardHeader>
                <CardTitle>扫描状态</CardTitle>
                <CardDescription>最新的安全扫描结果</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scans.slice(0, 4).map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getScanStatusIcon(scan.status)}
                        <div>
                          <p className="font-medium">{scan.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(scan.lastRun).toLocaleString("zh-CN")}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          scan.status === "passed"
                            ? "bg-green-50 text-green-700"
                            : scan.status === "warning"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-red-50 text-red-700"
                        }
                      >
                        {scan.status === "passed" ? "通过" : scan.status === "warning" ? "警告" : "失败"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>安全警报</CardTitle>
              <CardDescription>所有安全警报和通知</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getAlertIcon(alert.type)}
                      <div>
                        <h3 className="font-medium">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString("zh-CN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {alert.resolved ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          已解决
                        </Badge>
                      ) : (
                        <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                          处理
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>安全扫描</CardTitle>
              <CardDescription>系统安全扫描项目和结果</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scans.map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getScanStatusIcon(scan.status)}
                      <div>
                        <h3 className="font-medium">{scan.name}</h3>
                        <p className="text-sm text-muted-foreground">{scan.description}</p>
                        <p className="text-xs text-muted-foreground">
                          最后运行: {new Date(scan.lastRun).toLocaleString("zh-CN")}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        scan.status === "passed"
                          ? "bg-green-50 text-green-700"
                          : scan.status === "warning"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                      }
                    >
                      {scan.status === "passed" ? "通过" : scan.status === "warning" ? "警告" : "失败"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="passwords" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>密码管理</CardTitle>
              <CardDescription>管理和检查密码安全性</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">保存的密码</h3>
                  <Button variant="outline" size="sm" onClick={() => setShowPasswords(!showPasswords)}>
                    {showPasswords ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        隐藏
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        显示
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-3">
                  {[
                    { site: "GitHub", username: "user@example.com", strength: "strong" },
                    { site: "Gmail", username: "user@gmail.com", strength: "medium" },
                    { site: "社交媒体", username: "username", strength: "weak" },
                  ].map((password, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{password.site}</p>
                          <p className="text-sm text-muted-foreground">{password.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={
                            password.strength === "strong"
                              ? "bg-green-50 text-green-700"
                              : password.strength === "medium"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-red-50 text-red-700"
                          }
                        >
                          {password.strength === "strong" ? "强" : password.strength === "medium" ? "中" : "弱"}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          {showPasswords ? "••••••••" : "••••••••"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">密码安全建议</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 使用至少12个字符的复杂密码</li>
                    <li>• 每个账户使用不同的密码</li>
                    <li>• 定期更换重要账户密码</li>
                    <li>• 启用双因素认证</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
