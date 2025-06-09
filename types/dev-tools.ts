export type ToolCategory = "格式化工具" | "编码解码" | "文本处理" | "开发辅助" | "转换工具" | "测试工具" | "生成工具"

export interface DevTool {
  id: string
  name: string
  description: string
  category: string
  icon: string
  path: string
  tags: string[]
  featured?: boolean
  new?: boolean
  lastUsed?: string
}

export interface CodeSnippet {
  id: string
  title: string
  description: string
  language: string
  code: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ApiRequest {
  id: string
  name: string
  url: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  headers: Record<string, string>
  params: Record<string, string>
  body: string
}

export interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  time: number
}

export interface RegexPattern {
  id: string
  name: string
  pattern: string
  flags: string
  description: string
  examples: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ColorPalette {
  id: string
  name: string
  colors: string[]
  createdAt: Date
}

export interface DevToolsSettings {
  theme: "light" | "dark" | "system"
  codeEditorTheme: string
  fontSize: number
  tabSize: number
  recentTools: string[] // 工具ID列表
  favoriteTools: string[] // 工具ID列表
}

export interface ToolUsageStats {
  toolId: string
  usageCount: number
  lastUsed: string
}
