/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 学习成长中心管理服务
 * ==========================================
 */

import { v4 as uuidv4 } from "uuid"
import type {
  LearningResource,
  LearningGoal,
  LearningStats,
  LearningFilter,
  LearningNote,
  LearningSession,
} from "@/types/learning"

const LEARNING_RESOURCES_KEY = "yanyu:learning-resources"
const LEARNING_GOALS_KEY = "yanyu:learning-goals"
const LEARNING_PLANS_KEY = "yanyu:learning-plans"
const LEARNING_SESSIONS_KEY = "yanyu:learning-sessions"

// 获取所有学习资源
export async function YYGetLearningResources(): Promise<LearningResource[]> {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(LEARNING_RESOURCES_KEY)
    if (!stored) return []

    const resources = JSON.parse(stored) as LearningResource[]
    return resources.map((resource) => ({
      ...resource,
      startDate: resource.startDate ? new Date(resource.startDate) : undefined,
      dueDate: resource.dueDate ? new Date(resource.dueDate) : undefined,
      completedDate: resource.completedDate ? new Date(resource.completedDate) : undefined,
      createdAt: new Date(resource.createdAt),
      updatedAt: new Date(resource.updatedAt),
    }))
  } catch (error) {
    console.error("解析学习资源数据失败:", error)
    return []
  }
}

