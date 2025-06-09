import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // 简单的ping响应
  return NextResponse.json({
    timestamp: Date.now(),
    status: "ok",
  })
}
