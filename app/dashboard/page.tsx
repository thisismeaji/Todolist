import { DashboardPage } from "@/components/dashboard-page"
import { ArrowDownCircle, ArrowUpCircle, MinusCircle } from "lucide-react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards, type SectionCardsMetrics } from "@/components/section-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CSSProperties } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ObjectId } from "mongodb"
import { verifyAuthToken } from "@/lib/auth"
import { ensureUserIndexes, getDb } from "@/lib/db"
import { formatDistanceToNow } from "date-fns"

type TaskStatus = "Todo" | "In Progress" | "Done"
type TaskPriority = "Low" | "Medium" | "High"

type DbTask = {
  _id: ObjectId
  userId: ObjectId
  title: string
  completed?: boolean
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
  createdAt?: Date
  updatedAt?: Date
}

function toDateKeyUtc(date: Date) {
  return date.toISOString().slice(0, 10)
}

function addDaysUtc(base: Date, days: number) {
  const next = new Date(base)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function deltaPct(current: number, previous: number) {
  if (previous <= 0) return null
  return ((current - previous) / previous) * 100
}

function formatDueLabel(dueDate: string) {
  const [year, month, day] = dueDate.split("-").map((v) => Number(v))
  if (!year || !month || !day) return dueDate
  const date = new Date(Date.UTC(year, month - 1, day))
  const today = new Date()
  const todayUtc = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  )
  const tomorrowUtc = addDaysUtc(todayUtc, 1)

  const dateKey = toDateKeyUtc(date)
  if (dateKey === toDateKeyUtc(todayUtc)) return "Today"
  if (dateKey === toDateKeyUtc(tomorrowUtc)) return "Tomorrow"

  return date.toLocaleDateString("en-US", { weekday: "short" })
}

function priorityRank(priority: TaskPriority | undefined) {
  if (priority === "High") return 3
  if (priority === "Medium") return 2
  return 1
}

async function requireUserId() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const payload = token ? await verifyAuthToken(token) : null

  if (!payload || !ObjectId.isValid(payload.sub)) {
    redirect("/login")
  }

  return payload.sub
}

function activityMeta(priority: TaskPriority) {
  if (priority === "High") {
    return {
      Icon: ArrowUpCircle,
      color: "text-red-600",
      bg: "rgba(220, 38, 38, 0.15)",
      label: "High priority",
    }
  }
  if (priority === "Low") {
    return {
      Icon: ArrowDownCircle,
      color: "text-lime-600",
      bg: "rgba(132, 204, 22, 0.15)",
      label: "Low priority",
    }
  }
  return {
    Icon: MinusCircle,
    color: "text-violet-600",
    bg: "rgba(139, 92, 246, 0.15)",
    label: "Medium priority",
  }
}

