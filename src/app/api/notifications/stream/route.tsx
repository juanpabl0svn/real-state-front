import { NextRequest } from "next/server";

// Simulador de eventos en memoria (en producción usarías una cola o db trigger)
const clients = new Map<string, (data: any) => void>();

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id"); // O usa cookies/session

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      // Guardamos el callback para este usuario
      clients.set(userId, send);

      req.signal.addEventListener("abort", () => {
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

