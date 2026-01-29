"use client"

import dynamic from "next/dynamic"

const TasksTableFull = dynamic(
  () =>
    import("@/components/tasks-table-full").then((mod) => mod.TasksTableFull),
  { ssr: false }
)

export function TasksTableClient() {
  return <TasksTableFull />
}
