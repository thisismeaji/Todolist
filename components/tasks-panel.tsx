"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: string | Date
}

type TasksPanelProps = {
  initialTasks: Task[]
}

export function TasksPanel({ initialTasks }: TasksPanelProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        toast.error(data.error || "Gagal menambahkan task.")
        return
      }

      setTasks((prev) => [data.task, ...prev])
      setTitle("")
      toast.success("Task ditambahkan.")
    } catch {
      toast.error("Gagal menambahkan task.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function toggleTask(taskId: string, completed: boolean) {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        toast.error(data.error || "Gagal memperbarui task.")
        return
      }

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? data.task : task))
      )
    } catch {
      toast.error("Gagal memperbarui task.")
    }
  }

  async function deleteTask(taskId: string) {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        toast.error(data.error || "Gagal menghapus task.")
        return
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId))
      toast.success("Task dihapus.")
    } catch {
      toast.error("Gagal menghapus task.")
    }
  }

  return (
    <Card className="bg-card/50 border-border/60">
      <CardContent className="flex flex-col gap-4 p-6">
        <div>
          <h2 className="text-lg font-semibold">My Tasks</h2>
          <p className="text-muted-foreground text-sm">
            Task ini tersimpan per user menggunakan userId.
          </p>
        </div>
        <form onSubmit={handleCreate} className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Tulis task baru..."
            aria-label="Task title"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menambah..." : "Tambah"}
          </Button>
        </form>
        <div className="flex flex-col gap-2">
          {tasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Belum ada task. Tambahkan yang pertama ya!
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="border-border/60 bg-background/40 flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id, !task.completed)}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      task.completed ? "bg-emerald-500" : "bg-amber-400"
                    }`}
                  />
                  <span
                    className={
                      task.completed
                        ? "text-muted-foreground line-through"
                        : ""
                    }
                  >
                    {task.title}
                  </span>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                >
                  Hapus
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
