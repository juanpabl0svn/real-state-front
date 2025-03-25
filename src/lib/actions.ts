"use server"

import { revalidatePath } from "next/cache"
import { Property } from "./types"

import { z } from "zod"

// Mock user ID for demonstration purposes
// In a real application, you would get this from authentication
const MOCK_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

// Fetch all properties for the current user
export async function fetchProperties(): Promise<Property[]> {
  try {
    // In a real application, you would query your database here
    // For example with Supabase:
    // const { data, error } = await supabase
    //   .from('properties')
    //   .select('*')
    //   .eq('owner_id', userId)
    //   .eq('is_deleted', false);

    // For demonstration, we'll return mock data
    return [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        owner_id: MOCK_USER_ID,
        title: "Modern Downtown Apartment",
        description: "A beautiful apartment in the heart of downtown.",
        price: 250000.0,
        location: "Downtown, City",
        area: 1200.5,
        bedrooms: 2,
        bathrooms: 2,
        parking_spaces: 1,
        property_type: "apartment",
        status: "available",
        is_deleted: false,
        is_sold: false,
        is_approved: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "223e4567-e89b-12d3-a456-426614174001",
        owner_id: MOCK_USER_ID,
        title: "Suburban Family Home",
        description: "Spacious family home with a large backyard.",
        price: 450000.0,
        location: "Suburbia, City",
        area: 2500.0,
        bedrooms: 4,
        bathrooms: 3,
        parking_spaces: 2,
        property_type: "house",
        status: "available",
        is_deleted: false,
        is_sold: false,
        is_approved: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "323e4567-e89b-12d3-a456-426614174002",
        owner_id: MOCK_USER_ID,
        title: "Commercial Office Space",
        description: "Prime location office space for your business.",
        price: 350000.0,
        location: "Business District, City",
        area: 1800.0,
        bedrooms: 0,
        bathrooms: 2,
        parking_spaces: 5,
        property_type: "office",
        status: "reserved",
        is_deleted: false,
        is_sold: false,
        is_approved: true,
        created_at: new Date().toISOString(),
      },
    ]
  } catch (error) {
    console.error("Error fetching properties:", error)
    throw new Error("Failed to fetch properties")
  }
}

// Create a new property
export async function createProperty(_propertyData: Property) {
  try {
    console.log("createProperty", _propertyData)
    // In a real application, you would insert into your database here
    // For example with Supabase:
    // const { data, error } = await supabase
    //   .from('properties')
    //   .insert({
    //     ...propertyData,
    //     owner_id: userId,
    //     created_at: new Date().toISOString()
    //   })
    //   .select();

    // For demonstration, we'll just wait a bit to simulate a database operation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Revalidate the properties page to show the new data
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error creating property:", error)
    throw new Error("Failed to create property")
  }
}

// Update an existing property
export async function updateProperty(_id: string, _propertyData: Property) {
  try {

    console.log("updateProperty", _id, _propertyData)
    // In a real application, you would update your database here
    // For example with Supabase:
    // const { data, error } = await supabase
    //   .from('properties')
    //   .update(propertyData)
    //   .eq('id', id)
    //   .eq('owner_id', userId)
    //   .select();

    // For demonstration, we'll just wait a bit to simulate a database operation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Revalidate the properties page to show the updated data
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error updating property:", error)
    throw new Error("Failed to update property")
  }
}

// Delete a property (soft delete)
export async function deleteProperty(_id: string) {
  try {
    console.log("deleteProperty", _id)
    // In a real application, you would update your database here
    // For example with Supabase:
    // const { data, error } = await supabase
    //   .from('properties')
    //   .update({ is_deleted: true })
    //   .eq('id', id)
    //   .eq('owner_id', userId);

    // For demonstration, we'll just wait a bit to simulate a database operation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Revalidate the properties page to show the updated data
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error deleting property:", error)
    throw new Error("Failed to delete property")
  }
}


// Define the schema for validation
const UserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  phone: z.string().optional(),
})

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
    // Here you would connect to your database and insert the user
    // This is a placeholder for the actual database insertion
    console.log("Registering user:", { name, email, phone })

    // Example of how you might insert into your PostgreSQL database:
    // const user = await db.query(
    //   `INSERT INTO users (name, email, password, phone, auth_method)
    //    VALUES ($1, $2, $3, $4, 'email')
    //    RETURNING id`,
    //   [name, email, await hashPassword(password), phone]
    // )

    // For demonstration purposes, we'll just simulate a successful registration
    return { success: true, message: "User registered successfully" }
  } catch (error) {
    console.error("Error registering user:", error)
    throw new Error("Failed to register user. Please try again.")
  }
}

// This function would be used to hash the password before storing it
async function hashPassword(password?: string): Promise<string | null> {
  if (!password) return null

  // In a real application, you would use a library like bcrypt
  // For example: return await bcrypt.hash(password, 10)

  // This is just a placeholder
  return `hashed_${password}`
}