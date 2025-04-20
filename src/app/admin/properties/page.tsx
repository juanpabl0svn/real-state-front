"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, Check, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Property, PropertyTypes } from "@/types"
import { getNotApprovedProperties, approveProperty, rejectProperty } from "@/lib/actions"

export default function PropertiesAdminPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [propertyToAccept, setPropertyToAccept] = useState<Property | null>(null)
  const [propertyToReject, setPropertyToReject] = useState<Property | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    ; (async () => {
      const { data } = await getNotApprovedProperties()
      setProperties(data)
      console.log(data)
    })()
  }, [])

  // Filter properties based on search query
  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle property acceptance
  const handleAcceptClick = (property: Property) => {
    setPropertyToAccept(property)
    setAcceptDialogOpen(true)
  }

  const handleAcceptConfirm = async (id: string) => {
    setIsSubmitting(true)
    try {
      // Llamamos a la acción que aprueba en back-end
      const updated = await approveProperty(id)
      if (updated) {
        // Removemos la propiedad aprobada de la lista de no aprobadas
        setProperties((prev) => prev.filter((p) => p.id !== id))
      } else {
        console.error("No se devolvió la propiedad aprobada")
      }
    } catch (e) {
      console.error("Error al aprobar la propiedad:", e)
    } finally {
      setIsSubmitting(false)
      setAcceptDialogOpen(false)
      setPropertyToAccept(null)
    }
  }

  // Handle property rejection
  const handleRejectClick = (property: Property) => {
    setPropertyToReject(property)
    setRejectDialogOpen(true)
  }

  const handleRejectConfirm = async (id: string) => {
    setIsSubmitting(true)
    try {
      const sent = await rejectProperty(id)
      if (sent) {
        // Quitamos la propiedad rechazada de la lista
        setProperties((prev) => prev.filter((p) => p.id !== id))
      } else {
        console.error("No se pudo enviar el email de rechazo")
      }
    } catch (e) {
      console.error("Error al rechazar la propiedad:", e)
    } finally {
      setIsSubmitting(false)
      setRejectDialogOpen(false)
      setPropertyToReject(null)
    }
  }

  const getStatusBadge = (status: PropertyTypes) => {
    const statusStyles = {
      available: "bg-green-100 text-green-800 hover:bg-green-100",
      sold: "bg-red-100 text-red-800 hover:bg-red-100",
      reserved: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    }

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Property Management</h1>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSearchQuery("")}>All Properties</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery("house")}>Houses</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery("apartment")}>Apartments</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery("land")}>Land</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery("office")}>Offices</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No properties found. Try a different search or add a new property.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell className="capitalize">{property.property_type}</TableCell>
                      <TableCell className="hidden md:table-cell">{property.location}</TableCell>
                      <TableCell className="hidden md:table-cell">${property.price.toLocaleString()}</TableCell>
                      <TableCell className="hidden md:table-cell">{getStatusBadge(property.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
                            <Link href={`/properties/${property.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAcceptClick(property)}
                            className="h-8 w-8 text-green-500 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRejectClick(property)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Accept Property Dialog */}
      {propertyToAccept && (
        <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar aprobación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas aprobar la propiedad "{propertyToAccept.title}"?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setAcceptDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleAcceptConfirm(propertyToAccept.id)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Aprobando..." : "Confirmar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Property Dialog */}
      {propertyToReject && (
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar rechazo</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas rechazar la propiedad "{propertyToReject.title}"?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => handleRejectConfirm(propertyToReject.id)}>
                Rechazar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
