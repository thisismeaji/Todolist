"use client"

import type { CSSProperties } from "react"

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

type TaskStatus = "Todo" | "In Progress" | "Done"
type TaskPriority = "Low" | "Medium" | "High"

type TaskRow = {
  id: string
  type: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  subtasks: { title: string; done: boolean }[]
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
    subtasks: [
      { title: "Draft outline", done: true },
      { title: "Review technical notes", done: false },
      { title: "Finalize copy", done: false },
    ],
  },
  {
    id: "TASK-7878",
    type: "Documentation",
    title:
      "Try to calculate the EXE feed, maybe it will index the multi-byte pixel",
    status: "Todo",
    priority: "Medium",
    subtasks: [
      { title: "Collect inputs", done: true },
      { title: "Run quick check", done: true },
      { title: "Write summary", done: false },
    ],
  },
  {
    id: "TASK-7839",
    type: "Bug",
    title: "We need to bypass the neural TCP card",
    status: "Todo",
    priority: "High",
    subtasks: [
      { title: "Reproduce issue", done: true },
      { title: "Identify root cause", done: true },
      { title: "Add test", done: false },
    ],
  },
  {
    id: "TASK-5562",
    type: "Feature",
    title: "The SAS interface is down, bypass the open-source pixel",
    status: "In Progress",
    priority: "Low",
    subtasks: [
      { title: "List affected areas", done: true },
      { title: "Update interface", done: false },
    ],
  },
  {
    id: "TASK-8686",
    type: "Feature",
    title: "I'll parse the wireless SSL protocol, that should drive the API panel",
    status: "Todo",
    priority: "Low",
    subtasks: [
      { title: "Define scope", done: true },
      { title: "Write checklist", done: false },
    ],
  },
  {
    id: "TASK-1280",
    type: "Bug",
    title: "Use the digital TLS panel, then you can transmit the haptic system",
    status: "Done",
    priority: "High",
    subtasks: [
      { title: "Prep assets", done: true },
      { title: "Verify output", done: true },
    ],
  },
  {
    id: "TASK-7262",
    type: "Feature",
    title: "The UTF8 application is down, parse the neural bandwidth",
    status: "Done",
    priority: "High",
    subtasks: [
      { title: "Check logs", done: true },
      { title: "Confirm fix", done: true },
    ],
  },
  {
    id: "TASK-1138",
    type: "Feature",
    title: "Generating the driver won't do anything, we need to quantify the SM",
    status: "In Progress",
    priority: "Low",
    subtasks: [
      { title: "Plan steps", done: true },
      { title: "Execute changes", done: false },
      { title: "Review result", done: false },
    ],
  },
]

export function TasksTable() {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[640px] rounded-xl border border-border/60 bg-background">
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
                  <div className="text-muted-foreground mt-1 text-xs">
                    Subtasks {row.subtasks.filter((item) => item.done).length}/
                    {row.subtasks.length} ·{" "}
                    {row.subtasks.slice(0, 2).map((item, index) => (
                      <span key={item.title}>
                        {item.title}
                        {index < 1 ? ", " : ""}
                      </span>
                    ))}
                    {row.subtasks.length > 2 ? "…" : ""}
                  </div>
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
    </div>
  )
}
