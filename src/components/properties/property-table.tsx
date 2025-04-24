"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { fetchProperties, deleteProperty } from "@/lib/actions";
import { Property } from "@/types";
import { useAppStore } from "@/stores/app-store";

export function PropertyTable({
  onEdit,
}: {
  onEdit: (property: Property) => void;
}) {
  const { isLoading, setIsLoading, properties, setProperties } = useAppStore();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null
  );

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await fetchProperties();
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      await deleteProperty(propertyToDelete.id);
      setProperties(properties.filter((p) => p.id !== propertyToDelete.id));
    } catch (error) {
      console.error("Failed to delete property:", error);
    } finally {
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      available: "bg-green-100 text-green-800 hover:bg-green-100",
      sold: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      reserved: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    };

    if (!variants[status]) {
      return null;
    }

    return (
      <Badge className={variants[status] || ""} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading properties...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Bedrooms</TableHead>
            <TableHead>Bathrooms</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No properties found. Add your first property!
              </TableCell>
            </TableRow>
          ) : (
            properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell className="capitalize">
                  {property.property_type}
                </TableCell>
                <TableCell>{property.city} / {property.neighborhood}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(property.price)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(property?.status ?? "No status")}
                </TableCell>
                <TableCell>{property.bedrooms}</TableCell>
                <TableCell>{property.bathrooms}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(property)}>
                        <EditIcon className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(property)}
                        className="text-destructive focus:text-destructive"
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the property &quot;
              {propertyToDelete?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
