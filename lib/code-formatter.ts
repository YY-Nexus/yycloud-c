import type {
  FormatterConfig,
  SupportedLanguage,
  FormatResult,
  FormatterPreset,
  FormatterHistory,
} from "@/types/code-formatter"

// 支持的编程语言
export const supportedLanguages: SupportedLanguage[] = [
  {
    id: "javascript",
    name: "JavaScript",
    extensions: [".js", ".jsx"],
    defaultConfig: {
      semicolons: true,
      singleQuote: false,
      trailingComma: "es5",
      tabSize: 2,
      useTabs: false,
    },
    features: ["语法高亮", "自动缩进", "括号匹配", "代码折叠"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    extensions: [".ts", ".tsx"],
    defaultConfig: {
      semicolons: true,
      singleQuote: false,
      trailingComma: "all",
      tabSize: 2,
      useTabs: false,
    },
    features: ["类型检查", "语法高亮", "自动缩进", "智能提示"],
  },
  {
    id: "json",
    name: "JSON",
    extensions: [".json"],
    defaultConfig: {
      tabSize: 2,
      useTabs: false,
    },
    features: ["语法验证", "自动缩进", "括号匹配"],
  },
  {
    id: "css",
    name: "CSS",
    extensions: [".css"],
    defaultConfig: {
      tabSize: 2,
      useTabs: false,
      bracketSpacing: true,
    },
    features: ["属性排序", "自动缩进", "颜色预览"],
  },
  {
    id: "html",
    name: "HTML",
    extensions: [".html", ".htm"],
    defaultConfig: {
      tabSize: 2,
      useTabs: false,
      bracketSpacing: true,
    },
    features: ["标签匹配", "自动缩进", "属性排序"],
  },
  {
    id: "python",
    name: "Python",
    extensions: [".py"],
    defaultConfig: {
      tabSize: 4,
      useTabs: false,
    },
    features: ["PEP8 规范", "自动缩进", "语法检查"],
  },
  {
    id: "java",
    name: "Java",
    extensions: [".java"],
    defaultConfig: {
      tabSize: 4,
      useTabs: false,
      bracketSpacing: true,
    },
    features: ["代码规范", "自动缩进", "包导入整理"],
  },
  {
    id: "sql",
    name: "SQL",
    extensions: [".sql"],
    defaultConfig: {
      tabSize: 2,
      useTabs: false,
    },
    features: ["关键字大写", "自动缩进", "语法高亮"],
  },
]

// 预设配置
export const formatterPresets: FormatterPreset[] = [
  {
    id: "standard",
    name: "标准配置",
    description: "通用的代码格式化配置",
    config: {
      language: "javascript",
      tabSize: 2,
      useTabs: false,
      semicolons: true,
      singleQuote: false,
      trailingComma: "es5",
      bracketSpacing: true,
      arrowParens: "always",
      printWidth: 80,
      endOfLine: "lf",
    },
    languages: ["javascript", "typescript"],
    isDefault: true,
  },
  {
    id: "prettier",
    name: "Prettier 风格",
    description: "遵循 Prettier 默认配置",
    config: {
      language: "javascript",
      tabSize: 2,
      useTabs: false,
      semicolons: true,
      singleQuote: false,
      trailingComma: "es5",
      bracketSpacing: true,
      arrowParens: "always",
      printWidth: 80,
      endOfLine: "lf",
    },
    languages: ["javascript", "typescript", "css", "html"],
  },
  {
    id: "airbnb",
    name: "Airbnb 风格",
    description: "遵循 Airbnb 代码规范",
    config: {
      language: "javascript",
      tabSize: 2,
      useTabs: false,
      semicolons: true,
      singleQuote: true,
      trailingComma: "all",
      bracketSpacing: true,
      arrowParens: "avoid",
      printWidth: 100,
      endOfLine: "lf",
    },
    languages: ["javascript", "typescript"],
  },
  {
    id: "google",
    name: "Google 风格",
    description: "遵循 Google 代码规范",
    config: {
      language: "javascript",
      tabSize: 2,
      useTabs: false,
      semicolons: true,
      singleQuote: true,
      trailingComma: "es5",
      bracketSpacing: false,
      arrowParens: "always",
      printWidth: 80,
      endOfLine: "lf",
    },
    languages: ["javascript", "typescript", "java", "python"],
  },
]

// 本地存储键
const FORMATTER_HISTORY_KEY = "yanyu-formatter-history"
const FORMATTER_CONFIG_KEY = "yanyu-formatter-config"
const CUSTOM_PRESETS_KEY = "yanyu-custom-presets"

// 代码格式化函数
export const formatCode = (code: string, config: FormatterConfig): FormatResult => {
  try {
    let formatted = code

    // 基础格式化逻辑
    switch (config.language) {
      case "json":
        formatted = formatJSON(code, config)
        break
      case "javascript":
      case "typescript":
        formatted = formatJavaScript(code, config)
        break
      case "css":
        formatted = formatCSS(code, config)
        break
      case "html":
        formatted = formatHTML(code, config)
        break
      case "python":
        formatted = formatPython(code, config)
        break
      case "sql":
        formatted = formatSQL(code, config)
        break
      default:
        formatted = formatGeneric(code, config)
    }

    return {
      success: true,
      formatted,
    }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    }
  }
}

