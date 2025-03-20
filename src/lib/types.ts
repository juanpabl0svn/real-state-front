export interface Property {
  id: string
  owner_id: string
  title: string
  description: string
  price: number
  location: string
  area: number
  bedrooms: number
  bathrooms: number
  parking_spaces: number
  property_type: "house" | "apartment" | "land" | "office"
  status: "available" | "sold" | "reserved"
  is_deleted: boolean
  is_sold: boolean
  is_approved: boolean
  created_at: string
}

export interface FilterOptions {
  type?: string
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  status?: string
}

