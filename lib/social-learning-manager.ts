/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 社交学习管理服务
 * ==========================================
 */

import { v4 as uuidv4 } from "uuid"
import type {
  StudyGroup,
  GroupMember,
  StudyBuddy,
  LearningActivity,
  LeaderboardEntry,
  LearningComment,
} from "@/types/social-learning"

const STUDY_GROUPS_KEY = "yanyu:study-groups"
const GROUP_MEMBERS_KEY = "yanyu:group-members"
const STUDY_BUDDIES_KEY = "yanyu:study-buddies"
const LEARNING_ACTIVITIES_KEY = "yanyu:learning-activities"
const STUDY_CHALLENGES_KEY = "yanyu:study-challenges"
const LEADERBOARD_KEY = "yanyu:leaderboard"
const STUDY_SESSIONS_KEY = "yanyu:study-sessions"

// 当前用户ID（模拟）
const CURRENT_USER_ID = "user-001"
const CURRENT_USERNAME = "学习者"

// 获取所有学习小组
export async function YYGetStudyGroups(): Promise<StudyGroup[]> {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STUDY_GROUPS_KEY)
    if (!stored) {
      // 初始化示例数据
      const defaultGroups = await initializeDefaultGroups()
      localStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(defaultGroups))
      return defaultGroups
    }

    const groups = JSON.parse(stored) as StudyGroup[]
    return groups.map((group) => ({
      ...group,
      createdAt: new Date(group.createdAt),
      updatedAt: new Date(group.updatedAt),
    }))
  } catch (error) {
    console.error("解析学习小组数据失败:", error)
    return []
  }
}

// 初始化默认学习小组
async function initializeDefaultGroups(): Promise<StudyGroup[]> {
  return [
    {
      id: "group-001",
      name: "React 进阶学习小组",
      description: "一起深入学习 React 高级特性，包括 Hooks、Context、性能优化等",
      category: "技术",
      type: "public",
      memberCount: 24,
      maxMembers: 50,
      tags: ["React", "前端", "JavaScript"],
      createdBy: "admin",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date(),
      isActive: true,
      rules: ["保持友善和尊重", "分享有价值的内容", "积极参与讨论"],
      goals: ["掌握 React Hooks", "理解性能优化", "完成实战项目"],
    },
    {
      id: "group-002",
      name: "英语口语练习营",
      description: "每日英语口语练习，提升口语表达能力",
      category: "语言",
      type: "public",
      memberCount: 18,
      maxMembers: 30,
      tags: ["英语", "口语", "练习"],
      createdBy: "teacher-001",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date(),
      isActive: true,
      rules: ["每天至少练习30分钟", "互相鼓励和纠错", "分享学习心得"],
      goals: ["提升口语流利度", "扩大词汇量", "增强自信心"],
    },
    {
      id: "group-003",
      name: "产品经理成长圈",
      description: "产品经理技能提升，分享行业经验和案例分析",
      category: "职业发展",
      type: "invite_only",
      memberCount: 12,
      maxMembers: 20,
      tags: ["产品经理", "职业发展", "案例分析"],
      createdBy: "pm-001",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date(),
      isActive: true,
      rules: ["分享真实工作经验", "保护商业机密", "积极参与讨论"],
      goals: ["提升产品思维", "学习行业最佳实践", "建立人脉网络"],
    },
  ]
}

// 创建学习小组
export async function YYCreateStudyGroup(
  groupData: Omit<StudyGroup, "id" | "createdAt" | "updatedAt" | "memberCount" | "createdBy">,
): Promise<StudyGroup> {
  const groups = await YYGetStudyGroups()

  const newGroup: StudyGroup = {
    ...groupData,
    id: uuidv4(),
    memberCount: 1,
    createdBy: CURRENT_USER_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const updatedGroups = [...groups, newGroup]
  localStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(updatedGroups))

  // 自动加入创建的小组
  await YYJoinStudyGroup(newGroup.id)

  return newGroup
}

