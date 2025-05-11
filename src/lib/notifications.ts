
import { NotificationTypeVariants } from "@/types";
import { API_URL, secret } from "./utils";

export const sendNotification = async (userId: string, { type, data }: NotificationTypeVariants) => {

  try {

    await fetch(`${API_URL}/notifications/stream`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, type, data }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`,
      },
    })

  } catch (error) {
    console.error("Error sending notification:", error);
    return null
  }
}
