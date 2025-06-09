"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, TagIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getAllTags } from "@/lib/tag-management-service"
import type { DeviceTag } from "@/types/device-management"

interface DeviceTagSelectorProps {
  selectedTags: DeviceTag[]
  onTagsChange: (tags: DeviceTag[]) => void
  placeholder?: string
}

export function DeviceTagSelector({ selectedTags, onTagsChange, placeholder = "选择标签..." }: DeviceTagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [availableTags, setAvailableTags] = useState<DeviceTag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTags()
        setAvailableTags(tags)
      } catch (error) {
        console.error("获取标签失败:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  const handleTagSelect = (tag: DeviceTag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id)
    if (isSelected) {
      onTagsChange(selectedTags.filter((t) => t.id !== tag.id))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const handleTagRemove = (tagId: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId))
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selectedTags.length > 0 ? `已选择 ${selectedTags.length} 个标签` : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="搜索标签..." />
            <CommandList>
              <CommandEmpty>未找到标签</CommandEmpty>
              <CommandGroup>
                {loading ? (
                  <CommandItem disabled>正在加载标签...</CommandItem>
                ) : (
                  availableTags.map((tag) => {
                    const isSelected = selectedTags.some((t) => t.id === tag.id)
                    return (
                      <CommandItem key={tag.id} onSelect={() => handleTagSelect(tag)}>
                        <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                        <Badge style={{ backgroundColor: tag.color, color: "white" }} className="mr-2">
                          <TagIcon className="mr-1 h-3 w-3" />
                          {tag.name}
                        </Badge>
                        {tag.description && <span className="text-sm text-muted-foreground">{tag.description}</span>}
                      </CommandItem>
                    )
                  })
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              style={{ backgroundColor: tag.color, color: "white" }}
              className="flex items-center gap-1"
            >
              <TagIcon className="h-3 w-3" />
              {tag.name}
              <button
                type="button"
                onClick={() => handleTagRemove(tag.id)}
                className="ml-1 hover:bg-black/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
