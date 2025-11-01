import { redirect } from "next/navigation"
import { getUserProfile, getUserEvents, getUserJoinedEvents } from "@/lib/profiles"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const profile = await getUserProfile()
  const createdEvents = await getUserEvents()
  const joinedEvents = await getUserJoinedEvents()

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Created Events</CardTitle>
            <CardDescription>Events you have organized</CardDescription>
          </CardHeader>
          <CardContent>
            {createdEvents.length === 0 ? (
              <p className="text-muted-foreground">You haven&apos;t created any events yet.</p>
            ) : (
              <div className="grid gap-4">
                {createdEvents.map((event) => (
                  <div key={event.id} className="flex justify-between items-start p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                    <Link href={`/events/${event.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events You&apos;re Attending</CardTitle>
            <CardDescription>Events you have joined</CardDescription>
          </CardHeader>
          <CardContent>
            {joinedEvents.length === 0 ? (
              <p className="text-muted-foreground">You haven&apos;t joined any events yet.</p>
            ) : (
              <div className="grid gap-4">
                {joinedEvents.map((event) => (
                  <div key={event.id} className="flex justify-between items-start p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                    <Link href={`/events/${event.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