// 加入学习小组
export async function YYJoinStudyGroup(groupId: string): Promise<boolean> {
  try {
    const members = await YYGetGroupMembers(groupId)
    const isAlreadyMember = members.some((member) => member.userId === CURRENT_USER_ID)

    if (isAlreadyMember) return false

    const newMember: GroupMember = {
      id: uuidv4(),
      groupId,
      userId: CURRENT_USER_ID,
      username: CURRENT_USERNAME,
      role: "member",
      joinedAt: new Date(),
      lastActiveAt: new Date(),
      contributionScore: 0,
      studyStreak: 0,
      completedResources: 0,
    }

    const allMembers = await YYGetAllGroupMembers()
    const updatedMembers = [...allMembers, newMember]
    localStorage.setItem(GROUP_MEMBERS_KEY, JSON.stringify(updatedMembers))

    // 更新小组成员数量
    const groups = await YYGetStudyGroups()
    const updatedGroups = groups.map((group) =>
      group.id === groupId ? { ...group, memberCount: group.memberCount + 1 } : group,
    )
    localStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(updatedGroups))

    // 记录活动
    await YYAddLearningActivity({
      type: "join_group",
      title: "加入了学习小组",
      description: `加入了学习小组`,
      groupId,
      isPublic: true,
    })

    return true
  } catch (error) {
    console.error("加入学习小组失败:", error)
    return false
  }
}

// 获取小组成员
export async function YYGetGroupMembers(groupId: string): Promise<GroupMember[]> {
  const allMembers = await YYGetAllGroupMembers()
  return allMembers.filter((member) => member.groupId === groupId)
}

// 获取所有小组成员
async function YYGetAllGroupMembers(): Promise<GroupMember[]> {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(GROUP_MEMBERS_KEY)
    if (!stored) return []

    const members = JSON.parse(stored) as GroupMember[]
    return members.map((member) => ({
      ...member,
      joinedAt: new Date(member.joinedAt),
      lastActiveAt: new Date(member.lastActiveAt),
    }))
  } catch (error) {
    console.error("解析小组成员数据失败:", error)
    return []
  }
}

// 获取学习活动
export async function YYGetLearningActivities(limit = 20): Promise<LearningActivity[]> {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(LEARNING_ACTIVITIES_KEY)
    if (!stored) {
      const defaultActivities = await initializeDefaultActivities()
      localStorage.setItem(LEARNING_ACTIVITIES_KEY, JSON.stringify(defaultActivities))
      return defaultActivities.slice(0, limit)
    }

    const activities = JSON.parse(stored) as LearningActivity[]
    return activities
      .map((activity) => ({
        ...activity,
        createdAt: new Date(activity.createdAt),
        comments: activity.comments.map((comment) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
        })),
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  } catch (error) {
    console.error("解析学习活动数据失败:", error)
    return []
  }
}

// 初始化默认活动
async function initializeDefaultActivities(): Promise<LearningActivity[]> {
  return [
    {
      id: "activity-001",
      userId: "user-002",
      username: "小明",
      type: "complete_resource",
      title: "完成了《React Hooks 深入解析》",
      description: "刚刚完成了 React Hooks 的学习，收获很大！特别是 useCallback 和 useMemo 的使用场景。",
      resourceId: "resource-001",
      groupId: "group-001",
      likes: 8,
      comments: [
        {
          id: "comment-001",
          activityId: "activity-001",
          userId: "user-003",
          username: "小红",
          content: "恭喜！我也在学这个，有什么心得可以分享吗？",
          likes: 2,
          createdAt: new Date("2024-01-20T10:30:00"),
        },
      ],
      createdAt: new Date("2024-01-20T10:00:00"),
      isPublic: true,
    },
    {
      id: "activity-002",
      userId: "user-004",
      username: "学霸小李",
      type: "share_note",
      title: "分享了学习笔记：JavaScript 异步编程",
      description: "整理了一份关于 Promise、async/await 的详细笔记，包含了很多实用的例子。",
      likes: 15,
      comments: [],
      createdAt: new Date("2024-01-19T15:20:00"),
      isPublic: true,
    },
    {
      id: "activity-003",
      userId: "user-005",
      username: "英语达人",
      type: "achievement",
      title: '获得了"连续学习30天"成就',
      description: "坚持每天学习英语30天，终于达成了这个目标！",
      groupId: "group-002",
      likes: 12,
      comments: [
        {
          id: "comment-002",
          activityId: "activity-003",
          userId: "user-006",
          username: "励志小王",
          content: "太厉害了！我也要向你学习，坚持下去！",
          likes: 1,
          createdAt: new Date("2024-01-18T09:15:00"),
        },
      ],
      createdAt: new Date("2024-01-18T09:00:00"),
      isPublic: true,
    },
  ]
}

// 添加学习活动
export async function YYAddLearningActivity(
  activityData: Omit<LearningActivity, "id" | "userId" | "username" | "avatar" | "likes" | "comments" | "createdAt">,
): Promise<LearningActivity> {
  const activities = await YYGetLearningActivities(1000)

  const newActivity: LearningActivity = {
    ...activityData,
    id: uuidv4(),
    userId: CURRENT_USER_ID,
    username: CURRENT_USERNAME,
    likes: 0,
    comments: [],
    createdAt: new Date(),
  }

  const updatedActivities = [newActivity, ...activities]
  localStorage.setItem(LEARNING_ACTIVITIES_KEY, JSON.stringify(updatedActivities))

  return newActivity
}

