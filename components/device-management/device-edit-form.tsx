"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { Device } from "@/types/device-management"
import { DeviceTagSelector } from "@/components/device-management/device-tag-selector"

// 表单验证模式
const deviceFormSchema = z.object({
  name: z.string().min(2, {
    message: "设备名称至少需要2个字符",
  }),
  status: z.enum(["活跃", "不活跃", "离线", "维护中"], {
    required_error: "请选择设备状态",
  }),
  ipAddress: z
    .string()
    .regex(/^(\d{1,3}\.){3}\d{1,3}$/, {
      message: "请输入有效的IP地址",
    })
    .optional()
    .or(z.literal("")),
  macAddress: z
    .string()
    .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, {
      message: "请输入有效的MAC地址 (格式: XX:XX:XX:XX:XX:XX)",
    })
    .optional()
    .or(z.literal("")),
  group: z.enum(["办公室", "家庭", "服务器", "移动设备", "其他"], {
    required_error: "请选择设备分组",
  }),
  category: z.enum(["计算机", "网络", "移动设备", "外设", "服务器", "其他"], {
    required_error: "请选择设备类别",
  }),
  location: z.string().min(1, {
    message: "请输入设备位置",
  }),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.date().optional(),
  warrantyEnd: z.date().optional(),
  description: z.string().optional(),
  tags: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        color: z.string(),
        description: z.string().optional(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .optional(),
})

type DeviceFormValues = z.infer<typeof deviceFormSchema>

interface DeviceEditFormProps {
  device?: Device
  onSuccess?: () => void
}

export function DeviceEditForm({ device, onSuccess }: DeviceEditFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 初始化表单
  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: {
      name: "",
      status: "活跃",
      ipAddress: "",
      macAddress: "",
      group: "办公室",
      category: "计算机",
      location: "",
      manufacturer: "",
      model: "",
      serialNumber: "",
      description: "",
      tags: [],
    },
  })

  // 当设备数据加载时，填充表单
  useEffect(() => {
    if (device) {
      form.reset({
        name: device.name,
        status: device.status,
        ipAddress: device.ipAddress || "",
        macAddress: device.macAddress || "",
        group: device.group || "办公室",
        category: device.category || "计算机",
        location: device.location || "",
        manufacturer: device.manufacturer || "",
        model: device.model || "",
        serialNumber: device.serialNumber || "",
        purchaseDate: device.purchaseDate ? new Date(device.purchaseDate) : undefined,
        warrantyEnd: device.warrantyEnd ? new Date(device.warrantyEnd) : undefined,
        description: device.description || "",
        tags: device.tags || [],
      })
    }
  }, [device, form])

  // 提交表单
  async function onSubmit(data: DeviceFormValues) {
    setIsSubmitting(true)

    try {
      // 在实际应用中，这里会调用API保存数据
      console.log("保存设备数据:", data)

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "保存成功",
        description: "设备信息已成功更新",
      })

      if (onSuccess) {
        onSuccess()
      } else {
        // 如果是编辑现有设备，返回到设备详情页
        if (device) {
          router.push(`/dashboard/device-management/${device.id}`)
        } else {
          // 如果是新建设备，返回到设备列表
          router.push("/dashboard/device-management")
        }
      }
    } catch (error) {
      console.error("保存设备失败:", error)
      toast({
        title: "保存失败",
        description: "保存设备信息时出错，请重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">基本信息</h3>
              <p className="text-sm text-muted-foreground">设备的基本信息和标识</p>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>设备名称 *</FormLabel>
                  <FormControl>
                    <Input placeholder="输入设备名称" {...field} />
                  </FormControl>
                  <FormDescription>设备的唯一标识名称</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>设备状态 *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择设备状态" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="活跃">活跃</SelectItem>
                      <SelectItem value="不活跃">不活跃</SelectItem>
                      <SelectItem value="离线">离线</SelectItem>
                      <SelectItem value="维护中">维护中</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>设备的当前运行状态</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>设备分组 *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择设备分组" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="办公室">办公室</SelectItem>
                      <SelectItem value="家庭">家庭</SelectItem>
                      <SelectItem value="服务器">服务器</SelectItem>
                      <SelectItem value="移动设备">移动设备</SelectItem>
                      <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>设备所属的分组</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>设备类别 *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择设备类别" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="计算机">计算机</SelectItem>
                      <SelectItem value="网络">网络</SelectItem>
                      <SelectItem value="移动设备">移动设备</SelectItem>
                      <SelectItem value="外设">外设</SelectItem>
                      <SelectItem value="服务器">服务器</SelectItem>
                      <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>设备的类型分类</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>设备位置 *</FormLabel>
                  <FormControl>
                    <Input placeholder="输入设备位置" {...field} />
                  </FormControl>
                  <FormDescription>设备的物理位置</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 网络信息 */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">网络信息</h3>
              <p className="text-sm text-muted-foreground">设备的网络配置和连接信息</p>
            </div>

            <FormField
              control={form.control}
              name="ipAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP地址</FormLabel>
                  <FormControl>
                    <Input placeholder="例如: 192.168.1.100" {...field} />
                  </FormControl>
                  <FormDescription>设备的IP地址</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="macAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MAC地址</FormLabel>
                  <FormControl>
                    <Input placeholder="例如: 00:1A:2B:3C:4D:5E" {...field} />
                  </FormControl>
                  <FormDescription>设备的MAC地址</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>制造商</FormLabel>
                  <FormControl>
                    <Input placeholder="输入制造商名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>型号</FormLabel>
                  <FormControl>
                    <Input placeholder="输入设备型号" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>序列号</FormLabel>
                  <FormControl>
                    <Input placeholder="输入设备序列号" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 设备标签 */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">设备标签</h3>
            <p className="text-sm text-muted-foreground">为设备添加标签以便分类和管理</p>
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>设备标签</FormLabel>
                <FormControl>
                  <DeviceTagSelector
                    selectedTags={field.value || []}
                    onTagsChange={field.onChange}
                    placeholder="选择设备标签..."
                  />
                </FormControl>
                <FormDescription>选择适用于此设备的标签</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 购买信息 */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">购买信息</h3>
            <p className="text-sm text-muted-foreground">设备的购买和保修信息</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>购买日期</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP", { locale: zhCN }) : <span>选择日期</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>设备的购买日期</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="warrantyEnd"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>保修截止日期</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP", { locale: zhCN }) : <span>选择日期</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>设备的保修截止日期</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 描述 */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>设备描述</FormLabel>
              <FormControl>
                <Textarea placeholder="输入设备的详细描述" className="min-h-[120px]" {...field} />
              </FormControl>
              <FormDescription>设备的详细信息和备注</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 表单操作 */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (device) {
                router.push(`/dashboard/device-management/${device.id}`)
              } else {
                router.push("/dashboard/device-management")
              }
            }}
          >
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {device ? "保存更改" : "添加设备"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
