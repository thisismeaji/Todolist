"use client"

import * as React from "react"
import { Legend, Tooltip, type LegendProps, type TooltipProps } from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = Record<
  string,
  {
    label?: string
    color?: string
  }
>

type ChartContextValue = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextValue | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("Chart components must be used within <ChartContainer />.")
  }
  return context
}

function ChartContainer({
  config,
  className,
  children,
}: {
  config: ChartConfig
  className?: string
  children: React.ReactNode
}) {
  const style = React.useMemo(() => {
    const next = {} as React.CSSProperties
    for (const [key, value] of Object.entries(config)) {
      if (value.color) {
        ;(next as Record<string, string>)[`--color-${key}`] = value.color
      }
    }
    return next
  }, [config])

  return (
    <ChartContext.Provider value={{ config }}>
      <div className={cn("w-full", className)} style={style}>
        {children}
      </div>
    </ChartContext.Provider>
  )
}

function ChartTooltip({
  cursor,
  content,
  ...props
}: TooltipProps<number, string>) {
  return <Tooltip cursor={cursor} content={content} {...props} />
}

function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  indicator = "dot",
}: {
  active?: boolean
  payload?: TooltipProps<any, any>["payload"]
  label?: string | number
  labelFormatter?: (label: string) => React.ReactNode
  indicator?: "dot" | "line"
}) {
  const { config } = useChart()

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="bg-popover text-popover-foreground rounded-md border px-3 py-2 text-xs shadow-sm">
      <div className="text-muted-foreground mb-2">
        {labelFormatter ? labelFormatter(String(label)) : label}
      </div>
      <div className="space-y-1">
        {payload.map((item, index) => {
          const key = String(item.dataKey || index)
          const itemConfig = config[key]
          const color = itemConfig?.color || item.color || "currentColor"
          return (
            <div key={key} className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex size-2 rounded-full",
                  indicator === "line" && "h-0.5 w-3 rounded-sm"
                )}
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground">
                {itemConfig?.label ?? key}
              </span>
              <span className="ml-auto font-medium">
                {item.value?.toLocaleString()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChartLegend({ content, ...props }: LegendProps) {
  const LegendComponent = Legend as React.ComponentType<LegendProps>
  return <LegendComponent content={content} {...props} />
}

function ChartLegendContent({
  payload,
}: {
  payload?: LegendProps["payload"]
}) {
  const { config } = useChart()

  if (!payload?.length) return null

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
      {payload.map((item) => {
        const key = String(item.dataKey)
        const itemConfig = config[key]
        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className="inline-flex size-2 rounded-full"
              style={{ backgroundColor: itemConfig?.color || item.color }}
            />
            <span className="text-muted-foreground">
              {itemConfig?.label ?? key}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
}
