import type { Workflow, WorkflowExecution, WorkflowLog, WorkflowAction } from "@/types/workflow"

export class WorkflowEngine {
  private static instance: WorkflowEngine
  private workflows: Map<string, Workflow> = new Map()
  private executions: Map<string, WorkflowExecution> = new Map()
  private scheduledTasks: Map<string, NodeJS.Timeout> = new Map()

  static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine()
    }
    return WorkflowEngine.instance
  }

  // 加载工作流
  loadWorkflows(): Workflow[] {
    try {
      const stored = localStorage.getItem("workflows")
      if (stored) {
        const workflows = JSON.parse(stored) as Workflow[]
        workflows.forEach((workflow) => {
          this.workflows.set(workflow.id, workflow)
          if (workflow.enabled) {
            this.scheduleWorkflow(workflow)
          }
        })
        return workflows
      }
    } catch (error) {
      console.error("加载工作流失败:", error)
    }
    return []
  }

  // 保存工作流
  saveWorkflows(): void {
    try {
      const workflows = Array.from(this.workflows.values())
      localStorage.setItem("workflows", JSON.stringify(workflows))
    } catch (error) {
      console.error("保存工作流失败:", error)
    }
  }

  // 创建工作流
  createWorkflow(
    workflow: Omit<
      Workflow,
      "id" | "createdAt" | "updatedAt" | "executionCount" | "successCount" | "failureCount" | "version"
    >,
  ): Workflow {
    const newWorkflow: Workflow = {
      ...workflow,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0,
      successCount: 0,
      failureCount: 0,
      version: 1,
    }

    this.workflows.set(newWorkflow.id, newWorkflow)
    this.saveWorkflows()

    if (newWorkflow.enabled) {
      this.scheduleWorkflow(newWorkflow)
    }

    return newWorkflow
  }

  // 更新工作流
  updateWorkflow(id: string, updates: Partial<Workflow>): Workflow | null {
    const workflow = this.workflows.get(id)
    if (!workflow) return null

    const updatedWorkflow = {
      ...workflow,
      ...updates,
      updatedAt: new Date(),
      version: workflow.version + 1,
    }

    this.workflows.set(id, updatedWorkflow)
    this.saveWorkflows()

    // 重新调度
    this.unscheduleWorkflow(id)
    if (updatedWorkflow.enabled) {
      this.scheduleWorkflow(updatedWorkflow)
    }

    return updatedWorkflow
  }

  // 删除工作流
  deleteWorkflow(id: string): boolean {
    const workflow = this.workflows.get(id)
    if (!workflow) return false

    this.unscheduleWorkflow(id)
    this.workflows.delete(id)
    this.saveWorkflows()
    return true
  }

  // 获取工作流
  getWorkflow(id: string): Workflow | null {
    return this.workflows.get(id) || null
  }

  // 获取所有工作流
  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values())
  }

  // 执行工作流
  async executeWorkflow(
    workflowId: string,
    triggeredBy = "manual",
    variables: Record<string, any> = {},
  ): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) {
      throw new Error(`工作流 ${workflowId} 不存在`)
    }

    const execution: WorkflowExecution = {
      id: this.generateId(),
      workflowId,
      status: "running",
      startTime: new Date(),
      triggeredBy,
      logs: [],
      variables: { ...workflow.variables.reduce((acc, v) => ({ ...acc, [v.name]: v.value }), {}), ...variables },
    }

    this.executions.set(execution.id, execution)
    this.addLog(execution, "info", `工作流开始执行，触发方式: ${triggeredBy}`)

    try {
      // 按顺序执行动作
      const sortedActions = workflow.actions.sort((a, b) => a.order - b.order)

      for (const action of sortedActions) {
        if (!action.enabled) {
          this.addLog(execution, "info", `跳过已禁用的动作: ${action.name}`)
          continue
        }

        await this.executeAction(execution, action)
      }

      execution.status = "completed"
      execution.endTime = new Date()
      execution.duration = execution.endTime.getTime() - execution.startTime.getTime()

      // 更新工作流统计
      workflow.executionCount++
      workflow.successCount++
      workflow.lastExecuted = new Date()
      this.workflows.set(workflowId, workflow)
      this.saveWorkflows()

      this.addLog(execution, "info", `工作流执行完成，耗时: ${execution.duration}ms`)
    } catch (error) {
      execution.status = "failed"
      execution.endTime = new Date()
      execution.duration = execution.endTime.getTime() - execution.startTime.getTime()
      execution.error = error instanceof Error ? error.message : String(error)

      // 更新工作流统计
      workflow.executionCount++
      workflow.failureCount++
      this.workflows.set(workflowId, workflow)
      this.saveWorkflows()

      this.addLog(execution, "error", `工作流执行失败: ${execution.error}`)
    }

    this.executions.set(execution.id, execution)
    this.saveExecutions()
    return execution
  }

  // 执行动作
  private async executeAction(execution: WorkflowExecution, action: WorkflowAction): Promise<void> {
    this.addLog(execution, "info", `开始执行动作: ${action.name} (${action.type})`)

    try {
      switch (action.type) {
        case "notification":
          await this.executeNotificationAction(execution, action)
          break
        case "email":
          await this.executeEmailAction(execution, action)
          break
        case "webhook":
          await this.executeWebhookAction(execution, action)
          break
        case "script":
          await this.executeScriptAction(execution, action)
          break
        case "delay":
          await this.executeDelayAction(execution, action)
          break
        case "condition":
          await this.executeConditionAction(execution, action)
          break
        default:
          throw new Error(`不支持的动作类型: ${action.type}`)
      }

      this.addLog(execution, "info", `动作执行成功: ${action.name}`)
    } catch (error) {
      this.addLog(execution, "error", `动作执行失败: ${action.name} - ${error}`)
      throw error
    }
  }

  // 执行通知动作
  private async executeNotificationAction(execution: WorkflowExecution, action: WorkflowAction): Promise<void> {
    const config = action.config.notification
    if (!config) throw new Error("通知配置缺失")

    // 浏览器通知
    if (config.channels.includes("browser")) {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(config.title, {
            body: config.message,
            icon: "/favicon.ico",
          })
        } else if (Notification.permission !== "denied") {
          const permission = await Notification.requestPermission()
          if (permission === "granted") {
            new Notification(config.title, {
              body: config.message,
              icon: "/favicon.ico",
            })
          }
        }
      }
    }

    this.addLog(execution, "info", `发送通知: ${config.title}`)
  }

  // 执行邮件动作
  private async executeEmailAction(execution: WorkflowExecution, action: WorkflowAction): Promise<void> {
    const config = action.config.email
    if (!config) throw new Error("邮件配置缺失")

    // 这里应该集成实际的邮件服务
    this.addLog(execution, "info", `发送邮件到: ${config.to.join(", ")}`)

    // 模拟邮件发送
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  // 执行Webhook动作
  private async executeWebhookAction(execution: WorkflowExecution, action: WorkflowAction): Promise<void> {
    const config = action.config.webhook
    if (!config) throw new Error("Webhook配置缺失")

    const response = await fetch(config.url, {
      method: config.method,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: config.body ? JSON.stringify(JSON.parse(config.body)) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Webhook请求失败: ${response.status} ${response.statusText}`)
    }

    const result = await response.text()
    this.addLog(execution, "info", `Webhook调用成功: ${config.method} ${config.url}`)
    this.addLog(execution, "debug", `响应: ${result}`)
  }

  // 执行脚本动作
  private async executeScriptAction(execution: WorkflowExecution, action: WorkflowAction): Promise<void> {
    const config = action.config.script
    if (!config) throw new Error("脚本配置缺失")

    if (config.language === "javascript") {
      // 在安全的上下文中执行JavaScript
      const func = new Function("variables", "log", config.code)
      const log = (message: string) => this.addLog(execution, "info", `脚本输出: ${message}`)

      try {
        const result = func(execution.variables, log)
        this.addLog(execution, "info", `脚本执行完成`)
        if (result !== undefined) {
          this.addLog(execution, "debug", `脚本返回: ${JSON.stringify(result)}`)
        }
      } catch (error) {
        throw new Error(`脚本执行错误: ${error}`)
      }
    } else {
      throw new Error(`不支持的脚本语言: ${config.language}`)
    }
  }

  // 执行延迟动作
  private async executeDelayAction(execution: WorkflowExecution, action: WorkflowAction): Promise<void> {
    const config = action.config.delay
    if (!config) throw new Error("延迟配置缺失")

    const multipliers = {
      seconds: 1000,
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
    }

    const delayMs = config.duration * multipliers[config.unit]
    this.addLog(execution, "info", `延迟 ${config.duration} ${config.unit}`)

    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  // 执行条件动作
  private async executeConditionAction(execution: WorkflowExecution, action: WorkflowAction): Promise<void> {
    const config = action.config.condition
    if (!config) throw new Error("条件配置缺失")

    // 简单的条件表达式评估
    const result = this.evaluateCondition(config.expression, execution.variables)
    this.addLog(execution, "info", `条件评估: ${config.expression} = ${result}`)

    const actionsToExecute = result ? config.trueActions : config.falseActions
    const workflow = this.workflows.get(execution.workflowId)

    if (workflow) {
      for (const actionId of actionsToExecute) {
        const actionToExecute = workflow.actions.find((a) => a.id === actionId)
        if (actionToExecute) {
          await this.executeAction(execution, actionToExecute)
        }
      }
    }
  }

  // 评估条件表达式
  private evaluateCondition(expression: string, variables: Record<string, any>): boolean {
    try {
      // 简单的表达式评估，实际应用中应该使用更安全的表达式引擎
      const func = new Function("variables", `with(variables) { return ${expression}; }`)
      return Boolean(func(variables))
    } catch (error) {
      this.addLog({ logs: [] } as WorkflowExecution, "error", `条件表达式错误: ${error}`)
      return false
    }
  }

  // 调度工作流
  private scheduleWorkflow(workflow: Workflow): void {
    workflow.triggers.forEach((trigger) => {
      if (!trigger.enabled) return

      if (trigger.type === "schedule" && trigger.config.schedule) {
        const schedule = trigger.config.schedule
        let interval: number

        switch (schedule.type) {
          case "interval":
            interval = Number.parseInt(schedule.value) * 1000
            break
          case "daily":
            interval = 24 * 60 * 60 * 1000
            break
          case "weekly":
            interval = 7 * 24 * 60 * 60 * 1000
            break
          case "monthly":
            interval = 30 * 24 * 60 * 60 * 1000
            break
          default:
            return
        }

        const taskId = `${workflow.id}-${trigger.id}`
        const task = setInterval(() => {
          this.executeWorkflow(workflow.id, `定时触发器: ${trigger.name}`)
        }, interval)

        this.scheduledTasks.set(taskId, task)
      }
    })
  }

  // 取消调度工作流
  private unscheduleWorkflow(workflowId: string): void {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) return

    workflow.triggers.forEach((trigger) => {
      const taskId = `${workflowId}-${trigger.id}`
      const task = this.scheduledTasks.get(taskId)
      if (task) {
        clearInterval(task)
        this.scheduledTasks.delete(taskId)
      }
    })
  }

  // 添加日志
  private addLog(
    execution: WorkflowExecution,
    level: "info" | "warn" | "error" | "debug",
    message: string,
    actionId?: string,
    data?: any,
  ): void {
    const log: WorkflowLog = {
      id: this.generateId(),
      timestamp: new Date(),
      level,
      message,
      actionId,
      data,
    }

    execution.logs.push(log)
  }

  // 保存执行记录
  private saveExecutions(): void {
    try {
      const executions = Array.from(this.executions.values()).slice(-100) // 只保留最近100条
      localStorage.setItem("workflow-executions", JSON.stringify(executions))
    } catch (error) {
      console.error("保存执行记录失败:", error)
    }
  }

  // 加载执行记录
  loadExecutions(): WorkflowExecution[] {
    try {
      const stored = localStorage.getItem("workflow-executions")
      if (stored) {
        const executions = JSON.parse(stored) as WorkflowExecution[]
        executions.forEach((execution) => {
          this.executions.set(execution.id, execution)
        })
        return executions
      }
    } catch (error) {
      console.error("加载执行记录失败:", error)
    }
    return []
  }

  // 获取执行记录
  getExecution(id: string): WorkflowExecution | null {
    return this.executions.get(id) || null
  }

  // 获取工作流的执行记录
  getWorkflowExecutions(workflowId: string): WorkflowExecution[] {
    return Array.from(this.executions.values())
      .filter((execution) => execution.workflowId === workflowId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
  }

  // 生成ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  // 获取统计信息
  getStats(): any {
    const workflows = Array.from(this.workflows.values())
    const executions = Array.from(this.executions.values())

    return {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter((w) => w.enabled).length,
      totalExecutions: executions.length,
      successRate:
        executions.length > 0
          ? (executions.filter((e) => e.status === "completed").length / executions.length) * 100
          : 0,
      averageExecutionTime:
        executions.length > 0
          ? executions.filter((e) => e.duration).reduce((sum, e) => sum + (e.duration || 0), 0) /
            executions.filter((e) => e.duration).length
          : 0,
      recentExecutions: executions.slice(-10).reverse(),
    }
  }
}

export const workflowEngine = WorkflowEngine.getInstance()
