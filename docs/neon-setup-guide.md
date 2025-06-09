# Neon 数据库设置指南

## 🚀 快速开始

### 1. 创建 Neon 账户
1. 访问 [Neon Console](https://console.neon.tech)
2. 使用 GitHub 或邮箱注册
3. 验证邮箱地址

### 2. 创建数据库项目
1. 点击 "Create Project"
2. 选择区域（推荐：us-east-1）
3. 输入项目名称：`yanyu-cloud-platform`
4. 选择 PostgreSQL 版本（推荐：15+）

### 3. 获取连接字符串
1. 进入项目控制台
2. 点击 "Connection Details"
3. 复制 "Connection string"

### 4. 配置环境变量
\`\`\`bash
# 主连接（用于应用）
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15

# Prisma 连接（用于ORM）
POSTGRES_PRISMA_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15

# 直连（用于迁移）
POSTGRES_URL_NON_POOLING=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
\`\`\`

## 🔧 高级配置

### 连接池设置
- **pgbouncer=true**: 启用连接池（推荐用于应用）
- **pgbouncer=false**: 直连模式（用于数据库迁移）

### SSL 配置
- **sslmode=require**: 强制SSL（生产环境必须）
- **sslmode=prefer**: 优先SSL（开发环境）
- **sslmode=disable**: 禁用SSL（仅测试环境）

### 超时设置
- **connect_timeout=15**: 连接超时15秒
- **statement_timeout=30000**: 语句超时30秒
- **idle_in_transaction_session_timeout=60000**: 空闲事务超时60秒

## 🛡️ 安全最佳实践

1. **密码安全**
   - 使用强密码
   - 定期轮换密码
   - 不要在代码中硬编码

2. **连接安全**
   - 始终使用SSL
   - 限制连接来源IP
   - 监控异常连接

3. **权限管理**
   - 使用最小权限原则
   - 为不同环境创建不同用户
   - 定期审查权限

## 📊 监控和维护

### 连接监控
\`\`\`sql
-- 查看当前连接
SELECT * FROM pg_stat_activity;

-- 查看数据库大小
SELECT pg_size_pretty(pg_database_size('neondb'));

-- 查看表大小
SELECT schemaname,tablename,pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size 
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
\`\`\`

### 性能优化
1. 使用连接池
2. 优化查询语句
3. 创建适当的索引
4. 定期分析表统计信息

## 🚨 故障排除

### 常见错误
1. **连接超时**: 检查网络和防火墙设置
2. **认证失败**: 验证用户名和密码
3. **SSL错误**: 确认SSL配置正确
4. **数据库不存在**: 检查数据库名称

### 调试技巧
\`\`\`bash
# 测试连接
psql "postgresql://username:password@hostname/database?sslmode=require"

# 检查SSL连接
psql "postgresql://username:password@hostname/database?sslmode=require" -c "SELECT version();"
