"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import {
  Plus,
  Save,
  Share,
  Eye,
  Edit,
  Trash2,
  GripVertical,
  BarChart3,
  Activity,
  Users,
  Clock,
  TrendingUp,
} from "lucide-react"

interface Widget {
  id: string
  type: "metric" | "chart" | "table" | "text"
  title: string
  description?: string
  config: any
  position: { x: number; y: number; w: number; h: number }
}

interface Dashboard {
  id: string
  name: string
  description: string
  widgets: Widget[]
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
}

const WIDGET_TYPES = [
  {
    type: "metric",
    name: "指标卡片",
    icon: Activity,
    description: "显示单个关键指标",
  },
  {
    type: "chart",
    name: "图表",
    icon: BarChart3,
    description: "各种类型的数据图表",
  },
  {
    type: "table",
    name: "数据表格",
    icon: Users,
    description: "表格形式的数据展示",
  },
  {
    type: "text",
    name: "文本组件",
    icon: Clock,
    description: "自定义文本和说明",
  },
]

export function DashboardBuilder() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    {
      id: "dashboard1",
      name: "网络性能概览",
      description: "网络测试数据的综合分析",
      widgets: [
        {
          id: "widget1",
          type: "metric",
          title: "平均下载速度",
          config: { value: "125.6", unit: "Mbps", trend: "+12%" },
          position: { x: 0, y: 0, w: 3, h: 2 },
        },
        {
          id: "widget2",
          type: "metric",
          title: "平均上传速度",
          config: { value: "45.2", unit: "Mbps", trend: "+8%" },
          position: { x: 3, y: 0, w: 3, h: 2 },
        },
        {
          id: "widget3",
          type: "chart",
          title: "速度趋势",
          config: { chartType: "line", dataSource: "network_tests" },
          position: { x: 0, y: 2, w: 6, h: 4 },
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
    },
  ])

  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(dashboards[0])
  const [isEditing, setIsEditing] = useState(false)
  const [showWidgetDialog, setShowWidgetDialog] = useState(false)
  const [selectedWidgetType, setSelectedWidgetType] = useState<string>("")

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !selectedDashboard) return

    const widgets = Array.from(selectedDashboard.widgets)
    const [reorderedWidget] = widgets.splice(result.source.index, 1)
    widgets.splice(result.destination.index, 0, reorderedWidget)

    setSelectedDashboard({
      ...selectedDashboard,
      widgets,
      updatedAt: new Date(),
    })
  }

  const addWidget = (type: string) => {
    if (!selectedDashboard) return

    const newWidget: Widget = {
      id: `widget_${Date.now()}`,
      type: type as any,
      title: `新${WIDGET_TYPES.find((t) => t.type === type)?.name}`,
      config: getDefaultConfig(type),
      position: { x: 0, y: 0, w: 3, h: 2 },
    }

    setSelectedDashboard({
      ...selectedDashboard,
      widgets: [...selectedDashboard.widgets, newWidget],
      updatedAt: new Date(),
    })

    setShowWidgetDialog(false)
    setSelectedWidgetType("")
  }

  const getDefaultConfig = (type: string) => {
    switch (type) {
      case "metric":
        return { value: "0", unit: "", trend: "" }
      case "chart":
        return { chartType: "bar", dataSource: "" }
      case "table":
        return { dataSource: "", columns: [] }
      case "text":
        return { content: "请输入文本内容" }
      default:
        return {}
    }
  }

  const removeWidget = (widgetId: string) => {
    if (!selectedDashboard) return

    setSelectedDashboard({
      ...selectedDashboard,
      widgets: selectedDashboard.widgets.filter((w) => w.id !== widgetId),
      updatedAt: new Date(),
    })
  }

  const saveDashboard = () => {
    if (!selectedDashboard) return

    setDashboards((prev) => prev.map((d) => (d.id === selectedDashboard.id ? selectedDashboard : d)))
    setIsEditing(false)
  }

  const renderWidget = (widget: Widget, index: number) => {
    const WidgetIcon = WIDGET_TYPES.find((t) => t.type === widget.type)?.icon || Activity

    return (
      <Draggable key={widget.id} draggableId={widget.id} index={index} isDragDisabled={!isEditing}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`relative ${snapshot.isDragging ? "shadow-lg" : ""} ${
              isEditing ? "border-dashed border-2" : ""
            }`}
          >
            {isEditing && (
              <div className="absolute top-2 right-2 flex gap-1">
                <Button size="sm" variant="ghost" {...provided.dragHandleProps}>
                  <GripVertical className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => removeWidget(widget.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <WidgetIcon className="h-4 w-4" />
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {widget.type === "metric" && (
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {widget.config.value} {widget.config.unit}
                  </div>
                  {widget.config.trend && (
                    <Badge variant="outline" className="text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {widget.config.trend}
                    </Badge>
                  )}
                </div>
              )}

              {widget.type === "chart" && (
                <div className="h-32 flex items-center justify-center bg-muted/20 rounded">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm">图表预览</div>
                  </div>
                </div>
              )}

              {widget.type === "table" && (
                <div className="h-32 flex items-center justify-center bg-muted/20 rounded">
                  <div className="text-center text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm">表格预览</div>
                  </div>
                </div>
              )}

              {widget.type === "text" && <div className="text-sm text-muted-foreground">{widget.config.content}</div>}
            </CardContent>
          </Card>
        )}
      </Draggable>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">仪表盘构建器</h2>
          <p className="text-muted-foreground">创建和自定义您的数据仪表盘</p>
        </div>
        <div className="flex gap-2">
          {selectedDashboard && (
            <>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                预览
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                分享
              </Button>
              {isEditing ? (
                <Button onClick={saveDashboard}>
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  编辑
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 仪表盘列表 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>我的仪表盘</CardTitle>
            <CardDescription>选择要编辑的仪表盘</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {dashboards.map((dashboard) => (
              <div
                key={dashboard.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedDashboard?.id === dashboard.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => setSelectedDashboard(dashboard)}
              >
                <h4 className="font-medium">{dashboard.name}</h4>
                <p className="text-sm text-muted-foreground">{dashboard.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline">{dashboard.widgets.length} 组件</Badge>
                  {dashboard.isPublic && <Badge variant="secondary">公开</Badge>}
                </div>
              </div>
            ))}

            <Button className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              新建仪表盘
            </Button>
          </CardContent>
        </Card>

        {/* 仪表盘编辑区域 */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedDashboard?.name}</CardTitle>
                <CardDescription>{selectedDashboard?.description}</CardDescription>
              </div>
              {isEditing && (
                <Dialog open={showWidgetDialog} onOpenChange={setShowWidgetDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      添加组件
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>添加组件</DialogTitle>
                      <DialogDescription>选择要添加的组件类型</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      {WIDGET_TYPES.map((widgetType) => {
                        const Icon = widgetType.icon
                        return (
                          <Card
                            key={widgetType.type}
                            className={`cursor-pointer transition-colors ${
                              selectedWidgetType === widgetType.type
                                ? "border-primary bg-primary/5"
                                : "hover:bg-muted/50"
                            }`}
                            onClick={() => setSelectedWidgetType(widgetType.type)}
                          >
                            <CardContent className="p-4 text-center">
                              <Icon className="h-8 w-8 mx-auto mb-2" />
                              <h4 className="font-medium">{widgetType.name}</h4>
                              <p className="text-sm text-muted-foreground">{widgetType.description}</p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                    <DialogFooter>
                      <Button onClick={() => addWidget(selectedWidgetType)} disabled={!selectedWidgetType}>
                        添加组件
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedDashboard && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="dashboard">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {selectedDashboard.widgets.map((widget, index) => renderWidget(widget, index))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}

            {!selectedDashboard && (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">选择仪表盘</h3>
                <p className="text-muted-foreground">选择一个仪表盘开始编辑，或创建新的仪表盘</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
