export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          location: string
          latitude: number | null
          longitude: number | null
          category: string
          date: string
          max_participants: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          description?: string | null
          location: string
          latitude?: number | null
          longitude?: number | null
          category: string
          date: string
          max_participants?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          location?: string
          latitude?: number | null
          longitude?: number | null
          category?: string
          date?: string
          max_participants?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      event_participants: {
        Row: {
          id: string
          event_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          event_id: string
          user_id?: string
          joined_at?: string
        }
        Update: {
          event_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
