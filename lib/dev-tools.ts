import type { DevTool, CodeSnippet, ApiRequest, RegexPattern, ColorPalette, DevToolsSettings } from "@/types/dev-tools"
import { v4 as uuidv4 } from "uuid"

// 默认工具列表
const defaultTools: DevTool[] = [
  {
    id: "json-formatter",
    name: "JSON格式化",
    description: "格式化和验证JSON数据",
    category: "格式化工具",
    icon: "Braces",
    path: "/dashboard/dev-tools/json-formatter",
  },
  {
    id: "base64",
    name: "Base64编解码",
    description: "编码和解码Base64字符串",
    category: "编码解码",
    icon: "Code",
    path: "/dashboard/dev-tools/base64",
  },
  {
    id: "url-encoder",
    name: "URL编解码",
    description: "编码和解码URL字符串",
    category: "编码解码",
    icon: "Link",
    path: "/dashboard/dev-tools/url-encoder",
  },
  {
    id: "regex-tester",
    name: "正则表达式测试",
    description: "测试和验证正则表达式",
    category: "测试工具",
    icon: "Regex",
    path: "/dashboard/dev-tools/regex-tester",
  },
  {
    id: "color-converter",
    name: "颜色转换器",
    description: "在不同颜色格式之间转换",
    category: "转换工具",
    icon: "Palette",
    path: "/dashboard/dev-tools/color-converter",
  },
  {
    id: "timestamp-converter",
    name: "时间戳转换",
    description: "转换时间戳和日期格式",
    category: "转换工具",
    icon: "Clock",
    path: "/dashboard/dev-tools/timestamp-converter",
  },
  {
    id: "hash-generator",
    name: "哈希生成器",
    description: "生成MD5, SHA-1, SHA-256等哈希值",
    category: "生成工具",
    icon: "Hash",
    path: "/dashboard/dev-tools/hash-generator",
  },
  {
    id: "jwt-decoder",
    name: "JWT解码器",
    description: "解码和验证JWT令牌",
    category: "开发辅助",
    icon: "Key",
    path: "/dashboard/dev-tools/jwt-decoder",
  },
  {
    id: "api-tester",
    name: "API测试工具",
    description: "测试REST API请求和响应",
    category: "测试工具",
    icon: "Server",
    path: "/dashboard/dev-tools/api-tester",
  },
  {
    id: "code-snippets",
    name: "代码片段管理",
    description: "保存和管理常用代码片段",
    category: "开发辅助",
    icon: "FileCode",
    path: "/dashboard/dev-tools/code-snippets",
  },
  {
    id: "text-diff",
    name: "文本比较",
    description: "比较两段文本的差异",
    category: "文本处理",
    icon: "Split",
    path: "/dashboard/dev-tools/text-diff",
  },
  {
    id: "markdown-preview",
    name: "Markdown预览",
    description: "实时预览Markdown文档",
    category: "文本处理",
    icon: "FileText",
    path: "/dashboard/dev-tools/markdown-preview",
  },
  {
    id: "css-minifier",
    name: "CSS压缩/美化",
    description: "压缩或美化CSS代码",
    category: "格式化工具",
    icon: "FileType",
    path: "/dashboard/dev-tools/css-minifier",
  },
  {
    id: "html-minifier",
    name: "HTML压缩/美化",
    description: "压缩或美化HTML代码",
    category: "格式化工具",
    icon: "FileType2",
    path: "/dashboard/dev-tools/html-minifier",
  },
  {
    id: "js-minifier",
    name: "JavaScript压缩/美化",
    description: "压缩或美化JavaScript代码",
    category: "格式化工具",
    icon: "FileType",
    path: "/dashboard/dev-tools/js-minifier",
  },
  {
    id: "uuid-generator",
    name: "UUID生成器",
    description: "生成随机UUID",
    category: "生成工具",
    icon: "Key",
    path: "/dashboard/dev-tools/uuid-generator",
  },
  {
    id: "password-generator",
    name: "密码生成器",
    description: "生成安全的随机密码",
    category: "生成工具",
    icon: "KeyRound",
    path: "/dashboard/dev-tools/password-generator",
  },
  {
    id: "cron-parser",
    name: "Cron表达式解析",
    description: "解析和验证Cron表达式",
    category: "开发辅助",
    icon: "Calendar",
    path: "/dashboard/dev-tools/cron-parser",
  },
  {
    id: "code-formatter",
    name: "代码格式化工具",
    description: "格式化和美化各种编程语言代码",
    category: "格式化工具",
    icon: "FileCode",
    path: "/dashboard/dev-tools/code-formatter",
    featured: true,
    new: true,
  },
]

