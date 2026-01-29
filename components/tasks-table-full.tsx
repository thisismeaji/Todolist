"use client"

import type { CSSProperties } from "react"
import { useMemo, useState } from "react"

import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  MinusCircle,
  Plus,
  SlidersHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  createdAt: string
  updatedOn: string
  dueDate: string
  reminderAt: string
  subtasks: { title: string; done: boolean }[]
  recurring: string | null
  dependsOn: string[]
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
    createdAt: "2026-01-02",
    updatedOn: "2026-01-20",
    dueDate: "2026-01-24",
    reminderAt: "2026-01-23 09:00",
    subtasks: [
      { title: "Draft outline", done: true },
      { title: "Review technical notes", done: false },
      { title: "Finalize copy", done: false },
    ],
    recurring: "Weekly",
    dependsOn: ["TASK-7878"],
  },
  {
    id: "TASK-7878",
    type: "Documentation",
    title:
      "Try to calculate the EXE feed, maybe it will index the multi-byte pixel",
    status: "Todo",
    priority: "Medium",
    createdAt: "2026-01-04",
    updatedOn: "2026-01-22",
    dueDate: "2026-01-26",
    reminderAt: "2026-01-25 08:30",
    subtasks: [
      { title: "Collect inputs", done: true },
      { title: "Run quick check", done: true },
      { title: "Write summary", done: false },
    ],
    recurring: null,
    dependsOn: [],
  },
  {
    id: "TASK-7839",
    type: "Bug",
    title: "We need to bypass the neural TCP card",
    status: "Todo",
    priority: "High",
    createdAt: "2026-01-05",
    updatedOn: "2026-01-23",
    dueDate: "2026-01-23",
    reminderAt: "2026-01-22 18:00",
    subtasks: [
      { title: "Reproduce issue", done: true },
      { title: "Identify root cause", done: true },
      { title: "Add test", done: false },
    ],
    recurring: null,
    dependsOn: ["TASK-5562"],
  },
  {
    id: "TASK-5562",
    type: "Feature",
    title: "The SAS interface is down, bypass the open-source pixel",
    status: "In Progress",
    priority: "Low",
    createdAt: "2026-01-07",
    updatedOn: "2026-01-24",
    dueDate: "2026-01-30",
    reminderAt: "2026-01-29 09:00",
    subtasks: [
      { title: "List affected areas", done: true },
      { title: "Update interface", done: false },
    ],
    recurring: "Monthly",
    dependsOn: [],
  },
  {
    id: "TASK-8686",
    type: "Feature",
    title: "I'll parse the wireless SSL protocol, that should drive the API panel",
    status: "Todo",
    priority: "Low",
    createdAt: "2026-01-08",
    updatedOn: "2026-01-25",
    dueDate: "2026-01-27",
    reminderAt: "2026-01-27 07:30",
    subtasks: [
      { title: "Define scope", done: true },
      { title: "Write checklist", done: false },
    ],
    recurring: null,
    dependsOn: [],
  },
  {
    id: "TASK-1280",
    type: "Bug",
    title: "Use the digital TLS panel, then you can transmit the haptic system",
    status: "Done",
    priority: "High",
    createdAt: "2026-01-09",
    updatedOn: "2026-01-26",
    dueDate: "2026-01-21",
    reminderAt: "2026-01-20 16:00",
    subtasks: [
      { title: "Prep assets", done: true },
      { title: "Verify output", done: true },
    ],
    recurring: "Weekly",
    dependsOn: [],
  },
  {
    id: "TASK-7262",
    type: "Feature",
    title: "The UTF8 application is down, parse the neural bandwidth",
    status: "Done",
    priority: "High",
    createdAt: "2026-01-10",
    updatedOn: "2026-01-27",
    dueDate: "2026-01-22",
    reminderAt: "2026-01-21 10:00",
    subtasks: [
      { title: "Check logs", done: true },
      { title: "Confirm fix", done: true },
    ],
    recurring: null,
    dependsOn: ["TASK-7839"],
  },
  {
    id: "TASK-1138",
    type: "Feature",
    title: "Generating the driver won't do anything, we need to quantify the SM",
    status: "In Progress",
    priority: "Low",
    createdAt: "2026-01-11",
    updatedOn: "2026-01-28",
    dueDate: "2026-02-02",
    reminderAt: "2026-02-01 09:00",
    subtasks: [
      { title: "Plan steps", done: true },
      { title: "Execute changes", done: false },
      { title: "Review result", done: false },
    ],
    recurring: "Monthly",
    dependsOn: [],
  },
  {
    id: "TASK-4962",
    type: "Documentation",
    title: "Draft the release notes for the next sprint review",
    status: "Done",
    priority: "Medium",
    createdAt: "2026-01-12",
    updatedOn: "2026-01-28",
    dueDate: "2026-01-18",
    reminderAt: "2026-01-17 15:00",
    subtasks: [
      { title: "Gather notes", done: true },
      { title: "Publish summary", done: true },
    ],
    recurring: "Monthly",
    dependsOn: [],
  },
  {
    id: "TASK-6044",
    type: "Bug",
    title: "Fix the sync issue when saving recurring tasks",
    status: "In Progress",
    priority: "High",
    createdAt: "2026-01-13",
    updatedOn: "2026-01-29",
    dueDate: "2026-01-31",
    reminderAt: "2026-01-30 09:30",
    subtasks: [
      { title: "Investigate edge case", done: false },
      { title: "Ship fix", done: false },
    ],
    recurring: null,
    dependsOn: ["TASK-7262", "TASK-1280"],
  },
]

const statusOptions = ["Todo", "In Progress", "Done"] as const

type StatusOption = (typeof statusOptions)[number]

const priorityOptions = ["Low", "Medium", "High"] as const

