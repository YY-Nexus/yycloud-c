/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * Vercel Blob 存储管理器
 * ==========================================
 */

import { put, del, list, head } from "@vercel/blob"

export interface BlobUploadOptions {
  filename?: string
  folder?: string
  contentType?: string
  cacheControl?: string
  addRandomSuffix?: boolean
}

export interface BlobFile {
  url: string
  pathname: string
  size: number
  uploadedAt: Date
  contentType?: string
}

export class BlobStorageManager {
  private readonly maxFileSize: number
  private readonly allowedTypes: string[]

  constructor() {
    this.maxFileSize = Number.parseInt(process.env.BLOB_MAX_FILE_SIZE || "50485760") // 50MB
    this.allowedTypes = (process.env.BLOB_ALLOWED_TYPES || "jpg,jpeg,png,gif,pdf,doc,docx,txt,zip").split(",")
  }

  /**
   * 验证文件类型和大小
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // 检查文件大小
    if (file.size > this.maxFileSize) {
      return {
        valid: false,
        error: `文件大小超过限制 (${Math.round(this.maxFileSize / 1024 / 1024)}MB)`,
      }
    }

    // 检查文件类型
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    if (!fileExtension || !this.allowedTypes.includes(fileExtension)) {
      return {
        valid: false,
        error: `不支持的文件类型。支持的类型: ${this.allowedTypes.join(", ")}`,
      }
    }

    return { valid: true }
  }

  /**
   * 上传文件到 Blob 存储
   */
  async uploadFile(file: File, options: BlobUploadOptions = {}): Promise<BlobFile> {
    // 验证文件
    const validation = this.validateFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    try {
      // 构建文件路径
      const timestamp = Date.now()
      const fileExtension = file.name.split(".").pop()
      const baseName = options.filename || file.name.replace(/\.[^/.]+$/, "")
      const folder = options.folder || "uploads"

      let pathname = `${folder}/${baseName}`

      if (options.addRandomSuffix !== false) {
        const randomSuffix = Math.random().toString(36).substring(2, 8)
        pathname = `${folder}/${baseName}_${timestamp}_${randomSuffix}`
      }

      if (fileExtension) {
        pathname += `.${fileExtension}`
      }

      // 上传到 Vercel Blob
      const blob = await put(pathname, file, {
        access: "public",
        contentType: options.contentType || file.type,
        cacheControlMaxAge: 31536000, // 1年缓存
        addRandomSuffix: false, // 我们自己处理文件名
      })

      return {
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        uploadedAt: new Date(),
        contentType: file.type,
      }
    } catch (error) {
      console.error("Blob 上传失败:", error)
      throw new Error(`文件上传失败: ${error.message}`)
    }
  }

  /**
   * 上传多个文件
   */
  async uploadFiles(files: File[], options: BlobUploadOptions = {}): Promise<BlobFile[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, options))
    return Promise.all(uploadPromises)
  }

  /**
   * 删除文件
   */
  async deleteFile(url: string): Promise<boolean> {
    try {
      await del(url)
      return true
    } catch (error) {
      console.error("Blob 删除失败:", error)
      return false
    }
  }

  /**
   * 批量删除文件
   */
  async deleteFiles(urls: string[]): Promise<{ success: string[]; failed: string[] }> {
    const results = await Promise.allSettled(urls.map((url) => this.deleteFile(url)))

    const success: string[] = []
    const failed: string[] = []

    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value) {
        success.push(urls[index])
      } else {
        failed.push(urls[index])
      }
    })

    return { success, failed }
  }

  /**
   * 获取文件信息
   */
  async getFileInfo(url: string): Promise<BlobFile | null> {
    try {
      const info = await head(url)
      return {
        url: info.url,
        pathname: info.pathname,
        size: info.size,
        uploadedAt: info.uploadedAt,
        contentType: info.contentType,
      }
    } catch (error) {
      console.error("获取文件信息失败:", error)
      return null
    }
  }

  /**
   * 列出文件夹中的文件
   */
  async listFiles(folder?: string, limit = 100): Promise<BlobFile[]> {
    try {
      const options: any = { limit }
      if (folder) {
        options.prefix = folder + "/"
      }

      const result = await list(options)

      return result.blobs.map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        contentType: blob.contentType,
      }))
    } catch (error) {
      console.error("列出文件失败:", error)
      return []
    }
  }

  /**
   * 获取文件夹大小统计
   */
  async getFolderStats(folder: string): Promise<{
    fileCount: number
    totalSize: number
    averageSize: number
  }> {
    const files = await this.listFiles(folder)
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)

    return {
      fileCount: files.length,
      totalSize,
      averageSize: files.length > 0 ? Math.round(totalSize / files.length) : 0,
    }
  }

  /**
   * 清理过期文件
   */
  async cleanupExpiredFiles(folder: string, maxAge: number = 30 * 24 * 60 * 60 * 1000): Promise<number> {
    const files = await this.listFiles(folder)
    const now = Date.now()
    const expiredFiles = files.filter((file) => now - file.uploadedAt.getTime() > maxAge)

    if (expiredFiles.length === 0) {
      return 0
    }

    const { success } = await this.deleteFiles(expiredFiles.map((f) => f.url))
    return success.length
  }

  /**
   * 生成预签名上传 URL（用于客户端直接上传）
   */
  generateUploadUrl(filename: string, folder = "uploads"): string {
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const pathname = `${folder}/${filename}_${timestamp}_${randomSuffix}`

    return `/api/blob/upload?pathname=${encodeURIComponent(pathname)}`
  }

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B"

    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  /**
   * 获取文件类型图标
   */
  getFileTypeIcon(filename: string): string {
    const extension = filename.split(".").pop()?.toLowerCase()

    const iconMap: Record<string, string> = {
      // 图片
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      gif: "🖼️",
      svg: "🖼️",
      webp: "🖼️",
      // 文档
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      txt: "📄",
      rtf: "📄",
      // 表格
      xls: "📊",
      xlsx: "📊",
      csv: "📊",
      // 演示
      ppt: "📽️",
      pptx: "📽️",
      // 压缩
      zip: "🗜️",
      rar: "🗜️",
      "7z": "🗜️",
      tar: "🗜️",
      gz: "🗜️",
      // 音频
      mp3: "🎵",
      wav: "🎵",
      flac: "🎵",
      aac: "🎵",
      // 视频
      mp4: "🎬",
      avi: "🎬",
      mov: "🎬",
      wmv: "🎬",
      flv: "🎬",
      // 代码
      js: "💻",
      ts: "💻",
      html: "💻",
      css: "💻",
      json: "💻",
      xml: "💻",
    }

    return iconMap[extension || ""] || "📁"
  }
}

// 导出单例实例
export const blobStorage = new BlobStorageManager()
