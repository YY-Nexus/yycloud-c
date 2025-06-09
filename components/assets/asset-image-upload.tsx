/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产图片上传组件
 * ==========================================
 */

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Upload, X, Star, MoreHorizontal, Camera, ImageIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { Asset, AssetImage } from "@/types/asset"
import { addAssetImage, removeAssetImage, setPrimaryImage } from "@/lib/asset-manager"

interface AssetImageUploadProps {
  asset: Asset
  onUpdate: () => void
}

export function AssetImageUpload({ asset, onUpdate }: AssetImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imageDescription, setImageDescription] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理文件选择
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      toast({
        title: "文件类型错误",
        description: "请选择图片文件",
        variant: "destructive",
      })
      return
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "文件过大",
        description: "图片大小不能超过5MB",
        variant: "destructive",
      })
      return
    }

    // 创建预览
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreviewImage(result)
      uploadImage(file, result)
    }
    reader.readAsDataURL(file)
  }

  // 上传图片
  const uploadImage = async (file: File, dataUrl: string) => {
    setIsUploading(true)

    try {
      // 模拟上传过程
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 在实际应用中，这里应该上传到云存储服务
      // 现在我们使用 data URL 作为临时解决方案
      const imageData: Omit<AssetImage, "id" | "uploadDate"> = {
        url: dataUrl,
        filename: file.name,
        size: file.size,
        description: imageDescription,
        isPrimary: false,
      }

      const newImage = addAssetImage(asset.id, imageData)

      if (newImage) {
        toast({
          title: "上传成功",
          description: `图片 ${file.name} 已成功上传`,
        })
        onUpdate()
        setImageDescription("")
        setPreviewImage(null)
      } else {
        throw new Error("上传失败")
      }
    } catch (error) {
      console.error("上传图片失败:", error)
      toast({
        title: "上传失败",
        description: "图片上传时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // 删除图片
  const handleDeleteImage = (imageId: string) => {
    const success = removeAssetImage(asset.id, imageId)
    if (success) {
      toast({
        title: "删除成功",
        description: "图片已删除",
      })
      onUpdate()
    } else {
      toast({
        title: "删除失败",
        description: "删除图片时发生错误",
        variant: "destructive",
      })
    }
  }

  // 设置主图
  const handleSetPrimary = (imageId: string) => {
    const success = setPrimaryImage(asset.id, imageId)
    if (success) {
      toast({
        title: "设置成功",
        description: "主图已更新",
      })
      onUpdate()
    } else {
      toast({
        title: "设置失败",
        description: "设置主图时发生错误",
        variant: "destructive",
      })
    }
  }

  const images = asset.images || []

  return (
    <div className="space-y-4">
      {/* 上传区域 */}
      <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Camera className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium">上传设备照片</h3>
              <p className="text-sm text-muted-foreground">支持 JPG、PNG、GIF 格式，最大 5MB</p>
            </div>

            <div className="space-y-2">
              <Input
                placeholder="图片描述（可选）"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                className="max-w-xs mx-auto"
              />
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full max-w-xs"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? "上传中..." : "选择图片"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 图片预览 */}
      {previewImage && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <img src={previewImage || "/placeholder.svg"} alt="预览" className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-medium">正在上传...</p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse w-1/2"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 已上传的图片 */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">设备照片 ({images.length})</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.description || image.filename}
                    className="w-full h-full object-cover"
                  />

                  {/* 主图标记 */}
                  {image.isPrimary && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      主图
                    </Badge>
                  )}

                  {/* 操作菜单 */}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!image.isPrimary && (
                          <DropdownMenuItem onClick={() => handleSetPrimary(image.id)}>
                            <Star className="mr-2 h-4 w-4" />
                            设为主图
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDeleteImage(image.id)} className="text-destructive">
                          <X className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground truncate">{image.description || image.filename}</p>
                  <p className="text-xs text-muted-foreground">{(image.size / 1024).toFixed(1)} KB</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 空状态 */}
      {images.length === 0 && !previewImage && (
        <Card>
          <CardContent className="p-8 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">暂无设备照片</p>
            <p className="text-sm text-muted-foreground">上传照片可以更好地管理和识别设备</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
