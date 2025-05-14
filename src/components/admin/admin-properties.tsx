import { useState, useEffect } from "react";
import { Search, Filter, Check, X, Eye } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Property, PropertyTypes } from "@/types";
import {
  getNotApprovedProperties,
  approveProperty,
  rejectProperty,
} from "@/lib/actions";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [propertyToAccept, setPropertyToAccept] = useState<Property | null>(
    null
  );
  const [propertyToReject, setPropertyToReject] = useState<Property | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations();

  useEffect(() => {
    (async () => {
      const { data } = await getNotApprovedProperties();
      setProperties(data);
    })();
  }, []);

  // Filter properties based on search query
  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.property_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle property acceptance
  const handleAcceptClick = (property: Property) => {
    setPropertyToAccept(property);
    setAcceptDialogOpen(true);
  };

  const handleAcceptConfirm = async (id: string) => {
    setIsSubmitting(true);
    try {
      // Llamamos a la acción que aprueba en back-end
      const updated = await approveProperty(id);
      if (updated) {
        // Removemos la propiedad aprobada de la lista de no aprobadas
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error("No se devolvió la propiedad aprobada");
      }
    } catch (e) {
      console.error("Error al aprobar la propiedad:", e);
    } finally {
      setIsSubmitting(false);
      setAcceptDialogOpen(false);
      setPropertyToAccept(null);
    }
  };

  const [reason, setReason] = useState<string>("");

  // Handle property rejection
  const handleRejectClick = (property: Property) => {
    setPropertyToReject(property);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async (id: string) => {
    setIsSubmitting(true);
    try {
      const sent = await rejectProperty(id, reason);
      if (sent) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error("No se pudo enviar el email de rechazo");
      }
    } catch (e) {
      console.error("Error al rechazar la propiedad:", e);
    } finally {
      setIsSubmitting(false);
      setRejectDialogOpen(false);
      setPropertyToReject(null);
    }
  };

  const getStatusBadge = (status: PropertyTypes) => {
    const statusStyles = {
      available: "bg-green-100 text-green-800 hover:bg-green-100",
      sold: "bg-red-100 text-red-800 hover:bg-red-100",
      reserved: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    };

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {t(`property.${status}`)}
      </Badge>
    );
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>{t("admin.properties")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("admin.search_property")}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> {t("filter.filter")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSearchQuery("")}>
                  {t("filter.all")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery("house")}>
                  {t("property.house")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery("apartment")}>
                  {t("property.apartment")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery("land")}>
                  {t("property.land")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery("office")}>
                  {t("property.office")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("property.title")}</TableHead>
                  <TableHead>{t("property.property_type")}</TableHead>
                  <TableHead className="hidden md:table-cell">
                    {t("property.location")}
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    {t("property.price")}
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    {t("property.status")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("admin.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {t("property.no_properties")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium text-pretty max-w-[200px] truncate">
                        {property.title}
                      </TableCell>
                      <TableCell className="capitalize">
                        {t(`property.${property.property_type}`)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {property.city} / {property.neighborhood}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        ${property.price.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(property.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-gray-700"
                          >
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
              <DialogTitle>{t("admin.confirm_approve")}</DialogTitle>
              <DialogDescription>
                {t("admin.sure_approve_property", {
                  propertyTitle: propertyToAccept.title,
                })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setAcceptDialogOpen(false)}
                disabled={isSubmitting}
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={() => handleAcceptConfirm(propertyToAccept.id)}
                disabled={isSubmitting}
              >
                {isSubmitting ? t("admin.approving") : t("admin.approve")}
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
              <DialogTitle>{t('admin.confirm_reject')}</DialogTitle>
              <DialogDescription>
                {t("admin.sure_reject_property", {
                  propertyTitle: propertyToReject.title,
                })}
              </DialogDescription>
              <label htmlFor="reason">{t("admin.reason")}</label>
              <Input
                placeholder={t("admin.reason_placeholder")}
                className="mt-2"
                value={reason}
                id="reason"
                onChange={(e) => setReason(e.target.value)}
              />
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setRejectDialogOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleRejectConfirm(propertyToReject.id)}
                disabled={isSubmitting || !reason}
              >
                {isSubmitting ? t("admin.rejecting") : t("admin.reject")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
