"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSecurityTips } from "@/lib/security-manager"
import type { SecurityTip } from "@/types/security"
import { LightbulbIcon, Key, Eye, Laptop, ShieldCheck } from "lucide-react"

interface SecurityTipsProps {
  limit?: number
}

export function SecurityTips({ limit }: SecurityTipsProps) {
  const [tips, setTips] = useState<SecurityTip[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("all")

  useEffect(() => {
    const securityTips = getSecurityTips()
    setTips(securityTips)
  }, [])

  const filteredTips = activeCategory === "all" ? tips : tips.filter((tip) => tip.category === activeCategory)

  const displayTips = limit ? filteredTips.slice(0, limit) : filteredTips

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "password":
        return <Key className="h-4 w-4 mr-2" />
      case "privacy":
        return <Eye className="h-4 w-4 mr-2" />
      case "device":
        return <Laptop className="h-4 w-4 mr-2" />
      case "general":
      default:
        return <ShieldCheck className="h-4 w-4 mr-2" />
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "password":
        return "密码安全"
      case "privacy":
        return "隐私保护"
      case "device":
        return "设备安全"
      case "general":
      default:
        return "通用安全"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>安全提示</CardTitle>
          <LightbulbIcon className="h-5 w-5 text-yellow-500" />
        </div>
        <CardDescription>提高安全性的实用建议和最佳实践</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {!limit && (
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-4">
            <TabsList className="grid grid-cols-5 h-auto">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="password">密码</TabsTrigger>
              <TabsTrigger value="privacy">隐私</TabsTrigger>
              <TabsTrigger value="device">设备</TabsTrigger>
              <TabsTrigger value="general">通用</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <div className="space-y-4">
          {displayTips.map((tip) => (
            <div key={tip.id} className="space-y-2">
              <div className="flex items-center">
                {getCategoryIcon(tip.category)}
                <h3 className="font-medium">{tip.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-6">{tip.content}</p>
              <div className="pl-6">
                <Badge variant="outline" className="text-xs">
                  {getCategoryName(tip.category)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {limit && tips.length > limit && (
        <CardFooter className="pt-2">
          <Button variant="ghost" size="sm" className="w-full">
            查看全部提示
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

function Badge({ children, variant, className }: { children: React.ReactNode; variant: string; className: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 ${className}`}
    >
      {children}
    </span>
  )
}
