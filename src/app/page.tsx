import { PropertyList } from "@/components/property-list"
import { PropertyFilters } from "@/components/property-filters"

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Find Your Dream Property</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <PropertyFilters />
        </div>

        <div className="lg:col-span-3">
          <PropertyList />
        </div>
      </div>
    </div>
  )
}