// 获取学习伙伴
export async function YYGetStudyBuddies(): Promise<StudyBuddy[]> {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STUDY_BUDDIES_KEY)
    if (!stored) {
      const defaultBuddies = await initializeDefaultBuddies()
      localStorage.setItem(STUDY_BUDDIES_KEY, JSON.stringify(defaultBuddies))
      return defaultBuddies
    }

    const buddies = JSON.parse(stored) as StudyBuddy[]
    return buddies.map((buddy) => ({
      ...buddy,
      createdAt: new Date(buddy.createdAt),
      lastInteraction: new Date(buddy.lastInteraction),
    }))
  } catch (error) {
    console.error("解析学习伙伴数据失败:", error)
    return []
  }
}

// 初始化默认学习伙伴
async function initializeDefaultBuddies(): Promise<StudyBuddy[]> {
  return [
    {
      id: "buddy-001",
      userId: CURRENT_USER_ID,
      buddyId: "user-007",
      username: "编程小能手",
      commonInterests: ["React", "JavaScript", "前端开发"],
      studyGoals: ["掌握 React", "学习 TypeScript", "提升编程技能"],
      matchScore: 95,
      status: "accepted",
      createdAt: new Date("2024-01-10"),
      lastInteraction: new Date("2024-01-19"),
    },
    {
      id: "buddy-002",
      userId: CURRENT_USER_ID,
      buddyId: "user-008",
      username: "英语学习者",
      commonInterests: ["英语", "口语练习"],
      studyGoals: ["提升英语口语", "扩大词汇量"],
      matchScore: 88,
      status: "accepted",
      createdAt: new Date("2024-01-12"),
      lastInteraction: new Date("2024-01-18"),
    },
  ]
}

// 获取排行榜
export async function YYGetLeaderboard(): Promise<LeaderboardEntry[]> {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(LEADERBOARD_KEY)
    if (!stored) {
      const defaultLeaderboard = await initializeDefaultLeaderboard()
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(defaultLeaderboard))
      return defaultLeaderboard
    }

    return JSON.parse(stored) as LeaderboardEntry[]
  } catch (error) {
    console.error("解析排行榜数据失败:", error)
    return []
  }
}

// 初始化默认排行榜
async function initializeDefaultLeaderboard(): Promise<LeaderboardEntry[]> {
  return [
    {
      userId: "user-009",
      username: "学习之王",
      score: 2850,
      rank: 1,
      streak: 45,
      completedResources: 28,
      helpedOthers: 15,
      badges: ["连续学习王", "助人为乐", "知识分享者"],
    },
    {
      userId: "user-010",
      username: "勤奋小蜜蜂",
      score: 2640,
      rank: 2,
      streak: 38,
      completedResources: 25,
      helpedOthers: 12,
      badges: ["坚持不懈", "学习达人"],
    },
    {
      userId: CURRENT_USER_ID,
      username: CURRENT_USERNAME,
      score: 1850,
      rank: 8,
      streak: 14,
      completedResources: 12,
      helpedOthers: 5,
      badges: ["新手上路", "积极参与"],
    },
  ]
}

// 点赞活动
export async function YYLikeActivity(activityId: string): Promise<boolean> {
  try {
    const activities = await YYGetLearningActivities(1000)
    const updatedActivities = activities.map((activity) =>
      activity.id === activityId ? { ...activity, likes: activity.likes + 1 } : activity,
    )

    localStorage.setItem(LEARNING_ACTIVITIES_KEY, JSON.stringify(updatedActivities))
    return true
  } catch (error) {
    console.error("点赞失败:", error)
    return false
  }
}

// 添加评论
export async function YYAddComment(
  activityId: string,
  content: string,
  parentId?: string,
): Promise<LearningComment | null> {
  try {
    const activities = await YYGetLearningActivities(1000)
    const newComment: LearningComment = {
      id: uuidv4(),
      activityId,
      userId: CURRENT_USER_ID,
      username: CURRENT_USERNAME,
      content,
      parentId,
      likes: 0,
      createdAt: new Date(),
    }

    const updatedActivities = activities.map((activity) =>
      activity.id === activityId ? { ...activity, comments: [...activity.comments, newComment] } : activity,
    )

    localStorage.setItem(LEARNING_ACTIVITIES_KEY, JSON.stringify(updatedActivities))
    return newComment
  } catch (error) {
    console.error("添加评论失败:", error)
    return null
  }
}
