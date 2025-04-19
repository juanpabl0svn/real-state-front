import { z } from "zod"

export const signInSchema = z.object({
  email: z.string({ required_error: "Email is required" })
  .min(1, "Email is required")
  .email("Invalid email"),
  password: z.string({ required_error: "Password is required" })
  .min(1, "Password is required")
  .min(8, "Password must be more than 8 characters")
  .max(32, "Password must be less than 32 characters"),
})

export const userSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  phone: z.string().optional(),
});

export type UserFormSchema = z.infer<typeof userSchema> 

export const propertySchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(255),
  description: z.string().optional(),
  price: z.coerce.number().int().positive({ message: "Price must be a positive number" }),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }).max(255),
  area: z.coerce.number().int().positive({ message: "Area must be a positive number" }),
  bedrooms: z.coerce.number().int().min(1, { message: "Bedrooms must be at least 1" }),
  bathrooms: z.coerce.number().int().min(1, { message: "Bathrooms must be at least 1" }),
  parking_spaces: z.coerce.number().int().min(0, { message: "Parking spaces cannot be negative" }),
  property_type: z.enum(["house", "apartment", "land", "office"]),
  status: z.enum(["available", "sold", "reserved"]).optional(),
})

export type PropertyFormSchema = z.infer<typeof propertySchema>


export const otpSchema = z.object({
  otp: z.string().length(6, {
    message: "OTP must be exactly 6 characters long.",
  }),
})

export type OtpFormSchema = z.infer<typeof otpSchema>