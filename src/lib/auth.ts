import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { signInSchema } from "@/lib/zod"
import { ZodError } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          token: '123'
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Aquí deberías implementar tu lógica de verificación de credenciales
        // Este es un ejemplo básico, en producción deberías verificar contra tu base de datos
        if (credentials?.username === "usuario" && credentials?.password === "contraseña") {
          return {
            id: "1",
            name: "Usuario Demo",
            email: "usuario@ejemplo.com",
            token: '123'

          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login', // Error code passed in query string as ?error=
  }
})