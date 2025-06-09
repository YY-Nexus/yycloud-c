"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2, AlertTriangle, CheckCircle2, Clock, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DeviceCopyDialog } from "@/components/device-management/device-copy-dialog"
import { DeviceHistory } from "@/components/device-management/device-history"
import { getDeviceById } from "@/lib/device-management-service"
import type { Device } from "@/types/device-management"
import { useToast } from "@/hooks/use-toast"

export default function DeviceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [device, setDevice] = useState<Device | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const deviceId = Number.parseInt(params.id, 10)
        if (isNaN(deviceId)) {
          throw new Error("无效的设备ID")
        }

        const deviceData = await getDeviceById(deviceId)
        if (!deviceData) {
          throw new Error("未找到设备")
        }

        setDevice(deviceData)
      } catch (err: any) {
        setError(err.message || "获取设备详情失败")
      } finally {
        setLoading(false)
      }
    }

    fetchDevice()
  }, [params.id])

  const handleEdit = () => {
    router.push(`/dashboard/device-management/${params.id}/edit`)
  }

  const handleDelete = () => {
    toast({
      title: "确认删除",
      description: `您确定要删除设备 "${device?.name}" 吗？`,
      action: (
        <Button
          variant="destructive"
          onClick={() => {
            // 实际应用中，这里会调用删除API
            toast({
              title: "设备已删除",
              description: "设备已成功删除",
            })
            router.push("/dashboard/device-management")
          }}
        >
          删除
        </Button>
      ),
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "活跃":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "不活跃":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "离线":
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
      case "维护中":
        return <Activity className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "活跃":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "不活跃":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "离线":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      case "维护中":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const formatDate = (date?: Date) => {
    if (!date) return "未知"
    return new Date(date).toLocaleDateString("zh-CN")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-8">正在加载设备详情...</div>
      </div>
    )
  }

  if (error || !device) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-8 text-red-500">错误: {error || "未找到设备"}</div>
        <Button variant="outline" onClick={() => router.push("/dashboard/device-management")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回设备列表
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/device-management")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{device.name}</h1>
          <Badge className={getStatusColor(device.status)}>
            <span className="flex items-center gap-1">
              {getStatusIcon(device.status)}
              {device.status}
            </span>
          </Badge>
        </div>
        <div className="flex gap-2">
          <DeviceCopyDialog device={device} />
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            编辑
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            删除
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">基本信息</TabsTrigger>
          <TabsTrigger value="network">网络信息</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
          <TabsTrigger value="maintenance">维护记录</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>设备详情</CardTitle>
              <CardDescription>设备的基本信息和配置</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="font-medium">设备名称：</span>
                  {device.name}
                </div>
                <div>
                  <span className="font-medium">制造商：</span>
                  {device.manufacturer || "未知"}
                </div>
                <div>
                  <span className="font-medium">型号：</span>
                  {device.model || "未知"}
                </div>
                <div>
                  <span className="font-medium">序列号：</span>
                  {device.serialNumber || "未知"}
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">位置：</span>
                  {device.location || "未知"}
                </div>
                <div>
                  <span className="font-medium">分组：</span>
                  {device.group || "未分组"}
                </div>
                <div>
                  <span className="font-medium">类别：</span>
                  {device.category || "未分类"}
                </div>
                <div>
                  <span className="font-medium">最后活动：</span>
                  {formatDate(device.lastSeen)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 设备标签 */}
          {device.tags && device.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>设备标签</CardTitle>
                <CardDescription>与此设备关联的标签</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {device.tags.map((tag) => (
                    <Badge key={tag.id} style={{ backgroundColor: tag.color, color: "white" }}>
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>购买信息</CardTitle>
              <CardDescription>设备的购买和保修信息</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="font-medium">购买日期：</span>
                  {formatDate(device.purchaseDate)}
                </div>
                <div>
                  <span className="font-medium">保修截止日期：</span>
                  {formatDate(device.warrantyEnd)}
                </div>
              </div>
              <div className="space-y-2">
                {device.warrantyEnd && new Date(device.warrantyEnd) < new Date() ? (
                  <div className="text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    保修已过期
                  </div>
                ) : device.warrantyEnd ? (
                  <div className="text-green-500 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    保修有效
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>设备描述</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{device.description || "无描述信息"}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>网络信息</CardTitle>
              <CardDescription>设备的网络配置和连接信息</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="font-medium">IP地址：</span>
                  {device.ipAddress || "未知"}
                </div>
                <div>
                  <span className="font-medium">MAC地址：</span>
                  {device.macAddress || "未知"}
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">状态：</span>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(device.status)}
                    {device.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">最后活动：</span>
                  {formatDate(device.lastSeen)}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">网络诊断</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>连接历史</CardTitle>
              <CardDescription>设备的连接和断开记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 text-muted-foreground">暂无连接历史记录</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <DeviceHistory deviceId={device.id} />
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>维护记录</CardTitle>
              <CardDescription>设备的维护和修理历史</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 text-muted-foreground">暂无维护记录</div>
            </CardContent>
            <CardFooter>
              <Button>添加维护记录</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
