/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * Blob 文件上传 API
 * ==========================================
 */

import { type NextRequest, NextResponse } from "next/server"
import { blobStorage } from "@/lib/blob-storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "uploads"
    const filename = formData.get("filename") as string

    if (!file) {
      return NextResponse.json({ error: "没有找到文件" }, { status: 400 })
    }

    // 上传文件
    const result = await blobStorage.uploadFile(file, {
      folder,
      filename,
      addRandomSuffix: true,
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: "文件上传成功",
    })
  } catch (error) {
    console.error("文件上传失败:", error)
    return NextResponse.json(
      {
        error: error.message || "文件上传失败",
        success: false,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "缺少文件 URL" }, { status: 400 })
    }

    const success = await blobStorage.deleteFile(url)

    if (success) {
      return NextResponse.json({
        success: true,
        message: "文件删除成功",
      })
    } else {
      return NextResponse.json({ error: "文件删除失败" }, { status: 500 })
    }
  } catch (error) {
    console.error("文件删除失败:", error)
    return NextResponse.json({ error: "文件删除失败" }, { status: 500 })
  }
}
