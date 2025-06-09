import type {
  SecurityStatus,
  SecurityAlert,
  PasswordEntry,
  SecurityAssessmentResult,
  BackupInfo,
  PrivacySetting,
  SecurityTip,
  SecurityIssue,
} from "@/types/security"

// 模拟本地存储密钥
const STORAGE_KEYS = {
  PASSWORDS: "yanyu-cloud-passwords",
  SECURITY_STATUS: "yanyu-cloud-security-status",
  ALERTS: "yanyu-cloud-security-alerts",
  BACKUPS: "yanyu-cloud-backups",
  PRIVACY_SETTINGS: "yanyu-cloud-privacy-settings",
}

// 获取安全状态
export function getSecurityStatus(): SecurityStatus {
  if (typeof window === "undefined") {
    return getDefaultSecurityStatus()
  }

  const stored = localStorage.getItem(STORAGE_KEYS.SECURITY_STATUS)
  if (!stored) {
    const defaultStatus = getDefaultSecurityStatus()
    localStorage.setItem(STORAGE_KEYS.SECURITY_STATUS, JSON.stringify(defaultStatus))
    return defaultStatus
  }

  return JSON.parse(stored)
}

// 更新安全状态
export function updateSecurityStatus(status: Partial<SecurityStatus>): SecurityStatus {
  const currentStatus = getSecurityStatus()
  const updatedStatus = { ...currentStatus, ...status }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SECURITY_STATUS, JSON.stringify(updatedStatus))
  }

  return updatedStatus
}

// 获取安全提醒
export function getSecurityAlerts(): SecurityAlert[] {
  if (typeof window === "undefined") {
    return getDefaultAlerts()
  }

  const stored = localStorage.getItem(STORAGE_KEYS.ALERTS)
  if (!stored) {
    const defaultAlerts = getDefaultAlerts()
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(defaultAlerts))
    return defaultAlerts
  }

  return JSON.parse(stored)
}

// 添加安全提醒
export function addSecurityAlert(alert: Omit<SecurityAlert, "id" | "date" | "read">): SecurityAlert[] {
  const alerts = getSecurityAlerts()
  const newAlert: SecurityAlert = {
    id: `alert-${Date.now()}`,
    date: new Date().toISOString(),
    read: false,
    ...alert,
  }

  const updatedAlerts = [newAlert, ...alerts]
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updatedAlerts))
  }

  return updatedAlerts
}

// 标记提醒为已读
export function markAlertAsRead(id: string): SecurityAlert[] {
  const alerts = getSecurityAlerts()
  const updatedAlerts = alerts.map((alert) => (alert.id === id ? { ...alert, read: true } : alert))

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updatedAlerts))
  }

  return updatedAlerts
}

// 获取密码条目
export function getPasswordEntries(): PasswordEntry[] {
  if (typeof window === "undefined") {
    return []
  }

  const stored = localStorage.getItem(STORAGE_KEYS.PASSWORDS)
  if (!stored) {
    return []
  }

  return JSON.parse(stored)
}

// 添加密码条目
export function addPasswordEntry(entry: Omit<PasswordEntry, "id" | "lastUpdated" | "strength">): PasswordEntry[] {
  const entries = getPasswordEntries()
  const strength = calculatePasswordStrength(entry.password)

  const newEntry: PasswordEntry = {
    id: `pwd-${Date.now()}`,
    lastUpdated: new Date().toISOString(),
    strength,
    ...entry,
  }

  const updatedEntries = [newEntry, ...entries]
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PASSWORDS, JSON.stringify(updatedEntries))
  }

  return updatedEntries
}

// 更新密码条目
export function updatePasswordEntry(id: string, updates: Partial<PasswordEntry>): PasswordEntry[] {
  const entries = getPasswordEntries()
  const updatedEntries = entries.map((entry) => {
    if (entry.id === id) {
      const updatedEntry = {
        ...entry,
        ...updates,
        lastUpdated: new Date().toISOString(),
      }

      // 如果密码被更新，重新计算强度
      if (updates.password) {
        updatedEntry.strength = calculatePasswordStrength(updates.password)
      }

      return updatedEntry
    }
    return entry
  })

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PASSWORDS, JSON.stringify(updatedEntries))
  }

  return updatedEntries
}

