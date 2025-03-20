import { auth } from "@/lib/auth";

export default async function ProfilePage() {

  const session = await auth()

  console.log(session)

  return (
    <div>
      <h1>Profile Page</h1>
    </div>
  );
}
