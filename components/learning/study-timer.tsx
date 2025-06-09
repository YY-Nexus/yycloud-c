"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, Square, Clock, Coffee, RotateCcw, Settings, TimerIcon } from "lucide-react"

interface StudySession {
  id: string
  startTime: Date
  endTime?: Date
  duration: number
  type: "study" | "break"
  completed: boolean
}

export function StudyTimer() {
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25分钟默认
  const [currentSession, setCurrentSession] = useState<"study" | "break">("study")
  const [sessionCount, setSessionCount] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    studyDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4,
  })
  const [sessions, setSessions] = useState<StudySession[]>([])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 初始化音频
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3")
    audioRef.current.volume = 0.5
  }, [])

  // 计时器逻辑
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleSessionComplete = () => {
    setIsRunning(false)

    // 播放提示音
    if (audioRef.current) {
      audioRef.current.play().catch(console.error)
    }

    // 记录会话
    const session: StudySession = {
      id: Date.now().toString(),
      startTime: new Date(
        Date.now() -
          (currentSession === "study"
            ? settings.studyDuration * 60 * 1000
            : (sessionCount % settings.sessionsUntilLongBreak === 0 ? settings.longBreak : settings.shortBreak) *
              60 *
              1000),
      ),
      endTime: new Date(),
      duration:
        currentSession === "study"
          ? settings.studyDuration
          : sessionCount % settings.sessionsUntilLongBreak === 0
            ? settings.longBreak
            : settings.shortBreak,
      type: currentSession,
      completed: true,
    }
    setSessions((prev) => [...prev, session])

    if (currentSession === "study") {
      setSessionCount((prev) => prev + 1)
      // 切换到休息
      const isLongBreak = (sessionCount + 1) % settings.sessionsUntilLongBreak === 0
      setCurrentSession("break")
      setTimeLeft((isLongBreak ? settings.longBreak : settings.shortBreak) * 60)
    } else {
      // 切换到学习
      setCurrentSession("study")
      setTimeLeft(settings.studyDuration * 60)
    }
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleStop = () => {
    setIsRunning(false)
    setCurrentSession("study")
    setTimeLeft(settings.studyDuration * 60)
  }

  const handleReset = () => {
    setIsRunning(false)
    setSessionCount(0)
    setCurrentSession("study")
    setTimeLeft(settings.studyDuration * 60)
    setSessions([])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress =
    currentSession === "study"
      ? ((settings.studyDuration * 60 - timeLeft) / (settings.studyDuration * 60)) * 100
      : (((sessionCount % settings.sessionsUntilLongBreak === 0 ? settings.longBreak : settings.shortBreak) * 60 -
          timeLeft) /
          ((sessionCount % settings.sessionsUntilLongBreak === 0 ? settings.longBreak : settings.shortBreak) * 60)) *
        100

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <TimerIcon className="mr-2 h-4 w-4" />
          专注计时器
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            番茄钟学习计时器
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 计时器显示 */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-mono">{formatTime(timeLeft)}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                {currentSession === "study" ? (
                  <>
                    <Clock className="h-4 w-4" />
                    学习时间
                  </>
                ) : (
                  <>
                    <Coffee className="h-4 w-4" />
                    休息时间
                  </>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2 mb-4" />
              <div className="flex justify-center gap-2">
                {!isRunning ? (
                  <Button onClick={handleStart} className="flex-1">
                    <Play className="mr-2 h-4 w-4" />
                    开始
                  </Button>
                ) : (
                  <Button onClick={handlePause} variant="outline" className="flex-1">
                    <Pause className="mr-2 h-4 w-4" />
                    暂停
                  </Button>
                )}
                <Button onClick={handleStop} variant="outline">
                  <Square className="h-4 w-4" />
                </Button>
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 会话统计 */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{sessionCount}</div>
                <div className="text-sm text-muted-foreground">完成的番茄钟</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {Math.floor(sessions.filter((s) => s.type === "study").reduce((sum, s) => sum + s.duration, 0) / 60)}h
                </div>
                <div className="text-sm text-muted-foreground">今日学习时间</div>
              </CardContent>
            </Card>
          </div>

          {/* 设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-4 w-4" />
                计时器设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">学习时长（分钟）</label>
                  <Select
                    value={settings.studyDuration.toString()}
                    onValueChange={(value) => setSettings({ ...settings, studyDuration: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15分钟</SelectItem>
                      <SelectItem value="25">25分钟</SelectItem>
                      <SelectItem value="30">30分钟</SelectItem>
                      <SelectItem value="45">45分钟</SelectItem>
                      <SelectItem value="60">60分钟</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">短休息（分钟）</label>
                  <Select
                    value={settings.shortBreak.toString()}
                    onValueChange={(value) => setSettings({ ...settings, shortBreak: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3分钟</SelectItem>
                      <SelectItem value="5">5分钟</SelectItem>
                      <SelectItem value="10">10分钟</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">长休息（分钟）</label>
                  <Select
                    value={settings.longBreak.toString()}
                    onValueChange={(value) => setSettings({ ...settings, longBreak: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15分钟</SelectItem>
                      <SelectItem value="20">20分钟</SelectItem>
                      <SelectItem value="30">30分钟</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">长休息间隔</label>
                  <Select
                    value={settings.sessionsUntilLongBreak.toString()}
                    onValueChange={(value) =>
                      setSettings({ ...settings, sessionsUntilLongBreak: Number.parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3个番茄钟</SelectItem>
                      <SelectItem value="4">4个番茄钟</SelectItem>
                      <SelectItem value="5">5个番茄钟</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 今日会话历史 */}
          {sessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">今日学习记录</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {sessions.slice(-5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {session.type === "study" ? (
                          <Clock className="h-3 w-3 text-blue-500" />
                        ) : (
                          <Coffee className="h-3 w-3 text-green-500" />
                        )}
                        <span>{session.type === "study" ? "学习" : "休息"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{session.duration}分钟</span>
                        <Badge variant={session.completed ? "default" : "secondary"}>
                          {session.completed ? "完成" : "进行中"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
