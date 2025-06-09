"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Copy, Check, Calendar, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trackToolUsage, timestampToDate, dateToTimestamp } from "@/lib/dev-tools"
import { useRouter } from "next/navigation"

export default function TimestampConverter() {
  const router = useRouter()
  const [timestamp, setTimestamp] = useState(Date.now())
  const [dateString, setDateString] = useState("")
  const [timeString, setTimeString] = useState("")
  const [copied, setCopied] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("timestamp-to-date")

  useEffect(() => {
    trackToolUsage("timestamp-converter")
    updateDateTime()
  }, [])

  useEffect(() => {
    if (activeTab === "timestamp-to-date") {
      updateDateTime()
    } else {
      updateTimestamp()
    }
  }, [activeTab])

  const updateDateTime = () => {
    const date = timestampToDate(timestamp)
    setDateString(formatDate(date))
    setTimeString(formatTime(date))
  }

  const updateTimestamp = () => {
    try {
      const dateObj = new Date(`${dateString}T${timeString || "00:00:00"}`)
      if (!isNaN(dateObj.getTime())) {
        setTimestamp(dateToTimestamp(dateObj))
      }
    } catch (error) {
      console.error("Invalid date format", error)
    }
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const formatTime = (date: Date) => {
    return date.toTimeString().split(" ")[0]
  }

  const handleTimestampChange = (value: string) => {
    const num = Number.parseInt(value)
    if (!isNaN(num)) {
      setTimestamp(num)
      updateDateTime()
    }
  }

  const handleDateChange = (value: string) => {
    setDateString(value)
    updateTimestamp()
  }

  const handleTimeChange = (value: string) => {
    setTimeString(value)
    updateTimestamp()
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [type]: true })
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000)
  }

  const setCurrentTimestamp = () => {
    const now = Date.now()
    setTimestamp(now)
    updateDateTime()
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/dev-tools")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">时间戳转换</h1>
      </div>

      <Tabs defaultValue="timestamp-to-date" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="timestamp-to-date">时间戳转日期</TabsTrigger>
          <TabsTrigger value="date-to-timestamp">日期转时间戳</TabsTrigger>
        </TabsList>

        <TabsContent value="timestamp-to-date">
          <Card>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="timestamp">Unix时间戳 (毫秒)</Label>
                  <Button variant="outline" size="sm" onClick={setCurrentTimestamp}>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    当前时间
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Input
                    id="timestamp"
                    value={timestamp}
                    onChange={(e) => handleTimestampChange(e.target.value)}
                    className="font-mono"
                  />
                  <Button variant="outline" size="icon" onClick={() => handleCopy(timestamp.toString(), "timestamp")}>
                    {copied["timestamp"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    日期
                  </Label>
                  <div className="flex space-x-2">
                    <Input value={dateString} readOnly className="font-mono" />
                    <Button variant="outline" size="icon" onClick={() => handleCopy(dateString, "date")}>
                      {copied["date"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    时间
                  </Label>
                  <div className="flex space-x-2">
                    <Input value={timeString} readOnly className="font-mono" />
                    <Button variant="outline" size="icon" onClick={() => handleCopy(timeString, "time")}>
                      {copied["time"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>格式化日期时间</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">本地时间</div>
                    <div className="font-medium">{new Date(timestamp).toLocaleString("zh-CN")}</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">ISO 8601</div>
                    <div className="font-medium">{new Date(timestamp).toISOString()}</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">UTC 时间</div>
                    <div className="font-medium">{new Date(timestamp).toUTCString()}</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">相对时间</div>
                    <div className="font-medium">{getRelativeTimeString(timestamp)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="date-to-timestamp">
          <Card>
            <CardContent className="p-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date-input" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    日期
                  </Label>
                  <Input
                    id="date-input"
                    type="date"
                    value={dateString}
                    onChange={(e) => handleDateChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-input" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    时间
                  </Label>
                  <Input
                    id="time-input"
                    type="time"
                    value={timeString}
                    onChange={(e) => handleTimeChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Unix时间戳</Label>
                  <Button variant="outline" size="sm" onClick={setCurrentTimestamp}>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    当前时间
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">毫秒</div>
                    <div className="flex space-x-2">
                      <Input value={timestamp} readOnly className="font-mono" />
                      <Button variant="outline" size="icon" onClick={() => handleCopy(timestamp.toString(), "ms")}>
                        {copied["ms"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">秒</div>
                    <div className="flex space-x-2">
                      <Input value={Math.floor(timestamp / 1000)} readOnly className="font-mono" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopy(Math.floor(timestamp / 1000).toString(), "sec")}
                      >
                        {copied["sec"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>预览</Label>
                <div className="p-3 border rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">格式化日期时间</div>
                  <div className="font-medium">{new Date(timestamp).toLocaleString("zh-CN")}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// 获取相对时间字符串
function getRelativeTimeString(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  // 未来时间
  if (diff < 0) {
    const absDiff = Math.abs(diff)
    if (absDiff < 60000) return `${Math.round(absDiff / 1000)}秒后`
    if (absDiff < 3600000) return `${Math.round(absDiff / 60000)}分钟后`
    if (absDiff < 86400000) return `${Math.round(absDiff / 3600000)}小时后`
    if (absDiff < 2592000000) return `${Math.round(absDiff / 86400000)}天后`
    if (absDiff < 31536000000) return `${Math.round(absDiff / 2592000000)}个月后`
    return `${Math.round(absDiff / 31536000000)}年后`
  }

  // 过去时间
  if (diff < 60000) return `${Math.round(diff / 1000)}秒前`
  if (diff < 3600000) return `${Math.round(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.round(diff / 3600000)}小时前`
  if (diff < 2592000000) return `${Math.round(diff / 86400000)}天前`
  if (diff < 31536000000) return `${Math.round(diff / 2592000000)}个月前`
  return `${Math.round(diff / 31536000000)}年前`
}
