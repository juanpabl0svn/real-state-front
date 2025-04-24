import { z } from "zod"

const password = (name: string) => z.string({ required_error: `${name} is required` })
  .min(1, `${name} is required`)
  .min(8, `${name} must be at least 8 characters`)
  .max(50, `${name} must be at most 50 characters`)
  .regex(/[A-Z]/, `${name} must have at least one uppercase letter`)
  .regex(/[\W_]/, `${name} must have at least one special character`)
  .regex(/[0-9]/, `${name} must have at least one number`)


const name = z.string().min(2, {
  message: "Name must be at least 2 characters.",
})
  .max(50, {
    message: "Name must be at most 50 characters.",
  })
  .regex(/^[a-zA-Z\s]+$/, {
    message: "Name can only contain letters and spaces.",
  })


const phone = z.string().optional()

export const signInSchema = z.object({
  email: z.string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: password("Password"),
})

export const userSchema = z.object({
  name
  ,
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: password("Password"),
  phone,
});

export type UserFormSchema = z.infer<typeof userSchema>

export const propertySchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(255),
  description: z.string().optional(),
  price: z.coerce.number().int().positive({ message: "Price must be a positive number" }).min(100000, { message: "Price must be at least 100,000 COP" }),
  city: z.string().min(3, { message: "Location must be at least 3 characters" }).max(255),
  neighborhood: z.string().min(3, { message: "Neighborhood must be at least 3 characters" }).max(255),
  area: z.coerce.number().int().positive({ message: "Area must be a positive number" }),
  bedrooms: z.coerce.number().int().min(1, { message: "Bedrooms must be at least 1" }).max(200, { message: "Bedrooms cannot exceed 200" }),
  bathrooms: z.coerce.number().int().min(1, { message: "Bathrooms must be at least 1" }).max(200, { message: "Bathrooms cannot exceed 200" }),
  parking_spaces: z.coerce.number().int().min(0, { message: "Parking spaces cannot be negative" }).max(200, { message: "Parking spaces cannot exceed 200" }),
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

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
  password: password("Password"),
  confirmPassword: password("Confirm Password"),
})

export type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordSchema>


export const passwordFormSchema = z.object({
  currentPassword: password("Current Password"),
  newPassword: password("New Password"),
  confirmPassword: password("Confirm Password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
})


export type PasswordFormValues = z.infer<typeof passwordFormSchema>;


export const profileFormSchema = z.object({
  name,
  phone,
});


export type ProfileFormValues = z.infer<typeof profileFormSchema>;
