// import { useState } from "react";
// import { PropertyTable } from "@/components/properties/property-table";
// import { PropertyForm } from "@/components/properties/property-form";
// import { Button } from "@/components/ui/button";
// import { PlusIcon } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { IPropertyForm, Property, ReturnTypeHandler } from "@/types";
// import { useAppStore } from "@/stores/app-store";
// import { createProperty, updateProperty } from "@/lib/actions";

// export function SellersPage() {
//   const [editingProperty, setEditingProperty] = useState<Property | null>(null);

//   const { tab, setTab } = useAppStore();

//   const handleEdit = (property: Property) => {
//     setEditingProperty(property);
//     setTab("form");
//   };

//   const handleCreateNew = () => {
//     setEditingProperty(null);
//     setTab("form");
//   };

//   const handleSubmit = async (property: IPropertyForm) =>
//     editingProperty
//       ? updateProperty(editingProperty.id, property)
//       : createProperty(property);

//   return (
//     <div className="container mx-auto py-10">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Property Management</h1>
//         <Button onClick={handleCreateNew}>
//           <PlusIcon className="mr-2 h-4 w-4" />
//           Add New Property
//         </Button>
//       </div>
//       <Tabs value={tab ?? "list"} onValueChange={setTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="list">Properties List</TabsTrigger>
//           <TabsTrigger value="form">
//             {editingProperty ? "Edit Property" : "Add New Property"}
//           </TabsTrigger>
//         </TabsList>
//         <TabsContent value="list">
//           <PropertyTable onEdit={handleEdit} />
//         </TabsContent>
//         <TabsContent value="form">
//           <PropertyForm
//             property={editingProperty}
//             handleSubmit={handleSubmit}
//           />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

"use client"

import { Mail, Phone, MapPin, Award, Star, Heart, Link } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SellersPage() {
  // Estado para controlar los vendedores favoritos
  const [favoritos, setFavoritos] = useState<number[]>([])

  // Función para alternar el estado de favorito
  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => (prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]))
  }

  // Datos de ejemplo de vendedores
  const vendedores = [
    {
      id: 1,
      nombre: "Ana Martínez",
      foto: "/placeholder.svg?height=300&width=300",
      especialidad: "Propiedades de lujo",
      experiencia: "8 años",
      email: "ana.martinez@inmobiliaria.com",
      telefono: "+34 612 345 678",
      zona: "Centro y Norte",
      destacado: true,
      propiedadesVendidas: 124,
    },
    {
      id: 2,
      nombre: "Carlos Rodríguez",
      foto: "/placeholder.svg?height=300&width=300",
      especialidad: "Apartamentos",
      experiencia: "5 años",
      email: "carlos.rodriguez@inmobiliaria.com",
      telefono: "+34 623 456 789",
      zona: "Costa y Playa",
      destacado: false,
      propiedadesVendidas: 87,
    },
    {
      id: 3,
      nombre: "Laura Sánchez",
      foto: "/placeholder.svg?height=300&width=300",
      especialidad: "Casas unifamiliares",
      experiencia: "12 años",
      email: "laura.sanchez@inmobiliaria.com",
      telefono: "+34 634 567 890",
      zona: "Zona Residencial",
      destacado: true,
      propiedadesVendidas: 215,
    },
    {
      id: 4,
      nombre: "Miguel Fernández",
      foto: "/placeholder.svg?height=300&width=300",
      especialidad: "Locales comerciales",
      experiencia: "7 años",
      email: "miguel.fernandez@inmobiliaria.com",
      telefono: "+34 645 678 901",
      zona: "Distrito Financiero",
      destacado: false,
      propiedadesVendidas: 63,
    },
    {
      id: 5,
      nombre: "Elena Gómez",
      foto: "/placeholder.svg?height=300&width=300",
      especialidad: "Inversiones inmobiliarias",
      experiencia: "10 años",
      email: "elena.gomez@inmobiliaria.com",
      telefono: "+34 656 789 012",
      zona: "Toda la ciudad",
      destacado: true,
      propiedadesVendidas: 178,
    },
    {
      id: 6,
      nombre: "Javier López",
      foto: "/placeholder.svg?height=300&width=300",
      especialidad: "Propiedades rurales",
      experiencia: "6 años",
      email: "javier.lopez@inmobiliaria.com",
      telefono: "+34 667 890 123",
      zona: "Extrarradio y Alrededores",
      destacado: false,
      propiedadesVendidas: 92,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Nuestro Equipo de Vendedores</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Profesionales inmobiliarios con experiencia para ayudarte a encontrar la propiedad perfecta
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendedores.map((vendedor) => (
          <Card key={vendedor.id} className="overflow-hidden h-full flex flex-col">
            <div className="relative">
              <Image
                src={vendedor.foto || "/vivea.svg"}
                alt={`Foto de ${vendedor.nombre}`}
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              {vendedor.destacado && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-amber-500 hover:bg-amber-600">
                    <Star className="h-3 w-3 mr-1 fill-current" /> Destacado
                  </Badge>
                </div>
              )}
            </div>
            <Link href={`${vendedor.id}`} className="absolute top-2 left-2">
              <CardHeader>
                <CardTitle className="text-xl">{vendedor.nombre}</CardTitle>
                <CardDescription className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  {vendedor.especialidad}
                </CardDescription>

              </CardHeader>
            </Link>
            <CardContent className="flex-grow">
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Zona: {vendedor.zona}</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {vendedor.experiencia} de experiencia
                  </Badge>
                  <Badge variant="secondary">{vendedor.propiedadesVendidas} propiedades vendidas</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex flex-col items-start space-y-2">
              <div className="flex items-center w-full">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm truncate">{vendedor.email}</span>
              </div>
              <div className="flex items-center w-full">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{vendedor.telefono}</span>
              </div>
              <div className="flex w-full gap-2 mt-2">
                <Button className="flex-1">Contactar</Button>
                <Button
                  variant={favoritos.includes(vendedor.id) ? "default" : "outline"}
                  size="icon"
                  onClick={() => toggleFavorito(vendedor.id)}
                  className={favoritos.includes(vendedor.id) ? "bg-rose-500 hover:bg-rose-600" : ""}
                  title={favoritos.includes(vendedor.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  <Heart className={`h-5 w-5 ${favoritos.includes(vendedor.id) ? "fill-white" : ""}`} />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
