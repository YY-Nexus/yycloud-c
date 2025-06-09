"use client"

import { useState } from "react"
import { BookOpen, CheckCircle, Clock, Play, Award, ArrowRight, FileText, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface Course {
  id: string
  title: string
  description: string
  duration: string
  level: "初级" | "中级" | "高级"
  category: string
  progress: number
  completed: boolean
  modules: {
    id: string
    title: string
    duration: string
    type: "video" | "article" | "quiz"
    completed: boolean
  }[]
}

export default function SecurityTraining() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "course-1",
      title: "网络安全基础",
      description: "了解网络安全的基本概念和最佳实践",
      duration: "2小时",
      level: "初级",
      category: "网络安全",
      progress: 100,
      completed: true,
      modules: [
        {
          id: "module-1-1",
          title: "网络安全简介",
          duration: "15分钟",
          type: "video",
          completed: true,
        },
        {
          id: "module-1-2",
          title: "常见网络威胁",
          duration: "20分钟",
          type: "article",
          completed: true,
        },
        {
          id: "module-1-3",
          title: "基本防护措施",
          duration: "25分钟",
          type: "video",
          completed: true,
        },
        {
          id: "module-1-4",
          title: "知识测验",
          duration: "10分钟",
          type: "quiz",
          completed: true,
        },
      ],
    },
    {
      id: "course-2",
      title: "密码安全与管理",
      description: "学习如何创建和管理安全的密码",
      duration: "1.5小时",
      level: "初级",
      category: "身份认证",
      progress: 60,
      completed: false,
      modules: [
        {
          id: "module-2-1",
          title: "密码安全原则",
          duration: "20分钟",
          type: "video",
          completed: true,
        },
        {
          id: "module-2-2",
          title: "密码管理工具",
          duration: "15分钟",
          type: "article",
          completed: true,
        },
        {
          id: "module-2-3",
          title: "多因素认证",
          duration: "20分钟",
          type: "video",
          completed: false,
        },
        {
          id: "module-2-4",
          title: "知识测验",
          duration: "10分钟",
          type: "quiz",
          completed: false,
        },
      ],
    },
    {
      id: "course-3",
      title: "社会工程学攻击防范",
      description: "识别和防范社会工程学攻击",
      duration: "2.5小时",
      level: "中级",
      category: "威胁防范",
      progress: 30,
      completed: false,
      modules: [
        {
          id: "module-3-1",
          title: "社会工程学简介",
          duration: "20分钟",
          type: "video",
          completed: true,
        },
        {
          id: "module-3-2",
          title: "钓鱼攻击识别",
          duration: "25分钟",
          type: "article",
          completed: true,
        },
        {
          id: "module-3-3",
          title: "预防措施",
          duration: "30分钟",
          type: "video",
          completed: false,
        },
        {
          id: "module-3-4",
          title: "案例分析",
          duration: "20分钟",
          type: "article",
          completed: false,
        },
        {
          id: "module-3-5",
          title: "知识测验",
          duration: "15分钟",
          type: "quiz",
          completed: false,
        },
      ],
    },
    {
      id: "course-4",
      title: "数据保护与隐私",
      description: "了解数据保护原则和隐私保护措施",
      duration: "3小时",
      level: "中级",
      category: "数据安全",
      progress: 0,
      completed: false,
      modules: [
        {
          id: "module-4-1",
          title: "数据保护基础",
          duration: "25分钟",
          type: "video",
          completed: false,
        },
        {
          id: "module-4-2",
          title: "数据分类",
          duration: "20分钟",
          type: "article",
          completed: false,
        },
        {
          id: "module-4-3",
          title: "加密技术",
          duration: "30分钟",
          type: "video",
          completed: false,
        },
        {
          id: "module-4-4",
          title: "隐私法规概述",
          duration: "25分钟",
          type: "article",
          completed: false,
        },
        {
          id: "module-4-5",
          title: "知识测验",
          duration: "15分钟",
          type: "quiz",
          completed: false,
        },
      ],
    },
    {
      id: "course-5",
      title: "高级网络安全",
      description: "深入了解网络安全架构和防护策略",
      duration: "4小时",
      level: "高级",
      category: "网络安全",
      progress: 0,
      completed: false,
      modules: [
        {
          id: "module-5-1",
          title: "网络安全架构",
          duration: "30分钟",
          type: "video",
          completed: false,
        },
        {
          id: "module-5-2",
          title: "高级防火墙配置",
          duration: "35分钟",
          type: "article",
          completed: false,
        },
        {
          id: "module-5-3",
          title: "入侵检测系统",
          duration: "40分钟",
          type: "video",
          completed: false,
        },
        {
          id: "module-5-4",
          title: "安全监控",
          duration: "30分钟",
          type: "article",
          completed: false,
        },
        {
          id: "module-5-5",
          title: "实战演练",
          duration: "45分钟",
          type: "video",
          completed: false,
        },
        {
          id: "module-5-6",
          title: "知识测验",
          duration: "20分钟",
          type: "quiz",
          completed: false,
        },
      ],
    },
  ])

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showCourseDialog, setShowCourseDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const completedCourses = courses.filter((course) => course.completed)
  const inProgressCourses = courses.filter((course) => !course.completed && course.progress > 0)
  const notStartedCourses = courses.filter((course) => !course.completed && course.progress === 0)

  const totalProgress =
    courses.length > 0 ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length) : 0

  const openCourseDialog = (course: Course) => {
    setSelectedCourse(course)
    setShowCourseDialog(true)
  }

  const getModuleIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "article":
        return <FileText className="h-4 w-4" />
      case "quiz":
        return <BookOpen className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "初级":
        return "bg-green-500"
      case "中级":
        return "bg-blue-500"
      case "高级":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const markModuleComplete = (courseId: string, moduleId: string) => {
    setCourses(
      courses.map((course) => {
        if (course.id === courseId) {
          const updatedModules = course.modules.map((module) => {
            if (module.id === moduleId) {
              return { ...module, completed: true }
            }
            return module
          })

          const completedModulesCount = updatedModules.filter((m) => m.completed).length
          const progress = Math.round((completedModulesCount / course.modules.length) * 100)
          const completed = progress === 100

          return {
            ...course,
            modules: updatedModules,
            progress,
            completed,
          }
        }
        return course
      }),
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">安全培训中心</h1>
        <p className="text-muted-foreground">提高您的安全意识和技能，保护您的数字资产</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>学习进度</CardTitle>
            <CardDescription>
              您已完成 {completedCourses.length} 个课程，共 {courses.length} 个
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>总体进度</span>
                <span>{totalProgress}%</span>
              </div>
              <Progress value={totalProgress} className="h-2" />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                    <div className="text-2xl font-bold">{completedCourses.length}</div>
                    <div className="text-sm text-muted-foreground">已完成课程</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Clock className="h-8 w-8 text-blue-500 mb-2" />
                    <div className="text-2xl font-bold">{inProgressCourses.length}</div>
                    <div className="text-sm text-muted-foreground">进行中课程</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <BookOpen className="h-8 w-8 text-orange-500 mb-2" />
                    <div className="text-2xl font-bold">{notStartedCourses.length}</div>
                    <div className="text-sm text-muted-foreground">未开始课程</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>推荐课程</CardTitle>
            <CardDescription>根据您的角色和进度推荐</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inProgressCourses.length > 0 ? (
                <div>
                  <h3 className="font-medium mb-2">继续学习</h3>
                  {inProgressCourses.slice(0, 1).map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <h4 className="font-medium">{course.title}</h4>
                          <Progress value={course.progress} className="h-1.5" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>进度: {course.progress}%</span>
                            <span>{course.duration}</span>
                          </div>
                          <Button variant="outline" className="w-full mt-2" onClick={() => openCourseDialog(course)}>
                            继续学习
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : null}

              <div>
                <h3 className="font-medium mb-2">建议学习</h3>
                {notStartedCourses.slice(0, 2).map((course) => (
                  <Card key={course.id} className="overflow-hidden mb-3">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{course.title}</h4>
                          <Badge variant="outline">{course.level}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{course.description}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{course.category}</span>
                          <span>{course.duration}</span>
                        </div>
                        <Button variant="outline" className="w-full mt-2" onClick={() => openCourseDialog(course)}>
                          开始学习
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">所有课程</TabsTrigger>
          <TabsTrigger value="in-progress">进行中 ({inProgressCourses.length})</TabsTrigger>
          <TabsTrigger value="completed">已完成 ({completedCourses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    {course.progress > 0 && (
                      <>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>进度: {course.progress}%</span>
                          <span>{course.completed ? "已完成" : "进行中"}</span>
                        </div>
                        <Progress value={course.progress} className="h-1.5" />
                      </>
                    )}
                    <div className="flex justify-between text-sm mt-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{course.modules.length} 个模块</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={course.progress > 0 ? "default" : "outline"}
                    className="w-full"
                    onClick={() => openCourseDialog(course)}
                  >
                    {course.completed ? "查看课程" : course.progress > 0 ? "继续学习" : "开始学习"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in-progress">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.length > 0 ? (
              inProgressCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>进度: {course.progress}%</span>
                        <span>进行中</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                      <div className="flex justify-between text-sm mt-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>{course.modules.length} 个模块</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => openCourseDialog(course)}>
                      继续学习
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">没有进行中的课程</h3>
                <p className="text-muted-foreground mt-2">从"所有课程"中选择一个开始学习</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.length > 0 ? (
              completedCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>进度: 100%</span>
                        <span className="text-green-500">已完成</span>
                      </div>
                      <Progress value={100} className="h-1.5" />
                      <div className="flex justify-between text-sm mt-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span>已获得证书</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => openCourseDialog(course)}>
                      查看课程
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">没有已完成的课程</h3>
                <p className="text-muted-foreground mt-2">完成课程后将在此处显示</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 课程详情对话框 */}
      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent className="sm:max-w-3xl">
          {selectedCourse && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle>{selectedCourse.title}</DialogTitle>
                  <Badge variant="outline">{selectedCourse.level}</Badge>
                </div>
                <DialogDescription>{selectedCourse.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCourse.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCourse.modules.length} 个模块</span>
                    </div>
                  </div>
                  <Badge>{selectedCourse.category}</Badge>
                </div>

                {selectedCourse.progress > 0 && !selectedCourse.completed && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>课程进度: {selectedCourse.progress}%</span>
                      <span>进行中</span>
                    </div>
                    <Progress value={selectedCourse.progress} className="h-2" />
                  </div>
                )}

                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {selectedCourse.modules.map((module, index) => (
                      <Card key={module.id} className={module.completed ? "border-green-200" : ""}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium">{module.title}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{module.duration}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    {getModuleIcon(module.type)}
                                    <span>
                                      {module.type === "video" ? "视频" : module.type === "article" ? "文章" : "测验"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              {module.completed ? (
                                <Badge variant="outline" className="bg-green-50">
                                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                  已完成
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markModuleComplete(selectedCourse.id, module.id)}
                                >
                                  {module.type === "video" ? (
                                    <>
                                      <Play className="h-3 w-3 mr-1" />
                                      观看
                                    </>
                                  ) : module.type === "article" ? (
                                    <>
                                      <FileText className="h-3 w-3 mr-1" />
                                      阅读
                                    </>
                                  ) : (
                                    <>
                                      <BookOpen className="h-3 w-3 mr-1" />
                                      开始测验
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
