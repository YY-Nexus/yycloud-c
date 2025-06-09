/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * Blob 存储管理页面
 * ==========================================
 */

import { BlobFileManager } from "@/components/blob/blob-file-manager"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Cloud, Database, Shield, Zap } from "lucide-react"

export default function BlobStoragePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Blob 存储管理</h1>
        <p className="text-muted-foreground mt-2">基于 Vercel Blob 的高性能文件存储和管理系统</p>
      </div>

      {/* 功能特性 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Cloud className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold">云端存储</h3>
            <p className="text-sm text-muted-foreground">全球 CDN 加速</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <h3 className="font-semibold">高速传输</h3>
            <p className="text-sm text-muted-foreground">毫秒级响应</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold">安全可靠</h3>
            <p className="text-sm text-muted-foreground">企业级安全</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Database className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-semibold">无限扩展</h3>
            <p className="text-sm text-muted-foreground">按需付费</p>
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Alert className="mb-6">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Blob 存储已集成到您的 Vercel 项目中。支持图片、文档、音视频等多种文件类型， 单文件最大支持 50MB，提供全球 CDN
          加速和企业级安全保障。
        </AlertDescription>
      </Alert>

      {/* 文件管理器 */}
      <BlobFileManager />
    </div>
  )
}
