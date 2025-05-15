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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { UserSellerPermissions } from "@/types";
import {
  approvePermissionSeller,
  getUsersPermissionsSeller,
  rejectPermissionSeller,
} from "@/lib/actions";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function AdminUsers() {
  const [users, setUsers] = useState<UserSellerPermissions[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [userToAccept, setUserToAccept] =
    useState<UserSellerPermissions | null>(null);
  const [userToReject, setUserToReject] =
    useState<UserSellerPermissions | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations();

  useEffect(() => {
    (async () => {
      const data = await getUsersPermissionsSeller();
      if (data.error) return;
      if (!data.data) {
        console.error("No se devolvió la data");
        return;
      }
      setUsers(data.data);
    })();
  }, []);

  // Handle property acceptance
  const handleAcceptClick = (permission: UserSellerPermissions) => {
    setUserToAccept(permission);
    setAcceptDialogOpen(true);
  };

  const handleAcceptConfirm = async (id: string) => {
    setIsSubmitting(true);
    try {
      // Llamamos a la acción que aprueba en back-end
      const updated = await approvePermissionSeller(id);
      if (updated) {
        // Removemos la propiedad aprobada de la lista de no aprobadas
        setUsers((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error("No se devolvió la propiedad aprobada");
      }
    } catch (e) {
      console.error("Error al aprobar la propiedad:", e);
    } finally {
      setIsSubmitting(false);
      setAcceptDialogOpen(false);
      setUserToAccept(null);
    }
  };

  const [reason, setReason] = useState<string>("");

  // Handle property rejection
  const handleRejectClick = (permission: UserSellerPermissions) => {
    setUserToReject(permission);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async (id: string) => {
    setIsSubmitting(true);
    try {
      const sent = await rejectPermissionSeller(id, reason);
      if (sent) {
        setUsers((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error("No se pudo enviar el email de rechazo");
      }
    } catch (e) {
      console.error("Error al rechazar la propiedad:", e);
    } finally {
      setIsSubmitting(false);
      setRejectDialogOpen(false);
      setUserToReject(null);
    }
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>{t("admin.users")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("admin.search_users")}
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
                  <TableHead>{t("user.name")}</TableHead>
                  <TableHead>{t("user.email")}</TableHead>
                  <TableHead className="hidden md:table-cell">
                    {t("user.location")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("admin.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium capitalize">
                      {permission.user.name}
                    </TableCell>
                    <TableCell>{permission.user.email}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {permission.user.city} / {permission.user.neighborhood}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-gray-700"
                        >
                          <Link href={`/user/${permission.user.user_id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAcceptClick(permission)}
                          className="h-8 w-8 text-green-500 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRejectClick(permission)}
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Accept Property Dialog */}
      {userToAccept && (
        <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("admin.confirm_approve")}</DialogTitle>
              <DialogDescription>
                {t("admin.sure_approve_seller", {
                  userName: userToAccept.user.name,
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
                onClick={() => handleAcceptConfirm(userToAccept.id)}
                disabled={isSubmitting}
              >
                {isSubmitting ? t("admin.approving") : t("admin.approve")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Property Dialog */}
      {userToReject && (
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("admin.confirm_reject")}</DialogTitle>
              <DialogDescription>
                {t("admin.sure_reject_seller", {
                  userName: userToReject.user.name,
                })}
              </DialogDescription>
              <label htmlFor="reason">{t("admin.reason")}</label>
              <Input
                placeholder={t("admin.reason_placeholder")}
                id="reason"
                className="mt-2"
                value={reason}
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
                onClick={() => handleRejectConfirm(userToReject.id)}
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
