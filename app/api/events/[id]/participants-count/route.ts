import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.from("event_participants").select("*").eq("event_id", id)

  if (error) {
    console.error("Error fetching participants:", error)
    return NextResponse.json({ count: 0 }, { status: 200 })
  }

  return NextResponse.json({ count: data?.length || 0 })
}
