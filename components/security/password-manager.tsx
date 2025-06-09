"use client"

import { useState, useEffect } from "react"
import { Key, Plus, Eye, EyeOff, Copy, RefreshCw, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  getPasswordEntries,
  addPasswordEntry,
  updatePasswordEntry,
  deletePasswordEntry,
  generatePassword,
  calculatePasswordStrength,
} from "@/lib/security-manager"
import type { PasswordEntry } from "@/types/security"
import { toast } from "@/components/ui/use-toast"

export function PasswordManager() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showGeneratorDialog, setShowGeneratorDialog] = useState(false)
  const [currentPassword, setCurrentPassword] = useState<PasswordEntry | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})

  // 新密码表单状态
  const [newPassword, setNewPassword] = useState({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
  })

  // 密码生成器状态
  const [generatorOptions, setGeneratorOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [generatedStrength, setGeneratedStrength] = useState(0)

  // 加载密码
  useEffect(() => {
    const loadedPasswords = getPasswordEntries()
    setPasswords(loadedPasswords)
  }, [])

  // 过滤密码
  const filteredPasswords = passwords.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.url && entry.url.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // 获取强度颜色
  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "bg-green-500"
    if (strength >= 60) return "bg-yellow-500"
    if (strength >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  // 获取强度文本
  const getStrengthText = (strength: number) => {
    if (strength >= 80) return "强"
    if (strength >= 60) return "中"
    if (strength >= 40) return "弱"
    return "非常弱"
  }

  // 切换密码可见性
  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // 复制到剪贴板
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "复制成功",
          description: `${type}已复制到剪贴板`,
        })
      })
      .catch(() => {
        toast({
          title: "复制失败",
          description: "无法访问剪贴板",
          variant: "destructive",
        })
      })
  }

  // 添加新密码
  const handleAddPassword = () => {
    if (!newPassword.title || !newPassword.username || !newPassword.password) {
      toast({
        title: "无法保存",
        description: "标题、用户名和密码为必填项",
        variant: "destructive",
      })
      return
    }

    const updatedPasswords = addPasswordEntry(newPassword)
    setPasswords(updatedPasswords)
    setNewPassword({
      title: "",
      username: "",
      password: "",
      url: "",
      notes: "",
    })
    setShowAddDialog(false)

    toast({
      title: "添加成功",
      description: "密码已安全保存",
    })
  }

  // 更新密码
  const handleUpdatePassword = () => {
    if (!currentPassword) return

    const updatedPasswords = updatePasswordEntry(currentPassword.id, currentPassword)
    setPasswords(updatedPasswords)
    setCurrentPassword(null)
    setShowEditDialog(false)

    toast({
      title: "更新成功",
      description: "密码已更新",
    })
  }

  // 删除密码
  const handleDeletePassword = (id: string) => {
    const updatedPasswords = deletePasswordEntry(id)
    setPasswords(updatedPasswords)

    toast({
      title: "删除成功",
      description: "密码已删除",
    })
  }

  // 生成新密码
  const handleGeneratePassword = () => {
    const password = generatePassword(generatorOptions.length, {
      uppercase: generatorOptions.uppercase,
      lowercase: generatorOptions.lowercase,
      numbers: generatorOptions.numbers,
      symbols: generatorOptions.symbols,
    })

    setGeneratedPassword(password)
    setGeneratedStrength(calculatePasswordStrength(password))
  }

  // 使用生成的密码
  const useGeneratedPassword = () => {
    if (showEditDialog && currentPassword) {
      setCurrentPassword({
        ...currentPassword,
        password: generatedPassword,
      })
    } else {
      setNewPassword({
        ...newPassword,
        password: generatedPassword,
      })
    }

    setShowGeneratorDialog(false)
  }

  // 初始化密码生成器
  useEffect(() => {
    if (showGeneratorDialog) {
      handleGeneratePassword()
    }
  }, [showGeneratorDialog, generatorOptions])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">密码管理器</CardTitle>
            <CardDescription>安全存储和管理您的密码</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowGeneratorDialog(true)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              生成密码
            </Button>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              添加密码
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="搜索密码..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {filteredPasswords.length === 0 ? (
            <div className="text-center py-8">
              <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {passwords.length === 0 ? "没有保存的密码" : "没有找到匹配的密码"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {passwords.length === 0 ? "添加您的第一个密码以安全地存储它" : "尝试使用不同的搜索词"}
              </p>
              {passwords.length === 0 && (
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加密码
                </Button>
              )}
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>标题</TableHead>
                    <TableHead>用户名</TableHead>
                    <TableHead>密码</TableHead>
                    <TableHead>强度</TableHead>
                    <TableHead>最后更新</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPasswords.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {entry.url ? (
                          <a
                            href={entry.url.startsWith("http") ? entry.url : `https://${entry.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center"
                          >
                            {entry.title}
                          </a>
                        ) : (
                          entry.title
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{entry.username}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(entry.username, "用户名")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{showPasswords[entry.id] ? entry.password : "••••••••••••"}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => togglePasswordVisibility(entry.id)}
                          >
                            {showPasswords[entry.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(entry.password, "密码")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={entry.strength} className={`h-2 w-16 ${getStrengthColor(entry.strength)}`} />
                          <span className="text-xs text-muted-foreground">{getStrengthText(entry.strength)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(entry.lastUpdated)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              操作
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentPassword(entry)
                                setShowEditDialog(true)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeletePassword(entry.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 添加密码对话框 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加新密码</DialogTitle>
            <DialogDescription>安全地存储您的账户信息</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                标题
              </Label>
              <Input
                id="title"
                value={newPassword.title}
                onChange={(e) => setNewPassword({ ...newPassword, title: e.target.value })}
                className="col-span-3"
                placeholder="例如：Gmail账户"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                用户名
              </Label>
              <Input
                id="username"
                value={newPassword.username}
                onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                className="col-span-3"
                placeholder="您的登录用户名或邮箱"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                密码
              </Label>
              <div className="col-span-3 flex space-x-2">
                <Input
                  id="password"
                  type={showPasswords["new"] ? "text" : "password"}
                  value={newPassword.password}
                  onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                  className="flex-1"
                  placeholder="您的密码"
                />
                <Button variant="outline" size="icon" onClick={() => togglePasswordVisibility("new")}>
                  {showPasswords["new"] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => setShowGeneratorDialog(true)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                网址
              </Label>
              <Input
                id="url"
                value={newPassword.url}
                onChange={(e) => setNewPassword({ ...newPassword, url: e.target.value })}
                className="col-span-3"
                placeholder="https://example.com（可选）"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                备注
              </Label>
              <Textarea
                id="notes"
                value={newPassword.notes}
                onChange={(e) => setNewPassword({ ...newPassword, notes: e.target.value })}
                className="col-span-3"
                placeholder="其他信息（可选）"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              取消
            </Button>
            <Button onClick={handleAddPassword}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑密码对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑密码</DialogTitle>
            <DialogDescription>更新您的账户信息</DialogDescription>
          </DialogHeader>
          {currentPassword && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  标题
                </Label>
                <Input
                  id="edit-title"
                  value={currentPassword.title}
                  onChange={(e) => setCurrentPassword({ ...currentPassword, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-username" className="text-right">
                  用户名
                </Label>
                <Input
                  id="edit-username"
                  value={currentPassword.username}
                  onChange={(e) => setCurrentPassword({ ...currentPassword, username: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-password" className="text-right">
                  密码
                </Label>
                <div className="col-span-3 flex space-x-2">
                  <Input
                    id="edit-password"
                    type={showPasswords["edit"] ? "text" : "password"}
                    value={currentPassword.password}
                    onChange={(e) => setCurrentPassword({ ...currentPassword, password: e.target.value })}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={() => togglePasswordVisibility("edit")}>
                    {showPasswords["edit"] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setShowGeneratorDialog(true)}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-url" className="text-right">
                  网址
                </Label>
                <Input
                  id="edit-url"
                  value={currentPassword.url || ""}
                  onChange={(e) => setCurrentPassword({ ...currentPassword, url: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-notes" className="text-right">
                  备注
                </Label>
                <Textarea
                  id="edit-notes"
                  value={currentPassword.notes || ""}
                  onChange={(e) => setCurrentPassword({ ...currentPassword, notes: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              取消
            </Button>
            <Button onClick={handleUpdatePassword}>更新</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 密码生成器对话框 */}
      <Dialog open={showGeneratorDialog} onOpenChange={setShowGeneratorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>密码生成器</DialogTitle>
            <DialogDescription>生成一个强密码以提高您的账户安全性</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>密码长度: {generatorOptions.length}</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setGeneratorOptions({
                        ...generatorOptions,
                        length: Math.max(8, generatorOptions.length - 1),
                      })
                    }
                    disabled={generatorOptions.length <= 8}
                  >
                    -
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setGeneratorOptions({
                        ...generatorOptions,
                        length: Math.min(32, generatorOptions.length + 1),
                      })
                    }
                    disabled={generatorOptions.length >= 32}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Slider
                value={[generatorOptions.length]}
                min={8}
                max={32}
                step={1}
                onValueChange={(value) =>
                  setGeneratorOptions({
                    ...generatorOptions,
                    length: value[0],
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>包含字符</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="uppercase"
                    checked={generatorOptions.uppercase}
                    onCheckedChange={(checked) =>
                      setGeneratorOptions({
                        ...generatorOptions,
                        uppercase: checked,
                      })
                    }
                  />
                  <Label htmlFor="uppercase">大写字母 (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="lowercase"
                    checked={generatorOptions.lowercase}
                    onCheckedChange={(checked) =>
                      setGeneratorOptions({
                        ...generatorOptions,
                        lowercase: checked,
                      })
                    }
                  />
                  <Label htmlFor="lowercase">小写字母 (a-z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="numbers"
                    checked={generatorOptions.numbers}
                    onCheckedChange={(checked) =>
                      setGeneratorOptions({
                        ...generatorOptions,
                        numbers: checked,
                      })
                    }
                  />
                  <Label htmlFor="numbers">数字 (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="symbols"
                    checked={generatorOptions.symbols}
                    onCheckedChange={(checked) =>
                      setGeneratorOptions({
                        ...generatorOptions,
                        symbols: checked,
                      })
                    }
                  />
                  <Label htmlFor="symbols">特殊字符 (!@#$%)</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>生成的密码</Label>
              <div className="flex space-x-2">
                <Input value={generatedPassword} readOnly className="font-mono" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(generatedPassword, "生成的密码")}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleGeneratePassword}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Progress value={generatedStrength} className={`h-2 flex-1 ${getStrengthColor(generatedStrength)}`} />
                <span className="text-sm text-muted-foreground">{getStrengthText(generatedStrength)}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGeneratorDialog(false)}>
              取消
            </Button>
            <Button onClick={useGeneratedPassword}>使用此密码</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
