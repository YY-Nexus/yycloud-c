import type { YanYuCloudServer, DeploymentPipeline, DeploymentGuideStep } from "@/types/yanyu-cloud-deployment"

// YanYu Cloud³ 服务器配置
export const YANYU_CLOUD_SERVERS: YanYuCloudServer[] = [
  {
    id: "nas-f4-423",
    name: "铁威马F4-423 NAS",
    type: "nas",
    model: "TerraMaster F4-423",
    specs: {
      cpu: "Intel 四核处理器",
      memory: "8GB DDR4",
      storage: "4×8TB WD企业级 + 2×2TB NVMe SSD",
      connectivity: ["千兆网口", "USB 3.2", "HDMI"],
    },
    status: "online",
    ipAddress: "192.168.1.100",
    macAddress: "AA:BB:CC:DD:EE:01",
    location: "主机房",
    role: "primary",
    services: [
      {
        id: "git-server",
        name: "Git 服务器",
        type: "git",
        status: "running",
        port: 22,
        version: "2.41.0",
        autoStart: true,
        dependencies: [],
        healthCheck: {
          url: "ssh://192.168.1.100:22",
          interval: 30,
          timeout: 5,
          retries: 3,
        },
        resources: { cpu: 5, memory: 512, disk: 1024 },
      },
      {
        id: "docker-engine",
        name: "Docker 容器引擎",
        type: "docker",
        status: "running",
        port: 2376,
        version: "24.0.7",
        autoStart: true,
        dependencies: [],
        healthCheck: {
          url: "tcp://192.168.1.100:2376",
          interval: 30,
          timeout: 5,
          retries: 3,
        },
        resources: { cpu: 10, memory: 2048, disk: 5120 },
      },
    ],
    lastSeen: new Date(),
    uptime: 99.8,
    temperature: 42,
    diskUsage: {
      total: 34359738368, // 32TB
      used: 8589934592, // 8TB
      available: 25769803776, // 24TB
    },
    networkStats: {
      bytesIn: 1073741824000, // 1TB
      bytesOut: 536870912000, // 500GB
      packetsIn: 1000000,
      packetsOut: 800000,
    },
  },
  {
    id: "mac-m4-pro-max",
    name: "MacBook Pro M4 Max",
    type: "mac",
    model: "MacBook Pro 16-inch M4 Pro Max",
    specs: {
      cpu: "Apple M4 Pro Max",
      memory: "128GB 统一内存",
      storage: "2TB SSD",
      connectivity: ["Thunderbolt 4", "Wi-Fi 6E", "蓝牙 5.3"],
    },
    status: "online",
    ipAddress: "192.168.1.101",
    location: "开发工位1",
    role: "development",
    services: [
      {
        id: "vscode",
        name: "VS Code 开发环境",
        type: "development",
        status: "running",
        port: 3000,
        version: "1.85.0",
        autoStart: true,
        dependencies: ["node", "git"],
        healthCheck: {
          url: "http://localhost:3000",
          interval: 60,
          timeout: 10,
          retries: 2,
        },
        resources: { cpu: 15, memory: 4096, disk: 2048 },
      },
    ],
    lastSeen: new Date(),
    uptime: 95.5,
    diskUsage: {
      total: 2199023255552, // 2TB
      used: 1099511627776, // 1TB
      available: 1099511627776, // 1TB
    },
    networkStats: {
      bytesIn: 107374182400, // 100GB
      bytesOut: 53687091200, // 50GB
      packetsIn: 500000,
      packetsOut: 400000,
    },
  },
  {
    id: "imac-m4",
    name: "iMac M4",
    type: "imac",
    model: "iMac 24-inch M4",
    specs: {
      cpu: "Apple M4",
      memory: "32GB 统一内存",
      storage: "2TB SSD",
      connectivity: ["Thunderbolt 4", "Wi-Fi 6E", "蓝牙 5.3"],
    },
    status: "online",
    ipAddress: "192.168.1.102",
    location: "开发工位2",
    role: "development",
    services: [],
    lastSeen: new Date(),
    uptime: 92.3,
    diskUsage: {
      total: 2199023255552, // 2TB
      used: 659611627776, // 600GB
      available: 1539411627776, // 1.4TB
    },
    networkStats: {
      bytesIn: 53687091200, // 50GB
      bytesOut: 26843545600, // 25GB
      packetsIn: 250000,
      packetsOut: 200000,
    },
  },
  {
    id: "imac-m1",
    name: "iMac M1",
    type: "imac",
    model: "iMac 24-inch M1",
    specs: {
      cpu: "Apple M1",
      memory: "8GB 统一内存",
      storage: "512GB SSD",
      connectivity: ["Thunderbolt 3", "Wi-Fi 6", "蓝牙 5.0"],
    },
    status: "online",
    ipAddress: "192.168.1.103",
    location: "开发工位3",
    role: "secondary",
    services: [],
    lastSeen: new Date(),
    uptime: 88.7,
    diskUsage: {
      total: 549755813888, // 512GB
      used: 274877906944, // 256GB
      available: 274877906944, // 256GB
    },
    networkStats: {
      bytesIn: 26843545600, // 25GB
      bytesOut: 13421772800, // 12.5GB
      packetsIn: 125000,
      packetsOut: 100000,
    },
  },
  {
    id: "mac-m1-pro",
    name: "MacBook Pro M1 Pro",
    type: "mac",
    model: "MacBook Pro 14-inch M1 Pro",
    specs: {
      cpu: "Apple M1 Pro",
      memory: "8GB 统一内存",
      storage: "512GB SSD",
      connectivity: ["Thunderbolt 4", "Wi-Fi 6", "蓝牙 5.0"],
    },
    status: "online",
    ipAddress: "192.168.1.104",
    location: "移动开发",
    role: "development",
    services: [],
    lastSeen: new Date(),
    uptime: 90.1,
    diskUsage: {
      total: 549755813888, // 512GB
      used: 329853906944, // 300GB
      available: 219901906944, // 200GB
    },
    networkStats: {
      bytesIn: 21474836480, // 20GB
      bytesOut: 10737418240, // 10GB
      packetsIn: 100000,
      packetsOut: 80000,
    },
  },
  {
    id: "storage-thinkplus",
    name: "ThinkPlus 移动固态硬盘",
    type: "storage",
    model: "ThinkPlus 2TB USB 3.2 PSSD",
    specs: {
      cpu: "N/A",
      memory: "N/A",
      storage: "2TB SSD",
      connectivity: ["USB 3.2", "读取速度 2000MB/s"],
    },
    status: "online",
    ipAddress: "N/A",
    location: "便携存储",
    role: "storage",
    services: [],
    lastSeen: new Date(),
    uptime: 100,
    diskUsage: {
      total: 2199023255552, // 2TB
      used: 1099511627776, // 1TB
      available: 1099511627776, // 1TB
    },
    networkStats: {
      bytesIn: 0,
      bytesOut: 0,
      packetsIn: 0,
      packetsOut: 0,
    },
  },
]

