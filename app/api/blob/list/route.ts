/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * Blob 文件列表 API
 * ==========================================
 */

import { type NextRequest, NextResponse } from "next/server"
import { blobStorage } from "@/lib/blob-storage"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get("folder") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const files = await blobStorage.listFiles(folder, limit)

    // 获取文件夹统计信息
    let stats = null
    if (folder) {
      stats = await blobStorage.getFolderStats(folder)
    }

    return NextResponse.json({
      success: true,
      data: {
        files,
        stats,
        total: files.length,
      },
    })
  } catch (error) {
    console.error("获取文件列表失败:", error)
    return NextResponse.json({ error: "获取文件列表失败" }, { status: 500 })
  }
}
