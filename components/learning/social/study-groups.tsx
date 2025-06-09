/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 学习小组组件
 * ==========================================
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Plus, Search, Crown, Shield, User, Calendar, Target, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import {
  YYGetStudyGroups,
  YYCreateStudyGroup,
  YYJoinStudyGroup,
  YYGetGroupMembers,
} from "@/lib/social-learning-manager"
import type { StudyGroup, GroupMember, StudyGroupCategory } from "@/types/social-learning"

export function StudyGroups() {
  const [groups, setGroups] = useState<StudyGroup[]>([])
  const [filteredGroups, setFilteredGroups] = useState<StudyGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null)
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [loading, setLoading] = useState(true)

  // 新建小组表单
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    category: "技术" as StudyGroupCategory,
    type: "public" as "public" | "private" | "invite_only",
    maxMembers: 50,
    tags: [] as string[],
    rules: [] as string[],
    goals: [] as string[],
  })

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const groupsData = await YYGetStudyGroups()
        setGroups(groupsData)
        setFilteredGroups(groupsData)
      } catch (error) {
        console.error("加载学习小组失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // 筛选小组
  useEffect(() => {
    let filtered = groups

    if (searchTerm) {
      filtered = filtered.filter(
        (group) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((group) => group.category === filterCategory)
    }

    setFilteredGroups(filtered)
  }, [groups, searchTerm, filterCategory])

  // 查看小组详情
  const handleViewGroup = async (group: StudyGroup) => {
    setSelectedGroup(group)
    try {
      const members = await YYGetGroupMembers(group.id)
      setGroupMembers(members)
    } catch (error) {
      console.error("加载小组成员失败:", error)
    }
  }

  // 加入小组
  const handleJoinGroup = async (groupId: string) => {
    try {
      const success = await YYJoinStudyGroup(groupId)
      if (success) {
        // 重新加载数据
        const groupsData = await YYGetStudyGroups()
        setGroups(groupsData)
        setFilteredGroups(groupsData)

        // 如果当前查看的是这个小组，重新加载成员
        if (selectedGroup?.id === groupId) {
          const members = await YYGetGroupMembers(groupId)
          setGroupMembers(members)
        }
      }
    } catch (error) {
      console.error("加入小组失败:", error)
    }
  }

  // 创建小组
  const handleCreateGroup = async () => {
    try {
      await YYCreateStudyGroup({
        ...newGroup,
        isActive: true,
      })

      // 重新加载数据
      const groupsData = await YYGetStudyGroups()
      setGroups(groupsData)
      setFilteredGroups(groupsData)

      // 重置表单
      setNewGroup({
        name: "",
        description: "",
        category: "技术",
        type: "public",
        maxMembers: 50,
        tags: [],
        rules: [],
        goals: [],
      })
      setShowCreateDialog(false)
    } catch (error) {
      console.error("创建小组失败:", error)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "admin":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "public":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "private":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "invite_only":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            学习小组
          </h2>
          <p className="text-muted-foreground">加入学习小组，与志同道合的伙伴一起成长</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              创建小组
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>创建学习小组</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">小组名称</label>
                <Input
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="输入小组名称"
                />
              </div>
              <div>
                <label className="text-sm font-medium">小组描述</label>
                <Input
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="描述小组的目标和内容"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">分类</label>
                  <Select
                    value={newGroup.category}
                    onValueChange={(value) => setNewGroup({ ...newGroup, category: value as StudyGroupCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="技术">技术</SelectItem>
                      <SelectItem value="语言">语言</SelectItem>
                      <SelectItem value="职业发展">职业发展</SelectItem>
                      <SelectItem value="兴趣爱好">兴趣爱好</SelectItem>
                      <SelectItem value="考试备考">考试备考</SelectItem>
                      <SelectItem value="技能提升">技能提升</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">类型</label>
                  <Select
                    value={newGroup.type}
                    onValueChange={(value) =>
                      setNewGroup({ ...newGroup, type: value as "public" | "private" | "invite_only" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">公开</SelectItem>
                      <SelectItem value="private">私密</SelectItem>
                      <SelectItem value="invite_only">仅邀请</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateGroup} disabled={!newGroup.name || !newGroup.description}>
                  创建小组
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索学习小组..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有分类</SelectItem>
            <SelectItem value="技术">技术</SelectItem>
            <SelectItem value="语言">语言</SelectItem>
            <SelectItem value="职业发展">职业发展</SelectItem>
            <SelectItem value="兴趣爱好">兴趣爱好</SelectItem>
            <SelectItem value="考试备考">考试备考</SelectItem>
            <SelectItem value="技能提升">技能提升</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 小组列表 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1">{group.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{group.description}</CardDescription>
                </div>
                <Badge className={getTypeColor(group.type)}>
                  {group.type === "public" ? "公开" : group.type === "private" ? "私密" : "仅邀请"}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {group.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {group.memberCount}/{group.maxMembers} 成员
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(group.createdAt, "MM月dd日", { locale: zhCN })}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewGroup(group)}>
                    查看详情
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => handleJoinGroup(group.id)}>
                    加入小组
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 小组详情对话框 */}
      {selectedGroup && (
        <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {selectedGroup.name}
              </DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="members">成员</TabsTrigger>
                <TabsTrigger value="goals">目标</TabsTrigger>
                <TabsTrigger value="rules">规则</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">小组描述</h4>
                  <p className="text-muted-foreground">{selectedGroup.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">基本信息</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>分类:</span>
                        <Badge variant="outline">{selectedGroup.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>类型:</span>
                        <Badge className={getTypeColor(selectedGroup.type)}>
                          {selectedGroup.type === "public"
                            ? "公开"
                            : selectedGroup.type === "private"
                              ? "私密"
                              : "仅邀请"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>成员:</span>
                        <span>
                          {selectedGroup.memberCount}/{selectedGroup.maxMembers}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>创建时间:</span>
                        <span>{format(selectedGroup.createdAt, "yyyy年MM月dd日", { locale: zhCN })}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">标签</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedGroup.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="members" className="space-y-4">
                <div className="grid gap-3">
                  {groupMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{member.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.username}</span>
                            {getRoleIcon(member.role)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            加入时间: {format(member.joinedAt, "MM月dd日", { locale: zhCN })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          <span>{member.contributionScore} 贡献分</span>
                        </div>
                        <div className="text-muted-foreground">连续 {member.studyStreak} 天</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="goals" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">学习目标</h4>
                  <div className="space-y-2">
                    {selectedGroup.goals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span>{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rules" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">小组规则</h4>
                  <div className="space-y-2">
                    {selectedGroup.rules?.map((rule, index) => (
                      <div key={index} className="flex items-start gap-2 p-2">
                        <span className="text-muted-foreground">{index + 1}.</span>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">暂无学习小组</h3>
          <p className="text-muted-foreground">创建第一个学习小组，开始社交学习之旅！</p>
          <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            创建小组
          </Button>
        </div>
      )}
    </div>
  )
}
