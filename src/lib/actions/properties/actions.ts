"use server"

import { revalidatePath } from "next/cache"
import type { FilterOptions, IPropertyForm, Paginate, Property, GetPropertiesOptions, GetPropertiesResult, PropertyTypeCount, User } from "../../../types"

import { auth } from "@/auth"
import { perPage, prisma } from "@/prisma"
import { userSchema, propertySchema } from "../../zod"
import { generateExpirationDate, generateRandomCode, hashPassword } from "../../utils"
import { sendEmail, sendOtpEmail, sendPropertyApprovedEmail, sendPropertyRejectedEmail } from "@/nodemailer"
import { deleteImageFromKey, uploadImageFromFile } from "@/S3"
import { v4 as uuidv4 } from 'uuid';
import { sendNotification } from "../../notifications"

export async function getPropertiesByUserId(
    userId: string,
    options: GetPropertiesOptions = {}
): Promise<GetPropertiesResult> {
    const {
        includeProperties,
        includeTotalCount,
        includeTypeCounts,
        includeTopTypes,
    } = options

    const hasAnyOption =
        includeProperties !== undefined ||
        includeTotalCount !== undefined ||
        includeTypeCounts !== undefined ||
        includeTopTypes !== undefined

    const fetchProperties = hasAnyOption ? !!includeProperties : true
    const fetchTotalCount = hasAnyOption ? !!includeTotalCount : false
    const fetchTypeCounts = hasAnyOption ? !!includeTypeCounts : false
    const fetchTopTypes = hasAnyOption ? !!includeTopTypes : false

    try {
        const [properties, totalCount, grouped] = await Promise.all([
            fetchProperties
                ? prisma.properties.findMany({
                    where: { user_id: userId },
                    include: { photos: true },
                })
                : Promise.resolve(undefined),

            fetchTotalCount
                ? prisma.properties.count({ where: { user_id: userId } })
                : Promise.resolve(undefined),

            (fetchTypeCounts || fetchTopTypes)
                ? prisma.properties.groupBy({
                    by: ["property_type"],
                    where: { user_id: userId },
                    _count: { _all: true },
                })
                : Promise.resolve(undefined),
        ])

        const typeCounts = grouped
            ? grouped.map(g => ({ type: g.property_type, count: g._count._all }))
            : undefined

        let topTypes: PropertyTypeCount[] | undefined
        if (fetchTopTypes && typeCounts) {
            const maxCount = Math.max(...typeCounts.map(tc => tc.count))
            topTypes = typeCounts.filter(tc => tc.count === maxCount)
        }

        return {
            properties,
            totalCount,
            typeCounts,
            topTypes,
        }
    } catch (error) {
        console.error("Error fetching properties for user:", error)
        return {}
    }
}