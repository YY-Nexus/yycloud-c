"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeviceEditForm } from "@/components/device-management/device-edit-form"
import { getDeviceById } from "@/lib/device-management-service"
import type { Device } from "@/types/device-management"

export default function DeviceEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
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

  const handleSuccess = () => {
    router.push(`/dashboard/device-management/${params.id}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-8">正在加载设备信息...</div>
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
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push(`/dashboard/device-management/${params.id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">编辑设备: {device.name}</h1>
      </div>

      <DeviceEditForm device={device} onSuccess={handleSuccess} />
    </div>
  )
}
