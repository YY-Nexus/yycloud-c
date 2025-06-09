"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Search,
  Code,
  FileJson,
  Hash,
  Key,
  Regex,
  Clock,
  Palette,
  Globe,
  Cpu,
  Database,
  FileText,
  Braces,
  Star,
  History,
  FileCode,
} from "lucide-react"

interface Tool {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  path: string
  category: string
  tags: string[]
  featured?: boolean
  new?: boolean
}

export default function DevToolsDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const tools: Tool[] = [
    {
      id: "json-formatter",
      name: "JSON 格式化工具",
      description: "格式化和验证 JSON 数据",
      icon: <FileJson className="h-6 w-6" />,
      path: "/dashboard/dev-tools/json-formatter",
      category: "格式化",
      tags: ["json", "格式化", "验证"],
      featured: true,
    },
    {
      id: "base64",
      name: "Base64 编解码",
      description: "编码和解码 Base64 数据",
      icon: <Code className="h-6 w-6" />,
      path: "/dashboard/dev-tools/base64",
      category: "编码",
      tags: ["base64", "编码", "解码"],
    },
    {
      id: "regex-tester",
      name: "正则表达式测试器",
      description: "测试和验证正则表达式",
      icon: <Regex className="h-6 w-6" />,
      path: "/dashboard/dev-tools/regex-tester",
      category: "测试",
      tags: ["正则", "测试", "匹配"],
      featured: true,
    },
    {
      id: "hash-generator",
      name: "哈希生成器",
      description: "生成各种哈希值",
      icon: <Hash className="h-6 w-6" />,
      path: "/dashboard/dev-tools/hash-generator",
      category: "安全",
      tags: ["哈希", "md5", "sha256"],
    },
    {
      id: "uuid-generator",
      name: "UUID 生成器",
      description: "生成 UUID 和 GUID",
      icon: <Key className="h-6 w-6" />,
      path: "/dashboard/dev-tools/uuid-generator",
      category: "生成器",
      tags: ["uuid", "guid", "生成器"],
    },
    {
      id: "timestamp-converter",
      name: "时间戳转换器",
      description: "转换各种格式的时间戳",
      icon: <Clock className="h-6 w-6" />,
      path: "/dashboard/dev-tools/timestamp-converter",
      category: "转换器",
      tags: ["时间戳", "日期", "转换"],
    },
    {
      id: "color-converter",
      name: "颜色转换器",
      description: "在不同颜色格式之间转换",
      icon: <Palette className="h-6 w-6" />,
      path: "/dashboard/dev-tools/color-converter",
      category: "转换器",
      tags: ["颜色", "rgb", "hex", "hsl"],
    },
    {
      id: "url-encoder",
      name: "URL 编解码",
      description: "编码和解码 URL",
      icon: <Globe className="h-6 w-6" />,
      path: "/dashboard/dev-tools/url-encoder",
      category: "编码",
      tags: ["url", "编码", "解码"],
    },
    {
      id: "jwt-decoder",
      name: "JWT 解码器",
      description: "解码和验证 JWT 令牌",
      icon: <Key className="h-6 w-6" />,
      path: "/dashboard/dev-tools/jwt-decoder",
      category: "安全",
      tags: ["jwt", "令牌", "解码"],
      new: true,
      featured: true,
    },
    {
      id: "api-tester",
      name: "API 测试工具",
      description: "测试 REST API 请求和响应",
      icon: <Cpu className="h-6 w-6" />,
      path: "/dashboard/dev-tools/api-tester",
      category: "测试",
      tags: ["api", "rest", "http"],
      new: true,
      featured: true,
    },
    {
      id: "code-snippets",
      name: "代码片段管理",
      description: "存储和管理常用代码片段",
      icon: <Braces className="h-6 w-6" />,
      path: "/dashboard/dev-tools/code-snippets",
      category: "代码",
      tags: ["代码", "片段", "管理"],
      new: true,
    },
    {
      id: "sql-formatter",
      name: "SQL 格式化工具",
      description: "格式化和美化 SQL 查询",
      icon: <Database className="h-6 w-6" />,
      path: "/dashboard/dev-tools/sql-formatter",
      category: "格式化",
      tags: ["sql", "格式化", "查询"],
      new: true,
    },
    {
      id: "markdown-editor",
      name: "Markdown 编辑器",
      description: "编辑和预览 Markdown 文档",
      icon: <FileText className="h-6 w-6" />,
      path: "/dashboard/dev-tools/markdown-editor",
      category: "编辑器",
      tags: ["markdown", "编辑器", "预览"],
      new: true,
    },
    {
      id: "code-formatter",
      name: "代码格式化工具",
      description: "格式化和美化各种编程语言代码",
      icon: <FileCode className="h-6 w-6" />,
      path: "/dashboard/dev-tools/code-formatter",
      category: "格式化",
      tags: ["代码", "格式化", "美化", "多语言"],
      featured: true,
      new: true,
    },
  ]

  // 筛选工具
  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "featured") return matchesSearch && tool.featured
    if (activeTab === "new") return matchesSearch && tool.new
    return matchesSearch && tool.category.toLowerCase() === activeTab.toLowerCase()
  })

  // 获取所有类别
  const categories = Array.from(new Set(tools.map((tool) => tool.category)))

  // 获取最近使用的工具（模拟数据）
  const recentlyUsedTools = tools.filter((tool) => ["json-formatter", "jwt-decoder", "api-tester"].includes(tool.id))

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">开发工具库</h1>
        <p className="text-muted-foreground">一站式开发工具集合，提高您的开发效率</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索工具..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" className="w-full md:w-auto" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="featured">推荐</TabsTrigger>
            <TabsTrigger value="new">新增</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "all" && !searchTerm && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">最近使用</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentlyUsedTools.map((tool) => (
                <Link href={tool.path} key={tool.id}>
                  <Card className="h-full cursor-pointer hover:border-primary transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 rounded-md bg-primary/10 text-primary">{tool.icon}</div>
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                        </div>
                        <History className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">推荐工具</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools
                .filter((tool) => tool.featured)
                .map((tool) => (
                  <Link href={tool.path} key={tool.id}>
                    <Card className="h-full cursor-pointer hover:border-primary transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-md bg-primary/10 text-primary">{tool.icon}</div>
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                          </div>
                          {tool.new && <Badge>新</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex flex-wrap gap-2">
                          {tool.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}

      {(activeTab !== "all" || searchTerm) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <Link href={tool.path} key={tool.id}>
              <Card className="h-full cursor-pointer hover:border-primary transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">{tool.icon}</div>
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      {tool.new && <Badge>新</Badge>}
                      {tool.featured && (
                        <Badge variant="outline" className="bg-yellow-50">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          推荐
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{tool.category}</Badge>
                    {tool.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {activeTab === "all" && !searchTerm && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">所有工具</h2>
          <Tabs defaultValue={categories[0].toLowerCase()}>
            <TabsList className="mb-4 flex flex-wrap h-auto">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category.toLowerCase()}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category.toLowerCase()}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tools
                    .filter((tool) => tool.category === category)
                    .map((tool) => (
                      <Link href={tool.path} key={tool.id}>
                        <Card className="h-full cursor-pointer hover:border-primary transition-colors">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-md bg-primary/10 text-primary">{tool.icon}</div>
                                <CardTitle className="text-lg">{tool.name}</CardTitle>
                              </div>
                              <div className="flex items-center space-x-2">
                                {tool.new && <Badge>新</Badge>}
                                {tool.featured && (
                                  <Badge variant="outline" className="bg-yellow-50">
                                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                    推荐
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription>{tool.description}</CardDescription>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <div className="flex flex-wrap gap-2">
                              {tool.tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  )
}
