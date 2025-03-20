import type { Property, FilterOptions } from "@/lib/types"

// Mock data based on the SQL schema
const mockProperties: Property[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    owner_id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    title: "Modern Beachfront Villa",
    description:
      "Luxurious beachfront villa with stunning ocean views. This property features high-end finishes, an infinity pool, and direct beach access. Perfect for those seeking a premium lifestyle with all modern amenities.",
    price: 1250000,
    location: "Malibu, CA",
    area: 350,
    bedrooms: 4,
    bathrooms: 3,
    parking_spaces: 2,
    property_type: "house",
    status: "available",
    is_deleted: false,
    is_sold: false,
    is_approved: true,
    created_at: "2023-05-15T10:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    owner_id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    title: "Downtown Luxury Apartment",
    description:
      "High-end apartment in the heart of downtown. Features include floor-to-ceiling windows, premium appliances, and access to building amenities including a gym, pool, and concierge service.",
    price: 750000,
    location: "New York, NY",
    area: 120,
    bedrooms: 2,
    bathrooms: 2,
    parking_spaces: 1,
    property_type: "apartment",
    status: "available",
    is_deleted: false,
    is_sold: false,
    is_approved: true,
    created_at: "2023-06-20T14:45:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    owner_id: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
    title: "Suburban Family Home",
    description:
      "Spacious family home in a quiet suburban neighborhood. Features a large backyard, updated kitchen, and finished basement. Close to schools, parks, and shopping centers.",
    price: 550000,
    location: "Austin, TX",
    area: 220,
    bedrooms: 4,
    bathrooms: 2.5,
    parking_spaces: 2,
    property_type: "house",
    status: "available",
    is_deleted: false,
    is_sold: false,
    is_approved: true,
    created_at: "2023-07-05T09:15:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    owner_id: "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
    title: "Commercial Office Space",
    description:
      "Prime commercial office space in the business district. Open floor plan with modern design, high-speed internet, and conference rooms. Ideal for startups or established businesses.",
    price: 1200000,
    location: "Chicago, IL",
    area: 300,
    bedrooms: 0,
    bathrooms: 2,
    parking_spaces: 5,
    property_type: "office",
    status: "available",
    is_deleted: false,
    is_sold: false,
    is_approved: true,
    created_at: "2023-08-10T11:20:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    owner_id: "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9",
    title: "Mountain View Cabin",
    description:
      "Cozy cabin with breathtaking mountain views. Features include a stone fireplace, wooden beams, and a wraparound deck. Perfect for a vacation home or rental property.",
    price: 425000,
    location: "Aspen, CO",
    area: 150,
    bedrooms: 3,
    bathrooms: 2,
    parking_spaces: 2,
    property_type: "house",
    status: "reserved",
    is_deleted: false,
    is_sold: false,
    is_approved: true,
    created_at: "2023-09-25T16:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    owner_id: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
    title: "Waterfront Condo",
    description:
      "Elegant waterfront condo with panoramic views. Features include high ceilings, gourmet kitchen, and private balcony. Building amenities include a fitness center, pool, and 24-hour security.",
    price: 850000,
    location: "Miami, FL",
    area: 180,
    bedrooms: 3,
    bathrooms: 2,
    parking_spaces: 2,
    property_type: "apartment",
    status: "sold",
    is_deleted: false,
    is_sold: true,
    is_approved: true,
    created_at: "2023-10-15T13:45:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    owner_id: "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1",
    title: "Development Land",
    description:
      "Prime development land in a growing area. Zoned for residential or mixed-use development. Utilities available at the property line. Great investment opportunity.",
    price: 2000000,
    location: "Seattle, WA",
    area: 5000,
    bedrooms: 0,
    bathrooms: 0,
    parking_spaces: 0,
    property_type: "land",
    status: "available",
    is_deleted: false,
    is_sold: false,
    is_approved: true,
    created_at: "2023-11-05T10:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    owner_id: "g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2",
    title: "Historic Townhouse",
    description:
      "Beautifully restored historic townhouse in a prestigious neighborhood. Features include original hardwood floors, crown molding, and a gourmet kitchen with modern appliances.",
    price: 1100000,
    location: "Boston, MA",
    area: 210,
    bedrooms: 3,
    bathrooms: 2.5,
    parking_spaces: 1,
    property_type: "house",
    status: "available",
    is_deleted: false,
    is_sold: false,
    is_approved: true,
    created_at: "2023-12-20T15:15:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    owner_id: "h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3",
    title: "Luxury Penthouse",
    description:
      "Spectacular penthouse with 360-degree city views. Features include a private elevator, chef's kitchen, and expansive terrace. Building amenities include concierge, valet parking, and spa.",
    price: 3500000,
    location: "San Francisco, CA",
    area: 300,
    bedrooms: 4,
    bathrooms: 4.5,
    parking_spaces: 3,
    property_type: "apartment",
    status: "available",
    is_deleted: false,
    is_sold: false,
    is_approved: true,
    created_at: "2024-01-10T12:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    owner_id: "i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4",
    title: "Ranch with Acreage",
    description:
      "Spacious ranch on 20 acres of land. Features include a main house, guest house, barn, and riding arena. Perfect for equestrian enthusiasts or those seeking privacy and space.",
    price: 1750000,
    location: "Denver, CO",
    area: 400,
    bedrooms: 5,
    bathrooms: 3,
    parking_spaces: 4,
    property_type: "house",
    status: "available",
    is_deleted: false,
    is_sold: false,
    is_approved: true,
    created_at: "2024-02-15T09:45:00Z",
  },
]

// Get all properties
export function getAllProperties(): Property[] {
  return mockProperties.filter((property) => !property.is_deleted)
}

// Get property by ID
export function getPropertyById(id: string): Property | null {
  return mockProperties.find((property) => property.id === id && !property.is_deleted) || null
}

// Get filtered properties
export function getFilteredProperties(filters: FilterOptions): Property[] {
  return mockProperties.filter((property) => {
    // Skip deleted properties
    if (property.is_deleted) return false

    // Filter by property type
    if (filters.type && filters.type !== "all" && property.property_type !== filters.type) return false

    // Filter by price range
    if (filters.minPrice && property.price < filters.minPrice) return false
    if (filters.maxPrice && property.price > filters.maxPrice) return false

    // Filter by bedrooms
    if (filters.minBedrooms && property.bedrooms < filters.minBedrooms) return false

    // Filter by status
    if (filters.status && filters.status !== "all" && property.status !== filters.status) return false

    return true
  })
}

