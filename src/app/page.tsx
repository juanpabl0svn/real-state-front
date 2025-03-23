import { PropertyList } from "@/components/property-list";
import { PropertyFilters } from "@/components/property-filters";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Suspense fallback={<div>Loading filters...</div>}>
            <PropertyFilters />
          </Suspense>
        </div>

        <div className="lg:col-span-3">
          <Suspense fallback={<div>Loading properties ...</div>}>
            <PropertyList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
