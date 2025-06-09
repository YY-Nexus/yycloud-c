"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Copy, Check, Code, FileJson } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatJSON, minifyJSON, trackToolUsage } from "@/lib/dev-tools"
import { useRouter } from "next/navigation"

export default function JsonFormatter() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("format")

  useEffect(() => {
    trackToolUsage("json-formatter")
  }, [])

  const handleFormat = () => {
    try {
      setError(null)
      const formatted = formatJSON(input)
      setOutput(formatted)
      setActiveTab("format")
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleMinify = () => {
    try {
      setError(null)
      const minified = minifyJSON(input)
      setOutput(minified)
      setActiveTab("minify")
    } catch (err) {
      setError((err as Error).message)
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
    setError(null)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/dev-tools")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">JSON格式化</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileJson className="h-5 w-5" />
                <h2 className="text-lg font-medium">输入JSON</h2>
              </div>
              <Button variant="outline" size="sm" onClick={handleClear}>
                清空
              </Button>
            </div>
            <Textarea
              placeholder="在此粘贴您的JSON数据..."
              className="min-h-[400px] font-mono"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button onClick={handleFormat} disabled={!input}>
                格式化
              </Button>
              <Button variant="outline" onClick={handleMinify} disabled={!input}>
                压缩
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <h2 className="text-lg font-medium">输出结果</h2>
              </div>
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
            </div>
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <Textarea readOnly className="min-h-[400px] font-mono" value={output} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
