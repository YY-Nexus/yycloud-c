/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 端口管理器
 * ==========================================
 */

export interface PortInfo {
  port: number
  protocol: "TCP" | "UDP" | "BOTH"
  status: "open" | "closed" | "filtered" | "unknown"
  service?: string
  description?: string
  process?: string
  pid?: number
}

export interface PortRange {
  start: number
  end: number
  category: string
  description: string
}

export class PortManager {
  // 知名端口范围定义
  private static readonly PORT_RANGES: PortRange[] = [
    {
      start: 0,
      end: 1023,
      category: "系统端口 (Well-known Ports)",
      description: "由IANA分配给系统服务的标准端口",
    },
    {
      start: 1024,
      end: 49151,
      category: "注册端口 (Registered Ports)",
      description: "由IANA注册的应用程序端口",
    },
    {
      start: 49152,
      end: 65535,
      category: "动态端口 (Dynamic/Private Ports)",
      description: "临时端口，用于客户端连接",
    },
  ]

  // 常用端口服务映射
  private static readonly COMMON_PORTS: Record<number, { service: string; description: string; protocol: string }> = {
    // Web服务
    80: { service: "HTTP", description: "超文本传输协议", protocol: "TCP" },
    443: { service: "HTTPS", description: "安全超文本传输协议", protocol: "TCP" },
    8080: { service: "HTTP-Alt", description: "HTTP备用端口", protocol: "TCP" },
    8443: { service: "HTTPS-Alt", description: "HTTPS备用端口", protocol: "TCP" },
    3000: { service: "Node.js Dev", description: "Node.js开发服务器", protocol: "TCP" },
    3001: { service: "React Dev", description: "React开发服务器", protocol: "TCP" },
    4000: { service: "Angular Dev", description: "Angular开发服务器", protocol: "TCP" },
    5173: { service: "Vite Dev", description: "Vite开发服务器", protocol: "TCP" },
    8000: { service: "Django Dev", description: "Django开发服务器", protocol: "TCP" },

    // 数据库
    3306: { service: "MySQL", description: "MySQL数据库", protocol: "TCP" },
    5432: { service: "PostgreSQL", description: "PostgreSQL数据库", protocol: "TCP" },
    27017: { service: "MongoDB", description: "MongoDB数据库", protocol: "TCP" },
    6379: { service: "Redis", description: "Redis缓存数据库", protocol: "TCP" },
    1433: { service: "SQL Server", description: "Microsoft SQL Server", protocol: "TCP" },
    5984: { service: "CouchDB", description: "Apache CouchDB", protocol: "TCP" },

    // 系统服务
    22: { service: "SSH", description: "安全外壳协议", protocol: "TCP" },
    21: { service: "FTP", description: "文件传输协议", protocol: "TCP" },
    23: { service: "Telnet", description: "远程登录协议", protocol: "TCP" },
    25: { service: "SMTP", description: "简单邮件传输协议", protocol: "TCP" },
    53: { service: "DNS", description: "域名系统", protocol: "UDP/TCP" },
    110: { service: "POP3", description: "邮局协议版本3", protocol: "TCP" },
    143: { service: "IMAP", description: "互联网消息访问协议", protocol: "TCP" },
    993: { service: "IMAPS", description: "安全IMAP", protocol: "TCP" },
    995: { service: "POP3S", description: "安全POP3", protocol: "TCP" },

    // 开发工具
    9000: { service: "SonarQube", description: "代码质量管理", protocol: "TCP" },
    8081: { service: "Jenkins", description: "持续集成工具", protocol: "TCP" },
    3001: { service: "Grafana", description: "监控仪表板", protocol: "TCP" },
    9090: { service: "Prometheus", description: "监控系统", protocol: "TCP" },
    5601: { service: "Kibana", description: "Elasticsearch可视化", protocol: "TCP" },
    9200: { service: "Elasticsearch", description: "搜索引擎", protocol: "TCP" },

    // 容器和虚拟化
    2375: { service: "Docker", description: "Docker守护进程(非安全)", protocol: "TCP" },
    2376: { service: "Docker TLS", description: "Docker守护进程(TLS)", protocol: "TCP" },
    6443: { service: "Kubernetes API", description: "Kubernetes API服务器", protocol: "TCP" },
    10250: { service: "Kubelet", description: "Kubernetes节点代理", protocol: "TCP" },

    // 消息队列
    5672: { service: "RabbitMQ", description: "RabbitMQ消息队列", protocol: "TCP" },
    15672: { service: "RabbitMQ Management", description: "RabbitMQ管理界面", protocol: "TCP" },
    9092: { service: "Kafka", description: "Apache Kafka", protocol: "TCP" },
    2181: { service: "Zookeeper", description: "Apache Zookeeper", protocol: "TCP" },

    // 游戏和娱乐
    25565: { service: "Minecraft", description: "Minecraft服务器", protocol: "TCP" },
    27015: { service: "Steam", description: "Steam游戏服务", protocol: "UDP" },
    3389: { service: "RDP", description: "远程桌面协议", protocol: "TCP" },
    5900: { service: "VNC", description: "虚拟网络计算", protocol: "TCP" },
  }

