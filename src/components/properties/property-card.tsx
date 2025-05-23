import { BedDouble, Bath, Car, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Property } from "@/types";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const t = useTranslations("property");

  const statusColor = {
    available: "bg-green-100 text-green-800",
    sold: "bg-red-100 text-red-800",
    reserved: "bg-yellow-100 text-yellow-800",
  }[property?.status ?? "available"];

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md py-0">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={
              property.main_photo
                ? property.main_photo
                : `https://kzmfrb706jqxywn2ntrn.lite.vusercontent.net/placeholder.svg?height=300&width=500&text=${property.title}`
            }
            alt={property.title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          <Badge className={`absolute top-2 right-2 ${statusColor}`}>
            {t(property.status!)}
          </Badge>
        </div>

        <CardContent className="px-4">
          <h3 className="text-lg font-semibold line-clamp-1 mb-1">
            {property.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-2">
            {property.city} / {property.neighborhood}
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
            <span className="capitalize">{t(property.property_type)}</span>
            <span>
              {t("created_at")}{" "}
              {property?.created_at?.toLocaleDateString() ?? "N/A"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
