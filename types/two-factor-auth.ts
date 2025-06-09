export interface TwoFactorAuthMethod {
  id: string
  type: "totp" | "sms" | "email" | "backup"
  name: string
  enabled: boolean
  primary: boolean
  setupDate: string
  lastUsed?: string
  metadata?: {
    phoneNumber?: string
    email?: string
    secretKey?: string
    qrCode?: string
    backupCodes?: string[]
  }
}

export interface TwoFactorSetup {
  secretKey: string
  qrCode: string
  backupCodes: string[]
  manualEntryKey: string
}

export interface TwoFactorVerification {
  code: string
  method: "totp" | "sms" | "email" | "backup"
  timestamp: string
  success: boolean
  ipAddress?: string
  userAgent?: string
}

export interface TwoFactorSettings {
  enabled: boolean
  requireForLogin: boolean
  requireForSensitiveActions: boolean
  backupCodesRemaining: number
  trustedDevices: TrustedDevice[]
  verificationHistory: TwoFactorVerification[]
}

export interface TrustedDevice {
  id: string
  name: string
  deviceType: "desktop" | "mobile" | "tablet"
  browser: string
  os: string
  ipAddress: string
  addedDate: string
  lastUsed: string
  trusted: boolean
}

export interface TwoFactorChallenge {
  challengeId: string
  methods: TwoFactorAuthMethod[]
  expiresAt: string
  attempts: number
  maxAttempts: number
}
