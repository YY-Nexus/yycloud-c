"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Copy, Check, Key, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { trackToolUsage } from "@/lib/dev-tools"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function JwtDecoder() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [header, setHeader] = useState<any>(null)
  const [payload, setPayload] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<Record<string, boolean>>({})
  const [isExpired, setIsExpired] = useState(false)
  const [expiryTime, setExpiryTime] = useState<string | null>(null)

  useEffect(() => {
    trackToolUsage("jwt-decoder")
  }, [])

  const decodeToken = () => {
    try {
      setError(null)
      setIsExpired(false)
      setExpiryTime(null)

      if (!token.trim()) {
        setError("请输入JWT令牌")
        setHeader(null)
        setPayload(null)
        return
      }

      const parts = token.split(".")
      if (parts.length !== 3) {
        setError("无效的JWT格式")
        setHeader(null)
        setPayload(null)
        return
      }

      const decodedHeader = JSON.parse(atob(parts[0]))
      const decodedPayload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")))

      setHeader(decodedHeader)
      setPayload(decodedPayload)

      // 检查令牌是否过期
      if (decodedPayload.exp) {
        const expiryDate = new Date(decodedPayload.exp * 1000)
        const now = new Date()
        setIsExpired(expiryDate < now)
        setExpiryTime(expiryDate.toLocaleString("zh-CN"))
      }
    } catch (err) {
      setError("解析JWT时出错: " + (err as Error).message)
      setHeader(null)
      setPayload(null)
    }
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [type]: true })
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000)
  }

  const generateSampleToken = () => {
    // 生成一个示例JWT令牌
    const sampleHeader = {
      alg: "HS256",
      typ: "JWT",
    }

    const now = Math.floor(Date.now() / 1000)
    const samplePayload = {
      sub: "1234567890",
      name: "示例用户",
      iat: now,
      exp: now + 3600, // 1小时后过期
      role: "user",
      permissions: ["read", "write"],
    }

    const encodedHeader = btoa(JSON.stringify(sampleHeader))
    const encodedPayload = btoa(JSON.stringify(samplePayload))
    const sampleSignature = "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" // 假签名

    setToken(`${encodedHeader}.${encodedPayload}.${sampleSignature}`)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/dev-tools")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">JWT解码器</h1>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <h2 className="text-lg font-medium">JWT令牌</h2>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setToken("")}>
                清空
              </Button>
              <Button variant="outline" size="sm" onClick={generateSampleToken}>
                <RefreshCw className="h-4 w-4 mr-2" />
                示例令牌
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="在此粘贴JWT令牌..."
            className="min-h-[100px] font-mono"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button onClick={decodeToken} disabled={!token}>
            解码
          </Button>
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isExpired && (
        <Alert variant="destructive">
          <AlertDescription>此令牌已过期 (过期时间: {expiryTime})</AlertDescription>
        </Alert>
      )}

      {header && payload && (
        <Tabs defaultValue="payload">
          <TabsList className="mb-4">
            <TabsTrigger value="payload">载荷 (Payload)</TabsTrigger>
            <TabsTrigger value="header">头部 (Header)</TabsTrigger>
          </TabsList>

          <TabsContent value="payload">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">载荷 (Payload)</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(JSON.stringify(payload, null, 2), "payload")}
                  >
                    {copied["payload"] ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> 已复制
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" /> 复制
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
                  <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                    {JSON.stringify(payload, null, 2)}
                  </pre>
                </div>

                {payload.exp && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">令牌信息</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-xs text-muted-foreground">发行时间 (iat)</div>
                        <div className="font-medium">
                          {payload.iat ? new Date(payload.iat * 1000).toLocaleString("zh-CN") : "未指定"}
                        </div>
                      </div>
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-xs text-muted-foreground">过期时间 (exp)</div>
                        <div className="font-medium">
                          {payload.exp ? new Date(payload.exp * 1000).toLocaleString("zh-CN") : "未指定"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="header">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">头部 (Header)</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(JSON.stringify(header, null, 2), "header")}
                  >
                    {copied["header"] ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> 已复制
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" /> 复制
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
                  <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                    {JSON.stringify(header, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
