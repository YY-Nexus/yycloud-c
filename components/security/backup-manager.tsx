"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getBackupInfo } from "@/lib/security-manager"
import type { BackupInfo } from "@/types/security"
import { Database, Plus, CloudUpload, HardDrive, RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react"

export function BackupManager() {
  const [backups, setBackups] = useState<BackupInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const backupInfo = getBackupInfo()
    setBackups(backupInfo)
    setLoading(false)
  }, [])

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            正常
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            等待中
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            失败
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getLocationIcon = (location: string) => {
    return location === "cloud" ? (
      <CloudUpload className="h-4 w-4 text-blue-500" />
    ) : (
      <HardDrive className="h-4 w-4 text-slate-500" />
    )
  }

  const getBackupTypeLabel = (type: string) => {
    return type === "full" ? "完整备份" : "增量备份"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">数据备份管理</CardTitle>
            <CardDescription>管理您的数据备份和恢复选项</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新状态
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              新建备份
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-muted rounded"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">没有备份记录</h3>
              <p className="text-muted-foreground mb-4">创建您的第一个数据备份以保护重要信息</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新建备份
              </Button>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>备份名称</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>位置</TableHead>
                    <TableHead>大小</TableHead>
                    <TableHead>最后备份时间</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-medium">{backup.name}</TableCell>
                      <TableCell>{getBackupTypeLabel(backup.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getLocationIcon(backup.location)}
                          <span>{backup.location === "cloud" ? "云端" : "本地"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell>{formatDate(backup.lastBackup)}</TableCell>
                      <TableCell>{getStatusBadge(backup.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          操作
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>备份策略</CardTitle>
            <CardDescription>配置自动备份计划和策略</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">自动备份频率</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    每天
                  </Button>
                  <Button variant="outline" className="flex-1">
                    每周
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    每月
                  </Button>
                  <Button variant="outline" className="flex-1">
                    自定义
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">备份类型</h3>
                <div className="flex space-x-2">
                  <Button variant="secondary" className="flex-1">
                    完整备份
                  </Button>
                  <Button variant="outline" className="flex-1">
                    增量备份
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">备份位置</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <HardDrive className="h-4 w-4 mr-2" />
                    本地
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    <CloudUpload className="h-4 w-4 mr-2" />
                    云端
                  </Button>
                </div>
              </div>

              <Button className="w-full mt-4">保存备份策略</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>数据恢复</CardTitle>
            <CardDescription>从备份中恢复您的数据</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium mb-2">恢复说明</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      1
                    </span>
                    <span>选择要恢复的备份</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      2
                    </span>
                    <span>选择恢复位置（原位置或新位置）</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      3
                    </span>
                    <span>开始恢复过程</span>
                  </li>
                </ul>
              </div>

              <Button variant="outline" className="w-full">
                开始数据恢复
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
