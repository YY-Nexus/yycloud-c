"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * 言语云³ 云形LOGO组件 - 简化版本
 *
 * @module YYC/ui
 * @version 2.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

interface CloudLogoProps {
  className?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
  withText?: boolean
  href?: string
  animated?: boolean
  textPosition?: "right" | "bottom"
  variant?: "default" | "white" | "dark" | "minimal"
}

export function CloudLogo({
  className = "",
  size = "md",
  withText = false,
  href = "/",
  animated = false,
  textPosition = "right",
  variant = "default",
}: CloudLogoProps) {
  const sizes = {
    xs: { width: 24, height: 24, textClass: "text-sm" },
    sm: { width: 32, height: 32, textClass: "text-base" },
    md: { width: 40, height: 40, textClass: "text-lg" },
    lg: { width: 48, height: 48, textClass: "text-xl" },
    xl: { width: 64, height: 64, textClass: "text-2xl" },
    "2xl": { width: 80, height: 80, textClass: "text-3xl" },
    "3xl": { width: 100, height: 100, textClass: "text-4xl" },
    "4xl": { width: 120, height: 120, textClass: "text-5xl" },
  }

  const { width, height, textClass } = sizes[size]

  // 根据变体选择不同的样式
  const getVariantStyles = () => {
    switch (variant) {
      case "white":
        return "brightness-0 invert"
      case "dark":
        return "brightness-0"
      case "minimal":
        return "opacity-80"
      default:
        return ""
    }
  }

  const logoImage = (
    <div className={cn("relative flex-shrink-0", animated && "animate-pulse")} style={{ width, height }}>
      <Image
        src="/images/yanyu-cloud-logo-new.png"
        alt="言语云³ LOGO"
        width={width}
        height={height}
        className={cn("object-contain", getVariantStyles())}
        priority
      />
    </div>
  )

  const logoText = withText && (
    <div className="flex flex-col">
      <span className={cn("font-bold leading-tight", textClass)}>言语云³</span>
      {size !== "xs" && size !== "sm" && <span className="text-xs text-muted-foreground opacity-70">YanYu Cloud³</span>}
    </div>
  )

  const logo = (
    <div
      className={cn(
        "flex items-center transition-all duration-200",
        textPosition === "right" ? "flex-row gap-3" : "flex-col gap-2",
        className,
      )}
    >
      {logoImage}
      {logoText}
    </div>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
      >
        {logo}
      </Link>
    )
  }

  return logo
}
