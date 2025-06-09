/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 配置文件生成器
 * ==========================================
 */

export interface DeploymentConfig {
  projectName: string
  framework: string
  platform: string
  buildCommand?: string
  outputDirectory?: string
  installCommand?: string
  devCommand?: string
  nodeVersion?: string
  environmentVariables?: Record<string, string>
  domains?: string[]
  regions?: string[]
}

export class ConfigFileGenerator {
  // 生成 Vercel 配置文件
  generateVercelConfig(config: DeploymentConfig): string {
    const vercelConfig: any = {
      version: 2,
      name: config.projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    }

    // 根据框架设置构建配置
    switch (config.framework.toLowerCase()) {
      case "nextjs":
      case "next.js":
        vercelConfig.builds = [{ src: "package.json", use: "@vercel/next" }]
        break
      case "react":
      case "vue":
        vercelConfig.builds = [{ src: "package.json", use: "@vercel/static-build" }]
        if (config.outputDirectory) {
          vercelConfig.outputDirectory = config.outputDirectory
        }
        break
      case "express":
      case "node":
        vercelConfig.builds = [{ src: "src/index.ts", use: "@vercel/node" }]
        vercelConfig.routes = [{ src: "/(.*)", dest: "/src/index.ts" }]
        break
      default:
        vercelConfig.builds = [{ src: "package.json", use: "@vercel/static-build" }]
    }

    // 设置构建命令
    if (config.buildCommand) {
      vercelConfig.buildCommand = config.buildCommand
    }

    // 设置环境变量
    if (config.environmentVariables && Object.keys(config.environmentVariables).length > 0) {
      vercelConfig.env = config.environmentVariables
    }

    // 设置地区
    if (config.regions && config.regions.length > 0) {
      vercelConfig.regions = config.regions
    } else {
      vercelConfig.regions = ["hkg1"] // 默认香港节点
    }

    // 设置函数配置
    vercelConfig.functions = {
      "app/**/*.{js,ts}": {
        runtime: `nodejs${config.nodeVersion || "18"}.x`,
      },
    }

    return JSON.stringify(vercelConfig, null, 2)
  }

  // 生成 Netlify 配置文件
  generateNetlifyConfig(config: DeploymentConfig): string {
    const netlifyConfig = {
      build: {
        command: config.buildCommand || "npm run build",
        publish: config.outputDirectory || "dist",
      },
      context: {
        production: {
          environment: config.environmentVariables || {},
        },
      },
      redirects: [
        {
          from: "/*",
          to: "/index.html",
          status: 200,
          conditions: {
            Role: ["admin"],
          },
        },
      ],
    }

    return JSON.stringify(netlifyConfig, null, 2)
  }

  // 生成 Docker 配置文件
  generateDockerfile(config: DeploymentConfig): string {
    const framework = config.framework.toLowerCase()

    switch (framework) {
      case "nextjs":
      case "next.js":
        return this.generateNextjsDockerfile(config)
      case "react":
        return this.generateReactDockerfile(config)
      case "vue":
        return this.generateVueDockerfile(config)
      case "express":
      case "node":
        return this.generateNodeDockerfile(config)
      default:
        return this.generateGenericDockerfile(config)
    }
  }

  private generateNextjsDockerfile(config: DeploymentConfig): string {
    const nodeVersion = config.nodeVersion || "18"
    return `# Next.js Dockerfile for ${config.projectName}
FROM node:${nodeVersion}-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \\
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \\
  elif [ -f package-lock.json ]; then npm ci; \\
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \\
  else echo "Lockfile not found." && exit 1; \\
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]`
  }

  private generateReactDockerfile(config: DeploymentConfig): string {
    const nodeVersion = config.nodeVersion || "18"
    return `# React Dockerfile for ${config.projectName}
# Build stage
FROM node:${nodeVersion}-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets from build stage
COPY --from=build /app/${config.outputDirectory || "dist"} /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]`
  }

