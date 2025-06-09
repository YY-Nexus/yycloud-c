import type { Workflow, WorkflowAction, AIWorkflowTemplate, WorkflowAnalytics } from "@/types/workflow"
import type { AIWorkflowSuggestion as AISuggestion } from "@/types/workflow-integrations"

export class AIWorkflowAssistant {
  private static instance: AIWorkflowAssistant

  static getInstance(): AIWorkflowAssistant {
    if (!AIWorkflowAssistant.instance) {
      AIWorkflowAssistant.instance = new AIWorkflowAssistant()
    }
    return AIWorkflowAssistant.instance
  }

  // 分析工作流并提供优化建议
  async analyzeWorkflow(workflow: Workflow, analytics?: WorkflowAnalytics): Promise<AISuggestion[]> {
    const suggestions: AISuggestion[] = []

    // 分析执行效率
    if (analytics) {
      suggestions.push(...this.analyzePerformance(workflow, analytics))
    }

    // 分析工作流结构
    suggestions.push(...this.analyzeStructure(workflow))

    // 分析集成机会
    suggestions.push(...this.analyzeIntegrationOpportunities(workflow))

    // 分析安全性
    suggestions.push(...this.analyzeSecurity(workflow))

    return suggestions.sort((a, b) => b.confidence - a.confidence)
  }

  // 性能分析
  private analyzePerformance(workflow: Workflow, analytics: WorkflowAnalytics): AISuggestion[] {
    const suggestions: AISuggestion[] = []

    // 检查执行时间
    if (analytics.averageExecutionTime > 30000) {
      // 超过30秒
      suggestions.push({
        id: `perf-${workflow.id}-1`,
        title: "优化执行时间",
        description: "工作流执行时间较长，建议添加并行处理或优化动作顺序",
        confidence: 0.8,
        category: "performance",
        suggestedChanges: [
          {
            type: "optimize_condition",
            description: "将可并行执行的动作重新排序",
            after: "建议将独立的动作设置为并行执行",
            reasoning: "减少总执行时间，提高效率",
          },
        ],
        estimatedImpact: {
          efficiency: 40,
          reliability: 0,
          cost: -10,
        },
        implementationComplexity: "medium",
      })
    }

    // 检查错误率
    if (analytics.successRate < 90) {
      suggestions.push({
        id: `perf-${workflow.id}-2`,
        title: "提高成功率",
        description: "工作流成功率较低，建议添加错误处理和重试机制",
        confidence: 0.9,
        category: "optimization",
        suggestedChanges: [
          {
            type: "add_action",
            description: "在关键动作后添加错误处理",
            after: {
              type: "condition",
              name: "错误处理",
              config: {
                condition: {
                  expression: "previous_action.success === false",
                  trueActions: ["retry_action", "send_error_notification"],
                  falseActions: [],
                },
              },
            },
            reasoning: "提高工作流的可靠性和容错能力",
          },
        ],
        estimatedImpact: {
          efficiency: 20,
          reliability: 50,
          cost: 5,
        },
        implementationComplexity: "low",
      })
    }

    return suggestions
  }

