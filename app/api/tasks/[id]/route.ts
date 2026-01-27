import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { verifyAuthToken } from "@/lib/auth"
import { ensureUserIndexes, getDb } from "@/lib/db"

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
  const completed = Boolean(body.completed)

  const { id } = await params
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid task id." }, { status: 400 })
  }

  await ensureUserIndexes()
  const db = await getDb()
  const result = await db.collection("tasks").findOneAndUpdate(
    {
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    },
    { $set: { completed } },
    { returnDocument: "after" }
  )

  if (!result.value) {
    return NextResponse.json({ error: "Task tidak ditemukan." }, { status: 404 })
  }

  return NextResponse.json({
    task: {
      id: result.value._id.toString(),
      title: result.value.title,
      completed: result.value.completed,
      createdAt: result.value.createdAt,
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
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid task id." }, { status: 400 })
  }

  await ensureUserIndexes()
  const db = await getDb()
  const result = await db.collection("tasks").deleteOne({
    _id: new ObjectId(id),
    userId: new ObjectId(userId),
  })

  if (!result.deletedCount) {
    return NextResponse.json({ error: "Task tidak ditemukan." }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
