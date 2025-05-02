import { prisma } from "@/prisma";

(async () => {
  await prisma.social_media_providers.create({
    data: {
      id: 1,
      name: 'google',
    }
  })
})()