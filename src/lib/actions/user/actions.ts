"use server"
import { auth } from "@/auth"
import { perPage, prisma } from "@/prisma"

import type { User, Paginate, users_seller_permissions } from "../../../types"


export async function getUserById(id: string): Promise<
    User | null
> {
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: id },
            include: {
                properties: true,
                consultancies: true,
                notifications: true,
                otp_codes: true,
                user_providers: true,
                users_seller_permissions: true,
            },
        })

        if (!user) {
            throw new Error('User not found')
        }

        // @ts-expect-error
        delete user.password

        return user
    } catch (error) {
        console.error('Error fetching user:', error)
        return null
    }
}


export async function fetchSellers(
    page: number = 1
): Promise<Paginate<User & { users_seller_permissions: users_seller_permissions[] }>> {
    try {
        const sellers = await prisma.users.findMany({
            where: {
                role: "seller",
                users_seller_permissions: {
                    some: {}
                }
            },
            select: {
                user_id: true,
                name: true,
                email: true,
                image: true,
                phone: true,
                role: true,
                city: true,
                neighborhood: true,
                is_verified: true,
                created_at: true,
                users_seller_permissions: true
            },
            skip: (page - 1) * perPage,
            take: perPage
        })

        const total = await prisma.users.count({
            where: {
                role: "seller",
                users_seller_permissions: {
                    some: {}
                }
            }
        })

        return {
            data: sellers,
            page,
            per_page: perPage,
            total,
            total_pages: Math.ceil(total / perPage)
        }
    } catch (error) {
        console.error('Error fetching sellers:', error)
        return {
            data: [],
            page,
            per_page: perPage,
            total: 0,
            total_pages: 0
        }
    }
}

export async function getFavoriteSellers(userId: string) {
    const user = await prisma.users.findUnique({
        where: { user_id: userId },
        select: { favoriteSellersId: true },
    })
    if (!user) {
        throw new Error("User not found")
    }

    const favIds = user.favoriteSellersId
    if (favIds.length === 0) {
        return []
    }

    // 2) Trae los usuarios cuyo user_id esté en ese array
    return prisma.users.findMany({
        where: {
            user_id: { in: favIds },
        },
        // Opcional: aquí puedes seleccionar solo los campos que necesites
        select: {
            user_id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
            city: true,
            neighborhood: true,
            role: true,
            created_at: true,
        },
    })
}

export async function addFavoriteSellerOnce(
    userId: string,
    sellerId: string
) {
    const user = await prisma.users.findUnique({
        where: { user_id: userId },
        select: { favoriteSellersId: true },
    })
    if (!user) throw new Error('User not found')
    if (user.favoriteSellersId.includes(sellerId)) {
        return user
    }
    return prisma.users.update({
        where: { user_id: userId },
        data: {
            favoriteSellersId: {
                set: [...user.favoriteSellersId, sellerId],
            },
        },
    })
}

export async function removeFavoriteSeller(
    userId: string,
    sellerId: string
) {
    const user = await prisma.users.findUnique({
        where: { user_id: userId },
        select: { favoriteSellersId: true },
    })
    if (!user) throw new Error("User not found")

    if (!user.favoriteSellersId.includes(sellerId)) {
        return user
    }
    const news = user.favoriteSellersId.filter((id) => id !== sellerId)
    return prisma.users.update({
        where: { user_id: userId },
        data: {
            favoriteSellersId: {
                set: news,
            },
        },
    })
}