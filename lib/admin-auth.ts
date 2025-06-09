/**
 * 简单的Admin权限管理
 * 只有一个Admin用户，用于保护配置修改功能
 */

const ADMIN_SESSION_KEY = "yanyu-admin-session"
const ADMIN_PASSWORD_KEY = "yanyu-admin-password"
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000 // 30天

// 初始密码，如果本地存储中没有密码则使用此密码
const DEFAULT_ADMIN_PASSWORD = "My151001"

interface AdminSession {
  isAuthenticated: boolean
  timestamp: number
}

// 获取当前管理员密码
function getAdminPassword(): string {
  if (typeof window === "undefined") return DEFAULT_ADMIN_PASSWORD

  try {
    // 从本地存储获取密码，如果没有则使用默认密码
    const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY)
    return storedPassword || DEFAULT_ADMIN_PASSWORD
  } catch {
    return DEFAULT_ADMIN_PASSWORD
  }
}

// 更新管理员密码
export function updateAdminPassword(currentPassword: string, newPassword: string): boolean {
  // 验证当前密码是否正确
  if (currentPassword !== getAdminPassword()) {
    return false
  }

  // 更新密码
  try {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword)
    return true
  } catch {
    return false
  }
}

// 检查Admin权限
export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  try {
    const session = localStorage.getItem(ADMIN_SESSION_KEY)
    if (!session) return false

    const adminSession: AdminSession = JSON.parse(session)
    const now = Date.now()
    const isRemembered = localStorage.getItem("yanyu-admin-remember") === "true"

    // 如果选择了记住我，使用更长的会话时间
    const effectiveSessionDuration = isRemembered
      ? 30 * 24 * 60 * 60 * 1000
      : // 30天
        SESSION_DURATION

    // 检查会话是否过期
    if (now - adminSession.timestamp > effectiveSessionDuration) {
      localStorage.removeItem(ADMIN_SESSION_KEY)
      return false
    }

    return adminSession.isAuthenticated
  } catch {
    return false
  }
}

// Admin登录
export function adminLogin(password: string, rememberMe = false): boolean {
  if (password === getAdminPassword()) {
    const session: AdminSession = {
      isAuthenticated: true,
      timestamp: Date.now(),
    }

    // 如果选择记住我，使用更长的会话时间
    if (rememberMe) {
      localStorage.setItem("yanyu-admin-remember", "true")
    } else {
      localStorage.removeItem("yanyu-admin-remember")
    }

    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
    return true
  }

  return false
}

// Admin登出
export function adminLogout(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY)
  localStorage.removeItem("yanyu-admin-remember")
}

// 刷新会话时间
export function refreshAdminSession(): void {
  if (isAdminAuthenticated()) {
    const session: AdminSession = {
      isAuthenticated: true,
      timestamp: Date.now(),
    }
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
  }
}

// 获取会话剩余时间（分钟）
export function getSessionRemainingTime(): number {
  if (typeof window === "undefined") return 0

  try {
    const session = localStorage.getItem(ADMIN_SESSION_KEY)
    if (!session) return 0

    const adminSession: AdminSession = JSON.parse(session)
    const now = Date.now()
    const isRemembered = localStorage.getItem("yanyu-admin-remember") === "true"

    // 如果选择了记住我，使用更长的会话时间
    const effectiveSessionDuration = isRemembered ? 30 * 24 * 60 * 60 * 1000 : SESSION_DURATION

    const remaining = effectiveSessionDuration - (now - adminSession.timestamp)

    return Math.max(0, Math.floor(remaining / (60 * 1000)))
  } catch {
    return 0
  }
}
