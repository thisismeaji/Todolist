import { DashboardPage } from "@/components/dashboard-page"
import { TasksTableClient } from "@/components/tasks-table-client"

export default async function Page() {
  return (
    <DashboardPage title="Tasks">
      <div className="w-full min-w-0 max-w-full overflow-x-hidden">
        <TasksTableClient />
      </div>
    </DashboardPage>
  )
}
