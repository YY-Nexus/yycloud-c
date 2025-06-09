"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { RefreshCw, Download, FileText, Plus } from "lucide-react"
import type { NetworkConfigBackup } from "@/types/network-monitor"
import { generateConfigBackups } from "@/lib/network-monitor"

interface ConfigManagerProps {
  initialBackups?: NetworkConfigBackup[]
}

export function ConfigManager({ initialBackups }: ConfigManagerProps) {
  const [backups, setBackups] = useState<NetworkConfigBackup[]>(initialBackups || [])
  const [loading, setLoading] = useState<boolean>(!initialBackups)
  const [selectedBackup, setSelectedBackup] = useState<NetworkConfigBackup | null>(null)
  const [showBackupDialog, setShowBackupDialog] = useState<boolean>(false)

  // 加载配置备份
  const loadConfigBackups = async () => {
    setLoading(true)
    try {
      const data = generateConfigBackups(10)
      setBackups(data)
    } catch (error) {
      console.error("加载配置备份失败:", error)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    if (!initialBackups) {
      loadConfigBackups()
    }
  }, [initialBackups])

  // 查看备份内容
  const viewBackup = (backup: NetworkConfigBackup) => {
    setSelectedBackup(backup)
    setShowBackupDialog(true)
  }

  // 下载备份
  const downloadBackup = (backup: NetworkConfigBackup) => {
    const blob = new Blob([backup.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${backup.deviceName}_${format(backup.timestamp, "yyyyMMdd_HHmmss", { locale: zhCN })}.conf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 获取配置类型标签
  const getConfigTypeLabel = (type: string) => {
    switch (type) {
      case "router":
        return "路由器"
      case "switch":
        return "交换机"
      case "firewall":
        return "防火墙"
      default:
        return "其他"
    }
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    else return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>网络配置管理</CardTitle>
          <CardDescription>管理网络设备配置备份</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadConfigBackups} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            刷新
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            新建备份
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {backups.length > 0 ? (
          <div className="border rounded-md divide-y">
            {backups.map((backup) => (
              <div key={backup.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <div className="font-medium">{backup.deviceName}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(backup.timestamp, "yyyy-MM-dd HH:mm", { locale: zhCN })} • {formatFileSize(backup.size)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{getConfigTypeLabel(backup.configType)}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => viewBackup(backup)}>
                      查看
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => downloadBackup(backup)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {backup.description && <div className="text-sm mt-2">{backup.description}</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">
              {loading ? "正在加载配置备份..." : "暂无配置备份数据，请点击“刷新”按钮"}
            </p>
          </div>
        )}

        {/* 备份内容对话框 */}
        <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>配置备份详情</DialogTitle>
              <DialogDescription>
                {selectedBackup?.deviceName} •{" "}
                {selectedBackup && format(selectedBackup.timestamp, "yyyy-MM-dd HH:mm", { locale: zhCN })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{selectedBackup && getConfigTypeLabel(selectedBackup.configType)}</Badge>
                <Button variant="outline" size="sm" onClick={() => selectedBackup && downloadBackup(selectedBackup)}>
                  <Download className="h-4 w-4 mr-2" />
                  下载配置
                </Button>
              </div>
              <div className="border rounded-md p-4 bg-muted/50 font-mono text-sm overflow-auto max-h-[400px] whitespace-pre">
                {selectedBackup?.content}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
