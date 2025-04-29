import { ForgotPasswordForm } from "@/components/forgot-password/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full flex h-screen items-center justify-center py-12">
      <div className="mx-auto w-full max-w-md space-y-6 py-12 mt-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Olvidar Contraseña</h1>
          <p className="text-muted-foreground">
            Ingresa tu correo electónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
