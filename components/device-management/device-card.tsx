import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit } from "lucide-react"
import Link from "next/link"
import type { Device } from "@/types/device-management"

interface DeviceCardProps {
  device: Device
}

export function DeviceCard({ device }: DeviceCardProps) {
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{device.name}</CardTitle>
          <Badge className={getStatusColor(device.status)}>{device.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          {device.manufacturer && device.model && (
            <p>
              <span className="font-medium">型号：</span>
              {device.manufacturer} {device.model}
            </p>
          )}
          {device.ipAddress && (
            <p>
              <span className="font-medium">IP地址：</span>
              {device.ipAddress}
            </p>
          )}
          {device.location && (
            <p>
              <span className="font-medium">位置：</span>
              {device.location}
            </p>
          )}
          {device.lastSeen && (
            <p>
              <span className="font-medium">最后活动：</span>
              {formatDate(device.lastSeen)}
            </p>
          )}
          {device.group && (
            <p>
              <span className="font-medium">分组：</span>
              {device.group}
            </p>
          )}
          {device.category && (
            <p>
              <span className="font-medium">类别：</span>
              {device.category}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex gap-2 w-full">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/dashboard/device-management/${device.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              详情
            </Link>
          </Button>
          <Button asChild variant="default" className="flex-1">
            <Link href={`/dashboard/device-management/${device.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              编辑
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