// JSON 格式化
const formatJSON = (code: string, config: FormatterConfig): string => {
  try {
    const parsed = JSON.parse(code)
    const indent = config.useTabs ? "\t" : " ".repeat(config.tabSize)
    return JSON.stringify(parsed, null, indent)
  } catch (error) {
    throw new Error("无效的 JSON 格式")
  }
}

// JavaScript/TypeScript 格式化
const formatJavaScript = (code: string, config: FormatterConfig): string => {
  let formatted = code

  // 基础缩进处理
  const indent = config.useTabs ? "\t" : " ".repeat(config.tabSize)
  const lines = formatted.split("\n")
  let indentLevel = 0

  const formattedLines = lines.map((line) => {
    const trimmed = line.trim()
    if (!trimmed) return ""

    // 处理缩进
    if (trimmed.includes("}") || trimmed.includes("]") || trimmed.includes(")"))
    )
    indentLevel = Math.max(0, indentLevel - 1)

    const indentedLine = indent.repeat(indentLevel) + trimmed

    if (trimmed.includes("{") || trimmed.includes("[") || trimmed.includes("("))
    )
    indentLevel++

    return indentedLine
  })

  formatted = formattedLines.join("\n")

  // 分号处理
  if (config.semicolons) {
    \
    formatted = formatted.replace(/([^
    ])\s*$/gm, "$1;")
  }

  // 引号处理
  if (config.singleQuote) {
    formatted = formatted.replace(/"/g, "'")
  }

  // 括号空格处理
  if (config.bracketSpacing) {
    formatted = formatted.replace(/\{([^}])/g, "{ $1")
    formatted = formatted.replace(/([^{])\}/g, "$1 }")
  }

  return formatted
}

