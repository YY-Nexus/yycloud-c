import type {
  TwoFactorAuthMethod,
  TwoFactorSetup,
  TwoFactorVerification,
  TwoFactorSettings,
  TrustedDevice,
} from "@/types/two-factor-auth"

// 存储键
const STORAGE_KEYS = {
  TWO_FACTOR_METHODS: "yanyu-cloud-2fa-methods",
  TWO_FACTOR_SETTINGS: "yanyu-cloud-2fa-settings",
  TRUSTED_DEVICES: "yanyu-cloud-trusted-devices",
  VERIFICATION_HISTORY: "yanyu-cloud-2fa-history",
}

// 生成随机密钥
export function generateSecretKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let secret = ""
  for (let i = 0; i < 32; i++) {
    secret += chars[Math.floor(Math.random() * chars.length)]
  }
  return secret
}

// 生成QR码数据
export function generateQRCode(secretKey: string, accountName = "YanYu Cloud³"): string {
  const issuer = "YanYu Cloud³ Platform"
  const otpAuthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secretKey}&issuer=${encodeURIComponent(issuer)}`
  return otpAuthUrl
}

// 生成备用恢复码
export function generateBackupCodes(count = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    codes.push(code)
  }
  return codes
}

// 验证TOTP代码
export function verifyTOTPCode(code: string, secretKey: string): boolean {
  // 这里应该使用真实的TOTP算法，这里简化为模拟验证
  const currentTime = Math.floor(Date.now() / 1000 / 30)
  const validCodes = [
    generateTOTPCode(secretKey, currentTime - 1),
    generateTOTPCode(secretKey, currentTime),
    generateTOTPCode(secretKey, currentTime + 1),
  ]
  return validCodes.includes(code)
}

// 生成TOTP代码（简化版）
function generateTOTPCode(secretKey: string, timeStep: number): string {
  // 简化的TOTP生成算法，实际应用中应使用标准的HMAC-SHA1算法
  const hash = (secretKey + timeStep.toString()).split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
  return Math.abs(hash % 1000000)
    .toString()
    .padStart(6, "0")
}

// 获取双因素认证方法
export function getTwoFactorMethods(): TwoFactorAuthMethod[] {
  if (typeof window === "undefined") {
    return getDefaultTwoFactorMethods()
  }

  const stored = localStorage.getItem(STORAGE_KEYS.TWO_FACTOR_METHODS)
  if (!stored) {
    const defaultMethods = getDefaultTwoFactorMethods()
    localStorage.setItem(STORAGE_KEYS.TWO_FACTOR_METHODS, JSON.stringify(defaultMethods))
    return defaultMethods
  }

  return JSON.parse(stored)
}

// 添加双因素认证方法
export function addTwoFactorMethod(method: Omit<TwoFactorAuthMethod, "id" | "setupDate">): TwoFactorAuthMethod[] {
  const methods = getTwoFactorMethods()
  const newMethod: TwoFactorAuthMethod = {
    id: `2fa-${Date.now()}`,
    setupDate: new Date().toISOString(),
    ...method,
  }

  const updatedMethods = [...methods, newMethod]
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.TWO_FACTOR_METHODS, JSON.stringify(updatedMethods))
  }

  return updatedMethods
}

// 更新双因素认证方法
export function updateTwoFactorMethod(id: string, updates: Partial<TwoFactorAuthMethod>): TwoFactorAuthMethod[] {
  const methods = getTwoFactorMethods()
  const updatedMethods = methods.map((method) => (method.id === id ? { ...method, ...updates } : method))

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.TWO_FACTOR_METHODS, JSON.stringify(updatedMethods))
  }

  return updatedMethods
}

// 删除双因素认证方法
export function removeTwoFactorMethod(id: string): TwoFactorAuthMethod[] {
  const methods = getTwoFactorMethods()
  const updatedMethods = methods.filter((method) => method.id !== id)

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.TWO_FACTOR_METHODS, JSON.stringify(updatedMethods))
  }

  return updatedMethods
}

// 设置双因素认证
export function setupTwoFactorAuth(accountName = "用户账户"): TwoFactorSetup {
  const secretKey = generateSecretKey()
  const qrCode = generateQRCode(secretKey, accountName)
  const backupCodes = generateBackupCodes()
  const manualEntryKey = secretKey.match(/.{1,4}/g)?.join(" ") || secretKey

  return {
    secretKey,
    qrCode,
    backupCodes,
    manualEntryKey,
  }
}

// 获取双因素认证设置
export function getTwoFactorSettings(): TwoFactorSettings {
  if (typeof window === "undefined") {
    return getDefaultTwoFactorSettings()
  }

  const stored = localStorage.getItem(STORAGE_KEYS.TWO_FACTOR_SETTINGS)
  if (!stored) {
    const defaultSettings = getDefaultTwoFactorSettings()
    localStorage.setItem(STORAGE_KEYS.TWO_FACTOR_SETTINGS, JSON.stringify(defaultSettings))
    return defaultSettings
  }

  return JSON.parse(stored)
}

// 更新双因素认证设置
export function updateTwoFactorSettings(updates: Partial<TwoFactorSettings>): TwoFactorSettings {
  const currentSettings = getTwoFactorSettings()
  const updatedSettings = { ...currentSettings, ...updates }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.TWO_FACTOR_SETTINGS, JSON.stringify(updatedSettings))
  }

  return updatedSettings
}

// 添加验证记录
export function addVerificationRecord(verification: Omit<TwoFactorVerification, "timestamp">): TwoFactorVerification[] {
  const settings = getTwoFactorSettings()
  const newVerification: TwoFactorVerification = {
    timestamp: new Date().toISOString(),
    ...verification,
  }

  const updatedHistory = [newVerification, ...settings.verificationHistory].slice(0, 50) // 保留最近50条记录
  updateTwoFactorSettings({ verificationHistory: updatedHistory })

  return updatedHistory
}

// 获取受信任设备
export function getTrustedDevices(): TrustedDevice[] {
  if (typeof window === "undefined") {
    return getDefaultTrustedDevices()
  }

  const stored = localStorage.getItem(STORAGE_KEYS.TRUSTED_DEVICES)
  if (!stored) {
    const defaultDevices = getDefaultTrustedDevices()
    localStorage.setItem(STORAGE_KEYS.TRUSTED_DEVICES, JSON.stringify(defaultDevices))
    return defaultDevices
  }

  return JSON.parse(stored)
}

// 添加受信任设备
export function addTrustedDevice(device: Omit<TrustedDevice, "id" | "addedDate" | "lastUsed">): TrustedDevice[] {
  const devices = getTrustedDevices()
  const newDevice: TrustedDevice = {
    id: `device-${Date.now()}`,
    addedDate: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
    ...device,
  }

  const updatedDevices = [...devices, newDevice]
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.TRUSTED_DEVICES, JSON.stringify(updatedDevices))
  }

  return updatedDevices
}

// 移除受信任设备
export function removeTrustedDevice(id: string): TrustedDevice[] {
  const devices = getTrustedDevices()
  const updatedDevices = devices.filter((device) => device.id !== id)

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.TRUSTED_DEVICES, JSON.stringify(updatedDevices))
  }

  return updatedDevices
}

// 验证双因素认证代码
export function verifyTwoFactorCode(code: string, methodId: string): boolean {
  const methods = getTwoFactorMethods()
  const method = methods.find((m) => m.id === methodId)

  if (!method || !method.enabled) {
    return false
  }

  let isValid = false

  switch (method.type) {
    case "totp":
      if (method.metadata?.secretKey) {
        isValid = verifyTOTPCode(code, method.metadata.secretKey)
      }
      break
    case "backup":
      if (method.metadata?.backupCodes) {
        isValid = method.metadata.backupCodes.includes(code.toUpperCase())
        if (isValid) {
          // 使用后移除备用码
          const updatedCodes = method.metadata.backupCodes.filter((c) => c !== code.toUpperCase())
          updateTwoFactorMethod(methodId, {
            metadata: { ...method.metadata, backupCodes: updatedCodes },
          })
        }
      }
      break
    case "sms":
    case "email":
      // 模拟验证，实际应用中需要与后端API交互
      isValid = code === "123456"
      break
  }

  // 记录验证尝试
  addVerificationRecord({
    code: code.replace(/./g, "*"), // 隐藏实际代码
    method: method.type,
    success: isValid,
    ipAddress: "127.0.0.1", // 实际应用中获取真实IP
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "Unknown",
  })

  if (isValid) {
    // 更新最后使用时间
    updateTwoFactorMethod(methodId, { lastUsed: new Date().toISOString() })
  }

  return isValid
}

// 发送验证码（模拟）
export async function sendVerificationCode(methodId: string): Promise<boolean> {
  const methods = getTwoFactorMethods()
  const method = methods.find((m) => m.id === methodId)

  if (!method || !method.enabled) {
    return false
  }

  // 模拟发送过程
  await new Promise((resolve) => setTimeout(resolve, 1000))

  switch (method.type) {
    case "sms":
      console.log(`SMS验证码已发送到 ${method.metadata?.phoneNumber}`)
      break
    case "email":
      console.log(`邮件验证码已发送到 ${method.metadata?.email}`)
      break
    default:
      return false
  }

  return true
}

// 检查是否需要双因素认证
export function requiresTwoFactorAuth(): boolean {
  const settings = getTwoFactorSettings()
  const methods = getTwoFactorMethods()
  const hasEnabledMethod = methods.some((method) => method.enabled)

  return settings.enabled && settings.requireForLogin && hasEnabledMethod
}

// 获取当前设备信息
export function getCurrentDeviceInfo(): Partial<TrustedDevice> {
  if (typeof window === "undefined") {
    return {}
  }

  const userAgent = window.navigator.userAgent
  let deviceType: "desktop" | "mobile" | "tablet" = "desktop"
  let browser = "Unknown"
  let os = "Unknown"

  // 简单的设备检测
  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
    deviceType = /iPad/.test(userAgent) ? "tablet" : "mobile"
  }

  // 简单的浏览器检测
  if (userAgent.includes("Chrome")) browser = "Chrome"
  else if (userAgent.includes("Firefox")) browser = "Firefox"
  else if (userAgent.includes("Safari")) browser = "Safari"
  else if (userAgent.includes("Edge")) browser = "Edge"

  // 简单的操作系统检测
  if (userAgent.includes("Windows")) os = "Windows"
  else if (userAgent.includes("Mac")) os = "macOS"
  else if (userAgent.includes("Linux")) os = "Linux"
  else if (userAgent.includes("Android")) os = "Android"
  else if (userAgent.includes("iOS")) os = "iOS"

  return {
    deviceType,
    browser,
    os,
    name: `${browser} on ${os}`,
  }
}

// 默认数据
function getDefaultTwoFactorMethods(): TwoFactorAuthMethod[] {
  return []
}

function getDefaultTwoFactorSettings(): TwoFactorSettings {
  return {
    enabled: false,
    requireForLogin: false,
    requireForSensitiveActions: true,
    backupCodesRemaining: 0,
    trustedDevices: [],
    verificationHistory: [],
  }
}

function getDefaultTrustedDevices(): TrustedDevice[] {
  return []
}
