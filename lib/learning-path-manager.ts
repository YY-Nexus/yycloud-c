/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 学习路径管理服务
 * ==========================================
 */

import { v4 as uuidv4 } from "uuid"
import type { LearningPath, PathTemplate, PathFilter } from "@/types/learning-path"

const LEARNING_PATHS_KEY = "yanyu:learning-paths"
const PATH_PROGRESS_KEY = "yanyu:path-progress"
const PATH_REVIEWS_KEY = "yanyu:path-reviews"
const PATH_TEMPLATES_KEY = "yanyu:path-templates"

// 获取所有学习路径
export async function YYGetLearningPaths(): Promise<LearningPath[]> {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(LEARNING_PATHS_KEY)
    if (!stored) return getDefaultPaths()

    const paths = JSON.parse(stored) as LearningPath[]
    return paths.map((path) => ({
      ...path,
      createdAt: new Date(path.createdAt),
      updatedAt: new Date(path.updatedAt),
      publishedAt: path.publishedAt ? new Date(path.publishedAt) : undefined,
      enrolledAt: path.enrolledAt ? new Date(path.enrolledAt) : undefined,
      completedAt: path.completedAt ? new Date(path.completedAt) : undefined,
      lastAccessedAt: path.lastAccessedAt ? new Date(path.lastAccessedAt) : undefined,
    }))
  } catch (error) {
    console.error("解析学习路径数据失败:", error)
    return getDefaultPaths()
  }
}