// 部署管道配置
export const DEPLOYMENT_PIPELINES: DeploymentPipeline[] = [
  {
    id: "vercel-deployment",
    name: "Vercel 自动部署",
    description: "从 Git 仓库自动部署到 Vercel 平台",
    type: "hybrid",
    stages: [
      {
        id: "git-sync",
        name: "代码同步",
        type: "build",
        commands: ["git fetch origin", "git pull origin main"],
        environment: {},
        timeout: 300,
        retryCount: 3,
        onFailure: "stop",
        artifacts: [],
        dependencies: [],
      },
      {
        id: "build",
        name: "构建应用",
        type: "build",
        commands: ["npm ci", "npm run build"],
        environment: { NODE_ENV: "production" },
        timeout: 600,
        retryCount: 2,
        onFailure: "stop",
        artifacts: [".next/", "public/"],
        dependencies: ["git-sync"],
      },
      {
        id: "test",
        name: "运行测试",
        type: "test",
        commands: ["npm run test", "npm run lint"],
        environment: { NODE_ENV: "test" },
        timeout: 300,
        retryCount: 1,
        onFailure: "continue",
        artifacts: ["coverage/"],
        dependencies: ["build"],
      },
      {
        id: "deploy",
        name: "部署到 Vercel",
        type: "deploy",
        commands: ["vercel --prod"],
        environment: { VERCEL_TOKEN: "${VERCEL_TOKEN}" },
        timeout: 600,
        retryCount: 2,
        onFailure: "rollback",
        artifacts: [],
        dependencies: ["test"],
      },
      {
        id: "verify",
        name: "部署验证",
        type: "verify",
        commands: ["curl -f https://your-app.vercel.app/api/health"],
        environment: {},
        timeout: 60,
        retryCount: 3,
        onFailure: "rollback",
        artifacts: [],
        dependencies: ["deploy"],
      },
    ],
    triggers: [
      {
        type: "git_push",
        config: { branch: "main" },
        enabled: true,
      },
      {
        type: "schedule",
        config: { cron: "0 2 * * *" },
        enabled: false,
      },
    ],
    environment: "production",
    status: "idle",
    logs: [],
  },
]

