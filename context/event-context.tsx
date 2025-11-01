"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { Event, EventFilters } from "@/types/event"

interface EventContextType {
  events: Event[]
  filteredEvents: Event[]
  filters: EventFilters
  loading: boolean
  error: string | null
  userLocation: { lat: number; lng: number } | null
  nearbyEvents: Event[]
  setFilters: (filters: EventFilters) => void
  addEvent: (event: Event) => void
  fetchEvents: () => Promise<void>
  fetchNearbyEvents: (lat: number, lng: number, radius: number) => Promise<void>
  joinEvent: (eventId: string) => void
  getUserLocation: () => Promise<void>
}

const EventContext = createContext<EventContextType | undefined>(undefined)

// Mock data for initial events
const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "React Conference 2025",
    description:
      "Join us for an exciting React conference with industry experts sharing insights on the latest in React development.",
    location: "San Francisco, CA",
    latitude: 37.7749,
    longitude: -122.4194,
    date: "2025-12-15",
    category: "Tech",
    maxParticipants: 500,
    currentParticipants: 342,
    createdAt: "2025-10-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Jazz Night Live",
    description: "Experience the smooth sounds of live jazz performances from renowned musicians.",
    location: "New York, NY",
    latitude: 40.7128,
    longitude: -74.006,
    date: "2025-11-22",
    category: "Music",
    maxParticipants: 200,
    currentParticipants: 156,
    createdAt: "2025-10-02T14:30:00Z",
  },
  {
    id: "3",
    title: "Tech Startup Meetup",
    description: "Network with fellow startup founders and investors in the tech ecosystem.",
    location: "Austin, TX",
    latitude: 30.2672,
    longitude: -97.7431,
    date: "2025-11-10",
    category: "Tech",
    maxParticipants: 150,
    currentParticipants: 89,
    createdAt: "2025-10-03T09:15:00Z",
  },
  {
    id: "4",
    title: "Marathon 2025",
    description: "Join thousands of runners for an exciting 42km marathon experience.",
    location: "Chicago, IL",
    latitude: 41.8781,
    longitude: -87.6298,
    date: "2025-11-30",
    category: "Sports",
    maxParticipants: 5000,
    currentParticipants: 3456,
    createdAt: "2025-10-04T08:00:00Z",
  },
]

// Utility function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS)
  const [filters, setFilters] = useState<EventFilters>({ searchQuery: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([])

  const getFilteredEvents = useCallback(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(filters.searchQuery.toLowerCase())

      const matchesCategory = !filters.selectedCategory || event.category === filters.selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [events, filters])

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // In a real app, this would call GET /api/events
      // For now, we're using mock data
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (err) {
      setError("Failed to fetch events")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchNearbyEvents = useCallback(
    async (lat: number, lng: number, radius: number) => {
      setLoading(true)
      setError(null)
      try {
        const nearby = events.filter((event) => {
          const distance = calculateDistance(lat, lng, event.latitude, event.longitude)
          return distance <= radius
        })
        setNearbyEvents(nearby)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))
      } catch (err) {
        setError("Failed to fetch nearby events")
      } finally {
        setLoading(false)
      }
    },
    [events],
  )

  const getUserLocation = useCallback(async () => {
    return new Promise<void>((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setUserLocation({ lat: latitude, lng: longitude })
            resolve()
          },
          (error) => {
            console.error("Geolocation error:", error)
            setError("Unable to access your location. Please enable location services.")
            resolve()
          },
        )
      } else {
        setError("Geolocation is not supported by your browser")
        resolve()
      }
    })
  }, [])

  const addEvent = useCallback((newEvent: Event) => {
    setEvents((prev) => [newEvent, ...prev])
  }, [])

  const joinEvent = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              currentParticipants: Math.min(event.currentParticipants + 1, event.maxParticipants),
            }
          : event,
      ),
    )
  }, [])

  return (
    <EventContext.Provider
      value={{
        events,
        filteredEvents: getFilteredEvents(),
        filters,
        loading,
        error,
        userLocation,
        nearbyEvents,
        setFilters,
        addEvent,
        fetchEvents,
        fetchNearbyEvents,
        joinEvent,
        getUserLocation,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error("useEvents must be used within EventProvider")
  }
  return context
}