// 添加学习资源
export async function YYAddLearningResource(
  resourceData: Omit<LearningResource, "id" | "createdAt" | "updatedAt" | "notes" | "sessions">,
): Promise<LearningResource> {
  const resources = await YYGetLearningResources()

  const newResource: LearningResource = {
    ...resourceData,
    id: uuidv4(),
    notes: [],
    sessions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const updatedResources = [...resources, newResource]
  localStorage.setItem(LEARNING_RESOURCES_KEY, JSON.stringify(updatedResources))

  return newResource
}

// 更新学习资源
export async function YYUpdateLearningResource(
  resourceId: string,
  updates: Partial<Omit<LearningResource, "id" | "createdAt">>,
): Promise<LearningResource | null> {
  const resources = await YYGetLearningResources()
  const resourceIndex = resources.findIndex((r) => r.id === resourceId)

  if (resourceIndex === -1) return null

  const updatedResource = {
    ...resources[resourceIndex],
    ...updates,
    updatedAt: new Date(),
  }

  resources[resourceIndex] = updatedResource
  localStorage.setItem(LEARNING_RESOURCES_KEY, JSON.stringify(resources))

  return updatedResource
}

// 删除学习资源
export async function YYDeleteLearningResource(resourceId: string): Promise<boolean> {
  const resources = await YYGetLearningResources()
  const updatedResources = resources.filter((r) => r.id !== resourceId)

  if (updatedResources.length === resources.length) return false

  localStorage.setItem(LEARNING_RESOURCES_KEY, JSON.stringify(updatedResources))
  return true
}

// 添加学习笔记
export async function YYAddLearningNote(
  resourceId: string,
  noteData: Omit<LearningNote, "id" | "createdAt" | "updatedAt">,
): Promise<boolean> {
  const resources = await YYGetLearningResources()
  const resource = resources.find((r) => r.id === resourceId)

  if (!resource) return false

  const newNote: LearningNote = {
    ...noteData,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  resource.notes.push(newNote)
  resource.updatedAt = new Date()

  localStorage.setItem(LEARNING_RESOURCES_KEY, JSON.stringify(resources))
  return true
}

// 记录学习会话
export async function YYRecordLearningSession(
  resourceId: string,
  sessionData: Omit<LearningSession, "id">,
): Promise<boolean> {
  const resources = await YYGetLearningResources()
  const resource = resources.find((r) => r.id === resourceId)

  if (!resource) return false

  const newSession: LearningSession = {
    ...sessionData,
    id: uuidv4(),
  }

  resource.sessions.push(newSession)
  resource.completedDuration += sessionData.duration
  resource.progress = sessionData.progress
  resource.updatedAt = new Date()

  // 如果进度达到100%，标记为完成
  if (resource.progress >= 100 && resource.status !== "completed") {
    resource.status = "completed"
    resource.completedDate = new Date()
  }

  localStorage.setItem(LEARNING_RESOURCES_KEY, JSON.stringify(resources))
  return true
}

// 筛选学习资源
export async function YYFilterLearningResources(filter: LearningFilter): Promise<LearningResource[]> {
  const resources = await YYGetLearningResources()

  return resources.filter((resource) => {
    // 类型筛选
    if (filter.type && resource.type !== filter.type) return false

    // 分类筛选
    if (filter.category && resource.category !== filter.category) return false

    // 状态筛选
    if (filter.status && resource.status !== filter.status) return false

    // 优先级筛选
    if (filter.priority && resource.priority !== filter.priority) return false

    // 搜索词筛选
    if (filter.searchTerm) {
      const searchTerm = filter.searchTerm.toLowerCase()
      const searchableText = `${resource.title} ${resource.description || ""} ${resource.author || ""}`.toLowerCase()
      if (!searchableText.includes(searchTerm)) return false
    }

    // 标签筛选
    if (filter.tags && filter.tags.length > 0) {
      const hasMatchingTag = filter.tags.some((tag) => resource.tags.includes(tag))
      if (!hasMatchingTag) return false
    }

    // 日期范围筛选
    if (filter.dateRange) {
      const resourceDate = resource.startDate || resource.createdAt
      if (resourceDate < filter.dateRange.start || resourceDate > filter.dateRange.end) return false
    }

    return true
  })
}

// 获取学习统计
export async function YYGetLearningStats(): Promise<LearningStats> {
  const resources = await YYGetLearningResources()

  const stats: LearningStats = {
    totalResources: resources.length,
    completedResources: resources.filter((r) => r.status === "completed").length,
    inProgressResources: resources.filter((r) => r.status === "in_progress").length,
    totalLearningTime: resources.reduce((sum, r) => sum + r.completedDuration, 0),
    weeklyLearningTime: 0,
    monthlyLearningTime: 0,
    completionRate: 0,
    averageSessionDuration: 0,
    longestStreak: 0,
    currentStreak: 0,
    topCategory: "技术",
    categoryBreakdown: {
      技术: 0,
      语言: 0,
      职业发展: 0,
      兴趣爱好: 0,
      健康生活: 0,
      创意设计: 0,
      商业管理: 0,
    },
    monthlyProgress: [],
  }

  // 计算完成率
  if (stats.totalResources > 0) {
    stats.completionRate = Math.round((stats.completedResources / stats.totalResources) * 100)
  }

  // 计算分类统计
  resources.forEach((resource) => {
    stats.categoryBreakdown[resource.category]++
  })

  // 找出最多的分类
  const topCategoryEntry = Object.entries(stats.categoryBreakdown).reduce((max, current) =>
    current[1] > max[1] ? current : max,
  )
  stats.topCategory = topCategoryEntry[0] as any

  // 计算最近的学习时间
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  resources.forEach((resource) => {
    resource.sessions.forEach((session) => {
      const sessionDate = new Date(session.startTime)
      if (sessionDate >= oneWeekAgo) {
        stats.weeklyLearningTime += session.duration
      }
      if (sessionDate >= oneMonthAgo) {
        stats.monthlyLearningTime += session.duration
      }
    })
  })

  // 计算平均会话时长
  const allSessions = resources.flatMap((r) => r.sessions)
  if (allSessions.length > 0) {
    stats.averageSessionDuration = Math.round(allSessions.reduce((sum, s) => sum + s.duration, 0) / allSessions.length)
  }

  return stats
}

// 获取学习目标
export async function YYGetLearningGoals(): Promise<LearningGoal[]> {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(LEARNING_GOALS_KEY)
    if (!stored) return []

    const goals = JSON.parse(stored) as LearningGoal[]
    return goals.map((goal) => ({
      ...goal,
      targetDate: new Date(goal.targetDate),
      createdAt: new Date(goal.createdAt),
      updatedAt: new Date(goal.updatedAt),
      milestones: goal.milestones.map((m) => ({
        ...m,
        targetDate: new Date(m.targetDate),
        completedDate: m.completedDate ? new Date(m.completedDate) : undefined,
      })),
    }))
  } catch (error) {
    console.error("解析学习目标数据失败:", error)
    return []
  }
}

// 添加学习目标
export async function YYAddLearningGoal(
  goalData: Omit<LearningGoal, "id" | "createdAt" | "updatedAt">,
): Promise<LearningGoal> {
  const goals = await YYGetLearningGoals()

  const newGoal: LearningGoal = {
    ...goalData,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const updatedGoals = [...goals, newGoal]
  localStorage.setItem(LEARNING_GOALS_KEY, JSON.stringify(updatedGoals))

  return newGoal
}

// 获取推荐资源
export async function YYGetRecommendedResources(limit = 5): Promise<LearningResource[]> {
  const resources = await YYGetLearningResources()
  const stats = await YYGetLearningStats()

  // 基于用户最常学习的分类推荐
  return resources.filter((r) => r.category === stats.topCategory && r.status === "not_started").slice(0, limit)
}
