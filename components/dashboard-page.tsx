import type { ReactNode } from "react"
import { ObjectId } from "mongodb"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAuthToken } from "@/lib/auth"
import { getDb } from "@/lib/db"
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

import { AppSidebar } from "@/components/app-sidebar"
import { SearchPanel } from "@/components/search-panel"

type DashboardPageProps = {
  title: string
  showBreadcrumbRoot?: boolean
  children?: ReactNode
}

type DbUser = {
  _id: ObjectId
  name?: string
  email?: string
}

async function requireUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const payload = token ? await verifyAuthToken(token) : null

  if (!payload || !ObjectId.isValid(payload.sub)) {
    redirect("/login")
  }

  const db = await getDb()
  const user = await db.collection<DbUser>("users").findOne({
    _id: new ObjectId(payload.sub),
  })

  if (!user) {
    redirect("/login")
  }

  return user
}

export async function DashboardPage({
  title,
  showBreadcrumbRoot = true,
  children,
}: DashboardPageProps) {
  const user = await requireUser()

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: user.name || user.email?.split("@")[0] || "User",
          email: user.email || "",
        }}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {showBreadcrumbRoot ? (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/dashboard">
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <SearchPanel />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
