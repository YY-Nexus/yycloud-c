"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Copy, Check, ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { encodeURL, decodeURL, trackToolUsage } from "@/lib/dev-tools"
import { useRouter } from "next/navigation"

export default function UrlEncoder() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<"encode" | "decode">("encode")

  useEffect(() => {
    trackToolUsage("url-encoder")
  }, [])

  const handleProcess = () => {
    try {
      setError(null)
      if (mode === "encode") {
        setOutput(encodeURL(input))
      } else {
        setOutput(decodeURL(input))
      }
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

  const handleModeChange = (value: string) => {
    setMode(value as "encode" | "decode")
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
        <h1 className="text-2xl font-bold">URL编解码</h1>
      </div>

      <Tabs defaultValue="encode" value={mode} onValueChange={handleModeChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="encode">编码</TabsTrigger>
          <TabsTrigger value="decode">解码</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {mode === "encode" ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                  <h2 className="text-lg font-medium">{mode === "encode" ? "输入文本" : "输入URL编码"}</h2>
                </div>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  清空
                </Button>
              </div>
              <Textarea
                placeholder={mode === "encode" ? "在此输入要编码的文本..." : "在此输入要解码的URL编码字符串..."}
                className="min-h-[300px]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button onClick={handleProcess} disabled={!input}>
                {mode === "encode" ? "编码" : "解码"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {mode === "encode" ? <ArrowDown className="h-5 w-5" /> : <ArrowUp className="h-5 w-5" />}
                  <h2 className="text-lg font-medium">{mode === "encode" ? "URL编码结果" : "解码结果"}</h2>
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
                <Textarea readOnly className="min-h-[300px]" value={output} />
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  )
}
