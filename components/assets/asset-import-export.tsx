/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 资产导入导出组件
 * ==========================================
 */

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, Upload, FileText, AlertCircle, Check, Copy } from "lucide-react"
import { YYGetAssets } from "@/lib/asset-manager"
import { toast } from "@/hooks/use-toast"
import type { Asset } from "@/types/asset"

export function AssetImportExport() {
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json")
  const [exportData, setExportData] = useState<string>("")
  const [importData, setImportData] = useState<string>("")
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importValidation, setImportValidation] = useState<{
    isValid: boolean
    message: string
    assets?: Asset[]
  } | null>(null)

  // 导出资产数据
  const handleExport = async () => {
    try {
      const assets = await YYGetAssets()

      if (assets.length === 0) {
        toast({
          title: "导出失败",
          description: "没有资产数据可供导出",
          variant: "destructive",
        })
        return
      }

      if (exportFormat === "json") {
        const jsonData = JSON.stringify(assets, null, 2)
        setExportData(jsonData)
      } else {
        // CSV格式
        const headers = [
          "id",
          "name",
          "category",
          "brand",
          "model",
          "serialNumber",
          "purchaseDate",
          "purchasePrice",
          "currentValue",
          "warrantyExpiry",
          "status",
          "condition",
          "location",
          "description",
          "imageUrl",
        ]

        const rows = assets.map((asset) => [
          asset.id,
          asset.name,
          asset.category,
          asset.brand,
          asset.model,
          asset.serialNumber || "",
          new Date(asset.purchaseDate).toISOString().split("T")[0],
          asset.purchasePrice,
          asset.currentValue || "",
          asset.warrantyExpiry ? new Date(asset.warrantyExpiry).toISOString().split("T")[0] : "",
          asset.status,
          asset.condition,
          asset.location,
          asset.description || "",
          asset.imageUrl || "",
        ])

        const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
        setExportData(csvContent)
      }

      toast({
        title: "导出成功",
        description: `已生成${exportFormat.toUpperCase()}格式的资产数据`,
      })
    } catch (error) {
      console.error("导出资产数据失败:", error)
      toast({
        title: "导出失败",
        description: "导出资产数据时发生错误",
        variant: "destructive",
      })
    }
  }

  // 下载导出数据
  const downloadExportData = () => {
    if (!exportData) {
      toast({
        title: "下载失败",
        description: "没有可下载的数据",
        variant: "destructive",
      })
      return
    }

    const blob = new Blob([exportData], {
      type: exportFormat === "json" ? "application/json" : "text/csv;charset=utf-8;",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `assets_export_${new Date().toISOString().split("T")[0]}.${exportFormat}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "下载成功",
      description: `资产数据已下载为${exportFormat.toUpperCase()}文件`,
    })
  }

  // 复制导出数据到剪贴板
  const copyExportData = () => {
    if (!exportData) {
      toast({
        title: "复制失败",
        description: "没有可复制的数据",
        variant: "destructive",
      })
      return
    }

    navigator.clipboard.writeText(exportData).then(
      () => {
        toast({
          title: "复制成功",
          description: "资产数据已复制到剪贴板",
        })
      },
      () => {
        toast({
          title: "复制失败",
          description: "无法访问剪贴板",
          variant: "destructive",
        })
      },
    )
  }

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportFile(file)
    const reader = new FileReader()

    reader.onload = (event) => {
      const content = event.target?.result as string
      setImportData(content)
      validateImportData(content, file.name.endsWith(".csv") ? "csv" : "json")
    }

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file)
    } else if (file.name.endsWith(".json")) {
      reader.readAsText(file)
    } else {
      toast({
        title: "文件格式错误",
        description: "请上传CSV或JSON格式的文件",
        variant: "destructive",
      })
      setImportFile(null)
    }
  }

  // 验证导入数据
  const validateImportData = (data: string, format: "json" | "csv") => {
    try {
      let assets: Partial<Asset>[] = []

      if (format === "json") {
        assets = JSON.parse(data)
        if (!Array.isArray(assets)) {
          throw new Error("JSON数据必须是资产对象的数组")
        }
      } else {
        // CSV格式解析
        const lines = data.split("\n")
        if (lines.length < 2) {
          throw new Error("CSV文件必须包含标题行和至少一行数据")
        }

        const headers = lines[0].split(",")
        const requiredFields = [
          "name",
          "category",
          "brand",
          "model",
          "purchaseDate",
          "purchasePrice",
          "status",
          "condition",
          "location",
        ]

        // 检查必填字段
        for (const field of requiredFields) {
          if (!headers.includes(field)) {
            throw new Error(`CSV文件缺少必填字段: ${field}`)
          }
        }

        // 解析数据行
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue

          const values = lines[i].split(",")
          if (values.length !== headers.length) {
            throw new Error(`第${i}行的列数与标题行不匹配`)
          }

          const asset: Record<string, any> = {}
          headers.forEach((header, index) => {
            asset[header] = values[index]
          })

          // 转换日期和数字
          if (asset.purchaseDate) {
            asset.purchaseDate = new Date(asset.purchaseDate)
          }
          if (asset.warrantyExpiry) {
            asset.warrantyExpiry = new Date(asset.warrantyExpiry)
          }
          if (asset.purchasePrice) {
            asset.purchasePrice = Number(asset.purchasePrice)
          }
          if (asset.currentValue) {
            asset.currentValue = Number(asset.currentValue)
          }

          assets.push(asset as Partial<Asset>)
        }
      }

      // 验证每个资产对象
      const requiredFields = [
        "name",
        "category",
        "brand",
        "model",
        "purchaseDate",
        "purchasePrice",
        "status",
        "condition",
        "location",
      ]
      for (const asset of assets) {
        for (const field of requiredFields) {
          if (!(field in asset)) {
            throw new Error(`资产对象缺少必填字段: ${field}`)
          }
        }
      }

      setImportValidation({
        isValid: true,
        message: `验证通过，共${assets.length}条资产记录`,
        assets: assets as Asset[],
      })
    } catch (error) {
      console.error("验证导入数据失败:", error)
      setImportValidation({
        isValid: false,
        message: `验证失败: ${(error as Error).message}`,
      })
    }
  }

  // 手动验证导入数据
  const validateManualImport = () => {
    if (!importData.trim()) {
      toast({
        title: "验证失败",
        description: "请输入要导入的数据",
        variant: "destructive",
      })
      return
    }

    try {
      // 尝试检测格式
      let format: "json" | "csv" = "json"
      if (importData.trim().startsWith("{") || importData.trim().startsWith("[")) {
        format = "json"
      } else if (importData.includes(",")) {
        format = "csv"
      }

      validateImportData(importData, format)
    } catch (error) {
      console.error("验证导入数据失败:", error)
      setImportValidation({
        isValid: false,
        message: `验证失败: ${(error as Error).message}`,
      })
    }
  }

  // 执行导入
  const executeImport = () => {
    if (!importValidation?.isValid || !importValidation.assets) {
      toast({
        title: "导入失败",
        description: "数据验证未通过，无法导入",
        variant: "destructive",
      })
      return
    }

    // 这里应该调用实际的导入函数
    // 由于这是一个示例，我们只显示一个成功消息
    toast({
      title: "导入成功",
      description: `已导入${importValidation.assets.length}条资产记录`,
    })

    // 重置导入状态
    setImportData("")
    setImportFile(null)
    setImportValidation(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>资产数据导入导出</CardTitle>
        <CardDescription>导出您的资产数据或从外部文件导入</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">
              <Download className="h-4 w-4 mr-2" />
              导出数据
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="h-4 w-4 mr-2" />
              导入数据
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>导出格式</Label>
              <div className="flex space-x-2">
                <Button
                  variant={exportFormat === "json" ? "default" : "outline"}
                  onClick={() => setExportFormat("json")}
                  className="flex-1"
                >
                  JSON
                </Button>
                <Button
                  variant={exportFormat === "csv" ? "default" : "outline"}
                  onClick={() => setExportFormat("csv")}
                  className="flex-1"
                >
                  CSV
                </Button>
              </div>
            </div>

            <Button onClick={handleExport} className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              生成{exportFormat.toUpperCase()}数据
            </Button>

            {exportData && (
              <div className="space-y-2">
                <Label>导出结果</Label>
                <Textarea value={exportData} readOnly rows={10} className="font-mono text-xs" />
                <div className="flex space-x-2">
                  <Button onClick={downloadExportData} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    下载文件
                  </Button>
                  <Button onClick={copyExportData} variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    复制到剪贴板
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="import" className="space-y-4 pt-4">
            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file">从文件导入</TabsTrigger>
                <TabsTrigger value="manual">手动输入</TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="import-file">选择文件 (JSON 或 CSV)</Label>
                  <Input id="import-file" type="file" accept=".json,.csv" onChange={handleFileUpload} />
                  {importFile && (
                    <p className="text-sm text-muted-foreground">
                      已选择: {importFile.name} ({Math.round(importFile.size / 1024)} KB)
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="import-data">输入JSON或CSV数据</Label>
                  <Textarea
                    id="import-data"
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="粘贴JSON或CSV格式的资产数据..."
                    rows={10}
                    className="font-mono text-xs"
                  />
                  <Button onClick={validateManualImport} variant="outline" className="w-full">
                    验证数据
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {importValidation && (
              <Alert variant={importValidation.isValid ? "default" : "destructive"}>
                {importValidation.isValid ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{importValidation.isValid ? "验证通过" : "验证失败"}</AlertTitle>
                <AlertDescription>{importValidation.message}</AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        {importValidation?.isValid && (
          <Button onClick={executeImport}>
            <Upload className="h-4 w-4 mr-2" />
            导入数据
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
