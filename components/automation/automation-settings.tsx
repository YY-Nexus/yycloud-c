"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Bell, Shield, Database, Mail, Webhook, Save } from "lucide-react"

export function AutomationSettings() {
  const [settings, setSettings] = useState({
    // 通用设置
    maxConcurrentWorkflows: 5,
    defaultTimeout: 300,
    retryAttempts: 3,
    enableLogging: true,
    logLevel: "info",

    // 通知设置
    enableNotifications: true,
    emailNotifications: true,
    webhookNotifications: false,
    notificationEmail: "admin@example.com",
    webhookUrl: "",

    // 安全设置
    requireApproval: false,
    allowExternalConnections: true,
    encryptLogs: true,
    sessionTimeout: 3600,

    // 存储设置
    maxLogRetention: 30,
    autoCleanup: true,
    backupEnabled: true,
    backupInterval: "daily",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = () => {
    // 保存设置逻辑
    console.log("保存设置:", settings)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">自动化设置</h2>
          <p className="text-muted-foreground">配置自动化系统的全局设置</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          保存设置
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">通用设置</TabsTrigger>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="storage">存储设置</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                执行设置
              </CardTitle>
              <CardDescription>配置工作流的执行参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="max-concurrent">最大并发工作流数</Label>
                  <Input
                    id="max-concurrent"
                    type="number"
                    value={settings.maxConcurrentWorkflows}
                    onChange={(e) => handleSettingChange("maxConcurrentWorkflows", Number.parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">同时运行的工作流最大数量</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-timeout">默认超时时间（秒）</Label>
                  <Input
                    id="default-timeout"
                    type="number"
                    value={settings.defaultTimeout}
                    onChange={(e) => handleSettingChange("defaultTimeout", Number.parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">工作流执行的默认超时时间</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retry-attempts">重试次数</Label>
                  <Input
                    id="retry-attempts"
                    type="number"
                    value={settings.retryAttempts}
                    onChange={(e) => handleSettingChange("retryAttempts", Number.parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">失败时的自动重试次数</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="log-level">日志级别</Label>
                  <Select value={settings.logLevel} onValueChange={(value) => handleSettingChange("logLevel", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">调试</SelectItem>
                      <SelectItem value="info">信息</SelectItem>
                      <SelectItem value="warn">警告</SelectItem>
                      <SelectItem value="error">错误</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>启用详细日志</Label>
                    <p className="text-sm text-muted-foreground">记录工作流执行的详细信息</p>
                  </div>
                  <Switch
                    checked={settings.enableLogging}
                    onCheckedChange={(checked) => handleSettingChange("enableLogging", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                通知配置
              </CardTitle>
              <CardDescription>设置工作流执行结果的通知方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>启用通知</Label>
                    <p className="text-sm text-muted-foreground">开启工作流执行结果通知</p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => handleSettingChange("enableNotifications", checked)}
                  />
                </div>

                {settings.enableNotifications && (
                  <>
                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            邮件通知
                          </Label>
                          <p className="text-sm text-muted-foreground">通过邮件发送执行结果</p>
                        </div>
                        <Switch
                          checked={settings.emailNotifications}
                          onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                        />
                      </div>

                      {settings.emailNotifications && (
                        <div className="space-y-2">
                          <Label htmlFor="notification-email">通知邮箱</Label>
                          <Input
                            id="notification-email"
                            type="email"
                            value={settings.notificationEmail}
                            onChange={(e) => handleSettingChange("notificationEmail", e.target.value)}
                            placeholder="输入接收通知的邮箱地址"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="flex items-center gap-2">
                            <Webhook className="h-4 w-4" />
                            Webhook通知
                          </Label>
                          <p className="text-sm text-muted-foreground">通过HTTP请求发送通知</p>
                        </div>
                        <Switch
                          checked={settings.webhookNotifications}
                          onCheckedChange={(checked) => handleSettingChange("webhookNotifications", checked)}
                        />
                      </div>

                      {settings.webhookNotifications && (
                        <div className="space-y-2">
                          <Label htmlFor="webhook-url">Webhook URL</Label>
                          <Input
                            id="webhook-url"
                            value={settings.webhookUrl}
                            onChange={(e) => handleSettingChange("webhookUrl", e.target.value)}
                            placeholder="https://your-webhook-url.com/notify"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                安全配置
              </CardTitle>
              <CardDescription>配置自动化系统的安全策略</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>需要审批</Label>
                    <p className="text-sm text-muted-foreground">工作流执行前需要管理员审批</p>
                  </div>
                  <Switch
                    checked={settings.requireApproval}
                    onCheckedChange={(checked) => handleSettingChange("requireApproval", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>允许外部连接</Label>
                    <p className="text-sm text-muted-foreground">允许工作流连接外部服务</p>
                  </div>
                  <Switch
                    checked={settings.allowExternalConnections}
                    onCheckedChange={(checked) => handleSettingChange("allowExternalConnections", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>加密日志</Label>
                    <p className="text-sm text-muted-foreground">对敏感日志信息进行加密存储</p>
                  </div>
                  <Switch
                    checked={settings.encryptLogs}
                    onCheckedChange={(checked) => handleSettingChange("encryptLogs", checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">会话超时时间（秒）</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange("sessionTimeout", Number.parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">用户会话的超时时间</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                存储配置
              </CardTitle>
              <CardDescription>管理日志和数据的存储策略</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="log-retention">日志保留天数</Label>
                  <Input
                    id="log-retention"
                    type="number"
                    value={settings.maxLogRetention}
                    onChange={(e) => handleSettingChange("maxLogRetention", Number.parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">执行日志的最大保留天数</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>自动清理</Label>
                    <p className="text-sm text-muted-foreground">自动清理过期的日志和临时文件</p>
                  </div>
                  <Switch
                    checked={settings.autoCleanup}
                    onCheckedChange={(checked) => handleSettingChange("autoCleanup", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>启用备份</Label>
                    <p className="text-sm text-muted-foreground">定期备份工作流配置和数据</p>
                  </div>
                  <Switch
                    checked={settings.backupEnabled}
                    onCheckedChange={(checked) => handleSettingChange("backupEnabled", checked)}
                  />
                </div>

                {settings.backupEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="backup-interval">备份频率</Label>
                    <Select
                      value={settings.backupInterval}
                      onValueChange={(value) => handleSettingChange("backupInterval", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">每小时</SelectItem>
                        <SelectItem value="daily">每日</SelectItem>
                        <SelectItem value="weekly">每周</SelectItem>
                        <SelectItem value="monthly">每月</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
