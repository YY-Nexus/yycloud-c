/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 数据操作测试工具
 * ==========================================
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Plus, Edit, Trash2, Search, CheckCircle, XCircle, RefreshCw, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface TestData {
  id: string
  name: string
  value: string
  timestamp: string
}

interface OperationResult {
  operation: string
  success: boolean
  duration: number
  error?: string
}

export function DataOperationTester() {
  const [testData, setTestData] = useState<TestData[]>([])
  const [operationResults, setOperationResults] = useState<OperationResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [newItemValue, setNewItemValue] = useState("")

  // 初始化测试数据
  useEffect(() => {
    loadTestData()
  }, [])

  const loadTestData = () => {
    try {
      const saved = localStorage.getItem("test-data")
      if (saved) {
        setTestData(JSON.parse(saved))
      }
    } catch (error) {
      console.error("加载测试数据失败:", error)
    }
  }

  const saveTestData = (data: TestData[]) => {
    try {
      localStorage.setItem("test-data", JSON.stringify(data))
      setTestData(data)
    } catch (error) {
      console.error("保存测试数据失败:", error)
      throw error
    }
  }

  const recordOperation = (operation: string, success: boolean, duration: number, error?: string) => {
    const result: OperationResult = {
      operation,
      success,
      duration,
      error,
    }
    setOperationResults((prev) => [result, ...prev].slice(0, 10))
  }

  // 创建操作测试
  const testCreate = async () => {
    const startTime = Date.now()
    try {
      const newItem: TestData = {
        id: Date.now().toString(),
        name: newItemName || `测试项目 ${Date.now()}`,
        value: newItemValue || `测试值 ${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      }

      const updatedData = [...testData, newItem]
      saveTestData(updatedData)

      const duration = Date.now() - startTime
      recordOperation("创建", true, duration)

      setNewItemName("")
      setNewItemValue("")

      toast({
        title: "创建成功",
        description: `新项目已创建，耗时 ${duration}ms`,
      })
    } catch (error) {
      const duration = Date.now() - startTime
      recordOperation("创建", false, duration, (error as Error).message)

      toast({
        title: "创建失败",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  // 读取操作测试
  const testRead = async () => {
    const startTime = Date.now()
    try {
      loadTestData()
      const duration = Date.now() - startTime
      recordOperation("读取", true, duration)

      toast({
        title: "读取成功",
        description: `数据已刷新，耗时 ${duration}ms`,
      })
    } catch (error) {
      const duration = Date.now() - startTime
      recordOperation("读取", false, duration, (error as Error).message)

      toast({
        title: "读取失败",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  // 更新操作测试
  const testUpdate = async (id: string) => {
    const startTime = Date.now()
    try {
      const updatedData = testData.map((item) =>
        item.id === id ? { ...item, value: `更新值 ${Date.now()}`, timestamp: new Date().toISOString() } : item,
      )
      saveTestData(updatedData)

      const duration = Date.now() - startTime
      recordOperation("更新", true, duration)

      toast({
        title: "更新成功",
        description: `项目已更新，耗时 ${duration}ms`,
      })
    } catch (error) {
      const duration = Date.now() - startTime
      recordOperation("更新", false, duration, (error as Error).message)

      toast({
        title: "更新失败",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  // 删除操作测试
  const testDelete = async (id: string) => {
    const startTime = Date.now()
    try {
      const updatedData = testData.filter((item) => item.id !== id)
      saveTestData(updatedData)

      const duration = Date.now() - startTime
      recordOperation("删除", true, duration)

      toast({
        title: "删除成功",
        description: `项目已删除，耗时 ${duration}ms`,
      })
    } catch (error) {
      const duration = Date.now() - startTime
      recordOperation("删除", false, duration, (error as Error).message)

      toast({
        title: "删除失败",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  // 批量操作测试
  const testBatchOperations = async () => {
    setIsRunning(true)

    try {
      // 批量创建
      const batchData: TestData[] = Array.from({ length: 5 }, (_, i) => ({
        id: `batch-${Date.now()}-${i}`,
        name: `批量项目 ${i + 1}`,
        value: `批量值 ${i + 1}`,
        timestamp: new Date().toISOString(),
      }))

      const startTime = Date.now()
      const updatedData = [...testData, ...batchData]
      saveTestData(updatedData)
      const duration = Date.now() - startTime

      recordOperation("批量创建", true, duration)

      toast({
        title: "批量操作成功",
        description: `创建了 ${batchData.length} 个项目，耗时 ${duration}ms`,
      })
    } catch (error) {
      recordOperation("批量创建", false, 0, (error as Error).message)

      toast({
        title: "批量操作失败",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  // 清空数据测试
  const testClearAll = async () => {
    if (!confirm("确定要清空所有测试数据吗？")) return

    const startTime = Date.now()
    try {
      localStorage.removeItem("test-data")
      setTestData([])
      const duration = Date.now() - startTime

      recordOperation("清空", true, duration)

      toast({
        title: "清空成功",
        description: `所有数据已清空，耗时 ${duration}ms`,
      })
    } catch (error) {
      const duration = Date.now() - startTime
      recordOperation("清空", false, duration, (error as Error).message)

      toast({
        title: "清空失败",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  // 导出数据测试
  const testExport = () => {
    try {
      const dataStr = JSON.stringify(testData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = `test-data-${new Date().toISOString().split("T")[0]}.json`
      link.click()

      URL.revokeObjectURL(url)

      recordOperation("导出", true, 0)
      toast({
        title: "导出成功",
        description: "测试数据已导出到文件",
      })
    } catch (error) {
      recordOperation("导出", false, 0, (error as Error).message)
      toast({
        title: "导出失败",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  const successfulOps = operationResults.filter((op) => op.success).length
  const failedOps = operationResults.filter((op) => !op.success).length
  const avgDuration =
    operationResults.length > 0
      ? operationResults.reduce((sum, op) => sum + op.duration, 0) / operationResults.length
      : 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">数据操作测试</h1>
          <p className="text-muted-foreground">测试CRUD操作和数据持久化功能</p>
        </div>
        <Button onClick={testBatchOperations} disabled={isRunning}>
          {isRunning ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              批量测试中...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              批量测试
            </>
          )}
        </Button>
      </div>

      {/* 操作统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">数据项数量</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testData.length}</div>
            <p className="text-xs text-muted-foreground">当前存储的项目</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成功操作</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successfulOps}</div>
            <p className="text-xs text-muted-foreground">操作成功次数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">失败操作</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedOps}</div>
            <p className="text-xs text-muted-foreground">操作失败次数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均耗时</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDuration.toFixed(1)}ms</div>
            <p className="text-xs text-muted-foreground">操作平均时间</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="operations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="operations">CRUD操作</TabsTrigger>
          <TabsTrigger value="data">数据管理</TabsTrigger>
          <TabsTrigger value="results">操作记录</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-6">
          {/* 创建操作 */}
          <Card>
            <CardHeader>
              <CardTitle>创建操作测试</CardTitle>
              <CardDescription>测试数据创建和存储功能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">项目名称</label>
                  <Input
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="输入项目名称"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">项目值</label>
                  <Input
                    value={newItemValue}
                    onChange={(e) => setNewItemValue(e.target.value)}
                    placeholder="输入项目值"
                  />
                </div>
              </div>
              <Button onClick={testCreate}>
                <Plus className="mr-2 h-4 w-4" />
                创建测试项目
              </Button>
            </CardContent>
          </Card>

          {/* 其他操作 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">读取操作</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={testRead} variant="outline" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  测试读取
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">导出数据</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={testExport} variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  导出测试
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">清空数据</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={testClearAll} variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  清空测试
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>测试数据管理</CardTitle>
              <CardDescription>当前存储的测试数据项目</CardDescription>
            </CardHeader>
            <CardContent>
              {testData.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">暂无测试数据</h3>
                  <p className="text-muted-foreground">创建一些测试项目开始测试</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {testData.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString("zh-CN")}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => testUpdate(item.id)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => testDelete(item.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>操作记录</CardTitle>
              <CardDescription>最近的数据操作结果</CardDescription>
            </CardHeader>
            <CardContent>
              {operationResults.length === 0 ? (
                <div className="text-center py-8">
                  <RefreshCw className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">暂无操作记录</h3>
                  <p className="text-muted-foreground">执行一些操作开始记录</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {operationResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{result.operation}操作</p>
                          {result.error && <p className="text-sm text-red-600">{result.error}</p>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{result.duration}ms</span>
                        <Badge className={result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {result.success ? "成功" : "失败"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
