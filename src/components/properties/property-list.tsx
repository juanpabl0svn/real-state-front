"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/properties/property-card";
import type { Property } from "@/types";
import { getFilteredProperties } from "@/lib/actions";
import { useTranslations } from "next-intl";

export function PropertyList() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);

  const t = useTranslations("property");

  useEffect(() => {
    // Create a function to fetch properties
    (async () => {
      // Get filter values from URL params
      const property_type = searchParams.get("propertyType") || undefined;
      const minPrice = searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined;
      const maxPrice = searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined;
      const city = searchParams.get("currentCity") || undefined;
      const neighborhood = searchParams.get("currentNeighborhood") || undefined;

      // Get filtered properties
      const { data } = await getFilteredProperties({
        property_type,
        minPrice,
        maxPrice,
        city,
        neighborhood,
      });

      setProperties(data);
    })();
  }, [searchParams]);

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">{t("no_properties")}</h3>
        <p className="text-muted-foreground">{t("adjust_filters")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
