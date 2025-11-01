"use client"

import { useState, useMemo } from "react"
import EventCard from "@/components/event-card"
import { Search, MapPin, Plus } from "lucide-react"
import Link from "next/link"
import type { Database } from "@/types/supabase"

type Event = Database["public"]["Tables"]["events"]["Row"]

interface ClientSearchComponentProps {
  initialEvents: Event[]
  categories: string[]
  isAuthenticated: boolean
}

export default function ClientSearchComponent({
  initialEvents,
  categories,
  isAuthenticated,
}: ClientSearchComponentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showNearby, setShowNearby] = useState(false)

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === "All" || event.category.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [initialEvents, searchQuery, selectedCategory])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959 // Earth radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const nearbyEvents = useMemo(() => {
    if (!userLocation) return []
    return filteredEvents.filter((event) => {
      if (!event.latitude || !event.longitude) return false
      const distance = calculateDistance(userLocation.lat, userLocation.lng, event.latitude, event.longitude)
      return distance <= 50
    })
  }, [filteredEvents, userLocation])

  const handleNearbyClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setShowNearby(true)
          // Scroll to nearby section
          setTimeout(() => {
            document.getElementById("nearby-events")?.scrollIntoView({ behavior: "smooth" })
          }, 100)
        },
        (error) => console.error("Geolocation error:", error),
      )
    }
  }

  const displayEvents = showNearby ? nearbyEvents : filteredEvents

  return (
    <>
      {/* Search & Filter Section */}
      <div className="space-y-6 mb-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Search events by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleNearbyClick}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            <MapPin className="w-5 h-5" />
            Show Nearby Events
          </button>
          {isAuthenticated && (
            <Link
              href="/events/create"
              className="flex items-center justify-center gap-2 px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </Link>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-accent text-black font-medium"
                  : "bg-card border border-border text-foreground hover:border-accent"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {displayEvents.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <p className="text-xl text-muted mb-4">No events found</p>
            <p className="text-sm text-muted">Try adjusting your search or filters</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Nearby Events Section */}
      {userLocation && (
        <section id="nearby-events" className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Events Near You</h2>
              <p className="text-muted">Discover events happening within 50 miles of your location</p>
            </div>
            <button
              onClick={() => setShowNearby(false)}
              className="px-6 py-3 bg-accent text-black rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Show All Events
            </button>
          </div>
        </section>
      )}
    </>
  )
}
