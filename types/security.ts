export interface SecurityAssessmentResult {
  category: string
  score: number
  issues: {
    id: string
    severity: "critical" | "high" | "medium" | "low"
    description: string
    solution: string
  }[]
  recommendations: string[]
}

export interface SecurityPolicy {
  id: string
  title: string
  description: string
  category: string
  version: string
  lastUpdated: string
  reviewDate: string
  status: "active" | "under-review" | "draft"
  acknowledgementRequired: boolean
  acknowledgementStatus?: "acknowledged" | "pending" | "overdue"
  acknowledgementDate?: string
  content: string
}

export interface SecurityIncident {
  id: string
  title: string
  description: string
  status: "open" | "investigating" | "resolved" | "closed"
  severity: "critical" | "high" | "medium" | "low"
  category: string
  reportedBy: string
  reportedDate: string
  assignedTo?: string
  resolvedDate?: string
  closedDate?: string
  affectedSystems: string[]
  timeline: {
    date: string
    action: string
    user: string
    notes?: string
  }[]
  updates: {
    date: string
    user: string
    content: string
  }[]
}

export interface SecurityTrainingCourse {
  id: string
  title: string
  description: string
  duration: string
  level: "初级" | "中级" | "高级"
  category: string
  progress: number
  completed: boolean
  modules: {
    id: string
    title: string
    duration: string
    type: "video" | "article" | "quiz"
    completed: boolean
  }[]
}

export interface SecurityAlert {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "investigating" | "resolved" | "closed"
  createdAt: string
  category: string
  source: string
  affectedSystems?: string[]
}

export interface SecurityTask {
  id: string
  title: string
  description: string
  dueDate: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed"
  assignedTo?: string
  category: string
  relatedTo?: {
    type: "incident" | "alert" | "policy" | "training"
    id: string
  }
}

export interface SecurityStatus {
  overallScore: number
  lastScan: string
  passwordHealth: number
  dataBackup: number
  privacyScore: number
  deviceSecurity: number
  twoFactorEnabled?: boolean
  twoFactorMethods?: number
}

export interface PasswordEntry {
  id: string
  title: string
  username: string
  password: string
  url?: string
  notes?: string
  category: string
  strength: number
  lastUpdated: string
  twoFactorEnabled?: boolean
}

export interface SecurityAlert {
  id: string
  type: "warning" | "error" | "info"
  message: string
  date: string
  read: boolean
  action?: string
  category?: string
  severity?: "low" | "medium" | "high" | "critical"
}

export interface BackupInfo {
  id: string
  name: string
  lastBackup: string
  size: string
  status: "active" | "inactive" | "error"
  type: "full" | "incremental" | "differential"
  location: "local" | "cloud" | "external"
  encrypted?: boolean
}

export interface PrivacySetting {
  id: string
  name: string
  description: string
  enabled: boolean
  category: "browser" | "application" | "system" | "network"
  impact?: "low" | "medium" | "high"
}

export interface SecurityTip {
  id: string
  title: string
  content: string
  category: "password" | "general" | "device" | "privacy" | "two-factor"
  priority?: "low" | "medium" | "high"
}

export interface SecurityIssue {
  id: string
  severity: "critical" | "high" | "medium" | "low"
  description: string
  solution: string
  category?: string
  affectedItems?: string[]
}
