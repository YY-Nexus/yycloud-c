/**
 * ==========================================
 * 开发工具库主页
 * ==========================================
 */

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { Code, Search, Braces, Hash, LinkIcon, Palette, Clock, Key, Zap, FileText, TestTube, Globe } from "lucide-react"

export default function DevToolsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const toolCategories = [
    {
      title: "文本处理",
      description: "文本格式化、编码解码工具",
      tools: [
        {
          name: "JSON 格式化",
          description: "格式化和验证 JSON 数据",
          icon: Braces,
          href: "/dashboard/dev-tools/json-formatter",
          tags: ["JSON", "格式化", "验证"],
        },
        {
          name: "Base64 编解码",
          description: "Base64 编码和解码工具",
          icon: Code,
          href: "/dashboard/dev-tools/base64",
          tags: ["Base64", "编码", "解码"],
        },
        {
          name: "URL 编码",
          description: "URL 编码和解码工具",
          icon: LinkIcon,
          href: "/dashboard/dev-tools/url-encoder",
          tags: ["URL", "编码", "解码"],
        },
        {
          name: "代码格式化",
          description: "多语言代码格式化工具",
          icon: Code,
          href: "/dashboard/dev-tools/code-formatter",
          tags: ["代码", "格式化", "美化"],
        },
      ],
    },
    {
      title: "加密安全",
      description: "哈希生成、加密解密工具",
      tools: [
        {
          name: "哈希生成器",
          description: "生成 MD5、SHA1、SHA256 等哈希值",
          icon: Hash,
          href: "/dashboard/dev-tools/hash-generator",
          tags: ["哈希", "MD5", "SHA256"],
        },
        {
          name: "UUID 生成器",
          description: "生成各种版本的 UUID",
          icon: Key,
          href: "/dashboard/dev-tools/uuid-generator",
          tags: ["UUID", "生成器", "唯一标识"],
        },
        {
          name: "JWT 解码器",
          description: "解码和验证 JWT Token",
          icon: Key,
          href: "/dashboard/dev-tools/jwt-decoder",
          tags: ["JWT", "Token", "解码"],
        },
      ],
    },
    {
      title: "开发辅助",
      description: "正则测试、API测试等开发辅助工具",
      tools: [
        {
          name: "正则表达式测试",
          description: "测试和验证正则表达式",
          icon: TestTube,
          href: "/dashboard/dev-tools/regex-tester",
          tags: ["正则", "测试", "验证"],
        },
        {
          name: "API 测试器",
          description: "测试 REST API 接口",
          icon: Globe,
          href: "/dashboard/dev-tools/api-tester",
          tags: ["API", "REST", "测试"],
        },
        {
          name: "代码片段管理",
          description: "管理常用代码片段",
          icon: FileText,
          href: "/dashboard/dev-tools/code-snippets",
          tags: ["代码片段", "管理", "收藏"],
        },
      ],
    },
    {
      title: "转换工具",
      description: "颜色转换、时间戳转换等工具",
      tools: [
        {
          name: "颜色转换器",
          description: "HEX、RGB、HSL 颜色格式转换",
          icon: Palette,
          href: "/dashboard/dev-tools/color-converter",
          tags: ["颜色", "HEX", "RGB"],
        },
        {
          name: "时间戳转换",
          description: "Unix 时间戳与日期时间转换",
          icon: Clock,
          href: "/dashboard/dev-tools/timestamp-converter",
          tags: ["时间戳", "日期", "转换"],
        },
      ],
    },
  ]

  const recentTools = [
    { name: "JSON 格式化", href: "/dashboard/dev-tools/json-formatter", lastUsed: "2分钟前" },
    { name: "Base64 编解码", href: "/dashboard/dev-tools/base64", lastUsed: "1小时前" },
    { name: "正则测试", href: "/dashboard/dev-tools/regex-tester", lastUsed: "3小时前" },
    { name: "颜色转换", href: "/dashboard/dev-tools/color-converter", lastUsed: "1天前" },
  ]

  const favoriteTools = [
    { name: "JSON 格式化", href: "/dashboard/dev-tools/json-formatter" },
    { name: "哈希生成器", href: "/dashboard/dev-tools/hash-generator" },
    { name: "UUID 生成器", href: "/dashboard/dev-tools/uuid-generator" },
    { name: "API 测试器", href: "/dashboard/dev-tools/api-tester" },
  ]

  const filteredCategories = toolCategories.map((category) => ({
    ...category,
    tools: category.tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    ),
  }))

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">开发工具库</h1>
        <p className="text-gray-600 mt-2">提高开发效率的实用工具集合</p>
      </div>

      {/* 搜索框 */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="搜索工具..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 快速访问 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近使用 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              最近使用
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTools.map((tool) => (
                <Link key={tool.name} href={tool.href}>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <span className="font-medium">{tool.name}</span>
                    <span className="text-sm text-gray-500">{tool.lastUsed}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 收藏工具 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              收藏工具
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {favoriteTools.map((tool) => (
                <Link key={tool.name} href={tool.href}>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <span className="font-medium">{tool.name}</span>
                    <span className="text-yellow-500">⭐</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 工具分类 */}
      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <div key={category.title}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
              <p className="text-gray-600">{category.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <Link key={tool.name} href={tool.href}>
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{tool.name}</CardTitle>
                          </div>
                        </div>
                        <CardDescription className="text-sm">{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {tool.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {searchTerm && filteredCategories.every((category) => category.tools.length === 0) && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关工具</h3>
          <p className="text-gray-600">尝试使用其他关键词搜索</p>
        </div>
      )}
    </div>
  )
}
