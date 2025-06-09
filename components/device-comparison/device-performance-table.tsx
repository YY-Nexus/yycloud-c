"use client"

// components/device-comparison/device-performance-table.tsx

import type React from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Device {
  id: string
  name: string
  cpu: string
  memory: string
  storage: string
}

interface DevicePerformanceTableProps {
  devices: Device[]
}

const DevicePerformanceTable: React.FC<DevicePerformanceTableProps> = ({ devices }) => {
  const router = useRouter()

  return (
    <Table>
      <TableCaption>A list of your devices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>CPU</TableHead>
          <TableHead>Memory</TableHead>
          <TableHead>Storage</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {devices.map((device) => (
          <TableRow
            key={device.id}
            onClick={() => router.push(`/dashboard/device-management/${device.id}`)}
            className="cursor-pointer hover:bg-muted/50"
          >
            <TableCell>
              <Link href={`/dashboard/device-management/${device.id}`}>{device.name}</Link>
            </TableCell>
            <TableCell>{device.cpu}</TableCell>
            <TableCell>{device.memory}</TableCell>
            <TableCell>{device.storage}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/dashboard/device-management/${device.id}/details`)
                }}
              >
                详情
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default DevicePerformanceTable
