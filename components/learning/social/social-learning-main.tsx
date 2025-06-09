/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 社交学习主组件
 * ==========================================
 */

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageCircle, Trophy, UserPlus } from "lucide-react"
import { StudyGroups } from "./study-groups"
import { LearningFeed } from "./learning-feed"
import { StudyBuddies } from "./study-buddies"

export function SocialLearningMain() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">社交学习</h1>
        <p className="text-muted-foreground">与学习伙伴一起成长，分享知识，互相激励</p>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            学习动态
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            学习小组
          </TabsTrigger>
          <TabsTrigger value="buddies" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            学习伙伴
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            学习挑战
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <LearningFeed />
        </TabsContent>

        <TabsContent value="groups">
          <StudyGroups />
        </TabsContent>

        <TabsContent value="buddies">
          <StudyBuddies />
        </TabsContent>

        <TabsContent value="challenges">
          <div className="text-center py-12">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">学习挑战功能开发中</h3>
            <p className="text-muted-foreground">敬请期待更多有趣的学习挑战活动！</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