  // 结构分析
  private analyzeStructure(workflow: Workflow): AISuggestion[] {
    const suggestions: AISuggestion[] = []

    // 检查是否缺少通知
    const hasNotification = workflow.actions.some((action) => action.type === "notification" || action.type === "email")

    if (!hasNotification && workflow.actions.length > 2) {
      suggestions.push({
        id: `struct-${workflow.id}-1`,
        title: "添加完成通知",
        description: "建议在工作流完成时添加通知，以便及时了解执行状态",
        confidence: 0.7,
        category: "automation",
        suggestedChanges: [
          {
            type: "add_action",
            description: "在工作流末尾添加成功通知",
            after: {
              type: "notification",
              name: "完成通知",
              config: {
                notification: {
                  title: "工作流完成",
                  message: `工作流 "${workflow.name}" 已成功完成`,
                  type: "success",
                  channels: ["browser"],
                },
              },
            },
            reasoning: "提供及时的执行反馈，便于监控工作流状态",
          },
        ],
        estimatedImpact: {
          efficiency: 10,
          reliability: 20,
          cost: 2,
        },
        implementationComplexity: "low",
      })
    }

    // 检查是否有延迟动作但没有条件判断
    const hasDelay = workflow.actions.some((action) => action.type === "delay")
    const hasCondition = workflow.actions.some((action) => action.type === "condition")

    if (hasDelay && !hasCondition) {
      suggestions.push({
        id: `struct-${workflow.id}-2`,
        title: "优化延迟逻辑",
        description: "建议使用条件判断替代固定延迟，提高工作流的智能性",
        confidence: 0.6,
        category: "optimization",
        suggestedChanges: [
          {
            type: "modify_action",
            description: "将固定延迟改为条件延迟",
            before: "固定延迟动作",
            after: "基于条件的智能延迟",
            reasoning: "根据实际情况动态调整延迟时间，提高效率",
          },
        ],
        estimatedImpact: {
          efficiency: 25,
          reliability: 10,
          cost: 0,
        },
        implementationComplexity: "medium",
      })
    }

    return suggestions
  }

  // 集成机会分析
  private analyzeIntegrationOpportunities(workflow: Workflow): AISuggestion[] {
    const suggestions: AISuggestion[] = []

    // 检查是否可以添加Slack集成
    const hasSlack = workflow.actions.some((action) => action.config.webhook?.url?.includes("slack.com"))

    if (!hasSlack && workflow.actions.some((action) => action.type === "notification")) {
      suggestions.push({
        id: `integration-${workflow.id}-1`,
        title: "集成Slack通知",
        description: "建议将通知集成到Slack，提高团队协作效率",
        confidence: 0.8,
        category: "integration",
        suggestedChanges: [
          {
            type: "add_integration",
            description: "添加Slack集成用于团队通知",
            after: "配置Slack Webhook，将重要通知发送到团队频道",
            reasoning: "提高团队沟通效率，确保重要信息及时传达",
          },
        ],
        estimatedImpact: {
          efficiency: 30,
          reliability: 15,
          cost: 5,
        },
        implementationComplexity: "low",
      })
    }

    // 检查是否可以添加GitHub集成
    if (workflow.category === "development" || workflow.name.toLowerCase().includes("deploy")) {
      const hasGitHub = workflow.actions.some((action) => action.config.webhook?.url?.includes("github.com"))

      if (!hasGitHub) {
        suggestions.push({
          id: `integration-${workflow.id}-2`,
          title: "集成GitHub",
          description: "建议集成GitHub来自动化开发流程",
          confidence: 0.9,
          category: "integration",
          suggestedChanges: [
            {
              type: "add_integration",
              description: "添加GitHub集成用于自动化开发流程",
              after: "配置GitHub API，实现自动创建Issue、PR等功能",
              reasoning: "自动化开发流程，提高代码管理效率",
            },
          ],
          estimatedImpact: {
            efficiency: 40,
            reliability: 20,
            cost: 10,
          },
          implementationComplexity: "medium",
        })
      }
    }

    return suggestions
  }

  // 安全性分析
  private analyzeSecurity(workflow: Workflow): AISuggestion[] {
    const suggestions: AISuggestion[] = []

    // 检查是否有敏感信息硬编码
    const hasSensitiveData = workflow.variables.some(
      (variable) =>
        !variable.isSecret &&
        (variable.name.toLowerCase().includes("password") ||
          variable.name.toLowerCase().includes("token") ||
          variable.name.toLowerCase().includes("key")),
    )

    if (hasSensitiveData) {
      suggestions.push({
        id: `security-${workflow.id}-1`,
        title: "保护敏感信息",
        description: "发现可能的敏感信息，建议标记为加密存储",
        confidence: 0.95,
        category: "security",
        suggestedChanges: [
          {
            type: "modify_action",
            description: "将敏感变量标记为加密存储",
            before: "明文存储的敏感信息",
            after: "加密存储的敏感信息",
            reasoning: "保护敏感数据，提高安全性",
          },
        ],
        estimatedImpact: {
          efficiency: 0,
          reliability: 30,
          cost: 0,
        },
        implementationComplexity: "low",
      })
    }

    return suggestions
  }

