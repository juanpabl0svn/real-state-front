"use client";

import { useState, useEffect } from "react";
import { Bell, Settings, Home, Search, Menu, X, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { signOut, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAppStore } from "@/stores/app-store";
import Notifications from "./notifications";

// This would typically come from your API
interface Notification {
  id: string;
  user_id: string;
  type: string;
  data: any;
  is_read: boolean;
  created_at: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data } = useSession();

  const t = useTranslations("header");

  const { notifications } = useAppStore();

  const unreadCount = notifications?.filter?.((n) => !n.is_read)?.length ?? 0;

  const navItems = [
    {
      label: t("home"),
      href: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
      needsAuth: false,
      adminOnly: false,
    },
    {
      label: "My properties",
      href: "/properties",
      icon: <Search className="h-4 w-4 mr-2" />,
      needsAuth: true,
      adminOnly: false,
    },
    {
      label: "Admin",
      href: "/admin/properties",
      icon: <UserCog className="h-4 w-4 mr-2" />,
      needsAuth: true,
      adminOnly: true,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/vivea.png" alt="logo" className="h-7" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 ml-6">
            {navItems.map((item) => {
              if (
                (item.needsAuth && !data?.user) ||
                (item.adminOnly && data?.user?.role !== "admin")
              ) {
                return null;
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {data?.user ? (
            <>
              {/* Notifications */}
              <Notifications />

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      {data?.user?.image ? (
                        <AvatarImage src={data.user.image} alt="User" />
                      ) : (
                        <AvatarFallback>
                          {data?.user.name![0].toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{data.user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/settings" className="flex w-full">
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/logout" className="flex w-full">
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  {data?.user?.image ? (
                    <AvatarImage src={data.user.image} alt="User" />
                  ) : (
                    <AvatarFallback>
                      {data?.user.name![0].toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium">User Name</p>
                  <p className="text-xs text-muted-foreground">
                    {data?.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Open notifications in mobile view
                  }}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                <Link href="/settings">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
