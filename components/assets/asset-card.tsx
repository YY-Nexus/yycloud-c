/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产卡片组件 (重新设计)
 * ==========================================
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, MapPin, Eye } from "lucide-react"
import type { Asset } from "@/types/asset"

interface AssetCardProps {
  asset: Asset
  onEdit: (asset: Asset) => void
  onDelete: (id: string) => void
  onViewDetail: (asset: Asset) => void
}

export function AssetCard({ asset, onEdit, onDelete, onViewDetail }: AssetCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "retired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusName = (status: string) => {
    switch (status) {
      case "active":
        return "正常使用"
      case "maintenance":
        return "维修中"
      case "retired":
        return "已退役"
      default:
        return status
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "computer":
        return "电脑设备"
      case "mobile":
        return "移动设备"
      case "network":
        return "网络设备"
      case "other":
        return "其他设备"
      default:
        return category
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium truncate">{asset.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onViewDetail(asset)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              查看详情
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(asset)}>
              <Edit className="mr-2 h-4 w-4" />
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(asset.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3 cursor-pointer" onClick={() => onViewDetail(asset)}>
        {/* 新增：设备图片预览 */}
        {asset.imageUrl && (
          <div className="aspect-video rounded-md overflow-hidden bg-muted">
            <img src={asset.imageUrl || "/placeholder.svg"} alt={asset.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div>
          <p className="text-sm text-muted-foreground">
            {asset.brand} {asset.model}
          </p>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            {asset.location}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline">{getCategoryName(asset.category)}</Badge>
          <Badge className={getStatusColor(asset.status)}>{getStatusName(asset.status)}</Badge>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">价值:</span>
          <span className="font-medium">¥{asset.purchasePrice.toLocaleString()}</span>
        </div>

        <div className="text-xs text-muted-foreground">
          购买于 {new Date(asset.purchaseDate).toLocaleDateString("zh-CN")}
        </div>
      </CardContent>
    </Card>
  )
}
