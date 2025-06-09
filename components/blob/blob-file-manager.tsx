/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * Blob 文件管理器组件
 * ==========================================
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Trash2, Eye, Copy, Folder, File, RefreshCw, Search } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "@/hooks/use-toast"

interface BlobFile {
  url: string
  pathname: string
  size: number
  uploadedAt: Date
  contentType?: string
}

interface FolderStats {
  fileCount: number
  totalSize: number
  averageSize: number
}

export function BlobFileManager() {
  const [files, setFiles] = useState<BlobFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<BlobFile[]>([])
  const [currentFolder, setCurrentFolder] = useState<string>("uploads")
  const [folderStats, setFolderStats] = useState<FolderStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())

  // 加载文件列表
  const loadFiles = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/blob/list?folder=${currentFolder}&limit=200`)
      const result = await response.json()

      if (result.success) {
        setFiles(result.data.files)
        setFilteredFiles(result.data.files)
        setFolderStats(result.data.stats)
      } else {
        toast({
          title: "加载失败",
          description: "无法加载文件列表",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("加载文件失败:", error)
      toast({
        title: "加载失败",
        description: "网络错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentFolder])

  // 文件上传
  const uploadFiles = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const fileId = `${file.name}_${Date.now()}`
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", currentFolder)

        // 模拟上传进度
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => ({
            ...prev,
            [fileId]: Math.min((prev[fileId] || 0) + 10, 90),
          }))
        }, 200)

        const response = await fetch("/api/blob/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)

        const result = await response.json()

        if (result.success) {
          setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }))
          toast({
            title: "上传成功",
            description: `文件 ${file.name} 上传完成`,
          })

          // 重新加载文件列表
          await loadFiles()
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error("上传失败:", error)
        toast({
          title: "上传失败",
          description: `文件 ${file.name} 上传失败: ${error.message}`,
          variant: "destructive",
        })
      } finally {
        // 清除进度
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[fileId]
            return newProgress
          })
        }, 2000)
      }
    }
  }

  // 删除文件
  const deleteFile = async (url: string) => {
    try {
      const response = await fetch(`/api/blob/upload?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "删除成功",
          description: "文件已删除",
        })
        await loadFiles()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("删除失败:", error)
      toast({
        title: "删除失败",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // 批量删除
  const deleteSelectedFiles = async () => {
    const selectedUrls = Array.from(selectedFiles)

    for (const url of selectedUrls) {
      await deleteFile(url)
    }

    setSelectedFiles(new Set())
  }

  // 复制链接
  const copyFileUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "复制成功",
      description: "文件链接已复制到剪贴板",
    })
  }

  // 文件搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredFiles(files)
    } else {
      const filtered = files.filter((file) => file.pathname.toLowerCase().includes(query.toLowerCase()))
      setFilteredFiles(filtered)
    }
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // 获取文件图标
  const getFileIcon = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase()
    const iconMap: Record<string, string> = {
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      gif: "🖼️",
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      txt: "📄",
      xls: "📊",
      xlsx: "📊",
      csv: "📊",
      zip: "🗜️",
      rar: "🗜️",
      mp3: "🎵",
      mp4: "🎬",
      js: "💻",
      ts: "💻",
      html: "💻",
      css: "💻",
    }
    return iconMap[extension || ""] || "📁"
  }

  // 拖拽上传配置
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: uploadFiles,
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  return (
    <div className="space-y-6">
      {/* 文件夹统计 */}
      {folderStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">文件数量</p>
                  <p className="text-2xl font-bold">{folderStats.fileCount}</p>
                </div>
                <File className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总大小</p>
                  <p className="text-2xl font-bold">{formatFileSize(folderStats.totalSize)}</p>
                </div>
                <Folder className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">平均大小</p>
                  <p className="text-2xl font-bold">{formatFileSize(folderStats.averageSize)}</p>
                </div>
                <File className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="files" className="w-full">
        <TabsList>
          <TabsTrigger value="files">文件管理</TabsTrigger>
          <TabsTrigger value="upload">文件上传</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>文件上传</CardTitle>
              <CardDescription>拖拽文件到此区域或点击选择文件</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p className="text-blue-600">释放文件以开始上传...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">拖拽文件到此处，或点击选择文件</p>
                    <p className="text-sm text-gray-500">支持多文件上传，单文件最大 50MB</p>
                  </div>
                )}
              </div>

              {/* 上传进度 */}
              {Object.entries(uploadProgress).length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">上传进度</h4>
                  {Object.entries(uploadProgress).map(([fileId, progress]) => (
                    <div key={fileId} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{fileId.split("_")[0]}</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          {/* 工具栏 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索文件..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={loadFiles} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedFiles.size > 0 && (
                    <Button variant="destructive" size="sm" onClick={deleteSelectedFiles}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      删除选中 ({selectedFiles.size})
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 文件列表 */}
          <Card>
            <CardHeader>
              <CardTitle>文件列表</CardTitle>
              <CardDescription>
                当前文件夹: {currentFolder} | 共 {filteredFiles.length} 个文件
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>加载中...</p>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <File className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>暂无文件</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.url}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(file.url)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedFiles)
                            if (e.target.checked) {
                              newSelected.add(file.url)
                            } else {
                              newSelected.delete(file.url)
                            }
                            setSelectedFiles(newSelected)
                          }}
                        />
                        <span className="text-2xl">{getFileIcon(file.pathname)}</span>
                        <div>
                          <p className="font-medium">{file.pathname.split("/").pop()}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{new Date(file.uploadedAt).toLocaleString("zh-CN")}</span>
                            {file.contentType && (
                              <>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {file.contentType}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => window.open(file.url, "_blank")}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => copyFileUrl(file.url)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteFile(file.url)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
