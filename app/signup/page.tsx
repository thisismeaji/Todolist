import { SignupForm } from "@/components/signup-form"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAuthToken } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"

export default async function SignupPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const payload = token ? await verifyAuthToken(token) : null

  if (payload && ObjectId.isValid(payload.sub)) {
    const db = await getDb()
    const user = await db.collection("users").findOne({
      _id: new ObjectId(payload.sub),
    })

    if (user) {
      redirect("/dashboard")
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  )
}
