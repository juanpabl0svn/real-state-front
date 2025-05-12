import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "@/components/settings/profile";
import { PasswordForm } from "@/components/settings/password-form";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  askForPermissionSeller,
  getUserSellerPermissionResponse,
} from "@/lib/actions";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const session = useSession();

  const [petitionPending, setPetitionPending] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await getUserSellerPermissionResponse();
      if (response.error) return;
      if (!response.data) {
        setPetitionPending(false);
        return;
      }
      setPetitionPending(response.data.response == "waiting");
    })();
  }, []);

  const askForPermission = async () => {
    setPetitionPending(true);
    await askForPermissionSeller();
    toast.success(
      "Tu solicitud ha sido enviada, por favor espera la respuesta del administrador"
    );
  };

  const text = petitionPending
    ? "Estas en revision para ser vendedor"
    : "Solicitar ser vendedor";

  return (
    <div className="w-3/4 mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configuración de Usuario</h1>
        <p className="text-muted-foreground">
          Administra tu información personal y configuración de seguridad
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="password">Contraseña</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información personal y detalles de contacto
                <br />
                {session.data?.user?.role !== "seller" && (
                  <Button
                    disabled={petitionPending}
                    onClick={askForPermission}
                    className="mt-4"
                  >
                    {text}
                  </Button>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>
                Actualiza tu contraseña para mantener tu cuenta segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