// 本地存储键
const TOOLS_STORAGE_KEY = "yanyu-dev-tools"
const SNIPPETS_STORAGE_KEY = "yanyu-code-snippets"
const API_REQUESTS_STORAGE_KEY = "yanyu-api-requests"
const REGEX_PATTERNS_STORAGE_KEY = "yanyu-regex-patterns"
const COLOR_PALETTES_STORAGE_KEY = "yanyu-color-palettes"
const SETTINGS_STORAGE_KEY = "yanyu-dev-tools-settings"

// 默认设置
const defaultSettings: DevToolsSettings = {
  theme: "system",
  codeEditorTheme: "vs-dark",
  fontSize: 14,
  tabSize: 2,
  recentTools: [],
  favoriteTools: [],
}

// 工具管理
export const getTools = (): DevTool[] => {
  if (typeof window === "undefined") return defaultTools

  const storedTools = localStorage.getItem(TOOLS_STORAGE_KEY)
  if (!storedTools) {
    localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(defaultTools))
    return defaultTools
  }

  return JSON.parse(storedTools)
}

export const getToolById = (id: string): DevTool | undefined => {
  const tools = getTools()
  return tools.find((tool) => tool.id === id)
}

export const getToolsByCategory = (category: string): DevTool[] => {
  const tools = getTools()
  return tools.filter((tool) => tool.category === category)
}

export const getFavoriteTools = (): DevTool[] => {
  const tools = getTools()
  const settings = getSettings()
  return tools.filter((tool) => settings.favoriteTools.includes(tool.id))
}

export const getRecentTools = (): DevTool[] => {
  const tools = getTools()
  const settings = getSettings()
  return settings.recentTools.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean) as DevTool[]
}

export const toggleFavoriteTool = (id: string): void => {
  if (typeof window === "undefined") return

  const settings = getSettings()
  if (settings.favoriteTools.includes(id)) {
    settings.favoriteTools = settings.favoriteTools.filter((toolId) => toolId !== id)
  } else {
    settings.favoriteTools.push(id)
  }

  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

export const trackToolUsage = (id: string): void => {
  if (typeof window === "undefined") return

  const settings = getSettings()
  settings.recentTools = [id, ...settings.recentTools.filter((toolId) => toolId !== id)].slice(0, 10)
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))

  const tools = getTools()
  const toolIndex = tools.findIndex((tool) => tool.id === id)
  if (toolIndex !== -1) {
    tools[toolIndex].lastUsed = new Date()
    localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(tools))
  }
}

// 代码片段管理
export const getCodeSnippets = (): CodeSnippet[] => {
  if (typeof window === "undefined") return []

  const storedSnippets = localStorage.getItem(SNIPPETS_STORAGE_KEY)
  return storedSnippets ? JSON.parse(storedSnippets) : []
}

export const getSnippetById = (id: string): CodeSnippet | undefined => {
  const snippets = getCodeSnippets()
  return snippets.find((snippet) => snippet.id === id)
}

