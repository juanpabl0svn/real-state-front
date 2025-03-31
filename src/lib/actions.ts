"use server"

import { revalidatePath } from "next/cache"
import type { Paginate, Property, PropertyTypes } from "../types"

import { auth } from "@/auth"
import { perPage, prisma } from "@/prisma"
import { UserSchema, formSchema } from "./zod"
import { hashPassword } from "./utils"
import { sendOtpEmail } from "@/nodemailer"

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
        user_id: session.user.id!,
        is_deleted: false
      },
      skip: (page - 1) * perPage,
      take: perPage
    })

    const totalProperties = await prisma.properties.count({
      where: {
        user_id: session.user.id!,
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
    return {
      data: [],
      page: 1,
      per_page: 0,
      total: 0,
      total_pages: 0
    }
  }
}

// Create a new property
export async function createProperty(formData: {
  title: string;
  description?: string;
  price: number;
  location: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking_spaces?: number;
  property_type: string;
  status?: string;
}) {

  try {

    const session = await auth();


    if (!session?.user) {
      throw new Error("User not authenticated or missing ID");
    }

    const user = await prisma.users.findFirst({
      where: { user_id: session.user.user_id },
    });

    if (!user) {
      throw new Error("User does not exist in the database");
    }

    const validatedFields = formSchema.safeParse(formData);

    if (!validatedFields.success) {
      throw new Error("Invalid form data. Please check your inputs.");
    }

    const property = await prisma.properties.create({
      data: {
        user_id: user.user_id,
        ...validatedFields.data,
      },
    });

    return {
      error: false,
      message: "Property created successfully",
      property_id: property.id,
    };
  } catch (error) {
    console.error("Error creating property:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to create property",
    };
  }
}

// Update an existing property
export async function updateProperty(id: string, propertyData: Property) {
  try {

    await prisma.properties.update({
      where: {
        id,
        user_id: propertyData.user_id
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
  validatedFields.data.password = hashPassword(validatedFields.data.password!)

  const existingUser = await prisma.users.findFirst({
    where: {
      email: validatedFields.data.email,
      is_verified: true
    }
  })

  if (existingUser) {
    throw new Error("User with this email already exists.")
  }

  const { name, email, password, phone } = validatedFields.data

  const expires_at = new Date(Date.now() + 10 * 60 * 1000)

  const code = Math.floor(100000 + Math.random() * 900000).toString()

  try {
    const user = await prisma.$transaction(async (prisma) => {
      const newUser = await prisma.users.create({
        data: {
          name,
          email,
          password,
          phone,
          role: "user"
        }
      })


      await prisma.otp_codes.create({
        data: {
          user_id: newUser.user_id,
          expires_at,
          code
        }
      })

      return newUser
    })

    sendOtpEmail(email, code)

    return { error: false, message: "User registered successfully", user_id: user.user_id }
  } catch (error) {
    console.error("Error registering user:", error)
    return {
      error: true,
      message: error instanceof Error ? error.message : "Failed to register user"
    }
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
    return {
      data: [],
      page: 1,
      per_page: 0,
      total: 0,
      total_pages: 0
    }
  }
}


export async function getPropertyById(id: string): Promise<Property | null> {
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
    return null
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
    return {
      data: [],
      page: 1,
      per_page: 0,
      total: 0,
      total_pages: 0
    }
  }

}


export async function verifyOtp(user_id: string, code: string) {
  try {

    const otpRecord = await prisma.otp_codes.findFirst({
      where: {
        user_id,
        code
      }
    })


    if (!otpRecord) {
      throw new Error("Invalid or expired OTP code")
    }

    await Promise.all([
      prisma.otp_codes.update({
        where: {
          id: otpRecord.id
        },
        data: {
          is_used: true
        }
      }),
      prisma.users.update({
        where: {
          user_id: user_id
        },
        data: {
          is_verified: true
        }
      })
    ])

    return { error: false, message: "OTP verified successfully" }
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return {
      error: true,
      message: error instanceof Error ? error.message : "Failed to verify OTP"
    }
  }
}