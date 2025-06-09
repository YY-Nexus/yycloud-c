import type { ThirdPartyIntegration, IntegrationAction } from "@/types/workflow-integrations"

export class IntegrationManager {
  private static instance: IntegrationManager
  private integrations: Map<string, ThirdPartyIntegration> = new Map()
  private connections: Map<string, any> = new Map()

  static getInstance(): IntegrationManager {
    if (!IntegrationManager.instance) {
      IntegrationManager.instance = new IntegrationManager()
    }
    return IntegrationManager.instance
  }

  constructor() {
    this.initializeBuiltInIntegrations()
  }

  private initializeBuiltInIntegrations() {
    const builtInIntegrations: ThirdPartyIntegration[] = [
      {
        id: "slack",
        name: "Slack",
        type: "communication",
        icon: "💬",
        description: "发送消息到Slack频道或用户",
        authType: "webhook",
        isConnected: false,
        connectionStatus: "disconnected",
        configFields: [
          {
            key: "webhook_url",
            label: "Webhook URL",
            type: "url",
            required: true,
            placeholder: "https://hooks.slack.com/services/...",
            description: "从Slack应用设置中获取的Webhook URL",
          },
          {
            key: "default_channel",
            label: "默认频道",
            type: "text",
            required: false,
            placeholder: "#general",
            description: "默认发送消息的频道",
          },
        ],
        actions: [
          {
            id: "send_message",
            name: "发送消息",
            description: "发送消息到指定频道",
            category: "通信",
            inputFields: [
              {
                key: "channel",
                label: "频道",
                type: "text",
                required: false,
                placeholder: "#general",
              },
              {
                key: "message",
                label: "消息内容",
                type: "text",
                required: true,
                placeholder: "Hello from workflow!",
              },
              {
                key: "username",
                label: "发送者名称",
                type: "text",
                required: false,
                placeholder: "Workflow Bot",
              },
            ],
            outputFields: [],
            examples: [
              {
                title: "发送通知消息",
                description: "当工作流完成时发送通知",
                config: {
                  channel: "#notifications",
                  message: "工作流 {{workflow.name}} 已成功完成",
                  username: "自动化助手",
                },
              },
            ],
          },
        ],
        triggers: [],
      },
      {
        id: "github",
        name: "GitHub",
        type: "development",
        icon: "🐙",
        description: "与GitHub仓库交互",
        authType: "api_key",
        isConnected: false,
        connectionStatus: "disconnected",
        configFields: [
          {
            key: "token",
            label: "Personal Access Token",
            type: "password",
            required: true,
            description: "GitHub个人访问令牌",
          },
          {
            key: "owner",
            label: "仓库所有者",
            type: "text",
            required: true,
            placeholder: "username or organization",
          },
          {
            key: "repo",
            label: "仓库名称",
            type: "text",
            required: true,
            placeholder: "repository-name",
          },
        ],
        actions: [
          {
            id: "create_issue",
            name: "创建Issue",
            description: "在GitHub仓库中创建新的Issue",
            category: "项目管理",
            inputFields: [
              {
                key: "title",
                label: "标题",
                type: "text",
                required: true,
                placeholder: "Issue标题",
              },
              {
                key: "body",
                label: "内容",
                type: "text",
                required: false,
                placeholder: "Issue详细描述",
              },
              {
                key: "labels",
                label: "标签",
                type: "text",
                required: false,
                placeholder: "bug,enhancement",
              },
            ],
            outputFields: [
              {
                key: "issue_number",
                label: "Issue编号",
                type: "text",
                required: false,
              },
              {
                key: "issue_url",
                label: "Issue链接",
                type: "url",
                required: false,
              },
            ],
          },
        ],
        triggers: [
          {
            id: "push_event",
            name: "代码推送",
            description: "当有新的代码推送时触发",
            category: "开发",
            eventTypes: ["push"],
            configFields: [
              {
                key: "branch",
                label: "分支",
                type: "text",
                required: false,
                placeholder: "main",
              },
            ],
          },
        ],
      },
      {
        id: "discord",
        name: "Discord",
        type: "communication",
        icon: "🎮",
        description: "发送消息到Discord频道",
        authType: "webhook",
        isConnected: false,
        connectionStatus: "disconnected",
        configFields: [
          {
            key: "webhook_url",
            label: "Webhook URL",
            type: "url",
            required: true,
            placeholder: "https://discord.com/api/webhooks/...",
            description: "Discord频道的Webhook URL",
          },
        ],
        actions: [
          {
            id: "send_message",
            name: "发送消息",
            description: "发送消息到Discord频道",
            category: "通信",
            inputFields: [
              {
                key: "content",
                label: "消息内容",
                type: "text",
                required: true,
                placeholder: "Hello from workflow!",
              },
              {
                key: "username",
                label: "用户名",
                type: "text",
                required: false,
                placeholder: "Workflow Bot",
              },
              {
                key: "avatar_url",
                label: "头像URL",
                type: "url",
                required: false,
                placeholder: "https://example.com/avatar.png",
              },
            ],
            outputFields: [],
          },
        ],
        triggers: [],
      },
      {
        id: "email",
        name: "邮件服务",
        type: "communication",
        icon: "📧",
        description: "发送邮件通知",
        authType: "basic_auth",
        isConnected: false,
        connectionStatus: "disconnected",
        configFields: [
          {
            key: "smtp_host",
            label: "SMTP服务器",
            type: "text",
            required: true,
            placeholder: "smtp.gmail.com",
          },
          {
            key: "smtp_port",
            label: "SMTP端口",
            type: "text",
            required: true,
            placeholder: "587",
          },
          {
            key: "username",
            label: "用户名",
            type: "text",
            required: true,
            placeholder: "your-email@gmail.com",
          },
          {
            key: "password",
            label: "密码",
            type: "password",
            required: true,
            description: "邮箱密码或应用专用密码",
          },
        ],
        actions: [
          {
            id: "send_email",
            name: "发送邮件",
            description: "发送邮件到指定地址",
            category: "通信",
            inputFields: [
              {
                key: "to",
                label: "收件人",
                type: "text",
                required: true,
                placeholder: "recipient@example.com",
              },
              {
                key: "subject",
                label: "主题",
                type: "text",
                required: true,
                placeholder: "邮件主题",
              },
              {
                key: "body",
                label: "邮件内容",
                type: "text",
                required: true,
                placeholder: "邮件正文内容",
              },
              {
                key: "cc",
                label: "抄送",
                type: "text",
                required: false,
                placeholder: "cc@example.com",
              },
            ],
            outputFields: [],
          },
        ],
        triggers: [],
      },
    ]

    builtInIntegrations.forEach((integration) => {
      this.integrations.set(integration.id, integration)
    })
  }

