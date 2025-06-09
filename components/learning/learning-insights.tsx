"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Brain, Clock, Target, BookOpen, Award, Lightbulb } from "lucide-react"
import type { LearningStats, LearningResource } from "@/types/learning"

interface LearningInsightsProps {
  stats: LearningStats | null
  resources: LearningResource[]
}

export function LearningInsights({ stats, resources }: LearningInsightsProps) {
  if (!stats) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // 准备图表数据
  const categoryData = Object.entries(stats.categoryBreakdown).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / stats.totalResources) * 100),
  }))

  const progressData = resources
    .map((resource) => ({
      name: resource.title.length > 20 ? resource.title.substring(0, 20) + "..." : resource.title,
      progress: resource.progress,
      category: resource.category,
    }))
    .slice(0, 10)

  const weeklyData = stats.monthlyProgress.slice(-4).map((item) => ({
    week: item.month,
    hours: Math.round((item.learningTime / 60) * 10) / 10,
    resources: item.completedResources,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658"]

  const insights = [
    {
      title: "学习效率分析",
      description: "基于您的学习数据分析",
      icon: Brain,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.averageSessionDuration}</div>
              <div className="text-sm text-muted-foreground">平均学习时长（分钟）</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completionRate}%</div>
              <div className="text-sm text-muted-foreground">完成率</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>学习效率</span>
              <span>{stats.completionRate > 70 ? "优秀" : stats.completionRate > 50 ? "良好" : "需要改进"}</span>
            </div>
            <Progress value={stats.completionRate} className="h-2" />
          </div>
        </div>
      ),
    },
    {
      title: "学习分类分布",
      description: "您的学习兴趣分析",
      icon: BookOpen,
      content: (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category, percentage }) => `${category} ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "学习进度概览",
      description: "各项目学习进度",
      icon: Target,
      content: (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={progressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="progress" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "学习趋势分析",
      description: "最近的学习活动趋势",
      icon: TrendingUp,
      content: (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="hours" stackId="1" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
  ]

  const recommendations = [
    {
      icon: Clock,
      title: "时间管理建议",
      description: "建议每天保持1-2小时的学习时间，保持学习的连续性",
      priority: "high",
    },
    {
      icon: Target,
      title: "目标设定",
      description: "为每个学习资源设定明确的完成目标和时间节点",
      priority: "medium",
    },
    {
      icon: Award,
      title: "学习激励",
      description: "完成学习目标后给自己一些奖励，保持学习动力",
      priority: "low",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">学习洞察</h2>
        <p className="text-muted-foreground">深入分析您的学习数据，提供个性化建议</p>
      </div>

      {/* 洞察卡片 */}
      <div className="grid gap-6 md:grid-cols-2">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {insight.title}
                </CardTitle>
                <CardDescription>{insight.description}</CardDescription>
              </CardHeader>
              <CardContent>{insight.content}</CardContent>
            </Card>
          )
        })}
      </div>

      {/* 学习建议 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            个性化学习建议
          </CardTitle>
          <CardDescription>基于您的学习数据生成的建议</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const Icon = rec.icon
              const priorityColors = {
                high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
              }

              return (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{rec.title}</h4>
                      <Badge className={priorityColors[rec.priority]}>
                        {rec.priority === "high" ? "高优先级" : rec.priority === "medium" ? "中优先级" : "低优先级"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
