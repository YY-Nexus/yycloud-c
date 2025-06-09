import type { DeviceHistoryEntry, ChangeType } from "@/types/device-management"

// 模拟历史记录数据
const mockHistory: DeviceHistoryEntry[] = [
  {
    id: "hist-1",
    deviceId: 1,
    changeType: "创建",
    description: "设备已创建",
    userId: "user-1",
    userName: "管理员",
    timestamp: new Date("2023-01-15T10:00:00Z"),
  },
  {
    id: "hist-2",
    deviceId: 1,
    changeType: "更新",
    field: "location",
    oldValue: "未知",
    newValue: "主办公室",
    description: "更新了设备位置",
    userId: "user-1",
    userName: "管理员",
    timestamp: new Date("2023-01-16T14:30:00Z"),
  },
  {
    id: "hist-3",
    deviceId: 1,
    changeType: "状态变更",
    field: "status",
    oldValue: "不活跃",
    newValue: "活跃",
    description: "设备状态从不活跃变更为活跃",
    userId: "user-2",
    userName: "技术员",
    timestamp: new Date("2023-01-17T09:15:00Z"),
  },
  {
    id: "hist-4",
    deviceId: 2,
    changeType: "创建",
    description: "设备已创建",
    userId: "user-1",
    userName: "管理员",
    timestamp: new Date("2023-06-10T11:00:00Z"),
  },
  {
    id: "hist-5",
    deviceId: 1,
    changeType: "标签变更",
    description: "添加了标签：重要设备",
    userId: "user-1",
    userName: "管理员",
    timestamp: new Date("2023-12-01T16:45:00Z"),
  },
]

// 获取设备的历史记录
export const getDeviceHistory = async (deviceId: number): Promise<DeviceHistoryEntry[]> => {
  const deviceHistory = mockHistory
    .filter((entry) => entry.deviceId === deviceId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return Promise.resolve(deviceHistory)
}

// 添加历史记录条目
export const addHistoryEntry = async (
  entry: Omit<DeviceHistoryEntry, "id" | "timestamp">,
): Promise<DeviceHistoryEntry> => {
  const newEntry: DeviceHistoryEntry = {
    ...entry,
    id: `hist-${Date.now()}`,
    timestamp: new Date(),
  }

  mockHistory.push(newEntry)
  return Promise.resolve(newEntry)
}

// 获取所有历史记录（用于管理）
export const getAllHistory = async (): Promise<DeviceHistoryEntry[]> => {
  return Promise.resolve([...mockHistory].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()))
}

// 按时间范围获取历史记录
export const getHistoryByDateRange = async (startDate: Date, endDate: Date): Promise<DeviceHistoryEntry[]> => {
  const filteredHistory = mockHistory.filter((entry) => entry.timestamp >= startDate && entry.timestamp <= endDate)

  return Promise.resolve(filteredHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()))
}

// 按变更类型获取历史记录
export const getHistoryByChangeType = async (changeType: ChangeType): Promise<DeviceHistoryEntry[]> => {
  const filteredHistory = mockHistory.filter((entry) => entry.changeType === changeType)

  return Promise.resolve(filteredHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()))
}
