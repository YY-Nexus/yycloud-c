"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Clock, User, FileText, AlertCircle, CheckCircle, Edit, Trash, TagIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getDeviceHistory } from "@/lib/history-management-service"
import type { DeviceHistoryEntry, ChangeType } from "@/types/device-management"

interface DeviceHistoryProps {
  deviceId: number
}

const getChangeTypeIcon = (changeType: ChangeType) => {
  switch (changeType) {
    case "创建":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "更新":
      return <Edit className="h-4 w-4 text-blue-500" />
    case "删除":
      return <Trash className="h-4 w-4 text-red-500" />
    case "状态变更":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    case "位置变更":
      return <FileText className="h-4 w-4 text-purple-500" />
    case "标签变更":
      return <TagIcon className="h-4 w-4 text-pink-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getChangeTypeBadgeColor = (changeType: ChangeType) => {
  switch (changeType) {
    case "创建":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "更新":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case "删除":
      return "bg-red-100 text-red-800 hover:bg-red-200"
    case "状态变更":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "位置变更":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200"
    case "标签变更":
      return "bg-pink-100 text-pink-800 hover:bg-pink-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

export function DeviceHistory({ deviceId }: DeviceHistoryProps) {
  const [history, setHistory] = useState<DeviceHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await getDeviceHistory(deviceId)
        setHistory(historyData)
      } catch (err: any) {
        setError(err.message || "获取历史记录失败")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [deviceId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>设备历史记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">正在加载历史记录...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>设备历史记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">错误: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>设备历史记录</CardTitle>
        <CardDescription>设备的所有变更和操作记录</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">暂无历史记录</div>
        ) : (
          <div className="space-y-4">
            {history.map((entry, index) => (
              <div key={entry.id}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">{getChangeTypeIcon(entry.changeType)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getChangeTypeBadgeColor(entry.changeType)}>{entry.changeType}</Badge>
                        {entry.field && <span className="text-sm text-muted-foreground">字段: {entry.field}</span>}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        {entry.userName && (
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{entry.userName}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {format(new Date(entry.timestamp), "yyyy年MM月dd日 HH:mm", {
                              locale: zhCN,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-900">{entry.description}</p>
                    {entry.oldValue && entry.newValue && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span className="line-through">{entry.oldValue}</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">{entry.newValue}</span>
                      </div>
                    )}
                  </div>
                </div>
                {index < history.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
