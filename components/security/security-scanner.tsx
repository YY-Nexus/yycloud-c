"use client"

import { useState, useEffect } from "react"
import { Shield, AlertTriangle, CheckCircle, Clock, RefreshCw, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import type { SecurityAssessmentResult } from "@/types/security"

export default function SecurityScanner() {
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scanComplete, setScanComplete] = useState(false)
  const [results, setResults] = useState<SecurityAssessmentResult[]>([])
  const [lastScanDate, setLastScanDate] = useState<string | null>(null)
  const [overallScore, setOverallScore] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // 模拟从本地存储加载上次扫描结果
    const storedResults = localStorage.getItem("security-scan-results")
    const storedDate = localStorage.getItem("security-scan-date")

    if (storedResults && storedDate) {
      setResults(JSON.parse(storedResults))
      setLastScanDate(storedDate)
      setScanComplete(true)

      // 计算总分
      const parsedResults = JSON.parse(storedResults) as SecurityAssessmentResult[]
      const totalScore = parsedResults.reduce((sum, result) => sum + result.score, 0) / parsedResults.length
      setOverallScore(Math.round(totalScore))
    }
  }, [])

  const startScan = () => {
    setScanning(true)
    setScanComplete(false)
    setProgress(0)
    setResults([])

    // 模拟扫描进度
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          completeScan()
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const completeScan = () => {
    setScanning(false)
    setScanComplete(true)

    // 模拟扫描结果
    const mockResults: SecurityAssessmentResult[] = [
      {
        category: "密码安全",
        score: 75,
        issues: [
          {
            id: "pwd-1",
            severity: "medium",
            description: "部分用户密码强度不足",
            solution: "更新密码策略，要求使用更强的密码",
          },
          {
            id: "pwd-2",
            severity: "low",
            description: "密码过期策略未启用",
            solution: "启用密码定期更新策略",
          },
        ],
        recommendations: ["实施多因素认证", "定期更新密码策略", "使用密码管理器"],
      },
      {
        category: "数据保护",
        score: 90,
        issues: [
          {
            id: "data-1",
            severity: "low",
            description: "部分非敏感数据未加密",
            solution: "扩展加密范围到所有数据",
          },
        ],
        recommendations: ["实施端到端加密", "定期审查数据访问权限", "建立数据分类系统"],
      },
      {
        category: "网络安全",
        score: 60,
        issues: [
          {
            id: "net-1",
            severity: "high",
            description: "发现开放的不必要端口",
            solution: "关闭所有不必要的网络端口",
          },
          {
            id: "net-2",
            severity: "medium",
            description: "防火墙规则过于宽松",
            solution: "审查并收紧防火墙规则",
          },
          {
            id: "net-3",
            severity: "medium",
            description: "网络流量未完全监控",
            solution: "实施全面的网络监控解决方案",
          },
        ],
        recommendations: ["实施网络分段", "定期进行渗透测试", "更新网络安全策略"],
      },
      {
        category: "应用安全",
        score: 85,
        issues: [
          {
            id: "app-1",
            severity: "low",
            description: "部分应用未使用最新安全库",
            solution: "更新所有应用依赖到最新版本",
          },
        ],
        recommendations: ["实施安全开发生命周期", "定期进行代码审查", "使用自动化安全测试工具"],
      },
      {
        category: "设备安全",
        score: 70,
        issues: [
          {
            id: "dev-1",
            severity: "medium",
            description: "部分设备未启用自动更新",
            solution: "为所有设备启用自动安全更新",
          },
          {
            id: "dev-2",
            severity: "low",
            description: "设备清单不完整",
            solution: "更新并维护完整的设备资产清单",
          },
        ],
        recommendations: ["实施设备管理策略", "定期审查设备访问权限", "为所有设备安装安全软件"],
      },
    ]

    setResults(mockResults)

    // 计算总分
    const totalScore = mockResults.reduce((sum, result) => sum + result.score, 0) / mockResults.length
    setOverallScore(Math.round(totalScore))

    // 保存结果到本地存储
    const currentDate = new Date().toLocaleString("zh-CN")
    setLastScanDate(currentDate)
    localStorage.setItem("security-scan-results", JSON.stringify(mockResults))
    localStorage.setItem("security-scan-date", currentDate)
  }

  const getTotalIssueCount = () => {
    return results.reduce((count, result) => count + result.issues.length, 0)
  }

  const getIssueCountBySeverity = (severity: "critical" | "high" | "medium" | "low") => {
    return results.reduce((count, result) => {
      return count + result.issues.filter((issue) => issue.severity === severity).length
    }, 0)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    if (score >= 50) return "text-orange-500"
    return "text-red-500"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">安全扫描器</h1>
        <p className="text-muted-foreground">全面评估系统安全状况，发现并修复潜在安全问题</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>安全扫描</CardTitle>
            <CardDescription>{lastScanDate ? `上次扫描时间: ${lastScanDate}` : "尚未进行安全扫描"}</CardDescription>
          </CardHeader>
          <CardContent>
            {scanning ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>扫描进度</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="text-sm text-muted-foreground animate-pulse">正在扫描系统安全状况，请稍候...</div>
              </div>
            ) : scanComplete ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">安全评分</span>
                  </div>
                  <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}/100</span>
                </div>
                <Progress
                  value={overallScore}
                  className="h-2"
                  indicatorClassName={
                    overallScore >= 90
                      ? "bg-green-500"
                      : overallScore >= 70
                        ? "bg-yellow-500"
                        : overallScore >= 50
                          ? "bg-orange-500"
                          : "bg-red-500"
                  }
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                      <div className="text-2xl font-bold">{getIssueCountBySeverity("high")}</div>
                      <div className="text-sm text-muted-foreground">高风险问题</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
                      <div className="text-2xl font-bold">{getIssueCountBySeverity("medium")}</div>
                      <div className="text-sm text-muted-foreground">中风险问题</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">{getIssueCountBySeverity("low")}</div>
                      <div className="text-sm text-muted-foreground">低风险问题</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{results.length}</div>
                      <div className="text-sm text-muted-foreground">已检查类别</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">尚未进行安全扫描</h3>
                <p className="text-muted-foreground mt-2 mb-6">点击下方按钮开始全面安全评估</p>
                <Button onClick={startScan}>开始安全扫描</Button>
              </div>
            )}
          </CardContent>
          {scanComplete && (
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">发现 {getTotalIssueCount()} 个安全问题</div>
              <Button onClick={startScan} disabled={scanning}>
                <RefreshCw className="h-4 w-4 mr-2" />
                重新扫描
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>安全状态</CardTitle>
            <CardDescription>系统各方面安全状况概览</CardDescription>
          </CardHeader>
          <CardContent>
            {scanComplete ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{result.category}</span>
                      <span className={`font-bold ${getScoreColor(result.score)}`}>{result.score}/100</span>
                    </div>
                    <Progress
                      value={result.score}
                      className="h-1.5"
                      indicatorClassName={
                        result.score >= 90
                          ? "bg-green-500"
                          : result.score >= 70
                            ? "bg-yellow-500"
                            : result.score >= 50
                              ? "bg-orange-500"
                              : "bg-red-500"
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">完成扫描后显示安全状态</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {scanComplete && (
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="issues">安全问题 ({getTotalIssueCount()})</TabsTrigger>
            <TabsTrigger value="recommendations">建议</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((result) => (
                <Card key={result.category}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{result.category}</CardTitle>
                      <Badge variant={result.score >= 70 ? "default" : "destructive"}>{result.score}/100</Badge>
                    </div>
                    <CardDescription>发现 {result.issues.length} 个问题</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.issues.length > 0 ? (
                        <div className="space-y-2">
                          {result.issues.map((issue) => (
                            <div key={issue.id} className="flex items-start space-x-2">
                              <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(issue.severity)}`} />
                              <div className="text-sm">{issue.description}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">未发现问题</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle>安全问题详情</CardTitle>
                <CardDescription>按严重程度排序的所有安全问题</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-6">
                    {["high", "medium", "low"].map((severity) => {
                      const issuesBySeverity = results.flatMap((result) =>
                        result.issues
                          .filter((issue) => issue.severity === severity)
                          .map((issue) => ({ ...issue, category: result.category })),
                      )

                      if (issuesBySeverity.length === 0) return null

                      return (
                        <div key={severity} className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getSeverityColor(severity)}`} />
                            <h3 className="font-medium">
                              {severity === "high" ? "高" : severity === "medium" ? "中" : "低"}
                              风险问题 ({issuesBySeverity.length})
                            </h3>
                          </div>

                          <div className="space-y-4">
                            {issuesBySeverity.map((issue) => (
                              <Alert key={issue.id} variant="outline">
                                <AlertTitle className="flex items-center justify-between">
                                  <span>{issue.description}</span>
                                  <Badge variant="outline">{issue.category}</Badge>
                                </AlertTitle>
                                <AlertDescription className="mt-2">
                                  <div className="text-sm text-muted-foreground mt-1">
                                    <span className="font-medium">解决方案: </span>
                                    {issue.solution}
                                  </div>
                                </AlertDescription>
                              </Alert>
                            ))}
                          </div>

                          <Separator />
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>安全建议</CardTitle>
                <CardDescription>提高系统安全性的建议措施</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {results.map((result) => (
                    <div key={result.category} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-5 w-5" />
                        <h3 className="font-medium">{result.category}</h3>
                      </div>

                      <div className="ml-7 space-y-2">
                        {result.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                            <div className="text-sm">{recommendation}</div>
                          </div>
                        ))}
                      </div>

                      <Separator />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
