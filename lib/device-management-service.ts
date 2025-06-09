import type { Device, DeviceSearchParams, DeviceStatus, DeviceGroup, DeviceCategory } from "@/types/device-management"

// 模拟设备数据
const mockDevices: Device[] = [
  {
    id: 1,
    name: "主办公室路由器",
    status: "活跃",
    ipAddress: "192.168.1.1",
    macAddress: "00:1A:2B:3C:4D:5E",
    group: "办公室",
    category: "网络",
    location: "主办公室",
    lastSeen: new Date(),
    description: "主要网络路由器，连接所有办公设备",
    manufacturer: "华为",
    model: "AR2220",
    serialNumber: "HW123456789",
    purchaseDate: new Date("2022-01-15"),
    warrantyEnd: new Date("2025-01-15"),
  },
  {
    id: 2,
    name: "开发部服务器",
    status: "活跃",
    ipAddress: "192.168.1.10",
    macAddress: "00:1A:2B:3C:4D:5F",
    group: "服务器",
    category: "服务器",
    location: "服务器机房",
    lastSeen: new Date(),
    description: "开发部门使用的主要开发服务器",
    manufacturer: "联想",
    model: "ThinkSystem SR650",
    serialNumber: "TS987654321",
    purchaseDate: new Date("2021-06-10"),
    warrantyEnd: new Date("2024-06-10"),
  },
  {
    id: 3,
    name: "CEO笔记本",
    status: "不活跃",
    ipAddress: "192.168.1.101",
    macAddress: "00:1A:2B:3C:4D:60",
    group: "办公室",
    category: "计算机",
    location: "CEO办公室",
    lastSeen: new Date(Date.now() - 86400000 * 3), // 3天前
    description: "CEO专用笔记本电脑",
    manufacturer: "苹果",
    model: "MacBook Pro 16",
    serialNumber: "APPL2023001",
    purchaseDate: new Date("2023-01-05"),
    warrantyEnd: new Date("2025-01-05"),
  },
  {
    id: 4,
    name: "会议室投影仪",
    status: "离线",
    ipAddress: "192.168.1.50",
    macAddress: "00:1A:2B:3C:4D:61",
    group: "办公室",
    category: "外设",
    location: "主会议室",
    lastSeen: new Date(Date.now() - 86400000 * 10), // 10天前
    description: "主会议室使用的4K投影仪",
    manufacturer: "爱普生",
    model: "EB-L1070U",
    serialNumber: "EP20220789",
    purchaseDate: new Date("2022-03-20"),
    warrantyEnd: new Date("2024-03-20"),
  },
  {
    id: 5,
    name: "市场部打印机",
    status: "维护中",
    ipAddress: "192.168.1.30",
    macAddress: "00:1A:2B:3C:4D:62",
    group: "办公室",
    category: "外设",
    location: "市场部",
    lastSeen: new Date(Date.now() - 86400000 * 1), // 1天前
    description: "市场部专用彩色激光打印机",
    manufacturer: "惠普",
    model: "Color LaserJet Pro MFP M479fdw",
    serialNumber: "HP2023456",
    purchaseDate: new Date("2022-11-15"),
    warrantyEnd: new Date("2024-11-15"),
  },
  {
    id: 6,
    name: "测试服务器",
    status: "活跃",
    ipAddress: "192.168.1.11",
    macAddress: "00:1A:2B:3C:4D:63",
    group: "服务器",
    category: "服务器",
    location: "服务器机房",
    lastSeen: new Date(),
    description: "用于自动化测试的服务器",
    manufacturer: "戴尔",
    model: "PowerEdge R740",
    serialNumber: "DELL87654321",
    purchaseDate: new Date("2021-08-10"),
    warrantyEnd: new Date("2024-08-10"),
  },
  {
    id: 7,
    name: "前台平板",
    status: "活跃",
    ipAddress: "192.168.1.150",
    macAddress: "00:1A:2B:3C:4D:64",
    group: "办公室",
    category: "移动设备",
    location: "前台",
    lastSeen: new Date(),
    description: "前台访客登记用平板",
    manufacturer: "三星",
    model: "Galaxy Tab S7",
    serialNumber: "SAM20220123",
    purchaseDate: new Date("2022-05-20"),
    warrantyEnd: new Date("2024-05-20"),
  },
  {
    id: 8,
    name: "技术总监手机",
    status: "活跃",
    ipAddress: "192.168.1.201",
    macAddress: "00:1A:2B:3C:4D:65",
    group: "移动设备",
    category: "移动设备",
    location: "移动",
    lastSeen: new Date(),
    description: "技术总监的公司手机",
    manufacturer: "小米",
    model: "Mi 12 Pro",
    serialNumber: "MI20230456",
    purchaseDate: new Date("2023-02-15"),
    warrantyEnd: new Date("2025-02-15"),
  },
]

