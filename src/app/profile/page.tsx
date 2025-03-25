import UserProfile from "@/components/user-profile";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user){
    return redirect('/')
  }

  return <UserProfile user={session?.user} />;
}
