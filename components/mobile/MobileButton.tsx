"use client"

import type React from "react"
import { Button } from "@/components/ui/button"

interface MobileButtonProps {
  onClick: () => void
  text: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

const MobileButton: React.FC<MobileButtonProps> = ({ onClick, text, variant = "default" }) => {
  return (
    <Button onClick={onClick} variant={variant} className="w-full py-3 text-base font-medium rounded-lg">
      {text}
    </Button>
  )
}

export default MobileButton
