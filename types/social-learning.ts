/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 社交学习功能类型定义
 * ==========================================
 */

export type StudyGroupType = "public" | "private" | "invite_only"
export type StudyGroupCategory = "技术" | "语言" | "职业发展" | "兴趣爱好" | "考试备考" | "技能提升"
export type MemberRole = "owner" | "admin" | "member"
export type ActivityType =
  | "join_group"
  | "complete_resource"
  | "share_note"
  | "create_goal"
  | "help_member"
  | "achievement"

export interface StudyGroup {
  id: string
  name: string
  description: string
  category: StudyGroupCategory
  type: StudyGroupType
  coverImage?: string
  memberCount: number
  maxMembers: number
  tags: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  rules?: string[]
  goals: string[]
}

export interface GroupMember {
  id: string
  groupId: string
  userId: string
  username: string
  avatar?: string
  role: MemberRole
  joinedAt: Date
  lastActiveAt: Date
  contributionScore: number
  studyStreak: number
  completedResources: number
}

export interface StudyBuddy {
  id: string
  userId: string
  buddyId: string
  username: string
  avatar?: string
  commonInterests: string[]
  studyGoals: string[]
  matchScore: number
  status: "pending" | "accepted" | "declined"
  createdAt: Date
  lastInteraction: Date
}

export interface LearningActivity {
  id: string
  userId: string
  username: string
  avatar?: string
  type: ActivityType
  title: string
  description: string
  resourceId?: string
  groupId?: string
  metadata?: Record<string, any>
  likes: number
  comments: LearningComment[]
  createdAt: Date
  isPublic: boolean
}

export interface LearningComment {
  id: string
  activityId: string
  userId: string
  username: string
  avatar?: string
  content: string
  parentId?: string
  likes: number
  createdAt: Date
}

export interface StudyChallenge {
  id: string
  title: string
  description: string
  category: StudyGroupCategory
  difficulty: "初级" | "中级" | "高级"
  duration: number // 天数
  participants: string[]
  maxParticipants: number
  rewards: string[]
  startDate: Date
  endDate: Date
  createdBy: string
  isActive: boolean
}

export interface LeaderboardEntry {
  userId: string
  username: string
  avatar?: string
  score: number
  rank: number
  streak: number
  completedResources: number
  helpedOthers: number
  badges: string[]
}

export interface StudySession {
  id: string
  userId: string
  resourceId?: string
  groupId?: string
  buddyId?: string
  startTime: Date
  endTime?: Date
  duration: number
  isActive: boolean
  participants: string[]
  notes?: string
}
