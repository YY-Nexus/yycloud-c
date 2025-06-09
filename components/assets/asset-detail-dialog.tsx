/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产详情对话框组件
 * ==========================================
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, MapPin, DollarSign, FileText, Wrench, Edit, Plus, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import type { Asset } from "@/types/asset"
import { YYCalculateDepreciatedValue, YYGetWarrantyStatus } from "@/lib/asset-manager"
import { AssetForm } from "./asset-form"
import { MaintenanceForm } from "./maintenance-form"
import { AssetImageUpload } from "./asset-image-upload"

interface AssetDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: Asset
  onUpdate: () => void
}

export function AssetDetailDialog({ open, onOpenChange, asset, onUpdate }: AssetDetailDialogProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false)

  // 获取状态颜色和名称
  const getStatusInfo = (status: string) => {
    const statusMap = {
      active: { color: "bg-green-100 text-green-800", name: "正常使用" },
      maintenance: { color: "bg-yellow-100 text-yellow-800", name: "维修中" },
      storage: { color: "bg-blue-100 text-blue-800", name: "闲置存放" },
      retired: { color: "bg-gray-100 text-gray-800", name: "已退役" },
    }
    return statusMap[status as keyof typeof statusMap] || { color: "bg-gray-100 text-gray-800", name: status }
  }

  // 获取状况信息
  const getConditionInfo = (condition: string) => {
    const conditionMap = {
      excellent: { color: "bg-green-100 text-green-800", name: "极佳" },
      good: { color: "bg-blue-100 text-blue-800", name: "良好" },
      fair: { color: "bg-yellow-100 text-yellow-800", name: "一般" },
      poor: { color: "bg-red-100 text-red-800", name: "较差" },
    }
    return (
      conditionMap[condition as keyof typeof conditionMap] || { color: "bg-gray-100 text-gray-800", name: condition }
    )
  }

  // 获取保修状态
  const warrantyStatus = YYGetWarrantyStatus(asset)
  const getWarrantyInfo = () => {
    switch (warrantyStatus) {
      case "active":
        return { color: "bg-green-100 text-green-800", name: "保修中" }
      case "expiring":
        return { color: "bg-yellow-100 text-yellow-800", name: "即将过保" }
      case "expired":
        return { color: "bg-red-100 text-red-800", name: "已过保" }
      default:
        return { color: "bg-gray-100 text-gray-800", name: "未知" }
    }
  }

  const statusInfo = getStatusInfo(asset.status)
  // 为了兼容性，如果没有condition字段，默认为good
  const assetCondition = (asset as any).condition || "good"
  const conditionInfo = getConditionInfo(assetCondition)
  const warrantyInfo = getWarrantyInfo()
  const currentValue = asset.currentValue || YYCalculateDepreciatedValue(asset)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl">{asset.name}</DialogTitle>
                <DialogDescription>
                  {asset.brand} {asset.model}
                </DialogDescription>
              </div>
              <Button onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                编辑
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="financial">财务</TabsTrigger>
              <TabsTrigger value="maintenance">维修</TabsTrigger>
              <TabsTrigger value="documents">文档</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* 设备照片管理 */}
              <AssetImageUpload asset={asset} onUpdate={onUpdate} />

              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">基本信息</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">序列号:</span>
                        <span>{asset.serialNumber || "未设置"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">购买日期:</span>
                        <span>{format(new Date(asset.purchaseDate), "PPP", { locale: zhCN })}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">存放位置:</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{asset.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">状态信息</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">设备状态:</span>
                        <Badge className={statusInfo.color}>{statusInfo.name}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">设备状况:</span>
                        <Badge className={conditionInfo.color}>{conditionInfo.name}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">保修状态:</span>
                        <Badge className={warrantyInfo.color}>{warrantyInfo.name}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">价值信息</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">购买价格:</span>
                        <span className="font-medium">¥{asset.purchasePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">当前估值:</span>
                        <span className="font-medium">¥{currentValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">折旧率:</span>
                        <span className={currentValue < asset.purchasePrice ? "text-red-600" : "text-green-600"}>
                          {((1 - currentValue / asset.purchasePrice) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">保修信息</h3>
                    <div className="space-y-2 text-sm">
                      {asset.warrantyExpiry ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">保修到期:</span>
                            <span>{format(new Date(asset.warrantyExpiry), "PPP", { locale: zhCN })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">剩余天数:</span>
                            <span>
                              {Math.max(
                                0,
                                Math.ceil(
                                  (new Date(asset.warrantyExpiry).getTime() - new Date().getTime()) /
                                    (1000 * 60 * 60 * 24),
                                ),
                              )}{" "}
                              天
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-muted-foreground">未设置保修信息</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 描述 */}
              {asset.description && (
                <div>
                  <h3 className="font-medium mb-2">描述备注</h3>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{asset.description}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="financial" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">购买价格</span>
                  </div>
                  <p className="text-2xl font-bold">¥{asset.purchasePrice.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(asset.purchaseDate), "yyyy年MM月", { locale: zhCN })}
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">当前估值</span>
                  </div>
                  <p className="text-2xl font-bold">¥{currentValue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">基于使用年限计算</p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">使用年限</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {(
                      (new Date().getTime() - new Date(asset.purchaseDate).getTime()) /
                      (365.25 * 24 * 60 * 60 * 1000)
                    ).toFixed(1)}{" "}
                    年
                  </p>
                  <p className="text-xs text-muted-foreground">自购买日期起</p>
                </div>
              </div>

              {/* 维修费用统计 */}
              {asset.maintenanceRecords && asset.maintenanceRecords.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">维修费用统计</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">总维修费用:</span>
                      <span className="font-medium">
                        ¥{asset.maintenanceRecords.reduce((sum, record) => sum + record.cost, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-muted-foreground">维修次数:</span>
                      <span className="font-medium">{asset.maintenanceRecords.length} 次</span>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">维修记录</h3>
                <Button onClick={() => setIsMaintenanceDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加维修记录
                </Button>
              </div>

              {asset.maintenanceRecords && asset.maintenanceRecords.length > 0 ? (
                <div className="space-y-3">
                  {asset.maintenanceRecords
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => (
                      <div key={record.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{record.description}</h4>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(record.date), "PPP", { locale: zhCN })}
                            </p>
                          </div>
                          <Badge variant="outline">¥{record.cost.toLocaleString()}</Badge>
                        </div>
                        {record.provider && <p className="text-sm text-muted-foreground">维修商: {record.provider}</p>}
                        {record.notes && <p className="text-sm text-muted-foreground mt-1">备注: {record.notes}</p>}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">暂无维修记录</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">相关文档</h3>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  添加文档
                </Button>
              </div>

              {asset.documents && asset.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {asset.documents.map((document) => (
                    <div key={document.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{document.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        类型:{" "}
                        {document.type === "receipt"
                          ? "购买凭证"
                          : document.type === "manual"
                            ? "使用手册"
                            : document.type === "warranty"
                              ? "保修单"
                              : "其他"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        上传于 {format(new Date(document.uploadDate), "PPP", { locale: zhCN })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">暂无相关文档</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* 编辑对话框 */}
      <AssetForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        asset={asset}
        onSuccess={() => {
          onUpdate()
          setIsEditDialogOpen(false)
        }}
      />

      {/* 维修记录对话框 */}
      <MaintenanceForm
        open={isMaintenanceDialogOpen}
        onOpenChange={setIsMaintenanceDialogOpen}
        assetId={asset.id}
        onSuccess={() => {
          onUpdate()
          setIsMaintenanceDialogOpen(false)
        }}
      />
    </>
  )
}
