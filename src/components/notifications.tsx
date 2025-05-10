"use client";

import { useAppStore } from "@/stores/app-store";
import { ReactElement, useEffect } from "react";
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
import { Notification, NotificationTypes } from "@/types";
import { useTranslations } from "next-intl";

const Messages = (
  notification: Notification,
  t: ReturnType<typeof useTranslations>
) => {
  const { type, data } = notification;

  if (type === "property_approved") {
    return t("notifications.property_approved", {
      propertyId: data.property_id,
      propertyTitle: data.property_title,
    });
  }
  if (type === "property_rejected") {
    return t("notifications.property_rejected", {
      propertyId: data.property_id,
      propertyTitle: data.property_title,
      reason: data.reason,
    });
  }
  if (type === "consultancy_meeting_date_changed") {
    return t("notifications.consultancy_meeting_date_changed", {
      lastDate: data.last_date,
      newDate: data.new_date,
    });
  }
  if (type === "consultancy_created") {
    return t("notifications.consultancy_created", {
      consultancyName: data.consultancy_id,
      date: data.date,
    });
  }
};

const getTimeAgo = (dateString: string, t: ReturnType<typeof useTranslations>) => {

  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return <>{Math.floor(interval) + t("common.years_ago")}</>;

  interval = seconds / 2592000;
  if (interval > 1) return <>{Math.floor(interval) + t("common.months_ago")}</>;

  interval = seconds / 86400;
  if (interval > 1) return <>{Math.floor(interval) + t("common.days_ago")}</>;

  interval = seconds / 3600;
  if (interval > 1) return <>{Math.floor(interval) + t("common.hours_ago")}</>;

  interval = seconds / 60;
  if (interval > 1) return <>{Math.floor(interval) + t("common.minutes_ago")}</>;

  return <>{Math.floor(seconds) + t("seconds_ago")}</>;
};

const getNotificationIcon: Record<NotificationTypes, ReactElement> = {
  property_approved: <div className="h-2 w-2 rounded-full bg-green-500" />,
  property_rejected: <div className="h-2 w-2 rounded-full bg-red-500" />,
  consultancy_meeting_date_changed: (
    <div className="h-2 w-2 rounded-full bg-yellow-500" />
  ),
  consultancy_created: <div className="h-2 w-2 rounded-full bg-blue-500" />,
};

const Message = ({
  notification,
  markAsRead,
}: {
  notification: Notification;
  markAsRead: (id: string) => void;
}) => {
  const t = useTranslations();


  const Text = () => Messages(notification, t);

  const Icon = () => getNotificationIcon[notification.type];

  const Timer = () => getTimeAgo(notification.created_at, t);

  return (
    <div className="flex items-start gap-3 w-full">
      <div className="mt-1.5">
        <Icon />
      </div>
      <div className="flex-1 space-y-1">
        <p className={cn("text-sm", !notification.is_read && "font-medium")}>
          <Text />
        </p>
        <p className="text-xs text-muted-foreground">
          <Timer />
        </p>
      </div>
      {!notification.is_read && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs"
          onClick={() => markAsRead(notification.id)}
        >
          {t("notifications.mark_as_read")}
        </Button>
      )}
    </div>
  );
};

export default function Notifications() {
  const { notifications, setNotifications } = useAppStore();

  useEffect(() => {
    (async () => {
      // const res = await fetch("/api/notifications", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json",
      //   },
      // });
      // const data = await res.json();
      setNotifications([
        {
          ids: "0",
          type: "property_approved",
          data: {
            property_id: "0",
            property_title: "Test Property",
          },
          created_at: new Date().toISOString(),
          is_read: false,
        },
        {
          ids: "1",
          type: "property_rejected",
          data: {
            property_id: "1",
            property_title: "Test Property 2",
            reason: "Test reason",
          },
          created_at: new Date().toISOString(),
          is_read: false,
        },
        {
          ids: "2",
          type: "consultancy_meeting_date_changed",
          data: {
            consultancy_id: "2",
            consultancy_name: "Test Consultancy",
            new_date: new Date().toISOString(),
            last_date: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
          is_read: false,
        },
        {
          ids: "3",
          type: "consultancy_created",
          data: {
            consultancy_id: "3",
            consultancy_name: "Test Consultancy 2",
            date: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
          is_read: false,
        },
      ]);
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
                key={notification.id}
                className={cn(
                  "flex items-start p-3 cursor-default",
                  !notification.is_read && "bg-muted/50"
                )}
                onSelect={(e) => e.preventDefault()}
              >
                <Message notification={notification} markAsRead={markAsRead} />
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