type PriorityOption = (typeof priorityOptions)[number]

export function TasksTableFull() {
  const [query, setQuery] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<Set<StatusOption>>(
    () => new Set()
  )
  const [selectedPriorities, setSelectedPriorities] = useState<
    Set<PriorityOption>
  >(() => new Set())

  const statusCounts = useMemo(() => {
    return rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = (acc[row.status] ?? 0) + 1
      return acc
    }, {})
  }, [])

  const priorityCounts = useMemo(() => {
    return rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.priority] = (acc[row.priority] ?? 0) + 1
      return acc
    }, {})
  }, [])

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (
        selectedStatuses.size > 0 &&
        !selectedStatuses.has(row.status as StatusOption)
      ) {
        return false
      }
      if (
        selectedPriorities.size > 0 &&
        !selectedPriorities.has(row.priority as PriorityOption)
      ) {
        return false
      }
      if (!q) return true
      return (
        row.id.toLowerCase().includes(q) ||
        row.type.toLowerCase().includes(q) ||
        row.title.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q) ||
        row.priority.toLowerCase().includes(q)
      )
    })
  }, [query, selectedStatuses, selectedPriorities])

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <div className="flex flex-col gap-3 mb-4 min-w-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
          <Input
            placeholder="Filter tasks..."
            className="h-9 w-full min-w-0 sm:w-56"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-full sm:w-auto"
                >
                  <Plus className="size-4" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-background">
                {statusOptions.map((status) => {
                  const isChecked = selectedStatuses.has(status)
                  return (
                    <DropdownMenuItem
                      key={status}
                      className="flex items-center gap-2"
                      onSelect={(event) => event.preventDefault()}
                      onClick={() => {
                        setSelectedStatuses((prev) => {
                          const next = new Set(prev)
                          if (!isChecked) {
                            next.add(status)
                          } else {
                            next.delete(status)
                          }
                          return next
                        })
                      }}
                    >
                      <Checkbox checked={isChecked} aria-label={status} />
                      <span className="flex-1">{status}</span>
                      <span className="text-muted-foreground ml-auto tabular-nums text-xs">
                        {statusCounts[status] ?? 0}
                      </span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-full sm:w-auto"
                >
                  <Plus className="size-4" />
                  Priority
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-background">
                {priorityOptions.map((priority) => {
                  const isChecked = selectedPriorities.has(priority)
                  const { Icon, color } = priorityIcon[priority]
                  return (
                    <DropdownMenuItem
                      key={priority}
                      className="flex items-center gap-2"
                      onSelect={(event) => event.preventDefault()}
                      onClick={() => {
                        setSelectedPriorities((prev) => {
                          const next = new Set(prev)
                          if (!isChecked) {
                            next.add(priority)
                          } else {
                            next.delete(priority)
                          }
                          return next
                        })
                      }}
                    >
                      <Checkbox checked={isChecked} aria-label={priority} />
                      <span className="flex items-center gap-2 flex-1">
                        <Icon className={`size-4 ${color}`} />
                        <span>{priority}</span>
                      </span>
                      <span className="text-muted-foreground ml-auto tabular-nums text-xs">
                        {priorityCounts[priority] ?? 0}
                      </span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
          <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto">
            <SlidersHorizontal className="size-4" />
            View
          </Button>
          <Button size="sm" className="h-9 w-full sm:w-auto">
            <Plus className="size-4" />
            Add Task
          </Button>
        </div>
      </div>
      <div className="w-full max-w-full overflow-x-auto overscroll-x-contain">
        <Table className="min-w-[900px] w-full rounded-xl border border-border/60 bg-background">
        <TableHeader>
          <TableRow>
            <TableHead className="w-28 min-w-[6rem] whitespace-nowrap">
              Task
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-32">Created At</TableHead>
            <TableHead className="w-32">Updated On</TableHead>
            <TableHead className="w-32">Due</TableHead>
            <TableHead className="w-36">Reminder</TableHead>
            <TableHead className="w-40">Status</TableHead>
            <TableHead className="w-32">Priority</TableHead>
            <TableHead className="w-10 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRows.map((row) => {
            const { Icon: StatusIcon, color: statusColor, bg: statusBg } =
              statusIcon[row.status]
            const { Icon: PriorityIcon, color, bg } = priorityIcon[row.priority]
            return (
              <TableRow key={row.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {row.id}
                </TableCell>
                <TableCell className="min-w-[240px] sm:min-w-[320px]">
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
                  <div className="text-muted-foreground mt-1 text-xs">
                    {row.recurring ? `Recurring ${row.recurring}` : "One-time"}
                    {row.dependsOn.length > 0
                      ? ` · Depends on ${row.dependsOn.join(", ")}`
                      : ""}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.createdAt}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.updatedOn}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.dueDate}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.reminderAt}
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
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Open task actions"
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Ubah status</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="bg-background">
                          <DropdownMenuItem>Todo</DropdownMenuItem>
                          <DropdownMenuItem>In Progress</DropdownMenuItem>
                          <DropdownMenuItem>Done</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
          {filteredRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-muted-foreground text-center">
                No tasks match your filter.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 border-t border-border/60 p-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          {filteredRows.length} of {rows.length} row(s) shown.
        </span>
        <div className="flex flex-wrap items-center gap-3 text-foreground">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Rows per page</span>
            <Select defaultValue="25">
              <SelectTrigger className="h-8 w-[72px]">
                <SelectValue placeholder="25" />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-xs">Page 1 of 4</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-xs" aria-label="First page">
              <ChevronsLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon-xs" aria-label="Previous page">
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon-xs" aria-label="Next page">
              <ChevronRight className="size-4" />
            </Button>
            <Button variant="outline" size="icon-xs" aria-label="Last page">
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

