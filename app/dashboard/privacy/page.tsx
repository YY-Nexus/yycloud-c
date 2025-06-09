/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 隐私设置页面
 *
 * @module YYC/app
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

"use client"

import { useState, useEffect } from "react"
import { getPrivacySettings, savePrivacySettings, type PrivacySettings } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Shield, Eye, Activity, BarChart4, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PrivacySettingsPage() {
  const [settings, setSettings] = useState<PrivacySettings | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // 客户端加载设置
    setSettings(getPrivacySettings())
  }, [])

  const handleToggle = (key: keyof PrivacySettings) => {
    if (!settings) return

    setSettings((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [key]: !prev[key],
      }
    })
  }

  const handleSave = () => {
    if (!settings) return

    savePrivacySettings(settings)
    toast({
      title: "设置已保存",
      description: "您的隐私偏好设置已更新",
    })
  }

  const handleResetSettings = () => {
    const defaultSettings = {
      analyticsEnabled: false,
      performanceTracking: false,
      advertisingTracking: false,
      userProfilingEnabled: false,
    }

    setSettings(defaultSettings)
    savePrivacySettings(defaultSettings)

    toast({
      title: "设置已重置",
      description: "您的隐私设置已恢复为默认值",
    })
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">隐私设置</h1>
        <p className="text-muted-foreground">管理您的数据收集和隐私偏好</p>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="settings">隐私设置</TabsTrigger>
          <TabsTrigger value="data">数据管理</TabsTrigger>
          <TabsTrigger value="info">隐私政策</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                数据收集设置
              </CardTitle>
              <CardDescription>控制我们如何收集和使用您的数据</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base" htmlFor="analytics">
                      基础分析
                    </Label>
                    <p className="text-sm text-muted-foreground">收集匿名使用数据以改进我们的服务</p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={settings.analyticsEnabled}
                    onCheckedChange={() => handleToggle("analyticsEnabled")}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base" htmlFor="performance">
                      性能跟踪
                    </Label>
                    <p className="text-sm text-muted-foreground">监控应用性能和加载时间</p>
                  </div>
                  <Switch
                    id="performance"
                    checked={settings.performanceTracking}
                    onCheckedChange={() => handleToggle("performanceTracking")}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base" htmlFor="advertising">
                      广告跟踪
                    </Label>
                    <p className="text-sm text-muted-foreground">允许个性化广告和营销内容</p>
                  </div>
                  <Switch
                    id="advertising"
                    checked={settings.advertisingTracking}
                    onCheckedChange={() => handleToggle("advertisingTracking")}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base" htmlFor="profiling">
                      用户画像
                    </Label>
                    <p className="text-sm text-muted-foreground">创建用户行为和偏好的个性化档案</p>
                  </div>
                  <Switch
                    id="profiling"
                    checked={settings.userProfilingEnabled}
                    onCheckedChange={() => handleToggle("userProfilingEnabled")}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleResetSettings}>
                <RefreshCw className="mr-2 h-4 w-4" />
                重置设置
              </Button>
              <Button onClick={handleSave}>保存设置</Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  数据透明度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  我们致力于数据透明度，您可以随时查看我们收集的数据并要求删除。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  数据使用
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  您的数据仅用于改进我们的服务和提供个性化体验，不会出售给第三方。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart4 className="h-5 w-5" />
                  分析目的
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">我们使用分析数据来识别使用模式、解决问题并改进功能。</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>数据管理</CardTitle>
              <CardDescription>查看和管理我们存储的您的数据</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">数据导出</h3>
                <p className="text-sm text-muted-foreground">您可以导出我们收集的所有与您相关的数据副本。</p>
                <Button variant="outline">请求数据导出</Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">数据删除</h3>
                <p className="text-sm text-muted-foreground">您可以请求删除我们存储的所有与您相关的数据。</p>
                <Button variant="destructive">请求数据删除</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>隐私政策</CardTitle>
              <CardDescription>了解我们如何收集、使用和保护您的数据</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3>数据收集</h3>
              <p>我们收集以下类型的数据：</p>
              <ul>
                <li>使用数据：页面访问、功能使用和交互</li>
                <li>性能数据：加载时间、错误和应用性能</li>
                <li>设备数据：设备类型、浏览器和操作系统</li>
              </ul>

              <h3>数据使用</h3>
              <p>我们使用收集的数据来：</p>
              <ul>
                <li>改进我们的服务和用户体验</li>
                <li>诊断技术问题和性能瓶颈</li>
                <li>了解用户如何使用我们的功能</li>
                <li>提供个性化的内容和建议</li>
              </ul>

              <h3>数据共享</h3>
              <p>我们不会出售您的个人数据。我们可能与以下方共享有限的数据：</p>
              <ul>
                <li>服务提供商：帮助我们提供服务的合作伙伴</li>
                <li>分析服务：帮助我们理解使用模式的工具</li>
              </ul>

              <h3>您的权利</h3>
              <p>根据适用的数据保护法律，您有权：</p>
              <ul>
                <li>访问我们持有的关于您的数据</li>
                <li>更正不准确的数据</li>
                <li>删除您的数据</li>
                <li>限制或反对处理</li>
                <li>数据可携带性</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
