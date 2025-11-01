"use client"

import { useState, useEffect, useRef } from "react"
import { useEvents } from "@/context/event-context"
import type { Event } from "@/types/event"
import { MapPin, List } from "lucide-react"
import Link from "next/link"

export default function MapViewPage() {
  const { events } = useEvents()
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Draw simple canvas-based map
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Get background color from theme
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue("--background").trim()
    const cardColor = getComputedStyle(document.documentElement).getPropertyValue("--card").trim()

    // Fill background
    ctx.fillStyle = "oklch(0.145 0 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "oklch(0.269 0 0)"
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath()
      ctx.moveTo((canvas.width / 10) * i, 0)
      ctx.lineTo((canvas.width / 10) * i, canvas.height)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, (canvas.height / 10) * i)
      ctx.lineTo(canvas.width, (canvas.height / 10) * i)
      ctx.stroke()
    }

    // Draw events as markers
    events.forEach((event) => {
      // Normalize coordinates to canvas
      const x = ((event.longitude + 180) / 360) * canvas.width
      const y = ((90 - event.latitude) / 180) * canvas.height

      // Draw marker
      ctx.fillStyle = selectedEvent?.id === event.id ? "oklch(0.97 0 0)" : "oklch(0.646 0.222 41.116)"
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()

      // Draw border
      ctx.strokeStyle = selectedEvent?.id === event.id ? "oklch(0.97 0 0)" : "oklch(0.646 0.222 41.116)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw inner circle
      ctx.fillStyle = "oklch(0.145 0 0)"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [events, selectedEvent])

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Explore Events on Map</h1>
          <p className="text-lg text-muted">Discover events happening around your area</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => setViewMode("map")}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === "map"
                ? "bg-accent text-black"
                : "bg-card border border-border text-foreground hover:border-accent"
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Map View
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === "list"
                ? "bg-accent text-black"
                : "bg-card border border-border text-foreground hover:border-accent"
            }`}
          >
            <List className="w-4 h-4 inline mr-2" />
            List View
          </button>
        </div>

        {/* Content */}
        {viewMode === "map" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Canvas Map */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-96 lg:h-full cursor-pointer"
                  onClick={(e) => {
                    const canvas = canvasRef.current
                    if (!canvas) return

                    const rect = canvas.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top

                    // Check which event was clicked
                    events.forEach((event) => {
                      const ex = ((event.longitude + 180) / 360) * canvas.width
                      const ey = ((90 - event.latitude) / 180) * canvas.height
                      const distance = Math.sqrt((x - ex) ** 2 + (y - ey) ** 2)

                      if (distance < 12) {
                        setSelectedEvent(event)
                      }
                    })
                  }}
                />
              </div>
              <p className="text-xs text-muted mt-2">Click on event markers to see details</p>
            </div>

            {/* Event Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedEvent ? (
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-1">{selectedEvent.title}</h3>
                    {selectedEvent.category && (
                      <span className="inline-block px-2 py-1 text-xs bg-accent/20 text-accent rounded mb-3">
                        {selectedEvent.category}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-muted">Location</p>
                        <p className="text-sm font-medium text-foreground">{selectedEvent.location}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-2">Event Capacity</p>
                      <div className="w-full bg-border rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{
                            width: `${Math.round(
                              (selectedEvent.currentParticipants / selectedEvent.maxParticipants) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted mt-1">
                        {selectedEvent.currentParticipants} / {selectedEvent.maxParticipants}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/events/${selectedEvent.id}`}
                    className="w-full py-2 px-4 bg-accent text-black rounded-lg font-medium text-center hover:bg-accent/90 transition-colors block"
                  >
                    View Details
                  </Link>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <MapPin className="w-8 h-8 text-muted mx-auto mb-3 opacity-50" />
                  <p className="text-muted">Select an event marker on the map to see details</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // List View
          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted">No events found</p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`bg-card border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedEvent?.id === event.id ? "border-accent bg-accent/5" : "border-border hover:border-accent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary mb-1">{event.title}</h3>
                      <p className="text-sm text-muted mb-2">{event.location}</p>
                      <div className="flex flex-wrap gap-2 items-center">
                        {event.category && (
                          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">{event.category}</span>
                        )}
                        <span className="text-xs text-muted">
                          {event.currentParticipants} / {event.maxParticipants} attendees
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/events/${event.id}`}
                      className="px-4 py-2 bg-accent text-black rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  )
}