  // 生成工作流模板
  async generateWorkflowTemplate(
    description: string,
    category: string,
    requirements: string[],
  ): Promise<AIWorkflowTemplate> {
    // 基于描述和需求生成模板
    const template = this.createTemplateFromDescription(description, category, requirements)
    return template
  }

  private createTemplateFromDescription(
    description: string,
    category: string,
    requirements: string[],
  ): AIWorkflowTemplate {
    const templates = this.getBuiltInTemplates()

    // 简单的模板匹配逻辑
    let bestMatch = templates[0]
    let maxScore = 0

    for (const template of templates) {
      let score = 0

      // 类别匹配
      if (template.category === category) score += 30

      // 描述关键词匹配
      const descWords = description.toLowerCase().split(" ")
      const templateWords = template.description.toLowerCase().split(" ")

      for (const word of descWords) {
        if (templateWords.includes(word)) score += 10
      }

      // 需求匹配
      for (const req of requirements) {
        if (template.requirements.some((r) => r.toLowerCase().includes(req.toLowerCase()))) {
          score += 20
        }
      }

      if (score > maxScore) {
        maxScore = score
        bestMatch = template
      }
    }

    return {
      ...bestMatch,
      id: `ai-generated-${Date.now()}`,
      name: `AI生成: ${description}`,
      description: description,
      category: category,
      aiGenerated: true,
      confidence: Math.min(maxScore / 100, 0.95),
    }
  }

  private getBuiltInTemplates(): AIWorkflowTemplate[] {
    return [
      {
        id: "monitoring-template",
        name: "系统监控模板",
        description: "监控系统状态并在异常时发送通知",
        category: "monitoring",
        useCase: "系统运维监控",
        aiGenerated: false,
        confidence: 1.0,
        triggers: [
          {
            type: "schedule",
            name: "定时检查",
            config: {
              schedule: {
                type: "interval",
                value: "300",
              },
            },
          },
        ],
        actions: [
          {
            type: "script",
            name: "检查系统状态",
            config: {
              script: {
                language: "javascript",
                code: "// 检查系统状态的代码",
              },
            },
          },
          {
            type: "condition",
            name: "状态判断",
            config: {
              condition: {
                expression: "system_status !== 'healthy'",
                trueActions: ["send_alert"],
                falseActions: [],
              },
            },
          },
          {
            type: "notification",
            name: "发送告警",
            config: {
              notification: {
                title: "系统异常告警",
                message: "系统状态异常，请及时处理",
                type: "error",
                channels: ["browser", "email"],
              },
            },
          },
        ],
        variables: [
          {
            name: "check_interval",
            type: "number",
            value: 300,
            description: "检查间隔（秒）",
          },
        ],
        integrations: ["slack", "email"],
        estimatedSetupTime: "15分钟",
        benefits: ["实时监控系统状态", "及时发现和处理异常", "减少系统停机时间"],
        requirements: ["系统监控权限", "通知渠道配置"],
      },
      {
        id: "deployment-template",
        name: "自动部署模板",
        description: "代码提交后自动部署到生产环境",
        category: "development",
        useCase: "CI/CD自动化",
        aiGenerated: false,
        confidence: 1.0,
        triggers: [
          {
            type: "webhook",
            name: "代码推送触发",
            config: {
              webhook: {
                url: "https://api.github.com/webhook",
                method: "POST",
              },
            },
          },
        ],
        actions: [
          {
            type: "script",
            name: "运行测试",
            config: {
              script: {
                language: "bash",
                code: "npm test",
              },
            },
          },
          {
            type: "condition",
            name: "测试结果判断",
            config: {
              condition: {
                expression: "test_result.success === true",
                trueActions: ["deploy"],
                falseActions: ["notify_failure"],
              },
            },
          },
          {
            type: "script",
            name: "部署应用",
            config: {
              script: {
                language: "bash",
                code: "npm run deploy",
              },
            },
          },
          {
            type: "notification",
            name: "部署成功通知",
            config: {
              notification: {
                title: "部署成功",
                message: "应用已成功部署到生产环境",
                type: "success",
                channels: ["slack"],
              },
            },
          },
        ],
        variables: [
          {
            name: "branch",
            type: "string",
            value: "main",
            description: "部署分支",
          },
        ],
        integrations: ["github", "slack"],
        estimatedSetupTime: "30分钟",
        benefits: ["自动化部署流程", "减少人工错误", "提高部署效率"],
        requirements: ["GitHub仓库访问权限", "部署环境配置", "Slack通知配置"],
      },
    ]
  }

