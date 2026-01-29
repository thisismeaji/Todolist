import { DashboardPage } from "@/components/dashboard-page"
import { PersonalAnalytics } from "@/components/personal-analytics"

export default function Page() {
  return (
    <DashboardPage title="Analytics">
      <div className="w-full">
        <PersonalAnalytics />
      </div>
    </DashboardPage>
  )
}
