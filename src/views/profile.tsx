import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Mail, Phone, Calendar, Shield, Key } from "lucide-react";


export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-6 w-6" />
          {session.user.name}
        </CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              {session.user.email}
              {/* {session.user.is_verified && ( */}
              <Badge
                variant="outline"
                className="ml-2 bg-green-50 text-green-700 border-green-200"
              >
                Verified
              </Badge>
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {/* {session.user.phone || "Not provided"} */}
              Not provided
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <p className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {/* <Badge variant={session.user.role === "admin" ? "default" : "secondary"}>
                {session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}
              </Badge> */}

              <Badge variant={"default"}>Admin</Badge>
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Authentication Method
            </p>
            <p className="flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              {/* {session.user.auth_method === "email"
                ? "Email & Password"
                : "OAuth Provider"} */}
              Email
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Member Since
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {/* {formatDate(session.user.created_at)} */}
              {formatDate("2025-03-20")}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link href="/reset-password">
          <Button>Reset Password</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
