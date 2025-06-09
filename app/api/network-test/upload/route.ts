import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // 获取上传的数据
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "未找到文件" }, { status: 400 })
    }

    // 在实际应用中，您可能需要处理文件
    // 这里我们只需要确认收到了文件

    return NextResponse.json({
      success: true,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("上传处理错误:", error)
    return NextResponse.json({ error: "上传处理失败" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
