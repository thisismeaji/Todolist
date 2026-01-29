"use client"

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

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="@container/card bg-background border-border/60 shadow-none">
        <CardHeader>
          <CardDescription className="text-xs">Tasks Completed</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            1,254
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-4" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Completed more tasks <IconTrendingUp className="size-4" />
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
            42
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown className="size-4" />
              -8%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Fewer overdue items <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Better focus on priorities
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-background border-border/60 shadow-none">
        <CardHeader>
          <CardDescription className="text-xs">Active Projects</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            18
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-4" />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady project growth <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Stable workload</div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-background border-border/60 shadow-none">
        <CardHeader>
          <CardDescription className="text-xs">Productivity Score</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            84%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-4" />
              +6.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Higher weekly momentum <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Trending above target
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
