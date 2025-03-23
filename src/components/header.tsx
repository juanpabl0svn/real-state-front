"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Settings, Home, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// This would typically come from your API
interface Notification {
  id: string
  user_id: string
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  is_read: boolean
  created_at: string
}

export default function Header() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toast } = useToast()

  // Simulate fetching notifications
  useEffect(() => {
    // This would be replaced with an actual API call
    const mockNotifications: Notification[] = [
      {
        id: "1",
        user_id: "user-123",
        type: "message",
        data: { message: "You have a new message from Alex", sender: "Alex" },
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      },
      {
        id: "2",
        user_id: "user-123",
        type: "alert",
        data: { message: "Your subscription will expire soon", level: "warning" },
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
      {
        id: "3",
        user_id: "user-123",
        type: "system",
        data: { message: "System maintenance scheduled for tomorrow" },
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
    ]

    setNotifications(mockNotifications)
  }, [])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, is_read: true } : notification)),
    )
    toast({
      title: "Notification marked as read",
      duration: 2000,
    })
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, is_read: true })))
    toast({
      title: "All notifications marked as read",
      duration: 2000,
    })
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + " years ago"

    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + " months ago"

    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " days ago"

    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " hours ago"

    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " minutes ago"

    return Math.floor(seconds) + " seconds ago"
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <div className="h-2 w-2 rounded-full bg-blue-500" />
      case "alert":
        return <div className="h-2 w-2 rounded-full bg-yellow-500" />
      case "system":
        return <div className="h-2 w-2 rounded-full bg-green-500" />
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500" />
    }
  }

  const navItems = [
    { label: "Home", href: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { label: "Explore", href: "/explore", icon: <Search className="h-4 w-4 mr-2" /> },
    { label: "Dashboard", href: "/dashboard", icon: null },
    { label: "Projects", href: "/projects", icon: null },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">AppName</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 ml-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center text-sm font-medium transition-colors hover:text-primary"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
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
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8">
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-4 text-center text-muted-foreground">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn("flex items-start p-3 cursor-default", !notification.is_read && "bg-muted/50")}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="mt-1.5">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <p className={cn("text-sm", !notification.is_read && "font-medium")}>
                          {notification.data.message}
                        </p>
                        <p className="text-xs text-muted-foreground">{getTimeAgo(notification.created_at)}</p>
                      </div>
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark read
                        </Button>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings/profile" className="flex w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings/account" className="flex w-full">
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings/notifications" className="flex w-full">
                  Notification Settings
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

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile" className="flex w-full">
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="flex w-full">
                  Settings
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
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">User Name</p>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => {
                    setIsMenuOpen(false)
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
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

