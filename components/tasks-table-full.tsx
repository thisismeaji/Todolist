"use client"

import type { CSSProperties } from "react"

import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  Clock,
  MinusCircle,
  Plus,
  SlidersHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type TaskStatus = "Todo" | "In Progress" | "Done"
type TaskPriority = "Low" | "Medium" | "High"

type TaskRow = {
  id: string
  type: string
  title: string
  status: TaskStatus
  priority: TaskPriority
}

const statusIcon: Record<
  TaskStatus,
  { Icon: typeof Circle; color: string; bg: string }
> = {
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

const priorityIcon: Record<
  TaskPriority,
  { Icon: typeof ArrowDownCircle; color: string; bg: string }
> = {
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

const rows: TaskRow[] = [
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
  {
    id: "TASK-4962",
    type: "Documentation",
    title: "Draft the release notes for the next sprint review",
    status: "Done",
    priority: "Medium",
  },
  {
    id: "TASK-6044",
    type: "Bug",
    title: "Fix the sync issue when saving recurring tasks",
    status: "In Progress",
    priority: "High",
  },
]

export function TasksTableFull() {
  return (
    <div>
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Input placeholder="Filter tasks..." className="h-9 w-56" />
          <Button variant="outline" size="sm">
            <Plus className="size-4" />
            Status
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="size-4" />
            Priority
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="size-4" />
            View
          </Button>
          <Button size="sm">
            <Plus className="size-4" />
            Add Task
          </Button>
        </div>
      </div>
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
                      style={{ "--activity-bg": statusBg } as CSSProperties}
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
                      style={{ "--activity-bg": bg } as CSSProperties}
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
      <div className="flex flex-col gap-3 border-t border-border/60 p-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>0 of 100 row(s) selected.</span>
        <div className="flex items-center gap-3">
          <span className="text-foreground">Rows per page</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="xs">
              10
            </Button>
            <span>Page 1 of 10</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-xs">
              ‹
            </Button>
            <Button variant="outline" size="icon-xs">
              ›
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
