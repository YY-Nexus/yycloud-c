/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 响应式测试工具
 * ==========================================
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Monitor, Smartphone, Tablet, RotateCcw, Eye, Maximize2 } from "lucide-react"

interface ViewportSize {
  name: string
  width: number
  height: number
  icon: any
  description: string
}

export function ResponsiveTester() {
  const [currentViewport, setCurrentViewport] = useState<ViewportSize | null>(null)
  const [screenInfo, setScreenInfo] = useState({
    width: 0,
    height: 0,
    devicePixelRatio: 1,
    orientation: "landscape",
  })

  const viewports: ViewportSize[] = [
    { name: "iPhone SE", width: 375, height: 667, icon: Smartphone, description: "小屏手机" },
    { name: "iPhone 12", width: 390, height: 844, icon: Smartphone, description: "标准手机" },
    { name: "iPhone 12 Pro Max", width: 428, height: 926, icon: Smartphone, description: "大屏手机" },
    { name: "iPad Mini", width: 768, height: 1024, icon: Tablet, description: "小平板" },
    { name: "iPad Pro", width: 1024, height: 1366, icon: Tablet, description: "大平板" },
    { name: "MacBook Air", width: 1280, height: 800, icon: Monitor, description: "笔记本" },
    { name: "Desktop", width: 1920, height: 1080, icon: Monitor, description: "桌面显示器" },
    { name: "4K Display", width: 3840, height: 2160, icon: Monitor, description: "4K显示器" },
  ]

  useEffect(() => {
    const updateScreenInfo = () => {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        orientation: window.innerWidth > window.innerHeight ? "landscape" : "portrait",
      })
    }

    updateScreenInfo()
    window.addEventListener("resize", updateScreenInfo)
    window.addEventListener("orientationchange", updateScreenInfo)

    return () => {
      window.removeEventListener("resize", updateScreenInfo)
      window.removeEventListener("orientationchange", updateScreenInfo)
    }
  }, [])

  const simulateViewport = (viewport: ViewportSize) => {
    setCurrentViewport(viewport)

    // 在实际应用中，这里可以调整iframe或者其他方式来模拟不同视口
    // 这里我们只是记录选择的视口信息
  }

  const resetViewport = () => {
    setCurrentViewport(null)
  }

  const getDeviceCategory = (width: number) => {
    if (width < 768) return { name: "移动设备", color: "bg-blue-100 text-blue-800" }
    if (width < 1024) return { name: "平板设备", color: "bg-green-100 text-green-800" }
    return { name: "桌面设备", color: "bg-purple-100 text-purple-800" }
  }

  const currentCategory = getDeviceCategory(screenInfo.width)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">响应式测试</h1>
          <p className="text-muted-foreground">测试不同设备和屏幕尺寸下的显示效果</p>
        </div>
        <Button onClick={resetViewport} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          重置视口
        </Button>
      </div>

      {/* 当前屏幕信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">屏幕宽度</CardTitle>
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{screenInfo.width}px</div>
            <Badge className={currentCategory.color}>{currentCategory.name}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">屏幕高度</CardTitle>
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{screenInfo.height}px</div>
            <p className="text-xs text-muted-foreground">比例: {(screenInfo.width / screenInfo.height).toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">设备像素比</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{screenInfo.devicePixelRatio}x</div>
            <p className="text-xs text-muted-foreground">{screenInfo.devicePixelRatio > 1 ? "高清屏" : "标准屏"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">屏幕方向</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{screenInfo.orientation === "landscape" ? "横屏" : "竖屏"}</div>
            <p className="text-xs text-muted-foreground">{screenInfo.orientation}</p>
          </CardContent>
        </Card>
      </div>

      {/* 当前模拟视口 */}
      {currentViewport && (
        <Card>
          <CardHeader>
            <CardTitle>当前模拟视口</CardTitle>
            <CardDescription>
              正在模拟 {currentViewport.name} ({currentViewport.width} x {currentViewport.height})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <currentViewport.icon className="h-6 w-6" />
                <div>
                  <p className="font-medium">{currentViewport.name}</p>
                  <p className="text-sm text-muted-foreground">{currentViewport.description}</p>
                </div>
              </div>
              <Badge variant="outline">
                {currentViewport.width} x {currentViewport.height}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="devices" className="space-y-6">
        <TabsList>
          <TabsTrigger value="devices">设备模拟</TabsTrigger>
          <TabsTrigger value="breakpoints">断点测试</TabsTrigger>
          <TabsTrigger value="features">功能测试</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-6">
          {/* 设备选择 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {viewports.map((viewport) => (
              <Card
                key={viewport.name}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  currentViewport?.name === viewport.name ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => simulateViewport(viewport)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <viewport.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{viewport.name}</h3>
                      <p className="text-sm text-muted-foreground">{viewport.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {viewport.width} x {viewport.height}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="breakpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CSS 断点测试</CardTitle>
              <CardDescription>测试不同CSS断点下的布局表现</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "sm", min: 640, description: "小屏幕 (手机横屏)" },
                  { name: "md", min: 768, description: "中等屏幕 (平板)" },
                  { name: "lg", min: 1024, description: "大屏幕 (桌面)" },
                  { name: "xl", min: 1280, description: "超大屏幕" },
                  { name: "2xl", min: 1536, description: "超超大屏幕" },
                ].map((breakpoint) => (
                  <div key={breakpoint.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{breakpoint.name}</p>
                      <p className="text-sm text-muted-foreground">{breakpoint.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono">{breakpoint.min}px+</span>
                      <Badge
                        className={
                          screenInfo.width >= breakpoint.min
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {screenInfo.width >= breakpoint.min ? "激活" : "未激活"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>响应式功能测试</CardTitle>
              <CardDescription>测试响应式设计的各项功能</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "导航菜单",
                    description: "检查移动端导航菜单是否正常工作",
                    status: screenInfo.width < 768 ? "移动端模式" : "桌面端模式",
                  },
                  {
                    name: "网格布局",
                    description: "检查网格布局在不同屏幕下的表现",
                    status: screenInfo.width < 768 ? "单列布局" : screenInfo.width < 1024 ? "双列布局" : "多列布局",
                  },
                  {
                    name: "字体大小",
                    description: "检查字体在不同设备上的可读性",
                    status: screenInfo.width < 768 ? "移动端字体" : "桌面端字体",
                  },
                  {
                    name: "触摸目标",
                    description: "检查按钮和链接的触摸目标大小",
                    status: screenInfo.width < 768 ? "触摸优化" : "鼠标优化",
                  },
                  {
                    name: "图片适配",
                    description: "检查图片在不同屏幕下的缩放",
                    status: "响应式图片",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{feature.name}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <Badge variant="outline">{feature.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 测试建议 */}
      <Card>
        <CardHeader>
          <CardTitle>测试建议</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            • <strong>移动优先</strong>：从最小屏幕开始设计，逐步增强
          </p>
          <p className="text-sm text-muted-foreground">
            • <strong>触摸友好</strong>：确保按钮和链接至少44px大小
          </p>
          <p className="text-sm text-muted-foreground">
            • <strong>内容优先</strong>：确保重要内容在小屏幕上可见
          </p>
          <p className="text-sm text-muted-foreground">
            • <strong>性能考虑</strong>：在移动设备上优化加载速度
          </p>
          <p className="text-sm text-muted-foreground">
            • <strong>真机测试</strong>：在真实设备上验证用户体验
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
