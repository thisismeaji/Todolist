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

  if (!title) {
    return NextResponse.json(
      { error: "Judul task wajib diisi." },
      { status: 400 }
    )
  }

  await ensureUserIndexes()
  const db = await getDb()
  const result = await db.collection("tasks").insertOne({
    userId: new ObjectId(userId),
    title,
    completed: false,
    createdAt: new Date(),
  })

  return NextResponse.json({
    task: {
      id: result.insertedId.toString(),
      title,
      completed: false,
      createdAt: new Date(),
    },
  })
}
