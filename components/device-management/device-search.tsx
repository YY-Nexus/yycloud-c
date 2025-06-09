"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DeviceStatus, DeviceGroup, DeviceCategory, DeviceSearchParams } from "@/types/device-management"
import { getDeviceStatuses, getDeviceGroups, getDeviceCategories } from "@/lib/device-management-service"

interface DeviceSearchProps {
  onSearch: (params: DeviceSearchParams) => void
}

export function DeviceSearch({ onSearch }: DeviceSearchProps) {
  const [query, setQuery] = useState("")
  const [statuses, setStatuses] = useState<DeviceStatus[]>([])
  const [selectedStatus, setSelectedStatus] = useState<DeviceStatus | undefined>(undefined)
  const [groups, setGroups] = useState<DeviceGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<DeviceGroup | undefined>(undefined)
  const [categories, setCategories] = useState<DeviceCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | undefined>(undefined)

  useEffect(() => {
    const loadFilterOptions = async () => {
      const [statusesData, groupsData, categoriesData] = await Promise.all([
        getDeviceStatuses(),
        getDeviceGroups(),
        getDeviceCategories(),
      ])
      setStatuses(statusesData)
      setGroups(groupsData)
      setCategories(categoriesData)
    }

    loadFilterOptions()
  }, [])

  const handleSearch = () => {
    onSearch({
      query: query || undefined,
      status: selectedStatus,
      group: selectedGroup,
      category: selectedCategory,
    })
  }

  const handleReset = () => {
    setQuery("")
    setSelectedStatus(undefined)
    setSelectedGroup(undefined)
    setSelectedCategory(undefined)
    onSearch({})
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索设备名称、IP、型号等..."
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                筛选
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>设备状态</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem
                  checked={selectedStatus === undefined}
                  onCheckedChange={() => setSelectedStatus(undefined)}
                >
                  全部
                </DropdownMenuCheckboxItem>
                {statuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={selectedStatus === status}
                    onCheckedChange={() => setSelectedStatus(status)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuLabel>设备分组</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem
                  checked={selectedGroup === undefined}
                  onCheckedChange={() => setSelectedGroup(undefined)}
                >
                  全部
                </DropdownMenuCheckboxItem>
                {groups.map((group) => (
                  <DropdownMenuCheckboxItem
                    key={group}
                    checked={selectedGroup === group}
                    onCheckedChange={() => setSelectedGroup(group)}
                  >
                    {group}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuLabel>设备类别</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem
                  checked={selectedCategory === undefined}
                  onCheckedChange={() => setSelectedCategory(undefined)}
                >
                  全部
                </DropdownMenuCheckboxItem>
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategory === category}
                    onCheckedChange={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleSearch}>搜索</Button>
          <Button variant="outline" onClick={handleReset}>
            重置
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedStatus && (
          <div className="bg-muted text-sm px-2 py-1 rounded-md flex items-center gap-1">
            状态: {selectedStatus}
            <button
              className="ml-1 text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedStatus(undefined)}
            >
              ×
            </button>
          </div>
        )}
        {selectedGroup && (
          <div className="bg-muted text-sm px-2 py-1 rounded-md flex items-center gap-1">
            分组: {selectedGroup}
            <button
              className="ml-1 text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedGroup(undefined)}
            >
              ×
            </button>
          </div>
        )}
        {selectedCategory && (
          <div className="bg-muted text-sm px-2 py-1 rounded-md flex items-center gap-1">
            类别: {selectedCategory}
            <button
              className="ml-1 text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedCategory(undefined)}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
