"use client"

import { useEffect, useRef } from "react"
import { type DeviceWithResults, calculateDevicePerformanceMetrics } from "@/lib/device-manager"

interface DevicePerformanceRadarProps {
  devices: DeviceWithResults[]
}

export function DevicePerformanceRadar({ devices }: DevicePerformanceRadarProps) {
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

    // 绘制雷达图
    drawRadarChart(ctx, devices, rect.width, rect.height)
  }, [devices])

  // 绘制雷达图
  function drawRadarChart(ctx: CanvasRenderingContext2D, devices: DeviceWithResults[], width: number, height: number) {
    // 计算每个设备的性能指标
    const deviceMetrics = devices.map((device) => ({
      device,
      metrics: calculateDevicePerformanceMetrics(device.results),
    }))

    // 定义雷达图的维度
    const metrics = [
      { key: "download", label: "下载速度", max: Math.max(...deviceMetrics.map((d) => d.metrics.avgDownload)) * 1.2 },
      { key: "upload", label: "上传速度", max: Math.max(...deviceMetrics.map((d) => d.metrics.avgUpload)) * 1.2 },
      { key: "ping", label: "延迟", max: Math.max(...deviceMetrics.map((d) => d.metrics.avgPing)) * 1.2, invert: true },
      {
        key: "jitter",
        label: "抖动",
        max: Math.max(...deviceMetrics.map((d) => d.metrics.avgJitter)) * 1.2,
        invert: true,
      },
      {
        key: "packetLoss",
        label: "丢包率",
        max: Math.max(...deviceMetrics.map((d) => d.metrics.avgPacketLoss), 5) * 1.2,
        invert: true,
      },
      { key: "qualityScore", label: "质量评分", max: 100 },
    ]

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) * 0.8

    // 绘制雷达图背景
    drawRadarBackground(ctx, centerX, centerY, radius, metrics.length)

    // 绘制坐标轴
    drawRadarAxes(ctx, centerX, centerY, radius, metrics)

    // 绘制每个设备的数据
    deviceMetrics.forEach((deviceMetric, index) => {
      drawDeviceData(ctx, centerX, centerY, radius, metrics, deviceMetric, index, deviceMetrics.length)
    })

    // 绘制图例
    drawLegend(ctx, deviceMetrics, width, height)
  }

  // 绘制雷达图背景
  function drawRadarBackground(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    sides: number,
  ) {
    // 绘制多边形背景
    const angleStep = (Math.PI * 2) / sides

    // 绘制多层背景
    const layers = 5
    for (let layer = 1; layer <= layers; layer++) {
      const layerRadius = (radius * layer) / layers

      ctx.beginPath()
      for (let i = 0; i < sides; i++) {
        const angle = i * angleStep - Math.PI / 2 // 从上方开始
        const x = centerX + layerRadius * Math.cos(angle)
        const y = centerY + layerRadius * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()

      // 设置背景样式
      ctx.fillStyle = `rgba(241, 245, 249, ${0.1 + (layer / layers) * 0.1})`
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 1

      ctx.fill()
      ctx.stroke()
    }
  }

  // 绘制雷达图坐标轴
  function drawRadarAxes(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    metrics: Array<{ key: string; label: string; max: number; invert?: boolean }>,
  ) {
    const sides = metrics.length
    const angleStep = (Math.PI * 2) / sides

    // 绘制坐标轴
    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep - Math.PI / 2 // 从上方开始
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 1
      ctx.stroke()

      // 绘制标签
      const labelX = centerX + (radius + 15) * Math.cos(angle)
      const labelY = centerY + (radius + 15) * Math.sin(angle)

      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // 根据角度调整文本位置，避免文字超出画布
      if (angle === -Math.PI / 2) {
        // 上
        ctx.textAlign = "center"
        ctx.textBaseline = "bottom"
      } else if (angle === Math.PI / 2) {
        // 下
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
      } else if (angle === 0) {
        // 右
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"
      } else if (angle === Math.PI) {
        // 左
        ctx.textAlign = "right"
        ctx.textBaseline = "middle"
      } else if (angle > -Math.PI / 2 && angle < 0) {
        // 右上
        ctx.textAlign = "left"
        ctx.textBaseline = "bottom"
      } else if (angle > 0 && angle < Math.PI / 2) {
        // 右下
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
      } else if (angle > Math.PI / 2 && angle < Math.PI) {
        // 左下
        ctx.textAlign = "right"
        ctx.textBaseline = "top"
      } else {
        // 左上
        ctx.textAlign = "right"
        ctx.textBaseline = "bottom"
      }

      ctx.fillText(metrics[i].label, labelX, labelY)
    }
  }

  // 绘制设备数据
  function drawDeviceData(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    metrics: Array<{ key: string; label: string; max: number; invert?: boolean }>,
    deviceMetric: { device: DeviceWithResults; metrics: any },
    deviceIndex: number,
    totalDevices: number,
  ) {
    const sides = metrics.length
    const angleStep = (Math.PI * 2) / sides

    // 获取设备颜色
    const color = getDeviceColor(deviceMetric.device.id, deviceIndex)

    // 绘制设备数据多边形
    ctx.beginPath()

    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep - Math.PI / 2 // 从上方开始
      const metricKey = metrics[i].key as keyof typeof deviceMetric.metrics
      let value = deviceMetric.metrics[metricKey]

      // 对于需要反转的指标（如延迟、抖动、丢包率），值越小越好
      if (metrics[i].invert) {
        // 反转值，但保持在0到max之间
        value = Math.max(0, metrics[i].max - value)
      }

      // 计算归一化后的半径
      const normalizedRadius = (value / metrics[i].max) * radius

      const x = centerX + normalizedRadius * Math.cos(angle)
      const y = centerY + normalizedRadius * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.closePath()

    // 设置填充样式
    ctx.fillStyle = `${color}33` // 添加透明度
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    ctx.fill()
    ctx.stroke()

    // 绘制数据点
    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep - Math.PI / 2
      const metricKey = metrics[i].key as keyof typeof deviceMetric.metrics
      let value = deviceMetric.metrics[metricKey]

      if (metrics[i].invert) {
        value = Math.max(0, metrics[i].max - value)
      }

      const normalizedRadius = (value / metrics[i].max) * radius

      const x = centerX + normalizedRadius * Math.cos(angle)
      const y = centerY + normalizedRadius * Math.sin(angle)

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    }
  }

  // 绘制图例
  function drawLegend(
    ctx: CanvasRenderingContext2D,
    deviceMetrics: Array<{ device: DeviceWithResults; metrics: any }>,
    width: number,
    height: number,
  ) {
    const legendY = height - 20
    let legendX = 20

    deviceMetrics.forEach((deviceMetric, index) => {
      const color = getDeviceColor(deviceMetric.device.id, index)

      // 绘制图例颜色块
      ctx.fillStyle = color
      ctx.fillRect(legendX, legendY - 5, 10, 10)

      // 绘制设备名称
      ctx.fillStyle = "#0f172a"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(deviceMetric.device.name, legendX + 15, legendY)

      // 更新下一个图例的位置
      legendX += ctx.measureText(deviceMetric.device.name).width + 40
    })
  }

  // 获取设备颜色
  function getDeviceColor(deviceId: string, index: number): string {
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

  return <canvas ref={canvasRef} className="w-full h-full" />
}