// 获取默认路径数据
function getDefaultPaths(): LearningPath[] {
  return [
    {
      id: "path-1",
      title: "React 全栈开发完整路径",
      description: "从零开始学习React生态系统，包括基础概念、状态管理、路由、测试、部署等完整技能栈",
      category: "前端开发",
      difficulty: "intermediate",
      status: "published",
      estimatedHours: 120,
      steps: [
        {
          id: "step-1",
          title: "JavaScript ES6+ 基础",
          description: "掌握现代JavaScript语法和特性",
          type: "course",
          status: "completed",
          order: 1,
          estimatedHours: 15,
          difficulty: "beginner",
          prerequisites: [],
          resources: [
            {
              id: "res-1",
              title: "ES6 完整教程",
              type: "external",
              url: "https://example.com/es6",
              estimatedTime: 480,
              isRequired: true,
            },
          ],
          progress: 100,
          isOptional: false,
          skills: ["ES6语法", "箭头函数", "解构赋值", "模块化"],
          completedAt: new Date("2024-01-15"),
          startedAt: new Date("2024-01-10"),
        },
        {
          id: "step-2",
          title: "React 基础概念",
          description: "学习React组件、JSX、Props和State",
          type: "course",
          status: "in_progress",
          order: 2,
          estimatedHours: 20,
          difficulty: "beginner",
          prerequisites: ["step-1"],
          resources: [
            {
              id: "res-2",
              title: "React 官方教程",
              type: "external",
              url: "https://react.dev",
              estimatedTime: 600,
              isRequired: true,
            },
          ],
          progress: 65,
          isOptional: false,
          skills: ["组件开发", "JSX语法", "状态管理", "事件处理"],
          startedAt: new Date("2024-01-16"),
        },
        {
          id: "step-3",
          title: "React Hooks 深入",
          description: "掌握useState、useEffect和自定义Hook",
          type: "course",
          status: "available",
          order: 3,
          estimatedHours: 18,
          difficulty: "intermediate",
          prerequisites: ["step-2"],
          resources: [],
          progress: 0,
          isOptional: false,
          skills: ["Hooks使用", "副作用管理", "自定义Hook"],
        },
        {
          id: "step-4",
          title: "状态管理 (Redux/Zustand)",
          description: "学习复杂应用的状态管理方案",
          type: "course",
          status: "locked",
          order: 4,
          estimatedHours: 25,
          difficulty: "intermediate",
          prerequisites: ["step-3"],
          resources: [],
          progress: 0,
          isOptional: false,
          skills: ["Redux", "Zustand", "状态管理模式"],
        },
        {
          id: "step-5",
          title: "React Router 路由管理",
          description: "实现单页应用的路由功能",
          type: "course",
          status: "locked",
          order: 5,
          estimatedHours: 12,
          difficulty: "intermediate",
          prerequisites: ["step-3"],
          resources: [],
          progress: 0,
          isOptional: false,
          skills: ["路由配置", "导航管理", "路由守卫"],
        },
        {
          id: "step-6",
          title: "实战项目：Todo应用",
          description: "构建一个完整的Todo管理应用",
          type: "project",
          status: "locked",
          order: 6,
          estimatedHours: 30,
          difficulty: "intermediate",
          prerequisites: ["step-4", "step-5"],
          resources: [],
          progress: 0,
          isOptional: false,
          skills: ["项目架构", "组件设计", "状态管理实践"],
        },
      ],
      tags: ["React", "JavaScript", "前端", "全栈"],
      author: {
        id: "author-1",
        name: "言语云技术团队",
        avatar: "/images/yanyu-logo.png",
      },
      stats: {
        enrolledCount: 1250,
        completedCount: 340,
        rating: 4.8,
        reviewCount: 89,
      },
      isPublic: true,
      isFeatured: true,
      isEnrolled: true,
      enrolledAt: new Date("2024-01-10"),
      currentStepId: "step-2",
      overallProgress: 35,
      timeSpent: 1200,
      lastAccessedAt: new Date("2024-01-20"),
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-15"),
      publishedAt: new Date("2024-01-05"),
    },
    {
      id: "path-2",
      title: "TypeScript 进阶开发路径",
      description: "深入学习TypeScript类型系统，提升代码质量和开发效率",
      category: "编程语言",
      difficulty: "advanced",
      status: "published",
      estimatedHours: 80,
      steps: [
        {
          id: "step-2-1",
          title: "TypeScript 基础类型",
          description: "学习基本类型注解和接口定义",
          type: "course",
          status: "available",
          order: 1,
          estimatedHours: 15,
          difficulty: "intermediate",
          prerequisites: [],
          resources: [],
          progress: 0,
          isOptional: false,
          skills: ["类型注解", "接口定义", "类型推断"],
        },
        {
          id: "step-2-2",
          title: "高级类型系统",
          description: "掌握泛型、联合类型、条件类型等高级特性",
          type: "course",
          status: "locked",
          order: 2,
          estimatedHours: 25,
          difficulty: "advanced",
          prerequisites: ["step-2-1"],
          resources: [],
          progress: 0,
          isOptional: false,
          skills: ["泛型编程", "类型操作", "条件类型"],
        },
        {
          id: "step-2-3",
          title: "TypeScript 工程实践",
          description: "配置、构建、测试等工程化实践",
          type: "course",
          status: "locked",
          order: 3,
          estimatedHours: 20,
          difficulty: "advanced",
          prerequisites: ["step-2-2"],
          resources: [],
          progress: 0,
          isOptional: false,
          skills: ["工程配置", "构建优化", "类型检查"],
        },
        {
          id: "step-2-4",
          title: "项目重构实战",
          description: "将JavaScript项目迁移到TypeScript",
          type: "project",
          status: "locked",
          order: 4,
          estimatedHours: 20,
          difficulty: "advanced",
          prerequisites: ["step-2-3"],
          resources: [],
          progress: 0,
          isOptional: false,
          skills: ["项目迁移", "类型定义", "重构技巧"],
        },
      ],
      tags: ["TypeScript", "类型系统", "工程化"],
      author: {
        id: "author-1",
        name: "言语云技术团队",
      },
      stats: {
        enrolledCount: 890,
        completedCount: 156,
        rating: 4.9,
        reviewCount: 45,
      },
      isPublic: true,
      isFeatured: true,
      overallProgress: 0,
      timeSpent: 0,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-20"),
      publishedAt: new Date("2024-01-15"),
    },
  ]
}

