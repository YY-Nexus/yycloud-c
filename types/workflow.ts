export interface WorkflowTrigger {
  id: string
  type: "schedule" | "event" | "webhook" | "manual"
  name: string
  config: {
    // 定时触发器配置
    schedule?: {
      type: "interval" | "cron" | "daily" | "weekly" | "monthly"
      value: string
      timezone?: string
    }
    // 事件触发器配置
    event?: {
      source: string
      eventType: string
      conditions?: Record<string, any>
    }
    // Webhook触发器配置
    webhook?: {
      url: string
      method: "GET" | "POST" | "PUT" | "DELETE"
      headers?: Record<string, string>
    }
  }
  enabled: boolean
  lastTriggered?: Date
  nextTrigger?: Date
}

export interface WorkflowAction {
  id: string
  type: "notification" | "email" | "webhook" | "script" | "delay" | "condition"
  name: string
  config: {
    // 通知动作配置
    notification?: {
      title: string
      message: string
      type: "info" | "success" | "warning" | "error"
      channels: ("browser" | "email" | "sms")[]
    }
    // 邮件动作配置
    email?: {
      to: string[]
      cc?: string[]
      bcc?: string[]
      subject: string
      body: string
      attachments?: string[]
    }
    // Webhook动作配置
    webhook?: {
      url: string
      method: "GET" | "POST" | "PUT" | "DELETE"
      headers?: Record<string, string>
      body?: string
      timeout?: number
    }
    // 脚本动作配置
    script?: {
      language: "javascript" | "python" | "bash"
      code: string
      timeout?: number
    }
    // 延迟动作配置
    delay?: {
      duration: number
      unit: "seconds" | "minutes" | "hours" | "days"
    }
    // 条件动作配置
    condition?: {
      expression: string
      trueActions: string[]
      falseActions: string[]
    }
  }
  enabled: boolean
  order: number
}

export interface WorkflowVariable {
  id: string
  name: string
  type: "string" | "number" | "boolean" | "object" | "array"
  value: any
  description?: string
  isSecret?: boolean
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: "running" | "completed" | "failed" | "cancelled"
  startTime: Date
  endTime?: Date
  duration?: number
  triggeredBy: string
  logs: WorkflowLog[]
  variables: Record<string, any>
  error?: string
}

export interface WorkflowLog {
  id: string
  timestamp: Date
  level: "info" | "warn" | "error" | "debug"
  message: string
  actionId?: string
  data?: any
}

export interface Workflow {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  triggers: WorkflowTrigger[]
  actions: WorkflowAction[]
  variables: WorkflowVariable[]
  enabled: boolean
  createdAt: Date
  updatedAt: Date
  lastExecuted?: Date
  executionCount: number
  successCount: number
  failureCount: number
  version: number
  isTemplate?: boolean
  templateId?: string
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  icon: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: string
  triggers: Omit<WorkflowTrigger, "id" | "lastTriggered" | "nextTrigger">[]
  actions: Omit<WorkflowAction, "id">[]
  variables: Omit<WorkflowVariable, "id">[]
  usageCount: number
  rating: number
  author: string
  createdAt: Date
}

export interface WorkflowStats {
  totalWorkflows: number
  activeWorkflows: number
  totalExecutions: number
  successRate: number
  averageExecutionTime: number
  mostUsedTriggers: { type: string; count: number }[]
  mostUsedActions: { type: string; count: number }[]
  recentExecutions: WorkflowExecution[]
}
