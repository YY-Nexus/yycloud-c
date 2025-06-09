"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getSecurityStatus } from "@/lib/security-manager"
import type { SecurityStatus } from "@/types/security"
import { Key, Database, Eye, Laptop } from "lucide-react"

export function SecurityStatusCards() {
  const [status, setStatus] = useState<SecurityStatus | null>(null)

  useEffect(() => {
    const securityStatus = getSecurityStatus()
    setStatus(securityStatus)
  }, [])

  if (!status) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24 mb-2"></div>
              <div className="h-6 bg-muted rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="h-2 bg-muted rounded w-full mt-4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>总体安全评分</CardDescription>
          <CardTitle className={`text-2xl font-bold ${getScoreColor(status.overallScore)}`}>
            {status.overallScore}/100
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={status.overallScore} className={`h-2 ${getProgressColor(status.overallScore)}`} />
          <p className="text-xs text-muted-foreground mt-2">上次扫描: {formatDate(status.lastScan)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardDescription>密码健康度</CardDescription>
            <CardTitle className={`text-2xl font-bold ${getScoreColor(status.passwordHealth)}`}>
              {status.passwordHealth}/100
            </CardTitle>
          </div>
          <Key className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Progress value={status.passwordHealth} className={`h-2 ${getProgressColor(status.passwordHealth)}`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardDescription>数据备份</CardDescription>
            <CardTitle className={`text-2xl font-bold ${getScoreColor(status.dataBackup)}`}>
              {status.dataBackup}/100
            </CardTitle>
          </div>
          <Database className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Progress value={status.dataBackup} className={`h-2 ${getProgressColor(status.dataBackup)}`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardDescription>隐私保护</CardDescription>
            <CardTitle className={`text-2xl font-bold ${getScoreColor(status.privacyScore)}`}>
              {status.privacyScore}/100
            </CardTitle>
          </div>
          <Eye className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Progress value={status.privacyScore} className={`h-2 ${getProgressColor(status.privacyScore)}`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardDescription>设备安全</CardDescription>
            <CardTitle className={`text-2xl font-bold ${getScoreColor(status.deviceSecurity)}`}>
              {status.deviceSecurity}/100
            </CardTitle>
          </div>
          <Laptop className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Progress value={status.deviceSecurity} className={`h-2 ${getProgressColor(status.deviceSecurity)}`} />
        </CardContent>
      </Card>
    </div>
  )
}
