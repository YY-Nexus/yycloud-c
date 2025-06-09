/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * A/B测试管理页面
 *
 * @module YYC/app
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  getExperiments,
  getExperimentResults,
  registerExperiment,
  type Experiment,
  type ExperimentType,
  type Variant,
} from "@/lib/ab-testing"
import { PlusCircle, BarChart4, FlaskConical, Trash2 } from "lucide-react"
import {
  BarChart,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Line,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ABTestingPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [activeTab, setActiveTab] = useState("experiments")
  const [showNewExperimentDialog, setShowNewExperimentDialog] = useState(false)
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null)

  useEffect(() => {
    // 加载实验
    const loadedExperiments = getExperiments()
    setExperiments(loadedExperiments)
  }, [])

  const handleCreateExperiment = (experiment: Experiment) => {
    registerExperiment(experiment)
    setExperiments(getExperiments())
    setShowNewExperimentDialog(false)
  }

  const handleToggleExperiment = (experimentId: string, isActive: boolean) => {
    const updatedExperiments = experiments.map((exp) => {
      if (exp.id === experimentId) {
        return { ...exp, isActive }
      }
      return exp
    })

    // 更新实验状态
    updatedExperiments.forEach((exp) => {
      if (exp.id === experimentId) {
        registerExperiment(exp)
      }
    })

    setExperiments(updatedExperiments)
  }

  const handleSelectExperiment = (experiment: Experiment) => {
    setSelectedExperiment(experiment)
    setActiveTab("results")
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">A/B测试管理</h1>
        <p className="text-muted-foreground">创建和管理A/B测试实验，分析结果</p>
      </div>

      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="experiments">实验列表</TabsTrigger>
            <TabsTrigger value="results">实验结果</TabsTrigger>
            <TabsTrigger value="insights">数据洞察</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="experiments" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">实验列表</h2>
                <Dialog open={showNewExperimentDialog} onOpenChange={setShowNewExperimentDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      创建新实验
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <ExperimentForm
                      onSubmit={handleCreateExperiment}
                      onCancel={() => setShowNewExperimentDialog(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {experiments.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <FlaskConical className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">暂无实验</h3>
                    <p className="text-sm text-muted-foreground mt-2">点击"创建新实验"按钮开始您的第一个A/B测试</p>
                    <Button className="mt-4" onClick={() => setShowNewExperimentDialog(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      创建新实验
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {experiments.map((experiment) => (
                    <ExperimentCard
                      key={experiment.id}
                      experiment={experiment}
                      onToggle={handleToggleExperiment}
                      onSelect={handleSelectExperiment}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="results">
              {selectedExperiment ? (
                <ExperimentResults experiment={selectedExperiment} />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <BarChart4 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">请选择实验</h3>
                    <p className="text-sm text-muted-foreground mt-2">从实验列表中选择一个实验查看其结果</p>
                    <Button className="mt-4" onClick={() => setActiveTab("experiments")}>
                      查看实验列表
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="insights">
              <InsightsTab experiments={experiments} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

interface ExperimentCardProps {
  experiment: Experiment
  onToggle: (id: string, isActive: boolean) => void
  onSelect: (experiment: Experiment) => void
}

function ExperimentCard({ experiment, onToggle, onSelect }: ExperimentCardProps) {
  const getExperimentTypeLabel = (type: ExperimentType) => {
    switch (type) {
      case "feature":
        return "功能测试"
      case "ui":
        return "界面测试"
      case "content":
        return "内容测试"
      case "flow":
        return "流程测试"
      case "pricing":
        return "定价测试"
      default:
        return "未知类型"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{experiment.name}</CardTitle>
            <CardDescription>ID: {experiment.id}</CardDescription>
          </div>
          <Badge variant={experiment.isActive ? "default" : "outline"}>
            {experiment.isActive ? "进行中" : "已暂停"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">类型:</span>
            <span>{getExperimentTypeLabel(experiment.type)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">变体数量:</span>
            <span>{experiment.variants.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">开始日期:</span>
            <span>{experiment.startDate ? new Date(experiment.startDate).toLocaleDateString() : "未设置"}</span>
          </div>

          <Separator className="my-2" />

          <div>
            <h4 className="text-sm font-medium mb-2">变体:</h4>
            <div className="space-y-1">
              {experiment.variants.map((variant) => (
                <div key={variant.id} className="flex justify-between text-sm">
                  <span>{variant.name}</span>
                  <span className="text-muted-foreground">{variant.weight || 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Switch checked={experiment.isActive} onCheckedChange={(checked) => onToggle(experiment.id, checked)} />
          <Label htmlFor="active">{experiment.isActive ? "运行中" : "已暂停"}</Label>
        </div>
        <Button variant="outline" onClick={() => onSelect(experiment)}>
          查看结果
        </Button>
      </CardFooter>
    </Card>
  )
}

interface ExperimentFormProps {
  experiment?: Experiment
  onSubmit: (experiment: Experiment) => void
  onCancel: () => void
}

function ExperimentForm({ experiment, onSubmit, onCancel }: ExperimentFormProps) {
  const [formData, setFormData] = useState<Experiment>(
    experiment || {
      id: `exp_${Date.now()}`,
      name: "",
      type: "feature",
      variants: [
        { id: "control", name: "对照组" },
        { id: "variant_1", name: "变体1" },
      ],
      isActive: true,
      startDate: new Date(),
    },
  )

  const handleChange = (field: keyof Experiment, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    const updatedVariants = [...formData.variants]
    updatedVariants[index] = { ...updatedVariants[index], [field]: value }
    setFormData((prev) => ({ ...prev, variants: updatedVariants }))
  }

  const addVariant = () => {
    const newVariant: Variant = {
      id: `variant_${formData.variants.length}`,
      name: `变体${formData.variants.length}`,
      weight: 1,
    }
    setFormData((prev) => ({ ...prev, variants: [...prev.variants, newVariant] }))
  }

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 2) return // 至少保留两个变体
    const updatedVariants = [...formData.variants]
    updatedVariants.splice(index, 1)
    setFormData((prev) => ({ ...prev, variants: updatedVariants }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{experiment ? "编辑实验" : "创建新实验"}</DialogTitle>
        <DialogDescription>{experiment ? "修改实验设置" : "设置新的A/B测试实验参数"}</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            实验名称
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="col-span-3"
            placeholder="例如：首页布局测试"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            实验类型
          </Label>
          <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="选择实验类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feature">功能测试</SelectItem>
              <SelectItem value="ui">界面测试</SelectItem>
              <SelectItem value="content">内容测试</SelectItem>
              <SelectItem value="flow">流程测试</SelectItem>
              <SelectItem value="pricing">定价测试</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="active" className="text-right">
            立即激活
          </Label>
          <div className="col-span-3 flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange("isActive", checked)}
            />
            <Label htmlFor="active">{formData.isActive ? "是" : "否"}</Label>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>实验变体</Label>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <PlusCircle className="mr-2 h-4 w-4" />
              添加变体
            </Button>
          </div>

          {formData.variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <Input
                value={variant.name}
                onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                className="col-span-5"
                placeholder="变体名称"
              />
              <div className="col-span-3 flex items-center space-x-2">
                <Label htmlFor={`weight-${index}`} className="whitespace-nowrap">
                  权重:
                </Label>
                <Input
                  id={`weight-${index}`}
                  type="number"
                  min="1"
                  value={variant.weight || 1}
                  onChange={(e) => handleVariantChange(index, "weight", Number.parseInt(e.target.value))}
                />
              </div>
              <Input
                value={variant.id}
                onChange={(e) => handleVariantChange(index, "id", e.target.value)}
                className="col-span-3"
                placeholder="变体ID"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeVariant(index)}
                disabled={formData.variants.length <= 2}
                className="col-span-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSubmit}>{experiment ? "保存更改" : "创建实验"}</Button>
      </DialogFooter>
    </>
  )
}

interface ExperimentResultsProps {
  experiment: Experiment
}

function ExperimentResults({ experiment }: ExperimentResultsProps) {
  const [results, setResults] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    // 获取实验结果
    const experimentResults = getExperimentResults(experiment.id)

    // 转换为图表数据
    // 实际应用中应从API获取更详细的数据
    const chartData = experiment.variants.map((variant) => ({
      name: variant.name,
      conversions: Math.floor(Math.random() * 100),
      conversionRate: (Math.random() * 10).toFixed(2),
    }))

    setResults(chartData)
  }, [experiment.id])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{experiment.name}</h2>
          <p className="text-muted-foreground">实验ID: {experiment.id}</p>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择时间范围" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">过去24小时</SelectItem>
            <SelectItem value="7d">过去7天</SelectItem>
            <SelectItem value="30d">过去30天</SelectItem>
            <SelectItem value="all">全部时间</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">总样本量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">+12.3% 相比上期</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">总转化数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">328</div>
            <p className="text-xs text-muted-foreground">+5.7% 相比上期</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">平均转化率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26.3%</div>
            <p className="text-xs text-muted-foreground">+2.1% 相比上期</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>转化率对比</CardTitle>
          <CardDescription>各变体的转化率对比</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer
            config={{
              conversionRate: {
                label: "转化率 (%)",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="conversionRate" fill="var(--color-conversionRate)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>变体性能详情</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>变体</TableHead>
                <TableHead>样本量</TableHead>
                <TableHead>转化数</TableHead>
                <TableHead>转化率</TableHead>
                <TableHead>提升</TableHead>
                <TableHead>置信度</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiment.variants.map((variant, index) => {
                const isControl = index === 0
                const conversionRate = Number.parseFloat((Math.random() * 10).toFixed(2))
                const lift = isControl ? "-" : `+${(Math.random() * 15).toFixed(2)}%`
                const confidence = isControl ? "-" : `${(Math.random() * 100).toFixed(1)}%`

                return (
                  <TableRow key={variant.id}>
                    <TableCell className="font-medium">
                      {variant.name}
                      {isControl && (
                        <Badge variant="outline" className="ml-2">
                          对照组
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{Math.floor(Math.random() * 1000)}</TableCell>
                    <TableCell>{Math.floor(Math.random() * 300)}</TableCell>
                    <TableCell>{conversionRate}%</TableCell>
                    <TableCell>{lift}</TableCell>
                    <TableCell>{confidence}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

interface InsightsTabProps {
  experiments: Experiment[]
}

function InsightsTab({ experiments }: InsightsTabProps) {
  // 模拟数据 - 实际应用中应从API获取
  const experimentPerformanceData = [
    { name: "实验1", conversionRate: 5.2, lift: 12.3 },
    { name: "实验2", conversionRate: 4.8, lift: 8.7 },
    { name: "实验3", conversionRate: 6.1, lift: 15.2 },
    { name: "实验4", conversionRate: 3.9, lift: 5.1 },
    { name: "实验5", conversionRate: 5.5, lift: 10.8 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">数据洞察</h2>
        <p className="text-muted-foreground">跨实验的综合分析和洞察</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>实验性能对比</CardTitle>
            <CardDescription>各实验的转化率提升对比</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              config={{
                lift: {
                  label: "提升率 (%)",
                  color: "hsl(var(--chart-1))",
                },
                conversionRate: {
                  label: "转化率 (%)",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={experimentPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="lift" fill="var(--color-lift)" />
                  <Bar dataKey="conversionRate" fill="var(--color-conversionRate)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>实验趋势</CardTitle>
            <CardDescription>实验性能随时间的变化</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              config={{
                experiments: {
                  label: "实验数",
                  color: "hsl(var(--chart-1))",
                },
                avgLift: {
                  label: "平均提升率 (%)",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={[
                    { month: "1月", experiments: 2, avgLift: 5.2 },
                    { month: "2月", experiments: 3, avgLift: 6.8 },
                    { month: "3月", experiments: 5, avgLift: 8.1 },
                    { month: "4月", experiments: 4, avgLift: 7.5 },
                    { month: "5月", experiments: 6, avgLift: 9.2 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="experiments" stroke="var(--color-experiments)" />
                  <Line yAxisId="right" type="monotone" dataKey="avgLift" stroke="var(--color-avgLift)" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>关键发现</CardTitle>
          <CardDescription>基于实验数据的主要洞察</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium">UI变化影响转化率</h3>
              <p className="text-sm text-muted-foreground mt-1">
                UI相关实验平均提升转化率12.3%，显著高于其他类型实验。建议优先考虑UI优化。
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium">移动端性能更显著</h3>
              <p className="text-sm text-muted-foreground mt-1">
                移动端用户对性能优化更敏感，性能改进实验在移动端的提升率平均高出15.7%。
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium">简化流程效果明显</h3>
              <p className="text-sm text-muted-foreground mt-1">
                减少步骤和简化流程的实验平均提升用户完成率18.2%，建议继续优化关键流程。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
