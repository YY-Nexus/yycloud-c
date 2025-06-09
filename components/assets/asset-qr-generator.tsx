/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产二维码生成器组件
 * ==========================================
 */

"use client"

import { Switch } from "@/components/ui/switch"

import { Textarea } from "@/components/ui/textarea"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Download, Printer, Copy, Settings, Smartphone } from "lucide-react"
import type { Asset } from "@/types/asset"
import { YYGetAssets } from "@/lib/asset-manager"
import { toast } from "@/hooks/use-toast"

// QR码生成函数
const generateQRCode = async (text: string, size = 300, color = "#000000") => {
  // 使用QRCode.js库
  const QRCode = await import("qrcode")
  return QRCode.toDataURL(text, {
    width: size,
    margin: 1,
    color: {
      dark: color,
      light: "#ffffff",
    },
  })
}

export function AssetQRGenerator() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAssetId, setSelectedAssetId] = useState<string>("")
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
  const [qrSize, setQrSize] = useState<number>(300)
  const [qrColor, setQrColor] = useState<string>("#000000")
  const [customText, setCustomText] = useState<string>("")
  const [qrMode, setQrMode] = useState<"asset" | "custom">("asset")
  const [isLoading, setIsLoading] = useState(true)
  const [labelText, setLabelText] = useState<string>("")
  const [showLabel, setShowLabel] = useState<boolean>(true)
  const qrCodeRef = useRef<HTMLDivElement>(null)

  // 加载资产数据
  useEffect(() => {
    const loadAssets = async () => {
      setIsLoading(true)
      try {
        const allAssets = await YYGetAssets()
        setAssets(allAssets)
        if (allAssets.length > 0) {
          setSelectedAssetId(allAssets[0].id)
        }
      } catch (error) {
        console.error("加载资产数据失败:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAssets()
  }, [])

  // 生成二维码
  useEffect(() => {
    const generateCode = async () => {
      try {
        let text = ""
        let label = ""

        if (qrMode === "asset" && selectedAssetId) {
          const asset = assets.find((a) => a.id === selectedAssetId)
          if (asset) {
            // 创建资产信息JSON
            const assetInfo = {
              id: asset.id,
              name: asset.name,
              brand: asset.brand,
              model: asset.model,
              serialNumber: asset.serialNumber,
              category: asset.category,
            }
            text = JSON.stringify(assetInfo)
            label = asset.name
          }
        } else if (qrMode === "custom") {
          text = customText
          label = "自定义二维码"
        }

        if (text) {
          const dataUrl = await generateQRCode(text, qrSize, qrColor)
          setQrCodeDataUrl(dataUrl)
          setLabelText(label)
        }
      } catch (error) {
        console.error("生成二维码失败:", error)
        toast({
          title: "生成失败",
          description: "无法生成二维码",
          variant: "destructive",
        })
      }
    }

    generateCode()
  }, [selectedAssetId, qrMode, customText, qrSize, qrColor, assets])

  // 下载二维码
  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return

    const link = document.createElement("a")
    link.href = qrCodeDataUrl
    link.download = `qrcode-${qrMode === "asset" ? selectedAssetId : "custom"}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "下载成功",
      description: "二维码已下载为PNG图片",
    })
  }

  // 打印二维码
  const printQRCode = () => {
    if (!qrCodeRef.current) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast({
        title: "打印失败",
        description: "无法打开打印窗口，请检查浏览器设置",
        variant: "destructive",
      })
      return
    }

    const asset = assets.find((a) => a.id === selectedAssetId)
    const assetName = asset ? asset.name : "自定义二维码"

    printWindow.document.write(`
      <html>
        <head>
          <title>资产二维码 - ${assetName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            .qr-container {
              display: inline-block;
              border: 1px solid #ddd;
              padding: 15px;
              margin-bottom: 20px;
            }
            .qr-label {
              margin-top: 10px;
              font-size: 14px;
              font-weight: bold;
            }
            .qr-info {
              margin-top: 5px;
              font-size: 12px;
              color: #666;
            }
            @media print {
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <img src="${qrCodeDataUrl}" alt="资产二维码" />
            ${showLabel ? `<div class="qr-label">${labelText}</div>` : ""}
            ${
              asset
                ? `
                <div class="qr-info">${asset.brand} ${asset.model}</div>
                ${asset.serialNumber ? `<div class="qr-info">序列号: ${asset.serialNumber}</div>` : ""}
                `
                : ""
            }
          </div>
          <button onclick="window.print();window.close()">打印</button>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  // 复制二维码
  const copyQRCode = () => {
    if (!qrCodeDataUrl) return

    // 创建一个临时的canvas元素
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        if (!blob) return

        // 复制到剪贴板
        try {
          const item = new ClipboardItem({ "image/png": blob })
          navigator.clipboard.write([item]).then(
            () => {
              toast({
                title: "复制成功",
                description: "二维码已复制到剪贴板",
              })
            },
            () => {
              toast({
                title: "复制失败",
                description: "无法访问剪贴板",
                variant: "destructive",
              })
            },
          )
        } catch (error) {
          toast({
            title: "复制失败",
            description: "您的浏览器不支持图片复制",
            variant: "destructive",
          })
        }
      })
    }
    img.src = qrCodeDataUrl
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>资产二维码生成器</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">正在加载资产数据...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="h-5 w-5 mr-2" />
          资产二维码生成器
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={qrMode} onValueChange={(value) => setQrMode(value as "asset" | "custom")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="asset">
              <Smartphone className="h-4 w-4 mr-2" />
              资产二维码
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Settings className="h-4 w-4 mr-2" />
              自定义二维码
            </TabsTrigger>
          </TabsList>

          <TabsContent value="asset" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="asset-select">选择资产</Label>
              <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                <SelectTrigger id="asset-select">
                  <SelectValue placeholder="选择资产" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name} ({asset.brand} {asset.model})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="custom-text">自定义文本</Label>
              <Textarea
                id="custom-text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="输入要编码的文本、URL或联系信息..."
                rows={4}
              />
            </div>
          </TabsContent>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="qr-size">二维码大小</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="qr-size"
                    type="range"
                    min="100"
                    max="500"
                    step="10"
                    value={qrSize}
                    onChange={(e) => setQrSize(Number.parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{qrSize}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qr-color">二维码颜色</Label>
                <div className="flex space-x-2">
                  <Input
                    id="qr-color"
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="flex-1"
                    maxLength={7}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-label">显示标签</Label>
                  <Switch id="show-label" checked={showLabel} onCheckedChange={setShowLabel} />
                </div>
                {showLabel && (
                  <Input
                    value={labelText}
                    onChange={(e) => setLabelText(e.target.value)}
                    placeholder="自定义标签文本"
                  />
                )}
              </div>

              <div className="flex space-x-2">
                <Button onClick={downloadQRCode} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  下载
                </Button>
                <Button onClick={printQRCode} variant="outline" className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  打印
                </Button>
                <Button onClick={copyQRCode} variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  复制
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div ref={qrCodeRef} className="bg-white p-4 rounded-lg shadow-sm border flex flex-col items-center">
                {qrCodeDataUrl ? (
                  <>
                    <img src={qrCodeDataUrl || "/placeholder.svg"} alt="资产二维码" className="max-w-full" />
                    {showLabel && labelText && <div className="mt-2 text-center font-medium">{labelText}</div>}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 w-64">
                    <p className="text-muted-foreground">二维码将显示在这里</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
