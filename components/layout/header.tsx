"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date())

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <header className="bg-gray-900 text-white py-2 px-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-end items-center">
          {/* 时间日期区域 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.5 }}
            className="text-right text-sm"
          >
            <div>
              {currentTime.toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </div>
            <div className="text-xs opacity-80">
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
