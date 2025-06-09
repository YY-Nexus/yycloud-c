"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { performSecurityAssessment } from "@/lib/security-manager"
import type { SecurityAssessmentResult } from "@/types/security"
import { ShieldCheck, AlertTriangle, AlertCircle, CheckCircle, RefreshCw, Download, Share2 } from "lucide-react"

export function SecurityAssessment() {
  const [results, setResults] = useState<SecurityAssessmentResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [lastScan, setLastScan] = useState<string | null>(null)
  const [showRecommendations, setShowRecommendations] = useState<Record<string, boolean>>({})

  const runAssessment = () => {
    setLoading(true)

    // 模拟异步操作
    setTimeout(() => {
      const assessmentResults = performSecurityAssessment()
      setResults(assessmentResults)
      setLastScan(new Date().toISOString())
      setLoading(false)
    }, 1500)
  }

  useEffect(() => {
    runAssessment()
  }, [])

  const filteredResults =
    activeCategory === "all" ? results : results.filter((result) => result.category === activeCategory)

  const allIssues = results.flatMap((result) => result.issues)
  const criticalIssues = allIssues.filter((issue) => issue.severity === "critical").length
  const highIssues = allIssues.filter((issue) => issue.severity === "high").length
  const mediumIssues = allIssues.filter((issue) => issue.severity === "medium").length
  const lowIssues = allIssues.filter((issue) => issue.severity === "low").length

  const overallScore =
    results.length > 0 ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length) : 0

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    if (score >= 40) return "text-orange-500"
    return "text-red-500"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    if (score >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return ""
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <AlertTriangle className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "从未"

    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const toggleRecommendations = (category: string) => {
    setShowRecommendations((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const generateReport = () => {
    // 这里可以实现报告生成逻辑
    alert("安全评估报告已生成")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">安全评估</CardTitle>
              <CardDescription>全面评估您的安全状况并获取改进建议</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button onClick={generateReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                导出报告
              </Button>
              <Button onClick={runAssessment} disabled={loading} variant="default">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                {loading ? "评估中..." : "重新评估"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-2">总体安全评分</div>
                <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</div>
                <Progress value={overallScore} className={`h-2 mt-2 ${getProgressColor(overallScore)}`} />
              </div>
              <div className="text-sm text-muted-foreground mt-4">上次评估: {formatDate(lastScan)}</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">安全问题摘要</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center p-3 bg-red-50 rounded-md border border-red-100">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <div className="text-sm font-medium">严重问题</div>
                    <div className="text-2xl font-bold">{criticalIssues}</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-orange-50 rounded-md border border-orange-100">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-3" />
                  <div>
                    <div className="text-sm font-medium">高风险问题</div>
                    <div className="text-2xl font-bold">{highIssues}</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-yellow-50 rounded-md border border-yellow-100">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                  <div>
                    <div className="text-sm font-medium">中风险问题</div>
                    <div className="text-2xl font-bold">{mediumIssues}</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-md border border-blue-100">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm font-medium">低风险问题</div>
                    <div className="text-2xl font-bold">{lowIssues}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8">
              <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">没有评估结果</h3>
              <p className="text-muted-foreground mb-4">运行安全评估以获取详细报告和改进建议</p>
              <Button onClick={runAssessment}>开始评估</Button>
            </div>
          ) : (
            <>
              <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
                <TabsList className="grid grid-cols-5 h-auto">
                  <TabsTrigger value="all">全部</TabsTrigger>
                  {results.map((result) => (
                    <TabsTrigger key={result.category} value={result.category}>
                      {result.category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="space-y-6">
                {filteredResults.map((result) => (
                  <Card key={result.category}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>{result.category}</CardTitle>
                        <div className={`text-xl font-bold ${getScoreColor(result.score)}`}>{result.score}/100</div>
                      </div>
                      <Progress value={result.score} className={`h-2 mt-1 ${getProgressColor(result.score)}`} />
                    </CardHeader>
                    <CardContent>
                      {result.issues.length > 0 ? (
                        <div className="space-y-4">
                          <h3 className="font-medium">发现的问题</h3>
                          <div className="space-y-3">
                            {result.issues.map((issue) => (
                              <div key={issue.id} className="p-3 border rounded-md">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <Badge
                                      variant="outline"
                                      className={`mr-2 flex items-center space-x-1 ${getSeverityColor(issue.severity)}`}
                                    >
                                      {getSeverityIcon(issue.severity)}
                                      <span className="ml-1">
                                        {issue.severity === "critical"
                                          ? "严重"
                                          : issue.severity === "high"
                                            ? "高风险"
                                            : issue.severity === "medium"
                                              ? "中风险"
                                              : "低风险"}
                                      </span>
                                    </Badge>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Share2 className="h-3 w-3 mr-1" />
                                    修复
                                  </Button>
                                </div>
                                <p className="font-medium mb-1">{issue.description}</p>
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">建议解决方案:</span> {issue.solution}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center p-3 bg-green-50 rounded-md border border-green-100">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                          <p className="text-green-700">没有发现问题</p>
                        </div>
                      )}

                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">改进建议</h3>
                          <Button variant="ghost" size="sm" onClick={() => toggleRecommendations(result.category)}>
                            {showRecommendations[result.category] ? "收起" : "展开"}
                          </Button>
                        </div>
                        {showRecommendations[result.category] && (
                          <ul className="space-y-1 list-disc pl-5 mt-2">
                            {result.recommendations.map((recommendation, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                {recommendation}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
