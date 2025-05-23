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
import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const session = useSession();

  const t = useTranslations("settings");

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

  const text = petitionPending ? t("in_revision") : t("ask_seller_permission");

  return (
    <div className="w-3/4 mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("user_config")}</h1>
        <p className="text-muted-foreground">{t("user_info")}</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
          <TabsTrigger value="password">{t("password")}</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("personal_info")}</CardTitle>
              <CardDescription>
                {t("update_info")}
                <br />
                {session.data?.user?.role === "user" && (
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
              <CardTitle>{t("change_password")}</CardTitle>
              <CardDescription>{t("update_password")}</CardDescription>
            </CardHeader>
            <CardContent>
              {session.data?.user.has_provider ? (
                <p className="text-muted-foreground font-bold">
                  {t("has_provider")}{" "}
                </p>
              ) : (
                <PasswordForm />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
