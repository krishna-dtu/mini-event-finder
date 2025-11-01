import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/supabase"

type Event = Database["public"]["Tables"]["events"]["Row"]

export async function getEvents() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id,
      title,
      description,
      location,
      latitude,
      longitude,
      category,
      date,
      max_participants,
      created_by,
      created_at,
      updated_at
    `,
    )
    .order("date", { ascending: true })

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return data || []
}

export async function getEventById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching event:", error)
    return null
  }

  return data
}

export async function createEvent(eventData: {
  title: string
  description: string
  location: string
  latitude: number
  longitude: number
  category: string
  date: string
  max_participants: number
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase.from("events").insert({
    ...eventData,
    created_by: user.id,
  })

  if (error) {
    console.error("Error creating event:", error)
    throw error
  }

  return data
}

export async function updateEvent(
  id: string,
  eventData: Partial<Omit<Event, "id" | "created_by" | "created_at" | "updated_at">>,
) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("events").update(eventData).eq("id", id)

  if (error) {
    console.error("Error updating event:", error)
    throw error
  }

  return data
}

export async function deleteEvent(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) {
    console.error("Error deleting event:", error)
    throw error
  }
}

export async function getEventParticipants(eventId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("event_participants").select("*").eq("event_id", eventId)

  if (error) {
    console.error("Error fetching participants:", error)
    return []
  }

  return data || []
}

export async function joinEvent(eventId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase.from("event_participants").insert({
    event_id: eventId,
    user_id: user.id,
  })

  if (error) {
    console.error("Error joining event:", error)
    throw error
  }
}

export async function leaveEvent(eventId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase.from("event_participants").delete().eq("event_id", eventId).eq("user_id", user.id)

  if (error) {
    console.error("Error leaving event:", error)
    throw error
  }
}