// 获取所有设备
export const getAllDevices = async (): Promise<Device[]> => {
  // 在实际应用中，这里会从API获取数据
  return Promise.resolve([...mockDevices])
}

// 获取单个设备
export const getDeviceById = async (id: number): Promise<Device | undefined> => {
  // 在实际应用中，这里会从API获取数据
  return Promise.resolve(mockDevices.find((device) => device.id === id))
}

// 搜索设备
export const searchDevices = async (params: DeviceSearchParams): Promise<Device[]> => {
  let filteredDevices = [...mockDevices]

  // 按查询字符串过滤
  if (params.query) {
    const query = params.query.toLowerCase()
    filteredDevices = filteredDevices.filter(
      (device) =>
        device.name.toLowerCase().includes(query) ||
        device.description?.toLowerCase().includes(query) ||
        device.manufacturer?.toLowerCase().includes(query) ||
        device.model?.toLowerCase().includes(query) ||
        device.serialNumber?.toLowerCase().includes(query) ||
        device.ipAddress?.includes(query) ||
        device.macAddress?.toLowerCase().includes(query),
    )
  }

  // 按状态过滤
  if (params.status) {
    filteredDevices = filteredDevices.filter((device) => device.status === params.status)
  }

  // 按分组过滤
  if (params.group) {
    filteredDevices = filteredDevices.filter((device) => device.group === params.group)
  }

  // 按类别过滤
  if (params.category) {
    filteredDevices = filteredDevices.filter((device) => device.category === params.category)
  }

  return Promise.resolve(filteredDevices)
}

// 获取所有可用的设备分组
export const getDeviceGroups = async (): Promise<DeviceGroup[]> => {
  const groups = mockDevices.map((device) => device.group).filter((group): group is DeviceGroup => !!group)
  return Promise.resolve([...new Set(groups)])
}

// 获取所有可用的设备类别
export const getDeviceCategories = async (): Promise<DeviceCategory[]> => {
  const categories = mockDevices
    .map((device) => device.category)
    .filter((category): category is DeviceCategory => !!category)
  return Promise.resolve([...new Set(categories)])
}

// 获取所有可用的设备状态
export const getDeviceStatuses = async (): Promise<DeviceStatus[]> => {
  const statuses = mockDevices.map((device) => device.status)
  return Promise.resolve([...new Set(statuses)])
}

// 按分组获取设备
export const getDevicesByGroup = async (): Promise<Record<DeviceGroup, Device[]>> => {
  const groups = await getDeviceGroups()
  const result: Partial<Record<DeviceGroup, Device[]>> = {}

  for (const group of groups) {
    result[group] = mockDevices.filter((device) => device.group === group)
  }

  return result as Record<DeviceGroup, Device[]>
}

// 按类别获取设备
export const getDevicesByCategory = async (): Promise<Record<DeviceCategory, Device[]>> => {
  const categories = await getDeviceCategories()
  const result: Partial<Record<DeviceCategory, Device[]>> = {}

  for (const category of categories) {
    result[category] = mockDevices.filter((device) => device.category === category)
  }

  return result as Record<DeviceCategory, Device[]>
}

// 按状态获取设备
export const getDevicesByStatus = async (): Promise<Record<DeviceStatus, Device[]>> => {
  const statuses = await getDeviceStatuses()
  const result: Partial<Record<DeviceStatus, Device[]>> = {}

  for (const status of statuses) {
    result[status] = mockDevices.filter((device) => device.status === status)
  }

  return result as Record<DeviceStatus, Device[]>
}