export const saveCodeSnippet = (snippet: Omit<CodeSnippet, "id" | "createdAt" | "updatedAt">): CodeSnippet => {
  if (typeof window === "undefined") throw new Error("Cannot save snippet in server context")

  const snippets = getCodeSnippets()
  const newSnippet: CodeSnippet = {
    ...snippet,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  snippets.push(newSnippet)
  localStorage.setItem(SNIPPETS_STORAGE_KEY, JSON.stringify(snippets))
  return newSnippet
}

export const updateCodeSnippet = (
  id: string,
  updates: Partial<Omit<CodeSnippet, "id" | "createdAt" | "updatedAt">>,
): CodeSnippet => {
  if (typeof window === "undefined") throw new Error("Cannot update snippet in server context")

  const snippets = getCodeSnippets()
  const index = snippets.findIndex((snippet) => snippet.id === id)
  if (index === -1) throw new Error(`Snippet with id ${id} not found`)

  const updatedSnippet: CodeSnippet = {
    ...snippets[index],
    ...updates,
    updatedAt: new Date(),
  }

  snippets[index] = updatedSnippet
  localStorage.setItem(SNIPPETS_STORAGE_KEY, JSON.stringify(snippets))
  return updatedSnippet
}

export const deleteCodeSnippet = (id: string): void => {
  if (typeof window === "undefined") return

  const snippets = getCodeSnippets()
  const filteredSnippets = snippets.filter((snippet) => snippet.id !== id)
  localStorage.setItem(SNIPPETS_STORAGE_KEY, JSON.stringify(filteredSnippets))
}

// API请求管理
export const getApiRequests = (): ApiRequest[] => {
  if (typeof window === "undefined") return []

  const storedRequests = localStorage.getItem(API_REQUESTS_STORAGE_KEY)
  return storedRequests ? JSON.parse(storedRequests) : []
}

export const getApiRequestById = (id: string): ApiRequest | undefined => {
  const requests = getApiRequests()
  return requests.find((request) => request.id === id)
}

export const saveApiRequest = (request: Omit<ApiRequest, "id" | "createdAt" | "updatedAt">): ApiRequest => {
  if (typeof window === "undefined") throw new Error("Cannot save API request in server context")

  const requests = getApiRequests()
  const newRequest: ApiRequest = {
    ...request,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  requests.push(newRequest)
  localStorage.setItem(API_REQUESTS_STORAGE_KEY, JSON.stringify(requests))
  return newRequest
}

export const updateApiRequest = (
  id: string,
  updates: Partial<Omit<ApiRequest, "id" | "createdAt" | "updatedAt">>,
): ApiRequest => {
  if (typeof window === "undefined") throw new Error("Cannot update API request in server context")

  const requests = getApiRequests()
  const index = requests.findIndex((request) => request.id === id)
  if (index === -1) throw new Error(`API request with id ${id} not found`)

  const updatedRequest: ApiRequest = {
    ...requests[index],
    ...updates,
    updatedAt: new Date(),
  }

  requests[index] = updatedRequest
  localStorage.setItem(API_REQUESTS_STORAGE_KEY, JSON.stringify(requests))
  return updatedRequest
}

export const deleteApiRequest = (id: string): void => {
  if (typeof window === "undefined") return

  const requests = getApiRequests()
  const filteredRequests = requests.filter((request) => request.id !== id)
  localStorage.setItem(API_REQUESTS_STORAGE_KEY, JSON.stringify(filteredRequests))
}

// 正则表达式模式管理
export const getRegexPatterns = (): RegexPattern[] => {
  if (typeof window === "undefined") return []

  const storedPatterns = localStorage.getItem(REGEX_PATTERNS_STORAGE_KEY)
  return storedPatterns ? JSON.parse(storedPatterns) : []
}

export const getRegexPatternById = (id: string): RegexPattern | undefined => {
  const patterns = getRegexPatterns()
  return patterns.find((pattern) => pattern.id === id)
}

export const saveRegexPattern = (pattern: Omit<RegexPattern, "id" | "createdAt" | "updatedAt">): RegexPattern => {
  if (typeof window === "undefined") throw new Error("Cannot save regex pattern in server context")

  const patterns = getRegexPatterns()
  const newPattern: RegexPattern = {
    ...pattern,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  patterns.push(newPattern)
  localStorage.setItem(REGEX_PATTERNS_STORAGE_KEY, JSON.stringify(patterns))
  return newPattern
}

export const updateRegexPattern = (
  id: string,
  updates: Partial<Omit<RegexPattern, "id" | "createdAt" | "updatedAt">>,
): RegexPattern => {
  if (typeof window === "undefined") throw new Error("Cannot update regex pattern in server context")

  const patterns = getRegexPatterns()
  const index = patterns.findIndex((pattern) => pattern.id === id)
  if (index === -1) throw new Error(`Regex pattern with id ${id} not found`)

  const updatedPattern: RegexPattern = {
    ...patterns[index],
    ...updates,
    updatedAt: new Date(),
  }

  patterns[index] = updatedPattern
  localStorage.setItem(REGEX_PATTERNS_STORAGE_KEY, JSON.stringify(patterns))
  return updatedPattern
}

export const deleteRegexPattern = (id: string): void => {
  if (typeof window === "undefined") return

  const patterns = getRegexPatterns()
  const filteredPatterns = patterns.filter((pattern) => pattern.id !== id)
  localStorage.setItem(REGEX_PATTERNS_STORAGE_KEY, JSON.stringify(filteredPatterns))
}

// 颜色调色板管理
export const getColorPalettes = (): ColorPalette[] => {
  if (typeof window === "undefined") return []

  const storedPalettes = localStorage.getItem(COLOR_PALETTES_STORAGE_KEY)
  return storedPalettes ? JSON.parse(storedPalettes) : []
}

export const getColorPaletteById = (id: string): ColorPalette | undefined => {
  const palettes = getColorPalettes()
  return palettes.find((palette) => palette.id === id)
}

export const saveColorPalette = (palette: Omit<ColorPalette, "id" | "createdAt">): ColorPalette => {
  if (typeof window === "undefined") throw new Error("Cannot save color palette in server context")

  const palettes = getColorPalettes()
  const newPalette: ColorPalette = {
    ...palette,
    id: uuidv4(),
    createdAt: new Date(),
  }

  palettes.push(newPalette)
  localStorage.setItem(COLOR_PALETTES_STORAGE_KEY, JSON.stringify(palettes))
  return newPalette
}

export const deleteColorPalette = (id: string): void => {
  if (typeof window === "undefined") return

  const palettes = getColorPalettes()
  const filteredPalettes = palettes.filter((palette) => palette.id !== id)
  localStorage.setItem(COLOR_PALETTES_STORAGE_KEY, JSON.stringify(filteredPalettes))
}

// 设置管理
export const getSettings = (): DevToolsSettings => {
  if (typeof window === "undefined") return defaultSettings

  const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
  if (!storedSettings) {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings))
    return defaultSettings
  }

  return { ...defaultSettings, ...JSON.parse(storedSettings) }
}

export const updateSettings = (updates: Partial<DevToolsSettings>): DevToolsSettings => {
  if (typeof window === "undefined") throw new Error("Cannot update settings in server context")

  const settings = getSettings()
  const updatedSettings = { ...settings, ...updates }
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings))
  return updatedSettings
}

