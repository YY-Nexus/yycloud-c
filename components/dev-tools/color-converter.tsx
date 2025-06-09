"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Copy, Check, Palette, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { hexToRgb, rgbToHex, trackToolUsage, saveColorPalette, getColorPalettes } from "@/lib/dev-tools"
import type { ColorPalette } from "@/types/dev-tools"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function ColorConverter() {
  const router = useRouter()
  const [hex, setHex] = useState("#3b82f6")
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [copied, setCopied] = useState<Record<string, boolean>>({})
  const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [paletteName, setPaletteName] = useState("")
  const [currentColors, setCurrentColors] = useState<string[]>([])

  useEffect(() => {
    trackToolUsage("color-converter")
    setColorPalettes(getColorPalettes())
  }, [])

  const handleHexChange = (value: string) => {
    if (!/^#[0-9A-F]{6}$/i.test(value) && value.length === 7) return

    setHex(value)

    if (value.length === 7) {
      const rgbResult = hexToRgb(value)
      if (rgbResult) {
        setRgb(rgbResult)
        const hslResult = rgbToHsl(rgbResult.r, rgbResult.g, rgbResult.b)
        setHsl(hslResult)
      }
    }
  }

  const handleRgbChange = (component: "r" | "g" | "b", value: number) => {
    const newRgb = { ...rgb, [component]: value }
    setRgb(newRgb)
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
  }

  const handleHslChange = (component: "h" | "s" | "l", value: number) => {
    const newHsl = { ...hsl, [component]: value }
    setHsl(newHsl)
    const rgbResult = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    setRgb(rgbResult)
    setHex(rgbToHex(rgbResult.r, rgbResult.g, rgbResult.b))
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [type]: true })
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000)
  }

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)

    setRgb({ r, g, b })
    setHex(rgbToHex(r, g, b))
    setHsl(rgbToHsl(r, g, b))
  }

  const generateColorShades = () => {
    const shades: string[] = []
    const { h, s } = hsl

    // 生成10个不同亮度的色调
    for (let l = 10; l <= 90; l += 10) {
      const rgbColor = hslToRgb(h, s, l)
      shades.push(rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b))
    }

    return shades
  }

  const generateComplementaryColors = () => {
    const colors: string[] = [hex]
    const { h, s, l } = hsl

    // 互补色
    const complementary = hslToRgb((h + 180) % 360, s, l)
    colors.push(rgbToHex(complementary.r, complementary.g, complementary.b))

    // 三分色
    const triadic1 = hslToRgb((h + 120) % 360, s, l)
    const triadic2 = hslToRgb((h + 240) % 360, s, l)
    colors.push(rgbToHex(triadic1.r, triadic1.g, triadic1.b))
    colors.push(rgbToHex(triadic2.r, triadic2.g, triadic2.b))

    // 类似色
    const analogous1 = hslToRgb((h + 30) % 360, s, l)
    const analogous2 = hslToRgb((h + 330) % 360, s, l)
    colors.push(rgbToHex(analogous1.r, analogous1.g, analogous1.b))
    colors.push(rgbToHex(analogous2.r, analogous2.g, analogous2.b))

    return colors
  }

  const handleSavePalette = (colors: string[]) => {
    setCurrentColors(colors)
    setShowSaveDialog(true)
  }

  const savePalette = () => {
    if (!paletteName) return

    const newPalette = saveColorPalette({
      name: paletteName,
      colors: currentColors,
    })

    setColorPalettes([newPalette, ...colorPalettes])
    setPaletteName("")
    setShowSaveDialog(false)
  }

  // RGB转HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }

      h /= 6
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  // HSL转RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  const colorShades = generateColorShades()
  const complementaryColors = generateComplementaryColors()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/dev-tools")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">颜色转换器</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-32 h-32 rounded-md border" style={{ backgroundColor: hex }}></div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hex">HEX</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="hex"
                        value={hex}
                        onChange={(e) => handleHexChange(e.target.value)}
                        className="font-mono"
                      />
                      <Button variant="outline" size="icon" onClick={() => handleCopy(hex, "hex")}>
                        {copied["hex"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>RGB</Label>
                    <div className="flex space-x-2">
                      <div className="flex-1 space-x-2">
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={rgb.r}
                          onChange={(e) => handleRgbChange("r", Number.parseInt(e.target.value) || 0)}
                          className="w-20 font-mono"
                        />
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={rgb.g}
                          onChange={(e) => handleRgbChange("g", Number.parseInt(e.target.value) || 0)}
                          className="w-20 font-mono"
                        />
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={rgb.b}
                          onChange={(e) => handleRgbChange("b", Number.parseInt(e.target.value) || 0)}
                          className="w-20 font-mono"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "rgb")}
                      >
                        {copied["rgb"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>HSL</Label>
                    <div className="flex space-x-2">
                      <div className="flex-1 space-x-2">
                        <Input
                          type="number"
                          min="0"
                          max="359"
                          value={hsl.h}
                          onChange={(e) => handleHslChange("h", Number.parseInt(e.target.value) || 0)}
                          className="w-20 font-mono"
                        />
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={hsl.s}
                          onChange={(e) => handleHslChange("s", Number.parseInt(e.target.value) || 0)}
                          className="w-20 font-mono"
                        />
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={hsl.l}
                          onChange={(e) => handleHslChange("l", Number.parseInt(e.target.value) || 0)}
                          className="w-20 font-mono"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "hsl")}
                      >
                        {copied["hsl"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button onClick={generateRandomColor}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  生成随机颜色
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="shades">
            <TabsList className="mb-4">
              <TabsTrigger value="shades">色调变化</TabsTrigger>
              <TabsTrigger value="complementary">配色方案</TabsTrigger>
            </TabsList>

            <TabsContent value="shades">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">色调变化</h3>
                      <Button variant="outline" size="sm" onClick={() => handleSavePalette(colorShades)}>
                        保存调色板
                      </Button>
                    </div>
                    <div className="grid grid-cols-10 h-12 rounded-md overflow-hidden">
                      {colorShades.map((color, index) => (
                        <div
                          key={index}
                          className="cursor-pointer relative group"
                          style={{ backgroundColor: color }}
                          onClick={() => handleHexChange(color)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 text-white text-xs">
                            {color}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {colorShades.map((color, index) => (
                        <div key={index} className="text-center">
                          <div
                            className="h-16 rounded-md mb-1 cursor-pointer"
                            style={{ backgroundColor: color }}
                            onClick={() => handleHexChange(color)}
                          ></div>
                          <div className="text-xs font-mono">{color}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="complementary">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">配色方案</h3>
                      <Button variant="outline" size="sm" onClick={() => handleSavePalette(complementaryColors)}>
                        保存调色板
                      </Button>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {complementaryColors.map((color, index) => (
                        <div key={index} className="text-center">
                          <div
                            className="h-20 rounded-md mb-1 cursor-pointer"
                            style={{ backgroundColor: color }}
                            onClick={() => handleHexChange(color)}
                          ></div>
                          <div className="text-xs font-mono">{color}</div>
                          <div className="text-xs text-muted-foreground">
                            {index === 0
                              ? "原色"
                              : index === 1
                                ? "互补色"
                                : index === 2 || index === 3
                                  ? "三分色"
                                  : "类似色"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="h-full">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                保存的调色板
              </h3>

              {colorPalettes.length === 0 ? (
                <div className="text-center py-8">
                  <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">没有保存的调色板</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {colorPalettes.map((palette) => (
                    <div key={palette.id} className="border rounded-md p-3">
                      <h4 className="font-medium mb-2">{palette.name}</h4>
                      <div className="grid grid-cols-8 h-6 rounded-md overflow-hidden mb-2">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            style={{ backgroundColor: color }}
                            className="cursor-pointer"
                            onClick={() => handleHexChange(color)}
                          ></div>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(palette.createdAt).toLocaleDateString("zh-CN")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>保存调色板</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">调色板名称</Label>
              <Input
                id="name"
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                placeholder="输入调色板名称..."
              />
            </div>
            <div>
              <Label>预览</Label>
              <div className="grid grid-cols-8 h-8 rounded-md overflow-hidden mt-2">
                {currentColors.map((color, index) => (
                  <div key={index} style={{ backgroundColor: color }}></div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              取消
            </Button>
            <Button onClick={savePalette} disabled={!paletteName}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
