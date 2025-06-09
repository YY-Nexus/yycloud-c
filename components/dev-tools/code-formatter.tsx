"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Copy, Check, Download, Upload, Settings, History, Zap, FileCode, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import {
  formatCode,
  supportedLanguages,
  formatterPresets,
  getFormatterConfig,
  saveFormatterConfig,
  getFormatterHistory,
  saveFormatterHistory,
  clearFormatterHistory,
  detectLanguage,
  compareCode,
  trackToolUsage,
} from "@/lib/code-formatter"
import type { FormatterConfig, FormatResult, FormatterHistory } from "@/types/code-formatter"

export default function CodeFormatter() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [config, setConfig] = useState<FormatterConfig>(getFormatterConfig("javascript"))
  const [formatResult, setFormatResult] = useState<FormatResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<FormatterHistory[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    trackToolUsage("code-formatter")
    setHistory(getFormatterHistory())
  }, [])

  useEffect(() => {
    const newConfig = getFormatterConfig(selectedLanguage)
    setConfig(newConfig)
  }, [selectedLanguage])

  const handleFormat = () => {
    if (!input.trim()) return

    const result = formatCode(input, config)
    setFormatResult(result)

    if (result.success && result.formatted) {
      setOutput(result.formatted)

      // 保存到历史记录
      const historyItem: FormatterHistory = {
        id: `format-${Date.now()}`,
        timestamp: new Date(),
        language: selectedLanguage,
        originalCode: input,
        formattedCode: result.formatted,
        config: { ...config },
      }

      saveFormatterHistory(historyItem)
      setHistory(getFormatterHistory())
    }
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)

    // 自动检测语言
    if (input && language === "auto") {
      const detected = detectLanguage(input)
      setSelectedLanguage(detected)
    }
  }

  const handleConfigChange = (key: keyof FormatterConfig, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    saveFormatterConfig(selectedLanguage, { [key]: value })
  }

  const handlePresetSelect = (presetId: string) => {
    const preset = formatterPresets.find((p) => p.id === presetId)
    if (preset) {
      setConfig(preset.config)
      saveFormatterConfig(selectedLanguage, preset.config)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setFormatResult(null)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInput(content)

        // 自动检测语言
        const detected = detectLanguage(content, file.name)
        setSelectedLanguage(detected)
      }
      reader.readAsText(file)
    }
  }

  const handleDownload = () => {
    if (!output) return

    const language = supportedLanguages.find((l) => l.id === selectedLanguage)
    const extension = language?.extensions[0] || ".txt"
    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `formatted-code${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleHistorySelect = (item: FormatterHistory) => {
    setInput(item.originalCode)
    setOutput(item.formattedCode)
    setSelectedLanguage(item.language)
    setConfig(item.config)
    setShowHistory(false)
  }

  const changes = formatResult?.success && input && output ? compareCode(input, output) : []

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/dev-tools")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">代码格式化工具</h1>
            <p className="text-muted-foreground">格式化和美化各种编程语言代码</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Dialog open={showHistory} onOpenChange={setShowHistory}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <History className="mr-2 h-4 w-4" />
                历史记录
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>格式化历史记录</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {history.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">暂无历史记录</p>
                ) : (
                  history.map((item) => (
                    <Card
                      key={item.id}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleHistorySelect(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {supportedLanguages.find((l) => l.id === item.language)?.name}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(item.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm font-mono bg-muted p-2 rounded truncate">
                          {item.originalCode.slice(0, 100)}...
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
                {history.length > 0 && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        clearFormatterHistory()
                        setHistory([])
                      }}
                    >
                      清空历史
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                设置
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>格式化设置</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="config" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="config">配置选项</TabsTrigger>
                  <TabsTrigger value="presets">预设方案</TabsTrigger>
                </TabsList>

                <TabsContent value="config" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>缩进大小</Label>
                      <Slider
                        value={[config.tabSize]}
                        onValueChange={([value]) => handleConfigChange("tabSize", value)}
                        max={8}
                        min={1}
                        step={1}
                      />
                      <span className="text-sm text-muted-foreground">{config.tabSize} 个空格</span>
                    </div>

                    <div className="space-y-2">
                      <Label>行宽限制</Label>
                      <Slider
                        value={[config.printWidth]}
                        onValueChange={([value]) => handleConfigChange("printWidth", value)}
                        max={200}
                        min={40}
                        step={10}
                      />
                      <span className="text-sm text-muted-foreground">{config.printWidth} 字符</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label>使用制表符</Label>
                      <Switch
                        checked={config.useTabs}
                        onCheckedChange={(checked) => handleConfigChange("useTabs", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>添加分号</Label>
                      <Switch
                        checked={config.semicolons}
                        onCheckedChange={(checked) => handleConfigChange("semicolons", checked)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label>使用单引号</Label>
                      <Switch
                        checked={config.singleQuote}
                        onCheckedChange={(checked) => handleConfigChange("singleQuote", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>括号内空格</Label>
                      <Switch
                        checked={config.bracketSpacing}
                        onCheckedChange={(checked) => handleConfigChange("bracketSpacing", checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>尾随逗号</Label>
                    <Select
                      value={config.trailingComma}
                      onValueChange={(value: any) => handleConfigChange("trailingComma", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">无</SelectItem>
                        <SelectItem value="es5">ES5</SelectItem>
                        <SelectItem value="all">全部</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>箭头函数括号</Label>
                    <Select
                      value={config.arrowParens}
                      onValueChange={(value: any) => handleConfigChange("arrowParens", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="avoid">避免</SelectItem>
                        <SelectItem value="always">总是</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="presets" className="space-y-4">
                  <div className="grid gap-3">
                    {formatterPresets.map((preset) => (
                      <Card
                        key={preset.id}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => handlePresetSelect(preset.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{preset.name}</h4>
                              <p className="text-sm text-muted-foreground">{preset.description}</p>
                            </div>
                            {preset.isDefault && <Badge>默认</Badge>}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {preset.languages.map((lang) => (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {supportedLanguages.find((l) => l.id === lang)?.name}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="h-5 w-5" />
                <CardTitle>输入代码</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".js,.jsx,.ts,.tsx,.json,.css,.html,.py,.java,.sql"
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  上传文件
                </Button>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  清空
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label>语言:</Label>
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">自动检测</SelectItem>
                    <Separator />
                    {supportedLanguages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {supportedLanguages.find((l) => l.id === selectedLanguage)?.features && (
                <div className="flex flex-wrap gap-1">
                  {supportedLanguages
                    .find((l) => l.id === selectedLanguage)
                    ?.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="在此粘贴您的代码..."
              className="min-h-[400px] font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button onClick={handleFormat} disabled={!input.trim()}>
                <Zap className="mr-2 h-4 w-4" />
                格式化代码
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const detected = detectLanguage(input)
                  setSelectedLanguage(detected)
                }}
                disabled={!input.trim()}
              >
                <Palette className="mr-2 h-4 w-4" />
                检测语言
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="h-5 w-5" />
                <CardTitle>格式化结果</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> 已复制
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" /> 复制
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output}>
                  <Download className="mr-2 h-4 w-4" />
                  下载
                </Button>
              </div>
            </div>
            {changes.length > 0 && <div className="text-sm text-muted-foreground">共 {changes.length} 处修改</div>}
          </CardHeader>
          <CardContent className="space-y-4">
            {formatResult?.error ? (
              <Alert variant="destructive">
                <AlertDescription>{formatResult.error}</AlertDescription>
              </Alert>
            ) : (
              <Textarea
                readOnly
                className="min-h-[400px] font-mono text-sm"
                value={output}
                placeholder="格式化后的代码将显示在这里..."
              />
            )}

            {formatResult?.success && changes.length > 0 && (
              <div className="space-y-2">
                <Label>代码变更统计</Label>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-green-600">新增: {changes.filter((c) => c.type === "added").length}</div>
                  <div className="text-blue-600">修改: {changes.filter((c) => c.type === "modified").length}</div>
                  <div className="text-red-600">删除: {changes.filter((c) => c.type === "removed").length}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 使用提示 */}
      <Card>
        <CardHeader>
          <CardTitle>使用提示</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">支持的语言</h4>
              <ul className="space-y-1">
                {supportedLanguages.slice(0, 4).map((lang) => (
                  <li key={lang.id}>
                    • {lang.name} ({lang.extensions.join(", ")})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">功能特性</h4>
              <ul className="space-y-1">
                <li>• 支持多种编程语言格式化</li>
                <li>• 可自定义格式化规则</li>
                <li>• 提供多种预设配置方案</li>
                <li>• 自动语言检测功能</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
