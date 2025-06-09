import { Loading } from "@/components/loading"

/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 全局加载状态页面
 *
 * @module YYC/core
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

export default function LoadingPage() {
  return <Loading size="lg" fullScreen text="言语云³ 正在加载中..." />
}
