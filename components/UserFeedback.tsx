"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const UserFeedback: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    // 这里可以添加实际的提交逻辑
    console.log({ feedback, rating })
    setSubmitted(true)

    // 重置表单并在2秒后关闭对话框
    setTimeout(() => {
      setIsOpen(false)
      setFeedback("")
      setRating(null)
      setSubmitted(false)
    }, 2000)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" className="fixed bottom-4 right-4 z-50">
        提供反馈
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>您的反馈对我们很重要</DialogTitle>
          </DialogHeader>

          {submitted ? (
            <div className="py-6 text-center">
              <p className="text-green-600 font-medium">感谢您的反馈！</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>您对此功能的评价如何？</Label>
                  <RadioGroup value={rating || ""} onValueChange={setRating}>
                    <div className="flex justify-between">
                      {["很差", "较差", "一般", "良好", "优秀"].map((label, i) => (
                        <div key={i} className="flex flex-col items-center space-y-1">
                          <RadioGroupItem value={String(i + 1)} id={`rating-${i + 1}`} />
                          <Label htmlFor={`rating-${i + 1}`} className="text-xs">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">您的建议</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="请分享您的想法或建议..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSubmit} disabled={!rating}>
                  提交反馈
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserFeedback
