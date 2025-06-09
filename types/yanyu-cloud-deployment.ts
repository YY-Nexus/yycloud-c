export interface YanYuCloudServer {
  id: string
  name: string
  type: "nas" | "mac" | "imac" | "storage"
  model: string
  specs: {
    cpu: string
    memory: string
    storage: string
    connectivity: string[]
  }
  status: "online" | "offline" | "maintenance" | "error"
  ipAddress: string
  macAddress?: string
  location: string
  role: "primary" | "secondary" | "storage" | "development"
  services: YanYuCloudService[]
  lastSeen: Date
  uptime: number
  temperature?: number
  diskUsage: {
    total: number
    used: number
    available: number
  }
  networkStats: {
    bytesIn: number
    bytesOut: number
    packetsIn: number
    packetsOut: number
  }
}

export interface YanYuCloudService {
  id: string
  name: string
  type: "git" | "docker" | "vercel" | "database" | "storage" | "monitoring"
  status: "running" | "stopped" | "error" | "starting"
  port: number
  version: string
  autoStart: boolean
  dependencies: string[]
  healthCheck: {
    url: string
    interval: number
    timeout: number
    retries: number
  }
  resources: {
    cpu: number
    memory: number
    disk: number
  }
}

export interface DeploymentPipeline {
  id: string
  name: string
  description: string
  type: "local" | "hybrid" | "cloud"
  stages: DeploymentStage[]
  triggers: PipelineTrigger[]
  environment: "development" | "staging" | "production"
  status: "idle" | "running" | "success" | "failed"
  lastRun?: Date
  duration?: number
  logs: PipelineLog[]
}

export interface DeploymentStage {
  id: string
  name: string
  type: "build" | "test" | "deploy" | "verify" | "rollback"
  commands: string[]
  environment: Record<string, string>
  timeout: number
  retryCount: number
  onFailure: "stop" | "continue" | "rollback"
  artifacts: string[]
  dependencies: string[]
}

export interface PipelineTrigger {
  type: "git_push" | "git_tag" | "schedule" | "manual" | "webhook"
  config: Record<string, any>
  enabled: boolean
}

export interface PipelineLog {
  timestamp: Date
  stage: string
  level: "info" | "warn" | "error" | "debug"
  message: string
  details?: any
}

export interface YanYuCloudConfig {
  cluster: {
    name: string
    nodes: YanYuCloudServer[]
    loadBalancer: {
      enabled: boolean
      algorithm: "round_robin" | "least_connections" | "ip_hash"
      healthCheck: boolean
    }
    backup: {
      enabled: boolean
      schedule: string
      retention: number
      destinations: string[]
    }
  }
  development: {
    vscode: {
      extensions: string[]
      settings: Record<string, any>
      workspaces: string[]
    }
    git: {
      repositories: GitRepository[]
      hooks: GitHook[]
      workflows: GitWorkflow[]
    }
    vercel: {
      projects: VercelProject[]
      environments: VercelEnvironment[]
      domains: string[]
    }
  }
  monitoring: {
    metrics: MetricConfig[]
    alerts: AlertConfig[]
    dashboards: DashboardConfig[]
  }
}

export interface GitRepository {
  name: string
  url: string
  branch: string
  localPath: string
  hooks: string[]
  autoSync: boolean
  backupEnabled: boolean
}

export interface GitHook {
  type: "pre-commit" | "post-commit" | "pre-push" | "post-receive"
  script: string
  enabled: boolean
}

export interface GitWorkflow {
  name: string
  trigger: string
  jobs: WorkflowJob[]
  environment: Record<string, string>
}

export interface WorkflowJob {
  name: string
  steps: WorkflowStep[]
  runsOn: string
  timeout: number
}

export interface WorkflowStep {
  name: string
  action: string
  with?: Record<string, any>
  env?: Record<string, string>
}

export interface VercelProject {
  name: string
  framework: string
  buildCommand: string
  outputDirectory: string
  installCommand: string
  devCommand: string
  environment: Record<string, string>
  domains: string[]
  gitRepository: string
}

export interface VercelEnvironment {
  name: string
  variables: Record<string, string>
  encrypted: string[]
}

export interface MetricConfig {
  name: string
  type: "counter" | "gauge" | "histogram"
  description: string
  labels: string[]
  interval: number
}

export interface AlertConfig {
  name: string
  condition: string
  threshold: number
  severity: "low" | "medium" | "high" | "critical"
  channels: string[]
  enabled: boolean
}

export interface DashboardConfig {
  name: string
  panels: DashboardPanel[]
  refresh: number
  timeRange: string
}

export interface DashboardPanel {
  title: string
  type: "graph" | "stat" | "table" | "logs"
  query: string
  size: { width: number; height: number }
  position: { x: number; y: number }
}

export interface DeploymentGuideStep {
  id: string
  title: string
  description: string
  category: "setup" | "configuration" | "deployment" | "monitoring" | "maintenance"
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: string
  prerequisites: string[]
  instructions: Instruction[]
  verification: VerificationStep[]
  troubleshooting: TroubleshootingItem[]
  nextSteps: string[]
}

export interface Instruction {
  type: "command" | "config" | "ui" | "code" | "file"
  title: string
  content: string
  language?: string
  platform?: "mac" | "nas" | "universal"
  notes?: string[]
  warnings?: string[]
}

export interface VerificationStep {
  description: string
  command?: string
  expectedOutput?: string
  url?: string
  file?: string
}

export interface TroubleshootingItem {
  problem: string
  symptoms: string[]
  causes: string[]
  solutions: string[]
  prevention?: string[]
}
