import UserProfile from "@/components/user-profile";
import { auth } from "@/lib/auth";

import { mockUser } from "@/lib/mock-data";

export default async function ProfilePage() {
  return <UserProfile user={mockUser} />;
}
