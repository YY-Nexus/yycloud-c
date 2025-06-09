"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ShieldCheck, Lock, Database, Eye, Laptop, AlertTriangle, CheckCircle, Settings } from "lucide-react"

export function SecurityModules() {
  const [activeTab, setActiveTab] = useState("overview")

  const modules = [
    {
      id: "password-manager",
      name: "密码管理器",
      description: "安全存储和管理您的密码",
      icon: <Lock className="h-5 w-5" />,
      status: "active",
      progress: 100,
    },
    {
      id: "backup-manager",
      name: "数据备份",
      description: "自动备份和恢复您的重要数据",
      icon: <Database className="h-5 w-5" />,
      status: "active",
      progress: 100,
    },
    {
      id: "privacy-protection",
      name: "隐私保护",
      description: "保护您的个人信息和浏览隐私",
      icon: <Eye className="h-5 w-5" />,
      status: "active",
      progress: 100,
    },
    {
      id: "device-security",
      name: "设备安全",
      description: "保护您的设备免受恶意软件和威胁",
      icon: <Laptop className="h-5 w-5" />,
      status: "active",
      progress: 100,
    },
    {
      id: "security-assessment",
      name: "安全评估",
      description: "全面评估您的安全状况",
      icon: <ShieldCheck className="h-5 w-5" />,
      status: "active",
      progress: 100,
    },
    {
      id: "vulnerability-scanner",
      name: "漏洞扫描",
      description: "检测系统和应用程序漏洞",
      icon: <AlertTriangle className="h-5 w-5" />,
      status: "available",
      progress: 0,
    },
    {
      id: "network-protection",
      name: "网络保护",
      description: "监控和保护您的网络连接",
      icon: <Settings className="h-5 w-5" />,
      status: "available",
      progress: 0,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            已启用
          </Badge>
        )
      case "available":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            可安装
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>安全模块</CardTitle>
        <CardDescription>管理和配置您的安全防护模块</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="active">已启用</TabsTrigger>
            <TabsTrigger value="available">可安装</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((module) => (
                <Card key={module.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2 rounded-md">{module.icon}</div>
                        <div>
                          <h3 className="font-medium">{module.name}</h3>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                      </div>
                      <div>{getStatusBadge(module.status)}</div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">配置完成度</span>
                        <span className="text-xs font-medium">{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-1" />
                    </div>
                    <div className="mt-4">
                      <Button variant={module.status === "active" ? "outline" : "default"} size="sm" className="w-full">
                        {module.status === "active" ? "配置" : "安装"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules
                .filter((module) => module.status === "active")
                .map((module) => (
                  <Card key={module.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-md">{module.icon}</div>
                          <div>
                            <h3 className="font-medium">{module.name}</h3>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                          </div>
                        </div>
                        <div>{getStatusBadge(module.status)}</div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">配置完成度</span>
                          <span className="text-xs font-medium">{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-1" />
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          配置
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="available">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules
                .filter((module) => module.status === "available")
                .map((module) => (
                  <Card key={module.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-md">{module.icon}</div>
                          <div>
                            <h3 className="font-medium">{module.name}</h3>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                          </div>
                        </div>
                        <div>{getStatusBadge(module.status)}</div>
                      </div>
                      <div className="mt-4">
                        <Button size="sm" className="w-full">
                          安装
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
