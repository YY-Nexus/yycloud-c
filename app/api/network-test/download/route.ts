import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // 获取请求的文件大小
  const url = new URL(request.url)
  const sizeParam = url.searchParams.get("size")
  const size = sizeParam ? Number.parseInt(sizeParam) : 5 * 1024 * 1024 // 默认5MB

  // 生成随机数据作为测试文件
  const buffer = new Uint8Array(size)

  // 填充随机数据
  for (let i = 0; i < size; i++) {
    buffer[i] = Math.floor(Math.random() * 256)
  }

  // 返回二进制数据
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": size.toString(),
      "Cache-Control": "no-store, no-cache",
    },
  })
}
