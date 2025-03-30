import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

export const perPage = 10

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma