/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 项目模板生成器
 * ==========================================
 */

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  framework: string
  language: "typescript" | "javascript"
  features: string[]
  files: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  scripts: Record<string, string>
  vercelConfig?: Record<string, any>
  dockerConfig?: string
  envExample?: Record<string, string>
}

export class ProjectTemplateGenerator {
  private templates: Map<string, ProjectTemplate> = new Map()

  constructor() {
    this.initializeTemplates()
  }

  private initializeTemplates(): void {
    // Next.js TypeScript 模板
    this.templates.set("nextjs-ts", {
      id: "nextjs-ts",
      name: "Next.js + TypeScript",
      description: "现代化的 React 全栈框架，支持 SSR 和 SSG",
      framework: "nextjs",
      language: "typescript",
      features: ["SSR", "SSG", "API Routes", "TypeScript", "Tailwind CSS"],
      files: {
        "app/layout.tsx": this.getNextjsLayoutTemplate(),
        "app/page.tsx": this.getNextjsPageTemplate(),
        "app/globals.css": this.getGlobalCssTemplate(),
        "components/ui/button.tsx": this.getButtonComponentTemplate(),
        "lib/utils.ts": this.getUtilsTemplate(),
        "tailwind.config.ts": this.getTailwindConfigTemplate(),
        "tsconfig.json": this.getTsConfigTemplate(),
        "next.config.mjs": this.getNextConfigTemplate(),
        ".gitignore": this.getGitignoreTemplate("nextjs"),
        "README.md": this.getReadmeTemplate("Next.js + TypeScript"),
      },
      dependencies: {
        next: "^14.0.0",
        react: "^18.0.0",
        "react-dom": "^18.0.0",
        "class-variance-authority": "^0.7.0",
        clsx: "^2.0.0",
        "lucide-react": "^0.294.0",
        "tailwind-merge": "^2.0.0",
        "tailwindcss-animate": "^1.0.7",
      },
      devDependencies: {
        "@types/node": "^20.0.0",
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        autoprefixer: "^10.0.0",
        eslint: "^8.0.0",
        "eslint-config-next": "^14.0.0",
        postcss: "^8.0.0",
        tailwindcss: "^3.3.0",
        typescript: "^5.0.0",
      },
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
      vercelConfig: {
        version: 2,
        builds: [{ src: "package.json", use: "@vercel/next" }],
        regions: ["hkg1"],
      },
      envExample: {
        NEXT_PUBLIC_APP_NAME: "YanYu Cloud³",
        NEXT_PUBLIC_APP_VERSION: "1.0.0",
        DATABASE_URL: "your_database_url_here",
        NEXTAUTH_SECRET: "your_nextauth_secret_here",
      },
    })

    // React + Vite TypeScript 模板
    this.templates.set("react-vite-ts", {
      id: "react-vite-ts",
      name: "React + Vite + TypeScript",
      description: "快速的 React 开发环境，使用 Vite 构建工具",
      framework: "react",
      language: "typescript",
      features: ["Vite", "React 18", "TypeScript", "Tailwind CSS", "ESLint"],
      files: {
        "index.html": this.getViteIndexTemplate(),
        "src/main.tsx": this.getViteMainTemplate(),
        "src/App.tsx": this.getViteAppTemplate(),
        "src/index.css": this.getGlobalCssTemplate(),
        "src/components/Button.tsx": this.getButtonComponentTemplate(),
        "src/lib/utils.ts": this.getUtilsTemplate(),
        "vite.config.ts": this.getViteConfigTemplate(),
        "tailwind.config.js": this.getTailwindConfigJsTemplate(),
        "tsconfig.json": this.getViteTsConfigTemplate(),
        ".gitignore": this.getGitignoreTemplate("react"),
        "README.md": this.getReadmeTemplate("React + Vite + TypeScript"),
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "class-variance-authority": "^0.7.0",
        clsx: "^2.0.0",
        "lucide-react": "^0.294.0",
        "tailwind-merge": "^2.0.0",
      },
      devDependencies: {
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
        "@typescript-eslint/eslint-plugin": "^6.0.0",
        "@typescript-eslint/parser": "^6.0.0",
        "@vitejs/plugin-react": "^4.0.0",
        autoprefixer: "^10.4.0",
        eslint: "^8.45.0",
        "eslint-plugin-react-hooks": "^4.6.0",
        "eslint-plugin-react-refresh": "^0.4.0",
        postcss: "^8.4.0",
        tailwindcss: "^3.3.0",
        typescript: "^5.0.0",
        vite: "^4.4.0",
      },
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        preview: "vite preview",
      },
      vercelConfig: {
        version: 2,
        builds: [{ src: "package.json", use: "@vercel/static-build" }],
        outputDirectory: "dist",
      },
    })

