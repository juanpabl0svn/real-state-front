import Link from "next/link";
import { BedDouble, Bath, Car, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const statusColor = {
    available: "bg-green-100 text-green-800",
    sold: "bg-red-100 text-red-800",
    reserved: "bg-yellow-100 text-yellow-800",
  }[property?.status ?? "available"];

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={`https://kzmfrb706jqxywn2ntrn.lite.vusercontent.net/placeholder.svg?height=300&width=500&text=${property.title}`}
            alt={property.title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          <Badge className={`absolute top-2 right-2 ${statusColor}`}>
            {property.status}
          </Badge>
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1 mb-1">
            {property.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-2">
            {property.location}
          </p>
          <p className="text-xl font-bold text-primary mb-3">
            ${property.price.toLocaleString()}
          </p>

          <div className="grid grid-cols-4 gap-2 text-sm">
            <div className="flex flex-col items-center">
              <BedDouble className="h-4 w-4 mb-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex flex-col items-center">
              <Bath className="h-4 w-4 mb-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex flex-col items-center">
              <Car className="h-4 w-4 mb-1" />
              <span>{property.parking_spaces}</span>
            </div>
            <div className="flex flex-col items-center">
              <Ruler className="h-4 w-4 mb-1" />
              <span>{Number(property.area).toLocaleString()}m²</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
          <div className="flex justify-between w-full">
            <span className="capitalize">{property.property_type}</span>
            <span>
              Listed: {property?.created_at?.toLocaleDateString() ?? "N/A"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
