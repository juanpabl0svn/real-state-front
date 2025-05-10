import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { CLIENTS } from "@/lib/notifications";

export async function GET(req: NextRequest) {

  const session = await auth()

  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user.user_id!;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      CLIENTS.set(userId, send);

      const keepAlive = setInterval(() => {
        controller.enqueue(`:\n\n`);
      }, 15000);

      req.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        CLIENTS.delete(userId);
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

