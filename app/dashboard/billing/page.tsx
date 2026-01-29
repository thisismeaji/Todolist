import { DashboardPage } from "@/components/dashboard-page"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Page() {
  return (
    <DashboardPage title="Billing">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Payment method</CardTitle>
            <CardDescription>
              Add a card to upgrade your plan and manage renewals.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="card-number">Card number</Label>
              <Input id="card-number" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card-name">Name on card</Label>
              <Input id="card-name" placeholder="Your name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card-expiry">Expiry</Label>
              <Input id="card-expiry" placeholder="MM / YY" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card-cvc">CVC</Label>
              <Input id="card-cvc" placeholder="CVC" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save payment method</Button>
          </CardFooter>
        </Card>

        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Billing history</CardTitle>
            <CardDescription>Invoices will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="text-xs text-muted-foreground">Current plan</p>
              <p className="text-lg font-semibold">Free</p>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="text-xs text-muted-foreground">Next invoice</p>
              <p className="text-lg font-semibold">-</p>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="text-xs text-muted-foreground">Payment method</p>
              <p className="text-lg font-semibold">Not set</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPage>
  )
}
