"use client";

import { useAppStore } from "@/stores/app-store";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const getTimeAgo = (dateString: string) => {
  console.log(dateString);
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";

  return Math.floor(seconds) + " seconds ago";
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "message":
      return <div className="h-2 w-2 rounded-full bg-blue-500" />;
    case "alert":
      return <div className="h-2 w-2 rounded-full bg-yellow-500" />;
    case "system":
      return <div className="h-2 w-2 rounded-full bg-green-500" />;
    default:
      return <div className="h-2 w-2 rounded-full bg-gray-500" />;
  }
};

export default function Notifications() {
  const { notifications, setNotifications } = useAppStore();

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/notifications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setNotifications(data);
    })();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource("/api/notifications/stream");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!data) return;
      setNotifications((prev) => [data, ...prev]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, is_read: true }
          : notification
      )
    );
    toast.success("Notification marked as read", {
      duration: 2000,
    });
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, is_read: true }))
    );
    toast.success("Notification marked as read", {
      duration: 2000,
    });
  };

  const unreadCount = notifications?.filter?.((n) => !n.is_read)?.length ?? 0;

  return (
    <>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-8"
              >
                Mark all as read
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id + Math.random()}
                className={cn(
                  "flex items-start p-3 cursor-default",
                  !notification.is_read && "bg-muted/50"
                )}
                onSelect={(e) => e.preventDefault()}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="mt-1.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p
                      className={cn(
                        "text-sm",
                        !notification.is_read && "font-medium"
                      )}
                    >
                      {notification.data.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getTimeAgo(notification.created_at)}
                    </p>
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
    </>
  );
}
