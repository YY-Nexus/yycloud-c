import { Card, CardContent } from "@/components/ui/card"
import { QuickActionButton } from "@/components/ui/quick-action-button"

interface WelcomeCardProps {
  userName?: string
}

export function WelcomeCard({ userName = "您" }: WelcomeCardProps) {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none shadow-lg">
      <CardContent className="p-6">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-2">言语云³ ——言枢象限·语启未来</h2>
          <p className="text-sm opacity-90 whitespace-nowrap overflow-hidden text-ellipsis">
            Step into the Pivot Quadrant of language with YanYu Cloud³ — where every word unlocks tomorrow.
          </p>
        </div>

        {/* 快速操作按钮 - 绝对定位在右侧 */}
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
          <QuickActionButton tooltipText="快速操作中心" />
        </div>
      </CardContent>
    </Card>
  )
}