    // Vue 3 + TypeScript 模板
    this.templates.set("vue3-ts", {
      id: "vue3-ts",
      name: "Vue 3 + TypeScript",
      description: "渐进式 JavaScript 框架，使用 Composition API",
      framework: "vue",
      language: "typescript",
      features: ["Vue 3", "Composition API", "TypeScript", "Vite", "Tailwind CSS"],
      files: {
        "index.html": this.getVueIndexTemplate(),
        "src/main.ts": this.getVueMainTemplate(),
        "src/App.vue": this.getVueAppTemplate(),
        "src/style.css": this.getGlobalCssTemplate(),
        "src/components/Button.vue": this.getVueButtonTemplate(),
        "vite.config.ts": this.getVueViteConfigTemplate(),
        "tailwind.config.js": this.getTailwindConfigJsTemplate(),
        "tsconfig.json": this.getVueTsConfigTemplate(),
        ".gitignore": this.getGitignoreTemplate("vue"),
        "README.md": this.getReadmeTemplate("Vue 3 + TypeScript"),
      },
      dependencies: {
        vue: "^3.3.0",
        "@headlessui/vue": "^1.7.0",
        "@heroicons/vue": "^2.0.0",
      },
      devDependencies: {
        "@vitejs/plugin-vue": "^4.2.0",
        "@vue/tsconfig": "^0.4.0",
        autoprefixer: "^10.4.0",
        postcss: "^8.4.0",
        tailwindcss: "^3.3.0",
        typescript: "^5.0.0",
        vite: "^4.4.0",
        "vue-tsc": "^1.8.0",
      },
      scripts: {
        dev: "vite",
        build: "vue-tsc && vite build",
        preview: "vite preview",
      },
      vercelConfig: {
        version: 2,
        builds: [{ src: "package.json", use: "@vercel/static-build" }],
        outputDirectory: "dist",
      },
    })

