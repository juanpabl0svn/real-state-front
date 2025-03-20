"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PropertyCard } from "@/components/property-card"
import { getFilteredProperties } from "@/lib/data"
import type { Property } from "@/lib/types"

export function PropertyList() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    // Create a function to fetch properties
    const fetchProperties = () => {
      // Get filter values from URL params
      const type = searchParams.get("type") || undefined
      const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined
      const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined
      const minBedrooms = searchParams.get("minBedrooms") ? Number(searchParams.get("minBedrooms")) : undefined
      const status = searchParams.get("status") || undefined

      // Get filtered properties
      const filteredProperties = getFilteredProperties({
        type,
        minPrice,
        maxPrice,
        minBedrooms,
        status,
      })

      setProperties(filteredProperties)
    }

    // Call the function
    fetchProperties()

    // The dependency array includes searchParams, which is stable between renders
    // as long as the URL parameters don't change
  }, [searchParams])

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No properties found</h3>
        <p className="text-muted-foreground">Try adjusting your filters to find more properties.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}