// 工具函数
export const formatJSON = (json: string): string => {
  try {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    throw new Error("无效的JSON格式")
  }
}

export const minifyJSON = (json: string): string => {
  try {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed)
  } catch (error) {
    throw new Error("无效的JSON格式")
  }
}

export const encodeBase64 = (text: string): string => {
  return btoa(unescape(encodeURIComponent(text)))
}

export const decodeBase64 = (base64: string): string => {
  try {
    return decodeURIComponent(escape(atob(base64)))
  } catch (error) {
    throw new Error("无效的Base64编码")
  }
}

export const encodeURL = (text: string): string => {
  return encodeURIComponent(text)
}

export const decodeURL = (encoded: string): string => {
  return decodeURIComponent(encoded)
}

export const generateUUID = (): string => {
  return uuidv4()
}

export const generatePassword = (
  length = 12,
  includeUppercase = true,
  includeLowercase = true,
  includeNumbers = true,
  includeSymbols = true,
): string => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lowercase = "abcdefghijklmnopqrstuvwxyz"
  const numbers = "0123456789"
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-="

  let chars = ""
  if (includeUppercase) chars += uppercase
  if (includeLowercase) chars += lowercase
  if (includeNumbers) chars += numbers
  if (includeSymbols) chars += symbols

  if (chars.length === 0) {
    throw new Error("至少需要选择一种字符类型")
  }

  let password = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    password += chars[randomIndex]
  }

  return password
}

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

export const timestampToDate = (timestamp: number): Date => {
  return new Date(timestamp)
}

export const dateToTimestamp = (date: Date): number => {
  return date.getTime()
}

// 代码格式化
export const formatCode = (code: string, language: string): string => {
  // 这里可以根据 language 使用不同的格式化工具
  // 例如：Prettier, js-beautify, 等
  // 为了简化，这里只是一个占位符
  return `/* Formatted ${language} code here */\n${code}`
}

export const minifyCode = (code: string, language: string): string => {
  // 这里可以根据 language 使用不同的压缩工具
  // 例如：UglifyJS, cssnano, html-minifier, 等
  // 为了简化，这里只是一个占位符
  return `/* Minified ${language} code here */\n${code}`
}