// 创建学习路径
export async function YYCreateLearningPath(
  pathData: Omit<LearningPath, "id" | "createdAt" | "updatedAt" | "stats" | "overallProgress" | "timeSpent">,
): Promise<LearningPath> {
  const paths = await YYGetLearningPaths()

  const newPath: LearningPath = {
    ...pathData,
    id: uuidv4(),
    stats: {
      enrolledCount: 0,
      completedCount: 0,
      rating: 0,
      reviewCount: 0,
    },
    overallProgress: 0,
    timeSpent: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const updatedPaths = [...paths, newPath]
  localStorage.setItem(LEARNING_PATHS_KEY, JSON.stringify(updatedPaths))

  return newPath
}

// 更新学习路径
export async function YYUpdateLearningPath(
  pathId: string,
  updates: Partial<Omit<LearningPath, "id" | "createdAt">>,
): Promise<LearningPath | null> {
  const paths = await YYGetLearningPaths()
  const pathIndex = paths.findIndex((p) => p.id === pathId)

  if (pathIndex === -1) return null

  const updatedPath = {
    ...paths[pathIndex],
    ...updates,
    updatedAt: new Date(),
  }

  paths[pathIndex] = updatedPath
  localStorage.setItem(LEARNING_PATHS_KEY, JSON.stringify(paths))

  return updatedPath
}

// 删除学习路径
export async function YYDeleteLearningPath(pathId: string): Promise<boolean> {
  const paths = await YYGetLearningPaths()
  const updatedPaths = paths.filter((p) => p.id !== pathId)

  if (updatedPaths.length === paths.length) return false

  localStorage.setItem(LEARNING_PATHS_KEY, JSON.stringify(updatedPaths))
  return true
}

// 注册学习路径
export async function YYEnrollPath(pathId: string): Promise<boolean> {
  const paths = await YYGetLearningPaths()
  const path = paths.find((p) => p.id === pathId)

  if (!path) return false

  path.isEnrolled = true
  path.enrolledAt = new Date()
  path.lastAccessedAt = new Date()
  path.stats.enrolledCount += 1

  // 解锁第一个步骤
  if (path.steps.length > 0) {
    const firstStep = path.steps.find((s) => s.order === 1)
    if (firstStep && firstStep.status === "locked") {
      firstStep.status = "available"
    }
    path.currentStepId = firstStep?.id
  }

  localStorage.setItem(LEARNING_PATHS_KEY, JSON.stringify(paths))
  return true
}

// 开始学习步骤
export async function YYStartStep(pathId: string, stepId: string): Promise<boolean> {
  const paths = await YYGetLearningPaths()
  const path = paths.find((p) => p.id === pathId)

  if (!path) return false

  const step = path.steps.find((s) => s.id === stepId)
  if (!step || step.status === "locked") return false

  step.status = "in_progress"
  step.startedAt = new Date()
  path.currentStepId = stepId
  path.lastAccessedAt = new Date()

  localStorage.setItem(LEARNING_PATHS_KEY, JSON.stringify(paths))
  return true
}

// 完成学习步骤
export async function YYCompleteStep(pathId: string, stepId: string): Promise<boolean> {
  const paths = await YYGetLearningPaths()
  const path = paths.find((p) => p.id === pathId)

  if (!path) return false

  const step = path.steps.find((s) => s.id === stepId)
  if (!step) return false

  step.status = "completed"
  step.completedAt = new Date()
  step.progress = 100

  // 解锁后续步骤
  const nextSteps = path.steps.filter((s) => s.prerequisites.includes(stepId))
  nextSteps.forEach((nextStep) => {
    const allPrerequisitesCompleted = nextStep.prerequisites.every((prereqId) => {
      const prereqStep = path.steps.find((s) => s.id === prereqId)
      return prereqStep?.status === "completed"
    })

    if (allPrerequisitesCompleted && nextStep.status === "locked") {
      nextStep.status = "available"
    }
  })

  // 更新整体进度
  const completedSteps = path.steps.filter((s) => s.status === "completed").length
  path.overallProgress = Math.round((completedSteps / path.steps.length) * 100)

  // 检查是否完成整个路径
  if (path.overallProgress === 100) {
    path.completedAt = new Date()
    path.stats.completedCount += 1
  }

  localStorage.setItem(LEARNING_PATHS_KEY, JSON.stringify(paths))
  return true
}

// 更新步骤进度
export async function YYUpdateStepProgress(pathId: string, stepId: string, progress: number): Promise<boolean> {
  const paths = await YYGetLearningPaths()
  const path = paths.find((p) => p.id === pathId)

  if (!path) return false

  const step = path.steps.find((s) => s.id === stepId)
  if (!step) return false

  step.progress = Math.max(0, Math.min(100, progress))
  path.lastAccessedAt = new Date()

  // 更新整体进度
  const totalProgress = path.steps.reduce((sum, s) => sum + s.progress, 0)
  path.overallProgress = Math.round(totalProgress / path.steps.length)

  localStorage.setItem(LEARNING_PATHS_KEY, JSON.stringify(paths))
  return true
}

// 筛选学习路径
export async function YYFilterLearningPaths(filter: PathFilter): Promise<LearningPath[]> {
  const paths = await YYGetLearningPaths()

  const filtered = paths.filter((path) => {
    // 分类筛选
    if (filter.category && path.category !== filter.category) return false

    // 难度筛选
    if (filter.difficulty && path.difficulty !== filter.difficulty) return false

    // 状态筛选
    if (filter.status && path.status !== filter.status) return false

    // 注册状态筛选
    if (filter.isEnrolled !== undefined && path.isEnrolled !== filter.isEnrolled) return false

    // 搜索词筛选
    if (filter.searchTerm) {
      const searchTerm = filter.searchTerm.toLowerCase()
      const searchableText = `${path.title} ${path.description} ${path.tags.join(" ")}`.toLowerCase()
      if (!searchableText.includes(searchTerm)) return false
    }

    // 标签筛选
    if (filter.tags && filter.tags.length > 0) {
      const hasMatchingTag = filter.tags.some((tag) => path.tags.includes(tag))
      if (!hasMatchingTag) return false
    }

    // 评分筛选
    if (filter.minRating && path.stats.rating < filter.minRating) return false

    // 时长筛选
    if (filter.maxHours && path.estimatedHours > filter.maxHours) return false

    return true
  })

  // 排序
  if (filter.sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0

      switch (filter.sortBy) {
        case "popular":
          comparison = b.stats.enrolledCount - a.stats.enrolledCount
          break
        case "rating":
          comparison = b.stats.rating - a.stats.rating
          break
        case "newest":
          comparison = b.createdAt.getTime() - a.createdAt.getTime()
          break
        case "updated":
          comparison = b.updatedAt.getTime() - a.updatedAt.getTime()
          break
        case "difficulty":
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
          break
      }

      return filter.sortOrder === "desc" ? comparison : -comparison
    })
  }

  return filtered
}

