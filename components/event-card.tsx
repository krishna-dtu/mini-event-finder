"use client"

import Link from "next/link"
import type { Database } from "@/types/supabase"
import { MapPin, Calendar, Users } from "lucide-react"
import { useEffect, useState } from "react"

type Event = Database["public"]["Tables"]["events"]["Row"]

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const [participantCount, setParticipantCount] = useState(0)

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`/api/events/${event.id}/participants-count`)
        const data = await response.json()
        setParticipantCount(data.count)
      } catch (error) {
        console.error("Failed to fetch participant count:", error)
        setParticipantCount(0)
      }
    }
    fetchParticipants()
  }, [event.id])

  const capacity = Math.round((participantCount / event.max_participants) * 100)
  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Link href={`/events/${event.id}`}>
      <div className="group cursor-pointer">
        <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-lg">
          {/* Header with category */}
          <div className="p-4 border-b border-border flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors">
                {event.title}
              </h3>
              {event.category && (
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-accent/10 text-accent rounded">
                  {event.category}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <p className="text-sm text-muted line-clamp-2">{event.description}</p>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-muted">
              <Calendar className="w-4 h-4" />
              <span>{eventDate}</span>
            </div>

            {/* Participants */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted" />
                  <span className="text-muted">
                    {participantCount} / {event.max_participants}
                  </span>
                </div>
                <span className="text-xs text-muted">{capacity}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(capacity, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
