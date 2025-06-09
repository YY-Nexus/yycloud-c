"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Route, Search, Clock, Users, Star, BookOpen, Play, Plus, Grid, List } from "lucide-react"
import { YYGetLearningPaths, YYFilterLearningPaths, YYEnrollPath } from "@/lib/learning-path-manager"
import type { LearningPath, PathFilter } from "@/types/learning-path"

interface PathListProps {
  onSelectPath: (path: LearningPath) => void
  onCreatePath: () => void
}

export function PathList({ onSelectPath, onCreatePath }: PathListProps) {
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [filteredPaths, setFilteredPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("all")
  const [filter, setFilter] = useState<PathFilter>({
    sortBy: "popular",
    sortOrder: "desc",
  })

  // 加载路径数据
  useEffect(() => {
    const loadPaths = async () => {
      try {
        setLoading(true)
        const pathsData = await YYGetLearningPaths()
        setPaths(pathsData)
        setFilteredPaths(pathsData)
      } catch (error) {
        console.error("加载学习路径失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPaths()
  }, [])

  // 应用筛选
  useEffect(() => {
    const applyFilter = async () => {
      const currentFilter = { ...filter }

      // 根据标签页设置筛选条件
      switch (activeTab) {
        case "enrolled":
          currentFilter.isEnrolled = true
          break
        case "completed":
          currentFilter.isEnrolled = true
          // 这里可以添加完成状态的筛选
          break
        case "featured":
          // 筛选精选路径
          break
      }

      const filtered = await YYFilterLearningPaths(currentFilter)
      setFilteredPaths(filtered)
    }

    applyFilter()
  }, [filter, activeTab, paths])

  const handleEnroll = async (pathId: string) => {
    const success = await YYEnrollPath(pathId)
    if (success) {
      // 重新加载数据
      const pathsData = await YYGetLearningPaths()
      setPaths(pathsData)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-red-500"
      case "expert":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "初级"
      case "intermediate":
        return "中级"
      case "advanced":
        return "高级"
      case "expert":
        return "专家"
      default:
        return "未知"
    }
  }

  const PathCard = ({ path }: { path: LearningPath }) => (
    <Card
      className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onSelectPath(path)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            <Badge className={`${getDifficultyColor(path.difficulty)} text-white`}>
              {getDifficultyText(path.difficulty)}
            </Badge>
            {path.isFeatured && (
              <Badge variant="outline" className="text-yellow-600">
                <Star className="mr-1 h-3 w-3" />
                精选
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">{path.stats.rating}</span>
          </div>
        </div>
        <CardTitle className="line-clamp-2">{path.title}</CardTitle>
        <CardDescription className="line-clamp-3">{path.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {/* 进度条（已注册用户） */}
          {path.isEnrolled && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>学习进度</span>
                <span>{path.overallProgress}%</span>
              </div>
              <Progress value={path.overallProgress} className="h-2" />
            </div>
          )}

          {/* 统计信息 */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span>{path.estimatedHours}h</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3 text-muted-foreground" />
              <span>{path.steps.length}步</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span>{path.stats.enrolledCount}</span>
            </div>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {path.category}
            </Badge>
            {path.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 mt-4">
          {path.isEnrolled ? (
            <Button
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation()
                onSelectPath(path)
              }}
            >
              <Play className="mr-1 h-3 w-3" />
              继续学习
            </Button>
          ) : (
            <Button
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation()
                handleEnroll(path.id)
              }}
            >
              <BookOpen className="mr-1 h-3 w-3" />
              开始学习
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onSelectPath(path)
            }}
          >
            详情
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const PathListItem = ({ path }: { path: LearningPath }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectPath(path)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Route className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{path.title}</h3>
              <Badge className={`${getDifficultyColor(path.difficulty)} text-white text-xs`}>
                {getDifficultyText(path.difficulty)}
              </Badge>
              {path.isFeatured && (
                <Badge variant="outline" className="text-yellow-600 text-xs">
                  <Star className="mr-1 h-2 w-2" />
                  精选
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{path.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {path.estimatedHours}小时
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {path.steps.length}步骤
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {path.stats.enrolledCount}人学习
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                {path.stats.rating}
              </span>
            </div>
            {path.isEnrolled && (
              <div className="mt-2">
                <Progress value={path.overallProgress} className="h-1" />
                <span className="text-xs text-muted-foreground">{path.overallProgress}% 完成</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {path.isEnrolled ? (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectPath(path)
                }}
              >
                <Play className="mr-1 h-3 w-3" />
                继续
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEnroll(path.id)
                }}
              >
                开始学习
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">学习路径</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Route className="h-6 w-6" />
            学习路径
          </h2>
          <p className="text-muted-foreground">系统化的学习计划，助您高效成长</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <Button onClick={onCreatePath}>
            <Plus className="mr-2 h-4 w-4" />
            创建路径
          </Button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索学习路径..."
            value={filter.searchTerm || ""}
            onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
            className="pl-10"
          />
        </div>
        <Select
          value={filter.category || "all"}
          onValueChange={(value) => setFilter({ ...filter, category: value === "all" ? undefined : value })}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有分类</SelectItem>
            <SelectItem value="前端开发">前端开发</SelectItem>
            <SelectItem value="后端开发">后端开发</SelectItem>
            <SelectItem value="移动开发">移动开发</SelectItem>
            <SelectItem value="数据科学">数据科学</SelectItem>
            <SelectItem value="设计">设计</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filter.difficulty || "all"}
          onValueChange={(value) => setFilter({ ...filter, difficulty: value === "all" ? undefined : (value as any) })}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="选择难度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有难度</SelectItem>
            <SelectItem value="beginner">初级</SelectItem>
            <SelectItem value="intermediate">中级</SelectItem>
            <SelectItem value="advanced">高级</SelectItem>
            <SelectItem value="expert">专家</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={`${filter.sortBy}-${filter.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split("-")
            setFilter({ ...filter, sortBy: sortBy as any, sortOrder: sortOrder as any })
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular-desc">最受欢迎</SelectItem>
            <SelectItem value="rating-desc">评分最高</SelectItem>
            <SelectItem value="newest-desc">最新发布</SelectItem>
            <SelectItem value="updated-desc">最近更新</SelectItem>
            <SelectItem value="difficulty-asc">难度递增</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 路径分类标签 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">全部路径</TabsTrigger>
          <TabsTrigger value="enrolled">我的学习</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
          <TabsTrigger value="featured">精选推荐</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* 路径列表 */}
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPaths.map((path) => (
                <PathCard key={path.id} path={path} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPaths.map((path) => (
                <PathListItem key={path.id} path={path} />
              ))}
            </div>
          )}

          {filteredPaths.length === 0 && (
            <div className="text-center py-12">
              <Route className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">暂无学习路径</h3>
              <p className="text-muted-foreground">
                {activeTab === "enrolled"
                  ? "您还没有注册任何学习路径"
                  : activeTab === "completed"
                    ? "您还没有完成任何学习路径"
                    : "没有找到符合条件的学习路径"}
              </p>
              {activeTab === "all" && (
                <Button className="mt-4" onClick={onCreatePath}>
                  <Plus className="mr-2 h-4 w-4" />
                  创建路径
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 统计信息 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{paths.length}</div>
            <div className="text-sm text-muted-foreground">总路径数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{paths.filter((p) => p.isEnrolled).length}</div>
            <div className="text-sm text-muted-foreground">已注册</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{paths.filter((p) => p.completedAt).length}</div>
            <div className="text-sm text-muted-foreground">已完成</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(
                paths.reduce((sum, p) => sum + (p.isEnrolled ? p.overallProgress : 0), 0) /
                  Math.max(paths.filter((p) => p.isEnrolled).length, 1),
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground">平均进度</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
