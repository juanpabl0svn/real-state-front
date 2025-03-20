
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import LogoutButton from "@/components/logout-button"

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  console.log(session)

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Información del usuario</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Nombre:</span> {session.user?.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {session.user?.email}
          </p>
          <p>
            <span className="font-medium">ID:</span> {session.user?.id}
          </p>
        </div>
      </div>
    </div>
  )
}

