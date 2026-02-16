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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))

  const updates: Record<string, unknown> = {}

  if ("title" in body) {
    const title = String(body.title || "").trim()
    if (!title) {
      return NextResponse.json(
        { error: "Task title is required." },
        { status: 400 }
      )
    }
    updates.title = title
  }

  const hasCompleted = typeof body.completed === "boolean"
  if (hasCompleted) {
    updates.completed = body.completed
    updates.status = body.completed ? "Done" : "Todo"
  }

  if ("status" in body) {
    if (!isTaskStatus(body.status)) {
      return NextResponse.json(
        { error: "Invalid status." },
        { status: 400 }
      )
    }
    updates.status = body.status
    updates.completed = body.status === "Done"
  }

  if ("priority" in body) {
    if (!isTaskPriority(body.priority)) {
      return NextResponse.json(
        { error: "Invalid priority." },
        { status: 400 }
      )
    }
    updates.priority = body.priority
  }

  if ("dueDate" in body) {
    const normalized = normalizeDateOnly(body.dueDate)
    if (normalized === null) {
      return NextResponse.json(
        { error: "Invalid due date format." },
        { status: 400 }
      )
    }
    if (normalized !== undefined) {
      updates.dueDate = normalized
    }
  }

  if ("reminderAt" in body) {
    const normalized = normalizeDateTimeLocal(body.reminderAt)
    if (normalized === null) {
      return NextResponse.json(
        { error: "Invalid reminder format." },
        { status: 400 }
      )
    }
    if (normalized !== undefined) {
      updates.reminderAt = normalized
    }
  }

  const { id } = await params
  const canUseObjectId = ObjectId.isValid(id)

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No changes to save." },
      { status: 400 }
    )
  }

  await ensureUserIndexes()
  const db = await getDb()
  updates.updatedAt = new Date()

  const ownerId = new ObjectId(userId)
  const filters = canUseObjectId
    ? [
        { _id: new ObjectId(id), userId: ownerId },
        { _id: id, userId: ownerId },
      ]
    : [{ _id: id, userId: ownerId }]

  let result: any = null

  for (const filter of filters) {
    // eslint-disable-next-line no-await-in-loop
    result = await db.collection("tasks").findOneAndUpdate(
      filter as any,
      { $set: updates },
      { returnDocument: "after", includeResultMetadata: true }
    )
    if (result?.value) break
  }

  if (!result || !result.value) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 })
  }

  return NextResponse.json({
    task: {
      id: result.value._id.toString(),
      title: result.value.title,
      completed: result.value.completed,
      createdAt: result.value.createdAt,
      updatedAt: result.value.updatedAt ?? result.value.createdAt,
      status: result.value.status ?? (result.value.completed ? "Done" : "Todo"),
      priority: result.value.priority ?? "Medium",
      dueDate: result.value.dueDate ?? null,
      reminderAt: result.value.reminderAt ?? null,
    },
  })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const canUseObjectId = ObjectId.isValid(id)

  await ensureUserIndexes()
  const db = await getDb()

  const ownerId = new ObjectId(userId)
  const filters = canUseObjectId
    ? [
        { _id: new ObjectId(id), userId: ownerId },
        { _id: id, userId: ownerId },
      ]
    : [{ _id: id, userId: ownerId }]

  let result = { deletedCount: 0 }
  for (const filter of filters) {
    // eslint-disable-next-line no-await-in-loop
    const attempt = await db.collection("tasks").deleteOne(filter as any)
    if (attempt.deletedCount) {
      result = attempt
      break
    }
  }

  if (!result.deletedCount) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
