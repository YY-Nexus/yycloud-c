"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Plus, Trash, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { getRegexPatterns, saveRegexPattern, deleteRegexPattern, trackToolUsage } from "@/lib/dev-tools"
import type { RegexPattern } from "@/types/dev-tools"
import { useRouter } from "next/navigation"

export default function RegexTester() {
  const router = useRouter()
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState("g")
  const [testText, setTestText] = useState("")
  const [matches, setMatches] = useState<string[]>([])
  const [matchCount, setMatchCount] = useState(0)
  const [isValid, setIsValid] = useState(true)
  const [savedPatterns, setSavedPatterns] = useState<RegexPattern[]>([])
  const [newPatternName, setNewPatternName] = useState("")
  const [newPatternDesc, setNewPatternDesc] = useState("")
  const [newPatternExamples, setNewPatternExamples] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // 正则标志选项
  const flagOptions = [
    { id: "g", label: "全局匹配 (g)", checked: flags.includes("g") },
    { id: "i", label: "忽略大小写 (i)", checked: flags.includes("i") },
    { id: "m", label: "多行匹配 (m)", checked: flags.includes("m") },
    { id: "s", label: "点匹配所有字符 (s)", checked: flags.includes("s") },
    { id: "u", label: "Unicode (u)", checked: flags.includes("u") },
    { id: "y", label: "粘性匹配 (y)", checked: flags.includes("y") },
  ]

  useEffect(() => {
    trackToolUsage("regex-tester")
    setSavedPatterns(getRegexPatterns())
  }, [])

  useEffect(() => {
    if (!pattern || !testText) {
      setMatches([])
      setMatchCount(0)
      return
    }

    try {
      const regex = new RegExp(pattern, flags)
      setIsValid(true)

      if (flags.includes("g")) {
        const allMatches = [...testText.matchAll(regex)]
        setMatches(allMatches.map((match) => match[0]))
        setMatchCount(allMatches.length)
      } else {
        const match = testText.match(regex)
        if (match) {
          setMatches([match[0]])
          setMatchCount(1)
        } else {
          setMatches([])
          setMatchCount(0)
        }
      }
    } catch (error) {
      setIsValid(false)
      setMatches([])
      setMatchCount(0)
    }
  }, [pattern, flags, testText])

  const handleFlagChange = (flagId: string, checked: boolean) => {
    if (checked) {
      setFlags((prev) => (prev.includes(flagId) ? prev : prev + flagId))
    } else {
      setFlags((prev) => prev.replace(flagId, ""))
    }
  }

  const handleSavePattern = () => {
    if (!pattern || !newPatternName) return

    const newPattern = {
      pattern,
      flags,
      name: newPatternName,
      description: newPatternDesc,
      examples: newPatternExamples.split("\n").filter(Boolean),
    }

    saveRegexPattern(newPattern)
    setSavedPatterns(getRegexPatterns())
    setNewPatternName("")
    setNewPatternDesc("")
    setNewPatternExamples("")
    setDialogOpen(false)
  }

  const handleDeletePattern = (id: string) => {
    deleteRegexPattern(id)
    setSavedPatterns(getRegexPatterns())
  }

  const handleLoadPattern = (savedPattern: RegexPattern) => {
    setPattern(savedPattern.pattern)
    setFlags(savedPattern.flags)
    if (savedPattern.examples.length > 0) {
      setTestText(savedPattern.examples[0])
    }
  }

  const handleCopyRegex = () => {
    navigator.clipboard.writeText(`/${pattern}/${flags}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getHighlightedText = () => {
    if (!isValid || !pattern || matches.length === 0) return testText

    try {
      const regex = new RegExp(pattern, flags.includes("g") ? flags : flags + "g")
      return testText.replace(regex, (match) => `<mark>${match}</mark>`)
    } catch {
      return testText
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/dev-tools")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">正则表达式测试器</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pattern">正则表达式</Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      /
                    </div>
                    <Input
                      id="pattern"
                      className={`pl-6 pr-10 font-mono ${!isValid ? "border-red-500" : ""}`}
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      placeholder="输入正则表达式..."
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                      /{flags}
                    </div>
                  </div>
                  <Button variant="outline" size="icon" onClick={handleCopyRegex} disabled={!pattern}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" disabled={!pattern || !isValid}>
                        <Save className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>保存正则表达式</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="pattern-name">名称</Label>
                          <Input
                            id="pattern-name"
                            value={newPatternName}
                            onChange={(e) => setNewPatternName(e.target.value)}
                            placeholder="给这个正则表达式起个名字..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pattern-desc">描述 (可选)</Label>
                          <Textarea
                            id="pattern-desc"
                            value={newPatternDesc}
                            onChange={(e) => setNewPatternDesc(e.target.value)}
                            placeholder="描述这个正则表达式的用途..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pattern-examples">示例 (每行一个)</Label>
                          <Textarea
                            id="pattern-examples"
                            value={newPatternExamples}
                            onChange={(e) => setNewPatternExamples(e.target.value)}
                            placeholder="添加一些匹配示例..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          取消
                        </Button>
                        <Button onClick={handleSavePattern} disabled={!newPatternName}>
                          保存
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                {!isValid && <p className="text-sm text-red-500">无效的正则表达式</p>}
              </div>

              <div className="space-y-2">
                <Label>正则标志</Label>
                <div className="flex flex-wrap gap-4">
                  {flagOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`flag-${option.id}`}
                        checked={flags.includes(option.id)}
                        onCheckedChange={(checked) => handleFlagChange(option.id, checked as boolean)}
                      />
                      <Label htmlFor={`flag-${option.id}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-text">测试文本</Label>
                <Textarea
                  id="test-text"
                  className="min-h-[200px]"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="输入要测试的文本..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>匹配结果</Label>
                  <Badge variant={matchCount > 0 ? "default" : "outline"}>{matchCount} 个匹配</Badge>
                </div>
                <Card className="border border-dashed">
                  <CardContent className="p-4 min-h-[100px] max-h-[300px] overflow-auto">
                    {pattern && testText ? (
                      <div
                        className="whitespace-pre-wrap break-words"
                        dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
                      />
                    ) : (
                      <p className="text-muted-foreground text-center py-8">输入正则表达式和测试文本以查看匹配结果</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {matches.length > 0 && (
                <div className="space-y-2">
                  <Label>匹配列表</Label>
                  <ScrollArea className="h-[200px] border rounded-md p-2">
                    <div className="space-y-2">
                      {matches.map((match, index) => (
                        <div key={index} className="p-2 bg-muted rounded-md">
                          <code className="text-sm font-mono break-all">{match}</code>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>保存的正则表达式</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {savedPatterns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">没有保存的正则表达式</p>
                  <p className="text-sm text-muted-foreground mt-2">点击保存按钮添加常用的正则表达式</p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-4">
                    {savedPatterns.map((savedPattern) => (
                      <Card key={savedPattern.id} className="overflow-hidden">
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{savedPattern.name}</h3>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleLoadPattern(savedPattern)}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive"
                                  onClick={() => handleDeletePattern(savedPattern.id)}
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                            <code className="text-xs bg-muted p-1 rounded block overflow-x-auto">
                              /{savedPattern.pattern}/{savedPattern.flags}
                            </code>
                            {savedPattern.description && (
                              <p className="text-sm text-muted-foreground">{savedPattern.description}</p>
                            )}
                            {savedPattern.examples.length > 0 && (
                              <div className="mt-2">
                                <Label className="text-xs">示例:</Label>
                                <div className="mt-1 space-y-1">
                                  {savedPattern.examples.map((example, i) => (
                                    <div key={i} className="text-xs bg-muted/50 p-1 rounded">
                                      {example}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
