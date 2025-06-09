/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * 综合功能测试页面
 * ==========================================
 */

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestRunner } from "@/components/testing/test-runner"
import { ResponsiveTester } from "@/components/testing/responsive-tester"
import { DataOperationTester } from "@/components/testing/data-operation-tester"

export default function TestingPage() {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">综合测试</TabsTrigger>
          <TabsTrigger value="responsive">响应式测试</TabsTrigger>
          <TabsTrigger value="data">数据操作测试</TabsTrigger>
          <TabsTrigger value="manual">手动测试</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <TestRunner />
        </TabsContent>

        <TabsContent value="responsive">
          <ResponsiveTester />
        </TabsContent>

        <TabsContent value="data">
          <DataOperationTester />
        </TabsContent>

        <TabsContent value="manual">
          <div className="space-y-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">手动测试指南</h2>
              <div className="max-w-2xl mx-auto text-left space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">🔍 页面加载测试</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 检查所有页面是否能正常加载</li>
                    <li>• 验证页面标题和元数据</li>
                    <li>• 确认加载时间在合理范围内</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">🧭 导航测试</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 测试侧边栏导航链接</li>
                    <li>• 验证面包屑导航</li>
                    <li>• 检查快速操作按钮</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">💾 数据操作测试</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 测试创建、读取、更新、删除操作</li>
                    <li>• 验证数据持久化</li>
                    <li>• 检查表单验证</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">👆 用户交互测试</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 测试按钮点击响应</li>
                    <li>• 验证表单输入和提交</li>
                    <li>• 检查模态框和弹窗</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">📱 响应式测试</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 在不同设备尺寸下测试</li>
                    <li>• 验证触摸操作</li>
                    <li>• 检查布局适配</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
