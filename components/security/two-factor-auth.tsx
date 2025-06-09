"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Smartphone,
  Mail,
  Key,
  QrCode,
  Copy,
  Check,
  AlertTriangle,
  Plus,
  Trash2,
  RefreshCw,
  Monitor,
  Tablet,
  Phone,
  Clock,
  MapPin,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  getTwoFactorMethods,
  getTwoFactorSettings,
  setupTwoFactorAuth,
  addTwoFactorMethod,
  updateTwoFactorMethod,
  removeTwoFactorMethod,
  updateTwoFactorSettings,
  verifyTwoFactorCode,
  getTrustedDevices,
  addTrustedDevice,
  removeTrustedDevice,
  getCurrentDeviceInfo,
} from "@/lib/two-factor-auth"
import type { TwoFactorAuthMethod, TwoFactorSetup, TrustedDevice } from "@/types/two-factor-auth"

export function TwoFactorAuth() {
  const [methods, setMethods] = useState<TwoFactorAuthMethod[]>([])
  const [settings, setSettings] = useState(getTwoFactorSettings())
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>([])
  const [setupData, setSetupData] = useState<TwoFactorSetup | null>(null)
  const [isSetupOpen, setIsSetupOpen] = useState(false)
  const [setupStep, setSetupStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const [activeTab, setActiveTab] = useState("methods")

  useEffect(() => {
    setMethods(getTwoFactorMethods())
    setTrustedDevices(getTrustedDevices())
  }, [])

  const handleSetupTOTP = () => {
    const setup = setupTwoFactorAuth()
    setSetupData(setup)
    setSetupStep(1)
    setIsSetupOpen(true)
  }

  const handleVerifySetup = async () => {
    if (!setupData || !verificationCode) return

    setIsVerifying(true)
    try {
      const isValid = verifyTwoFactorCode(verificationCode, "temp-totp")

      if (isValid) {
        // 添加TOTP方法
        const newMethods = addTwoFactorMethod({
          type: "totp",
          name: "身份验证器应用",
          enabled: true,
          primary: methods.length === 0,
          metadata: {
            secretKey: setupData.secretKey,
            qrCode: setupData.qrCode,
            backupCodes: setupData.backupCodes,
          },
        })
        setMethods(newMethods)

        // 启用双因素认证
        const newSettings = updateTwoFactorSettings({
          enabled: true,
          backupCodesRemaining: setupData.backupCodes.length,
        })
        setSettings(newSettings)

        setSetupStep(3)
        toast({
          title: "设置成功",
          description: "双因素认证已成功启用",
        })
      } else {
        toast({
          title: "验证失败",
          description: "验证码不正确，请重试",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "验证失败",
        description: "验证过程中出现错误",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates({ ...copiedStates, [key]: true })
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [key]: false })
      }, 2000)
      toast({
        title: "已复制",
        description: "内容已复制到剪贴板",
      })
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      })
    }
  }

  const handleToggleMethod = (id: string, enabled: boolean) => {
    const updatedMethods = updateTwoFactorMethod(id, { enabled })
    setMethods(updatedMethods)

    toast({
      title: enabled ? "已启用" : "已禁用",
      description: `双因素认证方法已${enabled ? "启用" : "禁用"}`,
    })
  }

  const handleRemoveMethod = (id: string) => {
    const updatedMethods = removeTwoFactorMethod(id)
    setMethods(updatedMethods)

    toast({
      title: "已移除",
      description: "双因素认证方法已移除",
    })
  }

  const handleToggleSetting = (key: keyof typeof settings, value: boolean) => {
    const newSettings = updateTwoFactorSettings({ [key]: value })
    setSettings(newSettings)

    toast({
      title: "设置已更新",
      description: "双因素认证设置已保存",
    })
  }

  const handleAddTrustedDevice = () => {
    const deviceInfo = getCurrentDeviceInfo()
    const newDevices = addTrustedDevice({
      name: deviceInfo.name || "当前设备",
      deviceType: deviceInfo.deviceType || "desktop",
      browser: deviceInfo.browser || "Unknown",
      os: deviceInfo.os || "Unknown",
      ipAddress: "127.0.0.1", // 实际应用中获取真实IP
      trusted: true,
    })
    setTrustedDevices(newDevices)

    toast({
      title: "设备已添加",
      description: "当前设备已添加到受信任设备列表",
    })
  }

  const handleRemoveTrustedDevice = (id: string) => {
    const updatedDevices = removeTrustedDevice(id)
    setTrustedDevices(updatedDevices)

    toast({
      title: "设备已移除",
      description: "设备已从受信任列表中移除",
    })
  }

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "totp":
        return <Smartphone className="h-4 w-4" />
      case "sms":
        return <Phone className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "backup":
        return <Key className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Phone className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const enabledMethods = methods.filter((method) => method.enabled)
  const securityScore = Math.min(100, enabledMethods.length * 25 + (settings.enabled ? 25 : 0))

  return (
    <div className="space-y-6">
      {/* 安全状态概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>双因素认证状态</span>
          </CardTitle>
          <CardDescription>保护您的账户免受未授权访问</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">安全评分</span>
                <span
                  className={`text-sm font-bold ${securityScore >= 75 ? "text-green-600" : securityScore >= 50 ? "text-yellow-600" : "text-red-600"}`}
                >
                  {securityScore}/100
                </span>
              </div>
              <Progress value={securityScore} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">启用状态</div>
              <Badge variant={settings.enabled ? "default" : "secondary"}>
                {settings.enabled ? "已启用" : "未启用"}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">认证方法</div>
              <div className="text-sm text-muted-foreground">{enabledMethods.length} 个已启用</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="methods">认证方法</TabsTrigger>
          <TabsTrigger value="settings">安全设置</TabsTrigger>
          <TabsTrigger value="devices">受信任设备</TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>认证方法</CardTitle>
                  <CardDescription>管理您的双因素认证方法</CardDescription>
                </div>
                <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleSetupTOTP}>
                      <Plus className="mr-2 h-4 w-4" />
                      添加方法
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>设置身份验证器</DialogTitle>
                      <DialogDescription>使用身份验证器应用扫描二维码或手动输入密钥</DialogDescription>
                    </DialogHeader>

                    {setupStep === 1 && setupData && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="bg-white p-4 rounded-lg border inline-block">
                            <QrCode className="h-32 w-32 mx-auto" />
                            <div className="text-xs text-muted-foreground mt-2">扫描此二维码</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>手动输入密钥</Label>
                          <div className="flex items-center space-x-2">
                            <Input value={setupData.manualEntryKey} readOnly className="font-mono text-sm" />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(setupData.secretKey, "secret")}
                            >
                              {copiedStates.secret ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <Button onClick={() => setSetupStep(2)} className="w-full">
                          下一步：验证设置
                        </Button>
                      </div>
                    )}

                    {setupStep === 2 && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                          <h3 className="font-medium">验证您的设置</h3>
                          <p className="text-sm text-muted-foreground">请输入身份验证器应用中显示的6位数字代码</p>
                        </div>

                        <div className="space-y-2">
                          <Label>验证码</Label>
                          <Input
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="输入6位验证码"
                            maxLength={6}
                            className="text-center text-lg tracking-widest"
                          />
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" onClick={() => setSetupStep(1)} className="flex-1">
                            返回
                          </Button>
                          <Button
                            onClick={handleVerifySetup}
                            disabled={verificationCode.length !== 6 || isVerifying}
                            className="flex-1"
                          >
                            {isVerifying ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                            验证
                          </Button>
                        </div>
                      </div>
                    )}

                    {setupStep === 3 && setupData && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
                          <h3 className="font-medium">设置完成！</h3>
                          <p className="text-sm text-muted-foreground">双因素认证已成功启用</p>
                        </div>

                        <Alert>
                          <Key className="h-4 w-4" />
                          <AlertDescription>
                            请保存以下备用恢复码，当您无法使用身份验证器时可以使用这些代码登录。
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>备用恢复码</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(setupData.backupCodes.join("\n"), "backup")}
                            >
                              {copiedStates.backup ? (
                                <Check className="mr-2 h-4 w-4" />
                              ) : (
                                <Copy className="mr-2 h-4 w-4" />
                              )}
                              复制全部
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded-lg font-mono text-sm">
                            {setupData.backupCodes.map((code, index) => (
                              <div key={index} className="text-center">
                                {code}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          onClick={() => {
                            setIsSetupOpen(false)
                            setSetupStep(1)
                            setVerificationCode("")
                            setSetupData(null)
                          }}
                          className="w-full"
                        >
                          完成
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {methods.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">尚未设置双因素认证</h3>
                  <p className="text-sm text-muted-foreground mb-4">添加双因素认证方法以提高账户安全性</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {methods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-md ${method.enabled ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                        >
                          {getMethodIcon(method.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{method.name}</span>
                            {method.primary && (
                              <Badge variant="outline" className="text-xs">
                                主要
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            设置于 {new Date(method.setupDate).toLocaleDateString("zh-CN")}
                            {method.lastUsed && (
                              <span> • 最后使用 {new Date(method.lastUsed).toLocaleDateString("zh-CN")}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={method.enabled}
                          onCheckedChange={(checked) => handleToggleMethod(method.id, checked)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMethod(method.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>安全设置</CardTitle>
              <CardDescription>配置双因素认证的安全策略</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>启用双因素认证</Label>
                  <p className="text-sm text-muted-foreground">为您的账户启用额外的安全保护</p>
                </div>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={(checked) => handleToggleSetting("enabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>登录时要求验证</Label>
                  <p className="text-sm text-muted-foreground">每次登录时都需要提供双因素认证代码</p>
                </div>
                <Switch
                  checked={settings.requireForLogin}
                  onCheckedChange={(checked) => handleToggleSetting("requireForLogin", checked)}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>敏感操作时要求验证</Label>
                  <p className="text-sm text-muted-foreground">执行敏感操作（如更改密码）时需要验证</p>
                </div>
                <Switch
                  checked={settings.requireForSensitiveActions}
                  onCheckedChange={(checked) => handleToggleSetting("requireForSensitiveActions", checked)}
                  disabled={!settings.enabled}
                />
              </div>

              {settings.backupCodesRemaining > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">
                      剩余 {settings.backupCodesRemaining} 个备用恢复码
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">当备用码用完时，请重新生成新的恢复码</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>受信任设备</CardTitle>
                  <CardDescription>管理不需要双因素认证的设备</CardDescription>
                </div>
                <Button onClick={handleAddTrustedDevice}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加当前设备
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {trustedDevices.length === 0 ? (
                <div className="text-center py-8">
                  <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">没有受信任设备</h3>
                  <p className="text-sm text-muted-foreground mb-4">添加受信任设备以跳过双因素认证</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {trustedDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-md bg-blue-100 text-blue-600">
                          {getDeviceIcon(device.deviceType)}
                        </div>
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {device.browser} • {device.os}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>添加于 {new Date(device.addedDate).toLocaleDateString("zh-CN")}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{device.ipAddress}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={device.trusted ? "default" : "secondary"}>
                          {device.trusted ? "受信任" : "未验证"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTrustedDevice(device.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