    // Express.js API 模板
    this.templates.set("express-api", {
      id: "express-api",
      name: "Express.js API",
      description: "Node.js 后端 API 服务，支持 TypeScript",
      framework: "express",
      language: "typescript",
      features: ["Express.js", "TypeScript", "CORS", "Helmet", "Morgan"],
      files: {
        "src/index.ts": this.getExpressIndexTemplate(),
        "src/routes/api.ts": this.getExpressRoutesTemplate(),
        "src/middleware/cors.ts": this.getExpressCorsTemplate(),
        "src/types/index.ts": this.getExpressTypesTemplate(),
        "tsconfig.json": this.getExpressTsConfigTemplate(),
        ".gitignore": this.getGitignoreTemplate("node"),
        "README.md": this.getReadmeTemplate("Express.js API"),
      },
      dependencies: {
        express: "^4.18.0",
        cors: "^2.8.0",
        helmet: "^7.0.0",
        morgan: "^1.10.0",
        dotenv: "^16.0.0",
      },
      devDependencies: {
        "@types/express": "^4.17.0",
        "@types/cors": "^2.8.0",
        "@types/morgan": "^1.9.0",
        "@types/node": "^20.0.0",
        nodemon: "^3.0.0",
        "ts-node": "^10.9.0",
        typescript: "^5.0.0",
      },
      scripts: {
        dev: "nodemon src/index.ts",
        build: "tsc",
        start: "node dist/index.js",
      },
      vercelConfig: {
        version: 2,
        builds: [{ src: "src/index.ts", use: "@vercel/node" }],
        routes: [{ src: "/(.*)", dest: "/src/index.ts" }],
      },
    })
  }

  // 获取所有模板
  getAllTemplates(): ProjectTemplate[] {
    return Array.from(this.templates.values())
  }

  // 根据ID获取模板
  getTemplate(id: string): ProjectTemplate | undefined {
    return this.templates.get(id)
  }

  // 根据框架筛选模板
  getTemplatesByFramework(framework: string): ProjectTemplate[] {
    return this.getAllTemplates().filter((template) => template.framework === framework)
  }

  // 生成项目文件
  generateProject(
    templateId: string,
    projectName: string,
    customConfig?: Partial<ProjectTemplate>,
  ): Record<string, string> {
    const template = this.getTemplate(templateId)
    if (!template) {
      throw new Error(`模板 ${templateId} 不存在`)
    }

    const mergedTemplate = { ...template, ...customConfig }
    const files: Record<string, string> = {}

    // 生成 package.json
    files["package.json"] = JSON.stringify(
      {
        name: projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        version: "1.0.0",
        private: true,
        scripts: mergedTemplate.scripts,
        dependencies: mergedTemplate.dependencies,
        devDependencies: mergedTemplate.devDependencies,
      },
      null,
      2,
    )

    // 生成 vercel.json（如果有配置）
    if (mergedTemplate.vercelConfig) {
      files["vercel.json"] = JSON.stringify(mergedTemplate.vercelConfig, null, 2)
    }

    // 生成 .env.example（如果有环境变量示例）
    if (mergedTemplate.envExample) {
      files[".env.example"] = Object.entries(mergedTemplate.envExample)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n")
    }

    // 生成 Dockerfile（如果有配置）
    if (mergedTemplate.dockerConfig) {
      files["Dockerfile"] = mergedTemplate.dockerConfig
    }

    // 复制模板文件
    Object.entries(mergedTemplate.files).forEach(([path, content]) => {
      files[path] = content.replace(/{{PROJECT_NAME}}/g, projectName)
    })

    return files
  }

  // 模板文件内容生成方法
  private getNextjsLayoutTemplate(): string {
    return `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '{{PROJECT_NAME}}',
  description: 'Generated by YanYu Cloud³ Deployment Engine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`
  }

  private getNextjsPageTemplate(): string {
    return `import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          欢迎使用 {{PROJECT_NAME}}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          由 YanYu Cloud³ 部署指导引擎生成
        </p>
        <div className="flex justify-center">
          <Button>开始使用</Button>
        </div>
      </div>
    </main>
  )
}`
  }

  private getGlobalCssTemplate(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`
  }

  private getButtonComponentTemplate(): string {
    return `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`
  }

  private getUtilsTemplate(): string {
    return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`
  }

  private getTailwindConfigTemplate(): string {
    return `import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
export default config`
  }

  private getTsConfigTemplate(): string {
    return `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`
  }

  private getNextConfigTemplate(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig`
  }

  private getGitignoreTemplate(type: string): string {
    const common = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~`

    const specific = {
      nextjs: `
# Next.js
.next/
out/

# Vercel
.vercel`,
      react: `
# Vite
dist/`,
      vue: `
# Vite
dist/`,
      node: `
# Logs
logs
*.log`,
    }

    return common + (specific[type] || "")
  }

  private getReadmeTemplate(projectType: string): string {
    return `# {{PROJECT_NAME}}

这是一个使用 ${projectType} 创建的项目，由 YanYu Cloud³ 部署指导引擎生成。

## 开始使用

首先，安装依赖：

\`\`\`bash
npm install
# 或
yarn install
# 或
pnpm install
\`\`\`

然后，运行开发服务器：

\`\`\`bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
\`\`\`

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 部署

### 部署到 Vercel

最简单的部署方式是使用 [Vercel Platform](https://vercel.com/new)。

### 使用 YanYu Cloud³ 部署指导引擎

1. 在部署指导引擎中创建新项目
2. 选择对应的模板
3. 配置环境变量
4. 一键部署

## 了解更多

- [YanYu Cloud³ 文档](https://yanyu-cloud.com/docs)
- [部署指导引擎](https://yanyu-cloud.com/deployment)
`
  }

  // Vite 相关模板
  private getViteIndexTemplate(): string {
    return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{PROJECT_NAME}}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
  }

  private getViteMainTemplate(): string {
    return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
  }

  private getViteAppTemplate(): string {
    return `import { Button } from './components/Button'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {{PROJECT_NAME}}
        </h1>
        <p className="text-gray-600 mb-8">
          由 YanYu Cloud³ 部署指导引擎生成
        </p>
        <Button>开始使用</Button>
      </div>
    </div>
  )
}

export default App`
  }

  private getViteConfigTemplate(): string {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`
  }

  private getTailwindConfigJsTemplate(): string {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
  }

  private getViteTsConfigTemplate(): string {
    return `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
  }

  // Vue 相关模板
  private getVueIndexTemplate(): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/svg+xml" href="/vite.svg">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{PROJECT_NAME}}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`
  }

  private getVueMainTemplate(): string {
    return `import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')`
  }

  private getVueAppTemplate(): string {
    return `<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md mx-auto text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        {{PROJECT_NAME}}
      </h1>
      <p class="text-gray-600 mb-8">
        由 YanYu Cloud³ 部署指导引擎生成
      </p>
      <Button @click="handleClick">开始使用</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from './components/Button.vue'

const handleClick = () => {
  console.log('Hello from {{PROJECT_NAME}}!')
}
</script>`
  }

  private getVueButtonTemplate(): string {
    return `<template>
  <button
    :class="buttonClass"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md'
})

defineEmits<{
  click: []
}>()

const buttonClass = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return \`\${base} \${variants[props.variant]} \${sizes[props.size]}\`
})
</script>`
  }

  private getVueViteConfigTemplate(): string {
    return `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`
  }

  private getVueTsConfigTemplate(): string {
    return `{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`
  }

  // Express.js 相关模板
  private getExpressIndexTemplate(): string {
    return `import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import apiRoutes from './routes/api'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由
app.use('/api', apiRoutes)

app.get('/', (req, res) => {
  res.json({
    message: '欢迎使用 {{PROJECT_NAME}} API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, () => {
  console.log(\`🚀 服务器运行在 http://localhost:\${PORT}\`)
})

export default app`
  }

  private getExpressRoutesTemplate(): string {
    return `import { Router } from 'express'

const router = Router()

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

router.get('/info', (req, res) => {
  res.json({
    name: '{{PROJECT_NAME}}',
    version: '1.0.0',
    description: '由 YanYu Cloud³ 部署指导引擎生成',
    node_version: process.version,
    platform: process.platform
  })
})

export default router`
  }

  private getExpressCorsTemplate(): string {
    return `import { Request, Response, NextFunction } from 'express'

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
}`
  }

  private getExpressTypesTemplate(): string {
    return `export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp: string
}

export interface HealthCheck {
  status: 'ok' | 'error'
  timestamp: string
  uptime: number
}

export interface AppInfo {
  name: string
  version: string
  description: string
  node_version: string
  platform: string
}`
  }

  private getExpressTsConfigTemplate(): string {
    return `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`
  }
}

export const projectTemplateGenerator = new ProjectTemplateGenerator()
