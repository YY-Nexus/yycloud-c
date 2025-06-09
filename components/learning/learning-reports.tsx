"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  FileText,
  Share,
  CalendarIcon,
  TrendingUp,
  Clock,
  BookOpen,
  Target,
  Award,
  BarChart3,
  PieChartIcon,
  Activity,
} from "lucide-react"
import { format, subDays } from "date-fns"
import { zhCN } from "date-fns/locale"

interface ReportData {
  period: string
  studyTime: number
  completedResources: number
  sessionsCount: number
  averageSessionTime: number
  categories: Record<string, number>
  dailyActivity: Array<{
    date: string
    studyTime: number
    sessions: number
  }>
  weeklyProgress: Array<{
    week: string
    completedResources: number
    studyTime: number
  }>
  achievements: number
  goals: {
    completed: number
    total: number
  }
}

export function LearningReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [reportType, setReportType] = useState("overview")
  const [loading, setLoading] = useState(false)

  // 模拟报告数据
  useEffect(() => {
    const generateReportData = (): ReportData => {
      return {
        period: "最近30天",
        studyTime: 2400, // 40小时
        completedResources: 8,
        sessionsCount: 45,
        averageSessionTime: 53,
        categories: {
          技术: 12,
          语言: 3,
          职业发展: 2,
          兴趣爱好: 1,
        },
        dailyActivity: Array.from({ length: 30 }, (_, i) => ({
          date: format(subDays(new Date(), 29 - i), "MM-dd"),
          studyTime: Math.floor(Math.random() * 120) + 30,
          sessions: Math.floor(Math.random() * 3) + 1,
        })),
        weeklyProgress: Array.from({ length: 4 }, (_, i) => ({
          week: `第${i + 1}周`,
          completedResources: Math.floor(Math.random() * 3) + 1,
          studyTime: Math.floor(Math.random() * 600) + 400,
        })),
        achievements: 5,
        goals: {
          completed: 3,
          total: 5,
        },
      }
    }

    setLoading(true)
    setTimeout(() => {
      setReportData(generateReportData())
      setLoading(false)
    }, 1000)
  }, [dateRange])

  const exportReport = (format: "pdf" | "excel" | "csv") => {
    // 模拟导出功能
    console.log(`导出${format}格式报告`)
  }

  const shareReport = () => {
    // 模拟分享功能
    console.log("分享学习报告")
  }

  if (loading || !reportData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">学习报告</h2>
            <p className="text-muted-foreground">生成详细的学习分析报告</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const categoryData = Object.entries(reportData.categories).map(([category, count]) => ({
    name: category,
    value: count,
    percentage: Math.round((count / Object.values(reportData.categories).reduce((a, b) => a + b, 0)) * 100),
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            学习报告
          </h2>
          <p className="text-muted-foreground">生成详细的学习分析报告</p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(dateRange.from, "MM月dd日", { locale: zhCN })} -{" "}
                {format(dateRange.to, "MM月dd日", { locale: zhCN })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to })
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" onClick={shareReport}>
            <Share className="mr-2 h-4 w-4" />
            分享
          </Button>
          <Select defaultValue="pdf" onValueChange={(value) => exportReport(value as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">导出PDF</SelectItem>
              <SelectItem value="excel">导出Excel</SelectItem>
              <SelectItem value="csv">导出CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 概览统计 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总学习时间</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(reportData.studyTime / 60)}小时</div>
            <p className="text-xs text-muted-foreground">平均每天 {Math.floor(reportData.studyTime / 30)}分钟</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">完成资源</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.completedResources}</div>
            <p className="text-xs text-muted-foreground">平均每周 {Math.floor(reportData.completedResources / 4)}个</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">学习会话</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.sessionsCount}</div>
            <p className="text-xs text-muted-foreground">平均时长 {reportData.averageSessionTime}分钟</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">目标完成率</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((reportData.goals.completed / reportData.goals.total) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData.goals.completed}/{reportData.goals.total} 个目标
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 详细报告 */}
      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="activity">活动分析</TabsTrigger>
          <TabsTrigger value="categories">分类统计</TabsTrigger>
          <TabsTrigger value="progress">进度趋势</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  每日学习时间
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={reportData.dailyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="studyTime" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  周进度统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completedResources" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>学习活动热力图</CardTitle>
              <CardDescription>显示您的学习活动模式</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={reportData.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="studyTime" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="sessions" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  学习分类分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>分类详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span>{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{category.value}个</span>
                        <Badge variant="outline">{category.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>学习进度趋势</CardTitle>
              <CardDescription>跟踪您的学习进度变化</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={reportData.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="studyTime"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="completedResources"
                    stackId="2"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 报告总结 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            学习总结
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">学习亮点</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 本期累计学习 {Math.floor(reportData.studyTime / 60)} 小时，超过平均水平</li>
                <li>• 完成了 {reportData.completedResources} 个学习资源</li>
                <li>• 解锁了 {reportData.achievements} 个新成就</li>
                <li>• 平均每次学习 {reportData.averageSessionTime} 分钟，专注度很高</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">改进建议</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 建议保持每日学习的连续性</li>
                <li>• 可以尝试学习更多不同类型的内容</li>
                <li>• 设定更具挑战性的学习目标</li>
                <li>• 定期回顾和总结学习成果</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
