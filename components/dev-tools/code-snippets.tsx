"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, Plus, Trash, Edit, Copy, Check, Tags } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCodeSnippets, saveCodeSnippet, updateCodeSnippet, deleteCodeSnippet, trackToolUsage } from "@/lib/dev-tools"
import type { CodeSnippet } from "@/types/dev-tools"
import { useRouter } from "next/navigation"

export default function CodeSnippetsManager() {
  const router = useRouter()
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet | null>(null)
  const [newSnippet, setNewSnippet] = useState({
    title: "",
    description: "",
    language: "javascript",
    code: "",
    tags: "",
  })
  const [copied, setCopied] = useState<Record<string, boolean>>({})
  const [allTags, setAllTags] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")

  const languages = [
    "javascript",
    "typescript",
    "html",
    "css",
    "python",
    "java",
    "csharp",
    "php",
    "ruby",
    "go",
    "rust",
    "swift",
    "kotlin",
    "sql",
    "bash",
    "powershell",
    "json",
    "xml",
    "yaml",
    "markdown",
    "other",
  ]

  useEffect(() => {
    trackToolUsage("code-snippets")
    loadSnippets()
  }, [])

  const loadSnippets = () => {
    const loadedSnippets = getCodeSnippets()
    setSnippets(loadedSnippets)

    // 提取所有标签
    const tags = new Set<string>()
    loadedSnippets.forEach((snippet) => {
      snippet.tags.forEach((tag) => tags.add(tag))
    })
    setAllTags(Array.from(tags).sort())
  }

  const handleAddSnippet = () => {
    const tags = newSnippet.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    saveCodeSnippet({
      title: newSnippet.title,
      description: newSnippet.description,
      language: newSnippet.language,
      code: newSnippet.code,
      tags,
    })

    setNewSnippet({
      title: "",
      description: "",
      language: "javascript",
      code: "",
      tags: "",
    })
    setShowAddDialog(false)
    loadSnippets()
  }

  const handleEditSnippet = () => {
    if (!currentSnippet) return

    const tags = newSnippet.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    updateCodeSnippet(currentSnippet.id, {
      title: newSnippet.title,
      description: newSnippet.description,
      language: newSnippet.language,
      code: newSnippet.code,
      tags,
    })

    setShowEditDialog(false)
    loadSnippets()
  }

  const handleDeleteSnippet = (id: string) => {
    deleteCodeSnippet(id)
    loadSnippets()
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [id]: true })
    setTimeout(() => setCopied({ ...copied, [id]: false }), 2000)
  }

  const openEditDialog = (snippet: CodeSnippet) => {
    setCurrentSnippet(snippet)
    setNewSnippet({
      title: snippet.title,
      description: snippet.description,
      language: snippet.language,
      code: snippet.code,
      tags: snippet.tags.join(", "),
    })
    setShowEditDialog(true)
  }

  const toggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.code.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLanguage = selectedLanguage === "all" || snippet.language === selectedLanguage

    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => snippet.tags.includes(tag))

    return matchesSearch && matchesLanguage && matchesTags
  })

  const getRecentSnippets = () => {
    return [...snippets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 10)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/dev-tools")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">代码片段管理</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜索代码片段..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>语言</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有语言</SelectItem>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>标签</Label>
                  {selectedTags.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])}>
                      清除
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {allTags.length === 0 ? (
                      <p className="text-sm text-muted-foreground">没有可用的标签</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleTagFilter(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              <Button className="w-full" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                添加代码片段
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">统计</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">总片段数</span>
                  <span className="font-medium">{snippets.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">语言数</span>
                  <span className="font-medium">{new Set(snippets.map((s) => s.language)).size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">标签数</span>
                  <span className="font-medium">{allTags.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">所有片段</TabsTrigger>
              <TabsTrigger value="recent">最近更新</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {filteredSnippets.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <Tags className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">没有找到代码片段</h3>
                  <p className="text-muted-foreground mt-2">
                    {searchQuery || selectedLanguage !== "all" || selectedTags.length > 0
                      ? "尝试调整搜索条件"
                      : "点击 “添加代码片段” 按钮创建您的第一个代码片段"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSnippets.map((snippet) => (
                    <Card key={snippet.id}>
                      <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{snippet.title}</h3>
                            <p className="text-sm text-muted-foreground">{snippet.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleCopy(snippet.code, snippet.id)}>
                              {copied[snippet.id] ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" /> 已复制
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-2" /> 复制
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditDialog(snippet)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDeleteSnippet(snippet.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px]">
                          <pre className="text-sm font-mono whitespace-pre-wrap break-all">{snippet.code}</pre>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex flex-wrap gap-2">
                            {snippet.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{snippet.language}</Badge>
                            <span className="text-xs text-muted-foreground">
                              更新于 {new Date(snippet.updatedAt).toLocaleDateString("zh-CN")}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent">
              <div className="space-y-4">
                {getRecentSnippets().map((snippet) => (
                  <Card key={snippet.id}>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{snippet.title}</h3>
                          <p className="text-sm text-muted-foreground">{snippet.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleCopy(snippet.code, snippet.id)}>
                            {copied[snippet.id] ? (
                              <>
                                <Check className="h-4 w-4 mr-2" /> 已复制
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" /> 复制
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(snippet)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteSnippet(snippet.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px]">
                        <pre className="text-sm font-mono whitespace-pre-wrap break-all">{snippet.code}</pre>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                          {snippet.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{snippet.language}</Badge>
                          <span className="text-xs text-muted-foreground">
                            更新于 {new Date(snippet.updatedAt).toLocaleDateString("zh-CN")}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 添加代码片段对话框 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>添加代码片段</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={newSnippet.title}
                onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
                placeholder="输入代码片段标题..."
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={newSnippet.description}
                onChange={(e) => setNewSnippet({ ...newSnippet, description: e.target.value })}
                placeholder="输入代码片段描述..."
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="language">语言</Label>
              <Select
                value={newSnippet.language}
                onValueChange={(value) => setNewSnippet({ ...newSnippet, language: value })}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="选择语言" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="code">代码</Label>
              <Textarea
                id="code"
                value={newSnippet.code}
                onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
                placeholder="在此粘贴您的代码..."
                className="min-h-[200px] font-mono"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="tags">标签 (用逗号分隔)</Label>
              <Input
                id="tags"
                value={newSnippet.tags}
                onChange={(e) => setNewSnippet({ ...newSnippet, tags: e.target.value })}
                placeholder="例如: react, hooks, frontend"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              取消
            </Button>
            <Button onClick={handleAddSnippet} disabled={!newSnippet.title || !newSnippet.code}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑代码片段对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑代码片段</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-title">标题</Label>
              <Input
                id="edit-title"
                value={newSnippet.title}
                onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-description">描述</Label>
              <Textarea
                id="edit-description"
                value={newSnippet.description}
                onChange={(e) => setNewSnippet({ ...newSnippet, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-language">语言</Label>
              <Select
                value={newSnippet.language}
                onValueChange={(value) => setNewSnippet({ ...newSnippet, language: value })}
              >
                <SelectTrigger id="edit-language">
                  <SelectValue placeholder="选择语言" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-code">代码</Label>
              <Textarea
                id="edit-code"
                value={newSnippet.code}
                onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
                className="min-h-[200px] font-mono"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-tags">标签 (用逗号分隔)</Label>
              <Input
                id="edit-tags"
                value={newSnippet.tags}
                onChange={(e) => setNewSnippet({ ...newSnippet, tags: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              取消
            </Button>
            <Button onClick={handleEditSnippet} disabled={!newSnippet.title || !newSnippet.code}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
