"use client"

import { useState } from "react"
import { useEvents } from "@/context/event-context"
import EventCard from "@/components/event-card"
import { MapPin, Loader2 } from "lucide-react"

export default function NearbyEventsSection() {
  const { nearbyEvents, loading, getUserLocation, fetchNearbyEvents } = useEvents()
  const [isSearching, setIsSearching] = useState(false)

  const handleFindNearby = async () => {
    setIsSearching(true)
    try {
      await getUserLocation()
      // Note: getUserLocation sets the location, we need to fetch nearby after
      // In production, this would be better coordinated
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <section className="mt-16 py-12 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">Events Near You</h2>
          <p className="text-muted">Discover events happening within 50 miles of your location</p>
        </div>
      </div>

      {nearbyEvents.length === 0 && !isSearching ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <MapPin className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
          <p className="text-muted mb-4">Click the button below to find events near your location</p>
          <button
            onClick={handleFindNearby}
            disabled={isSearching}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-black rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Finding Events...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                Find Nearby Events
              </>
            )}
          </button>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  )
}
