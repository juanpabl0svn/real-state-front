import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="container flex h-screen items-center justify-center py-12">
      <div className="mx-auto w-full max-w-md space-y-6 py-12 mt-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">Enter your information to get started</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}