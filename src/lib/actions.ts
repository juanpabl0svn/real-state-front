"use server"

import { revalidatePath } from "next/cache"
import type { Paginate, Property, PropertyTypes } from "../types"

import { auth } from "@/auth"
import { perPage, prisma } from "@/prisma"
import { UserSchema } from "./zod"

// Fetch all properties for the current user
export async function fetchProperties(): Promise<Paginate<Property>> {
  try {
    const session = await auth()

    if (!session?.user) {
      throw new Error("User not authenticated")
    }

    const page = 1 // Default page number, you can pass this as a parameter


    const properties = await prisma.properties.findMany({
      where: {
        owner_id: session.user.id!,
        is_deleted: false
      },
      skip: (page - 1) * perPage,
      take: perPage
    })

    const totalProperties = await prisma.properties.count({
      where: {
        owner_id: session.user.id!,
        is_deleted: false
      }
    })

    return {
      data: properties,
      page,
      per_page: perPage,
      total: totalProperties,
      total_pages: Math.ceil(totalProperties / perPage)
    }
  } catch (error) {
    console.error("Error fetching properties:", error)
    throw new Error("Failed to fetch properties")
  }
}

// Create a new property
export async function createProperty(data: Property) {
  try {

    await prisma.properties.create({
      data
    })

    // Revalidate the properties page to show the new data
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error creating property:", error)
    throw new Error("Failed to create property")
  }
}

// Update an existing property
export async function updateProperty(id: string, propertyData: Property) {
  try {

    await prisma.properties.update({
      where: {
        id,
        owner_id: propertyData.owner_id
      },
      data: propertyData
    })

    // Revalidate the properties page to show the updated data
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error updating property:", error)
    throw new Error("Failed to update property")
  }
}

// Delete a property (soft delete)
export async function deleteProperty(id: string) {
  try {

    await prisma.properties.update({
      where: {
        id
      },
      data: {
        is_deleted: true
      }
    })

    // Revalidate the properties page to show the updated data
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error deleting property:", error)
    throw new Error("Failed to delete property")
  }
}


export async function registerUser(formData: {
  name: string
  email: string
  password?: string
  phone?: string
}) {
  // Validate the form data
  const validatedFields = UserSchema.safeParse(formData)

  if (!validatedFields.success) {
    throw new Error("Invalid form data. Please check your inputs.")
  }

  const { name, email, password, phone } = validatedFields.data

  try {

    await prisma.users.create({
      data: {
        name,
        email,
        password,
        phone,
        role: "user"
      }
    })

    return { success: true, message: "User registered successfully" }
  } catch (error) {
    console.error("Error registering user:", error)
    throw new Error("Failed to register user. Please try again.")
  }
}



export async function getFilteredProperties(filter: {
  status?: string
  type?: PropertyTypes
  minPrice?: number
  maxPrice?: number
}): Promise<Paginate<Property>> {
  try {

    const page = 1


    const properties = await prisma.properties.findMany({
      where: {
        status: filter.status,
        property_type: filter.type,
        price: {
          gte: filter.minPrice,
          lte: filter.maxPrice
        }
      },
      skip: (page - 1) * perPage,
      take: perPage
    })

    return {
      data: properties,
      page: 1,
      per_page: properties.length,
      total: properties.length,
      total_pages: 1
    }
  } catch (error) {
    console.error("Error fetching filtered properties:", error)
    throw new Error("Failed to fetch filtered properties")
  }
}


export async function getPropertyById(id: string): Promise<Property> {
  try {

    const property = await prisma.properties.findUnique({
      where: {
        id
      }
    })

    if (!property) {
      throw new Error("Property not found")
    }

    return property;
  } catch (error) {
    console.error("Error fetching property:", error)
    throw new Error("Failed to fetch property")
  }
}


export async function getAllProperties(): Promise<Paginate<Property>> {
  try {

    const properties = await prisma.properties.findMany({
      where: {
        is_deleted: false
      }
    })

    return {
      data: properties,
      page: 1,
      per_page: properties.length,
      total: properties.length,
      total_pages: 1
    }
  } catch (error) {
    console.error("Error fetching properties:", error)
    throw new Error("Failed to fetch properties")
  }

}