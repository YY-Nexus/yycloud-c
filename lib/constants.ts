/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 全局常量定义
 *
 * @module YYC/lib
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

// 品牌信息
export const BRAND = {
  NAME: {
    FULL: "言语云³ 中央控制平台™",
    SHORT: "言语云³",
    EN_FULL: "YanYu Nexus³ Central Control Platform™",
    EN_SHORT: "YanYu Cloud³",
    CODE: "YYC³",
  },
  SLOGAN: "言枢象限·语启未来",
  COPYRIGHT: "© 2023-2024 YanYu Technology",
}

// 颜色系统
export const COLORS = {
  PRIMARY: "#3b5bdb", // 主色调蓝色
  SECONDARY: "#7950f2", // 次要色调紫色
  ACCENT: "#0ea5e9", // 强调色青色
  SUCCESS: "#2b8a3e",
  WARNING: "#e67700",
  ERROR: "#c92a2a",
  INFO: "#1864ab",
  BACKGROUND: {
    LIGHT: "#ffffff",
    DARK: "#1e293b",
  },
}

// 本地存储键
export const STORAGE_KEYS = {
  THEME: "yanyu-theme",
  USER_SETTINGS: "yanyu-user-settings",
  SPEED_TEST_HISTORY: "yanyu-speedtest-history",
  DEVICE_LIST: "yanyu-devices",
  DEVICE_RESULTS_PREFIX: "yanyu-device-results:",
  COMPARISON_REPORTS: "yanyu-comparison-reports",
}

// API路径
export const API_PATHS = {
  SPEED_TEST: {
    DOWNLOAD: "/api/speed-test/download",
    UPLOAD: "/api/speed-test/upload",
    PING: "/api/speed-test/ping",
  },
}

// 模块配置
export const MODULES = {
  NETWORK_TEST: {
    FILE_SIZES: {
      SMALL: 128 * 1024, // 128KB
      MEDIUM: 512 * 1024, // 512KB
      LARGE: 1 * 1024 * 1024, // 1MB
    },
    TEST_CONFIG: {
      PING_SAMPLES: 10,
      JITTER_SAMPLES: 20,
      PACKET_LOSS_SAMPLES: 100,
      DOWNLOAD_TIME: 10000, // ms
      UPLOAD_TIME: 10000, // ms
    },
  },
}
