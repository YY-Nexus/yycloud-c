"use client"

import type React from "react"

interface MobileTableProps {
  headers: string[]
  rows: {
    id: number | string
    cells: React.ReactNode[]
    onClick?: () => void
  }[]
}

const MobileTable: React.FC<MobileTableProps> = ({ headers, rows }) => {
  return (
    <div className="overflow-x-auto w-full">
      <div className="border rounded-lg divide-y">
        {rows.map((row) => (
          <div key={row.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={row.onClick}>
            <div className="grid grid-cols-1 gap-2">
              {row.cells.map((cell, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium text-gray-500">{headers[index]}</span>
                  <span className="text-right">{cell}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MobileTable
