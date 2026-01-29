"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const plans = [
  {
    name: "Free",
    description: "A quiet place to keep your day on track.",
    monthly: { price: "$0", cadence: "Forever" },
    annual: { price: "$0", cadence: "Forever" },
    highlights: [
      "Unlimited personal tasks",
      "Basic reminders",
      "Simple tags and filters",
      "Single user workspace",
      "Email support",
    ],
    cta: "Keep free",
    featured: false,
  },
  {
    name: "Pro",
    description: "Stay consistent without thinking about the system.",
    monthly: { price: "$9", cadence: "per month" },
    annual: { price: "$7", cadence: "per month (billed yearly)" },
    highlights: [
      "All Free features",
      "Smart recurring tasks",
      "Priority templates",
      "Calendar sync",
      "Advanced analytics",
    ],
    cta: "Move to Pro",
    featured: true,
  },
  {
    name: "Unlimited",
    description: "For when you want everything in one place.",
    monthly: { price: "$19", cadence: "per month" },
    annual: { price: "$15", cadence: "per month (billed yearly)" },
    highlights: [
      "All Pro features",
      "Unlimited projects",
      "Custom automations",
      "Focus mode",
      "Priority support",
    ],
    cta: "Get Unlimited",
    featured: false,
  },
] as const

export function BillingPricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  )

  const visiblePlans = useMemo(() => {
    return plans.map((plan) => ({
      ...plan,
      price:
        billingCycle === "monthly" ? plan.monthly.price : plan.annual.price,
      cadence:
        billingCycle === "monthly"
          ? plan.monthly.cadence
          : plan.annual.cadence,
    }))
  }, [billingCycle])

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 rounded-md border border-border bg-background p-1">
          <Button
            size="sm"
            variant={billingCycle === "monthly" ? "default" : "ghost"}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === "annual" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingCycle("annual")}
          >
            Annual
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {visiblePlans.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.featured
                ? "border-primary/40 bg-background shadow-md"
                : "bg-background"
            }
          >
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-semibold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">
                  {plan.cadence}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">What’s included:</p>
                <ul className="space-y-1 text-foreground">
                  {plan.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary inline-flex size-5 items-center justify-center rounded-full text-xs">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.featured ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