// 删除密码条目
export function deletePasswordEntry(id: string): PasswordEntry[] {
  const entries = getPasswordEntries()
  const updatedEntries = entries.filter((entry) => entry.id !== id)

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PASSWORDS, JSON.stringify(updatedEntries))
  }

  return updatedEntries
}

// 生成随机密码
export function generatePassword(
  length = 16,
  options = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  },
): string {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
  const numberChars = "0123456789"
  const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-="

  let chars = ""
  if (options.uppercase) chars += uppercaseChars
  if (options.lowercase) chars += lowercaseChars
  if (options.numbers) chars += numberChars
  if (options.symbols) chars += symbolChars

  if (chars.length === 0) {
    chars = lowercaseChars + numberChars
  }

  let password = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    password += chars[randomIndex]
  }

  return password
}

// 计算密码强度 (0-100)
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0

  let score = 0

  // 长度评分 (最高 40 分)
  score += Math.min(password.length * 4, 40)

  // 字符多样性 (最高 40 分)
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /[0-9]/.test(password)
  const hasSymbols = /[^A-Za-z0-9]/.test(password)

  const charTypes = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length
  score += charTypes * 10

  // 复杂性评分 (最高 20 分)
  if (password.length >= 8 && hasUppercase && hasLowercase && hasNumbers && hasSymbols) {
    score += 20
  } else if (password.length >= 8 && charTypes >= 3) {
    score += 10
  }

  // 常见模式扣分
  if (/^[0-9]+$/.test(password)) score -= 10 // 纯数字
  if (/^[a-zA-Z]+$/.test(password)) score -= 10 // 纯字母
  if (/(.)\1{2,}/.test(password)) score -= 10 // 重复字符

  return Math.max(0, Math.min(100, score))
}

