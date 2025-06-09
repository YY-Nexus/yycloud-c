/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 全局类型定义
 *
 * @module YYC/types
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

import type { LucideIcon } from "lucide-react"

export interface MainNavItem {
  title: string
  href: string
  disabled?: boolean
}

export interface SidebarNavItem {
  title: string
  href: string
  icon?: LucideIcon
  disabled?: boolean
  external?: boolean
  label?: string
}

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: LucideIcon
  label?: string
  description?: string
}

export interface YYUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "user" | "guest"
  createdAt: Date
  updatedAt: Date
}

export interface YYModule {
  id: string
  name: string
  code: string
  description: string
  icon: LucideIcon
  path: string
  status: "active" | "maintenance" | "development"
  permissions: string[]
}

export interface YYSystemStatus {
  uptime: number
  lastUpdated: Date
  activeUsers: number
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  alerts: YYAlert[]
}

export interface YYAlert {
  id: string
  type: "info" | "warning" | "error" | "success"
  message: string
  timestamp: Date
  read: boolean
  module?: string
}
