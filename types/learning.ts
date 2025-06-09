/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 学习成长中心类型定义
 * ==========================================
 */

export type LearningResourceType = "course" | "book" | "video" | "article" | "podcast" | "workshop" | "tutorial"

export type LearningCategory = "技术" | "语言" | "职业发展" | "兴趣爱好" | "健康生活" | "创意设计" | "商业管理"

export type LearningStatus = "not_started" | "in_progress" | "completed" | "paused" | "archived"

export type LearningPriority = "高" | "中" | "低"

export interface LearningResource {
  id: string
  title: string
  description?: string
  type: LearningResourceType
  category: LearningCategory
  status: LearningStatus
  priority: LearningPriority
  progress: number // 0-100
  totalDuration: number // 分钟
  completedDuration: number // 分钟
  url?: string
  imageUrl?: string
  author?: string
  publisher?: string
  startDate?: Date
  dueDate?: Date
  completedDate?: Date
  tags: string[]
  notes: LearningNote[]
  sessions: LearningSession[]
  createdAt: Date
  updatedAt: Date
}

export interface LearningNote {
  id: string
  content: string
  page?: number
  timestamp?: number // 视频时间戳
  createdAt: Date
  updatedAt: Date
}

export interface LearningSession {
  id: string
  startTime: Date
  endTime: Date
  duration: number // 分钟
  progress: number // 当前进度
  notes?: string
}

export interface LearningGoal {
  id: string
  title: string
  description?: string
  category: LearningCategory
  targetDate: Date
  isCompleted: boolean
  progress: number // 0-100
  resources: string[] // 关联的资源ID
  milestones: LearningMilestone[]
  createdAt: Date
  updatedAt: Date
}

export interface LearningMilestone {
  id: string
  title: string
  description?: string
  targetDate: Date
  isCompleted: boolean
  completedDate?: Date
}

export interface LearningPlan {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  goals: string[] // 目标ID
  resources: string[] // 资源ID
  dailyTarget: number // 每日学习分钟数
  weeklyTarget: number // 每周学习分钟数
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LearningStats {
  totalResources: number
  completedResources: number
  inProgressResources: number
  totalLearningTime: number // 分钟
  weeklyLearningTime: number // 分钟
  monthlyLearningTime: number // 分钟
  completionRate: number // 百分比
  averageSessionDuration: number // 分钟
  longestStreak: number // 连续学习天数
  currentStreak: number // 当前连续学习天数
  topCategory: LearningCategory
  categoryBreakdown: Record<LearningCategory, number>
  monthlyProgress: Array<{
    month: string
    completedResources: number
    learningTime: number
  }>
}

export interface LearningFilter {
  type?: LearningResourceType
  category?: LearningCategory
  status?: LearningStatus
  priority?: LearningPriority
  searchTerm?: string
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
}
