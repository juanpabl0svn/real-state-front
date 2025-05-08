import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { Notification as INotification } from "@/types";

const clients = new Map<string, (data: any) => void>();

export async function GET(req: NextRequest) {

  const session = await auth()

  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user.user_id!;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      clients.set(userId, send);

      const mockNotifications: INotification =
      {
        id: "1",
        user_id: "38cca713-07c5-4f56-b880-918e5c94a05c",
        type: "message",
        data: { message: "You have a new message from Alex", sender: "Alex" },
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      }
        ;

      setTimeout(() => {
        send(mockNotifications);
      }, 1000)


      const keepAlive = setInterval(() => {

        // Simulate fetching notifications
        // This would be replaced with an actual API call
        controller.enqueue(`:\n\n`);


      }, 15000);

      req.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        clients.delete(userId);
        controller.close();
      });
    },
  });


  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

