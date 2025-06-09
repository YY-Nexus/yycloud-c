"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Send, Save, Trash, Clock, Plus, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { trackToolUsage, getApiRequests, saveApiRequest, deleteApiRequest } from "@/lib/dev-tools"
import type { ApiRequest, ApiResponse } from "@/types/dev-tools"
import { useRouter } from "next/navigation"

export default function ApiTester() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE" | "PATCH">("GET")
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }])
  const [params, setParams] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }])
  const [body, setBody] = useState("")
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedRequests, setSavedRequests] = useState<ApiRequest[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [requestName, setRequestName] = useState("")
  const [activeTab, setActiveTab] = useState("request")
  const [bodyType, setBodyType] = useState<"json" | "form-data" | "x-www-form-urlencoded" | "raw">("json")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    trackToolUsage("api-tester")
    setSavedRequests(getApiRequests())
  }, [])

  const sendRequest = async () => {
    if (!url) {
      setError("请输入URL")
      return
    }

    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      // 构建URL（添加查询参数）
      let fullUrl = url
      const validParams = params.filter((param) => param.key && param.value)
      if (validParams.length > 0) {
        const queryString = validParams
          .map((param) => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
          .join("&")
        fullUrl += (url.includes("?") ? "&" : "?") + queryString
      }

      // 构建请求头
      const requestHeaders: Record<string, string> = {}
      headers
        .filter((header) => header.key && header.value)
        .forEach((header) => {
          requestHeaders[header.key] = header.value
        })

      // 根据bodyType设置Content-Type
      if (method !== "GET" && bodyType) {
        switch (bodyType) {
          case "json":
            requestHeaders["Content-Type"] = "application/json"
            break
          case "form-data":
            // 不设置Content-Type，让浏览器自动设置boundary
            break
          case "x-www-form-urlencoded":
            requestHeaders["Content-Type"] = "application/x-www-form-urlencoded"
            break
          case "raw":
            requestHeaders["Content-Type"] = "text/plain"
            break
        }
      }

      // 准备请求体
      let requestBody: any = undefined
      if (method !== "GET" && body) {
        switch (bodyType) {
          case "json":
            try {
              requestBody = JSON.parse(body)
            } catch (e) {
              setError("无效的JSON格式")
              setIsLoading(false)
              return
            }
            break
          case "form-data":
            const formData = new FormData()
            try {
              const jsonData = JSON.parse(body)
              Object.entries(jsonData).forEach(([key, value]) => {
                formData.append(key, value as string)
              })
            } catch (e) {
              setError("无效的JSON格式（表单数据应为JSON对象）")
              setIsLoading(false)
              return
            }
            requestBody = formData
            break
          case "x-www-form-urlencoded":
            try {
              const jsonData = JSON.parse(body)
              requestBody = new URLSearchParams(jsonData as Record<string, string>).toString()
            } catch (e) {
              setError("无效的JSON格式（URL编码数据应为JSON对象）")
              setIsLoading(false)
              return
            }
            break
          case "raw":
            requestBody = body
            break
        }
      }

      const startTime = Date.now()

      // 发送请求
      const response = await fetch(fullUrl, {
        method,
        headers: requestHeaders,
        body: method !== "GET" ? (bodyType === "json" ? JSON.stringify(requestBody) : requestBody) : undefined,
      })

      const endTime = Date.now()
      const responseTime = endTime - startTime

      // 解析响应
      const responseHeaders: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      let responseBody = ""
      const contentType = response.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        const json = await response.json()
        responseBody = JSON.stringify(json, null, 2)
      } else if (
        contentType.includes("text/") ||
        contentType.includes("application/xml") ||
        contentType.includes("application/javascript")
      ) {
        responseBody = await response.text()
      } else {
        responseBody = `[二进制数据 - ${contentType}]`
      }

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseBody,
        time: responseTime,
      })

      setActiveTab("response")
    } catch (err) {
      setError(`请求失败: ${(err as Error).message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveRequest = () => {
    if (!url || !requestName) return

    const validHeaders: Record<string, string> = {}
    headers
      .filter((header) => header.key && header.value)
      .forEach((header) => {
        validHeaders[header.key] = header.value
      })

    const validParams: Record<string, string> = {}
    params
      .filter((param) => param.key && param.value)
      .forEach((param) => {
        validParams[param.key] = param.value
      })

    const newRequest = {
      name: requestName,
      url,
      method,
      headers: validHeaders,
      params: validParams,
      body,
    }

    saveApiRequest(newRequest)
    setSavedRequests(getApiRequests())
    setRequestName("")
    setShowSaveDialog(false)
  }

  const loadRequest = (request: ApiRequest) => {
    setUrl(request.url)
    setMethod(request.method)

    const loadedHeaders = Object.entries(request.headers).map(([key, value]) => ({ key, value }))
    if (loadedHeaders.length === 0) {
      loadedHeaders.push({ key: "", value: "" })
    }
    setHeaders(loadedHeaders)

    const loadedParams = Object.entries(request.params).map(([key, value]) => ({ key, value }))
    if (loadedParams.length === 0) {
      loadedParams.push({ key: "", value: "" })
    }
    setParams(loadedParams)

    setBody(request.body)
  }

  const handleDeleteRequest = (id: string) => {
    deleteApiRequest(id)
    setSavedRequests(getApiRequests())
  }

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }])
  }

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...headers]
    newHeaders[index][field] = value
    setHeaders(newHeaders)
  }

  const removeHeader = (index: number) => {
    if (headers.length > 1) {
      const newHeaders = [...headers]
      newHeaders.splice(index, 1)
      setHeaders(newHeaders)
    }
  }

  const addParam = () => {
    setParams([...params, { key: "", value: "" }])
  }

  const updateParam = (index: number, field: "key" | "value", value: string) => {
    const newParams = [...params]
    newParams[index][field] = value
    setParams(newParams)
  }

  const removeParam = (index: number) => {
    if (params.length > 1) {
      const newParams = [...params]
      newParams.splice(index, 1)
      setParams(newParams)
    }
  }

  const formatBody = () => {
    if (!body) return

    try {
      const parsed = JSON.parse(body)
      setBody(JSON.stringify(parsed, null, 2))
    } catch (e) {
      setError("无法格式化：无效的JSON")
    }
  }

  const copyResponse = () => {
    if (!response) return

    navigator.clipboard.writeText(response.body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/dev-tools")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">API测试工具</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="w-full md:w-32">
                  <Select value={method} onValueChange={(value) => setMethod(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Input placeholder="输入请求URL..." value={url} onChange={(e) => setUrl(e.target.value)} />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={sendRequest} disabled={isLoading}>
                    {isLoading ? "发送中..." : <Send className="h-4 w-4 mr-2" />}
                    {isLoading ? "" : "发送"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowSaveDialog(true)} disabled={!url}>
                    <Save className="h-4 w-4 mr-2" />
                    保存
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="params" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="params">查询参数</TabsTrigger>
                  <TabsTrigger value="headers">请求头</TabsTrigger>
                  <TabsTrigger value="body" disabled={method === "GET"}>
                    请求体
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="params">
                  <div className="space-y-2">
                    {params.map((param, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          placeholder="参数名"
                          value={param.key}
                          onChange={(e) => updateParam(index, "key", e.target.value)}
                        />
                        <Input
                          placeholder="参数值"
                          value={param.value}
                          onChange={(e) => updateParam(index, "value", e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeParam(index)}
                          disabled={params.length <= 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addParam}>
                      <Plus className="h-4 w-4 mr-2" />
                      添加参数
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="headers">
                  <div className="space-y-2">
                    {headers.map((header, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          placeholder="请求头名称"
                          value={header.key}
                          onChange={(e) => updateHeader(index, "key", e.target.value)}
                        />
                        <Input
                          placeholder="请求头值"
                          value={header.value}
                          onChange={(e) => updateHeader(index, "value", e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeHeader(index)}
                          disabled={headers.length <= 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addHeader}>
                      <Plus className="h-4 w-4 mr-2" />
                      添加请求头
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="body">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Select value={bodyType} onValueChange={(value) => setBodyType(value as any)}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="内容类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="form-data">Form Data</SelectItem>
                          <SelectItem value="x-www-form-urlencoded">x-www-form-urlencoded</SelectItem>
                          <SelectItem value="raw">Raw</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={formatBody} disabled={bodyType !== "json"}>
                        格式化
                      </Button>
                    </div>
                    <Textarea
                      placeholder={
                        bodyType === "json"
                          ? '{\n  "key": "value"\n}'
                          : bodyType === "form-data" || bodyType === "x-www-form-urlencoded"
                            ? '{\n  "field1": "value1",\n  "field2": "value2"\n}'
                            : "输入原始请求体..."
                      }
                      className="min-h-[200px] font-mono"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="request">请求</TabsTrigger>
              <TabsTrigger value="response">响应</TabsTrigger>
            </TabsList>

            <TabsContent value="request">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">请求详情</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-xs text-muted-foreground">方法</div>
                        <div className="font-medium">{method}</div>
                      </div>
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-xs text-muted-foreground">URL</div>
                        <div className="font-medium break-all">{url}</div>
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="headers">
                        <AccordionTrigger>请求头</AccordionTrigger>
                        <AccordionContent>
                          {headers.filter((h) => h.key && h.value).length > 0 ? (
                            <div className="space-y-2">
                              {headers
                                .filter((h) => h.key && h.value)
                                .map((header, index) => (
                                  <div key={index} className="grid grid-cols-2 gap-2">
                                    <div className="text-sm font-medium">{header.key}</div>
                                    <div className="text-sm">{header.value}</div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">无请求头</div>
                          )}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="params">
                        <AccordionTrigger>查询参数</AccordionTrigger>
                        <AccordionContent>
                          {params.filter((p) => p.key && p.value).length > 0 ? (
                            <div className="space-y-2">
                              {params
                                .filter((p) => p.key && p.value)
                                .map((param, index) => (
                                  <div key={index} className="grid grid-cols-2 gap-2">
                                    <div className="text-sm font-medium">{param.key}</div>
                                    <div className="text-sm">{param.value}</div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">无查询参数</div>
                          )}
                        </AccordionContent>
                      </AccordionItem>

                      {method !== "GET" && (
                        <AccordionItem value="body">
                          <AccordionTrigger>请求体</AccordionTrigger>
                          <AccordionContent>
                            {body ? (
                              <div className="bg-muted p-2 rounded-md">
                                <pre className="text-sm font-mono whitespace-pre-wrap break-all">{body}</pre>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">无请求体</div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="response">
              <Card>
                <CardContent className="p-4 space-y-4">
                  {error ? (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-md">{error}</div>
                  ) : response ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Badge variant={response.status >= 200 && response.status < 300 ? "default" : "destructive"}>
                            {response.status} {response.statusText}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{response.time}ms</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={copyResponse}>
                          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                          {copied ? "已复制" : "复制响应"}
                        </Button>
                      </div>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="headers">
                          <AccordionTrigger>响应头</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {Object.entries(response.headers).map(([key, value], index) => (
                                <div key={index} className="grid grid-cols-2 gap-2">
                                  <div className="text-sm font-medium">{key}</div>
                                  <div className="text-sm">{value}</div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="space-y-2">
                        <h3 className="font-medium">响应体</h3>
                        <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
                          <pre className="text-sm font-mono whitespace-pre-wrap break-all">{response.body}</pre>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">发送请求以查看响应</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="h-full">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <h3 className="font-medium">保存的请求</h3>
              </div>

              <ScrollArea className="h-[calc(100vh-300px)]">
                {savedRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">没有保存的请求</p>
                    <p className="text-sm text-muted-foreground mt-2">点击保存按钮添加请求</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedRequests.map((request) => (
                      <Card key={request.id} className="overflow-hidden">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{request.name}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline">{request.method}</Badge>
                                <p className="text-xs text-muted-foreground truncate max-w-[150px]">{request.url}</p>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => loadRequest(request)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                                onClick={() => handleDeleteRequest(request.id)}
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>保存请求</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">请求名称</Label>
              <Input
                id="name"
                value={requestName}
                onChange={(e) => setRequestName(e.target.value)}
                placeholder="输入请求名称..."
              />
            </div>
            <div>
              <Label>请求详情</Label>
              <div className="mt-2 space-y-1">
                <div className="text-sm">
                  <span className="font-medium">{method}</span> {url}
                </div>
                <div className="text-xs text-muted-foreground">
                  {headers.filter((h) => h.key && h.value).length} 个请求头,{" "}
                  {params.filter((p) => p.key && p.value).length} 个查询参数
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSaveRequest} disabled={!requestName}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
