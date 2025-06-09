"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import type { NetworkMonitorData } from "@/types/network-monitor"

interface NetworkMonitorChartProps {
  data: NetworkMonitorData
  type: "overview" | "speed" | "latency" | "qualityScore" | "speedDistribution" | "latencyStability"
  title?: string
  description?: string
  height?: number
}

export function NetworkMonitorChart({ data, type, title, description, height = 350 }: NetworkMonitorChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || data.dataPoints.length === 0) return

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
    const margin = { top: 30, right: 30, bottom: 50, left: 60 }
    const width = rect.width - margin.left - margin.right
    const height = rect.height - margin.top - margin.bottom

    // 根据图表类型绘制不同的图表
    switch (type) {
      case "overview":
        drawOverviewChart(ctx, data, margin, width, height)
        break
      case "speed":
        drawSpeedChart(ctx, data, margin, width, height)
        break
      case "latency":
        drawLatencyChart(ctx, data, margin, width, height)
        break
      case "qualityScore":
        drawQualityScoreChart(ctx, data, margin, width, height)
        break
      case "speedDistribution":
        drawSpeedDistributionChart(ctx, data, margin, width, height)
        break
      case "latencyStability":
        drawLatencyStabilityChart(ctx, data, margin, width, height)
        break
    }
  }, [data, type])

  // 绘制概览图表
  function drawOverviewChart(
    ctx: CanvasRenderingContext2D,
    data: NetworkMonitorData,
    margin: { top: number; right: number; bottom: number; left: number },
    width: number,
    height: number,
  ) {
    const dataPoints = data.dataPoints

    // 找出最大值用于缩放
    const maxDownload = Math.max(...dataPoints.map((dp) => dp.download))
    const maxUpload = Math.max(...dataPoints.map((dp) => dp.upload))
    const maxSpeed = Math.max(maxDownload, maxUpload) * 1.1

    const maxPing = Math.max(...dataPoints.map((dp) => dp.ping))
    const pingScale = maxPing * 1.1

    // 绘制坐标轴
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, height + margin.top)
    ctx.lineTo(width + margin.left, height + margin.top)
    ctx.stroke()

    // 绘制网格线和Y轴标签
    const yGridCount = 5
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 0.5

    // 左侧Y轴 (速度)
    for (let i = 0; i <= yGridCount; i++) {
      const y = margin.top + (height / yGridCount) * i
      ctx.moveTo(margin.left, y)
      ctx.lineTo(width + margin.left, y)

      const value = maxSpeed - (maxSpeed / yGridCount) * i
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`${value.toFixed(1)} Mbps`, margin.left - 5, y + 3)
    }

    // 右侧Y轴 (延迟)
    for (let i = 0; i <= yGridCount; i++) {
      const y = margin.top + (height / yGridCount) * i
      const value = pingScale - (pingScale / yGridCount) * i

      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`${value.toFixed(0)} ms`, width + margin.left + 5, y + 3)
    }
    ctx.stroke()

    // X轴标签
    if (dataPoints.length > 1) {
      const xLabelCount = Math.min(dataPoints.length, 7)
      const step = Math.floor(dataPoints.length / xLabelCount)

      for (let i = 0; i < dataPoints.length; i += step) {
        const x = margin.left + (i / (dataPoints.length - 1)) * width
        const date = new Date(dataPoints[i].timestamp)

        ctx.fillStyle = "#64748b"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(format(date, "MM/dd HH:mm", { locale: zhCN }), x, height + margin.top + 15)
      }
    }

    // 绘制下载速度线
    ctx.beginPath()
    ctx.strokeStyle = "#0ea5e9" // 蓝色
    ctx.lineWidth = 2

    // 添加阴影效果
    ctx.shadowColor = "#0ea5e9"
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    for (let i = 0; i < dataPoints.length; i++) {
      const x = margin.left + (i / (dataPoints.length - 1)) * width
      const y = margin.top + height - (dataPoints[i].download / maxSpeed) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // 重置阴影
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    // 绘制上传速度线
    ctx.beginPath()
    ctx.strokeStyle = "#10b981" // 绿色
    ctx.lineWidth = 2

    // 添加阴影效果
    ctx.shadowColor = "#10b981"
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    for (let i = 0; i < dataPoints.length; i++) {
      const x = margin.left + (i / (dataPoints.length - 1)) * width
      const y = margin.top + height - (dataPoints[i].upload / maxSpeed) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // 重置阴影
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    // 绘制延迟线 (使用虚线)
    ctx.beginPath()
    ctx.strokeStyle = "#f59e0b" // 黄色
    ctx.lineWidth = 2
    ctx.setLineDash([5, 3])

    for (let i = 0; i < dataPoints.length; i++) {
      const x = margin.left + (i / (dataPoints.length - 1)) * width
      const y = margin.top + height - (dataPoints[i].ping / pingScale) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // 重置虚线
    ctx.setLineDash([])

    // 绘制图例
    ctx.fillStyle = "#0f172a"
    ctx.font = "12px sans-serif"

    // 下载图例
    ctx.beginPath()
    ctx.strokeStyle = "#0ea5e9"
    ctx.lineWidth = 2
    ctx.moveTo(margin.left, margin.top / 2)
    ctx.lineTo(margin.left + 20, margin.top / 2)
    ctx.stroke()
    ctx.fillText("下载", margin.left + 25, margin.top / 2 + 4)

    // 上传图例
    ctx.beginPath()
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 2
    ctx.moveTo(margin.left + 80, margin.top / 2)
    ctx.lineTo(margin.left + 100, margin.top / 2)
    ctx.stroke()
    ctx.fillText("上传", margin.left + 105, margin.top / 2 + 4)

    // 延迟图例
    ctx.beginPath()
    ctx.strokeStyle = "#f59e0b"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 3])
    ctx.moveTo(margin.left + 160, margin.top / 2)
    ctx.lineTo(margin.left + 180, margin.top / 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillText("延迟", margin.left + 185, margin.top / 2 + 4)
  }

  // 绘制速度图表
  function drawSpeedChart(
    ctx: CanvasRenderingContext2D,
    data: NetworkMonitorData,
    margin: { top: number; right: number; bottom: number; left: number },
    width: number,
    height: number,
  ) {
    const dataPoints = data.dataPoints

    // 找出最大值用于缩放
    const maxDownload = Math.max(...dataPoints.map((dp) => dp.download))
    const maxUpload = Math.max(...dataPoints.map((dp) => dp.upload))
    const maxSpeed = Math.max(maxDownload, maxUpload) * 1.1

    // 绘制坐标轴
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, height + margin.top)
    ctx.lineTo(width + margin.left, height + margin.top)
    ctx.stroke()

    // 绘制网格线和Y轴标签
    const yGridCount = 5
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 0.5

    for (let i = 0; i <= yGridCount; i++) {
      const y = margin.top + (height / yGridCount) * i
      ctx.moveTo(margin.left, y)
      ctx.lineTo(width + margin.left, y)

      const value = maxSpeed - (maxSpeed / yGridCount) * i
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`${value.toFixed(1)} Mbps`, margin.left - 5, y + 3)
    }
    ctx.stroke()

    // X轴标签
    if (dataPoints.length > 1) {
      const xLabelCount = Math.min(dataPoints.length, 7)
      const step = Math.floor(dataPoints.length / xLabelCount)

      for (let i = 0; i < dataPoints.length; i += step) {
        const x = margin.left + (i / (dataPoints.length - 1)) * width
        const date = new Date(dataPoints[i].timestamp)

        ctx.fillStyle = "#64748b"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(format(date, "MM/dd HH:mm", { locale: zhCN }), x, height + margin.top + 15)
      }
    }

    // 绘制下载速度线和区域
    ctx.beginPath()
    ctx.strokeStyle = "#0ea5e9" // 蓝色
    ctx.lineWidth = 2

    // 添加阴影效果
    ctx.shadowColor = "#0ea5e9"
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // 先绘制路径但不描边
    ctx.beginPath()
    for (let i = 0; i < dataPoints.length; i++) {
      const x = margin.left + (i / (dataPoints.length - 1)) * width
      const y = margin.top + height - (dataPoints[i].download / maxSpeed) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    // 保存路径用于填充区域
    const downloadPath = new Path2D(ctx.getPath ? ctx.getPath() : undefined)

    // 描边下载线
    ctx.stroke()

    // 填充下载区域
    ctx.fillStyle = "rgba(14, 165, 233, 0.1)"
    ctx.beginPath()
    ctx.moveTo(margin.left, height + margin.top)
    for (let i = 0; i < dataPoints.length; i++) {
      const x = margin.left + (i / (dataPoints.length - 1)) * width
      const y = margin.top + height - (dataPoints[i].download / maxSpeed) * height
      ctx.lineTo(x, y)
    }
    ctx.lineTo(margin.left + width, height + margin.top)
    ctx.closePath()
    ctx.fill()

    // 重置阴影
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    // 绘制上传速度线
    ctx.beginPath()
    ctx.strokeStyle = "#10b981" // 绿色
    ctx.lineWidth = 2

    // 添加阴影效果
    ctx.shadowColor = "#10b981"
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    for (let i = 0; i < dataPoints.length; i++) {
      const x = margin.left + (i / (dataPoints.length - 1)) * width
      const y = margin.top + height - (dataPoints[i].upload / maxSpeed) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // 填充上传区域
    ctx.fillStyle = "rgba(16, 185, 129, 0.1)"
    ctx.beginPath()
    ctx.moveTo(margin.left, height + margin.top)
    for (let i = 0; i < dataPoints.length; i++) {
      const x = margin.left + (i / (dataPoints.length - 1)) * width
      const y = margin.top + height - (dataPoints[i].upload / maxSpeed) * height
      ctx.lineTo(x, y)
    }
    ctx.lineTo(margin.left + width, height + margin.top)
    ctx.closePath()
    ctx.fill()

    // 重置阴影
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    // 绘制图例
    ctx.fillStyle = "#0f172a"
    ctx.font = "12px sans-serif"

    // 下载图例
    ctx.beginPath()
    ctx.strokeStyle = "#0ea5e9"
    ctx.lineWidth = 2
    ctx.moveTo(margin.left, margin.top / 2)
    ctx.lineTo(margin.left + 20, margin.top / 2)
    ctx.stroke()
    ctx.fillText("下载", margin.left + 25, margin.top / 2 + 4)

    // 上传图例
    ctx.beginPath()
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 2
    ctx.moveTo(margin.left + 80, margin.top / 2)
    ctx.lineTo(margin.left + 100, margin.top / 2)
    ctx.stroke()
    ctx.fillText("上传", margin.left + 105, margin.top / 2 + 4)

    // 添加平均线
    ctx.beginPath()
    ctx.strokeStyle = "#0ea5e9"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 3])
    const avgDownloadY = margin.top + height - (data.stats.avgDownload / maxSpeed) * height
    ctx.moveTo(margin.left, avgDownloadY)
    ctx.lineTo(margin.left + width, avgDownloadY)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 3])
    const avgUploadY = margin.top + height - (data.stats.avgUpload / maxSpeed) * height
    ctx.moveTo(margin.left, avgUploadY)
    ctx.lineTo(margin.left + width, avgUploadY)
    ctx.stroke()

    // 重置虚线
    ctx.setLineDash([])

    // 添加平均值标签
    ctx.fillStyle = "#0ea5e9"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(`平均: ${data.stats.avgDownload.toFixed(2)} Mbps`, margin.left + width - 150, avgDownloadY - 5)

    ctx.fillStyle = "#10b981"
    ctx.fillText(`平均: ${data.stats.avgUpload.toFixed(2)} Mbps`, margin.left + width - 150, avgUploadY - 5)
  }

  // 绘制延迟图表
  function drawLatencyChart(
    ctx: CanvasRenderingContext2D,
    data: NetworkMonitorData,
    margin: { top: number; right: number; bottom: number; left: number },
    width: number,
    height: number,
  ) {
    const dataPoints = data.dataPoints

    // 找出最大值用于缩放
    const maxPing = Math.max(...dataPoints.map((dp) => dp.ping))
    const maxJitter = Math.max(...dataPoints.map((dp) => dp.jitter))
    const maxPacketLoss = Math.max(...dataPoints.map((dp) => dp.packetLoss))

    const pingScale = Math.max(maxPing, maxJitter) * 1.1
    const packetLossScale = Math.max(maxPacketLoss * 1.5, 5) // 至少5%的刻度

    // 绘制坐标轴
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, height + margin.top)
    ctx.lineTo(width + margin.left, height + margin.top)
    ctx.stroke()

    // 绘制网格线和Y轴标签
    const yGridCount = 5
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 0.5

    // 左侧Y轴 (延迟和抖动)
    for (let i = 0; i <= yGridCount; i++) {
      const y = margin.top + (height / yGridCount) * i
      ctx.moveTo(margin.left, y)
      ctx.lineTo(width + margin.left, y)

      const value = pingScale - (pingScale / yGridCount) * i
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`${value.toFixed(0)} ms`, margin.left - 5, y + 3)
    }

    // 右侧Y轴 (丢包率)
    for (let i = 0; i <= yGridCount; i++) {
      const y = margin.top + (height / yGridCount) * i
      const value = packetLossScale - (packetLossScale / yGridCount) * i

      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`${value.toFixed(1)}%`, width + margin.left + 5, y + 3)
    }
    ctx.stroke()

    // X轴标签
    if (dataPoints.length > 1) {
      const xLabelCount = Math.min(dataPoints.length, 7)
      const step = Math.floor(dataPoints.length / xLabelCount)

      for (let i = 0; i < dataPoints.length; i += step) {
        const x = margin.left + (i / (dataPoints.length - 1)) * width
        const date = new Date(dataPoints[i].timestamp)

        ctx.fillStyle = "#64748b"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(format(date, "MM/dd HH:mm", { locale: zhCN }), x, height + margin.top + 15)
      }
    }

    // 绘制延迟线
    ctx.beginPath()
    ctx.strokeStyle = "#f59e0b" // 黄色
    ctx.lineWidth = 2

    // 添加阴影效果
    ctx.shadowColor = "#f59e0b"
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    for (let i = 0; i < dataPoints.length; i++) {
      const x = margin.left + (i / (dataPoints.length - 1)) * width
      const y = margin.top + height - (dataPoints[i].ping / pingScale) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // 重置阴影
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    // 绘制抖动线
    ctx.beginPath()
    ctx.strokeStyle = "#ef4444" // 红色
    ctx.lineWidth = 2

    // 添加阴影效果
    ctx.shadowColor = "#ef4444"
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    for (let i = 0; i < dataPoints.length; i++) {
      const x = margin.left + (i / (dataPoints.length - 1)) * width
      const y = margin.top + height - (dataPoints[i].jitter / pingScale) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // 重置阴影
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    // 绘制丢包率线
    ctx.beginPath()
    ctx.strokeStyle = "#8b5cf6" // 紫色
    ctx.lineWidth = 2
    ctx.setLineDash([3, 2])

    for (let i = 0; i < dataPoints.length; i++) {
      const x = margin.left + (i / (dataPoints.length - 1)) * width
      const y = margin.top + height - (dataPoints[i].packetLoss / packetLossScale) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // 重置虚线
    ctx.setLineDash([])

    // 绘制图例
    ctx.fillStyle = "#0f172a"
    ctx.font = "12px sans-serif"

    // 延迟图例
    ctx.beginPath()
    ctx.strokeStyle = "#f59e0b"
    ctx.lineWidth = 2
    ctx.moveTo(margin.left, margin.top / 2)
    ctx.lineTo(margin.left + 20, margin.top / 2)
    ctx.stroke()
    ctx.fillText("延迟", margin.left + 25, margin.top / 2 + 4)

    // 抖动图例
    ctx.beginPath()
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 2
    ctx.moveTo(margin.left + 80, margin.top / 2)
    ctx.lineTo(margin.left + 100, margin.top / 2)
    ctx.stroke()
    ctx.fillText("抖动", margin.left + 105, margin.top / 2 + 4)

    // 丢包率图例
    ctx.beginPath()
    ctx.strokeStyle = "#8b5cf6"
    ctx.lineWidth = 2
    ctx.setLineDash([3, 2])
    ctx.moveTo(margin.left + 160, margin.top / 2)
    ctx.lineTo(margin.left + 180, margin.top / 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillText("丢包率", margin.left + 185, margin.top / 2 + 4)
  }

  // 绘制质量评分图表
  function drawQualityScoreChart(
    ctx: CanvasRenderingContext2D,
    data: NetworkMonitorData,
    margin: { top: number; right: number; bottom: number; left: number },
    width: number,
    height: number,
  ) {
    const dataPoints = data.dataPoints

    // 质量评分的范围是0-100
    const maxScore = 100

    // 绘制坐标轴
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, height + margin.top)
    ctx.lineTo(width + margin.left, height + margin.top)
    ctx.stroke()

    // 绘制网格线和Y轴标签
    const yGridCount = 5
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 0.5

    for (let i = 0; i <= yGridCount; i++) {
      const y = margin.top + (height / yGridCount) * i
      ctx.moveTo(margin.left, y)
      ctx.lineTo(width + margin.left, y)

      const value = maxScore - (maxScore / yGridCount) * i
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`${value.toFixed(0)}`, margin.left - 5, y + 3)
    }
    ctx.stroke()

    // X轴标签
    if (dataPoints.length > 1) {
      const xLabelCount = Math.min(dataPoints.length, 7)
      const step = Math.floor(dataPoints.length / xLabelCount)

      for (let i = 0; i < dataPoints.length; i += step) {
        const x = margin.left + (i / (dataPoints.length - 1)) * width
        const date = new Date(dataPoints[i].timestamp)

        ctx.fillStyle = "#64748b"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(format(date, "MM/dd HH:mm", { locale: zhCN }), x, height + margin.top + 15)
      }
    }

    // 绘制质量评分区域
    ctx.fillStyle = "rgba(56, 189, 248, 0.2)"
    ctx.beginPath()
    ctx.moveTo(margin.left, height + margin.top)

    for (let i = 0; i < dataPoints.length; i++) {
      const x = margin.left + (i / (dataPoints.length - 1)) * width
      const y = margin.top + height - (dataPoints[i].qualityScore / maxScore) * height
      ctx.lineTo(x, y)
    }

    ctx.lineTo(margin.left + width, height + margin.top)
    ctx.closePath()
    ctx.fill()

    // 绘制质量评分线
    ctx.beginPath()
    ctx.strokeStyle = "#0284c7" // 深蓝色
    ctx.lineWidth = 2

    // 添加阴影效果
    ctx.shadowColor = "#0284c7"
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    for (let i = 0; i < dataPoints.length; i++) {
      const x = margin.left + (i / (dataPoints.length - 1)) * width
      const y = margin.top + height - (dataPoints[i].qualityScore / maxScore) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // 绘制数据点
      ctx.fillStyle = "#0284c7"
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.stroke()

    // 重置阴影
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    // 绘制质量等级区域
    const qualityLevels = [
      { score: 90, label: "极佳", color: "rgba(34, 197, 94, 0.2)" },
      { score: 75, label: "优秀", color: "rgba(132, 204, 22, 0.2)" },
      { score: 60, label: "良好", color: "rgba(250, 204, 21, 0.2)" },
      { score: 40, label: "一般", color: "rgba(249, 115, 22, 0.2)" },
      { score: 0, label: "较差", color: "rgba(239, 68, 68, 0.2)" },
    ]

    for (let i = 0; i < qualityLevels.length - 1; i++) {
      const upperScore = qualityLevels[i].score
      const lowerScore = qualityLevels[i + 1].score

      const upperY = margin.top + height - (upperScore / maxScore) * height
      const lowerY = margin.top + height - (lowerScore / maxScore) * height

      ctx.fillStyle = qualityLevels[i].color
      ctx.fillRect(margin.left, upperY, width, lowerY - upperY)

      // 添加等级标签
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(qualityLevels[i].label, margin.left + width + 5, (upperY + lowerY) / 2 + 3)
    }

    // 添加平均线
    ctx.beginPath()
    ctx.strokeStyle = "#0284c7"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 3])
    const avgScoreY = margin.top + height - (data.stats.avgQualityScore / maxScore) * height
    ctx.moveTo(margin.left, avgScoreY)
    ctx.lineTo(margin.left + width, avgScoreY)
    ctx.stroke()

    // 重置虚线
    ctx.setLineDash([])

    // 添加平均值标签
    ctx.fillStyle = "#0284c7"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(`平均: ${data.stats.avgQualityScore.toFixed(0)}分`, margin.left + 5, avgScoreY - 5)
  }

  // 绘制速度分布图表
  function drawSpeedDistributionChart(
    ctx: CanvasRenderingContext2D,
    data: NetworkMonitorData,
    margin: { top: number; right: number; bottom: number; left: number },
    width: number,
    height: number,
  ) {
    const dataPoints = data.dataPoints

    // 创建下载和上传速度的分布数据
    const downloadBins: { [key: string]: number } = {}
    const uploadBins: { [key: string]: number } = {}

    // 确定速度范围
    const maxDownload = Math.max(...dataPoints.map((dp) => dp.download))
    const maxUpload = Math.max(...dataPoints.map((dp) => dp.upload))
    const maxSpeed = Math.max(maxDownload, maxUpload)

    // 创建10个区间
    const binCount = 10
    const binSize = maxSpeed / binCount

    // 初始化区间
    for (let i = 0; i < binCount; i++) {
      const binStart = i * binSize
      const binEnd = (i + 1) * binSize
      const binLabel = `${binStart.toFixed(0)}-${binEnd.toFixed(0)}`

      downloadBins[binLabel] = 0
      uploadBins[binLabel] = 0
    }

    // 填充数据
    dataPoints.forEach((dp) => {
      const downloadBin = Math.floor(dp.download / binSize)
      const uploadBin = Math.floor(dp.upload / binSize)

      if (downloadBin < binCount) {
        const binStart = downloadBin * binSize
        const binEnd = (downloadBin + 1) * binSize
        const binLabel = `${binStart.toFixed(0)}-${binEnd.toFixed(0)}`

        downloadBins[binLabel] = (downloadBins[binLabel] || 0) + 1
      }

      if (uploadBin < binCount) {
        const binStart = uploadBin * binSize
        const binEnd = (uploadBin + 1) * binSize
        const binLabel = `${binStart.toFixed(0)}-${binEnd.toFixed(0)}`

        uploadBins[binLabel] = (uploadBins[binLabel] || 0) + 1
      }
    })

    // 找出最大计数用于缩放
    const maxCount = Math.max(...Object.values(downloadBins), ...Object.values(uploadBins))

    // 绘制坐标轴
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, height + margin.top)
    ctx.lineTo(width + margin.left, height + margin.top)
    ctx.stroke()

    // 绘制Y轴标签
    const yGridCount = 5
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 0.5

    for (let i = 0; i <= yGridCount; i++) {
      const y = margin.top + (height / yGridCount) * i
      ctx.moveTo(margin.left, y)
      ctx.lineTo(width + margin.left, y)

      const value = maxCount - (maxCount / yGridCount) * i
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`${Math.round(value)}`, margin.left - 5, y + 3)
    }
    ctx.stroke()

    // 绘制柱状图
    const binLabels = Object.keys(downloadBins)
    const barWidth = width / (binLabels.length * 2 + 1) // 每个区间有两个柱子，加上间隔

    binLabels.forEach((label, index) => {
      const x = margin.left + (index * 2 + 0.5) * barWidth

      // 下载速度柱
      const downloadCount = downloadBins[label] || 0
      const downloadHeight = (downloadCount / maxCount) * height

      ctx.fillStyle = "rgba(14, 165, 233, 0.7)"
      ctx.fillRect(x, margin.top + height - downloadHeight, barWidth * 0.8, downloadHeight)

      // 上传速度柱
      const uploadCount = uploadBins[label] || 0
      const uploadHeight = (uploadCount / maxCount) * height

      ctx.fillStyle = "rgba(16, 185, 129, 0.7)"
      ctx.fillRect(x + barWidth, margin.top + height - uploadHeight, barWidth * 0.8, uploadHeight)

      // X轴标签
      if (index % 2 === 0) {
        ctx.fillStyle = "#64748b"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(`${label}`, x + barWidth / 2, height + margin.top + 15)
      }
    })

    // 绘制图例
    ctx.fillStyle = "#0f172a"
    ctx.font = "12px sans-serif"

    // 下载图例
    ctx.fillStyle = "rgba(14, 165, 233, 0.7)"
    ctx.fillRect(margin.left, margin.top / 2 - 5, 15, 10)
    ctx.fillStyle = "#0f172a"
    ctx.fillText("下载速度", margin.left + 20, margin.top / 2 + 4)

    // 上传图例
    ctx.fillStyle = "rgba(16, 185, 129, 0.7)"
    ctx.fillRect(margin.left + 100, margin.top / 2 - 5, 15, 10)
    ctx.fillStyle = "#0f172a"
    ctx.fillText("上传速度", margin.left + 120, margin.top / 2 + 4)

    // 添加X轴标题
    ctx.fillStyle = "#64748b"
    ctx.font = "11px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("速度范围 (Mbps)", margin.left + width / 2, height + margin.top + 30)

    // 添加Y轴标题
    ctx.save()
    ctx.translate(margin.left - 30, margin.top + height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillText("测试次数", 0, 0)
    ctx.restore()
  }

  // 绘制延迟稳定性图表
  function drawLatencyStabilityChart(
    ctx: CanvasRenderingContext2D,
    data: NetworkMonitorData,
    margin: { top: number; right: number; bottom: number; left: number },
    width: number,
    height: number,
  ) {
    const dataPoints = data.dataPoints

    // 找出最大值用于缩放
    const maxPing = Math.max(...dataPoints.map((dp) => dp.ping))
    const maxJitter = Math.max(...dataPoints.map((dp) => dp.jitter))

    // 计算每个数据点的延迟波动范围
    const pingRanges = dataPoints.map((dp) => ({
      timestamp: dp.timestamp,
      ping: dp.ping,
      lower: Math.max(0, dp.ping - dp.jitter),
      upper: dp.ping + dp.jitter,
    }))

    const maxValue = Math.max(maxPing + maxJitter, 100) * 1.1

    // 绘制坐标轴
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, height + margin.top)
    ctx.lineTo(width + margin.left, height + margin.top)
    ctx.stroke()

    // 绘制网格线和Y轴标签
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
      ctx.fillText(`${value.toFixed(0)} ms`, margin.left - 5, y + 3)
    }
    ctx.stroke()

    // X轴标签
    if (dataPoints.length > 1) {
      const xLabelCount = Math.min(dataPoints.length, 7)
      const step = Math.floor(dataPoints.length / xLabelCount)

      for (let i = 0; i < dataPoints.length; i += step) {
        const x = margin.left + (i / (dataPoints.length - 1)) * width
        const date = new Date(dataPoints[i].timestamp)

        ctx.fillStyle = "#64748b"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(format(date, "MM/dd HH:mm", { locale: zhCN }), x, height + margin.top + 15)
      }
    }

    // 绘制延迟波动范围区域
    ctx.fillStyle = "rgba(245, 158, 11, 0.2)"

    ctx.beginPath()
    // 先绘制上边界
    for (let i = 0; i < pingRanges.length; i++) {
      const x = margin.left + (i / (pingRanges.length - 1)) * width
      const y = margin.top + height - (pingRanges[i].upper / maxValue) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    // 再绘制下边界（反向）
    for (let i = pingRanges.length - 1; i >= 0; i--) {
      const x = margin.left + (i / (pingRanges.length - 1)) * width
      const y = margin.top + height - (pingRanges[i].lower / maxValue) * height

      ctx.lineTo(x, y)
    }

    ctx.closePath()
    ctx.fill()

    // 绘制延迟线
    ctx.beginPath()
    ctx.strokeStyle = "#f59e0b" // 黄色
    ctx.lineWidth = 2

    // 添加阴影效果
    ctx.shadowColor = "#f59e0b"
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    for (let i = 0; i < pingRanges.length; i++) {
      const x = margin.left + (i / (pingRanges.length - 1)) * width
      const y = margin.top + height - (pingRanges[i].ping / maxValue) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // 绘制数据点
      ctx.fillStyle = "#f59e0b"
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.stroke()

    // 重置阴影
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    // 绘制图例
    ctx.fillStyle = "#0f172a"
    ctx.font = "12px sans-serif"

    // 延迟图例
    ctx.beginPath()
    ctx.strokeStyle = "#f59e0b"
    ctx.lineWidth = 2
    ctx.moveTo(margin.left, margin.top / 2)
    ctx.lineTo(margin.left + 20, margin.top / 2)
    ctx.stroke()
    ctx.fillText("延迟", margin.left + 25, margin.top / 2 + 4)

    // 波动范围图例
    ctx.fillStyle = "rgba(245, 158, 11, 0.2)"
    ctx.fillRect(margin.left + 80, margin.top / 2 - 5, 15, 10)
    ctx.fillStyle = "#0f172a"
    ctx.fillText("波动范围", margin.left + 100, margin.top / 2 + 4)

    // 添加稳定性指标
    ctx.fillStyle = "#64748b"
    ctx.font = "11px sans-serif"
    ctx.textAlign = "right"
    ctx.fillText(`延迟稳定性: ${data.stats.pingStability}%`, margin.left + width, margin.top + 15)
  }

  return (
    <div className={title ? undefined : "h-full"}>
      {title && (
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <div style={{ height: `${height}px` }}>
              <canvas ref={canvasRef} className="w-full h-full" />
            </div>
          </CardContent>
        </Card>
      )}
      {!title && <canvas ref={canvasRef} className="w-full h-full" />}
    </div>
  )
}
