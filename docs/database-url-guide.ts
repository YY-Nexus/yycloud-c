/**
 * DATABASE_URL 完整配置指南
 * YanYu Cloud³ Central Control Platform™
 */

// 基本结构示例
const DATABASE_URL_STRUCTURE = {
  protocol: "postgresql://", // 数据库类型
  username: "your_username", // 数据库用户名
  password: "your_password", // 数据库密码
  hostname: "ep-example.us-east-1.aws.neon.tech", // 服务器地址
  port: "5432", // 端口号（PostgreSQL默认5432）
  database: "neondb", // 数据库名称
  options: "?sslmode=require", // 连接选项
}

// Neon 数据库 URL 示例
const NEON_DATABASE_EXAMPLES = {
  // 基础连接
  basic: "postgresql://username:password@ep-example.us-east-1.aws.neon.tech/neondb?sslmode=require",

  // 带连接池的连接（推荐用于生产环境）
  pooled:
    "postgresql://username:password@ep-example.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15",

  // 直连（用于迁移和管理任务）
  direct: "postgresql://username:password@ep-example.us-east-1.aws.neon.tech/neondb?sslmode=require&direct=true",
}

// 各部分详细说明
export const DATABASE_URL_COMPONENTS = {
  protocol: {
    name: "协议",
    description: "指定数据库类型",
    examples: ["postgresql://", "mysql://", "sqlite://"],
    required: true,
  },

  username: {
    name: "用户名",
    description: "数据库登录用户名",
    example: "neon_user_12345",
    required: true,
    notes: "Neon会自动生成用户名",
  },

  password: {
    name: "密码",
    description: "数据库登录密码",
    example: "AbCdEf123456",
    required: true,
    security: "请妥善保管，不要泄露",
  },

  hostname: {
    name: "主机名",
    description: "数据库服务器地址",
    example: "ep-cool-darkness-12345.us-east-1.aws.neon.tech",
    required: true,
    notes: "Neon提供的端点地址",
  },

  port: {
    name: "端口",
    description: "数据库服务端口",
    default: "5432",
    required: false,
    notes: "PostgreSQL默认端口，通常可省略",
  },

  database: {
    name: "数据库名",
    description: "要连接的具体数据库",
    example: "neondb",
    required: true,
    notes: "Neon默认数据库名为neondb",
  },

  options: {
    name: "连接选项",
    description: "额外的连接参数",
    examples: [
      "sslmode=require", // 强制SSL连接
      "pgbouncer=true", // 启用连接池
      "connect_timeout=15", // 连接超时时间
      "direct=true", // 直连模式
    ],
    required: false,
  },
}

// 常用连接选项说明
export const CONNECTION_OPTIONS = {
  sslmode: {
    description: "SSL连接模式",
    values: {
      require: "强制使用SSL（推荐）",
      prefer: "优先使用SSL",
      disable: "禁用SSL（不推荐）",
    },
  },

  pgbouncer: {
    description: "连接池模式",
    values: {
      true: "启用PgBouncer连接池（推荐用于应用连接）",
      false: "直连模式（推荐用于迁移）",
    },
  },

  connect_timeout: {
    description: "连接超时时间（秒）",
    default: "15",
    range: "5-60",
  },

  application_name: {
    description: "应用程序名称",
    example: "yanyu-cloud-platform",
    purpose: "用于数据库监控和日志",
  },
}
