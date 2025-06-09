export interface FormatterConfig {
  language: string
  tabSize: number
  useTabs: boolean
  semicolons: boolean
  singleQuote: boolean
  trailingComma: "none" | "es5" | "all"
  bracketSpacing: boolean
  arrowParens: "avoid" | "always"
  printWidth: number
  endOfLine: "auto" | "lf" | "crlf" | "cr"
}

export interface SupportedLanguage {
  id: string
  name: string
  extensions: string[]
  defaultConfig: Partial<FormatterConfig>
  features: string[]
}

export interface FormatResult {
  success: boolean
  formatted?: string
  error?: string
  changes?: {
    line: number
    column: number
    type: "added" | "removed" | "modified"
    content: string
  }[]
}

export interface FormatterPreset {
  id: string
  name: string
  description: string
  config: FormatterConfig
  languages: string[]
  isDefault?: boolean
}

export interface FormatterHistory {
  id: string
  timestamp: Date
  language: string
  originalCode: string
  formattedCode: string
  config: FormatterConfig
}
