"use client"

import { useMemo } from "react"
import { Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type DailySummary = {
  day: string
  completed: number
  created: number
}

const week: DailySummary[] = [
  { day: "Mon", completed: 5, created: 6 },
  { day: "Tue", completed: 7, created: 5 },
  { day: "Wed", completed: 6, created: 8 },
  { day: "Thu", completed: 8, created: 7 },
  { day: "Fri", completed: 9, created: 6 },
  { day: "Sat", completed: 4, created: 3 },
  { day: "Sun", completed: 3, created: 2 },
]

function InfoTip({
  text,
  colorClass = "bg-primary/15 text-primary",
}: {
  text: string
  colorClass?: string
}) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Info"
          >
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${colorClass}`}
            >
              <Info className="size-3.5" />
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="end">
          <p className="max-w-xs text-xs">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function PersonalAnalytics() {
  const {
    completedTotal,
    createdTotal,
    completionRate,
    maxCompleted,
    focusScore,
    bestStreak,
    overdueCount,
  } = useMemo(() => {
    const completedTotal = week.reduce((sum, item) => sum + item.completed, 0)
    const createdTotal = week.reduce((sum, item) => sum + item.created, 0)
    const completionRate = createdTotal
      ? Math.round((completedTotal / createdTotal) * 100)
      : 0
    const maxCompleted = Math.max(...week.map((item) => item.completed))
    const focusScore = 72
    const bestStreak = 9
    const overdueCount = 2
    return {
      completedTotal,
      createdTotal,
      completionRate,
      maxCompleted,
      focusScore,
      bestStreak,
      overdueCount,
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="bg-background">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Weekly summary
              </CardTitle>
              <InfoTip
                text="A snapshot of how many tasks you created and completed this week."
                colorClass="bg-lime-500/15 text-lime-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">
              {completedTotal} done
            </div>
            <p className="text-muted-foreground text-xs">
              {createdTotal} created this week
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {week.map((item) => (
                <Badge key={item.day} variant="outline" className="text-xs">
                  {item.day}: {item.completed}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <InfoTip
                text="Days in a row you completed at least one task."
                colorClass="bg-blue-500/15 text-blue-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">6 days</div>
            <p className="text-muted-foreground text-xs">
              You completed at least one task each day.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Progress value={85} className="h-2" />
              <span className="text-xs text-muted-foreground">85%</span>
            </div>
            <div className="text-muted-foreground text-xs">
              Best streak: {bestStreak} days
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Completion rate
              </CardTitle>
              <InfoTip
                text="Completed tasks divided by created tasks for the week."
                colorClass="bg-violet-500/15 text-violet-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">{completionRate}%</div>
            <p className="text-muted-foreground text-xs">
              Based on tasks created vs completed this week.
            </p>
            <div className="pt-2">
              <Progress value={completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Avg. completion time
              </CardTitle>
              <InfoTip
                text="Average time from task creation to completion."
                colorClass="bg-amber-500/15 text-amber-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">1.8 days</div>
            <p className="text-muted-foreground text-xs">
              From created to done this week.
            </p>
            <Progress value={62} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="bg-background lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Weekly trend</CardTitle>
              <InfoTip
                text="Daily completed tasks across the week."
                colorClass="bg-emerald-500/15 text-emerald-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-7 items-end gap-2">
              {week.map((item) => {
                const height = Math.max(
                  20,
                  Math.round((item.completed / maxCompleted) * 80)
                )
                return (
                  <div key={item.day} className="flex flex-col items-center">
                    <div
                      className="bg-primary/20 w-6 rounded-md"
                      style={{ height }}
                    />
                    <span className="text-muted-foreground mt-2 text-xs">
                      {item.day}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="text-muted-foreground text-xs">
              Your strongest day this week was Friday.
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Focus score</CardTitle>
              <InfoTip
                text="A score based on finishing important tasks first."
                colorClass="bg-sky-500/15 text-sky-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">{focusScore}</div>
            <p className="text-muted-foreground text-xs">
              A balance of completing important tasks first.
            </p>
            <Progress value={focusScore} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-background lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Peak time</CardTitle>
              <InfoTip
                text="Time of day you complete the most tasks."
                colorClass="bg-fuchsia-500/15 text-fuchsia-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">9:00 AM</div>
            <p className="text-muted-foreground text-xs">
              You finish the most tasks in the morning.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="bg-background">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <InfoTip
                text="Tasks past their due date."
                colorClass="bg-rose-500/15 text-rose-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">{overdueCount}</div>
            <p className="text-muted-foreground text-xs">
              Tasks past their due date.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Momentum</CardTitle>
              <InfoTip
                text="Whether you’re completing more tasks than you create."
                colorClass="bg-cyan-500/15 text-cyan-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">Up</div>
            <p className="text-muted-foreground text-xs">
              You completed more tasks than you created.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Consistency</CardTitle>
              <InfoTip
                text="How often you hit your daily completion target."
                colorClass="bg-orange-500/15 text-orange-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">Steady</div>
            <p className="text-muted-foreground text-xs">
              4 of 7 days with 5+ tasks completed.
            </p>
            <Progress value={58} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Load</CardTitle>
              <InfoTip
                text="Your current workload and upcoming deadlines."
                colorClass="bg-teal-500/15 text-teal-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">18 active</div>
            <p className="text-muted-foreground text-xs">
              6 due this week, 2 waiting on others.
            </p>
            <Progress value={64} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Status balance
              </CardTitle>
              <InfoTip
                text="How your tasks are split across statuses."
                colorClass="bg-purple-500/15 text-purple-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Todo</span>
                <span className="text-muted-foreground">12</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>In Progress</span>
                <span className="text-muted-foreground">7</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Done</span>
                <span className="text-muted-foreground">23</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Priority split
              </CardTitle>
              <InfoTip
                text="How your tasks are distributed by priority."
                colorClass="bg-green-500/15 text-green-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>High</span>
              <Badge variant="outline">5</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Medium</span>
              <Badge variant="outline">9</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Low</span>
              <Badge variant="outline">14</Badge>
            </div>
            <div className="text-muted-foreground text-xs">
              Keep high priority tasks small and clear.
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Upcoming deadlines
              </CardTitle>
              <InfoTip
                text="Tasks coming up soon so you can plan ahead."
                colorClass="bg-pink-500/15 text-pink-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Finalize task board</span>
              <span className="text-muted-foreground">Today</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Update cover image</span>
              <span className="text-muted-foreground">Tomorrow</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Release checklist</span>
              <span className="text-muted-foreground">Fri</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Recent wins</CardTitle>
              <InfoTip
                text="Recently completed tasks worth celebrating."
                colorClass="bg-indigo-500/15 text-indigo-500"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Clean up backlog</span>
              <span className="text-muted-foreground">Done</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Client onboarding</span>
              <span className="text-muted-foreground">Done</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Sprint review</span>
              <span className="text-muted-foreground">Done</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
