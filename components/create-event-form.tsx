"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"

interface CreateEventFormProps {
  onSubmit: (data: {
    title: string
    description: string
    location: string
    latitude: number
    longitude: number
    category: string
    date: string
    max_participants: number
  }) => Promise<void>
  isSubmitting: boolean
}

const CATEGORIES = ["Tech", "Music", "Sports", "Art", "Business", "Food", "Health", "Education", "Other"]

export default function CreateEventForm({ onSubmit, isSubmitting }: CreateEventFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    latitude: 0,
    longitude: 0,
    date: "",
    category: "Tech",
    max_participants: 100,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Event title is required"
    if (!formData.description.trim()) newErrors.description = "Event description is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (new Date(formData.date) < new Date()) newErrors.date = "Event date must be in the future"
    if (formData.max_participants < 1) newErrors.max_participants = "Maximum participants must be at least 1"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await onSubmit({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        date: new Date(formData.date).toISOString(),
        category: formData.category,
        max_participants: formData.max_participants,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "max_participants"
          ? Number.parseInt(value)
          : name === "latitude" || name === "longitude"
            ? Number.parseFloat(value)
            : value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., React Conference 2025"
          className={`w-full px-4 py-3 bg-background border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors ${
            errors.title ? "border-destructive" : "border-border"
          }`}
        />
        {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tell us about your event... What will attendees experience?"
          rows={5}
          className={`w-full px-4 py-3 bg-background border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none ${
            errors.description ? "border-destructive" : "border-border"
          }`}
        />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
          Location *
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., San Francisco, CA"
          className={`w-full px-4 py-3 bg-background border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors ${
            errors.location ? "border-destructive" : "border-border"
          }`}
        />
        {errors.location && <p className="text-sm text-destructive mt-1">{errors.location}</p>}
      </div>

      {/* Grid: Category and Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
            Event Date *
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-background border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors ${
              errors.date ? "border-destructive" : "border-border"
            }`}
          />
          {errors.date && <p className="text-sm text-destructive mt-1">{errors.date}</p>}
        </div>
      </div>

      {/* Max Participants */}
      <div>
        <label htmlFor="max_participants" className="block text-sm font-medium text-foreground mb-2">
          Maximum Participants *
        </label>
        <input
          type="number"
          id="max_participants"
          name="max_participants"
          value={formData.max_participants}
          onChange={handleChange}
          min="1"
          max="10000"
          className={`w-full px-4 py-3 bg-background border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors ${
            errors.max_participants ? "border-destructive" : "border-border"
          }`}
        />
        {errors.max_participants && <p className="text-sm text-destructive mt-1">{errors.max_participants}</p>}
      </div>

      {/* Coordinates (Optional) */}
      <div className="bg-background/50 border border-border/50 rounded-lg p-4">
        <p className="text-sm text-muted mb-4">Optional: Set coordinates for map display</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-foreground mb-2">
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="0"
              step="0.000001"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-foreground mb-2">
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="0"
              step="0.000001"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 px-6 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Event...
          </>
        ) : (
          "Create Event"
        )}
      </button>

      <p className="text-xs text-muted text-center">
        * Required fields. You can update your event details after creation.
      </p>
    </form>
  )
}
