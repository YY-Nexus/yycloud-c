"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import type { DeviceWithResults } from "@/lib/device-manager"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

interface DeviceComparisonChartProps {
  devices: DeviceWithResults[]
  metric: "download" | "upload" | "ping" | "jitter" | "packetLoss" | "qualityScore"
  chartType: "bar" | "line"
}

export function DeviceComparisonChart({ devices, metric, chartType }: DeviceComparisonChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || devices.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布尺寸
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // 清除画布
    ctx.clearRect(0, 0, rect.width, rect.height)

    // 设置图表边距
    const margin = { top: 40, right: 30, bottom: 60, left: 60 }
    const width = rect.width - margin.left - margin.right
    const height = rect.height - margin.top - margin.bottom

    // 根据图表类型绘制不同的图表
    if (chartType === "bar") {
      drawBarChart(ctx, devices, metric, margin, width, height)
    } else {
      drawLineChart(ctx, devices, metric, margin, width, height)
    }
  }, [devices, metric, chartType])

  // 绘制柱状图
  function drawBarChart(
    ctx: CanvasRenderingContext2D,
    devices: DeviceWithResults[],
    metric: string,
    margin: { top: number; right: number; bottom: number; left: number },
    width: number,
    height: number,
  ) {
    // 计算每个设备的平均值
    const deviceData = devices.map((device) => {
      const values = device.results.map((r) => r[metric as keyof typeof r] as number)
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length
      return {
        name: device.name,
        value: avg,
        color: getDeviceColor(device.id),
      }
    })

    // 找出最大值用于缩放
    const maxValue = Math.max(...deviceData.map((d) => d.value)) * 1.1

    // 绘制坐标轴
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, height + margin.top)
    ctx.lineTo(width + margin.left, height + margin.top)
    ctx.stroke()

    // 绘制Y轴网格线和标签
    const yGridCount = 5
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 0.5

    for (let i = 0; i <= yGridCount; i++) {
      const y = margin.top + (height / yGridCount) * i
      ctx.moveTo(margin.left, y)
      ctx.lineTo(width + margin.left, y)

      const value = maxValue - (maxValue / yGridCount) * i
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(formatValue(value, metric), margin.left - 5, y + 3)
    }
    ctx.stroke()

    // 绘制柱状图
    const barWidth = width / (deviceData.length * 2) // 柱子宽度，留出间隔

    deviceData.forEach((data, index) => {
      const x = margin.left + (index * 2 + 0.5) * barWidth
      const barHeight = (data.value / maxValue) * height
      const y = margin.top + height - barHeight

      // 绘制柱子
      ctx.fillStyle = data.color
      ctx.fillRect(x, y, barWidth, barHeight)

      // 绘制设备名称
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.save()
      ctx.translate(x + barWidth / 2, height + margin.top + 10)
      ctx.rotate(Math.PI / 6) // 倾斜标签以防重叠
      ctx.fillText(data.name, 0, 0)
      ctx.restore()

      // 绘制数值
      ctx.fillStyle = "#0f172a"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(formatValue(data.value, metric), x + barWidth / 2, y - 5)
    })

    // 绘制标题
    ctx.fillStyle = "#0f172a"
    ctx.font = "14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(getMetricTitle(metric), margin.left + width / 2, margin.top / 2)
  }

  // 绘制折线图
  function drawLineChart(
    ctx: CanvasRenderingContext2D,
    devices: DeviceWithResults[],
    metric: string,
    margin: { top: number; right: number; bottom: number; left: number },
    width: number,
    height: number,
  ) {
    // 获取所有设备的所有结果
    const allResults = devices.flatMap((device) =>
      device.results.map((r) => ({
        ...r,
        deviceId: device.id,
        deviceName: device.name,
      })),
    )

    // 按时间排序
    allResults.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    // 找出时间范围
    const startTime = new Date(allResults[0].timestamp).getTime()
    const endTime = new Date(allResults[allResults.length - 1].timestamp).getTime()
    const timeRange = endTime - startTime

    // 找出最大值用于缩放
    const maxValue = Math.max(...allResults.map((r) => r[metric as keyof typeof r] as number)) * 1.1

    // 绘制坐标轴
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, height + margin.top)
    ctx.lineTo(width + margin.left, height + margin.top)
    ctx.stroke()

    // 绘制Y轴网格线和标签
    const yGridCount = 5
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 0.5

    for (let i = 0; i <= yGridCount; i++) {
      const y = margin.top + (height / yGridCount) * i
      ctx.moveTo(margin.left, y)
      ctx.lineTo(width + margin.left, y)

      const value = maxValue - (maxValue / yGridCount) * i
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(formatValue(value, metric), margin.left - 5, y + 3)
    }
    ctx.stroke()

    // 绘制X轴标签
    const xLabelCount = 6
    for (let i = 0; i <= xLabelCount; i++) {
      const x = margin.left + (width / xLabelCount) * i
      const time = new Date(startTime + (timeRange / xLabelCount) * i)

      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(format(time, "MM/dd HH:mm", { locale: zhCN }), x, height + margin.top + 15)
    }

    // 按设备分组绘制折线
    devices.forEach((device) => {
      const deviceResults = device.results
        .map((r) => ({
          ...r,
          value: r[metric as keyof typeof r] as number,
          time: new Date(r.timestamp).getTime(),
        }))
        .sort((a, b) => a.time - b.time)

      if (deviceResults.length === 0) return

      const color = getDeviceColor(device.id)

      // 绘制折线
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 2

      // 添加阴影效果
      ctx.shadowColor = color
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      deviceResults.forEach((result, index) => {
        const x = margin.left + ((result.time - startTime) / timeRange) * width
        const y = margin.top + height - (result.value / maxValue) * height

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // 重置阴影
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      // 绘制数据点
      deviceResults.forEach((result) => {
        const x = margin.left + ((result.time - startTime) / timeRange) * width
        const y = margin.top + height - (result.value / maxValue) * height

        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      })
    })

    // 绘制图例
    const legendY = margin.top / 2
    let legendX = margin.left

    devices.forEach((device) => {
      const color = getDeviceColor(device.id)

      // 绘制图例线
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.moveTo(legendX, legendY)
      ctx.lineTo(legendX + 20, legendY)
      ctx.stroke()

      // 绘制图例文本
      ctx.fillStyle = "#0f172a"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(device.name, legendX + 25, legendY + 3)

      // 更新下一个图例的位置
      legendX += ctx.measureText(device.name).width + 50
    })

    // 绘制标题
    ctx.fillStyle = "#0f172a"
    ctx.font = "14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(getMetricTitle(metric), margin.left + width / 2, 15)
  }

  // 获取设备颜色
  function getDeviceColor(deviceId: string): string {
    // 根据设备ID生成一致的颜色
    const colors = [
      "#0ea5e9", // 蓝色
      "#10b981", // 绿色
      "#f59e0b", // 黄色
      "#ef4444", // 红色
      "#8b5cf6", // 紫色
      "#ec4899", // 粉色
      "#06b6d4", // 青色
      "#f97316", // 橙色
    ]

    // 使用设备ID的哈希值来选择颜色
    const hash = deviceId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  // 格式化数值
  function formatValue(value: number, metric: string): string {
    switch (metric) {
      case "download":
      case "upload":
        return `${value.toFixed(1)} Mbps`
      case "ping":
      case "jitter":
        return `${value.toFixed(0)} ms`
      case "packetLoss":
        return `${value.toFixed(2)}%`
      case "qualityScore":
        return `${value.toFixed(0)}`
      default:
        return value.toString()
    }
  }

  // 获取指标标题
  function getMetricTitle(metric: string): string {
    switch (metric) {
      case "download":
        return "下载速度对比 (Mbps)"
      case "upload":
        return "上传速度对比 (Mbps)"
      case "ping":
        return "网络延迟对比 (ms)"
      case "jitter":
        return "网络抖动对比 (ms)"
      case "packetLoss":
        return "丢包率对比 (%)"
      case "qualityScore":
        return "网络质量评分对比"
      default:
        return metric
    }
  }

  return <canvas ref={canvasRef} className="w-full h-full" />
}

// 导出图表为图片
export function exportChartAsImage(canvasRef: React.RefObject<HTMLCanvasElement>, filename = "chart"): void {
  if (!canvasRef.current) return

  const canvas = canvasRef.current
  const link = document.createElement("a")
  link.download = `${filename}.png`
  link.href = canvas.toDataURL()
  link.click()
}