// 部署指导步骤
export const DEPLOYMENT_GUIDE_STEPS: DeploymentGuideStep[] = [
  {
    id: "nas-setup",
    title: "铁威马 F4-423 NAS 初始化配置",
    description: "配置 NAS 系统，安装必要的软件包和服务",
    category: "setup",
    difficulty: "intermediate",
    estimatedTime: "2-3 小时",
    prerequisites: ["NAS 硬件已安装", "网络连接正常", "管理员权限"],
    instructions: [
      {
        type: "ui",
        title: "访问 NAS 管理界面",
        content: "在浏览器中访问 http://192.168.1.100:8080",
        platform: "universal",
        notes: ["确保电脑与 NAS 在同一网络"],
      },
      {
        type: "config",
        title: "配置存储池",
        content: `
# RAID 5 配置 (推荐)
- 使用 3 块 8TB 硬盘组成 RAID 5
- 1 块硬盘作为热备份
- 可用容量: 约 16TB
- 容错能力: 1 块硬盘故障

# 存储分配
- 系统分区: 100GB (NVMe SSD)
- Git 仓库: 500GB (NVMe SSD)
- Docker 数据: 1TB (NVMe SSD)
- 备份存储: 剩余空间 (机械硬盘)
        `,
        platform: "nas",
        warnings: ["RAID 配置会清空所有数据"],
      },
      {
        type: "command",
        title: "安装 Docker",
        content: `
# 通过应用中心安装 Docker
1. 打开 TOS 应用中心
2. 搜索 "Docker"
3. 点击安装
4. 等待安装完成

# 或通过 SSH 命令安装
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
        `,
        language: "bash",
        platform: "nas",
      },
      {
        type: "command",
        title: "配置 Git 服务器",
        content: `
# 创建 Git 用户
sudo adduser git
sudo mkdir /home/git/.ssh
sudo chmod 700 /home/git/.ssh

# 配置 SSH 密钥
sudo touch /home/git/.ssh/authorized_keys
sudo chmod 600 /home/git/.ssh/authorized_keys
sudo chown -R git:git /home/git/.ssh

# 创建 Git 仓库目录
sudo mkdir -p /data/git-repos
sudo chown git:git /data/git-repos
        `,
        language: "bash",
        platform: "nas",
      },
    ],
    verification: [
      {
        description: "验证 Docker 安装",
        command: "docker --version",
        expectedOutput: "Docker version 24.0.7",
      },
      {
        description: "验证 Git 服务",
        command: "ssh git@192.168.1.100",
        expectedOutput: "成功连接到 Git 服务器",
      },
      {
        description: "验证存储配置",
        url: "http://192.168.1.100:8080/storage",
      },
    ],
    troubleshooting: [
      {
        problem: "无法访问 NAS 管理界面",
        symptoms: ["浏览器显示连接超时", "页面无法加载"],
        causes: ["网络配置错误", "防火墙阻止", "NAS 未启动"],
        solutions: ["检查网络连接和 IP 地址", "关闭防火墙或添加例外", "重启 NAS 设备", "使用网线直连进行初始配置"],
      },
    ],
    nextSteps: ["mac-development-setup", "git-repository-setup"],
  },
  {
    id: "mac-development-setup",
    title: "Mac 开发环境配置",
    description: "在 Mac 设备上配置完整的开发环境",
    category: "setup",
    difficulty: "beginner",
    estimatedTime: "1-2 小时",
    prerequisites: ["macOS 14.0 或更高版本", "管理员权限", "网络连接"],
    instructions: [
      {
        type: "command",
        title: "安装 Homebrew",
        content: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`,
        language: "bash",
        platform: "mac",
        notes: ["Homebrew 是 macOS 的包管理器"],
      },
      {
        type: "command",
        title: "安装开发工具",
        content: `
# 安装 Node.js 和 npm
brew install node

# 安装 Git
brew install git

# 安装 VS Code
brew install --cask visual-studio-code

# 安装 Docker Desktop
brew install --cask docker

# 安装 Vercel CLI
npm install -g vercel
        `,
        language: "bash",
        platform: "mac",
      },
      {
        type: "config",
        title: "配置 Git",
        content: `
# 设置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 配置 SSH 密钥
ssh-keygen -t ed25519 -C "your.email@example.com"
cat ~/.ssh/id_ed25519.pub

# 添加到 NAS Git 服务器
ssh-copy-id git@192.168.1.100
        `,
        language: "bash",
        platform: "mac",
      },
      {
        type: "config",
        title: "VS Code 扩展配置",
        content: `
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode-remote.remote-ssh",
    "ms-azuretools.vscode-docker",
    "github.vscode-pull-request-github",
    "vercel.vercel-vscode"
  ]
}
        `,
        language: "json",
        platform: "mac",
        notes: ["保存为 .vscode/extensions.json"],
      },
    ],
    verification: [
      {
        description: "验证 Node.js 安装",
        command: "node --version && npm --version",
        expectedOutput: "v20.x.x 和 10.x.x",
      },
      {
        description: "验证 Git 配置",
        command: "git config --list",
        expectedOutput: "显示用户名和邮箱",
      },
      {
        description: "验证 Vercel CLI",
        command: "vercel --version",
        expectedOutput: "Vercel CLI 版本号",
      },
    ],
    troubleshooting: [
      {
        problem: "Homebrew 安装失败",
        symptoms: ["命令行报错", "网络连接超时"],
        causes: ["网络问题", "权限不足", "Xcode 命令行工具未安装"],
        solutions: ["检查网络连接", "安装 Xcode 命令行工具: xcode-select --install", "使用国内镜像源"],
      },
    ],
    nextSteps: ["git-repository-setup", "vercel-project-setup"],
  },
  {
    id: "git-repository-setup",
    title: "Git 仓库配置和工作流",
    description: "建立代码仓库和自动化工作流",
    category: "configuration",
    difficulty: "intermediate",
    estimatedTime: "1 小时",
    prerequisites: ["Git 已安装", "GitHub 账户", "NAS Git 服务器已配置"],
    instructions: [
      {
        type: "command",
        title: "创建本地仓库",
        content: `
# 在 NAS 上创建裸仓库
ssh git@192.168.1.100
cd /data/git-repos
git init --bare yanyu-cloud-project.git
exit

# 在 Mac 上克隆仓库
git clone git@192.168.1.100:/data/git-repos/yanyu-cloud-project.git
cd yanyu-cloud-project
        `,
        language: "bash",
        platform: "universal",
      },
      {
        type: "config",
        title: "配置 Git Hooks",
        content: `
#!/bin/bash
# post-receive hook for automatic deployment

echo "开始自动部署..."

# 检出代码到工作目录
git --git-dir=/data/git-repos/yanyu-cloud-project.git --work-tree=/data/www/yanyu-cloud checkout -f

# 安装依赖
cd /data/www/yanyu-cloud
npm ci

# 构建项目
npm run build

# 重启服务
docker-compose restart web

echo "部署完成!"
        `,
        language: "bash",
        platform: "nas",
        notes: ["保存为 /data/git-repos/yanyu-cloud-project.git/hooks/post-receive"],
      },
      {
        type: "config",
        title: "GitHub 同步配置",
        content: `
# 添加 GitHub 远程仓库
git remote add github https://github.com/yourusername/yanyu-cloud-project.git

# 配置自动同步脚本
#!/bin/bash
# sync-to-github.sh

echo "同步到 GitHub..."
git push github main

echo "同步完成!"
        `,
        language: "bash",
        platform: "mac",
      },
    ],
    verification: [
      {
        description: "验证本地仓库",
        command: "git remote -v",
        expectedOutput: "显示 NAS 和 GitHub 远程仓库",
      },
      {
        description: "测试推送",
        command: "git push origin main",
        expectedOutput: "成功推送到 NAS",
      },
    ],
    troubleshooting: [
      {
        problem: "SSH 连接失败",
        symptoms: ["Permission denied", "Connection refused"],
        causes: ["SSH 密钥未配置", "防火墙阻止", "服务未启动"],
        solutions: ["重新生成并配置 SSH 密钥", "检查 NAS SSH 服务状态", "验证网络连接"],
      },
    ],
    nextSteps: ["vercel-project-setup", "docker-deployment"],
  },
  {
    id: "vercel-project-setup",
    title: "Vercel 项目配置和部署",
    description: "配置 Vercel 项目并建立自动部署流程",
    category: "deployment",
    difficulty: "beginner",
    estimatedTime: "30 分钟",
    prerequisites: ["Vercel 账户", "GitHub 仓库", "项目代码"],
    instructions: [
      {
        type: "command",
        title: "Vercel CLI 登录",
        content: `
# 登录 Vercel
vercel login

# 初始化项目
vercel init

# 配置项目
vercel
        `,
        language: "bash",
        platform: "mac",
      },
      {
        type: "config",
        title: "Vercel 配置文件",
        content: `
{
  "version": 2,
  "name": "yanyu-cloud-project",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "DATABASE_URL": "@database-url"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  }
}
        `,
        language: "json",
        platform: "universal",
        notes: ["保存为 vercel.json"],
      },
      {
        type: "config",
        title: "环境变量配置",
        content: `
# 生产环境变量
NEXT_PUBLIC_API_URL=https://api.yanyu-cloud.com
DATABASE_URL=postgresql://user:pass@host:5432/db
VERCEL_TOKEN=your_vercel_token

# 开发环境变量
NEXT_PUBLIC_API_URL=http://localhost:3001
DATABASE_URL=postgresql://localhost:5432/dev_db
        `,
        platform: "universal",
        notes: ["在 Vercel 控制台中配置"],
      },
    ],
    verification: [
      {
        description: "验证 Vercel 部署",
        url: "https://your-project.vercel.app",
      },
      {
        description: "检查构建日志",
        url: "https://vercel.com/dashboard",
      },
    ],
    troubleshooting: [
      {
        problem: "构建失败",
        symptoms: ["Build error", "Deployment failed"],
        causes: ["依赖问题", "环境变量缺失", "构建脚本错误"],
        solutions: ["检查 package.json 依赖", "验证环境变量配置", "查看构建日志详情"],
      },
    ],
    nextSteps: ["monitoring-setup", "backup-configuration"],
  },
]

// 获取服务器状态
export function getServerStatus(): YanYuCloudServer[] {
  return YANYU_CLOUD_SERVERS.map((server) => ({
    ...server,
    lastSeen: new Date(),
    // 模拟实时数据更新
    uptime: Math.max(85, Math.min(100, server.uptime + (Math.random() - 0.5) * 2)),
    temperature: server.temperature
      ? Math.max(35, Math.min(65, server.temperature + (Math.random() - 0.5) * 5))
      : undefined,
  }))
}

// 获取部署指导步骤
export function getDeploymentGuideSteps(): DeploymentGuideStep[] {
  return DEPLOYMENT_GUIDE_STEPS
}

// 获取部署管道
export function getDeploymentPipelines(): DeploymentPipeline[] {
  return DEPLOYMENT_PIPELINES
}

// 格式化存储大小
export function formatStorageSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"]
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

// 计算存储使用率
export function calculateStorageUsage(diskUsage: { total: number; used: number; available: number }): number {
  return Math.round((diskUsage.used / diskUsage.total) * 100)
}

// 获取服务器健康状态
export function getServerHealth(server: YanYuCloudServer): "healthy" | "warning" | "critical" {
  const storageUsage = calculateStorageUsage(server.diskUsage)
  const uptime = server.uptime

  if (uptime < 90 || storageUsage > 90 || (server.temperature && server.temperature > 60)) {
    return "critical"
  }

  if (uptime < 95 || storageUsage > 80 || (server.temperature && server.temperature > 50)) {
    return "warning"
  }

  return "healthy"
}

// 生成部署报告
export function generateDeploymentReport(): {
  summary: {
    totalServers: number
    onlineServers: number
    totalStorage: string
    usedStorage: string
    averageUptime: number
  }
  recommendations: string[]
  issues: string[]
} {
  const servers = getServerStatus()
  const onlineServers = servers.filter((s) => s.status === "online")
  const totalStorage = servers.reduce((sum, s) => sum + s.diskUsage.total, 0)
  const usedStorage = servers.reduce((sum, s) => sum + s.diskUsage.used, 0)
  const averageUptime = servers.reduce((sum, s) => sum + s.uptime, 0) / servers.length

  const recommendations: string[] = []
  const issues: string[] = []

  // 分析并生成建议
  servers.forEach((server) => {
    const health = getServerHealth(server)
    const storageUsage = calculateStorageUsage(server.diskUsage)

    if (health === "critical") {
      issues.push(`${server.name}: 状态异常，需要立即检查`)
    }

    if (storageUsage > 80) {
      recommendations.push(`${server.name}: 存储空间不足，建议清理或扩容`)
    }

    if (server.uptime < 95) {
      recommendations.push(`${server.name}: 稳定性较低，建议检查硬件和网络`)
    }
  })

  // 通用建议
  if (averageUptime > 98) {
    recommendations.push("系统整体运行稳定，建议保持当前配置")
  }

  if (usedStorage / totalStorage < 0.5) {
    recommendations.push("存储空间充足，可以考虑增加备份频率")
  }

  return {
    summary: {
      totalServers: servers.length,
      onlineServers: onlineServers.length,
      totalStorage: formatStorageSize(totalStorage),
      usedStorage: formatStorageSize(usedStorage),
      averageUptime: Math.round(averageUptime * 10) / 10,
    },
    recommendations,
    issues,
  }
}
