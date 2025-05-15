"use client";

import LoginForm from "@/components/login-form";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {t("login_with_your_account")}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t("o")}{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/90"
            >
              {t("create_a_new_account")}
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
