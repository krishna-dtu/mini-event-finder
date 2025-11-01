"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface EventJoinButtonProps {
  eventId: string
  isJoined: boolean
  spotsRemaining: number
  isAuthenticated: boolean
}

export default function EventJoinButton({ eventId, isJoined, spotsRemaining, isAuthenticated }: EventJoinButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleJoin = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/events/${eventId}/join`, { method: "POST" })

      if (!response.ok) {
        throw new Error("Failed to join event")
      }

      router.refresh()
    } catch (error) {
      console.error("Error joining event:", error)
      alert("Failed to join event. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/events/${eventId}/leave`, { method: "POST" })

      if (!response.ok) {
        throw new Error("Failed to leave event")
      }

      router.refresh()
    } catch (error) {
      console.error("Error leaving event:", error)
      alert("Failed to leave event. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={isJoined ? handleLeave : handleJoin}
      disabled={isLoading || (spotsRemaining === 0 && !isJoined)}
      className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
        isJoined
          ? "bg-card border border-accent text-accent hover:bg-accent/10"
          : spotsRemaining === 0
            ? "bg-border text-muted cursor-not-allowed"
            : "bg-accent text-black hover:bg-accent/90 shadow-lg hover:shadow-xl"
      } disabled:opacity-50`}
    >
      {isLoading ? "Processing..." : isJoined ? "Leave Event" : spotsRemaining === 0 ? "Event Full" : "Join Event"}
    </button>
  )
}
