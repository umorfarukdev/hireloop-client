import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { UserRoundIcon } from "lucide-react"

import { auth } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/* ------------------------------------------------------------------ */
/* Simple profile page — shows the signed-in account info.            */
/* ------------------------------------------------------------------ */

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const user = session?.user

  if (!user) {
    redirect("/sign-in")
  }

  const name = user.name || "Unknown user"
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account details and professional profile.
        </p>
      </div>

      {/* Account card */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Your Hireloop account information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={name}
                className="size-16 rounded-full object-cover ring-1 ring-foreground/10"
              />
            ) : (
              <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                {initials || <UserRoundIcon className="size-6" aria-hidden="true" />}
              </span>
            )}
            <div className="space-y-1">
              <p className="text-base font-semibold">{name}</p>
              <Badge variant="outline" className="capitalize">
                {user.role ?? "seeker"}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground">
                FULL NAME
              </dt>
              <dd className="rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                {name}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground">
                EMAIL ADDRESS
              </dt>
              <dd className="truncate rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                {user.email}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
