"use client"

import { useRef, useCallback } from "react"

interface GestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onRotate?: (angle: number) => void
  threshold?: number
}

export function useGestures(options: GestureOptions) {
  const { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPinch, onRotate, threshold = 50 } = options

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null)
  const touchEnd = useRef<{ x: number; y: number; time: number } | null>(null)
  const initialDistance = useRef<number>(0)
  const initialAngle = useRef<number>(0)

  // 计算两点间距离
  const getDistance = useCallback((touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // 计算两点间角度
  const getAngle = useCallback((touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return (Math.atan2(dy, dx) * 180) / Math.PI
  }, [])

  // 处理触摸开始
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      }

      // 多点触摸处理
      if (e.touches.length === 2) {
        initialDistance.current = getDistance(e.touches[0], e.touches[1])
        initialAngle.current = getAngle(e.touches[0], e.touches[1])
      }
    },
    [getDistance, getAngle],
  )

  // 处理触摸移动
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current) return

      // 多点触摸处理
      if (e.touches.length === 2) {
        const currentDistance = getDistance(e.touches[0], e.touches[1])
        const currentAngle = getAngle(e.touches[0], e.touches[1])

        // 缩放手势
        if (onPinch && initialDistance.current > 0) {
          const scale = currentDistance / initialDistance.current
          onPinch(scale)
        }

        // 旋转手势
        if (onRotate) {
          const angleDiff = currentAngle - initialAngle.current
          onRotate(angleDiff)
        }
      }
    },
    [getDistance, getAngle, onPinch, onRotate],
  )

  // 处理触摸结束
  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current) return

      const touch = e.changedTouches[0]
      touchEnd.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      }

      const deltaX = touchEnd.current.x - touchStart.current.x
      const deltaY = touchEnd.current.y - touchStart.current.y
      const deltaTime = touchEnd.current.time - touchStart.current.time

      // 检查是否为快速滑动
      const isSwipe = deltaTime < 300 && (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold)

      if (isSwipe) {
        // 水平滑动
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight()
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft()
          }
        }
        // 垂直滑动
        else {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown()
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp()
          }
        }
      }

      // 重置状态
      touchStart.current = null
      touchEnd.current = null
      initialDistance.current = 0
      initialAngle.current = 0
    },
    [threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown],
  )

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  }
}
