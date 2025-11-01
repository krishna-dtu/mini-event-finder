"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import CreateEventForm from "@/components/create-event-form"

export default function CreateEventPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateEvent = async (formData: {
    title: string
    description: string
    location: string
    latitude: number
    longitude: number
    category: string
    date: string
    max_participants: number
  }) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create event")
      }

      const { eventId } = await response.json()
      router.push(`/events/${eventId}`)
    } catch (error) {
      console.error("Error creating event:", error)
      alert("Failed to create event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-primary mb-2">Create New Event</h1>
          <p className="text-lg text-muted">Share your event with the community and connect with attendees.</p>
        </div>

        {/* Form Container */}
        <div className="bg-card border border-border rounded-lg p-8">
          <CreateEventForm onSubmit={handleCreateEvent} isSubmitting={isSubmitting} />
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-accent/5 border border-accent/20 rounded-lg">
          <h3 className="font-semibold text-primary mb-2">Tips for a Great Event</h3>
          <ul className="text-sm text-muted space-y-2">
            <li>• Use a clear, descriptive title that tells people what to expect</li>
            <li>• Write a detailed description highlighting what makes your event special</li>
            <li>• Set a realistic maximum number of participants</li>
            <li>• Choose the right category to help people find your event</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
