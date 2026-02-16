import type { ReactNode } from "react"

import { ObjectId } from "mongodb"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { verifyAuthToken } from "@/lib/auth"

async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const payload = token ? await verifyAuthToken(token) : null

  if (!payload || !ObjectId.isValid(payload.sub)) {
    redirect("/login")
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  await requireAuth()
  return children
}

