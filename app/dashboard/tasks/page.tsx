import { DashboardPage } from "@/components/dashboard-page"
import { TasksTableFull } from "@/components/tasks-table-full"

export default async function Page() {
  return (
    <DashboardPage title="Tasks">
      <TasksTableFull />
    </DashboardPage>
  )
}
