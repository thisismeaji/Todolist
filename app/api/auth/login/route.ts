import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { ensureUserIndexes, getDb } from "@/lib/db"
import { signAuthToken } from "@/lib/auth"

const COOKIE_NAME = "auth_token"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email || "").trim().toLowerCase()
    const password = String(body.password || "")

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi." },
        { status: 400 }
      )
    }

    await ensureUserIndexes()
    const db = await getDb()
    const user = await db.collection("users").findOne({ email })

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Email atau password salah." },
        { status: 401 }
      )
    }

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) {
      return NextResponse.json(
        { error: "Email atau password salah." },
        { status: 401 }
      )
    }

    const token = await signAuthToken({
      sub: user._id.toString(),
      email: user.email,
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
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat login." },
      { status: 500 }
    )
  }
}
