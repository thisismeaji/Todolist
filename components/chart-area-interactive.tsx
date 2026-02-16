"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type ProductivityPoint = {
  date: string
  completed: number
  created: number
}

const chartData = [
  { date: "2024-04-01", completed: 18, created: 22 },
  { date: "2024-04-02", completed: 9, created: 12 },
  { date: "2024-04-03", completed: 14, created: 16 },
  { date: "2024-04-04", completed: 20, created: 28 },
  { date: "2024-04-05", completed: 25, created: 30 },
  { date: "2024-04-06", completed: 17, created: 24 },
  { date: "2024-04-07", completed: 12, created: 18 },
  { date: "2024-04-08", completed: 27, created: 34 },
  { date: "2024-04-09", completed: 8, created: 14 },
  { date: "2024-04-10", completed: 19, created: 23 },
  { date: "2024-04-11", completed: 24, created: 31 },
  { date: "2024-04-12", completed: 21, created: 26 },
  { date: "2024-04-13", completed: 26, created: 32 },
  { date: "2024-04-14", completed: 11, created: 18 },
  { date: "2024-04-15", completed: 10, created: 16 },
  { date: "2024-04-16", completed: 12, created: 19 },
  { date: "2024-04-17", completed: 32, created: 38 },
  { date: "2024-04-18", completed: 28, created: 35 },
  { date: "2024-04-19", completed: 17, created: 22 },
  { date: "2024-04-20", completed: 7, created: 13 },
  { date: "2024-04-21", completed: 12, created: 18 },
  { date: "2024-04-22", completed: 19, created: 24 },
  { date: "2024-04-23", completed: 13, created: 21 },
  { date: "2024-04-24", completed: 29, created: 33 },
  { date: "2024-04-25", completed: 16, created: 20 },
  { date: "2024-04-26", completed: 6, created: 11 },
  { date: "2024-04-27", completed: 31, created: 36 },
  { date: "2024-04-28", completed: 9, created: 14 },
  { date: "2024-04-29", completed: 22, created: 27 },
  { date: "2024-04-30", completed: 33, created: 39 },
  { date: "2024-05-01", completed: 14, created: 19 },
  { date: "2024-05-02", completed: 23, created: 28 },
  { date: "2024-05-03", completed: 18, created: 22 },
  { date: "2024-05-04", completed: 30, created: 37 },
  { date: "2024-05-05", completed: 34, created: 40 },
  { date: "2024-05-06", completed: 35, created: 43 },
  { date: "2024-05-07", completed: 27, created: 31 },
  { date: "2024-05-08", completed: 11, created: 16 },
  { date: "2024-05-09", completed: 17, created: 21 },
  { date: "2024-05-10", completed: 23, created: 29 },
  { date: "2024-05-11", completed: 25, created: 28 },
  { date: "2024-05-12", completed: 15, created: 20 },
  { date: "2024-05-13", completed: 14, created: 18 },
  { date: "2024-05-14", completed: 32, created: 38 },
  { date: "2024-05-15", completed: 34, created: 36 },
  { date: "2024-05-16", completed: 26, created: 32 },
  { date: "2024-05-17", completed: 36, created: 41 },
  { date: "2024-05-18", completed: 24, created: 30 },
  { date: "2024-05-19", completed: 18, created: 22 },
  { date: "2024-05-20", completed: 13, created: 19 },
  { date: "2024-05-21", completed: 7, created: 12 },
  { date: "2024-05-22", completed: 6, created: 10 },
  { date: "2024-05-23", completed: 20, created: 26 },
  { date: "2024-05-24", completed: 21, created: 25 },
  { date: "2024-05-25", completed: 16, created: 21 },
  { date: "2024-05-26", completed: 17, created: 19 },
  { date: "2024-05-27", completed: 30, created: 35 },
  { date: "2024-05-28", completed: 18, created: 22 },
  { date: "2024-05-29", completed: 8, created: 12 },
  { date: "2024-05-30", completed: 25, created: 29 },
  { date: "2024-05-31", completed: 15, created: 21 },
  { date: "2024-06-01", completed: 16, created: 20 },
  { date: "2024-06-02", completed: 33, created: 37 },
  { date: "2024-06-03", completed: 10, created: 15 },
  { date: "2024-06-04", completed: 31, created: 36 },
  { date: "2024-06-05", completed: 8, created: 13 },
  { date: "2024-06-06", completed: 22, created: 26 },
  { date: "2024-06-07", completed: 24, created: 29 },
  { date: "2024-06-08", completed: 28, created: 32 },
  { date: "2024-06-09", completed: 31, created: 35 },
  { date: "2024-06-10", completed: 13, created: 18 },
  { date: "2024-06-11", completed: 9, created: 14 },
  { date: "2024-06-12", completed: 34, created: 39 },
  { date: "2024-06-13", completed: 8, created: 12 },
  { date: "2024-06-14", completed: 30, created: 34 },
  { date: "2024-06-15", completed: 23, created: 28 },
  { date: "2024-06-16", completed: 27, created: 31 },
  { date: "2024-06-17", completed: 35, created: 41 },
  { date: "2024-06-18", completed: 10, created: 16 },
  { date: "2024-06-19", completed: 25, created: 29 },
  { date: "2024-06-20", completed: 29, created: 33 },
  { date: "2024-06-21", completed: 14, created: 19 },
  { date: "2024-06-22", completed: 24, created: 27 },
  { date: "2024-06-23", completed: 36, created: 42 },
  { date: "2024-06-24", completed: 12, created: 17 },
  { date: "2024-06-25", completed: 13, created: 18 },
  { date: "2024-06-26", completed: 30, created: 34 },
  { date: "2024-06-27", completed: 32, created: 38 },
  { date: "2024-06-28", completed: 14, created: 19 },
  { date: "2024-06-29", completed: 10, created: 15 },
  { date: "2024-06-30", completed: 33, created: 37 },
]

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--chart-1)",
  },
  created: {
    label: "Created",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({
  data,
}: {
  data?: ProductivityPoint[]
}) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const daysToShow = React.useMemo(() => {
    if (timeRange === "90d") return 90
    if (timeRange === "7d") return 7
    return 30
  }, [timeRange])

  const sourceData = (data?.length ? data : chartData) as ProductivityPoint[]

  const filteredData = React.useMemo(() => {
    if (!sourceData.length) return []
    return sourceData.slice(-daysToShow)
  }, [sourceData, daysToShow])

  return (
    <Card className="@container/card bg-background border-border/60 px-0 shadow-none">
      <CardHeader>
        <CardTitle>Productivity Trend</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Tasks created vs completed
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-completed)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-completed)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-created)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-created)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeOpacity={0.12} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <Tooltip
                cursor={{ strokeOpacity: 0.2 }}
                wrapperStyle={{ zIndex: 40 }}
                content={({ active, payload, label }) => (
                  <ChartTooltipContent
                    active={active}
                    payload={payload}
                    label={label}
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                )}
              />
              <Area
                dataKey="created"
                type="natural"
                fill="url(#fillCreated)"
                stroke="var(--color-created)"
                stackId="a"
              />
              <Area
                dataKey="completed"
                type="natural"
                fill="url(#fillCompleted)"
                stroke="var(--color-completed)"
                stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
