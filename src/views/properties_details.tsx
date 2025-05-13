import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, BedDouble, Bath, Car, Ruler, Home } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Property } from "@/types";
import { getPropertyById } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const [mainPhoto, setMainPhoto] = useState<string>(
    "https://kzmfrb706jqxywn2ntrn.lite.vusercontent.net/placeholder.svg?height=600&width=800"
  );

  const t = useTranslations("property");

  const [otherPhotos, setOtherPhotos] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        if (id) {
          const fetchedProperty = await getPropertyById(id as string);
          if (!fetchedProperty) {
            throw new Error("Property not found");
          }
          setProperty(fetchedProperty);
          setMainPhoto(fetchedProperty.main_photo ?? mainPhoto);
          setOtherPhotos(
            fetchedProperty.photos?.map((photo) => photo.url) ?? []
          );
        }
      } catch (_e) {
        console.error("Failed to fetch property details", _e);
        toast.error(t("no_property"));

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const switchImages = (index: number) => {
    const selectedPhoto = otherPhotos[index];
    setOtherPhotos((prevPhotos) => {
      const updatedPhotos = [...prevPhotos];
      updatedPhotos[index] = mainPhoto;
      return updatedPhotos;
    });
    setMainPhoto(selectedPhoto);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 flex justify-center">
        <div className="animate-pulse">{t('loading')}</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto py-16 px-4">
        <Link href="/" className="flex items-center text-primary mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("back")}
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("no_property")}</h1>
          <p>
            The property you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const statusColor = {
    available: "bg-green-100 text-green-800",
    sold: "bg-red-100 text-red-800",
    reserved: "bg-yellow-100 text-yellow-800",
  }[property?.status ?? "available"];

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/" className="flex items-center text-primary mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("back")}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
            <img
              src={mainPhoto}
              alt={property.title}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 flex-1">
              {otherPhotos.length! > 0 ? (
                <div className="flex gap-4 overflow-x-auto">
                  {otherPhotos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Property photo ${index + 1}`}
                      onClick={() => switchImages(index)}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <p>{t("no_photo")}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <div className="flex items-center">
                <Badge className={statusColor}>{t(property.status!)}</Badge>
              </div>
            </div>

            <div className="text-2xl font-bold text-primary mb-4">
              ${Number(property.price).toLocaleString()}
            </div>

            <p className="text-muted-foreground mb-2">
              {property.city} / {property.neighborhood}
            </p>

            <div className="flex flex-wrap gap-4 my-6">
              <div className="flex items-center">
                <BedDouble className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>
                  {property.bedrooms} {t("bedrooms")}
                </span>
              </div>
              <div className="flex items-center">
                <Bath className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>
                  {property.bathrooms} {t("bathrooms")}
                </span>
              </div>
              <div className="flex items-center">
                <Car className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>
                  {property.parking_spaces} {t("parking_spaces")}
                </span>
              </div>
              <div className="flex items-center">
                <Ruler className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{Number(property.area).toLocaleString()} m²</span>
              </div>
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="capitalize">{t(property.property_type)}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h2 className="text-xl font-semibold mb-4">{t("description")}</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {property.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("contact_info")}
              </h3>
              <p className="mb-6">{t("info")}</p>

              <Button className="w-full mb-3">{t("contact_seller")}</Button>
              <Button variant="outline" className="w-full">
                {t("schedule_advice")}
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("property_details")}
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("property_type")}
                  </span>
                  <span className="font-medium capitalize">
                    {t(property.property_type)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("created_at")}
                  </span>
                  <span className="font-medium">
                    {property?.created_at?.toLocaleDateString() ?? "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("status")}</span>
                  <span className="font-medium capitalize">
                    {t(property.status!)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
