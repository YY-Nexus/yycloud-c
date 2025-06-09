"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPrivacySettings, updatePrivacySetting } from "@/lib/security-manager"
import type { PrivacySetting } from "@/types/security"
import { Eye, Globe, Monitor, Smartphone, Save } from "lucide-react"

export function PrivacySettings() {
  const [settings, setSettings] = useState<PrivacySetting[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const privacySettings = getPrivacySettings()
    setSettings(privacySettings)
    setLoading(false)
  }, [])

  const handleToggle = (id: string, enabled: boolean) => {
    const updatedSettings = updatePrivacySetting(id, enabled)
    setSettings(updatedSettings)
  }

  const filteredSettings =
    activeCategory === "all" ? settings : settings.filter((setting) => setting.category === activeCategory)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "browser":
        return <Globe className="h-5 w-5 text-blue-500" />
      case "system":
        return <Monitor className="h-5 w-5 text-green-500" />
      case "application":
        return <Smartphone className="h-5 w-5 text-purple-500" />
      default:
        return <Eye className="h-5 w-5 text-gray-500" />
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "browser":
        return "浏览器"
      case "system":
        return "系统"
      case "application":
        return "应用程序"
      default:
        return category
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">隐私保护设置</CardTitle>
            <Eye className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardDescription>管理您的隐私偏好和数据保护设置</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
            <TabsList className="grid grid-cols-4 h-auto">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="browser">浏览器</TabsTrigger>
              <TabsTrigger value="system">系统</TabsTrigger>
              <TabsTrigger value="application">应用程序</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="space-y-6 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-5 bg-muted rounded w-40"></div>
                    <div className="h-4 bg-muted rounded w-64"></div>
                  </div>
                  <div className="h-6 w-12 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredSettings.map((setting) => (
                <div key={setting.id} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      {getCategoryIcon(setting.category)}
                      <h3 className="font-medium ml-2">{setting.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground ml-7">{setting.description}</p>
                    <div className="ml-7">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-muted text-muted-foreground">
                        {getCategoryName(setting.category)}
                      </span>
                    </div>
                  </div>
                  <Switch checked={setting.enabled} onCheckedChange={(checked) => handleToggle(setting.id, checked)} />
                </div>
              ))}

              <div className="flex justify-end mt-6">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  保存设置
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>数据清理</CardTitle>
            <CardDescription>清理浏览历史和个人数据</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">浏览数据</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                      <Globe className="h-3 w-3" />
                    </span>
                    浏览历史
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <span className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-600 inline-flex items-center justify-center mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <path d="M8 3H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1" />
                        <path d="M12 17v.01" />
                        <path d="M12 13v.01" />
                        <path d="M12 9v.01" />
                      </svg>
                    </span>
                    Cookie
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 inline-flex items-center justify-center mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8h8" />
                        <path d="M18 10h4v4" />
                      </svg>
                    </span>
                    缓存
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 inline-flex items-center justify-center mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                        <path d="M20 2a10 10 0 1 0 10 10H20V2z" />
                      </svg>
                    </span>
                    自动填充
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">应用数据</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 inline-flex items-center justify-center mr-2">
                      <Smartphone className="h-3 w-3" />
                    </span>
                    应用缓存
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 inline-flex items-center justify-center mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </span>
                    下载记录
                  </Button>
                </div>
              </div>

              <Button className="w-full mt-2">清理选中数据</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>隐私检查</CardTitle>
            <CardDescription>检查并改进您的隐私状况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium mb-2">隐私检查项目</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-green-500 mr-2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>浏览器隐私设置</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-green-500 mr-2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>应用权限审查</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-yellow-500 mr-2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>数据共享设置</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-red-500 mr-2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    <span>位置跟踪设置</span>
                  </li>
                </ul>
              </div>

              <Button variant="outline" className="w-full">
                开始隐私检查
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
