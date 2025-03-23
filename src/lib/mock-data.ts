export type User = {
  id: string
  name: string
  email: string
  password: string // This would normally not be exposed
  phone: string | null
  role: "admin" | "user"
  auth_method: "email" | "oauth"
  is_verified: boolean
  created_at: string
}

// Mock user data
export const mockUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "John Doe",
  email: "john.doe@example.com",
  password: "hashed_password_would_be_here",
  phone: "+1 (555) 123-4567",
  role: "user",
  auth_method: "email",
  is_verified: true,
  created_at: "2023-01-15T08:30:00Z",
}

