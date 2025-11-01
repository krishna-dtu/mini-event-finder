import { getEvents } from "@/lib/events"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import ClientSearchComponent from "@/components/client-search"

const CATEGORIES = ["All", "Tech", "Music", "Sports", "Art", "Business"]

export default async function HomePage() {
  const events = await getEvents()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Discover Events</h1>
          <p className="text-lg text-muted max-w-2xl">
            Explore upcoming events in your area. Connect with communities and discover new experiences.
          </p>
        </div>

        <ClientSearchComponent initialEvents={events} categories={CATEGORIES} isAuthenticated={!!user} />

        {/* Floating Action Button - Mobile */}
        {user && (
          <Link
            href="/events/create"
            className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-accent text-black rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow font-bold text-2xl"
          >
            +
          </Link>
        )}
      </div>
    </main>
  )
}
