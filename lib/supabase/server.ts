// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const getAll = async () => {
    const store: any = await cookies()
    return (store.getAll ? store.getAll() : []).map((c: any) => ({ name: c.name, value: c.value, path: c.path, domain: c.domain }))
  }

  const setAll = async (items: Array<{ name: string; value: string; options?: any }>) => {
    const store: any = await cookies()
    for (const item of items) {
      if (item.options) {
        store.set({ name: item.name, value: item.value, ...item.options })
      } else {
        store.set(item.name, item.value)
      }
    }
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll, setAll } }
  )
}
