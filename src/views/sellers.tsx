"use client"

import { Mail, Phone, MapPin, Award, Star, Heart } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link, useRouter } from "@/i18n/navigation"
import { useAppStore } from "@/stores/app-store"
import { fetchSellers, addFavoriteSellerOnce, getFavoriteSellers, removeFavoriteSeller } from "@/lib/actions/user/actions"
import { getPropertiesByUserId } from "@/lib/actions/properties/actions"
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { PropertyTypes } from "@/types"

export function SellersPage() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"

  const [favorites, setFavorites] = useState<string[]>([])
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const { isLoading, setIsLoading, sellers, setSellers } = useAppStore();


  const t = useTranslations("common");
  const tProperties = useTranslations("property");
  const tSellers = useTranslations("seller");


  const router = useRouter();
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await fetchSellers();
        const sellersCount = await Promise.all(
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
        setSellers(sellersCount);
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

  useEffect(() => {
    if (!isAuthenticated || !session?.user?.user_id) return

      ; (async () => {
        try {
          const favSellers = await getFavoriteSellers(session.user.user_id!)
          const favIds = favSellers.map((s) => s.user_id)
          setFavorites(favIds)
          console.log("Favoritos cargados:", favSellers)
        } catch (err) {
          console.error("No se pudieron cargar favoritos:", err)
        }
      })()
  }, [isAuthenticated, session?.user?.id])

  async function handleToggleFavorite(sellerId: string) {
    if (!session?.user?.user_id) return

    try {
      let updatedUser
      if (favorites.includes(sellerId)) {
        updatedUser = await removeFavoriteSeller(
          session.user.user_id,
          sellerId
        )
      } else {
        updatedUser = await addFavoriteSellerOnce(
          session.user.user_id,
          sellerId
        )
      }
      setFavorites(updatedUser.favoriteSellersId)
    } catch (err) {
      console.error("Error toggling favorite:", err)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{tSellers('title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {tSellers('text1')}
        </p>
      </div>
      {isAuthenticated && (

        <div className="flex justify-center mb-8">
          <Button
            variant={showOnlyFavorites ? "default" : "outline"}
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={showOnlyFavorites ? "bg-rose-500 hover:bg-rose-600" : ""}
          >
            <Heart className={`h-5 w-5 mr-2 ${showOnlyFavorites ? "fill-white" : ""}`} />
            {showOnlyFavorites ? `${tSellers('showing_favorites')}` : `${tSellers('show_favorites')}`}
          </Button>
        </div>
      )}

      {showOnlyFavorites && sellers.filter((seller) => favorites.includes(seller.user_id)).length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-xl font-medium">No tienes vendedores favoritos</h3>
          <p className="mt-2 text-muted-foreground">Marca algunos vendedores como favoritos para verlos aquí</p>
          <Button variant="outline" className="mt-4" onClick={() => setShowOnlyFavorites(false)}>
            Ver todos los vendedores
          </Button>
        </div>
      )}

      {sellers.filter((seller) => (showOnlyFavorites ? favorites.includes(seller.user_id) : true)).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers
            .filter((seller) => (showOnlyFavorites ? favorites.includes(seller.user_id) : true))
            .map((seller) => (
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
                        return `${t("not_specified")}`;
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
                        {seller.yearsExperience} {tSellers("of_experece")}
                      </Badge>
                      <Badge variant="secondary">{seller.totalCount} {tSellers("properties")}</Badge>
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
                    <span className="text-sm"> {seller.phone ? `+57 ${seller.phone}` : t("not_specified")}</span>
                  </div>
                  <div className="flex w-full gap-2 mt-2">
                    <Button className="flex-1" onClick={() => router.push(`/seller/${seller.user_id}`)}>{t('contact')}</Button>
                    {isAuthenticated && (
                      <Button
                        variant={favorites.includes(seller.user_id) ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleToggleFavorite(seller.user_id)}
                        className={favorites.includes(seller.user_id) ? "bg-rose-500 hover:bg-rose-600" : ""}
                        title={favorites.includes(seller.user_id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                      >
                        <Heart className={`h-5 w-5 ${favorites.includes(seller.user_id) ? "fill-white" : ""}`} />
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
