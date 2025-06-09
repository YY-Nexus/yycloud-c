/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产提醒组件
 * ==========================================
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Bell, Calendar, AlertTriangle, Clock, Settings } from "lucide-react"
import { format, addDays } from "date-fns"
import { zhCN } from "date-fns/locale"
import type { Asset } from "@/types/asset"
import { YYGetAssets, YYGetWarrantyStatus } from "@/lib/asset-manager"
import { toast } from "@/hooks/use-toast"

// 提醒设置类型
interface ReminderSettings {
  warrantyEnabled: boolean
  warrantyDays: number
  maintenanceEnabled: boolean
  maintenanceDays: number
  ageEnabled: boolean
  ageDays: number
  notificationTime: string
  emailEnabled: boolean
  emailAddress: string
}

// 提醒项类型
interface ReminderItem {
  id: string
  assetId: string
  assetName: string
  type: "warranty" | "maintenance" | "age"
  dueDate: Date
  message: string
  priority: "high" | "medium" | "low"
}

export function AssetReminders() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [reminders, setReminders] = useState<ReminderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<ReminderSettings>({
    warrantyEnabled: true,
    warrantyDays: 30,
    maintenanceEnabled: true,
    maintenanceDays: 180,
    ageEnabled: true,
    ageDays: 365,
    notificationTime: "09:00",
    emailEnabled: false,
    emailAddress: "",
  })

  // 加载资产数据
  useEffect(() => {
    const loadAssets = async () => {
      setIsLoading(true)
      try {
        const allAssets = await YYGetAssets()
        setAssets(allAssets)

        // 加载本地存储的设置
        const savedSettings = localStorage.getItem("yanyu:asset-reminder-settings")
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings))
        }

        // 生成提醒
        generateReminders(allAssets)
      } catch (error) {
        console.error("加载资产数据失败:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAssets()
  }, [])

  // 保存设置
  useEffect(() => {
    localStorage.setItem("yanyu:asset-reminder-settings", JSON.stringify(settings))
    // 重新生成提醒
    generateReminders(assets)
  }, [settings])

  // 生成提醒
  const generateReminders = (assetList: Asset[]) => {
    const now = new Date()
    const newReminders: ReminderItem[] = []

    assetList.forEach((asset) => {
      // 保修到期提醒
      if (settings.warrantyEnabled && asset.warrantyExpiry) {
        const warrantyStatus = YYGetWarrantyStatus(asset)
        if (warrantyStatus === "expiring" || warrantyStatus === "expired") {
          const daysToExpiry = Math.ceil(
            (new Date(asset.warrantyExpiry).getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          )

          if (daysToExpiry <= settings.warrantyDays) {
            newReminders.push({
              id: `warranty-${asset.id}`,
              assetId: asset.id,
              assetName: asset.name,
              type: "warranty",
              dueDate: new Date(asset.warrantyExpiry),
              message:
                daysToExpiry <= 0 ? `${asset.name} 的保修已过期` : `${asset.name} 的保修将在 ${daysToExpiry} 天后过期`,
              priority: daysToExpiry <= 7 ? "high" : daysToExpiry <= 14 ? "medium" : "low",
            })
          }
        }
      }

      // 维护提醒
      if (settings.maintenanceEnabled && asset.maintenanceRecords && asset.maintenanceRecords.length > 0) {
        // 获取最近的维护记录
        const latestMaintenance = asset.maintenanceRecords.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )[0]

        // 计算下次维护日期（从上次维护后的X天）
        const nextMaintenanceDate = addDays(new Date(latestMaintenance.date), settings.maintenanceDays)
        const daysToMaintenance = Math.ceil((nextMaintenanceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysToMaintenance <= 30) {
          newReminders.push({
            id: `maintenance-${asset.id}`,
            assetId: asset.id,
            assetName: asset.name,
            type: "maintenance",
            dueDate: nextMaintenanceDate,
            message:
              daysToMaintenance <= 0
                ? `${asset.name} 需要进行维护了`
                : `${asset.name} 将在 ${daysToMaintenance} 天后需要维护`,
            priority: daysToMaintenance <= 7 ? "high" : daysToMaintenance <= 14 ? "medium" : "low",
          })
        }
      }

      // 设备年龄提醒
      if (settings.ageEnabled) {
        const ageInDays = Math.ceil((now.getTime() - new Date(asset.purchaseDate).getTime()) / (1000 * 60 * 60 * 24))

        if (ageInDays >= settings.ageDays) {
          const yearsOld = Math.floor(ageInDays / 365)
          newReminders.push({
            id: `age-${asset.id}`,
            assetId: asset.id,
            assetName: asset.name,
            type: "age",
            dueDate: addDays(new Date(asset.purchaseDate), ageInDays),
            message: `${asset.name} 已使用 ${yearsOld} 年，可能需要考虑更换`,
            priority: yearsOld >= 5 ? "high" : yearsOld >= 3 ? "medium" : "low",
          })
        }
      }
    })

    // 按优先级和日期排序
    newReminders.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

    setReminders(newReminders)
  }

  // 获取提醒类型图标
  const getReminderIcon = (type: string) => {
    switch (type) {
      case "warranty":
        return <AlertTriangle className="h-4 w-4" />
      case "maintenance":
        return <Clock className="h-4 w-4" />
      case "age":
        return <Calendar className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  // 获取提醒类型名称
  const getReminderTypeName = (type: string) => {
    switch (type) {
      case "warranty":
        return "保修到期"
      case "maintenance":
        return "定期维护"
      case "age":
        return "设备老化"
      default:
        return "其他提醒"
    }
  }

  // 获取优先级样式
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">高</Badge>
      case "medium":
        return <Badge variant="default">中</Badge>
      case "low":
        return <Badge variant="secondary">低</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  // 保存设置
  const saveSettings = () => {
    localStorage.setItem("yanyu:asset-reminder-settings", JSON.stringify(settings))
    toast({
      title: "设置已保存",
      description: "提醒设置已更新",
    })
    // 重新生成提醒
    generateReminders(assets)
  }

  // 测试通知
  const testNotification = () => {
    if (!("Notification" in window)) {
      toast({
        title: "通知不可用",
        description: "您的浏览器不支持桌面通知",
        variant: "destructive",
      })
      return
    }

    if (Notification.permission === "granted") {
      new Notification("言语云³ 资产提醒测试", {
        body: "这是一条测试通知，您的提醒系统工作正常",
        icon: "/favicon.ico",
      })
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("言语云³ 资产提醒测试", {
            body: "这是一条测试通知，您的提醒系统工作正常",
            icon: "/favicon.ico",
          })
        }
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>资产提醒</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">正在加载提醒数据...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>资产提醒</CardTitle>
        <Button variant="outline" size="sm" onClick={testNotification}>
          <Bell className="h-4 w-4 mr-2" />
          测试通知
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">
              <Bell className="h-4 w-4 mr-2" />
              活动提醒
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              <Calendar className="h-4 w-4 mr-2" />
              即将到期
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              提醒设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="pt-4">
            {reminders.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无活动提醒</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="mt-0.5">{getReminderIcon(reminder.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{reminder.assetName}</h4>
                        {getPriorityBadge(reminder.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">{reminder.message}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Badge variant="outline" className="mr-2">
                          {getReminderTypeName(reminder.type)}
                        </Badge>
                        <span>{format(new Date(reminder.dueDate), "PPP", { locale: zhCN })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="pt-4">
            <div className="space-y-4">
              {assets
                .filter((asset) => asset.warrantyExpiry)
                .sort(
                  (a, b) => new Date(a.warrantyExpiry as Date).getTime() - new Date(b.warrantyExpiry as Date).getTime(),
                )
                .slice(0, 5)
                .map((asset) => (
                  <div key={asset.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="mt-0.5">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{asset.name}</h4>
                        <Badge
                          variant={
                            YYGetWarrantyStatus(asset) === "expired"
                              ? "destructive"
                              : YYGetWarrantyStatus(asset) === "expiring"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {YYGetWarrantyStatus(asset) === "expired"
                            ? "已过期"
                            : YYGetWarrantyStatus(asset) === "expiring"
                              ? "即将过期"
                              : "保修中"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {asset.brand} {asset.model}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Badge variant="outline" className="mr-2">
                          保修到期
                        </Badge>
                        <span>{format(new Date(asset.warrantyExpiry as Date), "PPP", { locale: zhCN })}</span>
                      </div>
                    </div>
                  </div>
                ))}

              {assets.filter((asset) => asset.warrantyExpiry).length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">暂无即将到期的保修</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="pt-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">保修提醒</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="warranty-enabled">启用保修到期提醒</Label>
                  <Switch
                    id="warranty-enabled"
                    checked={settings.warrantyEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, warrantyEnabled: checked })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="warranty-days">提前提醒天数</Label>
                  <Input
                    id="warranty-days"
                    type="number"
                    min="1"
                    max="90"
                    value={settings.warrantyDays}
                    onChange={(e) => setSettings({ ...settings, warrantyDays: Number.parseInt(e.target.value) || 30 })}
                    className="w-20"
                    disabled={!settings.warrantyEnabled}
                  />
                  <span className="text-sm text-muted-foreground">天</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">维护提醒</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance-enabled">启用定期维护提醒</Label>
                  <Switch
                    id="maintenance-enabled"
                    checked={settings.maintenanceEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, maintenanceEnabled: checked })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="maintenance-days">维护周期</Label>
                  <Input
                    id="maintenance-days"
                    type="number"
                    min="30"
                    max="365"
                    value={settings.maintenanceDays}
                    onChange={(e) =>
                      setSettings({ ...settings, maintenanceDays: Number.parseInt(e.target.value) || 180 })
                    }
                    className="w-20"
                    disabled={!settings.maintenanceEnabled}
                  />
                  <span className="text-sm text-muted-foreground">天</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">设备老化提醒</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="age-enabled">启用设备老化提醒</Label>
                  <Switch
                    id="age-enabled"
                    checked={settings.ageEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, ageEnabled: checked })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="age-days">设备使用年限</Label>
                  <Input
                    id="age-days"
                    type="number"
                    min="365"
                    max="1825"
                    value={settings.ageDays}
                    onChange={(e) => setSettings({ ...settings, ageDays: Number.parseInt(e.target.value) || 365 })}
                    className="w-20"
                    disabled={!settings.ageEnabled}
                  />
                  <span className="text-sm text-muted-foreground">天</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">通知设置</h3>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="notification-time">每日通知时间</Label>
                  <Input
                    id="notification-time"
                    type="time"
                    value={settings.notificationTime}
                    onChange={(e) => setSettings({ ...settings, notificationTime: e.target.value })}
                    className="w-32"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-enabled">启用邮件通知</Label>
                  <Switch
                    id="email-enabled"
                    checked={settings.emailEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailEnabled: checked })}
                  />
                </div>
                {settings.emailEnabled && (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="email-address">邮箱地址</Label>
                    <Input
                      id="email-address"
                      type="email"
                      value={settings.emailAddress}
                      onChange={(e) => setSettings({ ...settings, emailAddress: e.target.value })}
                      className="flex-1"
                      placeholder="your@email.com"
                    />
                  </div>
                )}
              </div>

              <Button onClick={saveSettings} className="w-full">
                保存设置
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
