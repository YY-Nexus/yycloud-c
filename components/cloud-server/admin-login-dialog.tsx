"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Lock, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { adminLogin, getSessionRemainingTime } from "@/lib/admin-auth"
import { Checkbox } from "@/components/ui/checkbox"

interface AdminLoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function AdminLoginDialog({ open, onOpenChange, onSuccess }: AdminLoginDialogProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const handleLogin = async () => {
    if (!password.trim()) {
      setError("请输入管理员密码")
      return
    }

    setIsLoading(true)
    setError("")

    // 模拟登录延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    const success = adminLogin(password, rememberMe)

    if (success) {
      setPassword("")
      onSuccess()
      onOpenChange(false)
    } else {
      setError("密码错误，请重试")
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  const remainingTime = getSessionRemainingTime()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            管理员验证
          </DialogTitle>
          <DialogDescription>需要管理员权限才能修改服务器配置。请输入管理员密码继续。</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">管理员密码</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="请输入管理员密码"
                className="pr-10"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label htmlFor="remember-me" className="text-sm cursor-pointer">
              记住登录状态（30天）
            </Label>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {remainingTime > 0 && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>当前会话还有 {remainingTime} 分钟有效期</AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start">
              <Lock className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">安全提示</p>
                <ul className="space-y-1 text-xs">
                  <li>• 登录后24小时内有效</li>
                  <li>• 可以修改所有服务器配置</li>
                  <li>• 关闭浏览器后需要重新验证</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            取消
          </Button>
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "验证中..." : "确认登录"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
