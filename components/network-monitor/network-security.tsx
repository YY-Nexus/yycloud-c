"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { AlertTriangle, Shield, ShieldCheck, ShieldAlert, RefreshCw, Filter } from "lucide-react"
import type { NetworkSecurityEvent } from "@/types/network-monitor"
import { generateSecurityEvents } from "@/lib/network-monitor"

interface NetworkSecurityProps {
  initialEvents?: NetworkSecurityEvent[]
}

export function NetworkSecurity({ initialEvents }: NetworkSecurityProps) {
  const [events, setEvents] = useState<NetworkSecurityEvent[]>(initialEvents || [])
  const [loading, setLoading] = useState<boolean>(!initialEvents)
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all")
  const [typeFilter, setTypeFilter] = useState<"all" | NetworkSecurityEvent["type"]>("all")
  const [view, setView] = useState<"all" | "unresolved">("all")

  // 加载安全事件
  const loadSecurityEvents = async () => {
    setLoading(true)
    try {
      const data = generateSecurityEvents(20)
      setEvents(data)
    } catch (error) {
      console.error("加载安全事件失败:", error)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    if (!initialEvents) {
      loadSecurityEvents()
    }
  }, [initialEvents])

  // 过滤事件
  const filteredEvents = events.filter((event) => {
    if (filter !== "all" && event.severity !== filter) return false
    if (typeFilter !== "all" && event.type !== typeFilter) return false
    if (view === "unresolved" && event.resolved) return false
    return true
  })

  // 获取事件类型标签
  const getEventTypeLabel = (type: NetworkSecurityEvent["type"]) => {
    switch (type) {
      case "intrusion":
        return "入侵尝试"
      case "malware":
        return "恶意软件"
      case "phishing":
        return "钓鱼攻击"
      case "vulnerabilityScan":
        return "漏洞扫描"
      case "unauthorized":
        return "未授权访问"
      case "other":
        return "其他"
    }
  }

  // 获取事件严重性标签和颜色
  const getSeverityBadge = (severity: NetworkSecurityEvent["severity"]) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">严重</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">高风险</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">中风险</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">低风险</Badge>
    }
  }

  // 获取事件图标
  const getEventIcon = (type: NetworkSecurityEvent["type"], severity: NetworkSecurityEvent["severity"]) => {
    const iconProps = { className: "h-5 w-5", strokeWidth: 1.5 }

    if (severity === "critical" || severity === "high") {
      return <ShieldAlert {...iconProps} className="text-red-500" />
    }

    switch (type) {
      case "intrusion":
        return <Shield {...iconProps} className="text-orange-500" />
      case "malware":
        return <AlertTriangle {...iconProps} className="text-orange-500" />
      case "phishing":
        return <AlertTriangle {...iconProps} className="text-yellow-500" />
      case "vulnerabilityScan":
        return <Shield {...iconProps} className="text-yellow-500" />
      case "unauthorized":
        return <Shield {...iconProps} className="text-blue-500" />
      default:
        return <ShieldCheck {...iconProps} className="text-blue-500" />
    }
  }

  // 获取安全统计数据
  const getSecurityStats = () => {
    const total = events.length
    const critical = events.filter((e) => e.severity === "critical").length
    const high = events.filter((e) => e.severity === "high").length
    const medium = events.filter((e) => e.severity === "medium").length
    const low = events.filter((e) => e.severity === "low").length
    const resolved = events.filter((e) => e.resolved).length
    const unresolved = total - resolved

    return { total, critical, high, medium, low, resolved, unresolved }
  }

  const stats = getSecurityStats()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>网络安全监控</CardTitle>
          <CardDescription>监控网络安全事件和威胁</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={loadSecurityEvents} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          刷新
        </Button>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center justify-center text-center">
                    <ShieldAlert className="h-8 w-8 text-red-500 mb-2" />
                    <div className="text-sm font-medium">严重/高风险</div>
                    <div className="text-2xl font-bold">{stats.critical + stats.high}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Shield className="h-8 w-8 text-yellow-500 mb-2" />
                    <div className="text-sm font-medium">中/低风险</div>
                    <div className="text-2xl font-bold">{stats.medium + stats.low}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center justify-center text-center">
                    <AlertTriangle className="h-8 w-8 text-orange-500 mb-2" />
                    <div className="text-sm font-medium">未解决</div>
                    <div className="text-2xl font-bold">{stats.unresolved}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center justify-center text-center">
                    <ShieldCheck className="h-8 w-8 text-green-500 mb-2" />
                    <div className="text-sm font-medium">已解决</div>
                    <div className="text-2xl font-bold">{stats.resolved}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Tabs value={view} onValueChange={(v) => setView(v as "all" | "unresolved")}>
                  <TabsList>
                    <TabsTrigger value="all">全部事件</TabsTrigger>
                    <TabsTrigger value="unresolved">未解决</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                  <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="严重性" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部严重性</SelectItem>
                      <SelectItem value="critical">严重</SelectItem>
                      <SelectItem value="high">高风险</SelectItem>
                      <SelectItem value="medium">中风险</SelectItem>
                      <SelectItem value="low">低风险</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="事件类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="intrusion">入侵尝试</SelectItem>
                      <SelectItem value="malware">恶意软件</SelectItem>
                      <SelectItem value="phishing">钓鱼攻击</SelectItem>
                      <SelectItem value="vulnerabilityScan">漏洞扫描</SelectItem>
                      <SelectItem value="unauthorized">未授权访问</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="icon" onClick={() => { setFilter("all"); setTypeFilter("all"); }}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border rounded-md">
                {filteredEvents.length > 0 ? (
                  <div className="divide-y">
                    {filteredEvents.map((event) => (
                      <div key={event.id} className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5">{getEventIcon(event.type, event.severity)}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{event.description}</div>
                              {getSeverityBadge(event.severity)}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {getEventTypeLabel(event.type)} • {format(event.timestamp, "yyyy-MM-dd HH:mm", { locale: zhCN })}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-sm">
                                {event.source && <span className="text-muted-foreground">来源: {event.source}</span>}
                                {event.target && (
                                  <span className="text-muted-foreground ml-4">目标: {event.target}</span>
                                )}
                              </div>
                              <Badge variant={event.resolved ? "outline" : "secondary"}>
                                {event.resolved ? "已解决" : "未解决"}
                              </Badge>
                            </div>
                            {event.actions && event.actions.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {event.actions.map((action, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {action}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">没有符合条件的安全事件</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">
              {loading ? "正在加载安全事件..." : "暂无安全事件数据，请点击"刷新"按钮"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
  \
}
