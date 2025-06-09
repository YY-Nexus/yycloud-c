/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 学习路径类型定义
 * ==========================================
 */

export type PathDifficulty = "beginner" | "intermediate" | "advanced" | "expert"
export type PathStatus = "draft" | "published" | "archived"
export type StepType = "course" | "book" | "video" | "article" | "project" | "quiz" | "practice" | "milestone"
export type StepStatus = "locked" | "available" | "in_progress" | "completed" | "skipped"

export interface LearningPathStep {
  id: string
  title: string
  description: string
  type: StepType
  status: StepStatus
  order: number
  estimatedHours: number
  difficulty: PathDifficulty
  prerequisites: string[] // 前置步骤ID
  resources: LearningPathResource[]
  completedAt?: Date
  startedAt?: Date
  progress: number // 0-100
  notes?: string
  isOptional: boolean
  skills: string[] // 学到的技能
}

export interface LearningPathResource {
  id: string
  title: string
  type: "internal" | "external"
  url?: string
  resourceId?: string // 内部资源ID
  description?: string
  estimatedTime: number // 分钟
  isRequired: boolean
}

export interface LearningPath {
  id: string
  title: string
  description: string
  category: string
  difficulty: PathDifficulty
  status: PathStatus
  estimatedHours: number
  steps: LearningPathStep[]
  tags: string[]
  author: {
    id: string
    name: string
    avatar?: string
  }
  stats: {
    enrolledCount: number
    completedCount: number
    rating: number
    reviewCount: number
  }
  thumbnail?: string
  isPublic: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date

  // 学习者相关
  isEnrolled?: boolean
  enrolledAt?: Date
  completedAt?: Date
  currentStepId?: string
  overallProgress: number // 0-100
  timeSpent: number // 分钟
  lastAccessedAt?: Date
}

export interface PathTemplate {
  id: string
  name: string
  description: string
  category: string
  difficulty: PathDifficulty
  steps: Omit<LearningPathStep, "id" | "status" | "completedAt" | "startedAt" | "progress">[]
  tags: string[]
  isBuiltIn: boolean
}

export interface PathProgress {
  pathId: string
  userId: string
  currentStepId: string
  completedSteps: string[]
  overallProgress: number
  timeSpent: number
  startedAt: Date
  lastAccessedAt: Date
  completedAt?: Date
  notes: Record<string, string> // stepId -> notes
}

export interface PathReview {
  id: string
  pathId: string
  userId: string
  rating: number // 1-5
  comment: string
  pros: string[]
  cons: string[]
  wouldRecommend: boolean
  createdAt: Date
  helpful: number // 有用投票数
}

export interface PathFilter {
  category?: string
  difficulty?: PathDifficulty
  status?: PathStatus
  tags?: string[]
  searchTerm?: string
  minRating?: number
  maxHours?: number
  isEnrolled?: boolean
  sortBy?: "popular" | "rating" | "newest" | "updated" | "difficulty"
  sortOrder?: "asc" | "desc"
}