export default async function Page() {
  const userId = await requireUserId()

  await ensureUserIndexes()
  const db = await getDb()

  const today = new Date()
  const endDate = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  )
  const startDate = new Date(endDate)
  startDate.setUTCDate(startDate.getUTCDate() - 89)
  const start30 = addDaysUtc(endDate, -30)
  const start60 = addDaysUtc(endDate, -60)
  const todayKey = toDateKeyUtc(endDate)
  const prevTodayKey = toDateKeyUtc(addDaysUtc(endDate, -30))
  const next7Key = toDateKeyUtc(addDaysUtc(endDate, 7))

  let productivitySeries = Array.from({ length: 90 }, (_, index) => {
    const date = new Date(startDate)
    date.setUTCDate(startDate.getUTCDate() + index)
    const key = toDateKeyUtc(date)
    return {
      date: key,
      created: 0,
      completed: 0,
    }
  })

  let latestTasks: DbTask[] = []
  let metrics: SectionCardsMetrics = {
    completedTotal: 0,
    completedDeltaPct: null,
    overdueTotal: 0,
    overdueDeltaPct: null,
    activeTotal: 0,
    activeDeltaPct: null,
    productivityScore: 0,
    productivityDeltaPct: null,
  }
  let upcomingTasks: Array<{ title: string; dueDate: string }> = []
  let focusTasks: Array<{ title: string; priority: TaskPriority }> = []

  try {
    const ownerId = new ObjectId(userId)
    const doneFilter = { $or: [{ status: "Done" }, { completed: true }] }
    const notDoneFilter = {
      $and: [{ completed: { $ne: true } }, { status: { $ne: "Done" } }],
    }

    const [createdAgg, completedAgg, latest] = await Promise.all([
      db
        .collection<DbTask>("tasks")
        .aggregate<{ _id: string; count: number }>([
          {
            $match: {
              userId: ownerId,
              createdAt: { $gte: startDate },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
      db
        .collection<DbTask>("tasks")
        .aggregate<{ _id: string; count: number }>([
          {
            $match: {
              userId: ownerId,
              $or: [{ status: "Done" }, { completed: true }],
            },
          },
          {
            $addFields: {
              doneAt: { $ifNull: ["$updatedAt", "$createdAt"] },
            },
          },
          {
            $match: {
              doneAt: { $gte: startDate },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$doneAt" },
              },
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
      db
        .collection<DbTask>("tasks")
        .find({ userId: ownerId })
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(8)
        .toArray(),
    ])

    latestTasks = latest
    const createdByDate = new Map(
      createdAgg.map((item) => [item._id, item.count])
    )
    const completedByDate = new Map(
      completedAgg.map((item) => [item._id, item.count])
    )

    productivitySeries = productivitySeries.map((point) => ({
      ...point,
      created: createdByDate.get(point.date) ?? 0,
      completed: completedByDate.get(point.date) ?? 0,
    }))

    const [
      completedTotal,
      completedCurrent,
      completedPrev,
      overdueTotal,
      overduePrev,
      activeTotal,
      activePrev,
      createdCurrent,
      createdPrev,
      upcoming,
      focus,
    ] = await Promise.all([
      db.collection<DbTask>("tasks").countDocuments({ userId: ownerId, ...doneFilter } as any),
      db.collection<DbTask>("tasks").countDocuments({
        userId: ownerId,
        ...doneFilter,
        updatedAt: { $gte: start30 },
      } as any),
      db.collection<DbTask>("tasks").countDocuments({
        userId: ownerId,
        ...doneFilter,
        updatedAt: { $gte: start60, $lt: start30 },
      } as any),
      db.collection<DbTask>("tasks").countDocuments({
        userId: ownerId,
        ...notDoneFilter,
        dueDate: { $ne: null, $lt: todayKey },
      } as any),
      db.collection<DbTask>("tasks").countDocuments({
        userId: ownerId,
        ...notDoneFilter,
        dueDate: { $ne: null, $lt: prevTodayKey },
      } as any),
      db.collection<DbTask>("tasks").countDocuments({
        userId: ownerId,
        status: "In Progress",
      } as any),
      db.collection<DbTask>("tasks").countDocuments({
        userId: ownerId,
        status: "In Progress",
        createdAt: { $lt: start30 },
      } as any),
      db.collection<DbTask>("tasks").countDocuments({
        userId: ownerId,
        createdAt: { $gte: start30 },
      } as any),
      db.collection<DbTask>("tasks").countDocuments({
        userId: ownerId,
        createdAt: { $gte: start60, $lt: start30 },
      } as any),
      db
        .collection<DbTask>("tasks")
        .find({
          userId: ownerId,
          ...notDoneFilter,
          dueDate: { $ne: null, $gte: todayKey, $lte: next7Key },
        } as any)
        .sort({ dueDate: 1 })
        .limit(3)
        .project({ title: 1, dueDate: 1 })
        .toArray(),
      db
        .collection<DbTask>("tasks")
        .find({ userId: ownerId, ...notDoneFilter } as any)
        .sort({ createdAt: -1 })
        .limit(30)
        .project({ title: 1, priority: 1, dueDate: 1, createdAt: 1 })
        .toArray(),
    ])

    const productivityScore = createdCurrent
      ? Math.round((completedCurrent / createdCurrent) * 100)
      : 0
    const productivityPrev = createdPrev
      ? Math.round((completedPrev / createdPrev) * 100)
      : 0

    metrics = {
      completedTotal,
      completedDeltaPct: deltaPct(completedCurrent, completedPrev),
      overdueTotal,
      overdueDeltaPct: deltaPct(overdueTotal, overduePrev),
      activeTotal,
      activeDeltaPct: deltaPct(activeTotal, activePrev),
      productivityScore,
      productivityDeltaPct: deltaPct(productivityScore, productivityPrev),
    }

    upcomingTasks = upcoming
      .filter((t) => typeof t.dueDate === "string")
      .map((t) => ({ title: t.title, dueDate: String(t.dueDate) }))

    focusTasks = focus
      .map((t) => ({
        title: t.title,
        priority: (t.priority as TaskPriority | undefined) ?? "Medium",
      }))
      .sort((a, b) => priorityRank(b.priority) - priorityRank(a.priority))
      .slice(0, 3)
  } catch (error) {
    console.error("Dashboard Mongo error:", error)
  }

  return (
    <DashboardPage title="Overview" showBreadcrumbRoot={false}>
      <div className="flex flex-col gap-4 [@media(min-width:1650px)]:flex-row [@media(min-width:1650px)]:items-stretch">
        <div className="flex-1 space-y-4">
          <ChartAreaInteractive data={productivitySeries} />
          <SectionCards metrics={metrics} />
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Upcoming</CardTitle>
                <CardDescription>Tasks due soon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {upcomingTasks.length ? (
                  upcomingTasks.map((task) => (
                    <div
                      key={`${task.title}-${task.dueDate}`}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-foreground line-clamp-1">
                        {task.title}
                      </span>
                      <span className="text-muted-foreground whitespace-nowrap">
                        {formatDueLabel(task.dueDate)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm">
                    No upcoming tasks.
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Focus</CardTitle>
                <CardDescription>Today's top priorities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {focusTasks.length ? (
                  focusTasks.map((task) => (
                    <div
                      key={`${task.title}-${task.priority}`}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-foreground line-clamp-1">
                        {task.title}
                      </span>
                      <span className="text-muted-foreground whitespace-nowrap">
                        {task.priority}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm">
                    No focus tasks.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <aside className="w-full [@media(min-width:1650px)]:w-full [@media(min-width:1650px)]:max-w-sm [@media(min-width:1650px)]:flex-none [@media(min-width:1650px)]:h-full">
          <div className="h-full rounded-lg border border-border/60 py-4">
            <h2 className="text-foreground mb-6 pl-4 text-sm font-semibold tracking-wide">
              Latest Activity
            </h2>
            <div className="relative pl-8 pr-4">
              <div className="bg-border/70 absolute left-4 top-0 h-full w-px" />
              {latestTasks.length ? (
                <ul className="space-y-4 text-xs">
                  {latestTasks.slice(0, 8).map((task) => {
                    const priority: TaskPriority = task.priority ?? "Medium"
                    const status: TaskStatus =
                      task.status ?? (task.completed ? "Done" : "Todo")
                    const meta = activityMeta(priority)
                    const at = task.updatedAt ?? task.createdAt ?? new Date()
                    const when = formatDistanceToNow(at, { addSuffix: true })

                    return (
                      <li key={task._id.toString()} className="relative">
                        <span className="bg-border/70 absolute -left-4 top-4 h-px w-4" />
                        <div className="flex items-start gap-3">
                          <span
                            className="activity-bg flex size-8 items-center justify-center rounded-full"
                            style={
                              { "--activity-bg": meta.bg } as CSSProperties
                            }
                          >
                            <meta.Icon
                              className={`${meta.color} relative z-10 size-4`}
                            />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-foreground text-xs font-semibold tracking-wide mb-1">
                              {meta.label}
                            </p>
                            <p className="text-foreground truncate text-xs font-medium">
                              {task.title}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Status: {status}
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs">
                              {when}
                            </p>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="text-muted-foreground text-xs">
                  No activity yet. Create a task to see it here.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </DashboardPage>
  )
}
