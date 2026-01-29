import { DashboardPage } from "@/components/dashboard-page"
import { ArrowDownCircle, ArrowUpCircle, MinusCircle } from "lucide-react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CSSProperties } from "react"

export default async function Page() {
  return (
    <DashboardPage title="Overview" showBreadcrumbRoot={false}>
      <div className="flex flex-col gap-4 [@media(min-width:1650px)]:flex-row [@media(min-width:1650px)]:items-stretch">
        <div className="flex-1 space-y-4">
          <ChartAreaInteractive />
          <SectionCards />
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Upcoming</CardTitle>
                <CardDescription>Tasks due soon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Finalize task board</span>
                  <span className="text-muted-foreground">Today</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Update cover image</span>
                  <span className="text-muted-foreground">Tomorrow</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Release checklist</span>
                  <span className="text-muted-foreground">Fri</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Focus</CardTitle>
                <CardDescription>Today’s top priorities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Client onboarding</span>
                  <span className="text-muted-foreground">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Clean up backlog</span>
                  <span className="text-muted-foreground">Medium</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Sprint review</span>
                  <span className="text-muted-foreground">Medium</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <aside className="w-full [@media(min-width:1650px)]:w-full [@media(min-width:1650px)]:max-w-sm [@media(min-width:1650px)]:flex-none [@media(min-width:1650px)]:h-full">
          <div className="h-full rounded-lg border border-border/60 py-4">
            <h2 className="text-foreground mb-6 pl-4 text-sm font-semibold tracking-wide">
              Latest Activity
            </h2>
            <div className="relative pl-8">
              <div className="bg-border/70 absolute left-4 top-0 h-full w-px" />
              <ul className="space-y-4 text-xs">
                <li className="relative">
                  <span className="bg-border/70 absolute -left-4 top-4 h-px w-4" />
                  <div className="flex items-start gap-3">
                    <span
                      className="activity-bg flex size-8 items-center justify-center rounded-full"
                      style={{ "--activity-bg": "rgba(132, 204, 22, 0.15)" } as CSSProperties}
                    >
                      <ArrowDownCircle className="text-lime-600 relative z-10 size-4" />
                    </span>
                    <div>
                      <p className="text-foreground text-xs font-semibold tracking-wide mb-1">
                        Low priority
                      </p>
                      <p className="text-muted-foreground">
                        "Update cover image" scheduled.
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                </li>
                <li className="relative">
                  <span className="bg-border/70 absolute -left-4 top-4 h-px w-4" />
                  <div className="flex items-start gap-3">
                    <span
                      className="activity-bg flex size-8 items-center justify-center rounded-full"
                      style={{ "--activity-bg": "rgba(139, 92, 246, 0.15)" } as CSSProperties}
                    >
                      <MinusCircle className="text-violet-600 relative z-10 size-4" />
                    </span>
                    <div>
                      <p className="text-foreground text-xs font-semibold tracking-wide mb-1">
                        Medium priority
                      </p>
                      <p className="text-muted-foreground">
                        "Finalize task board" in progress.
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        5 hours ago
                      </p>
                    </div>
                  </div>
                </li>
                <li className="relative">
                  <span className="bg-border/70 absolute -left-4 top-4 h-px w-4" />
                  <div className="flex items-start gap-3">
                    <span
                      className="activity-bg flex size-8 items-center justify-center rounded-full"
                      style={{ "--activity-bg": "rgba(220, 38, 38, 0.15)" } as CSSProperties}
                    >
                      <ArrowUpCircle className="text-red-600 relative z-10 size-4" />
                    </span>
                    <div>
                      <p className="text-foreground text-xs font-semibold tracking-wide mb-1">
                        High priority
                      </p>
                      <p className="text-muted-foreground">
                        "Client onboarding" blocked.
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Yesterday
                      </p>
                    </div>
                  </div>
                </li>
                <li className="relative">
                  <span className="bg-border/70 absolute -left-4 top-4 h-px w-4" />
                  <div className="flex items-start gap-3">
                    <span
                      className="activity-bg flex size-8 items-center justify-center rounded-full"
                      style={{ "--activity-bg": "rgba(132, 204, 22, 0.15)" } as CSSProperties}
                    >
                      <ArrowDownCircle className="text-lime-600 relative z-10 size-4" />
                    </span>
                    <div>
                      <p className="text-foreground text-xs font-semibold tracking-wide mb-1">
                        Low priority
                      </p>
                      <p className="text-muted-foreground">
                        "Clean up backlog" added.
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        3 hours ago
                      </p>
                    </div>
                  </div>
                </li>
                <li className="relative">
                  <span className="bg-border/70 absolute -left-4 top-4 h-px w-4" />
                  <div className="flex items-start gap-3">
                    <span
                      className="activity-bg flex size-8 items-center justify-center rounded-full"
                      style={{ "--activity-bg": "rgba(139, 92, 246, 0.15)" } as CSSProperties}
                    >
                      <MinusCircle className="text-violet-600 relative z-10 size-4" />
                    </span>
                    <div>
                      <p className="text-foreground text-xs font-semibold tracking-wide mb-1">
                        Medium priority
                      </p>
                      <p className="text-muted-foreground">
                        "Sprint review" scheduled.
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        1 day ago
                      </p>
                    </div>
                  </div>
                </li>
                <li className="relative">
                  <span className="bg-border/70 absolute -left-4 top-4 h-px w-4" />
                  <div className="flex items-start gap-3">
                    <span
                      className="activity-bg flex size-8 items-center justify-center rounded-full"
                      style={{ "--activity-bg": "rgba(220, 38, 38, 0.15)" } as CSSProperties}
                    >
                      <ArrowUpCircle className="text-red-600 relative z-10 size-4" />
                    </span>
                    <div>
                      <p className="text-foreground text-xs font-semibold tracking-wide mb-1">
                        High priority
                      </p>
                      <p className="text-muted-foreground">
                        "Release checklist" overdue.
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        2 days ago
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </DashboardPage>
  )
}
