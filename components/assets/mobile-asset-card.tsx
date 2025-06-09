"use client"
import { MobileCard } from "@/components/ui/mobile-card"
import { MobileButton } from "@/components/ui/mobile-button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Asset } from "@/types/asset"

interface MobileAssetCardProps {
  asset: Asset
  onEdit: () => void
  onDelete: () => void
  onView: () => void
}

export function MobileAssetCard({ asset, onEdit, onDelete, onView }: MobileAssetCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "storage":
        return "bg-blue-100 text-blue-800"
      case "retired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusName = (status: string) => {
    const names = {
      active: "正常使用",
      maintenance: "维修中",
      storage: "闲置存放",
      retired: "已退役",
    }
    return names[status as keyof typeof names] || status
  }

  return (
    <MobileCard className="mobile-card" pressable onPress={onView} haptic>
      <div className="p-4 space-y-3">
        {/* 头部信息 */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base truncate">{asset.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {asset.brand} {asset.model}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MobileButton variant="ghost" size="icon" className="h-8 w-8 shrink-0" haptic>
                <MoreHorizontal className="h-4 w-4" />
              </MobileButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onView}>
                <Eye className="mr-2 h-4 w-4" />
                查看详情
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 设备图片 */}
        {asset.imageUrl && (
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <img src={asset.imageUrl || "/placeholder.svg"} alt={asset.name} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 状态和价值 */}
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(asset.status)}>{getStatusName(asset.status)}</Badge>
          <span className="font-medium text-sm">
            ¥{asset.currentValue?.toLocaleString() || asset.purchasePrice.toLocaleString()}
          </span>
        </div>

        {/* 位置和日期 */}
        <div className="space-y-1 text-sm text-muted-foreground">
          <div>位置: {asset.location}</div>
          <div>购买: {new Date(asset.purchaseDate).toLocaleDateString("zh-CN")}</div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-2">
          <MobileButton
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              onView()
            }}
          >
            查看详情
          </MobileButton>
          <MobileButton
            variant="default"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            编辑
          </MobileButton>
        </div>
      </div>
    </MobileCard>
  )
}
