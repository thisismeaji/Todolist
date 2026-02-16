"use client"

import type { CSSProperties } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { format } from "date-fns"

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
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
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
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

type ApiTask = {
  id: string
  title: string
  completed: boolean
  createdAt: string | Date
  updatedAt?: string | Date
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
  reminderAt?: string | null
}

function formatIsoDate(input: string | Date) {
  const date = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().slice(0, 10)
}

function formatDateTimeValue(value?: string | null) {
  if (!value) return ""
  return value.replace("T", " ")
}

function formatDateOnlyValue(value?: string | null) {
  if (!value) return ""
  return value
}

function toDateOnlyString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function toDateTimeLocalString(date: Date, time: string) {
  const datePart = toDateOnlyString(date)
  const safeTime = /^\d{2}:\d{2}$/.test(time) ? time : "09:00"
  return `${datePart}T${safeTime}`
}

function apiTaskToRow(task: ApiTask): TaskRow {
  const createdAt = formatIsoDate(task.createdAt)
  const updatedOn = task.updatedAt ? formatIsoDate(task.updatedAt) : createdAt
  const status = task.status ?? (task.completed ? "Done" : "Todo")
  const priority = task.priority ?? "Medium"
  return {
    id: task.id,
    type: "Task",
    title: task.title,
    status,
    priority,
    createdAt,
    updatedOn,
    dueDate: formatDateOnlyValue(task.dueDate),
    reminderAt: formatDateTimeValue(task.reminderAt),
    subtasks: [],
    recurring: null,
    dependsOn: [],
  }
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

const seedRows: TaskRow[] = [
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
  const [tasks, setTasks] = useState<ApiTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set())

  const [query, setQuery] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<Set<StatusOption>>(
    () => new Set()
  )
  const [selectedPriorities, setSelectedPriorities] = useState<
    Set<PriorityOption>
  >(() => new Set())

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [keepAdding, setKeepAdding] = useState(false)
  const [isDuePickerOpen, setIsDuePickerOpen] = useState(false)
  const [isReminderPickerOpen, setIsReminderPickerOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<
    { id: string; title: string } | null
  >(null)
  const [draft, setDraft] = useState(() => ({
    title: "",
    status: "Todo" as TaskStatus,
    priority: "Medium" as TaskPriority,
    dueDate: undefined as Date | undefined,
    reminderDate: undefined as Date | undefined,
    reminderTime: "",
  }))
  const titleInputRef = useRef<HTMLInputElement>(null)

  const rows = useMemo(() => tasks.map(apiTaskToRow), [tasks])

  const statusCounts = useMemo(() => {
    return rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = (acc[row.status] ?? 0) + 1
      return acc
    }, {})
  }, [rows])

  const priorityCounts = useMemo(() => {
    return rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.priority] = (acc[row.priority] ?? 0) + 1
      return acc
    }, {})
  }, [rows])

  async function refetchTasks() {
    try {
      const response = await fetch("/api/tasks", { method: "GET" })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login"
          return
        }
        return
      }

      setTasks(Array.isArray(data.tasks) ? data.tasks : [])
    } catch {
      // Ignore background refresh errors.
    }
  }

  useEffect(() => {
    let isActive = true

    async function load() {
      try {
        const response = await fetch("/api/tasks", { method: "GET" })
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login"
            return
          }
          toast.error(data.error || "Failed to load tasks.")
          return
        }

        if (isActive) {
          setTasks(Array.isArray(data.tasks) ? data.tasks : [])
        }
      } catch {
        toast.error("Failed to load tasks.")
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    load()
    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (!isAddOpen) return
    const id = window.setTimeout(() => titleInputRef.current?.focus(), 80)
    return () => window.clearTimeout(id)
  }, [isAddOpen])

  async function createTask(payload: {
    title: string
    status: TaskStatus
    priority: TaskPriority
    dueDate?: string | null
    reminderAt?: string | null
  }) {
    const title = payload.title.trim()
    if (!title || isCreating) return

    setIsCreating(true)
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          status: payload.status,
          priority: payload.priority,
          dueDate: payload.dueDate ?? null,
          reminderAt: payload.reminderAt ?? null,
        }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        toast.error(data.error || "Failed to add task.")
        return
      }

      setTasks((prev) => [data.task, ...prev])
      toast.success("Task added.")

      if (keepAdding) {
        setDraft((prev) => ({ ...prev, title: "" }))
        window.setTimeout(() => titleInputRef.current?.focus(), 50)
      } else {
        setIsAddOpen(false)
      }
    } catch {
      toast.error("Failed to add task.")
    } finally {
      setIsCreating(false)
    }
  }

  async function patchTask(
    taskId: string,
    update: Partial<{
      completed: boolean
      status: TaskStatus
      priority: TaskPriority
      dueDate: string | null
      reminderAt: string | null
    }>
  ) {
    setPendingIds((prev) => new Set(prev).add(taskId))
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        toast.error(data.error || "Failed to update task.")
        if (response.status === 404) {
          void refetchTasks()
        }
        return
      }

      if (update.status) {
        toast.success(`Status updated to ${update.status}.`)
      } else if (update.priority) {
        toast.success(`Priority updated to ${update.priority}.`)
      } else {
        toast.success("Task updated.")
      }

      if (data?.task?.id) {
        const updatedId = String(data.task.id)
        setTasks((prev) =>
          prev.map((task) => (task.id === updatedId ? data.task : task))
        )
        setPendingIds((prev) => {
          const next = new Set(prev)
          next.delete(taskId)
          next.delete(updatedId)
          return next
        })
      }

      void refetchTasks()
    } catch {
      toast.error("Failed to update task.")
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(taskId)
        return next
      })
    }
  }

  function setTaskStatus(taskId: string, status: TaskStatus) {
    return patchTask(taskId, { status })
  }

  function setTaskPriority(taskId: string, priority: TaskPriority) {
    return patchTask(taskId, { priority })
  }

  async function deleteTask(taskId: string) {
    setPendingIds((prev) => new Set(prev).add(taskId))
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        toast.error(data.error || "Failed to delete task.")
        return false
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId))
      toast.success("Task deleted.")
      return true
    } catch {
      toast.error("Failed to delete task.")
      return false
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(taskId)
        return next
      })
    }
  }

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
  }, [query, rows, selectedStatuses, selectedPriorities])

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
            <DialogDescription>
              This action can’t be undone. This will permanently delete{" "}
              <span className="text-foreground font-medium">
                {deleteTarget?.title || "this task"}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-t border-border/60">
            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={deleteTarget ? pendingIds.has(deleteTarget.id) : false}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                disabled={deleteTarget ? pendingIds.has(deleteTarget.id) : true}
                onClick={async () => {
                  if (!deleteTarget) return
                  const ok = await deleteTask(deleteTarget.id)
                  if (ok) setDeleteTarget(null)
                }}
              >
                {deleteTarget && pendingIds.has(deleteTarget.id)
                  ? "Deleting..."
                  : "Delete"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
          <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto">
            <SlidersHorizontal className="size-4" />
            View
          </Button>
          <Dialog
            open={isAddOpen}
            onOpenChange={(open) => {
              setIsAddOpen(open)
              if (!open) {
                setDraft({
                  title: "",
                  status: "Todo",
                  priority: "Medium",
                  dueDate: undefined,
                  reminderDate: undefined,
                  reminderTime: "",
                })
                setKeepAdding(false)
                setIsDuePickerOpen(false)
                setIsReminderPickerOpen(false)
              }
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 w-full sm:w-auto">
                <Plus className="size-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Add task</DialogTitle>
                <DialogDescription>
                  Create a new task quickly without leaving the table.
                </DialogDescription>
              </DialogHeader>
              <form
                className="flex flex-1 flex-col"
                onSubmit={(event) => {
                  event.preventDefault()
                  void createTask({
                    title: draft.title,
                    status: draft.status,
                    priority: draft.priority,
                    dueDate: draft.dueDate ? toDateOnlyString(draft.dueDate) : null,
                    reminderAt:
                      draft.reminderDate && draft.reminderTime
                        ? toDateTimeLocalString(
                            draft.reminderDate,
                            draft.reminderTime
                          )
                        : null,
                  })
                }}
              >
                <div className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4">
                  <div className="min-w-0 flex flex-col gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-task-title">Title</Label>
                      <Input
                        id="new-task-title"
                        ref={titleInputRef}
                        value={draft.title}
                        onChange={(event) =>
                          setDraft((prev) => ({ ...prev, title: event.target.value }))
                        }
                        placeholder="e.g. Pay electricity bill, finish assignment..."
                        aria-label="Task title"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Status</Label>
                        <Select
                          value={draft.status}
                          onValueChange={(value) =>
                            setDraft((prev) => ({
                              ...prev,
                              status: value as TaskStatus,
                            }))
                          }
                        >
                          <SelectTrigger className="h-9">
                            <span className="flex min-w-0 items-center gap-2">
                              <span
                                className="activity-bg flex size-6 items-center justify-center rounded-full"
                                style={
                                  {
                                    "--activity-bg": statusIcon[draft.status].bg,
                                  } as CSSProperties
                                }
                              >
                                {(() => {
                                  const { Icon, color } = statusIcon[draft.status]
                                  return <Icon className={`size-4 ${color}`} />
                                })()}
                              </span>
                              <span className="min-w-0 flex-1 truncate text-left">
                                {draft.status}
                              </span>
                            </span>
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            {statusOptions.map((status) => (
                              <SelectItem
                                key={status}
                                value={status}
                                textValue={status}
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    className="activity-bg flex size-6 items-center justify-center rounded-full"
                                    style={
                                      {
                                        "--activity-bg": statusIcon[status].bg,
                                      } as CSSProperties
                                    }
                                  >
                                    {(() => {
                                      const { Icon, color } = statusIcon[status]
                                      return <Icon className={`size-4 ${color}`} />
                                    })()}
                                  </span>
                                  <span className="flex-1">{status}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Priority</Label>
                        <Select
                          value={draft.priority}
                          onValueChange={(value) =>
                            setDraft((prev) => ({
                              ...prev,
                              priority: value as TaskPriority,
                            }))
                          }
                        >
                          <SelectTrigger className="h-9">
                            <span className="flex min-w-0 items-center gap-2">
                              <span
                                className="activity-bg flex size-6 items-center justify-center rounded-full"
                                style={
                                  {
                                    "--activity-bg":
                                      priorityIcon[draft.priority].bg,
                                  } as CSSProperties
                                }
                              >
                                {(() => {
                                  const { Icon, color } = priorityIcon[draft.priority]
                                  return <Icon className={`size-4 ${color}`} />
                                })()}
                              </span>
                              <span className="min-w-0 flex-1 truncate text-left">
                                {draft.priority}
                              </span>
                            </span>
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            {priorityOptions.map((priority) => (
                              <SelectItem
                                key={priority}
                                value={priority}
                                textValue={priority}
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    className="activity-bg flex size-6 items-center justify-center rounded-full"
                                    style={
                                      {
                                        "--activity-bg":
                                          priorityIcon[priority].bg,
                                      } as CSSProperties
                                    }
                                  >
                                    {(() => {
                                      const { Icon, color } = priorityIcon[priority]
                                      return <Icon className={`size-4 ${color}`} />
                                    })()}
                                  </span>
                                  <span className="flex-1">{priority}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Due date</Label>
                        <div className="flex items-center gap-2">
                          <Popover
                            open={isDuePickerOpen}
                            onOpenChange={setIsDuePickerOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="h-9 min-w-0 flex-1 justify-start font-normal"
                              >
                                <span className="min-w-0 flex-1 truncate text-left">
                                  {draft.dueDate ? (
                                    format(draft.dueDate, "PPP")
                                  ) : (
                                    <span className="text-muted-foreground">
                                      Pick a date
                                    </span>
                                  )}
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={draft.dueDate}
                                onSelect={(value) => {
                                  setDraft((prev) => ({
                                    ...prev,
                                    dueDate: value ?? undefined,
                                  }))
                                  if (value) setIsDuePickerOpen(false)
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {draft.dueDate ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              className="h-9 w-9"
                              aria-label="Clear due date"
                              onClick={() =>
                                setDraft((prev) => ({ ...prev, dueDate: undefined }))
                              }
                            >
                              <X className="size-4" />
                            </Button>
                          ) : null}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Reminder</Label>
                        <div className="flex gap-2">
                          <Popover
                            open={isReminderPickerOpen}
                            onOpenChange={setIsReminderPickerOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="h-9 min-w-0 flex-1 justify-start font-normal"
                              >
                                <span className="min-w-0 flex-1 truncate text-left">
                                  {draft.reminderDate ? (
                                    format(draft.reminderDate, "PPP")
                                  ) : (
                                    <span className="text-muted-foreground">
                                      Pick a date
                                    </span>
                                  )}
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={draft.reminderDate}
                                onSelect={(value) => {
                                  setDraft((prev) => ({
                                    ...prev,
                                    reminderDate: value ?? undefined,
                                    reminderTime:
                                      value && !prev.reminderTime
                                        ? "09:00"
                                        : prev.reminderTime,
                                  }))
                                  if (value) setIsReminderPickerOpen(false)
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <Input
                            type="time"
                            className="h-9 w-28"
                            value={draft.reminderTime}
                            disabled={!draft.reminderDate}
                            onChange={(event) =>
                              setDraft((prev) => ({
                                ...prev,
                                reminderTime: event.target.value,
                              }))
                            }
                            aria-label="Reminder time"
                          />
                          {draft.reminderDate || draft.reminderTime ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              className="h-9 w-9"
                              aria-label="Clear reminder"
                              onClick={() =>
                                setDraft((prev) => ({
                                  ...prev,
                                  reminderDate: undefined,
                                  reminderTime: "",
                                }))
                              }
                            >
                              <X className="size-4" />
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-2">
                      <Checkbox
                        checked={keepAdding}
                        onCheckedChange={(value) => setKeepAdding(Boolean(value))}
                        aria-label="Keep dialog open after saving"
                      />
                      <div className="grid gap-0.5">
                        <p className="text-sm font-medium leading-none">
                          Keep adding
                        </p>
                        <p className="text-muted-foreground text-sm">
                          After submit, the dialog stays open and the title is cleared.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="border-t border-border/60">
                  <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={isCreating}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={isCreating || !draft.title.trim()}
                    >
                      {isCreating ? "Adding..." : "Add Task"}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-muted-foreground text-center">
                Loading tasks...
              </TableCell>
            </TableRow>
          ) : null}
          {filteredRows.map((row) => {
            const { Icon: StatusIcon, color: statusColor, bg: statusBg } =
              statusIcon[row.status]
            const { Icon: PriorityIcon, color, bg } = priorityIcon[row.priority]
            const isPending = pendingIds.has(row.id)
            const [reminderDate, reminderTime] = row.reminderAt
              ? row.reminderAt.split(" ")
              : ["", ""]
            return (
              <TableRow key={row.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {row.id.slice(0, 8)}
                </TableCell>
                <TableCell className="min-w-[240px] sm:min-w-[320px]">
                  <span className="text-foreground line-clamp-1">
                    {row.title}
                  </span>
                  {row.subtasks.length > 0 ? (
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
                  ) : null}
                  {row.recurring || row.dependsOn.length > 0 ? (
                    <div className="text-muted-foreground mt-1 text-xs">
                    {row.recurring ? `Recurring ${row.recurring}` : "One-time"}
                    {row.dependsOn.length > 0
                      ? ` · Depends on ${row.dependsOn.join(", ")}`
                      : ""}
                    </div>
                  ) : null}
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
                  {row.reminderAt ? (
                    <div className="flex flex-col leading-tight">
                      <span>{reminderDate}</span>
                      {reminderTime ? (
                        <span className="text-muted-foreground/80 tabular-nums text-xs">
                          {reminderTime}
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    ""
                  )}
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
                        disabled={isPending}
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background">
                      <DropdownMenuItem
                        onSelect={() => {
                          void setTaskStatus(
                            row.id,
                            row.status === "Done" ? "Todo" : "Done"
                          )
                        }}
                      >
                        {row.status === "Done" ? "Mark as Todo" : "Mark as Done"}
                      </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="bg-background">
                          <DropdownMenuItem
                            onSelect={() => {
                              void setTaskStatus(row.id, "Todo")
                            }}
                          >
                            Todo
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              void setTaskStatus(row.id, "In Progress")
                            }}
                          >
                            In Progress
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Change priority</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="bg-background">
                          {priorityOptions.map((priority) => (
                            <DropdownMenuItem
                              key={priority}
                              onSelect={() => {
                                void setTaskPriority(row.id, priority)
                              }}
                            >
                              {priority}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => {
                          setDeleteTarget({ id: row.id, title: row.title })
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
          {!isLoading && filteredRows.length === 0 ? (
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