  // 智能推荐动作
  suggestNextAction(workflow: Workflow, currentActionIndex: number): WorkflowAction[] {
    const suggestions: WorkflowAction[] = []
    const currentAction = workflow.actions[currentActionIndex]

    if (!currentAction) return suggestions

    // 基于当前动作类型推荐下一个动作
    switch (currentAction.type) {
      case "script":
        suggestions.push({
          id: "suggested-condition",
          type: "condition",
          name: "检查执行结果",
          config: {
            condition: {
              expression: "previous_action.success === true",
              trueActions: [],
              falseActions: [],
            },
          },
          enabled: true,
          order: currentActionIndex + 1,
        })
        break

      case "webhook":
        suggestions.push({
          id: "suggested-delay",
          type: "delay",
          name: "等待响应",
          config: {
            delay: {
              duration: 5,
              unit: "seconds",
            },
          },
          enabled: true,
          order: currentActionIndex + 1,
        })
        break

      case "condition":
        suggestions.push({
          id: "suggested-notification",
          type: "notification",
          name: "发送通知",
          config: {
            notification: {
              title: "工作流状态更新",
              message: "条件判断完成",
              type: "info",
              channels: ["browser"],
            },
          },
          enabled: true,
          order: currentActionIndex + 1,
        })
        break
    }

    return suggestions
  }

  // 优化工作流建议
  async optimizeWorkflow(workflow: Workflow): Promise<Workflow> {
    const optimized = { ...workflow }

    // 优化动作顺序
    optimized.actions = this.optimizeActionOrder(workflow.actions)

    // 添加错误处理
    optimized.actions = this.addErrorHandling(optimized.actions)

    // 优化变量使用
    optimized.variables = this.optimizeVariables(workflow.variables, workflow.actions)

    return optimized
  }

  private optimizeActionOrder(actions: WorkflowAction[]): WorkflowAction[] {
    // 简单的优化：将延迟动作移到最后
    const delayActions = actions.filter((action) => action.type === "delay")
    const otherActions = actions.filter((action) => action.type !== "delay")

    return [...otherActions, ...delayActions].map((action, index) => ({
      ...action,
      order: index + 1,
    }))
  }

  private addErrorHandling(actions: WorkflowAction[]): WorkflowAction[] {
    const enhanced: WorkflowAction[] = []

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i]
      enhanced.push(action)

      // 在关键动作后添加错误处理
      if (action.type === "script" || action.type === "webhook") {
        enhanced.push({
          id: `error-handler-${action.id}`,
          type: "condition",
          name: `${action.name} 错误处理`,
          config: {
            condition: {
              expression: `${action.id}.success === false`,
              trueActions: [],
              falseActions: [],
            },
          },
          enabled: true,
          order: enhanced.length,
        })
      }
    }

    return enhanced
  }

  private optimizeVariables(variables: any[], actions: WorkflowAction[]): any[] {
    // 移除未使用的变量
    const usedVariables = new Set<string>()

    // 扫描动作中使用的变量
    actions.forEach((action) => {
      const configStr = JSON.stringify(action.config)
      variables.forEach((variable) => {
        if (configStr.includes(variable.name)) {
          usedVariables.add(variable.name)
        }
      })
    })

    return variables.filter((variable) => usedVariables.has(variable.name))
  }
}

export const aiWorkflowAssistant = AIWorkflowAssistant.getInstance()