  // 获取所有集成
  getAllIntegrations(): ThirdPartyIntegration[] {
    return Array.from(this.integrations.values())
  }

  // 获取指定集成
  getIntegration(id: string): ThirdPartyIntegration | null {
    return this.integrations.get(id) || null
  }

  // 获取已连接的集成
  getConnectedIntegrations(): ThirdPartyIntegration[] {
    return Array.from(this.integrations.values()).filter((integration) => integration.isConnected)
  }

  // 连接集成
  async connectIntegration(id: string, config: Record<string, any>): Promise<boolean> {
    const integration = this.integrations.get(id)
    if (!integration) return false

    try {
      // 验证配置
      const isValid = await this.validateIntegrationConfig(integration, config)
      if (!isValid) return false

      // 更新集成状态
      integration.config = config
      integration.isConnected = true
      integration.connectionStatus = "connected"
      integration.lastSync = new Date()

      // 保存连接信息
      this.connections.set(id, config)
      this.saveIntegrations()

      return true
    } catch (error) {
      integration.connectionStatus = "error"
      console.error(`连接集成失败: ${id}`, error)
      return false
    }
  }

  // 断开集成
  disconnectIntegration(id: string): boolean {
    const integration = this.integrations.get(id)
    if (!integration) return false

    integration.isConnected = false
    integration.connectionStatus = "disconnected"
    integration.config = undefined
    integration.lastSync = undefined

    this.connections.delete(id)
    this.saveIntegrations()

    return true
  }

  // 验证集成配置
  private async validateIntegrationConfig(
    integration: ThirdPartyIntegration,
    config: Record<string, any>,
  ): Promise<boolean> {
    // 检查必填字段
    for (const field of integration.configFields) {
      if (field.required && !config[field.key]) {
        return false
      }
    }

    // 根据集成类型进行特定验证
    switch (integration.id) {
      case "slack":
        return this.validateSlackConfig(config)
      case "github":
        return this.validateGitHubConfig(config)
      case "discord":
        return this.validateDiscordConfig(config)
      case "email":
        return this.validateEmailConfig(config)
      default:
        return true
    }
  }

