import { auth } from '@/auth';
import { prisma } from '@/prisma';

export async function POST(request: Request) {

  const session = await auth()

  if (!session || !session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const data = await request.json();
    const property = await prisma.properties.upsert({
      where: { id: data.id },
      create: {
        ...data,
        owner_id: session?.user?.id,
      },
      update: {
        ...data,
      },
    });
    return new Response(JSON.stringify(property), { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    return new Response(JSON.stringify({ error: "Failed to create property" }), { status: 500 });
  }
}

