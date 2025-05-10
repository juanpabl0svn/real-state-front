import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function GET() {

  const session = await auth()
  if (!session) return new Response("Unauthorized", { status: 401 });


  const userId = session.user.user_id!;

  const notifications = await prisma.notifications.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
  })

  return new Response(JSON.stringify(notifications), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });


}