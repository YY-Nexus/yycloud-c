/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 端口管理器组件
 * ==========================================
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Shield,
  Server,
  Database,
  Globe,
  Code,
  Container,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Copy,
  Download,
  Scan,
  Settings,
} from "lucide-react"
import { PortManager, PortConfigGenerator, type PortInfo } from "@/lib/port-manager"

export function PortManagerComponent() {
  const [searchPort, setSearchPort] = useState("")
  const [portInfo, setPortInfo] = useState<PortInfo | null>(null)
  const [scanResults, setScanResults] = useState<PortInfo[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const portCategories = PortManager.getPortsByCategory()
  const portRanges = PortManager.getAllPortRanges()
  const portReport = PortManager.generatePortReport()

  const categoryIcons: Record<string, any> = {
    Web服务: Globe,
    数据库: Database,
    系统服务: Server,
    开发工具: Code,
    容器化: Container,
    消息队列: MessageSquare,
    其他: Settings,
  }

  const handlePortSearch = () => {
    const port = Number.parseInt(searchPort)
    const validation = PortManager.validatePort(port)

    if (validation.valid) {
      const info = PortManager.getPortInfo(port)
      setPortInfo(info)
    } else {
      setPortInfo(null)
    }
  }

  const handlePortScan = async () => {
    const startPort = 1
    const endPort = 1000
    setIsScanning(true)
    setScanProgress(0)

    try {
      // 模拟扫描进度
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const results = await PortManager.scanPortRange(startPort, endPort)
      setScanResults(results.filter((r) => r.status === "open"))
      setScanProgress(100)
    } catch (error) {
      console.error("端口扫描失败:", error)
    } finally {
      setIsScanning(false)
    }
  }

  const generateConfiguration = () => {
    if (selectedServices.length === 0) return

    const config = PortManager.generatePortConfiguration(selectedServices)
    const dockerConfig = PortConfigGenerator.generateDockerPortMapping(config)
    const envConfig = PortConfigGenerator.generateEnvConfig(config)

    // 下载配置文件
    const blob = new Blob(["# Docker Compose 配置\n", dockerConfig, "\n\n# 环境变量配置\n", envConfig], {
      type: "text/plain",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "port-configuration.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold">端口管理器</h1>
        <p className="text-muted-foreground mt-2">管理和监控网络端口，获取端口信息和配置建议</p>
      </div>

      {/* 端口查询 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            端口查询
          </CardTitle>
          <CardDescription>查询特定端口的详细信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="输入端口号 (0-65535)"
              value={searchPort}
              onChange={(e) => setSearchPort(e.target.value)}
              type="number"
              min="0"
              max="65535"
            />
            <Button onClick={handlePortSearch} disabled={!searchPort}>
              查询
            </Button>
          </div>

          {portInfo && (
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>端口号</Label>
                    <div className="text-2xl font-bold">{portInfo.port}</div>
                  </div>
                  <div>
                    <Label>协议</Label>
                    <Badge variant="outline">{portInfo.protocol}</Badge>
                  </div>
                  <div>
                    <Label>服务</Label>
                    <div>{portInfo.service || "未知服务"}</div>
                  </div>
                  <div>
                    <Label>描述</Label>
                    <div className="text-sm text-gray-600">{portInfo.description}</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(portInfo.port.toString())}>
                    <Copy className="h-3 w-3 mr-1" />
                    复制端口
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="categories">端口分类</TabsTrigger>
          <TabsTrigger value="ranges">端口范围</TabsTrigger>
          <TabsTrigger value="scanner">端口扫描</TabsTrigger>
          <TabsTrigger value="config">配置生成</TabsTrigger>
          <TabsTrigger value="report">使用报告</TabsTrigger>
        </TabsList>

        {/* 端口分类 */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.entries(portCategories).map(([category, ports]) => {
              const Icon = categoryIcons[category] || Settings
              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="h-5 w-5" />
                      {category}
                    </CardTitle>
                    <CardDescription>{ports.length} 个常用端口</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {ports.map(({ port, info }) => (
                        <div key={port} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">
                              {port} - {info.service}
                            </div>
                            <div className="text-sm text-gray-600">{info.description}</div>
                          </div>
                          <Badge variant="outline">{info.protocol}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* 端口范围 */}
        <TabsContent value="ranges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {portRanges.map((range, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{range.category}</CardTitle>
                  <CardDescription>
                    端口范围: {range.start} - {range.end}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">{range.description}</div>
                    <div className="text-2xl font-bold">{(range.end - range.start + 1).toLocaleString()} 个端口</div>
                    <Progress value={((range.end - range.start + 1) / 65536) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>端口分配规则</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>系统端口 (0-1023):</strong> 由IANA分配给系统服务，需要管理员权限绑定
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertDescription>
                    <strong>注册端口 (1024-49151):</strong> 由IANA注册给特定应用程序使用
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertDescription>
                    <strong>动态端口 (49152-65535):</strong> 临时端口，通常用于客户端连接
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 端口扫描 */}
        <TabsContent value="scanner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                端口扫描器
              </CardTitle>
              <CardDescription>扫描本地开放的端口</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handlePortScan} disabled={isScanning}>
                  {isScanning ? "扫描中..." : "开始扫描"}
                </Button>
                {isScanning && (
                  <div className="flex-1">
                    <Progress value={scanProgress} />
                    <div className="text-sm text-gray-600 mt-1">扫描进度: {scanProgress}%</div>
                  </div>
                )}
              </div>

              {scanResults.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">扫描结果 ({scanResults.length} 个开放端口)</h4>
                  <div className="max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>端口</TableHead>
                          <TableHead>服务</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>描述</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scanResults.map((result) => (
                          <TableRow key={result.port}>
                            <TableCell className="font-medium">{result.port}</TableCell>
                            <TableCell>{result.service || "未知"}</TableCell>
                            <TableCell>
                              <Badge
                                variant={result.status === "open" ? "default" : "secondary"}
                                className="flex items-center gap-1 w-fit"
                              >
                                {result.status === "open" ? (
                                  <CheckCircle className="h-3 w-3" />
                                ) : (
                                  <XCircle className="h-3 w-3" />
                                )}
                                {result.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{result.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 配置生成 */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>端口配置生成器</CardTitle>
              <CardDescription>为您的服务生成端口配置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>选择服务类型</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {["web", "api", "database", "cache", "development", "testing", "monitoring"].map((service) => (
                    <Button
                      key={service}
                      variant={selectedServices.includes(service) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedServices((prev) =>
                          prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
                        )
                      }}
                    >
                      {service}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedServices.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <Label>推荐端口配置</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded">
                      {Object.entries(PortManager.generatePortConfiguration(selectedServices)).map(
                        ([service, port]) => (
                          <div key={service} className="flex justify-between items-center">
                            <span className="font-medium">{service}:</span>
                            <Badge variant="outline">{port}</Badge>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <Button onClick={generateConfiguration}>
                    <Download className="h-4 w-4 mr-2" />
                    下载配置文件
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 使用报告 */}
        <TabsContent value="report" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{portReport.summary.totalPorts.toLocaleString()}</div>
                <div className="text-sm text-gray-600">总端口数</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{portReport.summary.systemPorts.toLocaleString()}</div>
                <div className="text-sm text-gray-600">系统端口</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{portReport.summary.registeredPorts.toLocaleString()}</div>
                <div className="text-sm text-gray-600">注册端口</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{portReport.summary.dynamicPorts.toLocaleString()}</div>
                <div className="text-sm text-gray-600">动态端口</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>使用建议</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {portReport.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>安全注意事项</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {portReport.securityNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
