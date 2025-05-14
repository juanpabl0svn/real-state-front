"use client"

import { Mail, Phone, MapPin, Award, Star, Heart } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/navigation"
import { useAppStore } from "@/stores/app-store"
import { fetchSellers } from "@/lib/actions/user/actions"
import { getPropertiesByUserId } from "@/lib/actions/properties/actions"
import { useTranslations } from "next-intl";

import { PropertyTypes } from "@/types"

export function SellersPage() {

  const [favoritos, setFavoritos] = useState<number[]>([])
  const { isLoading, setIsLoading, sellers, setSellers } = useAppStore();

  const t = useTranslations("common");
  const tProperties = useTranslations("property");

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await fetchSellers();
        const sellersConConteo = await Promise.all(
          data.map(async (seller) => {
            const { totalCount = 0, topTypes = [] } =
              await getPropertiesByUserId(seller.user_id, {
                includeTotalCount: true,
                includeTopTypes: true,
              })
            return {
              ...seller,
              totalCount,
              topPropertyTypes: topTypes,
              yearsExperience: new Date().getFullYear() - new Date(seller.created_at).getFullYear(),
            }
          })
        )
        setSellers(sellersConConteo);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const propertyTypeTranslation: Record<PropertyTypes, string> = {
    house: tProperties("house"),
    apartment: tProperties("apartment"),
    land: tProperties("land"),
    office: tProperties("office"),
  };

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => (prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]))
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Nuestro Equipo de Vendedores</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Profesionales inmobiliarios con experiencia para ayudarte a encontrar la propiedad perfecta
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <Card key={seller.user_id} className="overflow-hidden h-full flex flex-col">
            <div className="relative">
              <Image
                src={seller.image || "/vivea.svg"}
                alt={`Foto de ${seller.name}`}
                width={400}
                height={300}
                className="w-full h-64 object-contain"
              />
              {seller.destacado && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-amber-500 hover:bg-amber-600">
                    <Star className="h-3 w-3 mr-1 fill-current" /> Destacado
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-xl">
                <Link href={`/seller/${seller.user_id}`}>
                  {seller.name}
                </Link>
              </CardTitle>
              <CardDescription className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                {(() => {
                  if (seller.topPropertyTypes.length === 1) {
                    return `${t("expert")} ${t("in")} ${propertyTypeTranslation[seller.topPropertyTypes[0].type as PropertyTypes]}`;
                  } else if (seller.topPropertyTypes.length > 1) {
                    const types = seller.topPropertyTypes
                      .map((tp: PropertyTypes) => propertyTypeTranslation[tp.type as PropertyTypes])
                      .join(` ${t("and")} `);
                    return `${t("expert")} ${t("in")} ${types}`;
                  } else {
                    return "Especialidad no definida";
                  }
                })()}
              </CardDescription>

            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{t('zone')}: {seller.neighborhood || t("not_specified")}</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {seller.yearsExperience} de experiencia
                  </Badge>
                  <Badge variant="secondary">{seller.totalCount} propiedades</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex flex-col items-start space-y-2">
              <div className="flex items-center w-full">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm truncate">{seller.email}</span>
              </div>
              <div className="flex items-center w-full">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">+57 {seller.phone}</span>
              </div>
              <div className="flex w-full gap-2 mt-2">
                <Button className="flex-1">{t('contact')}</Button>
                <Button
                  variant={favoritos.includes(seller.id) ? "default" : "outline"}
                  size="icon"
                  onClick={() => toggleFavorito(seller.id)}
                  className={favoritos.includes(seller.id) ? "bg-rose-500 hover:bg-rose-600" : ""}
                  title={favoritos.includes(seller.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  <Heart className={`h-5 w-5 ${favoritos.includes(seller.id) ? "fill-white" : ""}`} />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
