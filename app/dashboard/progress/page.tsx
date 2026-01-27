import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAuthToken } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"

export default async function ProgressPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const payload = token ? await verifyAuthToken(token) : null

  if (!payload || !ObjectId.isValid(payload.sub)) {
    redirect("/login")
  }

  const db = await getDb()
  const user = await db.collection("users").findOne({
    _id: new ObjectId(payload.sub),
  })

  if (!user) {
    redirect("/login")
  }

  const userObjectId = new ObjectId(payload.sub)
  const totalTasks = await db.collection("tasks").countDocuments({
    userId: userObjectId,
  })
  const completedTasks = await db.collection("tasks").countDocuments({
    userId: userObjectId,
    completed: true,
  })
  const pendingTasks = totalTasks - completedTasks
  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: user.name || user.email?.split("@")[0] || "User",
          email: user.email || "",
        }}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Productivity
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Progress</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="border-border/60 bg-card/50 flex flex-col gap-4 rounded-xl border p-6">
            <div>
              <h2 className="text-lg font-semibold">Progress Overview</h2>
              <p className="text-muted-foreground text-sm">
                Ringkasan progress task kamu.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="border-border/60 bg-background/40 rounded-lg border p-4">
                <p className="text-muted-foreground text-xs uppercase">
                  Total Tasks
                </p>
                <p className="text-2xl font-semibold">{totalTasks}</p>
              </div>
              <div className="border-border/60 bg-background/40 rounded-lg border p-4">
                <p className="text-muted-foreground text-xs uppercase">
                  Completed
                </p>
                <p className="text-2xl font-semibold">{completedTasks}</p>
              </div>
              <div className="border-border/60 bg-background/40 rounded-lg border p-4">
                <p className="text-muted-foreground text-xs uppercase">
                  Pending
                </p>
                <p className="text-2xl font-semibold">{pendingTasks}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="bg-muted/60 h-2 rounded-full">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-[width]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
