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
import { TasksPanel } from "@/components/tasks-panel"

export default async function TasksPage() {
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

  const tasks = await db
    .collection("tasks")
    .find({ userId: new ObjectId(payload.sub) })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray()

  const initialTasks = tasks.map((task) => ({
    id: task._id.toString(),
    title: task.title,
    completed: task.completed,
    createdAt: task.createdAt,
  }))

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
                  <BreadcrumbPage>Task List</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <TasksPanel initialTasks={initialTasks} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
