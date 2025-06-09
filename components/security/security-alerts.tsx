"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSecurityAlerts, markAlertAsRead } from "@/lib/security-manager"
import type { SecurityAlert } from "@/types/security"
import { Bell, BellRing, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react"

interface SecurityAlertsProps {
  limit?: number
}

export function SecurityAlerts({ limit }: SecurityAlertsProps) {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadedAlerts = getSecurityAlerts()
    setAlerts(loadedAlerts)
    setLoading(false)
  }, [])

  const handleMarkAsRead = (id: string) => {
    const updatedAlerts = markAlertAsRead(id)
    setAlerts(updatedAlerts)
  }

  const displayAlerts = limit ? alerts.slice(0, limit) : alerts
  const unreadCount = alerts.filter((alert) => !alert.read).length

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "今天"
    } else if (diffDays === 1) {
      return "昨天"
    } else if (diffDays < 7) {
      return `${diffDays}天前`
    } else {
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle>安全提醒</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} 未读
              </Badge>
            )}
          </div>
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-yellow-500" />
          ) : (
            <Bell className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <CardDescription>重要的安全通知和提醒</CardDescription>
      </CardHeader>
      <CardContent className="pb-1">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayAlerts.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium">没有安全提醒</h3>
            <p className="text-muted-foreground mt-2">您的系统目前没有需要注意的安全问题</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start space-x-4 p-3 rounded-lg ${!alert.read ? "bg-muted/50" : ""}`}
              >
                <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${!alert.read ? "font-semibold" : ""}`}>{alert.message}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(alert.date)}</span>
                  </div>
                  {alert.action && !alert.read && (
                    <div className="mt-2">
                      <Button size="sm" variant="outline">
                        {alert.action}
                      </Button>
                    </div>
                  )}
                  {!alert.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs mt-1"
                      onClick={() => handleMarkAsRead(alert.id)}
                    >
                      标记为已读
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {!limit && alerts.length > 0 && (
        <CardFooter className="pt-3">
          <Button variant="outline" size="sm" className="w-full">
            全部标记为已读
          </Button>
        </CardFooter>
      )}
      {limit && alerts.length > limit && (
        <CardFooter className="pt-3">
          <Button variant="ghost" size="sm" className="w-full">
            查看全部 ({alerts.length})
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
