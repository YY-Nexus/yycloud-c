/**
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │            YanYu Cloud³ (YYC³)          │
 * │      言语云³ - 言枢象限·语启未来            │
 * │                                         │
 * └─────────────────────────────────────────┘
 *
 * API 服务模块
 *
 * 提供统一的API调用接口
 *
 * @module YYC/lib
 * @version 1.0.0
 * @license Copyright (c) 2023-2024 YanYu Technology
 */

import type { DeviceWithResults, Result } from "./device-manager"

// API 基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// 通用 API 请求函数
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// 获取带有测试结果的设备列表
export const getDevicesWithResults = async (): Promise<DeviceWithResults[]> => {
  try {
    // 在实际应用中，这应该调用真实的API
    // return await apiRequest<DeviceWithResults[]>('/devices/with-results')

    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 返回模拟数据
    const mockDevices: DeviceWithResults[] = [
      {
        id: "device_1",
        name: "MacBook Pro M4 Max",
        type: "laptop",
        os: "macOS",
        browser: "Chrome",
        location: "办公室",
        isActive: true,
        lastSeen: new Date(),
        createdAt: new Date(Date.now() - 7 * 86400000),
        updatedAt: new Date(),
        results: [
          {
            id: "result_1",
            deviceId: "device_1",
            timestamp: new Date(),
            download: 150.5,
            upload: 45.2,
            ping: 12,
            jitter: 1.5,
            packetLoss: 0,
            qualityScore: 95,
          },
          {
            id: "result_2",
            deviceId: "device_1",
            timestamp: new Date(Date.now() - 3600000),
            download: 148.3,
            upload: 44.8,
            ping: 13,
            jitter: 1.8,
            packetLoss: 0,
            qualityScore: 94,
          },
        ],
      },
      {
        id: "device_2",
        name: "iMac M4",
        type: "desktop",
        os: "macOS",
        browser: "Safari",
        location: "工作室",
        isActive: true,
        lastSeen: new Date(),
        createdAt: new Date(Date.now() - 14 * 86400000),
        updatedAt: new Date(),
        results: [
          {
            id: "result_3",
            deviceId: "device_2",
            timestamp: new Date(),
            download: 98.2,
            upload: 38.7,
            ping: 15,
            jitter: 2.1,
            packetLoss: 0.1,
            qualityScore: 88,
          },
          {
            id: "result_4",
            deviceId: "device_2",
            timestamp: new Date(Date.now() - 3600000),
            download: 96.8,
            upload: 37.9,
            ping: 16,
            jitter: 2.3,
            packetLoss: 0.1,
            qualityScore: 87,
          },
        ],
      },
      {
        id: "device_3",
        name: "iPhone 15 Pro",
        type: "mobile",
        os: "iOS",
        browser: "Safari",
        location: "移动网络",
        isActive: true,
        lastSeen: new Date(),
        createdAt: new Date(Date.now() - 3 * 86400000),
        updatedAt: new Date(),
        results: [
          {
            id: "result_5",
            deviceId: "device_3",
            timestamp: new Date(),
            download: 85.6,
            upload: 32.4,
            ping: 25,
            jitter: 3.2,
            packetLoss: 0.2,
            qualityScore: 82,
          },
        ],
      },
    ]

    return mockDevices
  } catch (error) {
    console.error("获取设备数据失败:", error)
    throw error
  }
}

// 获取单个设备信息
export const getDevice = async (deviceId: string): Promise<DeviceWithResults | null> => {
  try {
    const devices = await getDevicesWithResults()
    return devices.find((device) => device.id === deviceId) || null
  } catch (error) {
    console.error("获取设备信息失败:", error)
    throw error
  }
}

// 创建新设备
export const createDevice = async (
  deviceData: Omit<DeviceWithResults, "id" | "createdAt" | "updatedAt" | "results">,
): Promise<DeviceWithResults> => {
  try {
    // return await apiRequest<DeviceWithResults>('/devices', {
    //   method: 'POST',
    //   body: JSON.stringify(deviceData),
    // })

    // 模拟创建设备
    const newDevice: DeviceWithResults = {
      ...deviceData,
      id: `device_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      results: [],
    }

    return newDevice
  } catch (error) {
    console.error("创建设备失败:", error)
    throw error
  }
}

// 更新设备信息
export const updateDevice = async (
  deviceId: string,
  deviceData: Partial<DeviceWithResults>,
): Promise<DeviceWithResults> => {
  try {
    // return await apiRequest<DeviceWithResults>(`/devices/${deviceId}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(deviceData),
    // })

    // 模拟更新设备
    const devices = await getDevicesWithResults()
    const device = devices.find((d) => d.id === deviceId)

    if (!device) {
      throw new Error(`Device with ID ${deviceId} not found`)
    }

    const updatedDevice: DeviceWithResults = {
      ...device,
      ...deviceData,
      updatedAt: new Date(),
    }

    return updatedDevice
  } catch (error) {
    console.error("更新设备失败:", error)
    throw error
  }
}

// 删除设备
export const deleteDevice = async (deviceId: string): Promise<boolean> => {
  try {
    // await apiRequest(`/devices/${deviceId}`, {
    //   method: 'DELETE',
    // })

    // 模拟删除设备
    console.log(`删除设备: ${deviceId}`)
    return true
  } catch (error) {
    console.error("删除设备失败:", error)
    throw error
  }
}

// 添加测试结果
export const addTestResult = async (
  deviceId: string,
  result: Omit<Result, "id" | "deviceId" | "timestamp">,
): Promise<Result> => {
  try {
    // return await apiRequest<Result>(`/devices/${deviceId}/results`, {
    //   method: 'POST',
    //   body: JSON.stringify(result),
    // })

    // 模拟添加测试结果
    const newResult: Result = {
      ...result,
      id: `result_${Date.now()}`,
      deviceId,
      timestamp: new Date(),
    }

    return newResult
  } catch (error) {
    console.error("添加测试结果失败:", error)
    throw error
  }
}

// 获取设备测试历史
export const getDeviceTestHistory = async (deviceId: string, limit?: number): Promise<Result[]> => {
  try {
    const device = await getDevice(deviceId)
    if (!device) {
      return []
    }

    let results = device.results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    if (limit) {
      results = results.slice(0, limit)
    }

    return results
  } catch (error) {
    console.error("获取测试历史失败:", error)
    throw error
  }
}

// 导出所有API函数
export default {
  getDevicesWithResults,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
  addTestResult,
  getDeviceTestHistory,
}
