import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type SectionCardsMetrics = {
  completedTotal: number
  completedDeltaPct: number | null
  overdueTotal: number
  overdueDeltaPct: number | null
  activeTotal: number
  activeDeltaPct: number | null
  productivityScore: number
  productivityDeltaPct: number | null
}

function formatDelta(value: number | null) {
  if (value === null) return "—"
  const rounded = Math.round(value * 10) / 10
  const sign = rounded > 0 ? "+" : ""
  return `${sign}${rounded}%`
}

function TrendIcon({ value }: { value: number | null }) {
  if (value === null) return null
  return value >= 0 ? (
    <IconTrendingUp className="size-4" />
  ) : (
    <IconTrendingDown className="size-4" />
  )
}

export function SectionCards({ metrics }: { metrics: SectionCardsMetrics }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="@container/card bg-background border-border/60 shadow-none">
        <CardHeader>
          <CardDescription className="text-xs">Tasks Completed</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {metrics.completedTotal.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendIcon value={metrics.completedDeltaPct} />
              {formatDelta(metrics.completedDeltaPct)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Completed tasks
          </div>
          <div className="text-muted-foreground">
            Compared to last month
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-background border-border/60 shadow-none">
        <CardHeader>
          <CardDescription className="text-xs">Overdue Tasks</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {metrics.overdueTotal.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendIcon value={metrics.overdueDeltaPct} />
              {formatDelta(metrics.overdueDeltaPct)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Overdue backlog
          </div>
          <div className="text-muted-foreground">
            Better focus on priorities
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-background border-border/60 shadow-none">
        <CardHeader>
          <CardDescription className="text-xs">Active Tasks</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {metrics.activeTotal.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendIcon value={metrics.activeDeltaPct} />
              {formatDelta(metrics.activeDeltaPct)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs">
          <div className="line-clamp-1 flex gap-2 font-medium">
            In progress
          </div>
          <div className="text-muted-foreground">Stable workload</div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-background border-border/60 shadow-none">
        <CardHeader>
          <CardDescription className="text-xs">Productivity Score</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {metrics.productivityScore}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendIcon value={metrics.productivityDeltaPct} />
              {formatDelta(metrics.productivityDeltaPct)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Completion rate
          </div>
          <div className="text-muted-foreground">
            Trending above target
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
