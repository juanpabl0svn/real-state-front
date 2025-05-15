import { RegisterForm } from "@/components/register-form";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("auth");
  return (
    <div className="w-full flex h-screen items-center justify-center py-12">
      <div className="mx-auto w-full max-w-md space-y-6 py-12 mt-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t('create_an_account')}</h1>
          <p className="text-muted-foreground">
            {t('create_an_account_description')}
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
