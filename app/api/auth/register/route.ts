import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { MongoServerError } from "mongodb"
import { ensureUserIndexes, getDb } from "@/lib/db"
import { signAuthToken } from "@/lib/auth"

const COOKIE_NAME = "auth_token"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name || "").trim()
    const email = String(body.email || "").trim().toLowerCase()
    const password = String(body.password || "")

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan password wajib diisi." },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password minimal 8 karakter." },
        { status: 400 }
      )
    }

    await ensureUserIndexes()
    const db = await getDb()
    const existing = await db.collection("users").findOne({ email })

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar." },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const result = await db.collection("users").insertOne({
      name,
      email,
      passwordHash,
      createdAt: new Date(),
    })

    const token = await signAuthToken({
      sub: result.insertedId.toString(),
      email,
    })

    const cookieStore = await cookies()
    cookieStore.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { error: "Email sudah terdaftar." },
        { status: 409 }
      )
    }
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi." },
      { status: 500 }
    )
  }
}
