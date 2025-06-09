"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Settings, Check, X, AlertCircle, Loader2, Trash2, RefreshCw } from "lucide-react"
import { integrationManager } from "@/lib/integration-manager"
import type { ThirdPartyIntegration, IntegrationField } from "@/types/workflow-integrations"

export function IntegrationManager() {
  const [integrations, setIntegrations] = useState<ThirdPartyIntegration[]>([])
  const [selectedIntegration, setSelectedIntegration] = useState<ThirdPartyIntegration | null>(null)
  const [configData, setConfigData] = useState<Record<string, any>>({})
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string>("")
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = () => {
    integrationManager.loadIntegrations()
    const allIntegrations = integrationManager.getAllIntegrations()
    setIntegrations(allIntegrations)
  }

  const handleConfigureIntegration = (integration: ThirdPartyIntegration) => {
    setSelectedIntegration(integration)
    setConfigData(integration.config || {})
    setConnectionError("")
    setIsConfigDialogOpen(true)
  }

  const handleConnect = async () => {
    if (!selectedIntegration) return

    setIsConnecting(true)
    setConnectionError("")

    try {
      const success = await integrationManager.connectIntegration(selectedIntegration.id, configData)

      if (success) {
        loadIntegrations()
        setIsConfigDialogOpen(false)
        setConfigData({})
      } else {
        setConnectionError("连接失败，请检查配置信息")
      }
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : "连接失败")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async (integrationId: string) => {
    const success = integrationManager.disconnectIntegration(integrationId)
    if (success) {
      loadIntegrations()
    }
  }

  const handleTestConnection = async () => {
    if (!selectedIntegration) return

    setIsConnecting(true)
    setConnectionError("")

    try {
      // 这里应该调用测试连接的方法
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 模拟测试
      setConnectionError("")
    } catch (error) {
      setConnectionError("连接测试失败")
    } finally {
      setIsConnecting(false)
    }
  }

  const renderConfigField = (field: IntegrationField) => {
    const value = configData[field.key] || ""

    return (
      <div key={field.key} className="space-y-2">
        <Label htmlFor={field.key}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          id={field.key}
          type={field.type === "password" ? "password" : "text"}
          value={value}
          onChange={(e) => setConfigData((prev) => ({ ...prev, [field.key]: e.target.value }))}
          placeholder={field.placeholder}
          required={field.required}
        />
        {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <Check className="h-4 w-4 text-green-600" />
      case "error":
        return <X className="h-4 w-4 text-red-600" />
      case "pending":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const connectedIntegrations = integrations.filter((i) => i.isConnected)
  const availableIntegrations = integrations.filter((i) => !i.isConnected)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">集成管理</h2>
          <p className="text-muted-foreground">连接第三方服务，扩展工作流功能</p>
        </div>
        <Button onClick={loadIntegrations} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          刷新
        </Button>
      </div>

      <Tabs defaultValue="connected" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connected">已连接 ({connectedIntegrations.length})</TabsTrigger>
          <TabsTrigger value="available">可用集成 ({availableIntegrations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          {connectedIntegrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedIntegrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <CardTitle className="text-base">{integration.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusIcon(integration.connectionStatus)}
                            <Badge className={getStatusColor(integration.connectionStatus)}>
                              {integration.connectionStatus === "connected" ? "已连接" : "连接异常"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">动作数量</span>
                        <span>{integration.actions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">触发器数量</span>
                        <span>{integration.triggers.length}</span>
                      </div>
                      {integration.lastSync && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">最后同步</span>
                          <span>{new Date(integration.lastSync).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleConfigureIntegration(integration)}>
                        <Settings className="h-4 w-4 mr-1" />
                        配置
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDisconnect(integration.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        断开
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">暂无已连接的集成</h3>
                <p className="text-muted-foreground text-center mb-4">连接第三方服务来扩展工作流功能</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {integration.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">认证方式</span>
                      <span className="capitalize">{integration.authType.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">功能</span>
                      <span>
                        {integration.actions.length} 动作, {integration.triggers.length} 触发器
                      </span>
                    </div>
                  </div>

                  <Dialog
                    open={isConfigDialogOpen && selectedIntegration?.id === integration.id}
                    onOpenChange={setIsConfigDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => handleConfigureIntegration(integration)}>
                        <Plus className="h-4 w-4 mr-2" />
                        连接
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <span className="text-xl">{integration.icon}</span>
                          <span>配置 {integration.name}</span>
                        </DialogTitle>
                        <DialogDescription>{integration.description}</DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        {connectionError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{connectionError}</AlertDescription>
                          </Alert>
                        )}

                        <div className="space-y-4">{integration.configFields.map(renderConfigField)}</div>

                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleConnect} disabled={isConnecting} className="flex-1">
                            {isConnecting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                连接中...
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                连接
                              </>
                            )}
                          </Button>
                          <Button variant="outline" onClick={handleTestConnection} disabled={isConnecting}>
                            测试
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
