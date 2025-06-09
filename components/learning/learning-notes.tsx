"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { StickyNote, Plus, Search, Edit, Trash2, BookOpen, Clock, Filter, Download } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import type { LearningNote } from "@/types/learning"

interface LearningNotesProps {
  resourceId?: string
}

export function LearningNotes({ resourceId }: LearningNotesProps) {
  const [notes, setNotes] = useState<LearningNote[]>([])
  const [filteredNotes, setFilteredNotes] = useState<LearningNote[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingNote, setEditingNote] = useState<LearningNote | null>(null)
  const [newNote, setNewNote] = useState({
    content: "",
    page: undefined as number | undefined,
    timestamp: undefined as number | undefined,
    tags: [] as string[],
  })

  // 模拟笔记数据
  useEffect(() => {
    const mockNotes: LearningNote[] = [
      {
        id: "1",
        content:
          "React Hooks 的使用规则：\n1. 只在函数组件顶层调用\n2. 不要在循环、条件或嵌套函数中调用\n3. 自定义Hook必须以use开头",
        page: 45,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        content: "useEffect的依赖数组很重要，如果不正确设置会导致无限循环或者副作用不执行",
        timestamp: 1280, // 21:20
        createdAt: new Date("2024-01-16"),
        updatedAt: new Date("2024-01-16"),
      },
      {
        id: "3",
        content: "Context API 适合解决prop drilling问题，但不要过度使用，会影响性能",
        page: 78,
        createdAt: new Date("2024-01-17"),
        updatedAt: new Date("2024-01-17"),
      },
    ]
    setNotes(mockNotes)
    setFilteredNotes(mockNotes)
  }, [])

  // 搜索和筛选
  useEffect(() => {
    let filtered = notes

    if (searchTerm) {
      filtered = filtered.filter((note) => note.content.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    setFilteredNotes(filtered)
  }, [notes, searchTerm, selectedTag])

  const handleAddNote = () => {
    const note: LearningNote = {
      id: Date.now().toString(),
      content: newNote.content,
      page: newNote.page,
      timestamp: newNote.timestamp,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setNotes([note, ...notes])
    setShowAddDialog(false)
    setNewNote({
      content: "",
      page: undefined,
      timestamp: undefined,
      tags: [],
    })
  }

  const handleEditNote = (note: LearningNote) => {
    setEditingNote(note)
    setNewNote({
      content: note.content,
      page: note.page,
      timestamp: note.timestamp,
      tags: [],
    })
    setShowAddDialog(true)
  }

  const handleUpdateNote = () => {
    if (!editingNote) return

    const updatedNotes = notes.map((note) =>
      note.id === editingNote.id
        ? {
            ...note,
            content: newNote.content,
            page: newNote.page,
            timestamp: newNote.timestamp,
            updatedAt: new Date(),
          }
        : note,
    )

    setNotes(updatedNotes)
    setEditingNote(null)
    setShowAddDialog(false)
    setNewNote({
      content: "",
      page: undefined,
      timestamp: undefined,
      tags: [],
    })
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
  }

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const exportNotes = () => {
    const notesText = filteredNotes
      .map((note) => {
        let header = `# 笔记 - ${format(note.createdAt, "yyyy年MM月dd日", { locale: zhCN })}\n`
        if (note.page) header += `页码: ${note.page}\n`
        if (note.timestamp) header += `时间点: ${formatTimestamp(note.timestamp)}\n`
        return header + "\n" + note.content + "\n\n---\n"
      })
      .join("\n")

    const blob = new Blob([notesText], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `学习笔记_${format(new Date(), "yyyyMMdd", { locale: zhCN })}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <StickyNote className="h-6 w-6" />
            学习笔记
          </h2>
          <p className="text-muted-foreground">记录学习过程中的重要知识点</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportNotes}>
            <Download className="mr-2 h-4 w-4" />
            导出笔记
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                添加笔记
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingNote ? "编辑笔记" : "添加笔记"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">笔记内容</label>
                  <Textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="记录您的学习心得..."
                    rows={6}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">页码（可选）</label>
                    <Input
                      type="number"
                      value={newNote.page || ""}
                      onChange={(e) => setNewNote({ ...newNote, page: Number.parseInt(e.target.value) || undefined })}
                      placeholder="页码"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">时间点（秒，可选）</label>
                    <Input
                      type="number"
                      value={newNote.timestamp || ""}
                      onChange={(e) =>
                        setNewNote({ ...newNote, timestamp: Number.parseInt(e.target.value) || undefined })
                      }
                      placeholder="视频时间点"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    取消
                  </Button>
                  <Button onClick={editingNote ? handleUpdateNote : handleAddNote} disabled={!newNote.content}>
                    {editingNote ? "更新笔记" : "添加笔记"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索笔记内容..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          筛选
        </Button>
      </div>

      {/* 笔记列表 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <StickyNote className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">
                    {format(note.createdAt, "MM月dd日", { locale: zhCN })}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditNote(note)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteNote(note.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                {note.page && (
                  <Badge variant="outline" className="text-xs">
                    <BookOpen className="mr-1 h-3 w-3" />第{note.page}页
                  </Badge>
                )}
                {note.timestamp && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatTimestamp(note.timestamp)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm whitespace-pre-wrap line-clamp-6">{note.content}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <StickyNote className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">暂无学习笔记</h3>
          <p className="text-muted-foreground">开始记录您的学习心得吧！</p>
          <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            添加笔记
          </Button>
        </div>
      )}
    </div>
  )
}
