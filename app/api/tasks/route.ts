import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { verifyAuthToken } from "@/lib/auth"
import { ensureUserIndexes, getDb } from "@/lib/db"

const statusOptions = ["Todo", "In Progress", "Done"] as const
const priorityOptions = ["Low", "Medium", "High"] as const

type TaskStatus = (typeof statusOptions)[number]
type TaskPriority = (typeof priorityOptions)[number]

function isTaskStatus(value: unknown): value is TaskStatus {
  return (
    typeof value === "string" &&
    (statusOptions as readonly string[]).includes(value)
  )
}

function isTaskPriority(value: unknown): value is TaskPriority {
  return (
    typeof value === "string" && (priorityOptions as readonly string[]).includes(value)
  )
}

function normalizeDateOnly(value: unknown) {
  const str = typeof value === "string" ? value.trim() : ""
  if (str === "") return undefined
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null
  return str
}

function normalizeDateTimeLocal(value: unknown) {
  const str = typeof value === "string" ? value.trim() : ""
  if (str === "") return undefined
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(str)) return null
  return str
}

async function requireUserId() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  if (!token) return null
  const payload = await verifyAuthToken(token)
  if (!payload) return null
  return payload.sub
}

export async function GET() {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await ensureUserIndexes()
  const db = await getDb()
  const tasks = await db
    .collection("tasks")
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray()

  const data = tasks.map((task) => ({
    id: task._id.toString(),
    title: task.title,
    completed: task.completed,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt ?? task.createdAt,
    status: task.status ?? (task.completed ? "Done" : "Todo"),
    priority: task.priority ?? "Medium",
    dueDate: task.dueDate ?? null,
    reminderAt: task.reminderAt ?? null,
  }))

  return NextResponse.json({ tasks: data })
}

export async function POST(request: Request) {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const title = String(body.title || "").trim()
  const status: TaskStatus = isTaskStatus(body.status) ? body.status : "Todo"
  const priority: TaskPriority = isTaskPriority(body.priority)
    ? body.priority
    : "Medium"

  const normalizedDue = "dueDate" in body ? normalizeDateOnly(body.dueDate) : undefined
  if (normalizedDue === null) {
    return NextResponse.json(
      { error: "Invalid due date format." },
      { status: 400 }
    )
  }

  const normalizedReminder =
    "reminderAt" in body ? normalizeDateTimeLocal(body.reminderAt) : undefined
  if (normalizedReminder === null) {
    return NextResponse.json(
      { error: "Invalid reminder format." },
      { status: 400 }
    )
  }

  const dueDate = normalizedDue ?? null
  const reminderAt = normalizedReminder ?? null

  if (!title) {
    return NextResponse.json(
      { error: "Task title is required." },
      { status: 400 }
    )
  }

  await ensureUserIndexes()
  const db = await getDb()
  const now = new Date()
  const completed = status === "Done"
  const result = await db.collection("tasks").insertOne({
    userId: new ObjectId(userId),
    title,
    completed,
    status,
    priority,
    dueDate,
    reminderAt,
    createdAt: now,
    updatedAt: now,
  })

  return NextResponse.json({
    task: {
      id: result.insertedId.toString(),
      title,
      completed,
      status,
      priority,
      dueDate,
      reminderAt,
      createdAt: now,
      updatedAt: now,
    },
  })
}