// 执行安全评估
export function performSecurityAssessment(): SecurityAssessmentResult[] {
  const passwordEntries = getPasswordEntries()
  const securityStatus = getSecurityStatus()

  const results: SecurityAssessmentResult[] = []

  // 密码安全评估
  const passwordIssues: SecurityIssue[] = []
  let weakPasswords = 0
  let oldPasswords = 0

  passwordEntries.forEach((entry) => {
    if (entry.strength < 50) {
      weakPasswords++
      passwordIssues.push({
        id: `pwd-weak-${entry.id}`,
        severity: "high",
        description: `弱密码: "${entry.title}" 的密码强度较低`,
        solution: "使用密码生成器创建更强的密码，包含大小写字母、数字和特殊字符",
      })
    }

    const lastUpdated = new Date(entry.lastUpdated)
    const monthsAgo = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24 * 30)
    if (monthsAgo > 6) {
      oldPasswords++
      passwordIssues.push({
        id: `pwd-old-${entry.id}`,
        severity: "medium",
        description: `过期密码: "${entry.title}" 的密码已超过6个月未更新`,
        solution: "定期更新密码是良好的安全习惯，建议每3-6个月更新一次",
      })
    }
  })

  const passwordScore =
    passwordEntries.length > 0
      ? 100 - (weakPasswords / passwordEntries.length) * 50 - (oldPasswords / passwordEntries.length) * 30
      : 50

  results.push({
    category: "密码安全",
    score: Math.max(0, Math.min(100, passwordScore)),
    issues: passwordIssues,
    recommendations: [
      "使用强密码（至少12个字符，包含大小写字母、数字和特殊字符）",
      "不要在多个网站使用相同的密码",
      "定期更新重要账户的密码",
      "考虑使用双因素认证增强安全性",
    ],
  })

  // 数据备份评估
  const backupScore = securityStatus.dataBackup
  const backupIssues: SecurityIssue[] = []

  if (backupScore < 40) {
    backupIssues.push({
      id: "backup-none",
      severity: "critical",
      description: "没有发现活跃的数据备份",
      solution: "设置定期备份重要数据，考虑使用本地和云端双重备份策略",
    })
  } else if (backupScore < 70) {
    backupIssues.push({
      id: "backup-incomplete",
      severity: "medium",
      description: "数据备份不完整或不够频繁",
      solution: "增加备份频率，确保所有重要数据都包含在备份中",
    })
  }

  results.push({
    category: "数据备份",
    score: backupScore,
    issues: backupIssues,
    recommendations: [
      "实施3-2-1备份策略：3份数据副本，2种不同的存储介质，1份异地备份",
      "定期测试备份恢复功能，确保备份可用",
      "对敏感数据进行加密备份",
      "设置自动备份计划，减少人为疏忽",
    ],
  })

  // 隐私保护评估
  const privacyScore = securityStatus.privacyScore
  const privacyIssues: SecurityIssue[] = []

  if (privacyScore < 60) {
    privacyIssues.push({
      id: "privacy-weak",
      severity: "high",
      description: "隐私保护设置不足",
      solution: "检查并加强浏览器和应用程序的隐私设置，限制数据收集和共享",
    })
  }

  results.push({
    category: "隐私保护",
    score: privacyScore,
    issues: privacyIssues,
    recommendations: [
      "定期清理浏览历史和Cookie",
      "使用隐私保护浏览器扩展",
      "审查应用权限，移除不必要的访问权限",
      "考虑使用VPN保护网络隐私",
    ],
  })

  // 设备安全评估
  const deviceScore = securityStatus.deviceSecurity
  const deviceIssues: SecurityIssue[] = []

  if (deviceScore < 50) {
    deviceIssues.push({
      id: "device-vulnerable",
      severity: "critical",
      description: "设备安全状况堪忧",
      solution: "更新操作系统和应用程序，安装防病毒软件，启用防火墙",
    })
  } else if (deviceScore < 80) {
    deviceIssues.push({
      id: "device-updates",
      severity: "medium",
      description: "设备可能需要更新或加强保护",
      solution: "检查系统和应用更新，确保安全软件正常运行",
    })
  }

  results.push({
    category: "设备安全",
    score: deviceScore,
    issues: deviceIssues,
    recommendations: [
      "保持操作系统和应用程序最新",
      "使用可靠的防病毒和防恶意软件解决方案",
      "启用设备加密",
      "设置设备锁屏和自动锁定",
    ],
  })

  return results
}

// 获取备份信息
export function getBackupInfo(): BackupInfo[] {
  if (typeof window === "undefined") {
    return getDefaultBackups()
  }

  const stored = localStorage.getItem(STORAGE_KEYS.BACKUPS)
  if (!stored) {
    const defaultBackups = getDefaultBackups()
    localStorage.setItem(STORAGE_KEYS.BACKUPS, JSON.stringify(defaultBackups))
    return defaultBackups
  }

  return JSON.parse(stored)
}

// 获取隐私设置
export function getPrivacySettings(): PrivacySetting[] {
  if (typeof window === "undefined") {
    return getDefaultPrivacySettings()
  }

  const stored = localStorage.getItem(STORAGE_KEYS.PRIVACY_SETTINGS)
  if (!stored) {
    const defaultSettings = getDefaultPrivacySettings()
    localStorage.setItem(STORAGE_KEYS.PRIVACY_SETTINGS, JSON.stringify(defaultSettings))
    return defaultSettings
  }

  return JSON.parse(stored)
}

// 更新隐私设置
export function updatePrivacySetting(id: string, enabled: boolean): PrivacySetting[] {
  const settings = getPrivacySettings()
  const updatedSettings = settings.map((setting) => (setting.id === id ? { ...setting, enabled } : setting))

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PRIVACY_SETTINGS, JSON.stringify(updatedSettings))
  }

  // 更新总体隐私分数
  const enabledCount = updatedSettings.filter((s) => s.enabled).length
  const privacyScore = Math.round((enabledCount / updatedSettings.length) * 100)
  updateSecurityStatus({ privacyScore })

  return updatedSettings
}

