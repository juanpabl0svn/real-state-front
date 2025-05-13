"use client";

import { useState } from "react";
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

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAppStore } from "@/stores/app-store";
import Notifications from "./notifications";
import LocaleSwitcher from "./local-switcher";

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
      roles: [],
    },
    {
      label: t("sellers"),
      href: "/sellers",
      icon: <Home className="h-4 w-4 mr-2" />,
      needsAuth: false,
      roles: [],
    },
    {
      label: t("my_properties"),
      href: "/properties",
      icon: <Search className="h-4 w-4 mr-2" />,
      needsAuth: true,
      roles: ["admin", "seller"],
    },
    {
      label: "Admin",
      href: "/admin",
      icon: <UserCog className="h-4 w-4 mr-2" />,
      needsAuth: true,
      roles: ["admin"],
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
                (!item.roles.includes(data?.user?.role!) &&
                  item.roles.length > 0)
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
          <LocaleSwitcher />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4 px-3">
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
              <div className="flex items-center justify-between">
                <LocaleSwitcher />
              </div>
            </nav>

            <div className="flex items-center justify-between pt-4 border-t px-4">
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
                  <p className="text-sm font-medium">{data?.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {data?.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Notifications />

                <Link href="/settings" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="icon">
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
