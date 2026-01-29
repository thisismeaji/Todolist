import { DashboardPage } from "@/components/dashboard-page"
import { BillingPricing } from "@/components/billing-pricing"

export default function Page() {
  return (
    <DashboardPage title="Upgrade">
      <div className="flex min-h-[calc(100svh-4rem-1rem)] items-center justify-center">
        <div className="w-full max-w-6xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Calm pricing for calm days
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-base">
            Choose a plan that keeps your tasks clear and your head quiet.
          </p>
        </div>
        <BillingPricing />
        </div>
      </div>
    </DashboardPage>
  )
}
