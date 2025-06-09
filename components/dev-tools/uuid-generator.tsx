"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Copy, Check, RefreshCw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { generateUUID, trackToolUsage } from "@/lib/dev-tools"
import { useRouter } from "next/navigation"

export default function UuidGenerator() {
  const router = useRouter()
  const [uuids, setUuids] = useState<string[]>([])
  const [copied, setCopied] = useState<Record<string, boolean>>({})
  const [count, setCount] = useState(5)
  const [version, setVersion] = useState("v4")
  const [uppercase, setUppercase] = useState(false)
  const [noDashes, setNoDashes] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    trackToolUsage("uuid-generator")
    generateUuids()
  }, [])

  const generateUuids = () => {
    const newUuids = Array.from({ length: count }, () => {
      let uuid = generateUUID()

      if (uppercase) {
        uuid = uuid.toUpperCase()
      }

      if (noDashes) {
        uuid = uuid.replace(/-/g, "")
      }

      return uuid
    })

    setUuids(newUuids)
    setCopied({})
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [index]: true })
    setTimeout(() => setCopied({ ...copied, [index]: false }), 2000)
  }

  const copyAll = () => {
    const allUuids = uuids.join("\n")
    navigator.clipboard.writeText(allUuids)
    setCopied({ ...copied, all: true })
    setTimeout(() => setCopied({ ...copied, all: false }), 2000)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/dev-tools")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">UUID生成器</h1>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-medium">生成选项</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4 mr-2" />
              {showSettings ? "隐藏设置" : "显示设置"}
            </Button>
          </div>

          {showSettings && (
            <div className="space-y-4 p-4 border rounded-md">
              <Tabs defaultValue="v4" value={version} onValueChange={setVersion}>
                <TabsList className="mb-4">
                  <TabsTrigger value="v4">UUID v4 (随机)</TabsTrigger>
                  <TabsTrigger value="v1" disabled>
                    UUID v1 (时间)
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>生成数量: {count}</Label>
                </div>
                <Slider value={[count]} min={1} max={50} step={1} onValueChange={(value) => setCount(value[0])} />
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="uppercase" checked={uppercase} onCheckedChange={setUppercase} />
                  <Label htmlFor="uppercase">大写字母</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="no-dashes" checked={noDashes} onCheckedChange={setNoDashes} />
                  <Label htmlFor="no-dashes">移除连字符</Label>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={generateUuids} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              生成 UUID
            </Button>
            <Button variant="outline" onClick={copyAll} disabled={uuids.length === 0}>
              {copied["all"] ? (
                <>
                  <Check className="h-4 w-4 mr-2" /> 已复制全部
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" /> 复制全部
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-medium">生成的 UUID</h2>

          {uuids.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">点击"生成UUID"按钮生成新的UUID</p>
            </div>
          ) : (
            <div className="space-y-2">
              {uuids.map((uuid, index) => (
                <div key={index} className="flex space-x-2">
                  <Input value={uuid} readOnly className="font-mono" />
                  <Button variant="outline" size="icon" onClick={() => handleCopy(uuid, index)}>
                    {copied[index] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
