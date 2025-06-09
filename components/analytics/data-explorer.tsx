"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  LineChart,
  PieChart,
  ResponsiveContainer,
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Download,
  RefreshCw,
  Database,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  TableIcon,
  Settings,
  Play,
  Save,
} from "lucide-react"

interface DataSource {
  id: string
  name: string
  type: "database" | "api" | "file" | "realtime"
  status: "connected" | "disconnected" | "error"
  lastUpdated: Date
  recordCount: number
}

interface QueryResult {
  columns: string[]
  data: any[]
  totalRows: number
  executionTime: number
}

export function DataExplorer() {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: "ds1",
      name: "网络测试数据",
      type: "database",
      status: "connected",
      lastUpdated: new Date(),
      recordCount: 15420,
    },
    {
      id: "ds2",
      name: "用户行为数据",
      type: "api",
      status: "connected",
      lastUpdated: new Date(Date.now() - 300000),
      recordCount: 8932,
    },
    {
      id: "ds3",
      name: "设备性能数据",
      type: "realtime",
      status: "connected",
      lastUpdated: new Date(),
      recordCount: 3456,
    },
  ])

  const [selectedDataSource, setSelectedDataSource] = useState<string>("")
  const [query, setQuery] = useState("")
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [visualizationType, setVisualizationType] = useState<"table" | "bar" | "line" | "pie">("table")

  // 模拟查询执行
  const executeQuery = async () => {
    if (!selectedDataSource || !query.trim()) return

    setIsLoading(true)

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 生成模拟数据
    const mockResult: QueryResult = {
      columns: ["日期", "下载速度", "上传速度", "延迟", "设备类型"],
      data: Array.from({ length: 20 }, (_, i) => ({
        日期: new Date(Date.now() - i * 86400000).toLocaleDateString(),
        下载速度: Math.floor(Math.random() * 100) + 50,
        上传速度: Math.floor(Math.random() * 50) + 20,
        延迟: Math.floor(Math.random() * 30) + 10,
        设备类型: ["桌面", "移动", "平板"][Math.floor(Math.random() * 3)],
      })),
      totalRows: 15420,
      executionTime: 1.2,
    }

    setQueryResult(mockResult)
    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "disconnected":
        return "bg-gray-100 text-gray-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "connected":
        return "已连接"
      case "disconnected":
        return "未连接"
      case "error":
        return "错误"
      default:
        return "未知"
    }
  }

  const renderVisualization = () => {
    if (!queryResult) return null

    const chartData = queryResult.data.slice(0, 10) // 只显示前10条数据

    switch (visualizationType) {
      case "bar":
        return (
          <ChartContainer
            config={{
              下载速度: { label: "下载速度 (Mbps)", color: "hsl(var(--chart-1))" },
              上传速度: { label: "上传速度 (Mbps)", color: "hsl(var(--chart-2))" },
            }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="日期" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="下载速度" fill="var(--color-下载速度)" />
                <Bar dataKey="上传速度" fill="var(--color-上传速度)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "line":
        return (
          <ChartContainer
            config={{
              下载速度: { label: "下载速度 (Mbps)", color: "hsl(var(--chart-1))" },
              延迟: { label: "延迟 (ms)", color: "hsl(var(--chart-2))" },
            }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="日期" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="下载速度" stroke="var(--color-下载速度)" />
                <Line type="monotone" dataKey="延迟" stroke="var(--color-延迟)" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "pie":
        const deviceTypeData = queryResult.data.reduce(
          (acc, item) => {
            acc[item.设备类型] = (acc[item.设备类型] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

        const pieData = Object.entries(deviceTypeData).map(([name, value]) => ({ name, value }))
        const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )

      default:
        return (
          <ScrollArea className="h-80">
            <Table>
              <TableHeader>
                <TableRow>
                  {queryResult.columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {queryResult.data.slice(0, 50).map((row, index) => (
                  <TableRow key={index}>
                    {queryResult.columns.map((column) => (
                      <TableCell key={column}>{row[column]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">数据探索器</h2>
          <p className="text-muted-foreground">查询和分析您的数据</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            设置
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 数据源面板 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              数据源
            </CardTitle>
            <CardDescription>选择要查询的数据源</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dataSources.map((source) => (
              <div
                key={source.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedDataSource === source.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                }`}
                onClick={() => setSelectedDataSource(source.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{source.name}</h4>
                  <Badge className={getStatusColor(source.status)}>{getStatusLabel(source.status)}</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>类型: {source.type}</div>
                  <div>记录数: {source.recordCount.toLocaleString()}</div>
                  <div>更新: {source.lastUpdated.toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 查询和结果面板 */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>查询编辑器</CardTitle>
            <CardDescription>编写SQL查询或使用可视化查询构建器</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="sql">
              <TabsList>
                <TabsTrigger value="sql">SQL查询</TabsTrigger>
                <TabsTrigger value="visual">可视化构建器</TabsTrigger>
              </TabsList>

              <TabsContent value="sql" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="query">SQL查询</Label>
                  <textarea
                    id="query"
                    className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                    placeholder="SELECT * FROM network_tests WHERE date >= '2024-01-01'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={executeQuery} disabled={isLoading || !selectedDataSource}>
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    执行查询
                  </Button>
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    保存查询
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="visual" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>选择字段</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择字段" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="download_speed">下载速度</SelectItem>
                        <SelectItem value="upload_speed">上传速度</SelectItem>
                        <SelectItem value="ping">延迟</SelectItem>
                        <SelectItem value="device_type">设备类型</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>筛选条件</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="添加筛选" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">日期范围</SelectItem>
                        <SelectItem value="device">设备类型</SelectItem>
                        <SelectItem value="speed">速度范围</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={executeQuery} disabled={isLoading || !selectedDataSource}>
                  {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                  生成查询
                </Button>
              </TabsContent>
            </Tabs>

            {queryResult && (
              <>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-medium">查询结果</h3>
                    <Badge variant="outline">
                      {queryResult.data.length} / {queryResult.totalRows} 行
                    </Badge>
                    <Badge variant="outline">执行时间: {queryResult.executionTime}s</Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={visualizationType === "table" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setVisualizationType("table")}
                    >
                      <TableIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={visualizationType === "bar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setVisualizationType("bar")}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={visualizationType === "line" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setVisualizationType("line")}
                    >
                      <LineChartIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={visualizationType === "pie" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setVisualizationType("pie")}
                    >
                      <PieChartIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {renderVisualization()}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
