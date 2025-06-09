"use client"

/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * A/B测试Hook
 *
 * 提供便捷的A/B测试功能
 *
 * @module YYC/hooks
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

import { useState, useEffect } from "react"
import { getVariant, trackConversion, type Experiment, registerExperiment } from "@/lib/ab-testing"

export function useABTesting(experimentId: string) {
  const [variant, setVariant] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 客户端获取变体
    const variantId = getVariant(experimentId)
    setVariant(variantId)
    setIsLoading(false)
  }, [experimentId])

  // 跟踪转化
  const trackVariantConversion = (metricName: string, value = 1) => {
    if (variant) {
      trackConversion(experimentId, metricName, value)
    }
  }

  return {
    variant,
    isLoading,
    trackConversion: trackVariantConversion,
  }
}

export function useExperiment(experiment: Experiment) {
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    // 注册实验
    registerExperiment(experiment)
    setIsRegistered(true)
  }, [experiment])

  const { variant, isLoading, trackConversion } = useABTesting(experiment.id)

  return {
    isRegistered,
    variant,
    isLoading,
    trackConversion,
  }
}
