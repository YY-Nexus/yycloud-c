"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function PlatformHeader() {
  const [currentTime, setCurrentTime] = useState(new Date())

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <header className="bg-gradient-to-r from-[#1a1f35] via-[#1e293b] to-[#1a1f35] text-white py-3 px-4 shadow-md border-b border-slate-700/50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* 标题区域 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <div className="flex flex-col">
              <h1 className="text-xl font-bold leading-tight tracking-wide">言语云³ 中央控制平台™</h1>
              <p className="text-xs text-slate-300 tracking-wider">YanYu Nexus³ Central Control Platform™</p>
            </div>
          </motion.div>

          {/* 时间日期区域 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-right text-sm"
          >
            <div className="font-medium text-slate-200">
              {currentTime.toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </div>
            <div className="text-lg font-mono text-slate-300">
              {currentTime.toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
