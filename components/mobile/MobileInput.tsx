"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MobileInputProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
}

const MobileInput: React.FC<MobileInputProps> = ({ label, value, onChange, type = "text", placeholder = "" }) => {
  return (
    <div className="space-y-2 mb-4">
      <Label htmlFor={label.replace(/\s+/g, "-").toLowerCase()}>{label}</Label>
      <Input
        id={label.replace(/\s+/g, "-").toLowerCase()}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-12 text-base"
      />
    </div>
  )
}

export default MobileInput
