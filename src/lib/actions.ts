"use server"

import { revalidatePath } from "next/cache"
import type { IPropertyForm, Paginate, Property, PropertyTypes, ReturnTypeHandler } from "../types"

import { auth } from "@/auth"
import { perPage, prisma } from "@/prisma"
import { userSchema, propertySchema } from "./zod"
import { generateExpirationDate, generateRandomCode, hashPassword } from "./utils"
import { sendOtpEmail } from "@/nodemailer"
import { deleteImageFromKey, uploadImageFromFile } from "@/S3"
import { v4 as uuidv4 } from 'uuid';

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
        user_id: session.user.user_id!,
        is_deleted: false
      },
      skip: (page - 1) * perPage,
      take: perPage
    })

    const totalProperties = await prisma.properties.count({
      where: {
        user_id: session.user.user_id!,
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


// export async function editProperty(id: string, property: Property): Promise<Property | null> {

//   return null
// }

// Create a new property
export async function createProperty(formData: IPropertyForm): Promise<ReturnTypeHandler> {

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

    const validatedFields = propertySchema.safeParse(formData);

    if (!validatedFields.success) {
      throw new Error("Invalid form data. Please check your inputs.");
    }

    const [mainPhoto, photos] = await Promise.all([
      uploadImage(formData.main_photo![0] as File, "properties"),
      Promise.all(
        formData.photos?.map((photo) =>
          uploadImage(photo as File, 'properties')
        )
      ),
    ]);

    const property = await prisma.properties.create({
      data: {
        user_id: user.user_id,
        ...validatedFields.data,
        main_photo: mainPhoto.data,
        photos: {
          create: photos
            .filter((photo) => photo.data !== undefined)
            .map((photo) => ({
              url: photo.data as string,
            })),
        },
      },
    });

    return {
      error: false,
      message: "Property created successfully",
      data: property.id,
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
export async function updateProperty(id: string, propertyData: IPropertyForm): Promise<ReturnTypeHandler> {
  try {

    const {
      photos,
      ...property
    } = propertyData

    if (typeof propertyData.main_photo === "object") {
      const mainPhoto = await uploadImage(propertyData.main_photo[0] as File, "properties")

      property.main_photo = [mainPhoto.data!] as string[]
    }

    await prisma.properties.update({
      where: {
        id,
        user_id: property.user_id
      },
      data: {
        ...property,
        main_photo: property.main_photo[0] as string,
      }
    })

    const existingPhotos = await prisma.photos.findMany({
      where: { property_id: id },
    });


    const photosToDelete = existingPhotos.filter(
      existingPhoto => !photos.includes(existingPhoto.url)
    );

    // Delete photos that are no longer present
    await prisma.photos.deleteMany({
      where: {
        id: { in: photosToDelete.map((photo) => photo.id) },
      },
    });

    for (const photo of photosToDelete) {
      const key = photo.url.split("/").pop()!;
      const bucket = "properties"
      await deleteImageFromKey(key, bucket)
    }

    // Upload new photos and prepare them for insertion
    const newImages = await Promise.all(
      photos
        .filter(photo => typeof photo == 'object')
        .map(async (photo) => {
          const image = await uploadImage(photo as File, "properties");
          return { url: image.data as string };
        })
    );

    // Insert new photos into the database
    await prisma.photos.createMany({
      data: newImages.map((image) => ({
        property_id: id,
        url: image.url,
      })),
    });

    return { error: false, message: "Property updated successfully", data: property };
  } catch (error) {
    console.error("Error updating property:", error)
    return {
      error: true,
      message: error instanceof Error ? error.message : "Failed to update property"
    }
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
  const validatedFields = userSchema.safeParse(formData)

  if (!validatedFields.success) {
    throw new Error("Invalid form data. Please check your inputs.")
  }
  formData.password = hashPassword(formData.password!)

  const existingUser = await prisma.users.findFirst({
    where: {
      email: formData.email,
      is_verified: true
    }
  })

  if (existingUser) {
    throw new Error("User with this email already exists.")
  }

  const { name, email, password, phone } = formData

  const code = generateRandomCode()

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
          expires_at: generateExpirationDate(),
          code,
          type: 'register'
        }
      })

      return newUser
    })

    await sendOtpEmail(email, code)

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


export async function getPhotosFromPropertyId(propertyId: string): Promise<string[]> {
  try {
    const photos = await prisma.photos.findMany({
      where: {
        property_id: propertyId
      }
    })

    if (!photos) {
      throw new Error("No photos found for this property")
    }

    return photos.map(photo => photo.url)
  } catch (e) {
    console.error("Error fetching photos:", e)
    return []
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {

    const property = await prisma.properties.findUnique({
      where: {
        id
      },
      include: {
        photos: true
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


export async function verifyOtpPassword(email: string, code: string, newPassword: string) {

  try {

    const user = await prisma.users.findFirst({
      where: {
        email
      },
      include: {
        user_providers: true,
      }
    })

    if (!user || user.user_providers) {
      throw new Error("User not found")
    }

    const otpRecord = await prisma.otp_codes.findFirst({
      where: {
        code,
        type: 'forgot_password',
        user_id: user.user_id,
        expires_at: {
          gte: new Date()
        },
        is_used: false
      }
    })

    if (!otpRecord) {
      throw new Error("Invalid or expired OTP code")
    }

    await Promise.all([
      prisma.users.update({
        where: {
          user_id: user.user_id
        },
        data: {
          password: hashPassword(newPassword)
        }
      }),
      prisma.otp_codes.update({
        where: {
          id: otpRecord.id
        },
        data: {
          is_used: true
        }
      })
    ])

    return { error: false, message: "Contraseña restablecida correctamente" }

  } catch (e) {

    console.error("Error verifying OTP:", e)
    return {
      error: true,
      message: e instanceof Error ? e.message : "Failed to verify OTP"
    }

  }

}


export async function restorePassword(email: string): Promise<ReturnTypeHandler> {
  try {

    const user = await prisma.users.findFirst({
      where: {
        email
      },
      include: {
        user_providers: true,
      }
    })


    if (!user || user.user_providers) {
      throw new Error("User not found")
    }

    const code = generateRandomCode()

    await prisma.otp_codes.create({
      data: {
        user_id: user?.user_id!,
        expires_at: generateExpirationDate(),
        code,
        type: 'forgot_password'
      }
    })

    await sendOtpEmail(email, code)


    return {
      error: false,
      message: "A code has been sent to your email for verification.",
      data: null
    }

  } catch (e) {
    console.error("Error restoring password:", e)
    return {
      error: true,
      message: e instanceof Error ? e.message : "Failed to restore password"
    }

  }
}


export async function verifyOtp(user_id: string, code: string) {
  try {

    const otpRecord = await prisma.otp_codes.findFirst({
      where: {
        user_id,
        code,
        type: 'register',
        expires_at: {
          gte: new Date()
        },
        is_used: false
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


export async function uploadImage(file: File, bucket: string = 'properties') {
  try {

    const uuid = uuidv4()

    const result = await uploadImageFromFile(file, bucket, uuid)

    if (!result) {
      throw new Error("Failed to upload image")
    }

    return {
      error: false,
      message: 'Image uploaded successfully',
      data: result
    }

  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Failed to upload image',
    };
  }
};



export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const session = await auth()

    if (!session?.user) {
      throw new Error("User not authenticated")
    }

    const user = await prisma.users.findFirst({
      where: {
        user_id: session.user.user_id,
        password: hashPassword(currentPassword)
      }
    })

    if (!user) {
      throw new Error("Contraseña actual incorrecta")
    }

    await prisma.users.update({
      where: {
        user_id: session.user.user_id
      },
      data: {
        password: hashPassword(newPassword)
      }
    })

    return { error: false, message: "Password changed successfully" }
  } catch (error) {
    console.error("Error changing password:", error)
    return {
      error: true,
      message: error instanceof Error ? error.message : "Failed to change password"
    }
  }
}