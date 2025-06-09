"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle, Clock, AlertCircle, FileText, Eye, ChevronRight } from "lucide-react"

interface Policy {
  id: string
  title: string
  description: string
  category: string
  version: string
  lastUpdated: string
  reviewDate: string
  status: "active" | "under-review" | "draft"
  acknowledgementRequired: boolean
  acknowledgementStatus?: "acknowledged" | "pending" | "overdue"
  acknowledgementDate?: string
  content: string
}

export default function SecurityPolicies() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: "policy-1",
      title: "信息安全政策",
      description: "公司信息安全管理的总体框架和原则",
      category: "总体政策",
      version: "2.1",
      lastUpdated: "2023-10-15",
      reviewDate: "2024-10-15",
      status: "active",
      acknowledgementRequired: true,
      acknowledgementStatus: "acknowledged",
      acknowledgementDate: "2023-10-20",
      content: `# 信息安全政策

## 1. 目的

本政策旨在建立公司信息安全管理的总体框架，确保公司信息资产的机密性、完整性和可用性。

## 2. 适用范围

本政策适用于公司所有员工、承包商和第三方服务提供商。

## 3. 政策声明

3.1 公司致力于保护其信息资产免受内部和外部威胁。
3.2 所有员工必须遵守本政策及相关程序。
3.3 信息安全是每个员工的责任。

## 4. 安全组织

4.1 公司设立信息安全委员会，负责制定和监督安全策略。
4.2 信息安全官负责日常安全管理工作。

## 5. 资产管理

5.1 所有信息资产必须分类并指定责任人。
5.2 敏感信息必须按照分类级别进行保护。

## 6. 人员安全

6.1 所有员工必须接受安全意识培训。
6.2 员工离职时必须撤销所有访问权限。

## 7. 物理安全

7.1 关键设施必须实施适当的物理访问控制。
7.2 敏感区域必须监控和记录访问情况。

## 8. 通信与操作管理

8.1 所有系统必须实施安全控制措施。
8.2 必须定期备份关键数据。

## 9. 访问控制

9.1 访问权限基于"最小权限"原则。
9.2 所有用户必须使用强密码并定期更改。

## 10. 事件管理

10.1 所有安全事件必须报告和记录。
10.2 必须制定并测试事件响应计划。

## 11. 合规性

11.1 公司必须遵守所有适用的法律法规。
11.2 定期进行合规性审计。

## 12. 政策审查

本政策每年审查一次或在重大变更后进行审查。`,
    },
    {
      id: "policy-2",
      title: "密码管理政策",
      description: "密码创建、使用和管理的规定",
      category: "访问控制",
      version: "1.5",
      lastUpdated: "2023-09-05",
      reviewDate: "2024-09-05",
      status: "active",
      acknowledgementRequired: true,
      acknowledgementStatus: "acknowledged",
      acknowledgementDate: "2023-09-10",
      content: `# 密码管理政策

## 1. 目的

本政策旨在规范密码的创建、使用和管理，确保系统和数据的安全。

## 2. 适用范围

本政策适用于所有需要密码访问的系统和服务。

## 3. 密码要求

3.1 密码长度至少为12个字符。
3.2 密码必须包含大小写字母、数字和特殊字符。
3.3 不得使用容易猜测的信息（如生日、姓名等）。
3.4 不得重复使用最近使用过的5个密码。

## 4. 密码保护

4.1 禁止与他人共享密码。
4.2 禁止在未加密的文件或便签上记录密码。
4.3 建议使用经批准的密码管理工具。

## 5. 密码更改

5.1 系统密码必须每90天更改一次。
5.2 如怀疑密码泄露，必须立即更改。

## 6. 多因素认证

6.1 关键系统必须启用多因素认证。
6.2 远程访问必须使用多因素认证。

## 7. 默认密码

7.1 所有系统的默认密码必须在首次使用时更改。
7.2 临时密码必须在首次登录时更改。

## 8. 密码重置

8.1 密码重置必须通过安全的验证流程。
8.2 重置后的临时密码必须强制更改。

## 9. 监控与审计

9.1 系统必须记录密码更改和重置活动。
9.2 定期审查密码策略的合规性。

## 10. 例外情况

特殊情况下的例外必须经过信息安全官批准并记录。

## 11. 政策审查

本政策每年审查一次或在重大变更后进行审查。`,
    },
    {
      id: "policy-3",
      title: "数据分类与处理政策",
      description: "数据分类标准和各类数据的处理要求",
      category: "数据保护",
      version: "2.0",
      lastUpdated: "2023-11-20",
      reviewDate: "2024-11-20",
      status: "active",
      acknowledgementRequired: true,
      acknowledgementStatus: "pending",
      content: `# 数据分类与处理政策

## 1. 目的

本政策旨在建立数据分类标准，并规定各类数据的处理要求，确保数据得到适当保护。

## 2. 适用范围

本政策适用于公司创建、接收、存储、传输或处理的所有数据。

## 3. 数据分类

数据分为以下四类：

3.1 **机密数据**：未经授权披露可能导致严重损害的数据。
   - 示例：商业秘密、并购信息、未公开财务数据

3.2 **受限数据**：需要特殊保护的敏感数据。
   - 示例：个人身份信息、健康信息、支付卡数据

3.3 **内部数据**：仅供内部使用的数据。
   - 示例：内部通讯、非敏感业务文档、培训材料

3.4 **公开数据**：可自由分享的数据。
   - 示例：营销材料、公开声明、已发布的年报

## 4. 数据标记

4.1 所有文档必须根据其分类进行标记。
4.2 电子文档应在页眉、页脚或文件名中包含分类标记。
4.3 物理文档应在首页和末页标明分类。

## 5. 数据处理要求

### 5.1 机密数据
- 必须加密存储和传输
- 访问仅限于"需要知道"的授权人员
- 禁止存储在移动设备或云服务上，除非经特别批准
- 必须记录所有访问和处理活动

### 5.2 受限数据
- 必须加密传输，建议加密存储
- 访问仅限于业务需要的授权人员
- 存储在移动设备上时必须加密
- 必须记录关键处理活动

### 5.3 内部数据
- 建议加密传输
- 仅限公司内部访问
- 可存储在公司批准的设备和服务上
- 无需特殊记录处理活动

### 5.4 公开数据
- 无特殊安全要求
- 可自由分享和发布
- 发布前应确认其公开性质

## 6. 数据保留与销毁

6.1 数据必须按照数据保留政策保留。
6.2 超过保留期的数据必须安全销毁。
6.3 机密和受限数据的销毁必须记录并证明。

## 7. 数据共享

7.1 与第三方共享数据前必须评估风险。
7.2 与第三方共享机密或受限数据必须签署保密协议。
7.3 数据传输必须使用安全渠道。

## 8. 合规要求

8.1 必须遵守所有适用的数据保护法规。
8.2 定期审查数据处理活动的合规性。

## 9. 培训与意识

所有员工必须接受数据分类和处理培训。

## 10. 政策审查

本政策每年审查一次或在重大变更后进行审查。`,
    },
    {
      id: "policy-4",
      title: "移动设备安全政策",
      description: "移动设备使用和保护的规定",
      category: "设备安全",
      version: "1.2",
      lastUpdated: "2023-08-10",
      reviewDate: "2024-08-10",
      status: "active",
      acknowledgementRequired: true,
      acknowledgementStatus: "overdue",
      content: `# 移动设备安全政策

## 1. 目的

本政策旨在规范移动设备的使用和保护，降低与移动设备相关的安全风险。

## 2. 适用范围

本政策适用于所有用于访问公司资源的移动设备，包括但不限于笔记本电脑、平板电脑和智能手机。

## 3. 设备要求

3.1 所有移动设备必须：
   - 启用密码或生物识别保护
   - 配置自动锁定（最长15分钟不活动）
   - 安装并更新公司批准的安全软件
   - 保持操作系统和应用程序更新

3.2 公司拥有的设备：
   - 禁止安装未经批准的软件
   - 必须由IT部门管理和配置
   - 必须启用远程擦除功能

3.3 个人设备（BYOD）：
   - 必须在使用前向IT部门注册
   - 必须安装移动设备管理(MDM)软件
   - 公司数据必须与个人数据隔离

## 4. 数据保护

4.1 敏感数据：
   - 禁止在移动设备上存储机密数据，除非经特别批准
   - 受限数据必须加密存储
   - 禁止将敏感数据下载到未经批准的应用程序

4.2 数据备份：
   - 重要数据必须定期备份
   - 备份必须加密并安全存储

4.3 数据擦除：
   - 设备重新分配前必须完全擦除数据
   - 丢失或被盗设备必须远程擦除

## 5. 网络连接

5.1 无线网络：
   - 优先使用公司VPN
   - 避免使用不安全的公共Wi-Fi
   - 禁止使用未知或不安全的网络传输敏感数据

5.2 蓝牙和其他无线技术：
   - 不使用时应关闭
   - 设置为不可发现模式
   - 避免在公共场所配对设备

## 6. 应用程序安全

6.1 应用程序安装：
   - 仅从官方应用商店下载应用
   - 禁止安装来源不明的应用
   - 公司设备上的应用必须经IT部门批准

6.2 应用程序权限：
   - 定期审查应用程序权限
   - 限制应用程序访问敏感数据和功能

## 7. 设备丢失或被盗

7.1 所有设备丢失或被盗事件必须立即报告给IT部门和安全团队
7.2 必须尝试远程锁定和擦除设备
7.3 必须更改所有可能受影响的密码

## 8. 培训与意识

8.1 所有移动设备用户必须接受安全培训
8.2 定期提供安全提示和最佳实践更新

## 9. 合规与监控

9.1 IT部门有权监控和审计公司设备的使用情况
9.2 违反本政策可能导致纪律处分

## 10. 政策审查

本政策每年审查一次或在重大变更后进行审查。`,
    },
  ])

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // 根据确认状态筛选政策
  const filteredPolicies = policies.filter((policy) => {
    // 搜索筛选
    const matchesSearch =
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.category.toLowerCase().includes(searchTerm.toLowerCase())

    // 标签筛选
    if (activeTab === "all") return matchesSearch
    if (activeTab === "pending") return matchesSearch && policy.acknowledgementStatus === "pending"
    if (activeTab === "acknowledged") return matchesSearch && policy.acknowledgementStatus === "acknowledged"
    if (activeTab === "overdue") return matchesSearch && policy.acknowledgementStatus === "overdue"

    return matchesSearch
  })

  // 确认政策
  const acknowledgePolicy = (policyId: string) => {
    setPolicies(
      policies.map((policy) =>
        policy.id === policyId
          ? {
              ...policy,
              acknowledgementStatus: "acknowledged",
              acknowledgementDate: new Date().toISOString().split("T")[0],
            }
          : policy,
      ),
    )

    // 如果当前选中的是被确认的政策，更新选中的政策
    if (selectedPolicy && selectedPolicy.id === policyId) {
      setSelectedPolicy({
        ...selectedPolicy,
        acknowledgementStatus: "acknowledged",
        acknowledgementDate: new Date().toISOString().split("T")[0],
      })
    }
  }

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "acknowledged":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            已确认
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            待确认
          </Badge>
        )
      case "overdue":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <AlertCircle className="w-3 h-3 mr-1" />
            已逾期
          </Badge>
        )
      case "active":
        return <Badge className="bg-blue-500 hover:bg-blue-600">生效中</Badge>
      case "under-review":
        return <Badge className="bg-purple-500 hover:bg-purple-600">审核中</Badge>
      case "draft":
        return <Badge className="bg-gray-500 hover:bg-gray-600">草稿</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">安全政策管理</h1>

      {!selectedPolicy ? (
        <>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="搜索政策..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-full md:w-auto" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="pending">待确认</TabsTrigger>
                <TabsTrigger value="acknowledged">已确认</TabsTrigger>
                <TabsTrigger value="overdue">已逾期</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPolicies.map((policy) => (
              <Card key={policy.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{policy.title}</CardTitle>
                    {policy.acknowledgementRequired &&
                      policy.acknowledgementStatus &&
                      getStatusBadge(policy.acknowledgementStatus)}
                  </div>
                  <CardDescription>{policy.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">类别：</span>
                      {policy.category}
                    </div>
                    <div>
                      <span className="text-gray-500">版本：</span>
                      {policy.version}
                    </div>
                    <div>
                      <span className="text-gray-500">更新日期：</span>
                      {policy.lastUpdated}
                    </div>
                    <div>
                      <span className="text-gray-500">状态：</span>
                      {getStatusBadge(policy.status)}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedPolicy(policy)}>
                    <Eye className="w-4 h-4 mr-1" />
                    查看详情
                  </Button>
                  {policy.acknowledgementRequired && policy.acknowledgementStatus !== "acknowledged" && (
                    <Button size="sm" onClick={() => acknowledgePolicy(policy.id)}>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      确认政策
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredPolicies.length === 0 && (
            <div className="text-center py-10">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">未找到政策</h3>
              <p className="mt-1 text-gray-500">尝试使用不同的搜索词或筛选条件</p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => setSelectedPolicy(null)} className="mr-2">
                <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                返回
              </Button>
              <h2 className="text-xl font-semibold">{selectedPolicy.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              {selectedPolicy.acknowledgementRequired &&
                selectedPolicy.acknowledgementStatus &&
                getStatusBadge(selectedPolicy.acknowledgementStatus)}
              {selectedPolicy.acknowledgementRequired && selectedPolicy.acknowledgementStatus !== "acknowledged" && (
                <Button size="sm" onClick={() => acknowledgePolicy(selectedPolicy.id)}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  确认政策
                </Button>
              )}
            </div>
          </div>

          <div className="p-4 border-b bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">类别</span>
                {selectedPolicy.category}
              </div>
              <div>
                <span className="text-gray-500 block">版本</span>
                {selectedPolicy.version}
              </div>
              <div>
                <span className="text-gray-500 block">更新日期</span>
                {selectedPolicy.lastUpdated}
              </div>
              <div>
                <span className="text-gray-500 block">审核日期</span>
                {selectedPolicy.reviewDate}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="prose max-w-none">
              {selectedPolicy.content.split("\n").map((line, index) => {
                if (line.startsWith("# ")) {
                  return (
                    <h1 key={index} className="text-2xl font-bold mt-0 mb-4">
                      {line.substring(2)}
                    </h1>
                  )
                } else if (line.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-xl font-semibold mt-6 mb-3">
                      {line.substring(3)}
                    </h2>
                  )
                } else if (line.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-lg font-semibold mt-5 mb-2">
                      {line.substring(4)}
                    </h3>
                  )
                } else if (line.startsWith("- ")) {
                  return (
                    <li key={index} className="ml-6 mb-1">
                      {line.substring(2)}
                    </li>
                  )
                } else if (line.trim() === "") {
                  return <br key={index} />
                } else {
                  return (
                    <p key={index} className="mb-3">
                      {line}
                    </p>
                  )
                }
              })}
            </div>

            {selectedPolicy.acknowledgementRequired && (
              <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-2">政策确认</h3>
                <p className="text-sm text-gray-600 mb-4">
                  通过确认此政策，您表示已阅读并理解上述政策内容，并同意遵守其中的规定。
                </p>
                {selectedPolicy.acknowledgementStatus === "acknowledged" ? (
                  <div className="text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>您已于 {selectedPolicy.acknowledgementDate} 确认此政策</span>
                  </div>
                ) : (
                  <Button onClick={() => acknowledgePolicy(selectedPolicy.id)}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    确认政策
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
