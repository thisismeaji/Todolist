"use client"

import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  Clock,
  MinusCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const rows = [
  {
    id: "TASK-8782",
    type: "Documentation",
    title:
      "You can't compress the program without quantifying the open-source SSD",
    status: "In Progress",
    priority: "Low",
  },
  {
    id: "TASK-7878",
    type: "Documentation",
    title:
      "Try to calculate the EXE feed, maybe it will index the multi-byte pixel",
    status: "Todo",
    priority: "Medium",
  },
  {
    id: "TASK-7839",
    type: "Bug",
    title: "We need to bypass the neural TCP card",
    status: "Todo",
    priority: "High",
  },
  {
    id: "TASK-5562",
    type: "Feature",
    title: "The SAS interface is down, bypass the open-source pixel",
    status: "In Progress",
    priority: "Low",
  },
  {
    id: "TASK-8686",
    type: "Feature",
    title: "I'll parse the wireless SSL protocol, that should drive the API panel",
    status: "Todo",
    priority: "Low",
  },
  {
    id: "TASK-1280",
    type: "Bug",
    title: "Use the digital TLS panel, then you can transmit the haptic system",
    status: "Done",
    priority: "High",
  },
  {
    id: "TASK-7262",
    type: "Feature",
    title: "The UTF8 application is down, parse the neural bandwidth",
    status: "Done",
    priority: "High",
  },
  {
    id: "TASK-1138",
    type: "Feature",
    title: "Generating the driver won't do anything, we need to quantify the SM",
    status: "In Progress",
    priority: "Low",
  },
]

const statusIcon = {
  Todo: {
    Icon: Circle,
    color: "text-amber-600",
    bg: "rgba(245, 158, 11, 0.15)",
  },
  "In Progress": {
    Icon: Clock,
    color: "text-blue-600",
    bg: "rgba(37, 99, 235, 0.15)",
  },
  Done: {
    Icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "rgba(16, 185, 129, 0.15)",
  },
}

const priorityIcon = {
  Low: {
    Icon: ArrowDownCircle,
    color: "text-lime-600",
    bg: "rgba(132, 204, 22, 0.15)",
  },
  Medium: {
    Icon: MinusCircle,
    color: "text-violet-600",
    bg: "rgba(139, 92, 246, 0.15)",
  },
  High: {
    Icon: ArrowUpCircle,
    color: "text-red-600",
    bg: "rgba(220, 38, 38, 0.15)",
  },
}

export function TasksTable() {
  return (
    <div>
      <Table className="rounded-xl border border-border/60 bg-background">
        <TableHeader>
          <TableRow>
            <TableHead className="w-28">Task</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-40">Status</TableHead>
            <TableHead className="w-32">Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const { Icon: StatusIcon, color: statusColor, bg: statusBg } =
              statusIcon[row.status]
            const { Icon: PriorityIcon, color, bg } = priorityIcon[row.priority]
            return (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell className="min-w-[320px]">
                  <span className="text-foreground line-clamp-1">
                    {row.title}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className="activity-bg flex size-7 items-center justify-center rounded-full"
                      style={{ "--activity-bg": statusBg }}
                    >
                      <StatusIcon
                        className={`relative z-10 size-4 ${statusColor}`}
                      />
                    </span>
                    <span>{row.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className="activity-bg flex size-7 items-center justify-center rounded-full"
                      style={{ "--activity-bg": bg }}
                    >
                      <PriorityIcon className={`relative z-10 size-4 ${color}`} />
                    </span>
                    <span>{row.priority}</span>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
