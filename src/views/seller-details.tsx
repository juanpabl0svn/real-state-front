"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation";
import Image from "next/image"
import { Mail, Phone, MapPin, Award, Star, Heart, ArrowLeft, Building, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"


import { getUserById, addFavoriteSellerOnce, getFavoriteSellers, removeFavoriteSeller } from "@/lib/actions/user/actions"
import { Property, PropertyTypes, User } from "@/types";
import { getPropertiesByUserId } from "@/lib/actions/properties/actions";
import { PropertyCard } from "@/components/properties/property-card";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

export function SellerDetailsPage() {
    const { id } = useParams();
    const router = useRouter()
    const { data: session, status } = useSession()
    const isAuthenticated = status === "authenticated"
    const [favorites, setFavorites] = useState<string[]>([])

    const [favorito, setFavorito] = useState(false)
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        mensaje: "",
    })
    const [sended, setSended] = useState(false)
    const [seller, setSeller] = useState<User | null>(null)

    const t = useTranslations("common");
    const tProperties = useTranslations("property");
    const tSeller = useTranslations("seller");
    const tForm = useTranslations("form");


    useEffect(() => {
        (async () => {
            try {
                const user = await getUserById(id as string)
                if (!user) {
                    setSeller(null)
                    return
                }
                const { totalCount = 0, topTypes = [] } = await getPropertiesByUserId(user.user_id, {
                    includeTotalCount: true,
                    includeTopTypes: true,
                    includeProperties: true,
                })

                const sellerWithExtras = {
                    ...user,
                    totalCount,
                    topPropertyTypes: topTypes,
                    yearsExperience: new Date().getFullYear() - new Date(user.created_at).getFullYear(),
                }
                console.log("Seller with extras:", sellerWithExtras)
                setSeller(sellerWithExtras)


            } catch (error) {
                console.error("Failed to fetch user:", error)
            }
        })()
    }, [id, isAuthenticated, session?.user?.id])


    useEffect(() => {
        if (!isAuthenticated || !session?.user?.user_id) return

            ; (async () => {
                try {
                    const favSellers = await getFavoriteSellers(session.user.user_id!)
                    const favIds = favSellers.map((s) => s.user_id)
                    setFavorites(favIds)
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

    if (!seller) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Vendedor no encontrado</h1>
                <p className="mb-8">El vendedor que buscas no existe o ha sido eliminado.</p>
                <Button onClick={() => router.push("/seller")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver a vendedores
                </Button>
            </div>
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Formulario enviado:", formData)
        setSended(true)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const propertyTypeTranslation: Record<PropertyTypes, string> = {
        house: tProperties("house"),
        apartment: tProperties("apartment"),
        land: tProperties("land"),
        office: tProperties("office"),
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button variant="outline" onClick={() => router.push("/seller")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t("back")}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-1">
                    <div className="relative">
                        <Image
                            src={seller.image || "/vivea.svg"}
                            alt={`Foto de ${seller.name}`}
                            width={400}
                            height={400}
                            className="rounded-lg w-full object-cover"
                        />
                        {seller.destacado && (
                            <div className="absolute top-2 right-2">
                                <Badge className="bg-amber-500 hover:bg-amber-600">
                                    <Star className="h-3 w-3 mr-1 fill-current" /> Destacado
                                </Badge>
                            </div>
                        )}
                    </div>
                    {isAuthenticated && (

                        <Button
                            variant={favorites ? "default" : "outline"}
                            className={`mt-4 w-full ${favorites ? "bg-rose-500 hover:bg-rose-600" : ""}`}
                            onClick={() => handleToggleFavorite(seller.user_id)}
                        >
                            <Heart className={`h-5 w-5 mr-2 ${favorites ? "fill-white" : ""}`} />
                            {favorites ? `${tSeller("unfavorite")}` : `${tSeller("favorite")}`}
                        </Button>
                    )}
                </div>

                <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold mb-2">{seller.name}</h1>
                    <div className="flex items-center mb-4">
                        <Badge variant="secondary" className="mr-2">
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
                        </Badge>
                        <Badge variant="outline">{seller.yearsExperience} {tSeller('of_experece')}</Badge>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                            <span>{t('zone')}: {seller.neighborhood || t("not_specified")}</span>
                        </div>
                        <div className="flex items-center">
                            <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                            <span>{seller.totalCount} {tSeller('properties')}</span>
                        </div>
                        <div className="flex items-center">
                            <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                            <span>{seller.email}</span>
                        </div>
                        <div className="flex items-center">
                            <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                            <span>{seller.phone ? `+57 ${seller.phone}` : t("not_specified")}</span>
                        </div>
                    </div>

                    {/* <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Biografía</h2>
                        <p className="text-muted-foreground">{seller.biografia}</p>
                    </div> */}


                </div>
            </div>
            <Tabs defaultValue="propiedades" className="mt-8">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="propiedades">{tSeller('current_properties')}</TabsTrigger>
                    <TabsTrigger value="contacto">{t("contact")}</TabsTrigger>
                </TabsList>

                <TabsContent value="propiedades" className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">{tSeller('properties_of')} {seller.name}</h2>
                    {seller.properties.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {seller.properties.map((property: Property) => (
                                <PropertyCard key={property.id} property={property} />

                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-8 text-muted-foreground">
                            {tSeller("text2")}
                        </p>
                    )}
                </TabsContent>

                <TabsContent value="contacto" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{tForm('contact_with')} {seller.name}</CardTitle>
                            <CardDescription>
                                {/* {tForm('text1')} */}
                                Completa el formulario y {seller.name} se pondrá en contacto contigo lo antes posible.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!sended ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">

                                            <Input
                                                id="nombre"
                                                name="nombre"
                                                placeholder={tForm('name')}
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">

                                            <Input
                                                id="telefono"
                                                name="telefono"
                                                placeholder={tSeller('phone')}
                                                value={formData.telefono}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">

                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Tu email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Textarea
                                            id="mensaje"
                                            name="mensaje"
                                            placeholder="¿En qué puedo ayudarte?"
                                            rows={5}
                                            value={formData.mensaje}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        <Send className="mr-2 h-4 w-4" /> {tForm('send_message')}
                                    </Button>
                                </form>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                        <svg
                                            className="h-8 w-8 text-green-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-medium mb-2">{tForm('sended_message')}</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Gracias por contactar con {seller.name}. Te responderá lo antes posible.
                                    </p>
                                    <Button variant="outline" onClick={() => setSended(false)}>
                                        {tForm('send_another_message')}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
