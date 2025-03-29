"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/property-form";
import type { Property } from "@/types";
import { getPropertyById, updateProperty } from "@/lib/actions";

export default function EditPropertyPage() {
  const router = useRouter();
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (id) {
        // Fetch property data
        const fetchedProperty = await getPropertyById(id as string);
        setProperty(fetchedProperty);
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 flex justify-center">
        <div className="animate-pulse">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto py-16 px-4">
        <Link
          href="/admin/properties"
          className="flex items-center text-primary mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to properties
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p>
            The property you are trying to edit does not exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link
        href="/admin/properties"
        className="flex items-center text-primary mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to properties
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit Property</h1>

      <PropertyForm
        property={property}
      />
    </div>
  );
}
