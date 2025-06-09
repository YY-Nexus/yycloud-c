export interface ThirdPartyIntegration {
  id: string
  name: string
  type: "communication" | "project_management" | "development" | "storage" | "analytics" | "crm" | "marketing"
  icon: string
  description: string
  authType: "oauth" | "api_key" | "webhook" | "basic_auth"
  configFields: IntegrationField[]
  actions: IntegrationAction[]
  triggers: IntegrationTrigger[]
  isConnected: boolean
  connectionStatus: "connected" | "disconnected" | "error" | "pending"
  lastSync?: Date
  config?: Record<string, any>
}

export interface IntegrationField {
  key: string
  label: string
  type: "text" | "password" | "url" | "select" | "multiselect" | "boolean"
  required: boolean
  placeholder?: string
  description?: string
  options?: { label: string; value: string }[]
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
  }
}

export interface IntegrationAction {
  id: string
  name: string
  description: string
  category: string
  inputFields: IntegrationField[]
  outputFields: IntegrationField[]
  examples?: {
    title: string
    description: string
    config: Record<string, any>
  }[]
}

export interface IntegrationTrigger {
  id: string
  name: string
  description: string
  category: string
  eventTypes: string[]
  configFields: IntegrationField[]
  examples?: {
    title: string
    description: string
    config: Record<string, any>
  }[]
}

export interface AIWorkflowSuggestion {
  id: string
  title: string
  description: string
  confidence: number
  category: "optimization" | "automation" | "integration" | "security" | "performance"
  suggestedChanges: {
    type: "add_action" | "modify_action" | "add_trigger" | "optimize_condition" | "add_integration"
    description: string
    before?: any
    after: any
    reasoning: string
  }[]
  estimatedImpact: {
    efficiency: number
    reliability: number
    cost: number
  }
  implementationComplexity: "low" | "medium" | "high"
}

export interface AIWorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  useCase: string
  aiGenerated: boolean
  confidence: number
  triggers: any[]
  actions: any[]
  variables: any[]
  integrations: string[]
  estimatedSetupTime: string
  benefits: string[]
  requirements: string[]
}

export interface WorkflowAnalytics {
  workflowId: string
  executionCount: number
  successRate: number
  averageExecutionTime: number
  errorPatterns: {
    error: string
    count: number
    lastOccurrence: Date
  }[]
  performanceMetrics: {
    date: Date
    executionTime: number
    success: boolean
  }[]
  usagePatterns: {
    hour: number
    count: number
  }[]
  integrationUsage: {
    integrationId: string
    actionCount: number
    errorCount: number
  }[]
}
