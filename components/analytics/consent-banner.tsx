/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 隐私同意横幅组件
 *
 * @module YYC/components
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

"use client"

import { useState, useEffect } from "react"
import { setConsent, savePrivacySettings, hasConsent, getPrivacySettings } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [settings, setSettings] = useState(getPrivacySettings())

  useEffect(() => {
    // 检查是否已经获得同意
    const consent = hasConsent()
    if (!consent) {
      // 延迟显示横幅，避免页面加载时立即弹出
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    const newSettings = {
      analyticsEnabled: true,
      performanceTracking: true,
      advertisingTracking: true,
      userProfilingEnabled: true,
    }

    setSettings(newSettings)
    savePrivacySettings(newSettings)
    setConsent(true)
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    const newSettings = {
      analyticsEnabled: false,
      performanceTracking: false,
      advertisingTracking: false,
      userProfilingEnabled: false,
    }

    setSettings(newSettings)
    savePrivacySettings(newSettings)
    setConsent(true) // 仍然设置同意，但所有跟踪都被禁用
    setShowBanner(false)
  }

  const handleCustomize = () => {
    setShowDetails(true)
  }

  const handleSavePreferences = () => {
    savePrivacySettings(settings)
    setConsent(true)
    setShowDetails(false)
    setShowBanner(false)
  }

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  if (!showBanner) return null

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">隐私设置</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                我们使用Cookie和类似技术来提升您的体验、分析使用情况并支持我们的营销活动。您可以自定义您的隐私偏好。
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" onClick={handleRejectAll}>
                拒绝全部
              </Button>
              <Button variant="outline" size="sm" onClick={handleCustomize}>
                自定义设置
              </Button>
              <Button variant="default" size="sm" onClick={handleAcceptAll}>
                接受全部
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>隐私偏好设置</DialogTitle>
            <DialogDescription>
              您可以选择启用或禁用以下类别的跟踪。这些设置随时可以在隐私设置中更改。
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="analytics">基础分析</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">收集匿名使用数据以改进我们的服务</p>
              </div>
              <Switch
                id="analytics"
                checked={settings.analyticsEnabled}
                onCheckedChange={() => handleToggle("analyticsEnabled")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="performance">性能跟踪</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">监控应用性能和加载时间</p>
              </div>
              <Switch
                id="performance"
                checked={settings.performanceTracking}
                onCheckedChange={() => handleToggle("performanceTracking")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="advertising">广告跟踪</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">允许个性化广告和营销内容</p>
              </div>
              <Switch
                id="advertising"
                checked={settings.advertisingTracking}
                onCheckedChange={() => handleToggle("advertisingTracking")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profiling">用户画像</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">创建用户行为和偏好的个性化档案</p>
              </div>
              <Switch
                id="profiling"
                checked={settings.userProfilingEnabled}
                onCheckedChange={() => handleToggle("userProfilingEnabled")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              取消
            </Button>
            <Button onClick={handleSavePreferences}>保存偏好</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
