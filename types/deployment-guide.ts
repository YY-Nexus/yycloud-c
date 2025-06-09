export interface DeploymentPlatform {
  id: string
  name: string
  type: "cloud" | "vps" | "shared" | "dedicated" | "container" | "serverless"
  provider: string
  icon: string
  description: string
  features: string[]
  pricing: {
    free: boolean
    startingPrice?: number
    currency: string
    billingCycle: "monthly" | "yearly" | "hourly"
  }
  requirements: {
    minRam: number
    minStorage: number
    minBandwidth: number
    supportedRegions: string[]
  }
  complexity: "beginner" | "intermediate" | "advanced"
  setupTime: string
  documentation: string
  supportLevel: "community" | "basic" | "premium" | "enterprise"
}

export interface DeploymentGuide {
  id: string
  title: string
  platform: DeploymentPlatform
  projectType: ProjectType
  steps: DeploymentStep[]
  estimatedTime: string
  difficulty: "easy" | "medium" | "hard"
  prerequisites: string[]
  troubleshooting: TroubleshootingItem[]
  resources: Resource[]
  lastUpdated: Date
  rating: number
  completions: number
}

export interface ProjectType {
  id: string
  name: string
  framework: string
  language: string
  category: "frontend" | "backend" | "fullstack" | "mobile" | "desktop"
  buildTool: string
  packageManager: string
  envVars: EnvironmentVariable[]
  dependencies: string[]
  buildCommand: string
  startCommand: string
  outputDirectory: string
}

export interface DeploymentStep {
  id: string
  title: string
  description: string
  type: "command" | "config" | "upload" | "verify" | "manual"
  content: string
  code?: string
  language?: string
  isOptional: boolean
  estimatedTime: string
  tips: string[]
  warnings: string[]
  nextSteps: string[]
}

export interface EnvironmentVariable {
  key: string
  description: string
  required: boolean
  defaultValue?: string
  example: string
  sensitive: boolean
}

export interface TroubleshootingItem {
  problem: string
  symptoms: string[]
  causes: string[]
  solutions: string[]
  relatedSteps: string[]
}

export interface Resource {
  type: "documentation" | "video" | "tutorial" | "tool" | "template"
  title: string
  url: string
  description: string
  duration?: string
  difficulty?: "beginner" | "intermediate" | "advanced"
}

export interface DeploymentProgress {
  guideId: string
  currentStep: number
  completedSteps: string[]
  startedAt: Date
  lastUpdated: Date
  status: "not_started" | "in_progress" | "completed" | "failed"
  notes: string[]
  issues: DeploymentIssue[]
}

export interface DeploymentIssue {
  id: string
  step: string
  type: "error" | "warning" | "info"
  message: string
  solution?: string
  timestamp: Date
  resolved: boolean
}