  private generateVueDockerfile(config: DeploymentConfig): string {
    const nodeVersion = config.nodeVersion || "18"
    return `# Vue.js Dockerfile for ${config.projectName}
# Build stage
FROM node:${nodeVersion}-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets from build stage
COPY --from=build /app/${config.outputDirectory || "dist"} /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]`
  }

  private generateNodeDockerfile(config: DeploymentConfig): string {
    const nodeVersion = config.nodeVersion || "18"
    return `# Node.js Dockerfile for ${config.projectName}
FROM node:${nodeVersion}-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install app dependencies
RUN npm ci --only=production

# Bundle app source
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /usr/src/app
USER nextjs

# Expose port
EXPOSE 3000

# Define the command to run the app
CMD [ "npm", "start" ]`
  }

  private generateGenericDockerfile(config: DeploymentConfig): string {
    const nodeVersion = config.nodeVersion || "18"
    return `# Generic Dockerfile for ${config.projectName}
FROM node:${nodeVersion}-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]`
  }

  // 生成 Docker Compose 配置
  generateDockerCompose(config: DeploymentConfig): string {
    return `version: '3.8'

services:
  ${config.projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-")}:
    build: .
    ports:
      - "3000:3000"
    environment:
${Object.entries(config.environmentVariables || {})
  .map(([key, value]) => `      - ${key}=${value}`)
  .join("\n")}
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  app-data:`
  }

  // 生成 GitHub Actions 工作流
  generateGitHubActions(config: DeploymentConfig): string {
    return `name: Deploy ${config.projectName}

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '${config.nodeVersion || "18"}'
        cache: 'npm'

    - name: Install dependencies
      run: ${config.installCommand || "npm ci"}

    - name: Run tests
      run: npm test --if-present

    - name: Build application
      run: ${config.buildCommand || "npm run build"}

    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: \${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: \${{ secrets.ORG_ID }}
        vercel-project-id: \${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'`
  }

  // 生成环境变量示例文件
  generateEnvExample(config: DeploymentConfig): string {
    const envVars = config.environmentVariables || {}
    const examples = {
      DATABASE_URL: "postgresql://username:password@localhost:5432/database",
      REDIS_URL: "redis://localhost:6379",
      JWT_SECRET: "your-super-secret-jwt-key",
      API_KEY: "your-api-key-here",
      NEXT_PUBLIC_APP_NAME: config.projectName,
      NEXT_PUBLIC_APP_VERSION: "1.0.0",
      NODE_ENV: "development",
      PORT: "3000",
    }

    let content = `# Environment Variables for ${config.projectName}
# Copy this file to .env and fill in your actual values

`

    // 添加用户配置的环境变量
    Object.keys(envVars).forEach((key) => {
      content += `${key}=${envVars[key]}\n`
    })

    // 添加常用的环境变量示例
    Object.entries(examples).forEach(([key, value]) => {
      if (!envVars[key]) {
        content += `# ${key}=${value}\n`
      }
    })

    return content
  }

  // 生成 Nginx 配置文件
  generateNginxConfig(config: DeploymentConfig): string {
    return `events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    keepalive_timeout  65;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/js
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    server {
        listen       80;
        server_name  localhost;

        root   /usr/share/nginx/html;
        index  index.html index.htm;

        # Handle client routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
}`
  }

  // 生成 package.json 配置
  generatePackageJson(
    config: DeploymentConfig,
    dependencies: Record<string, string>,
    devDependencies: Record<string, string>,
  ): string {
    const packageJson = {
      name: config.projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      version: "1.0.0",
      private: true,
      description: `${config.projectName} - 由 YanYu Cloud³ 部署指导引擎生成`,
      scripts: {
        dev: config.devCommand || "next dev",
        build: config.buildCommand || "next build",
        start: "next start",
        lint: "next lint",
        test: "jest",
        "test:watch": "jest --watch",
        "type-check": "tsc --noEmit",
      },
      dependencies,
      devDependencies,
      engines: {
        node: `>=${config.nodeVersion || "18"}.0.0`,
        npm: ">=8.0.0",
      },
      keywords: ["yanyu-cloud", "deployment", config.framework],
      author: "YanYu Cloud³ Deployment Engine",
      license: "MIT",
    }

    return JSON.stringify(packageJson, null, 2)
  }

