/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 部署指导引擎类型定义
 * ==========================================
 */

export interface DeploymentProject {
  id: string
  name: string
  description: string
  type: "web" | "mobile" | "desktop" | "server" | "microservice" | "fullstack"
  framework: string
  language: string
  status: "planning" | "configuring" | "deploying" | "deployed" | "failed"
  createdAt: Date
  updatedAt: Date
  config: DeploymentConfig
  steps: DeploymentStep[]
  resources: DeploymentResource[]
  environments: DeploymentEnvironment[]
}

export interface DeploymentConfig {
  platform: "vercel" | "netlify" | "aws" | "azure" | "gcp" | "docker" | "kubernetes"
  buildCommand?: string
  outputDirectory?: string
  installCommand?: string
  devCommand?: string
  environmentVariables: Record<string, string>
  domains: string[]
  ssl: boolean
  cdn: boolean
  analytics: boolean
  monitoring: boolean
}

export interface DeploymentStep {
  id: string
  title: string
  description: string
  type: "setup" | "config" | "build" | "test" | "deploy" | "verify"
  status: "pending" | "running" | "completed" | "failed" | "skipped"
  order: number
  duration?: number
  logs: string[]
  dependencies: string[]
  commands: DeploymentCommand[]
  validation?: DeploymentValidation
}

export interface DeploymentCommand {
  command: string
  description: string
  workingDirectory?: string
  timeout?: number
  retries?: number
  environment?: Record<string, string>
}

export interface DeploymentValidation {
  type: "url" | "file" | "command" | "api"
  target: string
  expectedResult: string
  timeout: number
}

export interface DeploymentResource {
  id: string
  name: string
  type: "database" | "storage" | "cdn" | "domain" | "ssl" | "monitoring" | "analytics"
  provider: string
  config: Record<string, any>
  status: "creating" | "ready" | "error"
  url?: string
  credentials?: Record<string, string>
}

export interface DeploymentEnvironment {
  id: string
  name: string
  type: "development" | "staging" | "production"
  url?: string
  branch?: string
  autoDeployment: boolean
  protectionRules: ProtectionRule[]
  variables: Record<string, string>
}

export interface ProtectionRule {
  type: "password" | "ip" | "branch" | "approval"
  value: string
  enabled: boolean
}

export interface DeploymentTemplate {
  id: string
  name: string
  description: string
  category: string
  framework: string
  language: string
  tags: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number
  config: Partial<DeploymentConfig>
  steps: Omit<DeploymentStep, "id" | "status" | "logs">[]
  requirements: string[]
  features: string[]
  preview?: string
}

export interface DeploymentGuide {
  id: string
  title: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number
  prerequisites: string[]
  steps: GuideStep[]
  troubleshooting: TroubleshootingItem[]
  resources: GuideResource[]
  tags: string[]
}

export interface GuideStep {
  id: string
  title: string
  content: string
  type: "text" | "code" | "image" | "video" | "interactive"
  order: number
  codeLanguage?: string
  codeContent?: string
  imageUrl?: string
  videoUrl?: string
  tips?: string[]
  warnings?: string[]
}

export interface TroubleshootingItem {
  problem: string
  symptoms: string[]
  solutions: string[]
  relatedSteps: string[]
}

export interface GuideResource {
  title: string
  url: string
  type: "documentation" | "tutorial" | "video" | "tool" | "example"
  description?: string
}

export interface DeploymentAnalytics {
  projectId: string
  totalDeployments: number
  successfulDeployments: number
  failedDeployments: number
  averageDeploymentTime: number
  lastDeployment?: Date
  deploymentHistory: DeploymentHistoryItem[]
  performanceMetrics: PerformanceMetric[]
  errorAnalysis: ErrorAnalysis[]
}

export interface DeploymentHistoryItem {
  id: string
  timestamp: Date
  status: "success" | "failed"
  duration: number
  branch?: string
  commit?: string
  deployedBy?: string
  changes: string[]
  logs: string[]
}

export interface PerformanceMetric {
  metric: "build_time" | "bundle_size" | "load_time" | "lighthouse_score"
  value: number
  timestamp: Date
  trend: "up" | "down" | "stable"
}

export interface ErrorAnalysis {
  error: string
  frequency: number
  lastOccurrence: Date
  affectedSteps: string[]
  suggestedFixes: string[]
}

export interface DeploymentNotification {
  id: string
  type: "success" | "failure" | "warning" | "info"
  title: string
  message: string
  timestamp: Date
  projectId: string
  read: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: "retry" | "rollback" | "view_logs" | "contact_support"
  url?: string
}
