"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Lock,
  FileText,
  Bell,
  Key,
  User,
  Database,
  Server,
  Globe,
  ChevronRight,
  Clock,
  ArrowUpRight,
} from "lucide-react"

export default function SecurityDashboard() {
  const [securityScore, setSecurityScore] = useState(78)
  const [activeThreats, setActiveThreats] = useState(3)
  const [resolvedThreats, setResolvedThreats] = useState(12)
  const [pendingActions, setPendingActions] = useState(5)

  const securityModules = [
    {
      id: "scanner",
      name: "安全扫描器",
      description: "全面评估系统安全状况",
      icon: <Shield className="h-6 w-6" />,
      path: "/dashboard/security/scanner",
      status: "需要扫描",
      lastRun: "3天前",
    },
    {
      id: "policies",
      name: "安全政策",
      description: "查看和确认安全政策",
      icon: <FileText className="h-6 w-6" />,
      path: "/dashboard/security/policies",
      status: "2项待确认",
      lastRun: "持续",
    },
    {
      id: "incidents",
      name: "安全事件",
      description: "管理和响应安全事件",
      icon: <AlertTriangle className="h-6 w-6" />,
      path: "/dashboard/security/incidents",
      status: "1项待处理",
      lastRun: "1天前",
    },
    {
      id: "training",
      name: "安全培训",
      description: "提高安全意识和技能",
      icon: <User className="h-6 w-6" />,
      path: "/dashboard/security/training",
      status: "2门课程进行中",
      lastRun: "持续",
    },
    {
      id: "password-manager",
      name: "密码管理",
      description: "安全存储和管理密码",
      icon: <Key className="h-6 w-6" />,
      path: "/dashboard/security/password-manager",
      status: "3个弱密码",
      lastRun: "持续",
    },
    {
      id: "two-factor-auth",
      name: "双因素认证",
      description: "为账户添加额外的安全保护",
      icon: <Key className="h-6 w-6" />,
      path: "/dashboard/security/two-factor",
      status: "可配置",
      lastRun: "持续",
    },
    {
      id: "backup",
      name: "备份管理",
      description: "管理系统和数据备份",
      icon: <Database className="h-6 w-6" />,
      path: "/dashboard/security/backup",
      status: "最近备份：昨天",
      lastRun: "昨天",
    },
  ]

  const recentAlerts = [
    {
      id: "alert-1",
      title: "检测到可疑登录尝试",
      description: "多次失败的登录尝试来自未知位置",
      severity: "medium",
      time: "2小时前",
      status: "investigating",
    },
    {
      id: "alert-2",
      title: "发现新的软件漏洞",
      description: "系统组件存在高危安全漏洞",
      severity: "high",
      time: "昨天",
      status: "open",
    },
    {
      id: "alert-3",
      title: "备份失败",
      description: "昨晚的自动备份未能完成",
      severity: "medium",
      time: "昨天",
      status: "resolved",
    },
    {
      id: "alert-4",
      title: "检测到异常网络流量",
      description: "服务器出现异常大量的出站流量",
      severity: "low",
      time: "3天前",
      status: "resolved",
    },
  ]

  const pendingTasks = [
    {
      id: "task-1",
      title: "确认安全政策",
      description: "查看并确认更新的数据保护政策",
      dueDate: "今天",
      path: "/dashboard/security/policies",
    },
    {
      id: "task-2",
      title: "完成安全培训",
      description: '完成"密码安全与管理"培训课程',
      dueDate: "3天后",
      path: "/dashboard/security/training",
    },
    {
      id: "task-3",
      title: "更新弱密码",
      description: "更新3个被标记为弱密码的账户",
      dueDate: "5天后",
      path: "/dashboard/security/password-manager",
    },
    {
      id: "task-4",
      title: "处理安全事件",
      description: "调查并响应可疑登录尝试事件",
      dueDate: "今天",
      path: "/dashboard/security/incidents",
    },
    {
      id: "task-5",
      title: "运行安全扫描",
      description: "执行全面系统安全扫描",
      dueDate: "2天后",
      path: "/dashboard/security/scanner",
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    if (score >= 50) return "text-orange-500"
    return "text-red-500"
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-500 hover:bg-red-600">紧急</Badge>
      case "high":
        return <Badge className="bg-orange-500 hover:bg-orange-600">高</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">中</Badge>
      case "low":
        return <Badge className="bg-blue-500 hover:bg-blue-600">低</Badge>
      default:
        return <Badge>{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            待处理
          </Badge>
        )
      case "investigating":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            调查中
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            已解决
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">安全防护系统</h1>
        <p className="text-muted-foreground">全面保护您的系统和数据安全</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">安全评分</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className={`text-3xl font-bold ${getScoreColor(securityScore)}`}>{securityScore}/100</div>
              <Shield className={`h-8 w-8 ${getScoreColor(securityScore)}`} />
            </div>
            <Progress
              value={securityScore}
              className="h-2 mt-2"
              indicatorClassName={
                securityScore >= 90
                  ? "bg-green-500"
                  : securityScore >= 70
                    ? "bg-yellow-500"
                    : securityScore >= 50
                      ? "bg-orange-500"
                      : "bg-red-500"
              }
            />
            <p className="text-xs text-muted-foreground mt-2">
              {securityScore >= 90 ? "优秀" : securityScore >= 70 ? "良好" : securityScore >= 50 ? "一般" : "较差"} -
              完成待处理任务可提高评分
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">活跃威胁</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-red-500">{activeThreats}</div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {activeThreats > 0 ? `${activeThreats}个威胁需要您的注意` : "没有活跃威胁"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">已解决威胁</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-green-500">{resolvedThreats}</div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-4">过去30天内解决了{resolvedThreats}个安全威胁</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">待处理任务</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-blue-500">{pendingActions}</div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-4">您有{pendingActions}个安全相关任务需要处理</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>安全模块</CardTitle>
              <CardDescription>管理系统各个安全方面</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityModules.map((module) => (
                  <Link href={module.path} key={module.id}>
                    <Card className="h-full cursor-pointer hover:border-primary transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-md bg-primary/10 text-primary">{module.icon}</div>
                            <div>
                              <h3 className="font-medium">{module.name}</h3>
                              <p className="text-sm text-muted-foreground">{module.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex justify-between items-center mt-4 text-sm">
                          <Badge variant="outline">{module.status}</Badge>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {module.lastRun}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="alerts">
            <TabsList className="mb-4">
              <TabsTrigger value="alerts">安全警报</TabsTrigger>
              <TabsTrigger value="tasks">待处理任务</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle>最近警报</CardTitle>
                  <CardDescription>系统检测到的安全警报</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-4">
                        <div
                          className={`p-2 rounded-full ${
                            alert.severity === "high"
                              ? "bg-red-100 text-red-500"
                              : alert.severity === "medium"
                                ? "bg-yellow-100 text-yellow-500"
                                : "bg-blue-100 text-blue-500"
                          }`}
                        >
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{alert.title}</h4>
                              <p className="text-sm text-muted-foreground">{alert.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getSeverityBadge(alert.severity)}
                              {getStatusBadge(alert.status)}
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-muted-foreground">{alert.time}</div>
                            <Link href="/dashboard/security/incidents">
                              <Button variant="ghost" size="sm" className="h-7">
                                查看详情
                                <ArrowUpRight className="h-3 w-3 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/security/incidents" className="w-full">
                    <Button variant="outline" className="w-full">
                      查看所有警报
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>待处理任务</CardTitle>
                  <CardDescription>需要您处理的安全任务</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingTasks.map((task) => (
                      <div key={task.id} className="flex items-start space-x-4">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                          <Bell className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            </div>
                            <Badge variant="outline">截止: {task.dueDate}</Badge>
                          </div>
                          <div className="flex justify-end mt-2">
                            <Link href={task.path}>
                              <Button variant="ghost" size="sm" className="h-7">
                                处理任务
                                <ArrowUpRight className="h-3 w-3 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/security/tasks" className="w-full">
                    <Button variant="outline" className="w-full">
                      查看所有任务
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>安全状态</CardTitle>
              <CardDescription>系统各方面安全状况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">密码安全</span>
                    </div>
                    <span className="font-bold text-yellow-500">75/100</span>
                  </div>
                  <Progress value={75} className="h-1.5" indicatorClassName="bg-yellow-500" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">数据保护</span>
                    </div>
                    <span className="font-bold text-green-500">90/100</span>
                  </div>
                  <Progress value={90} className="h-1.5" indicatorClassName="bg-green-500" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">网络安全</span>
                    </div>
                    <span className="font-bold text-orange-500">60/100</span>
                  </div>
                  <Progress value={60} className="h-1.5" indicatorClassName="bg-orange-500" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">系统安全</span>
                    </div>
                    <span className="font-bold text-green-500">85/100</span>
                  </div>
                  <Progress value={85} className="h-1.5" indicatorClassName="bg-green-500" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/security/scanner" className="w-full">
                <Button variant="outline" className="w-full">
                  运行安全扫描
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>安全建议</CardTitle>
              <CardDescription>提高系统安全性的建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 rounded-full bg-yellow-100 text-yellow-500">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">启用多因素认证</h4>
                    <p className="text-xs text-muted-foreground mt-1">为所有管理员账户启用多因素认证</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1.5 rounded-full bg-yellow-100 text-yellow-500">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">更新软件组件</h4>
                    <p className="text-xs text-muted-foreground mt-1">3个组件需要安全更新</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1.5 rounded-full bg-yellow-100 text-yellow-500">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">加密敏感数据</h4>
                    <p className="text-xs text-muted-foreground mt-1">部分存储的数据未加密</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1.5 rounded-full bg-yellow-100 text-yellow-500">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">完成安全培训</h4>
                    <p className="text-xs text-muted-foreground mt-1">3名团队成员尚未完成必修安全培训</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