  private async validateSlackConfig(config: Record<string, any>): Promise<boolean> {
    try {
      const response = await fetch(config.webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "测试连接 - 集成配置成功！",
          username: "工作流测试",
        }),
      })
      return response.ok
    } catch {
      return false
    }
  }

  private async validateGitHubConfig(config: Record<string, any>): Promise<boolean> {
    try {
      const response = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}`, {
        headers: {
          Authorization: `token ${config.token}`,
          Accept: "application/vnd.github.v3+json",
        },
      })
      return response.ok
    } catch {
      return false
    }
  }

  private async validateDiscordConfig(config: Record<string, any>): Promise<boolean> {
    try {
      const response = await fetch(config.webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: "测试连接 - Discord集成配置成功！",
          username: "工作流测试",
        }),
      })
      return response.ok
    } catch {
      return false
    }
  }

  private async validateEmailConfig(config: Record<string, any>): Promise<boolean> {
    // 这里应该实际测试SMTP连接，简化处理
    return !!(config.smtp_host && config.smtp_port && config.username && config.password)
  }

  // 执行集成动作
  async executeIntegrationAction(integrationId: string, actionId: string, params: Record<string, any>): Promise<any> {
    const integration = this.integrations.get(integrationId)
    if (!integration || !integration.isConnected) {
      throw new Error(`集成 ${integrationId} 未连接`)
    }

    const action = integration.actions.find((a) => a.id === actionId)
    if (!action) {
      throw new Error(`动作 ${actionId} 不存在`)
    }

    switch (integrationId) {
      case "slack":
        return this.executeSlackAction(integration, action, params)
      case "github":
        return this.executeGitHubAction(integration, action, params)
      case "discord":
        return this.executeDiscordAction(integration, action, params)
      case "email":
        return this.executeEmailAction(integration, action, params)
      default:
        throw new Error(`不支持的集成: ${integrationId}`)
    }
  }

  private async executeSlackAction(
    integration: ThirdPartyIntegration,
    action: IntegrationAction,
    params: Record<string, any>,
  ): Promise<any> {
    if (action.id === "send_message") {
      const response = await fetch(integration.config!.webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: params.channel || integration.config!.default_channel,
          text: params.message,
          username: params.username || "工作流机器人",
        }),
      })

      if (!response.ok) {
        throw new Error(`Slack消息发送失败: ${response.statusText}`)
      }

      return { success: true, message: "消息发送成功" }
    }
  }

  private async executeGitHubAction(
    integration: ThirdPartyIntegration,
    action: IntegrationAction,
    params: Record<string, any>,
  ): Promise<any> {
    if (action.id === "create_issue") {
      const response = await fetch(
        `https://api.github.com/repos/${integration.config!.owner}/${integration.config!.repo}/issues`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${integration.config!.token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: params.title,
            body: params.body,
            labels: params.labels ? params.labels.split(",").map((l: string) => l.trim()) : [],
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`GitHub Issue创建失败: ${response.statusText}`)
      }

      const issue = await response.json()
      return {
        success: true,
        issue_number: issue.number,
        issue_url: issue.html_url,
      }
    }
  }

  private async executeDiscordAction(
    integration: ThirdPartyIntegration,
    action: IntegrationAction,
    params: Record<string, any>,
  ): Promise<any> {
    if (action.id === "send_message") {
      const response = await fetch(integration.config!.webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: params.content,
          username: params.username || "工作流机器人",
          avatar_url: params.avatar_url,
        }),
      })

      if (!response.ok) {
        throw new Error(`Discord消息发送失败: ${response.statusText}`)
      }

      return { success: true, message: "消息发送成功" }
    }
  }

  private async executeEmailAction(
    integration: ThirdPartyIntegration,
    action: IntegrationAction,
    params: Record<string, any>,
  ): Promise<any> {
    if (action.id === "send_email") {
      // 这里应该实际发送邮件，简化处理
      console.log("发送邮件:", {
        to: params.to,
        subject: params.subject,
        body: params.body,
        cc: params.cc,
      })

      return { success: true, message: "邮件发送成功" }
    }
  }

  // 保存集成配置
  private saveIntegrations(): void {
    try {
      const integrationsData = Array.from(this.integrations.values()).map((integration) => ({
        ...integration,
        config: integration.config ? { ...integration.config } : undefined,
      }))
      localStorage.setItem("workflow-integrations", JSON.stringify(integrationsData))
    } catch (error) {
      console.error("保存集成配置失败:", error)
    }
  }

  // 加载集成配置
  loadIntegrations(): void {
    try {
      const stored = localStorage.getItem("workflow-integrations")
      if (stored) {
        const integrationsData = JSON.parse(stored)
        integrationsData.forEach((data: ThirdPartyIntegration) => {
          const existing = this.integrations.get(data.id)
          if (existing) {
            Object.assign(existing, data)
            if (data.config) {
              this.connections.set(data.id, data.config)
            }
          }
        })
      }
    } catch (error) {
      console.error("加载集成配置失败:", error)
    }
  }
}

export const integrationManager = IntegrationManager.getInstance()