// 克隆学习路径
export async function YYCloneLearningPath(pathId: string, title?: string): Promise<LearningPath | null> {
  const paths = await YYGetLearningPaths()
  const originalPath = paths.find((p) => p.id === pathId)

  if (!originalPath) return null

  const clonedPath: LearningPath = {
    ...originalPath,
    id: uuidv4(),
    title: title || `${originalPath.title} (副本)`,
    status: "draft",
    isEnrolled: false,
    enrolledAt: undefined,
    completedAt: undefined,
    currentStepId: undefined,
    overallProgress: 0,
    timeSpent: 0,
    lastAccessedAt: undefined,
    stats: {
      enrolledCount: 0,
      completedCount: 0,
      rating: 0,
      reviewCount: 0,
    },
    steps: originalPath.steps.map((step) => ({
      ...step,
      id: uuidv4(),
      status: "locked",
      progress: 0,
      completedAt: undefined,
      startedAt: undefined,
      notes: undefined,
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: undefined,
  }

  // 解锁第一个步骤
  if (clonedPath.steps.length > 0) {
    const firstStep = clonedPath.steps.find((s) => s.order === 1)
    if (firstStep) {
      firstStep.status = "available"
    }
  }

  const updatedPaths = [...paths, clonedPath]
  localStorage.setItem(LEARNING_PATHS_KEY, JSON.stringify(updatedPaths))

  return clonedPath
}

// 获取路径模板
export async function YYGetPathTemplates(): Promise<PathTemplate[]> {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(PATH_TEMPLATES_KEY)
    if (!stored) return getDefaultTemplates()

    return JSON.parse(stored) as PathTemplate[]
  } catch (error) {
    console.error("解析路径模板数据失败:", error)
    return getDefaultTemplates()
  }
}

// 获取默认模板
function getDefaultTemplates(): PathTemplate[] {
  return [
    {
      id: "template-1",
      name: "前端开发基础路径",
      description: "适合前端开发初学者的标准学习路径",
      category: "前端开发",
      difficulty: "beginner",
      steps: [
        {
          title: "HTML & CSS 基础",
          description: "学习网页结构和样式",
          type: "course",
          order: 1,
          estimatedHours: 20,
          difficulty: "beginner",
          prerequisites: [],
          resources: [],
          progress: 0,
          isOptional: false,
          skills: ["HTML", "CSS", "响应式设计"],
        },
        {
          title: "JavaScript 基础",
          description: "掌握JavaScript编程基础",
          type: "course",
          order: 2,
          estimatedHours: 30,
          difficulty: "beginner",
          prerequisites: [],
          resources: [],
          progress: 0,
          isOptional: false,
          skills: ["JavaScript", "DOM操作", "事件处理"],
        },
      ],
      tags: ["前端", "基础", "HTML", "CSS", "JavaScript"],
      isBuiltIn: true,
    },
  ]
}
