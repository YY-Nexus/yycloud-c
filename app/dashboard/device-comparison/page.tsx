"use client"

import { useState, useEffect } from "react"
import { getDevicesWithResults } from "@/lib/api"
import type { DeviceWithResults } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DeviceComparisonPage() {
  const [devices, setDevices] = useState<DeviceWithResults[]>([])
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comparisonData, setComparisonData] = useState<any>(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  useEffect(() => {
    const loadDevices = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const deviceList = await getDevicesWithResults()
        setDevices(deviceList)
      } catch (error) {
        console.error("加载设备失败:", error)
        setError("加载设备失败，请稍后重试")
      } finally {
        setIsLoading(false)
      }
    }

    loadDevices()
  }, [])

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">设备对比分析</h1>
          <p className="text-muted-foreground">对比不同设备的网络性能表现</p>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <div className="text-red-500 mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">加载失败</h3>
              <p className="text-muted-foreground text-center mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>重新加载</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">设备对比分析</h1>
        <p className="text-muted-foreground">对比不同设备的网络性能表现</p>
      </div>
      {/* Rest of the component will be added here */}
      <div>Content</div>
    </div>
  )
}
