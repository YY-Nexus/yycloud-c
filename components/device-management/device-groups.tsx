"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeviceCard } from "@/components/device-management/device-card"
import type { Device, DeviceGroup, DeviceCategory, DeviceStatus } from "@/types/device-management"
import { getDevicesByGroup, getDevicesByCategory, getDevicesByStatus } from "@/lib/device-management-service"

type GroupingType = "group" | "category" | "status"

export function DeviceGroups() {
  const [groupingType, setGroupingType] = useState<GroupingType>("group")
  const [devicesByGroup, setDevicesByGroup] = useState<Record<DeviceGroup, Device[]>>(
    {} as Record<DeviceGroup, Device[]>,
  )
  const [devicesByCategory, setDevicesByCategory] = useState<Record<DeviceCategory, Device[]>>(
    {} as Record<DeviceCategory, Device[]>,
  )
  const [devicesByStatus, setDevicesByStatus] = useState<Record<DeviceStatus, Device[]>>(
    {} as Record<DeviceStatus, Device[]>,
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDevices = async () => {
      setLoading(true)
      try {
        const [byGroup, byCategory, byStatus] = await Promise.all([
          getDevicesByGroup(),
          getDevicesByCategory(),
          getDevicesByStatus(),
        ])
        setDevicesByGroup(byGroup)
        setDevicesByCategory(byCategory)
        setDevicesByStatus(byStatus)
      } catch (error) {
        console.error("加载设备分组数据失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDevices()
  }, [])

  if (loading) {
    return <div className="text-center py-8">正在加载设备分组数据...</div>
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="group" onValueChange={(value) => setGroupingType(value as GroupingType)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="group">按分组</TabsTrigger>
          <TabsTrigger value="category">按类别</TabsTrigger>
          <TabsTrigger value="status">按状态</TabsTrigger>
        </TabsList>

        <TabsContent value="group" className="mt-6">
          {Object.entries(devicesByGroup).map(([group, devices]) => (
            <div key={group} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{group}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="category" className="mt-6">
          {Object.entries(devicesByCategory).map(([category, devices]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="status" className="mt-6">
          {Object.entries(devicesByStatus).map(([status, devices]) => (
            <div key={status} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{status}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