// 获取安全提示
export function getSecurityTips(): SecurityTip[] {
  return [
    {
      id: "tip-1",
      title: "使用密码管理器",
      content: "密码管理器可以帮助你生成和存储强密码，无需记忆多个复杂密码。",
      category: "password",
    },
    {
      id: "tip-2",
      title: "启用双因素认证",
      content: "在所有支持的服务上启用双因素认证，即使密码泄露，账户仍然安全。",
      category: "password",
    },
    {
      id: "tip-3",
      title: "定期备份数据",
      content: "养成定期备份重要数据的习惯，防止数据丢失。遵循3-2-1备份原则。",
      category: "general",
    },
    {
      id: "tip-4",
      title: "保持软件更新",
      content: "及时更新操作系统和应用程序，修补安全漏洞。",
      category: "device",
    },
    {
      id: "tip-5",
      title: "谨慎使用公共Wi-Fi",
      content: "在使用公共Wi-Fi时，避免访问敏感信息，或使用VPN加密连接。",
      category: "privacy",
    },
    {
      id: "tip-6",
      title: "检查应用权限",
      content: "定期审查应用程序权限，撤销不必要的访问权限。",
      category: "privacy",
    },
    {
      id: "tip-7",
      title: "使用加密通讯",
      content: "优先使用提供端到端加密的通讯工具，保护私人对话。",
      category: "privacy",
    },
    {
      id: "tip-8",
      title: "防范钓鱼攻击",
      content: "警惕可疑邮件和链接，不要点击未知来源的附件。",
      category: "general",
    },
  ]
}

// 默认数据
function getDefaultSecurityStatus(): SecurityStatus {
  return {
    overallScore: 65,
    lastScan: new Date().toISOString(),
    passwordHealth: 70,
    dataBackup: 60,
    privacyScore: 65,
    deviceSecurity: 75,
  }
}

function getDefaultAlerts(): SecurityAlert[] {
  return [
    {
      id: "alert-1",
      type: "info",
      message: "欢迎使用安全防护系统！完成安全评估以获取个性化建议。",
      date: new Date().toISOString(),
      read: false,
      action: "开始评估",
    },
    {
      id: "alert-2",
      type: "warning",
      message: "您的数据备份状态需要关注，建议设置定期备份。",
      date: new Date(Date.now() - 86400000).toISOString(), // 1天前
      read: false,
      action: "设置备份",
    },
  ]
}

function getDefaultBackups(): BackupInfo[] {
  return [
    {
      id: "backup-1",
      name: "文档备份",
      lastBackup: new Date(Date.now() - 7 * 86400000).toISOString(), // 7天前
      size: "1.2 GB",
      status: "active",
      type: "full",
      location: "local",
    },
    {
      id: "backup-2",
      name: "照片备份",
      lastBackup: new Date(Date.now() - 14 * 86400000).toISOString(), // 14天前
      size: "4.5 GB",
      status: "active",
      type: "incremental",
      location: "cloud",
    },
  ]
}

function getDefaultPrivacySettings(): PrivacySetting[] {
  return [
    {
      id: "privacy-1",
      name: "阻止第三方Cookie",
      description: "阻止网站使用第三方Cookie跟踪您的浏览活动",
      enabled: true,
      category: "browser",
    },
    {
      id: "privacy-2",
      name: "阻止位置跟踪",
      description: "阻止网站和应用程序跟踪您的地理位置",
      enabled: false,
      category: "browser",
    },
    {
      id: "privacy-3",
      name: "自动清理浏览数据",
      description: "定期清理浏览历史、Cookie和缓存数据",
      enabled: true,
      category: "browser",
    },
    {
      id: "privacy-4",
      name: "限制应用数据收集",
      description: "限制应用程序收集和分享您的使用数据",
      enabled: true,
      category: "application",
    },
    {
      id: "privacy-5",
      name: "加密本地存储",
      description: "加密存储在设备上的敏感数据",
      enabled: false,
      category: "system",
    },
    {
      id: "privacy-6",
      name: "防止自动登录",
      description: "禁用浏览器的自动登录功能，增强账户安全性",
      enabled: true,
      category: "browser",
    },
  ]
}
