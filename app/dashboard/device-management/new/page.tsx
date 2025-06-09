"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeviceEditForm } from "@/components/device-management/device-edit-form"

export default function NewDevicePage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/dashboard/device-management")
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/device-management")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">添加新设备</h1>
      </div>

      <DeviceEditForm onSuccess={handleSuccess} />
    </div>
  )
}
