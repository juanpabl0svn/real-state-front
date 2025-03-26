"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Pencil, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeletePropertyDialog } from "@/components/delete-property-dialog";
import type { Property, PropertyTypes } from "@/types";
import { getAllProperties } from "@/lib/actions";

export default function PropertiesAdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const { data } = await getAllProperties();
      setProperties(data);
    })();
  }, []);

  // Filter properties based on search query
  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle property deletion
  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    // In a real app, this would call an API
    setProperties(properties.filter((property) => property.id !== id));
    setDeleteDialogOpen(false);
    setPropertyToDelete(null);
  };

  const getStatusBadge = (status: PropertyTypes) => {
    const statusStyles = {
      available: "bg-green-100 text-green-800 hover:bg-green-100",
      sold: "bg-red-100 text-red-800 hover:bg-red-100",
      reserved: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    };

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

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
                <DropdownMenuItem onClick={() => setSearchQuery("")}>
                  All Properties
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery("house")}>
                  Houses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery("apartment")}>
                  Apartments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery("land")}>
                  Land
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery("office")}>
                  Offices
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No properties found. Try a different search or add a new
                      property.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">
                        {property.title}
                      </TableCell>
                      <TableCell className="capitalize">
                        {property.property_type}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {property.location}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        ${property.price.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(property.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link
                              href={`/admin/properties/edit/${property.id}`}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteClick(property)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
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

      {propertyToDelete && (
        <DeletePropertyDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          property={propertyToDelete}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