// CSS 格式化
const formatCSS = (code: string, config: FormatterConfig): string => {
  let formatted = code
  const indent = config.useTabs ? "\t" : " ".repeat(config.tabSize)

  // 基础格式化
  formatted = formatted.replace(/\s*{\s*/g, " {\n")
  formatted = formatted.replace(/;\s*/g, ";\n")
  formatted = formatted.replace(/\s*}\s*/g, "\n}\n")

  // 缩进处理
  const lines = formatted.split("\n")
  let indentLevel = 0

  const formattedLines = lines.map((line) => {
    const trimmed = line.trim()
    if (!trimmed) return ""

    if (trimmed === "}") {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    const indentedLine = indent.repeat(indentLevel) + trimmed

    if (trimmed.includes("{")) {
      indentLevel++
    }

    return indentedLine
  })

  return formattedLines.join("\n")
}

// HTML 格式化
const formatHTML = (code: string, config: FormatterConfig): string => {
  let formatted = code
  const indent = config.useTabs ? "\t" : " ".repeat(config.tabSize)

  // 基础格式化
  formatted = formatted.replace(/>\s*</g, ">\n<")

  // 缩进处理
  const lines = formatted.split("\n")
  let indentLevel = 0

  const formattedLines = lines.map((line) => {
    const trimmed = line.trim()
    if (!trimmed) return ""

    // 自闭合标签和结束标签
    if (trimmed.startsWith("</") || trimmed.includes("/>")) {
      if (trimmed.startsWith("</")) {
        indentLevel = Math.max(0, indentLevel - 1)
      }
    }

    const indentedLine = indent.repeat(indentLevel) + trimmed

    // 开始标签
    if (trimmed.startsWith("<") && !trimmed.startsWith("</") && !trimmed.includes("/>")) {
      indentLevel++
    }

    return indentedLine
  })

  return formattedLines.join("\n")
}

// Python 格式化
const formatPython = (code: string, config: FormatterConfig): string => {
  const formatted = code
  const indent = config.useTabs ? "\t" : " ".repeat(config.tabSize)

  // 基础缩进处理
  const lines = formatted.split("\n")
  let indentLevel = 0

  const formattedLines = lines.map((line) => {
    const trimmed = line.trim()
    if (!trimmed) return ""

    // Python 缩进逻辑
    if (trimmed.endsWith(":")) {
      const indentedLine = indent.repeat(indentLevel) + trimmed
      indentLevel++
      return indentedLine
    }

    return indent.repeat(indentLevel) + trimmed
  })

  return formattedLines.join("\n")
}

// SQL 格式化
const formatSQL = (code: string, config: FormatterConfig): string => {
  let formatted = code.toUpperCase()
  const indent = config.useTabs ? "\t" : " ".repeat(config.tabSize)

  // SQL 关键字格式化
  const keywords = [
    "SELECT",
    "FROM",
    "WHERE",
    "JOIN",
    "INNER JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
    "ORDER BY",
    "GROUP BY",
    "HAVING",
  ]

  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi")
    formatted = formatted.replace(regex, `\n${keyword}`)
  })

  // 缩进处理
  const lines = formatted.split("\n")
  const formattedLines = lines.map((line) => {
    const trimmed = line.trim()
    if (!trimmed) return ""

    if (trimmed.startsWith("SELECT") || trimmed.startsWith("FROM")) {
      return trimmed
    }

    return indent + trimmed
  })

  return formattedLines.join("\n")
}

// 通用格式化
const formatGeneric = (code: string, config: FormatterConfig): string => {
  const indent = config.useTabs ? "\t" : " ".repeat(config.tabSize)
  const lines = code.split("\n")

  return lines
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return ""
      return trimmed
    })
    .join("\n")
}

