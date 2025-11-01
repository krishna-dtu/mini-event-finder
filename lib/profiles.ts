import { createClient } from "@/lib/supabase/server"

export async function getUserProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data
}

export async function getUserEvents() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase.from("events").select("*").eq("created_by", user.id)

  if (error) {
    console.error("Error fetching user events:", error)
    return []
  }

  return data || []
}

export async function getUserJoinedEvents() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("event_participants")
    .select(
      `
      events:event_id (
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
      )
    `,
    )
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching joined events:", error)
    return []
  }

  return data?.map((p) => p.events).filter(Boolean) || []
}

export async function getSavedEvents() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("saved_events")
    .select(
      `
      events:event_id (
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
      )
    `,
    )
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching saved events:", error)
    return []
  }

  return data?.map((s) => s.events).filter(Boolean) || []
}

export async function saveEvent(eventId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase.from("saved_events").insert({
    event_id: eventId,
    user_id: user.id,
  })

  if (error) {
    console.error("Error saving event:", error)
    throw error
  }
}

export async function unsaveEvent(eventId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase.from("saved_events").delete().eq("event_id", eventId).eq("user_id", user.id)

  if (error) {
    console.error("Error unsaving event:", error)
    throw error
  }
}
