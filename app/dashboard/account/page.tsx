import { ObjectId } from "mongodb"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAuthToken } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { DashboardPage } from "@/components/dashboard-page"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ClientOnly } from "@/components/client-only"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

type DbUser = {
  _id: ObjectId
  name?: string
  email?: string
}

async function requireUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const payload = token ? await verifyAuthToken(token) : null

  if (!payload || !ObjectId.isValid(payload.sub)) {
    redirect("/login")
  }

  const db = await getDb()
  const user = await db.collection<DbUser>("users").findOne({
    _id: new ObjectId(payload.sub),
  })

  if (!user) {
    redirect("/login")
  }

  return user
}

function getInitials(name?: string) {
  if (!name) return "US"
  const parts = name.trim().split(/\s+/)
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase())
  return initials.join("") || "US"
}

export default async function Page() {
  const user = await requireUser()
  const displayName = user.name || user.email?.split("@")[0] || "User"

  return (
    <DashboardPage title="Account">
      <div className="flex min-h-[calc(100svh-4rem-1rem)] items-center justify-center">
        <div className="w-full max-w-3xl space-y-6">
        <Card className="bg-background">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost">Cancel</Button>
              <Button>Save changes</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="text-sm font-medium">Profile picture</div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{displayName}</p>
                    <p className="text-muted-foreground text-xs">Workspace member</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Upload photo
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-4 text-sm">
              <p className="text-muted-foreground">
                This account is connected to your Google account. Your details can only be
                changed from the Google account.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full name</Label>
                <Input id="full-name" defaultValue={displayName} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" defaultValue={user.email ?? ""} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <ClientOnly
                  fallback={
                    <Input
                      id="role"
                      defaultValue="Product manager"
                      disabled
                    />
                  }
                >
                  <Select defaultValue="product-manager">
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product-manager">
                        Product manager
                      </SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="engineer">Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </ClientOnly>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="text-destructive">Danger zone</CardTitle>
            <CardDescription>Delete user account</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">
              By deleting your account you will lose all your data and access to any
              workspaces that you are associated with.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              Request account deletion
            </Button>
          </CardFooter>
        </Card>
        </div>
      </div>
    </DashboardPage>
  )
}
