/**
 * 数据库配置验证器
 */

export class DatabaseConfigValidator {
  /**
   * 验证 DATABASE_URL 格式
   */
  static validateDatabaseUrl(url: string): {
    isValid: boolean
    errors: string[]
    components?: any
  } {
    const errors: string[] = []

    try {
      // 解析URL
      const parsedUrl = new URL(url)

      // 验证协议
      if (parsedUrl.protocol !== "postgresql:") {
        errors.push("协议必须是 postgresql://")
      }

      // 验证主机名
      if (!parsedUrl.hostname) {
        errors.push("缺少主机名")
      }

      // 验证用户名
      if (!parsedUrl.username) {
        errors.push("缺少用户名")
      }

      // 验证密码
      if (!parsedUrl.password) {
        errors.push("缺少密码")
      }

      // 验证数据库名
      if (!parsedUrl.pathname || parsedUrl.pathname === "/") {
        errors.push("缺少数据库名")
      }

      // 检查SSL模式
      const sslMode = parsedUrl.searchParams.get("sslmode")
      if (!sslMode) {
        errors.push("建议添加 sslmode=require 参数")
      }

      return {
        isValid: errors.length === 0,
        errors,
        components: {
          protocol: parsedUrl.protocol,
          username: parsedUrl.username,
          password: "***隐藏***",
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || "5432",
          database: parsedUrl.pathname.slice(1),
          options: Object.fromEntries(parsedUrl.searchParams),
        },
      }
    } catch (error) {
      return {
        isValid: false,
        errors: ["URL格式无效"],
      }
    }
  }

  /**
   * 生成示例配置
   */
  static generateExampleConfig(projectName = "yanyu-cloud") {
    return {
      development: `postgresql://dev_user:dev_password@localhost:5432/${projectName}_dev?sslmode=prefer`,
      test: `postgresql://test_user:test_password@localhost:5432/${projectName}_test?sslmode=disable`,
      production: `postgresql://prod_user:prod_password@ep-example.us-east-1.aws.neon.tech/${projectName}_prod?sslmode=require&pgbouncer=true&connect_timeout=15`,
    }
  }
}
