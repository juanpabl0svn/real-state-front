import { redirect } from "next/navigation"
import PasswordForm from "@/components/password-form"

export default async function ChangePasswordPage() {

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Change Password</h1>
      <PasswordForm userId={"123123123"} />
    </main>
  )
}

