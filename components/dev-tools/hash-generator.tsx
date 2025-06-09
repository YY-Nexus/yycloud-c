"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Copy, Check, FileText, Upload, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trackToolUsage } from "@/lib/dev-tools"
import { useRouter } from "next/navigation"

export default function HashGenerator() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [fileInput, setFileInput] = useState<File | null>(null)
  const [hashes, setHashes] = useState<Record<string, string>>({
    md5: "",
    sha1: "",
    sha256: "",
    sha512: "",
  })
  const [copied, setCopied] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("text")
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    trackToolUsage("hash-generator")
  }, [])

  const calculateHashes = async () => {
    if ((!input && activeTab === "text") || (!fileInput && activeTab === "file")) return

    setIsCalculating(true)
    const data = activeTab === "text" ? input : await fileInput!.arrayBuffer()

    try {
      const hashPromises = [
        calculateHash(data, "MD5"),
        calculateHash(data, "SHA-1"),
        calculateHash(data, "SHA-256"),
        calculateHash(data, "SHA-512"),
      ]

      const [md5, sha1, sha256, sha512] = await Promise.all(hashPromises)

      setHashes({
        md5,
        sha1,
        sha256,
        sha512,
      })
    } catch (error) {
      console.error("计算哈希值时出错:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const calculateHash = async (data: string | ArrayBuffer, algorithm: string) => {
    let buffer: ArrayBuffer

    if (typeof data === "string") {
      const encoder = new TextEncoder()
      buffer = encoder.encode(data)
    } else {
      buffer = data
    }

    const hashBuffer = await crypto.subtle.digest(algorithm, buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [type]: true })
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileInput(e.target.files[0])
    }
  }

  const generateRandomString = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-"
    let result = ""
    const length = Math.floor(Math.random() * 50) + 10 // 10-60 字符长度
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    setInput(result)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/dev-tools")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">哈希生成器</h1>
      </div>

      <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="text">文本</TabsTrigger>
          <TabsTrigger value="file">文件</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <h2 className="text-lg font-medium">输入文本</h2>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setInput("")}>
                    清空
                  </Button>
                  <Button variant="outline" size="sm" onClick={generateRandomString}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    随机文本
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder="在此输入要计算哈希值的文本..."
                className="min-h-[200px]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button onClick={calculateHashes} disabled={!input || isCalculating}>
                {isCalculating ? "计算中..." : "计算哈希值"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <h2 className="text-lg font-medium">上传文件</h2>
              </div>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Input type="file" className="hidden" id="file-upload" onChange={handleFileChange} />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  {fileInput ? (
                    <div className="text-center">
                      <p className="font-medium">{fileInput.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{(fileInput.size / 1024).toFixed(2)} KB</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="font-medium">点击或拖拽文件到此处</p>
                      <p className="text-sm text-muted-foreground mt-1">支持任何类型的文件</p>
                    </div>
                  )}
                </Label>
              </div>
              <Button onClick={calculateHashes} disabled={!fileInput || isCalculating}>
                {isCalculating ? "计算中..." : "计算哈希值"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-medium">哈希结果</h2>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>MD5</Label>
              <div className="flex space-x-2">
                <Input value={hashes.md5} readOnly className="font-mono" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(hashes.md5, "md5")}
                  disabled={!hashes.md5}
                >
                  {copied["md5"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>SHA-1</Label>
              <div className="flex space-x-2">
                <Input value={hashes.sha1} readOnly className="font-mono" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(hashes.sha1, "sha1")}
                  disabled={!hashes.sha1}
                >
                  {copied["sha1"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>SHA-256</Label>
              <div className="flex space-x-2">
                <Input value={hashes.sha256} readOnly className="font-mono" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(hashes.sha256, "sha256")}
                  disabled={!hashes.sha256}
                >
                  {copied["sha256"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>SHA-512</Label>
              <div className="flex space-x-2">
                <Input value={hashes.sha512} readOnly className="font-mono" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(hashes.sha512, "sha512")}
                  disabled={!hashes.sha512}
                >
                  {copied["sha512"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
