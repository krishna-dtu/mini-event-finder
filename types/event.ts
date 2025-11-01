export interface Event {
  id: string
  title: string
  description: string
  location: string
  latitude: number
  longitude: number
  date: string
  category?: string
  maxParticipants: number
  currentParticipants: number
  createdAt: string
}

export interface EventFilters {
  searchQuery: string
  selectedCategory?: string
  selectedDate?: string
}

export interface NearbyParams {
  lat: number
  lng: number
  radius: number
}