// 历史记录管理
export const getFormatterHistory = (): FormatterHistory[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(FORMATTER_HISTORY_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveFormatterHistory = (history: FormatterHistory): void => {
  if (typeof window === "undefined") return

  const histories = getFormatterHistory()
  histories.unshift(history)

  // 保留最近 50 条记录
  const limitedHistories = histories.slice(0, 50)
  localStorage.setItem(FORMATTER_HISTORY_KEY, JSON.stringify(limitedHistories))
}

export const clearFormatterHistory = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem(FORMATTER_HISTORY_KEY)
}

// 配置管理
export const getFormatterConfig = (language: string): FormatterConfig => {
  if (typeof window === "undefined") {
    const lang = supportedLanguages.find((l) => l.id === language)
    return {
      language,
      tabSize: 2,
      useTabs: false,
      semicolons: true,
      singleQuote: false,
      trailingComma: "es5",
      bracketSpacing: true,
      arrowParens: "always",
      printWidth: 80,
      endOfLine: "lf",
      ...lang?.defaultConfig,
    }
  }

  const stored = localStorage.getItem(FORMATTER_CONFIG_KEY)
  const configs = stored ? JSON.parse(stored) : {}

  const lang = supportedLanguages.find((l) => l.id === language)
  return {
    language,
    tabSize: 2,
    useTabs: false,
    semicolons: true,
    singleQuote: false,
    trailingComma: "es5",
    bracketSpacing: true,
    arrowParens: "always",
    printWidth: 80,
    endOfLine: "lf",
    ...lang?.defaultConfig,
    ...configs[language],
  }
}

export const saveFormatterConfig = (language: string, config: Partial<FormatterConfig>): void => {
  if (typeof window === "undefined") return

  const stored = localStorage.getItem(FORMATTER_CONFIG_KEY)
  const configs = stored ? JSON.parse(stored) : {}

  configs[language] = { ...configs[language], ...config }
  localStorage.setItem(FORMATTER_CONFIG_KEY, JSON.stringify(configs))
}

// 预设管理
export const getCustomPresets = (): FormatterPreset[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(CUSTOM_PRESETS_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveCustomPreset = (preset: Omit<FormatterPreset, "id">): FormatterPreset => {
  if (typeof window === "undefined") throw new Error("Cannot save preset in server context")

  const presets = getCustomPresets()
  const newPreset: FormatterPreset = {
    ...preset,
    id: `custom-${Date.now()}`,
  }

  presets.push(newPreset)
  localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(presets))
  return newPreset
}

export const deleteCustomPreset = (id: string): void => {
  if (typeof window === "undefined") return

  const presets = getCustomPresets()
  const filtered = presets.filter((p) => p.id !== id)
  localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(filtered))
}

// 语言检测
export const detectLanguage = (code: string, filename?: string): string => {
  if (filename) {
    const ext = filename.toLowerCase().split(".").pop()
    const lang = supportedLanguages.find((l) => l.extensions.some((e) => e.slice(1) === ext))
    if (lang) return lang.id
  }

  // 基于代码内容检测
  if (code.includes("function") || code.includes("const") || code.includes("let")) {
    return "javascript"
  }
  if (code.includes("interface") || code.includes("type") || code.includes(": string")) {
    return "typescript"
  }
  if (code.trim().startsWith("{") && code.trim().endsWith("}")) {
    try {
      JSON.parse(code)
      return "json"
    } catch {
      // 不是有效的 JSON
    }
  }
  if (code.includes("def ") || code.includes("import ")) {
    return "python"
  }
  if (code.includes("SELECT") || code.includes("FROM")) {
    return "sql"
  }
  if (code.includes("<html") || code.includes("<!DOCTYPE")) {
    return "html"
  }
  if (code.includes("{") && code.includes("}") && code.includes(":")) {
    return "css"
  }

  return "javascript" // 默认
}

// 代码差异比较
export const compareCode = (
  original: string,
  formatted: string,
): Array<{
  line: number
  type: "added" | "removed" | "modified"
  content: string
}> => {
  const originalLines = original.split("\n")
  const formattedLines = formatted.split("\n")
  const changes: Array<{
    line: number
    type: "added" | "removed" | "modified"
    content: string
  }> = []

  const maxLines = Math.max(originalLines.length, formattedLines.length)

  for (let i = 0; i < maxLines; i++) {
    const originalLine = originalLines[i] || ""
    const formattedLine = formattedLines[i] || ""

    if (originalLine !== formattedLine) {
      if (!originalLine) {
        changes.push({
          line: i + 1,
          type: "added",
          content: formattedLine,
        })
      } else if (!formattedLine) {
        changes.push({
          line: i + 1,
          type: "removed",
          content: originalLine,
        })
      } else {
        changes.push({
          line: i + 1,
          type: "modified",
          content: formattedLine,
        })
      }
    }
  }

  return changes
}
