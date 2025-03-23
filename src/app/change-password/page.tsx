import { redirect } from "next/navigation"
import PasswordForm from "@/components/password-form"
import { supabase } from "@/lib/supabase"

export default async function ChangePasswordPage() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Change Password</h1>
      <PasswordForm userId={session.user.id} />
    </main>
  )
}

