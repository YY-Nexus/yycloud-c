/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 部署模板库
 * ==========================================
 */

import type { DeploymentTemplate } from "@/types/deployment-engine"

export const deploymentTemplates: DeploymentTemplate[] = [
  {
    id: "next-vercel-advanced",
    name: "Next.js 高级部署 (Vercel)",
    description: "包含数据库、认证和监控的完整 Next.js 应用部署",
    category: "全栈应用",
    framework: "Next.js",
    language: "TypeScript",
    tags: ["React", "SSR", "Database", "Auth", "Monitoring"],
    difficulty: "advanced",
    estimatedTime: 45,
    config: {
      platform: "vercel",
      buildCommand: "npm run build",
      outputDirectory: ".next",
      installCommand: "npm install",
      environmentVariables: {
        DATABASE_URL: "",
        NEXTAUTH_SECRET: "",
        NEXTAUTH_URL: "",
      },
      ssl: true,
      cdn: true,
      analytics: true,
      monitoring: true,
    },
    steps: [
      {
        title: "环境准备",
        description: "检查项目依赖和环境配置",
        type: "setup",
        order: 1,
        dependencies: [],
        commands: [
          {
            command: "node --version",
            description: "检查 Node.js 版本",
          },
          {
            command: "npm install",
            description: "安装项目依赖",
          },
        ],
      },
      {
        title: "数据库配置",
        description: "设置和配置数据库连接",
        type: "config",
        order: 2,
        dependencies: ["setup"],
        commands: [
          {
            command: "npx prisma generate",
            description: "生成 Prisma 客户端",
          },
          {
            command: "npx prisma db push",
            description: "同步数据库架构",
          },
        ],
      },
      {
        title: "构建应用",
        description: "编译和优化生产版本",
        type: "build",
        order: 3,
        dependencies: ["config"],
        commands: [
          {
            command: "npm run build",
            description: "构建生产版本",
          },
        ],
      },
      {
        title: "部署到 Vercel",
        description: "部署到 Vercel 平台",
        type: "deploy",
        order: 4,
        dependencies: ["build"],
        commands: [
          {
            command: "vercel --prod",
            description: "部署到生产环境",
          },
        ],
      },
      {
        title: "验证部署",
        description: "检查部署状态和功能",
        type: "verify",
        order: 5,
        dependencies: ["deploy"],
        commands: [
          {
            command: "curl -f $VERCEL_URL",
            description: "检查网站可访问性",
          },
        ],
        validation: {
          type: "url",
          target: "$VERCEL_URL",
          expectedResult: "200",
          timeout: 30000,
        },
      },
    ],
    requirements: ["Node.js 18+", "npm 或 yarn", "Vercel CLI", "PostgreSQL 数据库", "GitHub 账户"],
    features: ["自动部署", "数据库集成", "用户认证", "性能监控", "CDN 加速", "SSL 证书", "环境变量管理"],
  },
  {
    id: "vue-netlify",
    name: "Vue.js + Netlify",
    description: "使用 Netlify 部署 Vue.js 单页应用",
    category: "Web应用",
    framework: "Vue.js",
    language: "JavaScript",
    tags: ["Vue", "SPA", "Netlify", "PWA"],
    difficulty: "intermediate",
    estimatedTime: 25,
    config: {
      platform: "netlify",
      buildCommand: "npm run build",
      outputDirectory: "dist",
      installCommand: "npm install",
      ssl: true,
      cdn: true,
      analytics: false,
      monitoring: false,
    },
    steps: [
      {
        title: "项目初始化",
        description: "检查 Vue 项目配置",
        type: "setup",
        order: 1,
        dependencies: [],
        commands: [
          {
            command: "npm install",
            description: "安装依赖包",
          },
          {
            command: "npm run lint",
            description: "代码质量检查",
          },
        ],
      },
      {
        title: "PWA 配置",
        description: "配置渐进式 Web 应用功能",
        type: "config",
        order: 2,
        dependencies: ["setup"],
        commands: [
          {
            command: "vue add pwa",
            description: "添加 PWA 支持",
          },
        ],
      },
      {
        title: "构建项目",
        description: "编译 Vue 应用",
        type: "build",
        order: 3,
        dependencies: ["config"],
        commands: [
          {
            command: "npm run build",
            description: "构建生产版本",
          },
        ],
      },
      {
        title: "部署到 Netlify",
        description: "上传到 Netlify 平台",
        type: "deploy",
        order: 4,
        dependencies: ["build"],
        commands: [
          {
            command: "netlify deploy --prod --dir=dist",
            description: "部署到生产环境",
          },
        ],
      },
    ],
    requirements: ["Node.js 16+", "Vue CLI", "Netlify CLI", "Git 仓库"],
    features: ["SPA 路由", "PWA 支持", "表单处理", "重定向规则", "CDN 分发"],
  },
  {
    id: "docker-kubernetes",
    name: "Docker + Kubernetes",
    description: "使用 Docker 容器化应用并部署到 Kubernetes",
    category: "容器化部署",
    framework: "Docker",
    language: "Any",
    tags: ["Docker", "Kubernetes", "Container", "Microservice"],
    difficulty: "advanced",
    estimatedTime: 60,
    config: {
      platform: "kubernetes",
      buildCommand: "docker build",
      ssl: true,
      cdn: false,
      analytics: false,
      monitoring: true,
    },
    steps: [
      {
        title: "创建 Dockerfile",
        description: "编写容器化配置文件",
        type: "config",
        order: 1,
        dependencies: [],
        commands: [
          {
            command: "touch Dockerfile",
            description: "创建 Dockerfile",
          },
        ],
      },
      {
        title: "构建 Docker 镜像",
        description: "编译应用到 Docker 镜像",
        type: "build",
        order: 2,
        dependencies: ["config"],
        commands: [
          {
            command: "docker build -t myapp:latest .",
            description: "构建 Docker 镜像",
          },
        ],
      },
      {
        title: "推送到镜像仓库",
        description: "上传镜像到 Docker Hub 或私有仓库",
        type: "deploy",
        order: 3,
        dependencies: ["build"],
        commands: [
          {
            command: "docker push myapp:latest",
            description: "推送镜像",
          },
        ],
      },
      {
        title: "部署到 Kubernetes",
        description: "在 Kubernetes 集群中部署应用",
        type: "deploy",
        order: 4,
        dependencies: ["deploy"],
        commands: [
          {
            command: "kubectl apply -f k8s/",
            description: "应用 Kubernetes 配置",
          },
        ],
      },
      {
        title: "验证部署",
        description: "检查 Pod 状态和服务可用性",
        type: "verify",
        order: 5,
        dependencies: ["deploy"],
        commands: [
          {
            command: "kubectl get pods",
            description: "检查 Pod 状态",
          },
          {
            command: "kubectl get services",
            description: "检查服务状态",
          },
        ],
      },
    ],
    requirements: ["Docker", "Kubernetes CLI (kubectl)", "Kubernetes 集群", "Docker Hub 账户"],
    features: ["容器化部署", "自动扩缩容", "负载均衡", "健康检查", "滚动更新", "服务发现"],
  },
  {
    id: "static-github-pages",
    name: "静态站点 + GitHub Pages",
    description: "使用 GitHub Pages 部署静态网站",
    category: "静态站点",
    framework: "Static",
    language: "HTML/CSS/JS",
    tags: ["Static", "GitHub Pages", "Jekyll", "Free"],
    difficulty: "beginner",
    estimatedTime: 15,
    config: {
      platform: "github",
      buildCommand: "npm run build",
      outputDirectory: "public",
      ssl: true,
      cdn: true,
      analytics: false,
      monitoring: false,
    },
    steps: [
      {
        title: "准备静态文件",
        description: "整理和优化静态资源",
        type: "setup",
        order: 1,
        dependencies: [],
        commands: [
          {
            command: "npm run build",
            description: "构建静态文件",
          },
        ],
      },
      {
        title: "配置 GitHub Pages",
        description: "在 GitHub 仓库中启用 Pages",
        type: "config",
        order: 2,
        dependencies: ["setup"],
        commands: [
          {
            command: "git add .",
            description: "添加文件到 Git",
          },
          {
            command: 'git commit -m "Deploy to GitHub Pages"',
            description: "提交更改",
          },
        ],
      },
      {
        title: "推送到 GitHub",
        description: "上传代码到 GitHub 仓库",
        type: "deploy",
        order: 3,
        dependencies: ["config"],
        commands: [
          {
            command: "git push origin main",
            description: "推送到主分支",
          },
        ],
      },
    ],
    requirements: ["GitHub 账户", "Git", "公开的 GitHub 仓库"],
    features: ["免费托管", "自定义域名", "HTTPS 支持", "自动部署", "Jekyll 支持"],
  },
]

export function getTemplatesByCategory(category: string): DeploymentTemplate[] {
  return deploymentTemplates.filter((template) => template.category === category)
}

export function getTemplatesByFramework(framework: string): DeploymentTemplate[] {
  return deploymentTemplates.filter((template) => template.framework.toLowerCase().includes(framework.toLowerCase()))
}

export function getTemplatesByDifficulty(difficulty: "beginner" | "intermediate" | "advanced"): DeploymentTemplate[] {
  return deploymentTemplates.filter((template) => template.difficulty === difficulty)
}

export function searchTemplates(query: string): DeploymentTemplate[] {
  const lowercaseQuery = query.toLowerCase()
  return deploymentTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.framework.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
