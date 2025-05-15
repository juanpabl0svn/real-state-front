"use server"
import type { GetPropertiesOptions, GetPropertiesResult, PropertyTypeCount } from "../../../types"

import { prisma } from "@/prisma"
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