  // 获取端口信息
  static getPortInfo(port: number): PortInfo {
    const commonPort = this.COMMON_PORTS[port]
    const range = this.getPortRange(port)

    return {
      port,
      protocol: "TCP", // 默认TCP，实际应用中需要检测
      status: "unknown",
      service: commonPort?.service,
      description: commonPort?.description || `${range.category}范围内的端口`,
    }
  }

  // 获取端口范围信息
  static getPortRange(port: number): PortRange {
    return (
      this.PORT_RANGES.find((range) => port >= range.start && port <= range.end) || {
        start: 0,
        end: 65535,
        category: "未知范围",
        description: "端口号超出标准范围",
      }
    )
  }

  // 获取所有端口范围
  static getAllPortRanges(): PortRange[] {
    return this.PORT_RANGES
  }

  // 获取常用端口列表
  static getCommonPorts(): Array<{ port: number; info: (typeof this.COMMON_PORTS)[number] }> {
    return Object.entries(this.COMMON_PORTS).map(([port, info]) => ({
      port: Number.parseInt(port),
      info,
    }))
  }

  // 按服务类型分组端口
  static getPortsByCategory(): Record<string, Array<{ port: number; info: (typeof this.COMMON_PORTS)[number] }>> {
    const categories: Record<string, Array<{ port: number; info: (typeof this.COMMON_PORTS)[number] }>> = {
      Web服务: [],
      数据库: [],
      系统服务: [],
      开发工具: [],
      容器化: [],
      消息队列: [],
      其他: [],
    }

    Object.entries(this.COMMON_PORTS).forEach(([port, info]) => {
      const portNum = Number.parseInt(port)
      const portInfo = { port: portNum, info }

      if (
        info.service.includes("HTTP") ||
        ["Node.js Dev", "React Dev", "Angular Dev", "Vite Dev", "Django Dev"].includes(info.service)
      ) {
        categories["Web服务"].push(portInfo)
      } else if (["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQL Server", "CouchDB"].includes(info.service)) {
        categories["数据库"].push(portInfo)
      } else if (["SSH", "FTP", "Telnet", "SMTP", "DNS", "POP3", "IMAP", "IMAPS", "POP3S"].includes(info.service)) {
        categories["系统服务"].push(portInfo)
      } else if (["SonarQube", "Jenkins", "Grafana", "Prometheus", "Kibana", "Elasticsearch"].includes(info.service)) {
        categories["开发工具"].push(portInfo)
      } else if (
        info.service.includes("Docker") ||
        info.service.includes("Kubernetes") ||
        info.service.includes("Kubelet")
      ) {
        categories["容器化"].push(portInfo)
      } else if (["RabbitMQ", "Kafka", "Zookeeper"].includes(info.service) || info.service.includes("RabbitMQ")) {
        categories["消息队列"].push(portInfo)
      } else {
        categories["其他"].push(portInfo)
      }
    })

    return categories
  }

