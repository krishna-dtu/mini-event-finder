import { getEventById, getEventParticipants } from "@/lib/events"
import { createClient } from "@/lib/supabase/server"
import { Calendar, MapPin, Users, ArrowLeft, Share2, Bookmark } from "lucide-react"
import Link from "next/link"
import EventJoinButton from "@/components/event-join-button"

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const event = await getEventById(id)

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted mb-4">Event not found</p>
          <Link href="/" className="text-accent hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  const participants = await getEventParticipants(event.id)
  const participantCount = participants.length
  const userJoined = user ? participants.some((p) => p.user_id === user.id) : false

  const capacity = Math.round((participantCount / event.max_participants) * 100)
  const spotsRemaining = event.max_participants - participantCount

  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg border border-accent/20 p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              {event.category && (
                <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
                  {event.category}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-balance">{event.title}</h1>
            </div>
            <div className="flex gap-2">
              <button
                className="p-3 bg-card border border-border rounded-lg hover:border-accent transition-colors text-foreground"
                aria-label="Save event"
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button
                className="p-3 bg-card border border-border rounded-lg hover:border-accent transition-colors text-foreground"
                aria-label="Share event"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <Calendar className="w-6 h-6 text-accent flex-shrink-0" />
              <div>
                <p className="text-sm text-muted">Date & Time</p>
                <p className="text-lg font-semibold text-primary">{eventDate}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="w-6 h-6 text-accent flex-shrink-0" />
              <div>
                <p className="text-sm text-muted">Location</p>
                <p className="text-lg font-semibold text-primary">{event.location}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="w-6 h-6 text-accent flex-shrink-0" />
              <div>
                <p className="text-sm text-muted">Attendees</p>
                <p className="text-lg font-semibold text-primary">
                  {participantCount} / {event.max_participants}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-primary mb-4">About This Event</h2>
              <p className="text-foreground leading-relaxed text-lg">{event.description}</p>
            </section>

            {/* Capacity Info */}
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-primary mb-4">Capacity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">Event Capacity</span>
                  <span className="text-accent font-bold">{capacity}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-accent to-accent/80 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(capacity, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-muted">
                  {spotsRemaining} spots remaining out of {event.max_participants} total
                </p>
              </div>
            </section>

            {/* Additional Info */}
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-primary mb-4">Event Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted">Event Created</span>
                  <span className="text-foreground font-medium">
                    {new Date(event.created_at).toLocaleDateString("en-US")}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted">Category</span>
                  <span className="text-foreground font-medium">{event.category || "General"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted">Event ID</span>
                  <span className="text-foreground font-mono text-sm">{event.id}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Join Button */}
              <EventJoinButton
                eventId={event.id}
                isJoined={userJoined}
                spotsRemaining={spotsRemaining}
                isAuthenticated={!!user}
              />

              {/* Share Card */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-primary mb-4">Share This Event</h3>
                <div className="space-y-3">
                  <button className="w-full py-2 px-4 border border-border rounded-lg text-sm text-foreground hover:bg-border transition-colors">
                    Share on Twitter
                  </button>
                  <button className="w-full py-2 px-4 border border-border rounded-lg text-sm text-foreground hover:bg-border transition-colors">
                    Share on Facebook
                  </button>
                  <button className="w-full py-2 px-4 border border-border rounded-lg text-sm text-foreground hover:bg-border transition-colors">
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-primary mb-4">Event Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted text-sm">Total Participants</span>
                    <span className="text-foreground font-semibold">{participantCount}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="text-muted text-sm">Capacity</span>
                    <span className="text-foreground font-semibold">{capacity}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
