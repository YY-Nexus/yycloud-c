import type React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface NetworkStat {
  id: string
  title: string
  value: string
  description?: string
}

interface NetworkStatsCardsProps {
  stats: NetworkStat[]
}

const NetworkStatsCards: React.FC<NetworkStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>{stat.title}</CardTitle>
            <div className="flex space-x-2">
              <Button asChild variant="default" size="sm">
                <Link href={`/dashboard/network-monitor/details/${stat.id}`}>查看详情</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/dashboard/network-monitor/history/${stat.id}`}>查看历史</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.description && <p className="text-sm text-muted-foreground">{stat.description}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default NetworkStatsCards
