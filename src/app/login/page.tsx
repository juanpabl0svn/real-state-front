import LoginForm from "@/components/login-form"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  // Verificar si el usuario ya está autenticado
  const session = await auth()

  // Si ya está autenticado, redirigir al dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inicia sesión en tu cuenta</h1>
          <p className="mt-2 text-sm text-gray-600">
            O{" "}
            <a href="/register" className="font-medium text-primary hover:text-primary/90">
              crea una nueva cuenta
            </a>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