  // 生成 TypeScript 配置
  generateTsConfig(config: DeploymentConfig): string {
    const framework = config.framework.toLowerCase()

    const baseConfig = {
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "es6"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        baseUrl: ".",
        paths: {
          "@/*": ["./*"],
        },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
      exclude: ["node_modules"],
    }

    // 根据框架调整配置
    switch (framework) {
      case "nextjs":
      case "next.js":
        baseConfig.compilerOptions.plugins = [{ name: "next" }]
        baseConfig.include.push(".next/types/**/*.ts")
        break
      case "react":
        baseConfig.compilerOptions.jsx = "react-jsx"
        baseConfig.compilerOptions.target = "ES2020"
        baseConfig.compilerOptions.module = "ESNext"
        break
      case "vue":
        baseConfig.compilerOptions.jsx = "preserve"
        baseConfig.include = ["env.d.ts", "src/**/*", "src/**/*.vue"]
        break
      case "express":
      case "node":
        baseConfig.compilerOptions.target = "ES2020"
        baseConfig.compilerOptions.module = "commonjs"
        baseConfig.compilerOptions.outDir = "./dist"
        baseConfig.compilerOptions.rootDir = "./src"
        baseConfig.compilerOptions.noEmit = false
        baseConfig.include = ["src/**/*"]
        break
    }

    return JSON.stringify(baseConfig, null, 2)
  }

  // 生成 ESLint 配置
  generateEslintConfig(config: DeploymentConfig): string {
    const framework = config.framework.toLowerCase()

    const baseConfig = {
      extends: ["eslint:recommended", "@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      root: true,
      env: {
        node: true,
        es6: true,
      },
      rules: {
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "prefer-const": "error",
        "no-var": "error",
      },
    }

    // 根据框架调整配置
    switch (framework) {
      case "nextjs":
      case "next.js":
        baseConfig.extends.push("next/core-web-vitals")
        baseConfig.env.browser = true
        break
      case "react":
        baseConfig.extends.push("plugin:react/recommended", "plugin:react-hooks/recommended")
        baseConfig.plugins.push("react", "react-hooks")
        baseConfig.env.browser = true
        baseConfig.settings = {
          react: {
            version: "detect",
          },
        }
        break
      case "vue":
        baseConfig.extends.push("plugin:vue/vue3-essential")
        baseConfig.plugins.push("vue")
        baseConfig.env.browser = true
        break
    }

    return JSON.stringify(baseConfig, null, 2)
  }

  // 生成完整的配置包
  generateAllConfigs(
    config: DeploymentConfig,
    dependencies: Record<string, string> = {},
    devDependencies: Record<string, string> = {},
  ): Record<string, string> {
    const configs: Record<string, string> = {}

    // 基础配置文件
    configs["package.json"] = this.generatePackageJson(config, dependencies, devDependencies)
    configs["tsconfig.json"] = this.generateTsConfig(config)
    configs[".eslintrc.json"] = this.generateEslintConfig(config)
    configs[".env.example"] = this.generateEnvExample(config)

    // 部署平台配置
    if (config.platform === "vercel") {
      configs["vercel.json"] = this.generateVercelConfig(config)
    } else if (config.platform === "netlify") {
      configs["netlify.toml"] = this.generateNetlifyConfig(config)
    }

    // Docker 配置
    configs["Dockerfile"] = this.generateDockerfile(config)
    configs["docker-compose.yml"] = this.generateDockerCompose(config)
    configs["nginx.conf"] = this.generateNginxConfig(config)

    // CI/CD 配置
    configs[".github/workflows/deploy.yml"] = this.generateGitHubActions(config)

    return configs
  }
}

export const configFileGenerator = new ConfigFileGenerator()
