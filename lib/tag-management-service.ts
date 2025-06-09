import type { DeviceTag } from "@/types/device-management"

// 模拟标签数据
const mockTags: DeviceTag[] = [
  {
    id: "tag-1",
    name: "重要设备",
    color: "#ef4444",
    description: "关键业务设备",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "tag-2",
    name: "测试环境",
    color: "#f59e0b",
    description: "用于测试的设备",
    createdAt: new Date("2023-01-02"),
    updatedAt: new Date("2023-01-02"),
  },
  {
    id: "tag-3",
    name: "生产环境",
    color: "#10b981",
    description: "生产环境设备",
    createdAt: new Date("2023-01-03"),
    updatedAt: new Date("2023-01-03"),
  },
  {
    id: "tag-4",
    name: "需要更新",
    color: "#8b5cf6",
    description: "需要软件或硬件更新的设备",
    createdAt: new Date("2023-01-04"),
    updatedAt: new Date("2023-01-04"),
  },
  {
    id: "tag-5",
    name: "高优先级",
    color: "#ec4899",
    description: "高优先级维护设备",
    createdAt: new Date("2023-01-05"),
    updatedAt: new Date("2023-01-05"),
  },
]

// 获取所有标签
export const getAllTags = async (): Promise<DeviceTag[]> => {
  return Promise.resolve([...mockTags])
}

// 根据ID获取标签
export const getTagById = async (id: string): Promise<DeviceTag | undefined> => {
  return Promise.resolve(mockTags.find((tag) => tag.id === id))
}

// 创建新标签
export const createTag = async (tagData: Omit<DeviceTag, "id" | "createdAt" | "updatedAt">): Promise<DeviceTag> => {
  const newTag: DeviceTag = {
    ...tagData,
    id: `tag-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockTags.push(newTag)
  return Promise.resolve(newTag)
}

// 更新标签
export const updateTag = async (id: string, tagData: Partial<DeviceTag>): Promise<DeviceTag | undefined> => {
  const tagIndex = mockTags.findIndex((tag) => tag.id === id)
  if (tagIndex === -1) {
    return Promise.resolve(undefined)
  }

  mockTags[tagIndex] = {
    ...mockTags[tagIndex],
    ...tagData,
    updatedAt: new Date(),
  }

  return Promise.resolve(mockTags[tagIndex])
}

// 删除标签
export const deleteTag = async (id: string): Promise<boolean> => {
  const tagIndex = mockTags.findIndex((tag) => tag.id === id)
  if (tagIndex === -1) {
    return Promise.resolve(false)
  }

  mockTags.splice(tagIndex, 1)
  return Promise.resolve(true)
}

// 搜索标签
export const searchTags = async (query: string): Promise<DeviceTag[]> => {
  if (!query) {
    return getAllTags()
  }

  const filteredTags = mockTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(query.toLowerCase()) ||
      tag.description?.toLowerCase().includes(query.toLowerCase()),
  )

  return Promise.resolve(filteredTags)
}