  // 检查端口是否可用（模拟）
  static async checkPortAvailability(port: number): Promise<boolean> {
    // 在实际应用中，这里会进行真实的端口检测
    // 这里只是模拟
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟一些常用端口被占用
        const occupiedPorts = [80, 443, 22, 3306, 5432, 27017]
        resolve(!occupiedPorts.includes(port))
      }, 100)
    })
  }

  // 扫描端口范围（模拟）
  static async scanPortRange(startPort: number, endPort: number): Promise<PortInfo[]> {
    const results: PortInfo[] = []

    for (let port = startPort; port <= endPort; port++) {
      const isAvailable = await this.checkPortAvailability(port)
      const portInfo = this.getPortInfo(port)

      results.push({
        ...portInfo,
        status: isAvailable ? "closed" : "open",
      })
    }

    return results
  }

  // 获取推荐的可用端口
  static getRecommendedPorts(service: string): number[] {
    const recommendations: Record<string, number[]> = {
      web: [3000, 3001, 8000, 8080, 8081, 8082, 8083],
      api: [3001, 3002, 4000, 4001, 5000, 5001],
      database: [5432, 5433, 3306, 3307, 27017, 27018],
      cache: [6379, 6380, 11211],
      development: [3000, 3001, 4000, 5173, 8000, 8080],
      testing: [3002, 4001, 8001, 9000],
      monitoring: [3001, 9090, 9091, 5601],
    }

    return recommendations[service.toLowerCase()] || [3000, 8000, 8080]
  }

  // 生成端口配置建议
  static generatePortConfiguration(services: string[]): Record<string, number> {
    const config: Record<string, number> = {}
    const usedPorts = new Set<number>()

    services.forEach((service) => {
      const recommendations = this.getRecommendedPorts(service)
      const availablePort = recommendations.find((port) => !usedPorts.has(port))

      if (availablePort) {
        config[service] = availablePort
        usedPorts.add(availablePort)
      } else {
        // 如果推荐端口都被占用，从动态端口范围选择
        let port = 49152
        while (usedPorts.has(port) && port <= 65535) {
          port++
        }
        config[service] = port
        usedPorts.add(port)
      }
    })

    return config
  }

  // 验证端口号有效性
  static validatePort(port: number): { valid: boolean; message?: string } {
    if (!Number.isInteger(port)) {
      return { valid: false, message: "端口号必须是整数" }
    }

    if (port < 0 || port > 65535) {
      return { valid: false, message: "端口号必须在0-65535范围内" }
    }

    if (port < 1024) {
      return {
        valid: true,
        message: "系统端口(0-1023)，需要管理员权限",
      }
    }

    return { valid: true }
  }

  // 生成端口使用报告
  static generatePortReport(): {
    summary: {
      totalPorts: number
      systemPorts: number
      registeredPorts: number
      dynamicPorts: number
    }
    recommendations: string[]
    securityNotes: string[]
  } {
    return {
      summary: {
        totalPorts: 65536,
        systemPorts: 1024,
        registeredPorts: 48128,
        dynamicPorts: 16384,
      },
      recommendations: [
        "开发环境使用3000-4000端口范围",
        "生产环境使用标准端口(80, 443)",
        "数据库服务使用注册端口范围",
        "避免使用系统保留端口",
        "为不同环境配置不同端口",
        "使用环境变量管理端口配置",
      ],
      securityNotes: [
        "不要在生产环境暴露开发端口",
        "使用防火墙限制端口访问",
        "定期扫描开放端口",
        "关闭不必要的服务端口",
        "使用非标准端口增加安全性",
        "监控端口使用情况",
      ],
    }
  }
}

// 端口配置生成器
export class PortConfigGenerator {
  // 生成Docker端口映射
  static generateDockerPortMapping(services: Record<string, number>): string {
    const mappings = Object.entries(services)
      .map(([service, port]) => `    - "${port}:${port}"`)
      .join("\n")

    return `version: '3.8'
services:
  app:
    build: .
    ports:
${mappings}
    environment:
      - NODE_ENV=production`
  }

  // 生成Nginx端口配置
  static generateNginxConfig(port: number, upstreamPort: number): string {
    return `server {
    listen ${port};
    server_name localhost;

    location / {
        proxy_pass http://localhost:${upstreamPort};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`
  }

  // 生成环境变量配置
  static generateEnvConfig(services: Record<string, number>): string {
    return Object.entries(services)
      .map(([service, port]) => `${service.toUpperCase()}_PORT=${port}`)
      .join("\n")
  }

  // 生成防火墙规则
  static generateFirewallRules(ports: number[]): string {
    return ports.map((port) => `sudo ufw allow ${port}/tcp`).join("\n")
  }
}
