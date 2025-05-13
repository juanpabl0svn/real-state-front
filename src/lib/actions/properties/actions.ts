"use server"

import { revalidatePath } from "next/cache"
import type { FilterOptions, IPropertyForm, Paginate, Property, ReturnTypeHandler, User } from "../../../types"

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
    options: { countOnly?: boolean } = {}
): Promise<number | Property[]> {
    const { countOnly = false } = options

    try {
        if (countOnly) {
            return await prisma.properties.count({
                where: { user_id: userId },
            })
        }

        // Devuelve las propiedades completas
        return await prisma.properties.findMany({
            where: { user_id: userId },
            include: { photos: true },
        })
    } catch (error) {
        console.error("Error fetching properties for user:", error)
        return countOnly ? 0 : []
    }
}