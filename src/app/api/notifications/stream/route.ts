import { auth } from "@/auth";
import { secret } from "@/lib/utils";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";

const CLIENTS = new Map<string, (data: any) => void>();


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



export async function POST(req: Request) {

  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token || token !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const userId = body.user_id;

  const notification = await prisma.notifications.create({
    data: {
      ...body,
    },
  })

  if (CLIENTS.has(userId)) {
    const client = CLIENTS.get(userId);
    if (client) {
      client(JSON.stringify(notification));
    }
  }

  return new Response(JSON.stringify(notification), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}


export const dynamic = "force-dynamic";
