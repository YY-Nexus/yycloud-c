"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import type { Device, DeviceCopyOptions } from "@/types/device-management"

interface DeviceCopyDialogProps {
  device: Device
  trigger?: React.ReactNode
}

export function DeviceCopyDialog({ device, trigger }: DeviceCopyDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newDeviceName, setNewDeviceName] = useState(`${device.name} - 副本`)
  const [copyOptions, setCopyOptions] = useState<DeviceCopyOptions>({
    copyName: false,
    copyNetworkInfo: false,
    copyPurchaseInfo: true,
    copyTags: true,
    copyDescription: true,
  })

  const handleCopyOptionChange = (option: keyof DeviceCopyOptions, checked: boolean) => {
    setCopyOptions((prev) => ({
      ...prev,
      [option]: checked,
    }))
  }

  const handleCopy = async () => {
    if (!newDeviceName.trim()) {
      toast({
        title: "错误",
        description: "请输入新设备名称",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 构建新设备数据
      const newDeviceData = {
        name: newDeviceName,
        status: "不活跃" as const, // 新设备默认为不活跃状态
        group: device.group,
        category: device.category,
        location: device.location,
        // 根据选项决定是否复制其他信息
        ...(copyOptions.copyNetworkInfo && {
          // 网络信息不直接复制，避免IP冲突
          macAddress: device.macAddress,
        }),
        ...(copyOptions.copyPurchaseInfo && {
          manufacturer: device.manufacturer,
          model: device.model,
          purchaseDate: device.purchaseDate,
          warrantyEnd: device.warrantyEnd,
        }),
        ...(copyOptions.copyDescription && {
          description: device.description,
        }),
        ...(copyOptions.copyTags && {
          tags: device.tags,
        }),
      }

      // 在实际应用中，这里会调用API创建新设备
      console.log("复制设备数据:", newDeviceData)

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "复制成功",
        description: `设备 "${newDeviceName}" 已成功创建`,
      })

      setOpen(false)

      // 重置表单
      setNewDeviceName(`${device.name} - 副本`)
      setCopyOptions({
        copyName: false,
        copyNetworkInfo: false,
        copyPurchaseInfo: true,
        copyTags: true,
        copyDescription: true,
      })

      // 跳转到设备列表页面
      router.push("/dashboard/device-management")
    } catch (error) {
      console.error("复制设备失败:", error)
      toast({
        title: "复制失败",
        description: "复制设备时出错，请重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            复制设备
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>复制设备</DialogTitle>
          <DialogDescription>基于 "{device.name}" 创建一个新设备。选择要复制的信息类型。</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="device-name">新设备名称</Label>
            <Input
              id="device-name"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              placeholder="输入新设备名称"
            />
          </div>

          <div className="space-y-4">
            <Label>复制选项</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copy-network"
                  checked={copyOptions.copyNetworkInfo}
                  onCheckedChange={(checked) => handleCopyOptionChange("copyNetworkInfo", checked as boolean)}
                />
                <Label htmlFor="copy-network" className="text-sm">
                  复制网络信息 (MAC地址)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copy-purchase"
                  checked={copyOptions.copyPurchaseInfo}
                  onCheckedChange={(checked) => handleCopyOptionChange("copyPurchaseInfo", checked as boolean)}
                />
                <Label htmlFor="copy-purchase" className="text-sm">
                  复制购买信息 (制造商、型号、购买日期等)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copy-tags"
                  checked={copyOptions.copyTags}
                  onCheckedChange={(checked) => handleCopyOptionChange("copyTags", checked as boolean)}
                />
                <Label htmlFor="copy-tags" className="text-sm">
                  复制设备标签
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copy-description"
                  checked={copyOptions.copyDescription}
                  onCheckedChange={(checked) => handleCopyOptionChange("copyDescription", checked as boolean)}
                />
                <Label htmlFor="copy-description" className="text-sm">
                  复制设备描述
                </Label>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <p className="font-medium mb-1">注意事项：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>新设备的状态将设置为"不活跃"</li>
              <li>IP地址不会被复制，避免网络冲突</li>
              <li>序列号不会被复制，确保唯一性</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleCopy} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            创建副本
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
